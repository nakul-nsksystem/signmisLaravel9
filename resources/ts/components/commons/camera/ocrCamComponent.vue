<template>
    <div>
        <div class="row">            
            <div class="col-12" v-show="state.isCamMode">
                <div class="canvas-container">
                    <canvas 
                        class="canv" 
                        ref="canvas"
                        >
                    </canvas>
                    <button type="button" class="btn btn-primary w-100 mt-0" @click.prevent="!cIsStartedCam ? startCam() : takePic() ">
                        <i class="fas fa-camera fa-fw"></i>
                    </button>
                </div>
            </div>

            <div class="col-12" v-show="!state.isCamMode">
                <img-trim-component
                    v-model="state.img"
                    :url.sync="state.url"
                    :is-ready="!cIsStartedCam"
                    :img="state.video"
                    ref="trimComponent"
                    />
                <div class="mt-3" style="width:30%">
                    <img :src="state.url">
                </div>
            </div>
            
            <div class="col-12 text-right mt-3">
                 <button type="button" class="btn btn-primary" @click.prevent="emitImg">決定</button>
            </div>
        </div>
    </div>


    
</template>

<script lang="ts" setup>
import { computed, defineComponent, onBeforeUnmount, reactive ,ref} from 'vue'
import _ from 'lodash' ;
import NumberUtil from '../../../frameworks/NumberUtil'

interface IProps {
    value:any ,
}

const props = withDefaults(defineProps<IProps>(), {})

interface IEmits {
    (e:'update', value:any): void ;
    (e:'takePic', value:any): void ;
}

const emit = defineEmits<IEmits>() ;

const state = reactive<{
    video:any,
    reqAnimationId:number|undefined,
    vw:number,
    vh:number,
    img:Blob|undefined,
    url:string,
    isCamMode:boolean
}>({
    //カメラ情報
    video : undefined,
    //カメラ情報を描画する識別id
    reqAnimationId : undefined ,
    //カメラサイズ
    vw : 0 ,
    vh : 0 ,

    //トリム画像
    img : undefined,
    url : "",

    //カメラ・トリムモード切り替えフラグ
    isCamMode : true ,
})

//画面上描画されているカメラの映像
const canvas = ref<HTMLCanvasElement|null>(null)
const trimComponent = ref<any>()

//カメラがスタートしているかのフラグ
const cIsStartedCam = computed(() => state.reqAnimationId !== undefined)

/**仮想DOMにてカメラ起動 */
function startCam () {
    state.video = document.createElement("video")
    const cam = navigator.mediaDevices.getUserMedia({
        video : {
            // width :{ min:0, ideal:window.innerWidth }, 
            // height : { min:0, ideal:window.innerWidth }, 
            width: {ideal: 1280 },
            height: {ideal: 1024 },
            // aspectRatio :1 ,
            //@ts-ignore
            focusMode: "continuous" ,
            facingMode : "environment" ,
        } ,
    })
    cam.then(function(mediaStream) {
        state.vw = mediaStream.getVideoTracks()[0].getSettings().width ?? 0,
        state.vh = mediaStream.getVideoTracks()[0].getSettings().height ?? 0,
        state.video.srcObject = mediaStream ;
        state.video.setAttribute("playsinline", true) ;
        state.video.setAttribute("autoplay", "") ;
        state.video.setAttribute("muted", "") ;
        state.video.play() ;
        displayCamView() ;

    })
}

/**カメラの情報を画面に描画 */
function displayCamView (){

    if(_.isNil(canvas.value)) return ;
    
    canvas.value.width = state.vw ;
    canvas.value.height = state.vh ;
    const context = canvas.value.getContext("2d",{ willReadFrequently: true });
    //カメラの情報を取得して画面に描画
    const drawCam = (() => {
        if(!_.isNil(context) && !_.isNil(state.video)) {
            context.drawImage(state.video, 0, 0, state.vw, state.vh,);
            const imageData = context.getImageData(0, 0, state.vw, state.vh);
            state.reqAnimationId = requestAnimationFrame(drawCam) ;
        } 
    })
    drawCam()
    
}

//写真撮影
function takePic () {
    //カメラを一時停止
    state.video.pause();     
    
    //カメラの情報を画面に描画する処理を停止
    if(state.reqAnimationId !== undefined) {
        cancelAnimationFrame(state.reqAnimationId);
        state.reqAnimationId = undefined ;
    }
    
    state.isCamMode = false ;

    trimComponent.value._setupProxy.setCanvSize(state.vw,state.vh)

}


//トリムした画像を親にemit
function emitImg () {
    if(state.img === undefined) return ;
    emit('takePic',state.img) ;
}

//カメラ停止
function stopCam (){
    const tracks = state.video.srcObject.getTracks();
    tracks.forEach((track:any) => track.stop());

    if(state.reqAnimationId !== undefined) {
        cancelAnimationFrame(state.reqAnimationId);
    }

    state.video = undefined;
    state.reqAnimationId = undefined;
}
//コンポーネント破棄前にカメラを閉じる
onBeforeUnmount(() => stopCam())
        

</script>


<style scoped>
.canvas-container{
    
    width: 100%;
    text-align:center;

}
.canv {

    display: inline;
    width: 100%;


}


</style>