import _ from "lodash";
import MKvsConst from "../../../../../../consts/MKvsConst";
import NumberUtil from "../../../../../../frameworks/NumberUtil";
import { TProjectProductProcess } from "../../TProjectProductProcess";
import { TProjectProductProcessProductions } from "../TProjectProductProcessProductions";


export class TProjectProductProcessDataCreation {
    

    // 型判別用
    get IsTProjectProductProcessDataCreation():boolean{
        return true ; 
    }
    

    
    /**
     * 作業内容
     */
    s_01:string = "" ; 
    get WorkDetail ():string { return this.s_01; }
    set WorkDetail (v:string ){ this.s_01 = v ; }

    /**
     * 作業時間
     */
    n_01:number = 0 ;     
    get WorkHour():number{ return this.n_01 ; } 
    set WorkHour(v:number){ 
        this.n_01 = v ; 
        this.n_02 = NumberUtil.invalid2zr(this.WorkHour) * 3600 ;     
    } 
  
    /**
     * 作業秒数
     */
    n_02:number = 0 ; 
    get WorkSeconds ():number { return this.n_02 ; }

    get OrderName():string { 
        if (TProjectProductProcess.is(this) && TProjectProductProcessProductions.is(this)){
            return `${this.OutsourceMProductionName} - ${this.MProcessCategoryName}` ;
        }
        return "" ; 
        
    }


    public static Init(p:TProjectProductProcessDataCreation){        
        if (TProjectProductProcess.is(p)){            
            if (! _.isNil(p.TProjectProduct) && ! _.isNil(p.Store)){
                
                
            }        
        }
    }
    
    public static is(arg:any):arg is TProjectProductProcessDataCreation { 
        if ( arg?.IsTProjectProductProcessDataCreation === undefined) return false ; 
        return arg.IsTProjectProductProcessDataCreation ; 
    } 
    

}


