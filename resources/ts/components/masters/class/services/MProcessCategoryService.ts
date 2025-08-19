import axios from "axios";
import _ from "lodash";
import NumberUtil from "../../../../frameworks/NumberUtil";
import { IHasProductionGroupCondition } from "../../../tProductions/class/models/grouper/PdtGrouper";
import { MProcessCategory } from "../models/MProcessCategory";


export abstract class MProcessCategoryService {

    protected static ep:string = "api/mProcessCategory/"  ; 

    constructor(){}

    /**
     * CategoryMKvIdから MProcessCategoryを取得
     * @param processCategoryMKvId 
     * @returns 
     */
    public static async getByCategoryMKvId(processCategoryMKvId:number )
        :Promise<MProcessCategory[]>{
        return new Promise(async (resolve,reject) => {             
            const apiUrl = `${this.ep}searchByProductionMKvId/${processCategoryMKvId}` ; 
            try { 
                const res = await axios.get(apiUrl) ;        
                const parsedList:MProcessCategory[] = []; 

                for ( const c of res.data){
                    parsedList.push(MProcessCategory.parse(c)) ; 
                }
                
                resolve(parsedList) ; 
            }            
            catch (error) {
                // @ts-ignore
                error.ep = apiUrl ; 
                reject(error) ; 

            }

            
        }) ; 
    }

    
    /**
     * CategoryMKvIdから 対応する生産先IDの配列を取得
     * @param processCategoryMKvId 
     * @returns 
     */
     public static async getMProductionIdsByCategoryMKvId(processCategoryMKvId:number )
        :Promise<number[]>{
        return new Promise(async (resolve,reject) => {             

            try { 
                const list = await this.getByCategoryMKvId(processCategoryMKvId) ;        

                const targetMProductionIds:Array<number> = [] ; 
                // @ts-ignore
                list.forEach(x => {
                    // 250408修正　生産管理対象外の生産先をフィルタ
                    // @ts-ignore
                    const ids = x.m_productions.filter(prod => prod.is_production_target).map(prod => prod.id) ; 
                    targetMProductionIds.push(...ids) ; 
                });            

                resolve(targetMProductionIds) ; 
            }            
            catch (error) {
                reject(error) ; 

            }

            
        }) ; 
    }







}


