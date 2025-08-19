<template>
    <div>{{cConditions}}
        <select class="custom-select" :placeholder="placeholder" 
                :class="inputClass"
                v-model="dLocalSelectedId"
                :disabled="disabled"
                @change="changed"  >
            <option value="0"></option>
            <option :value="n.id" v-for="n  in cFilterdList" :key="n.id" >
                {{isDisplayName && n.display_name ? n.display_name : n.name}}
            </option>
        </select>
    </div>
    
</template>

<script>

import MasterSelectMixins from "./../../../mixins/commons/MasterSelectMixins" ;
import MasterUtil from "./../../../frameworks/MasterRefUtil" ; 
import { MMaterialService } from '../../masters/class/services/MMaterialService';

export default {
    mixins  : [MasterSelectMixins] ,
    data : function() {
        return {
            dList : []    ,
            dOldConditions : "" ,
        }
    } ,    
    props : {     
        
        // 拠点
        mBranchId : {
            type : Number ,
            default : () => 0 , 
        } ,
        // 仕入先
        supplierMCustomerId  : {
            type : Number ,
            default : () => 0 , 
        } ,
        // カテゴリーID
        categoryMKvId  : {
            type : Number ,
            default : () => 0 , 
        } ,
        // サブカテゴリーID
        subCategoryMKvId  : {
            type : Number ,
            default : () => 0 , 
        } ,        
        // フィルターするタグキー
        filterMTagKeys : 
        {
            type : Array ,
        } ,
        // 選択されていない場合のみ値が入る
        setIdIfEmpty : {
            type : Number ,
            default : () => 0 , 
        } ,
        // 営業用名の表示
        isDisplayName : {
            type : Boolean ,
            default : () => false ,
        } ,
        disabled : {
            Type : Boolean ,
            default : () => false ,
        } ,
        
        
    } , 

    watch : {       
        mBranchId : {
            immediate: true,
            handler : MasterUtil.clearSelectedValue
        } , 
        supplierMCustomerId : {
            immediate: true,
            handler : MasterUtil.clearSelectedValue
        } , 
        categoryMKvId : {
            immediate: true,
            handler : MasterUtil.clearSelectedValue
        } , 
        subCategoryMKvId : {
            immediate: true,
            handler : MasterUtil.clearSelectedValue
        } , 

        setIdIfEmpty : {
            immediate: false,
            handler :  function (newVal ,oldVal ) {     
                //console.log("new:" + newVal + " old:" + oldVal)       ;
                if ( newVal !== undefined )
                {
                    {                  
                        //console.log("new:" + newVal + " old:" + oldVal)       ;
                        if (oldVal !== undefined && newVal.toString() == oldVal.toString()) return ;                         

                        //console.log(this.localSelectedId + ":" + newVal) ; 
                        if (this.dLocalSelectedId === 0 )
                        {
                            this.dLocalSelectedId = newVal ; 
                            this.emitSelectedId(newVal ) ; 

                        }
                    }
                    
                }
            }
        }
    } ,
    computed : {     
        cConditions : function() {

            let isFiltered = false ; 

            const conditions = {} ; 

            // Branch
            if ( this.mBranchId != 0 )
            {
                //console.log("this.mBranchId " + this.mBranchId) ; 
                isFiltered = true ; 
                conditions.m_branch_id = this.mBranchId ; 
                //list = list.filter(x => x.m_branch_id == this.mBranchId) ; 
            }
            
            // SupplierMCusteomer
            if ( this.supplierMCustomerId != 0 ){                
                isFiltered = true ; 
                conditions.supplier_m_customer_id = this.supplierMCustomerId ; 
                // list = list.filter(x => x.supplier_m_customer_id == this.supplierMCustomerId) ; 
            }

            // CategoryId
            if ( this.categoryMKvId != 0 ){                
                isFiltered = true ; 
                conditions.category_m_kv_id = this.categoryMKvId ; 
                // list = list.filter(x => x.category_m_kv_id == this.categoryMKvId) ; 
            }

            // SubCategoryId
            if ( this.subCategoryMKvId != 0 ){                
                isFiltered = true ; 
                conditions.sub_category_m_kv_id = this.subCategoryMKvId ; 
                // list = list.filter(x => x.sub_category_m_kv_id == this.subCategoryMKvId) ; 
            }

            // Filter by MTagKey
            //console.log(this.filterMTagKeys) ; 
            if ( this.filterMTagKeys !== undefined &&  this.filterMTagKeys.length !== 0 ){                
                isFiltered = true ; 
                conditions.tagKeys = this.filterMTagKeys ; 
                // console.log("conditions") ;
                // console.log(JSON.stringify(conditions)) ;
                //list = list.filter(e => e.m_tags.some(tag => this.filterMTagKeys.indexOf(tag.tag_key) !== -1 )) ; 
            }

            if ( ! isFiltered ) return "" ;        

            const stringfyConditions = JSON.stringify(conditions) ; 
            // console.log(`now condition :${stringfyConditions} pld :${this.dOldConditions}`) ; 
            
            if ( stringfyConditions != this.dOldConditions){
                // console.log("diff") ; 
                // console.log(`${stringfyConditions}`) ; 
                // console.log(`${this.dOldConditions}`) ; 
                this.dOldConditions = stringfyConditions; 
                this.getData(conditions) ;

            }
            else
            {
                // console.log("same") ; 
            }
            

            return "" ; 
            
        } , 
        cFilterdList : function() 
        {
            return this.dList ; 
        }
    } ,
    methods : {
        getData : async function(conditions) {
            // const ep = `${this.cEp}retrieveWithDetails` ; 
            try {
                //console.log(JSON.stringify(conditions)) ; 
                // const res = await axios.post(ep , conditions) ;
                // this.dList = res.data ; 

                this.dList = await MMaterialService.retrieveWithDetails(conditions) ; 

                const finded = this.dList.find(x => x.id == this.dLocalSelectedId) ; 
                this.emitSelectedItem( this.dLocalSelectedId) ; 

            }
            catch (error ) {
                // this.$$errorConsole(error ,ep) ; 
                this.$$errorConsole(error ,"") ; 
                
                this.dList = [] ; 
            }
            
        } ,
        emitSelectedItem : async function(id){
            
            
            if ( id == 0 ) {
                this.$emit('update:selectedItem', undefined ) ;                
                return ; 
            }

            try {                
                // const materialRes = await axios.get(ep) ;                 
                // const row = materialRes.data ; 
                const row = await MMaterialService.getById(id) ;                 
                this.$emit('update:selectedItem', row ) ;
                
            }
            catch (error) 
            {                
                this.$emit('update:selectedItem', undefined) ;                
                this.$$errorConsole(error ,error.ep) ; 
                
            }            

            
        } ,
    } ,    
    created : function(){
    } ,

}

</script>