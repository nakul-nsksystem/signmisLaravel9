<template>
    <div>
        <div class="row mb-2">
            <contents-header-left
                :custom-menu-title="`在庫編集 : ${cMaterialName}`">
            </contents-header-left>
            <contents-header-right>
                <div>
                    <button type="button" class="btn btn-primary" @click.prevent="showEditForm()">
                        <i class="fas fa-plus fa-fw"></i>追加
                    </button>
                </div>
            </contents-header-right>            
        </div>
        <transition name="fade" v-if="state.loading">
            <div class="preview-wrap">
                <div  class="position-absolute vh-100 d-flex justify-content-center align-items-center" style="left:50%;">
                    <span class="spinner-border text-primary" style="opacity:1" />
                </div>
            </div>
        </transition>
        
        <div>                
            <div>
                <div v-show="state.isSuccess" class="alert alert-success" role="alert">
                    保存に成功しました
                </div>
                <div v-if="$$cIsError" class="alert alert-danger" role="alert">
                    {{ dErrorData.message }}
                </div>
            </div>
            
            <div class="app-contents-container">
                <div class="row mt-1">
                    <div class="col-12 col-xl-6">
                        <div class="form-group">
                            <label>日付</label>
                            <ex-v-date-picker
                                v-model="state.date"
                                />
                        </div>
                    </div>
                    <div class="col-12 col-xl-6">
                        <div class="row">
                            <div class="col-12 col-xl-3 form-group">
                                <label>拠点</label>
                                <div>{{ cBranchName }}</div>
                            </div>
                            <div class="col-12 col-xl-9 form-group">
                                <label>仕入先</label>
                                <div>{{ cSupplierName }}</div>
                            </div>
                        </div>
                        
                    </div>
                    
                </div>
                <div class="row" v-if="cIsShow">
                    <div class="col-12 px-0">
                        <div class="table-responsive hf-stickey">
                            <table class="table table-striped table-dark"  >
                                <thead>
                                    <tr>
                                        <th style="width:5%;"></th>
                                        <th style="width:15%; min-width:150px;">日付</th>
                                        <th style="width:10%; min-width:100px;">区分</th>
                                        <th style="width:5%; min-width:50px;" class="text-right">入庫数</th>
                                        <th style="width:5%; min-width:50px;" class="text-right">出庫数</th>
                                        <th style="width:5%; min-width:50px;" class="text-right">残数</th>
                                        <th style="width:5%; min-width:50px;">単位</th>
                                        <th style="width:10%; min-width:100px;" v-show="cIsViewPrice" class="text-right">単価</th>
                                        <th style="width:10%; min-width:100px;" v-show="cIsViewPrice" class="text-right">金額</th>
                                        <th style="width:10%; min-width:100px;">ロットNo.</th>
                                        <th style="width:5%; min-width:50px;">仕入No</th>
                                        <th style="width:5%; min-width:50px;">発注No</th>
                                        <th style="width:5%;"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(n,index) in cValidIvt" :key="n.id" class="text-nowrap"  
                                        :class="{ 'dark-deep-green-selected':state.selectedIdx === index }">
                                        <td>
                                            <button type="button" class="btn btn-success" @click.prevent="selectIvt(n)">
                                                <i class="fas fa-edit fa-fw" />                            
                                            </button>
                                        </td>
                                        <td>{{ n.conducted_at }}</td>
                                        <td>{{ cGetMKvName(n.ivt_m_kv_id) }}</td>
                                        <td class="text-right text-success">{{ cInQty(n) }}</td>
                                        <td class="text-right text-danger">{{ cOutQty(n) }}</td>
                                        <td class="text-right">{{ cQty(n) }}</td>
                                        <td>{{ cDisplayMaterialIvtDiv(n.material_ivt_div_m_kv_id,n.po_unit_m_kv_id) }}</td>
                                        <td v-if="cIsViewPrice" class="text-right">{{ n.price.toLocaleString() }}</td>
                                        <td v-if="cIsViewPrice" class="text-right">{{ cTotalPriceInTable(n) }}</td>
                                        <td>{{n.lot_no}}</td>
                                        <td>
                                            <a :href="`v#/t_p_invoice/edit/${n.t_p_invoice_id}`">{{ n.t_p_invoice_id }} - {{ n.t_p_invoice_detail_id }}</a>
                                        </td>
                                        <td>
                                            <a :href="`v#/t_p_order/edit/${n.t_p_order_id}`">{{ n.t_p_order_id }} - {{ n.t_p_order_detail_id }}</a>
                                        </td>
                                        <td>
                                            <button type="button" class="btn btn-danger" @click.prevent="destroy(n)">
                                                <i class="fas fa-trash fa-fw" />                            
                                            </button>
                                        </td>
                                    </tr>                  
                                </tbody>
                                <tfoot class="font-weight-bold">
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>合計：{{cRowCnt}}件</td>
                                        <td class="text-right text-success">{{ cTotalInQty.toLocaleString() }}</td>
                                        <td class="text-right text-danger">{{ cTotalOutQty.toLocaleString() }}</td>
                                        <td class="text-right">{{ cTotalQty.toLocaleString() }}</td>
                                        <td></td>
                                        <td v-if="cIsViewPrice"></td>
                                        <td v-if="cIsViewPrice" class="text-right">{{ cTotalPrice.toLocaleString() }}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                <div v-if="state.isShowEditForm" class="row">
                    <div class="mt-3 h5 pl-3">{{ cFormStatus }}</div>
                    <div class="col-12 px-0 bg-app-secondaly">
                        <div class="p-3">
                            <validation-observer v-slot="{ invalid }" >
                                <div class="row">
                                    <div class="col-12 col-xl-3 form-group d-flex">
                                        <div class="d-inline">
                                            <validation-provider name="日付" rules="required" immediate v-slot="{ errors }">
                                                <label for="">日付</label>
                                                <ex-v-date-picker
                                                    v-model="state.row.conducted_at"
                                                    />
                                                <span class="validation-error">{{ errors[0] }}</span>
                                            </validation-provider>
                                        </div>
                                        <div class="d-inline ml-4">
                                            <label for="">&nbsp;</label>
                                            <input v-model="state.row.time" type="time" class="app-input-date form-control">
                                        </div>
                                    </div>
                                    <div class="col-12 col-xl-2 form-group">
                                        <validation-provider name="区分" rules="required|excluded:0" immediate v-slot="{ errors }">
                                            <label for="">区分</label>
                                            <m-kv-select
                                                v-model="cIvtKvId"
                                                :kv-key="'t_inventory-division'"
                                                />
                                            <span class="validation-error">{{ errors[0] }}</span>
                                        </validation-provider>
                                    </div>
                                    <div class="col-12 col-xl-2 form-group">
                                        <label for="">ロットNo.</label>
                                        <input v-model="state.row.lot_no" type="text" class="form-control">
                                    </div>
                                    <div class="col-12 col-xl-2 form-group">
                                        <div v-if="cIsEditAdjust">
                                            <label for="">数量</label>
                                            <p class="text-right">{{cCalcedQty.toLocaleString()}}</p>
                                        </div>
                                        <div v-else>
                                            <validation-provider :name=" state.row.qty + '' " rules="required|excluded:0" immediate v-slot="{ errors }">
                                                <label for="">数量</label>
                                                <ns-number-input
                                                    v-model="state.row.qty"
                                                    class="form-control"
                                                    />
                                                <span class="validation-error">{{ errors[0] }}</span>
                                            </validation-provider>
                                            
                                        </div>

                                        <div v-if="cIsEditAdjust" class="mt-3">
                                            <validation-provider :name=" state.row.rest_qty + '' " rules="required" immediate v-slot="{ errors }">
                                                <label for="">残数</label>
                                                <ns-number-input
                                                    v-model="state.row.rest_qty"
                                                    />
                                                <span class="validation-error">{{ errors[0] }}</span>
                                            </validation-provider>
                                        </div>
                                        
                                    </div>
                                    
                                    <div class="col-12 col-xl-2 form-group">
                                        <div v-if="cIsEditAdjust">
                                            <label for="">単価</label>
                                            <p class="text-right">{{state.row.price.toLocaleString()}}</p>
                                        </div>
                                        <div v-else>
                                            <validation-provider :name=" state.row.price + '' " rules="required|excluded:0" immediate v-slot="{ errors }">
                                                <label for="">単価</label>
                                                <ns-number-input
                                                    v-model="state.row.price"
                                                    />
                                                <span class="validation-error">{{ errors[0] }}</span>
                                            </validation-provider>
                                        </div>

                                        <div  v-if="cIsEditAdjust" class="mt-3">
                                            <validation-provider :name=" state.row.total_price + '' " rules="required" immediate v-slot="{ errors }">
                                                <label for="">金額</label>
                                                <ns-number-input
                                                    v-model="state.row.total_price"
                                                    />
                                                <span class="validation-error">{{ errors[0] }}</span>
                                            </validation-provider>
                                        </div>
                                        <div v-else class="mt-3">
                                            <label for="">金額</label>
                                            <p class="text-right">{{ cInputTotalPrice.toLocaleString() }}</p>
                                        </div>
                                        
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
                    
                </div>
            </div>
        </div>

    </div>
    
</template>

<script lang='ts'>
import PageMixins from '../../mixins/commons/PageMixins';

export default {
    mixins : [PageMixins] ,
}
</script>
<script setup lang='ts'>
import _ from "lodash" ;
import axios from 'axios'
import { computed, getCurrentInstance, reactive, ref,watch,nextTick } from 'vue';
import { useStore } from '../../stores/mainStore';
import { useRoute } from '../../routers/routerPlugin';
import { TIvtMaterial } from './class/models/TIvtMaterial'
import { TIvtMaterialComplete } from "./class/models/TIvtMaterialComplete";
import { MKv } from '../masters/class/models/MKv';
import { useMasterStore } from '../../stores/masterStore';
import TIvtMaterialConst from "./consts/TIvtMaterialConst"
import { tIvtMaterialComposition } from './class/compositions/tIvtMaterialComposition'
import DayJsEx from "../../frameworks/DayJsEx";

    const {
        cGetMKvName ,
        cGetMBranchName ,
        cLoginUserId ,
        save ,
        formatDT ,
        formatD ,
        cDisplayMaterialIvtDiv ,
        cIsViewPrice ,
        getByMMaterialDetailId
    } = tIvtMaterialComposition() ;

    const _this = getCurrentInstance()?.proxy ;

    const route = useRoute() ;

    const defDate = new Date(route.params.date) ;


    const state = reactive({
        row : { 
            id:undefined ,
            conducted_at : route.params.date,
            time : "00:00" ,
            ivt_m_kv_id : TIvtMaterialConst.IVT_M_KV_ID_ADJUST ,
            qty : 0 ,
            rest_qty : 0 ,
            price : 0 ,
            total_price : 0 ,
            lot_no : "",
        } ,
        isShowEditForm : false ,
        loading : false ,
        isSuccess : false ,
        selectedIdx : -1 ,
        lastInvoiceD : {} ,
        list4Edit : Array() ,

        date : defDate,
        material_name : "" , 
        m_branch_id : 0 ,
        supplier_name : "" ,
    })

    async function getData(isFirstgGet:boolean ,date?:Date){

        state.loading = true ;
        
        const mMatDsId = Number(route.params.id) ;
        try { 
            const res = await getByMMaterialDetailId(mMatDsId,date) ; 
            state.list4Edit = res ; 
            //初回のみ拠点・取引先等のデータをセットする
            if(isFirstgGet) {
                state.material_name = state.list4Edit[0].ivt_material_name ;
                state.m_branch_id = state.list4Edit[0].m_branch_id ;
                state.supplier_name = state.list4Edit[0].supplier_m_customer_name ;
            }

        }
        catch (error ) {   
            //@ts-ignore
            _this.$$errorConsole(error ,error.ep) ;
        }
        finally {
            state.loading = false ;
        }

    }

    watch(
        () => state.date,
        async (date:Date) => {
            await getData(false,date)
        }
    )

    getData(true,defDate) ;

    /**画面描画用 */
    //表示制御
    const cIsShow = computed( () => !_.isEmpty(state.list4Edit) ) ;
    const cMaterialName = computed( () => state.material_name ) ;
    const cBranchName = computed( () => cGetMBranchName.value(state.m_branch_id) ?? "" ) ;
    const cSupplierName = computed( () => state.supplier_name ) ;

    const cIsEditAdjust = computed(() => state.row.ivt_m_kv_id === TIvtMaterialConst.IVT_M_KV_ID_ADJUST ) ;

    const cRowCnt = computed(() => state.list4Edit.length) ;

    //最終締
    const cLastCompleted = computed(() => {
        if(_.isEmpty(state.list4Edit)) return {} ;
        const found = [...state.list4Edit].reverse().find(e => e.ivt_m_kv_id === TIvtMaterialConst.IVT_M_KV_ID_ADJUST) ;
        return found ?? {} ;
    })

    //締め考慮有効在庫データ
    const cValidIvt = computed(() => {
        if(_.isEmpty(state.list4Edit)) return [] ;
        const filterd = state.list4Edit.filter( (x) => {
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
        return val ;
    }) ;
    
    /**保存用 */
    //単価基準額（材料マスタ準拠）
    const cBasisMaterialPrice = computed(() => {
        if(_.isEmpty(state.list4Edit)) return 0 ;
        return state.list4Edit[0].m_material_unit_price ;
        // //@ts-ignore
        // if(_.isEmpty(state.lastInvoiceD)) return state.list4Edit[0].m_material_unit_price ;
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
    const cMaterialDetailId = computed( () => !_.isEmpty(state.list4Edit) ? state.list4Edit[0].m_material_detail_id : 0 ) ;
    const cBranchid = computed( () => !_.isEmpty(state.list4Edit) ? state.list4Edit[0].m_branch_id : 0 ) ;
    const cSupplierId = computed( () => !_.isEmpty(state.list4Edit) ? state.list4Edit[0].supplier_m_customer_id : 0 ) ;

    //新規か編集か
    const cFormStatus = computed(() => {
        if(!state.isShowEditForm) return "" ;
        return _.isNil(state.row.id) ? "新規" : "編集" ;
    })

    //form金額(自動計算)
    const cInputTotalPrice = computed(() => {
        if(_.isEmpty(state.row)) return 0 ;
        const total = state.row.price * state.row.qty ;
        state.row.total_price = total ;
        return total ;
    })


    const cIvtKvId = computed({
        get : () => state.row.ivt_m_kv_id ,
        set : (val:number) => {
            state.row.ivt_m_kv_id = val ;
            if(cIsEditAdjust.value) {
                state.row.price = 0 ;
            } 
            else if(state.row.price === 0) {
                state.row.price = cBasisMaterialPrice.value ;
            }
        }
    })

    //調整区分時の数量は残数を入力する仕様 ※ivt_completeのqtyは残数 ivt_materialのqtyは調整数
    //ivt_materialのqtyを算出する   
    const cCalcedQty = computed(() => {
        let val = 0
        if(cIsEditAdjust.value) {
            val = state.row.rest_qty - ( cTotalQty.value ?? 0 ) ;
            // state.row.qty = val ;
        }
        return val ;
    })


    function showEditForm(){
        state.isShowEditForm = true ;
        initEditForm() ;
        scrollToEditForm() ;
    }

    function initEditForm(){
        state.row = { 
            id : undefined ,
            conducted_at : formatDT(state.date) ,
            time : DayJsEx.formatTime(new Date()),
            ivt_m_kv_id : TIvtMaterialConst.IVT_M_KV_ID_ADJUST ,
            qty : 0 ,
            rest_qty : 0 ,
            price :  cIsEditAdjust.value ? 0 : cBasisMaterialPrice.value ,
            total_price : 0 ,
            lot_no : "" ,
        } 
        state.selectedIdx = -1 ;
    } 

    async function scrollToEditForm() {
        await nextTick()
        window.scrollTo({
            top : document.body.scrollHeight ,
            behavior:"smooth" 
        })
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
        state.row.time = DayJsEx.formatTime(new Date(row.conducted_at)), 
        state.isShowEditForm = true ;
        scrollToEditForm() ;

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
        postData.conducted_at = formatD( new Date(state.row.conducted_at)) + ' ' + state.row.time ;

        //調整区分時締データ作成
        if(postData.ivt_m_kv_id === TIvtMaterialConst.IVT_M_KV_ID_ADJUST) {
            if( isNew ) {
                postData.t_ivt_material_complete = TIvtMaterialComplete.parse({
                    m_material_detail_id : cMaterialDetailId.value,  
                    t_ivt_material_id : null ,
                    qty : state.row.rest_qty, 
                    total_price : state.row.total_price , 
                    completed_at : postData.conducted_at ,
                    created_m_user_id : cLoginUserId.value ?? 0 ,
                    updated_m_user_id : cLoginUserId.value ?? 0 ,
                })
            } 
            else {
                if(!_.isEmpty(postData.t_ivt_material_complete)) {
                    postData.t_ivt_material_complete!.qty = state.row.rest_qty ;
                    postData.t_ivt_material_complete!.total_price = state.row.total_price ;
                    postData.t_ivt_material_complete!.completed_at = postData.conducted_at ;
                    postData.t_ivt_material_complete!.updated_m_user_id = cLoginUserId.value ?? 0;
                } 
            }
            
            //調整区分時の数量は残数を入力する仕様 ※ivt_completeのqtyは残数 ivt_materialのqtyは調整数
            //ivt_materialのqtyを算出する
            postData.qty = cCalcedQty.value ;
            // postData.total_price = state.row.price * postData.qty ;

        }
        //調整区分締めから変更時
        else if(!_.isEmpty(postData.t_ivt_material_complete)) {
            postData.t_ivt_material_complete!.deleted_at = formatDT(new Date());
        }

        try {
            const res = await save(postData) ;
            state.isSuccess = true ;

            if(isNew) {
                const dateidx = getIdx(res.conducted_at) ;
                if(dateidx !== -1 ) {
                    state.list4Edit.push(res) ;
                }
                else {
                    state.list4Edit.splice(dateidx,0,res) ;
                }
            }
            else if(state.selectedIdx !== -1){
                const found = state.list4Edit.find(e => e.id == res.id) ;
                if(found !== undefined) {
                    const foundIdx = state.list4Edit.indexOf(found) ;
                    state.list4Edit.splice(foundIdx,1,res)    
                }
                
            }
            closeEditForm() ;
        }
        catch(error) {
            //@ts-ignore
            _this.$$errorConsole(error ,error.ep) ;
        }
        finally {
            state.loading = false ;

        }
        
    } 

    //日付からindex番号を取得する
    function getIdx(date:string|Date) {
        if(!state.list4Edit || _.isEmpty(date) ) return -1 ;
        
        const resDate = isDate(date) ? date : new Date(date) ;
        
        const found = state.list4Edit.find( e => {
            const listDate = isDate(e.conducted_at) ? e.conducted_at : new Date(e.conducted_at) ;
            //@ts-ignore
            return listDate.getTime() > resDate.getTime() ;
        } ) ;

        return found == undefined ? state.list4Edit.length + 1 : state.list4Edit.indexOf(found) ;
        
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


    async function destroy(row:TIvtMaterial) {
        
        state.loading = true ;
        
        let isAdjust = row.ivt_m_kv_id === TIvtMaterialConst.IVT_M_KV_ID_ADJUST ;
        let ep = `api/tIvtMaterial/${row.id}`
        try { 
            const res = await axios.delete(ep) ; 
            if(isAdjust) { 
                await getData(false,state.date) ;
            }
            else {
                const idx = state.list4Edit.indexOf(row) ;
                if(idx !== -1 ) state.list4Edit.splice(idx,1) ;
            }

        }
        catch (error ) {   
            //@ts-ignore
            _this.$$errorConsole(error ,error.ep) ;
        }
        finally {
            state.loading = false ;
        }
    }

</script>
<style scoped>

/*　スクロールバーの実装 */
.hf-stickey {
    overflow-y: auto;
    max-height: calc(100vh * 0.6);
}
.hf-stickey thead th {
    position: sticky;
    position: -webkit-sticky; /* Safari */
    top: 0;
    z-index: 1;
    background: #343a40!important;
    border-top:#343a40;
}
.hf-stickey tfoot td {
    position: sticky;
    position: -webkit-sticky; /* Safari */
    bottom: 0;
    z-index: 1;
    background: #343a40!important;
    /* width:100% */

}

.preview{
    width: auto;
    height:auto;
    display: block;
    position:fixed;
    /* top:25%; */
    left:50%;
    transform:translate(-50%);
}
.preview-wrap{
    background-color:rgba(0,0,0,.5);
    width: 100%;
    height: 100%;
    position:fixed;
    top:0;
    left:0;
    z-index: 1050;
}


.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>