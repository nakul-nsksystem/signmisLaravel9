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
                            <tr v-for="(n,index) in cValue" :key="n.id">
                                <td>
                                    <ns-checkbox-input
                                        v-model="n.isChecked"
                                        :id="`orderCheckbox${index}`"
                                        />
                                </td>
                                <td>{{n.t_p_order_id}}-{{n.id}}</td>
                                <td>
                                    <div>{{n.display_name}}</div>
                                </td>
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

        </div>

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
import { TIvtMaterial } from "../class/models/TIvtMaterial";

const _this = getCurrentInstance()?.proxy ;
const store = useStore() ;

const { cGetMBranchName ,cGetMKvName ,createIvtInByOrder,convertOrdertoIvt ,formatD } = tIvtMaterialComposition() ;

interface IProps {
    conditions:SearchParams ,
    value:ArrivalListRow[]
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
    (e: 'input', value: ArrivalListRow[]): void
    (e: 'error',value:any): void
}
const emit = defineEmits<IEmits>() ;

const cValue = computed({
    get : () => props.value ,
    set : (val:ArrivalListRow[]) => emit('input',val) 
})

//検索
async function search(url:string|undefined = undefined) {
    state.isLoading = true ; 

    const copied = _.cloneDeep(props.conditions) ;

    delete copied.conducted_at;

    let ep = (url? url : 'api/tIvtMaterialPOList/retrieve') ;

    try { 

        const res = await axios.post(ep,copied) ;
        // pagination関連
        state.pagination.links = res.data.links ;   // リンク
        state.pagination.total = res.data.total ;   // 合計件数
        state.pagination.from  = res.data.from ;    // 現在ページの開始位置
        state.pagination.to    = res.data.to ;      // 現在ページの終了位置
        
        cValue.value = res.data.data ;

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

</script>