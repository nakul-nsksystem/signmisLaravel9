import _ from "lodash";
import DayJsEx from "../../../../../frameworks/DayJsEx";
import { TProjectProductProcess } from "../../../../tProjects/class/models/TProjectProductProcess";
import { ITProductionGroupDef, PdtGrouperAbstract } from "./PdtGrouper";

export class PdtGrouperProject extends PdtGrouperAbstract { 
    /**
     * 定義取得
     */
    public get def():ITProductionGroupDef {
        return PdtGrouperProject.getDef() ; 
    } 

    public static getDef():ITProductionGroupDef {
        return { 
            title : "物件" , 
            target : "project" ,
        } ; 
    
    }

    /**
     * キーの取得
     * @param list 
     * @returns 
     */
    protected getKeys(list:Array<object>):Array<string>
    {
        // @ts-ignore
        const keys = list.map(x => `${x.t_project_product.t_project.cd}-${x.t_project_product.t_project.name}`) ;     
        return keys ; 
    }

    /**
     * キーの値を取得
     * @param process
     */
    public getKey(process:TProjectProductProcess):string{
        // @ts-ignore
        return `${process?.t_project_product?.t_project.cd}-${process.t_project_product.t_project.name}` ; 
    }

    /**
     * キーの内容でlistをFilter
     * @param key 
     * @param list 
     * @returns 
     */
    protected filterByKey(key:string , list:Array<TProjectProductProcess>):Array<TProjectProductProcess>{
        // @ts-ignore
        const filterd = list.filter(x => `${x.t_project_product.t_project.cd}-${x.t_project_product.t_project.name}` === key ) ; 
        return filterd ; 
    }


    /**
     * 変換後のキー
     * @param key 
     * @returns 
     */
    public getConvertedKey(key:string):string{
        return _.isNil( key) ? "-" : key  ; 
    }

    /**
     * 変換後のタイトル
     * @param key 
     * @returns 
     */
     public getConvertedName(key:string):string{
        // @ts-ignore
        return _.isNil( key) ? "-" : key   ; 
    }


}

