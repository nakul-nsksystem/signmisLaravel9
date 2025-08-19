<template>
    <div>
        <div class="row mb-2">
            <contents-header-left></contents-header-left>
            <contents-header-right>
                <div v-if="dSelectedCategoryId">
                    <button type="button" class="btn btn-primary" @click.prevent="addTag()">
                        <i class="fas fa-plus fa-fw"></i>
                        新規作成
                    </button>
                </div>
            </contents-header-right>
        </div>        

        <div class="row">
            <div v-show="cIsError" class="alert alert-danger" role="alert">
                {{dErrorData.message}}
            </div>
            <!-- タグカテゴリ -->
            <div class="col-12 col-xl-3">

                <table class="table table-striped table-dark">

                    <thead>
                        <tr>
                            <th scope="col">カテゴリを選択してください</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr 
                            v-for="n  in dCategory" 
                            :key="n.id" 
                            @click="selectCategoryRow(n.id); clearEvent()" 
                            :class="{selected:dSelectedCategoryId===n.id}" 
                        >
                            <td>{{n.explanation}}</td>
                        </tr>

                    </tbody>
                </table>
            </div>

            <div class="col-12 col-xl-9">
                                
                <table class="table table-striped table-dark">
                    <thead>
                        <tr>
                            <th scope="col">id</th>
                            <th scope="col">ordet_no</th>
                            <th scope="col">キー</th>
                            <th scope="col">説明</th>
                            <th scope="col">system_flg</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>

                    <tbody >
                        <tr 
                            v-for="i in cMRoleKeys" :key="i.id" 
                            @click.prevent="selectRoleKey(i.id)" :class="{selected:dSelectedRoleKey.id===i.id}"
                        >
                            <td>{{i.id}}</td>
                            <td>{{i.order_no}}</td>
                            <td>{{i.name}}</td>
                            <td>{{i.explanation}}</td>
                            <td>{{i.system_flg}}
                            <td>                        
                                <button
                                    type="button" 
                                    class="btn btn-danger" 
                                    @click.prevent.stop="destroy(i.id)" 
                                    >
                                    <i class="fas fa-trash fa-fw"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-if="Object.keys(dSelectedRoleKey).length>0">

                    <div class="form-group">
                        <label for="inputOrderNo">order_no</label>
                        <input v-model="dSelectedRoleKey.order_no" class="form-control" id="inputOrderNo"  placeholder="">
                    </div>
                    <div class="form-group">
                        <label for="inputTagKey">キー</label>
                        <input v-model="dSelectedRoleKey.name" class="form-control" id="inputTagKey"  placeholder="" >
                    </div>
                    <div class="form-group">
                        <label for="inputTagName">説明</label>
                        <input v-model="dSelectedRoleKey.explanation" class="form-control" id="inputTagName"  placeholder="" required>
                    </div>                    
                    <div class="form-check">
                        <input type="checkbox" v-model="dSelectedRoleKey.system_flg" class="form-check-input" id="inputSystemFlg" true-value=1 false-value=0>                
                        <label class="form-check-label" for="inputSystemFlg">システム使用権限</label>
                    </div>
                    <div class="text-right mt-3">
                        <button type="submit" class="btn btn-success" @click.prevent="postData()">保存</button>
                        <button type="submit" class="btn btn-secondary" @click.prevent="clearEvent()">キャンセル</button>
                    </div>
                </div>

            </div>

        </div>

    </div>

</template>

<style scoped>
.selected{
    background-color : #C0C0C0 !important ;
    /*エフェクト transition: all .5s ease; */

};
</style>]


<script>
import PageMixins from '../../../mixins/commons/PageMixins';
export default {
    mixins : [PageMixins] , 
    data :  function() {
        return {
            dCategory : {} ,

            dSelectedCategory : {}  ,
            dSelectedCategoryId : 0 ,
            dSelectedRoleKey : {} ,
            dApiName : "mRoleKey" ,
            dAddTagButton : false ,
        }
    } ,

    computed : {
        cMRoleKeys : function (){
            if ( this.dCategory[this.dSelectedCategory] === undefined) return [] ;
            return this.dCategory[this.dSelectedCategory].m_role_keys ;
        } ,
        cEndPoint : function (){
            let ep =  `api/${this.dApiName}` ;
            if (this.dAddTagButton!= true) ep += `/${this.dSelectedRoleKey.id}`;
            return  ep ;
        } ,
        cIsError : function () {
            return this.dErrorStatus !== undefined && this.dErrorStatus !== "" ; 
        } ,  
    } ,


    methods : {
        getData : async function () {
            try {
                const ep = `api/mRoleKeyCategory`                
                const res = await axios.get(ep ) ; 
                this.dCategory = res.data ;                                  
            }
            catch (error) 
            {
                // handle error
                this.$$errorConsole(error ,ep ) ; 
            }

        },
        selectCategoryRow : function(id) { 

            const searchCategory = this.dCategory.find(i => i.id === id );
            const setCategory = this.dCategory.indexOf(searchCategory);
            //object
            this.dSelectedCategory = setCategory ;
            //id
            this.dSelectedCategoryId = id ;

        } ,

        selectRoleKey : function(id){

            const searchRoleKey = this.cMRoleKeys.find(i => i.id === id );
            const setRoleKeyIndex = this.cMRoleKeys.indexOf(searchRoleKey);
            const roleKeys = this.cMRoleKeys[setRoleKeyIndex] ;
            this.dAddTagButton = false ;            

            this.dSelectedRoleKey= Object.assign({},roleKeys) ;
        },

        clearEvent : function(){
            
            this.dSelectedRoleKey = {} ;
            this.dAddTagButton = false ;
        
        },

        addTag : function() {

            this.dSelectedRoleKey = { 
                    m_role_key_category_id : this.dSelectedCategoryId ,
                    name                   : "" ,
                    explanation            : "" ,
                    system_flag            : 0 ,
                } ;
            this.dAddTagButton = true ;        
        },

        destroy : async function(id){

            const ep =  `api/mRoleKey/${id}` ;
            if(! confirm('削除してよろしいですか?')) return ;
            try {              
                const res = await axios.delete(ep) ;
                const deleted  = this.cMRoleKeys.find(e => e.id === id ) ;
                const delIndex = this.cMRoleKeys.indexOf(deleted) ;
                if ( delIndex != -1 )  this.cMRoleKeys.splice(delIndex , 1) ;
                this.clearEvent();
            } catch (error) {
                 // handle error
                this.$$errorConsole(error ,ep ) ; 
            }
        } ,

        postData : async function () {
             try {
                let res ;
                //console.log(this.cMRoleKeys) ; 
                if (this.dAddTagButton){
                    res = await axios.post(this.cEndPoint ,this.dSelectedRoleKey) ;
                    this.cMRoleKeys.push(res.data) ;
                    this.clearEvent();
                } else {   
                    res = await axios.put(this.cEndPoint ,this.dSelectedRoleKey) ;
                    const updated  = this.cMRoleKeys.find(e => e.id === res.data.id ) ; 
                    const updatedIndex = this.cMRoleKeys.indexOf(updated) ; 
                    if ( updatedIndex != -1 ){                        
                        this.cMRoleKeys.splice(updatedIndex, 1, res.data)
                    }
                    this.clearEvent();
                }
            } catch (error) {
                 // handle error
                this.$$errorConsole(error ,this.cEndpoint ) ; 

            }

        } ,

    } ,
    created : function() {
        this.getData()
    }
}
</script>