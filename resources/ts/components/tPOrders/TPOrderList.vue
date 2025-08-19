<template>
  <div>
    <div class="app-contents-container">
        <div class="row" v-if="cNullOrEmpty">            
            <div class="col-12 pl-1 pr-0  pt-1 pt-xl-0">
                <nav v-if="cNewList">
                    <ul class="nav nav-tabs navbar-dark border-bottom-0" id="purchase-nav-category">
                        <li class="nav-item" v-for="(n ,index) in purchaseOrder" :key="n.id">
                            <a class="nav-link" :class="[index===dSelectedIndex ? 'active' : 'false']" id="contact-tab" data-toggle="tab" role="tab" aria-selected="true" @click="selectPurchase(index)">
                                {{n.supplier_m_customer.name}}
                            </a>
                        </li>
                    </ul>
                </nav>
                <div v-if="$$cIsError" class="alert alert-danger" role="alert">
                    {{dErrorData.message}}
                </div>
                <div v-show="dMassage" class="alert alert-success" role="alert">
                    {{dMassage}}
                </div>
                <div class="tab-content bg-app-secondaly" id="nav-tabContent">
                    <div class="tab-pane pl-0 mr-0 py-0 fade show active" role="tabpanel" aria-labelledby="nav-home-tab">
                        <div class="col-12 pt-2">                            
                            <div class="row mt-4">
                                <div class="col-12 col-xl-6">
                                    <p>発注先：{{cSelectedList.supplier_m_customer.name}}</p>
                                    <p>発注拠点：{{cSelectedList.m_branch.short_name}}</p>
                                    <p>発注担当：{{cSelectedList.m_user.full_name}}</p>                                    
                                    <p>発注日：{{m$cDateFormat(cSelectedList.order_date)}}</p>
                                </div>
                                <div class="col-12 col-xl-6 pl-xl-0">
                                    <p>物件コード：{{cCommonTProjectCd}}</p>
                                    <p>物件名：{{cCommonTProjectName}}</p>
                                </div>
                                <div class="col-12">
                                    <div class="table-responsive">
                                        <table class="table table-bordered text-white text-nowrap">
                                            <thead class="thead-light">
                                                <tr>
                                                <th scope="col">名称</th>
                                                <th class="text-right" scope="col">数量</th>
                                                <!-- <th scope="col">単価</th> -->
                                                <!-- <th scope="col">金額</th> -->
                                                <th scope="col">金額表示</th>
                                                <th scope="col">納期</th>
                                                <th scope="col">明細備考</th>                                        
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(n,index) in cSelectedList.t_p_order_details" :key="n.id">
                                                    <td>{{n.po_material_name}}</td>
                                                    <td><p class="text-right">{{n.qty}}{{n.unit_m_kv.kv_name}}</p></td>
                                                    <!-- <td><p class="text-right">{{m$cPriceFormat(n.price)}}</p></td> -->
                                                    <!-- <td><p class="text-right">{{m$cPriceFormat(n.total_price)}}</p></td> -->
                                                    <td><ns-checkbox-input :id="`isDisPriceCheck${index}`" v-model="n.is_display_price"/></td>
                                                    <td>{{m$cDateFormat(n.due_date)}}</td>
                                                    <td>
                                                        <p v-if="cIsDisplayShippingAddress(n.shipping_address)">納品場所:{{n.shipping_address}}</p>                                                
                                                        <p style="white-space: pre-wrap;">{{n.slip_memo}}</p>
                                                    </td>                                    
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table class="table table-bordered text-white mt-4" v-if="!isTIvt && !isTProject">
                                            <tbody>
                                                <tr>
                                                    <th style="width:25%">税抜金額</th>
                                                    <td style="width:25%" class="text-right">{{m$cPriceFormat(cTotalPrice)}}</td>
                                                    <th style="width:25%">
                                                        税込金額 <span v-if="cIsSettingUncalcKvId(cSelectedList.supplier_m_customer.tax_fraction_m_kv_id)" class="text-warning">区分未設定</span> 
                                                        <span v-else>
                                                            (区分:{{cGetMKvName(cSelectedList.supplier_m_customer.account_m_kv_id)}}
                                                             端数:{{cGetMKvName(cSelectedList.supplier_m_customer.tax_fraction_m_kv_id)}})
                                                        </span> 
                                                    </th>
                                                    <td style="width:25%" class="text-right">{{m$cPriceFormat(cTotalPriceWithTax)}}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="col-12 mb-2" v-if="cNewList">
                                    <label>発注備考</label>
                                    <textarea class="form-control" v-model="purchaseOrder[dSelectedIndex].slip_memo"></textarea> 
                                </div>
                                <div class="col-12" v-else>
                                    <label>発注備考</label>
                                    <p>{{cSelectedList.slip_memo}}</p>
                                </div>
                            </div>
                        </div>
                    </div>     
                </div>                
                <div class="col text-right mt-2" v-if="cNewList&&!dMassage">
                    <button type="button" class="btn btn-success" :disabled="dLoading" @click.prevent="postData"> 
                        <div v-if="dLoading">
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            発注処理中...
                        </div>
                        <div v-else>発注</div>                                    
                    </button>
                </div>
            </div>            
        </div>
    </div>
    
    
  
  
  
  </div>                 
</template>
<script>
import PageMixins from '../../mixins/commons/PageMixins';
import TPOrderMixins from "./mixins/TPOrderMixins"
import ObjectUtil from "../../frameworks/ObjectUtil"
import NumberUtil from '../../frameworks/NumberUtil';
import DayJsEx from "./../../frameworks/DayJsEx" ;
import _ from 'lodash'; 
import MKvsConst from '../../consts/MKvsConst';
import TPOrderConst from './consts/TPOrderConst'

export default {
    mixins : [PageMixins,TPOrderMixins] , 
    props:{
        purchaseOrder:{
            type:Array,
        } ,
        isTProject:{
            type:Boolean,
            default:() => false ,
        } ,
        isTIvt:{
            type:Boolean,
            default:() => false ,
        } ,

        isShow:{
            type:Boolean,
        }
    },
    data: function(){
        return{
            dSelectedIndex : 0 ,
            apiName : "tPOrder" ,
            dRow : {
                supplier_m_customer:{},
                m_branch:{},
                m_user:{},
                t_p_order_details:[],
            } ,
            dLoading : false ,

            dMassage : false ,

            //施工発注フラグ
            dIsConstruction : false ,
        }
    },
    computed: {
        cNullOrEmpty : function(){
            return !this.purchaseOrder || this.purchaseOrder.length > 0
        } ,
        cNewList : function () { 
            return this.$route.params.id === undefined || this.isTProject
        } ,

        cSelectedList : function() {
            if ( this.dSelectedIndex === undefined) return [] ; 
            
            if (this.cNewList) {

                const selectedItem = this.purchaseOrder[this.dSelectedIndex] ;

                if(!selectedItem) {      
                    this.dSelectedIndex = 0 ;       
                    return this.purchaseOrder[0] ;
                } 
                return selectedItem ;

            } else {

                return this.dRow ;
            }
        },
        cEndpoint : function () {
            let ep =  `api/${this.apiName}` ;
            if ( !this.cNewList ) ep += `/${this.$route.params.id}` ;
            return  ep ;
        } ,

        //金額（発注書単位）
        cTotalPrice : function (){
            return this.cSelectedList.t_p_order_details.reduce((p,x) => p + x.price * x.qty , 0) ;
            // const fractionMKvId = this.cSelectedList.supplier_m_customer.price_fraction_m_kv_id ;
            // const price = this.cSelectedList.t_p_order_details.reduce((p,x) => p + x.price * x.qty , 0) ;
            // return this.calcWithFraction(price ,fractionMKvId)  ;
        },
        //税込金額（発注書単位）
        cTotalPriceWithTax : function() {
            //消費税端数kvId
            const taxFractionMKvId = this.cSelectedList.supplier_m_customer.tax_fraction_m_kv_id ;
            const AccountMKvId  = this.cSelectedList.supplier_m_customer.account_m_kv_id ;
            const _this = this ;

            let tax = 0 ;
            //伝票単位
            if(AccountMKvId == MKvsConst.MCustomers.ACCOUNT_M_KV_ID_SLIP || AccountMKvId == MKvsConst.MCustomers.ACCOUNT_M_KV_ID_BILLING) {
                tax = this.calcWithFraction(this.cTotalPrice , taxFractionMKvId ,true)
            }
            //個別
            else if(AccountMKvId == MKvsConst.MCustomers.ACCOUNT_M_KV_ID_DETAILS) {
                tax = this.cSelectedList.t_p_order_details.reduce((p,x) => p + _this.calcWithFraction(x.price, taxFractionMKvId ,true) , 0) 
            }
            
            return this.cTotalPrice + tax
        } ,
        
        //金額・税端数区分に見計算が設定されているかの判定
        cIsSettingUncalcKvId : function() {
            return function(mKvId) {
                return mKvId == MKvsConst.MCustomers.FRACTION_M_KV_ID_UNCALCATED  || _.isNil(mKvId);
            }
        },

        cGetMKvName : function() {
            return function(mKvId) {
                return this.masterStore.getMKvById(mKvId)?.kv_name ;
            }
        } ,

        /**発注明細に共通する物件の情報 */
        cCommonTProjectCd : function(){
            if(_.isEmpty(this.cSelectedList)) return "" ;
            const examPODetail = this.cSelectedList.t_p_order_details[0] ;
            if( _.isNil(examPODetail) || _.isNil(examPODetail.t_project_id) ) return "" ;
            return examPODetail.t_project.cd ;
        } ,
        cCommonTProjectName : function(){
            if(_.isEmpty(this.cSelectedList)) return "" ;
            const examPODetail = this.cSelectedList.t_p_order_details[0] ;
            if( _.isNil(examPODetail) || _.isNil(examPODetail.t_project_id) ) return "" ;
            return examPODetail.t_project.po_project_name ?? examPODetail.t_project.name ;
        } ,

        cIsDisplayShippingAddress : function() {
            return function(val) {
                return !_.isNil(val) && val == this.cSelectedList.m_branch.short_name ;
            }
        }
    },
    methods:{
        selectPurchase : function(index) {
            this.dSelectedIndex = index ; 
        } ,
        postData : async function () {
            try{
                //ロードエフェクト
                this.dLoading = true ;
                const _this = this ;
                //発注単位備考と日付の形式変更
                const maped = this.purchaseOrder.map(function(x) {
                    _this.m$checkData(x) ;
                    x.t_p_order_details.map(function(y){

                        if(y.due_date != null) y.due_date = DayJsEx.format(y.due_date , "YYYY-MM-DD") ;
                    }) ;
                    return x                
                }) ;

                //画面ロック
                this.m$screenLock() ;
                
                const res = await axios.post(this.cEndpoint ,maped ) ;
                let resList = res.data
                                
                //画面ロック解除
                this.m$screenUnLock() ;  

                //メール送信時のアドレス不適エラーを出す
                for(const tPOrder of resList) {
                    this.m$showWarnings(tPOrder) ;
                }
                
                if(this.isTProject) {

                    this.dMassage = "発注メールを送信しました"
                    //施工の時
                    if(this.dIsConstruction) {
                        this.$emit('setConstructionOrderedRow',resList) ;
                    } 
                    else {
                        this.$emit('setOrderedRow',resList) ;
                    }
                    // this.$router.push({name:'t_p_order_index'});   
                }
                else if (this.isTIvt) {
                    this.dMassage = "発注メールを送信しました"

                } 
                else {
                    this.$emit('finishedOrder') ;
                }


            } catch (error)  {
                // console.log(error) ;
                this.$$errorConsole(error ,this.cEndpoint ) ;                
                this.m$screenUnLock() ;

            } finally {
                
                this.dLoading = false ;
                this.dIsConstruction = false ;

            }

        } ,

        getData : async function () {
            try {
                const res = await axios.get(this.cEndpoint) ;
                this.dRow = res.data ;

            } catch (error) {
                // handle error
                this.$$errorConsole(error ,this.cEndpoint ) ;
            }
        } ,

        calcWithFraction : function(price,mKvId ,isTax = false ) {

            const mTax = this.masterStore.getMTax(this.cSelectedList.order_date)
            const taxRate = isTax ? mTax.tax_rate : 1  ;
            
            let val = 0 ;

            //未計算
            if (mKvId == MKvsConst.MCustomers.FRACTION_M_KV_ID_UNCALCATED) {
                val = 0 
            }
            //切り捨て
            else if (mKvId == MKvsConst.MCustomers.FRACTION_M_KV_ID_ROUND_DOWN) {
                val = NumberUtil.trunc(price * taxRate)
            }
            //四捨五入
            else if (mKvId == MKvsConst.MCustomers.FRACTION_M_KV_ID_ROUND_OFF) {
                val = NumberUtil.round(price * taxRate)
            }
            //切上げ
            else if (mKvId == MKvsConst.MCustomers.FRACTION_M_KV_ID_ROUND_UP) {
                val = NumberUtil.ceil(price * taxRate)
            } 

            return val ;
        } ,

        clearMassages : function() {
            this.dMassage = false ;
            this.dErrorStatus = undefined ;
        } ,


    } ,
    created : function(){
        if( ! this.cNewList ) this.getData() ;
    },


}
</script>