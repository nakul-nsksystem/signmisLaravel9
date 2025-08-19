<template>
    <div class="row">
        <div class="col-12">
            <h6 class="flex-grow-1">{{value.m_product_category.name}}</h6>
        </div>
        <div class="col-12" v-if="! value.m_product_category.is_not_input_size_needed">
            <h6 class="">
                W{{cSizeW.toLocaleString()}} x H{{cSizeH.toLocaleString()}} 

            </h6>
        </div>

        <div class="col-12" v-if="! value.m_product_category.is_not_input_size_needed">
            <h6 class="">
                伸ばし 上 : {{value.size_extend_t}} 下 : {{value.size_extend_b}} 左 : {{value.size_extend_l}} 右 : {{value.size_extend_r}}
            </h6>
        </div>
        <div class="col-12" v-if="! value.m_product_category.is_not_input_size_needed">
            <h6 class="">
                制作担当 : {{cOpName}}
            </h6>
        </div>

        <div class="col-12 h5">
            <span :class="getWarrantyBadgeClasses(value)">
                {{getWarrantyMkvName(value)}}
            </span>
            <span :class="getSpecifiedBadgeClasses(value)">
                {{getSpecifiedMkvName(value)}}
            </span>
            <span v-if="value.is_needed_labels_for_fire_prevention" class="badge badge-info">要防炎シール</span>
        </div>
        
    </div>
</template>

<script>
import NumberUtil from '../../../../frameworks/NumberUtil';
import ObjectUtil from '../../../../frameworks/ObjectUtil';

export default {

    data :  function() {
        return {


        } 
    } , 
    props : {
        /**
         * t_project_productsのレコード
         */
        value : {
            type : Object , 
            
        } , 
        
    } ,
    computed : {
        cSizeW : function() { 
            return ObjectUtil.nu2zr(this.value?.size_w) ; 
        } , 
        cSizeH : function() { 
            return ObjectUtil.nu2zr(this.value?.size_h) ; 
        } , 
        cOpName : function(){
            const user = this.masterStore.getMUserById(this.value.operator_m_user_id) ; 
            return user?.full_name ?? "" ;             
        } , 

    } ,
    methods : {

        /**
         * 伸ばし込のサイズW 取得
         */
        getExtendedW : function(row) {
            let val = 0 ; 
            if ( row === undefined)  return val ; 

            val = NumberUtil.invalid2zr(row.size_w) 
                + NumberUtil.invalid2zr(row.size_extend_l) 
                + NumberUtil.invalid2zr(row.size_extend_r)  ;

            return val ; 
        } ,        
        /**
         * 伸ばし込のサイズH 取得
         */
        getExtendedH : function(row) {
            let val = 0 ; 
            if ( row === undefined)  return val ; 

            val = NumberUtil.invalid2zr(row.size_h) 
                + NumberUtil.invalid2zr(row.size_extend_t) 
                + NumberUtil.invalid2zr(row.size_extend_b)  ;

            return val ; 
        } ,

        
        



        /**
         * 保証名
         */
        getWarrantyMkvName : function(n) {
            if ( _.isNil(n?.warranty_m_kv_id)  ) return "" ; 
            const mkv = this.masterStore.getMKvById(n.warranty_m_kv_id) ; 

            return mkv?.kv_name ?? "" ; 
        } , 
        /**
         * 保証のバッジクラス
         */
        getWarrantyBadgeClasses : function(n) {
            if ( _.isNil(n?.warranty_m_kv_id)  ) return [] ; 
            const mkv = this.masterStore.getMKvById(n.warranty_m_kv_id) ; 
            // if ( n?.warranty_m_kv == undefined  ) return [] ; 
            if ( _.isNil(mkv) ) return [] ;  
            return ["badge" ,mkv.g_01] ; 
        } , 
        /**
         * 指定名
         */
        getSpecifiedMkvName : function(n) {
            if ( _.isNil(n?.specified_m_kv_id)  ) return "" ; 
            const mkv = this.masterStore.getMKvById(n.specified_m_kv_id) ; 
            
            return mkv?.kv_name ?? "" ; 
        } , 
        /**
         * 指定のバッジクラス
         */
        getSpecifiedBadgeClasses : function(n) {
            if ( _.isNil(n?.specified_m_kv_id)  ) return [] ; 
            const mkv = this.masterStore.getMKvById(n.specified_m_kv_id) ; 
            if ( _.isNil(mkv) ) return [] ;  
            return ["badge" ,mkv.g_01] ; 
        } , 


        
    }

}
</script>
<style scoped>



</style>