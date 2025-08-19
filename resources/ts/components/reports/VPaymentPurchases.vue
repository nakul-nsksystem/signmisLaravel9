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
                            <label>支払日</label>
                            <div class="d-flex flex-no-wrap">
                                <validation-provider name="開始日" rules="required" vid="my_custom_rule_day_min" immediate v-slot="{ errors }">
                                    <ex-v-date-picker
                                        v-model="cPaymentDayFrom" />
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </validation-provider>
                                <span class="px-1 pt-2">～</span>
                                <validation-provider name="終了日" rules="required|custom_rule_date_or_later:my_custom_rule_day_min" immediate v-slot="{ errors }">
                                    <ex-v-date-picker
                                        v-model="conditions.payment_day_to" />
                                    <span class="validation-error">{{ errors[0] }}</span>
                                    <span class="validation-info">{{ cTermAlert(cPaymentDayFrom, conditions.payment_day_to) }}</span>
                                </validation-provider>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-xl-1 pl-xl-0">
                        <div class="form-group">
                            <validation-provider name="支払予定" rules="between:0,99" immediate v-slot="{ errors }" >
                                <label>支払予定</label>
                                <ns-number-input
                                    v-model="conditions.m_customer_payment_date"
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
                </div>
            </template>

            <template v-slot:th>
                <sr-th v-model="conditions.sort" colName="payment_day">支払日</sr-th>
                <sr-th v-model="conditions.sort" colName="m_customer_cd">コード</sr-th>
                <sr-th v-model="conditions.sort" colName="m_customer_name">仕入先名</sr-th>
                <sr-th v-model="conditions.sort" colName="m_customer_payment_date">仕入先支払日</sr-th>
                <sr-th v-model="conditions.sort" colName="payment_price">支払額</sr-th>
                <sr-th v-model="conditions.sort" colName="payment_total">支払合計</sr-th>
                <sr-th v-model="conditions.sort" colName="payment_name">支払区分名</sr-th>
                <sr-th v-model="conditions.sort" colName="complete_day">対象仕入締日</sr-th>
                <sr-th v-model="conditions.sort" colName="due_date">支払予定日</sr-th>
                <sr-th v-model="conditions.sort" colName="sub_total">売上合計</sr-th>
                <sr-th v-model="conditions.sort" colName="payment_memo">支払備考</sr-th>
                <sr-th v-model="conditions.sort" colName="sales_management_memo">販売管理備考</sr-th>
            </template>

            <template v-slot:td="slotProps">
                <td>{{ cDateFormat(slotProps.payment_day) }}</td>
                <td>{{slotProps.m_customer_cd}}</td>
                <td class="text-truncate mw-350">{{ slotProps.m_customer_name }}</td>
                <td>{{ slotProps.m_customer_payment_date }}</td>
                <td>{{ cToNumber(slotProps.payment_price) }}</td>
                <td>{{ cToNumber(slotProps.payment_total) }}</td>
                <td>{{ slotProps.payment_name }}</td>
                <td>{{ cDateFormat(slotProps.complete_day) }}</td>
                <td>{{ cDateFormat(slotProps.due_date) }}</td>
                <td>{{ cToNumber(slotProps.sub_total) }}</td>
                <td class="text-truncate mw-250">{{ slotProps.payment_memo }}</td>
                <td class="text-truncate mw-250">{{ slotProps.sales_management_memo }}</td>
            </template>

            <template v-slot:summary="slotProps">
                <td></td>
                <td></td>
                <td>{{ cSummary(slotProps.list,'payment_price') }}</td>
                <td v-for="n in 7" :key="n"></td>
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
const { cDateFormat, cToNumber, cSummary, cGetPaymentDate, cTermAlert, getCalcedMonth } = signmisReportComposition() ;

const conditions = reactive({
    payment_day_from : "" ,
    payment_day_to   : "" ,
    m_customer_payment_date : 0 ,
    m_branch_id : 0 ,
    m_customer_id : 0 ,
    sort : "" ,
})

const cBranchId = computed({
    get : () => conditions.m_branch_id ,
    set : (val) => {
        conditions.m_customer_payment_date = cGetPaymentDate.value(val) ;
        conditions.m_branch_id = val ;
    }
})

const cPaymentDayFrom = computed({
    get : () => conditions.payment_day_from ,
    set : (val) => {
        if(_.isEmpty(conditions.payment_day_to)) {
            conditions.payment_day_to = getCalcedMonth(val, 1) ;
        }
        conditions.payment_day_from = val ;
    }
})

function initConditions() {
    cPaymentDayFrom.value = "" ;
    conditions.payment_day_to = "" ;
    conditions.m_customer_payment_date = 0 ;
    cBranchId.value = store.loginMUser?.m_branch_id ?? 0 ;
    conditions.m_customer_id = 0 ;
    conditions.sort = "" ;
}

initConditions()

</script>
<style scoped>
/* 明細：センター */
th:nth-of-type(1), td:nth-of-type(1),
th:nth-of-type(8), td:nth-of-type(8),
th:nth-of-type(9), td:nth-of-type(9) {
    text-align: center;
}

/* 明細：右揃え */
th:nth-of-type(4),  td:nth-of-type(4),
th:nth-of-type(5),  td:nth-of-type(5),
th:nth-of-type(6),  td:nth-of-type(6),
th:nth-of-type(10), td:nth-of-type(10) {
    text-align: right;
}
</style>
