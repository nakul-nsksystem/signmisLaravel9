<template>
    <!-- Modalフォーム -->
    <div class="modal fade" id="modalMaterial" tabindex="-1" role="dialog" style="margin-top: 0px;">
        <div class="modal-dialog modal-dialog-fluid" role="document">
            <div class="app-modal-content-dark">
                <div class="modal-header pb-1">
                    材料検索
                    <button type="button" class="close" data-dismiss="modal">
                        <span aria-hidden="true" class="text-white">&times;</span>
                    </button>
                </div>

                <div class="modal-body pb-0">
                    <div class="form-group border-top border-bottom">
                        <div class="row ml-0">
                            <ul class="nav nav-pills">
                                <li class="nav-item" v-for="n in cCategoryKvs" :key="n.id">
                                    <a class="nav-link app-inside-link" :class="{ active: isActiveNavLink(n.id) }" @click="selectCategory(n.id)" data-toggle="pill" href="#">{{ n.kv_name }}</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="row ml-0">
                            <div class="col-sm pl-0 pl-sm-2">
                                <label for="cd">コード</label>
                                <input class="form-control" id="cd" v-model="dSearch.m_material.cd" />
                            </div>

                            <div class="col-sm pl-0">
                                <label for="name">名称</label>
                                <input class="form-control" id="name" v-model="dSearch.m_material.name" />
                            </div>

                            <div class="col-sm pl-0">
                                <label for="detail_name">詳細</label>
                                <input class="form-control" id="detail_name" v-model="dSearch.detail_name" />
                            </div>

                            <div class="col-sm pl-0">
                                <label for="display_name">通称</label>
                                <input class="form-control" id="display_name" v-model="dSearch.m_material.display_name" />
                            </div>

                            <div class="col-sm pl-0" style="display:none">
                                <label style="display:none">カテゴリ</label>
                                <m-kv-select
                                    style="display:none"
                                    :selected-item.sync="dSelectedCategoryMkv"
                                    :kv-key="'m_materials-category_m_kv_id'"
                                    v-model="dSearch.m_material.category_m_kv_id"
                                />
                            </div>

                            <div class="col-sm pl-0">
                                <label>サブカテゴリ</label>
                                <m-kv-select
                                    :kv-category-id="cTargetCategoryId"
                                    v-model="dSearch.m_material.sub_category_m_kv_id"
                                />
                            </div>

                            <div class="col-sm pl-0">
                                <label>拠点</label>
                                <m-branch-select
                                    v-model="dSearch.m_material.m_branch_id"
                                />
                            </div>
                            
                            <div class="col-sm pl-0">
                                <label>仕入先</label>
                                <m-customer-ref-input
                                    v-model="dSearch.m_material.supplier_m_customer_id"
                                    :m-branch-id="dSearch.m_material.m_branch_id"
                                    :dealing-cds="[2,4]"
                                />
                            </div>

                            <div class="col-sm pl-0">
                                <label for="description">用途・説明</label>
                                <input class="form-control" id="description" v-model="dSearch.description" />
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="row">
                            <div class="col">
                                <div class="float-right">
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
                                <tr class="text-nowrap" @click.prevent="sort">
                                    <th scope="col">選択</th>
                                    <th scope="col" id="cd"             :class="setStyleSort('cd')">コード</th>
                                    <th scope="col" id="name"           :class="setStyleSort('name')">名称</th>
                                    <th scope="col" id="display_name"   :class="setStyleSort('display_name')">通称</th>
                                    <th scope="col" id="kv_name"        :class="setStyleSort('kv_name')">サブカテゴリ</th>
                                    <th scope="col" id="m_branch_id"    :class="setStyleSort('m_branch_id')" class="d-none d-lg-table-cell">拠点　</th>
                                    <th scope="col" id="kana"           :class="setStyleSort('kana')">仕入先</th>
                                    <th scope="col" id="description"    :class="setStyleSort('description')" class="d-none d-lg-table-cell">用途・説明</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr v-for="n in cMMaterials" :key="n.id">
                                    <td>
                                        <input 
                                            type="radio"
                                            :value="n"
                                            :id="n.id"
                                            v-model="dSelectedList"
                                        >
                                    </td>

                                    <td class="text-nowrap">{{ n.cd }}</td>
                                    <td class="text-truncate clamp clamp-w-long">{{ n.name + " " + n.detail_name }}</td>
                                    <td class="text-nowrap">{{ n.display_name }}</td>
                                    <td class="text-nowrap">{{ n.kv_name }}</td>
                                    <td class="text-nowrap d-none d-lg-table-cell">{{ n.m_branches_short_name }}</td>
                                    <td class="text-nowrap">{{ n.m_customers_name }}</td>
                                    <td class="text-truncate clamp clamp-w-medium d-none d-lg-table-cell">{{ n.description }}</td>
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
                            <button type="button" class="btn ml-1 btn-primary" data-dismiss="modal" @click.prevent="hide()" :disabled="cIsButtonDisabled">選択</button>
                            <button type="button" class="btn ml-1 btn-light" data-dismiss="modal">閉じる</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ObjectUtil from "@frameworks/ObjectUtil" ;
import MastersUtil from "@frameworks/MastersUtil" ;
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
            // 仕入先
            type : Number ,
            default : () => 0 ,
        } ,
    }, 
    data : function () {
        return {
            dRows : {
            } ,
            dApiName : "tPInvoiceMaterialList",
            dPagination : {                         // pagination
                links : [] ,                        // リンク
                total : -1 ,                        // 合計件数
                from : -1 ,                         // 現在ページの開始位置
                to : -1 ,                           // 現在ページの終了位置
            } ,
            dSearch : {
                m_material : {
                    cd : null,                      // cd
                    name : null,                    // 名称
                    m_branch_id : 0,                // 拠点id
                    supplier_m_customer_id : 0,     // 仕入先id
                    category_m_kv_id : 0,           // カテゴリ
                    sub_category_m_kv_id : 0,       // サブカテゴリ
                } ,
                detail_name : null,                 // 詳細名
                description : null,                 // 用途・説明

                sort : "" ,                         // ソート項目
            } ,
            dSelectedCategoryMkv : {},              // 選択されたカテゴリ
            dSelectedList : {},                     // 検索画面からの選択されたデータ
            dLoading : false,                       // 検索ボタン読込中フラグ
        }
    } ,
    computed : {
        cEndpoint : function () {
            return `api/mMaterialDetail/retrieveWithParent` ;
        } ,
        cMMaterials : function () {
            return this.dRows ;
        } ,
        cTargetCategoryId : function () {
            // 選択されているカテゴリの対象カテゴリidを取得
            return this.dSelectedCategoryMkv?.target_m_kv_category_id ?? 0 ;
        } ,
        cCategoryKvs : function() {
            if (this.mainStore.masters.MKvCategories === undefined) return [] ; 

            const category = this.mainStore.masters.MKvCategories.find(e => e.kv_key == "m_materials-category_m_kv_id") ;
            if (category === undefined) return [] ;

            return category.m_kvs ; 
        } ,
        cIsButtonDisabled : function () {
            // 選択されていればボタンを有効に
            return !Object.keys(this.dSelectedList).length ;
        } ,
        cBranchName : function () {
            return function (node) {
                // 略称が設定されている場合は略称を表示
                return MastersUtil.getBranchName(node) ;
            } ;
        } ,
        cCustomerName : function () {
            return function (node) {
                // 略称が設定されている場合は略称を表示
                return MastersUtil.getCustomerName(node) ;
            } ;
        } ,
        cMateriaDetailName : function () {
            return function (node) {
                return ObjectUtil.nu2ec(node.detail_name) ;
            } ;
        } ,
    } ,
    methods : {
        init : function () {
            // 検索結果・選択状態を初期化
            this.dRows = {} ;
            this.dPagination = {
                links : [] ,                        // リンク
                total : -1 ,                        // 合計件数
                from : -1 ,                         // 現在ページの開始位置
                to : -1 ,                           // 現在ページの終了位置
            } ;
            this.dSelectedList = {} ;
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
                m_material : {
                    cd : null,                                  // cd
                    name : null,                                // 名称
                    m_branch_id : this.pBranchId,               // 拠点id(呼び出し元)
                    supplier_m_customer_id : this.pCustomerId,  // 仕入先(呼び出し元)
                    category_m_kv_id : 0,                       // カテゴリ
                    sub_category_m_kv_id : 0,                   // サブカテゴリ
                } ,

                detail_name : null,                             // 詳細名
                description : null,                             // 用途・説明
            } ; 

            // 呼び出し元から拠点idと仕入先idの設定条件を引き継ぐ
            this.setBranchAndCustomer() ;
        } ,
        setBranchAndCustomer : function () {
            // 呼び出し元から拠点idと仕入先idの設定条件を引き継ぐ
            this.dSearch.m_material.m_branch_id = this.pBranchId ;

            // 本来は拠点の初期化後に仕入先をセットしたいのですが
            // 拠点と仕入先の初期化のタイミングが逆になる場合があります(コード記述順とは違った順序で非同期にDOMが更新される)
            // 更新直後のDOMに対して何らかの処理をする場合にnextTick()を使ってくれとの事です
            this.$nextTick(function () {
                // 発注先idを強制更新
                this.dSearch.m_material.supplier_m_customer_id = this.pCustomerId ;
            })
        } ,
        selectCategory : function (id) {
            // Navbarで選択されたカテゴリidを設定
            this.dSearch.m_material.category_m_kv_id = id ;
        } ,
        isActiveNavLink : function (id) {
            // SessionStorageから戻す場合にNavLinkを選択した状態に戻す
            return this.dSearch.m_material.category_m_kv_id === id;
        } ,
        search : async function (url) { 
            const ep = (url? url : this.cEndpoint) ;
            const params = JSON.parse(JSON.stringify(this.dSearch)) ; 

            // 検索結果・選択状態を初期化
            this.init() ;

            try {
                this.dLoading = true ;

                // 検索処理
                const res = await axios.post(ep, params) ;
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
        hide : function () {
            // 1つのみ選択なんですが汎用的にしたいのでArrayにして呼び出し元で処理してもらう
            let invoices = new Array();

            // 選択データを仕入データ用に抽出して呼び出し元に渡す
            const item = { 
                m_material_detail_id   : this.dSelectedList.id                  , // 材料明細id
                material_name          : this.dSelectedList.name                , // 品名・銘柄
                unit_m_kv_id           : this.dSelectedList.unit_m_kv_id        , // 単位区分
                qty                    : this.dSelectedList.min_order_qty       , // 数量
                price                  : this.dSelectedList.unit_price          , // 単価
                total_price            : 0                                      , // 金額(呼出元で計算するのでとりあえず0)
                capacity               : this.dSelectedList.capacity            , // 容量
                material_size_x        : this.dSelectedList.width               , // 材料サイズX
                material_size_y        : this.dSelectedList.height              , // 材料サイズY
                slip_memo              : this.dSelectedList.description         , // 用途・説明
                tax_m_kv_id            : this.dSelectedList.tax_m_kv_id         , // 税区分
                tax_rate               : this.dSelectedList.tax_rate            , // 税率
            } ;

            // 仕入データを追加
            invoices.push(item);

            this.$emit('hide', invoices) ;
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

                // 呼び出し元から拠点idと仕入先idの設定条件を引き継ぐ
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
    /* 明細：センター */
    th:nth-of-type(1),
    td:nth-of-type(1) {
        text-align: center;
    }

    /* クランプ表示用 */
    .clamp-w-medium {
        max-width: 200px; /* クランプ使用時に(min,max)widthプロパティを設定 */
    }

    .clamp-w-long {
        max-width: 300px; /* クランプ使用時に(min,max)widthプロパティを設定 */
    }

    /* クランプ解除用 */
    .clamp:hover {
        white-space: normal;
    }

</style>