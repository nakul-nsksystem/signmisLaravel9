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
            :is-use-options="false"
        />

        <div class="row">
            <div class="d-flex col-12 col-xlg-4">
                <div class="flex-grow-0 flex-shrink-0 form-group text-center" style="flex-basis:60px;">
                    <label >両面</label>
                    <ns-checkbox-input
                        v-model="cIsDoubleFace"
                        :id="'LamiRollIsDoubleFace'"
                        />
                </div>


            </div>

            <div class="d-flex col-12 col-xlg-4" v-show="$$cIsDebug">
                <div>
                    <label >両面込㎡数</label>
                    {{cSqmIncDoubleFace}} ㎡　合計：{{cTotalCustomSqm}} ㎡
                </div>


            </div>
            
        </div> 

        <div class="row">
            <div class="d-flex col-12 col-xlg-4">                
                <div class="flex-grow-1 form-group">
                    <label >カテゴリ</label>

                    <m-kv-select
                        v-model="cCategoryMKvId"
                        :kv-key="cLamiSubCatMKvKey"
                        :disabled="!cIsEditable"
                        >
                    </m-kv-select>
                </div>

                <div class="flex-grow-0 flex-shrink-0 form-group text-center" style="flex-basis:60px;">
                    <label >支給</label>
                    <ns-checkbox-input
                        v-model="m$cIsCustomerProvide"
                        :id="'LamiRollIsCustomerProvide'"
                        :disabled="!cIsEditable"
                        />
                </div>

                <div class="flex-grow-0 flex-shrink-0 form-group text-center" style="flex-basis:60px;">
                    <label >入力</label>
                    <ns-checkbox-input
                        v-model="cIsNotRefMaster"
                        :id="'LamiRollIsNotRefMaster'"
                        :disabled="!cIsEditable"

                        />
                </div>


            </div>

            
            <div class="col-12 col-xlg-8">
                <div class="form-group ml-xlg-n3">                                                
                    <label >
                        ラミ材
                        <span v-if="cIsStocked && ! m$cIsCustomerProvide" class="ml-2 text-success">在庫品</span>
                        <span v-if="! cIsStocked && ! m$cIsCustomerProvide"  class="ml-2 text-danger">要発注品</span>
                        
                        
                    </label>             
                    <validation-provider name="ラミ材" 
                        vid="lami-cMMaterialId"
                        :rules="`${m$cIsEnabled && ! cIsNotRefMaster ? 'required|excluded:0' : ''}`" 
                        immediate v-slot="{ errors }">

                        <m-material-select
                            v-show="!cIsNotRefMaster"
                            v-model="cMMaterialId"
                            :selected-item.sync="cSelectedMaterial"
                            :m-branch-id="m$cMBranchId"
                            :category-m-kv-id="cLamiCatMKvId"
                            :sub-category-m-kv-id="cCategoryMKvId"     
                            :isDisplayName="true" 
                            :disabled="!cIsEditable"                  
                            >
                            </m-material-select>       
                        <span class="validation-error">{{ errors[0] }}</span>                            
                    </validation-provider>
                    
                    
                    <validation-provider name="ラミ材" 
                        vid="lami-cCustomMaterialName"
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
                <validation-provider name="メディア幅" 
                    vid="lami-cCustomSheetWidth"
                    :rules="`${m$cIsEnabled && cIsNotRefMaster ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label >メディア幅</label>
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
                    vid="lami-cCustomSheetHeight"
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
                    vid="lami-cCustomSheetValidHeight"
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
                    vid="lami-cIsWIn"
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
            <div class="col-12 col-xl-2">                
                <div class="form-group">
                    <label >流れmm/枚</label>
                    <div>{{cProcessHLengthPerQty.toFixed(2)}} mm</div>
                </div>

            </div>

            
            <div class="col-6 col-xl-2 pl-3 pl-xl-0" >
                <label >参考使用本数</label>
                <div>
                    {{cNumOfRollsNeeded.toFixed(2)}} 本
                </div>
            </div>

            <div class="col-6 col-xl-3 pl-3 pl-xl-0" v-show="cIsNotRefMaster && ! m$cIsCustomerProvide">
                <validation-provider name="メディア単価" 
                    vid="lami-cCustomSheetPricePerRoll"
                    :rules="`${m$cIsEnabled && cIsNotRefMaster  && ! m$cIsCustomerProvide ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label >メディア単価</label>
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
                        :id="'LamiRollIsCustomSheetPriceAsSpot'"
                        />
                </div>
            </div>            

        </div>

        <div class="row">
            <div v-show="cIsNotRefMaster && ! m$cIsCustomerProvide"
                class="col-12 col-xl-6">
                <validation-provider name="仕入先" 
                    vid="lami-cSupplierMCustomerId"
                    :rules="`${m$cIsEnabled && cIsNotRefMaster && ! m$cIsCustomerProvide  ? 'required|excluded:0' : ''}`" 
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
                            :id="'lamiPreOrderCheck'"
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
        <div class="row">
            <div class="col-12 col-xl-4" v-show="cIsMcs">
                <div class="form-group">
                    <label >MCSロットNo</label>
                    <input type="text" class="form-control" v-model="cMcsLotNo">
                </div>
            </div>

        </div>

        <div class="row" v-show="$$cIsDebug">

            <div class="col-6 col-xl-3">
                <label >メディア単価</label>
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
                { key:'cSelectedMaterial' ,propName:"m_material01" } ,

                // 手入力材料名
                { key:'cCustomMaterialName' ,propName:"CustomMaterialName"} ,
                // 手入力メディア幅
                { key:'cCustomSheetWidth' ,propName:"CustomSheetWidth"} ,
                // メディア 幅マージン
                { key:'cSheetWidthMargin' ,propName:"SheetWidthMargin"} ,
                // 手入力巻m数
                { key:'cCustomSheetHeight' ,propName:"CustomSheetHeight"} ,
                // 手入力有効 巻m数
                { key:'cCustomSheetValidHeight' ,propName:"CustomSheetValidHeight"} ,
                // 手入力メディアロール単価
                { key:'cCustomSheetPricePerRoll' ,propName:"CustomSheetPricePerRoll"} ,
                // 手入力メディア単価スポット
                { key:'cIsCustomSheetPriceAsSpot' ,propName:"IsCustomSheetPriceAsSpot"} ,

                // MCSロットNo
                { key:'cMcsLotNo' ,propName:"McsLotNo"} ,
                

            ] , 

            dComputedGetDefs : [          
                // TProject
                { key:'cTProduct' ,propName:"_t_project_product" } ,
                // ラミカテゴリMKV
                { key:'cLamiCatMKvId' ,propName:"LamiCatMKvId" } ,
                // ラミサブカテゴリMKVKey
                { key:'cLamiSubCatMKvKey' ,propName:"LamiSubCatMKvKey" } ,
                

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

                // 使用長さ/枚
                { key:'cProcessHLengthPerQty' ,propName:"ProcessHLengthPerQty" } ,
                

                // MCS判定
                { key:'cIsMcs' ,propName:"IsMcs" } ,
                
            ] , 
            
        }
    } ,  
    
    computed : {
        cIsEditable : function() {
            const val = NumberUtil.invalid2zr(this.mainStore.getRole("t_project-price-view-permission")) ;
            return val >= 100 ||  !this.cIsAlreadyOrdered;        
        } ,
    } ,
    methods : {} , 
    created : function() {} , 
    mounted : function() {}
    
} 
</script>