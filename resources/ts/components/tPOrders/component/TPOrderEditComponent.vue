<template>
    <div>
        <validation-observer v-slot="{ invalid }" >

            <div class="row mt-2 pl-1" v-if="value.length>0">
                <div class="table-responsive">

                    <table class="table table-striped table-dark text-nowrap">
                        <thead>
                            <tr>
                                <th scope="col" v-if="!isQR">No.</th>
                                <th scope="col">名称</th>
                                <th scope="col">発注先</th>
                                <th scope="col" v-if="!isQR">物件名</th>
                                <th scope="col"><span>数量</span><span v-if="!isQR">/単価</span></th>
                                <th scope="col">寸法,容量</th>
                                <th scope="col">金額</th>
                                <th scope="col"><span>納期</span><span v-if="!isQR">/場所</span></th>
                                <th scope="col" v-if="!isQR">備考</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(n,index) in cTPOrders" :key="n.id">
                                <td scope="row" v-if="!isQR">
                                    <div>{{index+1}}</div>
                                </td>
                                <td>
                                    <p v-if="n.t_p_order_details.m_material_detail_id">{{n.t_p_order_details.material_name}}</p>
                                    <p v-else><input v-model="n.t_p_order_details.material_name" type="text" class="form-control"></p>
                                </td>
                                <td>{{n.supplier.short_name_or_name}}</td>                                    
                                <td v-if="!isQR">
                                    <p v-if="!m$cIsEmpty(n.t_p_order_details.t_project_id)">{{n.t_p_order_details.t_project_id}}</p>
                                </td>
                                <td>
                                    <div class="form-group">                                        
                                        <validation-provider :name=" n.t_p_order_details.qty + '' " rules="required|excluded:0" immediate v-slot="{ errors }">
                                            <div class="row">
                                                <ns-number-input
                                                    class="app-input-size"
                                                    v-model="n.t_p_order_details.qty" />
                                                <label v-if="!m$cIsEmpty(n.t_p_order_details.unit_m_kv)" class="pt-2 ml-1">{{n.t_p_order_details.unit_m_kv.kv_name}}</label>
                                            </div>
                                            
                                            <span class="validation-error">{{ errors[0] }}</span>
                                        </validation-provider>
                                    </div>
                                    
                                    <div class="form-group" v-if="!isQR && n.t_p_order_details.is_able_to_input_price">
                                        <div class="row">
                                            <ns-number-input 
                                                class="app-input-size"
                                                v-model="n.t_p_order_details.price"/>
                                            <p class="pt-2 ml-1">円</p>
                                            
                                        </div>                                    
                                    </div>
                                </td>
                                <td>
                                    <div class="d-flex" v-if="n.t_p_order_details.is_able_to_input_size">
                                        <div class="mb-2">
                                            <ns-number-input 
                                                class="app-input-size"
                                                v-model="n.t_p_order_details.material_size_x"/>
                                        </div>
                                        <p class="mx-1 pt-1">x</p>
                                        <div class="mb-2">
                                            <ns-number-input 
                                                class="app-input-size"
                                                v-model="n.t_p_order_details.material_size_y"/>
                                        </div>
                                    </div>
                                    <p v-else-if="n.t_p_order_details.size">{{n.t_p_order_details.size}}</p>
                                    <p v-else></p>
                                </td>
                                <td class="text-right">
                                    <p v-if="n.t_p_order_details.is_able_to_input_price">
                                        {{m$cPriceTotal(n.t_p_order_details)}}
                                    </p>
                                </td>
                                <td>
                                    <div class="mb-2">
                                        <validation-provider name="納期" rules="required" immediate v-slot="{ errors }">
                                            <ex-v-date-picker
                                                v-model="n.t_p_order_details.due_date"/>
                                            <span class="validation-error">{{ errors[0] }}</span>
                                        </validation-provider>
                                    </div>
                                    <div>
                                        <input v-if="!isQR" v-model="n.t_p_order_details.shipping_address" type="text" class="form-control" placeholder="納品場所">
                                    </div>
                                </td>
                                <td v-if="!isQR">
                                    <div class="form-group">
                                        <textarea v-model="n.t_p_order_details.slip_memo" class="form-control" aria-label="With textarea"></textarea>                            
                                        <span class="validation-info" v-show="!m$cIsOkStrLen(n.t_p_order_details.slip_memo,30)">文字数がオーバーしています</span>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <button type="button" class="btn btn-danger" @click.prevent="destroy(index)">
                                            <i class="fas fa-trash fa-fw"></i>
                                        </button>
                                    </div>
                                    <div class="mt-2" v-if="!n.t_p_order_details.m_material_detail_id">
                                        <button type="button" class="btn btn-info" 
                                            @click.prevent.stop="copyOrderD(n)"
                                            :disabled="dLoading">
                                            <i class="fas fa-copy fa-fw"></i>
                                        </button>
                                    </div>
                                </td>                                              
                            </tr>
                        </tbody>
                    </table>

                </div>
                <div class="col text-right" v-if="isQR">                
                    <button type="button" class="btn btn-success" :disabled="invalid||dLoading" @click.prevent="postDataByQR">
                        <div v-if="dLoading">
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            発注処理中...
                        </div>
                        <div v-else>発注</div>
                    </button>
                </div>
                <div class="col text-right" v-else>
                    <button type="button" class="btn btn-success" :disabled="invalid" @click.prevent="postData">確認</button>
                </div>
            </div>
        </validation-observer>
        <div id="modalOrder"
             class="modal fade"
             tabindex="-1"
             role="dialog"
             aria-labelledby="modalOrder"
             aria-hidden="true"
             style="margin-top: 0px;"
             v-show="dOrderListModal">
            <div class="modal-dialog modal-dialog-fluid">
                <div class="modal-content">
                    <div class="app-contents-container text-right">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true" class="text-white">&times;</span>
                        </button>
                    </div>
                    <t-p-order-list
                        :purchase-order="dOrderList"
                        :is-show="dOrderListModal"
                        @finishedOrder="finishedOrder"
                        />
                </div>

            </div>
        </div>    
    </div>


</template>

<script>
import PageMixins from '../../../mixins/commons/PageMixins';
import TPOrderMixins from '../mixins/TPOrderMixins'
import _ from "lodash" ; 

export default {
    mixins : [PageMixins,TPOrderMixins] , 
    data : function(){
        return{

            dLoading : false ,

            dOrderList : [] ,
            dOrderListModal : false ,

        }
    },

    props : {
        value :{
            type : Array ,
        },
        isQR : {
            type : Boolean ,
            default : false ,
        } ,
    } ,
    computed:{
        cTPOrders : function(){
            return this.value ;
        } ,
        cLoginMUser : function(){
            return this.mainStore.loginMUser ;
        },
        cMSupplierIds : function() {
            //dNewObj内の発注先idを抽出
            const ids = _.uniq(this.cTPOrders.map(x => x.supplier_m_customer_id)) ;
            return ids ;
        } ,
        cOrderList : function(){
            //発注先ごとに仕分け
            const tPurchaseList = [] ;

            for(const supId of this.cMSupplierIds) {
                const tPurchaseRow = {
                    supplier_m_customer_id : supId ,
                    slip_memo : "",
                    created_m_user_id : this.$$cLoginUserId,
                    created_m_user : this.cLoginMUser,
                    updated_m_user_id : this.$$cLoginUserId,
                    updated_m_user : this.cLoginMUser,
                    t_p_order_details : [],
                } ;

                tPurchaseList.push(tPurchaseRow) ;

            }

            for(const x of this.cTPOrders) {
                
                const findedPurchase = tPurchaseList.find(
                    tPurchase => tPurchase.supplier_m_customer_id == x.supplier_m_customer_id
                ) ;

                if ( findedPurchase === undefined) continue ;

                findedPurchase.supplier_m_customer = x.supplier ;
                findedPurchase.m_user = x.user ;
                findedPurchase.m_user_id = x.m_user_id ;
                findedPurchase.m_branch = x.m_branch ;
                findedPurchase.m_branch_id = x.m_branch_id ;
                findedPurchase.order_date = x.order_date ;
                findedPurchase.t_p_order_details.push(x.t_p_order_details) ;
            }

            return tPurchaseList
        },
    },

    methods:{
        
        destroy: function(index){
            this.cTPOrders.splice(index,1) ;
        },

        formatMaterialName : function(tPOrders) {
            //材料名と寸法連結して発注用名称にする
            for(const po of tPOrders) {
                for(const poD of po.t_p_order_details ) {
                    
                    //寸法入力可能な時
                    if(poD.is_able_to_input_size) {
                    
                        poD.po_material_name = poD.material_name +'['+ poD.material_size_x + '×' + poD.material_size_y + 'mm]'

                    } else if (poD.size) {
                        poD.po_material_name = poD.material_name + poD.size

                    } else {
                        poD.po_material_name = poD.material_name

                    }
                }
            }

            return tPOrders ;

        } ,

        //フリー入力の発注明細をコピーする
        copyOrderD : function(row) {
            if(!_.isNil(row.t_p_order_details.m_material_detail_id)) {
                alert('マスタデータはコピーできません。数量を増やしてください。') ;
                return ;
            }
            const copied = _.cloneDeep(row)
            this.value.push(copied) ;
            
        } ,
        
        postData : function () {

            this.dOrderList = this.formatMaterialName( _.cloneDeep(this.cOrderList)) ;

            for(const po of this.dOrderList) {
                //発注書単価表示のデフォルトセット
                for(const details of po.t_p_order_details) {

                    //フリー入力から追加した材料の場合は単価表示する
                    if( _.isNil(details.m_material_detail_id) ) {
                        details.is_display_price = 1 ;
                    }
                    else {
                        details.is_display_price = 0 ;
                    }
                }
            }
            $('#modalOrder').modal() ;
            this.dOrderListModal = true ;

        } ,
        
        //QRの時ダイレクトで発注処理を行う
        postDataByQR : async function() {
            try{

                if(!confirm("発注処理を進めてもよろしいですか？")) return ;
                
                let ep = 'api/tPOrder'
                //ロードエフェクト
                this.dLoading = true ;

                const purchaseOrder = this.formatMaterialName( _.cloneDeep(this.cOrderList)) ;

                //画面ロック
                this.m$screenLock() ;
                //発注単位備考と日付の形式変更
                for(const tPOrder of purchaseOrder) {
                    //保存処理前にデータの整合性チェック
                    this.m$checkData(tPOrder) ;
                    for(const detail of tPOrder.t_p_order_details){

                        if(detail.due_date) detail.due_date = DayJsEx.format(detail.due_date , "YYYY-MM-DD") ;
                    }
                }

                const res = await axios.post(ep ,purchaseOrder ) ;

                this.$emit("ordered" ,res.data)

            } catch (error)  {
                
                this.$$errorConsole(error ,ep) ;                

            } finally {

                this.m$screenUnLock() ;   
                this.dLoading = false ;

            }

        } ,

        finishedOrder : function() {

            $('#modalOrder').modal("hide") ;
            this.$emit("finishedOrder")

        }


    },


}
</script>