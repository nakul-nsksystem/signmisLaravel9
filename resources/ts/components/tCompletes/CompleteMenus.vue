<template>
    <div class="row">
        <div class="col-12 col-xl-3">
            <h5>締業務</h5>
            
            <router-link v-if="mainStore.getRole('t_complete-privilege')>=10" class="nav-link" to="t_s_complete_process" title="" append>
                請求締 処理
            </router-link>            
            <router-link v-if="mainStore.getRole('t_complete-privilege')>=10" class="nav-link" to="t_s_complete_cancel" title="" append>
                請求締 解除
            </router-link>
            <router-link v-if="mainStore.getRole('t_complete-privilege')>=10" class="nav-link" to="t_s_payment" title="" append>
                入金
            </router-link>

            <p/>

            <router-link v-if="mainStore.getRole('t_complete-privilege')>=10" class="nav-link" to="t_p_complete_process" title="" append>
                仕入締 処理
            </router-link>            
            <router-link v-if="mainStore.getRole('t_complete-privilege')>=10" class="nav-link" to="t_p_complete_cancel" title="" append>
                仕入締 解除
            </router-link>
            <router-link v-if="mainStore.getRole('t_complete-privilege')>=10" class="nav-link" to="t_p_payment" title="" append>
                支払
            </router-link>
        </div>
        <div class="col-12 col-xl-3"></div>
        <div class="col-12 col-xl-3">
            <h5>売掛帳票</h5>            
            <div v-for="n in ReportMenuConfigs.sales" :key="n.name">
                <router-link v-if="mainStore.getRole(n.role)>=10" class="nav-link" :to="`../report/${n.link}`" title="" append >
                    {{n.name}}
                </router-link>
            </div>
        </div>
        <div class="col-12 col-xl-3">
            <h5>買掛帳票</h5>            
            <div v-for="n in ReportMenuConfigs.purchases" :key="n.name">
                <router-link v-if="mainStore.getRole(n.role)>=10" class="nav-link" :to="`../report/${n.link}`" title="" append >
                    {{n.name}}
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed ,ref } from 'vue';
import  ReportMenuConfigs  from '../reports/configs/ReportMenuConfigs'

</script>
