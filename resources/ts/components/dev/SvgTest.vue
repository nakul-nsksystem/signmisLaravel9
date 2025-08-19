<template>
    <div>
        <div class="row">
            <div class="col-12 col-xl-3">
                AA
            </div>

        </div>
        <div class="row">
            <div class="col-12">
                <div class="accordion" id="accordionContainer">
                    
                    <div class="card bg-dark text-white">
                        <div class="card-header" >
                            <h5 class="mb-0">
                                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseArrow" 
                                    aria-expanded="true" aria-controls="collapseArrow">
                                コンポーネント
                                </button>
                            </h5>
                        </div>

                        <div id="collapseArrow" class="collapse show" data-parent="#accordionContainer">
                            <div class="card-body">
                                <h5>矢印</h5>
                                <div class="row">
                                    <div class="col-3">
                                        <div class="row px-3 pb-3">
                                            <span>X1</span>
                                            <ns-number-input 
                                                class="app-input-size ml-3 mr-3"
                                                v-model="dArrow.x1" />
                                            <span>Y1</span>
                                            <ns-number-input 
                                                class="app-input-size ml-3"
                                                v-model="dArrow.y1" />
                                        </div>
                                    </div>
                                   <div class="col-3">
                                        <div class="row px-3 pb-3">
                                            <span>X2</span>
                                            <ns-number-input 
                                                class="app-input-size ml-3 mr-3"
                                                v-model="dArrow.x2" />
                                            <span>Y2</span>
                                            <ns-number-input 
                                                class="app-input-size ml-3"
                                                v-model="dArrow.y2" />
                                        </div>
                                    </div>
                                    
                                   <div class="col-12">
                                        <div class="row px-3 pb-3">
                                            <span>ArrowLength</span>
                                            <ns-number-input 
                                                class="app-input-size ml-3 mr-3"
                                                v-model="dArrow.arrowLength" />
                                            <span>Arrow Angle</span>
                                            <ns-number-input 
                                                class="app-input-size ml-3 mr-3"
                                                v-model="dArrow.arrowAngle" />
                                            <span>StrokeWidth</span>
                                            <ns-number-input 
                                                class="app-input-size ml-3 mr-3 "
                                                v-model="dArrow.strokeWidth" />
                                            <span>Stroke</span>
                                            <input class="form-input"
                                                v-model="dArrow.stroke" />
                                        </div>
                                    </div>


                                </div>
                                <div class="row">
                                    <svg>
                                        <ns-arrow-svg 
                                            :x1="dArrow.x1"
                                            :x2="dArrow.x2"
                                            :y1="dArrow.y1"
                                            :y2="dArrow.y2"
                                            :stroke-width="dArrow.strokeWidth"
                                            :arrow-length="dArrow.arrowLength"
                                            :arrow-angle="dArrow.arrowAngle"
                                            :stroke="dArrow.stroke"
                                        /> 
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card bg-dark text-white">
                        <div class="card-header" >
                            <h5 class="mb-0">
                                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseBasicFigure" 
                                    aria-expanded="true" aria-controls="collapseBasicFigure">
                                基本図形
                                </button>
                            </h5>
                        </div>

                        <div id="collapseBasicFigure" class="collapse" data-parent="#accordionContainer">
                            <div class="card-body">
                                <svg-test-basic-figures />
                            </div>
                        </div>
                    </div>

                    <div class="card bg-dark text-white">
                        <div class="card-header" >
                            <h5 class="mb-0">
                                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapsePathFigure" 
                                    aria-expanded="true" aria-controls="collapsePathFigure">
                                パス図形
                                </button>
                            </h5>
                        </div>

                        <div id="collapsePathFigure" class="collapse " data-parent="#accordionContainer">
                            <div class="card-body">
                                <svg-test-path-figures />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        
    </div>    
</template>


<script>


export default {        
    data : function() {
        return {
            dArrow : {
                x1 : 100 , 
                y1 : 100 ,
                x2 : 100 , 
                y2 : 10 ,
                arrowLength : 40 , 
                arrowAngle : 30 , 
                strokeWidth : 2 , 
                stroke : "palegreen"

            } ,
            dPathFigure : {
                line : {
                    x1 : 0 ,
                    y1 : 0 ,
                    x2 : 0 ,
                    y2 : 0 ,
                    color : "black" ,
                } , 
            } , 
        }         
    } ,
    
    computed : {
        

    } ,
    methods : {
    } ,
    created : function()
    {
        
        
    }
    
} 
</script>