<template>
    <div>
        <validation-observer v-slot="{ invalid }">
            
            <div class="row" >
                <div class="col-12">
                    <validation-provider name="納品形態" rules="required|excluded:0" immediate v-slot="{ errors }"> 
                        <div class="form-group">
                            <label >納品形態</label>
                            <m-kv-select                                                             
                                v-model="cDeliveryMKvId"
                                :selected-item.sync="cDeliveryMKv"
                                :kv-key="'t_projects-delivery'"
                                :g01="'construction'"/>
                            <span class="validation-error">{{ errors[0] }}</span>
                        </div>
                    </validation-provider>
                </div>
            </div>
            <div class="row" >
                <div class="col-12">
                    <validation-provider name="施工先" rules="required" immediate v-slot="{ errors }"> 
                        <div class="form-group">
                            <label >施工先</label>
                            <input v-model="cDeliveryCustomerName"
                                type="text" class="form-control" >
                            <span class="validation-error">{{ errors[0] }}</span>
                        </div>
                    </validation-provider>
                </div>
            </div>
            <div class="row">
                <div class="col-12 mb-3">
                    <label for="zip">〒郵便番号</label>
                    <div class="input-group">
                        <input class="form-control" id="zip" maxlength="8" pattern="\d{3}-?\d{4}" v-model="cDeliveryCustomerZip">
                        <button type="button" class="btn btn-success" :disabled="dLoading" @click.prevent="getZipInfo()">
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
                    <validation-provider name="施工先住所" rules="required" immediate v-slot="{ errors }"> 
                        <div class="form-group">
                            <label >施工先住所</label>
                            <input v-model="cDeliveryCustomerAddress"
                                type="text" class="form-control" >
                            <span class="validation-error">{{ errors[0] }}</span>
                        </div>
                    </validation-provider>
                </div>
            </div>
            
            <div class="row">
                <div class="col-12 col-xl-6">
                    <div class="form-group">
                        <label >施工先担当</label>
                        <input v-model="cDeliveryCustomerUser"
                            type="text" class="form-control" >
                    </div>

                </div>
                <div class="col-12 col-xl-6 pl-xl-0">
                    <div class="form-group">
                        <label >施工先担当TEL</label>
                        <input v-model="cDeliveryCustomerTel"
                            type="text" class="form-control" >
                    </div>

                </div>
            </div>

            <div class="row">
                <div class="col-12 col-xl-4">
                    <validation-provider name="施工日" rules="required" immediate v-slot="{ errors }">                             
                        <div class="form-group">
                            <label >施行日</label>                        
                            <ex-v-date-picker 
                                readonly
                                aria-readonly="true"
                                v-model="cSelectedDay" 
                                />
                            <span class="validation-error">{{ errors[0] }}</span>
                        </div>   
                    </validation-provider>             
                </div>
                <div class="col-12 col-xl-4">
                    <div class="form-group">
                        <label >施行完了日</label>                        
                        <ex-v-date-picker 
                            readonly
                            aria-readonly="true"
                            v-model="dSelectedDayUntil" />
                    </div>   
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-xl-4">
                    <validation-provider name="開始予定時刻" rules="required" immediate v-slot="{ errors }"> 
                        <div class="form-group">
                            <label >開始予定時刻</label>                        
                            <input v-model="cConstructionStartTime"
                                type="time" class="form-control" placeholder="">
                            <span class="validation-error">{{ errors[0] }}</span>
                        </div>                
                    </validation-provider>
                </div>
                
                <div class="col-12 col-xl-4 pl-xl-0">
                    <validation-provider name="終了予定時刻" rules="required" immediate v-slot="{ errors }"> 
                        <div class="form-group">
                            <label >終了予定時刻</label>                        
                            <input v-model="cConstructionEndTime"
                                type="time" class="form-control" placeholder="">
                            <span class="validation-error">{{ errors[0] }}</span>
                        </div>                
                    </validation-provider>
                </div>

            </div>     

            
            <div class="row">
                <div class="col-6 col-xl-3">
                    <div class="form-group">                            
                        <ns-checkbox-input                            
                                v-model="cIsNightWork"
                                :label="'夜間'"
                                :id="'TProjectConstructionsIsNightWork'"
                                />
                    </div>                

                </div>
                <div class="col-6 col-xl-3 pl-xl-0">
                    <div class="form-group">
                        <ns-checkbox-input
                                v-model="cIsHolidayWork"
                                :label="'休日'"
                                :id="'TProjectConstructionsIsHolidayWork'"
                                />
                    </div>                

                </div>
            </div>


            <validation-provider name="施工者"  
                        rules="required|excluded:0"
                        immediate v-slot="{ errors }">  
                        <span class="validation-error" v-show="errors.length > 0">施工担当者か外注先を入力してください</span>
                        <input class="d-none" v-model="cConstructionMembers" />

            </validation-provider>


            <div class="row pt-2">
            
                <div class="col-12" >
                    <div class="form-group">
                        <label >施行担当者</label> 
                        <!-- {{dSelectedBranchIds}}     
                        user {{cSelectedMUserIds}} -->
                        <m-user-multi-select
                            v-model="cSelectedMUserIds"
                            :default-is-selected="false"
                            :filter-m-branch-ids="selectedMBranchIds"
                            :filter-tag-keys="['m_users-role-construction']"                                
                            :set-ids="cSetUserIds"
                            />
                    </div>                       
                </div>               
            </div>

            <div class="row ">
                <div class="w-100 border-bottom mx-3 pb-2 mb-2">
                    <div class="row ">
                        <div class="col-6 col-xl-6 d-flex align-items-end">
                            <p class="h5 pb-0 mb-0">外注</p>
                        </div>
                        <div class="col-6 col-xl-6 d-flex">
                            <div class="ml-auto">
                                <button type="button" class="btn btn-primary" @click.prevent="addOutsource">
                                    <i class="fas fa-plus fa-fw"></i>
                                    追加
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            
            <div class="table-responsive">
                <table class="table table-striped table-dark">
                    <thead>
                        <th style="width:5%;min-width:50px;">&nbsp;</th>
                        <th style="width:30%;min-width:130px;">外注先</th>
                        <th style="width:10%;min-width:130px;">担当者</th>                                
                        <th style="width:10%;min-width:80px;">人数</th>
                        <th style="width:10%;min-width:120px;">単価</th>
                        <th class="text-right" style="width:10%;min-width:100px;">金額</th>
                        
                    </thead>
                    <tbody>
                        <tr v-for="n in cOutsources" >
                            <td>
                                <button type="button" class="btn btn-danger" 
                                    @click.prevent.stop="destroyOutsource(n)"
                                    >
                                    <i class="fas fa-trash fa-fw"></i>
                                </button>
                                
                            </td>
                            <td>
                                <validation-provider name="外注先" rules="required|excluded:0" immediate v-slot="{ errors }">
                                    <m-customer-select
                                        v-model="n.out_source_m_customer_id"
                                        :m-branch-ids="selectedMBranchIds"
                                        :dealing-cds="dOutsourceDealingCds"
                                        :selected-item.sync="n.out_source_m_customer"
                                        :filter-m-tag-keys='dFilterCustomerTagKeys'
                                        />
                                    <span class="validation-error mb-2">{{ errors[0] }}</span>
                                </validation-provider> 
                            </td>
                            <td>
                                <input                                        
                                    v-model="n.out_source_person_name"
                                    type="text" class="form-control">
                            </td>
                            <td>
                                <validation-provider name="人数" rules="required|min_value:1" immediate v-slot="{ errors }">
                                    <ns-number-input
                                        v-model="n.num_of_out_source_people"
                                        />
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </validation-provider>
                            </td>
                            <td>
                                <validation-provider name="単価" rules="min_value:0" immediate v-slot="{ errors }">
                                    <ns-number-input
                                        v-model="n.out_source_price"
                                        />
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </validation-provider>
                            </td>
                            <td class="text-right">
                                {{getOutsourceTotalPrice(n).toLocaleString()}}
                            </td>

                        </tr>

                    </tbody>
                </table>

            </div>

            <div class="row">
                <div class="col-12">
                    <div class="form-group">
                        <label >持ち物</label>
                        <textarea 
                            v-model="cConstructionBelongings"
                            class="form-control" rows="3"></textarea>
                    </div>

                </div>
                <div class="col-12">
                    <div class="form-group">
                        <label >施工備考</label>
                        <textarea 
                            v-model="cMemo"
                            class="form-control" rows="3"></textarea>
                    </div>

                </div>
            </div>
            <div class="row">
            
                <div class="col-6" >
                    <div class="form-group">
                        <button type="button" class="btn btn-success" @click.prevent="$emit('save',cTerms)" :disabled="invalid">
                            <i class="fas fa-save fa-fw"></i>
                            施工予定保存
                        </button>
                    </div>
                </div>
            </div>
        </validation-observer>    
    </div>

</template>

<script>
import NumberUtil from '../../../../frameworks/NumberUtil';
import ObjectUtil from '../../../../frameworks/ObjectUtil';
import DayJsEx from "../../../../frameworks/DayJsEx" ;
import DynamicGetSetComputedMixins from '../../../../mixins/commons/DynamicGetSetComputedMixins';

import _ from "lodash" ;

import { TProjectDelivery } from '../../class/models/TProjectDelivery';


export default {
    mixins : [DynamicGetSetComputedMixins] , 

    data :  function() {
        return {
            
            dLoading : false ,

            dOutsourceDealingCds :  [2] , 
            /**
             * customerセレクトタグフィルター用
             */
            dFilterCustomerTagKeys : ["m_customers-purchas_category_construction"] ,

            /**
             * カレンダー上で選択されている日
             */
            dSelectedDayUntil : undefined ,

            dComputedGetSetDefs : [
                // 納品区分
                { key:'cDeliveryMKvId' ,propName:TProjectDelivery.DeliveryMKvId_PName } ,
                { key:'cDeliveryMKv' ,propName:TProjectDelivery.DeliveryMKv_PName } ,
                // 納品日(出荷日)
                { key:'cDeliveryAt' ,propName:TProjectDelivery.DeliveryAt_PName } ,
                // 納品時刻(出荷日)
                { key:'cDeliveryTime' ,propName:TProjectDelivery.DeliveryTime_PName } ,                
                // 備考
                { key:'cMemo' ,propName:TProjectDelivery.Memo_PName } ,
                //持ち物
                { key:'cConstructionBelongings' ,propName:TProjectDelivery.ConstructionBelongings_PName } ,

                //夜間
                { key:'cIsNightWork' ,propName:TProjectDelivery.IsNightWork_PName } ,
                //休日
                { key:'cIsHolidayWork' ,propName:TProjectDelivery.IsHolidayWork_PName } ,
                //開始時間終了時間
                { key:'cConstructionStartTime' ,propName:TProjectDelivery.ConstructionStartTime_PName } ,
                { key:'cConstructionEndTime' ,propName:TProjectDelivery.ConstructionEndTime_PName } ,

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


                { key:'cOutsources' ,propName:TProjectDelivery.Outsources_PName } ,   
                { key:'cSelectedMUserIds' ,propName:TProjectDelivery.SelectedMUserIds_PName } ,  


            ] , 
            
            dComputedGetDefs : [
                // 初期値Userid配列
                { key:'cSetUserIds' ,propName:"SetUserIds" } ,   

            ] ,

        } 
    } , 
    props : {
        /**
         * t_project_deliveriesのレコード
         */
        value : {
            type : Object ,
        } ,
        selectedDay : {
            type : Date|String ,
        } ,
        selectedMBranchIds : {
            type : Array ,
        }
    } ,
    watch : {        
    } ,
    computed : {  
        cSelectedDay :{
            get : function(){
                return this.selectedDay
            },
            set : function(val){
                this.$emit('update:selectedDay',val)
                // this.dSelectedDayOnCalendar = val ;     
            }
        } ,
        
        //施工人員のバリデーション用
        cConstructionMembers : function() {
            const memberIds = [] ;
            memberIds.push(...this.cSelectedMUserIds) ;           

            for(const n of this.cOutsources) {
                const customerId = n.out_source_m_customer_id ;
                if(customerId) memberIds.push(customerId) ;
            }

            const result = memberIds.length ; 

            return  result ?? false ; 

        },
        //同日に作業のある人員
        cDuplicateUsers : function() {

            const _this = this ;
            let userIds = [] ;
            let list = ObjectUtil.deepCopyJ(this.value) ;
            list = list.filter(
                x => this.formattedDay(x.delivery_at) == this.formattedDay(this.cSelectedDay) 
                     && x.id !== this.value.id ) ;

            for(const x of list){
                for(const y of x.t_project_construction_users) {
                    userIds.push(y.m_user_id)
                }
            }

            userIds = userIds.filter((x) => this.cSelectedMUserIds.indexOf(x) != -1);

            const DuplicateUsers = [] ;

            for(const id of userIds) {
                const found = _this.mainStore.masters.MUsers.find(x => x.id == id) ;
                DuplicateUsers.push(found.full_name) ;                
            }
            
            return DuplicateUsers ;

        },
        //完了日までの日付配列
        cTerms : function () {

            const result = [] ;

            const start = new Date(this.formattedDay(this.cSelectedDay)) ?? new Date(this.cSelectedDay) ?? undefined ;
            const end = new Date(this.formattedDay(this.dSelectedDayUntil)) ;
            
            if(!start) return [] ;
            
            if(!this.dSelectedDayUntil) return [this.formattedDay(start)] ;

            for(const i = start; i <= end; i.setDate(i.getDate()+1)){                    
                result.push(this.formattedDay(i)) ;
            } ;
            
            return result ;

        } ,


    } ,
    methods : {
        
        getValue : function(colName ) { 
            return this.$$getValue("value" , colName) ; 
        } ,

        setValue : function(colName , val) { 
            this.$$setValue("value" , colName , val  ) ;
        } ,

        /**
         * 外注の追加
         */
        addOutsource : function() {
            this.cOutsources.push({
                num_of_out_source_people : 1 , 
            }) ; 
        } ,
        /**
         * 外注の削除
         */
        destroyOutsource : function(n) {

            if(! confirm('削除してよろしいですか?')) return ; 

            //console.log(row) ; 
            const idx = this.cOutsources.indexOf(n) ; 
            if ( idx !== -1){
                this.cOutsources.splice(idx ,1) ;
            }

        } , 

        /**
         * 外注の金額計算
         */
        getOutsourceTotalPrice : function(n) {

            let val = 0 ; 
            if ( n.num_of_out_source_people !== undefined && n.out_source_price !== undefined){
                val = NumberUtil.ceil(n.num_of_out_source_people * n.out_source_price) ; 
            }

            n.out_source_total_price = val ; 
            return n.out_source_total_price ; 
            
        } , 

        getZipInfo : async function () {
            
            this.dLoading = true ;

            try {
                
                const address = await this.value.getZipInfo(this.cDeliveryCustomerZip) ;                
                this.cDeliveryCustomerAddress = address

            } catch (error) {

                this.$$errorConsole(error) ; 
                
            } finally {

                this.dLoading = false ;

            }

        }  ,

        formattedDay : function(day ) {
            const dayAt = DayJs(day).format("YYYY-MM-DD") ;
            return dayAt ; 
        } , 


    } ,

}
</script>
<style scoped>



</style>