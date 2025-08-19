<template>
    <div>        
        <p>id = {{$route.params.id}}</p>


            <div class="form-group">
                <label for="inputMBranchId">拠点</label>
                      <!-- // m_branchesの中身を取得 -->
                      <span>{{row.m_branch_id}}</span>
                      <br>
                      <span v-for="n  in mainStore.masters.MBranches" :key="n.id">{{n.name}}</span>
                      

            4444<m-kv-select :kv-key="'m_branches'"></m-kv-select>

            </div>
            <div class="form-group">
                <label for="inputBusinessHoliday">日付</label>
                <span>{{row.day}}</span>
            </div>
            <div class="form-group">
                <label for="inputCalendarNote">名称</label>
                <span>{{row.calendar_note}}</span>
            </div>
            <div class="form-group">
                <label for="inputCategoryMKvId">営業区分コード</label>
                <span>{{row.category_m_kv_id}} <br></span>
                      <!-- // m_kvsの中身を取得 -->
            </div>
    </div>
</template>

<script>
import PageMixins from '../../../mixins/commons/PageMixins';
export default {
    mixins : [PageMixins] , 
    data :  function() {
        return {
            row : { } , 
        } 
    } , 
    computed : {
        isNew : function () 
        {            
            return this.$route.params.id === undefined ; 
        } ,        
        isShow : function () 
        {
            return this.isNew || this.row.id > 0 ; 
        } , 
        endpoint : function () 
        {
            let ep =  `${this.appUrl}/api/mCalendar` ;
            if ( !this.isNew ) ep += `/${this.$route.params.id}` ; 
            
            return  ep ;
        } ,
    } , 
    methods : {        
        getData : async function () {
            try {
                
                const res = await axios.get(this.endpoint ) ; 
                
                this.row = res.data ;  
                
                
            }
            catch (error) 
            {
                console.log(error) ; 
                // handle error
                const {
                    status,
                    statusText
                } = error.response;

                console.error(`Error! HTTP Status: ${status} ${statusText} ${this.endpoint}`);

            }
            
        } ,
        postData : async function () {
             try {

                 let res ; 
                 
                 
                

                 if ( this.isNew )
                 {
                    res = await axios.post(this.endpoint ,this.row ) ; 
                    
                    this.mainStore.masters.MCalendars.push(res.data) ; 

                    this.$router.push({ path: '..'  , append:true }) ;      
                 }
                 else
                 {
                    res = await axios.put(this.endpoint ,this.row) ; 
                    //console.log(res) ; 
                    const updated  = this.mainStore.masters.MCalendars.find(e => e.id === res.data.id ) ; 
                    const updatedIndex = this.mainStore.masters.MCalendars.indexOf(updated) ; 
                    //console.log(updated) ; 
                    if ( updatedIndex != -1 ){                        
                        this.mainStore.masters.MCalendars.splice(updatedIndex, 1, res.data)
                    }  
                    
                    this.$router.push({ path: '../..'  , append:true }) ;  

                 }

                
                //this.row = res.data ;  
                
            }
            catch (error) 
            {
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

    created : function () 
    {
        if ( ! this.isNew) this.getData()  ; 
        
    }
    
}
</script>