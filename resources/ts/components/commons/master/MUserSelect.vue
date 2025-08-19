<template>    
<div>
    <select class="custom-select" 
            :placeholder="placeholder" 
            :class="inputClass"
            v-model="dLocalSelectedId"
            @change="changed"
            :disabled="disabled"  >
        <option value="0"></option>
        <option :value="n.id" v-for="n  in cList" :key="n.id" >{{n.full_name}}</option>        
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
        mBranchId : 
        {
            type : Number ,
        } ,
        filterMTagKeys : 
        {
            type : Array ,
            default : () => []
        } ,
        disabled :{
            type : Boolean,
        }
        
    } , 
    watch : {
        mBranchId : {
            immediate: true,
            handler :  function(newVal ,oldVal) {

                if(this.cList.find( e=> e.id == this.dLocalSelectedId) === undefined) {
                    MasterUtil.clearSelectedValue
                }

            }
        } ,
                
        value : 
        {
            immediate: true,
            handler :  function (newVal ,oldVal ) {   
                if ( newVal !== undefined )
                {
                    if ( newVal !== null)
                    {
                        if (oldVal !== undefined && oldVal !== null && newVal.toString() == oldVal.toString()) return ;                         
                        this.dLocalSelectedId = newVal ;                         
                    }                    
                    else
                    {
                        this.dLocalSelectedId = 0 ;                         
                    }
                }
            }
        } ,
        
    } , 
    computed : {
        cList : function() {
            
            //console.log("cList") ; 
            if ( this.mainStore.masters.MUsers.length === 0 ) return [] ; 

            // Filter by Branch ,deleted_at考慮
            let data = this.mainStore.masters.MUsers.filter(e => e.m_branch_id == this.mBranchId && e.deleted_at == null) ;
            if ( data === undefined ) return [] ; 
            
            //nsk user以外はnskUserが選択肢に出ないようにする
            if(!this.$$cIsNskDev) {
                data = data.filter(e => !e.is_nsk_user) ;
            }

            // deleted_at 考慮
            // data = data.filter(e => e.deleted_at == null) ;
            // if ( data === undefined ) return [] ; 

            // Filter by MTagKey
            if ( this.filterMTagKeys.length === 0 ) return data ; 
            data = data.filter(e => e.tags.some(tag => this.filterMTagKeys.indexOf(tag.tag_key) !== -1 )) ; 
            
            if ( data === undefined ) return [] ; 

            
            return data; 
            
        }  ,
        cSelectedItem : function() 
        {
            //console.log("user-select " + this.dLocalSelectedId) ; 
            // const selectedItem = this.cList.find(e => e.id === this.dLocalSelectedId) ; 
            // this.$emit('update:selectedItem', selectedItem) ;


            if(this.dLocalSelectedId !== 0 && this.dLocalSelectedId !== undefined) {
                
                const selectedItem = this.cList.find(e => e.id === this.dLocalSelectedId) ; 
            
                if(selectedItem === undefined) {
                    
                    this.emitSelectedId(0) ;
                
                } 
                else {
                    this.$emit('update:selectedItem', selectedItem) ;

                }
            }
            
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