<template>

    <div class="card-body app-card-body">
        <div v-show="$$cIsDebug">
            {{m$cDisplay}}
        </div>
        <div v-show="$$cIsDebug">
            加工 {{cTotalProcessMater}} m
        </div>
        <div class="d-none">
            {{cIsOrderNeeded}}
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
        </div>
        <div class="row">
            <div class="d-flex col-12 col-xlg-2">         
                     
                <div class="flex-grow-0 flex-shrink-0 form-group text-center" style="flex-basis:60px;">
                    <label >支給</label>
                    <ns-checkbox-input
                        v-model="m$cIsCustomerProvide"
                        :id="'UnitRollMaterialIsCustomerProvide'"
                        :disabled="!cIsEditable"
                        />
                </div>

                <div class="flex-grow-0 flex-shrink-0 form-group text-center" style="flex-basis:60px;">
                    <label >入力</label>
                    <ns-checkbox-input
                        v-model="cIsNotRefMaster"
                        :id="'UnitRollMaterialIsNotRefMaster'"
                        :disabled="!cIsEditable"

                        />
                </div>


            </div>

            
            <div class="col-12 col-xlg-8">
                <div class="form-group ml-xlg-n3">                                                
                    <label >
                        貼り対象
                        <span v-if="cIsStocked && ! m$cIsCustomerProvide" class="ml-2 text-success">在庫品</span>
                        <span v-if="! cIsStocked && ! m$cIsCustomerProvide"  class="ml-2 text-danger">要発注品</span>
                        
                        
                    </label>             
                    <validation-provider name="貼り対象" 
                        vid="unitRoll-cMMaterialId"
                        :rules="`${m$cIsEnabled && ! cIsNotRefMaster ? 'required|excluded:0' : ''}`" 
                        immediate v-slot="{ errors }">
                        <m-material-select
                            v-show="!cIsNotRefMaster"
                            v-model="cMMaterialId"
                            :selected-item.sync="cUnitRollMaterial"
                            :m-branch-id="m$cMBranchId"
                            :filterMTagKeys="['m_materials-category_ut_roll']"   
                            :isDisplayName="true"    
                            />
                        <span class="validation-error">{{ errors[0] }}</span>                            
                    </validation-provider>
                    
                    
                    <validation-provider name="貼り対象" 
                        vid="unitRoll-cCustomMaterialName"
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


        <div class="row">
            <div class="col-6 col-xl-2">
                <validation-provider name="貼対象幅" 
                    vid="unitRoll-cCustomSheetWidth"
                    :rules="`${m$cIsEnabled && cIsNotRefMaster ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label >貼対象幅</label>
                        <ns-number-input v-show="cIsNotRefMaster" v-model="cCustomSheetWidth" />
                        <div class="mt-1" v-show="! cIsNotRefMaster">{{Math.floor(cMaxWSheet.w)}} mm</div>
                        <span class="validation-error">{{ errors[0] }}</span>                            
                    </div>
                </validation-provider>
            </div>
            <div class="col-6 col-xl-2 pl-xl-0">
                <div class="form-group">
                    <label >幅マージン</label>
                    <ns-number-input v-model="cSheetWidthMargin" />
                </div>
            </div>
            <div class="col-6 col-xl-2 pl-xl-0">
                <div class="form-group">
                    <label>有効幅</label>
                    <div class="mt-1">{{cSheetValidWidth}} mm</div>
                </div>                                
            </div>
            <div class="col-6 col-xl-2 pl-xl-0">
                <validation-provider name="巻m数" 
                    vid="unitRoll-cCustomSheetHeight"
                    :rules="`${m$cIsEnabled && cIsNotRefMaster ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label >巻m数</label>
                        <ns-number-input 
                            v-show="cIsNotRefMaster" v-model="cCustomSheetHeight" />
                        <div class="mt-1" v-show="! cIsNotRefMaster">
                            {{Math.floor(cMaxWSheet.h * 0.001)}} m
                        </div>
                        <span class="validation-error">{{ errors[0] }}</span>                            
                    </div>
                </validation-provider>
            </div>
            <div class="col-6 col-xl-2">
                <validation-provider name="有効巻m数" 
                    vid="unitRoll-cCustomSheetValidHeight"
                    :rules="`${m$cIsEnabled && cIsNotRefMaster ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label>有効巻m数</label>
                        <ns-number-input 
                            v-show="cIsNotRefMaster" v-model="cCustomSheetValidHeight" />
                        <div class="mt-1" v-show="! cIsNotRefMaster">
                            {{Math.floor(cMaxWSheet.hIncLoss * 0.001)}} m
                        </div>
                        <span class="validation-error">{{ errors[0] }}</span>                            
                    </div>
                </validation-provider>
            </div>
            <div class="col-6 col-xl-2">
                <validation-provider name="幅に入りません" 
                    vid="unitRoll-cIsWIn"
                    :rules="`${m$cIsEnabled ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label>幅判定</label>
                        <input class="d-none" v-model="cIsWIn" >
                        <div>{{cIsWIn ? "OK" : "NG"}}</div>
                        <span class="validation-error" v-show="errors.length > 0">幅に入りません</span>
                    </div>
                </validation-provider>
            </div>            
        </div> 
        <div class="row">
            <div class="col-12 col-xl-4 d-flex">                
                <div  style="flex-basis:240px;">
                    <div class="form-group">                
                        <label >サイズ</label>                
                        <div class="row px-3" >
                            <validation-provider name="W"  
                                vid="cUnitTargetW" 
                                :rules="`${m$cIsEnabled ? 'required|min_value:1' : ''}`" 
                                immediate v-slot="{ errors }">
                                <ns-number-input 
                                    class="app-input-size mr-3"
                                    v-model="cUnitTargetW" />
                                <span class="validation-error">{{ errors[0] }}</span>
                            </validation-provider>
                            <span class="h3">x</span>
                            <validation-provider name="H" 
                                vid="cUnitTargetH" 
                                :rules="`${m$cIsEnabled ? 'required|min_value:1' : ''}`" 
                                immediate v-slot="{ errors }">
                                <ns-number-input 
                                    class="app-input-size ml-3"
                                    v-model="cUnitTargetH" />
                                <span class="validation-error">{{ errors[0] }}</span>
                            </validation-provider>
                        </div>

                    </div>

                </div>

            </div>   
            <div class="col-12 col-xl-2 d-flex">    
                <validation-provider name="数量" 
                    vid="unitRoll-cUnitTargetQty"
                    :rules="`${m$cIsEnabled ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label> 数量</label>
                        <ns-number-input  v-model="cUnitTargetQty" />
                        <span class="validation-error">{{ errors[0] }}</span>                            
                    </div>
                </validation-provider>            
            </div>
            
            <div class="col-6 col-xl-2 pl-3" >
                <label >参考使用本数</label>
                <div>
                    {{cNumOfRollsNeeded.toFixed(2)}} 本
                </div>
            </div>

        </div>
        
        <div class="row">
            <!-- <div class="col-12 col-xl-2">                
                <div class="form-group">
                    <label >流れmm/枚</label>
                    <div>{{cProcessHLengthPerQty.toFixed(2)}} mm</div>
                </div>

            </div> -->

            
            

            <div class="col-6 col-xl-3 pl-3" v-show="cIsNotRefMaster && ! m$cIsCustomerProvide">
                <validation-provider name="貼対象単価" 
                    vid="unitRoll-cCustomSheetPricePerRoll"
                    :rules="`${m$cIsEnabled && cIsNotRefMaster  && ! m$cIsCustomerProvide ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label >貼対象単価</label>
                        <ns-number-input   v-model="cCustomSheetPricePerRoll" />
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>
            <div class="col-6 col-xl-2 pl-3 pl-xl-0" v-show="cIsNotRefMaster  && ! m$cIsCustomerProvide">
                <label >単価単位</label>
                <div class="mt-1" v-show="cIsNotRefMaster">1本単価</div>
                <div class="mt-1" v-show="! cIsNotRefMaster">{{cMaterialPriceKvName}}</div>
            </div>


            <div class="col-6 col-xl-2 text-center pl-3 pl-xl-0" v-show="cIsNotRefMaster && ! m$cIsCustomerProvide">
                <label >スポット使用</label>
                <div >
                    <ns-checkbox-input
                        v-model="cIsCustomSheetPriceAsSpot"
                        :id="'unitRollRollIsCustomSheetPriceAsSpot'"
                        />
                </div>
            </div>            

        </div>

        <div class="row">
            <div v-show="cIsNotRefMaster && ! m$cIsCustomerProvide"
                class="col-12 col-xl-6">
                <validation-provider name="仕入先" 
                    vid="unitRoll-cSupplierMCustomerId"
                    :rules="`${m$cIsEnabled && cIsNotRefMaster && ! m$cIsCustomerProvide  ? 'required|excluded:0' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label>仕入先</label>
                        
                        <m-customer-ref-input 
                            v-model="m$cSupplierMCustomerId"
                            :m-branch-id="m$cMBranchId"             
                            :dealing-cds="[2]"
                            :selectedItem.sync="m$cSupplierMCustomer"
                            />
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
                            :id="'unitRollPreOrderCheck'"
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
                </button>       -->
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

        <div class="row" v-show="$$cIsDebug">

            <div class="col-6 col-xl-3">
                <label >貼対象単価</label>
                <div class="mt-1" v-show="! cIsNotRefMaster">
                    {{cMaxWSheet.cost.toFixed(2)}} 
                </div>                
            </div>

            

            <div class="col-6 col-xl-2" >
                <label >㎡数/枚</label>
                <div  >
                    {{cSqmPerQty.toFixed(3)}} sqm
                </div>
            </div>
            
            
            <div class="col-6 col-xl-2">
                <div class="form-group">
                    <label>使用㎡数</label>
                    <div class="mt-1">{{cSqm}} ㎡</div>
                </div>                                
            </div>


            <div v-show="cIsNotRefMaster" class="col-6 col-xl-2" >
                <label >計算㎡単価</label>
                <div v-show="!cIsStocked && ! m$cIsCustomerProvide" >
                    {{cPricePerSqm.toFixed(0)}} 円
                </div>
            </div>


        </div>

        <div class="row" v-show="$$cIsDebug">
            <div class="col-12">
                <simple-roll-layout-simulation 
                    :sheets="dValue.main_material_roll_sheets"
                    :rects="cSheetRects"
                    :sheetMarginT="0"
                    :sheetMarginB="0"
                    :sheetMarginL="0"
                    :sheetMarginR="0"
                    :qty="cTotalQty"
                    :is-view-info="false"
                    :ng-list.sync="dLayoutNgList"
                    :ok-list.sync="cLayoutOkList"
                />
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
import NumberUtil from '../../../../frameworks/NumberUtil';


export default {
    mixins : [TProductProcessMixins, ProcessDynamicGetSetComputedMixins] ,     
    data : function() {
        return {
            // これがないとReactiveが動作しない
            dValue : {} , 
            dLayoutNgList   : [] , 
            dLayoutOkList   : [] , 

            dComputedGetSetDefs : [
                // タイプ
                { key:'cCategoryMKvId' ,propName:"CategoryMKvId" } ,
                // 入力フラグ
                { key:'cIsNotRefMaster' ,propName:"IsNotRefMaster"} ,
                // 両面フラグ
                { key:'cIsDoubleFace' ,propName:"IsDoubleFace"} ,
                // 両面込の合計Sqm
                { key:'cSqmIncDoubleFace' ,propName:"SqmIncDoubleFace"} ,
                // 両面込の合計Sqm
                { key:'cTotalCustomSqm' ,propName:"TotalCustomSqm"} ,
                

                // 材料ID
                { key:'cMMaterialId' ,propName:"MMaterialId01"} ,
                // 材料
                { key:'cUnitRollMaterial' ,propName:"UnitRollMaterial" } ,

                // 手入力材料名
                { key:'cCustomMaterialName' ,propName:"CustomMaterialName"} ,
                // 手入力貼対象幅
                { key:'cCustomSheetWidth' ,propName:"CustomSheetWidth"} ,
                // 貼対象 幅マージン
                { key:'cSheetWidthMargin' ,propName:"SheetWidthMargin"} ,
                // 手入力巻m数
                { key:'cCustomSheetHeight' ,propName:"CustomSheetHeight"} ,
                // 手入力有効 巻m数
                { key:'cCustomSheetValidHeight' ,propName:"CustomSheetValidHeight"} ,
                // 手入力貼対象ロール単価
                { key:'cCustomSheetPricePerRoll' ,propName:"CustomSheetPricePerRoll"} ,
                // 手入力貼対象単価スポット
                { key:'cIsCustomSheetPriceAsSpot' ,propName:"IsCustomSheetPriceAsSpot"} ,
                // 貼り秒数/枚
                { key:'cSecPerQty' ,propName:"SecPerQty" } ,

                // 使用寸法W
                { key:'cUnitTargetW' ,propName:"UnitTargetW"} ,
                // 使用寸法H
                { key:'cUnitTargetH' ,propName:"UnitTargetH" } ,
                // 使用枚数
                { key:'cUnitTargetQty' ,propName:"UnitTargetQty" } ,
                
                //レイアウト
                { key:'cLayoutOkList' ,propName:"LayoutOkList" } ,
                                

            ] , 

            dComputedGetDefs : [          
                // TProject
                { key:'cTProduct' ,propName:"_t_project_product" } ,

                // 総加工m数
                { key:'cTotalProcessMater' ,propName:"TotalProcessMater" } ,
                // 名称
                { key:'cMaterialName' ,propName:"MaterialName01" } ,
                // 正式名称
                { key:'cMaterialLongName' ,propName:"MaterialLongName01" } ,                
                // 在庫品か　IsStoked
                { key:'cIsStocked' ,propName:"IsStocked" } ,        
                // 単価基準名
                { key:'cMaterialPriceKvName' ,propName:"MaterialPriceKvName" } ,
                // 幅方向入るかの判定
                { key:'cIsWIn' ,propName:"IsWIn" } ,
                

                // 重量/sqm
                // { key:'cWeightPerSqm' ,propName:"WeightPerSqm" } ,
                // トータル使用㎡数
                { key:'cSqm' ,propName:"Sqm" } ,
                // トータル使用㎡数/枚
                { key:'cSqmPerQty' ,propName:"SqmPerQty" } ,
                // 参考使用本数
                { key:'cNumOfRollsNeeded' ,propName:"NumOfRollsNeeded" } ,
                // 計算後㎡単価
                { key:'cPricePerSqm' ,propName:"PricePerSqm" } ,
                

                // 仕入先名
                { key:'cSupplierName' ,propName:"SupplierName" } ,
                // 仕入先正式名
                { key:'cSupplierLongName' ,propName:"SupplierLongName" } ,

                // 手入力時 発注サイズ
                { key:'cOrderSize' ,propName:"OrderSize" } ,
                // 手入力時 発注単価
                { key:'cOrderPrice' ,propName:"OrderPrice" } ,
                
                // 最大シート
                { key:'cMaxWSheet' ,propName:"MaxSheet" } ,

                // 最大有効シートW
                { key:'cSheetValidWidth' ,propName:"SheetValidWidth" } ,
                // 最大有効シートH
                { key:'cSheetValidHeight' ,propName:"SheetValidHeight" } ,                
                
                
                // 要発注
                { key:'cIsOrderNeeded' ,propName:"IsOrderNeeded" } ,
                // 発注済み
                { key:'cIsAlreadyOrdered' ,propName:"IsAlreadyOrdered" } ,
                //先行発注済
                { key:'cIsPrecedingOrdered' ,propName:"IsPrecedingOrdered" } ,


                // 参考貼り秒数/枚
                { key:'cRefSecPerQty' ,propName:"RefSecPerQty" } ,

                // レイアウト用配列
                { key:'cSheetRects' ,propName:"SheetRects" } ,

                
                
            ] , 
            
        }
    } ,  
    
    computed : {
        cIsEditable : function() {
            const val = NumberUtil.invalid2zr(this.mainStore.getRole("t_project-price-view-permission")) ;
            return val >= 100 ||  !this.cIsAlreadyOrdered;        
        } ,
        cTotalQty : function() {
            return this.dValue.TProjectProduct.qty * this.cUnitTargetQty
        }
    } ,
    methods : {} , 
    created : function() {} , 
    mounted : function() {}
    
} 
</script>