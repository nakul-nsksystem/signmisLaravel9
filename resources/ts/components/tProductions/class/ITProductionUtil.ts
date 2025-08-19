import _ from "lodash";
import NumberUtil from "../../../frameworks/NumberUtil";
import {ITProduction, TProduction  }  from "./models/TProduction";
import { TProductionGroupAbstract } from "./models/TProductionAbstract";
import {ITProductionDay ,TProductionDay} from "./models/TProductionDay";
import { ITProductionGroup ,TProductionDayGroup } from "./models/TProductionDayGroup";




export default { 
    isTProduction : function (arg:any):arg is TProduction { 
        if ( arg === undefined) return false ; 
        //console.log(arg.t_production_days !== undefined ) ; 
        return arg.t_production_days !== undefined ; 
    } , 

    
    isTProductionGroupAbstract :function(arg:any):arg is TProductionGroupAbstract { 
        if ( arg === undefined) return false ; 
        return arg.t_production_day_groups !== undefined ; 
    } , 

    isTProductionDay : function (arg:any):arg is TProductionDay { 
        if ( arg === undefined) return false ; 
        return arg.planed_start_at !== undefined ; 
    } ,

    isITProductionGroup :function(arg:any):arg is ITProductionGroup { 
        if ( arg === undefined) return false ; 
        return arg.level !== undefined ; 
    } , 

    isTProductionDayGroup :function(arg:any):arg is TProductionDayGroup { 
        if ( arg === undefined) return false ; 
        return arg.hour !== undefined && arg.level !== undefined ; 
    } , 

    sumHour : function(list:Array<object>):number {
        return _.ceil(_.sumBy( list , "predicted_work_hour") ,3)  ; 
    } , 

    sumSqm : function(list:Array<object>):number {
        // @ts-ignore
        return _.ceil(
            _.sumBy( list , (x) => 
                // @ts-ignore
                x.total_custom_sqm === 0 ? NumberUtil.invalid2zr( x.t_project_product.total_sqm) : NumberUtil.invalid2zr( x.total_custom_sqm)
                ),3)  ; 
    } , 

    sumMater : function(list:Array<object>):number {
        return _.ceil(_.sumBy( list , "total_process_mater") ,3)  ; 
    } , 

    /**
     * [ 1.8h 4.16㎡ 3.8M ] のような文字列を生成
     * @param hour 
     * @param sqm 
     * @param mater 
     * @returns 
     */
    getSumCaption : function (hour:number , sqm:number , mater:number):string { 
        let caption = `[ ${sqm}㎡  ` ; 
        caption += mater == 0 ? "" : `${mater}M  ` ; 
        caption += `${hour}h`
        caption += ` ]` ; 
        return caption ; 

    }

}


