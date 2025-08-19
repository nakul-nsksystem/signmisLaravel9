<template>
    <div>
        <validation-observer v-slot="{ invalid }">
            <div v-show="$$cIsError" class="alert alert-danger" role="alert">
                {{dErrorData.message}}
            </div>
            <div v-show="dSaveSuccess" class="alert alert-success" role="alert">
                保存に成功しました
            </div>

            <form v-if="cIsShow">
                <div class="form-group">
                    <label for="inputMBranchId">拠点</label>
                    <m-branch-select 
                        v-model="dValue.m_branch_id"
                        />
                </div>
                <validation-provider name="日付" rules="required" immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label for="inputBusinessHoliday">日付</label>
                        <ex-v-date-picker
                            v-model="dValue.day"
                            :isDayOnly="false"
                            />
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>

                <div class="form-group">
                    <label for="inputCalendarNote">名称</label>
                    <input v-model="dValue.calendar_note" class="form-control" id="inputCalendarNote"  placeholder="名称">                
                </div>


                <validation-provider name="営業区分" rules="required|excluded:0" immediate v-slot="{ errors }">                
                    <div class="form-group">
                        <label for="inputCategoryMKvId">営業区分</label>
                        <m-kv-select
                            v-model="dValue.category_m_kv_id"
                            :kv-key="'m_calendars-category'"
                            />
                        <span class="validation-error">{{ errors[0] }}</span>

                    </div>
                </validation-provider>



                <button type="button" class="btn btn-success" :disabled="invalid" @click.prevent="postData()">保存</button>
            </form>

        </validation-observer>
        
    </div>
</template>

<script>
import PageMixins from '../../../mixins/commons/PageMixins';
import ExVDatePicker from '../../commons/input/ExVDatePicker.vue';
import { MCalendarService } from '../class/services/MCalendarService'
import { MCalendar }  from "../class/models/MCalendar"
export default {
  components: { ExVDatePicker },
    mixins : [PageMixins] , 
    data :  function() {
        return {
            dValue : { } ,
            dApiName : "mCalendar",
            dSaveSuccess : false ,
        } 
    } , 
    computed : {
        cIsNew : function () 
        {            
            return this.$route.params.id === undefined ; 
        } ,        
        cIsShow : function () 
        {
            return this.cIsNew || this.dValue.id > 0 ; 
        } , 
        cEndpoint : function () 
        {
            let ep =  `api/${this.dApiName}` ;
            if ( !this.cIsNew ) ep += `/${this.$route.params.id}` ; 
            
            return  ep ;
        } ,

    } , 
    methods : {        
        getData : async function () {
            try {
                
                console.log("AA")
                this.dValue = await MCalendarService.getById(this.$route.params.id)
                
            }
            catch (error) 
            {
                this.$$errorConsole(error ,this.cEndpoint ) ; 

            }
            
        } ,
        postData : async function () {
            this.dSaveSuccess = false ;

            this.dValue.updated_m_user_id = this.$$cLoginUserId ;            
            let parsed = this.dValue ;

            if(this.cIsNew) {
                this.dValue.created_m_user_id = this.$$cLoginUserId 
                parsed = MCalendar.parse(this.dValue) ;
            } 
            
            try {
                const res = await MCalendarService.save(parsed)
                this.dValue = res ;
                this.dSaveSuccess = true ;
            }
            catch (error) 
            {
                this.$$errorConsole(error ,this.cEndpoint ) ; 

            }
            
        } , 
    } , 

    created : function () 
    {
        if ( ! this.cIsNew) this.getData()  ; 
        
    }
    
}
</script>