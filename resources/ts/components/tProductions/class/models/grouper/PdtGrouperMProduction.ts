import _ from "lodash";
import { TProjectProductProcess } from "../../../../tProjects/class/models/TProjectProductProcess";
import { ITProductionGroupDef, PdtGrouperAbstract } from "./PdtGrouper";
import { useStore } from "../../../../../stores/mainStore";

export abstract class PdtGrouperMProductionAbstract extends PdtGrouperAbstract { 

    /**
     * m_production_の後の文字
     */
    protected abstract get postfix():string ; 

    private store = useStore()

    /**
     * storeのゲッター名
     */
    protected abstract get storeGetterName():string ; 

    protected getTargetCName(row:object) { 
        // @ts-ignore
        const tgtProdNo:string = row.tmp_target_production_no  ;             
        return `m_production_${this.postfix}_id_${tgtProdNo}` ; 
    }

    /**
     * キーの取得
     * @param list 
     * @returns 
     */
    protected getKeys(list:Array<object>):Array<string>
    {
        // @ts-ignore        
        const keys = list.map(x => x[this.getTargetCName(x)]) ;              
        return keys ; 
    }

     
    /**
     * キーの値を取得
     * @param process
     */
    public getKey(process:TProjectProductProcess):string{
        // @ts-ignore
        return process[this.getTargetCName(process)] ; 
    }
    
 
     /**
      * キーの内容でlistをFilter
      * @param key 
      * @param list 
      * @returns 
      */
    protected filterByKey(key:string , list:Array<TProjectProductProcess>):Array<TProjectProductProcess>{
        // @ts-ignore
        const filterd = list.filter(x => x[this.getTargetCName(x)] === key ) ; 
        return filterd ; 
    }
 
 
     /**
      * 変換後のキー
      * @param key 
      * @returns 
      */
    public getConvertedKey(key:string):string{
        return key ; 
    }
 
     /**
      * 変換後のタイトル
      * @param key 
      * @returns 
      */
    public getConvertedName(key:string):string{

        const findedProduction = this.store.masters[this.storeGetterName](key ) ; 
        // @ts-ignore
        return _.isNil( findedProduction) ? "-" : findedProduction.name   ; 
    }


}


/**
 * Mode
 */
export class PdtGrouperMProductionMode extends PdtGrouperMProductionAbstract { 
    
    /**
     * 定義取得
     */
    public get def():ITProductionGroupDef {
        return PdtGrouperMProductionMode.getDef() ; 
    } 

    public static getDef():ITProductionGroupDef {
        return { 
            title : "モード" , 
            target : "m_production_mode" ,
        } ;     
    }

    protected get postfix():string{
        return "mode"  ; 
    } 

    protected get storeGetterName():string{
        return "getMProductionModeById"  ; 
    } 
    


}


/**
 * Option
 */
 export class PdtGrouperMProductionOption extends PdtGrouperMProductionAbstract { 
    
    /**
     * 定義取得
     */
     public get def():ITProductionGroupDef {
        return PdtGrouperMProductionOption.getDef() ; 
    } 

    public static getDef():ITProductionGroupDef {
        return { 
            title : "オプション" , 
            target : "m_production_option"
        } ;     
    }


    protected get postfix():string{
        return "option"  ; 
    } 

    protected get storeGetterName():string{
        return "getMProductionOptionById"  ; 
    } 
    


}

