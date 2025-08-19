<template>               
    <div>
        {{cBase64Svg}}
        <!-- <div class="d-flex align-items-center" > -->
        <div>
            <div class="row" v-if="cMode == dModeMulti">
                <div class="col-12">

                    <svg xmlns="http://www.w3.org/2000/svg" :viewBox="cViewBox" ref="svg" >                            
                        <g :transform="`scale(${cScale})`">
                            <!-- 寸法 -->
                            <g fill="white">
                                <text :x="cDimWPos" :y="dSvgMargin"
                                        text-anchor="middle"
                                        dominant-baseline="hanging"
                                        :font-size="cDimFontSize">
                                            {{cDisplayW}}
                                    </text>
                                <text :x="dSvgMargin" :y="cDimHPos"
                                        text-anchor="start"
                                        dominant-baseline="middle"
                                        :font-size="cDimFontSize">
                                            {{cDisplayH}}
                                    </text>

                            </g>

                            <!-- 枠 -->
                            <rect 
                                :x="cMargin" :y="cMargin4H" 
                                :width="cDisplayW" :height="cDisplayH" 
                                fill="white" 
                                stroke="gray"  :stroke-width="cStrokeWidth"
                                />
                            <g stroke="red" >            
                                <line v-for="(n ,index) in cSheetSepLines" 
                                    :x1="n.x1" :y1="n.y1" :x2="n.x2" :y2="n.y2"
                                    :stroke-width="cStrokeWidth" 
                                    :stroke-dasharray="cStrokeDashArray"  />
                            </g>     
                            
                            <g stroke="black" v-for="(n ,i) in cSheetRects" >
                                <text :x="n.tPosX" :y="n.tPosY"
                                    text-anchor = "middle"
                                    dominant-baseline = "central"
                                    :font-size="n.fontSize">
                                        {{n.w}}x{{n.h}}
                                </text>
                            </g>

                            <!-- 製品 -->
                            <g >            
                                <rect v-for="(n ,index) in cProductRects" 
                                    :x="n.x" :y="n.y" 
                                    fill-opacity="0%"
                                    :width="n.w" :height="n.h" 
                                    stroke="blue"  stroke-width="1"
                                />
                            </g>     


                        </g>

                                        
                        <!-- <rect v-for="n in cSheetRects"
                            :x="n.posX" :y="n.posY" 
                            :width="n.w" :height="n.h" 
                            fill="gray"  stroke-width="1"
                            :transform="`scale(${cScale})`" /> -->

                    </svg>
                </div>
            </div>
            
            <div class="row" v-if="cMode == dModeSingle">
                <div class="col-12">
                    <svg xmlns="http://www.w3.org/2000/svg" :viewBox="cViewBox" ref="svg" >                            
                        <g :transform="`scale(${cScale})`">
                            <!-- 寸法 -->
                            <g fill="white">
                                <text :x="cDimWPos" :y="dSvgMargin"
                                        text-anchor="middle"
                                        dominant-baseline="hanging"
                                        :font-size="cDimFontSize">
                                            {{cDisplayW}}
                                    </text>
                                <text :x="dSvgMargin" :y="cDimHPos"
                                        text-anchor="start"
                                        dominant-baseline="middle"
                                        :font-size="cDimFontSize">
                                            {{cDisplayH}}
                                    </text>

                            </g>
                            <!-- 枠 -->
                            <rect 
                                :x="cMargin" :y="cMargin4H" 
                                :width="cDisplayW" :height="cDisplayH" 
                                fill="white" 
                                stroke="gray"  stroke-width="1"
                                />
                            
                            <!-- 製品 -->
                            <g >
                                            
                                <rect v-for="(n ,index) in cSingleProductFullRects" 
                                    :x="n.x" :y="n.y" 
                                    fill-opacity="0%"
                                    :width="n.w" :height="n.h" 
                                    stroke="blue"  stroke-width="1"
                                />

                                <rect v-for="(n ,index) in cProductRects" 
                                    :x="n.x" :y="n.y" 
                                    fill="lightblue"
                                    :width="n.w" :height="n.h" 
                                    stroke="blue"  stroke-width="1"
                                />

                                
                            </g>     


                        </g>

                                        
                        <!-- <rect v-for="n in cSheetRects"
                            :x="n.posX" :y="n.posY" 
                            :width="n.w" :height="n.h" 
                            fill="gray"  stroke-width="1"
                            :transform="`scale(${cScale})`" /> -->

                    </svg>
                </div>
            </div>
        </div>
    </div>
        
</template>


<script>
import NumberUtil from '../../../../frameworks/NumberUtil';
import ObjectUtil from '../../../../frameworks/ObjectUtil';
import SvgUtil from '../../../../frameworks/SvgUtil';
import { MaterialBoardLayoutAutoResult } from '../../class/boardLayouts/containers/autoLayout/models/MaterialBoardLayoutAutoResult';

export default {       
    data : function() {
        return {
            dValue : {} ,

            /** 寸法表示用マージン */
            //dMargin4SizeText : 700 , 
            dMargin4SizeText : 117 , 

            /** 寸法表示用マージン */
            //dHeightMargin4SizeText : 350 , 
            dHeightMargin4SizeText : 50 , 

            /** 寸法表示フォントサイズ */
            dDimFontSize : 40 , 


            /** SVG描画のマージン */
            dSvgMargin : 2 , 

            /** 基準サイズ */
            dBaseLength : 1000 ,


            /** モードシングル １シート内に製品をレイアウト */
            dModeSingle : "Single" , 
            /** モードマルチ 複数シートに製品をレイアウト（製品サイズが大きい) */
            dModeMulti : "Multi" , 

        }
    } ,
    props : {
        value : { 
            type : MaterialBoardLayoutAutoResult , 
        } , 
        /***
         * SVG をEmitするか
         */
        isNeedSvgUpdate : {
            type : Boolean , 
            default : () => false 
        } , 

        /**
         * 製品の数量
         */
        productQty : {
            type : Number , 
            default : () => 0 , 
        } ,
        
        /**
         * 製品の長辺
         */
        productLonger : {
            type : Number , 
            default : () => 0 , 
        } ,
        /**
         * 製品の短辺
         */
        productShorter : {
            type : Number , 
            default : () => 0 , 
        } ,
        /**
         * 描画制限列数
         */
        limitNumOfProductCols: {            
            type : Number , 
            default : () => 50 , 
        } , 
        /**
         * 描画制限行数
         */
        limitNumOfProductRows: {            
            type : Number , 
            default : () => 50 , 
        } , 
    } ,
    
    computed : {
        /**
         * base64化したSVG Emit用
         */
        cBase64Svg : function() {

            if ( ! this.isNeedSvgUpdate ) return "" ; 

            const _this = this ; 

            this.$nextTick(function () {                
                const svg = _this.$refs.svg ;             
                // console.log(svg) ; 
                if ( svg !== undefined) {
                    
                    const svgBase64 = btoa(svg.outerHTML) ; 
                    _this.$emit("update:base64svg" , svgBase64) ; 
                    //return svgBase64  ; 
                    return ""; 
                    
                }
            })

            // console.log(`base Pl:${_this.productLonger} Ps:${_this.productShorter} cViewBox:${this.cViewBox}`) ; 
            // console.log(`base cDisplayW:${_this.cDisplayW} Ps:${_this.cDisplayH} `) ; 
            // console.log(cProductRects) ;
        
            // Reactive用            
            for ( const prt of this.cProductRects) {
                if ( prt ) return "" ; 
            }
            if ( _this.productLonger ) return "" ;  
            if ( _this.productShorter ) return "" ;  
            
            if ( _this.cViewBox ) return "" ; 
            if ( _this.cDisplayW || _this.cDisplayH ) return "" ; 
            if ( _this.cDisplayW || _this.cDisplayH ) return "" ; 
            for ( const rt of this.cSingleProductFullRects) {
                if ( rt ) return "" ; 
            }

            return "" ; 
            //return atob(this.$refs.svg) ; 
        } , 
        /**
         * モード
         * Single : １シート内に製品をレイアウト
         * Multi  : 複数シートに製品をレイアウト（製品サイズが大きい) 
         */
        cMode : function() { 
            if (this.value === undefined || ! this.value  ) return this.dModeSingle ; 
            return this.value.Layouter.IsSingle ? this.dModeSingle : this.dModeMulti  ; 

        } , 
        /**
         * テキスト位置、初期マージンを考慮したマージン
         */
        cMargin : function() {
            return this.dMargin4SizeText / this.cScale + this.dSvgMargin ; 
        } , 
        cMargin4H : function() {
            return this.dHeightMargin4SizeText / this.cScale + this.dSvgMargin ; 
        } ,         
        /** SVG枠のW */
        cFrameW : function() { 
            return this.cDisplayW + this.cMargin + this.dSvgMargin  ; 
        } , 
        /** SVG枠のH */
        cFrameH : function() { 
            return this.cDisplayH + this.cMargin4H + this.dSvgMargin  ; 
        } , 
        cProductLonger : function() {
            return NumberUtil.invalid2zr(this.productLonger) ;
        } ,
        cProductShorter : function() {  
            return NumberUtil.invalid2zr(this.productShorter) ;
        } ,
        cPdLongerWIncMargin : function() {            
            return this.cProductLonger + this.dSvgMargin * 2 ; 
        } ,
        cPdShorterWIncMargin : function() {
            return this.cProductShorter + this.dSvgMargin * 2 ; 
        } , 
        /** 寸法　幅位置 */           
        cDimWPos : function () {
            return this.cMargin + this.cDisplayW / 2  ; 
        } , 
        /** 寸法　高さ位置 */           
        cDimHPos : function () {
            return this.cMargin4H + this.cDisplayH / 2  ; 
        } , 
        /** 寸法　フォントサイズ */
        cDimFontSize : function() {
            return this.dDimFontSize / this.cScale ; 
        } , 


        /** 表示幅 */
        cDisplayW : function() {
            if ( this.value === undefined || ! this.value ) return 0 ; 

            
            if ( this.cMode == this.dModeMulti ){
                return this.cProductLonger ; 
            }
            else {
                // Single
                if ( this.cSingleSheet === undefined) return 0 ;
                return Math.max(this.cSingleSheet.width , this.cSingleSheet.height ) ; 

            }
        } , 

        /** 表示高さ */
        cDisplayH : function() {
            if ( this.value === undefined || ! this.value ) return 0 ; 

            
            if ( this.cMode == this.dModeMulti ){
                const numOfLayout = this.value.NumOfProducts ; 
                return this.cProductShorter * numOfLayout  ; 
                
            }else {
                // Single
                if ( this.cSingleSheet === undefined) return 0 ;
                return Math.min(this.cSingleSheet.width , this.cSingleSheet.height ) ; 

            } 
        } , 
        /**
         * Single Modeの時の最初のシート
         */
        cSingleSheet : function() { 
            if ( this.cMode != this.dModeSingle ) return undefined ; 
            if ( ! this.value.Layouter.IsSingle  ) return undefined  ;             
            if ( this.value.Sheets.length === 0 ) return undefined ;
            
            return this.value.MMaterialDetail ; 
            
        } , 
        /**
         * 端位置X
         *  */ 
        cEndX : function() {
            return this.cDisplayW + this.cMargin   ; 
        } ,
        /**
         * 端位置Y
         *  */ 
        cEndY : function() {
            return this.cDisplayH + this.cMargin4H   ; 
        } ,
        cScale : function() {
            const w = this.cDisplayW + this.dMargin4SizeText ;
            const h = this.cDisplayH + this.dHeightMargin4SizeText ;
            const isLongerW = w > h; 
            const longer = isLongerW ? w : h ;  
            // Math.max(this.cDisplayW + this.cMargin, this.cDisplayH + this.cMargin4H) ; 
            let baseLen = this.dBaseLength + this.dSvgMargin * 2  ; 
            //baseLen += isLongerW ? this.dMargin4SizeText : this.dHeightMargin4SizeText ; 
            
            const scale = NumberUtil.invalid2zr(baseLen / longer)   ; 
            //const scale = NumberUtil.invalid2zr(this.dBaseLength / longer)  ; 
            //console.log("scale : " + scale) ; 
            return scale ; 
        } ,
        cViewBox : function() {
            //return `0 0 ${this.cWIncMargin} ${this.cHIncMargin}` ;
            const lengthIncMargins = this.dBaseLength + this.dMargin4SizeText + this.dSvgMargin * 2 ;
            
            const hPer = NumberUtil.invalid2zr( this.cFrameH / this.cFrameW)  ; 
            let hIncMargins = 0  ; 
            if ( hPer == 0 ) {
                hIncMargins = lengthIncMargins ;
            }
            else {
                hIncMargins = hPer * lengthIncMargins; 
            }
            //console.log("hIncMargins : " + `0 0 ${lengthIncMargins} ${hIncMargins}`)  ; 
            
            return `0 0 ${lengthIncMargins } ${hIncMargins}` ;
        } ,
        
        cStrokeWidth : function() 
        {
            return 1 / this.cScale  ; 
        } , 
        cStrokeDashArray : function() 
        {
            const dash = this.cStrokeWidth * 4 ; 
            return `${dash} ${dash}`; 
        } ,

        /**
         * シートの分割位置
         */
        cSheetSepLines : function() {
            if ( this.value === undefined || ! this.value ) return [] ; 
            if ( this.value.Sheets === undefined ) return [] ; 


            const sIsProductRotate = this.value.Layouter.IsProductRotate ; 

            // 座標取得
            let pos = sIsProductRotate ? this.cMargin4H : this.cMargin ;    
            let res = [] ; 
            const sheets = this.value.Sheets ; 
            for ( let i = 0 ; i < sheets.length ; i ++  ){
                const sheet = sheets[i] ; 
                for ( let j = 0 ; j < sheet.qty ; j ++  ){
                    const row = ObjectUtil.deepCopyJ(sheet) ;

                    row.x1 = sIsProductRotate ? this.cMargin : pos  ;
                    row.x2 = sIsProductRotate ? this.cEndX : pos  ;
                    row.y1 = sIsProductRotate ? pos : this.cMargin4H  ;
                    row.y2 = sIsProductRotate ? pos : this.cEndY  ;

                    pos += sIsProductRotate ? sheet.h : sheet.w ; 
                    res.push(row) ;                      
                }
            }
                
            if ( res.length === 0 ) return [] ; 
            // 1つ目を削除
            return res.slice(1 ) ; 

        } ,

        /**
         * シートの位置とテキスト位置
         */
        cSheetRects : function() {
            if ( this.value === undefined || ! this.value ) return [] ; 
            if ( this.value.Sheets === undefined ) return [] ; 

            // 製品の回転
            const sIsProductRotate = this.value.Layouter.IsProductRotate ; 

            let pos = sIsProductRotate ? this.cMargin4H : this.cMargin ;    
            let res = [] ; 
            const sheets = this.value.Sheets ; 
            for ( let i = 0 ; i < sheets.length ; i ++  ){
                const sheet = sheets[i] ; 
                const plus = sIsProductRotate ? sheet.h : sheet.w ; 
                // 割られていない方
                let notSeparetedPos = 0 ; 
                if ( sIsProductRotate) {
                    notSeparetedPos = sheet.w / 2 + this.cMargin ; 
                } 
                else {
                    notSeparetedPos = sheet.h / 2 + this.cMargin4H ; 
                }
                //console.log(`plus: ${plus} pos: ${pos} `) ; 
                for ( let j = 0 ; j < sheet.qty ; j ++  ){
                    const row = ObjectUtil.deepCopyJ(sheet) ;

                    // テキスト位置
                    row.tPosX = sIsProductRotate ? notSeparetedPos  : pos + (plus / 2)  ;
                    row.tPosY = sIsProductRotate ? pos + (plus / 2) : notSeparetedPos;
                    
                    
                    const numOfStr = NumberUtil.getLength(row.w) + NumberUtil.getLength(row.h) + 1 ; 
                    const fSize = SvgUtil.getMaxFontSize4SvgNumberText(
                        numOfStr ,this.cDisplayW ,this.cDisplayH  , row.w ,row.h ) ;
                    row.fontSize = fSize ; 

                    pos += plus ; 
                    res.push(row) ;                      
                }
            }
                
            return res ; 

        } ,
        /**
         * 製品を全面つけた時の四角
         */
        cSingleProductFullRects : function() {
            if ( this.value === undefined || ! this.value ) return [] ; 
            if ( this.cMode !== this.dModeSingle ) return [] ;
            if ( this.value.Sheets.length === 0 ) return [] ;  

            // 製品の回転
            const sIsProductRotate = this.value.Layouter.IsProductRotate ; 

            
            const rects = [] ; 
            // col  
            for ( let i = 0 ; i < this.value.NumOfProductCols ; i++  ){
                if ( this.limitNumOfProductCols < i ) break ; 
                const xPos = i * (sIsProductRotate ? this.productShorter : this.productLonger ) ; 
                const rows = this.value.NumOfProductRows ; 
                for ( let j = 0 ; j < rows ; j++  ){
                    if ( this.limitNumOfProductRows < j ) break ; 
                    const yPos = j * (sIsProductRotate ? this.productLonger : this.productShorter ) ; 

                    rects.push({
                        x: xPos + this.cMargin   ,
                        y: yPos + this.cMargin4H ,
                        w: sIsProductRotate ? this.productShorter : this.productLonger ,
                        h: sIsProductRotate ? this.productLonger : this.productShorter ,
                        
                    }) ;
                }

                    
            }

            return rects ; 
            //return this.getRectsOfSingleSheet(this.value.Sheets[0] , sIsProductRotate) ;
            

        } , 
        /**
         * 製品の位置 
         **/ 
        cProductRects : function() {
            // return [] ; 
            // console.log("cProductRects") ; 
            if ( this.value === undefined || ! this.value ) return [] ; 

            // 
            const numOfProducts = NumberUtil.invalid2zr(this.value.NumOfProducts)  ; 

            // 製品の回転
            const sIsProductRotate = this.value.Layouter.IsProductRotate ; 
            
            const rects = [] ; 

            const _this = this ; 
            if ( this.cMode == this.dModeMulti){
                for ( let i = 0 ; i < numOfProducts ; i++  ){
                    const pos = i * _this.productShorter  ; 
                    rects.push({
                        x: (sIsProductRotate ? pos : 0 ) + _this.cMargin ,
                        y: (sIsProductRotate ? 0 : pos ) + _this.cMargin4H  ,
                        // w: sIsProductRotate ? _this.productShorter : _this.productLonger ,
                        // h: sIsProductRotate ? _this.productLonger : _this.productShorter ,
                        w: this.cDisplayW ,
                        h: this.cDisplayH ,
                        
                    }) ;
                        
                }

            }
            else { 
                // const lastSheet = this.value.Sheets.slice(-1)[0] ;

                return this.getRectsOfSingleSheet(this.value  , sIsProductRotate) ; 
                
            }

            return rects ; 


        }



    } ,
    methods : {
        /**
         * シートから配置されている製品の四角を取得
         */
        getRectsOfSingleSheet : function(result  ,sIsProductRotate) {
            // console.log(`NumOfProductCols:${result.NumOfProductCols} NumOfProductRows:${result.NumOfProductRows} numOfProducts:${result.NumOfProducts}`) ; 
            if ( this.result === undefined  ) return [] ; 
            
            const rects = [] ; 
            let cnt = 1 ; 
            const limitQty = this.productQty %  result.NumOfProducts ; 
            // console.log(`limitQty : ${limitQty}`) ; 
            // col  
            for ( let i = 0 ; i < result.NumOfProductCols ; i++  ){
                if ( this.limitNumOfProductCols < i ) break ; 
                const xPos = i * (sIsProductRotate ? this.productShorter : this.productLonger ) ; 
                const rows = result.NumOfProductRows ; 
                for ( let j = 0 ; j < rows ; j++  ){
                    if ( this.limitNumOfProductRows < j ) break ; 
                    const yPos = j * (sIsProductRotate ? this.productLonger : this.productShorter ) ; 

                    rects.push({
                        x: xPos + this.cMargin ,
                        y: yPos + this.cMargin4H,
                        w: sIsProductRotate ? this.productShorter : this.productLonger ,
                        h: sIsProductRotate ? this.productLonger : this.productShorter ,
                        
                    }) ;

                    if ( limitQty <= cnt ) return rects ; 
                    cnt ++ ; 
                }

                    
            }

            return rects ; 

        } , 
    } ,
    created : async function() 
    {
    }
    
} 
</script>