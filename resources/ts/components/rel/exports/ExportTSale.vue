<template>
    <validation-observer v-slot="{ invalid }">
        <div class="row">
            <div class="col">
                <div class="form-group">
                    <div class="row">
                        <contents-header-left></contents-header-left>
                        <contents-header-right></contents-header-right>
                    </div>

                    <div class="row">
                        <div class="col">
                            <div v-if="$$cIsError" class="mt-1 mb-0 alert alert-danger" role="alert">
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
                            <div class="col-12 pl-xl-0">
                                <div class="row ml-0">
                                    <div class="col px-0">
                                        <div class="form-group">
                                            <label for="id_min">売上No.</label>
                                            <input class="form-control" id="id_min" v-model="cIdMin" />
                                        </div>
                                    </div>
                                    <div class="col-1 px-0">
                                        <div class="form-group">
                                            <p>&emsp;</p>
                                            <p class="text-center">～</p>
                                        </div>
                                    </div>
                                    <div class="col pl-0">
                                        <div class="form-group">
                                            <label>&emsp;</label>
                                            <input class="form-control" id="id_max" v-model="dSearch.id_max" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row mx-1">
                            <div class="col-12 col-xl-4 pl-xl-0">
                                <validation-provider name="締日" rules="between:0,99" v-slot="{ errors }">
                                    <div class="form-group">
                                        <label for="closing_date">締日</label>
                                        <ns-number-input 
                                            id="closing_date"
                                            v-model="dSearch.closing_date"
                                            min="0"
                                            max="99"
                                            :nullable=true
                                        />
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </div>
                                </validation-provider>
                            </div>
                        </div>

                        <div class="row mx-1">
                            <div class="col-12 pl-xl-0">
                                <div class="row ml-0">
                                    <div class="col px-0">
                                        <validation-provider name="開始日" rules="" vid="my_custom_rule_day_min" v-slot="{ errors }">
                                            <div class="form-group">
                                                <label>売上日</label>
                                                <ex-v-date-picker v-model="cDayMin" />
                                                <span class="validation-error">{{ errors[0] }}</span>
                                            </div>
                                        </validation-provider>
                                    </div>
                                    <div class="col px-0">
                                        <div class="form-group">
                                            <p>&emsp;</p>
                                            <p class="text-center">～</p>
                                        </div>
                                    </div>
                                    <div class="col pl-0">
                                        <validation-provider name="終了日" rules="custom_rule_date_or_later:my_custom_rule_day_min" v-slot="{ errors }">
                                            <div class="form-group">
                                                <label>&emsp;</label>
                                                <ex-v-date-picker v-model="dSearch.day_max" />
                                                <span class="validation-error pb-0" style="height:auto;">{{ errors[0] }}</span>
                                                <span class="validation-info">{{ cExportDayInfoMessage }}</span>
                                            </div>
                                        </validation-provider>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row mx-1">
                            <div class="col-12 pl-xl-0">
                                <div class="form-group">
                                    <ns-checkbox-input
                                        v-model="cIsOutput"
                                        id="is_output"
                                        label="出力済みを対象"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="row form-group" />

                        <div class="row mx-1">
                            <div class="col-12 pl-xl-0">
                                <div>
                                    <button type="submit" class="btn btn-success" @click.prevent="search()" :disabled="invalid || dLoadingCheck">
                                        <div v-if="dLoadingCheck">
                                            <span class="spinner-border spinner-border-sm" role="status" />
                                            検索
                                        </div>
                                        <div v-else>
                                            <i class="fas fa-search fa-fw" />
                                            検索
                                        </div>
                                    </button>
                                    <button type="submit" class="btn btn-primary" @click.prevent="runExport()" :disabled="invalid || dLoadingExport">
                                        <div v-if="dLoadingExport">
                                        <span class="spinner-border spinner-border-sm" role="status" />
                                            出力
                                        </div>
                                        <div v-else>
                                            <i class="fas fa-database" />
                                            出力
                                        </div>
                                    </button>
                                    <button type="submit" class="btn btn-light" @click.prevent="historyBack()">戻る</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-12 col-lg-9">
                        <div class="row mx-1">
                            【売上情報】
                            <div class="col-12 py-2 pl-xl-0">
                                <pagination
                                    :p-pagination.sync="dPagination"
                                    @search="search($event)"
                                />
                            </div>

                            <div class="col-12 pl-xl-0">
                                <table class="table table-striped table-dark table-hover list">
                                    <thead>
                                        <tr class="text-nowrap">
                                            <th scope="col">売上No.</th>
                                            <th scope="col">売上日</th>
                                            <th scope="col">コード</th>
                                            <th scope="col">取引先名</th>
                                            <th scope="col" class="d-none d-lg-table-cell">物件コード</th>
                                            <th scope="col">物件名・品名</th>
                                            <th scope="col" class="d-none d-lg-table-cell">数量</th>
                                            <th scope="col" class="d-none d-lg-table-cell">単価</th>
                                            <th scope="col">金額</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr v-for="n in dRows" :key="n.detail_id">
                                            <td class="text-nowrap">{{ n.id + "-" + n.detail_id }}</td>
                                            <td class="text-nowrap">{{ cDateFormat(n.shipped_at) }}</td>
                                            <td class="text-nowrap">{{ n.data_linkage_cd }}</td>
                                            <td class="text-truncate clamp">{{ n.customer_name }}</td>
                                            <td class="text-nowrap d-none d-lg-table-cell">{{ n.slip_memo }}</td>
                                            <td class="text-truncate clamp">{{ n.product_name }}</td>
                                            <td class="text-nowrap d-none d-lg-table-cell">{{ cToNumber(n.qty) }}</td>
                                            <td class="text-nowrap d-none d-lg-table-cell">{{ cToNumber(n.price) }}</td>
                                            <td class="text-nowrap">{{ cToNumber(n.total_price) }}</td>
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

export default {
    mixins : [PageMixins] , 
    data : function () {
        return {
            dApiName : "ExportTSale",
            dRows : {                               // 結果データ
            } ,
            dPagination : {                         // pagination
                links : [] ,                        // リンク
                total : -1 ,                        // 合計件数
                from : -1 ,                         // 現在ページの開始位置
                to : -1 ,                           // 現在ページの終了位置
            } ,
            dSearch : {                             // 画面上の検索項目
                m_branch_id : 0 ,                   // 拠点(ログインユーザーの拠点)
                m_customer_id : 0 ,                 // 取引先id
                closing_date : null ,               // 締日：必須→省略可に変更したのでデフォルト0→nullに変更
                id_min : "" ,                       // 売上Id(Min)
                id_max : "" ,                       // 売上Id(Max)
                day_min : null ,                    // 処理日(Min)
                day_max : null ,                    // 処理日(Max)
                is_output : 0 ,                     // 出力済みを対象(0:未出力 1:出力済み)
            } ,
            dCanBeInputCustomer : false ,           // 取引先の入力可否判定用(true:入力可能 false:入力不可)
            dLoadingCheck : false ,                 // 非同期apiでの読込中フラグ(確認)
            dLoadingExport : false ,                // 非同期apiでの読込中フラグ(出力)
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
                message = "ログイン担当者と拠点が異なります" ;
            }

            return message ;
        } ,
        cExportDayInfoMessage : function () {
            // 締日と処理日の妥当性チェックを行い アラートメッセージが有れば情報を出力する
            let message = "" ;

            if (this.dSearch.day_max) {
                // DayJsオブジェクト作成(時間カット)
                const complete_day = DayJs(this.dSearch.day_max) ;
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
                return NumberUtil.formatZeroSuppress(val) ;
            } ;
        } ,
        cDayMin : {
            get : function () {
                return this.dSearch.day_min ;
            } ,
            set : function (value) {
                // 終了日は開始日の1ヶ月先の前日
                this.dSearch.day_min = value ;
                this.dSearch.day_max = DayJs(value).add(1, 'M').subtract(1, 'd').format('YYYY-MM-DD') ;
            } ,
        } ,
        cIdMin : {
            get : function () {
                return this.dSearch.id_min ;
            } ,
            set : function (value) {
                // Id(Min-Max)はデフォルト同じ値にしとく
                this.dSearch.id_min = value ;
                this.dSearch.id_max = value ;
            } ,
        } ,
        cIsOutput : {
            get : function () {
                return this.dSearch.is_output ;
            } ,
            set : function (value) {
                // ReActiveとCast
                // NsCheckboxInput.value[bool: true/false] <-> dSearch.is_output[int: 1/0]
                this.dSearch.is_output = (value ? 1 : 0) ;
            } ,
        } ,
    } ,
    methods : {
        search : async function (url) {
            this.dLoadingCheck = true ;
            // 取引先id=0をNullに置き換える
            this.ifCustomerIdZeroToNull() ;

            const ep = (url? url : this.cEndpoint + "/retrieve") ;
            const params = JSON.parse(JSON.stringify(this.dSearch)) ; 

            try {
                // 検索
                const res    = await axios.post(ep, params) ;
                this.dRows   = res.data.data ;

                // pagination関連
                this.dPagination.links = res.data.links ;   // リンク
                this.dPagination.total = res.data.total ;   // 合計件数
                this.dPagination.from  = res.data.from ;    // 現在ページの開始位置
                this.dPagination.to    = res.data.to ;      // 現在ページの終了位置
            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.cEndpoint) ;
            }
            
            this.dLoadingCheck = false ;
        } ,
        runExport : async function () {
            if (!confirm('売上データを出力してもよろしいですか?')) return ;
            this.dLoadingExport = true ;
            // 取引先id=0をNullに置き換える
            this.ifCustomerIdZeroToNull();

            // 出力
            const ep = this.cEndpoint + "/export" ;
            const params = JSON.parse(JSON.stringify(this.dSearch)) ; 

            try {
                // exportデータを取得
                const res = await axios.post(ep, params, {responseType: 'blob'}) ;

                // LaravelからCSVをダウンロード
                const blob = new Blob([res.data], {type : "text/csv"});
                const link = document.createElement('a') ;

                link.href = window.URL.createObjectURL(blob);
                const now = DayJsEx.format(new Date(), "YYYYMMDD_HHmmss");
                link.setAttribute('download', `export_sales_${now}.csv`) ;
                link.click();
                URL.revokeObjectURL(link.href) ;

            } catch (error) {
                // handle error
                this.$$errorConsole(error, ep) ;
            }
            
            this.dLoadingExport = false ;
        } ,
        historyBack : function () {
            this.$router.push({ name : "rel_menu" }) ;
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
            // 拠点
            this.dSearch.m_branch_id = this.mainStore.loginMUser.m_branch_id ;
        }
    } 
}
</script>

<style scoped>
    /* 明細：幅固定 */ 
    table[class~="list"] th:nth-of-type(3),
    table[class~="list"] th:nth-of-type(7) {
        width: 60px;
    }

    table[class~="list"] th:nth-of-type(1),
    table[class~="list"] th:nth-of-type(2),
    table[class~="list"] th:nth-of-type(5),
    table[class~="list"] th:nth-of-type(8),
    table[class~="list"] th:nth-of-type(9) {
        width: 80px;
    }

    /* 明細：右揃え */ 
    table[class~="list"] th:nth-child(n+7):nth-child(-n+9), 
    table[class~="list"] td:nth-child(n+7):nth-child(-n+9) {
        text-align: right;
    }

    /* クランプ表示用 */
    .clamp {
        max-width: 200px; /* クランプ使用時に(min,max)widthプロパティを設定 */
    }

    /* クランプ解除用 */
    .clamp:hover {
        white-space: normal;
    }

    /* メッセージ表示用 */
    .validation-info {
        white-space:pre-wrap;
        word-wrap:break-word;
    }

</style>
