import axios from "axios";
import _ from "lodash";
import { MUserOption } from "../models/MUserOption";


export abstract class MUserOptionService {

    protected static ep:string = "api/mUserOption/"  ; 

    constructor(){}

    
    /**
     * データ保存
     * @param row 
     * @returns 
     */
    public static async updateOrCreateOptions(row:MUserOption|Partial<MUserOption>):Promise<Partial<MUserOption>>{
        return new Promise(async (resolve,reject) => {             

            let apiUrl = `${this.ep}updateOrCreateOptions` ; 

            try { 
                let res ; 
                
                res = await axios.post(apiUrl ,row ) ;
                 
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


