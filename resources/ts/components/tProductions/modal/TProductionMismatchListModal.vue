<template>
    <!-- Modalフォーム -->
    <div class="modal fade" id="missmatchListModal" tabindex="-1" role="dialog" data-backdrop="static" style="margin-top: 0px;">        
        <div class="modal-dialog modal-dialog-fluid" role="document">
            <div class="app-modal-content-dark">

                <validation-observer v-slot="{ invalid }">
                    <div class="modal-header">
                        <h4>不整合内容一覧 - {{cGroup.title}} {{cGroup.summaryCaption}}</h4>                        
                    </div>


                    <div class="modal-body pt-3">
                        <div class="row">

                            <div class="col-12 pt-4 ml-auto">
                                <div class="float-right mt-1">
                                    <button type="button" class="btn btn-primary"  @click.prevent="ok()" :disabled="invalid">変更を反映</button>
                                    <button type="button" class="btn btn-light ml-2" @click.prevent="cancel()">キャンセル</button>
                                </div>                                
                            </div>
                        </div>

                        <div class="row pt-3">
                            <div class="col-12" v-for="n in  cList" :key="n.t_project_product.id">
                                <div class="d-flex flex-wrap"            
                                    >
                                    <h5 class="mb-0 flex-fill">                                        
                                        {{n.t_project_product.t_project.cd}} - [ {{n.t_project_product.t_project.m_customer.name}} {{n.t_project_product.t_project.customer_user_name}} ] {{n.t_project_product.t_project.name}}                                                 
                                
                                    </h5>
                                    
                                    <h5 class="pr-2 mb-0" >
                                        <span class="badge" 
                                            :class="getMBranchColor(n.t_project_product.t_project.m_branch_id)">
                                            {{getMBranchName(n.t_project_product.t_project.m_branch_id)}}
                                        </span>                            
                                    </h5>
                                </div>

                                <h6 class="text-white-75">受注日:{{$$formatDay(n.t_project_product.t_project.ordered_at)}} 営業担当:{{getSaleMUserName(n.t_project_product.t_project.sales_m_user_id)}}</h6>


                                <t-production-mismatch-list-modal-products
                                    v-model="n.t_project_product"
                                    :mismatches="n.mismatches"
                                 />
                            </div>
                        </div>

                    </div>
                </validation-observer>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
// @ts-nocheck

import ObjectUtil from '../../../frameworks/ObjectUtil';

import { TProductionDayGroup } from '../class/models/TProductionDayGroup';

export default {
    props : {
        // 親からのパラメーター
        isOpen : {
            // 起動フラグ(true:になった場合isOpenイベントを起動)
            type : Boolean ,
            default : () => false ,
        } ,

        group : {
            type : TProductionDayGroup,             
        }  , 




    },
    data : function () {
        return {
            dModalName : "missmatchListModal" , 

            dTempConditions : [] , 

        }
    } ,
    computed : {
        cGroup : function() { 
            return this.group ?? {} ; 
        } , 

        /**
         * 変更のリスト
         */
        cList : function () { 
            if ( _.isNil(this.group)) return [] ; 
            return this.group.mismatchesIncChildren_ByTProjectProduct ; 
        } , 
        
        



    } ,
    methods : {
        init : async function () {
            // 検索結果・選択状態を初期化
            $(`#${this.dModalName}`).modal("show") ; 
            // console.log("init");
            await this.$nextTick() ; 
            // this.$refs.mProductionGroupCondition.conditionChanged() ; 

        } ,
        ok : function () {
            // 呼び出し元のイベントを駆動して画面を非表示
            
            
            //console.log(this.cList) ; 
            // const payload = this.$refs.mProductionGroupCondition.getConditions() ; 
            const payload = { }
            this.$emit('ok' , payload ) ;

            this.close() ; 
            
        } ,
        cancel : function() { 

            this.close() ; 

            this.$emit('cancel') ;


        } , 
        close : function() { 
            
            // tmp系の削除
            $(`#${this.dModalName}`).modal("hide") ; 
        } , 

        
        /**
         * 選択中の拠点名
         */
        getMBranchName : function(mBranchId) {
            const found = this.masterStore.getMBranchById(mBranchId) ; 
            return found === undefined ? "" : found.shortNameOrName ; 
        } , 
        
        /**
         * 拠点色
         */
        getMBranchColor : function (n)  {
            const finded = this.masterStore.getMBranchColorById(n ) ;                         
            return ObjectUtil.isNUE( finded ) ? "" : "badge-" + finded ; 
        } , 

        
         
        /**
         * 選択中の営業担当名
         */
        getSaleMUserName : function(userId) { 
            const found = this.masterStore.getMUserById(userId ) ; 
            return found === undefined ? "" : found.full_name ; 
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
}
</script>
