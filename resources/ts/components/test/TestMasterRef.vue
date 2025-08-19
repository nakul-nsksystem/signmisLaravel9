<template>
    <div>
        <div class="row mb-3">
            
            <div class="col-6">                
                MBranchSelect : {{dMBranchId}}
                <m-branch-select 
                    v-model="dMBranchId"        
                    :selected-item.sync="dMBranchItem"/> 
            </div>

            <div class="col-6">                
                {{dMBranchItem}}
            </div>
            
        </div>    


        <div class="row mb-3">
            
            <div class="col-6">                
                MUserSelect : {{dMUserId}}
                <m-user-select 
                    :m-branch-id="dMBranchId"
                    v-model="dMUserId"        
                    :selected-item.sync="dMUserItem"/> 
            </div>

            <div class="col-6">                
                {{dMUserItem}}
            </div>
            
        </div>    


        <div class="row mb-3">
            <div class="col-6">
                MCustomerSelect : {{dCustomerId}}
                <m-customer-select 
                    :m-branch-id="dMBranchId"
                    :dealing-cds="[2]"
                    v-model="dCustomerId"        
                    :selected-item.sync="dCustomerItem"/>

            </div>
            <div class="col-6">
                {{dCustomerItem}}
            </div>
        </div>


        <div class="row mb-3">
            <div class="col-6">
                MKvSelect : {{dMKvId}}
                <m-kv-select
                    :kv-key="dMKvKey"
                    v-model="dMKvId"
                    :selected-item.sync="dMKvItem" />
            </div>
            <div class="col-6">
                {{dMKvItem}}
            </div>
        </div>

        

        <div class="row mb-3">
            <div class="col-6">
                MProductionSelect : {{dMProductionId}}
                <m-production-select
                    :m-branch-id="dMBranchId" 
                    v-model="dMProductionId"
                    :selected-item.sync="dMProductionItem"
                    />
            </div>
            <div class="col-6">
                {{dMProductionItem}}
            </div>
        </div>

        <div class="row mb-3">
            <div class="col-6">
                MProductionModeSelect : {{dMProductionModeId}}
                <m-production-mode-select
                    :m-production-id="dMProductionId"
                    v-model="dMProductionModeId"
                    :selected-item.sync="dMProductionModeItem"
                    />
            </div>
            <div class="col-6">
                {{dMProductionModeItem}}
            </div>
        </div>


        <div class="row mb-3">
            <div class="col-6">
                MProductionOptionSelect : {{dMProductionOptionId}}
                <m-production-option-select
                    :m-production-id="dMProductionId"
                    v-model="dMProductionOptionId"
                    :selected-item.sync="dMProductionOptionItem"
                    />
            </div>
            <div class="col-6">
                {{dMProductionOptionItem}}
            </div>
        </div>        

    </div>
    <!--
    
    ></m-kv-select>
    -->


</template>

<script>
export default {
    
    data : function() {
        return {
            dMBranchId : 2 , 
            dMBranchItem : undefined , 

            dMUserId : 1 , 
            dMUserItem : undefined ,


            dCustomerId : 932 , 
            dCustomerItem : undefined ,

            dMKvId : 2110003 , 
            dMKvKey : "t_project_product_process-post-cartain-type_bag" , 
            dMKvItem : undefined ,
            
            dMProductionId : 6 , 
            dMProductionItem : undefined ,

            dMProductionModeId : 5 , 
            dMProductionModeItem : undefined ,

            dMProductionOptionId : 5 , 
            dMProductionOptionItem : undefined ,
        }
    } ,    
}
</script>
