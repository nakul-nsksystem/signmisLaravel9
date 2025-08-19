import _ from "lodash";
import ArrayUtil from "../../../../../frameworks/ArrayUtil";
import { BoardLayoutTypes } from "../BoardLayout";
import { TProjectProductBoardLayout } from "../../models/TProjectProductBoardLayout";
import { BoardLayoutContainerManager } from "../BoardLayoutContainerManager";
import { TProjectProductBoardLayoutEx4Container } from "../TProjectProductBoardLayoutEx4Container";
import NumberUtil from "../../../../../frameworks/NumberUtil";

/**
 * 板割り方法で使用する仮想クラス
 */
export abstract class BoardLayoutContainerAbstract  {         
    
    _manager:BoardLayoutContainerManager 

    constructor (manager:BoardLayoutContainerManager) { 
        this._manager = manager ;         
    }

    _layouts:TProjectProductBoardLayoutEx4Container[] = [] ;
    get Layouts():TProjectProductBoardLayoutEx4Container[] {return this._layouts ;}

    /**
     * 保存用のTProjectProductBoardLayoutに変換
     */
    get OutputLayouts():TProjectProductBoardLayout[] { 
        // console.log("OutputLayouts") ; 
        
        const mapped = this.Layouts.map(x => {
            const newRow = new TProjectProductBoardLayout(this._manager.LoginUserId) ; 
            newRow.id = x.id ; 
            newRow.w = x.w ; 
            newRow.h = x.h ; 
            newRow.is_outsource_cut = x.is_outsource_cut ; 
            newRow.qty = x.qty ; 
            newRow.price = x.price ; 
            
            newRow.is_auto = x.is_auto ; 
            newRow.m_material_detail_id = x.m_material_detail_id ;
            newRow.m_material_detail = x.m_material_detail ; 

            return newRow ; 
        }) ;
        return mapped ; 
    }


    get LoginUserId():number { 
        return this._manager.LoginUserId  ; 
    }

    get IsSelected():boolean { 
        return this.LayoutType === this._manager.SelectedBoardLayoutType ; 
    }

    /**
     * レイアウトをセット
     */
    abstract set BoardLayouts(v:TProjectProductBoardLayout[]) ;

    /**
     * Is自動かどうか
     */
    abstract get IsAuto():boolean ; 


    /**
     * レイアウトタイプ
     */
    abstract get LayoutType():BoardLayoutTypes ; 



    /**
     * 追加
     */
    public add(){
        const row = new TProjectProductBoardLayoutEx4Container(this)  ; 
        row.is_auto = this.IsAuto ; 
        this.Layouts.push(row) ; 
    }

    
    /**
     * 行の削除
     */
     public destroy(row:TProjectProductBoardLayoutEx4Container) {
        const idx = this.Layouts.indexOf(row) ; 
        if ( idx !== -1){
            this.Layouts.splice(idx , 1 ) ; 
        }
        
    } 


    /**
     * 合計数量
     */
    get TotalQty():number { 
        return _.ceil(_.sumBy( this.Layouts , "qty"))  ; 
    }

    /**
     * 合計材料コスト
     */
    get TotalMaterialCost():number { 
        return _.ceil(_.sumBy( this.Layouts , "TotalMaterialCost"))  ; 
    }
    
    /**
     * 合計カット数
     */
    get TotalNumOfCut():number { 
        return _.ceil(_.sumBy( this.Layouts , "TotalNumOfCut"))  ; 
    }

    /**
     * 合計カットコスト
     */
    get TotalCutCost():number { 
        return _.ceil(_.sumBy( this.Layouts , "TotalCutCost"))  ;         
    }
    
    /**
     * 合計コスト
     */
    get TotalCost():number { 
        return this.TotalMaterialCost + this.TotalCutCost ; 
    }

    
    /**
     * 合計コスト
     */
    get TotalCostPerQty():number { 
        return this.TotalCost  ; 
    }

    /**
     * 製品サイズW
     */
    get ProductW():number { 
        return NumberUtil.invalid2zr(this._manager?.TProjectProductProcess?.TProjectProduct?.size_w ?? 0 ) ; 
    }

    /**
     * 製品サイズH
     */
    get ProductH():number { 
        return NumberUtil.invalid2zr(this._manager?.TProjectProductProcess?.TProjectProduct?.size_h ?? 0 ) ;         
    }

    /**
     * 製品サイズ長手
     */
    get ProductLonger():number { 
        return Math.max(this.ProductW ,this.ProductH ) ;      
    }

    /**
     * 製品サイズ短手
     */
    get ProductShorter():number { 
        return Math.min(this.ProductW ,this.ProductH ) ;      
    }


}



