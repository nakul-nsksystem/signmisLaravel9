<template>
    <div>
        <select
            class="custom-select"
            :class="inputClass"
            :placeholder="placeholder"
            v-model="dLocalSelectedId"
            @change="changed"
        >
            <option value="0"></option>
            <option :value="n.id" v-for="n in mainStore.masters.MProcessCategories" :key="n.id">{{ n.name }}</option>
        </select>
        {{ cSelectedItem }}
    </div>
</template>

<script>
import MasterSelectMixins from "./../../../mixins/commons/MasterSelectMixins" ;

export default {
    mixins : [MasterSelectMixins] ,
    data : function () {
        return {
        }
    } ,    
    props : {
    } , 
    computed : {         
        cSelectedItem : function () {
            const selectedItem = this.mainStore.masters.MProcessCategories.find(e => e.id === this.dLocalSelectedId) ;
            this.$emit('update:selectedItem', selectedItem) ;
            return "" ;
        } ,
        cDisplayName : function () {
            return function (node) {
                // 略称が設定されている場合は略称を表示
                return node?.short_name ?? node?.name ;
            } ;
        } ,
    } ,
    methods : {
        emitSelectedItem : function (id) {
            this.$emit('update:selectedItem', this.mainStore.masters.MProcessCategories.find(e => e.id === id)) ;
        } ,
    } ,    
    created : function () {
    } ,
}
</script>