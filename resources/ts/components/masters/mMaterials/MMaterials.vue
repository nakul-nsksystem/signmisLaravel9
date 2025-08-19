<template>
    <div>
        <div class="row mb-2">
            <contents-header-left></contents-header-left>
            <contents-header-right>
                <div class="flex-column">
                    <router-link to='add' title="" append>
                        <button type="button" class="btn btn-primary">
                            <i class="fas fa-plus fa-fw" />
                            新規作成
                        </button>
                    </router-link>
                </div>
            </contents-header-right>
        </div>

        <div class="form-group border-top border-bottom">
            <div class="row ml-xl-0">
                <ul class="nav nav-pills">
                    <li class="nav-item" v-for="n  in cCategoryKvs" :key="n.id">
                        <a class="nav-link app-inside-link" :class="{ active: isActiveNavLink(n.id) }" @click="selectCategory(n.id)" data-toggle="pill" href="#">{{ n.kv_name }}</a>
                    </li>
                </ul>
            </div>
        </div>

        <div class="form-group">
            <div class="row ml-xl-0">
                <div class="col-sm pl-0">
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
                        v-model="dSearch.m_material.category_m_kv_id"
                        :selected-item.sync="dSelectedCategoryMkv"
                        :kv-key="'m_materials-category_m_kv_id'"
                    />
                </div>

                <div class="col-sm pl-0">
                    <label>サブカテゴリ</label>
                    <m-kv-select
                        v-model="dSearch.m_material.sub_category_m_kv_id"
                        :kv-category-id="cTargetCategoryId"
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
                <div class="col clearfix">
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

                        <button type="button" :disabled="dLoading || dExporting" class="btn btn-primary ml-1" @click.prevent="exportCsv">
                            <div v-if="dExporting">
                                <span class="spinner-border spinner-border-sm" role="status" />
                                csv
                            </div>
                            <div v-else>
                                <i class="fas fa-file-csv fa-fw" />
                                csv
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="form-group">
            <div class="table-responsive-xl">
                <table class="table table-striped table-dark table-hover">
                    <thead>
                        <tr class="text-nowrap" @click.prevent="sort">
                            <th scope="col">Actions</th>
                            <th scope="col" id="cd"             :class="setStyleSort('cd')">コード</th>
                            <th scope="col" id="name"           :class="setStyleSort('name')">名称</th>
                            <th scope="col" id="display_name"   :class="setStyleSort('display_name')">通称</th>
                            <th scope="col" id="kv_name"        :class="setStyleSort('kv_name')">サブカテゴリ</th>
                            <th scope="col" id="m_branch_id"    :class="setStyleSort('m_branch_id')" class="d-none d-xl-table-cell">拠点</th>
                            <th scope="col" id="kana"           :class="setStyleSort('kana')">仕入先</th>
                            <th scope="col" id="unit_price"     :class="setStyleSort('unit_price')">仕入単価</th>
                            <th scope="col" id="cost_price"     :class="setStyleSort('cost_price')">原価</th>
                            <th scope="col" id="description"    :class="setStyleSort('description')" class="d-none d-lg-table-cell">用途・説明</th>
                            <th scope="col" id="updated_at"     :class="setStyleSort('updated_at')"  class="d-none d-lg-table-cell">更新日</th>
                            <th scope="col">削除</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="n in cMMaterials" :key="n.id">
                            <td class="text-nowrap">
                                <router-link :to='"view/" + n.m_material_id' title="" append>
                                    <button type="button" class="btn btn-secondary">
                                        <i class="fas fa-eye fa-fw" />
                                    </button>
                                </router-link>

                                <router-link :to='"edit/" + n.m_material_id' title="" append>
                                    <button type="button" class="btn btn-success">
                                        <i class="fas fa-edit fa-fw" />
                                    </button>
                                </router-link>
                            </td>

                            <td class="text-nowrap">{{ n.cd }}</td>
                            <td >{{ n.name + " " + n.detail_name }}</td>
                            <td >{{ n.display_name }}</td>
                            <td class="text-nowrap">{{ n.kv_name }}</td>
                            <td class="text-nowrap d-none d-xl-table-cell">{{ n.m_branches_short_name }}</td>
                            <td class="text-nowrap">{{ n.m_customers_name }}</td>
                            <td class="text-nowrap">{{ cToNumber(n.unit_price) }}</td>
                            <td class="text-nowrap">{{ cToNumber(n.cost_price) }}</td>
                            <td class="text-truncate clamp d-none d-lg-table-cell">{{ n.description }}</td>
                            <td class="text-nowrap d-none d-lg-table-cell">{{ cDateFormat(n.updated_at) }}</td>

                            <td>
                                <button type="button" class="btn btn-danger" @click.prevent="destroy(n.m_material_id)">
                                    <i class="fas fa-trash fa-fw" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <pagination 
            :p-pagination.sync="dPagination"
            @search="search($event)"
        />
    </div>
</template>

<script>
import DayJsEx from "@frameworks/DayJsEx" ;
import NumberUtil from "@frameworks/NumberUtil" ;
import PageMixins from "@mixins/commons/PageMixins" ;
import { SessionStorage } from "@frameworks/SessionStorageUtil" ; 
import { ExportCsvService } from "../../../services/ExportCsvService";

export default {
    mixins : [PageMixins] , 
    data : function () {
        return {
            dApiName : "mMaterial" ,
            dPagination : {                         // pagination
                links : [] ,                        // リンク
                total : -1 ,                        // 合計件数
                from : -1 ,                         // 現在ページの開始位置
                to : -1 ,                           // 現在ページの終了位置
            } ,
            dRows : {
            } ,
            dSearch : {                             // 検索キー
                m_material : {
                    cd : null ,                     // コード
                    name : null ,                   // 名称
                    display_name : null ,           // 通称
                    m_branch_id : 0 ,               // 拠点id
                    supplier_m_customer_id : 0 ,    // 仕入先id
                    category_m_kv_id : 0 ,          // カテゴリ
                    sub_category_m_kv_id : 0 ,      // サブカテゴリ
                } ,
                detail_name : null ,                // 詳細名
                description : null ,                // 用途・説明

                sort : "" ,                         // ソート項目
            } ,
            dSelectedCategoryMkv : {} ,             // カテゴリ
            dLoading : false ,                      // 検索ボタン読込中フラグ

            dExporting : false ,            // csvexport 

        }
    } ,
    computed : {
        cEndpoint : function () {
            return `api/${this.dApiName}` ;
        } ,
        cIsError : function () {
            return this.dErrorStatus !== undefined && this.dErrorStatus !== "" ;
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
        cDateFormat : function () {
            return function (val) {
                return DayJsEx.format(val, "YYYY-MM-DD HH:mm") ;
            } ;
        } ,
        cToNumber : function () {
            return function (val) {
                return NumberUtil.formatZeroSuppress(val) ;
            } ;
        } ,
    } ,
    methods : {
        destroy : async function (id) {
            if (!confirm('関連する材料銘柄を削除します。\n個別に削除する場合は詳細画面で個別削除してください。\n削除してもよろしいですか?')) return ;

            try {
                const ep = this.cEndpoint + `/${id}` ;
                const res = await axios.delete(ep) ;

                // 検索結果の行を非表示にする
                this.deletedRow(id) ;
            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.cEndpoint) ;
            }
        } ,
        deletedRow : function (id) {
            // 検索結果の行を非表示にする
            // 削除対象が複数あるのでfilterで該当データの抽出処理かけてます
            const result = this.dRows.filter((data) => {
                return (data.m_material_id != id) ;
            });

            this.dRows = result ;
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
            const ep = (url? url : this.cEndpoint + "Detail/retrieveWithParent") ;
            const params = JSON.parse(JSON.stringify(this.dSearch)) ; 

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
                    cd : null,                                              // コード
                    name : null,                                            // 名称
                    m_branch_id : this.mainStore.loginMUser.m_branch_id ,   // ログイン担当者の拠点id
                    supplier_m_customer_id : 0,                             // 仕入先id
                    category_m_kv_id : 0,                                   // カテゴリ
                    sub_category_m_kv_id : 0,                               // サブカテゴリ
                } ,                     
                detail_name : null,                                         // 詳細名
                description : null,                                         // 用途・説明
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
         exportCsv : async function() {
            this.dExporting = true ;
            let ep = `${this.cEndpoint}Detail/exportCsv` ;
            
            try {
                const res = await ExportCsvService.export( ep,  this.dSearch ,"材料マスタ" ) ;
            } 
            catch(error) {
                this.$$errorConsole(error, ep) ;
            }
            finally {
                this.dExporting = false ;
            }
        }
    } ,
    created : function () {
        if (this.mainStore.isAppReady) {
            // ログインユーザーの拠点
            this.dSearch.m_material.m_branch_id = this.mainStore.loginMUser.m_branch_id ; 

            // 保持した検索キーを設定
            this.setSessionStorage() ;
        }
    } ,

   
}
</script>

<style scoped>
    /* 明細：右揃え */
    th:nth-of-type(8),
    td:nth-of-type(8),
    th:nth-of-type(9),
    td:nth-of-type(9) {
        text-align: right;
    }

    /* クランプ表示用 */
    .clamp {
        max-width: 150px; /* クランプ使用時に(min,max)widthプロパティを設定 */
    }

    /* クランプ解除用 */
    .clamp:hover {
        white-space: normal;
    }
</style>