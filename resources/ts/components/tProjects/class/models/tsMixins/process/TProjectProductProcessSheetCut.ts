import _ from "lodash";
import MMatrixConst from "../../../../../../consts/MMatrixConst";
import NumberUtil from "../../../../../../frameworks/NumberUtil";
import { TProjectProduct } from "../../TProjectProduct";
import { TProjectProductProcess } from "../../TProjectProductProcess";


export class TProjectProductProcessSheetCut {
    _t_project_product?:TProjectProduct ; 

    // 型判別用
    get IsSheetCut():boolean{
        return true ; 
    }




    /**
     * 総加工m数
     */
    get TotalProcesMater ():number { 

        if (! TProjectProductProcess.is(this)) return 0 ; 
        
        if (! _.isNil(this.TProjectProduct)){
            this.process_mater = NumberUtil.invalid2zr(this.TProjectProduct.PerimeterIncExt) * 0.001 ;    
            this.total_process_mater = this.process_mater * this.TProjectProduct.qty ; 
        }
        return this.total_process_mater; 
    } 

    /**
     * レートの取得
     */
    protected getRate(length:number):number { 
        let val = 1 ; 
        if (! TProjectProductProcess.is(this)) return val ; 

        if (! _.isNil(this.TProjectProduct) && ! _.isNil(this.Store)){
            // @ts-ignore 
            const mtxRes = this.Store.masters.getMtx(this.m_branch_id ,MMatrixConst.C_SHEET_CUT_LENGTH_PER ,length) ; 
            val = Number(mtxRes.val1) ; 
            
        }
        return val ; 

    }


    /**
     * W のレート
     */
    get WRate():number {         
        // @ts-ignore
        const length = NumberUtil.invalid2zr(this.TProjectProduct.SizeIncExtW)  ;   
        const val = this.getRate(length) ; 
        return val ; 
    }
    /**
     * H のレート
     */
     get HRate():number {         
        // @ts-ignore
        const length = NumberUtil.invalid2zr(this.TProjectProduct.SizeIncExtH)  ;   
        const val = this.getRate(length) ;         
        return val ; 
    }

    /**
     * 掛け率反映後のW
     */
    get RatedW():number { 
        // @ts-ignore
        return this.TProjectProduct.SizeIncExtW * this.WRate ; 
    }

    /**
     * 掛け率反映後のH
     */
    get RatedH():number { 
        // @ts-ignore
        return this.TProjectProduct.SizeIncExtH * this.HRate ; 
    }

    /**
     * MTXから取得した最低　掛け率反映後の長さ
     */
    tmp_minPerimeter:number = 1 ; 

    /**
     * 掛け率反映後の周長
     */
    n_01:number = 0 ; 
    get RatedPerimeter():number{
        let val = (this.RatedW + this.RatedH ) * 2 ; 
        if ( val < this.tmp_minPerimeter) val = this.tmp_minPerimeter; 
        this.n_01 = val  ;  
        // console.log("n_01:" + this.n_01) ; 
        return val ; 

    }

    public static Init(p:TProjectProductProcessSheetCut){
        
        if (TProjectProductProcess.is(p)){            
            if (! _.isNil(p.TProjectProduct) && ! _.isNil(p.Store)){
                // @ts-ignore
                const mtxRes = p.Store.masters.getMtx(p.m_branch_id ,MMatrixConst.C_SHEET_CUT_MIN_PERIMETER ,"") ; 
                // console.log(mtxRes) ; 
                p.tmp_minPerimeter = Number(mtxRes.val1) ; 
            }
        
        }

    }
    
    public static is(arg:any):arg is TProjectProductProcessSheetCut { 
        if ( arg?.IsSheetCut === undefined) return false ; 
        return arg.IsSheetCut ; 
    } 
    

}


