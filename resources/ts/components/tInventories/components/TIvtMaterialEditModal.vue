<template>
<!-- 削除予定 -->
    <div class="modal fade" 
         id="ivtEditModal" 
         tabindex="-1" 
         role="dialog" 
         data-backdrop="static"
         style="margin-top: 0px;">
        <div class="modal-dialog modal-dialog-fluid" role="document">
            <div class="app-modal-content-dark" v-if="cIsShow">                
                <div class="p-2">
                    <div v-show="state.isSuccess" class="alert alert-success" role="alert">
                        保存に成功しました
                    </div>
                    <div v-if="$$cIsError" class="alert alert-danger" role="alert">
                        {{ dErrorData.message }}
                    </div>
                </div>
                <div class="modal-body pt-0">
                    <div class="row mb-3">
                        <div class="col-12 col-xl-4 form-group">
                            <label>名称</label>
                            <div>{{ cMaterialName }}</div>
                        </div>
                        <div class="col-12 col-xl-2 form-group">
                            <label>拠点</label>
                            <div>{{ cBranchName }}</div>
                        </div>
                        <div class="col-12 col-xl-3 form-group">
                            <label>仕入先</label>
                            <div>{{ cSupplierName }}</div>
                        </div>
                    </div>
                    <div class="row mb-1 pt-3 bg-dark">
                        <div class="col-12">
                            <div class="table-responsive">
                                <table class="table table-striped table-dark stickyTable">
                                    <thead>
                                        <tr>
                                            <th style="width:15%; min-width:150px;">日付</th>
                                            <th style="width:10%; min-width:100px;">区分</th>
                                            <th style="width:5%; min-width:50px;" class="text-right">入庫数</th>
                                            <th style="width:5%; min-width:50px;" class="text-right">出庫数</th>
                                            <th style="width:5%; min-width:50px;" class="text-right">残数</th>
                                            <th style="width:5%; min-width:50px;">単位</th>
                                            <th style="width:10%; min-width:100px;" v-show="cIsViewPrice" class="text-right">単価</th>
                                            <th style="width:10%; min-width:100px;" v-show="cIsViewPrice" class="text-right">金額</th>
                                            <th style="width:5%; min-width:50px;">仕入No</th>
                                            <th style="width:4%; min-width:50px;">発注No</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(n,index) in cValidIvt" :key="n.id" class="text-nowrap" 
                                            @click.prevent="selectIvt(n)" 
                                            :class="{ 'dark-selected':state.selectedIdx === index }">
                                            <td>{{ n.conducted_at }}</td>
                                            <td>{{ cGetMKvName(n.ivt_m_kv_id) }}</td>
                                            <td class="text-right">{{ cInQty(n) }}</td>
                                            <td class="text-right">{{ cOutQty(n) }}</td>
                                            <td class="text-right">{{ cQty(n) }}</td>
                                            <td>{{ cDisplayMaterialIvtDiv(n.material_ivt_div_m_kv_id,n.po_unit_m_kv_id) }}</td>
                                            <td v-if="cIsViewPrice" class="text-right">{{ n.price.toLocaleString() }}</td>
                                            <td v-if="cIsViewPrice" class="text-right">{{ cTotalPriceInTable(n) }}</td>
                                            <td>
                                                <a :href="`v#/t_p_invoice/edit/${n.t_p_invoice_id}`">{{ n.t_p_invoice_id }} - {{ n.t_p_invoice_detail_id }}</a>
                                            </td>
                                            <td>
                                                <a :href="`v#/t_p_order/edit/${n.t_p_order_id}`">{{ n.t_p_order_id }} - {{ n.t_p_order_detail_id }}</a>
                                            </td>
                                        </tr>                  
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td></td>
                                            <td>合計</td>
                                            <td class="text-right">{{ cTotalInQty.toLocaleString() }}</td>
                                            <td class="text-right">{{ cTotalOutQty.toLocaleString() }}</td>
                                            <td class="text-right">{{ cTotalQty.toLocaleString() }}</td>
                                            <td></td>
                                            <td v-if="cIsViewPrice"></td>
                                            <td v-if="cIsViewPrice" class="text-right">{{ cTotalPrice.toLocaleString() }}</td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="row mb-1">
                        <div class="col-12 text-right">
                            <button type="button" class="btn btn-primary" @click.prevent="showEditForm()">
                                <i class="fas fa-plus fa-fw"></i>
                            </button>
                        </div>
                        <div class="col-12 mt-3 h5">{{ cFormStatus }}</div>
                    </div>

                    <div v-if="state.isShowEditForm">
                        <validation-observer v-slot="{ invalid }" >
                            <div class="row pb-2 pt-2">
                                <div class="col-12 pb-2 ">
                                    <div class="border-bottom"></div>
                                </div>
                                
                            </div>
                            <div class="row">
                                <div class="col-12 col-xl-3 form-group">
                                     <validation-provider name="日付" rules="required" immediate v-slot="{ errors }">
                                        <label for="">日付</label>
                                        <ex-v-date-picker
                                            v-model="state.row.conducted_at"
                                            />
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </validation-provider>
                                </div>
                                <div class="col-12 col-xl-2 form-group">
                                    <validation-provider name="区分" rules="required|excluded:0" immediate v-slot="{ errors }">
                                        <label for="">区分</label>
                                        <m-kv-select
                                            v-model="state.row.ivt_m_kv_id"
                                            :kv-key="'t_inventory-division'"
                                            />
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </validation-provider>
                                </div>
                                <div class="col-12 col-xl-2 form-group">
                                    <validation-provider :name=" state.row.qty + '' " rules="required|excluded:0" immediate v-slot="{ errors }">
                                        <label for="">数量</label>
                                        <ns-number-input
                                            v-model="state.row.qty"
                                            />
                                        <span class="validation-info">{{ cQtyInputTips }}</span>
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </validation-provider>
                                </div>
                                <div class="col-12 col-xl-2 form-group">
                                    <validation-provider :name=" cInputPrice + '' " rules="required|excluded:0" immediate v-slot="{ errors }">
                                        <label for="">単価</label>
                                        <ns-number-input
                                            v-model="cInputPrice"
                                            />
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </validation-provider>
                                </div>
                                <div class="col-12 col-xl-2 form-group">
                                    <label for="">金額</label>
                                    <p class="text-right">{{ cInputTotalPrice.toLocaleString() }}</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12 col-xl-4 pt-4 ml-auto">
                                    <div class="float-right mt-1">
                                        <button type="button" class="btn btn-success"  @click.prevent="postData()" :disabled="invalid">保存</button>
                                        <button type="button" class="btn btn-secondary ml-1" @click.prevent="closeEditForm()">キャンセル</button>
                                    </div>
                                </div>
                            </div>
                        </validation-observer>
                    </div>
                </div>
                <div class="p-3">
                    <div class="modal-footer pr-0">
                        <button type="button" class="btn btn-light" @click.prevent="closeModal()">閉じる</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import _ from "lodash";
import { computed, getCurrentInstance, reactive ,watch} from "vue";
import { TIvtMaterial } from "../class/models/TIvtMaterial";
import { tIvtMaterialComposition } from "../class/compositions/tIvtMaterialComposition"
import TIvtMaterialConst from "../consts/TIvtMaterialConst";
import axios from "axios";
import { TIvtMaterialComplete } from "../class/models/TIvtMaterialComplete";

    const {cGetMKvName ,cGetMBranchName ,cLoginUserId ,save ,formatDT ,cDisplayMaterialIvtDiv ,cIsViewPrice} = tIvtMaterialComposition() ;

    interface IProps {
        value:Array<TIvtMaterial>
    }
    const _this = getCurrentInstance()?.proxy ;

    const props = withDefaults(defineProps<IProps>(), {})

    interface IEmits {
        (e: 'updateQty', value: number): void
        (e: 'updateTotalPrice', value: number): void
    }
    const emit = defineEmits<IEmits>() ;
    
        
    const state = reactive({
        row : { 
            id:undefined ,
            conducted_at : formatDT(new Date()) ,
            ivt_m_kv_id : TIvtMaterialConst.IVT_M_KV_ID_ADJUST ,
            qty : 0 ,
            price : 0 ,
            total_price : 0 ,
        } ,
        isShowEditForm : false ,
        loading : false ,
        isSuccess : false ,
        selectedIdx : -1 ,
        lastInvoiceD : {} 
    })

    /**画面描画用 */
    //表示制御
    const cIsShow = computed( () => !_.isEmpty(props.value) ) ;
    const cMaterialName = computed( () => !_.isEmpty(props.value) ? props.value[0].ivt_material_name : "" ) ;
    //@ts-ignore
    const cBranchName = computed( () => !_.isEmpty(props.value) ? cGetMBranchName.value(props.value[0].m_branch_id) : "" ) ;
    const cSupplierName = computed( () => !_.isEmpty(props.value) ? props.value[0].supplier_m_customer_name : "" ) ;

    const cQtyInputTips = computed(() => state.row.ivt_m_kv_id === TIvtMaterialConst.IVT_M_KV_ID_ADJUST ? '残数を入力してください' : '数量を入力してください' )

    //最終締
    const cLastCompleted = computed(() => {
        if(_.isEmpty(props.value)) return {} ;
        const found = [...props.value].reverse().find(e => e.ivt_m_kv_id === TIvtMaterialConst.IVT_M_KV_ID_ADJUST) ;
        return found ?? {} ;
    })

    //締め考慮有効在庫データ
    const cValidIvt = computed(() => {
        if(_.isEmpty(props.value)) return [] ;
        const filterd = props.value.filter( (x) => {
            if(_.isEmpty(cLastCompleted.value)) return x ;
            //@ts-ignore
            return x.conducted_at >= cLastCompleted.value.conducted_at ;
        })
        return filterd ;
    })

    //入庫数
    const cInQty  = computed(() => (row:TIvtMaterial) => row.ivt_m_kv_id == TIvtMaterialConst.IVT_M_KV_ID_IN ? row.qty.toLocaleString() : "" ) ;
    //出庫数
    const cOutQty = computed(() => (row:TIvtMaterial) => row.ivt_m_kv_id == TIvtMaterialConst.IVT_M_KV_ID_OUT ? row.qty.toLocaleString() : "" ) ;
    //残数
    const cQty = computed(() => (row:TIvtMaterial) => {
        if(row.ivt_m_kv_id == TIvtMaterialConst.IVT_M_KV_ID_ADJUST) return row.t_ivt_material_complete!.qty.toLocaleString() ;
        const idx = cValidIvt.value.indexOf(row) ;
        let sum = 0 ;
        for(let i = 0 ; i <= idx ; i++) {
            const data = cValidIvt.value[i] ;
            data.ivt_m_kv_id == TIvtMaterialConst.IVT_M_KV_ID_OUT ? sum -= data.qty : 
            data.ivt_m_kv_id == TIvtMaterialConst.IVT_M_KV_ID_IN  ? sum += data.qty :
            sum += ( data.t_ivt_material_complete?.qty ?? 0 ); 
        }
        return sum ;
    }) ;

    //金額（表）
    const cTotalPriceInTable = computed(() => (row:TIvtMaterial) => 
        row.ivt_m_kv_id == TIvtMaterialConst.IVT_M_KV_ID_ADJUST ? 
            row.t_ivt_material_complete!.total_price.toLocaleString() :
            row.total_price.toLocaleString()  
        ) ;

    //総入庫数
    const cTotalInQty = computed(() => { 
        if(_.isEmpty(cValidIvt.value)) return ;
        const val = cValidIvt.value.reduce((sum, i) => 
            i.ivt_m_kv_id == TIvtMaterialConst.IVT_M_KV_ID_IN ? sum + i.qty : sum      
            , 0)
        return val ;
    }) ;
    //総出庫数
    const cTotalOutQty = computed(() => { 
        if(_.isEmpty(cValidIvt.value)) return ;
        const val = cValidIvt.value.reduce((sum, i) => 
            i.ivt_m_kv_id == TIvtMaterialConst.IVT_M_KV_ID_OUT ? sum + i.qty : sum
            , 0)
        return val ;
    }) ;
    //合計残数（締考慮）
    const cTotalQty = computed(() => { 
        if(_.isEmpty(cValidIvt.value)) return ;
        const val = cValidIvt.value.reduce((sum, i) => 
            i.ivt_m_kv_id == TIvtMaterialConst.IVT_M_KV_ID_OUT ? sum - i.qty : 
            i.ivt_m_kv_id == TIvtMaterialConst.IVT_M_KV_ID_IN  ? sum + i.qty :
            sum + i.t_ivt_material_complete!.qty  
            , 0)
        emit('updateQty',val) ;
        return val ;
    }) ;

    //合計金額（締考慮）
    const cTotalPrice = computed(() => {
        if(_.isEmpty(cValidIvt.value)) return ;
        const val = cValidIvt.value.reduce((sum, i) => 
            i.ivt_m_kv_id == TIvtMaterialConst.IVT_M_KV_ID_OUT ? sum - i.total_price : 
            i.ivt_m_kv_id == TIvtMaterialConst.IVT_M_KV_ID_IN  ? sum + i.total_price :
            sum + i.t_ivt_material_complete!.total_price 
        , 0)
        emit('updateTotalPrice',val) ;
        return val ;
    }) ;
    
    /**保存用 */
    //単価基準額（材料マスタ準拠）
    const cBasisMaterialPrice = computed(() => {
        if(_.isEmpty(props.value)) return 0 ;
        //@ts-ignore
        return props.value[0].m_material_unit_price ;
        // //@ts-ignore
        // if(_.isEmpty(state.lastInvoiceD)) return props.value[0].m_material_unit_price ;
        // //@ts-ignore
        // return state.lastInvoiceD.price ;
    } ) ;

    
    // watch(
    //     () => state.row.conducted_at,
    //     async (date) => {
    //         await getLastInvoicePrice()
    //     }
    // )

    // async function getLastInvoicePrice() {

    //     if(_.isNil(state.row.conducted_at)) {
    //         alert("日付を登録してください") ;
    //         return ;
    //     }

    //     let ep = 'api/tPInvoiceDetail/getLastPrice' ;
    //     try {

    //         const param = {
    //             m_material_detail_id : cMaterialDetailId.value ,
    //             date : state.row.conducted_at 
    //         }

    //         const res = await axios.post(ep,param) ;
    //         state.lastInvoiceD = res.data ;
    //         // console.log(res.data)
    //     } catch (error) {
    //         //@ts-ignore
    //         _this.$$errorConsole(error ,ep) ;
    //     }
    // }
    //材料明細id
    const cMaterialDetailId = computed( () => !_.isEmpty(props.value) ? props.value[0].m_material_detail_id : 0 ) ;
    const cBranchid = computed( () => !_.isEmpty(props.value) ? props.value[0].m_branch_id : 0 ) ;
    const cSupplierId = computed( () => !_.isEmpty(props.value) ? props.value[0].supplier_m_customer_id : 0 ) ;

    //新規か編集か
    const cFormStatus = computed(() => {
        if(!state.isShowEditForm) return "" ;
        return _.isNil(state.row.id) ? "新規" : "編集" ;
    })


    //form単価
    const cInputPrice = computed({
        get : () => cBasisMaterialPrice.value ,
        set : (val:number) => state.row.price = val 
    })
    //form金額(自動計算)
    const cInputTotalPrice = computed(() => {
        if(_.isEmpty(state.row)) return 0 ;
        const total = state.row.price * state.row.qty ;
        state.row.total_price = total ;
        return total ;
    })


    function showEditForm(){
        state.isShowEditForm = true ;
        initEditForm() ;
    }

    function initEditForm(){
        state.row = { 
            id : undefined ,
            conducted_at : formatDT(new Date()) ,
            ivt_m_kv_id : TIvtMaterialConst.IVT_M_KV_ID_ADJUST ,
            qty : 0 ,
            price : 0 ,
            total_price : 0 ,
        } 
        state.selectedIdx = -1 ;
    } 

    function selectIvt(row:TIvtMaterial){
        if(!cValidIvt.value ) return ;
        if(!_.isNil(row.t_p_invoice_detail_id)) {
            alert('編集できません')
            return ;
        }
        state.selectedIdx = cValidIvt.value.indexOf(row) ;
        //@ts-ignore
        state.row = _.cloneDeep(row) ; 
        state.isShowEditForm = true ;
    }
    
    async function postData() {
        
        if(!state.isShowEditForm || !cValidIvt.value) return ;
        state.loading = true ;

        const postData = TIvtMaterial.parse(_.cloneDeep(state.row)) ;
        const isNew = _.isNil(postData.id) ;
        
        //拠点変更できるようにする必要あるかも
        postData.m_branch_id = cBranchid.value ;

        postData.m_material_detail_id = cMaterialDetailId.value ;
        postData.supplier_m_customer_id = cSupplierId.value ;

        //調整区分時締データ作成
        if(postData.ivt_m_kv_id === TIvtMaterialConst.IVT_M_KV_ID_ADJUST) {
            if( isNew ) {
                postData.t_ivt_material_complete = TIvtMaterialComplete.parse({
                    m_material_detail_id : cMaterialDetailId.value,  
                    t_ivt_material_id : null ,
                    qty : state.row.qty, 
                    total_price : state.row.total_price , 
                    completed_at : postData.conducted_at ,
                    created_m_user_id : cLoginUserId.value ?? 0 ,
                    updated_m_user_id : cLoginUserId.value ?? 0 ,
                })
            } 
            else {
                if(!_.isEmpty(postData.t_ivt_material_complete)) {
                    postData.t_ivt_material_complete!.qty = state.row.qty ;
                    postData.t_ivt_material_complete!.total_price = state.row.total_price ;
                    postData.t_ivt_material_complete!.completed_at = postData.conducted_at ;
                    postData.t_ivt_material_complete!.updated_m_user_id = cLoginUserId.value ?? 0;
                } 
            }
            
            //調整区分時の数量は残数を入力する仕様 ※ivt_completeのqtyは残数 ivt_materialのqtyは調整数
            //ivt_materialのqtyを算出する
            postData.qty = state.row.qty - ( cTotalQty.value ?? 0 ) ;
            postData.total_price = state.row.price * postData.qty ;

        }
        //調整区分締めから変更時
        else if(!_.isEmpty(postData.t_ivt_material_complete)) {
            postData.t_ivt_material_complete!.deleted_at = formatDT(new Date());
        }

        try {
            const res = await save(postData) ;
            state.isSuccess = true ;

            if(isNew) {
                props.value.splice(getIdx(res.conducted_at),0,res) ;
            }
            else if(state.selectedIdx !== -1){
                const found = props.value.find(e => e.id == res.id) ;
                if(found !== undefined) {
                    const foundIdx = props.value.indexOf(found) ;
                    props.value.splice(foundIdx,1,res)    
                }
                
            }
            closeEditForm()
        }
        catch(error) {
            //@ts-ignore
            _this.$$errorConsole(error ,error.ep) ;
        }
        
    } 

    //日付からindex番号を取得する
    function getIdx(date:string|Date) {
        if(!props.value || _.isEmpty(date) ) return 99999 ;
        
        const resDate = isDate(date) ? date : new Date(date) ;
        
        const found = props.value.find( e => {
            const listDate = isDate(e.conducted_at) ? e.conducted_at : new Date(e.conducted_at) ;
            //@ts-ignore
            return listDate.getTime() > resDate.getTime() ;
        } ) ;

        return found == undefined ? props.value.length + 1 : props.value.indexOf(found) ;
        
    } 

    //Date or stringの判定
    function isDate(date:string|Date){
        const toString = Object.prototype.toString ;
        return toString.call(date) == '[object Date]' ;
    }

    function closeEditForm() {
        state.isShowEditForm = false ;
        initEditForm() ;
    }
    
    function open () {
        $('#ivtEditModal').modal() ;
    }
    function closeModal (){
        initEditForm() ;
        state.isShowEditForm = false ;
        state.isSuccess = false ;
        $('#ivtEditModal').modal("hide") ;
    }
</script>
<style scoped>

/*　スクロールバーの実装 */
.stickyTable {
    display: block;
    overflow-y: auto;
    max-height: calc(100vh * 0.6);
    border-spacing: 0;
}
.stickyTable thead th {
    position: sticky;
    top: 0;
    z-index: 1020;
    background: #343a40!important;
    border-top:#343a40;
    min-width:100%
}
.stickyTable tfoot td {
    position: sticky;
    bottom: 0;
    z-index: 1020;
    background: #343a40!important;

}


.show
{
  padding-right: 0!important;
  padding-left:  16px!important;
}
.modal-footer 
{
    border-top: 1px solid #dee2e6!important;
}
</style>