<template>
    <!-- Modalフォーム -->
    <div class="modal fade" id="groupConditionModal" tabindex="-1" role="dialog" data-backdrop="static" style="margin-top: 0px;">        
        <div class="modal-dialog " role="document">
            <div class="app-modal-content-dark">
                <validation-observer v-slot="{ invalid }">
                    <div class="modal-header">
                        <h4>グループ条件</h4>                        
                    </div>


                    <div class="modal-body">
                        <div class="row">
                            <div class="col-12">
                                <m-production-group-conditions 
                                    ref="mProductionGroupCondition"
                                    v-model="day"
                                    />
                            </div>

                            <div class="col-12 pt-4 ml-auto">
                                <div class="float-right mt-1">
                                    <button type="button" class="btn btn-primary"  @click.prevent="ok()" :disabled="invalid">OK</button>
                                    <button type="button" class="btn btn-light ml-2" @click.prevent="cancel()">キャンセル</button>
                                </div>                                
                            </div>
                        </div>

                    </div>
<!-- 
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary"  @click.prevent="hide()" :disabled="invalid">変更</button>
                        <button type="button" class="btn btn-light ml-2" @click.prevent="cancel()">キャンセル</button>                
                    </div> -->
                </validation-observer>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
// @ts-nocheck


import ArrayUtil from '../../../frameworks/ArrayUtil';
import ITProductionUtil from '../class/ITProductionUtil';
import { TProductionDay } from '../class/models/TProductionDay';
import { TProductionDayGroup } from '../class/models/TProductionDayGroup';

export default {
    props : {
        // 親からのパラメーター
        isOpen : {
            // 起動フラグ(true:になった場合isOpenイベントを起動)
            type : Boolean ,
            default : () => false ,
        } ,

        day : {
            type : TProductionDay,             
        }  , 




    },
    data : function () {
        return {
            dModalName : "groupConditionModal" , 

            dTempConditions : [] , 

        }
    } ,
    computed : {

        // cGroup : function() { 
        //     return this.group ?? {} ; 
        // } , 

        /**
         * ジョブのリスト
         */

    } ,
    methods : {
        init : async function () {
            // 検索結果・選択状態を初期化
            $(`#${this.dModalName}`).modal("show") ; 
            // console.log("init");
            await this.$nextTick() ; 
            this.$refs.mProductionGroupCondition.conditionChanged() ; 

        } ,
        ok : function () {
            // 呼び出し元の取引先とのチェック

            // 呼び出し元のイベントを駆動して画面を非表示
            
            
            //console.log(this.cList) ; 
            const payload = this.$refs.mProductionGroupCondition.getConditions() ; 
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
