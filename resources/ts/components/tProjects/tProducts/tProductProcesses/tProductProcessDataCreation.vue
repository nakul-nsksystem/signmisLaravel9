<template>
    <div class="card-body app-card-body">
        <div v-show="$$cIsDebug">
            {{m$cDisplay}}
            <!-- {{cSelectedOutsourceMCustomerId}} -->
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
            <div class="col-12  ">
                <div class="form-group">
                    <validation-provider name="作業内容"
                        vid="dataCreation-cWorkDetail"
                        :rules="`${m$cIsEnabled &&  m$cIsOutsource ? 'required' : ''}`" 
                        immediate v-slot="{ errors }">
                        <div class="form-group">
                            <label >作業内容</label>  
                            <input v-model.lazy="cWorkDetail"
                                class="form-control" placeholder="">
                            <span class="validation-error mb-2">{{ errors[0] }}</span>
                        </div>
                    </validation-provider>
                    <!-- <label>作業内容</label>
                    <input 
                        v-model.lazy="cWorkDetail"
                        class="form-control" />   -->
                </div>
                
            </div>
        </div>
        

        <div class="row" v-show="! m$cIsOutsource">
            <div class="col-12 col-xl-4">
                <validation-provider name="作業時間"
                    vid="dataCreation-cNumOfSupportTapes" 
                    :rules="`${m$cIsEnabled && ! m$cIsOutsource ? 'required|min_value:0.01' : ''}`" 
                    immediate v-slot="{ errors }">

                    <div class="form-group">
                        <label >作業時間</label>                    
                        <ns-number-input v-model="cWorkHour" step="0.01" />
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>
        </div>


        <div class="row" v-show="$$cIsDebug" >
            <div class="col-12 col-xl-2">

                <div class="form-group">
                    <label >作業秒数</label>                    
                    <div>{{cWorkSeconds}}</div>
                </div>
                
            </div>
            
        </div>  
        <div class="row">
            <div 
                v-show="m$cIsOutsource"
                class="col-6 col-xl-2 text-center" >
                <div class="form-group" style="width:70px;">
                    <label >発注済み</label>
                    <div>
                        <ns-checkbox-input
                            :id="'dataCreationPreOrderCheck'"
                            v-model="dValue.is_ordered"
                            :disabled="cIsPrecedingOrdered"/>
                    </div>
                </div>
            </div>
            <div v-show="m$cIsOutsource && dValue.is_ordered" 
                class="col-6 col-xl-2" >
                <a class="p-0" href='#' @click.prevent="$emit('selectPrecedingOrder',dValue)">発注紐づけ</a>
                <!-- <button type="button" class="btn btn-info" title="先行発注紐づけ" @click.prevent="$emit('selectPrecedingOrder',dValue)">
                    <i class="fas fa-link fa-fw"></i>
                </button> -->
            </div>
            <div
                v-show="m$cIsOutsource"
                class="col-6 col-xl-3 pl-xl-0">
                <div class="form-group">
                    <label>発注No</label>
                    <table class="table table-dark text-nowrap">
                        <tbody>
                            <tr v-for="poDs of dValue.t_p_order_details" :key="poDs.id">                                
                                <td>
                                   <div>
                                       <a :href='"v#/t_p_order/edit/"+poDs.t_p_order_id'>{{poDs.t_p_order_id}}</a>
                                        <span>-{{poDs.id}}</span>
                                        <span v-show="poDs.t_project_product_process_order_detail.is_preceding" class="badge badge-info">先発注</span> 
                                    </div> 
                                </td>
                                <td>
                                    <button 
                                        v-if="poDs.t_project_product_process_order_detail.is_preceding" 
                                        type="button" class="btn btn-danger"
                                        @click.prevent="dValue.unlinkPrecedingOrder(dValue,poDs.id)"
                                        >
                                        <i class="fas fa-unlink fa-fw"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
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
import ProcessDynamicGetSetComputedMixins from '../../../../mixins/tProject/ProcessDynamicGetSetComputedMixins';
import TProductProcessMixins from "./../../../../mixins/tProject/TProductProcessMixins" ;

export default {
    mixins : [TProductProcessMixins ,ProcessDynamicGetSetComputedMixins] ,     
    data : function() {
        return {
            // これがないとReactiveが動作しない
            dValue : {} , 

            
            dComputedGetSetDefs : [
                // 作業内容
                { key:'cWorkDetail' ,propName:"WorkDetail" } ,
                // 作業時間
                { key:'cWorkHour' ,propName:"WorkHour" } ,

            ] , 

            dComputedGetDefs : [          
                // TProject
                { key:'cTProduct' ,propName:"_t_project_product" } ,
                // 作業秒数
                { key:'cWorkSeconds' ,propName:"WorkSeconds" } ,
                //先行発注済
                { key:'cIsPrecedingOrdered' ,propName:"IsPrecedingOrdered" } ,


                
            ]


        }
    } ,  
    
    computed : {} ,
    methods : {} ,
    created : function() {} ,
    mounted : function() {} ,
    
} 
</script>