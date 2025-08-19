<template>
    <div class="bg-app-secondaly p-3">
        <div class="row">
            <div class="col-12 col-xl-6">
                <div class="card bg-dark p-2">
                    <div class="row">
                        <div class="col-12">
                            <img-trim-component
                                v-model="state.file"
                                :url.sync="state.url"
                                :img="originImg"
                                ref="trimComponent"
                                />
                        </div>
                        <div class="col-12">
                            <label for="file_upload" class="btn btn-outline-light">
                                ファイルを選択
                                <input
                                    type="file"
                                    style="display:none;"
                                    ref="inputFile"
                                    id="file_upload"
                                    @change="change"
                                    >
                            </label>
                        </div>
                        <div class="col-12" v-show="state.url !== ''">
                            <img :src="state.url">
                        </div>
                        <div class="col-12">
                            <div v-for="str in imgSelectRes">
                                <p>{{str}}</p>
                            </div>
                        </div>
                        <div class="col-12 text-right mt-3">
                            <button type="button" class="btn btn-primary" @click.prevent="postApi(true)">決定</button>
                        </div>
                    </div>
                    
                </div>
            </div>
            
            <div class="col-12 col-xl-6">
                <div class="card bg-dark p-2">
                    <ocr-cam-component
                        v-model="state.pic"
                        class="mb-3"
                        @takePic='takePic($event)'
                        />
                    <div v-for="str in camRes">
                        <p>{{str}}</p>
                    </div>
                </div>
            </div>
        </div> 
    </div>
</template>


<script setup lang='ts'>
import axios from 'axios';
import _ from 'lodash';
import { computed, getCurrentInstance, reactive,ref } from "vue";
import ArrayUtil from "../../frameworks/ArrayUtil";
import NumberUtil from '../../frameworks/NumberUtil';
import { MsCvService } from '../../components/commons/services/msCvService'

const _this = getCurrentInstance()?.proxy ;

const state = reactive<{
    url:string ,
    file:any ,
    pic:any ,
}>({
    url  : '',
    file : undefined,
    pic  : undefined ,
})

const imgSelectRes = ref<Array<string>> ([]) ;
const inputFile = ref<HTMLInputElement|null>(null) ; 
const trimComponent = ref<any>() ; 
const accept = ".jpg,.gif,.png,webp,image/gif,image/jpeg,image/png,image/webp" ;
const originImg = ref<HTMLImageElement|undefined>(undefined)
function change () {
    //@ts-ignore
    const image = new Image();
    //@ts-ignore
    image.src = URL.createObjectURL(inputFile.value.files[0]);
    image.onload = function() {
        trimComponent.value._setupProxy.setCanvSize(image.naturalWidth,image.naturalHeight)
    }
    originImg.value = image;


}

const camRes = ref<Array<string>> ([]) ;
function takePic(pic:any) {
    state.pic = pic ;
    // console.log(pic)
    postApi(false) ;
}

async function postApi (isImgSelect:boolean) {

    const file = isImgSelect ? state.file : state.pic ;

    if(_.isNil(file)) {
        alert('noimage') ; 
        return
    }

    let ep = 'api/msCv/analyze' ;

    try {
        const res = await MsCvService.postOcrApi(file) ;
        isImgSelect ? imgSelectRes.value = res : camRes.value = res ; 
    } 
    catch (error) {
        //@ts-ignore
        _this.$$errorConsole(error ,ep) ;
    }
    
}

</script>