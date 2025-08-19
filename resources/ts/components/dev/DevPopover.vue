<template>
    
    <div>
        <h2>Popover</h2>
        <div class="row">
            <div class="col-12">
                <button type="button" class="btn btn-lg btn-danger" data-toggle="tooltip" title="Popover title" data-content="And here's some amazing content. It's very engaging. Right?">Click to toggle popover</button>
            </div>
            
        </div>
        
        <h2 class="mt-3">Dragdrop</h2>
        <div class="row">
            <div class="col-6 ">
                <div class="bg-primary m-3" 
                    style="height:100px;"
                    @dragstart="fromDragStart"                    
                    @dragend="fromDragEnd"
                    draggable
                    >
                    Drag Source
                </div>
            </div>
            <div class="col-6 ">
                <div class="bg-success m-3" 
                    style="height:100px;"
                    @dragenter="toDragEnter($event)"
                    @dragover="toDragOver($event)"
                    @dragend="toDragEnd"
                    @dragleave="toDragLeave"
                    >
                    <img width="100" height="100">
                    Drag to
                </div>
            </div>
            
            

        </div>

        
        <h2>Lodash : </h2>
        <div class="row">
            <div class="col-12">
                <h4>GroupBy</h4>
                <div class="row">
                    <div class="col-6">
                        <div >
                            <textarea class="form-control" v-model="dGroupByJson"></textarea>
                        </div>
                    </div>
                    <div class="col-6">
                        <div >
                            <textarea class="form-control" v-model="cGrouped" ></textarea>
                        </div>

                    </div>
                </div>
            </div>
            
        </div>

        <h2>Ttest </h2>
        <div class="row">
            <div class="col-12">
                <h4>Class</h4>
                <div class="row">
                    <div class="col-6">
                        <button @click.prevent="test1()" > test1</button>
                    </div>
                </div>
            </div>
            
        </div>
        
    </div>    


</template>


<script>
import _ from 'lodash';

// import TestClass from "../tProductions/class/TestClass" ; 


export default {        
    data : function() {
        return {
            dDdCounter : 0 ,
            dGroupByJson : "{}" , 
        }         
    } ,
    
    computed : {
        cGrouped : function() { 
            const gJson = JSON.parse(this.dGroupByJson) ;  

            return JSON.stringify(_.groupBy(gJson , "m_production_id_01")) ; 

        } , 

    } ,
    methods : {
        fromDragStart : function(){
            this.dDdCounter = 0  ; 
            console.log("fromDragEnd") ; 
        } , 
        fromDragEnd : function(){
            console.log("fromDragEnd") ; 
        } , 
        toDragEnd : function(){
            console.log("fromDragEnd") ; 
        } , 
        toDragOver : function(event) { 
            // console.log(`( ${event.x} , ${event.y}) 
            //     movement ( ${event.movementX} , ${event.movementY} ) 
            //     offset ( ${event.offsetX} , ${event.offsetY} )`) ; 

            console.log(event.target.parentNode) ; 

            //console.log(`( ${event.offsetX} , ${event.offsetY} )` ) ; 


        } , 
        toDragEnter : function(event){
            this.dDdCounter ++ ; 
            console.log("toDragEnter" + this.dDdCounter) ; 


            // console.log(`( ${event.x} , ${event.y}) 
            //     movement ( ${event.movementX} , ${event.movementY} ) 
            //     offset ( ${event.offsetX} , ${event.offsetY} )`) ; 
        } , 
        toDragLeave : function(){
            this.dDdCounter -- ; 
            
            console.log("toDragLeave " + this.dDdCounter) ; 
        } ,
        test1 : function() { 
            // const test = new TestClass("ABC")  ; 
            // test.say() ; 

            // console.log(JSON.stringify(test)) ; 
        }

    } ,
    mounted : function() { 
        $('[data-toggle="tooltip"]').tooltip() ;
    } , 
    created : function()
    {
        
        
    }
    
} 
</script>