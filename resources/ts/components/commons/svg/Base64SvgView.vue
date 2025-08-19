<template>
    <img v-if="isValid"         
        :src="cValue" /> 
</template>

<script>
import ObjectUtil from '../../../frameworks/ObjectUtil';

export default {    
    data : function () {
        return {            
        }
    } , 
    props : {
        value  : [String ] ,    
    } ,
    computed :  {
        isValid :  function() {
            return ObjectUtil.nu2ec(this.value) !== ""; 
        } , 
        cValue : function() {                
            return `data:image/svg+xml;base64,${this.value}` ; 
        } ,  
    } ,

}
</script>

