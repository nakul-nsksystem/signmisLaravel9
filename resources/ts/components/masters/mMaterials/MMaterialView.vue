<template>
    <div v-if="isShow">
        <div class="form-group">
            <label for="inputId">id：</label>
            <span>{{ $route.params.id }}</span>
        </div>

        <div class="form-group">
            <label for="inputCd">コード：</label>
            <span>{{ dRow.cd }}</span>
        </div>

        <div class="form-group">
            <label for="inputName">名称：</label>
            <span>{{ dRow.name }}</span>
        </div>

        <div class="form-group">
            <label for="inputCategoryMKvId">カテゴリ：</label>
            <span>{{ dRow.category_m_kv.kv_name }}<br></span>
        </div>

        <div class="form-group">
            <label for="inputSubCategoryMKvId">サブカテゴリ：</label>
            <span>{{ dRow.sub_category_m_kv.kv_name }}<br></span>
        </div>

        <div class="form-group">
            <label for="inputMBranchId">拠点：</label>
            <span>{{ dRow.m_branch.name }} <br></span>
        </div>

        <button type="submit" class="btn btn-light" @click.prevent="historyBack()">戻る</button>
    </div>
</template>

<script>
import PageMixins from '@mixins/commons/PageMixins' ;

export default {
    mixins : [PageMixins] , 
    data : function () {
        return {
            dRow : {},
            dApiName : "mMaterial",
        }
    } ,
    computed : {
        endpoint : function () {
            let ep = `api/${this.dApiName}` ;
            if (!this.isNew) ep += `/${this.$route.params.id}` ;
            
            return ep ;
        } ,
        isNew : function () {
            return this.$route.params.id === undefined ;
        } ,
        isShow : function () {
            return this.isNew || this.dRow.id > 0 ;
        } ,
    } ,
    methods : {
        getData : async function () {
            try {
                const res = await axios.get(this.endpoint) ;
                this.dRow = res.data ;
            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.cEndpoint) ;
            }
        } ,
        historyBack : function () {
            this.$router.push({ name : Inflector.underscore(this.dApiName) }) ;
        } ,
    } ,
    created : function () {
        if (!this.isNew) this.getData() ;
    } ,
}
</script>