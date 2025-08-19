<template>
    <!-- Modalフォーム -->
    <div class="modal fade" :id="dModalId" tabindex="-1" role="dialog" data-backdrop="static" style="margin-top: 0px;">
        <div class="modal-dialog modal-dialog-fluid" role="document">
            <div class="app-modal-content-dark">                
                <div class="modal-header">
                    <div class="row">
                        <div class="col-12">
                            <h4>取引先付加情報</h4> 
                        </div>
                        
                    </div>
                    
                </div>


                <div class="modal-body pt-0">
                    <div class="row">

                        <div class="col-12 col-xl-4 pt-4 ml-auto">
                            <div class="float-right mt-1">
                                <button type="button" class="btn btn-light ml-2" @click.prevent="cancel()">閉じる</button>
                            </div>
                            
                        </div>
                        

                    </div>

                    <div class="row">
                        <div class="col-12">              
                            <m-customer-info-table 
                                v-model="cInfos"
                                :is-editable="false"
                                :customer-sales-m-user-id="cSalesMUserId"
                            />              
                        </div>
                    </div>


                </div>

            </div>
        </div>
    </div>
</template>

<script >
import { MCustomer } from '../class/models/MCustomer';

export default {
    data : function () {
        return {
            dModalId : "MCustomerInfoViewModal" , 

            dIsMounted : false  , 


        }
    } ,    
    props : { 

        // 親からのパラメーター
        isOpen : {
            // 起動フラグ(true:になった場合isOpenイベントを起動)
            type : Boolean ,
            default : () => false ,
        } ,
        mCustomer : { 
            type : Object , 
            require : true , 
            default : () => {}
        }




    },

    computed : {
        cInfos : function() {
            if ( _.isNil(this.mCustomer )) return [] ; 

            return this.mCustomer.m_customer_infos ?? [] ; 

        } ,
        cSalesMUserId : function(){ 
            return this.mCustomer?.sales_m_user_id ?? 0 ; 
        }
    } ,
    methods : {
        init : function () {
            // 初期化
            $(`#${this.dModalId}`).modal("show") ; 


        } ,
        cancel : function() { 

            this.close() ; 

            this.$emit('cancel') ;


        } , 
        close : function() { 
            $(`#${this.dModalId}`).modal("hide") ; 
        } , 

    } ,
    watch : {
        isOpen : function (newVal) {
            if (newVal) {
                // openフラグをResetして起動時のみ処理する
                this.$emit("update:is-open", false) ;

                // 検索結果・選択状態を初期化
                this.init() ;

            }
        } ,
    },
    created : function () {
    } ,
    mounted : function() { 
        this.dIsMounted = true ; 
    }
}
</script>
