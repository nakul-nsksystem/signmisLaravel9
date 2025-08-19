<template> 
    
    <div>
        <div class="table-responsive">
            <table class="table table-dark">
                <thead>
                    <th>発注id/明細id</th>
                    <!-- <th>名称</th> -->
                    <th>発注日</th>
                    <th>&nbsp;</th>                
                </thead>
                <tbody>
                    <tr v-for="n in cTPOrderDs" :key="n.id">
                        <td>
                            <a :href='"v#/t_p_order/edit/"+n.t_p_order_id'>{{n.t_p_order_id}}</a><br>
                            <span>{{n.id}}</span>                            
                        </td>
                        <!-- <td>
                            {{n.material_name}}
                        </td> -->
                        <td>
                            {{dateFormat(n.t_p_order.order_date)}}
                        </td>
                        <td>
                            <button type="button" class="btn btn-danger" @click.prevent="destroy(n.id)">
                                <i class="fas fa-trash fa-fw"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>                      
            </table>
            <div class="form-group d-flex">
                <select class="form-control pl-1" v-model="dSelectedId">
                    <option value="0"></option>
                    <option :value="n.id" v-for="n in dList" :key="n.id">{{ cDisplayName(n) }}</option>
                </select>
                <span class="ml-auto">
                    <button type="button" class="btn btn-primary ml-1" @click.prevent="add()"><i class="fas fa-plus fa-fw"></i></button>
                </span> 
            </div>
        </div>
    </div>
</template>

<script>
import ObjectUtil from "./../../../../../frameworks/ObjectUtil"
import DayJsEx from "./../../../../../frameworks/DayJsEx"

export default {
    data : function() {
        return {
            dList : [] ,
            dSelectedId : undefined ,
        }
    } ,    
    props : {        
        tProcess : {
            type : Object ,
        } ,
        boardMaterial : {
            type : Object ,
        } ,
    } , 
    watch : {

        'tProcess.display_order_01' : function(val) {
            if ( val !== undefined ) {

                this.getList() ;
            
            }
        } ,
        'tProcess.supplier_m_customer_id' : function(val) {
            if ( val !== undefined ) {

                this.getList() ;
            
            }
        } ,

    } ,
    computed : {
        cTPOrderDs : function(){
            return this.tProcess.t_p_order_details ;
        } ,
        cDisplayName : function () {
            return function (row) {
                // return '発注id：'+ row.t_p_order_id + '\n発注明細id：'+ row.id + '\n' + this.dateFormat(row.t_p_order.order_date) + '\n' + row.material_name ;
                return this.dateFormat(row.t_p_order.order_date) + '\n-\n' + row.po_material_name + '\n-\n' + row.qty + row.unit_m_kv.kv_name + '\n';
            } ;
        } ,
        cSelectedItem : function () {
            const selectedItem = this.dList.find(e => e.id === this.dSelectedId) ;
            return selectedItem ;
        } ,
    } , 
    methods : {
        dateFormat : function(value) {
            if(value === "" || value ===null) return  ;
            return DayJsEx.format(value , "YYYY/MM/DD")
        } ,

        getList : async function(){
            
            try {
                const ep = "api/tPOrderDetail/retrieveWithParent" ;
                const name = this.tProcess.is_01 ? this.tProcess.display_order_01 : "" ;

                //検索する材料id
                let material_id = null ;                      
                // 板の時
                // if(this.boardMaterial) material_id = this.boardMaterial.id ;   
                material_id = this.boardMaterial ? this.boardMaterial.id : null ;   
                
                // 手入力ではない時
                // if(!this.tProcess.is_01) material_id = this.tProcess["m_material_id_01"] ;
                material_id = !this.tProcess.is_01 ? this.tProcess["m_material_id_01"] : null ;
                
                const params = {
                    material_name                : name ,
                    po_material_name             : name ,
                    t_project_product_process_id : 1 , //isNull判定
                    m_material_detail_id         : this.tProcess.is_01 , //isNull判定
                    
                    m_material_detail            : {
                                      m_material : {
                                          id     : material_id ,
                                      }
                    } ,
                    t_p_order                    : {
                         suppllier_m_customer_id : this.tProcess.suppllier_m_customer_id ,
                    }
                }


                // console.log(params)
                // console.log(this.tProcess)
                const res = await axios.post(ep, params) ;
                const resList = ObjectUtil.deepCopyJ( res.data) ;
                for( const resdata of resList) {
                    resdata.t_project_product_process_order_detail = {
                    // t_p_order_detail_id : resList.id ,
                        is_preceding : 1 ,
                    } ;    
                }
                this.dList = resList ;

            } catch (error) {
                this.$$errorConsole(error) ; 
            }
        } ,

        add : function (){
            if(this.tProcess.t_p_order_details.find(x => x.id === this.dSelectedId)) return ;
            this.tProcess.t_p_order_details.push(this.cSelectedItem) ;
        } ,

        destroy : function(id){
            if(! confirm("この発注との紐づけを解除しますか？\n※発注データは削除されません")) return ;
            const found = this.tProcess.t_p_order_details.find(x => x.id === id) ;
            const foundIdx = this.tProcess.t_p_order_details.indexOf(found) ;

            if(foundIdx !== -1 ) {
                this.tProcess.t_p_order_details.splice(foundIdx,1)
            }
        }

    } ,
    created : function(){
        
    }
}
</script>