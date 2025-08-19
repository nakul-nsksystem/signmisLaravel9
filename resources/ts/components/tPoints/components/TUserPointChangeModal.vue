<template>
  <div
    id="modelTUserPointChange"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="modelTUserPointChange"
    aria-hidden="true"
    data-backdrop="static"
    style="margin-top: 0px"
    @shown.bs.modal="onModalShow"
  >
    <validation-observer v-slot="{ invalid, errors }">
      <div class="modal-dialog modal-lg">
        <div class="app-modal-content-dark p-3">
          <div class="pt-2 mb-3">
            <h4
              v-if="
                cValue.point_type_m_kv_id ==
                MKvsConst.TUserPoints.POINT_TYPE_M_KV_ID_GRANT
              "
            >
              <i class="fas fa-arrow-circle-up"></i>
              ポイント付与
            </h4>
            <h4 v-else>
              <i class="fas fa-arrow-circle-down"></i>
              ポイント使用
            </h4>
          </div>

          <div class="row mb-3">
            <div class="col-4">
              <div class="form-group">
                <label>ポイント種類</label>
                <div class="d-flex flex-no-wrap">
                  <select
                    class="form-control"
                    :disabled="true"
                    v-model="cValue.point_type_m_kv_id"
                  >
                    <option value=""></option>
                    <option value="6000001">付与</option>
                    <option value="6000002">使用</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-12">
              <div class="form-group">
                <label>発生日</label>
                <ex-v-date-picker v-model="cValue.changed_at" />
              </div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-4">
              <div class="form-group">
                <label>ポイント数</label>
                <validation-provider
                  v-if="
                    cValue.point_type_m_kv_id ==
                    MKvsConst.TUserPoints.POINT_TYPE_M_KV_ID_GRANT
                  "
                  name="ポイント数"
                  rules="required|min_value:1"
                  immediate
                  :bails="false"
                  v-slot="{ errors }"
                >
                  <ns-number-input v-model="cValue.point" />
                  <span v-if="errors" class="validation-error">{{
                    errors[0]
                  }}</span>
                </validation-provider>
                <validation-provider
                  v-else
                  name="ポイント数"
                  rules="required|min_value:1|custom_rule_number_to:my_custom_rule1"
                  immediate
                  :bails="false"
                  v-slot="{ errors }"
                >
                  <ns-number-input v-model="cValue.point" />
                  <span v-if="errors" class="validation-error">{{
                    errors[0]
                  }}</span>
                </validation-provider>
                <validation-provider
                  name="ポイント使用上限"
                  vid="my_custom_rule1"
                  :bails="false"
                  v-slot="{ errors }"
                >
                  <input
                    type="hidden"
                    v-model="cValue.limit_point"
                    class="form-control"
                  />
                </validation-provider>
              </div>
            </div>
          </div>
          <!-- <div class="row mb-3">
                        <div class="col-4">
                            <div class="form-group">
                                <label>総ポイント数</label>
                                <validation-provider name="総ポイント数" rules="required|min_value:0" immediate :bails="false"
                                    v-slot="{ errors }">
                                    <ns-number-input disabled v-model="cTotalPoint" />
                                    <span v-if="errors" class="validation-error">{{ errors[0] }}</span>
                                </validation-provider>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-4">
                            <div class="form-group">
                                <label>{{ cName }}</label>
                                <validation-provider :name="cName" rules="required|min_value:0" immediate :bails="false"
                                    v-slot="{ errors }">
                                    <ns-number-input disabled v-model="cDatePoint" />
                                    <span v-if="errors" class="validation-error">{{ errors[0] }}</span>
                                </validation-provider>
                            </div>
                        </div>
                    </div> -->
          <div class="row mb-3">
            <div class="col-12">
              <div class="form-group">
                <label for="purchaseOrderMemo">備考</label>
                <input
                  v-model="cValue.memo"
                  class="form-control"
                  aria-label="With textarea"
                />
              </div>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table table-striped table-dark">
              <thead>
                <tr>
                  <th class="text-right" style="width: 50%">{{ cLabel }}</th>
                  <th class="text-right" style="width: 50%">総ポイント数</th>
                </tr>
              </thead>
              <tbody>
                <td class="text-right">
                  <validation-provider
                    :name="cLabel"
                    rules="required|min_value:0"
                    immediate
                    v-slot="{ errors }"
                  >
                    <input type="hidden" v-model="cDatePoint" />
                    {{ cDatePoint }}
                    <span class="validation-error">{{ errors[0] }}</span>
                  </validation-provider>
                </td>
                <td class="text-right">
                  <validation-provider
                    name="総ポイント数"
                    rules="required|min_value:0"
                    immediate
                    v-slot="{ errors }"
                  >
                    <input type="hidden" v-model="cTotalPoint" />
                    {{ cTotalPoint }}
                    <span class="validation-error">{{ errors[0] }}</span>
                  </validation-provider>
                </td>
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
import NsCheckboxInput from "../../commons/input/NsCheckboxInput.vue";
import MKvsConst from "../../../consts/MKvsConst";
import DayJsEx from "../../../frameworks/DayJsEx";

interface IProps {
  value?: any;
}
const props = withDefaults(defineProps<IProps>(), {});

const state = reactive({
  label: "",
});

const cValue = computed(() => props.value);

const cTotalPoint = computed({
  get() {
    const totalPoints = _.sumBy(cValue.value.point_list, "calc_point");

    // 根据 point_type_m_kv_id 的不同，调整计算逻辑
    if (
      cValue.value.point_type_m_kv_id ===
      MKvsConst.TUserPoints.POINT_TYPE_M_KV_ID_USE
    ) {
      return totalPoints - cValue.value.point;
    } else {
      return totalPoints + cValue.value.point;
    }
  },
  set() {},
});

const cDatePoint = computed({
  get() {
    const changedAtDate = new Date(cValue.value.changed_at);
    const list = _.filter(cValue.value.point_list, function (x) {
      return new Date(x.changed_at) <= changedAtDate;
    });
    const totalPoints = _.sumBy(list, "calc_point");

    // 根据 point_type_m_kv_id 的不同，调整计算逻辑
    if (
      cValue.value.point_type_m_kv_id ===
      MKvsConst.TUserPoints.POINT_TYPE_M_KV_ID_USE
    ) {
      return totalPoints - cValue.value.point;
    } else {
      return totalPoints + cValue.value.point;
    }
  },
  set() {},
});

const cLabel = computed({
  get() {
    return (
      DayJsEx.format(cValue.value.changed_at, "YYYY-MM-DD") + "までのポイント数"
    );
  },
  set(value: string) {
    state.label = value;
  },
});

interface IEmits {
  (e: "ok"): void;
}

const emit = defineEmits<IEmits>();

function openModal() {
  $("#modelTUserPointChange").modal();
}

function ok() {
  emit("ok");
  closeModal();
}

function closeModal() {
  $("#modelTUserPointChange").modal("hide");
}
</script>
<script lang="ts">
export default {
  components: { NsCheckboxInput },
  methods: {
    openModal: function () {
      $("#modelTUserPointChange").modal();
    },
  },
};
</script>
