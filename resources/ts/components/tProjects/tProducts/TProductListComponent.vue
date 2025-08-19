<template>
    <div class="card bg-app-secondaly border-0">
        <div>
            <div class="card-header d-flex px-2">            
                <validation-provider name="商品の編集"  
                    vid="tProductList-dIsEditingProduct"
                    :rules="{ required: { allowFalse: false } }"
                    immediate v-slot="{ errors }">  
                    <span class="validation-error" v-show="errors.length > 0">商品の編集を完了してください</span>
                    <input class="d-none" v-model="cIsNotEditingProduct" />                
                </validation-provider>
                <div class="ml-auto">
                    <button type="button" class="btn btn-success" 
                        @click.prevent="searchProduct"
                        :disabled="cInValidEditProduct || isSaving">
                        <i class="fas fa-search fa-fw"></i>
                        検索
                    </button>

                    <button type="button" class="btn btn-primary" 
                        @click.prevent="addProduct"
                        :disabled="cInValidEditProduct || isSaving">
                        <i class="fas fa-plus fa-fw"></i>
                        追加
                    </button>
                </div>

            </div>
            <ul class="list-group list-group-flush scroll-area">
                <li v-for="(n , index) in cTProjectProducts"
                @click.prevent="selectProduct(n)"
                :class="{ 'dark-selected':cSelectedProductIndex4View == index}"
                class="list-group-item bg-app-secondaly"   
                draggable
                @dragstart="dragStart($event,n)"
                @dragover.prevent
                @dragenter.prevent="dragEnter($event,n,index)"
                @drop="drop($event,index)" 
                @dragend="dragEnd"
                >
                    <div class="row d-flex flex-nowrap" v-if="n.deleted_at == null">
                        <!-- <div 
                            style="width:150px" 
                            class="border ml-2 d-flex align-items-stretch" 
                            @click.prevent.stop="getThumbnail(n)" 
                            > -->
                        <div 
                            style="width:150px;min-width:150px;" 
                            @click.prevent.stop="getThumbnail(n)" 
                            >  
                            <div v-if="n.t_project_file_uid || n.t_project_file_id" class="d-flex flex-column">
                                <div class="mt-0">
                                    <button type="button" class="close mr-1" @click.prevent.stop="unsetThumbnail(n)">
                                        <span class="text-white">&times;</span>
                                    </button>
                                </div>
                                <div class="mt-auto mb-auto">
                                    <img class="img-fluid" :src="cThumbnail(n.t_project_file)">
                                </div>
                            </div>
                            <div v-else class="mt-auto mb-auto">
                                <img class="img-fluid" src="img/noimage.png">
                            </div>                       
                        </div>
                        <div class="flex-fill ml-3">
                            <div class="d-flex flex-nowrap border-bottom">
                                <h5 class="text-break flex-grow-1">{{n.name}}</h5>
                                <h5 class="pr-2 text-nowrap flex-grow-0">{{getMBranchName(n)}}</h5>
                                <h5 class="pr-2 text-nowrap flex-grow-0">x&nbsp;{{n.qty}}</h5>
                            </div>
                            <div class="d-flex mt-2">
                                <h6 class="flex-grow-1">{{n.display_01}}</h6>
                                <div class="d-flex flex-column h6">
                                    <div v-for="delivery in n.t_project_deliveries" class="text-right">
                                        <span class="mr-1">{{delivery.delivery_m_kv.kv_name}}</span>
                                        <span class="text-lightDanger mr-1">{{dateFormat(delivery.delivery_at)}}</span>
                                        <span class="mr-1" v-show="n.is_partical_delivery">x&nbsp;{{delivery.t_project_delivery_product_link.qty}}</span>
                                    </div>
                                </div>
                                <!-- <h6 class="pr-2 text-lightDanger">{{dateFormat(n.delivery_date)}}</h6> -->
                            </div>
                            <div class="d-flex d-flex-nowrap">
                                <h6 class="flex-grow-1 d-flex flex-wrap">{{n.display_02}}</h6>    
                                <h5 class="pr-2 mb-0" >
                                    <span :class="getWarrantyBadgeClasses(n)">
                                        {{getWarrantyMkvName(n)}}
                                    </span>
                                    <span :class="getSpecifiedBadgeClasses(n)">
                                        {{getSpecifiedMkvName(n)}}                                                                                                                                                                                                                                                                                                                                     
                                    </span>
                                </h5>
                            </div>                        
                            
                            <div class="d-flex">
                                <h6 class="flex-grow-1">{{n.display_03}}</h6>    
                                <h5 class="pr-2 mb-0" v-show="n.is_needed_labels_for_fire_prevention">
                                    <span class="badge badge-info">要防炎シール</span>
                                </h5>
                            </div>
                            <p class="h6" v-if="isViewPrice">
                                {{`@${n.sell_price.toLocaleString()}-  利益:${n.total_profit.toLocaleString()}円 ( ${n.profit_per.toFixed(2)}% ) `}}
                            </p>
                            <div class="d-flex pr-2">
                                <p class="h6 flex-grow-1">{{n.display_05}}</p>
                                <!-- <button type="button" class="btn btn-success mr-2"
                                    @click.prevent.stop="selectDelivery(n)"
                                    :disabled="cInValidEditProduct || isSaving">
                                    <i class="fas fa-truck fa-fw"></i>
                                </button> -->
                                <button type="button" class="btn btn-info mr-2" 
                                    @click.prevent.stop="copyProduct(n)"
                                    :disabled="cInValidEditProduct || isSaving">
                                    <i class="fas fa-copy fa-fw"></i>
                                </button>
                                <button type="button" class="btn btn-danger" 
                                    @click.prevent.stop="destroyProduct(n)"
                                    :disabled="cInValidEditProduct || isSaving"
                                    >
                                    <i class="fas fa-trash fa-fw"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>  
        <div id="modalThumbnail" 
             class="modal fade" 
             tabindex="-1" 
             role="dialog" 
             aria-labelledby="modalThumbnail" 
             aria-hidden="true" 
             style="margin-top: 0px;" 
             v-show="dThumbnailModal">
            <div class="modal-dialog modal-dialog-fluid">
                <div class="app-modal-content-dark">
                    <t-project-file-list-component
                        v-model="value"
                        :type="'select'"
                        :productRow="dSelectedProductRow"
                        @close="closeModal()"
                        />                    
                </div>
            </div>
        </div>

        <t-product-search-modal
            v-model="value"
            v-show="dIsModalOpen_ProductSearch"
            :is-open.sync="dIsModalOpen_ProductSearch"
            @ok="productSearchModalOk" 
            @cancel="productSearchModalClear" 
         />



    </div>
</template>

<script>
import DayJsEx from '../../../frameworks/DayJsEx';
import NumberUtil from '../../../frameworks/NumberUtil';
import ObjectUtil from '../../../frameworks/ObjectUtil';
import { TProjectProductProcess } from '../class/models/TProjectProductProcess';
import { TProjectProduct } from '../class/models/TProjectProduct';
// import { defineComponent ,ref,computed, onMounted, reactive } from '@vue/composition-api'
import Vue, { ref,computed,defineComponent,reactive,onMounted } from 'vue';


export default defineComponent({
  
    data :  function() {
        return {

            // 編集中
            dIsEditingProduct : false ,  

            dSelectedProductIndex : -1 ,

            dThumbnailModal : false ,
            dSelectedProductRow : {} ,

            dSelectedIdx4LinkDel : -1 ,
            
            dDragItem : {} ,

            /**
             * 商品検索Modal表示
             */
            dIsModalOpen_ProductSearch : false , 


        } 
    } , 
    props : {
        /**
         * t_projectsのレコード
         */
        value : {
            type : Object , 
            
        } , 
        /**
         * 商品リスト
         */
        productList : { 
            type : Array ,
            default : () => [] ,
        } ,

        /**
         * 選択中の商品
         */
        selectedProduct : {
            type : Object 
        } ,

        /**
         * 金額表示
         */
        isViewPrice : {
            type : Boolean , 
            default : () => false ,
        } , 

        /**
         * 保存中
         */
        isSaving : {
            type : Boolean , 
            default : () => false 
        } , 

    } ,
    computed : {

        /**
         * 編集していないフラグ（Validation用)
         */
        cIsNotEditingProduct : function() {
            return ! this.dIsEditingProduct ?? false ; 
        } , 

        /**
         * 表示用の選択Index（Deleted_at考慮）
         */
        cSelectedProductIndex4View : function() { 
            if ( this.dSelectedProductIndex === -1 ) return -1 ; 

            const item = this.value.t_project_products[this.dSelectedProductIndex] ; 
            return this.cTProjectProducts.indexOf(item) ;             
        } , 

        /**
         * 商品の編集許可( 編集中は不可 )
         */
        cInValidEditProduct : function() {
            //return this.dIsEditingProduct ; 
            return this.selectedProduct !== undefined ; 
        }  , 

        /**
         * 有効な商品のリスト
         */
        cTProjectProducts : function() {
            return this.productList ; 
        } , 
        /**
         * サムネイル
         */
        cThumbnail : function(){
            return function(tProductFile){
                const fileData = tProductFile.base64_thumbnail ;
                if(fileData == "img/noimage.png"||fileData == "img/folder.jpeg") return fileData ;
                return "data:image/jpeg;base64," + fileData ;
            }
        },

        /****************
         * 以下カラム系
         *****************/
        // 拠点ID
        cMBranchIdCName : function() {
            const colName = "m_branch_id" ; 
            return colName ; 
        } ,
        cMBranchId :{
            get :  function() {                
                return this.getValue(this.cMBranchIdCName) ;
            } ,
            set : function(val) {
                this.setValue(this.cMBranchIdCName, val)  ;
            }
        } ,        
        
    } ,
    methods : {
        
        getValue : function(colName )  
        {            
            return this.$$getValue("value" , colName) ; 
        } ,
        setValue : function(colName , val){   
            this.$$setValue("value" , colName , val  ) ;
        } ,
        
        dateFormat : function(value) {
            if(value === "" || value ===null) return "" ;
            return DayJsEx.format(value , "YYYY-MM-DD")
        },

        /**
         * 拠点名
         */
        getMBranchName : function (n)  {
            const finded = this.masterStore.getMBranchById(n.m_branch_id ) ; 
            return finded === undefined ? "" : finded.shortNameOrName ; 
        } , 
        /**
         * 保証名
         */
        getWarrantyMkvName : function(n) {
            if ( n.warranty_m_kv == undefined  ) return "" ; 

            return n.warranty_m_kv.kv_name ; 
        } , 
        /**
         * 保証のバッジクラス
         */
        getWarrantyBadgeClasses : function(n) {
            if ( n.warranty_m_kv == undefined  ) return [] ; 

            return ["badge" ,n.warranty_m_kv.g_01] ; 
        } , 
        /**
         * 指定名
         */
        getSpecifiedMkvName : function(n) {
            if ( n.specified_m_kv == undefined  ) return "" ; 

            return n.specified_m_kv.kv_name ; 
        } , 
        /**
         * 指定のバッジクラス
         */
        getSpecifiedBadgeClasses : function(n) {
            if ( n.specified_m_kv == undefined  ) return [] ; 

            return ["badge" ,n.specified_m_kv.g_01] ; 
        } , 


        /*****************************
         * 商品検索Modal
         ****************************/

        searchProduct : function() { 
            this.dIsModalOpen_ProductSearch = true ; 
        } ,

        /**
         * 商品検索モーダルからのOK
         */
        productSearchModalOk : function(list) { 

            this.value.t_project_products.push(...list.products) ; 
            this.value.t_project_deliveries.push(...list.deliveries) ; 

            this.productSearchModalClear() ; 
        } , 
        /**
         * 商品検索モーダル終了時のクリア処理
         */
        productSearchModalClear : function()  { 
            // this.dSelectedGroupDay = undefined ; 
            //this.dChangeFromGroupInfo.group = undefined ; 
        } , 

        /*****************************
         * 商品追加・削除・編集
         ****************************/

        addProduct () {
            const row = {
                m_branch_id : this.cMBranchId ,
                created_m_user_id : this.$$cLoginUserId , 
            } ;
            const parsed = TProjectProduct.parse(row ) ; 
            this.$emit("update:selected-product" , parsed ) ;

            this.dIsEditingProduct = true ; 

        } ,
        // 
        selectProduct(product) {            
            //console.log("cInValidEditProduct " + this.cInValidEditProduct) ; 
            const idx = this.value.t_project_products.indexOf(product) ; 
            if ( this.dSelectedProductIndex === idx ) return ; 

            if ( this.cInValidEditProduct ) {
                // Todo : 確認
                alert("商品の編集を完了してください") ; 
                
                return ; 
            }
            
            this.dSelectedProductIndex = idx ; 

            let row = ObjectUtil.deepCopyJ(product)   ;
            // let row = ObjectUtil.deepCopyOA(product) ; 
            row = this.updateAddRemoveProcesses(row); 
            // console.log(row) ; 
            const parsed = TProjectProduct.parse(row ) ; 
            // console.log(parsed) ; 
            
            this.$emit("update:selected-product" , parsed ) ; 

            this.dIsEditingProduct = true ;

        } ,

        /**
         * 商品のコピー
         */
        copyProduct(product) {            
            //console.log("cInValidEditProduct " + this.cInValidEditProduct) ; 
            const idx = this.cTProjectProducts.indexOf(product) ; 
            if ( this.dSelectedProductIndex === idx ) return ; 

            if ( this.cInValidEditProduct ) {
                // Todo : 確認
                alert("商品の編集を完了してください") ; 
                
                return ; 
            }
            
            //this.dSelectedProductIndex = idx ; 

            let row = ObjectUtil.deepCopyJ(product)   ;
            row = this.updateAddRemoveProcesses(row) ;
            
            //copy商品フラグ（カテゴリ変更を防止する）
            row.tmp_copy_flg = true ;

            //分納フラグ解除
            row.is_partical_delivery = false ;

            // idの除去
            delete row.id ; 
            delete row.t_project_id ; 
            delete row.uid ; 
            
            //紐づいた納期の削除
            delete row.t_project_deliveries ; 

            if ( row.t_project_product_processes !== undefined){
                for ( const process of row.t_project_product_processes){
                    delete process.id ; 
                    delete process.t_project_product_id ; 
                    delete process.t_p_order_details ; 
                    delete process.created_m_user_id ; 
                    delete process.updated_m_user_id
                    delete process.created_at ; 
                    delete process.updated_at ; 

                    delete process.t_p_order_details ; 
                    delete process.t_production_process_plans ; 

                }
            }

            if ( row.t_project_product_boardlayouts !== undefined){
                for ( const layout of row.t_project_product_boardlayouts){
                    delete layout.id ; 
                    delete layout.t_project_product_id ; 
                    delete layout.created_m_user_id ; 
                    delete layout.created_at ; 
                    delete layout.updated_at ; 
                }
            }

            if ( row.t_project_product_separates !== undefined){
                for ( const sep of row.t_project_product_separates){
                    delete sep.id ; 
                    delete sep.t_project_product_id ; 
                    delete sep.created_m_user_id ; 
                    delete sep.created_at ; 
                    delete sep.updated_at ; 
                }

            }

            if ( row.t_project_product_estimate_details?.length ){
                for ( const estimate of row.t_project_product_estimate_details){
                    delete estimate.id ; 
                    delete estimate.t_project_product_id ; 
                    delete estimate.created_at ; 
                    delete estimate.updated_at ;
                    estimate.created_m_user_id = this.$$cLoginUserId ; 
                    estimate.updated_m_user_id = this.$$cLoginUserId ; 

                }
            }

            const parsed = TProjectProduct.parse(row ) ; 

            // this.$emit("update:selected-product" , row ) ; 
            this.$emit("update:selected-product" , parsed ) ; 

            this.dIsEditingProduct = true ;

        } ,
        /**
         * データ保存時から工程の追加、削除があった場合の処理
         */
        updateAddRemoveProcesses(row) {

            if ( row.t_project_product_processes !== undefined){

                const mProductCategoryId = row.m_product_category_id ; 
                //console.log("mProductCategoryId : " + mProductCategoryId) ; 
                // predicted_work_hour
                const mProductCategory = this.mainStore.masters.MProductCategories.find(e => e.id === mProductCategoryId) ; 

                // 削除された工程対策
                //console.log("pivt") ; 
                //console.log(mProductCategory.link_process_categories_pivot) ; 
                const list = row.t_project_product_processes.map(function(x) {
                    const finded = mProductCategory.link_process_categories_pivot.find(e => e.id ===  x.m_process_category_id) ; 
                    if ( finded === undefined){
                        console.error("Process category is not found. id:" + x.m_process_category_id ) ;
                        x.is_enabled = false ; 
                        x.deleted_at = Date() ;   
                        //return undefined ; 
                        x.m_process_category = { cd :"Null" , name : "Deleted" , "pivot" : {}} ;
                    }
                    else {                        
                        x.m_process_category = finded ;
                    }

                    return x ; 
                }) ; 

                // 追加工程
                for ( const process of mProductCategory.link_process_categories_pivot ) {
                    const finded = list.find(x => x.m_process_category_id == process.id )  ; 
                    if ( finded === undefined ){
                        // 工程がないので追加
                        
                        const newRow = { 
                            is_enabled  : ( process.pivot.is_required == 1 || process.pivot.is_default_on == 1 )  ,
                            m_branch_id : row.m_branch_id ?? 0 , 
                            m_process_category_id   : process.id  ,
                            m_process_category      : process     ,
                            is_removable            : false  ,  

                        } ; 
                        

                        // 追加位置を検討
                        const processOrderNo = NumberUtil.invalid2zr( process.order_no) ; 
                        let insertIdx = -1 ;  
                        
                        for ( const tpProcess of list ) {
                            //console.log(tpProcess) ; 
                            if ( processOrderNo < tpProcess.m_process_category.order_no ){
                                insertIdx = list.indexOf(tpProcess) ;
                                break ;
                            } 
                        } 
                        //console.log("insertIdx " + insertIdx) ; 
                        if ( insertIdx === -1 ) {
                            list.push(newRow) ; 
                        }
                        else {
                            list.splice(insertIdx , 0 , newRow ) ;
                        } 
                         
                    }

                }


                //row.t_project_product_processes = list.filter( x => x !== undefined ) ;
                row.t_project_product_processes = list ; 
            }

            return row ; 

        } , 
        destroyProduct(row) {
            // Todo 
            if (! ObjectUtil.isNU(this.value.ordered_at )) {
                alert("受注済みの為、商品を削除することができません。") ; 
                return ; 
            }


            if(! confirm('削除してよろしいですか?')) return ; 

            //console.log(row) ; 
            const idx = this.value.t_project_products.indexOf(row) ; 
            if ( idx !== -1){
                //納品情報削除用のデータ
                const prodInfo4Del = {
                    id : row.id ?? null ,
                    uid : row.uid ?? null ,
                    t_project_deliveries : row.t_project_deliveries ?? [] ,
                }

                if ( row.id === undefined ) {
                    this.value.t_project_products.splice(idx ,1) ;
                }
                else {
                    this.$set(this.value.t_project_products[idx] , "deleted_at" ,Date()) ; 
                }

                //納品情報側の情報を更新
                this.unlinkDelivery(prodInfo4Del) ;
            }

        } ,

        //商品削除時の納品情報側のデータ更新
        unlinkDelivery : function(tProduct) {

            if(tProduct.t_project_deliveries.length == 0) return ;

            for(const del of this.value.t_project_deliveries) {
                
                if(del.t_project_products.length == 0 && del._t_project_products.length == 0) continue;

                if(tProduct.id) {
                    const foundProd = del.t_project_products.find( x => x.id == tProduct.id) ;
                    const foundProdIdx = del.t_project_products.indexOf(foundProd) ;

                    if(foundProdIdx !== -1) {
                        del.t_project_products.splice(foundProdIdx ,1) ;
                    }

                } else {
                    const foundProd = del._t_project_products.find( x => x.product_uid == tProduct.uid) ;
                    const foundProdIdx = del._t_project_products.indexOf(foundProd) ;
                    if(foundProdIdx !== -1) {
                        del._t_project_products.splice(foundProdIdx ,1) ;
                    }
                }
            }

        },
        saveProduct(payload) {
            //console.log("save") ; 
            const _this = this ; 
            // console.log(payload) ; 
            let row = ObjectUtil.deepCopyOA(payload) ; 
            const id = row.id ; 

            row.updated_m_user_id = this.$$cLoginUserId ; 
            
            // Trim Temp Columns
            // row = this.trimProcessTmpColumns(row) ; 
            row = ObjectUtil.trimColumnsByPrefix(row,"tmp_") ; 

            if ( row.t_project_product_processes !== undefined)
            {
                const pList = row.t_project_product_processes.map(function(x){
                    x.updated_m_user_id = _this.$$cLoginUserId ; 
                    return ObjectUtil.trimColumnsByPrefix(x,"tmp_") ;
                    // return _this.trimProcessTmpColumns(x) ; 
                }) ; 

                row.t_project_product_processes = pList ;

            }                
            //console.log("dSelectedProductIndex" + this.dSelectedProductIndex) ; 
            row = TProjectProduct.parse(row) ; 
            if (id === undefined && this.dSelectedProductIndex === -1)
            {
                // New
                //新規商品の時紐づけ用のuidを設定する
                let productUid = Math.floor(Math.random() * (1000 - 1)) + 1 ;
                while(this.value.ExistUids.indexOf(productUid) !== -1) {
                    productUid = Math.floor(Math.random() * (1000 - 1)) + 1 ;
                }                
                row.uid = productUid ;

                this.value.t_project_products.push(row) ; 
            }
            else
            {
                // this.dValue.t_project_products.splice(idx , 1 , row) ; 
                this.value.t_project_products.splice(this.dSelectedProductIndex , 1 , row)
                
                
            }

            this.$emit("update:selected-product" , undefined) ; 

            
            this.dIsEditingProduct  = false ; 
            this.dSelectedProductIndex = -1; 

        } ,
        cancelProduct () {
            this.$emit("update:selected-product" , undefined) ; 

            this.dIsEditingProduct  = false ; 
            this.dSelectedProductIndex = -1; 

        } , 
        
        // tmp_から始まるカラムを削除 現在使用していない => ObjectUtil.trimColumnsByPrefix
        trimProcessTmpColumns(row) {
            if ( row === undefined ) return row ; 

            const keys = Object.keys(row) ; 
            const tmpColName = "tmp_" ; 
            for ( let i = 0 ; i < keys.length ; i ++ ) {
                const key = keys[i] ; 
                
                if ( key.slice(0 ,tmpColName.length) === tmpColName ){
                    delete row[key] ; 
                } 
            }

            return row ; 

        } ,

        //商品並び替え
        dragStart : function(event,dragItem) {
            if(this.dIsEditingProduct) return ; 
            event.dataTransfer.effectAllowed = 'move' ;
            event.dataTransfer.dropEffect = 'move' ;
            // event.dataTransfer.setData('dragItem',dragItem ) ;
            this.dDragItem = dragItem ; 
            // event.dataTransfer.setData('list-id',uid) ;            
        } , 
        dragEnter : function(event ,item,index){
            // console.log("dragEnter")
            // this.dDragEnteredTarget = item ;
            this.dSelectedProductIndex = index ;
            
        } ,
        drop : function(event ,index) {
            // console.log(event)
            // const dragItem = event.dataTransfer.getData('dragItem') ;

            const foundIdx = this.value.t_project_products.indexOf(this.dDragItem) ;

            if(foundIdx === index) return ;

            if(foundIdx !== -1) {
                this.value.t_project_products.splice(foundIdx,1) ;
                this.value.t_project_products.splice(index,0,this.dDragItem) ;                
            }

        } ,
        dragEnd : function(){
            this.dDragItem = {} ; 
            this.dSelectedProductIndex = -1 ;
			// this.dDragEnteredTarget = undefined
        } ,

        //サムネイル紐づけ系
        getThumbnail : function (productRow) {   
            //deleted_at考慮
            const fileArr =  this.value.t_project_files.filter(x=>x.deleted_at == null) ;
            //商品編集中またはファイルがない場合はモーダルを開かない
            if(!this.dIsEditingProduct && fileArr.length >0) {
                $('#modalThumbnail').modal()     
                this.dThumbnailModal = true ;
                this.dSelectedProductRow = productRow ;
            }      
            
        } ,
        unsetThumbnail : function (row)  {
            row.t_project_file_id = null ;
            row.t_project_file_uid = null ;
            delete row.t_project_files ;
        } ,

        closeModal : function () {
            
            $('#modalThumbnail').modal('hide')

            // this.dThumbnailModal = false ;

        } 
    }

}); 
</script>
<style scoped>
.scroll-area { 
    /* height : calc( 100vh - 70px) !important  ;   */
    max-height : calc( 100vh - 70px) !important  ;  
    overflow-y : auto !important;
    overflow-x : hidden ; 
}
</style>