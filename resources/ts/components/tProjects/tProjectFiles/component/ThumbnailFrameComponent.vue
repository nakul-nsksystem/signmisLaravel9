<template>
    <div>
        <div class="d-flex" style="height:20rem;" @click.prevent="previewThumbnail">
            <img class="align-self-center img-fluid img-thumbnail mx-auto" style="max-height:20rem;" :src="cBase64Path">
        </div>            
        <!--　商品サムネイル紐づけの時はプレビューが存在しないようにしておく-->
        <div v-if="isNeedToPreview">
            <transition name="fade">
                <div class="preview-wrap" v-show="dOpenPreview" @click.prevent="dOpenPreview=false">
        
                    <div v-if="dThumbnailData == undefined" class="position-absolute vh-100 d-flex justify-content-center align-items-center" style="left:50%;">
                        <span class="spinner-border text-primary" style="opacity:1" />
                    </div>
                    <div class="position-absolute vh-100 d-flex justify-content-center align-items-center ">
                        <img class="preview" :src="dThumbnailData"> 
                    </div>

                </div>
            </transition>
        </div>
        
    </div>
</template>

<script>

export default {
    
    data : function () {
        return {
            dOpenPreview : false ,
            dThumbnailData : undefined ,
        }
    } ,
    props : {

        base64 : {
            type : String ,
            default : () => "img/noimage.png" ,
        } ,
        path : {
            type : String ,
        } ,
        filesize : {
            type : Number ,
        } ,
        extension : {
            type : String ,
        } ,
        //preview機能が必要フラグ
        isNeedToPreview : {
            type : Boolean,
            default : () => false ,
        } ,

    }, 
    computed : {
        cDropboxService(){
            const service = this.dropboxStore.dropboxService ; 
            return service ; 
            
        }  ,
        cBase64Path : function(){
            if(this.base64 == "img/noimage.png" || this.base64 == "img/folder.jpeg") return this.base64 ;
            return "data:image/jpeg;base64," + this.base64 ;
        } ,

        //プレビューしない状態
        cIsNeedToPreview : function(){
            return this.isNeedToPreview && this.base64 != "img/noimage.png" ;
        }

    } ,
    methods : {        
        /**
         * サムネイルプレビュー表示
         */
        previewThumbnail : async function(){
            //商品紐づけ画面の時はプレビューしない
            if(!this.cIsNeedToPreview) return ;

            this.dOpenPreview = true ;

            const thumbnailParams = {

                path : this.path,
                filesize : this.filesize ,
                extension : this.extension ,
                token : undefined ,  
                resolution : "w960h640" , 
            
            }
            // console.log(this.row)
            //初回のみドロップボックスに接続して取得する
            if( this.dThumbnailData === undefined ) {
                
                try {
                    
                    const res = await this.cDropboxService.getBase64Thumbnail(thumbnailParams) ;
                    
                    if(res == "img/noimage.png" || res == undefined) {
                        
                        this.dThumbnailData = "img/noimage.png"
                    
                    } else {

                        this.dThumbnailData = "data:image/jpeg;base64," + res ;

                    }

                } catch (error) {

                    this.$$errorConsole(error) ;

                }
            }

            

        } ,


        //preview画像のクリア
        //ファイルのデータ等の更新があった際など
        clearPreviewData : function(){
            this.dThumbnailData = undefined ;
        }


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
    /* top:25%; */
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