
<template>
    <div>
        <div v-if="state.isSuccess" class="alert alert-success" role="alert">
            保存しました
        </div>
        <div v-if="$$cIsError || state.isNotStocked" class="alert alert-danger" role="alert">
            {{dErrorData.message}}
        </div>
        <transition name="fade">
            <div class="loading-wrap d-flex align-items-center justify-content-center" v-if="state.isLoading"> 
                <span class="spinner-border text-primary" style="opacity:1" />
            </div>
        </transition>
        
    </div>
</template>
<script lang="ts" setup>
import _ from "lodash" ;
import axios from 'axios'
import { computed, getCurrentInstance, reactive, ref ,watch } from 'vue';
import { useRoute } from "../../../routers/routerPlugin";

//routeからApi投げるだけ汎用ページ
const route = useRoute() ;
const _this = getCurrentInstance()?.proxy ;

const state = reactive({
    isLoading : false ,
    isSuccess : false ,
})

const cEp = computed( () => `${route.meta?.path}/${route.params.id}` )

async function getApi () {

    if( cEp.value == undefined ) {
        alert("データの読み込みに失敗しました") ;
        return ;
    }

    state.isLoading = true ;
    
    try {
        const res = await axios.get(cEp.value)
        state.isSuccess = true ;
    } catch (error) {
        //@ts-ignore
        _this.$$errorConsole( error , cEp.value ) ; 

    }
    finally {
        state.isLoading = false ;
    }
    
}

if(route.meta !== undefined ) {
    getApi() ;
} 

</script>
<style scoped>
.loading-wrap{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color:rgba(0,0,0,.5);
    opacity: 0.7;
    z-index: 1050;
}
</style>