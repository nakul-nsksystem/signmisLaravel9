<template>   
            
    <div>
        <!-- {{cSizeW}}x{{cSizeH}} -->
        <svg :viewBox="cViewBox">
            <!-- 枠 -->
            <rect 
                :x="dSvgMargin" :y="dSvgMargin" 
                :width="cSizeW" :height="cSizeH" 
                fill="white" 
                stroke="gray"  stroke-width="1"
                :transform="`scale(${cScale})`" />
        
            <!-- 上 -->
            <rect v-show="cIsTopShow"
                :x="cTopPos.x" :y="cTopPos.y" 
                :width="cTopPos.width" :height="cTopPos.height" 
                :fill="fillColor" stroke="white" stroke-width="0"
                :transform="`scale(${cScale})`"/>


            <!-- 下 -->
            <rect v-show="cIsBottomShow"
                :x="cBottomPos.x" :y="cBottomPos.y" 
                :width="cBottomPos.width" :height="cBottomPos.height" 
                :fill="fillColor" stroke="white" stroke-width="0"
                :transform="`scale(${cScale})`"/>

            <!-- 左 -->
            <rect v-show="cIsLeftShow"
                :x="cLeftPos.x" :y="cLeftPos.y" 
                :width="cLeftPos.width" :height="cLeftPos.height" 
                :fill="fillColor" stroke="white" stroke-width="0"
                :transform="`scale(${cScale})`"/>
                

            <!-- 左 -->
            <rect v-show="cIsRightShow"
                :x="cRightPos.x" :y="cRightPos.y" 
                :width="cRightPos.width" :height="cRightPos.height" 
                :fill="fillColor" stroke="white" stroke-width="0"
                :transform="`scale(${cScale})`"/>
                
            <!-- ハトメ位置上 -->
            <circle v-show="isGrommet && cIsTopShow" v-for="(n,index ) in cTopGrommets" 
                :cx="n.x" :cy="n.y" :r="n.radius" :fill="grommetFill" 
                :transform="`scale(${cScale})`"
                >
            </circle>

            
            <!-- ハトメ位置下 -->
            <circle v-show="isGrommet && cIsBottomShow" v-for="(n,index ) in cBottomGrommets"
                :cx="n.x" :cy="n.y" :r="n.radius" :fill="grommetFill" 
                :transform="`scale(${cScale})`"
                >
            </circle>

            <!-- ハトメ位置左 -->
            <circle v-show="isGrommet && cIsLeftShow" v-for="(n,index ) in cLeftGrommets" 
                :cx="n.x" :cy="n.y" :r="n.radius" :fill="grommetFill" 
                :transform="`scale(${cScale})`"
                >
            </circle>

            <!-- ハトメ位置右 -->
            <circle v-show="isGrommet && cIsRightShow" v-for="(n,index ) in cRightGrommets" 
                :cx="n.x" :cy="n.y" :r="n.radius" :fill="grommetFill" 
                :transform="`scale(${cScale})`"
                >
            </circle>
            


                <!-- cx="20" cy="20" r="15" :fill="grommetFill"/>

            <circle v-show="isGrommet" 
                cx="20" cy="20" r="15" fill="darkgoldenrod"/> -->
            
            <!-- ミシン -->
            <!-- <rect x="1" y="1" width="200" height="150" fill="none" stroke="white" stroke-width="1"/>

            <rect x="2" y="1" width="198" height="30" fill="lightblue" stroke="white" stroke-width="0"/>
            <rect x="2" y="120" width="198" height="30" fill="lightblue" stroke="white" stroke-width="0"/>

            <rect x="2" y="1" width="30" height="148" fill="lightblue" stroke="white" stroke-width="0"/>
            <rect x="170" y="1" width="30" height="148" fill="lightblue" stroke="white" stroke-width="0"/> -->


        </svg>
        
    </div>
        
</template>


<script>
import NumberUtil from '../../../../../frameworks/NumberUtil';
import TProductProcessMixins from '../../../../../mixins/tProject/TProductProcessMixins';

import { PostCartainEdges } from '../consts/PostCartainDefs';

//import tProductProcessMixins from "./../../../../mixins/tProduct/tProductProcessMixins" ;



//import visConfig from "./tProductProcessPostCartain-vis" ;

export default {       
    mixins : [TProductProcessMixins] ,      
    data : function() {
        return {
            dValue : {} ,

            /** SVG描画のマージン */
            dSvgMargin : 2 , 

            /** 基準サイズ */
            dBaseLength : 1000 ,

            /** 選択辺のサイズ */
            dBaseSideLength : 50 ,

        }
    } ,
    props : {
        pt : {
            type : String ,
            require : true 
        } ,         
        // 対応するカラム
        columns : {
            type: Object ,
            require : true 
        } ,
        sizeW : {
            type : Number , 
            default : () => 0 , 
        } ,
        sizeH : {
            type : Number , 
            default : () => 0 , 
        } ,
        fillColor: {
            type : String , 
            default : () => "lightblue"
        } ,
        // ハトメのマージン
        grommetMargin : {
            type : Number ,
            default : () => 0 ,         
        } ,         
        isGrommet : {
            type : [Boolean ,Number] ,
            default : () => false ,
        } , 
        // ハトメピッチ（計算後)
        grommetPitch : {
            type : Object , 
            default : { w:0 ,h:0} ,
        } ,
        // ハトメの半径
        grommetRadius : {
            type : Number ,
            default : () => 15 , 
        } ,
        grommetFill : {
            type : String , 
            default : () => "darkgoldenrod"
        }
    } ,
    
    computed : {
        
        cSizeW : function() {            
            return NumberUtil.invalid2zr(this.sizeW ) ; 
        } ,
        cSizeH : function() {
            return NumberUtil.invalid2zr(this.sizeH ) ; 
        } , 
        cWIncMargin : function() {            
            return this.cSizeW + this.dSvgMargin * 2 ; 
        } ,
        cHIncMargin : function() {
            return this.cSizeH + this.dSvgMargin * 2 ; 
        } ,            
        cScale : function() {
            const longer = Math.max(this.cSizeW , this.cSizeH) ; 
            const scale = NumberUtil.invalid2zr( this.dBaseLength / longer)  ; 
            return scale ; 
        } ,
        cViewBox : function() {
            //return `0 0 ${this.cWIncMargin} ${this.cHIncMargin}` ;
            const lengthIncMargins = this.dBaseLength + this.dSvgMargin * 2 ;
            return `0 0 ${lengthIncMargins } ${lengthIncMargins}` ;
        } ,
        // 選択枠の大きさ
        cSideLength : function() {

            /*
            const longer = NumberUtil.invalid2zr(Math.max(this.sizeW , this.sizeH )) ; 
            const shorter = NumberUtil.invalid2zr(Math.min(this.sizeW , this.sizeH )) ; 
            let len = longer * 0.1 ; 
            if ( len > (shorter / 2 )) len = (shorter / 2 ) * 0.5 ; 
            */
            const shorter = Math.min(this.cSizeW , this.cSizeH ) ; 
            
            let len = NumberUtil.invalid2zr( this.dBaseSideLength / this.cScale) ; 
            //let len = this.dBaseSideLength  ; 
            //if ( this.dBaseSideLength * 2 > shorter ) len = shorter * 0.4 ; 
 
            return len ; 
        } ,
        // 無効サイズ
        cIsInvalidSize : function() {
            return NumberUtil.invalid2zr(this.cSizeW)  <= 0 ||
                NumberUtil.invalid2zr(this.cSizeH)  <= 0  ; 
        } ,
        // 上表示
        cIsTopShow : function () {
            if ( this.cIsInvalidSize ) return false ; 
            const isShow = this.pt === PostCartainEdges.All || 
                            this.pt === PostCartainEdges.Tb ||
                            this.pt === PostCartainEdges.T ; 
            return isShow ; 

        } ,
        cTopPos : function() {
            return {
                x       : this.dSvgMargin   ,
                y       : this.dSvgMargin   ,
                width   : this.cSizeW       ,
                height  : this.cSideLength ,
            } ; 
        } ,
        
        // 下表示
        cIsBottomShow : function () {
            if ( this.cIsInvalidSize ) return false ; 
            const isShow =  this.pt === PostCartainEdges.All || 
                            this.pt === PostCartainEdges.Tb  ||
                            this.pt === PostCartainEdges.B   ; 
            return isShow ; 

        } ,
        cBottomPos : function() {
            return {
                x : this.dSvgMargin ,
                y : this.dSvgMargin + this.cSizeH - this.cSideLength ,
                width  : this.cSizeW        ,
                height : this.cSideLength  ,
            } ; 
        } ,
        // 左表示
        cIsLeftShow : function () {
            if ( this.cIsInvalidSize ) return false ; 
            const isShow = this.pt === PostCartainEdges.All || 
                            this.pt === PostCartainEdges.Lr ||
                            this.pt === PostCartainEdges.L ; 
            return isShow ; 

        } ,
        cLeftPos : function() {
            return {
                x : this.dSvgMargin ,
                y : this.dSvgMargin ,
                width  : this.cSideLength ,
                height : this.cSizeH ,
            } ; 
        } ,
        
        // 右表示
        cIsRightShow : function () {
            if ( this.cIsInvalidSize ) return false ; 
            const isShow = this.pt === PostCartainEdges.All || 
                            this.pt === PostCartainEdges.Lr ||
                            this.pt === PostCartainEdges.R ; 
            return isShow ; 

        } ,
        cRightPos : function() {
            return {
                x : this.dSvgMargin + this.cSizeW - this.cSideLength ,
                y : this.dSvgMargin ,
                width  : this.cSideLength ,
                height : this.cSizeH ,
            } ; 
        } ,
        cScaledGrommetMargin : function() {
            return NumberUtil.invalid2zr(this.grommetMargin / this.cScale )  ; 
        } , 
        cScaledGrommetRadius : function() {
            return NumberUtil.invalid2zr(this.grommetRadius / this.cScale )  ; 
        } , 
        // ハトメの横方向の位置リスト
        cGrommetsW : function() {
            return this.getGrommetPositions(this.cSizeW , this.grommetPitch.w , true ) ;
        } ,
        cTopGrommets : function() {
            const _this = this ; 
            const list = this.cGrommetsW.map(function(pos) {
                return {
                    x : pos,  
                    y : _this.cScaledGrommetMargin ,
                    radius : _this.cScaledGrommetRadius ,                    
                }
            }) ; 

            return list ; 
        } ,         
        cBottomGrommets : function() {
            const _this = this ; 
            const list = this.cGrommetsW.map(function(pos) {
                return {
                    x : pos,  
                    y : (_this.cSizeH - _this.cScaledGrommetMargin ) ,
                    radius : _this.cScaledGrommetRadius ,                    
                }
            }) ; 

            return list ; 
        } ,        
        // ハトメの縦方向の位置リスト
        cGrommetsH : function() {
            return this.getGrommetPositions(this.cSizeH , this.grommetPitch.h , true ) ;
        } ,        
        cLeftGrommets : function() {
            const _this = this ; 
            const list = this.cGrommetsH.map(function(pos) {
                //console.log("hPos : " + pos) ; 
                return {
                    x : _this.cScaledGrommetMargin ,  
                    y : pos,
                    radius : _this.cScaledGrommetRadius ,                    
                }
            }) ; 

            return list ; 
        } ,                 
        cRightGrommets : function() {
            const _this = this ; 
            const list = this.cGrommetsH.map(function(pos) {
                return {
                    x : _this.cSizeW - _this.cScaledGrommetMargin ,  
                    y : pos,
                    radius : _this.cScaledGrommetRadius ,                    
                }
            }) ; 

            return list ; 
        } ,         



    } ,
    methods : {
        /**
         * sideLen  sizeW / H 
         * pitch    grommetPitch.w / h 
         * isSpIncludee   始点・終点を含める : true 
         */
        getGrommetPositions : function( sideLen , pitch ,isSpInclude  ) {
            const list = [] ; 
            if (! this.isGrommet  ) return list ;             
            if ( NumberUtil.invalid2zr(sideLen ) == 0 ) return list ; 

            // 始点側
            if ( isSpInclude ) list.push(this.cScaledGrommetMargin  ) ; 

            // 間
            const grommetPitch = NumberUtil.invalid2zr(pitch) ; 
            const validLen = NumberUtil.invalid2zr(sideLen) - (this.grommetMargin * 2 ) ; 
            const cnt = NumberUtil.invalid2zr(NumberUtil.trunc(validLen  / grommetPitch )) ; 
            const scaledValidLen = NumberUtil.invalid2zr(sideLen) - (this.cScaledGrommetMargin * 2 ) ; 
            const scaledPitch = scaledValidLen / cnt ; 
            for ( let i = 1 ; i < cnt ; i++ ){
                const pos = this.cScaledGrommetMargin + scaledPitch *  i ; 
                list.push(pos) ;                 
                
            } 
            // 終点側
            if ( isSpInclude ) list.push(sideLen - this.cScaledGrommetMargin  ) ; 

            return list ; 
            

        } ,
    } ,
    created : async function() 
    {
    }
    
} 
</script>