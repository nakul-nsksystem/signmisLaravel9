<template>
    <div class="card-body app-card-body">
        <div v-show="$$cIsDebug">
            {{m$cDisplay}}
        </div>

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
                    <label >材料</label>
                    <select  class="form-control" placeholder="">
                        <option>木材 35mm角</option>
                        <option>木材 50mm角</option>
                        <option>鉄1</option>
                        <option>鉄2</option>
                        <option>アルミ</option>
                        
                    </select>
                </div>


            </div>




        </div>


        <div class="row">
            <div class="col-12">                
                <div class="form-group">
                    <label >備考</label>
                    <input type="text" 
                        v-model.lazy="dValue.memo"
                        class="form-control" placeholder="">
                </div>

            </div>
        </div>


    </div>

</template>

<script>

import TProductProcessMixins from "./../../../../mixins/tProject/TProductProcessMixins" ;

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