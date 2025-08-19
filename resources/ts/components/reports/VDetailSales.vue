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
                            <label>売上日</label>
                            <div class="d-flex flex-no-wrap">
                                <validation-provider name="開始日" rules="required" vid="my_custom_rule_day_min" immediate v-slot="{ errors }">
                                    <ex-v-date-picker
                                        v-model="cAccountingDateFrom" />
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </validation-provider>
                                <span class="px-1 pt-2">～</span>
                                <validation-provider name="終了日" rules="required|custom_rule_date_or_later:my_custom_rule_day_min" immediate v-slot="{ errors }">
                                    <ex-v-date-picker
                                        v-model="conditions.accounting_date_to" />
                                    <span class="validation-error">{{ errors[0] }}</span>
                                    <span class="validation-info">{{ cTermAlert(cAccountingDateFrom,conditions.accounting_date_to) }}</span>
                                </validation-provider>
                            </div>
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
                    <div class="col-12 col-xl-2 pl-xl-0">
                        <div class="form-group">
                            <label>自社担当者</label>
                            <m-user-select
                                v-model="conditions.m_user_id"
                                :m-branch-id="conditions.m_branch_id"
                                :filter-m-tag-keys="['m_users-role-sales']"
                                />
                        </div>
                    </div>
                    <div class="col-12 col-xl-2 pl-xl-0">
                        <div class="form-group">
                            <label>物件CD</label>
                            <input type="text" class="form-control" v-model="conditions.t_project_cd" >
                        </div>
                    </div>
                </div>
            </template>

            <template v-slot:th>
                <sr-th v-model="conditions.sort" colName="m_branch_name">拠点</sr-th>
                <sr-th v-model="conditions.sort" colName="accounting_date">売上日</sr-th>
                <sr-th v-model="conditions.sort" colName="t_sale_id">伝票No</sr-th>
                <sr-th v-model="conditions.sort" colName="t_sale_detail_id">明細No</sr-th>
                <sr-th v-model="conditions.sort" colName="m_customer_cd">取引先CD</sr-th>
                <sr-th v-model="conditions.sort" colName="m_customer_name">取引先名</sr-th>
                <sr-th v-model="conditions.sort" colName="product_name">品名</sr-th>
                <sr-th v-model="conditions.sort" colName="qty">数量</sr-th>
                <sr-th v-model="conditions.sort" colName="unit_m_kv_name">単位</sr-th>
                <sr-th v-model="conditions.sort" colName="price">単価</sr-th>
                <sr-th v-model="conditions.sort" colName="total_price">金額</sr-th>
                <sr-th v-model="conditions.sort" colName="t_project_cd">物件CD</sr-th>
                <sr-th v-model="conditions.sort" colName="m_user_name">自社担当者</sr-th>
                <sr-th v-model="conditions.sort" colName="customer_order_no">客先注文No</sr-th>
                <sr-th v-model="conditions.sort" colName="contact">客先担当者</sr-th>
                <sr-th v-model="conditions.sort" colName="sale_memo">摘要</sr-th>
                <sr-th v-model="conditions.sort" colName="slip_memo">備考</sr-th>
            </template>

            <template v-slot:td="slotProps">
                <td>{{ slotProps.m_branch_name }}</td>
                <td>{{ cDateFormat(slotProps.accounting_date) }}</td>
                <td>
                    <a :href='`v#/t_sale/edit/${slotProps.t_sale_id}`'>{{slotProps.t_sale_id}}</a>
                </td>
                <td>{{ slotProps.t_sale_detail_id }}</td>
                <td>{{ slotProps.m_customer_cd }}</td>
                <td class="text-truncate mw-250">{{ slotProps.m_customer_name }}</td>
                <td class="text-truncate mw-350">{{ slotProps.product_name }}</td>
                <td>{{ cToNumber(slotProps.qty) }}</td>
                <td>{{ slotProps.unit_m_kv_name }}</td>
                <td>{{ cToNumber(slotProps.price) }}</td>
                <td>{{ cToNumber(slotProps.total_price) }}</td>
                <td>{{ slotProps.t_project_cd }}</td>
                <td>{{ slotProps.m_user_name }}</td>
                <td>{{ slotProps.customer_order_no }}</td>
                <td>{{ slotProps.contact }}</td>
                <td class="text-truncate mw-250">{{ slotProps.sale_memo }}</td>
                <td class="text-truncate mw-250">{{ slotProps.slip_memo }}</td>
            </template>

            <template v-slot:summary="slotProps">
                <td v-for="n in 5" :key="n"></td>
                <td>{{ cSummary(slotProps.list,'qty') }}</td>
                <td />
                <td />
                <td>{{ cSummary(slotProps.list,'total_price') }}</td>
                <td />
                <td />
                <td />
                <td />
                <td />
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
    m_branch_id : 0 ,
    accounting_date_from : "" ,
    accounting_date_to   : "" ,
    m_customer_id : 0 ,
    m_user_id : 0 ,
    t_project_cd : "" ,
    sort : "" ,
})

const cAccountingDateFrom = computed({
    get : () => conditions.accounting_date_from ,
    set : (val) => {
        if(_.isEmpty(conditions.accounting_date_from)) {
            conditions.accounting_date_to = getCalcedMonth(val, 1) ;
        }
        conditions.accounting_date_from = val ;
    }
})

function initConditions() {
    conditions.m_branch_id = store.loginMUser?.m_branch_id ?? 0 ;
    cAccountingDateFrom.value = "" ;
    conditions.accounting_date_to = "" ;
    conditions.m_customer_id = 0 ;
    conditions.m_user_id = 0 ;
    conditions.t_project_cd = "" ;
    conditions.sort = "" ;
}

initConditions()

</script>

<style scoped>
/* 明細：センター */
th:nth-of-type(2), td:nth-of-type(2) {
    text-align: center;
}

/* 明細：右揃え */
th:nth-of-type(8),  td:nth-of-type(8),
th:nth-of-type(10), td:nth-of-type(10),
th:nth-of-type(11), td:nth-of-type(11) {
    text-align: right;
}
</style>
