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
                                <label for="id_from">仕入No.</label>
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
                                <label>仕入日</label>
                                <ex-v-date-picker v-model="dSearch.purchase_date_from" :is-day-only=false />
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
                                <ex-v-date-picker v-model="dSearch.purchase_date_to" :is-day-only=false />
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
                                <label>発注先</label>
                                <m-customer-ref-input
                                    v-model="dSearch.supplier_m_customer_id"
                                    :m-branch-id="dSearch.m_branch_id"
                                    :dealing-cds="[2,4]"
                                />
                            </div>
                        </div>
                    </div>

                    <div class="row ml-0">
                        <div class="col col-xl-5 pl-0">
                            <div class="form-group">
                                <label for="material_name">材料名</label>
                                <input class="form-control" id="material_name" v-model="dSearch.t_p_invoice_detail.material_name">
                            </div>
                        </div>
                        <div class="col col-xl-7 pl-0">
                            <div class="form-group">
                                <label for="slip_memo">備考</label>
                                <input class="form-control" id="slip_memo" v-model="dSearch.t_p_invoice_detail.slip_memo">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-xl-2">
                    <div class="row ml-0">
                        <div class="col col-xl-12 pl-0">
                            <div class="form-group">
                                <label>カテゴリ</label>
                                <m-kv-select
                                    v-model="dSearch.t_p_invoice_detail.m_material_detail.m_material.category_m_kv_id"
                                    :selected-item.sync="dSelectedCategoryMkv"
                                    :kv-key="'m_materials-category_m_kv_id'"
                                />
                            </div>
                        </div>

                        <div class="col col-xl-12 pl-0">
                            <div class="form-group">
                                <label>サブカテゴリ</label>
                                <m-kv-select
                                    v-model="dSearch.t_p_invoice_detail.m_material_detail.m_material.sub_category_m_kv_id"
                                    :kv-category-id="cTargetCategoryId"
                                />
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
                    </div>
                </div>
            </div>
        </div>

        <div class="form-group border-top">
            <table class="table table-striped table-dark table-hover">
                <thead>
                    <tr class="text-nowrap" @click="sort">
                        <th                  scope="col" class="w-button">Actions</th>
                        <th                  scope="col" id="id"            :class="setStyleSort('id')"                                                  >仕入No.</th>
                        <th                  scope="col" id="purchase_date" :class="setStyleSort('purchase_date')"                                       >仕入日</th>
                        <th                  scope="col" id="kana"          :class="setStyleSort('kana')"                                                >仕入先</th>
                        <th                  scope="col" id="cnt"           :class="setStyleSort('cnt')"           class="d-none d-lg-table-cell w-short">件数</th>
                        <th                  scope="col"                                                                                                 >材料名</th>
                        <th                  scope="col"                                                                                                 >幅</th>
                        <th                  scope="col"                                                                                                 >流れ</th>
                        <th v-if="cIsDetail" scope="col"                                                           class="d-none d-lg-table-cell w-short">数量</th>
                        <th v-if="cIsDetail" scope="col"                                                           class="d-none d-lg-table-cell w-short">単価</th>
                        <th                  scope="col" id="total_price"   :class="setStyleSort('total_price')"   class="d-none d-lg-table-cell w-short">金額</th>
                        <th v-if="cIsDetail" scope="col"                                                           class="d-none d-lg-table-cell"        >備考</th>
                        <th                  scope="col"                                                           class="d-none d-lg-table-cell w-button">削除</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="n in cTPInvoices" :key="n.id">
                        <td>
                            <router-link :to='"edit/" + n.id' append>
                                <button type="button" class="btn btn-success">
                                    <i class="fas fa-edit fa-fw" />
                                </button>
                            </router-link>
                        </td>

                        <td class="text-nowrap">{{ n.id }}</td>
                        <td class="text-nowrap">{{ cDateFormat(n.purchase_date) }}</td>
                        <td>{{ n.m_customers_name }}</td>
                        <td class="text-nowrap d-none d-lg-table-cell">{{ n.cnt }}</td>

                        <td>
                            <div v-if="cIsDetailShow(n.cnt)">
                                <details :open="cIsOpen(n.is_open)">
                                    <summary @click.prevent="n.is_open = !n.is_open">詳細...</summary>
                                    <div style="white-space:pre-line">{{ cDetailsMaterialName(n.t_p_invoice_details) }}</div>
                                </details>
                            </div>
                            <div v-else>
                                <div style="white-space:pre-line">{{ cDetailsMaterialName(n.t_p_invoice_details) }}</div>
                            </div>
                        </td>
                        <td class="text-nowrap">
                            <div v-if="cIsDetailShow(n.cnt)">
                                <details :open="cIsOpen(n.is_open)">
                                    <summary @click.prevent="n.is_open = !n.is_open">詳細...</summary>
                                    <div style="white-space:pre-line">{{ cDetailsMaterialSizeX(n.t_p_invoice_details) }}</div>
                                </details>
                            </div>
                            <div v-else>
                                <div style="white-space:pre-line">{{ cDetailsMaterialSizeX(n.t_p_invoice_details) }}</div>
                            </div>
                        </td>
                        <td class="text-nowrap">
                            <div v-if="cIsDetailShow(n.cnt)">
                                <details :open="cIsOpen(n.is_open)">
                                    <summary @click.prevent="n.is_open = !n.is_open">詳細...</summary>
                                    <div style="white-space:pre-line">{{ cDetailsMaterialSizeY(n.t_p_invoice_details) }}</div>
                                </details>
                            </div>
                            <div v-else>
                                <div style="white-space:pre-line">{{ cDetailsMaterialSizeY(n.t_p_invoice_details) }}</div>
                            </div>
                        </td>

                        <td v-if="cIsDetail" class="d-none d-lg-table-cell">
                            <div v-if="cIsDetailShow(n.cnt)">
                                <details :open="cIsOpen(n.is_open)">
                                    <summary @click.prevent="n.is_open = !n.is_open">詳細...</summary>
                                    <div style="white-space:pre-line">{{ cDetailsQty(n.t_p_invoice_details) }}</div>
                                </details>
                            </div>
                            <div v-else>
                                <div style="white-space:pre-line">{{ cDetailsQty(n.t_p_invoice_details) }}</div>
                            </div>
                        </td>

                        <td v-if="cIsDetail" class="d-none d-lg-table-cell">
                            <div v-if="cIsDetailShow(n.cnt)">
                                <details :open="cIsOpen(n.is_open)">
                                    <summary @click.prevent="n.is_open = !n.is_open">詳細...</summary>
                                    <div style="white-space:pre-line">{{ cDetailsPrice(n.t_p_invoice_details) }}</div>
                                </details>
                            </div>
                            <div v-else>
                                <div style="white-space:pre-line">{{ cDetailsPrice(n.t_p_invoice_details) }}</div>
                            </div>
                        </td>

                        <td class="text-nowrap d-none d-lg-table-cell">
                            <div v-if="cIsDetailShow(n.cnt)">
                                <details :open="cIsOpen(n.is_open)">
                                    <summary @click.prevent="n.is_open = !n.is_open">合計 {{ cToNumber(n.total_price) }}</summary>
                                    <div style="white-space:pre-line">{{ cDetailsTotalPrice(n.t_p_invoice_details) }}</div>
                                </details>
                            </div>
                            <div v-else>
                                <div style="white-space:pre-line">{{ cDetailsTotalPrice(n.t_p_invoice_details) }}</div>
                            </div>
                        </td>

                        <td v-if="cIsDetail" class="d-none d-lg-table-cell w-maxwidth text-nowrap">
                            <div v-if="cIsDetailShow(n.cnt)">
                                <details :open="cIsOpen(n.is_open)">
                                    <summary @click.prevent="n.is_open = !n.is_open">詳細...</summary>
                                    <div style="white-space:pre-line">{{ cDetailsSlipMemo(n.t_p_invoice_details) }}</div>
                                </details>
                            </div>
                            <div v-else>
                                <div style="white-space:pre-line">{{ cDetailsSlipMemo(n.t_p_invoice_details) }}</div>
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
import PageMixins from '@mixins/commons/PageMixins' ;
import { SessionStorage } from "@frameworks/SessionStorageUtil" ;

export default {
    mixins : [PageMixins] ,
    data : function () {
        return {
            dRows : [] ,
            dApiName : "tPInvoice",
            dPagination : {                         // pagination
                links : [] ,                        // リンク
                total : -1 ,                        // 合計件数
                from : -1 ,                         // 現在ページの開始位置
                to : -1 ,                           // 現在ページの終了位置
            } ,
            dSearch : {
                id_from : "",                           // 仕入Id(From)
                id_to : "",                             // 仕入Id(To)
                purchase_date_from : null,              // 仕入日(From)
                purchase_date_to : null,                // 仕入日(To)
                m_branch_id : 0,                        // ログイン担当者の拠点id
                supplier_m_customer_id : 0,             // 仕入先

                t_p_invoice_detail : {
                    material_name : "",                 // 材料名
                    slip_memo : "",                     // 用途・説明

                    m_material_detail : {
                        m_material : {
                            category_m_kv_id : 0,       // カテゴリ
                            sub_category_m_kv_id : 0,   // サブカテゴリ
                        } ,
                    } ,
                } ,

                sort : "" ,                             // ソート項目
            } ,
            dSelectedCategoryMkv : {} ,     // 選択されたカテゴリ
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
        cTPInvoices : function () {
            return this.dRows ;
        } ,
        cTargetCategoryId : function () {
            // 選択されているカテゴリの対象カテゴリidを取得
            return this.dSelectedCategoryMkv?.target_m_kv_category_id ?? 0 ;
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
        //サイズ用 0は空文字 0以外はcToNumberと同じ
        cZero2Null : function() {
            return function(val) {
                if( val == 0 ) return "" ;
                return NumberUtil.formatZeroSuppress(val) ;
            }
        } ,
        cIsDetailShow : function() {
            return function (count) {
                return count > 10 ;
            } ;
        } ,
        cDetailsMaterialName : function() {
            return function (details) {
                const info = details.map(item => item.material_name) ;
                return info.join('\n') ;
            } ;
        } ,
        cDetailsMaterialSizeX : function() {
            return function (details) {
                const info = details.map(item => this.cZero2Null(item.material_size_x)) ;
                return info.join('\n') ;
            } ;
        } ,
        cDetailsMaterialSizeY : function() {
            return function (details) {
                const info = details.map(item => this.cZero2Null(item.material_size_y)) ;
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
    } ,
    methods : {
        destroy : async function (id) {
            // 削除時の事前チェック
            if (!(await this.isDeleteValidation(id))) return ;
            // 削除確認メッセージ
            if (!confirm('仕入伝票No.[' + id + '] を削除します\n削除してもよろしいですか?')) return ;

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
                    // 検収済みの場合はメッセージを表示して削除しない
                    alert('仕入伝票No.[' + id + '] \n仕入締処理済みの為削除できません\n再検索を行い最新の状態を表示してください') ;
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
        deletedRowDetail : function (t_p_invoice_id) {
            // 削除した行を非表示にするロジック
            const result = this.dRows.filter((data) => {
                return (data.id != t_p_invoice_id) ;
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

                // 詳細が開いてるかどうかの項目を付け足す
                for (const n of res.data.data) {
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
        } ,
        initSearchKey : function () {
            // 検索項目の初期化
            this.dSearch = {
                id_from : "",                                           // 仕入Id(From)
                id_to : "",                                             // 仕入Id(To)
                purchase_date_from : null,                              // 仕入日(From)
                purchase_date_to : null,                                // 仕入日(To)
                m_branch_id : this.mainStore.loginMUser.m_branch_id,    // ログイン担当者の拠点id
                supplier_m_customer_id : 0,                             // 仕入先

                t_p_invoice_detail : {
                    material_name : "",                                 // 材料名
                    slip_memo : "",                                     // 用途・説明

                    m_material_detail : {
                        m_material : {
                            category_m_kv_id : 0,                       // カテゴリ
                            sub_category_m_kv_id : 0,                   // サブカテゴリ
                        } ,
                    } ,
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
    th:nth-child(n+5):nth-child(-n+5),
    td:nth-child(n+5):nth-child(-n+5),
    th:nth-child(n+7):nth-child(-n+11),
    td:nth-child(n+7):nth-child(-n+11) {
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
