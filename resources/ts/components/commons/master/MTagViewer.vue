<template>   
    <div>        
        <h5>
            <span :class="getBadgeClasses(n)" :value="n.id" v-for="n  in tags" :key="n.id">{{n.tag_name}}</span>
        </h5>
    </div>
</template>

<script>
import MKvCatConst from "./../../../consts/MKvCategoriesConst" ; 

export default {
    
    data : function() {
        return {
        }
    } ,    
    props : {
        tagCategoryKey :
        {
            type : String ,            
            required: true ,
        } ,
        selected :
        {
            type : Array ,            
            required: true ,
        } ,
    } , 
    computed : {
        tags : function() {
            const result = [] ;

            if ( this.mainStore.masters.MTagCategories.length === 0 ) return result ; 

            const list = this.mainStore.masters.MTagCategories.find(e => e.tag_category_key == this.tagCategoryKey) ;
            if ( list === undefined ) return result ; 

            if( this.selected.length === 0) return result ;

            for(const tag of this.selected) {
                const found = list.m_tags.find(y => y.id === tag.id)
                if(found !== undefined ) result.push(found) ;
            }  

            return result ; 
            
        } ,
        
    } , 
    methods : {
        getBadgeClasses : function(row) {
            let classes = ["badge" , "mr-1"] ; 

            const category = this.mainStore.masters.MKvCategories.find(
                e => e.kv_key == MKvCatConst.C_MKV_CAT_COLOR) ;
            if ( category === undefined ) return classes ; 

            const mKv = category.m_kvs.find(e => e.id == row.tag_color_m_kv_id) ; 
            if ( mKv === undefined ) return classes ; 

            classes.push("badge-" + mKv.kv_name) ; 
            return classes ; 
        }
    } , 
    created : function(){
    } ,

}
</script>
