<template>
    <div>        
        <div v-show="isError" class="alert alert-danger" role="alert">
            {{errorResponce.message}}
        </div>
        

        <form v-if="isShow">
            <div class="form-group">
                <label for="inputOrderNo">表示順</label>
                <input v-model="dRow.order_no" class="form-control" id="inputOrderNo"  placeholder="">                
            </div>
            <div class="form-group">
                <label for="inputTagCategoryKey">カテゴリキー</label>
                <input v-model="dRow.tag_category_key" class="form-control" id="inputTagCategoryKey"  placeholder="" >                
            </div>
            <div class="form-group">
                <label for="inputTagCategoryName">タグカテゴリ名称</label>
                <input v-model="dRow.tag_category_name" class="form-control" id="inputTagCategoryName"  placeholder="" required>                
            </div>
            <div class="form-group">
                <label for="inputTagShortName">タグカテゴリ略称</label>
                <input v-model="dRow.tag_short_name" class="form-control" id="inputTagShortName"  placeholder="">                
            </div>
            <div class="form-group">
                <label for="inputIsUserEditable">ユーザー編集可能</label>
                <input v-model="dRow.is_user_editable" class="form-control" id="inputIsUserEditable"  placeholder="" required>                
            </div>            

            <button type="submit" class="btn btn-success" @click.prevent="postData()">保存</button>
        </form>
    </div>
</template>

<script>
import PageMixins from '../../../mixins/commons/PageMixins';


export default {
    mixins : [PageMixins] , 
    data :  function() {
        return {
            dRow : {} , 
            apiName : "mTagCategory" ,
            //roleTagCatKey : "m_tag-categories_" ,
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

            let ep =  `api/${this.apiName}` ;
            
            if ( !this.isNew ) ep += `/${this.$route.params.id}` ; 
            return  ep ;
        } ,
        camelizedTableName : function (){

            const pluralized = Inflector.pluralize(this.apiName)    ; 
            console.log(pluralized) ;
            return Inflector.camelize(pluralized); 
        }
    } , 
    
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
                //console.error(`Error! HTTP Status: ${status} ${statusText}`);

            }
            
        } ,
        postData : async function () {
             try {
                
                let res ; 
                 
                if ( this.isNew ) {                    
                    res = await axios.post(this.endpoint ,this.dRow ) ; 
                    
                    this.mainStore.masters[this.camelizedTableName].push(res.data) ; 

                    this.$router.push({ path: '..'  , append:true }) ;      
                } else {
                    
                    res = await axios.put(this.endpoint ,this.dRow) ; 

                    const updated  = this.mainStore.masters[this.camelizedTableName].find(e => e.id === res.data.id ) ; 
                    const updatedIndex = this.mainStore.masters[this.camelizedTableName].indexOf(updated) ; 
                    console.log(updated) ; 
                    if ( updatedIndex != -1 ){                        
                        this.mainStore.masters[this.camelizedTableName].splice(updatedIndex, 1, res.data)
                    }  
                    
                    this.$router.push({ path: '../..'  , append:true }) ;  

                }

                
                //this.row = res.data ;  
                
            } catch (error)  {
                console.log(error) ; 
                // handle error
                const {
                    status,
                    statusText
                } = error.response;

                this.errorResponce = error.response.data ; 

                console.error(`Error! HTTP Status: ${status} ${statusText}`);

            }
            
        } , 
    } , 
    created : function () {
        
        if ( ! this.isNew) this.getData()  ; 
        
    }
    
}
</script>