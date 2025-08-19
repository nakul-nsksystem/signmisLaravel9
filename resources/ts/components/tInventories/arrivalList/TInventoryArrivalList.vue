<template>
    <div>
        <div class="row">
            <div class="col-12">
                <div class="table-responsive">
                    <table class="table table-striped table-dark">
                        <thead>
                            <tr>
                                <th style="width:2%;min-width:25px;"></th>
                                <th style="width:5%;min-width:100px;">発注No.</th>
                                <th style="width:25%;min-width:250px;">名称</th>
                                <th style="width:2%;min-width:50px;">発注数量</th>
                                <th style="width:2%;min-width:50px;">発注単位</th>
                                <th style="width:5%;min-width:50px;">拠点</th>
                                <th style="width:8%;min-width:100px;">仕入先</th>
                                <th style="width:6%;min-width:70px;">発注日</th>
                                <th style="width:8%;min-width:70px;">納期</th>
                                <th style="width:8%;min-width:70px;">入庫日</th>
                                <!-- <th style="width:5%;min-width:50px;">Actions</th> -->
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(n,index) in state.list">
                                <td>
                                    <ns-checkbox-input
                                        v-model="n.isChecked"
                                        :id="`InventoryInCheckbox${index}`"
                                        />
                                </td>
                                <td><a :href="`v#/t_p_order/edit/${n.t_p_order_id}`">{{n.t_p_order_id}}-{{n.id}}</a></td>
                                <td>{{n.po_material_name}}</td>
                                <td class="text-right">{{n.po_qty.toLocaleString()}}</td>
                                <td>{{cGetMKvName(n.unit_m_kv_id)}}</td>
                                <td>{{cGetMBranchName(n.m_branch_id)}}</td>
                                <td>{{n.supplier_m_customer_name}}</td>
                                <td>{{$$formatDay(n.order_date)}}</td>
                                <td>{{$$formatDay(n.due_date)}}</td>  
                                <td>
                                    <div class="text-success" v-for="ivt in n.t_ivt_material_ins" :key="ivt.id">
                                        {{$$formatDay(ivt.conducted_at)}} * {{ivt.qty}}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
            </div>
            <div class="col-9">
                <pagination
                    :p-pagination.sync="state.pagination"
                    @search="search($event)"
                    />
            </div>
            <div class="col-3 text-right">
                <button type="button" class="btn btn-success" @click.prevent="openIvtInModal">入庫登録</button>
            </div>

        </div>
        <t-ivt-material-in-by-order-modal
            v-model="state.ivtInList"
            ref="ivtInByOrderModal"
            @updateIvtIns="updateIvtIns($event)"
            />

    </div>
</template>

<script setup lang='ts'>
import _ from "lodash" ;
import axios from 'axios'
import { computed, getCurrentInstance, reactive, ref } from 'vue';
import { useStore } from '../../../stores/mainStore';
import { MKv } from '../../masters/class/models/MKv';
import { useMasterStore } from '../../../stores/masterStore';
import { tIvtMaterialComposition ,ArrivalListRow,SearchParams} from '../class/compositions/tIvtMaterialComposition' ;
//@ts-ignore
import TIvtMaterialInByOrderModal from '../components/TIvtMaterialInByOrderModal.vue'
import { TIvtMaterial } from "../class/models/TIvtMaterial";

const _this = getCurrentInstance()?.proxy ;
const store = useStore() ;

const { cGetMBranchName ,cGetMKvName ,createIvtInByOrder,convertOrdertoIvt ,formatD } = tIvtMaterialComposition() ;

interface IProps {
    conditions:SearchParams
}

const props = withDefaults(defineProps<IProps>(), {})


const state = reactive({
    //ロード中
    isLoading : false , 

    //検索結果
    list : [] as ArrivalListRow[],

    //選択した材料カテゴリオブジェクト
    selectedCatMKv:{} as MKv,

    ivtInList:Array(),

    //ページネーション関連項目
    pagination : {   // pagination
        links : [] , // リンク
        total : -1 , // 合計件数
        from : -1 ,  // 現在ページの開始位置
        to : -1 ,    // 現在ページの終了位置
    } ,
})

interface IEmits {
    // (e: 'updateIvtIns', value: TIvtMaterial): void
    (e: 'error',value:any): void
}
const emit = defineEmits<IEmits>() ;
//検索
async function search(url:string|undefined = undefined) {
    state.isLoading = true ; 

    const copied = _.cloneDeep(props.conditions) ;

    // copied.order_date_from = copied.conducted_at_from ;
    // copied.order_date_to = copied.conducted_at_to ;
    
    delete copied.conducted_at;

    let ep = (url? url : 'api/tIvtMaterialPOList/retrieve') ;

    try { 

        const res = await axios.post(ep,copied) ;
        // pagination関連
        state.pagination.links = res.data.links ;   // リンク
        state.pagination.total = res.data.total ;   // 合計件数
        state.pagination.from  = res.data.from ;    // 現在ページの開始位置
        state.pagination.to    = res.data.to ;      // 現在ページの終了位置
        
        state.list = res.data.data ;

        // console.log(res.data.data) ;
    }
    catch (error ) {                            
        emit("error",error)
        //@ts-ignore
        // _this.$$errorConsole(error ,error.ep) ;
    }
    finally {
        state.isLoading = false ; 
    }
}

const ivtInByOrderModal = ref() ;
function openIvtInModal () {
    const validList = state.list.filter( x => x.isChecked ) ;

    if(_.isEmpty(validList)) return ;
    
    state.ivtInList = validList.map( x => convertOrdertoIvt(x) )
    ivtInByOrderModal.value._setupState.open() ;
}

function updateIvtIns(row:TIvtMaterial[]) {
    for(const x of state.list) {
        const filterd = row.filter( e => e.t_p_order_detail_id === x.id ) ;
        x.t_ivt_material_ins.push(...filterd) ;
        x.isChecked = false ;
    }
}

</script>