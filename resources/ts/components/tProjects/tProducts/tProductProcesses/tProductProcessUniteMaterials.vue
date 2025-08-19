<template>
    <div class="card-body app-card-body" >
        <div v-show="$$cIsDebug">
            {{m$cDisplay}}<br />
            IsOrderNeeded {{cIsOrderNeeded}}<br/>
            <div class="d-none">
            
                <!-- {{cTargetName}} -->
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
            :mode-label="'方法'"
            
        />

        <div class="d-none">
            <!-- {{m$cIsOrderNeeded}} -  -->
            {{cIsOrderNeeded}}
        </div>

        <div class="row">

            <div class="col-12 col-xl-2" >
                <validation-provider name="貼り秒数/枚"
                    vid="uniteMaterials-cSecPerQty" 
                    :rules="`${m$cIsEnabled ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label>貼り秒数/枚</label>
                        <ns-number-input 
                            v-model="cSecPerQty"                            
                            class=" mr-3" />
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>            
            <div class="flex-grow-0 flex-shrink-0 form-group text-center mb-0" style="flex-basis:100px;">
                <label >参考</label>
                <p class="mt-2">{{cRefSecPerQty.toFixed(1)}}秒/枚</p>
            </div>
            <div class="flex-grow-0 flex-shrink-0 form-group text-center mb-0" style="flex-basis:50px;">
                <label >支給</label>
                <ns-checkbox-input
                    v-model="m$cIsCustomerProvide"
                    :id="'checkUniteMaterialsIsCustomerProvide'"
                    />
            </div>
            <div class="flex-grow-0 flex-shrink-0 form-group mb-0" 
                 style="flex-basis:150px;">    
                 <validation-provider name="貼り対象"
                    vid="uniteMaterials-cTargetMKvId" 
                    :rules="`${m$cIsEnabled ? 'required|excluded:0' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label>貼り対象</label>
                        <m-kv-select
                            v-model="cTargetMKvId"
                            :kv-key="'t_project_product_process-unite-materials-target'">
                        </m-kv-select>         
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>
            <div v-show="cIsTargetBoard " 
                class="flex-grow-0 flex-shrink-0 form-group text-center mb-0 " 
                style="flex-basis:50px;">
                <label >入力</label>
                <ns-checkbox-input
                    v-model="cIsNotRefMaster"
                    :id="'checkUniteMaterialsIsNotRefMaster'"
                    />
                
            </div>
        </div>
        

        <div class="row">
            <!-- <div class="d-flex flex-wrap col-12 "> -->

            <div class="flex-grow-1 px-3" 
                v-show="cIsTargetBoard && ! cIsNotRefMaster">
                <validation-provider name="材料"
                    vid="uniteMaterials-cMMaterialId" 
                    :rules="`${m$cIsEnabled && ! cIsNotRefMaster && cIsTargetBoard && !m$cIsCustomerProvide ? 'required|excluded:0' : ''}`" 
                    immediate v-slot="{ errors }">
                
                    <div class="form-group" >
                        <label>材料</label>
                        <m-material-select
                            v-show="!cIsNotRefMaster"
                            v-model="cMMaterialId"
                            :selected-item.sync="cSelectedMaterial"
                            :m-branch-id="m$cMBranchId"
                            :filterMTagKeys="['m_materials-category_ut']"   
                            :isDisplayName="true"                       
                            />
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>

            </div>

            <div v-show="cIsTargetBoard && cIsNotRefMaster" 
                class="flex-grow-1 px-3">
                <validation-provider name="材料"
                    vid="uniteMaterials-cCustomMaterialName" 
                    :rules="`${m$cIsEnabled && !cIsTargetProduct && cIsNotRefMaster ? 'required' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group" >
                        <label >材料</label>           
                        <input 
                            v-model.lazy="cCustomMaterialName"
                            class="form-control" />

                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>

                </validation-provider>
                

            </div>
                  
            <div v-show="cIsTargetProduct" 
                class="flex-grow-1 px-3">
                <validation-provider name="商品"
                    vid="uniteMaterials-cTargetTProductId" 
                    :rules="`${m$cIsEnabled && cIsTargetProduct && ! m$cIsCustomerProvide ? 'required|excluded:0' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group" >
                        <label >商品</label>        
                        <select class="custom-select" 
                            v-model="cTargetTProductId" >                            
                            <option value=""></option>
                            <option v-for="n in cValidProducts" :key="n.id" :value="n.id">{{n.name}}</option>                        
                        </select>
                        <span class="validation-error">{{ errors[0] }}</span>
                        
                    </div>
                </validation-provider>
            </div>

            <!-- </div> -->
        </div>


        <div class="row">
            <div v-show="cIsViewSupplierInfo"
                class="col-12 col-xl-6">
                <validation-provider name="仕入先" 
                    vid="uniteMaterials-cSupplierMCustomerId"
                    :rules="`${m$cIsEnabled && cIsViewSupplierInfo  ? 'required|excluded:0' : ''}`" 
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
        </div>
        <div class="row">
            <!-- <div v-show="cIsViewSupplierInfo"
                class="col-6 col-xl-2 text-center" >
                <div class="form-group" style="width:70px;">
                    <label >発注済み</label>
                    <div   >
                        <input type="checkbox"                         
                            v-model="dValue.is_ordered"
                            placeholder="">
                    </div>
                </div>
            </div>



            <div v-show="cIsViewSupplierInfo"
                class="col-6 col-xl-2">
                <div class="form-group">
                    <label>発注No</label>
                    <p v-for="poDs of dValue.t_p_order_details" :key="poDs.id">
                        <a :href='"v#/t_p_order/edit/"+poDs.t_p_order_id'>{{poDs.t_p_order_id}}</a>
                        <span>-{{poDs.id}}</span> 
                    </p>
                </div>                                
            </div> -->

            <div v-show="cIsViewSupplierInfo" 
                class="col-6 col-xl-2 text-center" >
                <div class="form-group" style="width:70px;">
                    <label >発注済み</label>
                    <div>
                        <ns-checkbox-input
                            :id="'unitMaterialPreOrderCheck'"
                            v-model="dValue.is_ordered"
                            :disabled="cIsPrecedingOrdered"/>
                    </div>
                </div>
            </div>
            <div v-show="cIsViewSupplierInfo" 
                class="col-6 col-xl-2" >
                <a class="p-0" href='#' @click.prevent="$emit('selectPrecedingOrder',dValue)">発注紐づけ</a>
                <!-- <button type="button" class="btn btn-info" title="先行発注紐づけ" @click.prevent="$emit('selectPrecedingOrder',dValue)">
                    <i class="fas fa-link fa-fw"></i>
                </button>                    -->
            </div>
            <div v-show="cIsViewSupplierInfo"
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

        <div v-if="cIsReady || cIsNotRefMaster">

            <div class="row" v-show="cIsTargetBoard">
                <div class="col-12 col-xl-3">
                    <validation-provider name="板割方法"
                        vid="uniteMaterials-cMMaterialBoardLayoutType" 
                        :rules="`${m$cIsEnabled && cIsTargetBoard ? 'required|excluded:0' : ''}`" 
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

            <div class="row" v-show="cIsTargetBoard">
                <div class="col-12">
                    <validation-provider name="リスト"
                        vid="uniteMaterials-cBoardManualLayouts" 
                        :rules="`${m$cIsEnabled && cIsTargetBoard && cManagerManual.IsSelected ? 'required|excluded:0' : ''}`" 
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
            


            <div class="row" v-show="cIsTargetBoard">
                <div class="col-12">
                    <validation-provider name="リスト"
                        vid="uniteMaterials-cBoardRefMasterManualLayouts" 
                        :rules="`${m$cIsEnabled && cIsTargetBoard && cManagerRefManual.IsSelected ? 'required|excluded:0' : ''}`" 
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
                v-show="cIsTargetBoard && cManagerRefAuto.IsSelected "
                :base64svg.sync="cBase64Svg"
                :mode.sync="cMMaterialBoardLayoutPriorityMode"
                :is-outsource-cut.sync="cMMaterialBoardLayoutIsAutoOutsourceCut"
                />            
        </div>

        <div class="row" v-show="$$cIsDebug">          
                    
            <div class="col-12 col-xl-2" >
                <div class="form-group">
                    <label>材料単価</label>
                    <div>{{cIsMaterialCost}}</div>
                    
                </div>
            </div>
            <div class="col-12 col-xl-2" >
                <div class="form-group">
                    <label>材料単価/枚</label>
                    <div>{{cMaterialPricePerQty}}</div>
                </div>
            </div>
            <div class="col-12 col-xl-2" >
                <div class="form-group">
                    <label>板割 入力 可</label>
                    <div>{{cIsAbleToSelectManualInput}}</div>
                </div>
            </div>
            <div class="col-12 col-xl-2" >
                <div class="form-group">
                    <label>板割 規格選択 可</label>
                    <div>{{cIsAbleToSelectSemiManualInput}}</div>
                </div>
            </div>
            <div class="col-12 col-xl-2" >
                <div class="form-group">
                    <label>板割 自動 可</label>
                    <div>{{cIsAbleToSelectAuto}}</div>
                </div>
            </div>
            
                
        </div>
        <!-- {{cSelectedMMaterialDetails}} -->

        <!-- コスト・時間 -->
        <tProductProcessCPredicted
            v-show="$$cIsDebug"
            v-model="dValue" />

        <!-- 備考 -->
        <tProductProcessMemo
            v-model="dValue" />

        <!-- {{cMaterialBoardLayouts}} -->

    </div>

</template>

<script >
import ProcessDynamicGetSetComputedMixins from '../../../../mixins/tProject/ProcessDynamicGetSetComputedMixins';
import TProductProcessUseBoardLayoutMixins from '../../../../mixins/tProject/TProductProcessUseBoardLayoutMixins';

export default {    
    mixins : [TProductProcessUseBoardLayoutMixins,ProcessDynamicGetSetComputedMixins] , 
    data : function() {
        return {
            // これがないとReactiveが動作しない
            dValue : {} , 



            dComputedGetSetDefs : [
                // 入力フラグ
                { key:'cIsNotRefMaster' ,propName:"IsNotRefMaster"} ,
                // Base64Svg
                { key:'cBase64Svg' ,propName:"Base64Svg"} ,

                // 材料ID
                { key:'cMMaterialId' ,propName:"MMaterialId01"} ,
                // 材料
                { key:'cSelectedMaterial' ,propName:"m_material01" } ,

                // 貼り秒数/枚
                { key:'cSecPerQty' ,propName:"SecPerQty" } ,
                // 貼り対象 MKvId
                { key:'cTargetMKvId' ,propName:"TargetMKvId" } ,
                // 貼り対象商品ID
                { key:'cTargetTProductId' ,propName:"TargetTProductId" } ,

                // 貼り対象 手入力材料名
                { key:'cCustomMaterialName' ,propName:"CustomMaterialName" } ,
                
                // 貼り対象材料　明細タイプ
                { key:'cMMaterialBoardLayoutType' ,propName:"MMaterialBoardLayoutType" } ,
                // 貼り材料板割自動優先モード
                { key:'cMMaterialBoardLayoutPriorityMode' ,propName:"MMaterialBoardLayoutPriorityMode" } ,
                // 貼り対象材料　自動　Is外注カット
                { key:'cMMaterialBoardLayoutIsAutoOutsourceCut' ,propName:"MMaterialBoardLayoutIsAutoOutsourceCut" } ,                

                // 貼り材料板割マニュアル結果枚単価
                { key:'cMMaterialBoardManualCostPerQty' ,propName:"MMaterialBoardManualCostPerQty" } ,
                // 貼り材料板割セミ自動結果枚単価
                { key:'cMMaterialBoardRefMasterManualCostPerQty' ,propName:"MMaterialBoardRefMasterManualCostPerQty" } ,
                // 貼り材料板割自動結果枚単価
                { key:'cMMaterialBoardRefMasterAutoCostPerQty' ,propName:"MMaterialBoardRefMasterAutoCostPerQty" } ,
            ] , 

            dComputedGetDefs : [          
                // TProject
                { key:'cTProduct' ,propName:"_t_project_product" } ,     
                

                // 要発注
                { key:'cIsOrderNeeded' ,propName:"IsOrderNeeded" } ,
                // 発注済み
                { key:'cIsAlreadyOrdered' ,propName:"IsAlreadyOrdered" } ,
                //先行発注済
                { key:'cIsPrecedingOrdered' ,propName:"IsPrecedingOrdered" } ,
                
                // 参考貼り秒数/枚
                { key:'cRefSecPerQty' ,propName:"RefSecPerQty" } ,
                // 貼り対象が 商品
                { key:'cIsTargetProduct' ,propName:"IsTargetProduct" } ,
                // 貼り対象が 板材
                { key:'cIsTargetBoard' ,propName:"IsTargetBoard" } ,
                // 板寸法マニュアルモードの選択可否
                { key:'cIsAbleToSelectManualInput' ,propName:"IsAbleToSelectManualInput" } ,
                // 板寸法セミマニュアルモードの選択可否
                { key:'cIsAbleToSelectSemiManualInput' ,propName:"IsAbleToSelectSemiManualInput" } ,
                // 板寸法オートモードの選択可否
                { key:'cIsAbleToSelectAuto' ,propName:"IsAbleToSelectAuto" } ,                
                // 選択された貼り材料の明細
                { key:'cSelectedMMaterialDetails' ,propName:"MaterialDetails01" } ,
                // 貼り対象 材料単価/枚
                { key:'cMaterialPricePerQty' ,propName:"MaterialPricePerQty" } ,
                // 貼り材料計上フラグ
                { key:'cIsMaterialCost' ,propName:"IsMaterialCost" } ,

                
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
        /**
         * 発注情報が必要かどうか
         */
        cIsViewSupplierInfo : function() { 
            return this.cIsTargetBoard && this.cIsNotRefMaster && ! this.m$cIsCustomerProvide ; 
        } , 

        /**
         * 有効な商品のリスト（貼り対象に使用）
         *  ※ deleted_at == null && id !== undefined
         */
        cValidProducts : function() {
            if (this.tProject.t_project_products === undefined ) return [] ; 
            
            const list = this.tProject.t_project_products.filter(x => 
                x.deleted_at == null && 
                x.id !== undefined && 
                x.id !== this.tProduct.id) ;
            
            return list === undefined ? [] : list ;   


        } ,


    } ,


    methods : {
        setDefaultValues : function () 
        {
            this.dValue.target_products = this.cValidProducts ; 
        }        
    } ,
    created : function () {
        // Default設定
        this.setDefaultValues() ; 
        
        
    }
    
} 
</script>