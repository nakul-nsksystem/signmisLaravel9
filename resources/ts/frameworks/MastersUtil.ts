import _ from "lodash";
import { MMaterial } from "../components/masters/class/models/MMaterial";

export default {
    /**
     * MKvのidからMKvCategoryのIDを取得
     * @param val ID
     * @returns MKvCategoryのID
     */
    getMKvCategoryIdById : function (val:number):string
    {
        if (val === undefined || val === 0) return "" ;

        // @ts-ignore
        return Number(val.toString().slice(0, 4)) ;
    } ,

    /**
     * short_nameが設定されていない場合は名称を取得
     * @param val MBranchのレコード
     * @returns short_name もしくは name
     */
    getBranchName : function (val:Object):string
    {
        return this.getNameIfNotValid(val, "short_name", "name") ;
    } ,

    /**
     * short_nameが設定されていない場合は名称を取得
     * @param val MCustomerのレコード
     * @returns short_name もしくは name
     */
    getCustomerName : function (val:Object):string
    {
        return this.getNameIfNotValid(val, "short_name", "name") ;
    } ,

    /**
     * displayNameが設定されていない場合は名称を取得
     * @param val MMaterialのレコード
     * @returns display_name もしくは name
     */
    getMaterialName : function (val:Object|MMaterial|undefined|null):string
    {
        return this.getNameIfNotValid(val, "display_name", "name") ;
    } ,

    /**
     * val から　namesに指定されたプロパティ名に順番にアクセスし、有効な値を返す
     * @param val
     * @param names
     */
    getNameIfNotValid : function(val:object|MMaterial|undefined|null, ... names:Array<string>):string
    {
        if ( _.isNil(val)) return "" ;

        for (const name of names) {
            // @ts-ignore
            if (val[name]) return val[name] ;
        }

        return "" ;
    }
}
