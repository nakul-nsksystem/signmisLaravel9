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
            :m-process-category-m-production-no="1"            
        />

        <div class="row">
            <div class="col-12">
                <validation-provider name="作業内容"
                    :vid="`postPvc-cWorkDetail${dRandom}`"
                    :rules="`${m$cIsEnabled ? 'required' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label >作業内容</label>  
                        <input v-model.lazy="cWorkDetail"
                            class="form-control" placeholder="">
                        <span class="validation-error mb-2">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>
        </div>

        <div class="row" v-show="! m$cIsOutsource">
            <div class="col-12 col-xl-3">                
                <div class="form-group">
                    <label>その他消耗品費</label>
                    <ns-number-input v-model="cMaterialCostPerQty" />                        
                </div>
            </div>
            
            <div v-show="! m$cIsOutsource" class="col-12 col-xl-2 pl-3 pl-xl-0">
                <validation-provider name="作業秒数/個"
                    :vid="`postPvc-cWorkSecondsPerQty${dRandom}`"
                    :rules="`${m$cIsEnabled && ! m$cIsOutsource ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label>作業秒数/個</label>
                        <ns-number-input v-model="cWorkSecondsPerQty" />
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
import ProcessDynamicGetSetComputedMixins from '../../../../mixins/tProject/ProcessDynamicGetSetComputedMixins';
import TProductProcessMixins from "./../../../../mixins/tProject/TProductProcessMixins" ;

export default {    
    mixins : [TProductProcessMixins ,ProcessDynamicGetSetComputedMixins] , 
    data : function() {
        return {
            dValue : {} , 
            dRandom : Math.random()  , 

            dComputedGetSetDefs : [      
                // 作業内容
                { key:'cWorkDetail' ,propName:"WorkDetail"} ,                
                // 作業見込み秒数
                { key:'cWorkSecondsPerQty' ,propName:"WorkSecondsPerQty" } ,   
                // 材料費
                { key:'cMaterialCostPerQty' ,propName:"MaterialCostPerQty" } ,   


            ] , 

            dComputedGetDefs : [          
                // TProject
                { key:'cTProduct' ,propName:"_t_project_product" } ,
                
            ] , 
        }         
    } ,
    methods : {
    } ,    
    computed : {
        /*---- カラム系 */
        /**
         * 作業内容
         */
        // cWorkDetailCName : function() {
        //     const colName = "s_01" ; 
        //     return colName ; 
        // } ,
        // cWorkDetail :{
        //     get :  function() {                
        //         return this.m$getValue(this.cWorkDetailCName) ;
        //     } ,
        //     set : function(val) {
        //         this.m$setValue(this.cWorkDetailCName , val ) ;  
        //     }
        // } ,

        // /**
        //  * 作業見込み秒数
        //  */
        // cWorkSecondsPerQtyCName : function() {
        //     const colName = "n_01" ; 
        //     return colName ; 
        // } ,
        // cWorkSecondsPerQty :{
        //     get :  function() {                
        //         return this.m$getValue(this.cWorkSecondsPerQtyCName) ;
        //     } ,
        //     set : function(val) {
        //         this.m$setValue(this.cWorkSecondsPerQtyCName , val ) ;  
        //     }
        // } ,

        // /**
        //  * 材料費
        //  */
        // cMaterialCostPerQtyCName : function() {
        //     const colName = "n_10" ; 
        //     return colName ; 
        // } ,
        // cMaterialCostPerQty :{
        //     get :  function() {                
        //         return this.m$getValue(this.cMaterialCostPerQtyCName) ;
        //     } ,
        //     set : function(val) {
        //         this.m$setValue(this.cMaterialCostPerQtyCName , val ) ;  
        //     }
        // } ,        
    } ,
    created : function() {
        // if ( ObjectUtil.isNU( this.cWorkSecondsPerQty )) this.cWorkSecondsPerQty  = 0 ; 
        // if ( ObjectUtil.isNU( this.cMaterialCostPerQty)) this.cMaterialCostPerQty = 0 ; 
        
    } , 
} 
</script>