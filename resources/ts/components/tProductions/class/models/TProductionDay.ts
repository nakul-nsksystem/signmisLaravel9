import { TProjectProductProcess } from "../../../tProjects/class/models/TProjectProductProcess";
import TProductionGroupManager from "../TProductionGroupManager";
import {ITProduction } from "./TProduction";
import { TProductionGroupAbstract } from "./TProductionAbstract";
import { TProductionDayGroup } from "./TProductionDayGroup";
import DayJsEx from "./../../../../frameworks/DayJsEx";
import _ from "lodash";
import { IHasProductionGroupCondition } from "./grouper/PdtGrouper";
import TProductionConsts from "../../../../consts/TProductionConsts";
import { MProcessCategoryService } from "../../../masters/class/services/MProcessCategoryService";

/**
 * 生産予定日
 */
export interface ITProductionDay extends ITProduction{    
    day : any   
    planed_start_at :any ;
    planed_end_at : any ; 

    t_production_day_users:Array<object> ;

}

export class TProductionDay extends TProductionGroupAbstract implements ITProductionDay ,IHasProductionGroupCondition { 

    day : any 
    process_category_m_kv_id: number ; 
    planed_start_at :any ;
    planed_end_at : any ; 
    group_target_01? : string ; 
    group_target_02? : string ; 
    group_target_03? : string ; 
    group_target_04? : string ; 
    group_target_05? : string ; 
    t_production_day_users:Array<object> ;

    
    
    constructor( mProductionId:number , day:any ,processCategoryMKvId:number ,list:Array<TProjectProductProcess>  ) {
        super(mProductionId ,list) ; 

        this.day = day ;
        this.process_category_m_kv_id = processCategoryMKvId ; 
        this.t_production_day_users = [] ; 

    }

    _target_m_production_ids:number[] = [] ; 
    get TargetMProductionIds():number[] {
        return this._target_m_production_ids ; 
    }


    /**
     * 子TProductionDayGroupの
     */
    public updateGroupPlannedAt() { 

        const func = function(day:string ,group:TProductionDayGroup) { 


            
            if ( group.groups.length > 0 ) {
                for ( const cg of group.groups ) { 
                    func(day ,cg ) ; 
                }
                
            }
        }

        for ( const g of this.groups){
            func(DayJsEx.format(this.day) ,g ) ; 
        }
        

    }

    
    toJSON () {
        
        return {
            //m_production_id: this.m_production_id,
            id : this.id , 
            m_production_id : this.m_production_id , 
            day : DayJsEx.format(this.day) , 
            process_category_m_kv_id : this.process_category_m_kv_id , 
            planed_start_at : this.planed_start_at , 
            planed_end_at : this.planed_end_at , 
            group_target_01 : this.group_target_01 , 
            group_target_02 : this.group_target_02 , 
            group_target_03 : this.group_target_03 , 
            group_target_04 : this.group_target_04 , 
            group_target_05 : this.group_target_05 , 
            created_m_user_id : this.created_m_user_id , 
            updated_m_user_id : this.updated_m_user_id , 
            t_production_day_groups : this.t_production_day_groups , 
            
            //list: JSON.stringify(this.list),
            //groups : JSON.stringify(this.groups) 
        }
      }

    /**
     * いずれかのグループで実績がある
     */
    get isExistsResults():boolean {          
        for ( const g of this.groups ) { 
            if (_.isNil(g.deleted_at ) && g.status !== TProductionConsts.Results.Status.C_STATUS_PLANED ){
                // console.log("Status Result End : " + g.uid +"---"  +  g.status + " id" + g.id) ; 
                return true ; 
            }
        }

        return false ; 
        
    }

    public static async parse(manager:TProductionGroupManager, obj:Partial<TProductionDay>)
        :Promise<TProductionDay>{
            return new Promise(async (resolve,reject) => {

            if ( _.isNil( obj.m_production_id) || _.isNil(obj.process_category_m_kv_id )){
                console.error(obj) ; 
                return reject(`parsing day is failed on TProductDay.parse.` ) ; 
                
            } 
            
            const row = new TProductionDay(obj.m_production_id, obj.day, obj.process_category_m_kv_id , obj.t_project_product_processes ?? []) ;  
            Object.assign(row, obj);
            row.day = DayJsEx.format( row.day) ; 

            
            // カテゴリーからありえる生産先を取得して対象の生産先Noを特定する
            row._target_m_production_ids = await MProcessCategoryService.getMProductionIdsByCategoryMKvId(row.process_category_m_kv_id) ;   

            
            const parsedGroups = [] ; 

            const isNeededPushProcesses = row.t_project_product_processes.length === 0  ; 

            for ( const g of row.groups){
                g.m_production_id = row.m_production_id ; 
                try {                     
                    const parsed = await TProductionDayGroup.parse(manager,row , g) ; 
                        
                    // // listの更新
                    if ( isNeededPushProcesses ) row.t_project_product_processes.push(... parsed.t_project_product_processes) ; 
                    parsedGroups.push( parsed) ; 
                }
                catch (error){
                    console.error(error) ; 
                    return reject(error) ; 
                }

                

                
            }
            row.groups = parsedGroups ; 
            row.updateKeyGroupNo4Children() ; 
            resolve(row) ; 

        }) ; 
    }




}

