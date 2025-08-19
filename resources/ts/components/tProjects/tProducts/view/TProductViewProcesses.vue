<template>
    <div>
        <div v-for="(process, index) in value" 
            v-if="process.is_enabled">
            <div class="row">
                <div class="col-9 col-xl-2">
                    {{getMProcessCategoryName(process)}}
                </div>
                <div class="col-3 col-xl-1 pl-4 pl-xl-3" 
                    :class="getMBranchColor(process.m_branch_id)">
                    {{getMBranchName(process)}}
                </div> 
                <!-- <div v-if="isViewResultControl" class="col-12 col-xl-1"> -->
                <!-- <div class="col-12 col-xl-1">
                    <div class="d-flex flex-wrap flex-xl-nowrap justify-content-end " >
                        
                        <a @click.prevent="changeStatusToFinished(process)" href="#" class="text-success">
                            <i class="fas fa-check fa-fw"></i> 
                        </a>
                        <a @click.prevent="changeStatusToUnplanned(process)" href="#" class="text-danger ml-3">
                            <i class="fas fa-trash fa-fw"></i>
                        </a>
                        <a @click.prevent="" class="text-info ml-3">
                            <i class="fas fa-pen fa-fw"></i> 
                        </a>
                    </div>
                    
                </div> -->
                

                <div class="pl-4 pl-xl-3 col-12 col-xl-3" >
                    <div class="row">
                        <div v-for="plan in process.t_production_process_plans" :key="plan.id"
                            class="w-100"
                            >
                            <div v-if="process.getResults( plan).length === 0 "
                                class="col-12 text-success">
                                {{getPlanDay(plan)}} 予定
                            </div>
                            <div v-else class="w-100">
                                <div v-for="result in process.getResults( plan)" :key="result.id" 
                                    :class="result.result_type_flg == 0 ? 'bg-alpha-red' : 'bg-alpha-orange'"
                                    class="w-100"
                                        >
                                    <span v-if="result.result_type_flg == 0">
                                        {{$$formatDay(result.started_at)}} {{result.minutes - result.StopMinutes}}分 {{getUserNames(result.t_production_result_users)}}
                                    </span>
                                    <span v-if="result.result_type_flg == 1">
                                        {{$$formatDay(result.started_at)}} {{result.minutes}}分 {{result.memo}}
                                    </span>
                                    

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
                
                <!-- <div class="col-3 col-xl-2 pl-4 pl-xl-3">
                    {{getPredictedWorkHour(process).toFixed(2)}} h
                </div> -->
                <div class="pl-4 pl-xl-3"
                    :class="isViewResultControl ? `col-12 col-xl-5 ` : 'col-12 col-xl-6 '">
                    <t-product-view-process-label 
                        :is-production="isProduction"
                        v-model="value[index]" />
                </div>
            </div>
            
        </div>
    </div>

</template>

<script lang="ts">
import _ from 'lodash';
import DayJsEx from '../../../../frameworks/DayJsEx';
import NumberUtil from '../../../../frameworks/NumberUtil';
import ObjectUtil from '../../../../frameworks/ObjectUtil';
import { TProjectProductProcess } from '../../class/models/TProjectProductProcess';
import { TProductionResult } from '../../../tProductions/class/models/TProductionResult';
import { TProductionProcessPlan } from '../../../tProductions/class/models/TProductionProcessPlan';

export default {
    data :  function() {
        return {



        } 
    } , 
    props : {
        /**
         * t_project_product_processのレコード
         */
        value : {
            type : Array ,             
        } , 
        index : {
            type : Number , 
        } ,

        /**
         * 生産モード ( display_dispを使用 が)
         */
        isProduction : { 
            type : Boolean , 
            default : () => false , 
        } ,
        /**
         * 生産実績操作用パネル表示
         */
        isViewResultControl : { 
            type : Boolean , 
            default : () => false , 
        } ,

        
    } ,
    computed : {
        

    } ,
    methods : {

        

        /**
         * 拠点色
         */
        getMBranchColor : function (n:number):string  {
            // @ts-ignore
            const found = this.masterStore.getMBranchColorById(n ) ;                         
            return ObjectUtil.isNUE( found) ? "" : "text-" + found ; 
        } , 

        /**
         * 値がNull Undefinedではない
         */
        isValidVal : function(val:any) 
        {
            return ! ObjectUtil.isNullOrUndefined(val) ; 
        } , 

        
        /**
         * 工程の予測時間を取得
         */
        getPredictedWorkHour : function(tpProcess:TProjectProductProcess) {
            // @ts-ignore
            return NumberUtil.invalid2zr( tpProcess.predicted_work_hour) ; 
        } , 

        getValue : function(colName:string ):any{            
            // @ts-ignore
            return this.$$getValue("value" , colName) ; 
        } ,
        setValue : function(colName:string , val:any){               
            // @ts-ignore
            this.$$setValue("value" , colName , val  ) ;
        } ,
        
        /**
         * 拠点名
         */
        getMBranchName : function (n:TProjectProductProcess)  {
            // @ts-ignore
            const finded = this.masterStore.getMBranchById(n.m_branch_id ) ; 
            return finded === undefined ? "" : finded.shortNameOrName ; 
        } , 

        /**
         * 工程名
         */
        getMProcessCategoryName : function (n:TProjectProductProcess)  {
            // @ts-ignore
            const finded = this.masterStore.getMProcessCategoryById(n.m_process_category_id ) ; 
            return finded === undefined ? "" : finded.name; 
        } , 

        getPlanDay : function(plan:TProductionProcessPlan ) { 
            if ( _.isNil(plan?.t_production_day_group)) return "" ; 

            return DayJsEx.format(plan.t_production_day_group.planed_production_at ,"YYYY-MM-DD ")  ; 
        } , 


        getUserNames : function(users:any) { 
            let names = [] ; 
            for ( const user of users){
                // @ts-ignore
                const found = this.masterStore.getMUserById(user.m_user_id) ;
                names.push(found.last_name) ; 
                
            }

            return names.join(",") ; 
        } ,

        /**
         * 状態の変更 未生産へ
         */
        changeStatusToUnplanned : function(process:TProjectProductProcess ){

            const p:TProjectProductProcess = process as TProjectProductProcess ; 

            // if (!confirm(`生産実績が削除されますが、未生産に変更してもよろしいですか?`)) return ;
            
            // const savedResults = p.t_production_results.filter(x => ! _.isNil(x.id) )            
            // p.t_production_results.splice(0) ; 

            // for ( const r of savedResults){
            //     r.deleted_at = new Date() ; 
            // }

            // p.t_production_results.push(...savedResults) ; 

            
            

        } , 

        /**
         * 状態の変更 生産完了へ
         */
        changeStatusToFinished : function(process:TProjectProductProcess ){
            
            // @ts-ignore
            // const result = TProductionResult.createAsOnlyFinishedFromProcess(this.mainStore.loginMUser.id , process) ; 
            // process.t_production_results.push(result) ; 

            
            // ProductionDay保存後にgetTProjectProductを実行してもらう。
            
        } , 

        
    }

}
</script>
