import { DbRowAbstract } from "../../../../models/DbRowAbstract";


export class MTag {
    public tag_key?:string  ;     
    id?:number
    constructor(){        
    }

    public get IsMTag():boolean{
        return true ; 
    }


    public static parse(obj:Partial<MTag>):MTag{
        const row = new MTag() ;  
        Object.assign(row, obj);
        
        return row ; 
    }

    
    public static is(arg:any):arg is MTag { 
        if ( arg?.IsMTag === undefined) return false ; 
        return arg.IsMTag ; 
    } 

}