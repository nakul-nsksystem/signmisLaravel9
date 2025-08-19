<template>
    <div>
        
        <div class="row mb-2">
            <contents-header-left></contents-header-left>
            <contents-header-right></contents-header-right>
        </div>
        <m-customers
            :is-enabled-view="false"
            :is-enabled-edit="false"
            :is-enabled-delete="false"
        />

    </div>
</template>

<script>
import PageMixins from '@mixins/commons/PageMixins' ;

export default {
    mixins : [PageMixins] , 
    data : function () {
        return {
        }
    } ,
    computed : {} ,
    methods : {} ,
    created : function () {} ,
}
</script>