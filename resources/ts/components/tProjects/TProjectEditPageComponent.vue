<template>
    <div v-if="cIsShow">
        <validation-observer v-slot="{ invalid }">
            <contents-header-component
                :menu-title="`物件編集 : ${cCd}`"
                :icon="'fa-building'"
                >

                <div slot="breadcrumb">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb bg-dark p-0 mb-0">
                            <li class="breadcrumb-item"><a href="#">Home</a></li>
                            <li class="breadcrumb-item"><a href="#">物件一覧</a></li>
                            <li class="breadcrumb-item active" aria-current="page">物件編集</li>
                        </ol>
                    </nav>
                </div>

                <div slot="title">

                </div>

                <div slot="right-menu">
                    <div>
                        <button
                            type="button" class="btn btn-dark" @click.prevent="newProject">
                            <i class="fas fa-plus fa-fw"></i>
                            新規
                        </button>

                        <button
                            v-show="cIsAbleToChangeViewMode"
                            :class="{'btn-primary':dIsEditingMode ,'btn-dark' : !dIsEditingMode }"
                            type="button" class="btn mr-0 mr-xl-3" @click.prevent="changeEditMode">
                            <i class="fas fa-file-pdf fa-fw"></i>
                            編集モード
                        </button>
                        <button v-show="cIsViewSellPrice" type="button" class="btn btn-dark" @click.prevent="createEstimate">
                            <i class="fas fa-file-pdf fa-fw"></i>
                            見積書
                        </button>
                        <button type="button" class="btn btn-dark" @click.prevent="createDirection">
                            <i class="fas fa-file-pdf fa-fw"></i>
                            指示書
                        </button>
                        <button type="button" class="btn btn-dark" @click.prevent="createConstructionDirection">
                            <i class="fas fa-file-pdf fa-fw"></i>
                            現場指示書
                        </button>
                        <button type="button" class="btn btn-dark" @click.prevent="createHungTag">
                            <i class="fas fa-file-pdf fa-fw"></i>
                            下げ札
                        </button>
                        <!-- <button type="button" class="btn btn-dark" >
                            <i class="fas fa-file-pdf fa-fw"></i>
                            送り状
                        </button> -->


                        <button type="button" class="btn btn-dark mr-0 mr-xl-3" @click.prevent="copyTProject">
                            <i class="fas fa-file-pdf fa-fw"></i>
                            コピー
                        </button>
                        <button type="button" class="btn btn-success"
                            @click.prevent="postData"
                            :disabled="invalid || dIsSaving || dUploadingFile || dIdEstApproveSaving">

                            <div v-if="dIsSaving">
                                <span class="spinner-border spinner-border-sm" role="status" />
                                保存中...
                            </div>
                            <div v-else>
                                <i class="fas fa-save fa-fw"></i>
                                物件保存
                            </div>

                        </button>
                    </div>
                    <div class="mt-2">
                        <button type="button" class="btn btn-dark" @click.prevent="createDirectionNew">
                            <i class="fas fa-file-pdf fa-fw"></i>
                            指示書(縦)
                        </button>
                        <button type="button" class="btn btn-info ml-0" 
                            v-if="cIsAbleToEstApprove"
                            :disabled="dIsSaving || dUploadingFile || dIdEstApproveSaving"
                            @click.prevent="approveEst">
                            <div v-if="dIdEstApproveSaving">
                                <span class="spinner-border spinner-border-sm" role="status" />
                                保存中...
                            </div>
                            <div v-else-if="cIsEstApprovedAt">
                                <i class="fas fa-times-circle fa-fw"></i>
                                承認解除
                            </div>
                            <div v-else>
                                <i class="fas fa-check-circle fa-fw"></i>
                                承認
                            </div>
                        </button>

                        <button type="button" class="btn btn-dark" v-show="$$cIsDebug" @click.prevent="OutputLogs">
                            log
                        </button>
                    </div>

                </div>


            </contents-header-component>

            <div v-if="$$cIsError" class="alert alert-danger" role="alert">
                {{dErrorData.message}}
            </div>
            <div v-if="dIsSaveSuccess" class="alert alert-success" role="alert">
                保存に成功しました
            </div>


            <div class="app-contents-container " >
                <form id="form">
                    <div class="row mb-2 text-lightgray">
                        <div class="col-12 col-xl-2" :class="cStateClass">
                            状態 : {{cStateName}}
                        </div>
                        <div class="col-12 col-xl-2">
                            SS : <a :href="cSsLinkUrl" target="_blank" rel="noopener noreferrer">{{cSsOrderCd}}</a>
                            <validation-provider name="SS仮登録商品"
                                vid="tProject-cIsNotProductCatAsSs"
                                rules="required|excluded:0"
                                immediate v-slot="{ errors }">
                                <div>
                                    <input 
                                        class="d-none"
                                        v-model="cIsNotProductCatAsSs"
                                        type="number">
                                    <span class="validation-error" v-show="errors.length > 0">SS仮登録商品が存在しています</span>
                                </div>
                            </validation-provider>
                        </div>
                        <div class="col-12 col-xl-2">
                            最終更新日 : {{cUpdatedAt}}
                        </div>
                        <div class="col-12 col-xl-2">
                            <div>登録担当者 : {{cCreatedMUserName}}</div>
                            <div>最終更新者 : {{cUpdatedMUserName}}</div>
                        </div>
                        <div class="col-12 col-xl-2">
                            見積 : <span :class="cIsOkProfitPer ? 'text-success' : 'text-danger'">{{cEstApproveStatus}}</span>
                        </div>

                        <div class="col-12 col-xl-2">
                            <div>見積承認日 :{{cEstApprovedAt}}</div>
                            <div>見積承認者 :{{cEstApprovedMUserName}}</div>
                        </div>
                        
                    </div>


                    <div class="row bg-app-secondaly pt-2">
                        <div class="col-12 col-xl-2">
                            <validation-provider name="受注拠点"
                                vid="tProject-cMBranchId"
                                rules="required|excluded:0"
                                immediate v-slot="{ errors }">
                                <div class="form-group">
                                    <label >受注拠点</label>
                                    <div  v-show="cIsViewMode">{{cMBranchName}}</div>
                                    <m-branch-select
                                        v-show="! cIsViewMode"
                                        v-model="cMBranchId"
                                        :selected-item.sync="dSelectedMBranchItem"
                                        ></m-branch-select>
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </div>

                            </validation-provider>
                        </div>

                        <div class="col-12 col-xl-4 pl-3 pl-xl-0">
                            <validation-provider name="クライアント"
                                vid="tProject-cMCustomerId"
                                rules="required|excluded:0"
                                immediate v-slot="{ errors }">
                                <div class="form-group">
                                    <label >
                                        クライアント
                                        <a  v-if="cMCustomerId !== 0"
                                            href="#"
                                            @click.prevent="viewMCustomerInfoView">
                                            <i class="fas fa-eye fa-fw" />        
                                            付加情報表示
                                        </a>  
                                        <span 
                                            v-if="cMCustomerId !== 0" 
                                            class="ml-2">
                                            締日:{{cCustomerClosingDate}}
                                        </span>
                                        
                                    </label>
                                    <div  v-show="cIsViewMode">{{cMCustomerName}}</div>
                                    <m-customer-ref-input
                                        v-show="! cIsViewMode"
                                        v-model="cMCustomerId"
                                        :mBranchId="cMBranchId"
                                        :selected-item.sync="dValue.m_customer"
                                        :sales-m_user-id.sync="cCustomerSalesMUserId"
                                        :dealing-cds="[1]"
                                        >
                                    </m-customer-ref-input>
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </div>
                            </validation-provider>
                        </div>

                        <div class="col-12 col-xl-1 pl-3 pl-xl-0">
                            <div class="form-group">
                                <label>客先担当</label>
                                
                                <div  v-if="cIsViewMode">{{cCustomerUserName}}</div>
                                <m-customer-person-input
                                    v-else
                                    v-model="cCustomerUserName"
                                    :email.sync="cDeliveryMailTo"
                                    :m-customer-id="cMCustomerId"
                                    />                                
                            </div>
                        </div>

                        <div class="col-12 col-xl-2 pl-3 pl-xl-0">
                            <validation-provider name="営業担当"
                                vid="tProject-cSalesMUserId"
                                rules="required|excluded:0"
                                immediate v-slot="{ errors }">
                                <div class="form-group">
                                    <label >営業担当</label>
                                    <div  v-show="cIsViewMode">{{cSaleMUserName}}</div>
                                    <m-user-select
                                        v-show="! cIsViewMode"
                                        v-model="cSalesMUserId"
                                        :m-branch-id="cMBranchId"
                                        :selected-item.sync="dSelectedSalesMUser"
                                        :filter-m-tag-keys="['m_users-role-sales']"
                                        >
                                    </m-user-select>
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </div>

                            </validation-provider>
                        </div>


                        <div class="col-12 col-xl-3 pl-3 pl-xl-0">
                            <validation-provider name="物件名"
                                vid="tProject-cName"
                                rules="required"
                                immediate v-slot="{ errors }">
                                <div class="form-group">
                                    <label for="projectName">物件名</label>
                                    <div  v-show="cIsViewMode">{{cName}}</div>
                                    <input id="projectName"
                                        v-show="! cIsViewMode"
                                        v-model="cName"
                                        type="text" class="form-control" placeholder="" >
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </div>
                            </validation-provider>
                        </div>

                    </div>


                    <div class="row bg-app-secondaly pt-2">
                        <div class="col-12 col-xl-2">                            
                            <div class="form-group">
                                <label>受注日</label>
                                <div  v-show="cIsViewMode">{{$$formatDay(cOrderedAt)}}</div>
                                <ex-v-date-picker
                                    :inputDisabled="cIsAlreadySale || cIsOrderLost"
                                    v-show="! cIsViewMode"
                                    v-model="cOrderedAt" />
                                <validation-provider name="納品情報の登録"
                                    vid="tProject-cIsExistDelivery"
                                    rules="required|excluded:0"
                                    immediate v-slot="{ errors }">
                                    <div>
                                        <input 
                                            class="d-none"
                                            v-model="cIsExistDelivery"
                                            type="number">
                                        <span class="validation-error" v-show="errors.length > 0">納品情報の登録が必須です</span>
                                    </div>
                                </validation-provider>
                                <validation-provider name="生産計画状態有り"
                                    vid="tProject-cIsAbleToReturnNonOrder"
                                    :rules="`${ cOrderedAt == null ? 'required|excluded:0' : ''}`"                                         
                                    immediate v-slot="{ errors }">
                                    <div>
                                        <input 
                                            class="d-none"
                                            v-model="cIsAbleToReturnNonOrder"
                                            type="number">
                                        <p class="validation-error pb-5" v-show="errors.length > 0">生産情報が登録されている為、案件状態には戻せません。生産計画データを削除してください。</p>
                                        
                                    </div>
                                </validation-provider>
                                

                            </div>
                            
                        </div>
                        

                        <div class="col-12 col-xl-2 pl-xl-0">
                            <div class="form-group">
                                <label>客先注文No.</label>
                                <div  v-show="cIsViewMode">{{cCustomerOrderNo}}</div>
                                <input
                                    :disabled="cIsAlreadySale"
                                    v-show="! cIsViewMode"
                                    v-model="cCustomerOrderNo"
                                    type="text" class="form-control" placeholder="" />
                            </div>
                        </div>
                        
                        <div class="col-12 col-xl-1">
                            <div class="form-group">
                                <label>失注</label>
                                <ns-checkbox-input
                                    :disabled="cIsAlreadySale"
                                    v-model="cIsOrderLost"
                                    :id="'TProjectEditIsOrderLost'"
                                    />
                            </div>
                        
                        </div>
                        <div class="col-12 col-xl-4 pl-xl-0">
                            <div class="form-group">
                                <label for="cDeliveryMailTo">発送完了メール</label>
                                <div v-if="cIsViewMode">{{cDeliveryMailTo}}</div>
                                <input id="cDeliveryMailTo"
                                    v-else
                                    v-model="cDeliveryMailTo"
                                    type="text" class="form-control" placeholder="" >
                            </div>
                        </div>
                                                
                        <div class="col-12 col-xl-1 pl-xl-0">
                            <div class="form-group">
                                <label>物件最短納期</label>
                                <div >{{cMinDeliveryAt}}</div>
                            </div>
                        </div>
                        <div class="col-12 col-xl-1 pl-xl-0">
                            <div class="form-group">
                                <label>物件最終着日</label>
                                <div >{{cMaxArrivalAt}}</div>
                            </div>
                        </div>
                        
                        

                    </div>



                    <div class="row bg-app-secondaly pt-2">
                        <div class="col-12">
                            <div class="form-group">
                                <label >備考</label>
                                <div  v-show="cIsViewMode">{{cMemo}}</div>
                                <input
                                    id="memo"
                                    v-show="! cIsViewMode"
                                    v-model.lazy="cMemo"
                                    type="text" class="form-control" placeholder="" >
                            </div>
                        </div>

                    </div>



                    <div class="row mt-2">

                        <div class="col-12 col-lg-12 pl-0 pr-0  pt-2 pt-xl-0">
                            <nav>
                                <ul class="nav nav-tabs navbar-dark border-bottom-0" id="project-nav-category">
                                    <li v-show="dIsEditingMode"
                                        class="nav-item">
                                        <a ref="catEditProducts" class="nav-link" id="home-tab" data-toggle="tab" href="#nav-cat-products" role="tab" aria-controls="products" aria-selected="true">
                                            <i class="fas fa-print fa-fw pr-2"></i>商品
                                        </a>
                                    </li>
                                    <li v-show="!dIsEditingMode"  class="nav-item">
                                        <a ref="catViewProducts" class="nav-link" id="products-view-tab" data-toggle="tab" href="#nav-cat-products-view" role="tab" aria-controls="products-view" aria-selected="false">
                                            <i class="fas fa-print fa-fw pr-2"></i>商品ビュー
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" id="delivery-tab" data-toggle="tab" href="#nav-cat-delivery" role="tab" aria-controls="delivery" aria-selected="false">
                                            <i class="fas fa-truck fa-fw mr-1"></i>納品
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" id="profile-tab" data-toggle="tab" href="#nav-cat-construction" role="tab" aria-controls="construction" aria-selected="false">
                                            <i class="fas fa-tools fa-fw pr-2"></i>施工
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" id="contact-tab" data-toggle="tab" href="#nav-cat-files" role="tab" aria-controls="files" aria-selected="false">
                                            <i class="fas fa-file fa-fw pr-2"></i>添付ファイル<span class="badge badge-light ml-1">{{cFileNum}}</span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" id="contact-tab" data-toggle="tab" href="#nav-cat-mails" role="tab" aria-controls="mails" aria-selected="false">
                                            <i class="fas fa-envelope-open pr-2"></i>メール<span class="badge badge-light ml-1">{{cMailNum}}</span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" id="contact-tab" data-toggle="tab" href="#nav-cat-po" role="tab" aria-controls="po" aria-selected="false" @click.prevent="openOrderComponent">
                                            <i class="fas fa-shopping-cart pr-2"></i>発注<span class="badge badge-light ml-1">{{dUnorderNum}}</span>
                                        </a>
                                    </li>
                                    <li v-if="cIsViewSellPrice" class="nav-item">
                                        <a class="nav-link" data-toggle="tab" href="#nav-cat-price" role="tab" aria-controls="price" aria-selected="false">
                                            <i class="fas fa-yen-sign fa-fw pr-2"></i>サマリー</a>
                                    </li>
                                </ul>
                            </nav>
                            <div class="tab-content" id="nav-tabContent">
                                <div
                                    v-show="dIsEditingMode"
                                    class="tab-pane pl-0 mr-0 py-0 fade show " id="nav-cat-products" role="tabpanel" aria-labelledby="nav-home-tab">
                                    <div class="pr-3">
                                        <div class="row">
                                            <div class="col-12 col-lg-5 pr-0 pr-lg-2">
                                                <div class="px-0" :class="cIsStickyClass" :style="cIsStickyStyle">
                                                    <t-product-list-component
                                                        v-model="dValue"
                                                        :product-list="cTProjectProducts"
                                                        :selected-product.sync="dSelectedProduct"
                                                        :is-view-price="cIsViewPrice"
                                                        :is-saving="dIsSaving"
                                                        ref="tProductList"
                                                        />
                                                </div>
                                            </div>
                                            <div class="col-12 col-lg-7 mt-2 mt-lg-0 pr-0 pl-lg-0">
                                                <t-product-edit
                                                    v-if="cIsProductEditing"
                                                    v-model="dSelectedProduct"
                                                    :set-m-branch-id="cMBranchId"
                                                    :t-project="dValue"
                                                    :is-view-mode="! dIsEditingMode"
                                                    :is-view-price="cIsViewPrice"
                                                    :is-view-sell-price="cIsViewSellPrice"
                                                    @save="saveProduct"
                                                    @cancel="cancelProduct"
                                                    >
                                                </t-product-edit>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div
                                    v-show="! dIsEditingMode"
                                    class="tab-pane pl-0 mr-0 py-0 fade" id="nav-cat-products-view" role="tabpanel" aria-labelledby="nav-products-view-tab">
                                    <t-product-view-list-component
                                        v-model="dValue"
                                        :product-list="cTProjectProducts">
                                    </t-product-view-list-component>
                                </div>
                                <div class="tab-pane pl-0 mr-0 py-0 fade" id="nav-cat-delivery" role="tabpanel" aria-labelledby="nav-delivery-tab">
                                    <t-project-delivery-component
                                        v-model="dValue"
                                        ref="delComponent"
                                        >
                                    </t-project-delivery-component>
                                </div>
                                <div class="tab-pane fade" id="nav-cat-construction" role="tabpanel" aria-labelledby="nav-profile-tab">
                                    <t-project-construction-component
                                        v-model="dValue">
                                    </t-project-construction-component>

                                </div>
                                <div class="tab-pane fade" id="nav-cat-files" role="tabpanel" aria-labelledby="nav-contact-tab">
                                    <t-project-file-list-component
                                        v-model="dValue"
                                        :type="'nomal'"
                                        @uploadFile="dUploadingFile=$event">
                                    </t-project-file-list-component>
                                </div>
                                <div class="tab-pane fade" id="nav-cat-mails" role="tabpanel" aria-labelledby="nav-contact-tab">
                                    <t-project-mail-list-component
                                        v-model="dValue">
                                    </t-project-mail-list-component>
                                </div>
                                <div class="tab-pane fade" id="nav-cat-po" role="tabpanel" aria-labelledby="nav-contact-tab">
                                    <t-project-purchase-order-component
                                        v-model="dValue"
                                        :product-list="cTProjectProducts"
                                        @countUnorderNum="dUnorderNum=$event"
                                        ref="orderComponent"
                                        :is-view-price="cIsViewPrice"
                                        :last-saved="dLastSaved"
                                        >
                                    </t-project-purchase-order-component>
                                </div>
                                <div v-if="cIsViewSellPrice"
                                    class="tab-pane fade" id="nav-cat-price" role="tabpanel" aria-labelledby="nav-contact-tab">
                                    <t-project-summary-component
                                        v-model="dValue"
                                        :product-list="cTProjectProducts">
                                    </t-project-summary-component>

                                </div>

                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </validation-observer>
        

        <m-customer-info-view-modal
            :m-customer="dValue.m_customer"
            v-show="dIsModalOpen_MCustomerInfoView"
            :is-open.sync="dIsModalOpen_MCustomerInfoView"
            />


    </div>
    <div v-else>
        <loading-animation />
    </div>


</template>
<script>
import MKvsConst from '../../consts/MKvsConst';
import DayJsEx from '../../frameworks/DayJsEx';
import MastersUtil from '../../frameworks/MastersUtil';
import NumberUtil from '../../frameworks/NumberUtil';
import ObjectUtil from '../../frameworks/ObjectUtil';
import TProjectUtil from '../../frameworks/TProjectUtil';
import DynamicGetSetComputedMixins from '../../mixins/commons/DynamicGetSetComputedMixins';
import TProductionGroupManager from '../tProductions/class/TProductionGroupManager';
import { TProject } from './class/models/TProject';
import { TProjectService } from './class/services/TProjectService'
import RtSsOrdersConst from '../rel/rtSsOrders/consts/RtSsOrdersConst'
import _ from 'lodash'
// import { defineComponent ,ref,computed, onMounted, reactive } from '@vue/composition-api'
import Vue, { ref,computed,defineComponent,reactive,onMounted } from 'vue';
import dayjs from 'dayjs';
import { useSsStore } from '../../stores/smartshopStore' ;

export default defineComponent({ 
    mixins : [DynamicGetSetComputedMixins] , 
    data : function() {
        return {
            // 保存中
            dIsSaving : false ,

            dIdEstApproveSaving : false ,
            /**
             * 顧客付加情報Modal表示
             */
            dIsModalOpen_MCustomerInfoView : false ,
            // V-forのKey用
            dProductList : [] ,

            dApiName : "tProject" ,


            dValue : undefined , 
            // 選択中のProduct
            dSelectedProduct : undefined ,

            // 保存成功
            dIsSaveSuccess : false ,

            // 選択中の営業担当
            dSelectedSalesMUser : undefined ,

            dSelectedMBranchItem : {} ,
            //id : 0 ,

            /**
             * 最後の保存した状態
             * ※　保存確認に使用
             * */
            dLastSaved : undefined ,

            /**
             * UserSelectフィルタ用
             */
            dFilterUserRoleTagKeys : ["m_users-role-sales"] ,


            /**
             * 編集モード
             */
            dIsEditingMode : false ,


            dUnorderNum : 0 ,


            //ファイルアップロード中
            dUploadingFile : false ,


            dGroupManager : undefined , 


            dComputedGetSetDefs : [
                // 拠点ID
                { key:'cMBranchId' ,propName:TProject.MBranchId_PName } ,
                // 顧客ID
                { key:'cMCustomerId' ,propName:TProject.MCustomerId_PName } ,
                // 顧客担当者
                { key:'cCustomerUserName' ,propName:TProject.CustomerUserName_PName } ,

                //顧客担当者id
                // { key:'cMCustomerPersonId' ,propName:TProject.MCustomerPersonId_PName } ,
                // //顧客担当者(マスターから)
                // { key:'cMCustomerPerson' ,propName:"MCustomerPerson" } ,
                //顧客担当者手入力フラグ
                { key:'cIsInputCustomerUser' ,propName:"IsInputCustomerUser" } ,

                // 物件名
                { key:'cName' ,propName:TProject.Name_PName } ,
                // 営業担当ID
                { key:'cSalesMUserId' ,propName:TProject.SalesMUserId_PName } ,
                // 受注日
                { key:'cOrderedAt' ,propName:TProject.OrderedAt_PName } ,
                // 失注
                { key:'cIsOrderLost' ,propName:"IsOrderLost" } ,
                // 受注担当者
                { key:'cOrderedMUserId' ,propName:TProject.OrderedMUserId_PName } ,
                // 客先注文No
                { key:'cCustomerOrderNo' ,propName:TProject.CustomerOrderNo_PName } ,
                // 納品完了メール送信先
                { key:'cDeliveryMailTo' ,propName:TProject.DeliveryMailTo_PName } ,
                // 備考
                { key:'cMemo' ,propName:"Memo" } ,
                

            ] , 

            dComputedGetDefs : [
                // 状態名
                { key:'cStateName' ,propName:"StateName" } ,   
                // 状態表示クラス
                { key:'cStateClass' ,propName:"StateClass" } ,   

                // 生産計画済みデータが存在するか
                { key:'cIsExistsProductionPlan' ,propName:"IsExistsProductionPlan" } ,   
                // 生産実績データが存在するか
                { key:'cIsExistsProductionResult' ,propName:"IsExistsProductionResult" } ,   
                // 受注していない状態に処理可能か
                { key:'cIsAbleToReturnNonOrder' ,propName:"IsAbleToReturnNonOrder" } ,   

                // コード
                { key:'cCd' ,propName:TProject.Cd_PName} ,   

            ] ,


            //クライアント担当者名入力フラグ
            dIsInputCustmerUserName : true ,
            

        }
    } ,
    props : {

    } ,

    computed : {


        cGroupManager : function() { 
            if ( this.dGroupManager === undefined) {
                this.dGroupManager = new TProductionGroupManager(this.$$cLoginUserId) ;                 
                // console.log(this.mainStore.masters.MProductions) ;
                this.dGroupManager.loadAllMProductions() ; 
            }

            return this.dGroupManager ; 
        } , 
        
        /**
         * コンポーネント描画許可フラグ
         */
        cIsShow : function () {
            if (! this.$$cIsAppReady) return false ;
            
            return this.dValue !== undefined ; 

        } ,

        /**
         * 表示モードフラグ
         *  true : 編集モード
         *  false : Viewモード
         */
        cIsViewMode : function() {
            return ! this.dIsEditingMode ;
        } ,

        /**
         * 編集モードの切り替えが可能か
         */
        cIsAbleToChangeViewMode : function() {
            return this.cUserRoleLv >= 20 ;
        } ,

        /**
         * 金額の表示フラグ
         */
        cIsViewPrice : function() {
            const val = NumberUtil.invalid2zr(this.mainStore.getRole("t_project-price-view-permission")) ;
            return val >= 10 ;
        } ,
        cIsViewSellPrice : function(){
            //nskUser
            if(this.$$cIsNskDev) return true ;
            
            // 権限がない
            if ( ! this.cIsViewPrice) return false ; 

            const viewSettingFlg = this.masterStore.getSMOptionValByKeyMKvId(MKvsConst.SmOptions.Project.SUMMARY_VIEW_MODE) ;  
            // console.log("viewSettingFlg " + viewSettingFlg) ; 
            // 全ユーザー
            if ( viewSettingFlg === 0 ) return true ; 
            
            //単価表示権限が50以上の場合SmOptionのサマリー表示モードを無視
            const isIgnoreViewSettingFlg = NumberUtil.invalid2zr(this.mainStore.getRole("t_project-price-view-permission")) >= 50 ;
            
            // 営業担当 = ログインユーザー
            if ( !isIgnoreViewSettingFlg && viewSettingFlg === 1 ) return this.cSalesMUserId === this.$$cLoginUserId; 

            return true ; 
            
        } ,

        /**
         * ログインユーザーの権限レベル
         */
        cUserRoleLv : function() {
            const editRoleLv = NumberUtil.invalid2zr(this.mainStore.getRole("t_project-privilege")) ;
            return editRoleLv ;
        } ,


        /**
         * 新規フラグ PostDataに使用
         */
        cIsNew : function () {
            if ( this.cIsCopy ) return this.cId === undefined ; 
            return this.$route.params.id === undefined  && this.cId === undefined  ; 
            //return this.cId === undefined || this.cId < 0 ;
        } ,

        /**
         * コピーからきたかフラグ
         */
        cIsCopy : function(){
            // if(this.$route.params?.srcId !== undefined ) return true ;            
            return this.$route.params?.srcId !== undefined ; 
        } ,

        /**
         * コピー元ID
         */
        cCopySrcId : function() { 
            return this.$route.params?.srcId ; 
        } , 

        cEndpoint4Get : function () {
            let ep =  `api/${this.dApiName}` ;

            if ( this.cIsCopy ){
                ep += `/${this.cCopySrcId}` ;
            } 
            else { 
                if ( !this.cIsNew ){
                    ep += `/${this.$route.params.id }`  ; 
                } 
            }
            
            return  ep ;
        } ,
        cEndpoint4Post : function () {
            let ep =  `api/${this.dApiName}` ;
            if ( this.cIsCopy && this.cIsNew ) return ep ; 

            if ( ! _.isNil(this.cId) ) ep += `/${this.cId}` ;
            return  ep ;
        } ,

        /**
         * 商品編集中
         */
        cIsProductEditing : function() {
            return this.dSelectedProduct !== undefined ;
        } ,

        /**
         * 既に売上済み
         */
        cIsAlreadySale : function() {
            if ( ObjectUtil.isNU(this.dValue?.t_sale_details )) return false ;
            return this.dValue.t_sale_details.length > 0 ;
        } ,


        /**
         * 添付ファイル数
         */
        cFileNum : function(){
            if(!this.dValue?.t_project_files?.length) return 0 ;
            return this.dValue.t_project_files.filter(x => ! x.is_folder && x.deleted_at == null).length ;
        } ,
        /**
         * 添付メール数
         */
        cMailNum : function(){
            if(!this.dValue?.t_project_mails?.length) return 0 ;
            return this.dValue.t_project_mails.filter(x => x.deleted_at == null).length ;
        } ,

        /**
         * 受注日入力時の納品情報の存在数
         * 受注日が入力されているときに納期の情報が入っていない事を防ぐ
         **/
        cIsExistDelivery :function(){

            if(ObjectUtil.isNU(this.cOrderedAt) ) return 1 ;
            //deleted_at考慮
            const num = this.dValue.t_project_deliveries.filter( x=> x.deleted_at == null).length 
            return num ?? 0 ;
        } ,

        //商品カテゴリスマートショップ商品がある（物件保存不可バリデーションに使用）
        cIsNotProductCatAsSs : function() {
            if(_.isEmpty(this.cTProjectProducts) ) return true ;
            const SsProd = this.cTProjectProducts.filter( p => p.m_product_category_id == RtSsOrdersConst.M_PRODUCT_CATEGORY_ID)
            return SsProd.length == 0 ;
        } ,

        //商品編集中のみ商品リスト追従クラス
        cIsStickyClass : function() {  
            if(this.cIsProductEditing) return 'sticky-top'
        } ,
        //商品編集中のみ商品リスト追従スタイル
        cIsStickyStyle : function() {  
            if(this.cIsProductEditing) return 'z-index:auto'
        } ,

        /* カラム系 */

        // ID
        cIdCName : function() {
            const colName = "id" ;
            return colName ;
        } ,
        cId :{
            get :  function() {
                return this.getValue(this.cIdCName) ;
            } ,
            set : function(val) {
                this.setValue(this.cIdCName, val)  ;
            }
        } ,

        //スマートショップorder_no
        cSsOrderCd : function() {
            return this.getValue('ss_order_cd') ;
        } ,
        //スマートショップorder_link
        cSsLinkUrl : function() {
            const ssOrderId =  this.getValue('ss_order_id') ;
            return `https://print-smartshop.com/administrator/index.php?option=com_jshopping&controller=orders&task=show&order_id=${ssOrderId}` ;
        } ,

        /**
         * 選択中の拠点名
         */
        cMBranchName : function() {
            return MastersUtil.getBranchName(this.dSelectedMBranchItem) ;
        } ,
        /**
         * 選択中の顧客名
         */
        cMCustomerName : function() {
            return MastersUtil.getCustomerName(this.dValue.m_customer)
        } ,

        /**
         * 選択中の営業担当名
         */
        cSaleMUserName : function() {
            if ( this.dSelectedSalesMUser === undefined) return "" ;
            return this.dSelectedSalesMUser.full_name ;

        } ,


        // 取引先に設定されている営業担当( 営業担当が空の場合のみ設定)
        cCustomerSalesMUserId : {
            get : function() {
                return this.cSalesMUserId ;
            } ,
            set : function(val) {
                //console.log(this.cSalesMUserId) ;
                if ( NumberUtil.invalid2zr( this.cSalesMUserId ) === 0) {
                    //console.log("sales " + this.cSalesMUserId ) ;
                    //console.log("new " + val ) ;

                    this.cSalesMUserId = val ;
                }
            }
        } ,


        /**
         * 物件最短納期
         */
        cMinDeliveryAt : function() {
            const minDelivery = this.getValue("min_delivery") ;
            if ( ObjectUtil.isNU( minDelivery?.delivery_at ) ) return "" ;

            const at = DayJsEx.formatDate(minDelivery["delivery_at"] )
            const time = ObjectUtil.nu2ec(minDelivery["delivery_time"])   ;
            return `${at} ${time}` ;
        } ,
        /**
         * 物件最終着日
         */
        cMaxArrivalAt : function() {
            const delivery = this.getValue("max_arrival") ;
            if ( _.isNil(delivery)) return "" ; 
            
            const colPostfix = _.isNil( delivery["arrival_at"] ) ? "delivery"  : "arrival" ; 
            const at = DayJsEx.formatDate(delivery[`${colPostfix}_at`] )
            const time = ObjectUtil.nu2ec(delivery[`${colPostfix}_time`])   ;
            return `${at} ${time}` ;
        } ,

        // 物件作成者
        cCreatedMUserName :function() {
            if ( _.isNil(this.dValue?.created_m_user_id) || _.isNil(this.dValue?.id)) return "" ;
            //削除されているユーザー考慮
            return this.mainStore.masters.MUsers.find(x => x.id == this.dValue.created_m_user_id)?.full_name ?? "";
        } ,
        // 最終更新者
        cUpdatedMUserName :function() {
            // if ( ObjectUtil.isNU( this.dValue?.updated_m_user )) return "" ;
            // return this.dValue?.updated_m_user?.full_name ;
            if ( _.isNil(this.dValue?.updated_m_user_id) || _.isNil(this.dValue?.id)) return "" ;
            //削除されているユーザー考慮
            return this.mainStore.masters.MUsers.find(x => x.id == this.dValue.updated_m_user_id)?.full_name ?? "";
        } ,

        // 最終更新日時
        cUpdatedAtCName : function() {
            const colName = "inc_children_updated_at" ;
            return colName ;
        } ,
        cUpdatedAt :function() {
            let val = this.getValue(this.cUpdatedAtCName) ;
            return DayJsEx.format(val , "YYYY-MM-DD HH:mm:ss") ;
        } ,


        //承認可能な権限所持フラグ
        cIsAbleToEstApprove : function() {
            const val = NumberUtil.invalid2zr(this.mainStore.getRole("t_project-estimate-approve")) ;
            return val >= 10 ;
        } ,
        //見積承認がされているかどうか
        cIsEstApprovedAt : function() {
            const is = this.getValue(this.cEstApprovedAtCName) ;
            return !_.isNil(is);
        } ,
        //見積承認必要フラグ
        cIsOkProfitPer : function() {
            const smMinProfit = this.masterStore.getSMOptionValByKeyMKvId(8010301) ?? 0 ;
            //最低利益率を超えているか？
            if(smMinProfit < NumberUtil.invalid2zr( this.dValue.profit_per )) return true ;
            //売価・原価の変更があるか？
            if(this.dValue.IsPriceUpdated) return false ;
            //承認されているか？
            return this.cIsEstApprovedAt ;
        } ,
        //見積承認ステータス
        cEstApproveStatus : function() {
            return this.cIsOkProfitPer ? "OK" : "要承認" ;
        } ,
        // 見積承認日
        cEstApprovedAtCName : function() {
            const colName = "est_approved_at"
            return colName ;
        } ,
        cEstApprovedAt : function() {
            let val = this.getValue(this.cEstApprovedAtCName) ;
            return DayJsEx.format(val , "YYYY-MM-DD HH:mm:ss") ;
        } ,

        // 見積承認者
        cEstApprovedMUserName :function() {
            if ( _.isNil(this.dValue?.est_approved_m_user_id) || _.isNil(this.dValue?.id)) return "" ;
            //削除されているユーザー考慮
            return this.mainStore.masters.MUsers.find(x => x.id == this.dValue.est_approved_m_user_id)?.full_name ?? "";
        } ,


        // 商品リスト
        cTProjectProducts : function(){
            this.dProductIndex += this.dProductList.length ;

            this.dProductList = this.dValue?.t_project_products ?? [] ;
            const list = this.dProductList.filter(x => x.deleted_at == null) ;

            return list === undefined ? [] : list ;
        } ,

        //顧客締日を表示する
        cCustomerClosingDate : function() {

            if(_.isEmpty(this.dValue.m_customer)) return ""
            //顧客締日
            const custCloseD = this.dValue.m_customer.closing_date
            //受注日がない場合は出さない
            if( _.isNil(this.cOrderedAt) ) return '' ;
            if( _.isNil(custCloseD) || custCloseD == 0 ) return '未設定' ;
            //受注月
            const month = DayJsEx.format(this.cOrderedAt,'MM') ;
            //受注月の末日
            const endOfMonth = dayjs(this.cOrderedAt).endOf('month').format('DD') ;

            //99などの月の末日以上が顧客締日に設定されている場合
            if( custCloseD > endOfMonth ) return DayJsEx.format(`${month}-${endOfMonth}`,'MM-DD') ;
            
            return DayJsEx.format(`${month}-${custCloseD}`,'MM-DD') ;

        }


    } ,
    methods : {

        getValue : function(colName )
        {
            return this.$$getValue("dValue" , colName) ;
        } ,
        setValue : function(colName , val){
            this.$$setValue("dValue" , colName , val  ) ;
        } ,

        /**
         * 編集モード変更
         */
        changeEditMode : function() {
            this.dIsEditingMode = ! this.dIsEditingMode ;

            this.reflectEditMode4tab() ;

        } ,
        /**
         * 現在の編集モードに応じて　アクティブなタブを変更する
         */
        reflectEditMode4tab : function() {
            if (this.$refs.catEditProducts === undefined ) return ; 
            if ( this.dIsEditingMode ) {
                this.$refs.catEditProducts.click() ;
            } else {
                this.$refs.catViewProducts.click() ;
            }

        } ,
        /**
         * データ取得後に変更があったかチェック
         */
        getIsUpdated : function() {
            let isUpdated = true ;
            if ( this.dLastSaved !== undefined ) {
                // delete this.dLastSaved["m_customer"] ;
                isUpdated = ! this.dValue.isSame(this.dLastSaved) ; 
                // console.log("isUpdated :" + isUpdated) ;                 
                
            }

            return isUpdated ;

        } ,
        /**
         * 物件データ取得
         */
        getData : async function () {    
            
            let ep = this.cEndpoint4Get ;
            try {                
                const res = await axios.get(ep ) ;

                const parsed = TProject.parse(res.data ) ;                 
                
                // console.log(res.data) ; 
                // console.log(JSON.stringify(this.dValue)) ; 

                // console.log(`cId:${this.cId} cCopySrcId:${this.cCopySrcId} cIsCOpy:${this.cIsCopy}`) ; 
                if(this.cIsCopy && this.cId === undefined) {
                    parsed.initWhenCopy(this.$$cLoginUserId );
                }

                this.dValue = parsed ;
                // this.dLastSaved = ObjectUtil.deepCopyJ( res.data) ;
                this.dLastSaved = ObjectUtil.deepCopyJ(this.dValue) ;

            }
            catch (error)
            {
                this.$$errorConsole(error ,ep ) ;

            }
            

        } ,
        /**
         * 物件データ保存
         */
        postData :async function() {
            
            this.$$clearError() ;
            this.dIsSaveSuccess = false ;
            this.dIsSaving = true ;
            this.dValue.updated_m_user_id = this.$$cLoginUserId ;
            // 日付書式修正
            // this.cOrderedAt = this.$$formatDay(this.cOrderedAt) 
            // this.dValue.estimate_date = this.$$formatDay(this.dValue.estimate_date)
            
            const smMinProfit = this.masterStore.getSMOptionValByKeyMKvId(8010301) ?? 0 ;

            //見積承認状態の変更アナウンス
            //新規ではない && 最低利益率以下 && 承認済 && 変更あり 
            if(!_.isNil(this.cId) && 
                smMinProfit >= this.dValue.profit_per &&
                this.cIsEstApprovedAt && 
                this.dValue.IsPriceUpdated
                ) 
            {
                if( !confirm('原価か売価に変更があるため、見積の承認状態が解除されます。よろしいですか？')) return ;
                this.dValue.est_approved_at = null ;
                this.dValue.est_approved_m_user_id = null ;
            }

            let resData ;
        
            try {
                resData = await TProjectService.saveFromTProject(this.dValue) ; 
            
            } catch (error) {
                this.$$errorConsole(error ,this.cEndpoint4Post ) ;
                
                console.error("tProject save failed") ;
                this.dIsSaving = false ;
                return undefined ; 
            }
            

            //生産計画の更新処理
            if(!this.cIsNew) {

                // 削除する計画ID
                const deletePlanIds = [] ; 
                
                // 更新の必要の可能性のあるGroupのIdの配列
                const changeGroupIds = [] ; 

                //console.log(this.cOrderedAt) ; 
                const isOrderd = ! ObjectUtil.isNUE(this.cOrderedAt ) 

                for ( let product of this.dValue.t_project_products ){
                    
                    if ( product.t_project_product_processes !== undefined ) {  
                        // 受注解除時
                        if (! isOrderd ){
                            // 削除する生産予定を取得
                            for ( const p of product.t_project_product_processes ){
                                if ( p.t_production_process_plans === undefined) continue ; 
                                deletePlanIds.push(...p.t_production_process_plans.map(x => x.id)) ;  
                            }                            
                        }

                        // 変更の可能性のあるグループの生産先と日付け
                        // for ( const p of product.t_project_product_processes ){
                        //     if ( p.t_production_process_plans === undefined) continue ; 
                        //     for ( const plan of p.t_production_process_plans ){
                        //         // console.log(`p:${p.id} group:${plan.t_production_day_group.id}`) ; 
                        //         if (! _.isNil(plan.t_production_day_group)){
                        //             // plan.t_production_day_group.
                        //             changeGroupIds.push(plan.t_production_day_group.id) ; 
                        //         }
                        //     }                            
                        // }                            

                        // changeMProductions ; 

                    }

                    // 変更のあったグループを収集

                }


                // 予定の削除
                let isReloadNeeded = false ; 
                
                try {
                    if ( deletePlanIds.length > 0 ){
                        await axios.post("api/tProductionProcessPlan/destroyByIds" , deletePlanIds) ; 
                        isReloadNeeded = true ; 
                    }
                    else { 
                        // Groupの再構築
                        // if ( changeGroupIds.length > 0 ){
                        //     await this.cGroupManager.http.updateChangeGroupsByProject(changeGroupIds) ; 
                        //     isReloadNeeded = true ; 
                        // }
                    }    
                } catch (error) {
                    this.$$errorConsole(error ,"api/tProductionProcessPlan/destroyByIds" ) ;
                    
                    console.error("tProductionProcessPlan destroyByIds failed") ;
                    this.dIsSaving = false ;
                    return undefined ; 
                    
                }

                // console.log("before wait") ; 
                // const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
                // await _sleep(2000);
                // console.log("after wait") ; 
                

                if ( isReloadNeeded ){

                    try {
                        const res = await axios.get(`api/${this.dApiName}/${res.data.id}`) ; 
                        resData = res.data ;

                    } catch (error) {

                        this.$$errorConsole(error ,`api/${this.dApiName}/${res.data.id}` ) ;
                        
                        console.error("tProject reload failed") ;
                        this.dIsSaving = false ;
                        return undefined ; 
                        
                    }

                }
                
                
            }

            // console.log(resData) ;

            const parsed = TProject.parse(resData) ; 
            this.dValue = parsed ;
            this.dLastSaved = ObjectUtil.deepCopyJ(this.dValue) ;    
            this.dIsSaveSuccess = true ;

            this.dIsSaving = false ;
            

        } ,

        confirmUpdate() {
            if (! this.getIsUpdated() ) return true ;

            const answer = window.confirm('変更を保存せず移動しますか？')
            // console.log("answer:" + answer)  ;
            return answer ;

        } ,


        saveProduct(payload) {
            this.$refs.tProductList.saveProduct(payload)  ;
        } ,
        cancelProduct () {
            this.$refs.tProductList.cancelProduct()  ;
        } ,

        tempFileDelete : async function(){
            const ep =  `api/tProjectFile/deleteTempFile` ;
            try{
                const res = await axios.post(ep ,this.dValue.t_project_files) ;

            } catch {
                this.$$errorConsole(error ,ep ) ;
            }
        } ,
        newProject : function() {
            if ( this.$route.path == "/t_project/add") {
                if ( this.confirmUpdate()){
                    this.initProjectData() ;
                }
                return ;                
            }
            this.$router.push({ path: '../../add'  , append:true }) ;

        } ,
        initProjectData : async function () {
            this.dValue = new TProject(this.$$cLoginUserId )  ; 

            this.cMBranchId = this.mainStore.loginMUser.m_branch_id ;
            this.dLastSaved = undefined ;
            this.dSelectedProduct = undefined ;

        } ,

        //未保存の商品が有ります
        openOrderComponent : function(){

            if(!this.dValue.t_project_products?.length) return ;
            const unsaved = this.dValue.t_project_products.filter(x=>!x.id) ;
            if(unsaved?.length) alert("未保存の商品があります。物件保存をしてください。") ;

            this.$refs.orderComponent.getMMaterials() ;

            //TODO編集した商品系

        } ,

        //見積書作成
        createEstimate : function(){
            if(this.dValue.t_project_products.length === 0 ) return ;

            if (this.getIsUpdated() || this.cId === undefined){

                alert("変更されたデータがあります。物件を保存してください。")

                return ;

            } else if(!this.cIsOkProfitPer && !this.cIsAbleToEstApprove) {
                alert("承認が必要です。担当者に問い合わせてください。")

                return ;

            } 
            else {

                // const ep =  `api/tProject/createEstimate/${this.dValue.id}` ;
                if(this.$$cIsDebug) {
                    const ep =  `api/tProject/createEstimate/${this.dValue.id}/view` ;
                    window.open(ep, '_blank') 
                } 
                else {
                    const ep =  `api/tProject/createEstimate/${this.dValue.id}` ;
                    window.open(ep, '_blank')     
                }

            }

        } ,
        //下げ札作成
        createHungTag : function(){

            // return ;

            if (this.getIsUpdated() || this.cId === undefined){

                alert("変更されたデータがあります。物件を保存してください。")

            } else {
                
                if(this.$$cIsDebug) {
                    const ep =  `api/tProject/createHungTag/${this.dValue.id}/view` ;
                    window.open(ep, '_blank') 
                } 
                else {
                    const ep =  `api/tProject/createHungTag/${this.dValue.id}` ;
                    window.open(ep, '_blank')     
                }

            }

        } ,
        //指示書作成
        createDirection : function(){
            if(this.dValue.t_project_products.length === 0 ) return ;
            if (this.getIsUpdated() || this.cId === undefined ){

                alert("変更されたデータがあります。物件を保存してください。")

            } else {

                if(this.$$cIsDebug) {
                    const ep =  `api/tProject/createDirection/${this.dValue.id}/view` ;
                    window.open(ep, '_blank') 
                } 
                else {
                    const ep =  `api/tProject/createDirection/${this.dValue.id}` ;
                    window.open(ep, '_blank')     
                }

            }

        } ,

        createDirectionNew: function(){
            if(this.dValue.t_project_products.length === 0 ) return ;
            if (this.getIsUpdated() || this.cId === undefined ){

                alert("変更されたデータがあります。物件を保存してください。")

            } else {

                if(this.$$cIsDebug) {
                    const ep =  `api/tProject/createDirectionNew/${this.dValue.id}/view` ;
                    window.open(ep, '_blank') 
                } 
                else {
                    const ep =  `api/tProject/createDirectionNew/${this.dValue.id}` ;
                    window.open(ep, '_blank')     
                }

            }

        } ,
        //現場指示書作成
        createConstructionDirection : function(){
            // return ;
            const construction = this.dValue.t_project_deliveries.filter( x => x.delivery_m_kv.g_01 === "construction")
            if(construction?.length == 0) return ;

            if (this.getIsUpdated() || this.cId === undefined){

                alert("変更されたデータがあります。物件を保存してください。")

            } else {

                const ep =  `api/tProjectDelivery/createConstructionDirection/${this.dValue.id}` ;
                // const ep =  `api/tProjectDelivery/createConstructionDirection/${this.dValue.id}/view` ;
                window.open(ep, '_blank') ;

            }

        } ,
        //物件コピー
        copyTProject : function(){
            if (this.getIsUpdated() || this.cId === undefined){

                alert("変更されたデータがあります。物件を保存してください。")
                return ;

            }

            if(!confirm("この物件をコピーしますか？")) return ;

            const resolvedRoute = this.$router.resolve({
                name: "tProjectCopy",
                params: {srcId: this.dValue.id}
            });
            window.open(resolvedRoute.href, '_blank');
        },

        /**
         * 顧客付加情報モーダル表示
         */
        viewMCustomerInfoView : function() { 
            this.dIsModalOpen_MCustomerInfoView = true ; 
        } ,

        /***
         * ログ出力 保存エラー時などに確認
         */
        OutputLogs : function() {
            const stringDValue = JSON.stringify(this.dValue) 
            console.log( "dValue" ,stringDValue ) ;
        } ,

        
        //見積承認
        approveEst : async function() {

            if(!this.cIsAbleToEstApprove || this.cId === undefined) return ;
            
            this.dIdEstApproveSaving = true ;
            
            const status = this.cIsEstApprovedAt ? "ng" : "ok" ;

            let ep = `api/${this.dApiName}/approveEst/${this.cId}/${status}` ;
            try {
                
                //送るデータを最小限にする
                const res = await axios.get(ep) ; 
                
                this.dValue.est_approved_m_user_id = res.data.est_approved_m_user_id ;
                this.dValue.est_approved_at = res.data.est_approved_at ;
                this.dValue.updated_at = res.data.updated_at ;

                this.dIsSaveSuccess = true ;
            

            } catch (error) {
                this.$$errorConsole(error ,ep ) ;
                
            }
            finally {
                this.dIdEstApproveSaving = false ;
            }

        }

        


            

    } ,
    created : async function(){
        //console.log("created") ;
        //console.log("cIsNew:" + this.cIsNew) ;

        // if (this.cIsNew && ! this.cIsCopy){
            // this.initProjectData() ; 
            // this.reflectEditMode4tab() ;
            
        // }
        // else { 
        //     // await this.getData()  ;
        // }
        
        // const _this = this ; 
        // this.$nextTick().then(
        //     function() {
        //         _this.reflectEditMode4tab() ; 
        //     }            
        // ) ; 
        


    } ,
    mounted : async function () {
        
        /**
         * 編集権限
         */
        this.dIsEditingMode = this.cUserRoleLv >= 30  ;

    } ,
    beforeRouteLeave (to, from, next) {
        
        if(from.path == "/t_project/ss_order" && to.path == "/t_project/add") {
            next() ;
        }
        else {
            if ( this.confirmUpdate()) {
                next() ;
            }
        }
        
    } ,
    async beforeRouteEnter(to, from, next) {  
        
        if ( to.path == "/t_project/add"){
            next(async (vm) => {
                // console.log("A") ; 
                await vm.initProjectData() ;
                await vm.reflectEditMode4tab() ;
                next();
            });
        }
        else if (to.path == "/t_project/ss_order") { 
            //smartshop order
            next(async (vm) => {

                const isNewWindow = !_.isNil(window.opener?.vueapp) ;

                const ssStore = useSsStore() ;

                const data = isNewWindow ?  _.cloneDeep(window.opener.vueapp.ssStore.ssData) : _.cloneDeep(ssStore.ssData)  ;

                if(data == undefined) {
                    //取得に失敗
                    //物件新規追加へ飛ぶ
                    vm.$router.push({ path: '../add'  , append:true }) ;
                } else {
                    await vm.initProjectData() ;
                    vm.dValue = TProject.parse(data);
                    await vm.reflectEditMode4tab() ;

                    //納品情報を最初から開いておく
                    if (vm.$refs.delComponent !== undefined ) {
                        vm.$refs.delComponent.selectDelivery(vm.dValue.t_project_deliveries[0])
                    } ; 

                    if(isNewWindow) {
                        window.opener.vueapp.ssStore.setSsDataAction(undefined) 
                    } 
                    else {
                        ssStore.setSsDataAction(undefined) ;
                    }
                    next();
                }
                
            });
        }        
        else { 
            // Copy / edit 
            next(async (vm) => {
                await vm.getData() ;
                await vm.reflectEditMode4tab() ;
                next();
            });


        }
    

        
    },
});


</script>

<style scoped>
a[class="nav-link"]{
    color : white !important;
}
</style>
