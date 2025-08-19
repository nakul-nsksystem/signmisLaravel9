<template>
    <div>
        <div class="row">
            <div class="col-12 col-xl-8">
                <div class="form-group">
                    <label >URL</label>
                    <div>
                        <input class="form-control" v-model="dUrl" />
                        
                            
                    </div>
                    
                </div>
            </div>
            <div class="col-12 col-xl-3">
                <button type="button" class="btn btn-primary" 
                    @click.prevent="getToLocal">
                    <i class="fas fa-plus fa-fw"></i>
                    Get
                </button>

            </div>

        </div>
        
    </div>    
</template>


<script>


export default {        
    data : function() {
        return {
            dUrl : "http://192.168.0.94/phpinfo.php" , 
        }         
    } ,
    
    computed : {
        

    } ,
    methods : {
        getToLocal :async function() {
            const url = this.dUrl ; 
            const res = await axios.get(url) ;

            console.log(res) ; 
        } , 
    } ,
    created : function()
    {
        
        
    }
    
} 
</script>