<template>                             
<div 
    class="btn-group btn-group-toggle"  >
    <label class="btn btn-dark"
        :class="{active : dSelected === 'YYYY' }"
        data-toggle="tooltip" data-placement="top" title="年" >
        <input type="radio" v-model="cSelected" name="height-mode" value="YYYY"
            >
        年
    </label> 
    <label class="btn btn-dark"
        :class="{active : dSelected === 'YYYY-MM' }" 
        data-toggle="tooltip" data-placement="top" title="月" >
        <input type="radio" v-model="cSelected" name="height-mode" value="YYYY-MM">
        月
    </label>
    <label class="btn btn-dark"
        :class="{active : dSelected === 'YYYY-MM-DD' }" 
        data-toggle="tooltip" data-placement="top" title="日" >
        <input type="radio" v-model="cSelected" name="height-mode" value="YYYY-MM-DD">
        日
    </label>
</div> 
    
    
</template>

<script>



export default {
    data : function() {
        return {
            dSelected : "YYYY-MM" , 
        }
    } ,    
    props : {        
        value : 
        {
            type : String ,
        } ,
        
    } , 
    computed : {

        cSelected : {
            get : function(){
                return this.dSelected ; 
            } ,
            set : function(v){
                this.dSelected = v ; 
                this.$emit("input" , this.dSelected ) ; 
            }
        }

    } , 
    methods : {
    } ,    
    created : function(){
        this.cSelected = this.value ?? "YYYY-MM" ; 
    } ,

}
</script>