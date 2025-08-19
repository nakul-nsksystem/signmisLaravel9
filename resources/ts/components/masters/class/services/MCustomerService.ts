import axios from "axios";
import _ from "lodash";
import NumberUtil from "../../../../frameworks/NumberUtil";
import { IHasProductionGroupCondition } from "../../../tProductions/class/models/grouper/PdtGrouper";
import { MCustomer } from "../models/MCustomer";


export abstract class MCustomerService {

    protected static ep:string = "api/mCustomer/"  ; 

    constructor(){}

    /**
     * 取得
     * @param processCategoryMKvId 
     * @returns 
     */
    public static async getById(id:number )
        :Promise<MCustomer>{
        return new Promise(async (resolve,reject) => {     
            
            const apiUrl = `${this.ep}${id}` ; 
            try { 
                const res = await axios.get(apiUrl) ;                
                const parsed = MCustomer.parse(res.data)
                resolve(parsed) ; 
    
            }            
            catch (error ) {            
                // @ts-ignore    
                error.ep = apiUrl ; 
                reject(error) ; 
            }
            

            
        }) ; 
    }

    
    /**
     * データ保存
     * @param row 
     * @returns 
     */
     public static async save(row:MCustomer|Partial<MCustomer>)
        :Promise<Partial<MCustomer>>{
        return new Promise(async (resolve,reject) => {             

            const isNew:boolean = _.isNil(row.id) ; 

            let apiUrl = `${this.ep}` ; 
            if ( ! isNew ){
                apiUrl += `${row.id}` ; 
            } 
            else { 
                apiUrl = apiUrl.slice(0 ,-1 ) ; 
            }

            try { 
                let res ; 
                if ( isNew){
                    res = await axios.post(apiUrl ,row ) ;
                }
                else {
                    res = await axios.put(apiUrl ,row ) ;
                }                
                resolve(res.data) ; 
    
            }            
            catch (error ) {            
                // @ts-ignore    
                error.ep = apiUrl ; 
                reject(error) ; 
            }
        }) ; 
    }






}


