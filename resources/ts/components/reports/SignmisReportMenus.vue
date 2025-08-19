<template>
    <div class="row">
        <div class="col-12 col-xl-3" v-if="cValidMenus('projects').length > 0">
            <h5>物件帳票</h5>
            <div v-for="n in cValidMenus('projects')" :key="n.name">
                <router-link class="nav-link" :to="n.link" title="" append >
                    {{n.name}}
                </router-link>
            </div>
        </div>
        <div class="col-12 col-xl-3" v-if="cValidMenus('sales').length > 0">
            <h5>売掛帳票</h5>
            <div v-for="n in cValidMenus('sales')" :key="n.name">
                <router-link class="nav-link" :to="n.link" title="" append >
                    {{n.name}}
                </router-link>
            </div>
        </div>
        <div class="col-12 col-xl-3" v-if="cValidMenus('purchases').length > 0">
            <h5>買掛帳票</h5>
            <div v-for="n in cValidMenus('purchases')" :key="n.name">
                <router-link class="nav-link" :to="n.link" title="" append >
                    {{n.name}}
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed ,ref } from 'vue';
import _ from 'lodash';
import { useStore } from '../../stores/mainStore';
import ReportMenuConfigs from './configs/ReportMenuConfigs'

const store = useStore() ;

type TpReportKey = 'projects'|'sales'|'purchases' ;
//有効権限有のメニューのみ表示
const cValidMenus = computed(() => (key:TpReportKey) => ReportMenuConfigs[key].filter(x => checkRole(x.role,x.level)))

//権限取得
function checkRole (role:string ,level:number = 10) {
    return store.getRole(role) >= level ;
}

</script>
