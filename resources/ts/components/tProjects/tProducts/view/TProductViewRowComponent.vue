<template>
    <div class="col-12 d-flex" >

        <div class="flex-grow-0 flex-shrink-0 form-group text-center">
            <t-product-view-thumbnail 
                v-model="value"
                :size="'sd'"
                />


        </div>
            
        <div class="flex-grow-1 flex-shrink-1 ml-3 ">
            <div class="flex-fill ml-xl-0 pb-2">
                <t-product-view-title 
                    v-model="value"
                    :is-delivery="isDelivery"
                    />
            </div>
            
            <div class="row">
                <div class="col-12 col-xl-3">                    
                    <t-product-view-info
                        v-model="value"
                    />
                </div>
                <div class="col-12 col-xl-9">
                    <t-product-view-processes 
                        :is-production="isProduction"
                        :is-view-result-control="isViewResultControl"
                        v-model="value.t_project_product_processes" />            
                                
                </div>
            </div>
            
            <div class="row pt-3">
                <div class="col-12 col-xl-4">
                    <t-product-view-separation 
                        v-model="value"
                        :index="index" />
                </div>

                <div class="col-12 col-xl-4 pl-xl-3">
                    <t-product-view-board-layout 
                        v-model="value"
                        :index="index" />

                </div>



            </div>


        </div>
    </div>
</template>

<script>

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
        },
        /**
         * 生産モード ( display_dispを使用 が)
         */
        isProduction : { 
            type : Boolean , 
            default : () => false , 
        } ,
        /**
         * 生産実績操作用パネル表示
         */
        isViewResultControl : { 
            type : Boolean , 
            default : () => false , 
        } ,

        /**
         * 納品紐づけで使用（分納チェック、数量入力）
         */
        isDelivery : {
            type : Boolean , 
            default : () => false ,
        }
        
    } ,
    computed : {
    } ,
    methods : {
        getValue : function(colName )  
        {            
            return this.$$getValue("value" , colName) ; 
        } ,
        setValue : function(colName , val){   
            this.$$setValue("value" , colName , val  ) ;
        } ,
    }

}
</script>