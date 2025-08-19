<template>
    <div class="row" >

        <!-- 右クリックメニュー -->
        <vue-context ref="menu" class="list-group position-fixed dropdown-menu bg-dark" >
            <li>
                <a class="dropdown-item" href="#" v-if="$$cIsDebug"
                    @click.prevent="contextTest(dContextSelectedGroup)">TEST</a>
            </li>
            <li >
                <a class="dropdown-item" href="#"
                    @click.prevent="separateGroup(dContextSelectedGroup)">グループ分割</a>
            </li>
            
            <li v-if="dIsContextSelectedMode" class="dropright drop-hover">
                <a class="dropdown-item-text dropdown-toggle" href="#" data-toggle="dropdown">生産先モード変更</a>
                <ul class="dropdown-menu bg-dark">
                    <li v-for="mode in dSelectedMProductionModes" :key="mode.id"
                        v-show="mode.id != dContextSelectedGroup.key"  
                        class=""
                        >
                        <a href="#" @click.prevent="changeMProductionMode(dContextSelectedGroup ,mode )" 
                            class="dropdown-item" >{{mode.name}}</a>
                    </li>
                </ul>

            </li>            
            <div v-if="cIsAbleControlResult" role="separator" class="dropdown-divider"></div>
            
            <li v-if="cIsAbleControlResult" class="dropright drop-hover" >
                <a class="dropdown-item-text dropdown-toggle" href="#" data-toggle="dropdown">生産状態</a>
                <ul class="dropdown-menu bg-dark">
                    <li >
                        <a class="dropdown-item" href="#" v-if="cIsAbleToSelectUnplanned"
                            @click.prevent="changeStatusToUnplanned(dContextSelectedGroup )">未生産</a>
                        <a class="dropdown-item" href="#" v-if="cIsAbleToSelectFinished"
                            @click.prevent="changeStatusToFinished(dContextSelectedGroup )">生産完了</a>
                    </li>

                </ul>

            </li>            
            <li v-if="cIsAbleControlResult" >
                <a class="dropdown-item" href="#"
                    @click.prevent="resultInput(dContextSelectedGroup)">生産実績詳細</a>
            </li>



            <div v-if="cIsAbleCheckMismatchList" role="separator" class="dropdown-divider"></div>
            
            <li v-if="cIsAbleCheckMismatchList" >
                <a class="dropdown-item" href="#"
                    @click.prevent="checkMismatch(dContextSelectedGroup)">不一致 内容確認</a>
            </li>

            <div v-if="cIsAbleToSelectDurstWorkFlow" role="separator" class="dropdown-divider"></div>
            
            <li v-if="cIsAbleToSelectDurstWorkFlow" >
                <a class="dropdown-item" href="#"
                    @click.prevent="relDurstWorkFlow(dContextSelectedGroup)">DurstWorkFlow</a>
            </li>

            



        </vue-context>

        
        <!-- 計画グルーピング -->
        <div class="col-12 px-0 " >
            <div class="card rounded-0 bg-app-secondary ">
                <div class="card-header d-flex p-2">
                    <div class="border bg-dark border-dark px-3 py-2"
                        :class="{ 
                            'dark-deep-green-selected':dDdCounter > 0                     
                        }"
                        @drop="dropToUnPlannned($event)"
                        @dragover.prevent
                        @dragenter="dragEnterUnPlannned($event)"
                        @dragleave="dragLeaveUnPlannned($event)"
                        
                        >
                        未決定に戻す ( ドラッグしてください )
                    </div>

                    
                    <div v-for="tProduction of groupManager.activeTProductions" 
                        :key="tProduction.MProduction.id"
                        class="ml-2 "
                        >
                        <button
                            @click.prevent="scrollMDTo(`${tProduction.MProduction.id}`)" 
                            type="button" class="btn btn-primary ml-1" >
                            {{tProduction.MProduction.name}}
                        </button>
                        
                    </div>

                    <div class="ml-auto">
                        
                        <div class="form-group mb-0">
                            <label >グループ高さ</label>                                
                            <div 
                                class="ml-1 flex-grow-0 flex-shrink-0 btn-group btn-group-toggle"                         
                                style="flex-basis: 100px;">
                                <label class="btn btn-dark"
                                    :class="{active : dHeightMode === 'fixed' }"
                                    data-toggle="tooltip" data-placement="top" title="固定" >
                                    <input type="radio" v-model="dHeightMode" name="height-mode" value="fixed"
                                        >
                                    固定
                                </label> 
                                <label class="btn btn-dark"
                                    :class="{active : dHeightMode === 'hour' }" 
                                    data-toggle="tooltip" data-placement="top" title="時間" >
                                    <input type="radio" v-model="dHeightMode" name="height-mode" value="hour">
                                    時間
                                </label>
                            </div> 
                                    
                        </div>         
                    </div>
                

                    <div class="ml-auto d-flex">
               
                        <button
                            @click.prevent="changeScale(true)"
                            type="button" class="ml-2 btn btn-dark" >
                            <span class="h5">
                                <i class="fas fa-search-plus fa-fw"></i>
                            </span>
                            
                            
                        </button>
                        <button
                            @click.prevent="changeScale(false)"
                            type="button" class="btn btn-dark" >
                            <span class="h5">
                                <i class="fas fa-search-minus fa-fw"></i>
                            </span>
                            
                        </button>
                    </div>
                </div>
                <div class="card-body px-0 pt-0 pb-0">
                    
                    <!-- タイム -->
                    <div class="scroll-area " ref="scrollArea" style="padding-bottom:20rem !important;" >
                        
                        <!-- <div class="row" v-for="production in dProcessMProductionList"> -->
                        <div class="row" v-for="tProduction in cSelectedTProductions" :key="tProduction.MProduction.id">
                            <div class="col-1 border-bottom border-right border-secondary pr-2" 
                                style="background-color:#525c63!important"
                                :ref="`${tProduction.MProduction.id}`">
                                <div class="pl-2 pt-2 position-sticky fixed-top" >
                                    <!-- {{production.title}} -->
                                    {{tProduction.MProduction.name}}

                                    <div v-for="(d ) in tProduction.t_production_days" 
                                        :key="`${d.m_production_id}-${d.day}`"
                                        :class="{ 
                                            'dark-deep-green-selected':isDraggingLeftDay(d)
                                        }"

                                        @dragover.prevent
                                        @drop="dropToLeftDay($event ,d )"
                                        @dragenter="dragEnterLeftDay($event , d)"
                                        @dragleave="dragLeaveLeftDay($event , d)"

                                        class="bg-dark py-2 px-1 my-2">
                                        <a @click.prevent="scrollMDTo(`${tProduction.MProduction.id}-${d.day}`)" href="#"
                                            :class="{ 
                                                'text-white':isDraggingLeftDay(d)
                                            }"
                                            class="ml-1">
                                            {{$$formatDay(d.day)}}
                                        </a>
                                        <!-- <router-link :to="{ to:'/t_productions/plan' , hash:`test-${d.day}`}"  >
                                            {{$$formatDay(d.day)}}
                                        </router-link> -->
                                        <!-- <a @click.prevent="scrollMDTo(`${tProduction.MProduction.id}-${d.day}`)">MoveTo</a> -->

                                    </div>

                                </div>                                
                            </div>
                            <div class="col-11" >                                
                                <!-- <div v-for="d in production.t_production_days"> -->
                                <div v-for="d in tProduction.t_production_days" 
                                    :key="`${d.m_production_id}-${d.day}`"
                                    :ref="`${tProduction.MProduction.id}-${d.day}`" 
                                    @dragover.prevent
                                    @drop.prevent="dayDrop($event, tProduction.MProduction.id , d)"
                                    > 
                                    <div class="row bg-dark p-2" >
                                        <div class="col-12 col-xl-2 pt-2" >                                            
                                            <a href="#" @click.prevent="selectDay(d)">{{$$formatDay(d.day)}}</a>
                                        </div>
                                        <div class="col-12 co col-xl-10" >
                                            <div class="d-flex flex-wrap flex-xl-nowrap justify-content-end">                                                
                                                

                                                <button @click.prevent="emitReloadDay(d)"
                                                    type="button" class="btn btn-info ml-2"
                                                    data-toggle="tooltip" data-placement="top" title="リロード">
                                                    <i class="fas fa-sync-alt fa-fw"></i>   
                                                    
                                                </button>

                                                <button @click.prevent="emitGroupConditions(d)" v-if="cCanChangeGroup"
                                                    type="button" class="btn btn-secondary ml-2"
                                                    data-toggle="tooltip" data-placement="top" title="グループ">
                                                    <i class="fas fa-object-group fa-fw"></i>
                                                    
                                                </button>

                                                <button @click.prevent="emitGetUnplanned(d)"
                                                    type="button" class="btn btn-primary ml-2"                                                    
                                                    data-toggle="tooltip" data-placement="top" title="未決定分を取得">
                                                    <i class="fas fa-download fa-fw"></i>
                                                    
                                                </button>

                                                <button @click.prevent="emitSaveTProductionDay(d)"
                                                    type="button" class="btn btn-success ml-2">
                                                    <i class="fas fa-save fa-fw"></i>
                                                </button>
                                                <button @click.prevent="emitDeleteTProductionDay(d )"
                                                    type="button" class="btn btn-danger ml-2" >
                                                    <i class="fas fa-trash fa-fw"></i>
                                                </button>

                                                <label class="px-2 pt-2">作業時刻</label>
                                                <input v-model="d.planed_start_at"
                                                    type="time" class="form-control app-input-time" />
                                                <span class="px-2 pt-2">～</span>
                                                <input v-model="d.planed_end_at"
                                                    type="time" class="form-control app-input-time"  />

                                                    

                                            </div>
                                        </div>
                                    </div>

                                    <div class="row mt-1" >
                                        <!-- ヘッダ -->
                                        <div class="col-12 d-flex px-0 border-bottom border-secondary mt-1 pb-2">
                                            <div class="hour-area">
                                                &nbsp;
                                            </div>

                                            <div class="flex-fill">
                                                <div class="row ml-0 mr-3">
                                                    <div v-for="(n ,index) in getGroupConditions(d)" 
                                                        class="col text-center"  
                                                        :class='{"pr-0":index + 1 !== getGroupConditions(d).length}'>
                                                        <span class="font-weight-bold">{{n.def.title}}</span>
                                                    </div>
                                                </div>

                                            </div>

                                    
                                        </div>
                                    

                                        <div class="col-12 d-flex px-0">
                                            <div class="hour-area">
                                                <div v-for="i in getNumOfHours(d.planed_start_at , d.planed_end_at)" :key="i"
                                                    class="text-white-50 d-flex align-items-center border-bottom border-right border-secondary pr-1"
                                                    :style="{height : `${cTimePxScale}px`}">                                
                                                    <p class="text-right w-100 mb-0 pr-1">
                                                        {{i + getStartHour(d.planed_start_at) - 1}}
                                                    </p>
                                                    
                                                </div>

                                            </div>
                                            <div class="flex-fill">
                                                
                                                <!-- 線情報 -->
                                                <div class="position-absolute container-fluid px-0">
                                                    <div v-for="i in getNumOfHours(d.planed_start_at , d.planed_end_at)  * 2" :key="i"
                                                        class="border-bottom border-bottom-schedule"                                        
                                                        :style="{height : `${cTimePxScale / 2}px`}">
                                                        &nbsp;                                    
                                                    </div>                                
                                                </div>

                                                <div class="row ml-0 mr-3" 
                                                    :style="{ marginTop: `${getStartMinute(d.planed_start_at) * cTimePxScale / 60 }px` }">
                                                    <!-- Sort 1 -->                                                    
                                                    <div v-if="getGroupConditions(d).length > 0 " class="col"
                                                        :class='{"pr-0":1 !== getGroupConditions(d).length}'
                                                        >
                                                        <div v-for="group in getCList( tProduction.MProduction.id ,d.day , 0)" :key="group.uid"                                                             
                                                            @contextmenu="openContext($event ,tProduction.MProduction , d ,group)"
                                                            >
                                                            <t-production-plan-grouping-chart-card
                                                                v-if="group.deleted_at === null"
                                                                :group="group"
                                                                :selected-group="selectedGroup"
                                                                :timePxScale="cTimePxScale"
                                                                :group-manager="groupManager"
                                                                :height-mode="dHeightMode"
                                                                @select-group="selectGroup"
                                                                @card-drag-start="$emit('card-drag-start' ,$event)" 
                                                                @card-drop="cardDrop"
                                                            />
                                                        
                                                        </div>
                                                        
                                                        
                                                    </div>

                                                    
                                                    <!-- Sort 2 -->
                                                    <div v-if="getGroupConditions(d).length > 1 " class="col"
                                                        :class='{"pr-0":2 !== getGroupConditions(d).length}'>
                                                        <div v-for="group in getCList( tProduction.MProduction.id ,d.day , 1)" :key="group.uid"
                                                            @contextmenu="openContext($event ,tProduction.MProduction , d ,group)"> 
                                                            <t-production-plan-grouping-chart-card      
                                                                v-if="group.deleted_at === null" 
                                                                :group="group"
                                                                :selected-group="selectedGroup"
                                                                :timePxScale="cTimePxScale"
                                                                :group-manager="groupManager"
                                                                :height-mode="dHeightMode"
                                                                @select-group="selectGroup"
                                                                @card-drag-start="$emit('card-drag-start' ,$event)" 
                                                                @card-drop="cardDrop"
                                                            />
                                                        
                                                        </div>
                                                        
                                                    </div>

                                                    <!-- Sort 3 -->
                                                    <div v-if="getGroupConditions(d).length > 2 " class="col"
                                                        :class='{"pr-0":3 !== getGroupConditions(d).length}'>
                                                        <div v-for="group in getCList( tProduction.MProduction.id ,d.day , 2)" :key="group.uid" 
                                                            @contextmenu="openContext($event ,tProduction.MProduction , d ,group)">
                                                            <t-production-plan-grouping-chart-card       
                                                                v-if="group.deleted_at === null"
                                                                :group="group"
                                                                :selected-group="selectedGroup"
                                                                :timePxScale="cTimePxScale"
                                                                :group-manager="groupManager"
                                                                :height-mode="dHeightMode"
                                                                @select-group="selectGroup"
                                                                @card-drag-start="$emit('card-drag-start' ,$event)" 
                                                                @card-drop="cardDrop"
                                                            />
                                                        
                                                        </div>
                                                        
                                                    </div>

                                                    
                                                    <!-- Sort 4 -->
                                                    <div v-if="getGroupConditions(d).length > 3 " class="col "
                                                        :class='{"pr-0":4 !== getGroupConditions(d).length}'>
                                                        <div v-for="group in getCList( tProduction.MProduction.id ,d.day , 3)" :key="group.uid" 
                                                            @contextmenu="openContext($event ,tProduction.MProduction , d ,group)" >
                                                            <t-production-plan-grouping-chart-card
                                                                v-if="group.deleted_at === null"
                                                                :group="group"
                                                                :selected-group="selectedGroup"
                                                                :timePxScale="cTimePxScale"
                                                                :group-manager="groupManager"
                                                                :height-mode="dHeightMode"
                                                                @select-group="selectGroup"
                                                                @card-drag-start="$emit('card-drag-start' ,$event)" 
                                                                @card-drop="cardDrop"
                                                            />
                                                        
                                                        </div>
                                                    </div> 

                                                    
                                                    <!-- Sort 5 -->
                                                    <div v-if="getGroupConditions(d).length > 4 " class="col ">
                                                        <div v-for="group in getCList( tProduction.MProduction.id ,d.day , 4)" :key="group.uid" 
                                                            @contextmenu="openContext($event ,tProduction.MProduction , d ,group)" >
                                                            <t-production-plan-grouping-chart-card
                                                                v-if="group.deleted_at === null"
                                                                :group="group"
                                                                :selected-group="selectedGroup"
                                                                :timePxScale="cTimePxScale"
                                                                :group-manager="groupManager"
                                                                :height-mode="dHeightMode"
                                                                @select-group="selectGroup"
                                                                @card-drag-start="$emit('card-drag-start' ,$event)" 
                                                                @card-drop="cardDrop"
                                                            />
                                                        
                                                        </div>
                                                    </div> 

                                                    
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-11 px-0">
                                            
                                        </div>

                                    </div>     
                                </div>

                            </div>
                            
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
        
    </div>    
</template>

<script lang="ts">
// @ts-nocheck

import _ from "lodash" ; 
import dayjs, { Dayjs } from 'dayjs';
import TProductionGroupManager from '../class/TProductionGroupManager';
import { TProductionDayGroup } from '../class/models/TProductionDayGroup';
import TProductionConsts from '../../../consts/TProductionConsts';
import { TProductionResult } from '../class/models/TProductionResult';
import MKvsConst from '../../../consts/MKvsConst';
import DayJsEx from '../../../frameworks/DayJsEx';
import NumberUtil from '../../../frameworks/NumberUtil';
import TProductionGroupGrouper from '../class/TProductionGroupGrouper';
import { TProjectProductProcessService } from '../../tProjects/class/services/TProjectProductProcessService';

export default {
    data :  function() {
        return {
            /**
             * DragLeave対策カウンター
             */
            dDdCounter : 0  ,            
            dDdCounter4LeftDay : {} , 

            /**
             * グループカードの高さモード
             */
            dHeightMode : "hour" , 

            /**
             * 24 * dTimePxScale で 1日の高さを決める
             */
            dTimePxScale : 150 ,

            /**
             * 時間の倍率
             */
            dTimeScale : 1 , 

            /**
             * 時間の倍率増分値
             */
            dTimeScaleVolume : 0.2 , 


            /**
             * 並び替え済みのリスト( 生産先ごと )
             */
            dProcessMProductionList : [] , 

            /**
             * 並び替え済みのリスト( 生産予定日ごと )
             */
            dProcessPlanedProductionAtList : [] , 

            
            /**
             * 選択可能な生産先モード
             */
            dSelectedMProductionModes : [] , 

            /**
             * 右クリックでモード選択中
             */
            dIsContextSelectedMode : false  , 

            /**
             * 右クリックされたグループ
             */
            dContextSelectedGroup : undefined , 

            /**
             * 右クリック選択中の日付
             */
            dContextSelectedDay : undefined , 


        } 
    } , 
    props : {
        /**
         * 拠点ID
         */
        mBranchId : {
            type : Number ,
        } ,

        /**
         * グループマネージャ
         */        
        groupManager : {
            type : TProductionGroupManager ,             
        } , 
        
        /**
         * 選択中のグループ
         */
        selectedGroup : {
            type : Object ,             
        } ,

    } , 
    inject : [
        "pPlannedProductionDays"
        ] ,
    computed : {

        

        /**
         * ターゲットの時間数
         */
        cTimePxScale : function () {
            
            let scale = this.dTimePxScale * this.dTimeScale ; 
            if ( scale <= 0 ) scale = this.dTimeScale  ; 

            return scale ; 
        } ,


        /**
         * 生産状態　未生産　を選択可能
         */
        cIsAbleToSelectUnplanned : function():boolean { 
            if ( this.dContextSelectedGroup === undefined ) return false ; 

            return this.dContextSelectedGroup?.status !== TProductionConsts.Results.Status.C_STATUS_PLANED ; 
        } , 
        
        /**
         * 生産状態　生産完了　を選択可能
         */
        cIsAbleToSelectFinished : function():boolean { 
            if ( this.dContextSelectedGroup === undefined ) return false ; 
            if ( this.cIsAbleCheckMismatchList ) return false ; 

            return this.dContextSelectedGroup?.status === TProductionConsts.Results.Status.C_STATUS_PLANED ; 
        } , 

        /**
         * DurstWorkFlowと連携可能か
         */
        cIsAbleToSelectDurstWorkFlow : function():boolean { 
            if ( this.dContextSelectedGroup === undefined ) return false ; 
            // console.log(this.dContextSelectedGroup) ; 
            const mProductionId = this.dContextSelectedGroup.m_production_id ; 
            const foundMProduction = this.masterStore.getMProductionById(mProductionId) ; 

            // console.log(foundMProduction ) ; 
            const softwareName = foundMProduction?.m_production_ext_tool?.software_name ; 
            // console.log(softwareName ) ; 
            if ( _.isNil( softwareName)) return false ; 

            return softwareName == "durst-workflow" ; 
            
        } , 
        
        /**
         * 関連グループ内で何かしら実績がある
         */
        cIsExistsResultIncRel : function() {
            if ( this.dContextSelectedGroup === undefined ) return false ; 
            if (! this.dContextSelectedGroup.isUnplanned || this.dContextSelectedGroup.isExistsResultsChild ) return true ; 
            return false ; 
        } , 

        /**
         * 自身に生産実績がある
         */
        cIsAbleControlResult : function() { 
            if (! this.cIsExistsResultIncRel) return true ; 

            return this.dContextSelectedGroup.isSelfResults  ; 

        } , 

        
        /**
         * 自身に不整合 事項がある
         */
        cIsAbleCheckMismatchList : function() { 
            if ( this.dContextSelectedGroup === undefined ) return false ; 
            if ( this.cIsExistsResultIncRel ) return false ; 
            return this.dContextSelectedGroup.isExistsMismatchKey  ; 

        } , 
        
        cSelectedTProductions : function() { 
            if ( this.groupManager?.tProductions === undefined || this.groupManager.tProductions.length == 0) return [] ; 
            const filterd = this.groupManager.tProductions.filter(x => x.is_selected) ;
            return filterd ; 

        } ,


        cCanChangeGroup : function() {
            const val = NumberUtil.invalid2zr(this.mainStore.getRole("t_production_grp_control-privilege")) ;
            return val >= 10 ;
        }
        



    } , 
    methods : {

        /**
         * 右クリックメニュー表示
         */
        openContext : function(event ,mProduction , d ,group) { 
            

            this.dContextSelectedGroup  = group ;

            if ( group.target == "m_production_mode" ){
                
                this.dContextSelectedDay = d ; 
                this.dIsContextSelectedMode = true  ; 
                
                this.dSelectedMProductionModes = mProduction.m_production_modes ; 
            }
            else { 
                if (this.dIsContextSelectedMode){
                    this.dIsContextSelectedMode = false  ;                     
                }
                
            }

            if (! event.ctrlKey)  event.preventDefault() ; 
            this.$refs.menu.open(event) ; 
            
        } ,

        contextTest : function(group) { 
            //console.log(group) ; 
            console.log("group uid : " + group.uid ) ; 
            console.log("group status : " + group.status ) ; 
            // console.log(group.parentGroup) ; 
            // console.log(group.finishedParentGroup) ; 
            console.log("MisMatchsIncChildren " ) ; 
            console.log(group.mismatchesIncChildren) ; 
            
            console.log(JSON.stringify( group)) ; 
            console.log(group) ; 
        } , 

        /**
         * Scroll
         */
        scrollMDTo : function(key) { 
            const scrollArea = $(this.$refs.scrollArea) ; 
            const saTop       = scrollArea.offset().top ; 
            const saScrollTop = scrollArea.scrollTop();

            const tgt = $(this.$refs[key]) ;             
            const tp = tgt.offset().top;

            const scrollVol = tp + saScrollTop - saTop ; 
            scrollArea.animate({scrollTop:scrollVol},300);

            // this.$refs.scrollArea.scrollTo(0 ,scrollVol) ; 
        } , 
        /**
         * 生産実績登録
         */
        resultInput : function(group) { 
            const g:TProductionDayGroup = group as TProductionDayGroup; 
            this.$emit("try-input-result" , g ) ; 

        } , 

        /**
         * 不整合内容を確認
         * @param group 
         */
        checkMismatch : function(group) { 
            const g:TProductionDayGroup = group as TProductionDayGroup; 
            if ( this.checkIsFinished(group)) return ; 

            this.$emit("try-check-mismatch" , g ) ; 
        } , 

        /**
         * 実績が入ってるかチェック
         * @param group 
         */
        checkIsFinished : function(group) { 

            const g:TProductionDayGroup = group as TProductionDayGroup; 
            if (! g.isUnplanned  ) {
                const finishedParentG = g.finishedParentGroup ; 
                if ( finishedParentG === undefined ) {
                    alert(`実績登録されている為、分割することができません`) ; 
                }
                else { 
                    alert(`関連グループ[${finishedParentG.title}]で実績登録されている為、分割することができません`) ; 
                }
                
                return true; 
            }
            else if ( g.isExistsResultsChild) { 
                alert("関連子グループで実績登録されている為、分割することができません") ; 
                return true ; 

            }
            return false ; 

        } , 

        separateGroup : function(group) { 
            const g:TProductionDayGroup = group as TProductionDayGroup; 
            if ( this.checkIsFinished(group)) return ; 

            this.$emit("try-separate-group" , g ) ; 

        } , 

        /**
         * 状態の変更 未生産へ
         */
        changeStatusToUnplanned : function(group ){
            const g:TProductionDayGroup = group as TProductionDayGroup ; 

            if (!confirm(`生産実績が削除されますが、未生産に変更してもよろしいですか?`)) return ;
            
            
            g.changeStatusToUnplanned() ; 

            this.emitSaveTProductionDayByGroup(g)  ; 

        } , 

        /**
         * 状態の変更 生産完了へ
         */
        changeStatusToFinished :async function(group ){
            const g:TProductionDayGroup = group as TProductionDayGroup ; 

            try { 
                const isNotUpdated = await this.groupManager.checkUpdatedAt(g.t_project_product_processes) ; 
                if (! isNotUpdated ) return ; 
            }
            catch (error) {
                this.$emit("error" , error ) ; 
                return ; 
                // this.$$errorConsole(error ,error.ep) ;                 
            }

            if (g.mismatchesIncChildrenAndParents.length > 0 ){
                alert("不一致内容が存在するため、完了処理ができません。不一致内容を反映させてください。") ; 
                return; 
            }
            
            
            const result = TProductionResult.createAsOnlyFinishedFromGroup(this.mainStore.loginMUser.id ,g) ;                     

            g.t_production_results.push(result) ;
            this.emitSaveTProductionDayByGroup(g)  ; 
            

        } , 

        emitSaveTProductionDayByGroup : function(g){
            const fromAt = DayJsEx.format( g.planed_production_at) ; 
            const fromDay = this.groupManager.finder.findByMProductionIdAndDay(g.m_production_id, fromAt) ;             
            this.emitSaveTProductionDay(fromDay ) ; 
        } ,

        /**
         * グループのモードを一括変更
         */
        changeMProductionMode : async function(modeGroup , toMode) {

            if ( this.cIsExistsResultIncRel) { 
                alert("実績登録されている為、モードを変更することができません") ; 
                return ; 
            }
            if ( this.dContextSelectedGroup === undefined ) return ; 

            try {                 
                const isNotUpdated = await this.groupManager.checkUpdatedAt(this.dContextSelectedGroup.t_project_product_processes) ; 
                if (! isNotUpdated ) return ; 
            }
            catch (error) {
                // this.$$errorConsole(error ,error.ep) ;        
                this.$emit("error" , error ) ;          
                return ; 
            }            



            if (!confirm(`モード \n"${modeGroup.title}" から \n"${toMode.name}" \nに変更してもよろしいですか?`)) return ;
            //const g:TProductionGroup = TProductionGroup.createFromObject(modeGroup); 
            const g:TProductionDayGroup = modeGroup as TProductionDayGroup; 
            
            g.updateMProductionMode( toMode) ; 


        }, 

        /**
         * Durst WorkFlowに連携
         */
        relDurstWorkFlow : function(group) { 
            this.$emit("rel-durstwf" , group ) ; 
        } , 

        /**
         * 親からデータ変更時のNotice
         */
        noticeDataChanged : function() { 
            console.log("noticeDataChanged") ;
            //this.getArrangedList() ; 
        } , 

        /**
         * 該当するDayのグループ条件取得
         */
        getGroupConditions : function(day){
            // console.log(day) ; 
            const conditions = TProductionGroupGrouper.parseConditions(day) ; 
            const actives = conditions.filter(x => x.is_selected) ;
            // console.log(actives) ; 
            return actives ; 
        } , 


        /**
         * card からの select-group emit受け取り
         * 親への通知
         */
        selectGroup : function(n) { 
            this.$emit("select-group" , n ) ; 
        } ,

        /**
         * 
         */
        selectDay : function(n) { 
            n.title = this.$$formatDay( n.day) ; 

            this.$emit("select-group" , n ) ;
        } , 


        /**
         * CardがDrop
         */
        cardDrop : function(payload ) { 
            const toGroup           = payload.toGroup           ; 
            const fromGroup         = payload.fromGroup         ;              

            // console.log("cardDrop") ; 
            this.groupManager.operator.replaceGroup( fromGroup , toGroup ) ; 

        } , 


        /**
         * 未決定に対して DragEnter 
         */
        dragEnterUnPlannned : function(event ,item ) {         
            const group = this.groupManager.dragGroup ; 
            if ( !group) return ; 

            this.dDdCounter++ ; 
        } ,


        /**
         * 未決定に対して DragLeave 
         */
        dragLeaveUnPlannned : function(event) { 
            if ( this.dDdCounter <= 0) return ; 
            this.dDdCounter -- ; 
        } , 


        /**
         * 未決定に戻す
         */
        dropToUnPlannned : function(event){
            //console.log("dropToUnPlannned") ; 
            
            const foundGroup = this.groupManager.dragGroup ; 
            if ( foundGroup === undefined) return  ; 
            const fromAt = foundGroup.planed_production_at ; 

            const isSaved = foundGroup.id !== undefined ; 
            this.groupManager.removeGroup( foundGroup ,false , true  ) ;             
            this.dDdCounter = 0 ; 
            

            if ( isSaved){
                const fromDay = this.groupManager.finder.findByMProductionIdAndDay(foundGroup.m_production_id, fromAt) ;             
                this.emitSaveTProductionDay(fromDay ) ; 
            }
            

        } ,

        isDraggingLeftDay : function(d) { 
            if ( this.dDdCounter4LeftDay[d.day] === undefined ) this.dDdCounter4LeftDay[d.day] = 0 ; 
            // console.log("cc" + this.dDdCounter4LeftDay[d.day]) ; 
            return this.dDdCounter4LeftDay[d.day] > 0  ; 
        } , 
        
        /**
         * 左の日付に対して DragEnter 
         */
        dragEnterLeftDay : function(event ,d ) {         
            const group = this.groupManager.dragGroup ; 
            if ( !group) return ; 

            if ( this.dDdCounter4LeftDay[d.day] === undefined ){
                // console.log(this.dDdCounter4LeftDay[d.day]) ; 
                this.dDdCounter4LeftDay[d.day] = 0 ; 

            }
            this.dDdCounter4LeftDay[d.day]++ ; 

            // これがあるとReactiveがなぜか働く
            this.dDdCounter = 1 ; 
            this.dDdCounter = 0 ; 
            // console.log("current" + this.dDdCounter4LeftDay[d.day]) ; 

        } ,



        /**
         * 左の日付に対して DragLeave
         */
        dragLeaveLeftDay : function(event ,d) {             
            // これがあるとReactiveがなぜか働く
            this.dDdCounter = 1 ; 
            this.dDdCounter = 0 ; 

            if ( this.dDdCounter4LeftDay[d.day] <= 0) return ; 
            this.dDdCounter4LeftDay[d.day] -- ; 
            // console.log("current L" + this.dDdCounter4LeftDay[d.day]) ; 
        } , 


        /**
         * 左の日付に対してDrop　日付の変更
         */
        dropToLeftDay : function(event ,d ){            
            this.dDdCounter4LeftDay[d.day] = 0 ; 
            const foundGroup = this.groupManager.dragGroup ; 

            this.dDdCounter4LeftDay[d.day] = 0 ; 
            // これがあるとReactiveがなぜか働く
            this.dDdCounter = 1 ; 
            this.dDdCounter = 0 ; 
            

            this.dayDrop(event, foundGroup.m_production_id , d) ;             

        } ,

        /**
         * 日付にDrop
         */
        dayDrop : async function(event, mProductionId ,d) {
            


            const foundGroup = this.groupManager.dragGroup ; 
            // console.log(`day Drop from ${foundGroup.planed_production_at} to ${d.day}` ) ; 
            
            if ( foundGroup === undefined) return  ; 
            const fromAt = foundGroup.planed_production_at ; 

            // console.log(`${d.day} from ${fromAt}`); 
            if ( mProductionId === foundGroup.m_production_id && dayjs(d.day).isSame(fromAt) ) return ; 
            // console.log("dayDrop2"); 
            // 生産先が違うとNG
            if ( mProductionId !== foundGroup.m_production_id ){
                alert('生産先を変更する場合は、上部の生産先にドロップしてください。') ; 
                return ; 
            }

            // if(! confirm('日付を変更すると変更元、変更先の予定が保存されますが、よろしいですか?')) return ; 


            await this.groupManager.operator.moveGroupMProductionDay(mProductionId , d.day ,foundGroup ,true ) ; 


            // 保存            
            // if ( foundGroup.id !== undefined){
                const toDay     = this.groupManager.finder.findByMProductionIdAndDay(mProductionId , d.day) ; 
                const fromDay   = this.groupManager.finder.findByMProductionIdAndDay(mProductionId , fromAt) ; 
                
                this.emitSaveTProductionDay(toDay   ) ; 
                this.emitSaveTProductionDay(fromDay ) ; 
                // console.log("emitSave"); 
            // }
            // console.log(`from ${foundGroup.planed_production_at} to ${d.day}`) ; 
            
        } , 
        

        /**
         * Scaleの変更
         */
        changeScale : function(isPlus = false ) {
            let vol = this.dTimeScaleVolume ; 
            if ( ! isPlus )  vol *= -1 ; 

            this.dTimeScale += vol ; 

            if ( this.dTimeScale <=  this.dTimeScaleVolume ) this.dTimeScale  = this.dTimeScaleVolume ; 
        } , 

        /**
         * 開始から終了までの時間数を取得
         */
        getNumOfHours  : function(start , end ) {            
            const s = dayjs(`2000-01-01 ${start}:00` ) ; 
            const e = dayjs(`2000-01-01 ${end}:00`) ; 

            const sHours = s.hour() ; 
            const eHours = e.hour() ; 
            const eMinutes = e.minute() ; 
            
            let numOfHours = eHours - sHours + 1 ; 
            if ( eMinutes > 0 )numOfHours++  ; 
            //console.log("numOfHours " + numOfHours) ; 
            return numOfHours ; 

        } , 

        /**
         * 開始時刻の数値
         */
        getStartHour : function(start) {
            const s = dayjs(`2000-01-01 ${start}:00` ) ; 
            return s.hour() ; 
        } , 
        
        /**
         * 開始の分数値
         */
        getStartMinute : function(start) {
            const s = dayjs(`2000-01-01 ${start}:00` ) ; 
            return s.minute() ; 
        } , 

        /**
         * Sort済みGroup取得
         */
        getCList : function ( mProductionId , day , level ) {

            // if ( _.isNil(this.value) 
            //     || this.groupManager.tProductions === undefined 
            //     || this.groupManager.tProductions.length === 0 ) return [] ; 
            if ( this.groupManager.tProductions === undefined 
                || this.groupManager.tProductions.length === 0 ) return [] ; 

            
            const prodFound = this.groupManager.tProductions.find( x => x.MProduction.id == mProductionId) ; 
            if ( prodFound.t_production_days === undefined) return [] ; 

            const dayFound = prodFound.t_production_days.find( x => dayjs(x.day).isSame(day)) ; 

            if ( dayFound === undefined) return [] ; 
            
            //console.log(dayFound) ; 
            if (level == 0 ){
                return dayFound.groups.filter(x => _.isNil(x.deleted_at)) ; 
            } 
            else { 
                return this.getChildList(dayFound.groups , 0 , level) ; 
            }
            
        } , 

        getChildList : function( groups , currentLevel ,byLevel ) {
            const rtn = [] ; 
            // console.log("AA") ;     
            for ( const group of groups ){
                if (_.isNil(group.deleted_at)){
                    if ( currentLevel >= byLevel - 1 ){
                        // console.log(`Hit :${currentLevel} ${byLevel} `)
                        //console.log(group) ; 
                        
                        rtn.push(...group.groups) ;                     
                    }
                    else {
                        // console.log(`No Hit :${currentLevel} ${byLevel} `)
                        // console.log(group) ; 
                        const childRtn = this.getChildList(group.groups ,currentLevel + 1 , byLevel ) ; 
                        //console.log(childRtn) ; 
                        rtn.push(...childRtn) ; 
                    }

                }
            }
            
            return rtn ; 
        } ,

        /**
         * リロード
         */
        emitReloadDay : async function(day) { 
            this.$emit("reload-day" ,day) ;             

        } , 

        emitGroupConditions : function(day ) { 
            if ( day.isExistsResults ) {
                alert("実績が登録されている為、グループの変更ができません") ; 
                return ; 
            }

            
            this.$emit("group-conditions" ,day) ; 
        } , 

        emitGetUnplanned : function(day ) { 
            this.$emit("get-unplanned" ,day) ; 
        } , 
        emitSaveTProductionDay : function(day ) { 
            this.$emit("save-tproduction-day" ,day) ; 
        } , 

        emitDeleteTProductionDay : function(day ) { 
            // 実績入ってれば削除不可
            if ( day.isExistsResults ) {
                alert("実績が登録されている為、削除できません") ; 
                return ; 
            }

            if (!confirm('予定データを削除してもよろしいですか?')) return ;
            this.$emit("delete-tproduction-day" ,day ) ; 
        } , 
        

    } , 
    created : function() {        
    }
}
</script>
<style scoped>
    div.border-bottom-schedule:nth-child(odd) {
        border-bottom-width: 0.5px  !important;
        border-bottom-color: #6c757d !important;
        border-bottom-style: dashed  !important;
    } 
    div.border-bottom-schedule:nth-child(even) {
        border-bottom-width: 0.5px  !important;
        border-bottom-color: #6c757d !important;
        border-bottom-style: solid  !important;
    }
    .scroll-area { 
        /* height : calc( 100vh - 310px ) !important  ;  */
        height : calc( 100vh - 200px) !important  ;  
        overflow-y : auto !important;
        overflow-x : hidden ; 
    }
    .hour-area { 
        width : 3rem !important ; 
    }


    .drop-hover:hover > .dropdown-menu {
        display: block !important;
    }

    .dropright .dropdown-menu{
        margin-top : -0.5rem !important; 
        margin-left : 0rem !important ; 
    }

</style>