import { ref, computed ,reactive, getCurrentInstance} from "vue";
import _ from 'lodash';
import axios from "axios";
import { TIvtMaterial } from "../models/TIvtMaterial";
import { useStore } from "../../../../stores/mainStore";
import { useMasterStore } from "../../../../stores/masterStore";
import DayJsEx from "../../../../frameworks/DayJsEx";
import TIvtMaterialConst from "../../consts/TIvtMaterialConst";

/**
 * 在庫用composition 
 * @returns 
 */
export function tIvtMaterialComposition() { 

    const store = useStore() ;
    const masterStore = useMasterStore() ;
    const _this = getCurrentInstance()?.proxy ;
   
    const appUrl = 'api/tIvtMaterial' ;


    /**
     * 材料明細idから在庫データ取得
     * @param matDsId 材料明細id
     */
    async function getByMMaterialDetailId(mMatDsId:number ,date:Date = new Date()):Promise<TIvtMaterial[]>{        
        return new Promise(async (resolve,reject) => {         
            let ep = appUrl + `/getByMMaterialDetailId/${mMatDsId}/${formatD(date)}`
            
            try{
                const res = await axios.get(ep) ;
                // console.log(res.data)
                const parsed = res.data.map((x:object) => TIvtMaterial.parse(x)) ;
                resolve(parsed) ;
            } 
            catch (error ) {
                //@ts-ignore
                error.ep = ep ; 
                reject(error) ; 
            }
        })
    }


    /**
     * 保存
     * @param tIvtMaterial
     */
    async function save(tIvtMaterial:TIvtMaterial):Promise<TIvtMaterial>{
        return new Promise(async (resolve,reject) => { 

            const isNew = _.isNil(tIvtMaterial.id) ;
            let ep = isNew ? appUrl : `${appUrl}/${tIvtMaterial.id}`
            tIvtMaterial.updated_m_user_id = cLoginUserId.value ?? 0 ;
            try{
                let res ;
                if(isNew) {
                    tIvtMaterial.created_m_user_id = cLoginUserId.value ?? 0 ;
                    res = await axios.post(ep,tIvtMaterial) ;

                } else {
                    res = await axios.put(ep,tIvtMaterial) ;
                }
                const parsed = TIvtMaterial.parse(res.data) ;
                resolve(parsed) ;
            } 
            catch (error ) {
                //@ts-ignore
                error.ep = ep ; 
                reject(error) ; 
            }
        })
    }

    /**
     * 複数行保存
     * @param tIvtMaterial
     */
    async function saveMulti(ivtMaterials:TIvtMaterial[]):Promise<TIvtMaterial[]> {
        return new Promise(async (resolve,reject) => { 
    
            let ep = `${appUrl}/saveMultiRow` ;
            try {
                const res = await axios.post(ep,ivtMaterials) ;
                const parsed = res.data.map( (x:any) => TIvtMaterial.parse(x))
                resolve(parsed) ;
            } 
            catch (error ) {
                //@ts-ignore
                error.ep = ep ; 
                reject(error) ; 
            }

        })
    
    }


    /**
     *入庫予定データから新しい入庫データを作成 
     * @param order 
     */
    async function createIvtInByOrder(row:ArrivalListRow):Promise<TIvtMaterial> {
        return new Promise(async (resolve,reject) => { 
            const formatted = convertOrdertoIvt(row) ;
            if(_.isEmpty(formatted)) return ;
            
            try{
                const res = await axios.post(appUrl,formatted) ;
                resolve(TIvtMaterial.parse(res.data))  ;
            } 
            catch (error ) {
                //@ts-ignore
                error.ep = appUrl ; 
                reject(error) ; 
            }
        })
    }



    /**
     * 入庫予定データから在庫データにコンバートする
     * @param order 
     * @return  
     */
    function convertOrdertoIvt(row:ArrivalListRow) {

        if(_.isEmpty(row)) return {};

        let ivtQty = row.po_qty ;
        let ivtPrice = row.price ;
        if(row.material_ivt_div_m_kv_id == TIvtMaterialConst.MATERIAL_IVT_DIV_M_KV_ID_CONTENTS_QTY) {
            ivtQty *= row.material_contents_qty ;
            ivtPrice = ivtPrice / ivtQty ;
        }

        return {
            m_branch_id              : row.m_branch_id, 
            supplier_m_customer_id   : row.supplier_m_customer_id, 
            m_material_detail_id     : row.m_material_detail_id, 
            t_p_invoice_detail_id    : null ,
            ivt_material_name        : row.po_material_name ,
            t_p_order_id             : row.t_p_order_id,
            t_p_order_detail_id      : row.id,
            ivt_m_kv_id              : TIvtMaterialConst.IVT_M_KV_ID_IN ,
            conducted_at             : formatDT(new Date()),
            qty                      : ivtQty, 
            price                    : ivtPrice, 
            total_price              : row.total_price, 
            created_m_user_id        : cLoginUserId.value, 
            updated_m_user_id        : cLoginUserId.value ,
            po_unit_m_kv_id          : row.unit_m_kv_id ,
            material_ivt_div_m_kv_id : row.material_ivt_div_m_kv_id,
            material_contents_qty    : row.material_contents_qty,
            po_qty                   : row.po_qty
        }   
    }

    //日＋時間
    function formatDT(date:Date){
        if(_.isNil(date)) return "" ;
        return DayJsEx.formatDateTime(date) ?? "" 
    }

    //日まで
    function formatD(date:Date){
        if(_.isNil(date)) return "" ;
        return DayJsEx.format(date)
    }

    //拠点名ストアから取得
    const cGetMBranchName = computed(() => (id:number|undefined) => {
        if(_.isNil(id)) return "" ;
        return masterStore.getMBranchById(id)?.short_name ?? "" 
    }) ;    

    //区分から取得
    const cGetMKvName = computed(() => (id:number|undefined) => {
        if(_.isNil(id)) return "" ;
        return masterStore.getMKvById(id)?.kv_name ?? "" 
    }) ;

    //在庫単位表示用
    const cDisplayMaterialIvtDiv = computed(() => (ivtDivMKvId:number,poUnitMKvId:number) => 
        ivtDivMKvId === TIvtMaterialConst.MATERIAL_IVT_DIV_M_KV_ID_PO_UNIT 
            ? cGetMKvName.value(poUnitMKvId) : '内容数'
    )


    //単価表示権限
    //@ts-ignore
    const cIsViewPrice = computed(() => true )//_this.$$cIsDebug)

    const cLoginUserId = computed(() => store.loginMUser?.id) ;
    return {
        getByMMaterialDetailId,
        createIvtInByOrder,
        convertOrdertoIvt,
        cGetMBranchName,
        cGetMKvName,
        cDisplayMaterialIvtDiv,
        cLoginUserId,
        save,
        saveMulti,
        formatDT,
        formatD,
        cIsViewPrice,
    }

}

/**
 * 入庫予定データ
 */
export type ArrivalListRow = {

    id                       :number 
    m_branch_id              :number
    m_material_detail_id     :number
    m_material_id            :number
    order_date               :Date
    category_m_kv_id         :number
    due_date                 :Date
    is_stocked               :boolean
    po_material_name         :string
    display_name             :string
    material_cd              :string
    po_qty                   :number
    price                    :number
    sub_category_m_kv_id     :number
    supplier_m_customer_id   :number
    supplier_m_customer_name :string
    t_ivt_material_ins       :TIvtMaterial[]
    t_p_invoice_detail_id    :number|null
    t_p_order_id             :number
    total_price              :number
    unit_m_kv_id             :number
    isChecked?               :boolean
    material_ivt_div_m_kv_id :number
    material_contents_qty    :number
}



export type SearchParams = {

    m_branch_id            : number
    conducted_at?          : Date|string|null
    order_date_from?       : Date|string|null
    order_date_to?         : Date|string|null
    m_material_detail_id   : number
    m_material_id          : number
    category_m_kv_id       : number
    sub_category_m_kv_id   : number
    ivt_material_name      : string
    supplier_m_customer_id : number
    is_ivt_in?             : boolean

}



export type listObj = {
    category_m_kv_id:number
    ivt_material_name:string
    m_branch_id:number
    m_material_detail_id:number
    m_material_id:number
    sub_category_m_kv_id:number
    sum_qty:number
    sum_total_price:number
    supplier_m_customer_id:number
    supplier_m_customer_name:string
    material_ivt_div_m_kv_id:number

    //発注系
    po_material_name:string
    po_qty:number
    po_material_w:number
    po_material_h:number
    po_unit_price:number
    po_unit_m_kv_id:number
    po_slip_memo:string|null
    po_due_date:Date|string|null
    tax_fraction_m_kv_id?:number
    account_m_kv_id?:number
}


