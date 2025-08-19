<template>
    <div>
        <div class="row">
            <div class="col-12 col-xl-3">
                <svg :viewBox="cViewBox" >
                    <g :transform="`scale(${cScale})`">
                        <!-- 枠 -->
                        <rect 
                            :x="dSvgMargin" :y="dSvgMargin" 
                            :width="dCanvasW" :height="dCanvasH" 
                            fill="white" 
                            stroke="gray"  stroke-width="1"
                            />                    
                        <line 
                            :x1="dLine.x1" :y1="dLine.y1"
                            :x2="dLine.x2" :y2="dLine.y2"
                            :stroke="dLine.stroke"
                            fill="transparent" stroke-width="10"/>
                            
                    </g>
                </svg>


            </div>
            <div class="col-12 col-xl-3">
                <h5>Line</h5>
                <div class="row">
                    <div class="col-12">
                        <div class="form-group" >
                            <label>線色</label>                
                            <input v-model="dLine.stroke" />                        
                        </div>
                        
                    </div>
                    <div class="col-12">
                        <div class="form-group">                
                            <label >始点</label>                
                            <div class="row px-3">
                                <span class="h5">X</span>
                                <ns-number-input 
                                    class="app-input-size ml-3 mr-3"
                                    v-model="dLine.x1" />
                                <span class="h5">Y</span>
                                <ns-number-input 
                                    class="app-input-size ml-3"
                                    v-model="dLine.y1" />
                            </div>
                            <label >終点</label>                
                            <div class="row px-3">
                                <span class="h5">X</span>
                                <ns-number-input 
                                    class="app-input-size ml-3 mr-3"
                                    v-model="dLine.x2" />
                                <span class="h5">Y</span>
                                <ns-number-input 
                                    class="app-input-size ml-3"
                                    v-model="dLine.y2" />
                            </div>
                            {{dLine.minPos}}
                            {{dLine.maxPos}}

                        </div>


                    </div>

                </div>


            </div>
            <div class="col-12 col-xl-3">
                <h5>Rect</h5>
            </div>
        </div>
    </div>    
</template>


<script>
import NumberUtil from '../../../frameworks/NumberUtil'


export default {        
    data : function() {
        return {
            dBaseLength : 500 , 
            dSvgMargin : 2 , 

            dCanvasW : 5000 ,
            dCanvasH : 5000 ,


            dLine : {
                x1 : 100 ,
                y1 : 100 ,
                x2 : 2000 ,
                y2 : 1000 ,
                stroke : "black" ,
                get minPos () {
                    return {
                        x : Math.min(this.x1 ,this.x2) ,
                        y : Math.min(this.y1 ,this.y2) ,
                    }
                } , 
                get maxPos()  {
                    return {
                        x : Math.max(this.x1 ,this.x2) ,
                        y : Math.max(this.y1 ,this.y2) ,
                    }
                } , 

                
            } , 

        }         
    } ,
    
    computed : {

        cViewBox : function() {
            const lengthIncMargins = this.dBaseLength + this.dSvgMargin * 2 ;
            
            const hPer = NumberUtil.invalid2zr( this.cDisplayH / this.cDisplayW)  ; 
            let hIncMargins = 0  ; 
            if ( hPer == 0 ) {
                hIncMargins = lengthIncMargins ;
            }
            else {
                hIncMargins = hPer * this.dBaseLength + this.dSvgMargin * 2 ; 
            }
            //console.log("hIncMargins : " + `0 0 ${lengthIncMargins} ${hIncMargins}`)  ; 
            
            return `0 0 ${lengthIncMargins } ${hIncMargins}` ;
        } ,        
        
        cScale : function() {
            const longer = Math.max(this.dCanvasW , this.dCanvasH) ; 
            const scale = NumberUtil.invalid2zr(this.dBaseLength / longer)  ; 
            //console.log("scale : " + scale) ; 
            return scale ; 
        } ,

    } ,
    methods : {
    } ,
    created : function()
    {
        
        
    }
    
} 
</script>