<template>
    <div v-if="cIsShow">
        <div class="row">
            <div class="col">
                <div v-if="$$cIsError" class="alert alert-danger" role="alert">
                    {{ dErrorData.message }}
                </div>

                <div v-if="dIsSaveSuccess" class="alert alert-success" role="alert">
                    保存に成功しました
                </div>
            </div>
        </div>

        <validation-observer v-slot="{ invalid }" >
            <div class="row">
                <div class="col-12 col-xl-4">

                    <div class="form-group">
                        <label>コード：</label>
                        <span>{{ dRow.cd }}</span>
                    </div>

                    <div class="form-group">
                        <label>名称：</label>
                        <span>{{ dRow.name }}</span>
                    </div>

                    <div class="form-group">
                        <label>カナ：</label>
                        <span>{{ dRow.kana }}</span>
                    </div>

                    <div class="form-group">
                        <label>拠点：</label>
                        <span>{{ dRow.m_branch.short_name }} <br></span>
                    </div>

                    <div class="form-group">
                        <label>自社担当者：</label>
                        <span>{{ cDisplaySalesMUserFullName }} <br></span>
                    </div>

                    <div class="form-group">
                        <label>備考：</label>
                        <span>{{ dRow.memo }}<br></span>
                    </div>

                    <div class="form-group">
                        <label>郵便番号：</label>
                        <span>〒{{ dRow.zip }}</span>
                    </div>

                    <div class="form-group">
                        <label>住所：</label>
                        <span>{{ cDisplayAddress }}</span>
                    </div>

                    <div class="form-group">
                        <label>電話番号：</label>
                        <span>{{ dRow.tel }}</span>
                    </div>

                    <div class="form-group">
                        <label>取引区分：</label>
                        <span>{{ dRow.dealing_m_kv === null  ? "" : dRow.dealing_m_kv.kv_name }}<br></span>
                    </div>
                </div>
                <div class="col-12 col-xl-8">                    
                    <div class="row">
                        <div class="col-12">
                            <m-customer-info-table 
                                v-model="dTempInfos"
                                :is-editable="true"
                                :customer-sales-m-user-id="cSalesMUserId"
                                :is-saving="dIsSaving"
                                @save="save"
                            />

                        </div>
                    </div>
                    
                </div>
            </div>
        </validation-observer>
        <button type="submit" class="btn btn-light" @click.prevent="historyBack()">戻る</button>
    </div>
</template>

<script>
import PageMixins from '@mixins/commons/PageMixins' ;
import ObjectUtil from '../../../frameworks/ObjectUtil';
import NumberUtil from '../../../frameworks/NumberUtil';
import {MCustomerService} from '../class/services/MCustomerService'
import ArrayUtil from '../../../frameworks/ArrayUtil';
import { MCustomerInfo } from '../class/models/MCustomerInfo';

export default {
    mixins : [PageMixins] , 
    data : function () {
        return {            
            dApiName : "mCustomer" ,
            dRow : {
            } ,
            dTempInfos : [] ,
            // 保存成功
            dIsSaveSuccess : false ,
            // 保存中
            dIsSaving : false ,

        }
    } ,
    computed : {
        
        cIsShow : function () {
            return this.cIsNew || this.dRow.id > 0 ;
        } ,
        cDisplayAddress : function() {
            // 住所
            return (this.dRow.address1 ?? '') + ' ' + (this.dRow.address2 ?? '') ; 
        } ,
        cSalesMUserId : function() { 
            return this.dRow?.sales_m_user_id ?? 0 ; 
        } ,         
        cDisplaySalesMUserFullName : function() {
            // 最終更新者
            return this.dRow?.sales_m_user?.full_name ; 
        } ,
    } ,
    methods : {
        getData : async function () {
            try {
                this.dRow = await MCustomerService.getById(this.$route.params.id) ; 
                
                this.dTempInfos = ObjectUtil.deepCopyJ(this.dRow.m_customer_infos) ; 
                this.dTempInfos = this.dTempInfos.map(x => MCustomerInfo.parse(x)) ; 
            } catch (error) {
                // handle error
                this.$$errorConsole(error, error.ep) ;
            }
        } ,
        save : async function() { 

            const mapped = this.dTempInfos.map(x => {
                x.updated_m_user_id = this.$$cLoginUserId ; 
                return x ; 
            }) ;

            this.dIsSaveSuccess = false ; 
            this.dIsSaving = true ; 

            this.dRow.m_customer_infos.splice(0) ; 
            this.dRow.m_customer_infos.push(...mapped) ; 
            
            try {
                
                this.dRow = await MCustomerService.save(this.dRow) ; 
                const copied = ObjectUtil.deepCopyJ(this.dRow.m_customer_infos)  ; 
                const parsed = copied.map(x => MCustomerInfo.parse(x)) ; 
                ArrayUtil.resetInsert(this.dTempInfos , parsed ) ; 

                this.dIsSaveSuccess = true ; 

            } catch (error) {
                // handle error
                this.$$errorConsole(error, error.ep) ;
                
            }
            finally { 
                this.dIsSaving = false ; 
            }
            


        } ,                
        historyBack : function () {
            // 検索画面へ戻る
            // this.$router.push({ name : Inflector.underscore(this.dApiName) }) ;
            this.$router.push({ name : "m_customer_info" }) ;
        } ,
    } ,
    created : function () {
        if (!this.cIsNew) this.getData() ;
    } ,
}
</script>