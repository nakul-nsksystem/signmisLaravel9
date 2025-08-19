import axios from "axios";
import _ from "lodash";
import NumberUtil from "../../../../frameworks/NumberUtil";
import { TProject } from "../models/TProject";
import { TProjectProduct } from "../models/TProjectProduct";


export abstract class TProjectProductService {

    protected static ep:string = "api/tProjectProduct/"  ; 

    constructor(){}

    /**
     * IDから情報取得
     * @param id 
     * @param isWithDlv 納品情報も持ってくるかどうか
     * @returns 
     */
    public static async getByIds4copy(ids:number[] ,isWithDlv:boolean = false)

        :Promise<TProjectProduct[]>{
        return new Promise(async (resolve,reject) => { 
            if (ids.length === 0 ) return resolve([]) ; 

            const apiUrl = `${this.ep}getByIds4copy` ; 
            try { 
                const res = await axios.post(apiUrl , {"ids":ids ,"isWithDlv":isWithDlv}) ;                 
                const products = res.data as Partial<TProjectProduct>[]; 

                const list:TProjectProduct[] = [] ; 

                for ( const row of products){
                    const parsed = TProjectProduct.parse(row) ; 
                    parsed.clearRelations4Copy() ; 
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


