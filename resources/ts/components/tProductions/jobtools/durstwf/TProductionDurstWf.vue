<template>
    <div>       
        <div class="app-contents-container ">
            <div class="row">
                <div class="col-12 col-xl-2 d-flex flex-nowrap pl-2 pt-2" >
                    <div class="d-flex align-items-start" style="max-width:45px">
                        <picture class="">                        
                            <img class="object-contain" src="img/jobtools/dust-wf-logo.png" alt="dwf-logo"  />            
                        </picture>
                    </div>
                    <div class="ml-2">
                        <h4 class="border-bottom mb-0">Durst WorkFlow</h4>
                        <h5 class="a">RestApi</h5>
                    </div>

                    
                </div>
                <div class="col-12 col-xl-5">
                    <label>Mode</label>            
                    <div class="">
                        <div 
                            class="btn-group btn-group-toggle " >
                            <label class="btn btn-dark"
                                :class="{active : dRelMode === 'hotfolder' }"
                                data-toggle="tooltip" data-placement="top" title="HotFolder" >
                                <input type="radio" v-model="dRelMode" name="view-modes" value="hotfolder">
                                HotFolder
                            </label> 
                            <label class="btn btn-dark"
                                :class="{active : dRelMode === 'api' }" 
                                data-toggle="tooltip" data-placement="top" title="RestApi" >
                                <input type="radio" v-model="dRelMode" name="view-mode" value="api">
                                RestApi
                            </label>
                        </div>                     

                    </div>
                </div>


            </div>

        </div>


        <div class="row">
            <div class="col-12  col-xl-6">
                <t-production-durst-wf-hf 
                    v-if="dRelMode === 'hotfolder'"
                    :group="group"
                />
                <t-production-durst-wf-api
                    v-if="dRelMode === 'api'"
                    :group="group"
                 />

            </div>
            <div class="col-12 col-xl-6 mt-3">                
                <div v-for="(n ,index) in cList" :key="n.id">
                    <t-production-plan-group-detail-card 
                        v-model="cList[index]"  />
                </div>
                
            </div>

        </div>


    </div>    
</template>

<script lang="ts">
// @ts-nocheck

import _ from "lodash" ; 
import DayJsEx from '../../../frameworks/DayJsEx';
import { TProductionDayGroup } from '../../class/models/TProductionDayGroup';
import { TProductionDay } from '../../class/models/TProductionDay';

export default {  
    data :  function() {
        return {
            dIsLoading : false , 

            dRelMode: "hotfolder" , 

            /**
             * Impose Template
             */
            dSelectedImposeTemplate : undefined , 

            
 

        } 
    } , 
    props : {
        group : { 
            type : TProductionDayGroup , 
        } , 
        productionDay : { 
            type : TProductionDay
        }

    } , 
    computed : {
        cList : function() { 
            if ( _.isNil( this.group?.t_project_product_processes)) return [] ; 

            return this.group.t_project_product_processes ; 
        }
    } , 
    methods : {

        search : async function() { 
        } , 

    } , 
    created : function() {
    }
}
</script>
<style scoped>

</style>