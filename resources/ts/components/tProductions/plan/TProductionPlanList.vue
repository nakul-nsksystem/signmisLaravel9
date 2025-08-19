<template>
    <div>       
        <div class="app-contents-container ">
            <div class="row">                
                <div class="col-12 col-xl-5">
                    <div class="row">
                        <div class="col-12 col-xl-6">
                            <div class="form-group">
                                <label >納期</label>
                                <div class="d-flex flex-no-wrap">
                                    <ex-v-date-picker 
                                        readonly
                                        aria-readonly="true"
                                        v-model="dConditions.delivery_date_from" />
                                    <span class="px-2 pt-2">～</span>
                                    <ex-v-date-picker 
                                        readonly
                                        aria-readonly="true"
                                        v-model="dConditions.delivery_date_to" />
                                </div>
                            </div>    

                        </div>

                        <div class="col-12 col-xl-4 pl-xl-0">                        
                            <div class="form-group">
                                <label >制作担当</label>
                                <m-user-select  
                                    v-model="dConditions.operator_m_user_id"
                                    :m-branch-id="mBranchId"
                                    :filter-m-tag-keys='["m_users-role-op"]'                                
                                    />
                            </div>
                        </div>


                    </div>

                </div>
                <div class="col-12 col-xl-6">
                    <div class="col-12 col-xl-12 pl-xl-0">                        
                            <div class="form-group">
                                <label >商品カテゴリ</label>
                                <m-product-category-multi-select
                                        v-model="dConditions.m_product_categories"
                                        :isOnlyProduction="true"
                                        />
                            </div>
                        </div>
                </div>
                
                <div class="col-12 col-xl-1 d-flex">
                    <div class="ml-auto">
                        <div class="form-group">
                            <label>&nbsp;</label>
                            <div >
                                <button type="button" :disabled="dIsLoading" class="btn btn-success" @click.prevent="search()">
                                    <div v-if="dIsLoading">
                                        <span class="spinner-border spinner-border-sm" role="status" />
                                        検索中...
                                    </div>
                                    <div v-else>
                                        <i class="fas fa-search fa-fw" />
                                        検索
                                    </div>
                                </button>

                            </div>
                        </div>

                    </div>
                    
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <div v-for="(n ,index) in dList" :key="n.id">
                    <t-project-view-4-production 
                        v-model="dList[index]"
                    />
                </div>
            </div>
        </div>

    </div>    
</template>

<script lang="ts">
// @ts-nocheck

import _ from "lodash" ; 
import DayJsEx from '../../../frameworks/DayJsEx';
import { TProjectService } from '../../tProjects/class/services/TProjectService';

export default {  
    data :  function() {
        return {
            dIsLoading : false , 
            
            dList: [] , 


            dConditions : { 
                operator_m_user_id : 0 , 
                m_product_categories : [] ,                 
                delivery_date_from :"" ,
                delivery_date_to :""  ,
            },
 

        } 
    } , 
    props : {
        mBranchId : { 
            type : Number , 
            default : () => 0 , 
        }

    } , 
    computed : {
        
    } , 
    methods : {

        search : async function() { 
            this.dIsLoading = true ; 

            this.dConditions.m_branch_id = this.mBranchId ; 
            const getParams = JSON.parse(JSON.stringify(this.dConditions)) ;
            try { 
                const res = await TProjectService.search4Production(getParams) ; 
                this.dList = res ; 
                
            }
            catch (error){
                this.$$errorConsole(error ,error.ep) ;
            } finally {
                this.dIsLoading = false ;
            }
            

            

        } , 

    } , 
    created : function() {
        this.dConditions.delivery_date_from = this.$$formatDay(DayJsEx.today()) ; 
        this.dConditions.delivery_date_to = this.$$formatDay(DayJsEx.today()) ; 
    }
}
</script>
<style scoped>

</style>