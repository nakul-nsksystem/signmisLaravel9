
import _ from "lodash";
import DayJsEx from "../../../../frameworks/DayJsEx";
import ITProductionUtil from "../ITProductionUtil";
import { ITProduction , TProduction } from "./TProduction";
import { TProductionGroupAbstract } from "./TProductionAbstract";
import TProductionGroupManager from "../TProductionGroupManager";
import { TProductionResult } from "./TProductionResult";
import { TProductionProcessPlan } from "./TProductionProcessPlan";
import TProductionConsts from "../../../../consts/TProductionConsts";
import { TProjectProductProcess } from "../../../tProjects/class/models/TProjectProductProcess";
import {IDbSoftDelete } from "../../../../models/IDbSoftDelete"
import { TProductionDay } from "./TProductionDay";
import ArrayUtil from "../../../../frameworks/ArrayUtil";
import { TProjectProductProcessPredicted } from "../../../tProjects/class/models/tsMixins/TProjectProductProcessPredicted";
import TProjectProductProcessUtil from "../../../tProjects/class/TProjectProductProcessUtil";
import { PdtGrouperAbstract } from "./grouper/PdtGrouper";
import { TProjectProduct } from "../../../tProjects/class/models/TProjectProduct";
import { MProcessCategoryService } from "../../../masters/class/services/MProcessCategoryService";

import { useStore } from "../../../../stores/mainStore";

export interface ITProductionGroup extends ITProduction{
    t_production_day_id?:number ; 
    parent_t_production_day_group_id?:number ; 
    m_production_id:number ;
    planed_production_at :any

    key:string  
    target :string 

    title:string 
    group_no:number 

    uid?:string 
    level:number 

}


export class TProductionDayGroup extends TProductionGroupAbstract implements ITProductionGroup ,IDbSoftDelete{ 
    protected manager:TProductionGroupManager 
    public t_production_day_id?:number ; 
    public parent_t_production_day_group_id?:number ; 
    public key:string  
    public target :string 
    public title:string 
    public level:number 
    public group_no:number 
    public order_no?:number 

    public planned_at?:any 

    public planed_production_at :any 
    public t_production_results : Array<TProductionResult> 
    
    
    public deleted_at: Date|null;

    private store = useStore()

    constructor(
        manager : TProductionGroupManager , 
        mProductionId:number , 
        day:any ,
        level:number , 
        list:Array<TProjectProductProcess>  ,
        key:string  ,
        target:string ,  
        title:string ,
        groupNo:number = 0 ,
        orderNo:number = 0) {

        super(mProductionId ,list) ; 
        this.manager = manager ; 
        this.planed_production_at = day  ; 
        this.level = level ; 
        this.key = key ; 
        this.target = target ; 
        this.title = title ; 
        this.group_no = groupNo ; 
        this.order_no = orderNo ; 
        this.t_production_results = [] ; 
        this.deleted_at = null ; 
    }

    get IsTProductionDayGroup():boolean{
        return true ; 
    }


    toJSON () {

        
        // t_production_process_plan　の pivot更新用
        let outputList:Array<any> = [] ; 
        // @ts-ignore
        // console.log(this.t_project_product_processes[0].predicted_work_hour) ; 
        if (this.t_production_day_groups.length == 0 && ! this.isDelete ) {
            outputList = this.t_project_product_processes.map(x => {
                
                const row:Partial<TProjectProductProcess & TProjectProductProcessPredicted> = {
                    id : x.id ,                    
                    // planed_production_at : x.planed_production_at ,
                    t_production_process_plan : x.t_production_process_plan ?? undefined,
                    t_production_results : x.t_production_results  ,
                }
                const pdtCName = `m_production_id_${x.tmp_target_production_no}` ; 
                const pdtModeCName = `m_production_mode_id_${x.tmp_target_production_no}` ; 
                const pdtOptionCName = `m_production_option_id_${x.tmp_target_production_no}` ; 

                // @ts-ignore
                row[pdtCName]       = x[pdtCName] ; 
                // @ts-ignore
                row[pdtModeCName]   = x[pdtModeCName] ; 
                // @ts-ignore
                row[pdtOptionCName] = x[pdtOptionCName] ; 


                
                
                // row.display_01 = x.display_01 ; 
                // row.display_02 = x.display_02 ; 
                // row.display_03 = x.display_03 ; 
                // row.display_04 = x.display_04 ; 
                // row.display_05 = x.display_05 ; 

                // Display関係反映
                TProjectProductProcessUtil.assignDisplayValues(row, x) ; 

                if ( TProjectProductProcessPredicted.is(x)){
                    // console.log(x) ; 
                    TProjectProductProcessUtil.assignCostAndTimeValues(row, x) ; 

                    // row.predicted_material_cost_per_job = x.predicted_material_cost_per_job ; 
                    // row.predicted_material_cost_per_qty = x.predicted_material_cost_per_qty ; 
                    // row.material_cost = x.material_cost; 

                    // row.predicted_outsource_cost_per_job = x.predicted_outsource_cost_per_job ; 
                    // row.predicted_outsource_cost_per_qty = x.predicted_outsource_cost_per_qty ;                     
                    // row.outsource_cost = x.outsource_cost ; 

                    // row.predicted_work_cost_per_job = x.predicted_work_cost_per_job ; 
                    // row.predicted_work_cost_per_qty = x.predicted_work_cost_per_qty ;                     
                    // row.work_cost = x.work_cost ; 

                    // row.predicted_cost_per_job = x.predicted_cost_per_job ; 
                    // row.predicted_cost_per_qty = x.predicted_cost_per_qty ; 
                    // row.total_cost = x.total_cost ; 
        
                    // row.predicted_work_hour = x.predicted_work_hour ; 
                    // row.predicted_sec_per_job = x.predicted_sec_per_job ; 
                    // row.predicted_sec_per_qty = x.predicted_sec_per_qty; 
    
                }
                
                return row ; 
    
            }) ; 

            for ( const x of outputList){
                //0console.log(x.t_production_process_plan) ; 
                if ( x.t_production_process_plan === undefined ){
                    x.t_production_process_plan = new TProductionProcessPlan(this.created_m_user_id ?? 0) ;                     
                }
                x.t_production_process_plan.order_no = outputList.indexOf(x)  ; 
                x.t_production_process_plan.updated_m_user_id = this.updated_m_user_id ; 
                
                
            }
    
        }

        // Deleted_atの伝播
        for ( const g of this.t_production_day_groups){
            if ( this.isDelete){
                g.deleted_at = this.deleted_at ; 
            }
        }

        
        return {
            //m_production_id: this.m_production_id,
            id          : this.id , 
            key         : this.key , 
            target      : this.target , 
            title       : this.title , 
            level       : this.level , 
            group_no : this.group_no , 
            order_no : this.order_no ,             
            parent_t_production_day_group_id: this.parent_t_production_day_group_id ?? null , 
            planed_production_at : DayJsEx.format(this.planed_production_at ), 
            created_m_user_id : this.created_m_user_id , 
            updated_m_user_id : this.updated_m_user_id , 
            t_production_results : this.t_production_results , 
            t_production_day_groups : this.t_production_day_groups , 
            t_project_product_processes : outputList  ,
            deleted_at : this.deleted_at ,

            
            //list: JSON.stringify(this.list),
            //groups : JSON.stringify(this.groups) 
        }
    }

    /**
     * 削除されているかどうか
     */
    get isDelete() :boolean { 
        return !_.isNil(this.deleted_at) ; 
    }

    /**
     * 生産状態
     * 　0:未生産
     * 　10:生産中
     * 　20:生産完了
     */
    get status():number { 

        if ( this.isSelfResults ) return TProductionConsts.Results.Status.C_STATUS_FINISHED ; 
        
        // 親が終了しているかチェック
        if ( this.finishedParentGroup !== undefined ) return TProductionConsts.Results.Status.C_STATUS_FINISHED ; 
        
        // 子が終了しているかチェック        
        // const finishedGroups = this.groups.filter(x => x.t_production_results.length > 0) ; 
        // if ( this.groups.length > 0 && this.resultGroups.length === this.groups.length) return TProductionConsts.Results.Status.C_STATUS_FINISHED ; 
        if ( this.isAllChildrenGroupFinished ) return  TProductionConsts.Results.Status.C_STATUS_FINISHED  ; 
        if ( this.isPartChildrenGroupFinished) return  TProductionConsts.Results.Status.C_STATUS_INPROGRESS  ; 

        // 工程明細で完了しているかチェック
        if ( this.t_project_product_processes !== undefined){
            const filterd = this.t_project_product_processes.filter( x => {
                if ( x.t_production_results === undefined) return false ; 
                const notDeleted = x.t_production_results.filter(z => _.isNil(z.deleted_at)) ; 
                return notDeleted.length > 0 ; 
            }) ; 

            if ( filterd.length !== 0 ){
                if ( this.t_project_product_processes.length === filterd.length){
                    // 全部の工程が完了している。
                    return TProductionConsts.Results.Status.C_STATUS_FINISHED ; 
                }
                else { 
                    return TProductionConsts.Results.Status.C_STATUS_INPROGRESS ; 
                }
                
            }
    
        }

        return TProductionConsts.Results.Status.C_STATUS_PLANED 

        
    }   

    /**
     * 未生産状態
     */
    get isUnplanned():boolean { 
        return this.status === TProductionConsts.Results.Status.C_STATUS_PLANED ; 
    }

    /**
     * 自身が生産実績有り
     */
    get isSelfResults():boolean { 
        const validResults = this.t_production_results.filter(x => _.isNil(x.deleted_at) )
        return validResults.length > 0 ; 
    }

    /**
     * 子グループで実績のあるグループ（1階層のみ）
     */
    get resultGroups():Array<TProductionDayGroup>{

        const finishedGroups = this.groups.filter(x => {
            const validResults = x.t_production_results.filter(x => _.isNil(x.deleted_at) ) ; 
            return validResults.length > 0 ; 
        }) ; 
        return finishedGroups ; 
    }

    /**
     * 子いずれかのグループで実績がある
     */
    get isExistsResultsChild():boolean { 
        for ( const g of this.groups ) { 
            if ( g.isSelfResults ) return true ; 

            if ( g.isExistsResultsChild ) return true ; 
        }

        return false ; 
        
    }

    /**
     * 実績の入っている親を取得
     */
    get finishedParentGroup():TProductionDayGroup | undefined {
        // 親が終了しているかチェック
        if ( this.parentGroup === undefined ) return undefined ; 

        if ( ! ITProductionUtil.isTProductionDayGroup(this.parentGroup)) return undefined ; 
        const prtG:TProductionDayGroup = this.parentGroup ;        

        // hit
        const validResults = prtG.t_production_results.filter(x => _.isNil(x.deleted_at)) ; 
        if ( validResults.length > 0) return prtG ; 

        return prtG.finishedParentGroup ; 
    }

    /**
     * 子グループが全部おわっているか
     */
    get isAllChildrenGroupFinished():boolean{

        if ( this.groups.filter(x => _.isNil(x.deleted_at)).length === 0 ) return false ; 

        for ( const g of this.groups){ 
            if (! _.isNil(g.deleted_at) ) continue ; 
            
            if ( g.status !== TProductionConsts.Results.Status.C_STATUS_FINISHED ) {
                return false ; 
            }
        }
        return true ; 

    }

    
    /**
     * 子グループが一部おわっているか
     */
     get isPartChildrenGroupFinished():boolean{

        if ( this.groups.length === 0 ) return false ; 

        for ( const g of this.groups){ 
            if (! _.isNil(g.deleted_at) ) continue ; 
            
            if ( g.status !== TProductionConsts.Results.Status.C_STATUS_PLANED ) {
                return true ; 
            }
        }
        return false ; 

    }

    /**
     * key と t_project_product_processesの内容がマッチしていないものが存在する
     */
    get isExistsMismatchKey():boolean{
        return this.mismatches.length > 0 ; 
    }

    /**
     * key と t_project_product_processesの内容がマッチしていないprocessのリスト
     */
    get mismatches():TypeTProductionDayGroup_Mismatch[]{
        // キー取得の為、Grouper取得
        const pdtGrouper = this.manager.grouper.groupers.find(x => x.def.target === this.target) ; 
        if ( _.isNil(pdtGrouper)){
            console.error("Grouper is not found") ;
            return []; 
        }

        const misMatches:TypeTProductionDayGroup_Mismatch[] = [] ; 

        // 生産先が違う
        if ( this.level === 0 ){

            for ( const process of this.t_project_product_processes){
                if ( _.isNil( process.tmp_target_production_no )) continue ; 
                const pdtCName = `m_production_id_${process.tmp_target_production_no}` ; 
                // console.log(pdtCName) ; 
    
                // @ts-ignore
                const toMProductionId:number = process[pdtCName] ; 
                if ( _.isNil(toMProductionId) ) continue ; 
                // console.log("toMProductionId : " + toMProductionId) ; 
                
                if (toMProductionId != this.m_production_id ){
    
                    // @ts-ignore
                    const fromMProduction = this.store.masters.getMProductionById(this.m_production_id ) ; 
                    const fromName = fromMProduction?.name ?? "" ; 
    
                    // @ts-ignore
                    const toMProduction = this.store.masters.getMProductionById(toMProductionId ) ; 
                    const toName = toMProduction?.name ?? "" ; 
    
    
                    const row:TypeTProductionDayGroup_Mismatch = { 
                        t_project_product_process : process , 
                        grouper : undefined , 
                        isMProductionChange : true , 
                        title : "生産先" ,
                        fromKey : this.m_production_id.toString() , 
                        toKey : toMProductionId.toString() , 
                        fromConvertedKey : fromName , 
                        toConvertedKey : toName , 
                    } ; 
                    misMatches.push(row) ; 
                }
    
            }        
        }

        // キーが違うProcessesを調査
        const misMatched = this.t_project_product_processes.filter(x => {             
            return pdtGrouper.getKey(x) != this.key ; 
        }) ; 

        for ( const process of misMatched){
            const toKey = pdtGrouper.getKey(process)  ; 
            const row:TypeTProductionDayGroup_Mismatch = { 
                t_project_product_process : process , 
                grouper : pdtGrouper , 
                isMProductionChange : false , 
                title : pdtGrouper.def.title ,
                fromKey : pdtGrouper.getConvertedKey(this.key) , 
                toKey : pdtGrouper.getConvertedKey(toKey) , 
                fromConvertedKey : pdtGrouper.getConvertedName(this.key) , 
                toConvertedKey : pdtGrouper.getConvertedName(toKey) , 
            } ; 
            misMatches.push(row) ; 
        }



        return misMatches ; 

    }

    
    /**
     * key と t_project_product_processesの内容がマッチしていないprocessのリスト（子を含む）
     */
    get mismatchesIncChildren():TypeTProductionDayGroup_Mismatch[]{
        const list:TypeTProductionDayGroup_Mismatch[] = [...this.mismatches] ; 
        
        for ( const g of this.groups ) { 
            const tempList = g.mismatchesIncChildren ; 
            list.push(...tempList) ; 
        }

        return list ; 
    }

    /**
     * 親子あわせて変更点を取得
     */
    get mismatchesIncChildrenAndParents():TypeTProductionDayGroup_Mismatch[]{
        const list:TypeTProductionDayGroup_Mismatch[] = [...this.mismatchesIncChildren] ; 
        
        let pG = this.parentGroup ; 
        while (TProductionDayGroup.is(pG)){
            list.push(... pG.mismatches) ; 
            pG = pG.parentGroup ; 
        }
        return list ; 
    }

    

    /**
     * mismatchesIncChildrenをTProjectProduct単位に変更点をまとめたリスト
     */
    get mismatchesIncChildren_ByTProjectProduct():TypeTProductionDayGroup_Mismatch_TProjectProduct[]{
        const list:TypeTProductionDayGroup_Mismatch_TProjectProduct[] = [] ; 

        for ( const m of this.mismatchesIncChildren) {
            if ( _.isNil(m.t_project_product_process.t_project_product)) continue ; 

            let row = list.find(x => x.t_project_product == m.t_project_product_process.t_project_product)            
            if (row === undefined ){
                row = {
                    t_project_product:m.t_project_product_process.t_project_product , 
                    mismatches : [] , 
                }
                list.push(row) ; 
            }

            row.mismatches.push(m) ; 


        }


        return list ; 
    }

    
    /**
     * 親Groupを取得
     * @returns 
     */
    get parentGroup():TProductionGroupAbstract | undefined { 
        return this.manager.finder.findParentGroup(this) ; 
    }

    get allChildrenGroup():Array<TProductionDayGroup> { 
        const groups = [...this.groups] ; 
        for ( const g of this.groups){            
            groups.push(...g.allChildrenGroup) ; 
        }
        
        return groups; 
    }

    /**
     * 最下層のGroupを取得
     */
    get lastChildrenGroups():Array<TProductionDayGroup> { 
        
        const lastGroups = [] ; 
        if ( this.groups.length === 0 ) lastGroups.push(this) ; 
        for ( const g of this.groups){            
            if ( _.isNil(g.deleted_at)){
                lastGroups.push(...g.lastChildrenGroups) ; 
            }
            
        }
        
        return lastGroups; 

    }

    get tProductionDay():TProductionDay|undefined { 
        const day = this.manager.finder.findByMProductionIdAndDay(this.m_production_id , this.planed_production_at) ;     
        return day ; 
    }

    /**
     * uid
     */
    get uid():string { 
        
        let groupUid = `${this.m_production_id}@${DayJsEx.formatDate(this.planed_production_at)}@` ; 
        
        for ( let i:number = 0 ; i < this.level ; i++) {
            const keyCName:string = `level_${i}_key`  ; 
            // @ts-ignore
            const key = this[keyCName] ; 

            const groupNoCName:string = `level_${i}_group_no`  ; 
            // @ts-ignore
            const groupNo = this[groupNoCName] ; 

            groupUid += `${key}[${groupNo}]@` ; 
        }
        
        groupUid += `${this.key}[${this.group_no}]@` ; 

        return groupUid ; 
    }

    /**
     * SoftDelete
     * 
     * @param isTemporary  true:一時的な移動などの為の削除 false:deleted_atを設定
     * @param isDeleteOnlySelf true:自身のみ (親の削除有り、子の削除なし)　false:自身＋子の削除
     */
    public delete(isTemporary:boolean ,isDeleteOnlySelf:boolean = false ) { 
        //console.log("Delete ") ; 
        const list = [...this.t_project_product_processes] ; 

        // 自分しか残っていない親を削除
        const parentDeleteFunc = () => {
            const parentG = this.parentGroup ;
            // console.log("parentG")              ;
            // console.log(parentG)              ;

            if ( parentG !== undefined){                
                if ( ITProductionUtil.isTProductionDay(parentG)){
                    const notMatchedList = parentG.t_project_product_processes.filter(x => list.indexOf(x) === -1) ; 
                    parentG.t_project_product_processes.splice(0 ) ; 
                    parentG.t_project_product_processes.push(...notMatchedList) ; 
                    
                }
                else if (ITProductionUtil.isTProductionDayGroup(parentG)) {
                    if ( parentG.isDelete ) return ; 

                    const notMatchedList = parentG.t_project_product_processes.filter(x => list.indexOf(x) === -1) ; 
                    // console.log("parent " + parentG.uid + " not mached count : " + notMatchedList.length) ; 
                    if ( notMatchedList.length === 0 ){
                        // 全削除
                        parentG.delete(false , true ) ; 
                    }
                    else { 
                        parentG.t_project_product_processes.splice(0 ) ;                     
                        parentG.t_project_product_processes.push(...notMatchedList) ; 
                    }
                    
                }
            }
        }

        // console.log("isDeleteOnlySelf " + isDeleteOnlySelf) ; 
        // console.log("isTemporary " + isTemporary) ; 

        if (  isDeleteOnlySelf) {         
            // console.log("parentDeleteFunc");
            parentDeleteFunc() ; 
        }

        // 自身の削除
        if (isTemporary ||  _.isNil(this.id)){ 
        // if ( _.isNil(this.id)){ 
            const pG = this.parentGroup ;
            //console.log("pG : " + this.uid ) ; 
            //console.log(pG ) ; 
             
            if ( pG !== undefined){
                const pGIdx = pG.t_production_day_groups.indexOf(this) ; 
                pG.t_production_day_groups.splice(pGIdx ,1 )  ; 
            }

        } 
        else { 
            this.deleted_at = new Date() ; 
            this.updated_m_user_id = this.manager.loginMUserId  ; 
            // this.t_project_product_processes.splice(0) ; 

            if ( ! isDeleteOnlySelf) { 
                // 子の削除
                const groups = this.t_production_day_groups.filter(x => _.isNil(x.deleted_at)) ; 

                for ( const g of groups) 
                {
                    //console.log(g.id) ; 
                    g.delete(isTemporary) ; 
                }
    
            }
        
        }

        


    }

    /**
     * IDのクリア
     */
    public clearPrimaryKey() { 
        this.id = undefined ; 
        for ( const p of this.t_project_product_processes){
            if (! _.isNil( p.t_production_process_plan)){ 
                p.t_production_process_plan.id = undefined , 
                p.t_production_process_plan.t_production_day_group_id = undefined ;                 
                p.t_production_process_plan.t_project_product_process_id = undefined ;                 
                
            }
            
        }
    }

    /**
     * ライトコピー
     * @param group 
     * @returns 
     */
    public lightCopy( ){
        
        const row = TProductionDayGroup.create(
            this.manager , 
            this.m_production_id , 
            this.planed_production_at , 
            this.level ,             
            [...this.t_project_product_processes] ,
            this.target ,
            this.key , 
            this.title , 
            this.group_no ,
        ) ; 
        //Object.assign(row,this );

        row.t_project_product_processes = [...this.t_project_product_processes] ; 
        row.groups = [...this.groups] ; 
        row.t_production_results = [...this.t_production_results] ; 

        return row ; 
    }

    
    
    /**
     * グループのレベルの情報を取得
     * @param group 
     * @param level 
     */
     public getInfoByLevel(level:number) {
        return { 
            // @ts-ignore
            key : this[`level_${level}_key`] ?? this[`key`] ,
            // @ts-ignore
            target : this[`level_${level}_target`] ?? this[`target`] ,
            // @ts-ignore
            title : this[`level_${level}_title`] ?? this[`title`] ,  
            // @ts-ignore
            group_no : this[`level_${level}_group_no`] ?? this[`group_no`] ,
        } ; 
    } 


    /**
     * 生産モード変更
     * @param mode MProductionMode
     */
    public async updateMProductionMode( mode:TProductionDayGroup){

        // @ts-ignore
        const modeId:number = mode.id ; 

        // 情報が不足するため再取得
        for ( const row of this.t_project_product_processes ) {
            // @ts-ignore
            const tgtProdNo = row.tmp_target_production_no ; 
            const mProdModeCName = `m_production_mode_id_${tgtProdNo}` ;

            // @ts-ignore
            row[mProdModeCName] = modeId ; 

        }

        // Displayとコスト更新
        await TProjectProductProcessUtil.updateInfoByMProductionChanges(this.t_project_product_processes) ;
        // console.log("updateMProductionMode") ; 
        // グループ情報更新
        const parentGroup = this.parentGroup ;         
        if ( parentGroup === undefined )  return ; 

        const newKey = modeId.toString() ;  
        let unionToGroup  = undefined ; 
        for ( const g of parentGroup.groups)
        {
            if ( g.key == newKey && g.isUnplanned){
                unionToGroup = g ; 
                break ; 
            } 
        }


           
        // Groupの変更
        if ( unionToGroup === undefined ) {
            const groupNo = this.manager.getNewGroupNo(parentGroup ,newKey ) ; 
            this.group_no = groupNo ;

        }
        else { 
            // 既にあるグループに統合
            
            unionToGroup.t_project_product_processes.push(... this.t_project_product_processes ) ;
            
            for ( const g of this.groups){
                const filterd = unionToGroup.groups.filter(x => x.key == g.key)  ; 
                const newGroupNo = this.manager.getNewGroupNo(unionToGroup ,g.key ) ; 
                g.group_no = newGroupNo ; 
                unionToGroup.groups.push(g) ;     
            }
            // unionToGroup.groups.push(... this.groups) ; 

            this.t_project_product_processes.splice(0) ; 

            const groupNo = this.manager.getNewGroupNo(parentGroup ,newKey ) ; 
            this.group_no = groupNo ; 
             

            //parentGroup.groups.splice(parentGroup.groups.indexOf(this) , 1 ) ; 
            this.delete(false , false  ) ; 

            //this.group_no = unionToGroup.group_no ; 
            
        }

        this.key = newKey ; 
        // @ts-ignore
        this.title = mode.name ;     


        // 子グループへのキー反映
        this.updateKeyGroupNo4Children() ; 




    }

    /**
     * 生産予定日の変更
     * @param dayAt 
     */
    public updatePlanedProductionAt(dayAt:string|Date){

        const func = function ( group:TProductionDayGroup , day:any ) { 
            group.planed_production_at = day ; 

            if ( group.groups.length !== 0 ){
                for ( const g of group.groups ) { 
                    func(g , day)
                }
            }
        }        

        func(this, dayAt) ; 

    }

    /**
     * 所属する日付Groupを取得
     * @param manager 
     * @returns 
     */
    public getDay():TProductionDay | undefined {
        const day = this.manager.finder.findByMProductionIdAndDay(this.m_production_id , this.planed_production_at) ; 
        return day ; 
    }

    /**
     * 生産状態を未生産にする
     */
    public changeStatusToUnplanned(){
        const savedResults = this.t_production_results.filter(x => ! _.isNil(x.id) )
        
        for ( const r of savedResults){
            r.deleted_at = new Date() ; 
        }
        
        ArrayUtil.resetInsert(this.t_production_results , savedResults ) ; 
        
        
    }

    /**
     * t_project_product_processes の tmp_target_production_noを指定
     * @returns 
     */
    // public async updateProcessesTargetProductionNo(){
    //     const day = this.getDay() ; 
    //     if ( _.isNil(day)) return ; 

    //     const processCategoryMKvId = day.process_category_m_kv_id ; 

    //     // カテゴリーからありえる生産先を取得して対象の生産先Noを特定する
    //     const targetMProductionIds:number[] = await MProcessCategoryService.getMProductionIdsByCategoryMKvId(processCategoryMKvId) ;   

    //     for ( const p of this.t_project_product_processes) {
    //         p.updateTargetProductionNo(targetMProductionIds) ;
    //     }
        
    // }

    public static async parse(manager : TProductionGroupManager ,day:TProductionDay , obj:Partial<TProductionDayGroup>)
        :Promise<TProductionDayGroup>{
        return new Promise(async (resolve,reject) => {             

            const row 
                = new TProductionDayGroup(
                    manager ,
                    obj.m_production_id ?? 0 , 
                    day.day  , 
                    obj.level ?? 0 , 
                    obj.t_project_product_processes ?? [], 
                    obj.key ?? "", 
                    obj.target ?? "", 
                    obj.title ?? "", 
                    obj.group_no ,
                    obj.order_no ,
                    ) ;  
            Object.assign(row, obj);

            const isNeededPushProcesses = row.t_project_product_processes.length === 0  ; 
            
            // listをParse
            if ( !isNeededPushProcesses) { 

                try { 
                    if ( _.isNil(day)) {
                        return reject(`day is invalid on TProductionDayGroup.parse().`) ; 
                    } 
            

                    const parsedProcesses:Array<TProjectProductProcess> = [] ; 
                    for ( const p of row.t_project_product_processes) {
                        // @ts-ignore
                        const parsedProc = TProjectProductProcess.parse(p ,p.t_project_product) ;  
                        
                        // parsedProc.updateTargetProductionNo(row.m_production_id) ;
                        parsedProc.updateTargetProductionNo(day.TargetMProductionIds) ;
                        
                        parsedProcesses.push(parsedProc) ; 
                    }
                    row.t_project_product_processes.splice(0) ; 
                    row.t_project_product_processes.push(...parsedProcesses) ; 

    
                }            
                catch (error ) {     
                    reject(error) ; 
                }

                
            }

            // resultをParse
            const parsedResults = row.t_production_results.map(x => TProductionResult.parse(x)) ;         
            ArrayUtil.resetInsert(row.t_production_results , parsedResults) ; 
            
            const parsedGroups = [] ; 
            for ( const g of row.groups){
                g.m_production_id = row.m_production_id ; 
                const parsed = await TProductionDayGroup.parse(manager , day , g) ; 


                // 単価の初期設定
                
                
                // listの更新
                if ( isNeededPushProcesses ){
                    row.t_project_product_processes.push(... parsed.t_project_product_processes) ; 
                } 
                parsedGroups.push(parsed) ;         
            }

            ArrayUtil.resetInsert(row.t_production_day_groups , parsedGroups) ; 
            resolve(row) ; 
        }) ; 
    }

    public static create(
        manager : TProductionGroupManager , 
        mProductionId :number ,
        day:any ,
        level:number ,
        list:Array<TProjectProductProcess>  ,
        keyTarget:string ,
        key:string  ,  
        name:string ,
        groupNo:number = 0 ,
        orderNo:number = 0):TProductionDayGroup 
    { 
        const row = new TProductionDayGroup(
            manager , 
            mProductionId ,
            day , 
            level , 
            [...list] , 
            key ,
            keyTarget , 
            name , 
            groupNo ,
            orderNo ,
        ) ; 

        row.created_m_user_id =  manager.loginMUserId  ; 
        row.updated_m_user_id =  manager.loginMUserId  ; 

        return row ; 

    }

    
    public static is(arg:any):arg is TProductionDayGroup { 
        if ( arg?.IsTProductionDayGroup === undefined) return false ; 
        return arg.IsTProductionDayGroup ; 
    } 
    



}


/**
 * mismatchesで使用
 */
export type TypeTProductionDayGroup_Mismatch = { 
    t_project_product_process:TProjectProductProcess , 
    grouper : PdtGrouperAbstract|undefined , 
    isMProductionChange : boolean , 
    title : string , 
    fromKey : string ,
    toKey : string , 
    fromConvertedKey : string , 
    toConvertedKey : string , 
}

/**
 * mismatchesIncChildren_ByTProjectProductで使用
 */
export type TypeTProductionDayGroup_Mismatch_TProjectProduct = { 
    t_project_product:TProjectProduct , 
    mismatches : TypeTProductionDayGroup_Mismatch[] , 

}