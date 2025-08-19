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
            <div class="col-12 col-xl-2">
                <validation-provider name="人数"
                    vid="construction-cNumOfWorkers" 
                    :rules="`${m$cIsEnabled ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group" >
                        <label >人数</label>
                        <ns-number-input v-model="m$cNumOfWorkers" />
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>
            <div class="col-12 col-xl-3 pl-3 pl-xl-0">
                <validation-provider name="人工単価"
                    vid="construction-cCostPerWorker" 
                    :rules="`${m$cIsEnabled ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group" >
                        <label >人工単価</label>
                        <ns-number-input v-model="cCostPerWorker" />
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>
            
            <div class="col-12 col-xl-3 pl-3 pl-xl-0">
                <validation-provider name="諸経費"
                    vid="construction-cExpenseCost" 
                    :rules="`${m$cIsEnabled ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group" >
                        <label >諸経費</label>
                        <ns-number-input v-model="cExpenseCost" />
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>

            
            <div class="col-12 col-xl-2 pl-3 pl-xl-0">
                <div class="form-group text-right" >
                    <label >合計単価</label>
                    <div>{{cTotalCostPerWorker.toLocaleString()}}</div>                    
                </div>                
            </div>

            <div class="col-12 col-xl-2 pl-3 pl-xl-0">
                <div class="form-group text-right" >
                    <label >合計金額</label>
                    <div>{{cTotalCost.toLocaleString()}}</div>                    
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
                // 人工単価
                { key:'cCostPerWorker' ,propName:"CostPerWorker"} ,                
                // 諸経費
                { key:'cExpenseCost' ,propName:"ExpenseCost" } ,   

            ] , 

            dComputedGetDefs : [          
                // TProject
                { key:'cTProduct' ,propName:"_t_project_product" } ,               
                // 合計単価/人
                { key:'cTotalCostPerWorker' ,propName:"TotalCostPerWorker" } ,               
                // 合計コスト
                { key:'cTotalCost' ,propName:"TotalCost" } ,               
                
            ] , 
        }
    } ,  
    watch : {
        'dValue.m_branch_id': {
            immediate: true,
            handler : function(newVal, oldVal){            
                //console.log('dValue.m_branch_id changed ' + newVal );
                //console.log("oldVal " + oldVal) ; 
                //console.log("cCostPerWorker " + this.cCostPerWorker) ; 
                
                 if ( NumberUtil.invalid2zr(newVal) != 0 ) {
                    if ( oldVal === undefined && this.cCostPerWorker !== 0 ) return ; 

                    this.dValue.UpdateCostPerWorker() ; 
                    
                 }
            },        
        }
        
        
    } , 
    
    computed : {} ,
    methods : {} ,
    created : function() {} ,
    mounted : function() {} ,
    
} 
</script>