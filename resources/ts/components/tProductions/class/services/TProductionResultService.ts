import axios from "axios";
import _ from "lodash";
import NumberUtil from "../../../../frameworks/NumberUtil";
import { TProductionResult } from "../models/TProductionResult";


export abstract class TProductionResultService {

    protected static ep:string = "api/tProductionResult/"  ; 

    constructor(){}

    /**
     * 集計用のデータ取得
     * @returns 
     */
    public static async retrieve4summary(conditions:object )
        :Promise<TProductionResult[]>{
        return new Promise(async (resolve,reject) => {             

            const apiUrl = `${this.ep}retrieve4summary` ; 
            try { 
                const res = await axios.post(apiUrl , conditions) ;
                const products = res.data as Partial<TProductionResult>[]; 

                const list:TProductionResult[] = [] ; 

                for ( const row of products){
                    const parsed = TProductionResult.parse(row ) ;                     
                    list.push(parsed) ; 
                }
                
                resolve(list) ; 
    
            }            
            catch (error ) {            
                // @ts-ignore    
                error.ep = apiUrl ; 
                reject(error) ; 
            }
        }) ; 

    }




}


