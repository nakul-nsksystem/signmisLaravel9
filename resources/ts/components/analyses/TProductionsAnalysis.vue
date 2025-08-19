<template>
    <div>
        <div class="app-contents-container ">        
            <div class="row">

                <div class="col-12 col-xl-3 ">                    
                    <div class="form-group">
                        <label >生産日</label>
                        <div class="d-flex flex-no-wrap">
                            <ex-v-date-picker 
                                readonly
                                aria-readonly="true"
                                v-model="dConditions.started_at_from" />
                            <span class="px-2 pt-2">～</span>
                            <ex-v-date-picker 
                                readonly
                                aria-readonly="true"
                                v-model="dConditions.started_at_to" />
                        </div>
                    </div>    


                </div>

                <div class="col-12 col-xl-1 px-xl-0">
                    <div class="form-group">
                        <label>生産拠点</label>
                    
                        <m-branch-select 
                            v-model="dConditions.m_production.m_branch_id" 
                            ></m-branch-select>
                    </div>
                </div>    

                <div class="col-12 col-xl-2 ">
                    <div class="form-group">
                        <label >加工カテゴリー</label>
                        <m-kv-select
                                v-model="dConditions.t_project_product_process.m_process_category.production_m_kv_id"                                
                                :kv-key="'m_process_categories-production'"
                                />
                    </div>
                </div>
                
                <div class="col-12 col-xl-5">
                    <div class="form-group">
                        <label >商品カテゴリ</label>
                        <m-product-category-multi-select
                            v-model="dConditions.t_project_product_process.t_project_product.m_product_category_ids"                            
                            :isOnlyProduction="true"
                            />
                    </div>
                    
                </div>
                

            </div>
            <!-- <div class="row">

                <div class="col-12 col-xl-2">                        
                    <div class="form-group">
                        <label >制作担当</label>
                        <m-user-select  
                            v-model="dConditions.operator_m_user_id"
                            :m-branch-id="mBranchId"
                            :filter-m-tag-keys='["m_users-role-op"]'                                
                            />
                    </div>
                </div>
            </div> -->

            <div class="row">

                <div class="col-12 col-xl-2">
                    <h6 class="text-primary">分析期間</h6>
                    <ymd-Select     
                        v-model="dAnaylyze.term"
                        />
                </div>
                <div class="col-12 col-xl-3">
                    <h6  class="text-warning">集計値</h6>                                            
                    <div 
                        class="btn-group btn-group-toggle"  >
                        <label class="btn btn-dark"
                            :class="{active : dAnaylyze.sum === 'sqm' }"
                            data-toggle="tooltip" data-placement="top" title="㎡" >
                            <input type="radio" v-model="dAnaylyze.sum" name="height-mode" value="sqm"
                                >
                            ㎡
                        </label> 
                        <label class="btn btn-dark"
                            :class="{active : dAnaylyze.sum === 'hours' }" 
                            data-toggle="tooltip" data-placement="top" title="作業時間" >
                            <input type="radio" v-model="dAnaylyze.sum" name="height-mode" value="hours">
                            作業時間
                        </label>
                        <label class="btn btn-dark"
                            :class="{active : dAnaylyze.sum === 'count' }" 
                            data-toggle="tooltip" data-placement="top" title="商品件数" >
                            <input type="radio" v-model="dAnaylyze.sum" name="height-mode" value="count">
                            商品件数
                        </label>                        
                        <label class="btn btn-dark"
                            :class="{active : dAnaylyze.sum === 'job_count' }" 
                            data-toggle="tooltip" data-placement="top" title="物件件数" >
                            <input type="radio" v-model="dAnaylyze.sum" name="height-mode" value="job_count">
                            物件件数
                        </label>
                    </div> 
                </div>                
                <div class="col-12 col-xl-6">
                    <h6 class="text-success">分析軸</h6>
                                          
                    <div 
                        class="btn-group btn-group-toggle"  >
                        <label class="btn btn-dark"
                            :class="{active : dAnaylyze.axis === 'production_m_branch_name' }"
                            data-toggle="tooltip" data-placement="top" title="拠点" >
                            <input type="radio" v-model="dAnaylyze.axis" name="height-mode" value="production_m_branch_name"
                                >
                            拠点
                        </label> 
                        <label class="btn btn-dark"
                            :class="{active : dAnaylyze.axis === 'm_production_name' }"
                            data-toggle="tooltip" data-placement="top" title="生産先" >
                            <input type="radio" v-model="dAnaylyze.axis" name="height-mode" value="m_production_name"
                                >
                            生産先
                        </label> 
                        <label class="btn btn-dark"
                            :class="{active : dAnaylyze.axis === 'm_product_category_name' }" 
                            data-toggle="tooltip" data-placement="top" title="商品カテゴリ" >
                            <input type="radio" v-model="dAnaylyze.axis" name="height-mode" value="m_product_category_name">
                            商品カテゴリ
                        </label>
                    </div> 
                </div>
                <div class="col-12 col-xl-1 d-flex">
                    <div class="ml-auto">
                        <div class="form-group">
                            <label>&nbsp;</label>
                            <div >
                                <button type="button" :disabled="dIsLoading" class="btn btn-success" @click.prevent="search()">
                                    <div v-if="dIsLoading">
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
                                <th class="text-right" scope="col" style="min-width:110px;" >作業時間</th>
                                <th class="text-right" scope="col" style="min-width:110px;" >㎡</th>
                                <th class="text-right" scope="col" style="min-width:110px;" >商品件数</th>
                                <th class="text-right" scope="col" style="min-width:110px;" >物件件数</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="n  in cSummary" :key="n.id">
                                <td>{{n.term}}</td>
                                <td>{{n.axis}}</td>
                                <td class="text-right">{{(n.minutes / 60).toFixed(3)}}h</td>
                                <td class="text-right">{{n.sqm.toFixed(3)}}</td>
                                <td class="text-right">{{n.count.toFixed(0)}}</td>
                                <td class="text-right">{{n.job_count.toFixed(0)}}</td>
                                
                            </tr>
                            
                            <tr> 
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td class="text-right">{{(cSummaryTotal.minutes / 60).toFixed(3)}}h</td>
                                <td class="text-right">{{cSummaryTotal.sqm.toFixed(3)}}</td>
                                <td class="text-right">{{cSummaryTotal.count.toFixed(0)}}</td>
                                <td class="text-right">{{cSummaryTotal.job_count.toFixed(0)}}</td>
          

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
                                <th scope="col" style="min-width:90px;"  >拠点</th>
                                <th scope="col" style="min-width:120px;" >生産先</th>
                                <th scope="col" style="min-width:100px;" >商品カテゴリ</th>
                                <th scope="col" style="min-width:100px;" >生産日</th>
                                <th class="text-right" scope="col" style="min-width:110px;" >作業時間</th>
                                <th class="text-right" scope="col" style="min-width:110px;" >㎡</th>
                                <th scope="col">対象商品</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="n  in cList4Display" :key="n.id">
                                <td>{{n.m_production.m_branch.short_name}}</td>
                                <td>{{n.m_production.name}}</td>
                                <td>
                                    {{n.m_product_category_name}}
                                </td>
                                <td>{{$$formatDay(n.started_at , "YYYY-MM-DD HH:mm")}}</td>
                                <td class="text-right">{{(n.minutes / 60).toFixed(3)}}h</td>
                                <td class="text-right">{{n.TotalSqm.toFixed(3)}}</td>
                                <td>
                                    <p v-for="process in n.target_t_project_product_processes" :key="process.id"
                                        class="mb-0">
                                        <a href="#"
                                            @click.prevent="$$openTProjectEditOnOtherTab(process.t_project_product.t_project.id)">
                                                {{process.t_project_product.t_project.m_customer.name}} {{process.t_project_product.t_project.name}} - {{process.t_project_product.name}}
                                        </a>
                                        
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

<script>
import _ from 'lodash';
import { Chart, ChartData, registerables } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

import {namedColor ,transparentize} from "../../frameworks/ColorUtil" ;
import {TProductionResultService} from '../tProductions/class/services/TProductionResultService';
import ArrayUtil from '../../frameworks/ArrayUtil';

Chart.register(...registerables);
Chart.register(ChartDataLabels);

export default {
    data : function() {
        return {
            dIsLoading : false , 

            dListLimit : 10 , 
            dPage : 1 ,  



            dConditions : { 
                started_at_from : "" , 
                started_at_to : "" , 
                m_production : { 
                    m_branch_id : 0 , 
                } , 
                t_project_product_process : { 
                    t_project_product : { 
                        m_product_category_ids : [] , 
                    } , 
                    m_process_category : { 
                        production_m_kv_id : 0 , 
                    } , 
                } , 
                
            } , 
            dAnaylyze : { 
                term : "YYYY" , 
                sum : "sqm" ,
                axis : "m_product_category_name" ,
            } , 

            dAnalyzeLabelMap : {
                "term" : [
                    { "key":"YYYY" ,"label" : "年" } ,
                    { "key":"YYYY-MM" ,"label" : "月" } ,
                    { "key":"YYYY-MM-DD" ,"label" : "日" } ,
                ] ,
                "sum" : [
                    { "key":"sqm" ,"label" : "㎡" } ,
                    { "key":"hours" ,"label" : "作業時間" } ,
                    { "key":"count" ,"label" : "商品件数" } ,
                    { "key":"job_count" ,"label" : "ジョブ件数" } ,
                ] ,
                "axis" : [ 
                    { "key":"production_m_branch_name" ,"label" : "拠点" } ,
                    { "key":"m_production_name" ,"label" : "生産先" } ,
                    { "key":"m_product_category_name" ,"label" : "商品カテゴリ" } ,                
                ] ,
                
            } , 

            dList : [] ,

            dChartFontColor : "#CCC" , 

            
            dLineChart : undefined  , 
            dPieChart : undefined , 

        }         
    } ,
    watch : {

        dAnaylyze : {
           immediate: true,
           deep : true , 
           handler: function (val) {            
               this.updateLineChart() ; 
               this.updatePieChart() ; 
           }
        } ,

        dConditions : { 
           immediate: true,
           deep : true , 
           handler: function (val) {            
               this.clearResult() ; 
           }

        }


    } ,
    computed : {
        cSelectedAxisName : function() { 
            const found = this.dAnalyzeLabelMap.axis.find(x => x.key == this.dAnaylyze.axis ) ; 
            return found.label ?? "" ; 
        } ,
        cSelectedTermName : function() { 
            const found = this.dAnalyzeLabelMap.term.find(x => x.key == this.dAnaylyze.term ) ; 
            return found.label ?? "" ; 
        } ,
        cSelectedSumName : function() { 
            const found = this.dAnalyzeLabelMap.sum.find(x => x.key == this.dAnaylyze.sum ) ; 
            return found.label ?? "" ; 
        } ,
        cLimit : function() { 
            return this.dPage  * this.dListLimit ; 
        } , 
        cList4Display : function() {             
            return this.dList.slice(0 , this.cLimit) ; 
        } ,
        cIsAbleViewMore : function() { 
            return this.cLimit < this.dList.length ; 
        } ,
        cSummaryTotal : function() { 
            const summary = { } ; 
            summary.minutes     = _.sumBy( this.cSummary , "minutes") ; 
            summary.sqm         = _.sumBy( this.cSummary , "sqm") ; 
            summary.count       = _.sumBy( this.cSummary , "count") ; 
            summary.job_count   = _.sumBy( this.cSummary , "job_count") ; 

            return summary  ; 
             
        } ,
        cSummary : function() { 
            const list = [] ; 

            let termFormat = this.dAnaylyze.term ; 
            let xLabels = _.uniq(this.dList.map(x => this.$$formatDay(x.started_at , termFormat))) ; 
            xLabels = _.sortBy(xLabels ) ; 

            let axisFormat = this.dAnaylyze.axis ; 
            let yLabels = _.uniq(this.dList.map(x => x[axisFormat])) ;  
            yLabels = _.sortBy(yLabels ) ; 

            // データ挿入
            for ( const xL of xLabels ){
                for ( const yL of yLabels ){
                    const row = { 
                        term : xL , 
                        axis : yL , 
                        minutes : 0 , 
                        hours : 0 , 
                        sqm : 0 ,
                        count : 0 ,
                        job_count : 0 , 
                    }
                    
                    const filterd = this.dList.filter(d => 
                            this.$$formatDay(d.started_at , termFormat) == xL &&
                            d[axisFormat] == yL
                        ) ; 
                    // console.log("filterd") ; 
                    // console.log(filterd) ; 
                    
                    if ( filterd.length > 0 ){
                        row.minutes = _.sumBy( filterd , function(x) { return x.minutes ; }) ;
                        row.hours   = row.minutes === 0 ? 0 : row.minutes / 60 ; 
                        row.sqm     = _.sumBy( filterd , function(x) { return x.TotalSqm; }) ;
                        row.count   = _.sumBy( filterd , function(x) { return x.target_t_project_product_processes.length ; }) ;
                        row.job_count = filterd.length ; 

                    }
                    
                    list.push(row) ; 

                }
            }

            for ( const row of this.dList) { 

            }
            
            return list ; 
        }
    } ,
    methods : {

        updatePieChart : function() {
            const labels = _.uniq(this.cSummary.map(x => x.axis)) ; 
            
            const dataArr = [] ; 
            const backGroupdArr = [] ; 

            for ( const l of labels ){
                const filterd = this.cSummary.filter(d => d.axis === l ) ; 
                // console.log("filterd") ; 
                // console.log(filterd) ; 
                const axisVal = _.sumBy(filterd , this.dAnaylyze.sum)  ; 
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
                this.clearResult() ; 
                return ; 
            }

            if ( this.dPieChart === undefined){
                this.dPieChart = 
                    new Chart(this.$refs.chartPie , {
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
                                        text: `生産実績 割合チャート - ${this.cSelectedAxisName}`  ,
                                        color:this.dChartFontColor ,
                                    } ,                                    
                                    legend : { 
                                        labels : { 
                                            color : this.dChartFontColor , 

                                        }
                                    } ,                                             
                                    datalabels: {
                                        formatter: (value, ctx) => {
                                            let sum = 0;
                                            let dataArr = ctx.chart.data.datasets[0].data;
                                            dataArr.map(data => {
                                                sum += data;
                                            });
                                            let percentage = (value * 100 / sum).toFixed(2)+"%";


                                            return percentage;
                                        },
                                        color: this.dChartFontColor,
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
                this.dPieChart.data.labels = labels ; 
                this.dPieChart.data.datasets = ds ; 
                this.dPieChart.options.plugins.title.text = `生産実績 割合チャート - ${this.cSelectedAxisName}` ; 
                this.dPieChart.update() ; 
            }

        } , 


        /**
         * ライン チャート更新
         */
        updateLineChart : function() { 
            // console.log("updateLineChart") ; 

            const xLabels = _.uniq(this.cSummary.map(x => x.term)) ; 
            // console.log("xLabels") ; 
            // console.log(xLabels) ; 

            const yLabels = _.uniq(this.cSummary.map(x => x.axis)) ; 
            // console.log("yLabels") ; 
            // console.log(yLabels) ; 

            const ds = yLabels.map(yL => {
                const dataList = [] ; 
                for ( const xL of xLabels){
                    const found = this.cSummary.find(d => 
                            d.term === xL &&
                            d.axis === yL
                        ) ; 

                    // console.log("found") ; 
                    // console.log(found) ; 
                    // console.log(this.dAnaylyze.sum) ; 
                    const axisVal = found[this.dAnaylyze.sum].toFixed(2) ; 
                    // const axisVal = this.dAnaylyze.sum == "count" ? filterd.length : _.sumBy(filterd , this.dAnaylyze.sum) ; 
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
                this.clearResult() ; 
                return ; 
            }

            if ( this.dLineChart === undefined){
                this.dLineChart = 
                    new Chart(this.$refs.chartLine , {
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
                                        text: `生産実績ラインチャート - ${this.cSelectedAxisName}` ,
                                        color:this.dChartFontColor ,
                                    } ,
                                    legend : { 
                                        labels : { 
                                            color : this.dChartFontColor , 

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
                                            text: this.cSelectedSumName,                                            
                                            color : this.dChartFontColor,
                                        },
                                        ticks: {
                                            // For a category axis, the val is the index so the lookup via getLabelForValue is needed                                            
                                            color: this.dChartFontColor,
                                        }
                                    } ,
                                    x : { 
                                        title: {
                                            display: true,
                                            text: this.cSelectedTermName,
                                            color : this.dChartFontColor,
                                        },
                                        ticks: {
                                            // For a category axis, the val is the index so the lookup via getLabelForValue is needed                                            
                                            color: this.dChartFontColor,
                                        }
                                        
                                    }
                                } , 
                                
                            }                             
                        });


            }
            else { 
                this.dLineChart.data.labels = xLabels ; 
                this.dLineChart.data.datasets = ds ; 
                this.dLineChart.options.plugins.title.text = `生産実績ラインチャート - ${this.cSelectedAxisName}` ; 
                this.dLineChart.options.scales.y.title.text = this.cSelectedSumName ; 
                this.dLineChart.options.scales.x.title.text = this.cSelectedTermName ; 
                this.dLineChart.update() ; 
            }


        } ,         
        search :async function(){
            this.dIsLoading = true ; 
            this.dPage = 1 ; 

            try { 
                
                const list = await TProductionResultService.retrieve4summary(this.dConditions) ; 
                ArrayUtil.resetInsert(this.dList , list) ; 

                this.updateLineChart() ; 
                this.updatePieChart() ; 

            }
            catch (error ) {                            
                this.clearResult() ; 
                this.$$errorConsole(error ,error.ep) ;
            }
            finally {
                this.dIsLoading = false ; 
            }
            

            
        } , 
        showMoreList : function() { 
            this.dPage ++ ; 

        } , 
        clearResult : function() { 
            this.dList.splice(0)  ;
            if ( this.dLineChart !== undefined){
                this.dLineChart.clear() ; 
            }
            if ( this.dPieChart !== undefined){
                this.dPieChart.clear() ; 
            }
            

        }



    } ,
    created : function(){} , 
    mounted : function() { 
        
        
    }
    
} 
</script>