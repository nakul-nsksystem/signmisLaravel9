<template>
    <validation-observer v-slot="{ invalid }">
        <div class="row">
            <div class="col">
                <div v-if="$$cIsError" class="alert alert-danger" role="alert">
                    {{ dErrorData.message }}
                </div>

                <div v-if="dSuccess" class="alert alert-success" role="alert">
                    保存に成功しました
                </div>
            </div>
        </div>

        <div class="row" v-if="cIsShow">
            <div class="col-12">
                <nav>
                    <ul class="nav nav-tabs navbar-dark border-bottom-0">
                        <li class="nav-item">
                            <a class="nav-link active" id="basic-information-tab" data-toggle="tab" href="#basic-information" role="tab" aria-controls="basic-information" aria-selected="true">
                                <i class="fas fa-building" />基本情報
                            </a>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link" id="delivery-information-tab" data-toggle="tab" href="#delivery-information" role="tab" aria-controls="delivery-information" aria-selected="false">
                                <i class="fas fa-edit" />納品情報
                            </a>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link" id="sales-management-tab" data-toggle="tab" href="#sales-management" role="tab" aria-controls="sales-management" aria-selected="false">
                                <i class="fas fa-file-invoice" />販売管理
                            </a>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link" id="analysis-management-tab" data-toggle="tab" href="#analysis-management" role="tab" aria-controls="analysis-management" aria-selected="false">
                                <i class="fas fa-wrench" />分析管理
                            </a>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link" id="person-management-tab" data-toggle="tab" href="#person-management" role="tab" aria-controls="person-management" aria-selected="false">
                                <i class="fas fa-user" />担当者管理
                            </a>
                        </li>
                    </ul>
                </nav>

                <div class="tab-content bg-app-secondaly" id="nav-tabContent">
                    <div class="tab-pane pl-0 mr-0 py-0 fade show active" id="basic-information" role="tabpanel" aria-labelledby="basic-information-tab">
                        <div class="col-12 pt-4">
                            <div class="form-row">
                                <div class="form-group col-12 col-xl-2">
                                    <validation-provider name="コード" rules="" immediate v-slot="{ errors }">
                                        <label for="cd">コード</label>
                                        <input class="form-control" id="cd" v-model="dRow.cd" placeholder="省略時はコード附番">
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </validation-provider>
                                </div>
                                <div class="form-group col-12 col-xl-2">
                                    <label for="data_linkage_cd">連携コード</label>
                                    <input class="form-control" id="data_linkage_cd" v-model="dRow.data_linkage_cd">
                                </div>
                                <div class="form-group">
                                    <label>勘定科目</label>
                                    <m-kv-select
                                        v-model="dRow.accounts_title_m_kv_id"
                                        :kv-key="'sales_management-accounts_title'"
                                    />
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group col-12 col-xl-5">
                                    <validation-provider name="名称" rules="required" immediate v-slot="{ errors }">
                                        <label for="name">名称</label>
                                        <div class="input-group">
                                            <input class="form-control" id="name" v-model="dRow.name">
                                            <button type="btn" class="btn btn-success" data-toggle="tooltip" title="カナを設定" :disabled="invalid || dLoading" @click.prevent="getFurigana()">
                                                <div v-if="dLoading">
                                                    <span class="spinner-border spinner-border-sm" role="status" />
                                                </div>
                                                <div v-else>
                                                    <i class="fas fa-font fa-fw" />
                                                </div>
                                            </button>
                                        </div>
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </validation-provider>
                                </div>

                                <div class="form-group col-12 col-xl-1">
                                    <label>敬称</label>
                                    <m-kv-select
                                        v-model="dRow.title_of_honor_m_kv_id"
                                        :kv-key="'m_customers-title_of_honor'"
                                    />
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group col-12 col-xl-6">
                                    <label for="short_name">略称</label>
                                    <input class="form-control" id="short_name" v-model="dRow.short_name">
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group col-12 col-xl-6">
                                    <label for="kana">カナ</label>
                                    <input class="form-control" id="kana" v-model="dRow.kana">
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group col-12 col-xl-2">
                                    <label for="contact_person">請求書送付担当者</label>
                                    <div class="input-group">
                                        <input class="form-control" id="contact_person" v-model="dRow.contact_person">
                                        <span class="input-group-text">様</span>
                                    </div>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group col-12 col-xl-2">
                                    <validation-provider name="拠点" rules="required|excluded:0" immediate v-slot="{ errors }">
                                        <label>拠点</label>
                                        <m-branch-select
                                            v-model="dRow.m_branch_id"
                                        />
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </validation-provider>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group col-12 col-xl-2">
                                    <label>自社担当者</label>
                                    <m-user-select
                                        :m-branch-id="dRow.m_branch_id"
                                        v-model="dRow.sales_m_user_id"
                                    />
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group col-12 col-xl-2">
                                    <label>請求書・検収書郵送区分</label>
                                    <m-kv-select
                                        v-model="dRow.mailing_type_m_kv_id"
                                        :kv-key="'sales_management-mailng_type'"
                                    />
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group col-15 col-xl-6">
                                    <label for="memo">備考</label>
                                    <input class="form-control" id="memo" v-model="dRow.memo">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="tab-pane fade" id="delivery-information" role="tabpanel" aria-labelledby="delivery-information-tab">
                        <div class="col-12 pt-4">
                            <div class="form-row">
                                <div class="form-group col-12 col-xl-2">
                                    <validation-observer v-slot="{ invalid }">
                                        <validation-provider name="郵便番号" rules="min:7|max:8">
                                            <label for="zip">〒郵便番号</label>
                                            <div class="input-group">
                                                <input class="form-control" id="zip" maxlength="8" pattern="\d{3}-?\d{4}" v-model="dRow.zip">
                                                <button type="btn" class="btn btn-success" data-toggle="tooltip" title="住所を設定" :disabled="invalid || dLoading" @click.prevent="getZipInfo()">
                                                    <div v-if="dLoading">
                                                        <span class="spinner-border spinner-border-sm" role="status" />
                                                    </div>
                                                    <div v-else>
                                                        <i class="fas fa-search fa-fw" />
                                                    </div>
                                                </button>
                                            </div>
                                        </validation-provider>
                                    </validation-observer>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group col-12 col-xl-6">
                                    <label for="address1">住所1</label>
                                    <input class="form-control" id="address1" v-model="dRow.address1">
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group col-12 col-xl-6">
                                    <label for="address2">住所2【ビル・マンション名】</label>
                                    <input class="form-control" id="address2" v-model="dRow.address2">
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group col-12 col-xl-2">
                                    <validation-provider name="電話番号" rules="phone" v-slot="{ errors }">
                                        <label for="tel">電話番号</label>
                                        <input class="form-control" id="tel" maxlength="20" v-model="dRow.tel">
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </validation-provider>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group col-12 col-xl-2">
                                    <validation-provider name="FAX番号" rules="phone" v-slot="{ errors }">
                                        <label for="fax">FAX番号</label>
                                        <input class="form-control" id="fax" maxlength="20" v-model="dRow.fax">
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </validation-provider>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group col-12 col-xl-4">
                                    <validation-provider name="メールアドレス" rules="email" vid="confirmation" v-slot="{ errors }">
                                        <label for="email">メールアドレス</label>
                                        <input class="form-control" id="email" v-model="dRow.email">
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </validation-provider>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group col-12 col-xl-4">
                                    <validation-provider name="発注用メールアドレス" rules="email" vid="confirmation" v-slot="{ errors }">
                                        <label for="email">発注用メールアドレス</label>
                                        <input class="form-control" id="po_email" v-model="dRow.po_email">
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </validation-provider>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="tab-pane fade" id="sales-management" role="tabpanel" aria-labelledby="sales-management-tab">
                        <div class="col-12 pt-4">
                            <div class="form-row">
                                <div class="form-group col-12 col-xl-2">
                                    <label>取引区分</label>
                                    <m-kv-select
                                        v-model="dRow.dealing_m_kv_id"
                                        :kv-key="'sales_management-dealing'"
                                    />
                                </div>

                                <div class="form-group col-12 col-xl-2">
                                    <div v-if="cIsBuy">
                                        <label>仕入カテゴリー</label>
                                        <m-tag-select
                                            :tag-category-key="dTagCatKey"
                                            :setTagIds="dRow.m_tags"
                                            v-model="dTagIds"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div v-if="cIsSaleBuy">
                                <div class="form-row">
                                    <div class="form-group col-12 col-xl-2">
                                        <label>締処理単位</label>
                                        <m-kv-select
                                            v-model="dRow.account_m_kv_id"
                                            :kv-key="'sales_management-account'"
                                        />
                                        <span class="validation-info">{{ cAccountInfoMessage }}</span>
                                    </div>

                                    <div class="form-group col-12 col-xl-2">
                                        <validation-provider name="締日" rules="required|max:2" immediate vid="my_custom_rule1" v-slot="{ errors }">
                                            <label for="closing_date">締日</label>
                                            <ns-number-input
                                                id="closing_date"
                                                v-model="dRow.closing_date"
                                                min="0"
                                            />
                                            <span class="validation-error">{{ errors[0] }}</span>
                                        </validation-provider>
                                    </div>

                                    <div class="form-group col-12 col-xl-2">
                                        <validation-provider name="入金・支払日" rules="required|max:3|custom_rule_number_from:my_custom_rule1" immediate v-slot="{ errors }">
                                            <label for="payment_date">{{ cPaymentName }}</label>
                                            <ns-number-input
                                                id="payment_date"
                                                v-model="dRow.payment_date"
                                                min="0"
                                            />
                                            <span class="validation-error">{{ errors[0] }}</span>
                                        </validation-provider>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group col-12 col-xl-2">
                                        <label>金額端数の処理</label>
                                        <m-kv-select
                                            v-model="dRow.price_fraction_m_kv_id"
                                            :kv-key="'sales_management-fraction'"
                                        />
                                    </div>

                                    <div class="form-group col-12 col-xl-2">
                                        <label>消費税端数の処理</label>
                                        <m-kv-select
                                            v-model="dRow.tax_fraction_m_kv_id"
                                            :kv-key="'sales_management-fraction'"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div v-if="cIsDelivery">
                                <div class="form-row">
                                    <div class="form-group col-12 col-xl-2">
                                        <label>納品形式</label>
                                        <m-kv-select
                                            v-model="dRow.delivery_format_m_kv_id"
                                            :kv-key="'sales_management-delivery_format'"
                                        />
                                    </div>

                                    <div class="form-group col-12 col-xl-2">
                                        <label>納品書</label>
                                        <m-kv-select
                                            v-model="dRow.delivery_note_m_kv_id"
                                            :kv-key="'sales_management-delivery_note'"
                                        />
                                    </div>

                                    <div class="form-group col-12 col-xl-2">
                                        <label>指定納品書</label>
                                        <m-kv-select
                                            v-model="dRow.designated_delivery_note_m_kv_id"
                                            :kv-key="'sales_management-designated_delivery_note'"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div v-if="cIsSale">
                                <div class="form-row">
                                    <div class="form-group col-12 col-xl-2">
                                        <label>請求書</label>
                                        <m-kv-select
                                            v-model="dRow.invoice_m_kv_id"
                                            :kv-key="'sales_management-invoice'"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div v-if="cIsBuy">
                                <div class="form-row">
                                    <div class="form-group col-12 col-xl-2">
                                        <label>発注書</label>
                                        <m-kv-select
                                            v-model="dRow.purchase_order_m_kv_id"
                                            :kv-key="'sales_management-purchase_order'"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div v-if="cIsBuy">
                                <div class="form-row">
                                    <div class="form-group col-12 col-xl-2">
                                        <label>検収書</label>
                                        <m-kv-select
                                            v-model="dRow.payment_notice_m_kv_id"
                                            :kv-key="'sales_management-payment_notice'"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group col-15 col-xl-6">
                                    <label for="sales_management_memo">販売管理備考</label>
                                    <input class="form-control" id="sales_management_memo" v-model="dRow.sales_management_memo">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="tab-pane fade" id="analysis-management" role="tabpanel" aria-labelledby="analysis-management-tab">
                        <div class="col-12 pt-4">
                            <div class="form-row">
                                <div class="form-group col-12 col-xl-2">
                                    <label>業種</label>
                                    <m-kv-select
                                        v-model="dRow.industry_m_kv_id"
                                        :kv-key="'m_customers-industry'"
                                    />
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group col-12 col-xl-5">
                                    <label>請求先</label>
                                    <m-customer-ref-input
                                        v-model="dRow.destination_m_customer_id"
                                        :mBranchId="dRow.m_branch_id"
                                        :dealing-cds="[cDealing]"
                                    />
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group col-12 col-xl-5">
                                    <label>相殺先</label>
                                    <m-customer-ref-input
                                        v-model="dRow.set_off_m_customer_id"
                                        :mBranchId="dRow.m_branch_id"
                                        :dealing-cds="[cDealing]"
                                    />
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group col-12 col-xl-5">
                                    <label>取引先グループ</label>
                                    <m-customer-ref-input
                                        v-model="dRow.category_group_m_customer_id"
                                        :mBranchId="dRow.m_branch_id"
                                        :dealing-cds="[cDealing]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="tab-pane fade" id="person-management" role="tabpanel" aria-labelledby="person-management-tab">
                        <div class="row pt-4 pr-2 pl-2">
                            <div class="col-12">
                                <div class="table-responsive">
                                    <table class="table table-striped table-dark">
                                        <thead>
                                            <tr>
                                                <th scope="col">担当者名</th>
                                                <th scope="col">email</th>
                                                <th scope="col">役職</th>
                                                <th scope="col">備考</th>
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="person in dRow.m_customer_persons" :key="person.id">
                                                <template v-if="person.deleted_at == null">
                                                    <td>
                                                        <validation-provider name="担当者名" rules="required" immediate v-slot="{ errors }">
                                                            <div class="form-group">
                                                                <input class="form-control" type="text" v-model="person.name">
                                                            </div>
                                                            <span class="validation-error">{{ errors[0] }}</span>
                                                        </validation-provider>
                                                    </td>
                                                    <td>
                                                        <validation-provider name="email" rules="required|email" immediate v-slot="{ errors }">
                                                            <div class="form-group">
                                                                <input class="form-control" type="text" v-model="person.email">
                                                            </div>
                                                            <span class="validation-error">{{ errors[0] }}</span>
                                                        </validation-provider>
                                                    </td>
                                                    <td>
                                                        <div class="form-group">
                                                            <input class="form-control" type="text" v-model="person.position">
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-group">
                                                            <input class="form-control" type="text" v-model="person.memo">
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="text-right">
                                                            <button type="button" class="btn btn-danger" @click.prevent="deletePerson(person)">
                                                                <i class="fas fa-trash fa-fw"></i>
                                                            </button>
                                                        </div>

                                                    </td>
                                                </template>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td>
                                                    <div class="text-right">
                                                        <button type="button" class="btn btn-primary" @click.prevent="addPerson">
                                                            <i class="fas fa-plus fa-fw"></i>
                                                        </button>
                                                    </div>

                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col pt-2">
                        <button type="button" class="btn btn-success" @click.prevent="postData()" :disabled="invalid || dLoading || dSaveLoading">
                            <div v-if="dSaveLoading">
                                <span class="spinner-border spinner-border-sm" role="status" />
                                保存中...
                            </div>
                            <div v-else>
                                保存
                            </div>
                        </button>
                        <button type="submit" class="btn btn-light" @click.prevent="historyBack()">戻る</button>
                    </div>
                </div>
            </div>
        </div>
    </validation-observer>
</template>

<script>
import PageMixins from '@mixins/commons/PageMixins' ;
import NumberUtil from '@frameworks/NumberUtil' ;

export default {
    mixins : [PageMixins] ,
    data : function () {
        return {
            dApiName : "mCustomer" ,
            dRow : {                                            // 初期値を設定
                m_branch_id : undefined ,                       // 拠点(ログインユーザーの拠点)
                sales_m_user_id : 0 ,                           // 自社担当者
                destination_m_customer_id : null ,              // 請求宛先
                set_off_m_customer_id : null ,                  // 相殺先
                category_group_m_customer_id : null ,           // 取引先グループ
                title_of_honor_m_kv_id : 1000001 ,              // 敬称区分
                dealing_m_kv_id : 1010001 ,                     // 取引区分
                industry_m_kv_id : 1020000 ,                    // 業種区分
                account_m_kv_id : 1060003 ,                     // 締区分 (ToDo拠点・売買で初期値分けたい)
                price_fraction_m_kv_id : 1070001 ,              // 金額端数区分
                tax_fraction_m_kv_id : 1070001 ,                // 消費税端数区分
                delivery_format_m_kv_id : 1235001 ,             // 納品形式区分
                delivery_note_m_kv_id : 1080001 ,               // 納品書区分
                temporary_slip_note_m_kv_id : 1080000 ,         // 仮伝納品書区分
                designated_delivery_note_m_kv_id : 1090000 ,    // 指定納品書区分
                shipping_label_m_kv_id : 1100000 ,              // 送り状区分
                invoice_m_kv_id : 1110001 ,                     // 請求書区分
                purchase_order_m_kv_id : 1120001 ,              // 発注書区分
                payment_notice_m_kv_id : 1130002 ,              // 検収書区分
                closing_date : 0 ,                              // 締日
                payment_date : 0 ,                              // 入金・支払日
                credit_limit : 0 ,                              // 限度額
                zip : "" ,                                      // 郵便番号(郵便番号検索で使用するのでstaticにしとく)
                address1 : "" ,                                 // 住所1(郵便番号検索で使用するのでstaticにしとく)
                m_tags : [] ,                                   // 仕入カテゴリー(タグ)
                m_customer_persons : [] ,                       // 担当者管理
            } ,
            dLoading : false ,                                  // 検索ボタン読込中フラグ
            dSaveLoading : false ,                              // 保存ボタン読込中フラグ
            dTagCatKey : "m_customers-purchas_category" ,       // タグkey
            dTagIds : [] ,                                      // タグid
            dSuccess : false ,                                  // 保存成功
        }
    } ,
    computed : {
        cEndpoint : function () {
            let ep = `api/${this.dApiName}` ;

            if (!this.cIsNew) ep += `/${this.$route.params.id}`

            else if(NumberUtil.invalid2zr(this.dRow.id) !== 0 ) {
                ep += `/${this.dRow.id}`
            };

            return ep ;
        } ,
        cIsNew : function () {
            return this.$route.params.id === undefined ;
        } ,
        cIsShow : function () {
            return this.cIsNew || this.dRow.id > 0 ;
        } ,
        cIsSale : function () {
            // 売の場合にtrue
            return this.dRow.dealing_m_kv_id == 1010001 ;
        } ,
        cIsBuy : function () {
            // 買・外注の場合にtrue
            return this.dRow.dealing_m_kv_id == 1010002 || this.dRow.dealing_m_kv_id == 1010004 ;
        } ,
        cIsSaleBuy : function () {
            // 売買の場合にtrue
            return this.cIsSale || this.cIsBuy ;
        } ,
        cIsDelivery : function () {
            // 売・納品先の場合にtrue
            return this.dRow.dealing_m_kv_id == 1010001 || this.dRow.dealing_m_kv_id == 1010008 ;
        } ,
        cPaymentName : function () {
            // 入金・支払日のラベル名
            return this.cIsSale ? "入金日" : (this.cIsBuy ? "支払日" : "　") ;
        } ,
        cDealing : function () {
            // 取引区分idの頭1桁で取引区分を判断
            return ((this.dRow.dealing_m_kv_id ?? 0) % 1000) ;
        } ,
        cAccountInfoMessage : function () {
            // 売で請求時以外はアラートメッセージを表示
            return (this.dRow.dealing_m_kv_id == 1010001 && this.dRow.account_m_kv_id != 1060003) ? "請求時以外が設定されています" : ""
        } ,
    } ,
    methods : {
        getData : async function () {
            try {
                const res = await axios.get(this.cEndpoint) ;
                this.dRow = res.data ;
            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.cEndpoint) ;
            }
        } ,
        postData : async function () {
            this.dSuccess = false ;
            this.dSaveLoading = true ;

            try {
                this.dRow.updated_m_user_id = this.$$cLoginUserId ;
                this.dRow.tag_links = {} ;
                this.dRow.tag_links[this.dTagCatKey] = this.dTagIds ;
                this.dRow.m_delivery_destinations = {} ;

                for(const person of this.dRow.m_customer_persons) {
                    person.updated_m_user_id = this.$$cLoginUserId ;
                }


                if (this.cIsNew && NumberUtil.invalid2zr(this.dRow.id) == 0) {
                    this.dRow.created_m_user_id = this.$$cLoginUserId ;
                    const res = await axios.post(this.cEndpoint, this.dRow) ;
                    this.dRow = res.data ;

                } else {
                    const res = await axios.put(this.cEndpoint, this.dRow) ;

                    this.dRow = res.data ;

                }


                this.dSuccess = true ;

                // 検索画面へ戻る
                // this.historyBack();
            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.cEndpoint) ;
            } finally {
                this.dSaveLoading = false ;
            }
        } ,
        historyBack : function () {
            // 検索画面へ戻る
            this.$router.push({ name : Inflector.underscore(this.dApiName) }) ;
        } ,
        getZipInfo : async function () {
            if (this.dRow.zip < 7) {
                return ;
            }

            const zip = this.dRow.zip ;
            const ep = `api/${this.dApiName}/getZipInfo/${zip}`;

            try {
                this.dLoading = true ;

                // 郵便番号検索のAPIを呼び出す
                const res = await axios.get(ep) ;
                if (res.data.status === 200 && res.data.results) {
                    // 住所を設定
                    this.dRow.address1 = res.data.results[0].address1 + res.data.results[0].address2 + res.data.results[0].address3 ;
                }

                this.dLoading = false ;
            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.cEndpoint) ;
            }
        } ,
        getFurigana : async function () {
            if (!this.dRow.name) return ;

            // 名称から[株式会社][有限会社]をトリム
            const name = this.dRow.name.replace("株式会社", "").replace("有限会社", "") ;
            const ep = `api/${this.dApiName}/getFurigana/${name}`;

            try {
                this.dLoading = true ;

                // フリガナAPIを呼び出す
                const res = await axios.get(ep) ;
                // カナを設定
                this.dRow.kana = this.toHalfKana(res.data.converted) ;

                this.dLoading = false ;
            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.cEndpoint) ;
            }
        } ,
        toHalfKana : function (str) {
            // 全角カナ → 半角カナ
            var kanas = {
                    "ガ": "ｶﾞ", "ギ": "ｷﾞ", "グ": "ｸﾞ", "ゲ": "ｹﾞ", "ゴ": "ｺﾞ",
                    "ザ": "ｻﾞ", "ジ": "ｼﾞ", "ズ": "ｽﾞ", "ゼ": "ｾﾞ", "ゾ": "ｿﾞ",
                    "ダ": "ﾀﾞ", "ヂ": "ﾁﾞ", "ヅ": "ﾂﾞ", "デ": "ﾃﾞ", "ド": "ﾄﾞ",
                    "バ": "ﾊﾞ", "ビ": "ﾋﾞ", "ブ": "ﾌﾞ", "ベ": "ﾍﾞ", "ボ": "ﾎﾞ",
                    "パ": "ﾊﾟ", "ピ": "ﾋﾟ", "プ": "ﾌﾟ", "ペ": "ﾍﾟ", "ポ": "ﾎﾟ",
                    "ヴ": "ｳﾞ", "ヷ": "ﾜﾞ", "ヺ": "ｦﾞ",
                    "ア": "ｱ", "イ": "ｲ", "ウ": "ｳ", "エ": "ｴ", "オ": "ｵ",
                    "カ": "ｶ", "キ": "ｷ", "ク": "ｸ", "ケ": "ｹ", "コ": "ｺ",
                    "サ": "ｻ", "シ": "ｼ", "ス": "ｽ", "セ": "ｾ", "ソ": "ｿ",
                    "タ": "ﾀ", "チ": "ﾁ", "ツ": "ﾂ", "テ": "ﾃ", "ト": "ﾄ",
                    "ナ": "ﾅ", "ニ": "ﾆ", "ヌ": "ﾇ", "ネ": "ﾈ", "ノ": "ﾉ",
                    "ハ": "ﾊ", "ヒ": "ﾋ", "フ": "ﾌ", "ヘ": "ﾍ", "ホ": "ﾎ",
                    "マ": "ﾏ", "ミ": "ﾐ", "ム": "ﾑ", "メ": "ﾒ", "モ": "ﾓ",
                    "ヤ": "ﾔ", "ユ": "ﾕ", "ヨ": "ﾖ",
                    "ラ": "ﾗ", "リ": "ﾘ", "ル": "ﾙ", "レ": "ﾚ", "ロ": "ﾛ",
                    "ワ": "ﾜ", "ヲ": "ｦ", "ン": "ﾝ",
                    "ァ": "ｧ", "ィ": "ｨ", "ゥ": "ｩ", "ェ": "ｪ", "ォ": "ｫ",
                    "ッ": "ｯ", "ャ": "ｬ", "ュ": "ｭ", "ョ": "ｮ",
                    "。": "｡", "、": "､", "ー": "ｰ", "「": "｢", "」": "｣", "・": "･"
                }

            var reg = new RegExp('(' + Object.keys(kanas).join('|') + ')', 'g');
            return str.replace(reg, function (match) {
                        return kanas[match] ;
                    }).replace(/゛/g, 'ﾞ').replace(/゜/g, 'ﾟ') ;
        } ,
        //担当者追加
        addPerson : function() {
            const newPerson = {
                position : null ,
                name : null ,
                email : null ,
                memo : null ,
                created_m_user_id : this.$$cLoginUserId
            } ;
            this.dRow.m_customer_persons.push(newPerson) ;
        } ,
        //担当者削除
        deletePerson : function(row) {

            const foundIdx = this.dRow.m_customer_persons.indexOf(row) ;

            if(row.id) {
                this.$set(this.dRow.m_customer_persons[foundIdx] ,"deleted_at" ,Date())
            } else {
                if(foundIdx != -1) this.dRow.m_customer_persons.splice(foundIdx,1) ;

            }
        }
    },
    created : function () {
        if (this.cIsNew) {
            // ログインユーザーの拠点
            this.dRow.m_branch_id = this.mainStore.loginMUser.m_branch_id ;
        } else {
            this.getData() ;
        }
    } ,
}
</script>
