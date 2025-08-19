<template>
    <div>{{cGetSizeList}}
        <div class="row">                                
            <div class="col-12 col-xl-4 d-flex">                
                <div  style="flex-basis:240px;">
                    <div class="form-group">                
                        <label>製品サイズ</label>                
                        <div class="row px-3">
                            <ns-number-input 
                                class="app-input-size mr-3"
                                v-model="product.size_w" />
                            <span class="h3">x</span>
                            <ns-number-input 
                                class="app-input-size ml-3"
                                v-model="product.size_h" />
                        </div>

                    </div>

                </div>
            </div>
        </div>
        <!-- <div class="row">
            <div class="col-12 text-right">
                <button type="button" class="btn btn-success" @click.prevent="simulate"><i class="fas fa-th-large fa-fw" ></i>シミュレート</button>
            </div>
        </div> -->

        <div class="row bg-app-secondaly p-3">
            <div class="col-4">
                <div class="row">
                    <div class="col-12 mb-3">
                        <div class="card bg-dark" >
                   
                           <div class="card-header">
                                <h5>パラメータ</h5>
                            </div>
                            <div class="card-body row">
                                <div class="col-6">
                                    <label>長手</label>
                                    <div>{{cLonghand}}</div>
                                </div>
                                <div class="col-6">
                                    <label>短手</label>
                                    <div>{{cShorthand}}</div>
                                </div>
                                <div class="col-12 mt-3">
                                    <table class="table table-dark">
                                        <thead>
                                            <tr><th></th><th>長手桟ピッチ</th><th>短手桟ピッチ</th></tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(n,index) in consts"
                                                :class="{ 'dark-deep-green-selected':cSelectPitchIdx === index}">
                                                <td>{{n.condition}}</td>
                                                <td>
                                                    <ns-number-input
                                                        v-model="n.longhand"
                                                        />
                                                </td>
                                                <td>
                                                    <ns-number-input
                                                        v-model="n.shorthand"
                                                        />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="col-6 mt-3">
                                    <label>ｼﾞｮｲﾝﾄ必要長手寸法</label>
                                    <ns-number-input
                                        v-model="needToJointSize"
                                        />
                                </div>

                                <div class="col-6 mt-3">
                                    <label>ｼﾞｮｲﾝﾄ必要?</label>
                                    <div>{{cIsNeedJoint}}</div>
                                </div>

                                <div class="col-6 mt-3">
                                    <div class="form-group">
                                        <label>桟向き</label>
                                        <select class="custom-select"  v-model="pierWay">
                                            <option value="0">短手</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 mb-3">
                        <div class="card bg-dark" >
                           <div class="card-header">
                                <h5>枠</h5>
                            </div>                                
                            <div class="card-body row">
                                <div class="col-12 mb-3">
                                    <table class="table table-dark">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>定尺</th>
                                                <th>仕入値</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(n,index) in timbers" 
                                                @click.prevent="selectedTimberIdx = index" 
                                                :class="{ 'dark-deep-green-selected':selectedTimberIdx === index}">
                                                <td>{{n.name}}</td>
                                                <td class="text-right">
                                                    {{n.height.toLocaleString()}}
                                                </td>
                                                <td class="text-right">
                                                    {{n.unit_price.toLocaleString()}}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 mb-3">
                        <div class="card bg-dark" >
                   
                           <div class="card-header">
                                <h5>ｱﾙﾎﾟﾘ板</h5>
                            </div>                                
                            <div class="card-body row">
                                <div class="col-12">
                                    <m-material-select
                                        v-model="materialId"
                                        :selected-item.sync="material"
                                        :m-branch-id="1"
                                        :category-m-kv-id="1350011"
                                        :isDisplayName="true"                   
                                        />
                                </div>
                                <div class="col-12">
                                    <table class="table table-dark">
                                        <thead>
                                            <tr><th>寸法</th><th>仕入値</th><th>円/㎡</th></tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="n in material.m_material_details">
                                                <td>{{n.detail_name}}</td>
                                                <td class="text-right">
                                                    {{n.unit_price.toLocaleString()}}
                                                </td>
                                                <td class="text-right">
                                                    {{cPricePerSqm(n)}}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
            <div class="col-8">
                <div class="row">
                    <div class="col-12">
                        <div class="card bg-dark">
                   
                           <div class="card-header">
                                <h5>シミュレーション結果</h5>
                            </div>                                
                            <div class="card-body row ">

                                <div class="col-12 mb-3"  v-if="isReady">
                                    <label>ｱﾙﾎﾟﾘ板割</label>
                                    <div class="table-responsive">
                                        <table class="table table-dark" v-if="cBoardLayoutRes.IsSuccess">
                                            <thead>
                                                <tr>
                                                    <th style="width:10%;min-width:60px;">W</th>
                                                    <th style="width:10%;min-width:60px;">H</th>
                                                    <th style="width:10%;min-width:70px;">カット</th>
                                                    <th style="width:10%;min-width:70px;">枚数</th>
                                                    <th style="width:10%;min-width:70px;">枚単価</th>
                                                    <th style="width:10%;min-width:90px;">材料金額</th>
                                                    <th style="width:15%;min-width:100px;">規格㎡数</th>
                                                    <th style="width:10%;min-width:60px;">sqm</th>
                                                    <th style="width:15%;min-width:130px;">規格単価/枚</th>
                                                    <th style="width:15%;min-width:200px;">使用寸法</th>
                                                    <th style="width:15%;min-width:100px;">課金㎡</th>
                                                    <th style="width:15%;min-width:100px;">使用%</th>
                                                    
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="n in cBoardLayoutRes.Sheets">
                                                    <td>{{n.w}}</td>
                                                    <td>{{n.h}}</td>
                                                    <td>{{n.NumOfCut}}</td>
                                                    <td>{{n.qty}}</td>
                                                    <td>{{n.MaterialCost.toLocaleString()}}</td>                                
                                                    <td class="text-right align-middle">
                                                        {{n.TotalMaterialCost.toLocaleString()}}
                                                    </td>
                                                    <td class="align-middle">
                                                        {{n.MMaterialDetail.Sqm.toLocaleString()}}
                                                    </td>
                                                    <td>{{n.Sqm}}</td>
                                                    <td class="text-right align-middle">
                                                        {{n.MMaterialDetail.cost_price.toLocaleString() }}
                                                    </td>       
                                                    <td class="text-right align-middle">
                                                        {{n.ValidSize}}
                                                    </td>                            
                                                    <td>
                                                        {{n.ValidSqm}}
                                                    </td>
                                                    <td>
                                                        {{n.UsePer}}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                </div>


                                <div class="col-12">
                                    <label>枠</label>
                                    <table class="table table-dark">
                                        <thead>
                                            <tr>
                                                <th>{{timbers[selectedTimberIdx].name}}</th>
                                                <th>数量</th>
                                                <th>単価</th>
                                                <th>金額</th>                                                
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="n in cFrameLayoutRes">
                                                <td>{{n.type}}</td>
                                                <td class="text-right">{{n.qty.toLocaleString()}}</td>
                                                <td class="text-right">{{n.unit_price.toLocaleString()}}</td>
                                                <td class="text-right">{{n.total_price.toLocaleString()}}</td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td class="text-right">{{(_.sumBy(cFrameLayoutRes,'total_price')).toLocaleString()}}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 mt-3">
                        <div class="card bg-dark">
                   
                           <div class="card-header">
                                <!-- <h5>{{sizeList}}</h5> -->
                                <h5>短手方向中桟ピッチ：{{cSpPitch}}</h5>
                                <h5>長手方向中桟ピッチ：{{cLpPitch}}</h5>
                                <!-- <h5>{{totalTimberLen}}</h5> -->
                            </div>                                
                            <div class="card-body">
                                <frame-layout-svg
                                    v-model='sizeList'
                                    :tProduct='product'
                                    :productQty='product.qty'
                                    :numOfSp='cNumOfSp'
                                    :spPitch='cSpPitch'
                                    :lpPitch='cLpPitch'
                                    :frameThickness='timbers[selectedTimberIdx].width'
                                    />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>    
</template>


<script setup lang='ts'>
import _ from 'lodash';
import { computed, reactive,ref } from "vue";
import ArrayUtil from "../../frameworks/ArrayUtil";
import { MMaterial } from "../masters/class/models/MMaterial";
import { MMaterialDetail } from "../masters/class/models/MMaterialDetail";
import { TProjectProductBoardLayout } from "../tProjects/class/models/TProjectProductBoardLayout";
import { TProjectProductProcess } from "../tProjects/class/models/TProjectProductProcess";
import { BoardLayoutContainerManager } from "../tProjects/class/boardLayouts/BoardLayoutContainerManager";
import { TProjectProduct } from '../tProjects/class/models/TProjectProduct';
import { BoardAutoLayoutResultSheet } from '../../frameworks/BoardLayout/autoLayout/models/BoardAutoLayoutResultSheet';
import NumberUtil from '../../frameworks/NumberUtil';

interface IProduct {
    size_w : number,
    size_h : number
    qty : number
}

//商品
const product = reactive<IProduct>({
    size_w : 1500 ,
    size_h : 3000 ,
    qty : 1 
})

//ピッチ設定
const consts = ref([
    {
        condition : '1000mm角以下',
        longhand : 500,
        shorthand : 600,
    } ,
    {
        condition : '1000mm角以上',
        longhand : 1000,
        shorthand : 1000,
    } ,
])
//適用されるピッチのidx
const cSelectPitchIdx = computed(() => {
    if(product.size_w < 1000 && product.size_w < 1000) return 0 ;
    return 1 ;
})

//ｼﾞｮｲﾝﾄが必要になる寸法
const needToJointSize = ref(3600);

//ｼﾞｮｲﾝﾄ必要フラグ
const cIsNeedJoint = computed(() => cLonghand.value > needToJointSize.value)

//桟方向（短手のみ）
const pierWay = ref("0")

//商品長手方向
const cLonghand  = computed(() => Math.max(product.size_w , product.size_h))
//商品短手方向
const cShorthand = computed(() => Math.min(product.size_w , product.size_h))

//木枠材料
const timbers = ref([
    {
        name : '木材 35mm角',
        width : 35,
        height : 4000,
        unit_price : 900,
    } ,
    {
        name : '木材 50mm角',
        width : 50,
        height : 4000,
        unit_price : 1000,
    } ,
]) ;

//選択中の木枠idx
const selectedTimberIdx = ref(0) ;
//選択中の木枠
const cSelectetTim = computed(() => timbers.value[selectedTimberIdx.value])

//ｱﾙﾎﾟﾘ板id
const materialId = ref(14025) ;
//ｱﾙﾎﾟﾘ板
const material = ref({}) ;

//ｱﾙﾎﾟﾘ板円/㎡(表示用)
const cPricePerSqm = computed(() => (row:MMaterialDetail) => {
    if( row.width == 0 || row.height == 0 ) return 0 ;
    const p = row.unit_price / row.contents_qty ;
    const sqm = (row.width * row.height) / 1000000 ;
    const res = p / sqm ;
    
    return res.toLocaleString() ;
})

//ボードレイアウト
const result = ref() ;
//ボートレイアウト結果
const cManagerRefAuto  = computed(() =>  {
    return result.value?.RefMasterAutoContainer ?? []  ; 
})

//自動ボートレイアウトベスト結果
const cBoardLayoutRes = computed(() => cManagerRefAuto.value?.BestResult);
//自動ボートレイアウト計算完了フラグ
const isReady = ref(false) ;


//木枠材料結果
const frameLayoutRes = ref({}) ;
//木枠材料結果等（描画用）
const cFrameLayoutRes = computed(() => {
    if(_.isEmpty(frameLayoutRes)) return [];

    return[
        {
            type : '材料',
            //@ts-ignore
            qty : frameLayoutRes.value.q,
            unit_price : cSelectetTim.value.unit_price.toLocaleString(),
            //@ts-ignore
            total_price : cSelectetTim.value.unit_price * frameLayoutRes.value.q,
        },
        {
            type : 'カット',
            //@ts-ignore
            qty : frameLayoutRes.value.c,
            unit_price : 50,
            //@ts-ignore
            total_price : frameLayoutRes.value.c * 50,
        },
        {
            type : '組立工賃',
            //@ts-ignore
            qty : ( Object.keys(sizeList.value).length - 2 ) * 2,
            unit_price : 184,
            //@ts-ignore
            total_price : ( Object.keys(sizeList.value).length - 2 ) * 2 * 184,
        },
        {
            type : '組立材料',
            //@ts-ignore
            qty : ( Object.keys(sizeList.value).length - 2 ) * 2 ,
            unit_price : 2.7,
            //@ts-ignore
            total_price : ( Object.keys(sizeList.value).length - 2 ) * 2 * 2.7,
        }
    ]

});


//短手方向中桟本数
const cNumOfSp = computed(() => {
    const spQty = cLonghand.value / consts.value[cSelectPitchIdx.value].longhand ;
    const res = Number.isInteger(spQty) ? spQty - 1  : NumberUtil.trunc( spQty ) ;
    return res == 0 ? 1 : res
})
//短手方向中桟ピッチ
const cSpPitch = computed(() => {
    const considerd = cLonghand.value - ( cSelectetTim.value.width * (2 + cNumOfSp.value) ) ;
    return considerd / (cNumOfSp.value + 1 ) ;
})
//長手方向中桟本数
const cNumOfLp = computed(() => {
    const lpQty = cShorthand.value / consts.value[cSelectPitchIdx.value].shorthand ;
    return Number.isInteger(lpQty) ?( lpQty - 1 ) * (cNumOfSp.value + 1) : NumberUtil.trunc( lpQty ) * (cNumOfSp.value + 1) ;
})
//長手方向中桟ピッチ
const cLpPitch = computed(() => {
    if( cNumOfLp.value == 0) return 0 ;
    const row =  cNumOfLp.value / (cNumOfSp.value + 1)
    const considerd = cShorthand.value - ( cSelectetTim.value.width * (2 + row) ) ;
    // const lpQty = cShorthand.value / consts.value[cSelectPitchIdx.value].shorthand ;
    // const num = Number.isInteger(lpQty) ? lpQty  : NumberUtil.trunc( lpQty ) + 1 ;
    return considerd / (row + 1 ) ;
})


//枠原価計算用項目計算
function calcFrames (obj:any ,s:number,c:number,q:number) {
    const t = cSelectetTim.value ;

    if(_.isEmpty(obj)) {
        frameLayoutRes.value = {
            s : s, //余り枠長さ
            c : c, //カット回数
            q : q //枠使用本数
        }

        return ;
    } 
    for( const key in obj ) {
        if( obj.hasOwnProperty(key) ) {
            
            if(obj[key]/s < 1) {
                s = s - obj[key] ;
                c += 1 ;
                delete obj[key] ;
                calcFrames(obj,s,c,q) ;
            } 
            else if (obj[key]/s === 1) {
                s = t.height ;
                q += 1 ;
                delete obj[key] ;
                calcFrames(obj,s,c,q) ;
            } 

        }

    }

    if(!_.isEmpty(obj)) {
        s = t.height ;
        q += 1 ;
        calcFrames(obj,s,c,q) ;
    }

}


//シミュレート
function simulate () {
    
    const _manager = new BoardLayoutContainerManager(); 
    _manager.BoardLayouts = []; 
    //@ts-ignore
    const boards = findBoards2Fit(product ,material.value) ;
    const process = TProjectProductProcess.parse({m_material01:boards},TProjectProduct.parse(product)) ;
    _manager.TProjectProductProcess = process  ; 
    // console.log(boards)
    /**
     * 枠板が1枚で済むケース
     */
    if(!_.isEmpty(boards.m_material_details)) {

        if (! _.isNil(_manager ) ){

            _manager.MBranchId = 1 ; 
            if ( JSON.stringify(_manager.MMaterial) !==  JSON.stringify(process.m_material01) ){
                _manager.MMaterial = process.m_material01 ; 

            }
            isReady.value = true ;
            _manager.SelectedBoardLayoutType = 3 ; 
            _manager.IsCustomerProvide = false ; 
            // console.log(_manager);
        }

        result.value = _manager ;


    }

    getSizeList() ;


}


//1枚で入る板材を取得する
function findBoards2Fit(product:IProduct,boards:MMaterial) {
    const copied = _.cloneDeep(boards)
    const res = [] ;

    for(const b of boards.m_material_details) {
        //寸法手入力用の 0*0 無視
        if( b.width == 0 || b.height == 0 ) continue ;
        //材料長手短手
        const bLonghand  = b.width > b.height ? b.width : b.height ;
        const bShorthand = b.width < b.height ? b.width : b.height ;
        // console.log(bLonghand,bShorthand)
        if( cLonghand.value <= bShorthand ) {
            res.push(b) ;
        }
        else if( cShorthand.value <= bShorthand && cLonghand.value <= bLonghand ) {
            res.push(b) ;
        } 
         
    }
    ArrayUtil.resetInsert(copied.m_material_details , res) ; 

    return copied ;
}


//枠サイズ表
const sizeList = ref({})
//総使用木枠材料mm数
const totalTimberLen = computed(() => {
    let len = 0 ;
    for(const key in sizeList.value) {
        if( sizeList.value.hasOwnProperty(key) ) {
            //@ts-ignore
            len += sizeList.value[key] ;
        }
    }
    return len ;
})

//枠サイズ表取得
function getSizeList() {
    const t = cSelectetTim.value ;

    let c = 0 ;
    let s = t.height ;
    let q = 1 ;
    let obj = {}

    if(pierWay.value == '0') {

        obj = { 
            w1:cLonghand.value ,
            w2:cLonghand.value ,
            h1:cShorthand.value-(t.width * 2) ,
            h2:cShorthand.value-(t.width * 2)
        }
        if(cNumOfSp.value >= 1) {
            for (let i = 1; i <= cNumOfSp.value; i++) {
                //@ts-ignore
                obj[`sp${i}`] = cShorthand.value - (t.width*2) ;
            }
        }

        if(cNumOfLp.value >= 1) {
            for (let i = 1; i <= cNumOfLp.value; i++) {
                //@ts-ignore
                obj[`lp${i}`] = ( cLonghand.value - (t.width * (2 + cNumOfSp.value ))) / ( cNumOfSp.value + 1 )  ;
            }
        } 

        sizeList.value = _.cloneDeep(obj) ;

    }


    calcFrames(obj ,s,c,q) ;
}


const cGetSizeList = computed(() => {
    const t = cSelectetTim.value ;

    let c = 0 ;
    let s = t.height ;
    let q = 1 ;
    let obj = {}

    let isLonderW = product.size_w >= product.size_h ;
    if(pierWay.value == '0') {
        
        obj = { 
            w1: isLonderW ? product.size_w : product.size_w - (t.width * 2),
            w2: isLonderW ? product.size_w : product.size_w - (t.width * 2),
            h1: isLonderW ? product.size_h - (t.width * 2) : product.size_h ,
            h2: isLonderW ? product.size_h - (t.width * 2) : product.size_h ,
        }
        if(cNumOfSp.value >= 1) {
            for (let i = 1; i <= cNumOfSp.value; i++) {
                //@ts-ignore
                obj[`sp${i}`] = cShorthand.value - (t.width*2) ;
            }
        }

        if(cNumOfLp.value >= 1) {
            for (let i = 1; i <= cNumOfLp.value; i++) {
                //@ts-ignore
                obj[`lp${i}`] = ( cLonghand.value - (t.width * (2 + cNumOfSp.value ) ) ) / ( cNumOfSp.value + 1 )  ;
            }
        } 

        sizeList.value = _.cloneDeep(obj) ;

    }


    calcFrames(obj ,s,c,q) ;

    return ""
})

</script>