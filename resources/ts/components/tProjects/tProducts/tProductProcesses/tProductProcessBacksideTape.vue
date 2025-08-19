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
        />

        
        <div class="row">
            <div class="col-6 col-xl-6">
                <validation-provider name="両面テープ"
                    vid="backsideTape-cMMaterialId" 
                    :rules="`${m$cIsEnabled ? 'required|excluded:0' : ''}`" 
                    immediate v-slot="{ errors }">

                    <div class="form-group">
                        <label>両面テープ</label>
                        <m-material-select
                                v-model="cMMaterialId"
                                :m-branch-id="m$cMBranchId"
                                :selected-item.sync="dValue.m_material01"                        
                                :sub-category-m-kv-id="cSubCatDoubleSideTapeMKvId"
                                :isDisplayName="true"                   
                                >
                            </m-material-select>
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>

            <div class="col-12 col-xl-3 pl-3 pl-xl-0">
                <validation-provider name="方法"
                    vid="backsideTape-cWayMKvId" 
                    :rules="`${m$cIsEnabled ? 'required|excluded:0' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label >方法</label>                    
                        <m-kv-select
                            v-model="cWayMKvId"
                            :kv-key="'t_project_product_process-backside-tape-way'">
                        </m-kv-select>                                 
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>

            </div>
        </div>

        
        <div class="row" v-show="cIsWayAll">
            
            <div class="col-12 col-xl-3 pl-3">
                <validation-provider name="余分長さ倍率"
                    vid="backsideTape-cExpandRateOfTapeLength" 
                    :rules="`${m$cIsEnabled && cIsWayAll ? 'required|min_value:0' : ''}`" 
                    immediate v-slot="{ errors }">

                    <div class="form-group">
                        <label >余分長さ倍率</label>                    
                        <ns-number-input v-model="cExpandRateOfTapeLength"
                            step="0.1" />
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>


        </div>

        <div class="row" v-show="cIsWayFrame">
            
            <div class="col-12 col-xl-3 pl-3">
                <validation-provider name="長手補強テープ本数"
                    vid="backsideTape-cNumOfSupportTapes" 
                    :rules="`${m$cIsEnabled && cIsWayFrame ? 'required|min_value:0' : ''}`" 
                    immediate v-slot="{ errors }">

                    <div class="form-group">
                        <label >長手補強テープ本数</label>                    
                        <ns-number-input v-model="cNumOfSupportTapes" />
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>


        </div>

        <div class="row">
            
        </div>


        <!-- 生産性（予測時間) -->
        <tProductProcessCPredicted
            v-show="$$cIsDebug"
            v-model="dValue" />
        
        <!--  -->
        <div class="row" v-show="$$cIsDebug">

            <div class="col-6 col-xl-2">
                <label >メディア単価</label>
                <div >
                    {{cMaterialPricePerMater}} 
                </div>                
            </div>

            
            <div class="col-6 col-xl-2 pl-3 pl-xl-0">
                <label >テープ幅</label>
                <div >
                    {{cMaterialWidth}} mm
                </div>                
            </div>

            <div class="col-6 col-xl-2 pl-3 pl-xl-0">
                <label >周囲テープ長さ</label>
                <div >
                    {{cTapePerimeterMaterLength}} m
                </div>                
            </div>

            
            <div class="col-6 col-xl-2 pl-3 pl-xl-0">
                <label >長手補強テープ長</label>
                <div >
                    {{cSupportTapeMaterLength}} m
                </div>                
            </div>

            
            <div class="col-6 col-xl-2 pl-3 pl-xl-0">
                <label >総テープ長</label>
                <div >
                    {{cTotalTapeMaterLength}} m
                </div>                
            </div>

            <div class="col-6 col-xl-2 pl-3 pl-xl-0">
                <label >テープカット回数</label>
                <div >
                    {{cNumOfCut}} 回
                </div>                
            </div>            
        </div>

        <!-- 備考 -->
        <tProductProcessMemo
            v-model="dValue" />


    </div>
</template>


<script>
import ProcessDynamicGetSetComputedMixins from '../../../../mixins/tProject/ProcessDynamicGetSetComputedMixins';
import TProductProcessMixins from "./../../../../mixins/tProject/TProductProcessMixins" ;

export default {
    mixins : [TProductProcessMixins , ProcessDynamicGetSetComputedMixins] , 
    data : function() {
        return {
            dValue : {} , 
            
             
            dComputedGetSetDefs : [
                // タイプ
                { key:'cCategoryMKvId' ,propName:"CategoryMKvId" } ,
                // 材料ID
                { key:'cMMaterialId' ,propName:"MMaterialId01"} ,
                // 材料
                { key:'cSelectedMaterial' ,propName:"m_material01" } ,                
                // テープ貼り方
                { key:'cWayMKvId' ,propName:"WayMKvId" } ,                
                // テープ余分長さ倍率
                { key:'cExpandRateOfTapeLength' ,propName:"ExpandRateOfTapeLength" } ,                
                // 長手補強テープ本数
                { key:'cNumOfSupportTapes' ,propName:"NumOfSupportTapes" } ,                

            ] , 

            dComputedGetDefs : [          
                // TProject
                { key:'cTProduct' ,propName:"_t_project_product" } ,
                // 両面テープのカテゴリMkvId
                { key:'cSubCatDoubleSideTapeMKvId' ,propName:"SubCatDoubleSideTapeMKvId" } ,
                
                // 名称
                { key:'cMaterialName' ,propName:"MaterialName01" } ,
                // 正式名称
                { key:'cMaterialLongName' ,propName:"MaterialLongName01" } ,                                           
                // テープ材料コスト
                { key:'cMaterialPricePerMater' ,propName:"MaterialPricePerMater" } ,                   
                
                
                // 方法が全ベタ
                { key:'cIsWayAll' ,propName:"IsWayAll" } ,                           
                // テープ長さに対応する長さ(余分率反映済み)
                { key:'cIsWayFrame' ,propName:"IsWayFrame" } ,                           


                // 周囲貼りm数
                { key:'cTapePerimeterMaterLength' ,propName:"TapePerimeterMaterLength" } ,                           

                // テープ幅
                { key:'cMaterialWidth' ,propName:"MaterialWidth" } ,                                           
                // テープ幅に対応する長さ(余分率反映済み)
                { key:'cExpandedLength4TapeWidth' ,propName:"ExpandedLength4TapeWidth" } ,                           
                // テープ長さに対応する長さ(余分率反映済み)
                { key:'cExpandedLength4TapeLength' ,propName:"ExpandedLength4TapeLength" } ,                           
                
                // 長手補強テープm数
                { key:'cSupportTapeMaterLength' ,propName:"SupportTapeMaterLength" } ,                           
                // 総テープm数
                { key:'cTotalTapeMaterLength' ,propName:"TotalTapeMaterLength" } ,                           
                // テープカット回数
                { key:'cNumOfCut' ,propName:"NumOfCut" } ,                           

                
                
            ] , 

        }         
    } ,
    computed : { } ,
    methods : {} ,
    created : function(){} ,
    
} 
</script>