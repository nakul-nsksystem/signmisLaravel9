<template>
    <div>
        <div class="row mb-2">
            <contents-header-left></contents-header-left>
            <contents-header-right>
                <router-link to='add' title="" append>
                    <button type="button" class="btn btn-primary">
                        <i class="fas fa-plus fa-fw"></i>
                        新規作成
                    </button>
                </router-link>
            </contents-header-right>
        </div>

        <table class="table table-striped table-dark">
            <thead>
                <tr class="text-nowrap">
                    <th scope="col">Actions</th>
                    <th scope="col">コード</th>
                    <th scope="col">名称</th>
                    <th scope="col">削除</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="n in search" :key="n.id">
                    <td>
                        <router-link :to='"view/" + n.id' title="" append>
                            <button type="button" class="btn btn-secondary">
                                <i class="fas fa-eye fa-fw"></i>
                            </button>
                        </router-link>

                        <router-link :to='"edit/" + n.id' title="" append>
                            <button type="button" class="btn btn-success">
                                <i class="fas fa-edit fa-fw"></i>
                            </button>
                        </router-link>
                    </td>

                    <td>{{n.cd}}</td>
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
import PageMixins from '@mixins/commons/PageMixins' ;

export default {
    mixins : [PageMixins] , 
    data : function() {
        return {
            dApiName : "mValidate" ,
        }
    } ,
    computed : {
        endpoint : function () {
            return `api/${this.dApiName}` ;
        } ,
        camelizedTableName : function () {
            const pluralized = Inflector.pluralize(this.dApiName) ;
            return Inflector.camelize(pluralized) ;
        } ,
        search : function () {
            return this.mainStore.masters[this.camelizedTableName] ;
        } ,
    } ,
    methods : {
        destroy : async function(id) {
            if (!confirm('削除してよろしいですか?')) return ;

            try {
                let ep = this.endpoint + `/${id}` ;
                const res = await axios.delete(ep) ;

                const deleted  = this.mainStore.masters[this.camelizedTableName].search(e => e.id === id) ;
                const delIndex = this.mainStore.masters[this.camelizedTableName].indexOf(deleted) ;
                if (delIndex != -1) this.mainStore.masters[this.camelizedTableName].splice(delIndex, 1) ;
            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.cEndpoint) ;
            }
        } ,
    } ,
}
</script>