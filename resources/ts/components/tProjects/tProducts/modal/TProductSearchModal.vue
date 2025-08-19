<template>
    <!-- Modalフォーム -->
    <div class="modal fade" id="productSearchModal" tabindex="-1" role="dialog" data-backdrop="static" style="margin-top: 0px;">
        <div class="modal-dialog modal-dialog-fluid" role="document">
            <div class="app-modal-content-dark">                
                <div class="modal-header">
                    <div class="row">
                        <div class="col-12">
                            <h4>商品検索</h4> 
                        </div>
                        
                    </div>
                    
                </div>


                <div class="modal-body pt-0">
                    
                    <div class="row">
                        <div class="col-12 col-xl-2">
                            <div class="form-group">
                                <label for="mBranchId">拠点</label>
                                <m-branch-select 
                                    id="mBranchId"
                                    v-model="dConditions.m_branch_id"
                                />
                            </div>
                        </div>
                        <div class="col-12 col-xl-3 pl-xl-0">
                            <div class="form-group">
                                <label for="customerName">クライアント名</label>
                                <input id="customerName" v-model="dConditions.m_customer_name"
                                    type="text" class="form-control" placeholder="">
                            </div>
                        </div>           
                        <div class="col-12 col-xl-3 pl-xl-0">
                            <div class="form-group">
                                <label for="projectName">物件名</label>
                                <input id="projectName" v-model="dConditions.name"
                                    type="text" class="form-control" placeholder="">
                            </div>
                        </div>
                        <div class="col-12 col-xl-2 pl-xl-0">
                            <div class="form-group">
                                <label >商品名</label>
                                <input v-model="dConditions.product_name"
                                    type="text" class="form-control" placeholder="">
                            </div>
                        </div>


                        <div class="col-12 col-xl-2 text-right pr-3 pr-xl-2">
                            <div class="">
                                <div class="col-12 col-xl-12  pr-1">
                                    <div class="form-group">
                                        <label >&nbsp;</label>
                                        <div>
                                            <button type="button" :disabled="dIsLoading" class="btn btn-success" @click.prevent="search()">
                                                <div v-if="dIsLoading">
                                                    <span class="spinner-border spinner-border-sm" role="status" />
                                                    検索中...
                                                </div>
                                                <div v-else>
                                                    <i class="fas fa-search fa-fw" />
                                                    検索
                                                </div>
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="row">

                        <div class="col-12 col-xl-4 pt-4 ml-auto">
                            <div class="float-right mt-1">
                                <ns-checkbox-input
                                    v-model="dIsWithDlv"
                                    :label="'納品コピー'"
                                    :id="'ProdSearchWithDeliveryCheck'"
                                    class="d-inline-block mr-2"
                                    />
                                
                                <button type="button" class="btn btn-primary"  @click.prevent="hide()" >コピー</button>
                                <button type="button" class="btn btn-light ml-2" @click.prevent="cancel()">キャンセル</button>
                            </div>
                            
                        </div>
                        

                    </div>


                    <div class="row">
                        <div class="col-12">
                            <div v-for="(n ,index) in cList" :key="n.id">
                                <t-project-view-4-search-t-products
                                    v-model="cList[index]"
                                />
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    </div>
</template>

<script >
import NsCheckboxInput from '../../../commons/input/NsCheckboxInput.vue';
import { TProject } from '../../class/models/TProject';
import { TProjectProductService } from '../../class/services/TProjectProductService';
import { TProjectDeliveryService } from '../../class/services/TProjectDeliveryService';
import { TProjectService } from '../../class/services/TProjectService';

export default {
  components: { NsCheckboxInput },
    data : function () {
        return {

            dIsLoading : false ,            

            dIsMounted : false  , 

            dConditions : {
                m_branch_id:0 , 
                name: "" , 
                product_name : "" ,
                m_customer_name : "" ,

            } ,

            dList : [] , 

            dIsWithDlv : false ,

        }
    } ,    
    props : { 

        // 親からのパラメーター
        isOpen : {
            // 起動フラグ(true:になった場合isOpenイベントを起動)
            type : Boolean ,
            default : () => false ,
        } ,
        value : { 
            type : TProject , 
            require : true , 
        }




    },

    computed : {
        
        

        /**
         * 選択されている商品のリスト
         */
        cList : function() { 
            if ( _.isNil(this.dList)) return [] ; 

            //console.log("cList changed") ; 
            return this.dList ; 
        } , 


    } ,
    methods : {
        init : function () {
            // 初期化
            $("#productSearchModal").modal("show") ; 

            this.dConditions.m_branch_id = this.value.m_branch_id , 
            this.dConditions.name = "" ; 
            this.dConditions.product_name = "" ;             
            this.dConditions.m_customer_name = this.value.m_customer?.name ?? "" ; 
            this.dList.splice(0) ; 

        } ,
        hide : async function () {

            const ids = [] ;
            for (const tProject of this.cList){
                ids.push(... tProject.selected_t_product_ids) ; 
            }

            if ( ids.length === 0 ){
                alert("対象の商品を選択してください") ; 
                return ; 
            }

            const resList = await TProjectProductService.getByIds4copy(ids ,this.dIsWithDlv) ; 
            const dlvResList = [] ;
            //納品情報取得
            if(this.dIsWithDlv) {
                let dlvIds = [] ;
                for(const prod of resList) {
                    //重複無しの納品Id配列を作成
                    dlvIds = _.union(dlvIds,prod.t_project_deliveries.map(x => x.id)) ;

                    //id削除
                    for(const prodDlv of prod.t_project_deliveries) {
                        prodDlv.uid = prodDlv.id ;
                        delete prodDlv.id ;
                    }
                }
                //納品情報のコピーを取得
                const dlvRes = await TProjectDeliveryService.getByIds4copy(dlvIds,ids) ;
                // console.log(dlvRes)
                for(const r of dlvRes) {
                    r.t_project = {
                        id:this.value.id , 
                        m_branch_id : this.value.m_branch_id , 
                        name :this.value.name ,
                        cd : this.value.cd ,
                    }
                }
                dlvResList.push(...dlvRes)
            }
            
            const result = this.linkProdToDlv(resList ,dlvResList)
            
            this.close() ; 
            // 呼び出し元のイベントを駆動して画面を非表示
            
            // console.log(resList) ; 
            this.$emit('ok' , result ) ;

            
        } ,
        cancel : function() { 

            this.close() ; 

            this.$emit('cancel') ;


        } , 
        close : function() { 
            $("#productSearchModal").modal("hide") ; 
        } , 

        search : async function() { 
            this.dIsLoading = true ; 

            const getParams = JSON.parse(JSON.stringify(this.dConditions)) ;
            try { 
                const res = await TProjectService.search4TProducts(getParams) ; 
                this.dList = res ; 
                
            }
            catch (error){
                this.$$errorConsole(error ,error.ep) ;
            } finally {
                this.dIsLoading = false ;
            }
            

            

        } , 

        //便宜上旧idを入れたuidをかぶり防止のため再附番する
        linkProdToDlv : function(prods ,dlvs) {
            for(const p of prods) {
                //紐づけ用に旧Idを退避
                p._uid = p.uid ;
                p.uid = this.genarateUid() ;
            }
            //納品情報もあれば附番してリンクしなおす
            if(!_.isEmpty(dlvs)) {
                for(const d of dlvs) {
                    d._uid = d.uid ;
                    d.uid = this.genarateUid() ;
                    //商品側の納品情報uid設定
                    for(const p of prods) {
                        
                    }
                    
                    for(const dP of d._t_project_products ) {
                        const foundProd = prods.find( x => x._uid == dP.product_uid ) ;
                        if(foundProd !== undefined) {
                            dP.product_uid = foundProd.uid ;
                            dP.t_project_delivery_product_link.t_project_delivery_uid = d.uid ;
                            dP.t_project_delivery_product_link.t_project_product_uid = foundProd.uid ;

                            //商品側の納品情報uid設定
                            const prodDlv = foundProd.t_project_deliveries.find(x => x.uid == d._uid) ;
                            if(prodDlv !== undefined) {
                                prodDlv.uid = d.uid ;
                            }

                        
                        }  
                        

                    } 
                    
                    if(!_.isEmpty(d.t_project_construction_users)) {
                        for ( const user of d.t_project_construction_users){
                            user.id = undefined ; 
                            user.t_project_delivery_id  = null ;
                            user.t_project_delivery_uid = d.uid ;
                        }
                    }
                    
                    // delete d._uid ;

                }
            }

            for(const p of prods) {
                
                delete prods._uid ;
            }

            return {products : prods ,deliveries : dlvs}

        } ,
        genarateUid : function() {
            let uid = Math.floor(Math.random() * (1000 - 1)) + 1 ;
            while(this.value.ExistUids.indexOf(uid) !== -1) {
                uid = Math.floor(Math.random() * (1000 - 1)) + 1 ;
            }  
            return uid
        }
    } ,
    watch : {
        isOpen : function (newVal) {
            if (newVal) {
                // openフラグをResetして起動時のみ処理する
                this.$emit("update:is-open", false) ;

                // 検索結果・選択状態を初期化
                this.init() ;

            }
        } ,
    },
    created : function () {
    } ,
    mounted : function() { 
        this.dIsMounted = true ; 
    }
}
</script>
