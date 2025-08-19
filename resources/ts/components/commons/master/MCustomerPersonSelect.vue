<template>
    <div>
        <select class="custom-select" :placeholder="placeholder" 
                :class="inputClass"
                v-model="dLocalSelectedId"
                :disabled="disabled"
                @change="changed"  >
            <option value="0"></option>
            <option :value="n.id" v-for="n  in cList" :key="n.id" >
                {{n.name}}
            </option>
        </select>
    </div>
    
</template>

<script>

import MasterSelectMixins from "../../../mixins/commons/MasterSelectMixins" ;
import MasterUtil from "../../../frameworks/MasterRefUtil" ; 
import { MMaterialService } from '../../masters/class/services/MMaterialService';

export default {
    mixins  : [MasterSelectMixins] ,
    data : function() {
        return {
            dList : []    ,
        }
    } ,    
    props : {     
        
        // 取引先Id
        MCustomerId  : {
            type : Number ,
            default : () => 0 , 
        } ,
        disabled : {
            Type : Boolean ,
            default : () => false ,
        } ,
        
        
    } , 

    watch : {       
 
        MCustomerId : {
            immediate: true,
            // handler : MasterUtil.clearSelectedValue
            handler :  function (newVal ,oldVal ) {     
                if ( newVal !== undefined ) 
                {
                    if ( oldVal !== undefined && oldVal != 0 ) {
                        this.emitSelectedId(0) ;
                    }

                    if ( newVal !== undefined && newVal != 0 ) {
                        this.getData(newVal) ;
                    }
                }
            }
        } , 

    } ,
    computed : {     

        cList : function() 
        {
            return this.dList ; 
        } ,

    } ,
    methods : {
        getData : async function(id) {
            
            let ep = `api/mCustomerPerson/findByMCustomerId/${id}` ; 

            try {
                const res = await axios.get(ep) ; 
                this.dList = res.data ;
                this.emitSelectedId( this.dLocalSelectedId) ; 

            }
            catch (error ) {
                // this.$$errorConsole(error ,ep) ; 
                this.$$errorConsole(error ,ep) ; 
                
                this.dList = [] ; 
            }
            
        } ,
        emitSelectedItem : function(id) {

            if(id !== 0 && id !== undefined) {
                
                const selectedItem = this.cList.find(e => e.id === id) ; 
            
                if(selectedItem === undefined) {
                    
                    this.emitSelectedId(0) ;
                
                } 
                else {
                    this.$emit('update:selectedItem', selectedItem) ;

                }

            } else {

                this.$emit('update:selectedItem', undefined) ;

            }
        } ,

    } ,    
    created : function(){
    } ,

}

</script>