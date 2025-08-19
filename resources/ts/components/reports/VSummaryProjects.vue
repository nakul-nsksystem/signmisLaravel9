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
                                :disabled="!cIsViewAllUserData"
                                />
                        </div>
                    </div>
                    <div class="col-12 col-xl-3 pl-xl-0">
                        <div class="form-group">
                            <label >請求予定日</label>
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
                                :disabled="!cIsViewAllUserData"
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
                    <div class="col-12 col-xl-2">
                        <div class="form-group">
                            <label>利益率</label>
                            <div class="d-flex flex-no-wrap">
                                <input type="number" class="form-control" v-model="conditions.profit_per_from">
                                <span class="px-1 pt-2">～</span>
                                <input type="number" class="form-control" v-model="conditions.profit_per_to">
                            </div>
                        </div>
                    </div>
                </div>

            </template>

            <template v-slot:th>
                <sr-th v-model="conditions.sort" colName="m_branch_name">拠点</sr-th>
                <sr-th v-model="conditions.sort" colName="m_user_name">営業担当</sr-th>
                <sr-th v-model="conditions.sort" colName="m_customer_cd">取引先CD</sr-th>
                <sr-th v-model="conditions.sort" colName="m_customer_name">取引先名</sr-th>
                <sr-th v-model="conditions.sort" colName="t_project_cd">物件CD</sr-th>
                <sr-th v-model="conditions.sort" colName="t_project_name">物件名</sr-th>
                <sr-th v-model="conditions.sort" colName="product_cnt">商品数</sr-th>
                <sr-th v-model="conditions.sort" colName="ordered_at">受注日</sr-th>
                <sr-th v-model="conditions.sort" colName="min_accounting_date">初回売上日</sr-th>
                <sr-th v-model="conditions.sort" colName="sales_completed_at">売上完了日</sr-th>
                <sr-th v-model="conditions.sort" colName="complete_day">請求予定日</sr-th>
                <sr-th v-model="conditions.sort" colName="total_price">金額</sr-th>
                <sr-th v-model="conditions.sort" colName="total_profit">粗利</sr-th>
                <sr-th v-model="conditions.sort" colName="profit_per">利益率</sr-th>
            </template>

            <template v-slot:td="slotProps">
                <td>{{ slotProps.m_branch_name }}</td>
                <td>{{ slotProps.m_user_name }}</td>
                <td>{{ slotProps.m_customer_cd }}</td>
                <td class="text-truncate mw-250">{{ slotProps.m_customer_name }}</td>
                <td>{{slotProps.t_project_cd}}</td>
                <td class="text-truncate mw-250">
                    <a :href='"v#/t_project/edit/"+slotProps.t_project_id'>{{slotProps.t_project_name}}</a>
                </td>
                <td>{{ cToNumber(slotProps.product_cnt) }}</td>
                <td>{{ cDateFormat(slotProps.ordered_at) }}</td>
                <td>{{ cDateFormat(slotProps.min_accounting_date) }}</td>
                <td>{{ cDateFormat(slotProps.sales_completed_at) }}</td>
                <td>{{ cDateFormat(slotProps.complete_day) }}</td>
                <td>{{ cToNumber(slotProps.total_price) }}</td>
                <td>{{ cToNumber(slotProps.total_profit) }}</td>
                <td :class="{'text-danger':cNeedToEstApprove(slotProps.profit_per)}">{{ cToNumber(slotProps.profit_per) }}%</td>
            </template>

            <template v-slot:summary="slotProps">
                <td v-for="n in 4" :key="n"></td>
                <td>{{ cSummary(slotProps.list,'product_cnt') }}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{{ cSummary(slotProps.list,'total_price') }}</td>
                <td>{{ cSummary(slotProps.list,'total_profit') }}</td>
                <td>{{ cProfitPerBySum(slotProps.list) }}%</td>
            </template>
        </sr-container>
    </div>
</template>

<script lang="ts" setup>
import _ from "lodash";
import { computed, reactive, ref } from 'vue';
import NumberUtil from "../../frameworks/NumberUtil";
import { useStore } from '../../stores/mainStore';
import { useMasterStore } from "../../stores/masterStore";
import { signmisReportComposition } from './compositions/signmisReportComposition'

const store = useStore() ;
const masterStore = useMasterStore() ;
const { cDateFormat, cToNumber, cSummary, cTermAlert, getCalcedMonth } = signmisReportComposition() ;

const conditions = reactive({
    complete_day_from : "" ,
    complete_day_to   : "" ,
    m_user_id : 0 ,
    m_branch_id : 0 ,
    m_customer_id : 0 ,
    profit_per_from : "" ,
    profit_per_to : "" ,
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

//検索項目担当者を変更できるフラグ
const cIsViewAllUserData = computed(() => store.getRole('projects_report-privilege') >= 20 ) ;

/**
 * 利益率赤字クラス
 * 承認必要％の場合は赤字にする
 */
const cNeedToEstApprove = computed(() => (val:number) => {
    const smMinProfit = masterStore.getSMOptionValByKeyMKvId(8010301) ?? 0 ;
    return Number(smMinProfit) >= val ;
})

//総利率計算
const cProfitPerBySum = computed(() =>
    (list:any[] ) => {
        if (_.isEmpty(list)) return "" ;
        const fPrice = _.sumBy(list , "total_price") ;
        const fProfit = _.sumBy(list , "total_profit") ;
        const val = (NumberUtil.invalid2zr(fProfit) / NumberUtil.invalid2zr(fPrice)) * 100 ;
        return cToNumber.value(NumberUtil.round(val,2)) ;
    }
) ;

function initConditions() {
    cCompleteDayFrom.value = "" ;
    conditions.complete_day_to = "" ;

    conditions.m_customer_id = 0 ;
    conditions.profit_per_from = "" ,
    conditions.profit_per_to = "" ,
    conditions.sort = "" ;

    //営業権限は担当者がログイン者のみの検索
    if(!cIsViewAllUserData.value) {
        conditions.m_user_id = store.loginMUser?.id ?? 0 ;
    }
    else {
        conditions.m_user_id = 0 ;
    }
    conditions.m_branch_id = store.loginMUser?.m_branch_id ?? 0 ;

}

initConditions()

</script>

<style scoped>
/* 明細：センター */
th:nth-of-type(8), td:nth-of-type(8),
th:nth-of-type(9), td:nth-of-type(9),
th:nth-of-type(10), td:nth-of-type(10) {
    text-align: center;
}

/* 明細：右揃え */
th:nth-of-type(7), td:nth-of-type(7),
th:nth-of-type(12), td:nth-of-type(12) ,
th:nth-of-type(13), td:nth-of-type(13) ,
th:nth-of-type(14), td:nth-of-type(14){
    text-align: right;
}
</style>
