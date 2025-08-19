<template>
    <div>

        <div class="form-group border-top">
        </div>

        <div class="form-group">
            <div class="row ml-xl-0">
                <div class="col-sm pl-0">
                    <label for="cd">コード</label>
                    <input type="text" id="cd" class="form-control" v-model="dSearch.cd" />
                </div>

                <div class="col-sm pl-0">
                    <label for="cd">連携コード</label>
                    <input type="text" id="data_linkage_cd" class="form-control" v-model="dSearch.data_linkage_cd" />
                </div>

                <div class="col-sm pl-0">
                    <label for="name">名称</label>
                    <input type="text" id="name" class="form-control" v-model="dSearch.name" />
                </div>

                <div class="col-sm pl-0">
                    <label for="dealing_m_kv_id">取引区分</label>
                    <m-kv-select
                        v-model="dSearch.dealing_m_kv_id"
                        :kv-key="'sales_management-dealing'"
                    />
                </div>

                <div class="col-sm pl-0">
                    <label for="inputMBranchId">拠点</label>
                    <m-branch-select
                        v-model="dSearch.m_branch_id"
                    />
                </div>

                <div class="col-sm pl-0">
                    <label for="inputCategoryMKvId">担当者</label>
                    <m-user-select
                        v-model="dSearch.sales_m_user_id"
                        :m-branch-id="dSearch.m_branch_id"
                    />
                </div>

                <div class="col-sm pl-0">
                    <label for="memo">備考</label>
                    <input type="text" id="memo" class="form-control" v-model="dSearch.memo" />
                </div>
            </div>
        </div>

        <div class="form-group">
            <div class="row">
                <div class="col clearfix">
                    <div class="float-right">
                        <button type="submit" class="btn btn-success" @click.prevent="search()" :disabled="dLoading || dExporting">
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
                <table class="table table-striped table-dark table-hover list">
                    <thead>
                        <tr class="text-nowrap" @click.prevent="sort">                            
                            <th scope="col">Actions</th>
                            <th scope="col" id="cd"               :class="setStyleSort('cd')">コード</th>
                            <th scope="col" id="data_linkage_cd"  :class="setStyleSort('data_linkage_cd')">連携コード</th>
                            <th scope="col" id="name"             :class="setStyleSort('name')">名称</th>
                            <th scope="col">住所</th>
                            <th scope="col">
                                <div id="email"                   :class="setStyleSort('email')">メール</div>
                                <div id="po_email"                :class="setStyleSort('po_email')">発注用メール</div>
                            </th> 
                            <th scope="col" id="kv_name"          :class="setStyleSort('kv_name')">取引区分</th>
                            <th scope="col">
                                <div id="closing_date"            :class="setStyleSort('closing_date')">締日</div>
                                <div id="payment_date"            :class="setStyleSort('payment_date')">入金日</div>
                            </th> 
                            <!-- <th scope="col" id="m_branch_id"        :class="setStyleSort('m_branch_id')">拠点</th>
                            <th scope="col" id="m_users_full_name"  :class="setStyleSort('m_users_full_name')">担当者</th> -->
                            <!-- <th scope="col" id="memo"               :class="setStyleSort('memo')" class="d-none d-md-table-cell">備考</th> -->
                            <th scope="col" v-if="isEnabledDelete">削除</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="n in cCustomers" :key="n.id">
                            <td class="text-nowrap">
                                <router-link :to='"view/" + n.id' title="" append v-if="isEnabledView">
                                    <button type="button" class="btn btn-secondary" >
                                        <i class="fas fa-eye fa-fw" />                            
                                    </button>                                
                                </router-link>
                                <router-link :to='"edit/" + n.id' title="" append >
                                    <button type="button" class="btn btn-success" >
                                        <i class="fas fa-edit fa-fw" />                            
                                    </button>
                                </router-link>
                                
                            </td>

                            <td>{{ n.cd }}</td>
                            <td class="text-nowrap">{{ n.data_linkage_cd }}</td>
                            <td class="text-nowrap">{{ n.name }}</td>
                            <td class="text-nowrap">
                                <div>{{ !cIsEmpty(n.zip) ? '〒' + n.zip : "" }}</div>
                                <div>{{n.display_address}}</div>
                                <div>{{ !cIsEmpty(n.tel) ?  n.tel : "" }}</div>
                            </td>
                            <td class="text-nowrap">
                                <div>{{ !cIsEmpty(n.email) ? n.email : "-" }}</div>
                                <div>{{ !cIsEmpty(n.po_email) ? n.po_email : "-" }}</div>
                            </td>
                            <td class="text-nowrap">{{ n.kv_name }}</td>
                            <!-- <td class="text-nowrap">{{ n.m_branches_short_name }}</td>
                            <td class="text-nowrap">{{ n.m_users_full_name }}</td> -->
                            <td class="text-nowrap">
                                <div>{{ n.closing_date }}</div>
                                <div>{{ n.payment_date }}</div>
                            </td>
                            <!-- <td class="d-none d-md-table-cell">{{ n.memo }} </td> -->
                            
                            <td v-if="isEnabledDelete">
                                <button type="button" class="btn btn-danger" @click.prevent="destroy(n.id)">
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
import PageMixins from '@mixins/commons/PageMixins' ;
import MastersUtil from "@frameworks/MastersUtil" ;
import { SessionStorage } from "@frameworks/SessionStorageUtil" ; 
import _ from 'lodash';
import { ExportCsvService } from "../../../services/ExportCsvService";
import { MasterCommonService } from "../class/services/MasterCommonService";

export default {
    mixins : [PageMixins] , 
    data : function () {
        return {
            dApiName : "mCustomer",
            dPagination : {                 // pagination
                links : [] ,                // リンク
                total : -1 ,                // 合計件数
                from : -1 ,                 // 現在ページの開始位置
                to : -1 ,                   // 現在ページの終了位置
            } ,
            dRows : {
            } ,
            dSearch : {                     // 検索キー
                cd : null ,                 // コード
                data_linkage_cd : null ,    // 連携コード
                name : null ,               // 名称
                dealing_m_kv_id : 0 ,       // 取引区分
                m_branch_id : 0 ,           // 拠点id
                sales_m_user_id : 0 ,       // 担当者
                memo : null ,               // 備考
                sort : "" ,                 // ソート項目
            } ,
            dLoading : false ,              // 検索ボタン読込中フラグ
            dExporting : false ,            // csvexport 

        }
    } ,
    props : { 
        /** 
         * 削除表示
         */
        isEnabledDelete: { 
            type : Boolean , 
            default : () => true ,
        } , 
        /** 
         * 表示表示
         */
        isEnabledView: { 
            type : Boolean , 
            default : () => true ,
        } , 
    } ,
    computed : {
        cEndpoint : function () {
            return `api/${this.dApiName}`;
        } ,
        cIsError : function () {
            return this.dErrorStatus !== undefined && this.dErrorStatus !== "" ;
        } ,
        cCustomers : function () {
            return this.dRows ;
        } ,
        cCustomerName : function () {
            return function (node) {
                // 略称が設定されている場合は略称を表示
                return MastersUtil.getCustomerName(node) ;
            } ;
        } ,
        cIsEmpty : function () {
            return function(val){
                return _.isEmpty(val) ;
            }
        }
    } ,
    methods : {
        destroy : async function(id) {

            try {

                const isForceDelete = await MasterCommonService.checkTxn(`${this.cEndpoint}/checkTxn/${id}`) ;
                if (!isForceDelete) return ;

                // 削除処理
                const ep = this.cEndpoint + `/${id}` ;
                const res = await axios.delete(ep) ;

                // 検索結果の行を非表示にする
                const deleted  =    this.dRows.find(e => e.id === id) ;
                const delIndex =    this.dRows.indexOf(deleted) ;
                if (delIndex != -1) this.dRows.splice(delIndex, 1) ;
            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.cEndpoint) ;
            }
        } ,
        search : async function (url) {
            const ep = (url? url : this.cEndpoint + "/retrieve") ;
            const params = JSON.parse(JSON.stringify(this.dSearch)) ;

            try {
                this.dLoading = true ;

                // 検索処理
                const res = await axios.post(ep, params) ;

                // console.log(res.data)
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
                cd : null ,                                             // コード
                name : null ,                                           // 名称
                dealing_m_kv_id : 0 ,                                   // 取引区分
                m_branch_id : this.mainStore.loginMUser.m_branch_id ,   // ログイン担当者の拠点id
                sales_m_user_id : 0 ,                                   // 担当者
                memo : null ,                                           // 備考
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
            let ep = `${this.cEndpoint}/exportCsv` ;
            
            try {
                const res = await ExportCsvService.export( ep,  this.dSearch ,"取引先マスタ" ) ;
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
            this.dSearch.m_branch_id = this.mainStore.loginMUser.m_branch_id ;

            // 保持した検索キーを設定
            this.setSessionStorage() ;
        }
    } ,
}
</script>

<style scoped>
    /* 明細：幅固定 */ 
    table[class~="list"] th:nth-of-type(1),
    table[class~="list"] th:nth-of-type(9) {
        width: 80px;
    }

</style>
