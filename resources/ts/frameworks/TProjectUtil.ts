import ObjectUtil from "./ObjectUtil";

export default {
    /**
     * 案件の状態名を取得
     * @param tProject
     * @returns
     */
    getStateName : function(tProject:object):string{
        // @ts-ignore
        if (ObjectUtil.isNU(tProject?.ordered_at)) return "案件" ;
        // @ts-ignore
        if (!ObjectUtil.isNU(tProject?.sales_completed_at)) return "売上済" ;

        return "受注" ;
    } ,

    /**
     * 案件の状態テキストクラス取得
     * @param tProject
     * @returns
     */
    getStateTextClasses : function(tProject:object):string{
        // @ts-ignore
        if (ObjectUtil.isNU(tProject?.ordered_at)) return "" ;
        // @ts-ignore
        if (!ObjectUtil.isNU(tProject?.sales_completed_at)) return "text-success" ;

        return "text-info" ;
    }
}