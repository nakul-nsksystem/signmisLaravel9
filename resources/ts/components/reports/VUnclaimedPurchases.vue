<template>
    <div>
        <sr-container
            :conditions="conditions"
            @initConditions="initConditions"
        >
            <template v-slot:header>
                <div class="row">
                    <div class="col-12 col-xl-1">
                        <div class="form-group">
                            <label>拠点</label>
                            <m-branch-select v-model="conditions.m_branch_id" />
                        </div>
                    </div>
                    <div class="col-12 col-xl-3 pl-xl-0">
                        <div class="form-group">
                            <label>対象仕入締日</label>
                            <div class="d-flex flex-no-wrap">
                                <validation-provider name="対象仕入締日" rules="required" immediate v-slot="{ errors }">
                                    <ex-v-date-picker v-model="conditions.period" />
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </validation-provider>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-xl-1 pl-xl-0">
                        <div class="form-group">
                            <validation-provider name="仕入先締日" rules="between:0,99" immediate v-slot="{ errors }" >
                                <label>仕入先締日</label>
                                <ns-number-input v-model="conditions.m_customer_closing_date" />
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
                    <div class="col-12 col-xl-1 pl-xl-0">
                        <div class="form-group">
                            <label>経過月</label>
                            <ns-number-input v-model="conditions.elapsed_month" />
                            <span class="validation-info">ヶ月以前を対象</span>
                        </div>
                    </div>
                </div>
            </template>

            <template v-slot:th>
                <sr-th v-model="conditions.sort" colName="m_customer_cd"          >コード</sr-th>
                <sr-th v-model="conditions.sort" colName="m_customer_name"        >仕入先名</sr-th>
                <sr-th v-model="conditions.sort" colName="m_customer_closing_date">締日</sr-th>
                <sr-th v-model="conditions.sort" colName="m_user_name"            >担当者名</sr-th>
                <sr-th v-model="conditions.sort" colName="period"                 >対象仕入締日</sr-th>
                <sr-th v-model="conditions.sort" colName="slip_cnt"               >仕入伝票数</sr-th>
                <sr-th v-model="conditions.sort" colName="accounting_date"        >最終仕入日</sr-th>
                <sr-th v-model="conditions.sort" colName="total_price"            >仕入額</sr-th>
                <sr-th v-model="conditions.sort" colName="payment_day"            >最終支払日</sr-th>
                <sr-th v-model="conditions.sort" colName="payment_price"          >支払額</sr-th>
                <sr-th v-model="conditions.sort" colName="complete_day"           >最終仕入締日</sr-th>
                <sr-th v-model="conditions.sort" colName="grand_total"            >仕入締額</sr-th>
                <sr-th v-model="conditions.sort" colName="elapsed_month"          >経過月</sr-th>
            </template>

            <template v-slot:td="slotProps">
                <td>{{ slotProps.m_customer_cd }}</td>
                <td class="text-truncate mw-350">{{ slotProps.m_customer_name }}</td>
                <td>{{ cToNumber  (slotProps.m_customer_closing_date) }}</td>
                <td>{{             slotProps.m_user_name              }}</td>
                <td>{{ cDateFormat(slotProps.period                 ) }}</td>
                <td>{{ cToNumber  (slotProps.slip_cnt               ) }}</td>
                <td>{{ cDateFormat(slotProps.accounting_date        ) }}</td>
                <td>{{ cToNumber  (slotProps.total_price            ) }}</td>
                <td>{{ cDateFormat(slotProps.payment_day            ) }}</td>
                <td>{{ cToNumber  (slotProps.payment_price          ) }}</td>
                <td>{{ cDateFormat(slotProps.complete_day           ) }}</td>
                <td>{{ cToNumber  (slotProps.grand_total            ) }}</td>
                <td>{{ cToNumber  (slotProps.elapsed_month          ) }}</td>
            </template>

            <template v-slot:summary="slotProps">
                <td v-for="n in 3" :key="n"></td>
                <td>{{ cSummary(slotProps.list,'slip_cnt') }}</td>
                <td />
                <td>{{ cSummary(slotProps.list,'total_price') }}</td>
                <td />
                <td>{{ cSummary(slotProps.list,'payment_price') }}</td>
                <td />
                <td>{{ cSummary(slotProps.list,'grand_total') }}</td>
                <td />
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
    m_branch_id  : 0 ,
    period : "" ,
    m_customer_closing_date : 0 ,
    m_customer_id : 0 ,
    elapsed_month : 6 ,
    sort : "" ,
})

function initConditions() {
    conditions.m_branch_id = store.loginMUser?.m_branch_id ?? 0 ;
    conditions.period = "" ;
    conditions.m_customer_closing_date = 0 ;
    conditions.m_customer_id = 0 ;
    conditions.elapsed_month = 6 ;
    conditions.sort = "" ;
}

initConditions()

</script>

<style scoped>
/* 明細：センター */
th:nth-of-type(5),  td:nth-of-type(5),
th:nth-of-type(7),  td:nth-of-type(7),
th:nth-of-type(9),  td:nth-of-type(9),
th:nth-of-type(11), td:nth-of-type(11) {
    text-align: center;
}

/* 明細：右揃え */
th:nth-of-type(3),  td:nth-of-type(3),
th:nth-of-type(6),  td:nth-of-type(6),
th:nth-of-type(8),  td:nth-of-type(8),
th:nth-of-type(10), td:nth-of-type(10),
th:nth-of-type(12), td:nth-of-type(12),
th:nth-of-type(13), td:nth-of-type(13) {
    text-align: right;
}
</style>
