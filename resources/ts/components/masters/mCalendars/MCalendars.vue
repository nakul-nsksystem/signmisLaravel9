<template>
    <div>
        <div class="row mb-2">
            <contents-header-left></contents-header-left>
            <contents-header-right>
                <router-link to='add' title="" append>
                    <button type="button" class="btn btn-primary" >
                        <i class="fas fa-plus fa-fw"></i>
                        新規作成
                    </button>                    
                </router-link>
            </contents-header-right>

        </div>
        <div v-show="$$cIsError" class="alert alert-danger" role="alert">
            {{dErrorData.message}}
        </div>
        <div class="row mb-3">
            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label>営業区分</label>
                    <m-kv-select
                        v-model="dSearchParams.category_m_kv_id"
                        :kv-key="'m_calendars-category'"
                        />
                </div>
            </div>
            <div class="col-12 text-right">
                <button type="button" class="btn btn-success" @click.prevent="search()" :disabled="dLoading">
                    <div v-if="dLoading">
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        検索中...
                    </div>
                    <div v-else>
                        <i class="fas fa-search fa-fw"></i>
                        検索
                    </div>
                </button>
            </div>
        </div>
        
        <div class="table-responsive">
            <table class="table table-striped table-dark text-nowrap">
                            
                <thead>
                    <tr>
                        <th scope="col">Actions</th>
                        <th scope="col">id</th>
                        <th scope="col">拠点</th>
                        <th scope="col">日付</th>
                        <th scope="col">名称</th>
                        <th scope="col">営業区分</th>
                        <th scope="col">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="n  in dValue" :key="n.id">
                        <td>
                            <router-link :to='"view/" + n.id'   title="" append>
                                <button type="button" class="btn btn-secondary" >
                                    <i class="fas fa-eye fa-fw"></i>                            
                                </button>                    
                                
                            </router-link>                            
                            <router-link :to='"edit/" + n.id'   title="" append>
                                <button type="button" class="btn btn-success" >
                                    <i class="fas fa-edit fa-fw"></i>                            
                                </button>                    

                            </router-link>
                            
                        </td>
                        <td>{{n.id}}</td>

                        <td>
                            <span v-if="cIsEmpty(n.m_branch_id)">{{n.m_branch.shortNameOrName}}</span>
                        </td> 
                        
                        <td>{{cDateFormat(n.day)}}</td> 
                        <td>{{n.calendar_note}}</td>

                        <td>
                            <span v-if="cIsEmpty(n.category_m_kv_id)">{{n.category_m_kv.kv_name}}</span>                      
                        </td>

                        <td>
                            <button type="button" class="btn btn-danger" @click.prevent="destroy(n.id)">
                                <i class="fas fa-trash fa-fw"></i>                            
                            </button>                    

                        </td>

                    </tr>
                    
                </tbody>
            </table>
        </div>
        <div class="row">
            <div class="col-12 col-xl-6">
                <pagination
                    :p-pagination.sync="dPagination"
                    @search="search($event)"
                    />
            </div> 
        </div>


    </div>
</template>

<script>
import PageMixins from '../../../mixins/commons/PageMixins';
import _ from "lodash"
import DayJsEx from '../../../frameworks/DayJsEx'

export default {
    mixins : [PageMixins] , 
    data : function() {
        return {
            dSearchParams : {} ,
            dValue : {} ,
            dApiName : "mCalendar" ,    
            dLoading : false ,
            
            dPagination : {                         // pagination
                links : [] ,                        // リンク
                total : -1 ,                        // 合計件数
                from : -1 ,                         // 現在ページの開始位置
                to : -1 ,                           // 現在ページの終了位置
            } ,
        }
    } ,
    computed : {
        cEndpoint : function() {
            return `api/${this.dApiName}`
        } ,
        cIsEmpty : function() {
            return function(val) {
                return !_.isNil(val)
            }
        } ,
        cDateFormat : function() {
            return function(val) {
                return DayJsEx.format(val)
            }
        }
    } ,
    methods : {
        search : async function (url){
            try {

                this.dLoading = true ;
                this.dIsDeliveryCompleted = false ;

                const getParams = _.cloneDeep(this.dSearchParams) ; 
                
                const ep = (url? url : this.cEndpoint + "/retrieve") ;
                const res = await axios.post(ep, getParams) ; 

                // pagination関連
                this.dPagination.links = res.data.links ;   // リンク
                this.dPagination.total = res.data.total ;   // 合計件数
                this.dPagination.from  = res.data.from ;    // 現在ページの開始位置
                this.dPagination.to    = res.data.to ;      // 現在ページの終了位置

                this.dValue = res.data.data ;

            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.cEndpoint) ; 
            } finally {

                this.dLoading = false ;
            }
        },
        destroy : async function(id)
        {
            let ep =  `${this.cEndPoint}/${id}` ;
            if(! confirm('削除してよろしいですか?')) return ; 
            
            try {

                const res = await axios.delete(ep ) ; 
                
                const deleted  = this.dValue.find(e => e.id === id ) ; 
                const delIndex = this.dValue.indexOf(deleted) ; 

                if ( delIndex != -1 )  this.dValue.splice(delIndex , 1) ; 
                
            }
            catch (error) 
            {
                this.$$cErrorConsole(error ,ep) ;
                
            }
        } ,
        
    } ,
    created : function(){
        // this.getData()
    }
}
</script>