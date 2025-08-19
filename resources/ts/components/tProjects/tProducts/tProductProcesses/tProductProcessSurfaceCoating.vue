<template>
    <div class="card-body app-card-body">
        <div class="d-none">
            <!-- {{cIsNotCostByInput}} -->
        </div>

        <div v-show="$$cIsDebug">
            {{m$cDisplay}}
            <div class="d-none">
                {{cWayName}}
            </div>
        </div>



        <!-- 工程備考(MProcessCategory.Memo) -->
        <tProductProcessCMProcessMemo
            v-model="dValue"
        />
        <!-- 外注 -->
        <tProductProcessCOutSourceSelect
            v-model="dValue" 
            :m-product-category-id="tProduct.m_product_category_id"
            :m-process-category-id="dValue.m_process_category_id"
            />
        
        <!-- 生産先 -->
        <tProductProcessCMProduction
            v-model="dValue"
            :m-product-category-id="tProduct.m_product_category_id"
            :m-process-category-id="dValue.m_process_category_id"
            :mode-m-process-category-id="dValue.m_process_category_id"
            
        />

        
        <div class="row">
            <div class="col-12 col-xl-5">
                <validation-provider name="方法"
                    vid="surfaceCoatingWay"
                    :rules="`${m$cIsEnabled ? 'required|excluded:0' : ''}`" 
                    immediate v-slot="{ errors }">

                    <div class="form-group">
                        <label >方法</label>       
                        <m-kv-select 
                            v-model="cWayMKvId"
                            :is-select-if-list-is-one="true"
                            :kv-key="'t_project_product_process-surface-coating'"
                        />
                        <span class="validation-error mb-2">{{ errors[0] }}</span>
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
import TProductProcessMixins from "./../../../../mixins/tProject/TProductProcessMixins" ;
import ProcessDynamicGetSetComputedMixins from '../../../../mixins/tProject/ProcessDynamicGetSetComputedMixins';


export default {
    mixins : [TProductProcessMixins ,ProcessDynamicGetSetComputedMixins] ,     
    data : function() {
        return {
            // これがないとReactiveが動作しない
            dValue : {} , 

             
            dComputedGetSetDefs : [
                // 方法 MKvId
                { key:'cWayMKvId' ,propName:"WayMKvId" } ,   
                // コスト手入力
                { key:'cIsCostByInput' ,propName:"IsCostByInput" } ,
                // 作業見込み秒数
                { key:'cLevelOfDifficulty' ,propName:"LevelOfDifficulty" } ,
                // 材料費/㎡あたり
                { key:'cCoatingMaterialCostPerSqm' ,propName:"CoatingMaterialCostPerSqm" } ,

            ] , 

            dComputedGetDefs : [          
                // TProject
                { key:'cTProduct' ,propName:"_t_project_product" } ,
                // 方法名
                { key:'cWayName' ,propName:"WayName" } ,
                
            ] , 

        }
    } ,      
    computed : {} ,
    methods : {} ,
    created : function() {} ,
    mounted : function() {} ,
    
} 
</script>