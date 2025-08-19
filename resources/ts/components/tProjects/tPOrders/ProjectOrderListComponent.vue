<template>
    <div>
        <div class="table-responsive">
            <table class="table table-dark text-nowrap">
                <thead>
                    <tr>
                        <th>材料名</th>
                        <th>発注済</th>
                        <th>発注拠点</th>
                        <th>仕入先</th>
                        <th>商品名</th>
                        <th>寸法</th>
                        <th style="min-width:200px">数量</th>
                        <th>参考数量</th>
                        <!-- <th v-if="isViewPrice">単価</th> -->
                        <th>納期/納品場所</th>
                        <th style="min-width:200px">備考</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(n,index) in cList">
                        <td>
                            <p> {{n.display_name}}</p>
                            <div>
                                <div v-if="isTProject && n.t_p_order_details.length==0 && !n.is_outsource" class="custom-control custom-checkbox">
                                    <!-- 描画用 -->
                                    <input 
                                        class="custom-control-input" 
                                        type="checkbox" 
                                        :checked="n.is_use_stocked ">
                                    <!-- 値変更用 -->
                                    <input
                                        type="checkbox"
                                        class="form-check-input"
                                        :id="'isUseStockedInput' + n.t_project_product_process_id"
                                        v-model="n.is_use_stocked"
                                        @click.prevent="$emit('checked',n)"                                        
                                        style="opacity:0;"
                                        >

                                    <label class="custom-control-label" :for="'isUseStockedInput' + n.t_project_product_process_id">在庫使用</label>
                                </div>
                            </div>                            
                        </td>
                        <td>
                            <div v-if="n.t_p_order_details.length>0" >
                                <p v-for="orderDs in n.t_p_order_details" :key="orderDs.id" class="text-success">{{formatMMaterialDetailName(orderDs.material_size_x,orderDs.material_size_y)}} * {{orderDs.qty}}</p>
                            </div>
                        </td>
                        <td>
                            <p>{{n.m_branch.shortNameOrName}}</p>
                        </td>
                        <td>
                            <p>{{n.supplier_m_customer.short_name_or_name}}</p>
                        </td>
                        <td>
                            <p>{{n.product_name}}</p>
                            <p v-if="!n.t_project_product_process_id" class="text-danger">商品情報が保存されていません</p>
                        </td>

                        <td>
                            <div v-for="i in n.m_material_details" :key="i.t_project_product_process_id">
                                <div class="form-row" v-if="!i.is_able_to_input_size">
                                    <div style="height:36.39px;" class="mb-2">{{i.detail_name}}</div>
                                </div>
                                <div v-else class="d-flex" >
                                    <div class="mb-2">
                                        <ns-number-input class="app-input-size"
                                            v-model="i.width"
                                            />
                                    </div>
                                    <p class="mx-2 pt-1">x</p>
                                    <div class="mb-2">
                                        <ns-number-input class="app-input-size"
                                            v-model="i.height"
                                            />
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div v-for="i in n.m_material_details" :key="i.t_project_product_process_id" class="d-flex">
                                <ns-number-input
                                    class="app-input-size mb-2"
                                    v-model="i.qty"
                                    :disabled="cDisabledCondition1(n)"
                                    />
                                <m-kv-select
                                    class="ml-2"
                                    :selected-item.sync="i.unit_m_kv"
                                    :kv-key="'m_materials-unit_m_kv_id'"
                                    v-model="i.unit_m_kv_id"
                                    v-if="!i.id" />
                                <p v-else class="mt-auto ml-2">{{i.unit_m_kv.kv_name}}</p>
                            </div>
                        </td>
                        
                        <td class="text-right">{{n.num_of_needed}}</td>
                        <!-- <td class="text-right"  v-if="isViewPrice">
                            <p v-for="i in n.m_material_details" :key="i.t_project_product_process_id" class="mb-4">
                                {{i.unit_price.toLocaleString()}}
                            </p>
                        </td> -->
                        <td>
                            <div class="mb-2">
                                <ex-v-date-picker
                                    v-model="n.due_date"
                                    :input-disabled="cDisabledCondition1(n)"
                                    />
                            </div>
                            
                            <div class="form-group">
                                <input v-model="n.shipping_address" type="text" class="form-control" :disabled="cDisabledCondition1(n)">
                            </div>  
                        </td>
                        <td>                            
                            <div class="form-group">
                                <input v-model="n.slip_memo" type="text" class="form-control" :disabled="cDisabledCondition1(n)">
                                <span class="validation-info" v-show="!m$cIsOkStrLen(n.slip_memo,30)">文字数がオーバーしています</span>
                            </div>
                        </td>

                    </tr>
                </tbody>
            </table>
        </div>
        <div class="row">
            <div class="col">
                <div class="text-right mt-2">
                    <button type="button" class="btn btn-success" @click.prevent="postOrder()">
                        材料発注
                    </button>
                </div>

            </div>

        </div>
    </div>
    
</template>
<script>

import DayJsEx from "../../../frameworks/DayJsEx" 
import ObjectUtil from '../../../frameworks/ObjectUtil';
import TPOrderMixins from '../../tPOrders/mixins/TPOrderMixins';
import _ from 'lodash';

export default {
    mixins : [TPOrderMixins] ,
    data : function(){
        return {

        }
    } , 

    props : {
        list : {
            type : Array
        } ,
        isTProject : {
            type : Boolean
        } ,
        orderProjectName : {
            type : String 
        } ,

        /**
         * 金額表示
         */
        isViewPrice : {
            type : Boolean , 
            default : () => false ,
        } , 


    } ,

    computed : {

        cList : function(){
            return this.list ;
        } ,

        /*入力項目制御系*/
        //数量,納期 
        cDisabledCondition1 : function() {
            return function(row) {
                if(!row.t_project_product_process_id || row.is_use_stocked ) return true ;
            }
        } ,
        //在庫使用チェック
        cDisabledCondition2 : function() {
            return function(row) {
                if(!row.t_project_product_process_id ) return true ;
            }
        } ,
    } ,

    methods : {
        dateFormat : function(value) {
            if(_.isEmpty(value)) return "" ;
            return DayJsEx.format(value , "YYYY-MM-DD")
        } ,

        /**寸法描画用フォーマット */
        formatMMaterialDetailName : function(w,h){

            if( w <= 0 && h <= 0) return "" ;

            return '[ '+ w.toLocaleString() + ' × ' + h.toLocaleString() + ' mm ]'

        },
        /**2回目以降の発注で単位データが消えるためIdから取得 */
        getMKv : function(id) {

            if ( this.mainStore.masters.MKvCategories.length === 0 ) return [] ;

            const category = this.mainStore.masters.MKvCategories.find(e => e.kv_key == "m_materials-unit_m_kv_id") ;

            if ( category === undefined) return [] ;

            const kv = category.m_kvs.find(x => x.id === id) ;

            return kv ;

        } ,

        postOrder : function(){

             //数量が1以上の物を抜き出し
            let candidateList = [] ;

            const list = this.cList.filter(x => !x.is_use_stocked) ;


            for(const row of list) {

                for(const det of row.m_material_details) {

                    //親子1対1
                    const copy = ObjectUtil.deepCopyJ(row) ;
                    delete copy.m_material_details ;

                    if(det.qty>0){

                        copy.m_material_detail = det ;
                        candidateList.push(copy) ;

                    }

                }

            }

            if(candidateList.length==0) {
                alert("発注する材料の数量を入力してください")
                return ;
            }

            this.dLoading = true ;
            let tPOrder = [] ;


            for(const x of candidateList ) {

                x.t_project.po_project_name = this.orderProjectName ;

                //発注用のデータに置き換え
                const formatRow = {
                    m_branch_id            : x.m_branch_id ,
                    m_branch               : x.m_branch ,
                    supplier_m_customer_id : x.supplier_m_customer_id ,
                    supplier_m_customer    : x.supplier_m_customer ,
                    m_user_id              : this.$$cLoginUserId ,
                    m_user                 : this.mainStore.loginMUser ,
                    order_date             : this.dateFormat(Date()) ,
                    slip_memo              : null ,
                    t_p_order_details      : [] ,
                    created_m_user_id      : this.$$cLoginUserId ,
                    updated_m_user_id      : this.$$cLoginUserId ,
                    updated_m_user         : this.mainStore.loginMUser ,
                }

                const detailRow = { 
                    m_material_detail_id                    : x.m_material_detail.id ,
                    material_name                           : x.name,
                    po_material_name                        : x.name,
                    material_size_x                         : x.m_material_detail.width ,
                    material_size_y                         : x.m_material_detail.height ,
                    shipping_address                        : x.shipping_address ,
                    due_date                                : x.due_date ?? this.m$addDay(formatRow.order_date,1),
                    price                                   : x.m_material_detail.unit_price ,
                    total_price                             : x.m_material_detail.unit_price*x.m_material_detail.qty ,
                    is_display_price                        : _.isNil(x.m_material_detail_id) ? 1 : 0 ,
                    qty                                     : x.m_material_detail.qty ,
                    unit_m_kv_id                            : x.m_material_detail.unit_m_kv_id ,
                    unit_m_kv                               : this.getMKv(x.m_material_detail.unit_m_kv_id) ,
                    t_project_id                            : x.t_project_id ,
                    t_project                               : x.t_project ,
                    t_project_product_process_id            : x.t_project_product_process_id ,
                    t_project_product_processes             : [x.t_project_product_processes] ,
                    // t_project_product_process_order_details : x.t_project_product_process_order_details ,
                    slip_memo                               : x.slip_memo ,
                    created_m_user_id                       : this.$$cLoginUserId ,
                    updated_m_user_id                       : this.$$cLoginUserId ,
                }

                //同一仕入れ先の材料をまとめる
                const found = tPOrder.find(y=>y.supplier_m_customer_id == formatRow.supplier_m_customer_id);
                const foundIdx = tPOrder.indexOf(found) ;

                if(foundIdx==-1) {

                    formatRow.t_p_order_details.push(detailRow) ;
                    tPOrder.push(formatRow) ;

                } else {

                    tPOrder[foundIdx].t_p_order_details.push(detailRow) ;
                
                }

            }

            this.$emit("postOrder" , tPOrder) ;

        }

    }
    
}
</script>