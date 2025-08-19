<template>
    <div>       
        <contents-header-component
            :menu-title="'生産計画'"
            :icon="'fa-print'"            
            >            
            
            <div slot="breadcrumb">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb bg-dark p-0 mb-0">
                        <li class="breadcrumb-item"><a href="#">Home</a></li>
                        <!-- <li class="breadcrumb-item"><a href="#">生産管理</a></li> -->
                        <li class="breadcrumb-item active" aria-current="page">生産計画</li>
                    </ol>
                </nav>
            </div>

            <div slot="title">
                
            </div>
            
            <div slot="right-menu">

                <div class="form-inline">

                    <label >表示</label>                                
                    <div 
                        class="btn-group btn-group-toggle mx-2" >
                        <label class="btn btn-dark"
                            :class="{active : dViewMode === 'list' }"
                            data-toggle="tooltip" data-placement="top" title="残一覧" >
                            <input type="radio" v-model="dViewMode" name="view-modes" value="list"
                                >
                            <i class="fas fa-list fa-fw "></i>
                        </label> 
                        <label class="btn btn-dark"
                            :class="{active : dViewMode === 'grouping' }" 
                            data-toggle="tooltip" data-placement="top" title="グループ" >
                            <input type="radio" v-model="dViewMode" name="view-mode" value="grouping">
                            <i class="fas fa-th-large fa-fw "></i>
                        </label>
                    </div> 
                            

                    <label class="pr-3">拠点</label>
                    
                    <m-branch-select 
                        @input="branchChange()"
                        v-model="dSelectedMBranchId" 
                        ></m-branch-select>
                    
                </div>
            

            </div>
            
            
        </contents-header-component>     

        <div v-if="$$cIsError" class="alert alert-danger" role="alert">
            {{dErrorData.message}}
        </div>

        

        <div v-show="dViewMode === 'grouping'">
                
            <div class="app-contents-container ">        
                <div class="row">
                    <div class="col-12 col-xl-6 ">
                        <div class="row">
                            
                            <div class="col-12 col-xl-4">
                                <div class="form-group">
                                    <label >加工カテゴリー</label>
                                    <m-kv-select
                                            v-model="dSelectedProcessCategoryMKvId"
                                            @input="selectProcessCategory()"
                                            :kv-key="'m_process_categories-production'"
                                            />
                                </div>
                            </div>
                            
                            <div class="col-12 col-xl-8 px-xl-0">
                                <div class="form-group">
                                    <label >商品カテゴリ</label>                                
                                    <m-product-category-multi-select
                                        v-model="dSelectedProductCategories"
                                        @input="selectProductCategory()"
                                        :isOnlyProduction="true"
                                        />
                                </div>
                                
                            </div>

                        </div>


                    </div>
                    <div class="col-12 col-xl-6 pl-xl-0">                    
                        <div class="row">
                            <div class="col-12 col-xl-5">
                                <div class="form-group">
                                    <label >納期</label>
                                    <div class="d-flex flex-no-wrap">
                                        <ex-v-date-picker 
                                            readonly
                                            aria-readonly="true"
                                            v-model="dConditions.delivery_date.from" />
                                        <span class="px-2 pt-2">～</span>
                                        <ex-v-date-picker 
                                            readonly
                                            aria-readonly="true"
                                            v-model="dConditions.delivery_date.to" />
                                    </div>
                                </div>    

                            </div>
                            <div class="col-12 col-xl-5 pl-xl-0">
                                <div class="form-group">
                                    <label >生産予定日</label>
                                    <div class="d-flex flex-no-wrap">
                                        <ex-v-date-picker 
                                            readonly
                                            aria-readonly="true"
                                            @input="changePlannedAt"
                                            v-model="dConditions.planed_production_at.from" />
                                        <span class="px-2 pt-2">～</span>
                                        <ex-v-date-picker 
                                            readonly
                                            aria-readonly="true"
                                            @input="changePlannedAt"
                                            v-model="dConditions.planed_production_at.to" />
                                    </div>
                                </div>    
                            </div>
                            <div class="col-12 col-xl-2 pl-xl-0">
                                <div class="d-flex flex-nowrap">
                                    <div class="form-group text-center pr-3">
                                        <label for="">土</label>
                                        <ns-checkbox-input
                                            v-model="dIsIncSaturday"
                                            @input="changePlannedAt"
                                            :id="'TProductionPlan-IsIncSaturday'"
                                            />
                                    </div>
                                    
                                    <div class="form-group text-center ">
                                        <label for="">日・祝</label>
                                        <ns-checkbox-input
                                            v-model="dIsIncHoliday"
                                            @input="changePlannedAt"
                                            :id="'TProductionPlan-IsIncHoliday'"
                                            />
                                    </div>

                                </div>
                                            

                            </div>


                        </div>

                    </div>
                    
                </div>

            </div>
            <div class="row col-xl-nowrap m-production-list">            
                <div class="col-12 col-md-6 col-xl-2 px-0" v-for="n in cMProductions" :key="n.id"
                        @click.prevent="selectMProduction(n)"
                        @dragover.prevent
                        @dragenter="dragEnterMproduction($event , n)"
                        @drop="dropMProduction($event , n )"
                        >                    
                    <div class="card rounded-0 bg-dark px-3 py-2" 
                        @dragleave="dragLeaveMProduction($event)"
                        @dragend="dDragEnteredMproduction = undefined"
                        :class="{ 
                            'dark-deep-selected':dSelectedMProductions.indexOf(n.MProduction) !== -1  ,
                            'dark-deep-green-selected':dDragEnteredMproduction === n 
                            
                            }" >
                        <div class="row px-3">
                            <h5 class="card-title mb-1">{{n.MProduction.name}}</h5>                        
                        </div>
                        <div class="row">
                            <div class="col-6 d-flex flex-no-wrap my-2" >
                                <div class="ml-auto mr-auto" >
                                    <picture>
                                        <source 
                                            :srcset="`${n.MProduction.thumbnail_path == null ? '' : 'storage/' + n.MProduction.thumbnail_path }`" 
                                            />
                                        <img class="object-contain" src="img/noimage.png"  />            
                                    </picture>
                                    
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="">
                                    <p class="card-text mb-0">ジョブ数:{{n.t_project_product_processes.length}}</p>
                                    <h6 class="my-0 text-white-50 mb-0">{{n.hour}} h</h6>
                                    <h6 class="my-0 text-white-50 mb-0">{{n.sqm}} ㎡</h6>
                                    <h6 class="my-0 text-white-50 mb-0">{{n.mater}} m</h6>
                                </div>

                            </div>

                            
                        </div>

                    </div>

                </div>

                
                
            </div>

            <div class="row" v-if="dIsLoadingProcesses">
                <div class="position-absolute spinner-area vh-100 bg-dark" style="z-index:10;opacity:0.5;">
                    
                </div>
                <div class="position-absolute spinner-area vh-100 d-flex justify-content-center align-items-center" style="z-index:11">
                    <span class="spinner-border text-primary" style="opacity:1" />
                </div>

            </div>


            <!-- 計画グルーピング -->
            
            <div>
                <transition name="tranViewGrouping">    
                

                    <div v-show="dViewModeOnGroup === 'chart'" >
                        <t-production-plan-grouping          
                            ref="grouping"
                            :m-branch-id="dSelectedMBranchId"
                            :group-manager="cGroupManager"
                            :selected-group="dSelectedGroup"                    
                            @group-conditions="groupConditions"
                            @reload-day="reloadProductionDay"
                            @get-unplanned="getTProjectProductProcesses4unPlanned"
                            @select-group="selectGroup"
                            @try-input-result="tryInputResult"
                            @try-check-mismatch="tryCheckMismatch"
                            @try-separate-group="trySeparateGroup"                                            
                            @save-tproduction-day="saveTProductionDay"
                            @delete-tproduction-day="deleteTProductionDay"
                            @card-drag-start="cardDragStart"   
                            @rel-durstwf="relDurstwf"                  
                            @error="childError"
                            />
                        
                    </div>
                </transition>
                    
                <transition name="tranViewGroupView">
                    <!-- リスト -->
                    <div v-if="dViewModeOnGroup === 'detail'">
                        <t-production-plan-group-detail
                            ref="detail"
                            :group-manager="cGroupManager"
                            :selected-group="dSelectedGroup"
                            :m-branch-id="dSelectedMBranchId"
                            @select-group="selectGroup"
                            @save-tproduction-day="saveTProductionDayWithAfterfunc"
                            @try-input-result="tryInputResultProcess"
                            @mode-change="changeMode"
                            @error="childError"
                            >
                        </t-production-plan-group-detail>
                    </div>
                </transition>
            </div>
        </div>

        <div v-show="dViewMode === 'list'">
            <t-production-plan-list 
                :m-branch-id="dSelectedMBranchId"

            />
        </div>


        <div v-show="dViewMode === 'durst'">
            <t-production-durst-wf
                :group="dRelGroup"
                :productionDay="dRelProductionDay"
                />
        </div>


        <!-- Model -->
        <t-production-group-conditions-modal
            v-show="dIsModalOpen_GroupConditions"
            :is-open.sync="dIsModalOpen_GroupConditions"
            :day="dSelectedGroupDay"
            @ok="groupConditionModalOk" 
            @cancel="groupConditionModalClear" 
            />
            
        <t-production-change-at-plan-modal 
            v-show="dIsModalOpen_ChangeMProduction"
            :is-open.sync="dIsModalOpen_ChangeMProduction"
            :info="dChangeFromGroupInfo"
            @ok="mProductionChangeModalOk" 
            @cancel="mProductionChangeModalClear" 
        />

        <t-production-separate-group-modal
            v-show="dIsModalOpen_SeparateGroup"
            :is-open.sync="dIsModalOpen_SeparateGroup"
            :group="dTrySeparateGroup"
            @ok="groupSeparateModalOk"
            @canplay="groupSeparateModalClear"
        />

        <t-production-result-modal
            v-show="dIsModalOpen_Result"
            :m-branch-id="dSelectedMBranchId"
            :m-production-id="cSelectedGroupMProductionId"
            :is-open.sync="dIsModalOpen_Result"
            :group="dTryResultGroup"
            :process="dTryResultProcess"
            :defalut-result-day="dDefaultResultDay"
            @ok="groupResultModalOk"
            @canplay="groupResultModalClear"

        />

        
        <t-production-mismatch-list-modal
            v-show="dIsModalOpen_MismatchList"
            :is-open.sync="dIsModalOpen_MismatchList"
            :group="dTryMismatchListGroup"
            @ok="mismatchListModalOk" 
            @cancel="mismatchListModalClear" 
            />
        
        <div class="d-none">
            {{cDefaultProductionGroupConfig}}
        </div>


    </div>    
</template>

<script lang="ts">
// @ts-nocheck

import ArrayUtil from '../../../frameworks/ArrayUtil';
import ObjectUtil from '../../../frameworks/ObjectUtil';
import _ from "lodash" ; 
import DayJsEx from '../../../frameworks/DayJsEx';
import dayjs, { Dayjs } from 'dayjs';
import TProductionGroupManager from './../class/TProductionGroupManager';
import { TProduction } from './../class/models/TProduction';
import { TProductionDay } from './../class/models/TProductionDay';
import { TProjectProductProcess } from '../../tProjects/class/models/TProjectProductProcess';
import TProductionGroupGrouper from '../class/TProductionGroupGrouper';
import NumberUtil from '../../../frameworks/NumberUtil';
import { MProductionGroupConfigService } from '../../masters/class/services/MProductionGroupConfigService';
import TProductionMismatchListModal from '../modal/TProductionMismatchListModal.vue';
import { MCalendarService } from '../../masters/class/services/MCalendarService';
import MKvsConst from '../../../consts/MKvsConst';

export default {
    data :  function() {
        return {
            dApiName : "tProjectProductProcess" ,

            /**
             * ViewMode
             */
            dViewMode : "grouping",
            // dViewMode : "durst",

            /**
             * ViewMode
             */
            dViewModeOnGroup : "chart",
            /**
             * 検索条件
             */
            dConditions : { 
                // 納期
                delivery_date : {
                    to : undefined , 
                    from :undefined , 
                } , 
                // 生産予定日 
                planed_production_at : {
                    from : DayJsEx.today() , 
                    to : DayJsEx.today() ,  
                }
            } , 

            /**
             * 土　含む
             */
            dIsIncSaturday : false , 

            /**
             * 日・祝含む
             */
            dIsIncHoliday : false ,

            /**
             * 商品編集中
             */
            dIsEditingProduct : false  , 

            /**
             * 工程情報ロード中
             */
            dIsLoadingProcesses : false  , 



            //value : this.value ,
            /**
             * 選択拠点
             */
            dSelectedMBranchId : 0 , 

            /**
             * 選択工程カテゴリー
             */
            dSelectedProcessCategoryMKvId : 1650001 , 

            /**
             * 選択商品カテゴリー
             */
            dSelectedProductCategories : [2] , 

            /**
             * 選択中の生産先Idの配列
             */
            dSelectedMProductionIds : [] ,

            /**
             * 選択中の生産先の配列
             */
            dSelectedMProductions : [] ,

            /**
             * Drop先のMProduction
             */
            dDragEnteredMproduction : undefined , 

            /**
             * DragLeave対策カウンター
             */
            dDdCounter : 0  ,

            


            /**
             * 選択中の物件工程
             */
            dSelectedTProductProcess : undefined , 


            /**
             * 選択中の商品
             */
            //dEditingTProjectProduct : undefined , 
            dSelectedTProjectProduct : undefined , 

            /**
             * 生産予定日の配列
             */
            dPlanndProductionDays : [ DayJsEx.format(new Date())] , 


            /**
             * 生産予定日データ
             */
            dProductionDays : [] , 

            
            /**
             * 選択中のグループ
             */
            dSelectedGroup : undefined , 

            /**
             * MProduction以下の予定のバックアップ
             */
            // dBackupMProduction : undefined ,

            /**
             * グループ条件のデフォルト
             */
            dDefaultProductionGroupConfig : undefined , 

            /**
             * グループ条件のModal表示
             */
            dIsModalOpen_GroupConditions : false , 

            /**
             * グループ条件のModal用Dayクラス
             */
            dSelectedGroupDay : undefined , 

            /**
             * 生産先チェンジのModal表示
             */
            dIsModalOpen_ChangeMProduction : false  , 

            /**
             * 生産先変更元の情報
             */
            dChangeFromGroupInfo : {
                fromMProductionId : 0 , 
                toMProductionId : 0 , 
                group : undefined , 
            } , 

            /**
             * グループ分割Modal表示
             */
            dIsModalOpen_SeparateGroup : false , 

            /**
             * グループ分割対象
             */
            dTrySeparateGroup : undefined , 

            /**
             * DurstWf等の連携用Group
             */
            dRelGroup : undefined , 

            /**
             * DurstWf等の連携用Group
             */
            dRelProductionDay : undefined , 

            /**
             * 生産実績Modal表示
             */
            dIsModalOpen_Result : false  , 

            /**
             * 生産実績対象
             */
            dTryResultGroup : undefined  , 
            
            /**
             * 生産実績対象　Detail画面から
             */
            dTryResultProcess : undefined , 

            /**
             * 生産実績対象のデフォルト日付　Detail画面から
             */
            dDefaultResultDay : undefined , 
            /**
             * Detail側からのパラメータ
             */
            dTryResultProcessPayload : undefined , 


            
            /**
             * 不整合変更確認Modal表示
             */
            dIsModalOpen_MismatchList : false  , 

            /**
             * 不整合変更確認対象　Detail画面から
             */
            dTryMismatchListGroup : undefined , 

            dGroupManager : undefined , 

        } 
    } , 
    provide() {
        return {            
            pPlannedProductionDays : this.dPlanndProductionDays , 
        }
    } , 
    props : {

    } , 
    computed : {
        
        /**
         * URLエンドポイント 生産予定日
         */
        cEndpointBaseTProductionDay : function () 
        {
            return  `api/tProductionDay`  ;
        } ,
        /**
         * URLエンドポイント 生産計画グルーピング設定
         */
        cEndpoint4ProductionGroupConfig : function () {
            return  `api/mProductionGroupConfig/findByBranchAndProcessCategoryMkv/${this.dSelectedMBranchId}/${this.dSelectedProcessCategoryMKvId}`  ;
        } ,        

        
        cGroupManager : function() { 
            if ( this.dGroupManager === undefined) {
                this.dGroupManager = new TProductionGroupManager(this.$$cLoginUserId) ;                 
            }

            return this.dGroupManager ; 
        } , 

        cSelectedGroupMProductionId : function(){
            if ( _.isNil(this.dSelectedGroup )) return undefined  ; 
            
            return this.dSelectedGroup.m_production_id ; 
        } ,

        /**
         * デフォルトのグループ条件
         */
        cDefaultProductionGroupConfig : async function() { 
            this.$$clearError() ;
            // console.log("cDefaultProductionGroupConfig1 " +  this.dSelectedMBranchId + ":" + this.dSelectedProcessCategoryMKvId) ; 
            if (_.isNil( this.dSelectedMBranchId)) return undefined ; 
            if (_.isNil( this.dSelectedProcessCategoryMKvId)) return undefined ; 

            if ( this.dSelectedMBranchId === 0 || this.dSelectedProcessCategoryMKvId === 0 ) return undefined ;

            // console.log("cDefaultProductionGroupConfig1.5") ;   
            try {
                this.dDefaultProductionGroupConfig = 
                    await MProductionGroupConfigService.getDefault(this.dSelectedMBranchId ,this.dSelectedProcessCategoryMKvId ) ; 
                
                // console.log(res.data) ; 
            }
            catch (error) {
                this.$$errorConsole(error ,this.cEndpointGet ) ;                 
                this.dDefaultProductionGroupConfig = undefined ; 
            }

            return "" ; 

            

        } , 
        
        /**
         * 生産予定の日付の配列
         */
        cPlannedProductionDays : function() 
        {            
            const fm = dayjs(this.dConditions.planed_production_at.from ); 
            const to = dayjs(this.dConditions.planed_production_at.to  ); 

            if ( ! fm.isValid() || !to.isValid()) return []; 
            console.log(`fm ${fm}  to ${to}`) ; 

            const numOfDays = to.diff(fm, 'd') ; 
            const days = [fm.toDate()] ; 
            for ( let i = 0 ; i < numOfDays ; i++ ){
                const dt = fm.add(i + 1 , "d").toDate() ;                 
                days.push(dt)  ; 
            }

            return days; 

        } , 

        /**
         * 工程リスト
         */
        cProcessCategories : function() {
            if ( _.isNil(this.dSelectedMBranchId ) || this.dSelectedMBranchId == 0 ) return [] ; 
            if ( ObjectUtil.isNU(this.dSelectedProcessCategoryMKvId)) return [] ; 
            
            const filtered = this.mainStore.masters.MProcessCategories.filter(
                x => x.is_production && x.production_m_kv_id == this.dSelectedProcessCategoryMKvId) ; 
            return filtered  ; 
            
        } , 
        /**
         * 生産先リスト
         */
        cMProductions : function() { 
            // this.cGroupManager.tProductions.splice(0);
            // console.log("cMProductions") ; 
            if ( this.cProcessCategories.length === 0 ) return [] ; 

            const _this = this ; 
            const processIds = this.cProcessCategories.map(x => x.id) ; 
            
            
            const filtered = this.mainStore.masters.MProductions.filter(function(x) {
                if ( x.m_branch_id !== _this.dSelectedMBranchId ) return false ; 

                if ( ! x.is_production_target ) return false ; 
                
                // 工程カテゴリーフィルタ
                const findedByProcess = x.m_process_categories.find(p => processIds.indexOf(p.id) !== -1) ; 
                if ( findedByProcess === undefined) return false ; 

                // 商品カテゴリーフィルタ
                const findedByProduct = x.m_product_categories.find(p => _this.dSelectedProductCategories.indexOf(p.id) !== -1 ) ; 
                return findedByProduct !== undefined ;                 
            }) ; 

            // Reactiveさせるために 配列を足しておく & 元になるStoreは汚さない
            const copied = [...filtered] ; 
                // const mapped = copied.map((x) => {
            //     x.list  = [] ;
            //     x.t_production_days = [] ; 
            //     return x ; 
            // }) ; 

            
            //this.cGroupManager.tProductions.splice(0) ; 
            copied.forEach(x => {
                let tProd:TProduction = undefined ; 
                const found = this.cGroupManager.tProductions.find(p => p.MProduction.id == x.id) ; 
                if ( found === undefined){
                    tProd  = new TProduction(x , [] ) ;
                }
                else { 
                    tProd = found ; 
                }
                tProd.is_selected = this.dSelectedMProductionIds.indexOf(x.id) !== -1 ; 
                if ( found === undefined) {
                    this.cGroupManager.tProductions.push(tProd) ; 
                }
            }) ; 

            const tempProductions = [] ; 
            for ( const tProd of this.cGroupManager.tProductions) { 
                const found = copied.find(x => x.id === tProd.MProduction.id ) ; 
                if ( found !== undefined ) { 
                    tempProductions.push(tProd) ; 
                }
            }
            this.cGroupManager.tProductions.splice(0) ; 
            this.cGroupManager.tProductions.push(...tempProductions) ; 
            


            // Copy 
            return this.cGroupManager.tProductions ; 
            

        } , 

        /**
         * 選択中の工程のコンポーネント名
         */
        cSelctedProcessCompName : function () {            
            const cName = "tProductProcess" + this.dSelectedTProductProcess.m_process_category.cd ;  
            return cName ; 

        } , 



        

    } , 
    methods : {

        // #region 自身のイベント

        /**
         * 表示モードの変更
         */
        changeMode : function(mode){
            this.dViewModeOnGroup = mode ; 
        } ,

        /**
         * 拠点変更
         */
        branchChange : function() { 
            this.clearSelectedMProductions() ; 
            this.changePlannedAt() ; 
        } , 
        /**
         * 工程カテゴリ選択
         */
        selectProcessCategory : function() {
            this.clearSelectedMProductions() ; 
        } , 
        /**
         * 商品カテゴリ選択
         */
        selectProductCategory : function() {
            this.clearSelectedMProductions() ; 
        } , 

        /**
         * 生産先の選択
         */
        selectMProduction : async function(n){           
            const isAdd =  this.dSelectedMProductionIds.indexOf(n.MProduction.id) === -1 ; 
            // console.log("Select p ") ; 

            if ( this.dIsLoadingProcesses  ) return ; 


            ArrayUtil.switchDelInsByExists(this.dSelectedMProductionIds , n.MProduction.id)  ; 
            
            this.dSelectedMProductions.splice(0); 
            const mProductions = this.cMProductions.map( x => x.MProduction) ; 
            for ( const id of this.dSelectedMProductionIds){     

                const found = mProductions.find(x => x.id == id);                 
                this.dSelectedMProductions.push(found) ; 
            }            
            
            // 生産予定日データ
            if ( isAdd ){
                
                // 追加
                try { 
                    this.dIsLoadingProcesses = true ;
                    for( const day of this.dPlanndProductionDays){              
                        // console.log(`D ${day}`)   ; 
                        await this.getProductionDay(n.MProduction.id ,day  ) ; 
                    }

                }
                catch (error) { 
                    return ; 
                }
                finally {
                    this.dIsLoadingProcesses = false ;
                }
                
                
            }
            else { 
                // 未選択を削除
                const tProduction = this.cMProductions.find(x => x.MProduction.id === n.MProduction.id) ;                 
                if ( tProduction !== undefined){
                    const prodDays = [...tProduction.t_production_days] ; 
                    for ( const prodDay of prodDays){
                        const found = tProduction.t_production_days.find(x => dayjs(x.day).isSame(prodDay)) ; 
                        const idx = tProduction.t_production_days.indexOf(found) ; 
                        tProduction.t_production_days.splice(idx , 1 ) ; 
                    }                    
                }

            }

            this.dViewModeOnGroup = 'chart' ; 


        } , 

        
        /**
         * 選択している生産先をクリア
         */
        clearSelectedMProductions : function() { 
            
            this.dSelectedMProductionIds.splice(0) ; 
            this.dSelectedMProductions.splice(0); 

            // 工程取得
            //this.getTProjectProductProcesses() ; 
            
        } ,

        /**
         * 生産予定日の変更
         */
        changePlannedAt : async function () { 
            // console.log("Change") ; 
            const fm = dayjs.tz(this.dConditions.planed_production_at.from ); 
            const to = dayjs(this.dConditions.planed_production_at.to  ); 

            if ( ! fm.isValid() || ! to.isValid()  ) return ; 

            this.dIsLoadingProcesses = true ; 
            // Todo:祝日判定
            try { 
                const removeDays = await MCalendarService.getByRange(
                    this.dSelectedMBranchId ,
                    this.$$formatDay(fm),
                    this.$$formatDay(to)
                    ) ;
                
                
            }
            catch(error) { 
                console.error(error) ; 
                return ; 
            }
            finally { 
                this.dIsLoadingProcesses = false  ; 
            }
                
            this.dIsLoadingProcesses = true ; 


            this.dPlanndProductionDays.splice(0) ; 

            const numOfDays = to.diff(fm, 'd') ;             
            // this.dPlanndProductionDays.push(DayJsEx.format(fm.toDate()));
            
            for ( let i = 0 ; i < numOfDays + 1 ; i++ ){
                const addedDay = fm.add(i  , "d") ; 

                const found = removeDays.find(x => dayjs( x.day).isSame(addedDay)) ; 
                // console.log(found) ; 
                // console.log(this.dIsIncHoliday) ;
                if ( found !== undefined && ! this.dIsIncHoliday ) continue ; 
                 

                switch(addedDay.day()) {
                    case 0 : // 日曜
                        if ( ! this.dIsIncHoliday ) continue ; 
                        break; 

                    case 6 : // 土曜
                        if ( ! this.dIsIncSaturday ) continue ; 
                        break ; 

                    default :

                }

                const dt = DayJsEx.format(addedDay.toDate()) ;                 
                this.dPlanndProductionDays.push(dt)  ; 
            }

            this.dIsLoadingProcesses = true ;
            try { 
                
                for ( const tProduction of this.cGroupManager.activeTProductions){
                    // 日付を減らされた場合
                    const removeDays = tProduction.t_production_days.filter(x => {
                        const found = this.dPlanndProductionDays.find(y => dayjs(y).isSame(x.day)) 
                        return found === undefined ; 
                    }) ;
                    for ( const rd of removeDays ) {
                        const idx = tProduction.t_production_days.indexOf(rd) ; 
                        tProduction.t_production_days.splice(idx , 1 ) ; 
                    }



                    for ( const day of this.dPlanndProductionDays){
                        const found = tProduction.t_production_days.find(x => dayjs(x.day).isSame(day)) ; 
                        // console.log("found");
                        // console.log(found);
                        if ( found === undefined ){
                            // 未ロード
                            await this.getProductionDay(tProduction.MProduction.id ,day ) ; 
                        }
                    }
                }

            }
            catch (error)  { 
                this.$$errorConsole(error ,"" ) ; 
            }
            finally { 
                this.dIsLoadingProcesses = false  ; 
            }

            // this.dViewMode = 'grouping' ; 
            this.dViewModeOnGroup = 'chart' ; 
            
            
        } , 


        
        //#endregion
        deleteTProductionDay : async function(day) { 
            // console.log("delete") ; 
            // console.log(day) ; 
            this.$$clearError() ;
            const tProduction = this.cGroupManager.tProductions.find(x => x.MProduction.id === day.m_production_id ) ; 
            if ( tProduction === undefined ) return ; 

            const dayIndex = tProduction.t_production_days.indexOf(day) ; 
            const isNew = day.id === undefined ; 

            
            if ( ! isNew )  {                    
                try {
                    let apiUrl = this.cEndpointBaseTProductionDay ; 
                    if ( ! isNew ) apiUrl += `/${day.id}` ; 

                    const res = await axios.delete(apiUrl) ;
                    day.t_production_day_groups.splice(0) ;     
                    day.t_project_product_processes.splice(0) ; 
                    day.id = undefined;                     
 
                }
                catch (error) {
                    this.$$errorConsole(error ,apiUrl ) ; 
                    
                    break ; 
                }
                

            }
            else { 
                day.t_project_product_processes.splice(0) ; 
                day.t_production_day_groups.splice(0) ; 
            }

        } , 


        //#region 子からのEmit受信処理

        saveTProductionDayWithAfterfunc : async function(payload) { 
            try { 
                const day = payload.day ; 
                if ( day === undefined) return ; 
                // console.log("saveTProductionDayWithAfterfunc") ; 
                await this.saveTProductionDay(day) ; 
                
                this.dSelectedGroup = this.cGroupManager.finder.findByGroupObj(this.dSelectedGroup) ; 
                this.$refs.detail.noticeReload() ; 

                const afterFunc = payload.afterfunc ; 
                if ( afterFunc !== undefined) afterFunc() ; 

            }
            catch (error ) { 
            } 
            
        } ,

        /**
         * 生産予定の保存
         */
        saveTProductionDay : async function(day , isControlLoading = true) { 
            // console.log("saveTProductionDay") ; 
            if ( _.isNil(day) ) return ; 
            if ( isControlLoading ){
                this.$$clearError() ;
                this.dIsLoadingProcesses = true ;
            }  
            // console.log("saveTProductionDay 2 ") ; 
            // console.log(JSON.stringify(day)) ; 
            try { 
                const res = await this.cGroupManager.http.saveTProductionDay(day) ;                   
            }
            catch ( error ) { 
                this.$$errorConsole(error ,"" ) ; 
            }
            
            if (isControlLoading) this.dIsLoadingProcesses = false ;
            return ; 

        } , 


        /**
         * GroupingからのEmit受け取り
         *  まとめて生産予定を保存
         */
        saveTProductionAll : async function() { 
            this.$$clearError() ;
            const selectedTProductions = this.cGroupManager.tProductions.filter(x => x.is_selected) ; 

            this.dIsLoadingProcesses = true ;
            for ( const tProduction of selectedTProductions) {
                for ( const day of tProduction.t_production_days) {
                    try {
                        await this.saveTProductionDay(day ,false) ;                     
                    }
                    catch (error) {
                        this.$$errorConsole(error ,"" ) ; 
                        break ; 
                    }
                    
                }

            }

            this.dIsLoadingProcesses = false ;

        } , 

        
        /**
         * card からの select-group emit受け取り         
         */
        selectGroup : function(n) {             
            this.dSelectedGroup =  n  ;             
            // this.dViewMode = 'groupView' ; 
            this.dViewModeOnGroup = 'detail' ; 
        } ,

        
        /**
         * 右クリック からの try-input-result emit受け取り         
         */
        tryInputResult : async function(n) { 

            try {                 
                const isNotUpdated = await this.cGroupManager.checkUpdatedAt(n.t_project_product_processes) ; 
                if (! isNotUpdated ) return ; 
            }
            catch (error) {
                this.$$errorConsole(error ,error.ep) ;                 
            }            

            this.dTryResultGroup = n ; 
            this.dIsModalOpen_Result = true ; 
        } ,

        tryInputResultProcess: async function(payload) { 
            try {                 
                const isNotUpdated = await this.cGroupManager.checkUpdatedAt([payload.process]) ; 
                if (! isNotUpdated ) return ; 
            }
            catch (error) {
                this.$$errorConsole(error ,error.ep) ;                 
            }            


            this.dTryResultProcessPayload = payload ; 
            this.dTryResultProcess = payload.process ; 
            this.dDefaultResultDay = payload.day ; 
            this.dIsModalOpen_Result = true ; 
        } ,


        tryCheckMismatch : function(n) { 
            this.dTryMismatchListGroup = n ; 
            this.dIsModalOpen_MismatchList = true ; 
        } ,

        /**
         * 右クリック からの try-input-result emit受け取り         
         */
        trySeparateGroup : function(n) {             
            this.dTrySeparateGroup = n ; 
            this.dIsModalOpen_SeparateGroup = true ; 

            
        } ,

        childError : function(error)        {
            this.$$errorConsole(error ,error.ep) ;
        } , 

        /**
         * card からの card-drag-start emit受け取り
         */
        cardDragStart : async function(event) { 
            //console.log(event) ; 
            //console.log(rtn) ; 



            // // DragDropカウンターリセット
            // this.dDdCounter = 0 ; 

            // // Card状態をバックアップ
            // const group = TProductionPlanGroupUtil.getJsonOfDraggingGroup(event) ; 
            // if (group ) {
            //     this.dBackupMProduction = undefined ; 
            //     const foundProd = this.cMProductions.find(x => x.MProduction.id == group.m_production_id) ; 

            //     // Copy 処理が重い為 SetTImeout
            //     if ( foundProd !== undefined){
            //         setTimeout(() => {                        
            //             this.dBackupMProduction = _.cloneDeep(foundProd.t_production_days) ; 
            //         }, 10);                    
            //     }
            // }

        } , 


        relDurstwf : function(group){
            // console.log("relDurstWf ") ; 
            this.dViewMode = "durst" ; 

            const fromAt = DayJsEx.format( group.planed_production_at) ; 
            const productionDay = this.cGroupManager.finder.findByMProductionIdAndDay(group.m_production_id, fromAt) ;

            this.dRelGroup = group ; 
            this.dRelProductionDay = productionDay ; 

        } , 

        //#endregion


        //#region  DragDrop

        /**
         * MProductionに対して DragEnter 
         */
        dragEnterMproduction : function(event ,item ) { 
            const group = this.cGroupManager.dragGroup ; 
            if ( !group) return ; 

            this.dDdCounter++ ; 
            this.dDragEnteredMproduction = item ; 
            //console.log(this.dDragEnteredTarget) ; 
        } ,


        /**
         * MProductionに対して DragEnter 
         */
        dragLeaveMProduction : function(event) { 
            if ( this.dDragEnteredMproduction === undefined) return ; 
            this.dDdCounter -- ; 
            //console.log("dDdCounter " + this.dDdCounter) ; 
            if ( this.dDdCounter <= 0)  this.dDragEnteredMproduction = undefined ; 
            
        } , 

        /**
         * MProductionに対して Drop
         */
        dropMProduction: async function(event ,droppedItem ) { 
            this.dDdCounter = 0 ; 
            if ( this.dDragEnteredMproduction === undefined) return ; 
            


            // 更新チェック
            try { 
                const isNotUpdated = await this.cGroupManager.checkUpdatedAt(this.cGroupManager.dragGroup.t_project_product_processes) ; 
                if (! isNotUpdated ) return ; 
            }
            catch (error) {
                this.$$errorConsole(error ,error.ep) ;                 
            }

            // 元と先が一緒
            const foundGroup = this.cGroupManager.dragGroup ; 
            // console.log("foundGroup") ; 
            // console.log(foundGroup) ; 
            
            if ( this.dDragEnteredMproduction.MProduction.id === foundGroup.m_production_id  ){
                this.dDragEnteredMproduction = undefined ; 
                return ; 
            }

            // 生産可能な生産先かどうか
            if ( ! this.cGroupManager.isAbleToChangeMProduction(this.dDragEnteredMproduction.MProduction , foundGroup.t_project_product_processes , true )){
                this.dDragEnteredMproduction = undefined ; 
                return ; 
                
            }



            this.dChangeFromGroupInfo.toMProductionId = this.dDragEnteredMproduction.MProduction.id ; 
            this.dChangeFromGroupInfo.fromMProductionId = foundGroup.m_production_id ;             
            this.dChangeFromGroupInfo.group = foundGroup ; 
            // console.log("dChangeFromGroupInfo") ; 
            // console.log(this.dChangeFromGroupInfo) ; 
            


            // 同じ名称のモード、オプションがないかチェック
            const list = this.dChangeFromGroupInfo.group.t_project_product_processes ; 

            //const toMProduction = this.masterStore.getMProductionById(this.info.toMProductionId) ; 
            for ( const row of list ) { 
                const tgtProdNo = row.tmp_target_production_no ; 
                if ( _.isNil(tgtProdNo)) { 
                    alert("工程の生産先とグループの生産先が異なっています。") ; 
                    return ; 
                }
                // console.log(row.tmp_target_production_no) ; 
                
                // 現在のモード取得                
                const fromModeId = row[`m_production_mode_id_${tgtProdNo}`]                
                // console.log("tgtProdNo:" + tgtProdNo + "  fromMode:" + fromModeId) ; 
                const fromMode = this.masterStore.getMProductionModeById(fromModeId) ; 
                
                const foundMode = this.dDragEnteredMproduction.MProduction.m_production_modes.find(x => x.name == fromMode?.name ) ; 
                row.tmp_to_m_production_mode_id = _.isNil( foundMode) ? 0 : foundMode.id ; 

                // 現在のオプション取得
                // 現在のモード取得                
                const fromOptionId = row[`m_production_option_id_${tgtProdNo}`]                
                const fromOption = this.masterStore.getMProductionOptionById(fromOptionId) ; 
                // console.log("fromOptionId " + fromOptionId) ; 
                const foundOption = this.dDragEnteredMproduction.MProduction.m_production_options.find(x => x.name == fromOption?.name) ; 
                // console.log(foundOption) ; 
                row.tmp_to_m_production_option_id = _.isNil( foundOption) ? 0 : foundOption.id ; 

                // console.log("row.tmp_to_m_production_option_id " + row.tmp_to_m_production_option_id) ; 

                //
            }


            this.dDragEnteredMproduction = undefined ; 
            if ( foundGroup === undefined || ! foundGroup ) return ;             



            this.dIsModalOpen_ChangeMProduction = true ; 


            
        } , 

        //#endregion

        //#region  Modal関係


        /**
         * グループ条件
         */
        groupConditions : function(day ) { 
            // console.log("groupCondition") ; 

            this.dSelectedGroupDay = day ;             
            this.dIsModalOpen_GroupConditions = true ; 

        } , 

        /**
         * グループ条件モーダルからのOK
         */
        groupConditionModalOk : function(day) { 

            // 条件の変更の有無
            let isChanged = false ; 

            const targetCnt = 5 ; 
            for ( let i = 0 ; i < targetCnt ; i ++ ) { 
                const targetNo = NumberUtil.formatZeroPadding(i + 1 , 2) ; 
                // console.log(`targetNo ${targetNo}`) ; 
                const cName = `group_target_${targetNo}` ; 
                if ( this.dSelectedGroupDay[cName] !== day[cName]){
                    isChanged = true ; 
                    break ; 
                }
            }
            
            // if ( isChanged){
                Object.assign(this.dSelectedGroupDay , day ) ; 
                
                const parsed = this.dSelectedGroupDay as TProductionDay ;         
                this.cGroupManager.grouper.grouping(parsed) ;
                
            // }
            
            this.groupConditionModalClear() ; 
        } , 
        /**
         * グループ条件モーダル終了時のクリア処理
         */
        groupConditionModalClear : function()  { 
            this.dSelectedGroupDay = undefined ; 
            //this.dChangeFromGroupInfo.group = undefined ; 
        } , 


        /**
         * 生産先変更モーダルからのOK
         */
        mProductionChangeModalOk : async function(group) { 
            //console.log("Modal OK ") ; 
            //console.log(group.list[0]) ; 
            this.mProductionChangeModalClear() ; 

            const row = group.t_project_product_processes[0] ; 
            const tgtProdNo = row.tmp_target_production_no ; 
            const toMProductionId = row[`m_production_id_${tgtProdNo}`] ; 
            // console.log(`toMProductionId :${toMProductionId}`) ; 
            // 移動
            await this.cGroupManager.operator.moveGroupMProductionDay( toMProductionId , undefined, group ) ; 

            // 保存
            const dayAt     = group.planed_production_at ;
            
            // console.log(`fromMProductionId:${this.dChangeFromGroupInfo.fromMProductionId} @ ${dayAt}`) ; 
            const fromDay   = this.cGroupManager.finder.findByMProductionIdAndDay(this.dChangeFromGroupInfo.fromMProductionId  , dayAt) ; 
            const toDay     = this.cGroupManager.finder.findByMProductionIdAndDay(this.dChangeFromGroupInfo.toMProductionId  , dayAt) ; 
            
            this.dIsLoadingProcesses = true ;
            // console.log(fromDay) ; 
            // console.log(toDay) ; 
            this.saveTProductionDay(fromDay , false ) ; 
            this.saveTProductionDay(toDay, false ) ; 
            this.$nextTick() ; 
            this.dIsLoadingProcesses = false  ;
            

        } , 
        /**
         * 生産先変更モーダル終了時のクリア処理
         */
        mProductionChangeModalClear : function()  { 
            this.dChangeFromGroupInfo.group = undefined ; 
        } , 


        /**
         * グループ分割モーダルからのOK
         */
        groupSeparateModalOk : function(payload) { 
            //console.log("Modal OK ") ; 
            // console.log(payload) ; 

            if ( payload.mode == 1){
                // list分割                
                const selectedIds = payload.selectedIds ;                 
                const listA = this.dTrySeparateGroup.t_project_product_processes.filter(x => selectedIds.indexOf(x.id) !== -1 )  ;

                this.cGroupManager.operator.separateGroupByListIds(this.dTrySeparateGroup , listA ) ; 


            }

            this.groupSeparateModalClear() ; 


        } ,
        /**
         * グループ分割モーダル終了時のクリア処理
         */
        groupSeparateModalClear : function()  { 
            this.dTrySeparateGroup  = undefined ;
        } , 


        /**
         * 生産実績モーダルからのOK
         */
        groupResultModalOk : async function(payload) { 
            //console.log("Modal OK ") ; 
            
            // console.log(this.dTryResultProcessPayload) ; 
            let mProductionId ; 
            let fromAt  ; 
            if ( this.dTryResultProcessPayload === undefined){
                // DayGroup
                mProductionId = payload.target.m_production_id ; 
                fromAt  = DayJsEx.format( payload.target.planed_production_at) ;  
            }
            else { 
                mProductionId = this.dTryResultProcessPayload.m_production_id ; 
                fromAt = this.dTryResultProcessPayload.day ; 
            }
            // console.log(`mProducitonId:${mProductionId} day:${fromAt}`) ; 

            const fromDay = this.cGroupManager.finder.findByMProductionIdAndDay(mProductionId, fromAt) ;
            // console.log(fromDay) ; 
            
            try { 

                await this.saveTProductionDay(fromDay ) ; 

                // Processのときだけ
                if ( this.dTryResultProcessPayload !== undefined){

                    this.dSelectedGroup = this.cGroupManager.finder.findByGroupObj(this.dSelectedGroup) ; 
                    this.$refs.detail.noticeReload() ; 
                    // console.log(this.dTryResultProcessPayload) ; 
                    const afterFunc = this.dTryResultProcessPayload.afterFunc ; 
                    // console.log(afterFunc) ; 
                    if ( afterFunc !== undefined) afterFunc() ; 
                    

                }
            }
            catch (error ) { }
            


            this.groupResultModalClear() ; 
        } ,
        /**
         * 生産実績モーダル終了時のクリア処理
         */
        groupResultModalClear : function()  { 
            this.dTryResultGroup  = undefined ;
            this.dTryResultProcess = undefined ; 
            this.dTryResultProcessPayload = undefined ;  
        } , 


        /**
         * 不整合変更確認リストモーダルからのOK
         */
        mismatchListModalOk : async function(payload) { 
            // console.log("Modal OK ") ; 
            
            this.dIsLoadingProcesses = true ; 
            try { 
                await this.cGroupManager.updateMismatch(this.dTryMismatchListGroup) ;
            }
            catch (error )  { 
                console.error(error) ; 
            }
            
            this.dIsLoadingProcesses = false ;

            // Todo ReGroup 



            this.mismatchListModalClear() ; 
        } ,

        /**
         * 不整合変更確認モーダル終了時のクリア処理
         */
        mismatchListModalClear : function()  { 
            this.dTryMismatchListGroup = undefined ; 
        } , 



        //#endregion

        /**
         * Reload
         */
        reloadProductionDay : async function(day ) {            
            this.dIsLoadingProcesses = true ; 
            await this.getProductionDay(day.m_production_id , day.day ) ; 
            this.dIsLoadingProcesses = false ;
        } , 

        /**
         * グルーピング条件から変更されているデータを削除して
         * 新たにグループする
         */
        moveUnmachedProcess : async function(day , unmachedList) { 
            // Unmached
            if ( unmachedList.length === 0 ) return ; 
            
            // 生産先ごとにわける。
            const separatedByProductionList = {} ; 
            for (const p of unmachedList){
                const tgtProdNo = p.tmp_target_production_no ; 
                const targetMProductionId = p[`m_production_id_${tgtProdNo}`]  ; 

                if (_.isNil(separatedByProductionList[targetMProductionId])){
                    separatedByProductionList[targetMProductionId] = [] ; 
                }

                separatedByProductionList[targetMProductionId].push(p) ; 

            }
            // console.log(separatedByProductionList) ; 

            // 
            for (const mProductionId in separatedByProductionList){
                const numMProductionId = Number(mProductionId) ; 
                let groupConfig ; 
                // console.log(numMProductionId) ; 
                const mProduction = this.masterStore.getMProductionById(numMProductionId) ;  
                if ( this.dSelectedMBranchId !== mProduction.m_branch_id ){
                    groupConfig = await MProductionGroupConfigService.getDefault(mProduction.m_branch_id ,this.dSelectedProcessCategoryMKvId ) ;    
                    // groupConfig = this.dDefaultProductionGroupConfig ; 
                }
                else { 
                    groupConfig = this.dDefaultProductionGroupConfig ; 
                }
                
                // 一時的な日クラス作成(リスト分のみのグループを作るため)
                const sepList = separatedByProductionList[mProductionId] ;                                 
                const tempDay = new TProductionDay(numMProductionId ,day ,this.dSelectedProcessCategoryMKvId  , sepList) ;                         
                if ( groupConfig !== undefined){
                    tempDay.group_target_01 = groupConfig.group_target_01 ; 
                    tempDay.group_target_02 = groupConfig.group_target_02 ; 
                    tempDay.group_target_03 = groupConfig.group_target_03 ; 
                    tempDay.group_target_04 = groupConfig.group_target_04 ; 
                    tempDay.group_target_05 = groupConfig.group_target_05 ; 

                }

                this.cGroupManager.grouper.grouping(tempDay) ; 
                const groups = tempDay.groups ; 

                // 各日付に追加

                // データ取得
                let targetDay = this.cGroupManager.finder.findByMProductionIdAndDay(numMProductionId , day) ; 
                if ( targetDay === undefined){
                    targetDay = await this.cGroupManager.http.getTProductionDayBy(
                        numMProductionId , day , this.dSelectedProcessCategoryMKvId ,groupConfig ) ; 
                }

                // Group挿入
                for ( const g of groups){
                    const groupNo = this.cGroupManager.getNewGroupNo(targetDay , g.key) ; 
                    g.group_no = groupNo ; 
                    targetDay.groups.push(g) ; 
                }

                // this.saveTProductionDay(targetDay) ; 

                // 


                // console.log(tempDay.groups) ; 
            }
        } ,

        /**
         * 生産予定日データ取得
         */
        getProductionDay : async function(mProductionId ,day ) {
            // console.log("getProductionDay") ; 
            // console.log(day) ; 
            this.$$clearError() ;
            if ( this.dSelectedMProductions.length === 0 || 
                this.dPlanndProductionDays.length === 0 ) {
                return ; 
            }

            try { 
                const resDay = await this.cGroupManager.http.getTProductionDayBy(mProductionId , day , this.dSelectedProcessCategoryMKvId ,this.dDefaultProductionGroupConfig ) ; 
                // const unmachedList = this.cGroupManager.grouper.getUnmachedProcesses(resDay) ; 
                // if ( unmachedList.length > 0 ) { 
                //     // 現在のリストから削除
                //     const unmachedIds = unmachedList.map(x => x.id) ; 
                //     this.cGroupManager.removeProcessesByIds(mProductionId , resDay.day , unmachedIds ) ; 
                // }

                // // await this.moveUnmachedProcess(resDay.day , unmachedList) ; 
                // console.log(unmachedList) ; 

            }
            catch ( error ) { 

                this.$$errorConsole(error ) ; 
            }

        } , 


        /**
         * 物件の生産予定未決定情報を取得
         */
        getTProjectProductProcesses4unPlanned : async function(day) { 
            this.$$clearError() ;
            this.dIsLoadingProcesses = true ;

            let deliveryFrom = this.masterStore.getSMOptionValByKeyMKvId(MKvsConst.SmOptions.Production.IGNORE_DELIVERY_DATE_LESS_THAN) ;  
            
            if ( ObjectUtil.isNUE( deliveryFrom )) {
                deliveryFrom = this.dConditions.delivery_date.from
            }
            else { 
                if (! ObjectUtil.isNUE(this.dConditions.delivery_date.from) 
                    &&  dayjs(deliveryFrom).isBefore(dayjs(this.dConditions.delivery_date.from))){
                    deliveryFrom = this.dConditions.delivery_date.from ; 
                }
            }
            // console.log("deliveryFrom 2 " + deliveryFrom) ; 
            const processCategoryIds = this.cProcessCategories.map(x => x.id) ; 
            try {
                await this.cGroupManager.http.getTProjectProductProcesses4unPlanned(
                    day ,processCategoryIds  ,deliveryFrom ,this.dConditions.delivery_date.to ) ; 
            }
            catch (error) { 
                this.$$errorConsole(error ) ; 
            }

            // console.log("A") ; 
            this.dIsLoadingProcesses = false ;

            // 子コンポーネントに伝播
            this.noticeDataChangeToChildren() ;             


        } , 



        /**
         * 商品の保存
         */
        saveProduct : function(payload) {

        } , 


        noticeDataChangeToChildren : function() {
            this.$refs.grouping.noticeDataChanged() ; 
            
        } , 

    } , 
    mounted : function(){
        this.changePlannedAt() ; 
    } ,
    created : function() {        
        this.dSelectedMBranchId = this.mainStore.loginMUser.m_branch_id ; 
    }
}
</script>
<style scoped>
.scroll-area { 
    height : calc( 100vh - 218px ) !important 
}

.spinner-area { 
    width : calc( 100% - 52px) !important 
}

.m-production-list img{
    max-width: 120px ;
    height: 70px ;
    object-fit: contain ; 
    vertical-align: top;
}


.tranViewGroupView-enter ,
.tranViewGroupView-leave-to 

{
    opacity: 0 ;
    
}

.tranViewGroupView-enter-active, .tranViewGroupView-leave-active
{
    transition: opacity .3s;
}

</style>