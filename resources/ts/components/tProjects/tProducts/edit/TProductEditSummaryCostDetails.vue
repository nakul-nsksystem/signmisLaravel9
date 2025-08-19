<template>    
    <div>
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
                        <th class="col-2" style="width:20%;min-width: 150px;" scope="col">工程</th>
                        <th class="col-2" style="width:10%;min-width:100px;" scope="col">想定時間</th>
                        <th class="col-2" style="width:10%;min-width:100px;" scope="col">材料原価</th>
                        <th class="col-2" style="width:10%;min-width:100px;" scope="col">外注費</th>                        
                        <th class="col-2" style="width:10%;min-width:100px;" scope="col">作業原価</th>
                        <th class="col-2" style="width:10%;min-width:100px;" scope="col">総原価</th>
                        <th v-show="$$cIsDebug" class="col-2" style="width:10%;min-width:100px;" scope="col">変動費</th>
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
                        <td v-show="$$cIsDebug" >&nbsp;</td>
                    </tr>                          
                    <!-- Summary -->
                    <tr>
                        <td scope="row">合計</td>
                        <td>{{cTotalHourForProduction.toFixed(2)}} h</td>
                        <td>{{dTotalMaterialCost.toLocaleString()}} </td>
                        <td>{{dTotalOutsourceCost.toLocaleString()}} </td>
                        <td>{{dTotalWorkCost.toLocaleString()}} </td>
                        <td>{{cTotalCost.toLocaleString()}} </td>
                        <td v-show="$$cIsDebug" >{{cTotalVariableCost.toLocaleString()}}</td>
                        
                    </tr>
                </tbody>
                
            </table>
        </div>
        <div v-show="false">
            {{cVariableCost}}
        </div>
    </div>     

</template>

<script>
import MMatrixConst from '../../../../consts/MMatrixConst';
import NumberUtil from '../../../../frameworks/NumberUtil';


export default   {
  
    data :  function() {
        return {
            //value : this.value  , 

            /**
             * 合計予想作業時間
             */
            dTotalPredictWorkHour : 0 , 
            /**
             * 合計材料費
             */
            dTotalMaterialCost : 0 , 
            /**
             * 合計外注費
             */            
            dTotalOutsourceCost : 0 ,
            /**
             * 合計社内作業
             */
            dTotalWorkCost : 0 , 

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
        isNeededUpdate : {
            type : Boolean , 
        }
    } ,    
    watch : {
        
    } , 
    computed : {        
        
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
        // トータル原価
        cTotalCostCName : function () {
            const colName = "total_cost" ; 
            return colName ; 
        } , 
        cTotalCost : function() {
            //console.log("totalCost") ; 

            /*
            if ( ObjectUtil.isNullOrUndefined(this.value) ) return 0 ; 
            if ( ObjectUtil.isNullOrUndefined( this.value.t_project_product_processes )) return 0 ;
            let processes = this.value.t_project_product_processes ; 
            
            //if (this.dIsCostUpdated  )  this.dIsCostUpdated = false ; 
            
            const res = processes.reduce(function (acc, curr) {
                return acc + curr.total_cost  ; 
            }, 0) ;
            */
            let val = NumberUtil.invalid2zr(this.dTotalMaterialCost) 
                    + NumberUtil.invalid2zr(this.dTotalOutsourceCost) 
                    + NumberUtil.invalid2zr(this.dTotalWorkCost)  ; 
            this.setValue(this.cTotalCostCName, val)  ;
            //this.setValue(this.cTotalCostCName, res)  ;
            return val ;
        } ,
        
        /**
         * 変動費
         */
        cVariableCostCName : function () {
            const colName = "variable_cost" ; 
            return colName ; 
        } , 
        cVariableCost : function () {
            const val = NumberUtil.invalid2zr(this.cTotalVariableCost / this.cQty) ; 
            this.setValue(this.cVariableCostCName, val )  ;

            return val ; 
        } ,
        /**
         * 合計変動費
         */
        cTotalVariableCostCName : function () {
            const colName = "total_variable_cost" ; 
            return colName ; 
        } , 
        cTotalVariableCost : function () {
            const val = NumberUtil.invalid2zr(this.dTotalMaterialCost + this.dTotalOutsourceCost) ;  
            this.setValue(this.cTotalVariableCostCName, val )  ;
            return val ; 

        } ,

        /**
         * 合計作業時間
         */
        cTotalHourForProductionCName : function () {
            const colName = "total_hour_for_production" ; 
            return colName ; 
        } , 
        cTotalHourForProduction : function () {
            const val = NumberUtil.invalid2zr(this.dTotalPredictWorkHour) ; 
            this.setValue(this.cTotalHourForProductionCName, val )  ;

            return val ; 
        } ,
        
        // 有効な工程のみのリスト
        cEnabledProcessList : function() {
            //if ( this.dIsProcessesUpdated ) this.dIsProcessesUpdated = false ; 
            
            if ( this.value === undefined ) return [] ; 

            if ( this.isNeededUpdate) this.$emit("update:is-needed-update" , false ) ; 

            // console.log(" m_product_category_id " + this.value.m_product_category_id ) ; 
            // console.log(" length " + this.value.t_project_product_processes.length ) ; 
            
            // console.log(this.value.t_project_product_processes) ; 
            const list = this.value.t_project_product_processes.filter(x => x.is_enabled) ; 

            // console.log("list ") ; 
            // console.log(list ) ; 

            this.dTotalPredictWorkHour = 0 ; 
            this.dTotalMaterialCost = 0 ; 
            this.dTotalOutsourceCost = 0 ; 
            this.dTotalWorkCost     = 0 ; 

            for  ( const x of list) {
                this.dTotalPredictWorkHour  += NumberUtil.invalid2zr(x.predicted_work_hour) ; 
                this.dTotalMaterialCost     += NumberUtil.invalid2zr(x.material_cost    ) ; 
                this.dTotalOutsourceCost    += NumberUtil.invalid2zr(x.outsource_cost   ) ; 
                this.dTotalWorkCost         += NumberUtil.invalid2zr(x.work_cost        ) ; 
            }

            return list ; 
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
        getMProcessCategoryName : function(process) {
            if ( process === undefined ) return "" ; 
            if ( process.m_process_category === undefined) return "" ; 

            return process.m_process_category.name ; 
            
        }
    
        
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