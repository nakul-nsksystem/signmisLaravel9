<template>

    <div>
        <div v-if="$$cIsError" class="alert alert-danger" role="alert">
            {{dErrorData.message}}
        </div>
        <div class="row">
            <div class="col-12">
                <div class="card bg-dark">
                    <div class="card-header">
                        <qr-code-reader-component
                            @getQRData="dQRData = $event"/>
                    </div>  
                    <div class="card-body">
                        <div v-show="dMessage" class="alert alert-success" role="alert">
                            {{dMessage}}
                        </div>
                        <t-p-order-edit-component
                            v-model="dList"
                            :is-q-r="true"
                            @ordered="ordered"
                            />

                    </div> 
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PageMixins from '../../mixins/commons/PageMixins';
import TPOrderMixins from './mixins/TPOrderMixins'
import DayJsEx from "./../../frameworks/DayJsEx" ;


export default {
    mixins : [PageMixins,TPOrderMixins] , 
    data : function(){
        return {

            dApiName : "tPOrder" ,

            dList : [] ,

            
            dOrderDate : new Date(),

            dLoading : false ,

            dQRData : undefined ,

            dMessage: undefined ,


        }
    },
    watch : {
        dQRData : {
            immediate : false ,
            handler : function (newVal, oldVal) 
            {
                if ( newVal !== undefined && newVal !== oldVal ) {

                    this.getData() ;

                }
            } , 
        } ,        

    } ,
    computed:{
        cEndpoint : function () {
            let ep =  `api/mMaterialDetail/showWithParent` ;

            if ( this.dQRData ) ep += `/${this.dQRData}` ; 
            return ep ;
        } , 
        cLoginUser : function(){
            return this.mainStore.loginMUser ;
        } ,

        
    },

    methods:{
        getData: async function(){

            //同じ商品の場合、get回避
            const duplicated = this.dList.find(x => x.t_p_order_details.m_material_detail_id == this.dQRData) 
            if(duplicated) return ;

            try {
                const res = await axios.get(this.cEndpoint) ;
                const resList = res.data ;

                this.formatMMaterialDs(resList)

            } catch (error) {
                // handle error
                this.$$errorConsole(error , this.cEndpoint ) ; 
            }
        } ,
        formatMMaterialDs : function(mMaterialDs){

            const formatedOrderDate = this.dateFormat(this.dOrderDate);
            const row = {
                m_branch_id            : mMaterialDs.m_material.m_branch_id,
                supplier_m_customer_id : mMaterialDs.m_material.supplier_m_customer_id,
                m_user_id              : this.cLoginUser.id,
                order_date             : formatedOrderDate,
                supplier               : mMaterialDs.m_material.supplier,
                m_branch               : mMaterialDs.m_material.m_branch,
                category_m_kv          : mMaterialDs.m_material.category_m_kv ,
                sub_category_m_kv      : mMaterialDs.m_material.sub_category_m_kv ,
                user                   : this.cLoginUser ,
                isChecked              : false ,
                slip_memo              : null,

                t_p_order_details      : {
                    is_able_to_input_size : mMaterialDs.is_able_to_input_size ,
                    is_display_price      : 0 ,
                    m_material_detail_id  : mMaterialDs.id,
                    material_name         : mMaterialDs.m_material.name,
                    po_material_name      : mMaterialDs.m_material.name,
                    unit_m_kv_id          : mMaterialDs.unit_m_kv_id,
                    size                  : mMaterialDs.detail_name,
                    material_size_x       : mMaterialDs.width,
                    material_size_y       : mMaterialDs.height,
                    shipping_address      : null,
                    //納期を発注日の翌日にデフォルトセット
                    due_date              : this.m$addDay(formatedOrderDate,1) ,
                    price                 : mMaterialDs.unit_price,
                    total_price           : 0,
                    qty                   : 1,
                    t_project_id          : null,
                    unit_m_kv             : mMaterialDs.unit_m_kv,
                    slip_memo             : null,
                    approved              : 0,
                },

            }

            this.dList.push(row) ;
        } ,
        dateFormat : function(value) {
            return DayJsEx.format(value , "YYYY-MM-DD")
        },

        //発注処理が行われたあと
        ordered : function(res) {

            const names = []

            for(const tPOrder of res) {

                //メール送信時のアドレス不適エラーの警告文を出す
                this.m$showWarnings(tPOrder) ;

                //表示用名称配列作成
                const map = tPOrder.t_p_order_details.map(x => x.po_material_name) ;
                names.push(...map) ;
            }
            this.dMessage = names + "を発注しました"
            this.dList = [] ;
            this.dQRData = undefined ;
            
            //5秒後にアラート消す
            setTimeout(() => {
                this.dMessage = undefined ;
            } , 5000) ;
            
        }
        
    },

}
</script>