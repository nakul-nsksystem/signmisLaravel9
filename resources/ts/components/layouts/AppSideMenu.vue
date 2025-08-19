<template>
    <div v-if="!cIsPrintPreView">
        <!-- 印刷プレビューモードの場合はapp-sidenavを非表示 -->
        <nav class="app-sidenav bg-dark fixed-top d-none d-md-block vh-100 shadow no-print">
            <ul class="nav flex-column" style="font-size:1.5rem;" id="side_menu">
                <li class="nav-item" v-for="(n,index) in dMenu" :key="n.title">
                    <div v-if="!n.children">
                        <router-link
                            v-if="mainStore.getRole(n.key)>=10"
                            class="nav-link" :to="n.to" :title="n.title">
                            <i class="fas fa-fw" :class="n.icon"></i>
                        </router-link>
                    </div>
                    <div v-else-if="mainStore.getRole(n.key)>=10">
                        <a 
                            class="nav-link router-link px-0" 
                            :class="{
                                'router-link-active' : cIsChildRouteActive(n.children) ,
                            }"
                            data-toggle="collapse" role="button" 
                            :href="`#navbarCollapse${index}`" 
                            aria-expanded="false" 
                            :aria-controls="`navbarCollapse${index}`"
                            :title="n.title"
                            :ref="`navbarCollapse${index}`"
                            @mouseenter.prevent="mouseEv(index,true)"
                            @mouseleave.prevent="mouseEv(index,false)"
                            @click.prevent="collapse(index)"
                            >
                            <!-- 回転状態を残すためにv-showでの切替 -->
                            <i class="fas fa-fw"                          :class="n.icon"   v-show="dIdx !== index"></i>
                            <i class="fadeIcon fas fa-fw fa-chevron-down" :class="n.status" v-show="dIdx === index"></i>

                        </a>
                        <div class="collapse child-nav" :id="`navbarCollapse${index}`" :ref="`childNav${index}`" data-parent="#side_menu">
                            <div v-for="c in n.children" :key="c.title">
                                <router-link
                                    v-if="mainStore.getRole(c.key)>=10 "
                                    class="nav-link" :title="c.title"
                                    :to="n.to + c.to">
                                    <i class="fas fa-fw" :class="c.icon"></i>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
import _ from 'lodash';
import AppMenuConfig from '../../configs/AppMenuConfig';
import ArrayUtil from '../../frameworks/ArrayUtil';

export default {
    props : {
    } ,
    data : function() {
        return {
            dMenu : [] ,

            //ホバー中のアイコンindex
            dIdx  : -1 ,

            //セッションストレージ保存用
            //開いている親メニューのインデックス
            dCllapseOpenIdx : [] 
        }
    } ,
    mounted : function() {
        // this.dCllapseOpenIdx = JSON.parse(localStorage.getItem('signmis_sidemenu')) ?? [];
        // for(const idx of this.dCllapseOpenIdx) {
        //     this.$refs[`navbarCollapse${idx}`][0].ariaExpanded = 'true' ;
        //     this.$refs[`childNav${idx}`][0].classList.add('show') ;
        //     this.$set(this.dMenu[idx],'status','spined-up') ;
        // }
    } ,
    computed : {
        /* 印刷プレビューモードかのチェック */
        cIsPrintPreView : function() {
            return this.$route.meta?.isPrintPreView == true ;
        } ,

        //子メニューが選択されているかフラグ
        cIsChildRouteActive : function() {
            return function(childRoute) {
                let is = false ;
                for(const matched of this.$route.matched) {
                    const found = childRoute.find(x => x.to == matched.path) ;
                    is = found !== undefined ;
                    if(is) break ;
                }
                return is ;
            }
        } ,

    },
    methods : {
        //子メニューのあるアイコンマウスホバー
        mouseEv : function(idx,isEnter) {
            this.dIdx = isEnter ? idx : -1 ;
            //初回読込時にfadeしないようにするためにevent時に追加する
            this.dMenu[idx].icon = `${this.dMenu[idx].icon} fadeIcon`
        } ,

        //子メニューのあるアイコンクリック
        collapse : function(idx) {
            if(this.$refs[`navbarCollapse${idx}`][0].ariaExpanded == 'true') {
                this.$set(this.dMenu[idx],'status','') ;                
                // this.removeCollapseStatus(idx) ;                    
            }
            else {
                this.$set(this.dMenu[idx],'status','spined-up') ;
                // this.setCollapseStatus(idx) ;
            }
            // this.setLocalStorage() ;
        } ,

        setCollapseStatus : function(idx) {
            this.dCllapseOpenIdx.push(String(idx)) ;
        } ,
        removeCollapseStatus : function(idx) {
            this.dCllapseOpenIdx = this.dCllapseOpenIdx.filter(x => x != String(idx))
        } ,

        setLocalStorage : function() {
            localStorage.setItem('signmis_sidemenu', JSON.stringify(this.dCllapseOpenIdx));
        } 

    } ,
    created : function() {
        //リアクティブにするためにdataに格納
        ArrayUtil.resetInsert(this.dMenu,AppMenuConfig.Menus)
    }
}
</script>

<style scoped>
    .app-sidenav a.router-link-active
    {
        background-color: #4950AA !important ;
        transition: all 0.1s ;
    }

    /**子アイコン背景 */
    .child-nav {
        background: #494f55;
    }
    /**子アイコン背景 選択時 */
    .child-nav a.router-link-active
    {
        background-color: #6469af !important ;
        transition: all 0.1s ;
    }

    /**親アイコン */
    i.fa-chevron-down {
        transition-duration: .3s;
    }
    /**親アイコン回転 */
    .spined-up {
        transform: rotate(180deg);
        transition-duration: .3s;
    }
    
    /**親アイコンフェード処理 */
    .fadeIcon{
        animation: fadeIn .3s 
    }
    @keyframes fadeIn{
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }

    

    @media print {
        .no-print {
            /* 印字しない項目は[class="no-print"]を指定 */
            display: none;
        }
    }
</style>