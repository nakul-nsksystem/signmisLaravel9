<template>

    <div>
        <div class="row" v-if="value" v-show="$$cIsDebug">
            <div class="col-10" >
                <div class="row">
                    <div class="col-2 text-success">
                        {{value.TotalCostPerQty}} 円/数
                    </div>
                    <div class="col-6">
                        {{value.TotalSheetQty}} 枚 ( {{value.TotalNumOfCut}} カット ) Rotate {{value.Layouter.IsProductRotate}}   
                    </div>
                </div>
            </div>
        </div>

        <div class="row my-2" v-if="value">
            <div class="col-12 col-xl-6" >
                <board-simulation-result-svg-4-container
                    v-model="value" 
                    :is-need-svg-update="cIsNeedSvgUpdate"
                    :base64svg.sync="cBase64Svg"
                    :product-longer="cProductLonger"
                    :product-shorter="cProductShorter"
                    :product-qty="cProductQty"
                />
            </div>
            <div class="col-12 col-xl-6">
                <div class="row">
                    <div class="col-12 col-xl-8">
                        <div class="form-group">
                            <label>結果</label>
                            <div class="text-success" v-show="cIsViewPrice">
                                <div>
                                    カット[{{value.TotalCutCost}}] + 材料[{{value.TotalMaterialCost}}]      
                                </div>
                                <div v-if="value.Layouter.IsSingle">
                                    = {{value.TotalCost}}円 / {{cProductQty}}個 
                                </div>
                                <div v-else>
                                    = {{value.TotalCost}}円 x {{value.TotalNumOfSet}}セット 
                                </div>

                                <div v-if="! value.Layouter.IsSingle">
                                    =  {{value.TotalCost * value.TotalNumOfSet}}円 / {{cProductQty}}個 
                                </div>
                                <div>
                                    = {{value.TotalCostPerQty.toFixed(0)}}円
                                </div>
                                
                            </div>
                        </div>
                    </div>   
                    
                    <div class="col-12 col-xl-4">
                        <div class="row">
                            <div class="col-12">
                                <div class="form-group">
                                    <label>製品取数</label>
                                    <div>
                                        {{value.NumOfProducts}} 個 / セット
                                    </div>
                                </div>

                            </div>

                        </div>
                        <div class="row" v-if="value.Layouter.IsSingle">
                            <div class="col-12">
                                <div class="form-group">
                                    <div>
                                        {{value.NumOfProductCols}} 列 x {{value.NumOfProductRows}} 行
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>              
                </div>

            </div>
        </div>
        <div class="row" v-if="value" v-show="$$cIsDebug">
            <div class="col-12" >
                <div class="table-responsive">
                    <table class="table table-dark">
                        <thead>
                            <tr>
                                <th style="width:10%;min-width:60px;">W</th>
                                <th style="width:10%;min-width:60px;">H</th>
                                <th style="width:10%;min-width:70px;">カット</th>
                                <th style="width:10%;min-width:70px;">枚数</th>
                                <th style="width:10%;min-width:70px;">枚単価</th>
                                <th style="width:10%;min-width:90px;">材料金額</th>
                                <th v-show="$$cIsDebug" style="width:15%;min-width:100px;">規格㎡数</th>
                                <th v-show="$$cIsDebug" style="width:10%;min-width:60px;">sqm</th>
                                <th v-show="$$cIsDebug" style="width:15%;min-width:130px;">規格単価/枚</th>
                                <th v-show="$$cIsDebug" style="width:15%;min-width:200px;">使用寸法</th>
                                <th v-show="$$cIsDebug" style="width:15%;min-width:100px;">課金㎡</th>
                                <th v-show="$$cIsDebug" style="width:15%;min-width:100px;">使用%</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="n in value.Sheets">
                                <td>{{n.w}}</td>
                                <td>{{n.h}}</td>
                                <th>{{n.NumOfCut}}</th>
                                <th>{{n.qty}}</th>
                                <th>{{n.MaterialCost.toLocaleString()}}</th>                                
                                <td class="text-right align-middle">
                                    {{n.TotalMaterialCost.toLocaleString()}}
                                </td>
                                <td v-show="$$cIsDebug"  class="align-middle">
                                    {{n.MMaterialDetail.Sqm.toLocaleString()}}
                                </td>
                                <td v-show="$$cIsDebug">{{n.Sqm}}</td>
                                <td v-show="$$cIsDebug" class="text-right align-middle">
                                    {{n.MMaterialDetail.cost_price.toLocaleString() }}
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
import { MaterialBoardLayoutAutoResult } from '../../class/boardLayouts/containers/autoLayout/models/MaterialBoardLayoutAutoResult';

export default {
    
    data :  function() {
        return {            
            dBase64Svg : "" , 
        } 
    } , 
    props : {


        /***
         * SVG をEmitするか
         */
        isNeedSvgUpdate : {
            type : Boolean , 
            default : () => false 
        } , 
        /**
         * 値
         */
        value : {
            type :MaterialBoardLayoutAutoResult ,
        } ,

    } ,
    computed : {
        /**
         * SVGのEmitが必要か
         */
        cIsNeedSvgUpdate : function() {
            return this.isNeedSvgUpdate ; 
        } ,  
        cBase64Svg : {
            get :  function() {
                return this.dBase64Svg ; 
            } ,
            set :  function(val ) {
                this.dBase64Svg = val ; 
                this.$emit("update:base64svg" , val) ; 
            } ,
            

        } , 

        cProductW : function() { 
            return this.value._container.ProductW ; 
        } , 
        cProductH : function() { 
            return this.value._container.ProductH ; 
        } , 
        cProductQty : function() { 
            return this.value._container._manager.ProductQty ; 
        } , 

        cProductLonger : function() { 
            return Math.max(this.cProductW , this.cProductH) ; 
        } , 
        cProductShorter : function() { 
            return Math.min(this.cProductW , this.cProductH) ; 
        } , 
        
        /**
         * 金額の表示フラグ
         */
        cIsViewPrice : function() { 
            const val = NumberUtil.invalid2zr(this.mainStore.getRole("t_project-price-view-permission")) ; 
            return val >= 10 ; 
        } , 
        
    } ,
    methods : {


    } ,
}
</script>