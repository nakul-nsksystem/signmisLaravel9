<template>
    <div class="card-body app-card-body">
        <div v-show="$$cIsDebug">
            {{m$cDisplay}}<br />
            仕入先ID {{dValue.SupplierMCustomerId}}<br />
            仕入先名 {{dValue.SupplierName}}<br />
            仕入先正式名 {{dValue.SupplierLongName}}<br />
            工程名{{dValue.MProcessCategoryName}}<br />

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
        
        <!-- Validation用 -->
        <validation-provider name="外注先"
            vid="uvCoat-cOutsourceMProductionId"
            :rules="`${m$cIsEnabled ? 'required|excluded:0' : ''}`" 
            immediate v-slot="{ errors }">
            <ns-number-input class="d-none" v-model="m$cOutsourceMProductionId" />
            <span class="validation-error mb-2">{{ errors[0] }}</span>
        </validation-provider>
        
        <div class="row" v-show="$$cIsDebug">
            <div class="col-12 col-xl-2">                
                <div class="form-group">
                    <label >使用㎡数</label>
                    <div>{{dValue.TProjectProduct.SqmIncExt * dValue.TProjectProduct.Qty}} ㎡</div>
                </div>

            </div>
        </div>

        
        <!-- 生産性（予測時間) -->
        <tProductProcessCPredicted
            v-show="$$cIsDebug"
            v-model="dValue" />

        
        <div class="row">
            <div class="col-12">                
                <div class="form-group">
                    <label>備考</label>
                    <input type="text" 
                        v-model.lazy="dValue.memo"
                        class="form-control" placeholder="">
                </div>

            </div>
        </div>


        
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
            ] , 

            dComputedGetDefs : [

                
            ] ,            
        }
    } ,
    computed : {} ,     
    methods : { },
    created : function(){}
    
} 
</script>