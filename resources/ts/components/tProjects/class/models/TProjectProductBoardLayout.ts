import _, { NumericDictionaryIteratee } from "lodash";
import NumberUtil from "../../../../frameworks/NumberUtil";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";
import { MMaterialDetail } from "../../../masters/class/models/MMaterialDetail";

export class TProjectProductBoardLayout extends DbRowAbstract  { 
    w:number = 0 ; 
    h:number = 0 ; 
    is_outsource_cut:boolean = false ; 
    qty:number = 0 ; 
    price:number = 0 ; 
    m_material_detail_id:number = 0 ; 
    is_auto:boolean = false ; 

    m_material_detail?:MMaterialDetail|null = null ; 

    constructor (createdMUserId:number ) { 
        super(createdMUserId) ; 

    }

    get IsTProjectProductBoardLayout():boolean{
        return true ; 
    }


    //#region カラム系

    t_project_product_id?:number|null = null ;  

    //#endregion

    get Sqm():number { 
        return NumberUtil.ceil( this.w * this.h * 0.001 * 0.001 ,4 ) ; 
    }
    



    public static parse(obj:Partial<TProjectProductBoardLayout>){
        const row = new TProjectProductBoardLayout(obj.created_m_user_id ?? 0 ) ;  
        Object.assign(row, obj);
        
        return row ; 
    }

    public static is(arg:any):arg is TProjectProductBoardLayout { 
        if ( arg?.IsTProjectProductBoardLayout === undefined) return false ; 
        return arg.IsTProjectProductBoardLayout ; 
    } 


    

}



