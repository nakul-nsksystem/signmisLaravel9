import _ from "lodash";
import DayJsEx from "../../../../../frameworks/DayJsEx";
import { TProjectProductProcess } from "../../../../tProjects/class/models/TProjectProductProcess";
import { ITProductionGroupDef, PdtGrouperAbstract } from "./PdtGrouper";

export abstract class PdtGrouperMaterialAbstract extends PdtGrouperAbstract { 

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


export class PdtGrouperMaterial extends PdtGrouperMaterialAbstract { 

    /**
     * 定義取得
     */
     public get def():ITProductionGroupDef {
        return PdtGrouperMaterial.getDef() ; 
    } 

    public static getDef():ITProductionGroupDef {
        return { 
            title : "メディア" , 
            target : "material" ,
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
        const keys = list.map(x => x.t_project_product.main_material?.name) ;     
        return keys ; 
    }

    /**
     * キーの値を取得
     * @param process
     */
    public getKey(process:TProjectProductProcess):string{
        // @ts-ignore
        return process.t_project_product.main_material?.name ; 
    }

    /**
     * キーの内容でlistをFilter
     * @param key 
     * @param list 
     * @returns 
     */
    protected filterByKey(key:string , list:Array<TProjectProductProcess>):Array<TProjectProductProcess>{
        // @ts-ignore
        const filterd = list.filter(x => x.t_project_product.main_material?.name === key ) ; 
        
        return filterd ; 
    }

}


export class PdtGrouperLami extends PdtGrouperMaterialAbstract { 
    

    /**
     * 定義取得
     */
     public get def():ITProductionGroupDef {
        return PdtGrouperLami.getDef() ; 
    } 

    public static getDef():ITProductionGroupDef {
        return { 
            title : "ラミ" , 
            target : "lami" ,
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
        const keys = list.map(x => x.t_project_product.lami_material?.name) ;     
        return keys ; 
    }

    /**
     * キーの値を取得
     * @param process
     */
     public getKey(process:TProjectProductProcess):string{
        // @ts-ignore
        return process.t_project_product.lami_material?.name ; 
    }
    

    /**
     * キーの内容でlistをFilter
     * @param key 
     * @param list 
     * @returns 
     */
    protected filterByKey(key:string , list:Array<TProjectProductProcess>):Array<TProjectProductProcess>{
        // @ts-ignore
        const filterd = list.filter(x => x.t_project_product.lami_material?.name === key ) ; 
        
        return filterd ; 
    }




}


