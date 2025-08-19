<template>
    <div class="card-body app-card-body">
        <div v-show="$$cIsDebug">
            {{m$cDisplay}}
        </div>
        <div v-show="$$cIsDebug">
            加工 {{cProcessMater}} m <br />
            <!-- 面積 {{cTProduct.Sqm}} ㎡ <br /> -->
            <!-- 掛け率{{cPer}} 倍 <br /> -->

            W掛け率 : {{dValue.WRate}}<br />
            W掛け率反映済み : {{dValue.RatedW}} <br />
            H掛け率 : {{dValue.HRate}}<br />
            H掛け率反映済み : {{dValue.RatedH}} <br />
            掛け率反映済み長さ : {{dValue.RatedPerimeter}} <br />
            掛け率反映済み最低長さ : {{dValue.tmp_minPerimeter}}
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

        <!-- 生産性（予測時間) -->
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
    mixins : [TProductProcessMixins , ProcessDynamicGetSetComputedMixins] , 
    data : function() {
        return {
            dValue : {} , 
                         
            dComputedGetSetDefs : [
                // { key:'cFRMKvId' ,propName:TProjectProductProcessPrint.FRMKvId_PName } ,

            ] , 

            dComputedGetDefs : [          
                // TProject
                { key:'cTProduct' ,propName:"_t_project_product" } ,
                // 加工m数
                { key:'cProcessMater' ,propName:"TotalProcesMater"} ,
                
            ]

        }         
    } ,
    computed : {} ,
    methods : {} ,
    created : function(){}
    
} 
</script>