import _ from "lodash";
import NumberUtil from "../../../../frameworks/NumberUtil";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";

/**
 * 生産
 */
export interface ITProductionResultUser {  

    //list:Array<object> ;
    
}



export class TProductionResultUser extends DbRowAbstract implements ITProductionResultUser { 
    public t_production_result_id?:number ; 
    public m_user_id:number ; 

    constructor ( createdMUserId:number, mUserId:number) { 
        super(createdMUserId) ; 
        this.m_user_id = mUserId ; 
    }

    get IsTProductionResultUser():boolean{
        return true ; 
    }


    
    public static is(arg:any):arg is TProductionResultUser { 
        if ( arg?.IsTProductionResultUser === undefined) return false ; 
        return arg.IsTProductionResultUser ; 
    } 


    public static parse( obj:Partial<TProductionResultUser>){        
        const row = new TProductionResultUser(obj.created_m_user_id ?? 0 , obj.m_user_id ?? 0 ) ;  
        Object.assign(row, obj);

        return row ; 

    }      

}



