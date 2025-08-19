import axios from "axios";
import _ from "lodash";
import NumberUtil from "../../../../frameworks/NumberUtil";
import { TProject } from "../models/TProject";
import { TProjectProduct } from "../models/TProjectProduct";
import { TProjectProductProcess } from "../models/TProjectProductProcess";

export abstract class TProjectProductProcessService{

    protected static ep:string = "api/tProjectProductProcess/"  ; 

    constructor(){}


    /**
     * IDから情報取得
     * @param id 
     * @returns 
     */
    public static async getById(id:number ,tProduct:TProjectProduct|undefined )
        :Promise<TProjectProductProcess|undefined>{
        return new Promise(async (resolve,reject) => { 
            if ( NumberUtil.invalid2zr(id) === 0 ) return resolve(undefined) ; 
            
            const apiUrl = `${this.ep}${id}` ; 
            try { 
                const res = await axios.get(apiUrl) ;                 
                const row = res.data as Partial<TProjectProductProcess>; 
                // @ts-ignore
                const tmpTProduct = tProduct ?? TProjectProduct.parse( row.t_project_product) ; 
                const parsed = TProjectProductProcess.parse(row ,tmpTProduct) ; 
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
     * 未決定の予定一覧を取得
     * @param params 
     * @param store 
     * @returns 
     */
    public static async getUnPlanned(params:TypeTProjectProductProcess_getUnPlanned )
        :Promise<TProjectProductProcess[]>{
        return new Promise(async (resolve,reject) => { 
            
            const apiUrl = `${this.ep}searchByMProduction` ; 

            try { 
                const res = await axios.post(apiUrl ,params) ; 
                const respRows = res.data as Partial<TProjectProductProcess>[] ; 

                const parsedList = respRows.map(x => { 
                    // @ts-ignore
                    const parsed = TProjectProductProcess.parse(x , x.t_project_product ) ;
                    return parsed ; 
                    
                })

                resolve(parsedList) ; 
    
            }            
            catch (error ) {            
                // @ts-ignore    
                error.ep = apiUrl ; 
                reject(error) ; 
            }
        }) ; 

    }

    

    /**
     * processes　のupdated_atがDBと一致するかチェック　
     * @param processes 
     * @returns 一致しない情報
     */
    public static async checkUpdatedAt(processes:TProjectProductProcess[] )
        :Promise<TypeTProjectProductProcess_checkUpdateAtResult[]>{
        return new Promise(async (resolve,reject) => { 
            if ( processes.length === 0 ) resolve([]); 
            
            const apiUrl = `${this.ep}checkUpdatedAt` ; 
            const postData = processes.map(x => {
                return {
                    id : x.id , 
                    updated_at : x.updated_at ,
                } ;
            }) ; 

            try { 
                const res = await axios.post(apiUrl , postData) ;                 
                const dffs = res.data ; 
                                
                resolve(dffs) ; 
    
            }            
            catch (error ) {            
                // @ts-ignore    
                error.ep = apiUrl ; 
                reject(error) ; 
            }
        }
    ) ; 

 }


    




}


export type TypeTProjectProductProcess_getUnPlanned = { 
    "m_production_id"  : number , 
    "m_process_category_ids"  : number[] ,
    "delivery_date_from" : string , 
    "delivery_date_to" : string, 

}

export type TypeTProjectProductProcess_checkUpdateAtResult = { 
    "id"  : number , 
    "type"  : string ,
    "updated_at" : Date|null , 

}
