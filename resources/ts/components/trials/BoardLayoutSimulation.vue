<template>
    <div>
        <div class="row">                                
            <div class="col-12 col-xl-4 d-flex">                
                <div  style="flex-basis:240px;">
                    <div class="form-group">                
                        <label>製品サイズ</label>                
                        <div class="row px-3">
                            <ns-number-input 
                                class="app-input-size mr-3"
                                v-model="dValue.size_w" />
                            <span class="h3">x</span>
                            <ns-number-input 
                                class="app-input-size ml-3"
                                v-model="dValue.size_h" />
                        </div>

                    </div>

                </div>

            </div>

        </div>
        <div class="row">
            <div class="col-12">
                <SimpleRectBoardLayoutSimulation
                    :product-w="dValue.size_w"
                    :product-h="dValue.size_h"
                    :separate-pos-w="dSeparatePosW"
                    :separate-pos-h="dSeparatePosH"
                    :sheets="dSheets"
                ></SimpleRectBoardLayoutSimulation>
            </div>
            
        </div>
    </div>    
</template>


<script>


export default {        
    data : function() {
        return {
            dValue : {
                size_w : 3000 ,
                size_h : 1200 ,

            } , 
            dSeparatePosW : [
                1200 ,
            ] ,
            dSeparatePosH : [
                //600 ,
            ] ,
            dSheets : [
                { w : 910 , h:1820 ,pricePerSheet :2100 } ,
                { w : 1220 , h:2440 ,pricePerSheet :5700  } ,
                { w : 1000 , h:2000 ,pricePerSheet :3600  } ,
                { w : 1000 , h:3000 ,pricePerSheet :5900  } ,
            ]
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