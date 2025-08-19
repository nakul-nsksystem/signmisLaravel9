import { IDbRow } from "../../../../models/DbRowAbstract";


export class MProductionExtTool implements IDbRow { 
    public id?:number  = undefined ;
    public name?:string  ; 
    public software_name?:string  ; 
    public connection_type?:string  ; 
    public url?:string  ; 

    get IsMProductionExtTool():boolean{
        return true ; 
    }

    public static parse(obj:Partial<MProductionExtTool>):MProductionExtTool{
        const row = new MProductionExtTool() ;  
        Object.assign(row, obj);
        
        return row ; 
    }

    
    public static is(arg:any):arg is MProductionExtTool { 
        if ( arg?.IsMProductionExtTool === undefined) return false ; 
        return arg.IsMProductionExtTool ; 
    } 


}