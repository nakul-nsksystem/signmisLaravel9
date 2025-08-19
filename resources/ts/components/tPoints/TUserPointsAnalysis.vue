<template>
  <div>
    <div class="row mb-2">
      <contents-header-left></contents-header-left>
      <contents-header-right>
        <div class="d-flex">
          <div class="my-auto">
            <ns-checkbox-input
              v-model="state.isNotDisplayChart"
              :id="'isNotDisplayChart'"
              :label="'チャート非表示'"
            />
          </div>
        </div>
      </contents-header-right>
    </div>

    <div class="app-contents-container">
      <div class="row">
        <div class="col-12 col-xl-3">
          <div class="form-group">
            <label>日付</label>
            <div class="d-flex flex-no-wrap">
              <ex-v-date-picker
                readonly
                aria-readonly="true"
                v-model="conditions.changed_at_from"
              />
              <span class="px-2 pt-2">～</span>
              <ex-v-date-picker
                readonly
                aria-readonly="true"
                v-model="conditions.changed_at_to"
              />
            </div>
          </div>
        </div>
        <div class="col-12 col-xl-2 pl-xl-0">
          <div class="form-group">
            <label>拠点</label>
            <m-branch-select
              v-model="conditions.m_branch_id"
              :disabled="!cIsViewAllUserData"
            />
          </div>
        </div>
        <div class="col-12 col-xl-2 pl-xl-0">
          <div class="form-group">
            <label for="m_branch_id">担当者</label>
            <m-user-select
              id="m_branch_id"
              :m-branch-id="conditions.m_branch_id"
              v-model="conditions.m_user_id"
              :disabled="!cIsViewAllUserData"
            />
          </div>
        </div>
        <div class="col-12 col-xl-2 pl-xl-0">
          <div class="form-group">
            <label>区分</label>
            <m-kv-select
              v-model="conditions.point_type_m_kv_id"
              :kv-key="'t_user_points-point_type'"
              :g01="'0'"
            >
            </m-kv-select>
          </div>
        </div>
        <div class="col-12 col-xl-2 pl-xl-0">
          <div class="form-group">
            <label>種類</label>
            <m-kv-select
              v-model="conditions.point_grant_type_m_kv_id"
              :kv-key="'t_user_points-point_grant_type'"
            >
            </m-kv-select>
          </div>
        </div>
        <div class="col-12 col-xl-1 pl-xl-0">
          <label for="">物件のみ</label>
          <ns-checkbox-input
            v-model="conditions.has_project"
            :id="'TUserPointsAnalysis-HasProject'"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-xl-3">
          <div class="form-group">
            <label>売上完了日</label>
            <div class="d-flex flex-no-wrap">
              <ex-v-date-picker v-model="cSalesCompleteDayFrom" />
              <span class="px-2 pt-2">～</span>
              <ex-v-date-picker v-model="conditions.sales_completed_at_to" />
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-xl-10">
          <h6 class="text-primary">分析期間</h6>
          <ymd-Select v-model="state.anaylyze.term" />
        </div>
        <div class="col-12 col-xl-2 d-flex">
          <div class="ml-auto">
            <div class="form-group">
              <label>&nbsp;</label>
              <div>
                <button
                  type="button"
                  :disabled="state.isLoading"
                  class="btn btn-success"
                  @click.prevent="search()"
                >
                  <div v-if="state.isLoading">
                    <span
                      class="spinner-border spinner-border-sm"
                      role="status"
                    />
                    集計中...
                  </div>
                  <div v-else>
                    <i class="fas fa-chart-bar fa-fw" />
                    集計
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-2" v-show="!state.isNotDisplayChart">
      <div class="col-12">
        <h5>
          <i class="fas fa-chart-bar" />
          チャート
        </h5>
      </div>
      <div class="col-12 col-xl-4">
        <canvas ref="chartPie"></canvas>
      </div>
      <div class="col-12 col-xl-8">
        <canvas ref="chartLine"></canvas>
      </div>
    </div>

    <div class="row mt-2">
      <div class="col-12">
        <h5>
          <i class="fas fa-list" />
          リスト
        </h5>
      </div>
      <div class="col-12">
        <div class="table-responsive">
          <table class="table table-striped table-dark">
            <thead>
              <tr class="text-nowrap">
                <th scope="col" class="w-fixed">{{ cSelectedTermName }}</th>
                <th scope="col">{{ cSelectedAxisName }}</th>
                <th scope="col" class="text-right w-fixed">ポイント</th>
                <th scope="col" class="text-right w-fixed">件数</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="n in cSummaryList">
                <td>{{ n.term }}</td>
                <td>{{ n.axis }}</td>
                <td class="text-right">{{ n.point.toLocaleString() }}</td>
                <td class="text-right">{{ n.count.toLocaleString() }}</td>
              </tr>
              <tr>
                <td>合計</td>
                <td>&nbsp;</td>
                <td class="text-right">
                  {{ cSummaryTotal.point.toLocaleString() }}
                </td>
                <td class="text-right">
                  {{ cSummaryTotal.count.toLocaleString() }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="row mt-2">
      <div class="col-12">
        <h5>
          <i class="fas fa-list" />
          明細
        </h5>
      </div>
      <div class="col-12">
        <div class="table-responsive">
          <table class="table table-striped table-dark">
            <thead>
              <tr class="text-nowrap">
                <th scope="col" class="w-small">日付</th>
                <th scope="col" class="w-small">区分</th>
                <th scope="col" class="w-small">担当者</th>
                <th scope="col" class="w-medium">物件</th>
                <th scope="col" class="w-medium">売上完了日</th>
                <th scope="col" class="w-small text-right">ポイント</th>
                <th scope="col" class="w-small text-right">粗利</th>
                <th scope="col" class="w-small text-right">売上金額</th>
                <th scope="col" class="w-medium">備考</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="n in cList4Display" :key="n.t_user_points_id">
                <td class="text-nowrap">
                  {{ $$formatDay(n.changed_at, "YYYY-MM-DD") }}
                </td>
                <td class="text-nowrap">
                  {{ n.point_type_m_kv_name }}
                  <p
                    v-if="
                      n.point_type_m_kv_id ==
                      MKvsConst.TUserPoints.POINT_TYPE_M_KV_ID_GRANT
                    "
                  >
                    [ {{ n.point_grant_type_m_kv_name }} ]
                  </p>
                </td>
                <td class="text-nowrap">{{ n.m_users_full_name }}</td>
                <td class="text-truncate clamp">
                  <a
                    href="#"
                    v-if="!_.isNil(n.t_project_id)"
                    @click.prevent="
                      $$openTProjectEditOnOtherTab(n.t_project_id)
                    "
                  >
                    {{ n.t_projects_cd }}-{{ n.t_projects_name }}
                  </a>
                </td>
                <td class="text-nowrap">
                  {{ $$formatDay(n.sales_completed_at, "YYYY-MM-DD") }}
                </td>
                <td class="text-nowrap text-right">
                  {{ n.point.toLocaleString() }}
                </td>
                <td class="text-nowrap text-right">
                  {{ n.profit.toLocaleString() }}
                </td>
                <td class="text-nowrap text-right">
                  {{ n.sale_price.toLocaleString() }}
                </td>
                <td class="text-nowrap">{{ n.memo }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <a
          v-if="cIsAbleViewMore"
          href="#"
          class="pb-4"
          @click.prevent="showMoreList"
          >{{ showMoreText() }}</a
        >
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import PageMixins from "../../mixins/commons/PageMixins";

export default {
  mixins: [PageMixins],
};
</script>
<script lang="ts" setup>
import _ from "lodash";
import { Chart, ChartData, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { namedColor, transparentize } from "../../frameworks/ColorUtil";
import { computed, getCurrentInstance, reactive, watch } from "vue";
import NumberUtil from "../../frameworks/NumberUtil";
import ArrayUtil from "../../frameworks/ArrayUtil";
import axios from "axios";
import { SmUserOptionService } from "../masters/class/services/SmUserOptionService";
import { useStore } from "../../stores/mainStore";
import MKvsConst from "../../consts/MKvsConst";
import { signmisReportComposition } from "../reports/compositions/signmisReportComposition";

Chart.register(...registerables);
Chart.register(ChartDataLabels);

const _this = getCurrentInstance()?.proxy;
const store = useStore();
const { cDateFormat, cToNumber, cTermAlert, getCalcedMonth } =
  signmisReportComposition();

//検索条件定義
const conditions = reactive({
  changed_at_from: "",
  changed_at_to: "",
  sales_completed_at_from: "",
  sales_completed_at_to: "",
  m_branch_id: 0,
  m_user_id: 0,
  point_type_m_kv_id: 0,
  point_grant_type_m_kv_id: 0,
  has_project: 0,
});

const cSalesCompleteDayFrom = computed({
  get: () => conditions.sales_completed_at_from,
  set: (val) => {
    if (_.isEmpty(conditions.sales_completed_at_to)) {
      conditions.sales_completed_at_to = getCalcedMonth(val, 1);
    }
    conditions.sales_completed_at_from = val;
  },
});

//ページ状態定義
const state = reactive({
  isLoading: false,
  listLimit: 10,
  page: 1,
  anaylyze: {
    term: "YYYY",
    sum: "point",
    axis: "m_users_full_name",
  },

  analyzeLabelMap: {
    term: [
      { key: "YYYY", label: "年" },
      { key: "YYYY-MM", label: "月" },
      { key: "YYYY-MM-DD", label: "日" },
    ],
    sum: [
      { key: "point", label: "ポイント" },
      { key: "count", label: "件数" },
    ],
    axis: [{ key: "m_users_full_name", label: "担当者" }],
  },

  list: Array(),
  chartFontColor: "#CCC",
  lineChart: undefined,
  pieChart: undefined,
  isNotDisplayChart: false,
});

//検索項目担当者を変更できるフラグ
const cIsViewAllUserData = computed(
  () => store.getRole("user_points_analyse-privilege") >= 20
);

watch(
  () => state.anaylyze,
  (val) => {
    updateLineChart();
    updatePieChart();
  },
  {
    deep: true,
  }
);

watch(
  () => conditions,
  (val) => {
    clearResult();
  },
  {
    immediate: true,
    deep: true,
  }
);

const cSelectedAxisName = computed(() => {
  const found = state.analyzeLabelMap.axis.find(
    (x) => x.key == state.anaylyze.axis
  );
  return found?.label ?? "";
});
const cSelectedTermName = computed(() => {
  const found = state.analyzeLabelMap.term.find(
    (x) => x.key == state.anaylyze.term
  );
  return found?.label ?? "";
});
const cSelectedSumName = computed(() => {
  const found = state.analyzeLabelMap.axis.find(
    (x) => x.key == state.anaylyze.sum
  );
  return found?.label ?? "";
});

const cLimit = computed(() => state.page * state.listLimit);

const cList4Display = computed(() => state.list.slice(0, cLimit.value));

const cIsAbleViewMore = computed(() => cLimit.value < state.list.length);

const cSummaryTotal = computed(() => {
  const summary = {
    point: _.sumBy(cSummary.value, "point"),
    count: _.sumBy(cSummary.value, "count"),
  };

  return summary;
});

const cSummaryList = computed(() => {
  return cSummary.value.filter((item) => item.count != 0);
});

const cSummary = computed(() => {
  const list = [];
  let termFormat = state.anaylyze.term;
  //@ts-ignore
  let xLabels = _.uniq(
    //@ts-ignore
    state.list.map((x) => _this.$$formatDay(x.changed_at, termFormat))
  );
  xLabels = _.sortBy(xLabels);

  let axisFormat = state.anaylyze.axis;
  let yLabels = _.uniq(state.list.map((x) => x[axisFormat]));
  yLabels = _.sortBy(yLabels);

  // データ挿入
  for (const xL of xLabels) {
    for (const yL of yLabels) {
      const row = {
        term: xL,
        axis: yL,
        point: 0,
        count: 0,
        profit: 0.0,
        sale_price: 0.0,
      };

      const filterd = state.list.filter(
        (d) =>
          //@ts-ignore
          _this.$$formatDay(d.changed_at, termFormat) == xL &&
          d[axisFormat] == yL
      );

      if (filterd.length > 0) {
        row.point = _.sumBy(filterd, function (x) {
          return x.point;
        });
        row.count = filterd.length;
        row.profit = _.sumBy(filterd, function (x) {
          return x.profit;
        });
        row.sale_price = _.sumBy(filterd, function (x) {
          return x.sale_price;
        });
      }

      list.push(row);
    }
  }

  return list;
});

function updateLineChart() {
  const xLabels = _.uniq(cSummary.value.map((x) => x.term));
  const yLabels = _.uniq(cSummary.value.map((x) => x.axis));

  const ds = yLabels.map((yL) => {
    const dataList = [];

    for (const xL of xLabels) {
      const found = cSummary.value.find((d) => d.term === xL && d.axis === yL);

      //@ts-ignore
      const axisVal = found[state.anaylyze.sum].toFixed(2);
      // const axisVal = this.anaylyze.sum == "count" ? filterd.length : _.sumBy(filterd, this.anaylyze.sum) ;
      dataList.push(axisVal);
    }

    const dsColor = namedColor(yLabels.indexOf(yL) + 1);
    const row = {
      label: yL,
      data: dataList,
      borderColor: transparentize(dsColor, 0.5),
      backgroundColor: dsColor,
      // yAxisID : `y${yLabels.indexOf(yL)}`
    };

    return row;
  });

  if (ds.length === 0) {
    clearResult();
    return;
  }

  if (state.lineChart === undefined) {
    //@ts-ignore
    state.lineChart = new Chart(_this.$refs.chartLine, {
      type: "line",
      data: {
        labels: xLabels,
        datasets: ds,
        borderWidth: 1,
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `ポイント実績ラインチャート - ${cSelectedAxisName.value}`,
            color: state.chartFontColor,
          },
          legend: {
            labels: {
              color: state.chartFontColor,
            },
          },
          datalabels: {
            color: "#fff",
            display: true,
            align: "top",
            font: {
              // size: 18,
            },
          },
        },
        // これを入れるとカーソル合わせた時にY軸分まとめて表示
        interaction: {
          mode: "index",
          intersect: false,
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: cSelectedSumName.value,
              color: state.chartFontColor,
            },
            ticks: {
              // For a category axis, the val is the index so the lookup via getLabelForValue is needed
              color: state.chartFontColor,
            },
          },
          x: {
            title: {
              display: true,
              text: cSelectedTermName.value,
              color: state.chartFontColor,
            },
            ticks: {
              // For a category axis, the val is the index so the lookup via getLabelForValue is needed
              color: state.chartFontColor,
            },
          },
        },
      },
    });
  } else {
    //@ts-ignore
    state.lineChart.data.labels = xLabels;
    //@ts-ignore
    state.lineChart.data.datasets = ds;
    //@ts-ignore
    state.lineChart.options.plugins.title.text = `ポイント実績ラインチャート - ${cSelectedAxisName.value}`;
    //@ts-ignore
    state.lineChart.options.scales.y.title.text = cSelectedSumName.value;
    //@ts-ignore
    state.lineChart.options.scales.x.title.text = cSelectedTermName.value;
    //@ts-ignore
    state.lineChart.update();
  }
}

function updatePieChart() {
  const labels = _.uniq(cSummary.value.map((x) => x.axis));

  const dataArr = [];
  const backGroupdArr = [];

  for (const l of labels) {
    const filterd = cSummary.value.filter((d) => d.axis === l);
    const axisVal = _.sumBy(filterd, state.anaylyze.sum);
    const dsColor = namedColor(labels.indexOf(l) + 1);

    dataArr.push(axisVal);
    backGroupdArr.push(dsColor);
  }

  const ds = [
    {
      data: dataArr,
      backgroundColor: backGroupdArr,
    },
  ];

  if (dataArr.length === 0) {
    clearResult();
    return;
  }

  if (state.pieChart === undefined) {
    //@ts-ignore
    state.pieChart = new Chart(_this.$refs.chartPie, {
      type: "pie",
      data: {
        labels: labels,
        datasets: ds,
        // borderWidth: 1
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `ポイント実績 割合チャート - ${cSelectedAxisName.value}`,
            color: state.chartFontColor,
          },
          legend: {
            labels: {
              color: state.chartFontColor,
            },
          },
          datalabels: {
            formatter: (value, ctx) => {
              let sum = 0;
              let dataArr = ctx.chart.data.datasets[0].data;
              dataArr.map((data) => {
                //@ts-ignore
                sum += data;
              });
              let percentage = ((value * 100) / sum).toFixed(2) + "%";
              return percentage;
            },
            color: "#fff",
            display: true,
            align: "bottom",
            font: {
              size: 18,
            },
          },
        },
      },
    });
  } else {
    //@ts-ignore
    state.pieChart.data.labels = labels;
    //@ts-ignore
    state.pieChart.data.datasets = ds;
    //@ts-ignore
    state.pieChart.options.plugins.title.text = `ポイント実績 割合チャート - ${cSelectedAxisName.value}`;
    //@ts-ignore
    state.pieChart.update();
  }
}

function clearResult() {
  state.list.splice(0);
  if (state.lineChart !== undefined) {
    //@ts-ignore
    state.lineChart.clear();
  }
  if (state.pieChart !== undefined) {
    //@ts-ignore
    state.pieChart.clear();
  }
}

async function search() {
  state.isLoading = true;
  state.page = 1;
  let ep = "api/tUserPointSummary/retrieve4Summary";

  //整合性チェック
  if (!cIsViewAllUserData.value) {
    if (conditions.m_user_id !== store.loginMUser?.id) {
      alert("検索条件の整合性に問題があります。ページを再読み込みしてください");
      return;
    }
  }

  try {
    const res = await axios.post(ep, conditions);
    ArrayUtil.resetInsert(state.list, res.data);

    state.list.forEach((x) => {
      //区分＝使用の場合、ポイントマイナスになる
      if (
        x.point_type_m_kv_id == MKvsConst.TUserPoints.POINT_TYPE_M_KV_ID_USE
      ) {
        x.point *= -1;
      }
      x.profit = x.sale_price - x.cost;
    });

    updateLineChart();
    updatePieChart();
  } catch (error) {
    clearResult();
    //@ts-ignore
    _this.$$errorConsole(error, error.ep);
  } finally {
    state.isLoading = false;
  }
}

function showMoreList() {
  if (state.page < 3) {
    state.page++;
  } else {
    // 全て表示
    state.page = NumberUtil.ceil(state.list.length / state.listLimit);
  }
}

function showMoreText() {
  if (state.page < 3) {
    return "続きを表示";
  } else {
    return "全て表示";
  }
}

SmUserOptionService.setDefVal2State("analyze", state);

function initConditions() {
  if (!cIsViewAllUserData.value) {
    conditions.m_branch_id = store.loginMUser?.m_branch_id ?? 0;
    conditions.m_user_id = store.loginMUser?.id ?? 0;
  }
}

initConditions();
</script>

<style scoped>
/* 列ヘッダー */
.w-fixed {
  /* リスト列(年月日・金額・数量・件数)を均等幅 */
  table-layout: fixed;
  width: 17%;
}

/* 列ヘッダー */
.w-small {
  width: 80px;
}

/* 列ヘッダー */
.w-medium {
  width: 120px;
}

/* クランプ表示用 */
.clamp {
  max-width: 200px;
  /* クランプ使用時に(min,max)widthプロパティを設定 */
}

/* クランプ解除用 */
.clamp:hover {
  white-space: normal;
}
</style>
