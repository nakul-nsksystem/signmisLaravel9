import _ from "lodash";
import MMatrixConst from "../../../../consts/MMatrixConst";
import ArrayUtil from "../../../../frameworks/ArrayUtil";
import ObjectUtil from "../../../../frameworks/ObjectUtil";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";
import { IDbSoftDelete } from "../../../../models/IDbSoftDelete";
import { MMaterial } from "../../../masters/class/models/MMaterial";
import { MMaterialDetail } from "../../../masters/class/models/MMaterialDetail";
import { BoardLayoutTypes } from "./BoardLayout";
import { TProjectProductBoardLayout } from "../models/TProjectProductBoardLayout";
import { BoardLayoutContainerAbstract } from "./containers/BoardLayoutContainerAbstract";
import { BoardLayoutContainerManual } from "./containers/BoardLayoutContainerManual";
import { BoardLayoutContainerRefMasterAuto } from "./containers/BoardLayoutContainerRefMasterAuto";
import { BoardLayoutContainerRefMasterManual } from "./containers/BoardLayoutContainerRefMasterManual";
import { TProjectProductProcess } from "../models/TProjectProductProcess";
import { useStore } from "../../../../stores/mainStore";

/**
 * BoardLayoutContainerを管理する
 */
export class BoardLayoutContainerManager  {         
    
    // protected _store:object ; 
    protected _store = useStore() ; 
    public get Store():object { return this._store ; }

    protected _containers:BoardLayoutContainerAbstract[] = []; 


    constructor () { 
        // this._store = store ;
        this._containers.push(new BoardLayoutContainerManual(this) ) ; 
        this._containers.push(new BoardLayoutContainerRefMasterManual(this) ) ; 
        this._containers.push(new BoardLayoutContainerRefMasterAuto(this) ) ; 

    }

    /**
     * ManualContainer
     */
    get ManualContainer():BoardLayoutContainerManual { 
        const found = this._containers.find(x => x.LayoutType == BoardLayoutTypes.Manual ) as BoardLayoutContainerManual;          
        return found ; 
    }
    /**
     * RefMasterManualContainer
     */
    get RefMasterManualContainer():BoardLayoutContainerRefMasterManual { 
        return this._containers.find(x => x.LayoutType == BoardLayoutTypes.RefMasterManual ) as BoardLayoutContainerRefMasterManual; 
    }
    /**
     * RefMasterManualContainer
     */
    get RefMasterAutoContainer():BoardLayoutContainerRefMasterAuto { 
        return this._containers.find(x => x.LayoutType == BoardLayoutTypes.RefMasterAuto ) as BoardLayoutContainerRefMasterAuto; 
    }

    get LoginUserId():number { 
        // @ts-ignore 
        return this._store.loginMUser.id  ?? 0 ; 
    }

    /**
     * 
     */
    t_project_product_process?:TProjectProductProcess = undefined  ; 
    get TProjectProductProcess():TProjectProductProcess|undefined{ return this.t_project_product_process ; } 
    set TProjectProductProcess(v:TProjectProductProcess|undefined){ this.t_project_product_process = v ; } 

    get ProductSizeW():number { 
        return this.TProjectProductProcess?.TProjectProduct?.size_w ?? 0 ; 
    }

    get ProductSizeH():number { 
        return this.TProjectProductProcess?.TProjectProduct?.size_h ?? 0 ; 
    }

    
    get ProductQty():number { 
        return this.TProjectProductProcess?.TProjectProduct?.qty ?? 0 ; 
    }



    /**
     * 拠点ID
     */
    m_branch_id?:number   ; 
    get MBranchId():number|undefined { return this.m_branch_id ; }
    set MBranchId(v:number|undefined) { 
        this.m_branch_id = v ; 
        this.CostPerCut ; 
        this.WasteCostPer ; 
    }

    /**
     * 資材支給
     */
    is_customer_provide:boolean = false ; 
    get IsCustomerProvide():boolean { return this.is_customer_provide ; }
    set IsCustomerProvide(v:boolean) { this.is_customer_provide = v ; }

    /**
     * 自動時　外注カット
     */
    is_auto_outsource_cut:boolean = false ; 

    /**
     * 元データ
     */
    set BoardLayouts(v:TProjectProductBoardLayout[]){
        for ( const c of this._containers){
            c.BoardLayouts = v ; 
        }
    }


    
    /**
     * レイアウトタイプ
     */
    _selectedBoardLayoutType?:BoardLayoutTypes = undefined; 
    get SelectedBoardLayoutType():BoardLayoutTypes|undefined { 
        return this._selectedBoardLayoutType ; 
    }
    set SelectedBoardLayoutType(v:BoardLayoutTypes|undefined) { 
        this._selectedBoardLayoutType = v ; 
        this.SelectedContainer ; 
    }

    /**
     * 選択されているレイアウトコンテナ
     */
    get SelectedContainer():BoardLayoutContainerAbstract|undefined { 
        for ( const c of this._containers ) { 
            if ( c.LayoutType == this.SelectedBoardLayoutType ) return c ; 
        }
        return undefined ; 
    }

    /**
     * 選択されているコンテナのレイアウト
     */
    get SelectedContainerOutputLayouts():TProjectProductBoardLayout[]{
        return this.SelectedContainer?.OutputLayouts ?? [] ;
    }

 
    /**
     * 対象の材料
     */
    m_material?:MMaterial = undefined ; 
    _json_m_material:string = "" ; 
    get MMaterial():MMaterial|undefined{ return this.m_material ; }
    set MMaterial(v:MMaterial|undefined){ 
        
        const stringfyV = JSON.stringify(v) ; 
        if ( this._json_m_material !== stringfyV){
            // console.log("material Sets") ;  
            this.m_material = v ; 
            this._json_m_material = stringfyV ; 
            // this._mMaterialDetails = this.m_material?.m_material_details ; 
            this._mMaterialDetails.splice(0) ; 
            this._mMaterialDetails.push(...this.m_material?.m_material_details ?? []) ;             
            // this._mMaterialDetails = this.m_material?.m_material_details  ; 

            // this.MMaterialDetails ; 
        }
        
    } 
 
     
    /**
     * 対象の材料の明細
     */
    _mMaterialDetails:MMaterialDetail[] = [] ; 
    get MMaterialDetails():MMaterialDetail[] { 
        // console.log("MMaterialDetails") ; 
        return this._mMaterialDetails ; 
    }

    // 無限ループなる
    // get MMaterialDetails():MMaterialDetail[]|undefined { 
    //     console.log("MMaterialDetails") ; 
    //     // console.log(this.m_material?.m_material_details) ; 
    //     return this.m_material?.m_material_details  ; 
    // }
 

    /**
     * カットコスト
     */
    get CostPerCut():number { 
        if ( _.isNil(this.m_branch_id )) return 0 ;

        // @ts-ignore
        const mtxRes = this.Store.masters.getMtx(this.m_branch_id ,MMatrixConst.C_BOARD_MATERIAL_COST_PER_CUT  ,"") ; 
        return Number(mtxRes?.val1 ?? 0) ;         

    }

    /**
     * 板材 端材扱い境界 %　( 指定 %以下の場合は1枚分)
     */
    get WasteCostPer():number { 
        if ( _.isNil(this.m_branch_id )) return 0 ;

        // @ts-ignore
        const mtxRes = this.Store.masters.getMtx(this.m_branch_id ,MMatrixConst.C_BOARD_MATERIAL_WASTE_COST_PER  ,"") ; 
        return Number(mtxRes?.val1 ?? 0) ;         

    }


    

}



