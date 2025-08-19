<template>
    <div class="canvas-container">
        <canvas 
            class="canv" 
            ref="canvas4Trim"
            @mousedown.prevent="onMouseDown"
            @mousemove.prevent="onMouseMove" 
            @mouseup.prevent="onMouseUp" 
            @wheel.prevent="onWheel"
            @touchstart.prevent="onMouseDown"
            @touchmove.prevent="onMouseMove"
            @touchend.prevent="onMouseUp"
            >
        </canvas>
    </div>
</template>

<script lang="ts" setup>
import { computed, reactive ,ref} from 'vue'
import _ from 'lodash' ;
import NumberUtil from '../../../frameworks/NumberUtil'

interface IProps {
    //結果
    value?:any ,
    url?:string
    img:any,
    //トリミングしたい寸法
    trimW?:number,
    trimH?:number,

    //タッチイベントなどを起こしたくないタイミングではfalseを指定
    isReady?:boolean,

}

const props = withDefaults(defineProps<IProps>(), {
    img:undefined,
    trimW:300,
    trimH:150,
    isReady:true,
})

interface IEmits {
    (e:'input', value:any): void ;
    (e:'update:url', value:string): void ;
}

const emit = defineEmits<IEmits>() ;

//画面上描画されているカメラの映像
const canvas4Trim = ref<HTMLCanvasElement|null>(null)
const ix = ref(0)
const iy = ref(0)

//拡大縮小倍率
const scale = ref(1) ;
const cW = computed(() => {
    return canvas4Trim.value!.width ;
})
const cH = computed(() => {
    return canvas4Trim.value!.height ;
})

function setCanvSize (x:number,y:number) {
    if(_.isNil(canvas4Trim.value)) return;
    canvas4Trim.value.width = x ;
    canvas4Trim.value.height = y ;
    
    ix.value = x / 2
    iy.value = y / 2 
    drawTrimArea(ix.value,iy.value)
}

//撮影した写真とトリミング用の赤枠エリア描画
function drawTrimArea(x:number,y:number){
    if(_.isNil(canvas4Trim.value)) return;

    const ctx = canvas4Trim.value.getContext( '2d',{ willReadFrequently: true } )
    ctx!.fillStyle = 'rgb(200, 200, 200)'
    ctx!.fillRect( 0, 0, canvas4Trim.value.width, canvas4Trim.value.height ) 

    ctx!.drawImage( props.img,
        0, 0, cW.value, cH.value, 
        (canvas4Trim.value.width/2)-x*scale.value, 
        (canvas4Trim.value.height/2)-y*scale.value, 
        cW.value*scale.value, cH.value*scale.value
    ) ;
    ctx!.strokeStyle = "#FF3B58";
    ctx!.lineWidth = 2;
    ctx!.strokeRect( (canvas4Trim.value.width - props.trimW)/2, (canvas4Trim.value.height-props.trimH)/2, props.trimW, props.trimH ) ;
    trimImg()
}

//トリミングされた画像を描画
function trimImg () {   

    const img = document.createElement("canvas")
    const ctx = img.getContext('2d') 
    ctx!.fillStyle = 'rgb(200, 200, 200)'
    ctx!.fillRect( 0, 0, props.trimW, props.trimH ) 
    ctx!.drawImage( props.img,
        0, 0, cW.value, cH.value, 
        (props.trimW/2)-ix.value*scale.value, 
        (props.trimH/2)-iy.value*scale.value, 
        cW.value*scale.value, cH.value*scale.value
    ) ;

    img.toBlob((blob:any) => {
        emit('update:url',URL.createObjectURL(blob)) ;
        emit('input',blob) ;
    }, 'image/jpeg') ;
    
}

//撮影した写真のタッチ・クリック中フラグ
const isMouseDown = ref(false) ;

//クリック起点座標x
const sx = ref(0) ;
//クリック起点座標y
const sy = ref(0) ;

//撮影した写真のタッチ・クリック
function onMouseDown (event:MouseEvent|TouchEvent) {
    if(!props.isReady || props.img == undefined) return ;
    isMouseDown.value = true ;
    //クリック
    if(event.type == 'mousedown'){
        //@ts-ignore
        sx.value = event.pageX ;
        //@ts-ignore
        sy.value = event.pageY ;
    } 
    //タッチ
    else {
        //@ts-ignore
        sx.value = event.changedTouches[0].pageX ;
        //@ts-ignore
        sy.value = event.changedTouches[0].pageY ;

    }

}



//タッチ移動・マウスドラッグ・ピンチインアウト
function onMouseMove (event:MouseEvent|TouchEvent) {
    if(!props.isReady || props.img == undefined || !isMouseDown.value ) return ;
    let x ;
    let y ;
    //クリック
    if(event.type == 'mousemove'){
        //@ts-ignore
        x = event.pageX ;
        //@ts-ignore
        y = event.pageY ;
    } 
    //タッチ
    else {
        //ピンチイン・ピンチアウト
        //@ts-ignore
        if(event.targetTouches.length > 1) {
            //@ts-ignore
            x = event.targetTouches[0].pageX ;
            //@ts-ignore
            y = event.targetTouches[0].pageY ;
            //@ts-ignore
            const x2 = event.targetTouches[1].pageX ;
            //@ts-ignore
            const y2 = event.targetTouches[1].pageY ;
            const distance = Math.sqrt( Math.pow( x2-x, 2 ) + Math.pow( y2-y, 2 ) ) ;
            pinch(distance)
            return ;
        } 
        else {
            //@ts-ignore
            x = event.changedTouches[0].pageX ;
            //@ts-ignore
            y = event.changedTouches[0].pageY ;
        }
    }
    
    drawTrimArea( ix.value + (sx.value-x)/scale.value, iy.value + (sy.value-y)/scale.value )
}

//最終タッチ座標距離（ピンチ処理で使用）
const lTDistance = ref(0) ;
//zoom倍率
const mouseZoomCoef = 0.05 ;
const pinchZoomCoef = 0.5 ;

//マウスホイールでズーム
function onWheel (event:any) {
    if(!props.isReady || props.img == undefined) return ;
    scale.value = NumberUtil.invalid2zr(scale.value * 100 + event.wheelDelta * mouseZoomCoef) * 0.01 ;
    drawTrimArea( ix.value , iy.value )
}

//ピンチインアウトでズーム
function pinch (distance:number) {
    const val = distance - lTDistance.value ;
    if(val !== distance) {
        scale.value = NumberUtil.invalid2zr(scale.value * 100 +  val * pinchZoomCoef) * 0.01 ;
        drawTrimArea( ix.value , iy.value )
    }
    lTDistance.value = distance ;
}


//タッチ離す・マウスクリック離す
function onMouseUp (event:MouseEvent|TouchEvent) {
    if(!props.isReady || props.img == undefined || !isMouseDown.value) return ;
    let x ;
    let y ;
    if(event.type == 'mouseup'){
        //@ts-ignore
        x = event.pageX ;
        //@ts-ignore
        y = event.pageY ;
        isMouseDown.value = false ;
    } 
    else {
        lTDistance.value = 0 ; 
        //@ts-ignore
        if(event.targetTouches.length >= 1 ) return ;
        isMouseDown.value = false ;
        //@ts-ignore
        x = event.changedTouches[0].pageX ;
        //@ts-ignore
        y = event.changedTouches[0].pageY ;
        
    }
    drawTrimArea( ix.value += (sx.value-x)/scale.value, iy.value += (sy.value-y)/scale.value )

    if(!isMouseDown.value) {
        sx.value = 0
        sy.value = 0
    }

}

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