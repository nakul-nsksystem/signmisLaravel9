<template>
    <div v-if="cIsShow">
        <div class="form-group">
            <label>id：</label>
            <span>{{ $route.params.id }}</span>
        </div>

        <div class="form-group">
            <label>コード：</label>
            <span>{{ dRow.cd }}</span>
        </div>

        <div class="form-group">
            <label>名称：</label>
            <span>{{ dRow.name }}</span>
        </div>

        <div class="form-group">
            <label>敬称：</label>
            <span>{{ dRow.title_of_honor_m_kv.kv_name }}</span>
        </div>

        <div class="form-group">
            <label>略称：</label>
            <span>{{ dRow.short_name }}</span>
        </div>

        <div class="form-group">
            <label>カナ：</label>
            <span>{{ dRow.kana }}</span>
        </div>

        <div class="form-group">
            <label>取引担当者：</label>
            <span>{{ dRow.contact_person }}</span>
        </div>

        <div class="form-group">
            <label>拠点：</label>
            <span>{{ dRow.m_branch.short_name }} <br></span>
        </div>

        <div class="form-group">
            <label>自社担当者：</label>
            <span>{{ cDisplaySalesMUserFullName }} <br></span>
        </div>

        <div class="form-group">
            <label>備考：</label>
            <span>{{ dRow.memo }}<br></span>
        </div>

        <div class="form-group">
            <label>郵便番号：</label>
            <span>〒{{ dRow.zip }}</span>
        </div>

        <div class="form-group">
            <label>住所：</label>
            <span>{{ cDisplayAddress }}</span>
        </div>

        <div class="form-group">
            <label>電話番号：</label>
            <span>{{ dRow.tel }}</span>
        </div>

        <div class="form-group">
            <label>Fax番号：</label>
            <span>{{ dRow.fax }}</span>
        </div>
        
        <div class="form-group">
            <label>メールアドレス：</label>
            <span>{{ dRow.email }}</span>
        </div>
        
        <div class="form-group">
            <label>取引区分：</label>
            <span>{{ dRow.dealing_m_kv.kv_name }}<br></span>
        </div>

        <div v-if="cIsSaleBuy">
            <div class="form-group">
                <label>締処理単位：</label>
                <span>{{ dRow.account_m_kv.kv_name }}<br></span>
            </div>

            <div class="form-group">
                <label>締日：</label>
                <span>{{ dRow.closing_date }}<br></span>
            </div>

            <div class="form-group">
                <label>{{ cDisplayPaymentDateName }}日：</label>
                <span>{{ dRow.payment_date }}<br></span>
            </div>

            <div class="form-group">
                <label>金額端数の処理：</label>
                <span>{{ dRow.price_fraction_m_kv.kv_name }}<br></span>
            </div>

            <div class="form-group">
                <label>消費税端数の処理：</label>
                <span>{{ dRow.tax_fraction_m_kv.kv_name }}<br></span>
            </div>
        </div>

        <div v-if="cIsDelivery">
            <div class="form-group">
                <label>納品形式：</label>
                <span>{{ dRow.delivery_format_m_kv.kv_name }}<br></span>
            </div>

            <div class="form-group">
                <label>納品書：</label>
                <span>{{ dRow.delivery_note_m_kv.kv_name }}<br></span>
            </div>

            <div class="form-group">
                <label>指定納品書：</label>
                <span>{{ dRow.designated_delivery_note_m_kv.kv_name }}<br></span>
            </div>
        </div>

        <div v-if="cIsSale">
            <div class="form-group">
                <label>請求書：</label>
                <span>{{ dRow.invoice_m_kv.kv_name }}<br></span>
            </div>
        </div>

        <div v-if="cIsBuy">
            <div class="form-group">
                <label>発注書：</label>
                <span>{{ dRow.purchase_order_m_kv.kv_name }}<br></span>
            </div>

            <div class="form-group">
                <label>検収書：</label>
                <span>{{ dRow.payment_notice_m_kv.kv_name }}<br></span>
            </div>
        </div>

        <div class="form-group">
            <label>販売管理備考：</label>
            <span>{{ dRow.sales_management_memo }}<br></span>
        </div>

        <div class="form-group">
            <label>業種：</label>
            <span>{{ dRow.industry_m_kv.kv_name }}<br></span>
        </div>

        <div class="form-group">
            <label>請求先：</label>
            <span>{{ cDisplayDestinationMCustomerName }} <br></span>
        </div>

        <div class="form-group">
            <label>相殺先：</label>
            <span>{{ cDisplaySetOffMCustomerName }} <br></span>
        </div>

        <div class="form-group">
            <label>取引先グループ：</label>
            <span>{{ cDisplayCategoryGroupMCustomerName }} <br></span>
        </div>

        <button type="submit" class="btn btn-light" @click.prevent="historyBack()">戻る</button>
    </div>
</template>

<script>
import PageMixins from '@mixins/commons/PageMixins' ;

export default {
    mixins : [PageMixins] , 
    data : function () {
        return {
            dApiName : "mCustomer" ,
            dRow : {
                dealing_m_kv_id : 1010000 ,
            } ,
        }
    } ,
    computed : {
        cEndpoint : function () {
            let ep = `api/${this.dApiName}` ;

            if (!this.cIsNew) ep += `/${this.$route.params.id}` ;

            return ep ;
        } ,
        cIsNew : function () {
            return this.$route.params.id === undefined ;
        } ,
        cIsShow : function () {
            return this.cIsNew || this.dRow.id > 0 ;
        } ,
        cIsSale : function () {
            // 売の場合にtrue
            return this.dRow.dealing_m_kv_id == 1010001 ;
        } , 
        cIsBuy : function () {
            // 買・外注の場合にtrue
            return this.dRow.dealing_m_kv_id == 1010002 || this.dRow.dealing_m_kv_id == 1010004 ;
        } , 
        cIsSaleBuy : function () {
            // 売買の場合にtrue
            return this.cIsSale || this.cIsBuy ;
        } , 
        cIsDelivery : function () {
            // 売・納品先の場合にtrue
            return this.dRow.dealing_m_kv_id == 1010001 || this.dRow.dealing_m_kv_id == 1010008 ;
        } , 
        cDisplayAddress : function() {
            // 住所
            return (this.dRow.address1 ?? '') + ' ' + (this.dRow.address2 ?? '') ; 
        } ,
        cDisplayPaymentDateName : function() {
            // 入金・支払日
            return this.cIsSale ? "入金" : "支払" ; 
        } ,
        cDisplaySalesMUserFullName : function() {
            // 最終更新者
            return this.dRow?.sales_m_user?.full_name ; 
        } ,
        cDisplayDestinationMCustomerName : function() {
            // 請求先
            return this.dRow?.destination_m_customer?.name ; 
        } ,
        cDisplaySetOffMCustomerName : function() {
            // 相殺先
            return this.dRow?.set_off_m_customer?.name ; 
        } ,
        cDisplayCategoryGroupMCustomerName : function() {
            // 取引先グループ
            return this.dRow?.category_group_m_customer?.name ; 
        } ,
    } ,
    methods : {
        getData : async function () {
            try {
                const res = await axios.get(this.cEndpoint) ;
                this.dRow = res.data ;
            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.cEndpoint) ;
            }
        } ,
        isEmpty : function (value) {
            if(value === 0) return false ;
            return true ;
        } ,
        historyBack : function () {
            // 検索画面へ戻る
            this.$router.push({ name : Inflector.underscore(this.dApiName) }) ;
        } ,
    } ,
    created : function () {
        if (!this.cIsNew) this.getData() ;
    } ,
}
</script>