<template>                            
    <div class="px-3" :class='{
            "bg-app-secondaly" : !cIsNormalResultType , 
            "pt-1" : !cIsNormalResultType
        }'>
        <validation-observer v-slot="{ invalid }">
            <div class="row">
                <div class="col-12 col-xl-2">
                    <validation-provider                                                    
                        :vid="`productionGroupResultRow-cInputTypeMkvId${value.tmp_id}`"                
                        rules="required|excluded:0" 
                        name="入力タイプ"
                        immediate v-slot="{ errors }">
                        <div class="form-group">
                            <label >入力タイプ</label>                                                
                            <m-kv-select
                                v-model="cInputTypeMkvId"
                                :kv-key="'t_production_results-input_type'"
                                >
                            </m-kv-select>
                            <span class="validation-error">{{ errors[0] }}</span>
                        </div>    
                    </validation-provider>
                </div>  

                <div class="col-12 col-xl-3 pl-xl-0" v-if="! cIsNormalResultType">
                    <validation-provider                                                    
                        :vid="`productionGroupResultRow-cMemo${value.tmp_id}`"                
                        rules="required" 
                        name="内容"
                        immediate v-slot="{ errors }">
                        <div class="form-group">
                            <label>内容</label>
                            <input v-model="cMemo" class="form-control" />
                            <span class="validation-error">{{ errors[0] }}</span>
                        </div>
                    </validation-provider>
                    
                </div>  


                <!-- <div class="col-6 col-xl-1 pl-xl-0">
                    <div class="form-group text-center">
                        <label >生産完了</label>                                                
                        <ns-checkbox-input
                            v-if="cInputTypeMkvId === dInputOnlyIsFinishedMKvId"
                            v-model="cIsFinished"
                            :id="'ProductionResultIsFinished'"
                            />
                        <div v-else class="mt-2">
                            完了
                        </div>
                    </div>
                </div> -->

                <div class="col-6 col-xl-1 pl-xl-0">
                    <div class="form-group">
                        <label >所要分数</label>    
                        <div v-if="cInputTypeMkvId === dInputOnlyMinutesMKvId">
                            <validation-provider                                                    
                                :vid="`productionGroupResultRow-cMinutes${value.tmp_id}`"                
                                rules="required|min_value:1" 
                                name="所要分数"
                                immediate v-slot="{ errors }">
                                <ns-number-input v-model="cMinutes" />
                                <span class="validation-error">{{ errors[0] }}</span>
                            </validation-provider>
                        </div>
                        <div v-else class="mt-2">
                            {{cCalcedMinutes}}
                        </div>
                    </div>
                </div>

                <div class="col-12 pl-xl-0"
                    :class='{
                        "col-xl-9" : cIsNormalResultType , 
                        "col-xl-6" : ! cIsNormalResultType , 
                    }'>                    
                    <div class="d-flex flex-wrap flex-xl-nowrap" >
                        <div class="form-group">
                            <label class="px-2 ">作業開始</label>
                            <div class="d-flex flex-no-wrap">
                                <validation-provider
                                    :vid="`productionGroupResultRow-cStartedAtDay${value.tmp_id}`"                
                                    rules="required|custom_rule_date_day_required" 
                                    name="作業開始日"
                                    immediate v-slot="{ errors }">  
                                    <ex-v-date-picker 
                                        v-model="cStartedAtDay"
                                        readonly
                                        aria-readonly="true"/>
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </validation-provider>
                                <validation-provider
                                    :vid="`productionGroupResultRow-cStartedAtTime${value.tmp_id}`"                
                                    :rules="`${ cInputTypeMkvId === dInputAllMKvId ? 'required|custom_rule_date_hhmm_required' : ''}`" 
                                    name="作業開始時刻"
                                    immediate v-slot="{ errors }">                                        
                                    <input 
                                        v-model="cStartedAtTime"
                                        type="time" class="form-control app-input-time ml-2"
                                        min="00:00" max="23:59" />
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </validation-provider>

                                <span class="px-2 pt-2">～</span>                                            
                            </div>                                        
                        </div>

                        <div class="form-group mr-2">
                            <label class="px-2 ">作業終了</label>
                            <div class="d-flex flex-no-wrap"
                                v-if="cInputTypeMkvId === dInputAllMKvId">
                                <validation-provider
                                    :vid="`productionGroupResultRow-cEndedAtDay${value.tmp_id}`"                
                                    :rules="`${ cInputTypeMkvId === dInputAllMKvId ? 'required|custom_rule_date_day_required' : ''}`" 
                                    name="作業終了日"
                                    immediate v-slot="{ errors }">                                        
                                    <ex-v-date-picker 
                                        v-model="cEndedAtDay"
                                        readonly
                                        aria-readonly="true"/>
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </validation-provider>
                                <validation-provider
                                    :vid="`productionGroupResultRow-cEndedAtTime${value.tmp_id}`"                
                                    :rules="`${ cInputTypeMkvId === dInputAllMKvId ? 'required|custom_rule_date_hhmm_required' : ''}`" 
                                    name="作業終了時刻"
                                    immediate v-slot="{ errors }">                                        
                                    <input 
                                        v-model="cEndedAtTime"
                                        type="time" class="form-control app-input-time ml-2" />
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </validation-provider>
                            </div>
                            <div v-else class="mt-2">
                                {{cCalcedEndedAt}}
                            </div>
                        </div>          

                        <div class="form-group " v-if="cIsNormalResultType">
                            <label class="px-2 ">作業担当</label>
                            <m-user-multi-select-with-model
                                v-model="value.t_production_result_users"
                                :id-col-name="'m_user_id'"
                                :filter-m-branch-ids="[mBranchId]"
                                :default-is-selected="false"                            
                                :filter-tag-keys="['m_users-role-op']"                                
                                
                                ></m-user-multi-select-with-model>
                                <!-- :filter-m-branch-ids="[mBranchId]" -->
                        </div>

                        <div class="form-group ml-auto" >
                            <br />
                            <button
                                @click.prevent="remove"
                                type="button" class="btn btn-danger ml-auto mt-2" >
                                <i class="fas fa-trash fa-fw"></i>                                                
                            </button>                                            


                            <button
                                v-if="cIsNormalResultType"
                                @click.prevent="addStop"
                                type="button" class="btn btn-warning ml-auto mt-2" >
                                <i class="fas fa-stop fa-fw"></i>
                                中断
                            </button>                                                                 
                        </div>    

                    </div>
                </div>

                                                
            </div>
            <div class="row">
                <div class="col-12">
                    <div v-for="(n , index ) in  cStops" :key="index">
                        <t-production-group-result-row-stop
                            v-if="getIsNotDeleted(n)"
                            v-model="cStops[index]"
                            :index="index"
                            @remove="removeStop" 
                        />
                    </div>

                </div>
            </div>
        </validation-observer>
    </div>
    
        
</template>

<script lang="ts">
// @ts-nocheck


import _ from "lodash" ; 
import dayjs from 'dayjs';
import DayJsEx from '../../../frameworks/DayJsEx';
import MKvsConst from '../../../consts/MKvsConst';
import { TProductionResult } from '../class/models/TProductionResult';
import { TProductionResultStop } from '../class/models/TProductionResultStop';

export default {
    data :  function() {
        return {
            /**
             * 実績入力タイプ
             */
            dInputAllMKvId              : MKvsConst.TProductions.Results.InputTypes.ALL ,
            dInputOnlyMinutesMKvId      : MKvsConst.TProductions.Results.InputTypes.ONLY_MINUTES ,
            dInputOnlyIsFinishedMKvId   : MKvsConst.TProductions.Results.InputTypes.ONLY_IS_FINISHED ,

        } 
    } , 
    props : {
        /**
         * t_production_resultsのデータ
         */
        value : {
            type : Object ,
        } , 
        /**
         * 拠点ID
         */
        mBranchId : {
            type : Number ,
            default : () => 0 
        } ,
        /**
         * 生産実績デフォルト日
         */
        resultDay : { 
            type : Object|Date , 
        } , 

    } , 
    computed : {

        /**
         * 通常実績
         */
        cIsNormalResultType : function() { 
            return this.cResultTypeFlg === 0 ; 
        } , 

        /*---- カラム系 */

        /**
         * 入力タイプ
         */
        cInputTypeMkvIdCName : function() {
            const colName = "input_type_m_kv_id" ; 
            return colName ; 
        } ,
        cInputTypeMkvId :{
            get :  function() {                
                return this.$$getValueModel(this.cInputTypeMkvIdCName) ;
            } ,
            set : function(val) {
                this.$$setValueModel(this.cInputTypeMkvIdCName , val ) ;  
            }
        } ,

        
        /**
         * 完了
         */
        cIsFinishedCName : function() {
            const colName = "is_finished" ; 
            return colName ; 
        } ,
        cIsFinished :{
            get :  function() {                
                return this.$$getValueModel(this.cIsFinishedCName) ;
            } ,
            set : function(val) {
                this.$$setValueModel(this.cIsFinishedCName , val ) ;  
            }
        } ,

        
        /**
         * 分数
         */
        cMinutesCName : function() {
            const colName = "minutes" ; 
            return colName ; 
        } ,
        cMinutes :{
            get :  function() {
                return this.$$getValueModel(this.cMinutesCName) ;
            } ,
            set : function(val) {
                this.$$setValueModel(this.cMinutesCName , val ) ;  
            }
        } ,

        /**
         * 分数(計算)
         */
        cCalcedMinutes : function() { 
            let s = dayjs(this.$$getValueModel(this.cStartedAtCName)) ; 
            let e = dayjs(this.$$getValueModel(this.cEndedAtCName)) ; 

            let diffMin  =  Math.abs( s.diff(e , "minute") ) ; 
            if ( this.cInputTypeMkvId === this.dInputAllMKvId){
                this.cMinutes = diffMin ; 
            }
            

            return _.round( diffMin, 2)  ; 
        } , 

        /**
         * 開始日時
         */
        cStartedAtCName : function() {
            const colName = "started_at" ; 
            return colName ; 
        } ,
        cStartedAtDay :{
            get :  function() {                
                return DayJsEx.formatDate(this.$$getValueModel(this.cStartedAtCName)) ;
            } ,
            set : function(val) {
                // console.log("At " + this.cStartedAtTime) ; 
                // console.log("At val " + val) ; 
                let d = val + " " + this.cStartedAtTime ; 
                // console.log("At val " + d) ; 
                // this.$$setValueModel(this.cStartedAtCName , dayjs(d).toDate() ) ;  
                this.$$setValueModel(this.cStartedAtCName , d ) ;
            } ,
        } ,
        cStartedAtTime :{
            get :  function() {      
                let d = DayJsEx.getOnlyHm(this.$$getValueModel(this.cStartedAtCName)) ;                        
                return d ;  
            } ,
            set : function(val) {
                let d = this.cStartedAtDay + " " + val  ; 
                // d = dayjs(d) ; 
                // this.$$setValueModel(this.cStartedAtCName , d.toDate()) ;  
                this.$$setValueModel(this.cStartedAtCName , d) ;  
                
            } ,
        } ,
        

        


        /**
         * 終了日時
         */
        cEndedAtCName : function() {
            const colName = "ended_at" ; 
            return colName ; 
        } ,
        cEndedAtDay :{
            get :  function() {           
                return DayJsEx.formatDate(this.$$getValueModel(this.cEndedAtCName)) ;     
            } ,
            set : function(val) {
                let d = val + " " + this.cEndedAtTime ; 
                // this.$$setValueModel(this.cEndedAtCName , dayjs(d).toDate() ) ;  
                 this.$$setValueModel(this.cEndedAtCName , d ) ;  
            } ,
            
        } ,                
        cEndedAtTime :{
            get :  function() {      
                let d = DayJsEx.getOnlyHm(this.$$getValueModel(this.cEndedAtCName)) ;                 
                return d ;
            } ,
            set : function(val) {
                let d = this.cEndedAtDay + " " + val ; 
                // this.$$setValueModel(this.cEndedAtCName , dayjs(d).toDate()) ;  
                 this.$$setValueModel(this.cEndedAtCName ,d ) ;  
            } ,
        } ,
        /**
         * 終了日時(計算)
         */
        cCalcedEndedAt : function() { 
            let s = dayjs(this.$$getValueModel(this.cStartedAtCName)) ; 
            let minuts = this.cMinutes ; 

            let e  =  s.add(minuts , "m")  ; 
            // this.$$setValueModel(this.cEndedAtCName , e.toDate() ) ;  
            e = e.format("YYYY-MM-DD HH:mm")  
             this.$$setValueModel(this.cEndedAtCName , e ) ; 
            
            return e; 
            // return e.format("YYYY-MM-DD HH:mm")  ; 
        } , 

        /**
         * 実績タイプ
         *  0:通常
         *  1:オプション
         */
        cResultTypeFlgCName : function() {
            const colName = "result_type_flg" ; 
            return colName ; 
        } ,
        cResultTypeFlg : function() {             
            return this.$$getValueModel(this.cResultTypeFlgCName) ;
        } , 

        /**
         * 備考
         */
        cMemoCName : function() {
            const colName = "memo" ; 
            return colName ; 
        } ,
        cMemo :{
            get :  function() {
                return this.$$getValueModel(this.cMemoCName) ;
            } ,
            set : function(val) {
                this.$$setValueModel(this.cMemoCName , val ) ;  
            }
        } ,

        

        /**
         * オペレータリスト
         */
        cUsers : { 
            get :  function() {      
                return this.value?.t_production_result_users ?? [];                 
            } ,
            set : function(val) {
                this.value.t_production_result_users = val ; 
                
            } ,
            
        } , 

        
        /**
         * 中止リスト
         */
        cStops : function() { 
            if ( this.value?.t_production_result_stops === undefined) return [] ; 

            return this.value.t_production_result_stops; 
            
        } , 
        
    } , 
    methods : {
        addStop : function() { 
            if ( this.value?.t_production_result_stops === undefined) return ; 

            const newStop = new TProductionResultStop(this.$$cLoginUserId) 
            newStop.started_at = this.resultDay ; 
            newStop.ended_at = this.resultDay ; 

            this.value.t_production_result_stops.push(newStop ) ; 

        } , 

        remove : function() { 
            if (!confirm('削除してもよろしいですか?')) return ;            
            this.$emit("remove" , this.value ) ; 

        } , 
        getIsNotDeleted : function(stop) { 
            return _.isNil(stop.deleted_at) ; 
        } , 
        /**
         * 中断の削除
         */
        removeStop : function(stop) { 
            
            
            if ( _.isNil( stop.id)){
                const idx = this.value.t_production_result_stops.indexOf(stop) ; 
                this.value.t_production_result_stops.splice(idx , 1 ) ; 
            }
            else { 
                stop.deleted_at = new Date() ;
                 
            }
            

            
            //
        } , 

        returnViewMode : function () {
            this.$emit("mode-change" ,"grouping"  ) ; 
        } , 

        selectGroup : function(n) { 
            this.$emit("select-group" , n ) ; 
        } , 

    } ,
    
    watch : {
    },
    created : function() {        
    }
}
</script>