<template>
    <div>
        <div class="row">
            <div class="col-12 col-xl-3">
                <div class="row">
                    <div class="col-12">
                        <div class="row px-3 pb-3">
                            <span>W</span>
                            <ns-number-input 
                                class="app-input-size ml-3 mr-3"
                                v-model="dCanvasW" />
                            <span>H</span>
                            <ns-number-input 
                                class="app-input-size ml-3"
                                v-model="dCanvasH" />
                        </div>


                    </div>
                </div>

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
                            :x1="dCanvasW / 2" :y1="'0'"
                            :x2="dCanvasW / 2" :y2="dCanvasH" 
                            fill="transparent"
                            stroke="gray" stroke-width="2" />
                        <line 
                            :x1="'0'" :y1="dCanvasH / 2"
                            :x2="dCanvasW" :y2="dCanvasH / 2" 
                            fill="transparent"
                            stroke="gray" stroke-width="2" />
                        <path 
                            :d="dPath.d"
                            :stroke="dPath.stroke"
                            fill="transparent" stroke-width="10"/>
                            
                        <path 
                            :d="cPathD"
                            stroke="red"
                            fill="transparent" stroke-width="10"/>
                    </g>
                </svg>


            </div>
            <div class="col-12 col-xl-9">
                <h5>Path</h5>
                <div class="row">
                    <div class="col-12 col-xl-3">
                        <div class="form-group" >
                            <label>線色</label>                
                            <input class="form-control" v-model="dPath.stroke" />                        
                        </div>                        
                    </div>
                    <div class="col-12 col-xl-9 ">
                        <div class="form-group" >
                            <label>パス文字列</label>                
                            <input class="form-control" v-model="dPath.d" />  
                            {{cPathD}}                                                       
                        </div>                        
                    </div>
                    <div class="col-12">

                    </div>

                </div>

                <div class="row">
                    <div class="col-4">
                        <div class="card bg-dark text-white">
                            <div class="card-header" >
                                <h5 class="mb-3">Arc楕円円弧曲線</h5>
                                
                                
                                        <div class="form-group" >
                                            <label>リンク</label>                
                                            <input type="checkbox"  v-model="dIsLinkPahtArc" />                                                         
                                        </div>                        
                            </div>
                            <div class="card-body">
                                
                                <span>開始座標</span> 
                                <div class="row px-3 pb-3">
                                    

                                    <span>X</span>
                                    <ns-number-input 
                                        class="app-input-size ml-3 mr-3"
                                        v-model="dArc.sx" />
                                    <span>Y</span>
                                    <ns-number-input 
                                        class="app-input-size ml-3"
                                        v-model="dArc.sy" />
                                </div>


                                <span>半径(X,Yの比率)</span> 
                                <div class="row px-3 pb-3">
                                    

                                    <span>rX</span>
                                    <ns-number-input 
                                        class="app-input-size ml-3 mr-3"
                                        v-model="dArc.rx" />
                                    <span>rY</span>
                                    <ns-number-input 
                                        class="app-input-size ml-3"
                                        v-model="dArc.ry" />
                                </div>

                                <div class="row">
                                    <div class="col-12 ">
                                        <div class="form-group" >
                                            <label>角度</label>                
                                            <ns-number-input class="app-input-size" v-model="dArc.angle" />                                                         
                                        </div>                        
                                    </div>

                                </div>

                                <div class="row">
                                    <div class="col-12 ">
                                        <div class="form-group" >
                                            <label>大きい円弧</label>                
                                            <input type="checkbox"  v-model="dArc.isBigArc" />                                                         
                                        </div>                        
                                    </div>

                                </div>
                                <div class="row">
                                    <div class="col-12 ">
                                        <div class="form-group" >
                                            <label>時計回り</label>                
                                            <input type="checkbox"  v-model="dArc.isClockWise" />                                                         
                                        </div>                        
                                    </div>

                                </div>
                                
                                <div class="row px-3">
                                    <span class="h5">dx</span>
                                    <ns-number-input 
                                        class="app-input-size ml-3 mr-3"
                                        v-model="dArc.dx" />
                                    <span class="h5">dy</span>
                                    <ns-number-input 
                                        class="app-input-size ml-3"
                                        v-model="dArc.dy" />
                                </div>


                                {{cArcD}}

                            </div>
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
import SamplesListComponent from '../../samples/SamplesListComponent.vue';


export default {
  components: { SamplesListComponent },        
    data : function() {
        return {
            dBaseLength : 500 , 
            dSvgMargin : 2 , 

            dCanvasW : 5000 ,
            dCanvasH : 5000 ,

            dIsLinkPahtArc : false , 

            dPath : {
                d : "M 100,100 L 900,900 V 100 H 500" ,
                stroke : "black" ,                
            } , 

            dArc : {
                // 開始座標
                sx : 2500 , 
                sy : 2500 , 
                // 半径
                rx : 1 , 
                ry : 1 , 
                angle : 0 , 
                isBigArc : true , 
                isClockWise : true , 
                dx : 3000 ,
                dy : 2500 ,
            }

        }         
    } ,
    
    computed : {

        cArcD : function() { 
            let path = `M ${this.dArc.sx },${this.dArc.sy } ` ;
            path += `A ${this.dArc.rx} ${this.dArc.ry} ${this.dArc.angle} ${this.dArc.isBigArc ? "1" : "0"} ` ; 
            path += `${this.dArc.isClockWise ? "1" : "0"} ${this.dArc.dx},    ${this.dArc.dy}` ; 
            return path ;
        } , 
        cPathD : function() { 
            if ( this.dIsLinkPahtArc) {
                return this.cArcD ; 
            }

            return this.dPath.d ; 
        } , 

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