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
            <div class="col-12 col-xl-10">
                <validation-provider name="内容"
                    vid="expendable-cDetail" 
                    :rules="`${m$cIsEnabled ? 'required' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label >内容</label>
                        <input 
                            v-model.lazy="cDetail"
                            class="form-control" />
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>

            <div class="col-12 col-xl-2 pl-3 pl-xl-0">
                <validation-provider name="単価"
                    vid="expendable-cCost" 
                    :rules="`${m$cIsEnabled ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group ml-2" >
                        <label >単価</label>
                        <ns-number-input v-model="cCost" />    
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
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
import ProcessDynamicGetSetComputedMixins from '../../../../mixins/tProject/ProcessDynamicGetSetComputedMixins';
import TProductProcessMixins from "./../../../../mixins/tProject/TProductProcessMixins" ;

export default {    
    mixins : [TProductProcessMixins,ProcessDynamicGetSetComputedMixins] ,     
    data : function() {
        return {
            // これがないとReactiveが動作しない
            dValue : {} , 

            
            dComputedGetSetDefs : [      
                // 作業内容
                { key:'cDetail' ,propName:"Detail"} ,                
                // 単価
                { key:'cCost' ,propName:"Cost" } ,   

            ] , 

            dComputedGetDefs : [          
                // TProject
                { key:'cTProduct' ,propName:"_t_project_product" } ,               
                
            ] , 

        }
    } ,  
    
    computed : {} ,
    methods : {} ,
    created : function() {} ,
    mounted : function() {} ,
    
} 
</script>