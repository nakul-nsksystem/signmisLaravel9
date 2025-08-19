<template>
    <export-accounting-container
        :conditions="conditions"
        title="入金">
        <template v-slot:conditions>
            <div class="row mx-1">
                <div class="col-12 pl-xl-0">
                    <validation-provider name="拠点" rules="required|excluded:0" v-slot="{ errors }">
                        <div class="form-group">
                            <div class="col-12 col-xl-5 px-0">
                                <label>拠点</label>
                                <m-branch-select 
                                    v-model="conditions.m_branch_id"
                                />
                            </div>

                            <span class="validation-error">{{ errors[0] }}</span>
                            <span class="validation-info">{{ cBranchInfoMessage(conditions.m_branch_id) }}</span>
                        </div>
                    </validation-provider>
                </div>
            </div>

            <div class="row mx-1">
                <div class="col-12 pl-xl-0">
                    <div class="row ml-0">
                        <div class="col px-0">
                            <validation-provider name="開始日" rules="" vid="my_custom_rule_day_min" v-slot="{ errors }">
                                <div class="form-group">
                                    <label>日付</label>
                                    <ex-v-date-picker v-model="cDayMin" />
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </div>
                            </validation-provider>
                        </div>
                        <div class="col px-0">
                            <div class="form-group">
                                <p>&emsp;</p>
                                <p class="text-center">～</p>
                            </div>
                        </div>
                        <div class="col pl-0">
                            <validation-provider name="終了日" rules="custom_rule_date_or_later:my_custom_rule_day_min" v-slot="{ errors }">
                                <div class="form-group">
                                    <label>&emsp;</label>
                                    <ex-v-date-picker v-model="conditions.day_max" />
                                    <span class="validation-error pb-0" style="height:auto;">{{ errors[0] }}</span>
                                </div>
                            </validation-provider>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mx-1">
                <div class="col-12 pl-xl-0">
                    <div class="form-group">
                        <ns-checkbox-input
                            v-model="cCanBeInputCustomer"
                            id="can_be_entered_customer"
                            label="取引先を指定"
                            class="mb-2"
                        />
                        <m-customer-ref-input 
                            v-model="conditions.m_customer_id"
                            :m-branch-id="conditions.m_branch_id"
                            :dealing-cds="[1]"
                            :disabled="!cCanBeInputCustomer"
                        />

                        <validation-provider name="取引先" rules="required" immediate v-slot="{ errors }">
                            <!-- 条件が複雑なのでcomputedで計算させた結果をvalidation -->
                            <input type="hidden" v-model="cIsRequired">
                            <span class="validation-error">{{ errors[0] }}</span>
                        </validation-provider>
                    </div>
                </div>
            </div>

            <div class="row mx-1">
                <div class="col-12 pl-xl-0">
                    <div class="row ml-0">
                        <div class="col px-0">
                            <div class="form-group">
                                <label for="id_min">請求No.</label>
                                <input class="form-control" id="id_min" v-model="cIdMin" />
                            </div>
                        </div>
                        <div class="col-1 px-0">
                            <div class="form-group">
                                <p>&emsp;</p>
                                <p class="text-center">～</p>
                            </div>
                        </div>
                        <div class="col pl-0">
                            <div class="form-group">
                                <label>&emsp;</label>
                                <input class="form-control" id="id_max" v-model="conditions.id_max" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-slot:th>
            <th scope="col">請求No.</th>
            <th scope="col">拠点</th>
            <th scope="col">入金日</th>
            <th scope="col">入金区分</th>
            <th scope="col">取引先名</th>
            <th scope="col" class="d-none d-lg-table-cell text-right">単価</th>
        </template>
        <template v-slot:td="slotProps">
            <td class="text-nowrap">{{ slotProps.t_complete_id }}</td>
            <td class="text-nowrap">{{ cMBranchName(slotProps.m_branch_id) }}</td>
            <td class="text-nowrap">{{ cDateFormat(slotProps.payment_day) }}</td>
            <td class="text-nowrap">{{ slotProps.payment_m_kv_name }}</td>
            <td class="text-truncate clamp">{{ slotProps.customer_name }}</td>
            <td class="text-nowrap d-none d-lg-table-cell text-right">{{ cToNumber(slotProps.price) }}</td>
        </template>
    </export-accounting-container>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue';
import { exportAccontingComposition } from './compositions/exportAccontingComposition'


const {cToNumber ,cDateFormat ,state ,cBranchInfoMessage ,cMBranchName　} = exportAccontingComposition() ;

// 画面上の検索項目
const conditions = reactive({
    m_branch_id : 0 ,                   // 拠点(ログインユーザーの拠点)
    m_customer_id : 0 ,                 // 取引先id
    id_min : "" ,                       // 入金Id(Min)
    id_max : "" ,                       // 入金Id(Max)
    day_min : null ,                    // 処理日(Min)
    day_max : null ,                    // 処理日(Max)
    is_csv_output : 0 ,                     // 出力済みを対象(0:未出力 1:出力済み)
})

// 取引先<checkbox>チェックが付いている & <m-customer-ref-input>未入力時は必須とする
const cIsRequired = computed(() => (cCanBeInputCustomer.value && conditions.m_customer_id == 0) ? null : "ok") ;

const cCanBeInputCustomer = computed({
    get : () => state.isEbleToInputCustomer ,
    set : (value) => {
        // 取引先idをクリア(=0)する
        state.isEbleToInputCustomer = value ;
        conditions.m_customer_id = 0 ;
    } ,
}) ;

const cDayMin = computed({
    get : () => conditions.day_min ,
    set : (value) => {
        // 終了日は開始日の1ヶ月先の前日
        conditions.day_min = value ;
        //@ts-ignore
        conditions.day_max = DayJs(value).add(1, 'M').subtract(1, 'd').format('YYYY-MM-DD') ;
    }
}) ;
const cIdMin = computed({
    get : () => conditions.id_min ,
    set : (value) => {
        // 終了日は開始日の1ヶ月先の前日
        conditions.id_min = value ;
        conditions.id_max = value ;
    }
}) ;

</script>

<style scoped>

/* クランプ表示用 */
.clamp {
    max-width: 200px; /* クランプ使用時に(min,max)widthプロパティを設定 */
}

/* クランプ解除用 */
.clamp:hover {
    white-space: normal;
}

/* メッセージ表示用 */
.validation-info {
    white-space:pre-wrap;
    word-wrap:break-word;
}

</style>
