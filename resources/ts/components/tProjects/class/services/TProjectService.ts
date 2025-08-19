import axios from "axios";
import _ from "lodash";
import NumberUtil from "../../../../frameworks/NumberUtil";
import ObjectUtil from "../../../../frameworks/ObjectUtil";
import { TProject } from "../models/TProject";
import { TProjectDelivery } from "../models/TProjectDelivery";
import TProjectProductProcessUtil from "../TProjectProductProcessUtil";

import { useStore } from "../../../../stores/mainStore";


export abstract class TProjectService {

    protected static ep:string = "api/tProject"  ; 

    constructor(){}

    /**
     * IDから情報取得
     * @param id 
     * @returns 
     */
    public static async getById(id:number )
        :Promise<TProject|undefined>{
        return new Promise(async (resolve,reject) => { 
            if ( NumberUtil.invalid2zr(id) === 0 ) return resolve(undefined) ; 

            const apiUrl = `${this.ep}/${id}` ; 
            try { 
                const res = await axios.get(apiUrl) ;                 
                const row = res.data as Partial<TProject>; 
                // @ts-ignore
                const parsed = TProject.parse(row ) ; 
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
     * 生産管理用検索 情報取得
     * @param id 
     * @returns 
     */
    public static async search4Production(conditions:any )
        :Promise<TProject[]|undefined>{
        return new Promise(async (resolve,reject) => {             

            const apiUrl = `${this.ep}/retrieve4Production` ; 
            try { 
                const res = await axios.post(apiUrl , conditions) ;                 
                const projects = res.data ; 

                const list:TProject[] = [] ; 

                for ( const row of projects){
                    const parsed = TProject.parse(row ) ; 
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

    /**
     * 商品用検索 情報取得
     * @param id 
     * @returns 
     */
    public static async search4TProducts(conditions:any )
        :Promise<TProject[]|undefined>{
        return new Promise(async (resolve,reject) => {             

        const apiUrl = `${this.ep}/retrieve4TProducts` ; 
        try { 
            const res = await axios.post(apiUrl , conditions) ;                 
            const projects = res.data ; 

            const list:TProject[] = [] ; 

            for ( const row of projects){
                const parsed = TProject.parse(row ) ; 
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

    /**
     * 物件追加編集から呼び出す物件保存
     * 物件保存時不要情報のトリムを行う
     * @param tProject t_projectのレコード
     * @param store 
     * @returns
     */

    public static async saveFromTProject(tProject:TProject) : Promise<TProject> {
        return new Promise(async (resolve,reject) => {

            const store = useStore()
            /**TodoDeepCopy処理 */
            // const trimed = _.cloneDeep(tProject) ;
            // const trimed = ObjectUtil.deepCopyJ(tProject) ;
            //const trimed = JSON.parse(JSON.stringify(tProject))  ;
            try {
                const copied = ObjectUtil.deepCopyJ(tProject) ;
                const trimed = TProject.parse(copied)  ;
                // const trimed = tProject ;

                //新規か編集かの判定
                const isNew = _.isNil(tProject.id) ;

                //@ts-ignore
                const loginUserId = store?.loginMUser.id ?? 0;

                // @ts-ignore
                delete trimed.m_customer ; 

                let productOrderNo = 0;
                for(const product of trimed.t_project_products) {
                    //@ts-ignore                        
                    product.order_no = productOrderNo ;
                    productOrderNo ++

                }
                //編集の時
                if(!isNew) {
                    /**
                     * getAttributeで生成したデータを削除（min_delivery,max_arrival,main_material,lami_material,user_full_names,user_last_names）
                     * deleteInsertを行うテーブルはidを削除
                     * 商品order_no変更時のレコード更新
                     */
                    
                    //最短納期最終着日トリム
                    //@ts-ignore
                    delete trimed.min_delivery ;
                    //@ts-ignore
                    delete trimed.max_arrival ;

                    //商品表示順
                    // let productOrderNo = 0;

                    //商品系処理
                    if(trimed.t_project_products?.length) {

                        for(const product of trimed.t_project_products) {                        
                            
                            //商品順番の更新
                            //@ts-ignore
                            // product.order_no = productOrderNo ;

                            // 
                            delete product.t_project ; 
                            delete product.m_product_category;                         
                            delete product.main_material_process ; 
                            delete product.t_project_deliveries ; 

                            //材料系トリム
                            delete product.main_material ;
                            //@ts-ignore
                            delete product.lami_material ;

                            //分割DeleteInsert用
                            if ( product.t_project_product_separates !== undefined ){
                                for ( const separate of product.t_project_product_separates ){
                                    separate.created_m_user_id = loginUserId ;
                                    delete separate.id  ;

                                }
                            }
                            //板割DeleteInsert用
                            if ( product.t_project_product_boardlayouts !== undefined ){
                                // 原因はわからないが、
                                // クラスのままにすると delete した idが復活することがある

                                const tempBL = ObjectUtil.deepCopyJ(product) ; 
                                // @ts-ignore 
                                product.t_project_product_boardlayouts = tempBL.t_project_product_boardlayouts.map(x => {
                                    const a = ObjectUtil.deepCopyJ(x) ;
                                    // @ts-ignore 
                                    a.created_m_user_id = loginUserId ;
                                    // @ts-ignore 
                                    delete a.id ; 
                                    return a ; 
                                })
                

                                // for ( const boardlayout of product.t_project_product_boardlayouts ){
                                //     boardlayout.created_m_user_id = loginUserId ;
                                //     // console.log("boardlayout.id " + boardlayout.id) ; 
                                //     // delete boardlayout.id  ;
                                //     boardlayout.id  = undefined ; 
                                //     // console.log("boardlayout.id2 " + boardlayout.id) ; 
                                //     // t_project_product_boardlayouts
                                // }
                            }

                            if(product.t_project_product_processes?.length) {

                                for(const process of product.t_project_product_processes) {
                                    //order_no貼りなおし
                                    if(process.order_no === 0 || process.order_no === undefined) {
                                        process.order_no = process.m_process_category?.order_no! 
                                    }

                                    // 工程
                                    // delete process.m_process_category ; 
                                    delete process._m_material01 ; 

                                    //工程材料トリム
                                    delete process.m_material01 ; 

                                    // 仕入先
                                    delete process._supplier_m_customer ;
                                    
                                    //貼り対象商品
                                    //@ts-ignore
                                    delete process.target_products ;

                                    /*** 不要項目をトリム　***/ 
                                    // 使用されているカラムを取得
                                    const fields = TProjectProductProcessUtil.getDefinedFieldNamesIncMixins(process) ; 
                                    // console.log(fields) ; 
                                    // 存在するカラムを取得
                                    const allFields = ObjectUtil.getPropertiesWoFunction(process) ; 

                                    for ( const f of allFields){
                                        if ( fields.indexOf(f) === -1){
                                            // @ts-ignore
                                            delete process[f] ; 
                                        }
                                    }

                                    if (! _.isNil(process.m_process_category)){
                                        // @ts-ignore
                                        delete process.m_process_category.m_processes ; 
                                        // @ts-ignore
                                        delete process.m_process_category.m_process_materials ; 
                                        // @ts-ignore
                                        delete process.m_process_category.m_process_outsources ; 
                                        // @ts-ignore
                                        delete process.m_process_category.m_process_labels ; 
        
                                    }
                                    // console.log(process)  ; 
                                    


                                    
                                }
                            }

                            // productOrderNo ++

                        }
                    }

                    //納品情報
                    if(trimed.t_project_deliveries?.length) {
                        for(const delivery of trimed.t_project_deliveries) {
                            // @ts-ignore
                            delete delivery.t_project ; 
                            // @ts-ignore
                            delete delivery.delivery_m_kv      ; 

                            //@ts-ignore
                            delete delivery.user_full_names
                            //@ts-ignore
                            delete delivery.user_last_names

                            //施工人員deleteInsert
                            // for ( const user of delivery.t_project_construction_users ){
                                
                            //     delete user.id  ;
                            // }

                            if(delivery.t_project_construction_results?.length) {    
        
                                for(const construnctionResult of delivery.t_project_construction_results) {

                                    //@ts-ignore
                                    delete construnctionResult.user_full_names
                                    //@ts-ignore
                                    delete construnctionResult.user_last_names

                                }
                            }
                        }
                    }

                    //添付ファイル
                    if(trimed.t_project_files?.length) {
                        for(const file of trimed.t_project_files) {
                            //@ts-ignore
                            if(_.isNil(file.is_unsave)  && _.isNil(file.is_updated)) {
                                
                                //旧方式のサムネイル保存方式の際はbase64_thumbnailをいかす
                                //データの移行完了次第if(_.isNil(file.base64_thumbnail_willdrop) ) を削除してもOK
                                
                                //@ts-ignore
                                if(_.isNil(file.base64_thumbnail_willdrop) ) {
                                    //@ts-ignore
                                    if(file.base64_thumbnail !== "img/noimage.png" && !file.is_folder) {
                                        //@ts-ignore
                                        delete file.base64_thumbnail ;
                                    }
                                    
                                }
                                
                                //@ts-ignore
                                delete file.base64_thumbnail_willdrop ;
                            }
                        }
                    }
                        
                }

                // console.log(trimed) ; 
            
                //保存エラー特定用のログ・原因判明次第削除
                // console.log(JSON.stringify(trimed)) ;
                // reject("") ; 
                // return ; 
                
                const res = await this.save(trimed) ;
                resolve(res) ;
            
            } catch (error) {

                reject(error) ; 
            }

        })
    }

    /**
     * t_projectのレコードを保存する
     * @param tProject 
     * @returns 
     */
    public static async save(tProject:TProject) : Promise<any> {    
        return new Promise(async (resolve,reject) => {

            let apiUrl = `${this.ep}` ;
            let res ;
            
            const isNew = _.isNil(tProject.id) ;

            try {
                    
                if(isNew) {
                    //新規
                    // console.log("add") ;
                    res =  await axios.post( apiUrl ,tProject ) ;
                    
                } else {
                    //編集
                    // console.log("edit") ;
                    apiUrl += `/${tProject.id}` ;
                    res = await axios.put( apiUrl, tProject) ;

                }

                // const parsed = TProject.parse(res.data ,store);
                resolve(res.data)

            } catch (error) {
                //@ts-ignore
                error.ep = apiUrl ; 
                reject(error) ; 
            }

            
        })
    }

}


