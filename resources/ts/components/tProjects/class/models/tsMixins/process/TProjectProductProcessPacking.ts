import _ from "lodash";
import { TProjectProduct } from "../../TProjectProduct";
import { TProjectProductProcess } from "../../TProjectProductProcess";


export class TProjectProductProcessPacking {
    

    // 型判別用
    get IsTProjectProductProcessPacking():boolean{
        return true ; 
    }

    get Bridge_isBoard():boolean { 
        if (TProjectProductProcess.is(this)){            
            if (! _.isNil(this.TProjectProduct)){
                return this.TProjectProduct.IsBoard ; 
            } 
        }
        return false ; 
    }

    /**
     * 方法 MKV_key
     */
    get WayMKvKey():string {
        return this.Bridge_isBoard ? 
            "t_project_product_process-packing-board-way" :
            "t_project_product_process-packing-roll-way" ;
    } 

    /**
     * 方法のg01 ( フィルタ用 )
     */
    get WayG01():string{
        if (TProjectProductProcess.is(this)){        
            return this.Bridge_isBoard ? 
            "" :
            this.TProjectProduct?.m_product_category_id == 1 ? "curtain" : "pvc" ; 

        }
        return "" ; 

    }

    /**
     * 方法名
     */
    get WayName():string { 
        if (TProjectProductProcess.is(this)){            
            if (! _.isNil(this.TProjectProduct) && ! _.isNil(this.Store)){
                // @ts-ignore
                const wayMKv = this.Store.masters.getMKvById(this.WayMKvId ) ; 
                
                return wayMKv === undefined ? "" : wayMKv.kv_name ; 
            }
        }
        return "" ; 
    }
        

    /**
     * 方法KvId
     */
    m_kv_id_01:number = 0 ; 
    get WayMKvId ():number { return this.m_kv_id_01; }
    set WayMKvId (v:number ){ this.m_kv_id_01 = v ; }    

    /**
     * コスト手入力
     */
    is_01:boolean = false ; 
    get IsCostByInput ():boolean { return this.is_01; }
    set IsCostByInput (v:boolean ){ this.is_01 = v ; }  
    
    get IsNotCostByInput():boolean{
        return ! this.IsCostByInput ; 
    }
 
    /**
     * 作業見込み秒数
     */
    n_01:number = 0 ; 
    get WorkSecondsPerQty ():number { return this.n_01; }
    set WorkSecondsPerQty (v:number ){ this.n_01 = v ; }    
  
    /**
     * 材料費/個あたり
     */
    n_02:number = 0 ; 
    get MaterialCostPerQty ():number { return this.n_02; }
    set MaterialCostPerQty (v:number ){ this.n_02 = v ; }    
      

    


    public static Init(p:TProjectProductProcessPacking){        
        if (TProjectProductProcess.is(p)){            
            if (! _.isNil(p.TProjectProduct) && ! _.isNil(p.Store)){
                
                
            }
        
        }

    }
    
    public static is(arg:any):arg is TProjectProductProcessPacking { 
        if ( arg?.IsTProjectProductProcessPacking === undefined) return false ; 
        return arg.IsTProjectProductProcessPacking ; 
    } 
    

}


