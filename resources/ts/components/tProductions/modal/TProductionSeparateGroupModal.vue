<template>
    <!-- Modalフォーム -->
    <div class="modal fade" id="separateModal" tabindex="-1" role="dialog" data-backdrop="static" style="margin-top: 0px;">        
        <div class="modal-dialog modal-dialog-fluid" role="document">
            <div class="app-modal-content-dark">
                <validation-observer v-slot="{ invalid }">
                    <div class="modal-header">
                        <h4>グループ分割 - {{cGroup.title}} {{cGroup.summaryCaption}}</h4>                        
                    </div>


                    <div class="modal-body">
                        <div class="row">
                            <div class="col-12 col-xl-4">
                                <div class="form-group">
                                    <label>分割方法</label>
                                    <select class="custom-select"                                             
                                            v-model="dSeparateMode">
                                        <option disabled value="">Please select one</option>
                                        <option value="1">選択されたジョブを分割</option>
                                        <option value="2" v-if="cList.length === 1">１つのジョブを数量で分割</option>                                        
                                    </select>
                                </div>
                            </div>

                            <div class="col-12 col-xl-4 pt-4 ml-auto">
                                <div class="float-right mt-1">
                                    <button type="button" class="btn btn-primary"  @click.prevent="ok()" :disabled="invalid || cIsNotAvailable">分割</button>
                                    <button type="button" class="btn btn-light ml-2" @click.prevent="cancel()">キャンセル</button>
                                </div>
                                
                            </div>

                        </div>

                        <!-- １つのジョブを数量で分割 -->
                        <div class="row" v-if="dSeparateMode === 2">

                        </div>


                        <!-- 選択されたジョブを分割 -->
                        <div v-if="dSeparateMode === 1">
                            <div class="row mb-2" >
                                <div class="col-6 text-info">
                                    <h4>分割後グループ１ - {{cSeparatedCaption_1}}</h4>
                                </div>
                                <div class="col-6 text-success">
                                    <h4>分割後グループ２ - {{cSeparatedCaption_2}}</h4>
                                </div>
                            </div>
                            <div class="row" >
                                <div class="col-12 card bg-dark p-3"
                                    v-for="(n ,index)  in cList" :key="n.id"
                                    @click.prevent="selectGroup(n)"
                                    :class="{ 
                                        'dark-deep-selected':dSelectedProcessIds.indexOf(n.id) !== -1  ,                                    
                                    }"
                                    >
                                    
                                    <t-production-plan-group-detail-card 
                                        v-model="cList[index]"
                                        >                 
                                    </t-production-plan-group-detail-card>
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
            /**
             * 分割モード
             *  1:listから分割対象選択
             *  2:listが1件の時のみ processの分割
             */
            dSeparateMode : 1 , 

            dSelectedProcessIds : [] , 

        }
    } ,
    computed : {

        cGroup : function() { 
            return this.group ?? {} ; 
        } , 

        /**
         * ジョブのリスト
         */
        cList : function() { 
            if ( _.isNil(this.group)) return [] ; 

            return this.group.t_project_product_processes ; 
        } , 


        cIsNotAvailable : function() { 
            if ( this.dSeparateMode == 1){
                // list選択モード

                // 全選択されている
                if (this.cList.length === this.dSelectedProcessIds.length ) return true; 

                // １件も選択されていない
                return this.dSelectedProcessIds.length === 0 ; 

            }
            else if (  this.dSeparateMode == 2){
                // 

            }

            return false ; 
        } ,


        cSeparatedCaption_1 : function() { 
            
            if ( this.dSeparateMode == 1) { 
                // list選択モード
                const list = this.cList.filter(x => this.dSelectedProcessIds.indexOf(x.id) !== -1 ) ;
                return this.getSummaryCaption(list ) ; 
            }

            return ""; 
        } ,

        

        cSeparatedCaption_2 : function() { 
            
            if ( this.dSeparateMode == 1) { 
                // list選択モード
                const list = this.cList.filter(x => this.dSelectedProcessIds.indexOf(x.id) === -1 ) ;
                return this.getSummaryCaption(list ) ; 
            }

            return ""; 
        },

    } ,
    methods : {
        init : function () {
            // 検索結果・選択状態を初期化
            $("#separateModal").modal("show") ; 

        } ,
        /**
         * グループの選択
         */
        selectGroup : function(n) { 
            ArrayUtil.switchDelInsByExists(this.dSelectedProcessIds , n.id)  ; 

        } , 
        /**
         * listから集計Caption取得
         */
        getSummaryCaption : function(list ) { 
            const h = ITProductionUtil.sumHour(list) ; 
            const sqm = ITProductionUtil.sumSqm(list) ; 
            const m = ITProductionUtil.sumMater(list) ; 

            let caption = `` ; 
            caption += `ジョブ数:${list.length}件 ` ; 
            caption += ITProductionUtil.getSumCaption(h , sqm , m ) ; 

            return caption; 

        } , 

        ok : function () {
            // 呼び出し元の取引先とのチェック

            // 呼び出し元のイベントを駆動して画面を非表示
            
            
            //console.log(this.cList) ; 
            const payload = { 
                mode : this.dSeparateMode , 
                selectedIds : this.dSelectedProcessIds , 
            }
            this.$emit('ok' , payload ) ;

            this.close() ; 
            
        } ,
        cancel : function() { 

            this.close() ; 

            this.$emit('cancel') ;


        } , 
        close : function() { 
            
            // tmp系の削除
            this.dSelectedProcessIds.splice(0) ; 
            this.dSeparateMode = 1 ; 
            $("#separateModal").modal("hide") ; 
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
