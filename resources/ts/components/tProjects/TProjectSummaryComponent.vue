<template>
    <div class="p-3 bg-app-secondaly">
        <div class="row">
            <div class="col-12 pb-2 ">
                <div class="border-bottom">
                    <p class="h5">金額</p>
                </div>
            </div>
        </div>
                  
        <div class="table-responsive  text-right">
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th class="" scope="col" style="min-width:70px;">
                            寸法<br>非表示<br>
                            <ns-checkbox-input
                                v-model="dIsNotDisplaySize"
                                :id="'displaySizeCheckBox'"
                                @change="checkedAll"
                                />

                        </th>
                        <th class="col-12 text-left" scope="col" style="min-width:150px;">商品名</th>
                        <th class="" scope="col" style="min-width:50px;">&nbsp;</th>
                        <th class="" scope="col" style="min-width:100px;">総重量(kg)</th>
                        <th class="" scope="col" style="min-width:100px;">想定時間(h)</th>                        
                        <!-- <th class="" scope="col" style="min-width:70px;">数量</th> -->
                        <th class="" scope="col" style="min-width:120px;">数量</th>
                        <th class="" scope="col" style="min-width:120px;" >
                            参考売価
                            <ns-number-input v-model="dPredictProfitPer"
                                class="app-input-price"  />%利益
                        </th>
                        <th class="" scope="col" style="min-width:140px;">
                            売価@
                            <br />
                            総売価
                        </th>
                        <th class="" scope="col" style="min-width:110px;">
                            原価@
                            <br />
                            総原価
                        </th>
                        <!-- <th class="" scope="col" style="min-width:110px;"></th> -->
                        <th class="" scope="col" style="min-width:110px;">利益</th>
                        <th class="" scope="col" style="min-width:110px;">限界利益</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(n,index) in cProductList"
                        @click.prevent="selectProduct(n)" 
                        :class="{ 'dark-selected':dSelectedProduct === n}">
                        <td class="align-middle">
                            <div class="custom-control custom-checkbox ml-2" @click.stop="">
                                <input 
                                    :id="`displaySizeCheckBox${index}`"
                                    type="checkbox"  
                                    class="custom-control-input"
                                    v-model="n.is_not_display_size_in_estimate"
                                    @change.prevent="checked"
                                    >
                                <label class="custom-control-label" style=" white-space: pre" :for="`displaySizeCheckBox${index}`"></label>
                            </div>
                        </td>
                        <td class="align-middle text-left">
                            <p class="font-weight-bold mb-1 d-flex">
                                {{n.name}} [ {{n.display_01}} ] - {{n.display_02}}     
                            </p>
                            <p class="mb-1">
                                <span :class="getWarrantyBadgeClasses(n)" class="mb-auto">
                                    {{getWarrantyMkvName(n)}}
                                </span>
                                <span :class="getSpecifiedBadgeClasses(n)" class="mb-auto">
                                    {{getSpecifiedMkvName(n)}}
                                </span>
                                <span v-show="n.is_needed_labels_for_fire_prevention"
                                    class="badge badge-info mb-auto">
                                    要防炎シール
                                </span>
                            </p>                            
                            <p class="text-secondaly ml-3 mb-0">{{n.display_03}}</p>
                            <p class="text-secondaly ml-3">総㎡数:{{cGetTotalSqm(n)}}㎡</p>
                            
                        
                            <div v-for="estimateRow in n.t_project_product_estimate_details" :key="estimateRow.id">
                                <div class="d-flex mb-2">
                                    <template v-if="estimateRow.deleted_at==null">
                                <!-- <div class="row mb-2" v-show="estimateRow.deleted_at==null"> -->
                                        <input class="form-control mr-1" v-model="estimateRow.content">
                                        <div class="mr-auto">
                                            <button type="button" class="btn btn-danger" @click.prevent.stop="deleteEstimateRow(index,estimateRow)"><i class="fas fa-trash fa-fw"></i></button>
                                        </div>
                                    </template>
                                    
                                </div>
                            </div>
                            
                        </td>
                        <td class="align-middle text-left">
                            <button type="button" class="btn btn-primary" @click.prevent.stop="addEstimateRow(index)"><i class="fas fa-plus fa-fw"></i></button>
                        </td>
                        <td class="align-middle">{{n.total_weight.toFixed(3)}}</td>
                        <td class="align-middle">{{n.total_hour_for_production.toFixed(2)}}</td>
                        <td class="align-middle">
                            <div class="d-flex flex-nowrap justify-content-end align-items-center">
                                {{n.qty}}
                                <m-kv-select
                                    class="ml-2" style="width:80px;"
                                    :selected-item.sync="n.unit_m_kv"
                                    :kv-key="'m_materials-unit_m_kv_id'"
                                    v-model="n.unit_m_kv_id"
                                    /> 
                            </div>
                        </td>
                        <td class="align-middle">{{getPredictSellPrice(n.cost).toLocaleString()}}</td>
                        <td class="align-middle">
                            <ns-number-input v-model="n.sell_price" @focus="focusOnSellPrice(n)"
                                class="form-control d-inline ml-2 app-input-price"  />
                            <br /><br />
                            {{n.total_sell_price.toLocaleString()}}
                        </td>
                        <td class="align-middle">
                            {{n.cost.toLocaleString()}}
                            <br /><br />
                            {{n.total_cost.toLocaleString()}}

                        </td>
                        <!-- <td>{{n.sell_price.toLocaleString()}}</td> -->
                        <!-- <td class="align-middle"></td> -->
                        <!-- <td class="align-middle"></td> -->
                        <td class="align-middle" :class="getProfitTextClass(n.total_profit)">
                            {{n.total_profit.toLocaleString()}}
                            <br/><br/>{{n.profit_per.toFixed(2)}} %

                        </td>
                        <td class="align-middle" :class="getProfitTextClass(n.total_margin_profit)" >{{n.total_margin_profit.toLocaleString()}}</td>
                        
                    </tr>
                    
                    <tr>
                        <td>&nbsp;</td>
                        <td  class="align-middle text-left">送料</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td  class="align-middle">
                            <ns-number-input v-model="cDeliveryFee" 
                                class="form-control d-inline ml-2 app-input-price"  />
                        </td>
                        <td class="align-middle">{{cDeliveryFee.toLocaleString()}}</td>
                        <td class="align-middle">{{cDeliveryFee.toLocaleString()}}</td>
                        <!-- <td class="align-middle">{{cDeliveryFee.toLocaleString()}}</td> -->
                        <!-- <td>&nbsp;</td> -->
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td  class="align-middle text-left">納品・施工代</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td  class="align-middle">
                            <ns-number-input v-model="cConstructionFee" 
                                class="form-control d-inline ml-2 app-input-price"  />
                        </td>
                        <td class="align-middle">{{cConstructionFee.toLocaleString()}}</td>
                        <td class="align-middle">{{cConstructionFee.toLocaleString()}}</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        
                    </tr>
                    <tr class="">
                        <td>&nbsp;</td>
                        <td  class="align-middle text-left">その他経費 ※見積非表示</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td  class="align-middle">
                            <ns-number-input v-model="cOtherFee" 
                                class="form-control d-inline ml-2 app-input-price"  />
                        </td>
                        <td class="align-middle">0</td>
                        <td class="align-middle">{{cOtherFee.toLocaleString()}}</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>合計</td>
                        <td>{{cWeightSummary.toFixed(3)}}</td>
                        <td>{{cPredictWorkHourSummary.toFixed(2)}}</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <!-- <td>&nbsp;</td> -->
                        
                        <td>{{cSellPriceSummary.toLocaleString()}}</td>
                        <td>{{cCostSummary.toLocaleString()}}</td>     
                                     
                        <td :class="getProfitTextClass(cProfitSummary)">
                            {{cProfitSummary.toLocaleString()}}
                            <br /><br />
                            {{cProfitPerSummary.toFixed(2)}} %
                        </td>
                        
                        <!-- <td :class="getProfitTextClass(cProfitPerSummary)"></td> -->
                        <td :class="getProfitTextClass(cMarginProfitSummary)" >{{cMarginProfitSummary.toLocaleString()}}</td> 
                        <!-- <td>{{cVariableCostSummary}}</td>  -->
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="row">
            <div class="col-12 pb-2 ">
                <div class="border-bottom">
                    <p class="h5">社内用見積説明</p>
                </div>
            </div>
        </div>        
        <div class="row">
            <div class="col-12">
                <div class="form-group">
                    <textarea v-model="cInternalQuotationMemo" 
                        class="form-control"/>
                </div>
                
            </div>
        </div>

        <t-product-edit-summary-cost-details 
            v-model="dSelectedProduct"
        />
        
        <div class="row" v-show="false" >
            <div class="col-12">
                <t-product-edit-summary
                    v-model="dSelectedProduct"
                    />

            </div>
        </div>
        <div class="row">
            <div class="col-12 pb-2 ">
                <div class="border-bottom">
                    <p class="h5">見積書情報</p>
                </div>
            </div>
            <div class="col-12">
                <estimate-edit-component 
                    v-model="value"
                    />
            </div>

        </div>
    </div>
</template>

<script>
import MMatrixConst from '../../consts/MMatrixConst';
import NumberUtil from '../../frameworks/NumberUtil';
import DynamicGetSetComputedMixins from '../../mixins/commons/DynamicGetSetComputedMixins'
import { TProject } from './class/models/TProject';
import _ from 'lodash'


export default {
   mixins : [DynamicGetSetComputedMixins] , 
    data :  function() {
        return {
            
            dPredictWorkHourSummary  : 0 , 
            dWeightSummary           : 0 ,

            dPredictSellPriceSummary : 0 ,
            dSellPriceSummary       : 0 ,
            dCostSummary            : 0 ,
            dProfitSummary          : 0 ,
            dProfitPerSummary       : 0 ,
            dMarginProfitSummary    : 0 ,
            

            dSelectedProduct : undefined , 

            /**
             * 想定利益
             */
            dPredictProfitPer : undefined , 

            // Mtx 想定利益率
            dMtxProductPredictProfitPer : MMatrixConst.C_PRODUCT_PREDICT_PROFIT_PER  ,


            //#region DynamicGetSetComputedMixins 用
            
            // dGetValueMethodName : "getValue"  , 
            dComputedGetSetDefs : [
                // 送料
                { key:'cDeliveryFee' ,propName:TProject.DeliveryFee_PName } ,
                // 送料
                { key:'cConstructionFee' ,propName:TProject.ConstructionFee_PName } ,
                // 
                { key:'cOtherFee' ,propName:TProject.OtherFee_PName } ,
            ] , 

            dComputedGetDefs : [
                // 総重量
                { key:'cWeightSummary' ,propName:"TotalWeight" } ,   
                // 総予想生産時間
                { key:'cPredictWorkHourSummary' ,propName:"TotalHourForProduction" } ,   
                // 総売価
                { key:'cSellPriceSummary' ,propName:"TotalSellPrice" } ,   
                // 総原価
                { key:'cCostSummary' ,propName:"TotalCost" } ,   
                // 総利益
                { key:'cProfitSummary' ,propName:"TotalProfit" } ,   
                // 総利益率
                { key:'cProfitPerSummary' ,propName:"ProfitPer" } ,   
                // 限界利益
                { key:'cMarginProfitSummary' ,propName:"TotalMarginProfit" } ,   
                // 変動費
                { key:'cVariableCostSummary' ,propName:"TotalVariableCost" } ,   

            ] ,

            dIsNotDisplaySize : false ,


            //#endregion


        } 
    } , 
    props : {
        /**
         * t_projectsのレコード
         */
        value : {
            type : TProject ,
        } ,
        /**
         * 商品リスト
         */
        productList : {
            type : Array , 
            default : () => [] ,
        }
    } ,
    watch : {
        
    } ,

    computed : {   
        
        cIsEditing : function() {
            return this.dSelectedProduct !== undefined ; 
        } ,

        cProductList : function() { 

            return this.productList ; 

        } , 

        /**
         * 想定利益率
         */
        cPredictProfitPer : function() { 

            if ( this.dPredictProfitPer === undefined){
                //console.log(" dMtxProductPredictProfitPer " + this.dMtxProductPredictProfitPer + " m_branch_id " + this.value.m_branch_id) ;                 
                const res = this.masterStore.getMtx(this.value.m_branch_id ,this.dMtxProductPredictProfitPer , "") ;
                
                let val = 0 ; 
                if (res !== undefined ) {
                    if ( res.error !== undefined) 
                    {
                        console.error(res.error) ;                         
                    }
                    else{
                        val = Number(res.val1)  ; 
                    }            

                }; 

                this.dPredictProfitPer = val * 100 ;
            }

            if ( this.dPredictProfitPer < 0) this.dPredictProfitPer = 0 ; 

            if ( this.dPredictProfitPer >= 1 ) return this.dPredictProfitPer * 0.01 ; 
            return this.dPredictProfitPer ; 
        } ,
        cPredictProfitDividePer : function() { 
            return 1 - this.cPredictProfitPer ; 
        } , 

        //伸ばし重ねしろ込み総㎡数  
        cGetTotalSqm : function(){
            return function(row){
                //重ねしろ計算
                const overlap_w = (row.num_of_sep_w -1) * row.sep_overlap_length ;
                const overlap_h = (row.num_of_sep_h -1) * row.sep_overlap_length ;

                // console.log(row.name,overlap_w,overlap_h)
                
                //総W
                const w = row.size_w + row.size_extend_l + row.size_extend_r + overlap_w ;
                const h = row.size_h + row.size_extend_t + row.size_extend_b + overlap_h ;

                const size = w * h /1000000 ;

                return size.toLocaleString() ;
                
            }
        } ,

        


        /**
         * 社内用見積備考
         *  */ 
        cInternalQuotationMemoCName : function() {
            const colName = "internal_quotation_memo" ; 
            return colName ; 
        } ,
        cInternalQuotationMemo :{
            get :  function() {                
                return this.getValue(this.cInternalQuotationMemoCName) ;
            } ,
            set : function(val) {
                this.setValue(this.cInternalQuotationMemoCName, val)  ;
            }
        } ,  

    } ,
    methods : {
        getValue : function(colName )  
        {          
            return this.$$getValue("value" , colName) ; 
        } ,
        setValue : function(colName , val){   
            this.$$setValue("value" , colName , val  ) ;

        } ,        
        getProfitTextClass : function(profit) {
            return {
                'app-text-red' :profit < 0 ,
                'app-text-blue' : profit >= 0
            }
        } ,
        /**
         * 期待売価
         */
        getPredictSellPrice : function(cost) {
            if ( cost === 0 || this.cPredictProfitPer === 0 ) return 0 ; 
            //console.log("cost " + cost + " cPredictProfitPer " + this.cPredictProfitPer) ; 
            return NumberUtil.ceil(cost / this.cPredictProfitDividePer) ; 

        } ,

        selectProduct : function(row){
            this.dSelectedProduct = row ; 
            
        } , 


        /**
         * 保証名
         */
        getWarrantyMkvName : function(n) {
            if ( n.warranty_m_kv == undefined  ) return "" ; 

            return n.warranty_m_kv.kv_name ; 
        } , 
        /**
         * 保証のバッジクラス
         */
        getWarrantyBadgeClasses : function(n) {
            if ( n.warranty_m_kv == undefined  ) return [] ; 

            return ["badge" ,n.warranty_m_kv.g_01] ; 
        } , 
        /**
         * 指定名
         */
        getSpecifiedMkvName : function(n) {
            if ( n.specified_m_kv == undefined  ) return "" ; 

            return n.specified_m_kv.kv_name ; 
        } , 
        /**
         * 指定のバッジクラス
         */
        getSpecifiedBadgeClasses : function(n) {
            if ( n.specified_m_kv == undefined  ) return [] ; 

            return ["badge" ,n.specified_m_kv.g_01] ; 
        } ,         


        focusOnSellPrice : function(row) {
            // console.log("focusOnSellPrice") ; 
            this.dSelectedProduct = row ; 

            //console.log(bb) ;
        } ,

        /**寸法描画用フォーマット */
        formatMMaterialDetailName : function(w,h){

            if( w <= 0 && h <= 0) return "" ;

            return '[ '+ w.toLocaleString() + ' × ' + h.toLocaleString() + ' mm ]'

        },

        //見積り明細行追加
        addEstimateRow : function(index) {

            const found = this.cProductList[index] ;
            // const found = this.cProductList.find( x => x.id === productId) ;
            
            let lastOrderNo = 0 ;
            if(found.t_project_product_estimate_details?.length) {
                lastOrderNo = found.t_project_product_estimate_details.slice(-1)[0].order_no ;
            }

            const estimateDetailRow = {
                order_no : lastOrderNo + 1 ,
                content  : "" ,
                created_m_user_id : this.$$cLoginUserId ,
                updated_m_user_id : this.$$cLoginUserId ,

            } ;

            found.t_project_product_estimate_details.push(estimateDetailRow) ;      

        } ,

        //明細行削除
        deleteEstimateRow : function(index,row){
            const found = this.cProductList[index] ;
            const DetailsIdx = found.t_project_product_estimate_details.indexOf(row) ;

            if(DetailsIdx !== -1){

                if(row.id){
                    this.$set(row , "deleted_at" ,Date())

                } else {

                    found.t_project_product_estimate_details.splice(DetailsIdx,1)
                
                }

            } 

        } ,
        checkedAll : function(){
            for(const product of this.cProductList) {

                this.$set(product , "is_not_display_size_in_estimate" ,this.dIsNotDisplaySize)
            }
            
        } ,
        checked : function() {
            const isAllC = this.cProductList.find(x => !x.is_not_display_size_in_estimate) === undefined ;
            if(!this.dIsNotDisplaySize && isAllC) {
                this.dIsNotDisplaySize = true ;
            } 
            else if(this.dIsNotDisplaySize && !isAllC) {
                this.dIsNotDisplaySize = false
            }
        }     
    } ,

    created : function() {
        if ( this.cDeliveryFee === undefined ) this.cDeliveryFee = 0 ; 
        if ( this.cOtherFee === undefined ) this.cOtherFee = 0 ; 
    }

}
</script>