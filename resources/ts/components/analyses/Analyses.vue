<template>
    <div class="row">
        <div class="col-12 col-xl-4">
            <h4>分析 </h4>
            <router-link v-if="mainStore.getRole('production_analyse-privilege')>=10" class="nav-link" to="t_productions" title="" append>
                生産実績分析
            </router-link>  
            <router-link v-if="mainStore.getRole('delivery_analyse-privilege')>=10" class="nav-link" to="t_deliveries" title="" append>
                納品分析
            </router-link>
            <!-- <router-link class="nav-link" to="../analyses/t_p_orders" title="" append>
                発注分析
            </router-link> -->
            <router-link v-if="mainStore.getRole('sales_analyse-privilege')>=10" class="nav-link" to="t_sales" title="" append>
                売上分析
            </router-link>  
            <router-link v-if="mainStore.getRole('purchases_analyse-privilege')>=10" class="nav-link" to="t_p_invoices" title="" append>
                仕入分析
            </router-link>
            
        </div>
    </div>    
</template>