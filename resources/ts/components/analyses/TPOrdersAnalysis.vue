<template>
    <div>
        <div class="app-contents-container ">        
            <div class="row">

                <div class="col-12 col-xl-3 ">                    
                    <div class="form-group">
                        <label >発注日</label>
                        <div class="d-flex flex-no-wrap">
                            <ex-v-date-picker 
                                readonly
                                aria-readonly="true"
                                v-model="state.conditions.t_p_order.order_date_from" />
                            <span class="px-2 pt-2">～</span>
                            <ex-v-date-picker 
                                readonly
                                aria-readonly="true"
                                v-model="state.conditions.t_p_order.order_date_to" />
                        </div>
                    </div>    
                </div>
                <div class="col-12 col-xl-1 px-xl-0">
                    <div class="form-group">
                        <label>拠点</label>
                        <m-branch-select 
                            v-model="state.conditions.t_p_order.m_branch_id" 
                            />
                    </div>
                </div>
                
                <div class="col-12 col-xl-3">
                    <div class="form-group">
                        <label>仕入先</label>
                        <m-customer-ref-input
                            :m-branch-id="state.conditions.t_p_order.m_branch_id"
                            :dealingCds="[2]"
                            v-model="state.conditions.t_p_order.supplier_m_customer_id" 
                            />
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
                            :class="{active : state.anaylyze.sum === 'orderds_count' }" 
                            data-toggle="tooltip" data-placement="top" title="商品件数" >
                            <input type="radio" v-model="state.anaylyze.sum" name="height-mode" value="orderds_count">
                            発注件数
                        </label>                        
                    </div>
                </div>                
                <div class="col-12 col-xl-6">
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
                    </div> 
                </div>
                <div class="col-12 col-xl-1 d-flex">
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

        <div class="row mt-2">
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
                                <th class="text-right" scope="col" style="min-width:110px;" >発注件数</th>
                                <th class="text-right" scope="col" style="min-width:110px;" >金額</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="n  in cSummary">
                                <td>{{n.term}}</td>
                                <td>{{n.axis}}</td>
                                <td class="text-right">{{n.count.toFixed(0)}}</td>
                                <td class="text-right">{{n.orderds_count.toFixed(0)}}</td>
                                <td class="text-right">{{n.price.toLocaleString()}}</td>
                                
                            </tr>
                            
                            <tr> 
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td class="text-right">{{cSummaryTotal.count.toFixed(0)}}</td>
                                <td class="text-right">{{cSummaryTotal.orderds_count.toFixed(0)}}</td>
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
                                <th scope="col" style="min-width:90px;"  >発注No.</th>
                                <th scope="col" style="min-width:90px;"  >拠点</th>
                                <th scope="col" style="min-width:120px;" >名称</th>
                                <th scope="col" style="min-width:120px;" >仕入先</th>
                                <th scope="col" style="min-width:100px;" >カテゴリ</th>
                                <th scope="col" style="min-width:120px;" >発注日</th>
                                <th scope="col" >物件</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="n  in cList4Display" :key="n.id">
                                <td>{{n.t_p_order.id}}-{{n.id}}</td>
                                <td>{{n.m_branch_name}}</td>
                                <td>{{n.po_material_name}}</td>
                                <td>{{n.supplier_m_customer_name}}</td>
                                <td>{{n.material_m_kv_name}}</td>
                                <td>{{$$formatDay(n.t_p_order.order_date , "YYYY-MM-DD")}}</td>
                                <td>
                                    <div v-for="process in n.t_project_product_processes">
                                        <a href="#"
                                            @click.prevent="$$openTProjectEditOnOtherTab(process.t_project_product.t_project_id)">
                                                {{process.t_project_product.t_project.m_customer.name}} {{process.t_project_product.t_project.name}} - {{process.t_project_product.name}}
                                        </a>
                                    </div>
                                    
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

<script lang="ts" setup>
import _ from 'lodash';
import { Chart, ChartData, registerables } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

import {namedColor ,transparentize} from "../../frameworks/ColorUtil" ;
import { computed, getCurrentInstance, reactive, watch } from 'vue';
import ArrayUtil from '../../frameworks/ArrayUtil';
import axios from 'axios';
import { TProjectProduct } from '../tProjects/class/models/TProjectProduct';

    Chart.register(...registerables);
    Chart.register(ChartDataLabels);

    const _this = getCurrentInstance()?.proxy ;

    const state = reactive({

        isLoading : false , 

        listLimit : 10 , 
        page : 1 ,  

        conditions : {
            t_p_order : {
                order_date_from : "" , 
                order_date_to : "" ,     
                m_branch_id : 0 , 
                supplier_m_customer_id : 0 ,     
            } ,
            m_material_detail : {
                m_material : {
                    category_m_kv_id : 0 ,
                }
            } ,
        } , 
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
                { "key":"orderds_count" ,"label" : "発注件数" } ,
            ] ,
            "axis" : [ 
                { "key":"m_branch_name" ,"label" : "拠点" } ,
                { "key":"material_m_kv_name" ,"label" : "材料カテゴリ" } ,                
                { "key":"supplier_m_customer_name" ,"label" : "仕入先" } ,                
            ] ,
            
        } , 

        list : Array() ,

        chartFontColor : "#CCC" , 
        
        lineChart : undefined  , 
        pieChart : undefined , 

    }) ;

    watch(() => state.anaylyze ,
          (val) => {
            updateLineChart() ;
            updatePieChart() ;
        },{deep: true}
    )
    watch(() => state.conditions ,
          (val) => {
            clearResult() ;
        },{immediate:true,deep: true}
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
            orderds_count : _.sumBy( cSummary.value , "orderds_count")
        }
        return summary  ; 
    }) ;

    const cSummary = computed(() => {
        const list = [] ; 
        let termFormat = state.anaylyze.term ; 
        //@ts-ignore
        let xLabels = _.uniq(state.list.map(x => _this.$$formatDay(x.t_p_order.order_date , termFormat))) ; 
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
                    orderds_count : 0 , 
                }
                
                const filterd = state.list.filter(d => 
                    //@ts-ignore
                    _this.$$formatDay(d.t_p_order.order_date , termFormat) == xL &&
                    d[axisFormat] == yL
                ) ; 
                // console.log("filterd") ; 
                // console.log(filterd) ;      
                
                if ( filterd.length > 0 ){
                    row.price     = _.sumBy( filterd , function(x) { return x.total_price; }) ;
                    row.count     = _.sumBy( filterd , function(x) { return x.qty; }) ;
                    row.orderds_count  = filterd.length ;
                }
                
                list.push(row) ; 

            }
        }

        return list ; 
    }) ;

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
                                text: `発注実績ラインチャート - ${cSelectedAxisName.value}` ,
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
            state.lineChart.options.plugins.title.text = `発注実績ラインチャート - ${cSelectedAxisName.value}` ; 
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
                                text: `発注実績 割合チャート - ${cSelectedAxisName.value}`  ,
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
                                color: state.chartFontColor,
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
            state.pieChart.options.plugins.title.text = `発注実績 割合チャート - ${cSelectedAxisName.value}` ; 
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

        let ep = 'api/tPOrderDetail/retrieve4Summary'

        try { 
            
            const res = await axios.post(ep,state.conditions) ;
            // console.log(res.data)
            //@ts-ignore
            // const parsed = res.data.map( x => TProjectDelivery.parse(x))
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


</script>