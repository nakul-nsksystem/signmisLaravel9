import _ from "lodash";
import NumberUtil from "../../../../frameworks/NumberUtil";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";
import { TProjectProductProcess } from "../../../tProjects/class/models/TProjectProductProcess";
import ITProductionUtil from "./../ITProductionUtil";
import {ITProductionGroup ,TProductionDayGroup} from "./TProductionDayGroup";
import { TProductionProcessPlan } from "./TProductionProcessPlan";

/**
 * TProduction , TProductionDay , TProductionGroupで使用する仮想クラス
 */
export abstract class TProductionAbstract  {         
    
    constructor( ) {              
        
    }



    abstract get t_project_product_processes():Array<TProjectProductProcess> 

    
    get hour() { 
        return ITProductionUtil.sumHour(this.t_project_product_processes) ; 
        // return _.ceil(_.sumBy( this.list , "predicted_work_hour") ,2)  ; 
    } 
    get sqm() { 
        return ITProductionUtil.sumSqm(this.t_project_product_processes) ; 
        // @ts-ignore
        //return _.ceil(_.sumBy( this.list , (x) => NumberUtil.invalid2zr( x.t_project_product.total_sqm)),3)  ; 
    }
    get mater() { 
        return ITProductionUtil.sumMater(this.t_project_product_processes) ; 
        // return _.ceil(_.sumBy( this.list , "total_process_mater") ,3)  ; 
    }

    get summaryCaption() { 
        return ITProductionUtil.getSumCaption(this.hour , this.sqm , this.mater ) ; 
    }

    /**
     * list内をグループの順番に並べ替え
     */
    public sortList () {
        // 最下段は子グループから取得できない為、削除しない
        let groups:Array<TProductionAbstract> = [] ; 
        if ( ITProductionUtil.isTProductionGroupAbstract(this)){
            groups = this.groups ; 
        }
        else if (ITProductionUtil.isTProduction(this)) { 
            const groups = this.groups ;             
        }
        
        let isDeleteProcesses:boolean = true ; 
        if ( ITProductionUtil.isTProductionDayGroup(this)){ 
            isDeleteProcesses = _.isNil( this.deleted_at) ; 
        }

        if ( groups.length !== 0 && isDeleteProcesses ) this.t_project_product_processes.splice(0) ;     
        for ( const g of groups){
            if (ITProductionUtil.isTProductionDayGroup(g) &&  _.isNil( g.deleted_at) ){
                this.t_project_product_processes.push(...g.t_project_product_processes) ; 
            }
            
        }

    
    }  


    /**
     * 子グループのキー情報更新
     */
    public updateKeyGroupNo4Children(){
        // @ts-ignore        
        this.sortList() ; 
        
        if ( ITProductionUtil.isTProductionDay(this) || ITProductionUtil.isTProduction(this)){
            
            for (const g of this.groups){
                if ( ITProductionUtil.isTProductionDay(this) && ITProductionUtil.isTProductionDayGroup(g) ){
                    g.order_no = this.groups.indexOf(g) ; 
                }
                g.updateKeyGroupNo4Children() ; 

            }

            
        }
        else if (ITProductionUtil.isTProductionDayGroup(this)) { 
            
            // Group 
            const leveledKeyCName = `level_${this.level}_key` ; 
            const leveledTitleCName = `level_${this.level}_title` ; 
            const leveledTargetCName = `level_${this.level}_target` ; 
            const leveledGroupNoCName = `level_${this.level}_group_no` ; 
                
            const func = (group:TProductionDayGroup ) => {

                for (const g of group.groups){
                    g.order_no = group.groups.indexOf(g) ; 

                    if ( ITProductionUtil.isTProductionDayGroup(g)){
                        
                        if ( g.level >= 0 ){
                            // @ts-ignore
                            g[leveledKeyCName] = this.key ; 
                            // @ts-ignore
                            g[leveledTitleCName] = this.title ; 
                            // @ts-ignore
                            g[leveledGroupNoCName] = this.group_no ; 
                            // @ts-ignore
                            g[leveledTargetCName] = this.target ; 

                        }
    
    
                        if ( g.groups.length !== 0 ) {
                            func(g) ; 
                            g.updateKeyGroupNo4Children() ; 
                        }
                    }

                    // ゴミ除去
                    if ( g.t_project_product_processes.length === 0 ){
                        if ( g.id !== undefined ){
                            g.deleted_at = new Date() ; 
                        }
                    }
                }
            }

            func(this ) ; 
        }

        
    }    


    /**
     * 子を含めてGroup取得(階層無視)
     */
    public getGroupsWithChildren ():Array<TProductionDayGroup>{
        let rtn:Array<TProductionDayGroup> = [] ; 
        if ( ITProductionUtil.isTProductionDayGroup(this)){
            rtn.push(this);         
        }
        
        if ( ITProductionUtil.isTProductionDayGroup(this) || 
             ITProductionUtil.isTProductionDay(this) ){
            for ( const childG of this.groups){            
                rtn.push(...childG.getGroupsWithChildren()) ; 
            }
        }
        
        return rtn ; 

    } 



}

/**
 * TProductionDay , TProductionGroupで使用する仮想クラス
 */
export abstract class TProductionGroupAbstract extends TProductionAbstract {
    public id?:number  ;
    public t_production_day_groups:Array<TProductionDayGroup> ; 
    
    public m_production_id:number ;
    public created_m_user_id?:number ; 
    public updated_m_user_id?:number ; 

    public t_project_product_processes:Array<TProjectProductProcess> ;

    constructor (mProductionId:number ,list:Array<TProjectProductProcess> ) { 
        super() ; 
        this.m_production_id = mProductionId ; 
        this.t_production_day_groups  = [] ; 
        this.t_project_product_processes = list ; 
    }

    /**
     * グループのList取得
     */
    public get groups():Array<TProductionDayGroup> {        
        //return groups ; 
        return this.t_production_day_groups ; 
        
    }
    /**
     * グループのList Setter
     */
     public set groups(value:Array<TProductionDayGroup>) { 
        this.t_production_day_groups.splice(0) ; 
        this.t_production_day_groups.push(...value) ; 
    }
    
}



