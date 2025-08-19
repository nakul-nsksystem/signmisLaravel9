<template>
    <div> 
        <div class="app-contents-container">
    
            <div class="row">
                <div class="col-12 col-xl-2">
                    <div class="form-group">
                        <label for="inputMBranchId">発注拠点</label>
                        <m-branch-select 
                            v-model="dParams.m_branch_id" 
                        ></m-branch-select>
                    </div>
                </div>
                <div class="col-12 col-xl-3 pl-xl-0">
                    <div class="form-group">
                        <label for="inputMBranchId">発注先</label>
                        <m-customer-ref-input
                            v-model="dParams.supplier_m_customer_id"
                            :mBranchId="dParams.m_branch_id"
                            :dealing-cds="[2]"
                            />
                    </div>
                    
                </div>
                
                <div class="col-12 col-xl-3 pl-xl-0">
                    <div class="form-group">
                        <label for="inputMBranchId">名称</label>
                        <input type="text" class="form-control" v-model="dParams.display_order_01" />                                         
                    </div>                                        
                </div>
                <div class="col-12 col-xl-2 pl-xl-0">
                    <div class="form-group">
                        <label for="">ステータス</label>
                        <select v-model="dParams.t_p_order_details.approved" class="form-control">
                            <option></option>
                            <option selected></option>
                            <option value=0>未発注</option>
                            <option value=1>発注済</option>
                        </select>
                    </div>
                </div>
                
                
            </div>
            <div class="row">
                <div class="col-12 col-xl-3">
                    <div class="form-group">
                        <label for="inputMBranchId">物件名</label>
                        <input type="text" class="form-control" v-model="dParams.t_project_product.t_project.name" />
                    </div>
                </div>
                
                <div class="col-12 col-xl-3">
                    <div class="row ml-0">
                        <div class="pl-0 pr-0">
                            <div class="form-group">
                                <label>物件受注日</label>
                                <ex-v-date-picker v-model="dParams.t_project_product.t_project.ordered_at_from" />
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
                                <ex-v-date-picker v-model="dParams.t_project_product.t_project.ordered_at_to" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-xl-3 pl-xl-0">
                    <div class="row ml-0">
                        <div class="pl-0 pr-0">
                            <div class="form-group">
                                <label>物件納期</label>
                                <ex-v-date-picker v-model="dParams.t_project_product.t_project.min_delivery_from" />
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
                                <ex-v-date-picker v-model="dParams.t_project_product.t_project.min_delivery_to" />
                            </div>
                        </div>
                    </div>
                </div>
                
                
            </div>  
            <div class="col-12 text-right pr-0 pb-2">    
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
            <project-order-list-component 
                :list="cNeedtoOrder"
                :is-t-project="false"
                @postOrder="postOrder"
                />

            <div id="modalOrder"
                class="modal fade bd-example-modal-xl"
                tabindex="-1"
                role="dialog"
                aria-labelledby="modalOrder"
                aria-hidden="true"
                style="margin-top: 0px;"
                v-show="dOrderListModal">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="app-contents-container text-right">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true" class="text-white">&times;</span>
                            </button>
                        </div>
                        <t-p-order-list
                            :purchase-order="dOrderList"
                            :is-t-project="true"
                            :is-show="dOrderListModal"
                            @setOrderedRow="setOrderedRow"
                            />
                    </div>

                </div>
            </div>
        </div>
        <pagination
            :p-pagination.sync="dPagination"
            @search="search($event)"
        />
    </div>

</template>

<script>

import DayJsEx from "../../frameworks/DayJsEx" ;
import ObjectUtil from '../../frameworks/ObjectUtil';
import _ from "lodash" ;
import PageMixins from '../../mixins/commons/PageMixins';


export default {
    mixins : [PageMixins] , 

    data :  function() {
        return {

            dFilter : undefined ,
            dLoading : false ,


            //モーダル用
            dOrderList : [] ,
            dOrderListModal : false ,

            dSearchedList : [] ,

            //検索パラメータ
            dParams : {
                m_branch_id : 0,
                supplier_m_customer_id : 0,
                display_order_01 : "" ,
                is_order_needed : 1 ,
                is_enabled : 1 ,
                is_use_stocked : 0 ,
                t_project_product : {

                    t_project : {
                        name : "",
                        ordered_at_from : undefined,
                        ordered_at_to : undefined,
                        min_delivery_from : undefined,
                        min_delivery_to : undefined,
                    },
                } ,

                t_p_order_details:{
                    
                } ,

            },

            dPagination : {                         // pagination
                links : [] ,                        // リンク
                total : -1 ,                        // 合計件数
                from : -1 ,                         // 現在ページの開始位置
                to : -1 ,                           // 現在ページの終了位置
            } ,



        }
    } ,

    computed : {
        //t_project_products_processから要発注項目を抜き出して成型
        cNeedtoOrder : function(){
            if(!this.dSearchedList?.length) return [] ;

            const result = [] ;

            for(const process of this.dSearchedList) {

                const tProduct =  process.t_project_product ;
                const tProject =  process.t_project_product.t_project ;
                const tPOrderDs = process.t_p_order_details ;

                // 分割があるかの判定
                let isSeparate = 0 ;
                if( tProduct.t_project_product_separates.length >0 ) isSeparate = 1 ;

                const shippingAddress = tPOrderDs.length > 0 ? tPOrderDs.shipping_address : "" ;
                const slipMemo        = tPOrderDs.length > 0 ? tPOrderDs.slip_memo : "" ;

                //描画用情報
                const viewList = {
                    name                         : process.display_order_01 ,
                    display_name                 : process.display_order_01 ,
                    product_name                 : tProduct.name ,
                    num_of_needed                : null ,
                    supplier_m_customer_id       : 0 ,
                    supplier_m_customer          : {
                                                    name               : process.display_order_03 ,
                                                    short_name_or_name : process.display_order_04 ,
                                                    } ,
                    short_hand                   : 0 , //製品短手
                    is_separate                  : isSeparate , //分割フラグ
                    m_branch_id                  : process.m_branch_id ,
                    m_branch                     : this.cMBranch(process.m_branch_id) ,
                    due_date                     : null ,
                    t_project_product_process_id : process.id ,
                    is_use_stocked               : process.is_use_stocked , //在庫使用フラグ
                    m_material_id                : null ,
                    m_material_details           : [] ,                     //寸法など明細行
                    t_project_id                 : tProject.id ,
                    t_project                    : tProject ,                                                   
                    t_p_order_details            : tPOrderDs ,
                    shipping_address             : shippingAddress ,
                    slip_memo                    : slipMemo ,
                    product_cat_order_no         : tProduct.m_product_category.order_no //ソート用
                }

                //明細行詳細 m_material_detailsのカラム名に統一
                const det = {
                    id                           : null , // m_material_detail_id
                    detail_name                  : "" ,
                    qty                          : 0 ,
                    unit_m_kv                    : {} ,
                    unit_m_kv_id                 : null ,
                    unit_price                   : 0 ,
                    width                        : 0 ,
                    height                       : 0 ,
                    t_project_product_process_id : process.id ,

                }

                const categoryId = process.m_process_category_id ;


                /**
                 *1,材料系（メディア、ラミ、板） 
                    */                    
                if(!process.is_outsource) {

                    viewList.num_of_needed          = process.n_13 ;
                    viewList.supplier_m_customer_id = process.supplier_m_customer_id ;
                    
                    //板
                    if( tProduct.t_project_product_boardlayouts.length>0) {

                        for(const boardLayout of tProduct.t_project_product_boardlayouts) {

                            const copyDet = ObjectUtil.deepCopyJ(det) ;

                            viewList.num_of_needed = boardLayout.qty ;

                            //板マスタ呼び出し 
                            if(boardLayout.m_material_detail_id) {
                                
                                const materialDsCopy = ObjectUtil.deepCopyJ( boardLayout.m_material_detail) ;

                                viewList.supplier_m_customer_id = boardLayout.m_material_detail.m_material.supplier_m_customer_id ;

                                //寸法指定があった場合
                                if(boardLayout.w) materialDsCopy.width = boardLayout.w ;     
                                if(boardLayout.h) materialDsCopy.height = boardLayout.h ; 
                                materialDsCopy.detail_name = process.display_order_02 ;

                                viewList.m_material_details.push(materialDsCopy) 

                            //板手入力                                 
                            } else {

                                copyDet.unit_price  = boardLayout.price ;
                                copyDet.width       = boardLayout.w ;
                                copyDet.height      = boardLayout.h ;
                                copyDet.detail_name = this.formatMMaterialDetailName(boardLayout.w,boardLayout.h) ;

                                viewList.m_material_details.push(copyDet) ;

                            }

                        }

                        result.push(viewList) ;

                    //幕ラミ塩ビ手入力
                    } else if (!process["m_material_id_01"]) {
                        det.unit_price  = process.n_05 ;
                        det.width       = process.n_01 ;
                        det.height      = process.n_03 ;

                        if(categoryId == 6 || categoryId == 3) {

                            det.height = process.n_03*1000 ; //巻M数を巻MM数に変換(ロール系資材)

                        }

                        det.detail_name = process.display_order_02 ;

                        viewList.m_material_details.push(det) ;

                        result.push(viewList) ;
                    
                    //幕ラミ塩ビ材料マスタ呼び出し
                    } else {
                        for (let i = 1; i <= 25; i++) {

                            let count = i + '' ;
                            let colName ;
                            i<10 ? colName = 'm_material_id_' + '0'+ count  : colName = 'm_material_id_' + count ;

                            //該当カラムに情報がない場合
                            if(!process[colName]) continue ;

                            if(categoryId == 6 || categoryId == 3) {
                                //短手取得(ロール系資材)
                                const W = tProduct.size_w + tProduct.size_extend_l + tProduct.size_extend_r ;
                                const H = tProduct.size_h + tProduct.size_extend_t + tProduct.size_extend_b ;
                                viewList.short_hand = Math.min( W , H ) ;

                            }

                            viewList.m_material_id = process[colName] ;

                            result.push(viewList) ;

                        }

                    }

                /**
                 * 2,外注系
                 */
                } else {
                    viewList.supplier_m_customer_id = process.supplier_m_customer_id ;
                    viewList.num_of_needed          = process.outsource_qty ;
                    det.unit_price                  = process.outsource_cost ;

                    viewList.m_material_details.push(det) ;
                    result.push(viewList) ;

                }
            }
            

            return result ;

        } ,

        /**発注済リスト */
        cOrderedList : function() {
            if(this.cNeedtoOrder.length == 0) return [] ;

            const tPOrderDs = [] ;

            for(const row of this.cNeedtoOrder) {

                tPOrderDs.push(...row.t_p_order_details)

            }

            return tPOrderDs ;

        } ,

    } ,
    methods : {
        dateFormat : function(value) {
            if(value === "" || value ===null) return  ;
            return DayJsEx.format(value , "YYYY-MM-DD")
        } ,
        /**寸法描画用フォーマット */
        formatMMaterialDetailName : function(w,h){

            if( w <= 0 && h <= 0) return "" ;

            return '[ '+ w.toLocaleString() + ' × ' + h.toLocaleString() + ' mm ]'

        },



        search : async function(url) {

            this.dLoading = true ;

            try {


                const getParams = ObjectUtil.deepCopyJ(this.dParams) ; 
                
                const ep = (url? url : "api/tProjectProductProcess/retrieveWithTPOrderDetails") ;
                const res = await axios.post(ep, getParams) ; 
                // console.log(res.data) ;

                // const resList = JSON.parse(JSON.stringify(res.data)) ;
                const resList = ObjectUtil.deepCopyJ(res.data.data) ;
                // console.log(resList) ;

                // pagination関連
                this.dPagination.links = res.data.links ;   // リンク
                this.dPagination.total = res.data.total ;   // 合計件数
                this.dPagination.from  = res.data.from ;    // 現在ページの開始位置
                this.dPagination.to    = res.data.to ;      // 現在ページの終了位置

                this.dSearchedList = ObjectUtil.deepCopyJ(resList)
                
            }
            catch (error) 
            {
                // handle error
                this.$$errorConsole(error, ep) ; 
            }

            this.dLoading = false ;

        },


        //発注
        postOrder : async function(tPOrder) {
            
            if(!tPOrder) return ;

            this.dOrderList = tPOrder ;
            $('#modalOrder').modal() ;

            this.dOrderListModal = true ;


        } ,
        //発注リストからのreturnを発注済リストに挿入
        setOrderedRow : function(tPOrders) {
            if(!tPOrders) return ;


            for(const row of tPOrders) {

                const parsed = ObjectUtil.deepCopyJ(row) ;
                delete parsed.t_p_order_details ;

                for(const details of row.t_p_order_details) {

                    details.t_p_order = parsed ;

                    // this.cOrderedList.push(details) ;

                        const found = this.dSearchedList.find(x => x.id == details.t_project_product_process_id );
                        found.t_p_order_details.push(details) ;


                }

            }


        } ,

    } ,
    created() {
        this.dParams.m_branch_id = this.mainStore.loginMUser.m_branch_id
    }
}
</script>
<style scoped>



</style>