<template>                            

    <div class="row" >


        <div class="col-12 col-xl-2">
            <div class="d-flex flex-nowrap">
                <div class="form-group">
                    <br />
                    <button
                        @click.prevent="remove"
                        type="button" class="btn btn-danger ml-auto mt-2" >
                        <i class="fas fa-trash fa-fw"></i>                    
                    </button>                                            
                </div>    

                <validation-provider                                                    
                    :vid="`productionGroupResultRowStop-cInputTypeMkvId${index}`"                
                    rules="required|excluded:0" 
                    name="入力タイプ"
                    immediate v-slot="{ errors }">
                    <div class="form-group pl-2 w-100">
                        <label >入力タイプ</label>                                                
                        <m-kv-select
                            v-model="cInputTypeMkvId"
                            :kv-key="'t_production_result_stop-input_type'"
                            >
                        </m-kv-select>
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>    
                </validation-provider>                 

            </div>
           
        </div>  

        <div class="col-12 col-xl-2 pl-xl-0">
            <div class="form-group">
                <label >中断理由</label>                                                
                <m-kv-select
                    v-model="cReasonMKvId"
                    :kv-key="'t_production_result_stop-reason'"
                    >
                </m-kv-select>
            </div>    
        </div>  



        <div class="col-12 col-xl-1 pl-xl-0">
            <div class="form-group">
                <label >中断分数</label>                
                <div v-if="cInputTypeMkvId === dInputOnlyMinutesMKvId">
                    <validation-provider                                                    
                        :vid="`productionGroupResultRowStop-cMinutes${index}`"                
                        rules="required|min_value:1" 
                        name="中断分数"
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


        <div class="col-12 col-xl-7 pl-xl-0">
            <div class="d-flex flex-wrap flex-xl-nowrap">
                <div class="form-group ">
                    <label class="px-2 ">中断開始</label>
                    <div class="d-flex flex-no-wrap">


                        
                        <validation-provider
                            :vid="`productionGroupResultRowStop-cStartedAtDay${index}`"
                            rules="required|custom_rule_date_day_required" 
                            name="開始日"
                            immediate v-slot="{ errors }">                                        
                        
                            <ex-v-date-picker 
                                v-model="cStartedAtDay"
                                readonly
                                aria-readonly="true"/>

                            <span class="validation-error">{{ errors[0] }}</span>
                        </validation-provider>                            

                        <validation-provider
                            :vid="`productionGroupResultRowStop-cStartedAtTime${index}`"
                            :rules="`${ cInputTypeMkvId === dInputAllMKvId ? 'required|custom_rule_date_hhmm_required' : ''}`" 
                            name="開始時刻"
                            immediate v-slot="{ errors }">                                        
                            <input 
                                v-model="cStartedAtTime"
                                type="time" class="form-control app-input-time ml-2" />
                            <span class="validation-error">{{ errors[0] }}</span>
                        </validation-provider>                            
                        
                        <span class="px-2 pt-2">～</span>                                            
                    </div>                                        
                </div>

                <div class="form-group">
                    <label class="px-2 ">中断終了</label>
                    <div class="d-flex flex-no-wrap "
                        v-if="cInputTypeMkvId === dInputAllMKvId">
                        
                        <validation-provider
                            :vid="`productionGroupResultRowStop-cStartedAtDay${index}`"
                            :rules="`${ cInputTypeMkvId === dInputAllMKvId ? 'required|custom_rule_date_day_required' : ''}`" 
                            name="終了日"
                            immediate v-slot="{ errors }">                                        
                            
                            <ex-v-date-picker 
                                v-model="cEndedAtDay"
                                readonly
                                aria-readonly="true"/>
                            <span class="validation-error">{{ errors[0] }}</span>
                        </validation-provider>      

                        <validation-provider
                            :vid="`productionGroupResultRowStop-cEndedAtTime${index}`"
                            :rules="`${ cInputTypeMkvId === dInputAllMKvId ? 'required|custom_rule_date_hhmm_required' : ''}`" 
                            name="終了時刻"
                            immediate v-slot="{ errors }">                                        
                            <input 
                                v-model="cEndedAtTime"
                                type="time" class="form-control app-input-time ml-2" />
                            <span class="validation-error">{{ errors[0] }}</span>
                        </validation-provider>      
                    </div>
                    <div v-else class="mt-2" style="width:170px;">
                        {{cCalcedEndedAt}}
                    </div>                
                </div>
                <div class="form-group pl-xl-2 w-100">
                    <label >備考</label>                
                    <input class="form-control"
                        v-model="cMemo"
                    />
                </div>
            </div>

        </div>

        

                                        
    </div>

        
</template>

<script>
import _ from "lodash" ; 
import DayJsEx from '../../../frameworks/DayJsEx';
import dayjs from 'dayjs';

import MKvsConst from '../../../consts/MKvsConst';

export default {
    data :  function() {
        return {
            /**
             * 実績入力タイプ
             */
            dInputAllMKvId              : MKvsConst.TProductions.Results.Stop.InputTypes.ALL ,
            dInputOnlyMinutesMKvId      : MKvsConst.TProductions.Results.Stop.InputTypes.ONLY_MINUTES ,

        } 
    } , 
    props : {
        /**
         * t_production_resultsのデータ
         */
        value : {
            type : Object ,
        } , 
        index : { 
            type : Number 
        }

    } , 
    computed : {
        

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
         * 中断理由
         */
        cReasonMKvIdCName : function() {
            const colName = "reason_m_kv_id" ; 
            return colName ; 
        } ,
        cReasonMKvId :{
            get :  function() {
                return this.$$getValueModel(this.cReasonMKvIdCName) ;
            } ,
            set : function(val) {
                this.$$setValueModel(this.cReasonMKvIdCName , val ) ;  
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
            this.cMinutes = diffMin ; 

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
                let d = val + " " + this.cStartedAtTime ; 
                this.$$setValueModel(this.cStartedAtCName , dayjs(d).toDate() ) ;  
            } ,
        } ,
        cStartedAtTime :{
            get :  function() {      
                let d = DayJsEx.getOnlyHm(this.$$getValueModel(this.cStartedAtCName)) ;                 
                return d ;
            } ,
            set : function(val) {
                let d = this.cStartedAtDay + " " + val ; 
                this.$$setValueModel(this.cStartedAtCName , dayjs(d).toDate()) ;  
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
                this.$$setValueModel(this.cEndedAtCName , dayjs(d).toDate() ) ;  
            } ,
            
        } ,                
        cEndedAtTime :{
            get :  function() {      
                let d = DayJsEx.getOnlyHm(this.$$getValueModel(this.cEndedAtCName)) ;                 
                return d ;
            } ,
            set : function(val) {
                let d = this.cEndedAtDay + " " + val ; 
                this.$$setValueModel(this.cEndedAtCName , dayjs(d).toDate()) ;  
            } ,
        } ,
        /**
         * 終了日時(計算)
         */
        cCalcedEndedAt : function() { 
            let s = dayjs(this.$$getValueModel(this.cStartedAtCName)) ; 
            let minuts = this.cMinutes ; 

            let e  =  s.add(minuts , "m")  ; 
            this.$$setValueModel(this.cEndedAtCName , e.toDate() ) ;  
            
            return e.format("YYYY-MM-DD HH:mm")  ; 
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

        

        
        


    } , 
    methods : {
        remove : function() { 
            if (!confirm('削除してもよろしいですか?')) return ;            
            this.$emit("remove" ,this.value ) ; 
        } , 


    } ,
    created : function() {        
    }
}
</script>