<template>
    <div>
        <div class="row ">
            <div class="w-100 border-bottom mx-3 pb-2 mb-2">
                <div class="row ">
                    <div class="col-6 col-xl-6 d-flex align-items-end">
                        <p class="h5 pb-0 mb-0">入力</p>
                    </div>
                    <div class="col-6 col-xl-6 d-flex">
                        <div class="ml-auto">
                            <button type="button" class="btn btn-primary" @click.prevent="add" :disabled="!cIsEditable">
                                <i class="fas fa-plus fa-fw"></i>
                                追加
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <div class="row">            
            <div class="col-12">
                <div class="table-responsive">
                    <table class="table table-dark ">
                        <thead>
                            <tr>
                                <th>&nbsp;</th>
                                <th class="w-25" style="min-width:100px;">W</th>
                                <th class="w-25" style="min-width:100px;">H</th>
                                <th style="width:10%;min-width:100px;">枚数</th>
                                <th style="width:15%;min-width:100px;"><span v-show="!cIsCustomerProvide">単価/枚</span></th>
                                <th class="text-right " style="width:15%;min-width:100px;" ><span v-show="!cIsCustomerProvide">金額</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(n ,index) in value.Layouts">
                                <td>
                                    <button type="button" class="btn btn-danger" @click.prevent="destroy(n)" :disabled="!cIsEditable">
                                        <i class="fas fa-trash fa-fw"></i>                            
                                    </button>                                                     
                                </td>                  

                                <td>
                                    <validation-provider name="W"
                                        :vid="`boardsManualEditor-w${index}`" 
                                        :rules="`${cIsValid ? 'required|min_value:1' : ''}`" 
                                        immediate v-slot="{ errors }">
                                        <ns-number-input v-model="n.w" 
                                        :disabled="!cIsEditable"/>
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </validation-provider>

                                    <!-- <ns-number-input v-model="cCustomSheetWidth" /> -->
                                </td>
                                <td>
                                    <validation-provider name="H"
                                        :vid="`boardsManualEditor-h${index}`" 
                                        :rules="`${cIsValid ? 'required|min_value:1' : ''}`" 
                                        immediate v-slot="{ errors }">
                                        <ns-number-input v-model="n.h" 
                                        :disabled="!cIsEditable"/>
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </validation-provider>
                                </td>
                                <td>
                                    <validation-provider name="枚数"
                                        :vid="`boardsManualEditor-qty${index}`" 
                                        :rules="`${cIsValid ? 'required|min_value:1' : ''}`" 
                                        immediate v-slot="{ errors }">
                                        <ns-number-input v-model="n.qty" 
                                        :disabled="!cIsEditable"/>
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </validation-provider>
                                </td>
                                <td>
                                    <validation-provider name="単価/枚"
                                        v-show="!cIsCustomerProvide"
                                        :vid="`boardsManualEditor-price${index}`" 
                                        :rules="`${cIsValid && !cIsCustomerProvide? 'required|min_value:1' : ''}`" 
                                        immediate v-slot="{ errors }">
                                        <ns-number-input v-model="n.price" 
                                        :disabled="!cIsEditable"/>
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </validation-provider>
                                </td>
                                <td class="text-right align-middle">
                                    <span v-show="!cIsCustomerProvide">{{n.TotalMaterialCost.toLocaleString() }} 円</span>
                                </td>

                            </tr>     
                            <tr>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td class="text-right ">{{cTotalQty}}</td>
                                <td>&nbsp;</td>
                                <td class="text-right " ><span v-show="!cIsCustomerProvide">{{cTotalCost.toLocaleString()}} 円</span></td>
                                
                            </tr>
                        </tbody>
                    </table>
                </div>                
            </div>
            
        </div>

    </div>
        

</template>

<script>
import NumberUtil from '../../../../frameworks/NumberUtil';
import { BoardLayoutContainerManual } from '../../class/boardLayouts/containers/BoardLayoutContainerManual';

export default {
    data :  function() {
        return {
            //value : this.value ,


        } 
    } , 
    props : {
        value : {
            type :BoardLayoutContainerManual  
        } ,
    } ,
    computed : {
        cIsValid : function() { 
            return this.value?.IsSelected ?? false ; 
        } , 
        cIsCustomerProvide : function(){ 
            return this.value?._manager?.is_customer_provide ?? false ; 
        } ,
        cIsAlreadyOrdered : function(){ 
            // console.log(this.value?._manager?.t_project_product_process?.t_p_order_details) ;
            return this.value?._manager?.t_project_product_process?.t_p_order_details?.length>0 ; 
        } ,

        cIsEditable : function() {
            const val = NumberUtil.invalid2zr(this.mainStore.getRole("t_project-price-view-permission")) ;
            return val >= 100 ||  !this.cIsAlreadyOrdered;        
        } ,

        cTotalQty : function() {
            return this.value.TotalQty ; 
        } ,
        cTotalCost : function() {
            return this.value.TotalCost ;
        } ,
    } ,
    methods : {
        add : function ()
        {
            this.value.add() ; 
        } ,
        
        /**
         * 行の削除
         */
        destroy : function (row) {
            this.value.destroy(row) ; 
        }  ,

    } ,
}
</script>