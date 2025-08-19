import _ from "lodash";
import MMatrixConst from "../../../../../../consts/MMatrixConst";
import NumberUtil from "../../../../../../frameworks/NumberUtil";
import { TProjectProductProcess } from "../../TProjectProductProcess";


export class TProjectProductProcessConstruction {

    // 型判別用
    get IsTProjectProductProcessConstruction():boolean{
        return true ; 
    }

    /**
     * 拠点ごとの人による単価を修正
     * @returns 
     */
    public UpdateCostPerWorker(){
            
        let val = 0 ; 
        if (TProjectProductProcess.is(this)){            
            if (! _.isNil(this.TProjectProduct) && ! _.isNil(this.Store)) {

                if ( NumberUtil.invalid2zr(this.m_branch_id ?? 0) === 0 )  return ; 

                // @ts-ignore
                const mtxRes = this.Store.masters.getMtx(this.m_branch_id ,MMatrixConst.C_CONSTRUCTION_COST ,this.m_branch_id) ; 

                this.CostPerWorker = NumberUtil.invalid2zr(mtxRes?.val1 ?? 0) ;                 
                this.ExpenseCost = NumberUtil.invalid2zr(mtxRes?.val2 ?? 0) ; 
                 
            }            
        }
        
    }
 
    /**
     * 人工単価
     */
    n_10:number = 0 ; 
    get CostPerWorker ():number { return this.n_10; }
    set CostPerWorker (v:number ){ this.n_10 = v ; }

    /**
     * 諸経費
     */
    n_11:number = 0 ; 
    get ExpenseCost ():number { return this.n_11; }
    set ExpenseCost (v:number ){ this.n_11 = v ; }

    /**
     * 合計単価/人
     */
    n_12:number = 0 ; 
    get TotalCostPerWorker ():number { 
        const v = NumberUtil.invalid2zr(this.CostPerWorker) + NumberUtil.invalid2zr(this.ExpenseCost)
        this.n_12 = v ;
        return this.n_12; 
    
    }

    /**
     * 合計金額
     */
    // get TotalCost ():number { 
    //     let val = 0 ; 
    //     if (TProjectProductProcess.is(this)){            
    //         val = NumberUtil.invalid2zr(this.TotalCostPerWorker) * NumberUtil.invalid2zr(this.num_of_workers)
    //     }        
    //     return val ;
    // }


    public static Init(p:TProjectProductProcessConstruction){        
        if (TProjectProductProcess.is(p)){            
            if (! _.isNil(p.TProjectProduct) && ! _.isNil(p.Store)){
            }
        }
    }
    
    public static is(arg:any):arg is TProjectProductProcessConstruction { 
        if ( arg?.IsTProjectProductProcessConstruction === undefined) return false ; 
        return arg.IsTProjectProductProcessConstruction ; 
    } 
    

}


