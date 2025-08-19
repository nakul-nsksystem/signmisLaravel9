<template>
    <div>
        <div class="row">
            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label >コード</label>
                    <div>{{cValue.cd}}</div>
                </div>
            </div>

            <div class="col-12 col-xl-2 pl-xl-0">
                <div class="form-group">
                    <label >受注拠点</label>
                    <div>{{cMBranchName}}</div>
                </div>
            </div>

            <div class="col-12 col-xl-2 pl-xl-0">
                <div class="form-group">
                    <label >営業担当</label>
                    <div >{{cSaleMUserName}}</div>
                </div>
                    
            </div>

            <div class="col-12 col-xl-2 pl-xl-0">
                <div class="form-group">
                    <label>受注日</label>
                    <div>{{$$formatDay(cValue.ordered_at)}}</div>
                </div>
            </div>

            <div class="col-12 col-xl-2 pl-xl-0">
                <div class="form-group">
                    <label>物件最短納期</label>
                    <div>{{cProjectDeliveryAt}}</div>
                </div>
            </div>
            


        </div>
        <div class="row">

            <div class="col-12 col-xl-4">
                <div class="form-group">
                    <label >クライアント</label>
                    <div>{{cMCustomerName}}</div>
                </div>
            </div>
            <div class="col-12 col-xl-2 pl-xl-0">
                <div class="form-group">
                    <label >客先担当</label>
                    <div >{{cValue.customer_user_name}}</div>
                </div>
            </div>


            <div class="col-12 col-xl-6 pl-xl-0">
                <div class="form-group">
                    <label for="projectName">物件名</label>
                    <div >{{cValue.name}}</div>
                </div>
            </div>

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
         * 拠点名
         */
        getMBranchName : function (n)  {
        } , 



        
    }

}
</script>