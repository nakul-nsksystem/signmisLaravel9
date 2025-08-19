<template>
    <input type="checkbox" id="$$isDebugCheckbox" v-model="dIsDebug" @change="changeIsDebug" />
</template>
<script>
export default {    
    data : function() {
        return {
            dIsDebug : false ,            
        }
    } , 
    methods : {
        changeIsDebug : function(){
            this.mainStore.isDebug = this.dIsDebug ;
            
        } ,

    } ,
    created : function() {
        this.dIsDebug = this.$$cIsDebug  ; 
    }
}
</script>