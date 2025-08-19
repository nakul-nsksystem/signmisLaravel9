<template>
    <div class="card bg-app-secondaly">
            
        <div class="card-header d-flex px-2"> 
            <div v-if="isSelectable && isDelivery"
                 style="padding-left: 0.75rem;">
                <div class="flex-grow-0 flex-shrink-0" style="flex-basis:40px">
                    <NsCheckboxInput
                        v-model="dAllSelected"
                        @change="selectAllProducts"
                        :id="'delProdLinkAllSelectCheck'"
                        :label="'全選択'"
                        />       
                </div>    
            </div>
        </div>

        <ul class="list-group list-group-flush">
            <li v-for="( n ,index ) in cTProjectProducts"            
            class="list-group-item bg-app-secondaly">
                <div class="d-flex" v-if="n.deleted_at == null">
                    <div v-if="isSelectable"
                        class="flex-grow-0 flex-shrink-0" style="flex-basis:40px;"
                        >
                        <ns-checkbox-input                            
                            v-model="n.is_selected"
                            @change="changeSelected(n)"
                            :id="`TProductViewList-isSelected${n.id}`"
                            v-if="!isDelivery"
                            />
                        <ns-checkbox-input                            
                            v-model="n.is_selected"
                            @change="checked"
                            :id="`TProductViewList-isSelected${index}`"
                            v-else
                            />
                    </div>
                    <div class="flex-grow-1 flex-shrink-1" >
                        <t-product-view-row-component 
                            :value="n" 
                            :is-production="isProduction"
                            :is-view-result-control="isViewResultControl"
                            :is-delivery="isDelivery"
                            :index="index" >
                        </t-product-view-row-component>

                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import DayJsEx from '../../../../frameworks/DayJsEx';
import NumberUtil from '../../../../frameworks/NumberUtil';
import ObjectUtil from '../../../../frameworks/ObjectUtil';


export default {
    data :  function() {
        return {

            // 編集中
            dIsEditingProduct : false ,  

            dSelectedProductIndex : -1 ,

            dAllSelected : false ,

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
         * 選択可能
         */
        isSelectable : { 
            type : Boolean , 
            default : () => false , 
        } ,
        /**
         * 生産モード ( display_dispを使用 が)
         */
        isProduction : { 
            type : Boolean , 
            default : () => false , 
        } ,
        /**
         * 生産実績操作用パネル表示
         */
        isViewResultControl : { 
            type : Boolean , 
            default : () => false , 
        } ,

        /**
         * 納品紐づけで使用（分納チェック、数量入力）
         */
        isDelivery : {
            type : Boolean , 
            default : () => false ,
        }
        
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
            const list = this.productList.map(x => {
                // x.is_selected = false ; 
                return x ; 
            })
            // return this.productList ; 
             return list; 
        } , 

        
        /**
         * サムネイル
         */
        cThumbnail : function(){
            return function(row){
                // console.log("thumbnail") ;
                const date = DayJsEx.format(new Date() , "YYYYMMDDHHmmss") ;
                let list = [] ;
                let tProjectMail = ObjectUtil.deepCopyJ(this.value.t_project_mails) ;
                tProjectMail.map(function(x){
                    list.push(...x.t_project_files) ;
                }) ;
                list.push(...this.value.t_project_files) ;

                //idが一致を検索する
                const fileLinkId = row.t_project_file_id ; 
                if(fileLinkId) {
                    const found = list.find(x => x.id === fileLinkId) ;
                    // if(!found) return ;
                    if(found.is_unsave) return `storage/temporary/t_project/${found.filename}?${date}`
                    return `storage/attachment_files/t_project/${this.value.cd}/${found.filename}?${date}` ;
                }

                //未保存の場合、uidが一致を検索する
                const uid = row.t_project_file_uid ;
                if(!uid) return ;
                                            
                const selectedFileRow = list.find(x => x.uid === uid) ;

                if(selectedFileRow.is_unsave) return `storage/temporary/t_project/${selectedFileRow.filename}?${date}`
                return `storage/attachment_files/t_project/${this.value.cd}/${selectedFileRow.filename}?${date}` ;
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

        changeSelected : function(n) { 
            const filterd = this.cTProjectProducts.filter(x => x.is_selected) ; 
            const ids = filterd.map(x => x.id) ; 
            this.$emit("update:selected-t-product-ids" , ids ) ; 
        } , 

        /**
         * 伸ばし込のサイズW 取得
         */
        getExtendedW : function(row) {
            let val = 0 ; 
            if ( row === undefined)  return val ; 

            val = NumberUtil.invalid2zr(row.size_w) 
                + NumberUtil.invalid2zr(row.size_extend_l) 
                + NumberUtil.invalid2zr(row.size_extend_r)  ;

            return val ; 
        } ,        
        /**
         * 伸ばし込のサイズH 取得
         */
        getExtendedH : function(row) {
            let val = 0 ; 
            if ( row === undefined)  return val ; 

            val = NumberUtil.invalid2zr(row.size_h) 
                + NumberUtil.invalid2zr(row.size_extend_t) 
                + NumberUtil.invalid2zr(row.size_extend_b)  ;

            return val ; 
        } ,

        
        // base64された板レイアウトのSVGイメージ        
        getBoardLayoutBase64Svg : function(row) {
            const colName = "board_layout_base64_svg" ; 
            const b64 = ObjectUtil.nu2ec( row[colName] ); 
            return `data:image/svg+xml;base64,${b64}` ; 
        } , 


        /**
         * 値がNull Undefinedではない
         */
        isValidVal : function(val) 
        {
            return ! ObjectUtil.isNullOrUndefined(val) ; 
        } , 

        /**
         * 工程の予測時間を取得
         */
        getPredictedWorkHour : function(tpProcess) {
            return NumberUtil.invalid2zr( tpProcess.predicted_work_hour) ; 
        } , 

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
        getMBranchName : function(n) {
            if ( ObjectUtil.isNU(n.m_branch_id)) return "" ; 

            const finded = this.mainStore.masters.MBranches.find(x => x.id == n.m_branch_id ) ; 
            if ( ObjectUtil.isNU(finded) ) return "" ; 

            return finded.shortNameOrName ; 

        } , 

        /**
         * 分割があるかどうか
         */        
        getIsSep : function(n) {
            if ( ObjectUtil.isNU(n.t_project_product_separates) || 
                n.t_project_product_separates.length === 0 ) return false ; 

            return true ; 
        } , 

        /**
         * 分割の詳細
         * 
         */
        getSep : function(n , isW) {
            const list = n.t_project_product_separates.filter(x => x.is_w == isW ) ; 
            const pos = list.map(x => x.pos ) ; 

            //console.log(pos) ; 
            return pos; 
        } , 

        /**
         * SplitView用のオブジェクト
         */
        getSepObj : function(n , isW) {
            const numOfSep = (isW ? n.num_of_sep_w :n.num_of_sep_h ) ?? 1 ;
            const sepWay   = (isW ? n.sep_way_w :n.sep_way_h )    ?? 1 ;

            //console.log(n) ; 
            const rtnObj = {
                numOfSep :numOfSep , 
                way : sepWay , 
                positions : isW ? this.getSep(n , true) : this.getSep(n , false) ,
            } ; 
            
            //console.log(rtnObj) ; 
            return rtnObj ;            
        } , 
        
        /**
         * 分割情報
         */
        getSepInfo : function(n) {
            if ( ! this.getIsSep(n) ) return "" ; 
            
            //const wPos = n.t_project_product_separates.filter(x => x.is_w ) ; 
            //const hPos = n.t_project_product_separates.filter(x => ! x.is_w ) ; 
            const wPos = this.getSep(n , true ) ; 
            const hPos = this.getSep(n , false ) ; 

            let info = "" ; 
            if ( wPos.length > 0 ) {
                const sepPosInfoW = this.getSepPosInfo(n.sep_way_w , wPos) ; 
                info += `W : ${sepPosInfoW}`  ; 
            }

            if ( hPos.length > 0 ) {
                const sepPosInfoH = this.getSepPosInfo(n.sep_way_h , hPos) ; 
                info += info.length === 0 ? "" : "  " + `H : ${sepPosInfoH}`  ; 
            }

            if ( info.length > 0 ) info = `分割 : ${info}` ;

            return info ; 

        } , 

        /**
         * 位置のリスト取得
         */
        getSepPosInfo : function(sepWay , list ) {
            let sepWayStr = "" ; 
            switch ( sepWay){
                case 1 : // 均等割り
                    sepWayStr = "均等割り" ; 
                    break ; 

                case 2 : // 指定
                    sepWayStr = "指定" ; 
                    break ; 

            }

            let posStr = "" ; 
            /*
            if ( sepWay === 2) {
                // 指定の場合のみ                    
                posStr += " ( " ; 
                for ( const pos of list) {
                    posStr +=  pos + " , ";  
                }
                posStr = posStr.substring(0 ,posStr.length - 2 ) + " )";

            }
            */

            return `${sepWayStr} ${posStr}`  ; 
        } , 


        /**
         * 板レイアウトがあるかどうか
         */        
        getIsBoardLayout : function(n) {

            if ( ObjectUtil.isNU(n.t_project_product_boardlayouts) || 
                n.t_project_product_boardlayouts.length === 0 ) return false ; 

            return true ; 
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


        //全選択チェックボックス(納品紐づけ時に使用する)        
        selectAllProducts : function(){
            if(_.isEmpty(this.cTProjectProducts)) return ;

            for(const product of this.cTProjectProducts) {
                this.$set(product ,"is_selected" ,this.dAllSelected)
                // product.is_selected = this.dAllSelected ;
            }
        } ,
        checked : function() {
            const isAllC = this.cTProjectProducts.find(x => !x.is_selected) === undefined ;
            if(!this.dAllSelected && isAllC) {
                this.dAllSelected = true ;
            } 
            else if(this.dAllSelected && !isAllC) {
                this.dAllSelected = false
            }
        } 

        
    }

}
</script>
<style scoped>



</style>