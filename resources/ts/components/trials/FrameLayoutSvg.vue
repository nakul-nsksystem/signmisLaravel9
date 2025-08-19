<template>
    <div>
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
                <g v-for='n in cFrameSvgs'
                    :key='n.key'>
                    <rect 
                        :x="n.xPos" :y="n.yPos" 
                        :width="n.dispW" :height="n.dispH" 
                        :fill="n.fill" 
                        stroke="white"  stroke-width="1"
                        />
                </g>
            </g>

        </svg>

        <div class="row">
            <div class="col-12 mt-3">
                <label>内訳</label>
                <table class="table table-dark">
                    <thead>
                        <tr>
                            <th></th>
                            <th>key</th>
                            <th>長さ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="n in cFrameSvgs">
                            <td><div class="colorbox" :style="`background:${n.fill}`"></div></td>
                            <td>
                                {{n.key}}                                
                            </td>
                            <td>{{n.val}}</td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </div>
        
    </div>    
</template>


<script setup lang='ts'>
import _ from 'lodash';
import { computed, reactive,ref } from "vue";
import NumberUtil from '../../frameworks/NumberUtil';
import { TProjectProduct } from '../tProjects/class/models/TProjectProduct';

const dMargin4SizeText = 117 ;
const dHeightMargin4SizeText = 50 ;
const dDimFontSize = 40 ;
const dSvgMargin = 2 ;
const dBaseLength = 1000 ;

interface IProps {
    value:object ,
    tProduct:TProjectProduct,
    numOfSp:number,
    spPitch:number,
    lpPitch:number,
    frameThickness:number
}

const props = withDefaults(defineProps<IProps>(), {
})
/**
 * テキスト位置、初期マージンを考慮したマージン
 */
const cMargin = computed(() => dMargin4SizeText / cScale.value + dSvgMargin ) 
const cMargin4H = computed(() => dHeightMargin4SizeText / cScale.value + dSvgMargin ) 

/** SVG枠のW */
const cFrameW = computed(() => cDisplayW.value + cMargin.value + dSvgMargin ) 

/** SVG枠のH */
const cFrameH = computed(() => cDisplayH.value + cMargin4H.value + dSvgMargin ) 

/** 寸法　幅位置 */           
const cDimWPos = computed(() => cMargin.value + cDisplayW.value / 2 ) 

/** 寸法　高さ位置 */           
const cDimHPos = computed(() => cMargin4H.value + cDisplayH.value / 2 ) 

/** 寸法　フォントサイズ */
const cDimFontSize = computed(() => dDimFontSize + cScale.value / 2 ) 

/** 表示幅 */
const cDisplayW = computed(() => {
    if ( props.value === undefined || ! props.value ) return 0 ; 
    if ( props.tProduct.size_w === undefined) return 0 ;
    return props.tProduct.size_w ; 
} ) 

/** 表示高さ */
const cDisplayH = computed(() => {
    if ( props.value === undefined || ! props.value ) return 0 ; 
    if ( props.tProduct.size_h === undefined) return 0 ;
    return props.tProduct.size_h ; 
} ) 

/**
 * 端位置X
 *  */ 
const cEndX = computed(() => cDisplayW.value + cMargin.value ) 

/**
 * 端位置Y
 *  */ 
const cEndY = computed(() => cDisplayH.value + cMargin4H.value ) 

const cScale = computed(() => {
    const w = cDisplayW.value + dMargin4SizeText ;
    const h = cDisplayH.value + dHeightMargin4SizeText ;
    const isLongerW = w > h; 
    const longer = isLongerW ? w : h ;  
    let baseLen = dBaseLength + dSvgMargin * 2  ; 
    
    const scale = NumberUtil.invalid2zr(baseLen / longer)   ; 
    //max1倍にする 
    return scale > 1 ? 1 : scale; 
} ) 

const cViewBox = computed(() => {
    const lengthIncMargins = dBaseLength + dMargin4SizeText + dSvgMargin * 2 ;
    const hPer = NumberUtil.invalid2zr( cFrameH.value / cFrameW.value)  ; 
    let hIncMargins = 0  ; 
    if ( hPer == 0 ) {
        hIncMargins = lengthIncMargins ;
    }
    else {
        hIncMargins = cIsLongerW.value ? hPer * lengthIncMargins : lengthIncMargins ; 
    }
    return `0 0 ${lengthIncMargins} ${hIncMargins}` ;
} ) 


//枠色
const outsideColor = '#BB6E40'
const insideHColor = '#F5BE68'
const insideWColor = '#E3D78C'  

const cIsLongerW = computed(() => props.tProduct.size_w >= props.tProduct.size_h) ;
//svg生成用パラメータ
const cFrameSvgs = computed(() => {
    
    if(_.isEmpty(props.value)) return [];
    const res = [] ;
    
    for( const key in props.value ) {
        if( props.value.hasOwnProperty(key) ) {
            let xOffset = 0 ;   
            let yOffset = 0 ;
            let fill = '' ;
            let isVertical = false ;
            //@ts-ignore
            const val = props.value[key] 

            if(key.startsWith('w')) {
                if( !cIsLongerW.value ) xOffset = props.frameThickness ;
                if( key == 'w2' ) yOffset = cDisplayH.value - props.frameThickness ;
                fill = outsideColor ;
            }
            else if (key.startsWith('h')) {
                isVertical = true ;
                if( cIsLongerW.value ) yOffset = props.frameThickness ;
                if( key == 'h2') xOffset = cDisplayW.value - props.frameThickness ;
                fill = outsideColor ;
            }
            else if (key.startsWith('sp')) {
                const idx = parseInt(key.slice(2),10);
                if( cIsLongerW.value ) isVertical = true ; 
                xOffset = cIsLongerW.value ? ( props.spPitch + props.frameThickness ) * idx : props.frameThickness ;
                yOffset = cIsLongerW.value ? props.frameThickness : ( props.spPitch + props.frameThickness ) * idx ;
                fill = insideHColor ;
            }
            else if (key.startsWith('lp')) {
                const idx = parseInt(key.slice(2),10);
                if( !cIsLongerW.value ) isVertical = true ;
                const xCoef = ( props.numOfSp + 1 ) * NumberUtil.trunc(idx / ( props.numOfSp + 1 ))
                const yCoef = NumberUtil.ceil(idx / ( props.numOfSp + 1 )) ;
                xOffset = cIsLongerW.value ? props.frameThickness + ( props.spPitch + props.frameThickness ) * ( idx - xCoef ) 
                          :( props.lpPitch + props.frameThickness ) * yCoef ;

                yOffset = cIsLongerW.value ? ( props.lpPitch + props.frameThickness ) * yCoef 
                          :props.frameThickness + ( props.spPitch + props.frameThickness ) * ( idx - xCoef ) ;

                fill = insideWColor ;
            }

            res.push({
                key   : key ,
                xPos  : cMargin.value + xOffset ,
                yPos  : cMargin4H.value + yOffset ,
                dispW : isVertical ? props.frameThickness : val ,
                dispH : isVertical ? val : props.frameThickness   ,
                fill  : fill ,
                val   : val
            })
        }   
    }

    return res ;

})


</script>

<style scoped>
.colorbox{
    width: 50px;
    height: 20px;
}
</style>