<template>
    <div class="card-body app-card-body">
        <div v-show="$$cIsDebug">
            {{m$cDisplay}}
            
            <!-- {{dValue.test}} -->
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
                        vid="material-cMMaterialId"
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
                        vid="material-cCustomMaterialName"
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
            <div class="col-6 col-xl-3">
                <validation-provider name="メディア幅" 
                    vid="material-cCustomSheetWidth" 
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
                    <div class="mt-1">{{dValue.SheetValidWidth}} mm</div>
                </div>                                
            </div>
            <div class="col-6 col-xl-2 pl-xl-0">
                <validation-provider name="巻m数" 
                    vid="material-cCustomSheetHeight" 
                    :rules="`${m$cIsEnabled && cIsNotRefMaster ? 'required|min_value:1|max_value:999' : ''}`" 
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
            <div class="col-6 col-xl-2 pl-xl-0">
                <validation-provider name="有効巻m数" 
                    vid="material-cCustomSheetValidHeight" 
                    :rules="`${m$cIsEnabled && cIsNotRefMaster ? 'required|min_value:1|max_value:999' : ''}`" 
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
            <!--
            <div class="col-6 col-xl-1">                
                <div class="form-group">
                    <label>要 割り</label>
                    <div class="mt-1">                        
                        <ns-bool-view 
                            v-model="cIsNeededSeparate" 
                            :yes-class="['text-danger']"
                            :no-class="['text-success']"
                            
                    </div>
                </div>                                

            </div>
            />-->
        </div>
        
        <div class="row">

            <div class="col-6 col-xl-2" >
                <div class="form-group">                
                    <label >重量</label>
                    <div>
                        {{cWeightPerSqm.toFixed(3)}} g/㎡
                    </div>
                </div>
            </div>
            
            <div class="col-6 col-xl-2 pl-3 pl-xl-0">
                <div class="form-group">                
                    <label >参考使用本数</label>
                    <div>
                        {{cNumOfRollsNeeded.toFixed(2)}} 本
                    </div>
                </div>
            </div>

            <div class="col-6 col-xl-2 pl-3 pl-xl-0" v-show="cIsNotRefMaster && ! m$cIsCustomerProvide">
                <validation-provider name="メディア単価"
                    vid="material-cCustomSheetPricePerRoll" 
                    :rules="`${m$cIsEnabled && cIsNotRefMaster &&  ! m$cIsCustomerProvide ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <label >メディア単価</label>
                    <ns-number-input v-model="cCustomSheetPricePerRoll" />
                    <span class="validation-error">{{ errors[0] }}</span>
                </validation-provider>
            </div>

            <div class="col-6 col-xl-2 pl-3 pl-xl-0" v-show="cIsNotRefMaster && ! m$cIsCustomerProvide">
                <label >単価単位</label>
                <div class="mt-1" >1本単価</div>
                <!-- <div class="mt-1" v-show="! cIsNotRefMaster">{{cMaterialPriceKvName}}</div> -->
            </div>

            <div class="col-6 col-xl-2 text-center"  v-show="cIsNotRefMaster && ! m$cIsCustomerProvide">
                <label >スポット使用</label>
                <div>
                    <ns-checkbox-input
                        v-model="cIsCustomSheetPriceAsSpot"
                        :id="'MaterialRollIsCustomSheetPriceAsSpot'"
                        />
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
                            :id="'materialPreOrderCheck'"
                            v-model="dValue.is_ordered"
                            :disabled="cIsPrecedingOrdered"/>
                    </div>
                </div>
            </div>
            <div v-show="! cIsStocked && ! m$cIsCustomerProvide && dValue.is_ordered" 
                class="col-6 col-xl-2 pl-xl-0" >
                <a class="p-0" href='#' @click.prevent="$emit('selectPrecedingOrder',dValue)">発注紐づけ</a>
                <!-- <button type="button" class="btn btn-info" title="先行発注紐づけ" @click.prevent="$emit('selectPrecedingOrder',dValue)">
                    <i class="fas fa-link fa-fw"></i>
                </button>                -->
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
            <div class="col-6 col-xl-2" >
                <label >計算㎡単価</label>
                <div>
                    {{cPricePerSqm.toFixed(0)}} 円
                </div>
            </div>

            <div class="col-6 col-xl-2" >
                <label >使用㎡数/枚</label>
                <div>
                    {{cSqmPerQty.toFixed(3)}} 円
                </div>
            </div>


            <div class="col-6 col-xl-2">
                <div class="form-group">
                    <label>使用㎡数</label>
                    <div >{{cSqm}} ㎡</div>
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

        <div class="d-none">
            <!-- {{cSheetList}} -->
        </div>




    </div>

</template>

<script>

import TProductProcessMixins from "./../../../../mixins/tProject/TProductProcessMixins" ;
import ProcessDynamicGetSetComputedMixins from '../../../../mixins/tProject/ProcessDynamicGetSetComputedMixins';

import NumberUtil from '../../../../frameworks/NumberUtil';

export default {    
    mixins : [TProductProcessMixins,ProcessDynamicGetSetComputedMixins] ,     
    data : function() {
        return {
            // これがないとReactiveが動作しない
            dValue : {} , 
            dSelectedMaterial : undefined ,


            dComputedGetSetDefs : [
                // タイプ
                { key:'cCategoryMKvId' ,propName:"CategoryMKvId" } ,
                // 入力フラグ
                { key:'cIsNotRefMaster' ,propName:"IsNotRefMaster"} ,
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
                { key:'cMaterialPriceKvName' ,propName:"MaterialPriceKvName01" } ,
                // 重量/sqm
                { key:'cWeightPerSqm' ,propName:"WeightPerSqm" } ,
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
                // 要発注
                { key:'cIsOrderNeeded' ,propName:"IsOrderNeeded" } ,
                // 発注済み
                { key:'cIsAlreadyOrdered' ,propName:"IsAlreadyOrdered" } ,
                // 先行発注済み
                { key:'cIsPrecedingOrdered' ,propName:"IsPrecedingOrdered" } ,

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
    created : async function() {} , 
    mounted : function() {}
    
} 
</script>   