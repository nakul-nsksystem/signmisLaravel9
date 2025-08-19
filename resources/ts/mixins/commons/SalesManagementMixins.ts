import MKvsConst from "../../consts/MKvsConst"

export default {
    data : function() {
        return {
        }
    } ,
    computed : {

         /**システムオプション編集可能日付 */
         m$cSmEditableTerm : function():string{
            const kvId = MKvsConst.SmOptions.SalesManagement.EDITABLE_TERM
            //@ts-ignore
            return this.masterStore.getSMOptionValByKeyMKvId(kvId);
        }
    } ,
    methods : {

    } ,

 }