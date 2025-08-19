<template>
    <div>
        <sr-container
            :conditions="conditions"
            @initConditions="initConditions">
            <template v-slot:header>
                <div class="row">
                    <div class="col-12 col-xl-1">
                        <div class="form-group">
                            <label>拠点</label>
                            <m-branch-select
                                v-model="cBranchId"
                                />
                        </div>
                    </div>
                    <div class="col-12 col-xl-3 pl-xl-0">
                        <div class="form-group">
                            <label>請求締日</label>
                            <div class="d-flex flex-no-wrap">
                                <validation-provider name="開始日" rules="required" vid="my_custom_rule_day_min" immediate v-slot="{ errors }">
                                    <ex-v-date-picker
                                        v-model="cCompleteDayFrom" />
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </validation-provider>
                                <span class="px-1 pt-2">～</span>
                                <validation-provider name="終了日" rules="required|custom_rule_date_or_later:my_custom_rule_day_min" immediate v-slot="{ errors }">
                                    <ex-v-date-picker
                                        v-model="conditions.complete_day_to" />
                                    <span class="validation-error">{{ errors[0] }}</span>
                                    <span class="validation-info">{{ cTermAlert(cCompleteDayFrom,conditions.complete_day_to) }}</span>
                                </validation-provider>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-xl-1 pl-xl-0">
                        <div class="form-group">
                            <validation-provider name="締日" rules="between:0,99" immediate v-slot="{ errors }" >
                                <label>締日</label>
                                <ns-number-input
                                    v-model="conditions.m_customer_closing_date"
                                    />
                                <span class="validation-error">{{ errors[0] }}</span>
                            </validation-provider>
                        </div>
                    </div>
                    <div class="col-12 col-xl-3 pl-xl-0">
                        <div class="form-group">
                            <label>仕入先</label>
                            <m-customer-ref-input
                                v-model="conditions.m_customer_id"
                                :m-branch-id="conditions.m_branch_id"
                                :dealing-cds=[2,4]
                                />
                        </div>
                    </div>
                    <div class="col-12 col-xl-2 pl-xl-0">
                        <div class="form-group">
                            <label>勘定科目</label>
                            <m-kv-select
                                v-model="conditions.accounts_title_m_kv_id"
                                :kv-key="'sales_management-accounts_title'"
                                />
                        </div>
                    </div>
                </div>
            </template>

            <template v-slot:th>
                <sr-th v-model="conditions.sort" colName="accounts_title_cd"></sr-th>
                <sr-th v-model="conditions.sort" colName="accounts_title_name">勘定科目</sr-th>
                <sr-th v-model="conditions.sort" colName="m_customer_cd">コード</sr-th>
                <sr-th v-model="conditions.sort" colName="m_customer_name">仕入先名</sr-th>
                <sr-th v-model="conditions.sort" colName="t_complete_id">仕入締No</sr-th>
                <sr-th v-model="conditions.sort" colName="complete_day">仕入締日</sr-th>
                <sr-th v-model="conditions.sort" colName="carry_over">前回仕入締額</sr-th>
                <sr-th v-model="conditions.sort" colName="payment_price">支払額</sr-th>
                <sr-th v-model="conditions.sort" colName="balance">繰越額</sr-th>
                <sr-th v-model="conditions.sort" colName="total_price">仕入額</sr-th>
                <sr-th v-model="conditions.sort" colName="tax">消費税</sr-th>
                <sr-th v-model="conditions.sort" colName="sub_total">仕入合計</sr-th>
                <sr-th v-model="conditions.sort" colName="grand_total">今回仕入締額</sr-th>
                <sr-th v-model="conditions.sort" colName="uncollected">未払残</sr-th>
                <sr-th v-model="conditions.sort" colName="due_date">支払予定日</sr-th>
                <sr-th v-model="conditions.sort" colName="sales_management_memo">備考</sr-th>
            </template>

            <template v-slot:td="slotProps">
                <td>{{ slotProps.accounts_title_cd }}</td>
                <td>{{ slotProps.accounts_title_name }}</td>
                <td>{{ slotProps.m_customer_cd }}</td>
                <td class="text-truncate mw-350">{{ slotProps.m_customer_name }}</td>
                <td>{{ slotProps.t_complete_id }}</td>
                <td>{{ cDateFormat(slotProps.complete_day) }}</td>
                <td>{{ cToNumber(slotProps.carry_over) }}</td>
                <td>{{ cToNumber(slotProps.payment_price) }}</td>
                <td>{{ cToNumber(slotProps.balance) }}</td>
                <td>{{ cToNumber(slotProps.total_price) }}</td>
                <td>{{ cToNumber(slotProps.tax) }}</td>
                <td>{{ cToNumber(slotProps.sub_total) }}</td>
                <td>{{ cToNumber(slotProps.grand_total) }}</td>
                <td>{{ cToNumber(slotProps.uncollected) }}</td>
                <td>{{ cDateFormat(slotProps.due_date) }}</td>
                <td class="text-truncate mw-250">{{ slotProps.sales_management_memo }}</td>
            </template>

            <template v-slot:summary="slotProps">
                <td v-for="n in 4" :key="n"></td>
                <td>{{ cSummary(slotProps.list,'carry_over') }}</td>
                <td>{{ cSummary(slotProps.list,'payment_price') }}</td>
                <td>{{ cSummary(slotProps.list,'grand_tobalancetal') }}</td>
                <td>{{ cSummary(slotProps.list,'total_price') }}</td>
                <td>{{ cSummary(slotProps.list,'tax') }}</td>
                <td>{{ cSummary(slotProps.list,'sub_total') }}</td>
                <td>{{ cSummary(slotProps.list,'grand_total') }}</td>
                <td>{{ cSummary(slotProps.list,'uncollected') }}</td>
                <td></td><td></td>
            </template>
        </sr-container>
    </div>
</template>

<script lang="ts" setup>
import _ from "lodash";
import { computed, reactive, ref } from 'vue';
import { useStore } from '../../stores/mainStore';
import { signmisReportComposition } from './compositions/signmisReportComposition'

const store = useStore() ;
const { cDateFormat, cToNumber, cSummary, cGetClosingDate, cTermAlert, getCalcedMonth } = signmisReportComposition() ;

const conditions = reactive({
    complete_day_from : "" ,
    complete_day_to   : "" ,
    m_customer_closing_date : 0 ,
    m_branch_id : 0 ,
    m_customer_id : 0 ,
    accounts_title_m_kv_id : 0 ,
    sort : "" ,
})

const cBranchId = computed({
    get : () => conditions.m_branch_id ,
    set : (val) => {
        conditions.m_customer_closing_date = cGetClosingDate.value(val) ;
        conditions.m_branch_id = val ;
    }
})

const cCompleteDayFrom = computed({
    get : () => conditions.complete_day_from ,
    set : (val) => {
        if(_.isEmpty(conditions.complete_day_to)) {
            conditions.complete_day_to = getCalcedMonth(val, 1) ;
        }
        conditions.complete_day_from = val ;
    }
})

function initConditions() {
    cCompleteDayFrom.value = "" ;
    conditions.complete_day_to = "" ;
    conditions.m_customer_closing_date = 0 ;
    cBranchId.value = store.loginMUser?.m_branch_id ?? 0 ;
    conditions.m_customer_id = 0 ;
    conditions.accounts_title_m_kv_id = 0 ,

    conditions.sort = "" ;
}

initConditions()

</script>
<style scoped>
/* 明細：センター */
th:nth-of-type(6),  td:nth-of-type(6),
th:nth-of-type(15), td:nth-of-type(15) {
    text-align: center;
}

/* 明細：右揃え */
th:nth-of-type(7),  td:nth-of-type(7),
th:nth-of-type(8),  td:nth-of-type(8),
th:nth-of-type(9),  td:nth-of-type(9),
th:nth-of-type(10), td:nth-of-type(10),
th:nth-of-type(11), td:nth-of-type(11),
th:nth-of-type(12), td:nth-of-type(12),
th:nth-of-type(13), td:nth-of-type(13),
th:nth-of-type(14), td:nth-of-type(14) {
    text-align: right;
}
</style>
