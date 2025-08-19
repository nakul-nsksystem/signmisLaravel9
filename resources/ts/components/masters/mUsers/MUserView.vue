<template>
    
    <div>
        <p>ユーザーマスタ - View</p>
        <p>id = {{$route.params.id}}</p>


        <div class="form-group">
                <label for="inputCd"></label>
                <p>cd = {{dRow.cd}}</p>
        </div>
        <div class="form-group">
                <label for="inputFullName"></label>
                <p>名前 = {{dRow.full_name}}</p>                
        </div>
        <div class="form-group">
                <label for="inputMBranchName"></label>
                <p>拠点 = {{dRow.m_branch.short_name}}</p> 
        </div>
        <div class="form-group">
                <label for="inputEmail"></label>
                <p>EMail = {{dRow.email}}</p> 
        </div>
        <div class="form-group">
                <label for="inputTag"></label>
                <p>役割
                    <m-tag-viewer
                        :tag-category-key="'roleTagCatKey'"
                        :selected="dRow.tags"
                        >
                    </m-tag-viewer>
                </p> 
        </div>
    </div>


</template>

<script>
import PageMixins from '../../../mixins/commons/PageMixins';
export default {
    mixins : [PageMixins] , 
    props : {
    } ,
   data :  function() {
        return {
            dRow : {
                m_branch:{},
                tags:[],
            } , 
            errorResponce : {} ,
        } 
    } , 
    computed : {
        cIsNew : function () {            
            return this.$route.params.id === undefined ; 
        } ,        
        cIsShow : function () {
            return this.cIsNew || this.dRow.id > 0 ; 
        } ,      
        endpoint : function () {

            let ep =  `api/mUser` ;
            
            if ( !this.cIsNew ) ep += `/${this.$route.params.id}` ; 
            return  ep ;
        } ,
    },
    methods : {        
        getData : async function () {
            try {
                
                const res = await axios.get(this.endpoint ) ; 
                this.dRow = res.data ;  
                
                
            } catch (error)  {
                console.log(error) ; 
                // handle error
                const {
                    status,
                    statusText
                } = error.response;
                console.error(`Error! HTTP Status: ${status} ${statusText} ${this.endpoint}`);

            }
            
        } ,
    } , 
    created : function () {
        
        if ( ! this.cIsNew) this.getData()  ; 
        
    }

    
}

</script>