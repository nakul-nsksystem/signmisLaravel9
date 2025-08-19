import {IDbRow} from "../../../../models/DbRowAbstract";
import { useMasterStore } from "../../../../stores/masterStore";

export class SmOption implements IDbRow{
    id?:number ; 

    key_m_kv_id?:number ;
    
    get KeyMKv() {
        if(!this.key_m_kv_id) return ;

        const masterStore = useMasterStore() ;
        return masterStore.getMKvById(this.key_m_kv_id)
    }
    value?:string ;


    get Value() {
        const valType = this.KeyMKv?.g_02 ;
        if( valType == 'number' || valType == 'mkv') {
            return Number( this.value ) ; 
        }
        else {
            return this.value
        }
    }

    set Value(v) {
        this.value = String(v) ;
    }


    is_user_editable? : boolean ;
    
    public get IsSmOption():boolean{
        return true ; 
    }

    public static parse(obj:Partial<SmOption>):SmOption{
        const row = new SmOption() ;  
        Object.assign(row, obj);
        
        return row ; 
    }

    
    public static is(arg:any):arg is SmOption { 
        if ( arg?.IsSmOption === undefined) return false ; 
        return arg.IsSmOption ; 
    } 

}