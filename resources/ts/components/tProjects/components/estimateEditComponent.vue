<template>
    <div>
        <div class="bg-app-secondaly">
            <div class="col-12 pt-2">                            
                <div class="row mt-4">
                    <div class="col-12 col-xl-3">                                    
                        <div class="form-group">
                            <label >見積No.</label>
                            <div class="form-inline">
                                {{value.cd}}&nbsp;-&nbsp;<input type="text" class="form-control" v-model="cEstimateNo">
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-xl-3">
                        <div class="form-group">
                            <label >見積日</label>
                            <ex-v-date-picker 
                                v-model="cEstimateDate" 
                                :is-day-only="false"/>
                        </div>
                    </div>
                </div>
                <div class="row">

                    <div class="col-12 col-xl-6">
                        <div class="form-group">
                            <label >納期</label>
                            <input type="text" class="form-control" placeholder="ご相談の上" v-model="cEstimateDeliveryDate">
                        </div>
                    </div>
                    <div class="col-12 col-xl-6">  
                        <div class="form-group">
                            <label>受渡場所</label>
                            <!-- <input type="text" class="form-control" placeholder="御社ご指定の場所" v-model="cEstimateDeliveryAddress"> -->
                            <m-kv-select                                                             
                                v-model="cEstimateDeliveryMKvId"
                                :kv-key="'t_project_estimates-delivery'"
                                />
                        </div>
                    </div>
                    <div class="col-12 col-xl-6">
                        <div class="form-group">
                            <label >取引方法</label>
                            <input type="text" class="form-control" placeholder="従来通り" v-model="cEstimateCondition">
                        </div>
                    </div>
                    <div class="col-12 col-xl-6"> 
                        <div class="form-group">
                            <label >有効期限</label>
                            <input type="text" class="form-control" placeholder="3ヶ月" v-model="cEstimateTerm">
                        </div>                                
                    </div>
                </div>
                <div>
                    <label>見積備考</label>
                    <textarea class="form-control" v-model="cEstimateMemo"></textarea> 
                </div>
            </div>
        </div>
    {{cDef}}
    </div>                 
</template>
<script>
import DayJsEx from "@frameworks/DayJsEx" ;
import ObjectUtil from '../../../frameworks/ObjectUtil';


export default {
    props:{
        value : {
            type : Object
        },

    },
    data: function(){
        return{

        }
    },

    computed: {

        cDef : function() {
            if(!this.value.estimate_date) this.value.estimate_date = new Date()
            return ""
        } ,
        // cRow : function(){ 

        //     const copy = ObjectUtil.deepCopyJ(this.value.t_project_products)

        //     // if(!this.value.estimate_date) this.value.estimate_date = new Date()
        //     for(const productRow of this.value.t_project_products){
        //         if(!productRow.t_project_product_estimate_details?.length) productRow.t_project_product_estimate_details = []
                
        //         //明細行1行目成形
        //         let size = "" ;
        //         if(productRow.size_w && productRow.size_h) size = ' [W' + productRow.size_w + ' × H' + productRow.size_h + ']'
                
        //         const estimateDetailRow = {
        //             order_no : 1 ,
        //             content  : productRow.name + size ,
        //             qty : productRow.qty ,
        //             unit_m_kv_id : 1530003 ,
        //             price : productRow.sell_price,
        //             total_price : productRow.total_sell_price,
        //             is_product_row : 1 ,
        //             created_m_user_id : this.$$cLoginUserId ,
        //             updated_m_user_id : this.$$cLoginUserId ,
        //         } ;

        //         const found = productRow.t_project_product_estimate_details.find(x=>x.is_product_row) ;
        //         const foundIdx = productRow.t_project_product_estimate_details.indexOf(found) ;
                
        //         if(foundIdx == -1){                    
                      
        //             productRow.t_project_product_estimate_details.unshift(estimateDetailRow) ;

        //         } else {
        //             estimateDetailRow.unit_m_kv_id = productRow.t_project_product_estimate_details[foundIdx].unit_m_kv_id ;

        //             if(productRow.t_project_product_estimate_details[foundIdx].id){
        //                 estimateDetailRow.id = productRow.t_project_product_estimate_details[foundIdx].id ;

        //             }
        //             productRow.t_project_product_estimate_details.splice(foundIdx,1,estimateDetailRow) ;
        //             // productRow.t_project_product_estimate_details.unshift(estimateDetailRow) ;

        //         } 
                            
                
        //     }
        //     return this.value.t_project_products
        // } ,

        // /**合計金額系 */
        // cTotalPrice : function (){
        //     if(!this.cRow) return 0;
        //     return this.value.t_project_products.reduce((p,x) => p + x.total_sell_price , 0) + this.cDeliveryFee ;
        // },
        // cTax : function(){
        //     if(!this.cTotalPrice) return 0;
        //     return parseInt(this.cTotalPrice/10, 10) ;
        // } ,
        // cTotalPriceWithTax : function(){
        //     return this.cTotalPrice + this.cTax ;
        // } ,
        
        // //行数カウント
        // cCountRow : function(){
        //     if(!this.cRow.t_project_products) return ;
        //     let count = 0 ;
        //     for(const products of this.value.t_project_products){
        //         count += products.t_project_product_estimate_details.length ;
        //     }

        //     if(this.cDeliveryFee>0) count += 1

        //     return count ;
        // } ,

        // //テーブル枠線クラス
        // cBorder : function(){
        //     return function(flg){
        //         return flg ? "border-bottom-0" : "border-top-0 border-bottom-0" ;
        //     }
        // } ,

        /**
         * 送料
         *  */ 
        cDeliveryFee : function() { 
            return this.value.delivery_fee ; 
        } ,


        /**
         * 以下カラム
         */

        //見積り日
        cEstimateDateCName : function () {
            const colName = "estimate_date" ;
            return colName ;
        } ,
        cEstimateDate :{
            get :  function() {
                return this.getValue(this.cEstimateDateCName)  ;
            } ,
            set : function(val) {
                this.setValue(this.cEstimateDateCName, val)  ;
            }
        } ,
        //見積番号
        cEstimateNoCName : function () {
            const colName = "estimate_no" ;
            return colName ;
        } ,
        cEstimateNo :{
            get :  function() {
                return this.getValue(this.cEstimateNoCName)  ;
            } ,
            set : function(val) {
                this.setValue(this.cEstimateNoCName, val)  ;
            }
        } ,
        //納期
        cEstimateDeliveryDateCName : function () {
            const colName = "estimate_delivery_date" ;
            return colName ;
        } ,
        cEstimateDeliveryDate :{
            get :  function() {
                return this.getValue(this.cEstimateDeliveryDateCName)  ;
            } ,
            set : function(val) {
                this.setValue(this.cEstimateDeliveryDateCName, val)  ;
            }
        } ,
        //受渡場所
        cEstimateDeliveryAddressCName : function () {
            const colName = "estimate_delivery_address" ;
            return colName ;
        } ,
        cEstimateDeliveryAddress :{
            get :  function() {
                return this.getValue(this.cEstimateDeliveryAddressCName)  ;
            } ,
            set : function(val) {
                this.setValue(this.cEstimateDeliveryAddressCName, val)  ;
            }
        } ,
        cEstimateDeliveryMKvIdCName : function () {
            const colName = "estimate_delivery_m_kv_id" ;
            return colName ;
        } ,
        cEstimateDeliveryMKvId :{
            get :  function() {
                return this.getValue(this.cEstimateDeliveryMKvIdCName)  ;
            } ,
            set : function(val) {
                this.setValue(this.cEstimateDeliveryMKvIdCName, val)  ;
            }
        } ,

        //取引方法
        cEstimateConditionCName : function () {
            const colName = "estimate_condition" ;
            return colName ;
        } ,
        cEstimateCondition :{
            get :  function() {
                return this.getValue(this.cEstimateConditionCName)  ;
            } ,
            set : function(val) {
                this.setValue(this.cEstimateConditionCName, val)  ;
            }
        } ,
        //有効期限
        cEstimateTermCName : function () {
            const colName = "estimate_term" ;
            return colName ;
        } ,
        cEstimateTerm :{
            get :  function() {
                return this.getValue(this.cEstimateTermCName)  ;
            } ,
            set : function(val) {
                this.setValue(this.cEstimateTermCName, val)  ;
            }
        } ,
        //備考
        cEstimateMemoCName : function () {
            const colName = "estimate_memo" ;
            return colName ;
        } ,
        cEstimateMemo :{
            get :  function() {
                return this.getValue(this.cEstimateMemoCName)  ;
            } ,
            set : function(val) {
                this.setValue(this.cEstimateMemoCName, val)  ;
            }
        } ,

    
    },
    methods:{
        dateFormat : function(value) {
            if(value === "" || value ===null) return  ;
            return DayJsEx.format(value , "YYYY/MM/DD")
        },
        getValue : function(colName )  {            
            return this.$$getValue("value" , colName) ; 
        } ,
        setValue : function(colName , val){   
            this.$$setValue("value" , colName , val  ) ;
        } ,

    } ,
    created : function(){
    },


}
</script>
<style scoped>
    .header1{
        border-right: none;
    }
    .header2{
        border-left: none;
        text-align: right;
    }
</style>