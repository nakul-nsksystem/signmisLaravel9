<template>
    <div>
        <button 
            type="button" 
            class="btn mr-2 text-white" 
            v-for="n in cList" :key="n.id"            
            :class="getClasses(n.id)"
            @click.prevent="select(n)"             
            >        
            {{n.name}}
        </button>
        
        
    </div>
</template>

<script>
import ObjectUtil from '../../../frameworks/ObjectUtil';


export default {
    //
    data : function() {        
        return {
        }
    } ,    
    props : {
        value : {
            type :Array ,
            default : () => [] , 
        } ,
        /**
         * 生産管理対象のみ表示
         */
        isOnlyProduction : {
            type : Boolean , 
            default : () => false ,
        }
    } , 
    watch : {
    } ,
    computed : {
        cList : function() {
            if ( ObjectUtil.isNU(this.mainStore.masters.MProductCategories )) return [] ; 

            let list = this.mainStore.masters.MProductCategories  ; 
            if ( this.isOnlyProduction){
                list = list.filter(x => x.is_production ) ; 
            }

            return list ; 
        } , 
        
    } ,
    methods : {
        getClasses : function (n) {
            return this.value.indexOf(n) !== -1 ? "btn-primary"  : "" ; 
        } ,
        select : function (n)  
        {
            const list = [...this.value] ;                 
            const idx = this.value.indexOf(n.id) ;             
            if ( idx === -1) { 
                list.push(n.id) ; 
            }
            else {
                list.splice(idx , 1 ) ; 
            }            
            this.emitSelectedIds(list) ; 

        } ,
        emitSelectedIds : function( ids )
        {
            this.$emit('input', ids )  ;
        } ,
    } ,    
    mounted : function(){
        
    } ,

}
</script>