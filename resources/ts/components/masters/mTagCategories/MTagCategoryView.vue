<template>
    
    <div>
        <p>タグカテゴリマスタ - View</p>
        <p>id = {{$route.params.id}}</p>

        <div class="form-group">
                <label for="inputOrderNo"></label>
                <p>order_no = {{dRow.order_no}}</p>
        </div>
        <div class="form-group">
                <label for="inputTagCategoryKey"></label>
                <p>カテゴリキー = {{dRow.tag_category_key}}</p>                
        </div>
        <div class="form-group">
                <label for="inputTagCategoryName"></label>
                <p>タグカテゴリ名称 = {{dRow.tag_category_name}}</p> 
        </div>
        <div class="form-group">
                <label for="inputTagShortName"></label>
                <p>タグカテゴリ略称 = {{dRow.tag_short_name}}</p> 
        </div>
        <!-- <div class="form-group">
                <label for="inputIsUserEditable">ユーザー編集可能</label>
                <input v-model="dRow.is_user_editable" class="form-control" id="inputIsUserEditable"  placeholder="" required>                
        </div>   -->
    </div>


</template>

<script>
import PageMixins from '../../../mixins/commons/PageMixins';
export default {
    mixins : [PageMixins] , 
    props : {
    } ,
    created : function () {
        
    },
   data :  function() {
        return {
            dRow : {} , 
            errorResponce : {} ,
        } 
    } , 
    computed : {
        isNew : function () {            
            return this.$route.params.id === undefined ; 
        } ,        
        isShow : function () {
            return this.isNew || this.dRow.id > 0 ; 
        } , 
        isError : function () {
            return this.errorResponce.code !== undefined ; 
        } ,        
        endpoint : function () {

            let ep =  `api/mTagCategory` ;
            
            if ( !this.isNew ) ep += `/${this.$route.params.id}` ; 
            return  ep ;
        } ,
    },
    methods : {        
        getData : async function () {
            try {
                
                const res = await axios.get(this.endpoint ) ; 
                this.dRow = res.data ;  
                
                
            } catch (error)  {
                console.log(error) ; 
                // handle error
                const {
                    status,
                    statusText
                } = error.response;
                console.error(`Error! HTTP Status: ${status} ${statusText} ${this.endpoint}`);

            }
            
        } ,
    } , 
    created : function () {
        
        if ( ! this.isNew) this.getData()  ; 
        
    }

    
}

</script>