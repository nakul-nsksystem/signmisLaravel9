<template>
    <div>
        <sr-container
            :conditions="conditions"
            @initConditions="initConditions">
            <template v-slot:header>
                <div class="row">
                    <div class="col-12 col-xl-1">
                        <div class="form-group">
                            <label >拠点</label>
                            <m-branch-select
                                v-model="conditions.m_branch_id"
                                />
                        </div>
                    </div>
                    <div class="col-12 col-xl-3 pl-xl-0">
                        <div class="form-group">
                            <label >請求日</label>
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
                    <div class="col-12 col-xl-2 pl-xl-0">
                        <div class="form-group">
                            <label >営業担当</label>
                            <m-user-select
                                v-model="conditions.m_user_id"
                                :m-branch-id="conditions.m_branch_id"
                                :filter-m-tag-keys="['m_users-role-sales']"
                                />
                        </div>
                    </div>
                    <div class="col-12 col-xl-3 pl-xl-0">
                        <div class="form-group">
                            <label>取引先</label>
                            <m-customer-ref-input
                                v-model="conditions.m_customer_id"
                                :m-branch-id="conditions.m_branch_id"
                                :dealing-cds=[1]
                                />
                        </div>
                    </div>
                </div>
            </template>

            <template v-slot:th>
                <sr-th v-model="conditions.sort" colName="m_user_name">担当者名</sr-th>
                <sr-th v-model="conditions.sort" colName="m_customer_cd">コード</sr-th>
                <sr-th v-model="conditions.sort" colName="m_customer_name">取引先名</sr-th>
                <sr-th v-model="conditions.sort" colName="complete_day">請求日</sr-th>
                <sr-th v-model="conditions.sort" colName="due_date">入金予定日</sr-th>
                <sr-th v-model="conditions.sort" colName="total_price">売上額</sr-th>
                <sr-th v-model="conditions.sort" colName="sub_total">売上合計</sr-th>
                <sr-th v-model="conditions.sort" colName="payment_price">入金額</sr-th>
                <sr-th v-model="conditions.sort" colName="commission">手数料</sr-th>
                <sr-th v-model="conditions.sort" colName="uncollected">未収残</sr-th>
                <sr-th v-model="conditions.sort" colName="sales_management_memo">備考</sr-th>
            </template>

            <template v-slot:td="slotProps">
                <td>{{ slotProps.m_user_name }}</td>
                <td>{{slotProps.m_customer_cd}}</td>
                <td class="text-truncate mw-350">{{ slotProps.m_customer_name }}</td>
                <td>{{ cDateFormat(slotProps.complete_day) }}</td>
                <td>{{ cDateFormat(slotProps.due_date) }}</td>
                <td>{{ cToNumber(slotProps.total_price) }}</td>
                <td>{{ cToNumber(slotProps.sub_total) }}</td>
                <td>{{ cToNumber(slotProps.payment_price) }}</td>
                <td>{{ cToNumber(slotProps.commission) }}</td>
                <td>{{ cToNumber(slotProps.uncollected) }}</td>
                <td class="text-truncate mw-250">{{ slotProps.sales_management_memo }}</td>
            </template>

            <template v-slot:summary="slotProps">
                <td v-for="n in 3" :key="n"></td>
                <td>{{ cSummary(slotProps.list,'total_price') }}</td>
                <td>{{ cSummary(slotProps.list,'sub_total') }}</td>
                <td>{{ cSummary(slotProps.list,'payment_price') }}</td>
                <td>{{ cSummary(slotProps.list,'commission') }}</td>
                <td>{{ cSummary(slotProps.list,'uncollected') }}</td>
                <td /><td />
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
const { cDateFormat, cToNumber, cSummary, cTermAlert, getCalcedMonth } = signmisReportComposition() ;

const conditions = reactive({
    complete_day_from : "" ,
    complete_day_to   : "" ,
    m_user_id : 0 ,
    m_branch_id : 0 ,
    m_customer_id : 0 ,
    sort : "" ,
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
    conditions.m_user_id = 0 ;
    conditions.m_branch_id = store.loginMUser?.m_branch_id ?? 0 ;
    conditions.m_customer_id = 0 ;
    conditions.sort = "" ;
}

initConditions()

</script>

<style scoped>
/* 明細：センター */
th:nth-of-type(4), td:nth-of-type(4),
th:nth-of-type(5), td:nth-of-type(5) {
    text-align: center;
}

/* 明細：右揃え */
th:nth-of-type(6), td:nth-of-type(6),
th:nth-of-type(7), td:nth-of-type(7),
th:nth-of-type(8), td:nth-of-type(8),
th:nth-of-type(9), td:nth-of-type(9),
th:nth-of-type(10), td:nth-of-type(10) {
    text-align: right;
}
</style>
