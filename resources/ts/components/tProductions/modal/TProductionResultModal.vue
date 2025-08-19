<template>
    <!-- Modalフォーム -->
    <div class="modal fade" id="resultModal" tabindex="-1" role="dialog" data-backdrop="static" style="margin-top: 0px;">        
        <div class="modal-dialog modal-dialog-fluid" role="document">
            <div class="app-modal-content-dark">
                <validation-observer v-slot="{ invalid }">
                    <div class="modal-header">
                        <h4>生産実績登録 - {{cTitle}}</h4>                        
                    </div>

                    <div class="modal-body">

                        <div class="row">
                            <div class="col-12 pb-4 ml-auto">
                                <div class="float-right mt-1">
                                    <button type="button" class="btn btn-primary"  @click.prevent="ok()" :disabled="invalid ">登録</button>
                                    <button type="button" class="btn btn-light ml-2" @click.prevent="cancel()">キャンセル</button>
                                </div>                                
                            </div>
                        </div>


                        <!-- 生産実績 -->
                        <t-production-group-result 
                            ref="groupResult"
                            v-model="dResults"
                            :m-branch-id="mBranchId"
                            :m-production-id="mProductionId"
                            :result-day="cDefaultResultDay"
                        />

                        <!-- 選択されたジョブを分割 -->
                        <div>
                            <div class="row" >
                                <div class="col-12 card bg-dark p-3"
                                    v-for="(n ,index)  in cList" :key="n.id"
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
import ObjectUtil from '../../../frameworks/ObjectUtil';
import { TProjectProductProcess } from '../../tProjects/class/models/TProjectProductProcess';
import ITProductionUtil from '../class/ITProductionUtil';
import { TProductionDayGroup } from '../class/models/TProductionDayGroup';
import { TProductionResult } from '../class/models/TProductionResult';
import DayJsEx from '../../../frameworks/DayJsEx';

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


        process : { 
            type : TProjectProductProcess , 
        } , 

        mBranchId : { 
            type : Number ,             
        } ,
        mProductionId : { 
            type : Number ,             
        } ,
        defalutResultDay : { 
            type : String | Date , 
        }


    },
    data : function () {
        return {
            dResults  : [] 

        }
    } ,
    computed : {



        cGroup : function() { 
            return this.group ?? {} ; 
        } , 

        cProcess : function () { 
            return this.process ?? {} ; 
        } , 

        cTarget : function() { 
            return this.cIsModeGroup ? this.cGroup : this.cProcess ; 
        } , 

        cIsModeGroup : function() { 
            return ! _.isNil(this.group ) ; 

        } , 

        cTitle : function() { 
            if ( this.cIsModeGroup ) {
                return `${this.cGroup.title} ${this.cGroup.summaryCaption}`; 
            }
            else { 
                return `${this.cProcess?.t_project_product?.t_project.cd} ${this.cProcess?.t_project_product?.t_project?.name} - ${this.cProcess.t_project_product?.name}`; 
            }
            
        } , 

        /**
         * ジョブのリスト
         */
        cList : function() { 
            
            if  (this.cIsModeGroup ){
                if ( _.isNil(this.group)) return [] ; 
                return this.group.t_project_product_processes ; 
            } 
            else { 
                if ( _.isNil(this.process)) return [] ; 
                return [this.process] ; 
            }

            
        } , 

        /**
         * 実績登録のデフォルト作業日
         */
        cDefaultResultDay : function() { 
            if ( ! ObjectUtil.isNUE( this.defalutResultDay)) return this.defalutResultDay ; 
            if ( _.isNil(this.group)) return DayJsEx.today() ; 

            return this.cGroup.planed_production_at ?? DayJsEx.today() ; 

        }

    } ,
    methods : {
        init : function () {

            this.dResults.splice(0) ; 

            const target = this.cTarget ; 

            target.t_production_results.forEach(x => x.tmp_id = x.id ?? (Math.random() * -1)) ;             
            const assigneds = target.t_production_results.map(x => TProductionResult.parse(ObjectUtil.deepCopyJ(x)) ) ;             
            this.dResults.push( ...assigneds) ; 

            const notDeleted = this.dResults.filter(x => _.isNil(x.deleted_at)) ; 

            if ( notDeleted.length === 0 ){
                let result = undefined ; 
                if ( this.group !== undefined ) {
                    result = TProductionResult.createAsOnlyFinishedFromGroup(
                        this.mainStore.loginMUser.id ,
                        this.group
                        ) ;                     
                }
                else if (this.process !== undefined ) { 
                    result = TProductionResult.createAsOnlyFinishedFromProcess(
                        this.mainStore.loginMUser.id , 
                        this.process , 
                        this.mProductionId , 
                        this.defalutResultDay , 
                        ) ; 
                }
                
                if ( result !== undefined ) this.dResults.push(result) ; 
            }

            // 検索結果・選択状態を初期化
            $("#resultModal").modal("show") ; 

        } ,
        ok : function () {

            this.$refs.groupResult.updateValue(this.cTarget.t_production_results) ; 
            
            // console.log(addedList) ; 
            // console.log(this.dResults) ; 
            // console.log(this.cGroup.t_production_results) ; 

            this.close() ; 

            //console.log(this.cList) ; 
            const payload = { 
                mode : this.dSeparateMode , 
                selectedIds : this.dSelectedProcessIds , 
                isModeGroup : this.cIsModeGroup , 
                target : this.cTarget ,
            }
            this.$emit('ok' , payload ) ;

            
        } ,
        cancel : function() { 

            this.close() ; 

            this.$emit('cancel') ;


        } , 
        close : function() { 

            this.cTarget.t_production_results.forEach(x => delete x.tmp_id) ; 
            
            // tmp系の削除
            $("#resultModal").modal("hide") ; 
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
