import _ from "lodash";
import ArrayUtil from "../../../../../frameworks/ArrayUtil";
import { BoardLayoutTypes } from "../BoardLayout";
import { TProjectProductBoardLayout } from "../../models/TProjectProductBoardLayout";
import { BoardLayoutContainerManager } from "../BoardLayoutContainerManager";
import { TProjectProductBoardLayoutEx4Container } from "../TProjectProductBoardLayoutEx4Container";
import { BoardLayoutContainerAbstract } from "./BoardLayoutContainerAbstract";

/**
 * 入力
 */
export class BoardLayoutContainerManual extends BoardLayoutContainerAbstract {         
    

    constructor (manager:BoardLayoutContainerManager) { 
        super(manager) ; 
    }

    // 型判別用
    get IsBoardLayoutContainerManual():boolean { return true ; }

    /**
     * 
     */
    set BoardLayouts(v:TProjectProductBoardLayout[]){
        const filterd = v.filter(x => x.m_material_detail_id === undefined || x.m_material_detail_id === 0 || x.m_material_detail_id === null ) ?? [] ;  
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
    get LayoutType():BoardLayoutTypes { return BoardLayoutTypes.Manual ; } 

    public static is(arg:any):arg is BoardLayoutContainerManual { 
        if ( arg?.IsBoardLayoutContainerManual === undefined) return false ; 
        return arg.IsBoardLayoutContainerManual ; 
    } 

}



