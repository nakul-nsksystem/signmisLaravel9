<template>
    <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text">
                <i class="fas fa-search-plus" />
            </span>
        </div>

        <input type="text" 
            class="form-control dropdown-toggle" 
            :class="props.inputClass"
            :placeholder="props.placeholder" 
            :disabled="props.disabled"
            v-model="state.name" 
            @click.prevent="toggleList"
            @blur.prevent="blur"
            @keyup.enter.prevent.self="keyEnter"
            @keyup.up.prevent="keyUpdown(true)"
            @keyup.down.prevent="keyUpdown(false)"
        >

        <div v-if="isOpen" class="m-material-ref-input-list w-100">
            <ul class="list-group w-100 position-absolute">
                <a href="#" class="list-group-item list-group-item-action" v-for="(n, index) in state.list" :key="n.id"
                    :class="{active: currentIndex === index}"
                    @click.prevent="selectItem(n)" 
                >
                {{ n.name }}
                </a>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import Vue, { ref,computed,watch,getCurrentInstance, reactive } from 'vue';
    import { MMaterial } from '../../masters/class/models/MMaterial'
    import { MMaterialService } from '../../masters/class/services/MMaterialService';
    import axios from 'axios';

    const _this = getCurrentInstance()?.proxy ;
    
    interface IProps {
        value:number
        selectedItem?:MMaterial
        // 拠点
        mBranchId:number
        // 仕入先
        supplierMCustomerId?:number
        // カテゴリーID
        categoryMKvId?:number
        categoryMKvIds?:any
        // サブカテゴリーID
        subCategoryMKvId?:number
        // フィルターするタグキー
        filterMTagKeys?:Array<string>
        //クラス
        inputClass?:any
        //有効判定
        disabled?:boolean
        //初期値
        placeholder?:string
        // 通称表示
        isDisplayName?:boolean
    }

    const props = withDefaults(defineProps<IProps>(), {
        mBranchId : 0,
        supplierMCustomerId : 0,
        categoryMKvId : 0,
        categoryMKvIds : [],
        subCategoryMKvId : 0,
        // inputClass : {},
        disabled : false,
        placeholder : "",
        isDisplayName : false ,
    })

    interface IEmits {
        //vue3にしたらinputをupdate:modelValueに変える
        // (e: 'update:modelValue', value: number): void
        (e: 'input', value: number): void
        (e: 'update:selectedItem', value: MMaterial|undefined): void
    }

    const emit = defineEmits<IEmits>() ;

    const state = reactive({
        list : Array() ,
        localSelectedId : 0 ,
        // 入力された名前の一部
        name : ""
    })



    /**
     * propsのwatch
     */
    watch(() => props.value, (newVal, oldVal) => {

        if (newVal !== undefined) {
            if (newVal !== null) {
                if (oldVal !== undefined && oldVal !== null && newVal.toString() == oldVal.toString()) return;
                state.localSelectedId = newVal;
                
                if ( state.localSelectedId !== 0 ) {
                    getDataById() ;
                }
            } else {
                state.localSelectedId = 0;
            }

            // 入力値(name)の内容をクリア
            if (!state.localSelectedId) {
                state.name = "" ;
            }
        }
        
    },{immediate:true})

    watch(() => props.mBranchId, (newVal, oldVal) => {

        if (newVal !== undefined) {
            if (oldVal !== undefined && oldVal != 0) {
                emitItem(undefined) ; 
            }
        }
            
    },{immediate:true})

    watch(() => props.supplierMCustomerId, (newVal, oldVal) => {

        if (newVal !== undefined) {
            if (oldVal !== undefined && oldVal != 0) {
                emitItem(undefined) ; 
            }
        }
        
    },{immediate:true})


    watch(() => props.categoryMKvId, (newVal, oldVal) => {

        if (newVal !== undefined) {
            if (oldVal !== undefined && oldVal != 0) {
                emitItem(undefined) ; 
            }
        }

    },{immediate:true})

    watch(() => props.subCategoryMKvId, (newVal, oldVal) => {

        if (newVal !== undefined) {
            if (oldVal !== undefined && oldVal != 0) {
                emitItem(undefined) ; 
            }
        }

    },{immediate:true})



    /**
     * 検索ボックス・サジェスト選択処理
     */

    // ListOpenしてるかどうか
    const isOpen = ref(false) ;
    
    // 上下キー用
    const currentIndex = ref(-1) ;

    // Pgから入力された場合イベントキャンセル用
    let isSetNameFromPg = ref(false) ; 
    // // 入力された名前の一部
    // const name = ref("") ;


    watch( async () => state.name,() => {
        getData();
    })
    watch(() => isOpen.value,(val)=> {
        if (!val) {
            isSetNameFromPg.value = false ;
            currentIndex.value = -1 ;
        }
    })

    const cSelectedIndex = computed(() => {
        if (currentIndex.value < -1 || state.list.length === 0) {
            return -1 ;
        } else if (currentIndex.value >= state.list.length) {
            return currentIndex.value  = state.list.length - 1 ;
        } else {
            return currentIndex.value ;
        }
    })

    //サジェスト表示
    function toggleList  () {
        if (! state.name) return ;
        isOpen.value = ! isOpen.value ;
    } 

    //focus外し
    function blur  () {
        setTimeout(() => {
            isOpen.value = false ;
        } , 300) ;
    } 
    function keyUpdown (isUp:boolean) {
        if (!isOpen.value) return ;

        currentIndex.value += isUp ? -1 : +1 ;
        currentIndex.value = cSelectedIndex.value ;
        //console.log("dCurrentIndex = " + this.dCurrentIndex + " cSelectedIndex = " + this.cSelectedIndex) ;
    } 
    function keyEnter () {
        if (cSelectedIndex.value !== -1) {
            // 決定
            selectItemByIndex(cSelectedIndex.value) ;
        }
    } 

    function selectItemByIndex (index:number) {
        selectItem(state.list[index]) ;
    } 
    function selectItem (item:MMaterial|undefined) {

        if(item !== undefined) {
            currentIndex.value = state.list.indexOf(item) ;
            isSetNameFromPg.value = true;
            // 名称
            //@ts-ignore
            state.name = item.name ;
        }

        isOpen.value = false ;

        emitItem(item) ;
    } 



    /**
     * サジェストDB検索処理
     */

    // 連続入力された場合のCancelToken
    let cancelSource:any = false ;

    //検索条件
    const cConditions = computed(() => {
        const conditions = {
            name : "" ,
            display_name : "" ,
            m_branch_id:props.mBranchId,
            supplier_m_customer_id:props.supplierMCustomerId ,
            category_m_kv_id:props.categoryMKvId,
            category_m_kv_ids:props.categoryMKvIds,
            sub_category_m_kv_id:props.subCategoryMKvId,
            tagKeys:props.filterMTagKeys
        }

        props.isDisplayName ? conditions.display_name = state.name : conditions.name = state.name 
        
        return conditions
    })

    //サジェスト検索
    async function getData () {
        cancelRequest() ;

        if (!state.name || isSetNameFromPg.value) {
            // console.log("not req")
            isSetNameFromPg.value = false ;
            isOpen.value = false ;
            state.list.splice(0) ;

            if (!state.name) {
                // 未入力時は0にする
                selectItem(undefined) ;
            }
        } else {
            // console.log("req")

            currentIndex.value = -1 ;
            let ep = 'api/mMaterial/retrieveWithDetails'

            try {
                const res = await axios.post(ep ,cConditions.value, {
                    cancelToken: new axios.CancelToken(function executor(c) {
                        // console.log("cancel req")
                        cancelSource = c ;
                    }) ,
                });
                
                isOpen.value = res.data.length !== 0;
                state.list = res.data;
            } catch (error:any) {
                // handle error
                if (axios.isCancel(error)) {
                    console.log('Request canceled', error.message) ;
                } else {
                    //@ts-ignore
                    _this.$$errorConsole(error, ep) ;
                }                    
            }
        }
    }

    //最初からId設定されていた時
    async function getDataById () {

        try {
            const row = await MMaterialService.getById(state.localSelectedId)
            emitItem(row) ;
        }
        catch (error) {
            //@ts-ignore
            _this.$$errorConsole(error, this.cGetCustomerEp) ;
        }
    } 
    
    function cancelRequest () {
        if (cancelSource !== false) cancelSource;
    } 


    /**
     * emit処理
     */
    function emitItem (item:MMaterial|undefined) {

        let id ;
        if(item !== undefined) {
            
            if (state.name != (item.name ?? "") ){
                isSetNameFromPg.value = true ;
            }
            state.name = item.name ?? "";

            id = item.id ?? 0 ;

        } else {
            id = 0
        }

        // emit('update:value', id) ;
        emit('input', id) ;
        emit('update:selectedItem', item) ;
        
    } 
 
    
</script>
<style scoped>
.m-material-ref-input-list {
    z-index: 10001 ;
}
.input-group-text {
    background-color: white ;
}
.list-group-item{
    color: black !important;
}
</style>