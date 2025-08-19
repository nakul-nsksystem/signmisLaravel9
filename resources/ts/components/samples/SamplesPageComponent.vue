<template>
    <div class="row">
        
        <div class="col-12 col-lg-6 order-1 order-lg-0">    
            <p>
                Edit
            </p>
            <m-customer-ref-input 
                v-bind:selected-item.sync="selectedCustomerItem"
            ></m-customer-ref-input>

            <input v-model="selectedItem.id" />
            <input v-model="selectedItem.name" />   
            <vuejs-datepicker 
                :format="this.mainStore.dtpickerConfig.DatePickerFormat"
                :language="this.mainStore.dtpickerConfig.ja"
                v-model="selectedItem.created_at">
            </vuejs-datepicker>
            
            <button>OK</button>
            <button>Cancel</button>
            <button @click="getAll" >GetAll</button>
            
        </div>
        <div class="col-12 col-lg-6 order-0 order-lg-1">
            <samples-list-component 
                :sample-list="sampleList"
                v-on:select-item="changeSelectedItem"
                 />
        </div>
    </div>
</template>
<script>

// Vue.component('DatePicker' , Datepicker) ; 

import SamplesListComponent from './SamplesListComponent'


export default {
    components :
    {
        SamplesListComponent ,
    } ,
    data : function() {
        return {
            selectedItem : {} ,
            sampleList : [] ,
            selectedCustomerItem : {} ,
        } 
    } , 
    methods : {
        getAll () {
            this.sampleList = [
                {id : 2 , name : "two" , created_at:Date.now() } ,
                {id : 3 , name : "three" , created_at:Date.now()} ,
                {id : 4 , name : "four", created_at:Date.now()} ,
            ] ;
        } ,
        changeSelectedItem(item)
        {
            this.selectedItem = item ; 
        } ,
        consoleCustomerId()
        {
            console.log(this.customerId) ; 
        }
        
    } ,
    created : function(){
        console.log("created") ; 
        this.getAll() ; 
        
    } , 
}


</script>   

