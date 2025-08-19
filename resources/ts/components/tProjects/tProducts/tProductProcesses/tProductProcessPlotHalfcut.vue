<template>
    <div class="card-body app-card-body">
        <div v-show="$$cIsDebug">
            {{m$cDisplay}}
            <div class="d-none">
                {{cAplicationMMaterialName}}
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
            :production-label="'プロッター'"
            :m-product-category-id="tProduct.m_product_category_id"
            :m-process-category-id="dValue.m_process_category_id"
            :mode-m-process-category-id="dValue.m_process_category_id"
            :m-process-category-m-production-no="1"
        />

        <div class="row">
            <div class="col-12 col-xl-6 col-xlg-2">
                <validation-provider name="加工mm数"
                    vid="plotHalfcut-cProcessLength" 
                    :rules="`${m$cIsEnabled ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">

                    <div class="form-group">
                        <label >加工mm数</label>                    
                        <ns-number-input 
                                v-model="cProcessLength"
                                placeholder="mm数" />
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>

            
            <div class="col-12 col-xl-6 col-xlg-2">
                <div class="form-group">
                    <label >参考加工mm数</label>                    
                    <p>
                        {{dValue.RefProcessLength.toLocaleString()}}
                    </p>
                </div>
                
            </div>
            
            

            <div class="flex-grow-0 flex-shrink-0 form-group pl-2" style="flex-basis:180px;">
                <validation-provider name="難易度"
                    vid="plotHalfcut-cLevelOfDifficulty" 
                    :rules="`${m$cIsEnabled ? 'required|min_value:0.1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label>難易度</label>
                        <ns-number-input 
                            v-model="cLevelOfDifficulty"
                            step="0.1"
                            min="0"
                            class="app-input-sm-size mr-3" />
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>
            <!--
            <div class="col-12 col-xlg-3">
                
                <div class="form-group">
                    <label >形状</label>
                    <m-kv-select
                        v-model="cShapeMKvId"
                        :kv-key="'t_project_product_process-plot-halfcut-shape'">
                    </m-kv-select>     
                </div>

            </div>

            <div class="col-12 col-xlg-3">
                <div class="form-group">
                    <label >書体</label>                    
                    <m-kv-select
                        v-model="cTypefaceMKvId"
                        :kv-key="'t_project_product_process-plot-halfcut-typeface'">
                    </m-kv-select>     
                </div>
            </div>
            <div class="col-12 col-xlg-3">
                <div class="form-group">
                    <label >ポイント数</label>                    
                    <m-kv-select
                        v-model="cFontsizeMKvId"
                        :kv-key="'t_project_product_process-plot-halfcut-fontsize'">
                    </m-kv-select>     

                </div>

            </div>                
            -->
        </div>


        <div class="row">
            <div class="col-12 d-flex">

                <div class="flex-grow-0 flex-shrink-0 form-group text-center" style="flex-basis:80px;">
                    <label >カストリ</label>                    
                     <ns-checkbox-input
                        v-model="cIsRemoveTrash"
                        :id="'PlotHalfCutIsRemoveTrash'"
                        />                            
                       
                </div>
                

            </div>
            
        </div>


        <div class="row">
            <div class="col-12 d-flex">

                <div class="flex-grow-0 flex-shrink-0 form-group text-center" style="flex-basis:80px;">
                    <label >アプリ</label>        
                    <ns-checkbox-input
                        v-model="cIsApplication"
                        :id="'PlotHalfCutIsApplication'"
                        />                            
                </div>

                <div v-show="cIsApplication" class="flex-grow-1" >
                    <validation-provider name="アプリメディア"
                        vid="plotHalfcut-cAplicationMMaterialId" 
                        :rules="`${m$cIsEnabled && cIsApplication ? 'required|excluded:0' : ''}`" 
                        immediate v-slot="{ errors }">
                        <div class="form-group" >
                
                            <label >アプリメディア</label>                 
                            <m-material-select
                                v-model="cAplicationMMaterialId"
                                :m-branch-id="m$cMBranchId"
                                :selected-item.sync="dValue.m_material01"
                                :sub-category-m-kv-id="cSubCatApplicationMKvId"
                                :isDisplayName="true"                   
                                >
                            </m-material-select>
                            <span class="validation-error">{{ errors[0] }}</span>
                        </div>
                    </validation-provider>
                </div>

                
                <div v-show="cIsApplication"
                    class="flex-grow-0 flex-shrink-0 form-group text-center" 
                    style="flex-basis:150px;">
                    <label >四隅小断</label>         
                     <ns-checkbox-input
                        v-model="cIsCutApplication"
                        :id="'PlotHalfCutIsCutApplication'"
                        />                            
                   

                </div>
                
            </div>


        </div>

        <div class="row" v-show="$$cIsDebug">
            <div class="col-12 col-xl-2">                
                <div class="form-group">
                    <label >アプリコスト</label>
                    <div>{{cApplicationCostPerSqm}} 円/㎡</div>
                </div>

            </div>
            <div class="col-12 col-xl-2">                
                <div class="form-group">
                    <label >アプリ幅</label>
                    <div>{{dValue.ApplicationWidth}} mm</div>
                </div>

            </div>
            <div class="col-12 col-xl-2">                
                <div class="form-group">
                    <label >アプリ貼り回数</label>
                    <div>{{cNumOfApplicationActions}} mm</div>
                </div>

            </div>
            
            <div class="col-12 col-xl-2">                
                <div class="form-group">
                    <label >アプリ総貼り長さ</label>
                    <div>{{cApplicationTotalLength}} mm</div>
                </div>

            </div>

        </div>

        
        <!-- 生産先 2 -->
        <tProductProcessCMProduction
            v-model="dValue"
            :m-product-category-id="tProduct.m_product_category_id"
            :m-process-category-id="dValue.m_process_category_id"
            :mode-m-process-category-id="dValue.m_process_category_id"
            :m-process-category-m-production-no="2"
        />

        <!-- 生産性/コスト -->
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
import MKvConst from "./../../../../consts/MKvsConst" ;
import NsNumberInput from '../../../commons/input/NsNumberInput.vue';
import ProcessDynamicGetSetComputedMixins from '../../../../mixins/tProject/ProcessDynamicGetSetComputedMixins';


export default {
  components: { NsNumberInput },
    mixins : [TProductProcessMixins , ProcessDynamicGetSetComputedMixins] ,     
    data : function() {
        return {
            dValue : {} , 
    
            dComputedGetSetDefs : [
                // 加工mm数
                { key:'cProcessLength' ,propName:"ProcessLength" } ,
                // 難易度
                { key:'cLevelOfDifficulty' ,propName:"LevelOfDifficulty" } ,
                // カストリ有無
                { key:'cIsRemoveTrash' ,propName:"IsRemoveTrash" } ,
                // アプリ有無
                { key:'cIsApplication' ,propName:"IsApplication" } ,
                // アプリ材料ID
                { key:'cAplicationMMaterialId' ,propName:"AplicationMMaterialId" } ,
                // アプリ貼り回数
                { key:'cNumOfApplicationActions' ,propName:"NumOfApplicationActions" } ,
                // アプリ貼り長さ
                { key:'cApplicationTotalLength' ,propName:"ApplicationTotalLength" } ,
                // アプリ四隅断裁有無
                { key:'cIsCutApplication' ,propName:"IsCutApplication" } ,

            ] , 

            dComputedGetDefs : [          
                // TProject
                { key:'cTProduct' ,propName:"_t_project_product" } ,
                // アプリサブカテゴリーMKV
                { key:'cSubCatApplicationMKvId' ,propName:"SubCatApplicationMKvId" } ,
                
                // アプリ材料名
                { key:'cAplicationMMaterialName' ,propName:"AplicationMMaterialName" } ,
                // アプリ材料名 
                { key:'cAplicationMMaterialLongName' ,propName:"AplicationMMaterialLongName" } ,                
                // アプリ材料コスト
                { key:'cApplicationCostPerSqm' ,propName:"ApplicationCostPerSqm"} ,
                // アプリ幅
                { key:'cApplicationWidth' ,propName:"ApplicationWidth"} ,
                
            ] ,

        }
    } ,  
    computed :{} ,
    methods : {} ,
    created : function() {} ,    
}
</script>