import _ from "lodash";
import MKvsConst from "../../../../../../consts/MKvsConst";
import { MMaterial } from "../../../../../masters/class/models/MMaterial";
import { TProjectProductProcess } from "../../TProjectProductProcess";


export class TProjectProductProcessPrimar {
    

    // 型判別用
    get IsTProjectProductProcessPrimar():boolean{
        return true ; 
    }


    /**
     * プライマー駅のカテゴリMkvId
     */
    get SubCatPrimarMKvId():number {
        return MKvsConst.MMaterials.SubCategory.PRIMAR  ; 
    } 

    /**
     * 難易度
     */
    n_01:number = 1 ; 
    get LevelOfDifficulty ():number { return this.n_01; }
    set LevelOfDifficulty (v:number ){ this.n_01 = v ; }
 
    /**
     * 選択されたプライマー液の単価
     */
    n_10:number = 1 ; 
    get PrimarCostPerSqm ():number { 
        let val = 0 ; 
        if (TProjectProductProcess.is(this)){            
            val = this.MaterialCost01  ; 
        }
        
        this.n_10 = val ; 
        return this.n_10; 
    }

    /**
     * 最大コストの資材詳細
     */
    get MaterialDescription():string { 
        if (TProjectProductProcess.is(this)){     
            const detail = MMaterial.getHighestCostMaterial(this.m_material01) ; 
            return detail?.description ?? "" ; 

        }
        return "" ; 

    }
 
    public static Init(p:TProjectProductProcessPrimar){        
        if (TProjectProductProcess.is(p)){            
            if (! _.isNil(p.TProjectProduct) && ! _.isNil(p.Store)){
                
                
            }
        
        }

    }
    
    public static is(arg:any):arg is TProjectProductProcessPrimar { 
        if ( arg?.IsTProjectProductProcessPrimar === undefined) return false ; 
        return arg.IsTProjectProductProcessPrimar ; 
    } 
    

}


