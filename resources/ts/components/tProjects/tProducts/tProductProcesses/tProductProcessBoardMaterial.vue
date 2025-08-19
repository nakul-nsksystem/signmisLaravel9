<template>
    <div class="card-body app-card-body" >
        <div v-show="$$cIsDebug">
            {{m$cDisplay}}<br />
            <!-- {{cMaterialName4Emit}} -->
            
        </div>        

        <!-- 工程備考(MProcessCategory.Memo) -->
        <tProductProcessCMProcessMemo
            v-model="dValue"
        />

        <div class="d-none">
            {{cIsOrderNeeded}}
        </div>

        <div class="row">
            <div class="d-flex col-12 col-xlg-4">
                <!-- <div class="d-none">{{cH}}</div> -->
                <div class="flex-grow-1 form-group">
                    <label >カテゴリ</label>

                    <m-kv-select
                        v-model="cCategoryMKvId"
                        :kv-category-id="cMaterialSelectCategoryMKvId"
                        :disabled="!cIsEditable"
                        >
                    </m-kv-select>
                </div>

                <div class="flex-grow-0 flex-shrink-0 form-group text-center" style="flex-basis:60px;">
                    <label >支給</label>
                    <ns-checkbox-input
                        v-model="m$cIsCustomerProvide"
                        :id="'MaterialRollIsCustomerProvide'"
                        :disabled="!cIsEditable"
                        />
                </div>

                <div class="flex-grow-0 flex-shrink-0 form-group text-center" style="flex-basis:60px;">
                    <label >入力</label>
                    <ns-checkbox-input
                        v-model="cIsNotRefMaster"
                        :id="'MaterialRollIsNotRefMaster'"
                        :disabled="!cIsEditable"
                        />
                </div>

            </div>

            
            <div class="col-12 col-xlg-8">
                <div class="form-group ml-xlg-n3">                    
                    <label >
                        メディア 
                        <span v-if="cIsStocked && ! m$cIsCustomerProvide" class="ml-2 text-success">在庫品</span>
                        <span v-if="! cIsStocked && ! m$cIsCustomerProvide"  class="ml-2 text-danger">要発注品</span>
                        
                        
                    </label>             
                    <validation-provider name="メディア" 
                        vid="boardMaterial-cMMaterialId"
                        :rules="`${m$cIsEnabled && ! cIsNotRefMaster ? 'required|excluded:0' : ''}`" 
                        immediate v-slot="{ errors }">
                    
                        <m-material-select
                            v-show="!cIsNotRefMaster"
                            v-model="cMMaterialId"
                            :selected-item.sync="cSelectedMaterial"
                            :m-branch-id="m$cMBranchId"
                            :category-m-kv-id="cMaterialCategoryMKvId"
                            :sub-category-m-kv-id="cCategoryMKvId"     
                            :isDisplayName="true"    
                            :disabled="!cIsEditable"                  
                            >
                            </m-material-select>         
                        <span class="validation-error">{{ errors[0] }}</span>                            
                    </validation-provider>
                    <validation-provider name="メディア" 
                        vid="boardMaterial-cCustomMaterialName"
                        :rules="`${m$cIsEnabled && cIsNotRefMaster ? 'required' : ''}`" 
                        immediate v-slot="{ errors }">
                        <input 
                            v-show="cIsNotRefMaster"
                            v-model.lazy="cCustomMaterialName"
                            class="form-control" />
                        <span class="validation-error">{{ errors[0] }}</span>                            
                    </validation-provider>

                </div>
                
            </div>
            


        </div>

        <div v-if="cIsReady">
            <div class="row" >
                <div class="col-12 col-xl-3">
                    <validation-provider name="板割方法"
                        vid="boardMaterial-cMMaterialBoardLayoutType" 
                        :rules="`${m$cIsEnabled  ? 'required|excluded:0' : ''}`" 
                        immediate v-slot="{ errors }">

                        <div class="form-group">
                            <label>板割方法</label>
                            <select class="custom-select" 
                                v-model="cMMaterialBoardLayoutType" >                            
                                <option value=""></option>
                                <option :value="b$dLayoutModeManual" v-if="cIsAbleToSelectManualInput">入力</option>
                                <option :value="b$dLayoutModeRefMasterManual" v-if="cIsAbleToSelectSemiManualInput">規格選択</option>
                                <option :value="b$dLayoutModeRefMasterAuto" v-if="cIsAbleToSelectAuto" >自動</option>
                                
                                
                            </select>       
                            <span class="validation-error">{{ errors[0] }}</span>
                        </div>
                    </validation-provider>
                </div>
            </div>
            
            <div class="row">
                <div class="col-12">
                    <validation-provider name="リスト"
                        vid="boardMaterial-cBoardManualLayouts" 
                        :rules="`${m$cIsEnabled && cManagerManual.IsSelected ? 'required|excluded:0' : ''}`" 
                        immediate v-slot="{ errors }">
                        <input type="hidden" v-model.number="cManagerManual.Layouts.length" />
                        <span class="validation-error">{{ errors.length > 0 ? "１件以上登録してください" : ""}}</span>
                    </validation-provider>
                    
                    <boards-manual-editor-4-container
                        v-show="cManagerManual.IsSelected" 
                        v-model="cManagerManual"
                        />



                </div>
            </div>



            <div class="row">
                <div class="col-12">
                    <validation-provider name="リスト"
                        vid="boardMaterial-cBoardRefMasterManualLayouts" 
                        :rules="`${m$cIsEnabled && cManagerRefManual.IsSelected ? 'required|excluded:0' : ''}`" 
                        immediate v-slot="{ errors }">
                        <input type="hidden" v-model.number="cManagerRefManual.Layouts.length" />
                        <span class="validation-error">{{ errors.length > 0 ? "１件以上登録してください" : ""}}</span>
                    </validation-provider>
                    
                    <boards-ref-master-manual-editor-4-container
                        v-show="cManagerRefManual.IsSelected"
                        v-model="cManagerRefManual"
                        />
                </div>
            </div>

            <boards-ref-master-auto-editor-4-container
                v-model="cManagerRefAuto"
                v-if="cManagerRefAuto.IsSelected "
                :base64svg.sync="cBase64Svg"
                :mode.sync="cMMaterialBoardLayoutPriorityMode"
                :is-outsource-cut.sync="cMMaterialBoardLayoutIsAutoOutsourceCut"
                />
        </div>

        
        <div class="row mt-3">

            <div class="col-6 col-xl-2" >
                <div class="form-group">                
                    <label >重量</label>
                    <div>
                        {{cWeightPerSqm.toFixed(3)}} g/㎡
                    </div>
                </div>
            </div>
            <div class="col-6 col-xl-2" v-show="$$cIsDebug" >
                <label >単価/個</label>
                <div>
                    {{cMaterialPricePerQty.toFixed(0)}} 円
                </div>
            </div>


        </div>

        
        <div class="row">

            <div class="col-12 col-xl-6" v-show="cIsNotRefMaster && ! m$cIsCustomerProvide">
                <validation-provider name="仕入先" 
                    vid="material-cSupplierMCustomerId"
                    :rules="`${m$cIsEnabled && cIsNotRefMaster && ! m$cIsCustomerProvide ? 'required|excluded:0' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label>仕入先</label>
                        
                        <m-customer-ref-input 
                                v-model="m$cSupplierMCustomerId"
                                :m-branch-id="m$cMBranchId"             
                                :dealing-cds="[2]"
                                :selectedItem.sync="m$cSupplierMCustomer"
                                >
                            </m-customer-ref-input>
                        <!-- <m-customer-select
                                :m-branch-id="value.m_branch_id"
                                :dealing-cds="[2]"                            
                                v-model="cSupplierMCustomerId"
                            ></m-customer-select> -->
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>                                
                </validation-provider>
            </div>

            <div v-show="! cIsStocked && ! m$cIsCustomerProvide" 
                class="col-6 col-xl-2 text-center" >
                <div class="form-group" style="width:70px;">
                    <label >発注済み</label>
                    <div>
                        <ns-checkbox-input
                            :id="'boardMaterialPreOrderCheck'"
                            v-model="dValue.is_ordered"
                            :disabled="cIsPrecedingOrdered"/>
                    </div>
                </div>
            </div>
            <div v-show="! cIsStocked && ! m$cIsCustomerProvide && dValue.is_ordered" 
                class="col-6 col-xl-2" >
                <a class="p-0" href='#' @click.prevent="$emit('selectPrecedingOrder',dValue)">発注紐づけ</a>
                <!-- <button type="button" class="btn btn-info" title="先行発注紐づけ" @click.prevent="$emit('selectPrecedingOrder',dValue)">
                    <i class="fas fa-link fa-fw"></i>
                </button>                 -->
            </div>
            <div v-show="! cIsStocked && ! m$cIsCustomerProvide"
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

import TProductProcessUseBoardLayoutMixins from '../../../../mixins/tProject/TProductProcessUseBoardLayoutMixins';
import ProcessDynamicGetSetComputedMixins from '../../../../mixins/tProject/ProcessDynamicGetSetComputedMixins';
import NsCheckboxInput from '../../../commons/input/NsCheckboxInput.vue';
import NumberUtil from '../../../../frameworks/NumberUtil';

export default {
    components: { NsCheckboxInput },
    mixins : [TProductProcessUseBoardLayoutMixins, ProcessDynamicGetSetComputedMixins] ,     
    data : function() {
        return {
            // これがないとReactiveが動作しない
            dValue : {} , 

            dComputedGetSetDefs : [
                // タイプ
                { key:'cCategoryMKvId' ,propName:"CategoryMKvId" } ,
                // Base64Svg
                { key:'cBase64Svg' ,propName:"Base64Svg"} ,
                
                // 入力フラグ
                { key:'cIsNotRefMaster' ,propName:"IsNotRefMaster"} ,
                // 材料ID
                { key:'cMMaterialId' ,propName:"MMaterialId01"} ,
                // 材料
                { key:'cSelectedMaterial' ,propName:"m_material01" } ,
                // 手入力材料名
                { key:'cCustomMaterialName' ,propName:"CustomMaterialName"} ,
                // 貼り対象材料　明細タイプ
                { key:'cMMaterialBoardLayoutType' ,propName:"MMaterialBoardLayoutType"} ,

                // 材料板割マニュアル結果枚単価
                { key:'cMMaterialBoardManualCostPerQty' ,propName:"MMaterialBoardManualCostPerQty"} ,
                // 材料板割セミ自動結果枚単価
                { key:'cMMaterialBoardRefMasterManualCostPerQty' ,propName:"MMaterialBoardRefMasterManualCostPerQty"} ,
                // 貼り材料板割自動優先モード
                { key:'cMMaterialBoardLayoutPriorityMode' ,propName:"MMaterialBoardLayoutPriorityMode"} ,
                // 貼り対象材料　自動　Is外注カット
                { key:'cMMaterialBoardLayoutIsAutoOutsourceCut' ,propName:"MMaterialBoardLayoutIsAutoOutsourceCut" } ,                

                // 貼り材料板割自動結果枚単価
                { key:'cMMaterialBoardRefMasterAutoCostPerQty' ,propName:"MMaterialBoardRefMasterAutoCostPerQty"} ,


            ] , 

            dComputedGetDefs : [          
                // 材料カテゴリーMKvID
                { key:'cMaterialCategoryMKvId' ,propName:"MaterialCategoryMKvId" } ,
                // 材料カテゴリーフィルタ用MKvID
                { key:'cMaterialSelectCategoryMKvId' ,propName:"MaterialSelectCategoryMKvId" } ,
                // 名称
                { key:'cMaterialName' ,propName:"MaterialName01" } ,
                // 正式名称
                { key:'cMaterialLongName' ,propName:"MaterialLongName01" } ,                
                // 在庫品か　IsStoked
                { key:'cIsStocked' ,propName:"IsStocked" } ,        
                // 単価基準名
                { key:'cMaterialPriceKvName' ,propName:"MaterialPriceKvName" } ,
                // 重量/sqm
                { key:'cWeightPerSqm' ,propName:"WeightPerSqm" } ,
                // 材料単価/枚
                { key:'cMaterialPricePerQty' ,propName:"MaterialPricePerQty" } ,
                // 板寸法マニュアルモードの選択可否
                { key:'cIsAbleToSelectManualInput' ,propName:"IsAbleToSelectManualInput" } ,
                // 板寸法セミマニュアルモードの選択可否
                { key:'cIsAbleToSelectSemiManualInput' ,propName:"IsAbleToSelectSemiManualInput" } ,
                // 板寸法オートモードの選択可否
                { key:'cIsAbleToSelectAuto' ,propName:"IsAbleToSelectAuto" } ,                
                
                // 仕入先名
                { key:'cSupplierName' ,propName:"SupplierName" } ,
                // 仕入先正式名
                { key:'cSupplierLongName' ,propName:"SupplierLongName" } ,

                // 要発注
                { key:'cIsOrderNeeded' ,propName:"IsOrderNeeded" } ,
                // 発注済み
                { key:'cIsAlreadyOrdered' ,propName:"IsAlreadyOrdered" } ,
                // 先行発注済み
                { key:'cIsPrecedingOrdered' ,propName:"IsPrecedingOrdered" } ,
                
                { key:'cManager' ,propName:"Manager" } ,
                { key:'cManagerManual' ,propName:"ManagerManual" } ,
                { key:'cManagerRefManual' ,propName:"ManagerRefManual" } ,
                { key:'cManagerRefAuto' ,propName:"ManagerRefAuto" } ,
                { key:'cManagerLayouts' ,propName:"ManagerLayouts" } ,
                
                
            ] ,
            
        }
    } ,  
    
    computed : {
        /**
         * 板レイアウトコンポーネントロード準備
         */
        cIsReady : function() { 
            if ( this.cMMaterialId === undefined || this.cMMaterialId === 0 ) return true ; 

            return this.cSelectedMaterial !== undefined ;
        } ,

        cIsEditable : function() {
            const val = NumberUtil.invalid2zr(this.mainStore.getRole("t_project-price-view-permission")) ;
            return val >= 100 ||  !this.cIsAlreadyOrdered;        
        } ,

    } ,
    methods : {} ,
    created : function(){} ,
    mounted : function(){}
    
} 
</script>