import axios from "axios";
import _ from "lodash";
import NumberUtil from "../../../../frameworks/NumberUtil";
import { MCalendar } from "../models/MCalendar";


export abstract class MCalendarService {

    protected static ep:string = "api/mCalendar/"  ; 

    constructor(){}

    /**
     * 取得
     * @param Id 
     * @returns 
     */
    public static async getById(id:number ):Promise<MCalendar>{
        return new Promise(async (resolve,reject) => {     
            
            const apiUrl = `${this.ep}${id}` ; 
            try { 
                const res = await axios.get(apiUrl) ;                
                const parsed = MCalendar.parse(res.data)
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
     * 範囲で取得
     * @param Id 
     * @returns 
     */
     public static async getByRange(mBranchId:number , from:Date ,to:Date  )
        :Promise<MCalendar[]>{
        return new Promise(async (resolve,reject) => {     
            
            const apiUrl = `${this.ep}getByRange` ; 
            try { 
                const res = await axios.post(apiUrl ,{
                    m_branch_id : mBranchId , 
                    from:from , 
                    to:to ,
                }) ;

                const parsedList:MCalendar[] = [] ; 
                for ( const d of res.data){
                    parsedList.push(MCalendar.parse(d)) ; 
                }
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
     * データ保存
     * @param row 
     * @returns 
     */
     public static async save(row:MCalendar|Partial<MCalendar>)
        :Promise<Partial<MCalendar>>{
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


