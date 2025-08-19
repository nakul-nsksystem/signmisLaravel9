import axios from "axios";
import dayjs from "dayjs";
import _, { NumericDictionaryIterateeCustom } from "lodash";
import { MProductionExtTool } from "../../../../masters/class/models/MProductionExtTool";
import { TProductionDayGroup } from "../../models/TProductionDayGroup";


export abstract class MProductionExtToolDurstWfService {

    protected static ep:string = "api/tProductionDay/"  ; 


    // public static async login(baseUrl:string ,username:string ,passwd:string)
    //     :Promise<boolean>{
    //         return new Promise(async (resolve,reject) => {             
    //             const apiUrl = `api/durstwf/login/${username}/${passwd}` ; 
    //             try { 
    //                 const res = await axios.get(apiUrl) ;
    //                 resolve(true) ; 
    //             }
    //             catch ( error){
    //                 reject("failed") ; 
    //             }
                

                
    //         }
    //     ) ; 

    // }

    
    public static async fetchImposeTemplates(baseUrl:string )
        :Promise<TypeDwf_ImposeTemplateApi>{
            return new Promise(async (resolve,reject) => {                             
                const apiUrl = `api/durstwf/getImposeTemplates` ; 
                try { 
                    
                    const res = await axios.get(apiUrl ) ;
                    resolve(res.data) ; 
                }
                catch ( error){
                    reject("failed") ; 
                }
                

                
            }
        ) ; 

    }

    
    
    public static async fetchOutputTemplates(baseUrl:string )
        :Promise<TypeDwf_OutputTemplateApi>{
            return new Promise(async (resolve,reject) => {                             
                const apiUrl = `api/durstwf/getOutputTemplates` ; 
                try { 
                    
                    const res = await axios.get(apiUrl ) ;
                    resolve(res.data) ; 
                }
                catch ( error){
                    reject("failed") ; 
                }
                

                
            }
        ) ; 

    }

    


    public static async impose(baseUrl:string ,jobId:number , imposeTemplateId:number)
        :Promise<TypeDwf_ProductionJobApi>{
            return new Promise(async (resolve,reject) => {                             
                const apiUrl = `api/durstwf/impose/${jobId}` ; 

                try {                     

                    const params:TypeDwf_ImposeRequestOptionsApi = { 
                        referencedImposeTemplateApi : {
                            id:imposeTemplateId 
                        }
                    } ;                     
                    const res = await axios.post(apiUrl ,params ) ;                    
                    resolve(res.data) ; 

                }
                catch ( error){
                    reject("failed") ; 
                }
                
            }
        ) ; 

    }
    
    
    public static async getImposeResult(baseUrl:string ,jobId:number ,fileTypeKey:string)
        :Promise<string>{
            return new Promise(async (resolve,reject) => {                             
                const apiUrl = `api/durstwf/getImposeResult/${jobId}/${fileTypeKey}` ; 

                try {                     
                    const res = await axios.get(apiUrl ) ;
                    resolve(res.data) ; 
                    
                }
                catch ( error){
                    reject("failed") ; 
                }
                
            }
        ) ; 

    }
    
    public static async sendToPrinter(baseUrl:string ,jobId:number )
        :Promise<object>{
            return new Promise(async (resolve,reject) => {                             
                const apiUrl = `api/durstwf/sendToPrinter/${jobId}` ; 
                try {                     
                    const res = await axios.get(apiUrl ) ;
                    resolve(res.data) ; 
                    
                }
                catch ( error){
                    reject("failed") ; 
                }
                
            }
        ) ; 

    }
    
    
    
    
    /**
     * createJob
     * @param  
     * @returns 
     */
    public static async createJob(baseUrl:string , group:TProductionDayGroup ,outputTemplateId:number = 0 )
        :Promise<TypeDwf_ProductionJobApi>{
        return new Promise(async (resolve,reject) => {             

            const apiUrl = `api/durstwf/createJob` ; 
            try {                 
                let shipDate = "" ; 
                for ( const proc of  group.t_project_product_processes){
                    if (! _.isNil(proc.t_project_product) ){
                        const deliveryDate = proc.t_project_product.calced_delivery_date ; 
                        if ( shipDate == "" || dayjs(deliveryDate).isAfter(dayjs(shipDate))){
                            shipDate = deliveryDate ; 
                        }
    
                    }
                }


                const params:TypeDwf_ProductionJobApi = {                     
                    
                    externalId : `${group.id}-${group.uid}` , 
                    name : group.title , 
                    shippingDate : dayjs(shipDate).format("YYYY-MM-DD") , 
                    productionDate : dayjs(group.planed_production_at ).format(), 
                }

                if ( outputTemplateId !== 0 ){
                    params.outputTemplateReference = {
                        id:outputTemplateId
                    } ; 
                }
                else { 
                    params.colorPolicyReference ={ 
                        id : 1
                    } ;
                    params.substrateShapeReference = {
                        id : 1
                    } ;

                }

                params.motifs = this.groupToMotifes(group) ; 

                // delete axios.defaults.headers.common['X-Requested-With'];
                // axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
                // axios.defaults.withCredentials = true; 

                // console.log(axios.defaults.headers) ; 
                // console.log(JSON.stringify(params)) ; 
                const res = await axios.post(apiUrl , params) ;
                const rtn = res.data as TypeDwf_ProductionJobApi; 

                resolve(rtn) ; 
    
            }            
            catch (error ) {            
                // @ts-ignore    
                error.ep = apiUrl ; 
                reject(error) ; 
            }
        }) ; 

    }

    protected static groupToMotifes(group:TProductionDayGroup):TypeDwf_MotifApiCreateUpdate[] {
        
        const urls = [
            "http://localhost/SignMisWeb/public/files/parker/parkerPrint.pdf" , 
            "http://localhost/SignMisWeb/public/files/A2/A2_PRINT.pdf" ,
            "http://localhost/SignMisWeb/public/files/A2/A2_PRINT6.pdf" ,

        ]

        const printItems = [] ; 
        let i = 0 ; 
        for ( const proc of  group.t_project_product_processes){
            const pi:TypeDwf_MotifApiCreateUpdate = { 
                name : proc.t_project_product?.name ?? "" , 
                widthMm : proc.t_project_product?.size_w ?? 0 , 
                heightMm : proc.t_project_product?.size_h ?? 0 , 
                numberCopies : proc.t_project_product?.qty ?? 1 , 
                windingTypeKey  : EnumDwf_WindingTypeKey.OUTSIDE , 
                orientationTypeKey : EnumDwf_OrientationTypeKeys.TOP , 
                pdfFileLink : { 
                    uri:urls[i] , 
                }   
            }
            printItems.push(pi) ; 
            i++ ; 
        }
        return printItems ; 

    }

    protected static getUrl(extTool:MProductionExtTool):string { 
        return extTool.url ?? "" ; 
    }



    /**
     * conditionsでのデータ検索(戻り値は1件)
     * @param conditions 
     * @returns 
     */
    // public static async getBy(conditions:TypeTProductionDay_GetBy )
    //     :Promise<Partial<TProductionDay>>{
    //     return new Promise(async (resolve,reject) => {             

    //         const apiUrl = `${this.ep}searchByDay` ; 
    //         try { 
    //             const res = await axios.post(apiUrl , conditions) ;
    //             const row = res.data as Partial<TProductionDay>; 

    //             resolve(row) ; 
    
    //         }            
    //         catch (error ) {            
    //             // @ts-ignore    
    //             error.ep = apiUrl ; 
    //             reject(error) ; 
    //         }
    //     }) ; 

    // }





}

/**
 * で使用するパラメータ
 */
export type TypeDwf_ProductionJobApi =  { 
    colorPolicyReference?:TypeDwf_ReferencedColorPolicyApi,
    outputTemplateReference?:TypeDwf_ReferencedOutputTemplateApi ,    
    comment?:string ,
    externalId?:string , 
    id?:number ,
    motifs?:TypeDwf_MotifApiCreateUpdate[] ,
    name:string ,
    productionDate:string ,
    substrateShapeReference?:TypeDwf_ReferencedSubstrateShapeApi , 
    shippingDate :string ,
    status?:EnumDwf_JobStatus ,
}


export type TypeDwf_MotifApi = { 
    colorPolicyReference?:TypeDwf_ReferencedColorPolicyApi
    comment?:string , 
    heightMm?:number , 
    externalId ?:string , 
    id?:number ,
    name :string ,
    numberCopies?:number ,
    orientationTypeKey?:EnumDwf_OrientationTypeKeys ,
    pages?:number ,
    status?:EnumDwf_PrintItemStatus ,
    widthMm?:number , 
    windingTypeKey?:EnumDwf_WindingTypeKey  ,



}



export type TypeDwf_OutputTemplateApi = { 
    id:number , 
    name? :string ,
    key? :string , 
}


export type TypeDwf_ImposeTemplateApi = { 
    comment ?:string ,
    defaultTemplate? :boolean ,
    id?:number , 
    name? :string ,
    type? :string , 
}

export type TypeDwf_MotifApiCreateUpdate =  { 
    additionalFilesList?:TypeDwf_FileLinkApi , 
    colorPolicyReference?:TypeDwf_ReferencedColorPolicyApi , 
    comment?:string , 
    heightMm?:number , 
    externalId ?:string ,     
    name :string ,
    numberCopies?:number ,
    orientationTypeKey?:EnumDwf_OrientationTypeKeys ,
    pdfFileLink?:TypeDwf_FileLinkApi , 
    widthMm?:number , 
    windingTypeKey?:EnumDwf_WindingTypeKey  ,
    processingOptions?:TypeDwf_ProcessingOptionsApi ,


}

export type TypeDwf_FileLinkApi = { 
    uri?:string , 
}

export type TypeDwf_ProcessingOptionsApi = { 
    fixupChain? : TypeDwf_FixupChainApi ,
    preflight? : TypeDwf_PreflightApi , 
} 


export type TypeDwf_FixupChainApi = { 

}

export type TypeDwf_PreflightApi = { 
    
}

export type TypeDwf_ReferencedSubstrateShapeApi = { 
    
}

export type TypeDwf_ReferencedColorPolicyApi = { 
    id:number , 
}

export type TypeDwf_ReferencedOutputTemplateApi = { 
    id:number , 
}

export type TypeDwf_ImposeRequestOptionsApi = { 
    referencedImposeTemplateApi:TypeDwf_ReferencedImposeTemplateApi , 
}

export type TypeDwf_ReferencedImposeTemplateApi = { 
    id?:number , 
}



/**
 * ジョブのステータス
 */
 const EnumDwf_JobStatus = { 
    CREATED : "CREATED"  ,
    READY_FOR_PRINT : "READY_FOR_PRINT", 
    OUTPUT_CONFIG_ASSIGNED : "OUTPUT_CONFIG_ASSIGNED", 
    IMPOSED :"IMPOSED", 
    SENT_TO_PRINTER:"SENT_TO_PRINTER", 
    PRINTED:"PRINTED", 
    QUANTITY_REACHED:"QUANTITY_REACHED", 
    CLOSED:"CLOSED" , 

} as const ;
export type EnumDwf_JobStatus = typeof EnumDwf_JobStatus[keyof typeof EnumDwf_JobStatus] ; 



/**
 * 回転タイプ
 */
 const EnumDwf_OrientationTypeKeys = { 
    TOP : "TOP"  ,
    BOTTOM : "BOTTOM", 
    RIGHT : "RIGHT", 
    LEFT :"LEFT", 
} as const ;
export type EnumDwf_OrientationTypeKeys = typeof EnumDwf_OrientationTypeKeys[keyof typeof EnumDwf_OrientationTypeKeys] ; 



/**
 * 印刷アイテムのステータス
 */
 const EnumDwf_PrintItemStatus = { 
    CREATED : "CREATED"  ,
    CHECKED_IN : "CHECKED_IN" , 
    READY_FOR_PRINT : "READY_FOR_PRINT", 
    WAITING_FOR_APPROVAL : "WAITING_FOR_APPROVAL", 
    APPROVED:"APPROVED" , 
    IMPOSED :"IMPOSED", 
    SENT_TO_PRINTER:"SENT_TO_PRINTER", 
    PRINTED:"PRINTED", 
    QUANTITY_REACHED:"QUANTITY_REACHED", 

} as const ;
export type EnumDwf_PrintItemStatus = typeof EnumDwf_PrintItemStatus[keyof typeof EnumDwf_PrintItemStatus] ; 


/**
 * 回転タイプ
 */
 const EnumDwf_WindingTypeKey = { 
    INSIDE : "INSIDE"  ,
    OUTSIDE : "OUTSIDE", 
} as const ;
export type EnumDwf_WindingTypeKey = typeof EnumDwf_WindingTypeKey[keyof typeof EnumDwf_WindingTypeKey] ; 

