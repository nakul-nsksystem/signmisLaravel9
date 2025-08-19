<template>
    <div class="row">        
        <div class="col-12">
            <div v-show="isError" class="alert alert-danger" role="alert">
                {{errorResponce.message}}
            </div>

        </div>
        <div class="col-12 col-xl-3">
            <form v-if="isShow">
                <div class="form-group">
                    <label for="inputOrderNo">表示順</label>
                    <input v-model="row.order_no" class="form-control" id="inputOrderNo"  placeholder="Enter 表示順">                
                </div>
                <div class="form-group">
                    <label for="inputCd">コード</label>
                    <input v-model="row.cd" class="form-control" id="inputCd"  placeholder="Enter コード">                
                </div>
                <div class="form-group">
                    <label for="inputName">名称</label>
                    <input v-model="row.name" class="form-control" id="inputName"  placeholder="Enter 名称">                
                </div>

                <div class="form-group">
                    <label >対象材料カテゴリ</label>
                    <m-kv-select
                        v-model="row.material_category_m_kv_id"                                
                        :kv-key="'m_materials-category_m_kv_id'"
                        />

                    
                </div>

                <div class="form-group">
                    <label >生産管理対象</label>                    
                    <ns-checkbox-input
                        v-model="row.is_production"
                        id="processCategory-is_production"
                        />     
                </div>

                <div class="form-group">
                    <label>メディア分割可能</label>                    
                    <ns-checkbox-input
                        v-model="row.is_able_media_separate"
                        id="processCategory-is_able_media_separate"
                        />     
                </div>

                
                <div class="form-group">
                    <label>メディア分割 縦横 両方可能</label>                    
                    <ns-checkbox-input
                        v-model="row.is_able_media_separate_both_side"
                        id="processCategory-is_able_media_separate_both_side"
                        />     
                </div>
                <div class="form-group">
                    <label>メディア分割 重ね代</label>                    
                    <ns-number-input
                        v-model="row.media_separate_overlap_length"
                        />     
                </div>
                <div class="form-group">
                    <label>サイズ入力不要</label>                    
                    <ns-checkbox-input
                        v-model="row.is_not_input_size_needed"
                        id="processCategory-is_not_input_size_needed"
                        />     
                </div>

                <div class="form-group">
                    <label>メディアがロールではなく板</label>                    
                    <ns-checkbox-input
                        v-model="row.is_board"
                        id="processCategory-is_board"
                        />     
                </div>



                    


                <!-- {{$store.loginMUserId}} -->
                <button type="submit" class="btn btn-success" @click.prevent="postData()">保存</button>
            </form>
        </div>
        <div class="col-12 col-xl-4 ">
            <div class="row my-2">
                <div class="col-6 pl-xl-6">工程</div>
                <div class="col-3 pl-xl-3">デフォルト</div>
                <div class="col-3 pl-xl-4">必須</div>
            </div>
            <div class="row"
                v-for="n in cProcessCategoryList" 
                        :key="n.id">
                <div class="col-6 ml-3 mb-1 mb-xl-3 pl-0 pl-xl-5">
                    
                    <ns-checkbox-input
                        v-model="n.isChecked"
                        :id="'processCategoryCheck' + n.id"
                        :label="n.name"
                        />     
                </div>

                
                <div class="col-12 col-xl-3 mb-3 mb-xl-0 form-group" >
                    <ns-checkbox-input
                        v-model="n.isDefault"
                        :id="'processCategoryIsDefault' + n.id"                        
                        />                         
                </div>
                
                <div class="col-12 col-xl-2 mb-3 mb-xl-0 form-group" >
                    <ns-checkbox-input
                        v-model="n.isRequired"
                        :id="'processCategoryisRequired' + n.id"                        
                        />                         
                </div>
            </div>
        </div>

        
        
    </div>
</template>

<script>
import PageMixins from '../../../mixins/commons/PageMixins';
export default {
    mixins : [PageMixins] , 
    data :  function() {
        return {
            row : { } , 
            errorResponce : {} ,
        } 
    } , 
    computed : {
        isNew : function () 
        {            
            return this.$route.params.id === undefined ; 
        } ,        
        isShow : function () 
        {
            return this.isNew || this.row.id > 0 ; 
        } , 
        isError : function () 
        {
            return this.errorResponce.code !== undefined ; 
        } ,
        endpoint : function () 
        {
            let ep =  `api/mProductCategory` ;
            if ( !this.isNew ) ep += `/${this.$route.params.id}` ; 
            
            return  ep ;
        } ,

        cProcessCategoryList : function(){
            //console.log(this.mainStore.masters) ;
            if ( this.mainStore.masters.MProcessCategories === undefined ) return [] ; 

            if ( this.row?.link_process_categories_pivot === undefined ) return [] ; 
            const _this = this ; 
            const list = this.mainStore.masters.MProcessCategories.map(function(x) {

                const found = _this.row.link_process_categories_pivot.find(y => y.id == x.id )  ;                 
                
                const row = {
                    id : x.id , 
                    name : x.name ,
                    isDefault : found == undefined  ? false : found.pivot.is_default_on ,
                    isRequired : found == undefined  ? false : found.pivot.is_required , 
                    isChecked : found !== undefined  , 
                }
                return row ; 
            }) ; 
            return list; 
        } ,        
    } , 
    methods : {        
        getData : async function () {
            try {
                
                const res = await axios.get(this.endpoint ) ; 
                
                this.row = res.data ;  
                
                
            }
            catch (error) 
            {
                this.$$errorConsole(error ,this.endpoint ) ; 

            }
            
        } ,
        postData : async function () {
             try {

                 let res ; 
                 
                const processCategoryies = this.cProcessCategoryList.filter(x => x.isChecked) ;
                let processCategoryies4Post = []  ;
                console.log(processCategoryies) ; 
                processCategoryies.map(function(x){
                    const index = x.id ; 
                    processCategoryies4Post[index] = { 
                        "is_default_on" : x.isDefault ,
                        "is_required" : x.isRequired ,
                        }  ;
                    
                }) ; 
                this.row.m_process_category_ids = [] ; 
                this.row.m_process_category_ids = processCategoryies4Post ; 
                

                 if ( this.isNew )
                 {
                    res = await axios.post(this.endpoint ,this.row ) ; 
                    
                    this.mainStore.masters.MProductCategories.push(res.data) ; 

                    this.$router.push({ path: '..'  , append:true }) ;      
                 }
                 else
                 {
                    res = await axios.put(this.endpoint ,this.row) ; 
                    //console.log(res) ; 
                    const updated  = this.mainStore.masters.MProductCategories.find(e => e.id === res.data.id ) ; 
                    const updatedIndex = this.mainStore.masters.MProductCategories.indexOf(updated) ; 
                    //console.log(updated) ; 
                    if ( updatedIndex != -1 ){                        
                        this.mainStore.masters.MProductCategories.splice(updatedIndex, 1, res.data)
                    }  
                    
                    this.$router.push({ path: '../..'  , append:true }) ;  

                 }

                
                //this.row = res.data ;  
                
            }
            catch (error) 
            {
                
                const {
                    status,
                    statusText
                } = error.response;
                

                this.errorResponce = error.response.data ; 
                //console.error(`Error! HTTP Status: ${status} ${statusText} ${this.endpoint}`);
                console.error(`Error! HTTP Status: ${status} ${statusText}`);

            }
            
        } , 
    } , 
    created : function () 
    {
        if ( ! this.isNew) this.getData()  ; 
        
    }
    
}
</script>