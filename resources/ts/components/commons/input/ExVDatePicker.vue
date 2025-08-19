<template>    
    <v-date-picker v-model="cValue" >        
        <template v-slot="{ inputValue, inputEvents }">
            <input
                class="form-control"
                :class='{"app-input-date" : isDayOnly }'                
                :disabled="cInputDisabled"
                :value="inputValue"
                v-on="inputEvents"
            />
        </template>
    </v-date-picker>
</template>

<script>
import DayJsEx from '../../../frameworks/DayJsEx';
export default {    
    data : function () {
        return {            
        }
    } , 
    props : {
        value  : [String , Date] ,
        inputDisabled : {
            type : Boolean | Number,
            default : () => false ,
        } ,
        /**
         * 日付のみの場合ON ( Widthが 8emになる)
         */
        isDayOnly : {
            type : Boolean , 
            default : () => true ,
        } 
    } ,
    computed :  {
        cValue :{
            get :  function() {                
                return DayJsEx.getOnlyDay(this.value ) ;
            } ,
            set : function(val) {
                let convertedVal = DayJsEx.format(val )
                if ( convertedVal == "")  convertedVal = null ; 
                this.$emit('input', convertedVal)  ;
            }
        } , 
        
        //inputDisabledがチェックボックス等0 or 1 で渡されたときにバグが起きるため作成
        cInputDisabled : function() {

            if( this.inputDisabled === 0 ) return false 
            return this.inputDisabled ;
        }

    } ,

}
</script>

