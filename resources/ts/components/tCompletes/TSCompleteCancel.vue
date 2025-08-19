<template>
    <validation-observer v-slot="{ invalid }">
        <div class="row">
            <div class="col">
                <div class="form-group">
                    <div class="row">
                        <contents-header-left></contents-header-left>
                        <contents-header-right>
                            <div class="float-right pt-2">
                                <button type="submit" class="btn btn-light" @click.prevent="historyBack()">戻る</button>
                            </div>
                        </contents-header-right>
                    </div>

                    <div class="row">
                        <div class="col">
                            <div v-if="dInfoMessage" class="mt-1 mb-0 alert alert-success" role="alert">
                                {{ dInfoMessage }}
                            </div>
                            
                            <div v-else-if="$$cIsError" class="mt-1 mb-0 alert alert-danger" role="alert">
                                {{ dErrorData.message }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group border-top" />

                <div class="row">
                    <div class="col-12 pb-2 col-lg-3">
                        <div class="row mx-1">
                            <div class="col-12 pl-xl-0">
                                <validation-provider name="拠点" rules="required|excluded:0" v-slot="{ errors }">
                                    <div class="form-group">
                                        <div class="col-12 col-xl-5 px-0">
                                            <label>拠点</label>
                                            <m-branch-select 
                                                v-model="dSearch.m_branch_id"
                                            />
                                        </div>

                                        <span class="validation-error">{{ errors[0] }}</span>
                                        <span class="validation-info">{{ cBranchInfoMessage }}</span>
                                    </div>
                                </validation-provider>
                            </div>
                        </div>

                        <div class="row mx-1">
                            <div class="col-12 pl-xl-0">
                                <div class="form-group">
                                    <ns-checkbox-input
                                        v-model="cCanBeInputCustomer"
                                        id="can_be_entered_customer"
                                        label="取引先を指定"
                                        class="mb-2"
                                    />
                                    <m-customer-ref-input 
                                        v-model="dSearch.m_customer_id"
                                        :m-branch-id="dSearch.m_branch_id"
                                        :dealing-cds="[1]"
                                        :disabled="!cCanBeInputCustomer"
                                    />

                                    <validation-provider name="取引先" rules="required" immediate v-slot="{ errors }">
                                        <!-- 条件が複雑なのでcomputedで計算させた結果をvalidation -->
                                        <input type="hidden" v-model="cIsRequired">
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </validation-provider>
                                </div>
                            </div>
                        </div>

                        <div class="row mx-1">
                            <div class="col-12 col-xl-4 pl-xl-0">
                                <validation-provider name="締日" rules="required|between:0,99" v-slot="{ errors }">
                                    <div class="form-group">
                                        <label for="closing_date">締日</label>
                                        <ns-number-input 
                                            id="closing_date"
                                            v-model="dSearch.closing_date"
                                            min="0"
                                            max="99"
                                        />
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </div>
                                </validation-provider>
                            </div>

                            <div class="col-12 col-xl-8 pl-xl-0">
                                <validation-provider name="処理日" :rules="`required|custom_rule_date_range:${m$cSmEditableTerm}`" v-slot="{ errors }">
                                    <div class="form-group">
                                        <div class="col-12 px-0">
                                            <label>請求締 処理日</label>
                                            <ex-v-date-picker v-model="dSearch.complete_day" />
                                        </div>

                                        <span class="validation-error">{{ errors[0] }}</span>
                                        <span class="validation-info">{{ cCompleteDayInfoMessage }}</span>
                                    </div>
                                </validation-provider>
                            </div>
                        </div>

                        <div class="row form-group" />

                        <div class="row mx-1">
                            <div class="col-12 pl-xl-0">
                                <div>
                                    <button type="submit" class="btn btn-secondary" @click.prevent="checkComplete()" :disabled="invalid || dLoadingCheck">
                                        <div v-if="dLoadingCheck">
                                            <span class="spinner-border spinner-border-sm" role="status" />
                                            締確認
                                        </div>
                                        <div v-else>
                                            <i class="fas fa-check" />
                                            締確認
                                        </div>
                                    </button>
                                    <button type="submit" class="btn btn-success" @click.prevent="runCompleteCancel()" :disabled="invalid || dLoadingCancel || dIsSearchChange || !dIsValidComplete">
                                        <div v-if="dLoadingCancel">
                                        <span class="spinner-border spinner-border-sm" role="status" />
                                            締解除
                                        </div>
                                        <div v-else>
                                            <i class="fas fa-database" />
                                            締解除
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-12 col-lg-9">
                        <div class="row mx-1">
                            【請求日単位の件数と取引先名】
                            <div class="col-12 py-2 pl-xl-0">
                                <pagination
                                    :p-pagination.sync="dPaginationSummary"
                                    @search="searchSummary($event)"
                                />
                            </div>

                            <div class="col-12 pl-xl-0">
                                <table class="table table-striped table-dark table-hover summary">
                                    <thead>
                                        <tr class="text-nowrap">
                                            <th scope="col">締処理日</th>
                                            <th scope="col">件数</th>
                                            <th scope="col">取引先名</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr v-for="n in dRowsSummary" :key="n.complete_day">
                                            <td class="text-nowrap">{{ cDateFormat(n.complete_day) }}</td>
                                            <td class="text-nowrap">{{ n.cnt }}</td>
                                            <td class="text-nowrap">
                                                <div v-if="n.cnt > 1">
                                                    <details>
                                                        <summary>詳細...</summary>
                                                        <div style="white-space:pre-line">{{ cCustomerInfo(n.t_completes) }}</div>
                                                    </details>
                                                </div>
                                                <div v-else>
                                                    {{ cCustomerInfo(n.t_completes) }}
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="border-top" />
                        <div class="row form-group" />
                        
                        <div class="row mx-1">
                            【取引先単位の請求情報】
                            <div class="col-12 py-2 pl-xl-0">
                                <pagination
                                    :p-pagination.sync="dPaginationList"
                                    @search="searchList($event)"
                                />
                            </div>

                            <div class="col-12 pl-xl-0">
                                <table class="table table-striped table-dark table-hover list">
                                    <thead>
                                        <tr class="text-nowrap">
                                            <th scope="col" style="display:none">請求id</th>
                                            <th scope="col">締処理日</th>
                                            <th scope="col" class="d-none d-md-table-cell">請求額</th>
                                            <th scope="col">前回締処理日</th>
                                            <th scope="col" style="display:none">取引先id</th>
                                            <th scope="col" >取引先</th>
                                            <th scope="col" >請求書郵送区分</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr v-for="(n, index) in dRowsList" :key="index">
                                            <td style="display:none">{{ n.complete_id }}</td>
                                            <td class="text-nowrap">{{ cDateFormat(n.complete_day) }}</td>
                                            <td class="text-nowrap d-none d-md-table-cell">{{ cToNumber(n.grand_total) }}</td>
                                            <td class="text-nowrap">{{ cDateFormat(n.last_complete_day) }}</td>
                                            <td style="display:none">{{ n.m_customer_id }}</td>
                                            <td class="text-nowrap">{{ n.m_customer_cd + " " + n.m_customer_name }}</td>
                                            <td class="text-nowrap">{{ cMKvName(n.mailing_type_m_kv_id) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </validation-observer>
</template>

<script>
import DayJs      from "dayjs" ; 
import DayJsEx    from "@frameworks/DayJsEx" ;
import NumberUtil from "@frameworks/NumberUtil" ;
import PageMixins from '@mixins/commons/PageMixins' ;
import SalesManagementMixins from '@mixins/commons/SalesManagementMixins'

export default {
    mixins : [PageMixins ,SalesManagementMixins] , 
    data : function () {
        return {
            dApiName : "tComplete",
            dRowsSummary : {                        // 結果データ(締処理内容のサマリ)
            } ,
            dRowsList : {                           // 結果データ(締処理内容のリスト)
            } ,
            dPaginationSummary : {                  // pagination(締処理内容のサマリ)
                links : [] ,                        // リンク
                total : -1 ,                        // 合計件数
                from : -1 ,                         // 現在ページの開始位置
                to : -1 ,                           // 現在ページの終了位置
            } ,
            dPaginationList : {                     // pagination(締処理内容のリスト)
                links : [] ,                        // リンク
                total : -1 ,                        // 合計件数
                from : -1 ,                         // 現在ページの開始位置
                to : -1 ,                           // 現在ページの終了位置
            } ,
            dSearch : {                             // 画面上の検索項目
                m_user_id : 0 ,                     // ログインユーザーid
                m_branch_id : 0 ,                   // 拠点(ログインユーザーの拠点)
                m_customer_id : 0 ,                 // 取引先id
                dealing_m_kv_id : 1010001 ,         // 取引区分(売)
                complete_day : null ,               // 締処理日
                closing_date : 0,                   // 締日
                is_complete : false,                // 処理区分(false=締解除)
            } ,
            dCanBeInputCustomer : false ,           // 取引先の入力可否判定用(true:入力可能 false:入力不可)
            dLoadingCheck : false ,                 // 非同期apiでの読込中フラグ(締確認)
            dLoadingCancel : false ,                // 非同期apiでの読込中フラグ(締解除)
            dIsValidComplete : false ,              // 締確認チェック
            dInfoMessage : null ,                   // メッセージ
            dIsSearchChange : true ,                // 検索条件を変更したかのフラグ
        }
    } ,
    computed : {
        cEndpoint : function () {
            return `api/${this.dApiName}` ;
        } ,
        cIsRequired : function () {
            // 取引先<checkbox>チェックが付いている & <m-customer-ref-input>未入力時は必須とする
            return (this.cCanBeInputCustomer && this.dSearch.m_customer_id == 0) ? null : "ok" ;
        } ,
        cCanBeInputCustomer : {
            get : function () {
                return this.dCanBeInputCustomer ;
            } ,
            set : function (value) {
                // 取引先idをクリア(=0)する
                this.dCanBeInputCustomer = value ;
                this.dSearch.m_customer_id = 0 ;
            } ,
        } ,
        cBranchInfoMessage : function () {
            // 拠点の妥当性チェックを行い アラートメッセージが有れば情報を出力する
            let message = "" ;

            if (this.dSearch.m_branch_id == 0) {

            } else if (this.dSearch.m_branch_id != this.mainStore.loginMUser.m_branch_id) {
                message += "ログイン担当者と拠点が異なります" ;
            }

            return message ;
        } ,
        cCompleteDayInfoMessage : function () {
            // 締日と締処理日の妥当性チェックを行い アラートメッセージが有れば情報を出力する
            let message = "" ;

            if (this.dSearch.complete_day) {
                // DayJsオブジェクト作成(時間カット)
                const complete_day = DayJs(this.dSearch.complete_day) ;
                const now          = DayJs().startOf('D') ;
                
                // 1ヶ月以上離れてる：typoの可能性
                if (complete_day > now.add(1, 'M')) {
                    message += "1ヶ月以降の日が設定されてます \n" ;
                } else if (complete_day < now.subtract(1, 'M')) {
                    message += "1ヶ月以前の日が設定されてます \n" ;
                }

                // 締日と締処理日(D部分)が違う：typoの可能性
                const day = Number(this.dSearch.closing_date) ;
                if (day >= 1 && day <= 30) {
                    // 通常の締日(5,10,15,20,25)
                    const day2 = complete_day.date() ;
                    if (day != day2) {
                        message += "締日と違う日が設定されてます" ;
                    }
                } else if (day == 31 || day == 99) {
                    // 月末
                    const end_of  = complete_day.date() ;
                    const end_of2 = complete_day.endOf('M').date() ;

                    if (end_of != end_of2) {
                        message += "月末と違う日が設定されてます" ;
                    }
                }
            }

            return message ;
        } ,
        cDateFormat : function () {
            return function (val) {
                return DayJsEx.format(val) ;
            } ;
        } ,
        cToNumber : function () {
            return function (val) {
                return NumberUtil.formatZeroSuppress(val, false) ;
            } ;
        } ,
        cCustomerInfo : function() {
            // t_completesの内容が配列になってるので加工(CD+締日+名称)してます
            return function (completes) {
                const info = completes.map(complete => complete.m_customer)
                                      .map(customer => "".concat(customer.cd, " [", customer.closing_date, "] ", customer.name)) ;
                
                // 改行挿入
                return info.join('\n') ;
            } ;
        } ,
        
        /**区分名を取得 */
        cMKvName : function() {
            return function(id) {
                return this.masterStore.getMKvById(id)?.kv_name ?? "" ; 
            }
        } ,
    } ,
    methods : {
        searchSummary : async function (url) { 
            const ep = (url? url : this.cEndpoint + "Summary/retrieve") ;
            const params = JSON.parse(JSON.stringify({
                                dealing_m_kv_id : this.dSearch.dealing_m_kv_id, 
                                m_branch_id     : this.dSearch.m_branch_id,
                                m_customer_id   : this.dSearch.m_customer_id,
                           })) ;

            try {
                // 検索処理
                const res = await axios.post(ep, params) ;
                this.dRowsSummary = res.data.data ;
                // pagination関連
                this.dPaginationSummary.links = res.data.links ;   // リンク
                this.dPaginationSummary.total = res.data.total ;   // 合計件数
                this.dPaginationSummary.from  = res.data.from ;    // 現在ページの開始位置
                this.dPaginationSummary.to    = res.data.to ;      // 現在ページの終了位置
            } catch (error) {
                // handle error
                this.$$errorConsole(error, ep) ;
            }
        } ,
        searchList : async function (url) { 
            const ep = (url? url : this.cEndpoint + "/retrieve") ;
            const params = JSON.parse(JSON.stringify({
                                dealing_m_kv_id : this.dSearch.dealing_m_kv_id, 
                                m_branch_id     : this.dSearch.m_branch_id,
                                m_customer_id   : this.dSearch.m_customer_id,
                                complete_day    : this.dSearch.complete_day, 
                                closing_date    : this.dSearch.closing_date,
                           })) ;

            try {
                // 検索処理
                const res = await axios.post(ep, params) ;
                this.dRowsList = res.data.data ;
                // pagination関連
                this.dPaginationList.links = res.data.links ;   // リンク
                this.dPaginationList.total = res.data.total ;   // 合計件数
                this.dPaginationList.from  = res.data.from ;    // 現在ページの開始位置
                this.dPaginationList.to    = res.data.to ;      // 現在ページの終了位置
            } catch (error) {
                // handle error
                this.$$errorConsole(error, ep) ;
            }
        } ,
        checkComplete : async function () {
            this.dLoadingCheck = true ;
            this.dInfoMessage = null ;
            this.dIsValidComplete = false ;
            // 取引先id=0をNullに置き換える
            this.ifCustomerIdZeroToNull() ;

            const ep = this.cEndpoint + "/check" ;
            const params = JSON.parse(JSON.stringify(this.dSearch)) ; 

            try {
                // 締確認
                const res = await axios.post(ep, params) ;
                this.dInfoMessage = res.data[0].message ;

                if (res.data[0].result == 1) {
                    // 締確認OKの時は処理ボタンを有効にする
                    this.dIsValidComplete = true ;
                }

                // 締情報を表示
                this.searchSummary() ;
                this.searchList() ;
                this.dIsSearchChange = false ;
            } catch (error) {
                // handle error
                this.$$errorConsole(error, ep) ;
            }
            
            this.dLoadingCheck = false ;
        } ,
        runCompleteCancel : async function () {
            if (!confirm('締解除を実行してもよろしいですか?')) return ;
            this.dLoadingCancel = true ;
            this.dInfoMessage = null ;
            // 取引先id=0をNullに置き換える
            this.ifCustomerIdZeroToNull();

            const ep = this.cEndpoint + "/cancel" ;
            const params = JSON.parse(JSON.stringify(this.dSearch)) ; 

            try {
                // 締解除
                const res = await axios.post(ep, params) ;
                this.dInfoMessage = res.data[0].message ;
                this.dIsValidComplete = false ;

                // 締情報を表示
                this.searchSummary() ;
                this.searchList() ;

            } catch (error) {
                // handle error
                this.$$errorConsole(error, ep) ;
            }
            
            this.dLoadingCancel = false ;
        } ,
        historyBack : function () {
            this.$router.push({ name : "complete_menu" }) ;
        } ,
        ifCustomerIdZeroToNull : function () {
            // 取引先id=0をNullに置き換える
            if (this.dSearch.m_customer_id == 0) {
                this.dSearch.m_customer_id = null ;
            }
        } ,
    } ,
    created : function () {
        if (this.mainStore.isAppReady) {
            // ログインユーザーと拠点
            this.dSearch.m_user_id   = this.mainStore.loginMUser.id ;
            this.dSearch.m_branch_id = this.mainStore.loginMUser.m_branch_id ;

            // 締情報を表示
            this.searchSummary() ;
        }
    } ,
    watch : {
        dSearch : {
            handler : function(newVal, oldVal) {
                // オブジェクト内の値が変更された場合もボタンを押せなくする
                this.dIsSearchChange = true ;
            },
            // ネストされたオブジェクトも監視
            deep : true ,
        } ,
    }
}
</script>

<style scoped>
    /* 結果行(複数の取引先名を1行で表示してるので長い名称時に省略記号を表記) */
    td {
        text-overflow: ellipsis;    /* 長い文字列を省略して末尾に三点リーダー[...]を表示 下記プロパティ[width, overflow, white-space]は必須 */
        max-width: 400px;           /* (min,max)widthプロパティを設定 */
        overflow: hidden;           /* overflowプロパティをvisible 以外に設定 */
        white-space: nowrap;        /* white-spaceプロパティをnowrapに設定 */
    }

    /* 明細：幅固定 */ 
    table[class~="summary"] th:nth-child(-n+2) {
        width: 40px;
    }
    table[class~="list"] th:nth-child(-n+2) {
        width: 40px;
    }
    table[class~="list"] th:nth-child(n+2):nth-child(-n+5) {
        width: 120px;
    }

    /* 明細：右揃え */ 
    table[class~="summary"] th:nth-of-type(2), 
    table[class~="summary"] td:nth-of-type(2),
    table[class~="list"] th:nth-of-type(3), 
    table[class~="list"] td:nth-of-type(3) {
        text-align: right;
    }

    /* メッセージ表示用 */
    .validation-info {
        white-space:pre-wrap;
        word-wrap:break-word;
    }
</style>
