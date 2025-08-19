<template>
    <div>
        <div class="row mb-2">
            <contents-header-left></contents-header-left>
            <contents-header-right></contents-header-right>
        </div>
        <div class="app-contents-container">
            <div v-show="dSuccess" class="alert alert-success" role="alert">
                発注しました
            </div>
            <div class="row">
                <div class="col-12 col-xl-2 pl-xl-1">
                    <div class="form-group">
                        <label for="inputMBranchId">{{ cLoaded }}発注拠点</label>
                        <m-branch-select
                            id="inputMBranchId"
                            v-model="dRow.m_branch_id"
                            :selectedItem.sync="dSelectedMBranch"
                            />
                    </div>
                </div>
                <div class="col-12 col-xl-2 pl-xl-0">
                    <validation-provider name="発注日" :rules="`required|custom_rule_date_range:${m$cSmEditableTerm}`" immediate v-slot="{ errors }">
                        <div class="form-group">
                            <label for="">発注日</label>
                            <ex-v-date-picker
                                v-model="dOrderDate" />
                            <span class="validation-error">{{ errors[0] }}</span>                            
                        </div>
                    </validation-provider>
                </div>
                <div class="col-12 col-xl-2 pl-xl-0">
                    <validation-provider name="発注担当" rules="required|excluded:0" immediate v-slot="{ errors }">
                        <div class="form-group">
                            <label for="">発注担当</label>
                            <m-user-select
                                :m-branch-id="dRow.m_branch_id"
                                v-model="dSelectedUserId"
                                :selectedItem.sync="dSelectedMUser"
                                />
                            <span class="validation-error">{{ errors[0] }}</span>                            
                        </div>
                    </validation-provider>
                </div>

            </div>

            <div class="row">
                <div class="col-12 pl-1 pr-0  pt-1 pt-xl-0">
                    <nav>
                        <ul class="nav nav-tabs navbar-dark border-bottom-0" id="purchase-nav-category">
                            <li class="nav-item">
                                <a class="nav-link active" id="home-tab" data-toggle="tab" href="#nav-cat-searches" role="tab" aria-controls="searches" aria-selected="true">
                                    <i class="fas fa-server fa-fw pr-2"></i>マスタ検索
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" id="profile-tab" data-toggle="tab" href="#nav-cat-inputs" role="tab" aria-controls="inputs" aria-selected="false">
                                    <i class="fas fa-edit fa-fw pr-2"></i>フリー
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <div class="tab-content bg-app-secondaly" id="nav-tabContent">
                        <div class="tab-pane pl-0 mr-0 py-0 fade show active" id="nav-cat-searches" role="tabpanel" aria-labelledby="nav-home-tab">
                            <div class="p-2">
                                <div class="row">
                                    <div class="col-12 col-xl-2">
                                        <div class="form-group">
                                            <label for="inputCategoryMKvId">カテゴリ</label>
                                            <m-kv-select
                                                id="inputCategoryMKvId"
                                                :selected-item.sync="dSelectedCategoryMKv"
                                                :kv-key="'m_materials-category_m_kv_id'"
                                                v-model="dRow.category_m_kv_id"
                                            ></m-kv-select>
                                        </div>
                                    </div>
                                    <div class="col-12 col-xl-2 pl-xl-0">
                                        <div class="form-group">
                                            <label for="inputSubCategoryMKvId">サブカテゴリ</label>
                                            <m-kv-select
                                                id="inputSubCategoryMKvId"
                                                :kv-category-id="cTargetCategoryId"
                                                v-model="dRow.sub_category_m_kv_id"
                                            ></m-kv-select>
                                        </div>
                                    </div>
                                    <div class="col-12 col-xl-3 pl-xl-0">
                                        <div class="form-group">
                                            <label for="inputMBranchId">発注先</label>
                                            <m-customer-ref-input
                                                v-model="dRow.supplier_m_customer_id"
                                                :mBranchId="dRow.m_branch_id"
                                                :dealing-cds="[2,4]"
                                                />
                                        </div>
                                    </div>
                                    <div class="col-12 col-xl-4 pl-xl-0">
                                        <div class="form-group">
                                            <label for="purchaseOrderMemo">名称</label>
                                            <input v-model="dRow.name" class="form-control" aria-label="With textarea">
                                        </div>
                                    </div>
                                    <div class="col-12 col-xl-1 pl-xl-0">
                                        <div class="form-group">
                                            <label class="invisible">検索</label>
                                            <div class="text-right">
                                                <button type="button" class="btn btn-success w-auto" id="button-addon2" @click.prevent="search()">
                                                    <div v-if="dLoading">
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
                                </div>
                                <div class="row">
                                    <div class="col-12">
                                        <div class="table-responsive">
                                            <table class="table table-striped table-dark text-nowrap">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">名称/通称</th>
                                                        <th scope="col">発注先</th>
                                                        <th scope="col">カテゴリ</th>
                                                        <th scope="col">寸法,容量</th>
                                                        <th scope="col">数量</th>
                                                        <th scope="col" v-if="m$cIsViewPrice">単価</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="n in cSearchedList" :key="n.id" >
                                                        <td>
                                                            {{n.t_p_order_details.material_name}}<br/>
                                                            {{n.t_p_order_details.material_display_name}}
                                                        </td>
                                                        <td>{{n.supplier.short_name_or_name}}</td>
                                                        <td>
                                                            <p v-if="n.category_m_kv != null">{{n.category_m_kv.kv_name}}</p>
                                                            <p v-if="n.sub_category_m_kv != null">{{n.sub_category_m_kv.kv_name}}</p>
                                                        </td>
                                                        <td>
                                                            <div class="form-row" v-if="n.t_p_order_details.is_able_to_input_size">
                                                                <div class="form-group">
                                                                    <ns-number-input class="app-input-size"
                                                                        v-model="n.t_p_order_details.material_size_x"
                                                                        />
                                                                </div>
                                                                <div class="form-group col-xs">
                                                                    <span class="h3">x</span>
                                                                </div>
                                                                <div class="form-group col-xs">
                                                                    <ns-number-input class="app-input-size"
                                                                        v-model="n.t_p_order_details.material_size_y"
                                                                        />
                                                                </div>
                                                            </div>
                                                            <p v-else>{{n.t_p_order_details.size}}</p>
                                                        </td>
                                                        <td>
                                                            <div class="form-row">
                                                                <div class="form-group col-xs">
                                                                    <ns-number-input
                                                                        class="app-input-size"
                                                                        v-model="n.t_p_order_details.qty"
                                                                        />
                                                                </div>
                                                                <p v-if="n.t_p_order_details.unit_m_kv_id" class="pt-2">
                                                                    {{n.t_p_order_details.unit_m_kv.kv_name}}
                                                                </p>
                                                            </div>
                                                        </td>
                                                        <td class="text-right" v-if="m$cIsViewPrice">
                                                            {{m$cPriceFormat(n.t_p_order_details.price)}}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="text-right" v-if="dSearchedList.length>0">
                                            <button type="button" class="btn btn-primary" @click.prevent="onAddFromMaster">
                                                <i class="fas fa-plus fa-fw"></i>
                                                追加
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <pagination
                                    :p-pagination.sync="dPagination"
                                    @search="search($event)"
                                    />
                            </div>
                        </div>

                        <div class="tab-pane fade" id="nav-cat-inputs" role="tabpanel" aria-labelledby="nav-profile-tab">
                            <div class="col-12 pt-2">
                                <validation-observer v-slot="{ invalid }" >

                                    <form>
                                        <div class="row">
                                            <div class="col-12 col-xl-4">
                                                    <div class="form-group">
                                                        <label for="inputCategoryMKvId">
                                                            <span class="d-inline">仕入先</span>
                                                            <ns-checkbox-input
                                                                class="d-inline ml-1"
                                                                v-model="dIsCustomerFixed"
                                                                :id="'customerFixCheck'"
                                                                :label="'固定する'"
                                                                />
                                                        </label>
                                                        <validation-provider name="仕入先" rules="required|excluded:0" immediate v-slot="{ errors }">
                                                            <m-customer-ref-input
                                                                v-model="dSearchSupplierId"
                                                                :mBranchId="dRow.m_branch_id"
                                                                :dealing-cds="[2,4]"
                                                                :selected-item.sync="dSelecteSupplierItem"
                                                                />
                                                            <span class="validation-error">{{ errors[0] }}</span>
                                                        </validation-provider>
                                                    </div>
                                            </div>
                                            <div class="col-12 col-xl-4 pl-xl-0">                                                    
                                                <validation-provider name="名称" rules="required" immediate v-slot="{ errors }">
                                                    <div class="form-group">
                                                        <label for="inputName">名称/寸法/容量</label>
                                                        <input v-model="dPurchaseMaterialName" class="form-control" id="" placeholder="例：AAA[1000×1000mm]">
                                                        <span class="validation-error">{{ errors[0] }}</span>
                                                    </div>
                                                </validation-provider>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-12 col-xl-4">
                                                <div class="form-row">
                                                    <validation-provider name="数量" rules="required|excluded:0" immediate v-slot="{ errors }">
                                                        <div class="form-group pl-1">
                                                            <label for="dPurchaseQty">数量</label>
                                                            <ns-number-input
                                                                v-model="dPurchaseQty"
                                                                />
                                                            <span class="validation-error">{{ errors[0] }}</span>
                                                        </div>
                                                    </validation-provider>
                                                    <validation-provider name="単位" rules="required|excluded:0" immediate v-slot="{ errors }">
                                                        <div class="form-group pl-2">
                                                            <label for="">単位</label>
                                                            <m-kv-select
                                                                :selected-item.sync="dSelectedUnitMKv"
                                                                :kv-key="'m_materials-unit_m_kv_id'"
                                                                v-model="dPurchaseUnitMKvId"
                                                            ></m-kv-select>
                                                            <span class="validation-error">{{ errors[0] }}</span>
                                                        </div>
                                                    </validation-provider>                                                            
                                                </div>
                                            </div>
                                            <div class="col-12 col-xl-3 pl-xl-0">
                                                <div class="form-group">
                                                    <label for="dPurchasePrice">単価</label>
                                                    <ns-number-input class=""
                                                        v-model="dPurchasePrice"
                                                        />
                                                </div>
                                            </div>
                                            <div class="col-12 col-xl-2 pl-xl-0">
                                                <validation-provider name="納期" rules="required" immediate v-slot="{ errors }">
                                                    <div class="form-group">
                                                        <label for="">納期</label>
                                                        <ex-v-date-picker
                                                            v-model="dPurchaseDueDate"
                                                            />
                                                        <span class="validation-error">{{ errors[0] }}</span>
                                                    </div>
                                                </validation-provider>                                                            
                                            </div>
                                            <div class="col-12 col-xl-3 pl-xl-0">
                                                
                                                <div class="form-group">
                                                    <label for="placeCheckbox">
                                                        <div class="row">
                                                            <div class="col-xl-6">納品場所</div>
                                                            <div class="col-xl-5">
                                                                <ns-checkbox-input
                                                                    v-model="dSwitching"
                                                                    :id="'placeCheckbox'"
                                                                    :label="'直送'"
                                                                    />
                                                            </div>
                                                        </div>
                                                        
                                                    </label>
                                                    <input v-model="dShippingAddress" v-if="dSwitching" type="text" class="form-control" placeholder="納品場所">

                                                    <p class="mt-2" v-else>{{dSelectedMBranch.short_name}}</p>
                                                </div>
                                            </div>
                                        </div>                                            
                                        <div class="row">                                            
                                            <div class="col-12">
                                                <div class="form-group">
                                                    <label for="purchaseOrderMemo">備考</label>
                                                    <input v-model="dPurchaseSlipMemo" class="form-control" aria-label="With textarea">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-12 col-xl-2 ml-auto">
                                                <div class= "text-right">
                                                    <button type="button" class="btn btn-primary" :disabled="invalid" @click.prevent="onAddFree">
                                                        <i class="fas fa-plus fa-fw"></i>
                                                        追加
                                                    </button>
                                                    <button type="button" class="btn btn-secondary" @click.prevent="onClear">
                                                        <i class="fas fa-trash fa-fw"></i>
                                                        クリア
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </validation-observer>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            

            <t-p-order-edit-component
                v-model="dTPOrders"
                :row="dRow"
                :isViewPrice="m$cIsViewPrice"
                @finishedOrder="finishedOrder"
                />
        </div>
    </div>
</template>

<script>
import PageMixins from '../../mixins/commons/PageMixins';
import TPOrderMixins from "./mixins/TPOrderMixins"
import DayJsEx from "./../../frameworks/DayJsEx" ;
import _ from "lodash"
import SalesManagementMixins from '@mixins/commons/SalesManagementMixins'

export default {
    mixins : [PageMixins,TPOrderMixins,SalesManagementMixins] , 
    data : function(){
        return {
            apiName : "tPOrder" ,

            dRow : {
                name: "" ,
                m_branch_id : 0 ,
                category_m_kv_id : 0 ,
                sub_category_m_kv_id : 0,
                supplier_m_customer_id : 0 ,
            } ,

            dPagination : {                         // pagination
                links : [] ,                        // リンク
                total : -1 ,                        // 合計件数
                from : -1 ,                         // 現在ページの開始位置
                to : -1 ,                           // 現在ページの終了位置
            } ,

            dSearchedList : [] ,

            dSelectedMBranch : {} ,
            dSelecteSupplierItem : {} ,
            dSelectedUserId : 0 ,
            dSelectedMUser : {} ,
            dSelectedCategoryMKv : {},
            dOrderDate : new Date(),

            dLoading : false ,
            dSwitching : false ,
            dSearchSupplierId : 0,

            dPurchaseMaterialName : "",
            dPurchasePrice : 0,
            dPurchaseUnitMKvId : 0 ,
            dSelectedUnitMKv : {} ,
            dPurchaseQty : 0,
            dPurchaseSlipMemo : "",
            dShippingAddress : "" ,
            dPurchaseDueDate : null,
            dTPOrders : [],

            dSuccess : false ,
            
            //フリー入力顧客固定チェック
            dIsCustomerFixed : false


        }
    },
    computed:{
        cEndpoint : function () {
            let ep =  `api/${this.apiName}` ;
            return  ep ;
        } ,
        cEndpointMaterial : function () {
            return 'api/mMaterial/retrieveWithDetails' ;
        } ,
        cLoaded : function () {
            if (this.mainStore.isAppReady) {
                this.dRow.m_branch_id = this.mainStore.loginMUser.m_branch_id ; 
                this.dSelectedUserId = this.mainStore.loginMUser.id ;
            }
            return "" ;
        } ,

        cTargetCategoryId : function () {
            // 選択されているカテゴリの対象カテゴリidを取得
            //return this.dSelectedCategoryMKv === undefined ? 0 : this.dSelectedCategoryMKv.target_m_kv_category_id ;
            return this.dSelectedCategoryMKv?.target_m_kv_category_id ?? 0;

        },

        cSearchedList : function() {

            const _this = this ;
            //マスタ検索

            const orderDate = DayJsEx.format(this.dOrderDate , "YYYY-MM-DD") ;
            const tPOrderRows = this.dSearchedList.map(function(x){
                return {
                    m_branch_id : x.m_material.m_branch_id,
                    supplier_m_customer_id : x.m_material.supplier_m_customer_id,
                    m_user_id   : _this.dSelectedUserId,
                    order_date  : orderDate,
                    supplier   : x.m_material.supplier ,
                    m_branch    : x.m_material.m_branch ,
                    category_m_kv : x.m_material.category_m_kv ,
                    sub_category_m_kv : x.m_material.sub_category_m_kv ,
                    user       : _this.dSelectedMUser,
                    isChecked   : false ,
                    slip_memo: null,
                    t_p_order_details :{
                        is_able_to_input_size : x.is_able_to_input_size ,
                        is_able_to_input_price : x.is_able_to_input_size ,
                        is_display_price : 0 ,
                        m_material_detail_id: x.id,
                        material_name: x.m_material.name,
                        po_material_name: x.m_material.name,
                        material_display_name: x.m_material.display_name,
                        unit_m_kv_id  : x.unit_m_kv_id,
                        size : x.detail_name,
                        material_size_x: x.width,
                        material_size_y: x.height,
                        shipping_address : null,
                        due_date: null,
                        price: x.unit_price,
                        total_price: 0,
                        qty: 0,
                        t_project_id: null,
                        unit_m_kv  : x.unit_m_kv,
                        slip_memo:null,
                        approved : 0,
                    },

                }
            }) ;

            return tPOrderRows ;
        } ,
    },

    methods:{
        search: async function (url) {
            this.dLoading = true ;

            const getParams = _.cloneDeep(this.dRow) ;
            
            getParams.isPagenate = true ;

            // let ep = `api/mMaterial/retrieveWithDetails`
            const ep = (url? url : this.cEndpointMaterial ) ;
            // console.log(ep) ;

            try{
                const res = await axios.post(ep, getParams) ; 
                const resList = res.data.data ;

                // pagination関連
                this.dPagination.links = res.data.links ;   // リンク
                this.dPagination.total = res.data.total ;   // 合計件数
                this.dPagination.from  = res.data.from ;    // 現在ページの開始位置
                this.dPagination.to    = res.data.to ;      // 現在ページの終了位置

                const list = [] ;

                //材料明細と材料の親子逆転
                resList.map(function(x){
                    const parsedMMaterial = _.cloneDeep(x)
                    const details = x.m_material_details.map(function(y){
                        delete parsedMMaterial.m_material_details ;  
                        y.m_material = parsedMMaterial ;
                        return y ; 
                        //y.m_materials.m_material_details = null ;
                    })
                    list.push(...details)  ;
                    return x
                }) ;
                
                this.dSearchedList = list

            } catch(error) {
                // handle error
                this.$$errorConsole(error, this.cEndpoint) ; 
            
            } finally {

                this.dLoading = false ;

            }


        },

        onAddFromMaster:function(){
            //deepcopy
            const clone = _.cloneDeep(this.cSearchedList) ;
            
            //数量1以上を抽出
            let candidateList = clone.filter(x => x.t_p_order_details.qty > 0)  ;
            //重複削除
            if(this.dTPOrders.length > 0){

                const _this = this ;
                candidateList = candidateList.filter( function(row) {
                    const matched = _this.dTPOrders.filter(
                        y => 
                        y.t_p_order_details.m_material_detail_id == 
                        row.t_p_order_details.m_material_detail_id
                    ) ; 

                    if(!_.isEmpty(matched)) {
                        //サイズ入力可能材料の場合は寸法違いは別商品とする
                        if(row.t_p_order_details.is_able_to_input_size) {
                            const differenceSizeRow = matched.find( 
                                e => 
                                e.t_p_order_details.material_size_x == row.t_p_order_details.material_size_x &&
                                e.t_p_order_details.material_size_y == row.t_p_order_details.material_size_y
                            )

                            return differenceSizeRow === undefined ;
                        } 

                    } 
                    return _.isEmpty(matched) ;
                } ) ;

            }            

            //納品指定
            for(const row of candidateList) {
                if(!row.isChecked) row.t_p_order_details.shipping_address = row.m_branch.short_name ;

                //納期に値が入っていない場合発注日の翌日に納期をデフォルトセットする
                if(_.isNil(row.t_p_order_details.due_date)) row.t_p_order_details.due_date = this.m$addDay(this.dOrderDate,1)
            }
            
            this.dTPOrders.push(...candidateList) ;

        },

        onAddFree: function(){
            let date = DayJsEx.format(this.dOrderDate , "YYYY-MM-DD") ;

            if(this.dShippingAddress == "") this.dShippingAddress = this.dSelectedMBranch.short_name ;

            let newItem = {
                    m_branch_id : this.dRow.m_branch_id,
                    supplier_m_customer_id : this.dSearchSupplierId,
                    m_user_id : this.dSelectedUserId,
                    order_date : date,
                    purchase_order_m_kv_id: null,
                    m_branch: this.dSelectedMBranch,
                    supplier: this.dSelecteSupplierItem,
                    user       :this.dSelectedMUser,
                    //is_able_to_input_size : true ,
                    slip_memo: null,
                    t_p_order_details :{
                        is_able_to_input_size : 0 ,
                        is_able_to_input_price : 1 ,
                        is_display_price : 1 ,
                        m_material_detail_id: null,
                        material_name: this.dPurchaseMaterialName,
                        po_material_name: this.dPurchaseMaterialName,
                        due_date: this.dPurchaseDueDate,
                        price: this.dPurchasePrice,
                        total_price: this.dPurchasePrice*this.dPurchaseQty,
                        qty: this.dPurchaseQty,
                        material_size_x: 0,
                        material_size_y: 0,
                        shipping_address: this.dShippingAddress,
                        unit_m_kv: this.dSelectedUnitMKv ,
                        unit_m_kv_id: this.dPurchaseUnitMKvId ,
                        t_project_id: null,
                        slip_memo: this.dPurchaseSlipMemo,
                        approved : 0,
                    },
            };


            this.dTPOrders.push(newItem) ;
            this.onClear() ;
        },
        onClear: function(){
            this.dPurchaseMaterialName = "";
            this.dPurchasePrice = 0;
            this.dPurchaseSlipMemo = "";
            this.dPurchaseQty = 0;

            // console.log(this.dIsCustomerFixed)
            if(!this.dIsCustomerFixed) this.dSearchSupplierId = 0 ;
            
            this.dPurchaseUnitMKvId = 0 ;
             this.dPurchaseDueDate = this.m$addDay(this.dOrderDate,1) ;
            this.dShippingAddress = "" ;
            this.dSwitching = false ;
            
        },


        finishedOrder : function() {
            
            this.dSuccess = true ;
            this.dTPOrders = [] ;
        }

    },
    created : function() {
        this.dOrderDate = new Date();
        this.dPurchaseDueDate = this.m$addDay(this.dOrderDate,1) ;

    }


}
</script>