<template>
    <div>
        <div class="row">
            <div class="col-12 col-xl-3">
                MasterRefs 
            </div>

        </div>
        <div class="row">
            <div class="col-12">
                <h5>材料マスタ引き m-material-select</h5>
            </div>
            <div class="col-12">
                <div class="row">
                    <div class="col-3">                
                        <div class="form-group">
                            <label >拠点</label>
                            <m-branch-select
                                v-model="dMaterialBranchId"
                                ></m-branch-select>
                        </div>
                    </div>

                    <div class="col-3">                
                        <div class="form-group">
                            <label >カテゴリーcategory-m-kv-id</label>                            
                            <m-kv-select
                                v-model="dMaterialCategoryMKvId"
                                :selected-item.sync="dMaterialCategoryMKv"
                                :kv-key="'m_materials-category_m_kv_id'"
                                />
                        </div>
                    </div>

                    <div class="col-3">                
                        <div class="form-group">
                            <label >サブカテゴリーsub-category-m-kv-id</label>                                                 
                            <m-kv-select
                                v-model="dMaterialSubCategoryMKvId"
                                :kv-category-id="cMaterialCategoryMKvIdTrimmed"
                                />
                        </div>
                    </div>
                    
                    <div class="col-3">                
                        <div class="form-group">
                            <label >IsDisplayName</label>
                            <ns-checkbox-input
                                v-model="dMaterialIsDisplayName"
                                :id="'MasterRefMMaterialIsDisplayName'"
                                />
                        </div>
                    </div>
                    

                </div>
            </div>            


            <div class="col-12">
                <div class="row">
                    <div class="col-6">
                        <div class="form-group">
                            <label >m-material-select</label>
                                    
                            <m-material-select                        
                                v-model="dMaterialId"
                                :selected-item.sync="dMaterial"
                                :m-branch-id="dMaterialBranchId"
                                :category-m-kv-id="dMaterialCategoryMKvId"
                                :sub-category-m-kv-id="dMaterialSubCategoryMKvId"     
                                :isDisplayName="dMaterialIsDisplayName"                   
                                />
                        </div>

                    </div>
                </div>
                
            </div>
        </div>
        
    </div>    
</template>


<script>
import _ from 'lodash';


export default {        
    data : function() {
        return {
            dMaterialId : 0 , 
            dMaterial : undefined  ,
            dMaterialCategoryMKv : undefined , 

            dMaterialBranchId : 0 , 
            dMaterialCategoryMKvId : 0 , 
            dMaterialSubCategoryMKvId : 0 , 
            dMaterialIsDisplayName : true , 
        }         
    } ,
    
    computed : {
        cMaterialCategoryMKvIdTrimmed:function() { 
            if ( _.isNil( this.dMaterialCategoryMKv) ) return 0 ; 


            return this.dMaterialCategoryMKv.target_m_kv_category_id ; 
        }

    } ,
    methods : {
    } ,
    created : function()
    {
        
        
    }
    
} 
</script>