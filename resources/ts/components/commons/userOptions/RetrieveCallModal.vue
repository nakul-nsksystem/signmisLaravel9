<template>

    <div class="app-contents-container">
        <div class="row pb-2 pt-2">
            <div class="col-12 pb-2 ">
                <div class="border-bottom">
                    <p class="h5">検索情報呼び出し</p>
                </div>
            </div>
        </div>
        <table class="table table-dark">
            <thead>
                <tr>
                    <th scope="col">名称</th>
                    <th scope="col"></th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="n in cUserSavedSearchOptions" :key="n.id">
                    <td>{{n.name}}</td>
                    <td class="text-right">
                        <button type="button" class="btn btn-info" @click.prevent="setData(n)">
                            <div>
                                <i class="fas fa-link fa-fw"></i>
                            </div>
                        </button>
                        <button type="button" class="btn btn-danger" @click.prevent="destroy(n)">
                            <div>
                                <i class="fas fa-trash fa-fw"></i>
                            </div>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>


</template>

<script>
import axios from 'axios';


export default {
    data : function() {
        return {
            dLoading : false ,
        }
    } ,
    props : {

        savedSearchOption : {
            type : Object
        }

    } ,
    watch : {

    } ,
    computed : {
        //適応するPersonalOptionのId
        cOptionId : function(){
            return this.savedSearchOption.id
        } ,

        cUserSavedSearchOptions : function() {

            const personalOption = this.mainStore.loginMUser.m_user_options ;

            const filterd = personalOption.filter( e => e.sm_user_option_id == this.cOptionId) ;

            return filterd ;

        }

    } ,
    methods : {
        //保存済の個別設定からJSONデータをパースして各検索画面に反映
        setData : function(row){
            const savedJson = JSON.parse(row.value) ; 
            // console.log(savedJson) ; 
            this.$emit("setSavedData",savedJson)
        } ,

        //削除
        destroy : async function(row) {

            if( !confirm(`${row.name}を削除してもよろしいですか？`)) return ;

            let ep = `api/mUserOption/${row.id}`
            try {

                const res = await axios.delete(ep) ;
                const deleted = this.mainStore.loginMUser.m_user_options.find( e => e.id === row.id) ;

                const deletedIdx = this.mainStore.loginMUser.m_user_options.indexOf(deleted) ;

                if(deletedIdx !== -1) {
                    
                    this.mainStore.loginMUser.m_user_options.splice(deletedIdx , 1) ;
                }

            } catch (error) {
                
                this.$$errorConsole(error ,ep ) ;
                
            }

        }
    } ,
    created : function() {
    } ,
}
</script>