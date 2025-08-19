<template>
    <div>        

        <div v-if="m$cIsError" class="alert alert-danger" role="alert">
            {{dErrorData.message}}
        </div>
        <div v-if="dIsSuccess" class="alert alert-success" role="alert">
            保存しました
        </div>
        <div class="row" v-if="m$cIsShow">
            <div class="col-12 col-xl-3">
                <form>
                    <div class="form-group">
                        <label class="w-100" >サムネイル</label>
                        <ns-image-select 
                            :url.sync="cThumbnailPath" 
                            :file.sync="dFile"
                            :is-changed.sync="dIsChangedThumbnail"
                            accept=".jpg,.gif,.png,image/gif,image/jpeg,image/png"

                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="inputOrderNo">表示順</label>
                        <input v-model="dValue.order_no" class="form-control" id="inputOrderNo"  >
                    </div>
                    <div class="form-group">
                        <label for="inputCd">コード</label>
                        <input v-model="dValue.cd" class="form-control" id="inputCd"  >                
                    </div>
                    <div class="form-group">
                        <label for="">拠点</label>
                        <m-branch-select 
                            v-model="dValue.m_branch_id" />                
                    </div>
                    
                    <div class="form-group">
                        <label for="">外注先</label>
                        <m-customer-select
                            :m-branch-id="dValue.m_branch_id"
                            :dealing-cds="[4]"
                            :selectedId.sync="dValue.m_customer_id"
                            v-model="dValue.m_customer_id"
                        ></m-customer-select>
                    </div>


                        

                    <div class="form-group">
                        <label for="">名称</label>
                        <input v-model="dValue.name" class="form-control" id="inputName">                
                    </div>
                    <div class="form-group">
                        <label for="">生産管理対象</label>
                        <ns-checkbox-input
                            v-model="dValue.is_production_target"
                            :id="'MProductionEditIsProductionTarget'"
                            />
                    </div>
                    <div class="form-group">
                        <label for="">準備秒数</label>
                        <ns-number-input v-model="dValue.prepare_sec" class="form-control" />                
                    </div>
                    <div class="form-group">
                        <label for="">原価/h</label>
                        <ns-number-input v-model="dValue.cost_per_hour" class="form-control" />                
                    </div>
                    
                    <div class="form-group">
                        <label for="">カラーインク原価/㎡</label>
                        <ns-number-input v-model="dValue.color_ink_cost_per_sqm" class="form-control" />                
                    </div>

                    <div class="form-group">
                        <label for="">白インク原価/㎡</label>
                        <ns-number-input v-model="dValue.white_ink_cost_per_sqm" class="form-control" />                
                    </div>

                    <div class="form-group">
                        <label for="">ニス原価/㎡</label>
                        <ns-number-input v-model="dValue.varnish_ink_cost_per_sqm" class="form-control" />                
                    </div>


                    <div v-if="cIsModeEditing" class="alert alert-warning" role="alert">
                        モードの編集を完了してください。
                    </div>
                    <div v-if="cIsOptionEditing" class="alert alert-warning" role="alert">
                        オプションの編集を完了してください。
                    </div>

                    <button type="submit" 
                        class="btn btn-success" 
                        :disabled="cIsModeEditing || cIsOptionEditing"
                        @click.prevent="postData()">保存</button>

                    <button type="submit" class="btn btn-light" @click.prevent="historyBack()">戻る</button>
                </form>

            </div>

            <div class="col-12 col-xl-9" v-if="!m$cIsNew">
                <nav>
                    <ul class="nav nav-tabs navbar-dark border-bottom-0" >
                        <li class="nav-item">
                            <a class="nav-link active" id="product-category-tab" data-toggle="tab" href="#nav-product-category" role="tab" aria-controls="product-category" aria-selected="true">
                                <i class="fas fa-print fa-fw pr-2"></i>商品カテゴリー
                            </a>    
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="process-tab" data-toggle="tab" href="#nav-process" role="tab" aria-controls="process" aria-selected="false">
                                <i class="fas fa-print fa-fw pr-2"></i>工程
                            </a>    
                        </li>
                        <li class="nav-item active">
                            <a class="nav-link" id="mode-tab" data-toggle="tab" href="#nav-mode" role="tab" aria-controls="mode" aria-selected="false">
                                <i class="fas fa-print fa-fw pr-2"></i>モード
                            </a>    
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="ink-tab" data-toggle="tab" href="#nav-option" role="tab" aria-controls="option" aria-selected="false">
                                <i class="fas fa-print fa-fw pr-2"></i>オプション
                            </a>    
                        </li>
                    </ul>
                </nav>      
                <div class="tab-content" id="nav-tabContent">
            
                    <div class="tab-pane pl-0 mr-0 py-0 mt-3 fade show active " 
                        id="nav-product-category" 
                        role="tabpanel">                    
                        

                        
                        <div class="row"
                            v-for="n in cProductCategoryList" 
                                    :key="n.id">
                            <div class="col-12 ml-3 mb-3">
                                <ns-checkbox-input
                                    v-model="n.isChecked"
                                    :id="'productCategoryCheck' + n.id"
                                    :label="n.name"
                                    />     

                            </div>
                        </div>
                        
                    </div>
                    
                    <div class="tab-pane pl-0 mr-0 py-0 mt-3 fade" 
                        id="nav-process" 
                        role="tabpanel">         
                        
                        <div class="row"
                            v-for="n in cProcessCategoryList" 
                                    :key="n.id">
                            <div class="col-3 ml-3 mb-1 mb-xl-3 pl-0 pl-xl-3">
                                
                                <ns-checkbox-input
                                    v-model="n.isChecked"
                                    :id="'processCategoryCheck' + n.id"
                                    :label="n.name"
                                    />     
                            </div>

                            
                            <div class="col-12 col-xl-3 mb-3 mb-xl-0 form-group" v-if="n.num_of_use_m_production > 1">
                                <select class="custom-select" 
                                                v-model="n.pivot.target_m_production_no" >                                            
                                    <option value="1">{{n.m_production_memo_01}}</option>
                                    <option value="2">{{n.m_production_memo_02}}</option>
                                    <option value="3" v-if="n.num_of_use_m_production > 2">{{n.m_production_memo_03}}</option>
                                    <option value="4" v-if="n.num_of_use_m_production > 3">{{n.m_production_memo_04}}</option>
                                </select>                                
                                
                            </div>
                        </div>
                        
                    </div>                    
                    <div class="tab-pane pl-0 mr-0 py-0 fade " 
                        id="nav-mode" 
                        role="tabpanel">                    
                        
                        <table class="table table-striped table-dark table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>表示順</th>
                                    <th>名称</th>
                                    <th>機械モード名</th>
                                    <th>準備秒数/数</th>
                                    <th>速度/時</th>
                                    <th>速度単位</th>
                                    <th>備考</th>
                                    <th>&nbsp;</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="n in dValue.m_production_modes" :key="n.id" 
                                    @click.prevent="selectMode(n)" 
                                    :class="{ selected:cSelectedModeId === n.id }">
                                    <td>{{n.id}}</td>
                                    <td>{{n.order_no}}</td>
                                    <td>{{n.name}}</td>
                                    <td>{{n.machine_mode_name}}</td>
                                    <td class="text-right">{{n.prepare_sec_per_qty}}</td>
                                    <td class="text-right">{{n.speed_per_hour.toLocaleString()}}</td>
                                    <td>
                                        {{n.speed_unit_m_kv === null || n.speed_unit_m_kv === undefined 
                                            ? "" 
                                            : n.speed_unit_m_kv.kv_name}}
                                    </td>
                                    <td>{{n.description}}</td>
                                    <td>
                                        <button type="button" class="btn btn-danger" @click.prevent="deleteMode(n)">
                                            <i class="fas fa-trash fa-fw"></i>                            
                                        </button>                    
                                    </td>
                                    
                                </tr>
                            </tbody>
                        </table>

                        <div class="d-flex justify-content-end">
                            <button type="submit" class="btn btn-primary" @click.prevent="addMode()">
                                <i class="fas fa-plus fa-fw"></i>
                                明細追加
                            </button>
                        </div>

                        <div v-if="cIsModeEditing" class="pt-3">
                            <div class="row" >
                                <div class="col-12 col-xl-2">
                                    <div class="form-group">
                                        <label >表示順</label>
                                        <ns-number-input v-model="dModeValue.order_no" />
                                    </div>
                                </div>
                                            
                                <div class="col-12 col-xl-2 pl-3 pl-xl-0">                
                                    <div class="form-group">
                                        <label >準備秒数/ジョブ</label>
                                        <ns-number-input 
                                            v-model="dModeValue.prepare_sec_per_job"
                                            step="0.01"
                                            min="0" />                                         
                                    </div>
                                </div>
                                
                                <div class="col-12 col-xl-2 pl-3 pl-xl-0">                
                                    <div class="form-group">
                                        <label >準備秒数/枚</label>
                                        <ns-number-input 
                                            v-model="dModeValue.prepare_sec_per_qty"
                                            step="0.01"
                                            min="0" />                                         
                                    </div>
                                </div>

                                <div class="col-12 col-xl-2 pl-3 pl-xl-0">                
                                    <div class="form-group">
                                        <label >速度/時</label>
                                        <ns-number-input 
                                            v-model="dModeValue.speed_per_hour"
                                            step="0.01"
                                            min="0" />
                                        
                                    </div>

                                </div>

                                
                                <div class="col-12 col-xl-2 pl-3 pl-xl-0">                
                                    <div class="form-group">
                                        <label >速度単位</label>
                                        <m-kv-select
                                            v-model="dModeValue.speed_unit_m_kv_id"
                                            :kv-key="'m_production_modes-speed_unit'">
                                        </m-kv-select>                                             
                                    </div>

                                </div>
                                
                            </div>
                            <div class="row">
                                <div class="col-12 col-xl-6">                
                                    <div class="form-group">
                                        <label >表示モード名</label>
                                        <input v-model="dModeValue.name" type="text" class="form-control" >
                                    </div>

                                </div>

                                <div class="col-12 col-xl-6 pl-3 pl-xl-0">                
                                    <div class="form-group">
                                        <label >機械モード名</label>
                                        <input v-model="dModeValue.machine_mode_name" type="text" class="form-control" >
                                    </div>

                                </div>

                            </div>

                            <div class="row">
                                <div class="col-12">                
                                    <div class="form-group">
                                        <label >説明</label>
                                        <input v-model="dModeValue.description" type="text" class="form-control" >
                                    </div>

                                </div>


                            </div>


                            <div class="row"
                                v-for="n in cModeProcessCategoryList" 
                                        :key="n.id">
                                <div class="col-12 ml-3 mb-3">
                                    
                                    <ns-checkbox-input
                                        v-model="n.isChecked"
                                        :id="'modeProcessCategoryCheck' + n.id"
                                        :label="n.name"
                                        />     

                                </div>
                            </div>                            

                            <div class="row mb-6">
                                <div class="col-12 d-flex justify-content-end">
                                    <button type="submit" class="btn btn-secondary" @click.prevent="cancelMode()">
                                        キャンセル
                                    </button>
                                    <button type="submit" class="btn btn-success ml-2" @click.prevent="saveMode()">
                                        保存
                                    </button>
                                </div>

                            </div>

                        </div>


                        

                    </div>
                    <div class="tab-pane pl-0 mr-0 py-0 fade " 
                        id="nav-option" 
                        role="tabpanel" aria-labelledby="nav-home-tab">                    
                            
                        <table class="table table-striped table-dark table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>表示順</th>
                                    <th>名称</th>
                                    <th>速度掛率</th>
                                    <th>カラーインク掛率</th>
                                    <th>白インク掛率</th>
                                    <th>ニス掛率</th>
                                    <th>&nbsp;</th>
                                </tr>

                            </thead>
                            <tbody>
                                <tr v-for="n in dValue.m_production_options" :key="n.id"
                                    @click.prevent="selectOption(n)" 
                                    :class="{ selected:cSelectedOptionId === n.id }">
                                    <td>{{n.id}}</td>
                                    <td>{{n.order_no}}</td>
                                    <td>{{n.name}}</td>
                                    <td class="text-right">{{n.speed_rate}}</td>
                                    <td class="text-right">{{n.num_of_colors_for_cost}}</td>
                                    <td class="text-right">{{n.num_of_white_for_cost}}</td>
                                    <td class="text-right">{{n.num_of_varnish_for_cost}}</td>
                                    <td>
                                        <button type="button" class="btn btn-danger" @click.prevent="deleteOption(n)">
                                            <i class="fas fa-trash fa-fw"></i>                            
                                        </button>                    
                                    </td>
                                </tr>                                
                                
                                                                    
                            </tbody>
                            
                        </table>


                        <div class="d-flex justify-content-end">
                            <button type="submit" class="btn btn-primary" @click.prevent="addOption()">
                                <i class="fas fa-plus fa-fw"></i>
                                明細追加
                            </button>

                        </div>

                        <div v-if="cIsOptionEditing" class="pt-3">
                            <div class="row" >
                                <div class="col-12 col-xl-2">
                                    <div class="form-group">
                                        <label >表示順</label>
                                        <ns-number-input v-model="dOptionValue.order_no" />
                                    </div>

                                </div>
                                            
                                <div class="col-12 col-xl-6">                
                                    <div class="form-group">
                                        <label >表示オプション名</label>
                                        <input v-model="dOptionValue.name" type="text" class="form-control" >
                                    </div>

                                </div>

                                <div class="col-12 col-xl-2 pl-3 pl-xl-0">                
                                    <div class="form-group">
                                        <label >速度掛率</label>
                                        <ns-number-input 
                                            v-model="dOptionValue.speed_rate"                             
                                            step="0.01"
                                            min="0" />
                                    </div>

                                </div>

                                
                                
                            </div>
                            <div class="row">
                                <div class="col-12 col-xl-2 pl-3">                
                                    <div class="form-group">
                                        <label >カラー掛け率</label>
                                        <ns-number-input 
                                            v-model="dOptionValue.num_of_colors_for_cost"                             
                                            step="0.01"
                                            min="0" />
                                    </div>

                                </div>
                                <div class="col-12 col-xl-2 pl-3 pl-xl-0">                
                                    <div class="form-group">
                                        <label >白 掛け率</label>
                                        <ns-number-input 
                                            v-model="dOptionValue.num_of_white_for_cost"                             
                                            step="0.01"
                                            min="0" />
                                    </div>

                                </div>
                                <div class="col-12 col-xl-2 pl-3 pl-xl-0">                
                                    <div class="form-group">
                                        <label >ニス 掛け率</label>
                                        <ns-number-input 
                                            v-model="dOptionValue.num_of_varnish_for_cost"                             
                                            step="0.01"
                                            min="0" />
                                    </div>

                                </div>


                            </div>

                            <div class="row mb-6">
                                <div class="col-12 d-flex justify-content-end">
                                    <button type="submit" class="btn btn-secondary" @click.prevent="cancelOption()">
                                        キャンセル
                                    </button>
                                    <button type="submit" class="btn btn-success ml-2" @click.prevent="saveOption()">
                                        保存
                                    </button>
                                </div>

                            </div>

                        </div>                        

                            
                    </div>

                </div>
            </div>

        </div>

    </div>
</template>

<script>
import MasterMaintainanceMixins from "./../../../mixins/commons/MasterMaintainanceMixins" ;
import ObjectUtil from "./../../../frameworks/ObjectUtil" ; 
import PageMixins from '../../../mixins/commons/PageMixins';
import { MProductionService } from '../class/services/MProductionService';

export default {    
    mixins : [MasterMaintainanceMixins ,PageMixins] , 
    data :  function() {
        return {
            dFile : null , 
            dIsChangedThumbnail : false , 

            dApiName        : "mProduction",            
            dModeApiName    : "mProductionMode",
            dOptionApiName  : "mProductionOption",

            dValue : { } , 

            dModeValue : undefined , 
            dOptionValue : undefined ,
            
            dIsSuccess : false ,
        } 
    } , 
    computed : {
        cEndpoint : function () {

            let ep = `api/${this.dApiName}`;
            
            if (this.dValue.id > 0) {
                ep += `/${this.dValue.id}`;
            } else if (!this.m$cIsNew) {
                ep += `/${this.$route.params.id}`;
            }

            return ep;
        },        
        cModeEndpoint : function () {
            let ep = `api/${this.dModeApiName}`;
            return ep;
        },
        cOptionEndpoint : function () {
            let ep = `api/${this.dOptionApiName}`;
            return ep;
        },
        // 商品カテゴリ
        cProductCategoryList : function(){
            if ( this.mainStore.masters.MProductCategories === undefined ) return [] ; 
            if ( this.dValue.m_product_categories === undefined ) return [] ; 
            const _this = this ; 
            const list = this.mainStore.masters.MProductCategories.map(function(x) {
                const finded = _this.dValue.m_product_categories.find(y => y.id == x.id )  ;                 
                const row = {
                    id : x.id , 
                    name : x.name ,
                    isChecked : finded !== undefined  , 
                }
                return row ; 
            }) ; 
            return list; 
        } , 
        // 工程カテゴリ
        cProcessCategoryList : function(){
            //console.log(this.mainStore.masters) ;
            if ( this.mainStore.masters.MProcessCategories === undefined ) return [] ; 

            if ( this.dValue.m_process_categories === undefined ) return [] ; 
            const _this = this ; 
            const list = this.mainStore.masters.MProcessCategories.map(function(x) {
                const finded = _this.dValue.m_process_categories.find(y => y.id == x.id )  ;                 
                const row = {
                    id : x.id , 
                    name : x.name ,
                    num_of_use_m_production : x.num_of_use_m_production ,
                    m_production_memo_01 : x.m_production_memo_01 ,
                    m_production_memo_02 : x.m_production_memo_02 ,
                    m_production_memo_03 : x.m_production_memo_03 ,
                    m_production_memo_04 : x.m_production_memo_04 ,
                    pivot : finded !== undefined ? finded.pivot : {"target_m_production_no" : 1} ,
                    isChecked : finded !== undefined  , 
                }
                return row ; 
            }) ; 
            return list; 
        } ,
        
        // モード用工程カテゴリ
        cModeProcessCategoryList : function(){
            //console.log(this.mainStore.masters) ;
            if ( this.mainStore.masters.MProcessCategories === undefined ) return [] ; 
            //console.log(this.dValue.m_production_modes) ;
            if ( this.dValue.m_production_modes === undefined ) return [] ; 
            if ( this.cSelectedModeId === -1 ) return [] ; 

            const _this = this ; 
            const selectedMode = this.dValue.m_production_modes.find(x => x.id == this.cSelectedModeId) ;             
            if ( selectedMode === undefined ) return []  ; 

            const list = this.mainStore.masters.MProcessCategories.map(function(x) {
                const finded = selectedMode.m_process_categories.find(y => y.id == x.id )  ;                 
                const row = {
                    id : x.id , 
                    name : x.name ,
                    isChecked : finded !== undefined  , 
                }
                return row ; 
            }) ; 
            return list; 
        } ,

        cIsModeEditing : function() {
            return this.dModeValue !== undefined ; 
        } ,
        cSelectedModeId : function() {
            if ( this.dModeValue === undefined ) return -1 ; 
            return this.dModeValue.id ; 
        } ,
        cIsOptionEditing : function() {
            return this.dOptionValue !== undefined ; 
        } ,
        cSelectedOptionId : function() {
            if ( this.dOptionValue === undefined ) return -1 ; 
            return this.dOptionValue.id ; 
        } ,
        cThumbnailPath : { 
            get : function() {
                if ( _.isNil(this.dValue.thumbnail_path)) return "" ; 
                if ( this.dValue.thumbnail_path.indexOf("blob") === 0 ) return this.dValue.thumbnail_path ; 

                return "storage/" + this.dValue.thumbnail_path ; 
            } ,
            set : function(val) {
                //console.log(this.cSalesMUserId) ;
                this.dValue.thumbnail_path = val ; 
            }
        } ,

    } , 
    methods : {   
        getData : async function () {
            try {
                const res = await axios.get(this.cEndpoint ) ;                 
                this.dValue = res.data ;  
                
            }
            catch (error) 
            {
                this.$$errorConsole(error ,this.cEndpoint ) ; 
            }            
        } ,
        postData : async function () {
            
            this.dIsSuccess = false ;
            
            try {
                //  if ( thumnailFiles.length > 0){

                //console.log("postData") ; 
                let res ;                  
                this.dValue.updated_m_user_id = this.$$cLoginUserId ; 
                this.$$clearError() ; 

                let productCategoryIds = []; 
                if ( this.cProductCategoryList.length !== 0 ){
                    // pivot(link)系のデータ取得
                    productCategoryIds = this.cProductCategoryList.filter(x => x.isChecked).map(x => x.id) ; 
                }
                this.dValue.m_product_category_ids = productCategoryIds ; 
                
                
                const processCategoryies = this.cProcessCategoryList.filter(x => x.isChecked) ;
                let processCategoryies4Post = []  ;
                
                processCategoryies.map(function(x){
                    const index = x.id ; 
                    processCategoryies4Post[index] = { "target_m_production_no" : x.pivot.target_m_production_no ?? 1 }  ;
                }) ; 
                this.dValue.m_process_category_ids = processCategoryies4Post ; 
                
                //console.log(this.dValue.m_customer_id) ; 
                if ( this.dValue.m_customer_id == 0 ) {
                     this.dValue.m_customer_id = null ; 
                }

                //console.log(productCategoryIds) ; 
                //console.log(processCategoryIds) ; 


                delete this.dValue.thumbnail_path ; 
                
                
                if ( this.m$cIsNew )
                {
                    this.dValue.created_m_user_id = this.$$cLoginUserId ;
                    //console.log(JSON.stringify(this.dValue)) ; 
                    res = await axios.post(this.cEndpoint ,this.dValue ) ;                    
                    this.mainStore.masters[this.m$cCamelizedTableName].push(res.data) ; 

                }
                else
                {
                    res = await axios.put(this.cEndpoint ,this.dValue) ; 
                    
                    const updated  = this.mainStore.masters[this.m$cCamelizedTableName].find(e => e.id === res.data.id ) ; 
                    const updatedIndex = this.mainStore.masters[this.m$cCamelizedTableName].indexOf(updated) ; 
                    
                    if ( updatedIndex != -1 ){                        
                        this.mainStore.masters[this.m$cCamelizedTableName].splice(updatedIndex, 1, res.data)
                    }
                    
                }

                let data = res.data  ; 

                if ( this.dIsChangedThumbnail ){
                    const formData = new FormData() ; 
                    formData.append("thumbnail" , this.dFile ) ; 
                    data = await MProductionService.thumbnailUpload(data.id ,formData ) ; 

                   
                }
                this.dValue = data ; 
                this.dIsChangedThumbnail = false ; 
                this.dIsSuccess = true ;
                
            }
            catch (error) 
            {   
                this.$$errorConsole(error ,this.cEndpoint ) ; 

            }
            
        } ,         
        historyBack : function () {
            if (this.$route.params.id === undefined) {
                this.$router.push({ path: '..' , append:true });
            } else {
                this.$router.push({ path: '../..' , append:true });
            }
        },
        /******  Mode */ 
        addMode : function() {
            this.dModeValue = {
                m_production_id : this.dValue.id ,
            } ;             
        } ,
        selectMode : function(row){
            this.dModeValue = ObjectUtil.deepCopyJ(row) ; 
            
        } , 
        deleteMode : async function(row) {
            if (!confirm('削除してもよろしいですか?')) return;

            try {
                const index = this.dValue.m_production_modes.indexOf(row);
                if (index != -1) {
                    // 明細選択行の倫理削除
                    this.dValue.m_production_modes.splice(index, 1);

                    if (row.id !== undefined) {
                        // 明細選択行の論理削除
                        let ep = `${this.cModeEndpoint}/${row.id}`;
                        const res = await axios.delete(ep);
                    }
                }
                this.dModeValue = undefined ; 

            } catch (error) {
                // handle error
                this.$$errorConsole(error ,this.cModeEndpoint ) ; 
            }

        } ,
        cancelMode : function() {
            this.dModeValue = undefined ; 
        } ,
        saveMode : async function() {
            //console.log("saveMode") ; 
            const value = this.dModeValue ; 
            value.updated_m_user_id = this.$$cLoginUserId ;

            //const a = this.cModeProcessCategoryList.filter(x => x.isChecked);                  
            //console.log(a) ; 
            const processCategoryIds = this.cModeProcessCategoryList.filter(x => x.isChecked).map(x => x.id) ; 
            //console.log(processCategoryIds) ; 
            value.m_process_category_ids = processCategoryIds ; 

            try {

                let res ;                  
                this.$$clearError() ; 
                //console.log(JSON.stringify(this.dOptionValue)) ; 
                if ( value.id === undefined )
                {   
                    
                    value.created_m_user_id = this.$$cLoginUserId ;                
                    //console.log(JSON.stringify(value)) ; 
                    res = await axios.post(this.cModeEndpoint ,value) ;
                    this.dValue.m_production_modes.push(res.data) ; 
                    
                }
                else
                {

                    const putEp = `${this.cModeEndpoint}/${value.id}` ; 
                    //console.log(JSON.stringify(value)) ; 
                    res = await axios.put(putEp ,value) ;
                    const updatedIndex  = this.dValue.m_production_modes.findIndex(e => e.id === this.cSelectedModeId ) ; 
                    
                    if ( updatedIndex != -1 ){                        
                        this.dValue.m_production_modes.splice(updatedIndex, 1, res.data)
                    }  
                    

                }

                this.dModeValue  = undefined ; 
            }            
            catch (error) 
            {   
                this.$$errorConsole(error ,this.cModeEndpoint ) ; 

            }


        } ,
        
        /******  Option */ 
        addOption : function() {
            this.dOptionValue = {
                m_production_id : this.dValue.id ,
            } ;             
        } ,
        selectOption : function(row){            
            this.dOptionValue = ObjectUtil.deepCopyJ(row) ; 
        } , 
        deleteOption : async function(row) {
            if (!confirm('削除してもよろしいですか?')) return;

            try {
                const index = this.dValue.m_production_options.indexOf(row);
                if (index != -1) {
                    // 明細選択行の倫理削除
                    this.dValue.m_production_options.splice(index, 1);

                    if (row.id !== undefined) {
                        // 明細選択行の論理削除
                        let ep = `${this.cOptionEndpoint}/${row.id}`;
                        const res = await axios.delete(ep);
                    }
                }
                this.dOptionValue = undefined ; 

            } catch (error) {
                // handle error
                this.$$errorConsole(error ,this.cOptionEndpoint ) ; 
            }

        } ,
        cancelOption : function() {
            this.dOptionValue = undefined ; 
        } ,
        saveOption : async function() {
            console.log("saveOption") ; 
            const value = this.dOptionValue ; 
            value.updated_m_user_id = this.$$cLoginUserId ;
            try {

                let res ;                  
                this.$$clearError() ; 
                //console.log(JSON.stringify(this.dOptionValue)) ; 
                if ( value.id === undefined )
                {                    
                    value.created_m_user_id = this.$$cLoginUserId ;                
                    //console.log(JSON.stringify(value)) ; 
                    res = await axios.post(this.cOptionEndpoint ,value) ;
                    this.dValue.m_production_options.push(res.data) ; 
                    
                }
                else
                {

                    const putEp = `${this.cOptionEndpoint}/${value.id}` ; 
                    
                    res = await axios.put(putEp ,value) ;
                    const updatedIndex  = this.dValue.m_production_options.findIndex(e => e.id === this.cSelectedOptionId ) ; 
                    
                    if ( updatedIndex != -1 ){                        
                        this.dValue.m_production_options.splice(updatedIndex, 1, res.data)
                    }  
                    

                }

                this.dOptionValue  = undefined ; 
                
            }
            catch (error) 
            {   
                this.$$errorConsole(error ,this.cOptionEndpoint ) ; 

            }

            
            
        } ,
    } , 
    created : function () 
    {
        if ( ! this.m$cIsNew) this.getData()  ; 
        
    }
    
}
</script>