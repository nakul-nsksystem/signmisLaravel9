<template>
    <div>
        <div class="row mb-3">
            <div class="col-12">
                <div 
                    class="btn-group btn-group-toggle" >
                    <label class="btn btn-dark"
                        :class="{active : state.viewMode === 'ivt' }"
                        data-toggle="tooltip" data-placement="top" title="在庫一覧" >
                        <input type="radio" v-model="state.viewMode" name="view-modes" value="ivt">
                        <i class="fas fa-warehouse fa-fw "></i>
                    </label> 
                    <label class="btn btn-dark"
                        :class="{active : state.viewMode === 'po' }" 
                        data-toggle="tooltip" data-placement="top" title="発注" >
                        <input type="radio" v-model="state.viewMode" name="view-mode" value="po">
                        <i class="fas fa-shopping-cart fa-fw "></i>
                    </label>
                </div>  
                
            </div>
            
        </div>
        <div class="row">
            <div class="col-12">
                <div class="table-responsive">
                    <table class="table table-striped table-dark">
                        <thead>
                            <tr v-if="state.viewMode==='ivt'">
                                <th style="width:5%; min-width:50px;">Actions</th>
                                <th style="width:5%; min-width:50px;">拠点</th>
                                <th style="width:25%; min-width:250px;">名称</th>
                                <th style="width:5%; min-width:50px;" class="text-right">在庫数</th>
                                <th style="width:5%; min-width:50px;"></th>
                                <th style="width:10%; min-width:100px;" class="text-right">在庫金額</th>
                                <th style="width:8%; min-width:80px;">最終入庫</th>
                                <th style="width:8%; min-width:80px;">最終出庫</th>
                                <th style="width:8%; min-width:80px;">最終棚卸</th>
                            </tr>
                            <tr v-else-if="state.viewMode==='po'">
                                <th style="width:5%; min-width:50px;">拠点</th>
                                <th style="width:5%; min-width:50px;">仕入先</th>
                                <th style="width:25%; min-width:250px;">名称</th>
                                <th style="width:5%; min-width:50px;" class="text-right">在庫数</th>
                                <th style="width:5%; min-width:50px;"></th>
                                <th style="width:7%; min-width:70px;">発注数</th>
                                <th style="width:7%; min-width:50px;"></th>
                                <th style="width:8%; min-width:80px;">納期</th>
                                <th style="width:25%; min-width:250px;">備考</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-if="state.viewMode==='ivt'">
                                <tr v-for="(n,index) in state.list" :key="n.m_material_detail_id" class="text-nowrap">
                                    <td>
                                        <router-link :to="cEditPath(n.m_material_detail_id)" title="" append >
                                            <button type="button" class="btn btn-success" >
                                                <i class="fas fa-edit fa-fw" />                            
                                            </button>
                                        </router-link>
                                    </td>
                                    <td>{{cGetMBranchName(n.m_branch_id)}}</td>
                                    <td>{{n.ivt_material_name}}</td>
                                    <td class="text-right">{{n.sum_qty.toLocaleString()}}</td>                                
                                    <td>{{cDisplayMaterialIvtDiv(n.material_ivt_div_m_kv_id,n.po_unit_m_kv_id)}}</td>                                
                                    <td class="text-right">{{n.sum_total_price.toLocaleString()}}</td>
                                    <td>{{$$formatDay(n.last_ivt_in_at)}}</td>
                                    <td>{{$$formatDay(n.last_ivt_out_at)}}</td>
                                    <td>{{$$formatDay(n.last_completed_at)}}</td>
                                </tr>
                            </template>
                            <template v-else-if="state.viewMode==='po'">
                                <tr v-for="n in state.list" :key="n.m_material_detail_id" class="text-nowrap">
                                    <td>{{cGetMBranchName(n.m_branch_id)}}</td> 
                                    <td>{{n.supplier_m_customer_name}}</td>
                                    <td>
                                        <div>{{n.ivt_material_name}}</div>
                                        <div>{{n.po_material_name}}</div>
                                    </td>
                                    <td class="text-right">{{n.sum_qty.toLocaleString()}}</td>                                
                                    <td>{{cDisplayMaterialIvtDiv(n.material_ivt_div_m_kv_id,n.po_unit_m_kv_id)}}</td>                                
                                    <td class="text-right">
                                        <ns-number-input
                                            v-model="n.po_qty"
                                            />
                                    </td>
                                    <td>{{cGetMKvName(n.po_unit_m_kv_id)}}</td>
                                    <td>
                                        <ex-v-date-picker
                                            v-model="n.po_due_date"
                                            />
                                    </td>
                                    <td>
                                        <textarea rows="1" class="form-control" v-model="n.po_slip_memo"></textarea>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="col-9">
                <pagination
                    :p-pagination.sync="state.pagination"
                    @search="search($event)"
                    />
            </div>
            <div class="col-3 text-right">
                <button type="button" :disabled="state.isLoading" class="btn btn-success" @click.prevent="openOrderModal()"  v-show="state.viewMode==='po'">
                    発注
                </button>
            </div>
        </div>
        <t-ivt-material-edit-modal
            v-model="state.list4Edit"
            @updateQty="updateQty($event)"
            @updateTotalPrice="updateTotalPrice($event)"
            />
        <div class="modal fade" 
            id="ivtOrderModal" 
            tabindex="-1" 
            role="dialog" 
            style="margin-top: 0px;">
            <div class="modal-dialog modal-dialog-fluid" role="document">
                <div class="app-modal-content-dark">
                    <t-p-order-list
                        :purchaseOrder="state.orderList"
                        :isTIvt="true"
                        />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import _ from "lodash" ;
import axios from 'axios'
import { computed, getCurrentInstance, reactive, ref } from 'vue';
import { useStore } from '../../../stores/mainStore';
import { MKv } from '../../masters/class/models/MKv';
import { useMasterStore } from '../../../stores/masterStore';
import DayJsEx from '../../../frameworks/DayJsEx'
import { tIvtMaterialComposition ,SearchParams,listObj} from '../class/compositions/tIvtMaterialComposition'
import { TIvtMaterial } from "../class/models/TIvtMaterial";
import ArrayUtil from "../../../frameworks/ArrayUtil";
import TIvtMaterialConst from "../consts/TIvtMaterialConst"

const _this = getCurrentInstance()?.proxy ;
const store = useStore() ;
const masterStore = useMasterStore() ;

const { cGetMBranchName ,cGetMKvName ,cDisplayMaterialIvtDiv ,getByMMaterialDetailId ,formatD} = tIvtMaterialComposition() ;

interface IProps {
    conditions:SearchParams
}

const props = withDefaults(defineProps<IProps>(), {})

const state = reactive<{
    viewMode:string
    isLoading:boolean
    isEditRowLoading:boolean
    isOrderSuccess:boolean
    list:listObj[]
    list4Edit:TIvtMaterial[]
    pagination:any
    selectedCatMKv:MKv|{}
    orderList:any
    editingIdx:number
}>({

    viewMode : 'ivt' ,
    //ロード中
    isLoading : false ,
    isEditRowLoading : false , 
    isOrderSuccess : false ,
    
    //検索結果
    list : [] ,

    list4Edit : [],

    //選択した材料カテゴリオブジェクト
    selectedCatMKv:{} ,

    //ページネーション関連項目
    pagination : {   // pagination
        links : [] , // リンク
        total : -1 , // 合計件数
        from : -1 ,  // 現在ページの開始位置
        to : -1 ,    // 現在ページの終了位置
    } ,

    orderList : [] ,
    editingIdx : -1 
})

interface IEmits {
    // (e: 'updateIvtIns', value: TIvtMaterial): void
    (e: 'error',value:any): void
}
const emit = defineEmits<IEmits>() ;

const cViewMode = computed(() => state.viewMode === 'ivt' ? "在庫一覧" : "発注") ;

//検索
async function search(url?:string) {
    state.isLoading = true ; 

    let ep = (url? url : 'api/tIvtMaterial/retrieve') ;

    const copied = _.cloneDeep(props.conditions) ;
    delete copied.is_ivt_in ;
    delete copied.order_date_from ;
    delete copied.order_date_to ;
    
    //基準日当日の入出庫データを反映させるために時間を23:59:59固定する
    if(!_.isNil(copied.conducted_at)) {
        //@ts-ignore
        copied.conducted_at = DayJsEx.format(copied.conducted_at) + ' 23:59:59' ;
    }

    try { 
        
        const res = await axios.post(ep,copied) ;
        state.list = res.data.data ;
        // pagination関連
        state.pagination.links = res.data.links ;   // リンク
        state.pagination.total = res.data.total ;   // 合計件数
        state.pagination.from  = res.data.from ;    // 現在ページの開始位置
        state.pagination.to    = res.data.to ;      // 現在ページの終了位置
        
        // const parsed = res.data.data.map( (x:any) => TIvtMaterial.parse(x))
        // console.log(res.data.data) ;
        // console.log(state.list) ;
    }
    catch (error ) {                            
        emit("error",error)
        //@ts-ignore
        // _this.$$errorConsole(error ,error.ep) ;
    }
    finally {
        state.isLoading = false ; 
    }
}

const cEditPath = computed(() => (id:number) => {
    //@ts-ignore
    const date = formatD(props.conditions.conducted_at ?? new Date()) ;
    return `edit/${id}/${date}`
})
async function edit(mMatDsId:number,idx:number){

    state.isEditRowLoading = true ; 
    state.editingIdx = idx ;
    try { 
        const res = await getByMMaterialDetailId(mMatDsId) ; 
        // console.log(res)
        ArrayUtil.resetInsert(state.list4Edit , res) ; 
        
        $('#ivtEditModal').modal() ;
    
    }
    catch (error ) {   
        emit("error",error)
        // _this.$$errorConsole(error ,error.ep) ;
        state.editingIdx = -1 ;
    }
    finally {
        state.isEditRowLoading = false ; 
    }

    // ivtEditModal.value.open() ;
}
function updateQty(val:number){
    if( state.editingIdx == -1 ) return ;
    state.list[state.editingIdx].sum_qty = val ;
}
function updateTotalPrice(val:number){
    if( state.editingIdx == -1 ) return ;
    state.list[state.editingIdx].sum_total_price = val ;
}

function openOrderModal() {
    ConvIvtToOrder() ;
    $("#ivtOrderModal").modal() ;
}

//発注用にデータをコンバート
function ConvIvtToOrder(){
    //数量1以上をフィルター
    const validList = state.list.filter((x) => x.po_qty > 0 ) ;
    const tPOrders = Array() ;

    for(const x of validList) {
        const formatRow = {
            isTIvt : true ,
            m_branch_id            : x.m_branch_id ,
            m_branch               : masterStore.getMBranchById(x.m_branch_id) ,
            supplier_m_customer_id : x.supplier_m_customer_id ,
            supplier_m_customer    : {
                id : x.supplier_m_customer_id ,
                name : x.supplier_m_customer_name ,
                tax_fraction_m_kv_id : x.tax_fraction_m_kv_id ,
                account_m_kv_id : x.account_m_kv_id ,
            } ,
            m_user_id              : store.loginMUser?.id ?? 0 ,
            m_user                 : store.loginMUser ,
            order_date             : formatD(new Date()) ,
            slip_memo              : null ,
            t_p_order_details      : Array() ,
            created_m_user_id      : store.loginMUser?.id ?? 0 ,
            updated_m_user_id      : store.loginMUser?.id ?? 0 ,
            updated_m_user         : store.loginMUser ,
        }

        const detailRow = { 
            m_material_detail_id : x.m_material_detail_id ,
            material_name        : x.po_material_name,
            po_material_name     : x.po_material_name,
            material_size_x      : x.po_material_w ,
            material_size_y      : x.po_material_h ,
            shipping_address     : null ,
            due_date             : x.po_due_date ,
            price                : x.po_unit_price ,
            total_price          : x.po_unit_price * x.po_qty ,
            qty                  : x.po_qty ,
            unit_m_kv_id         : x.po_unit_m_kv_id ,
            unit_m_kv            : masterStore.getMKvById(x.po_unit_m_kv_id) ,
            t_project_id         : null ,
            t_project            : null ,
            slip_memo            : x.po_slip_memo ,
            created_m_user_id    : store.loginMUser?.id ?? 0 ,
            updated_m_user_id    : store.loginMUser?.id ?? 0 ,
        }
        //同一仕入れ先の材料をまとめる
        const found = tPOrders.find(y => y.supplier_m_customer_id == formatRow.supplier_m_customer_id);
        const foundIdx = tPOrders.indexOf(found) ;

        if( foundIdx == -1 ) {

            formatRow.t_p_order_details.push(detailRow) ;
            tPOrders.push(formatRow) ;

        } else {

            tPOrders[foundIdx].t_p_order_details.push(detailRow) ;
        
        }
    }

    ArrayUtil.resetInsert(state.orderList,tPOrders)

}
</script>
