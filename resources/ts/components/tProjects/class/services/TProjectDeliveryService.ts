import axios from "axios";
import _ from "lodash";
import NumberUtil from "../../../../frameworks/NumberUtil";
import { TProjectDelivery } from "../models/TProjectDelivery";
import { useStore } from "../../../../stores/mainStore";

export abstract class TProjectDeliveryService {

    protected static ep:string = "api/tProjectDelivery/"  ; 

    constructor(){
    }

    /**
     * IDから情報取得
     * @param id 
     * @returns 
     */
    public static async getByIds4copy(ids:number[] ,prodIds:number[])
        :Promise<TProjectDelivery[]> { return new Promise(async (resolve,reject) => { 
            if (ids.length === 0 ) return resolve([]) ; 
            const store = useStore() ;
            const apiUrl = `${this.ep}getByIds4copy` ; 
            try { 
                const res = await axios.post(apiUrl , {"ids":ids ,"prodIds" : prodIds}) ;                 
                const dlvs = res.data as Partial<TProjectDelivery>[]; 

                const list:TProjectDelivery[] = [] ; 

                for ( const row of dlvs){
                    const parsed = TProjectDelivery.parse(row) ; 
                    //@ts-ignore
                    parsed.clearRelations4Copy(row.id,store.loginMUser?.id) ; 
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


