import _ from "lodash";
import DayJsEx from "../../../../../frameworks/DayJsEx";
import { TProjectProductProcess } from "../../../../tProjects/class/models/TProjectProductProcess";
import { ITProductionGroupDef, PdtGrouperAbstract } from "./PdtGrouper";

export class PdtGrouperProcess extends PdtGrouperAbstract { 
    /**
     * 定義取得
     */
    public get def():ITProductionGroupDef {
        return PdtGrouperProcess.getDef() ; 
    } 

    public static getDef():ITProductionGroupDef {
        return { 
            title : "工程" , 
            target : "process" ,
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
        const keys = list.map(x => x.m_process_category.name) ;     
        return keys ; 
    }

    /**
     * キーの値を取得
     * @param process
     */
    public getKey(process:TProjectProductProcess):string{
        // @ts-ignore
        return process.m_process_category.name ; 
    }

    /**
     * キーの内容でlistをFilter
     * @param key 
     * @param list 
     * @returns 
     */
    protected filterByKey(key:string , list:Array<TProjectProductProcess>):Array<TProjectProductProcess>{
        // @ts-ignore
        const filterd = list.filter(x => x.m_process_category.name === key ) ; 
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

