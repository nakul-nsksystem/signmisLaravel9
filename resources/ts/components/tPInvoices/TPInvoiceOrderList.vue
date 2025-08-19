<template>
    <!-- Modalフォーム -->
    <div class="modal fade" id="modalOrder" tabindex="-1" role="dialog" style="margin-top: 0px;">
        <div class="modal-dialog modal-dialog-fluid" role="document">
            <div class="app-modal-content-dark">
                <div class="modal-header pb-1">
                    発注検索
                    <button type="button" class="close" data-dismiss="modal">
                        <span aria-hidden="true" class="text-white">&times;</span>
                    </button>
                </div>

                <div class="modal-body pb-0">
                    <div class="pt-3 border-top">

                        <div class="row">
                            <div class="col-12 col-xl-4">
                                <div class="row ml-0">
                                    <div class="col pl-0 pl-sm-2">
                                        <div class="form-group">
                                            <label for="order_id_from">発注No.</label>
                                            <input class="form-control" id="order_id_from" v-model="dSearch.order_id_from" />
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
                                            <input class="form-control" v-model="dSearch.order_id_to" />
                                        </div>
                                    </div>
                                </div>

                                <div class="row ml-0">
                                    <div class="col pl-0 pl-sm-2">
                                        <div class="form-group">
                                            <label>仕入予定日</label>
                                            <ex-v-date-picker v-model="dSearch.due_date_from" :is-day-only=false />
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
                                            <ex-v-date-picker v-model="dSearch.due_date_to" :is-day-only=false />
                                        </div>
                                    </div>
                                </div>

                                <div class="row ml-0">
                                    <div class="col pl-0 pl-sm-2">
                                        <div class="form-group">
                                            <label for="material_name">材料名</label>
                                            <input class="form-control" id="material_name" v-model="dSearch.material_name">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12 col-xl-1"/>

                            <div class="col-12 col-xl-6">
                                <div class="row ml-0">
                                    <div class="col-12 col-xl-6 pl-0 pl-sm-2">
                                        <div class="form-group">
                                            <label>カテゴリ</label>
                                            <m-kv-select
                                                v-model="dSearch.m_material_detail.m_material.category_m_kv_id"
                                                :selected-item.sync="dSelectedCategoryMkv"
                                                :kv-key="'m_materials-category_m_kv_id'"
                                            />
                                        </div>
                                    </div>
                                    <div class="col-12 col-xl-6 pl-0 pl-sm-2">
                                        <div class="form-group">
                                            <label>サブカテゴリ</label>
                                            <m-kv-select
                                                v-model="dSearch.m_material_detail.m_material.sub_category_m_kv_id"
                                                :kv-category-id="cTargetCategoryId"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div class="row ml-0">
                                    <div class="col-12 col-xl-6 pl-0 pl-sm-2">
                                        <div class="form-group">
                                            <label>拠点</label>
                                            <m-branch-select
                                                v-model="dSearch.t_p_order.m_branch_id"
                                            />
                                        </div>
                                    </div>
                                    <div class="col-12 col-xl-6 pl-0 pl-sm-2">
                                        <div class="form-group">
                                            <label>発注先</label>
                                            <m-customer-ref-input
                                                v-model="dSearch.t_p_order.supplier_m_customer_id"
                                                :m-branch-id="dSearch.t_p_order.m_branch_id"
                                                :dealing-cds="[2,4]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div class="row ml-0">
                                    <div class="col pl-0 pl-sm-2">
                                        <div class="form-group">
                                            <label for="slip_memo">備考</label>
                                            <input class="form-control" id="slip_memo" v-model="dSearch.slip_memo">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="row">
                            <div class="col">
                                <div class="float-right">
                                    <input type="checkbox" id="purchase_completed_at" v-model="dSearch.purchase_completed_at" true-value="0" false-value="1"> 完了分を表示　
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

                    <div class="table-responsive border-top">
                        <table class="table table-striped table-dark table-hover">
                            <thead>
                                <tr class="text-nowrap" @click="sort">
                                    <th scope="col" class="w-short">
                                        <input
                                            type="checkbox"
                                            v-model="cSelectAll"
                                        /> 選択
                                    </th>
                                    <th scope="col" id="slip_no"        :class="setStyleSort('slip_no')">発注No.</th>
                                    <th scope="col" id="due_date"       :class="setStyleSort('due_date')">仕入予定日</th>
                                    <th scope="col" id="kana"           :class="setStyleSort('kana')">発注先</th>
                                    <th scope="col" id="material_name"  :class="setStyleSort('material_name')">材料名</th>
                                    <th scope="col" id="invoice_qty"    :class="setStyleSort('invoice_qty')" class="d-none d-lg-table-cell">仕入済</th>
                                    <th scope="col" id="remaining_qty"  :class="setStyleSort('remaining_qty')" class="d-none d-lg-table-cell">発注残</th>
                                    <th scope="col" id="price"          :class="setStyleSort('price')" class="d-none d-lg-table-cell">単価</th>
                                    <th scope="col" id="total_price"    :class="setStyleSort('total_price')">金額</th>
                                    <th scope="col" id="slip_memo"      :class="setStyleSort('slip_memo')" class="d-none d-lg-table-cell">備考</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr v-for="n in cTProjects" :key="n.id">
                                    <td>
                                        <input
                                            type="checkbox"
                                            :value="n"
                                            :id="n.id"
                                            v-model="n.is"
                                        >
                                    </td>

                                    <td class="text-nowrap">{{ n.t_p_order_id + "-" + n.id }}</td>
                                    <td class="text-nowrap">{{ cDateFormat(n.due_date) }}</td>
                                    <td class="text-truncate clamp">{{ n.m_customers_name }}</td>
                                    <td class="text-truncate clamp">{{ n.material_name }}</td>
                                    <td class="text-nowrap d-none d-lg-table-cell">{{ cToNumber(n.invoice_qty) }}</td>
                                    <td class="text-nowrap d-none d-lg-table-cell">{{ cToNumber(n.remaining_qty) }}</td>
                                    <td class="text-nowrap d-none d-lg-table-cell">{{ cToNumber(n.price) }}</td>
                                    <td class="text-nowrap">{{ cToNumber(n.total_price) }}</td>
                                    <td class="text-truncate clamp d-none d-lg-table-cell">{{ n.slip_memo }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="modal-footer pt-0 justify-content-start">
                    <div class="col col-lg-8">
                        <pagination
                            :p-pagination.sync="dPagination"
                            @search="search($event)"
                        />
                    </div>

                    <div class="col">
                        <div class="row justify-content-end">
                            <div class="alert alert-info p-1 ml-1 mb-0" role="alert" v-show="dMultipleMessage">
                                {{ dMultipleMessage }}
                            </div>
                            <!-- 選択ボタンのhide()イベントで確認メッセージを表示してモーダルを閉じない様にしてます[data-dismiss=""] -->
                            <button type="button" class="btn ml-1 btn-primary" :data-dismiss="dIsModalCloseAttribute" @click.prevent="hide()" :disabled="cIsButtonDisabled">選択</button>
                            <button type="button" class="btn ml-1 btn-light" data-dismiss="modal">閉じる</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DayJsEx    from "@frameworks/DayJsEx" ;
import NumberUtil from "@frameworks/NumberUtil" ;
import { SessionStorage } from "@frameworks/SessionStorageUtil" ;
import _ from "lodash" ;

export default {
    props : {
        // 親からのパラメーター
        "isOpen" : {
            // 起動フラグ(true:になった場合isOpenイベントを起動)
            type : Boolean ,
            default : () => false ,
        } ,
        "pBranchId" : {
            // 拠点
            type : Number ,
            default : () => 0 ,
        } ,
        "pCustomerId" : {
            // 発注先
            type : Number ,
            default : () => 0 ,
        } ,
    },
    data : function () {
        return {
            dRows : [],
            dApiName : "tPInvoiceOrderList",
            dPagination : {                         // pagination
                links : [] ,                        // リンク
                total : -1 ,                        // 合計件数
                from : -1 ,                         // 現在ページの開始位置
                to : -1 ,                           // 現在ページの終了位置
            } ,
            dSearch : {
                order_id_from : "",                 // 発注Id(From)
                order_id_to : "",                   // 発注Id(To)
                material_name : "",                 // 材料名
                slip_memo : "",                     // 備考
                due_date_from : null,               // 仕入予定日(From)
                due_date_to : null,                 // 仕入予定日(To)
                purchase_completed_at : 1,          // 仕入完了日(0：is nullの条件で検索しない 1[デフォルト]：is nullの条件で検索する)

                t_p_order : {
                    order_date_from : null,         // 発注日(From)
                    order_date_to : null,           // 発注日(To)
                    m_branch_id : 0,                // 拠点id
                    supplier_m_customer_id : 0,     // 発注先
                } ,

                m_material_detail : {
                    m_material : {
                        category_m_kv_id : 0,       // カテゴリ
                        sub_category_m_kv_id : 0,   // サブカテゴリ
                    } ,
                } ,

                sort : "" ,                         // ソート項目
            } ,
            dSelectedCategoryMkv : {},              // 選択されたカテゴリ
            dLoading : false,                       // 検索ボタン読込中フラグ
            dMultipleMessage : "",                  // 複数の取引先を選択してる場合はメッセージを表示
            dIsModalCloseAttribute : ""  ,          // 選択ボタンクリック時に確認メッセージを表示する必要があったので 確認OKであれば属性[data-dismiss="modal"]を動的に入れる


            dIsHiding : false 

        }
    } ,
    computed : {
        cEndpoint : function () {
            return `api/${this.dApiName}` ;
        } ,
        cTProjects : function () {
            return this.dRows ;
        } ,
        cTargetCategoryId : function () {
            // 選択されているカテゴリの対象カテゴリidを取得
            return this.dSelectedCategoryMkv?.target_m_kv_category_id ?? 0 ;
        } ,
        cSelectedList : function() {
            // 検索画面での選択データ(チェックボックスが付いたデータ)
            const filterd = this.dRows.filter(item => item.is) ;
            // 発注明細No順にソートする
            return _.sortBy(filterd,'id')
        } ,
        cIsButtonDisabled : function () {
            // 選択された発注先idの件数をチェック
            const multiple = Array.from(new Set(this.cSelectedList.map(item => item.supplier_m_customer_id))) ;
            this.dMultipleMessage = (multiple.length >= 2 ? "発注先が複数選択されてます" : "") ;

            // ボタン無効条件 = (選択されていない[0件] Or 違う取引先は選択できない[2件以上])
            return multiple.length != 1 ;
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
    } ,
    methods : {
        init : function () {
            // 検索結果・選択状態を初期化
            this.dRows = [] ;
            this.dPagination = {
                links : [] ,                        // リンク
                total : -1 ,                        // 合計件数
                from : -1 ,                         // 現在ページの開始位置
                to : -1 ,                           // 現在ページの終了位置
            } ;
            this.dIsModalCloseAttribute = "" // 起動時に[modal]属性をdata-dismiss="modal" に設定(閉じない)
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
                order_id_from : "",                             // 発注Id(From)
                order_id_to : "",                               // 発注Id(To)
                material_name : "",                             // 材料名
                slip_memo : "",                                 // 備考
                due_date_from : null,                           // 仕入予定日(From)
                due_date_to : null,                             // 仕入予定日(To)
                purchase_completed_at : 1,                      // 仕入完了日(0：is nullの条件で検索しない 1[デフォルト]：is nullの条件で検索する)

                t_p_order : {
                    order_date_from : null,                     // 発注日(From)
                    order_date_to : null,                       // 発注日(To)
                    m_branch_id : this.pBranchId,               // 拠点id(呼び出し元)
                    supplier_m_customer_id : this.pCustomerId,  // 発注先(呼び出し元)
                } ,

                m_material_detail : {
                    m_material : {
                        category_m_kv_id : 0,                   // カテゴリ
                        sub_category_m_kv_id : 0,               // サブカテゴリ
                    } ,
                } ,
            } ;

            // 呼び出し元から拠点idと発注先idの設定条件を引き継ぐ
            this.setBranchAndCustomer() ;
        } ,
        setBranchAndCustomer : function () {
            // 呼び出し元から拠点idと発注先idの設定条件を引き継ぐ
            this.dSearch.t_p_order.m_branch_id = this.pBranchId ;

            // 本来は拠点の初期化後に発注先をセットしたいのですが
            // 拠点と発注先の初期化のタイミングが逆になる場合があります(コード記述順とは違った順序で非同期にDOMが更新される)
            // 更新直後のDOMに対して何らかの処理をする場合にnextTick()を使ってくれとの事です
            this.$nextTick(function () {
                // 発注先idを強制更新
                this.dSearch.t_p_order.supplier_m_customer_id = this.pCustomerId ;
            })
        } ,
        search : async function (url) {
            const ep = (url? url : this.cEndpoint + "/retrieve") ;
            const params = JSON.parse(JSON.stringify(this.dSearch)) ;

            // 検索結果・選択状態を初期化
            this.init() ;

            try {
                this.dLoading = true ;

                // 検索処理
                const res = await axios.post(ep, params) ;

                // チェックボックスの項目を付け足す
                for (const r of res.data.data) {
                    r.is = false
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
        isMultipleBranchCheck : function () {
            // 違う拠点が選ばれているかの確認
            if (this.pBranchId != 0 && this.pBranchId != this.cSelectedList[0].m_branch_id) {
                var message = '違う拠点が選択されていますが追加してもよろしいですか?' ;

                // 呼出元で取引先が設定されていない場合の追加メッセージ
                if (this.pCustomerId == 0) message += '\n追加する場合は仕入先を再度設定してください' ;

                // 確認メッセージ
                if (!confirm(message)) return false;
            }

            // チェックOK
            return true ;
        } ,
        isMultipleCustomerCheck : function () {
            // 選択された重複されてない取引先idを取得
            const multiple = Array.from(new Set(this.cSelectedList.map(item => item.supplier_m_customer_id))) ;

            if (this.pCustomerId != 0 && this.pCustomerId != multiple[0]) {
                // 違う取引先が選ばれている場合は確認メッセージ
                if (!confirm('登録画面と違う発注先が選択されていますが追加してもよろしいですか?')) return false;
            }

            // チェックOK
            return true ;
        } ,
        hide : async function () {

            if(this.dIsHiding) return 
            this.dIsHiding = true


            // 呼び出し元の所属違いのチェック
            if (!this.isMultipleBranchCheck()) {
                this.dIsHiding = false
                return ; 
            }

            // 呼び出し元の取引先違いのチェック
            if (!this.isMultipleCustomerCheck()) {
                this.dIsHiding = false
                return ;
            }

            let invoices = new Array();

            for (const n of this.cSelectedList) {
                // 選択データを仕入データ用に抽出して呼び出し元に渡す
                const item = {
                    t_p_order_detail_id    : n.id                               , // 発注明細id
                    m_material_detail_id   : n.m_material_detail_id             , // 材料明細id
                    material_name          : n.material_name                    , // 品名・銘柄
                    qty                    : n.remaining_qty                    , // 数量(残数)
                    unit_m_kv_id           : n.unit_m_kv_id ?? 1530000          , // 単位区分
                    price                  : n.price                            , // 単価
                    total_price            : n.total_price                      , // 金額
                    capacity               : n.capacity                         , // 容量
                    material_size_x        : n.material_size_x                  , // 材料サイズX
                    material_size_y        : n.material_size_y                  , // 材料サイズY
                    m_branch_id            : n.m_branch_id                      , // 拠点id
                    m_customer_id          : n.supplier_m_customer_id           , // 仕入先id
                    t_project_id           : n.t_project_id                     , // 物件id
                    slip_memo              : n.slip_memo                        , // 備考
                    t_p_order_detail       : n                                  , // 発注No表示用発注明細
                } ;

                // Arrayにデータ追加
                invoices.push(item);
            }

            // 呼び出し元のイベントを駆動して画面を非表示
            await this.$emit('hide', invoices) ;
            // 確認メッセージで閉じないようにしている為(data-dismiss="modal"を削除) 自身で閉じるを実装してます
            this.dIsModalCloseAttribute="modal"

            this.dIsHiding = false

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
    watch : {
        isOpen : function (newVal) {
            if (newVal) {
                // openフラグをResetして起動時のみ処理する
                this.$emit("update:is-open", false) ;

                // 検索結果・選択状態を初期化
                this.init() ;

                // 呼び出し元から拠点idと発注先idの設定条件を引き継ぐ
                this.setBranchAndCustomer() ;
            }
        } ,
    },
    created : function () {
        // 保持した検索キーを読み込みなおす
        if (this.mainStore.isAppReady) {
            this.setSessionStorage() ;
        }
    } ,
}
</script>

<style scoped>
    /* 列ヘッダー */
    .w-short {
        width: 50px;
    }

    /* 明細：右揃え */
    th:nth-child(n+6):nth-child(-n+9),
    td:nth-child(n+6):nth-child(-n+9) {
        text-align: right;
    }

    /* クランプ表示用 */
    .clamp {
        max-width: 250px; /* クランプ使用時に(min,max)widthプロパティを設定 */
    }

    /* クランプ解除用 */
    .clamp:hover {
        white-space: normal;
    }

</style>
