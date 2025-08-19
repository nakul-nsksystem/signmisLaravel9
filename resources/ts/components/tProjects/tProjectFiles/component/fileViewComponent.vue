<template>
    <div>
        <div class="row">
            <div class="card bg-dark col-12 col-xl-4 mb-2">
                <span 
                    class="mt-2 mb-2"
                    :class="cMouseOverClass(dRouteFolder)"
                    @click.prevent="selectFolder()"
                    @dragstart="dragStart()"
                    @dragover="dragOver(dRouteFolder)"
                    @dragleave="dragLeave()"
                    @drop.prevent="moveFiles(dRouteFolder)" 
                    >
                    <a class="btn btn-link p-0" :style="cSelectedDefault">
                        <i class="fas fa-folder-open fa-fw"></i>
                    </a>{{projectName}}
                </span>  
                <div v-for="n in cTProjectFiles" :class="cMouseOverClass(n)">
                    <span 
                        v-if="n.is_folder" 
                        @click.prevent="selectFolder(n)" 
                        draggable 
                        @dragstart="dragStart(n.uid)"
                        @dragover="dragOver(n)"
                        @dragleave="dragLeave()"
                        @drop.prevent="moveFiles(n)"
                        class="ml-3"
                        >
                        <a class="btn btn-link p-0" :style="cSelectedFolder(n)"> 
                            <i class="fas fa-fw" :class="isOpen(n.appFlg)"></i>                                                                                
                        </a>{{ n.filename }}
                    </span>
                    <span 
                        v-else
                        draggable 
                        @dragstart="dragStart(n.uid)"
                        class="ml-3"
                        >
                        <a class="btn btn-link p-0" style="color:white !important">
                            <i class="fas fa-file fa-fw"></i>
                        </a>{{ n.filename }}
                    </span>
                    <div v-show="n.appFlg" class="mb-1 ml-3">
                        <file-tree-component
                            :rows="n.children"
                            :selectedPId="dSelectedParentId"
                            :showUids="showUids"
                            @viewFile="dSelectedParentId=$event" 
                            @dragStart="dragStart"
                            @moveFiles="moveFiles"
                            />
                    </div> 
                </div>
                <div class="ml-auto" v-if="type=='nomal'&& cDeletedAt">
                    <button 
                        type="button" 
                        class="btn btn-dark mb-2"
                        @click.prevent="downloadFolder" 
                        :disabled="dSelectedParentId==null || loading"
                        >
                        <i class="fas fa-download fa-fw"></i>
                    </button>
                    <button 
                        type="button" 
                        class="btn btn-danger mb-2"
                        @click.prevent="deleteFolder" 
                        :disabled="dSelectedParentId==null || loading"
                        >
                        <i class="fas fa-trash fa-fw"></i>
                    </button>
                </div>
            </div>
            <div class="col-12 col-xl-8">
                <div class="row">
                    <div v-for="n in cPreviewFileList" class="col-12 col-xl-6 mb-2 pr-xl-0" :key="n.uid">
                        <template v-if="n.deleted_at == null">
                            <thumbnail-list-component
                                :row="n" 
                                :type="type"
                                :loading="loading"
                                @deleteFile="$emit('deleteFile',$event)"
                                @updateFile="$emit('updateFile',$event)"
                                @setThumbnail="$emit('setThumbnail',$event)"/>  
                        </template>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
import DayJsEx from "@frameworks/DayJsEx" ;
import NumberUtil from "@frameworks/NumberUtil" ;
import ObjectUtil from '../../../../frameworks/ObjectUtil';
import _ from 'lodash'


export default {
    props : {
        //t_project_files
        value : {
            type : Array ,
        } ,
        projectName : {
            type : String ,
        } ,
        showUids : {
            type : Array ,
        } ,
        type : {
            type : String ,
        } ,
        loading : {
            type : Boolean ,
        }

    }, 
    data : function () {
        return {
            dSelectedParentId : null ,
            //タグ
            dTProjectFileTag : "t_project_files_category" ,

            dChildren : [] ,

            dMouseOverRow : {} ,

            dDragRowUid : undefined ,
            dDropRow : {} ,

            dRouteFolder : {
                id : null ,
                uid : null ,
            }
        }
    } ,
    computed : {
        cDropboxService(){
            const service = this.dropboxStore.dropboxService ; 
            return service ;             
        }  ,
        cTProjectFiles : function() {
            const list = this.value.filter(x => _.isNil(x.parent_id) ) ;
            for(const row of list) {                
                if(_.isNil(row.appFlg)) this.$set(row,"appFlg",false) ; 
            }
            return list ;
        } ,
        cDeletedAt : function(){
            const list = this.value.filter(x=>x.deleated_at==null)
            if(list.length>0) return true ;
        } ,
        cPreviewFileList : function() {
            let result =  this.value.filter( 
                x => x.parent_id === this.dSelectedParentId && !x.is_folder) ;  
            return result ;
        } ,

        /**
         *  選択中のフォルダ色
        */
        cSelectedFolder : function() {
            return function(row){               
                if(!this.isConsistent(row)) return "color:white !important"  ;
                // return "text-white"
            }
        } ,
        cSelectedDefault : function(){
            if(this.dSelectedParentId !== null)  return "color:white !important"
        } ,
        cMouseOverClass : function(){
            return function(row) {
                if(this.dMouseOverRow==row) return "bg-secondary"
            }
        }

    } ,
    methods : {
        /**
         *  フォルダ選択イベント
        */
        selectFolder : function (row) {
            if(!row) {
                this.dSelectedParentId  = null ;
                return ;
            }
            if(!this.isConsistent(row)) {
                row.appFlg = true ;
            } else {
                row.appFlg = !row.appFlg ;
            }
            this.dSelectedParentId  = row.id ? row.id : row.uid ;

        },
        dragStart : function(uid) {
            // console.log(uid) ;
            event.dataTransfer.effectAllowed = 'move' ;
            event.dataTransfer.dropEffect = 'move' ;
            // event.dataTransfer.setData('list-id',uid) ;

            this.dDragRowUid = uid ;
            
            // this.$emit("moveFile",uid)
        } ,
        dragOver : function(row) {
            if(event.dataTransfer.effectAllowed !== "move") return
            this.dMouseOverRow = row ;
        } ,
        dragLeave : function(){
            this.dMouseOverRow = {}
        } ,

        moveFiles : function(row) {
            // const dragId = event.dataTransfer.getData('list-id') ;
            // console.log(this.dDragRowUid) ;
            if(event.dataTransfer.effectAllowed !== "move") return
            const dragList = this.value.find(x => x.uid == this.dDragRowUid) ;
            const dragIdx = this.value.indexOf(dragList) ;
            const rowId = row.id ? row.id : row.uid ;

            //同フォルダへの移動、子への移動制御
            if(dragList.uid==row.uid || dragList.parent_id == rowId || row.parent_id == dragList.id || row.parent_id == dragList.uid){
                this.dDragRowUid = undefined ;
                this.dMouseOverRow = {}
                return ;
            } 

            const destinationFileName = row.filename ?? this.projectName ;

            if(!confirm(dragList.filename + 'を' + destinationFileName + 'に移動しますか？')) {
                this.dDragRowUid = undefined ;
                this.dMouseOverRow = {}
                return ;  
            } 
            this.moveChildren(dragList ,row) ;
            if(dragList.parent_id) {
                this.updateFiletreeView(this.cTProjectFiles) ;
            }
            this.value[dragIdx].parent_id = rowId ;
            this.value[dragIdx].is_moved = 1 ;

            row.children.push(dragList)
            this.dDragRowUid = undefined ;
            this.dMouseOverRow = {}
        } ,

        /**
         * 再帰的に移動後の情報に書き換え
         */
        moveChildren : function(dragList ,parentRow) {
            const tProjectFileRow = this.value.find(x => x.uid == dragList.uid) ;
            const dragIdx = this.value.indexOf(tProjectFileRow) ;
            const dragRow = this.value[dragIdx] ;
            // console.log(this.value[dragIdx])

            if(dragIdx!==-1){
                dragRow.file_dir = parentRow.file_dir ? parentRow.file_dir + "/" + parentRow.filename : parentRow.filename ;
                dragRow.filepath = parentRow.filepath + "/" + dragRow.filename ;
                if(dragRow.children.length>0){
                    for(const n of dragRow.children){
                        this.moveChildren(n,dragRow)
                    }
                }

            }

        } ,
        /**
         * ファイル移動時filetree表示更新
         */
        updateFiletreeView : function(tProjectFiles){
            for(const x of tProjectFiles){
                if(x.children.length>0){
                    const viewChildRow = x.children.find(x => x.uid == this.dDragRowUid) ;
                    // console.log("aa") ;
                    if(viewChildRow) {
                        const viewChildRowIdx = x.children.indexOf(viewChildRow) ;
                        
                        if(viewChildRowIdx!==-1){
                            x.children.splice(viewChildRowIdx,1)
                        }
                        
                    } else {
                        this.updateFiletreeView(x.children)
                    }
                }
            }

        } ,

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
                if(row.id  === this.dSelectedParentId) return true ;
            } else {
                if(row.uid === this.dSelectedParentId) return true ;
            }
            return false ;
        } ,
        convertByte : function(size) {
            //バイト単位自動変換
            if(size === "" || size ===null) return  ;

            const kb = 1024 ;
            const mb = Math.pow(kb, 2) ;
            const gb = Math.pow(kb, 3) ;
            const tb = Math.pow(kb, 4) ;
            let target = null ;
            let unit = 'byte' ;
            if (size >= tb) {
                target = tb
                unit = 'TB'
            } else if (size >= gb) {
                target = gb
                unit = 'GB'
            }else if (size >= mb) {
                target = mb
                unit = 'MB'
            } else if (size >= kb) {
                target = kb
                unit = 'KB'
            }
            const res = target !== null ? Math.floor((size / target) * 100) / 100 : size ;
            return res + unit;
        },

        /**
         * フォルダーごとダウンロード
         */
        downloadFolder : async function() {
            let list ;
            if(this.dSelectedParentId){
                for(const row of this.value){
                    if(this.isConsistent(row)){
                        list = row ;
                        // list.push(row)
                    }
                }
            } else {
                return ;
                list = this.cTProjectFiles ;
            }
            if(this.confirmMovedOrUpdated(list)) {
                alert("移動または更新されたファイルがあるため、ダウンロードできません\n物件保存をしてください") ;
                return ; 
            }
            this.cDropboxService.downloadZip(list.filepath) ;
            
        } ,
        /**
         * 移動または更新済みのファイルがあるかチェックする
         */
        confirmMovedOrUpdated : function(row){
            if(row.is_moved ||row.is_updated) {
                return true ;
            }
            if(row.children.length>0){
                for(const x of row.children) {
                    if(this.confirmMovedOrUpdated(x)) return true ;
                }
            }
        } ,
        deleteFolder : function() {
            let massage = "削除してもよろしいですか？" ;
            if(! confirm(massage)) return ;  

            let list ;
            if(this.dSelectedParentId){
                for(const row of this.value){
                    if(this.isConsistent(row)){
                        list = row ;
                    }
                }
            } else {
                list = this.cTProjectFiles ;
            }
            this.$emit('deleteFile',list)
        } ,
        setThumbnail : function (file) {

            const idx = this.value.t_project_products.indexOf(this.row) ;

            if(file.id) {
                this.value.t_project_products[idx].t_project_file_id = file.id ;

            } else {
                this.$set(this.value.t_project_products[idx] , "t_project_file_uid" ,file.uid) ;
            }

        },

    } ,
}
</script>