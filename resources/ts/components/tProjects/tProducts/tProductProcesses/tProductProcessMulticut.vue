<template>
    <div class="card-body app-card-body">
        <div v-show="$$cIsDebug">
            {{m$cDisplay}}
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
            :production-label="'加工機'"
            :m-process-category-m-production-no="1"    
        />

        

        
        
        <div class="row">
            
            <div class="col-12 col-xl-6 col-xlg-2">
                <validation-provider name="加工mm数"
                    vid="multiCut-cProcessLength" 
                    :rules="`${m$cIsEnabled ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">

                    <div class="form-group">
                        <label >加工mm数</label>                    
                        <ns-number-input 
                                v-model="cProcessLength"
                                :disabled="cIsRectangle"
                                placeholder="mm数" />
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>
            
            <div class="col-12 col-xl-6 col-xlg-2">                
                <div class="form-group">
                    <label >四角</label>                    
                    <ns-checkbox-input
                        v-model="cIsRectangle"
                        :id="'MultiCutIsRectangle'"
                        />
                </div>
                
            </div>

            <!-- <div class="col-12 col-xl-6 col-xlg-2 pl-xlg-0">
                <div class="form-group">
                    <label >カット回数</label>
                    <ns-number-input 
                            v-model="cTimesOfCut"
                            placeholder="回数" />

                </div>
            </div> -->
            <div class="col-12 col-xl-6 col-xlg-2 pl-xlg-0">
                <div class="form-group">
                    <label >カット回数</label>
                    <div>{{cProductionModeNumOfCut}}</div>

                </div>
            </div>


            <div class="col-12 col-xl-6 col-xlg-2 pl-xlg-0">
                <validation-provider name="難易度"
                    vid="multiCut-cLevelOfDifficulty" 
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


        </div>

        
        <!-- 生産先 -->
        <tProductProcessCMProduction
            v-model="dValue"
            :production-label="'作業'"
            :m-product-category-id="tProduct.m_product_category_id"
            :m-process-category-id="dValue.m_process_category_id"
            :mode-m-process-category-id="dValue.m_process_category_id"            
            :m-process-category-m-production-no="2"
        />


        
        <div class="row">
            <div class="col-12 d-flex">

                <div class="flex-grow-0 flex-shrink-0 form-group text-center" style="flex-basis:80px;">
                    <label >原寸原稿</label>    
                    <ns-checkbox-input
                        v-model="cIsOrgCopy"
                        :id="'MultiCutIsOrgCopy'"
                        />                            
                       
                </div>
                

            </div>
            
        </div>

        <div class="row" v-show="cIsOrgCopy">
            

            <div class="col-12 col-xl-6 col-xlg-4 ">
                <div class="form-group">
                    <label >原寸原稿サイズ</label>                                
                    <div class="row px-3">
                        <validation-provider name="W"
                            vid="multiCut-cOrgSizeW" 
                            :rules="`${m$cIsEnabled && cIsOrgCopy ? 'required|min_value:1' : ''}`" 
                            immediate v-slot="{ errors }">
                            <ns-number-input 
                                v-model="cOrgSizeW"
                                class="app-input-size mr-3" />
                            <span class="validation-error">{{ errors[0] }}</span>
                        </validation-provider>
                        <span class="h3">x</span>
                        <validation-provider name="H"
                            vid="multiCut-cOrgSizeH" 
                            :rules="`${m$cIsEnabled && cIsOrgCopy ? 'required|min_value:1' : ''}`" 
                            immediate v-slot="{ errors }">
                            <ns-number-input 
                                v-model="cOrgSizeH"
                                class="app-input-size ml-3" />
                            <span class="validation-error">{{ errors[0] }}</span>
                        </validation-provider>
                    </div>
                </div>
            </div>
            <div class="col-12 col-xl-3">                
                <div class="form-group">
                    <label>原寸原稿㎡数</label>
                    <div>{{cOrgSqm.toFixed(2)}}&nbsp;㎡</div>
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
    mixins : [TProductProcessMixins,ProcessDynamicGetSetComputedMixins] , 
    data : function() {
        return {
            dValue : {} , 
            
             
            dComputedGetSetDefs : [
                // 難易度
                { key:'cLevelOfDifficulty' ,propName:"LevelOfDifficulty" } ,   
                // 加工mm数
                { key:'cProcessLength' ,propName:"ProcessLength" } ,
                // Is四角カット
                { key:'cIsRectangle' ,propName:"IsRectangle" } ,
                // Is原寸原稿
                { key:'cIsOrgCopy' ,propName:"IsOrgCopy" } ,
                // 原寸原稿 W
                { key:'cOrgSizeW' ,propName:"OrgSizeW" } ,
                // 原寸原稿 H
                { key:'cOrgSizeH' ,propName:"OrgSizeH" } ,

            ] , 

            dComputedGetDefs : [          
                // TProject
                { key:'cTProduct' ,propName:"_t_project_product" } ,
                // Modeカット回数
                { key:'cProductionModeNumOfCut' ,propName:"ProductionModeNumOfCut" } ,
                // 原寸原稿 ㎡数
                { key:'cOrgSqm' ,propName:"OrgSqm" } ,
                
            ] , 

        }         
    } ,
    computed : {} ,
    methods : {} ,
    created : function(){} ,
    
} 
</script>