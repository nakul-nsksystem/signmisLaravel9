<template>
    <div>
        <div v-if="$$cIsError" class="mt-1 mb-0 alert alert-danger" role="alert">
            {{ dErrorData.message }}
        </div>
        <validation-observer v-slot="{ invalid }">
            <div class="row">
                <div class="col-12 col-xl-2">
                    <div class="form-group">
                        <label>拠点</label>
                        <m-branch-select v-model="cConditions.m_branch_id" />
                    </div>
                </div>
                <div class="col-12 col-xl-2 pl-xl-0">
                    <div class="form-group">
                        <label>売上完了日</label>
                        <div class="d-flex flex-no-wrap">
                            <validation-provider name="開始日" rules="required" vid="my_custom_rule_day_min" immediate
                                v-slot="{ errors }">
                                <ex-v-date-picker v-model="cSalesCompleteDayFrom" />
                                <span class="validation-error">{{ errors[0] }}</span>
                            </validation-provider>
                            <span class="px-1 pt-2">～</span>
                            <validation-provider name="終了日"
                                rules="required|custom_rule_date_or_later:my_custom_rule_day_min" immediate
                                v-slot="{ errors }">
                                <ex-v-date-picker v-model="cConditions.sales_completed_at_to" />
                                <span class="validation-error">{{ errors[0] }}</span>
                                <span class="validation-info">{{
                                    cTermAlert(cSalesCompleteDayFrom, cConditions.sales_completed_at_to) }}</span>
                            </validation-provider>
                        </div>
                    </div>
                </div>
                <slot name="row1"></slot>
            </div>
            <div class="row">
                <div class="col-12 col-xl-2">
                    <div class="form-group">
                        <label>登録担当</label>
                        <m-user-select v-model="cConditions.created_m_user_id" :m-branch-id="cConditions.m_branch_id"
                            :filter-m-tag-keys="[]" />
                    </div>
                </div>
                <div class="col-12 col-xl-2 pl-xl-0">
                    <div class="form-group">
                        <label>営業担当</label>
                        <m-user-select v-model="cConditions.sales_m_user_id" :m-branch-id="cConditions.m_branch_id"
                            :filter-m-tag-keys="['m_users-role-sales']" />
                    </div>
                </div>
                <div class="col-12 col-xl-3 pl-xl-0">
                    <div class="form-group">
                        <label>取引先</label>
                        <m-customer-ref-input v-model="cConditions.m_customer_id" :m-branch-id="cConditions.m_branch_id"
                            :dealing-cds=[1] />
                    </div>
                </div>
                <div class="col-12 col-xl-2 pl-xl-0">
                    <div class="form-group">
                        <label>利益率</label>
                        <div class="d-flex flex-no-wrap">
                            <input type="number" class="form-control" v-model="cConditions.profit_per_from">
                            <span class="px-1 pt-2">～</span>
                            <input type="number" class="form-control" v-model="cConditions.profit_per_to">
                        </div>
                    </div>
                </div>
                <slot name="row2"></slot>
            </div>
            <div class="text-right">
                <button type="button" :disabled="invalid" class="btn btn-success" @click.prevent="search">
                    <div>
                        <i class="fas fa-search fa-fw" />
                        検索
                    </div>
                </button>
                <button type="button" class="btn btn-secondary" @click.prevent="clear">
                    <i class="fas fa-eraser fa-fw"></i>
                    クリア
                </button>
            </div>
        </validation-observer>
    </div>
</template>

<script setup lang="ts">
import _ from "lodash";
import axios from 'axios';
import { computed, getCurrentInstance, reactive, ref } from 'vue';
import ArrayUtil from "../../../frameworks/ArrayUtil";

import { useStore } from '../../../stores/mainStore';
import { useMasterStore } from "../../../stores/masterStore";
import { signmisReportComposition } from "../../reports/compositions/signmisReportComposition"
const store = useStore();
const masterStore = useMasterStore();
const _this = getCurrentInstance()?.proxy;

const { cDateFormat, cToNumber, cSummary, cTermAlert, getCalcedMonth } = signmisReportComposition();

interface IProps {
    conditions?: any,
}
const props = withDefaults(defineProps<IProps>(), {})

interface IEmits {
    (e: 'search'): void
    (e: 'clear'): void
}

const emit = defineEmits<IEmits>();

const cConditions = computed(() => props.conditions);

const cSalesCompleteDayFrom = computed({
    get: () => cConditions.value.sales_completed_at_from,
    set: (val) => {
        if (_.isEmpty(cConditions.value.sales_completed_at_to)) {
            cConditions.value.sales_completed_at_to = getCalcedMonth(val, 1);
        }
        cConditions.value.sales_completed_at_from = val;
    }
})


//帳票データ取得
function search() {
    emit("search")
}

function clear() {
    emit("clear")
}

</script>
