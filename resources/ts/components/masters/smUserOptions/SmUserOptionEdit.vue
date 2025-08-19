<template>
    <div>
        <div v-if="$$cIsError" class="alert alert-danger" role="alert">
            {{dErrorData.message}}
        </div>
        <div v-if="dIsSaveSuccess" class="alert alert-success" role="alert">
            保存に成功しました
        </div>
        <div class="row p-3 ">
            <div class="col-12 col-xl-3">
                <div class="row mb-5">
                    <i class="fas fa-4x fa-fw fa-user"></i>
                    <div>
                        <p class="h5 mt-1">{{cLoginUser.full_name}}</p>
                        <div>
                            <m-tag-viewer
                                :tag-category-key="'m_users-role'"
                                :selected="cLoginUser.tags"
                                />
                        </div>

                    </div>
                </div>

                <div v-for="(n,index) in cMUserOptionMKvs"
                    :class="{ 'selected':dSelectedIdx == index}"
                    class="p-2"
                    >
                    <a class="btn btn-link" @click.prevent="dSelectedIdx = index">
                        <i class="fas fa-fw" :class="n.g_02"></i>
                        <span>{{n.kv_name}}</span>
                    </a>
                </div>

            </div>
            <div class="col-12 col-xl-9">
                <div class="table-responsive">
                    <table class="table table-dark text-nowrap">
                        <thead>
                            <tr>
                                <th>名称</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(userOption,index) in dValue">
                                <template v-if="cFilter(userOption)">
                                <td>{{userOption.sm_user_option.name}}</td>
                                <td>
                                    <div v-if="userOption.sm_user_option.option_01 == 'boolean'">
                                        <ns-checkbox-input
                                            :id="`MUserOption${index}`"
                                            :label="'設定する'"
                                            v-model="userOption.is_apply"
                                            />

                                    </div>
                                    <div v-else-if="userOption.sm_user_option.option_01 == 'number'">
                                        <ns-number-input
                                            v-model="userOption.value"
                                            />
                                    </div>
                                    <div v-else-if="userOption.sm_user_option.option_01 == 'string'">
                                        <input
                                            class="form-control"
                                            v-model="userOption.value"
                                            />
                                    </div>
                                    <div v-else-if="userOption.sm_user_option.option_01 == 'm_kv-select'">
                                        <m-kv-select
                                            v-model="userOption.value"
                                            :kv-key="userOption.sm_user_option.option_02"
                                            />

                                    </div>
                                </td>
                                </template>
                            </tr>

                        </tbody>
                    </table>
                </div>
                <div class="col-12 text-right">
                    <button type="button" class="btn btn-success" @click.prevent="postData">
                        <div v-if="dLoading">
                            <span class="spinner-border spinner-border-sm" role="status" />
                            保存中...
                        </div>
                        <div v-else>
                            保存
                        </div>
                    </button>
                </div>

            </div>

        </div>

    </div>

</template>
<script>

import axios from 'axios';
import _ from "lodash" ;

import ObjectUtil from '../../../frameworks/ObjectUtil';
import MKvSelect from '../../commons/master/MKvSelect.vue';

export default {
    data : function(){
        return {

            dValue : [] ,

            dSelectedIdx : 0 ,

            dIsSaveSuccess : false ,
            dLoading : false ,
        }
    } ,
    props:{
    } ,
    computed: {
        /**ログインユーザーの情報　タグ情報取得のためにMasterから取得 */
        cLoginUser : function(){

            return this.mainStore.masters.MUsers.find(e => e.id == this.$$cLoginUserId)
            // return this.mainStore.loginMUser ;
        } ,

        cLoginUserOptions : function(){

            const filtered = this.mainStore.loginMUser.m_user_options.filter(x =>x.is_user_editable == 1)
            return filtered ;
        } ,

        /**ユーザーオプションのkv配列 */
        cMUserOptionMKvs : function(){

            const mKvs = this.mainStore.masters.MKvCategories.find( e => e.kv_key == "m_user_option-key" ).m_kvs ?? [] ;

            if(mKvs.length == 0 ) return [] ;

            //表示するオプションカテゴリを絞り込み
            const filterd = mKvs.filter( x => x.g_03 == "1" ) 
            
            return filterd;

        } ,
        cSmUserOptions : function(){
            
            const smUserOption = this.mainStore.masters.SmUserOptions.filter(x =>x.is_user_editable == 1)
             
            return  smUserOption;

        } ,

        //表示フィルタ
        cFilter :function(){
            
            return function(option){
                
                const key = this.cMUserOptionMKvs[this.dSelectedIdx].g_01 ;
                
                if(key == "all") return true ;
                return option.sm_user_option.key_m_kv.g_01 == key

            }
        }

    } ,
    methods: {

        /**
         * 新たに個別設定を追加した場合、デフォルト値をセットして表示する
         */
        getData : async function() {

            
            let ep = `api/mUserOption/findByMUserId/${this.$$cLoginUserId}` 

            try {
                
                const res = await axios.get(ep) ;

                const resData = res.data.filter(x => x.sm_user_option.is_user_editable == 1 )

                this.dValue =  this.formatResData(resData) ;

                const optionIds = res.data.map( x => x.sm_user_option_id ) ;
                const newOptions = this.cSmUserOptions.filter( x => optionIds.indexOf(x.id) == -1 ) ;

                for(const option of newOptions) {
                    
                    this.dValue.push({
                        m_user_id : this.$$cLoginUserId ,
                        sm_user_option_id : option.id ,
                        sm_user_option : option ,
                        is_apply : option.default_value == "1" ? 1 : 0 ,
                        value : null ,
                        target_value : null ,
                    })
                
                }

            } catch(error) {

                this.$$errorConsole(error ,ep ) ;
            }

        } ,

        postData : async function() {
            this.dLoading = true ;
            this.dIsSaveSuccess = false ;

            let ep = 'api/mUserOption/updateOrCreateOptions'

            try {

                for(const option of this.dValue) {
                    option.id = option.id ?? null ;
                    option.order_no = _.isNil(option.order_no) ? 0 : option.order_no ;

                    if(option.sm_user_option.option_01 == "boolean") {
                        
                        option.value = option.is_apply ? "1" : "0";                        
                        delete option.is_apply
                    
                    }
                }
                const res = await axios.post(ep,this.dValue) ;

                this.dValue = this.formatResData(res.data) ;

                this.dIsSaveSuccess = true ;

            } catch {

                this.$$errorConsole(error ,ep ) ;

            } finally {

                this.dLoading = false ;
            }
        } ,

        /**サーバーからレスポンスされたデータの設定値を入力可能にフォーマット 
         * todoサーバー側で処理
        */
        formatResData : function(res) {
            for(const option of res) {
                    
                if(option.sm_user_option.option_01 == "boolean") {

                    option.is_apply = option.value == "1" ? 1 : 0  ;
                
                } else if(option.sm_user_option.option_01 == "m_kv-select" || option.sm_user_option.option_01 == "number") {
                    
                    option.value = parseInt(option.value, 10)
                
                }
            }

            return res ;
        }

    } ,

    created : function (){
        this.getData()
    }

};

</script>
<style scoped>
.selected {
    /**bootstrap secondary */
    background-color :#6c757d !important ;
    transition: all 0.3s ;
}

</style>
