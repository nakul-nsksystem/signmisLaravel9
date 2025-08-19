<template>
    <div>
        <div class="row mb-2">
            <contents-header-left
                :custom-menu-title="`QR${cTypeName}`">
            </contents-header-left>
            <contents-header-right></contents-header-right>            
        </div>
        <div class="app-contents-container">
            <div v-if="state.isSuccess" class="alert alert-success" role="alert">
                保存しました
            </div>
            <div v-if="$$cIsError || state.isError" class="alert alert-danger" role="alert">
                {{dErrorData.message}}
            </div>
            <validation-observer v-slot="{ invalid }" >
                <div class="row mt-2">
                    <div class="col-12 col-xl-3 form-group">
                        <label>拠点</label>
                        <m-branch-select
                            v-model="state.selectedMBranchId"
                            />
                    </div>
                    <div class="col-12">
                        <qr-code-reader-component
                            @getQRData="state.qrData=$event"
                            />
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col-12">
                        <div class="table-responsive">
                            <table class="table table-dark">
                                <thead>
                                    <tr>
                                        <th style="width:5%; min-width:50px;">拠点</th>
                                        <th style="width:10%; min-width:100px;">日付</th>
                                        <th style="width:15%; min-width:150px;">区分</th>
                                        <th style="width:25%; min-width:250px;">名称</th>
                                        <th style="width:15%; min-width:150px;">ロットNo.</th>
                                        <th style="width:10%; min-width:100px;">数量</th>
                                        <th style="width:10%; min-width:100px;">単価</th>
                                        <th style="width:10%; min-width:100px;" class="text-right">金額</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(n,index) in state.ivtMaterials">
                                        <td>{{cGetMBranchName(n.m_branch_id)}}</td>
                                        <td>
                                            <validation-provider name="日付" rules="required" immediate v-slot="{ errors }">
                                                <ex-v-date-picker
                                                    v-model="n.conducted_at"
                                                    />
                                                <span class="validation-error">{{ errors[0] }}</span>
                                            </validation-provider>
                                        </td>
                                        <td>{{cGetMKvName(n.ivt_m_kv_id)}}</td>
                                        <td>{{n.ivt_material_name}}</td>
                                        <td>
                                            <input v-model="n.lot_no" type="text" class="form-control">
                                        </td>
                                        <td>
                                            <validation-provider :name=" n.qty + '' " rules="required|excluded:0" immediate v-slot="{ errors }">
                                                <ns-number-input
                                                    v-model="n.qty"
                                                    />
                                                <span class="validation-error">{{ errors[0] }}</span>
                                            </validation-provider>
                                        </td>
                                        <td>
                                            <validation-provider :name=" n.price + '' " rules="required|excluded:0" immediate v-slot="{ errors }">
                                                <ns-number-input
                                                    v-model="n.price"
                                                    />
                                                <span class="validation-error">{{ errors[0] }}</span>
                                            </validation-provider>
                                        </td>
                                        <td class="text-right">{{cInputTotalPrice(n)}}</td>
                                        <td class="text-right">
                                            <button type="button" class="btn btn-danger" @click.prevent="destroy(index)">
                                                <i class="fas fa-trash fa-fw"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col-12 text-right">
                        <button type="button" class="btn btn-success" @click.prevent="postData()" :disabled="invalid || state.isLoading">
                            <div v-if="state.isLoading">
                                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                保存中...
                            </div>
                            <div v-else>
                                保存
                            </div>
                        </button>
                        <button type="button" class="btn btn-secondary" @click.prevent="clear()" :disabled="state.isLoading">クリア</button>

                    </div>
                </div>
            </validation-observer>
        </div>
    </div>
</template>
<script lang="ts">
import PageMixins from '../../mixins/commons/PageMixins';
export default {
    mixins : [PageMixins] ,
}
</script>
<script lang="ts" setup>
import _ from "lodash" ;
import axios from 'axios'
import { computed, getCurrentInstance, reactive, ref ,watch } from 'vue';
import { useStore } from '../../stores/mainStore';
import { useRoute } from '../../routers/routerPlugin';
import { TIvtMaterial } from './class/models/TIvtMaterial';
import { tIvtMaterialComposition } from './class/compositions/tIvtMaterialComposition';
import { MMDCustom } from './class/models/MMDCustom';
import TIvtMaterialConst from './consts/TIvtMaterialConst';
import ArrayUtil from '../../frameworks/ArrayUtil';
import NumberUtil from '../../frameworks/NumberUtil';
import { TPOrderDetails } from '../tPOrders/class/model/TPOrderDetails';

const _this = getCurrentInstance()?.proxy ;
const store = useStore() ;
const { formatDT ,cLoginUserId ,cGetMBranchName ,cGetMKvName ,cIsViewPrice ,saveMulti } = tIvtMaterialComposition();

const route = useRoute() ;

const type = route.params.type ;

const cTypeName = computed(() => {
    let name = "" ;
    if(type == 'ivtin')  name = '入庫' ;
    if(type == 'ivtout') name = '出庫' ;
    if(type == 'adjust') name = '棚卸' ;
    return name ;
})

const cIvtDivMKvId = computed(() => {
    let id = 0 ;
    if(type == 'ivtin')  id = TIvtMaterialConst.IVT_M_KV_ID_IN ;
    if(type == 'ivtout') id = TIvtMaterialConst.IVT_M_KV_ID_OUT ;
    if(type == 'adjust') id = TIvtMaterialConst.IVT_M_KV_ID_ADJUST ;
    return id ;
})

const state = reactive({
    selectedMBranchId : 0 ,
    qrData : undefined as string|undefined ,
    ivtMaterials : Array() as TIvtMaterial[],
    isLoading:false,
    isSuccess:false,
    isError:false,

    readedQr : [] as string[] ,
})

const cQrData = computed(() => {
    if(_.isNil(state.qrData)) return [] ;
    const array = state.qrData.split(';') ;
    return array ;
})

watch(() => state.qrData, (newVal, oldVal) => {
    if ( newVal !== undefined && newVal !== oldVal ) {
        getData() ;
    }
},{immediate:false})

//Qrから材料データ取得
async function getData() {

    if(_.isNil(state.qrData)) return ;

    //読み込み済のQR判定
    const duplicated = state.readedQr.find(x => x == state.qrData) 
    if( duplicated !== undefined ) {
        state.isError = true ;
        //@ts-ignore 
        _this.dErrorData.message = "読み取り済のQRコードです"
        return ;
    }

    const qrDataArray = state.qrData.split(';') ;

    const materialDetailId = qrDataArray[0] == "" ? 0 : NumberUtil.invalid2zr(Number(qrDataArray[0])) ;
    const tPOrderDetailId  = qrDataArray[1] == "" ? 0 : NumberUtil.invalid2zr(Number(qrDataArray[1])) ;

    if(materialDetailId === 0) return ;
    
    const isMaterialIdOnly = tPOrderDetailId === 0 ;

    //発注idがqr内に含まれているかどうかでAPI分岐
    if(isMaterialIdOnly) {
        getByMMaterialDetailId(materialDetailId) ;
    }
    else {
        getByTPOrderDetailId(tPOrderDetailId) ;
    }

}

async function getByMMaterialDetailId(id:number) {

    let ep = `api/mMaterialDetail/showWithParent/${id}/isIvt`
    
    try {
        const res = await axios.get(ep) ;
        
        state.isError = false ;
        formatMMaterialDs(res.data) ;

        state.readedQr.push(state.qrData!) ;
    

    } catch (error) {
        // @ts-ignore
        _this.$$errorConsole(error , ep ) ; 
    }
}

async function getByTPOrderDetailId(id:number) {

    let ep = 'api/'
    if(type == 'ivtin') {
        ep += `tPOrderDetail/${id}`
    }
    else {
        ep += `tIvtMaterial/showByQr/${id}`
    }
    
    try {
        const res = await axios.get(ep) ;
        
        // console.log(res.data)
        
        state.isError = false ;
        if(type == 'ivtin') {
            formatTPOrderDs(res.data)
        }
        else {
            formatTIvtIns(res.data)
        }
        state.readedQr.push(state.qrData!) ;

    } catch (error) {
        // @ts-ignore
        _this.$$errorConsole(error , ep ) ; 
    }
}

//材料データを在庫用に変更する
function formatMMaterialDs(row:MMDCustom) {

    let ivtQty = 1 ;
    let ivtPrice = row.unit_price ;
    const name = row.m_material?.display_name ?? row.m_material?.name ;

    const obj =  {
        m_branch_id              : state.selectedMBranchId, 
        supplier_m_customer_id   : row.m_material?.supplier_m_customer_id, 
        m_material_detail_id     : row.id, 
        t_p_invoice_detail_id    : null ,
        ivt_material_name        : name + row.detail_name,
        ivt_m_kv_id              : cIvtDivMKvId.value ,
        conducted_at             : formatDT(new Date()),
        qty                      : ivtQty, 
        price                    : ivtPrice, 
        total_price              : ivtQty * ivtPrice , 
        created_m_user_id        : cLoginUserId.value, 
        updated_m_user_id        : cLoginUserId.value ,
        po_unit_m_kv_id          : row.unit_m_kv_id ,
        ivt_div_m_kv_id          : row.ivt_div_m_kv_id,
    }   

    const parsed = TIvtMaterial.parse(obj)
    state.ivtMaterials.push(parsed) ;
}
//発注データを在庫用に変更する
function formatTPOrderDs(row:TPOrderDetails) {

    let name = '' ;

    //@ts-ignore
    if(!_.isNil(row.m_material_detail?.m_material?.display_name)) {
        //@ts-ignore
        name += row.m_material_detail?.m_material?.display_name ;
    }
    else {
        //@ts-ignore
        name += row.m_material_detail?.m_material?.name ;
    }

    name += row.m_material_detail?.detail_name ;

    const obj =  {
        m_branch_id              : state.selectedMBranchId, 
        supplier_m_customer_id   : row.t_p_order.supplier_m_customer_id, 
        m_material_detail_id     : row.m_material_detail_id, 
        t_p_invoice_detail_id    : null ,
        t_p_order_detail_id      : row.id ,
        ivt_material_name        : name ,
        ivt_m_kv_id              : cIvtDivMKvId.value ,
        conducted_at             : formatDT(new Date()),
        qty                      : row.qty, 
        price                    : row.price, 
        total_price              : row.total_price , 
        created_m_user_id        : cLoginUserId.value, 
        updated_m_user_id        : cLoginUserId.value ,
        po_unit_m_kv_id          : row.unit_m_kv_id ?? 0,
        ivt_div_m_kv_id          : row.m_material_detail?.ivt_div_m_kv_id ?? 0 ,
    } 
    const parsed = TIvtMaterial.parse(obj)
    state.ivtMaterials.push(parsed) ;  
}
//入庫データを在庫用に変更する
function formatTIvtIns(row:TIvtMaterial){

    row.id = undefined ;
    row.ivt_m_kv_id = cIvtDivMKvId.value ; 
    row.created_m_user_id = cLoginUserId.value ?? 0 ;
    row.updated_m_user_id = cLoginUserId.value ?? 0 ;

    const parsed = TIvtMaterial.parse(row) ;
    state.ivtMaterials.push(parsed) ;  
}

const cInputTotalPrice = computed(() => (row:TIvtMaterial) => {
    if(_.isEmpty(row)) return 0 ;
    const total = row.price * row.qty ;
    row.total_price = total ;
    return total.toLocaleString() ;
})

async function postData() {
    if(_.isEmpty(state.ivtMaterials)) return ;

    state.isLoading = true ;
    state.isSuccess = false ;


    
    if(type === 'adjust') {

        for(const row of state.ivtMaterials) {
            row.t_ivt_material_complete = {
                m_material_detail_id : row.m_material_detail_id ,
                t_ivt_material_id : null ,
                qty : row.qty, 
                total_price : row.total_price , 
                completed_at : row.conducted_at ,
                created_m_user_id : cLoginUserId.value ?? 0 ,
                CreatedMUserId :  cLoginUserId.value ?? 0 ,
                updated_m_user_id : cLoginUserId.value ?? 0 ,
            }
        }
        
    }
    // console.log(state.list)
    try {
        const res = await saveMulti(state.ivtMaterials)
        ArrayUtil.resetInsert(state.ivtMaterials , res) ; 
        state.isSuccess = true ;
    } 
    catch (error) {
        //@ts-ignore
        _this.$$errorConsole(error, error.ep) ;
    }
    finally {
        state.isLoading = false ;
    }

}

function clear() {
    state.ivtMaterials.splice(0)
}

function destroy(idx:number) {
    if( idx === undefined ) return ;
    if(!confirm('削除しますか？')) return ;
    state.ivtMaterials.splice(idx,1)
}

state.selectedMBranchId = store.loginMUser?.m_branch_id ?? 0 ;

// state.qrData = "1705301;663;202308311756-2" ;
// getData() ;

</script>