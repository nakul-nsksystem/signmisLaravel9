<template>
    <div>
        <button 
            type="button" 
            class="btn mr-2" 
            v-for="n in list" :key="n.id"            
            :class="getClasses(n.id)"
            :aria-pressed="n.isSelected" 
            @click.prevent="select(n)"             
            >        
            {{n.shortNameOrName}}
        </button>
        
        
    </div>
</template>

<script>
import ObjectUtil from '../../../frameworks/ObjectUtil';

import MKvCatConst from "./../../../consts/MKvCategoriesConst" ; 

export default {
    //
    data : function() {        
        return {
            list : [] ,


        }
    } ,    
    props : {
        value : {
            type :Array ,
        } ,
        setSelectedIds : {
            type : Array , 
            default : () => [] ,
        } , 
    } , 
    watch : {
        isReadyMasters : function(newVal ,oldVal){
            //console.log("isReadyMasters " + newVal + " : " + oldVal) ;
            if ( newVal ) 
            {
                this.getList() ; 
            }
        } ,        
        setSelectedIds : {
            immediate: true,
            handler :  function (newVal ,oldVal ) {      
                if ( newVal !== undefined)
                {
                    if ( this.isReadyMasters ){
                        if ( oldVal !== undefined && newVal.toString() == oldVal.toString()) return ; 
                        this.getList() ; 
                    }
                }
            }
        }
    } ,
    computed : {

        isReadyMasters : function() 
        {
            const branches = this.mainStore.masters.MBranches ;

            if ( branches.length === 0) return false  ; 

            return true ; 

        } ,        
        getClasses : function () 
        {
            let _this = this ; 
            return function (id) 
            {
                //{ 'active' : n.isSelected }
                const findedBranch = _this.list.find(x => x.id == id ) ; 
                let isActive = false ; 
                if ( findedBranch !== undefined )  isActive = findedBranch.isSelected ; 

                // ButtonColor
                const colorName = this.masterStore.getMBranchColorById(id) ;      
                       
                let btnClassName = "btn-dark" ;                 
                if (  isActive && ! ObjectUtil.isNUE(colorName)) btnClassName = "btn-" + colorName ; 

                const classes = [ btnClassName  , { active:isActive}]; 
                return classes ; 

            }
        } ,
    } ,
    methods : {
        select : function (n)  
        {
            const idx = this.list.indexOf(n) ;             
            n.isSelected = !n.isSelected ;
            this.list.splice(idx, 1, n) ; 
            
            this.emitSelectedIds() ; 

        } ,
        emitSelectedIds : function()
        {
            const filterdList = this.list.filter(x => x.isSelected) ; 
            const selectedIds = filterdList.map(x => x.id ) ; 
            
            //this.$emit('update:selectedIds', selectedIds)  ;
            this.$emit('input', selectedIds)  ;
        } ,
        getList : function() 
        {            
            const branches = this.mainStore.masters.MBranches ; 
                    
            if ( branches === undefined) return false ; 

            const _selectedIds = this.setSelectedIds ; 
            const list = branches.map(function(x) {

                let isSelectedFlg = _selectedIds.indexOf(x.id) !== -1 
                let row = { id :x.id ,name:x.name ,color_m_kv_id :x.color_m_kv_id , isSelected:isSelectedFlg  ,shortNameOrName:x.shortNameOrName} ;                 

                return row ; 
            } ); 

            this.list.splice(0) ; 
            Array.prototype.push.apply(this.list, list);

            this.emitSelectedIds() ;
        }
    } ,    
    mounted : function(){
        
    } ,

}
</script>