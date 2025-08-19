<template>    
    <div class="card bg-dark" style="border-radius:0;">
        <div class="card-header">
            サマリー
        </div>
        <div class="card-body app-card-body" >  

            <div class="row" >
                <div class="col-12 pb-2 ">
                    <div class="border-bottom">
                        <p class="h5">金額</p>
                    </div>
                </div>
            </div>        

            <div class="table-responsive text-right" >
                <table class="table table-dark">
                    <tr>
                        <th class="col-2" style="width:10%;min-width:100px;" scope="col">&nbsp;</th>
                        <th class="col-2" style="width:10%;min-width:100px;" scope="col">参考売価</th>
                        <th class="col-2" style="width:10%;min-width:130px;" scope="col">売価</th>
                        <th class="col-2" style="width:10%;min-width:130px;" scope="col">原価</th>
                        <th class="col-2" style="width:10%;min-width:130px;" scope="col">利益</th>
                        <th v-show="$$cIsDebug" class="col-2"  style="width:10%;min-width:100px;" scope="col">変動費</th>
                        <th class="col-2"  style="width:10%;min-width:130px;" scope="col">限界利益</th>

                    </tr>
                    <tr>
                        <td scope="row" class="align-middle">@</td>
                        <td class="align-middle">{{cPredictSellPrice.toLocaleString()}}</td>
                        <td class="align-middle">
                            <ns-number-input v-model="cSellPrice" 
                                class="form-control d-inline ml-2 app-input-price"  />
                        </td>
                        <td class="align-middle">{{cCost.toLocaleString()}}</td>
                        <td class="align-middle" :class="cTotalProfitTextClass">{{cProfit.toLocaleString()}} </td>
                        <td v-show="$$cIsDebug" class="align-middle">{{cVariableCost.toLocaleString()}}</td>
                        <td class="align-middle">{{cMarginalProfit.toLocaleString()}}</td>
                    </tr>                                        
                    <tr>
                        <td scope="row">合計</td>
                        <td>{{cTotalPredictSellPrice.toLocaleString()}}</td>
                        <td>{{cSellTotalPrice.toLocaleString()}}</td>
                        <td>{{cTotalCost.toLocaleString()}}</td>
                        <td :class="cTotalProfitTextClass">{{cTotalProfit.toLocaleString()}}</td>
                        <td v-show="$$cIsDebug">{{cTotalVariableCost.toLocaleString()}}</td>
                        <td>{{cTotalMarginalProfit.toLocaleString()}}</td>
                        
                    </tr>
               
                    <tr>
                        <td scope="row">%</td>
                        <td>{{cPredictProfitPer * 100}}%</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td :class="cTotalProfitTextClass">{{cProfitPer.toFixed(2)}} %</td>
                        <td v-show="$$cIsDebug">&nbsp;</td>
                        <td>{{(cTotalMarginalProfitPer).toFixed(2)}} %</td>
                        
                    </tr>                    
                    
                </table>        
            </div>
        
            <t-product-edit-summary-cost-details 
                v-model="value"
                :is-needed-update.sync="cIsNeededDetailUpdate"
            />
<!-- 
            <div class="row">
                <div class="col-12 pb-2 ">
                    <div class="border-bottom">
                        <p class="h5">コスト内訳</p>
                    </div>
                </div>
            </div>        

            <div class="table-responsive text-right">
                <table class="table table-striped table-dark">
                    <thead>
                        <tr>
                            <th class="col-2" style="min-width:150px;" scope="col">工程</th>
                            <th class="col-2" style="min-width:100px;" scope="col">想定時間</th>
                            <th class="col-2" style="min-width:100px;" scope="col">材料原価</th>
                            <th class="col-2" style="min-width:100px;" scope="col">外注費</th>
                            <th class="col-2" style="min-width:100px;" scope="col">作業原価</th>
                            <th class="col-2" style="min-width:100px;" scope="col">総原価</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(process, index) in cEnabledProcessList" >                                                                    
                            <td scope="row">{{ getMProcessCategoryName(process)}}</td>
                            <td>{{process.predicted_work_hour.toFixed(2)}} h</td>
                            <td>{{(process.material_cost === undefined ? 0 : process.material_cost).toLocaleString()}}</td>
                            <td>{{(process.outsource_cost === undefined ? 0 : process.outsource_cost).toLocaleString()}}</td>
                            <td>{{(process.work_cost === undefined ? 0 : process.work_cost).toLocaleString()}}</td>
                            <td>{{(process.total_cost  === undefined ? 0 : process.total_cost).toLocaleString()}}</td>
                        </tr>           
                        <tr>
                            <td scope="row">合計</td>
                            <td>{{cTotalHourForProduction.toFixed(2)}} h</td>
                            <td>{{dTotalMaterialCost.toLocaleString()}} 円</td>
                            <td>{{dTotalOutsourceCost.toLocaleString()}} 円</td>
                            <td>{{dTotalWorkCost.toLocaleString()}} 円</td>
                            <td>{{cTotalCost.toLocaleString()}} 円</td>
                            
                        </tr>
                    </tbody>
                    
                </table>        
            </div>                             -->

        </div>

    </div>
</template>

<script>
import MMatrixConst from '../../../../consts/MMatrixConst';
import ObjectUtil from '../../../../frameworks/ObjectUtil';
import NumberUtil from '../../../../frameworks/NumberUtil';

export default   {
  
    data :  function() {
        return {
            //value : this.value  , 
            dIsCostUpdated : false ,
            // Mtx 想定利益率
            dMtxProductPredictProfitPer : MMatrixConst.C_PRODUCT_PREDICT_PROFIT_PER  ,
        } 
    } , 
    props : {
        /**
         * T_PRODUCTSのレコード
         */
        value : { 
            type : Object ,
        },
        
        isNeededDetailUpdate : {
            type : Boolean , 
        }
    } ,    
    watch : {        
    } , 
    computed : {        

        cIsNeededDetailUpdate : {
            get :  function() {          
                return this.isNeededDetailUpdate ; 
            } ,
            set : function(val) {       
                this.dIsCostUpdated = val ;          
                this.$emit("update:isNeededDetailUpdate" ,val ) ; 
            }

        } , 

        /**
         * 想定利益率
         */
        cPredictProfitPer : function() { 
            //console.log(" dMtxProductPredictProfitPer " + this.dMtxProductPredictProfitPer + " m_branch_id " + this.value.m_branch_id) ; 
            if ( this.value === undefined ) return 0 ; 

            const res = this.masterStore.getMtx(this.value.m_branch_id ,this.dMtxProductPredictProfitPer , "") ;
            if (res === undefined ) return 0 ; 

            if ( res.error !== undefined) 
            {
                console.error(res.error) ; 
                return 0 ; 
            }
            else{
                return  Number(res.val1) ; 
            }            
        } ,
        /**
         * 想定利益
         */
        cPredictSellPrice : function() {
            if ( this.cCost === 0 || this.cPredictProfitPer === 0 ) return 0 ; 
            //console.log("cCost " + this.cCost + " cPredictProfitPer " + this.cPredictProfitPer) ; 
            let predictPer = ( 1 - this.cPredictProfitPer ) ; 
            return NumberUtil.ceil(this.cCost / predictPer) ; 

        } ,
        /**
         * 合計想定利益
         */
        cTotalPredictSellPrice : function() {
            if ( this.cPredictSellPrice === 0 || this.cQty === 0) return 0 ; 

            return NumberUtil.ceil(this.cPredictSellPrice * this.cQty) ; 

        } ,

        // 数量
        cQtyCName : function () {
            const colName = "qty" ; 
            return colName ; 
        } , 
        cQty :{
            get :  function() {          
                return NumberUtil.invalid2zr(this.getValue(this.cQtyCName))  ;
            } ,
            set : function(val) {
                this.setValue(this.cQtyCName, val)  ;
            }
        } ,  
        // 原価         
        cCostCName : function () {
            const colName = "cost" ; 
            return colName ; 
        } , 
        cCost : function() {        
            let val = 0 ; 
            //if (! this.isNeededDetailUpdate ) val = 0 ;  
            val = NumberUtil.round(this.cTotalCost / this.cQty , 0)  ; 
            this.setValue(this.cCostCName, val)  ;
              
            return val; 

        } ,
        
        // トータル原価
        cTotalCostCName : function () {
            const colName = "total_cost" ; 
            return colName ; 
        } , 
        cTotalCost : function() {
            return NumberUtil.invalid2zr(this.getValue(this.cTotalCostCName))  ;
            
            /*
            if ( this.value === undefined ) return 0 ; 
            if ( this.value.t_project_product_processes === undefined) return 0 ;
            let processes = this.value.t_project_product_processes ; 
            
            if (this.dIsCostUpdated  )  this.dIsCostUpdated = false ; 
            
            const res = processes.reduce(function (acc, curr) {
                return acc + curr.total_cost  ; 
            }, 0) ;

            this.setValue(this.cTotalCostCName, res)  ;
            return res ;
            */
        } ,

        // 売価
        cSellPriceCName : function () {
            const colName = "sell_price" ; 
            return colName ; 
        } , 
        cSellPrice :{
            get :  function() {          
                return this.getValue(this.cSellPriceCName)  ;
            } ,
            set : function(val) {
                this.setValue(this.cSellPriceCName, val)  ;
            }
        } ,  
        // 総売価
        cSellTotalPriceCName : function () {
            const colName = "total_sell_price" ; 
            return colName ; 
        } , 
        cSellTotalPrice : function(){
            const val = NumberUtil.round(this.cSellPrice * this.cQty , 0)  ; 
            this.setValue(this.cSellTotalPriceCName, val)  ;

            return val ; 
        } ,

        // 利益
        cProfitCName : function () {
            const colName = "profit" ; 
            return colName ; 
        } , 
        cProfit : function(){
            const val = NumberUtil.round(this.cTotalProfit / this.cQty , 0)  ; 
            this.setValue(this.cProfitCName, val)  ;
            return val; 
        } ,

        // トータル利益
        cTotalProfitCName : function () {
            const colName = "total_profit" ; 
            return colName ; 
        } , 
        cTotalProfit : function() {
            let profit = NumberUtil.invalid2zr( this.cSellTotalPrice - this.cTotalCost) ; 
            this.setValue(this.cTotalProfitCName, profit)  ;
            return  profit ; 
        } ,        
        // 利益率
        cProfitPerCName : function () {
            const colName = "profit_per" ; 
            return colName ; 
        } , 
        cProfitPer : function() {
            let profitPer =  (1 - (this.cTotalCost / this.cSellTotalPrice)) * 100  ; 
            //console.log("profitPer:" + profitPer) ; 

            if ( isNaN(profitPer) || ! isFinite(profitPer ) ) profitPer = 0 ; 
            profitPer = NumberUtil.round(profitPer , 2) ; 

            this.setValue(this.cProfitPerCName, profitPer )  ;
            return  profitPer ; 
        } ,        
        cTotalProfitTextClass : function() {
            return {
                'app-text-red' :this.cTotalProfit < 0 ,
                'app-text-blue' : this.cTotalProfit >= 0
            }
        } ,


        /**
         * 変動費
         */
        cVariableCostCName : function () {
            const colName = "variable_cost" ; 
            return colName ; 
        } , 
        cVariableCost : function () {            
            return NumberUtil.invalid2zr(this.getValue(this.cVariableCostCName))  ;

        } ,
        /**
         * 合計変動費
         */
        cTotalVariableCostCName : function () {
            const colName = "total_variable_cost" ; 
            return colName ; 
        } , 
        cTotalVariableCost : function () {
            return NumberUtil.invalid2zr(this.getValue(this.cTotalVariableCostCName))  ;
        } ,
        /**
         * 限界利益
         */
        cMarginalProfitCName : function () {
            const colName = "margin_profit" ; 
            return colName ; 
        } , 
        cMarginalProfit : function() {
            const val = NumberUtil.ceil(this.cTotalMarginalProfit / this.cQty ) ;  
            this.setValue(this.cMarginalProfitCName, val )  ;
            
            return val ; 
        } , 
        /**
         * 合計限界利益
         */
        cTotalMarginalProfitCName : function () {
            const colName = "total_margin_profit" ; 
            return colName ; 
        } , 
        cTotalMarginalProfit : function() {
            const val = NumberUtil.invalid2zr(this.cSellTotalPrice - this.cTotalVariableCost) ;  
            this.setValue(this.cTotalMarginalProfitCName, val )  ;
            return val ; 
        } , 
        /**
         * 合計限界利益率
         */
        cTotalMarginalProfitPerCName : function () {
            const colName = "margin_profit_per" ; 
            return colName ; 
        } , 
        cTotalMarginalProfitPer : function() {
            const val = NumberUtil.invalid2zr(this.cTotalMarginalProfit / this.cSellTotalPrice) * 100 ;  
            this.setValue(this.cTotalMarginalProfitPerCName, val )  ;            
            return val  ; 
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
    
        
    },
    created : function() 
    {
        
        //console.log(this) ; 
    }

}
</script>
<style scoped>


/* 金額の入力項目(8桁まで)*/

.app-input-price{
    width:8em!important; 
}


</style>