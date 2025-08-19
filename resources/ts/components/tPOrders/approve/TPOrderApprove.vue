<template>
    <div>
        <!-- <contents-header-component
             >
             <div slot="title">
    
             </div>
             
        </contents-header-component> -->
        <div class="row mb-2">
            <contents-header-left></contents-header-left>
            <contents-header-right>
                <div>
                    <router-link class="nav-link" :to="{name:'t_p_order_index'}"  title="" append>
                        <a @click.self="SessionStorageRemove">発注メニュー </a>
                    </router-link> 
                </div>
            </contents-header-right>
        </div>
    
        <div class="card bg-dark">    
            <div class="row">
                <div class="col-12 col-xl-2">
                    <div class="form-group">
                        <label for="inputMBranchId">発注拠点</label>
                        <m-branch-select 
                            v-model="dRow.t_p_order.m_branch_id" 
                        ></m-branch-select>
                    </div>
                </div>
                <div class="col-12 col-xl-2 pl-xl-0">
                    <div class="form-group">
                        <label for="inputMBranchId">発注先</label>
                        <m-customer-select
                            :m-branch-id="dRow.t_p_order.m_branch_id"
                            :dealing-cds="[2]"
                            :selected-id.sync="dRow.t_p_order.supplier_m_customer_id"
                            v-model="dRow.t_p_order.supplier_m_customer_id"
                        ></m-customer-select>
                    </div>
                </div>
                <div class="col-12 col-xl-2 pl-xl-0">
                    <div class="form-group">
                        <label for="">発注担当</label>
                        <m-user-select
                            :m-branch-id="dRow.t_p_order.m_branch_id"
                            v-model="dRow.t_p_order.m_user_id"
                            >
                        </m-user-select>
                    </div>
                </div>
                <div class="col-12 col-xl-4 pl-xl-0">
                    <div class="row ml-0">
                        <div class="col pl-0 pr-0">
                            <div class="form-group">
                                <label>発注日</label>
                                <v-date-picker v-model="dRow.t_p_order.order_date_from" />
                            </div>
                        </div>
                        <div class="col-1 pl-0 pr-0">
                            <div class="form-group">
                                <p>&emsp;</p>
                                <p class="text-center">～</p>
                            </div>
                        </div>
                        <div class="col pl-0">
                            <div class="form-group">
                                <label>&emsp;</label>
                                <v-date-picker v-model="dRow.t_p_order.order_date_to" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-xl-2">
                    <div class="form-group">
                        <label for="inputCategoryMKvId">資材区分</label>
                        <m-kv-select
                            id="inputCategoryMKvId"
                            :selected-item.sync="dSelectedCategoryMkv"
                            :kv-key="'m_materials-category_m_kv_id'"
                            v-model="dRow.m_material_detail.m_material.category_m_kv_id"
                        ></m-kv-select>
                    </div>
                </div>
                <div class="col-12 col-xl-3 pl-xl-0">
                    <div class="form-group">
                        <label for="inputMBranchId">名称</label>
                        <input type="text" class="form-control" v-model="dRow.material_name" />                                         
                    </div>                                        
                </div>
                <div class="col-12 col-xl-3 pl-xl-0">
                    <div class="form-group">
                        <label for="inputMBranchId">物件名</label>
                        <input type="text" class="form-control" v-model="dRow.t_project.name" />
                    </div>
                </div>
                <div class="col-12 col-xl-2 pl-xl-0">
                    <div class="form-group">
                        <label for="">金額※入力額以上</label>
                        <ns-number-input
                                        style="text-align:right"
                                        v-model="dRow.total_price">
                        </ns-number-input>                
                    </div>
                </div>
                <div class="col-12 col-xl-2 pl-xl-0">
                    <div class="form-group">
                        <label for="">ステータス</label>
                        <select v-model="dRow.approved" class="form-control">
                            <option></option>
                            <option value=0>未承認</option>
                            <option value=1>承認済</option>
                        </select>
                    </div>
                </div>
            </div>  
        </div>
        <div class="col-12 text-right pr-0">    
            <button type="button" class="btn btn-success w-auto" id="button-addon2" @click.prevent="search">
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
        <div class="col-12 text-right pr-0 pt-2">  
            <button type="button" class="btn btn-outline-light" @click.prevent="checkAll">
                全選択                            
            </button>
            <button type="button" class="btn btn-outline-light" @click.prevent="approveAll">
                一括承認                            
            </button>
        </div>  
        <div class="row">
            <div class="col-12">
                <div class="table-responsive">
                    <table class="table table-striped table-dark text-nowrap">
                                    
                        <thead>
                            <tr>
                                <th scope="col">Actions</th>
                                <th scope="col">一覧承認</th>                            
                                <th scope="col">発注No.<br>明細No.</th>
                                <th scope="col">区分</th>
                                <th scope="col">名称</th>
                                <th scope="col">数量</th>
                                <th scope="col">単位</th>
                                <th scope="col">単価</th>
                                <th scope="col">金額</th>
                                <th scope="col">物件</th>
                                <th scope="col">発注先</th>
                                <th scope="col">納期</th>
                                <th scope="col">発注拠点</th>
                                <th scope="col">発注担当者</th>
                                <th scope="col">発注依頼日</th>
                                <th scope="col">承認日</th>
                                <th scope="col">発注日</th>
                                <!-- <th scope="col">Delete</th>-->
                            </tr>
                        </thead>
                        <tbody>
                            <template>
                                <tr v-for="n in dSearchedList" :key="n.id">
                                    <td>
                                        <router-link :to='"view/"+ n.id'   title="" append>
                                            <button type="button" class="btn btn-secondary" >
                                                <i class="fas fa-eye fa-fw"></i>                            
                                            </button>                                
                                        </router-link>
                                    </td>
                                    <td>
                                        <div v-if="n.approved"></div>
                                        <div class = "form-check" v-else>
                                            <input class = "form-check-input position-static " type = "checkbox" v-model="n.isChecked">
                                        </div>
                                    </td>
                                    <td>
                                        <router-link :to='"listview/"+ n.t_p_order_id'  title="" append>
                                            <a>{{n.t_p_order_id}}</a>
                                        </router-link>
                                        <br>{{n.id}}
                                    </td>
                                    <td>
                                        <p v-if="isEmpty(n.m_material_detail_id)">{{n.m_material_detail.m_material.category_m_kv.kv_name}}</p>
                                        <p v-else></p>
                                    </td>
                                    <td>{{n.material_name}}</td>
                                    <td class="text-right">{{n.qty}}</td>
                                    <td>{{n.unit_m_kv.kv_name}}</td>
                                    <td class="text-right">{{priceFormat(n.price)}}</td>
                                    <td class="text-right">{{priceFormat(n.total_price)}}</td>
                                    <td>
                                        <p v-if="isEmpty(n.t_project_id)">{{n.t_project.name}}</p>
                                        <p v-else></p>
                                    </td>
                                    <td>{{setSupplierName(n.t_p_order.supplier_m_customer)}}</td>
                                    <td>{{dateFormat(n.due_date)}}</td>
                                    <td>{{n.t_p_order.m_branch.short_name}}</td>
                                    <td>{{n.t_p_order.m_user.full_name}}</td>
                                    <td>{{dateFormat(n.created_at)}}</td>
                                    <td><div class="text-success" v-if="n.approved">{{dateFormat(n.approved_at)}}</div>
                                        <div v-else></div>
                                    </td>
                                    <td>{{dateFormat(n.t_p_order.order_date)}}</td>
                                    <!-- <td>
                                        <button type="button" class="btn btn-danger" @click.prevent="destroy(n.id)">
                                            <i class="fas fa-trash fa-fw"></i>                            
                                        </button>
                                    </td> -->
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script>
import PageMixins from '../../../mixins/commons/PageMixins';
import DayJsEx from "./../../../frameworks/DayJsEx" ;

export default {
    mixins : [PageMixins] , 
    data : function(){
        return {
            apiName : "tPOrderDetail" ,

            dRow : {
                material_name : "",
                total_price : 0,
                approved : "",


                t_p_order : {
                    m_branch_id : 0 ,
                },
                t_project : {
                    name : "",
                },
                m_material_detail : {
                    m_material : {
                    }
                }
            },
            dSearchedList : [],

            dSelectedCategoryMkv : "",
            dSearchBranchId : this.mainStore.loginMUser.m_branch_id , /* ログイン担当者の拠点id */

            dLoading : false ,
        }
    },
    mounted()  {
        if (sessionStorage.getItem('tPOrderSearch4Approve')){
            try{
                this.dRow = JSON.parse(sessionStorage.getItem('tPOrderSearch4Approve')) ;
            } catch (e) {
                sessionStorage.removeItem('tPOrderSearch4Approve')
            }
        }
    } ,

    computed:{
        
        cEndpoint : function () {
            let ep =  `api/${this.apiName}` ;
            return  ep ;
        } ,
        cCheckedList : function(){
            let list = this.dSearchedList ;
                list = list.filter( x => x.isChecked == true) ;
            
            return list ;
        }

    },
    methods : {
        search : async function (){
            try {
                
                this.dLoading = true ;

                const getParams = JSON.parse(JSON.stringify(this.dRow)) ;
                
                //名称
                if ( getParams.material_name == "" ) delete getParams.material_name ; 

                //金額
                if ( getParams.total_price == 0 ) delete getParams.total_price ; 

                //ステータス
                if ( getParams.approved == "" ) delete getParams.approved ; 

                if ( getParams.t_project.name == "" ) delete getParams.t_project.name; 

                //拠点
                if ( getParams.t_p_order.m_branch_id == 0 ) delete getParams.t_p_order.m_branch_id ; 
                
                if ( getParams.t_p_order.m_user_id == 0 ) delete getParams.t_p_order.m_user_id ; 


                //発注先
                if ( getParams.t_p_order.supplier_m_customer_id == 0 )  delete getParams.t_p_order.supplier_m_customer_id ; 

                // 発注日
                if ( getParams.t_p_order.order_date_from === undefined ||
                     getParams.t_p_order.order_date_from == null){
                    delete getParams.t_p_order.order_date_from ; 
                }

                if ( getParams.t_p_order.order_date_to === undefined ||
                     getParams.t_p_order.order_date_to == null){
                    delete getParams.t_p_order.order_date_to ; 
                } else {
                    getParams.t_p_order.order_date_to = DayJsEx.getOnlyDay(getParams.t_p_order.order_date_to ) ;
            
                    getParams.t_p_order.order_date_to.setDate(getParams.t_p_order.order_date_to.getDate() + 1 ) ;

                    getParams.t_p_order.order_date_to = this.dateFormat(getParams.t_p_order.order_date_to) ;
                }

                if( getParams.m_material_detail.m_material.category_m_kv_id == 0 ) delete getParams.m_material_detail.m_material.category_m_kv_id ;

                if ( Object.keys(getParams.m_material_detail.m_material).length === 0 ) delete getParams.m_material_detail.m_material ; 

                if ( Object.keys(getParams.m_material_detail).length === 0 ) delete getParams.m_material_detail; 

                if ( Object.keys(getParams.t_p_order).length === 0 ) delete getParams.t_p_order ; 

                if ( Object.keys(getParams.t_project).length === 0 ) delete getParams.t_project; 

                //console.log(JSON.stringify(getParams)) ; 

                //const res = await axios.get(ep + "/retrieve" ,{ params :getParams }) ;                  
                const res = await axios.post(this.cEndpoint + "/retrieveWithParent" , getParams ) ; 
                
                //console.log(res.data) ; 
                const resList = res.data ;

                this.dSearchedList = resList.map(function(x){
                    x.isChecked = false ;
                    return x ;
                })
                
                this.dLoading = false ;
                this.SessionStorageSave() ;
                //console.log(this.dSearchedList)
                
            }
            catch (error) 
            {
                // handle error
                this.$$errorConsole(error ,this.cEndpoint ) ; 

            }
        },
        isEmpty : function (value) {
            if (value==null) return false ;
            return true ;
        },
        dateFormat : function(value) {
            if(value === "" || value ===null) return  ;
            return DayJsEx.format(value , "YYYY-MM-DD")
        },
        priceFormat : function(value) {
            var integerValue = parseInt(value);
            return integerValue.toLocaleString() +　"円";
        },
        setSupplierName : function(supplier){
            if(supplier.short_name) return supplier.short_name ;
            return supplier.name ;
        },
        checkAll : function (){
            this.dSearchedList.map(function(x){
                x.isChecked = true ;
            })  
        },
        approveAll : function() {
            if(! confirm('選択中の発注を承認してもよろしいですか?')) return ;
            try {
                let date = DayJsEx.format(new Date() , "YYYY-MM-DD") ;
                let ep1 = this.cEndpoint ;
                let list = this.cCheckedList ;
                list = list.map(async function(x) {
                    delete x.isChecked ;
                    x.approved = 1 ;
                    x.approved_at = date ;
                   
                    let ep = ep1 +'/' + x.id ;                    
                    await axios.put(ep , x) ;

                    return x
                }) ;
                
            } catch (error) {
                // handle error
                this.$$errorConsole(error ,this.cEndpoint ) ; 

            }
        },
        destroy : async function(id){
            if (! confirm('削除してよろしいですか?')) return ;

            try {
                let ep　 = this.cEndpoint + `/${id}` ;
                const res = await axios.delete(ep) ;

                const deleted  = this.dSearchedList.find(e => e.id === id) ;
                const delIndex = this.dSearchedList.indexOf(deleted) ;
                if ( delIndex != -1 ) this.dSearchedList.splice(delIndex , 1) ;
            }
            catch (error)
            {
                // handle error
                const {
                    status,
                    statusText
                } = error.response ;

                console.error(`Error! HTTP Status: ${status} ${statusText} ${ep}`) ;
            }
            
        } ,
        SessionStorageSave: function(){
            const parsed = JSON.stringify(this.dRow) ;
            sessionStorage.setItem('tPOrderSearch4Approve', parsed) ;
        },        
        SessionStorageRemove : function() {
            sessionStorage.removeItem('tPOrderSearch4Approve') ;
        } ,
        
    } ,
    created : function (){
    } ,
    
}

</script>