<template>
    <div class="card-body app-card-body">
        <div v-show="$$cIsDebug">
            {{m$cDisplay}}
        </div>        

        <!-- 工程備考(MProcessCategory.Memo) -->
        <tProductProcessCMProcessMemo
            v-model="dValue"
        />

        <div class="row">
            
            <div class="col-12 col-xl-3 pl-3">
                <validation-provider name="値引額"
                    vid="construction-cExpenseCost" 
                    :rules="`${m$cIsEnabled ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group" >
                        <label >値引額</label>
                        <ns-number-input v-model="cDiscountAmount" />
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>

            <div class="col-12 col-xl-2 pl-3 pl-xl-0">
                <div class="form-group text-right" >
                    <label >合計値引額</label>
                    <div>{{cTotalDiscount.toLocaleString()}}</div>                    
                </div>
                
            </div>
        </div>


        <!-- コスト・時間 -->
        <tProductProcessCPredicted
            v-show="$$cIsDebug"
            v-model="dValue" />
        
        
        
        <!-- 備考 -->
        <tProductProcessMemo
            v-model="dValue" />


        

    </div>

</template>

<script>
import NumberUtil from '../../../../frameworks/NumberUtil';
import ProcessDynamicGetSetComputedMixins from '../../../../mixins/tProject/ProcessDynamicGetSetComputedMixins';

import TProductProcessMixins from "./../../../../mixins/tProject/TProductProcessMixins" ;

export default {    
    mixins : [TProductProcessMixins ,ProcessDynamicGetSetComputedMixins] ,     
    data : function() {
        return {
            // これがないとReactiveが動作しない
            dValue : {} , 

            dComputedGetSetDefs : [      
                // 値引き額
                { key:'cDiscountAmount' ,propName:"DiscountAmount"} , 
            ] , 

            dComputedGetDefs : [          
                // 合計値引き額
                { key:'cTotalDiscount' ,propName:"TotalDiscount" } ,  
            ] , 
        }
    } ,  
    watch : {
        
        
    } , 
    
    computed : {} ,
    methods : {} ,
    created : function() {} ,
    mounted : function() {} ,
    
} 
</script>