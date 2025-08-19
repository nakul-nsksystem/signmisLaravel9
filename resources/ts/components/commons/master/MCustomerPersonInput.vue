<template>
    <div class="input-group">
        <input type="text"
            class="form-control"
            aria-label="Text input with dropdown button"
            v-model="cValue"
            :disabled="props.disabled"
            :placeholder="props.placeholder"
            @blur.prevent="blurInput"
            @keyup.enter.prevent.self="keyEnter"
            @keyup.up.prevent="keyUpdown(true)"
            @keyup.down.prevent="keyUpdown(false)">
        <div class="input-group-append">
            <button
                type="button"
                class="btn btn-light dropdown-toggle dropdown-toggle-split"
                :disabled="props.disabled"
                @click.prevent="onButton()"
                @blur.prevent="blurButton"
                @keyup.enter.prevent.self="keyEnterB"
                @keyup.up.prevent="KeyUpdownB(true)"
                @keyup.down.prevent="KeyUpdownB(false)"
                ></button>
        </div>

        <div v-if="cIsOpen" class="input-list w-100">
            <ul class="list-group w-100 position-absolute">
                <a class="list-group-item list-group-item-action"
                    v-for="(n,index) in state.list"
                    :class="{active: state.currentIndex === index}"
                    @mouseover.prevent="state.isSelecting=true"
                    @mouseleave.prevent="state.isSelecting=false"
                    @click.prevent="selected(n)">
                    {{n.name}}
                </a>
            </ul>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref,computed,watch,getCurrentInstance, reactive } from 'vue'
import axios from 'axios' ;
import _ from 'lodash' ;

    const _this = getCurrentInstance()?.proxy ;

    interface IProps {
        //名前
        value?:string
        email?:string
        selectedItem?:object
        mCustomerId:number

        //有効判定
        disabled?:boolean
        //初期値
        placeholder?:string

    }

    const props = withDefaults(defineProps<IProps>(), {
        value : "",
        mBranchId : 0,
        email : undefined ,
        selectedItem : undefined ,
        mCustomerId : 0,
        disabled : false,
        placeholder : "入力または選択",
    })

    interface IEmits {
        //vue3にしたらinputをupdate:modelValueに変える
        (e: 'input', value:string): void
        (e: 'update:email', value: string): void
        (e: 'update:selectedItem', value: any): void
    }

    const emit = defineEmits<IEmits>() ;


    
    const state = reactive({
        //customer_personsのデータ
        list : Array() ,
        //選択肢表示
        isDisplay : false ,
        //選択中のindex
        currentIndex : -1 ,

        isButtonFocus : false ,
        isInputFocus  : false ,

        isSelecting : false ,
        tabindex : 0 ,
        
    })

    watch(() => props.mCustomerId, (newVal, oldVal) => {
        if ( newVal !== undefined && newVal != 0) {
            getData(newVal) ;
        }
        else {
            state.list = [] ;
        }
    },{immediate:true}) ;

    //input
    const cValue = computed({
        get : () => props.value ,
        set : (value:string) => emit('input',value)
    })

    //選択中のindex
    const cSelectedIndex = computed(() => {
        if (state.currentIndex < -1 || state.list.length === 0) {
            return -1 ;
        } else if (state.currentIndex >= state.list.length) {
            return state.currentIndex  = state.list.length - 1 ;
        } else {
            return state.currentIndex ;
        }
    })

    //db接続
    async function getData (id:number) {
        let ep = `api/mCustomerPerson/findByMCustomerId/${id}` ;
        try {
            const res = await axios.get(ep) ;
            state.list = res.data ;
        }
        catch (error ) {
            //@ts-ignore
            _this.$$errorConsole(error ,ep) ;
            state.list = [] ;
        }
    }

    //リストから選択　
    function selected(row:any){
        if(_.isEmpty(row)) return ;
        //メールや担当者名は2次加工するのでディープコピーする
        const copied = _.cloneDeep(row)
        emit('input',copied.name) ;
        emit('update:email',copied.email) ;
        emit('update:selectedItem',row) ;
        hide() ;

    }

    const cIsOpen = computed(() => {
        return state.isButtonFocus || state.isInputFocus || state.isSelecting
    })

    //プルダウンボタンクリック
    function onButton() {
        state.isButtonFocus = !state.isButtonFocus ;
    }

    //focus外し
    function blurInput  () {
        state.isInputFocus = false ;
    }
    function blurButton  () {
        state.isButtonFocus = false ;
    }

    //キーボード操作
    function keyUpdown (isUp:boolean) {
        //非表示時↓キーでリスト表示
        if (!state.isInputFocus && !isUp) {
            state.isInputFocus = true ;
        }

        state.currentIndex += isUp ? -1 : +1 ;
        state.currentIndex = cSelectedIndex.value ;
    }
    //エンター
    function keyEnter () {
        if (cSelectedIndex.value !== -1) {
            selected(state.list[cSelectedIndex.value]) ;
        } else {
            hide() ;
        }
    }

    //ボタン時のキーボード操作
    function KeyUpdownB (isUp:boolean) {
        if (!state.isButtonFocus) return ;
        state.currentIndex += isUp ? -1 : +1 ;
        state.currentIndex = cSelectedIndex.value ;
    }
    //エンターボタン
    function keyEnterB () {
        if (cSelectedIndex.value !== -1) {
            selected(state.list[cSelectedIndex.value]) ;
        } 
    }

    //リスト閉じる
    function hide () {
        // state.isDisplay = false ;
        blurInput() ;
        blurButton() ;
        state.currentIndex = -1 ;
        state.isSelecting = false ;
    }

</script>
<style scoped>
    .input-list {
        z-index: 10001 ;
    }
    .input-group-text {
        background-color: white ;
    }
    .list-group-item{
        color: black !important;
    }
</style>