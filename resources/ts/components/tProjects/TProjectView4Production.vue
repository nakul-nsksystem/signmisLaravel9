<template>
    <div class="my-2">
        <div class="d-flex flex-wrap"            
            >
            <h5 class="mb-0 flex-fill">
                <a href="#"
                    @click.prevent="$$openTProjectEditOnOtherTab(value.id)">
                        {{value.cd}} - [ {{cMCustomerName}} {{cValue.customer_user_name}} ] {{value.name}}                                                 
                </a>
            </h5>


            <h5 class="pr-2 mb-0" >
                物件最短納期:{{cProjectDeliveryAt}}                
            </h5>
            
            <h5 class="pr-2 mb-0" >
                <span class="badge" 
                    :class="getMBranchColor(value.m_branch_id)">
                    {{cMBranchName}}
                </span>                            
            </h5>
        </div>

        <h6 class="text-white-75">受注日:{{$$formatDay(cValue.ordered_at)}} 営業担当:{{cSaleMUserName}}</h6>

        <!-- class="bg-app-secondaly" -->
        <div >
            <t-product-view-list-component
                    v-model="cValue"
                    :is-production="true"
                    :is-view-result-control="true"
                    :product-list="cValue.t_project_products">
                </t-product-view-list-component>
        </div>

    </div>

</template>

<script>
import DayJsEx from '../../frameworks/DayJsEx';
import MastersUtil from '../../frameworks/MastersUtil';
import ObjectUtil from '../../frameworks/ObjectUtil';


export default {
    data :  function() {
        return {



        } 
    } , 
    props : {
        /**
         * t_projectのレコード
         */
        value : {
            type : Object , 
            
        } , 
    } ,
    computed : {

        cValue : function() { 
            if ( _.isNil(this.value ) ) return { } 

            return this.value ; 
        } ,

        /* カラム系 */

        /**
         * 選択中の拠点名
         */
        cMBranchName : function() {
            const finded = this.masterStore.getMBranchById(this.cValue.m_branch_id ) ; 
            return finded === undefined ? "" : finded.shortNameOrName ; 
        } , 
        
        /**
         * 選択中の顧客名
         */
        cMCustomerName : function() { 
            return MastersUtil.getCustomerName(this.cValue.m_customer)
        } ,
        
        // 顧客担当者
        cCustomerUserNameCName : function() {
            const colName = "customer_user_name" ; 
            return colName ; 
        } ,
        cCustomerUserName :{
            get :  function() {                
                return this.getValue(this.cCustomerUserNameCName) ;
            } ,
            set : function(val) {
                this.setValue(this.cCustomerUserNameCName, val)  ;
            }
        } ,        

         
        /**
         * 選択中の営業担当名
         */
        cSaleMUserName : function() { 
            const finded = this.masterStore.getMUserById(this.cValue?.sales_m_user_id ) ; 
            return finded === undefined ? "" : finded.full_name ; 
        } ,
        
        // 取引先に設定されている営業担当( 営業担当が空の場合のみ設定)
        cCustomerSalesMUserId : {
            get : function() {
                return this.cSalesMUserId ; 
            } , 
            set : function(val) {
                //console.log(this.cSalesMUserId) ; 
                if ( NumberUtil.invalid2zr( this.cSalesMUserId ) === 0) {
                    //console.log("sales " + this.cSalesMUserId ) ; 
                    //console.log("new " + val ) ; 
                    
                    this.cSalesMUserId = val ; 
                }
            }
        } , 

        
        /**
         * 売上完了日
         */
        cSalesCompletedAtCName : function() {
            const colName = "sales_completed_at" ; 
            return colName ; 
        } ,
        cSalesCompletedAt :{
            get :  function() {                
                return this.getValue(this.cSalesCompletedAtCName) ;
            } ,
            
        } ,

        /**
         * 物件最短納期
         */
        cProjectDeliveryAt : function() { 
            
            const minDelivery = this.cValue?.min_delivery ; 
            if ( ObjectUtil.isNU( minDelivery?.delivery_at ) ) return "" ; 

            const at = DayJsEx.formatDate(minDelivery["delivery_at"] ) 
            const time = ObjectUtil.nu2ec(minDelivery["delivery_time"])   ; 
            return `${at} ${time}` ; 
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


        /**
         * 拠点色
         */
        getMBranchColor : function (n)  {
            const finded = this.masterStore.getMBranchColorById(n ) ;                         
            return ObjectUtil.isNUE( finded ) ? "" : "badge-" + finded ; 
        } , 

        /**
         * 拠点名
         */
        getMBranchName : function (n)  {
        } , 



        
    }

}
</script>