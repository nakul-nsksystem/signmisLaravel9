<template>
    <div>
        <div class="row mb-2">
            <contents-header-left></contents-header-left>
            <contents-header-right>
                <router-link class="nav-link pr-0 pl-1" to="add" title="" append>
                    <button type="button" class="btn btn-primary" @click.self="removeSessionStorage">
                        <i class="fas fa-plus fa-fw"></i>
                        新規発注
                    </button>
                </router-link>
                <router-link class="nav-link pr-0 pl-1" to="qr" title="" append>
                    <button type="button" class="btn btn-success" @click.self="removeSessionStorage">
                        <i class="fas fa-qrcode fa-fw"></i>
                        QR発注
                    </button>
                </router-link>
            </contents-header-right>            
        </div>
        <div v-if="$$cIsError" class="alert alert-danger" role="alert">
            {{dErrorData.message}}
        </div>
        <validation-observer v-slot="{ invalid }">
    
            <div class="row">
                <div class="col-12 col-xl-2">
                    <div class="form-group">
                        <label for="inputMBranchId">{{ cLoaded }}拠点</label>
                        <m-branch-select 
                            v-model="dRow.m_branch_id" 
                            />
                    </div>
                </div>
                <div class="col-12 col-xl-3 pl-xl-0">
                    <div class="form-group">
                        <label for="inputMBranchId">仕入先</label>
                        <m-customer-ref-input 
                            v-model="dRow.supplier_m_customer_id"
                            :mBranchId="dRow.m_branch_id"
                            :dealing-cds="[2,4]"
                            />
                    </div>
                </div>
                <div class="col-12 col-xl-2 pl-xl-0">
                    <div class="form-group">
                        <label for="">発注担当</label>
                        <m-user-select
                            :m-branch-id="dRow.m_branch_id"
                            v-model="dRow.m_user_id"
                            />
                    </div>
                </div>
                <div class="col-12 col-xl-3 pl-xl-0">
                    <div class="form-group">
                        <label >発注日</label>
                        <div class="d-flex flex-no-wrap">
                            <ex-v-date-picker 
                                readonly
                                aria-readonly="true"
                                v-model="dRow.order_date_from" />
                            <span class="px-2 pt-2">～</span>
                            <ex-v-date-picker 
                                readonly
                                aria-readonly="true"
                                v-model="dRow.order_date_to" />
                        </div>
                    </div>

                </div>
                
            </div>
            <div class="row">
                <div class="col-12 col-xl-2">
                    <div class="form-group">
                        <label for="inputCategoryMKvId">材料カテゴリ</label>
                        <m-kv-select
                            id="inputCategoryMKvId"
                            :selected-item.sync="dSelectedCategoryMkv"
                            :kv-key="'m_materials-category_m_kv_id'"
                            v-model="dRow.t_p_order_details.m_material_detail.m_material.category_m_kv_id"
                            />
                    </div>
                </div>
                <div class="col-12 col-xl-3 pl-xl-0">
                    <div class="form-group">
                        <label for="inputMBranchId">名称</label>
                        <input type="text" class="form-control" v-model="dRow.t_p_order_details.po_material_name" />                                         
                    </div>                                        
                </div>
                <div class="col-12 col-xl-3 pl-xl-0">
                    <div class="form-group">
                        <label for="inputMBranchId">物件名</label>
                        <input type="text" class="form-control" v-model="dRow.t_p_order_details.t_project.name" />
                    </div>
                </div>

                <div class="col-12 col-xl-1 pl-xl-0">
            
                    <div class="form-group">
                        <label for="">明細No.</label>
                        <ns-number-input
                            v-model="dRow.t_p_order_details.id"
                            :nullable='true'/>
                    </div>
                    
                </div>
                <div class="col-12 col-xl-1 pl-xl-0">
            
                    <div class="form-group">
                        <label for="">物件リンク</label>
                        <select v-model="dRow.is_t_project_order" class="form-control">
                            <option value=0></option>
                            <option value=2>有</option>
                            <option value=1>無</option>
                        </select>
                    </div>
                    
                </div>

                <div class="col-12 col-xl-1 pl-xl-0">
            
                    <div class="form-group">
                        <label for="">在庫</label>
                        <select v-model="dParam4IsStocked" class="form-control">
                            <option value=""></option>
                            <option value="1">在庫</option>
                            <option value="0">非在庫</option>
                        </select>
                    </div>
                    
                </div>
            </div> 
            <div class="row"> 
                <div class="col-12 text-xl-right pb-2">
                    <div class="col-xl-12 pr-1 pl-0">
                        <button class="btn btn-link px-0 mb-2" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            <h6>詳細検索条件表示</h6>                                
                        </button>
                    </div>    
                    <button type="button" class="btn btn-success w-auto" id="button-addon2" @click.prevent="search()" :disabled="invalid">
                        <div v-if="dLoading">
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            検索中...
                        </div>
                        <div v-else>
                            <i class="fas fa-search fa-fw"></i>
                            検索
                        </div>
                    </button>
                    <button type="button" class="btn btn-secondary ml-2" @click.prevent="clear">
                        <i class="fas fa-eraser" />
                        クリア
                    </button>
                </div> 
            </div>
            <div class="row" id="accordion1">
                <div class="card bg-dark px-0 col-12">
                    <div id="collapseOne" class="collapse " aria-labelledby="headingOne" data-parent="#accordion1">
                        <div class="card-body bg-app-secondaly">
                            <div class="row">
                                <div class="col-12 col-xl-3" v-if="m$cIsViewPrice">
                                    <div class="form-group">
                                        <label >金額</label>
                                        <div class="d-flex flex-no-wrap">
                                            <validation-provider name="金額" rules="numeric" immediate v-slot="{ errors }">                                       
                                                <input
                                                    type="text"
                                                    style="text-align:right"
                                                    class="form-control"
                                                    inputMode="numeric"
                                                    v-model="dRow.t_p_order_details.total_price_from">
                                                <span class="validation-error">{{ errors[0] }}</span>
                                            </validation-provider>
                                            <span class="px-2 pt-2">～</span>
                                            <validation-provider name="金額" rules="numeric" immediate v-slot="{ errors }">                                        
                                                <input 
                                                    type="text"
                                                    style="text-align:right"
                                                    class="form-control"
                                                    inputMode="numeric"
                                                    v-model="dRow.t_p_order_details.total_price_to">
                                                <span class="validation-error">{{ errors[0] }}</span>
                                            </validation-provider>
                                        </div>
                                    </div>

                                </div>
                                <div class="col-12 col-xl-1 pl-xl-0">
                                    <div class="form-group text-xl-center">
                                        <label for="TPOrderIsInvoicePriceCheck">仕入単価比較</label>
                                        <ns-checkbox-input
                                            v-model="dRow.is_same_invoice_price"
                                            :id="'TPOrderIsInvoicePriceCheck'"
                                            />
                                    </div>
                                </div>
                            </div>
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
                                    <th></th>
                                    <th>発注No.</th>
                                    <th>発注日</th>
                                    <th>仕入先</th>
                                    <th>区分</th>
                                    <th>名称</th>
                                    <th>数量</th>
                                    <th>単位</th>                            
                                    <th v-if="m$cIsViewPrice" class="text-right">単価</th>
                                    <th v-if="m$cIsViewPrice && dRow.is_same_invoice_price" class="text-right">仕入単価</th>
                                    <th v-if="m$cIsViewPrice" class="text-right">金額</th>
                                    <th>納期</th>
                                    <th>物件</th>
                                    <th>拠点</th>
                                    <th>発注担当</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="n in dSearchedList" :key="n.id">
                                    <td style="white-space: normal;">
                                        <router-link :to='"view/"+ n.id'   title="" append>
                                            <button type="button" class="btn btn-secondary" >
                                                <i class="fas fa-eye fa-fw"></i>                            
                                            </button>                                
                                        </router-link>
                                        <router-link :to='"edit/"+ n.id'  title="" append>
                                            <button type="button" class="btn btn-success" >
                                                <i class="fas fa-edit fa-fw"></i>                            
                                            </button>
                                        </router-link>
                                    </td>
                                    <td>
                                        <div v-for="(details,index) in n.t_p_order_details" :key="details.id" >
                                            <p><span :style="index!==0 ? 'visibility:hidden;' : ''">{{n.id}}</span><span>-{{details.id}}</span></p>
                                        </div>
                                    </td>
                                    <td>{{m$cDateFormat(n.order_date)}}</td>
                                    <td  class="d-inline-block text-truncate clamp" style="max-width:200px">{{n.supplier_m_customer?.short_name_or_name ?? ""}}</td>
                                    <td>
                                        <div v-for="details in n.t_p_order_details" :key="details.id">
                                            <p class="text-truncate" style="max-width:70px" :title="details.m_material_detail.m_material.category_m_kv.kv_name" v-if="!m$cIsEmpty(details.m_material_detail_id)">{{details.m_material_detail.m_material.category_m_kv.kv_name}}</p>
                                            <p v-else>　</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div v-for="details in n.t_p_order_details" :key="details.id">
                                            <p>
                                                {{details.po_material_name}}
                                                <span class="badge badge-primary" v-show="cIsStocked(details)">在庫</span>
                                            </p>
                                        </div>
                                    </td>
                                    <td class="text-right">
                                        <div v-for="details in n.t_p_order_details" :key="details.id">
                                            <p>{{details.qty}}</p>
                                        </div>    
                                    </td>
                                    <td>
                                        <div v-for="details in n.t_p_order_details" :key="details.id">
                                            <p v-if="!m$cIsEmpty(details.unit_m_kv)">{{details.unit_m_kv.kv_name}}</p>
                                        </div>    
                                    </td>                        
                                    <td class="text-right" v-if="m$cIsViewPrice">
                                        <div v-for="details in n.t_p_order_details" :key="details.id">
                                            <p>{{m$cPriceFormat(details.price)}}</p>
                                        </div>    
                                    </td>
                                    <td class="text-right" v-if="m$cIsViewPrice && dRow.is_same_invoice_price">
                                        <div v-for="details in n.t_p_order_details" :key="details.id">
                                            <p>
                                                <template v-for="invoice in details.t_p_invoice_details">
                                                    <a :href="`v#/t_p_invoice/edit/${invoice.t_p_invoice_id}`" 
                                                        :style="cIntegrityPriceStyle(invoice.price,details.price)">
                                                        {{m$cPriceFormat(invoice.price)}}
                                                    </a>
                                                </template>
                                            </p>
                                        </div>    
                                    </td>
                                    <td class="text-right" v-if="m$cIsViewPrice">
                                        <div v-for="details in n.t_p_order_details" :key="details.id">
                                            <p>{{m$cPriceFormat(details.total_price)}}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div v-for="details in n.t_p_order_details" :key="details.id">
                                            <p>{{m$cDateFormat(details.due_date)}}</p>
                                        </div>    
                                    </td>
                                    <td>
                                        <div v-for="details in n.t_p_order_details" :key="details.id">
                                            <p class="text-truncate" style="max-width:200px"><a :title="cProjectNames(details)" :href="cTProjectLink(details)">{{cProjectNames(details)}}</a></p>
                                        </div>
                                    </td>
                                    <td>{{n.m_branch.short_name}}</td>
                                    <td><p style="white-space: normal;" v-if="n.m_user">{{n.m_user.full_name}}</p></td>
                                    <td>
                                        <button type="button" class="btn btn-danger" @click.prevent="destroy(n.id)">
                                            <i class="fas fa-trash fa-fw"></i>                            
                                        </button>                    
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </validation-observer>
        <pagination
            :p-pagination.sync="dPagination"
            @search="search($event)"
        />
    </div>
    
</template>

<script>
import PageMixins from '../../mixins/commons/PageMixins';
import TPOrderMixins from './mixins/TPOrderMixins'
import SessionStorageUtill from '../../frameworks/SessionStorageUtil'
import _ from "lodash" ;

export default {
    mixins : [PageMixins,TPOrderMixins] , 
    data : function(){
        return {
            apiName : "tPOrder" ,
            dRow : {
                m_branch_id : 0,
                m_user_id : 0,
                supplier_m_customer_id : 0,
                order_date_from : undefined,
                order_date_to : undefined,
                t_p_order_details:{
                    id : null,
                    total_price_from : null ,
                    total_price_to : null ,
                    m_material_detail : {
                        m_material : {
                            category_m_kv_id : 0,
                            is_stocked : "",
                        },
                    },
                    t_project : {
                        name : "",
                    },
                    approved : 0
                } ,
                is_same_invoice_price : false 

            },

            dPagination : {                         // pagination
                links : [] ,                        // リンク
                total : -1 ,                        // 合計件数
                from : -1 ,                         // 現在ページの開始位置
                to : -1 ,                           // 現在ページの終了位置
            } ,

            dSearchedList : [],

            dSelectedCategoryMkv : "",

            dParam4IsStocked : "" ,

            dLoading : false ,
        }
    },
    computed:{        
        cEndpoint : function () {
            let ep =  `api/${this.apiName}` ;
            return  ep ;
        } ,

        cLoaded : function () {
            if (this.mainStore.isAppReady) {
                
                this.dRow.m_branch_id = this.mainStore.loginMUser.m_branch_id ; 
                this.setSessionStorage() ;
            }
            return "" ;
        } , 
        //在庫品か
        cIsStocked : function(){
            return function(tPDs) {
                if(this.m$cIsEmpty(tPDs.m_material_detail_id)) return false ;
                return tPDs.m_material_detail.m_material.is_stocked ;
            }
        } ,

        //is_stocked検索項目用
        cParam4IsStocked : function() {

            if(this.dParam4IsStocked === "0" ) return 0 ;
            if(this.dParam4IsStocked === "1" ) return 1 ;

            return "" ;
        } ,

        //発注単価と仕入単価が違う時の文字色スタイル
        cIntegrityPriceStyle : function() {
            return function(piPrice,poPrice) {
                return piPrice !== poPrice ? 'color:red !important;' : 'color:white !important;'
            }
            
        },

        //物件名
        cProjectNames : function() {
            return function(tpd) {
                if(!this.m$cIsEmpty(tpd.t_project_id)) {
                    return tpd.t_project.name     
                } 
                else if(!_.isEmpty(tpd.t_project_product_processes)) {
                    const nameArr = _.uniq(tpd.t_project_product_processes.map( x => x.t_project_product.t_project.name));
                    return nameArr.join("\n")
                }

                return "　";
            }
        },

        //物件へのリンク
        cTProjectLink : function() {
            return function(tpd) {
                if(!this.m$cIsEmpty(tpd.t_project_id)) {
                    return `v#/t_project/edit/${tpd.t_project_id}` ;   
                } 
                else if(!_.isEmpty(tpd.t_project_product_processes)) {
                    return `v#/t_project/edit/${tpd.t_project_product_processes[0].t_project_product.t_project_id}` ;   
                }

                return "";
            }
        },


    },
    methods : {
        search : async function (url){
            
            try {

                this.dLoading = true ;
                const getParams = _.cloneDeep(this.dRow) ;

                //is_stocked 数字に変換
                getParams.t_p_order_details.m_material_detail.m_material.is_stocked = this.cParam4IsStocked ;
                
                const ep = (url? url : this.cEndpoint + "/retrieveWithDetails") ;
                
                const res = await axios.post(ep, getParams) ; 
                // const resList = _.cloneDeep(res.data.data) ;

                // pagination関連
                this.dPagination.links = res.data.links ;   // リンク
                this.dPagination.total = res.data.total ;   // 合計件数
                this.dPagination.from  = res.data.from ;    // 現在ページの開始位置
                this.dPagination.to    = res.data.to ;      // 現在ページの終了位置

                this.dSearchedList = res.data.data ;

                this.saveSessionStorage() ;
                
            } catch (error) {
                
                this.$$errorConsole(error, this.cEndpoint) ; 
            
            } finally {
                this.dLoading = false ;

            }
        },

        destroy : async function(id){

            if (! confirm('削除してよろしいですか?')) return ;

            try {
                let ep = this.cEndpoint + `/${id}` ;
                                
                const deleted  = this.dSearchedList.find(e => e.id === id ) ;
                const delIndex = this.dSearchedList.indexOf(deleted) ;
                
                const isInvoiced = deleted.t_p_order_details.filter(x => x.t_p_invoice_details.length>0) ;
                
                if(isInvoiced.length>0){
                    alert('仕入済の明細が存在するため、削除できません') ; 
                    return ;
                }

                const res = await axios.delete(ep) ;
                if ( delIndex != -1 )  this.dSearchedList.splice(delIndex , 1) ;
            }
            catch (error)
            {
                // handle error
                this.$$errorConsole(error, this.cEndpoint) ; 

            }
        } ,

        clear : function() {
            this.dRow = {
                m_branch_id : 0,
                m_user_id : 0,
                supplier_m_customer_id : 0,
                order_date_from : undefined,
                order_date_to : undefined,
                t_p_order_details:{
                    total_price_from : null ,
                    total_price_to : null ,
                    m_material_detail : {
                        m_material : {
                            category_m_kv_id : 0,
                            is_stocked : "",
                        },
                    },
                    t_project : {
                        name : "",
                    },
                    approved : 0
                }
            }

            this.removeSessionStorage() ;
        } ,
        setSessionStorage : function(){
            if (sessionStorage.getItem('tPOrderSearch4Index')){
                try{
                    this.dRow = JSON.parse(sessionStorage.getItem('tPOrderSearch4Index')) ;

                } catch (e) {
                    sessionStorage.removeItem('tPOrderSearch4Index')
                }
            }
        },
        saveSessionStorage : function(){
            const parsed = JSON.stringify(this.dRow) ;
            sessionStorage.setItem('tPOrderSearch4Index', parsed) ;
        },        
        removeSessionStorage : function() {
            sessionStorage.removeItem('tPOrderSearch4Index') ;
        } ,
        
    } ,
    created : function (){

    } ,
    beforeDestroy : function() {
        this.removeSessionStorage()
    }
    
}

</script>

<style scoped>
    /* クランプ解除用 */
    .clamp:hover {
        white-space: normal;
    }
    
</style>