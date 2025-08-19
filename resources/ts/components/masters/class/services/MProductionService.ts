import axios from "axios";
import _ from "lodash";
import NumberUtil from "../../../../frameworks/NumberUtil";
import { IHasProductionGroupCondition } from "../../../tProductions/class/models/grouper/PdtGrouper";
import { MProduction } from "../models/MProduction";


export abstract class MProductionService {

    protected static ep:string = "api/mProduction/"  ; 

    constructor(){}

    /**
     * サムネイルアップロード
     * @param id
     * @param file 
     * @returns 
     */
    public static async thumbnailUpload(id:number ,file:FormData )
        :Promise<MProduction>{
        return new Promise(async (resolve,reject) => {             
            const apiUrl = `${this.ep}thumbnailUpload/${id}` ; 
            try { 
                const res = await axios.post(
                    apiUrl , 
                    file   , 
                    {
                        headers: {
                            'content-type': 'multipart/form-data' ,
                        }
                    }) ;

                const parsed = MProduction.parse(res.data) ; 
                resolve(parsed ) ; 
            }
            catch (error) {
                // @ts-ignore
                error.ep = apiUrl ; 
                reject(error) ; 

            }            
        }) ; 
    }




}


