<template>
    <component :is="compName" :process-item="processItem" :rows.sync="rows" />
</template>

<script>
export default {
    props : {
        processItem : {
            type : Object 
        } , 
        rows : {
            type : Array
        }
    } ,
    computed : {
        compName : function () {
            const cName = "tProductProcess" + this.processItem.cd ;  
            console.log(cName) ; 
            console.log(this.rows) ; 
            return cName ; 
        }
    }  
} 
</script>