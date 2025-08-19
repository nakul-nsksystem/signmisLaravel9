import NumberUtil from "../../../../frameworks/NumberUtil";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";
import { MProductionMode } from "./MProductionMode";
import { MProductionOption } from "./MProductionOption";


export class MMaterialDetail extends DbRowAbstract{

    constructor(createdMUserId:number){
        super(createdMUserId) ; 
    }

    get IsMMaterialDetail():boolean{
        return true ; 
    }

    detail_name:string = "" ; 
    known_as:string = "" ; 
    description:string = "" ; 
    width:number = 0 ; 
    width_margin:number= 0 ; 
    height:number = 0 ; 
    height_including_loss:number = 0 ; 
    capacity:number = 0 ; 
    contents_qty:number = 0 ; 
    min_order_qty:number = 0 ; 
    unit_price:number = 0 ; 
    cost_price:number = 0 ; 
    unit_m_kv_id:number = 0 ;
    ivt_div_m_kv_id:number|null = null  ;
    // sqm:number = 0 ; 
    _sqm:number = 0 ; 
    
    /**
     * Sqm
     */
    public get Sqm():number { 
        // console.log(`w:${this.width} x h:${this.height}`) ; 
        this._sqm  = NumberUtil.ceil(this.width * this.height * 0.001 * 0.001  ,4 ) ;   
        return this._sqm ;  
    }

    /**
     * コスト/㎡
     */
    public get CostPerSqm():number { 
        return this.cost_price / this.Sqm ?? 0 ; 
    }

    public static parse(obj:Partial<MMaterialDetail>):MMaterialDetail{
        const row = new MMaterialDetail(obj.created_m_user_id ?? 0) ;  
        Object.assign(row, obj);
        
        return row ; 
    }

    public static is(arg:any):arg is MMaterialDetail { 
        if ( arg?.IsMMaterialDetail === undefined) return false ; 
        return arg.IsMMaterialDetail ; 
    } 

}