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
        mBranchId : 
        {
            type : Number ,
        } ,
        mProductCategoryId : 
        {
            type : Number ,
        } ,
        mProcessCategoryId : 
        {
            type : Number ,
        } ,        
        mProcessCategoryMProductionNo : 
        {
            type : Number ,
        } ,
        isOutsource : {
            type : Boolean ,
            default : () => false ,
        } , 
        filterMTagKeys : 
        {
            type : Array ,
        } ,
        
    } , 
    watch : {
        mBranchId : {
            immediate: true,
            handler :  MasterUtil.clearSelectedValue ,
        } ,
    } , 
    computed : {
        
        cList : function() {
            const _this = this ; 

            if ( this.mainStore.masters.MProductions.length === 0 ) return [] ; 

            // Filter by Branch
            let data = this.mainStore.masters.MProductions.filter(e => e.m_branch_id == this.mBranchId) ;
            if ( data === undefined ) return [] ; 

            // Filter by MProductCategory            
            if ( this.mProductCategoryId !== undefined )
            {
                data = data.filter(function(e) {
                    if ( e.m_product_categories === undefined) return false ; 

                    const finded = e.m_product_categories.find(x => x.id == _this.mProductCategoryId) ; 
                    return  finded !== undefined ; 
                }) ;
                if ( data === undefined ) return [] ; 

            }
            
            
            // Filter by mProcessCategoryId            
            if ( this.mProcessCategoryId !== undefined )
            {
                data = data.filter(function(e) {
                    if ( e.m_process_categories === undefined) return false ; 

                    const finded = e.m_process_categories.find(x => x.id == _this.mProcessCategoryId) ; 
                    return  finded !== undefined ; 
                }) ;
                if ( data === undefined ) return [] ; 

            }

            // Filter by mProcessCategoryMProductionNo
            //console.log("mProcessCategoryId " + this.mProcessCategoryId) ; 
            if ( this.mProcessCategoryMProductionNo !== undefined){
                //console.log("mProcessCategoryMProductionNo " + this.mProcessCategoryMProductionNo) ; 
                data = data.filter(function(e) {
                    if ( e.m_process_categories === undefined) return false ; 

                    const finded = e.m_process_categories.find(
                        function(x){
                            //console.log(x) ; 
                            if ( x.pivot !== undefined && x.pivot !== null ){
                                if ( x.pivot.target_m_production_no == _this.mProcessCategoryMProductionNo 
                                 &&  x.pivot.m_production_links_id == _this.mProcessCategoryId)
                                {
                                    //console.log("hit") ; 
                                    return x ; 
                                }
                                 
                            }
                            
                        }); 
                    return  finded !== undefined ; 
                }) ;
                if ( data === undefined ) return [] ; 

            }

            // 外注 or 内作
            if ( this.isOutsource ){
                data = data.filter(
                    e => e.m_customer_id !== null && e.m_customer_id !== 0 ) ; 
            }
            else {
                data = data.filter(
                    e => e.m_customer_id === null || e.m_customer_id === 0 ) ; 
            }

            // 選択肢が1件のみ
            if ( this.isSelectIfListIsOne && data.length == 1  ) 
            {
                
                const onlyId = data[0].id ; 
                if ( this.dLocalSelectedId != onlyId) 
                {
                    this.emitSelectedId(onlyId) ; 
                    this.$emit('update:is-list-only-one', true) ;
                    //this.emitSelectedId(onlyId) ; 
                }
                
            }
            
            return data; 
            
        } ,        
        cSelectedItem : function() 
        {
            const selectedItem = this.cList.find(e => e.id === this.dLocalSelectedId) ;
            
            //(生産先削除等で)選んだ生産先が存在しない場合、idは0を返す             
            if(selectedItem === undefined && this.dLocalSelectedId !== 0) this.emitSelectedId(0) ;
            
            this.$emit('update:selectedItem', selectedItem) ;
            return "" ; 
        }
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