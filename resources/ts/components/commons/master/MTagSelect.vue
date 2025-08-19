<template>   
    
    <v-select 
        v-if="tags.length !== 0"
        :placeholder="placeholder"
        class="style-chooser "
        :class="inputClass"
        multiple
        label="tag_name"
        :options="tags"        
        :reduce="options => options.id"
        @input="emitInput"
        v-model="selectedIds">            
    </v-select>

</template>

<script>

export default {
    
    data : function() {
        return {
            selectedIds : []
        }
    } ,    
    props : {
        value : {
            type : Array ,
        } ,
        setTagIds : {
            type : Array ,
            default : () => [] , 
        } ,
        placeholder : {
            type : String ,
            default : () => "" , 
        } ,
        tagCategoryKey :
        {
            type : String ,            
            required: true ,
        } ,
        inputClass : {
            type : Object ,
            default : () => {}
        }
    } , 
    computed : {
        tags : function() {
            if ( this.mainStore.masters.MTagCategories.length === 0 ) return [] ; 

            const list = this.mainStore.masters.MTagCategories.find(e => e.tag_category_key == this.tagCategoryKey) ;
            if ( list === undefined ) return [] ; 

            return list.m_tags ; 
            
        } ,
    } , 
    methods : {
        emitInput : function(val){
            //this.$emit('update:selectedIds', val) ;
            this.$emit("input" , val) ; 
        } ,
    } ,        
    watch : {
        setTagIds : {
           immediate: true,
           handler: function (val) {
               this.selectedIds =  val.map(_ => _.id)  ;
               this.emitInput(this.selectedIds) ; 
               //this.$emit('update:selectedIds', this.selectedIds) ;
           }
        }
        
        
    }, 
    created : function(){
    } ,

}
</script>

<style>
.style-chooser .vs__search::placeholder,
.style-chooser .vs__dropdown-toggle,
.style-chooser .vs__dropdown-menu {
    background: white;
    border: none;
  }
  .style-chooser .vs__dropdown-toggle{
    font-size: 1rem !important;
    padding : 0.25rem;
  }
</style>