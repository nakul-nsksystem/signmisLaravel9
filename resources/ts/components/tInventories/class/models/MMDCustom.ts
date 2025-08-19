//材料明細カスタム
import { MMaterial } from "../../../masters/class/models/MMaterial";
import { MMaterialDetail } from "../../../masters/class/models/MMaterialDetail";
export class MMDCustom extends MMaterialDetail {
    //数値入力可能用
    qty?:number = 0 
    supplier_m_customer_id:number = 0
    m_material?:MMaterial
    isChecked?:boolean
}


