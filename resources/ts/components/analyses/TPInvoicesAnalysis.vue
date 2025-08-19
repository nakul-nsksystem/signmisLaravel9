<template>
    <div>
        <div class="row mb-2">
            <contents-header-left></contents-header-left>
            <contents-header-right>
                <div class="d-flex">
                    <div class="my-auto">
                        <ns-checkbox-input
                            v-model="state.isNotDisplayChart"
                            :id="'isNotDisplayChart'"
                            :label="'チャート非表示'"
                            />
                    </div>
                </div> 
            </contents-header-right>
        </div>
        <div class="app-contents-container ">        
            <div class="row ">
                <div class="col-12 col-xl-3 ">                    
                    <div class="form-group">
                        <label >仕入日</label>
                        <div class="d-flex flex-no-wrap">
                            <ex-v-date-picker 
                                readonly
                                aria-readonly="true"
                                v-model="conditions.purchase_date_from" />
                            <span class="px-2 pt-2">～</span>
                            <ex-v-date-picker 
                                readonly
                                aria-readonly="true"
                                v-model="conditions.purchase_date_to" />
                        </div>
                    </div>    
                </div>
                <div class="col-12 col-xl-2 pl-xl-0">
                    <div class="form-group">
                        <label>拠点</label>
                        <m-branch-select 
                            v-model="conditions.m_branch_id" 
                            />
                    </div>
                </div>
                
                <div class="col-12 col-xl-4 pl-xl-0">
                    <div class="form-group">
                        <label>仕入先</label>
                        <m-customer-ref-input
                            :m-branch-id="conditions.m_branch_id"
                            :dealingCds="[2]"
                            v-model="conditions.supplier_m_customer_id" 
                            />
                    </div>
                </div>
                
            </div>
            <div class="row">
                <div class="col-12 pl-0">
                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        詳細
                    </button>
                </div>
            </div>
            <div class="row mb-4"  id="accordion1">
                <div class="card-secondaly px-0 col-12">
                    <div id="collapseOne" class="collapse " aria-labelledby="headingOne" data-parent="#accordion1">
                        <div class="card-body bg-app-secondaly">
                            <div class="row">
                                <div class="col-12 col-xl-2">
                                    <div class="form-group">
                                        <label>仕入区分</label>
                                        <m-kv-select
                                            v-model="conditions.purchase_m_kv_id"
                                            :kv-key="'sales_management-purchase'"
                                            />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12 col-xl-7">
                                    <div class="form-group">
                                        <label>材料カテゴリ</label>
                                        <m-kv-multi-select
                                            v-model="conditions.category_m_kv_ids"
                                            :kv-key="'m_materials-category_m_kv_id'"
                                            />
                                    </div>
                                </div>
                                
                                <div class="col-12 col-xl-4">
                                    <div class="form-group">
                                        <label>材料</label>
                                        <m-material-ref-input
                                            v-model="conditions.m_material_id"
                                            :m-branch-id="conditions.m_branch_id"
                                            :category-m-kv-ids="conditions.category_m_kv_ids"
                                            :isDisplayName="true"    
                                            />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">

                <div class="col-12 col-xl-2">
                    <h6 class="text-primary">分析期間</h6>
                    <ymd-Select     
                        v-model="state.anaylyze.term"
                        />
                </div>
                <div class="col-12 col-xl-3">
                    <h6  class="text-warning">集計値</h6>                                            
                    <div 
                        class="btn-group btn-group-toggle"  >
                        <label class="btn btn-dark"
                            :class="{active : state.anaylyze.sum === 'price' }" 
                            data-toggle="tooltip" data-placement="top" title="金額" >
                            <input type="radio" v-model="state.anaylyze.sum" name="height-mode" value="price">
                            金額
                        </label>                        
                    </div>
                    <div 
                        class="btn-group btn-group-toggle"  >
                        <label class="btn btn-dark"
                            :class="{active : state.anaylyze.sum === 'count' }" 
                            data-toggle="tooltip" data-placement="top" title="数量" >
                            <input type="radio" v-model="state.anaylyze.sum" name="height-mode" value="count">
                            数量
                        </label>                        
                    </div> 
                    <div 
                        class="btn-group btn-group-toggle"  >
                        <label class="btn btn-dark"
                            :class="{active : state.anaylyze.sum === 'invoices_count' }" 
                            data-toggle="tooltip" data-placement="top" title="商品件数" >
                            <input type="radio" v-model="state.anaylyze.sum" name="height-mode" value="invoices_count">
                            件数
                        </label>                        
                    </div>
                </div>                
                <div class="col-12 col-xl-5">
                    <h6 class="text-success">分析軸</h6>
                    <div 
                        class="btn-group btn-group-toggle"  >
                        <label class="btn btn-dark"
                            :class="{active : state.anaylyze.axis === 'm_branch_name' }"
                            data-toggle="tooltip" data-placement="top" title="拠点" >
                            <input type="radio" v-model="state.anaylyze.axis" name="height-mode" value="m_branch_name"
                                >
                            拠点
                        </label> 
                        <label class="btn btn-dark"
                            :class="{active : state.anaylyze.axis === 'supplier_m_customer_name' }" 
                            data-toggle="tooltip" data-placement="top" title="仕入先" >
                            <input type="radio" v-model="state.anaylyze.axis" name="height-mode" value="supplier_m_customer_name">
                            仕入先
                        </label>
                        <label class="btn btn-dark"
                            :class="{active : state.anaylyze.axis === 'material_m_kv_name' }" 
                            data-toggle="tooltip" data-placement="top" title="材料カテゴリ" >
                            <input type="radio" v-model="state.anaylyze.axis" name="height-mode" value="material_m_kv_name">
                            材料カテゴリ
                        </label>
                        <label class="btn btn-dark"
                            :class="{active : state.anaylyze.axis === 'accounts_title_m_kv_name' }" 
                            data-toggle="tooltip" data-placement="top" title="勘定区分" >
                            <input type="radio" v-model="state.anaylyze.axis" name="height-mode" value="accounts_title_m_kv_name">
                            勘定区分
                        </label>
                    </div> 
                </div>
                
                <div class="col-12 col-xl-2 d-flex">
                    <div class="ml-auto">
                        <div class="form-group">
                            <label>&nbsp;</label>
                            <div >
                                <button type="button" :disabled="state.isLoading" class="btn btn-success" @click.prevent="search()">
                                    <div v-if="state.isLoading">
                                        <span class="spinner-border spinner-border-sm" role="status" />
                                        集計中...
                                    </div>
                                    <div v-else>
                                        <i class="fas fa-chart-bar fa-fw" />
                                        集計
                                    </div>
                                </button>

                            </div>
                        </div>

                    </div>
                    
                </div>                
            </div>
        </div>

        <div class="row mt-2" v-show="!state.isNotDisplayChart">
            <div class="col-12">
                <h5>
                    <i class="fas fa-chart-bar"></i>
                    チャート
                </h5>                
            </div>
            <div class="col-12 col-xl-4">
                <canvas ref="chartPie"></canvas>                
            </div>
            <div class="col-12 col-xl-8">
                <canvas ref="chartLine"></canvas>                
            </div>
        </div>
        <div class="row mt-2">
            <div class="col-12">
                <h5>
                    <i class="fas fa-list"></i>
                    リスト
                    </h5>
            </div>
            <div class="col-12">                
                
                <div class="table-responsive">
                    <table class="table table-striped table-dark">
                        <thead>
                            <tr class="text-nowrap" >
                                <th scope="col" style="min-width:90px;"  >{{cSelectedTermName}}</th>
                                <th scope="col" style="min-width:120px;" >{{cSelectedAxisName}}</th>
                                <th class="text-right" scope="col" style="min-width:110px;" >数量</th>
                                <th class="text-right" scope="col" style="min-width:110px;" >仕入件数</th>
                                <th class="text-right" scope="col" style="min-width:110px;" >金額</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="n  in cSummary">
                                <td>{{n.term}}</td>
                                <td>{{n.axis}}</td>
                                <td class="text-right">{{n.count.toFixed(0)}}</td>
                                <td class="text-right">{{n.invoices_count.toFixed(0)}}</td>
                                <td class="text-right">{{n.price.toLocaleString()}}</td>
                            </tr>
                            <tr> 
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td class="text-right">{{cSummaryTotal.count.toFixed(0)}}</td>
                                <td class="text-right">{{cSummaryTotal.invoices_count.toFixed(0)}}</td>
                                <td class="text-right">{{cSummaryTotal.price.toLocaleString()}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

        <div class="row mt-2">
            <div class="col-12">
                <h5>
                    <i class="fas fa-list"></i>
                    明細
                </h5>
            </div>
            <div class="col-12">
                <div class="table-responsive">
                    <table class="table table-striped table-dark">
                        <thead>
                            <tr class="text-nowrap" >
                                <th scope="col" style="min-width:90px;"  >仕入No.</th>
                                <!-- <th scope="col" style="min-width:90px;"  >区分</th> -->
                                <th scope="col" style="min-width:90px;"  >拠点</th>
                                <th scope="col" style="min-width:120px;" >名称</th>
                                <th scope="col" style="min-width:120px;" >寸法</th>
                                <th scope="col" style="min-width:120px;" >仕入先</th>
                                <th scope="col" style="min-width:90px;" >勘定区分</th>
                                <th scope="col" style="min-width:45px;"  >数量</th>
                                <th scope="col" style="min-width:45px;"  >単位</th>
                                <th scope="col" style="min-width:90px;"  >単価</th>
                                <th scope="col" style="min-width:90px;"  >金額</th>
                                <th scope="col" style="min-width:120px;" >仕入日</th>
                                <th scope="col" >物件</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="n  in cList4Display" :key="n.id">
                                <td class="text-nowrap">
                                    <a :href="`v#/t_p_invoice/edit/${n.t_p_invoice_id}`">{{n.t_p_invoice_id}}-{{n.id}}</a>
                                </td>
                                <!-- <td>{{cGetKvName(n.purchase_m_kv_id)}}</td> -->
                                <td>{{n.m_branch_name}}</td>
                                <td>{{n.material_name}}</td>
                                <td>{{cSizeFormat(n.material_size_x ,n.material_size_y)}}</td>
                                <td>{{n.supplier_m_customer_name}}</td>
                                <td>{{n.accounts_title_m_kv_name}}</td>
                                <td class="text-right">{{n.qty.toLocaleString()}}</td>
                                <td class="text-nowrap">{{cGetKvName(n.unit_m_kv_id)}}</td>
                                <td class="text-right">{{n.price.toLocaleString()}}</td>
                                <td class="text-right">{{n.total_price.toLocaleString()}}</td>
                                <td>{{$$formatDay(n.purchase_date , "YYYY-MM-DD")}}</td>
                                <td>
                                    <a href="#" v-if="!_.isNil(n.t_projects_id)"
                                        @click.prevent="$$openTProjectEditOnOtherTab(n.t_projects_id)">
                                            <!-- {{n.t_project.m_customer.name}}-{{n.t_projects_name}} -->
                                            -{{n.t_projects_name}}
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <a href="#" v-if="cIsAbleViewMore" 
                    class="pb-4"
                    @click.prevent="showMoreList">続きを表示</a>
            </div>

        </div>


    </div>
    

</template>
<script lang='ts'>
import PageMixins from '../../mixins/commons/PageMixins';

export default {
    mixins : [PageMixins] ,
}
</script>
<script lang="ts" setup>
import _ from 'lodash';
import { Chart, ChartData, registerables } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

import {namedColor ,transparentize} from "../../frameworks/ColorUtil" ;
import { computed, getCurrentInstance, reactive, watch } from 'vue';
import ArrayUtil from '../../frameworks/ArrayUtil';
import axios from 'axios';
import { useMasterStore } from '../../stores/masterStore';
import { SmUserOptionService } from '../masters/class/services/SmUserOptionService';
import NumberUtil from '../../frameworks/NumberUtil';

    Chart.register(...registerables);
    Chart.register(ChartDataLabels);

    const _this = getCurrentInstance()?.proxy ;
    const masterStore = useMasterStore() 

    const conditions = reactive({
        m_material_detail_id : 0 ,
        purchase_m_kv_id : 0 ,
        purchase_date_from : "" , 
        purchase_date_to : "" ,     
        m_branch_id : 0 , 
        supplier_m_customer_id : 0 ,     
        m_material_id : 0 ,
        category_m_kv_ids : Array() ,
    }) ;
    const state = reactive({

        isLoading : false , 

        listLimit : 10 , 
        page : 1 ,  
        anaylyze : { 
            term : "YYYY" , 
            sum : "price" ,
            axis : "m_branch_name" ,
        } , 

        analyzeLabelMap : {
            "term" : [
                { "key":"YYYY" ,"label" : "年" } ,
                { "key":"YYYY-MM" ,"label" : "月" } ,
                { "key":"YYYY-MM-DD" ,"label" : "日" } ,
            ] ,
            "sum" : [
                { "key":"price" ,"label" : "金額" } ,
                { "key":"count" ,"label" : "数量" } ,
                { "key":"invoices_count" ,"label" : "件数" } ,
            ] ,
            "axis" : [ 
                { "key":"m_branch_name" ,"label" : "拠点" } ,
                { "key":"material_m_kv_name" ,"label" : "材料カテゴリ" } ,                
                { "key":"supplier_m_customer_name" ,"label" : "仕入先" } ,                
                { "key":"accounts_title_m_kv_name" ,"label" : "勘定区分" } ,                
            ] ,
            
        } , 

        list : Array() ,

        chartFontColor : "#CCC" , 
        
        lineChart : undefined  , 
        pieChart : undefined , 

        isNotDisplayChart : false ,

    }) ;

    watch(() => state.anaylyze ,
          (val) => {
            updateLineChart() ;
            updatePieChart() ;
        },{deep: true}
    )
    watch(() => conditions ,
          (val) => {
            clearResult() ;
        },{immediate:true,deep: true}
    )

    //materialselect使用可能か
    const cIsEnabledMaterialSelect = computed(() => 
        !_.isNil(conditions.m_branch_id) && !_.isEmpty(conditions.category_m_kv_ids)    
    )

    const cSelectedAxisName = computed(() => {
        const found = state.analyzeLabelMap.axis.find(x => x.key == state.anaylyze.axis ) ; 
        return found?.label ?? "" ; 
    }) ;
    const cSelectedTermName = computed(() => {
        const found = state.analyzeLabelMap.term.find(x => x.key == state.anaylyze.term ) ; 
        return found?.label ?? "" ; 
    }) ;
    const cSelectedSumName = computed(() => {
        const found = state.analyzeLabelMap.axis.find(x => x.key == state.anaylyze.sum ) ; 
        return found?.label ?? "" ; 
    }) ;

    const cLimit = computed(() =>  state.page  * state.listLimit ) ;

    const cList4Display = computed(() => state.list.slice(0 , cLimit.value)) ;

    const cIsAbleViewMore = computed(() => cLimit.value < state.list.length ) ;

    const cSummaryTotal = computed(() => {
        const summary = {
            price : _.sumBy( cSummary.value , "price"),
            count : _.sumBy( cSummary.value , "count"),
            invoices_count : _.sumBy( cSummary.value , "invoices_count")
        }
        return summary  ; 
    }) ;

    const cSummary = computed(() => {
        const list = [] ; 
        let termFormat = state.anaylyze.term ; 
        //@ts-ignore
        let xLabels = _.uniq(state.list.map(x => _this.$$formatDay(x.purchase_date , termFormat))) ; 
        xLabels = _.sortBy(xLabels ) ; 

        let axisFormat = state.anaylyze.axis ; 
        // console.log(axisFormat)
        let yLabels = _.uniq(state.list.map(x => x[axisFormat])) ;  
        yLabels = _.sortBy(yLabels ) ; 

        // データ挿入
        for ( const xL of xLabels ){
            for ( const yL of yLabels ){
                const row = { 
                    term : xL , 
                    axis : yL , 
                    price : 0 ,
                    count : 0 ,
                    invoices_count : 0 , 
                }
                
                const filterd = state.list.filter(d => 
                    //@ts-ignore
                    _this.$$formatDay(d.purchase_date , termFormat) == xL &&
                    d[axisFormat] == yL
                ) ; 
                // console.log("filterd") ; 
                // console.log(filterd) ;      
                
                if ( filterd.length > 0 ){
                    row.price     = _.sumBy( filterd , function(x) { return x.total_price; }) ;
                    row.count     = _.sumBy( filterd , function(x) { return x.qty; }) ;
                    row.invoices_count  = filterd.length ;
                }
                
                list.push(row) ; 

            }
        }

        return list ; 
    }) ;

    const cSizeFormat = computed(() => (x:number,y:number) => {
        if( x == 0 || y == 0 ) return "" ;
        return `${NumberUtil.formatZeroSuppress(x)} × ${NumberUtil.formatZeroSuppress(y)}`
    })
    //区分取得
    const cGetKvName = computed(() => (kvid:number) => masterStore.getMKvById(kvid)?.kv_name) ;

    function updateLineChart () {
        // console.log("updateLineChart") ; 
        const xLabels = _.uniq(cSummary.value.map(x => x.term)) ; 
        // console.log("xLabels") ; 
        // console.log(xLabels) ; 

        const yLabels = _.uniq(cSummary.value.map(x => x.axis)) ; 
        // console.log("yLabels") ; 
        // console.log(yLabels) ; 

        const ds = yLabels.map(yL => {
            const dataList = [] ; 
            for ( const xL of xLabels){
                const found = cSummary.value.find(d => 
                        d.term === xL &&
                        d.axis === yL
                    ) ; 

                // console.log("found") ; 
                // console.log(found) ; 
                // console.log(this.anaylyze.sum) ; 
                //@ts-ignore
                const axisVal = found[state.anaylyze.sum].toFixed(2) ; 
                // const axisVal = this.anaylyze.sum == "count" ? filterd.length : _.sumBy(filterd , this.anaylyze.sum) ; 
                // console.log(axisVal)
                dataList.push(axisVal) ; 
            }
            const dsColor = namedColor(yLabels.indexOf(yL) + 1 );
            const row = {
                label:yL , 
                data : dataList , 
                borderColor : transparentize(dsColor, 0.5),
                backgroundColor : dsColor ,
                // yAxisID : `y${yLabels.indexOf(yL)}`
            }
            return row ; 
        }) ;

        // console.log("ds") ; 
        // console.log(ds) ; 

        if ( ds.length === 0 ) {                 
            clearResult() ; 
            return ; 
        }

        if ( state.lineChart === undefined){
            //@ts-ignore
            state.lineChart = new Chart(_this.$refs.chartLine , {
                    type: 'line',
                    data: {
                        labels: xLabels,
                        datasets: ds ,
                        borderWidth: 1
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: `仕入実績ラインチャート - ${cSelectedAxisName.value}` ,
                                color:state.chartFontColor ,
                            } ,
                            legend : { 
                                labels : { 
                                    color : state.chartFontColor , 

                                }
                            },
                            datalabels: {
                                color: '#fff',
                                display: true,
                                align: 'top',
                                font: {
                                    // size: 18,
                                }
                            },
                        },
                        // これを入れるとカーソル合わせた時にY軸分まとめて表示
                        interaction: {
                            mode: 'index',
                            intersect: false,
                        },
                        scales: {
                            y: {
                                beginAtZero: true ,
                                title: {
                                    display: true,
                                    text: cSelectedSumName.value,                                            
                                    color : state.chartFontColor,
                                },
                                ticks: {
                                    // For a category axis, the val is the index so the lookup via getLabelForValue is needed                                            
                                    color: state.chartFontColor,
                                }
                            } ,
                            x : { 
                                title: {
                                    display: true,
                                    text: cSelectedTermName.value,
                                    color : state.chartFontColor,
                                },
                                ticks: {
                                    // For a category axis, the val is the index so the lookup via getLabelForValue is needed                                            
                                    color: state.chartFontColor,
                                }
                                
                            }
                        } , 
                        
                    }                             
                });

        }
        else { 
            //@ts-ignore
            state.lineChart.data.labels = xLabels ; 
            //@ts-ignore
            state.lineChart.data.datasets = ds ; 
            //@ts-ignore
            state.lineChart.options.plugins.title.text = `仕入実績ラインチャート - ${cSelectedAxisName.value}` ; 
            //@ts-ignore
            state.lineChart.options.scales.y.title.text = cSelectedSumName.value ; 
            //@ts-ignore
            state.lineChart.options.scales.x.title.text = cSelectedTermName.value ; 
            //@ts-ignore
            state.lineChart.update() ; 
        }

    }
    function updatePieChart () {
        const labels = _.uniq(cSummary.value.map(x => x.axis)) ; 
            
         const dataArr = [] ; 
        const backGroupdArr = [] ; 

        for ( const l of labels ){
            const filterd = cSummary.value.filter(d => d.axis === l ) ; 
            // console.log("filterd") ; 
            // console.log(filterd) ; 
            const axisVal = _.sumBy(filterd , state.anaylyze.sum)  ; 
            const dsColor = namedColor(labels.indexOf(l) + 1 );

            dataArr.push(axisVal)
            backGroupdArr.push(dsColor) ; 
        }

        const ds = [
            {
                data : dataArr , 
                backgroundColor : backGroupdArr ,
            }
        ]


        // console.log("ds") ; 
        // console.log(JSON.stringify(ds)) ; 

        if ( dataArr.length === 0 ) {                 
            clearResult() ; 
            return ; 
        }

        if ( state.pieChart === undefined){
            //@ts-ignore
            state.pieChart = new Chart(_this.$refs.chartPie , {
                    type: 'pie',
                    data: {
                        labels: labels,
                        datasets: ds ,
                        // borderWidth: 1
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: `仕入実績 割合チャート - ${cSelectedAxisName.value}`  ,
                                color:state.chartFontColor ,
                            } ,                                    
                            legend : { 
                                labels : { 
                                    color : state.chartFontColor , 

                                }
                            } ,                                             
                            datalabels: {
                                formatter: (value, ctx) => {
                                    let sum = 0;
                                    let dataArr = ctx.chart.data.datasets[0].data;
                                    dataArr.map(data => {
                                        //@ts-ignore
                                        sum += data;
                                    });
                                    let percentage = (value * 100 / sum).toFixed(2)+"%";


                                    return percentage;
                                },
                                color: '#fff',
                                display: true,
                                align: 'bottom',
                                font: {
                                    size: 18,
                                }
                            },
                        },
                        
                    }                             
                });
            

        }            
        else { 
            //@ts-ignore
            state.pieChart.data.labels = labels ; 
            //@ts-ignore
            state.pieChart.data.datasets = ds ; 
            //@ts-ignore
            state.pieChart.options.plugins.title.text = `仕入実績 割合チャート - ${cSelectedAxisName.value}` ; 
            //@ts-ignore
            state.pieChart.update() ; 
        }
    }
    function clearResult () {
        state.list.splice(0)  ;
        if ( state.lineChart !== undefined){
            //@ts-ignore
            state.lineChart.clear() ; 
        }
        if ( state.pieChart !== undefined){
            //@ts-ignore
            state.pieChart.clear() ; 
        }
    }    

    async function search () {
        state.isLoading = true ; 
        state.page = 1 ; 

        let ep = 'api/tPInvoiceDetail/retrieve4Summary'

        try { 
            const res = await axios.post(ep,conditions) ;
            ArrayUtil.resetInsert(state.list , res.data) ; 
            updateLineChart() ; 
            updatePieChart() ; 
        }
        catch (error ) {                            
            clearResult() ; 
            //@ts-ignore
            _this.$$errorConsole(error ,error.ep) ;
        }
        finally {
            state.isLoading = false ; 
        }
        
    } 
    function showMoreList () { 
        state.page ++ ; 

    }  

    SmUserOptionService.setDefVal2State("analyze",state)


</script>
