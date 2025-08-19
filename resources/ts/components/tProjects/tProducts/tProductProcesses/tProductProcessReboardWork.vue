<template>
    <div class="card-body app-card-body">
        <div v-show="$$cIsDebug">
            {{m$cDisplay}}
            <div class="d-none">
                {{cEdgebandMaterialName}}
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
            :m-process-category-m-production-no="1"
            
        />

        <div class="row">
            <div class="col-12">
                <div class="form-group">
                    <label >作業内容</label>                    
                    <input v-model.lazy="cWorkDetail"
                        class="form-control" placeholder="">
                </div>
            </div>
        </div>

        <div class="row">

            <div class="col-12 col-xl-2 text-center">                            
                <div class="form-group">
                    <label >エッジバンド</label>
                    <ns-checkbox-input
                        v-model="cIsEdgeband"
                        :id="'ReboardWork-isEdgeband'"                            
                        />
                </div>
            </div>

        
            <div v-show="cIsEdgeband" class="col-12 col-xl-10 pl-xl-0">
                <validation-provider name="種類"
                    :vid="`reboardWork-cEdgebandMMaterialId`"                                        
                    :rules="`${m$cIsEnabled && cIsEdgeband ? 'required|excluded:0' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label >種類</label>                    
                        <m-material-select                        
                            v-model="cEdgebandMMaterialId"
                            :selected-item.sync="dValue.m_material01"
                            :m-branch-id="m$cMBranchId"
                            :sub-category-m-kv-id="cSubCatReboardAccessoryMKvId"
                            :isDisplayName="true"              
                            >
                            </m-material-select>      
                        <span class="validation-error mb-2">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
                <validation-provider name="エッジバンドタグ"
                    :vid="`reboardWork-cEdgebandMMaterialEdgebandTag`"                                        
                    :rules="`${m$cIsEnabled && cIsEdgeband ? 'required' : ''}`"                     
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <input type="hidden" v-model="cEdgebandTagType" />
                        <span class="validation-error mb-2" v-show="errors.length">エッジバンドのタグが材料マスタに設定されていません</span> 
                    </div>
                </validation-provider>      
            </div>


        </div>


        <div v-show="cIsEdgeband" class="row" >
            <div class="col-12 col-xlg-2">
                <validation-provider name="難易度"
                    vid="reboardWork-cLevelOfDifficulty" 
                    :rules="`${m$cIsEnabled && cIsEdgeband ? 'required|min_value:0.1' : ''}`" 
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

            <div class="col-12 col-xl-2 pl-3 pl-xl-0">
                <validation-provider name="必要長さ"
                    vid="reboardwork-cEdgebandLength"
                    :rules="`${m$cIsEnabled && cIsEdgeband > 0 ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label>必要長さ(mm)</label>
                        <ns-number-input v-model="cEdgebandLength" />
                        <span class="validation-error mb-2">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>

            <div v-show="$$cIsDebug" class="col-12 col-xl-2 pl-3 pl-xl-0">
                <div class="form-group">
                    <label>M単価</label>
                    <div>{{cEdgebandMaterialPricePerMater}}</div>
                </div>
            </div>
            
            <div v-show="$$cIsDebug" class="col-12 col-xl-2 pl-3 pl-xl-0">
                <div class="form-group">
                    <label>使用m数</label>
                    <div>{{cEdgebandMaterLength}}</div>
                </div>
            </div>


            <div v-show="$$cIsDebug" class="col-12 col-xl-2 pl-3 pl-xl-0">
                <div class="form-group">
                    <label>エッジタイプ</label>
                    <div>{{cEdgebandTagType}}</div>
                </div>
            </div>
            

        </div>        

        <div class="row">
        
            <div class="col-12 col-xl-3">                
                <div class="form-group">
                    <label>その他消耗品費</label>
                    <ns-number-input v-model="cExpenses" />                        
                </div>
            
            </div>

            <div class="col-12 col-xl-2 pl-3 pl-xl-0 text-center">                            
                <div class="form-group">
                    <label >組立</label>
                    <ns-checkbox-input
                        v-model="cIsAssembly"
                        :id="'ReboardWork-cIsAssembly'"                            
                        />
                </div>
            </div>

            
            <div v-show="cIsAssembly" class="col-12 col-xl-2 pl-3 pl-xl-0">
                <validation-provider name="組立秒数/個"
                    vid="reboardwork-cEdgebandLength"
                    :rules="`${m$cIsEnabled && cIsAssembly > 0 ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label>組立秒数/個</label>
                        <ns-number-input v-model="cAssemblyWorkSeconds" />
                        <span class="validation-error mb-2">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>


        </div>
        

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

import TProductProcessMixins from "../../../../mixins/tProject/TProductProcessMixins" ;
import ProcessDynamicGetSetComputedMixins from '../../../../mixins/tProject/ProcessDynamicGetSetComputedMixins';

export default {    
    mixins : [TProductProcessMixins,ProcessDynamicGetSetComputedMixins] ,     
    data : function() {
        return {
            
            dComputedGetSetDefs : [
                // 作業内容
                { key:'cWorkDetail' ,propName:"WorkDetail"} ,   
                // Isエッジバンド
                { key:'cIsEdgeband' ,propName:"IsEdgeband"} ,                   
                // エッジバンド材料ID
                { key:'cEdgebandMMaterialId' ,propName:"MMaterialId01"} ,         
                // 難易度
                { key:'cLevelOfDifficulty' ,propName:"LevelOfDifficulty"} ,         
                // エッジバンド使用長さmm数
                { key:'cEdgebandLength' ,propName:"EdgebandLength"} ,         
                // Is組み立て作業有り
                { key:'cIsAssembly' ,propName:"IsAssembly"} ,         
                // 消耗品費
                { key:'cExpenses' ,propName:"Expenses"} ,         
                // 組み立て作業秒数
                { key:'cAssemblyWorkSeconds' ,propName:"AssemblyWorkSeconds" } ,



            ] , 

            dComputedGetDefs : [          
                // TProject
                { key:'cTProduct' ,propName:"_t_project_product" } ,                       
                // エッジバンドカテゴリ　MkvId
                { key:'cSubCatReboardAccessoryMKvId' ,propName:"SubCatReboardAccessoryMKvId" } ,
                // エッジバンド名
                { key:'cEdgebandMaterialName' ,propName:"MaterialName01" } ,
                // Isエッジバンドが紙タイプ
                { key:'cIsEdgebandPaper' ,propName:"IsEdgebandPaper" } ,
                // Isエッジバンドが樹脂タイプ
                { key:'cIsEdgebandPlastic' ,propName:"IsEdgebandPlastic" } ,
                // エッジバンドタイプ
                { key:'cEdgebandTagType' ,propName:"EdgebandTagType" } ,
                // エッジバンド m単価
                { key:'cEdgebandMaterialPricePerMater' ,propName:"EdgebandMaterialPricePerMater" } ,
                // エッジバンド使用長さm 数
                { key:'cEdgebandMaterLength' ,propName:"EdgebandMaterLength" } ,

                
                
            ] , 
        }
    } ,  
    
    computed : {} ,
    methods : {} ,
    created : function() {} ,

    
} 
</script>