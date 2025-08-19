<template>
    <div>
        <div class="table-responsive">
            <table class="table table-dark">
                <tr>
                    <th scope="col">幅mm</th>
                    <th scope="col">有効幅mm</th>
                    <th scope="col">巻mm</th>
                    <th scope="col">有効巻mm</th>
                    <th scope="col">コスト/㎡</th>
                </tr>
                <tr  v-for="(n, index) in sheets" :key="index">
                    <td>{{n.w.toLocaleString()}}</td>
                    <td>{{n.wIncLoss.toLocaleString()}}</td>

                    <td>{{n.h.toLocaleString()}}</td>
                    <td>{{n.hIncLoss.toLocaleString()}}</td>
                    <td>{{n.cost.toLocaleString()}}</td>
                </tr>
            </table>
        </div>

        <div v-if="isViewInfo">


            <div class="mb-3">
                <h5>Informations</h5>
                <div class="row">
                    <div class="col-12">
                        <p>&nbsp;&nbsp;Gap : {{gap}}</p>
                        <p>&nbsp;&nbsp;Qty : {{qty}}</p>
                        <p>&nbsp;&nbsp;SheetMargin : ( T:{{sheetMarginT}} B:{{sheetMarginB}} L:{{sheetMarginL}} R:{{sheetMarginR}} ) </p>
                    </div>
                </div>
            </div>
            <div class="mb-3">
                <h5>Rects</h5>
                <div class="row" v-for="(n ,i) in rects" :key="i">
                    <div class="col-12">
                        &nbsp;&nbsp; Rect {{i + 1 }} : {{n.w}}x{{n.h}}
                    </div>
                </div>

            </div>
            <div class="mb-3">
                <h5>Sheets</h5>
                <div class="row" v-for="(n ,i) in sheets" :key="i">
                    <div class="col-12">
                        &nbsp;&nbsp;Sheets {{i + 1 }} : {{n.w}}x{{n.h}}
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div v-for="(n ,i) in cResults" :key="i + 'cRes'"
                class="col-12">
                <div class="row">
                    <div class="col-12 font-weight-bold">
                        <h5>{{n.index}} , {{n.rectW}} x {{n.rectH}} ( {{n.rotate}} deg )  {{n.isSuccess ? "OK" : "NG"}} </h5>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-12 col-xl-6 mb-2 mb-xl-0">
                        <svg
                            :viewBox="cViewBox(n.result.w ,n.rectH )"  >
                            <rect
                                x="0" y="0"
                                :width="n.result.w" :height="n.rectH + cSheetMarginH"
                                fill="white"
                                stroke="gray"  stroke-width="1" />
                            <g stroke="red" v-for="(pos ,i) in n.result.colPositions" :key="i"  >
                                <rect
                                    :x="pos + sheetMarginL" :y="sheetMarginT"
                                    :width="n.rectW" :height="n.rectH"
                                    fill="white"
                                    :stroke-width="cStrokeWidth(Math.max(n.result.w ,n.rectH))" />

                            </g>

                        </svg>

                    </div>
                    <div class="col-12 col-xl-6">
                        <div class="row">
                            <div class="col-6 col-xl-2">
                                <div class="form-group">
                                    <label>列数</label>
                                    <div>{{n.result.numOfCols}}</div>
                                </div>
                            </div>
                            <div class="col-6 col-xl-2">
                                <div class="form-group">
                                    <label>段数</label>
                                    <div>{{n.result.numOfRows}}</div>
                                </div>
                            </div>
                            <div class="col-6 col-xl-4">
                                <div class="form-group">
                                    <label>ロス率</label>
                                    <div>{{n.result.lossWPer}} ( {{n.result.lossPer}} ) %</div>
                                </div>
                            </div>
                            <div class="col-6 col-xl-4">
                                <div class="form-group">
                                    <label>製品使用㎡数</label>
                                    <div>{{(n.sqm * qty).toFixed(3)}} ㎡</div>
                                </div>
                            </div>


                        </div>

                        <div class="row">
                            <div class="col-6 col-xl-4">
                                <div class="form-group">
                                    <label>メディア幅</label>
                                    <div>{{Math.floor(n.result.w)}} mm</div>

                                </div>
                            </div>
                            <div class="col-6 col-xl-4">
                                <div class="form-group">
                                    <label>メディア使用流れ</label>
                                    <div>{{(n.result.sheetFeedLen * 0.001).toFixed(3)}} m</div>
                                </div>
                            </div>
                            <div class="col-6 col-xl-4">
                                <div class="form-group">
                                    <label>メディア使用㎡数</label>
                                    <div>{{n.result.sheetSqm.toFixed(3)}} ㎡</div>
                                </div>
                            </div>

                        </div>


                        <div class="row">
                            <div class="col-6 col-xl-4">
                                <div class="form-group">
                                    <label>必要本数</label>
                                    <div>{{n.result.numOfRolls.toFixed(2)}} 本</div>

                                </div>
                            </div>
                        </div>


                        <div class="row">
                            <div class="col-6 col-xl-4">
                                <div class="form-group">
                                    <label>最下段 列数</label>
                                    <div>{{n.result.belowNumOfRows}}</div>

                                </div>
                            </div>
                            <div class="col-6 col-xl-4">
                                <div class="form-group">
                                    <label>最下段 余り%</label>
                                    <div>{{n.result.belowRemainPer.toFixed(2)}} %</div>
                                </div>
                            </div>

                        </div>


                    </div>


                </div>


            </div>

        </div>

    </div>
</template>


<script>
export default {
    data :  function() {
        return {

            
        }
    } ,
    props : {
        isViewInfo : {
            type : Boolean ,
            default : () => false ,
        } ,
        qty : {
            type : Number ,
            default : () => 0 ,
        } ,
        // 最下段の余りを費用に入れるかどうかの幅余り％ デフォルト 33%以下
        incSqmBelowRemainPer: {
            type : Number ,
            default : () => 33 ,
        } ,
        gap : {
            type : Number  ,
            default : () => 0 ,
        } ,
        rects : {
            type : Array ,
            default : () => [] ,
        } ,
        sheets : {
            type : Array ,
            default : () => [] ,
        } ,
        sheetMarginL : {
            type : Number  ,
            default : () => 50  ,
        } ,
        sheetMarginR : {
            type : Number  ,
            default : () => 50  ,
        } ,

        sheetMarginT : {
            type : Number  ,
            default : () => 50  ,
        } ,
        sheetMarginB : {
            type : Number  ,
            default : () => 50  ,
        } ,

        /** 
         * 実質調整率 
         * 使用率がこれを上回ると100%使った場合と同値になる
         * デフォルト95%
        */
        adjPer : {
            type : Number  ,
            default : () => 95  ,
        } ,


    } ,
    methods : {
        // 最小シートロス
        getMinLossSheetRes : function(len ,otherLen )
        {
            const _this = this ;

            // シミュレーション結果取得
            const list = this.sheets.map(function(x){
                // マージンを省いた有効幅
                const sw = x.wIncLoss  - _this.cSheetMarginW ;

                // 図面間のGAPを込みにした寸法
                const lenIncGap = len + _this.gap ;

                // 配置時に余る寸法
                const loss = sw % lenIncGap ;

                // 余り寸法に１つ入るかどうか
                const isAddOne = loss >= len ? 1 : 0 ;

                // 入る列数
                const numOfCols = Math.trunc(sw / lenIncGap + isAddOne ) ;
                let usedLen = 0 ;
                let lossPerSheet = 100 ;
                let lossWPer = 100 ;
                let numOfRows = 0;
                let usedH = 0 ;
                // 必要本数
                let numOfRolls = 0 ;
                let colPositions = [] ;

                // 最下段
                let belowNumOfRows = 0  ;
                let belowRemainPer = 100  ;



                if ( numOfCols > 0 )
                {
                    // 最後のGap分を引く
                    usedLen = numOfCols * lenIncGap - _this.gap ; 

                    // シート幅に対するロス率               
                    // 入る入らないの判定     
                    lossWPer =  Math.floor((1 - (usedLen / x.w)) * 10000) / 100 ; 
                    

                    // 段数
                    numOfRows = Math.ceil(_this.qty / numOfCols ) ;
                    if ( isNaN(numOfRows)) numOfRows = 0 ;

                    // 最下段　段数
                    belowNumOfRows = _this.qty % numOfCols ;

                    // 最下段　余りmm数
                    if ( belowNumOfRows == 0 )
                    {
                        belowRemainPer = 0 ; 
                    }
                    else
                    {
                        belowRemainPer = (1 - (belowNumOfRows * len) / x.w ).toFixed(4) * 100 ;
                    }
                    

                    // シート流れ使用寸法
                    if ( numOfRows > 0)
                    {
                        usedH = Math.floor( numOfRows * ( otherLen + _this.gap) - _this.gap ) ;
                        if ( x.h > 0 )
                        {                            
                            numOfRolls = Math.floor( usedH / x.hIncLoss * 1000000 ) * 0.000001 ; 
                            // const a = usedH / x.hIncLoss * 100 * 0.01 ;  
                            // console.log("a:" + a)  ; 
                            // numOfRolls = usedH / x.hIncLoss * 100 * 0.01 ; 
                        }

                    }
                    else
                    {
                        usedH = 1 ;
                    }

                    // 横位置
                    const pos = 0 ;
                    for ( let i = 0 ; i < numOfCols ; i++ )
                    {
                        colPositions.push(pos + ( i * lenIncGap )) ;
                    }

                }

                // シート使用㎡数
                let sheetSqm = Math.floor(x.w * usedH * 0.001 ) * 0.001 ;


                if ( numOfCols > 0 )
                {
                    //実質調整幅
                    const adjW =  _this.adjPer * 0.01 * x.w  ;
                    //余り基準幅
                    const remainPerW = (100 - _this.incSqmBelowRemainPer) * 0.01 * x.w  ;
                    //実質調整幅-余り基準値寸法
                    const denominator = Math.ceil( adjW - remainPerW ) ;
                    //材料幅 - 実質調整幅
                    const coefW = Math.ceil( x.w - adjW );

                    //面付が1列
                    if(numOfCols === 1 ) {
                        //余りが基準値以上の場合、余り分を考慮しない使用㎡数
                        if(_this.incSqmBelowRemainPer < lossWPer) {
                            const plusLen = lenIncGap - _this.gap + _this.cSheetMarginW;
                            const plusSqm = (plusLen - x.w ) * otherLen ;
                            sheetSqm = sheetSqm + Math.floor(plusSqm * 0.001) * 0.001 ;
                        }
                        // 余りが基準値以下の場合、多めに㎡数をとる
                        else {
                            const plusLen = Math.ceil((lenIncGap - remainPerW)  / denominator * coefW)
                            const plusSqm = ( lenIncGap + plusLen - x.w ) * otherLen ;
                            if( plusSqm <= 0 )sheetSqm = sheetSqm + Math.floor(plusSqm * 0.001) * 0.001 ;
                        }
                    }
                    //面付が複数列
                    else {
                        if ( belowRemainPer > 0 && _this.incSqmBelowRemainPer < belowRemainPer )
                        {
                            const plusLen = belowNumOfRows * lenIncGap - _this.gap + _this.cSheetMarginW;
                            const plusSqm = (plusLen - x.w ) * otherLen ;
                            // console.log("plus:" + plusLen + "  plusSqm:" + plusSqm ) ;
                            sheetSqm = sheetSqm + Math.floor(plusSqm * 0.001) * 0.001 ;
                        }
                        // 最下段の余りが基準値以下の場合、多めに㎡数をとる
                        else if (belowRemainPer == 0 && _this.incSqmBelowRemainPer >= lossWPer) {
                            const plusLen = Math.ceil((usedLen - remainPerW  ) / denominator * coefW)
                            const plusSqm = ( usedLen + plusLen - x.w ) * otherLen ;
                            if( plusSqm <= 0 )sheetSqm = sheetSqm + Math.floor(plusSqm * 0.001) * 0.001 ;
                        }
                    }
                    
                    // 旧計算式
                    // 最下段の余りが基準値以上の場合、余り分を考慮しない使用㎡数
                    // if ((belowRemainPer > 0 && _this.incSqmBelowRemainPer < belowRemainPer ))
                    // {
                    //     const plusLen = belowNumOfRows * lenIncGap - _this.gap + _this.cSheetMarginW;
                    //     const plusSqm = (plusLen - x.w ) * otherLen ;
                    //     // console.log("plus:" + plusLen + "  plusSqm:" + plusSqm ) ;
                    //     sheetSqm = sheetSqm + Math.floor(plusSqm * 0.001) * 0.001 ;
                    // }


                    // ロス率
                    const productSqm = Math.floor(len * otherLen * _this.qty * 0.001) * 0.001 ;
                    lossPerSheet = Math.floor((1 - (productSqm / sheetSqm)) * 10000) / 100 ;

                }



                return {
                    // シート幅
                    w:x.w ,
                    // シート流れ
                    h:x.h ,
                    // 列数
                    numOfCols:numOfCols ,
                    // 列位置
                    colPositions:colPositions ,  
                    // 幅使用mm数 
                    len:usedLen , 
                    // 段数
                    numOfRows:numOfRows ,
                    // 使用予定本数
                    numOfRolls :numOfRolls ,
                    // ロス率(幅)
                    lossWPer:lossWPer ,
                    // ロス率
                    lossPer:lossPerSheet ,
                    // 流れ使用長さ
                    sheetFeedLen:usedH ,
                    // シート使用面積
                    sheetSqm:sheetSqm ,
                    // 最下段 列数
                    belowNumOfRows:belowNumOfRows ,
                    // 最下段 余りm数
                    belowRemainPer:belowRemainPer ,
                } ;


            }) ;

            // 一番良いシート取得
            if ( list.length === 0 ) return {} ;

            const bestRes =
                list.reduce(function (accumulator, currentValue) {
                    const accSqm = accumulator.sheetSqm == 0 ? Number.MAX_VALUE : accumulator.sheetSqm ;
                    const currSqm = currentValue.sheetSqm == 0 ? Number.MAX_VALUE : currentValue.sheetSqm ;

                    // 資材使用㎡数が少ない方
                    let isAcc = accSqm  < currSqm ;

                    return isAcc ? accumulator : currentValue ;
                }) ;

            //console.log(list) ;
            //console.log("bestOne") ;
            //console.log(bestRes) ;

            return bestRes ;


        } ,
    } ,
    computed : {
        cViewBox : function()
        {
            return function(w , h) {
                const wIncMargin = w + this.cSheetMarginW ;
                const hIncMargin = h + this.cSheetMarginH ;
                return `0 0 ${wIncMargin} ${hIncMargin}` ;
            } ;
        } ,
        cStrokeWidth : function(val)
        {
            return function(val)
            {
                return Math.ceil(val / 1000 ) ;
            }

        } ,

        cSheetMarginW : function()
        {
            return this.sheetMarginL + this.sheetMarginR ;
        } ,
        cSheetMarginH : function()
        {
            return this.sheetMarginT + this.sheetMarginB ;
        } ,

        cResults : function()
        {
            if ( this.sheets.length === 0 ){
                this.$emit("update:ok-list" , [] ) ;
                this.$emit("update:ng-list" , [] ) ;
                return [] ;
            }

            if ( this.rects.length === 0 ) return [] ;
            const zeroRects = this.rects.filter(x => x.w === 0 || x.h === 0 ) ;
            if ( zeroRects.length > 0 ) return [] ;

            const _this = this ;
            const list = this.rects.map(function(x,index){
                const obj = {
                    index : index + 1 ,
                    rectW : x.w ,
                    rectH : x.h ,
                    sqm:Math.floor(x.w * x.h * 0.001) * 0.001  ,
                }

                // シートシミュレーション
                const sRes = _this.getMinLossSheetRes(x.w , x.h) ;
                const hRes = _this.getMinLossSheetRes(x.h , x.w) ;
                const isS_better = sRes.lossPer <= hRes.lossPer ;
                const betterRes = isS_better ? sRes : hRes ;

                // 回転
                obj.rotate = isS_better ? 0 : 90 ;
                if (! isS_better)
                {
                    const temp = obj.rectW ;
                    obj.rectW = obj.rectH  ;
                    obj.rectH = temp  ;
                }

                obj.result = betterRes ;
                obj.isSuccess = betterRes.numOfCols > 0 ;

                return obj ;
            }) ;

            const ngList = list.filter(x => ! x.isSuccess )  ;
            this.$emit("update:ng-list" , ngList ) ;

            const okList = list.filter(x => x.isSuccess )
            this.$emit("update:ok-list" , okList ) ;

            return list ;
        } ,
    } ,

}
</script>