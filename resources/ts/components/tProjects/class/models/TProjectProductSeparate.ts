import _, { NumericDictionaryIteratee } from "lodash";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";



export class TProjectProductSeparate extends DbRowAbstract  { 

    constructor (createdMUserId:number ) { 
        super(createdMUserId) ; 

    }

    get IsTProjectProductSeparate():boolean{
        return true ; 
    }


    //#region カラム系

    t_project_product_id?:number|null = null ;  

    /**
     * 0:H  1:W 分割方向
     */
    is_w:boolean = false ; 

    /**
     * 分割位置（相対位置）
     */
    pos:number = 0 ; 
    
    /**
     * 絶対位置 ( 分割線描画位置用 : この位置を基準に寸法テキスト配置位置も決まる)
     */
    abs_pos:number = 0 ; 


    //#endregion



    public static parse(obj:Partial<TProjectProductSeparate>){
        const row = new TProjectProductSeparate(obj.created_m_user_id ?? 0 ) ;  
        Object.assign(row, obj);
        
        return row ; 
    }

    public static is(arg:any):arg is TProjectProductSeparate { 
        if ( arg?.IsTProjectProductSeparate === undefined) return false ; 
        return arg.IsTProjectProductSeparate ; 
    } 


    

}



