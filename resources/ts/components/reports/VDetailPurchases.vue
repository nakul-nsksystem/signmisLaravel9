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
                            <label>仕入日</label>
                            <div class="d-flex flex-no-wrap">
                                <validation-provider name="開始日" rules="required" vid="my_custom_rule_day_min" immediate v-slot="{ errors }">
                                    <ex-v-date-picker
                                        v-model="cPurchaseDateFrom" />
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </validation-provider>
                                <span class="px-1 pt-2">～</span>
                                <validation-provider name="終了日" rules="required|custom_rule_date_or_later:my_custom_rule_day_min" immediate v-slot="{ errors }">
                                    <ex-v-date-picker
                                        v-model="conditions.purchase_date_to" />
                                    <span class="validation-error">{{ errors[0] }}</span>
                                    <span class="validation-info">{{ cTermAlert(cPurchaseDateFrom,conditions.purchase_date_to) }}</span>
                                </validation-provider>
                            </div>
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
                    <div class="col-12 col-xl-3 pl-xl-0">
                        <div class="form-group">
                            <label>材料名</label>
                            <input type="text" class="form-control" v-model="conditions.material_name" >
                        </div>
                    </div>
                </div>
            </template>

            <template v-slot:th>
                <sr-th v-model="conditions.sort" colName="m_branch_name">拠点</sr-th>
                <sr-th v-model="conditions.sort" colName="purchase_date">仕入日</sr-th>
                <sr-th v-model="conditions.sort" colName="t_p_invoice_id">伝票No</sr-th>
                <sr-th v-model="conditions.sort" colName="t_p_invoice_detail_id">明細No</sr-th>
                <sr-th v-model="conditions.sort" colName="m_customer_cd">コード</sr-th>
                <sr-th v-model="conditions.sort" colName="m_customer_name">仕入先名</sr-th>
                <sr-th v-model="conditions.sort" colName="material_name">材料名</sr-th>
                <sr-th v-model="conditions.sort" colName="material_size_x">幅</sr-th>
                <sr-th v-model="conditions.sort" colName="material_size_y">流れ</sr-th>
                <sr-th v-model="conditions.sort" colName="capacity">容量</sr-th>
                <sr-th v-model="conditions.sort" colName="contents_qty">入数</sr-th>
                <sr-th v-model="conditions.sort" colName="qty">数量</sr-th>
                <sr-th v-model="conditions.sort" colName="unit_m_kv_name">単位</sr-th>
                <sr-th v-model="conditions.sort" colName="price">単価</sr-th>
                <sr-th v-model="conditions.sort" colName="total_price">金額</sr-th>
                <sr-th v-model="conditions.sort" colName="m_user_name">担当者</sr-th>
                <sr-th v-model="conditions.sort" colName="invoice_memo">摘要</sr-th>
                <sr-th v-model="conditions.sort" colName="slip_memo">備考</sr-th>
            </template>

            <template v-slot:td="slotProps">
                <td>{{ slotProps.m_branch_name }}</td>
                <td>{{ cDateFormat(slotProps.purchase_date) }}</td>
                <td>
                    <a :href='`v#/t_p_invoice/edit/${slotProps.t_p_invoice_id}`'>{{slotProps.t_p_invoice_id}}</a>
                </td>
                <td>{{ slotProps.t_p_invoice_detail_id }}</td>
                <td>{{ slotProps.m_customer_cd }}</td>
                <td class="text-truncate mw-250">{{ slotProps.m_customer_name }}</td>
                <td class="text-truncate mw-350">{{ slotProps.material_name }}</td>
                <td>{{ cToNumber(slotProps.material_size_x) }}</td>
                <td>{{ cToNumber(slotProps.material_size_y) }}</td>
                <td>{{ cToNumber(slotProps.capacity) }}</td>
                <td>{{ cToNumber(slotProps.contents_qty) }}</td>
                <td>{{ cToNumber(slotProps.qty) }}</td>
                <td>{{ slotProps.unit_m_kv_name }}</td>
                <td>{{ cToNumber(slotProps.price) }}</td>
                <td>{{ cToNumber(slotProps.total_price) }}</td>
                <td>{{ slotProps.m_user_name }}</td>
                <td class="text-truncate mw-250">{{ slotProps.invoice_memo }}</td>
                <td class="text-truncate mw-250">{{ slotProps.slip_memo }}</td>
            </template>

            <template v-slot:summary="slotProps">
                <td v-for="n in 9" :key="n"></td>
                <td>{{ cSummary(slotProps.list,'qty') }}</td>
                <td />
                <td />
                <td>{{ cSummary(slotProps.list,'total_price') }}</td>
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
    m_branch_id  : 0 ,
    purchase_date_from : "" ,
    purchase_date_to   : "" ,
    m_customer_id : 0 ,
    material_name : "" ,
    sort : "" ,
})

const cPurchaseDateFrom = computed({
    get : () => conditions.purchase_date_from ,
    set : (val) => {
        if(_.isEmpty(conditions.purchase_date_from)) {
            conditions.purchase_date_to = getCalcedMonth(val, 1) ;
        }
        conditions.purchase_date_from = val ;
    }
})

function initConditions() {
    conditions.m_branch_id = store.loginMUser?.m_branch_id ?? 0 ;
    cPurchaseDateFrom.value = "" ;
    conditions.purchase_date_to = "" ;
    conditions.m_customer_id = 0 ;
    conditions.material_name = "" ;
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
th:nth-of-type(9),  td:nth-of-type(9),
th:nth-of-type(10), td:nth-of-type(10),
th:nth-of-type(11), td:nth-of-type(11),
th:nth-of-type(12), td:nth-of-type(12),
th:nth-of-type(14), td:nth-of-type(14),
th:nth-of-type(15), td:nth-of-type(15) {
    text-align: right;
}
</style>
