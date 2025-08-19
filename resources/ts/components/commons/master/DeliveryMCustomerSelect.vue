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
import ObjectUtil from "./../../../frameworks/ObjectUtil"
import MasterSelectMixins from "./../../../mixins/commons/MasterSelectMixins" ;

export default {
    mixins  : [MasterSelectMixins] ,
    data : function() {
        return {
            dList : [] ,
        }
    } ,    
    props : {        

        mCustomerId : {
            type : Number ,
            default : ()=> 0 ,
        } ,
        // 取引区分 1:売 2:買
        dealingCds : {
            type : Array ,
            // required : true ,
        } ,
        //納品先or荷主
        isOwner : {
            type : Number|Boolean ,
            required : true ,

        } ,
        searchedIds : {
            type : Array ,
            default : [] ,
        }
    } , 
    watch : {
        mCustomerId : {
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
            let ep =  `api/mCustomer/${this.mCustomerId}` ;
            
            //let ep =  `api/mCustomer/fBaD/${this.mBranchId}/${this.cDealingMKvIds}` ;
            //console.log(ep) ; 
            return  ep ;
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
            
            // if ( this.mBranchId === undefined &&  this.mBranchIds.length === 0) return [] ; 
            // if ( this.dealingCds === undefined) return [] ; 

            if ( this.mCustomerId === undefined || this.mCustomerId == 0) return [] ;
            
            try {

                const res = await axios.get(this.cEndpoint) ;                
                let resList = res.data ; 

                // console.log(resList)


                //client情報
                const clientInfo =  {
                    id              : resList.id ,
                    cd              : resList.cd ,
                    order_no        : resList.order_no ,
                    name            : resList.name ,
                    short_name      : resList.short_name ,
                    zip             : resList.zip ,
                    display_address : resList.display_address ,
                    dealing_m_kv_id : resList.dealing_m_kv_id ,
                    prefectures     : resList.prefectures ,
                    address1        : resList.address1 ,
                    address2        : resList.address2 ,
                    tel             : resList.tel ,
                    fax             : resList.fax ,
                    contact_person  : resList.contact_person ,
                    email           : resList.email ,
                }

                let copy = ObjectUtil.deepCopyJ(resList.delivery_m_customers) ;
                copy = copy.filter(x => x.pivot.is_owner == this.isOwner)

                copy.unshift(clientInfo) ;
                
                this.dList = copy ;
                this.$emit('update:searchedIds', this.dList.map(e => e.id)) ;

            } catch (error) {
                this.$$errorConsole(error, this.cEndpoint) ;
            }
        }
    } ,    
    mounted : function() {
    } ,
}
</script>