<template>
    <validation-observer v-slot="{ invalid }">
        <div class="row" v-if="cIsShow">
            <div class="col">
                <div class="form-group">
                    <div class="row">
                        <contents-header-left></contents-header-left>
                        <contents-header-right>
                            <div class="float-right pt-2">
                                <button type="button" class="btn btn-dark" @click.prevent="onNewButton" :disabled="dLoading">
                                    <i class="fas fa-plus fa-fw"></i>新規
                                </button>
                                <button type="submit" class="btn btn-success" @click.prevent="postData()" :disabled="invalid || cIsDisabledSaveButton || dLoading">保存</button>
                                <button type="submit" class="btn btn-light" @click.prevent="historyBack()">戻る</button>
                            </div>
                        </contents-header-right>
                    </div>

                    <div class="row">
                        <div class="col">
                            <div v-if="$$cIsError" class="mt-1 mb-0 alert alert-danger" role="alert">
                                {{ dErrorData.message }}
                            </div>

                            <div v-if="dIsSaveSuccess" class="mt-1 mb-0 alert alert-success" role="alert">
                                保存に成功しました
                            </div>

                            <div v-if="cIsCompleted" class="mt-1 mb-0 alert alert-success" role="alert">
                                検収済みの為 保存はできません
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12" v-if="cIsShowSMM">
                        <div class="px-2 alert alert-primary" role="alert">
                            <div class="text-break">{{dCustomerSelectedItem?.sales_management_memo}}</div>
                        </div>
                    </div>
                </div>

                <div class="border-top">
                    <div class="row">
                        <div class="col-12 col-lg-12 pl-lg-0 form-group" />
                    </div>

                    <div class="row mx-1 text-lightgray">
                        <div class="col-12 col-lg-2 pl-lg-0">
                            <div class="form-group">
                                仕入No.：{{ cDisplayId }}
                            </div>
                        </div>
                        <div class="col-12 col-lg-2 pl-lg-0">
                            <div class="form-group">
                                仕入金額 (税抜)：{{ cTotalPriceDisp }}
                            </div>
                        </div>
                        <div class="col-12 col-lg-2 pl-lg-0">
                            <div class="form-group">
                                消費税：{{ cTaxDisp }}
                            </div>
                        </div>
                        <div class="col-12 col-lg-2 pl-lg-0">
                            <div class="form-group">
                                消費税 (仮)：{{ cTaxDispDummy }}
                            </div>
                        </div>
                        <div class="col-12 col-lg-2 pl-lg-0">
                            <div class="form-group">
                                更新者：{{ cDisplayUpdatedMUserName }}
                            </div>
                        </div>
                        <div class="col-12 col-lg-2 pl-lg-0">
                            <div class="form-group">
                                更新日：{{ cDisplayUpdatedAt }}
                            </div>
                        </div>
                    </div>

                    <div class="row mx-1">
                        <div class="col-12 col-lg-2 pl-lg-0">
                            <validation-provider name="仕入日" :rules="`required|custom_rule_date_range:${m$cSmEditableTerm}|custom_rule_date_or_later:my_custom_rule_day_min`" immediate v-slot="{ errors }">
                                <div class="form-group">
                                    <label>仕入日</label>
                                    <ex-v-date-picker
                                        v-model="cAccountingDate"
                                        :is-day-only=false
                                    />

                                    <validation-provider name="締処理日" rules="" vid="my_custom_rule_day_min" >
                                        <input class="d-none" v-model="cLastCompleteDay">
                                    </validation-provider>
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </div>
                            </validation-provider>
                        </div>

                        <div class="col-12 col-lg-2 pl-lg-0">
                            <validation-provider name="拠点" rules="required|excluded:0" v-slot="{ errors }">
                                <div class="form-group">
                                    <label>拠点</label>
                                    <m-branch-select
                                        v-model="dRow.m_branch_id"
                                    />
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </div>
                            </validation-provider>
                        </div>

                        <div class="col-12 col-lg-3 pl-lg-0">
                            <validation-provider name="仕入先" rules="required|excluded:0" immediate v-slot="{ errors }">
                                <div class="form-group">
                                    <label>仕入先</label>
                                    <m-customer-ref-input
                                        v-model="dRow.supplier_m_customer_id"
                                        :m-branch-id="dRow.m_branch_id"
                                        :dealing-cds="[2,4]"
                                        :selectedItem.sync="cCustomerItem"
                                    />
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </div>
                            </validation-provider>
                            <!-- <div v-if="cIsShowSMM">
                                <div class="px-2 alert alert-primary" role="alert">
                                    <div class="text-break">{{cCustomerItem?.sales_management_memo}}</div>
                                </div>
                            </div> -->
                        </div>

                        <div class="col-12 col-lg-2 pl-lg-0">
                            <validation-provider name="担当者" rules="required|excluded:0" v-slot="{ errors }">
                                <div class="form-group">
                                    <label>担当者</label>
                                    <m-user-select
                                        :m-branch-id="dRow.m_branch_id"
                                        v-model="dRow.m_user_id"
                                    />
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </div>
                            </validation-provider>
                        </div>

                        <div class="col-12 col-lg-2 pl-lg-0">
                            <validation-provider name="摘要" rules="custom_rule_max_bytelength:15,30" immediate v-slot="{ errors }">
                                <div class="form-group">
                                    <label for="slip_memo">摘要</label>
                                    <input class="form-control" id="slip_memo" v-model="dRow.slip_memo">
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </div>
                            </validation-provider>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12 col-lg-12 pl-lg-0 form-group" />
                    </div>
                </div>

                <validation-provider name="明細" rules="required" immediate v-slot="{ errors }">
                    <div class="form-group">
                        <input type="hidden" v-model="dDetailRows_Validation_Check">
                        <span class="validation-error">{{ errors[1] }}</span>
                        <span class="validation-error">{{ cValidationCheck }}</span>
                    </div>
                </validation-provider>

                <div class="form-group border-top">
                    <table class="table table-striped table-dark">
                        <thead>
                            <tr class="text-nowrap">
                                <th scope="col">No.</th>
                                <th scope="col">発注No.</th>
                                <th scope="col">材料名</th>
                                <th scope="col">寸法</th>
                                <th scope="col">容量</th>
                                <th scope="col">数量</th>
                                <th scope="col">単価</th>
                                <th scope="col">金額</th>
                                <th scope="col">消費税</th>
                                <th scope="col">備考</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="(n, index) in cDetails"
                                :key="n.id"
                                :class="{ selected:dSelectedRows.id === n.id }"
                                @click="selectRow(n)"
                                draggable
                                @dragstart="dragStart($event, index)"
                                @dragover.prevent="dragOver()"
                                @drop="drop(index)"
                            >
                                <td>{{ index + 1 }}</td>
                                <td>{{ cTPOrderNo(n.t_p_order_detail) }}</td>
                                <td>{{ n.material_name }}</td>
                                <td>{{ cToNumber(n.material_size_x) + " x " + cToNumber(n.material_size_y) }}</td>
                                <td>{{ cToNumber(n.capacity) }}</td>
                                <td>{{ cToNumber(n.qty) }}</td>
                                <td>{{ cToNumber(n.price) }}</td>
                                <td>{{ cToNumber(n.total_price) }}</td>
                                <td>{{ cToNumber(n.tax) }}</td>
                                <td>{{ n.slip_memo }}</td>

                                <td>
                                    <button type="button" class="btn btn-danger" @click.prevent="deleteRow(n)">
                                        <i class="fas fa-trash fa-fw" />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="form-group">
                    <div class="row">
                        <div class="col">
                            <div class="float-right">
                                <button type="button" class="btn btn-primary" @click.prevent="insertRow()" :disabled="cIsDisabledAddButton">
                                    <i class="fas fa-plus fa-fw" />
                                    新規追加
                                </button>

                                <!-- 発注検索[モーダル] -->
                                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalOrder" @click.prevent="modalShow()" :disabled="cIsDisabledAddButton">
                                    <i class="fas fa-plus fa-fw" />
                                    発注明細
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group border-top" v-if="cIsShowDetailArea">
                    <validation-observer v-slot="{ invalid }">
                        <div class="row">
                            <div class="col-12 col-lg-12 pl-lg-0 form-group" />
                        </div>

                        <div class="row mx-1">
                            <div class="col-12 col-lg-1 pl-lg-0">
                                <validation-provider name="仕入" rules="required|excluded:0" v-slot="{ errors }">
                                    <div class="form-group">
                                        <label>仕入</label>
                                        <m-kv-select
                                            v-model="dSelectedRows.purchase_m_kv_id"
                                            :selected-item.sync="dSelectedPurchaseMkv"
                                            :kv-key="'sales_management-purchase'"
                                        />
                                        <span class="validation-error">{{ errors[0] }}</span>
                                        <span class="validation-info">{{ cReInvoiceInfoMessage }}</span>
                                    </div>
                                </validation-provider>
                            </div>
                            <div class="col-12 col-lg-6 pl-lg-0">
                                <validation-provider name="材料名" rules="required|custom_rule_max_bytelength:23,46" immediate v-slot="{ errors }">
                                    <div class="form-group">
                                        <label for="material_name">材料名</label>
                                        <div class="input-group">
                                            <!-- 材料検索[モーダル] -->
                                            <button type="button" class="btn btn-success" data-toggle="modal" data-target="#modalMaterial" @click.prevent="modalShow2()" >
                                                <i class="fas fa-search fa-fw" />
                                            </button>
                                            <input class="form-control" id="material_name" v-model="dSelectedRows.material_name">
                                        </div>
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </div>
                                </validation-provider>
                            </div>
                            <div class="col-12 col-lg-1 pl-lg-0">
                                <div class="form-group">
                                    <label for="material_size_x">幅</label>
                                    <ns-number-input
                                        class="pl-lg-0"
                                        id="material_size_x"
                                        v-model="dSelectedRows.material_size_x"
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div class="col-12 col-lg-1 pl-lg-0">
                                <div class="form-group">
                                    <label for="material_size_y">流れ</label>
                                    <ns-number-input
                                        class="pl-lg-0"
                                        id="material_size_y"
                                        v-model="dSelectedRows.material_size_y"
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div class="col-12 col-lg-1 pl-lg-0">
                                <div class="form-group">
                                    <label for="capacity">容量</label>
                                    <ns-number-input
                                        class="pl-lg-0"
                                        id="capacity"
                                        v-model="dSelectedRows.capacity"
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div class="col-12 col-lg-2 pl-lg-0">
                                <div class="form-group">
                                    <label for="memo">社内メモ</label>
                                    <input class="form-control" id="memo" v-model="dSelectedRows.memo">
                                </div>
                            </div>
                        </div>

                        <div class="row mx-1">
                            <div class="col-12 col-lg-1 pl-lg-0">
                                <div class="form-group">
                                    <label for="qty">数量</label>
                                    <ns-number-input
                                        class="pl-lg-0"
                                        id="qty"
                                        v-model="cQty"
                                    />
                                    <validation-provider name="数量" rules="custom_rule_non_zero" immediate v-slot="{ errors }">
                                        <!-- 条件が複雑なのでcomputedで計算させた結果をvalidation -->
                                        <input type="hidden" v-model="cIsRequiredQty">
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </validation-provider>
                                </div>
                            </div>
                            <div class="col-12 col-lg-1 pl-lg-0">
                                <validation-provider name="単位" rules="required|excluded:0" immediate v-slot="{ errors }">
                                    <div class="form-group">
                                        <label>単位</label>
                                        <m-kv-select
                                            v-model="dSelectedRows.unit_m_kv_id"
                                            :kv-key="'m_materials-unit_m_kv_id'"
                                        />
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </div>
                                </validation-provider>
                            </div>
                            <div class="col-12 col-lg-1 pl-lg-0">
                                <validation-provider name="単価" rules="min_value:0" v-slot="{ errors }">
                                    <div class="form-group">
                                        <label for="price">単価</label>
                                        <ns-number-input
                                            class="pl-lg-0"
                                            id="price"
                                            v-model="cPrice"
                                        />
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </div>
                                </validation-provider>
                            </div>
                            <div class="col-12 col-lg-1 pl-lg-0">
                                <div class="form-group">
                                    <label for="total_price">金額</label>
                                    <ns-number-input
                                        class="pl-lg-0"
                                        id="total_price"
                                        v-model="dSelectedRows.total_price"
                                        disabled
                                    />
                                    <validation-provider name="金額" rules="custom_rule_zero_only" immediate v-slot="{ errors }">
                                        <!-- 条件が複雑なのでcomputedで計算させた結果をvalidation -->
                                        <input type="hidden" v-model="cIsRequiredTotalPrice">
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </validation-provider>
                                </div>
                            </div>
                            <div class="col-12 col-lg-1 pl-lg-0">
                                <validation-provider name="完了" rules="required|excluded:0" v-slot="{ errors }">
                                    <div class="form-group">
                                        <label>完了</label>
                                        <m-kv-select
                                            v-model="dSelectedRows.complete_m_kv_id"
                                            :input-class="{ 'pr-xl-0' : true }"
                                            :kv-key="'sales_management-complete'"
                                        />
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </div>
                                </validation-provider>
                            </div>
                            <div class="col-12 col-lg-2 pl-lg-0">
                                <div class="form-group">
                                    <label for="t_project_id">物件コード</label>
                                    <input class="form-control" id="t_project_id" readonly :value="cProjectCd">
                                </div>
                            </div>
                            <div class="col-12 col-lg-5 pl-lg-0">
                                <div class="form-group">
                                    <label for="detail_slip_memo">備考</label>
                                    <input class="form-control" id="detail_slip_memo" v-model="dSelectedRows.slip_memo">
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="row">
                                <div class="col clearfix">
                                    <div class="float-right">
                                        <button type="submit" class="btn btn-success" @click.prevent="updateRow()" :disabled="invalid">明細更新</button>
                                        <button type="submit" class="btn btn-secondary" @click.prevent="cancelRow()">キャンセル</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </validation-observer>
                </div>
            </div>
        </div>

        <!-- モーダルフォームへの受け渡し -->
        <!-- v-if[遅延描画(lazy)]ではなくv-show(常に描画)を使ってis-openを監視対象にしてください -->
        <t-p-invoice-order-list
            v-show="dIsModalOpen_TPOrder"
            :is-open.sync="dIsModalOpen_TPOrder"
            :p-branch-id.sync="dRow.m_branch_id"
            :p-customer-id.sync="dRow.supplier_m_customer_id"
            @hide="modalHide($event)"
        />
        <t-p-invoice-material-list
            v-show="dIsModalOpen_Material"
            :is-open.sync="dIsModalOpen_Material"
            :p-branch-id.sync="dRow.m_branch_id"
            :p-customer-id.sync="dRow.supplier_m_customer_id"
            @hide="modalHide2($event)"
        />
    </validation-observer>
</template>

<script>
import DayJsEx from "@frameworks/DayJsEx"
import NumberUtil from "@frameworks/NumberUtil"
import StringUtil from '@frameworks/StringUtil'
import PageMixins from '@mixins/commons/PageMixins'
import SalesManagementMixins from '@mixins/commons/SalesManagementMixins'
import BigNumber from 'big.js'
import DayJs from "dayjs"
import { isEmpty } from "lodash"
import { useMasterStore } from '../../stores/masterStore'
export default {
    mixins : [PageMixins ,SalesManagementMixins] ,
    data : function () {
        return {
            dApiName : "tPInvoice",
            dApiDetailName : "tPInvoiceDetail",
            dOriginal : undefined ,                             // オリジナルデータ(更新確認メッセージで使用)
            dRow : {
                id : 0,                                         // 新規:0 新規登録後は1以降になる
                purchase_date : null,                           // 仕入日
                accounting_date : null,                         // 計上日
                m_branch_id : 0,                                // 拠点
                supplier_m_customer_id : 0,                     // 仕入先
                m_user_id : 0,                                  // 仕入担当者
                account_m_kv_id : 1060000,                      // 締区分[未請求]
                t_complete_id : 0,                              // 売上・仕入締id
                total_price : 0,                                // 金額
                tax : 0,                                        // 消費税
                updated_at : null,                              // 更新日(リアクティブ用)
                updated_m_user : {
                    full_name : "",                             // 更新担当者名(リアクティブ用)
                },
                t_p_invoice_details : [],                       // 明細
            } ,
            dLastCompleteDay : null ,                           // チェック用の締情報(仕入先の最終締処理日)
            dCustomerSelectedItem : null,                       // 仕入先データ
            dIsValid_DetailAddButton : false,                   // 明細追加ボタンの有効状態(false:無効 true:有効)
            dIsShow_DetailArea : false,                         // 明細入力エリアの表示状態(false:表示しない true:表示する)
            dSelectedRows : {},                                 // 選択行
            dSelectedPurchaseMkv : {} ,                         // 選択されている仕入区分
            dAddRowNo : -10000,                                 // 新規作成時の仮行番号は加算(-9999, -9998, -9997, ...)で管理
            dIsModalOpen_TPOrder : false,                       // モーダル画面(発注)を起動するフラグ Modal画面+vuejsの条件付きレンダリング制御
            dIsModalOpen_Material : false,                      // モーダル画面(材料)を起動するフラグ Modal画面+vuejsの条件付きレンダリング制御
            dLoading : false,                                   // 非同期apiでの読込中フラグ
            dIsSaveSuccess : false,                             // 保存成功
            dDetailRows_Validation_Check : "ok",                // 明細データのValidationチェック用変数
            dDragIndex : null,                                  // ドラッグ中の要素を保持する為の変数
            dTaxDummy : 0,                                      // 締区分が請求時だと消費税が0になるので消費税を仮計算して画面に表示する為の変数
        }
    } ,
    computed : {
        cEndpoint : function () {
            let ep = `api/${this.dApiName}` ;

            if (this.dRow.id > 0) {
                ep += `/${this.dRow.id}` ;
            } else if (!this.cIsNew) {
                ep += `/${this.$route.params.id}` ;
            }

            return ep ;
        } ,
        cEndpoint2 : function () {
            return function (id = -1) {
                // 明細のURL
                let ep = `api/${this.dApiDetailName}` ;

                if (id != -1) ep += `/${id}` ;

                return ep ;
            } ;
        } ,
        cEndpointComplete : function () {
            return `api/tComplete/completeInfoOne` ;
        } ,
        cIsNew : function () {
            return this.$route.params.id === undefined ;
        } ,
        cIsShow : function () {
            return this.cIsNew || this.dRow.id > 0 ;
        } ,
        cIsCompleted : function () {
            // 検収済みの場合はtrue
            return this.dRow.t_complete_id != 0 ;
        } ,
        cLastCompleteDay : function () {
            if (this.dRow.t_complete_id == 0 && this.dLastCompleteDay) {
                // 締処理前の変更可能なデータ && 直近の締処理日がある場合は最終締処理日+1を設定
                return DayJsEx.format(DayJs(this.dLastCompleteDay).add(1, 'd')) ;
            }

            // 画面上でValidationが機能しないように[2000/1/1]で設定する
            return "2000-01-01" ;
        } ,
        cIsDisabledSaveButton : function () {
            // 明細追加ボタンの有効状態(検収済み Or 明細入力エリアが表示されている場合 Or 明細が1件も登録されてない場合は無効)
            return this.cIsCompleted || this.dIsShow_DetailArea || this.cDetails.length == 0 ;
        } ,
        cIsDisabledAddButton : function () {
            // 明細追加ボタンの有効状態(明細入力エリアが表示されている場合は無効)
            return this.dIsShow_DetailArea ;
        } ,
        cIsShowDetailArea : function () {
            // 明細入力エリアの有効状態
            return this.dIsShow_DetailArea ;
        } ,
        cDetails : function () {
            // 画面上で削除(論理削除)したデータはフィルターから除外
            let result = this.dRow.t_p_invoice_details ;

            result = result.filter((data) => {
                return (!data.deleted_at) ;
            }) ;

            return result ;
        } ,
        cToNumber : function () {
            return function (val) {
                return NumberUtil.formatZeroSuppress(val) ;
            } ;
        } ,
        cProjectCd : {
            get : function () {
                return this.dSelectedRows?.t_project?.cd ;
            } ,
            set : function (value) {
                if (!value) { this.dSelectedRows.t_project.cd = value ; }
            } ,
        } ,
        cPrice : {
            get : function () {
                return this.dSelectedRows.price ;
            } ,
            set : function (value) {
                this.dSelectedRows.price = value ;
                this.dSelectedRows.total_price = this.dSelectedRows.qty * value ;
            }
        } ,
        cQty : {
            get : function () {
                return this.dSelectedRows.qty ;
            } ,
            set : function (value) {
                this.dSelectedRows.qty = value ;
                this.dSelectedRows.total_price = value * this.dSelectedRows.price;
            }
        } ,
        cIsRequiredQty : function () {
            // 仕入区分が記入用[1200005]以外の場合に数量0はエラーとする
            return (this.dSelectedRows.purchase_m_kv_id != 1205005 &&  this.dSelectedRows.qty == 0) ? 0 : 1 ;
        } ,
        cIsRequiredTotalPrice : function () {
            // 仕入区分が記入用[1200005]の場合に金額0以外はエラーとする
            return (this.dSelectedRows.purchase_m_kv_id == 1205005 &&  this.dSelectedRows.total_price != 0) ? 1 : 0 ;
        } ,
        cCustomerItem : {
            get : function () {
                return this.dCustomerSelectedItem ;
            } ,
            set : function (value) {
                // computedで2回イベントが発生するので抑止目的で条件分を記述して制御してます
                if (value !== undefined && this.dCustomerSelectedItem?.id != value.id) {
                    // 先にm_customer_selected_itemをセット
                    this.dCustomerSelectedItem = value ;
                    this.dRow.account_m_kv_id  = value.account_m_kv_id ;

                    // 合計金額・消費税を再計算
                    this.taxCalcDetail() ;
                    this.taxCalcReceipt() ;
                    // 締情報データ
                    this.searchCompleteInfo() ;
                }
            } ,
        } ,
        //販売管理備考表示フラグ
        cIsShowSMM : function() {
            if(!this.cCustomerItem) return false ;
            return !isEmpty(this.cCustomerItem.sales_management_memo)
        } ,
        cAccountingDate : {
            get : function () {
                return this.dRow.accounting_date ;
            } ,
            set : function (value) {
                this.dRow.accounting_date = value ;

                // 合計金額・消費税を再計算
                this.taxCalcDetail() ;
                this.taxCalcReceipt() ;
                // 締情報データ
                this.searchCompleteInfo() ;
            } ,
        } ,
        cDisplayId : function() {
            // 変更時にidを表示
            return (this.dRow.id != 0 ? this.dRow.id : "") ;
        } ,
        cDisplayUpdatedMUserName : function() {
            // 最終更新者
            return this.dRow?.updated_m_user?.full_name ;
        } ,
        cDisplayUpdatedAt : function() {
            // 最終更新日時
            return DayJsEx.formatDateTime(this.dRow.updated_at) ;
        } ,
        cTotalPriceDisp : function() {
            // 明細の合計金額(画面表示用)
            return this.cToNumber(this.dRow.total_price) ;
        } ,
        cTaxDisp : function() {
            // 明細の合計消費税(画面表示用)
            return this.cToNumber(this.dRow.tax) ;
        } ,
        cTaxDispDummy : function() {
            // 仮消費税(画面表示用)
            return this.cToNumber(this.dTaxDummy) ;
        } ,
        cValidationCheck : function () {
            // 明細の桁数チェックを行い桁数があふれている場合は更新ボタンを押せない様にする
            let invalidMessage = "" ;
            let i = 0 ;

            for (const detail of this.dRow.t_p_invoice_details) {
                i++ ;
                // 削除フラグは無視
                if (detail.deleted_at == null) {
                    // 材料名の桁数確認
                    const len = StringUtil.getByteLengthOfShiftJIS(detail.material_name) ;
                    if (len > 46 ) {
                        invalidMessage += (", " + i) ;
                    }
                }
            }

            this.dDetailRows_Validation_Check = "ok" ;
            if (invalidMessage) {
                // validation.invalidに設定する
                this.dDetailRows_Validation_Check = null ;
                invalidMessage = invalidMessage.substr(2) + "行目：[材料名]の桁数を確認してください" ;
            }

            return invalidMessage ;
        } ,
        //画面に表示する発注No
        cTPOrderNo : function() {
            return function(tPOrderDs) {
                if(_.isEmpty(tPOrderDs)) return "" ;
                return `${tPOrderDs.t_p_order_id}-${tPOrderDs.id}`
            }
        } ,
        cReInvoiceInfoMessage : function () {
            return (this.dSelectedPurchaseMkv?.re_invoice_flg) ? "返還として処理します" : "" ;
        } ,
    } ,
methods : {
        searchCompleteInfo : async function () {
            // 取引区分・拠点・仕入先
            const params = JSON.parse(JSON.stringify({
                                dealing_m_kv_id:1010002,
                                m_branch_id:this.dRow.m_branch_id,
                                m_customer_id:this.dRow.supplier_m_customer_id,
                           })) ;

            try {
                // 検索処理
                const res = await axios.post(this.cEndpointComplete, params) ;
                this.dLastCompleteDay = res.data ;
            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.cEndpointComplete) ;
            }
        } ,
        getData : async function () {
            try {
                const res = await axios.get(this.cEndpoint) ;
                this.dRow = res.data ;

                // 検索後にオリジナルを保持しとく
                this.dOriginal = _.cloneDeep(this.dRow) ;

            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.cEndpoint) ;
            }
        } ,
        postData : async function () {
            this.dLoading = true ;

            // 締処理済ならば更新処理は行わない
            if (!(await this.isUpdateValidationCompleteSelf())) {
                this.dLoading = false ;
                return ;
            }
            // 締処理日以前は更新処理は行わない
            if (!(await this.isUpdateValidationCompleteDay())){
                this.dLoading = false ;
                return ;
            } 

            this.dIsSaveSuccess = false ;

            // 新規作成の明細idはnullでapiに渡す
            this.ifNewSetIdToNull();

            // order_noを連番に振り直し
            this.setSequenceNumbering();

            try {
                this.dRow.purchase_date                     = this.dRow.accounting_date ;
                // 最終更新者・日付
                this.dRow.updated_m_user_id                 = this.mainStore.loginMUser.id ;
                this.dRow.inc_children_updated_m_user_id    = this.mainStore.loginMUser.id ;
                this.dRow.inc_children_updated_at           = DayJsEx.nowTostring() ;

                // 合計金額・消費税を再計算
                this.taxCalcDetail() ;
                this.taxCalcReceipt() ;

                if (this.dRow.id == 0) {
                    // 追加
                    this.dRow.created_m_user_id = this.mainStore.loginMUser.id ;
                    const res = await axios.post(this.cEndpoint, this.dRow) ;
                    this.dRow = res.data ;
                } else {
                    // 更新
                    const res = await axios.put(this.cEndpoint, this.dRow) ;
                    this.dRow = res.data ;
                }
                this.dIsSaveSuccess = true ;

                // 日付はExDatePiker.vueで内部的に変換してるので保持する前に変換を行う
                this.dRow.accounting_date = DayJsEx.format(this.dRow.accounting_date) ;
                // 更新後にオリジナルを保持しとく
                this.dOriginal = _.cloneDeep(this.dRow) ;

            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.cEndpoint) ;
            }

            this.dLoading = false ;
        } ,
        taxCalcDetail : async function () {
            // 消費税を計算(明細)

            // 締区分・金額端数区分・消費税端数区分を参照
            const account        = this.dCustomerSelectedItem?.account_m_kv_id        ;
            const tax_fraction   = this.dCustomerSelectedItem?.tax_fraction_m_kv_id   ;
            const price_fraction = this.dCustomerSelectedItem?.price_fraction_m_kv_id ;

            // 税マスタ
            const mTax             = useMasterStore().getMTax(this.dRow.accounting_date) ;
            const         tax_rate = mTax?.tax_rate         ?? 0 ;
            const reduced_tax_rate = mTax?.reduced_tax_rate ?? 0 ;

            // 各明細の金額・消費税を計算
            const details = this.dRow.t_p_invoice_details.map(function(item) {
                // 税率を算出
                if (item.tax_m_kv_id == 1170001) {
                    // 通常税率[10% → 0.1]
                    item.tax_rate = tax_rate ;
                } else if (item.tax_m_kv_id == 1170002) {
                    // 軽減税率[8% → 0.08]
                    item.tax_rate = reduced_tax_rate ;
                } else if (item.tax_m_kv_id == 1170000) {
                    // 軽減税率[0% → 0]
                    item.tax_rate = 0 ;
                }

                if (account == 1060001) {
                    // 個別(1060001)
                    // 計算ライブラリを利用して税計算
                    const tax_calc = BigNumber(item.total_price).times(item.tax_rate).toNumber() ;

                    // 金額・消費税の端数計算
                    item.total_price = NumberUtil.rounding(item.total_price , price_fraction) ;
                    item.tax         = NumberUtil.rounding(tax_calc         , tax_fraction  ) ;
                } else if (account == 1060002 || account == 1060003) {
                    // 伝票時・請求時(1060002, 1060003)
                    item.total_price = NumberUtil.rounding(item.total_price , price_fraction) ;
                    item.tax = 0 ;
                } else {
                    // 未計算(1060000)
                    item.tax = 0 ;
                }

                return item ;
            });
        } ,
        taxCalcReceipt : async function () {
            // 消費税を計算(伝票)
            // 各明細の金額・消費税を計算して伝票合計に設定 画面で削除されたデータは計算しない

            // 締区分・金額端数区分・消費税端数区分を参照
            const account        = this.dCustomerSelectedItem?.account_m_kv_id        ;
            const tax_fraction   = this.dCustomerSelectedItem?.tax_fraction_m_kv_id   ;
            const price_fraction = this.dCustomerSelectedItem?.price_fraction_m_kv_id ;

            // 明細の金額を集計
            let      total_price_normal        = this.dRow.t_p_invoice_details.reduce(function(sum, item) { return sum + (item.tax_m_kv_id == 1170001 && item.deleted_at == null && item.purchase_m_kv.re_invoice_flg == 0 ? item.total_price : 0) ; }, 0) ; /*      金額 通常   */
            let      total_price_reduced       = this.dRow.t_p_invoice_details.reduce(function(sum, item) { return sum + (item.tax_m_kv_id == 1170002 && item.deleted_at == null && item.purchase_m_kv.re_invoice_flg == 0 ? item.total_price : 0) ; }, 0) ; /*      金額 軽減   */
            let      total_price_tax_exemption = this.dRow.t_p_invoice_details.reduce(function(sum, item) { return sum + (item.tax_m_kv_id == 1170000 && item.deleted_at == null && item.purchase_m_kv.re_invoice_flg == 0 ? item.total_price : 0) ; }, 0) ; /*      金額 非課税 */
            let   re_total_price_normal        = this.dRow.t_p_invoice_details.reduce(function(sum, item) { return sum + (item.tax_m_kv_id == 1170001 && item.deleted_at == null && item.purchase_m_kv.re_invoice_flg == 1 ? item.total_price : 0) ; }, 0) ; /* 軽減 金額 通常   */
            let   re_total_price_reduced       = this.dRow.t_p_invoice_details.reduce(function(sum, item) { return sum + (item.tax_m_kv_id == 1170002 && item.deleted_at == null && item.purchase_m_kv.re_invoice_flg == 1 ? item.total_price : 0) ; }, 0) ; /* 軽減 金額 軽減   */
            let   re_total_price_tax_exemption = this.dRow.t_p_invoice_details.reduce(function(sum, item) { return sum + (item.tax_m_kv_id == 1170000 && item.deleted_at == null && item.purchase_m_kv.re_invoice_flg == 1 ? item.total_price : 0) ; }, 0) ; /* 軽減 金額 非課税 */
            // 明細の消費税を集計
            const    tax_normal                = this.dRow.t_p_invoice_details.reduce(function(sum, item) { return sum + (item.tax_m_kv_id == 1170001 && item.deleted_at == null && item.purchase_m_kv.re_invoice_flg == 0 ? item.tax         : 0) ; }, 0) ; /*      消費税 通常 */
            const    tax_reduced               = this.dRow.t_p_invoice_details.reduce(function(sum, item) { return sum + (item.tax_m_kv_id == 1170002 && item.deleted_at == null && item.purchase_m_kv.re_invoice_flg == 0 ? item.tax         : 0) ; }, 0) ; /*      消費税 軽減 */
            const re_tax_normal                = this.dRow.t_p_invoice_details.reduce(function(sum, item) { return sum + (item.tax_m_kv_id == 1170001 && item.deleted_at == null && item.purchase_m_kv.re_invoice_flg == 1 ? item.tax         : 0) ; }, 0) ; /* 軽減 消費税 通常 */
            const re_tax_reduced               = this.dRow.t_p_invoice_details.reduce(function(sum, item) { return sum + (item.tax_m_kv_id == 1170002 && item.deleted_at == null && item.purchase_m_kv.re_invoice_flg == 1 ? item.tax         : 0) ; }, 0) ; /* 軽減 消費税 軽減 */

            if (account == 1060002) {
                // 伝票別(1060002)：金額の端数計算
                   total_price_normal                  = NumberUtil.rounding(   total_price_normal        , price_fraction) ; /*      通常   */
                   total_price_reduced                 = NumberUtil.rounding(   total_price_reduced       , price_fraction) ; /*      軽減   */
                   total_price_tax_exemption           = NumberUtil.rounding(   total_price_tax_exemption , price_fraction) ; /*      非課税 */
                re_total_price_normal                  = NumberUtil.rounding(re_total_price_normal        , price_fraction) ; /* 返還 通常   */
                re_total_price_reduced                 = NumberUtil.rounding(re_total_price_reduced       , price_fraction) ; /* 返還 軽減   */
                re_total_price_tax_exemption           = NumberUtil.rounding(re_total_price_tax_exemption , price_fraction) ; /* 返還 非課税 */
                // dRowに反映
                this.dRow.total_price_normal           =    total_price_normal        ;                                       /*      通常   */
                this.dRow.total_price_reduced          =    total_price_reduced       ;                                       /*      軽減   */
                this.dRow.total_price_tax_exemption    =    total_price_tax_exemption ;                                       /*      非課税 */
                this.dRow.re_total_price_normal        = re_total_price_normal        ;                                       /* 返還 通常   */
                this.dRow.re_total_price_reduced       = re_total_price_reduced       ;                                       /* 返還 軽減   */
                this.dRow.re_total_price_tax_exemption = re_total_price_tax_exemption ;                                       /* 返還 非課税 */
                this.dRow.total_price                  = total_price_normal + total_price_reduced + total_price_tax_exemption + re_total_price_normal + re_total_price_reduced + re_total_price_tax_exemption ;

                // 計算ライブラリを利用して税計算
                const mTax               = useMasterStore().getMTax(this.dRow.accounting_date) ;
                const         tax_rate   = mTax?.tax_rate         ?? 0 ;
                const reduced_tax_rate   = mTax?.reduced_tax_rate ?? 0 ;
                const    tax_calc        = BigNumber(   total_price_normal ).times(        tax_rate).toNumber() ;
                const    tax_reduced     = BigNumber(   total_price_reduced).times(reduced_tax_rate).toNumber() ;
                const re_tax_calc        = BigNumber(re_total_price_normal ).times(        tax_rate).toNumber() ;
                const re_tax_reduced     = BigNumber(re_total_price_reduced).times(reduced_tax_rate).toNumber() ;

                // 消費税の端数計算
                this.dRow.tax_normal     = NumberUtil.rounding(   tax_calc   , tax_fraction) ;
                this.dRow.tax_reduced    = NumberUtil.rounding(   tax_reduced, tax_fraction) ;
                this.dRow.re_tax_normal  = NumberUtil.rounding(re_tax_calc   , tax_fraction) ;
                this.dRow.re_tax_reduced = NumberUtil.rounding(re_tax_reduced, tax_fraction) ;
                this.dRow.tax            = this.dRow.tax_normal + this.dRow.tax_reduced + this.dRow.re_tax_normal + this.dRow.re_tax_reduced ;

            } else {
                // 個別・請求時・未計算(1060000, 1060001, 1060003)：金額計上(通常・軽減・非課税) 端数処理：請求時は締処理時、個別は個々
                this.dRow.total_price_normal           =    total_price_normal        ; /*      通常   */
                this.dRow.total_price_reduced          =    total_price_reduced       ; /*      軽減   */
                this.dRow.total_price_tax_exemption    =    total_price_tax_exemption ; /*      非課税 */
                this.dRow.re_total_price_normal        = re_total_price_normal        ; /* 返還 通常   */
                this.dRow.re_total_price_reduced       = re_total_price_reduced       ; /* 返還 軽減   */
                this.dRow.re_total_price_tax_exemption = re_total_price_tax_exemption ; /* 返還 非課税 */
                this.dRow.total_price                  = total_price_normal + total_price_reduced + total_price_tax_exemption + re_total_price_normal + re_total_price_reduced + re_total_price_tax_exemption ;

                // 消費税計上
                if (account == 1060000 || account == 1060003) {
                    // 未計算・請求時(1060000, 1060003)：請求時に計算するので0で計上
                    this.dRow.tax_normal     = 0 ;              /*      通常 */
                    this.dRow.tax_reduced    = 0 ;              /*      軽減 */
                    this.dRow.re_tax_normal  = 0 ;              /* 返還 通常 */
                    this.dRow.re_tax_reduced = 0 ;              /* 返還 軽減 */
                    this.dRow.tax            = 0 ;              /* 合計      */
                } else {
                    // 個別(1060001)：消費税を計上
                    this.dRow.tax_normal     = tax_normal     ; /*      通常 */
                    this.dRow.tax_reduced    = tax_reduced    ; /*      軽減 */
                    this.dRow.re_tax_normal  = re_tax_normal  ; /* 返還 通常 */
                    this.dRow.re_tax_reduced = re_tax_reduced ; /* 返還 軽減 */
                    this.dRow.tax            = tax_normal + tax_reduced + re_tax_normal + re_tax_reduced ;
                }
            }

            // 消費税を仮計算
            this.taxCalcReceiptDummy() ;
        } ,
        taxCalcReceiptDummy : async function () {
            // 消費税を仮計算(伝票)
            // 各明細の金額・消費税を計算して伝票合計に設定 画面で削除されたデータは計算しない
            // 締区分が請求時だと消費税が0になるので消費税を仮計算して画面に表示する為の変数を計算
            // taxCalcReceipt()と同じ処理を行っているが 既存のソース・データに影響を与えたくないのでこのmethodで別途記述しています

            // 締区分・金額端数区分・消費税端数区分を参照
            const account        = this.dCustomerSelectedItem?.account_m_kv_id        ;
            const tax_fraction   = this.dCustomerSelectedItem?.tax_fraction_m_kv_id   ;
            const price_fraction = this.dCustomerSelectedItem?.price_fraction_m_kv_id ;

            // 明細の金額を集計
            let      total_price_normal        = this.dRow.t_p_invoice_details.reduce(function(sum, item) { return sum + (item.tax_m_kv_id == 1170001 && item.deleted_at == null && item.purchase_m_kv.re_invoice_flg == 0 ? item.total_price : 0) ; }, 0) ; /*      金額 通常   */
            let      total_price_reduced       = this.dRow.t_p_invoice_details.reduce(function(sum, item) { return sum + (item.tax_m_kv_id == 1170002 && item.deleted_at == null && item.purchase_m_kv.re_invoice_flg == 0 ? item.total_price : 0) ; }, 0) ; /*      金額 軽減   */
            let      total_price_tax_exemption = this.dRow.t_p_invoice_details.reduce(function(sum, item) { return sum + (item.tax_m_kv_id == 1170000 && item.deleted_at == null && item.purchase_m_kv.re_invoice_flg == 0 ? item.total_price : 0) ; }, 0) ; /*      金額 非課税 */
            let   re_total_price_normal        = this.dRow.t_p_invoice_details.reduce(function(sum, item) { return sum + (item.tax_m_kv_id == 1170001 && item.deleted_at == null && item.purchase_m_kv.re_invoice_flg == 1 ? item.total_price : 0) ; }, 0) ; /* 軽減 金額 通常   */
            let   re_total_price_reduced       = this.dRow.t_p_invoice_details.reduce(function(sum, item) { return sum + (item.tax_m_kv_id == 1170002 && item.deleted_at == null && item.purchase_m_kv.re_invoice_flg == 1 ? item.total_price : 0) ; }, 0) ; /* 軽減 金額 軽減   */
            let   re_total_price_tax_exemption = this.dRow.t_p_invoice_details.reduce(function(sum, item) { return sum + (item.tax_m_kv_id == 1170000 && item.deleted_at == null && item.purchase_m_kv.re_invoice_flg == 1 ? item.total_price : 0) ; }, 0) ; /* 軽減 金額 非課税 */

            this.dTaxDummy = 0 ;
            if (account == 1060003) {
                // 請求別(1060003)：金額の端数計算
                   total_price_normal                  = NumberUtil.rounding(   total_price_normal        , price_fraction) ; /*      通常   */
                   total_price_reduced                 = NumberUtil.rounding(   total_price_reduced       , price_fraction) ; /*      軽減   */
                   total_price_tax_exemption           = NumberUtil.rounding(   total_price_tax_exemption , price_fraction) ; /*      非課税 */
                re_total_price_normal                  = NumberUtil.rounding(re_total_price_normal        , price_fraction) ; /* 返還 通常   */
                re_total_price_reduced                 = NumberUtil.rounding(re_total_price_reduced       , price_fraction) ; /* 返還 軽減   */
                re_total_price_tax_exemption           = NumberUtil.rounding(re_total_price_tax_exemption , price_fraction) ; /* 返還 非課税 */

                // 計算ライブラリを利用して税計算+端数計算
                const mTax               = useMasterStore().getMTax(this.dRow.accounting_date) ;
                const         tax_rate   = mTax?.tax_rate         ?? 0 ;
                const reduced_tax_rate   = mTax?.reduced_tax_rate ?? 0 ;
                const    tax_calc        = NumberUtil.rounding(BigNumber(   total_price_normal ).times(        tax_rate).toNumber(), tax_fraction) ;
                const    tax_reduced     = NumberUtil.rounding(BigNumber(   total_price_reduced).times(reduced_tax_rate).toNumber(), tax_fraction) ;
                const re_tax_calc        = NumberUtil.rounding(BigNumber(re_total_price_normal ).times(        tax_rate).toNumber(), tax_fraction) ;
                const re_tax_reduced     = NumberUtil.rounding(BigNumber(re_total_price_reduced).times(reduced_tax_rate).toNumber(), tax_fraction) ;

                // 仮消費税を設定
                this.dTaxDummy = tax_calc + tax_reduced + re_tax_calc + re_tax_reduced ;
            }
        } ,
        ifNewSetIdToNull : async function () {
            this.dRow.t_p_invoice_details.forEach((item) => {
                // 新規作成の明細idはnullでapiに渡す
                item.id = item.id < 0 ? null : item.id ;
            });
        } ,
        isUpdateValidationCompleteSelf : async function () {
            // 追加時 更新OK
            if (this.dRow.id == 0) return true ;

            try {
                // 更新時 自身を検索して最新データの締処理idを取得
                const res = await axios.get(this.cEndpoint) ;
                // 請求idのみ上書き
                this.dRow.t_complete_id = res.data.t_complete_id ;
                // 検収済の場合は処理を行わない
                return !this.cIsCompleted ;
            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.cEndpointComplete) ;
                // エラー発生時は処理を行わない
                return false ;
            }
        } ,
        isUpdateValidationCompleteDay : async function () {
            // 締処理情報を取得
            await this.searchCompleteInfo();

            // 1件も締めてない新規仕入先は処理を続行
            if (!this.dLastCompleteDay) return true ;

            // 締処理日以前は更新処理は行わない
            return DayJsEx.compareDate(this.dLastCompleteDay, this.dRow.accounting_date) == "before" ;
        } ,
        historyBack : function () {
            this.$router.push({ name : Inflector.underscore(this.dApiName) }) ;
        } ,
        initRow : function () {
            // 明細の初期化
            this.dSelectedRows = {
                id : 0,                             // 仕入明細id
                t_p_invoice_id : 0,                 // 仕入id
                m_material_detail_id : null,        // 材料明細id
                material_name : null,               // 品名・銘柄
                qty : 1,                            // 数量 デフォルト：1
                unit_m_kv_id : 1530000,             // 単位区分[]
                price : 0,                          // 単価
                total_price : 0,                    // 金額
                capacity : 0,                       // 容量
                material_size_x : 0,                // 材料サイズX
                material_size_y : 0,                // 材料サイズY
                t_project_id : null,                // 物件id
                tax_rate  : 10,                     // 税率[10%]
                tax_m_kv_id : 1170001,              // 税区分[外税10%]
                purchase_m_kv_id : 1205001,         // 仕入区分[仕入]
                complete_m_kv_id : 1210001,         // 完了区分[完了]
                accounts_title_m_kv_id : 1265000,   // 勘定科目[未設定]
                slip_memo: null,                    // 備考
            } ;
        } ,
        cancelRow : function () {
            // キャンセル処理
            this.initRow() ;
            this.dIsShow_DetailArea = false ;
        } ,
        selectRow : function (row) {
            // 選択行を設定(DeepCopy)
            this.dSelectedRows = JSON.parse(JSON.stringify(row)) ;

            // 選択行の削除日が設定されてない場合は明細を表示
            // 削除ボタンを押された後にこのイベントに来ることが有るのでfindIndexでデータを検索して反映後の削除日を確認してます
            const index = this.dRow.t_p_invoice_details.findIndex(e => e.id === row.id) ;
            if (index != -1 && !this.dRow.t_p_invoice_details[index].deleted_at) {
                this.dIsShow_DetailArea = true ;
            }
        } ,
        insertRow : function () {
            // 追加処理
            this.initRow() ;
            this.dIsShow_DetailArea = true ;
        } ,
        updateRow : async function () {
            // 選択行を設定(DeepCopy)
            const detail = JSON.parse(JSON.stringify(this.dSelectedRows)) ;
            // 選択されている仕入区分を設定
            detail.purchase_m_kv     = this.dSelectedPurchaseMkv ;
            detail.updated_m_user_id = this.mainStore.loginMUser.id ;

            if (detail.id == 0) {
                // 明細追加
                detail.created_m_user_id = this.mainStore.loginMUser.id ;
                detail.t_p_invoice_id = 0 ;

                // 新規作成時の仮行番号は加算(-9999, -9998, -9997, ...)で管理
                detail.id = ++this.dAddRowNo ;
                this.dRow.t_p_invoice_details.push(detail) ;
            } else {
                // 明細更新 & 明細追加した後に画面内で更に更新
                const index = this.dRow.t_p_invoice_details.findIndex(e => e.id === detail.id) ;
                if (index != -1) {
                    this.dRow.t_p_invoice_details.splice(index, 1, detail) ;
                }
            }

            // 合計金額・消費税を再計算
            this.taxCalcDetail() ;
            this.taxCalcReceipt() ;

            // 選択解除
            this.cancelRow() ;
        } ,
        deleteRow : async function (row) {
            if (!confirm('削除してもよろしいですか?')) return ;
            this.dIsShow_DetailArea = false ;

            // 削除した行を非表示にするロジック
            this.deleteRowDetail(row) ;

            // 合計金額・消費税を再計算
            this.taxCalcDetail() ;
            this.taxCalcReceipt() ;

            // 選択解除
            this.cancelRow() ;
        } ,
        deleteRowDetail : function (row) {
            // 削除した行を非表示にするロジック
            const index = this.dRow.t_p_invoice_details.findIndex(e => e.id === row.id) ;
            if (index != -1) {
                // 選択行を設定(DeepCopy)
                const detail = JSON.parse(JSON.stringify(row)) ;
                detail.updated_m_user_id = this.mainStore.loginMUser.id ;
                detail.deleted_at = new Date() ; // 削除フラグ

                if (detail.t_p_invoice_id == 0) {
                    // 新規に追加した行は物理削除
                    this.dRow.t_p_invoice_details.splice(index, 1) ;
                } else {
                    // 登録済みの明細行
                    this.dRow.t_p_invoice_details.splice(index, 1, detail) ;
                }
            }
        } ,
        modalShow : function () {
            // 発注検索(モーダル)を表示
            this.dIsModalOpen_TPOrder = true ;
        } ,
        modalShow2 : function () {
            // 材料検索(モーダル)を表示
            this.dIsModalOpen_Material = true ;
        } ,
        modalHide : function (args) {
            // 選択されている発注データ一覧
            for (const n of args) {
                // 仕入用に抽出
                const invoice = {
                    id                     : ++this.dAddRowNo                     , // 仕入明細id
                    t_p_invoice_id         : 0                                    , // 仕入id
                    t_p_order_detail_id    : n.t_p_order_detail_id                , // 発注明細id
                    m_material_detail_id   : n.m_material_detail_id               , // 材料明細id
                    material_name          : n.material_name                      , // 品名・銘柄
                    qty                    : n.qty                                , // 数量
                    price                  : n.price                              , // 単価
                    total_price            : n.total_price                        , // 金額
                    capacity               : n.capacity                           , // 容量
                    material_size_x        : n.material_size_x                    , // 材料サイズX
                    material_size_y        : n.material_size_y                    , // 材料サイズY
                    t_project_id           : n.t_project_id                       , // 物件id
                    unit_m_kv_id           : n.unit_m_kv_id                       , // 単位区分
                    tax_rate               : 10                                   , // 税率[10%]
                    tax_m_kv_id            : 1170001                              , // 税区分[外税10%]
                    purchase_m_kv_id       : 1205001                              , // 仕入区分[仕入]
                    purchase_m_kv          : { id : 1205001, re_invoice_flg : 0 } , // 仕入区分[] 初期追加用
                    complete_m_kv_id       : 1210001                              , // 完了区分[完了]
                    accounts_title_m_kv_id : 1265000                              , // 勘定科目[未設定]
                    slip_memo              : n.slip_memo                          , // 備考
                    created_m_user_id      : this.mainStore.loginMUser.id         , // 作成担当者
                    updated_m_user_id      : this.mainStore.loginMUser.id         , // 更新担当者
                    t_p_order_detail       : n.t_p_order_detail                   , // 発注No表示用発注明細
                } ;

                // 新規で拠点が設定されてない場合は上書き
                if (this.dRow.id == 0 && !this.dRow.m_branch_id) { this.dRow.m_branch_id = n.m_branch_id ; }

                // 新規で同一拠点の取引先が設定されてない場合は取引先を上書き
                if (this.dRow.id == 0 && !this.dRow.supplier_m_customer_id && this.dRow.m_branch_id == n.m_branch_id) { this.dRow.supplier_m_customer_id = n.m_customer_id ; }

                // データ追加
                this.dRow.t_p_invoice_details.push(invoice) ;
            }
        } ,
        modalHide2 : function (args) {
            // 選択されている材料データ一覧
            for (const n of args) {
                // 仕入用に抽出
                const material = {
                    m_material_detail_id   : n.m_material_detail_id , // 材料明細id
                    material_name          : n.material_name        , // 品名・銘柄
                    qty                    : n.qty                  , // 数量
                    price                  : n.price                , // 単価
                    total_price            : 0                      , // 金額
                    capacity               : n.capacity             , // 容量
                    material_size_x        : n.material_size_x      , // 材料サイズX
                    material_size_y        : n.material_size_y      , // 材料サイズY
                    unit_m_kv_id           : n.unit_m_kv_id         , // 単位区分
                    tax_rate               : n.tax_rate             , // 税率
                    tax_m_kv_id            : n.tax_m_kv_id          , // 税区分
                    complete_m_kv_id       : 1210001                , // 完了区分[完了]
                    accounts_title_m_kv_id : 1265000                , // 勘定科目[未設定]
                } ;

                // データ追加
                Object.assign(this.dSelectedRows, material);
            }
        } ,
        getIsUpdated : function() {
            if(this.dOriginal === undefined) return false ;

            const original = JSON.stringify(this.dOriginal) ;
            const work     = JSON.stringify(this.dRow) ;

            // オリジナルと画面で作業した内容を比較する
            return original !== work ;
        } ,
        confirmUpdate() {
            // 内容が変更されているか確認
            if (!this.getIsUpdated()) return true ;

            // 内容が変更されている場合は確認メッセージを表示
            return confirm('内容を保存せずに移動してもよろしいでしょうか？') ;
        } ,
        dragStart : function (event, index) {
            // 移動モードに設定
            event.dataTransfer.effectAllowed = 'move' ;
            // ドラッグ中の要素[index:明細キー]のみ保持
            this.dDragIndex = index ;
        } ,
        dragOver : function () {
            // 1. dragOverを明示的に記述しないとdropイベントが発生しない
            // 2. dragOver時にブラウザにデフォルトアクションを明示的に止めるように伝えたいのでpreventを付与
        } ,
        drop : function (index) {
            // ドラッグ中の要素とドラッグ先の要素を入れ替える
            this.moveAt(index)
            // ドラッグ中の要素をクリア
            this.dDragIndex = null ;
        } ,
        moveAt : function(index) {
            if (index === this.dDragIndex || index > this.dRow.t_p_invoice_details.length -1 || this.dDragIndex > this.dRow.t_p_invoice_details.length - 1) {
                return ;
            }

            // 配列の要素を指定位置に移動させる
            const value = this.dRow.t_p_invoice_details[this.dDragIndex] ;
            this.dRow.t_p_invoice_details.splice(this.dDragIndex, 1) ;
            this.dRow.t_p_invoice_details.splice(index, 0, value) ;
        } ,
        swap : function (array, source, target) {
            // クローン作成
            const clone = [...array] ;
            // 配列の入れ替えは分割代入機能を利用して入れ替え
            [clone[target], clone[source]] = [array[source], array[target]] ;

            return clone ;
        } ,
        setSequenceNumbering : function () {
            // order_noを連番に振り直し
            this.dRow.t_p_invoice_details.map((value, no) => {
                value.order_no = no + 1 ;
                return value
            }) ;
        } ,
        // 全データ初期化
        initAllData : function (isKeepCustomer = false) {
            this.dRow.id = 0
            this.dRow.purchase_date = null
            this.dRow.accounting_date = null
            this.dRow.m_branch_id = this.mainStore.loginMUser.m_branch_id
            this.dRow.m_user_id = this.$$cLoginUserId
            if (!isKeepCustomer) this.dRow.supplier_m_customer_id =  0
            if (!isKeepCustomer) this.dRow.account_m_kv_id = 1060000
            this.dRow.total_price = 0
            this.dRow.tax = 0
            this.dRow.updated_at = null
            this.dRow.updated_m_user = {
                full_name : "",
            },
            this.dRow.slip_memo = "" ,
            this.dRow.t_p_invoice_details.splice(0) ;

            this.dOriginal = undefined ;
            if (!isKeepCustomer) this.dCustomerSelectedItem = null
            this.dIsValid_DetailAddButton = false
            this.dIsShow_DetailArea = false
            this.dSelectedRows = {} ;
            this.dSelectedPurchaseMkv = {} ;
            this.dAddRowNo = -10000 ;
            this.dIsModalOpen_TPOrder = false ;
            this.dIsModalOpen_Material = false ;
            this.dLoading = false ;
            this.dIsSaveSuccess = false ;
            this.dDetailRows_Validation_Check = "ok" ;
            this.dDragIndex = null ;
            this.$$clearError() ;
        } ,
        // 新規ボタン
        onNewButton : function() {
            if (!this.confirmUpdate()) return ;

            const is = confirm("取引先を引き継ぎますか？") ;
            this.initAllData(is) ;

            if (this.$route.path !== "/t_p_invoice/add") {
                this.$router.push({ path:'../../add', append:true }) ;
            }
        } ,
    } ,
    created : function () {
        if (this.cIsNew) {
            // 新規
            this.dRow.m_branch_id = this.mainStore.loginMUser.m_branch_id ;  // 拠点
            this.dRow.m_user_id = this.mainStore.loginMUser.id ;             // 仕入担当者
        } else {
            // 変更
            this.getData() ;
        }
    } ,
    beforeRouteLeave (to, from, next) {
        // 画面遷移前イベント：内容が変更されていて作業を続行する場合は処理を抜ける
        if (!this.confirmUpdate()) return ;

        next() ;
    } ,
}
</script>

<style scoped>
    /* 明細：右揃え */
    th:nth-child(n+4):nth-child(-n+8),
    td:nth-child(n+4):nth-child(-n+8) {
        text-align: right;
    }
</style>
