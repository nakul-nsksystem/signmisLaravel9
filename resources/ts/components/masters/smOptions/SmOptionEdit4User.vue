<template>
    <div>
        <div class="row">
            <div class="col-12">
                <div v-show="state.isSuccess" class="alert alert-success" role="alert">
                    保存に成功しました
                </div>
                <div v-if="$$cIsError" class="alert alert-danger" role="alert">
                    {{dErrorData.message}}
                </div>
                <table class="table table-striped table-dark">
                    <thead>
                        <tr class="text-nowrap">
                            <th>名称</th>
                            <th>値</th>
                            <th>デフォルト値</th>
                            <th>備考</th>
                            <th>保存</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="n in cSmOptions" :key="n.id">
                            <td>{{ n.KeyMKv?.kv_name ?? "" }}</td>
                            <td>
                                <div v-if="n.KeyMKv?.g_02 == 'number'">
                                    <ns-number-input 
                                        v-model="n.Value"
                                        />
                                </div>
                                <div v-else-if="n.KeyMKv?.g_02 == 'mkv'">
                                    <m-kv-select 
                                        v-model="n.Value"
                                        :kvCategoryId="n.KeyMKv?.target_m_kv_category_id"
                                        />
                                </div>
                                <div v-else>
                                    <input type="text" class="form-control" v-model="n.Value">
                                </div>
                            </td>
                            <td>
                                <div v-if="n.KeyMKv?.g_02 == 'mkv'">{{ cDefMKvVal(n.KeyMKv?.g_01) }}</div>
                                <div v-else>{{ n.KeyMKv?.g_01 ?? "" }}</div>
                            </td>
                            <td>{{ n.KeyMKv?.system_memo ?? "" }}</td>
                            <td>
                                <button type="button" class="btn btn-success" @click.prevent="save(n)">
                                    <div v-if="state.loading">
                                        <span class="spinner-border spinner-border-sm" role="status" />
                                        保存中...
                                    </div>
                                    <div v-else>
                                        <i class="fas fa-save fa-fw"></i>
                                        保存
                                    </div>
                                </button>         
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>    
    </div>

</template>
<script lang="ts" setup>
import { computed,reactive, getCurrentInstance } from 'vue';
import axios from 'axios';
import ObjectUtil from '../../../frameworks/ObjectUtil';
import {SmOption} from "../class/models/SmOption"
import { useStore } from '../../../stores/mainStore';
import { useMasterStore } from '../../../stores/masterStore';
import _ from 'lodash';

const masterStore = useMasterStore() ;
const store = useStore() ;
const _this = getCurrentInstance()?.proxy ;

const state = reactive({
    loading : false ,
    isSuccess : false
})

const cSmOptions = computed(() => {
    // if(store.loginMUser?.is_nsk_user) return _.cloneDeep(masterStore.SmOptions)  ;
    return masterStore.SmOptions.filter(x => x.is_user_editable)
})


const cDefMKvVal = computed(() => (kvId?:string) => {
    if(!kvId) return "" ;
    return masterStore.getMKvById(Number(kvId))?.kv_name ?? '' ;
})

async function save(row:SmOption) {

    if ( row.key_m_kv_id === undefined || row.key_m_kv_id === 0 ) return ; 
    
    state.loading = true ;
    
    const isNew = _.isNil(row.id) ;
    let ep = "api/smOption" + (isNew  ? "" : `/${row.id}` ) ; 
    // console.log(`isNew:${cIsNew} id:${state.dValue.id}`) ; 
    try { 
        
        let parsed:SmOption ; 

        //こっちを通ることはない
        if ( isNew ){
            // state.dValue.key_m_kv_id = state.dSelectedKeyMKvId ; 
            const res = await axios.post(ep , row) ;    
            parsed = SmOption.parse(res.data) ;                     
            masterStore.SmOptions.push(parsed) ; 
        }
        else { 
            const res = await axios.put(ep , row) ;    
            parsed = SmOption.parse(res.data) ; 

            const found = masterStore.SmOptions.find( x => x.id == parsed.id) ; 
            if ( found === undefined ) return ; 

            const idx = masterStore.SmOptions.indexOf(found) ; 
            if ( idx === -1) return  ; 

            masterStore.SmOptions.splice(idx ,1 ,parsed ) ; 
        }


        state.isSuccess = true
        
    }
    catch (error){
        //@ts-ignore
        _this.$$errorConsole(error ,ep) ;
    }
    finally {
        state.loading = false ;
    }
}


</script>
