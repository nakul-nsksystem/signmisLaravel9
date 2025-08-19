import dayjs from "dayjs";
import _ from "lodash";
import { TProjectProductProcess } from "../../tProjects/class/models/TProjectProductProcess";
import TProjectProductProcessUtil from "../../tProjects/class/TProjectProductProcessUtil";
import ITProductionUtil from "./ITProductionUtil";
import { TProduction } from "./models/TProduction";
import { TProductionGroupAbstract } from "./models/TProductionAbstract";
import { TProductionDay } from "./models/TProductionDay";
import { TProductionDayGroup } from "./models/TProductionDayGroup";
import TProductionGroupGrouper from "./TProductionGroupGrouper";
import TProductionGroupManager from "./TProductionGroupManager";

export default class TProductionGroupOperator{ 
    private manager:TProductionGroupManager ;

    constructor ( manager:TProductionGroupManager){
        this.manager = manager ; 
    }

    private get tProductions () :Array<TProduction>{
        return this.manager.tProductions ; 
    }

    /**
     * グループの入れ替え
     * @param tProductions 
     * @param group 
     */
    public replaceGroup(fromGroup:TProductionDayGroup   ,toGroup:TProductionDayGroup ) {
        //console.log("isA " + ITProductionUtil.isTProductionGroup(fromGroup)) ;
        // console.log(`fromGroup:${fromGroup.uid} toGroup:${toGroup.uid}` ) ; 
        // From to が一緒
        if ( fromGroup.uid === toGroup.uid) return ; 
        // levelが違う
        if ( fromGroup.level !== toGroup.level) return ; 
        //console.log("replaceGroup") ; 

        const fromProdDay = this.manager.finder.findByMProductionIdAndDay(fromGroup.m_production_id , fromGroup.planed_production_at) ; 
        const toProdDay   = this.manager.finder.findByMProductionIdAndDay(toGroup.m_production_id , fromGroup.planed_production_at) ; 

        // console.log(fromProdDay) ; 
        // console.log(toProdDay) ; 

        if ( fromProdDay === undefined || toProdDay === undefined)  return ; 
                

        if ( dayjs(fromGroup.planed_production_at).isSame(toGroup.planed_production_at)){
            // 生産予定日が同一                 
            const isFromAbove = this.manager.getIsFromAbove( fromGroup , toGroup) ; 
            // console.log(`key ${fromGroup.key} ${toGroup.key}`) ; 
            // console.log(`id ${fromGroup.id} ${toGroup.id}`) ; 
            // 結合するパターンかの判定
            let isSameParentJoin = false ; 
            if ( fromGroup.level === 0 ){
                // Root 
                isSameParentJoin = ( fromGroup.key === toGroup.key ) ;                 
            }
            else { 
                if ( fromGroup.key === toGroup.key){

                    //  console.log("fromParentGroup")
                    let fromParentGroup:TProductionDayGroup = fromGroup ; 
                    let toParentGroup:TProductionDayGroup = toGroup ; 

                    for ( let i = 0 ; i<fromGroup.level ; i++){
                        // console.log(i) ; 
                        fromParentGroup   = fromParentGroup.parentGroup  as TProductionDayGroup; 
                        toParentGroup     = toParentGroup.parentGroup as TProductionDayGroup; 
        
                        if ( fromParentGroup !== undefined )
                        {
                            // console.log(`parent key ${fromParentGroup.key} ${toParentGroup.key}`) ; 
                            // console.log(`parent id ${fromParentGroup.id} ${toParentGroup.id}`) ; 
                            if ( fromParentGroup.key !== toParentGroup.key ) {
                                isSameParentJoin = false ; 
                                break ; 
                            }
                            else { 
                                isSameParentJoin = true ; 
                            }
                            //isSameParentJoin = ( fromParentGroup.key === toParentGroup.key ) ; 
                            
                        }
                    }
                }
                
                
            }

            //  console.log("isSameParentJoin " + isSameParentJoin ) ; 

            // fromのグループから抜く
            this.manager.removeGroup(fromGroup , ! isSameParentJoin , ! isSameParentJoin ,isSameParentJoin  ) ;   

            // 挿入            
            this.insertGroup(fromGroup ,toGroup , isFromAbove ) ; 
            // console.log(toGroup.t_project_product_processes.length) ; 
        }
        else { 

            // 日付が違う
            console.log(`different Day from:${fromGroup.planed_production_at}  to ${toGroup.planed_production_at}`) ; 
            console.log(toProdDay) ; 
            dayjs(fromGroup.planed_production_at).isSame(toGroup.planed_production_at)
        }

    }
    
    
    /**
     * 日付と生産先を移動
     * @param mProductionId 
     * @param day 
     * @param group 
     * @returns 
     */
    public async moveGroupMProductionDay (
        mProductionId:number ,
        day:any ,  
        group:TProductionDayGroup , 
        isOnlyDay:boolean = false ) { 

        // 生産先ID変更用Function
        // const changeMProductionIdFunc = function ( group:TProductionDayGroup , mProductionId :number ) { 

        //     group.m_production_id = mProductionId ; 

        //     for ( const row of group.t_project_product_processes ) {
        //         // @ts-ignore
        //         const tgtProdNo = row.tmp_target_production_no ; 
        //         // @ts-ignore
        //         row[`m_production_id_${tgtProdNo}`] = mProductionId ; 
        //         // console.log("mProductionId " + mProductionId ) ; 
        //         //row[`m_production_mode_id_${tgtProdNo}`] = mProductionModeId ; 
        //         //row[`m_production_option_id_${tgtProdNo}`] = mProductionOptionId ; 

        //     }

        //     if ( group.groups.length !== 0 ){
        //         for ( const g of group.groups ) { 
        //             changeMProductionIdFunc(g , mProductionId ) ; 
        //         }
        //     }

        // }

        
        const changeMProductionIdFunc = async function ( processes:Array<TProjectProductProcess> , mProductionId :number ) { 

            group.m_production_id = mProductionId ; 

            for ( const row of processes ) {
                // @ts-ignore
                const tgtProdNo = row.tmp_target_production_no ; 

                // @ts-ignore
                if ( row[`m_production_id_${tgtProdNo}`] != mProductionId ){
                    // @ts-ignore
                    row[`m_production_id_${tgtProdNo}`] = mProductionId ; 
                    // row.updateProductionDisplays() ; 

                }
                
                // console.log("mProductionId " + mProductionId ) ; 
                //row[`m_production_mode_id_${tgtProdNo}`] = mProductionModeId ; 
                //row[`m_production_option_id_${tgtProdNo}`] = mProductionOptionId ; 

            }

            // Displayとコスト更新
            await TProjectProductProcessUtil.updateInfoByMProductionChanges(processes) ; 
            // console.log(processes) ; 


        }

        // 生産予定日変更用Function
        // const changePlanedProductionAtFunc = function ( group:TProductionDayGroup , day:any ) { 
        //     group.planed_production_at = day ; 

        //     for ( const row of group.t_project_product_processes ) {
        //         // @ts-ignore
        //         // row.planed_production_at = day ; 
        //     }

        //     if ( group.groups.length !== 0 ){
        //         for ( const g of group.groups ) { 
        //             changePlanedProductionAtFunc(g , day)
        //         }
        //     }
        // }
        
        // Drag元と一緒
        if ( group.m_production_id == mProductionId && 
            ( day === undefined || dayjs(day).isSame(group.planed_production_at) )) return ; 
        
        // 行き先の生産先で生産不可
        // @ts-ignore
        const toMProduction = this.tProductions.find(x => x.MProduction.id === mProductionId) ; 
        if ( toMProduction === undefined )return ; 
        

        // if (! this.manager.isAbleToChangeMProduction(toMProduction.MProduction , group.t_project_product_processes , true ) ) return ; 
        

        // 元の生産先の配列から抜く            
        const tempProcesses = [...group.t_project_product_processes] ; 
        this.manager.removeGroup( group ,false ,true ,false) ; 
        
        // console.log(tempProcesses) ; 
        
        // 生産先IDの書き換え
        if ( ! isOnlyDay ){
            await changeMProductionIdFunc(tempProcesses , mProductionId ) ; 
        }
        
        // 生産予定日の書き換え
        if ( day !== undefined){
            // changePlanedProductionAtFunc(group , day) ; 
            group.updatePlanedProductionAt(day) ; 
        }
        
        // 既にロードされている生産日であれば追加
        const foundDay = this.manager.finder.findByMProductionIdAndDay( mProductionId , day ?? group.planed_production_at) ;         
        if ( foundDay === undefined ) return  ; 

        // 移動先のlistに追加
        // foundDay.t_project_product_processes.push(...group.t_project_product_processes) ; 
        foundDay.t_project_product_processes.push(...tempProcesses) ; 

        // Level0のグループを一時的に作成する。
        const conditions = TProductionGroupGrouper.parseConditions(foundDay) ; 
        const groupedList = this.manager.grouper.getGroupedList(group ,tempProcesses , 0 ,conditions ) ; 
        // console.log("groupedList") ; 
        // console.log(groupedList) ; 

        const unionGroups = [] ; 

        for ( const g of groupedList){
            const newGNo = this.manager.getNewGroupNo(foundDay , g.key) ; 
            if ( newGNo === 0 ) { 
                // １階層目に同一キーなし
                foundDay.t_production_day_groups.push(g) ;             

            }
            else { 
                // グループ有 合体
                unionGroups.push(g) ; 
                this.unionGroups([g] , foundDay.t_production_day_groups) ; 

                // const existsG = foundDay.t_production_day_groups.find(x => x.key === g.key) ; 
                

            }
        }

        this.unionGroups(unionGroups , foundDay.t_production_day_groups) ; 

        foundDay.updateKeyGroupNo4Children() ; 
        
       

    } 

    /**
     * グループの配列同士の統合
     * @param groups 
     * @param toGroups 
     */
    public unionGroups(groups:Array<TProductionDayGroup> , toGroups:Array<TProductionDayGroup> ) { 
        const addGroups:Array<TProductionDayGroup> = []
        for (const g of groups ) { 
            const filterdToGroups = toGroups.filter( x => _.isNil(x.deleted_at) && ! x.isExistsResultsChild && ! x.isSelfResults) ; 
            const found = filterdToGroups.find(x => x.level === g.level && x.key == g.key) ; 
            if ( found === undefined ){
                // console.log("Not Union!" + ` level:${g.level} key:${g.key}` ) ;                                 
                // console.log(toGroups) ; 
                
                if ( toGroups.length !== 0 ){
                    let prtGroup = toGroups[0].parentGroup ;    
                    if ( prtGroup !== undefined){
                        const groupNo = this.manager.getNewGroupNo(prtGroup , g.key ) ; 
                        g.group_no = groupNo ; 
                        
                    }
                    // console.log("prtGroup") ; 
                    // console.log(prtGroup) ; 
        
                }
                // let prtGroup = filterdToGroups.length === 0 ? undefined : filterdToGroups[0].parentGroup ;
                // if ( prtGroup === undefined && filterdToGroups.length !== 0) { 
                //     prtGroup = filterdToGroups[0].tProductionDay ; 
                // }

                addGroups.push(g) ; 

                // addGroups.push(g) ; 
            }
            else { 
                // console.log("Union!" + ` level:${g.level} key:${g.key}` ) ; 
                
                found.t_project_product_processes.push(...g.t_project_product_processes) ; 
                this.unionGroups(g.groups ,found.groups) ; 
            }
        }

        // 元のグループから削除
        for ( const g of addGroups){
            const idx = groups.indexOf(g) ; 
            if  ( idx !== -1 ) groups.splice(idx ,1 )  ; 
        }
        

        toGroups.push(...addGroups) ; 
    }

    /**
     * groupをparentGroupに追加 ( Index 指定可 )
     * @param parentGroup 
     * @param group 
     * @param index     spliceのIndex
     */
    protected addGroup(parentGroup:TProductionGroupAbstract , group:TProductionDayGroup ,index:number = -1) { 

        //parentGroup.t_project_product_processes.push(...group.t_project_product_processes) ; 

        const insertIdx = index === -1 ? parentGroup.groups.length : index ; 
        
        const groupNo = 
            (parentGroup.groups.length === 0 ) ? 0 
            // @ts-ignore
            : _.maxBy(parentGroup.groups , "group_no").group_no + 1 ; 
        group.group_no = groupNo ; 
        // console.log("groupNo " + groupNo) ; 


        // console.log("group_no " + group.group_no) ; 
        //console.log("uid " + group.uid)   ; 
        // @ts-ignore
        // console.log( group.t_project_product_processes[0].id + " : " + group.t_project_product_processes[0]["m_production_mode_id_01"])   ; 
        parentGroup.groups.splice(insertIdx , 0 , group) ;

        this.manager.grouper.grouping(group) ; 
        
        // console.log(JSON.stringify(group) ) ; 
        //console.log(JSON.stringify(group) ) ; 
        //console.log(group.toJSON() ) ; 
        parentGroup.updateKeyGroupNo4Children() ; 



    }

    /**
     * グループの場所入れ替え
     * @param group 移動元グループ
     * @param toGroup 移動先グループ
     * @param isFromAbove 上から来てるか
     */
    protected insertGroup (group:TProductionDayGroup ,toGroup:TProductionDayGroup ,isFromAbove:boolean ):boolean{
        
        const foundDay = this.manager.finder.findByMProductionIdAndDay(toGroup.m_production_id , toGroup.planed_production_at) ; 
        if (foundDay === undefined ) return false ; 
        let toGroupNode:TProductionGroupAbstract = foundDay ; 
        
        // toの親グループ
        //const toParentG = this.findParentGroup(foundDay    , toGroup   ) ; 
        const toParentG = this.manager.finder.findParentGroup(toGroup   ) ; 
        if ( toParentG === undefined) return false ; 

        // いずれかの親を分割がありえるパターン
        let isNeededSeparateGroup = false ; 
        // @ts-ignore
        if ( isFromAbove && _.last(toParentG.groups) != toGroup){
            // 分割するパターン
            isNeededSeparateGroup = true ; 
        }
        // @ts-ignore
        else if (! isFromAbove && _.first(toParentG.groups) != toGroup) { 
            // 分割するパターン
            isNeededSeparateGroup = true ; 
        }

        // 親の分割処理
        const level = group.level ; 
        // console.log("isFromAbove:" + isFromAbove) ;
        //console.log("isNeededSeparateGroup:" + isNeededSeparateGroup) ;
        if ( isNeededSeparateGroup ) {             
            // レベルの違いを検出
            let diffLevel:number = -1 ; 
            for(let i=0 ; i < level ; i++){
                let keyCName = `level_${i}_key` ; 
                // @ts-ignore
                if ( group[keyCName] != toGroup[keyCName]){
                    diffLevel = i ; 
                    break ; 
                }                    
                
            }

            if ( diffLevel !== -1 ) {
                // 分割処理
                let sepGroup = toGroup ; 
                if ( isFromAbove){
                    // 上から来た場合は一つ下のグループを分割する
                    //const prtGroup4Sep = this.findParentGroup(foundDay  , toGroup ) ; 
                    const prtGroup4Sep = this.manager.finder.findParentGroup( toGroup ) ; 
                    // console.log("prtGroup4Sep") ;
                    // console.log(prtGroup4Sep) ;
                    if ( ITProductionUtil.isTProductionDayGroup( prtGroup4Sep ) ){
                        const prtIdx4Sep = prtGroup4Sep.groups.indexOf(toGroup) ;                     
                        if ( prtIdx4Sep !== -1 && prtGroup4Sep.groups.length != prtIdx4Sep + 1 ) { 
                            // console.log("separate") ;
                            
                            sepGroup = prtGroup4Sep.groups[prtIdx4Sep + 1] ; 
                            // console.log(sepGroup) ;
                        }
    
                    }
                    
                }
                
                this.separateGroup( sepGroup ) ; 
                //console.log("sep") ; 

            }
        }


        // 順にレベルを調査
        for(let i=0 ; i < level + 1; i++){
            //  console.log(`i ${i}  level:${level}`) ; 
            let fromGInfo = group.getInfoByLevel(i) ; 
            let toGInfo   = toGroup.getInfoByLevel(i) ; 
            
            // @ts-ignore
            //const foundGroup = toGroupNode.groups.find(x => x.key === keyValue) ; 
            
            // console.log( `fromKey ${fromGInfo.key} toKey ${toGInfo.key}`) ; 
            if ( fromGInfo.key !== toGInfo.key ){
                // console.log("--- " + i + " level:" + level) ; 

                

                // 前段階で一度削除処理をしている為、戻す
                //group.deleted_at = undefined ; 
                
                // 前段階でDelete入れてるだけなので、IDが入ってる時用にRemoveしておく
                //this.manager.removeGroup( group ) ; 
                group.parent_t_production_day_group_id = undefined ; 

                // 親グループ作成
                this.manager.createParentGroups(toGroupNode , group , toGroup , isFromAbove) ;                 
                break ; 
            }
            else { 
                // 既にグループが存在する
                
                // console.log("Atta---" + i) ; 
                // console.log( `fromKey ${fromGInfo.key} toKey ${toGInfo.key}`) ; 
                // console.log( `fromGroupNo ${fromGInfo.group_no} toGroupNo ${toGInfo.group_no}`) ; 
                // console.log(JSON.stringify(group.t_project_product_processes)) ; 

                // @ts-ignore
                toGroupNode = toGroupNode.groups.find(
                    x => x.key === fromGInfo.key && x.group_no === toGInfo.group_no ) ; 
                
                    // @ts-ignore
                // console.log(`toGroupNode : ${toGroupNode.uid}`) ; 
                toGroupNode.t_project_product_processes.push(...group.t_project_product_processes);
                

                // グループ統合されるパターン
                if ( i === level) {                    
                    // console.log("P") ; 
                    // console.log(group.parentGroup) ; 
                    // if ( group.parentGroup === undefined )
                    // this.manager.removeGroup(group , false ) ; 
                    //console.log(group.list) ; 
                    // console.log(toGroupNode) ; 
                    // // 下のグループも入れる
                    // console.log("union pattern") ; 
                    // console.log(toGroupNode.t_project_product_processes.length) ; 
                    //toGroupNode.groups.push (...group.groups) ; 
                    // console.log(group.groups) ; 
                    this.unionGroups(group.groups , toGroupNode.groups) ; 

                    // console.log("toLen : " + toGroupNode.groups.length) ; 
                }

                


            }


            

            // @ts-ignore
            
            //console.log(i);
        }
        
        // Rootノードを取得し、情報をUpdate
        foundDay.updateKeyGroupNo4Children() ; 
        

        return true ; 

    } 

    
    /**
     * 指定されたGruopで親グループを分割する
     * @param tProductions 
     * @param group 
     */
    protected separateGroup (group:TProductionDayGroup ) {

        // 分割ファンクション
        const func = ( searchedParentGroup:TProductionGroupAbstract , searchedGroup:TProductionDayGroup ,sepGroup:TProductionDayGroup ):boolean => { 

            const sg = searchedGroup.groups ; 

            // console.log("searchedGroup " + searchedGroup.uid ?? "No") ; 

            for ( const g of sg ) { 
                // console.log("g " + g.uid + " parent :" + (searchedParentGroup.uid ?? searchedParentGroup.day)) ; 
                if ( g == sepGroup) { 
                    // 分割処理                    
                    const idx = sg.indexOf(g) ; 

                    // グループの１番目の場合は分割しない
                    if ( idx === 0 ) continue ; 
                    // console.log(searchedParentGroup) ; 
                    // console.log(`parentUid :  ${searchedParentGroup.uid} searchUid : ${searchedGroup.uid} uid : ${g.uid}`) ; 
                    
                    // 分割先に移動するグループを抽出
                    const newGroups = sg.slice(idx  ) ; 
                    // console.log("newGroups") ; 
                    // console.log(newGroups) ; 
                    const newGrouplist:Array<TProjectProductProcess> = [] ; 
                    newGroups.forEach(x => newGrouplist.push(...x.t_project_product_processes));

                    // @ts-ignore
                    const newGroupListIds = newGrouplist.map(x => x.id) ; 
                    
                    // 分割先に移動するグループを削除
                    sg.splice(idx ) ; 
                    //console.log(sg) ; 

                    // Listからも削除
                    // @ts-ignore
                    const remainList = searchedGroup.t_project_product_processes.filter( x => newGroupListIds.indexOf(x.id) ===  -1) ; 
                    searchedGroup.t_project_product_processes.splice(0) ; 
                    searchedGroup.t_project_product_processes.push(...remainList ) ; 


                    // GroupNo
                    const foundGroup = searchedParentGroup.groups.filter(x => x.key === searchedGroup.key) ;
                    const groupNo = 
                        (foundGroup.length === 0 ) ? 0 
                        // @ts-ignore
                        : _.maxBy(foundGroup , "group_no").group_no + 1 ; 
                    //console.log("Group " + groupNo) ; 

                    // 分割後のGroupを格納する親グループ作成 ParentGroup
                    const newParentGroup = TProductionDayGroup.create(
                        this.manager , 
                        searchedGroup.m_production_id ,
                        searchedGroup.planed_production_at , 
                        searchedGroup.level , 
                        newGrouplist , searchedGroup.target ,searchedGroup.key ,searchedGroup.title , groupNo )  ; 
                    //newParentGroup.m_production_id = searchedGroup.m_production_id ; 
                    //newParentGroup.planed_production_at =  searchedGroup.planed_production_at ;
                    //newParentGroup.level = searchedGroup.level ; 

                    newParentGroup.groups.push(...newGroups) ; 

                    // 分割後のGroupを格納する親グループを親の親グループに入れる    
                    const prtIdx = searchedParentGroup.groups.indexOf(searchedGroup) ;
                    searchedParentGroup.groups.splice(prtIdx + 1 , 0 , newParentGroup ) ;

                    return true ; 
                }
                else {                     
                    const rtn = func(searchedGroup , g , sepGroup ) ; 
                    if ( rtn ) return rtn ; 
                }
            }

            return false ; 
        }

        let isFound = false ; 
        for ( const tProduction of this.tProductions){            
            for ( const day of tProduction.t_production_days ) { 
                for ( const g of day.groups ){                    
                    isFound = func(day , g , group ) ; 
                    if ( isFound) break ; 
                }

                if ( isFound){
                    // Rootノードを取得し、情報をUpdate
                    day.updateKeyGroupNo4Children() ;              
                    return ; 

                }
            }
        }

    } 


    
    /**
     * 指定されたGruopを指定されたListとそれ以外に分割する
     * @param tProductions 
     * @param group 
     */
     protected separateGroupByListIds (group:TProductionDayGroup ,list:Array<TProjectProductProcess> ) {

        const otherList:Array<TProjectProductProcess> = group.t_project_product_processes.filter(x => list.indexOf(x) === -1 ) ; 
        
        const parentGroup = this.manager.finder.findParentGroup(group) ; 
        if ( parentGroup === undefined ) return  ; 

        const insIdx = parentGroup.groups.indexOf(group) ; 
        //console.log(parentGroup) ; 
        //console.log(group) ; 
        // console.log("insIdx:" + insIdx) ; 

        //console.log("before ") ; 
        //console.log(JSON.stringify(group.t_project_product_processes)) ; 
        
        const groupA = group.lightCopy() ;         
        groupA.t_project_product_processes.splice(0) ; 
        groupA.t_project_product_processes.push(...list ) ; 
        groupA.groups.splice(0) ; 
        // @ts-ignore
        //console.log(list[0].t_project_product.name + ":" + list[0]["m_production_mode_id_01"]  ) ; 
        groupA.clearPrimaryKey() ; 

        const groupB = group.lightCopy() ; 
        groupB.t_project_product_processes.splice(0) ; 
        groupB.t_project_product_processes.push(...otherList ) ; 
        groupB.groups.splice(0) ; 
        // @ts-ignore
        //console.log(otherList[0].t_project_product.name  + ":" + otherList[0]["m_production_mode_id_01"]  ) ; 
        groupB.clearPrimaryKey() ; 
        
        this.manager.removeGroup(group  ,false ,false  ) ; 
        //this.manager.removeGroup(group  ) ; 
        // @ts-ignore
        //console.log(groupA.t_project_product_processes[0].t_project_product.name + ":A " + groupA.t_project_product_processes[0]["m_production_mode_id_01"]  ) ; 
        // @ts-ignore
        //console.log(groupB.t_project_product_processes[0].t_project_product.name + ":B " + groupB.t_project_product_processes[0]["m_production_mode_id_01"]  ) ; 

        // console.log("t_production_results-g") ; 
        // console.log(groupA.groups) ; 
        //console.log(groupA) ; 
        this.addGroup(parentGroup , groupA ,insIdx ) ; 
        this.addGroup(parentGroup , groupB ,insIdx + 1 ) ; 
        // @ts-ignore
        //console.log(groupA.t_project_product_processes[0].t_project_product.name + ":A2 " + groupA.t_project_product_processes[0]["m_production_mode_id_01"]  ) ; 
        // @ts-ignore
        //console.log(groupB.t_project_product_processes[0].t_project_product.name + ":B2 " + groupB.t_project_product_processes[0]["m_production_mode_id_01"]  ) ; 
        //console.log("after ") ; 
        //console.log(JSON.stringify(group.t_project_product_processes)) ; 

    } 



}