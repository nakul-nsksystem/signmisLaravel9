<template>
    <div class="p-3 bg-app-secondaly">
        <div class="row">
            <div class="col-12 col-xl-6">
                <div id="constructionCard" class="card bg-dark" >
                    <div class="card-header d-flex text-success">
                        施工カレンダー
                        
                        <div class="ml-auto"> 
                                                                               
                            <button type="button" class="btn btn-primary" @click.prevent="add" :disabled="cIsEditing">
                                <i class="fas fa-plus fa-fw"></i>
                                追加
                            </button>
                        </div>
                        
                    </div>
                    <div class="col-12">
                        <validation-provider name="施工情報の編集"  
                            vid="tProjectConstruction-cIsEditing"
                            :rules="{ required: { allowFalse: false } }"
                            immediate v-slot="{ errors }">  
                            <span class="validation-error" v-show="errors.length > 0">施工情報の編集を完了してください</span>
                            <input class="d-none" v-model="cIsNotEditingConstruction" />
                        </validation-provider>
                    </div>
                    
                    
                    <construction-calendar
                        class="m-3"
                        :set-m-branch-ids="[value.m_branch_id]"
                        :value.sync="dSelectedDayOnCalendar" 
                        :selected-m-branch-ids.sync="dSelectedBranchIds"       
                        :set-t-project-constructions="cTProjectConstuctions"
                        />
                                            
                    <div class="row">
                        <div class="col-12">
                            <span class="ml-3">施工予定</span>
                            <div class="table-responsive">

                                <table class="table mt-2 text-white table-striped table-dark table-hover">
                                    <tbody>
                                        <tr v-for="(n ,index ) in cValidConstructions" 
                                            @click.prevent="selectRow(n)"
                                            :class="cSelectedTr(index)"
                                            >
                                            <td style="width:10%;min-width:100px;" scope="row">
                                                {{formattedDay(n.delivery_at )}}<br />
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
                                            <td style="width:10%;min-width:130px;">   
                                                <div class="mb-2">
                                                    <button type="button" 
                                                        class="btn btn-success"
                                                        @click.prevent.stop="editResult(n)"
                                                        :disabled="cIsEditing"                                                    
                                                        >
                                                        <i class="fas fa-calendar-check fa-fw"></i>
                                                        
                                                    </button>
                                                </div>                     
                                                <div>
                                                    <button type="button" 
                                                        class="btn btn-info mr-2"
                                                        @click.prevent.stop="copy(n)"
                                                        :disabled="cIsEditing"
                                                        >
                                                        <i class="fas fa-copy fa-fw"></i>
                                                        
                                                    </button>                                 
                                                    <button type="button" 
                                                        class="btn btn-danger"
                                                        @click.prevent.stop="destroy(n)"
                                                        :disabled="cIsEditing"                                                    
                                                        >
                                                        <i class="fas fa-trash fa-fw"></i>
                                                        
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
            <div class="col-12 col-xl-6" v-if="cIsEditing">
                <t-project-construction-edit-component
                    v-model="dValue"
                    :selected-day.sync="dSelectedDayOnCalendar" 
                    :selected-m-branch-ids="dSelectedBranchIds" 
                    @save="save($event)"
                    v-if="!isResult"
                    />
                <construction-result-input-component
                    v-model="dValue"
                    :is-t-project="true"
                    :selected-m-branch-ids="dSelectedBranchIds" 
                    v-else
                    />

                <div class="float-right mt-3">
                    <button type="button" class="btn btn-secondary text-right" @click.prevent="cancel">                                
                        閉じる
                    </button>
                </div> 
            </div>

            
        </div>

    </div>

</template>

<script>
import NumberUtil from '../../../frameworks/NumberUtil';
import ObjectUtil from '../../../frameworks/ObjectUtil';
import DayJsEx from "../../../frameworks/DayJsEx" ;

import _ from "lodash" ;

import { TProjectDelivery } from '../class/models/TProjectDelivery';
import TProjectConstructionEditComponent from './component/TProjectConstructionEditComponent.vue';
import ArrayUtil from '../../../frameworks/ArrayUtil';


export default {
  components: { TProjectConstructionEditComponent },

    data :  function() {
        return {
            
            /**
             * カレンダー上で選択されている日
             */
            dSelectedDayOnCalendar : new Date() ,
            /**
             * 選択中の拠点のIDのリスト
             */
            dSelectedBranchIds : [] , 

            /**
             * 選択中のConstruction
             */
            dValue : undefined , 

            /**
             * 選択中のConstructionのIndex
             */
            dSelectedIndex : -1 ,

            /**
             * 実績か予定か
             */
            isResult : false ,

        } 
    } , 
    props : {
        /**
         * t_projectsのレコード
         */
        value : {
            type : Object ,
        } ,
    } ,
    watch : {        
    } ,
    computed : {          
        /**
         * 編集していないフラグ（Validation用)
         */
        cIsNotEditingConstruction : function() {
            return ! this.cIsEditing ?? false ; 
        } ,  

        /**
         * 編集中フラグ
         */
        cIsEditing : function() { 
            return this.dValue !== undefined ; 
        } , 
        
        /**
         * 表示用の選択Index（Deleted_at考慮）
         */
        cSelectedIndex4View : function() { 
            if ( this.dSelectedIndex === -1 ) return -1 ; 

            const item = this.value.t_project_deliveries[this.dSelectedIndex] ; 
            return this.cValidConstructions.indexOf(item) ; 
        } , 


        cTProjectConstuctions : function() {
            const list = this.value.t_project_deliveries.filter(x =>  x.delivery_m_kv.g_01 === "construction" ) ;            
            return list ?? [] ;   
        } , 
        /**
         * 有効な施工予定のリスト
         */
        cValidConstructions : function() {
            const list = this.value.t_project_deliveries.filter(x => x.deleted_at == null && x.delivery_m_kv.g_01 === "construction" ) ;            
            return list ?? [] ;   
        } , 

        cSelectedTr :  function(){
            return function(index) {
                if(this.cSelectedIndex4View === index) {
                    return this.isResult ? {"dark-deep-green-selected" : true} : {"dark-selected" :true}
                }
            }
        }


    } ,
    methods : {

        add : function () {

            this.dSelectedIndex = -1 ;

            /**納品区分の初期値検索 */
            const mKvCat = this.mainStore.masters.MKvCategories.find( x => x.kv_key == "t_projects-delivery")
            const constructionMKvId = mKvCat.m_kvs.find( x => x.g_01 == "construction").id ;
            
            const obj = {

                delivery_m_kv_id : constructionMKvId ,
                created_m_user_id : this.$$cLoginUserId ,

            } ; 

            this.dValue = TProjectDelivery.parse(obj) ;

        } , 
        copy : function(construction) { 

            if(!construction.id) {
                alert("保存されていない施工はコピーできません。物件保存をしてください") 
                return ;  
            };
            let row = _.cloneDeep(construction)   ;
            
            delete row.id ; 
            delete row.uid ; 
            delete row.t_project_construction_results ; 
            delete row.t_project_products ; 
            
            for ( const user of row.t_project_construction_users){

                delete user.id ; 
                delete user.t_project_construction_id ;
                delete user.t_project_delivery_id ;
                delete user.t_project_delivery_uid ;
                delete user.t_p_order_detail ; 
                delete user.created_m_user_id ; 
                delete user.updated_m_user_id ; 
                delete user.created_at ; 
                delete user.updated_at ; 

            } 
            
            row.delivery_at =  this.formattedDay(construction.delivery_at) ; 
            row.isCopy = true ; 
            this.dValue = TProjectDelivery.parse(row) ;
            this.dSelectedDayOnCalendar = row.delivery_at ; 

            // UserList & BranchList
            let userList = row.t_project_construction_users.filter( x => x.m_user_id != null ) ;             
            this.dSelectedBranchIds = userList.map(x => x.m_user.m_branch_id) ; 
            this.dValue.outsources = this.dValue.t_project_construction_users.filter(x => x.m_user_id == null) ; 

            //外注のみの場合
            if(userList.length === 0 ) this.dSelectedBranchIds = this.dValue.outsources.map(x => x.out_source_m_customer.m_branch_id) ;

            
        } ,
        destroy : function(row) {

            if ( row.t_project_construction_results.length > 0 ) {
                alert("施工実績が入力されています") ; 
                return ; 
            }

            for(const user of row.t_project_construction_users) {
                if ( !_.isEmpty(user.t_p_order_detail) ) {
                    alert("発注済のため削除できません") ; 
                    return ; 
                }
            }
            
            if(! confirm('削除してよろしいですか?')) return ; 

            //console.log(row) ; 
            const idx = this.value.t_project_deliveries.indexOf(row) ; 
            if ( idx !== -1) {
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
                }
            }
            
        } , 
        selectRow : function (item) {

            if ( this.cIsEditing ) {

                alert("施工情報の編集を完了してください") ; 
                
                return ; 
            }
            if ( item.t_project_construction_results.lenght > 0 ) {
                // Todo : 確認
                alert("施工実績が入力されています") ; 
                
                return ; 
            }

            this.dSelectedIndex = this.value.t_project_deliveries.indexOf(item ) ;
            this.dValue = TProjectDelivery.parse(_.cloneDeep(item)) ;            
            this.dSelectedDayOnCalendar = this.dValue.delivery_at ; 

            // UserList & BranchList
            let userList = this.dValue.t_project_construction_users.filter( x => x.m_user_id != null ) ;             
            this.dSelectedBranchIds = userList.map(x => x.m_user.m_branch_id) 
            
            this.dValue.outsources = this.dValue.t_project_construction_users.filter(x => x.m_user_id == null) ; 

            //外注のみの場合
            if(userList.length === 0 ) this.dSelectedBranchIds = this.dValue.outsources.map(x => x.out_source_m_customer.m_branch_id) ;

            // console.log(this.dOutsources) ;
        } ,
        cancel : function() {
            this.dSelectedIndex = -1 ;
            this.dValue = undefined ;
            this.isResult = false ;
        } , 

        save : function (terms) {

            // console.log(terms) ;
            const _this = this ;

            const tProject = {
                id:this.value.id , 
                m_branch_id : this.value.m_branch_id , 
                name :this.value.name ,
                cd : this.value.cd ,
            } ; 

            // TProjectConstructionUsers 
            const tProjectConstructionUsers = this.dValue.selected_m_user_ids.map(
                function(userId) {
                    
                    const mUser = _this.mainStore.masters.MUsers.find(x => x.id == userId) ; 
                    //delete mUser.tags ; 
                    delete mUser.roles ; 
                    delete mUser.m_branch ; 

                    const row = {
                        // t_project_delivery_uid : _this.dValue.uid ?? deliveryUid , 
                        m_user_id : userId , 
                        m_user : mUser ,
                        created_m_user_id : _this.$$cLoginUserId
                    }
                    return row ; 
                }
            ) ; 

            for ( const outsource of this.dValue.outsources ) { 

                // console.log(outsource)
                outsource.created_m_user_id = _this.$$cLoginUserId ; 
                // outsource.t_project_delivery_uid = this.dValue.uid ?? deliveryUid ; 
            } ;

            // fullName文字列作成
            // MUser分
            const users = this.mainStore.masters.MUsers.filter(
                x => this.dValue.selected_m_user_ids.indexOf(x.id) !== -1) ; 
            const userFullNames = users.map(x => x.full_name ) ; 
            const userLastNames = users.map(x => x.last_name ) ; 

            // Outsource分
            const outsourceNames = this.dValue.outsources.map(x => 
                `${x.out_source_m_customer.short_name_or_name}(${x.num_of_out_source_people})`  ) ; 
            userFullNames.push(outsourceNames) ; 
            userLastNames.push(outsourceNames) ; 

            
            for(const date of terms){
                const data = _.cloneDeep(this.dValue) ;
                
                //保存分岐用
                //新規
                let isNew = false ;
                //期間指定あり
                let isPeriod = false ;
                
                if(date === this.formattedDay(this.dSelectedDayOnCalendar)) {

                    if ( !data.id && this.dSelectedIndex == -1 ) isNew = true ;

                } else {

                    delete data.id ;
                    data.created_m_user_id = this.$$cLoginUserId ;
                    isPeriod = true ;

                }
                
                data.delivery_at = date ;                
                data.user_full_names = userFullNames.join(",") ; 
                data.user_last_names = userLastNames.join(",") ; 
                data.t_project = tProject ; 

                //削除時の処理
                if(!_.isEmpty( data.t_project_construction_users)) {
                    for( const usr of data.t_project_construction_users) {
                        const foundU = tProjectConstructionUsers.find( x => x.m_user_id == usr.m_user_id) ;
                        const foundO = data.outsources.find( x => x.out_source_m_customer_id == usr.out_source_m_customer_id) ;
                        if(foundU === undefined && foundO === undefined) {
                            const idx = data.t_project_construction_users.indexOf(usr) ;
                            data.t_project_construction_users.splice(idx,1)
                        }

                    }
                }

                //重複して同じユーザーが入らないように制御
                const filterdUsers = [] ;
                for(const usr of tProjectConstructionUsers) {
                    const found = data.t_project_construction_users.find( x => x.m_user_id == usr.m_user_id) ;
                    if(found === undefined) filterdUsers.push(usr) ;
                }

                const filterdOutsouces = [] ;
                for(const usr of data.outsources) {
                    const found = data.t_project_construction_users.find( x => x.out_source_m_customer_id == usr.out_source_m_customer_id) ;
                    if(found === undefined) filterdOutsouces.push(usr) ;
                }
                
                const merged = [...filterdUsers,...filterdOutsouces]
                // data.t_project_construction_users = [...tProjectConstructionUsers,...data.outsources] ;
                data.t_project_construction_users.push(..._.cloneDeep(merged)) ;  
                // ArrayUtil.resetInsert(data.t_project_construction_users,_.cloneDeep(merged))
                data.updated_m_user_id = this.$$cLoginUserId ; 

                //不要な施工user情報の削除
                delete data.outsources ;
                delete data.selected_m_user_ids ;

                if ( isNew || isPeriod ) {

                    //商品コピーから持ってきた施工の場合はuidはあるので再附番しない
                    if(data._uid == undefined ) {
                        //新規商品の時紐づけ用のuidを設定する
                        let deliveryUid = Math.floor(Math.random() * (1000 - 1)) + 1 ;
                        while(this.value.ExistUids.indexOf(deliveryUid) !== -1) {
                            deliveryUid = Math.floor(Math.random() * (1000 - 1)) + 1 ;
                        } 
                        // Add
                        data.uid = deliveryUid ;

                        for(const user of data.t_project_construction_users) {
                            user.t_project_delivery_uid = deliveryUid ; 

                        }
                    }
                    
                    this.value.t_project_deliveries.push(data) ;

                }
                else {
                    for(const user of data.t_project_construction_users) {
                        if(_.isNil(user.id)) user.t_project_delivery_uid = data.uid ; 
                    }
                    // Update 
                    this.value.t_project_deliveries.splice(this.dSelectedIndex, 1, data);

                    //商品に紐づいた納品情報も更新 todo共通化
                    for(const product of this.value.t_project_products) {
                        const updated = product.t_project_deliveries.find(e => e.id == data.id) ;
                        const updatedIdx = product.t_project_deliveries.indexOf(updated) ;
                        if(updatedIdx !== -1) {
                            product.t_project_deliveries[updatedIdx].delivery_at = data.delivery_at ;
                            product.t_project_deliveries[updatedIdx].delivery_time = data.delivery_time ;
                            product.t_project_deliveries[updatedIdx].delivery_m_kv_id = data.delivery_m_kv_id ;
                            product.t_project_deliveries[updatedIdx].delivery_m_kv = data.delivery_m_kv ;
                        }

                    }
                }


            }            
            
            this.dSelectedIndex = -1 ;
            this.dValue = undefined ; 
            
        } , 

        editResult : function(item) {
            // 保存キャンセル前に違う行を選択すると、外注先出てこないバグあり。　
            // 要調査　対策として完了しないと触れなくする。
            if ( this.cIsEditing ) {
                // Todo : 確認
                alert("施工情報の編集を完了してください") ; 
                
                return ; 
            }

            if (!item.id) {
                alert("保存されていない施工の実績は入力できません。物件保存をしてください。") ; 
                
                return ;
            }
            this.isResult = true ;
            this.dSelectedIndex = this.value.t_project_deliveries.indexOf(item ) ;
            this.dValue = TProjectDelivery.parse(item) ;


        } ,

        

        formattedDay : function(day ) {
            const dayAt = DayJs(day).format("YYYY-MM-DD") ;
            return dayAt ; 
        } , 

        formattedTimes : function (start , end ) {
            //console.log("start:" + start + " end:" + end) ; 
            return DayJsEx.timeToDayjs(start).format("HH:mm") + "～" + DayJsEx.timeToDayjs(end).format("HH:mm") ; 

        } ,
    } ,

}
</script>
<style scoped>



</style>