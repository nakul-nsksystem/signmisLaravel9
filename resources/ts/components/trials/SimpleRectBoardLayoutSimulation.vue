<template>
    <div class="bg-app-secondaly p-3">
        <div class="row">      
            <div class="col-12">
                <div class="form-group">                
                    <label>製品サイズ</label>                
                    {{productW}} x {{productH}}
                </div>
            </div>
        </div>
        <div class="row">      
            <div class="col-12 col-xl-4">
                <div class="card bg-dark" >
                    <div class="card-header">
                        <h5>指定割位置</h5>
                    </div>
                    
                    <div class="card-body">
                
                        <div class="row">
                            <div class="col-12 col-xl-3" >
                                <div class="form-group">                
                                    <label>W</label>                
                                    <ns-number-input v-model="dTempSeparatePosW" 
                                        class="app-input-size" />
                                </div>

                            </div>
                            <div class="col-12 col-xl-3" >
                                <div class="form-group">                
                                    <label>H</label>                
                                    <ns-number-input v-model="dTempSeparatePosH" 
                                        class="app-input-size" />
                                </div>

                            </div>
                            <div class="col-12 col-xl-6" >
                                <label>&nbsp;</label>      
                                <div class="ml-auto">
                                    <button type="button" class="btn btn-primary" @click.prevent="addSeparatePos">
                                        <i class="fas fa-plus fa-fw"></i>
                                        追加
                                    </button>
                                </div>

                            </div>
                        </div>
                        <div class="row pt-3 pt-xl-0">
                            <div class="col-12 col-xl-6">
                                <label>W</label>
                                <table class="table table-dark">
                                    <tr>
                                        <th>位置</th>
                                        <th>&nbsp;</th>
                                    </tr>
                                    <tr v-for="(n ,index) in separatePosW" :key="index">                                
                                        <td>{{n.toLocaleString()}}</td>
                                        <td>                                    
                                            <button type="button" class="btn btn-danger" @click.prevent="deleteSeparatePosW(n)">
                                                <i class="fas fa-trash fa-fw"></i>
                                                削除
                                            </button>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div class="col-12 col-xl-6">
                                <label>H</label>
                                <table class="table table-dark">
                                    <tr>
                                        <th>位置</th>
                                        <th>&nbsp;</th>
                                    </tr>
                                    <tr v-for="(n ,index) in separatePosH" :key="index">                                
                                        <td>{{n.toLocaleString()}}</td>
                                        <td>                                    
                                            <button type="button" class="btn btn-danger" @click.prevent="deleteSeparatePosH(n)">
                                                <i class="fas fa-trash fa-fw"></i>
                                                削除

                                            </button>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 col-xl-8 pt-3 pt-xl-0 pl-3 pl-xl-0">
                <div class="card bg-dark" >
                    <div class="card-header">
                        <h5>寸法一覧</h5>
                    </div>
                    
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-dark text-right">
                                <thead>
                                    <tr>
                                        <th scope="col">W</th>
                                        <th scope="col">H</th>
                                        <th scope="col">単価/枚</th>
                                        <th scope="col">㎡数</th>
                                        <th scope="col">単価/㎡</th>
                                    </tr>

                                </thead>
                                <tbody>
                                    <tr v-for="(n ,index) in cSheets" :key="index">                                
                                        <td>{{n.w.toLocaleString()}}</td>
                                        <td>{{n.h.toLocaleString()}}</td>
                                        <td>{{n.pricePerSheet.toLocaleString()}}</td>                                        
                                        <td>{{n.sqm.toFixed(3)}}</td>
                                        <td>{{n.pricePerSqm.toFixed(0)}}</td>
                                    </tr>

                                </tbody>
                            </table>                    
                        </div>    
                    </div> 
                </div>           
            </div>
        </div>
        
        <div class="row pt-3">
            
            <div class="col-12 col-xl-4 ">
                
                <div class="card bg-dark" >
                    <div class="card-header">
                        <h5>指定寸法レイアウト</h5>
                    </div>
                    <div class="card-body">
                        <div class="d-flex align-items-center" >
                            <div v-if="isViewDimensions" class="mr-4"  >
                                {{productH}}
                            </div>
                            <div class="flex-grow-1">
                                <div v-if="isViewDimensions" class="row" >
                                    <div class="col-12 text-center">
                                        {{productW}}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12">
                                        <svg
                                            :viewBox="cViewBox"  >
                                            <rect 
                                                :x="margin" :y="margin" 
                                                :width="productW" :height="productH" 
                                                fill="white" 
                                                stroke="gray"  stroke-width="1" />
                
                                            <g stroke="red" >
                                                <g v-for="(n ,index) in separatePosW" :key="index">
                                                    <line 
                                                        :x1="n" :y1="margin" :x2="n" :y2="productH"
                                                        :stroke-width="cStrokeWidth" 
                                                        :stroke-dasharray="cStrokeDashArray"  />
                                                </g>
                                            </g>
                                            <g stroke="red" >            
                                                <g v-for="(n ,index) in separatePosH" :key="index">
                                                    <line 
                                                        :x1="margin" :y1="n" :x2="productW" :y2="n"
                                                        :stroke-width="cStrokeWidth" 
                                                        :stroke-dasharray="cStrokeDashArray"  />
                                                </g>
                                            </g>    
                                            -->
                                            <!-- <g stroke="black" v-for="(n ,i) in cSepalatedRects" :key="i + 'TH'">
                                                <text :x="n.tPosX" :y="n.tPosY"
                                                    text-anchor = "middle"
                                                    dominant-baseline = "central"
                                                    :font-size="n.fontSize">
                                                        {{n.w}}x{{n.h}}
                                                </text>
                                            </g> -->
                                            
                                        </svg>    


                                    </div>
                                </div>
                            </div>
                        </div>        
                    </div>
                </div>
                    
            </div>
            
            <div class="col-12 col-xl-8 pl-3 pl-xl-0">
                <div class="card bg-dark" >
                    <div class="card-header">
                        <h5>指定寸法分割後一覧</h5>
                    </div>
                    
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-dark text-right">
                                <thead>
                                    <tr>
                                        <th scope="col">W</th>
                                        <th scope="col">H</th>
                                        <th scope="col">㎡数</th>
                                        <th scope="col">最適原板</th>
                                        <th scope="col">寸法指定購入</th>                                        
                                    </tr>

                                </thead>
                                <tbody>
                                    <tr v-for="(n ,index) in cCandidatesRects" :key="index">                                
                                        <td>{{n.w.toLocaleString()}}</td>
                                        <td>{{n.h.toLocaleString()}}</td>
                                        <td>{{(n.w * n.h * 0.001 * 0.001).toFixed(3)}}</td>
                                        <td>{{n.targetSheet === undefined ? 
                                            "なし" : 
                                            `${n.targetSheet.w}x${n.targetSheet.h}` }}
                                        </td>
                                            
                                        <td >
                                            <span v-if="n.targetSheet === undefined">不可</span>
                                            <input v-if="n.targetSheet !== undefined" 
                                                    v-model="n.isBuyWoSimulation"
                                                    @change="dIsBuyWoSimulationChanged = true"
                                                    type="checkbox"  >
                                        </td>
                                    </tr>

                                </tbody>
                            </table>                    
                        </div>    
                    </div> 
                </div>                           
                
            </div>
        </div>


        <div class="row pt-3">

            <div class="col-12 col-xl-4">
                <div class="row">
                    <div class="col-12">
                        <div class="card bg-dark" >
                            <div class="card-header">
                                <h5>シミュレーション対象</h5>
                            </div>
                            
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-dark text-right">
                                        <thead>
                                            <tr>
                                                <th scope="col">タイプ</th>
                                                <th scope="col">W</th>
                                                <th scope="col">H</th>
                                                <th scope="col">㎡数</th>
                                            </tr>

                                        </thead>
                                        <tbody>
                                            <tr v-for="(n ,index) in cSimulationTargetSheets" 
                                                :key="index" 
                                                :class="{ selected:dSelectedTarget === n }"
                                                @click.prevent="selectTarget(n)" >                                
                                                <td>0</td>
                                                <td>{{n.w.toLocaleString()}}</td>
                                                <td>{{n.h.toLocaleString()}}</td>
                                                <td>{{(n.sqm).toFixed(3)}}</td>
                                                
                                            </tr>

                                        </tbody>
                                    </table>                    
                                </div>    
                            </div> 
                        </div>       
                    </div>
                     
                </div>                   
                <div class="row">
                    <div class="col-12">
                        
                        <div class="card bg-dark" >
                            <div class="card-header">
                                <h5>シミュレーション結果</h5>
                            </div>
                            
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-dark text-right">
                                        <thead>
                                            <tr>
                                                <th scope="col">W</th>
                                                <th scope="col">H</th>
                                                <th scope="col">W使用</th>
                                                <th scope="col">枚数</th>                                                
                                                <th scope="col">総コスト</th>
                                                
                                            </tr>

                                        </thead>
                                        <tbody>
                                            <tr v-for="(n ,index) in cSelectedSimulationResults" 
                                                :key="index" 
                                                :class="{ selected:dSelectedResult === n }"
                                                @click.prevent="selectResult(n)" >                                
                                                <td>{{n.targetSheet.w.toLocaleString()}}</td>
                                                <td>{{n.targetSheet.h.toLocaleString()}}</td>
                                                <td>{{n.isUseW}}</td>
                                                <td :class="{'text-success':cSelectedSimulationResultLowestNumOfBoard === n.numOfBoard}">{{n.numOfBoard}}</td>
                                                <td :class="{'text-success':cSelectedSimulationResultLowestCost === n.totalCost}">{{n.totalCost.toLocaleString()}}</td>                                                
                                                
                                            </tr>

                                        </tbody>
                                    </table>                    
                                </div>    
                            </div> 
                            
                        </div>
                    </div>
                </div>
                
            </div>
            
            <div class="col-12 col-xl-8 pl-3 pl-xl-0">
                <div class="row">
                    <div class="col-12">
                        <div class="card bg-dark" >
                            <div class="card-header">
                                <h5>シミュレーション結果割</h5>
                            </div>
                            
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-dark text-right">
                                        <thead>
                                            <tr>
                                                <th scope="col">W</th>
                                                <th scope="col">H</th>
                                                <th scope="col">㎡数</th>
                                                <th scope="col">単価/枚</th>
                                                <th scope="col">カット数</th>
                                                <th scope="col">カット代</th>
                                                <th scope="col">コスト</th>
                                            </tr>

                                        </thead>
                                        <tbody>
                                            <tr v-for="(n ,index) in cSelectedSimulationResultSheets" 
                                                :key="index"  >                                
                                                <td>{{n.w.toLocaleString()}}</td>
                                                <td>{{n.h.toLocaleString()}}</td>
                                                <td>{{(n.sqm).toFixed(3)}}</td>
                                                <td>{{n.pricePerSheet.toLocaleString()}}</td>
                                                <td>{{n.numOfCut}}</td>
                                                <td>{{costPerCut * n.numOfCut}}</td>
                                                <td>{{(n.pricePerSheet + (costPerCut * n.numOfCut)).toLocaleString()}}</td>
                                                
                                            </tr>

                                        </tbody>
                                    </table>                    
                                </div>    
                            </div> 
                        </div>       
                    </div>
                     
                </div>    
                <div class="row">
                    <div class="col-12 pl-3 pl-xl-3">
                        <div class="card bg-dark" >
                            <div class="card-header">
                                <h5>シミュレーションレイアウト</h5>
                            </div>
                            <div class="card-body">
                                <div class="d-flex align-items-center" >
                                    <div v-if="isViewDimensions" class="mr-4"  >
                                        {{dSelectedTarget !== undefined ? dSelectedTarget.h : 0}}
                                    </div>
                                    <div class="flex-grow-1">
                                        <div v-if="isViewDimensions" class="row" >
                                            <div class="col-12 text-center">
                                                {{dSelectedTarget !== undefined ? dSelectedTarget.w : 0}}
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-12">
                                                <svg
                                                    :viewBox="cLayoutViewBox"  >
                                                    <rect 
                                                        :x="margin" :y="margin" 
                                                        :width="dSelectedTarget !== undefined ? dSelectedTarget.w : 0" 
                                                        :height="dSelectedTarget !== undefined ? dSelectedTarget.h : 0" 
                                                        fill="white" 
                                                        stroke="gray"  stroke-width="1" />
                        
                                                    <g stroke="red" >
                                                        <g v-for="(n ,index) in cSelectedSimulationResultCutWPositions" :key="index">
                                                            <line 
                                                                :x1="n" :y1="margin" :x2="n" :y2="productH"
                                                                :stroke-width="cStrokeWidth" 
                                                                :stroke-dasharray="cStrokeDashArray"  />
                                                        </g>
                                                    </g>
                                                    <!--
                                                    <g stroke="red" >            
                                                        <g v-for="(n ,index) in separatePosH" :key="index">
                                                            <line 
                                                                :x1="margin" :y1="n" :x2="productW" :y2="n"
                                                                :stroke-width="cStrokeWidth" 
                                                                :stroke-dasharray="cStrokeDashArray"  />
                                                        </g>
                                                    </g>    
                                                    -->
                                                    <g stroke="black" v-for="(n ,i) in cSelectedSimulationResultSheets" :key="i + 'TH'">
                                                        <text :x="n.tPosX" :y="n.tPosY" :id="`svg_t_${n.tPosX}`"
                                                            text-anchor = "middle"
                                                            dominant-baseline = "central"
                                                            :font-size="n.fontSize">
                                                                {{n.w}}x{{n.h}}
                                                        </text>
                                                    </g> 
                                                    
                                                </svg>    


                                            </div>
                                        </div>
                                    </div>
                                </div>        
                            </div>
                        </div>        
                    </div>

                </div>
                    
            </div>


        </div>
        

        <div class="row pt-3">

            <div class="col-12 col-xl-8">
                <div class="card bg-dark" >
                    <div class="card-header">
                        <h5>結果一覧</h5>
                    </div>
                    
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-dark text-right">
                                <thead>
                                    <tr>
                                        <th scope="col">タイプ</th>
                                        <th scope="col">W</th>
                                        <th scope="col">H</th>
                                        <th scope="col">㎡数</th>
                                        <th scope="col">原板</th>
                                        <th scope="col">原板㎡単価</th>
                                        <th scope="col">単価/枚</th>
                                        <th scope="col">カット数</th>
                                        <th scope="col">カット代</th>
                                        <th scope="col">コスト</th>
                                    </tr>

                                </thead>
                                <tbody>
                                    
                                    <tr v-for="(n ,index) in cBuyWoSheets" :key="index">                                
                                        <td>指定寸法購入</td>
                                        <td>{{n.w.toLocaleString()}}</td>
                                        <td>{{n.h.toLocaleString()}}</td>
                                        <td>{{(n.sqm).toFixed(3)}}</td>
                                        <td>{{n.targetSheet === undefined ? 
                                            "なし" : 
                                            `${n.targetSheet.w}x${n.targetSheet.h}` }}
                                        </td>
                                        <td>{{n.targetSheet === undefined ? 
                                              0 : Math.round(n.targetSheet.pricePerSqm).toLocaleString() }}</td>
                                        <td>{{n.targetSheet === undefined ?
                                            "?" :
                                            (Math.round(n.sqm * n.targetSheet.pricePerSqm)).toLocaleString()}}</td>
                                        
                                        <td>{{n.numOfCut}}</td>
                                        <td>{{costPerCut * n.numOfCut}}</td>
                                        <td>{{ (
                                            (
                                                n.targetSheet === undefined ? 
                                                    0 : Math.round(n.sqm * n.targetSheet.pricePerSqm)
                                            )
                                            + (costPerCut * n.numOfCut)).toLocaleString()}}</td>

                                        
                                    </tr>
                                    <tr v-for="(n ,index) in cSimulatedDecidedSheets" :key="index + 1000">                                
                                        <td>シミュレート結果</td>
                                        <td>{{n.w.toLocaleString()}}</td>
                                        <td>{{n.h.toLocaleString()}}</td>

                                        <td>{{(n.sqm).toFixed(3)}}</td>
                                        <td>{{n.targetSheet === undefined ? 
                                            "なし" : 
                                            `${n.targetSheet.w}x${n.targetSheet.h}` }}
                                        </td>

                                        <td>{{n.targetSheet === undefined ? 
                                              0 : Math.round(n.targetSheet.pricePerSqm).toLocaleString() }}</td>
                                        <td>{{n.targetSheet === undefined ?
                                            "?" :
                                            (Math.round(n.sqm * n.targetSheet.pricePerSqm)).toLocaleString()}}</td>
                                        
                                        <td>{{n.numOfCut}}</td>
                                        <td>{{costPerCut * n.numOfCut}}</td>
                                        <td>{{ (
                                            (
                                                n.targetSheet === undefined ? 
                                                    0 : Math.round(n.sqm * n.targetSheet.pricePerSqm)
                                            )
                                            + (costPerCut * n.numOfCut)).toLocaleString()}}</td>

                                        
                                    </tr>
                                    

                                </tbody>
                            </table>                    
                        </div>    
                    </div> 
                </div>                           
                
            </div>            

        </div>
    </div>    
</template>

<script>
import ObjectUtil from '../../frameworks/ObjectUtil';
import SvgUtil from '../../frameworks/SvgUtil';

import NumberUtil from "./../../frameworks/NumberUtil"


export default {        
    data : function() {
        return {
            dValue : {} , 
            dTempSeparatePosW : 0 , 
            dTempSeparatePosH : 0 , 
            
            // Reactive用
            dIsBuyWoSimulationChanged: false ,

            dSelectedTarget : undefined ,
            dSelectedResult : undefined ,
            
        }         
    } ,
    props : {
        
        margin : {
            type : Number  ,
            default : () => 0  ,
        } ,
        // 製品W
        productW : {
            type : Number ,
            default : () => 0 ,
        } ,
        // 製品H
        productH : {
            type : Number ,
            default : () => 0 ,
        } ,
        // 分割位置W
        separatePosW : {
            type : Array ,
            default: () => []
        },
        // 分割位置H
        separatePosH : {
            type : Array ,
            default: () => []
        } ,
        isViewDimensions : {
            type : Boolean ,
            default : () => true 
        } ,
        // 対象シート
        sheets : {
            type : Array ,
            default : () => []
        } ,
        // コスト/カット
        costPerCut : {
            type : Number , 
            default : () => 200 ,
        }
    } ,
    computed : {

        cWIncMargin : function() {            
            return this.productW + this.margin * 2 ; 
        } ,
        cHIncMargin : function() {
            return this.productH + this.margin * 2 ; 
        } ,
        cViewBox : function() 
        {
            return `0 0 ${this.cWIncMargin} ${this.cHIncMargin}` ;
        } ,
        
        cLayoutWIncMargin : function() {
            if ( this.dSelectedTarget === undefined ) return this.cWIncMargin ; 
            return this.dSelectedTarget.w + this.margin * 2 ; 
        } ,
        cLayoutHIncMargin : function() {
            if ( this.dSelectedTarget === undefined ) return this.cHIncMargin ; 
            return this.dSelectedTarget.h + this.margin * 2 ; 
        } ,
        cLayoutViewBox : function() 
        {
            return `0 0 ${this.cLayoutWIncMargin} ${this.cLayoutHIncMargin}` ;
        } ,
        
        cSeparatePosW : function()
        {
            return this.separatePosW ; 
        } ,
        cSeparatePosH : function()
        {
            return this.separatePosH ; 
        } ,
        
        cStrokeWidth : function() 
        {
            return Math.ceil(this.productW / 500 ) ; 
        } , 
        cStrokeDashArray : function() 
        {
            const dash = this.cStrokeWidth * 4 ; 
            return `${dash} ${dash}`; 
        } ,
        // シート一覧
        cSheets : function () {
            const list = this.sheets.map(function(x) {
                const calcedSqm = x.w * x.h * 0.001 * 0.001  ; 
                const obj = {
                    w : x.w ,
                    h : x.h ,
                    pricePerSheet : x.pricePerSheet ,
                    sqm : calcedSqm ,
                    pricePerSqm : x.pricePerSheet / calcedSqm 
                }
                return obj ; 
            }) ;
            return list ; 
        } ,
         // 指定位置での分割後のシート
        cCandidatesRects : function() {
            
            const _this = this ; 
            //const len = (_this.dSelectedSide == "W" ? this.w  : this.h ) ; 

            // 分割位置から幅方向 シートサイズを計算
            let rects = [] ;
            let currentW = 0 ; 
            for ( let i = 0 ; i < this.cSeparatePosW.length + 1 ; i++ ){
                let tempW = i == this.cSeparatePosW.length ? this.productW : this.cSeparatePosW[i] ;                 
                let width = tempW - currentW ; 
                currentW = tempW ; 

                let currentH = 0 ; 
                for ( let j = 0 ; j < this.cSeparatePosH.length + 1 ; j++ ){
                    let tempH = j == this.cSeparatePosH.length ? this.productH : this.cSeparatePosH[j] ; 
                    let height = tempH -  currentH ; 
                    
                    const lowestCostSheet = this.lowestCostSheet(width ,height) ;


                    rects.push({
                        w:width ,
                        h:height ,
                        sqm:width * height * 0.001 * 0.001 ,
                        targetSheet : lowestCostSheet , 
                        //isBuyWoSimulation : lowestCostSheet !== undefined ,
                        isBuyWoSimulation : false ,
                        //isAvailableInSheets : isAblePlaceInSheet ,
                         }) ; 

                    currentH = tempH ;
                }
                
            }

            this.selectTarget(undefined) ; 
            
            return rects ;

        } ,
        // シミュレーション対象
        cSimulationTargetSheets : function() {
            if ( this.dIsBuyWoSimulationChanged ) this.dIsBuyWoSimulationChanged = false ; 
            let list = this.cCandidatesRects.filter(function(x) {
                return x.isBuyWoSimulation !== undefined && ! x.isBuyWoSimulation ; 
            }) ; 
            if ( list === undefined) return [] ; 

            return list ; 
        } ,        
        // 選択されている対象のシミュレーション結果
        cSelectedSimulationResults : function() {
            if ( this.dSelectedTarget === undefined) return [] ; 
            //console.log(this.dSelectedTarget) ;
            return this.simulateSeparation(this.dSelectedTarget.w ,this.dSelectedTarget.h ) ; 
        } ,
        // 結果の中で最安値
        cSelectedSimulationResultLowestCost : function() {
            const res = this.getLowestCostFromResults(this.cSelectedSimulationResults) ; 
            return res; 

        } ,
        
        // 結果の中で一番少ない使用枚数
        cSelectedSimulationResultLowestNumOfBoard : function() {
            const res = this.getLowestNumOfBoardFromResults(this.cSelectedSimulationResults) 
            return res; 
        } ,
        // 選択されている結果の内訳
        cSelectedSimulationResultSheets : function() {
            if ( this.dSelectedResult === undefined || this.dSelectedResult.rects === undefined) return [] ; 

            return this.dSelectedResult.rects ; 

        } ,
        // 選択されている結果のカット位置
        cSelectedSimulationResultCutPositions : function() {
            if ( this.dSelectedResult === undefined || this.dSelectedResult.cutPositions === undefined) return [] ; 

            return this.dSelectedResult.cutPositions ;             
        } , 
        
        // 選択されている結果のカット位置
        cSelectedSimulationResultCutWPositions : function() {
            if ( this.dSelectedResult === undefined || this.dSelectedResult.cutPositions === undefined) return [] ; 
            console.log(this.dSelectedResult.cutPositions.w) ; 
            return this.dSelectedResult.cutPositions.w ;             
        } , 


        // 寸法購入するシート 
        cBuyWoSheets : function() {
            if ( this.dIsBuyWoSimulationChanged ) this.dIsBuyWoSimulationChanged = false ; 
            let list = this.cCandidatesRects.filter(function(x) {
                return x.isBuyWoSimulation !== undefined && x.isBuyWoSimulation ; 
            }) ; 
            if ( list === undefined) return [] ;             

            // カット数算出
            list = list.map(function(x){
                const min = Math.min(x.w , x.h) ;
                const max = Math.max(x.w , x.h) ;

                const sMin = Math.min(x.targetSheet.w , x.targetSheet.h) ;
                const sMax = Math.max(x.targetSheet.w , x.targetSheet.h) ;

                let numOfCut = 0;
                if ( min != sMin ) numOfCut ++ ;
                if ( max != sMax ) numOfCut ++ ;
                
                x.numOfCut = numOfCut ; 

                return x ; 
            }) ; 

            return list ; 
        } ,

        // シミュレーション結果採用シート 
        cSimulatedDecidedSheets : function() {
            if ( this.dIsBuyWoSimulationChanged ) this.dIsBuyWoSimulationChanged = false ; 
            let list = this.cCandidatesRects.filter(function(x) {
                return x.isBuyWoSimulation !== undefined && ! x.isBuyWoSimulation ; 
            }) ; 
            if ( list === undefined) return [] ;             

            const res = [] ; 
            for ( let i = 0 ; i < list.length ; i ++ ){
                // console.log(list[i]) ; 
                // console.log("----------") ; 
                const rects = this.simulateSeparation(list[i].w ,list[i].h ) ; 
                const minNumOfBoard = this.getLowestNumOfBoardFromResults(rects)  ; 
                

                // filter 枚数
                let candidateList = rects.filter(x => x.numOfBoard == minNumOfBoard ) ; 
                // console.log("mai : " + minNumOfBoard) ; 
                // console.log(candidateList) ; 
                // filter コスト
                const minCost = this.getLowestCostFromResults(candidateList)  ; 
                // console.log("cost : " + minCost) ; 
                candidateList = candidateList.filter(x => x.totalCost == minCost) ; 
                // console.log(candidateList) ; 
                if ( candidateList.length !== 0) {
                    for ( let j = 0 ; j < candidateList[0].rects.length ; j ++ ){
                        const rect = candidateList[0].rects[j] ; 
                        const obj = {
                            w : rect.w ,
                            h : rect.h ,
                            sqm : rect.sqm,
                            numOfCut : rect.numOfCut , 
                            numOfBoard : rect.numOfBoard ,
                            targetSheet : candidateList[0].targetSheet ,
                        }

                        res.push( obj ) ; 

                    }


                }

                
                // console.log("----------B") ; 
                
            }


            // console.log(res) ; 
            
            

            return res ; 
        }        
    } ,
    methods : {
        // 割シミュレーション
        simulateSeparation : function(width , height) {
            if ( width === undefined || height === undefined) return []
            // console.log(`width:${width} height:${height}`) ; 

            if ( this.lowestCostSheet(width , height) !== undefined ||
                 this.isOneSideInsideInSheets(width , height)){
                // 短冊割り
                console.log("短冊") ; 
                const min = Math.min(width , height) ; 
                const max = Math.max(width , height) ; 
                // console.log(`min:${min} max:${max}`) ; 

                const _this = this ; 

                // 入るシートを取得    
                let list = this.cSheets.map( function (x) {                                
                    const sMin = Math.min(x.w ,x.h ) ; 
                    const sMax = Math.max(x.w ,x.h ) ; 

                    // 短辺がシートのW/Hいずれかに入るか
                    const isIn = min <= sMin || min <= sMax  ; 
                    if (! isIn) return undefined ; 

                    let lossPerW = Number.MAX_VALUE ; 
                    if ( min <= x.w ) lossPerW = (x.w - min ) / x.w ; 

                    let lossPerH = Number.MAX_VALUE ; 
                    if ( min <= x.h ) lossPerH = (x.h - min ) / x.h ; 

                    // Wを採用
                    const isUseW = lossPerW < lossPerH ; 

                    // 少ない方のロス%
                    const lossPer = Math.min(lossPerW , lossPerH) ; 

                    // 商品の長辺側に当てるシートの辺の長さを取得
                    const longerLen = isUseW ? x.h : x.w ;                     

                    // 板の必要枚数を計算する
                    const numOfBoard = NumberUtil.ceil(max / longerLen ) 

                    //console.log(`longerLen:${longerLen} numOfBoard:${numOfBoard} ` )
                    
                    // 商品の短 辺側に当てるシートの辺の長さを取得
                    const shorterLen = isUseW ? x.w : x.h ; 
                    
                    const resRects = [] ; 

                    const longerLenPerRect = NumberUtil.trunc(max / numOfBoard) ; 
                    let totalNumOfCut = 0 ; 
                    let totalSqm = 0 ; 
                    const sepPositions = [] ; 
                    // 枚数分回す 基本は均等割
                    for ( let i = 0 ; i < numOfBoard ; i++ ){
                        const calcedW = numOfBoard == i + 1 
                            ? max - longerLenPerRect * i 
                            : longerLenPerRect ; 

                        // カット位置
                        let cutPos = longerLenPerRect * (i + 1) ; 
                        if ( i != numOfBoard + 1) sepPositions.push(cutPos) ;

                        // カット回数 ( Todo )
                        let numOfCut = 0 ; 
                        // 製品短辺と短辺に当てるシートの寸法が同じ場合カットが不要
                        if ( shorterLen != min ){
                            numOfCut ++ ; 
                        }
                        if ( calcedW != max ){
                            numOfCut ++ ; 
                        }

                        const sqm = calcedW * shorterLen * 0.001 *0.001  ; 

                        // FontSize計算
                        // console.log("min:" + min) ; 
                        const numOfStr = NumberUtil.getLength(calcedW) + NumberUtil.getLength(min) + 1 ; 
                        const fSize = SvgUtil.getMaxFontSize4SvgNumberText(numOfStr ,max ,min  , calcedW ,min ) ;


                        const obj = {
                            w : calcedW ,
                            h : min ,
                            tPosX : cutPos - ( calcedW / 2 ) ,
                            tPosY : min / 2  ,
                            fontSize : fSize ,
                            sqm : sqm ,
                            numOfCut : numOfCut ,
                            pricePerSheet : NumberUtil.round(x.pricePerSqm * sqm ) 
                        }
                        resRects.push(obj) ;

                        totalSqm += sqm ; 
                        totalNumOfCut += numOfCut ; 
                    }

                    const totalCost = Math.round(x.pricePerSqm * totalSqm) + (totalNumOfCut * _this.costPerCut) ; 
                    return {
                        targetSheet     : x  ,
                        isUseW          : isUseW ,                        
                        numOfBoard      : numOfBoard ,                        
                        totalNumOfCut   : totalNumOfCut , 
                        totalSqm        : totalSqm ,
                        totalCost       : totalCost ,
                        rects           : resRects ,
                        cutPositions    : { 
                            w : sepPositions.length < 2 ? [] : sepPositions ,
                            h : [] ,
                        }
                        
                    } ; 
                }) ;

                list = list.filter(x => x !== undefined ) ; 

                return list ; 

            }
            else {
                // 縦横割り
                console.log("縦横") ; 
                return [] ; 
            }

        } ,
        addSeparatePos : function() {
            if ( this.separatePosW.indexOf(this.dTempSeparatePosW) === -1 
                && this.dTempSeparatePosW != 0 ) 
            {  
                // 
                this.separatePosW.push(this.dTempSeparatePosW) ; 
                this.separatePosW.sort(function(a, b) {
                    return a - b;
                }); ; 
            }

            
            if ( this.separatePosH.indexOf(this.dTempSeparatePosH) === -1 
                && this.dTempSeparatePosH != 0 ) 
            {  
                // 
                this.separatePosH.push(this.dTempSeparatePosH) ; 
                this.separatePosH.sort(function(a, b) {
                    return a - b;
                }); ; 
            }

            
        } ,
        deleteSeparatePosW : function (n) {
            const index = this.separatePosW.indexOf(n)  ; 
            if ( index === -1 ) return ; 
            this.separatePosW.splice(index, 1);
        } , 
        deleteSeparatePosH : function (n) {
            const index = this.separatePosH.indexOf(n)  ; 
            if ( index === -1 ) return ; 
            this.separatePosH.splice(index, 1);
        } , 
        selectTarget : function (n) {
            this.dSelectedTarget = n ; 
            this.dSelectedResult = undefined ; 
        } ,
        selectResult : function (n) {
            this.dSelectedResult = n ; 
        } ,
        
        // 指定寸法が既存シート内に収まる中で㎡単価が一番安い
        lowestCostSheet : function( width , height ){
            const min = Math.min(width , height ) ; 
            const max = Math.max(width , height ) ; 

            let list = this.cSheets.filter( function (x) {                                
                const sMin = Math.min(x.w ,x.h ) ; 
                const sMax = Math.max(x.w ,x.h ) ; 
                const isIn = min <= sMin && max <= sMax  ; 
                //console.log(`sMin:${sMin} sMax:${sMax} isIn:${isIn}`) ; 
                return isIn; 
            }) ;
            if ( list.length === 0 ) return undefined ; 

            const res = list.reduce(function (accum, current) {                    
                return accum.pricePerSqm < current.pricePerSqm ? accum : current ; 
            }) ; 

            
            return res ;  

        } ,
        // 製品の短辺がいずれかのシートの長辺に入る
        isOneSideInsideInSheets: function(width ,height ){
            const min = Math.min(width , height ) ; 
            const max = Math.max(width , height ) ; 

            let list = this.cSheets.filter( function (x) {                                
                const sMin = Math.min(x.w ,x.h ) ; 
                const sMax = Math.max(x.w ,x.h ) ; 
                const isIn = min <= sMax  ; 
                //console.log(`sMin:${sMin} sMax:${sMax} isIn:${isIn}`) ; 
                return isIn; 
            }) ;

            return list.length !== 0 ; 
        } , 
        
        // 結果の中で一番安いコスト
        getLowestCostFromResults : function(list) {
            if ( list === undefined || list.length === 0 ) return 0 ; 
            const res = list.reduce(function (accum, current) {                    
                return accum.totalCost < current.totalCost ? accum : current ; 
            }) ; 

            return res.totalCost ; 
        } ,
        
        // 結果の中で一番少ない枚数
        getLowestNumOfBoardFromResults : function(list) {
            if ( list === undefined ) return 0 ; 

            const res = list.reduce(function (accum, current) {                    
                return accum.numOfBoard < current.numOfBoard ? accum : current ; 
            } ,0) ; 

            return res.numOfBoard ; 
        } ,
    } ,
    created : function()
    {
        
        
    }
    
} 
</script>