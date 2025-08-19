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
        <div v-show="dSuccsess" class="alert alert-success" role="alert">
            パスワード設定メールを送信しました
        </div>
        <div v-show="cIsError" class="alert alert-danger" role="alert">
            {{dErrorData.message}}
        </div>
        
        <table class="table table-striped table-dark">
            <thead>
                <tr class="text-nowrap" @click.prevent="sort">
                    <th scope="col">Actions</th>
                    <th scope="col" id="id"             :class="setStyleSort('id')">id</th>
                    <th scope="col" id="cd"             :class="setStyleSort('cd')">cd</th>
                    <th scope="col" id="full_name"      :class="setStyleSort('full_name')">名前</th>
                    <th scope="col" id="m_branch_id"    :class="setStyleSort('m_branch_id')">拠点</th>
                    <th scope="col">役割</th>
                    <th scope="col">Delete</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="n in cMUsers" :key="n.id">
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
                        <button type="button" class="btn btn-outline-light" @click.prevent="reset(n.id)" :disabled="n.interval">
                            <div v-if="n.loading">
                                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                送信中...
                            </div>
                            <div v-else>
                                パスワード設定メール送信                        
                            </div>
                        </button>
                    </td>

                    <td>{{n.id}}</td>
                    <td>{{n.cd}}</td>
                    <td>{{n.full_name}}</td>
                    <td>{{n.m_branch.short_name}}</td>
                    <td>
                        <m-tag-viewer
                            :tag-category-key="'m_users-role'"
                            :selected="n.tags"
                            >
                        </m-tag-viewer>
                    </td>

                    <td>
                        <button type="button" class="btn btn-danger" 
                            v-if="! getIsNskUser(n)"
                            @click.prevent="destroy(n.id)"
                            >
                            <i class="fas fa-trash fa-fw"></i>                            
                        </button>                    

                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import PageMixins from '@mixins/commons/PageMixins' ;
import _ from "lodash";

export default {
    mixins : [PageMixins] , 
    data : function(){
        return{
            dApiName : "mUser" ,
            dSuccsess : false ,
            dMUser : [] ,
            sort_key : "" ,
        }
    },
    computed : {
        cIsError : function () {
            return this.dErrorStatus !== undefined && this.dErrorStatus !== "" ; 
        } ,
        cEndpoint : function () {
            return `api/${this.dApiName}` ;
        } ,
        cCamelizedTableName : function () {
            const pluralized = Inflector.pluralize(this.dApiName) ;
            return Inflector.camelize(pluralized) ;
        } ,
        cMUsers : function() {
            const data = this.mainStore.masters[this.cCamelizedTableName].filter(x => x.id !== 0 && x.deleted_at == null) ;

            for (const x of data) {
                x.loading  = false ;
                x.interval = false ;
            } 

            // キー・昇順・降順の設定
            const key  = this.sort_key.replace(" desc", "") ;
            const asc  = Math.sign(this.sort_key.lastIndexOf(" desc")) ;
            const desc = -(asc) ;

            // オブジェクト ソート
            let result = data.sort(function(a, b) {
                return (a[key] < b[key]) ? asc : desc ;
            }) ;

            return result ;
        } ,
        cPasswordResendTime : function() {
            if (!process.env.MIX_PASSWORD_MAIL_RESEND_TIME) return 60000 ;
            return parseInt(process.env.MIX_PASSWORD_MAIL_RESEND_TIME, 10) * 1000 ;
        }
    } ,
    methods : {
        getIsNskUser : function(row) {
            const nskDomain = "nsksystem.co.jp" ; 

            return row.email.slice( nskDomain.length * -1 ) == nskDomain  ;
        } ,
        destroy : async function(id){
            if (!confirm('削除してよろしいですか?')) return ;
            let ep = this.cEndpoint + `/${id}` ;
            
            try {                 
                const res = await axios.delete(ep) ;
                const deleted  = _.cloneDeep(this.mainStore.masters[this.cCamelizedTableName].find(e => e.id === id)) ;                                
                const delIndex = this.mainStore.masters[this.cCamelizedTableName].indexOf(this.mainStore.masters[this.cCamelizedTableName].find(e => e.id === id)) ;
                deleted.deleted_at = new Date() ;
                if (delIndex != -1) this.mainStore.masters[this.cCamelizedTableName].splice(delIndex, 1,deleted) ;
            } catch (error) {
                // handle error
                this.$$errorConsole(error, ep) ; 
            }
        } ,
        reset : async function(id) {
            // パスワード設定メール送信
            const toUser  = this.cMUsers.find(e => e.id === id);
            let ep =  `api/auth/reset` ;
            if (!confirm(toUser.full_name+'さん('+toUser.email+')\nにパスワード設定メールを送信します')) return ;

            toUser.loading  = true ;
            toUser.interval = true ;

            try {       
                // Laravel通常のregisterのデータ形式準拠（メール+トークン）に変換
                const req = {
                    email  : toUser.email ,
                    _token : this.$$cCsrfToken , 
                }

                const res = await axios.post(ep, req) ;
                this.dSuccsess = true ;
                toUser.loading = false ;

                setTimeout(() => {
                    toUser.interval = false ;
                } , this.cPasswordResendTime) ;
            } catch (error) {
                this.$$errorConsole(error ,ep ) ; 
                toUser.loading  = false ;
                toUser.interval = false ;
            }
        } ,
        sort : function (event) {
            if (!event.target.id) return ;

            // クリックした列をソートキーに保存
            if (this.sort_key == event.target.id) {
                this.sort_key = event.target.id + " desc" ;
            } else {
                this.sort_key = event.target.id ;
            }
        } ,
        setStyleSort : function (key) {
            // ソートされた項目のStyle設定
            return {
                sort_asc : this.sort_key == key ,
                sort_desc: this.sort_key == key + " desc" ,
            } ;
        } ,
    } ,
}
</script>