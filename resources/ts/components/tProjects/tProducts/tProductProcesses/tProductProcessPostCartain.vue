<template>
    <div class="card-body app-card-body">
        <!-- {{cPipeCrashLength4Update}} -->
        <div v-show="$$cIsDebug">
            {{m$cDisplay}}
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
            :production-label="'作業'"
            :m-product-category-id="tProduct.m_product_category_id"
            :m-process-category-id="dValue.m_process_category_id"
            :mode-m-process-category-id="dValue.m_process_category_id"
            :m-process-category-m-production-no="1"
        />
        <tProductProcessCMProduction
            v-model="dValue"
            :production-label="'ウェルダー'"
            :m-product-category-id="tProduct.m_product_category_id"
            :m-process-category-id="dValue.m_process_category_id"
            :mode-m-process-category-id="dValue.m_process_category_id"
            :m-process-category-m-production-no="2"
        />
        <tProductProcessCMProduction
            v-model="dValue"
            :production-label="'ハトメ'"
            :m-product-category-id="tProduct.m_product_category_id"
            :m-process-category-id="dValue.m_process_category_id"
            :mode-m-process-category-id="dValue.m_process_category_id"
            :m-process-category-m-production-no="3"
        />
        <tProductProcessCMProduction
            v-model="dValue"
            :production-label="'ミシン'"
            :m-product-category-id="tProduct.m_product_category_id"
            :m-process-category-id="dValue.m_process_category_id"
            :mode-m-process-category-id="dValue.m_process_category_id"
            :m-process-category-m-production-no="4"
        />
        
        <div class="row">
            <div class="col-12">
                <validation-provider name="いずれかの辺"
                    vid="postCartainCIsAnySideSelected" 
                    :rules="`${m$cIsEnabled ? 'custom_rule_is' : ''}`" 
                    immediate v-slot="{ errors }">
                    <input class="d-none" v-model="cIsAnySideSelected" /> 
                    <span class="validation-error mb-2">{{ errors[0] }}</span>
                </validation-provider>
            </div>
            

            <div class="col-12 col-xlg-6">
                <div class="form-group">
                    <div class="d-inline-block" style="width:60px;">
                        <label  >同仕様 </label>
                    </div>
                    
                    <div class="d-inline-block pl-4">
                        <ns-checkbox-input
                            v-model="cIsAll"
                            :id="'isEnablePostPartSameSpecAll'"
                            :label="'四方'"
                            />                            
                    </div>
                    <div v-if="! cIsHide('tb')" class="d-inline-block pl-2">
                        <ns-checkbox-input
                            v-model="cIsTb"
                            :id="'isEnablePostPartSameSpecTb'"
                            :label="'上下'"
                            />
                    </div>
                    <div v-if="! cIsHide('lr')" class="d-inline-block pl-2"  >
                        <ns-checkbox-input
                            v-model="cIsLr"
                            :id="'isEnablePostPartSameSpecLr'"
                            :label="'左右'"
                            />                        
                    </div>                    
                </div>
            </div>
            
            <div class="col-12 col-xlg-6">
                <div class="form-group">
                    <div class="d-inline-block" style="width:60px;">
                        <label >仕上箇所</label>
                    </div>
                    <div v-if="! cIsHide('t')" class="d-inline-block pl-4">
                        <ns-checkbox-input
                            v-model="cIsT"
                            :id="'isEnablePostPartT'"
                            :label="'上'"
                            />
                    </div>
                    <div v-if="! cIsHide('b')" class="d-inline-block pl-2">
                        <ns-checkbox-input
                            v-model="cIsB"
                            :id="'isEnablePostPartB'"
                            :label="'下'"
                            />
                    </div>
                    <div v-if="! cIsHide('l')" class="d-inline-block pl-2" >
                        <ns-checkbox-input
                            v-model="cIsL"
                            :id="'isEnablePostPartL'"
                            :label="'左'"
                            />
                    </div>
                    <div v-if="! cIsHide('r')" class="d-inline-block pl-2">
                        <ns-checkbox-input
                            v-model="cIsR"
                            :id="'isEnablePostPartR'"
                            :label="'右'"
                            />

                    </div>
                    
                </div>                                
            </div>

        </div>

        <div v-for="n in cSides" :key="n.name" >
            <div v-show="n.isShow" class="mb-3">
                <t-product-process-post-cartain-child                
                    v-model="dValue"
                    :name="n.name"
                    :pt="n.pt"
                    :grommet-margin="cGrommetMargin"
                    :is-selecteds="cIsSelecteds"
                    :columns="dColumns"                    
                    >
                </t-product-process-post-cartain-child>
    
            </div>

        </div>

        
        <div class="row" v-show="$$cIsDebug">
            <div class="col-12 col-xl-2">                
                <div class="form-group">
                    <label>使用綿テープ長さ</label>
                    <div>{{cTotalCottonTapeLength.toLocaleString()}} m</div>
                </div>

            </div>
            <div class="col-12 col-xl-2">                
                <div class="form-group">
                    <label>ロープだし長さ</label>
                    <div>{{cTotalRopeLength.toLocaleString()}} m</div>
                </div>
            </div>

            <div class="col-12 col-xl-2">                
                <div class="form-group">
                    <label>ロープカット作業</label>
                    <div>{{cIsRopeCut}} {{cNumOfRopeCut}}カット/枚</div>
                </div>
            </div>

            

        </div>

        <!-- 生産性/コスト -->
        <tProductProcessCPredicted
            v-show="$$cIsDebug"
            v-model="dValue" />

        <div class="row pt-3">
            <div class="col-12">
                <h4>オプション</h4>
            </div>
        </div>

        
        <div class="row">
            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label >ハトメ補強箇所数</label>
                    <ns-number-input v-model="cNumOfStrongGrommets" />
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12 col-xl-4">
                <div class="form-group">
                    <label >取付用ロープ</label>
                    <m-material-select                        
                        v-model="cRope4ropeOutMMaterialId"
                        :selected-item.sync="cRope4ropeOutMaterial"
                        :m-branch-id="m$cMBranchId"
                        :sub-category-m-kv-id="cSubCatRope4RopeOutMKvId"
                        :isDisplayName="true"              
                        >
                        </m-material-select>     
                </div>
            </div>

            
            <div class="col-12 col-xl-2 pl-2 pl-xl-0">
                <validation-provider name="総mm数/枚"
                    vid="postCartain-cRope4ropeOutLength"
                    :rules="`${m$cIsEnabled && cRope4ropeOutMMaterialId > 0 ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label >総mm数/枚</label>
                        <ns-number-input v-model="cRope4ropeOutLength" />
                        <span class="validation-error mb-2">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>
            
            <div class="col-12 col-xl-2 pl-2 pl-xl-0">
                <validation-provider name="本数/枚"
                    vid="postCartain-cNumOfRopes4rope"
                    :rules="`${m$cIsEnabled && cRope4ropeOutMMaterialId > 0 ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label >本数/枚</label>
                        <ns-number-input v-model="cNumOfRopes4rope" />
                        <span class="validation-error mb-2">{{ errors[0] }}</span>
                    </div>
                </validation-provider>

            </div>

            <div class="col-12 col-xl-2" v-show="$$cIsDebug">
                <div class="form-group">
                    <label >コスト</label>
                    <div>{{cRope4ropeOutCost}} 円</div>
                </div>
            </div>

            
            <div class="col-12 col-xl-2" v-show="$$cIsDebug">
                <div class="form-group">
                    <label >m数</label>
                    <div>{{cRope4ropeOutMaterLength}} m</div>
                </div>
            </div>
            

        </div>

        
        <div class="row">
            <div class="col-12">
                <div class="form-group">
                    <label >取付用ロープ 内訳</label>                    
                    <input v-model.lazy="cRope4ropeMemo"
                        class="form-control" placeholder="">
                </div>
            </div>

            
            
        </div>


        

        
        <div class="row">
            <div class="col-12 col-xl-4">
                <validation-provider name="風抜きmm数/箇所"
                    vid="postCartain-cWindAvoidLength"
                    :rules="`${m$cIsEnabled && cNumOfWindAvoid > 0 ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label >風抜きmm数/箇所</label>
                        <ns-number-input v-model="cWindAvoidLength" />
                        <span class="validation-error mb-2">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>

            <div class="col-12 col-xl-2 pl-2 pl-xl-0">
                <validation-provider name="箇所数"
                    vid="postCartain-cNumOfWindAvoid"
                    :rules="`${m$cIsEnabled && cWindAvoidLength > 0 ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label >箇所数</label>
                        <ns-number-input v-model="cNumOfWindAvoid" />
                        <span class="validation-error mb-2">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>           
            
            <div class="col-12 col-xl-2 pl-2 pl-xl-0" v-show="$$cIsDebug">
                <div class="form-group">
                    <label >有無</label>
                    <div>{{cIsWindAvoid}} m</div>                    
                </div>
            </div>

            <div class="col-12 col-xl-2 pl-2 pl-xl-0" v-show="$$cIsDebug">
                <div class="form-group">
                    <label >延長</label>
                    <div>{{cWindAvoidTotalMaterLength}} m/枚</div>                    
                </div>
            </div>


            <div class="col-12 col-xl-2 pl-2 pl-xl-0" v-show="$$cIsDebug">
                <div class="form-group">
                    <label >総m数/枚</label>
                    <div>{{cWindAvoidTotalMaterLength}} m/枚</div>                    
                </div>
            </div>


        </div>

        
        
        <div class="row">


            <div class="col-12 col-xl-4">

                <div class="form-group">
                    <label >あおり止め</label>                    
                    <m-kv-select
                        v-model="cStopTiltingWayMKvId"
                        :kv-key="'t_project_product_process-post-cartain-stop-tilting-way'">
                    </m-kv-select>     
                </div>
            </div>


            <div class="col-12 col-xl-3 pl-2 pl-xl-0">
                <validation-provider name="長さ(mm/箇所)"
                    vid="postCartain-cStopTiltingLength"
                    :rules="`${m$cIsEnabled && cStopTiltingWayMKvId > 0 ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label >長さ(mm/箇所)</label>
                        <ns-number-input v-model="cStopTiltingLength" />
                        <span class="validation-error mb-2">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>

            <div class="col-12 col-xl-2 pl-2 pl-xl-0">
                <validation-provider name="箇所数"
                    vid="postCartain-cNumOfStopTilting"
                    :rules="`${m$cIsEnabled && cStopTiltingWayMKvId > 0 ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label >箇所数</label>
                        <ns-number-input v-model="cNumOfStopTilting" />
                        <span class="validation-error mb-2">{{ errors[0] }}</span>
                    </div>
                </validation-provider>

            </div>


            
        </div>

        <div class="row" v-show="$$cIsDebug">
            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label>あおり有無</label>
                    <div>{{cIsStopTilting}}</div>
                </div>
            </div>
            <div class="col-12 col-xl-2 pl-2 pl-xl-0">
                <div class="form-group">
                    <label>総長さ</label>
                    <div>{{cStopTiltingTotalMaterLength}}m</div>
                </div>
            </div>
            <div class="col-12 col-xl-2 pl-2 pl-xl-0">
                <div class="form-group">
                    <label>計算箇所数</label>
                    <div>{{cCalcedNumOfStopTilting}}箇所</div>
                </div>
            </div>
            
        </div>

        
        <div class="row">
            <div class="col-12 col-xl-6">
                <div class="form-group">
                    <label >パイプ</label>
                    
                    <m-material-select                        
                        v-model="cPipeMMatarialId"
                        :selected-item.sync="cPipeMMatarial"
                        :m-branch-id="m$cMBranchId"
                        :sub-category-m-kv-id="cSubCatPipeMKvId"
                        :isDisplayName="true"
                        />
                        
                </div>
            </div>


            <div class="col-12 col-xl-2 pl-3 pl-xl-0">
                <validation-provider name="必要長さ"
                    vid="postCartain-cPipeLength"
                    :rules="`${m$cIsEnabled && cPipeMMatarialId > 0 ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label>必要長さ(mm)</label>
                        <ns-number-input v-model="cPipeLength" />
                        <span class="validation-error mb-2">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>
            <div class="col-12 col-xl-2 pl-3 pl-xl-0">
                <validation-provider name="必要長さ"
                    vid="postCartain-cNumOfPipe"
                    :rules="`${m$cIsEnabled && cPipeMMatarialId > 0 ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label>本数</label>
                        <ns-number-input v-model="cNumOfPipe" />
                        <span class="validation-error mb-2">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>

            <div class="col-12 col-xl-2 pl-3 pl-xl-0">
                <validation-provider name="つぶし寸法"
                    vid="postCartain-cPipeCrashLength"
                    :rules="`${m$cIsEnabled && cPipeMMatarialId > 0 ? 'required|min_value:1' : ''}`" 
                    immediate v-slot="{ errors }">

                    <div class="form-group">
                        <label >つぶし寸法(mm)</label>
                        <ns-number-input v-model="cPipeCrashLength" step="0.01"  />
                        <span class="validation-error mb-2">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
            </div>

        </div>


        <div class="row" v-show="$$cIsDebug">
            
            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label>パイプ 有無</label>
                    <div>{{cIsPipe}}</div>
                </div>
            </div>
            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label>パイプ長直径</label>
                    <div>{{cPipeMaterialDiameter}}</div>
                </div>
            </div>
            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label>パイプ長/本</label>
                    <div>{{cPipeMaterialLength}}</div>
                </div>
            </div>
            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label>計算つぶし寸法</label>
                    <div>{{cCalcedPipeCrashLength}}</div>
                </div>
            </div>
            
            
        </div>

        <div class="row" v-show="$$cIsDebug">
            
            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label>必要本数/長さあたり</label>
                    <div>{{cNumOfPipeNeededPerLength}}</div>
                </div>
            </div>

            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label>総必要本数</label>
                    <div>{{cTotalNumOfPipe}}</div>
                </div>
            </div>

            <div class="col-12 col-xl-2 pl-3 pl-xl-0">
                <div class="form-group">
                    <label>端材長さ</label>
                    <div>{{cPipeWasteLength}} mm</div>
                </div>
            </div>

            <div class="col-12 col-xl-2 pl-3 pl-xl-0">
                <div class="form-group">
                    <label>端材割合</label>
                    <div>{{cPipeWasteLengthPer.toFixed(4)}} /本</div>
                </div>
            </div>

            <div class="col-12 col-xl-2 pl-3 pl-xl-0">
                <div class="form-group">
                    <label>端材判定ボーダー</label>
                    <div>{{cPipeWasteTargetPer}} /本   以上</div>
                </div>
            </div>

            <div class="col-12 col-xl-2 pl-3 pl-xl-0">
                <div class="form-group">
                    <label>端材判定</label>
                    <div>{{cIsPipeWasteTarget}} </div>
                </div>
            </div>

            
        </div>


        <div class="row" v-show="$$cIsDebug">

            
            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label>コスト/本</label>
                    <div>{{cPipeCost}}</div>
                </div>
            </div>
            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label>コスト/m</label>
                    <div>{{cPipeCostPerMater}}</div>
                </div>
            </div>
            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label>端材コスト/m</label>
                    <div>{{cPipeWasteCostPerMater}}</div>
                </div>
            </div>

            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label>総使用扱い長</label>
                    <div>{{cPipeTotalMaterLength}} m</div>
                </div>
            </div>
            
            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label>総端材扱い長</label>
                    <div>{{cPipeTotalWasteMaterLength}} m</div>
                </div>
            </div>
            
            

        </div>
            
        <div class="row" v-show="$$cIsDebug">
            <div class="col-12 col-xl-3">
                <div class="form-group">
                    <label>ジョイント回数/本あたり</label>
                    <div>{{cNumOfPipeJoint}}</div>
                </div>
            </div>
            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label>総ジョイント回数</label>
                    <div>{{cPipeTotalNumOfJoint}}</div>
                </div>
            </div>


        </div>


        <div class="row" v-show="$$cIsDebug">            
            <div class="col-12 col-xl-3">
                <div class="form-group">
                    <label>カット回数/本あたり</label>
                    <div>{{cPipeNumOfCut}}</div>
                </div>
            </div>
            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label>総カット回数</label>
                    <div>{{cPipeTotalNumOfCut}}</div>
                </div>
            </div>
            
        </div>

        <div class="row" v-show="$$cIsDebug">            
            <div class="col-12 col-xl-3">
                <div class="form-group">
                    <label>総ころしウェルダー加工 mm数</label>
                    <div>{{cTotalLengthOfWelderForSide}}mm</div>
                </div>
            </div>
            
        </div>

        

        
        <!-- 備考 -->
        <tProductProcessMemo
            v-model="dValue" />


        
    </div>
    
</template>


<script>

import TProductProcessMixins from "./../../../../mixins/tProject/TProductProcessMixins" ;

import  { PostCartainEdgeColumnDefs, PostCartainEdges} from "./consts/PostCartainDefs" ; 
import _ from "lodash" ; 
import ProcessDynamicGetSetComputedMixins from '../../../../mixins/tProject/ProcessDynamicGetSetComputedMixins';

export default {  
    mixins : [TProductProcessMixins , ProcessDynamicGetSetComputedMixins] ,     
    data : function() {
        return {
            dValue : {} , 

            dComputedGetSetDefs : [
                // 四方
                { key:'cIsAll' ,propName:"IsAll" } ,
                // 上下
                { key:'cIsTb' ,propName:"IsTb" } ,
                // 左右
                { key:'cIsLr' ,propName:"IsLr" } ,
                // 上
                { key:'cIsT' ,propName:"IsT" } ,
                // 下
                { key:'cIsB' ,propName:"IsB" } ,
                // 左
                { key:'cIsL' ,propName:"IsL" } ,
                // 右
                { key:'cIsR' ,propName:"IsR" } ,

                // ハトメ補強箇所数
                { key:'cNumOfStrongGrommets' ,propName:"NumOfStrongGrommets" } ,

                // 取り付け用ロープ　資材
                { key:'cRope4ropeOutMaterial' ,propName:"Rope4ropeOutMaterial" } ,
                // 取り付け用ロープ　資材ID
                { key:'cRope4ropeOutMMaterialId' ,propName:"Rope4ropeOutMMaterialId" } ,
                // 取り付け用ロープ　本数/枚
                { key:'cNumOfRopes4rope' ,propName:"NumOfRopes4rope" } ,
                // 取り付け用ロープ　長さ
                { key:'cRope4ropeOutLength' ,propName:"Rope4ropeOutLength" } ,
                // 取り付け用ロープ　長さ　メモ
                { key:'cRope4ropeMemo' ,propName:"Rope4ropeMemo" } ,

                // 風抜き箇所数
                { key:'cNumOfWindAvoid' ,propName:"NumOfWindAvoid" } ,
                // 風抜きmm数/箇所
                { key:'cWindAvoidLength' ,propName:"WindAvoidLength" } ,

                // あおり止め方法
                { key:'cStopTiltingWayMKvId' ,propName:"StopTiltingWayMKvId" } ,
                // あおり止め長さ/箇所
                { key:'cStopTiltingLength' ,propName:"StopTiltingLength" } ,
                // あおり止め箇所数
                { key:'cNumOfStopTilting' ,propName:"NumOfStopTilting" } ,

                // パイプ　資材ID
                { key:'cPipeMMatarialId' ,propName:"PipeMMatarialId" } ,
                // パイプ　資材
                { key:'cPipeMMatarial' ,propName:"PipeMMatarial" } ,
                // パイプ　長さ
                { key:'cPipeLength' ,propName:"PipeLength" } ,
                // パイプ　本数
                { key:'cNumOfPipe' ,propName:"NumOfPipe" } ,
                // パイプ　潰し寸法
                { key:'cPipeCrashLength' ,propName:"PipeCrashLength" } ,
                // パイプ　潰し寸法
                { key:'cPipeCrashLength' ,propName:"PipeCrashLength" } ,
                
                // 確認用
                { key:'cTypeMKvId_All' ,propName:"TypeMKvId_All" } ,
                

            ] , 

            dComputedGetDefs : [          
                // TProject
                { key:'cTProduct' ,propName:"_t_project_product" } ,

                // 各辺の長さ
                { key:'cLengths' ,propName:"Lengths" } ,
                // 各辺の長さ
                { key:'cIsSelecteds' ,propName:"IsSelecteds" } ,

                // ハトメ マージン
                { key:'cGrommetMargin' ,propName:"GrommetMargin" } ,
                
                // ハトメ補強 有無
                { key:'cIsStrongGrommets' ,propName:"IsStrongGrommets" } ,
                // 綿テープの長さ
                { key:'cTotalCottonTapeLength' ,propName:"TotalCottonTapeLength" } ,

                // 取り付け用 ロープだしロープのサブカテゴリMkvId
                { key:'cSubCatRope4RopeOutMKvId' ,propName:"SubCatRope4RopeOutMKvId" } ,
                // 取り付け用ロープ 有無
                { key:'cIsRope4ropeOutpropName' ,propName:"IsRope4ropeOut" } ,
                // 取り付け用ロープ　資材名
                { key:'cRope4ropeOutMaterialName' ,propName:"Rope4ropeOutMaterialName" } ,
                // 取り付け用ロープ　単価
                { key:'cRope4ropeOutCost' ,propName:"Rope4ropeOutCost" } ,
                // 取り付け用ロープ　長さ メートル
                { key:'cRope4ropeOutMaterLength' ,propName:"Rope4ropeOutMaterLength" } ,
                // 取り付け用ロープ　ロープカット作業の回数
                { key:'cNumOfRopeCut' ,propName:"NumOfRopeCut" } ,
                // 取り付け用ロープ　ロープカット作業の有無
                { key:'cIsRopeCut' ,propName:"IsRopeCut" } ,

                // 取り付け用ロープ ロープ長さ
                { key:'cTotalRopeLength' ,propName:"TotalRopeLength" } ,
                // 総ころしウェルダー加工 mm数
                { key:'cTotalLengthOfWelderForSide' ,propName:"TotalLengthOfWelderForSide" } ,
                
                // 風抜き有無
                { key:'cIsWindAvoid' ,propName:"IsWindAvoid" } ,
                // 風抜き端延長mm
                { key:'cWindAvoidExtendLength' ,propName:"WindAvoidExtendLength" } ,
                // 風抜きm数/枚
                { key:'cWindAvoidTotalMaterLength' ,propName:"WindAvoidTotalMaterLength" } ,
                
                // あおり止め有無
                { key:'cIsStopTilting' ,propName:"IsStopTilting" } ,
                // あおり止め総長さ(メートル)
                { key:'cStopTiltingTotalMaterLength' ,propName:"StopTiltingTotalMaterLength" } ,
                // あおり止め計算箇所数
                { key:'cCalcedNumOfStopTilting' ,propName:"CalcedNumOfStopTilting" } ,

                // パイプのサブカテゴリMkvId
                { key:'cSubCatPipeMKvId' ,propName:"SubCatPipeMKvId" } ,
                // パイプ　有無
                { key:'cIsPipe' ,propName:"IsPipe" } ,
                // パイプ　名
                { key:'cPipeMaterialName' ,propName:"PipeMaterialName" } ,
                // パイプ　潰し寸法（計算値)
                { key:'cCalcedPipeCrashLength' ,propName:"CalcedPipeCrashLength" } ,
                // パイプ　潰し寸法の余白
                { key:'cPipeCrashSpace' ,propName:"PipeCrashSpace" } ,
                // パイプ　選択パイプの長さ
                { key:'cPipeMaterialLength' ,propName:"PipeMaterialLength" } ,
                // パイプ　選択パイプの直径
                { key:'cPipeMaterialDiameter' ,propName:"PipeMaterialDiameter" } ,
                // パイプ　選択パイプの単価
                { key:'cPipeCost' ,propName:"PipeCost" } ,
                // パイプ　選択パイプのメートル単価
                { key:'cPipeCostPerMater' ,propName:"PipeCostPerMater" } ,
                // パイプ　選択パイプの端材単価
                { key:'cPipeWasteCostPerMater' ,propName:"PipeWasteCostPerMater" } ,

                // パイプ　端材長さ
                { key:'cPipeWasteLength' ,propName:"PipeWasteLength" } ,
                // パイプ　端材長さ割合
                { key:'cPipeWasteLengthPer' ,propName:"PipeWasteLengthPer" } ,
                // パイプ　端材価格扱い判定ボーダー割合( xx % 以上余ってれば端材扱い )
                { key:'cPipeWasteTargetPer' ,propName:"PipeWasteTargetPer" } ,
                // パイプ　端材価格扱い判定結果
                { key:'cIsPipeWasteTarget' ,propName:"IsPipeWasteTarget" } ,
                // パイプ　必要本数/長さあたり
                { key:'cNumOfPipeNeededPerLength' ,propName:"NumOfPipeNeededPerLength" } ,
                // パイプ　パイプ　総必要本数
                { key:'cTotalNumOfPipe' ,propName:"TotalNumOfPipe" } ,
                // パイプ　総使用扱いm数
                { key:'cPipeTotalMaterLength' ,propName:"PipeTotalMaterLength" } ,
                // パイプ　総端材扱いm数
                { key:'cPipeTotalWasteMaterLength' ,propName:"PipeTotalWasteMaterLength" } ,
                // パイプ　ジョイント回数
                { key:'cNumOfPipeJoint' ,propName:"NumOfPipeJoint" } ,
                // パイプ　ジョイント総回数
                { key:'cPipeTotalNumOfJoint' ,propName:"PipeTotalNumOfJoint" } ,
                // パイプ　カット回数
                { key:'cPipeNumOfCut' ,propName:"PipeNumOfCut" } ,
                // パイプ　カット総回数
                { key:'cPipeTotalNumOfCut' ,propName:"PipeTotalNumOfCut" } ,


            ] ,

            // カラム設定 ( initColSetにて設定 )
            dColumns : {} , 



        }
    } ,
    
    computed : {
        
        // 各辺情報 
        cSides : function () {
            return [
                { name:"四方"  ,pt:PostCartainEdges.All  , isShow:this.cIsAll } ,
                { name:"上下"  ,pt:PostCartainEdges.Tb   , isShow:this.cIsTb  } ,
                { name:"左右"  ,pt:PostCartainEdges.Lr   , isShow:this.cIsLr  } ,
                { name:"上"    ,pt:PostCartainEdges.T    , isShow:this.cIsT   } ,
                { name:"下"    ,pt:PostCartainEdges.B    , isShow:this.cIsB   } ,
                { name:"左"    ,pt:PostCartainEdges.L    , isShow:this.cIsL   } ,
                { name:"右"    ,pt:PostCartainEdges.R    , isShow:this.cIsR   } ,
            ]

        } ,
        /**
         * いずれかの辺が選択されているかどうか
         */
        cIsAnySideSelected : function () {
            for (const [key, value] of Object.entries(this.cIsSelecteds)) {
                if ( value ) return true ; 
            }
            return false ; 
        }  ,
        

        
        /*****************************************
         * その他
         *****************************************/
                
        /**
         * 辺の表示制御
         */
        cIsHide : function() 
        {
            const _this = this ; 
            return function(pt)
            {
                if ( pt == "lr" || pt == "tb") return _this.cIsAll ; 
                if ( pt == "t" || pt == "b") return _this.cIsAll || _this.cIsTb ; 
                if ( pt == "l" || pt == "r") return _this.cIsAll || _this.cIsLr ; 

                return false ; 
            }
        } , 

    } ,
    methods : {} ,
    created : async function() 
    {
        this.dColumns = PostCartainEdgeColumnDefs ; 
    }
    
} 
</script> 