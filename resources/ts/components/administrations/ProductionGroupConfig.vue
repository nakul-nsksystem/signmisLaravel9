<template>
    <div>
        <div class="row">

            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label >拠点</label>
                    <m-branch-select 
                        @input="changeKey()"
                        v-model="dSelectedMBranchId" 
                        ></m-branch-select>

                </div>
            </div>        
            

            <div class="col-12 col-xl-4 pl-xl-0">
                <div class="form-group">
                    <label >加工カテゴリー</label>
                    <m-kv-select
                            v-model="dSelectedProcessCategoryMKvId"
                            @input="changeKey()"
                            :kv-key="'m_process_categories-production'"
                            />
                </div>
            </div>    

            <div class="col-12 col-xl-6 pl-xl-0">
                <div class="d-flex ">
                    <div class="ml-auto mt-4">
                        <button
                            @click.prevent="save"
                            :disabled="!cIsAvailable"
                            type="button" class="btn btn-success" >
                            <i class="fas fa-save fa-fw"></i>
                            保存
                        </button>
                    </div>                
                </div>
                        
            </div>
            
        </div>
        <div class="row">
            <div class="col-12">
                <m-production-group-conditions 
                    ref="mProductionGroupCondition"
                    v-model="dRow"
                    />

            </div>
        </div>
    </div>
    

</template>

<script>
import _ from 'lodash';

export default {
    data : function() {
        return {
            dRow : undefined , 
            dSelectedMBranchId : 0 ,
            dSelectedProcessCategoryMKvId : 0 , 
            

        }         
    } ,
    
    computed : {
        /**
         * URLエンドポイント 
         */
        cEndpoint : function () {
            return  `api/mProductionGroupConfig`  ;
        } ,        
        cEndpointGet : function () {
            return  `${this.cEndpoint}/findByBranchAndProcessCategoryMkv/${this.dSelectedMBranchId}/${this.dSelectedProcessCategoryMKvId}`  ;
        } , 
        cIsAvailable : function() { 
            if ( _.isNil(this.dRow)) return false ; 
            return true ; 
        } ,

    } ,
    methods : {
        changeKey : function(){
            if ( this.dSelectedMBranchId === 0 || this.dSelectedProcessCategoryMKvId === 0 ) return ; 

            this.getConfig() ; 
        } , 

        getConfig : async function(){ 
            

            try {
                const res = await axios.get(this.cEndpointGet) ;

                if ( res.data.length === 0 ) { 
                    // console.log("no settings") ; 
                    // 設定なし
                    this.dRow = {
                        m_branch_id : this.dSelectedMBranchId ,
                        process_category_m_kv_id : this.dSelectedProcessCategoryMKvId ,    
                    }
                }
                else { 
                    this.dRow = res.data ; 

                }
                
                await this.$nextTick() ; 
                this.$refs.mProductionGroupCondition.conditionChanged() ; 
                
                // console.log(res.data) ; 
            }
            catch (error) {
                //this.$$errorConsole(error ,this.cEndpointBaseTProductionDay ) ; 
                this.$$errorConsole(error ,this.cEndpointGet ) ;                 
            }

        } , 

        save : async function() {             

            this.dRow = this.$refs.mProductionGroupCondition.getConditions() ; 
            this.dRow.updated_m_user_id = this.$$cLoginUserId ; 
            // console.log(this.dRow) ; 

            const isNew = this.dRow.id === undefined ; 
            const apiUrl = this.cEndpoint + ( isNew ? "" : `/${this.dRow.id}`) ; 
            // console.log(apiUrl) ; 
            // console.log(JSON.stringify(this.dRow)) ; 
            
            try {
                //const res = await axios.post(this.cEndpointBaseTProductionDay ,row ) ;                
                
                // console.log("AA") ; 
                let res  ; 
                if ( isNew){
                    // console.log("new") ; 
                    res = await axios.post(apiUrl ,this.dRow ) ;
                }
                else {
                    res = await axios.put(apiUrl ,this.dRow ) ;
                }                
                // console.log(res) ; 
                Object.assign(this.dRow , res.data )  ; 
                this.dRow = res.data ; 

                await this.$nextTick() ; 
                this.$refs.mProductionGroupCondition.conditionChanged() ; 
                
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