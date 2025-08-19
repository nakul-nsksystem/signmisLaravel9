import axios from "axios";
import _ from "lodash";

export abstract class MsCvService {

    protected static ep:string = "api/msCv/"  ; 


    constructor(){}
    
    /**
     * ocrApi
     * @param file 
     * @returns 
     */
     public static async postOcrApi(file:File):Promise<Array<string>>{
        return new Promise(async (resolve,reject) => {             
            const data = new FormData() ;
            data.set('file' , file) ;  
            const apiUrl = `${this.ep}analyzeByOcr` ; 
            
            try { 
                const res = await axios.post(apiUrl,data) ;
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


