<template>
    <div class="card-body app-card-body">
        
        <div class="row" v-show="m$cIsProcessMemoAvailable">
            <div class="col-12">
                <div class="alert alert-primary">
                    {{dValue.m_process_category.memo4project}}
                </div>
                
            </div>
        </div>
        
        <div class="row">
            <div class="col-12 col-xlg-4">
                <div class="flex-grow-1 form-group">
                    <label >分数/個</label>
                    <ns-number-input v-model="dValue.n_01" />
                </div>
                <div class="col-12 flex-grow-1 text-center" style="flex-basis:100px;">
                    <label class="mb-0">エッジバンド使用</label>                
                    <div>
                        <input type="checkbox" />
                    </div>
                    
                </div>
                <div class="flex-grow-1 form-group">
                    <label >外周mm</label>
                    <ns-number-input v-model="dValue.n_02" />
                </div>
                <div class="flex-grow-1 form-group">
                    <label >その他消耗品費</label>
                    <ns-number-input v-model="dValue.n_03" />
                </div>


            </div>




        </div>

        <div class="row">
            <div class="col-12">                
                <div class="form-group">
                    <label>備考</label>
                    <input type="text" 
                        v-model.lazy="dValue.memo"
                        class="form-control" placeholder="">
                </div>

            </div>
        </div>



    </div>

</template>

<script>

import TProductProcessMixins from "../../../../mixins/tProject/TProductProcessMixins" ;

export default {    
    mixins : [TProductProcessMixins] ,     
    data : function() {
        return {
            // これがないとReactiveが動作しない
            dValue : {} , 

        }
    } ,  
    
    computed : {
        
    } ,
    methods : {
    } ,
    created : function() 
    {        
    } , 
    mounted : function() 
    {
    }
    
} 
</script>