<template>    
    <div >
        <!-- :class="{'plan-card-no-dragging' : ! dIsDropEntered , 'dark-deep-green-selected-01' : dIsDropEntered }" -->
        
        <div 
            @dblclick.prevent="selectGroup"
            ref="card"
            :style="{height : `${cHeight}px`}"            
            class="card px-0 mr-1 "
            :class="{
                'plan-card' : ! dIsDropEntered , 
                'dark-deep-green-selected-01' : dIsDropEntered ,
                'bg-dark' :  ! cIsFinished && ! cIsPartFinished, 
                'bg-alpha-purple' : cIsFinished , 
                'bg-alpha-orange' : cIsPartFinished , 
                'bg-alpha-red' :cIsExistsMismatchKey ,
            }" 

            :data-title="cTitle"
            :data-content="cDataContent"
            data-container="body"
            data-placement="right"
            data-trigger="hover"
            data-html="true"
            

            @dragstart="startDrag($event )"
            @dragenter.prevent="dragEnter($event)"
            @dragover.prevent
            @dragleave="dragLeave"
            @drop.prevent.stop="drop($event)"
            @dragend="dragEnd"
            :draggable="this.group.isUnplanned && ! this.group.isExistsResultsChild && this.groupManager !== undefined"
            >
            <div class="card-header py-0 px-1 d-inline-block user-select-none" >                
                <span class="h6" >
                    <i v-if="cGroup.isSelfResults" class="fas fa-check fa-fw text-danger"></i>
                    {{cGroup.title}} {{cGroup.summaryCaption}}
                </span>
            </div>
        </div>        
    </div>
</template>

<script lang="ts">
// @ts-nocheck

import _, { isNil } from "lodash" ; 
import TProductionGroupManager from '../class/TProductionGroupManager';
import { TProductionGroupAbstract } from '../class/models/TProductionAbstract';
import TProductionConsts from '../../../consts/TProductionConsts';

export default {
    data :  function() {
        return {
            dDdCounter : 0 , 

            /**
             * DropEnterされている
             */
            dIsDropEntered : false , 

        } 
    } , 
    props : {
        /**
         * group
         */
        group :  {
            type : TProductionGroupAbstract , 
        } , 
        
        /**
         * 選択中のグループ
         */
        selectedGroup : {
            type : Object ,             
        } ,

        /**
         * スケール
         */
        timePxScale : {
            type : Number , 
            default : () => 1 
        } , 

        /**
         * グループマネージャ
         */        
        groupManager : {
            type : TProductionGroupManager ,             
        } , 
        
        /**
         * 高さモード
         *  hour : 時間
         *  fixed : 固定
         */
        heightMode : { 
            type : String , 
            default : () => "hour"
        }

    } , 
    computed : {
        /**
         * Group
         */
        cGroup : function():TProductionDayGroup | TProductionDay { 
            if ( _.isNil( this.group)) return {} ;             
            return this.group ; 
        } , 
        /**
         * Cardの高さ
         */
        cHeight : function() { 
            if ( _.isNil(this.cGroup )) return 0 ; 

            let height = this.timePxScale * this.cGroup.hour  ; 
            if ( this.heightMode == "fixed"){
                // 固定
                let numOfGroups = this.cGroup.lastChildrenGroups?.length ?? 1 ; 
                numOfGroups = ( numOfGroups == 0  ? 1 : numOfGroups ) ; 
                height = this.timePxScale * numOfGroups * 0.5    ; 
            }

            return height  ; 
        } , 
        /**
         * 選択状態かどうか
         */
        cIsSelected : function() { 
            const selectedGroup:TProductionDayGroup = this.selectedGroup as TProductionDayGroup ; 
            if ( selectedGroup === undefined || this.group === undefined ) return false ; 
            // @ts-ignore
            return selectedGroup.uid == this.group.uid ; 
        } ,
        /**
         * Dragスタートしている
         */
        cIsDragStarted : function() { 
            // @ts-ignore
            if ( _.isNil(this.cGroup?.tmp_isDragStarted)) return false ; 
            // @ts-ignore
            return this.cGroup.tmp_isDragStarted ; 

        } ,
        /**
         * Popoverのタイトル
         */
        cTitle : function() {             
            // @ts-ignore
            return `${this.cGroup.title} [ ${this.cGroup.hour}h ${this.cGroup.sqm}㎡ ${this.cGroup.mater}m ]` ; 
        } , 
        /**
         * Popover内容
         */
        cDataContent : function () { 
            // @ts-ignore
            if ( _.isNil( this?.group?.t_project_product_processes)) return "" ; 

            let content = "" ; 
            // console.log("AA") ; 
            // console.log(this.group) ; 
            // @ts-ignore
            for ( const n of this.group.t_project_product_processes ){
                content += `<div class="mb-2">` ;
                content += `  <div class="row">` ;
                content += `    <div class="col-2 pt-1 pr-0">` ;
                
                let imgSrc = _.isNil(n?.t_project_product?.t_project_file?.base64_thumbnail) 
                        ? "img/noimage.png"
                        : "data:image/jpeg;base64," + n?.t_project_product?.t_project_file?.base64_thumbnail ; 
                
                content += `<img class="img-responsive img-thumbnail mr-3" src="${imgSrc}" width="48px" height="48px">`
                content += `    </div>` ; 
                content += `    <div class="col-10">` ;
                
                content += `${n.t_project_product.t_project.cd} ${n.t_project_product.t_project.name} - ${n.t_project_product.name}` ; 
                content += ` ( ${n.t_project_product.size_w} x ${n.t_project_product.size_h}mm )` ; 
                content += ` [ ${_.ceil(n.predicted_work_hour ,2)}h` ; 
                content += ` ${_.ceil(n.total_custom_sqm == 0 ?  n.t_project_product.total_sqm : n.total_custom_sqm ,3)}㎡` ; 
                content += ` ${_.ceil(n.total_process_mater ,3)}m ]` ; 
                
                content += `<br />` ; 

                let processContents = "" ; 

                for ( const p of n.t_project_product.t_project_product_processes){
                    // console.log(p) ;
                    if ( p.m_process_category.is_production){
                        if ( _.isNil(p.m_process_category.production_color)){
                            processContents += `<span>` ;
                        }
                        else{
                            processContents += `<span style="color:${p.m_process_category.production_color}">` ;
                        }
                        processContents += `${p.m_process_category.name}</span>,` ;                        
                    }
                }
                // content += `${n.t_project_product.display_03}` ; 
                if ( processContents.length > 0 ) processContents = processContents.substring(0 ,processContents.length - 1) ; 

                content += processContents ;
                content += `    </div>` ; 
                content += `  </div>` ; 
                content += `</div>` ; 
                
                 
            }
            return content ; 

        } , 

        cIsFinished : function() { 
            if ( _.isNil( this.group)) return false ; 
            if ( this.cIsExistsMismatchKey ) return false ; 

            return this.group.status === TProductionConsts.Results.Status.C_STATUS_FINISHED  ; 
        } , 
        /**
         * 一部の工程の実績がある
         */
        cIsPartFinished : function() { 
            if ( _.isNil( this.group)) return false ; 
            if ( this.cIsExistsMismatchKey ) return false ; 

            return this.group.status === TProductionConsts.Results.Status.C_STATUS_INPROGRESS  ; 
            
            
        } , 

        cIsExistsMismatchKey: function() { 
            if ( _.isNil( this.group)) return false ; 

            return this.group.isExistsMismatchKey ; 
            
            
        } , 




    } , 
    methods : {
        /**
         * ダブルクリックで詳細を見るとき
         */
        selectGroup : function(){            
            // @ts-ignore
            this.$emit("select-group" , this.group ) ; 

        } , 


        /**
         * DragDropイベント系
         */
        startDrag : function(event) {
            this.hidePopover() ; 

            if ( _.isNil( this.group) || _.isNil( this.groupManager) ) return ; 
            event.dataTransfer.effectAllowed    = 'move' ; 
            event.dataTransfer.dropEffect       = 'move' ;             
            this.groupManager.dragGroup =  this.group ; 
            
            // data に入れないのは、位置入れ替え時にリセットされる為
            this.cGroup.tmp_isDragStarted = true ; 

            // Drag時対策
            this.$emit("card-drag-start" ,event ) ; 
        

        } , 
        
        /**
         * DragEnter
         */
        dragEnter : function(event) {
            if ( _.isNil(this.groupManager?.dragGroup) ) return ; 
            const group = this.groupManager.dragGroup ; 
            if ( ! group ) return ; 

            // Drag時対策
            this.hidePopover() ; 
            
            
            if ( group?.level === undefined      || 
                group.uid === this.cGroup.uid     ||                      // drag元と先uidが一緒
                group.level !== this.cGroup.level ||                      // 階層が違う
                group.m_production_id != this.cGroup.m_production_id     // 生産先が違う
                ) return ; 
            
            //console.log(group) ; 
            //console.log(dragItem) ; 
            this.dDdCounter ++ ; 
            this.dIsDropEntered = true ; 

            if ( this.dDdCounter != 1) return ; 


            // 入れ替え作業
            
        } , 
        dragOver : function(event) { 
            //console.log(`( ${event.offsetX} , ${event.offsetY} ) ${this.cHeight} ` ) ; 
            const group = this.groupManager?.dragGroup ; 
            
            if ( ! group ) return ; 
            
            // 生産先が違う
            if (group.m_production_id != this.cGroup.m_production_id ) {

            }   
            else {
                
                // this.$emit("card-drag-enter" , {
                //     fromGroup       : group         , 
                //     toGroup         : this.cGroup   ,
                //     isFromBelow     : dragStartScreenY > event.screenY ,
                //     pointerYPosPer  : event.offsetY / this.cHeight , 
                // }) ; 
            }

        } , 
        dragLeave : function() { 
            if (! this.dIsDropEntered ) return ; 
            this.dDdCounter -- ; 
            
            if ( this.dDdCounter <= 0 ){
                this.dIsDropEntered = false ; 
            }
            
        } , 
        drop : function(event ) {
            //  console.log("drop") ; 
            this.clearDrag() ; 
            
            if ( ! this.group.isUnplanned ){
                alert("未生産でないグループに、ドロップすることができません。") ; 
                return ; 
            }


            const group = this.groupManager.dragGroup ; 
            //console.log(group) ; 
            if ( ! group ) return ; 

            // 生産先が違う
            if (group.m_production_id != this.cGroup.m_production_id ) {
                 


            }   
            else {                
                this.$emit("card-drop" , {
                    fromGroup       : group     , 
                    toGroup         : this.cGroup   ,
                    
                }) ; 
            }
            
        } ,   
        dragEnd : function() { 
            //this.cGroup.tmp_isDragStarted = false ; 
            this.clearDrag() ; 

            const target = $(this.$refs.card) ; 
            target.popover("update") ;

        }    ,   
        clearDrag : function() { 
            this.dDdCounter = 0  ; 
            this.dIsDropEntered = false ; 

        } ,
        /**
         * Popoverを隠す
         */
        hidePopover : function() { 
            const target = $(this.$refs.card) ; 
            target.popover("hide") ; 

        } , 

    } , 
    beforeDestroy () { 
        // console.log("beforeDestroy " + this.group.uid) ; 
        this.hidePopover() ; 
    } , 
    mounted : function() { 
        
        const target = $(this.$refs.card) ; 
        //console.log("mounted " + this.cGroup.uid) ; 
        //console.log("mounted " + this.cGroup.title) ; 
        target.popover({
            template : '<div class="popover popover-w35" role="tooltip"><div class="arrow "></div><h3 class="popover-header bg-black border-black" ></h3><div class="popover-body bg-black text-white"></div></div>' ,             
            sanitize: false
        }) ;
        
    } ,
    created : function() {        
    } , 
    beforeDestroy : function() { 
        this.hidePopover() ; 
    }
}
</script>
<style scoped>
.plan-card:hover{
    background-color : #30508A !important ;    
    transition: all 0.3s ;        
}


</style>
