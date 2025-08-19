<template>
    <div>
        <div class="app-contents-container">
            <div class="row">
                <div class="col-12">
                    <p class="h5">{{processName}}{{cLoaded}}</p>                                        
                </div>
                <div class="col-12 col-xl-3">
                    <div class="form-group">
                        <label for="inputMBranchId">名称</label>
                        <input type="text" class="form-control" v-model="dRow.po_material_name" />                                         
                    </div>                                        
                </div>
                <div class="col-12 col-xl-3 pl-xl-0">
                    <div class="row ml-0">
                        <div class="pl-0 pr-0">
                            <div class="form-group">
                                <label>発注日</label>
                                <ex-v-date-picker v-model="dRow.t_p_order.order_date_from" />
                            </div>
                        </div>
                        <div class="col-1 pl-0 pr-0">
                            <div class="form-group">
                                <p>&emsp;</p>
                                <p class="text-center">～</p>
                            </div>
                        </div>
                        <div class="pl-0">
                            <div class="form-group">
                                <label>&emsp;</label>
                                <ex-v-date-picker v-model="dRow.t_p_order.order_date_to" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 text-right pb-2">    
                    <button type="button" class="btn btn-success w-auto" @click.prevent="search(dRow)">
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
            <div class="row">
                <div class="col-12">
                    <div class="table-responsive">
                        <table class="table table-dark text-nowrap">
                                        
                            <thead>
                                <tr>
                                    <th scope="col">Actions</th>
                                    <th scope="col">発注No.<br>明細No.</th>
                                    <th scope="col">名称</th>
                                    <th scope="col">数量</th>
                                    <th scope="col">単位</th>
                                    <th scope="col">発注先</th>
                                    <th scope="col">納期</th>
                                    <th scope="col">発注拠点</th>
                                    <th scope="col">発注担当者</th>
                                    <th scope="col">発注日</th>
                                    <!-- <th scope="col">Delete</th>-->
                                </tr>
                            </thead>
                            <tbody>
                                <template>
                                    <tr v-for="n in dSearchedList" :key="n.id">
                                        <td>
                                            <ns-checkbox-input
                                                v-model="n.link_flg"
                                                :id="`tPOrderLinkCheckBox${n.id}`"
                                                />
                                        </td>
                                        <td>
                                            <span>{{n.t_p_order_id}}-{{n.id}}</span>
                                        </td>
                                        <td>{{n.po_material_name}}</td>
                                        <td class="text-right">{{n.qty}}</td>
                                        <td>{{n.unit_m_kv.kv_name}}</td>
                                        <td>{{n.t_p_order.supplier_m_customer.short_name_or_name}}</td>
                                        <td>{{m$cDateFormat(n.due_date)}}</td>
                                        <td>{{n.t_p_order.m_branch.short_name}}</td>
                                        <td>{{n.t_p_order.m_user.full_name}}</td>
                                        <td>{{m$cDateFormat(n.t_p_order.order_date)}}</td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="col-12 text-right">
                    <button type="button" class="btn btn-primary" @click.prevent="linkTPOrder">決定</button>
                </div>
            </div>
            <pagination
                :p-pagination.sync="dPagination"
                @search="search(dRow,$event)"
                />
        </div>
        
    </div>
    
    
</template>

<script>
import PageMixins from '../../../mixins/commons/PageMixins';
import TPOrderMixins from '../mixins/TPOrderMixins'
import DayJsEx from "./../../../frameworks/DayJsEx" ;
import _ from "lodash";

export default {
    mixins : [PageMixins,TPOrderMixins] , 
    data : function(){
        return {
            apiName : "tPOrderDetail" ,

            dRow : {
                po_material_name : "",
                total_price : 0,

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
            dPagination : {                         // pagination
                links : [] ,                        // リンク
                total : -1 ,                        // 合計件数
                from : -1 ,                         // 現在ページの開始位置
                to : -1 ,                           // 現在ページの終了位置
            } ,
            dSearchedList : [],

            dSelectedCategoryMkv : "",
            dSearchBranchId : undefined , /* ログイン担当者の拠点id */

            dLoading : false ,
        }
    },
    props :{
        processName:{
            type:String,
        } ,
    } ,
    mounted()  {
    } ,

    computed:{
        
        cEndpoint : function () {
            let ep =  `api/${this.apiName}` ;
            return  ep ;
        } ,
        cLoaded : function () {
            if (this.mainStore.isAppReady) {
                this.dSearchBranchId = this.mainStore.loginMUser.m_branch_id ; 
            }
            return "" ;
        }

    },
    methods : {
        search : async function (param,url){
                this.dLoading = true ;
                this.dRow = _.cloneDeep(param) ;

            try {
                //const res = await axios.get(ep + "/retrieve" ,{ params :getParams }) ;
                const ep = (url? url : this.cEndpoint + "/retrieveWithParent") ;
                
                const res = await axios.post(ep , this.dRow ) ;
                
                // pagination関連
                this.dPagination.links = res.data.links ;   // リンク
                this.dPagination.total = res.data.total ;   // 合計件数
                this.dPagination.from  = res.data.from ;    // 現在ページの開始位置
                this.dPagination.to    = res.data.to ;      // 現在ページの終了位置
                
                const resList =  _.cloneDeep(res.data.data) ;
                resList.link_flg = false ;

                this.dSearchedList = resList ;

                
            }
            catch (error) 
            {
                // handle error
                this.$$errorConsole(error ,this.cEndpoint ) ; 

            } finally {
                this.dLoading = false ;
            }
        },

        linkTPOrder : function() {
            const checkedList = this.dSearchedList.filter(x => x.link_flg) ;

            for(const x of checkedList) {
                x.t_project_product_process_order_detail = {
                // t_p_order_detail_id : resList.id ,
                    is_preceding : 1 ,
                } ;
            }

            this.$emit("setPO",checkedList)

            // console.log(checkedList) ;
        }
        
    } ,
    created : function (){
    } ,
    
}

</script>