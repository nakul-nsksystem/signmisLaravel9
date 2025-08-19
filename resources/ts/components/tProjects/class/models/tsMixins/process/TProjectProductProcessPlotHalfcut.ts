import _ from "lodash";
import MKvsConst from "../../../../../../consts/MKvsConst";
import MMatrixConst from "../../../../../../consts/MMatrixConst";
import MastersUtil from "../../../../../../frameworks/MastersUtil";
import NumberUtil from "../../../../../../frameworks/NumberUtil";
import { MMaterialService } from "../../../../../masters/class/services/MMaterialService";
import { TProjectProduct } from "../../TProjectProduct";
import { TProjectProductProcess } from "../../TProjectProductProcess";


export class TProjectProductProcessPlotHalfcut {
    _t_project_product?:TProjectProduct ; 

    // 型判別用
    get IsPlotHalfcut():boolean{
        return true ; 
    }

    
    /**
     * アプリのカテゴリMkvId
     */
     get SubCatApplicationMKvId():number {
        return MKvsConst.MMaterials.SubCategory.APPLICATION  ; 
    } 

    /**
     * 加工mm数
     */
    n_01:number = 0 ; 
    get ProcessLength():number{ return this.n_01 ; } 
    set ProcessLength(v:number){ 
        this.n_01 = v ; 
        if (! TProjectProductProcess.is(this)) return ;  
        
        if (! _.isNil(this.TProjectProduct)){
            this.process_mater = NumberUtil.invalid2zr(this.n_01) * 0.001 ;    
            this.total_process_mater = this.process_mater * this.TProjectProduct.qty ; 
        }        
    
    } 

    
    /**
     * 参考加工mm数
     */
    get RefProcessLength():number{        
        let val = 0 ; 
        if (TProjectProductProcess.is(this)){            
            if (! _.isNil(this.TProjectProduct) && ! _.isNil(this.Store)) {


                // @ts-ignore
                const mtxRes = this.Store.masters.getMtx(this.m_branch_id ,MMatrixConst.C_HALFCUT_SQM_TO_LENGTH_RATE ,this.TProjectProduct.SqmIncExt) ; 
                // console.log(mtxRes) ; 
                this.tmp_sqm_to_length_rate = Number(mtxRes.val1) ; 


                val = NumberUtil.round(this.tmp_sqm_to_length_rate * this.TProjectProduct.sqm * 1000 ) ; 
            }
        }



        return val ; 
    }

    /**
     * MTXから取得した ㎡数から換算した長さの倍率
     */
     tmp_sqm_to_length_rate:number = 1 ; 

    /**
     * 難易度
     */
    n_02:number = 1 ;     
    get LevelOfDifficulty():number{ return this.n_02 ; } 
    set LevelOfDifficulty(v:number){ this.n_02 = v ; } 
    
    /**
     * カストリ有無
     */
    is_01:boolean = false ; 
    get IsRemoveTrash():boolean{ return this.is_01 ; } 
    set IsRemoveTrash(v:boolean){ this.is_01 = v ; } 

    /**
     * アプリ有無
     */
    is_02:boolean = false ; 
    get IsApplication():boolean{ return this.is_02 ; } 
    set IsApplication(v:boolean){ this.is_02 = v ; } 
        
    /**
     * アプリ材料ID
     */
    get AplicationMMaterialId():number|undefined{ 
        if ( TProjectProductProcess.is(this)){
            return this.MMaterialId01  ; 
        }
        return 0 ;         
    } 
    set AplicationMMaterialId(v:number|undefined){ 
        if ( TProjectProductProcess.is(this)){
            this.MMaterialId01 = v ; 
        }
        
    }

    /**
     * アプリ材料名
     */
    get AplicationMMaterialName():string { 
        if ( TProjectProductProcess.is(this)){
            return this.MaterialName01 ;            
        }
        return ""
    }

    /**
     * アプリ材料名　正式
     */
    get AplicationMMaterialLongName():string{
        if ( TProjectProductProcess.is(this)){
            return this.MaterialLongName01  ; 
        }
        return ""
    }

    
    /**
     * アプリ材料コスト
     */
    n_10:number = 0 ;     
    get ApplicationCostPerSqm():number{ 
        let cost = 0 ; 
        if ( TProjectProductProcess.is(this)){
            if (! _.isNil(this.m_material01)
                && this.m_material01.m_material_details !== undefined
                && this.m_material01.m_material_details.length > 0 ) 
            {
                const res = this.m_material01.m_material_details.reduce(function (accumulator, currentValue) {                    
                    return accumulator.cost_price > currentValue.cost_price ? accumulator : currentValue ; 
                }) ; 
                cost = res.cost_price ; 
            }
        }

        this.n_10 = cost ; 
        return this.n_10 ; 
    
    } 

    /**
     * アプリ幅
     */
    get ApplicationWidth():number{
        let val = 0 ; 
        if ( TProjectProductProcess.is(this) && ! _.isNil(this.m_material01)){
            const selected = MMaterialService.GetMaterialDetailOne(this.m_material01) ; 
            // console.log(selected) ; 
            if ( selected !== undefined) val = selected.width ; 
        }
        // console.log("val:" + val) ; 
        return val ; 
    }


    /**
     * アプリ貼り回数
     */
    n_03:number = 0 ; 
    get NumOfApplicationActions():number{
        let val = 1 ; 
        let applicationWidth = this.ApplicationWidth ; 
        if ( applicationWidth !== 0 ){

            if ( TProjectProductProcess.is(this) && this.TProjectProduct !== undefined && ! _.isNil(this.Store)){
                let len = this.TProjectProduct.ShorterLength  ; 

                // @ts-ignore 
                const res = this.Store.masters.getMtx(this.m_branch_id ,MMatrixConst.C_HALFCUT_APPLICATION_WIDTH_MARGIN ,"") ; 
            
                if ( res.val1 !== undefined ) {
                    applicationWidth -= Number(res.val1) ;  
                }                            
                val = NumberUtil.ceil( len / applicationWidth ) ; 
            }
        }
        this.n_03 = val ;  
        return this.n_03 ; 
    }


    /**
     * アプリ貼り長さ
     */
    n_04:number = 0 ;
    get ApplicationTotalLength():number{

        let val = 0 ; 

        if ( TProjectProductProcess.is(this) && this.TProjectProduct !== undefined ){
            const len = this.TProjectProduct.LongerLength ; 
            val   = this.NumOfApplicationActions * len ; 
    
        }


        this.n_04 = val ; 
        return this.n_04 ; 
    }   

    /**
     * アプリ四隅断裁有無
     */
    is_03:boolean = false ; 
    get IsCutApplication():boolean{ return this.is_03 ; } 
    set IsCutApplication(v:boolean){ this.is_03 = v ; } 






    
    public static Init(p:TProjectProductProcessPlotHalfcut){
    }
    
    public static is(arg:any):arg is TProjectProductProcessPlotHalfcut { 
        if ( arg?.IsPlotHalfcut === undefined) return false ; 
        return arg.IsPlotHalfcut ; 
    } 
    

}


