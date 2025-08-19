<template>
    <div >
        <button 
            type="button" 
            class="btn mr-2 mb-2" 
            v-for="user in cList" :key="user.id"            
            :class="getClasses(user.id)"            
            :aria-pressed="user.isSelected" 
            @click.prevent.self="select(user)"             
            >        
            {{user.name}}
        </button>
    </div>
</template>

<script scoped>

import MKvCatConst from "./../../../consts/MKvCategoriesConst" ; 

export default {
    //
    data : function() {
        return {
            
        }
    } ,    
    props : {
        value : {
            type : Array ,
            default : () => [] , 
        } ,
        /**
         * mUserIdのカラム名
         */
        idColName : {
            type : String , 
            require : true 
        } , 
        defaultIsSelected : {
            type : Boolean ,
            default : true ,             
        } ,
        filterMBranchIds : {
            type : Array ,
            default : () => [] , 
        } ,
        filterTagKeys : {
            type : Array ,
            default : () => [] , 
        } ,
        
    } , 
    watch : {
        cIsReadyMasters : function(newVal ,oldVal){
            if ( newVal === undefined) return ; 
            //console.log("cIsReadyMasters " + newVal + " : " + oldVal) ;
            if ( newVal )             {
                
                this.getList() ; 
            }
        } ,
    } , 
    computed : {
        cIsReadyMasters : function() 
        {
            const users =  this.mainStore.masters.MUsers ;  
            const branches = this.mainStore.masters.MBranches ;

            if ( users.length === 0) return false  ; 
            if ( branches.length === 0) return false  ; 

            //console.log("isReady") ; 
            return true ; 

        } ,
        cList : function() { 
            if ( ! this.cIsReadyMasters || this.value === undefined ) return [] ; 
            

            const users = this.mainStore.masters.MUsers.filter(x => x.deleted_at == null) ; ; 
            const branches = this.mainStore.masters.MBranches ; 

            const _this = this ; 
            const _defaultIsSelected  = this.defaultIsSelected ; 
            const _filterMBranchIds = this.filterMBranchIds ; 
            const _filterTagKeys = this.filterTagKeys ;             

            const tempList = users.map(function(x) {

                // Tagキーに一致するか
                let isContainTag = true ; 
                if ( _filterTagKeys.length !== 0 )
                {
                    const filterdTags = x.tags.filter(tag => {
                        return _filterTagKeys.indexOf(tag.tag_key) !== -1; 
                    }) ;
                    isContainTag =  filterdTags.length !== 0 

                }
                 
                // Branchに一致するか
                const isContain = _filterMBranchIds.indexOf(x.m_branch_id) !== -1; 
                if ( isContain  && isContainTag)
                {
                    
                    const findedMBranche = branches.find(b => b.id == x.m_branch_id ) ; 
                    
                    const found = _this.value.find(v => v[_this.idColName] === x.id) ; 
                    const isSel = found !== undefined  ? true : _defaultIsSelected ; 

                    if ( findedMBranche !== undefined)
                    {
                        let row = { 
                            id :x.id ,
                            name:x.full_name ,
                            color_m_kv_id:findedMBranche.color_m_kv_id , 
                            isSelected:isSel} ;
                        return row ; 

                    }
                    
                }
            
            } ); 


            const list = tempList.filter(x => x !== undefined) ; 
            return list ; 

        } , 
    } ,
    methods : {
        select : function (n)  
        {
            n.isSelected = !n.isSelected ;            
            this.emitSelectedIds() ;
        } ,
        
        getClasses : function(id) { 

            let btnClassName = "btn-dark" ; 
            const found = this.value.find(v => v[this.idColName] === id) ; 
            if ( found !== undefined ) { 
                const category = this.mainStore.masters.MKvCategories.find(
                    e => e.kv_key == MKvCatConst.C_MKV_CAT_COLOR) ;
                if ( category !== undefined )
                {
                    const foundUser = this.cList.find(x => x.id === id ) ;                     
                    const mKv = category.m_kvs.find(e => e.id == foundUser.color_m_kv_id) ; 
                    if ( mKv !== undefined )
                    {
                        btnClassName = "btn-" + mKv.kv_name ; 
                    }
                }
            }

            return btnClassName ; 

        } , 
        emitSelectedIds : function()
        {
            const filterdList = this.cList.filter(x => x.isSelected) ;             
            // console.log(filterdList) ; 
            
            const emits = filterdList.map((x) => {
                
                const found = this.value.find(v => v[this.idColName] === x.id) ; 
                const row = {} ; 

                if ( found === undefined){
                    row[this.idColName] = x.id  ; 
                }
                else { 
                    Object.assign(row , found ) ; 
                }                
                
                return row ; 
            }) ; 
            // console.log("emit ids" + JSON.stringify(emits)) ; 

            this.$emit('input', emits)  ;
            
        } ,
    } ,    
    mounted : function(){
        
    } ,

}
</script>