import _ from "lodash";
import DayJsEx from "../../../../../frameworks/DayJsEx";
import { TProjectProductProcess } from "../../../../tProjects/class/models/TProjectProductProcess";
import ITProductionUtil from "../../ITProductionUtil";
import TProductionGroupManager from "../../TProductionGroupManager";
import { TProductionGroupAbstract } from "../TProductionAbstract";
import { TProductionDayGroup } from "../TProductionDayGroup";


/**
 * グループソート条件の定義
 */
 export interface ITProductionGroupDef {    
    title:string ;
    target:string ; 

}

/**
 * グループソート設定
 */
export interface ITProductionGroupConditions {    
    def:ITProductionGroupDef ,
    grouper?:PdtGrouperAbstract ;
    order:number ; 
    is_selected:boolean ; 

}

export interface IHasProductionGroupCondition {
    group_target_01? : string ; 
    group_target_02? : string ; 
    group_target_03? : string ; 
    group_target_04? : string ; 
    group_target_05? : string ; 
}




export abstract class PdtGrouperAbstract {     

    protected manager:TProductionGroupManager

    constructor(manager:TProductionGroupManager) {
        this.manager = manager ; 
        
    }

    /**
     * 定義取得
     */
    public abstract get def():ITProductionGroupDef ; 


    /**
     * キーの取得
     * @param list 
     * @returns 
     */
    protected abstract getKeys(list:Array<object>):Array<string> ; 
 
    /**
     * キーの値を取得
     * @param process
     */
    public abstract getKey(process:TProjectProductProcess):string ; 

    /**
     * キーの内容でlistをFilter
     * @param key 
     * @param list 
     * @returns 
     */
    protected abstract filterByKey(key:string , list:Array<object>):Array<TProjectProductProcess> ; 
 
    /**
     * 変換後のキー
     * @param key 
     * @returns 
     */
    public abstract getConvertedKey(key:string):string ; 
 
    /**
     * 変換後のタイトル
     * @param key 
     * @returns 
     */
    public abstract getConvertedName(key:string):string ; 
 

    /**
     * グループのList取得
     */
    public grouping(
        group:TProductionGroupAbstract , 
        level:number ,
        list:Array<TProjectProductProcess>):Array<TProductionDayGroup>
    {
        let distictKeys = [] ; 
        let rtn:Array<TProductionDayGroup> = [] ; 

        // Key の抽出
        // @ts-ignore
        distictKeys = this.getKeys(list)
        distictKeys =  _.uniq( distictKeys) ; 
        distictKeys = _.sortBy(distictKeys ) ; 
        
        let day:any = undefined ;
        if ( ITProductionUtil.isTProductionDay(group) ) day = group.day ; 
        if ( ITProductionUtil.isTProductionDayGroup(group) ) day = group.planed_production_at ; 


        for ( const key of distictKeys){
            // console.log(key) ; 
            // @ts-ignore
            const filterd = this.filterByKey(key , list) ; 
            //console.log(filterd) ; 

            const newRow = TProductionDayGroup.create
                (
                    this.manager , 
                    group.m_production_id , 
                    day , 
                    level,
                    filterd , 
                    this.def.target , 
                    this.getConvertedKey(key) , 
                    this.getConvertedName(key) , 
                ) ; 
            rtn.push(newRow) ; 

        }
        
        return rtn ; 
     }
    

}

