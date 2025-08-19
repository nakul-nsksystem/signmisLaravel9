import axios from "axios";
import _ from "lodash";
import NumberUtil from "../../../../frameworks/NumberUtil";
import { IHasProductionGroupCondition } from "../../../tProductions/class/models/grouper/PdtGrouper";
import { MProduction } from "../models/MProduction";
import { MUser } from "../models/MUser";


export abstract class MUserService {

    protected static ep:string = "api/mUser/"  ; 

    constructor(){}

    /**
     * サムネイルアップロード
     * @param id
     * @param file 
     * @returns 
     */
    public static async thumbnailUpload(id:number ,file:FormData )
        :Promise<MUser>{
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

                const parsed = MUser.parse(res.data) ; 
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


