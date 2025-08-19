<template>
    <div>
        <div class="row mb-2">
            <contents-header-left></contents-header-left>
            <contents-header-right>
                <div class="flex-column">
                    <router-link to='add' title="" append>
                        <button type="button" class="btn btn-primary">
                            <i class="fas fa-plus fa-fw" />
                            新規作成
                        </button>
                    </router-link>
                </div>
            </contents-header-right>
        </div>
        <m-customers/>

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