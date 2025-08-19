<template>
    <div>
		<div v-show="$$cIsError" class="mt-1 mb-0 alert alert-danger" role="alert">
			{{ dErrorData.message }}
        </div>
        <div v-show="dIsSuccess" class="alert alert-success" role="alert">
			保存しました
        </div>
        <div class="row mb-2">
            <contents-header-left></contents-header-left>
            <contents-header-right>
                <router-link to='add' title="" append>
                    <button type="button" class="btn btn-primary" >
                        <i class="fas fa-plus fa-fw"></i>
                        新規作成
                    </button> 
                </router-link>                
            </contents-header-right>
        </div>

        {{ cLoaded }}
        <div class="row" id="accordionMail" > 
            <div class="col-12">
                <div class="row">
                    <div class="col-12 col-xl-1">
                        <div class="form-group">
                            <label for="mBranchId">拠点</label>
                            <m-branch-select 
                                id="mBranchId"
                                v-model="cMBranchId"
                            />
                        </div>
                    </div>
                    
                    <div class="col-12 col-xl-2 pl-xl-0">                        
                        <div class="form-group">
                            <label >営業担当</label>
                            <m-user-select  
                                v-model="cSalesMUserId"
                                :m-branch-id="cMBranchId"
                                :filter-m-tag-keys='["m_users-role-sales"]'                                
                                />
                        </div>
                    </div>

                    <div class="col-12 col-xl-1 pl-xl-0">
                        <div class="form-group">
                            <label for="projectName">コード</label>
                            <input id="projectName" v-model="dConditions.cd"
                                type="text" class="form-control" placeholder="">
                        </div>
                    </div>
                    <div class="col-12 col-xl-3 pl-xl-0">
                        <div class="form-group">
                            <label for="projectName">物件名</label>
                            <input id="projectName" v-model="dConditions.name"
                                type="text" class="form-control" placeholder="">
                        </div>
                    </div>
                    <div class="col-12 col-xl-3 pl-xl-0">
                        <div class="form-group">
                            <label for="customerName">クライアント名</label>
                            <input id="customerName" v-model="dConditions.m_customer.name"
                                type="text" class="form-control" placeholder="">
                        </div>
                    </div>
                    <div class="col-12 col-xl-2">
                        <div class="row text-xl-right">
                            <div class="col-6 col-xl-12">
                                <button class="btn btn-link pr-0" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    <h6 class="mb-0">詳細検索条件表示</h6>                                
                                </button>
                            </div>
                            <div class="col-6 col-xl-12">
                                <button type="button" :disabled="dLoading" class="btn btn-success" @click.prevent="search()">
                                    <div v-if="dLoading">
                                        <span class="spinner-border spinner-border-sm" role="status" />
                                        検索中...
                                    </div>
                                    <div v-else>
                                        <i class="fas fa-search fa-fw" />
                                        検索
                                    </div>
                                </button>
                                <button type="button" class="btn btn-secondary" @click="clear">
                                    <i class="fas fa-eraser fa-fw"></i>
                                    クリア
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-xl-1">
                        <div class="form-group">
                            <label for="mBranchId">生産拠点</label>
                            <m-branch-select 
                                id="OperatorMBranchId"
                                v-model="dConditions.t_project_products.t_project_product_processes.m_branch_id"
                            />
                            
                        </div>
                    </div>
                        
                    <div class="col-12 col-xl-2 pl-xl-0">
                        <div class="form-group">
                            <label >制作担当</label>
                            <m-user-select  
                                v-model="dConditions.t_project_products.operator_m_user_id"
                                :m-branch-id="dConditions.t_project_products.t_project_product_processes.m_branch_id"
                                :filter-m-tag-keys='["m_users-role-op"]'                                
                                />
                        </div>
                    </div>
                    <div class="col-12 col-xl-1 pl-xl-0">
                        <div class="form-group">
                            <label >状態</label>
                            <m-kv-select
                                v-model="dConditions.state_m_kv_id"
                                :kv-key="'t_project-state'">
                            </m-kv-select>                                             
                        </div>

                    </div>
                                                        

                    
                    <div class="col-12 col-xl-9 pl-xl-0">                        
                    </div>
                </div>
            </div>
            <div class="card bg-dark px-0 col-12">
                <div id="collapseOne" class="collapse " aria-labelledby="headingOne" data-parent="#accordionMail">
                    <div class="card-body bg-app-secondaly">
                        <div class="row">
                            <div class="col-12 col-xl-3">
                                <div class="form-group">
                                    <label for="customerName">商品名</label>
                                    <input id="customerName" v-model="dConditions.t_project_products.name"
                                        type="text" class="form-control" placeholder="" >
                                </div>                                
                            </div>
                            <div class="col-12 col-xl-2 pl-xl-0">
                                <div class="form-group">
                                    <label for="customerName">商品カテゴリ</label>
                                    <m-product-category-select
                                        v-model="dConditions.t_project_products.m_product_category_id"
                                     />
                                </div>                                
                            </div>
                            <div class="col-12 col-xl-2 pl-xl-0">
                                <div class="form-group">
                                    <label for="customerName">工程</label>
                                    <m-process-category-select
                                        v-model="dConditions.t_project_products.t_project_product_processes.m_process_category_id"
                                     />
                                </div>                                
                            </div>
                            <div class="col-12 col-xl-2 pl-xl-0">
                                <div class="form-group">
                                    <label >受注日～</label>
                                    <ex-v-date-picker 
                                        readonly
                                        aria-readonly="true"
                                        v-model="dConditions.ordered_at_from" />
                                </div>                                
                            </div>
                            <div class="col-12 col-xl-2 pl-xl-0">
                                <div class="form-group">
                                    <label for="customerName">～受注日</label>
                                    <ex-v-date-picker 
                                        v-model="dConditions.ordered_at_to" />
                                </div>                                
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-xl-2">
                                <div class="form-group">
                                    <label for="customerName">利益率～(以上)</label>
                                    <input id="customerName" v-model.number="dConditions.profit_per_from"
                                        type="number" class="form-control" placeholder="" >
                                </div>
                            </div>
                            <div class="col-12 col-xl-2 pl-xl-0">
                                <div class="form-group">
                                    <label for="customerName">～利益率(以下)</label>
                                    <input id="customerName" v-model.number="dConditions.profit_per_to"
                                        type="number" class="form-control" placeholder="" >
                                </div>
                            </div>
                            
                            <div class="col-12 col-xl-1 pl-xl-0">
                                <div class="form-group">
                                    <label >顧客締日</label>
                                    <input v-model.number="dConditions.m_customer.closing_date"
                                        type="number" class="form-control" placeholder="" >
                                </div>
                            </div>

                            <div class="col-12 col-xl-2 pl-xl-0">
                                <div class="form-group">
                                    <label>商品原価～(以上)</label>
                                    <input v-model.number="dConditions.t_project_products.cost_from"
                                        type="number" class="form-control" placeholder="" >
                                </div>
                            </div>
                            <div class="col-12 col-xl-2 pl-xl-0">
                                <div class="form-group">
                                    <label>～商品原価(以下)</label>
                                    <input v-model.number="dConditions.t_project_products.cost_to"
                                        type="number" class="form-control" placeholder="" >
                                </div>
                            </div>
                            <div class="col-12 col-xl-2 pl-xl-0">
                                <div class="form-group">
                                    <label>客先担当</label>
                                    <input v-model.number="dConditions.customer_user_name"
                                        class="form-control" placeholder="" >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>        
        </div>
        <div class="mb-1 text-right">
            <!--v-model:検索パラメーター  application:画面名(PersonalOptionsのapplicationと同じにすること)-->
            <retrieve-save
                v-model="dConditions"
                @search="search"
                :application="'t_project'"
                class="ml-1"
                /> 
        </div>

        
        <div class="row">
            <div class="col-12">
                <div class="table-responsive">
                    <table class="table table-striped table-dark">
                        <thead>
                            <tr class="text-nowrap" @click.prevent="sort">
                                <th scope="col" style="min-width:120px;">&nbsp;</th>
                                <th scope="col" v-show="$$cIsDebug">id</th>
                                <th scope="col" >状態</th>                                
                                <th scope="col" style="min-width:90px;"  id="cd"                        :class="setStyleSort('cd')">コード</th>
                                <th scope="col" style="min-width:120px;" id="kana"                      :class="setStyleSort('kana')">クライアント</th>
                                <th scope="col" style="min-width:100px;" id="customer_user_name"        :class="setStyleSort('customer_user_name')">客先担当</th>
                                <th scope="col" style="min-width:120px;" id="name"                      :class="setStyleSort('name')">物件名</th>
                                <th scope="col" style="min-width:120px;" >商品</th>         
                                <th scope="col" style="min-width:120px;" id="full_name"                 :class="setStyleSort('full_name')">営業担当</th>
                                <th scope="col" style="min-width:60px ;" id="profit_per"                :class="setStyleSort('profit_per')" v-if="cIsViewPrice">利益率</th>
                                <th scope="col" style="min-width:110px;" id="ordered_at"                :class="setStyleSort('ordered_at')">受注日</th>
                                <th scope="col" style="min-width:110px;" id="max_delivery_at"           :class="setStyleSort('max_delivery_at')">最終納期</th>
                                <th scope="col" style="min-width:110px;" id="inc_children_updated_at"   :class="setStyleSort('inc_children_updated_at')">更新日</th>
                                <th scope="col">&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(n,index)  in dList" :key="n.id">
                                <td>
                                    <!-- <router-link :to='"view/" + n.id'   title="" append>
                                        <button type="button" class="btn btn-secondary" >
                                            <i class="fas fa-eye fa-fw"></i>                            
                                        </button>
                                    </router-link>                             -->
                                    <router-link :to='"edit/" + n.id'   title="" append>
                                        <button type="button" class="btn btn-success" >
                                            <i class="fas fa-edit fa-fw"></i>                            
                                        </button>
                                    </router-link>
									<!-- <button
                                        v-if="isShowComplete(n)"
                                        type="button"
                                        class="btn btn-primary"
                                        @click.prevent="onComplete(n)"
                                    >
                                        <i
                                            class="fas fas fa-external-link-alt fa-fw"
                                        ></i>
                                    </button> -->
                                    
                                </td>
                                
                                <td v-show="$$cIsDebug">{{ n.id }}</td>
                                <td :class="n.StateClass">{{ n.StateName }}</td>
                                <td>{{ n.cd }}</td>
                                <td>{{ n.m_customers_name }}</td>
                                <td>{{ n.customer_user_name }}</td>                                
                                <td>{{ n.name }}</td>
                                <td v-if="n.t_project_products.length > 0">
                                    <p class="mb-0" v-for="product in n.t_project_products" :key="product.id">
                                        {{ product.name }}
                                    </p>
                                </td>
                                <td v-else>
                                    &nbsp;
                                </td>
                                <td>{{ n.m_users_full_name }}</td>
                                <td v-if="cIsViewPrice" class="text-nowrap" >
                                    <div :class="{'text-danger' : !cNeedToEstApprove(n)}" 
                                        class="text-right"
                                        data-container="body"
                                        data-toggle="popover" 
                                        data-trigger="hover" 
                                        data-placement="right" 
                                        :data-content="n.internal_quotation_memo"
                                        popover-name="estpop"
                                        >{{ cNum(n.profit_per) }}%
                                        <i class="fas fa-exclamation-circle fa-fw" 
                                            v-if="!cIsEmpty(n.internal_quotation_memo)"/>
                                        <span v-else>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>

                                    </div>
                                </td>
                                <td>{{ dateFormat(n.ordered_at) }}</td>
                                <td>{{ dateFormat(n.max_delivery_at) }}</td>
                                <td>{{ dateFormat(n.inc_children_updated_at, "YYYY-MM-DD HH:mm") }}</td>

                                <td>
                                    <button type="button" class="btn btn-danger" @click.prevent="destroy(n)">
                                        <i class="fas fa-trash fa-fw"></i>                            
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <pagination
            :p-pagination.sync="dPagination"
            @search="search($event)"
            />
			
		<t-project-sales-complete-modal
            v-model="dModalState"
            ref="tSalesCompleteModal"
            @ok="complete"
        />
    </div>
</template>

<script>
import DayJsEx from "@frameworks/DayJsEx" ;
import ObjectUtil from "@frameworks/ObjectUtil" ;
import TProjectUtil from '../../frameworks/TProjectUtil';
import { TProject } from './class/models/TProject';
import { SmUserOptionService } from '../masters/class/services/SmUserOptionService'
import _ from 'lodash' ;
import NumberUtil from '../../frameworks/NumberUtil';
import { TProjectService } from './class/services/TProjectService'
import { nextTick } from 'vue';

export default {
    data : function() {
        return {
            dApiName : "tProject" ,
            /**
             * 検索条件
             */
            dConditions : {
                sort : "" ,     // ソート項目
                
            }, 
            /**
             * 検索結果
             */
            dList : [] ,
            /**
             * pagination
             */
            dPagination : {
                links : [] ,    // リンク
                total : -1 ,    // 合計件数
                from : -1 ,     // 現在ページの開始位置
                to : -1 ,       // 現在ページの終了位置
            } ,


            /**
             * 検索用生産拠点
             */
            dOperatorMBranchId : 0 , 
            /**
             * ローディング中
             */
            dLoading : false ,
			
			/**
             * モーダル
             */
            dShowTProjectSalesCompleteModal : null ,
            dModalState : {
                id: 0 ,
                sales_completed_at: ""
            },

            dIsSuccess: false

        }
    } ,
    computed : {  
        cIsShow : function() {
            if (! this.$$cIsAppReady) return false ;
            // this.cMBranchId = this.mainStore.loginMUser.m_branch_id ;
            return true ;
        } ,
        cLoaded : function(){
            if (! this.$$cIsAppReady) return  ;
            // this.cSalesMUserId = this.mainStore.loginMUser.id ;
            return "" 
        } ,
        //物件検索項目縛りを入れる→現在使用していない
        cCanChangeUser : function(){
            return this.$$cIsNskDev ? false : true ;
        } ,
        cEndpointBase : function () 
        {
            return  `api/${this.dApiName}`  ;
        } ,
        /**  カラム */
        // 拠点ID
        cMBranchIdCName : function() {
            const colName = "m_branch_id" ;
            return colName ;
        } ,
        cMBranchId :{
            get :  function() {                
                return this.getValue(this.cMBranchIdCName) ;
            } ,
            set : function(val) {
                this.setValue(this.cMBranchIdCName, val)  ;
            }
        } ,
        // 生産拠点ID
        cOperatorMBranchId :{
            get :  function() {                
                return this.dOperatorMBranchId ; 
                // return this.dConditions.t_project_products.t_project_product_processes.m_branch_id ;
            } ,
            set : function(val) {
                // console.log("cOperatorMBranchId:" + val) ; 
                this.dOperatorMBranchId = val ; 
                this.dConditions.t_project_products.t_project_product_processes.m_branch_id = val ; 
                
            }
        } ,
        // 拠点ID
        cSalesMUserIdCName : function() {
            const colName = "sales_m_user_id" ;
            return colName ;
        } ,
        cSalesMUserId :{
            get :  function() {                
                return this.getValue(this.cSalesMUserIdCName) ;
            } ,
            set : function(val) {
                this.setValue(this.cSalesMUserIdCName, val)  ;
            }
        } ,

        cNum : function() {
            return function(val) {
                return NumberUtil.round(val,1) ;
            }
        } ,

        /**
         * 金額の表示フラグ
         */
        cIsViewPrice : function() {
            const val = NumberUtil.invalid2zr(this.mainStore.getRole("t_project-price-view-permission")) ;
            return val >= 10 ;
        } ,


        /**
         * 見積承認必要利益率
         */
        cNeedToEstApprove : function() {
            return function(val) {
                const smMinProfit = this.masterStore.getSMOptionValByKeyMKvId(8010301) ?? 0 ;
                if(smMinProfit < val.profit_per) return true ;
                return !_.isNil(val.est_approved_at)
            }
        } ,

        cIsEmpty : function() {
            return function(val) {
                return _.isEmpty(val)
            }
        } ,

		/**
         * 売上完了ボタンの表示フラグ
         */
        cCanComplete : function() {
            //@ts-ignore
            const val = NumberUtil.invalid2zr(this.mainStore.getRole("t_sale-privilege")) ;
            return val >= 30 ;

        } ,
    } ,
    methods : {
        getValue : function (colName) {
            return this.$$getValue("dConditions", colName) ;
        } ,
        setValue : function (colName, val) {
            this.$$setValue("dConditions", colName, val) ;
        } ,
        dateFormat : function(value ,format = undefined) {
            if(_.isNil(value)) return "" ;
            const fmt =  format == undefined ? "YYYY-MM-DD" : format ;
            return DayJsEx.format(value , fmt )
        },
        clear : function() {
            this.dConditions = {
                m_branch_id : 0 , 
                // m_branch_id : this.mainStore.loginMUser.m_branch_id , 
                sales_m_user_id : 0 , 
                m_customer : {} , 
                t_project_products : {
                    name : "" , 
                    m_product_category_id: 0 ,
                    operator_m_user_id:0 , 
                    t_project_product_processes : {
                        m_branch_id : 0 ,
                        m_process_category_id : 0 ,

                    }
                }
            }  ; 

            this.cOperatorMBranchId = 0 ; 
        } , 
        search : async function (url) {
            // console.log(this.dConditions) ;
            // console.log(this.cOrderedAt) ;
            // console.log(JSON.stringify(this.dConditions)) ;

            try {            
                this.dLoading = true ;
                const getParams = JSON.parse(JSON.stringify(this.dConditions)) ;
                if ( getParams.m_branch_id == 0) delete getParams.m_branch_id ;

                // 工程
                const condMProcessCategoryId = this.dConditions.t_project_products.t_project_product_processes.m_process_category_id ;
                if (condMProcessCategoryId === undefined || condMProcessCategoryId === 0 ){
                    delete getParams.t_project_products.t_project_product_processes.is_enabled ;
                } else {
                    getParams.t_project_products.t_project_product_processes.is_enabled = true ;
                }
                
                // 受注日
                if ( getParams.orderd_at_from === undefined ||
                     getParams.orderd_at_from == ""){
                    delete getParams.orderd_at_from ;
                }

                if ( getParams.orderd_at_to === undefined ||
                     getParams.orderd_at_to == ""){
                    delete getParams.orderd_at_to ;
                }

                // 営業担当
                if ( getParams.sales_m_user_id == 0 )  delete getParams.sales_m_user_id ;

                // リレーショントリム
                if ( Object.keys(getParams.t_project_products.t_project_product_processes).length === 0 ) delete getParams.t_project_products.t_project_product_processes ;

                if ( Object.keys(getParams.t_project_products).length === 0 ) delete getParams.t_project_products ;

                //if ( Object.keys(getParams.m_customer).length === 0 ) delete getParams.m_customer;
                /*
                if ( this.cOrderedAt !== undefined ){
                    getParams.ordered_btw = this.cOrderedAt ;
                }
                delete getParams.orderd_at_from ;
                delete getParams.orderd_at_to ;
                */
                //console.log(JSON.stringify(getParams)) ;
                //const res = await axios.get(this.cEndpointBase + "/retrieve" ,{ params :getParams }) ;

                const ep = (url? url : this.cEndpointBase + "/retrieve") ;
                const res = await axios.post(ep, getParams) ;

                // this.dList             = res.data.data ;

                this.dList             = res.data.data.map(x => TProject.parse(x)) ;

                // pagination関連
                this.dPagination.links = res.data.links ;   // リンク
                this.dPagination.total = res.data.total ;   // 合計件数
                this.dPagination.from  = res.data.from ;    // 現在ページの開始位置
                this.dPagination.to    = res.data.to ;      // 現在ページの終了位置
            } catch (error) {
                // handle error
                this.$$errorConsole(error ,this.cEndpointBase + "/retrieve") ;
            } finally {
                this.dLoading = false ;
                this.$nextTick(function() {
                    $('[popover-name="estpop"]').popover()
                }) ; 
            }
        } , 
        destroy : async function (n) {
            let ep = `${this.cEndpointBase}/${n.id}` ;

            if (!ObjectUtil.isNU(n.ordered_at)) {
                alert("受注済みの為、物件を削除することができません。") ;
                return ;
            }
            
            if (!confirm('削除してよろしいですか?')) return ;
            
            try {
                const res = await axios.delete(ep ) ;
                
                const deleted  = this.dList.find(e => e.id === n.id ) ;
                const delIndex = this.dList.indexOf(deleted) ;

                if ( delIndex != -1 )  this.dList.splice(delIndex , 1) ;
                
            } catch (error) {
                // handle error
                this.$$errorConsole(error, ep) ;
            }
        } ,
        sort : function (event) {
            if (!event.target.id) return ;

            // クリックした列をソートキーに保存
            if (this.dConditions.sort == event.target.id) {
                this.dConditions.sort = event.target.id + " desc" ;
            } else {
                this.dConditions.sort = event.target.id ;
            }

            // 再検索
            if (this.dList.length) this.search() ;
        } ,
        setStyleSort : function (key) {
            // ソートされた項目のStyle設定
            return {
                sort_asc : this.dConditions.sort == key ,
                sort_desc: this.dConditions.sort == key + " desc" ,
            } ;
        } ,
		/**
         * 売上完了日を設定できるかどうかのチェック
         */
        isShowComplete: function(tProject) {
            if( !this.cCanComplete ) return false//"権限で売上完了ボタンは非表示" ;

            if ( tProject.IsOrderLost ) return false//"失注" ;

            if ( ObjectUtil.isNU(tProject.ordered_at)) return false//"案件" ;

            if ( ! ObjectUtil.isNU(tProject.sales_completed_at)) return false//"売上済" ;

            return true //"受注" ;
        },
		// モーダルを開く
		onComplete: function(proj) {
            this.dModalState = {
                id: proj.id,
                sales_completed_at: DayJsEx.format(new Date(), "YYYY-MM-DD")
            } ;
            this.$refs.tSalesCompleteModal.open() ;

        } ,
        // モーダルを閉じる(売上完了日を更新)
        complete: async function(data) {
            this.dIsSuccess = false
            try {
                const ep = this.cEndpointBase + "/salesComplete" ;
                console.log('ep', ep)
                const res = await axios.post(ep, data) ;
                this.dIsSuccess = true ;
                nextTick(() => {
                    this.search() ;
                });

            } catch (error) {
                this.$$errorConsole(error ) ;

                console.error("tProject save failed") ;
                return undefined ;
            }

        }

    } ,
    created : function () {
        this.clear() ;
        this.cOperatorMBranchId = 0 ; 


        SmUserOptionService.setDefVal2SearchParams("t_project",this.dConditions) ;
    
    } ,
}
</script>