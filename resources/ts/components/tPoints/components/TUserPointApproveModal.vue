<template>
  <div
    id="modelTUserPointApprove"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="modelTUserPointApprove"
    aria-hidden="true"
    data-backdrop="static"
    style="margin-top: 0px"
    @shown.bs.modal="onModalShow"
  >
    <validation-observer v-slot="{ invalid, errors }">
      <div class="modal-dialog modal-lg">
        <div class="app-modal-content-dark p-3">
          <div class="pt-2 mb-3">
            <h4>
              <i class="fas fa-arrow-circle-up"></i>
              ポイント使用承認
            </h4>
          </div>
          <div class="row">
            <div class="col-12 col-xl-6">
              <div class="form-group">
                <label for="">拠点</label>
                <m-branch-multi-select
                  v-model="branches.ids"
                  :set-selected-ids="branches.setIds"
                  @input="selectBranches"
                />
              </div>
            </div>
            <div class="col-12 col-xl-6">
              <div class="form-group">
                <label for="">役割</label>
                <m-tag-select
                  v-model="tags.ids"
                  :setTagIds="tags.setIds"
                  :tag-category-key="tags.key"
                  @input="selectTags"
                />
              </div>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table table-striped table-dark">
              <thead>
                <tr>
                  <th class="text-center" style="min-width: 40px">承認</th>
                  <th class="text-center" style="min-width: 20px">拒否</th>
                  <th class="text-center" style="min-width: 60px">申請日</th>
                  <th style="min-width: 60px">名前</th>
                  <th
                    class="d-none d-lg-table-cell w-short"
                    style="min-width: 60px"
                  >
                    Pt数
                  </th>
                  <th style="50%">備考</th>
                  <th style="50%">承認者コメント</th>
                </tr>
                <tr>
                  <th class="py-1 text-center">
                    <ns-checkbox-input id="approve_all" v-model="cApproveAll" />
                  </th>
                  <th class="py-1 text-center">
                    <ns-checkbox-input id="reject_all" v-model="cRejectAll" />
                  </th>

                  <th class="py-1" colspan="5"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="n in cApplyList" :key="n.id">
                  <td class="text-center">
                    <ns-checkbox-input
                      :id="n.id"
                      v-model="n.is_approved"
                      @change="handleChanged(1, n)"
                    />
                  </td>
                  <td class="text-center">
                    <ns-checkbox-input
                      :id="n.id"
                      v-model="n.is_rejected"
                      @change="handleChanged(2, n)"
                    />
                  </td>
                  <td class="text-center">
                    {{ $$formatDay(n.applied_at, "YYYY-MM-DD") }}
                  </td>
                  <td class="text-nowrap">{{ n.m_user.full_name }}</td>
                  <td class="d-none d-lg-table-cell">{{ n.point }}</td>
                  <td class="text-nowrap">{{ n.memo }}</td>
                  <td class="text-nowrap">
                    <input
                      :id="n.id"
                      v-model="n.approval_comment"
                      class="form-control"
                      aria-label="With textarea"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="text-right p-2">
                <button
                  type="button"
                  class="btn btn-primary mr-2"
                  :disabled="invalid"
                  @click.prevent="ok"
                >
                  OK
                </button>
                <button
                  type="button"
                  class="btn btn-light"
                  @click.prevent="closeModal"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </validation-observer>
  </div>
</template>
<script lang="ts" setup>
import Vue, { computed, reactive, ref } from "vue";
import _ from "lodash";
import DayJsEx from "../../../frameworks/DayJsEx";
import NsCheckboxInput from "../../commons/input/NsCheckboxInput.vue";
import MKvsConst from "../../../consts/MKvsConst";
import { useMasterStore } from "../../../stores/masterStore";
import { isEmpty } from "lodash";
import { TUserPoint } from "../models/TUserPoint";

interface IProps {
  value?: any;
}

type TpMasterSelect = {
  ids: number[];
  setIds?: number[];
  key?: string;
};

const masterStore = useMasterStore();

const branches = reactive<TpMasterSelect>({
  ids: [],
  setIds: [],
});

const tags = reactive<TpMasterSelect>({
  ids: [],
  setIds: [],
  key: "m_users-role",
});

const branchIds = ref<number[]>([]);
const tagIds = ref<number[]>([]);

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

// 申請リスト
const cApplyList = computed(() => {
  // 拠点とタグも選択されない場合は、全ての申請を表示
  if (branchIds.value.length === 0 && tagIds.value.length === 0) {
    return cValue.value.apply_list;
  }

  // 拠点とタグが選択されている場合は、フィルタリングして表示
  let users: any[] = masterStore.MUsers;

  // 拠点でユーザーをフィルタリング
  if (!isEmpty(branchIds.value) && branchIds.value.length > 0) {
    users = users.filter((user) => {
      return branchIds.value.includes(user.m_branch_id!);
    });
  }
  // タグでユーザーをフィルタリング
  if (!isEmpty(tagIds) && tagIds.value.length > 0) {
    users = users.filter((user) => {
      return tagIds.value.some((tagId) =>
        user.tags.some((tag: any) => tag.id === tagId)
      );
    });
  }

  // ユーザーでポイントをフィルタリング
  return cValue.value.apply_list.filter((point: any) => {
    return users.some((u) => u.id === point.m_user_id);
  });
});

const cApproveAll = computed({
  get: function () {
    // リスト内のcheck件数を算出
    const count = cApplyList.value.filter(
      (item: any) => item.is_approved
    ).length;
    // リスト内のcheck件数と行数を比較[全てcheck：on 以外：off]
    return 0 < count && cApplyList.value.length == count;
  },
  set: function (value) {
    console.log("cApproveAll", value);

    // リスト内のcheckに対してOn/Offを切り替える
    cApplyList.value.map((item: any) => {
      item.is_approved = value;
    });
    console.log("cApplyList", cApplyList.value);
  },
});

const cRejectAll = computed({
  get: function () {
    // リスト内のcheck件数を算出
    const count = cApplyList.value.filter(
      (item: any) => item.is_rejected
    ).length;
    // リスト内のcheck件数と行数を比較[全てcheck：on 以外：off]
    return 0 < count && cApplyList.value.length == count;
  },
  set: function (value) {
    // リスト内のcheckに対してOn/Offを切り替える
    cApplyList.value.map((item: any) => (item.is_rejected = value));
  },
});

const props = withDefaults(defineProps<IProps>(), {});

const state = reactive({
  label: "",
});

const cValue = computed(() => props.value);

interface IEmits {
  (e: "ok"): void;
}

const emit = defineEmits<IEmits>();

function selectBranches(ids: number[]) {
  branchIds.value = [];
  ids.forEach((id) => {
    branchIds.value.push(id);
  });
}

function selectTags(ids: number[]) {
  tagIds.value = [];
  ids.forEach((id) => {
    tagIds.value.push(id);
  });
}

/**
 * 承認/拒否のチェックボックスの状態を変更する
 * @param type 1: 承認, 2: 拒否
 * @param point 承認/拒否するポイント
 */
function handleChanged(type: number, point: any) {
  if (point.is_approved && point.is_rejected) {
    if (type == 1) {
      point.is_rejected = !point.is_rejected;
    } else if (type == 2) {
      point.is_approved = !point.is_approved;
    }
  }
}

function openModal() {
  $("#modelTUserPointApprove").modal();
}

function ok() {
  const approved = cApplyList.value.filter(
    (x: any) => x.is_approved === true || x.is_rejected === true
  );
  if (approved.length === 0) {
    closeModal();
  }
  let cList = [] as TUserPoint[];
  cList = approved.map((x: any) => {
    const row = TUserPoint.parse(x);
    if (x.is_approved === true) {
      row.point_type_m_kv_id = MKvsConst.TUserPoints.POINT_TYPE_M_KV_ID_USE;
      row.changed_at = DayJsEx.format(new Date(), "YYYY-MM-DD HH:mm:ss");
    } else if (x.is_rejected === true) {
      row.point_type_m_kv_id = MKvsConst.TUserPoints.POINT_TYPE_M_KV_ID_REJECT;
      row.approval_comment = x.approval_comment;
    }
    return row;
  });
  cValue.value.approve_list = cList;
  //return;
  emit("ok");
  closeModal();
}

function closeModal() {
  $("#modelTUserPointApprove").modal("hide");
}
</script>
<script lang="ts">
export default {
  components: { NsCheckboxInput },
  methods: {
    openModal: function () {
      $("#modelTUserPointApprove").modal();
    },
  },
};
</script>
