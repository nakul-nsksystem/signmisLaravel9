import axios from "axios";
import _ from "lodash";
import NumberUtil from "../../../../frameworks/NumberUtil";
import { MMaterial } from "../models/MMaterial";
import { MMaterialDetail } from "../models/MMaterialDetail";


export abstract class MMaterialService{

    protected static ep:string = `api/mMaterial/`  ; 
    protected static ep4Details:string = `api/mMaterialDetail/`  ; 

    /**
     * Cacheを使用するかどうか
     */
    IsUseCache:boolean = true ; 

    private static _cache:MMaterialCache[]  = [] ; 
    


    constructor(){}

    /**
     * IDから情報取得
     * @param id 
     * @returns 
     */
    public static async getById(id:number ,isUseCache:boolean = true ):Promise<MMaterial|undefined>{
        return new Promise(async (resolve,reject) => { 
            if ( NumberUtil.invalid2zr(id) === 0 ) return resolve(undefined) ; 

            const apiUrl = `${this.ep}${id}` ; 
            try { 

                const cache = this._cache.find(x => x.k === id.toString()) ; 
                if (isUseCache && cache && MMaterial.is(cache.v) ){
                    resolve(cache.v ) ; 
                    // console.log("use Cache")     ;      
                    return ; 
                }
                

                const materialRes = await axios.get(apiUrl) ;                 
                const row = materialRes.data as Partial<MMaterial>; 
                const parsed = MMaterial.parse(row) ; 
                this.setCache(id.toString() , parsed) ; 
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
     * retrieveWithDetails
     * @returns 
     */
    public static async retrieveWithDetails(conditions:object , isUseCache:boolean = true ):Promise<MMaterial[]>{
        return new Promise(async (resolve,reject) => { 
            const apiUrl = `${this.ep}retrieveWithDetails` ; 
            try {
                //console.log(JSON.stringify(conditions)) ; 
                const conditionStr:string = JSON.stringify(conditions) ; 
                const cache = this._cache.find(x => x.k === conditionStr)
                let list  ; 

                if (isUseCache && MMaterial.arrayIs(cache?.vList)){                    
                    if ( ! _.isNil(cache)){
                        list = [...cache.vList] ;      
                        // console.log("use Cache list")     ;      
                    }
                    
    
                }
                else { 
                    const res = await axios.post(apiUrl , conditions) ;
                    const materials = res.data as Array<Partial<MMaterial>> ; 
                    list = materials.map(x => MMaterial.parse( x)) ; 
                    this.setCache(conditionStr , list) ; 
    
                }

                if ( MMaterial.arrayIs(list)){
                    resolve(list) ; 
                }
                else { 
                    reject("list is not array of MMaterial") ; 
                }
                

            }
            catch (error ) {            
                // @ts-ignore    
                error.ep = apiUrl ; 
                reject(error) ; 
            }
                

            

        }) ;         
    }

    // Todo postもこっちでやってCache更新


    /**
     * キャッシュをセット
     * @param key 
     * @param val 
     */
    protected static setCache(key:string ,val:MMaterial[]|MMaterial){

        let row:MMaterialCache = { k:key }; 
        if ( MMaterial.is(val)){
            // MMaterial 
            row.v = val ; 
        }
        else if(MMaterial.arrayIs(val)) {
            row.vList = val ; 
        }
        else { 
            return ; 
        }
        
        const found = this._cache.find(x => x.k === key) ; 
        if ( ! found ){            
            this._cache.push(row) ; 
        }
        else { 
            const idx = this._cache.indexOf(found) ; 
            this._cache.splice(idx , 1 , row ) ; 
        }
    }



    /**
     * 指定されたMMaterialの1つ目のDetailを取得         
     * @param v MMaterialのオブジェクト
     * @returns 
     */
    public static GetMaterialDetailOne(v:MMaterial):MMaterialDetail|undefined { 
        
            // @ts-ignore
            if ( v === undefined || v.m_material_details === undefined)  return undefined ; 
            
            // @ts-ignore
            if ( v.m_material_details.length === 0 ) return undefined ; 

            // @ts-ignore
            return v.m_material_details[0] ; 
    }




}


type MMaterialCache = { 
    k:string ;    // condition Stringfy
    v?:MMaterial 
    vList?:Array<MMaterial>
}
