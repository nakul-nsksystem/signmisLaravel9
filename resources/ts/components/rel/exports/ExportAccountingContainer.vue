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
                        <slot name="conditions"></slot>

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
                                    <button type="button" class="btn btn-success" @click.prevent="search()" :disabled="invalid || state.loadingCheck">
                                        <div v-if="state.loadingCheck">
                                            <span class="spinner-border spinner-border-sm" role="status" />
                                            検索
                                        </div>
                                        <div v-else>
                                            <i class="fas fa-search fa-fw" />
                                            検索
                                        </div>
                                    </button>
                                    <button type="button" class="btn btn-primary" @click.prevent="runExport()" :disabled="invalid || state.loadingExport">
                                        <div v-if="state.loadingExport">
                                        <span class="spinner-border spinner-border-sm" role="status" />
                                            出力
                                        </div>
                                        <div v-else>
                                            <i class="fas fa-database" />
                                            出力
                                        </div>
                                    </button>
                                    <button type="button" class="btn btn-light" @click.prevent="historyBack()">戻る</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-12 col-lg-9">
                        <div class="row mx-1">
                            【{{props.title}}情報】
                            <div class="col-12 py-2 pl-xl-0">
                                <pagination
                                    :p-pagination.sync="state.pagination"
                                    @search="search($event)"
                                />
                            </div>

                            <div class="col-12 pl-xl-0">
                                <table class="table table-striped table-dark table-hover list">
                                    <thead>
                                        <tr>
                                            <slot name="th"></slot>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="n in state.rows" :key="n.detail_id">
                                            <slot name="td" v-bind="n"></slot>
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

<script lang="ts">
import PageMixins from '../../../mixins/commons/PageMixins' ;
export default {
    mixins : [PageMixins] 
}
</script>
<script lang="ts" setup>
import axios from 'axios';
import DayJsEx from "../../../frameworks/DayJsEx" ;
import { computed, getCurrentInstance, reactive } from 'vue';
import { useStore } from '../../../stores/mainStore';
import { useRouter,useRoute } from '../../../routers/routerPlugin';
import { camelCase, cloneDeep, snakeCase } from 'lodash';
import { ExportCsvService } from "../../../services/ExportCsvService";
import { Title } from 'chart.js';

const store = useStore() ;

const _this = getCurrentInstance()?.proxy ;

const router = useRouter() ;
const route = useRoute() ;

//routeからapiの名前を取得
const cVName = computed(() => {
    const arr = route.path.split('/');
    return camelCase( arr[ arr.length - 1 ]) ;
}) ;

const cEndpoint = computed(() => `api/${cVName.value}`) ;

interface IProps {
    //検索項目
    conditions:any ,
    title:string
}
const props = withDefaults(defineProps<IProps>(), {})


const state = reactive({
    rows : {                               // 結果データ
    } ,
    pagination : {                         // pagination
        links : [] ,                        // リンク
        total : -1 ,                        // 合計件数
        from : -1 ,                         // 現在ページの開始位置
        to : -1 ,                           // 現在ページの終了位置
    } ,
    loadingCheck : false ,                 // 非同期apiでの読込中フラグ(確認)
    loadingExport : false ,                // 非同期apiでの読込中フラグ(出力)
})


const cIsOutput = computed({
    get : function () {
        return props.conditions.is_csv_output ;
    } ,
    set : function (value) {
        // ReActiveとCast
        props.conditions.is_csv_output = (value ? 1 : 0) ;
    } ,
}) ;



//対象期間内に未締データがあるかを確認するApi
async function chkAllCompleted() {

    let ep = `api/${cVName.value}/chkAllCompleted`
    try {
        const res = await axios.post(ep,props.conditions) ; 

        if(res.data > 0) {
            return confirm(`対象期間内に未締データがあります。\n出力してもよろしいですか？※未締データは出力されません`) 
        }
        else {
            return true ;
        }

    } catch (error) {
        console.error() ;
        return false ;
    }
}

async function search  (url?:string) {
    state.loadingCheck = true ;
    // 取引先id=0をNullに置き換える
    ifCustomerIdZeroToNull() ;

    const ep = (url? url : cEndpoint.value + "/retrieve") ;
    const params = cloneDeep(props.conditions) ; 

    try {
        // 検索
        const res    = await axios.post(ep, params) ;
        state.rows   = res.data.data ;

        // pagination関連
        state.pagination.links = res.data.links ;   // リンク
        state.pagination.total = res.data.total ;   // 合計件数
        state.pagination.from  = res.data.from ;    // 現在ページの開始位置
        state.pagination.to    = res.data.to ;      // 現在ページの終了位置
    } catch (error) {
        // handle error
        //@ts-ignore
        _this.$$errorConsole(error, cEndpoint.value) ;
    }
    
    state.loadingCheck = false ;
} 

async function runExport  () {

    const isExport:boolean = await chkAllCompleted() ;
    if(!isExport) return ;
    state.loadingExport = true ;
    // 取引先id=0をNullに置き換える
    ifCustomerIdZeroToNull();

    // 出力
    const ep = cEndpoint.value + "/export" ;
    const params = cloneDeep(props.conditions) ; 

    try {
        const csvName = `${snakeCase(cVName.value)}_${DayJsEx.format(new Date(), "YYYYMMDD_HHmmss")}` ;
        const res = await ExportCsvService.export( ep ,params , props.title) ;

    } catch (error) {
        // handle error
        //@ts-ignore
        _this.$$errorConsole(error, ep) ;
    }
    finally {
        state.loadingExport = false ;
    }
    
} 
function historyBack () {
    router.push({ name : "rel_menu" }) ;
} 

function ifCustomerIdZeroToNull  () {
    // 取引先id=0をNullに置き換える
    //@ts-ignore
    if (props.conditions.m_customer_id == 0) props.conditions.m_customer_id = null ;
}

    
if (store.isAppReady) {
    // 拠点
    props.conditions.m_branch_id = store.loginMUser?.m_branch_id ?? 0 ;
}
</script>

<style  lang="scss" scoped>

::v-deep(tr) {/**v-deepで子コンポーネントのクラスor要素を指定)**/

    td , th {
        white-space: nowrap;
    }
    th {
        border-top: 1px solid #dee2e6 !important
    }
    /* クランプ解除用 */
    .text-truncate:hover {
        white-space: normal;
    }
    .mw-150 {
        max-width: 150px;
    }
    .mw-250 {
        max-width: 250px;
    }
    .mw-350 {
        max-width: 350px;
    }
}


</style>
