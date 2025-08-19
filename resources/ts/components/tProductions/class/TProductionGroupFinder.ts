import dayjs from "dayjs";
import DayJsEx from "../../../frameworks/DayJsEx";
import ITProductionUtil from "./ITProductionUtil";
import { TProduction } from "./models/TProduction";
import { TProductionGroupAbstract } from "./models/TProductionAbstract";
import { TProductionDay } from "./models/TProductionDay";
import { TProductionDayGroup } from "./models/TProductionDayGroup";
import TProductionGroupManager from "./TProductionGroupManager";

export default class TProductionGroupFinder{ 
    private manager:TProductionGroupManager ;

    constructor ( manager:TProductionGroupManager){
        this.manager = manager ; 
    }

    private get tProductions () :Array<TProduction>{
        return  this.manager.tProductions ; 
     }

    /**
     * 親グループを検索
     * @param group 
     * @param parentGroup 
     * @returns 
     */
     public findParentGroup(
        group:TProductionDayGroup ,parentGroup:TProductionGroupAbstract | undefined = undefined ):TProductionGroupAbstract | undefined {
        
        const pGroup = parentGroup ?? this.findByMProductionIdAndDay(group.m_production_id , group.planed_production_at) ; 
        if ( pGroup === undefined) return undefined ; 

        //if ( ITProductionUtil.isITProductionDay(pGroup)) return pGroup ;
        //if ( group.level === 0 ) return pGroup ;         

        for (const g of pGroup.groups){
            if ( g.uid == group.uid ) return pGroup ; 

            let foundParent = this.findParentGroup( group ,g) ; 
            if ( foundParent !== undefined ) return foundParent ; 

        }

        return undefined ;
    }


    /**
     * objectからGroupを検索
     * @param group 
     * @returns 
     */
     public findByGroupObj(group:TProductionDayGroup):TProductionDayGroup | undefined {        
        return this.find(group.m_production_id ,group.planed_production_at , group.uid) ;          
    }

    /**
     * 各情報からGroupを検索
     * @param mProductionId 
     * @param day 
     * @param groupUid 
     * @returns 
     */
    public find(mProductionId:number , day:any , groupUid:string):TProductionDayGroup | undefined { 
        // console.log(`mProductionId:${mProductionId} day:${day} uid:${groupUid} `) ; 
        const findByUid = function ( group:TProductionGroupAbstract ,uid:string ):TProductionDayGroup | undefined {
            // console.log(group.groups) ; 
            for ( const g of group.groups){
                // console.log("g : " +  g.uid ) ; 
                if ( g.uid === uid ){
                    // console.log("found") ; 
                    return g  ;                 
                } 
                else {                     
                    const res = findByUid(g , uid ) ; 
                    if ( res !== undefined ) return res ; 
                }
            }
            // console.log("Not found") ; 
            return undefined ; 
        }

        const foundDay = this.findByMProductionIdAndDay(mProductionId , day ) ; 
        // console.log(foundDay) ; 
        if ( foundDay === undefined ) return undefined ; 
        return findByUid(foundDay , groupUid ) ; 
    }

    

    /**
     * 生産先IDと日付から該当の生産予定日情報を取得
     * @param mProductionId 
     * @param day 
     * @returns 
     */
    public findByMProductionIdAndDay(mProductionId:number , day:any):TProductionDay | undefined{
        // @ts-ignore
        const foundMProduction = this.tProductions.find(x => x.MProduction.id === mProductionId) ;         
        if ( foundMProduction?.t_production_days === undefined) return undefined ; 
        
        const foundDay = foundMProduction.t_production_days.find(x => dayjs( x.day).isSame(day)) ; 
        return foundDay ; 
    }

}