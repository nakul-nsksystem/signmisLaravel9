<template>
    <div>
        <select class="custom-select" :placeholder="placeholder" 
                :class="inputClass"
                v-model="dLocalSelectedId"
                @change="changed"  >
            <option value="0"></option>
            <option :value="n.id" v-for="n  in cList" :key="n.id" >{{n.name}}</option>
        </select>
        {{cSelectedItem}}
    </div>
    
</template>

<script>

import MasterSelectMixins from "./../../../mixins/commons/MasterSelectMixins" ;
import MasterUtil from "./../../../frameworks/MasterRefUtil" ; 

export default {
    mixins  : [MasterSelectMixins] ,
    data : function() {
        return {
            
        }
    } ,    
    props : {     
        
    } , 
    computed : {         
        cList : function () {
            if ( this.mainStore.masters.MMatrices.length === 0 ) return [] ; 
            
            return this.mainStore.masters.MMatrices ; 
        } ,
        cSelectedItem : function() 
        {
            const selectedItem = this.cList.find(e => e.id === this.dLocalSelectedId) ; 
            this.$emit('update:selectedItem', selectedItem) ;
            return "" ; 
        }
    } ,
    methods : {
        emitSelectedItem : function(id){
            this.$emit('update:selectedItem', this.cList.find(e => e.id === id)) ;
        } ,
    } ,    
    created : function(){
    } ,

}
</script>