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
                    />
            </div>
            
            <div class="row">
                <div class="col-12 col-xl-3">                    
                    <t-product-view-info
                        v-model="value"
                    />
                </div>
                <div class="col-12 col-xl-9">
                    <h5 class="text-lightDanger">不整合内容</h5>
                    <div class="table-responsive">
                        <table                                             
                            class="table table-dark table-striped ">
                            <thead>
                                <tr>                                            
                                    <th class="">内容</th>
                                    <th class="text-success">グループ(変更前)</th>
                                    <th class="text-lightPrimary">物件(変更後)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="n in mismatches">                                            
                                    <td class="">{{n.title}}</td>
                                    <td class="text-success">{{n.fromConvertedKey}}</td>
                                    <td class="text-lightPrimary">{{n.toConvertedKey}}</td>
                                    
                                </tr>
                            </tbody>

                        </table>

                    </div>                    
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
        mismatches : { 
            type : Array , 
            default : () => [] , 
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