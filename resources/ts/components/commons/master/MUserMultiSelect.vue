<template>
    <div >
        <button 
            type="button" 
            class="btn mr-2 mb-2" 
            v-for="user in list" :key="user.id"            
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
            list : [] ,
            
        }
    } ,    
    props : {
        value : {
            type : Array ,
            default : () => [] , 
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
        // 外部から設定用
        setIds : {
            type : Array ,
            default : () => [] , 
        }
    } , 
    watch : {
        isReadyMasters : function(newVal ,oldVal){
            if ( newVal === undefined) return ; 
            //console.log("isReadyMasters " + newVal + " : " + oldVal) ;
            if ( newVal ) 
            {
                
                this.getList() ; 
            }
        } ,
        filterMBranchIds : {
            immediate: true,
            handler :  function (newVal ,oldVal ) {                
                if ( newVal !== undefined )
                {
                    
                    if ( this.isReadyMasters !== undefined && this.isReadyMasters )
                    {
                        if (oldVal !== undefined && newVal.toString() == oldVal.toString()) return ; 
                        this.getList() ; 
                    }
                    
                }
            }
        } ,
        filterTagKeys : {
            immediate: true,
            handler :  function (newVal ,oldVal ) {                
                if ( newVal !== undefined )
                {
                    
                    if ( this.isReadyMasters !== undefined && this.isReadyMasters )
                    {
                        if (oldVal !== undefined && newVal.toString() == oldVal.toString()) return ; 
                        this.getList() ; 
                    }
                    
                }
            }
        } ,
        // 外部からのSelectedIdの変更感知用
        setIds : {
            immediate : true ,
            handler : function  (newVal ,oldVal ) {
                
                if ( newVal !== undefined )
                {
                    
                    if (oldVal !== undefined && newVal.toString() == oldVal.toString()) return ; 
                    //console.log("setIds " + newVal + " oldValue " + oldVal ) ; 
                    this.updateList() ; 
                }

                
            }
        }
    } , 
    computed : {
        isReadyMasters : function() 
        {
            const users =  this.mainStore.masters.MUsers ;  
            const branches = this.mainStore.masters.MBranches ;

            if ( users.length === 0) return false  ; 
            if ( branches.length === 0) return false  ; 

            //console.log("isReady") ; 
            return true ; 

        } ,
        getClasses : function () 
        {
            
            let thisList = this.list ;             
            if ( thisList.length === 0 ) return ; 
            
            
            return function (id) 
            {
                //console.log("getClasses : " + id )     ; 
                let isActive = false ; 
                const findedUser = thisList.find(x => x.id == id ) ;                 
                
                if ( findedUser !== undefined )  isActive = findedUser.isSelected ; 
                
                // ButtonColor
                let btnClassName = "btn-dark" ; 
                if ( isActive )
                {                    
                    const category = this.mainStore.masters.MKvCategories.find(
                        e => e.kv_key == MKvCatConst.C_MKV_CAT_COLOR) ;
                    if ( category !== undefined )
                    {
                        const mKv = category.m_kvs.find(e => e.id == findedUser.color_m_kv_id) ; 
                        if ( mKv !== undefined )
                        {
                            btnClassName = "btn-" + mKv.kv_name ; 
                        }
                    }
                }
                
                
                const classes = [ btnClassName  , { active:isActive}]; 
                
                return classes ; 

            }
        } ,
    } ,
    methods : {
        select : function (n)  
        {
            
            const idx = this.list.indexOf(n) ;             
            n.isSelected = !n.isSelected ;
            this.list.splice(idx, 1, n) ; 
            
            this.emitSelectedIds() ;
        } ,
        emitSelectedIds : function()
        {
            const filterdList = this.list.filter(x => x.isSelected) ; 
            const selectedIds = filterdList.map(x => x.id ) ; 
            //this.$emit('update:selectedIds', selectedIds)  ;
            this.$emit('input', selectedIds)  ;
            
        } ,
        getList : function () 
        {
            
            if (! this.isReadyMasters ) return false ; 

            const users = this.mainStore.masters.MUsers.filter(x => x.deleted_at == null) ; 
            const branches = this.mainStore.masters.MBranches ; 

            const _this = this ; 
            const _defaultIsSelected  = this.defaultIsSelected ; 
            const _filterMBranchIds = this.filterMBranchIds ; 
            const _filterTagKeys = this.filterTagKeys ; 
            const tempSelectedIds = this.list.filter(x => x.isSelected) ; 
            const selectedIds = tempSelectedIds.map(x => x.id) ; 
            

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

                let isNskUser = false ;

                if(!_this.$$cIsNskDev) {
                    isNskUser = Boolean(x.is_nsk_user) ;
                }
                 
                // Branchに一致するか
                const isContain = _filterMBranchIds.indexOf(x.m_branch_id) !== -1; 
                if ( isContain  && isContainTag && !isNskUser)
                {
                    
                    const findedMBranche = branches.find(b => b.id == x.m_branch_id ) ; 
                    
                    const isSel = selectedIds.indexOf(x.id) !== -1 ? true : _defaultIsSelected ; 

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

            this.list.splice(0) ; 
            Array.prototype.push.apply(this.list, list);
            
            this.emitSelectedIds() ;
        } ,
        updateList : function () 
        {
            
            for(let i = 0; i < this.list.length; i++){
                let x = this.list[i] ; 
                x.isSelected = (this.setIds.indexOf(x.id) !== -1)
            };

            const tempList = this.list.map(x => x) ;  
            this.list = tempList ; 

            this.emitSelectedIds() ;
        } ,
    } ,    
    mounted : function(){
        
    } ,

}
</script>