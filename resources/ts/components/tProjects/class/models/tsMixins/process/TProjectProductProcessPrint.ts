import _ from "lodash";
import NumberUtil from "../../../../../../frameworks/NumberUtil";
import ObjectUtil from "../../../../../../frameworks/ObjectUtil";
import { TProjectProduct } from "../../TProjectProduct";
import { TProjectProductProcess } from "../../TProjectProductProcess";
import { TProjectProductProcessProductions } from "../TProjectProductProcessProductions";
import MKvsConst from "../../../../../../consts/MKvsConst";


export class TProjectProductProcessPrint {
    _t_project_product?:TProjectProduct ; 

     
    // 型判別用
    get IsPrint():boolean{
        return true ; 
    }

    get ProcessBase():TProjectProductProcess{
        // @ts-ignore
        return this as TProjectProductProcess ; 
    }

    /**
     * 正転・反転
     */
    m_kv_id_01:number|null = null;
    public static FRMKvId_PName = "FRMKvId" ; 
    get FRMKvId ():number|null {return this.m_kv_id_01;}        
    set FRMKvId (v:number|null ){ this.m_kv_id_01 = v ;}

    /**
     * 両面印刷
     */
    is_01:boolean = false  ; 
    public static IsDoubleFace_PName = "IsDoubleFace" ; 
    get IsDoubleFace ():boolean { return this.is_01 ; }        
    set IsDoubleFace (v:boolean ){ this.is_01 = v ; }

    /**
     * 両面印刷掛け率
     */
    get DoubleFaceRate():number { 
        return ( this.IsDoubleFace ? 2 : 1 ) ; 
    }
    
    /**
     * 手入力フラグ
     */
    is_02:boolean = false ; 
    public static IsInputDetail_PName = "IsInputDetail" ; 
    get IsInputDetail ():boolean {return this.is_02; }        
    set IsInputDetail (v:boolean ){this.is_02 = v ;}

    
    /**
     * 手入力速度
     */
    n_02:number = 0 ; 
    public static InputSpeedPerHour_PName = "InputSpeedPerHour" ; 
    get InputSpeedPerHour ():number { return this.n_02; }
    set InputSpeedPerHour (v:number ){ this.n_02 = v ; }

    
    
    /**
     * 手入力インク面積比率
     */
    n_03:number = 0 ; 
    public static InputInkAreaPer_PName = "InputInkAreaPer" ; 
    get InputInkAreaPer ():number { return this.n_03; }
    set InputInkAreaPer (v:number ){ this.n_03 = v ; }
 
        

    /**
     * 両面込の合計Sqm
     */
    n_01:number = 0 ; 
    public static SqmIncDoubleFace_PName = "SqmIncDoubleFace" ; 
    get SqmIncDoubleFace ():number { 
        
        const doubleTimesRate = this.DoubleFaceRate ; 
        let sqmIncDf = 0 ; 
        if ( TProjectProductProcess.is(this) ){
            sqmIncDf = (this.TProjectProduct?.SqmIncExt ?? 0) * doubleTimesRate   ; 
            this.custom_sqm = sqmIncDf  ; 
            return this.custom_sqm ; 
        }
        return sqmIncDf ; 
        
    }

    /**
     * 色指定 有無
     */
    is_03:boolean = false ; 
    public static IsSpecifiedColor_PName = "IsSpecifiedColor" ; 
    get IsSpecifiedColor ():boolean {return this.is_03; }        
    set IsSpecifiedColor (v:boolean ){this.is_03 = v ;}

    /**
     * 色指定 内容
     */
     s_01:string= "" ; 
     public static SpecifiedColorMemo_PName = "SpecifiedColorMemo" ; 
     get SpecifiedColorMemo ():string {return this.s_01; }        
     set SpecifiedColorMemo (v:string ){this.s_01 = v ;}
     
    /**
     * 透明メディア判定
     */
    get IsTransparentMedia():boolean{
        // const mainMaterial = this._t_project_product?.MainMaterial  ; 
        const mainMaterial = this._t_project_product?.main_material  ; 

        if ( mainMaterial === undefined ) return false ; 
        if ( mainMaterial.m_tags === undefined ) return false ; 
        const found = mainMaterial.m_tags.find( x => x.tag_key === 'm_materials-category_transparent_media')  ; 
        if ( found === undefined) this.FRMKvId = null ; 

        return found !== undefined ; 


    }

    /**
     * 選択されたプリンタのインク単価     
     */
    n_10:number = 0 ; 
    public static InkCost_PName = "InkCost" ; 
    get InkCost ():number { 
        let cost = 0 ; 

        if ( TProjectProductProcessProductions.is(this) ) {

            // 生産先ID未設定
            if ( this.MProduction01 !== undefined &&            
                this.MProductionOption01 !== undefined ) {
                
                // カラーインク                
                const colorCost         = this.MProduction01.color_ink_cost_per_sqm ;             
                const numOfColors       = this.MProductionOption01.num_of_colors_for_cost ; 
                const totalColorCost    = NumberUtil.invalid2zr(colorCost * numOfColors ); 

                // 白インク
                const whiteCost         = this.MProduction01.white_ink_cost_per_sqm ;             
                const numOfWhite        = this.MProductionOption01.num_of_white_for_cost ; 
                const totalWhiteCost    = NumberUtil.invalid2zr(whiteCost * numOfWhite ); 

                // ニス
                const varnishCost       = this.MProduction01.varnish_ink_cost_per_sqm ;             
                const numOfVarnish      = this.MProductionOption01.num_of_varnish_for_cost ; 
                const totalVarnishCost  = NumberUtil.invalid2zr(varnishCost * numOfVarnish ); 
                
                cost = totalColorCost + totalWhiteCost + totalVarnishCost ; 

            }
        }
        


        // 手入力時        
        if ( this.IsInputDetail ){                
            cost *= this.InputInkAreaPer * 0.01 ; 
        }

        this.n_10 = cost  ; 
        return this.n_10; 
    }

    /**
     * 総加工m数
     */
    get TotalProcesMater ():number { 

        if (! TProjectProductProcess.is(this)) return 0 ; 

        
        let val = 0 ; 
        if (! _.isNil(this.TProjectProduct)){
            val =  NumberUtil.invalid2zr(this.TProjectProduct.MaterialUseHLength) * 0.001 * this.DoubleFaceRate ;    

            this.process_mater = NumberUtil.ceil(val / this.TProjectProduct.Qty , 3) ; 
        }



        this.total_process_mater = val ; 
        return this.total_process_mater; 
    } 



    /**
     * MCS判定
     */
    get IsMcs():boolean{
        let is = false ;
        if ( TProjectProductProcess.is(this) && ! _.isNil(this.TProjectProduct)){
            is = this.TProjectProduct.warranty_m_kv_id == MKvsConst.TProjects.Product.Warranty.MCS ;
        }
        return is ;
    }

    /**空の時に指示書にPrefixを出したくないため */
    get IsNotMcsEmpC():boolean {
        return !_.isEmpty(this.s_02) ;
    }
    get IsNotMcsEmpM():boolean {
        return !_.isEmpty(this.s_03) ;
    }
    get IsNotMcsEmpY():boolean {
        return !_.isEmpty(this.s_04) ;
    }
    get IsNotMcsEmpK():boolean {
        return !_.isEmpty(this.s_05) ;
    }
    get IsNotMcsEmpW():boolean {
        return !_.isEmpty(this.s_06) ;
    }

    /**
     * mcsインクlotNo C
     */
    s_02:string ="" ; 
    get McsLotNoC():string { return this.s_02;}            
    set McsLotNoC (v:string ){ this.s_02 = v ; }
    
    /**
     * mcsインクlotNo M
     */
    s_03:string ="" ; 
    get McsLotNoM():string { return this.s_03;}            
    set McsLotNoM (v:string ){ this.s_03 = v ; }

    /**
     * mcsインクlotNo Y
     */
    s_04:string ="" ; 
    get McsLotNoY():string { return this.s_04;}            
    set McsLotNoY (v:string ){ this.s_04 = v ; }

    /**
     * mcsインクlotNo K
     */
    s_05:string ="" ; 
    get McsLotNoK():string { return this.s_05;}            
    set McsLotNoK (v:string ){ this.s_05 = v ; }

    /**
     * mcsインクlotNo W
     */
    s_06:string ="" ; 
    get McsLotNoW():string { return this.s_06;}            
    set McsLotNoW (v:string ){ this.s_06 = v ; }

    /**
     * P5のみ
     * パスオーバーラッピングフラグ
     */
    is_06:boolean = false ; 
    get IsPassOverlapping():boolean { return this.is_06;}            
    set IsPassOverlapping (v:boolean ){ this.is_06 = v ; }

    /**
     * パスオーバーラッピングタイプ
     */
    // m_kv_id_04:number|null = null; 
    // get PassOverlappingTypeMKvId():number|null {
        
    //     if(this.IsPassOverlapping && !this.m_kv_id_04) {
    //         this.m_kv_id_04 = MKvsConst.TProjects.Process.Print.POL.ORIGINAL
    //     }
    //     return this.m_kv_id_04 ;
    // }            
    // set PassOverlappingTypeMKvId (v:number|null ){ this.m_kv_id_04 = v ; }

    public static Init(p:TProjectProductProcessPrint){
        // if ( _.isNil(p.IsDoubleFace)) p.IsDoubleFace = false ; 
        
    }
    
    public static is(arg:any):arg is TProjectProductProcessPrint { 
        if ( arg?.IsPrint === undefined) return false ; 
        return arg.IsPrint ; 
    } 
    

}


