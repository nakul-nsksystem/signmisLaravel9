<template>
    <div class="print-text-black">
        <div class="row mb-2">
            <contents-header-left></contents-header-left>
            <contents-header-right></contents-header-right>
        </div>
        <div v-if="$$cIsError" class="mt-1 mb-0 alert alert-danger" role="alert">
            {{ dErrorData.message }}
        </div>
        <validation-observer v-slot="{ invalid }">
            <slot name="header"></slot>
            <div class="text-right">
                <button type="button" :disabled="cDisabled || invalid" class="btn btn-success" @click.prevent="getData">
                    <div v-if="state.loading">
                        <span class="spinner-border spinner-border-sm" role="status" />
                        検索中...
                    </div>
                    <div v-else>
                        <i class="fas fa-search fa-fw" />
                        検索
                    </div>
                </button>
                <button type="button" :disabled="cDisabled" class="btn btn-secondary" @click.prevent="clear">
                    <i class="fas fa-eraser fa-fw"></i>
                    クリア
                </button>
                <button type="button" :disabled="cDisabled || invalid" class="btn btn-primary ml-1" @click.prevent="exportCsv">
                    <div v-if="state.exporting">
                        <span class="spinner-border spinner-border-sm" role="status" />
                        csv
                    </div>
                    <div v-else>
                        <i class="fas fa-file-csv fa-fw" />
                        csv
                    </div>
                </button>
            </div>
            <div class="row mt-2">
                <div class="col-12">
                    <div class="table-responsive">
                        <table class="table table-striped table-dark">
                            <thead>
                                <tr @click="sort">
                                    <slot name="th"></slot>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(n, index) in state.list" :key="index">
                                    <slot name="td" v-bind="n"></slot>
                                </tr>
                                <tr v-show="!_.isEmpty(state.list)" class="font-weight-bold">
                                    <slot name="th"></slot>
                                </tr>
                                <tr v-show="!_.isEmpty(state.list)" class="dark-selected">
                                    <td v-if="isDispRowCnt" :colspan="cntColSpan">合計：{{ cCount }}件</td>
                                    <td v-for="span in cntColSpan -1 " :key="`cntColSpan${span}`" style="display:none"><!-- 非表示カラム --></td>
                                    <slot name="summary" v-bind:list="state.list"></slot>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </validation-observer>
    </div>
</template>
<script lang="ts" setup>
import _ from "lodash";
import axios from 'axios';
import { computed ,getCurrentInstance,reactive,ref } from 'vue';
import { useStore } from '../../stores/mainStore';
import { useRoute } from '../../routers/routerPlugin';
import ArrayUtil from "../../frameworks/ArrayUtil";
import { ExportCsvService } from "../../services/ExportCsvService" ;

const store = useStore() ;

const _this = getCurrentInstance()?.proxy ;

const route = useRoute() ;

//routeからmysqlViewの名前を取得
const cVName = computed(() => {
    const arr = route.path.split('/')
    return _.camelCase(arr[ arr.length - 1 ]) ;
}) ;

const cEp = computed(() => `api/${cVName.value}`) ;

interface IProps {
    //検索項目
    conditions:any ,
    //件数合計を表示する
    isDispRowCnt? : boolean,
    //件数合計のcolspan指定(デフォルト2)
    cntColSpan?:number,
}
const props = withDefaults(defineProps<IProps>(), {
    isDispRowCnt : true ,
    cntColSpan : 2 ,
})

interface IEmits {
    (e: 'initConditions'): void
}

const emit = defineEmits<IEmits>() ;

const state = reactive({
    loading : false ,
    exporting : false ,
    list : Array() as any ,
})

//検索・出力中はボタンを押せなくする処理
const cDisabled = computed(() => state.loading || state.exporting) ;

//件数
const cCount = computed(() => state.list.length)

//帳票データ取得
async function getData () {

    state.loading = true ;
    let ep = `${cEp.value}/retrieve` ;

    try {
        const res = await axios.post(ep ,props.conditions) ;
        ArrayUtil.resetInsert(state.list,res.data) ;
        props.conditions.sort = "" ;
    }
    catch(error) {
        //@ts-ignore
        _this.$$errorConsole(error, ep) ;
    }
    finally {
        state.loading = false ;
    }
}

//csv出力
async function exportCsv () {
    state.exporting = true ;
    let ep = `${cEp.value}/exportCsv` ;

    try {
        const res = await ExportCsvService.export(ep, props.conditions, route?.meta?.label) ;
    }
    catch(error) {
        //@ts-ignore
        _this.$$errorConsole(error, ep) ;
    }
    finally {
        state.exporting = false ;
    }
}

//ソート
function sort (event:any) {

    const key:string|undefined = event.target.id

    if (_.isNil(key) || _.isEmpty(state.list)) return ;

    let order:"asc"|"desc" = "asc" ;

    // クリックした列をソートキーに保存
    if (props.conditions.sort == key) {
        props.conditions.sort = key + " desc" ;
        order = "desc"
    } else {
        props.conditions.sort = key ;
        order = "asc"
    }

    const sorted = _.orderBy(state.list, key, order)
    ArrayUtil.resetInsert(state.list, sorted) ;
}

//検索条件初期化
function clear() {
    emit("initConditions");
}


</script>

<style lang="scss" scoped>
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
::v-deep(div) {
/**プリント時にグリッドレイアウト可能にする**/
   @media print {
        .col-xl {
            -webkit-flex-basis: 0;
            -ms-flex-preferred-size: 0;
            flex-basis: 0;
            -webkit-box-flex: 1;
            -webkit-flex-grow: 1;
            -ms-flex-positive: 1;
            flex-grow: 1;
            max-width: 100%;
        }
        .col-xl-auto {
            -webkit-box-flex: 0;
            -webkit-flex: 0 0 auto;
            -ms-flex: 0 0 auto;
            flex: 0 0 auto;
            width: auto;
        }
        .col-xl-1 {
            -webkit-box-flex: 0;
            -webkit-flex: 0 0 8.333333%;
            -ms-flex: 0 0 8.333333%;
            flex: 0 0 8.333333%;
            max-width: 8.333333%;
        }
        .col-xl-2 {
            -webkit-box-flex: 0;
            -webkit-flex: 0 0 16.666667%;
            -ms-flex: 0 0 16.666667%;
            flex: 0 0 16.666667%;
            max-width: 16.666667%;
        }
        .col-xl-3 {
            -webkit-box-flex: 0;
            -webkit-flex: 0 0 25%;
            -ms-flex: 0 0 25%;
            flex: 0 0 25%;
            max-width: 25%;
        }
        .col-xl-4 {
            -webkit-box-flex: 0;
            -webkit-flex: 0 0 33.333333%;
            -ms-flex: 0 0 33.333333%;
            flex: 0 0 33.333333%;
            max-width: 33.333333%;
        }
        .col-xl-5 {
            -webkit-box-flex: 0;
            -webkit-flex: 0 0 41.666667%;
            -ms-flex: 0 0 41.666667%;
            flex: 0 0 41.666667%;
            max-width: 41.666667%;
        }
        .col-xl-6 {
            -webkit-box-flex: 0;
            -webkit-flex: 0 0 50%;
            -ms-flex: 0 0 50%;
            flex: 0 0 50%;
            max-width: 50%;
        }
        .col-xl-7 {
            -webkit-box-flex: 0;
            -webkit-flex: 0 0 58.333333%;
            -ms-flex: 0 0 58.333333%;
            flex: 0 0 58.333333%;
            max-width: 58.333333%;
        }
        .col-xl-8 {
            -webkit-box-flex: 0;
            -webkit-flex: 0 0 66.666667%;
            -ms-flex: 0 0 66.666667%;
            flex: 0 0 66.666667%;
            max-width: 66.666667%;
        }
        .col-xl-9 {
            -webkit-box-flex: 0;
            -webkit-flex: 0 0 75%;
            -ms-flex: 0 0 75%;
            flex: 0 0 75%;
            max-width: 75%;
        }
        .col-xl-10 {
            -webkit-box-flex: 0;
            -webkit-flex: 0 0 83.333333%;
            -ms-flex: 0 0 83.333333%;
            flex: 0 0 83.333333%;
            max-width: 83.333333%;
        }
        .col-xl-11 {
            -webkit-box-flex: 0;
            -webkit-flex: 0 0 91.666667%;
            -ms-flex: 0 0 91.666667%;
            flex: 0 0 91.666667%;
            max-width: 91.666667%;
        }
        .col-xl-12 {
            -webkit-box-flex: 0;
            -webkit-flex: 0 0 100%;
            -ms-flex: 0 0 100%;
            flex: 0 0 100%;
            max-width: 100%;
        }
    }
}
@media print {
    @page {
        /* BootStrapで縦固定になってたのをAuto(縦横指定)に変更します */
        size: auto;
    }

    .no-print {
        /* 印字しない項目は[class="no-print"]を指定 */
        display: none;
    }

    .print-text-black {
        /* DarkModeでモノクロ印刷した場合に文字色がグレーで出力されるが色が薄いので黒に変更 */
        color: black;
    }

    button {
        /* ボタンは印刷しない */
        display: none;
    }
}
</style>
