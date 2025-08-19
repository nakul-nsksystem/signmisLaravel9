<template>
    <div class="modal fade" 
         id="DeliveryMailModal" 
         tabindex="-1" 
         role="dialog" 
         data-backdrop="static"
         style="margin-top: 0px;">
        <div class="modal-dialog modal-dialog-fluid" role="document">
            <div class="app-modal-content-dark" v-if="cIsShow">                
                <div class="p-2">
                    <div v-show="state.isSuccess" class="alert alert-success" role="alert">
                        メールを送信しました
                    </div>
                    <div v-if="$$cIsError" class="alert alert-danger" role="alert">
                        {{dErrorData.message}}
                    </div>
                </div>
                <div class="modal-body pt-0">
                    <div class="row mb-2">
                        <div class="col-12 col-xl-3 form-group">
                            <label for="">メール</label>
                            <div>{{cValue.t_project.delivery_mail_to}}</div>
                        </div>
                        <div class="col-12 col-xl-3 form-group">
                            <label for="">宛先</label>
                            <div>{{cValue.t_project.m_customer.name}}</div>
                            <div>{{cValue.customer_user_name}}</div>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-12 col-xl-3 form-group">
                            <label for="">お届け先</label>
                            <div>{{cValue.delivery_customer_name}}</div>
                            <div v-show="cValue.delivery_customer_zip">〒{{cValue.delivery_customer_zip}}</div>
                            <div>{{cValue.delivery_customer_address}}</div>
                            <div>{{cValue.delivery_customer_tel}}</div>
                            <div>{{cValue.delivery_customer_user}}</div>
                        </div>
                        <div class="col-12 col-xl-2 form-group">
                            <label for="">お届け予定日</label>
                            <div>{{$$formatDay(cValue.arrival_at)}}&nbsp;{{cValue.arrival_time}}</div>
                        </div>
                        <div class="col-12 col-xl-3 form-group">
                            <label for="">物件名</label>
                            <div>{{cValue.t_project.name}}</div>
                        </div>
                        <div class="col-12 col-xl-3 form-group">
                            <label for="">商品</label>
                            <div v-for="product in cValue.t_project_products">
                                {{product.name}}<span v-show="product.is_partical_delivery">({{product.t_project_delivery_product_link.qty}})</span>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 col-xl-3 form-group">
                            <label for="">送り状No</label>
                            <input type="text" class="form-control" v-model="cTrackingUrl">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 col-xl-4 form-group">
                            <label for="">追記事項</label>
                            <textarea class="form-control" v-model="cMailPostscript"></textarea>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12 col-xl-4 pt-4 ml-auto">
                            <div class="float-right mt-1">
                                <button type="button" class="btn btn-success" @click.prevent="sendMail()" :disabled="state.loading">
                                    <div v-if="state.loading"><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></div>
                                    <div v-else>送信</div>
                                </button>
                                <button type="button" class="btn btn-light ml-1" @click.prevent="closeModal()" :disabled="state.loading">閉じる</button>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import _ from "lodash";
import { computed, getCurrentInstance, reactive } from "vue";
import { TProjectDelivery } from "../../tProjects/class/models/TProjectDelivery";
import axios from 'axios';
import { useStore } from '../../../stores/mainStore';
import { useMasterStore } from '../../../stores/masterStore';

    const _this = getCurrentInstance()?.proxy
    const store = useStore() ;
    const masterStore = useMasterStore() ;
    interface IProps {
        value:TProjectDelivery
    }

    const props = withDefaults(defineProps<IProps>(), {})

    interface IEmits {
        (e: 'updateData', value: TProjectDelivery): void
    }
    const emit = defineEmits<IEmits>() ;

    const state = reactive({
        loading : false ,
        isSuccess : false ,
    })
    
    /**画面描画用 */
    //表示制御
    const cIsShow = computed( () => !_.isEmpty(props.value) ) ;

    const cValue = computed(() => props.value ) ;

    const cTrackingUrl = computed({
        get : () => cValue.value.invoice_no ,
        set : (val:string|null) => cValue.value.invoice_no = val
    });
    const cMailPostscript = computed({
        get : () => cValue.value.mail_postscript ,
        set : (val:string|null) => cValue.value.mail_postscript = val 
    })


    async function sendMail () {
        state.isSuccess = false ;

        state.loading = true ;
        const tDelivery = _.cloneDeep(cValue.value) ;
        
        /**メール本文の署名に使う情報 */
        //@ts-ignore
        tDelivery.m_branch = masterStore.getMBranchById(store.loginMUser.m_branch_id) ;
        //@ts-ignore
        tDelivery.mailed_m_user = store.loginMUser ;

        let ep = "api/tProjectDelivery/sendMail"   

        try {
            const res = await axios.post(ep , tDelivery) ;
            
            showWarnings(res.data) ;

            delete res.data.warnings ;

            const parsed = TProjectDelivery.parse(res.data) ;
            emit('updateData',parsed)
            
            state.isSuccess = true ;


        } catch (error) {
            //@ts-ignore
            _this.$$errorConsole(error ,ep)
        
        } finally {
            state.loading = false ;
        } 
    
    }  
    //メール送信時のアドレス不適エラーの警告文を出す
    function showWarnings (tDelivery:any) {            
        if(tDelivery.warnings.length > 0) {
            alert(tDelivery.warnings[0]) ;
        }
    } 
    
    
    function open () {
        $('#DeliveryMailModal').modal() ;
    }
    function closeModal (){
        $('#DeliveryMailModal').modal("hide") ;
        state.isSuccess = false ;
        //@ts-ignore
        _this.dErrorStatus = undefined
    }
</script>

<script lang="ts">
export default {
    methods : {
        open : function() {
            $('#DeliveryMailModal').modal() ;

        }
    }    
}
</script>