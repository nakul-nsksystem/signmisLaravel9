<template>
    <div v-show="! m$cIsOutsource">
        <div class="row">
            <div class="col-12 col-xl-4">
                <validation-provider :name="productionLabel" 
                    :vid="`production${dRandom}`"
                    :rules="`${m$cIsEnabled && isRequired? 'required|excluded:0' : ''}`" 
                    immediate v-slot="{ errors }">

                    <div class="form-group">
                        <label>{{productionLabel}}</label>
                        <m-production-select
                            v-model="cMProductionId"
                            :m-branch-id="dValue.m_branch_id"
                            :m-process-category-id="MProcessCategoryId"
                            :m-product-category-id="MProductCategoryId"
                            :m-process-category-m-production-no="MProcessCategoryMProductionNo"
                        />
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>

            <div class="col-12 col-xl-5 pl-xl-0">
                <validation-provider :name="modeLabel" 
                    :vid="`productionMode${dRandom}`"
                    :rules="`${m$cIsEnabled && isRequired? 'required|excluded:0' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">

                        <label >{{modeLabel}}</label>
                        <m-production-mode-select
                            v-model="cMProductionModeId"
                            :m-production-id="cMProductionId"
                            :m-process-category-id="ModeMProcessCategoryId"
                            >
                        </m-production-mode-select>
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>

            <div class="col-12 col-xl-3 pl-xl-0" v-if="isUseOptions">
                <validation-provider :name="optionLabel" 
                    :vid="`productionOption${dRandom}`"                
                    :rules="`${m$cIsEnabled && isRequired ? 'required|excluded:0' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label>{{optionLabel}}</label>
                        <m-production-option-select
                            v-model="cMProductionOptionId"
                            :m-production-id="cMProductionId"
                            >
                        </m-production-option-select>
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>

        </div>          


    </div>
</template>

<script>
import ObjectUtil from '../../../../../frameworks/ObjectUtil';
import TProductProcessMixins from "./../../../../../mixins/tProject/TProductProcessMixins" ;
export default {
    mixins : [TProductProcessMixins] ,     
    data : function() {
        return {
            dValue : {} , 
            dRandom : Math.random()  , 
        }
    } ,  
    props : {
        value : {
            type : Object 
        } ,
        MProductCategoryId : {
            type : Number
        }  ,
        MProcessCategoryId :{
            type : Number
        }  ,    
        MProcessCategoryMProductionNo : 
        {
            type : Number ,
        } ,
        ModeMProcessCategoryId:{
            type : Number
        }  , 
        isUseOptions : {
            type : Boolean ,
            default : () => false ,
        } ,
        productionLabel : {
            type : String ,
            default : () => "生産先" ,
        } ,
        modeLabel : {
            type : String ,
            default : () => "モード" ,
        } ,
        optionLabel : {
            type : String ,
            default : () => "オプション" ,
        } ,
        /**
         * 必須
         */
        isRequired : {
            type : Boolean ,
            default : () => true ,
        }
    } ,
    computed : {

        // 生産先ID
        cMProductionId :{
            get :  function() {               
                if ( this.MProcessCategoryMProductionNo === undefined 
                   || this.MProcessCategoryMProductionNo == 1 ) {
                    return this.m$cMProductionId01 ;
                } 
                else if (this.MProcessCategoryMProductionNo == 2){
                    return this.m$cMProductionId02 ;
                }
                else if (this.MProcessCategoryMProductionNo == 3){
                    return this.m$cMProductionId03 ;
                }
                else if (this.MProcessCategoryMProductionNo == 4){
                    return this.m$cMProductionId04 ;
                }

            } ,
            set : function(val) {
                if ( this.MProcessCategoryMProductionNo === undefined 
                   || this.MProcessCategoryMProductionNo == 1 ) {
                       this.m$cMProductionId01  = val 
                } 
                else if (this.MProcessCategoryMProductionNo == 2){
                    this.m$cMProductionId02  = val  ;
                }
                else if (this.MProcessCategoryMProductionNo == 3){
                    this.m$cMProductionId03  = val  ;
                }
                else if (this.MProcessCategoryMProductionNo == 4){
                    this.m$cMProductionId04  = val  ;
                }
            }
        } ,        

        // モード
        cMProductionModeId :{
            get :  function() {               
                if ( this.MProcessCategoryMProductionNo === undefined 
                   || this.MProcessCategoryMProductionNo == 1 ) {
                    return this.m$cMProductionModeId01 ;                    
                } 
                else if (this.MProcessCategoryMProductionNo == 2){
                    return this.m$cMProductionModeId02 ;
                }
                else if (this.MProcessCategoryMProductionNo == 3){
                    return this.m$cMProductionModeId03 ;
                }
                else if (this.MProcessCategoryMProductionNo == 4){
                    return this.m$cMProductionModeId04 ;
                }
            } ,
            set : function(val) {
                if ( this.MProcessCategoryMProductionNo === undefined 
                   || this.MProcessCategoryMProductionNo == 1 ) {
                    this.m$cMProductionModeId01 = val ;                    
                } 
                else if (this.MProcessCategoryMProductionNo == 2){
                    this.m$cMProductionModeId02 = val ;
                }
                else if (this.MProcessCategoryMProductionNo == 3){
                    this.m$cMProductionModeId03 = val ;
                }
                else if (this.MProcessCategoryMProductionNo == 4){
                    this.m$cMProductionModeId04 = val ;
                }
            }
        } ,       

        // オプション
        cMProductionOptionId :{
            get :  function() {               
                if ( this.MProcessCategoryMProductionNo === undefined 
                   || this.MProcessCategoryMProductionNo == 1 ) {
                    return this.m$cMProductionOptionId01 ;
                } 
                else if (this.MProcessCategoryMProductionNo == 2){
                    return this.m$cMProductionOptionId02 ;
                }
                else if (this.MProcessCategoryMProductionNo == 3){
                    return this.m$cMProductionOptionId03;
                }
                else if (this.MProcessCategoryMProductionNo == 4){
                    return this.m$cMProductionOptionId04;
                }
            } ,
            set : function(val) {
                if ( this.MProcessCategoryMProductionNo === undefined 
                   || this.MProcessCategoryMProductionNo == 1 ) {
                    this.m$cMProductionOptionId01 = val ;
                } 
                else if (this.MProcessCategoryMProductionNo == 2){
                    this.m$cMProductionOptionId02 = val ;
                }
                else if (this.MProcessCategoryMProductionNo == 3){
                    this.m$cMProductionOptionId03 = val ;           
                }
                else if (this.MProcessCategoryMProductionNo == 4){
                    this.m$cMProductionOptionId04 = val ;           
                }            }
        } ,                
    }  ,
} 
</script>