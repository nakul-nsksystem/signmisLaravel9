import axios from "axios";
import _, { NumericDictionaryIterateeCustom } from "lodash";
import { TProductionDay } from "../models/TProductionDay";


export abstract class TProductionDayService {

    protected static ep:string = "api/tProductionDay/"  ; 
    



    /**
     * conditionsでのデータ検索(戻り値は1件)
     * @param conditions 
     * @returns 
     */
    public static async getBy(conditions:TypeTProductionDay_GetBy )
        :Promise<Partial<TProductionDay>>{
        return new Promise(async (resolve,reject) => {             

            const apiUrl = `${this.ep}searchByDay` ; 
            try { 
                const res = await axios.post(apiUrl , conditions) ;
                const row = res.data as Partial<TProductionDay>; 

                resolve(row) ; 
    
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
    public static async save(row:TProductionDay)
        :Promise<Partial<TProductionDay>>{
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
                
                // const res = await axios.post(apiUrl , conditions) ;
                // const row = res.data as Partial<TProductionDay>; 
                // const parsed = TProductionDay.parse(this.manager , res.data)  ; 
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

/**
 * getByで使用するパラメータ
 */
 export type TypeTProductionDay_GetBy = { 
    m_production_id:number,
    day:any ,
    process_category_m_kv_id:number ,
}


