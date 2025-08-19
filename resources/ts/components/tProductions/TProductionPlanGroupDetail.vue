<template>
    <div class="row bg-app-secondary" style="margin-bottom: 20rem !important;">
        <div>
            
        </div>
        <!-- 右クリックメニュー -->
        <vue-context ref="menu" class="list-group position-fixed dropdown-menu bg-dark" >
            <li>
                <a class="dropdown-item" href="#" v-if="$$cIsDebug"
                    @click.prevent="contextTest(dContextSelectedProcess)">TEST</a>
            </li>
            


            <li v-if="cIsAbleControlResult" class="dropright drop-hover" >
                <a class="dropdown-item-text dropdown-toggle" href="#" data-toggle="dropdown">生産状態</a>
                <ul class="dropdown-menu bg-dark">
                    <li>
                        <a class="dropdown-item" href="#" v-show="cIsAbleToSelectUnplanned"
                            @click.prevent="changeStatusToUnplanned(dContextSelectedProcess )">未生産</a>
                        <a class="dropdown-item" href="#" v-if="cIsAbleToSelectFinished"
                            @click.prevent="changeStatusToFinished(dContextSelectedProcess )">生産完了</a>
                    </li>

                </ul>

            </li>            
            <li v-if="cIsAbleControlResult" >
                <a class="dropdown-item" href="#"
                    @click.prevent="resultInput(dContextSelectedProcess)">生産実績詳細</a>
            </li>

        </vue-context>
                
        <div class="col-12 ">
            <div class="row card rounded-0 bg-app-secondary ">
                <div class="card-header d-flex">
                    <div >
                        <button
                            @click.prevent="returnViewMode()"
                            type="button" class="btn btn-dark" >
                            <span class="h5">
                                <i class="fas fa-arrow-left fa-fw"></i>
                            </span>
                            
                            
                        </button>
                    </div>
                </div>
                <div class="col-12" >
                    <div class="row">
                        <div class="col-12">
                            <div class="d-flex flex-nowrap mt-2">
                                <h4>{{cMProductionName}}</h4>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-12 px-0">
                            <div class="card rounded-0 bg-dark " >
                                <div class="card-header">{{$$formatDay(this.cSelectedGroup.planed_production_at)}}</div>
                            </div>

                            <!-- グループエリア -->                    
                            <div class="row mt-2 mb-4 mx-3" >
                                <div class="col" v-if="selectedGroup !== undefined">
                                    <t-production-plan-grouping-chart-card       
                                        :group="cSelectedGroup"
                                        :selected-group="cSelectedGroup"
                                        :timePxScale="cTimePxScale"
                                        height-mode="fixed"
                                    />
                                </div>

                                <div class="col" v-for="lv in cDeepLevel" :key="lv">
                                    <div v-for="n in cAllGroups" :key="n.uid" >
                                        <t-production-plan-grouping-chart-card
                                            v-if="n.level  === (lv + cSelectedGroup.level)"       
                                            :group="n"
                                            :selected-group="cSelectedGroup"
                                            :timePxScale="cTimePxScale"
                                            height-mode="fixed"
                                            @select-group="selectGroup"
                                        />
                                        
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>


                    <!-- 明細エリア -->


                    <div class="row" v-if="dIsLoadingProduct">
                                     
                        <div class="col-12 position-absolute spinner-area vh-100 bg-dark" style="z-index:10;opacity:0.5;">
                            
                        </div>
                        <div class="col-12 position-absolute spinner-area vh-100 d-flex justify-content-center align-items-center" style="z-index:11">
                            <span class="spinner-border text-primary" style="opacity:1" />
                        </div>

                    </div>                    
                    
                    <div class="row bg-dark" >

                        
                        <div class="col-12 col-md-10 col-xl-5 px-md-0 overflow-auto scroll-area" >
                            <div class="card bg-dark p-3" v-for="(n ,index) in cProcessList"
                                :key="n.id"
                                :class="{ 
                                    'dark-deep-selected':
                                        dSelectedTProductProcess !== undefined && 
                                        dSelectedTProductProcess.id === n.id , 
                                    'bg-alpha-purple' : isFinished(n) ,     
                                    }"
                                @click.prevent="selectTProductProcess(n)"      
                                @contextmenu="openContext($event ,n)"      
                                >

                                <t-production-plan-group-detail-card 
                                    v-model="cProcessList[index]"
                                />
                            </div>
                        </div>

                        <!-- 編集エリア -->
                        <div class="col-12 col-xl-7 px-xl-0">
                            <div class="card bg-dark" v-if="dSelectedTProjectProduct !== undefined && ! dIsEditingProduct">

                                <div class="card-header d-flex">
                                    <div>&nbsp;</div>
                                    <div class="ml-auto">
                                        <!-- <a href="#" @click.prevent="changeProductEditingMode">編集モード</a> -->
                                    </div>
                                    
                                </div>
                                <div class="col-12 mt-2" >
                                    
                                    <t-project-view
                                        v-model="dSelectedTProjectProduct.t_project"
                                        />
                                    <t-product-view-title
                                        v-model="dSelectedTProjectProduct"
                                        />

                                    <div class="row mt-2">
                                        <div class="col-xl-2 text-center">
                                            <t-product-view-thumbnail 
                                                v-model="dSelectedTProjectProduct"
                                                :size="'sm'"
                                                />
                                        </div>
                                        <div class="col-12 col-xl-4">
                                            <t-product-view-info                                    
                                                v-model="dSelectedTProjectProduct"
                                            />
                                        </div>
                                        <div class="col-12 col-xl-4" v-if="cIsSepSelectedTProduct">
                                            <t-product-view-separation 
                                                v-model="dSelectedTProjectProduct"
                                                :index="0" />
                                        </div>

                                        <div class="col-12 col-xl-4 pl-xl-3" v-if="cIsBLSelectedTProduct">
                                            <t-product-view-board-layout                                     
                                                v-model="dSelectedTProjectProduct"
                                                :index="0" />

                                        </div>



                                    </div>

                                    <div class="row">
                                        <div class="col-12">
                                            <t-product-view-processes 
                                                :is-production="true"
                                                v-model="dSelectedTProjectProduct.t_project_product_processes" />                    
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-12 pt-3">
                                            <div class="border-bottom">
                                                <h5>納品情報</h5>     
                                            </div>
                                            <t-project-view-delivery
                                                v-model="dSelectedTProjectProduct.t_project"
                                             />
                                            
                                            
                                        </div>


                                    </div>

                                    <div class="row">
                                        <div class="col-12 pt-3">
                                            <div class="border-bottom">
                                                <h5>物件内 他商品</h5>     
                                            </div>

                                            <div class="row">
                                                <ul class="list-group list-group-flush">
                                                    <li v-for="( n ,index ) in cSelectedTProjectOtherProducts"            
                                                    class="px-3 list-group-item bg-dark">
                                                        <div class="row" v-if="n.deleted_at == null">
                                                            <t-product-view-row-component 
                                                                :value="n" 
                                                                :is-production="true"
                                                                :index="index" />
                                                        </div>
                                                    </li>
                                                </ul>

                                            </div>

                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-12 pt-3">
                                            <div class="border-bottom">
                                                <h5>メール</h5>     
                                            </div>                                
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <!-- 商品編集 -->
                            <div class="row" v-if="dSelectedTProjectProduct !== undefined && dIsEditingProduct">
                                
                                <div class="col-12" >
                                    <t-product-edit                                     
                                        v-model="dSelectedTProjectProduct"
                                        :t-project="cSelectedTProject"
                                        :is-view-mode="false"
                                        :is-view-price="false"
                                        :isAbleToInputPlanProductionAt="true"
                                        @save="saveProduct"
                                        >
                                    </t-product-edit> 



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
import DayJsEx from '../../frameworks/DayJsEx';
import dayjs from 'dayjs';
import ObjectUtil from '../../frameworks/ObjectUtil';
import MKvsConst from '../../consts/MKvsConst';
import { TProjectProductProcess } from '../tProjects/class/models/TProjectProductProcess';
import TProductionConsts from '../../consts/TProductionConsts';
import { TProductionResult } from './class/models/TProductionResult';
import { filter } from 'vue/types/umd';
import ITProductionUtil from './class/ITProductionUtil';
import TProductionGroupManager from './class/TProductionGroupManager';
import { TProjectProduct } from '../tProjects/class/models/TProjectProduct';

export default {
    data :  function() {
        return {

            /**
             * 24 * dTimePxScale で 1日の高さを決める
             */
            dTimePxScale : 150 ,

            /**
             * 時間の倍率
             */
            dTimeScale : 1 , 

            /**
             * 商品データロード中
             */
            dIsLoadingProduct : false , 

            /**
             * 編集中
             */
            dIsEditingProduct : false , 
            
            /**
             * 選択中の物件工程
             */
            dSelectedTProductProcess : undefined , 

            /**
             * 選択中の商品
             */
            dSelectedTProjectProduct : undefined , 

            /**
             * 右クリックされた工程
             */
            dContextSelectedProcess : undefined , 

        } 
    } , 
    props : {
        /**
         * t_project_product_processのリスト
         */
        value : {
            type : Array ,
            default : () => [] , 
        } , 
        /**
         * グループマネージャ
         */        
        groupManager : {
            type : TProductionGroupManager ,             
        } , 
        

        /**
         * 拠点ID
         */
        mBranchId : {
            type : Number ,
        } ,
        /**
         * 生産先
         */        
        mProductions : {
            type : Array ,             
        } , 

        /**
         * 生産予定日
         */
        tProductionDays : {
            type : Array ,             
        } , 

        /**
         * 選択されているグループ
         */
        selectedGroup : {
            type : Object ,
        } ,

        

    } , 
    computed : {
        
        /**
         * URLエンドポイント
         */
        cEndpointBase4Product : function () 
        {
            return  `api/tProjectProduct`  ;
        } ,        

        cIsNotReady : function () {
            return true ; 
            //return _.isNil(this.value) || this.value.length === 0 ;  
        } , 

        /**
         * 何回層まであるか
         */
        cDeepLevel : function () { 
            if (_.isNil(this.cSelectedGroup)) return 0 ; 

            let deepLevel = 0 ; 

            const func = (group , level) => { 
                if ( group.groups === undefined || group.groups.length === 0 ) return level ; 

                let currLevel = level + 1 ; 
                currLevel = func(group.groups[0] , currLevel) ; 
                return currLevel ; 
                

            } ; 

            deepLevel = func(this.cSelectedGroup ,deepLevel) ;
            return deepLevel ; 

        } , 

        

        /**
         * カードの表示スケール
         */
        cTimePxScale : function () { 
            let scale = this.dTimePxScale * this.dTimeScale ; 
            if ( scale <= 0 ) scale = this.dTimeScale  ; 

            return scale ; 

        } , 

        
        /**
         * 全グループ
         */
        cAllGroups : function() { 
            if ( _.isNil(this.cSelectedGroup.groups)) return [] ; 

            return this.cSelectedGroup.getGroupsWithChildren().filter(x => _.isNil(x.deleted_at) ); 
            
        } , 

        /**
         * グループの選択
         */
        cSelectedGroup : function() { 
            if ( _.isNil(this.selectedGroup)) return {} ; 

            return this.selectedGroup ; 

        } , 


        /**
         * 選択中の生産先名
         */
        cMProductionName : function() { 
            if ( _.isNil( this.cSelectedGroup?.m_production_id )) return "" ; 

            //console.log("this.cSelectedGroup.m_production_id  " + this.cSelectedGroup.m_production_id ) ; 
            const findedProduction = this.masterStore.getMProductionById(this.cSelectedGroup.m_production_id ) ; 
            return findedProduction.name ; 

        } , 

        
        /**
         * 選択中の工程の商品
         */
        cSelectedTProduct : function() {
            // return this.dSelectedTProjectProduct  ; 
            // if ( ! _.isNil(this.dSelectedTProjectProduct ))
            return this.dSelectedTProductProcess?.t_project_product ; 

        } ,

        /**
         * 選択中の工程の案件
         */
        cSelectedTProject : function() {
            return this.dSelectedTProjectProduct?.t_project ; 

        } ,

        /**
         * 選択中の案件の他商品
         */
        cSelectedTProjectOtherProducts : function() {
            const _this = this ;

            if ( _.isNil(this.cSelectedTProject?.t_project_products)) return [] ; 

            const parasedProducts = this.cSelectedTProject.t_project_products.map(x => TProjectProduct.parse(x)) ; 
            
            
            const filterd = parasedProducts.filter(x => x.id !== _this.cSelectedTProduct?.id) ; 
            return filterd ; 
        } ,

        /**
         * 選択中の商品分割があるかどうか
         */        
        cIsSepSelectedTProduct : function() {
            
            if(this.dSelectedTProjectProduct == undefined) return false ;
            if ( ObjectUtil.isNU(this.dSelectedTProjectProduct?.t_project_product_separates) || 
                this.dSelectedTProjectProduct?.t_project_product_separates.length < 3 ) return false ; 
            
            return true ; 
        } , 

        /**
         * 選択中の商品板レイアウトがあるかどうか
         */        
        cIsBLSelectedTProduct : function() {
            
            if(this.dSelectedTProjectProduct == undefined) return false ;
            if ( ObjectUtil.isNU(this.dSelectedTProjectProduct?.t_project_product_boardlayouts) || 
                this.dSelectedTProjectProduct.t_project_product_boardlayouts.length === 0 ) return false ; 

            return true ; 
        } , 

        // cDay : function() { 
        //     if ( _.isNil( this.cSelectedGroup?.planed_production_at )) return "" ; 
        //     return this.$$formatDay(this.cSelectedGroup.planed_production_at) ; 
        // } ,

        /**
         * 工程のリスト
         */
        cProcessList : function() { 
            if ( _.isNil( this.cSelectedGroup?.t_project_product_processes )) return [] ; 

            return this.cSelectedGroup.t_project_product_processes ; 
        } , 


        /**
         * 生産状態　未生産　を選択可能
         */
        cIsAbleToSelectUnplanned : function() { 
            if ( this.dContextSelectedProcess?.t_production_results === undefined ) return false ; 

            const filtered = this.dContextSelectedProcess.t_production_results.filter(x => _.isNil(x.deleted_at)) ; 
            return filtered.length > 0 ; 
        } , 
        
        /**
         * 生産状態　未生産　を選択可能
         */
        cIsAbleToSelectFinished : function() { 
            if ( this.dContextSelectedProcess?.t_production_results === undefined ) return false ; 

            return ! this.cIsAbleToSelectUnplanned ;             
        } , 

        /**
         * 実績編集可能か
         */
        cIsAbleControlResult : function() { 


            if (_.isNil( this.cSelectedGroup?.t_production_results ) ) return false ; 

            // if ( this.cSelectedGroup.status !== TProductionConsts.Results.Status.C_STATUS_PLANED  ) return false ; 
            const filterd = this.cSelectedGroup.t_production_results.filter(x => _.isNil(x.deleted_at )) ; 
            return filterd.length == 0  ; 
            
        } , 
        
        


    } , 
    methods : {
        returnViewMode : function () {
            this.$emit("mode-change" ,"chart"  ) ; 
        } , 

        selectGroup : function(n) { 
            this.$emit("select-group" , n ) ; 
        } , 


        /**
         * 物件商品工程選択
         */
        selectTProductProcess : function(n) {
            if ( this.dIsLoadingProduct ) return ; 

            if ( n === this.dSelectedTProductProcess) return ; 

            this.dIsEditingProduct = false ; 
            this.$emit("update:is-editing" , this.dIsEditingProduct) ;             
            this.dSelectedTProductProcess = n ; 

            this.getTProjectProduct() ; 

        } , 

        
        /**
         * 商品の編集モードの変更
         */
        changeProductEditingMode : function() {
            this.dIsEditingProduct = ! this.dIsEditingProduct ; 
            
        } , 

        
        /**
         * 商品の情報取得
         */
        getTProjectProduct : async function () {
            try {            
                this.dIsLoadingProduct = true ; 
                const res = await axios.get(this.cEndpointBase4Product + `/${this.cSelectedTProduct.id}`) ; 

                // console.log("TPRO " + this.cSelectedTProduct.id) ; 
                
                const data = res.data ; 
                const mProductCategoryId = data.m_product_category_id ; 
                //console.log(data)  ; 
                for ( const process of data.t_project_product_processes ) {
                    const mProcessCategoryId = process.m_process_category_id ; 
                    const mProcessCategory = this.masterStore.getMProcessCategoryWtPivotByIds(mProductCategoryId ,mProcessCategoryId ) ; 
                    process.m_process_category = mProcessCategory ; 
                }

                this.dSelectedTProjectProduct = TProjectProduct.parse( data ) ;  

                
                
            }
            catch (error) 
            {
                // handle error
                error.ep = this.cEndpointBase4Product + `/${this.cSelectedTProduct.id}` ; 
                this.$emit("error" , error ) ;  
                // this.$$errorConsole(error ,) ; 
                this.dProcessList = [] ; 

            }
            finally {
                this.dIsLoadingProduct = false ; 
                //this.dIsLoadingProcesses = false ;
            }

        } , 

        isFinished : function(n) { 
            if ( _.isNil(n?.t_production_results) ) return false ; 

            const notDeleted = n.t_production_results.filter(z => _.isNil(z.deleted_at)) ; 
            return notDeleted.length > 0  ; 
        } , 


        saveProduct : function(){

        } , 
        
        
        /**
         * 右クリックメニュー表示
         */
        openContext : function(event ,process) { 
            

            this.dContextSelectedProcess  = process ;

            if (! event.ctrlKey)  event.preventDefault() ; 
            this.$refs.menu.open(event) ; 
            
        } ,

        contextTest : function (p)  { 
            console.log(p) ; 
        } , 

        /**
         * 状態の変更 未生産へ
         */
        changeStatusToUnplanned : function(process ){


            const p:TProjectProductProcess = process as TProjectProductProcess ; 

            if (!confirm(`生産実績が削除されますが、未生産に変更してもよろしいですか?`)) return ;
            
            const savedResults = p.t_production_results.filter(x => ! _.isNil(x.id) )            
            p.t_production_results.splice(0) ; 

            for ( const r of savedResults){
                r.deleted_at = new Date() ; 
            }

            p.t_production_results.push(...savedResults) ; 

            // ProductionDay保存後にgetTProjectProductを実行してもらう。
            let func = undefined ; 
            if ( this.cSelectedTProduct?.id === process.t_project_product.id){                
                func =this.getTProjectProduct ; 
            }
            this.emitSaveTProductionDay(func)  ; 
            

        } , 

        /**
         * 状態の変更 生産完了へ
         */
        changeStatusToFinished : async function(process ){
            const dayGroupId = process.t_production_process_plan?.t_production_day_group_id ; 
            if ( _.isNil( dayGroupId )) { 
                alert('工程の実績を登録する為に、予定を保存してください。') ; 
                return ; 
            }

            // 更新チェック
            try { 
                const isNotUpdated = await this.groupManager.checkUpdatedAt([process]) ; 
                if (! isNotUpdated ) return ; 
            }
            catch (error) {
                this.$emit("error" , error ) ;          
                return ;                 
            }


            // console.log("MProduId:" + this.selectedGroup.m_production_id) ; 
            // console.log(this.selectedGroup) ; 
            
            const result = TProductionResult.createAsOnlyFinishedFromProcess(
                this.mainStore.loginMUser.id , 
                process ,
                this.selectedGroup.m_production_id , 
                this.selectedGroup.planed_production_at ,
                ) ; 
            process.t_production_results.push(result) ; 

            
            // ProductionDay保存後にgetTProjectProductを実行してもらう。
            let func = undefined ;             
            if ( this.cSelectedTProduct?.id === process.t_project_product.id){
                func = this.getTProjectProduct ;  
            }
            this.emitSaveTProductionDay(func)  ; 

        } , 


        /**
         * 生産実績登録
         */
        resultInput : function(process) { 
            const p:TProjectProductProcess = process as TProjectProductProcess ; 
            
            const dayGroupId = process.t_production_process_plan?.t_production_day_group_id ; 
            if ( _.isNil( dayGroupId )) { 
                alert('工程の実績を登録する為に、予定を保存してください。') ; 
                return ; 
            }

            const day = DayJsEx.format( this.selectedGroup.planed_production_at) ; 
            let func = undefined ;       
            // console.log(` ${this.cSelectedTProduct?.id} - ${process.t_project_product.id}`)       ; 
            if ( this.cSelectedTProduct?.id === process.t_project_product.id){
                // console.log("hit") ;                 
                func = this.getTProjectProduct ;  
            }
            
            const payload =  { 
                process:p , 
                m_production_id:this.selectedGroup.m_production_id ,  
                day:day , 
                afterFunc:func
            } ;

            // console.log("payload") ; 
            // console.log(payload) ; 

            this.$emit("try-input-result" ,payload ) ; 

        } , 

        emitSaveTProductionDay : function(afterFunc = undefined ) { 
            if ( _.isNil( this.selectedGroup)) return ; 

            const fromAt = DayJsEx.format( this.selectedGroup.planed_production_at) ; 
            const fromDay = this.groupManager.finder.findByMProductionIdAndDay(this.selectedGroup.m_production_id, fromAt) ;             
            // console.log(fromDay) ; 
            this.$emit("save-tproduction-day" ,{ day : fromDay , afterfunc:afterFunc }) ; 

            
        } , 

        
        noticeReload : function() { 
            // console.log("noticeReload") ; 
            if ( _.isNil(this.dSelectedTProductProcess) || _.isNil(this.selectedGroup)) return ; 

            const processId = this.dSelectedTProductProcess.id ; 
            this.dSelectedTProductProcess = this.selectedGroup.t_project_product_processes.find(x => x.id === processId) ; 
            

        }


    } ,
    created : function() {        
    }
}
</script>
<style scoped>


    .drop-hover:hover > .dropdown-menu {
        display: block !important;
    }

    .dropright .dropdown-menu{
        margin-top : -0.5rem !important; 
        margin-left : 0rem !important ; 
    }
</style>