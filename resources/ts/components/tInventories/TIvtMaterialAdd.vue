<template>
<!-- 削除？ -->
    <div>
        <validation-observer v-slot="{ invalid }">
            <div class="row mb-2">
                <contents-header-left></contents-header-left>
                <contents-header-right>
                    <div class="float-right ">
                        <button type="button" class="btn btn-success" @click.prevent="postData" :disabled="invalid || state.loading">
                            <div v-if="state.loading">
                                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                保存中...
                            </div>
                            <div v-else>
                                <i class="fas fa-save fa-fw"></i>
                                保存
                            </div>
                        </button>
                    </div>
                </contents-header-right>            
            </div>
            <div v-if="$$cIsError" class="alert alert-danger" role="alert">
                {{dErrorData.message}}
            </div>
            <div v-if="state.isSuccess" class="alert alert-success" role="alert">
                保存しました
            </div>

            <div class="row">
                <div class="col-12 col-xl-2">
                    <div class="form-group">
                        <label for="inputMBranchId">拠点</label>
                        <m-branch-select 
                            v-model="state.params.m_branch_id" 
                            />
                    </div>
                </div>
                <div class="col-12 col-xl-2">                    
                    <div class="form-group">
                        <label >入庫日</label>
                        <ex-v-date-picker 
                            readonly
                            aria-readonly="true"
                            :isDayOnly='false'
                            v-model="state.params.conducted_at" />
                    </div>    
                </div>
            </div>

            <div class="row mb-2">
                <div class="col-12">
                    <div class="table-responsive">
                        <table class="table table-striped table-dark">
                            <thead>
                                <tr>
                                    <th>拠点</th>
                                    <th>区分</th>
                                    <th>日付</th>
                                    <th>材料名</th>
                                    <th>ロットNo</th>
                                    <th class="text-right">数量</th>
                                    <th class="text-right">単価</th>
                                    <th class="text-right">金額</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(n,index) in state.list"
                                    @click.prevent="select(n)" 
                                    :class="{ 'dark-selected':state.selectedIndex === index}">
                                    <template v-if="n.deleted_at === null ">
                                        <td>{{cGetMBranchName(n.m_branch_id)}}</td>
                                        <td>{{cGetMKvName(n.ivt_m_kv_id)}}</td>
                                        <td>{{formatDT(n.conducted_at)}}</td>
                                        <td>{{n.ivt_material_name}}</td>
                                        <td>{{n.lot_no}}</td>
                                        <td class="text-right">{{n.qty.toLocaleString()}}</td>
                                        <td class="text-right">{{n.price.toLocaleString()}}</td>
                                        <td class="text-right">{{n.total_price.toLocaleString()}}</td>
                                        <td class="text-right">
                                            <button type="button" class="btn btn-danger" @click.prevent.stop="destroy(index)" :disabled="state.selectedIndex !== -1">
                                                <i class="fas fa-trash fa-fw"></i>
                                            </button>
                                        </td>
                                    </template>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col-12 text-right">
                    <button type="button" class="btn btn-primary" @click.prevent="modalOpen" :disabled="state.loading">
                        <i class="fas fa-plus fa-fw"></i>
                        材料追加
                    </button>
                </div>
            </div>

            <div 
                class="p-2"  
                v-if="!_.isEmpty(state.selectedInventory)">
                <div class="row">
                    <div class="col-12 pb-2 ">
                        <div class="border-bottom">
                            <p class="h5">{{state.selectedInventory.ivt_material_name}}</p>
                        </div>
                    </div>
                    <div class="col-12 col-xl-1 form-group">
                        <validation-provider name="拠点" rules="required|excluded:0" immediate v-slot="{ errors }">
                            <label >拠点</label>
                            <m-branch-select 
                                v-model="state.selectedInventory.m_branch_id"
                                />
                            <span class="validation-error">{{ errors[0] }}</span>
                        </validation-provider>
                    </div>
                    <div class="col-12 col-xl-2 form-group">
                        <validation-provider name="日付" rules="required" immediate v-slot="{ errors }">
                            <label for="">日付</label>
                            <ex-v-date-picker
                                v-model="state.selectedInventory.conducted_at"
                                />
                            <span class="validation-error">{{ errors[0] }}</span>
                        </validation-provider>
                    </div>
                    <div class="col-12 col-xl-2 form-group">
                        <validation-provider name="区分" rules="required|excluded:0" immediate v-slot="{ errors }">
                            <label for="">区分</label>
                            <m-kv-select
                                v-model="state.selectedInventory.ivt_m_kv_id"
                                :kv-key="'t_inventory-division'"
                                />
                            <span class="validation-error">{{ errors[0] }}</span>
                        </validation-provider>
                    </div>
                    <div class="col-12 col-xl-2 form-group">
                        <validation-provider name="ロットNo" rules="required" immediate v-slot="{ errors }">
                            <label for="">ロットNo</label>
                            <input type="text" class="form-control" v-model="state.selectedInventory.lot_no">
                            <span class="validation-error">{{ errors[0] }}</span>
                        </validation-provider>
                    </div>
                    <div class="col-12 col-xl-1 form-group">
                        <validation-provider :name=" state.selectedInventory.qty + '' " rules="required|excluded:0" immediate v-slot="{ errors }">
                            <label for="">数量</label>
                            <ns-number-input
                                v-model="state.selectedInventory.qty"
                                />
                            <span class="validation-error">{{ errors[0] }}</span>
                        </validation-provider>
                    </div>
                    <div class="col-12 col-xl-2 form-group">
                        <validation-provider :name=" state.selectedInventory.price + '' " rules="required|excluded:0" immediate v-slot="{ errors }">
                            <label for="">単価</label>
                            <ns-number-input
                                v-model="state.selectedInventory.price"
                                />
                            <span class="validation-error">{{ errors[0] }}</span>
                        </validation-provider>
                    </div>
                    <div class="col-12 col-xl-2 form-group">
                        <label for="">金額</label>
                        <p>{{cInputTotalPrice.toLocaleString()}}</p>
                    </div>
                </div>
                <div class="row">
                    
                    <div class="col-12 text-right ">
                        <button type="button" class="btn btn-success mr-2" @click.prevent="saveRow">
                            決定
                        </button>
                        <button type="button" class="btn btn-secondary" @click.prevent="cancel">
                            キャンセル
                        </button>
                    </div>

                </div>
            </div>
            

            
        </validation-observer>

        <div id="modalMaterial"
            class="modal fade"
            tabindex="-1"
            role="dialog"
            aria-labelledby="modalMaterial"
            aria-hidden="true"
            style="margin-top: 0px;"
            v-show="isModalOpen">
            <div class="modal-dialog modal-dialog-fluid">
                <div class="modal-content">
                    <div class="app-contents-container">
                        <div class="row">
                            <div class="col-6">
                                <h4 class="modal-title">材料追加</h4>
                            </div>
                            <div class="col-6 text-right">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" class="text-white">&times;</span>
                                </button>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-12">
                                <t-ivt-material-material-table 
                                    :m-branch-id="state.params.m_branch_id"
                                    @addMaterials="addMaterials($event)"/>
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
import { computed, getCurrentInstance, reactive, ref } from 'vue';
import { useStore } from '../../stores/mainStore';
import { TIvtMaterial } from './class/models/TIvtMaterial'
import DayJsEx from '../../frameworks/DayJsEx';
import { useMasterStore } from '../../stores/masterStore';
import { MMDCustom } from './class/models/MMDCustom'
import TIvtMaterialConst from './consts/TIvtMaterialConst'
import axios from 'axios';
import { tIvtMaterialComposition } from './class/compositions/tIvtMaterialComposition';
import ArrayUtil from '../../frameworks/ArrayUtil';

const _this = getCurrentInstance()?.proxy ;
const store = useStore() ;
const masterStore = useMasterStore() ;
const {cGetMBranchName ,cGetMKvName ,formatDT,saveMulti} = tIvtMaterialComposition()

const state = reactive({
    params : {
        m_branch_id : 0,
        conducted_at : new Date(),
    },

    list : [] as TIvtMaterial[] ,

    loading : false ,
    
    selectedIndex : -1 ,
    selectedInventory : {} as TIvtMaterial|object ,

    isSuccess : false

})
const isModalOpen = ref(false) ;

//@ts-ignore
state.params.m_branch_id = store.loginMUser?.m_branch_id ;

function modalOpen () {
    $('#modalMaterial').modal() ;
    isModalOpen.value = true ;   
}

function addMaterials(mmds:Array<MMDCustom>) {
    //重複削除
    const duplicateFilterd = mmds.filter( x => state.list.find( e => e.m_material_detail_id === x.id) === undefined) ;
    //mapping
    const mapped = duplicateFilterd.map((x) => {
        const obj = {
            m_branch_id : state.params.m_branch_id ,
            conducted_at : dateFormat(state.params.conducted_at) ,
            m_material_detail_id: x.id ,
            m_material_detail: x ,
            qty : x.qty ,
            price : x.unit_price ,
            total_price : x.unit_price * x.qty! ,
            ivt_material_name : cDisplayName.value(x) ,
            supplier_m_customer_id : x.supplier_m_customer_id ,
            ivt_m_kv_id : TIvtMaterialConst.IVT_M_KV_ID_IN ,
            lot_no : undefined ,
        }
        return TIvtMaterial.parse(obj)
    })
    
    state.list.push(...mapped)

}


const cDisplayName = computed(() => (row:any) => {
    if(_.isEmpty(row)) return ''
    const name = !_.isEmpty(row.display_name) ? row.display_name : row.name ;
    return name + row.detail_name ;
})

const cInputTotalPrice = computed(() => {
    if(_.isEmpty(state.selectedInventory)) return 0 ;
    //@ts-ignore
    const total = state.selectedInventory.price * state.selectedInventory.qty ;
    //@ts-ignore
    state.selectedInventory.total_price = total
    return total
})

function dateFormat (val:Date) {
    if(_.isNil(val)) return "" ; 
    return DayJsEx.formatDate(val) ;
}

function select (row:TIvtMaterial) {
    state.selectedIndex = state.list.indexOf(row) ;
    state.selectedInventory = _.cloneDeep(row)  ;
}

async function destroy (idx:number) {
    if( idx === undefined ) return ;

    if(!confirm('削除しますか？')) return ;
    
    if(_.isNil(state.list[idx].id )) {
        state.list.splice(idx,1)
    }
    else {
        state.list[idx].deleted_at = formatDT(new Date()) ?? null ;
    }
}

function saveRow () {
    if( state.selectedIndex == -1) return ;
    //@ts-ignore
    state.list.splice(state.selectedIndex ,1 ,state.selectedInventory) ;

    cancel()
}

function cancel() {
    state.selectedIndex = -1 ;
    state.selectedInventory = {} ;
}


async function postData() {

    state.loading = true ;
    state.isSuccess = false ;
    let ep = 'api/tIvtMaterial/saveMultiRow'
    // console.log(state.list)
    try {
        const res = await saveMulti(state.list)
        ArrayUtil.resetInsert(state.list , res) ; 
        state.isSuccess = true ;
    } 
    catch (error) {
        //@ts-ignore
        _this.$$errorConsole(error, error.ep) ;
    }
    finally {
        state.loading = false ;
    }

}

</script>