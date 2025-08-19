import Vue from "vue"

export default Vue.extend ({
    data : function() {
        return {
            dLocalSelectedId : 0 ,
        }

    } ,
    props : {

    } ,
    computed : {

        m$cIsNew : function () {
            // @ts-ignore
            return this.$route.params.id === undefined && this.dValue.id === undefined ;
        } ,
        m$cIsShow : function () {
            // @ts-ignore
            return this.m$cIsNew || this.dValue.id > 0 ;
        } ,
        m$cIsError : function () {
            // @ts-ignore
            return this.dErrorStatus !== undefined && this.dErrorStatus !== "" ;
        } ,
        m$cCamelizedTableName : function () {

            if (this.dApiName === undefined) {
                console.error("dApiName is not defined") ;
                return "" ;
            } ;
            // @ts-ignore
            const pluralized = Inflector.pluralize(this.dApiName) ;

            // @ts-ignore
            return Inflector.camelize(pluralized) ;
        },
    } ,
 });