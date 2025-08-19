<template>
    <div class="px-0 ">
        <div class="card bg-app-secondaly">
            <div class="card-header d-flex flex-wrap px-2" v-if="type=='nomal'">
                <div class="flex-grow-0 flex-shrink-0 btn-group btn-group-toggle" style="flex-basis:100px;" data-toggle="buttons" >
                    <label class="btn btn-dark active">
                        <input type="radio" name="options" id="option1" autocomplete="off" value="list" v-model="dSwitch"><i class="fas fa-list fa-fw "></i>
                    </label>
                    <label class="btn btn-dark">
                        <input type="radio" name="options" id="option2" autocomplete="off" value="thumbnail" v-model="dSwitch"><i class="fas fa-th-large fa-fw "></i>
                    </label>
                </div>
                <!-- メールセレクト -->
                <div class="flex-grow-1 pl-2 pr-2 pr-xl-0" v-if="$$cIsNskDev">
                    <select  class="form-control" placeholder="" disabled>
                        <option></option>
                        <option>施設誘導標</option>
                        <option>ホーム自立</option>
                        <option>エレベータのご案内</option>
                    </select>
                </div>
                <div v-if="$$cIsDebug" class="flex-grow-1 pl-2 pr-2 pr-xl-0">
                    <button type="button" class="btn btn-light" @click.prevent="test">
                        接続Test
                    </button>
                </div>

                <div class="flex-grow-1 text-right px-2 pt-2 pt-xl-0">
                    <button type="button" class="btn" :class="cFilterButtonClass('Graphics')" @click.prevent="dGraphicsFlg = !dGraphicsFlg">
                        Graphics <span class="badge badge-light">{{dGraphics.length}}</span>
                    </button>
                    <button type="button" class="btn" :class="cFilterButtonClass('Cad')" @click.prevent="dCadFlg = !dCadFlg">
                        Cad <span class="badge badge-light">{{dCad.length}}</span>
                    </button>
                    <button type="button" class="btn" :class="cFilterButtonClass('Others')" @click.prevent="dOthersFlg = !dOthersFlg">
                        その他 <span class="badge badge-light">{{dOthers.length}}</span>
                    </button>
                </div>
            </div>

            <div class="card-body"
                @dragenter="dragEnter"
                @dragleave="dragLeave"
                @dragover.prevent
                @drop.prevent="drop"
                webkitdirectory
                :class="{'dark-deep-selected':dIsEnter }"
                >
                <div class="drop p-4 mb-2" v-if="!dLoading && type=='nomal'">
                    <label for="corporation_folder" class="btn btn-outline-light">
                        フォルダを選択
                        <input
                            type="file"
                            style="display:none;"
                            ref="fileReader"
                            id="corporation_folder"
                            @change="selectFolder"
                            webkitdirectory
                            directory
                            >
                    </label>
                    または
                    <label for="corporation_file" class="btn btn-outline-light">
                        ファイルを選択
                        <input
                            type="file"
                            style="display:none;"
                            ref="fileReader"
                            id="corporation_file"
                            @change="selectFile"
                            >
                    </label>
                    またはドロップ
                </div>
                <div v-show="dProgressbarRatio > 100" class="p-4 mb-2">
                    <div class="spinner-grow" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                    ダウンロード中
                </div>
                <!-- <template v-for="(n,index) in dLoadArr"> -->
                <div v-if="dProgressbarRatio !== undefined && dProgressbarRatio <= 100" class="p-4 mb-2">
                    <div class="progress position-relative">
                        <div class="progress-bar progress-bar-striped" role="progressbar" :style="dProgressbarVal" :aria-valuenow="dProgressbarRatio" aria-valuemin="0" aria-valuemax="100">
                            <small class="justify-content-center d-flex position-absolute w-100 text-dark font-weight-bold">{{dProgressbarRatio}}%</small>
                        </div>
                    </div>
                </div>
                <!-- </template> -->

                <div v-show="dSwitch=='list'">
                    <file-view-component
                        v-model="cTProjectFiles"
                        :projectName="value.name"
                        :showUids="dShowUids"
                        :type="type"
                        :loading="dLoading" 
                        @deleteFile="destroy"
                        @updateFile="updateFile"
                        @setThumbnail="setThumbnail"
                        />
                </div>
                <div v-show="dSwitch=='thumbnail'">
                    <div class="row">
                        <template v-for="n in cTProjectFiles">
                            <div v-if="n.deleted_at == null && !n.is_folder" class="col-12 col-xl-4 mb-2">
                                <thumbnail-list-component
                                    :row="n"
                                    :type="'nomal'" 
                                    :loading="dLoading" 
                                    @deleteFile="destroy"
                                    @updateFile="updateFile"
                                    />
                            </div>
                        </template>
                    </div>
                </div>

            </div>

        </div>

    </div>

</template>

<script>
import ObjectUtil from '../../../frameworks/ObjectUtil';
import NumberUtil from "@frameworks/NumberUtil" ;
import DayJsEx from "../../../frameworks/DayJsEx" ;
import extensions from "../../../../asset/extensionType.json"
import _ from "lodash"

export default {
    data :  function() {
        return {
            apiName : "tProjectFile" ,

            dSwitch : "list" ,

            //プログレスバー制御
            dLoading : false ,
            dLoadArr : [] ,

            dProgressbarVal : "width:0%" ,
            dProgressbarRatio : undefined ,


            //mailnameフィルター
            dMailName : "" ,

            //モーダル表示フラグ
            dShowModal : false ,
            //モーダル用プレビューパス
            dPreviewRow : undefined ,

            //タグ
            dTProjectFileTag : "t_project_files_category" ,

            //分類
            dGraphics : [] ,
            dGraphicsFlg : true ,
            dCad : [] ,
            dCadFlg : true ,
            dOthers : [] ,
            dOthersFlg : true ,
            dShowUids : [] ,

            dExtensionArr : extensions ,

            dFileCode : undefined ,

            dTempPath : "/public/temporary/t_project" ,
            // dTempPath : "/public/temporary/t_project"

            dIsEnter : false ,
            dCounter : 0 ,

        }
    } ,
    props : {
        // T_PRODUCTSのレコード
        value : {
            type : Object ,
        } ,
        type : {
            type : String ,
        } ,
        productRow : {
            type : Object ,
        }
    } ,
    computed : {
        cDropboxService(){
            const service = this.dropboxStore.dropboxService ; 
            return service ;             
        }  ,
        cEndpoint : function () {
            let ep =  `api/${this.apiName}/saveFile` ;
            return  ep ;
        } ,
        cTProjectFiles : function() {

            let list = this.value.t_project_files ;

            //リセット
            const graphicsArr = [] ;
            const cadArr = [] ;
            const othersArr = [] ;
            const showArr = [] ;

            //ファイルの分類判定し、uidを保存
            const _this = this ;
            for(const row of list) {
                if(!row.m_tag_links) {
                    row.m_tag_links = {} ;
                    row.m_tag_links[this.dTProjectFileTag] = [] ;
                }
                if(row.deleted_at == null){

                    const type = this.checkExtension(row) ;

                    if(type ==="Graphics"){

                        graphicsArr.push(row.uid) ;

                    } else if (type ==="Cad") {

                        cadArr.push(row.uid) ;

                    } else if(!row.is_folder){

                        othersArr.push(row.uid) ;
                    }

                    showArr.push(row.uid) ;
                }

            }

            this.dGraphics = graphicsArr ;
            this.dCad = cadArr ;
            this.dOthers = othersArr ;
            this.dShowUids = showArr ;


            //表示フラグ適用
            if(this.dGraphicsFlg){
                this.dShowUids = this.dShowUids.concat(this.dGraphics) ;
            } else {
                this.dShowUids = this.dShowUids.filter(function(x){
                    return !_this.dGraphics.includes(x) ;
                }) ;
            }
            if(this.dCadFlg){
                this.dShowUids = this.dShowUids.concat(this.dCad) ;
            } else {
                this.dShowUids = this.dShowUids.filter(function(x){
                    return !_this.dCad.includes(x) ;
                }) ;
            }
            if(this.dOthersFlg){
                this.dShowUids = this.dShowUids.concat(this.dOthers) ;
            } else {
                this.dShowUids = this.dShowUids.filter(function (x){
                    return !_this.dOthers.includes(x) ;
                }) ;
            }

            //重複削除処理
            this.dGraphics = this.dGraphics.filter(function (x, idx, self) {
                return self.indexOf(x) === idx ;
            });
            this.dCad = this.dCad.filter(function (x, idx, self) {
                return self.indexOf(x) === idx ;
            });
            this.dOthers = this.dOthers.filter(function (x, idx, self) {
                return self.indexOf(x) === idx;
            });
            this.dShowUids = this.dShowUids.filter(function (x, idx, self) {
                return self.indexOf(x) === idx;
            });

            const filterd = this.dShowUids.map(function (x){
                const found = list.find(y => y.uid === x) ;
                return found ;
            }) ;

            return filterd ;

        } ,
        cFilterButtonClass : function(){
            return function(type){

                if(type === "Graphics"){

                    if(this.dGraphicsFlg) return "btn-primary"

                } else if (type === "Cad") {

                    if(this.dCadFlg) return "btn-success"

                } else if(type === "Others") {

                    if(this.dOthersFlg) return "btn-info"

                }

                return "btn-dark"
            }
        },

        /**
         * 紐づけ用uId配列
         */
        cUids : function () {
            //idとuid間でも重複起きないように
            const uids = this.value.t_project_files.map(x => x.uid ) ;
            const ids = this.value.t_project_files.map(x => x.id ) ;
            const result = uids.concat(ids) ;
            return result ;
        },

        cFolderCode : function(){
            //保存時にフォルダコード更新
            const lastUpdate = this.value.updated_at ;
            const code = this.$$cLoginUserId +  DayJsEx.format(Date() , "YYYYMMDDHHmmss")
            // console.log(lastUpdate) ; 
            // if(!this.dFileCode) this.dFileCode = code
            return code ;
        } ,

        cTempPath : function(){
            if(this.cFolderCode === undefined) return "" ;
            return this.dTempPath + `/${this.cFolderCode}` ;
        }

    } ,
    methods : {
        dateFormat : function(value) {
            if(_.isNil(value)) return "" ;
            return DayJsEx.format(value , "YYYY-MM-DD HH:mm:ss")
        },

        /**
         * 拡張子フィルター関係
         */
        checkExtension : function(row){
            const extension = row.extension ;
            const graphics = ["jpeg" ,"jpg","JPEG","JPG","jpe","jfif","pjpeg","pjp","png","gif","tif","tiff"] ;
            const cad = ["EPS","eps" ,"ai","svg","svgz","ARD","ard"] ;

            if (graphics.indexOf(extension) !== -1) return "Graphics" ;
            if (cad.indexOf(extension) !== -1)      return "Cad" ;
            if (row.extension == "folder") return "Folder"
            return "その他" ;
        },
        buttonClass : function(row){
            if (this.dGraphics.indexOf(row.uid) !== -1) return "btn-primary" ;
            if (this.dCad.indexOf(row.uid) !== -1)      return "btn-success" ;
            return "btn-info" ;
        } ,
        /**uid 付番 */
        generateUId : function() {

            let uid = Math.floor(Math.random() * (1000 - 1)) + 1 ;
            while(this.cUids.indexOf(uid) !== -1) {
                uid = Math.floor(Math.random() * (1000 - 1)) + 1 ;
            }

            return uid ;
        
        } ,

        /**
         * 追加（ドラッグドロップ）
         */
        dragEnter : function () {
            if(this.type == "select" || event.dataTransfer.effectAllowed == 'move') return ;
            this.dCounter ++;        
            this.dIsEnter = true 
        } ,
        dragLeave : function() {
            if(this.type == "select" || event.dataTransfer.effectAllowed == 'move') return ;
            this.dCounter--;
            if (this.dCounter === 0) { 
                this.dIsEnter = false
            }
            // console.log('Leave Drop Area');
        } ,
        dragOver : function () {
            // console.log('DragOver') ;
        } ,
        drop : async function() {            
            //ファイル移動の時に動かないようにする
            //サムネイル紐づけの時動かないようにする            
            if(this.type == "select" || event.dataTransfer.effectAllowed == 'move') return ;
            this.dIsEnter = false
            this.dCounter = 0

            let loadFile = event.dataTransfer.items ;
            if(!loadFile) return 

            const vueParam = {
                common_path : this.cTempPath,
                parent_path : "" ,
                uploading : this.uploading ,
            }

            const res = await this.cDropboxService.formatAndUploadDropFiles(loadFile,vueParam) ;

            const dirArr = this.cDropboxService.createPathArr(res) ;

            
            for(const dir of dirArr) {

                this.setFolderRow(dir) ;

            }

            this.setTProjectFileRecord(res) ;


        } ,


        /**
         *追加(ボタンから単体ファイル選択)
         */
        selectFile : async function(){
            let loadFile = event.target.files ? event.target.files : event.dataTransfer.files ;
            const dropedFile = [...loadFile] ;
            //連続読み取り用処理
            if(!loadFile) return ;
            //event初期化
            if(this.$refs.fileReader) this.$refs.fileReader.value = "" ;

            const vueParam = {
                common_path : this.cTempPath,
                parent_path : "" ,
                uploading : this.uploading ,
            }

            const res = await this.cDropboxService.uploadFile(dropedFile ,vueParam) ;
            this.setTProjectFileRecord(res) ;

        } ,

        /**
         *追加(ボタンからフォルダー選択)
         */
        selectFolder : async function(){

            let loadFile = event.target.files ? event.target.files : event.dataTransfer.files ;
            const dropedFile = [...loadFile] ;
            //連続読み取り用処理
            if(!loadFile) return ;
            if(this.$refs.fileReader) this.$refs.fileReader.value = "" ;

            const vueParam = {
                common_path : this.cTempPath,
                parent_path : "" ,
                uploading : this.uploading ,
            }
            
            const res = await this.cDropboxService.uploadFile(dropedFile ,vueParam) ;
            
            //folder情報成型
            const dirArr = this.cDropboxService.createPathArr(res) ;
            
            for(const dir of dirArr) {

                this.setFolderRow(dir) ;

            }

            this.setTProjectFileRecord(res) ;

        } ,

        /**
         * フォルダー保存
         */
        setFolderRow : function(fullPath){
            // console.log(fullPath) ;
            if(fullPath === undefined ) return ;
            //フォルダネーム取得
            const parsed = fullPath.split("/") ;
            const folderName = parsed.slice(-1)[0] ;

            const folderRow = {
                uid               : this.generateUId() ,
                parent_id         : null ,
                is_folder         : 1 ,
                is_unsave         : 1 ,
                filename          : folderName,
                filepath          : `${this.cTempPath}/${fullPath}` ,
                file_dir          : null ,
                filesize          : "" ,
                extension         : "folder" ,
                modified          : null ,
                base64_thumbnail  : "img/folder.jpeg" ,
                src_thumbnailpath : null ,
                folder_code       : this.cFolderCode ,
                children          : [] ,
                created_m_user_id : this.$$cLoginUserId ,
                updated_m_user_id : this.$$cLoginUserId ,
            }
            //複数階層の場合親を検索し挿入　　
            if(parsed.length>1) {
                const parentDir = this.cDropboxService.getDirName(fullPath) ;
                folderRow.file_dir = parentDir ;
                folderRow.parent_id = this.searchParent(folderRow.filepath) ;
                this.pushChild(folderRow) ;
            }
            this.value.t_project_files.push(folderRow) ;

        } ,

        /**t_project_fileに挿入 */
        setTProjectFileRecord : function (files) {
            
            for(const n of files) {

                const tProjectFile = {

                    uid : this.generateUId() ,
                    filename : n.name ,
                    filepath : n.path_display ,
                    file_dir : this.cDropboxService.getDirName(n.parent_path) ?? null ,
                    src_filepath : n.path_display ,
                    is_folder : 0 ,
                    base64_thumbnail : n.base64_thumbnail ,
                    src_thumbnailpath : null ,
                    extension : n.extension ,
                    filesize : n.size ,
                    children : [] ,
                    is_unsave : 1 ,
                    created_m_user_id : this.$$cLoginUserId ,
                    updated_m_user_id : this.$$cLoginUserId ,
                    m_tags : [] ,
                    folder_code : this.cFolderCode ,
                    modified : this.dateFormat(n.client_modified) ,

                }

                // 親検索挿入
                tProjectFile.parent_id = this.searchParent(tProjectFile.filepath) ;
                if(tProjectFile.parent_id) this.pushChild(tProjectFile) ;

                this.value.t_project_files.push(tProjectFile) ;
            }

            this.$emit("uploadFile",false) ;
            

        } ,

        /**
         * ファイル更新
         */
        updateFile : async function(row) {
            // this.$set(row, "loadFlg" ,true) ;

            let loadFile = event.target.files ? event.target.files : event.dataTransfer.files;

            if(!loadFile) return ;
            const dropedFile = [...loadFile] ;

            const idx = this.value.t_project_files.indexOf(row) ;
            const updaterow = this.value.t_project_files[idx] ;

            const vueParam = {
                common_path : this.cTempPath,
                parent_path : "" ,
                uploading : this.uploading ,
            }

            try {
                const res = await this.cDropboxService.uploadFile(dropedFile ,vueParam) ;
                const resList = res[0] ;

                updaterow.src_filepath = resList.path_display ;
                updaterow.filesize = resList.size ;
                updaterow.base64_thumbnail = resList.base64_thumbnail ;
                // updaterow.src_thumbnailpath = res.src_thumbnailpath ;
                updaterow.modified = this.dateFormat(resList.client_modified) ;
                updaterow.updated_m_user_id = this.$$cLoginUserId ;
                updaterow.is_unsave = 1 ;

                if(updaterow.id) {
                    updaterow.is_updated = 1 ;
                    
                } else {
                    //未保存のデータの場合は更新フラグではなく新しく保存する
                    updaterow.filename = resList.name ;
                    updaterow.filepath = resList.path_display ;

                }
                

                for(const x of this.value.t_project_files) {
                    if(x.children?.length){
                        this.updateChild(x,updaterow.uid)
                    }
                }


            } catch (error) {
                this.$$errorConsole(error ) ;
                alert("ファイルのアップロードに失敗しました") ;

            } finally {

                // this.dProgressbarVal = "width:0%" ;
                // this.dProgressbarRatio = 0 ;
                this.$emit("uploadFile",false) ;

            }

        } ,

        //子の更新フラグ
        updateChild : function(row ,uid){

            for(const child of row.children){
                if(child.uid==uid){
                    child.is_unsave = 1 ;
                    child.is_updated = 1 ;

                    return ;

                }
                if(child.children?.length){
                    this.updateChild(child,uid)
                }
            }

        } ,

        /**
         * ファイル削除
         */
        destroy : async function(row) {
            this.$emit("uploadFile",true)

            const found = this.value.t_project_files.find(x =>x.uid === row.uid) ;

            const idx = this.value.t_project_files.indexOf(found) ;
            const ep = `api/${this.apiName}/deleteFile`

            try{
                if ( row.id === undefined ) {
                    //strageに保存されたファイル削除
                    const res = await axios.post(ep ,row) ;

                    this.value.t_project_files.splice(idx ,1) ;

                }
                else {
                    
                    this.$set(this.value.t_project_files[idx] , "deleted_at" ,Date()) ;                    

                }
                const linkId = row.id ? row.id :row.uid ;

                //子のデータ削除
                if(row.is_folder) {
                    this.deleteChildren(found) ;
                } else {
                    this.deleteProductLink(linkId) ;
                }

            } catch {
                this.$$errorConsole(error ,ep ) ;
            }

            this.$emit("uploadFile",false) ;


        } ,

        //再帰的に子を削除
        deleteChildren : function(row) {
            const linkId = row.id ? row.id :row.uid ;
            const children = this.value.t_project_files.filter(x => x.parent_id == linkId) ;
            for(const y of children) {
                const productLink = y.id ? y.id : y.uid ;
                this.deleteProductLink(productLink) ;            
                this.$set(y , "deleted_at" ,Date()) ;
                if(y.children.length>0) this.deleteChildren(y) ;
            }
        } ,
        //商品との紐づけ解除
        deleteProductLink : function (linkId) {
            for(const x of this.value.t_project_products){
                const productLink = x.t_project_file_id ? x.t_project_file_id : x.t_project_file_uid
                if(productLink == linkId) {
                    x.t_project_file_uid = null;
                    x.t_project_file_id  = null;
                    delete x.t_project_files ;
                } 
            }
        } ,

        setThumbnail : function(row) {
            const idx = this.value.t_project_products.indexOf(this.productRow) ;
            delete this.value.t_project_products[idx].t_project_file_id ;
            delete this.value.t_project_products[idx].t_project_file_uid ;


            if(row.id) {
                // this.value.t_project_products[idx].t_project_file_id = file.id ;

                this.$set(this.value.t_project_products[idx] , "t_project_file_id" ,row.id) ;
                
            } else {
                this.$set(this.value.t_project_products[idx] , "t_project_file_uid" ,row.uid) ;            
            }
            this.$set(this.value.t_project_products[idx] , "t_project_file" ,row) ;
            this.$emit('close') ;


        } ,

        /**
         *　ディレクトリから親ファイルのUidを検索
         */
        searchParent : function(path) {
            const parentDir = this.cDropboxService.getDirName(path) ;
            const found = this.value.t_project_files.find(x => x.filepath == parentDir) ;
            return found ? found.uid : null ;
        } ,

        /**
         * フォルダツリー用リレーション
         */
        pushChild : function(row) {
            const parent  = this.value.t_project_files.find(x => x.uid === row.parent_id ) ;
            const parentIdx = this.value.t_project_files.indexOf(parent) ;
            if ( parentIdx != -1 )  this.value.t_project_files[parentIdx].children.push(row) ;
        } ,

        /**
         *サーバ側通信進捗％取得
         */
        uploading : function(val) {
            // const val = Math.floor((event.loaded * 100) / event.total);
            const per = val === undefined ? 0 : val ;
            this.dProgressbarVal = "width:" + per + "%" ;
            this.dProgressbarRatio = val ;
            this.$emit("uploadFile",true)
            // console.log(this.dProgressbarVal)
        } ,

        /**
         * その他機能
         */
        test : async function() {
            try {
                // const resS = await this.cDropboxService.getAccessToken() ; 
                // console.log(resS) ; 
                // this.cDropboxService.getFileList("/public/attachment_files/t_project/T22060056")

                // const sharedLink = await this.cDropboxService.getSharedLink("/public/attachment_files/t_project/T22060056/220220608105409/パーカー印刷データ.pdf")
                // console.log(sharedLink) ;    
            }
            catch (error ) {
                this.$$errorConsole(error) ; 
            } 
            
        } , 

    } ,
    created : function() {
        // this.dFileCode = this.$$cLoginUserId +  DayJsEx.format(Date() , "YYYYMMDDHHmmss") ;
    }
}
</script>
<style scoped>
</style>