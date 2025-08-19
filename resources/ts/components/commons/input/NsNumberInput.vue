<template>
    <input type="number"
        v-model.lazy.number="lValue"
        @change="change"
        @focus="focus"
        class="form-control">
</template>

<script>
export default {
    data : function () {
        return {
            lValue : 0
        }
    } ,
    props : {
        value    : Number ,
        nullable : { type:Boolean, default : false } , // null(undefined)・空文字を許可するかどうか デフォルト[false：許可しない]
    } ,
    watch: {
        value: {
            immediate: true,
            handler (newValue, oldValue) {
                // console.log("sv : " + newValue + " old : " + oldValue)
                if (// Avoid triggering change event when created
                    !(isNaN(newValue) && typeof oldValue === 'undefined') 
                    // Avoid infinite loop
                    && newValue !== this.lValue
                   ) {
                    this.setValue(newValue) ;
                }
            } ,
        } ,
    } ,
    computed : {
        cIsNullable : function () {
            return function (val) {
                // Nullableで値が[null(undefined)・空文字]の場合はtrue
                return this.nullable && (val == null || val == "") ;
            } ;
        } ,
    } ,
    methods : {
        /**
         * Change event handler.
         * @param {string} value - The new value.
         */
        change (event) {
            // console.log(event.target.value);
            if (this.cIsNullable(event.target.value)) {
                // null(undefined)・空文字を許可してる場合はnullをセット
                this.setValue(null) ;
            } else {
                this.setValue(Number(event.target.value)) ;
            }
        } ,
        focus (event) {
            // console.log("focus");
            this.$emit('focus', event) ;
        } ,
        setValue : function (val)
        {
            // console.log("setValue");
            this.lValue = val ;
            this.$emit('input', val) ;
        } ,
    }

}
</script>

