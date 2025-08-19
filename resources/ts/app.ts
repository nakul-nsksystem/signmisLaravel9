/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import window from "./window" ;

/**
 * Bootsrap
 */

require('./bootstrap');
import * as bootstrap from 'bootstrap';
bootstrap;

/**
 * Js Libraries
 */

window.Inflector = require('inflector-js') ;

/**
 * DayJs Setting
 */
import * as dayjs from 'dayjs' ;
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
var isBetween = require('dayjs/plugin/isBetween')

dayjs.extend(utc) ;
dayjs.extend(timezone) ;
dayjs.extend(isBetween);

// @ts-ignore
dayjs.tz.setDefault("Asia/Tokyo") ;
window.DayJs = dayjs;

/**
 * Axios Setting
 */
import axios from "axios"
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Content-Encoding'] = 'gzip';
axios.defaults.headers.common['Accept'] = 'application/json';

//  'Accept-Charset':'utf-8',

/**
 * Vue
 */
import Vue from "vue";
window.Vue = require('vue');

Vue.config.productionTip = false;

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

 const files = require.context('./', true, /\.vue$/i) ;
 files.keys().map(
    key => {
        const splited:string[] = key.split('/') ;
        if ( splited !== undefined)
        {
            const poped = splited.pop() ;
            if ( poped !== undefined )
            {
                Vue.component(poped.split('.')[0], files(key).default)
            }
        }
    }
) ;
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))
//Vue.component('example-component', require('./components/ExampleComponent.vue').default);

/**
 * Vue CompositionAPI
 */

// import VueCompositionAPI from '@vue/composition-api'
// Vue.use(VueCompositionAPI) ;

/**
 * Pinia
 * v-routerより前に書かないとナビゲーションガードの時に呼ばれない
 */
import { createPinia, PiniaVuePlugin } from "pinia"
Vue.use(PiniaVuePlugin)
const pinia = createPinia();
/**
 * Vue Router
 */

import VueRouter, { NavigationGuardNext } from 'vue-router'
import VRouteConfigs from './routers/VRouteConfigs' ;

Vue.use(VueRouter) ;

const router = new VueRouter({
    routes : VRouteConfigs.getRoutes()
}) ;
router.beforeEach(VRouteConfigs.beforeEach) ;

/**
 * VueX
 */
// window.Vuex = require('vuex');

// import store from './stores/_store';

/**
 * グローバルMixins
 */

import globals from "./mixins/GlobalMixins" ;
import globalStores from "./mixins/GlobalStoreMixins" ;

Vue.mixin(globals) ;
Vue.mixin(globalStores) ;

/*********************
 * Vue の Plugins
 **********************/

/**
 * VCalendar
 */
// @ts-ignore
import VCalendar from 'v-calendar';
import VCalendarConfig from './configs/VCalendarConfig' ;
Vue.use(VCalendar, VCalendarConfig ) ;

/**
 * VSelect
 */

import vSelect from 'vue-select' ;
// @ts-ignore
vSelect.props.components.default = () => ({
    OpenIndicator: {
    // @ts-ignore
        render: createElement => createElement('span', ''),
    },
});
Vue.component('v-select', vSelect)

/**
 * Vue context
 * https://github.com/rawilk/vue-context
 */
// @ts-ignore
import VueContext from 'vue-context';
Vue.component('vue-context', VueContext)

/**
 * Vee-Validation
 */

// Vee-Validation + カスタム検証機能を実装
import { ValidationObserver, ValidationProvider, extend, localize } from 'vee-validate'
// 日本語のメッセージを設定
import custom_validate_locale_js from "./validates/customJa.json" ;
localize('ja', custom_validate_locale_js);

// コンポーネントの登録
Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)

// 全てのルールをインポート
import * as originalRules from 'vee-validate/dist/rules';
let rule;
for (rule in originalRules) {
    extend(rule, {
        // @ts-ignore
        ...originalRules[rule] ,
    });
}

/**
 * カスタムルールの読込
 */
import * as customRules from "./validates/CustomValidateRules" ;
for (let customRule in customRules) {
    extend(customRule, {
        // @ts-ignore
        ...customRules[customRule] ,
    });
}

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */
const vueapp:Vue = new Vue({
    el: '#app',
    // store ,
    router ,
    pinia ,
    data: {
    } ,
    created : function() {
    }
});

window.vueapp = vueapp ;
