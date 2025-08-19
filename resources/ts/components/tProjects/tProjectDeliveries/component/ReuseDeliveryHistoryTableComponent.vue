<template>
    <div>
        <div class="app-contents-container">
            <div class="row">
                <div class="col-12 col-xl-2">
                    <div class="form-group">
                        <label for="inputMBranchId">{{ cLoaded }}拠点</label>
                        <m-branch-select 
                            v-model="dRow.t_project.m_branch_id" 
                            />
                    </div>
                </div>
                <div class="col-12 col-xl-3 pl-xl-0">
                    <div class="form-group">
                        <label for="inputMBranchId">納品先</label>
                        <m-customer-ref-input 
                            v-model="dRow.delivery_m_customer_id"
                            :mBranchId="dRow.t_project.m_branch_id"
                            :dealing-cds="[1,8]"
                            />
                    </div>
                </div>
                <div class="col-12 col-xl-3 pl-xl-0">
                    <div class="form-group">
                        <label for="inputMBranchId">荷主</label>
                        <m-customer-ref-input 
                            v-model="dRow.delivery_owner_m_customer_id"
                            :mBranchId="dRow.t_project.m_branch_id"
                            :dealing-cds="[1,8]"
                            />
                    </div>
                </div>
                <div class="col-12 col-xl-3 pl-xl-0">
                    <div class="row ml-0">
                        <div class="pl-0 pr-0">
                            <div class="form-group">
                                <label>出荷日</label>
                                <ex-v-date-picker v-model="dRow.delivery_at_from" />
                            </div>
                        </div>
                        <div class="col-1 pl-0 pr-0">
                            <div class="form-group">
                                <p>&emsp;</p>
                                <p class="text-center">～</p>
                            </div>
                        </div>
                        <div class="    pl-0">
                            <div class="form-group">
                                <label>&emsp;</label>
                                <ex-v-date-picker v-model="dRow.delivery_at_to" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-xl-2">
                    <div class="form-group">
                        <label for="inputCategoryMKvId">納品形態</label>
                        <m-kv-select
                            id="inputCategoryMKvId"
                            :kv-key="'t_projects-delivery'"
                            v-model="dRow.delivery_m_kv_id"
                            />
                    </div>
                </div>
                <div class="col-12 col-xl-2 pl-xl-0">
                    <div class="form-group">
                        <label for="inputMBranchId">物件コード</label>
                        <input type="text" class="form-control" v-model="dRow.t_project.cd" />                                         
                    </div>                                        
                </div>
                <div class="col-12 col-xl-2 pl-xl-0">
                    <div class="form-group">
                        <label for="inputMBranchId">物件名</label>
                        <input type="text" class="form-control" v-model="dRow.t_project.name" />
                    </div>
                </div>
            </div>  
            <div class="col-12 text-right pr-0 pb-2"> 
                
                <button type="button" class="btn btn-success" @click.prevent="search()" :disabled="dLoading4Search">
                    <div v-if="dLoading4Search">
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        検索中...
                    </div>
                    <div v-else>
                        <i class="fas fa-search fa-fw"></i>
                        検索
                    </div>
                </button>
            </div>  
            <div class="row">
                <div class="col-12">
                    <div class="table-responsive-xl">
                        <table class="table table-dark text-xl-nowrap">
                            <thead>
                                <tr>
                                    <th scope="col" style="min-width:100px">納品形態</th>
                                    <th scope="col" style="min-width:150px">出荷日<br>着日</th>
                                    <th scope="col" style="min-width:200px" v-if="!param.isOwner">納品先情報</th>
                                    <th scope="col" style="min-width:200px" v-else>荷主情報</th>
                                    <th scope="col" style="min-width:150px">物件コード<br>物件名</th>
                                    <th scope="col" style="min-width:200px">備考</th>      
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="n in dSearchedList" :key="n.id">                                    
                                    <td>
                                        {{n.delivery_m_kv.kv_name}}<br />
                                        <m-tag-viewer
                                            class="mt-1"
                                            :tag-category-key="dTagCategoryKey"
                                            :selected="n.m_tags"
                                            />
                                    </td>
                                    <td>
                                        <div>{{dateFormat(n.delivery_at)}}&nbsp;{{n.delivery_time}}</div>
                                        <div>{{dateFormat(n.arrival_at)}}&nbsp;{{n.arrival_time}}</div>
                                    </td>
                                    <td v-if="!param.isOwner">
                                        <div>{{n.delivery_customer_name}}</div>
                                        <div v-show="n.delivery_customer_zip">〒{{n.delivery_customer_zip}}</div>
                                        <div>{{n.delivery_customer_address}}</div>
                                        <div>{{n.delivery_customer_tel}}</div>
                                        <div>{{n.delivery_customer_user}}</div>
                                    </td>
                                    <td v-else>
                                        <div>{{n.delivery_owner_name}}</div>
                                        <div v-show="n.delivery_owner_zip">〒{{n.delivery_owner_zip}}</div>
                                        <div>{{n.delivery_owner_address}}</div>
                                        <div>{{n.delivery_owner_tel}}</div>
                                        <div>{{n.delivery_owner_user}}</div>
                                    </td>

                                    <td>
                                        {{n.t_project.cd}}<br>{{n.t_project.name}}
                                    </td>                        
                                    <td>
                                        {{n.memo}}    
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-info" @click.prevent="$emit('setHistory',n)"><i class="fas fa-link fa-fw"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-xl-6">
                    <pagination
                        :p-pagination.sync="dPagination"
                        @search="search($event)"
                        />
                </div> 
            </div>

        </div>
        
    </div>
    
    
</template>

<script>

import ObjectUtil from '../../../../frameworks/ObjectUtil';
import DayJsEx from "../../../../frameworks/DayJsEx" ;
import DeliveryMCustomerSelect from '../../../commons/master/DeliveryMCustomerSelect.vue';
import { MCustomer } from "../../../masters/class/models/MCustomer";
import { TProjectDelivery } from '../../class/models/TProjectDelivery';
import _ from "lodash" ;

export default {
  components: { DeliveryMCustomerSelect },

    data :  function() {
        return {

            dApiName : "tProjectDelivery" ,

            //登録フラグ
            dSaveMCustomerFlg : false ,

            dMCustomerSelectedId : undefined,
            dMCustomerItem : {} ,
            dLoading4Search : false ,


            dRow : {
                delivery_m_customer_id : undefined,
                delivery_owner_m_customer_id : undefined,
                delivery_at_from : undefined,
                delivery_at_to : undefined,
                delivery_completed_at : undefined ,
                is_reuse : 1 ,
                t_project:{
                    name : "" ,
                    cd : ""
                } ,
                m_tags : [],

            },

            dPagination : {                         // pagination
                links : [] ,                        // リンク
                total : -1 ,                        // 合計件数
                from : -1 ,                         // 現在ページの開始位置
                to : -1 ,                           // 現在ページの終了位置
            } ,

            dTagCategoryKey : "t_project_deliveries_designation" ,

            dSearchedList : [],

        }
    } ,
    props : {
        // t_project_deliveriesのレコード
        value : {
            type : Object ,
        } ,

        //納品先か荷主か
        param : {
            type : Object ,
        } ,

    } ,

    computed : {
        //納品先or荷主　描画用
        cCustOrOwner : function() {
            // return "納品先"
            return this.param.isOwner ? "荷主" : "納品先" ;
        } ,
        cEndpoint : function () {
            let ep =  `api/${this.dApiName}` ;
            return  ep ;
        } ,
        cLoaded : function () {

            if (this.mainStore.isAppReady && this.value !== undefined) {

                this.dRow.t_project.m_branch_id = this.value.tProjectBranchId ; 

            }

            return "" ;
        } ,    

    } ,
    methods : {
        search : async function (url){

            try {

                this.dLoading4Search = true ;

                if(this.param.isOwner) {

                    this.dRow.delivery_owner_name = 1 ;
                
                } else {

                    this.dRow.delivery_customer_name = 1 ;
                    
                }

                const getParams = _.cloneDeep(this.dRow) ; 
                
                const ep = (url? url : this.cEndpoint + "/retrieve") ;
                const res = await axios.post(ep, getParams) ; 
                // console.log(res.data) ;

                // const resList = JSON.parse(JSON.stringify(res.data)) ;
                const resList = _.cloneDeep(res.data.data) ; 

                // console.log(resList) ;

                // pagination関連
                this.dPagination.links = res.data.links ;   // リンク
                this.dPagination.total = res.data.total ;   // 合計件数
                this.dPagination.from  = res.data.from ;    // 現在ページの開始位置
                this.dPagination.to    = res.data.to ;      // 現在ページの終了位置

                this.dSearchedList = resList
                
            }
            catch (error) 
            {
                // handle error
                this.$$errorConsole(error, this.cEndpoint) ; 
            
            } finally {

                this.dLoading4Search = false ;

            }
        } ,
        dateFormat : function(value) {
            if(_.isNil(value)) return "" ;
            return DayJsEx.format(value , "YYYY-MM-DD")
        },
        clear : function() {

            this.dSearchedList = [] ;

            this.dRow = {
                delivery_m_customer_id : undefined,
                delivery_owner_m_customer_id : undefined,
                delivery_at_from : undefined,
                delivery_at_to : undefined,
                delivery_completed_at : undefined ,
                is_reuse : 1 ,
                t_project:{
                    name : "" ,
                    cd : ""
                } ,
                m_tags : [],

            } ;

            this.dPagination = {                    // pagination  
                links : [] ,                        // リンク
                total : -1 ,                        // 合計件数
                from : -1 ,                         // 現在ページの開始位置
                to : -1 ,                           // 現在ページの終了位置
            }  ;

        }
       
    } ,

}
</script>
<style scoped>



</style>