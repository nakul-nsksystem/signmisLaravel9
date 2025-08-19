import _ from "lodash";
import { TProjectProduct } from "../../TProjectProduct";
import { TProjectProductProcess } from "../../TProjectProductProcess";


export class TProjectProductProcessSurfaceCoating {
    

    // 型判別用
    get IsTProjectProductProcessSurfaceCoating():boolean{
        return true ; 
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
     * 難易度
     */
    n_01:number = 1 ; 
    get LevelOfDifficulty ():number { return this.n_01; }
    set LevelOfDifficulty (v:number ){ this.n_01 = v ; }
  
    /**
     * 材料費/㎡あたり
     */
    n_10:number = 0 ; 
    get CoatingMaterialCostPerSqm ():number { return this.n_10; }
    set CoatingMaterialCostPerSqm (v:number ){ this.n_10 = v ; }    
      

    


    public static Init(p:TProjectProductProcessSurfaceCoating){        
        if (TProjectProductProcess.is(p)){            
            if (! _.isNil(p.TProjectProduct) && ! _.isNil(p.Store)){
                
                
            }
        
        }

    }
    
    public static is(arg:any):arg is TProjectProductProcessSurfaceCoating { 
        if ( arg?.IsTProjectProductProcessPacking === undefined) return false ; 
        return arg.IsTProjectProductProcessPacking ; 
    } 
    

}


