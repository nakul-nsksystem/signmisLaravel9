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
        
        <table class="table table-striped table-dark">
            <thead>
                <tr class="text-nowrap" @click.prevent="sort">
                    <th scope="col">Actions</th>
                    <th v-show="$$cIsDebug" scope="col" id="id"             :class="setStyleSort('id')">id</th>
                    <th scope="col" id="order"          :class="setStyleSort('order')">順</th>
                    <th v-show="$$cIsDebug" scope="col" id="cd"             :class="setStyleSort('cd')">cd</th>
                    <th scope="col" id="name"           :class="setStyleSort('name')">名称</th>
                    <th scope="col">生産管理対象</th>
                    <th scope="col">生産カテゴリ</th>
                    <th scope="col">生産管理文字色</th>
                    <th scope="col">生産先1</th>
                    <th scope="col">生産先2</th>
                    <th scope="col">生産先3</th>
                    <th scope="col">生産先4</th>

                    <th scope="col">Delete</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="n in cList" :key="n.id">
                    <td>
                        <!-- <router-link :to='"view/" + n.id'   title="" append>
                            <button type="button" class="btn btn-secondary" >
                                <i class="fas fa-eye fa-fw"></i>                            
                            </button>                    
                        </router-link>                             -->
                        <router-link :to='"edit/" + n.id'   title="" append>
                            <button type="button" class="btn btn-success" >
                                <i class="fas fa-edit fa-fw"></i>                            
                            </button>                    
                        </router-link>
                    </td>

                    <td v-show="$$cIsDebug">{{n.id}}</td>
                    <td>{{n.order_no}}</td>
                    <td v-show="$$cIsDebug">{{n.cd}}</td>
                    <td>{{n.name}}</td>
                    <td><yes-no-bool-view v-model="n.is_production" /></td>
                    <td>
                        {{getProductionMKvName(n)}}
                        
                    </td>
                    <td>
                        <div :style="getColor(n)" class="my-1 mx-3">
                            &nbsp;
                        </div>
                    </td>
                    <td>
                        {{n.m_production_memo_01}}
                    </td>
                    <td>
                        {{n.m_production_memo_02}}
                    </td>
                    <td>
                        {{n.m_production_memo_03}}
                    </td>
                    <td>
                        {{n.m_production_memo_04}}
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
</template>

<script>
import PageMixins from "@mixins/commons/PageMixins" ;

export default {
    mixins : [PageMixins] ,     
    data : function () {
        return {
            dApiName : "mProcessCategory" ,
            sort_key : "order desc" ,
        }
    } ,
    computed : {
        cEndpoint : function () {
            return `api/${this.dApiName}` ;
        } ,
        cCamelizedTableName : function () {
            const pluralized = Inflector.pluralize(this.dApiName) ;
            return Inflector.camelize(pluralized) ;
        } ,
        cList : function() {
            const data = this.mainStore.masters[this.cCamelizedTableName].filter(x => x.id !== 0) ;

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
        destroy : async function (id) {
            if (!confirm('削除してよろしいですか?')) return ; 
            let ep = this.cEndpoint + `/${id}` ;
            
            try {
                const res = await axios.delete(ep) ;
                const deleted  = this.mainStore.masters[this.cCamelizedTableName].find(e => e.id === id) ;
                const delIndex = this.mainStore.masters[this.cCamelizedTableName].indexOf(deleted) ;
                if (delIndex != -1) this.mainStore.masters[this.cCamelizedTableName].splice(delIndex, 1) ;
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
        getColor : function (n){
            if ( _.isNil(n.production_color)) return {} ; 
            return {
                "background-color":n.production_color ,
            }
        } ,
        getProductionMKvName : function (n){
            if ( _.isNil(n.production_m_kv_id)) return "" ; 
            const mKv = this.masterStore.getMKvById(n.production_m_kv_id) ; 
            return mKv.kv_name ?? "" ; 
        } ,
                        
    } ,
}
</script>