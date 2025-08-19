<template>
    <div>
        <div class="app-contents-container">
            <div class="row">
                <div class="col-12">
                    <div class="form-group">
                        <label >{{cCustOrOwner}}名</label>{{cSetDefaultVal  }}
                        <m-customer-ref-input
                            v-model="dMCustomerSelectedId"
                            :mBranchId="cTProjectBranchId"
                            :selected-item.sync="dMCustomerItem"
                            :dealing-cds="[1,8]"
                            v-if="!param.isNew"
                            />
                        <input type="text" class="form-control" placeholder="" v-model="dMCustomerItem.name" :disabled="!cIsEbleToEditInfo" v-else>
                        
                    </div>
                </div>

            </div>
            <div class="mb-3" v-show="!cIsSameClient">
                <ns-checkbox-input
                    v-model="dSaveMCustomerFlg"
                    id="saveMCustomerFlg"
                    :label="'【'+cTProjectCustomerName+'】の'+cCustOrOwner+'として登録する'"
                    />
            </div>
            <p v-show="!cIsEbleToEditInfo" class="text-danger">取引先区分が売のため編集できません</p>
            <div class="form-group mb-3">
                <label>〒：</label>
                <div class="input-group">
                    <input class="form-control" id="zip" maxlength="8" pattern="\d{3}-?\d{4}" v-model="dMCustomerItem.zip" :disabled="!cIsEbleToEditInfo">
                    <button type="button" class="btn btn-success" :disabled="dLoading ||! cIsEbleToEditInfo" @click.prevent="getZipInfo()">
                        <div v-if="dLoading">
                            <span class="spinner-border spinner-border-sm" role="status" />
                        </div>
                        <div v-else>
                            <i class="fas fa-search fa-fw" />
                        </div>
                    </button>
                </div>
                
            </div>
            <div class="form-group mb-3">
                <label>住所：</label>
                <input type="text" class="form-control" placeholder="" v-model="dMCustomerItem.display_address" :disabled="!cIsEbleToEditInfo">

            </div>
            <!-- <div class="mb-3">
                <label class="mb-0">担当者名：</label>
                <input type="text" class="form-control" placeholder="" v-model="dMCustomerItem.contact_person" :disabled="!cIsEbleToEditInfo">
            </div> -->
            <div class="mb-3">
                <label class="mb-0">TEL：</label>
                <input type="text" class="form-control" placeholder="" v-model="dMCustomerItem.tel" :disabled="!cIsEbleToEditInfo">
            </div>
            <div class="row">

                <div class="col-12 mt-3 text-right" >
                    <button type="button" class="btn btn-success" @click.prevent="saveMCustomer">決定</button>

                </div>
            </div>
        </div>
        
    </div>
    
    
</template>

<script>

import ObjectUtil from '../../../../frameworks/ObjectUtil';
import DeliveryMCustomerSelect from '../../../commons/master/DeliveryMCustomerSelect.vue';
import { MCustomer } from "../../../masters/class/models/MCustomer";
import { TProjectDelivery } from '../../class/models/TProjectDelivery';
import _, { add } from "lodash" ;

export default {
  components: { DeliveryMCustomerSelect },

    data :  function() {
        return {
            //登録フラグ
            dSaveMCustomerFlg : false ,

            dMCustomerSelectedId : undefined,
            dMCustomerItem : {} ,
            dLoading : false ,

        }
    } ,
    props : {
        // t_project_deliveriesのレコード
        value : {
            type : Object ,
        } ,

        //納品先か荷主か
        param : {
            type : Object ,
        } ,
        editingRow : {
            type : Object ,
        } ,
        
        

    } ,

    computed : {
        //納品先or荷主　描画用
        cCustOrOwner : function() {
            return this.param.isOwner ? "荷主" : "納品先" ;
        } ,
        
        //検索した取引先の区分が売の場合マスタ情報を更新及び住所等の打ち変えが不可
        cIsEbleToEditInfo : function(){
            if(this.dMCustomerItem === undefined) return true ;

            return this.dMCustomerItem.dealing_m_kv_id !== 1010001

        } ,
        //物件クライアントと同じか
        cIsSameClient : function(){

            if(this.dMCustomerItem.id === undefined || this.value === undefined) return false ;
            return this.value.tProjectCustomerId === this.dMCustomerItem.id ;

        } ,

        //初期値のセット
        cSetDefaultVal : function() {
            if(this.value === undefined) return "" ;
            if(this.param.isEdit) {
                
                // this.dMCustomerItem = MCustomer.parse(this.editingRow) ;
                this.dMCustomerItem = this.editingRow ;
            
            } else {
                const obj = {
                    created_m_user_id : this.$$cLoginUserId ,
                    m_branch_id : this.value.tProjectBranchId ,

                } ;

                this.dMCustomerItem = MCustomer.parse(obj) ;
            }
            return "" ;
        } , 

        cTProjectBranchId : function(){

            if(this.value === undefined) return 0 ;

            return this.value.tProjectBranchId ;

        } ,

        cTProjectCustomerName : function() {

            if(this.value === undefined) return "" ;
            return this.value.tProjectCustomerName ;

        }



    } ,
    methods : {
        //郵便番号から住所取得
        getZipInfo : async function () {
            this.dLoading = true ;

            try {
                
                const address = await this.value.getZipInfo(this.dMCustomerItem.zip) ;
                this.dMCustomerItem.display_address = address ;

            } catch (error) {

                this.$$errorConsole(error) ; 
                
            } finally {

                this.dLoading = false ;

            }

        } ,

        //顧客紐づけ
        saveMCustomer : async function(){
            
            const mCustomerRow = _.cloneDeep(this.dMCustomerItem) ;

            if(this.cIsSameClient) {
                
                this.dMCustomerItem = {} ;
                this.dSaveMCustomerFlg = false ;
                this.$emit('setCustomerInfo',mCustomerRow) ;
                
                return ;
            }
            
            if(this.cIsEbleToEditInfo) {
                mCustomerRow.address1 = mCustomerRow.display_address ;
            }

            if(this.dSaveMCustomerFlg) {

                mCustomerRow.m_delivery_destinations = {

                    m_customer_id                      : this.value.tProjectCustomerId ,
                    delivery_destination_m_customer_id : mCustomerRow.id ,
                    is_owner                           : this.param.isOwner ,
                    created_m_user_id                  : this.$$cLoginUserId ,
                    updated_m_user_id                  : this.$$cLoginUserId ,

                } ;

                // console.log(mCustomerRow)
                // const customerName = mCustomerRow.delivery_customer_name ?? mCustomerRow.name ;
                if(! confirm(mCustomerRow.name+'を'+this.cCustOrOwner+'として登録しますか?')) return ;

            } 

            if(this.param.isEdit || this.dSaveMCustomerFlg) {

                let ep = `api/mCustomer` ;
                let res ;
                try {

                    if( mCustomerRow.id ) {

                        ep += `/${mCustomerRow.id}` ;
                        mCustomerRow.updated_m_user_id = this.$$cLoginUserId ;
                        res = await axios.put(ep, mCustomerRow) ;
                        
                        this.dMCustomerItem = {} ;
                        this.dSaveMCustomerFlg = false ;
                        this.$emit('setCustomerInfo',res.data) ;

                    } else {
                        mCustomerRow.dealing_m_kv_id = 1010008 ;
                        mCustomerRow.sales_m_user_id = this.$$cLoginUserId ;
                        res = await axios.post(ep, mCustomerRow) ;
                        
                        this.dMCustomerItem = {} ;
                        this.dSaveMCustomerFlg = false ;
                        this.$emit('setCustomerInfo',res.data) ;

                    }

                } catch (error) {
                    // handle error
                    this.$$errorConsole(error, this.cEndpoint) ;
                }
            
            } else {

                this.dMCustomerItem = {} ;
                this.dSaveMCustomerFlg = false ;
                this.$emit('setCustomerInfo',mCustomerRow) ;

            }


        } ,

    } ,

}
</script>
<style scoped>



</style>