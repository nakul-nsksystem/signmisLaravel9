<template>
<!-- 削除？ -->

    <div class="modal fade" 
         id="ivtInByOrderModal" 
         tabindex="-1" 
         role="dialog" 
         style="margin-top: 0px;">
        <div class="modal-dialog modal-dialog-fluid" role="document">
            <div class="app-modal-content-dark" v-if="cIsShow">                
                <div class="p-2">
                    <div class="row">
                        <div class="col-6">
                            <h4>入庫登録</h4> 
                        </div>
                        <div class="col-6 text-right">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true" class="text-white">&times;</span>
                            </button>
                        </div>
                    </div>
                    <div v-show="state.isSuccess" class="alert alert-success" role="alert">
                        保存に成功しました
                    </div>
                    <div v-if="$$cIsError" class="alert alert-danger" role="alert">
                        {{dErrorData.message}}
                    </div>
                </div>
                
                <div class="modal-body pt-0">
                    <div class="row mb-3">
                        <div class="col-12">
                            <div class="table-responsive">
                                <table class="table table-striped table-dark">
                                    <thead>
                                        <tr>
                                            <th style="width:10%; min-width:100px;">日付</th>
                                            <th style="width:15%; min-width:150px;">名称</th>
                                            <th style="width:5%; min-width:50px;" class="text-right">発注数量</th>
                                            <th style="width:5%; min-width:50px;">発注単位</th>
                                            <th style="width:5%; min-width:50px;" class="text-right">内容数</th>
                                            <th style="width:5%; min-width:50px;">入庫数量</th>
                                            <th style="width:5%; min-width:50px;">入庫単位</th>
                                            <th style="width:10%; min-width:100px;">単価</th>
                                            <th style="width:10%; min-width:100px;" class="text-right">金額</th>
                                            <th style="width:5%; min-width:50px;">発注No</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for=" n in props.value" :key="n.t_p_order_detai_id" class="text-nowrap" >
                                            <td><ex-v-date-picker v-model="n.conducted_at"/></td>
                                            <td>{{n.ivt_material_name}}</td>
                                            <td class="text-right">{{n.po_qty}}</td>
                                            <td>{{cGetMKvName(n.po_unit_m_kv_id)}}</td>
                                            <td class="text-right">{{n.material_contents_qty}}</td>
                                            <td><ns-number-input v-model="n.qty" /></td>
                                            <td>{{cDisplayMaterialIvtDiv(n.material_ivt_div_m_kv_id,n.po_unit_m_kv_id)}}</td>
                                            <td><ns-number-input v-model="n.price"/></td>
                                            <td class="text-right">{{cTotalPrice(n)}}</td>
                                            <td>
                                                <a :href="`v#/t_p_order/edit/${n.t_p_order_id}`">{{n.t_p_order_id}} - {{n.t_p_order_detail_id}}</a>
                                            </td>
                                        </tr>
                                    </tbody>

                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 text-right">
                            <button type="button" class="btn btn-primary" @click.prevent="postData()" :disabled="state.loading">
                                <div v-if="state.loading">
                                    <span class="spinner-border spinner-border-sm" role="status" />
                                    保存中...
                                </div>
                                <div v-else>
                                    保存
                                </div>
                            </button>
                        </div>
                    </div>

                </div>
                
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import _ from "lodash";
import { computed, reactive } from "vue";
import { TIvtMaterial } from "../class/models/TIvtMaterial";
import { tIvtMaterialComposition } from "../class/compositions/tIvtMaterialComposition"
import TIvtMaterialConst from "../consts/TIvtMaterialConst";
import axios from "axios";

    const {cGetMKvName ,cGetMBranchName,cDisplayMaterialIvtDiv ,cLoginUserId ,save ,formatDT} = tIvtMaterialComposition() ;

    interface IProps {
        value:TIvtMaterial[]
    }

    const props = withDefaults(defineProps<IProps>(), {})

    interface IEmits {
        (e: 'updateIvtIns', value: TIvtMaterial): void
    }
    const emit = defineEmits<IEmits>() ;
    
    /**画面描画用 */
    //表示制御
    const cIsShow = computed( () => !_.isEmpty(props.value) ) ;

    const cTotalPrice = computed( () => (row:TIvtMaterial) => {
        const total = row.price * row.qty ;
        row.total_price = total ;
        return total.toLocaleString() ;
    })

    const state = reactive({

        loading : false ,
        isSuccess : false ,
    })


    
    async function postData() {
        
        state.loading = true ;

        let ep = 'api/tIvtMaterial/saveMultiRow'
        try {
            const res = await axios.post(ep,props.value) ;
            const parsed = res.data.map( (x:any) => TIvtMaterial.parse(x)) ;
            emit("updateIvtIns",parsed) ;
            closeModal()
        } 
        catch (error) {
            //@ts-ignore
            _this.$$errorConsole(error, ep) ;
        } 
        finally {
            state.loading = false
        }
        
    } 

    //Date or stringの判定
    function isDate(date:string|Date){
        const toString = Object.prototype.toString ;
        return toString.call(date) == '[object Date]' ;
    }
    
    function open () {
        
        $('#ivtInByOrderModal').modal() ;
    }
    function closeModal (){
        $('#ivtInByOrderModal').modal("hide") ;
    }
</script>
<style scoped>

</style>