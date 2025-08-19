<template>
    <div v-if="isShow">
        <div class="form-group">
            <label for="inputId">id:</label>
            <span>{{ $route.params.id }}</span>
        </div>

        <div class="form-group">
            <label for="inputCd">コード:</label>
            <span>{{ dRow.cd }}</span>
        </div>

        <div class="form-group">
            <label for="inputName">名称:</label>
            <span>{{ dRow.name }}</span>
        </div>

        <button type="submit" class="btn btn-light" @click.prevent="historyBack()">戻る</button>
    </div>
</template>

<script>
import PageMixins from '@mixins/commons/PageMixins' ;

export default {
    mixins : [PageMixins] , 
    data : function() {
        return {
            dRow : {},
            dApiName : "mValidate" ,
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