<template>
  <div>
    <div v-show="$$cIsError" class="mt-1 mb-0 alert alert-danger" role="alert">
      {{ dErrorData.message }}
    </div>
    <div v-show="state.isSuccess" class="alert alert-success" role="alert">
      保存しました
    </div>
    <div v-if="cIsPointAdmin" class="p-3 bg-app-secondaly">
      <div class="row">
        <div class="col-12 col-xl-3">
          <div class="form-group">
            <label for="">拠点</label>
            <m-branch-multi-select
              v-model="branches.ids"
              :set-selected-ids="branches.setIds"
            />
          </div>
        </div>
        <div class="col-12 col-xl-3">
          <div class="form-group">
            <label for="">役割</label>
            <m-tag-select
              v-model="tags.ids"
              :setTagIds="tags.setIds"
              :tag-category-key="tags.key"
            />
          </div>
        </div>
        <div class="col-12 col-xl-6">
          <div class="form-group">
            <div class="float-right">
              <button
                type="button"
                class="btn btn-success"
                @click.prevent="approve()"
              >
                使用承認
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="form-group">
            <label for="">ユーザー</label>
            <m-user-multi-select
              v-model="cMUserIds"
              :defaultIsSelected="false"
              :filter-m-branch-ids="branches.ids"
              :filter-tag-keys="cTagKeys"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col-12 pt-2 pt-xl-0">
        <nav>
          <ul
            class="nav nav-tabs navbar-dark border-bottom-0"
            id="point-nav-category"
          >
            <li class="nav-item" v-for="key in cMUserIds" :key="key">
              <a
                class="nav-link"
                :class="{
                  active: key == state.firstSelectedId,
                }"
                :id="key"
                data-toggle="tab"
                :href="`#nav-cat-${key}`"
                role="tab"
                :aria-controls="key"
                :aria-selected="key == state.firstSelectedId"
                @click.prevent="setFirstSelected(key)"
              >
                <i class="fas fa-user fa-fw pr-2"></i>{{ cUserName(key) }}
              </a>
            </li>
          </ul>
        </nav>
        <div class="tab-content" id="nav-tabContent">
          <div
            v-for="key in cMUserIds"
            :key="key"
            class="tab-pane fade show"
            :class="{ active: key == state.firstSelectedId }"
            :id="`nav-cat-${key}`"
            role="tabpanel"
            :aria-labelledby="key"
          >
            <div class="row">
              <div class="col-12">
                <div class="p-3 bg-app-secondaly">
                  <div class="row">
                    <div class="col-12">
                      <div class="form-group d-flex flex-no-wrap">
                        <div>
                          <label>日付</label>
                          <div class="d-flex flex-no-wrap">
                            <ex-v-date-picker
                              v-model="state.sumDates[String(key)]"
                              @input="handleInput(String(key))"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="!cIsPointAdmin">
                    <div class="row">
                      <div class="col-xl-8">
                        <h5>
                          <i class="fas fa-list"></i>
                          ポイント申請リスト
                        </h5>
                      </div>

                      <div class="col-xl-4">
                        <div class="form-group">
                          <div class="mb-2 float-right">
                            <label>&nbsp;</label>
                            <div>
                              <button
                                type="button"
                                class="btn btn-success"
                                @click.prevent="apply(key)"
                                :disabled="cSummaryTotal <= 0"
                              >
                                使用申請
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <table class="table table-striped table-dark mb-0">
                      <thead>
                        <tr>
                          <th style="min-width: 200px" class="text-center">
                            日付
                          </th>
                          <th style="min-width: 240px">区分</th>
                          <th style="min-width: 200px" class="text-right">
                            ポイント
                          </th>
                          <th style="width: 50%">備考</th>
                          <th style="width: 50%">承認コメント</th>
                          <th style="min-width: 130px">&nbsp;</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="n in state.appliedPoints" :key="n.id">
                          <td class="text-center">
                            {{ cDateFormat(n.changed_at) }}
                          </td>
                          <td>
                            {{ n.point_type_name }}
                          </td>
                          <td class="text-right">
                            {{ cToNumber(n.calc_point) }}
                          </td>
                          <td>{{ n.memo }}</td>
                          <td>{{ n.approval_comment }}</td>
                          <td>
                            <button
                              type="button"
                              class="btn btn-success"
                              v-if="canEdit(n)"
                              @click.prevent="editApply(n)"
                            >
                              <i class="fas fa-edit fa-fw"></i>
                            </button>
                            <button
                              type="button"
                              class="btn btn-danger"
                              v-if="canEdit(n)"
                              @click.prevent="del(n)"
                            >
                              <i class="fas fa-trash fa-fw"></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div class="row" :class="!cIsPointAdmin ? 'mt-3' : ''">
                    <div class="col-xl-8">
                      <h5>
                        <i class="fas fa-list"></i>
                        明細
                      </h5>
                    </div>
                    <div class="col-12 col-xl-4">
                      <!-- 合計とポイント上限を表示する -->
                      <label>&nbsp;</label>
                      <div class="row mr-1">
                        <!-- <div class="col-xl-6" v-if="!cIsPointAdmin" ><label>&nbsp;</label></div> -->
                        <div class="d-flex flex-fill">
                          <table class="table table-bordered text-white">
                            <tbody>
                              <tr>
                                <th style="width: 50%">所有ポイント</th>
                                <td style="width: 50%" class="text-right">
                                  {{ cSummaryTotal.toLocaleString() }}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <div style="min-width: 172px" v-if="cIsPointAdmin">
                            <div class="form-group">
                              <button
                                type="button"
                                class="btn btn-primary"
                                @click.prevent="add(key)"
                              >
                                <div>
                                  <i class="fas fa-plus fa-fw" />
                                  追加
                                </div>
                              </button>
                              <button
                                type="button"
                                class="btn btn-secondary ml-2"
                                @click.prevent="use(key)"
                              >
                                <i class="fas fa-minus fa-fw"></i>
                                使用
                              </button>
                            </div>
                          </div>
                        </div>
                        <!-- <div style="min-width: 200px" >
                          <div class="form-group">
                            <div class="float-right">
                              <button
                                type="button"
                                class="btn btn-primary"
                                @click.prevent="add(key)"
                              >
                                <div>
                                  <i class="fas fa-plus fa-fw" />
                                  追加
                                </div>
                              </button>
                              <button
                                type="button"
                                class="btn btn-secondary ml-2"
                                @click.prevent="use(key)"
                              >
                                <i class="fas fa-minus fa-fw"></i>
                                使用
                              </button>
                            </div>
                          </div>
                        </div> -->
                      </div>
                    </div>
                  </div>
                  <div class="table-responsive">
                    <table class="table table-striped table-dark mb-0">
                      <thead>
                        <tr>
                          <th style="min-width: 200px" class="text-center">
                            日付
                          </th>
                          <th style="min-width: 240px">区分</th>
                          <th style="min-width: 240px">売上日</th>
                          <th style="min-width: 600px">物件名</th>
                          <th style="min-width: 200px" class="text-right">
                            ポイント
                          </th>
                          <th style="width: 100%">備考</th>
                          <th style="min-width: 60px">&nbsp;</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="n in state.userPoints" :key="n.id">
                          <td class="text-center">
                            {{ cDateFormat(n.changed_at) }}
                          </td>
                          <td>
                            {{ n.point_type_name }}
                          </td>
                          <td>
                            {{
                              $$formatDay(
                                n.t_project?.sales_completed_at,
                                "YYYY-MM-DD"
                              )
                            }}
                          </td>
                          <td>
                            {{ n.t_project?.cd }}
                            {{ n.t_project ? "-" : "" }}
                            {{ n.t_project?.name }}
                          </td>
                          <td class="text-right">
                            {{ cToNumber(n.calc_point) }}
                          </td>
                          <td>{{ n.memo }}</td>
                          <td>
                            <button
                              type="button"
                              class="btn btn-success"
                              v-if="canEdit(n)"
                              @click.prevent="edit(n)"
                            >
                              <i class="fas fa-edit fa-fw"></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
    <t-user-point-change-modal
      v-model="changeModalState"
      ref="changeModal"
      @ok="savePoint"
    />
    <t-user-point-apply-modal
      v-model="applyModalState"
      ref="applyModal"
      @ok="applyPoint"
    />
    <t-user-point-approve-modal
      v-model="approveModalState"
      ref="approveModal"
      @ok="approvePoint"
    />
  </div>
</template>
<script lang="ts" setup>
import axios from "axios";
import { isEmpty } from "lodash";
import MKvsConst from "../../consts/MKvsConst";
import {
  nextTick,
  watch,
  computed,
  onBeforeMount,
  onMounted,
  reactive,
  getCurrentInstance,
  ref,
} from "vue";
import { useMasterStore } from "../../stores/masterStore";
import { useStore } from "../../stores/mainStore";
import { signmisReportComposition } from "../reports/compositions/signmisReportComposition";
import { TUserPoint } from "./models/TUserPoint";
import _, { isNil, filter } from "lodash";
import DayJsEx from "../../frameworks/DayJsEx";
import { get } from "jquery";
import ArrayUtil from "../../frameworks/ArrayUtil";

const masterStore = useMasterStore();
const store = useStore();
const _this = getCurrentInstance()?.proxy;
const { cDateFormat, cToNumber } = signmisReportComposition();
const smKey = 8010506; //ポイント使用上限

//検索項目担当者を変更できるフラグ
const cIsPointAdmin = computed(
  () => store.getRole("point_admin-privilege") >= 20
);

type TpMasterSelect = {
  ids: number[];
  setIds?: number[];
  key?: string;
};

type TpUserPointLists = {
  [userId: string]: any[];
};

type TpUserSumDates = { [userId: string]: string };

const state = reactive<{
  list: TpUserPointLists;
  sumDates: TpUserSumDates;
  userPoints: any[];
  appliedPoints: any[];
  loading: boolean;
  firstSelectedId?: number;
  isSuccess: boolean;
  limitPoint?: number;
}>({
  list: {},
  sumDates: {},
  userPoints: [],
  appliedPoints: [],
  loading: false,
  firstSelectedId: undefined,
  isSuccess: false,
  limitPoint: undefined,
});

watch(
  () => state.firstSelectedId,
  (newVal) => {
    if (newVal) {
      nextTick(() => {
        getByMUserId(state.firstSelectedId);
      });
    }
  },
  { immediate: true }
);

// 更新モーダル
const changeModal = ref();
// 申請モーダル
const applyModal = ref();
//　承認モーダル
const approveModal = ref();

const changeModalState = reactive({
  id: undefined as number | undefined,
  point_type_m_kv_id: 0,
  point_grant_type_m_kv_id: 0,
  t_project_id: null,
  changed_at: "",
  point: 0,
  memo: "",
  m_user_id: 0,
  point_list: [] as any[],
  limit_point: undefined as number | undefined,
});

const applyModalState = reactive({
  id: undefined as number | undefined,
  point_type_m_kv_id: 0,
  point_grant_type_m_kv_id: 0,
  t_project_id: null,
  changed_at: "",
  applied_at: "",
  point: 0,
  memo: "",
  m_user_id: 0,
  point_list: [] as any[],
  limit_point: undefined as number | undefined,
});

const approveModalState = reactive({
  apply_list: [] as any[],
  approve_list: [] as any[],
});

const branches = reactive<TpMasterSelect>({
  ids: [],
  setIds: [],
});

const tags = reactive<TpMasterSelect>({
  ids: [],
  setIds: [],
  key: "m_users-role",
});

const cUserRoleTags = computed(() => {
  const tagCat = masterStore.MTagCategories.find(
    (x) => x.tag_category_key == tags.key
  );
  return tagCat?.m_tags ?? [];
});

const cTagKeys = computed(() => {
  const selected = cUserRoleTags.value.filter((x) => tags.ids.includes(x.id!));
  return selected.map((x) => x.tag_key);
});

const users = reactive<TpMasterSelect>({
  ids: [],
});

//選択したユーザーリスト
const cMUserIds = computed({
  get: () => users.ids,
  set: (v) => {
    users.ids = v;
    getByMUserId();
  },
});

const cEp = computed(() => `api/tUserPoint`);

//個人ポイント集計
const cSummaryTotal = computed(() => {
  const list: any[] = [];
  if (!state.firstSelectedId || !state.list[state.firstSelectedId]) return 0;
  for (const row of state.userPoints) {
    if (
      row.point_type == MKvsConst.TUserPoints.POINT_TYPE_M_KV_ID_APPLY ||
      row.point_type == MKvsConst.TUserPoints.POINT_TYPE_M_KV_ID_REJECT
    )
      continue;
    list.push({ point: row.calc_point });
  }
  return _.sumBy(list, "point");
});

const cIsDefaultTabSelected = computed(() => cMUserIds.value.length == 1);

const cUserName = computed(() => (id: string) => {
  return masterStore.getMUserById(Number(id))?.full_name ?? "";
});

/**
 * ユーザーのポイント履歴の取得
 * @param userId ユーザーId
 */
async function getByMUserId(userId: number = 0) {
  let mUserId = 0;
  //userId指定なし
  if (userId == 0) {
    if (isEmpty(cMUserIds.value)) {
      state.list = {};
    } else {
      const exitstsIds = Object.keys(state.list);
      const addedUserId = cMUserIds.value.find(
        (x) => !exitstsIds.includes(String(x))
      );

      setFirstSelectId();

      if (addedUserId) {
        mUserId = addedUserId;
      }
    }
  } else {
    mUserId = userId;
  }

  //
  if (mUserId > 0) {
    let ep = "api/tUserPoint/getByMUserId";

    try {
      state.loading = true;
      const sumDate = state.sumDates[String(mUserId)];
      if (!sumDate) {
        state.sumDates[mUserId] = getFirstDayOfMonth();
      }
      const condistions = { userId: mUserId, date: state.sumDates[mUserId] };
      const res = await axios.post(`${ep}`, condistions);

      const parsed = res.data.map((x: any) => TUserPoint.parse(x));
      state.list = {
        ...state.list,
        [mUserId]: parsed.map((row: any) => {
          let userPoint = {
            id: row.id,
            m_user_id: row.m_user_id,
            changed_at: row.changed_at,
            applied_at: row.applied_at,
            point: row.point,
            calc_point: row.point,
            memo: row.memo,
            approval_comment: row.approval_comment,
            point_type: row.point_type_m_kv_id,
            point_type_name: row.point_type_m_kv?.kv_name,
            point_grant_type: row.point_grant_type_m_kv_id,
            point_grant_type_name: row.point_grant_type_m_kv?.kv_name,
            t_project: row.t_project,
          };

          if (
            row.point_type_m_kv_id ==
              MKvsConst.TUserPoints.POINT_TYPE_M_KV_ID_GRANT ||
            row.point_type_m_kv_id == 6000000
          ) {
            if (
              row.point_type_m_kv_id ==
              MKvsConst.TUserPoints.POINT_TYPE_M_KV_ID_GRANT
            ) {
              userPoint.point_type_name +=
                "[" + row.point_grant_type_m_kv?.kv_name + "]";
            }
          } else {
            userPoint.calc_point = userPoint.calc_point * -1;
          }
          return userPoint;
        }),
      };
      getUserPointList();
    } catch (error) {
      //@ts-ignore
      _this.$$errorConsole(error, ep);
    } finally {
      state.loading = false;
    }
  }
}

//一番最初のユーザータブに設定
const setFirstSelectId = () => {
  //初回または1Userしか選択されていない場合
  if (cMUserIds.value.length == 1) {
    state.firstSelectedId = cMUserIds.value[0];
  }
  //全てのユーザーの選択が解除された場合
  else if (cMUserIds.value.length == 0) {
    state.firstSelectedId = undefined;
  }
  //初回選択のUserが選択解除された場合
  else if (
    state.firstSelectedId &&
    !cMUserIds.value.includes(state.firstSelectedId)
  ) {
    state.firstSelectedId = cMUserIds.value[0];
  }
};

// ポイント付与
const add = (userId: number) => {
  let userPoint = {} as TUserPoint;
  userPoint.m_user_id = userId;
  userPoint.point_type_m_kv_id = MKvsConst.TUserPoints.POINT_TYPE_M_KV_ID_GRANT;
  initChangeModalState(userPoint);
  changeModal.value.openModal();
};

// ポイント使用
function use(userId: number) {
  if (cSummaryTotal.value <= 0) return;
  let userPoint = {} as TUserPoint;
  userPoint.m_user_id = userId;
  userPoint.point_type_m_kv_id = MKvsConst.TUserPoints.POINT_TYPE_M_KV_ID_USE;
  initChangeModalState(userPoint);
  changeModal.value.openModal();
}

// ポイント編集
function edit(row: any) {
  let userPoint = {} as TUserPoint;
  userPoint.id = row.id;
  userPoint.m_user_id = row.m_user_id;
  userPoint.changed_at = row.changed_at;
  userPoint.point_type_m_kv_id = row.point_type;
  userPoint.point_grant_type_m_kv_id = row.point_grant_type;
  userPoint.point = row.point;
  userPoint.memo = row.memo;
  initChangeModalState(userPoint);
  changeModal.value.openModal();
}

// ポイント使用申請
function apply(userId: number) {
  if (cSummaryTotal.value <= 0) return;
  applyModalState.id = 0;
  applyModalState.m_user_id = userId;
  applyModalState.point_type_m_kv_id =
    MKvsConst.TUserPoints.POINT_TYPE_M_KV_ID_APPLY;
  applyModalState.point_grant_type_m_kv_id = 0;
  applyModalState.point = 0;
  applyModalState.memo = "";
  applyModalState.changed_at = DayJsEx.format(
    new Date(),
    "YYYY-MM-DD HH:mm:ss"
  );
  applyModalState.applied_at = DayJsEx.format(new Date(), "YYYY-MM-DD");

  applyModalState.point_list = state.userPoints;
  console.log("applyModalState.point_list", applyModalState.point_list);
  applyModalState.limit_point = state.limitPoint;
  applyModal.value.openModal();
}

function editApply(row: any) {
  applyModalState.id = row.id;
  applyModalState.m_user_id = row.m_user_id;
  applyModalState.point_type_m_kv_id =
    MKvsConst.TUserPoints.POINT_TYPE_M_KV_ID_APPLY;
  applyModalState.point_grant_type_m_kv_id = 0;
  applyModalState.point = row.point;
  applyModalState.memo = row.memo;
  applyModalState.changed_at = row.changed_at;
  applyModalState.applied_at = row.applied_at;
  applyModalState.point_list = state.userPoints;
  applyModalState.limit_point = state.limitPoint;

  applyModal.value.openModal();
}

async function approve() {
  approveModalState.apply_list = [];
  approveModalState.approve_list = [];
  let ep = `${cEp.value}/getApproveList`;
  try {
    const res1 = await axios.post(ep);
    const parsed = res1.data.map((x: any) => TUserPoint.parse(x));

    approveModalState.apply_list = parsed.map((row: any) => {
      let userPoint = {};
      Object.assign(userPoint, row, { is_approved: false, is_rejected: false });
      return userPoint;
    });

    //ArrayUtil.resetInsert(approveModalState.apply_list, parsed);
  } catch (error) {
    //@ts-ignore
    _this.$$errorConsole(error, ep);
  }
  approveModal.value.openModal();
}

/**
 * ポイント削除
 */
async function del(row: any) {
  if (!confirm(`使用申請を削除してもよろしいですか？`)) return;

  state.loading = true;
  state.isSuccess = false;
  let ep = cEp.value;
  try {
    const res = await axios.delete(`${ep}/${row.id}`);
    // データ更新成功
    state.isSuccess = true;
    //ポイント履歴更新
    getByMUserId(row.m_user_id);
  } catch (error) {
    //@ts-ignore
    _this.$$errorConsole(error, ep);
  } finally {
    state.loading = false;
  }
}

/**
 * ポイント
 * @param userPoint ユーザーPt
 */
function initChangeModalState(userPoint: TUserPoint) {
  changeModalState.id = userPoint.id;
  changeModalState.m_user_id = userPoint.m_user_id;
  changeModalState.point_type_m_kv_id = userPoint.point_type_m_kv_id;
  changeModalState.point_grant_type_m_kv_id =
    userPoint.point_type_m_kv_id ==
    MKvsConst.TUserPoints.POINT_TYPE_M_KV_ID_GRANT
      ? MKvsConst.TUserPoints.POINT_GRANT_TYPE_M_KV_ID_BONUS
      : 0;
  if (isNil(changeModalState.id)) {
    changeModalState.point = 0;
    changeModalState.memo = "";
    changeModalState.changed_at = DayJsEx.format(
      new Date(),
      "YYYY-MM-DD HH:mm:ss"
    );
  } else {
    changeModalState.point = userPoint.point;
    changeModalState.memo = userPoint.memo ?? "";
    changeModalState.changed_at = userPoint.changed_at! as string;
  }

  changeModalState.point_list = state.userPoints;
  changeModalState.limit_point = state.limitPoint;
}

/**
 * ポイント付与/使用
 */
async function savePoint() {
  state.loading = true;
  state.isSuccess = false;
  let ep = cEp.value;
  try {
    const isNew = isNil(changeModalState.id);
    let res;
    let row = TUserPoint.parse(changeModalState);
    row.updated_m_user_id = store.loginMUser?.id ?? 0;
    if (isNew) {
      row.created_m_user_id = store.loginMUser?.id ?? 0;
      res = await axios.post(ep, row);
    } else {
      res = await axios.put(`${ep}/${row.id}`, row);
    }

    // データ更新成功
    state.isSuccess = true;
    //ポイント履歴更新
    getByMUserId(row.m_user_id);
  } catch (error) {
    //@ts-ignore
    _this.$$errorConsole(error, ep);
  } finally {
    state.loading = false;
  }
}

/**
 * ポイント使用申請
 */
async function applyPoint() {
  state.loading = true;
  state.isSuccess = false;
  let ep = cEp.value;
  try {
    let res;
    let row = TUserPoint.parse(applyModalState);
    row.updated_m_user_id = store.loginMUser?.id ?? 0;
    if (row.id == 0) {
      row.created_m_user_id = store.loginMUser?.id ?? 0;
      res = await axios.post(ep, row);
    } else {
      res = await axios.put(`${ep}/${row.id}`, row);
    }

    // データ更新成功
    state.isSuccess = true;
    //ポイント履歴更新
    getByMUserId(row.m_user_id);
  } catch (error) {
    //@ts-ignore
    _this.$$errorConsole(error, ep);
  } finally {
    state.loading = false;
  }
}

async function approvePoint() {
  state.loading = true;
  state.isSuccess = false;
  let ep = cEp.value;
  try {
    const res = await axios.post(
      `${ep}/approve`,
      approveModalState.approve_list
    );
    // データ更新成功
    state.isSuccess = true;
    //ポイント履歴更新
    getByMUserId();
  } catch (error) {
    //@ts-ignore
    _this.$$errorConsole(error, ep);
  } finally {
    state.loading = false;
  }
}

function setFirstSelected(key: number) {
  state.firstSelectedId = key;
}

function canEdit(x: any) {
  if (cIsPointAdmin.value === true) {
    if (
      x.point_type == MKvsConst.TUserPoints.POINT_TYPE_M_KV_ID_USE ||
      x.point_grant_type == MKvsConst.TUserPoints.POINT_GRANT_TYPE_M_KV_ID_BONUS
    )
      return true;
  } else {
    if (x.point_type == MKvsConst.TUserPoints.POINT_TYPE_M_KV_ID_APPLY)
      return true;
  }
  return false;
}

function getFirstDayOfMonth() {
  const date = new Date();
  date.setDate(1); // 現在の月の初日を設定
  return date.toISOString().split("T")[0]; // 'YYYY-MM-DD' 形式で日付を返す
}

// ユーザーポイントリストの再計算
function getUserPointList() {
  if (!state.firstSelectedId || !state.list[String(state.firstSelectedId)]) {
    state.userPoints = [];
    state.appliedPoints = [];
    return;
  }
  const list = state.list[String(state.firstSelectedId)];
  state.userPoints = list.filter((x) => {
    return (
      x.point_type !== MKvsConst.TUserPoints.POINT_TYPE_M_KV_ID_APPLY &&
      x.point_type !== MKvsConst.TUserPoints.POINT_TYPE_M_KV_ID_REJECT
    );
  });

  state.appliedPoints = list.filter((x) => {
    return (
      x.point_type == MKvsConst.TUserPoints.POINT_TYPE_M_KV_ID_APPLY ||
      x.point_type == MKvsConst.TUserPoints.POINT_TYPE_M_KV_ID_REJECT
    );
  });
}

function handleInput(id: string) {
  //getUserPointList();
  const mUserId = Number(id);
  getByMUserId(mUserId);
}

onMounted(() => {
  if (cIsPointAdmin.value) return;
  const limit = masterStore.getSMOptionValByKeyMKvId(smKey);
  state.limitPoint = typeof limit === "number" ? limit : undefined;
  cMUserIds.value = [...cMUserIds.value, store.loginMUser?.id ?? 0];
});
</script>

<style lang="scss" scoped>
td,
th {
  // white-space: nowrap;
  vertical-align: middle;
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
