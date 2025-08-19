import _ from "lodash";
import MKvsConst from "../../../../../../consts/MKvsConst";
import MTagsConst from "../../../../../../consts/MTagsConst";
import NumberUtil from "../../../../../../frameworks/NumberUtil";
import { MMaterial } from "../../../../../masters/class/models/MMaterial";
import { TProjectProductProcess } from "../../TProjectProductProcess";
import { TProjectProductProcessProductions } from "../TProjectProductProcessProductions";


export class TProjectProductProcessReboardWork {
    

    // 型判別用
    get IsTProjectProductProcessReboardWork():boolean{
        return true ; 
    }

    
    /**
     * エッジバンドのカテゴリMkvId
     */
     get SubCatReboardAccessoryMKvId():number {
        return MKvsConst.MMaterials.SubCategory.REBOARD_ACCESSORY  ; 
    } 


    /**
     * 材料取得
     */
    get Bridge_MMaterial01():MMaterial|undefined { 
        if (TProjectProductProcess.is(this)) {
            return this.m_material01 ; 
        }
        return undefined ; 
    }
    
    /**
     * 作業内容
     */
    s_01:string = "" ; 
    get WorkDetail ():string { return this.s_01; }
    set WorkDetail (v:string ){ this.s_01 = v ; }
 
    /**
     * Isエッジバンド
     */
    is_01:boolean = false ; 
    get IsEdgeband ():boolean { return this.is_01; }
    set IsEdgeband (v:boolean){ this.is_01 = v ; }

    /**
     * Isエッジバンドが紙タイプ
     */
    get IsEdgebandPaper():boolean {       
        if ( _.isNil(this.Bridge_MMaterial01)) return false ; 

        const found = this.Bridge_MMaterial01.m_tags.find(x => x.tag_key === MTagsConst.MMaterials.EDGEBAND_PAPER) ; 
        return found !== undefined ; 
    } 

    /**
     * Isエッジバンドが樹脂タイプ
     */
    get IsEdgebandPlastic():boolean { 
        if ( _.isNil(this.Bridge_MMaterial01)) return false ; 
        
        return ! this.IsEdgebandPaper ; 
    }

    /**
     * エッジバンドタイプ( Mtxで使用 )
     */
    tmp_edgeBandType:string = "" ; 
    get EdgebandTagType():string { 
        
        let val = "" ; 
        if (! _.isNil( this.Bridge_MMaterial01)){
            for ( const tag of this.Bridge_MMaterial01.m_tags)
            {
                if ( tag.tag_key ===  MTagsConst.MMaterials.EDGEBAND_PLASTIC ||
                    tag.tag_key ===  MTagsConst.MMaterials.EDGEBAND_PAPER ) 
                {
                    val = tag.tag_key ; 
                    break ;                         
                }
            }
        }
        this.tmp_edgeBandType = val ; 
        return val ; 
    }



    /**
     * 難易度
     */
    n_01:number = 1 ; 
    get LevelOfDifficulty ():number { return this.n_01; }
    set LevelOfDifficulty (v:number ){ this.n_01 = v ; }

    /**
     * エッジバンド使用長さmm数
     */
    n_02:number = 0 ; 
    get EdgebandLength ():number { return this.n_02; }
    set EdgebandLength (v:number ){ this.n_02 = v ; }

    /**
     * エッジバンド使用長さm 数
     */
    n_03:number = 0 ; 
    get EdgebandMaterLength ():number { 
        let val = 0 ; 
        val = NumberUtil.ceil(this.EdgebandLength * 0.001 ,3 ) ;

        this.n_03 = val ; 
        return this.n_03; 
    }

    
    /**
     * 組み立て作業秒数
     */
    n_06:number = 0 ;
    get AssemblyWorkSeconds ():number { return this.n_06; }
    set AssemblyWorkSeconds (v:number ){ this.n_06 = v ; }
        
    
 
    /**
     * エッジバンド m単価
     */
    n_10:number = 0 ;     
    get EdgebandMaterialPricePerMater():number{ 
        let val = 0 ; 
        if (TProjectProductProcess.is(this)) {
            val = this.MaterialCost01 ; 
        }

        this.n_10 = val ; 
        return this.n_10 ; 
    
    } 

    
    /**
     * 消耗品費
     */
    n_11:number = 0 ;
    get Expenses ():number { return this.n_11; }
    set Expenses (v:number ){ this.n_11 = v ; }
         
    /**
     * Is組み立て作業有り
     */
    is_02:boolean = false ; 
    get IsAssembly ():boolean { return this.is_02; }
    set IsAssembly (v:boolean){ this.is_02 = v ; }

    


    public static Init(p:TProjectProductProcessReboardWork){        
        if (TProjectProductProcess.is(p)){            
            if (! _.isNil(p.TProjectProduct) && ! _.isNil(p.Store)){
                
                
            }        
        }
    }
    
    public static is(arg:any):arg is TProjectProductProcessReboardWork { 
        if ( arg?.IsTProjectProductProcessReboardWork === undefined) return false ; 
        return arg.IsTProjectProductProcessReboardWork ; 
    } 
    

}


