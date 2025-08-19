<template>

    <div>
        <div class="row ">
            <div class="w-100 border-bottom mx-3 pb-2 mb-2">
                <div class="row ">
                    <div class="col-6 col-xl-6 d-flex align-items-end">
                        <p class="h5 pb-0 mb-0">規格参照</p>
                    </div>
                    <div class="col-6 col-xl-6 d-flex">
                        <div class="ml-auto">
                            <button type="button" class="btn btn-primary" @click.prevent="add">
                                <i class="fas fa-plus fa-fw"></i>
                                追加
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <div class="row">            
            <div class="col-12">
                <div class="table-responsive">
                    <table class="table table-dark ">
                        <thead>
                            <tr>
                                <th>&nbsp;</th>
                                <th class="w-25" style="min-width:350px;">規格寸法</th>
                                <!-- <th style="width:15%;min-width:110px;">規格寸法</th> -->
                                <th style="width:15%;min-width:100px;">W</th>
                                <th style="width:15%;min-width:100px;">H</th>
                                <th style="width:10%;min-width:70px;">枚数</th>
                                <th v-show="cIsViewPrice" class="text-right " style="width:15%;min-width:90px;">材料金額</th>
                                <th class="text-center " style="width:10%;min-width:70px;">外注カット</th>
                                <th class="text-right " style="width:10%;min-width:70px;">カット</th>
                                <th v-show="cIsViewPrice" class="text-right " style="width:10%;min-width:100px;">カット金額</th>
                                <th v-show="cIsViewPrice" class="text-right " style="width:10%;min-width:100px;">合計金額</th>
                                <th v-show="$$cIsDebug" style="width:15%;min-width:100px;">規格㎡数</th>
                                <th v-show="$$cIsDebug" style="width:15%;min-width:110px;">規格単価/枚</th>
                                <th v-show="$$cIsDebug" style="width:15%;min-width:200px;">使用寸法</th>
                                <th v-show="$$cIsDebug" style="width:15%;min-width:100px;">㎡</th>
                                <th v-show="$$cIsDebug" style="width:15%;min-width:100px;">使用%</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(n ,index ) in cList">              
                                <td>
                                    <button type="button" class="btn btn-danger" @click.prevent="destroy(n)">
                                        <i class="fas fa-trash fa-fw"></i>                            
                                    </button>                                                     
                                </td>                  
                                <td>
                                    <validation-provider name="規格寸法"
                                        :vid="`boardsRefMasterManualEditor-m_material_detail_id${index}`" 
                                        :rules="`${cIsValid ? 'required|excluded:0' : ''}`" 
                                        immediate v-slot="{ errors }">
                                        <select 
                                            class="custom-select"
                                            v-model="n.m_material_detail_id" 
                                            @change="materialDetailChange(n)"
                                            >
                                            <option value=""></option>
                                            <option v-for="det in cDetailList" :key="det.id" :value="det.id">
                                            <!-- <option v-for="det in value._manager._mMaterialDetails" :key="det.id" :value="det.id">                                                 -->
                                                <!-- {{det.width}} x {{det.height}} -->
                                                {{det.detail_name}}
                                            </option>
                                        </select>
                                        <span class="validation-error">{{ errors[0] }}</span>                                        
                                    </validation-provider>
                                    


                                </td>
                                <td class="pl-0">
                                    <validation-provider name="W"
                                        :vid="`boardsRefMasterManualEditor-w${index}`" 
                                        :rules="`${cIsValid ? 'required|min_value:1' : ''}`" 
                                        immediate v-slot="{ errors }">
                                        <ns-number-input v-model="n.w" />
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </validation-provider>
                                </td>
                                <td class="pl-0">
                                    <validation-provider name="H"
                                        :vid="`boardsRefMasterManualEditor-h${index}`" 
                                        :rules="`${cIsValid ? 'required|min_value:1' : ''}`" 
                                        immediate v-slot="{ errors }">
                                        <ns-number-input v-model="n.h" />
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </validation-provider>
                                </td>
                                <td class="pl-0">
                                    <validation-provider name="枚数"
                                        :vid="`boardsRefMasterManualEditor-qty${index}`" 
                                        :rules="`${cIsValid ? 'required|min_value:1' : ''}`" 
                                        immediate v-slot="{ errors }">
                                        <ns-number-input v-model="n.qty" />
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </validation-provider>
                                </td>
                                <td v-show="cIsViewPrice" class="text-right align-middle">
                                    {{n.TotalMaterialCost.toLocaleString()}}
                                </td>
                                <td class="text-center">
                                    <ns-checkbox-input
                                        v-model="n.is_outsource_cut"
                                        :class="'mt-2'"
                                        :id="`boardsRefMasterManualEditor-is_outsource_cut${index}`"
                                        />
                                </td>
                                <td class="text-right align-middle">
                                    {{n.NumOfCut}}
                                </td>                 
                                <td v-show="cIsViewPrice" class="text-right align-middle">
                                    {{n.TotalCutCost.toLocaleString()}}
                                </td>                 
                                <td v-show="cIsViewPrice" class="text-right align-middle">
                                    {{n.TotalCost.toLocaleString()}}
                                </td>                 
                                               
                                <td v-show="$$cIsDebug"  class="align-middle">
                                    {{n.MMaterialDetailSqm.toLocaleString()}}
                                </td>
                                <td v-show="$$cIsDebug" class="text-right align-middle">
                                    {{n.MMaterialDetailPrice.toLocaleString() }}
                                </td>       
                                <td v-show="$$cIsDebug" class="text-right align-middle">
                                    {{n.ValidSize}}
                                </td>                            
                                <td v-show="$$cIsDebug" >
                                    {{n.ValidSqm}}
                                </td>
                                <td v-show="$$cIsDebug" >
                                    {{n.UsePer}}
                                </td>
                                
                            </tr>
                                       
                            <tr>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td class="text-right ">{{cTotalQty}}</td>
                                <td v-show="cIsViewPrice" class="text-right ">{{cTotalMaterialCost.toLocaleString() }}</td>
                                <td>&nbsp;</td>
                                <td class="text-right ">{{cTotalNumOfCut.toLocaleString() }}</td>
                                <td v-show="cIsViewPrice" class="text-right ">{{cTotalCutCost.toLocaleString() }}</td>
                                <td v-show="cIsViewPrice" class="text-right ">{{cTotalCost.toLocaleString() }}</td>
                                <td>&nbsp;</td>
                            </tr>
                        </tbody>
                    </table>
                </div>                
            </div>            
        </div>
    </div>
</template>

<script>
import NumberUtil from '../../../../frameworks/NumberUtil';
import boardsRefMasterMixins from '../../../../mixins/tProject/boardsRefMasterMixins';
import { BoardLayoutContainerRefMasterManual } from '../../class/boardLayouts/containers/BoardLayoutContainerRefMasterManual';

export default {    
    data :  function() {
        return {

        } 
    } , 
    props : {        
        value : {
            type : BoardLayoutContainerRefMasterManual 
            
        } ,
    } ,
    computed : {
        /**
         * 金額の表示フラグ
         */
        cIsViewPrice : function() { 
            const val = NumberUtil.invalid2zr(this.mainStore.getRole("t_project-price-view-permission")) ; 
            return val >= 10 ; 
        } , 
        
        cIsValid : function() { 
            return this.value?.IsSelected ?? false ; 
        } , 
        cIsCustomerProvide : function(){ 
            return this.value?._manager?.is_customer_provide ?? false ; 
        } ,

        cList : function() {
            for (const x of this.value.Layouts) {
                // this.m$attacheMethods(x) ;     

                // 不正な値の排除
                if (! this.getIsSelectable(x))  x.m_material_detail_id = 0 ; 
            }

            return this.value.Layouts ; 
        } , 
        cDetailList : function() { 
            // console.log("cDetailList") ;             
            return this.value._manager._mMaterialDetails ?? []; 
            //return this.value._manager.MMaterialDetails ?? [] ; 
        } , 
        cTotalQty : function() {
            return this.value.TotalQty ; 
        } ,
        cTotalMaterialCost : function() {
            return this.value.TotalMaterialCost ; 
        } ,
        /**
         * 合計カット数
         */        
        cTotalNumOfCut : function() {
            return this.value.TotalNumOfCut ; 
            // return this.m$getTotalNumOfCut(this.value) ; 
        } ,        
        /**
         * 合計カットコスト
         */        
        cTotalCutCost : function() {
            return this.value.TotalCutCost ; 
            // return this.m$getTotalCutCost(this.value) ; 
        } ,        
        /**
         * 合計コスト
         */        
        cTotalCost : function() {
            return this.value.TotalCost ; 
            // let costPerQty = this.cTotalCutCost + this.cTotalMaterialCost ;
            // this.$emit("update:cost-per-qty" , costPerQty ) ;

            // return costPerQty ; 
        } ,        
        
    } ,
    methods : {
        /**
         * 新規行の追加
         */
        add : function ()
        {
            this.value.add() ; 
        } ,
        /**
         * 行の削除
         */
        destroy : function (row) {
            this.value.destroy(row) ; 
        }  ,

        /**
         * 選択可能な値が設定されているか
         */
        getIsSelectable : function(row )  {
            const found = this.cDetailList.find(x => x.id === row.m_material_detail_id) ; 
            return found !== undefined ; 
        }  ,

        /**
         * サイズ選択時
         */
        materialDetailChange : function(n) {
            const materialDet = this.cDetailList.find(x => x.id == n.m_material_detail_id) ; 
            n.m_material_detail = materialDet ; 
            //console.log(materialDet)  ; 
        } , 



    } ,
}
</script>