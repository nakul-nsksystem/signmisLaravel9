<template>
    <div class="row mb-2">
        <div class="col-12 col-xl-4">
            <div class="row d-flex">
                <div class="flex-grow-0 flex-shrink-0 app-contents-header-icon" style="flex-basis:60px;" ><i class="fas fa-3x fa-fw" v-bind:class="{ [icon]: isIconAvailable }"></i></div>
                <div class="flex-grow-1 flex-shrink-1 "  style="flex-basis:250px;">
                    <div class="row" >
                        <div class="col-12">
                            <p class="h5 mb-0">{{menuTitle}}</p>
                        </div>
                    </div>
                    <div class="row no-print">
                        <div class="col">
                            <nav aria-label="breadcrumb">
                                <ol class="breadcrumb bg-dark p-0 mb-0">
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
                <div class="flex-grow-1 no-print">
                    <slot name="title"></slot>
                    <div class="d-inline-block" v-if="$$cIsNskDev">
                        <label for="$$isDebugCheckbox">Debug</label>
                        <is-debug-check-box />
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-xl-8 pt-2 pt-xl-0 app-contents-header-right-menu" >
            <slot name="right-menu"></slot>
        </div>
    </div>
</template>

<script>
import PageMixins from "./../../mixins/commons/PageMixins"

export default {
    mixins : [PageMixins] ,
    props : {
        menuTitle : {
            type : String ,
        } ,
        subTitle : {
            type : String ,
        } ,
        icon : {
            type : String ,
        }
    } ,
    computed : {
        isIconAvailable : function()
        {
            return (this.icon) ;
        }
    } ,
    created : function() {
        //this.$$emitIsCustomHeader()  ;
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