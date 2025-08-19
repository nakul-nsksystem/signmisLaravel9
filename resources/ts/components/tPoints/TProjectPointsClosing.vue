<template>
  <div>
    <div class="row mb-2">
      <contents-header-left></contents-header-left>
      <contents-header-right>
        <div class="ml-2">
          <button
            type="button"
            :disabled="!cCanBatchSave"
            @click.prevent="batchSave"
            class="btn btn-success"
          >
            <i class="fas fa-save fa-fw"></i>
            一括保存
          </button>
        </div>
      </contents-header-right>
    </div>
    <div v-show="$$cIsError" class="mt-1 mb-0 alert alert-danger" role="alert">
      {{ dErrorData.message }}
    </div>
    <div v-show="state.isSuccess" class="alert alert-success" role="alert">
      保存しました
    </div>
    <t-point-search-header
      :conditions="conditions"
      @search="getData()"
      @clear="initConditions"
    >
      <template #row1>
        <div v-if="false" class="col-12 col-xl-2 pl-xl-0">
          <div class="form-group">
            <label for="">コード</label>
            <input class="form-control" v-model="conditions.cd" />
          </div>
        </div>
      </template>
      <template #row2>
        <div class="col-12 col-xl-2 pl-xl-0">
          <div class="form-group">
            <label for="">状態</label>
            <select class="form-control" v-model="conditions.is_closed">
              <option value=""></option>
              <option value="0">未締め</option>
              <option value="1">締め済</option>
            </select>
          </div>
        </div>
      </template>
    </t-point-search-header>

    <div class="row mt-2">
      <div class="col-12">
        <pagination :p-pagination.sync="pagination" @search="getData($event)" />
        <div class="table-responsive">
          <table class="table table-striped table-dark">
            <thead>
              <tr @click.prevent="sort">
                <th id="m_branch_id" :class="setStyleSort('m_branch_id')">
                  拠点
                </th>
                <th
                  id="created_m_user_id"
                  :class="setStyleSort('created_m_user_id')"
                >
                  登録担当
                </th>
                <th
                  id="sales_m_user_id"
                  :class="setStyleSort('sales_m_user_id')"
                >
                  営業担当
                </th>
                <th id="m_customer_id" :class="setStyleSort('m_customer_id')">
                  取引先名
                </th>
                <th id="cd" :class="setStyleSort('cd')">物件名</th>
                <th
                  id="sales_completed_at"
                  :class="setStyleSort('sales_completed_at')"
                >
                  売上完了日
                </th>
                <th
                  id="total_sell_price"
                  :class="setStyleSort('total_sell_price')"
                  class="text-right"
                >
                  受注金額
                </th>
                <th
                  id="total_sale_price"
                  :class="setStyleSort('total_sale_price')"
                  class="text-right"
                >
                  売上金額
                </th>
                <th class="text-right">粗利</th>
                <th class="text-right">利益率</th>
                <th style="min-width: 100px" class="text-right">
                  制作Pt率<br />営業Pt率
                </th>
                <th class="text-center">締</th>
                <th class="text-right" style="min-width: 100px">制作Pt</th>
                <th class="text-right" style="min-width: 100px">営業Pt</th>
                <th class="text-right" style="min-width: 100px">総Pt</th>
                <th></th>
              </tr>
              <tr>
                <th class="py-1" colspan="11"></th>
                <th class="py-1 text-center">
                  <ns-checkbox-input
                    id="check_all"
                    v-model="cCheckAll"
                    @change="allChecked"
                    :disabled="cDisabled"
                  />
                </th>
                <th class="py-1" colspan="4"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="n in state.list" :key="n.id">
                <td>{{ n.MBranchName }}</td>
                <td class="text-truncate mw-150">{{ n.CreatedMUserName }}</td>
                <td class="text-truncate mw-150">{{ n.SalesMUserName }}</td>
                <td class="text-truncate mw-200">{{ n.MCustomerName }}</td>
                <td class="text-truncate mw-250">
                  <!-- <a :href='"v#/t_project/edit/" + n.id'>{{ n.cd }} <br>{{ n.name }}</a> -->
                  <a
                    href="#"
                    @click.prevent="$$openTProjectEditOnOtherTab(n.id)"
                  >
                    {{ n.cd }} <br />{{ n.name }}
                  </a>
                </td>
                <td>{{ cDateFormat(n.sales_completed_at) }}</td>
                <td class="text-right">{{ cToNumber(n.total_sell_price) }}</td>
                <td class="text-right">{{ cToNumber(n.total_sale_price) }}</td>
                <td class="text-right">{{ cToNumber(n.total_profit) }}</td>
                <td class="text-right">{{ cToNumber(n.ProfitPer) }}%</td>
                <td>
                  <div class="text-right">{{ cToNumber(n.ProdPer) }}%</div>
                  <div class="text-right">{{ cToNumber(n.SalesPer) }}%</div>
                </td>
                <td class="text-center">
                  <ns-checkbox-input
                    :id="String(n.id)"
                    v-model="n.IsClosed"
                    @change="checked"
                    :disabled="cDisabled"
                  />
                  <!-- {{ cDateFormat(n.t_project_point?.applicated_at) ?? "" }} -->
                </td>
                <td class="text-right">{{ cToNumber(n.ProdPoint) }}</td>
                <td class="text-right">{{ cToNumber(n.SalesPoint) }}</td>
                <td class="text-right">{{ cToNumber(n.SumOfPoint) }}</td>
                <!-- <td></td> -->
                <td class="text-center">
                  <button
                    type="button"
                    class="btn btn-info"
                    @click.prevent="preview(n)"
                    :disabled="cDisabled"
                  >
                    <i class="fas fa-fw fa-calculator"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-success"
                    @click.prevent="save(n)"
                    :disabled="cDisabled || !n.IsEdited"
                  >
                    <i class="fas fa-fw fa-save"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pagination :p-pagination.sync="pagination" @search="getData($event)" />
      </div>
    </div>
    <div v-if="state.loading">
      <transition name="fade">
        <div class="preview-wrap">
          <div
            class="position-absolute vh-100 d-flex justify-content-center align-items-center"
            style="left: 50%"
          >
            <span class="spinner-border text-primary" style="opacity: 1" />
          </div>
        </div>
      </transition>
    </div>
    <t-project-point-preview-modal
      v-model="state.previewRow"
      ref="previewModal"
    />
    <t-project-point-bulk-set-modal
      v-model="bsModalState"
      ref="bsModal"
      @ok="bulkSet"
    />
  </div>
</template>

<script lang='ts'>
import PageMixins from "../../mixins/commons/PageMixins";

export default {
  mixins: [PageMixins],
};
</script>
<script setup lang="ts">
import DayJsEx from "./../../frameworks/DayJsEx";
import _, { isNil, unescape } from "lodash";
import axios from "axios";
import { computed, getCurrentInstance, onMounted, reactive, ref } from "vue";
import ArrayUtil from "../../frameworks/ArrayUtil";
import { useStore } from "../../stores/mainStore";
import { useMasterStore } from "../../stores/masterStore";
import { signmisReportComposition } from "../reports/compositions/signmisReportComposition";
import { TProjectPoint } from "./models/TProjectPoint";
import { TProject4Point } from "./models/TProject4Point";
import { TUserPoint } from "./models/TUserPoint";
import Pagination from "../layouts/Pagination.vue";

const store = useStore();
const masterStore = useMasterStore();
const _this = getCurrentInstance()?.proxy;

const { cDateFormat, cToNumber, cTermAlert, getCalcedMonth } =
  signmisReportComposition();

const conditions = reactive({
  cd: "",
  sales_completed_at_from: "",
  sales_completed_at_to: "",
  created_m_user_id: 0,
  sales_m_user_id: 0,
  m_branch_id: 0,
  m_customer_id: 0,
  profit_per_from: "",
  profit_per_to: "",
  is_applicated: "1",
  is_closed: "",
  sort: "",
});

const pagination = reactive({
  links: [], // リンク
  total: -1, // 合計件数
  from: -1, // 現在ページの開始位置
  to: -1, // 現在ページの終了位置
  current_page: -1, // 現在ページ
});

const state = reactive({
  searching: false,
  list: [] as TProject4Point[],
  checkAll: false,
  loading: false,
  isSuccess: false,
  previewRow: undefined as TProject4Point | undefined,
});

const bsModalState = reactive({
  prodPer: 0,
  salesPer: 0,
  constructCoef: 0,
  createCoef: 0,
  profitPerFrom: 0.0,
  profitPerTo: 100.0,
  isUpdateAlreadySet: false,
});

//検索・出力中はボタンを押せなくする処理
const cDisabled = computed(() => state.searching || state.loading);

const cSalesCompleteDayFrom = computed({
  get: () => conditions.sales_completed_at_from,
  set: (val) => {
    if (_.isEmpty(conditions.sales_completed_at_to)) {
      conditions.sales_completed_at_to = getCalcedMonth(val, 1);
    }
    conditions.sales_completed_at_from = val;
  },
});

const cCheckAll = computed({
  get: () => state.checkAll,
  set: (val) => {
    state.checkAll = val;
  },
});

const cCanBatchSave = computed(() => {
  if (state.list.length == 0) return false;
  if (
    !_.some(state.list, function (o: TProject4Point) {
      return o.IsEdited;
    })
  )
    return false;
  return true;
});

function allChecked() {
  if (state.list.length == 0) return;
  state.list.map((x: any) => (x.IsClosed = state.checkAll));
}

function checked() {
  state.checkAll = !state.list.some((x) => !x.IsClosed);
}

//ソート
function sort(event: any) {
  const key: string | undefined = event.target.id;

  if (_.isNil(key) || _.isEmpty(state.list)) return;

  if (!event.target.id) return;

  // クリックした列をソートキーに保存
  if (conditions.sort == event.target.id) {
    conditions.sort = event.target.id + " desc";
  } else {
    conditions.sort = event.target.id;
  }

  // 再検索
  if (state.list.length) getData();
}

function setStyleSort(key: string) {
  // ソートされた項目のStyle設定
  return {
    sort_asc: conditions.sort == key,
    sort_desc: conditions.sort == key + " desc",
  };
}

const cEp = computed(() => `api/tProjectPoint`);

async function getData(url?: string) {
  state.loading = true;
  let ep = url ?? `${cEp.value}/getTProject4PointClosing`;
  try {
    const res = await axios.post(ep, conditions);
    const parsed = res.data.data.map((x: any) => TProject4Point.parse(x));

    ArrayUtil.resetInsert(state.list, parsed);
    state.checkAll =
      state.list.length > 0 && !state.list.some((x) => !x.IsClosed);

    // pagination関連
    pagination.links = res.data.links; // リンク
    pagination.total = res.data.total; // 合計件数
    pagination.from = res.data.from; // 現在ページの開始位置
    pagination.to = res.data.to; // 現在ページの終了位置
    pagination.current_page = res.data.current_page; // 現在ページ
    // conditions.sort = "" ;
  } catch (error) {
    //@ts-ignore
    _this.$$errorConsole(error, ep);
  } finally {
    state.loading = false;
  }
}

const previewModal = ref();

async function preview(row: TProject4Point) {
  // state.previewRow = row;
  // previewModal.value.openModal();
  state.loading = true;
  let ep = `${cEp.value}/getTProject4Point`;
  let condition = { id: row.id ?? 0 };
  try {
    const res = await axios.post(ep, condition);
    const parsed = TProject4Point.parse(res.data);
    if (!isNil(parsed)) {
      parsed.SalesPer = row.SalesPer;
      parsed.ProdPer = row.ProdPer;
      parsed.ConstructCoef = row.ConstructCoef;
      parsed.CreateCoef = row.CreateCoef;
    }
    state.previewRow = parsed;
    previewModal.value.openModal();
  } catch (error) {
    //@ts-ignore
    _this.$$errorConsole(error, ep);
  } finally {
    state.loading = false;
  }
}

const bsModal = ref();
function openBSModal() {
  if (state.list.length == 0) return;
  bsModal.value.openModal();
}

function bulkSet() {
  if (!state.list) return;
  for (const row of state.list) {
    //利益率が範囲内か
    if (
      row.profit_per >= bsModalState.profitPerFrom &&
      row.profit_per <= bsModalState.profitPerTo
    ) {
      //値を上書きするか
      if (!bsModalState.isUpdateAlreadySet) {
        if (
          row.ProdPer > 0 ||
          row.SalesPer > 0 ||
          row.ConstructCoef > 0 ||
          row.CreateCoef
        )
          continue;
      }

      row.ProdPer = bsModalState.prodPer;
      row.SalesPer = bsModalState.salesPer;
      row.ConstructCoef = bsModalState.constructCoef;
      row.CreateCoef = bsModalState.createCoef;
    }
  }
}

async function save(row: TProject4Point) {
  state.loading = true;
  state.isSuccess = false;
  let ep = cEp.value;
  if (!row.t_project_point) return;

  try {
    let res;
    let closedAt = null;
    if (row.t_project_point.closed_at) {
      closedAt = DayJsEx.format(new Date(), "YYYY-MM-DD HH:mm:ss");
    }

    // 締めの場合、締め日をセット
    if (closedAt === null) {
      let cProjectIds: number[] = [];
      cProjectIds.push(row.t_project_point.t_project_id);
      let ep1 = `${cEp.value}/validateClosing`;
      let res1 = await axios.post(ep1, cProjectIds);
      if (!res1.data.success) {
        // 削除確認メッセージ
        if (!confirm(res1.data.message + "\n続けてもよろしいですか?")) return;
      }
    }

    row.t_project_point.closed_at = closedAt;
    row.t_project_point.applicated_at = undefined;
    res = await axios.put(
      `${ep}/${row.t_project_point.id}`,
      row.t_project_point
    );
    row.t_project_point = TProjectPoint.parse(res.data);

    // 締めの場合ユーザーポイントを取得
    if (row.t_project_point.closed_at) {
      let ep1 = "api/tUserPoint/getByTProjectId";
      try {
        const res1 = await axios.get(
          `${ep1}/${row.t_project_point.t_project_id}`
        );
        row.t_user_points = res1.data.map((x: any) => TUserPoint.parse(x));
        row.UsersSummary;
      } catch (error) {
        //@ts-ignore
        _this.$$errorConsole(error, ep1);
      }
    }

    row.is_closed = !isNil(row.t_project_point.closed_at);
    state.isSuccess = true;
  } catch (error) {
    //@ts-ignore
    _this.$$errorConsole(error, ep);
  } finally {
    state.loading = false;
  }
}

async function batchSave(url?: string) {
  if (state.list.length <= 0) return;
  state.loading = true;
  state.isSuccess = false;
  let ep = `${cEp.value}/batchClosingSave`;
  let pageNo = pagination.current_page;
  try {
    let cList = [] as TProjectPoint[];
    let cProjectIds: number[] = [];
    cList = state.list.map((x: any) => {
      const row = TProjectPoint.parse(x.t_project_point);
      let closedAt = null;
      if (row.closed_at) {
        closedAt = DayJsEx.format(new Date(), "YYYY-MM-DD HH:mm:ss");
      } else {
        cProjectIds.push(row.t_project_id);
      }
      row.closed_at = closedAt;
      row.applicated_at = undefined;
      return row;
    });

    if (cProjectIds.length > 0) {
      let ep1 = `${cEp.value}/validateClosing`;
      let res1 = await axios.post(ep1, cProjectIds);
      console.log("res1.data", res1.data);
      if (!res1.data.success) {
        // 削除確認メッセージ
        if (!confirm(res1.data.message + "\n続けてもよろしいですか?")) return;
      }
    }

    await axios.post(ep, cList);

    getData(`${cEp.value}/getTProject4PointClosing?page=` + pageNo);
    state.isSuccess = true;
  } catch (error) {
    //@ts-ignore
    _this.$$errorConsole(error, ep);
  } finally {
    state.loading = false;
  }
}

function initConditions() {
  cSalesCompleteDayFrom.value = "";
  conditions.sales_completed_at_to = "";

  conditions.m_customer_id = 0;
  (conditions.profit_per_from = ""),
    (conditions.profit_per_to = ""),
    (conditions.sort = "");

  conditions.created_m_user_id = 0;
  conditions.sales_m_user_id = 0;
  conditions.m_branch_id = store.loginMUser?.m_branch_id ?? 0;
  conditions.is_closed = "";
}

// 一括設定初期値の取得
const smKey1 = 8010502;
const smKey2 = 8010503;
const smKey3 = 8010504;
const smKey4 = 8010505;

function initBsState() {
  const prodPer = masterStore.getSMOptionValByKeyMKvId(smKey1);
  const salesPer = masterStore.getSMOptionValByKeyMKvId(smKey2);
  const constructCoef = masterStore.getSMOptionValByKeyMKvId(smKey3);
  const createCoef = masterStore.getSMOptionValByKeyMKvId(smKey4);

  bsModalState.prodPer = Number(prodPer);
  bsModalState.salesPer = Number(salesPer);
  bsModalState.constructCoef = Number(constructCoef);
  bsModalState.createCoef = Number(createCoef);
}

onMounted(() => {
  initConditions();
  initBsState();
});
</script>

<style lang="scss" scoped>
td,
th {
  white-space: nowrap;
  vertical-align: middle;
}

th {
  border-top: 1px solid #dee2e6 !important;
}

/* クランプ解除用 */
.text-truncate:hover {
  white-space: normal;
}

.mw-200 {
  max-width: 200px;
}

.mw-250 {
  max-width: 250px;
}

.mw-350 {
  max-width: 350px;
}

.preview {
  width: auto;
  height: auto;
  display: block;

  position: fixed;
  /* top:25%; */
  left: 50%;
  transform: translate(-50%);
}

.preview-wrap {
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1050;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
