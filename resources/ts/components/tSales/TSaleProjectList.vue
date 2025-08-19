<template>
    <!-- Modalフォーム -->
    <div class="modal fade" id="modalOrder" tabindex="-1" role="dialog" style="margin-top: 0px;">
        <div class="modal-dialog modal-dialog-fluid" role="document">
            <div class="app-modal-content-dark">
                <div class="modal-header pb-1">
                    物件検索
                    <button type="button" class="close" data-dismiss="modal">
                        <span aria-hidden="true" class="text-white">&times;</span>
                    </button>
                </div>

                <div class="modal-body pb-0">
                    <div class="pt-3 border-top">
                        <div class="row ml-lg-0">
                            <div class="col-12 col-lg-2 pl-lg-2">
                                <div class="form-group">
                                    <label for="cd">物件コード</label>
                                    <input class="form-control" id="project_cd" v-model="dSearch.cd" />
                                </div>
                            </div>

                            <div class="col-12 col-lg-3 pl-lg-0">
                                <div class="form-group">
                                    <label for="project_name">物件名</label>
                                    <input class="form-control" id="project_name" v-model="dSearch.name">
                                </div>
                            </div>

                            <div class="col-12 col-lg-2 pl-lg-0">
                                <div class="form-group">
                                    <label for="product_name">商品名</label>
                                    <input class="form-control" id="product_name" v-model="dSearch.t_project_product.name">
                                </div>
                            </div>

                            <div class="col-12 col-lg-2 pl-lg-0">
                                <div class="form-group">
                                    <label for="arrival_at_from">最終着日～</label>
                                    <ex-v-date-picker id="arrival_at_from" v-model="dSearch.arrival_at_from" :is-day-only=false />
                                </div>
                            </div>

                            <div class="col-12 col-lg-2 pl-lg-0">
                                <div class="form-group">
                                    <label for="arrival_at_to">～最終着日</label>
                                    <ex-v-date-picker id="arrival_at_to" v-model="dSearch.arrival_at_to" :is-day-only=false />
                                </div>
                            </div>

                            <!-- <div class="col-12 col-lg-1 pl-lg-0">
                                <button class="p-0 btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne"
                                    v-on:click="dIsOpenSearchDetail =! dIsOpenSearchDetail"
                                >
                                    {{ dIsOpenSearchDetail ? '詳細条件を閉じる': '詳細条件を開く' }}
                                </button>
                            </div> -->
                        </div>
                    </div>

                    <div class="">
                        <div class="row ml-lg-0">
                            <div class="col-12 col-lg-1 pl-lg-2">
                                <div class="form-group">
                                    <label>拠点</label>
                                    <m-branch-select
                                        v-model="dSearch.m_branch_id"
                                    />
                                </div>
                            </div>

                            <div class="col-12 col-lg-3 pl-lg-0">
                                <div class="form-group">
                                    <label>取引先</label>
                                    <input class="form-control" id="customer_name" v-model="dSearch.m_customer.name">
                                </div>
                            </div>

                            <div class="col-12 col-lg-1 pl-lg-0">
                                <div class="form-group">
                                    <label>締日</label>
                                    <input class="form-control" id="customer_closing_date" v-model="dSearch.closing_date">
                                </div>
                            </div>

                            <div class="col-12 col-lg-1 pl-lg-0">
                                <div class="form-group">
                                    <label>客先担当</label>
                                    <input class="form-control" id="customer_user_name" v-model="dSearch.customer_user_name">
                                </div>
                            </div>

                            <div class="col-12 col-lg-1 pl-lg-0">
                                <div class="form-group">
                                    <label for="order_no">客先注文No.</label>
                                    <input class="form-control" id="order_no" v-model="dSearch.customer_order_no">
                                </div>
                            </div>

                            <div class="col-12 col-lg-4 pl-lg-0">
                                <div class="form-group">
                                    <label for="memo">備考</label>
                                    <input class="form-control" id="memo" v-model="dSearch.memo">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="row">
                            <div class="col">
                                <div class="float-right">
                                    <input type="checkbox" id="sales_completed_at" v-model="cCompletedAt" true-value="0" false-value="1"> 完了分を表示　
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
                                    <th scope="col" class="w-short">納品形式</th>
                                    <th scope="col" id="cd"                 :class="setStyleSort('cd')" class="w-short">物件コード</th>
                                    <th scope="col" id="name"               :class="setStyleSort('name')">物件名</th>
                                    <th scope="col" class="w-short">点数</th>
                                    <th scope="col" class="d-none d-lg-table-cell">商品名</th>
                                    <th scope="col" id="arrival_at"         :class="setStyleSort('arrival_at')" class="w-short">最終着日</th>
                                    <th scope="col" id="total_sell_price"   :class="setStyleSort('total_sell_price')" class="d-none d-lg-table-cell w-short">合計売価</th>
                                    <th scope="col" id="kana"               :class="setStyleSort('kana')">取引先</th>
                                    <th scope="col" id="customer_user_name" :class="setStyleSort('customer_user_name')" class="d-none d-lg-table-cell w-short">客先担当</th>
                                    <th scope="col" id="customer_order_no"  :class="setStyleSort('customer_order_no')" class="d-none d-lg-table-cell w-short">客先注文No.</th>
                                    <th scope="col" id="memo"               :class="setStyleSort('memo')" class="d-none d-lg-table-cell">備考</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr v-for="n in cTPOrders" :key="n.id">
                                    <td>
                                        <input
                                            type="checkbox"
                                            :value="n"
                                            :id="n.id"
                                            v-model="n.is"
                                        >
                                    </td>
                                    <td class="p-0">
                                        <m-kv-select
                                            v-model="n.delivery_format_m_kv_id"
                                            @change="itemChanged(n)"
                                            :kv-key="'sales_management-delivery_format'"
                                        />
                                    </td>
                                    <td>
                                        <a href="#" @click.prevent="$$openTProjectEditOnOtherTab(n.id)">
                                            {{ n.cd }}
                                        </a>
                                    </td>

                                    <td class="text-truncate clamp">{{ n.name }}</td>
                                    <td class="text-nowrap">{{ n.products_count }}</td>
                                    <td class="text-truncate clamp d-none d-lg-table-cell">{{ cProductName(n.t_project_products) }}</td>
                                    <td class="text-nowrap">{{ cDateFormat(n.arrival_at) }}</td>
                                    <td class="text-nowrap d-none d-lg-table-cell">{{ cToNumber(n.total_sell_price) }}</td>
                                    <td class="text-truncate clamp">{{ n.m_customers_name }}</td>
                                    <td class="text-nowrap d-none d-lg-table-cell">{{ n.customer_user_name }}</td>
                                    <td class="text-nowrap d-none d-lg-table-cell">{{ n.customer_order_no }}</td>
                                    <td class="text-truncate clamp d-none d-lg-table-cell">{{ n.memo }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="modal-footer pt-0 justify-content-start">
                    <div class="col">
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
                            <div class="alert alert-info p-1 ml-1 mb-0" role="alert" v-show="cDifferArrivalAtMessage">
                                {{ cDifferArrivalAtMessage }}
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
import ObjectUtil from "@frameworks/ObjectUtil" ;
import { SessionStorage } from "@frameworks/SessionStorageUtil" ;

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
            // 取引先id
            type : Number ,
            default : () => 0 ,
        } ,
        "pCustomerName" : {
            // 取引先名
            type : String ,
            default : () => "" ,
        } ,
        "pShippedAt" : {
            // 売上日
            type : String ,
            default : () => "" ,
        } ,
    },
    data : function () {
        return {
            dRows : [] ,
            dApiName : "tSaleProjectList",
            dPagination : {                         // pagination
                links : [] ,                        // リンク
                total : -1 ,                        // 合計件数
                from : -1 ,                         // 現在ページの開始位置
                to : -1 ,                           // 現在ページの終了位置
            } ,
            dSearch : {
                cd : "",                            // 物件cd
                name : "",                          // 物件名
                m_branch_id : 0,                    // 拠点id
                m_customer_id : 0,                  // 取引先
                customer_user_name : "",            // 客先担当
                customer_order_no : "",             // 客先注文No.
                sales_completed_at : 1,             // 売上完了日(0：is nullの条件で検索しない 1[デフォルト]：is nullの条件で検索する)
                memo : "",                          // 備考

                m_customer : {
                    name : "",                      // 取引先名
                } ,

                t_project_product : {
                    name : "",                      // 商品名
                    delivery_date_from : null,      // 納期(From)
                    delivery_date_to : null,        // 納期(To)
                    sales_completed_at : 1,         // 売上完了日(0：is nullの条件で検索しない 1[デフォルト]：is nullの条件で検索する)
                } ,

                sort : "" ,                         // ソート項目
            } ,
            dLoading : false,                       // 検索ボタン読込中フラグ
            dMultipleMessage : "",                  // 複数の取引先を選択してる場合はメッセージを表示
            dIsModalCloseAttribute : "",            // 選択ボタンクリック時に確認メッセージを表示する必要があったので 確認OKであれば属性[data-dismiss="modal"]を動的に入れる
            dIsOpenSearchDetail : false,            // 検索詳細メニューの切替用

            dIsHiding : false 
        }
    } ,
    computed : {
        cEndpoint : function () {
            return `api/${this.dApiName}` ;
        } ,
        cTPOrders : function () {
            return this.dRows ;
        } ,
        cSelectedList : function() {
            // 検索画面での選択データ(チェックボックスが付いたデータ)
            return this.dRows.filter(item => item.is)
        } ,
        cIsButtonDisabled : function () {
            // 選択された重複されてない取引先idの件数をチェック
            const multiple = Array.from(new Set(this.cSelectedList.map(item => item.m_customer_id))) ;
            this.dMultipleMessage = (multiple.length >= 2 ? "取引先が複数選択されてます" : "") ;

            // ボタン無効条件 = (選択されていない[0件] Or 違う取引先は選択できない[2件以上])
            return multiple.length != 1 ;
        } ,
        cDifferArrivalAtMessage : function () {
            // 選択された重複されてない最終着日の件数をチェック
            const multiple = Array.from(new Set(this.cSelectedList.map(item => item.arrival_at).filter(Boolean))) ;

            // 違う最終着日を選択している場合はメッセージ表示
            return (multiple.length >= 2 ? "最終着日が複数選択されてます" : "") ;
        } ,
        cProductName : function () {
            return function (nodes) {
                // 完了した物件商品名は非表示
                // 一旦キー[name]の値をmapで取得して更に文字列に戻す
                return nodes.filter(item => item.sales_completed_at == null).map(item => item.name).join() ;
            } ;
        } ,
        cProjectProductName : function () {
            return function (product) {
                // サイズ(X・Yが寸法0以外は表記)
                const size = (ObjectUtil.nu2zr(product.size_w) != 0 || ObjectUtil.nu2zr(product.size_w) != 0 ?
                             " " + ObjectUtil.nu2zr(product.size_w) + "X" + ObjectUtil.nu2zr(product.size_h)
                             : "") ;

                // 物件商品名 + サイズX・Y
                return (ObjectUtil.nu2ec(product.name) + size).trim() ;
            } ;
        } ,
        cProjectName : function () {
            return function (node) {
                // 物件名
                return ObjectUtil.nu2ec(node.name).trim() ;
            } ;
        } ,
        cCompletedAt : {
            // 物件・商品の売上完了分の同期を取りたかったのでgetter・setter使ってます
            get : function () {
                return this.dSearch.sales_completed_at ;
            } ,
            set : function (value) {
                // 物件・商品の売上完了日は同期
                this.dSearch.sales_completed_at                   = value ;
                this.dSearch.t_project_product.sales_completed_at = value ;
            } ,
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
                cd : "",                            // 物件cd
                name : "",                          // 物件名
                m_branch_id : this.pBranchId,       // 拠点id(呼び出し元)
                m_customer_id : 0,                  // 取引先
                customer_user_name : "",            // 客先担当
                sales_completed_at : 1,             // 売上完了日(0：is nullの条件で検索しない 1[デフォルト]：is nullの条件で検索する)
                memo : "",                          // 備考

                m_customer : {
                    name : this.pCustomerName,      // 取引先名(呼び出し元)
                } ,

                t_project_product : {
                    name : "",                      // 商品名
                    delivery_date_from : null,      // 納期(From)
                    delivery_date_to : null,        // 納期(To)
                    sales_completed_at : 1,         // 売上完了日(0：is nullの条件で検索しない 1[デフォルト]：is nullの条件で検索する)
                } ,
            } ;

            // 呼び出し元から拠点idと取引先idの設定条件を引き継ぐ
            this.setBranchAndCustomer() ;
        } ,
        setBranchAndCustomer : function () {
            // 呼び出し元から拠点idと取引先idの設定条件を引き継ぐ
            this.dSearch.m_branch_id = this.pBranchId ;

            // 本来は拠点の初期化後に取引先をセットしたいのですが
            // 拠点と取引先の初期化のタイミングが逆になる場合があります(コード記述順とは違った順序で非同期にDOMが更新される)
            // 更新直後のDOMに対して何らかの処理をする場合にnextTick()を使ってくれとの事です
            this.$nextTick(function () {
                // 取引先を強制更新
                this.dSearch.m_customer.name = this.pCustomerName ;
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
                if (this.pCustomerId == 0) message += '\n追加する場合は取引先を再度設定してください' ;

                // 確認メッセージ
                if (!confirm(message)) return false;
            }

            // チェックOK
            return true ;
        } ,
        isMultipleCustomerCheck : function () {
            // 選択された重複されてない取引先idを取得
            const multiple = Array.from(new Set(this.cSelectedList.map(item => item.m_customer_id))) ;

            if (this.pCustomerId != 0 && this.pCustomerId != multiple[0]) {
                // 違う取引先が選ばれている場合は確認メッセージ
                if (!confirm('登録画面と違う取引先が選択されていますが追加してもよろしいですか?')) return false;
            }

            // チェックOK
            return true ;
        } ,
        isOverwriteArrivalAt : function (shipped_at) {
            // 最終着日を売上日に上書きするかのロジック
            if (!shipped_at) {
                // 最終着日が設定されてないので上書きしない
                return false ;
            }
            else if (!this.pShippedAt) {
                // 呼び出し元の売上日が設定されてないので上書きする
                return true ;
            }
            else if (DayJsEx.compareDate(shipped_at, this.pShippedAt) == "same") {
                // 最終着日=売上日なので上書きしない
                return false ;
            }
            else if (shipped_at && this.pShippedAt) {
                // 最終着日を上書きするかの確認
                return confirm('最終着日を上書きしますがよろしいですか?') ;
            }

            // 上書きしない
            return false ;
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

            // 最終着日を取得
            const shipped_at = this.cSelectedList
                               .map(item => item.arrival_at)
                               .filter(Boolean) /* Null filter */
                               .reduce((prev, current) => prev > current ? prev : current, 0) ;
            // 最終着日を売上日に上書きするかのロジック
            const isOverwriteArrivalAt =  this.isOverwriteArrivalAt(shipped_at);

            let sales = new Array();
            for (const n of this.cSelectedList) {
                // 選択データを売上データ用に抽出して呼び出し元に渡す
                if (n.delivery_format_m_kv_id == 1235002) {
                    // 明細単位：最初の1件目は物件情報を追記
                    const item = {
                        t_project_id      : n.id                                     , // 物件id
                        t_project_cd      : n.cd                                     , // 物件cd
                        product_name      : this.cProjectName(n)                     , // 品名(物件名)
                        contact           : n.customer_user_name?.concat("様")       , // 客先担当者
                        customer_order_no : n.customer_order_no                      , // 客先注文No.
                        qty               : 0                                        , // 数量(0：固定)
                        unit_m_kv_id      : 1530000                                  , // 単位[Null]
                        price             : 0                                        , // 単価
                        total_price       : 0                                        , // 金額
                        m_branch_id       : n.m_branch_id                            , // 拠点id
                        m_customer_id     : n.m_customer_id                          , // 取引先id
                        memo              : n.memo                                   , // 備考
                        shipped_at        : isOverwriteArrivalAt ? shipped_at : null , // 最終着日
                        ship_m_kv_id      : 1200005                                  , // 出荷区分[記入用]
                    } ;
                    // Arrayに追加
                    sales.push(item);

                    for (const product of n.t_project_products) {
                        // 商品毎に売上データ作成
                        if (!product.sales_completed_at || this.cCompletedAt == 0) {
                            // 売上完了してない商品のみ or [完了分も表示]時は商品追加
                            const item = {
                                t_project_id   : n.id                                     , // 物件id
                                t_project_cd   : n.cd                                     , // 物件cd
                                product_id     : product.id                               , // 物件商品id
                                product_name   : this.cProjectProductName(product)        , // 品名(物件商品名 + サイズX・Y)
                                qty            : product.qty                              , // 数量
                                unit_m_kv_id   : product.unit_m_kv_id ?? 1530000          , // 単位
                                price          : product.sell_price                       , // 単価
                                total_price    : product.total_sell_price                 , // 金額
                                product_size_x : product.size_w                           , // サイズX
                                product_size_y : product.size_h                           , // サイズY
                                m_branch_id    : n.m_branch_id                            , // 拠点id
                                m_customer_id  : n.m_customer_id                          , // 取引先id
                                memo           : n.memo                                   , // 備考
                                shipped_at     : isOverwriteArrivalAt ? shipped_at : null , // 最終着日
                                ship_m_kv_id   : 1200001                                  , // 出荷区分[売上]
                            } ;

                            // Arrayに追加
                            sales.push(item);
                        }
                    }
                } else {
                    // 物件単位：商品毎の金額合計
                    const total = n.t_project_products.reduce((sum, item) => sum + item.total_sell_price, 0) ;

                    const item = {
                        t_project_id      : n.id                                     , // 物件id
                        t_project_cd      : n.cd                                     , // 物件cd
                        product_name      : this.cProjectName(n)                     , // 品名(物件名)
                        contact           : n.customer_user_name?.concat("様")       , // 客先担当者
                        customer_order_no : n.customer_order_no                      , // 客先注文No.
                        qty               : 1                                        , // 数量
                        unit_m_kv_id      : 1530003                                  , // 単位[式]
                        price             : total                                    , // 単価
                        total_price       : total                                    , // 金額
                        m_branch_id       : n.m_branch_id                            , // 拠点id
                        m_customer_id     : n.m_customer_id                          , // 取引先id
                        memo              : n.memo                                   , // 備考
                        shipped_at        : isOverwriteArrivalAt ? shipped_at : null , // 最終着日
                        ship_m_kv_id      : 1200001                                  , // 出荷区分[売上]
                    } ;

                    // Arrayに追加
                    sales.push(item);
                }

                if (n.delivery_fee != 0) {
                    // 送料は別途
                    const item = {
                        t_project_id  : n.id                                     , // 物件id
                        t_project_cd  : n.cd                                     , // 物件cd
                        product_name  : "納品代・送料"                            , // 品名(納品代・送料)
                        m_branch_id   : n.m_branch_id                            , // 拠点id
                        m_customer_id : n.m_customer_id                          , // 取引先id
                        qty           : 1                                        , // 数量
                        unit_m_kv_id  : 1530003                                  , // 単位[式]
                        price         : n.delivery_fee                           , // 単価(送料)
                        total_price   : n.delivery_fee                           , // 金額
                        memo          : n.memo                                   , // 備考
                        shipped_at    : isOverwriteArrivalAt ? shipped_at : null , // 最終着日
                        ship_m_kv_id  : 1200001                                  , // 出荷区分[売上]
                    } ;

                    // Arrayに追加
                    sales.push(item);
                }
            }

            // 呼び出し元のイベントを駆動して画面を非表示
            await this.$emit('hide', sales) ;
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
        itemChanged : function (item) {
            // 納品形式を変更したらチェックを付ける
            if(item.delivery_format_m_kv_id) item.is = true ;
        } ,
    } ,
    watch : {
        isOpen : function (newVal) {
            if (newVal) {
                // openフラグをResetして起動時のみ処理する
                this.$emit("update:is-open", false) ;

                // 検索結果・選択状態を初期化
                this.init() ;

                // 呼び出し元から拠点idと取引先idの設定条件を引き継ぐ
                this.setBranchAndCustomer() ;
            }
        } ,
    } ,
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

    /* 明細：センター */
    th:nth-of-type(5),
    td:nth-of-type(5) {
        text-align: center;
    }

    /* 明細：右揃え */
    th:nth-child(n+8):nth-child(-n+8),
    td:nth-child(n+8):nth-child(-n+8) {
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
</style>
