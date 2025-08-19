<template>   
    
    <v-select 
        v-if="roles.length !== 0"
        :placeholder="placeholder"
        class="style-chooser"
        :class="inputClass"
        multiple
        label="name"
        :options="roles"        
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
        setRoleIds : {
            type : Array ,
            default : () => [] , 
        } ,
        placeholder : {
            type : String ,
            default : () => "" , 
        } ,
        inputClass : {
            type : Object ,
            default : () => {}
        }

    } , 
    computed : {
        roles : function() {
            if ( this.mainStore.masters.MRoles.length === 0 ) return [] ; 

            const list = this.mainStore.masters.MRoles ;
            if ( list === undefined ) return [] ; 

            return list ; 
            
        } ,
    } , 
    methods : {
        emitInput : function(val){
            //this.$emit('update:selectedIds', val) ;
            this.$emit("input" , val) ; 
        } ,
    } ,        
    watch : {
        setRoleIds : {
           immediate: true,
           handler: function (val) {
               this.selectedIds =  val.map(_ => _.id)  ;
               this.emitInput(this.selectedIds) ; 
               //this.$emit('update:selectedIds', this.selectedIds) ;
           }
        }
        
        
    }, 
    created : function(){
        //console.log(this.) ; 
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
</style>