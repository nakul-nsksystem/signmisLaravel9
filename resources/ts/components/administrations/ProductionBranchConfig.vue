<template>
    <div>
        
        <div v-if="$$cIsError" class="alert alert-danger" role="alert">
            {{dErrorData.message}}
        </div>
        <validation-observer v-slot="{ invalid }">
            <div class="row border-bottom mb-3">

                <div class="col-12 col-xl-2">
                    <div class="form-group">
                        <label >拠点</label>
                        <m-branch-select 
                            @input="changeKey()"
                            v-model="dSelectedMBranchId" 
                            ></m-branch-select>

                    </div>
                </div>        
                


                <div class="col-12 col-xl-10 pl-xl-0">
                    <div class="d-flex ">
                        <div class="ml-auto mt-4">
                            <button
                                @click.prevent="save"
                                :disabled="!cIsAvailable || invalid"
                                type="button" class="btn btn-success" >
                                <i class="fas fa-save fa-fw"></i>
                                保存
                            </button>
                        </div>                
                    </div>
                            
                </div>
                
            </div>
        
            <div v-if="dTempSelectedMBranch !== undefined">
                <div class="row" >              
                    
                    <div class="col-12 col-xl-3 ">
                        <h5>デフォルト業務時間設定</h5>  
                        
                        <div class="d-flex flex-nowrap">
                            <div class="form-group">
                                <validation-provider                                                    
                                    :vid="`ProductionBranchConfig-production_start_at`"
                                    rules="required|custom_rule_date_hhmm_required" 
                                    name="開始時刻"
                                    immediate v-slot="{ errors }">

                                    <label >開始時刻</label>
                                    <div class="d-flex flex-nowrap">
                                        <input 
                                            v-model="dTempSelectedMBranch.production_start_at" 
                                            type="time"
                                            class="form-control app-input-time" >   
                                        <span class="px-2 pt-2">～</span>
                                        
                                    </div>
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </validation-provider>

                            </div>
                            
                            <validation-provider                                                    
                                :vid="`ProductionBranchConfig-production_end_at`"
                                rules="required|custom_rule_date_hhmm_required" 
                                name="終了時刻"
                                immediate v-slot="{ errors }">
                                
                                <div class="form-group">
                                    <label>終了時刻</label>
                                    <input 
                                        v-model="dTempSelectedMBranch.production_end_at" 
                                        type="time"
                                        class="form-control app-input-time">
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </div>
                            </validation-provider>
                        </div>

                    </div>
                    
                        
    
                    
                    <div class="col-12 col-xl-4 pl-xl-0">
                        <div class="d-flex">
                            <h5>                        
                                休憩時間設定
                            </h5>
                            <div class="ml-auto">
                                <button type="button" class="btn btn-primary" @click.prevent="addRest" >
                                    <i class="fas fa-plus fa-fw"></i>
                                    追加
                                </button>                    
                            </div>
                        </div>
                        
                        <table class="table table-dark mt-2">
                            <thead>
                                <tr>
                                    <th>&nbsp;</th>
                                    <th>開始</th>
                                    <th>終了</th>
                                    <th>備考</th>
                                </tr>                        
                            </thead>
                            <tbody>
                                <tr v-for="(n,index) of cRests" :key="n.id">
                                    <td>
                                        <button type="button" class="btn btn-danger" 
                                            @click.prevent.stop="deleteRest(n)"
                                            >
                                            <i class="fas fa-trash fa-fw"></i>
                                        </button>

                                    </td>
                                    <td>
                                        <validation-provider                                                    
                                            :vid="`ProductionBranchConfig-rest-started_at${index}`"
                                            rules="required|custom_rule_date_hhmm_required" 
                                            name="開始時刻"
                                            immediate v-slot="{ errors }">

                                            <div class="d-flex flex-nowrap">
                                                <input 
                                                    v-model="n.started_at" 
                                                    type="time"
                                                    class="form-control app-input-time">                                                
                                                <span class="px-2 pt-2">～</span>
                                            </div>
                                            <span class="validation-error">{{ errors[0] }}</span>
                                        </validation-provider>
                                        

                                        
                                    </td>
                                    <td>
                                        
                                        <validation-provider                                                    
                                            :vid="`ProductionBranchConfig-rest-ended_at${index}`"
                                            rules="required|custom_rule_date_hhmm_required" 
                                            name="終了時刻"
                                            immediate v-slot="{ errors }">
                                            <input 
                                                v-model="n.ended_at" 
                                                type="time"
                                                class="form-control app-input-time">
                                            <span class="validation-error">{{ errors[0] }}</span>
                                        </validation-provider>
                                    </td>

                                </tr>
                                
                            </tbody>
                        </table>
                    </div>

                </div>

            </div>

        </validation-observer>

    </div>
    

</template>

<script>
import _ from 'lodash';
import ObjectUtil from '../../frameworks/ObjectUtil';

export default {
    data : function() {
        return {
            dRow : undefined , 
            dSelectedMBranchId : 0 ,
            dTempSelectedMBranch : undefined , 

        }         
    } ,
    
    computed : {
        /**
         * URLエンドポイント 
         */
        cEndpoint : function () {
            return  `api/mBranch`  ;
        } ,        
        cIsAvailable : function() { 
            if ( _.isNil(this.dTempSelectedMBranch)) return false ; 
            return true ; 
        } ,
        cRests : function()  { 
            if (this.dTempSelectedMBranch?.m_branch_production_rests === undefined ) return [] ; 

            const list = this.dTempSelectedMBranch.m_branch_production_rests.filter(x => _.isNil(x.deleted_at)) ;  
            return list ; 
        }
        

    } ,
    methods : {
        changeKey : function(){
            if ( this.dSelectedMBranchId === 0 ) {
                this.dTempSelectedMBranch = undefined ; 
                return ; 
            }

            this.dTempSelectedMBranch = ObjectUtil.deepCopyJ(this.masterStore.getMBranchById(this.dSelectedMBranchId )) ; 

        } , 

        addRest : function() { 
            const row = {                 
                started_at : "00:00" , 
                ended_at : "00:00" , 
                created_m_user_id : this.$$cLoginUserId  , 
                deleted_at : null , 
            }
            this.dTempSelectedMBranch.m_branch_production_rests.push(row) ; 
        } , 
        deleteRest : function(n) { 
            if ( n.id === undefined){
                const idx = this.dTempSelectedMBranch.m_branch_production_rests.indexOf(n) ; 
                this.dTempSelectedMBranch.m_branch_production_rests.splice(n , 1 ) ; 
            }
            else { 
                n.deleted_at = new Date() ; 
            }
            

        } , 


        save : async function() {
            
            for ( const b of this.dTempSelectedMBranch.m_branch_production_rests ) { 
                b.updated_m_user_id = this.$$cLoginUserId ; 
            }

            const mBranch = this.masterStore.getMBranchById(this.dSelectedMBranchId)  ; 
            Object.assign(mBranch , this.dTempSelectedMBranch)  ; 

            // Rests 
            // console.log(mBranch) ; 

            // Todo MBranchSave 
            const apiUrl = this.cEndpoint + `/${mBranch.id}` ; 
            // console.log(apiUrl) ; 
            // console.log(JSON.stringify(this.dRow)) ; 
            
            try {
                //const res = await axios.post(this.cEndpointBaseTProductionDay ,row ) ;                
                
                // console.log("AA") ; 
                let res  ; 
                res = await axios.put(apiUrl ,mBranch ) ;
                // console.log(res) ; 
                Object.assign(this.dTempSelectedMBranch , res.data )  ; 
                Object.assign(mBranch , res.data )  ; 
                
                // this.dTempSelectedMBranch = res.data ; 
                
            }
            catch (error) {
                this.$$errorConsole(error ,apiUrl ) ;
            }
        } , 

    } ,
    created : function()
    {
        
        
    }
    
} 
</script>