import _ from "lodash";
import { TProjectProductProcess } from "../../TProjectProductProcess";


export class TProjectProductProcessExpendable {

    // 型判別用
    get IsTProjectProductProcessExpendable():boolean{
        return true ; 
    }

    /**
     * 作業内容
     */
    s_01:string = "" ; 
    get Detail ():string { return this.s_01; }
    set Detail (v:string ){ this.s_01 = v ; }

 
    /**
     * 単価
     */
    n_10:number = 0 ; 
    get Cost ():number { return this.n_10; }
    set Cost (v:number ){ this.n_10 = v ; }

  
    public static Init(p:TProjectProductProcessExpendable){        
        if (TProjectProductProcess.is(p)){            
            if (! _.isNil(p.TProjectProduct) && ! _.isNil(p.Store)){
                
                
            }
        
        }

    }
    
    public static is(arg:any):arg is TProjectProductProcessExpendable { 
        if ( arg?.IsTProjectProductProcessExpendable === undefined) return false ; 
        return arg.IsTProjectProductProcessExpendable ; 
    } 
    

}


