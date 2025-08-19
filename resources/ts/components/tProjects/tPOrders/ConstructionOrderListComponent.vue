<template>
    <div class="row">
        <div class="col-12">
            <div class="table-responsive">
                <table class="table table-dark text-nowrap">
                    <thead>
                        <tr>
                            <th scope="col">選択</th>
                            <th scope="col">外注先</th>
                            <th scope="col">施工日</th>
                            <th scope="col">担当者</th>
                            <th scope="col">人数</th>
                            <th scope="col">施工先</th>
                            <th scope="col">備考</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(n,index) in value">
                            <td>
                                <div v-if="!cIsOrdered(n.t_p_order_detail)">
                                    <ns-checkbox-input
                                        v-model="n.is_checked"
                                        :id="`constructionOrderCheck${index}`"  
                                        />
                                </div>
                                <div v-else>
                                    発注済：{{n.t_p_order_detail.t_p_order.id}}-{{n.t_p_order_detail.id}}

                                </div>
                                
                            </td>
                            <td>{{n.out_source_m_customer.short_name_or_name}}</td>
                            <td>{{dateFormat(n.delivery_at)}}</td>
                            <td>{{n.out_source_person_name}}</td>
                            <td>{{n.num_of_out_source_people}}</td>
                            <td>
                                <div>{{n.t_project_delivery.delivery_customer_name}}</div>
                                <div v-show="n.t_project_delivery.delivery_customer_zip">〒{{n.t_project_delivery.delivery_customer_zip}}</div>
                                <div>{{n.t_project_delivery.delivery_customer_address}}</div>
                            </td>
                            <td>
                                <div class="form-group">
                                    <input type="text" class="form-control" v-model="n.slip_memo">                                        
                                    <span class="validation-info" v-show="!m$cIsOkStrLen(n.slip_memo,30)">文字数がオーバーしています</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="col-12 text-right">
            <button type="button" class="btn btn-success" @click.prevent="postOrder">施工発注</button>
        </div>
    </div>
    
</template>
<script>

import DayJsEx from "../../../frameworks/DayJsEx" 
import ObjectUtil from '../../../frameworks/ObjectUtil';
import TPOrderMixins from '../../tPOrders/mixins/TPOrderMixins';
import _ from 'lodash'
export default {
    mixins : [TPOrderMixins] ,

    data : function(){
        return {
            dLoading : false ,
        }
    } , 

    props : {
        value : {
            type : Array,
        } ,

        orderProjectName : {
            type : String 
        } ,
        

    } ,

    computed : {

        //発注済かどうかの判定
        cIsOrdered : function () {
            return function(tPOd) {
                return !_.isEmpty(tPOd)
            }
        }

    } ,

    methods : {
        dateFormat : function(value) {
            if(_.isNil(value)) return "" ;
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
            const candidateList = this.value.filter(x => x.is_checked) ;

            if(candidateList.length == 0) {
                alert("発注する施工外注を選択してください")
                return ;
            }

            this.dLoading = true ;
            let tPOrder = [] ;

            for(const x of candidateList ) {

                x.t_project.po_project_name = this.orderProjectName ;

                //発注用のデータに置き換え
                const formatRow = {
                    // is_construction        : true ,
                    m_branch_id            : x.out_source_m_branch_id ,
                    m_branch               : x.out_source_m_branch ,
                    supplier_m_customer_id : x.out_source_m_customer_id ,
                    supplier_m_customer    : x.out_source_m_customer ,
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
                    m_material_detail_id           : null ,
                    material_name                  : this.dateFormat(x.delivery_at) + "施工",
                    po_material_name               : this.dateFormat(x.delivery_at) + "施工",
                    material_size_x                : 0 ,
                    material_size_y                : 0 ,
                    shipping_address               : null ,
                    due_date                       : null ,
                    price                          : x.out_source_price ,
                    total_price                    : x.out_source_total_price ,
                    qty                            : x.num_of_out_source_people ,
                    is_display_price               : 1 ,
                    unit_m_kv_id                   : 1530018 ,
                    unit_m_kv                      : this.getMKv(1530018) ,//単位人固定
                    t_project_id                   : x.t_project_id ,
                    t_project                      : x.t_project ,
                    t_project_product_process_id   : null ,
                    t_project_construction_user_id : x.t_project_construction_user_id ,
                    slip_memo                      : x.slip_memo ,
                    created_m_user_id              : this.$$cLoginUserId ,
                    updated_m_user_id              : this.$$cLoginUserId ,
                }

                //同一仕入れ先の材料をまとめる
                const found = tPOrder.find(y=>y.supplier_m_customer_id == formatRow.supplier_m_customer_id);
                const foundIdx = tPOrder.indexOf(found) ;

                if( foundIdx == -1 ) {

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