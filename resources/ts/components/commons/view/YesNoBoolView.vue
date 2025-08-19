<template>                             
<div :class="cTextClass">
    {{cText}}
</div> 
    
    
</template>

<script>



export default {
    data : function() {
        return {
        }
    } ,    
    props : {        
        value : 
        {
            type : Boolean ,            
        } ,
        
    } , 
    computed : {

        cText : function() {
            return this.value === true ? "はい" : "いいえ" ; 
        } ,
        cTextClass : function() { 
            return this.value === true ? "text-lightSuccess" : "text-lightDanger" ; 
        }

    } , 
    methods : {} ,    
    created : function(){} ,

}
</script>