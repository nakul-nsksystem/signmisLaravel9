<template>

    <div>
        <div class="row ">
            <div class="w-100 border-bottom mx-3 pb-2 mb-2">
                <div class="row ">
                    <div class="col-6 col-xl-6 d-flex align-items-end">
                        <p class="h5 pb-0 mb-0">自動</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <select class="custom-select"  
                        v-model="cMode"  >
                    <option :value="dPriorityModeJoinedQty">継ぎ枚数重視</option>
                    <option :value="dPriorityModeCost">コスト重視</option>
                </select>                
            </div>
        </div>


        <div class="row">
            <div class="col-12">
                <label >外注カット</label>                                    
                <ns-checkbox-input
                    v-model="cIsOutsourceCut"
                    :id="'BoardsRefMasterAuto-IsOutsourceCUt'"
                />
            </div>
        </div>


        <div>
            <!-- {{cTotalMaterialCost}}<br />
            {{cTotalCutCost}}<br /> -->
        </div>

        <div class="row py-2" v-if="cBestResult">
            <div class="col-12">        
                <boards-ref-master-auto-editor-res-view-4-container
                    v-if="cBestResult.IsSuccess"
                    v-model="cBestResult" 
                    :base64svg.sync="cBase64Svg"
                    :isNeedSvgUpdate="true"
                />
            </div>
        </div>        


        <!-- 以下デバッグ用 -->

        <div id="CardBoardLayoutDebug" v-show="$$cIsDebug">
            <div class="row">
                    <button 
                        class="btn btn-link col-12 text-left" 
                        type="button" 
                        data-toggle="collapse" 
                        data-target="#collapseBoardLayoutDebug"> 
                    <p class="h5 pb-2 border-bottom">
                        デバッグ用明細 New
                    </p>
                    
                </button>                
            </div>
            <div 
                id="collapseBoardLayoutDebug" 
                class="collapse" 
                data-parent="#CardBoardLayoutDebug">

   
                <div class="row my-2" 
                    v-show="$$cIsDebug" 
                    v-for="(n ,index) in cResults" :key="n.id" >
                    <div class="col-12">
                        <div class="row">
                            <div 
                                class="col-12 col-xl-6 font-weight-bold"
                                :class="n.IsSuccess?  'text-primary' : 'text-danger'"
                                >
                                {{n.MMaterialDetail.detail_name}} {{n.Layouter.Name}} {{n.IsSuccess}}
                            </div>
                            <div class="col-12 col-xl-2">{{n.MMaterialDetail.Sqm}} sqm</div>                    
                            <div class="col-12 col-xl-2">{{n.MMaterialDetail.cost_price}}円/枚</div>
                            <div class="col-12 col-xl-2">{{n.MMaterialDetail.CostPerSqm.toFixed(0)}}円/㎡</div>
                        </div>
                        
                        <!-- 結果 -->                
                        <boards-ref-master-auto-editor-res-view-4-container
                            v-if="n.IsSuccess"
                            v-model="cResults[index]" 
                        />
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { BoardAutoLayoutPriorityModes } from '../../../../frameworks/BoardLayout/autoLayout/models/TypeBoardAutoLayout';
import NumberUtil from '../../../../frameworks/NumberUtil';
import { BoardLayoutContainerRefMasterAuto } from '../../class/boardLayouts/containers/BoardLayoutContainerRefMasterAuto';

export default {    
    data :  function() {
        return {                      /**
             * レイアウト　数量重視（少ないほうがいい）
             */
            dPriorityModeJoinedQty : BoardAutoLayoutPriorityModes.JOINED_QTY ,

            /**
             * レイアウト　コスト重視（少ないほうがいい）
             */
            dPriorityModeCost : BoardAutoLayoutPriorityModes.COST ,

        } 
    } , 
    props : {
        value : {
            type : BoardLayoutContainerRefMasterAuto , 
            default : () => [] ,
        } ,
        
        /**
         * Mode 
         *  qty:枚数重視
         *  cost:コスト重視
         */
        mode : {
            type : String ,
            default : () => this.dPriorityModeJoinedQty ,
        } ,

        isOutsourceCut : { 
            type : [Boolean,Number] , 
        }

    } ,
    computed : {
        /**
         * SVG noBase64
         */
        cBase64Svg : {
            get :  function() {
                return this.dBase64Svg ; 
            } ,
            set :  function(val ) {

                this.dBase64Svg = val ; 
                this.$emit("update:base64svg" , val) ; 
            } ,
            

        } , 
        /**
         * 金額の表示フラグ
         */
        cIsViewPrice : function() { 
            const val = NumberUtil.invalid2zr(this.mainStore.getRole("t_project-price-view-permission")) ; 
            return val >= 10 ; 
        } , 

        cMode :{
            get :  function() {                
                return this.mode ;
            } ,
            set : function(val) {
                this.value.PriorityMode = val ; 
                this.$emit("update:mode" , val ) ;                 
            }
        } ,

        cIsOutsourceCut :{
            get :  function() {                
                return this.isOutsourceCut ;
            } ,
            set : function(val) {
                this.value.IsOutsourceCut = val ; 
                this.$emit("update:is-outsource-cut" , val ) ;                 
            }
        } ,

        

        
        /**
         * 全シミュレーション結果
         */
        cResults :  function() {
            return this.value.AutoResults ; 
            
        } , 
        
        /**
         * モードに応じた結果
         */
        cBestResult : function() {
            // console.log("cBestResult") ;             
            return this.value.BestResult ; 
            
            
        } ,



    } ,
    methods : {

    } ,
}
</script>