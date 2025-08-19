import _ from "lodash";
import MKvsConst from "../../../../../../consts/MKvsConst";
import { TProjectProductProcess } from "../../TProjectProductProcess";


export class TProjectProductProcessPostPvc {
    

    // 型判別用
    get IsTProjectProductProcessPostPvc():boolean{
        return true ; 
    }

    /**
     * 作業内容
     */
    s_01:string = "" ; 
    get WorkDetail ():string { return this.s_01; }
    set WorkDetail (v:string ){ this.s_01 = v ; }

    /**
     * 作業見込み秒数
     */
    n_01:number = 0 ; 
    get WorkSecondsPerQty ():number { return this.n_01; }
    set WorkSecondsPerQty (v:number ){ this.n_01 = v ; }
 
    /**
     * 材料費
     */
    n_10:number = 0 ; 
    get MaterialCostPerQty ():number { return this.n_10; }
    set MaterialCostPerQty (v:number ){ this.n_10 = v ; }

  
    public static Init(p:TProjectProductProcessPostPvc){        
        if (TProjectProductProcess.is(p)){            
            if (! _.isNil(p.TProjectProduct) && ! _.isNil(p.Store)){
                
                
            }
        
        }

    }
    
    public static is(arg:any):arg is TProjectProductProcessPostPvc { 
        if ( arg?.IsTProjectProductProcessPostPvc === undefined) return false ; 
        return arg.IsTProjectProductProcessPostPvc ; 
    } 
    

}


