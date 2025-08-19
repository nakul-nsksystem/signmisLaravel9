<template>
    <div>        
        <div v-show="cIsError" class="alert alert-danger" role="alert">
            {{dErrorData.message}}
        </div>
        
        <validation-observer v-slot="{ invalid }" >
            <form v-if="isShow">
                <!-- <div class="form-group">
                    <label for="inputOrderNo">表示順</label>
                    <input v-model="dRow.order_no" class="form-control" id="inputOrderNo"  placeholder="">                
                </div> -->
                
                <div class="form-group">
                    <label class="w-100" >サムネイル</label>
                    <ns-image-select 
                        :url.sync="cThumbnailPath" 
                        :file.sync="dFile"
                        :is-changed.sync="dIsChangedThumbnail"
                    />
                </div>
                
                <validation-provider name="コード" rules="required|alpha_num|max:5" immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label for="inputCd">コード</label>
                        <input v-model="dRow.cd" class="form-control" id="inputCd" placeholder="英数字のみ、5文字以内">
                        <!-- エラー時のメッセージを表示 -->
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
                <validation-provider name="名字" rules="required|min:1" immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label for="inputName">名字</label>
                        <input v-model="dRow.last_name" class="form-control" id="inputLastName" placeholder="名字を入力してください">
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
                <validation-provider name="名前" rules="required|min:1" immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label for="inputName">名前</label>
                        <input v-model="dRow.first_name" class="form-control" id="inputFirstName" placeholder="名前を入力してください">
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
                <validation-provider name="Email" rules="required|email" immediate id="confirmation" v-slot="{ errors }">
                    <div class="form-group">
                        <label for="inputEmailat">Email</label>
                        <input v-model="dRow.email" class="form-control" id="inputEmailat" placeholder="メールアドレスを入力してください">
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
                <validation-provider name="拠点" rules="required|excluded:0" immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label>拠点</label>
                        <m-branch-select 
                            id="inputMBranchId"
                            v-model="dRow.m_branch_id" 
                            :selected-id.sync="dRow.m_branch_id" 
                            ></m-branch-select> 
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>
                <div class="form-group">
                    <label for="inputTagName">役割</label>
                    <m-tag-select 
                        :tag-category-key="dRoleTagCatKey"
                        :setTagIds="dRow.tags"
                        v-model="cSelectedRoleTagIds"
                        ></m-tag-select>          
                </div>
                <div class="form-group">
                    <label for="inputRoleName">権限</label>                            
                    <m-role-select 
                        :setRoleIds="dRow.roles"
                        v-model="dSelectedRoleIds"
                        ></m-role-select>          
                </div>

                <button type="submit" class="btn btn-success"  :disabled="invalid" @click.prevent="postData()">保存</button>
            </form>
        </validation-observer>

    </div>
</template>

<script>
import PageMixins from '../../../mixins/commons/PageMixins';
import { MUserService } from '../class/services/MUserService';

export default {
    mixins : [PageMixins] , 
    data :  function() {
        return {
            dRow : { } , 
            dApiName : "mUser" ,
            dRoleTagCatKey : "m_users-role" ,
            cSelectedRoleTagIds : [] ,
            dSelectedRoleIds : [] ,

            dFile : null , 
            dIsChangedThumbnail : false , 

        } 
    } , 
    computed : {
        isNew : function () 
        {            
            return this.$route.params.id === undefined ; 
        } ,        
        isShow : function () 
        {
            return this.isNew || this.dRow.id > 0 ; 
        } , 
        cIsError : function () {
            return this.dErrorStatus !== undefined && this.dErrorStatus !== "" ; 
        } ,     
        cEndpoint : function () 
        {

            let ep =  `api/${this.dApiName}` ;
            
            if ( !this.isNew ) ep += `/${this.$route.params.id}` ; 
            return  ep ;
        } ,
        camelizedTableName : function ()
        {
            const pluralized = Inflector.pluralize(this.dApiName)    ; 
            return Inflector.camelize(pluralized); 
        } ,
        cThumbnailPath : { 
            get : function() {
                if ( _.isNil(this.dRow.thumbnail_path)) return "" ; 
                if ( this.dRow.thumbnail_path.indexOf("blob") === 0 ) return this.dRow.thumbnail_path ; 

                return "storage/" + this.dRow.thumbnail_path ; 
            } ,
            set : function(val) {
                //console.log(this.cSalesMUserId) ;
                this.dRow.thumbnail_path = val ; 
            }
        } ,
        
    } , 
    methods : {        
        getData : async function () {
            try {
                
                const res = await axios.get(this.cEndpoint ) ; 
                this.dRow = res.data ;  
                
                
            }
            catch (error) 
            {
                // handle error
                this.$$errorConsole(error ,ep ) ; 
            }
            
        } ,
        postData : async function () {
             try {
                
                this.dRow.tag_links = {} ;
                this.dRow.tag_links[this.dRoleTagCatKey] = this.cSelectedRoleTagIds ; 

                this.dRow.m_role_users = [] ;
                this.dRow.m_role_users = this.dSelectedRoleIds ;


                this.dRow.updated_m_user_id = this.mainStore.loginMUser.id ; 
                this.dRow.full_name = this.dRow.last_name+" "+this.dRow.first_name ; 

                delete this.dRow.thumbnail_path ; 

                let res ; 

                let path = "" ; 
                 
                if ( this.isNew )
                {
                    this.dRow.created_m_user_id = this.mainStore.loginMUser.id; 
                    
                    res = await axios.post(this.cEndpoint ,this.dRow ) ; 
                    
                    this.mainStore.masters[this.camelizedTableName].push(res.data) ; 
                    path = ".." ; 

                    // this.$router.push({ path: '..'  , append:true }) ;      
                }
                else
                {
                    
                    res = await axios.put(this.cEndpoint ,this.dRow) ; 

                    const updated  = this.mainStore.masters[this.camelizedTableName].find(e => e.id === res.data.id ) ; 
                    const updatedIndex = this.mainStore.masters[this.camelizedTableName].indexOf(updated) ; 
                    //console.log(updated) ; 
                    if ( updatedIndex != -1 ){                        
                        this.mainStore.masters[this.camelizedTableName].splice(updatedIndex, 1, res.data)
                    }  
                    
                    path = "../.." ; 
                    

                }

                let data = res.data  ; 

                if ( this.dIsChangedThumbnail ){
                    const formData = new FormData() ; 
                    formData.append("thumbnail" , this.dFile ) ; 
                    data = await MUserService.thumbnailUpload(data.id ,formData ) ; 

                   
                }
                // this.dValue = data ; 
                // this.dIsChangedThumbnail = false ; 

                this.$router.push({ path: path  , append:true }) ;  
                
                //this.dRow = res.data ;  
                
            }
            catch (error) 
            {
                // handle error
                this.$$errorConsole(error ,this.cEndpoint ) ; 
                
            }
            
        } , 
    } , 
    created : function () 
    {
        if ( ! this.isNew) this.getData()  ; 
        
    }
    
}
</script>