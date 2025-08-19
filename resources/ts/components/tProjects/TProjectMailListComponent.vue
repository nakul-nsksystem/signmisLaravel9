<template>
    <div class="bg-app-secondaly">
        <div
            @dragenter="dragEnter" 
            @dragleave="dragLeave" 
            @dragover.prevent 
            @drop.prevent="dropMail"
            style="min-height:100px"
            :class="{'dark-deep-selected':IsEnter }"
            >
            <div class="p-2 ">
                <div class="accordion" id="accordionMail">
                    <div v-show="$$cIsError" class="alert alert-danger" role="alert">
                        {{dErrorData.message}}
                    </div>
                    <div v-if="state.dLoading" class="p-4 mb-0">
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        アップロード中...
                    </div>
                    <p v-else class="p-4 mb-0">メールをドロップ</p>                    
                    <div class="card bg-dark " v-for="n in cTProjectMails" :key="n.uid">
                        <div class="card-header" :id="'heading'+ n.uid">                            
                            <div class="row">                                
                                <div class="flex-fill">                                                                        
                                    <button 
                                        class="btn btn-link" 
                                        type="button" 
                                        data-toggle="collapse" 
                                        :data-target="'#collapse' + n.uid" 
                                        aria-expanded="false" 
                                        :aria-controls="'collapse' + n.uid"
                                        >
                                        <h5 class="mb-0">{{n.subject}}</h5>                                
                                    </button>
                                    
                                </div>
                                
                                <div class="text-left text-xl-right ml-3 ml-xl-0 mr-2 mb-1 mb-xl-0" style="min-width:150px;">
                                    <button type="button" 
                                        class="btn btn-info"
                                        >
                                    添付 <span class="badge badge-light">{{n.t_project_files.length}}</span>
                                    </button>
                                    <button 
                                        type="button" 
                                        class="btn btn-dark"
                                        :disabled="state.dLoading"
                                        @click.prevent="download(n)" 
                                        >
                                        <i class="fas fa-download fa-fw"></i>
                                    </button>
                                    <button type="button" class="btn btn-danger" @click.prevent="destroy(n)">
                                        <i class="fas fa-trash fa-fw"></i>                            
                                    </button>
                                </div>
                            </div>
                            <div class="row ml-0">
                                <div style="width:200px;">
                                    {{n.received_at}}
                                </div>
                                <div class="flex-fill" >
                                    <div class="row">
                                        <div class="col-12 col-xl-4">
                                            From {{n.from}}
                                        </div>
                                        <div class="col-12 col-xl-4">
                                            To {{n.to}}
                                        </div>                                
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div 
                            :id="'collapse' + n.uid" 
                            class="collapse" 
                            :aria-labelledby="'heading' + n.uid" 
                            data-parent="#accordionMail"
                            >
                            <div class="card-body" style="white-space:pre-line;">
                               {{n.body}}
                            </div>
                            <div class="row">
                                <div v-for="i in cFiles(n)" :key="i.uid" class="col-12 col-xl-4 mt-2">
                                    <ThumbnailFrameComponent
                                        :base64="i.base64_thumbnail"
                                        :path="i.filepath"
                                        :filesize="i.filesize"
                                        :extension="i.extension"
                                        :isNeedToPreview="true"
                                        />
                                    <div class="d-flex">
                                        <p class="mx-auto mx-auto font-weight-bold">{{i.filename}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                    </div>
                </div>
            </div>
        </div>

    </div>

    
</template>
<style scoped>

</style>

<script lang="ts" setup>
import Vue, { ref,computed ,reactive ,getCurrentInstance} from 'vue';
import _ from 'lodash'
import axios  from 'axios'  
import DayJsEx from "./../../frameworks/DayJsEx" ;
import NumberUtil from "./../../frameworks/NumberUtil" ;
import { TProject } from './class/models/TProject'
import { TProjectMail } from './class/models/TProjectMail'
import { useDropboxStore } from '../../stores/dropboxStore'

    interface IProps {
        value: TProject ,
    }

    const props = withDefaults(defineProps<IProps>(), {
    })


    //vue2のthisを取得
    const _this = getCurrentInstance()?.proxy ;
    const dropboxStore = useDropboxStore() ;

    const apiName = "tProjectMail" ;
    
    const state = reactive({
        // dMail : Array() ,
        dProgressbarVal : "width:0%" ,
        dProgressbarRatio : 0 ,
        dLoading : false ,

    }) ;

    const cEndpoint = computed(() => `api/${apiName}/getInfoByEml` ) ;

    //deleted_at考慮
    //@ts-ignore
    const cTProjectMails = computed(() => props.value.t_project_mails.filter(x => x.deleted_at == null)) ;

    const cMailUids = computed( () => {
        //idとuid間でも重複起きないように
        const uids = props.value.t_project_mails.map(x => x.uid ) ;
        const ids = props.value.t_project_mails.map(x => x.id ) ;
        //@ts-ignore
        const result = uids.concat(ids) ;
        return result.filter(x => !_.isNil(x)) ;
    })
    const cFileUids = computed( ()=>{
        //idとuid間でも重複起きないように
        //@ts-ignore
        const uids = props.value.t_project_files.map(x => x.uid ) ;
        //@ts-ignore
        const ids = props.value.t_project_files.map(x => x.id ) ;
        //@ts-ignore
        const result = uids.concat(ids) ;
        return result.filter(x => !_.isNil(x)) ;
    })

    const cFiles = computed(() => {
        return (tMail:TProjectMail ) => {
            if(_.isNil(tMail.id)) {
                //@ts-ignore
                return props.value.t_project_files.filter( x => x.t_project_mail_uid == tMail.uid)
            } 
            else {
                //@ts-ignore
                return props.value.t_project_files.filter( x => x.t_project_mail_id == tMail.id)                
            }
        }
    })
    const IsEnter = ref(false) ;
    const counter = ref(0) ;

    function dragEnter () {
        counter.value++;        
        IsEnter.value = true 
    } 
    function dragLeave()  {
        counter.value--;
        if (counter.value === 0) { 
            IsEnter.value = false
        }
    }
    function dragOver() {
        // console.log('DragOver') ;
    }

    async function dropMail (event:any) {
        // console.log('Dropped') ;
        IsEnter.value = false
        counter.value = 0
        state.dLoading = true ;
        const eml = event.dataTransfer.files[0] ;
        let mailName = eml.name ;
        //emlしかアップロード出来ないようにチェック
        if(!checkExtention(mailName)) {
            const str = validExtensions.join(',');
            alert(`拡張子が${str}以外のファイルはアップロード出来ません`)
            state.dLoading = false ;
            // state.dMail = Array() ;
            return ;
        }

        let mail = new FormData() ;
        mail.set('mail' , eml) ;
        
        try {                
            const res = await axios.post(cEndpoint.value ,mail,{onUploadProgress : uploading}) ;
            const resList = _.cloneDeep(res.data) ;

            //メール側のt_project_filesの不要な情報トリム
            resList.t_project_files.splice(0) ;
            
            //t_project_files紐づけ用のuidを生成
            const mailUid = generateUId(true) ;

            //添付ファイルはt_project_files側で扱う。メール側では一致するid(uid)で読み取りだけ
            if(res.data.t_project_files.length > 0) {
                for(const file of res.data.t_project_files) {

                    file.t_project_mail_uid = mailUid ;
                    file.uid = generateUId(false) ;
                    
                    const param = {
                        path : file.filepath ,
                        filesize:file.filesize ,
                        extension:file.extension ,
                        token:undefined ,
                        resolution:'w480h320' ,
                    }
                    //サムネイル取得
                    file.base64_thumbnail = await dropboxStore.dropboxService.getBase64Thumbnail(param);

                    file.t_project_id = props.value.id ?? null ;
                    file.children = [] ;
                    file.modified = dateFormat(resList.received_at) ;
                    file.m_tags = [] ;

                    //@ts-ignore
                    props.value.t_project_files.push(file) ;
                    
                    //t_project_mailsf側に必要なid情報だけ渡す
                    resList.t_project_files.push({
                        id :null ,
                        uid : mailUid ,
                    })
                }
            }
            
            resList.uid = mailUid ;
            
            resList.received_at = dateFormat(resList.received_at) ;
            resList.mailname = mailName ;

            const parsed = TProjectMail.parse(resList)

            props.value.t_project_mails.push(parsed) ;

        }
        catch (error)  {
            //@ts-ignore
            _this.$$errorConsole(error ,cEndpoint.value ) ; 
        } 
        finally {
           state.dLoading = false ;
        //    state.dMail = Array() ;
        }

        
    }
    function destroy  (row:TProjectMail) {
        if(! confirm('削除してもよろしいですか?')) return ; 
        const idx = props.value.t_project_mails.indexOf(row) ; 

        if(idx == -1 ) return ;
        let isDelteWithFiles = false ;

        if(!_.isEmpty(row.t_project_files)) {
            if(confirm('添付ファイルも削除しますか?')) isDelteWithFiles = true ; 
        }

        if ( row.id === undefined ) {
            props.value.t_project_mails.splice(idx ,1) ;
            if(isDelteWithFiles) deleteFiles(row)
        }
        else {
            //@ts-ignore
            // _this.$set(props.value.t_project_mails[idx],"deleted_at" ,Date())
            props.value.t_project_mails[idx].deleted_at = Date() ;      
            if(isDelteWithFiles) deleteFiles(row)
            //this.value.t_project_mails.splice(idx ,1) ;

        }
        
    }

    async function download (mail:TProjectMail) {
        //保存前のmailをダウンロードしようとするとpathの形式が違ってエラー出るので回避処理
        const mailpath = _.isNil(mail.id) ? "/" + mail.mailpath : mail.mailpath as string ;
        await dropboxStore.dropboxService.downloadFile(mailpath) ;

    }

    function deleteFiles (row:TProjectMail) {
        
        //idを持っているか
        const isNew = _.isNil(row.id)
        for(const tFile of props.value.t_project_files ) {
            if(isNew) {
                //@ts-ignore
                if(tFile.t_project_mail_uid == row.uid) {
                    const deleteIdx = props.value.t_project_files.indexOf(tFile) ;
                    if(deleteIdx != -1 ) props.value.t_project_files.splice(deleteIdx,1)
                }
            } else {
                //@ts-ignore
                if(tFile.t_project_mail_id == row.id) {
                    //@ts-ignore
                    tFile.deleted_at = Date() ;
                }
            }
        }
    }

    function dateFormat(value:Date){    
        if(_.isNil(value)) return "" ;
        return DayJsEx.format(value , "YYYY-MM-DD HH:mm:ss")
    }

    //ドロップできる拡張子を制限
    const validExtensions = ["eml"];
    
    //dropされたファイルの拡張子をチェックする
    function checkExtention(filename:string) : boolean {
        const postfix = filename.lastIndexOf('.');

        if (postfix === -1) return false ;
        const extension =  filename.slice(postfix + 1).toLowerCase();
        
        return validExtensions.indexOf(extension) !== -1;
    }

    

    /**uid 付番 */
    function generateUId (isMali:boolean) {
        const uidArr = isMali ? cMailUids.value : cFileUids.value ;
        let uid = Math.floor(Math.random() * (1000 - 1)) + 1 ;
        while(uidArr.indexOf(uid) !== -1) {
            uid = Math.floor(Math.random() * (1000 - 1)) + 1 ;
        }

        return uid ;

    } 

    /**
     *サーバ側通信進捗％取得
        */
    function uploading(event:any) {
        const val = Math.floor((event.loaded * 100) / event.total);
        state.dProgressbarVal = "width:" + val + "%" ;
        state.dProgressbarRatio = val ;
        // console.log(this.dProgressbarVal)
    } 




</script>
