<template>
    <div class="card-body app-card-body">
        <div v-show="$$cIsDebug">
            {{m$cDisplay}}
            <div class="d-none">
                {{cMaterialName}}
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
            
            <div class="col-12 col-xlg-4">
                <validation-provider name="種類"
                    vid="primar-cMMaterialId" 
                    :rules="`${m$cIsEnabled ? 'required|excluded:0' : ''}`" 
                    immediate v-slot="{ errors }">

                    <div class="form-group">
                        <label >種類</label>                    
                        <m-material-select
                            v-model="cMMaterialId"
                            :m-branch-id="m$cMBranchId"
                            :selected-item.sync="dValue.m_material01"                        
                            :sub-category-m-kv-id="cSubCatPrimarMKvId"
                            :isDisplayName="true"                   
                            >
                        </m-material-select>
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
                    
            </div>
            <div class="col-12 col-xlg-2 pl-3 pl-xl-0">                
                <validation-provider name="難易度"
                    vid="primar-cLevelOfDifficulty" 
                    :rules="`${m$cIsEnabled ? 'required|min_value:0.1' : ''}`" 
                    immediate v-slot="{ errors }">
                
                    <div class="form-group">
                        <label>難易度</label>
                        <ns-number-input 
                            v-model="cLevelOfDifficulty"
                            step="0.1"
                            min="0"
                            class="mr-3" />
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>



            </div>            
        </div>

        <div class="row">
            <div class="col-12">
                <span style="white-space: pre-wrap">{{cMaterialDescription}}</span>
            
            </div>

        </div>


        <div class="row pt-3" v-show="$$cIsDebug">
            <div class="col-12 col-xl-2">                
                <div class="form-group">
                    <label>材料コスト</label>
                    <div>{{cPrimarCostPerSqm}}</div>
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


import TProductProcessMixins from "./../../../../mixins/tProject/TProductProcessMixins" ;
import ProcessDynamicGetSetComputedMixins from '../../../../mixins/tProject/ProcessDynamicGetSetComputedMixins';

export default {    
    mixins : [TProductProcessMixins ,ProcessDynamicGetSetComputedMixins] , 
    data : function() {
        return {
            // これがないとReactiveが動作しない
            dValue : {} , 
            
             
            dComputedGetSetDefs : [
                // 材料ID
                { key:'cMMaterialId' ,propName:"MMaterialId01"} ,                
                // 難易度
                { key:'cLevelOfDifficulty' ,propName:"LevelOfDifficulty" } ,   


            ] , 

            dComputedGetDefs : [          
                // TProject
                { key:'cTProduct' ,propName:"_t_project_product" } ,                       
                // 材料のプライマーカテゴリー
                { key:'cSubCatPrimarMKvId' ,propName:"SubCatPrimarMKvId" } ,      
                // 名称
                { key:'cMaterialName' ,propName:"MaterialName01" } ,
                // 正式名称
                { key:'cMaterialLongName' ,propName:"MaterialLongName01" } , 
                // 選択されたプライマー液の単価
                { key:'cPrimarCostPerSqm' ,propName:"PrimarCostPerSqm" } ,
                // 最大コストの資材詳細
                { key:'cMaterialDescription' ,propName:"MaterialDescription" } ,
                
            ] , 

        }
    } ,  

    computed : {},
    methods : {} ,
    created : function() {} ,

    
} 
</script>