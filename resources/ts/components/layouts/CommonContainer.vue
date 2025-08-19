<template>
    <div >
        <div v-if="cIsPrintPreView">
            <!-- 印刷プレビューモードの場合は何もしない -->
        </div>
        <div v-else-if="!dIsCustomHeader">
            <div class="row mb-2">
                <contents-header-left></contents-header-left>
                <contents-header-right></contents-header-right>
            </div>
        </div>
        <transition name="tranView" mode="out-in">
        <router-view
            :class='{
                "flex-fill": !cIsPrintPreView , 
            }'
            :right-menu.sync="dRightMenuHtml" 
            :is-custom-header.sync="dIsCustomHeader"
        >
        </router-view>
        </transition>
    </div>
</template>

<script>
export default {
    data : function () {
        return { 
            // right-menu Slot置き換え用
            dRightMenuHtml : "" , 
            dIsCustomHeader : false , 
        }
    } ,
    computed : {
        /* 印刷プレビューモードかのチェック */
        cIsPrintPreView : function() {
            return this.$route.meta?.isPrintPreView == true ; 
        } , 
    } ,
    created : function () {
    } ,
    
}
</script>

<style scoped>
    .tranView-enter ,
    .tranView-leave-to
    {
        opacity: 0 ;
    }

    .tranView-enter-active {
        animation: fadeIn 0.15s ease-in;
    }

    .tranView-leave-active {
        animation: fadeOut 0.15s ease-in;
    }

    @keyframes fadeIn {
        0% {
            opacity: 0 ;
        }
        50% {
            opacity: 0.5 ;
        }
        100% {
            opacity: 1 ;
        }
    }

    @keyframes fadeOut {
        0% {
            opacity: 1 ;
        }
        50% {
            opacity: 0.5 ;
        }
        100% {
            opacity: 0 ;
        }
    }

    @keyframes fadeOut2 {
        0% {
            transform:  translateY(0) ;
        }
        100% {
            transform:  translateY(-400px) ;
        }
    }
</style>