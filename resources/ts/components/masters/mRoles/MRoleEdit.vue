<template>
    <div>        

        <div v-if="cIsError" class="alert alert-danger" role="alert">
            {{dErrorData.message}}
        </div>
        <div class="row" v-if="cIsShow">
            <div class="col-12">
                <form>                        
                    <div class="col-12">
                        <label for="">名称</label>
                        <input v-model="dValue.name" class="form-control">                
                    </div>                    
                    <div class="col-12 mb-3 mt-3" v-for="categories in dCategory" :key="categories.id">
                        <div v-if="categories.m_role_keys.length>0">
                            <button 
                                class="btn btn-link"
                                data-toggle="collapse" 
                                :data-target="'#collapse' + categories.explanation" 
                                :aria-expanded="checked(categories.m_role_keys)" 
                                :aria-controls="'collapse' + categories.explanation" 
                                :id="categories.explanation"
                                >
                                {{categories.explanation}}
                            </button>
                        </div>
                        <div 
                            :id="'collapse' + categories.explanation" 
                            :class="showed(categories.m_role_keys)" 
                            class="collapse app-card-body"
                            >
                            <div v-for="keys in categories.m_role_keys" :key="keys.id">
                                <div class="row px-3 pb-3" v-if="keys.system_flg>0">
                                    <div class="col-12 col-xl-4">
                                        <label class="mt-2" for="">{{keys.explanation}}</label>
                                        <ns-number-input                                                
                                                v-model="keys.control_level"
                                                >
                                        </ns-number-input>
                                    </div>
                                    <div class="col-12 col-xl-8">
                                        <p class="mt-5">{{keys.memo}}</p>
                                    </div>                                    
                                </div>                                
                            </div>
                        </div>
                    </div>
                    <div class="col-12 mt-5">
                        <button type="submit" 
                            class="btn btn-success" 
                            @click.prevent="postData()">保存</button>

                    </div>
                </form>

            </div>

        </div>

    </div>
</template>

<script>
import PageMixins from '../../../mixins/commons/PageMixins'
import _ from "lodash"
export default {
    mixins : [PageMixins] , 
    data :  function() {
        return {
            dApiName  : "mRole",            

            dValue    : {} , 
            dCategory : {} , 
            
            //dOutOfSystem : [] ,
        } 
    } , 
    computed : {
        cIsNew : function () 
        {            
            return this.$route.params.id === undefined ; 
        } ,        
        cIsShow : function () 
        {
            return this.cIsNew || this.dValue.id > 0 ; 
        } , 
        cIsError : function () {
            return this.dErrorStatus !== undefined && this.dErrorStatus !== "" ; 
        } ,  
        cEndpoint : function () 
        {
            let ep =  `api/${this.dApiName}` ;
            
            if ( !this.cIsNew ) ep += `/${this.$route.params.id}` ; 
            return  ep ;
        } ,
        cMRoles : function () {            
             
            const mRoleDetailRows = [] ; 

            const format = this.dCategory.map(function(x){
                const rows = x.m_role_keys.map(function(y){
                    return {
                            id : y.detail_id ,
                            m_role_key_id : y.id ,
                            control_level : y.control_level ,
                    }
                })
                mRoleDetailRows.push(...rows) ;
                return x ;                                
            }) ;
            // const outOfSystemRoles = this.dOutOfSystem.map(function(y){
            //     return {
            //             id : y.detail_id ,
            //             m_role_key_id : y.id ,
            //             control_level : 0 ,
            //     }
            // })
            // mRoleDetailRows.push(...outOfSystemRoles) ;
            
            const mRoleRow = {
                id             : this.dValue.id ,
                name           : this.dValue.name ,
                m_role_details : mRoleDetailRows
            }
            return mRoleRow ;
                                
        },        

    } , 
    methods : {
        checked : function (keys) {
            const status = keys.find(y => y.control_level >0) ;
            if(status) return true
        },
        showed : function (keys) {
            const status = keys.find(y => y.control_level >0) ;
            if(status) return "show"
        },    
        getData : async function () {
            try {
                const ep = `api/mRoleKeyCategory` ;
                const categoryRes  = await axios.get(ep) ;
                const copiedList = _.cloneDeep(categoryRes.data)
                this.categoryFormat(copiedList) ;                             
            }
            catch (error) 
            {
                this.$$errorConsole(error ,this.cEndpoint ) ; 
            }            
        } ,
        categoryFormat : async function (categories) {

            for(const category of categories) {
                for(const key of category.m_role_keys) {
                    key.control_level = 0 ;
                }
            }

            if(!this.cIsNew) {
                //marge
                const roleRes = await axios.get(this.cEndpoint ) ;
                
                //編集の時既定のフォーマットにマージ（新たにキーが追加された場合考慮）
                for(const existRole of roleRes.data.m_role_details) {
                    
                    for(const category of categories) { 
                        const matched = category.m_role_keys.find( e=> e.id == existRole.m_role_key_id) 
                        
                        if( matched !== undefined ) {
                            matched.control_level =  existRole.control_level ;
                            matched.detail_id = existRole.id ;
                        }
                    }                    
                }
                this.dValue = roleRes.data ;
                // const roleList = this.dValue.m_role_details.map(function(x){
                //    _this.dCategory = categories.map(function(y){
                //         y.m_role_keys.map(function(z){
                //             if(z.id == x.m_role_key_id){
                //                 z.control_level =  x.control_level ;
                //                 z.detail_id = x.id ;
                //             }
                //         })
                //         return y
                //     })
                //     return x
                // })
            } 
            this.dCategory = categories

            // else {
            //     list = categories.map(function(x){
            //         x.m_role_keys.map(function(y){
            //             y.control_level = 0 ;
            //         }) ;
            //         return x
            //     }) ;
            //     //console.log(list)
            // }  
            
            //system_flg無効排除
            // this.dCategory = list.map(function(x){
            //     const found = x.m_role_keys.find(z => z.system_flg > 0) ;
            //     const notFound = x.m_role_keys.find(z => z.system_flg === 0)

            //     //権限外退避
            //     if(found===undefined) _this.dOutOfSystem.push(notFound) ;

            //     const foundIndex = x.m_role_keys.indexOf(found) ;
            //     if(foundIndex != 0 ) x.m_role_keys.splice(foundIndex ,1) ;            
            //     return x ;
            // })
        },
        postData : async function () {
             try {                
                let res ;
                if ( this.cIsNew )
                {
                    res = await axios.post(this.cEndpoint ,this.cMRoles ) ;
                    this.mainStore.masters.MRoles.push(res.data) ; 

                    this.$router.push({ path: '..'  , append:true }) ;      
                }
                else
                {                    
                    res = await axios.put(this.cEndpoint ,this.cMRoles) ;
                    const updated  = this.mainStore.masters.MRoles.find(e => e.id === res.data.id ) ; 
                    const updatedIndex = this.mainStore.masters.MRoles.indexOf(updated) ; 
                    //console.log(updated) ; 
                    if ( updatedIndex != -1 ){                        
                        this.mainStore.masters.MRoles.splice(updatedIndex, 1, res.data)
                    }   
                    this.$router.push({ path: '../..'  , append:true }) ;  
                }
                
            } catch (error)  {
                // handle error
                this.$$errorConsole(error ,this.cEndpoint ) ; 
                
            }
        } ,      

    } , 
    created : function () 
    {
        this.getData()  ; 
        
    }
    
}
</script>