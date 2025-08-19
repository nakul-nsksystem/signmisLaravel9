<template>   
    <div>
        <select
            class="custom-select" 
            :class="inputClass"
            :placeholder="placeholder" 
            v-model="dLocalSelectedId"
            @change="changed"
        >
            <option value="0"></option>
            <option :value="n.id" v-for="n in dList" :key="n.id">{{ cDisplayName(n) }}</option>
        </select>
        {{ cSelectedItem }}
    </div>
</template>

<script>
import MasterSelectMixins from "./../../../mixins/commons/MasterSelectMixins" ;

export default {
    mixins  : [MasterSelectMixins] ,
    data : function() {
        return {
            dList : [] ,
        }
    } ,    
    props : {        
        /**
         * 拠点フィルタリング
         */
        mBranchId : {
            type : Number ,
            default : () => 0 ,
        } ,
        /**
         * 拠点フィルタリング
         * ※ 複数の拠点パターン 
         */
        mBranchIds : {
            type : Array ,            
            default : () => [] ,
        } ,
        // 取引区分 1:売 2:買
        dealingCds : {
            type : Array ,
            required : true ,
        } ,

        //タグ
        filterMTagKeys : 
        {
            type : Array ,
            default : () => []
        } ,
    } , 
    watch : {        
        mBranchId : {
             immediate: true ,
             handler : function (newVal, oldVal) 
             {
                if ( newVal !== undefined ) {
                    if ( oldVal !== undefined && oldVal != 0 ) {
                        this.emitSelectedId(0) ;
                    }

                    this.getList() ;
                }
            } , 
        } ,
        
        mBranchIds : {
             immediate: true ,
             handler : function (newVal, oldVal) 
             {
                if ( newVal !== undefined ) {
                    if ( oldVal !== undefined && oldVal != 0 ) {
                        this.emitSelectedId(0) ;
                    }

                    this.getList() ;
                }
            } , 
        } ,
    } ,
    computed : {
        cEndpoint : function () {
            const branchIds = ( this.mBranchIds.length === 0 ? this.mBranchId : this.mBranchIds ); 
            let ep =  `api/mCustomer/fBaD/${branchIds}/${this.cDealingMKvIds}/` ;
            
            //let ep =  `api/mCustomer/fBaD/${this.mBranchId}/${this.cDealingMKvIds}` ;
            //console.log(ep) ; 
            return  ep ;
        } ,
        cDealingMKvIds : function () {
            if ( this.dealingCds === undefined) return [] ;
            const rtn = this.dealingCds.map(x => x + 1010000) ;
            return rtn ;
        } ,        
        cSelectedItem : function () {
            const selectedItem = this.dList.find(e => e.id === this.dLocalSelectedId) ;
            this.$emit('update:selectedItem', selectedItem) ;
            return "" ;
        } ,
        cDisplayName : function () {
            return function (node) {
                // 略称が設定されている場合は略称を表示
                return node?.short_name ?? node?.name ;
            } ;
        } ,
    } , 
    methods : {
        emitSelectedItem : function (id) {
            this.$emit('update:selectedItem', this.dList.find(e => e.id === id)) ;
        } ,
        getList :async function () {            
            if ( this.mBranchId === undefined &&  this.mBranchIds.length === 0) return [] ; 
            if ( this.dealingCds === undefined) return [] ; 
            try {                   
                const res = await axios.get(this.cEndpoint) ;
                
                let resList = res.data ;

                //tagフィルタ
                if ( this.filterMTagKeys.length !== 0 ) {
                    resList = resList.filter(e => e.m_tags.some(tag => this.filterMTagKeys.indexOf(tag.tag_key) !== -1 )) ;

                }
                this.dList = resList ;
            } catch (error) {
                this.$$errorConsole(error, this.cEndpoint) ;
            }
        }
    } ,    
    mounted : function() {
    } ,
}
</script>