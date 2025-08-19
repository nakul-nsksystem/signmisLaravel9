<template>
    <div>
        
        <div class="alert alert-success" v-show="cIsAvailableMaterial">
            <p class="font-weight-bold" >材料費明細 &nbsp;
                <span class="text-info">数量:{{cQty}}</span>                
            </p>
            <table class="table text-right" >
                <thead>
                    <tr>                        
                        <th>名称</th>
                        <th>取得値</th>
                        <th>係数</th>
                        <th>加算値</th>
                        <th>有効係数</th>
                        <th>合計係数</th> 
                        <th>単価タイプ</th>      
                        <th>単価</th>                    
                        <th>コスト</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="n in cMaterials" :key="n.id">
                        <td>{{n.name}}</td>
                        <td>{{n.rate_value}}</td>
                        <td>{{dValue.getMaterialRate(n).toFixed(2)}}</td>
                        <td>{{n.additional_value}}</td>
                        <td>{{(dValue.getMaterialRate(n) + dValue.getClValue(n.additional_value)).toFixed(2) }}&nbsp;{{n.unit_name}}</td>
                        <td>{{dValue.getTotalMaterialRate(n).toFixed(0)}}&nbsp;{{n.unit_name}}</td>
                        <td>{{n.price_type == 2 ? "マトリクス" : "カラム"  }}</td>
                        <td>{{dValue.getMaterialUnitCost(n).toLocaleString()}}</td>
                        <td>{{dValue.getMaterialCost(n).toLocaleString()}}</td>
                        
                    </tr>
                    
                    <tr class="font-weight-bold">
                        <td>合計</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>{{cTotalMaterialCost.toLocaleString()}}</td>
                        
                    </tr>
                </tbody>

            </table>
        </div>

        <div class="alert alert-warning" v-show="cIsAvailableOutsource">
            <p class="font-weight-bold" >外注費明細 &nbsp;
                <span class="text-info">数量:{{cQty}}</span>                
            </p>
            <table class="table text-right" >
                <thead>
                    <tr>                        
                        <th>名称</th>
                        <th>取得値</th>
                        <th>係数</th>
                        <th>加算値</th>
                        <th>有効係数</th>
                        <th>合計係数</th>   
                        <th>単価タイプ</th>    
                        <th>単価</th>                    
                        <th>コスト</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="n in cOutsources" :key="n.id">
                        <td>{{n.name}}</td>
                        <td>{{n.rate_value}}</td>
                        <td>{{dValue.getOutsourceRate(n).toFixed(2)}}</td>
                        <td>{{n.additional_value}}</td>
                        <td>{{(dValue.getOutsourceRate(n) + dValue.getClValue(n.additional_value)).toFixed(2) }}&nbsp;{{n.unit_name}}</td>                        
                        <td>{{dValue.getTotalOutsourceRate(n).toFixed(0)}}&nbsp;{{n.unit_name}}</td>
                        <td>{{n.is_price_ref_from_m_production ? "MProduction" : n.price_column == null ? "Input" : n.price_column }}</td>
                        <td>{{dValue.getOutsourceUnitCost(n).toLocaleString()}}</td>
                        <td>{{dValue.getOutsourceCost(n).toLocaleString()}}</td>
                        
                    </tr>
                    
                    <tr class="font-weight-bold">
                        <td>合計</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>{{cTotalOutsourceCost.toLocaleString()}}</td>
                        
                    </tr>
                </tbody>

            </table>
        </div>
        


        <div class="alert alert-primary" v-show="cIsAvailableWork">


            <p class="font-weight-bold" >計算値 Step 1 - 生産先準備/ジョブ  </p>
            <table class="table text-right" v-show="cIsAvailablePreparePerJob">
                <thead>
                    <tr>                        
                        <th>基準値</th>
                        <th>難易度</th>
                        <th>実基準値</th>
                        <th>係数</th>
                        <th>秒数</th>                    
                        <th>時間</th>                    
                        <th>コスト/h</th>                    
                        <th>コスト</th>
                    </tr>
                </thead>
                <tbody>

                    <template v-for="n in cProcesses" >
                        
                        <tr :key="n.id + 100000" v-show="n.is_use_prepare_per_job">
                            <td class="text-left font-weight-bold" colspan="8">
                                {{n.name}} 
                                - <span class="text-danger">{{n.prepare_per_job_memo}}</span>
                                - <span class="text-info">@{{dValue.getSelectedMProductionName(n.prepare_per_job_target_m_production_no)}}</span>
                                - <span class="text-success">{{n.prepare_per_job_rate_value}}</span>

                            </td>

                        </tr>                        
                        
                        <!-- 準備/ジョブ -->
                        <tr :key="n.id + 200000" v-show="n.is_use_prepare_per_job">
                            <td>{{dValue.getPreparePerJobBaseValue(n)}}</td>                            
                            <td>{{dValue.getLevelOfDifficulty(n.prepare_per_job_speed_difficulty_column)}}</td>    
                            <td>{{dValue.getPreparePerJobBaseRealValue(n).toLocaleString() }}&nbsp;秒/{{n.prepare_per_job_speed_ref_unit_name}}</td>
                            <td>{{! n.is_use_prepare_per_job ? 0 : dValue.getRateValue(n.prepare_per_job_rate_type_m_kv_id ,n.prepare_per_job_rate_value  ,"prep_per_job").toFixed(2)}}</td>
                            <td>{{dValue.getPreparePerJobSec(n)}}</td>
                            <td>{{dValue.getPreparePerJobHour(n).toFixed(4)}} h</td>
                            <td>{{!n.prepare_per_job_price_column ?
                                dValue.getSelectedMProductionCostPerHour(n.prepare_per_job_target_m_production_no).toLocaleString() :
                                dValue.getClValue(n.prepare_per_job_price_column).toLocaleString()
                                }}</td>
                            <td>{{dValue.getPreparePerJobCost(n).toLocaleString()}}</td>
                        </tr>
                    </template>
                </tbody>
            </table>




            <span class="font-weight-bold">計算値 Step 2 - 準備・稼働/枚&nbsp;
                <span class="text-info">数量:{{cQty}}</span>
            </span>
            <table class="table text-right">
                <thead>
                    <tr>
                        <th>&nbsp;</th>
                        <th>基準値</th>
                        <th>難度</th>
                        <th>実基準値</th>
                        <th>係数</th>
                        <th>秒</th>
                        <th>時</th>
                        <th>合係数</th>
                        <th>合時間</th>
                        <th>ｺｽﾄ/h</th>
                        <th>コスト</th>
                    </tr>
                </thead>
                <tbody>

                    <!-- <template v-for="n in dValue.m_process_category.m_processes" > -->
                    <template v-for="n in cProcesses" >
                        <tr :key="n.id + 300000">
                            <td class="text-left font-weight-bold" colspan="10">
                                {{n.name}} 
                                <span v-show="n.is_use_prepare_per_qty"
                                    class="text-danger">
                                    &nbsp;準備[
                                      {{n.prepare_per_qty_memo}} 
                                      - @{{dValue.getSelectedMProductionName(n.prepare_per_qty_target_m_production_no)}}
                                      - {{n.prepare_per_qty_rate_value}}                                    
                                    ]
                                </span>
                                <span v-show="n.is_use_operation"
                                    class="text-success">
                                    &nbsp;オペ[
                                        {{n.operation_memo}}
                                        - @{{dValue.getSelectedMProductionName(n.operation_target_m_production_no)}}
                                        - {{n.operation_rate_value}}                       
                                    ]
                                </span>
                            </td>

                        </tr>                        
                        



                        <!-- 準備/枚 -->
                        <tr v-show="n.is_use_prepare_per_qty" :key="n.id + 400000">
                            <td>&nbsp;準備</td>
                            <td>{{dValue.getPreparePerQtyBaseValue(n)}}</td>
                            <td>{{dValue.getLevelOfDifficulty(n.prepare_per_qty_speed_difficulty_column)}}</td>    
                            <td>{{dValue.getPreparePerQtyBaseRealValue(n).toLocaleString() }}&nbsp;秒/枚</td>                                                            
                            <td>{{! n.is_use_prepare_per_qty ? 0 : dValue.getRateValue(n.prepare_per_qty_rate_type_m_kv_id ,n.prepare_per_qty_rate_value ,"prep_per_qty" ).toFixed(2)}}</td>                            
                            <td>{{dValue.getPreparePerQtySec(n).toFixed(1)}}</td>
                            <td>{{(dValue.getPreparePerQtySec(n) / 3600).toFixed(4)}}</td>
                            <td>{{! n.is_use_prepare_per_qty ? 0 : Math.round(dValue.getRateValue(n.prepare_per_qty_rate_type_m_kv_id ,n.prepare_per_qty_rate_value ) * cQty).toLocaleString()}}</td>
                            <td>{{dValue.getPreparePetQtyTotalHour(n).toFixed(2)}} h</td>
                            <td>{{Math.round(dValue.getSelectedMProductionCostPerHour(n.prepare_per_qty_target_m_production_no)).toLocaleString()}}</td>
                            <td>{{dValue.getPreparePetQtyTotalCost(n).toLocaleString()}}</td>

                        </tr>
                        
                        <!-- 稼働/枚 -->
                        <tr v-show="n.is_use_operation" :key="n.id + 500000">
                            <td>&nbsp;オペ</td>
                            <td>{{dValue.getOperationBaseValue(n).toLocaleString()}}</td>
                            <td>{{dValue.getLevelOfDifficulty(n.operation_speed_difficulty_column)}}</td>    
                            <td>{{dValue.getOperationBaseRealValue(n).toLocaleString() }}&nbsp;{{dValue.getOperationBaseUnit(n)}}</td>    
                            <td>{{! n.is_use_operation ? 0 : dValue.getRateValue(n.operation_rate_type_m_kv_id ,n.operation_rate_value ,"operation").toFixed(2)}}</td>
                            <td>{{(dValue.getOperationHour(n) * 3600).toFixed(1)}}</td>
                            <td>{{dValue.getOperationHour(n).toFixed(4)}}</td>
                            <td>{{! n.is_use_operation ? 0 : Math.round(dValue.getRateValue(n.operation_rate_type_m_kv_id ,n.operation_rate_value ) * cQty).toLocaleString()}}</td>
                            <td>{{dValue.getOperationTotalHour(n).toFixed(2)}} h</td>
                            <td>{{Math.round(dValue.getSelectedMProductionCostPerHour(n.operation_target_m_production_no)).toLocaleString()}}</td>
                            <td>{{dValue.getOperationTotalCost(n).toLocaleString()}}</td>
                        </tr>
                        
                    </template>
                </tbody>
            </table>




            <span class="font-weight-bold">計算値 Step 3 - 集計</span>
            <table class="table text-right">
                <thead>
                    <tr>
                        <th>&nbsp;</th>
                        <th>秒数</th>
                        <th>時間</th>
                        <th>数量</th>
                        <th>合計</th>
                        <th>合計コスト</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- 工程 -->
                    <tr v-show="cIsAvailablePreparePerJob">
                        <td>ジョブあたり</td>
                        <td>{{cTotalSecPerJob}} 秒</td>
                        <td>{{(cTotalSecPerJob / 3600).toFixed(2)}} 時間</td>
                        <td>1</td>
                        <td>{{(cTotalSecPerJob / 3600).toFixed(2)}} 時間</td>
                        <td>{{cTotalCostPerJob.toLocaleString()}}</td>
                    </tr>

                    <tr>
                        <td>枚あたり</td>
                        <td>{{cTotalSecPerQty.toFixed(1)}} 秒/枚</td>
                        <td>{{(cTotalSecPerQty / 3600).toFixed(4)}} 時間/枚</td>
                        <td>{{cQty}}</td>
                        <td>{{(cTotalSecPerQty  / 3600 * cQty).toFixed(2)}} 時間</td>
                        <td>{{cTotalCostPerQty.toLocaleString()}}</td>
                    </tr>                            

                    <tr class="font-weight-bold">
                        <td>合計</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>{{cTotalWorkHour.toFixed(2)}} 時間</td>
                        <td>{{cTotalWorkCost.toLocaleString()}}</td>
                    </tr>                            
                                        
                </tbody>
            </table>
            
            
        </div>        
    </div>
</template>

<script>
import TProductProcessMixins from "./../../../../../mixins/tProject/TProductProcessMixins" ;
import { TProjectProductProcess } from '../../../class/models/TProjectProductProcess';
import ProcessDynamicGetSetComputedMixins from '../../../../../mixins/tProject/ProcessDynamicGetSetComputedMixins';

export default {
    mixins : [TProductProcessMixins ,ProcessDynamicGetSetComputedMixins] ,     
    data : function() {
        return {
            dValue : this.value , 
            
            dComputedGetSetDefs : [] , 

            dComputedGetDefs : [          
                // 数量
                { key:'cQty' ,propName:"Bridge_Qty" } ,
                // 有効な材料リスト
                { key:'cMaterials' ,propName:"EnabledMaterials" } ,
                // 材料代を使うか
                { key:'cIsAvailableMaterial' ,propName:"IsAvailableMaterial" } ,
                // 総材料費
                { key:'cTotalMaterialCost' ,propName:"TotalMaterialCost" } ,

                // 有効な外注のリスト
                { key:'cOutsources' ,propName:"EnabledOutsources" } ,
                // 外注を使うか
                { key:'cIsAvailableOutsource' ,propName:"IsAvailableOutsource" } ,
                // 総外注費
                { key:'cTotalOutsourceCost' ,propName:"TotalOutsourceCost" } ,

                // 有効な工程のリスト
                { key:'cProcesses' ,propName:"EnabledProcesses" } ,
                // 作業費を使うか
                { key:'cIsAvailableWork' ,propName:"IsAvailableWork" } ,
                // 準備/ジョブを使うか
                { key:'cIsAvailablePreparePerJob' ,propName:"IsAvailablePreparePerJob" } ,
                // 準備/ジョブ 総秒数
                { key:'cTotalSecPerJob' ,propName:"TotalSecPerJob" } ,
                // 準備/ジョブ 総コスト
                { key:'cTotalCostPerJob' ,propName:"TotalCostPerJob" } ,

                // per枚 総秒数
                { key:'cTotalSecPerQty' ,propName:"TotalSecPerQty" } ,
                // per枚 総コスト
                { key:'cTotalCostPerQty' ,propName:"TotalCostPerQty" } ,

                // 総作業時間
                { key:'cTotalWorkHour' ,propName:"TotalWorkHour" } ,
                // 総作業コスト
                { key:'cTotalWorkCost' ,propName:"TotalWorkCost" } ,
                
                
                
            ] , 
        }
    } ,  
    props : {
        value : {
            type : TProjectProductProcess 
        } , 
    } ,
    computed : {}   ,
    methods : {}
} 
</script>