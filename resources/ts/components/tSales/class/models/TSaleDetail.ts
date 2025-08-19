
import _, { NumericDictionaryIteratee } from "lodash";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";
import { IDbSoftDelete } from "../../../../models/IDbSoftDelete";
import NumberUtil from "../../../../frameworks/NumberUtil";
import { TProject } from "../../../tProjects/class/models/TProject";

export class TSaleDetail extends DbRowAbstract {

    t_project?:TProject ;

    //#region カラム系
    t_sale_id?:number|null =  null;

    t_project_id?:number|null = null;
    t_project_product_id?:number|null = null;
    m_material_detail_id?:number|null = null;

    qty:number = 0;
    shipped_qty:number = 0;
    cost:number = 0;
    price:number = 0;
    total_price:number = 0;


    unit_m_kv_id:number = 0;

    public static parse(obj:Partial<TSaleDetail>){
        const row = new TSaleDetail(obj.created_m_user_id ?? 0 ) ;  
        Object.assign(row, obj);

        return row ; 
    }

    public static is(arg:any):arg is TSaleDetail { 
        if ( arg?.TSaleDetail === undefined) return false ; 
        return arg.TSaleDetail ; 
    } 
}
