<template>
    <div class="row" v-show="m$cIsProcessMemoAvailable">
        <div class="col-12">
            <div class="alert alert-primary" >
                <span style="white-space: pre-wrap">{{dValue.m_process_category.memo4project}}</span>
            </div>
            
        </div>
    </div>
</template>

<script>
import TProductProcessMixins from "./../../../../../mixins/tProject/TProductProcessMixins" ;
export default {
    mixins : [TProductProcessMixins] ,     
    data : function() {
        return {
            dValue : this.value , 
        }
    } ,  
    props : {
        value : {
            type : Object 
        } ,
    } ,
    computed : {
              
    }  
} 
</script>