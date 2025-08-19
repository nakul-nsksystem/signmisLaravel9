<template>
    <div>
        <div class="row">
            <div class="col-12 col-xl-3">
                <div class="form-group"> 
                    <label>キー</label>                               
                    <m-kv-select
                        kv-key="sm_option-key"
                        :selected-item.sync="state.dSelectedKeyMKv"
                        @input="getData"
                        >
                    </m-kv-select>
                </div>
            </div>

            <div class="col-12 col-xl-3">
                <div class="form-group">                                
                    <label>値</label>
                    <input 
                        v-model="state.dValue.value" type="text" class="form-control" placeholder="">
                    
                </div>

            </div>

            <div class="col-12 col-xl-2">                
                <div class="form-group">                                
                    <label>デフォルト値</label>
                    <p>{{state.defValue}}</p>
                    
                </div>
                
            </div>
            <div class="col-12 col-xl-2">                
                <div class="form-group">                                
                    <label>Id</label>
                    <p class="text-success">{{state.dValue.id}}</p>                    
                </div>
            </div>

            

            <div class="col-12 col-xl-2">                
                <button type="button" class="btn btn-success" 
                    @click.prevent="save"
                    >
                    <i class="fas fa-save fa-fw"></i>保存
                </button>         
            </div>

            {{cIsNew}}

            <!-- <button @click.prevent="testFunc">AAA</button>
            {{cTest}} -->
            
        </div>    
        <div class="row mt-2">        
            <div class="col-12 col-xl-12">
                <div v-if="state.dSelectedKeyMKv !== undefined">
                    {{state.dSelectedKeyMKv.system_memo}}
                </div>
            </div>
        </div>
    </div>

</template>
<script lang="ts">

// import { defineComponent ,ref,computed, onMounted, reactive } from '@vue/composition-api'
import Vue, { ref,computed,defineComponent,reactive,onMounted } from 'vue';
import axios, { AxiosResponse } from 'axios';
import ObjectUtil from '../../../frameworks/ObjectUtil';
import {SmOption} from "../class/models/SmOption"
import { useStore } from '../../../stores/mainStore';

export default defineComponent({ 
    props:{        
    } , 
    setup: (props ,context) => {
        //@ts-ignore
        const store = useStore() ; 
        const smOptions = store.masters.SmOptions as Array<SmOption>; 
        
        // @ts-ignore
        const loginUserId = store.$$cLoginUserId ; 

        const state = reactive({
            dValue : new SmOption()  ,
            dSelectedKeyMKv : undefined ,       
            defValue : undefined ,      
        })

        

        // @ts-ignore
        // console.log(loginUserId) ; 

        async function getData(id:number) {
            // console.log("id : " + id ) ; 
            if ( id == 0 ) return undefined ; 

            const found = smOptions.find(x => x.key_m_kv_id === id) ;             
            if ( found === undefined ) {
                state.dValue = new SmOption() ; 
                state.dValue.key_m_kv_id = id ; 
                state.dValue.value = store.masters.getSMOptionValByKeyMKvId(state.dValue.key_m_kv_id) ; 
            }
            else { 
                state.dValue = ObjectUtil.deepCopyJ( found) as SmOption ; 
                
            }
            // state.defValue = store.getters["masters/getSMOptionValByKeyMKvId"](state.dValue.key_m_kv_id) ; 
            state.defValue = store.masters.getMKvById(state.dValue.key_m_kv_id)?.g_01 ; 
            
            
        }

        async function save(){
            if ( state.dValue.key_m_kv_id === undefined || state.dValue.key_m_kv_id === 0 ) return ; 

            
            
            const ep = "api/smOption" + (cIsNew.value  ? "" : `/${state.dValue.id}` ) ; 
            // console.log(`isNew:${cIsNew} id:${state.dValue.id}`) ; 
            try { 
                
                let parsed:SmOption ; 
                if ( cIsNew.value ){
                    // state.dValue.key_m_kv_id = state.dSelectedKeyMKvId ; 
                    const res = await axios.post(ep , state.dValue) ;    
                    parsed = SmOption.parse(res.data) ;                     
                    smOptions.push(parsed) ; 
                }
                else { 
                    const res = await axios.put(ep , state.dValue) ;    
                    parsed = SmOption.parse(res.data) ; 

                    const found = smOptions.find( x => x.id == parsed.id) ; 
                    if ( found === undefined ) return ; 

                    const idx = smOptions.indexOf(found) ; 
                    if ( idx === -1) return  ; 

                    smOptions.splice(idx ,1 ,parsed ) ; 
                    
                    
                }
                state.dValue = parsed ;     
                
            }
            catch (error){

            }
        }
        
        const cIsNew = computed(() => {  return state.dValue.id === undefined }) ; 
        
        onMounted(() => {console.log("onMounted")} ); 

        console.log("onCreated") ; 

        return {
            state ,
            getData , 
            save , 
            cIsNew , 
            store 
        };
    },
    computed: {
        cTest():number { 
            return this.state.dValue.key_m_kv_id ?? 0; 
        }
    } ,
    methods: {
        testFunc : function(){
            console.log("tesFunc") ; 
        }
    } , 
    
});

</script>
