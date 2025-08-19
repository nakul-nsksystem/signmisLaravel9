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
            <div class="col-12 col-xl-4">
                <validation-provider name="方法"
                    vid="packingWay"
                    :rules="`${m$cIsEnabled ? 'required|excluded:0' : ''}`" 
                    immediate v-slot="{ errors }">

                    <div class="form-group">
                        <label >方法</label>       
                        <m-kv-select 
                            v-model="cWayMKvId"
                            :is-select-if-list-is-one="true"
                            :kv-key="cWayMKvKey"
                            :g01="cWayG01"
                        />
                        <span class="validation-error mb-2">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>
        </div>

        
        <div class="row">
            <div class="col-12 col-xl-2">
                <div class="form-group text-center" >
                    <label >原価入力</label>
                    <ns-checkbox-input
                        v-model="cIsCostByInput"
                        :id="'PackingcIsCostByInput'"
                        />
                </div>
            </div>

            <div class="col-12 col-xl-3 pl-xl-0" v-show="cIsCostByInput">
                <validation-provider name="材料費" 
                    vid="packing-cMaterialCostPerQty"
                    :rules="`${m$cIsEnabled && cIsCostByInput ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label >材料費</label>
                        <ns-number-input  v-model="cMaterialCostPerQty" />
                        <span class="validation-error">{{ errors[0] }}</span>  
                    </div>
                                              
                </validation-provider>
            </div>

            <div class="col-12 col-xl-3 pl-xl-0" v-show="cIsCostByInput">
                <validation-provider name="作業見込み秒数" 
                    vid="packing-cWorkSecondsPerQty"
                    :rules="`${m$cIsEnabled && cIsCostByInput ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label >作業見込み秒数</label>
                        <ns-number-input  v-model="cWorkSecondsPerQty" />
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
                { key:'cWorkSecondsPerQty' ,propName:"WorkSecondsPerQty" } ,
                // 材料費/個あたり
                { key:'cMaterialCostPerQty' ,propName:"MaterialCostPerQty" } ,

            ] , 

            dComputedGetDefs : [          
                // TProject
                { key:'cTProduct' ,propName:"_t_project_product" } ,
                // 方法 MKV_key
                { key:'cWayMKvKey' ,propName:"WayMKvKey" } ,
                // 方法 MKV_g_01
                { key:'cWayG01' ,propName:"WayG01" } ,
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