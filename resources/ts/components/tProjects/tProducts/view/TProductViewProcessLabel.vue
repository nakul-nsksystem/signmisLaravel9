<template>

    <div class="row">
        <div v-for="i in 9" class="col-12 "
            :class="classes"
            v-if="getDisplay(value , i )">
            {{getDisplay(value , i )}}
        </div>
        <div v-if="isValidVal(value.memo)" class="col-12 text-danger">
            {{value.memo}}
        </div>
    </div>
</template>

<script>
import NumberUtil from '../../../../frameworks/NumberUtil';
import ObjectUtil from '../../../../frameworks/ObjectUtil';

export default {
    data :  function() {
        return {



        } 
    } , 
    props : {
        /**
         * t_project_product_processのレコード
         */
        value : {
            type : Object , 
            
        } , 
        /**
         * 生産モード ( display_dispを使用 が)
         */
        isProduction : { 
            type : Boolean , 
            default : () => false , 
        } ,
        classes : {
            type : Array , 
            default : () => [] , 
        }
        
    } ,
    computed : {
        

    } ,
    methods : {

        


        /**
         * 値がNull Undefinedではない
         */
        isValidVal : function(val) 
        {
            return ! ObjectUtil.isNullOrUndefined(val) ; 
        } , 

        
        /**
         * 値がNull Undefinedではない
         */
        getDisplay : function(val , i ) 
        {
            const dispName = 'display_' + i.toString().padStart(2, '0') ; 
            const prodDispName = 'display_prod_' + i.toString().padStart(2, '0') ; 

            if ( this.isProduction ) { 
                if ( ! this.isValidVal(val[prodDispName]) ){
                    if ( ! this.isValidVal(val[dispName]) ) return false ; 

                    return val[dispName] ; 

                }
                else { 
                    return val[prodDispName] ; 
                }

            }
            else { 

                if ( ! this.isValidVal(val[dispName]) )  return false ; 
                return val[dispName] ; 

            }
            
        } , 

        /**
         * 工程の予測時間を取得
         */
        getPredictedWorkHour : function(tpProcess) {
            return NumberUtil.invalid2zr( tpProcess.predicted_work_hour) ; 
        } , 

        getValue : function(colName )  
        {            
            return this.$$getValue("value" , colName) ; 
        } ,
        setValue : function(colName , val){   
            this.$$setValue("value" , colName , val  ) ;
        } ,
        
        /**
         * 拠点名
         */
        getMBranchName : function (n)  {
            const finded = this.masterStore.getMBranchById(n.m_branch_id ) ; 
            return finded === undefined ? "" : finded.shortNameOrName ; 
        } , 

        /**
         * 工程名
         */
        getMProcessCategoryName : function (n)  {
            const finded = this.masterStore.getMProcessCategoryById(n.m_process_category_id ) ; 
            return finded === undefined ? "" : finded.name; 
        } , 


        
    }

}
</script>