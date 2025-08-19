<template>
<!-- 削除予定 -->
    <div>
        <div class="row mb-2">
            <contents-header-left></contents-header-left>
            <contents-header-right></contents-header-right>            
        </div>
        <div v-if="$$cIsError" class="alert alert-danger" role="alert">
            {{dErrorData.message}}
        </div>
        <div>
            <t-ivt-material-header-component
                v-model="conditions"
                :isLoading="state.isLoading"
                :viewMode="state.viewMode"
                @search="search()"
                />
            <t-inventory-arrival-list
                ref="arrivalList"
                :conditions="conditions" 
                class="pt-3"
                @error="$$errorConsole($event ,$event.ep) ;"
                />
        </div>
    </div>
</template>

<script lang='ts'>
import PageMixins from '../../../mixins/commons/PageMixins';

export default {
    mixins : [PageMixins] ,
}
</script>

<script lang="ts" setup>
import { computed, getCurrentInstance, reactive, ref } from 'vue';
import { useStore } from '../../../stores/mainStore';

//@ts-ignore
import TInventoryArrivalList from './TInventoryArrivalList.vue'


const store = useStore()
//検索条件
const conditions = reactive({
    m_branch_id            : store.loginMUser?.m_branch_id ,
    m_material_detail_id   : 0,
    m_material_id          : 0,
    category_m_kv_id       : 0,
    ivt_material_name      : "",
    supplier_m_customer_id : 0,
    is_ivt_in              : false
}) ;

const state = reactive({
    //表示　在庫・入庫予定
    viewMode : 'arrival' ,
    isLoading : false ,
})
const arrivalList = ref() ;

async function search(){
    state.isLoading = true ;
    await arrivalList.value._setupState.search() ;
    state.isLoading = false ;
}

</script>