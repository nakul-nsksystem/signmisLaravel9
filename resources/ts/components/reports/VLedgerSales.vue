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
                    <div class="col-xl-4 pl-xl-0">
                        <div class="form-group">
                            <label>取引先</label>
                            <validation-provider name="取引先" rules="required|excluded:0" immediate v-slot="{ errors }">
                                <m-customer-ref-input
                                    v-model="conditions.m_customer_id"
                                    :m-branch-id="conditions.m_branch_id"
                                    :dealing-cds=[1]
                                />
                                <span class="validation-error">{{ errors[0] }}</span>
                            </validation-provider>
                        </div>
                    </div>
                </div>
            </template>

            <template v-slot:th>
                <sr-th colName="trading_day"      >取引日</sr-th>
                <sr-th colName="slip_no"          >伝票No.</sr-th>
                <sr-th colName="category_name"    >カテゴリ</sr-th>
                <sr-th colName="product_name"     >商品名</sr-th>
                <sr-th colName="project_cd"       >物件CD</sr-th>
                <sr-th colName="qty"              >数量</sr-th>
                <sr-th colName="unit_m_kv_name"   >単位</sr-th>
                <sr-th colName="total_price"      >売上額</sr-th>
                <sr-th colName="tax"              >消費税</sr-th>
                <sr-th colName="payment_price"    >入金額</sr-th>
                <sr-th colName="carried_forward"  >繰越残高</sr-th>
            </template>

            <template v-slot:td="slotProps">
                <td>{{ cDateFormat(slotProps.trading_day    ) }}</td>
                <td>{{             slotProps.slip_no          }}</td>
                <td>{{             slotProps.category_name    }}</td>
                <td>{{             slotProps.product_name     }}</td>
                <td>{{             slotProps.project_cd       }}</td>
                <td>{{ cToNumber  (slotProps.qty            ) }}</td>
                <td>{{             slotProps.unit_m_kv_name   }}</td>
                <td>{{ cToNumber  (slotProps.total_price    ) }}</td>
                <td>{{ cToNumber  (slotProps.tax            ) }}</td>
                <td>{{ cToNumber  (slotProps.payment_price  ) }}</td>
                <td>{{ cToNumber  (slotProps.carried_forward) }}</td>
            </template>

            <template v-slot:summary="slotProps">
                <td></td>
                <td></td>
                <td></td>
                <td>{{ cSummary(slotProps.list, 'qty'           ) }}</td>
                <td></td>
                <td>{{ cSummary(slotProps.list, 'total_price'   ) }}</td>
                <td>{{ cSummary(slotProps.list, 'tax'           ) }}</td>
                <td>{{ cSummary(slotProps.list, 'payment_price' ) }}</td>
                <td></td>
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
    m_branch_id : 0 ,
    trading_day_from : "" ,
    trading_day_to   : "" ,
    m_customer_id : 0 ,
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
    conditions.m_branch_id = store.loginMUser?.m_branch_id ?? 0 ;
    cCompleteDayFrom.value = "" ;
    conditions.trading_day_to = "" ;
    conditions.m_customer_id = 0 ;
}

initConditions()

</script>

<style scoped>
/* 明細：センター */
th:nth-of-type(1), td:nth-of-type(1),
th:nth-of-type(2), td:nth-of-type(2),
th:nth-of-type(5), td:nth-of-type(5) {
    text-align: center;
}

/* 明細：右揃え */
th:nth-of-type(6),  td:nth-of-type(6),
th:nth-of-type(8),  td:nth-of-type(8),
th:nth-of-type(9),  td:nth-of-type(9),
th:nth-of-type(10), td:nth-of-type(10),
th:nth-of-type(11), td:nth-of-type(11) {
    text-align: right;
}
</style>
