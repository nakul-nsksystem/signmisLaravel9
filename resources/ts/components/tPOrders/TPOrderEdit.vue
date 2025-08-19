<template>
    <div>
        <div class="row mb-2">
            <contents-header-left></contents-header-left>
            <contents-header-right>
                <div v-if="cIsNskUser">
                    <button type="button" class="btn btn-primary" @click.prevent="viewPdf">
                        <i class="fas fa-file fa-fw"></i>
                        発注書
                    </button>
                </div>
            </contents-header-right>            
        </div>
        <div v-if="$$cIsError" class="alert alert-danger" role="alert">
            {{dErrorData.message}}
        </div>
        <div class="app-contents-container" v-show="cIsShow">
           <form id="form">
                <validation-observer v-slot="{ invalid }" >
                
                    <div class="row">
                        <div class="col-12 col-xl-2 pl-3">
                            <div class="form-group">
                                <validation-provider name="発注拠点" rules="required|excluded:0" immediate v-slot="{ errors }">                                        
                                    <label>発注拠点</label>
                                    <m-branch-select
                                        v-model="dRow.m_branch_id"/>
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </validation-provider>
                            </div>
                        </div>
                        <div class="col-12 col-xl-2 pl-xl-0">
                            <div class="form-group">
                                <validation-provider name="発注先" rules="required|excluded:0" immediate v-slot="{ errors }">                                        
                                    <label>発注先</label>
                                    <input type="text" v-model="dRow.supplier_m_customer.short_name_or_name" class="form-control" readonly>
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </validation-provider>
                            </div>  
                        </div>
                        <div class="col-12 col-xl-2 pl-xl-0">
                            <div class="form-group">
                                <validation-provider name="発注日" rules="required" immediate v-slot="{ errors }">                                        
                                    <label>発注日</label>
                                    <ex-v-date-picker
                                        v-model="dRow.order_date" />
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </validation-provider>
                            </div>
                        </div>
                        <div class="col-12 col-xl-2 pl-xl-0">
                            <div class="form-group">
                                <validation-provider name="発注担当" rules="required|excluded:0" immediate v-slot="{ errors }">                                        
                                    <label>発注担当</label>
                                    <m-user-select
                                        :m-branch-id="dRow.m_branch_id"
                                        v-model="dRow.m_user_id"
                                        />
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </validation-provider>
                            </div>
                        </div>

                    </div>

                    <div class="row mt-2">
                        <div class="col-12">
                            <div class="table-responsive">

                                <table class="table table-striped table-dark text-nowrap">
                                    <thead>
                                        <tr>
                                        <th scope="col" style="min-width:360px">名称</th>
                                        <th scope="col">物件名</th>
                                        <th scope="col" style="min-width:180px">数量/単価</th>
                                        <th scope="col">金額表示</th>
                                        <th scope="col">寸法,容量</th>
                                        <th scope="col">金額</th>
                                        <th scope="col">納品指定</th>
                                        <th scope="col" style="min-width:240px">備考</th>
                                        <th scope="col">delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="n in dRow.t_p_order_details" :key="n.id">
                                        <td>
                                            <p v-if="!m$cIsEmpty(n.m_material_detail_id)">{{cMaterilalName(n)}}</p>                                        
                                            <p v-else><input v-model="n.material_name" type="text" class="form-control" :disabled="cTPInvoice(n)"></p>
                                        </td>
                                        <td><p v-if="!m$cIsEmpty(n.t_project_id)">{{n.t_project.name}}</p></td>
                                        <td style="width:200px">
                                            <div class="d-flex">
                                                <div class="form-group">
                                                    <validation-provider :name=" n.qty + '' " rules="required|excluded:0" immediate v-slot="{ errors }">                                        
                                                        <ns-number-input
                                                            v-model="n.qty"
                                                            :disabled="cTPInvoice(n)" />
                                                        <span class="validation-error">{{ errors[0] }}</span>
                                                    </validation-provider>
                                                </div>
                                                <p class="pt-2 pl-1" v-if="!m$cIsEmpty(n.unit_m_kv_id)">{{n.unit_m_kv.kv_name}}</p>
                                            </div>
                                            <div class="d-flex" v-if="cIsViewPrice(n)">
                                                <div class="form-group">
                                                    <ns-number-input 
                                                        class=""
                                                        v-model="n.price"
                                                        :disabled="cTPInvoice(n)"/>
                                                </div>
                                                <p class="pt-2 pl-1">円</p>
                                            </div>
                                        </td>
                                        <td>
                                            <ns-checkbox-input :id="`isDispPriceCheck${n.id}`"  v-model="n.is_display_price"/>
                                        </td>
                                        <td>
                                            <p v-if="n.m_material_detail_id == null"></p>
                                            <div class="d-flex" v-else-if="n.m_material_detail.is_able_to_input_size">
                                                <div class="mb-2">
                                                    <ns-number-input 
                                                        class="app-input-size"
                                                        v-model="n.material_size_x"
                                                        :disabled="cTPInvoice(n)"/>
                                                </div>
                                                <p class="mx-2 pt-1">x</p>
                                                <div class="mb-2">
                                                    <ns-number-input 
                                                        class="app-input-size"
                                                        v-model="n.material_size_y"
                                                        :disabled="cTPInvoice(n)"/>
                                                </div>
                                            </div>
                                            <p v-else>{{n.m_material_detail.detail_name}}</p>
                                        </td>
                                        <td class="text-right"><span v-if="cIsViewPrice(n)">{{m$cPriceTotal(n)}}</span></td>
                                        <td>
                                            <ex-v-date-picker
                                                v-model="n.due_date"
                                                :inputDisabled="cTPInvoice(n)"
                                                />
                                            <br>
                                            <input v-model="n.shipping_address" type="text" class="form-control" placeholder="納品場所" :disabled="cTPInvoice(n)">
                                        </td>
                                        <td>
                                            <div class="form-group">
                                                <textarea v-model="n.slip_memo" class="form-control" aria-label="With textarea" :disabled="cTPInvoice(n)"></textarea>
                                                <span class="validation-info" v-show="!m$cIsOkStrLen(n.slip_memo,30)">文字数がオーバーしています</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div v-if="!cTPInvoice(n)">
                                                <button type="button" class="btn btn-danger" @click.prevent="destroy(n.id)">
                                                    <i class="fas fa-trash fa-fw"></i>
                                                </button>
                                            </div>
                                            <p v-else class="text-danger">仕入登録済</p>
                                        </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-12 px-0 mt-2">
                                <label>発注備考</label>
                                <textarea class="form-control" v-model="dRow.slip_memo"></textarea> 
                            </div>

                            <div class="col text-right pt-2">
                                <button type="button" class="btn btn-success" :disabled="invalid || dLoading || cOnlyInvoiced || dIsSupplierDeleted" @click.prevent="postData"> 
                                    <div v-if="dLoading">
                                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        発注処理中...
                                    </div>
                                    <div v-else>更新</div>                                    
                                </button>
                                <button type="button" class="btn btn-secondary" :disabled="dLoading" @click.prevent="cancel()">キャンセル</button>
                            </div>
                        </div>
                    </div>
                </validation-observer>

            </form>
        </div>


    </div>
</template>

<script>
import ObjectUtil from './../../frameworks/ObjectUtil';
import PageMixins from '../../mixins/commons/PageMixins';
import DayJsEx from "./../../frameworks/DayJsEx" ;
import TPOrderMixins from "./mixins/TPOrderMixins"
import _ from "lodash" ;

export default {
    mixins : [PageMixins,TPOrderMixins] , 
    data : function(){
        return {
            dApiName : "tPOrder" ,
            dRow : {
                    supplier_m_customer : {} ,
                    t_p_order_details :[] ,
            } ,
            dLoading : false ,

            dIsSupplierDeleted : false 
        }
    },
    computed:{
        cIsNew : function () 
        {            
            return this.$route.params.id === undefined ; 
        } ,        
        cIsShow : function () 
        {
            return this.cIsNew || this.dRow.id > 0 ; 
        } , 
        cEndpoint : function () 
        {
            let ep =  `api/${this.dApiName}` ;
            
            if ( !this.cIsNew ) ep += `/${this.$route.params.id}` ; 
            return  ep ;
        } ,
        cLoginMUser : function(){
            return this.mainStore.loginMUser ;
        },
        cMaterilalName : function(){
            return function(n){
                
                if(n.m_material_detail?.is_able_to_input_size) {
                    const materialName = n.m_material_detail.m_material.name ;
                    return n.material_name = materialName +'['+ n.material_size_x + '×' + n.material_size_y + 'mm]' ;
                } 
                return n.po_material_name ;
            }
        },
        cTPInvoice : function(){
            return function(n){
                if(!ObjectUtil.isNUE(n.t_p_invoice_details)) return true
            }
        } ,

        //全ての発注が仕入済かどうか
        cOnlyInvoiced : function(){
            if(!this.dRow) return false ;
            
            const tPInvoiceDs = [] ;
            for(const ds of this.dRow.t_p_order_details) {
                tPInvoiceDs.push(...ds.t_p_invoice_details)
            }

            if(this.dRow.t_p_order_details.length === tPInvoiceDs.length) return true ;

        },
        
        //価格制御
        cIsViewPrice : function() {
            return function (tPODs) {
                //金額表示権限有り
                if(this.m$cIsViewPrice) return true ;
                //マスタにない材料
                if(_.isNil(tPODs.m_material_detail_id)) return true ;
                //サイズ手入力可能
                if(tPODs.m_material_detail.is_able_to_input_size) return true ;

                return false ;
            }
        } ,

        cIsNskUser : function() {
            return this.mainStore.isNskUser ;
        }
    },
    methods:{
        getData: async function(){
            try {
                    
                const res = await axios.get(this.cEndpoint) ;                
                
                //削除した取引先の場合
                if(_.isNil(res.data.supplier_m_customer)) {
                    res.data.supplier_m_customer = {
                        short_name_or_name : null  
                    }
                    this.dIsSupplierDeleted = true ;
                }
                this.dRow = res.data ;
            
            } catch (error) {
                this.$$errorConsole(error ,this.cEndpoint ) ; 
            }
        } ,
        destroy: async function(id){
        
            if(! confirm('削除してよろしいですか?')) return ;

            let detailEndPoint =  `api/tPOrderDetail/${id}` ;
            
            try {              
                
                const res = await axios.delete(detailEndPoint) ;
                
                const deleted  = this.dRow.t_p_order_details.find(e => e.id === id ) ;
                const delIndex = this.dRow.t_p_order_details.indexOf(deleted) ;
                if ( delIndex != -1 )  this.dRow.t_p_order_details.splice(delIndex , 1) ;

            } catch (error) {
                this.$$errorConsole(error ,this.cEndpoint ) ; 
            }

            //明細0件の発注を削除する
            if(this.dRow.t_p_order_details.length == 0){
                try {
                    const parentRes = await axios.delete(this.cEndpoint) ;
                    this.$router.push({name:'t_p_order_index'});

                } catch(error) {
                    this.$$errorConsole(error ,this.cEndpoint ) ; 

                }
            }

        },
        postData : async function () {

            //発注書レイアウトdebug用
            // const ep =  `api/tPOrder/createPO/${this.dRow.id}/view` ;
            // window.open(ep, '_blank') ;
            // return ;

            if(! confirm('発注を更新してよろしいですか?')) return ;
             
            try{
                //ローディング表示
                this.dLoading = true ;

                const clone = _.cloneDeep(this.dRow) ;

                //日付の形式変更
                clone.order_date = DayJsEx.format(clone.order_date , "YYYY-MM-DD") ; 
                clone.updated_m_user = this.cLoginMUser ;
                clone.updated_m_user_id = this.$$cLoginUserId ;
                
                //保存処理前にデータの整合性チェック
                this.m$checkData(clone) ;

                for(const det of clone.t_p_order_details) {
                    //名称手入力の時
                    if(_.isNil(det.m_material_detail_id)) {
                        det.po_material_name = det.material_name ;
                    } 
                    else  {
                        det.po_material_name = this.cMaterilalName(det) ;

                    }

                }


                if(!confirm('メール発注機能を使用しますか？')) clone.is_unuse_mail = true ;
                
                // for(const x of clone.t_p_order_details) {
                //     if(!x.due_date){
                                                
                //         x.due_date = DayJsEx.format(x.due_date , "YYYY-MM-DD")
                //     } 
                //     //工程のレコードを更新しない
                //     // delete x.t_project_product_processes ;
                //     // delete x.t_project ;                    
                // }
                this.m$screenLock() ;

                const res = await axios.put(this.cEndpoint ,clone ) ;

                this.m$screenUnLock() ;

                this.m$showWarnings(res.data) ;

                this.$router.push({name:'t_p_order_index'});

            } catch (error)  {
                
                this.$$errorConsole(error ,this.cEndpoint ) ; 
                this.m$screenUnLock() ;  

            } finally {
                this.dLoading = false ; 

            }
            
        } ,
        cancel : function(){
            if(! confirm('編集内容は破棄されます。キャンセルしてよろしいですか?')) return ;

            this.getData() ;
        },   
        viewPdf : async function(){
            if(this.$$cIsDebug) {
                const ep =  `api/tPOrder/createPO/${this.dRow.id}/view` ;
                window.open(ep, '_blank') 
            } 
            else {
                const ep =  `api/tPOrder/createPO/${this.dRow.id}` ;
                window.open(ep, '_blank')     
            }

        }
    },
    created : function (){
        if ( ! this.cIsNew) this.getData()  ; 
    }

}
</script>