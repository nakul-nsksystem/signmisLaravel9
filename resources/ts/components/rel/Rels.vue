<template>
    <div class="row">
        <div class="col-12 col-xl-4">

            <div v-if="mainStore.getRole('rel_export-privilege')>=30">
                <h5>販売管理連携</h5>
                
                <router-link v-if="mainStore.getRole('rel_export-privilege')>=30" class="nav-link" to="export_t_sale" title="" append>
                    売上 データ連携
                </router-link>            
                <router-link v-if="mainStore.getRole('rel_export-privilege')>=30" class="nav-link" to="export_t_p_invoice" title="" append>
                    仕入 データ連携
                </router-link>
            </div>

            <div class="mt-4" v-if="mainStore.getRole('rel_export-privilege')>=30">
                <h5>会計連携</h5>
                
                <router-link v-if="mainStore.getRole('rel_export-privilege')>=30" class="nav-link" to="export_payment_sale" title="" append>
                    入金 データ連携
                </router-link>            
                <router-link v-if="mainStore.getRole('rel_export-privilege')>=30" class="nav-link" to="export_payment_purchase" title="" append>
                    支払 データ連携
                </router-link>
            </div>
        </div>

        <div class="col-12 col-xl-4 mt-4 mt-xl-0">
            <div>
                <h5>SS連携</h5>
                <router-link v-if="mainStore.getRole('rel_rt_ss_order-privilege')>=30" class="nav-link" to="rt_ss_order" title="" append>
                    Durst SmartShop
                </router-link>            

            </div> 
        </div>

        <!-- <div class="col-12 col-xl-4 mt-4 mt-xl-0">
            <div>
                <h5>その他</h5>
                <router-link v-if="mainStore.getRole('rel_export-privilege')>=30" class="nav-link" to="graphic_layout" title="" append>
                    データレイアウト
                </router-link>            

            </div> 
        </div> -->
    </div>
       
</template>