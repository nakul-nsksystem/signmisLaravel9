<template>
    <div class="col-12 col-xl-6">
        <div class="row d-flex">
            <div class="flex-grow-0 flex-shrink-0 app-contents-header-icon" style="flex-basis:60px;" ><i class="fas fa-3x fa-fw" v-bind:class="{ [icon]: isIconAvailable }"></i></div>
            <div class="flex-grow-1 flex-shrink-1 "  style="flex-basis:250px;">
                <div class="row">
                    <div class="col-12 col-xl-10">
                        <p class="h5 mb-0">{{menuTitle}}</p>
                    </div>
                    <div class="col-12 col-xl-2 no-print" v-if="$$cIsNskDev">
                        <div class="d-inline-block">
                            <label for="$$isDebugCheckbox">Debug </label>
                            <is-debug-check-box />
                        </div>
                    </div>
                </div>
                <div class="row no-print">
                    <div class="col">
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb bg-dark p-0 mb-0">
                                <li class="breadcrumb-item">
                                    <div>
                                        <router-link to="/home" title="Home">ホーム</router-link>
                                        &nbsp;/&nbsp;
                                    </div>
                                </li>
                                <div v-for="n in $route.matched" :key="n.path" class="breadcrumb bg-dark p-0 mb-0">
                                    <li v-if="! n.meta.isIgnoreBreadcrumb" class="breadcrumb-item">
                                        <div v-if="$$isCurrentPath(n.regex)">{{n.meta.label}}</div>
                                        <div v-else>
                                            <router-link :to="n.path" title="" append>{{n.meta.label}}</router-link>
                                            &nbsp;/&nbsp;
                                        </div>
                                    </li>
                                </div>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props : {
        customMenuTitle : {
            type : String ,
            default : () => "" ,
        } ,
        customIcon : {
            type : String ,
            default : () => "" ,
        }
    } ,
    computed : {
        menuTitle : function ()
        {
            if ( this.customMenuTitle != "")  return this.customMenuTitle ;
            return this.$route.meta.label ;
        } ,
        icon : function ()
        {
            if ( this.customIcon != "")  return this.customIcon ;
            return this.$route.meta.icon ;

        } ,
        isIconAvailable : function()
        {
            return (this.icon) ;
        }
    }
}
</script>

<style scoped>
    @media print {
        .no-print {
            /* 印字しない項目は[class="no-print"]を指定 */
            display: none;
        }
    }
</style>