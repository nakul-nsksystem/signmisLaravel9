<template>
    <div>
        <div class="row">
            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label for="inputMBranchId">拠点</label>
                    <m-branch-select 
                        v-model="conditions.m_material.m_branch_id" 
                        />
                </div>
            </div>
            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label for="inputCategoryMKvId">カテゴリ</label>
                    <m-kv-select
                        id="inputCategoryMKvId"
                        :selected-item.sync="state.selectedCategoryMKv"
                        :kv-key="'m_materials-category_m_kv_id'"
                        v-model="conditions.m_material.category_m_kv_id"
                        />
                </div>
            </div>
            <div class="col-12 col-xl-2 pl-xl-0">
                <div class="form-group">
                    <label for="inputSubCategoryMKvId">サブカテゴリ</label>
                    <m-kv-select
                        id="inputSubCategoryMKvId"
                        :kv-category-id="cTargetCategoryId"
                        v-model="conditions.m_material.sub_category_m_kv_id"
                        />
                </div>
            </div>
            <div class="col-12 col-xl-3 pl-xl-0">
                <div class="form-group">
                    <label for="inputMBranchId">仕入先</label>
                    <m-customer-ref-input
                        v-model="conditions.m_material.supplier_m_customer_id"
                        :mBranchId="conditions.m_branch_id"
                        :dealing-cds="[2]"
                        />
                </div>
            </div>
            <div class="col-12 col-xl-3 pl-xl-0">
                <div class="form-group">
                    <label for="purchaseOrderMemo">名称</label>
                    <input v-model="conditions.m_material.name" class="form-control" aria-label="With textarea">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 pl-xl-0">
                <div class="text-right">
                    <button type="button" class="btn btn-success w-auto" @click.prevent="search()" :disabled="state.loading">
                        <div v-if="state.loading">
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            検索中...
                        </div>
                        <div v-else>
                            <i class="fas fa-search fa-fw"></i>
                            検索
                        </div>
                    </button>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 pt-3">
                <div class="table-responsive">
                    <table class="table table-striped table-dark">
                        <thead>
                            <tr class="text-nowrap" >
                                <th></th>
                                <th>名称</th>
                                <th>拠点</th>
                                <th>仕入先</th>
                                <th class="text-right">内容数</th>
                                <th>数量</th>
                                <th>在庫単位</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="n in props.value" :key="n.id">
                                <td>
                                    <ns-checkbox-input
                                        v-model="n.isChecked"
                                        :id="`materialCheckbox${n.id}`"
                                        />
                                </td>
                                <td>{{cDisplayName(n)}}</td>
                                <td class="text-nowrap">{{ n.m_branches_short_name }}</td>
                                <td class="text-nowrap">{{ n.m_customers_name }}</td>
                                <td class="text-nowrap text-right">{{ cToNumber(n.contents_qty) }}</td>
                                <td>
                                    <ns-number-input
                                        class="app-input-size"
                                        v-model="n.qty"
                                        />
                                </td>
                                <td>{{cDisplayMaterialIvtDiv(n.ivt_div_m_kv_id,n.unit_m_kv_id)}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <pagination
            :p-pagination.sync="state.pagination"
            @search="search($event)"
            />   
    </div>


</template>

<script lang="ts" setup>
import _ from "lodash" ; 
import Vue, { computed, getCurrentInstance, reactive } from 'vue'
import axios from 'axios'
import { useMasterStore } from "../../../stores/masterStore";
import NumberUtil from "../../../frameworks/NumberUtil" ;
import DayJsEx from "../../../frameworks/DayJsEx" ;
import { MKv } from "../../masters/class/models/MKv";
import { MMaterial } from "../../masters/class/models/MMaterial";
import { MMaterialDetail } from "../../masters/class/models/MMaterialDetail";
import { tIvtMaterialComposition } from "../class/compositions/tIvtMaterialComposition";
import { useStore } from "../../../stores/mainStore";

    const _this = getCurrentInstance()?.proxy
    const masterStore = useMasterStore() ;
    const store = useStore() ;
    const { cDisplayMaterialIvtDiv } = tIvtMaterialComposition()

    interface IProps {
        value : any[]
    }

    const props = withDefaults(defineProps<IProps>(), {})

    interface IEmits {
        (e: 'input', value:any[]): void
    }   
    const emit = defineEmits<IEmits>() ;

    const state = reactive({
        loading : false ,
        selectedCategoryMKv : {} as MKv ,
        pagination : {                         // pagination
            links : [] ,                        // リンク
            total : -1 ,                        // 合計件数
            from : -1 ,                         // 現在ページの開始位置
            to : -1 ,                           // 現在ページの終了位置
        } ,

    })
    
    const conditions = reactive({
        m_material : {
            cd : null ,                     // コード
            name : null ,                   // 名称
            display_name : null ,           // 通称
            m_branch_id : 0 ,               // 拠点id
            supplier_m_customer_id : 0 ,    // 仕入先id
            category_m_kv_id : 0 ,          // カテゴリ
            sub_category_m_kv_id : 0 ,      // サブカテゴリ
            is_stocked : 1 ,
        } ,
        detail_name : null ,                // 詳細名
        description : null ,                // 用途・説明
    })
    const cTargetCategoryId = computed(() => state.selectedCategoryMKv?.target_m_kv_category_id ?? 0 ) 

    const cToNumber = computed(() => (val:number) => NumberUtil.formatZeroSuppress(val)) ;

    const cDisplayName = computed(() => (row:any) => {
        const name = !_.isEmpty(row.display_name) ? row.display_name : row.name ;
        return name + ' ' + row.detail_name ;
    })
    
    async function search (url:string|undefined = undefined) {
        state.loading = true ;

        const getParams = _.cloneDeep(conditions) ;
        
        let ep = (url? url : `api/mMaterialDetail/retrieveWithParent` ) ;

        try{
            const res = await axios.post(ep, getParams) ; 

            // pagination関連
            state.pagination.links = res.data.links ;   // リンク
            state.pagination.total = res.data.total ;   // 合計件数
            state.pagination.from  = res.data.from ;    // 現在ページの開始位置
            state.pagination.to    = res.data.to ;      // 現在ページの終了位
            
            for(const row of res.data.data ) {
                row.isChecked = false ;
            }

            emit('input',res.data.data)

        } catch(error) {
            // handle error
            //@ts-ignore
            _this.$$errorConsole(error, ep) ; 
        
        } finally {
            state.loading = false ;
        }
    }

    function init() {
        conditions.detail_name = null ;
        conditions.description = null ;
        conditions.m_material.cd = null ;
        conditions.m_material.name = null ;
        conditions.m_material.display_name = null ;
        conditions.m_material.m_branch_id = store.loginMUser?.m_branch_id ?? 0 ;
        conditions.m_material.supplier_m_customer_id = 0 ;
        conditions.m_material.category_m_kv_id = 0 ;
        conditions.m_material.sub_category_m_kv_id = 0 ;
        conditions.m_material.is_stocked = 1 ;
    }

    init() ;

</script>