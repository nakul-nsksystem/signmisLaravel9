<template>

    <div>
        <div class="card-header d-flex" :class="cTextClass">
            <span class="mt-auto mb-auto">{{cCustOrOwner}}</span>
            <div class="ml-auto">
                <button type="button" class="btn btn-secondary" @click.prevent="openCusModal(false,false)">マスタ検索</button>
                <button type="button" class="btn btn-secondary" @click.prevent="openCusModal(true,false)">新規{{cCustOrOwner}}</button>
                <button type="button" class="btn btn-secondary" @click.prevent="openCusModal(true,true)">マスタ編集</button>
                <button type="button" class="btn btn-secondary" @click.prevent="openReuseModal()">履歴検索</button>
            </div>
        </div>
        
        <div class="card-body">
            <div class="row mt-2">
                <div class="col-12">
                    <validation-provider :name="cCustOrOwner" rules="required|excluded:0" immediate v-slot="{ errors }">
                        <div class="form-group" v-if="cIsInputCustmerName">
                            <label >{{cCustOrOwner}}名</label>
                            <input v-if="!isOwner" type="text" class="form-control" placeholder="" v-model="cDeliveryCustomerName" :disabled="cIsEbleToEditCustmerInfo">
                            <input v-else type="text" class="form-control" placeholder="" v-model="cDeliveryOwnerName" :disabled="cIsEbleToEditCustmerInfo">
                            <span class="validation-error">{{ errors[0] }}</span>
                        </div>
                        <div class="form-group" v-else-if="cIsNotLinkCustomer">
                            <label >{{cCustOrOwner}}名</label>
                            <input v-if="!isOwner" type="text" class="form-control" placeholder="" v-model="cDeliveryCustomerName" disabled>
                            <input v-else type="text" class="form-control" placeholder="" v-model="cDeliveryOwnerName" disabled>
                            <span class="validation-error">{{ errors[0] }}</span>
                        </div>
                        <div class="form-group" v-else>
                            <label class="mb-0">クライアントまたは紐づけされた{{cCustOrOwner}}：</label>
                            <delivery-m-customer-select
                                ref="customerSelect"
                                v-if="!isOwner"
                                v-model="cDeliveryMCustomerId"
                                :m-customer-id="value.tProjectCustomerId"
                                :selected-item.sync="cDeliveryMCustomer"
                                :is-owner="isOwner"
                                :searchedIds.sync="dSearchedIds"
                                />
                            <delivery-m-customer-select
                                ref="ownerSelect"
                                v-else
                                v-model="cDeliveryOwnerMCustomerId"
                                :m-customer-id="value.tProjectCustomerId"
                                :selected-item.sync="cDeliveryOwnerMCustomer"
                                :is-owner="isOwner"
                                :searchedIds.sync="dSearchedIds2"

                                />
                            <span class="validation-error">{{ errors[0] }}</span>
                            
                        </div>
                    </validation-provider>
                </div>
                <div class="col-12 mb-5" v-show="!cIsEbleToEditCustmerInfo">
                    <ns-checkbox-input
                        v-model="cIsReuse"
                        :id="'isReuseFlg'+ isOwner"
                        :label="'履歴として再度使う'"
                        />
                </div>
            </div>
            
            <div class="row">
                <div class="col-12 col-xl-6 mb-3">
                    <label for="zip">〒郵便番号</label>
                    <div class="input-group">
                        <input v-if="!isOwner" class="form-control" id="zip" maxlength="8" pattern="\d{3}-?\d{4}" v-model="cDeliveryCustomerZip" :disabled="cIsInputCustmerName">
                        <input v-else class="form-control" id="zip" maxlength="8" pattern="\d{3}-?\d{4}" v-model="cDeliveryOwnerZip" :disabled="cIsInputCustmerName">
                        <button type="button" class="btn btn-success" :disabled="dLoading || cIsInputCustmerName" @click.prevent="getZipInfo()">
                            <div v-if="dLoading">
                                <span class="spinner-border spinner-border-sm" role="status" />
                            </div>
                            <div v-else>
                                <i class="fas fa-search fa-fw" />
                            </div>
                        </button>

                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <validation-provider name="住所" rules="required" immediate v-slot="{ errors }">
                        <div class="form-group">
                            <label >住所</label>
                            <input v-if="!isOwner" type="text" class="form-control" placeholder="" v-model="cDeliveryCustomerAddress" :disabled="cIsInputCustmerName">
                            <input v-else type="text" class="form-control" placeholder="" v-model="cDeliveryOwnerAddress" :disabled="cIsInputCustmerName">
                            <span class="validation-error">{{ errors[0] }}</span>
                        </div>
                    </validation-provider>
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-xl-6">                    
                    <div class="form-group">
                        <label >担当者</label>
                        <input v-if="!isOwner" type="text" class="form-control" placeholder="" v-model="cDeliveryCustomerUser">
                        <input v-else type="text" class="form-control" placeholder="" v-model="cDeliveryOwnerUser">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-xl-6 mb-3">                    
                    <div class="form-group">
                        <label >TEL</label>
                        <input v-if="!isOwner" type="tel" class="form-control" placeholder="" v-model="cDeliveryCustomerTel">
                        <input v-else type="tel" class="form-control" placeholder="" v-model="cDeliveryOwnerTel">
                    </div>
                </div>
            </div>

        </div>


    </div>

</template>

<script>

import DayJsEx from "../../../../frameworks/DayJsEx" ;
import ObjectUtil from '../../../../frameworks/ObjectUtil';
import DynamicGetSetComputedMixins from '../../../../mixins/commons/DynamicGetSetComputedMixins';
import { TProjectDelivery } from '../../class/models/TProjectDelivery';

export default {
    mixins : [DynamicGetSetComputedMixins] , 

    data :  function() {
        return {
            //登録フラグ

            dLoading : false ,


            dComputedGetSetDefs : [
                // 履歴として残すフラグ
                { key:'cIsReuse' ,propName:TProjectDelivery.IsReuse_PName } ,
                // 納品先顧客Id
                { key:'cDeliveryMCustomerId' ,propName:TProjectDelivery.DeliveryMCustomerId_PName } ,
                { key:'cDeliveryMCustomer' ,propName:TProjectDelivery.DeliveryMCustomer_PName } ,
                // 納品先名
                { key:'cDeliveryCustomerName' ,propName:TProjectDelivery.DeliveryCustomerName_PName } ,
                // 納品先住所
                { key:'cDeliveryCustomerAddress' ,propName:TProjectDelivery.DeliveryCustomerAddress_PName } ,
                // 納品先郵便番号
                { key:'cDeliveryCustomerZip' ,propName:TProjectDelivery.DeliveryCustomerZip_PName } ,
                // 納品先担当者
                { key:'cDeliveryCustomerUser' ,propName:TProjectDelivery.DeliveryCustomerUser_PName } ,
                // 納品先電話
                { key:'cDeliveryCustomerTel' ,propName:TProjectDelivery.DeliveryCustomerTel_PName } ,

                // 荷主顧客Id
                { key:'cDeliveryOwnerMCustomerId' ,propName:TProjectDelivery.DeliveryOwnerMCustomerId_PName } ,
                { key:'cDeliveryOwnerMCustomer' ,propName:TProjectDelivery.DeliveryOwnerMCustomer_PName } ,

                // 荷主名
                { key:'cDeliveryOwnerName' ,propName:TProjectDelivery.DeliveryOwnerName_PName } ,
                // 荷主住所
                { key:'cDeliveryOwnerAddress' ,propName:TProjectDelivery.DeliveryOwnerAddress_PName } ,
                // 荷主郵便番号
                { key:'cDeliveryOwnerZip' ,propName:TProjectDelivery.DeliveryOwnerZip_PName } ,
                // 荷主担当者
                { key:'cDeliveryOwnerUser' ,propName:TProjectDelivery.DeliveryOwnerUser_PName } ,
                // 荷主電話
                { key:'cDeliveryOwnerTel' ,propName:TProjectDelivery.DeliveryOwnerTel_PName } ,


            ] , 

            dComputedGetDefs : [

            ] ,

            dSearchedIds : [] ,
            dSearchedIds2 : [] ,


        }
    } ,
    props : {
        // t_project_deliveriesのレコード
        value : {
            type : Object ,
        } ,

        //納品先か荷主か
        isOwner : {
            type : Boolean ,
        } ,


    } ,

    computed : {

        //納品先or荷主　描画用
        cCustOrOwner : function() {
            return this.isOwner ? "荷主" : "納品先" ;
        } ,

        //納品先or荷主　描画用
        cTextClass : function() {
            return this.isOwner ? "text-warning" : "text-success"  ;
        } ,

        //納品先or荷主　Id
        cCustmerIdColName : function(){
            return this.isOwner ? "delivery_owner_m_customer_id" : "delivery_m_customer_id"
        } ,
        cIsInputCustmerName : function(){
            return this.value[this.cCustmerIdColName] === null ;
        } ,
        cIsNotLinkCustomer : function() {
            if(this.cIsEbleToEditCustmerInfo) return false ;
            const id = this.value[this.cCustmerIdColName] ;
            const ids = this.isOwner ? this.dSearchedIds2 : this.dSearchedIds ;
            return ids.indexOf(id) == -1 ;
        } ,

        //顧客情報編集可能フラグ(物件のクライアントと一致)        
        cIsEbleToEditCustmerInfo : function(){

            return this.value.tProjectCustomerId === this.value[this.cCustmerIdColName] ;

        } ,

    } ,
    methods : {
        getValue : function(colName )  
        {            
            return this.$$getValue("value" , colName) ; 
        } ,
        setValue : function(colName , val){  

            this.$$setValue("value" , colName , val  ) ;

        } ,
        getZipInfo : async function () {
            
            this.dLoading = true ;

            const zip = this.isOwner ? this.cDeliveryOwnerZip : this.cDeliveryCustomerZip ;

            try {
                
                const address = await this.value.getZipInfo(zip) ;
                
                if(this.isOwner) {

                    this.cDeliveryOwnerAddress = address
                
                } else {

                    this.cDeliveryCustomerAddress = address

                }


            } catch (error) {

                this.$$errorConsole(error) ; 
                
            } finally {

                this.dLoading = false ;

            }


        }  , 
        reloadCustomerInput : function(custmerOrOwner) {
            const refName = custmerOrOwner + "Select" ;
            if(!this.$refs[refName]) return ;
            this.$refs[refName].getList() ; 

        } ,
        openCusModal : function(isNew,isEdit) {
            const param = {
                isNew : isNew ,
                isOwner : this.isOwner ,
                isEdit : isEdit 
            }
            this.$emit('openCustmerInputModal',param)
        } ,
        openReuseModal : function() {
            const param = {
                isOwner : this.isOwner ,
            }
            this.$emit('openReuseHistoryModal',param)
        } ,

    } ,

}
</script>
<style scoped>



</style>