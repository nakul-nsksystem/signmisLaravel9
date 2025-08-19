import ArrayUtil from "../../../../frameworks/ArrayUtil";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";
import { MMatrixDetail } from "./MMatrixDetail";
import { MProductionMode } from "./MProductionMode";
import { MProductionOption } from "./MProductionOption";


export class MMatrix extends DbRowAbstract{

    constructor(createdMUserId:number){
        super(createdMUserId) ; 
    }

    get IsMMatrix():boolean{
        return true ; 
    }

    m_branch_id:number = 0 ; 
    name?:string  ; 
    k1_name?:string  ; 
    k1_op?:number  ; 
    k2_name?:string  ; 
    k2_op?:number  ; 
    k3_name?:string  ; 
    k3_op?:number  ; 
    k4_name?:string  ; 
    k4_op?:number  ; 

    val1_name?:string ; 
    val2_name?:string ; 

    m_matrix_details:Array<MMatrixDetail> = [] ; 


    public static parse(obj:Partial<MMatrix>):MMatrix{
        const row = new MMatrix(obj.created_m_user_id ?? 0) ;  
        Object.assign(row, obj);

        const parsedDetails = row.m_matrix_details.map(x => MMatrixDetail.parse(x )) ; 
        ArrayUtil.resetInsert(row.m_matrix_details , parsedDetails) ; 

        return row ; 
    }

    public static is(arg:any):arg is MMatrix { 
        if ( arg?.IsMMatrix === undefined) return false ; 
        return arg.IsMMatrix ; 
    } 

}