import _ from "lodash";
import MKvsConst from "../../../../../../consts/MKvsConst";
import MMatrixConst from "../../../../../../consts/MMatrixConst";
import NumberUtil from "../../../../../../frameworks/NumberUtil";
import ObjectUtil from "../../../../../../frameworks/ObjectUtil";
import { MMaterial } from "../../../../../masters/class/models/MMaterial";
import { TProjectProduct } from "../../TProjectProduct";
import { TProjectProductProcess } from "../../TProjectProductProcess";


export class TProjectProductProcessBacksideTape {
    

    // 型判別用
    get IsBacksideTape():boolean{
        return true ; 
    }


    /**
     * 両面テープのカテゴリMkvId
     */
    get SubCatDoubleSideTapeMKvId():number {
        return MKvsConst.MMaterials.SubCategory.DOUBLE_SIDE_TAPE  ; 
    } 

    /**
     * テープ貼り方
     */
    m_kv_id_01:number = 0 ; 
    get WayMKvId ():number { return this.m_kv_id_01; }
    set WayMKvId (v:number ){ this.m_kv_id_01 = v ; }
    
    /**
     * テープ余分長さ倍率
     */
    n_06:number = 0 ; 
    get ExpandRateOfTapeLength ():number { return this.n_06; }
    set ExpandRateOfTapeLength (v:number ){ this.n_06 = v ; }

    /**
     * 周囲貼りm数
     */
    n_01:number = 0 ; 
    get TapePerimeterMaterLength ():number { 
        let val = 0 ; 

        if (TProjectProductProcess.is(this) && ! _.isNil(this.TProjectProduct)){
            if ( this.TProjectProduct.BoardMaterialSheets.length > 0 ){                
                for ( const board of this.TProjectProduct.BoardMaterialSheets) {
                    const plus = (board.w + board.h ) * 2  * board.qty ;                    
                    val += plus ; 
                }                                    
            }

        }

        if ( val !== 0 ) val =  NumberUtil.ceil(val * 0.001 , 3 ) ; 

        this.n_01 = val ; 
        return this.n_01; 
    }



    /**
     * 長手補強テープ本数
     */
    n_02:number = 0 ; 
    get NumOfSupportTapes ():number { return this.n_02; }
    set NumOfSupportTapes (v:number ){ this.n_02 = v ; }

    /**
     * 長手補強テープm数
     */
    n_03:number = 0 ; 
    get SupportTapeMaterLength ():number { 
        let val = 0 ; 
        if (TProjectProductProcess.is(this) && ! _.isNil(this.TProjectProduct)){            
            const longerLen = NumberUtil.invalid2zr(this.TProjectProduct.LongerLength) ;             
            val = longerLen * NumberUtil.invalid2zr(this.NumOfSupportTapes)  ; 
            val = NumberUtil.ceil(val * 0.001 ,3  ) ; 
        }        
        this.n_03 = val ; 
        return this.n_03; 
    }

    /**
     * 総テープm数
     */
    n_04:number = 0 ; 
    get TotalTapeMaterLength ():number { 
        let val = 0 ; 

        if ( this.IsWayAll){
            if ( this.MaterialWidth !== 0 ){
                val = NumberUtil.invalid2zr(this.NumOfCut * this.ExpandedLength4TapeLength ) ; 
                if ( val !== 0 ) val =  NumberUtil.ceil(val * 0.001 , 3 ) ; 
            }
        }
        else if ( this.IsWayFrame){
            val = this.SupportTapeMaterLength + this.TapePerimeterMaterLength ; 
        }
        this.n_04 = val ; 
        return this.n_04; 
    }



    /**
     * テープカット回数
     */
    n_05:number = 0 ; 
    get NumOfCut ():number { 
        let val = 0 ; 

        if ( this.IsWayAll){
            if ( this.MaterialWidth !== 0 ){
                val = NumberUtil.ceil(this.ExpandedLength4TapeWidth / this.MaterialWidth) ; 
            }

        }
        else if ( this.IsWayFrame){
            val = 4 ;    // 4方分
            if (TProjectProductProcess.is(this) && ! _.isNil(this.TProjectProduct)){
                if ( this.TProjectProduct.BoardMaterialSheets !== undefined && this.TProjectProduct.BoardMaterialSheets.length > 0 ) {
                    val = 0 ; 
                    for ( const board of this.TProjectProduct.BoardMaterialSheets ) {
                        val += board.qty * 4 ;             
                    }
                } 
            }
            // 補強テープ分
            val += NumberUtil.invalid2zr(this.NumOfSupportTapes) ; 
            
        }
         

        this.n_05 = val ; 
        return this.n_05; 
    }


     
 

    /**
     * テープ材料コスト
     */
    n_10:number = 0 ; 
    get MaterialPricePerMater ():number { 
        let val = 0 ; 
        if (TProjectProductProcess.is(this)){            
            val = this.MaterialCost01 ; 
        }        
        this.n_10 = val ; 
        return this.n_10; 
    }


    /**
     * 方法が全ベタ
     */
    get IsWayAll():boolean { 
        if (ObjectUtil.isNU(this.WayMKvId )) return false ; 
        return this.WayMKvId === MKvsConst.TProjects.Process.BackSideTape.WAY_ALL ; 
    }

    /**
     * 方法が周囲
     */
    get IsWayFrame():boolean { 
        if (ObjectUtil.isNU(this.WayMKvId )) return false ; 
        return this.WayMKvId === MKvsConst.TProjects.Process.BackSideTape.WAY_FRAME  ; 
    }

    /**
     * テープ幅
     */
    get MaterialWidth():number { 
        let val = 0 ; 
        if (TProjectProductProcess.is(this)){   
            const detail = MMaterial.getDetailOne(this.m_material01) ; 
            if ( detail !== undefined ) {
                val = detail.width ;     
            }
        }
        return val ; 
    }

    /**
     * テープ幅に対応する長さ(余分率反映済み)
     */
    get ExpandedLength4TapeWidth():number { 
        let val = 0 ; 
        if (TProjectProductProcess.is(this)){   
            if (! _.isNil(this.TProjectProduct)){
                val = NumberUtil.invalid2zr(this.TProjectProduct.ShorterLength * this.ExpandRateOfTapeLength ) ;                    
            }
        }
        return val ; 
    }

    /**
     * テープ長さに対応する長さ(余分率反映済み)
     */
    get ExpandedLength4TapeLength():number { 
        let val = 0 ; 
        if (TProjectProductProcess.is(this)){   
            if (! _.isNil(this.TProjectProduct)){
                val = NumberUtil.invalid2zr(this.TProjectProduct.LongerLength * this.ExpandRateOfTapeLength ) ;                    
            }
        }
        return val ; 
    }

    
    


    public static Init(p:TProjectProductProcessBacksideTape){        
        if (TProjectProductProcess.is(p)){            
            if (! _.isNil(p.TProjectProduct) && ! _.isNil(p.Store)){
                if ( _.isNil( p.ExpandRateOfTapeLength ) || p.ExpandRateOfTapeLength == 0 ){ 
                    
                    // Mtx デフォルトテープ余分長さ倍率
                    // @ts-ignore
                    const mtxRes = p.Store.masters.getMtx(p.m_branch_id ,MMatrixConst.C_BACKSIDE_TAPE_DEF_EXPAND_LENGTH_PER  ,"") ; 
                    if ( mtxRes !== undefined ){
                        let val = Number(mtxRes.val1) ; 
                        p.ExpandRateOfTapeLength = val ; 
                    }
                
                    

                    
                }
                
            }
        
        }

    }
    
    public static is(arg:any):arg is TProjectProductProcessBacksideTape { 
        if ( arg?.IsBacksideTape === undefined) return false ; 
        return arg.IsBacksideTape ; 
    } 
    

}


