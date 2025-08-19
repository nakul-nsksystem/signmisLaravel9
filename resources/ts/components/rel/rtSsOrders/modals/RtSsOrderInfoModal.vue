<template>
    <div id="modalRtSsOrderInfo" 
        class="modal fade" 
        tabindex="-1" 
        role="dialog" 
        aria-labelledby="modalRtSsOrderInfo" 
        aria-hidden="true" 
        data-backdrop="static"
        style="margin-top: 0px;" 
        >
        <div class="modal-dialog modal-dialog-fluid">
            <div class="app-modal-content-dark p-3">
                <div v-if="cIsShow">
                    <div class="row mb-3 pt-2">
                        <div class="col-12 col-xl-6">
                            <p>注文No：{{cValue.order_number}}</p>
                            <p>注文日時：{{cValue.time.order_time}}</p>
                        </div>                        
                    </div>
                    <div class="row mb-3">
                        <div class="col-12 col-xl-6">
                            <rt-ss-order-custmer-info-table
                                v-model="cValue.billing.address"
                                :title="'クライアント情報'"/>
                        </div>
                        <div class="col-12 col-xl-6">
                            <rt-ss-order-custmer-info-table
                                v-model="cValue.ship_data.address"
                                :title="'納品先情報'"/>
                        </div>
                    </div>
                    

                    <div class="row mb-3">
                        <div class="col-12">
                            <div class="table-responsive">
                                <table class="table table-striped table-dark text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>商品名</th>
                                            <th>寸法</th>
                                            <th class="text-right">数量</th>
                                            <th class="text-right">単価</th>
                                            <th class="text-right">金額</th>
                                            <th>詳細</th>
                                            <th>ファイル</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in cValue.order_items.order_item">
                                            <td>{{item.product_name}}</td>
                                            <td>{{cNumFormat(item.Freeattribute_id2)}} × {{cNumFormat(item.Freeattribute_id3)}}</td>
                                            <td class="text-right">{{cNumFormat(item.product_quantity)}}</td>
                                            <td class="text-right">{{cNumFormat(item.product_item_price)}}</td>
                                            <td class="text-right">{{cNumFormat(item.product_item_price*item.product_quantity)}}</td>
                                            <td>
                                                <div v-for="n in 99">
                                                    {{cGetAttribute(item,n)}}
                                                </div>
                                            </td>
                                            <td>
                                                <template v-if="!_.isEmpty(item.nativeUpload?.files)">
                                                    <div v-for="n in Object.keys(item.nativeUpload?.files).length">
                                                        {{item.nativeUpload?.files[`file_${n}`]}}
                                                    </div>
                                                </template>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>送料</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td class="text-right">{{cNumFormat(cValue.ship_data?.ship_price)}}</td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-12">
                            <div class="table-responsive">
                                <table class="table table-striped table-dark text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>配送情報</th>
                                            <th>支払情報</th>
                                            <th>備考</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{{cValue.ship_data.ship_description}}</td>
                                            <td>{{cValue.payment_data.payment_description}}</td>
                                            <td>{{cIsNil(cValue.order_comment?.comment)}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div class=" text-right p-2">
                            <button type="button" class="btn btn-primary" @click.prevent="mapTProject">物件連携</button>
                            <button type="button" class="btn btn-light" @click.prevent="closeModal">閉じる</button>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import Vue, { ref,computed, getCurrentInstance, reactive } from 'vue';
    import _ from 'lodash'
    import DayJsEx from "../../../../frameworks/DayJsEx" ;

    interface IProps {
        value?:any
    }
    const props = withDefaults(defineProps<IProps>(), {
        value : () => ({}) 
    })

    interface IEmits {
        (e: 'input' , val:object ): void
        (e: 'mapTProject'): void
    }

    const emit = defineEmits<IEmits>() ;

    
    //画面に描画する情報
    const cValue = computed(() => props.value?.order) ;
    
    
    //中身がないときエラー回避用
    const cIsShow = computed(() => !_.isEmpty(cValue.value)) ;

    //数値表示制御
    const cNumFormat = computed(() => (val:number|null) => _.isNil(val) ? 0 : val.toLocaleString()) ;
    //日付表示制御
    const cDateFormat = computed(() => (val:Date|null) => _.isNil(val) ? "" : DayJsEx.format(val)) ;
    //properties of undefined　回避用
    const cIsNil = computed(() => (val:any) => _.isNil(val) ? "" : val) ;


    //attribute_id10001~10099に工程などの情報があるため画面描画用に作成
    const cGetAttribute = computed(() => 
        (val:any , i:number) => {
            const colName = 'attribute_id100' + i.toString().padStart(2, '0') ; 
            return val[colName] ?? null ; 
        }
    )

    
    const dRtSsOrderInfoModal = ref(false) ;

    function openModal () {
        $('#modalRtSsOrderInfo').modal() ;
    }

    function closeModal () {
        emit("input",{}) ;
        $('#modalRtSsOrderInfo').modal("hide") ;

    }

    //物件用情報に変更
    function mapTProject() {
        emit("mapTProject") ;
        $('#modalRtSsOrderInfo').modal("hide") ;
    }

</script>
<script lang="ts">
export default {
    methods : {
        openModal : function () {
            
            $('#modalRtSsOrderInfo').modal() ;

        }
    }
}
</script>