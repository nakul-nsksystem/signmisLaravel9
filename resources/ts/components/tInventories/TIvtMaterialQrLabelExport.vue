<template>
    <div>
        <div class="row mb-2">
            <contents-header-left></contents-header-left>
            <contents-header-right>
                <div>
                    <button type="button" class="btn btn-success" @click.prevent="createQrLabel" :disabled="state.loading">
                        <i class="fas fa-table fa-fw"></i>
                        発行
                    </button>
                </div>    
            </contents-header-right>            
        </div>
        <div v-if="$$cIsError" class="alert alert-danger" role="alert">
            {{dErrorData.message}}
        </div>  
        <div>
            <div class="app-contents-container mt-3">   
                <div class="row">
                    <div class="col-12 col-xl-6 form-group">
                        <label>オフセット数</label>
                        <ns-number-input
                            v-model="params.offset"
                            class="app-input-size"
                            />
                    </div>
                    <div class="col-12 col-xl-6 text-right">
                        <div class="form-group">
                            <label class="invisible">label</label>
                            <div>
                                <button type="button" class="btn btn-primary" @click.prevent="openModal('order')" :disabled="state.loading">
                                    <i class="fas fa-plus fa-fw"></i>
                                    発注追加
                                </button>
                                <button type="button" class="btn btn-primary" @click.prevent="openModal('material')" :disabled="state.loading">
                                    <i class="fas fa-plus fa-fw"></i>
                                    材料追加
                                </button>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div class="table-responsive">
                            <table class="table table-striped table-dark text-nowrap">
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>発注No.</th>
                                        <th>材料CD</th>
                                        <th>名称</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr 
                                        v-for="(n,index) in params.exList" :key="index"
                                        :class="{ 'dark-selected':dragItems.dragOverIdx == index}"
                                        draggable
                                        @dragstart="dragStart($event,n)"
                                        @dragover.prevent
                                        @dragenter.prevent="dragEnter(index)"
                                        @drop="drop(index)" 
                                        @dragend="dragEnd()"
                                        >
                                        <td>{{ index + 1 }}</td>
                                        <td>
                                            <div v-if="n.t_p_order_detail_id"> 
                                                {{ `${n.t_p_order_id}-${n.t_p_order_detail_id}` }}
                                            </div>
                                        </td>
                                        <td>{{ n.material_cd }}</td>
                                        <td>{{ n.name }}</td>
                                        <td class="text-right">
                                            <button type="button" class="btn btn-info" @click.prevent="copy(n)">
                                                <i class="fas fa-copy fa-fw" />                            
                                            </button>
                                            <button type="button" class="btn btn-danger" @click.prevent="destroy(index)">
                                                <i class="fas fa-trash fa-fw" />                            
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
                
            <div class="modal fade" 
                id="orderModal" 
                tabindex="-1" 
                role="dialog" 
                data-backdrop="static"
                style="margin-top: 0px;">
                <div class="modal-dialog modal-dialog-fluid" role="document">
                    <div class="app-modal-content-dark" >
                        
                        <div class="modal-body">
                            <t-ivt-material-header-component
                                v-model="conditions"
                                :isLoading="state.isLoading"
                                :viewMode="state.viewMode"
                                @search="search()"
                                />
                            <t-inventory-arrival-list
                                v-model="state.orderList"
                                ref="arrivalList"
                                :conditions="conditions" 
                                class="pt-3"
                                @error="$$errorConsole($event ,$event.ep) ;"
                                />
                        </div>
                        <div class="p-3">
                            <div class="modal-footer pr-0">
                                <ns-checkbox-input
                                    class="ml-2"
                                    :id="'isAddQty'"
                                    :label="'発注数量分QRを作成する'"
                                    v-model="state.isAddQty" />
                                <button type="button" class="btn btn-primary" @click.prevent="addByOrder()">追加</button>
                                <button type="button" class="btn btn-light" @click.prevent="closeModal('order')">閉じる</button>
                            </div>
                            <div v-show="!_.isEmpty(state.addedNames)" class="alert alert-success mb-2" role="alert">
                                <div v-for="(n,index) in state.addedNames" :key="index">{{ n }}</div>
                                <div>を追加しました</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" 
                id="materialModal" 
                tabindex="-1" 
                role="dialog" 
                data-backdrop="static"
                style="margin-top: 0px;">
                <div class="modal-dialog modal-dialog-fluid" role="document">
                    <div class="app-modal-content-dark" >
                        <div class="modal-body">
                            <t-ivt-material-m-material-list 
                                v-model="state.materialList"/>
                        </div>
                        <div class="p-3">
                            <div class="modal-footer pr-0">
                                <button type="button" class="btn btn-primary" @click.prevent="addByMaterial()">追加</button>
                                <button type="button" class="btn btn-light" @click.prevent="closeModal('material')">閉じる</button>
                            </div>
                            <div v-show="!_.isEmpty(state.addedNames)" class="alert alert-success mb-2" role="alert">
                                <div v-for="(n,index) in state.addedNames" :key="index">{{ n }}</div>
                                <div>を追加しました</div>
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

<script lang="ts" setup>
import { computed, getCurrentInstance, reactive, ref } from 'vue';
import { useStore } from '../../stores/mainStore';
import _ from 'lodash';
import axios from 'axios';
//@ts-ignore
import TInventoryArrivalList from './components/TInventoryArrivalList.vue'
import { ArrivalListRow } from './class/compositions/tIvtMaterialComposition';
import NsCheckboxInput from '../commons/input/NsCheckboxInput.vue';
const _this = getCurrentInstance()?.proxy ;

const store = useStore()
//検索条件
const conditions = reactive({
    m_branch_id            : store.loginMUser?.m_branch_id ,
    m_material_detail_id   : 0,
    m_material_id          : 0,
    category_m_kv_id       : 0,
    ivt_material_name      : "",
    supplier_m_customer_id : 0,
    is_ivt_in              : false
}) ;

const state = reactive({
    isLoading : false ,
    viewMode : "arrival",
    orderList : [] as ArrivalListRow[] ,
    materialList : [] as any[] ,
    addedNames : [] as string[] ,
    isAddQty : true 
})


type TpExList = {
    idx?:number
    t_p_order_id? : number ,
    t_p_order_detail_id? : number ,
    label_no:string
    m_material_detail_id : number ,
    material_cd : string ,
    name : string
}

//postするデータ
const params = reactive({
    offset : 0 ,
    exList : [] as TpExList[] ,
})


async function createQrLabel () {

    if(_.isEmpty(params.exList)) return ;

    let ep = 'api/tIvtMaterial/createQrLabel' 
    
    try {
        
        if(store.isDebug) {
            const res = await axios.post(`${ep}/view`, params) ;
            const newTab = window.open();
            newTab!.document.write(res.data.html);
        }
        else {
            const res = await axios.post(ep, params, {responseType: 'blob'}) ;
            const blob = new Blob([res.data], {type : "application/pdf"});
            const link =  window.URL.createObjectURL(blob) ;
            window.open(link, '_blank') ;
        }
        
        
    }
    catch(error) {
        //@ts-ignore
        _this.$$errorConsole(error ,ep)   
    }
    
}


const arrivalList = ref() ;

async function search(){
    state.isLoading = true ;
    await arrivalList.value._setupState.search() ;
    state.isLoading = false ;
}

function openModal(type:'order|material') {
    $(`#${type}Modal`).modal() ;
}
function closeModal(type:'order|material') {
    state.addedNames.splice(0) ;
    $(`#${type}Modal`).modal("hide") ;
}
function addByOrder() {

    const filterd = state.orderList.filter(x => x.isChecked) ;
    
    for(const x of filterd) {

        //発注数量分追加する
        if(state.isAddQty) {
            for(let i = 1; i <= x.po_qty; i++) {

                const obj : TpExList = {
                    t_p_order_id : x.t_p_order_id ,
                    t_p_order_detail_id : x.id ,
                    m_material_detail_id : x.m_material_detail_id ,
                    material_cd : x.material_cd ,
                    name : x.po_material_name , 
                    label_no : "" ,
                }
                params.exList.push(obj) ;
            }
        }
        else {
            
            const obj : TpExList = {
                t_p_order_id : x.t_p_order_id ,
                t_p_order_detail_id : x.id ,
                m_material_detail_id : x.m_material_detail_id ,
                material_cd : x.material_cd ,
                name : x.display_name , 
                label_no : "" ,
            }
            params.exList.push(obj) ; 
        }
        
        state.addedNames.push(x.po_material_name) ;
    }

}

function addByMaterial() {

    const filterd = state.materialList.filter(x => x.isChecked) ;
    
    for(const x of filterd) {

        const name = x.display_name ?? x.name ;

        const obj : TpExList = {
            m_material_detail_id : x.id! ,
            material_cd : x.cd ,
            name : `${name}${x.detail_name}` ,
            label_no : "" ,
        }
        params.exList.push(obj) ;
        state.addedNames.push(`${name}${x.detail_name}`) ;
    }

}


function copy(row:TpExList) {
    const idx = params.exList.indexOf(row) ;
    const copy = _.cloneDeep(row) ;
    
    if(idx == -1) {
        params.exList.push(copy) ;
    }
    else {
        params.exList.splice(idx ,0 ,copy)
    }
}

function destroy(idx:number) {

    if(confirm('削除します。よろしいですか？')) {
        params.exList.splice(idx,1) 
    }
}

const dragItems = reactive({
    row : {} as TpExList ,
    dragOverIdx : -1 
})

//並び替え
function dragStart  (event:any,dragItem:TpExList) {
    event.dataTransfer.effectAllowed = 'move' ;
    event.dataTransfer.dropEffect = 'move' ;
    dragItems.row = dragItem ; 
}  
function dragEnter (index:number){
    dragItems.dragOverIdx = index ;
} 
function drop (index:number) {

    const foundIdx = params.exList.indexOf(dragItems.row) ;

    if(foundIdx === index) return ;

    if(foundIdx !== -1) {
        params.exList.splice(foundIdx,1) ;
        params.exList.splice(index,0,dragItems.row) ;                
    }

} 
function dragEnd (){
    dragItems.row = {} as TpExList ; 
    dragItems.dragOverIdx = -1 ;
} 

</script>