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

            <!-- タグカテゴリ -->
            <div class="col-12 col-xl-3">

                <table class="table table-striped table-dark">

                    <thead>
                        <tr>
                            <th scope="col">タグカテゴリを選択してください</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr 
                            v-for="n  in mainStore.masters.MTagCategories" :key="n.id" @click="selectCategoryRow(n.id); 
                            clearEvent()" :class="{selected:dSelectedCategoryId===n.id}" 
                        >
                            <td>{{n.tag_category_name}}</td>
                        </tr>

                    </tbody>
                </table>
            </div>

            <!-- タグ -->
            <div class="col-12 col-xl-9">
                <div v-show="cIsError" class="alert alert-danger" role="alert">
                    {{dErrorResponce.message}}
                </div>

                <div v-if="dClonedObj">

                    <div class="form-group">
                        <label for="inputOrderNo">order_no</label>
                        <input v-model="dClonedObj.order_no" class="form-control" id="inputOrderNo"  placeholder="">
                    </div>
                    <div class="form-group">
                        <label for="inputTagKey">タグキー</label>
                        <input v-model="dClonedObj.tag_key" class="form-control" id="inputTagKey"  placeholder="" >
                    </div>
                    <div class="form-group">
                        <label for="inputTagName">タグ名称</label>
                        <input v-model="dClonedObj.tag_name" class="form-control" id="inputTagName"  placeholder="" required>
                    </div>
                    <div class="form-group">
                        <label for="inputTagColorMKv">色</label>
                        <m-kv-select
                            kv-key="m_tags-tag-color"
                            v-model="dClonedObj.tag_color_m_kv_id"
                        ></m-kv-select>
                    </div>

                    <div class="form-group">
                        <label for="inputMemo">メモ</label>
                        <input v-model="dClonedObj.memo" class="form-control" id="inputMemo"  placeholder="">
                    </div>
                    <button type="submit" class="btn btn-success" @click.prevent="postData()">保存</button>
                    <button type="submit" class="btn btn-secondary" @click.prevent="clearEvent()">キャンセル</button>

                </div>

                <table class="table table-striped table-dark">
                    <thead>
                        <tr>
                            <th scope="col">id</th>
                            <th scope="col">タグキー</th>
                            <th scope="col">名称</th>
                            <th scope="col">色</th>
                            <th scope="col">備考</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>

                    <tbody >
                        <tr 
                            v-for="i in cMTags" :key="i.id" 
                            @click.prevent="selectTagRow(i.id)" :class="{selected:cSelectedTagId===i.id}"
                        >
                            <td>{{i.id}}</td>
                            <td>{{i.tag_key}}</td>
                            <td>{{i.tag_name}}</td>
                            <td :class="tagColor(i.tag_color_m_kv)">{{i.tag_color_m_kv_id}}
                            <td>{{i.memo}}</td>
                            <td>                        
                                <button
                                    type="button" 
                                    class="btn btn-danger" 
                                    @click.prevent.stop="destroy(i.id)" 
                                    v-show="i.is_user_editable!=0"
                                    >
                                    <i class="fas fa-trash fa-fw"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

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
import _ from "lodash";

export default {
    mixins : [PageMixins] , 
    data :  function() {
        return {
            dSelectedCategory : {}  ,
            dSelectedCategoryId : undefined  ,
            dSelectedTag : {} ,
            dClonedObj : undefined ,
            dApiName : "mTag" ,
            dErrorResponce : {} ,
        }
    } ,

    computed : {
        cMTags : function (){
            if ( this.mainStore.masters.MTagCategories[this.dSelectedCategory] === undefined) return [] ;
            // return this.mainStore.masters.MTagCategories[this.dSelectedCategory].m_tags ;
            return this.mainStore.masters.MTagCategories[this.dSelectedCategory].m_tags ?? [] ;
        } ,
        cEndPoint : function (){
            let ep =  `api/${this.dApiName}` ;
            if (this.cSelectedTagId) ep += `/${this.dSelectedTag.id}`;
            return  ep ;
        } ,
        cSelectedTagId : function (){
            if ( this.dSelectedTag === undefined || this.dSelectedTag.id === undefined) return "" ;
            return this.dSelectedTag.id ;
        },
        cIsError : function () {
            return this.dErrorResponce.code !== undefined; 
        },
    } ,


    methods : {
        selectCategoryRow : function(id) { 

            const searchCategory = this.mainStore.masters.MTagCategories.find(i => i.id === id );
            const setCategory = this.mainStore.masters.MTagCategories.indexOf(searchCategory);
            //object
            this.dSelectedCategory = setCategory ;
            //id
            this.dSelectedCategoryId = id ;

        } ,

        selectTagRow : function(id){

            const searchTag = this.cMTags.find(i => i.id === id );
            const setTagIndex = this.cMTags.indexOf(searchTag);
            this.dSelectedTag = this.cMTags[setTagIndex] ;

            if(!this.dSelectedTag.is_user_editable) {
                alert("編集できません") 
                return  ;
            }
            this.dClonedObj = _.cloneDeep(this.dSelectedTag) ;
        },

        tagColor : function(mKv){
            if(!mKv) return "" ;
            return "text-" + mKv.kv_name ;

        },

        clearEvent : function(){

            this.dSelectedTag = {} ;
            this.dClonedObj = undefined ;
            this.dErrorResponce.code = undefined ;              
        
        },

        addTag : function() {

            this.dSelectedTag = {} ;

            if(this.dClonedObj !== undefined) {
                delete this.dClonedObj.id ;
                delete this.dClonedObj.tag_color_m_kv ;
                this.dClonedObj.tag_color_m_kv_id = null;
                delete this.dClonedObj.created_at ;
                delete this.dClonedObj.updated_at ;
            }
            
            this.dClonedObj = { 
                    m_tag_category_id : this.dSelectedCategoryId ,
                    is_user_editable : 1 ,
                } ;
            this.dErrorResponce.code = undefined ;          
        
        },

        destroy : async function(id){

            let ep2 =  `api/mTag/${id}` ;
            if(! confirm('削除してよろしいですか?')) return ;
            try {              
                const res = await axios.delete(ep2) ;
                const deleted  = this.cMTags.find(e => e.id === id ) ;
                const delIndex = this.cMTags.indexOf(deleted) ;
                if ( delIndex != -1 )  this.cMTags.splice(delIndex , 1) ;
                this.clearEvent();
            } catch (error) {
                // handle error
                const {
                    status,
                    statusText
                } = error.response;

                console.error(`Error! HTTP Status: ${status} ${statusText} ${ep2}`);
            }
        } ,

        postData : async function () {
             try {
                let res ;
                // const combining = Object.assign(this.dSelectedTag,this.dClonedObj);
                //console.log(this.cMTags) ; 
                if (!this.cSelectedTagId){
                    res = await axios.post(this.cEndPoint ,this.dClonedObj) ;
                    this.cMTags.push(res.data) ;
                    this.clearEvent();
                } else {   
                    res = await axios.put(this.cEndPoint ,this.dClonedObj) ;
                    const updated  = this.cMTags.find(e => e.id === res.data.id ) ; 
                    const updatedIndex = this.cMTags.indexOf(updated) ; 
                    if ( updatedIndex != -1 ){                        
                        this.cMTags.splice(updatedIndex, 1, res.data)
                    }
                    this.clearEvent();
                }
            } catch (error) {
                //console.log(error) ;
                //handle error
                const {
                    status,
                    statusText
                } = error.response;

                this.dErrorResponce = error.response.data ;

                console.error(`Error! HTTP Status: ${status} ${statusText}`);
                //console.error(`Error! HTTP Status: ${status} ${statusText} ${this.cEndPoint}`);

            }

        } ,

    } ,
}
</script>