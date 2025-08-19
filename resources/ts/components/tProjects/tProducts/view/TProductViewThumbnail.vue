<template>    
    <div 
        :style="cWidth" 
        class="border" 
        > 
        <div>                                
            <img                 
                class="img-responsive img-thumbnail" :src="cThumbnail(value)">
        </div>
        <!-- <div v-else-if="!dIsEditingProduct" class="">クリックで画像を選択</div>                         -->
    </div>
</template>

<script>
import DayJsEx from '../../../../frameworks/DayJsEx';
import ObjectUtil from '../../../../frameworks/ObjectUtil';
import _ from "lodash";

export default {
    data :  function() {
        return {



        } 
    } , 
    props : {
        /**
         * t_project_productsのレコード
         */
        value : {
            type : Object , 
            
        } , 
        index : {
            type : Number , 
        } , 
        size : { 
            type : String , 
            default : () => "sd" ,
        } ,
        
    } ,
    computed : {
        
        cWidth : function()  { 
            switch (this.size) { 
                case "sm" : 
                    return "width:128px" ; 

                case "md"  : 
                    return "width:256px" ; 
            }

            return "width:256px" ; 
        } , 

        /**
         * サムネイル
         */
        cThumbnail : function(){
            return function(row){
                
                // if ( ObjectUtil.isNUE(this.value?.t_project_file)){
                if ( _.isEmpty(this.value?.t_project_file)){
                    return `img/noimage.png`  ; 
                } 
                else {
                    const fileData = this.value.t_project_file.base64_thumbnail
                    return "data:image/jpeg;base64," + fileData ; 
                    //return ObjectUtil.isNUE(this.value?.t_project_file)
                }
            }
        },

        
    } ,
    methods : {

        getValue : function(colName )  
        {            
            return this.$$getValue("value" , colName) ; 
        } ,
        setValue : function(colName , val){   
            this.$$setValue("value" , colName , val  ) ;
        } ,
        
        dateFormat : function(value) {
            if(value === "" || value ===null) return "" ;
            return DayJsEx.format(value , "YYYY-MM-DD")
        },
        
    }

}
</script>