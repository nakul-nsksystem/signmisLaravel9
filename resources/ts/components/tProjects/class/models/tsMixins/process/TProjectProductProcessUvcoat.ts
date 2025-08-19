import _ from "lodash";
import MKvsConst from "../../../../../../consts/MKvsConst";
import { TProjectProductProcess } from "../../TProjectProductProcess";


export class TProjectProductProcessUvcoat {
    

    // 型判別用
    get IsTProjectProductProcessUvcoat():boolean{
        return true ; 
    }
  
    public static Init(p:TProjectProductProcessUvcoat){        
        if (TProjectProductProcess.is(p)){            
            if (! _.isNil(p.TProjectProduct) && ! _.isNil(p.Store)){
                
                
            }
        
        }

    }
    
    public static is(arg:any):arg is TProjectProductProcessUvcoat { 
        if ( arg?.IsTProjectProductProcessUvcoat === undefined) return false ; 
        return arg.IsTProjectProductProcessUvcoat ; 
    } 
    

}


