<template>
    <div>
        <div class="row">
            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label >Limit</label>
                    <div>
                        <ns-number-input v-model="dLimit"  />
                    </div>
                    
                </div>
            </div>
            <div class="col-12 col-xl-2">
                <div class="form-group">
                    <label >工程</label>
                    <div>
                        <m-process-category-select 
                          v-model="dMProcessCategoryId" />
                    </div>
                    
                </div>
            </div>
            <div class="col-12 col-xl-3 pt-4">
                <button type="button" class="btn btn-primary" 
                    @click.prevent="getData">
                    <i class="fas fa-plus fa-fw"></i>
                    Get
                </button>

            </div>
            <div class="col-12 col-xl-2 pt-4">
                <button type="button" class="btn btn-info" 
                    @click.prevent="recalc">
                    <i class="fas fa-plus fa-fw"></i>
                    Recalc 
                </button>

            </div>
            <div class="col-12 col-xl-3 pt-4">
                <button type="button" class="btn btn-success" 
                    @click.prevent="save">
                    <i class="fas fa-plus fa-fw"></i>
                    Save
                </button>

            </div>

        </div>

        <div class="col-12">                
            <div class="table-responsive">
                <table class="table table-striped table-dark">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>物件</th>
                            <th>品名</th>
                            <th>工程ID</th>
                            <th>工程</th>
                            <th class="text-right">材料費</th>
                            <th class="text-right">外注費</th>
                            <th class="text-right">作業費</th>
                            <th class="text-right">総原価</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="n in dList" :key="n.id">
                            <td>{{n.id}}</td>
                            <td>
                                <a href="#"
                                    @click.prevent="$$openTProjectEditOnOtherTab(n.t_project_product.t_project_id)">
                                        物件
                                </a>
                            </td>
                            <td >{{n.t_project_product.name}}</td>
                            <td>{{n.m_process_category_id}}</td>
                            <td>{{n.m_process_category.name}}</td>
                            <td class="text-right">{{n.material_cost}}</td>
                            <td class="text-right">{{n.outsource_cost}}</td>
                            <td class="text-right">{{n.work_cost}}</td>
                            <td class="text-right">{{n.total_cost}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
            
            
        
    </div>    
</template>


<script >
import MProcessCategorySelect from '../commons/master/MProcessCategorySelect.vue';
import { TProjectProduct } from '../tProjects/class/models/TProjectProduct';
import { TProjectProductProcess } from '../tProjects/class/models/TProjectProductProcess';


export default {
  components: { MProcessCategorySelect },        
    data : function() {
        return {
            dUrl : "api/tProjectProductProcess/get4updateCost" , 
            dUpdateUrl : "api/tProjectProductProcess/updateList" , 
            dLimit : 100  ,
            dMProcessCategoryId : 0 , 

            dList : [] , 

            dIsLoading : false 
        }         
    } ,
    
    computed : {
        

    } ,
    methods : {
        getData :async function() {
            const url = this.dUrl ; 
            // @ts-ignore
            const res = await axios.post(url , { 
                "limit" :this.dLimit  ,
                "m_process_category_id" : this.dMProcessCategoryId , 
                } ) ;

            const parsedList = [] ; 
            for ( const row of res.data){

                const parsedTProduct = TProjectProduct.parse(row.t_project_product)  ; 
                const parsed = TProjectProductProcess.parse(row , parsedTProduct ) ; 
                // console.log(parsed.TProjectProduct.SqmIncExt) ; 
                parsedList.push(parsed) ; 
            }
            
            this.dList = [...parsedList] ; 
        } , 
        recalc : function() { 
            for ( const row of this.dList){
                row.updateCostAndTime() ; 
            }
        } ,
        save : async function() { 
            const url = this.dUpdateUrl ; 
            this.dIsLoading = true ; 
            try { 
                const res = await axios.post(url , this.dList) ; 
                console.log(res) ; 
            }
            catch (err)  { 
                console.error(err) ; 
            }

            this.dIsLoading = false ; 

            
        } , 
    } ,
    created : function()
    {
        
        
    }
    
} 
</script>