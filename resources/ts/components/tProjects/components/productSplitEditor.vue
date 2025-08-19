<template>
    <div class="row">
        <div class="col-12 col-xl-6">
            <product-split-view
                :wSep="cPositionW"
                :hSep="cPositionH"
                :w="w"
                :h="h"                            
                :extend-t="extendT"
                :extend-b="extendB"
                :extend-l="extendL"
                :extend-r="extendR"
                :w-with-overlap="cSizeIncOverlapW"
                :h-with-overlap="cSizeIncOverlapH"
                :isViewDimensions="true"
                :overlap-length="cOverlapLength"
                :separated-rects="cSeparatedSheets"
                :isNeedSvgUpdate="cIsNeedSvgUpdate"
                :base64svg.sync="cBase64Svg"
            >
            </product-split-view>
            <!-- :separated-rects.sync="cSeparatedRects" -->
        </div>

        <div class="col-12 col-xl-6 mt-3">
            <div class="row">
                <div class="col-4">
                    <validation-provider 
                        name="分割方向"
                        :vid="`tProductSplitEditor-cSelectedSide`" 
                        rules="required|excluded:0" immediate v-slot="{ errors }">
                        
                        <div class="form-group">
                            <label>分割方向</label>
                            <!-- <select v-model="dSelectedSide" class="form-control" placeholder=""> -->
                            <select v-model="cSelectedSide" class="form-control" placeholder="">
                                <option></option>
                                <option value="W">幅</option>
                                <option value="H">高さ</option>
                            </select>
                            <span class="validation-error">{{ errors[0]}}</span>
                        </div>
                    </validation-provider>
                </div>
                <div class="col-4">
                    <validation-provider name="分割数"
                        vid="productSplitEditor-cNumOfSep" 
                        rules="required|min_value:1" 
                        immediate v-slot="{ errors }">                    
                        <div class="form-group">
                            <label>分割数</label>
                            <!-- <ns-number-input v-model="cNumOfSep" /> -->
                            <ns-number-input v-model="cSelectedNumOfSep" />
                            
                            <span class="validation-error">{{ errors[0]}}</span>
                        </div>
                    </validation-provider>
                </div>
                <div class="col-4">
                    <validation-provider name="重ね代"
                        vid="productSplitEditor-cOverlapLength"
                        :rules="`${cSelectedNumOfSep > 1 ? 'required|min_value:0|max_value:' +  (cSelectedSideLength - 1) : ''}`"
                        immediate v-slot="{ errors }"> 
                        <div class="form-group">
                            <label>重ね代</label>
                            <ns-number-input v-model="cOverlapLength" />
                            <span class="validation-error" >{{ errors[0]}}</span>
                        </div>
                    </validation-provider>
                </div>
            </div>

            
            <div class="row">
                <div class="col-12 col-xl-6">
                    <div class="form-group">
                        <label>分割方法</label>
                        <!-- <select v-model="cSepWay" class="form-control" placeholder=""> -->
                        <select v-model="cSelectedSepWay" class="form-control" placeholder="">                             
                            <option></option>                            
                            <option :value="dSepWayPerCapitaRate">均等割</option>
                            <option :value="dSepWayInput">指定</option>
                        </select>                        
                    </div>

                    <validation-provider name="商品分割W"  
                        vid="tProductSplit-cIsValidSepW"
                        :rules="`${! cIsValidSepW ? 'custom_rule_is' : ''}`" 
                        immediate v-slot="{ errors }">  
                        <span class="validation-error" v-show="errors.length > 0">幅の指定位置が不正です</span>
                        <input class="d-none" v-model="cIsValidSepW" />
                    </validation-provider>

                    <validation-provider name="商品分割H"  
                        vid="tProductSplit-cIsValidSepH"
                        :rules="`${! cIsValidSepH ? 'custom_rule_is' : ''}`" 
                        immediate v-slot="{ errors }">  
                        <span class="validation-error" v-show="errors.length > 0">高さの指定位置が不正です</span>
                        <input class="d-none" v-model="cIsValidSepH" />
                    </validation-provider>


                    <div v-for="(n ,index) in cSelectedPositions" :key="index"
                        class="form-group">
                        <template v-if="index !== cSelectedPositions.length - 1">                        
                            <label>{{index + 1 }}箇所目</label>
                            <div v-show="cSelectedSepWay == 1">
                                {{cSelectedPositions[index].pos}}
                            </div>                            
                            <validation-provider name="位置"
                                :vid="`productSplitEditor-cSelectedPositions${index}`" 
                                :rules="`required|min_value:1|max_value:${cSelectedSideLength - 1}`"
                                immediate v-slot="{ errors }">
                                <ns-number-input v-show="cSelectedSepWay == 2"                                    
                                    v-model="cSelectedPositions[index].pos"
                                />
                                <span class="validation-error">{{ errors[0]}}</span>
                            </validation-provider>
                            <validation-provider name="位置"
                                :vid="`productSplitEditor-cSelectedPositionsAbs${index}`" 
                                :rules="`required|max_value:${cSelectedSideLength + cSelectedSideFirstMargin - 1}`"
                                immediate v-slot="{ errors }">
                                <input v-show="cSelectedSepWay == 2"
                                    type="hidden" 
                                    v-model.number="cSelectedPositions[index].abs_pos"
                                />
                                <span class="validation-error" v-show="errors.length > 0">規定寸法を超える指定位置が設定されています。</span>
                            </validation-provider>
                        </template>

                    </div>


                </div>

                <div class="col-12 col-xl-6">
                    <div class="form-group">
                        <label>重ね代込み寸法</label>
                        <div>
                            {{cSizeIncOverlapW}} × {{cSizeIncOverlapH }}
                        </div>
                    </div>
                    <div class="form-group">
                        <label>分割結果</label>
                        <table class="table table-dark">
                            <tr>
                                <th>No</th>
                                <th>サイズ</th>
                            </tr>
                            <tr v-for="(n ,index) in cSeparatedSheets" :key="index">
                                <th>{{index + 1 }}</th>
                                <th>{{n.w.toLocaleString()}} x {{n.h.toLocaleString()}}</th>
                            </tr>
                        </table>

                    </div>

                </div>
            </div>
        </div>


    </div>
</template>

<script lang="ts">
//@ts-nocheck
import DynamicGetSetComputedMixins from '../../../mixins/commons/DynamicGetSetComputedMixins'
import { ProductSepareteSides, ProductSepareteWays } from '../tProducts/tProductProcesses/consts/ProductSepareteDefs'

export default {
    mixins : [DynamicGetSetComputedMixins ] , 
    data :  function() {
        return {

            /**
             * 分割方法　均等
             */
            dSepWayPerCapitaRate:ProductSepareteWays.PerCapitaRate ,


            /**
             * 分割方法　指定
             */
            dSepWayInput:ProductSepareteWays.Input,



            dComputedGetSetDefs : [
                // 選択方向
                { key:'cSelectedSide' ,propName:"SelectedSide" } ,
                // 分割数
                { key:'cSelectedNumOfSep' ,propName:"SelectedNumOfSep" } ,
                // { key:'cSelectedNumOfSep' ,propName:"NumOfSepW" } ,
                
                // 重ね代
                { key:'cOverlapLength' ,propName:"SepOverlapLength" } ,
                // 分割方法
                { key:'cSelectedSepWay' ,propName:"SelectedSepWay" } ,
                

            ] , 

            dComputedGetDefs : [          
                // 選択中の辺の製品寸法
                { key:'cSelectedSideLength' ,propName:"SelectedSideLength" } ,
                // 選択中の辺の開始マージン
                { key:'cSelectedSideFirstMargin' ,propName:"SelectedSideFirstMargin" } ,                
                // 重ね代込 W
                { key:'cSizeIncOverlapW' ,propName:"SizeIncOverlapW" } ,
                // 重ね代込 H
                { key:'cSizeIncOverlapH' ,propName:"SizeIncOverlapH" } ,
                // 分割後の位置 W
                { key:'cPositionW' ,propName:"_positionsW" } ,
                // 分割後の位置 H
                { key:'cPositionH' ,propName:"_positionsH" } ,
                // 分割位置
                { key:'cSelectedPositions' ,propName:"SelectedPositions" } ,                
                // 分割後のシート
                { key:'cSeparatedSheets' ,propName:"SeparatedSheets" } ,
                
                
                
            ] , 


            dBase64Svg : "" , 



        } 
    } , 
    props : {
        value : {
            type :Object ,
        } , 
        w : {
            type : Number ,
            default : () => 0 ,
        } ,
        h : {
            type : Number  ,
            default : () => 0  ,
        } ,        
        // 伸ばし上
        extendT : {
            type : Number , 
            default : () => 0 , 
        } , 
        // 伸ばし下
        extendB : {
            type : Number , 
            default : () => 0 , 
        } , 
        // 伸ばし左
        extendL : {
            type : Number , 
            default : () => 0 , 
        } , 
        // 伸ばし右
        extendR : {
            type : Number , 
            default : () => 0 , 
        } , 
        isViewDimensions : {
            type : Boolean ,
            default : () => false ,
        } , 
        /***
         * SVG をEmitするか
         */
        isNeedSvgUpdate : {
            type : Boolean , 
            default : () => false 
        } , 
        
    } ,
    watch : {},
    methods : {
        
        getValue : function(colName:string )  
        {            
            // @ts-ignores            
            //return this.dValue[colName] ;
            return this.$$getValue("value" , colName) ; 
        } ,
        setValue : function(colName:string , val:any){   
            //this.$set(this.dValue , colName , val  ) ;
            // @ts-ignore
            this.$$setValue("value" , colName , val  ) ;
            
            //return this.$$getValue("dValue" , colName) ; 

        } ,
    } ,
    computed : {
        /**
         * 幅の指定位置が正常か（Validation用)
         */
        cIsValidSepW : function() { 
            for ( const v of this.cPositionW){
                if ( v.abs_pos > this.value.size_w + this.value.size_extend_l ){
                    return false ; 
                }                
            }
            return true ; 
        } , 
        /**
         * 高さの指定位置が正常か（Validation用)
         */
        cIsValidSepH : function() { 
            for ( const v of this.cPositionH){
                if ( v.abs_pos > this.value.size_h + this.value.size_extend_t ){
                    return false ; 
                }                
            }
            return true ; 
        } , 

        /**
         * SVGのEmitが必要か
         */
        cIsNeedSvgUpdate : function() {
            return this.isNeedSvgUpdate ; 
        } ,  
        
        /**
         * ViewからのEmit
         */
        cBase64Svg : {
            get :  function() {
                // @ts-ignore
                return this.dBase64Svg ; 
            } ,
            set :  function(val ) {
                // @ts-ignore
                this.dBase64Svg = val ; 
                this.$emit("update:base64svg" , val) ; 
            } ,
            

        } , 


    } ,
    created : function() { 
        if ( this.value.NumOfSepW === 1 && this.value.NumOfSepH > 1 ) this.cSelectedSide = ProductSepareteSides.H ; 
    } ,
    
}
</script>