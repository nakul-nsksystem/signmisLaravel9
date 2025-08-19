<template>
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