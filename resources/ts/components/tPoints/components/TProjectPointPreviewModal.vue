<template>
    <div id="modalTProjectPointPreview" class="modal fade" tabindex="-1" role="dialog"
        aria-labelledby="modalTProjectPointPreview" aria-hidden="true" style="margin-top: 0px;">
        <div class="modal-dialog modal-dialog-fluid">
            <div class="app-modal-content-dark p-3">
                <div v-if="cIsShow">
                    <div class="pt-2 mb-3">
                        <h4>
                            <i class="fas fa-calculator"></i>
                            シミュレーション
                        </h4>
                    </div>
                    <div class="row mb-3 pt-2">
                        <div class="col-12">
                            <h5>
                                <i class="fas fa-building"></i>
                                物件
                            </h5>
                            <div class="table-responsive">
                                <table class="table table-striped table-dark text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>拠点</th>
                                            <th>営業担当</th>
                                            <th>取引先名</th>
                                            <th>物件名</th>
                                            <th>売上完了日</th>
                                            <th class="text-right">受注金額</th>
                                            <th class="text-right">売上金額</th>
                                            <th class="text-right">粗利</th>
                                            <th class="text-right">利益率</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{{ cProject.MBranchName }}</td>
                                            <td>{{ cProject.SalesMUserName }}</td>
                                            <td>{{ cProject.MCustomerName }}</td>
                                            <td>{{ cProject.cd }} - {{ cProject.name }}</td>
                                            <td>{{ cDateFormat(cProject.sales_completed_at) }}</td>
                                            <td class="text-right">{{ cToNumber(cProject.total_sell_price) }}</td>
                                            <td class="text-right">{{ cToNumber(cProject.total_sale_price) }}</td>
                                            <td class="text-right">{{ cToNumber(cProject.total_profit) }}</td>
                                            <td class="text-right">{{ cToNumber(cProject.ProfitPer) }}%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-3 pt-2">
                        <div class="col-12">
                            <h5>
                                <i class="fas fa-chart-pie"></i>
                                分配ポイント
                            </h5>
                        </div>
                        <div class="col-12 col-xl-2">
                            <div class="form-group">
                                <label>制作Pt率</label>
                                <div class="mt-2 border-bottom text-right" v-if="cProject?.IsClosed">{{
                                    cToNumber(cProject.ProdPer) }}%</div>
                                <validation-provider v-else name="制作Pt率" rules="required|min_value:0|max_value:100"
                                    :bails="false" v-slot="{ errors }">
                                    <ns-number-input v-model="cProject.ProdPer" />
                                    <span v-if="errors" class="validation-error">{{ errors[0] }}</span>
                                </validation-provider>
                            </div>
                        </div>
                        <div class="col-12 col-xl-2">
                            <div class="form-group">
                                <label>制作Pt</label>
                                <div class="mt-2 border-bottom text-right">{{ cToNumber(cProject.ProdPoint) }}</div>
                            </div>
                        </div>
                        <div class="col-12 col-xl-2">
                            <div class="form-group">
                                <label>施工Pt掛け率</label>
                                <div class="mt-2 border-bottom text-right" v-if="cProject?.IsClosed">{{
                                    cToNumber(cProject.ConstructCoef) }}</div>
                                <validation-provider v-else name="施工Pt掛け率" rules="required|min_value:0|max_value:100"
                                    :bails="false" v-slot="{ errors }">
                                    <ns-number-input v-model="cProject.ConstructCoef" />
                                    <span v-if="errors" class="validation-error">{{ errors[0] }}</span>
                                </validation-provider>
                            </div>
                        </div>
                        <div class="col-12 col-xl-2">
                            <div class="form-group">
                                <label>登録Pt掛け率</label>
                                <div class="mt-2 border-bottom text-right" v-if="cProject?.IsClosed">{{
                                    cToNumber(cProject.CreateCoef) }}</div>
                                <validation-provider v-else name="登録Pt掛け率" rules="required|min_value:0|max_value:100"
                                    :bails="false" v-slot="{ errors }">
                                    <ns-number-input v-model="cProject.CreateCoef" />
                                    <span v-if="errors" class="validation-error">{{ errors[0] }}</span>
                                </validation-provider>
                            </div>
                        </div>
                        <div class="col-12 col-xl-2">
                            <div class="form-group">
                                <label>営業Pt率</label>
                                <div class="mt-2 border-bottom text-right" v-if="cProject?.IsClosed">{{
                                    cToNumber(cProject.SalesPer) }}%</div>
                                <validation-provider v-else name="営業Pt率" rules="required|min_value:0|max_value:100"
                                    :bails="false" v-slot="{ errors }">
                                    <ns-number-input v-model="cProject.SalesPer" />
                                    <span v-if="errors" class="validation-error">{{ errors[0] }}</span>
                                </validation-provider>
                            </div>
                        </div>
                        <div class="col-12 col-xl-2">
                            <div class="form-group">
                                <label>営業Pt</label>
                                <div class="mt-2 border-bottom text-right">{{ cToNumber(cProject.SalesPoint) }}</div>
                            </div>
                        </div>

                    </div>


                    <div class="row mb-3 pt-2">
                        <div class="col-12">
                            <h5>
                                <i class="fas fa-user"></i>
                                集計
                            </h5>
                            <div class="table-responsive">
                                <table class="table table-striped table-dark text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>名前</th>
                                            <th>項目</th>
                                            <th class="text-right">制作Pt</th>
                                            <th class="text-right">営業Pt</th>
                                            <th class="text-right">獲得Pt</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="sum in cUsersSummary" :key="sum.m_user_id">
                                            <td>{{ sum.m_user_name }}</td>
                                            <td>{{ sum.details }}</td>
                                            <td class="text-right">{{ cToNumber(sum.prod_pt) }}</td>
                                            <td class="text-right">{{ cToNumber(sum.sales_pt) }}</td>
                                            <td class="text-right">{{ cToNumber(sum.total_pt) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="row mb-3 pt-2" id="accordionDetail">
                        <div class="col-12">
                            <a type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true"
                                aria-controls="collapseOne" role="button">
                                <h5>
                                    <i class="fas fa-list"></i>
                                    内訳
                                </h5>
                            </a>

                            <div id="collapseOne" class="collapse " aria-labelledby="headingOne"
                                data-parent="#accordionDetail">

                                <div class="row my-3">
                                    <div class="col-12 col-xl-6">
                                        <label>営業</label>
                                        <table class="table table-striped table-dark text-nowrap">
                                            <thead>
                                                <tr>
                                                    <th>名前</th>
                                                    <th class="text-right">獲得Pt</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{{ cProject.SalesMUserName }}</td>
                                                    <td class="text-right">{{ cToNumber(cProject.SalesPoint) }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div class="col-12 col-xl-6">
                                        <label>MIS入力</label>
                                        <table class="table table-striped table-dark text-nowrap">
                                            <thead>
                                                <tr>
                                                    <th>名前</th>
                                                    <th class="text-right">獲得Pt</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{{ cProject.CreatedMUserName }}</td>
                                                    <td class="text-right">{{ cMisRegUnitPoint.toLocaleString() }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                </div>

                                <div>
                                    <label>制作</label>
                                    <div class="table-responsive">
                                        <table class="table table-striped table-dark text-nowrap">
                                            <thead>
                                                <tr>
                                                    <th>名前</th>
                                                    <th>制作完了日</th>
                                                    <th>商品名</th>
                                                    <th>工程</th>
                                                    <th class="text-right">獲得Pt</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="prod in cProductions">
                                                    <td>{{ prod.m_user_name }}</td>
                                                    <td>{{ prod.date }}</td>
                                                    <td>{{ prod.product_name }}</td>
                                                    <td>{{ prod.m_process_category_name }}</td>
                                                    <td class="text-right">{{ cUnitPt.toLocaleString() }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div>
                                    <label>施工</label>
                                    <div class="table-responsive">
                                        <table class="table table-striped table-dark text-nowrap">
                                            <thead>
                                                <tr>
                                                    <th>名前</th>
                                                    <th>施工日</th>
                                                    <th class="text-right">獲得Pt</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="cons in cConstructions">
                                                    <td>{{ cons.m_user_name }}</td>
                                                    <td>{{ cons.date }}</td>
                                                    <td class="text-right">{{ cConstructUnitPoint.toLocaleString() }}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
                <div class="row">
                    <div class="col-12">
                        <div class=" text-right p-2">
                            <button type="button" class="btn btn-light" @click.prevent="closeModal">閉じる</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import Vue, { ref, computed, getCurrentInstance, reactive } from 'vue';
import { isEmpty } from 'lodash'
import { signmisReportComposition } from "../../reports/compositions/signmisReportComposition"
import { TProject4Point } from '../models/TProject4Point';

const { cDateFormat, cToNumber, cSummary } = signmisReportComposition();

interface IProps {
    value?: TProject4Point
}
const props = withDefaults(defineProps<IProps>(), {})

// interface IEmits {
//     (e: 'input' , val:object ): void
// }

// const emit = defineEmits<IEmits>() ;

//画面に描画する情報

const cProject = computed(() => props.value);

const cProductions = computed(() => props.value?.ProductionResults ?? []);
const cConstructions = computed(() => props.value?.ConstructionResults ?? []);
const cUsersSummary = computed(() => props.value?.UsersSummary ?? []);

const cUnitPt = computed(() => props.value?.UnitPoint ?? 0);
const cConstructUnitPoint = computed(() => props.value?.ConstructUnitPoint ?? 0);
const cMisRegUnitPoint = computed(() => props.value?.MisRegUnitPoint ?? 0);

const cDenominator = computed(() => props.value?.NumOfResult ?? 0);

//中身がないときエラー回避用
const cIsShow = computed(() => !isEmpty(props.value));

function openModal() {
    $('#modalTProjectPointPreview').modal();
}

function closeModal() {
    // emit("input",{}) ;
    $('#modalTProjectPointPreview').modal("hide");
}

</script>
<script lang="ts">
export default {
    methods: {
        openModal: function () {
            $('#modalTProjectPointPreview').modal();
        }
    }
}
</script>