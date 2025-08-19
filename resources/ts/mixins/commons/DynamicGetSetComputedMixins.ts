import Vue from "vue"

/**
 * Get Set 動的Computed
 */
export default Vue.extend ({
    data : function() {
        return {

            /**
             * Get/SetのComputedの配列
             * override
             */
            dComputedGetSetDefs : [] ,

            /**
             * GetterのみのComputedの配列
             * override
             */
            dComputedGetDefs : [] ,

            /**
             * GetValueのメソッド
             * override
             */
            dGetValueMethodName : "getValue" ,

            /**
             * SetValueのメソッド
             * override
             */
            dSetValueMethodName : "setValue" ,
        }
    } ,
    props : {
    } ,
    computed : {
    } ,

    beforeCreate() {
        // @ts-ignore
        const getValueMethodName = this.$options.data().dGetValueMethodName ;
        // @ts-ignore
        const getValueMethod = this.$options.methods[getValueMethodName] ;

        // @ts-ignore
        const setValueMethodName = this.$options.data().dSetValueMethodName ;
        // @ts-ignore
        const setValueMethod = this.$options.methods[setValueMethodName] ;
        // @ts-ignore
        const componentName = this.$options._componentTag ;
        if ( getValueMethod === undefined){
            // @ts-ignore
            console.error(`'dGetValueMethodName'=${getValueMethodName} for DynamicGetSetComputedMixins is not set on '${componentName}'`) ;
            return ;
        }
        if ( setValueMethod === undefined){
            // @ts-ignore
            console.error(`'dSetValueMethodName'=${setValueMethodName} for DynamicGetSetComputedMixins is not set on '${componentName}'`) ;
            return ;
        }

        /** Get Set */
        // @ts-ignore
        const computedGetSetDefs = this.$options.data().dComputedGetSetDefs ;
        // @ts-ignore
        for ( const def of computedGetSetDefs){
            // @ts-ignore
            this.$options.computed = {
                // @ts-ignore
                ...this.$options.computed ,
                [def.key]:{
                    // @ts-ignore
                    get() {return this[getValueMethodName](def.propName) ;} ,
                    // @ts-ignore
                    set(val) {this[setValueMethodName](def.propName, val) ;}
                }
            } ;
        }

        /** Getterのみ */
        // @ts-ignore
        const computedGetDefs = this.$options.data().dComputedGetDefs ;
        // @ts-ignore
        for ( const def of computedGetDefs){
            // @ts-ignore
            this.$options.computed = {
                // @ts-ignore
                ...this.$options.computed ,
                [def.key]:{
                    // @ts-ignore
                    get() {return this[getValueMethodName](def.propName);} ,
                }
            } ;
        }

        // console.log(this.$options.computed) ;
    },
 });