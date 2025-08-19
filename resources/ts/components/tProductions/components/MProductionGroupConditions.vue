<template>
    <div>
        <div class="table-responsive">
            <table class="table table-dark table-hover">
                <thead>
                    <th style="width:60px;">対象</th>
                    <th>内容</th>
                </thead>
                <tbody>
                    <tr v-for="n in cSortList"                                         
                        :key="n.def.target"
                        :class="{'dark-deep-green-selected-01' : dDragEnteredTarget === n.def.target }"
                        @dragstart="sortStartDrag($event , n)"
                        @drop="sortDrop($event , n )"
                        @dragover.prevent
                        @dragenter.prevent="sortDragEnter($event , n)"
                        @dragend="dDragEnteredTarget = undefined"
                        draggable="true" 
                        >
                        <td>
                            <ns-checkbox-input
                                v-model="n.is_selected"
                                :id="`productionPlanSort-${n.def.target}`"
                                />
                        </td>
                        <td>
                            <label :for="`productionPlanSort-${n.def.target}`">{{n.def.title}}</label>
                        </td>
                    </tr>
                </tbody>
                
            </table>                                
        </div>        
    </div>    
</template>

<script lang="ts">
// @ts-nocheck

import _ from "lodash" ; 
import TProductionGroupManager from '../class/TProductionGroupManager';
import { ITProductionGroupConditions } from '../class/models/grouper/PdtGrouper';
import TProductionGroupGrouper from '../class/TProductionGroupGrouper';
import {IHasProductionGroupCondition} from '../class/models/grouper/PdtGrouper';
import { IHasProductionGroupCondition } from "../class/models/grouper/PdtGrouper";
import ITProductionUtil from '../class/ITProductionUtil';
import NumberUtil from '../../../frameworks/NumberUtil';


export default {
    data :  function() {
        return {
            
            /**
             * Sort Drop先候補のItemのtarget
             */
            dDragEnteredTarget : undefined ,

            /**
             * ソート条件配列
             */
            // dGroupConditions : [] , 

            dGroupManager : undefined , 

            
            dGroupConditions : []



        } 
    } , 
    props : {
        /**
         * groupCondition
         */
        value : {
            type : Object ,
        }

    } , 
    computed : {
        cSortList : function() {
            return _.sortBy(this.dGroupConditions , "order")  ; 
        } , 
        
    } , 
    methods : {

        /**
         * valueが変更された際に
         * 親側から呼び出してもらう
         */
        conditionChanged : function() { 
            // console.log(this.value) ; 
            if ( _.isNil(this.value)) return ; 
            
            const parsed = TProductionGroupGrouper.parseConditions(this.value) ; 
            //  console.log(parsed); 
            this.dGroupConditions = parsed ; 

        } , 

        /**
         * 条件を呼び出してもらう
         * 親側から呼び出してもらう
         */
        getConditions : function() { 
            const row = {} ; 
            Object.assign(row , this.value) ; 
            TProductionGroupGrouper.updateGroupCondition(row , this.dGroupConditions) ; 
            return row ; 

        } , 


        //#region  DragDrop
        /**
         * DragDropイベント系
         */
        sortStartDrag : function(event, dragItem) {
            //console.log(dragItem) ; 
            event.dataTransfer.effectAllowed = 'move' ; 
            event.dataTransfer.dropEffect = 'move' ; 
            event.dataTransfer.setData('dragItem',dragItem.def.target ) ; 


        } , 
        sortDragEnter : function(event ,item ) { 
            
            this.dDragEnteredTarget = item.def.target ; 
            //console.log(this.dDragEnteredTarget) ; 
        } , 
        sortDrop : function(event ,droppedItem) {
            //console.log("dropped") ; 
            const dragItemTarget = event.dataTransfer.getData('dragItem') ; 
            //console.log(dragItemTarget) ; 

            const dragItem = this.dGroupConditions.find(x => x.def.target === dragItemTarget) ; 
            if ( _.isNil(dragItem) || _.isNil(droppedItem)) return ; 

            const dragOrder = dragItem.order ; 
            const droppedOrder = droppedItem.order ; 
            if ( dragOrder === droppedOrder) return ;
             
            const isDropFromUnder = dragOrder > droppedOrder ; 

            // DragItemを削除
            const dragItemIndex = this.dGroupConditions.indexOf(dragItem) ; 
            this.dGroupConditions.splice(dragItemIndex ,1 ) ; 

            // DroppedItemのところにPush
            let droppedItemIndex = this.dGroupConditions.indexOf(droppedItem) ; 
            if (  ! isDropFromUnder ) droppedItemIndex ++ ; 
            this.dGroupConditions.splice(droppedItemIndex ,0 , dragItem) ; 

            // No振り直し
            let orderNo = 1 ; 
            for ( const item of  this.dGroupConditions){
                item.order = orderNo ; 
                orderNo ++ ; 
            }

        } , 

        //#endregion

    } , 
    created : function() {        

    
    }
}
</script>