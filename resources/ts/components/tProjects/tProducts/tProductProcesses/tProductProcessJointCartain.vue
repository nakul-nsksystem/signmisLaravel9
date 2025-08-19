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
        
        <!-- 生産先1 -->
        <tProductProcessCMProduction
            v-model="dValue"
            :m-product-category-id="tProduct.m_product_category_id"
            :m-process-category-id="dValue.m_process_category_id"            
            :mode-m-process-category-id="dValue.m_process_category_id"
            :m-process-category-m-production-no="1"
        />
        <!-- 生産先2 -->
        <tProductProcessCMProduction
            v-model="dValue"
            :m-product-category-id="tProduct.m_product_category_id"
            :m-process-category-id="dValue.m_process_category_id"     
            :mode-m-process-category-id="dValue.m_process_category_id"       
            :m-process-category-m-production-no="2"
        />



        <div class="row" v-show="$$cIsDebug">
            
            <div class="col-12 col-xl-5 col-xlg-2">
                <div class="form-group">
                    <label >継ぎ回数/枚</label>
                    <div class="row px-3 pt-1">                        
                        {{cNumOfJointPerQty}}&nbsp;回
                    </div>
                </div>
            </div>
            <div class="col-12 col-xl-5 col-xlg-2">
                <div class="form-group">
                    <label >継ぎmm数/枚</label>
                    <div class="row px-3 pt-1">                        
                        {{cJointLengthPerQty}}&nbsp;回
                    </div>
                </div>
            </div>
<!--             
            <div class="col-12 col-xl-5 col-xlg-2 pl-xl-0">
                <div class="form-group">
                    <label >必要人数</label>
                    <div class="row px-3 pt-1">                        
                        {{m$cNumOfWorkers}}&nbsp;人
                    </div>
                </div>
            </div> -->
            

        </div>

        <div class="row" v-show="$$cIsDebug">

            <div class="col-12 col-xl-5 col-xlg-2">
                <div class="form-group">
                    <label >ウェルダー長</label>
                    <div class="row px-3 pt-1">                        
                        {{cWelderLength}}&nbsp;mm
                    </div>
                </div>
            </div>
            <div class="col-12 col-xl-5 col-xlg-2 pl-xl-0">
                <div class="form-group">
                    <label >ウェルダー mm数</label>
                    <div class="row px-3 pt-1">                        
                        {{cJointLengthPerUnit}}&nbsp;mm&nbsp;(&nbsp;{{cNumOfWelder}}&nbsp;回&nbsp;) 
                    </div>
                </div>
            </div>
            <div class="col-12 col-xl-5 col-xlg-3 pl-xl-0">
                <div class="form-group">
                    <label >総ウェルダー回数/枚</label>
                    <div class="row px-3 pt-1">                        
                        {{cTotalNumOfWelderPerQty}}&nbsp;回
                    </div>
                </div>
            </div>
            <div class="col-12 col-xl-5 col-xlg-3 pl-xl-0">
                <div class="form-group">
                    <label >総ウェルダーm数/枚</label>
                    <div class="row px-3 pt-1">                        
                        {{(cTotalLengthOfWelderPerQty * 0.001).toFixed(2)}}&nbsp;m
                    </div>
                </div>
            </div>
            

        </div>

        
        <div class="row" v-show="$$cIsDebug">
            <div class="col-12 col-xl-5 col-xlg-4">
                <div class="form-group">
                    <label >テープ</label>
                    
                    <m-material-select
                        v-model="cTapeMMaterialId"
                        :selected-item.sync="dValue.m_material01"
                        :m-branch-id="m$cMBranchId"
                        :filterMTagKeys="['m_materials-category_joint_tape']"
                        :isDisplayName="true"                   
                        >
                        </m-material-select>   
                
                </div>
            </div>
            <div class="col-12 col-xl-5 col-xlg-3 pl-xl-0">
                <div class="form-group">
                    <label >必要mm数/箇所</label>
                    <div class="row px-3 pt-1">                        
                        {{cUseTapeLengthPerUnit}}&nbsp;mm
                    </div>
                </div>
            </div>
            <div class="col-12 col-xl-5 col-xlg-3 pl-xl-0">
                <div class="form-group">
                    <label >総テープ使用m数</label>
                    <div class="row px-3 pt-1">                        
                        {{cUseTapeLengthPerQty.toFixed(0)}}&nbsp;m
                    </div>
                </div>
            </div>
            <div class="col-12 col-xl-5 col-xlg-2 pl-xl-0">
                <div class="form-group">
                    <label >テープコスト</label>
                    <div class="row px-3 pt-1">                        
                        {{cTapeCost.toLocaleString()}}&nbsp;円
                    </div>
                </div>
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
import ProcessDynamicGetSetComputedMixins from '../../../../mixins/tProject/ProcessDynamicGetSetComputedMixins';
import TProductProcessMixins from "./../../../../mixins/tProject/TProductProcessMixins" ;



export default {    
    mixins : [TProductProcessMixins ,ProcessDynamicGetSetComputedMixins] , 
    data : function() {
        return {
            dValue : {} ,             

            
            dComputedGetSetDefs : [
                // テープ材料ID
                { key:'cTapeMMaterialId' ,propName:"MMaterialId01"} ,         


            ] , 

            dComputedGetDefs : [          
                // TProject
                { key:'cTProduct' ,propName:"_t_project_product" } ,                       
                // 総ウェルダーmm数/枚(個)   
                { key:'cWelderLength' ,propName:"WelderLength" } ,
                // ウェルダーが必要な回数
                { key:'cNumOfWelder' ,propName:"NumOfWelder" } ,
                // ウェルダー回数/箇所
                { key:'cTotalNumOfWelderPerQty' ,propName:"TotalNumOfWelderPerQty" } ,

                // 総ウェルダーmm数/枚(個)   
                { key:'cTotalLengthOfWelderPerQty' ,propName:"TotalLengthOfWelderPerQty" } ,
                // 継ぎmm数/箇所
                { key:'cJointLengthPerUnit' ,propName:"JointLengthPerUnit" } ,
                // 継ぎmm数/箇所
                { key:'cJointLengthPerQty' ,propName:"JointLengthPerQty" } ,
                // 継ぎ回数/個
                { key:'cNumOfJointPerQty' ,propName:"NumOfJointPerQty" } ,
                // 選択されたテープの単価
                { key:'cTapeCost' ,propName:"TapeCost" } ,      
                // テープ必要量/箇所
                { key:'cUseTapeLengthPerUnit' ,propName:"UseTapeLengthPerUnit" } ,
                // テープ必要量 / 枚
                { key:'cUseTapeLengthPerQty' ,propName:"UseTapeLengthPerQty" } ,
                
            ] , 
        }         
    } ,
    computed :{ } , 
    methods : {} ,
    created : function() {} , 
    
} 
</script>