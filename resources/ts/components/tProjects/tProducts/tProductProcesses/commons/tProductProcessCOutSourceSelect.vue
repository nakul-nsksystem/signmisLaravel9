<template>
    <div class="row" v-show="cIsOutsourceAvailable">
        <div class="pl-3 flex-grow-0 flex-shrink-0 form-group text-center" style="flex-basis:50px;">
            <label>外注 {{cIsOnlyOutsource ? "" : ""}}</label>
            <div>
                <ns-checkbox-input
                    v-model="m$cIsOutsource"
                    :id="`outsourceSelect-cIsOutsource${dRandom}`"
                    />
                
            </div>
            
        </div>

        <div class="col-12 col-xl-7 pl-3" v-show="m$cIsOutsource">
            <div class="form-group">
                <label>外注先</label>
                <m-production-select
                    v-model="m$cOutsourceMProductionId"
                    :m-branch-id="m$cMBranchId"
                    :m-process-category-id="MProcessCategoryId"
                    :m-product-category-id="MProductCategoryId"
                    :is-list-only-one.sync="dIsOnlyOne"
                    :is-outsource="true"
                />
            </div>
        </div>

        <div v-show="m$cIsOutsource && ! cIsInputPriceByMaster"
            class="pl-3 pl-xl-0 flex-grow-0 flex-shrink-0 form-group text-center" 
            style="flex-basis:100px;">
            <label>単価手入力</label>
            <div>
                <ns-checkbox-input
                    v-model="m$cIsOutsourceCostInput"
                    :id="`outsourceSelect-cIsOutsourceCostInput${dRandom}`"
                    />

            </div>
            
        </div>


        
        <div class="col-12 col-xl-2 pl-3 pl-xl-0" v-show="m$cIsOutsource && (cIsInputPriceByMaster || m$cIsOutsourceCostInput)">
            <validation-provider name="単価"
                :vid="`outsourceSelect-cOutsourceCostByInput${dRandom}`" 
                :rules="`${m$cIsEnabled && m$cIsOutsource && (cIsInputPriceByMaster || m$cIsOutsourceCostInput) ? 'required|min_value:1' : ''}`" 
                immediate v-slot="{ errors }">
    

                <div class="form-group">
                    <label>単価 {{cOutsourcePriceUnitName}}</label>
                    <ns-number-input v-model="m$cOutsourceCostByInput" />
                    <span class="validation-error">{{ errors[0] }}</span>
                    
                </div>
            </validation-provider>
        </div>               
    </div>
</template>

<script>
import TProductProcessMixins from "./../../../../../mixins/tProject/TProductProcessMixins" ;
export default {
    mixins : [TProductProcessMixins] ,     
    data : function() {
        return {
            dValue : this.value , 
            dIsOnlyOne : false ,
            
            dRandom : Math.random()  , 
        }
    } ,  
    props : {
        value : {
            type : Object 
        } ,
        MProductCategoryId : {
            type : Number
        }  ,
        MProcessCategoryId :{
            type : Number
        }  ,    
        
    } ,
    computed : {

        // 外注先があるか
        cIsOutsourceAvailable : function() {
            const res = this.cOutsourceMProductions.length > 0  ; 
            if ( ! res ) this.m$cIsOutsource = false ; 

            return res ; 

        } ,
        // 外注先しかない Reactive用
        cIsOnlyOutsource : function(){            
            const isOnlyOutsource = 
                this.cInMProductions.length === 0 && 
                this.cOutsourceMProductions.length > 0  ;
            
            if (isOnlyOutsource)  {
                this.m$cIsOutsource = true ; 
            }
            return isOnlyOutsource; 
        } ,
        // 有効な外注のリスト
        cEnabledOutsourceList : function () {
            const _this = this ; 
            const mProcessCategoryId = this.dValue.m_process_category_id ; 
            const mProcessCategory = this.masterStore.getMProcessCategoryById(mProcessCategoryId) ;  
            if ( _.isNil(mProcessCategory)) return [] ; 
            const list = mProcessCategory.m_process_outsources.filter(function(n)
            {
                const colName = n.enabled_is_column ; 
                if ( colName === undefined || colName == null || colName == "" ) return true ; 

                return _this.dValue[colName] ; 
                
            }) ;

            return list ; 

        } ,
        // 手入力価格か？
        cIsInputPriceByMaster : function() {            
            if (! this.m$cIsOutsource) return false ;

            // マスタ設定
            const finded = this.cEnabledOutsourceList.find(x => ! x.is_price_ref_from_m_production && x.price_column == null) ; 
            const res =  finded !== undefined ;
            if ( res ) this.m$cIsOutsourceCostInput = true ; 
            return res; 
        } ,
        // 手入力単価の単位
        cOutsourcePriceUnitName  : function() {
            if ( this.cEnabledOutsourceList.length === 0 ) return "" ; 

            return "円/" + this.cEnabledOutsourceList[0].unit_name ; 
        } ,
        // 生産先の一覧
        cFilterdMProductions : function() {
            const _this = this ; 

            if ( this.mainStore.masters.MProductions.length === 0 ) return [] ; 

            // Filter by Branch
            let data = this.mainStore.masters.MProductions.filter(e => e.m_branch_id == _this.m$cMBranchId) ;
            if ( data === undefined ) return [] ; 

            // Filter by MProductCategory            
            if ( this.MProductCategoryId !== undefined )
            {
                data = data.filter(function(e) {
                    if ( e.m_product_categories === undefined) return false ; 

                    const finded = e.m_product_categories.find(x => x.id == _this.MProductCategoryId) ; 
                    return  finded !== undefined ; 
                }) ;
                if ( data === undefined ) return [] ; 

            }
            
            
            // Filter by mProcessCategoryId            
            if ( this.MProcessCategoryId !== undefined )
            {
                data = data.filter(function(e) {
                    if ( e.m_process_categories === undefined) return false ; 

                    const finded = e.m_process_categories.find(x => x.id == _this.MProcessCategoryId) ; 
                    return  finded !== undefined ; 
                }) ;
                if ( data === undefined ) return [] ; 

            }         

            return data ; 
        } ,
        // 社内生産先
        cInMProductions : function() {
            const data = this.cFilterdMProductions.filter(
                e => e.m_customer_id === null || e.m_customer_id == 0) ; 
            if ( data === undefined ) return [] ;             

            return data ; 
        } , 

        // 外注先リスト
        cOutsourceMProductions : function() {
            // Filter by Outsource
            const data = this.cFilterdMProductions.filter(
                e => e.m_customer_id !== null && e.m_customer_id !== 0 ) ; 
            if ( data === undefined ) return [] ;             

            return data ; 
        }
        
    }  
} 
</script>