<template>
    <div class="card-body app-card-body">
        
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
            :is-use-options="true"
        />


        <div class="row" >
            <div class="pl-3 flex-grow-0 flex-shrink-0 form-group text-center" style="flex-basis:50px;">
                <label>is_01</label>
                <div>
                    <input type="checkbox" 
                        v-model="dValue.is_01">
                </div>
            
            </div>
            
            <div class="pl-3 flex-grow-0 flex-shrink-0 form-group text-center" style="flex-basis:50px;">
                <label>is_02</label>
                <div>
                    <input type="checkbox" 
                        v-model="dValue.is_02">
                </div>
            
            </div>
            
            <div class="pl-3 flex-grow-0 flex-shrink-0 form-group text-center" style="flex-basis:50px;">
                <label>is_03</label>
                <div>
                    <input type="checkbox" 
                        v-model="dValue.is_03">
                </div>
            
            </div>
            
            <div class="pl-3 flex-grow-0 flex-shrink-0 form-group text-center" style="flex-basis:50px;">
                <label>is_04</label>
                <div>
                    <input type="checkbox" 
                        v-model="dValue.is_04">
                </div>
            
            </div>

            <div class="pl-3 flex-grow-0 flex-shrink-0 form-group text-center" style="flex-basis:50px;">
                <label>is_05</label>
                <div>
                    <input type="checkbox" 
                        v-model="dValue.is_05">
                </div>
            
            </div>

            
        </div>


        <div class="row" >

            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label >n_01</label>                    
                    <ns-number-input 
                            v-model="dValue.n_01"/>
                </div>
            </div>
            
            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label >n_02</label>                    
                    <ns-number-input 
                            v-model="dValue.n_02"/>
                </div>
            </div>

            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label >n_03</label>                    
                    <ns-number-input 
                            v-model="dValue.n_03"/>
                </div>
            </div>

            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label >n_04</label>                    
                    <ns-number-input 
                            v-model="dValue.n_04"/>
                </div>
            </div>

            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label >n_05</label>                    
                    <ns-number-input 
                            v-model="dValue.n_05"/>
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
import TProductProcessMixins from "./../../../../mixins/tProject/TProductProcessMixins" ;
import MKvConst from "./../../../../consts/MKvsConst" ;


export default {
    mixins : [TProductProcessMixins] ,     
    data : function() {
        return {
            dValue : {} ,   
            dSelectedMaterial : undefined , 
        }
    } ,  
    computed :{
        

        
    } ,
    methods : {
        setDefaultValues : function () 
        {
            
        }

    } ,
    created : function() {
        this.setDefaultValues() ; 
        
        
    }

    
}
</script>