<template>
    <div>
        {{cSelectedItem}}
        <select class="custom-select" :placeholder="placeholder"
                :class="inputClass"
                v-model="dLocalSelectedId"
                :disabled="disabled"
                @change="changed">
            <option disabled value="">Please select one</option>
            <option value="0"></option>
            <option :value="n.id" v-for="n in kvs" :key="n.id">{{ n.kv_name }}</option>
        </select>
    </div>
</template>

<script>
import MasterSelectMixins from "./../../../mixins/commons/MasterSelectMixins" ;
import MasterUtil from "./../../../frameworks/MasterRefUtil" ;

export default {
    mixins : [MasterSelectMixins] ,
    data : function() {
        return {
        }
    } ,
    props : {
        // 選択肢が1件のみの場合強制選択
        isSelectIfListIsOne : 
        {
            type : Boolean ,
            default : false 
                
        }  ,
        
        kvKey : {
            type : String,
        } ,
        kvCategoryId : {
            type : Number,
            default : () => 0
        } ,
        /**
         * g_01でのフィルタ
         */
        g01 : {
            type : String , 
            default : () => "" ,
        } ,
        disabled : {
            Type : Boolean ,
            default : () => false ,
        } ,
    } ,
    watch : {
        kvCategoryId : {
            immediate: true,
            handler : MasterUtil.clearSelectedValue,
        } ,
    } ,
    computed : {
        kvs : function() {
            if ( this.mainStore.masters.MKvCategories.length === 0 ) return [] ;

            let category = undefined ;
            if ( this.kvCategoryId !== undefined && this.kvCategoryId != 0 ) {
                category = this.mainStore.masters.MKvCategories.find(e => e.id == this.kvCategoryId) ;
            } else {
                category = this.mainStore.masters.MKvCategories.find(e => e.kv_key == this.kvKey) ;
            }

            if ( category === undefined) return [] ;

            const _this = this ; 

            // Filtered by g_01
            let kvs = category.m_kvs ; 
            if ( this.g01 ){
                kvs = kvs.filter(x => x.g_01 == _this.g01) ; 
            }


            // 選択肢が1件のみ
            if ( this.isSelectIfListIsOne && kvs.length == 1  ) 
            {
                
                const onlyId = kvs[0].id ; 
                if ( this.dLocalSelectedId != onlyId) 
                {
                    this.emitSelectedId(onlyId) ; 
                    this.$emit('update:is-list-only-one', true) ;
                    //this.emitSelectedId(onlyId) ; 
                }
                
            }
            

            return kvs ;
        } ,
        cSelectedItem : function()
        {
            const selectedItem = this.kvs.find(e => e.id === this.dLocalSelectedId) ;
            this.$emit('update:selectedItem', selectedItem) ;
            return "" ;
        }
    } ,
    methods : {
        emitSelectedItem : function(id) {
            //console.log("emitSelectedItems : " + id ) ;
            //const selectedItem = this.kvs.find(e => e.id === id) ;
            //console.log(selectedItem ) ;
            //this.$emit('update:selectedItem', selectedItem) ;
        } ,
    } ,
    created : function() {
    } ,
}
</script>