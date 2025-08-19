<template>
    <div class="row bg-app-secondary" >
        <!-- 計画グルーピング -->
        <div class="col-12 bg-app-secondary" >
            <t-production-plan-grouping-chart                                 
                ref="refChart"
                :m-branch-id="mBranchId"
                :group-manager="groupManager"
                :selected-group="selectedGroup"
                @select-group="selectGroup"
                @try-input-result="tryInputResult"
                @try-check-mismatch="tryCheckMismatch"
                @try-separate-group="trySeparateGroup"
                @get-unplanned="emitGetUnplanned"
                @reload-day="emitReloadDay"
                @group-conditions="emitGroupConditions"
                @save-tproduction-day="emitSaveTProductionDay"
                @delete-tproduction-day="emitDeleteTProductionDay"
                @rel-durstwf="emitRelDurstwf"
                @error="emitError"
                
                @card-drag-start="$emit('card-drag-start' ,$event)" 

            />
        </div>

    </div>    
</template>

<script lang="ts">
// @ts-nocheck

import _ from "lodash" ; 
import DayJsEx from '../../../frameworks/DayJsEx';
import dayjs from 'dayjs';
import TProductionGroupManager from '../class/TProductionGroupManager';
import TProductionGroupGrouper from '../class/TProductionGroupGrouper';
import ITProductionUtil from '../class/ITProductionUtil';


export default {
    data :  function() {
        return {
            
            /**
             * Sort Drop先候補のItemのtarget
             */
            dDragEnteredTarget : undefined ,



            /**
             * 選択中のグループの配列
             */
            //dSelectedGroups : [] , 



        } 
    } , 
    inject : [] ,
    props : {
        /**
         * 拠点ID
         */
        mBranchId : {
            type : Number ,
        } ,
        /**
         * グループマネージャ
         */        
        groupManager : {
            type : TProductionGroupManager ,             
        } , 


        /**
         * 選択中のグループ
         */
        selectedGroup : {
            type : Object ,             
        } ,
    } , 
    computed : {
        // cIsNotReady : function () {
        //     return true ; 
        //     //return _.isNil(this.value) || this.value.length === 0 ;  
        // } , 


        // cGrouper : function():TProductionGroupGrouper { 
        //     return this.groupManager.grouper  ; 
        // } , 





    } , 
    methods : {

        /**
         * 親からデータ変更時のNotice
         */
        noticeDataChanged : function() { 
            // this.grouping() ; 
            this.$refs.refChart.noticeDataChanged() ; 

        } ,
        /**
         * card からの select-group emit受け取り         
         */
        selectGroup : function(n) { 
            this.$emit("select-group" , n ) ; 
            
        } ,

        /**
         * 右クリック からの try-input-result emit受け取り         
         */
        tryInputResult : function(n) { 
            this.$emit("try-input-result" , n ) ; 
            
        } ,
        
        /**
         * 右クリック からの try-check-mismatch emit受け取り         
         */
        tryCheckMismatch : function(n) { 
            this.$emit("try-check-mismatch" , n ) ; 
            
        } ,


        /**
         * 右クリック からの try-input-result emit受け取り         
         */
        trySeparateGroup : function(n) { 
            this.$emit("try-separate-group" , n ) ; 
            
        } ,
        
        /**
         * グルーピング＆ソート
         */
        // grouping : function() {

        //     // Grouping             
        //     for ( const tProduction of this.groupManager.tProductions ) {
        //         for ( const prodDay of tProduction.t_production_days ) {
        //             this.cGrouper.grouping(prodDay) ; 

        //         }   
        //         //console.log(tProduction) ; 
        //         if ( ITProductionUtil.isTProduction(tProduction)){
        //             //console.log("updateKeyGroupNo4Children !!!") ; 
        //             // tProduction.updateKeyGroupNo4Children() ;                     

        //         }
        //         //(tProduction as TProduction).updateKeyGroupNo4Children() ; 
        //     }
        // } , 


        
        /**
         * 順番の並べ替え指示
         */
        // setOrder : function() { 
        //     this.grouping() ; 
        // } , 

        emitReloadDay : function(day ) { 
            this.$emit("reload-day" , day  ) ; 
        } , 
        emitError : function(error) { 
            this.$emit("error" , error ) ; 
        } ,
        emitGroupConditions : function(day ) { 
            this.$emit("group-conditions" , day  ) ; 
        } , 
        /**
         * 親に生産予定日未決定分の取得指示
         */
        emitGetUnplanned : function(day ) { 
            this.$emit("get-unplanned" , day  ) ; 
        } , 

        emitSaveTProductionDay : function(day) { 
            this.$emit("save-tproduction-day" , day  ) ; 
        } , 
        emitDeleteTProductionDay : function(day) { 
            this.$emit("delete-tproduction-day" , day  ) ; 
        } , 
        emitRelDurstwf : function(group) { 
            this.$emit("rel-durstwf" , group  ) ; 
        }


    } , 
    created : function() {        


    
    }
}
</script>
<style scoped>
</style>