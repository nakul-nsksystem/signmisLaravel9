<template>
    <div>

        <div class="card bg-dark p-2" style="min-height:35rem;">

            <thumbnail-frame-component
                :base64="row.base64_thumbnail"
                :path="row.filepath"
                :isNeedToPreview="true"
                :extension="row.extension"
                :filesize="row.filesize"
                :ref="`thumbnailFrame${row.uid}`"
                />
            <div class="card-body d-flex flex-column">
                <div class="mt-auto mb-auto">
                    <p class="card-text h4 mb-0">{{row.filename}}<span v-show="cIsMail(row)" class="badge badge-primary ml-2"><i class="fas fa-envelope"></i></span></p>
                    <p class="card-text">{{row.file_dir}}/</p>
                    <p class="card-text">{{convertByte(row.filesize)}}</p>
                    <p class="card-text">最終更新日 {{(row.modified)}}</p>
                    <div class="text-right" v-if="type=='nomal'">
                        <m-tag-select 
                            :tag-category-key="dTProjectFileTag"
                            :setTagIds="row.m_tags"
                            v-model="row.m_tag_links[dTProjectFileTag]"
                            class="mb-2"
                            v-if="!row.is_folder"
                            ></m-tag-select>                                                  
                        <button 
                            type="button" 
                            class="btn btn-dark"
                            :disabled="loading"
                            @click.prevent="download(row)" 
                            >
                            <div class="spinner-border spinner-border-sm" role="status" v-if="dIsDl">
                                <span class="sr-only"></span>
                            </div>
                            <i class="fas fa-download fa-fw " v-else></i>
                        </button>
                        <label class="btn btn-success mt-2" v-if="!row.is_folder" :class="cUpdateButton">
                            <i class="fas fa-sync fa-fw"></i>   
                            <input 
                                type="file" 
                                style="display:none;"
                                :ref="'fileUploader' + row.filename"
                                @change="updateFile(row)"
                                :disabled="loading || dIsDl"
                                
                                >
                        </label> 
                        <button type="button" class="btn btn-danger" @click.prevent="destroy(row)" :disabled="loading || dIsDl">
                            <i class="fas fa-trash fa-fw"></i>                            
                        </button>
                    </div>
                    <div class="text-right" v-else >
                        <button 
                            type="button" 
                            class="btn btn-success"
                            @click.prevent="$emit('setThumbnail' , row)" 
                            >
                            選択
                        </button>
                    </div>
                    <!-- <div class="mb-2">
                        <div class="progress position-relative">
                            <div class="progress-bar progress-bar-striped" role="progressbar" :style="dProgressbarVal" :aria-valuenow="dProgressbarRatio" aria-valuemin="0" aria-valuemax="100">
                                <small class="justify-content-center d-flex position-absolute w-100 text-dark font-weight-bold">{{dProgressbarRatio}}%</small>
                            </div>
                        </div>
                    </div>
                    <div v-show="row.loadFlg && dProgressbarRatio === 100" class="mb-2">
                        <div class="spinner-grow" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                        ダウンロード中
                    </div> -->
                </div>

            </div>
            
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
export default {
    props : {
        //t_project_file
        row : {
            type : Object ,
        } ,
        type : {
            type : String ,
        } ,

        //ファイルアップ中のステータス
        loading : {
            type : Boolean ,
        }
    }, 
    data : function () {
        return {
            dTProjectFileTag : "t_project_files_category" ,

            dShowModal : false ,

            dIsDl : false ,

        }
    } ,
    computed : {
        cDropboxService(){
            return this.dropboxStore.dropboxService ;             
        }  ,

        cUpdateButton : function(){
            return this.loading || this.dIsDl ? "disabled" : ""
        } ,
        //メールから抽出した添付ファイルかの判定
        cIsMail : function() {
            return function(fileRow) {
                return !_.isNil(fileRow.t_project_mail_id) || !_.isNil(fileRow.t_project_mail_uid) 
            }
        }

    } ,
    methods : {
        convertByte : function(size) {
            if(_.isNil(size)) return '' ;

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
        updateFile : function(row ) {
            if(! confirm("更新してもよろしいですか？")) return ;   
            this.$emit("updateFile" , row) ;

            //event初期化
            const refNames = "fileUploader" + row.filename ;
            this.$refs[refNames].value = "" ;
            this.$refs[`thumbnailFrame${row.uid}`].clearPreviewData() ;

        } ,
        /**
         * ダウンロード
         */
        download : async function(row) {
            
            this.dIsDl = true ;
            await this.cDropboxService.downloadFile(row.filepath) ;
            this.dIsDl = false ;

        } ,
        /**
         * ファイル削除
         */
        destroy : function(row) {
            let massage = "削除してもよろしいですか？" ;

            if(! confirm(massage)) return ; 
            
            this.$emit("deleteFile" , row) ;
        } ,

        /**
         * サムネイル選択
         */
        selectThumbnail : function(){

            this.$emit("setThumbnail" , this.row) ;

        } ,


    } ,
}
</script>

<style scoped>
/* bootstrapmodalが使えなかったので */

.preview{
    width: auto;
    height:auto;
    display: block;

    position:fixed;
    top:25%;
    left:50%;
    transform:translate(-50%);
}
.preview-wrap{
    background-color:rgba(0,0,0,.5);
    width: 100%;
    height: 100%;
    position:fixed;
    top:0;
    left:0;
    z-index: 1050;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>