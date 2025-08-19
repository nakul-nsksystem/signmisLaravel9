<template>
    <div>                   
        <div class="app-contents-container">
            <div class="dRow">
                <div class="col-12">                        
                    <p class="h3">発注先：{{dRow.t_p_order.supplier.name}}</p><br>
                    <p class="h4">発注明細ID：{{$route.params.id}}<br>
                        依頼日：{{dateFormat(dRow.created_at)}}
                    </p><br>
                    <table class="table table-bordered text-white">
                        <thead class="thead-light">
                            <tr>
                                <th scope="col">品番/名称</th>
                                <th scope="col">単価</th>
                                <th scope="col">数量</th>
                                <th scope="col">金額</th>                               
                                <th scope="col">status</th>                            
                                <th scope="col">承認</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{dRow.po_material_name}}</td>                                                                
                                <td>{{m$cPriceFormat(dRow.price)}}</td>
                                <td type="text-right">{{dRow.qty}}<p v-if="!m$cIsEmpty(dRow.m_material_detail_id)">{{dRow.unit_m_kv.kv_name}}</p></td>
                                <td>{{m$cPriceFormat(dRow.total_price)}}</td>
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
                    <br><br>
                    <p class="h4">詳細情報</p><br>
                    <table class="table table-bordered text-white">
                        <thead class="thead-light">
                            <tr>                            
                                <th scope="col">物件</th>
                                <th scope="col">納期</th>
                                <th scope="col">明細備考</th>
                                <th scope="col">発注備考</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><p v-if="!m$cIsEmpty(dRow.t_project_id)">{{dRow.t_project.name}}</p></td>
                                <td>{{dateFormat(dRow.due_date)}}</td>
                                <td>{{dRow.memo}}</td>
                                <td>{{}}</td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- <label>備考</label>
                    <textarea class="form-control"></textarea>  -->
                </div>
                <div class="col text-right mt-2">               
                </div>              
            </div>          
        </div> 
    </div>                 
</template>

<script>
import PageMixins from '../../mixins/commons/PageMixins';
import TPOrderMixins from "./mixins/TPOrderMixins"
import DayJsEx from "./../../frameworks/DayJsEx" ;

export default {
    mixins : [PageMixins,TPOrderMixins] , 
    data : function() {
        return {
            apiName : "tPOrderDetail" ,
            dRow : {} ,
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
        dateFormat : function(value) {
            return DayJsEx.format(value , "YYYY-MM-DD")
        },
        approve : async function() {            
            if(! confirm('承認状態を変更してもよろしいですか?')) return ;
            try {
                const list = this.dRow ;
                list.approved = 1 ;
                list.approved_at = DayJsEx.format(new Date() , "YYYY-MM-DD") ;
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