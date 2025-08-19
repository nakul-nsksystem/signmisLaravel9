<template>
    <div class="row my-3">       
        
        <div class="col-12">
            <div class="d-flex">
                
                <div class="col-12 col-xl-5">
                    <label>ImposeTemplate</label>            
                    <select
                        class="custom-select"                         
                        v-model="dImposeTemplate"
                        >
                        <option value=""></option>
                        <option value="DEFAULT_STEP_AND_REPEAT">Step Repeat Template</option>
                        <option value="DEFAULT_NESTING">Nesting Template</option>
                        <option value="DEFAULT_TILING">Tiling Template</option>
                        <!-- <option :value="n.id" v-for="n in dList" :key="n.id">{{ cDisplayName(n) }}</option> -->
                    </select>
                </div>

                <div class="ml-auto">                    
                    <button type="button" class="btn btn-success" @click.prevent="output()">
                        <i class="fas fa-file-download fa-fw" />
                            XML出力
                    </button>
                </div>

            </div>
            
        </div>
        <div class="d-none">
            
            {{cParams}}
        </div>

    </div>    
</template>

<script lang="ts">
// @ts-nocheck

import _ from "lodash" ; 
import DayJsEx from '../../../frameworks/DayJsEx';
import { TProjectService } from '../../tProjects/class/services/TProjectService';
import { TProductionDayGroup } from '../../class/models/TProductionDayGroup';
import dayjs from 'dayjs';

export default {  
    data :  function() {
        return {
            dIsLoading : false , 

            dImposeTemplate : "" , 

        } 
    } , 
    props : {
        group : { 
            type : TProductionDayGroup , 
        } , 

    } , 
    computed : {
        cParams : function() { 
            if ( _.isNil(this.group?.t_project_product_processes )) return {} ; 

            const urls = [
                "file://localhost/Nsk/data4hf/parkerPrint.pdf" , 
                "file://localhost/Nsk/data4hf/A2_PRINT.pdf" ,
                "file://localhost/Nsk/data4hf/A2_PRINT6.pdf" ,

            ]

            const pm = {} ; 
            pm.name = this.group.title ; 
            pm.externalId = `${this.group.id}-${this.group.uid}` ;

            pm.leadIn = 0 ; 
            pm.leadOut = 0 ;


            let shipDate = "" ; 
            for ( const proc of  this.group.t_project_product_processes){
                const deliveryDate = proc.t_project_product.calced_delivery_date ; 
                if ( shipDate == "" || dayjs(deliveryDate).isAfter(dayjs(shipDate))){

                    shipDate = deliveryDate ; 
                }
            }
            pm.shippingDate = dayjs(shipDate).format("YYYY-MM-DD") ; 
            pm.productionDate = dayjs(this.group.planed_production_at).format("YYYY-MM-DD") ; ; 

            if ( this.dImposeTemplate != ""){
                pm.imposeTemplate = this.dImposeTemplate ; 

            }

            let i = 0 ; 
            pm.printItems = [] ; 
            for ( const proc of  this.group.t_project_product_processes){
                const pi = { 
                    name : proc.t_project_product?.name ?? "" , 
                    width : proc.t_project_product?.size_w ?? 0 , 
                    height : proc.t_project_product?.size_h ?? 0 , 
                    unit : "mm" , 
                    pages : "1" ,
                    numberOfCopies : proc.t_project_product?.qty ?? 1 , 

                    windingType : "OUTSIDE" , 
                    orientation : "TOP" , 
                    url : urls[i] , 
                }
                pm.printItems.push(pi) ; 
                i++ ; 
            }



            return pm ; 

        }
    } , 
    methods : {

        output : async function() { 
            axios.post("api/durstwf/createXml" ,this.cParams) ; 

        } , 

    } , 
    created : function() {
    }
}
</script>