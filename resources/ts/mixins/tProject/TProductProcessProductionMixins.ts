import Vue from "vue"

export default Vue.extend ({
    data : function(){
        return {
            dValue : {} ,
        }
    },
    computed : {
    },
    methods : {
        m$getValue : function(colName:string)
        {
            // @ts-ignore
            return this.dValue[colName] ;
        } ,
        m$setValue : function(colName:string, val:any)
        {
            this.$set(this.dValue, colName, val) ;
        } ,
    } ,
    created : function() {
    }
});