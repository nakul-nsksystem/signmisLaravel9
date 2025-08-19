import dayjs from "dayjs";
import _ from "lodash";
import DayJsEx from "../../../frameworks/DayJsEx";
import NumberUtil from "../../../frameworks/NumberUtil";
import { TProjectProductProcess } from "../../tProjects/class/models/TProjectProductProcess";
import ITProductionUtil from "./ITProductionUtil";
import { IHasProductionGroupCondition, ITProductionGroupConditions, ITProductionGroupDef, PdtGrouperAbstract } from "./models/grouper/PdtGrouper";
import { PdtGrouperDeliveryAt } from "./models/grouper/PdtGrouperDeliveryAt";
import { PdtGrouperLami, PdtGrouperMaterial } from "./models/grouper/PdtGrouperMaterial";
import { PdtGrouperMProductionMode, PdtGrouperMProductionOption } from "./models/grouper/PdtGrouperMProduction";
import { PdtGrouperProcess } from "./models/grouper/PdtGrouperProcess";
import { TProduction } from "./models/TProduction";
import { TProductionGroupAbstract } from "./models/TProductionAbstract";
import { TProductionDay } from "./models/TProductionDay";
import { TProductionDayGroup } from "./models/TProductionDayGroup";
import TProductionGroupManager from "./TProductionGroupManager";
import { PdtGrouperProject } from "./models/grouper/PdtGrouperProject";

export default class TProductionGroupGrouper{ 
    private manager:TProductionGroupManager ;

    /**
     * グループロジックの配列
     */
    public groupers:Array<PdtGrouperAbstract>

    // public groupConditions:Array<ITProductionGroupConditions> ; 

    constructor ( manager:TProductionGroupManager){
        this.manager = manager ; 
        this.groupers = [
            new PdtGrouperDeliveryAt(manager) , 
            new PdtGrouperMaterial(manager) , 
            new PdtGrouperLami(manager) , 
            new PdtGrouperMProductionMode(manager) , 
            new PdtGrouperMProductionOption(manager) , 
            new PdtGrouperProcess(manager) , 
            new PdtGrouperProject(manager) ,
            

        ] ; 

        // this.groupConditions = [] ; 


    }


    /**
     * Activeなグルーピング条件を取得
     */
    // public get activeGroupConditions () :Array<ITProductionGroupConditions>{ 
    //     return _.sortBy(this.groupConditions.filter(x => x.is_selected) ,"order") ; 
    // }
    
    /**
     * 条件に合わない工程（物件側で変更などがあった場合）を抽出
     */
    public getUnmachedProcesses(day:TProductionDay):Array<TProjectProductProcess>{

        const unmachedList:Array<TProjectProductProcess> = [] ; 
        const _this = this ; 
        const getFunc = 
            function(
                group:TProductionDayGroup , 
                conditions:Array<ITProductionGroupConditions>  ){ 
                // console.log(`getFunc `) ; 
                if ( conditions.length < group.level) return [] ;                 
                const groupItem = conditions[group.level] ; 
                
                // console.log(`getFunc 1`) ;                 
                 
                if (_.isNil(groupItem) || ! groupItem.is_selected   ) return [] ; 
                const grouper = _this.findGrouperByTarget(groupItem.def.target) ; 
                if (_.isNil(grouper)) return [] ; 

                // console.log(`getFunc 2:` + group.t_project_product_processes.length) ; 
                const target = groupItem.def.target  ; 
                const res = [] ; 
                for ( const p of group.t_project_product_processes ){
                    const dataKey = grouper.getConvertedKey( grouper.getKey(p)) ; 
                    
                    if ( dataKey != group.key ){
                        // console.log(`${target} @ ${dataKey} : ${group.key} id=${p.id}`) ; 
                        // console.log(unmachedList)
                        const found = unmachedList.find(x => x.id === p.id) ; 
                        // console.log(found) ; 
                        if ( found === undefined) unmachedList.push(p) ; 
                        
                    }
                }
                
                // 子も実行
                for ( const g of group.groups){                    
                    getFunc(g , conditions) ; 
                    // res.push(... getFunc(g , conditions)) ; 
                }

                return ;

        }

        if ( day === undefined) return []; 
        const conditions = TProductionGroupGrouper.parseConditions(day) ; 
        
        const level = 0 ; 
        

        


        // グループキーが違う
        for ( const g of day.groups){           
            const res = getFunc(g , conditions) ; 
            // unmachedList.push(...res) ; 
        }

        
        // 生産先が違う
        for ( const p of day.t_project_product_processes ){
            const tgtProdNo = p.tmp_target_production_no ; 
            // @ts-ignore
            const targetMProductionId = p[`m_production_id_${tgtProdNo}`]  ; 
            if ( targetMProductionId !== day.m_production_id ){
                const found = unmachedList.find(x => x.id === p.id) ; 
                if ( found === undefined) unmachedList.push(p) ; 
            }

        }

        return unmachedList; 

    }

    

    /**
     * 指定されたgroup以下を再グルーピング
     *  */ 
    public grouping(group:TProductionGroupAbstract ) {    
        
        const removeGroups = [...group.groups] ; 
        for (const g of removeGroups){            
            this.manager.removeGroup(g ,false , false ,false) ; 
        }
        
        // group.groups.splice(0) ; 
        // console.log(group.groups)      ; 
        
        let level:number = 0 ; 
        let day:TProductionDay|undefined = group as TProductionDay; 


        if ( ITProductionUtil.isTProductionDayGroup(group)){
            level =  group.level + 1  ;             
            day = this.manager.finder.findByMProductionIdAndDay(group.m_production_id , group.planed_production_at) ;     
        }
        
        if ( day === undefined) return ; 
        // console.log("day") ; 
        // console.log(day) ; 

        const conditions = TProductionGroupGrouper.parseConditions(day) ; 
        // console.log(conditions) ; 
        // console.log("level : " + level ) ; 

        const groupedList = this.getGroupedList(group ,group.t_project_product_processes   , level ,conditions ) ; 
        group.groups.push(...groupedList) ; 
        
        group.updateKeyGroupNo4Children() ; 
    }

    /**
     * target文字列からGrouperを取得
     * @param target 
     * @returns 
     */
    public findGrouperByTarget(target:string):PdtGrouperAbstract | undefined{
        const found = this.groupers.find(x => x.def.target === target ) ; 
        return found ; 
    }

    /**
     * グルーピングソートしたGroupの配列を返す
     * @param group 
     * @param list 
     * @param level 
     * @returns 
     */
    public getGroupedList (group:TProductionGroupAbstract , list:Array<TProjectProductProcess> ,level:number ,conditions:Array<ITProductionGroupConditions> ) {
        if ( _.isNil(list) || list.length === 0 ) return [] ; 
        // if ( this.activeGroupConditions.length < level + 1 ) return [] ; 
        if ( conditions.length < level + 1 ) return [] ; 
        
        // Levelに応じたグルーピング結果を酒t区
        // const sortItem = this.activeGroupConditions[level] ;  
        const groupItem = conditions[level] ;  
        if (! groupItem.is_selected ) return [] ; 
        const grouper = this.findGrouperByTarget(groupItem.def.target) ; 
        
        if ( grouper === undefined) return []; 
        // console.log(sortItem); 
        // console.log(group); 
        const groups = grouper.grouping(group , level , list) ; 
        
        // 子グループ
        for ( const g of groups ){
            g.created_m_user_id = this.manager.loginMUserId ; 
            g.updated_m_user_id = this.manager.loginMUserId ;  
            g.groups = this.getGroupedList(g , g.t_project_product_processes , level + 1 ,conditions ) ; 
        }
        
        return groups ; 

    }     

    



    /**
     * グループ定義を取得
     * @returns 
     */
    public static getGrouperDefs() : Array<ITProductionGroupDef>{
        return [
            PdtGrouperDeliveryAt.getDef()  , 
            PdtGrouperMaterial.getDef()  , 
            PdtGrouperLami.getDef()  , 
            PdtGrouperMProductionMode.getDef()  , 
            PdtGrouperMProductionOption.getDef() , 
            PdtGrouperProcess.getDef()  , 
            PdtGrouperProject.getDef()
        ]  ; 
    }
    
    /**
     * ObjectからgroupConditionsを取得
     * @param row 
     */
    public static parseConditions ( row:object):Array<ITProductionGroupConditions>{
        
        const rtn:Array<ITProductionGroupConditions> = [] ; 
        // this.groupConditions.splice(0) ; 
        if (_.isNil(row)) return [];         
        
        // console.log("getCond2") ; 
        // const groupers = this.groupers ; 
        const groupDefs = TProductionGroupGrouper.getGrouperDefs() ; 

        // 指定分取得
        let maxGroupCnt = 5 ; 
        for ( let i = 0 ; i < maxGroupCnt ; i ++ ) { 
            const strNo = NumberUtil.formatZeroPadding(i + 1 , 2) ;             
            
            // @ts-ignore
            const target = row[`group_target_${strNo}`] ; 
            if ( _.isNil(target)) break ; 
            
            const found = groupDefs.find(x => x.target == target) ;             
            if ( found === undefined ) break ; 
            
            const newRow:ITProductionGroupConditions = {
                def : found ,
                order : i + 1 , 
                is_selected : true  , 
            }
            // this.groupConditions.push(newRow) ; 
            rtn.push(newRow) ; 

        }

        // 未指定分取得
        // console.log(this.cGrouper.groupConditions) ; 
        for ( let i = 0 ; i < groupDefs.length ; i ++ ) { 
            
            let found = undefined ; 
            // if ( this.groupConditions.length > 0 ){
            if ( rtn.length > 0 ){
                // found = this.groupConditions.find(x => x.grouper.def.target === groupers[i].def.target) ; 
                found = rtn.find(x => x.def.target === groupDefs[i].target) ; 

            }
            
            // console.log(found) ; 
            if ( found === undefined){
                const newRow:ITProductionGroupConditions = {
                    def : groupDefs[i] ,

                    // order : this.groupConditions.length + 1 , 
                    order : rtn.length + 1 , 
                    is_selected : false  , 
                }
                // this.groupConditions.push(newRow) ; 
                rtn.push(newRow) ; 

            }
        }    
        
        return rtn ; 
    }

    
    /**
     * 現在のグループ条件をDayに設定
     * @param day 
     */
     public static updateGroupCondition (target:IHasProductionGroupCondition ,source:Array<ITProductionGroupConditions>){ 
        // const conditions:Array<ITProductionGroupConditions> = this.activeGroupConditions ; 
        

        const groupDefs = TProductionGroupGrouper.getGrouperDefs() ; 
        const selectedConditions = _.sortBy(source.filter(x => x.is_selected) ,"order") ; 

        for ( let i = 0 ; i < selectedConditions.length ; i++ ){
            const condition = selectedConditions[i] ; 

            let strNo = NumberUtil.formatZeroPadding(i + 1 , 2) ; 
            let cName = `group_target_${strNo}`  ;  

            // @ts-ignore
            target[cName] = condition.def.target ; 

        }

        for ( let i = selectedConditions.length ; i < groupDefs.length ; i++ ){
            let strNo = NumberUtil.formatZeroPadding(i + 1 , 2) ; 
            let cName = `group_target_${strNo}`  ;  

            // @ts-ignore
            target[cName] = "" ; 

        }

        // console.log(target) ; 

        
    }
    // /**
    //  * ObjectからgroupConditionsを取得
    //  * @param row 
    //  */
    // public parseConditions ( row:object):Array<ITProductionGroupConditions>{
        
    //     const rtn:Array<ITProductionGroupConditions> = [] ; 
    //     // this.groupConditions.splice(0) ; 
    //     if (_.isNil(row)) return [];         
        
    //     // console.log("getCond2") ; 
    //     const groupers = this.groupers ; 

    //     // 指定分取得
    //     let maxGroupCnt = 5 ; 
    //     for ( let i = 0 ; i < maxGroupCnt ; i ++ ) { 
    //         const strNo = NumberUtil.formatZeroPadding(i + 1 , 2) ; 
            
    //         // @ts-ignore
    //         const target = row[`group_target_${strNo}`] ; 
    //         if ( _.isNil(target)) break ; 
            
    //         const found = groupers.find(x => x.def.target == target) ; 
    //         if ( found === undefined ) break ; 
            
    //         const newRow:ITProductionGroupConditions = {
    //             grouper : found ,
    //             order : i + 1 , 
    //             is_selected : true  , 
    //         }
    //         // this.groupConditions.push(newRow) ; 
    //         rtn.push(newRow) ; 

    //     }

    //     // 未指定分取得
    //     // console.log(this.cGrouper.groupConditions) ; 
    //     for ( let i = 0 ; i < groupers.length ; i ++ ) { 
            
    //         let found = undefined ; 
    //         // if ( this.groupConditions.length > 0 ){
    //         if ( rtn.length > 0 ){
    //             // found = this.groupConditions.find(x => x.grouper.def.target === groupers[i].def.target) ; 
    //             found = rtn.find(x => x.grouper.def.target === groupers[i].def.target) ; 

    //         }
            
    //         // console.log(found) ; 
    //         if ( found === undefined){
    //             const newRow:ITProductionGroupConditions = {
    //                 grouper : groupers[i] ,
    //                 // order : this.groupConditions.length + 1 , 
    //                 order : rtn.length + 1 , 
    //                 is_selected : false  , 
    //             }
    //             // this.groupConditions.push(newRow) ; 
    //             rtn.push(newRow) ; 

    //         }
    //     }    
        
    //     return rtn ; 
    // }





}