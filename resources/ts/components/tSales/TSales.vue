<template>
    <div>
        <div class="form-group">
            <div class="row mb-2">
                <contents-header-left></contents-header-left>
                <contents-header-right>
                    <div class="flex-column pt-2">
                        <router-link to='add' title="" append>
                            <button type="button" class="btn btn-primary">
                                <i class="fas fa-plus fa-fw" />
                                新規作成
                            </button>
                        </router-link>
                    </div>
                </contents-header-right>
            </div>

            <div class="row">
                <div class="col">
                    <div v-if="$$cIsError" class="mt-1 mb-0 alert alert-danger" role="alert">
                        {{ dErrorData.message }}
                    </div>

                    <div v-if="dInfoMessage" class="mt-1 mb-0 alert alert-success" role="alert">
                        {{ dInfoMessage }}
                    </div>
                </div>
            </div>
        </div>

        <div class="form-group border-top">
            <div class="row">
                <div class="col form-group" />
            </div>

            <div class="row">
                <div class="col-12 col-xl-3">
                    <div class="row ml-0">
                        <div class="col pl-0">
                            <div class="form-group">
                                <label for="id_from">売上No.</label>
                                <input class="form-control" id="id_from" v-model="dSearch.id_from" />
                            </div>
                        </div>
                        <div class="col-1 pl-0">
                            <div class="form-group">
                                <p>&emsp;</p>
                                <p class="text-center">～</p>
                            </div>
                        </div>
                        <div class="col pl-0">
                            <div class="form-group">
                                <label>&emsp;</label>
                                <input class="form-control" v-model="dSearch.id_to" />
                            </div>
                        </div>
                    </div>

                    <div class="row ml-0">
                        <div class="col pl-0">
                            <div class="form-group">
                                <label>売上日</label>
                                <ex-v-date-picker v-model="dSearch.shipped_at_from" :is-day-only=false />
                            </div>
                        </div>
                        <div class="col-1 pl-0">
                            <div class="form-group">
                                <p>&emsp;</p>
                                <p class="text-center">～</p>
                            </div>
                        </div>
                        <div class="col pl-0">
                            <div class="form-group">
                                <label>&emsp;</label>
                                <ex-v-date-picker v-model="dSearch.shipped_at_to" :is-day-only=false />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-xl-6">
                    <div class="row ml-0">
                        <div class="col col-xl-5 pl-0">
                            <div class="form-group">
                                <label>拠点</label>
                                <m-branch-select
                                    v-model="dSearch.m_branch_id"
                                />
                            </div>
                        </div>
                        <div class="col col-xl-7 pl-0">
                            <div class="form-group">
                                <label>取引先</label>
                                <m-customer-ref-input
                                    v-model="dSearch.m_customer_id"
                                    :m-branch-id="dSearch.m_branch_id"
                                    :dealing-cds="[1]"
                                />
                            </div>
                        </div>
                    </div>

                    <div class="row ml-0">
                        <div class="col col-xl-5 pl-0">
                            <div class="form-group">
                                <label for="product_name">物件名・品名</label>
                                <input class="form-control" id="product_name" v-model="dSearch.t_sale_detail.product_name">
                            </div>
                        </div>
                        <div class="col col-xl-7 pl-0">
                            <div class="form-group">
                                <label for="memo">備考</label>
                                <input class="form-control" id="memo" v-model="dSearch.t_sale_detail.slip_memo">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="form-group">
            <div class="row">
                <div class="col-7">
                    <pagination
                        :p-pagination.sync="dPagination"
                        @search="search($event)"
                    />
                </div>

                <div class="col-5">
                    <div class="float-right">
                        <label>表示</label>
                        <div
                            class="btn-group btn-group-toggle mx-2" >
                            <label class="btn btn-dark"
                                :class="{active : dViewMode == 'simple' }"
                                data-toggle="tooltip" data-placement="simple" title="簡易表示" >
                                <input type="radio" v-model="dViewMode" name="view-mode" value="simple">
                                <i class="fas fa-bars fa-fw" />
                            </label>
                            <label class="btn btn-dark"
                                :class="{active : dViewMode == 'detail' }"
                                data-toggle="tooltip" data-placement="top" title="明細表示" >
                                <input type="radio" v-model="dViewMode" name="view-modes" value="detail">
                                <i class="fas fa-list fa-fw" />
                            </label>
                            <label class="btn btn-dark"
                                :class="{active : dViewMode == 'all' }"
                                data-toggle="tooltip" data-placement="all" title="展開して表示" >
                                <input type="radio" v-model="dViewMode" name="view-mode" value="all">
                                <i class="fas fa-sort-amount-down" />
                            </label>
                        </div>

                        <button type="submit" class="btn btn-success" @click.prevent="search()" :disabled="dLoading">
                            <div v-if="dLoading">
                                <span class="spinner-border spinner-border-sm" role="status" />
                                検索
                            </div>
                            <div v-else>
                                <i class="fas fa-search fa-fw" />
                                検索
                            </div>
                        </button>
                        <button type="submit" class="btn btn-secondary" @click.prevent="clear()">
                            <i class="fas fa-eraser" />
                            クリア
                        </button>
                        <button type="submit" class="btn btn-primary" @click.prevent="deliveryNote()" :disabled="cIsButtonDisabled">
                            <div v-if="dLoadingDeliveryNote">
                                <span class="spinner-border spinner-border-sm" role="status" />
                                納品書
                            </div>
                            <div v-else>
                                <i class="fas fa-file-alt" />
                                納品書
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="form-group border-top">
            <table class="table table-striped table-dark table-hover">
                <thead>
                    <tr class="text-nowrap" @click="sort">
                        <th                  scope="col" class="w-button"><input type="checkbox" v-model="cSelectAll"/> 選択</th>
                        <th                  scope="col" class="w-button">Actions</th>
                        <th                  scope="col" id="id"          :class="setStyleSort('id')"                                                >売上No.</th>
                        <th                  scope="col" id="shipped_at"  :class="setStyleSort('shipped_at')"                                        >売上日</th>
                        <th                  scope="col" id="kana"        :class="setStyleSort('kana')"                                              >取引先</th>
                        <th                  scope="col" id="cnt"         :class="setStyleSort('cnt')"         class="d-none d-lg-table-cell w-short">件数</th>
                        <th                  scope="col"                                                                                             >物件名・品名</th>
                        <th v-if="cIsDetail" scope="col"                                                       class="d-none d-lg-table-cell w-short">物件CD</th>
                        <th v-if="cIsDetail" scope="col"                                                       class="d-none d-lg-table-cell w-short">数量</th>
                        <th v-if="cIsDetail" scope="col"                                                       class="d-none d-lg-table-cell w-short">単価</th>
                        <th                  scope="col" id="total_price" :class="setStyleSort('total_price')" class="d-none d-lg-table-cell w-short">金額</th>
                        <th v-if="cIsDetail" scope="col"                                                       class="d-none d-lg-table-cell"        >備考</th>
                        <th                  scope="col"                                                       class="d-none d-lg-table-cell w-button">削除</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="n in cTSales" :key="n.id">
                        <td>
                            <input
                                type="checkbox"
                                :value="n"
                                :id="n.id"
                                v-model="n.is"
                            >
                        </td>
                        <td>
                            <router-link :to='"edit/" + n.id' append>
                                <button type="button" class="btn btn-success">
                                    <i class="fas fa-edit fa-fw" />
                                </button>
                            </router-link>
                        </td>

                        <td class="text-nowrap">{{ n.id }}</td>
                        <td class="text-nowrap">{{ cDateFormat(n.shipped_at) }}</td>
                        <td>{{ n.m_customers_name }}</td>
                        <td class="text-nowrap d-none d-lg-table-cell">{{ n.cnt }}</td>

                        <td>
                            <div v-if="cIsDetailShow(n.cnt)">
                                <details :open="cIsOpen(n.is_open)">
                                    <summary @click.prevent="n.is_open = !n.is_open">詳細...</summary>
                                    <div style="white-space:pre-line">{{ cDetailsProductName(n.t_sale_details) }}</div>
                                </details>
                            </div>
                            <div v-else>
                                <div style="white-space:pre-line">{{ cDetailsProductName(n.t_sale_details) }}</div>
                            </div>
                        </td>
                        <td>
                            <div v-if="cIsDetailShow(n.cnt)">
                                <details :open="cIsOpen(n.is_open)">
                                    <summary @click.prevent="n.is_open = !n.is_open">詳細...</summary>
                                    <div style="white-space:pre-line">{{ cDetailsProjectCd(n.t_sale_details) }}</div>
                                </details>
                            </div>
                            <div v-else>
                                <div style="white-space:pre-line">{{ cDetailsProjectCd(n.t_sale_details) }}</div>
                            </div>
                        </td>

                        <td v-if="cIsDetail" class="d-none d-lg-table-cell">
                            <div v-if="cIsDetailShow(n.cnt)">
                                <details :open="cIsOpen(n.is_open)">
                                    <summary @click.prevent="n.is_open = !n.is_open">詳細...</summary>
                                    <div style="white-space:pre-line">{{ cDetailsQty(n.t_sale_details) }}</div>
                                </details>
                            </div>
                            <div v-else>
                                <div style="white-space:pre-line">{{ cDetailsQty(n.t_sale_details) }}</div>
                            </div>
                        </td>

                        <td v-if="cIsDetail" class="d-none d-lg-table-cell">
                            <div v-if="cIsDetailShow(n.cnt)">
                                <details :open="cIsOpen(n.is_open)">
                                    <summary @click.prevent="n.is_open = !n.is_open">詳細...</summary>
                                    <div style="white-space:pre-line">{{ cDetailsPrice(n.t_sale_details) }}</div>
                                </details>
                            </div>
                            <div v-else>
                                <div style="white-space:pre-line">{{ cDetailsPrice(n.t_sale_details) }}</div>
                            </div>
                        </td>

                        <td class="text-nowrap d-none d-lg-table-cell">
                            <div v-if="cIsDetailShow(n.cnt)">
                                <details :open="cIsOpen(n.is_open)">
                                    <summary @click.prevent="n.is_open = !n.is_open">合計 {{ cToNumber(n.total_price) }}</summary>
                                    <div style="white-space:pre-line">{{ cDetailsTotalPrice(n.t_sale_details) }}</div>
                                </details>
                            </div>
                            <div v-else>
                                <div style="white-space:pre-line">{{ cDetailsTotalPrice(n.t_sale_details) }}</div>
                            </div>
                        </td>

                        <td v-if="cIsDetail" class="d-none d-lg-table-cell w-maxwidth">
                            <div v-if="cIsDetailShow(n.cnt)">
                                <details :open="cIsOpen(n.is_open)">
                                    <summary @click.prevent="n.is_open = !n.is_open">詳細...</summary>
                                    <div style="white-space:pre-line">{{ cDetailsSlipMemo(n.t_sale_details) }}</div>
                                </details>
                            </div>
                            <div v-else>
                                <div style="white-space:pre-line">{{ cDetailsSlipMemo(n.t_sale_details) }}</div>
                            </div>
                        </td>

                        <td class="text-nowrap d-none d-lg-table-cell">
                            <button v-if="n.t_complete_id==0" type="button" class="btn btn-danger" @click.prevent="destroy(n.id)">
                                <i class="fas fa-trash fa-fw" />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import DayJsEx from "@frameworks/DayJsEx" ;
import NumberUtil from "@frameworks/NumberUtil" ;
import PageMixins from "@mixins/commons/PageMixins" ;
import { SessionStorage } from "@frameworks/SessionStorageUtil" ;

export default {
    mixins : [PageMixins] ,
    data : function () {
        return {
            dRows : [] ,
            dApiName : "tSale",
            dApiDeliveryName : "tSale/batchDeliveryNote",
            dPagination : {                 // pagination
                links : [] ,                // リンク
                total : -1 ,                // 合計件数
                from : -1 ,                 // 現在ページの開始位置
                to : -1 ,                   // 現在ページの終了位置
            } ,
            dSearch : {
                id_from : "",               // 売上Id(From)
                id_to : "",                 // 売上Id(To)
                shipped_at_from : null,     // 売上日(From)
                shipped_at_to : null,       // 売上日(To)
                m_branch_id : 0,            // ログイン担当者の拠点id
                m_customer_id : 0,          // 取引先

                t_sale_detail : {
                    product_name : "",      // 商品名
                    slip_memo : "",         // 備考
                } ,

                sort : "" ,                 // ソート項目
            } ,
            dViewMode : "detail",           // Viewモード
            dLoading : false,               // 検索ボタン読込中フラグ
            dLoadingDeliveryNote : false,   // 納品書ボタン読込中フラグ
            dInfoMessage : "",              // メッセージ
        }
    } ,
    computed : {
        cEndpoint : function () {
            return `api/${this.dApiName}` ;
        } ,
        cTSales : function () {
            return this.dRows ;
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
        cIsDetailShow : function() {
            return function (count) {
                return count > 10 ;
            } ;
        } ,
        cDetailsProductName : function() {
            return function (details) {
                const info = details.map(item => item.product_name) ;
                return info.join('\n') ;
            } ;
        } ,

        cDetailsProjectCd : function() {
            return function (details) {
                const info = details.map(item => {
                    return item.t_project_product_id ? '' : (item.t_project?.cd ?? '')
                } ) ;
                return info.join('\n') ;
            } ;
        } ,
        cDetailsQty : function() {
            return function (details) {
                const info = details.map(item => this.cToNumber(item.qty)) ;
                return info.join('\n') ;
            } ;
        } ,
        cDetailsPrice : function() {
            return function (details) {
                const info = details.map(item => this.cToNumber(item.price)) ;
                return info.join('\n') ;
            } ;
        } ,
        cDetailsTotalPrice : function() {
            return function (details) {
                const info = details.map(item => this.cToNumber(item.total_price)) ;
                return info.join('\n') ;
            } ;
        } ,
        cDetailsSlipMemo : function() {
            return function (details) {
                const info = details.map(item => item.slip_memo) ;
                return info.join('\n') ;
            } ;
        } ,
        cIsOpen : function() {
            return function (is_open) {
                // 各行のis_open変数・ViewModeにより展開して表示するかどうかをreturnする
                return (is_open || this.dViewMode == "all") ? 'open' : false ;
            } ;
        } ,
        cIsDetail : function() {
            // ViewModeにより表示の切り替えを行う
            return (this.dViewMode == "detail" || this.dViewMode == "all") ;
        } ,
        cSelectAll : {
            get : function () {
                // リスト内のcheck件数を算出
                const count = this.dRows.filter(item => item.is).length ;
                // リスト内のcheck件数と行数を比較[全てcheck：on 以外：off]
                return 0 < count && this.dRows.length == count ;
            } ,
            set : function (value) {
                // リスト内のcheckに対してOn/Offを切り替える
                this.dRows.map(item => item.is = value) ;
            }
        } ,
        cSelectSaleIds : function() {
            // 選択されてるidを戻す
            return this.dRows.filter(item => item.is).map(item => item.id) ;
        } ,
        cIsButtonDisabled : function () {
            const select = this.dRows.filter(item => item.is) ;
            // 納品書をダウンロード中か選択されてない場合は無効化
            return this.dLoadingDeliveryNote || select.length == 0 ;
        } ,
    } ,
    methods : {
        destroy : async function (id) {
            // 削除時の事前チェック
            if (!(await this.isDeleteValidation(id))) return ;
            // 削除確認メッセージ
            if (!confirm('売上伝票No.[' + id + '] を削除します\n削除してもよろしいですか?')) return ;

            try {
                const ep = this.cEndpoint + `/${id}` ;
                const res = await axios.delete(ep) ;

                // 削除した行を非表示にするロジック
                this.deletedRowDetail(id) ;
            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.cEndpoint) ;
            }
        } ,
        isDeleteValidation : async function (id) {
            try {
                const ep = this.cEndpoint + `/${id}` ;
                const res = await axios.get(ep) ;

                if (res.data.t_complete_id != 0) {
                    // 請求済みの場合はメッセージを表示して削除しない
                    alert('売上伝票No.[' + id + '] \n請求締処理済みの為削除できません\n再検索を行い最新の状態を表示してください') ;
                    return false;
                }

                // 削除OK
                return true ;
            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.cEndpointComplete) ;
                // エラー発生時は処理を行わない
                return false ;
            }
        } ,
        deliveryNote : async function () {
            if (!confirm('納品書を出力してもよろしいですか?\n１枚あたり所要時間：約２～３秒')) return ;
            this.dLoadingDeliveryNote = true ;

            // 納品書のURL
            const ep = `api/${this.dApiDeliveryName}` ;
            const params = JSON.parse(JSON.stringify({ m_users_id : this.mainStore.loginMUser.id, saleIds : this.cSelectSaleIds })) ;

            try {
                // 納品書発行
                const res  = await axios.post(ep, params, {responseType: 'blob'}) ;
                const text = await res.data.text();

                if (text == "None") {
                    // 該当する納品書がない場合
                    this.dInfoMessage = "該当する納品書がありませんでした" ;
                } else {
                    // 該当する納品書がある場合：Blob作成してzip形式でダウンロード
                    const blob = new Blob([res.data], {type : "application/zip"});
                    const link = document.createElement('a') ;

                    // Laravelからバイナリ(zip)をダウンロード
                    link.href = window.URL.createObjectURL(blob);
                    link.setAttribute('download', '納品書.zip') ;
                    link.click();
                    URL.revokeObjectURL(link.href) ;
                    this.dInfoMessage = "納品書を出力しました" ;
                }
            } catch (error) {
                // handle error
                this.$$errorConsole(error, ep) ;
            }

            this.dLoadingDeliveryNote = false ;
        } ,
        deletedRowDetail : function (sale_id) {
            // 削除した行を非表示にするロジック
            const result = this.dRows.filter((data) => {
                return (data.id != sale_id) ;
            });

            this.dRows = result ;
        } ,
        search : async function (url) {
            const ep = (url? url : this.cEndpoint + "/retrieve") ;
            const params = JSON.parse(JSON.stringify(this.dSearch)) ;

            try {
                this.dLoading = true ;

                // 検索処理
                const res = await axios.post(ep, params) ;

                // チェックボックス・詳細が開いてるかどうかの項目を付け足す
                for (const n of res.data.data) {
                    n.is = false
                    n.is_open = false
                }

                this.dRows             = res.data.data ;
                // pagination関連
                this.dPagination.links = res.data.links ;   // リンク
                this.dPagination.total = res.data.total ;   // 合計件数
                this.dPagination.from  = res.data.from ;    // 現在ページの開始位置
                this.dPagination.to    = res.data.to ;      // 現在ページの終了位置

                // 検索内容を保持
                new SessionStorage(this.dApiName).save(this.dSearch) ;

                this.dLoading = false ;
            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.cEndpoint) ;
            }
        } ,
        sort : function (event) {
            if (!event.target.id) return ;

            // クリックした列をソートキーに保存
            if (this.dSearch.sort == event.target.id) {
                this.dSearch.sort = event.target.id + " desc" ;
            } else {
                this.dSearch.sort = event.target.id ;
            }

            // 再検索
            if (this.dRows.length) this.search() ;
        } ,
        clear : function () {
            // 検索項目の初期化
            this.initSearchKey() ;
            // 検索状態をクリア
            new SessionStorage(this.dApiName).remove() ;
            // メッセージをクリア
            this.dInfoMessage = "" ;
        } ,
        initSearchKey : function () {
            // 検索項目の初期化
            this.dSearch = {
                id_from : "",                                        // 売上Id(From)
                id_to : "",                                          // 売上Id(To)
                shipped_at_from : null,                              // 売上日(From)
                shipped_at_to : null,                                // 売上日(To)
                m_branch_id : this.mainStore.loginMUser.m_branch_id, // ログイン担当者の拠点id
                m_customer_id : 0,                                   // 取引先

                t_sale_detail : {
                    product_name : "",  // 商品名
                    slip_memo : "",     // 備考
                } ,
            } ;
        } ,
        setSessionStorage : function () {
            const storage = new SessionStorage(this.dApiName) ;
            if (!storage.isEmpty()) {
                try {
                    // 保持した検索キーを設定
                    this.dSearch = storage.getData() ;
                } catch (e) {
                    storage.remove() ;
                }
            }
        } ,
        setStyleSort : function (key) {
            // ソートされた項目のStyle設定
            return {
                sort_asc : this.dSearch.sort == key ,
                sort_desc: this.dSearch.sort == key + " desc" ,
            } ;
        } ,
    } ,
    created : function () {
        if (this.mainStore.isAppReady) {
            // ログインユーザーの拠点
            this.dSearch.m_branch_id = this.mainStore.loginMUser.m_branch_id ;

            // 保持した検索キーを設定
            this.setSessionStorage() ;
        }
    } ,
}
</script>

<style scoped>
    /* 明細：右揃え */
    th:nth-child(n+6):nth-child(-n+6),
    td:nth-child(n+6):nth-child(-n+6),
    th:nth-child(n+8):nth-child(-n+10),
    td:nth-child(n+8):nth-child(-n+10) {
        text-align: right;
    }

    .w-short {
        width: 80px;
    }

    .w-button {
        width: 50px;
    }

    .w-maxwidth {
        max-width: 200px;
    }
</style>
