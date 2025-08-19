import _ from "lodash";
import ArrayUtil from "../../../../frameworks/ArrayUtil";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";
import { MProductionExtTool } from "./MProductionExtTool";
import { MProductionMode } from "./MProductionMode";
import { MProductionOption } from "./MProductionOption";


export class MProduction extends DbRowAbstract{
    public name?:string  ; 
    public m_production_modes:Array<MProductionMode>
    public m_production_options:Array<MProductionOption>
    public m_production_ext_tool?:MProductionExtTool = undefined ; 

    prepare_sec:number = 0 ; 

    cost_per_hour:number = 0 ; 

    color_ink_cost_per_sqm:number = 0 ; 
    white_ink_cost_per_sqm:number = 0 ; 
    varnish_ink_cost_per_sqm:number = 0 ; 

    val1?:string ;
    val2?:string ;

    constructor(createdMUserId:number){
        super(createdMUserId) ; 
        this.m_production_modes = [] ; 
        this.m_production_options = []
    }

    
    get IsMProduction():boolean{
        return true ; 
    }

    public static parse(obj:Partial<MProduction>):MProduction{
        const row = new MProduction(obj.created_m_user_id ?? 0) ;  
        Object.assign(row, obj);
        
        if (! _.isNil( row.m_production_ext_tool)){
            row.m_production_ext_tool = MProductionExtTool.parse(row.m_production_ext_tool) ; 
        }

        const parsedModes = row.m_production_modes.map(x => MProductionMode.parse(x)) ; 
        ArrayUtil.resetInsert(row.m_production_modes , parsedModes) ; 

        const parsedOptions = row.m_production_options.map(x => MProductionOption.parse(x)) ; 
        ArrayUtil.resetInsert(row.m_production_options , parsedOptions) ; 

        return row ; 
    }
    
    public static is(arg:any):arg is MProduction { 
        if ( arg?.IsMProduction === undefined) return false ; 
        return arg.IsMProduction ; 
    } 

}