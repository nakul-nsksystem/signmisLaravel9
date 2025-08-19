<template>
    <div>
        <div class="row">
            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label for="inputMBranchId">拠点</label>
                    <m-branch-select 
                        v-model="props.value.m_branch_id" 
                        />
                </div>
            </div>
            <div class="col-12 col-xl-3 pl-xl-0" v-if="props.viewMode === 'arrival'">                    
                <div class="form-group">
                    <label>発注日</label>
                    <div class="d-flex flex-no-wrap">
                        <ex-v-date-picker 
                            readonly
                            aria-readonly="true"
                            v-model="props.value.order_date_from" />
                        <span class="px-2 pt-2">～</span>
                        <ex-v-date-picker 
                            readonly
                            aria-readonly="true"
                            v-model="props.value.order_date_to" />
                    </div>
                </div>    
            </div>
            <div class="col-12 col-xl-3 pl-xl-0" v-else>                    
                <div class="form-group">
                    <label>日付</label>
                    <div class="d-flex flex-no-wrap">
                        <ex-v-date-picker 
                            readonly
                            aria-readonly="true"
                            v-model="props.value.conducted_at" />
                    </div>
                </div>    
            </div>
            <div class="col-12 col-xl-3 pl-xl-0" v-if="props.viewMode === 'arrival'">                    
                <div class="form-group">
                    <label>納期</label>
                    <div class="d-flex flex-no-wrap">
                        <ex-v-date-picker 
                            readonly
                            aria-readonly="true"
                            v-model="props.value.due_date_from" />
                        <span class="px-2 pt-2">～</span>
                        <ex-v-date-picker 
                            readonly
                            aria-readonly="true"
                            v-model="props.value.due_date_to" />
                    </div>
                </div>    
            </div>
        </div>
        <div class="row">
            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label>材料カテゴリ</label>
                    <m-kv-select
                        v-model="props.value.category_m_kv_id"
                        :selected-item.sync="state.selectedCatMKv"
                        :kv-key="'m_materials-category_m_kv_id'"
                        />
                </div>
            </div>
            <div class="col-12 col-xl-2 pl-xl-0">
                <div class="form-group">
                    <label>材料サブカテゴリ</label>
                    <m-kv-select
                        :kv-category-id="state.selectedCatMKv?.target_m_kv_category_id ?? 0"
                        v-model="props.value.sub_category_m_kv_id"
                        />
                </div>
            </div>
            <div class="col-12 col-xl-3 pl-xl-0">
                <div class="form-group">
                    <label>材料名</label>
                    <input class="form-control" v-model="props.value.ivt_material_name">
                </div>
            </div>
            <div class="col-12 col-xl-3 pl-xl-0">
                <div class="form-group">
                    <label>仕入先</label>
                    <m-customer-ref-input 
                        v-model="props.value.supplier_m_customer_id"
                        :mBranchId="props.value.m_branch_id"
                        :dealing-cds="[2]"
                        />
                </div>
            </div>
            <div class="col-12 col-xl-1 pl-xl-0" v-show="props.viewMode === 'arrival'">
                <div class="form-group">
                    <label for="IsIvtIn">入庫済を含む</label>
                    <ns-checkbox-input
                        v-model="props.value.is_ivt_in"
                        :id="'IsIvtIn'"
                        />
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 text-right">
                <button type="button" :disabled="props.isLoading" class="btn btn-success" @click.prevent="emit('search')">
                    <div v-if="props.isLoading">
                        <span class="spinner-border spinner-border-sm" role="status" />
                        検索中...
                    </div>
                    <div v-else>
                        <i class="fas fa-search fa-fw" />
                        検索
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, getCurrentInstance, reactive, ref } from 'vue';
import { SearchParams } from '../class/compositions/tIvtMaterialComposition';

interface IProps {
    value:SearchParams
    isLoading:boolean
    viewMode:string
}

const props = withDefaults(defineProps<IProps>(), {})

interface IEmits {
    // (e: 'updateIvtIns', value: TIvtMaterial): void
    (e: 'search'): void
}
const emit = defineEmits<IEmits>() ;


const state = reactive({
    selectedCatMKv : {}
})


</script>