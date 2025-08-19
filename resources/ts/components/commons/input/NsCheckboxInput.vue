<template>
    <div class="custom-control custom-checkbox ml-2">
        <input 
            :id="id"
            :disabled="disabled"
            type="checkbox"  
            class="custom-control-input"
            v-model="dValue"
            @change="change" 
            placeholder="">
        <label class="custom-control-label" style=" white-space: pre" :for="id">{{label}}</label>
    </div>
</template>


<script>
export default {    
    data : function () {
        return {
            dValue : false 
        }
    } , 
    props : {
        value : [Boolean ,Number , undefined ] ,
        id : {
            type : String ,
            require : true ,
        } ,
        label : {
            type : String ,
            default : () => ""
        } , 
        disabled :{ 
            type : Boolean , 
            default : () => false ,
        }
    } ,
    watch: {
        value: {
        immediate: true,
        handler(newValue, oldValue) {
            //console.log("sv : " + newValue + " old : " + oldValue) 
            if (
                // Avoid triggering change event when created
                !(isNaN(newValue) && typeof oldValue === 'undefined')
                    // Avoid infinite loop
                    && newValue !== this.dValue
                ) {
                    //console.log(newValue) ; 
                    //if ( newValue == 1 ) newValue = true ; 
                    this.setValue(newValue);
                }

            },
        },
    },

    methods : {        
        /**
         * Change event handler.
         * @param {string} value - The new value.
         */
        change(event) {
            this.setValue( Boolean(event.target.checked));
            this.$emit("change" , event.target) ; 
        },
        setValue : function(val ) 
        {
            //console.log("val:" + val ) ; 
            this.dValue = val ; 
            this.$emit('input', val);
            
        }
    }

}
</script>

