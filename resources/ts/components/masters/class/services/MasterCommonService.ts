import axios from "axios";
import { isEmpty } from "lodash";


export abstract class MasterCommonService {

    constructor(){}


    public static labels = {
        t_projects_count         : "物件" ,
        t_sales_count            : "売上" ,
        t_p_orders_count         : "発注" ,
        t_p_invoices_count       : "仕入" ,
        t_completes_count        : "締" ,
        t_complete_details_count : "入金・支払" ,
    }
    /**
     * 削除前にトランザクション系のテーブルが紐づいているかをチェックする
     * @param ep (id含める) 
     * @returns 
     */
    public static async checkTxn(ep:string ):Promise<boolean>{
        return new Promise(async (resolve,reject) => {     
            
            try { 
                const res = await axios.get(ep) ;

                let existsTxn:string = "" ;

                for(const key of Object.keys(this.labels)) {
                    //@ts-ignore
                    if( res.data[key] > 0 ) existsTxn += `${this.labels[key]} ` ;
                }

                let isConfirmOk = false ;
                if(isEmpty(existsTxn))  {
                    isConfirmOk = confirm(`削除してもよろしいですか？`)
                } 
                else {
                    isConfirmOk = confirm(`${existsTxn} \nにデータが紐づいています。削除してもよろしいですか？`)
                }    
                resolve(isConfirmOk) ;

            }            
            catch (error ) {            
                // @ts-ignore    
                error.ep = ep ; 
                reject(error) ; 
            }
            
        }) ; 
    }

}


