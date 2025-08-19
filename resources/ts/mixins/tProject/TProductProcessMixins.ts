import Vue from "vue"
import TProductProcessProductionMixins from "./TProductProcessProductionMixins" ;
import { TProjectProduct } from "../../components/tProjects/class/models/TProjectProduct";
import _ from "lodash";

export default Vue.extend ({
    mixins : [TProductProcessProductionMixins ] ,
    data : function(){
        return {
            dValue : {} ,

            /**
             * GetValueのメソッド
             * override
             */
             dGetValueMethodName : "m$getValue" ,

             /**
              * SetValueのメソッド
              * override
              */
             dSetValueMethodName : "m$setValue" ,
        }
    },
    props : {
        value : {
            type : Object ,
        } ,
        // 親TProductの情報
        tProduct : {
            type : Object ,
        } ,
        /**
         * TProjectの情報
         */
        tProject : {
            type : Object ,
        } ,
        /**
         *
         */
        boardLayouts : {
            type : Array ,
            default : () => [] ,
        } ,
        params : {
            type:Object ,
        } ,
        isViewPrice : {
            type : Boolean ,
            default : () => false ,
        }
    } ,
    watch : {
        value :
        {
            immediate: true ,
            handler : function (newVal, oldVal) {
                if (newVal !== undefined) {
                    if (oldVal !== undefined && newVal.toString() == oldVal.toString()) return ;
                    //console.log(newVal) ;
                    // @ts-ignore
                    // console.log(" m_process_category_id " + newVal.m_process_category_id) ;
                    this.dValue = newVal ;
                }
            }
        } ,
    } ,
    computed : {
        // 工程にメモがあるかどうか
        m$cIsProcessMemoAvailable : function() {
            // @ts-ignore
            if (this.dValue.m_process_category === undefined)return false ;

            // @ts-ignore
            return this.dValue.m_process_category.memo4project != null ;
        } ,

        /**
         * 各 Display要素に中身を入れる
         * @returns
         */
        m$cDisplay : function() {
            // @ts-ignore
            return this.dValue.updateProductionDisplays() ;
        } ,

        /****** 予測時間計算系 */

        //------------- カラム名関係

        // 拠点IDのカラム名
        m$cMBranchIdCName : function():string {
            const colName = "m_branch_id" ;
            return colName ;
        } ,
        // 拠点ID
        m$cMBranchId :{
            get : function() {
                // @ts-ignore
                return this.m$getValue(this.m$cMBranchIdCName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.m$cMBranchIdCName, val) ;
            }
        } ,
        // 有効フラグのカラム名
        m$cIsEnabledCName : function():string {
            const colName = "is_enabled" ;
            return colName ;
        } ,
        // 有効フラグ
        m$cIsEnabled :{
            get : function() {
                // @ts-ignore
                return this.m$getValue(this.m$cIsEnabledCName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.m$cIsEnabledCName, val) ;
            }
        } ,

        // 支給
        m$cIsCustomerProvideCName : function() {
            const colName = "is_customer_provide" ;
            return colName ;
        } ,
        m$cIsCustomerProvide :{
            get : function() {
                // @ts-ignore
                return this.m$getValue(this.m$cIsCustomerProvideCName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.m$cIsCustomerProvideCName, val) ;
            }
        } ,

        // 加工メーター数のカラム名
        m$cProcessMaterCName : function():string {
            const colName = "process_mater" ;
            return colName ;
        } ,
        m$cProcessMater :{
            get : function() {
                // @ts-ignore
                return this.m$getValue(this.m$cProcessMaterCName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.m$cProcessMaterCName, val) ;
            }
        } ,

        // 総加工メーター数のカラム名
        m$cTotalProcessMaterCName : function():string {
            const colName = "total_process_mater" ;
            return colName ;
        } ,
        m$cTotalProcessMater :{
            get : function() {
                // @ts-ignore
                return this.m$getValue(this.m$cTotalProcessMaterCName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.m$cTotalProcessMaterCName, val) ;
            }
        } ,

        // 削除可能フラグ
        m$cIsRemovableCName : function() {
            const colName = "is_removable" ;
            return colName ;
        } ,
        m$cIsRemovable :{
            get : function() {
                // @ts-ignore
                return this.m$getValue(this.m$cIsRemovableCName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.m$cIsRemovableCName, val) ;
            }
        } ,

    /*****************************************
     * 外注、仕入
     *****************************************/
        /**
         * 要発注
         */
         m$cIsOrderNeededCName : function():string {
            const colName = "is_order_needed" ;
            return colName ;
        } ,
        m$cIsOrderNeeded :{
            get : function() {
                // @ts-ignore
                return this.m$getValue(this.m$cIsOrderNeededCName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.m$cIsOrderNeededCName, val) ;
            }
        } ,

        // 外注、仕入フラグのカラム名
        m$cIsOutsourceCName : function():string {
            const colName = "is_outsource" ;
            return colName ;
        } ,

        // 外注、仕入フラグ
        m$cIsOutsource :{
            get : function() {
                // @ts-ignore
                return this.m$getValue(this.m$cIsOutsourceCName) ;
            } ,
            set : function(val) {

                this.m$cIsOrderNeeded = val ;

                this.m$setValue(this.m$cIsOutsourceCName, val) ;
            }
        } ,

        // 外注生産先IDのカラム名
        m$cOutsourceMProductionIdCName : function():string {
            // const colName = "outsource_m_production_id" ;
            const colName = "OutsourceMProductionId" ;
            return colName ;
        } ,

        // 外注生産先ID
        m$cOutsourceMProductionId :{
            get : function() {
                // @ts-ignore
                return this.m$getValue(this.m$cOutsourceMProductionIdCName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.m$cOutsourceMProductionIdCName, val) ;
            }
        } ,

        // 選択されている外注生産先
        m$cSelectedOutsourceMProduction : function() {
            if (this.m$cOutsourceMProductionId === undefined || this.m$cOutsourceMProductionId === 0) return undefined ;

            // @ts-ignore
            let data = this.mainStore.masters.MProductions.find(e => e.id == this.m$cOutsourceMProductionId) ;
            return data ;
        } ,

        // 外注先/仕入れ先
        m$cSupplierMCustomerCName : function() {
            // const colName = "supplier_m_customer_id" ;
            const colName = "SupplierMCustomer" ;
            return colName ;
        } ,
        m$cSupplierMCustomer :{
            get : function() {
                // @ts-ignore
                return this.m$getValue(this.m$cSupplierMCustomerCName) ;
            } ,
            set : function(val) {
                // @ts-ignore
                this.m$setValue(this.m$cSupplierMCustomerCName, val) ;
            }
        } ,

        // 外注先/仕入れ先ID
        m$cSupplierMCustomerIdCName : function() {
            // const colName = "supplier_m_customer_id" ;
            const colName = "SupplierMCustomerId" ;
            return colName ;
        } ,
        m$cSupplierMCustomerId :{
            get : function() {
                // @ts-ignore
                return this.m$getValue(this.m$cSupplierMCustomerIdCName) ;
            } ,
            set : function(val) {
                // @ts-ignore
                this.m$setValue(this.m$cSupplierMCustomerIdCName, val) ;
            }
        } ,

        // 外注単価手入力フラグ
        m$cIsOutsourceCostInputCName : function():string {
            const colName = "is_outsource_cost_input" ;
            return colName ;
        } ,
        m$cIsOutsourceCostInput :{
            get : function() {
                // @ts-ignore
                return this.m$getValue(this.m$cIsOutsourceCostInputCName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.m$cIsOutsourceCostInputCName, val) ;
            }
        } ,

        // 外注手入力単価
        m$cOutsourceCostByInputCName : function():string {
            const colName = "outsource_cost_by_input" ;
            return colName ;
        } ,
        m$cOutsourceCostByInput :{
            get : function() {
                // @ts-ignore
                return this.m$getValue(this.m$cOutsourceCostByInputCName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.m$cOutsourceCostByInputCName, val) ;
            }
        } ,

        // 外注数量
        m$cOutsourceQtyCName : function():string {
            const colName = "outsource_qty" ;
            return colName ;
        } ,
        m$cOutsourceQty :{
            get : function() {
                // @ts-ignore
                return this.m$getValue(this.m$cOutsourceQtyCName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.m$cOutsourceQtyCName, val) ;
            }
        } ,

    /*****************************************
     * 生産先
     *****************************************/
        /******* 生産先01 */
        // 生産先ID
        m$cMProductionId01CName : function() {
            // const colName = "m_production_id_01" ;
            const colName = "MProductionId01" ;

            return colName ;
        } ,
        m$cMProductionId01 :{
            get : function() {
                // @ts-ignore
                return this.m$getValue(this.m$cMProductionId01CName) ;
                // return this.dValue.MProductionId01 ;
            } ,
            set : function(val) {
                this.m$setValue(this.m$cMProductionId01CName, val) ;
                // @ts-ignore
                // this.dValue.MProductionId01 = val ;
            }
        } ,
        // 生産先モードID
        m$cMProductionModeId01CName : function() {
            const colName = "MProductionModeId01" ;
            return colName ;
        } ,
        m$cMProductionModeId01 :{
            get : function() {
                // @ts-ignore
                return this.m$getValue(this.m$cMProductionModeId01CName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.m$cMProductionModeId01CName, val) ;
            }
        } ,
        // 生産先オプションID
        m$cMProductionOptionId01CName : function() {
            const colName = "MProductionOptionId01" ;
            return colName ;
        } ,
        m$cMProductionOptionId01 :{
            get : function() {
                // @ts-ignore
                return this.m$getValue(this.m$cMProductionOptionId01CName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.m$cMProductionOptionId01CName, val) ;
            }
        } ,

        //#region ******* 生産先02
        // 生産先ID
        m$cMProductionId02CName : function() {
            const colName = "MProductionId02" ;
            return colName ;
        } ,
        m$cMProductionId02 :{
            get : function() {
                // @ts-ignore
                return this.m$getValue(this.m$cMProductionId02CName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.m$cMProductionId02CName, val) ;
            }
        } ,
        // 生産先モードID
        m$cMProductionModeId02CName : function() {
            const colName = "MProductionModeId02" ;
            return colName ;
        } ,
        m$cMProductionModeId02 :{
            get : function() {
                // @ts-ignore
                return this.m$getValue(this.m$cMProductionModeId02CName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.m$cMProductionModeId02CName, val) ;
            }
        } ,
        // 生産先オプションID
        m$cMProductionOptionId02CName : function() {
            const colName = "MProductionOptionId02" ;
            return colName ;
        } ,
        m$cMProductionOptionId02 :{
            get : function() {
                // @ts-ignore
                return this.m$getValue(this.m$cMProductionOptionId02CName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.m$cMProductionOptionId02CName, val) ;
            }
        } ,
        //#endregion

        //#region ******* 生産先03
        // 生産先ID
        m$cMProductionId03CName : function() {
            const colName = "MProductionId03" ;
            return colName ;
        } ,
        m$cMProductionId03 :{
            get : function() {
                // @ts-ignore
                return this.m$getValue(this.m$cMProductionId03CName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.m$cMProductionId03CName, val) ;
            }
        } ,
        // 生産先モードID
        m$cMProductionModeId03CName : function() {
            const colName = "MProductionModeId03" ;
            return colName ;
        } ,
        m$cMProductionModeId03 :{
            get : function() {
                // @ts-ignore
                return this.m$getValue(this.m$cMProductionModeId03CName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.m$cMProductionModeId03CName, val) ;
            }
        } ,
        // 生産先オプションID
        m$cMProductionOptionId03CName : function() {
            const colName = "MProductionOptionId03" ;
            return colName ;
        } ,
        m$cMProductionOptionId03 :{
            get : function() {
                // @ts-ignore
                return this.m$getValue(this.m$cMProductionOptionId03CName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.m$cMProductionOptionId03CName, val) ;
            }
        } ,
        //#endregion

        //#region ******* 生産先04
        // 生産先ID
        m$cMProductionId04CName : function() {
            const colName = "MProductionId04" ;
            return colName ;
        } ,
        m$cMProductionId04 :{
            get : function() {
                // @ts-ignore
                return this.m$getValue(this.m$cMProductionId04CName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.m$cMProductionId04CName, val) ;
            }
        } ,
        // 生産先モードID
        m$cMProductionModeId04CName : function() {
            const colName = "MProductionModeId04" ;
            return colName ;
        } ,
        m$cMProductionModeId04 :{
            get : function() {
                // @ts-ignore
                return this.m$getValue(this.m$cMProductionModeId04CName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.m$cMProductionModeId04CName, val) ;
            }
        } ,
        // 生産先オプションID
        m$cMProductionOptionId04CName : function() {
            const colName = "MProductionOptionId04" ;
            return colName ;
        } ,
        m$cMProductionOptionId04 :{
            get : function() {
                // @ts-ignore
                return this.m$getValue(this.m$cMProductionOptionId04CName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.m$cMProductionOptionId04CName, val) ;
            }
        } ,
        //#endregion

    /*****************************************
     * その他
     *****************************************/
        // 必要作業者数
        m$cNumOfWorkersCName : function() {
            const colName = "num_of_workers" ;
            return colName ;
        } ,
        m$cNumOfWorkers :{
            get : function() {
                // @ts-ignore
                return this.m$getValue(this.m$cNumOfWorkersCName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.m$cNumOfWorkersCName, val) ;
            }
        } ,

    } ,
    methods: {
        m$getValue : function(colName:string):any {
            // @ts-ignore
            return this.$$getValue("dValue", colName) ;
        } ,
        m$setValue : function(colName:string, val:any){
            // @ts-ignore
            this.$$setValue("dValue", colName, val) ;
        } ,
    },
    created : function()
    {
        // if (ObjectUtil.isNU(this.m$cIsEnabled)) this.m$cIsEnabled = false ;
        // if (ObjectUtil.isNU(this.m$cIsRemovable)) this.m$cIsRemovable = false ;
        // if (ObjectUtil.isNU(this.m$cIsCustomerProvide)) this.m$cIsCustomerProvide = false ;
        // if (ObjectUtil.isNU(this.m$cIsOutsource)) this.m$cIsOutsource = false ;
        // if (ObjectUtil.isNU(this.m$cIsOutsourceCostInput)) this.m$cIsOutsourceCostInput = false ;

        //console.log("AAA Mixin") ;
        //console.log(this.dValue) ;
    }
});