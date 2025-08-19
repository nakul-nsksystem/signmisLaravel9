import axios from "axios";
import _ from "lodash";
import NumberUtil from "../../../../frameworks/NumberUtil";
import { IHasProductionGroupCondition } from "../../../tProductions/class/models/grouper/PdtGrouper";


export abstract class MProductionGroupConfigService {

    protected static ep:string = "api/mProductionGroupConfig/"  ; 

    constructor(){}

    /**
     * グルーピングのデフォルト条件取得
     * @param mBranchId 
     * @param processCategoryMKvId 
     * @returns 
     */
    public static async getDefault(mBranchId:number ,processCategoryMKvId:number )
        :Promise<IHasProductionGroupCondition|undefined>{
        return new Promise(async (resolve,reject) => {             
            const apiUrl = `${this.ep}findByBranchAndProcessCategoryMkv/${mBranchId}/${processCategoryMKvId}` ; 
            try { 
                const res = await axios.get(apiUrl) ;
                if ( res.data.length === 0 ){                    
                    resolve(undefined) ; 
                }   
                else{
                    resolve(res.data) ; 
                }
            }            
            catch (error) {
                // @ts-ignore
                error.ep = apiUrl ; 
                reject(error) ; 

            }

            
        }) ; 
    }




}


