
import dayjs from "dayjs";
import _, { isNil } from "lodash";
import DayJsEx from "../../../frameworks/DayJsEx";
import NumberUtil from "../../../frameworks/NumberUtil";
import {ITProduction ,TProduction } from "./models/TProduction";
import {ITProductionGroup ,TProductionDayGroup} from "./models/TProductionDayGroup";
import ITProductionUtil from "./ITProductionUtil";
import {TProductionGroupAbstract } from "./models/TProductionAbstract";
import TProductionGroupFinder from "./TProductionGroupFinder";
import TProductionGroupOperator from "./TProductionGroupOperator";
import TProductionGroupGrouper from "./TProductionGroupGrouper";
import { TProjectProductProcess } from "../../tProjects/class/models/TProjectProductProcess";
import { TProductionDay } from "./models/TProductionDay";
import { ITProductionGroupConditions } from "./models/grouper/PdtGrouper";
import axios from "axios";
import TProductionGroupAxios from "./TProductionGroupHttp";
import TProductionGroupHttp from "./TProductionGroupHttp";
import { MProductionGroupConfigService } from "../../masters/class/services/MProductionGroupConfigService";
import { TProjectProductProcessService } from "../../tProjects/class/services/TProjectProductProcessService";

import { useStore } from "../../../stores/mainStore";

export default class TProductionGroupManager{ 
    public tProductions:Array<TProduction> = [] ; 

    public loginMUserId:number ; 

    /**
     * Store
     */
    // public store:object ; 
    private store = useStore()


    /**
     * find系のまとめクラス
     */
    public finder:TProductionGroupFinder ; 

    /**
     * Group操作系のまとめクラス
     */
    public operator:TProductionGroupOperator ; 

    /**
     * Group並び替え系のまとめクラス
     */
    public grouper:TProductionGroupGrouper ; 

    /**
     * DB更新まとめクラス
     */
    public http:TProductionGroupHttp ; 
    
    /**
     * Drag中のGroup
     */
    public dragGroup?:TProductionDayGroup ;

    constructor( loginMUserId:number ) {
        // this.store = store ; 
        this.loginMUserId = loginMUserId ; 
        this.finder = new TProductionGroupFinder(this) ; 
        this.operator = new TProductionGroupOperator(this) ; 
        this.grouper = new TProductionGroupGrouper(this) ; 
        this.http = new TProductionGroupHttp(this) ; 
    }

    /********************
     *  Property
     *******************/

    /**
     * 選択中のTProductions
     */
    public get activeTProductions():Array<TProduction>{
        return this.tProductions.filter(x => x.is_selected) ; 
    }

    /********************
     *  Methods 
     *******************/

    /**
     * toGroupNodeに指定されたところから新たに親グループを生成
     * @param toGroupNode 
     * @param group    移動元のグループ
     * @param toGroup  移動先のグループ
     * @param isFromAbove 
     */
     public createParentGroups(
         toGroupNode:TProductionGroupAbstract , 
         group:TProductionDayGroup ,
         toGroup:TProductionDayGroup | undefined  = undefined ,
         isFromAbove:boolean = true ) { 

        // console.log("Parent Row " ) ; 
        // console.log("BBcc--------") ; 
        // // @ts-ignore
        // console.log(group.list[0].id)  ;      

        // Loop内で使用するGroup挿入メソッド
        const pushOrSpliceGroup = (pushedGroup:Array<TProductionDayGroup> , group:TProductionDayGroup,  toIdx:number , isFromAbove:boolean ) => { 
            if ( toIdx === -1 ) {    
                pushedGroup.push(group) ; 
            } 
            else { 
                const insertIdx = toIdx + (isFromAbove ? 1 : 0) ; 
                //console.log("toIdx:" + toIdx + " insertIdx : " + insertIdx + " length:" + tempGroup.groups.length + " from Above :" + isFromAbove) ; 
                // @ts-ignore
                //console.log(group.list[0].id) ; 
                // console.log(pushedGroup) ; 
                // console.log(group.hour) ; 
                // console.log("is " + ITProductionUtil.isTProductionGroup(group)) ; 
                pushedGroup.splice(insertIdx , 0 , group ) ;  

            }

        }

        // 分割後の子グループを作っていく為
        let tempGroup = toGroupNode ; 

        
        
        const toLevel = ( ITProductionUtil.isTProductionDayGroup(toGroupNode) ? toGroupNode.level + 1 : 0 ) ;
         

        // 分割後の小グループ作成
        for ( let j = toLevel ; j < group.level + 1 ; j++){
            // console.log( "j : " + j + " to " + group.level + "isFromAbove " + isFromAbove) ;

            const gInfo = group.getInfoByLevel( j) ;            
            // console.log("gInfo") ; 
            // console.log(gInfo) ; 
            

            // const foundGroup = tempGroup.groups.filter(x => x.key === gInfo.key) ;                         
            const groupNo = this.getNewGroupNo(tempGroup , gInfo.key) ; 
            // const groupNo = 
            //     (foundGroup.length === 0 ) ? 0 
            //     // @ts-ignore
            //     : _.maxBy(foundGroup , "group_no").group_no + 1 ; 

            if ( j === group.level ){
                
                group.group_no = groupNo ; 

                
                // Drop位置に挿入
                const toIdx = toGroup === undefined ? -1 : tempGroup.groups.indexOf(toGroup )  ;       
                // console.log("toIdx2 " + toIdx ) ; 
                // console.log(group.list[0] ) ; 
                // // @ts-ignore
                // console.log("Iza " + tempGroup.title  ) ; 
                pushOrSpliceGroup(tempGroup.groups , group , toIdx ,isFromAbove ) ; 
                
            } 
            else {             
                // console.log("cccc--------") ; 
                // // @ts-ignore
                // console.log(group.list[0].id)  ;      
                // console.log(group.list)            ;  
                // 関連するグループの生成
                const newGroup = TProductionDayGroup.create(
                    this , 
                    group.m_production_id , 
                    group.planed_production_at  , 
                    j , 
                    group.t_project_product_processes , gInfo.target ,gInfo.key ,gInfo.title , groupNo ) ; 
                    
                // newGroup.m_production_id = group.m_production_id ; 
                // newGroup.planed_production_at =  group.planed_production_at ;
                // newGroup.level = j ; 
                
                let toIdx = -1 ; 
                if (toGroup !== undefined) { 
                    const toGInfo   = toGroup.getInfoByLevel( j) ; 
                    toIdx = _.findIndex( tempGroup.groups , (x) => x.key === toGInfo.key && x.group_no === toGInfo.group_no)  ; 
    
                }
                // console.log("BBBB---- ") ; 
                // console.log(tempGroup) ; 
                
                pushOrSpliceGroup(tempGroup.groups , newGroup , toIdx , isFromAbove) ; 
                // console.log("cccc2222--------") ; 
                // // @ts-ignore
                // console.log(group.list[0].id)  ;      
                // console.log("toIdx:" + toIdx) ; 
                    

                tempGroup = newGroup ;
                
            }

        }



    } 
    
    /**
    * 生産先リストからグループを削除
    * @param group 
    * @param isTemporary 
    *      true :移動などの際に使う一時的な削除
    *      false:グループ自身の削除
     * @param isDeleteProcesses 
     *      true :  t_project_product_processes を削除
     *      false :  t_project_product_processes を削除しない)
     * @param isDeleteOnlySelf 
     *      true :  親グループが空の場合削除、子グループは削除しない
     *      false : 親グループが空の場合削除、子グループも削除
     */
    public removeGroup( 
        group:TProductionDayGroup ,
        isTemporary:boolean = true ,
        isDeleteProcesses:boolean = true ,
        isDeleteOnlySelf:boolean = false  ) {
        // console.log(`Remove ${group.uid} temporary:${isTemporary} isDeleteProcesses:${isDeleteProcesses} isDeleteOnlySelf:${isDeleteOnlySelf}`) ; 
        this.removeGroupByUid(group.m_production_id , group.planed_production_at , group.uid ,isTemporary ,isDeleteProcesses ,isDeleteOnlySelf) ;         
    } 

    /**
     * 生産先リストからグループuidを元にグループ削除
     * @param mProductionId 
     * @param day 
     * @param groupUid 
     * @returns 
     */
    public removeGroupByUid(
        mProductionId:number , 
        day:any , 
        groupUid:string  ,
        isTemporary:boolean = true ,
        isDeleteProcesses:boolean = false ,
        isDeleteOnlySelf:boolean = false  ) {
        //console.log("uid : " + groupUid) ; 
        // 削除用ファンクション
        const removeFunc = ( groups:Array<TProductionDayGroup> ,uid:string ) => { 
            const foundIndex:number = groups.findIndex(x => x.uid === uid && _.isNil(x.deleted_at) ) ; 
            if ( foundIndex !== -1){

                // 親にさかのぼって listから削除
                const g = groups[foundIndex] ; 
                const removeIds = g.t_project_product_processes.map(x => x.id) ; 

                // console.log(g.id + " isTemporary " + isTemporary) ; 
                // 移動の為などの一時的な移動
                g.delete(isTemporary ,isDeleteOnlySelf ) ; 
                
                if ( removeIds.length !== 0 && isDeleteProcesses ){
                    //if ( removeIds.length !== 0  ){
                    //console.log("removeProcessesByIds " + removeIds.join(",")) ; 
                    this.removeProcessesByIds(mProductionId , day , removeIds ) ; 
                }
                //console.log("removeUids : " + groupUid + " foundIndex " + foundIndex ) ; 
                
            }
            else {                
                for ( const group of groups ) { 
                    removeFunc(group.groups , uid ) ; 
                }
            }
        } ;    
        
        //console.log("removeGroupByUid") ;
        //console.log("mProductionId:" + mProductionId) ;
        
        const foundDay = this.finder.findByMProductionIdAndDay(mProductionId , day) ; 
        if ( foundDay === undefined){
            // console.log("Not found day " + groupUid) ; 
            return ; 
        }
        

        
        removeFunc(foundDay.groups , groupUid ) ; 

        
    } 

    
    /**
     * mismatch分を分割
     * @param group 
     */
     public async updateMismatch(group:TProductionDayGroup){
         
        const productionDay:TProductionDay|undefined = group.getDay() ; 
        if ( productionDay === undefined ) return ; 


        const mismatches = group.mismatchesIncChildren ; 
        const mProductionMismatches = mismatches.filter(x => x.isMProductionChange ) ; 

        // 生産先の変更のあったデータ
        const mProductionMismachProcesses = mProductionMismatches.map(x => x.t_project_product_process) ; 
        const uniquedMProductionMismachProcesses = _.uniq(mProductionMismachProcesses) ; 
        const mProductionMismatchProcessIds:number[] = uniquedMProductionMismachProcesses.map(x => x.id ?? 0 ) ;  


        // 生産先の変更
        if ( uniquedMProductionMismachProcesses.length > 0){
            const mProductionChanges:TypeTProductionGroupManager_UpdateMProductionMismatches[] =  [] ; 

            // 変更後の生産先ごとにまとめる
            for ( const p of uniquedMProductionMismachProcesses){
                const pdtCName = `m_production_id_${p.tmp_target_production_no}` ; 
                
                // @ts-ignore
                const mProductionId:number = p[pdtCName] ; 

                let foundChange:TypeTProductionGroupManager_UpdateMProductionMismatches|undefined 
                    = mProductionChanges.find(x => x.m_production_id == mProductionId) ; 
                if ( foundChange === undefined ){
                    foundChange = {
                        m_production_id : mProductionId , 
                        t_project_product_processes : [] ,
                    }
                    mProductionChanges.push(foundChange) ; 
                }

                foundChange.t_project_product_processes.push(p) ; 

            }

            // console.log("mProductionChanges") ; 
            // console.log(mProductionChanges) ; 


            // 変更の反映
            for (const c of mProductionChanges){                


                // @ts-ignore
                const mProduction = this.store.masters.getMProductionById(c.m_production_id) ;   ;                                 
                let groupConfig = await MProductionGroupConfigService.getDefault(mProduction.m_branch_id ,productionDay.process_category_m_kv_id  ) ;    

                let foundDay = this.finder.findByMProductionIdAndDay(c.m_production_id , productionDay.day) ; 
                if ( foundDay === undefined ) { 
                    try { 
                        // Day取得
                        foundDay = await this.http.getTProductionDayBy(c.m_production_id , productionDay.day , productionDay.process_category_m_kv_id ,groupConfig) ; 
                        
                    }
                    catch ( error ) { 
                        console.error(error) ;    
                        return ; 
                    }
    
                }

                const conditions = TProductionGroupGrouper.parseConditions(foundDay) ; 
                const groupedList = this.grouper.getGroupedList(foundDay ,c.t_project_product_processes , 0 ,conditions ) ; 
                // console.log(groupedList) ; 
                // console.log("foundDay.groups") ; 
                // console.log(foundDay.groups) ; 
                this.operator.unionGroups(groupedList ,foundDay.groups) ; 

                try {
                    await this.http.saveTProductionDay(foundDay) ; 
                }
                catch (error ) { 
                    console.error(error) ;    
                    return ; 
                }

                
            }


            // console.log(mProductionMismatchProcessIds) ; 
            // 元のグループを削除
            this.removeProcessesByIds(group.m_production_id , productionDay.day , mProductionMismatchProcessIds ) ; 
            // this.removeProcessesByIdsNonRemoveGroup(group.m_production_id , group.getDay()?.day , mProductionMismatchProcessIds ) ; 
            
        }


        // グループのキーに変更のあったデータ
        // 生産先を変更した分は除外
        const groupMismatches = mismatches.filter(
            x => ! x.isMProductionChange 
                && mProductionMismatchProcessIds.indexOf(x.t_project_product_process.id ?? 0) === -1) ; 

        const mismatchProcesses:TProjectProductProcess[] = groupMismatches.map(x => x.t_project_product_process ) ;  
        const uniquedMismatchProcess = _.uniq(mismatchProcesses) ; 
        const mismatchProcessIds:number[] = uniquedMismatchProcess.map(x => x.id ?? 0 ) ;  
        // console.log(groupMismatches) ; 

        // t_project_product_processes のみ削除
        this.removeProcessesByIdsNonRemoveGroup(group.m_production_id , group.getDay()?.day , mismatchProcessIds ) ; 
        // console.log("1") ; 
        // 明細がなくなった場合グループを削除
        if ( group.t_project_product_processes.length === 0 ){
            this.removeGroup( group ,false , true  ) ;             
        }

        let pGroup ; 
        // console.log("2") ; 
        if ( _.isNil( group.parentGroup)){
            // console.log("2-A") ; 
            pGroup = group.getDay() ; 
        }
        else {
            // console.log("2-B") ; 
            pGroup = group.parentGroup ; 
        }

        // console.log("pGroup") ; 
        // console.log(pGroup) ; 
        if ( _.isNil( pGroup)) return ; 

        pGroup.t_project_product_processes.push(...uniquedMismatchProcess) ; 


        const conditions = TProductionGroupGrouper.parseConditions(productionDay) ; 
        const groupedList = this.grouper.getGroupedList(pGroup ,uniquedMismatchProcess , group.level ,conditions ) ; 

        for ( const g of groupedList){
            const found = pGroup.groups.find(x => x.key === g.key)  ;

            if ( found === undefined || found.isExistsResultsChild || found.isSelfResults){                
                const groupNo = this.getNewGroupNo(pGroup , g.key) ;
                g.group_no = groupNo ;  
                pGroup.groups.push(g) ; 
            }
            else { 
                this.operator.unionGroups(g.groups ,found.groups) ; 
            }
        }

        // console.log(pGroup) ; 

        // pGroup.groups.push(...groupedList) ; 
        
        productionDay.updateKeyGroupNo4Children() ; 
        try {
            await this.http.saveTProductionDay(productionDay) ; 
        }
        catch (error ) { 
            console.error(error) ;    
            return ; 
        }


    }

    /**
     * 指定されたidの配列をlistから削除
     */
     public removeProcessesByIdsNonRemoveGroup( mProductionId:number , day:any , ids:Array<number|undefined> )  {
        const foundDay = this.finder.findByMProductionIdAndDay(mProductionId , day) ; 
        if ( foundDay === undefined) return ; 


        // 削除用ファンクション
        const removeFunc = ( obj:TProductionGroupAbstract ,ids:Array<number|undefined> ) => { 

            if ( ITProductionUtil.isTProductionDayGroup(obj)){
                if ( obj.isDelete ) return ; 
            }
            // @ts-ignore
            const notRemoves = obj.t_project_product_processes.filter( x => ids.indexOf(x.id) === -1) ; 
            obj.t_project_product_processes.splice(0) ;             
            obj.t_project_product_processes.push(...notRemoves) ; 

            for ( const group of obj.groups ) { 
                removeFunc(group , ids ) ; 
            }
        } ; 

        removeFunc(foundDay , ids ) ; 

        // @ts-ignore
        const foundMProduction = this.tProductions.find(x => x.MProduction.id == mProductionId ) ; 
        
        if ( foundMProduction === undefined)  return ; 
        const notRemoves4MProduction = foundMProduction.t_project_product_processes.filter( x => ids.indexOf(x.id) === -1) ;  
        
        foundMProduction.t_project_product_processes.splice(0) ; 
        foundMProduction.t_project_product_processes.push(...notRemoves4MProduction) ; 
    }
    
    /**
     * 指定されたidの配列をlistから削除 ( 中身が空のグループも削除 )
     */
     public removeProcessesByIds( mProductionId:number , day:any , ids:Array<number|undefined> )  {
        const foundDay = this.finder.findByMProductionIdAndDay(mProductionId , day) ; 
        if ( foundDay === undefined) return ; 

        // 削除用ファンクション
        const removeFunc = ( obj:TProductionGroupAbstract ,ids:Array<number|undefined> ) => { 

            if ( ITProductionUtil.isTProductionDayGroup(obj)){
                if ( obj.isDelete ) return ; 
            }
            // @ts-ignore
            const notRemoves = obj.t_project_product_processes.filter( x => ids.indexOf(x.id) === -1) ; 
            obj.t_project_product_processes.splice(0) ; 
            if ( notRemoves.length === 0 ) { 
                // 1件もなくなったため、グループを削除          
                // @ts-ignore                      
                // console.log("Remove " + obj.uid) ; 
                // console.log(obj.t_production_day_groups) ; 
                if ( ITProductionUtil.isTProductionDayGroup(obj)){
                    if (! _.isNil(obj.uid) ){

                        // 子グループにDeleted_at が入ったものがある場合はdeletedAtを入れる
                        let isChildrenDelete = false ; 
                        for (const cg of obj.allChildrenGroup) {
                            if (cg.isDelete){ 
                                isChildrenDelete = true ; 
                                break ; 
                            }
                        }

                        // console.log("isChildrenDelete : " + isChildrenDelete ) ; 

                        // console.log(`1件もなくなった ${obj.uid}`) ; 
                        if ( isChildrenDelete){
                            // 子グループにDeleted_at が入ったものがある
                            obj.deleted_at = new Date() ; 
                            return ; 
                        }
                        else { 
                            this.removeGroupByUid( mProductionId , day , obj.uid , false , false ) ; 
                        }
                        
                    } 
                }
                
            }
            else {                     
                obj.t_project_product_processes.push(...notRemoves) ; 
            }
            for ( const group of obj.groups ) { 
                removeFunc(group , ids ) ; 
            }
        } ; 

        removeFunc(foundDay , ids ) ; 

        // @ts-ignore
        const foundMProduction = this.tProductions.find(x => x.MProduction.id == mProductionId ) ; 
        
        if ( foundMProduction === undefined)  return ; 
        const notRemoves4MProduction = foundMProduction.t_project_product_processes.filter( x => ids.indexOf(x.id) === -1) ;  
        
        foundMProduction.t_project_product_processes.splice(0) ; 
        foundMProduction.t_project_product_processes.push(...notRemoves4MProduction) ; 


    } 

    
    /**
     * 指定されたmProductionId で生産可能か判定
     * @param toMProduction 
     * @param list 
     * @param isAlertMsg 
     * @returns 
     */
     public isAbleToChangeMProduction(toMProduction:object ,  list:Array<TProjectProductProcess> , isAlertMsg:boolean = false  ) { 

        //const toMProduction = storetProductions.find(x => x.id === mProdcutionId ) ; 
        if ( toMProduction === undefined) {
            if ( isAlertMsg ) alert("生産先が無効") ; 
            return false ; 

        }

        // @ts-ignore
        const tProduction = this.tProductions.find(x => x.MProduction.id == toMProduction.id) ; 
        if( tProduction === undefined) { 
            if ( isAlertMsg ) alert("生産先が無効") ; 
            return false ; 

        }

        // 生産先が選択状態になっているか        
        if ( ! tProduction.is_selected ) { 
            if ( isAlertMsg ) alert("生産先を選択状態にしてください") ; 
            return false ; 

        }

        for ( const row of list ) { 
            // console.log(row) ;
            const mBranchId = row.m_branch_id ; 
            // @ts-ignore
            const mProcessCategoryId = row.m_process_category_id ; 
            // @ts-ignore
            const mProductCategoryId = row.t_project_product.m_product_category_id ; 

            // @ts-ignore            
            // console.log("mBranchId  " + mBranchId + "  to " + toMProduction.m_branch_id ) ; 
            // @ts-ignore            
            if ( mBranchId !== toMProduction.m_branch_id) {
                // 生産先の拠点が違う
                if ( isAlertMsg ) alert("拠点が違う為、移動することができません") ; 
                return false ; 

            }

            // @ts-ignore
            const MProcessCat = toMProduction.m_process_categories.find(x => x.id == mProcessCategoryId) ; 
            if ( MProcessCat === undefined ){
                // 対応しない工程
                if ( isAlertMsg ) alert("対応しない工程の為、移動することができません") ; 
                return false ; 
            }

            // @ts-ignore
            const MProductCat = toMProduction.m_product_categories.find(x => x.id == mProductCategoryId) ; 
            if ( MProductCat === undefined ){
                // 対応しない商品分類
                if ( isAlertMsg ) alert("対応しない商品分類の為、移動することができません") ; 
                return false ; 

            }


        }

        // 生産変更に伴って
        if ( isAlertMsg) { 
            if (!confirm('生産先を変更すると変更元、変更後の予定が保存されますがよろしいですか？')) return false  ;
        }

        return true ;         

    } 


    /**
     * fromGroupが上から来ているか判定
     * @param fromGroup 
     * @param toGroup 
     * @returns 
     */
    public getIsFromAbove ( fromGroup:TProductionDayGroup   ,toGroup:TProductionDayGroup ) : boolean 
    {
        const fromPlanedAt  = dayjs( fromGroup.planed_production_at ) ; 
        const toPlanedAt    = dayjs( toGroup.planed_production_at   ) ; 

        if (  fromPlanedAt.isSame(toPlanedAt)){
            // 同一日付
            const foundDay = this.finder.findByMProductionIdAndDay(fromGroup.m_production_id , fromGroup.planed_production_at) ; 
            if ( foundDay === undefined) return false ; 

            // 何回目で見つけられるかFunction
            const getFoundCntFunc = ( groups:Array<TProductionDayGroup> ,uid?:string ,cnt:number = 0 ) => { 
                
                const foundIndex:number = groups.findIndex(x => x.uid === uid) ; 
                // console.log("foundIndex " + foundIndex ) ; 
                if ( foundIndex !== -1){
                    // 見つかった
                    //console.log("found "+  cnt ) ; 
                    cnt += foundIndex ; 
                    return { cnt:cnt , isFound:true }  ;                     
                }
                else {
                    // 見つからないので子グループ探す
                    for ( const group of groups ) { 
                        if ( group.groups.length === 0 ){
                            cnt ++ ; 
                        }
                        else{
                            cnt ++ ; 
                            let rtn = getFoundCntFunc(group.groups , uid ,cnt )  ; 
                            //console.log(`rtnCnt:${rtn.cnt} isFound:${rtn.isFound}`) ; 
                            cnt += rtn.cnt ; 
                            //console.log("not found " +  cnt ) ; 
                            if ( rtn.isFound ) return { cnt:cnt , isFound:true }  ;                     
                        }
                        
                        
                    }

                    return { cnt:cnt , isFound:false }  ;                     
                }
            } ; 

            const fromRtn = getFoundCntFunc(foundDay.groups , fromGroup.uid ) ; 
            const toRtn = getFoundCntFunc(foundDay.groups , toGroup.uid ) ; 
            //console.log(`fromFoundCnt : ${fromRtn.cnt} toFoundCnt : ${toRtn.cnt}`) ; 

            return fromRtn.cnt < toRtn.cnt ; 
            // const toFoundCnt   = getFoundCntFunc(foundDay.groups , toGroup.uid   ) ; 
            //const fromFoundCnt = 0 ; 

        }
        else {
            // 違う日付
            return fromPlanedAt.isBefore(toPlanedAt) ; 

        }
        //console.log("removeGroupByUid") ;
        
    } 

    /**
     * 指定したキーの新しいGroupNoを取得
     * @param parentGroup
     * @param key 
     * @returns 
     */
    public getNewGroupNo (parentGroup:TProductionGroupAbstract , key:string):number{
        
        const foundGroup = parentGroup.groups.filter(x => x.key === key) ;                         
        const groupNo = 
            (foundGroup.length === 0 ) ? 0 
            // @ts-ignore
            : _.maxBy(foundGroup , "group_no").group_no + 1 ; 

        return groupNo ; 

    }

    public loadAllMProductions(){
        // @ts-ignore
        // console.log(this.store.state.masters.MProductions) ; 
        // @ts-ignore
        for (const mProduction of this.store.masters.MProductions){
            const tProd:TProduction  = new TProduction(mProduction ) ;
            tProd.is_selected = true ; 
            this.tProductions.push(tProd) ; 
        }
        
    }

    /**
     * processes　のupdated_atがDBと一致するかチェック　
     * @param processes 
     * @returns true : 問題なし　false:更新有り
     */
    public async checkUpdatedAt(processes:TProjectProductProcess[])    
        :Promise<boolean>{
        return new Promise(async (resolve,reject) => 
        {
            try { 
                const updatedList = await TProjectProductProcessService.checkUpdatedAt(processes) ; 
                if ( updatedList.length !== 0 ){
                    alert("工程の情報が更新されています。リロードをしてください。") ; 
                    resolve(false) ; 
                    return ; 
                }
                
                resolve(true) ; 
        
            }            
            catch (error ) {        
                reject(error) ; 
            }
        }
    )};



    /********************
     *  Properties
     *******************/





}



/**
 * mismatchesIncChildren_ByTProjectProductで使用
 */
 export type TypeTProductionGroupManager_UpdateMProductionMismatches = { 
    m_production_id:number , 
    t_project_product_processes : TProjectProductProcess[] , 

}