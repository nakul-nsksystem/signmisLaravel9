<template>
    <g>
        <!-- 寸法 -->
        <g :stroke="stroke" :stroke-width="strokeWidth">
            <line 
                :x1="x1 + dSvgMargin" :y1="y1 + dSvgMargin" :x2="x2 + dSvgMargin" :y2="y2 + dSvgMargin"
                    />
            <line v-if="cLength > 0"
                :x1="x2 + dSvgMargin" :y1="y2 + dSvgMargin" :x2="cArrowL.x + dSvgMargin" :y2="cArrowL.y + dSvgMargin"
                    />
            <line v-if="cLength > 0"
                :x1="x2 + dSvgMargin" :y1="y2 + dSvgMargin" :x2="cArrowR.x + dSvgMargin" :y2="cArrowR.y + dSvgMargin"
                    />
            
        </g>

    </g>
</template>

<script lang="ts">
import NumberUtil from '../../../frameworks/NumberUtil'
import CadUtil from '../../../frameworks/CadUtil';
import {TypePoint} from '../../../types/TypePoint';


// import { defineComponent ,ref,computed, onMounted, reactive } from '@vue/composition-api'
import Vue, { ref,computed,defineComponent } from 'vue';


export default defineComponent({ 
    data :  function() {
        return {
            /** SVG描画のマージン */
            dSvgMargin : 2 ,             

        } 
    } , 
    props : {
        /**
         * X始点
         */
        x1 : {
            type : Number , 
            default : () => 0 , 
        } , 
        /**
         * X終点
         */
        x2 : {
            type : Number , 
            default : () => 0 , 
        } ,         
        /** 
         * Y始点
         */ 
        y1 : {
            type : Number , 
            default : () => 0 , 
        } , 
        /**
         * Y終点
         */
        y2 : {
            type : Number , 
            default : () => 0 , 
        } , 
        /**
         * 矢印の長さ
         */
        arrowLength : {
            type : Number , 
            default : () => 10 , 
        } , 
        /**
         * 矢印の角度
         */
        arrowAngle : {
            type : Number , 
            default : () => 30 , 
        } , 
        /**
         * 矢印の色
         */
        stroke : { 
            type : String , 
            default : () => "gray" , 
        } , 
        /**
         * 矢印の太さ
         */
        strokeWidth : {             
            type : Number , 
            default : () => 1 , 
        } , 

    } ,
    methods : {
    } ,
    computed : {        
        cW : function():number {
            return NumberUtil.invalid2zr(this.x2) - NumberUtil.invalid2zr(this.x1) ; 
        } , 
        cH : function():number {
            return NumberUtil.invalid2zr(this.y2) - NumberUtil.invalid2zr(this.y1) ; 
        } , 
        cBlankWidth : function():number{
            return Math.abs(this.cW) ; 
        } , 
        cBlankHeight : function():number{
            return Math.abs(this.cH) ; 
        } , 
        cMinX : function():number { 
            return Math.min(this.x1 , this.x2) ; 
        } , 
        cMinY : function():number { 
            return Math.min(this.y1 , this.y2) ; 
        } , 
        cMaxX : function():number { 
            return Math.max(this.x1 , this.x2) ; 
        } , 
        cMaxY : function():number { 
            return Math.max(this.y1 , this.y2) ; 
        } , 
        cLength : function():number { 
            return CadUtil.getObliqueLength(this.cBlankWidth , this.cBlankHeight) ; 
        } , 
        cAngle : function():number { 
            return CadUtil.getAngle(this.x1 ,this.y1 ,this.x2 ,this.y2 ) ; 
        } , 
        cArrowL : function():TypePoint { 
            const agl = this.cAngle + 180 + this.arrowAngle ; 
            const rtn:TypePoint = CadUtil.getObliquePoint(this.arrowLength , agl ,{x:this.x2 , y:this.y2}) ; 
            return rtn ; 
        } ,
        cArrowR : function():TypePoint { 
            const agl = this.cAngle + 180 - this.arrowAngle ; 
            const rtn:TypePoint = CadUtil.getObliquePoint(this.arrowLength , agl ,{x:this.x2 , y:this.y2}) ; 
            return rtn ; 
        } ,
        /** ViewBox */
        cViewBox : function():string {
            
            //return `0 0 ${this.cWIncMargin} ${this.cHIncMargin}` ;
            return `0 0 ${this.cMaxX + this.dSvgMargin * 2 } ${this.cMaxY + this.dSvgMargin * 2}` ;
        } ,


    } ,
    created : function() { 
    } ,
});

</script>