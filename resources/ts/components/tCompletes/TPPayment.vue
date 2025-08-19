<template>
    <validation-observer v-slot="{ invalid }">
        <div class="row">
            <div class="col">
                <div class="form-group">
                    <div class="row">
                        <contents-header-left></contents-header-left>
                        <contents-header-right>
                            <div class="float-right pt-2">
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
                                {{ dInfoMessage }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group border-top" />

                <div class="row">
                    <div class="col-12 pb-2 col-lg-3">
                        <div class="row mx-1">
                            <div class="col-12 pl-xl-0">
                                <validation-provider name="拠点" rules="required|excluded:0" v-slot="{ errors }">
                                    <div class="form-group">
                                        <label>拠点</label>
                                        <m-branch-select 
                                            v-model="cMBranchId"
                                        />

                                        <span class="validation-error">{{ errors[0] }}</span>
                                        <div class="validation-info" style="white-space:pre-wrap; word-wrap:break-word;">{{ cBranchInfoMessage }}</div>
                                    </div>
                                </validation-provider>
                            </div>
                        </div>

                        <div class="row mx-1">
                            <div class="col-12 pl-xl-0">
                                <validation-provider name="仕入先" rules="required|excluded:0" immediate v-slot="{ errors }">
                                    <div class="form-group">
                                        <label>仕入先</label>
                                        <m-customer-ref-input-any
                                            v-model="dRow.m_customer_id"
                                            :m-branch-id="dRow.m_branch_id"
                                            :dealing-cds="[2,4]"
                                            :selectedItem.sync="cCustomerItem"
                                            :searchColumn="'data_linkage_cd'"
                                        />

                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </div>
                                </validation-provider>
                            </div>
                            <div class="col-12 pl-xl-0" v-if="cIsShowSMM">
                                <div class="px-2 alert alert-primary" role="alert">
                                    <div class="text-break">{{dCustomerSelectedItem?.sales_management_memo}}</div>
                                </div>
                            </div>
                        </div>

                        <div class="row mx-1">
                            <div class="col-xl-7 pl-xl-0">
                                <validation-provider name="支払日" :rules="`required|custom_rule_date_range:${m$cSmEditableTerm}|custom_rule_date_or_later:my_custom_rule_day_min`" immediate v-slot="{ errors }">
                                    <div class="form-group">
                                        <div class="col-12 px-0">
                                            <label>支払日</label>
                                            <ex-v-date-picker v-model="dRow.payment_day" />
                                        </div>

                                        <validation-provider name="最終締処理日" rules="" vid="my_custom_rule_day_min" >
                                            <input class="d-none" v-model="cLastCompleteDay">
                                        </validation-provider>

                                        <span class="validation-error">{{ errors[0] }}</span>
                                        <span class="validation-info" style="white-space:pre-wrap; word-wrap:break-word;">{{ cCompleteDayInfoMessage }}</span>
                                    </div>
                                </validation-provider>
                            </div>
                            <div class="col-xl-5 pl-xl-0">
                                <div class="form-group">
                                    <label>対象仕入締No.</label>
                                    <ns-number-input 
                                        id="target_t_complete_id"
                                        v-model="dRow.target_t_complete_id"
                                    />
                                    <validation-provider name="仕入締No." rules="is:OK" immediate v-slot="{ errors }">
                                        <input class="d-none" v-model="cTargetCompleteId">
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </validation-provider>
                                </div>
                            </div>
                        </div>

                        <div class="row mx-1">
                            <div class="col-12 pl-xl-0">
                                <validation-provider name="区分" rules="required|excluded:0" vid="payment_m_kv_id" v-slot="{ errors }">
                                    <div class="form-group">
                                        <label>支払区分</label>
                                        <m-kv-select
                                            v-model="dRow.payment_m_kv_id"
                                            :kv-key="'sales_management-payment'"
                                        />
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </div>
                                </validation-provider>
                            </div>
                        </div>

                        <div class="row mx-1">
                            <div class="col-12 pl-xl-0">
                                <validation-provider name="金額" rules="required" v-slot="{ errors }">
                                    <div class="form-group">
                                        <label for="closing_date">金額</label>
                                        <ns-number-input 
                                            id="closing_date"
                                            v-model="dRow.payment_price"
                                        />
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </div>
                                </validation-provider>
                            </div>
                        </div>

                        <div class="row mx-1">
                            <div class="col-12 pl-xl-0">
                                <div class="form-group">
                                    <label for="slip_memo">手形・電子債権</label>
                                    <input class="form-control" id="slip_memo" v-model="dRow.bill_no">
                                </div>
                            </div>
                        </div>

                        <div class="row mx-1">
                            <div class="col-12 pl-xl-0">
                                <validation-provider name="期日" rules="required_if:payment_m_kv_id,1150003,1150004" immediate v-slot="{ errors }">
                                    <div class="form-group">
                                        <div class="col-12 px-0">
                                            <label>期日</label>
                                            <ex-v-date-picker v-model="dRow.bill_due_day" />
                                        </div>

                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </div>
                                </validation-provider>
                            </div>
                        </div>

                        <div class="row mx-1">
                            <div class="col-12 pl-xl-0">
                                <div class="form-group">
                                    <label for="slip_memo">備考</label>
                                    <input class="form-control" id="memo" v-model="dRow.memo">
                                </div>
                            </div>
                        </div>

                        <div class="row form-group" />

                        <div class="row mx-1">
                            <div class="col-12 pl-xl-0">
                                <div>
                                    <button type="submit" class="btn btn-secondary" @click.prevent="add()" :disabled="invalid || !cAddable || dLoadingAdd">
                                        <div v-if="dLoadingAdd">
                                            <span class="spinner-border spinner-border-sm" role="status" />
                                            追加
                                        </div>
                                        <div v-else>
                                            <i class="fas fa-check" />
                                            追加
                                        </div>
                                    </button>
                                    <button type="submit" class="btn btn-success" @click.prevent="change()" :disabled="invalid || !cUpdatable || dLoadingChange">
                                        <div v-if="dLoadingChange">
                                            <span class="spinner-border spinner-border-sm" role="status" />
                                            変更
                                        </div>
                                        <div v-else>
                                            <i class="fas fa-database" />
                                            変更
                                        </div>
                                    </button>
                                    <button type="submit" class="btn btn-primary" @click.prevent="clear()" >
                                        <i class="fas fa-file-alt" />
                                        クリア
                                    </button>
                                    <span class="validation-info" style="white-space:pre-wrap; word-wrap:break-word;">{{ cUpdateInfoMessage }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-12 col-lg-9">
                        <div class="row mx-1">
                            【仕入締情報】
                            <div class="col-12 py-2 pl-xl-0">
                                <pagination
                                    :p-pagination.sync="dPaginationComplete"
                                    @search="searchComplete($event)"
                                />
                            </div>

                            <div class="col-12 pl-xl-0">
                                <table class="table table-striped table-dark table-hover summary">
                                    <thead>
                                        <tr class="text-nowrap">
                                            <th scope="col">No.</th>
                                            <th scope="col">仕入締No.</th>
                                            <th scope="col">締処理日</th>
                                            <th scope="col" class="d-none d-md-table-cell">繰越</th>
                                            <th scope="col">支払</th>
                                            <th scope="col">仕入+消費税</th>
                                            <th scope="col">仕入締額</th>
                                            <th scope="col" class="d-none d-md-table-cell">未払残</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr v-for="(n, index) in dRowsComplete" :key="n.id">
                                            <td>{{ index + 1 }}</td>
                                            <td class="text-nowrap">{{ n.id }}</td>
                                            <td class="text-nowrap">{{ cDateFormat(n.complete_day) }}</td>
                                            <td class="text-nowrap d-none d-md-table-cell">{{ cToNumber(n.carry_over) }}</td>
                                            <td class="text-nowrap">{{ cToNumber(n.payment_price) }}</td>
                                            <td class="text-nowrap">{{ cToNumber(n.total_price) }}</td>
                                            <td class="text-nowrap">{{ cToNumber(n.grand_total) }}</td>
                                            <td class="text-nowrap d-none d-md-table-cell">{{ cToNumber(n.balance) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="border-top" />
                        <div class="row form-group" />
                        
                        <div class="row mx-1">
                            【支払情報】
                            <div class="col-12 py-2 pl-xl-0">
                                <pagination
                                    :p-pagination.sync="dPaginationPayment"
                                    @search="searcPayment($event)"
                                />
                            </div>

                            <div class="col-12 pl-xl-0">
                                <table class="table table-striped table-dark table-hover list">
                                    <thead>
                                        <tr class="text-nowrap">
                                            <th scope="col">No.</th>
                                            <th scope="col">支払日</th>
                                            <th scope="col">支払区分</th>
                                            <th scope="col">金額</th>
                                            <th scope="col">手形</th>
                                            <th scope="col">期日</th>
                                            <th scope="col" class="d-none d-md-table-cell">備考</th>
                                            <th scope="col">削除</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr v-for="(n, index) in dRowsPayment" :key="n.id" @click="selectRow(n)" :class="{ selected:dRow.id === n.id }">
                                            <td>{{ index + 1 }}</td>
                                            <td class="text-nowrap">{{ cDateFormat(n.payment_day) }}</td>
                                            <td class="text-nowrap">{{ n.payment_m_kv.kv_name }}</td>
                                            <td class="text-nowrap">{{ cToNumber(n.payment_price) }}</td>
                                            <td class="text-nowrap">{{ n.bill_no }}</td>
                                            <td class="text-nowrap">{{ cDateFormat(n.bill_due_day) }}</td>
                                            <td class="text-truncate d-none d-md-table-cell clamp">{{ n.memo }}</td>
                                            <td>
                                                <button v-if="n.t_complete_id==0" type="button" class="btn btn-danger" @click.prevent="remove(n.id)" :disabled="dLoadingDelete">
                                                    <i class="fas fa-trash fa-fw" />
                                                </button>
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
    </validation-observer>
</template>

<script>
import DayJs      from "dayjs" ; 
import DayJsEx    from "@frameworks/DayJsEx" ;
import NumberUtil from "@frameworks/NumberUtil" ;
import PageMixins from '@mixins/commons/PageMixins' ;
import { isEmpty } from 'lodash';
import SalesManagementMixins from '@mixins/commons/SalesManagementMixins'

export default {
    mixins : [PageMixins ,SalesManagementMixins] , 
    data : function () {
        return {
            dApiName : "tCompleteDetail",
            dApiCompleteName : "tComplete",
            dRowsComplete : {                       // 結果データ(締処理)
            } ,
            dRowsPayment : {                        // 結果データ(支払)
            } ,
            dPaginationComplete : {                 // pagination(締処理)
                links : [] ,                        // リンク
                total : -1 ,                        // 合計件数
                from : -1 ,                         // 現在ページの開始位置
                to : -1 ,                           // 現在ページの終了位置
            } ,
            dPaginationPayment : {                  // pagination(支払)
                links : [] ,                        // リンク
                total : -1 ,                        // 合計件数
                from : -1 ,                         // 現在ページの開始位置
                to : -1 ,                           // 現在ページの終了位置
            } ,
            dRow : {                                // 画面上の項目
                id : 0,                             // 新規:0 新規登録後は1以降になる
                t_complete_id : 0 ,                 // 仕入締id
                target_t_complete_id : null ,       // 対象仕入締id
                m_user_id : 0 ,                     // ログインユーザーid
                m_branch_id : 0 ,                   // 拠点(ログインユーザーの拠点)
                m_customer_id : 0 ,                 // 仕入先id
                dealing_m_kv_id : 1010002 ,         // 取引区分(買)
                payment_m_kv_id : 1150001 ,         // 支払区分
                payment_price : 0 ,                 // 支払額
                payment_day : null ,                // 支払日
                bill_due_day : null ,               // 期日
                bill_no : null ,                    // 手形№
                memo : null ,                       // 備考
            } ,
            dCompleteInfo : [{                      // チェック用の仕入締情報
                id : 0 ,                            // id
                complete_day : null ,               // 仕入締日
            }] ,
            dCustomerSelectedId : 0 ,               // CustomerRefInputで選択時に2回走らせない為の保持用
            dLoadingAdd : false ,                   // 非同期apiでの読込中フラグ(追加)
            dLoadingChange : false ,                // 非同期apiでの読込中フラグ(変更)
            dLoadingDelete : false ,                // 非同期apiでの読込中フラグ(削除)
            dIsSaveSuccess : false ,                // 保存成功
            dInfoMessage : null ,                   // メッセージ


            dCustomerSelectedItem : {} // CustomerRefInputで選択した顧客アイテム

        }
    } ,
    computed : {
        cEndpoint : function () {
            return `api/${this.dApiName}` ;
        } ,
        cEndpointComplete : function () {
            return `api/${this.dApiCompleteName}` ;
        } ,
        cBranchInfoMessage : function () {
            // 拠点の妥当性チェックを行い アラートメッセージが有れば情報を出力する
            let message = "" ;

            if (this.dRow.m_branch_id == 0) {

            } else if (this.dRow.m_branch_id != this.mainStore.loginMUser.m_branch_id) {
                message += "ログイン担当者の拠点と違います" ;
            }

            return message ;
        } ,
        cCompleteDayInfoMessage : function () {
            // 締日と締処理日の妥当性チェックを行い アラートメッセージが有れば情報を出力する
            let message = "" ;

            if (this.dRow.payment_day && this.dRow.t_complete_id == 0) {
                // DayJsオブジェクト作成(時間カット)
                const complete_day = DayJs(this.dRow.payment_day) ;
                const now          = DayJs().startOf('D') ;
                
                // 3ヶ月以上離れてる：typoの可能性
                if (complete_day > now.add(3, 'M')) {
                    message = "3ヶ月以降の日が設定されています \n" ;
                } else if (complete_day < now.subtract(3, 'M')) {
                    message = "3ヶ月以前の日が設定されています \n" ;
                }
            }

            return message ;
        } ,
        cUpdateInfoMessage : function () {
            // 仕入締済みの場合はアラートメッセージを出力する
            if (this.dRow.t_complete_id != 0) {
                return "支払日・金額は変更されません \n" ;
            }

            return "" ;
        } ,
        cDateFormat : function () {
            return function (val) {
                return DayJsEx.format(val) ;
            } ;
        } ,
        cToNumber : function () {
            return function (val) {
                // return NumberUtil.formatZeroSuppress(val, false) ;
                return NumberUtil.formatZeroSuppress(val) ;
            } ;
        } ,
        cAddable : function () {
            return this.dRow.id == 0 ;
        } ,
        cUpdatable : function () {
            return this.dRow.id != 0 ;
        } ,
        cLastCompleteDay : function () {
            if (this.dRow.t_complete_id == 0) {
                // 締処理前の変更可能な支払明細データ

                // 直近の仕入締日を取得
                const completeDay = _.max(
                    this.dCompleteInfo
                        .filter(item => item.id > 0)
                        .map   (item => item.complete_day)
                ) ;
                
                // 直近の仕入締日がある場合は最終仕入締日+1を設定
                if (completeDay) {
                    return DayJsEx.format(DayJs(completeDay).add(1, 'd')) ;
                }
            }

            // 締処理後の支払データはDB更新は行わないが画面上でValidationが機能しないように[2000/1/1]で設定する
            return "2000-01-01" ;
        } ,
        cTargetCompleteId : function () {
            if (this.dRow.target_t_complete_id) {
                // 対象仕入締№が入力されている場合は仕入締idのチェック
                const targetComplete = this.dCompleteInfo.filter(item => item.id == this.dRow.target_t_complete_id) ;
                // 仕入締idがリストにあれば検証OK
                return targetComplete.length == 1 ? "OK" : "NG" ;
            }

            // 未入力時は検証OK
            return "OK" ;
        } ,
        cMBranchId : {
            get : function () {
                return this.dRow.m_branch_id ;
            } ,
            set : function (value) {
                this.dRow.m_branch_id = value ;
                // 拠点の支払日は直近の支払日に設定
                this.dRow.payment_day = this.getPaymentDay(value) ;
            } ,
        } ,
        cCustomerItem : {
            get : function () {
                // NOP
                return this.dCustomerSelectedItem
            } ,
            set : function (value) {
                if (value !== undefined && this.dCustomerSelectedId != value.id) {
                    this.dCustomerSelectedId = value.id ;  
                    if (value.id) {
                        // 取引先を変更したので再検索
                        this.search() ;
                    } else {
                        // 請求・請求情報・支払データを初期化
                        this.init() ;
                    }
                }

                this.dCustomerSelectedItem = value ;

            } ,
        } ,

        
        //販売管理備考表示フラグ
        cIsShowSMM : function() {
            if(!this.dCustomerSelectedItem) return false ;
            return !isEmpty(this.dCustomerSelectedItem.sales_management_memo)
        }
    } ,
    methods : {
        searchComplete : async function (url) { 
            const ep = (url? url : this.cEndpointComplete + "/completes") ;
            const params = this.getParamsComplete() ;

            try {
                // 検索処理
                const res = await axios.post(ep, params) ;
                this.dRowsComplete = res.data.data ;
                // pagination関連
                this.dPaginationComplete.links = res.data.links ;   // リンク
                this.dPaginationComplete.total = res.data.total ;   // 合計件数
                this.dPaginationComplete.from  = res.data.from ;    // 現在ページの開始位置
                this.dPaginationComplete.to    = res.data.to ;      // 現在ページの終了位置
            } catch (error) {
                // handle error
                this.$$errorConsole(error, ep) ;
            }
        } ,
        searchCompleteInfo : async function () { 
            const ep = this.cEndpointComplete + "/completeInfo" ;
            const params = this.getParamsComplete() ;

            try {
                // 検索処理
                const res = await axios.post(ep, params) ;
                this.dCompleteInfo = res.data ;
            } catch (error) {
                // handle error
                this.$$errorConsole(error, ep) ;
            }
        } ,
        searcPayment : async function (url) { 
            const ep = (url? url : this.cEndpoint + "/retrieve") ;
            const params = this.getParamsComplete() ;

            try {
                // 検索処理
                const res = await axios.post(ep, params) ;
                this.dRowsPayment = res.data.data ;
                // pagination関連
                this.dPaginationPayment.links = res.data.links ;   // リンク
                this.dPaginationPayment.total = res.data.total ;   // 合計件数
                this.dPaginationPayment.from  = res.data.from ;    // 現在ページの開始位置
                this.dPaginationPayment.to    = res.data.to ;      // 現在ページの終了位置
            } catch (error) {
                // handle error
                this.$$errorConsole(error, ep) ;
            }
        } ,
        search : function () {
            // 再検索
            this.reSearch() ;
            // クリア
            this.clear() ;
            // メッセージをクリア
            this.dIsSaveSuccess = false ;
        } ,
        reSearch : function () {
            // 仕入締データ
            this.searchComplete() ;
            // 仕入締情報データ
            this.searchCompleteInfo() ;
            // 支払データ
            this.searcPayment() ;
        } ,
        init : function () {
            // 締処理・締情報・支払データを初期化
            this.dRowsComplete = {} ;
            this.dCompleteInfo = [{}] ;
            this.dRowsPayment  = {} ;

            // pagination(締処理・支払)初期化
            this.dPaginationComplete = { total : -1 } ;
            this.dPaginationPayment  = { total : -1 } ;
        } ,
        clear : function () {
            // 明細データ初期化
            this.dRow.id                    = 0 ;           // 新規:0
            this.dRow.t_complete_id         = 0 ;           // 仕入締id
            this.dRow.target_t_complete_id  = null ;        // 対象仕入締id
            this.dRow.payment_m_kv_id       = 1150001 ;     // 支払区分
            this.dRow.payment_price         = 0 ;           // 支払額
            this.dRow.bill_due_day          = null ;        // 期日
            this.dRow.bill_no               = null ;        // 手形№
            this.dRow.memo                  = null ;        // 備考

            this.$$clearError() ;
        } ,
        add : function () {
            this.dLoadingAdd = true ;
            // 追加
            this.postData() ;
            this.dLoadingAdd = false ;
        } ,
        change : function () {
            this.dLoadingChange = true ;
            // 変更
            this.postData() ;
            this.dLoadingChange = false ;
        } ,
        remove : async function (id) {
            if (!confirm('削除してもよろしいですか?')) return ;

            try {
                const ep = this.cEndpoint + `/${id}` ;
                const res = await axios.delete(ep) ;
                this.dInfoMessage = "削除しました" ;
                this.dIsSaveSuccess = true ;

                // 再検索
                this.reSearch() ;
                // クリアして追加モードに
                this.clear() ;
            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.cEndpoint) ;
            }
        } ,
        postData : async function () {
            // 最終更新者・日付
            this.dRow.updated_m_user_id       = this.mainStore.loginMUser.id ;
            this.dRow.inc_children_updated_at = DayJsEx.nowTostring() ;
            // 対象仕入締id=0はNullに置き換える
            this.dRow.target_t_complete_id = (this.dRow.target_t_complete_id == 0 ? null : this.dRow.target_t_complete_id) ;

            try {
                if (this.dRow.id == 0) {
                    // 追加
                    this.dRow.created_m_user_id = this.mainStore.loginMUser.id ;
                    const res = await axios.post(this.cEndpoint, this.dRow) ;
                    this.dRow = res.data ;
                    const target_id = this.dRow.target_t_complete_id ;
                    // クリアして登録モードに設定
                    this.clear() ;
                    this.dRow.target_t_complete_id = target_id ;
                    this.dInfoMessage = "追加しました" ;
                } else {
                    // 更新
                    const ep = (this.cEndpoint + `/${this.dRow.id}`) ;
                    // 過去データの日付・金額は変更不可にする
                    const params = this.getParamsCompleteDetail() ;
                    const res = await axios.put(ep, params) ;
                    this.dRow = res.data ;
                    this.dInfoMessage = "更新しました" ;
                }
                this.dIsSaveSuccess = true ;

                // 再検索
                this.reSearch() ;
            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.cEndpoint) ;
            }
        } ,
        selectRow : function (row) {
            // 選択行を設定(DeepCopy)
            this.dRow = JSON.parse(JSON.stringify(row)) ;
        } ,
        getParamsComplete : function () {
            // 拠点・仕入先・取引区分
            return JSON.parse(JSON.stringify({
                        dealing_m_kv_id:this.dRow.dealing_m_kv_id, 
                        m_branch_id:this.dRow.m_branch_id,
                        m_customer_id:this.dRow.m_customer_id, 
                   })) ;
        } ,
        getParamsCompleteDetail : function () {
            // 支払データが締処理前か後かの確認
            if (this.dRow.t_complete_id == 0) {
                // 締処理前
                return JSON.parse(JSON.stringify({
                            id:this.dRow.id, 
                            target_t_complete_id:this.dRow.target_t_complete_id, 
                            m_user_id:this.dRow.m_user_id, 
                            payment_m_kv_id:this.dRow.payment_m_kv_id, 
                            bill_due_day:this.dRow.bill_due_day, 
                            bill_no:this.dRow.bill_no, 
                            memo:this.dRow.memo, 
                            payment_price:this.dRow.payment_price,
                            payment_day:this.dRow.payment_day, 
                       })) ;
            } else {
                // 締処理後：支払日と金額は変更不可
                return JSON.parse(JSON.stringify({
                            id:this.dRow.id, 
                            target_t_complete_id:this.dRow.target_t_complete_id, 
                            m_user_id:this.dRow.m_user_id, 
                            payment_m_kv_id:this.dRow.payment_m_kv_id, 
                            bill_due_day:this.dRow.bill_due_day, 
                            bill_no:this.dRow.bill_no, 
                            memo:this.dRow.memo, 
                       })) ;
            }
        } ,
        getPaymentDay : function (branchId) {
            let payDay = DayJs().format("YYYY-MM-DD") ;

            // 拠点の支払日(下2桁が日付)を取得
            const day = this.getBranchPaymentDate(branchId) % 100 ;

            // 支払日が末締か平日を判定
            if (day == 99 || day == 31) {
                // 末締の場合：処理日を取得して当月15日を超えているか判定
                const today = DayJs().date() ;
                if (today >= 15) {
                    // 当月末として処理
                    payDay = DayJs().endOf('month').format("YYYY-MM-DD") ;
                } else {
                    // 先月末として処理
                    payDay = DayJs().subtract(1, 'M').endOf('month').format("YYYY-MM-DD") ;
                }
            } else if (day > 0 && day < 31) {
                // 平日の場合：当月末を取得して支払日が当月末を超えているか判定
                const endOfMonth = DayJs().endOf('month').date() ;
                if (day >= endOfMonth) {
                    // 支払日が当月末を超えている場合
                    payDay = DayJs().endOf('month').format("YYYY-MM-DD") ;
                } else {
                    // 支払日が当月末を超えてない場合
                    payDay = DayJs().startOf('month').add(day - 1, 'd').format("YYYY-MM-DD") ;
                }
            }

            // 直近の支払日に設定
            return payDay ;
        } ,
        getBranchPaymentDate : function (branchId)
        {
            // 選択されている拠点の支払日
            return this.masterStore.MBranches.find(x => x.id == branchId)?.payment_date ; 
        } ,
        historyBack : function () {
            this.$router.push({ name : "complete_menu" }) ;
        } ,
    } ,
    created : function () {
        if (this.mainStore.isAppReady) {
            // ログインユーザーと拠点
            this.dRow.m_user_id = this.mainStore.loginMUser.id ;
            this.cMBranchId     = this.mainStore.loginMUser.m_branch_id ;
        }
    } ,
}
</script>

<style scoped>
    /* 明細：幅固定 */ 
    table[class~="summary"] th:nth-of-type(3) {
        width: 50px;
    }

    /* ヘッダー：右揃え */ 
    table[class~="summary"] th:nth-child(n+4):nth-child(-n+8), 
    table[class~="summary"] td:nth-child(n+4):nth-child(-n+8) {
        text-align: right;
    }
    
    /* 明細：右揃え */ 
    table[class~="list"] th:nth-of-type(4), 
    table[class~="list"] td:nth-of-type(4) {
        text-align: right;
    }

    /* クランプ表示用 */
    .clamp {
        max-width: 200px; /* クランプ使用時に(min,max)widthプロパティを設定 */
    }

    /* クランプ解除用 */
    .clamp:hover {
        white-space: normal;
    }
</style>
