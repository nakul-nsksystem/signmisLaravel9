import { DbRowAbstract } from "../../../../models/DbRowAbstract";
import { MProductionMode } from "./MProductionMode";
import { MProductionOption } from "./MProductionOption";


export class MMatrixDetail extends DbRowAbstract{

    constructor(createdMUserId:number){
        super(createdMUserId) ; 
    }

    get IsMMatrixDetail():boolean{
        return true ; 
    }


    k1?:string  ; 
    k1_description?:string ; 
    k2?:string  ; 
    k2_description?:string ; 
    k3?:string  ; 
    k3_description?:string ; 
    k4?:string  ; 
    k4_description?:string ; 

    val1:number = 0 ; 
    val1_description?:string ; 
    val2:number = 0 ; 
    val2_description?:string ; 
    val3:number = 0 ; 
    val3_description?:string ; 
    


    val1_name?:string ; 
    val2_name?:string ; 

    

    public static parse(obj:Partial<MMatrixDetail>):MMatrixDetail{
        const row = new MMatrixDetail(obj.created_m_user_id ?? 0) ;  
        Object.assign(row, obj);
        
        return row ; 
    }

    public static is(arg:any):arg is MMatrixDetail { 
        if ( arg?.IsMMatrixDetail === undefined) return false ; 
        return arg.IsMMatrixDetail ; 
    } 

}