<template>
    <div id="modalDeliveryProductLink" 
            class="modal fade" 
            tabindex="-1" 
            role="dialog" 
            aria-labelledby="modalDeliveryProductLink" 
            aria-hidden="true" 
            data-backdrop="static"
            style="margin-top: 0px;" 
            v-show="dDeliveryProductLinkModal">
        <div class="modal-dialog modal-dialog-fluid">
            <div class="app-modal-content-dark p-3">
                <div class="row mb-4">
                    <div class="col-12 " v-if="cIsShow" style="display:flex;">

                        <h4 class="mr-2">
                            <span class="mr-1">{{cMBranchName}}</span>
                            <span class="mr-1">{{cSelectedTDelivery.delivery_m_kv.kv_name}}</span>
                            <span class="mr-1">{{dateFormat(cSelectedTDelivery.delivery_at)}}</span>
                        </h4>
                        <m-tag-viewer
                            :tag-category-key="dTagCategoryKey"
                            :selected="cSelectedTDelivery.m_tags"
                            />
                        <h5>
                            <span v-show="cSelectedTDelivery.is_night_work" class="badge badge-info">夜間</span>
                            <span v-show="cSelectedTDelivery.is_holiday_work" class="badge badge-danger">休日</span>
                        </h5> 
                        
                    </div>
                    <div class="col-12"  v-if="cIsShow">
                        納品先：{{cSelectedTDelivery.delivery_customer_name}}
                    </div>
                    <div class="col-12"  v-if="cIsShow">
                        荷主　：{{cSelectedTDelivery.delivery_owner_name}}
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-12 col-xl-6">
                        <p class="h6 text-warning">納期未設定商品：{{cUnlinkedProductNames}}</p>
                    </div>
                    <div class="col-12">  
                        <t-product-view-list-component
                            v-model="value"
                            :is-production="false"
                            :is-view-result-control="true"
                            :is-delivery="true"
                            :product-list="dTProducts"
                            :is-selectable="true"
                            :ref="'tDelProdLinkData'"
                            >
                            
                        </t-product-view-list-component>
                    </div>
                    <div class="col-12">
                        <div class=" text-right p-2">
                            <button type="button" class="btn btn-success" @click.prevent="linkProducts">決定</button>
                            <button type="button" class="btn btn-light" @click.prevent="close">キャンセル</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script >
import _ from "lodash" ;
import DayJsEx from "../../../../frameworks/DayJsEx" ;
import { TProjectDelivery } from '../../class/models/TProjectDelivery';


export default {
    data : function () {
        return {

            //モーダル表示
            dDeliveryProductLinkModal : false ,

            dTagCategoryKey : "t_project_deliveries_designation" ,

            dTProducts : [] ,

        }
    } ,    
    props : { 

        //t_project_deliveryのレコード
        value : { 
            type : Object ,
            default : () =>{}, 
        } ,

        deliveryIdx : { 
            type : Number ,
            default : () => -1, 
        } ,
    },

    computed : {

        //表示中かどうか
        cIsShow : function() { 

            if(this.deliveryIdx !== -1) {
                // console.log("cIsShow",this.deliveryIdx)
                //Todo
                if(this.dTProducts.length == 0) this.formatTProducts() ;
        
                return true ;
            } else {
                // console.log("cIsShow",this.deliveryIdx)

                this.dTProducts = [] ;
                return false ;
            }
        } ,

        //紐づけをするt_project_deliveryのデータ
        cSelectedTDelivery : function() {
            if(this.deliveryIdx == -1 ) return {} ;
            return this.value.t_project_deliveries[this.deliveryIdx] ;
            // const parsed = TProjectDelivery.parse(this.value.t_project_deliveries[this.deliveryIdx])
            // return parsed ;
        } ,
        //表示表拠点名
        cMBranchName : function(){
            if (this.mainStore.masters.MBranches.length == 0 || _.isNil(this.cSelectedTDelivery.m_branch_id)) return "" ;
            return this.mainStore.masters.MBranches.find(n => n.id === this.cSelectedTDelivery.m_branch_id).shortNameOrName;
        } ,

        //施工？
        cIsConstruction : function() {
            if(!this.cIsShow) return false ;
            return this.cSelectedTDelivery.delivery_m_kv.g_01 === "construction" ;
        } ,

        /**
         * 紐づいていない商品名リスト
         */
        cUnlinkedProductNames : function() {

            if( ! this.value?.t_project_products.length ) return "" ;

            const names = this.value.t_project_products.filter( 
                    e => e.t_project_deliveries.length === 0 
                    && e.deleted_at == null 
                    && e.m_product_category.is_delivery_needed
                ).map(x => x.name) ;

            return names.join(',');
            
        } ,
        


    } ,
    methods : {
        dateFormat : function(value) {
            if(_.isNil(value)) return ""  ;
            return DayJsEx.format(value , "YYYY-MM-DD")
        } ,

        //モーダルを開く
        open : function(){
            // await this.formatTProducts() ;
            this.dDeliveryProductLinkModal = true ;
            $('#modalDeliveryProductLink').modal() ;

        } ,

        //モーダルを閉じる
        close : function() {
            $('#modalDeliveryProductLink').modal("hide") ;
            this.$emit('update:deliveryIdx',-1) ;
            //全選択チェックボックスを未チェックにもどす
            this.$refs.tDelProdLinkData.dAllSelected = false ;

        },

        //リンク用のチェックボックスのカラムを足すフォーマット
        formatTProducts : function() {            
            const _this = this ;
            this.dTProducts = this.value.t_project_products.map(function(tPP){
                // console.log(tPP)
                if(_.isNil(tPP.id)) {
                    //商品が未保存(idを持っていない)時、紐づけが行われているかを検索する
                    const checked = _this.cSelectedTDelivery._t_project_products.find( tDP => tDP.product_uid == tPP.uid ) ;
                    if( checked !== undefined ) {
                        //リンクのチェックを予めON
                        tPP.is_selected = true ;
                        tPP.deliveryQty = checked.t_project_delivery_product_link.qty ?? null ;
                    } else {
                        tPP.is_selected = false ;
                    }

                } else {
                    //商品が保存済(idを持っている)時、紐づけが行われているかを検索する
                    const checked = _this.cSelectedTDelivery.t_project_products.find( tDP => tDP.id == tPP.id ) ;
                    if( checked !== undefined ) {
                        //リンクのチェックを予めON
                        tPP.is_selected = true ;
                        tPP.deliveryQty = checked.t_project_delivery_product_link.qty ;
                    } else {
                        tPP.is_selected = false ;

                    }

                }
                
                return tPP ;
               
            })
            .filter(x => x.m_product_category.is_delivery_needed && x.deleted_at == null)  //商品カテゴリがデータ作成・施工・その他の時は紐づけをしない

            
        } ,

        //紐づけ
        linkProducts : function() {
            // console.log("this.dTProducts",this.dTProducts)
            for(const product of this.dTProducts) {
                // console.log("all Products",product)

                if(product.is_selected) {
                    // console.log("is_selected Products",product)
                    if(product.m_branch_id != this.cSelectedTDelivery.m_branch_id && !this.cIsConstruction) {
                        // if(!confirm(`出荷拠点と商品${product.name}の拠点が違います\nこのまま進めてよろしいですか？`)) continue ; 
                    }
                    let foundP = {} ;
                    let foundPIdx = -1 ;
                    //未保存の商品を紐づける(uidから紐づけ処理が必要)
                    if( _.isNil(product.id) ) {
                        
                        //重複回避
                        const existRow = this.cSelectedTDelivery._t_project_products.find(e => e.product_uid == product.uid) 
                        if( existRow !== undefined ) {
                            const idx = this.cSelectedTDelivery._t_project_products.indexOf(existRow) ;
                            this.cSelectedTDelivery._t_project_products[idx].t_project_delivery_product_link.qty = product.is_partical_delivery ? product.deliveryQty : product.qty ;
                            this.cSelectedTDelivery._t_project_products[idx].is_partical_delivery = product.is_partical_delivery  ;
                            continue ;
                        }

                        this.cSelectedTDelivery._t_project_products.push(
                            {
                                // id : null ,
                                product_uid : product.uid , 
                                delivery_uid : this.cSelectedTDelivery.uid , 
                                created_m_user_id : this.$$cLoginUserId ,
                                name : product.name ,

                                t_project_delivery_product_link : {
                                    t_project_delivery_uid : this.cSelectedTDelivery.uid ,
                                    t_project_product_uid : product.uid ,
                                    qty : product.is_partical_delivery ? product.deliveryQty : product.qty ,
                                    created_m_user_id : this.$$cLoginUserId ,
                                    // t_project_delivery_id : this.cSelectedTDelivery.id ,
                                    // t_project_product_id : product.id ,
                                }
                            }
                        )

                        foundP = this.value.t_project_products.find( e => e.uid == product.uid) ;
                        foundPIdx = this.value.t_project_products.indexOf(foundP) ;
                      

                    } else {

                        //重複回避
                        const existRow = this.cSelectedTDelivery.t_project_products.find(e => e.id == product.id) 
                        if( existRow !== undefined ) {
                            const idx = this.cSelectedTDelivery.t_project_products.indexOf(existRow) ;
                            this.cSelectedTDelivery.t_project_products[idx].t_project_delivery_product_link.qty = product.is_partical_delivery ? product.deliveryQty : product.qty ;
                            this.cSelectedTDelivery.t_project_products[idx].is_partical_delivery = product.is_partical_delivery  ;
                            continue ;
                        }
                        
                        const linkRow = {
                            id : product.id ,
                            name : product.name ,
                            t_project_delivery_product_link : {
                                // t_project_delivery_id : this.cSelectedTDelivery.id ?? null ,
                                t_project_product_id : product.id ,
                                created_m_user_id : this.$$cLoginUserId ,
                                qty : product.is_partical_delivery ? product.deliveryQty : product.qty ,

                            }
                        }

                        //未保存の納品の場合idはなし
                        if(this.cSelectedTDelivery.id) linkRow.t_project_delivery_product_link.t_project_delivery_id = this.cSelectedTDelivery.id
                        
                        this.cSelectedTDelivery.t_project_products.push(linkRow) ;

                        foundP = this.value.t_project_products.find( e => e.id == product.id) ;
                        foundPIdx = this.value.t_project_products.indexOf(foundP) ;

                    }
                    //商品側の情報の更新
                    if(foundPIdx !== -1) {
                        this.value.t_project_products[foundPIdx].is_partical_delivery = product.is_partical_delivery ;
                        // this.value.t_project_products[foundPIdx].t_project_deliveries.push(this.cSelectedTDelivery)  ;
                        this.value.t_project_products[foundPIdx].t_project_deliveries.push(
                            {
                                id : this.cSelectedTDelivery.id ?? null,
                                uid : this.cSelectedTDelivery.uid ?? null,
                                delivery_at : this.cSelectedTDelivery.delivery_at ,
                                delivery_time : this.cSelectedTDelivery.delivery_time ,
                                delivery_m_kv : this.cSelectedTDelivery.delivery_m_kv ,
                                t_project_delivery_product_link : {
                                    // t_project_delivery_id : this.cSelectedTDelivery.id ?? null ,
                                    // t_project_product_id : product.id ,
                                    created_m_user_id : this.$$cLoginUserId ,
                                    qty : product.is_partical_delivery ? product.deliveryQty : product.qty ,

                                }
                            }
                        )  ;
                    }
                        
                    
                } else {
                    
                    let foundP = {} ;
                    let foundPIdx = -1 ;
                    //紐づけ解除
                    if(_.isNil(product.id)) {

                        //納品側の紐づけ解除
                        const found = this.cSelectedTDelivery._t_project_products.find(e => e.product_uid == product.uid) ;
                        const idx = this.cSelectedTDelivery._t_project_products.indexOf(found) ;
                        if(idx !== -1) {
                            this.cSelectedTDelivery._t_project_products.splice(idx,1)    
                        }

                        foundP = this.value.t_project_products.find( e => e.uid == product.uid) ;
                        foundPIdx = this.value.t_project_products.indexOf(foundP) ;
                        

                    } else {
                        //納品側の紐づけ解除
                        const found = this.cSelectedTDelivery.t_project_products.find(e => e.id == product.id) ;
                        const idx = this.cSelectedTDelivery.t_project_products.indexOf(found) ;

                        if(idx !== -1) {
                            this.cSelectedTDelivery.t_project_products.splice(idx,1)    
                        }

                        foundP = this.value.t_project_products.find( e => e.id == product.id) ;
                        foundPIdx = this.value.t_project_products.indexOf(foundP) ;
                    }
                    
                    //商品側の紐づけ解除
                    if(foundPIdx !== -1) {
                            
                        let deleted = {} ;
                        let deletedIdx = -1 ;
                        
                        if(this.cSelectedTDelivery.id) {
                            deleted = this.value.t_project_products[foundPIdx].t_project_deliveries.find(e => e.id == this.cSelectedTDelivery.id) ;
                            deletedIdx = this.value.t_project_products[foundPIdx].t_project_deliveries.indexOf(deleted) ;

                        } else {
                            deleted = this.value.t_project_products[foundPIdx].t_project_deliveries.find(e => e.uid == this.cSelectedTDelivery.uid) ;
                            deletedIdx = this.value.t_project_products[foundPIdx].t_project_deliveries.indexOf(deleted) ;
                        }

                        if(deletedIdx !== -1) {
                            this.value.t_project_products[foundPIdx].t_project_deliveries.splice(deletedIdx,1)
                        }
                    }

                }

            }


            this.close() ;
        } ,

        

         
    } ,
    watch : {

    },
    created : function () {
    } ,

}
</script>
