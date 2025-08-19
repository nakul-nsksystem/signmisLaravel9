<template>
    <div>
        <validation-observer v-slot="{ invalid }">

            <div class="row mb-2">
                <contents-header-left></contents-header-left>
                <contents-header-right>
                     <div>

                        <div class="form-inline">

                            <label >表示</label>
                            <div
                                class="btn-group btn-group-toggle mx-2" >
                                <label class="btn btn-dark"
                                    :class="{active : dViewMode === 'delivery' }"
                                    data-toggle="tooltip" data-placement="top" title="納品リスト" >
                                    <input type="radio" v-model="dViewMode" name="view-modes" value="delivery"
                                        >
                                    <i class="fas fa-truck fa-fw "></i>
                                </label>
                                <label class="btn btn-dark"
                                    :class="{active : dViewMode === 'construction' }"
                                    data-toggle="tooltip" data-placement="top" title="施工カレンダー" >
                                    <input type="radio" v-model="dViewMode" name="view-mode" value="construction">
                                    <i class="fas fa-tools fa-fw "></i>
                                </label>
                            </div>

                            <!-- <div class="text-right pr-0">
                                <button type="button" class="btn btn-success" @click.prevent="postData" :disabled="cIsLoading || invalid || dViewMode === 'construction'">
                                    <div v-if="dLoading4Save">
                                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        保存中...
                                    </div>
                                    <div v-else>
                                        保存
                                    </div>
                                </button>
                            </div>  -->

                        </div>


                    </div>

                </contents-header-right>
            </div>
            <div v-show="$$cIsError" class="alert alert-danger" role="alert">
                {{dErrorData.message}}
            </div>


            <div v-show="dViewMode === 'delivery'">
                <div v-if="cIsSuccess" class="alert alert-success" role="alert">
                    <span v-show="dIsSaveSuccess">保存に成功しました</span>
                    <span v-show="dIsMailSuccess">メールを送信しました</span>
                </div>
                <div class="row">
                    <div class="col-12 col-xl-1">
                        <div class="form-group">
                            <label for="inputMBranchId">{{ cLoaded }}拠点</label>
                            <m-branch-select
                                v-model="dRow.m_branch_id"
                                />
                        </div>
                    </div>
                    <div class="col-12 col-xl-3 pl-xl-0">
                        <div class="form-group">
                            <label for="inputMBranchId">納品先</label>
                            <m-customer-ref-input
                                v-model="dRow.delivery_m_customer_id"
                                :mBranchId="dRow.m_branch_id"
                                :dealing-cds="[1,8]"
                                />
                        </div>
                    </div>
                    <div class="col-12 col-xl-3 pl-xl-0">
                        <div class="form-group">
                            <label for="inputMBranchId">荷主</label>
                            <m-customer-ref-input
                                v-model="dRow.delivery_owner_m_customer_id"
                                :mBranchId="dRow.m_branch_id"
                                :dealing-cds="[1,8]"
                                />
                        </div>
                    </div>
                    <div class="col-12 col-xl-3 pl-xl-0">
                        <div class="row ml-0">
                            <div class="pl-0 pr-0">
                                <div class="form-group">
                                    <label>出荷日</label>
                                    <ex-v-date-picker v-model="dRow.delivery_at_from" />
                                </div>
                            </div>
                            <div class="col-1 pl-0 pr-0">
                                <div class="form-group">
                                    <p>&emsp;</p>
                                    <p class="text-center">～</p>
                                </div>
                            </div>
                            <div class="col pl-0">
                                <div class="form-group">
                                    <label>&emsp;</label>
                                    <ex-v-date-picker v-model="dRow.delivery_at_to" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-xl-2">
                        <div class="form-group">
                            <label for="inputCategoryMKvId">納品形態</label>
                            <m-kv-select
                                id="inputCategoryMKvId"
                                :kv-key="'t_projects-delivery'"
                                v-model="dRow.delivery_m_kv_id"
                                :g_01="'delivery'"
                                />
                        </div>
                    </div>
                    <div class="col-12 col-xl-1 pl-xl-0">
                        <div class="form-group">
                            <label>物件コード</label>
                            <input type="text" class="form-control" v-model="dRow.t_project.cd" />
                        </div>
                    </div>
                    <div class="col-12 col-xl-2 pl-xl-0">
                        <div class="form-group">
                            <label>物件名</label>
                            <input type="text" class="form-control" v-model="dRow.t_project.name" />
                        </div>
                    </div>
                    <div class="col-12 col-xl-2 pl-xl-0">
                        <div class="form-group">
                            <label>商品名</label>
                            <input type="text" class="form-control" v-model="dRow.t_project_products.name" />
                        </div>
                    </div>
                    <div class="col-12 col-xl-2 pl-xl-0">
                        <div class="form-group">
                            <label >納品指定事項</label>
                            <m-tag-select
                                :tag-category-key="dTagCategoryKey"
                                v-model="dRow.m_tags"

                                />
                        </div>
                    </div>
                    <div class="col-12 col-xl-1 pl-xl-0">
                        <div class="form-group">
                            <label >ステータス</label>
                            <select class="form-control" v-model="dRow.delivery_completed_at">
                                <option value=""></option>
                                <option value=0>未完了</option>
                                <option value=1>完了</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-12 text-right pr-0 pb-2">

                    <button type="button" class="btn btn-success" @click.prevent="search()" :disabled="cIsLoading">
                        <div v-if="dLoading4Search">
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            検索中...
                        </div>
                        <div v-else>
                            <i class="fas fa-search fa-fw"></i>
                            検索
                        </div>
                    </button>
                </div>

                <div class="row">
                    <div class="col-12">
                        <div class="table-responsive">
                            <table class="table table-striped table-dark">
                                <thead>
                                    <tr>
                                        <th style="min-width:70px">拠点</th>
                                        <th style="min-width:150px">納品形態<br>納品物名<br>個口数</th>
                                        <th style="min-width:150px">商品</th>
                                        <th style="min-width:150px">出荷日<br>着日</th>
                                        <!-- <th style="min-width:150px">納品物名</th>
                                        <th style="min-width:75px">個口数</th> -->
                                        <th style="min-width:200px">納品先情報</th>
                                        <th style="min-width:200px">荷主情報</th>
                                        <th style="min-width:150px">物件コード<br>物件名<br>物件クライアント</th>
                                        <th style="min-width:200px">備考</th>
                                        <th style="min-width:75px">
                                            <div class="form-group mb-0">
                                                <ns-checkbox-input
                                                    v-model="dIsDeliveryCompleted"
                                                    :id="`isAllCompleted`"
                                                    :label="'完了'"
                                                    @change="changeAllRow"
                                                    />
                                            </div>
                                        </th>
                                        <th style="min-width:175px">送り状No</th>
                                        <th style="min-width:175px">発送完了メール</th>
                                        <th style="min-width:50px">Action</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    <validation-observer v-slot="{ invalid }" tag="tr"
                                        v-for="n in dSearchedList"
                                        :key="n.id"
                                        :class="{'bg-alpha-purple' : cIsCompleted(n) ,'bg-alpha-red':cIsInconsistency(n)}"
                                        >
                                        <td>{{cMBranchName(n.m_branch_id)}}</td>
                                        <td>
                                            <div :class="cTextColor(n.delivery_m_kv)">{{n.delivery_m_kv.kv_name}}</div>
                                            <m-tag-viewer
                                                class="mt-1"
                                                :tag-category-key="dTagCategoryKey"
                                                :selected="n.m_tags"
                                                />
                                            <div>{{n.delivery_product_name}}</div>
                                            <div class="text-right" v-show="n.num_of_boxes>0">{{n.num_of_boxes}}個口</div>
                                        </td>
                                        <td>
                                            <div v-for="product in n.t_project_products">
                                                {{product.name}}<span v-show="product.is_partical_delivery">({{product.t_project_delivery_product_link.qty}})</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div>{{dateFormat(n.delivery_at)}}&nbsp;{{n.delivery_time}}</div>
                                            <div>{{dateFormat(n.arrival_at)}}&nbsp;{{n.arrival_time}}</div>
                                        </td>
                                        <!-- <td>{{n.delivery_product_name}}</td>
                                        <td>
                                            <div class="text-right">{{n.num_of_boxes}}</div>
                                        </td> -->
                                        <td>
                                            <div>{{n.delivery_customer_name}}</div>
                                            <div v-show="n.delivery_customer_zip">〒{{n.delivery_customer_zip}}</div>
                                            <div>{{n.delivery_customer_address}}</div>
                                            <div>{{n.delivery_customer_tel}}</div>
                                            <div>{{n.delivery_customer_user}}</div>
                                        </td>
                                        <td>
                                            <div>{{n.delivery_owner_name}}</div>
                                            <div v-show="n.delivery_owner_zip">〒{{n.delivery_owner_zip}}</div>
                                            <div>{{n.delivery_owner_address}}</div>
                                            <div>{{n.delivery_owner_tel}}</div>
                                            <div>{{n.delivery_owner_user}}</div>
                                        </td>

                                        <td>
                                            <a :href='"v#/t_project/edit/"+n.t_project.id'>{{n.t_project.cd}}<br>{{n.t_project.name}}</a>
                                            <br>{{n.t_project.m_customer.short_name_or_name}}
                                            <br>{{n.customer_user_name}}
                                        </td>
                                        <td>
                                            {{n.memo}}
                                        </td>
                                        <td>
                                            <div>
                                                <ns-checkbox-input
                                                    v-model="n.is_delivery_completed"
                                                    :id="`isCompleted${n.id}`"
                                                    @change="checked"
                                                    />
                                                <div class="pb-1">{{dateFormat(n.delivery_completed_at)}}</div>
                                                <!-- <div class="pb-1" :class="cIsInTime(n.delivery_at,n.delivery_completed_at)">{{dateFormat(n.delivery_completed_at)}}</div>                                             -->
                                            </div>
                                        </td>
                                        <td>
                                            <div class="form-group">
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    v-model="n.invoice_no"
                                                    >
                                            </div>
                                            <div>
                                                <a :href="cTrackingUrl(n)" target="_blank" rel="noopener noreferrer" v-show="cIsShowTrackingLink(n)">配送状況確認</a>
                                            </div>
                                        </td>
                                        <td>
                                            <div>{{n.t_project.delivery_mail_to}}</div>
                                            <div v-show="!cIsEmpty(n.mail_sent_at)" class="text-success">{{dateFormatWithoutSec(n.mail_sent_at)}}</div>
                                        </td>
                                        <td>
                                            <div v-show="!cIsNotNeedToSendEmail(n.delivery_m_kv)">
                                                <!-- <button type="button" class="btn btn-primary" @click.prevent="sendMail(n)" :disabled="cDisabledSendMail(n) || invalid">
                                                    <div v-if="cIsMailing(n)"><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></div>
                                                    <div v-else><i class="fas fa-envelope fa-fw"></i></div>
                                                </button> -->
                                                <button type="button" class="btn btn-primary" @click.prevent="openMailModal(n)" :disabled="cDisabledSendMail(n) || invalid">
                                                    <i class="fas fa-envelope fa-fw"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </validation-observer>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-xl-6">
                        <pagination
                            :p-pagination.sync="dPagination"
                            @search="search($event)"
                            />
                    </div>
                    <div class="col-12 col-xl-6 text-right">
                        <button type="button" class="btn btn-success" @click.prevent="postData" :disabled="cIsLoading || invalid">
                            <div v-if="dLoading4Save">
                                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                保存中...
                            </div>
                            <div v-else>
                                保存
                            </div>
                        </button>
                    </div>
                </div>
            </div>


            <div v-show="dViewMode === 'construction'">
                <div class="row">
                    <div class="col-12 col-xl-8">
                        <construction-calendar
                            class="m-3"
                            :set-m-branch-ids="[mainStore.loginMUser.m_branch_id]"
                            :value.sync="dSelectedDayOnCalendar"
                            :selected-m-branch-ids.sync="dSelectedBranchIds"
                            :set-t-project-constructions="dTProjectConstuctions"
                            :day-content-min-height="85"
                            @getDayConstruction="dDayConstuctions=$event"
                            />
                    </div>

                    <div class="col-12 col-xl-4 pl-xl-0">
                        <span class="ml-3">施工予定</span>
                        <div class="table-responsive">

                            <table class="table mt-2 table-striped table-dark">
                                <tbody>
                                    <tr v-for="n in dDayConstuctions" :key="n.id" >
                                        <td style="width:20%;min-width:100px;" scope="row">
                                            {{dateFormat(n.delivery_at )}}<br />
                                            &nbsp;{{formattedTimes(n.construction_start_time ,n.construction_end_time  )}}
                                        </td>
                                        <td>
                                            <span v-show="n.is_night_work" class="badge badge-info">夜間</span>
                                            <span v-show="n.is_holiday_work" class="badge badge-danger">休日</span>
                                        </td>
                                        <td style="width:50%;min-width:150px;">{{n.delivery_customer_name}}<br/>
                                            {{n.delivery_customer_address}}
                                        </td>
                                        <td style="width:30%;min-width:100px;">{{n.user_full_names}}</td>

                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>

        </validation-observer>
        <delivery-mail-modal
            v-model="dMailSendRow"
            ref="deliveryMailModal"
            @updateData="updateData($event)"
            />

    </div>

</template>

<script>
// import NumberUtil from './../../frameworks/NumberUtil';
import DayJsEx from "./../../frameworks/DayJsEx" ;
import PageMixins from '../../mixins/commons/PageMixins';
import _ from "lodash";


export default {
    mixins : [PageMixins] ,
    data : function(){
        return {
            dApiName : "tProjectDelivery" ,

            //表示モード　デフォルト納品リスト
            dViewMode : "delivery" ,


            //検索パラメータ
            dRow : {
                m_branch_id : undefined,
                delivery_m_customer_id : undefined,
                delivery_owner_m_customer_id : undefined,
                delivery_at_from : undefined,
                delivery_at_to : undefined,
                delivery_completed_at : undefined ,
                t_project:{
                    name : "" ,
                    cd : ""
                } ,
                t_project_products:{
                    name : "" ,
                } ,
                m_tags : [],

            },

            dPagination : {                         // pagination
                links : [] ,                        // リンク
                total : -1 ,                        // 合計件数
                from : -1 ,                         // 現在ページの開始位置
                to : -1 ,                           // 現在ページの終了位置
            } ,

            dSearchedList : [],

            dTagCategoryKey : "t_project_deliveries_designation" ,

            dIsSaveSuccess : false ,
            dIsMailSuccess : false ,

            dLoading4Search : false ,
            dLoading4Save : false ,
            dLoading4Mail : false ,


            //全完了
            dIsDeliveryCompleted : false ,

            //検索時のデータ
            dLastSavedData : undefined ,


            //施工カレンダー
            dDayConstuctions : [] ,

            dSelectedDayOnCalendar : new Date() ,
            dSelectedBranchIds : undefined ,
            dTProjectConstuctions : [] ,


            dMailSendRow : {} ,


        }
    },
    mounted()  {
    } ,
    computed:{
        cEndpoint : function () {
            let ep =  `api/${this.dApiName}` ;
            return  ep ;
        } ,
        //検索項目の初期値を設定
        cLoaded : function () {
            if (this.mainStore.isAppReady) {
                // this.dRow.t_project.m_branch_id = this.mainStore.loginMUser.m_branch_id ;
                this.dRow.delivery_at_from = this.dateFormat(new Date())
                this.dRow.delivery_at_to = this.dateFormat(new Date())
                this.dRow.m_branch_id = this.mainStore.loginMUser.m_branch_id ;

            }

            return "" ;
        } ,

        cTextColor : function() {
            return function(mKv){
                return mKv.g_09 ?? ""
            }
        } ,



        cIsInTime : function () {

            return function(from,to) {
                if(!from || !to) return "" ;

                let result = "" ;

                switch (DayJsEx.compareDate(from ,to )) {

                    case "before" :
                        result =  "text-danger" ;
                        break ;

                    case "after" :
                    case "same" :
                        result =  "text-success" ;
                        break ;

                    case undefined :
                        result = "" ;

                }
                return result ;
            }
        } ,

        //発送完了メールが不要な納品形態
        //納品引き取り施工
        cIsNotNeedToSendEmail : function() {
            return function(mKv) {
                if(mKv == undefined) return false ;
                return mKv.g_03 == "0"
            }
        } ,

        cIsEmpty : function(){
            return function(val) {
                return _.isNil(val)
            }
        } ,
        //完了判定
        cIsCompleted : function(){
            return function(tDelivery){
                return ! _.isNil(tDelivery.delivery_completed_at) ;
            }
        } ,

        //メール送信したのに編集したくて完了戻しをした納品
        cIsInconsistency : function(){
            return function(tDelivery){
                return !_.isNil(tDelivery.mail_sent_at) && _.isNil(tDelivery.delivery_completed_at) ;
            }
        } ,

        //メール送信中
        cIsMailing : function(){
            return function(tDelivery) {
                return tDelivery.is_mailing == true ;
            }
        } ,

        //メールのdisabled
        cDisabledSendMail : function() {
            return function(tDelivery) {
                //メール送信中 or 保存検索中 or 未完了納品 or メール送信先が入っていない
                return this.cIsMailing(tDelivery) || this.dLoading4Save || this.dLoading4Search || !this.cIsCompleted(tDelivery) || this.cIsEmpty(tDelivery.t_project.delivery_mail_to) ;
            }
        } ,

        //検索中・保存中・メール送信中の時
        cIsLoading : function(){
            return this.dLoading4Save || this.dLoading4Search || this.dLoading4Mail ;
        } ,

        cIsSuccess : function(){
            return this.dIsSaveSuccess || this.dIsMailSuccess ;
        } ,

        cMBranch : function(){
            return function(branchId){
                if (this.mainStore.masters.MBranches.length == 0 ) return 0 ;
                return this.mainStore.masters.MBranches.find(n => n.id === branchId);
            }
        } ,
        cMBranchName : function(){
            return function(branchId){
                if (this.mainStore.masters.MBranches.length == 0 || _.isNil(branchId)) return "" ;
                return this.mainStore.masters.MBranches.find(n => n.id === branchId).shortNameOrName;
            }
        } ,

        //送り状追跡URL
        cTrackingUrl : function()  {
            return function(tDelivery) {
                if(tDelivery.delivery_m_kv.g_07 == "1") {
                    const invoiceNo = tDelivery.invoice_no ?? "" ;
                    return tDelivery.delivery_m_kv.g_10 + invoiceNo ;
                } else {
                    return tDelivery.delivery_m_kv.g_10 ;
                }
            }
        } ,

        cIsShowTrackingLink : function() {
            return function(tDelivery) {
                return tDelivery.delivery_m_kv.g_07 == "1" || !_.isNil(tDelivery.delivery_m_kv.g_10)
            }
        }

    },
    methods : {
        dateFormat : function(value) {
            if(_.isNil(value)) return "" ;
            return DayJsEx.format(value , "YYYY-MM-DD")
        },
        dateFormatAndTime : function(value) {
            if(_.isNil(value)) return "" ;
            return DayJsEx.format(value , "YYYY-MM-DD HH:mm:ss")
        },
        dateFormatWithoutSec : function(value) {
            if(_.isNil(value)) return "" ;
            return DayJsEx.format(value , "YYYY-MM-DD HH:mm")
        },
        formattedTimes : function (start , end )
        {
            //console.log("start:" + start + " end:" + end) ;
            return DayJsEx.timeToDayjs(start).format("HH:mm") + "～" + DayJsEx.timeToDayjs(end).format("HH:mm") ;

        } ,
        //全選択
        // changeAllRow : function(colName , dataName ,conditionCol) {

        //     if(this.dSearchedList.length === 0 ) return ;

        //     for(const delivery of this.dSearchedList) {

        //         if(!delivery[conditionCol]) {

        //             this.$set(delivery , colName ,this[dataName])

        //         }
        //     }

        // } ,
        changeAllRow : function() {

            if(this.dSearchedList.length === 0 ) return ;

            for(const delivery of this.dSearchedList) {

                //メール送信済の納品は完了が取り消せない
                if( this.cIsEmpty(delivery.mail_sent_at) ) {
                    delivery.is_delivery_completed = this.dIsDeliveryCompleted ;

                }
            }

        } ,
        checked : function() {
            const isAllC = this.dSearchedList.find(x => !x.is_delivery_completed) === undefined ;
            if(!this.dIsDeliveryCompleted && isAllC) {
                this.dIsDeliveryCompleted = true ;
            }
            else if(this.dIsDeliveryCompleted && !isAllC) {
                this.dIsDeliveryCompleted = false
            }
        }   ,

        search : async function (url){

            if(!this.confirmUpdate("再検索")) return ;

            this.clearMassege();

            try {

                this.dLoading4Search = true ;
                this.dIsDeliveryCompleted = false ;

                const getParams = _.cloneDeep(this.dRow) ;

                const ep = (url? url : this.cEndpoint + "/retrieve") ;
                const res = await axios.post(ep, getParams) ;

                const resList = res.data.data ;

                // pagination関連
                this.dPagination.links = res.data.links ;   // リンク
                this.dPagination.total = res.data.total ;   // 合計件数
                this.dPagination.from  = res.data.from ;    // 現在ページの開始位置
                this.dPagination.to    = res.data.to ;      // 現在ページの終了位置

                this.dLastSavedData = _.cloneDeep(resList) ;
                this.dSearchedList = resList ;

            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.cEndpoint) ;
            } finally {

                this.dLoading4Search = false ;
            }
        },
        openMailModal : function(row) {
            this.dMailSendRow = row ;
            this.$refs.deliveryMailModal.open() ;
        },

        updateData : function(row) {
            const found = this.dSearchedList.find(x => x.id == row.id) ;
            const foundIdx = this.dSearchedList.indexOf(found) ;
            if(foundIdx !== -1) this.dSearchedList.splice(foundIdx ,1 ,row) ;
            //lastSaved更新
            this.dLastSavedData = _.cloneDeep(this.dSearchedList) ;
        } ,

        sendMail : async function(tDelivery) {

            this.clearMassege();
            this.dLoading4Mail = true ;

            //loading
            this.$set(tDelivery,"is_mailing",true) ;

            /**メール本文の署名に使う情報 */
            tDelivery.m_branch = this.cMBranch(this.mainStore.loginMUser.m_branch_id) ;
            tDelivery.mailed_m_user = this.mainStore.loginMUser ;

            let ep = this.cEndpoint + "/sendMail"

            try {
                const res = await axios.post(ep , tDelivery) ;
                this.showWarnings(res.data) ;

                delete res.data.warnings ;

                const found = this.dSearchedList.find(x => x.id == res.data.id) ;
                const foundIdx = this.dSearchedList.indexOf(found) ;
                if(foundIdx !== -1) this.dSearchedList.splice(foundIdx ,1 ,res.data) ;

                //lastSaved更新
                this.dLastSavedData = _.cloneDeep(this.dSearchedList) ;

                this.dIsMailSuccess = true ;


            } catch (error) {
                this.$$errorConsole(error ,ep)

            } finally {
                this.dLoading4Mail = false ;
                delete tDelivery.is_mailing ;

            }

        } ,

        postData : async function() {

            if(this.dSearchedList.length === 0 ) return ;

            this.clearMassege();

            this.dLoading4Save  = true ;

            const _this = this ;
            //更新に必要なデータだけ抽出する
            const postData = this.dSearchedList.map(function(x){

                let completedAt = null ;
                if(x.is_delivery_completed) {
                    completedAt = x.delivery_completed_at ?? _this.dateFormatAndTime(new Date())
                }

                return {
                    id : x.id ,
                    invoice_no : x.invoice_no ,
                    // shipping_mail_to : x.shipping_mail_to ,
                    delivery_completed_at : completedAt ,
                    delivery_completed_m_user_id : _this.$$cLoginUserId ,
                    updated_m_user_id : _this.$$cLoginUserId
                }
            })

            let ep = `${this.cEndpoint}/changeByDeliveryList`

            try {

                const res = await axios.post(ep,postData) ;

                this.dSearchedList = res.data ;
                this.dLastSavedData = _.cloneDeep(res.data) ;

                this.dIsSaveSuccess = true ;
                this.dIsDeliveryCompleted = false ;

            } catch (error) {

                 this.$$errorConsole(error ,ep ) ;

            } finally {

                this.dLoading4Save  = false ;

            }

        } ,

        //アラートバー削除
        clearMassege : function() {
            this.dIsSaveSuccess = false ;
            this.dIsMailSuccess = false ;
            this.dErrorStatus = undefined ;
        } ,

        //メール送信時のアドレス不適エラーの警告文を出す
        showWarnings : function(tDelivery) {
            if(tDelivery.warnings.length > 0) {
                alert(tDelivery.warnings[0]) ;
            }
        } ,

        getIsUpdated : function() {

            if(this.dLastSavedData === undefined) return false ;
            const objJson    = JSON.stringify(this.dSearchedList) ;
            const copiedJson = JSON.stringify(this.dLastSavedData) ;

            // console.log("lastSavedJson") ;
            // console.log(copiedJson) ;
            // console.log("dValueJson") ;
            // console.log(objJson) ;

            return objJson !== copiedJson ;

        } ,
        confirmUpdate(doing) {
            if (! this.getIsUpdated() ) return true ;

            const answer = window.confirm(`変更を保存せず${doing}しますか？`)
            // console.log("answer:" + answer)  ;
            return answer ;

        } ,


    } ,
    created : function (){
    } ,

    beforeRouteLeave (to, from, next) {
        if ( this.confirmUpdate("移動")) {
            next() ;
        }

    } ,

}

</script>

<style scoped>

</style>
