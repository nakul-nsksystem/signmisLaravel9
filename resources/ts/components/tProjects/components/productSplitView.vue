<template>
    <div class="row">
        <div class="col-12">
            <svg xmlns="http://www.w3.org/2000/svg" 
                :viewBox="cViewBox" ref="svg" >
                <g :transform="`scale(${cScale})`">
                    <!-- 寸法 -->
                    <g fill="white">
                        <text :x="cDimWPos" :y="dSvgMargin + cMarginH4SizeText - cHLengthPerChar / 2 "
                                text-anchor="middle"
                                dominant-baseline="text-top"
                                :font-size="cDimFontSize">
                                    {{w}}
                            </text>
                        <text :x="dSvgMargin + cMarginW4SizeText - cWLengthPerChar" :y="cDimHPos"
                                text-anchor="end"
                                dominant-baseline="middle"
                                :font-size="cDimFontSize">
                                    {{h}}
                            </text>

                    </g>

                    <!-- 枠 -->
                    <g fill="white" stroke="white">
                        <rect 
                            :x="cMarginW" :y="cMarginH" 
                            :width="w" :height="h" 
                            fill="white" 
                            stroke="gray"  stroke-width="1"  />

                        <!-- 枠寸法 -->

                        <!-- 左 -->
                        <line 
                            :x1="cMarginW" :y1="cMarginH - cExtendLength4ExtendLine" :x2="cMarginW" :y2="cMarginH"
                            :stroke-width="cStrokeWidth"   />
                        <!-- 右 -->
                        <line 
                            :x1="cMarginW + w" :y1="cMarginH - cExtendLength4ExtendLine" :x2="cMarginW + w" :y2="cMarginH"
                            :stroke-width="cStrokeWidth"   />
                        
                        <ns-arrow-svg 
                            :x1="cDimWPos - cWLengthPerChar / 2 * w.toString().length "
                            :x2="cMarginW"
                            :y1="dSvgMargin + cHLengthPerChar / 2 "
                            :y2="dSvgMargin + cHLengthPerChar / 2 "
                            :stroke-width="cStrokeWidth"
                            :arrow-length="cArrowLength"                            
                            stroke="white"
                        /> 
                        <ns-arrow-svg 
                            :x1="cDimWPos + cWLengthPerChar / 2 * w.toString().length "
                            :x2="cMarginW + w"
                            :y1="dSvgMargin + cHLengthPerChar / 2 "
                            :y2="dSvgMargin + cHLengthPerChar / 2 "
                            :stroke-width="cStrokeWidth"
                            :arrow-length="cArrowLength"
                            stroke="white"
                        /> 


                        <!-- 上 -->
                        <line 
                            :x1="cMarginW" :y1="cMarginH" :x2="cMarginW - cExtendLength4ExtendLine" :y2="cMarginH"
                            :stroke-width="cStrokeWidth"   />
                        <!-- 下 -->
                        <line 
                            :x1="cMarginW" :y1="cMarginH + h" :x2="cMarginW - cExtendLength4ExtendLine" :y2="cMarginH + h"
                            :stroke-width="cStrokeWidth"   />

                        <ns-arrow-svg 
                            :x1="cMarginW - cWLengthPerChar * 2"
                            :x2="cMarginW - cWLengthPerChar * 2"
                            :y1="cDimHPos - cHLengthPerChar / 2"
                            :y2="cMarginH"
                            :stroke-width="cStrokeWidth"
                            :arrow-length="cArrowLength"
                            stroke="white"
                        /> 
                        <ns-arrow-svg 
                            :x1="cMarginW - cWLengthPerChar * 2"
                            :x2="cMarginW - cWLengthPerChar * 2"
                            :y1="cDimHPos + cHLengthPerChar / 2"
                            :y2="cMarginH + h"
                            :stroke-width="cStrokeWidth"
                            :arrow-length="cArrowLength"
                            stroke="white"
                        /> 

                    </g>


                    <!-- 伸ばし -->
                    <!-- 上 -->
                    <g stroke="lightskyblue" fill="skyblue" >                        
                        <line 
                            :x1="cMarginW" :y1="cMarginH + extendT" :x2="cMarginW + w + cExtendLength4ExtendLine" :y2="cMarginH + extendT"
                            :stroke-width="cStrokeWidth"   />
                        <text :x="cMarginW + w + cExtendLength4ExtendLine + dLeftMargin4ExtendTbText" :y="cMarginH + extendT"
                            text-anchor = "left"
                            dominant-baseline = "central"
                            :font-size="cDimFontSize">
                                {{extendT}}
                        </text>                        
                    </g>

                    <!-- 下 -->
                    <g stroke="lightskyblue" fill="skyblue" >
                        <line 
                            :x1="cMarginW" :y1="cMarginH + h - extendB" :x2="cMarginW + w + cExtendLength4ExtendLine" :y2="cMarginH + h - extendB"
                            :stroke-width="cStrokeWidth"   />
                        <text :x="cMarginW + w + cExtendLength4ExtendLine + dLeftMargin4ExtendTbText" :y="cMarginH + h - extendB"
                            text-anchor = "left"
                            dominant-baseline = "central"
                            :font-size="cDimFontSize">
                                {{extendB}}
                        </text>
                    </g>


                    <!-- 左 -->
                    <g stroke="lightskyblue" fill="skyblue">
                        <line 
                            :x1="cMarginW + extendL" :y1="cMarginH" :x2="cMarginW + extendL" :y2="cMarginH + h + cExtendLength4ExtendLine"
                            :stroke-width="cStrokeWidth" />
                        <text :x="cMarginW + extendL" :y="cMarginH + h + cExtendLength4ExtendLine + dBottomMargin4ExtendLrText"
                            text-anchor = "middle"
                            dominant-baseline = "text-before-edge"
                            :font-size="cDimFontSize">
                                {{extendL}}
                        </text>
                    </g>

                    <!-- 右 -->
                    <g stroke="lightskyblue" fill="skyblue">
                        <line 
                            :x1="cMarginW + w - extendR" :y1="cMarginH" :x2="cMarginW + w - extendR" :y2="cMarginH + h + cExtendLength4ExtendLine"
                            :stroke-width="cStrokeWidth" />
                        <text :x="cMarginW + w - extendR" :y="cMarginH + h + cExtendLength4ExtendLine + dBottomMargin4ExtendLrText"
                            text-anchor = "middle"
                            dominant-baseline = "text-before-edge"
                            :font-size="cDimFontSize">
                                {{extendR}}
                        </text>
                    </g>
                    
                    <!-- 分割線 -->
                    <g stroke="lightcoral" fill="lightcoral">
                        <g v-for="(n ,index) in cWPositions" :key="index">
                            <g v-if="index !== cWPositions.length - 1">
                                <line                                 
                                    :x1="cMarginW + n.abs_pos" :y1="cMarginH" :x2="cMarginW + n.abs_pos" :y2="cMarginH + h + cExtendLength4ExtendLine"
                                    :stroke-width="cStrokeWidth" 
                                    :stroke-dasharray="cStrokeDashArray"  />
                                <text :x="cMarginW + n.abs_pos" :y="cMarginH + h + cExtendLength4ExtendLine + dBottomMargin4ExtendLrText"
                                    text-anchor = "middle"
                                    dominant-baseline = "text-before-edge"
                                    :font-size="cDimFontSize">
                                        {{overlapLength}}
                                </text>          
                                  

                            </g>
                            <g fill="palegreen">
                                <text :x="cMarginW + n.dim_text_pos" :y="cMarginH + h + cTopMargin4SeparateTbText"
                                    text-anchor = "middle"
                                    dominant-baseline = "text-before-edge"
                                    :font-size="cDimFontSize">
                                        {{n.pos}}
                                </text>
                                
                                <g v-if="n.pos > 220">
                                    <ns-arrow-svg 
                                        :x1="cMarginW + n.dim_text_pos - cWLengthPerChar / 2 * n.pos.toString().length "
                                        :x2="cMarginW + n.dim_text_pos - n.pos / 2 "
                                        :y1="cMarginH + h + cTopMargin4SeparateTbText + cHLengthPerChar / 2"
                                        :y2="cMarginH + h + cTopMargin4SeparateTbText + cHLengthPerChar / 2"
                                        :stroke-width="cStrokeWidth"
                                        :arrow-length="cArrowLength"
                                        stroke="palegreen"
                                    />              
                                    
                                    <ns-arrow-svg 
                                        :x1="cMarginW + n.dim_text_pos + cWLengthPerChar / 2 * n.pos.toString().length "
                                        :x2="cMarginW + n.dim_text_pos + n.pos / 2 "
                                        :y1="cMarginH + h + cTopMargin4SeparateTbText + cHLengthPerChar / 2"
                                        :y2="cMarginH + h + cTopMargin4SeparateTbText + cHLengthPerChar / 2"
                                        :stroke-width="cStrokeWidth"
                                        :arrow-length="cArrowLength"
                                        stroke="palegreen"
                                    />                                     
                                </g>

                            </g>
                        </g>

                    </g>
                    <g stroke="lightcoral" fill="lightcoral">
                        <g v-for="(n ,index) in cHPositions" :key="index">
                            <g v-if="index !== cHPositions.length - 1">
                                <line 
                                    :x1="cMarginW" :y1="cMarginH + n.abs_pos" :x2="cMarginW + w + cExtendLength4ExtendLine" :y2="cMarginH + n.abs_pos"
                                    :stroke-width="cStrokeWidth" 
                                    :stroke-dasharray="cStrokeDashArray"  />
                                <text :x="cMarginW + w + cExtendLength4ExtendLine + dLeftMargin4ExtendTbText" :y="cMarginH + n.abs_pos"
                                    text-anchor = "left"
                                    dominant-baseline = "central"
                                    :font-size="cDimFontSize">
                                        {{overlapLength}}
                                </text>


                            </g>
                    
                            <g fill="palegreen">
                                <text :x="cMarginW + w + cLeftMargin4SeparateTbText" :y="cMarginH + n.dim_text_pos "
                                    text-anchor = "start"
                                    dominant-baseline = "central"
                                    :font-size="cDimFontSize">
                                        {{n.pos}}
                                </text>
                                <g v-if="n.pos > 99">
                                    <ns-arrow-svg 
                                        :x1="cMarginW + w + cLeftMargin4SeparateTbText + cWLengthPerChar "
                                        :x2="cMarginW + w + cLeftMargin4SeparateTbText + cWLengthPerChar "
                                        :y1="cMarginH + n.dim_text_pos - cHLengthPerChar"
                                        :y2="cMarginH + n.dim_text_pos - n.pos / 2"
                                        :stroke-width="cStrokeWidth"
                                        :arrow-length="cArrowLength"
                                        stroke="palegreen"
                                    />
                                    <ns-arrow-svg 
                                        :x1="cMarginW + w + cLeftMargin4SeparateTbText + cWLengthPerChar "
                                        :x2="cMarginW + w + cLeftMargin4SeparateTbText + cWLengthPerChar "
                                        :y1="cMarginH + n.dim_text_pos + cHLengthPerChar"
                                        :y2="cMarginH + n.dim_text_pos + n.pos / 2"
                                        :stroke-width="cStrokeWidth"
                                        :arrow-length="cArrowLength"
                                        stroke="palegreen"
                                    />
                                </g>
                            </g>
                        </g>


                    </g>    
                    
                    <!-- 寸法テキスト -->
                    <g stroke="black" v-for="(n ,i) in cSepalatedRects" :key="i + 'TH'" >
                        <text :x="n.tPosX" :y="n.tPosY"
                            text-anchor = "middle"
                            dominant-baseline = "central"
                            :font-size="n.fontSize">
                                {{n.w}}x{{n.h}}
                        </text>
                    </g>
                    

                </g>
            </svg>    
        </div>
    </div>
</template>

<script>
import SvgConst from '../../../consts/SvgConst'
import NumberUtil from '../../../frameworks/NumberUtil'
import SvgUtil from "../../../frameworks/SvgUtil"

export default {
    data :  function() {
        return {

            /** SvgEmit用 */
            // dIsUpdatedRect : false ,             

            /** 寸法表示用マージン */
            //dMarginW4SizeText : 700 , 
            dMarginW4SizeText : 127 , 

            /** 寸法表示用マージン */
            //dMarginH4SizeText : 350 , 
            dMarginH4SizeText : 70 , 

            /**
             * 右端　伸ばし寸法表示用マージン
             */
            dMarginW4ExtendTbText : 120 , 

            /**
             * 右端　伸ばし寸法テキスト　左マージン
             */
            dLeftMargin4ExtendTbText : 40 , 

            /**
             * 下端　伸ばし寸法テキスト　上マージン
             */
            dBottomMargin4ExtendLrText : 40 , 

            /**
             * 右端　分割寸法テキスト　左マージン
             */
            dLeftMargin4SeparateTbText : 20 , 

            /**
             * 下端　分割寸法テキスト　上マージン
             */
            dTopMargin4SeparateTbText : 15 , 


            /**
             * 伸ばし用の線の延長距離
             */
            dExtendLength4ExtendLine:80 ,


            /** 寸法表示フォントサイズ */
            dDimFontSize : 40 , 

            /** 基準サイズ */
            dBaseLength : 1000 ,

            /** SVG描画のマージン */
            dSvgMargin : 2 , 

            dUpdateSvg : false ,
            

        } 
    } , 
    props : {
        wSep : {
            type : Array ,            
        } ,
        hSep : {
            type : Array ,            
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
        wWithOverlap : {
            type : Number ,
            default : () => 0  ,
        },
        hWithOverlap : {
            type : Number ,
            default : () => 0  ,
        },
        isViewDimensions : {
            type : Boolean ,
            default : () => false ,
        } , 
        // 重ね代
        overlapLength : {
            type : Number ,
        } ,
        /***
         * SVG をEmitするか
         */
        isNeedSvgUpdate : {
            type : Boolean , 
            default : () => false 
        } , 
        /**
         * 分割されたシート
         */
        separatedRects : { 
            type : Array , 
            default : () => [] , 
        }

    } ,
    watch : {},
    methods : {
        getSepPositions: function( positions){
            return positions.map(x => { 
                const row = {} ;
                Object.assign(row ,x ) ; 

                row.dim_text_pos = x.abs_pos - (x.pos / 2) ; 
                return row ; 
            }) ; 
        } ,
        /**
         * base64化したSVG Emit用
         */
        updateBase64Svg : function() {             
            if ( ! this.isNeedSvgUpdate )  ; 

            
            const _this = this ; 
            // console.log("update cBase64Svg") ; 
            
            this.$nextTick(function () {                
                const svg = _this.$refs.svg ;             
                //console.log(svg) ; 
                if ( svg !== undefined) {
                    
                    const svgBase64 = btoa(svg.outerHTML) ; 
                    _this.$emit("update:base64svg" , svgBase64) ; 
                    //return svgBase64  ; 
                    // return ""; 

                    
                }
            })

        
            
        }
    } ,
    computed : {        

        /**
         * Scale
         */
        cScale : function() {
            const w = this.w + this.dMarginW4SizeText ;
            const h = this.h + this.dMarginH4SizeText ;
            const isLongerW = w > h; 
            const longer = isLongerW ? w : h ;  
            let baseLen = this.dBaseLength + this.dSvgMargin * 2  ; 
            
            const scale = NumberUtil.invalid2zr(baseLen / longer)   ; 
            return scale ; 
        } ,
        /**
         * テキスト位置、初期マージンを考慮したマージン
         */
        cMarginW : function() {
            return this.cMarginW4SizeText + this.dSvgMargin ; 
        } , 
        cMarginH : function() {
            return this.cMarginH4SizeText + this.dSvgMargin ; 
        } ,         
        /** SVG枠のW */
        cFrameW : function() { 
            // 50は右のテキスト分
            return NumberUtil.invalid2zr(this.w) + this.cMarginW + this.dExtendLength4ExtendLine + this.dMarginW4ExtendTbText + this.dSvgMargin * 2  ; 
        } , 
        /** SVG枠のH */
        cFrameH : function() { 
            return NumberUtil.invalid2zr(this.h) + this.cMarginH + this.dExtendLength4ExtendLine + this.dMarginH4ExtendLrText + this.dSvgMargin * 2  ; 
        } ,         
        /** ViewBox */
        cViewBox : function() {
            //return `0 0 ${this.cWIncMargin} ${this.cHIncMargin}` ;
            const lengthIncMargins = this.dBaseLength + this.dMarginW4SizeText + this.dExtendLength4ExtendLine + this.dMarginW4ExtendTbText + this.dSvgMargin * 2 ;  
            

            const hPer = NumberUtil.invalid2zr( this.cFrameH / this.cFrameW)  ; 
            let hIncMargins = 0  ; 
            if ( hPer == 0 || hPer > 1 ) {
                hIncMargins = lengthIncMargins ;
            }
            else {                
                hIncMargins = hPer * lengthIncMargins ; 
                
            }
            //console.log("hIncMargins : " + `0 0 ${lengthIncMargins} ${hIncMargins}`)  ; 
            
            return `0 0 ${lengthIncMargins } ${hIncMargins}` ;
        } ,
        /**
         * 伸ばしの延長線
         */
        cExtendLength4ExtendLine : function() { 
            return this.dExtendLength4ExtendLine / this.cScale ; 
        } ,
        cTopMargin4SeparateTbText : function() { 
            return this.dTopMargin4SeparateTbText / this.cScale ; 
        } , 
        cLeftMargin4SeparateTbText : function() { 
            return this.dLeftMargin4SeparateTbText / this.cScale ; 
        } , 


        /** Text */
        
        cMarginW4SizeText : function() { 
            return this.dMarginW4SizeText / this.cScale
        } , 
        cMarginH4SizeText : function() { 
            return this.dMarginH4SizeText / this.cScale ; 
        } , 

        /** 寸法　幅位置 */           
        cDimWPos : function () {
            return this.cMarginW + this.w / 2  ; 
        } , 
        
        /** 寸法　高さ位置 */           
        cDimHPos : function () {
            return this.cMarginH + this.h / 2  ; 
        } , 
        /** 寸法　フォントサイズ */
        cDimFontSize : function() {
            return this.dDimFontSize / this.cScale ; 
        } , 
        /**
         * DimFontSizeの1文字あたりの幅
         */
        cWLengthPerChar : function() { 
            return this.cDimFontSize * SvgConst.C_FONT_W_PER_FONTSIZE ; 
        } ,
        /**
         * DimFontSizeの1文字あたりの高さ
         */
        cHLengthPerChar : function() { 
            return this.cDimFontSize * SvgConst.C_FONT_H_PER_FONTSIZE ; 
        } ,

        cArrowLength : function() 
        {
            return 25 / this.cScale ; 
        } , 

        cStrokeWidth : function() 
        {
            return 2 / this.cScale ; 
        } , 

        cStrokeDashArray : function() 
        {
            const dash = this.cStrokeWidth * 4 ; 
            return `${dash} ${dash}`; 
        } ,
        cWPositions : function () 
        {            
            const pos = this.getSepPositions(this.wSep) ;             
            return pos ; 
        } , 
        cHPositions : function () 
        {
            const pos = this.getSepPositions(this.hSep) ;             
            return pos ; 
        } , 
        // 分割結果
        cSepalatedRects : function() {
            const _this = this ; 
            
            const mapped = this.separatedRects.map(x => { 
                const row = {} ;
                Object.assign(row ,x ) ; 
                const numOfStr = "9999x9999".length ; 
                const fSize = SvgUtil.getMaxFontSize4SvgNumberText(numOfStr ,_this.wWithOverlap ,_this.hWithOverlap  , x.w - this.overlapLength  ,x.h - this.overlapLength ) ;
                row.tPosX += _this.cMarginW ; 
                row.tPosY += _this.cMarginH ; 

                
                // x.tPosX += _this.cMarginW ; 
                row.fontSize = fSize ; 
                return row; 

            }) ; 

            // this.cBase64Svg ; 
            // console.log("cSepalatedRects") ; 
            // if (! this.dUpdateSvg ) this.dUpdateSvg = true ; 
            this.updateBase64Svg() ; 
            return mapped ; 

            
        }

    } ,
    created : function() { 
    } ,
    
}
</script>