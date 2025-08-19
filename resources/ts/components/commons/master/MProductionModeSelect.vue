<template>    
    <div>
        <select class="custom-select" 
                :class="inputClass"
                :placeholder="placeholder" 
                v-model="dLocalSelectedId"
                @change="changed"  >
            <option disabled value="">Please select one</option>
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
        mProductionId : 
        {
            type : Number ,
        } ,                
        mProcessCategoryId : 
        {
            type : Number ,
        } ,
    } , 
    watch : {
        mProductionId : {
            immediate: true,
            handler :  MasterUtil.clearSelectedValue ,
        } ,
    } , 
    computed : {
        
        cList : function() {
            const _this = this ; 

            if ( this.mProductionId === undefined || this.mProductionId === 0 ) return [] ; 
            if ( this.mainStore.masters.MProductions.length === 0 ) return [] ; 

            // Filter by MProduction
            let data = this.mainStore.masters.MProductions.find(e => e.id == this.mProductionId) ;
            if ( data === undefined ) return [] ; 

            data = JSON.parse(JSON.stringify(data)) ;  

            // Filter by mProcessCategoryId            
            if ( this.mProcessCategoryId !== undefined )
            {
                data.m_production_modes = data.m_production_modes.filter(function(e) {
                    if ( e.m_process_categories === undefined) return false ; 

                    const finded = e.m_process_categories.find(x => x.id == _this.mProcessCategoryId) ; 
                    return  finded !== undefined ; 
                }) ;
                if ( data === undefined ) return [] ; 

            }


            // 選択肢が1件のみ
            if ( this.isSelectIfListIsOne && data.m_production_modes.length == 1  ) 
            {
                
                const onlyId = data.m_production_modes[0].id ; 
                if ( this.dLocalSelectedId != onlyId) 
                {
                    this.emitSelectedId(onlyId) ; 
                    //this.emitSelectedId(onlyId) ; 
                }
                
            }

            return data.m_production_modes; 
            
        } ,        
        cSelectedItem : function() 
        {
            const selectedItem = this.cList.find(e => e.id === this.dLocalSelectedId) ; 
            this.$emit('update:selectedItem', selectedItem) ;
            return "" ; 
        } ,
    } , 
    methods : {
        emitSelectedItem : function(id){
            //this.$emit('update:selectedItem', this.list.find(e => e.id === id)) ;
        } ,
    } ,    
    created : function(){
        //console.log(this.mainStore.masters.MUsers) ; 
    } ,

}
</script>