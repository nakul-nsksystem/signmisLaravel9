<template>
    <div class="p-3 bg-app-secondaly">
        <div class="row">
            <div class="col-12 col-xl-3 pb-2">
                <div class="form-group">
                    <label >発注用物件名</label>
                    <input type="text" class="form-control" placeholder="発注用物件名を入力" v-model="cPOrderProjectName">
                </div>
            </div>
            <div class="col-12 pb-2 ">
                <div class="border-bottom">
                    <p class="h5">要発注材料一覧</p>
                    <div v-show="$$cIsDebug">
                        matId:{{cMMaterialDIds}}
                        {{cFilterdList}}{{cNeedToOrderConstructions}}
                        unordereNum:{{cUnorderNum}}
                    </div>

                </div>
            </div>
        </div>
        <div class="row">
            
            <div class="col-12 col-xl-3 offset-xl-9 pb-2">
                <div class="form-group">
                    <label>未発注材料フィルタ</label>
                    <select class="form-control" v-model="dFilter">
                        <option selected></option>
                        <option value="unordered">未発注</option>
                        <option value="ordered">発注済</option>
                        <option value="useStocked">在庫使用</option>
                    </select>
                </div>

            </div>

        </div>
        <project-order-list-component
            :list="dFilteredList"
            :is-t-project="true"
            :order-project-name="cPOrderProjectName"
            :is-view-price="isViewPrice"
            @checked="checkUseStocked"
            @postOrder="postOrder"
            />
        
        <div class="row">
            <div class="col-12 pb-2 ">
                <div class="border-bottom">
                    <p class="h5">要発注施工外注一覧</p>
                </div>
            </div>

        </div>
        <ConstructionOrderListComponent
            v-model="dConsList"
            @postOrder="postConstructionOrder"
            :order-project-name="cPOrderProjectName"

            />

        <div class="row mt-5">
            <div class="col-12 pb-2 ">
                <div class="border-bottom">
                    <p class="h5">発注済材料一覧</p>
                </div>
            </div>
        </div>
        <div class="table-responsive">
            <table class="table table-striped table-dark text-nowrap">
                <thead>
                    <tr>
                        <th scope="col">発注No.<br>明細No.</th>
                        <th scope="col">名称</th>
                        <th scope="col">商品名</th>
                        <th scope="col">発注先</th>
                        <th scope="col">数量</th>
                        <th scope="col">単価</th>
                        <th scope="col">金額</th>
                        <th scope="col">納期</th>
                        <th scope="col">発注担当者</th>
                        <th scope="col">発注日</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <template>
                        <tr v-for="n in cOrderedList">
                            <td>
                                <a :href='"v#/t_p_order/edit/"+n.t_p_order_id'>{{n.t_p_order_id}}</a>
                                <p>{{n.id}}</p>
                                <p v-if="n.updated_at!==n.created_at" class="text-danger">変更有</p>
                                <span v-show="n.t_project_product_process_order_detail?.is_preceding" class="badge badge-info">先発注</span> 
                            </td>
                            <td>{{n.po_material_name}}</td>
                            <td>{{n.product_name}}</td>
                            <td>{{n.t_p_order.supplier_m_customer.short_name_or_name}}</td>
                            <td class="text-right">{{n.qty.toLocaleString()}}{{n.unit_m_kv.kv_name}}</td>
                            <td class="text-right"><div v-if="cIsViewOrderedPrice(n.m_material_detail_id)">{{n.price.toLocaleString()}}</div></td>
                            <td class="text-right"><div v-if="cIsViewOrderedPrice(n.m_material_detail_id)">{{n.total_price.toLocaleString()}}</div></td>
                            <td>{{dateFormat(n.due_date)}}</td>
                            <td>{{n.t_p_order.m_user.full_name}}</td>
                            <td>{{dateFormat(n.t_p_order.order_date)}}</td>
                            <!-- <td><p v-if="isEmpty(n.unit_m_kv_id)">{{n.unit_m_kv.kv_name}}</p></td> -->

                            <td>
                                <div v-if="!cTPInvoice(n)">
                                    <button type="button" class="btn btn-danger" @click.prevent="destroy(n)">
                                        <i class="fas fa-trash fa-fw"></i>
                                    </button>
                                </div>
                                <p v-else class="text-danger">仕入登録済</p>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
        <div id="modalOrder"
             class="modal fade"
             tabindex="-1"
             role="dialog"
             aria-labelledby="modalOrder"
             aria-hidden="true"
             style="margin-top: 0px;"
             v-show="dOrderListModal">
            <div class="modal-dialog modal-dialog-fluid">
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
                        @setConstructionOrderedRow="setConstructionOrderedRow"
                        ref="orderListModal"
                        />
                </div>

            </div>
        </div>
    </div>

</template>

<script>

import DayJsEx from "../../../frameworks/DayJsEx" ;
import ObjectUtil from '../../../frameworks/ObjectUtil';
import _ from "lodash" ;
import NumberUtil from '../../../frameworks/NumberUtil';
import { TProjectProduct } from '../class/models/TProjectProduct';
import { TProject } from '../class/models/TProject';


export default {
    data :  function() {
        return {

            dFilter : undefined ,
            dLoading : false ,


            //モーダル用
            dOrderList : [] ,
            dOrderListModal : false ,

            //マスタ検索した情報
            dMMaterials : [] ,

            //リクエスト済のId配列
            dBeforeMIds : [] ,

            dList : [] ,

            dFilteredList : [] ,


            dConsList : [],

        }
    } ,
    props : {
        // t_projectsのレコード
        value : {
            type : Object ,
        } ,
        //　商品リスト
        productList : {
            type : Array ,
        } ,

        /**
         * 金額表示
         */
        isViewPrice : {
            type : Boolean , 
            default : () => false ,
        } , 

        /**
         * 未保存発注制御
         */
        lastSaved : {
            type : Object ,
            defaut : () => undefined ,
        }
        
    } ,

    computed : {
        cMBranch : function(){
            return function(branchId){
                if (this.mainStore.masters.MBranches.length == 0 ) return 0 ;
                return this.mainStore.masters.MBranches.find(n => n.id === branchId);
            }
        } ,

        cProducts : function(){
            return this.productList ;
        } ,

        cMMaterialDIds : function() {
            const result = [] ;
            for(const product of this.cProducts) {

                for(const process of product.t_project_product_processes) {

                    if( !process.is_order_needed || !process.is_enabled ) continue ;

                    if(!process["is_01"]) {
                        //材料マスタ呼び出し
                        for (let i = 1; i <= 25; i++) {

                            let count = i + '' ;
                            let colName = 'm_material_id_' + NumberUtil.formatZeroPadding(count , 2) ;

                            //該当カラムに情報がない場合
                            if(!process[colName]) continue ;

                            result.push(process[colName]) ;

                        }

                    }

                }
            }

            //null及び重複削除
            const param = _.uniq(result.filter(x => x))

            return  param;

        } ,

        //描画用のフィルター適用リスト
        cFilterdList : function() {

            if(this.dList.length === 0) {
                this.dFilteredList = [] ;
                return "" ;
            } 

            //フィルタ
            const sourceList = ObjectUtil.deepCopyJ(this.dList) ;

            switch(this.dFilter) {

                case "useStocked" : //在庫使用
                    this.dFilteredList = sourceList.filter(x => x.is_use_stocked) ;
                    break ;

                case "ordered" : //発注済
                    this.dFilteredList = sourceList.filter(x => x.t_p_order_details.length>0) ;
                    break ;

                case "unordered" : //未発注
                    this.dFilteredList = sourceList.filter(x => x.t_p_order_details.length==0 && !x.is_use_stocked) ;
                    break ;

                default :
                    this.dFilteredList = sourceList ;
                    break ;

            }

            //材料順にソート
            this.dFilteredList.sort(function(a,b) {
                if(a.product_cat_order_no > b.product_cat_order_no) return 1  ;
                if(a.product_cat_order_no < b.product_cat_order_no) return -1 ;
                if(a.t_project_product_process_id > b.t_project_product_process_id) return 1  ;
                if(a.t_project_product_process_id < b.t_project_product_process_id) return -1 ;
            }) ;


            return "" ;

        } ,

        cNeedToOrderConstructions : function() {
            // this.value.updated_at ;
            if(this.value?.t_project_deliveries?.length == 0) return [] ;
            //未削除施工のみを抜き出し
            const constructions = this.value.t_project_deliveries.filter(x => x.delivery_m_kv.g_01 === "construction" && x.deleted_at == null ) ;
            if(constructions.length == 0) return [] ;

            this.dConsList.splice(0) ;

            //外注人員のある施工情報を画面描画用に成型
            for(const co of constructions) {

                const copied = _.cloneDeep(co)
                delete copied.t_project_construction_users
                
                for(const cU of co.t_project_construction_users) {
                    
                    if(!_.isNil(cU.out_source_m_customer_id)) {

                        const displayObj = {
                            
                            t_project_id                   : this.value.id ,
                            t_project_delivery_id          : co.id ?? null ,
                            t_project_construction_user_id : cU.id ?? null ,
                            out_source_m_branch_id         : cU.out_source_m_customer.m_branch_id ,
                            out_source_m_branch            : this.cMBranch(cU.out_source_m_customer.m_branch_id) ,
                            out_source_m_customer_id       : cU.out_source_m_customer_id ,
                            out_source_m_customer          : cU.out_source_m_customer ,
                            out_source_price               : cU.out_source_price,
                            out_source_total_price         : cU.out_source_total_price,
                            delivery_at                    : co.delivery_at ,
                            out_source_person_name         : cU.out_source_person_name ,
                            num_of_out_source_people       : cU.num_of_out_source_people ,
                            t_p_order_detail               : cU.t_p_order_detail ,
                            slip_memo                      : null ,
                            is_checked                     : false ,
                            t_project_delivery             : copied ,
                            t_project                      : {
                                                                name            : this.value.name ,
                                                                cd              : this.value.cd,
                                                                // po_project_name : this.cPOrderProjectName ,
                                                            } ,        

                        }

                        this.dConsList.push(displayObj)
                    }
                }
            }

            return "" ;

        } ,

        /**発注済リスト */
        cOrderedList : function() {
            // if(this.dList.length == 0) return [] ;

            const tPOrderDs = [] ;

            const copy = ObjectUtil.deepCopyJ(this.dList)

            for(const row of copy) {

                for(const ds of row.t_p_order_details) {
                    ds.product_name = row.product_name ;
                }

                tPOrderDs.push(...row.t_p_order_details)

            }

            const copy2 = ObjectUtil.deepCopyJ(this.dConsList)
            for(const row of copy2) {
                
                if(_.isEmpty( row.t_p_order_detail )) continue ;
                tPOrderDs.push(row.t_p_order_detail)

            }

            return tPOrderDs ;

        } ,

        // 仕入済かどうかの判定
        cTPInvoice : function(){
            return function(n){
                if(!ObjectUtil.isNUE(n.t_p_invoice_details)) return true
            }
        } ,

        //未発注数
        cUnorderNum : function(){

            let unorderMaterial = 0 ;
            if(!_.isEmpty(this.productList)) {
                for(const product of this.productList) {
                    // const filterd = product.t_project_product_processes.filter( x => 
                    //     !x.is_order_needed && !x.is_enabled && x.is_ordered
                    // ) ;
                    for(const process of product.t_project_product_processes) {
                        if( !process.is_order_needed || !process.is_enabled || process.is_ordered) continue ;

                        if(!process.is_use_stocked && _.isEmpty(process.t_p_order_details)) {
                            unorderMaterial++; 
                        }

                    }
                }
            }
            
            let unorderCons = 0 ;
            if(!_.isEmpty(this.dConsList)) {
                for(const cons of this.dConsList) {
                    if(_.isEmpty(cons.t_p_order_detail)) unorderCons++
                }
            }
            const val = unorderMaterial + unorderCons ;
            this.$emit('countUnorderNum',val) ;

            return val
        } ,

        cIsViewOrderedPrice : function(){
            return function(val){
                return _.isNil(val) ;
            }
        } ,

        /**カラム系 */
        //発注用物件名
        cPOrderProjectNameCName : function () {
            const colName = "po_project_name" ;
            return colName ;
        } ,
        cPOrderProjectName :{
            get :  function() {
                return this.getValue(this.cPOrderProjectNameCName)  ;
            } ,
            set : function(val) {
                this.setValue(this.cPOrderProjectNameCName, val)  ;
            }
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
        getValue : function(colName )  {
            return this.$$getValue("value" , colName) ;
        } ,
        setValue : function(colName , val){
            this.$$setValue("value" , colName , val  ) ;
        } ,
        /**
         * データ取得後に変更があったかチェック
         */
        getIsUpdated : function() {
            let isUpdated = true ;
            if ( this.lastSaved !== undefined ) {
                // delete this.dLastSaved["m_customer"] ;
                isUpdated = ! this.value.isSame(this.lastSaved) ; 
                // console.log("isUpdated :" + isUpdated) ;                 
                
            }

            return isUpdated ;

        } ,
        //master情報呼び出し(発注タブを開いた時に発火)
        getMMaterials : async function() {
            
            let materialEp = `api/mMaterial/findByIds` ;

            try {

                //検索するId配列が前の検索と同じ場合に検索しない
                if(this.cMMaterialDIds.length > 0 && this.cMMaterialDIds.toString() !==  this.dBeforeMIds.toString()) {

                    const res = await axios.post(materialEp ,this.cMMaterialDIds) ;
                    const resList = res.data ;

                    this.dMMaterials = resList ;
                    this.dBeforeMIds = this.cMMaterialDIds ;

                }

                this.createFormatRow() ;


            } catch (error) {

                this.$$errorConsole(error,materialEp ) ;

            }


        } ,
        //t_processを描画用に成型
        createFormatRow : function(){
            const result = [] ;

            let list = ObjectUtil.deepCopyJ(this.cProducts) ;
            list = list.map(x => TProjectProduct.parse(x)) ; 
            
            for(const product of list) {

                if(product.deleted_at !== null) continue ;

                for(const process of product.t_project_product_processes) {

                    //発注不用品除外
                    // if( !process.is_order_needed || !process.is_enabled || process.is_ordered) continue ;
                    if( !process.is_order_needed || !process.is_enabled) continue ;

                    // 分割があるかの判定
                    let isSeparate = 0 ;
                    if( product.t_project_product_separates.length >0 ) isSeparate = 1 ;

                    //新規商品用の逃げ
                    const processid = process.id ?? null ;
                    const tPOrderDs = process.id ? process.t_p_order_details : [] ;

                    // const processCopy = ObjectUtil.deepCopyJ(process) ;

                    const processLink = {
                        id : process.id ,
                        t_project_product_process_order_detail : {
                            is_preceding : 0 ,
                        }

                    }

                    //描画用情報
                    const viewList = {
                        name                         : process.display_order_01 ,
                        display_name                 : process.display_order_01 ,
                        product_name                 : product.name ,
                        num_of_needed                : null ,
                        supplier_m_customer_id       : 0 ,
                        supplier_m_customer          : {
                                                        name               : process.display_order_03 ,
                                                        short_name_or_name : process.display_order_04 ,
                                                        } ,
                        is_separate                  : isSeparate , //分割フラグ
                        short_hand                   : 0 ,
                        m_branch_id                  : process.m_branch_id ,
                        m_branch                     : this.cMBranch(process.m_branch_id) ,
                        due_date                     : null ,
                        t_project_product_process_id : processid ,
                        t_project_product_processes  : processLink ,
                        is_use_stocked               : process.is_use_stocked , //在庫使用フラグ
                        m_material_id                : null ,   
                        m_material_details           : [] ,                     //寸法など明細行
                        t_project_id                 : this.value.id ,
                        t_project                    : {
                                                        name            : this.value.name ,
                                                        cd              : this.value.cd,
                                                        po_project_name : this.cPOrderProjectName ,
                                                      } ,                                              
                        t_p_order_details            : tPOrderDs ,
                        shipping_address             : "" ,
                        slip_memo                    : "" ,
                        product_cat_order_no         : product.m_product_category.order_no , //ソート用
                        is_outsource                 : process.is_outsource, //外注フラグ
                        boardInputInfo               : [] ,//手入力サイズ板情報
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
                        t_project_product_process_id : processid ,

                    }

                    const categoryId = process.m_process_category_id ;


                    /**
                     *1,材料系（メディア、ラミ、板）
                     */
                    if(!process.is_outsource) {

                        viewList.num_of_needed          = process.n_13 ;
                        viewList.supplier_m_customer_id = process.supplier_m_customer_id ;
                        //板
                        let isBoard = false;
                        categoryId == 7 || categoryId == 24 ? isBoard = true : false ;  
                        if( isBoard && product.t_project_product_boardlayouts.length>0) {

                            for(const boardLayout of product.t_project_product_boardlayouts) {

                                const copyDet = ObjectUtil.deepCopyJ(det) ;

                                viewList.num_of_needed = boardLayout.qty ;

                                //発注連動用にemailを設定
                                // viewList.supplier_m_customer.email = boardLayout.m_material_detail.m_material.email ;
                    
                                //板手入力
                                if(process.is_01) {

                                    copyDet.unit_price  = boardLayout.price ;
                                    copyDet.width       = boardLayout.w ;
                                    copyDet.height      = boardLayout.h ;
                                    copyDet.detail_name = this.formatMMaterialDetailName(boardLayout.w,boardLayout.h) ;
                                    copyDet.unit_m_kv_id = 1530013 ;

                                    viewList.m_material_details.push(copyDet) ;


                                    
                                } else {
                                    //板マスタ呼び出し
                                    const materialDsCopy = ObjectUtil.deepCopyJ( boardLayout.m_material_detail) ;

                                    if(materialDsCopy) {
                                        viewList.name                   = boardLayout.m_material_detail.m_material.name ;
                                        viewList.supplier_m_customer_id = boardLayout.m_material_detail.m_material.supplier_m_customer_id ;
                                        viewList.supplier_m_customer    = boardLayout.m_material_detail.m_material.supplier ;


                                        //手動レイアウト or 外注カット
                                        if(process.n_02 == 1 || boardLayout.is_outsource_cut) {
                                            if(boardLayout.w) materialDsCopy.width = boardLayout.w ;
                                            if(boardLayout.h) materialDsCopy.height = boardLayout.h ;
                                            materialDsCopy.detail_name = this.formatMMaterialDetailName(materialDsCopy.width,materialDsCopy.height) ;
                                        }
                                        
                                        viewList.m_material_details.push(materialDsCopy)

                                    } 
                                    else {

                                        viewList.m_material_id = process.m_material01.id ;                                        
                                        viewList.isBoardInputSize = 1 ;
                                        const obj = {
                                            boardInputSizeW : boardLayout.w,
                                            boardInputSizeH : boardLayout.h,
                                            boardInputUnitPrice : boardLayout.price
                                        } 

                                        viewList.boardInputInfo.push(obj) ;
                                                                                
                                        //寸法入力
                                        // copyDet.unit_price  = boardLayout.price ;
                                        // copyDet.width       = boardLayout.w ;
                                        // copyDet.height      = boardLayout.h ;
                                        // copyDet.detail_name = this.formatMMaterialDetailName(boardLayout.w,boardLayout.h) ;
                                        // copyDet.unit_m_kv_id = 1530013 ;

                                        // viewList.m_material_details.push(copyDet) ;

                                    }



                                    
                                }

                            }

                            result.push(viewList) ;

                        //幕ラミ塩ビ手入力
                        } else if (process.is_01) {

                            det.unit_price  = process.n_05 ;
                            det.width       = process.n_01 ;
                            det.height      = process.n_03 ;

                            if(categoryId == 6 || categoryId == 3) {

                                det.height = process.n_03*1000 ; //巻M数を巻MM数に変換(ロール系資材)

                            }

                            det.detail_name = process.display_order_02 ;
                            det.unit_m_kv_id = 1530001;

                            viewList.m_material_details.push(det) ;

                            result.push(viewList) ;

                        //幕ラミ塩ビ材料マスタ呼び出し
                        } else {

                            for (let i = 1; i <= 25; i++) {

                                let count = i + '' ;
                                let colName = 'm_material_id_' + NumberUtil.formatZeroPadding(count , 2) ;
                                

                                //該当カラムに情報がない場合
                                if(!process[colName]) continue ;

                                if(categoryId == 6) {
                                    //短手取得(ロール系資材)
                                    const W = product.size_w + product.size_extend_l + product.size_extend_r ;
                                    const H = product.size_h + product.size_extend_t + product.size_extend_b ;
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
                        // console.log(process)
                        let unitPrice = process.outsource_cost_by_input ;

                        if(NumberUtil.invalid2zr(unitPrice) === 0) {
                            unitPrice = process.predicted_outsource_cost_per_qty
                        }

                        viewList.supplier_m_customer_id = process.supplier_m_customer_id ;
                        viewList.num_of_needed          = NumberUtil.invalid2zr(process.outsource_qty) * product.qty;
                        viewList.is_outsource           = process.is_outsource ;
                        det.unit_price                  = unitPrice ?? 0 ;
                        det.unit_m_kv_id                = 1530003 ;

                        viewList.m_material_details.push(det) ;
                        result.push(viewList) ;

                    }
                }
            }
            this.dList = this.setMasterInfo(result) ;



        } ,
        /**取得したマスター情報あてこみ */
        setMasterInfo : function(list) {

            if(this.cMMaterialDIds.length===0) return list ;

            for(const row of list) {
                if(!row.t_project_product_process_id) continue ;

                const foundM = this.dMMaterials.find(e => e.id == row.m_material_id) ;
                

                if(foundM) {
                    //v:key重複回避用
                    const foundMCopy = ObjectUtil.deepCopyJ(foundM) ;
                    foundMCopy.t_project_product_process_id = row.t_project_product_process_id ;

                    row.supplier_m_customer_id = foundMCopy.supplier_m_customer_id ;
                    row.supplier_m_customer = foundMCopy.supplier ;
                    row.name = foundMCopy.name ;

                    let validList = foundMCopy.m_material_details ;
                    if(row.isBoardInputSize) {
                        validList = validList.filter( x=> x.is_able_to_input_size) ;
                        
                        //外注カットあり
                        if ( validList.length > 0){
                            for(const bInfo of row.boardInputInfo) {
                                const copy = ObjectUtil.deepCopyJ(validList) ;
                                copy[0].width = bInfo.boardInputSizeW
                                copy[0].height = bInfo.boardInputSizeH ;
                                copy[0].detail_name = this.formatMMaterialDetailName(bInfo.boardInputSizeW,bInfo.boardInputSizeH) ;
                                copy[0].unit_price = bInfo.boardInputUnitPrice ;

                                row.m_material_details.push(copy[0]) ;                            

                            }

                        } else {

                            row.m_material_details = foundMCopy.m_material_details ;                            

                        }
                        

                    } else {

                        if(!row.is_separate) validList = foundMCopy.m_material_details.filter(x => x.width - x.width_margin >= row.short_hand) ;
                        row.m_material_details.push(...validList) ;

                    }



                }


            }

            //未発注材料数カウント
            const count = list.filter(x=>!x.is_use_stocked && x.t_p_order_details.length==0).length  ;
            // this.$emit('countUnorderNum',count) ;


            return list ;

        } ,

        checkUseStocked : function(row) {

            row.is_use_stocked = !row.is_use_stocked ;

            //t_productのレコード変更
            for(const product of this.productList) {

                const found = product.t_project_product_processes.find(x=>x.id===row.t_project_product_process_id) ;

                if(found) this.$set(found,"is_use_stocked",row.is_use_stocked) ;
                // found.is_use_stocked = row.is_use_stocked ;

            }

            //描画データ変更
            this.createFormatRow() ;
            // const foundViewRow = this.dFilteredList.find( x=> x.id === row.t_project_product_process_id) ;
            // if(foundViewRow) foundViewRow.is_use_stocked = row.is_use_stocked ;

        } ,



        //材料発注
        postOrder : async function(tPOrder) {

            if(!tPOrder) return ;
            if (this.getIsUpdated() || this.value.id === undefined){
                alert("変更されたデータがあります。物件を保存してください。")
                return ;
            } 
            const copy = ObjectUtil.deepCopyJ(tPOrder) ;

            for(const row of copy) {

                //物件からの発注フラグ
                row.isTProject = true ;

                if(row.t_p_order_details?.length === 0) continue ;

                for(const ds of row.t_p_order_details) {

                    const size = this.formatMMaterialDetailName(ds.material_size_x,ds.material_size_y) ;
                    ds.po_material_name = ds.material_name + size ;

                    ds.t_project_product_process_order_detail = {
                        t_project_product_process_id : ds.t_project_product_process_id ,
                        is_preceding : 0 ,
                    } ; 

                }
            }

            this.dOrderList = copy ;

            this.$refs.orderListModal.clearMassages() ;
            this.$refs.orderListModal.dIsConstruction = false ;

            $('#modalOrder').modal() ;

            this.dOrderListModal = true ;


        } ,

        //施工発注
        postConstructionOrder : function(tPOrder) {

            if(!tPOrder) return ;
            if (this.getIsUpdated() || this.value.id === undefined){
                alert("変更されたデータがあります。物件を保存してください。")
                return ;
            } 
            const copy = ObjectUtil.deepCopyJ(tPOrder) ;

            for(const row of copy) {

                //物件からの発注フラグ
                row.isTProject = true ;

                if(row.t_p_order_details?.length === 0) continue ;
            }

            this.dOrderList = copy ;

            this.$refs.orderListModal.clearMassages() ;
            this.$refs.orderListModal.dIsConstruction = true ;

            $('#modalOrder').modal() ;

            this.dOrderListModal = true ;
        },

        //材料のとき発注リストからのreturnを発注済リストに挿入
        setOrderedRow : function(tPOrders) {
            if(!tPOrders) return ;

            // console.log(tPOrders) ;

            for(const row of tPOrders) {

                const parsed = ObjectUtil.deepCopyJ(row) ;
                delete parsed.t_p_order_details ;
                
                for(const detail of row.t_p_order_details) {
                    
                    detail.t_p_order = parsed ;


                    for( const process of detail.t_project_product_processes) {

                        // t_projectのレコード更新
                        for(const product of this.productList) {
                            
                            const found     = product.t_project_product_processes.find(x => x.id == process.id ) ; 
                            const foundIdx  = product.t_project_product_processes.indexOf(found) ; 
                            
                            if(foundIdx !== -1) {
                                
                                //出来たリンクテーブルのデータを移植
                                const pushData = ObjectUtil.deepCopyJ(detail) ;
                                const linkData = pushData.t_project_product_processes.find(x => x.id === process.id).t_project_product_process_order_detail ;

                                delete pushData.t_project_product_processes ;

                                pushData.t_project_product_process_order_detail = linkData ;

                                product.t_project_product_processes[foundIdx].t_p_order_details.push(pushData) ;

                            }
                            

                        }

                        //描画データの更新
                        const found2    = this.dList.find(x => x.t_project_product_process_id === process.id ) ;
                        const foundIdx2 = this.dList.indexOf(found2) ;
                        if(foundIdx2 !== -1) this.dList[foundIdx2].t_p_order_details.push(detail) ;

                    }


                    

                }

            }


        } ,

        //施工の時発注リストからのreturnを発注済リストに挿入
        setConstructionOrderedRow : function(tPOrders) {
            if(!tPOrders) return ;

            for(const row of tPOrders) {

                const parsed = ObjectUtil.deepCopyJ(row) ;
                delete parsed.t_p_order_details ;
                
                for(const detail of row.t_p_order_details) {
                    
                    detail.t_p_order = parsed ;

                    //施工
                    for(const del of this.value.t_project_deliveries) {
                        const found = del.t_project_construction_users.find( x => x.id == detail.t_project_construction_user_id)
                        const foundIdx = del.t_project_construction_users.indexOf(found) ;
                        // console.log(found)
                        
                        if(foundIdx !== -1) {
                            //construction_usersはdeleteInsertで保存なためリレーション先のidを削除して物件保存時にサーバー側で再度紐づけを行う
                            // delete detail.t_project_construction_user_id ;
                            // detail.id = null ;
                            this.$set(del.t_project_construction_users[foundIdx],"t_p_order_detail",detail)
                            // del.t_project_construction_users[foundIdx].t_p_order_detail = detail ;
                        }
                    }

                    

                }

            }
            // console.log(this.value.t_project_deliveries)


        } ,
        destroy : async function(tPODs) {
            if (! confirm('削除してよろしいですか?')) return ;

            let id = tPODs.id ;
            try {
                const ep = `api/tPOrderDetail/${id}` ;
                const res = await axios.delete(ep) ;

                if(_.isNil(tPODs.t_project_construction_user_id)) {
                    //材料発注削除
                    for(const product of this.productList){

                        for(const process of product.t_project_product_processes) {

                            const deletedDVal = process.t_p_order_details.find(x => x.id === id );
                            const delDValIndex = process.t_p_order_details.indexOf(deletedDVal) ;
                            if ( delDValIndex != -1 ) process.t_p_order_details.splice(delDValIndex , 1) ;

                        }

                    }

                    for(const row of this.dList){
                        const deletedDisp = row.t_p_order_details.find(x => x.id === id );
                        const delDispIndex = row.t_p_order_details.indexOf(deletedDisp) ;
                        if ( delDispIndex != -1 ) row.t_p_order_details.splice(delDispIndex , 1) ;

                    }
                } 
                else{
                    //施工削除
                    for(const del of this.value.t_project_deliveries) {

                        if(_.isEmpty(del.t_project_construction_users)) continue ;

                        const deletedConsUser = del.t_project_construction_users.find( x => x.id == tPODs.t_project_construction_user_id) ;
                        const delConsUserIndex = del.t_project_construction_users.indexOf(deletedConsUser) ;
                        // this.$set(del.t_project_construction_users[delConsUserIndex],"t_p_order_detail",null)
                        if(delConsUserIndex != -1) {
                            del.t_project_construction_users[delConsUserIndex].t_p_order_detail = null ;
                        }
                    }

                }
                
               
            }
            catch (error)
            {
                this.$$errorConsole(error ,ep ) ;
            }

        } ,

    } ,
    mounted() {
        this.$nextTick(function(){
            // console.log(this.value)
        })
    } ,



}
</script>
<style scoped>



</style>