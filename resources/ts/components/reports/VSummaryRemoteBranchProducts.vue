<template>
    <div>
        <sr-container :conditions="conditions" @initConditions="initConditions">
            <template v-slot:header>
                <div class="row">
                    <div class="col-12 col-xl-3 pl-xl-0">
                        <div class="form-group ml-xl-4">
                            <label>請求予定日</label>
                            <div class="d-flex flex-no-wrap">
                                <validation-provider
                                    name="開始日"
                                    rules="required"
                                    vid="my_custom_rule_day_min"
                                    immediate
                                    v-slot="{ errors }"
                                >
                                    <ex-v-date-picker
                                        v-model="cCompleteDayFrom"
                                    />
                                    <span class="validation-error">{{
                                        errors[0]
                                    }}</span>
                                </validation-provider>
                                <span class="px-1 pt-2">～</span>
                                <validation-provider
                                    name="終了日"
                                    rules="required|custom_rule_date_or_later:my_custom_rule_day_min"
                                    immediate
                                    v-slot="{ errors }"
                                >
                                    <ex-v-date-picker
                                        v-model="
                                            conditions.complete_day_to
                                        "
                                    />
                                    <span class="validation-error">{{
                                        errors[0]
                                    }}</span>
                                    <span class="validation-info">{{
                                        cTermAlert(
                                            cCompleteDayFrom,
                                            conditions.complete_day_to
                                        )
                                    }}</span>
                                </validation-provider>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-xl-1">
                        <div class="form-group">
                            <label>受注拠点</label>
                            <m-branch-select
                                v-model="conditions.m_branch_id"
                            />
                        </div>
                    </div>
                    <div class="col-12 col-xl-1">
                        <div class="form-group">
                            <label>生産拠点</label>
                            <m-branch-select
                                v-model="conditions.product_m_branch_id"
                            />
                        </div>
                    </div>
                </div>
            </template>

            <template v-slot:th>
                <sr-th v-model="conditions.sort" colName="sales_completed_at"
                    >売上完了日</sr-th
                >
                <sr-th v-model="conditions.sort" colName="complete_day"
                    >請求予定日</sr-th
                >
                <sr-th v-model="conditions.sort" colName="m_branch_name"
                    >受注拠点</sr-th
                >
                <sr-th v-model="conditions.sort" colName="m_branch_name"
                    >生産拠点</sr-th
                >
                <sr-th v-model="conditions.sort" colName="m_customer_name"
                    >取引先名</sr-th
                >
                <sr-th v-model="conditions.sort" colName="m_user_name"
                    >営業担当</sr-th
                >
                <sr-th v-model="conditions.sort" colName="t_project_name"
                    >物件名</sr-th
                >
                <sr-th v-model="conditions.sort" colName="product_name"
                    >商品名</sr-th
                >
                <sr-th v-model="conditions.sort" colName="qty">数量</sr-th>
                <sr-th v-model="conditions.sort" colName="cost">@原価</sr-th>
                <sr-th v-model="conditions.sort" colName="total_cost"
                    >原価金額</sr-th
                >
                <sr-th v-model="conditions.sort" colName="sell_price"
                    >@売価</sr-th
                >
                <sr-th v-model="conditions.sort" colName="total_sell_price"
                    >売価金額</sr-th
                >
            </template>

            <template v-slot:td="slotProps">
                <td>{{ cDateFormat(slotProps.sales_completed_at) }}</td>
                <td>{{ cDateFormat(slotProps.complete_day) }}</td>
                <td>{{ slotProps.m_branch_name }}</td>
                <td>{{ slotProps.product_m_branch_name }}</td>
                <td class="text-truncate mw-250">
                    {{ slotProps.m_customer_name }}
                </td>
                <td>{{ slotProps.m_user_name }}</td>
                <td class="text-truncate mw-250">
                    <a :href="'v#/t_project/edit/' + slotProps.t_project_id">{{ slotProps.t_project_name }}</a>
                </td>
                <td>{{ slotProps.product_name }}</td>
                <td>{{ cToNumber(slotProps.qty) }}</td>
                <td>{{ cToNumber(slotProps.cost) }}</td>
                <td>{{ cToNumber(slotProps.total_cost) }}</td>
                <td>{{ cToNumber(slotProps.sell_price) }}</td>
                <td>{{ cToNumber(slotProps.total_sell_price) }}</td>
            </template>

            <template v-slot:summary="slotProps">
                <td v-for="n in 8" :key="n"></td>
                <td>{{ cSummary(slotProps.list, "total_cost") }}</td>
                <td />
                <td>{{ cSummary(slotProps.list, "total_sell_price") }}</td>
            </template>
        </sr-container>
    </div>
</template>

<script lang="ts" setup>
import _ from "lodash";
import { computed, reactive, ref } from "vue";
import NumberUtil from "../../frameworks/NumberUtil";
import { useStore } from "../../stores/mainStore";
import { useMasterStore } from "../../stores/masterStore";
import { signmisReportComposition } from "./compositions/signmisReportComposition";

const store = useStore();
const masterStore = useMasterStore();
const { cDateFormat, cToNumber, cSummary, cTermAlert, getCalcedMonth } =
    signmisReportComposition();

const conditions = reactive({
    complete_day_from: "",
    complete_day_to: "",
    m_branch_id: 0,
    product_m_branch_id: 0,
    sort: "",
});

// 検索項目の売上完了日を自動連動
const cCompleteDayFrom = computed({
    get: () => conditions.complete_day_from,
    set: (val) => {
        if (_.isEmpty(conditions.complete_day_to)) {
            conditions.complete_day_to = getCalcedMonth(val, 1);
        }
        conditions.complete_day_from = val;
    },
});


// 検索項目の受注拠点を変更できるフラグ
function initConditions() {
    cCompleteDayFrom.value = "";
    conditions.complete_day_to = "";

    conditions.m_branch_id = store.loginMUser?.m_branch_id ?? 0;
}

initConditions();
</script>

<style scoped>
/* 明細：センター */
th:nth-of-type(1),
td:nth-of-type(1) {
    text-align: center;
}

/* 明細：右揃え */
th:nth-of-type(9),
td:nth-of-type(9),
th:nth-of-type(10),
td:nth-of-type(10),
th:nth-of-type(11),
td:nth-of-type(11),
th:nth-of-type(12),
td:nth-of-type(12),
th:nth-of-type(13),
td:nth-of-type(13) {
    text-align: right;
}
</style>
