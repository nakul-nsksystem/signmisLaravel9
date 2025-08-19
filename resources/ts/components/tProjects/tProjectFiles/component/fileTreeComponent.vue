<template>
    <div>
        <div v-for="child in cChildren" :class="cMouseOverClass(child)" >
            <span 
                v-if="child.is_folder" 
                draggable 
                @click.prevent="selectFolder(child)" 
                @dragstart="dragStart(child.uid)"
                @dragover="dragOver(child)"
                @dragleave="dragLeave()"
                @mouseleave="dragLeave()"
                @drop.prevent="moveFiles(child)"
                class="ml-3"
                >
                <a class="btn btn-link p-0" :style="cSelectedFolder(child)" >
                    <i class="fas fa-fw" :class="isOpen(child.appFlg)"></i>
                </a>{{ child.filename }}
            </span>
            <span 
                v-else
                draggable
                @dragstart="dragStart(child.uid)"
                class="ml-3"
                >
                <a class="btn btn-link p-0" style="color:white !important">
                    <i class="fas fa-file fa-fw"></i>
                </a>{{ child.filename }}
            </span> 
            <div v-show="child.appFlg" :id="child.uid" class="mb-1 ml-3">
                <file-tree-component 
                    v-if="child.children.length>0" 
                    :rows="child.children"
                    :selectedPId="selectedPId"
                    :showUids="showUids"
                    @viewFile="$emit('viewFile' , $event)"
                    @dragStart="$emit('dragStart',$event)"
                    @moveFiles="$emit('moveFiles',$event)"
                    />
            </div>
        </div>
        
    </div>
</template>

<script>
import DayJsEx from "@frameworks/DayJsEx" ;
import NumberUtil from "@frameworks/NumberUtil" ;
import ObjectUtil from '../../../../frameworks/ObjectUtil';


export default {
    props : {
        //t_project_files.children
        rows : {
            type : Array ,
        } ,
        //選択中のParentId
        selectedPId : {
            type : Number ,
        } ,

        showUids : {
            type : Array ,
        } ,

    }, 
    data : function () {
        return {
            dSelectedParentId : null ,
            dMouseOverRow : {} ,

        }
    } ,
    computed : {  
        cChildren : function(){
            const _this = this ;
            for(const row of this.rows){
                // if(!row.appFlg) this.$set(row,"appFlg",false) ;
            }
            let list = [] ;
            for(const uid of this.showUids) {
                const found = _this.rows.filter(x => x.uid == uid)
                if(found) list.push(...found) ;
            }
            return list ;
        } ,
        /**
         *  選択中のフォルダ色
        */
        cSelectedFolder : function() {
            return function(row){               
                if(!this.isConsistent(row)) return "color:white!important;"  ;
                // return "text-white" ;
            }
        } , 
        cMouseOverClass : function(){
            return function(row) {
                if(this.dMouseOverRow==row) return "bg-secondary"
            }
        }       

    } ,
    methods : {
        selectFolder : function(row){
            if(!this.isConsistent(row)) {
                row.appFlg = true ;
            } else {
                row.appFlg = !row.appFlg ;
            }
            this.dSelectedParentId = row.id ? row.id : row.uid ;  

            this.$emit("viewFile" , this.dSelectedParentId ) ; 
        },

        /**
         *  アイコン
        */
        isOpen : function(flg) {
            return flg ? "fa-folder-open" : "fa-folder" ;                
        } ,

        /**
         *  選択中のフォルダと選択したフォルダの整合性チェック
        */
        isConsistent : function(row) {
            if(!row.is_unsave) {
                if(row.id  === this.selectedPId) return true ;
            } else {
                if(row.uid === this.selectedPId) return true ;
            }
            return false ;
        } ,
        dragStart : function(uid) {
            // console.log(uid) ;
            event.dataTransfer.effectAllowed = 'move' ;
            event.dataTransfer.dropEffect = 'move' ;
            // event.dataTransfer.setData('list-id',uid) ;
            
            this.$emit("dragStart",uid) ;
        } ,
        dragOver : function(row) {
            this.dMouseOverRow = row ;
        } ,
        dragLeave : function(){
            this.dMouseOverRow = {}
        } ,

        moveFiles : function(row) {

            // const dragId = event.dataTransfer.getData('list-id') ;
            this.$emit('moveFiles',row) ;
            this.dMouseOverRow = {}
           
            // console.log(dragId)
        } ,

    } ,
}
</script>