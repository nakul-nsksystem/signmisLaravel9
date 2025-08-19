<template>
    <div>
        <div class="app-contents-container ">        
            <div class="row">

                <div class="col-12 col-xl-3 ">                    
                    <div class="form-group">
                        <label >納期(出荷日)</label>
                        <div class="d-flex flex-no-wrap">
                            <ex-v-date-picker 
                                readonly
                                aria-readonly="true"
                                v-model="state.conditions.delivery_at_from" />
                            <span class="px-2 pt-2">～</span>
                            <ex-v-date-picker 
                                readonly
                                aria-readonly="true"
                                v-model="state.conditions.delivery_at_to" />
                        </div>
                    </div>    


                </div>
                <div class="col-12 col-xl-1 px-xl-0">
                    <div class="form-group">
                        <label>拠点</label>
                        <m-branch-select 
                            v-model="state.conditions.m_branch_id_4_sum" 
                            />
                    </div>
                </div>    

                <div class="col-12 col-xl-2 ">
                    <div class="form-group">
                        <label >納品形態</label>
                        <m-kv-select
                            v-model="state.conditions.delivery_m_kv_id"                                
                            :kv-key="'t_projects-delivery'"
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
                            :class="{active : state.anaylyze.sum === 'count' }" 
                            data-toggle="tooltip" data-placement="top" title="件数" >
                            <input type="radio" v-model="state.anaylyze.sum" name="height-mode" value="count">
                            件数
                        </label>                        
                    </div> 
                    <div 
                        class="btn-group btn-group-toggle"  >
                        <label class="btn btn-dark"
                            :class="{active : state.anaylyze.sum === 'product_count' }" 
                            data-toggle="tooltip" data-placement="top" title="商品件数" >
                            <input type="radio" v-model="state.anaylyze.sum" name="height-mode" value="product_count">
                            商品件数
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
                            :class="{active : state.anaylyze.axis === 'delivery_m_kv_name' }" 
                            data-toggle="tooltip" data-placement="top" title="納品形態" >
                            <input type="radio" v-model="state.anaylyze.axis" name="height-mode" value="delivery_m_kv_name">
                            納品形態
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
                                <th scope="col" style="min-width:120px;" >{{cSelectedAxisName}}<small v-show="cSelectedAxisName=='拠点'">※施工は受注拠点</small></th>
                                <th class="text-right" scope="col" style="min-width:110px;" >㎡</th>
                                <th class="text-right" scope="col" style="min-width:110px;" >重量(kg)</th>
                                <th class="text-right" scope="col" style="min-width:110px;" >件数</th>
                                <th class="text-right" scope="col" style="min-width:110px;" >商品件数</th>  
                                <th class="text-right" scope="col" style="min-width:110px;" >使用防炎シール枚数</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="n  in cSummary">
                                <td>{{n.term}}</td>
                                <td>{{n.axis}}</td>
                                <td class="text-right">{{n.sqm.toFixed(3)}}</td>
                                <td class="text-right">{{n.weight.toFixed(3)}}</td>
                                <td class="text-right">{{n.count.toFixed(0)}}</td>
                                <td class="text-right">{{n.product_count.toFixed(0)}}</td>
                                <td class="text-right">{{n.fire_prevention_count.toFixed(0)}}</td>
                                
                            </tr>
                            
                            <tr> 
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td class="text-right">{{cSummaryTotal.sqm.toFixed(3)}}</td>
                                <td class="text-right">{{cSummaryTotal.weight.toFixed(3)}}</td>
                                <td class="text-right">{{cSummaryTotal.count.toFixed(0)}}</td>
                                <td class="text-right">{{cSummaryTotal.product_count.toFixed(0)}}</td>
                                <td class="text-right">{{cSummaryTotal.fire_prevention_count.toFixed(0)}}</td>
                                

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
                                <th style="white-space: normal">拠点<small>※施工は受注拠点</small></th>
                                <th>納品形態</th>
                                <th>納品日</th>
                                <th>物件名</th>
                                <th>対象商品</th>
                                <th>防炎シール</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="n  in cList4Display" :key="n.id"  class="text-nowrap">
                                <td>{{n.m_branch_name}}</td>
                                <td>{{n.delivery_m_kv_name}}</td>
                                <td>{{$$formatDay(n.delivery_at , "YYYY-MM-DD")}}</td>
                                <td class="text-truncate" style="max-width:350px">
                                    <a href="#"
                                        @click.prevent="$$openTProjectEditOnOtherTab(n.t_project_id)">
                                            {{n.m_customer_name}} {{n.t_project_name}}
                                    </a>
                                </td>
                                <td>
                                    <p v-for="(prod,index) in n.t_project_products " :key="`${prod.id}${n.id}${index}`" class="mb-0">
                                        {{prod.name}}
                                    </p>
                                </td>
                                <td class="text-right">
                                    <p v-for="(prod,index) in n.t_project_products " :key="`${prod.id}${n.id}${index}`" class="mb-0">
                                        {{cNumOfPrevFireLabel(prod)}}
                                    </p>
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
import { TProjectDelivery } from '../tProjects/class/models/TProjectDelivery';
import { TProjectProduct } from '../tProjects/class/models/TProjectProduct';

    Chart.register(...registerables);
    Chart.register(ChartDataLabels);

    const _this = getCurrentInstance()?.proxy ;

    const state = reactive({

        isLoading : false , 

        listLimit : 10 , 
        page : 1 ,  

        conditions : { 
            delivery_at_from : "" , 
            delivery_at_to : "" , 
            delivery_m_kv_id : 0 ,
            // m_branch_id : 0 ,      
            m_branch_id_4_sum : 0 ,      
        } , 
        anaylyze : { 
            term : "YYYY" , 
            sum : "count" ,
            axis : "m_branch_name" ,
        } , 

        analyzeLabelMap : {
            "term" : [
                { "key":"YYYY" ,"label" : "年" } ,
                { "key":"YYYY-MM" ,"label" : "月" } ,
                { "key":"YYYY-MM-DD" ,"label" : "日" } ,
            ] ,
            "sum" : [
                { "key":"count" ,"label" : "件数" } ,
                { "key":"product_count" ,"label" : "商品件数" } ,
            ] ,
            "axis" : [ 
                { "key":"m_branch_name" ,"label" : "拠点" } ,
                { "key":"delivery_m_kv_name" ,"label" : "納品形態" } ,                
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
            sqm : _.sumBy( cSummary.value , "sqm"),
            weight : _.sumBy( cSummary.value , "weight"),
            count : _.sumBy( cSummary.value , "count") ,
            product_count : _.sumBy( cSummary.value , "product_count") ,
            fire_prevention_count : _.sumBy( cSummary.value , "fire_prevention_count")
        }
        return summary  ; 
    }) ;

    const cSummary = computed(() => {
        const list = [] ; 
        let termFormat = state.anaylyze.term ; 
        //@ts-ignore
        let xLabels = _.uniq(state.list.map(x => _this.$$formatDay(x.delivery_at , termFormat))) ; 
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
                    sqm : 0 ,
                    weight : 0 ,
                    count : 0 ,
                    product_count : 0 , 
                    fire_prevention_count : 0 ,
                }
                
                const filterd = state.list.filter(d => 
                        //@ts-ignore
                        _this.$$formatDay(d.delivery_at , termFormat) == xL &&
                        d[axisFormat] == yL
                    ) ; 
                // console.log("filterd") ; 
                // console.log(filterd) ;      
                
                if ( filterd.length > 0 ){
                    row.sqm     = _.sumBy( filterd , function(x) { return _.isNil(x.total_sqm) ? 0 : parseInt(x.total_sqm, 10); }) ;
                    row.weight  = _.sumBy( filterd , function(x) { return _.isNil(x.total_weight) ? 0 : parseInt(x.total_weight, 10); }) ;
                    row.count   = filterd.length ;
                    row.product_count = 0 ; 
                    row.product_count = _.sumBy( filterd , function(x) { return x.t_project_products.length ; }) ; 
                    row.fire_prevention_count     = _.sumBy( filterd , function(x) { return _.isNil(x.num_of_fire_prevention_label) ? 0 : parseInt(x.num_of_fire_prevention_label, 10); }) ;

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
                //  console.log(axisVal)
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
                                text: `納品実績ラインチャート - ${cSelectedAxisName.value}` ,
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
            state.lineChart.options.plugins.title.text = `納品実績ラインチャート - ${cSelectedAxisName.value}` ; 
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
                                text: `納品実績 割合チャート - ${cSelectedAxisName.value}`  ,
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
            state.pieChart.options.plugins.title.text = `納品実績 割合チャート - ${cSelectedAxisName.value}` ; 
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

        let ep = 'api/tProjectDelivery/retrieve4Summary'

        try { 
            
            const res = await axios.post(ep,state.conditions) ;
            //@ts-ignore
            // const parsed = res.data.map( x => TProjectDelivery.parse(x))
            console.log(res.data) ;
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


    type TpJoindProd = {
        id:number,
        fire_prev_label_cd:string,
        is_needed_labels_for_fire_prevention:boolean,
        name:string,
        qty:number,
    }
    const cNumOfPrevFireLabel = computed(() => 
        (product:TpJoindProd) => {
            if(product.is_needed_labels_for_fire_prevention ) {
                
                const cd = product.fire_prev_label_cd ?? '';
                return  `${cd} ${product.qty}枚` ;
            }
            return '　' ;
        })

</script>

<style scoped>
.text-truncate:hover {
    white-space: normal;
} 
</style>