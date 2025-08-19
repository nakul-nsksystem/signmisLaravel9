import _ from "lodash";
import NumberUtil from "../../../../frameworks/NumberUtil";
import { MProduction } from "../../../masters/class/models/MProduction";
import { TProjectProductProcess } from "../../../tProjects/class/models/TProjectProductProcess";
import ITProductionUtil from "../ITProductionUtil";
import { TProductionAbstract, TProductionGroupAbstract } from "./TProductionAbstract";
import { TProductionDay } from "./TProductionDay";

/**
 * 生産
 */
export interface ITProduction {    
    t_project_product_processes:Array<object> ;

    
}


export class TProduction extends TProductionAbstract implements ITProduction {     
    MProduction:MProduction ; 
    is_selected:boolean ; 
    t_production_days:Array<TProductionDay> ; 
    
    constructor(MProduction:MProduction ) {
        super() ; 
        this.MProduction = MProduction  ; 
        this.is_selected = false ; 
        this.t_production_days = [] ; 

    }

    get t_project_product_processes():Array<TProjectProductProcess> { 
        const processes = [] ; 
        for ( const day of this.t_production_days){
            processes.push(...day.t_project_product_processes) ; 
        }
        return processes ; 
    }


    /**
     * グループのList取得
     */
    public get groups():Array<TProductionDay> {
        return this.t_production_days  ; 
    }

    public set groups(value:Array<TProductionDay>) { 
        this.t_production_days.splice(0) ; 
        this.t_production_days.push(...value) ; 
    }

}



