<template>
    <div>
        <div class="row mb-2">
            <contents-header-left></contents-header-left>
            <contents-header-right>
                <div>
                    <router-link to="add" title="" append>
                        <button type="button" class="btn btn-primary">
                            <i class="fas fa-plus fa-fw"></i>
                            新規
                        </button>
                    </router-link>
                </div>
                <div class="ml-2">
                    <router-link to="qr_label_export" title="" append>
                        <button type="button" class="btn btn-secondary">
                            <i class="fas fa-table fa-fw"></i>
                            QR発行
                        </button>
                    </router-link>
                </div>
                <div class="ml-2">
                    <button type="button" class="btn btn-success" data-toggle="modal" data-target="#ivtTypeSelectModal">
                        <i class="fas fa-qrcode fa-fw"></i>
                        QRリーダー
                    </button>
                </div>
                
            </contents-header-right>            
        </div>
        <div v-if="$$cIsError" class="alert alert-danger" role="alert">
            {{dErrorData.message}}
        </div>
        
        <div>
            <t-ivt-material-header-component
                v-model="conditions"
                :isLoading="state.isLoading"
                :viewMode="state.viewMode"
                @search="search()"
                />
            <t-inventory-list
                ref="tInventoryList"
                :conditions="conditions" 
                class="pt-3"
                @error="$$errorConsole($event ,$event.ep) ;"
                />
        </div>
        <div class="modal fade" id="ivtTypeSelectModal" tabindex="-1" role="dialog" aria-labelledby="ivtTypeSelectTitle" data-backdrop="static" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content app-modal-content-dark">
                    <div class="modal-header">
                        <h5 class="modal-title" id="ivtTypeSelectTitle">モードを選択</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true" class="text-white">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body card-group">
                        <div class="card bg-dark" style="border-radius:0;"
                            v-for="n in QrMenu" :key="n.route"
                            @click.prevent="selectType(n.route)"
                            >
                            <div class="card-img-top p-2 bg-white text-dark">
                                <i class="fas fa-7x d-flex justify-content-center" :class="n.icon"></i>
                            </div>
                            <div class="card-body app-card-body">        
                                 <h5 class="card-title">{{n.name}}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        

    </div>
    
</template>

<script lang='ts'>
import PageMixins from '../../mixins/commons/PageMixins';

export default {
    mixins : [PageMixins] ,
}
</script>
<script setup lang='ts'>
import _ from "lodash" ;
import axios from 'axios'
import { computed, getCurrentInstance, reactive, ref } from 'vue';
import { useStore } from '../../stores/mainStore';
import { TIvtMaterial } from './class/models/TIvtMaterial'
import { MKv } from '../masters/class/models/MKv';
import { useMasterStore } from '../../stores/masterStore';
//@ts-ignore
import TInventoryList from './components/TInventoryList.vue'
import { useRouter } from '../../routers/routerPlugin';

const _this = getCurrentInstance()?.proxy ;
const store = useStore() ;
const masterStore = useMasterStore() ;
const router = useRouter() ;

//検索条件
const conditions = reactive({
    m_branch_id            : store.loginMUser?.m_branch_id ,
    conducted_at           : new Date(),
    m_material_detail_id   : 0,
    m_material_id          : 0,
    category_m_kv_id       : 0,
    sub_category_m_kv_id   : 0,
    ivt_material_name      : "",
    supplier_m_customer_id : 0,
    //入庫済を含むチェック
    is_ivt_in              : false 
}) ;

const state = reactive({
    //表示　在庫・入庫予定
    viewMode : 'inventory' ,
    isLoading : false ,
})

const tInventoryList =ref() ;

async function search(){
    state.isLoading = true ;
    await tInventoryList.value._setupState.search() ;
    state.isLoading = false ;
}

const QrMenu = [
    {
        name  : "入庫" ,
        icon  : "fa-dolly-flatbed" ,
        route : "ivtin" ,
    } ,
    {
        name  : "出庫" ,
        icon  : "fa-box-open" ,
        route : "ivtout" ,
    } ,
    {
        name  : "棚卸" ,
        icon  : "fa-boxes" ,
        route : "adjust" ,
    }
]

function selectType(route:string) {

    $(`#ivtTypeSelectModal`).modal("hide") ;
    router.push({ path: `./qr/${route}`  , append:true }) ;      
}
</script>

<style scoped>
.modal-open
{
  padding-right: 0px!important;
}
.modal {
  width: 97% !important;

}


</style>