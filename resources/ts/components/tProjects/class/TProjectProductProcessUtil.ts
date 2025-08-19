import _ from "lodash";
import NumberUtil from "../../../frameworks/NumberUtil";
import ObjectUtil from "../../../frameworks/ObjectUtil";
import { TProjectProductProcess } from "./models/TProjectProductProcess";
import { TProjectProductProcessPostCartain } from "./models/tsMixins/process/TProjectProductProcessPostCartain";
import { TProjectProductProcessPredicted } from "./models/tsMixins/TProjectProductProcessPredicted";
import { TProjectProductProcessService } from "./services/TProjectProductProcessService";

import { useStore } from "../../../stores/mainStore";


export default class TProjectProductProcessUtil{ 
    
    /**
     * 特定の文字列フォーマットから文字列生成　
     * {} 単位
     * @param obj 
     * @param formula 
     */
    public static getStringFromLabelFomula(obj:TProjectProductProcess ,formulaStr:string ):string {
    
        const store = useStore() ;

        // |を抽出
        const splited = formulaStr.split("|") ; 
        // if ( formulaStr == "cIsCustomerProvide"){
        //     console.log("splited") ; 
        //     console.log(splited) ; 
        // }
        
        const colName = splited[0] ; 
        
        // @ts-ignore
        const colVal = obj[colName] ; 
        //console.log("colName :" + colName + " colVal : " + colVal ) ; 
        //console.log(obj) ; 
        let val:any = _.isNil(colVal) ? colName : colVal  ; 
        //console.log("val : " + val) ; 

        

        if ( splited.length > 1 ){
            // Option処理
            const options = splited.slice(1) ; 

            // toLocaleString　をするかどうかのフラグ                         
            let isLocaleString = false ; 
            let isDValue    = false ; 
            let isMKv       = false ; 

            for ( const option of options) {
                const params = option.split(":") ; 
                const optionName = params[0] ; 
                //console.log("optionName = " + optionName) ; 

                switch ( optionName.toLowerCase()) {
                    case "lc" :     // toLocalString
                        isLocaleString = true ; 
                        break ; 

                    case "dvalue" :     // dValueから取得
                        isDValue  = true ; 
                        break ; 

                    case "mkv" :    // MKVのID
                        isMKv  = true ; 
                        break ; 

                }
            }
            
            // dValueから取得
            if ( isDValue) {
                // @ts-ignore
                val = obj[colName]  ; 
                //if ( val === undefined ) val = "dValue." + colName ; 
            }

            // dValueから取得
            if ( isMKv) {
                const findedMKv = store.masters.getMKvById(val)  ; 
                val = findedMKv === undefined ? "" : findedMKv.kv_name ;                     
            }

            if ( isLocaleString && ! _.isNil(val)) val = val.toLocaleString() ; 


        }

        return val ; 
    }

    /**
     * srcのDisplay関係の内容をtargetに反映させる
     * @param target 
     * @param src 
     */
    public static assignDisplayValues(
        target:TProjectProductProcess|Partial<TProjectProductProcess> ,
        src:TProjectProductProcess|Partial<TProjectProductProcess>) { 

        for ( let i = 0 ; i < 9 ; i ++ ){
            const no = NumberUtil.formatZeroPadding(i + 1 , 2) ; 
            // @ts-ignore
            target[`display_${no}`] = src[`display_${no}`] ; 
            // @ts-ignore
            target[`display_prod_${no}`] = src[`display_prod_${no}`] ; 

            // console.log(no) ; 
        }

    }

    /**
     *  srcのコストと時間関係の内容をtargetに反映させる
     * @param target 
     * @param src 
     */
    public static assignCostAndTimeValues(
        target:TProjectProductProcessPredicted|Partial<TProjectProductProcessPredicted> ,
        src:TProjectProductProcessPredicted|Partial<TProjectProductProcessPredicted>) { 

            // コスト関係のカラムの一覧取得
            target.predicted_sec_per_job = src.predicted_sec_per_job ; 
            target.predicted_sec_per_qty = src.predicted_sec_per_qty ; 
            target.predicted_work_hour = src.predicted_work_hour ; 

            target.predicted_material_cost_per_job = src.predicted_material_cost_per_job ; 
            target.predicted_material_cost_per_qty = src.predicted_material_cost_per_qty ;  
            target.material_cost = src.material_cost ; 

            target.predicted_outsource_cost_per_job = src.predicted_outsource_cost_per_job ; 
            target.predicted_outsource_cost_per_qty = src.predicted_outsource_cost_per_qty ; 
            target.outsource_cost = src.outsource_cost ; 
                
            target.predicted_work_cost_per_job = src.predicted_work_cost_per_job ; 
            target.predicted_work_cost_per_qty = src.predicted_work_cost_per_qty ; 
            target.work_cost = src.work_cost ; 

            target.predicted_cost_per_job = src.predicted_cost_per_job ; 
            target.predicted_cost_per_qty = src.predicted_cost_per_qty ; 
            target.total_cost = src.total_cost ; 


    }

    public static async updateInfoByMProductionChanges(processes:TProjectProductProcess[])
        :Promise<string|undefined>{
            return new Promise(async (resolve,reject) => { 

    
            try { 
                for ( const row of processes ) {
                    // @ts-ignore
                    const tgtProdNo = row.tmp_target_production_no ; 
                    const mProdCName = `m_production_id_${tgtProdNo}` ;
                    const mProdModeCName = `m_production_mode_id_${tgtProdNo}` ;
                    const mProdOptionCName = `m_production_option_id_${tgtProdNo}` ;
        
                    // 全カラムデータを再取得　( TProductionDayからの取得はカラムを絞っているから )
                    const parsed = await TProjectProductProcessService.getById(row.id ?? 0 , undefined ) ;            
                    // console.log(parsed) ; 
                    // console.log("updateInforByMProductionChanges - 1 ") ; 
        
                    if ( parsed !== undefined){
                        if ( !_.isNil(row.tmp_target_production_no)){                        
                            parsed.tmp_target_production_no = row.tmp_target_production_no ;             
                            // @ts-ignore
                            parsed[mProdCName] = row[mProdCName] ; 
                            // @ts-ignore
                            parsed[mProdModeCName] = row[mProdModeCName] ; 
                            // @ts-ignore
                            parsed[mProdOptionCName] = row[mProdOptionCName] ; 
                        }
                        // ラベル設定と計算のみここでさせる
                        
                        parsed.updateProductionDisplays() ; 
                        parsed.updateCostAndTime() ; 
        
                        // 本体への反映                
                        TProjectProductProcessUtil.assignDisplayValues(row, parsed) ; 
                        if ( TProjectProductProcessPredicted.is(row) && TProjectProductProcessPredicted.is(parsed)){
                            TProjectProductProcessUtil.assignCostAndTimeValues(row, parsed) ;
                            // console.log("-----------")  ; 
                        }
                        
                    } 
        
                    // console.log("updateInforByMProductionChanges - 2 ") ; 
                    resolve("") ; 
                }
            }
            catch (error ) {            
                // @ts-ignore    
                error.ep = apiUrl ; 
                reject(error) ; 
            }

        });

    }

    /**
     * Mixinも含めて定義されているフィールド名を取得
     * @param p 
     * @returns 
     */
    public static getDefinedFieldNamesIncMixins(p:TProjectProductProcess):string[]{

        // 必要カラムだけを抽出
        if ( _.isNil(p._mixins)) return [] ; 
        // console.log(p._mixins) ; 
        // console.log("getDefinedFieldNamesIncMixins") ; 
        const rtn:string[] = [] ; 

        
        const pClass = TProjectProductProcess.getEmptyClass() ; 

        const classes = [pClass] ;         
        for ( const mixin of p._mixins){
            // console.log(mixin) ; 
            let cls = new mixin() ; 
            
            // 幕仕上げの場合
            if ( TProjectProductProcessPostCartain.is(cls)){
                // console.log("is postCartain") ; 
                // 各辺のプロパティ生成
                cls.generateEdgeProperties() ; 
            }
            classes.push(cls) ; 
        }

        // console.log(classes) ; 
        for ( const c of classes){
            const props = ObjectUtil.getPropertiesWoFunction(c) ;             
            rtn.push(...props ) ; 

        }

        return _.uniq(rtn) ; 
    }

}