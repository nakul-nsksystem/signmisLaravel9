<template>
    <div>
        <div class="row">            
            <!-- <div class="col-12 col-xl-6">
                <div class="canvas-container">                
                    <video class="canv" />
                </div>
            </div> -->
            <div class="col-12">
                <div class="canvas-container">
                    <canvas class="canv"></canvas>
                </div>
            </div>

            <div class="col-12 mt-3 text-right">
                <button type="button" class="btn btn-primary" @click.prevent="startCam">
                    <i class="fas fa-camera fa-fw"></i>
                </button>
                <button type="button" class="btn btn-secondary" @click.prevent="stopCam">
                    <i class="fas fa-stop fa-fw"></i>
                </button>
            </div>
        </div>
    </div>


    
</template>

<script>
import jsQR from "jsqr";
import _ from 'lodash' ;

export default {
    data : function(){
        return {

            //カメラDOM
            dVideo : undefined ,

            // dFrame : undefined ,

            dReqAnimationId : undefined ,


            //アス比
            dW : 1600 ,
            dH : 900 ,

        }
    },
    props : {
        
    } ,
    computed:{ 

    },
    methods : {

        startCam : function(){

            const _this = this
            
            /**仮想DOMにてカメラ起動 */
            this.dVideo = document.createElement("video")
            // this.dVideo = document.querySelector("video")

            const cam = navigator.mediaDevices.getUserMedia({
                video : {
                    // width :{ min:0, max:window.innerWidth }, 
                    // height : { min:0, max:window.innerWidth }, 
                    // width : this.dW , 
                    // height : this.dW , 
                    aspectRatio :1 ,
                    facingMode : "environment"
                } ,

            })

            cam.then(function(mediaStream) {

                _this.dVideo.srcObject = mediaStream ;
                _this.dVideo.setAttribute("playsinline", true) ;
                _this.dVideo.setAttribute("autoplay", "") ;
                _this.dVideo.setAttribute("muted", "") ;
	            _this.dVideo.play() ;
                _this.readQR() ;

            })

        } ,

        /**読み込み */
        readQR : function(){

            const _this = this ;
            
            const canv = document.querySelector("canvas");

            const scale = window.innerWidth * 0.8 
            // const w = window.innerWidth ;
            // const h = window.innerWidth ;
            const w = scale  * window.devicePixelRatio ;
            const h = scale * window.devicePixelRatio ;

            canv.width = w ;
            canv.height = h ;

            canv.style.width = String(canv.width / devicePixelRatio) + "px";
            canv.style.height = String(canv.height / devicePixelRatio) + "px";
            

            const context = canv.getContext("2d",{ willReadFrequently: true });
            
            const drawCam = (() => {
                if(!_.isNil(context) && !_.isNil(_this.dVideo)) {
                    context.drawImage(_this.dVideo, 0, 0, w, h,);
                    const imageData = context.getImageData(0, 0, w, h);
                    const code = jsQR(imageData.data, imageData.width, imageData.height);
                    if (code) {
                        //認識中のQRを赤線で囲む
                        this.drawRect(code.location ,context);
                        //親コンポーネントに取得した情報を返す
                        this.$emit('getQRData',code.data) ;
                    }
                    this.dReqAnimationId = requestAnimationFrame(drawCam)
                }
            })
            drawCam()

        } ,

        /**認識中のQRを赤線で囲む */
        drawRect : function(location ,ctx) {
            
            this.drawLine(location.topLeftCorner, location.topRightCorner ,ctx);
		    this.drawLine(location.topRightCorner, location.bottomRightCorner ,ctx);
		    this.drawLine(location.bottomRightCorner, location.bottomLeftCorner ,ctx);
		    this.drawLine(location.bottomLeftCorner, location.topLeftCorner ,ctx);

        } ,
        drawLine : function(bottom,top,ctx) {

            ctx.lineWidth = 4;
            ctx.strokeStyle = "#FF3B58";
            ctx.beginPath();
            ctx.moveTo(bottom.x, bottom.y);
            ctx.lineTo(top.x, top.y);
            ctx.stroke();

        } ,

        //カメラ停止
        stopCam : function(){
            if(this.dVideo === undefined) return ;
            const stream = this.dVideo.srcObject;
            const tracks = stream.getTracks();

            tracks.forEach((track) => track.stop());

            // clearInterval(this.dFrame);
            cancelAnimationFrame(this.dReqAnimationId) ;
            this.dVideo.srcObject = null;
        }


        
    } ,

    //コンポーネント破棄直前にカメラを閉じる
    beforeDestroy : function() {
        this.stopCam() ;
        
    } ,

    created(){

        // this.test() ;
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

}


</style>