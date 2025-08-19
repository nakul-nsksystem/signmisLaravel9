<template>
    <div >
        <div class="d-flex flex-wrap"            
            >
            <h5 class="mb-0 flex-fill">
                <a href="#"
                    @click.prevent="$$openTProjectEditOnOtherTab(value.t_project_product.t_project.id)">
                        {{value.t_project_product.t_project.cd}} - {{value.t_project_product.t_project.name}}                                                 
                </a>
            </h5>
            
            <h5 class="pr-2 mb-0" >
                <span class="badge" 
                    :class="getMBranchColor(value.t_project_product.t_project.m_branch_id)">
                    {{getMBranchName(value.t_project_product.t_project.m_branch_id)}}
                </span>                            
            </h5>
        </div>

        <h6 class="text-white-75">{{value.t_project_product.t_project.m_customer.short_name_or_name}}</h6>

        <t-product-view-title 
            v-model="value.t_project_product"
            />

        <div class="row">
            <div class="col-12 d-flex flex-wrap flex-xl-nowrap " >
                <div class="flex-grow-0 flex-shrink-0 form-group text-center py-2 mb-0">
                    <t-product-view-thumbnail 
                        v-model="value.t_project_product"
                        :size="'sm'"
                        />
                </div>
                
                <div class="flex-grow-1 flex-shrink-1 ml-0 ml-md-3 ">                  
                    <div class="d-flex flex-nowrap mt-2">
                        <div class="card-text mb-2">                            
                            {{value.m_process_category.name}} - {{value.t_project_product.total_sqm.toFixed(2)}}㎡ - {{($$_.isNil(value.total_process_mater) ? 0 : value.total_process_mater ).toFixed(2)}}m - {{value.predicted_work_hour.toFixed(2)}}h                            
                        </div>
                        <div class="ml-auto">
                            <p>制作担当 : {{cOpName}}</p>
                        </div>


                        <!-- <p class="pr-2 text-nowrap">{{value.planed_production_at}} 生産予定</p> -->
                    </div>                      
                    
                    <t-product-view-process-label 
                        :is-production="true"
                        :classes="['text-lightSuccess']"
                        v-model="value" />
                    
                    <div class="text-white-50">{{getProductLabel01(value)}}</div>
                    <div class="text-white-50">{{value.t_project_product.display_03}}</div>
                    
                </div>

                <slot name="rightContainer">

                </slot>
                



            </div>
        </div>
    </div>
</template>
<script>

import _ from "lodash" ; 
import ObjectUtil from '../../frameworks/ObjectUtil';
import { TProjectProduct } from '../tProjects/class/models/TProjectProduct';

export default {
    data :  function() {
        return {


        } 
    } , 
    props : {
        /**
         * t_project_product_process
         */
        value : {
            type : Object ,
            default : () => {} , 
        } ,



    } , 
    computed : {
        cOpName : function(){
            const user = this.masterStore.getMUserById(this.value.TProjectProduct.operator_m_user_id) ; 
            return user?.full_name ?? "" ; 
            
        }
    } , 
    methods : {
        
        /**
         * 拠点名
         */
        getMBranchName : function (n)  {
            const finded = this.masterStore.getMBranchById(n ) ; 
            
            return finded === undefined ? "" : finded.shortNameOrName ; 
        } , 
        /**
         * 拠点色
         */
        getMBranchColor : function (n)  {
            const finded = this.masterStore.getMBranchColorById(n ) ;                         
            return ObjectUtil.isNUE( finded ) ? "" : "badge-" + finded ; 
        } , 

        /**
         * 商品ラベル 
         */
        getProductLabel01 : function(n) { 
            let val = "" ; 
            val += ObjectUtil.nu2ec(n.t_project_product?.display_02) + " "; 
 
            let sizeW = 0 ; 
            if (! _.isNil(n?.t_project_product?.size_w )) sizeW = n.t_project_product.size_w ; 

            let sizeH = 0 ; 
            if (! _.isNil(n?.t_project_product?.size_h )) sizeH = n.t_project_product.size_h ; 

            val += `W${sizeW.toLocaleString()} H${sizeH.toLocaleString()} ` ; 
            
            // メイン材料名
            if (! _.isNil( n.t_project_product.main_material )){
                val += n.t_project_product.main_material.name ; 
            }


            return val ; 
        } , 



    } ,
    created : function() {        
    }
}
</script>


