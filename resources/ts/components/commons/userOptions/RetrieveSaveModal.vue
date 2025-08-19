<template>

    <div class="app-contents-container">
        <div class="row pb-2 pt-2">
            <div class="col-12 pb-2 ">
                <div class="border-bottom">
                    <p class="h5">検索情報保存</p>
                </div>
            </div>
        </div>
        <!-- <div class="row">
            <div class="col-12 col-xl-3" v-for="(val,key) in value">
                <div class="form-group">
                    <label >{{key}}</label>
                    <div>{{val}}</div>
                </div>
            </div>
        </div> -->

        <div class="row">
            <div class="col-12">
                <div class="form-group">
                    <label >登録名</label>
                    <div>
                        <input type="text" class="form-control" v-model="dName">
                    </div>
                </div>

            </div>
        </div>
        <div class="row">
            <div class="col-12 text-right"> 
                <button type="button" class="btn btn-success" @click.prevent="save">
                    <div v-if="dLoading">
                        <span class="spinner-border spinner-border-sm" role="status" />
                        保存中...
                    </div>
                    <div v-else>保存</div>
                </button>
            </div>
        </div>

    </div>


</template>

<script>


export default {
    data : function() {
        return {
            dLoading : false ,
            dName : "" ,
        }
    } ,
    props : {
        value :{
            type : Object ,
        } ,
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
        
        //ユーザーの保存済PersonalOption
        cUserOptions : function(){
            const personalOption = this.mainStore.loginMUser.m_user_options ;
            return personalOption ;
        }

    } ,
    methods : {

        save : async function(){
            
            this.dLoading = true ;
            let ep = 'api/mUserOption' ;

            try {

                //現在の検索項目を文字列してValueカラムに保存
                const stringJson = JSON.stringify(this.value) ;

                const row = {
                    m_user_id : this.$$cLoginUserId ,
                    sm_user_option_id : this.cOptionId ,
                    name : this.dName ,
                    value : stringJson
                }

                const res = await axios.post(ep,row) ;

                //store反映
                this.mainStore.loginMUser.m_user_options.push(res.data) ;

                this.dName = "" ;
                this.$emit("closeModal") ;

            } catch (error) {

                this.$$errorConsole(error ,ep ) ;

            } finally {

                this.dLoading = false ;
            
            }
        
        }

    } ,
    created : function() {
    } ,
}
</script>