<template>
    <div class="row mx-1">
        <!-- <ul v-if="isShowPagination()" class="pagination my-0 d-flex flex-wrap"> -->
        <ul class="pagination my-0 d-flex flex-wrap">
            <div v-for="(n, index) in pPagination.links" :key="index">
                <li class="page-item" :class="{active: n.active }">
                    <a class="page-link" :href="n.url" @click.prevent="search(n.url)">
                        <div v-if="n.label == '&laquo; Previous'">
                            <span aria-hidden="true">&laquo;</span>
                            <span class="sr-only">Previous</span>
                        </div>

                        <div v-else-if="n.label == 'Next &raquo;'">
                            <span aria-hidden="true">&raquo;</span>
                            <span class="sr-only">Next</span>
                        </div>

                        <div v-else>
                            {{ n.label }}
                        </div>
                    </a>
                </li>
            </div>
        </ul>

        <!-- <div v-if="isShowTotalArea()" class="d-flex flex-wrap align-items-center"> -->
        <div class="d-flex flex-wrap align-items-center">
            &nbsp; {{ cTotalArea }}
        </div>
    </div>
</template>

<script>
import NumberUtil from "@frameworks/NumberUtil" ;

export default {
    props : {
        // 親からのパラメーター
        "p-pagination" : {
            // pagination関連
            "links" : {
                // pagination内のリンク
                type : Array ,
                default : () => [] ,
            } ,
            "total" : {
                // 合計件数：デフォルト(-1)は表示しない
                type : Number ,
                default : () => -1 ,
            } ,
            "from" : {
                // 現在ページの開始位置
                type : Number ,
                default : () => -1 ,
            } ,
            "to" : {
                // 現在ページの終了位置
                type : Number ,
                default : () => -1 ,
            } ,
        } ,
    } ,
    computed : {
        cToNumber : function () {
            return function (val) {
                return NumberUtil.formatZeroSuppress(val) ;
            } ;
        } ,
        cTotalArea : function () {
            let totalArea = "" ;

            if (this.pPagination.total == -1) {
                // 未検索(-1)
            } else if (this.pPagination.total <= 1) {
                // 0件か1件の場合は省略表記で
                totalArea = this.cToNumber(this.pPagination.total) + ' 件' ;
            } else {
                // From - To / Total 件
                totalArea = this.cToNumber(this.pPagination.from) + ' - ' +  this.cToNumber(this.pPagination.to) + ' / ' + this.cToNumber(this.pPagination.total) + ' 件' ;
            }

            return totalArea ;
        } ,
    } ,
    methods : {
        search : function (url) {
            // 無効なurlは処理を抜ける
            if (!url) { return ; }

            // クリックされたurlを呼び出し元(子)イベントへ発火する
            this.$emit('search', url) ;
        } , 
        // isShowPagination : function () {
        //     // linksからpaginationを表示するかのロジック判定
        //     // 1ページのみ(Previous/Current/Next 3件)の場合は表示してません
        //     // 2ページ以降(Previous/.../Current/.../Next 4件以上)で表示
        //     return (this.pPagination.links !== undefined && this.pPagination.links.length > 3) ;
        // } ,
        // isShowTotalArea : function () {
        //     // 合計エリアを表示するかのロジック判定
        //     // 合計件数が1以上の場合に表示
        //     return (this.pPagination.total !== undefined && this.pPagination.total > 0) ;
        // } ,
    } ,
}
</script>

<style scoped>
    /* ページリンクのデザインをdarkthemeに設定 */
    .page-link {
        /* 文字色 */
        color:#fff;
        /* 背景色 */
        background-color:#6c757d;
        /* background: #6c757d linear-gradient(180deg, #818990, #6c757d) repeat-x; */
        /* 透過 */
        opacity: .9;
        /* 枠線 */
        border: 1px solid rgba(0, 0, 0, 0.5);
    }
</style>
