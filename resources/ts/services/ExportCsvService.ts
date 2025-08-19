import axios from "axios";

export abstract class ExportCsvService {

    constructor(){}

    /**
     * 出力
     * @param ep  
     * @param conditions 検索条件  
     * @param filename 出力csvファイル名  
     * @returns 
     */
    public static async export(ep:string , conditions:any , filename:string = "export"){
        return new Promise(async (resolve,reject) => {     
            
            try { 
                const res = await axios.post(ep, conditions, {responseType: 'blob'}) ;
                
                const blob = new Blob([res.data], {type : "application/csv"});
                const link = document.createElement('a') ;
                
                link.href = window.URL.createObjectURL(blob);
                link.setAttribute('download', `${filename}.csv`) ;
                link.click();
                URL.revokeObjectURL(link.href) ;

                resolve(true) ;
    
            }            
            catch (error ) {            
                // @ts-ignore    
                error.ep = ep ; 
                reject(error) ; 
            }
            
        }) ; 
    }






}


