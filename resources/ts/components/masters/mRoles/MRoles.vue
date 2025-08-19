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
        <div v-show="cIsError" class="alert alert-danger" role="alert">
            {{dErrorData.message}}
        </div>
        
        <table class="table table-striped table-dark">
            <thead>
                <tr class="text-nowrap" @click.prevent="sort">
                    <th scope="col">Actions</th>
                    <th scope="col" id="id"     :class="setStyleSort('id')">id</th>
                    <th scope="col" id="name"   :class="setStyleSort('name')">Name</th>
                    <th scope="col">Delete</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="n in cList" :key="n.id">
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
                    <td>{{n.name}}</td>

                    <td>
                        <button type="button" class="btn btn-danger" @click.prevent="destroy(n.id)">
                            <i class="fas fa-trash fa-fw"></i>                            
                        </button>                   
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import PageMixins from "@mixins/commons/PageMixins" ;

export default {
    mixins : [PageMixins] , 
    data : function(){
        return{
            dApiName : "mRole",
            dRow : {} ,
            sort_key : "" ,
        }
    },
    computed : {
        cIsError : function () {
            return this.dErrorStatus !== undefined && this.dErrorStatus !== "" ; 
        } ,
        cEndpoint : function () {
            let ep =  `api/${this.dApiName}` ;            
            return  ep ;
        } ,
        cList : function() {
            const data = this.dRow ;
            if (!data.length) return ;

            // キー・昇順・降順の設定
            const key  = this.sort_key.replace(" desc", "") ;
            const asc  = Math.sign(this.sort_key.lastIndexOf(" desc")) ;
            const desc = -(asc) ;

            // オブジェクト ソート
            let result = data.sort(function(a, b) {
                return (a[key] < b[key]) ? asc : desc ;
            }) ;

            return result ;
        }
    } ,
    methods : {
        getData : async function (){
            try {
                const res = await axios.get(this.cEndpoint) ;
                this.dRow = res.data ;

            } catch (error) {
                this.$$errorConsole(error, this.cEndpoint) ;
            }   
        } ,
        destroy : async function(id){
            if(! confirm('削除してよろしいですか?')) return ; 
            let ep = this.cEndpoint + `/${id}` ;
            
            try {                 
                const res = await axios.delete(ep) ;
                const deleted  = this.dRow.find(e => e.id === id) ;
                const delIndex = this.dRow.indexOf(deleted) ;
                if (delIndex != -1) this.dRow.splice(delIndex, 1) ;
            } catch (error) {
                // handle error
                this.$$errorConsole(error, ep) ;
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
    created : function () {
        if (this.mainStore.isAppReady) {
            this.getData() ;
        }
    } ,
}
</script>