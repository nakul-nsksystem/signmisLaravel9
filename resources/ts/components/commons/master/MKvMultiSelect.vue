<template>
    <div>
        <button 
            type="button" 
            class="btn mr-2" 
            v-for="n in cList" :key="n.id"            
            :class="cGetClasses(n.id)"
            @click.prevent="select(n)"             
            >        
            {{n.kv_name}}
        </button>
        
    </div>
</template>
<script lang="ts" setup>
import _ from 'lodash';
import { computed, reactive } from 'vue';
import { useMasterStore } from '../../../stores/masterStore';
import { MKv } from '../../masters/class/models/MKv';

    const state = reactive({
    })

    interface IProps {
        value?:Array<number> ,
        kvKey:string 
    }
    const props = withDefaults(defineProps<IProps>(), {
        value : () => ([]) ,
    }) ;

    interface IEmits {
        (e: 'input' , val:Array<number> ): void
        (e: 'mapTProject'): void
    }
    const emit = defineEmits<IEmits>() ;

    const masterStore = useMasterStore() ;

    const cList = computed(() => {

        if(_.isEmpty(masterStore.MKvCategories)) return [] ;
        
        const list = masterStore.getMKvCategoryByKey(props.kvKey) ;

        if(list === undefined) return [] ;

        return list.m_kvs ;
    })

    const cGetClasses = computed(() => (n:number) => props.value.indexOf(n) !== -1 ? "btn-primary"  : "btn-dark") ;

    function select (n:MKv) {
        const list = [...props.value] ; 
        //@ts-ignore             
        const idx = props.value.indexOf(n.id) ;             
        if ( idx === -1) { 
            //@ts-ignore             
            list.push(n.id) ; 
        }
        else {
            list.splice(idx , 1 ) ; 
        }            
        emitSelectedIds(list) ; 

    }

    function emitSelectedIds (ids:Array<number>){
        emit('input', ids )  ;
    } 
    
</script>
