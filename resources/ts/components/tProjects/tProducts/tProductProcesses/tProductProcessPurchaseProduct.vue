<template>
    <div class="card-body app-card-body">
        <div v-show="$$cIsDebug">
            {{m$cDisplay}}
            <div class="d-none">
                <!-- {{cSelectedCustomerName}} -->
            </div>
        </div>        

        <!-- 工程備考(MProcessCategory.Memo) -->
        <tProductProcessCMProcessMemo
            v-model="dValue"
        />

        <div class="row">
            <div class="col-12 ">
                <validation-provider name="商品名"
                    vid="purchaseProduct-cProductName" 
                    :rules="`${m$cIsEnabled ? 'required' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label >商品名</label>
                        <input 
                            v-model.lazy="cProductName"
                            class="form-control" />
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>
        </div>

        <div class="row">            
            <div class="col-12 col-xl-5">
                <validation-provider name="仕入先"
                    vid="purchaseProduct-cSupplierMCustomerId" 
                    :rules="`${m$cIsEnabled ? 'required|excluded:0' : ''}`" 
                    immediate v-slot="{ errors }">
                    
                    <div class="form-group">
                        <label>仕入先</label>
                        <m-customer-ref-input 
                            v-model="m$cSupplierMCustomerId"
                            :m-branch-id="m$cMBranchId"                                
                            :selected-item.sync="m$cSupplierMCustomer" 
                            :dealing-cds="[2,4]"
                            >
                        </m-customer-ref-input>

                        <!-- <m-customer-select                
                                v-model="m$cSupplierMCustomerId"
                                :m-branch-id="m$cMBranchId"
                                :selected-item.sync="dSelectedCustomer"
                                :dealing-cds="[2,4]"            
                            ></m-customer-select> -->
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>                   
                </validation-provider>             
            </div>

            <div class="col-12 col-xl-3 pl-3 pl-xl-0">
                <validation-provider name="数量(枚あたりの必要数)"
                    vid="purchaseProduct-cOutsourceQty" 
                    :rules="`${m$cIsEnabled ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group" >
                        <label >数量(枚あたりの必要数)</label>
                        <ns-number-input v-model="cOutsourceQty" />    
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>
            <div class="col-12 col-xl-2 pl-3 pl-xl-0">
                <validation-provider name="単価"
                    vid="purchaseProduct-cOutsourceCostByInput" 
                    :rules="`${m$cIsEnabled ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group ml-2" >
                        <label >単価</label>
                        <ns-number-input v-model="cOutsourceCostByInput" />    
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>
            <div class="col-12 col-xl-2 pl-3 pl-xl-0">
                <div class="form-group ml-2" >
                    <label >金額</label>
                    <div class="text-right">{{cOutsourceCost.toLocaleString()}}</div>
                    
                </div>
                                

            </div>


            
        </div>
        
        <div class="row">
            <div 
                class="col-6 col-xl-2 text-center" >
                <div class="form-group" style="width:70px;">
                    <label >発注済み</label>
                    <div>
                        <ns-checkbox-input
                            :id="'purchaseProductPreOrderCheck'"
                            v-model="dValue.is_ordered"
                            :disabled="cIsPrecedingOrdered"/>
                    </div>
                </div>
            </div>
            <div v-show="dValue.is_ordered" 
                class="col-6 col-xl-2" >
                <a class="p-0" href='#' @click.prevent="$emit('selectPrecedingOrder',dValue)">発注紐づけ</a>
                <!-- <button type="button" class="btn btn-info" title="先行発注紐づけ" @click.prevent="$emit('selectPrecedingOrder',dValue)">
                    <i class="fas fa-link fa-fw"></i>
                </button>                -->
            </div>
            <div
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
    mixins : [TProductProcessMixins , ProcessDynamicGetSetComputedMixins] ,     
    data : function() {
        return {
            // これがないとReactiveが動作しない
            dValue : {} , 
            // dSelectedCustomer : undefined , 


            dComputedGetSetDefs : [
                // 商品名
                { key:'cProductName' ,propName:"outsource_product_name" } ,
                // 仕入れ商品数量
                { key:'cOutsourceQty' ,propName:"OutsourceQty" } ,
                // 仕入れ手入力単価
                { key:'cOutsourceCostByInput' ,propName:"OutsourceCostByInput" } ,
                // 外注コスト
                { key:'cOutsourceCost' ,propName:"OutsourceCost" } ,
                
            ] , 

            dComputedGetDefs : [          
                // TProject
                { key:'cTProduct' ,propName:"_t_project_product" } ,

                // 仕入先名
                { key:'cSupplierName' ,propName:"SupplierName" } ,
                // 仕入先正式名
                { key:'cSupplierLongName' ,propName:"SupplierLongName" } ,
                //先行発注済
                { key:'cIsPrecedingOrdered' ,propName:"IsPrecedingOrdered" } ,


            ] , 
            
        }
    } ,  
    
    computed : {} ,
    methods : {} ,
    created : function() {} , 
    mounted : function() {}
    
} 
</script>