<template>
    <div>
        <sr-container
            :conditions="conditions"
            @initConditions="initConditions">
            <template v-slot:header>
                <div class="row">
                    <div class="col-xl-1">
                        <div class="form-group">
                            <label>拠点</label>
                            <m-branch-select
                                v-model="conditions.m_branch_id"
                                />
                        </div>
                    </div>
                    <div class="col-xl-3 pl-xl-0">
                        <div class="form-group">
                            <label>取引日</label>
                            <div class="d-flex flex-no-wrap">
                                <validation-provider name="開始日" rules="required" vid="my_custom_rule_day_min" immediate v-slot="{ errors }">
                                    <ex-v-date-picker
                                        v-model="cCompleteDayFrom" />
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </validation-provider>
                                <span class="px-1 pt-2">～</span>
                                <validation-provider name="終了日" rules="required|custom_rule_date_or_later:my_custom_rule_day_min" immediate v-slot="{ errors }">
                                    <ex-v-date-picker
                                        v-model="conditions.trading_day_to" />
                                    <span class="validation-error">{{ errors[0] }}</span>
                                    <span class="validation-info">{{ cTermAlert(cCompleteDayFrom,conditions.trading_day_to) }}</span>
                                </validation-provider>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-1 pl-xl-0">
                        <div class="form-group">
                            <validation-provider name="取引先締日" rules="between:0,99" immediate v-slot="{ errors }" >
                                <label>締日</label>
                                <ns-number-input
                                    v-model="conditions.m_customer_closing_date"
                                    />
                                <span class="validation-error">{{ errors[0] }}</span>
                            </validation-provider>
                        </div>
                    </div>
                    <div class="col-xl-4 pl-xl-0">
                        <div class="form-group">
                            <label>取引先</label>
                            <m-customer-ref-input
                                v-model="conditions.m_customer_id"
                                :m-branch-id="conditions.m_branch_id"
                                :dealing-cds=[1]
                                />
                        </div>
                    </div>
                    <div class="col-xl-1 pl-xl-0">
                        <div class="form-group">
                            <label><br></label>
                            <ns-checkbox-input
                                v-model="conditions.tax_calc"
                                :id="'tax_calc'"
                                :label="'消費税を仮計算'"
                            />
                        </div>
                    </div>
                </div>
            </template>

            <template v-slot:th>
                <sr-th v-model="conditions.sort" colName="m_customer_cd">コード</sr-th>
                <sr-th v-model="conditions.sort" colName="m_customer_linkage_cd">連携コード</sr-th>
                <sr-th v-model="conditions.sort" colName="m_customer_name">取引先名</sr-th>
                <sr-th v-model="conditions.sort" colName="m_user_name">担当者名</sr-th>
                <sr-th v-model="conditions.sort" colName="before_balance">前回残高</sr-th>
                <sr-th v-model="conditions.sort" colName="payment_day">入金日</sr-th>
                <sr-th v-model="conditions.sort" colName="payment_transfer">振込</sr-th>
                <sr-th v-model="conditions.sort" colName="payment_commission">手数料</sr-th>
                <sr-th v-model="conditions.sort" colName="payment_cash">現金</sr-th>
                <sr-th v-model="conditions.sort" colName="payment_check">小切手</sr-th>
                <sr-th v-model="conditions.sort" colName="payment_bill">手形</sr-th>
                <sr-th v-model="conditions.sort" colName="payment_offset">相殺</sr-th>
                <sr-th v-model="conditions.sort" colName="payment_etc">その他</sr-th>
                <sr-th v-model="conditions.sort" colName="payment_price">入金合計</sr-th>
                <sr-th v-model="conditions.sort" colName="total_price">売上額</sr-th>
                <sr-th v-model="conditions.sort" colName="tax">消費税</sr-th>
                <sr-th v-model="conditions.sort" colName="tax_calc">仮消費税</sr-th>
                <sr-th v-model="conditions.sort" colName="sub_total">売上合計</sr-th>
                <sr-th v-model="conditions.sort" colName="balance">残高</sr-th>
            </template>

            <template v-slot:td="slotProps">
                <td>{{slotProps.m_customer_cd}}</td>
                <td>{{slotProps.m_customer_linkage_cd}}</td>
                <td class="text-truncate mw-250">{{ slotProps.m_customer_name }}</td>
                <td>{{ slotProps.m_user_name }}</td>
                <td>{{ cToNumber(slotProps.before_balance) }}</td>
                <td>{{ cDateFormat(slotProps.payment_day) }}</td>
                <td>{{ cToNumber(slotProps.payment_transfer) }}</td>
                <td>{{ cToNumber(slotProps.payment_commission) }}</td>
                <td>{{ cToNumber(slotProps.payment_cash) }}</td>
                <td>{{ cToNumber(slotProps.payment_check) }}</td>
                <td>{{ cToNumber(slotProps.payment_bill) }}</td>
                <td>{{ cToNumber(slotProps.payment_offset) }}</td>
                <td>{{ cToNumber(slotProps.payment_etc) }}</td>
                <td>{{ cToNumber(slotProps.payment_price) }}</td>
                <td>{{ cToNumber(slotProps.total_price) }}</td>
                <td>{{ cToNumber(slotProps.tax) }}</td>
                <td>{{ cToNumber(slotProps.tax_calc) }}</td>
                <td>{{ cToNumber(slotProps.sub_total) }}</td>
                <td>{{ cToNumber(slotProps.balance) }}</td>
            </template>

            <template v-slot:summary="slotProps">
                <td></td>
                <td></td>
                <td>{{ cSummary(slotProps.list, 'before_balance') }}</td>
                <td></td>
                <td>{{ cSummary(slotProps.list, 'payment_transfer') }}</td>
                <td>{{ cSummary(slotProps.list, 'payment_commission') }}</td>
                <td>{{ cSummary(slotProps.list, 'payment_cash') }}</td>
                <td>{{ cSummary(slotProps.list, 'payment_check') }}</td>
                <td>{{ cSummary(slotProps.list, 'payment_bill') }}</td>
                <td>{{ cSummary(slotProps.list, 'payment_offset') }}</td>
                <td>{{ cSummary(slotProps.list, 'payment_etc') }}</td>
                <td>{{ cSummary(slotProps.list, 'payment_price') }}</td>
                <td>{{ cSummary(slotProps.list, 'total_price') }}</td>
                <td>{{ cSummary(slotProps.list, 'tax') }}</td>
                <td>{{ cSummary(slotProps.list, 'tax_calc') }}</td>
                <td>{{ cSummary(slotProps.list, 'sub_total') }}</td>
                <td>{{ cSummary(slotProps.list, 'balance') }}</td>
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
    trading_day_from : "" ,
    trading_day_to   : "" ,
    m_customer_closing_date : 0 ,
    m_branch_id : 0 ,
    m_customer_id : 0 ,
    tax_calc : false ,
    sort : "" ,
})

const cCompleteDayFrom = computed({
    get : () => conditions.trading_day_from ,
    set : (val) => {
        if(_.isEmpty(conditions.trading_day_to)) {
            conditions.trading_day_to = getCalcedMonth(val, 1) ;
        }
        conditions.trading_day_from = val ;
    }
})

function initConditions() {
    cCompleteDayFrom.value = "" ;
    conditions.trading_day_to = "" ;
    conditions.m_customer_closing_date = 0 ;
    conditions.m_branch_id = store.loginMUser?.m_branch_id ?? 0 ;
    conditions.m_customer_id = 0 ;
    conditions.tax_calc = false ;
    conditions.sort = "" ;
}

initConditions()

</script>

<style scoped>
/* 明細：センター */
th:nth-of-type(6), td:nth-of-type(6) {
    text-align: center;
}

/* 明細：右揃え */
th:nth-of-type(5),  td:nth-of-type(5),
th:nth-of-type(7),  td:nth-of-type(7),
th:nth-of-type(8),  td:nth-of-type(8),
th:nth-of-type(9),  td:nth-of-type(9),
th:nth-of-type(10), td:nth-of-type(10),
th:nth-of-type(11), td:nth-of-type(11),
th:nth-of-type(12), td:nth-of-type(12),
th:nth-of-type(13), td:nth-of-type(13),
th:nth-of-type(14), td:nth-of-type(14),
th:nth-of-type(15), td:nth-of-type(15),
th:nth-of-type(16), td:nth-of-type(16),
th:nth-of-type(17), td:nth-of-type(17),
th:nth-of-type(18), td:nth-of-type(18),
th:nth-of-type(19), td:nth-of-type(19) {
    text-align: right;
}
</style>
