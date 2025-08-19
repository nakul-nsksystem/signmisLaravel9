import NumberUtil from "../../../../frameworks/NumberUtil";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";

export class MCustomerInfo extends DbRowAbstract{
    public m_customer_id?:number  ;     
    public category_m_kv_id?:number ; 
    public title:string = "" ;
    public value?:string ;

    constructor(createdMUserId:number){
        super(createdMUserId) ; 
    }

    get IsMCustomerInfo():boolean{
        return true ; 
    }

    
    /**
     * 数値
     */
    get NumberValue ():number { return NumberUtil.invalid2zr(Number(this.value)) ; }
    set NumberValue (v:number ){ 
        let numValue = NumberUtil.invalid2zr(Number(v)) ; 
        this.value = numValue.toString() ; 
    }
    
    public static is(arg:any):arg is MCustomerInfo { 
        if ( arg?.IsMCustomerInfo === undefined) return false ; 
        return arg.IsMCustomerInfo ; 
    } 


    public static parse(obj:Partial<MCustomerInfo>):MCustomerInfo{
        const row = new MCustomerInfo(obj.created_m_user_id ?? 0) ;  
        Object.assign(row, obj);
        
        return row ; 
    }

}