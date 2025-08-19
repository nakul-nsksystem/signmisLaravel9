<template>
    
    <div>
        <p>id = {{$route.params.id}}</p>
        <p>name = {{dRow.name}}</p>
        <div>
            <p>詳細</p>
            <div v-for="n in dRow.m_role_details" :key="n.id">
                <p v-if="n.control_level>0">{{n.m_role_key.explanation}}{{n.control_level}}</p>
            
            </div>
        </div>
    </div>


</template>

<script>
import PageMixins from '../../../mixins/commons/PageMixins';
export default {
    mixins : [PageMixins] , 
    data :  function() {
        return {
            dRow : {
            } , 
        } 
    } , 
    computed : {
        cIsNew : function () {            
            return this.$route.params.id === undefined ; 
        } ,        
        cIsShow : function () {
            return this.cIsNew || this.dRow.id > 0 ; 
        } ,      
        cEndpoint : function () {

            let ep =  `api/mRole` ;
            
            if ( !this.cIsNew ) ep += `/${this.$route.params.id}` ; 
            return  ep ;
        } ,
        cIsError : function () {
            return this.dErrorStatus !== undefined && this.dErrorStatus !== "" ; 
        } ,
    },
    methods : {        
        getData : async function () {
            try {
                
                const res = await axios.get(this.cEndpoint ) ; 
                this.dRow = res.data ;                  
                
            } catch (error)  {
                this.$$errorConsole(error ,this.cEndpoint ) ;

            }
            
        } ,
    } , 
    created : function () {
        
        if ( ! this.cIsNew) this.getData()  ; 
        
    }

    
}

</script>