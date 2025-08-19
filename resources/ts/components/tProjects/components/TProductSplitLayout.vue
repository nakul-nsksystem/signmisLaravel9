<template>
    <div>
        <div v-show="cErrorMsg.length > 0" class="alert alert-danger" role="alert">
            <div style="white-space: pre;">{{cErrorMsg}}</div>            
        </div>
        <div id="CardSheetSeparate" class="mb-3">
            <div class="row">
                <button class="btn btn-link col-12 text-left" 
                    type="button" 
                    data-toggle="collapse" 
                    data-target="#collapseSheetSeparate" 
                    aria-expanded="true" 
                    aria-controls="collapseSheetSeparate">
                    <p class="h5 pb-2 border-bottom">
                        割り設定
                    </p>                    
                </button>      
            </div>        
            <div 
                id="collapseSheetSeparate" 
                class="collapse show" 
                data-parent="#CardSheetSeparate">
                <product-split-editor 
                    v-model="value"
                    :selectedSide="cSelectedSide"
                    :w="value.SizeIncExtW"
                    :h="value.SizeIncExtH"                    
                    :extend-t="value.SizeExtendT"
                    :extend-b="value.SizeExtendB"
                    :extend-l="value.SizeExtendL"
                    :extend-r="value.SizeExtendR"
                    :isViewDimensions="true"
                    :isNeedSvgUpdate="true"
                    :base64svg.sync="cBase64Svg"
                />

            </div>
        </div>

        <div id="CardSheetLayout">
            <div class="row">
                    <button class="btn btn-link col-12 text-left" 
                    type="button" 
                    data-toggle="collapse" 
                    data-target="#collapseSheetLayout" 
                    aria-expanded="true" 
                    aria-controls="collapseSheetLayout">
                    <p class="h5 pb-2 border-bottom">
                        レイアウト 
                        <span v-if="! cIsLayoutSuccess" class="text-danger">NG</span>
                        <span v-if="cIsLayoutSuccess" class="text-success">OK</span> 
                    </p>
                    
                </button>                
            </div>
            <div 
                id="collapseSheetLayout" 
                class="collapse" 
                data-parent="#CardSheetLayout">
                
                <simple-roll-layout-simulation
                    :sheets="value.main_material_roll_sheets"
                    :rects="cSeparatedRects"
                    :sheetMarginT="0"
                    :sheetMarginB="0"
                    :sheetMarginL="0"
                    :sheetMarginR="0"
                    :qty="value.qty"
                    :is-view-info="false"
                    :ng-list.sync="dLayoutNgList"
                    :ok-list.sync="cLayoutOkList"
                />

                
            </div>

        </div>
    </div>

</template>
<script >
import { TProjectProduct } from '../class/models/TProjectProduct';

export default {    
    data : function() {
        return {
            dSeparatedRects : [] , 
            dLayoutNgList   : [] , 
            dLayoutOkList   : [] , 
            
        }
    } ,  
    props : {
        value : {
            type : Object , 
        } ,
        // params : {
        //     type:Object ,
        // } , 
                

    } , 
    computed : {
        /**
         * ViewからのEmit
         */
        cBase64Svg : {
            get :  function() {
                return this.dBase64Svg ; 
            } ,
            set :  function(val ) {                
                this.dBase64Svg = val ; 
                this.$emit("update:separate-base64svg" , val) ; 
            } ,
            

        } , 

        cSelectedSide : function() {
            // if ( this.cWSep.numOfSep === 1 &&  this.cHSep.numOfSep > 1 ) return "H" ; 
            return "W" ; 
        } , 



        cSeparatedRects : function() { 
            return this.value.SeparatedSheets ; 
        } , 
        // レイアウト結果
        cLayoutOkList : {
            get :  function() {                
                return this.dLayoutOkList ;
            } ,
            set : function(val) {
                this.dLayoutOkList = val  ;  
                this.$emit("update:layout-ok-list" , val ) ; 
            }

        } , 
        
        // レイアウト結果
        cLayoutNgList : {
            get :  function() {                
                return this.dLayoutNgList ;
            } ,
            set : function(val) {
                this.dLayoutNgList = val  ;  
                this.$emit("update:layout-ng-list" , val ) ; 
            }

        } , 

        // レイアウト成功しているかどうか
        cIsLayoutSuccess : function() 
        {
            const isSuccess = this.dLayoutNgList.length == 0 && this.dLayoutOkList.length > 0  ; 
            this.$emit("update:is-layout-success" , isSuccess ) ; 
            return isSuccess ; 
        } ,        
        cErrorMsg : function() 
        {
            let errMsg = "" ;  
            // console.log(mMaterial) ; 
            // if ( mMaterial === undefined || Object.keys(mMaterial).length === 0) 
            // {
            //     errMsg += "メディアが選択されていません。\n" ; 
                
            // }
            

            const sheets = this.value.main_material_roll_sheets ; 
            if ( sheets === undefined || sheets.length < 1) 
            {
                errMsg += "メディアの寸法が存在しません。" ; 
                
            }
            else
            {
                if (! this.cIsLayoutSuccess) {
                    errMsg += "メディアの寸法に商品が入りません。分割を行ってください。" ; 

                }
            }

            

            return errMsg ; 
        }
    } ,
    methods : {
    } ,
}
</script>

