<template>
    <div>
        <header v-if="cIsAppReady">
            <div v-if="!cIsPrintPreView">
                <!-- 印刷プレビューモードの場合はnavbarを非表示 -->
                <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark shadow no-print pl-2">
                    <!-- <object type="image/svg+xml" :data="`${$$cAppUrl}/img/company-logo.svg`" width="38" height="38" /> -->
                    <object type="image/svg+xml" :data="`${companyLogo}`" :width="companyLogoWidth" :height="companyLogoHeight" />
                    <router-link class="ml-2" :to='"home"' title="" append>
                        <p class="h4 mb-0">{{appName}}</p>
                    </router-link>
                    <div class="pl-2 ml-1 flex-grow-1 d-md-block">
                        {{cAppVer}}
                    </div>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon" />
                    </button>
                    <div class="p-2 flex-grow-1 app-nav-space d-none d-md-block" />
                    <div class="collapse navbar-collapse bg-dark flex-grow-0 mx-n3 pr-3" id="navbarCollapse">
                        <div class="d-flex flex-grow-1">
                            <div class="py-2 flex-grow-1 d-block d-md-none">

                                <nav class="bg-dark">
                                    <ul class="nav flex-column" style="font-size:1.5rem;">
                                        <li class="nav-item" v-for="n in cMenus" :key="n.title">
                                            <div v-if="!n.children">
                                                <router-link
                                                    v-if="mainStore.getRole(n.key)>=10"
                                                    class="nav-link" :to="n.to" title="Home" data-toggle="collapse" data-target="#navbarCollapse">
                                                    <i class="fas fa-fw" :class="n.icon" ></i>
                                                    <span class="pl-2 h6">{{n.title}}</span>
                                                </router-link>
                                            </div>
                                            <div v-for="child in n.children" :key="child.title">
                                                <router-link
                                                    v-if="mainStore.getRole(child.key)>=10"
                                                    class="nav-link" :to="child.to" title="Home" data-toggle="collapse" data-target="#navbarCollapse">
                                                    <i class="fas fa-fw" :class="child.icon" ></i>
                                                    <span class="pl-2 h6">{{child.title}}</span>
                                                </router-link>
                                            </div>
                                            
                                        </li>
                                    </ul>

                                </nav>
                            </div>

                            <ul class="navbar-nav mr-auto ">

                                <!-- Authentication Links -->

                                <li class="nav-item dropdown" >
                                    <a id="navbarDropdown" class="nav-link dropdown-toggle text-right pt-4 pt-md-2" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                                        {{cLoginUserName}}<span class="caret"></span>
                                    </a>
                                    <div class="dropdown-menu bg-dark dropdown-menu-right" aria-labelledby="navbarDropdown">
                                        <router-link
                                            class="dropdown-item" to="/master/m_user_option">
                                            ユーザー個別設定
                                        </router-link>
                                        <a class="dropdown-item bg-dark" @click.prevent="logout" >
                                            ログアウト
                                        </a>
                                    </div>
                                </li>

                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </header>

        <main v-if="cIsAppUrlReady">
            <app-side-menu v-if="cIsAppReady" class="no-print"/>
            <!-- 印刷プレビューモードの場合はapp-contentsを非表示 -->
            <div
                class="no-print"
                :class='{
                    "w-100": !cIsPrintPreView ,
                    "app-contents": !cIsRouteLogin && !cIsPrintPreView ,
                    "login-app-contents": cIsRouteLogin ,
                    "bg-gradient-dark": cIsRouteLogin ,
                } '
            >
                <!-- 印刷プレビューモードかそうでないかでCSS切り替え -->
                <div
                    class="px-3"
                    :class='{
                        "flex-fill": !cIsPrintPreView ,
                        "pt-3": !cIsPrintPreView ,
                        "pb-0": !cIsPrintPreView
                    }'
                >
                    <transition name="tranView" mode="out-in" v-if="cIsRouteLogin || cIsAppReady">
                        <router-view></router-view>
                    </transition>
                </div>
            </div>

            <div v-if="masterStore.IsMasterLoading">
                <loading-animation/>
            </div>
        </main>
    </div>
</template>

<script>
// import { mapActions } from 'vuex';
import AppMenuConfig from "./../configs/AppMenuConfig" ;

export default {
    data() {
        return {
        };
    } ,
    methods : {
        logout : function() {
            sessionStorage.removeItem('requestFrom') ;
            sessionStorage.removeItem('userRoles') ;
            this.logoutAction() ;
            this.$router.push({name : "login"}) ;
        } ,
        createTitle : function(routeInstance) {
            // メタタグ[title]からタイトルを取得して[document.title]を設定
            if (routeInstance.meta.title) {
                document.title = this.appName + routeInstance.meta.title ;
            }
        } ,
    } ,
    computed : {
        cLoginUserName : function() {
            if ( this.mainStore.loginMUser === undefined ) return "" ;
            return this.mainStore.loginMUser.full_name ;
        } ,
        /* 現在のルートがログイン */
        cIsRouteLogin : function () {
            return this.$route.path == "/login" ;
        } ,
        /* アプリが使用可能な状態かチェック */
        cIsAppReady : function() {
            return this.mainStore.isAppReady &&  this.mainStore.isAutholized  ;
        } ,
        /* AppUrl取得済み */
        cIsAppUrlReady : function() {
            //console.log(this.rootUrl) ;
            if ( this.rootUrl != "" ) {
                this.mainStore.setAppUrlAction(this.rootUrl) ;
            }
            if ( this.customerKey != "" ) {
                this.mainStore.setCustomerKeyAction(this.customerKey) ;
            }

            return this.rootUrl != "" ;
        } ,
        cMenus : function() {
            return AppMenuConfig.Menus ;
        } ,
        /* 印刷プレビューモードかのチェック */
        cIsPrintPreView : function() {
            return this.$route.meta?.isPrintPreView == true ;
        } ,
        cAppVer : function(){
            return this.mainStore.getAppVersion ? `ver ${this.mainStore.getAppVersion}` : "" ;
        }
    } ,
    props : {
        appName : {
            type : String ,
            default : () => "SignMis" ,
        } ,
        csrf : {
            type : String ,
            required : true ,
        } ,
        rootUrl : {
            type : String ,
            require : true ,
        } ,
        customerKey : {
            type : String ,
            default : () => "" ,
        } ,
        companyLogo: {
            type : String ,
            default : () => "" ,
        } ,
        companyLogoWidth: {
            type : Number ,
            default : () => 38 ,
        } ,
        companyLogoHeight: {
            type : Number ,
            default : () => 38 ,
        } ,
    } ,
    mounted : function() {
        const routeInstance = this.$route ;
        // $Routeの設定(メタタグ[title]のみ)
        this.createTitle(routeInstance) ;
    } ,
    created : function() {
        window.companyLogo = this.companyLogo ;
    } ,
}
</script>

<style scoped>
    .dropdown-item:hover {
        color : white ;
        background: #3490dc linear-gradient(180deg, #51a0e1, #3490dc) repeat-x !important;
    }

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

    @media print {
        .no-print {
            /* 印字しない項目は[class="no-print"]を指定 */
            /* display: none; */
            padding-left: 0px;
        }
    }
</style>