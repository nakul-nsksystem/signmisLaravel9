<template>
    <div class="card-body app-card-body"> 
        <div v-show="$$cIsDebug">
            {{m$cDisplay}}
            <!-- <p>Is {{dValue.IsPrint}}</p>            
            <p>IsStore {{dValue.IsStoreSet}}</p>            
            <p>{{dValue.MProductionName01}}</p>            
            <p>{{dValue.MProductionModeName01}}</p>
            <p>{{dValue.MProductionOptionName01}}</p>
            <p>{{dValue.FRMKvId}}</p>
            <p>Trans {{dValue.IsTransparentMedia}}</p> -->
        </div>
        <div v-show="$$cIsDebug">
            加工 {{cProcessMater}} m
        </div>
        
               
        <!-- 工程備考(MProcessCategory.Memo) -->
        <tProductProcessCMProcessMemo
            v-model="dValue"
        />

        <!-- 外注 -->
        <tProductProcessCOutSourceSelect
            v-model="dValue" 
            :m-product-category-id="tProduct.m_product_category_id"
            :m-process-category-id="dValue.m_process_category_id"
            />
        
        <!-- 生産先 -->
        <tProductProcessCMProduction
            v-model="dValue"
            :m-product-category-id="tProduct.m_product_category_id"
            :m-process-category-id="dValue.m_process_category_id"
            :is-use-options="true"
            :option-label="'印刷方式'"
        />


        <div class="row">
            
            <div class="pl-3 flex-grow-0 flex-shrink-0 form-group text-center" style="flex-basis:70px;">
                <label >両面</label>
                <ns-checkbox-input
                    v-model="cIsDoubleFace"
                    :id="'PrintIsDoubleFace'"
                    />                                
            </div>
            <div class="col-12 col-xl-3 pl-3 pl-xl-0 " v-show="cIsTransparentMedia">

                <div class="form-group">
                    <label >正転・反転</label>        
                    <validation-provider name="正転・反転" 
                        vid="print-cFRMKvId"
                        :rules="`${m$cIsEnabled && cIsTransparentMedia ? 'required|excluded:0' : ''}`" 
                        immediate v-slot="{ errors }">                    
                        <m-kv-select 
                            v-model="cFRMKvId" 
                            :kv-key="'t_project_product_process-print-sr'"/>
                        <span class="validation-error">{{ errors[0] }}</span>                            
                    </validation-provider>

                </div>
            </div>            
        </div>

        <div class="row">            
            <div class="pl-3 flex-grow-0 flex-shrink-0 form-group text-center" style="flex-basis:70px;">
                <label for="PrintIsSpecifiedColor">色指定</label>
                <ns-checkbox-input
                    v-model="dValue.IsSpecifiedColor"
                    :id="'PrintIsSpecifiedColor'"
                    />                                
            </div>
            <div class="pr-3 flex-grow-1 flex-shrink-1 form-group" v-show="dValue.IsSpecifiedColor" >
                <div class="form-group">
                    <label >色指定内容</label>
                    <input v-model="dValue.SpecifiedColorMemo" 
                        type="text" class="form-control" />                                
                </div>
            </div>
        </div>
        

        <div class="row">
            
            <div class="pl-3 flex-grow-0 flex-shrink-0 form-group text-center" style="flex-basis:70px;">
                <label for="PrintIsInputDetail">詳細</label>
                <ns-checkbox-input
                    v-model="cIsInputDetail"
                    :id="'PrintIsInputDetail'"
                    />                                
            </div>
            
            <div class="col-12 col-xl-2 pl-3 pl-xl-0 " v-show="cIsInputDetail">

                <div class="form-group text-center">
                    <label >モード㎡数/時</label>        
                    <div class="mt-1 ">
                        {{dValue.MProductionModeSpeedPerHour01}} ㎡
                    </div>
                </div>
            </div>
            <div class="col-12 col-xl-3 pl-3 pl-xl-0 " v-show="cIsInputDetail">

                <div class="form-group">
                    <label >㎡数/時</label>        
                    <validation-provider name="㎡数/時" 
                        vid="print-cInputSpeedPerHour"
                        :rules="`${m$cIsEnabled && cIsInputDetail ? 'required|min_value:1' : ''}`" 
                        immediate v-slot="{ errors }">
                        <ns-number-input v-model="cInputSpeedPerHour" />
                        <span class="validation-error">{{ errors[0] }}</span>                            
                    </validation-provider>
                </div>
            </div>
            
            
            <div class="col-12 col-xl-3 pl-3 pl-xl-0 " v-show="cIsInputDetail">

                <div class="form-group">
                    <label >出力面積比率%(インク代)</label>        
                    <validation-provider name="出力面積比率%(インク代)" 
                        vid="print-cInputInkAreaPer"
                        :rules="`${m$cIsEnabled && cIsInputDetail ? 'required|min_value:1' : ''}`" 
                        immediate v-slot="{ errors }">
                        <ns-number-input v-model="cInputInkAreaPer" />
                        <span class="validation-error">{{ errors[0] }}</span>                            
                    </validation-provider>

                </div>
            </div>
            
        </div>
        <!-- <div class="row">            
            <label for="IsPassOverlapping" class="pl-3">PassOverlapping</label>
        </div>
        <div class="row">            
            <div class="pl-3 flex-grow-0 flex-shrink-0 text-center form-group" style="flex-basis:70px;">
                <ns-checkbox-input
                    v-model="cIsPassOverlapping"
                    :id="'IsPassOverlapping'"
                    />   
            </div>                             
            <div class="col-12 col-xl-4 pl-3 pl-xl-0" v-show="cIsPassOverlapping" >
                <div class="form-group">
                    <validation-provider name="PassOverlappingタイプ" 
                        vid="print-cPassOverlappingTypeMKvId"
                        :rules="`${m$cIsEnabled && cIsPassOverlapping ? 'required|excluded:0' : ''}`" 
                        immediate v-slot="{ errors }">                    
                        <m-kv-select 
                            v-model="cPassOverlappingTypeMKvId" 
                            :kv-key="'t_project_product_process-print-pass_overlapping'"/>
                        <span class="validation-error">{{ errors[0] }}</span>                            
                    </validation-provider>

                </div>
            </div>
        </div> -->
        <div class="row" v-show="cIsMcs">
            <div class="col-12 col-xl-4">
                <div class="form-group">
                    <label >MCSロットNo C</label>
                    <input type="text" class="form-control" v-model="cMcsLotNoC">
                </div>
            </div>
            <div class="col-12 col-xl-4 pl-xl-0 ">
                <div class="form-group">
                    <label >MCSロットNo M</label>
                    <input type="text" class="form-control" v-model="cMcsLotNoM">
                </div>
            </div>
            <div class="col-12 col-xl-4 pl-xl-0 ">
                <div class="form-group">
                    <label >MCSロットNo Y</label>
                    <input type="text" class="form-control" v-model="cMcsLotNoY">
                </div>
            </div>
            <div class="col-12 col-xl-4">
                <div class="form-group">
                    <label >MCSロットNo K</label>
                    <input type="text" class="form-control" v-model="cMcsLotNoK">
                </div>
            </div>
            <!-- Wは2本あるためスペースを広げる -->
            <div class="col-12 col-xl-8 pl-xl-0 ">
                <div class="form-group">
                    <label >MCSロットNo W</label>
                    <input type="text" class="form-control" v-model="cMcsLotNoW">
                </div>
            </div>
        

        </div>

        <div class="row" v-show="$$cIsDebug">
            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label >使用㎡数</label>
                    <div>{{cSqmIncDoubleFace.toFixed(2)}} ㎡</div>
                </div>

            </div>

            <div class="col-12 col-xl-2">                
                <div class="form-group">
                    <label>インクコスト</label>
                    <div>{{cInkCost.toFixed(2)}} 円/㎡</div>
                </div>

            </div>

        </div>

        <!-- 生産性（予測時間) -->
        <tProductProcessCPredicted
            v-show="$$cIsDebug"
            v-model="dValue" />
        

        <!-- 備考 -->
        <tProductProcessMemo
            v-model="dValue" />



    </div>

</template>


<script lang="ts">

import _ from 'lodash';
import TProductProcessMixins from "./../../../../mixins/tProject/TProductProcessMixins" ;
import { TProjectProductProcessPrint } from '../../class/models/tsMixins/process/TProjectProductProcessPrint';
import ProcessDynamicGetSetComputedMixins from '../../../../mixins/tProject/ProcessDynamicGetSetComputedMixins';

export default {
    mixins : [TProductProcessMixins ,ProcessDynamicGetSetComputedMixins] , 
    data : function() {
        return {
            dValue : {} , 

             
            dComputedGetSetDefs : [
                // 正転・反転
                { key:'cFRMKvId' ,propName:TProjectProductProcessPrint.FRMKvId_PName } ,
                // 両面印刷
                { key:'cIsDoubleFace' ,propName:TProjectProductProcessPrint.IsDoubleFace_PName} ,
                // 手入力フラグ
                { key:'cIsInputDetail' ,propName:TProjectProductProcessPrint.IsInputDetail_PName} ,
                // 手入力速度
                { key:'cInputSpeedPerHour' ,propName:TProjectProductProcessPrint.InputSpeedPerHour_PName} ,
                // 手入力インク面積比率
                { key:'cInputInkAreaPer' ,propName:TProjectProductProcessPrint.InputInkAreaPer_PName} ,

                // MCSインクロットNo C
                { key:'cMcsLotNoC' ,propName:"McsLotNoC"} ,
                // MCSインクロットNo M
                { key:'cMcsLotNoM' ,propName:"McsLotNoM"} ,
                // MCSインクロットNo Y
                { key:'cMcsLotNoY' ,propName:"McsLotNoY"} ,
                // MCSインクロットNo K
                { key:'cMcsLotNoK' ,propName:"McsLotNoK"} ,
                // MCSインクロットNo W
                { key:'cMcsLotNoW' ,propName:"McsLotNoW"} ,

                // パスオーバーラッピング
                // { key:'cIsPassOverlapping' ,propName:"IsPassOverlapping"} ,
                // { key:'cPassOverlappingTypeMKvId' ,propName:"PassOverlappingTypeMKvId"} ,
            ] , 

            dComputedGetDefs : [          
                // TProject
                { key:'cTProduct' ,propName:"_t_project_product" } ,
                // 両面込の合計Sqm
                { key:'cSqmIncDoubleFace' ,propName:TProjectProductProcessPrint.SqmIncDoubleFace_PName } ,
                // 透明メディア判定
                { key:'cIsTransparentMedia' ,propName:"IsTransparentMedia" } ,
                // インクコスト
                { key:'cInkCost' ,propName:TProjectProductProcessPrint.InkCost_PName} ,
                // 加工m数
                { key:'cProcessMater' ,propName:"TotalProcesMater"} ,

                // MCS判定
                { key:'cIsMcs' ,propName:"IsMcs" } ,
                
            ]


        }         
    } ,
    computed : {} ,
    methods : {} ,
    created : function() {} , 
    
} 
</script>