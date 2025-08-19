<template>
    <th :id="colName" :class="setStyleSort(colName)" >
        <slot></slot>
    </th>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import _ from "lodash";
import { signmisReportComposition } from '../compositions/signmisReportComposition';

interface IProps {
    value?:string
    colName?:string
}
const props = withDefaults(defineProps<IProps>(), {})

interface IEmits {
    (e: 'input',value:any): void
}
const emit = defineEmits<IEmits>() ;

function setStyleSort  (key:string) {
    if(_.isNil(key) || _.isNil(props.value)) return "" ;
    // ソートされた項目のStyle設定
    return {
        sort_asc : props.value == key ,
        sort_desc: props.value == key + " desc" ,
    } ;
}
</script>
<style scoped>

</style>