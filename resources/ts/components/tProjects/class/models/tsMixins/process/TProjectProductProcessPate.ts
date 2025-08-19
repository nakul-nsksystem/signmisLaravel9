import _ from "lodash";
import MKvsConst from "../../../../../../consts/MKvsConst";
import { TProjectProductProcess } from "../../TProjectProductProcess";


export class TProjectProductProcessPate {
    

    // 型判別用
    get IsTProjectProductProcessPate():boolean{
        return true ; 
    }


    /**
     * パテのカテゴリMkvId
     */
    get SubCatPateMKvId():number {
        return MKvsConst.MMaterials.SubCategory.PATE  ; 
    } 

    /**
     * 難易度
     */
    n_01:number = 1 ; 
    get LevelOfDifficulty ():number { return this.n_01; }
    set LevelOfDifficulty (v:number ){ this.n_01 = v ; }
 
    /**
     * 選択されたパテの単価
     */
    n_10:number = 1 ; 
    get PateCostPerSqm ():number { 
        let val = 0 ; 
        if (TProjectProductProcess.is(this)){            
            val = this.MaterialCost01  ; 
        }
        
        this.n_10 = val ; 
        return this.n_10; 
    }
 
    public static Init(p:TProjectProductProcessPate){        
        if (TProjectProductProcess.is(p)){            
            if (! _.isNil(p.TProjectProduct) && ! _.isNil(p.Store)){
                
                
            }
        
        }

    }
    
    public static is(arg:any):arg is TProjectProductProcessPate { 
        if ( arg?.IsTProjectProductProcessPate === undefined) return false ; 
        return arg.IsTProjectProductProcessPate ; 
    } 
    

}


