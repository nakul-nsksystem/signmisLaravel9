import _, { NumericDictionaryIteratee } from "lodash";
import ArrayUtil from "../../../../frameworks/ArrayUtil";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";
import { MKv } from "./MKv";


export class MKvCategory extends DbRowAbstract{
    public kv_key?:string  ;     
    public kv_category_name?:string  ;     
    public kv_short_name?:string  ;     

    public m_kvs:Array<MKv>  = []; 

    constructor(createdMUserId:number){
        super(createdMUserId) ; 
    }

    get IsMKvCategory():boolean{
        return true ; 
    }
    
    public static is(arg:any):arg is MKvCategory { 
        if ( arg?.IsMKvCategory === undefined) return false ; 
        return arg.IsMKvCategory ; 
    } 

    public static parse(obj:Partial<MKvCategory>):MKvCategory{
        const row = new MKvCategory(obj.created_m_user_id ?? 0) ;  
        Object.assign(row, obj);
        
        const parsedMKvs = row.m_kvs.map(x => MKv.parse(x)) ; 
        ArrayUtil.resetInsert(row.m_kvs , parsedMKvs) ; 

        return row ; 
    }

}