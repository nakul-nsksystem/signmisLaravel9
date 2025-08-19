import Vue from "vue"
import DynamicGetSetComputedMixins from "../commons/DynamicGetSetComputedMixins";

/**
 * Get Set 動的Computed
 */
export default Vue.extend ({
    mixins : [DynamicGetSetComputedMixins ] ,
    data : function() {
        return {
            /**
             * GetValueのメソッド
             *  override
             */
            dGetValueMethodName : "m$getValue"  ,

             /**
              * SetValueのメソッド
              *  override
              */
            dSetValueMethodName : "m$setValue"  ,
        }
    } ,
    props : {
    } ,
    computed : {
    } ,

    beforeCreate() {
    },
});