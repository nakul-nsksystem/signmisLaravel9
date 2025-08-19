<template>
    <div>                  
        <!-- <contents-header-component
        >
        </contents-header-component>
            <div slot="breadcrumb">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb bg-dark p-0 mb-0">
                        <li class="breadcrumb-item"><a href="#">home</a></li>
                        <li class="breadcrumb-item  active" aria-current="page">発注</li>
                        <li class="breadcrumb-item"><a href="#">発注確認</a></li>
                    </ol>
                </nav>
            </div>
            <div slot="title">

            </div>              -->

        <div class="app-contents-container">
            <div class="row">
                <div class="col-12">
                    <div class="pt-2">
                        <p>発注先：{{dRow.t_p_order.supplier_m_customer.name}}</p>
                        <p>発注明細ID：{{$route.params.id}}</p>
                        <p>発注拠点：{{dRow.t_p_order.m_branch.short_name}}</p>
                        <p>依頼日：{{dateFormat(dRow.created_at)}}</p>
                    </div>
                    <table class="table table-bordered text-white">
                        <thead class="thead-light">
                            <tr>
                                <th scope="col">品番/名称</th>
                                <th scope="col">数量</th>
                                <th scope="col">単価</th>
                                <th scope="col">金額</th>
                                <th scope="col">物件</th>
                                <th scope="col">納期</th>
                                <th scope="col">備考</th>
                                <th scope="col">status</th>                            
                                <th scope="col">承認</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{dRow.material_name}}</td>
                                <td class="text-right">{{dRow.qty}}{{dRow.unit_m_kv.kv_name}}</td>
                                <td class="text-right">{{priceFormat(dRow.price)}}</td>
                                <td class="text-right">{{priceFormat(dRow.total_price)}}</td>
                                <td><p v-if="isEmpty(dRow.t_project_id)">{{dRow.t_project.name}}</p></td>
                                <td>{{dateFormat(dRow.due_date)}}</td>
                                <td><p style="white-space: pre-wrap;">{{dRow.slip_memo}}</p></td>
                                <td>
                                    <div class="text-success" v-if="dRow.approved">承認済</div>
                                    <div v-else>未承認</div>
                                </td>
                                <td>
                                    <button type="button" class="btn btn-success" @click.prevent="approve">承認</button> 
                                    <!-- <button type="button" class="btn btn-danger" @click.prevent="test">不可</button> -->
                                </td>                                    
                            </tr>
                        </tbody>
                    </table>             
                </div>          
            </div> 
        </div>
    </div>                 
</template>

<script>
import PageMixins from '../../../mixins/commons/PageMixins';
import DayJsEx from "./../../../frameworks/DayJsEx" ;

export default {
    mixins : [PageMixins] , 
    data : function() {
        return {
            apiName : "tPOrderDetail" ,
            dRow : {
                t_p_order:{
                    supplier_m_customer:{},
                    m_branch:{},
                },
            } ,
        }
    } ,
    computed : {
        isNew : function (){
            return this.$route.params.id === undefined ;
        } ,
        isShow : function (){
            return this.isNew || this.dRow.id > 0 ;
        } ,
        endpoint : function (){
            let ep = `${this.appUrl}/api/${this.apiName}` ;
            if ( !this.isNew ) ep += `/${this.$route.params.id}` ;
            return ep ;
        } ,
    } ,
    methods : {
        getData : async function () {
            try {
                const res = await axios.get(this.endpoint) ;
                this.dRow = res.data ;
            } catch (error) {
                // handle error
                const {
                    status,
                    statusText
                } = error.response ;

                console.error(`Error! HTTP Status: ${status} ${statusText} ${this.endpoint}`) ;
            }
        } ,
        isEmpty : function (value) {
            if (value==null) return false ;
            return true ;
        },
        dateFormat : function(value) {
            if(value) return DayJsEx.format(value , "YYYY-MM-DD") ;
        },
        priceFormat : function(value) {
            var integerValue = parseInt(value);
            return integerValue.toLocaleString() +　"円";
        },
        approve : async function() {            
            if(! confirm('承認状態を変更してもよろしいですか?')) return ;
            try {
                const list = this.dRow ;
                list.approved = 1 ;
                list.approved_at = DayJsEx.format(new Date() , "YYYY-MM-DD") ;
                console.log(JSON.stringify(list))
                await axios.put(this.endpoint,list) ;
            } catch (error) {
                // handle error
                const {
                    status,
                    statusText
                } = error.response;

                console.error(`Error! HTTP Status: ${status} ${statusText} ${this.endpoint}`);
            }
        }
    } ,
    created : function () {
        
        if ( ! this.isNew) this.getData()  ; 
        
    }
}
</script>