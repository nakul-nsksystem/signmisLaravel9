<template>
    <div>
        <div class="row mb-2">
            <contents-header-left></contents-header-left>
            <contents-header-right></contents-header-right>
        </div>
        <construction-result-input-component
            v-model="dRow"
            :isTProject="false"
            />
    </div>
</template>

<script>
import PageMixins from '../../../../mixins/commons/PageMixins';
import DayJsEx from "../../../../frameworks/DayJsEx" ;
import ObjectUtil from '../../../../frameworks/ObjectUtil';
import NumberUtil from '../../../../frameworks/NumberUtil';
import ConstructionResultInputComponent from './ConstructionResultInputComponent.vue';

export default {
  components: { ConstructionResultInputComponent },
    data : function(){
        return {
            //t_project_constructionのレコードを入れる
            dRow : {} ,

            dApiName  : "tProjectDelivery",             


        }
    } ,
    computed : {


        cEndpoint : function () 
        {
            let ep =  `api/${this.dApiName}/showWithResults/${this.$route.params.id}` ;            
            return  ep ;
        } ,

    } ,
    methods : {

        getData : async function(){
            try {
                const res  = await axios.get(this.cEndpoint) ;

                this.dRow = ObjectUtil.deepCopyJ(res.data) ;

                // this.setDefaultValue() ;
            }
            catch (error) 
            {
                this.$$errorConsole(error ,this.cEndpoint ) ; 
            }   
        } ,
        
    } ,
    created : function(){
        this.getData() ;
    }
}
</script>