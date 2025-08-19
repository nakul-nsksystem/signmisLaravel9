import _ from "lodash";
import ArrayUtil from "../../../../../frameworks/ArrayUtil";
import { BoardLayoutTypes } from "../BoardLayout";
import { TProjectProductBoardLayout } from "../../models/TProjectProductBoardLayout";
import { BoardLayoutContainerManager } from "../BoardLayoutContainerManager";
import { TProjectProductBoardLayoutEx4Container } from "../TProjectProductBoardLayoutEx4Container";
import { BoardLayoutContainerAbstract } from "./BoardLayoutContainerAbstract";

/**
 * 規格参照入力
 */
export class BoardLayoutContainerRefMasterManual extends BoardLayoutContainerAbstract {         
    

    constructor (manager:BoardLayoutContainerManager) { 
        super(manager) ; 
    }

    // 型判別用
    get IsBoardLayoutContainerRefMasterManual():boolean { return true ; }

    /**
     * 
     */
    set BoardLayouts(v:TProjectProductBoardLayout[]){
        const filterd = v.filter(x => x.m_material_detail_id !== undefined && x.m_material_detail_id !== 0 && ! x.is_auto  ) ?? [] ;  
        const parsed = filterd.map(x => TProjectProductBoardLayoutEx4Container.create( this ,x )) ; 
        ArrayUtil.resetInsert(this.Layouts , parsed) ; 
        
    }

    /**
     * Is自動かどうか
     */
    get IsAuto():boolean { return false ; } 


    /**
     * レイアウトタイプ
     */
     get LayoutType():BoardLayoutTypes { return BoardLayoutTypes.RefMasterManual ; } 

     public static is(arg:any):arg is BoardLayoutContainerRefMasterManual { 
        if ( arg?.IsBoardLayoutContainerRefMasterManual === undefined) return false ; 
        return arg.IsBoardLayoutContainerRefMasterManual ; 
    } 


}



