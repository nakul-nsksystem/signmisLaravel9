import axios from "axios";
import dayjs from "dayjs";
import _ from "lodash";
import DayJsEx from "../../../frameworks/DayJsEx";
import { MProcessCategoryService } from "../../masters/class/services/MProcessCategoryService";
import { MProductionGroupConfigService } from "../../masters/class/services/MProductionGroupConfigService";
import { TProjectProductProcess } from "../../tProjects/class/models/TProjectProductProcess";
import { TProjectProductProcessService, TypeTProjectProductProcess_getUnPlanned } from "../../tProjects/class/services/TProjectProductProcessService";
import { IHasProductionGroupCondition } from "./models/grouper/PdtGrouper";
import { TProduction } from "./models/TProduction";
import { TProductionDay } from "./models/TProductionDay";
import { TProductionDayService, TypeTProductionDay_GetBy } from "./services/TProductionDayService";
import TProductionGroupManager from "./TProductionGroupManager";
import { useStore } from "../../../stores/mainStore";

export default class TProductionGroupHttp{ 
    private manager:TProductionGroupManager ;

    constructor ( manager:TProductionGroupManager){
        this.manager = manager ; 
    }

    private get tProductions () :Array<TProduction>{
        return  this.manager.tProductions ; 
    }

    private store = useStore()

    /**
     * グループ設定
     */
    //  private get epProductionGroupConfig() : string { 
    //     return "api/mProductionGroupConfig" ; 
    // }
    

    /**
     * エラー作成
     * @param msg 
     * @param data 
     * @returns 
     */
    private makeError(msg:string ,data:object ):object{
        return {
            response:{
                status:-100 ,
                statusText:msg , 
                data : data ,
                
            }
        } ; 
    }

    /**
     * グルーピングのデフォルト条件取得
     * @param mBranchId 
     * @param processCategoryMKvId 
     * @returns 
     */
    // public async getDefaultGroupConfig(mBranchId:number ,processCategoryMKvId:number )
    //     :Promise<IHasProductionGroupCondition|undefined>{
    //     return new Promise(async (resolve,reject) => {             
    //         const apiUrl = `${this.epProductionGroupConfig}/findByBranchAndProcessCategoryMkv/${mBranchId}/${processCategoryMKvId}`; 

    //         try { 
    //             const res = await axios.get(apiUrl) ;
    //             if ( res.data.length === 0 ){                    
    //                 resolve(undefined) ; 
    //             }   
    //             else{
    //                 resolve(res.data) ; 
    //             }
    //         }            
    //         catch (error) {
    //             // @ts-ignore
    //             error.ep = apiUrl ; 
    //             reject(error) ; 

    //         }

            
    //     }) ; 
    // }


    /**
     * 生産予定を取得
     * @param mProductionId 生産先ID
     * @param day 対象日
     * @param processCategoryMKvId 加工カテゴリー
     * @param defaultProductionGroupConfig  デフォルトのグループ条件
     * @returns 
     */
    public async getTProductionDayBy(
        mProductionId:number ,
        day:string ,
        processCategoryMKvId:number ,
        defaultProductionGroupConfig:IHasProductionGroupCondition|undefined)
        :Promise<TProductionDay> {

        return new Promise(async (resolve,reject) => {             
            try {                 
                const params:TypeTProductionDay_GetBy = {
                    m_production_id : mProductionId,
                    day : day ,
                    process_category_m_kv_id : processCategoryMKvId ,
                }

                // const apiUrl = `${this.epTProductionDay}/searchByDay`  ; 
                // const res = await axios.post(apiUrl ,params ) ; 
                
                // const apiRespDay = res.data ; 

                const apiRespDay = await TProductionDayService.getBy(params) ; 
                
                
                const tProduction = this.manager.tProductions.find(x => x.MProduction.id === mProductionId) ; 
                if ( tProduction === undefined){
                    return reject(this.makeError(`MProduction undefined ${mProductionId}.` ,apiRespDay )) ; 
                } 

                const foundDay = tProduction.t_production_days.find(x => dayjs(x.day).isSame(dayjs(day))) ; 
                //  console.log(`AA ${day}`) ; 
                //  console.log(foundDay) ; 
                // if ( foundDay !== undefined && foundDay.t_project_product_processes.length > 0){
                if ( foundDay !== undefined){
                    // ロード済み
                    const idx = tProduction.t_production_days.indexOf(foundDay) ; 
                    resolve(foundDay); 
                    try {
                        // console.log("A") ; 
                        // const replaceDay = await TProductionDay.parse(this.manager , apiRespDay) ; 
                        // if ( replaceDay !== undefined ){
                        //     replaceDay.day = DayJsEx.format(replaceDay.day) ; 
                        //     tProduction.t_production_days.splice(idx , 1 , replaceDay ) ; 
                        // }
                        
                        // console.log(replaceDay) ; 
                        // resolve(replaceDay); 
                    }
                    catch (error) {
                        reject(error) ; 
        
                    }
                    
                    
                }
                else { 
                    let insertDay:TProductionDay|undefined ; 
                    // console.log(insertDay) ; 
                    if ( apiRespDay === undefined || ! apiRespDay ) { 
                        // 存在しないため新規
                        insertDay = new TProductionDay(mProductionId ,day ,processCategoryMKvId  , []) ; 

                        // @ts-ignore
                        const mBranch = this.store.masters.getMBranchById(tProduction.MProduction.m_branch_id )  ; 
                        // @ts-ignore
                        insertDay.planed_start_at = mBranch?.production_start_at ?? "09:00" ; 
                        // @ts-ignore
                        insertDay.planed_end_at = mBranch?.production_end_at ?? "18:00" ; 
                        insertDay.created_m_user_id = this.manager.loginMUserId  ; 

                        const defSettings = defaultProductionGroupConfig ; 
                        if ( defSettings !== undefined){
                            insertDay.group_target_01 = defSettings.group_target_01 ; 
                            insertDay.group_target_02 = defSettings.group_target_02 ; 
                            insertDay.group_target_03 = defSettings.group_target_03 ; 
                            insertDay.group_target_04 = defSettings.group_target_04 ; 
                            insertDay.group_target_05 = defSettings.group_target_05 ; 

                        }
                        

                    }
                    else { 
                        try { 
                            // console.log("B") ; 
                            insertDay = await TProductionDay.parse(this.manager ,apiRespDay ) ; 
                        }
                        catch ( error ){
                            console.log(apiRespDay) ; 
                            return reject(this.makeError(`parsing day is failed.` ,apiRespDay )) ; 
                        }
                        
                        // if ( insertDay === undefined ) { 
                        //     console.log(apiRespDay) ; 
                        //     return reject(this.makeError(`parsing day is failed.` ,apiRespDay )) ; 
                        // }

                        // 秒を消す            
                        insertDay.day = DayJsEx.format(insertDay.day) ; 
                        insertDay.planed_start_at = DayJsEx.getOnlyHm(insertDay.planed_start_at) ; 
                        insertDay.planed_end_at = DayJsEx.getOnlyHm(insertDay.planed_end_at) ; 
                        // insertDay = insertDay as TProductionDay ; 
                    }

                    insertDay.updated_m_user_id = this.manager.loginMUserId  ; 
                    // console.log(`AA ${day}`) ; 
                    if ( tProduction.t_production_days.length === 0 ){
                        tProduction.t_production_days.push(insertDay ) ;                     
                    }
                    else {
                        const firstD = tProduction.t_production_days[0].day  ; 
                        if ( dayjs(firstD).isAfter(insertDay.day)){
                            tProduction.t_production_days.splice(0 , 0 , insertDay ) ;
                        }
                        else { 
                            tProduction.t_production_days.push(insertDay ) ;                     
                        }
                    }

                    // tProduction.t_production_days.push(insertDay ) ;                     
                    const sorted = _.sortBy(tProduction.t_production_days , "day" )  ; 
                    tProduction.t_production_days.splice(0 , tProduction.t_production_days.length , ...sorted) ; 

                    resolve(insertDay); 

                }

                


                
            }
            catch (error) {
                // @ts-ignore
                error.ep = apiUrl ; 
                reject(error) ; 

            }



        }) ; 
    }


    /**
     * 未決定の予定一覧を取得
     * @param day TProductionDay
     * @param processCategoryIds 
     * @param deliveryDateFrom 納期From
     * @param deliveryDateTo 
     * @returns 
     */
    public async getTProjectProductProcesses4unPlanned(day:TProductionDay , processCategoryIds:Array<number> ,deliveryDateFrom:string , deliveryDateTo:string ){
        return new Promise(async (resolve,reject) => { 
            // const apiUrl = this.epTProjectProductProcess + "/searchByMProduction" ; 

            const params:TypeTProjectProductProcess_getUnPlanned = {
                "m_production_id"  : day.m_production_id , 
                "m_process_category_ids"  : processCategoryIds ,
                "delivery_date_from" : deliveryDateFrom ?? "", 
                "delivery_date_to" : deliveryDateTo ?? "", 
            } ;

            // 二重取り防止用
            const existsIds:Array<number> = [] ; 
            const tProductions = this.manager.tProductions ; 
            for ( const tProduction of tProductions){ 
                const filterdList = tProduction.t_project_product_processes.filter(x => x.id !== undefined ) ; 
                existsIds.push(...filterdList.map(x => x.id ?? 0)) ;                 
                
            }

            try {
                // Todo 納期、予定組済みとか対応
                // const res = await axios.post(apiUrl ,params) ; 
                // const respRows = res.data ; 

                const respRows = await TProjectProductProcessService.getUnPlanned(params)  ;
                
                // @ts-ignore
                const unExistsRows = respRows.filter(x => existsIds.indexOf(x.id) === -1) ;                 
                const updatedJobs = unExistsRows.map( (x:TProjectProductProcess) => {          
                    // @ts-ignore          
                    // const parsedProc = TProjectProductProcess.parse(x , x.t_project_product , this.manager.store) ;                              
                    x.updateTargetProductionNo(day.m_production_id) ;
                    return x ; 
                    // parsedProc.updateTargetProductionNo(day.m_production_id) ;
                    // return parsedProc ; 
                }) ;

                // グルーピング用にDay生成して、Grouping後に追加
                // console.log("C") ; 
                const tempDay:TProductionDay|undefined = await TProductionDay.parse(this.manager ,day)  ; 
                
                if ( tempDay !== undefined){
                    tempDay.t_project_product_processes = [...updatedJobs] ; 
                    tempDay.t_production_day_groups = []; 
                    
                    this.manager.grouper.grouping(tempDay) ; 
                    for ( const g of tempDay.t_production_day_groups){
                        const groupNo = this.manager.getNewGroupNo( day , g.key) ; 
                        g.group_no = groupNo ; 
                        day.t_production_day_groups.push(g) ;
                    }

                    day.t_project_product_processes.push(...updatedJobs) ; 
                    day.updateKeyGroupNo4Children() ; 
                }
                
                resolve("") ; 

            }
            catch (error) { 
                // @ts-ignore
                // error.ep = apiUrl ; 
                reject(error) ; 

            }


            

        }) ; 
    }


    /**
     * 生産予定日の保存
     * @param day 
     * @returns 
     */    
    public async saveTProductionDay( day:TProductionDay){
        return new Promise(async (resolve,reject) => { 
            // @ts-ignore
            const tProduction = this.tProductions.find(x => x.MProduction.id === day.m_production_id ) ; 
            if ( tProduction === undefined ) return ; 

            const dayIndex = tProduction.t_production_days.indexOf(day) ; 

            // this.cGroupManager.grouper.updateGroupCondition(day) ; 

            try {                                
                
                const resData = await TProductionDayService.save(day) ;                 
                const td:TProductionDay|undefined  = await TProductionDay.parse(this.manager , resData)  ; 
                if ( td === undefined ) return reject(this.makeError("TProductionDay parse error" ,resData)) ;
                // console.log(td) ; 
                tProduction.t_production_days.splice(dayIndex ,1 , td )  ; 

                resolve(td) ; 
                
            }
            catch (err) {
                // @ts-ignore
                err.ep = apiUrl ; 
                reject(err) ; 
            }
        }) ; 
        


    } 


    /**
     * 物件からの保存時に情報が変更されている場合、グループを再構築する
     * @param day 
     * @returns 
     */    
     public async updateChangeGroupsByProject( changeGroupIds:Array<number>){
        return new Promise(async (resolve,reject) => { 

            // console.log("groupIds" ) ; 
            // console.log(changeGroupIds) ; 
            try { 
                const groupRes = await axios.post("api/tProductionDayGroup/getProductionDaysByIds" , changeGroupIds) ; 
                const days = groupRes.data ; 
                
                // console.log("days") ;
                // console.log(days) ;

                if ( days.length > 0 ){
                    // もと
                    try {                
                        for ( const day of days ){

                            const processCategoryMKvId = day.process_category_m_kv_id ; 
                            // カテゴリーからありえる生産先を取得して対象の生産先Noを特定する
                            // const getProcessCategoryUrl = `api/mProcessCategory/searchByProductionMKvId/${processCategoryMKvId}` 
                            // const processCategoryRes = await axios.get(getProcessCategoryUrl)  ; 
                            // const processCategories = await MProcessCategoryService.getByCategoryMKvId(processCategoryMKvId) ; 
                            
                            const targetMProductionIds:number[] = await MProcessCategoryService.getMProductionIdsByCategoryMKvId(processCategoryMKvId) ; 
                            // @ts-ignore
                            // processCategories.forEach(x => {
                            //     // @ts-ignore
                            //     const ids = x.m_productions.map(prod => prod.id) ; 
                            //     targetMProductionIds.push(...ids) ; 
                            // });

                            
                            

                            // @ts-ignore
                            const mProduction = this.store.masters.getMProductionById(day.m_production_id) ; 
                            let groupConfig = await MProductionGroupConfigService.getDefault(mProduction.m_branch_id ,processCategoryMKvId ) ;    

                            const resDay = await this.getTProductionDayBy(
                                // @ts-ignore
                                day.m_production_id , DayJsEx.format( day.day) , processCategoryMKvId ,groupConfig ) ; 

                            if ( resDay === undefined){
                                console.error(`ProductionDay is not found. mProductionId:${day.m_production_id} day:${day.day} categoryMKvId:${day.process_category_m_kv_id}`) ; 
                                continue ; 
                            }

                            for ( const p of resDay.t_project_product_processes){
                                p.updateTargetProductionNo(targetMProductionIds) ; 
                            }

                            // 
                            const unmachedList = this.manager.grouper.getUnmachedProcesses(resDay) ; 
                            // console.log("Unmache") ; 
                            // console.log(unmachedList) ; 

                            // 現在のリストから削除
                            if ( unmachedList.length > 0 ) { 
                                const unmachedIds = unmachedList.map(x => x.id) ; 
                                // console.log("unmachedIds") ; 
                                // console.log(unmachedIds) ; 
                                this.manager.removeProcessesByIds(day.m_production_id , resDay.day , unmachedIds ) ; 
                                this.saveTProductionDay(resDay) ; 
                            }
                                        
                            // 生産先ごとにわける。
                            const separatedByProductionList = {} ; 
                            for (const p of unmachedList){
                                const tgtProdNo = p.tmp_target_production_no ; 
                                // @ts-ignore
                                const targetMProductionId = p[`m_production_id_${tgtProdNo}`]  ; 

                                // @ts-ignore
                                if (_.isNil(separatedByProductionList[targetMProductionId])){
                                    // @ts-ignore
                                    separatedByProductionList[targetMProductionId] = [] ; 
                                }
                                // @ts-ignore
                                separatedByProductionList[targetMProductionId].push(p) ; 

                            }
                            // console.log("separatedByProductionList") ; 
                            // console.log(separatedByProductionList) ; 

                            // 動的にロードして保存
                            for (const mProductionId in separatedByProductionList){
                                const numMProductionId = Number(mProductionId) ; 
                                
                                // console.log(numMProductionId) ; 
                                // @ts-ignore
                                const mProduction = this.store.masters.getMProductionById(numMProductionId) ;  
                                groupConfig = await MProductionGroupConfigService.getDefault(mProduction.m_branch_id ,processCategoryMKvId ) ;    
                                // console.log("groupConfig") ; 
                                // console.log(groupConfig) ; 
                                
                                // 一時的な日クラス作成(リスト分のみのグループを作るため)
                                // @ts-ignore
                                const sepList = separatedByProductionList[mProductionId] ;                                 
                                const tempDay = new TProductionDay(numMProductionId ,day.day ,processCategoryMKvId  , sepList) ;                         

                                if ( groupConfig !== undefined){
                                    tempDay.group_target_01 = groupConfig.group_target_01 ; 
                                    tempDay.group_target_02 = groupConfig.group_target_02 ; 
                                    tempDay.group_target_03 = groupConfig.group_target_03 ; 
                                    tempDay.group_target_04 = groupConfig.group_target_04 ; 
                                    tempDay.group_target_05 = groupConfig.group_target_05 ; 
                                }
                                
                                this.manager.grouper.grouping(tempDay) ; 
                                const groups = tempDay.groups ; 

                                // 各日付に追加
                                

                                // データ取得
                                let targetDay = this.manager.finder.findByMProductionIdAndDay(numMProductionId , day) ; 
                                
                                
                                if ( targetDay === undefined){
                                    targetDay = await this.getTProductionDayBy(
                                        numMProductionId , DayJsEx.format( day.day) , processCategoryMKvId ,groupConfig ) ; 
                                }

                                if ( targetDay === undefined) continue ; 

                                // Group挿入
                                for ( const g of groups){
                                    const groupNo = this.manager.getNewGroupNo(targetDay , g.key) ; 
                                    g.group_no = groupNo ;     
                                    g.order_no = targetDay.groups.length + 1 ;  
                                    g.updatePlanedProductionAt(day.day) ;
                                    targetDay.t_production_day_groups.push(g) ; 
                                }

                                await this.saveTProductionDay(targetDay) ; 

                                // console.log(tempDay) ; 
                                
                                
                            }

                            

                        }    

                        resolve("") ; 
                    }                                    
                    catch (err) {
                        // @ts-ignore
                        err.ep = "http.updateChangeGroupsByProject" ; 
                        reject(err) ; 
                    }
                }
            }
            catch (error ) { 
                // @ts-ignore
                error.ep = "http.updateChangeGroupsByProject-getProductionDaysByIds" ; 
                reject(error) ; 
            }
            


        }) ; 
        


    } 



}