<template>
    <div class="row">
        <div class="col-12 col-xl-4">        
            <h5>マスタ管理</h5>
            
            <router-link v-if="mainStore.getRole('m_material_master-privilege')>=10" class="nav-link" to="m_material" title="" append>
                材料マスタ
            </router-link>            
            <router-link v-if="$$cIsNskDev" class="nav-link" to="m_product_category" title="" append>
                商品カテゴリマスタ
            </router-link>  
            <router-link v-if="$$cIsNskDev" class="nav-link" to="m_process_category" title="" append>
                工程カテゴリマスタ
            </router-link>                    
            <router-link v-if="mainStore.getRole('m_user_master-privilege')>=10" class="nav-link" to="m_user" title="" append>
                ユーザーマスタ
            </router-link>
            <router-link v-if="mainStore.getRole('m_role_master-privilege')>=10" class="nav-link" to="m_role" title="" append>
                権限マスタ
            </router-link>
            <router-link v-if="$$cIsNskDev" class="nav-link" to="m_role_key" title="" append>
                権限キーマスタ
            </router-link>
            <router-link v-if="mainStore.getRole('m_customer_master-privilege')>=10" class="nav-link" to="m_customer" title="" append>
                取引先マスタ
            </router-link>    
            <router-link v-if="mainStore.getRole('m_customer_master-privilege')>=10" class="nav-link" to="m_customer_info" title="" append>
                取引先付加情報マスタ
            </router-link>    
            <router-link v-if="mainStore.getRole('m_production_master-privilege')>=10" class="nav-link" to="m_production" title="" append>
                生産先マスタ
            </router-link> 
            <router-link v-if="$$cIsNskDev" class="nav-link" to="m_tag_category" title="" append>
                タグカテゴリマスタ
            </router-link>
            <router-link v-if="$$cIsNskDev" class="nav-link" to="m_tag" title="" append>
                タグマスタ
            </router-link>
            <router-link v-if="$$cIsNskDev" class="nav-link" to="m_calendar" title="" append>
                カレンダーマスタ
            </router-link>               
        </div>
        <div class="col-12 col-xl-4">        
            <h5>オプション </h5>
            
            <router-link class="nav-link" to="m_user_option" title="" append>
                ユーザー個別設定
            </router-link>  

            <router-link v-if="mainStore.getRole('sm_option_master-privilege')>=10" class="nav-link" to="sm_option4user" title="" append>
                システムオプション
            </router-link>  

        </div>
    </div>
        
</template>
