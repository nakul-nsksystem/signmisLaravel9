<template>
    <div class="p-3 bg-app-secondaly">        
        <div class="row">
            <div class="col-12">
                <validation-provider name="納品情報の編集"  
                    vid="tProjectDelivery-dShowForm"
                    :rules="{ required: { allowFalse: false } }"
                    immediate v-slot="{ errors }">  
                    <span class="validation-error" v-show="errors.length > 0">納品情報の編集を完了してください</span>
                    <input class="d-none" v-model="cIsNotEditingDelivery" />                
                </validation-provider>
            </div>
            <div class="col-12">
                <validation-provider name="商品紐づけ"  
                    vid="tProjectDelivery-productLink"
                    :rules="{ required: { allowFalse: false } }"
                    immediate v-slot="{ errors }">  
                    <span class="validation-error" v-show="errors.length > 0">納品情報が紐づいていない商品があります</span>
                    <input class="d-none" v-model="cIsAllProductLinked" />                
                </validation-provider>
            </div>
            <div class="col-12">
                <validation-provider name="分納"  
                    vid="tProjectDelivery-particalProductLink"
                    :rules="{ required: { allowFalse: false } }"
                    immediate v-slot="{ errors }">  
                    <span class="validation-error" v-show="errors.length > 0">分納商品の整合性に問題があります</span>
                    <input class="d-none" v-model="cParticalDeliveryValid" />                
                </validation-provider>
            </div>
            <div class="col-12 col-xl-6 d-flex">
                <p class="text-warning my-auto">納期未設定商品：{{cUnlinkedProductNames}}</p>
            </div>
            <div class="col-12 col-xl-6 text-right mb-3">
                <button type="button" class="btn btn-primary" 
                    @click.prevent="addDelivery">
                    <i class="fas fa-plus fa-fw"></i>
                    新規追加
                </button>                      
            </div>        
        </div>
        <div class="table-responsive">
            <table class="table table-dark text-nowrap">
                <thead>
                    <tr>
                        <!-- <th scope="col">No.</th> -->
                        <th scope="col">拠点</th>
                        <th scope="col">納品形態<br>納品物名<br>個口数</th>
                        <th scope="col">商品</th>
                        <th scope="col">納期(出荷日)<br>着日</th>
                        <th scope="col">納品先名<br>納品先住所<br>TEL<br>納品先担当者</th>
                        <th scope="col">荷主名<br>荷主住所<br>TEL<br>荷主先担当者</th>
                        <th scope="col">施工担当者</th>
                        <th scope="col">送り状No.</th>
                        <th scope="col">備考</th>
                        <th scope="col" class="text-right">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(n,index) in value.t_project_deliveries" :key="index"
                        @click.prevent="selectDelivery(n)" 
                        :class="{ 'dark-selected':dSelectedDeliveryIndex === index}">
                        <template v-if="!n.deleted_at">
                            <td>{{cMBranchName(n.m_branch_id)}}</td>
                            <td>
                                <div :class="cTextColor(n.delivery_m_kv)">{{n.delivery_m_kv.kv_name}}</div>
                                <div>
                                    <m-tag-viewer
                                        class="mt-1"
                                        :tag-category-key="dTagCategoryKey"
                                        :selected="n.m_tags"
                                        v-show="n.m_tags"
                                        />
                                </div>
                                <div>
                                    <h5>
                                        <span v-show="n.is_night_work" class="badge badge-info">夜間</span>
                                        <span v-show="n.is_holiday_work" class="badge badge-danger">休日</span>
                                    </h5>                                    
                                </div>
                                <div>{{n.delivery_product_name}}</div>
                                <div class="text-right">{{n.num_of_boxes}}</div> 
                            </td>
                            <td>
                                <div v-for="product in n.t_project_products">
                                    {{product.name}}<span v-show="product.is_partical_delivery">({{product.t_project_delivery_product_link.qty}})</span>
                                </div>
                                <div v-for="_product in n._t_project_products">
                                    {{_product.name}}<span v-show="_product.is_partical_delivery">({{_product.t_project_delivery_product_link.qty}})</span>
                                </div>
                            </td>
                            <td v-if="n.delivery_m_kv.g_01 !=='construction'">
                                <div>
                                    {{dateFormat(n.delivery_at)}}&nbsp;&nbsp;{{n.delivery_time}}
                                </div>
                                <div>
                                    {{dateFormat(n.arrival_at)}}&nbsp;&nbsp;{{n.arrival_time}}
                                </div>
                            </td>
                            <td v-else>
                                <div>
                                    {{dateFormat(n.delivery_at)}}&nbsp;&nbsp;{{n.construction_start_time}}~{{n.construction_end_time}}
                                </div>
                            </td>
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
                                {{n.user_full_names}}
                            </td>
                            <td>
                                {{n.invoice_no}}
                            </td>
                            <td>
                                {{n.construction_belongings}}
                                {{n.memo}}
                            </td>
                            <td>
                                <div class="text-right" v-if="!cIsCompleted(n)">
                                    <button type="button" class="btn btn-info" @click.prevent.stop="openLinkProductModal(n)">
                                        <i class="fas fa-print fa-fw"></i>                            
                                    </button>
                                    <button type="button" class="btn btn-danger" v-if=" !cIsOrderd(n) " @click.prevent.stop="destroy(n)">
                                        <i class="fas fa-trash fa-fw"></i>                            
                                    </button>    
                                </div>
                            </td>
                        </template>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="dShowForm">
            <validation-observer v-slot="{ invalid }">
                <div class="row mt-2">                                    
                    <div class="col-12 col-xl-6">                                            
                        <div class="row">
                            <div class="col-12 col-xl-6" >
                                <validation-provider name="拠点" rules="required|excluded:0" immediate v-slot="{ errors }"> 

                                    <div class="form-group">
                                        <label >拠点</label>
                                        <m-branch-select
                                            v-model="cMBranchId"
                                            />
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </div>
                                </validation-provider>
                            </div>
                            <div class="col-12 col-xl-6" >
                                <validation-provider name="納品形態" rules="required|excluded:0" immediate v-slot="{ errors }"> 

                                    <div class="form-group">
                                        <label >納品形態</label>
                                        <m-kv-select                                                             
                                            v-model="cDeliveryMKvId"
                                            :selected-item.sync="cDeliveryMKv"
                                            :kv-key="'t_projects-delivery'"
                                            :g01="'delivery'"/>
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </div>
                                </validation-provider>
                            </div>


                            
                        </div>

                    </div>
                    <div class="col-12 col-xl-6">
                        <div class="row">
                            <div class="col-12 col-xl-3" >
                                <validation-provider name="納期(出荷日)" rules="required" immediate :vid="`tProjectDelivery${dRandom}`" v-slot="{ errors }">

                                    <div class="form-group">
                                        <label >納期(出荷日)</label>
                                        <ex-v-date-picker 
                                            v-model="cDeliveryAt" 
                                            :is-day-only="false"/>
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </div>
                                </validation-provider>
                            </div>

                            
                            <div class="col-12 col-xl-3">
                                <div class="form-group">
                                    <label >納期時刻</label>
                                    <input type="text" class="form-control" placeholder="" v-model="cDeliveryTime">
                                </div>
                            </div>
                            <div class="col-12 col-xl-3"  v-if='cIsShowByDepends("delivery_arrival")' >
                                <validation-provider name="着日" :rules="`required|custom_rule_date_or_later:tProjectDelivery${dRandom}`" immediate v-slot="{ errors }">

                                    <div class="form-group">
                                        <label >着日</label>
                                        <ex-v-date-picker 
                                            v-model="cArrivalAt"
                                            :is-day-only="false" />
                                        <span class="validation-error">{{ errors[0] }}</span>

                                    </div>
                                </validation-provider>
                                
                            </div>

                            
                            <div class="col-12 col-xl-3">
                                <div class="form-group" v-if='cIsShowByDepends("delivery_arrival")'>
                                    <label >着日時刻</label>
                                    <input type="text" class="form-control" placeholder="" v-model="cArrivalTime">
                                </div>
                            </div>
                        </div>
                    </div>
                    

                </div>


                <div class="row">                    
                    <div class="col-12 col-xl-3">
                        <div class="form-group">
                            <label >納品物</label>
                            <input type="text" class="form-control" placeholder="" v-model="cDeliveryProductName">
                        </div>
                    </div>
                    <div class="col-12 col-xl-2">
                        <div class="form-group">
                            <label >納品指定事項</label>
                            <m-tag-select 
                                :tag-category-key="dTagCategoryKey"
                                :setTagIds="cMTags"
                                v-model="dDeliveryTagIds"
                                />
                        </div>
                    </div>
                    <div class="col-12 col-xl-2"  v-if='cIsShowByDepends("delivery_num_of_boxes")' >
                        <validation-provider name="個口数" rules="min_value:0" immediate v-slot="{ errors }"> 

                            <div class="form-group">
                                <label >個口数</label>
                                <input type="number" class="form-control" placeholder="" v-model="cNumOfBoxes">
                            </div>
                            <span class="validation-error">{{ errors[0] }}</span>

                        </validation-provider>

                    </div>
                    <!-- <div class="col-12 col-xl-2"  v-if='cIsShowByDepends("delivery_completed_email")' >
                        <validation-provider name="発送完了メール" rules="email" immediate v-slot="{ errors }"> 

                            <div class="form-group">
                                <label >発送完了メール</label>
                                <input type="text" class="form-control" placeholder="" v-model="cShippingMailTo">
                            </div>
                            <span class="validation-error">{{ errors[0] }}</span>

                        </validation-provider>

                    </div> -->
                    <div class="col-12">
                        <div class="form-group">
                            <label >納品備考</label>
                            <input type="text" class="form-control" placeholder="" v-model="cMemo">
                        </div>
                    </div>
                </div>


                <div class="row">
                    <div class="col-12 col-xl-6">
                        <div id="deliveryToCard" class="card  bg-dark" v-if='cIsShowByDepends("delivery_to")' >
                            <delivery-info-component
                                ref="customerInfo"
                                v-model="dValue" 
                                :is-owner="false"
                                @openCustmerInputModal="openCustmerInputModal($event)"
                                @openReuseHistoryModal="openReuseHistoryModal($event)"
                                />
                        
                        </div>                                            
                    </div>

                    <div class="col-12 col-xl-6">
                        <div id="deliveryToCard" class="card bg-dark mt-3 mt-xl-0" v-if='cIsShowByDepends("delivery_owner")' >
                            <delivery-info-component
                                ref="ownerInfo"
                                v-model="dValue"
                                :is-owner="true"
                                @openCustmerInputModal="openCustmerInputModal($event)"
                                @openReuseHistoryModal="openReuseHistoryModal($event)"
                                />
                    
                        </div>
                        
                    </div>
                    
                    <div class="col-12 text-right ">
                        <button type="button" class="btn btn-success" @click.prevent="save" :disabled="invalid">
                            保存
                        </button>
                        <button type="button" class="btn btn-secondary" @click.prevent="clear" :disabled="cIsUncompleteData">
                            キャンセル
                        </button>
                    </div>
                </div>
            </validation-observer>
        </div>
        <div id="modalCustomerInputs"
            class="modal fade bd-example-modal-xl"
            tabindex="-1"
            role="dialog"
            aria-labelledby="modalCustomerInputs"
            aria-hidden="true"
            style="margin-top: 0px;"
            v-show="dShowCustomerInputsModal">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="app-contents-container text-right">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true" class="text-white">&times;</span>
                        </button>
                    </div>
                    <delivery-m-customer-inputs-component
                        ref="customerInputsModal"
                        v-model="dValue"
                        :param="dParam4Modal"
                        :editing-row="dEditingRow"
                        @setCustomerInfo="setCustomerInfo($event)"

                        />
                </div>

            </div>
        </div>
        <div id="modalReuseHistory"
            class="modal fade bd-example-modal-xl"
            tabindex="-1"
            role="dialog"
            aria-labelledby="modalReuseHistory"
            aria-hidden="true"
            style="margin-top: 0px;"
            v-show="dShowReuseHistoryModal">
            <div class="modal-dialog  modal-dialog-fluid">
                <div class="modal-content">
                    <div class="app-contents-container text-right">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true" class="text-white">&times;</span>
                        </button>
                    </div>
                    <reuse-delivery-history-table-component 
                        ref="reuseHistoryModal"
                        v-model="dValue"
                        :param="dParam4Modal"
                        @setHistory="setHistory($event)"
                        />
                </div>

            </div>
        </div>
        <t-delivery-product-link-modal
            v-model="value"
            :delivery-idx.sync="dIndex4LinkProduct"
            ref="tDeliveryProductLinkModal"
            />


    </div>
</template>

<script>

import DayJsEx from "./../../../frameworks/DayJsEx" ;
import ObjectUtil from '../../../frameworks/ObjectUtil';
import _ from "lodash" ;
import DynamicGetSetComputedMixins from '../../../mixins/commons/DynamicGetSetComputedMixins';
import { TProjectDelivery } from '../class/models/TProjectDelivery';
import DeliveryMCustomerInputsComponent from "./component/DeliveryMCustomerInputsComponent.vue";
import TDeliveryProductLinkModal from "./modal/TDeliveryProductLinkModal.vue";


export default {
    components: { DeliveryMCustomerInputsComponent, TDeliveryProductLinkModal },
    mixins : [DynamicGetSetComputedMixins] , 

    data :  function() {
        return {

            //編集中のt_project_deliveryのレコード
            dValue : undefined ,

            //vid識別用
            dRandom : 0 ,

            //選択中の納品情報
            dSelectedDeliveryIndex : -1 ,
            
            //商品リンクをするt_project_deliveryのレコード
            dIndex4LinkProduct : -1 ,

            //入力フォーム表示フラグ
            dShowForm : false ,
            //顧客情報入力モーダル
            dShowCustomerInputsModal : false ,
            //履歴再使用モーダル
            dShowReuseHistoryModal : false ,

            dTagCategoryKey : "t_project_deliveries_designation" ,
            dDeliveryTagIds : [] ,   
            
            
            dComputedGetSetDefs : [
                // 納品区分
                { key:'cDeliveryMKvId' ,propName:TProjectDelivery.DeliveryMKvId_PName } ,
                { key:'cDeliveryMKv' ,propName:TProjectDelivery.DeliveryMKv_PName } ,
                //拠点
                { key:'cMBranchId' ,propName:TProjectDelivery.MBranchId_PName } ,
                // 納品日(出荷日)
                { key:'cDeliveryAt' ,propName:TProjectDelivery.DeliveryAt_PName } ,
                // 納品時刻(出荷日)
                { key:'cDeliveryTime' ,propName:TProjectDelivery.DeliveryTime_PName } ,                
                // 着日
                { key:'cArrivalAt' ,propName:TProjectDelivery.ArrivalAt_PName } ,
                // 着日時刻
                { key:'cArrivalTime' ,propName:TProjectDelivery.ArrivalTime_PName } ,
                // 納品物名
                { key:'cDeliveryProductName' ,propName:TProjectDelivery.DeliveryProductName_PName } ,
                //tag
                { key:'cMTags' ,propName:TProjectDelivery.MTags_PName } ,
                // 個口数
                { key:'cNumOfBoxes' ,propName:TProjectDelivery.NumOfBoxes_PName } ,
                { key:'cShippingMailTo' ,propName:TProjectDelivery.ShippingMailTo_PName } ,
                // 備考
                { key:'cMemo' ,propName:TProjectDelivery.Memo_PName } ,
                { key:'cDeliveryMCustomer' ,propName:TProjectDelivery.DeliveryMCustomer_PName } ,
                { key:'cDeliveryOwnerMCustomer' ,propName:TProjectDelivery.DeliveryOwnerMCustomer_PName } ,

            ] , 

            dComputedGetDefs : [

            ] ,

            //モーダル描画用荷主フラグ
            dParam4Modal : {} ,
            //顧客情報編集を押したときの顧客情報行
            dEditingRow : {} ,

        } 
    } , 
    props : {
        // t_projectsのレコード
        value : {
            type : Object ,
        } ,

    } ,

    computed : {

        //納品形態色
        cTextColor : function() {
            return function(mKv){
                return mKv.g_09 ?? ""
            }
        } ,
        /**
         * 編集していないフラグ（Validation用)
         */
        cIsNotEditingDelivery : function() {
            return ! this.dShowForm ?? false ; 
        } , 

        /**
         * 不完全な納品情報　SSの時用キャンセルボタン制御
         */
        cIsUncompleteData : function() {
            
            let is = false ;
            
            if(this.$route.path == "/t_project/ss_order") {
                if(_.isEmpty(this.value.t_project_deliveries)) return is ;

                //納品区分が指定されていない
                if(_.isEmpty(this.value.t_project_deliveries[0].delivery_m_kv)) {
                    is = true ;
                    return is ;
                } ;
                //納期が指定されていない
                if(_.isNil(this.value.t_project_deliveries[0].delivery_at)) is = true ;
                
                //着日
                if(this.value.t_project_deliveries[0].delivery_m_kv.g_02 == '1') {
                    if(_.isNil(this.value.t_project_deliveries[0].arrival_at)) is = true ;
                }

                //納品情報
                if(this.value.t_project_deliveries[0].delivery_m_kv.g_04 == '1') {
                    if(_.isNil(this.value.t_project_deliveries[0].delivery_customer_name) || 
                       _.isNil(this.value.t_project_deliveries[0].delivery_customer_name)) is = true ;
                }

                //直送情報
                if(this.value.t_project_deliveries[0].delivery_m_kv.g_05 == '1') {
                    if(_.isNil(this.value.t_project_deliveries[0].delivery_owner_name) || 
                       _.isNil(this.value.t_project_deliveries[0].delivery_owner_address)) is = true ;
                }
                
            }
            return is ;
        },

        /**
         * 全ての商品が納品と紐づいているか（Validation用)
         * 受注日が入っていない場合はNo error
         */
        cIsAllProductLinked : function() {

            // return true ;    
            
            if(_.isNil(this.value.ordered_at)) return true ;

            let flg = 0 ;
            //商品カテゴリがデータ作成・施工・消耗品の場合は納品対象外
            const filterd = this.value.t_project_products.filter(x => x.m_product_category.is_delivery_needed && x.deleted_at == null) ;
            if(_.isEmpty(filterd) ) return true ;
            
            for(const product of filterd) {
                if(_.isEmpty(product.t_project_deliveries)) flg ++ ;
            }

            return flg == 0 ;
        } , 

        /**
         * 紐づいていない商品名リスト
         */
        cUnlinkedProductNames : function() {

            if( ! this.value?.t_project_products.length ) return "" ;

            const names = this.value.t_project_products.filter( 
                    e => e.t_project_deliveries.length === 0 
                    && e.deleted_at == null 
                    && e.m_product_category.is_delivery_needed
                ).map(x => x.name) ;

            return names.join(',');
            
        } ,
        
        //分納商品の数量整合性チェック
        cParticalDeliveryValid : function() {

            return true ;

            if(!this.value.t_project_products?.length || !this.value.t_project_deliveries?.length) return true ;

            let flg = 0 ;
            for(const product of this.value.t_project_products) {
                if(product.is_partical_delivery) {
                    const partNum = _.sumBy( product.t_project_deliveries , function(x) { return x.t_project_delivery_product_link.qty ?? 0 ; }) ;

                    if(partNum > product.qty) flg ++ ;
                }
            }

            return flg == 0 ;

        } ,

        //納品区分で表示区分切り替え
        cIsShowByDepends : function () 
        {   
            return function(name)
            {   

                if( name === undefined || this.cDeliveryMKv == undefined) return false ;

                //着日必要
                if( name === "delivery_arrival" ) return this.cDeliveryMKv.g_02 == "1" ;
                
                //発送完了メール        
                if( name === "delivery_completed_email" ) return this.cDeliveryMKv.g_03 == "1" ;
                
                //納品情報必要
                if( name === "delivery_to" ) return this.cDeliveryMKv.g_04 == "1" ;
                
                //荷主情報必要
                if( name === "delivery_owner" ) return this.cDeliveryMKv.g_05 == "1" ;

                //個口数
                if( name === "delivery_num_of_boxes" ) return this.cDeliveryMKv.g_06 == "1" ;


                return false ; 

            }
            
        },

        
        /**
         * 表示用の選択Index（Deleted_at考慮）
         */
        cSelectedDeliveryIndex4View : function() { 
            if ( this.dSelectedProductIndex === -1 ) return -1 ; 

            const item = this.value.t_project_deliveries[this.dSelectedProductIndex] ; 
            return this.cTProjectProducts.indexOf(item) ;             
        } , 
        
        /**物件クライアント担当者　納品顧客の担当者のデフォルトセットに使用 */
        cTProjectCustomerUser : function() {
            // return this.value.customer_user_name ?? "";            
            return this.value.customer_user_name ?? "";            
        } ,

        /**選択中のタグを紐づけできるように成型する */
        cSelectedTagRecords : function(){
            const result = [] ;
            if(!_.isEmpty(this.dDeliveryTagIds)) { 
                
                for(const x of this.dDeliveryTagIds) {

                    const mTags = {
                        id : x ,
                        t_project_delivery_m_tag : {
                            m_tag_id : x , 
                            // m_tag_link_id : this.dDeliveryRow.id ,
                            // m_tag_link_type : "App\\Models\\TProjectDelivery"
                        } 
                    }
                    
                    result.push(mTags) ;
                } 
            }
            return result ;
        } ,
        cMBranchName : function(){
            return function(branchId){
                if (this.mainStore.masters.MBranches.length == 0 || _.isNil(branchId)) return "" ;
                return this.mainStore.masters.MBranches.find(n => n.id === branchId).shortNameOrName;
            }
        } , 

        //完了しているか？
        cIsCompleted : function() {
            return function(tDelivery) {

                if(tDelivery.delivery_m_kv.g_01 === "construction"){
                    return tDelivery.t_project_construction_results.length > 0
                
                }  else {
                    return tDelivery.is_delivery_completed ;
                }

            }
        },

        //施工外注発注済か
        cIsOrderd : function() {
            return function(tDelivery) {

                let isOrderd = false
                if(tDelivery.delivery_m_kv.g_01 === "construction"){

                    for(const user of tDelivery.t_project_construction_users) {
                        if(!_.isEmpty(user.t_p_order_detail)) isOrderd = true
                    }
                
                }

                return isOrderd
            }
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
        dateFormat : function(value) {
            if(_.isNil(value)) return ""  ;
            return DayJsEx.format(value , "YYYY-MM-DD")
        } ,

        //新規追加
        addDelivery : function() {
            // this.clear() ;
            if(!this.value.m_customer) {
                alert("物件クライアント情報を入力してください") ;
                return ;
            }

            this.dRandom = Math.random() + "" ;

            const obj = {
                created_m_user_id : this.$$cLoginUserId ,
                delivery_m_customer : this.value.m_customer ,
                delivery_owner_m_customer : this.value.m_customer ,
                t_project : {
                    id : this.value.id ,
                    m_customer : this.value.m_customer ,
                    m_customer_id : this.value.m_customer_id ,
                    m_branch_id : this.value.m_branch_id ,
                    customer_user_name : this.value.customer_user_name ,
                }
            } ; 
            this.dValue = TProjectDelivery.parse(obj) ;

            this.dValue.SetMCustomerVal(this.value.m_customer ,this.cTProjectCustomerUser,"all") ;

            this.dShowForm = true ;
            this.dSelectedDeliveryIndex = -1 ;
        },

        //編集
        selectDelivery : function(row) {
            if(row.delivery_m_kv.g_01 === "construction") {
                alert("施工タブで編集してください")
                return ;
            }

            if(row.is_delivery_completed) {
                alert("納品済のため編集できません")
                return ;
            }

            // this.dValue = undefined ;
            const idx = this.value.t_project_deliveries.indexOf(row) ; 

            if ( this.dSelectedDeliveryIndex === idx ) return ; 

            //一度フォームの内容を破棄しないと納期着日の関係のバリデーション制御に不具合が起きる
            this.dShowForm = false ;
            this.dRandom = Math.random() + ""  ;

            this.dSelectedDeliveryIndex = idx ; 

            row.t_project.m_customer = this.value.m_customer ;

            this.dValue = TProjectDelivery.parse(row) ;

            this.dShowForm = true ; 

        },
        save : function() {
            // if(!confirm("現在表示されている情報を保存しますか？")) return ;
            this.dValue.m_tags = this.cSelectedTagRecords ;

            //表示されていないデータをリセットする
            if(!this.cIsShowByDepends('delivery_to')){
                //送り直送系ではないとき（引き取りなど）
                this.dValue.SetMCustomerVal({} , "" , "customer")

            }
            if(!this.cIsShowByDepends('delivery_owner')){
                //直送がないとき
                this.dValue.SetMCustomerVal({} , "" , "owner")

            }
            if(!this.cIsShowByDepends('delivery_num_of_boxes')){
                //個口数の指定が不要な時
                this.dValue.num_of_boxes = null ;
            }
            if(!this.cIsShowByDepends('delivery_completed_email')){
                //発送完了メールが不要な時
                this.dValue.shipping_mail_to = null ;
            }

            //編集か新規か
            if(this.dSelectedDeliveryIndex === -1) {
                
                //新規
                //新規商品の時紐づけ用のuidを設定する
                let deliveryUid = Math.floor(Math.random() * (1000 - 1)) + 1 ;
                while(this.value.ExistUids.indexOf(deliveryUid) !== -1) {
                    deliveryUid = Math.floor(Math.random() * (1000 - 1)) + 1 ;
                }                
                this.dValue.uid = deliveryUid ;

                this.value.t_project_deliveries.push(this.dValue) ;

            } else {
                //編集
                // const find = this.value.t_project_deliveries.find(x => x.id === this.dDeliveryRow.id) ;
                this.value.t_project_deliveries.splice(this.dSelectedDeliveryIndex, 1, this.dValue) ;

                //商品に紐づいた納品情報も更新 todo共通化
                for(const product of this.value.t_project_products) {
                    const updated = product.t_project_deliveries.find(e => e.id == this.dValue.id) ;
                    const updatedIdx = product.t_project_deliveries.indexOf(updated) ;
                    if(updatedIdx !== -1) {
                        product.t_project_deliveries[updatedIdx].delivery_at = this.dValue.delivery_at ;
                        product.t_project_deliveries[updatedIdx].delivery_time = this.dValue.delivery_time ;
                        product.t_project_deliveries[updatedIdx].delivery_m_kv_id = this.dValue.delivery_m_kv_id ;
                        product.t_project_deliveries[updatedIdx].delivery_m_kv = this.dValue.delivery_m_kv ;
                    }

                }
            }

            // if(this.dDeliveryRow.delivery_m_customer_id) this.saveMCustomer() ;
            
            this.clear() ;
            
        } ,
        destroy : function(row) {
            
            if(! confirm('削除してよろしいですか?')) return ; 
            const idx = this.value.t_project_deliveries.indexOf(row) ; 
            //DBにあるデータか
            if ( row.id === undefined ) {
                this.value.t_project_deliveries.splice(idx ,1) ;

                //商品に紐づいた納品情報も更新　todo共通化
                for(const product of this.value.t_project_products) {
                    const deleted = product.t_project_deliveries.find(e => e.uid == row.uid) ;
                    const deletedIdx = product.t_project_deliveries.indexOf(deleted) ;
                    if(deletedIdx !== -1) {
                        product.t_project_deliveries.splice(deletedIdx ,1) ;
                        
                    }
                }
            }
            else {

                this.$set(this.value.t_project_deliveries[idx] , "deleted_at" ,Date()) ;
                //商品に紐づいた納品情報も更新　todo共通化
                for(const product of this.value.t_project_products) {
                    const deleted = product.t_project_deliveries.find(e => e.id == row.id) ;
                    const deletedIdx = product.t_project_deliveries.indexOf(deleted) ;
                    if(deletedIdx !== -1) {
                        product.t_project_deliveries.splice(deletedIdx ,1) ;
                        
                    }

                }

                //this.value.t_project_mails.splice(idx ,1) ;
            }
            this.clear() ;

        } ,
        /**キャンセルボタン及び保存などの処理後に入力フォームの情報をリセットする */
        clear : function() {
            this.dValue = undefined ;
            this.dSelectedDeliveryIndex = -1 ;
            this.dShowForm = false ;
            this.dParam4Modal = {} ;
            this.dEditingRow = {}

        } , 

        //商品リンクモーダル
        openLinkProductModal : function(tDelivery) {
            this.dIndex4LinkProduct = this.value.t_project_deliveries.indexOf(tDelivery) ;
            if(this.dIndex4LinkProduct == -1) return ;
            
            this.$refs.tDeliveryProductLinkModal.open() ;
        } ,

        //顧客情報入力モーダル
        openCustmerInputModal : function(param) {
            this.dParam4Modal = param ;

            if(param.isEdit) {
                //マスタ編集ボタンを押したときの処理
                
                this.dEditingRow = param.isOwner ? this.dValue.delivery_owner_m_customer : this.dValue.delivery_m_customer ;
                
                //顧客マスタにない情報の場合編集できるようにデータコンバート
                
                if(!this.dEditingRow) {

                    this.dEditingRow = {
                        name : param.isOwner ? this.dValue.delivery_owner_name : this.dValue.delivery_customer_name ,
                        display_address : param.isOwner ? this.dValue.delivery_owner_address : this.dValue.delivery_customer_address ,
                        zip : param.isOwner ? this.dValue.delivery_owner_zip : this.dValue.delivery_customer_zip ,
                        tel : param.isOwner ? this.dValue.delivery_owner_tel : this.dValue.delivery_customer_tel ,
                        contact_person : param.isOwner ? this.dValue.delivery_owner_user : this.dValue.delivery_customer_user ,
                        m_branch_id : this.value.m_branch_id ,
                        created_m_user_id : this.$$cLoginUserId ,
                        dealing_m_kv_id : 1010008 ,
                    }
                } 
            
            } else {

                this.dEditingRow = {} ;

            }
            $('#modalCustomerInputs').modal() ;
            this.dShowCustomerInputsModal = true ;

        } ,
        //顧客情報モーダルの情報をt_project_deliveryにセットする
        setCustomerInfo :async function(mCustomer){
            const custmerOrOwner = this.dParam4Modal.isOwner ? "owner" : "customer" ;
            const refName = custmerOrOwner + "Info"
            await this.$refs[refName].reloadCustomerInput(custmerOrOwner)
            
            if(this.dParam4Modal.isOwner) {

                this.cDeliveryOwnerMCustomer = mCustomer
            
            } else {

                this.cDeliveryMCustomer = mCustomer

            }
            
            // this.dValue.SetMCustomerVal(mCustomer , this.cTProjectCustomerUser , custmerOrOwner) ;
            this.dEditingRow = {}

            $('#modalCustomerInputs').modal('hide') ;

        } ,
        //履歴再利用モーダル
        openReuseHistoryModal : function(param) {
            this.$refs.reuseHistoryModal.clear()

            this.dParam4Modal = param ;

            $('#modalReuseHistory').modal() ;
            this.dShowReuseHistoryModal = true ;

        } ,
        //履歴モーダルの情報をt_project_deliveryにセットする
        setHistory : function(tDelivery){
            // console.log(tDelivery) ;
            this.dValue.reuse_t_project_delivery_id = tDelivery.id ;

            if(this.dParam4Modal.isOwner) {
                //荷主
                this.dValue.delivery_owner_m_customer_id = null ;
                this.dValue.delivery_owner_name = tDelivery.delivery_owner_name ;
                this.dValue.delivery_owner_address = tDelivery.delivery_owner_address ;
                this.dValue.delivery_owner_zip = tDelivery.delivery_owner_zip ;
                this.dValue.delivery_owner_user = tDelivery.delivery_owner_user ;
                this.dValue.delivery_owner_tel = tDelivery.delivery_owner_tel ;
            
            } else {
                //納品先
                this.dValue.delivery_m_customer_id = null ;
                this.dValue.delivery_customer_name = tDelivery.delivery_customer_name ;
                this.dValue.delivery_customer_address = tDelivery.delivery_customer_address ;
                this.dValue.delivery_customer_zip = tDelivery.delivery_customer_zip ;
                this.dValue.delivery_customer_user = tDelivery.delivery_customer_user ;
                this.dValue.delivery_customer_tel = tDelivery.delivery_customer_tel ;

            }

            this.$refs.reuseHistoryModal.clear()
            $('#modalReuseHistory').modal('hide') ;

        } ,

    } ,

}
</script>
<style scoped>



</style>