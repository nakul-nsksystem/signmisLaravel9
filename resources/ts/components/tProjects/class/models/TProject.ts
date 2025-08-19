import _, { NumericDictionaryIteratee } from "lodash";
import MKvsConst from "../../../../consts/MKvsConst";
import ArrayUtil from "../../../../frameworks/ArrayUtil";
import DayJsEx from "../../../../frameworks/DayJsEx";
import NumberUtil from "../../../../frameworks/NumberUtil";
import ObjectUtil from "../../../../frameworks/ObjectUtil";
import { TProjectAbstract } from "./TProjectAbstract";
import { TProjectProduct } from "./TProjectProduct";
import { TProjectDelivery } from "./TProjectDelivery";
import { TProjectProductProcess } from "./TProjectProductProcess";
import { TProjectMail } from "./TProjectMail";



export class TProject extends TProjectAbstract  { 
    public t_project_products:Array<TProjectProduct> = [] ; 
    public t_project_constructions = []
    public t_project_mails:Array<TProjectMail> = [] 
    public t_project_files = []
    public t_project_deliveries:Array<TProjectDelivery> = []  

    //public t_production_day_plans:Array<TProductionProcessPlan>

    constructor (createdMUserId:number ) { 
        super(createdMUserId) ;  
        // this.t_project_products = [] ; 
        //this.t_production_process_plan = []
    }

    memo:string = "" ; 
    get Memo():string { return this.memo ; } 
    set Memo(v:string) { this.memo = v ; } 
    
    get IsTProject():boolean{
        return true ; 
    }
    
    toJSON () {
        // 再計算＆カラムにセット
        this.ProfitPer          ; // 利益率（原価,売価,利益が含まれる）
        this.MarginProfitPer    ; // 限界利益率（変動費,限界利益が含まれる）


        let superJson = super.toJSON() ; 
        
        // @ts-ignore
        superJson.ordered_at = DayJsEx.format(this.ordered_at )  ; 
        // @ts-ignore
        superJson.estimate_date = DayJsEx.format(this.estimate_date) ; 
        return superJson ; 
    }

    po_project_name:string|null = null  ; 
    ordered_t_project_id:number|null = null ; 
    internal_quotation_memo:string|null = null  ;
    ss_order_id:string|null = null  ;
    ss_order_cd:string|null = null  ;

    /**見積系　サマリー画面にて編集 */
    estimate_no:string|null = null  ; 
    estimate_delivery_address:string|null = null  ; 
    estimate_delivery_m_kv_id:number|null = null  ; 
    estimate_condition:string|null = null  ; 

    estimate_term:string|null = null  ; 
    estimate_memo:string|null = null  ; 
    
    
    /**
     * 案件の状態名を取得
     */
    get StateName():string {         
        if ( this.IsOrderLost ) return "失注" ; 

        if ( ObjectUtil.isNU(this.ordered_at)) return "案件" ; 

        if ( ! ObjectUtil.isNU(this.sales_completed_at)) return "売上済" ; 

        return "受注" ; 
    } 

    /**
     * 案件の状態テキストクラス取得
     */
    get StateClass():string { 

        if ( this.IsOrderLost ) return "text-danger" ; 

        if ( ObjectUtil.isNU(this.ordered_at)) return "" ; 

        if ( ! ObjectUtil.isNU(this.sales_completed_at)) return "text-success" ; 

        return "text-info" ; 
    }


    /**
     * 生産計画済みデータが存在するか
     */
    get IsExistsProductionPlan():boolean { 
        
        for ( const product of this.t_project_products){
            for ( const process of product.t_project_product_processes){
                if (! _.isNil(process.t_production_process_plans)){
                    if ( process.t_production_process_plans.length > 0 ) return true ; 
                }
            }
        }
        return false ; 
    }

    /**
     * 生産実績データが存在するか
     */
     get IsExistsProductionResult():boolean { 
         
        for ( const product of this.t_project_products){
            for ( const process of product.t_project_product_processes){
                if (! _.isNil(process.t_production_results)){
                    if ( process.t_production_results.length > 0 ) return true ; 
                }
            }
        }
        return false ; 
    }

    /**
     * 受注していない状態に処理可能か
     */
    get IsAbleToReturnNonOrder():boolean{
        return ! this.IsExistsProductionResult && ! this.IsExistsProductionPlan ; 
    }

    /**
     * 使用中のリレーション用uid配列
     */
    get ExistUids():Array<number | null | undefined>{
        //@ts-ignore
        // const fileUids = this.t_project_files.map(x => x.uid) ;
        //@ts-ignore
        const productUids = this.t_project_products.map(x => x.uid).filter(e => e != null) ;
        //@ts-ignore
        const deliveryUids = this.t_project_deliveries.map(x => x.uid).filter(e => e != null) ; 
        
        if(_.isEmpty(productUids) && _.isEmpty(deliveryUids)) return [] ;

        return [...productUids,...deliveryUids] ;
    }

    

    /**
     * 拠点ID
     */
    m_branch_id:number = 0 ;     
    public static MBranchId_PName = "MBranchId" ; 
    get MBranchId ():number { return this.m_branch_id; }
    set MBranchId (v:number ){ this.m_branch_id = v ; }
 
    /**
     * 顧客ID
     */
    m_customer_id:number = 0 ;     
    public static MCustomerId_PName = "MCustomerId" ; 
    get MCustomerId ():number { return this.m_customer_id; }
    set MCustomerId (v:number ){ this.m_customer_id = v ; }

    /**
     * コード
     */
    cd:string = "" ;     
    public static Cd_PName = "Cd" ; 
    get Cd ():string { return this.cd; }
    set Cd (v:string ){ this.cd = v ; }
 
    /**
     * 顧客担当者
     */
    customer_user_name:string = "" ;     
    public static CustomerUserName_PName = "CustomerUserName" ; 
    get CustomerUserName ():string { return this.customer_user_name; }
    set CustomerUserName (v:string ){ this.customer_user_name = v ; }

    /**
     * 顧客担当者id 廃止
     */
    // m_customer_person_id:number|null = null ;
    // public static MCustomerPersonId_PName = "MCustomerPersonId" ;
    // get MCustomerPersonId ():number|null {return this.m_customer_person_id ;}
    // set MCustomerPersonId (v:number|null) { 
    //     if(v == 0 ) {
    //         this.m_customer_person_id = null ;    
    //     } else {
    //         this.m_customer_person_id = v ; 
    //     }
    // }
    // /**
    //  * 顧客担当者(マスターから)
    //  */
    // m_customer_person:object = {} ;
    // get MCustomerPerson ():object {return this.m_customer_person ;}
    // set MCustomerPerson (v:object) { this.m_customer_person = v ; }
    
    // /**
    //  * 顧客担当者手入力フラグ
    //  */
    // is_input_customer_user:boolean = true ; 
    // get IsInputCustomerUser ():boolean { return this.is_input_customer_user; }
    // set IsInputCustomerUser (v:boolean ){ this.is_input_customer_user = v ; }

    /**
     * 納品完了メール送信先
     */
    delivery_mail_to:string|null = null ;
    public static DeliveryMailTo_PName = "DeliveryMailTo" ; 
    get DeliveryMailTo ():string|null { return this.delivery_mail_to; }
    set DeliveryMailTo (v:string|null ){ this.delivery_mail_to = v ; } 

    /**
     * 表示する顧客担当者メール　廃止
     */
    // get DisplayDeliveryMail():string{
    //     //@ts-ignore
    //     return this.IsInputCustomerUser ? this.DeliveryMailTo :  this.MCustomerPerson?.email ;
    // }

    // /**
    //  * 表示する顧客担当者
    //  */
    // get DisplayCustomerUserName():string{
    //     //@ts-ignore
    //     return this.IsInputCustomerUser ? this.CustomerUserName :  this.MCustomerPerson?.name ;
    // }


    /**
     * 物件名
     */
    name:string = "" ;     
    public static Name_PName = "Name" ; 
    get Name ():string { return this.name; }
    set Name (v:string ){ this.name = v ; }
 
    /**
     * 営業担当ID
     */
    sales_m_user_id:number = 0 ;     
    public static SalesMUserId_PName = "SalesMUserId" ; 
    get SalesMUserId ():number { return this.sales_m_user_id; }
    set SalesMUserId (v:number ){ this.sales_m_user_id = v ; }
 

    /**
     * Is失注
     */
    is_order_lost:boolean = false ; 
    get IsOrderLost ():boolean { return this.is_order_lost; }
    set IsOrderLost (v:boolean ){
        if ( v && ! _.isNil(this.sales_completed_at)){            
            return ; 
        }
        
        this.is_order_lost = v ; 

        if ( v) { 
            this.OrderedAt = null ;     
        }
    
    }

    /**
     * 受注日
     */
    ordered_at:Date|null = null ;     
    public static OrderedAt_PName = "OrderedAt" ; 
    get OrderedAt ():Date|null { return this.ordered_at; }
    set OrderedAt (v:Date|null ){ this.ordered_at = v ; }

    /**
     * 受注担当者
     */
    ordered_m_user_id:number|null = null ;     
    public static OrderedMUserId_PName = "OrderedMUserId" ; 
    get OrderedMUserId ():number|null { return this.ordered_m_user_id; }
    set OrderedMUserId (v:number|null ){ this.ordered_m_user_id = v ; }
    
    /**
     * 客先注文No
     */
    customer_order_no:string = "" ;     
    public static CustomerOrderNo_PName = "CustomerOrderNo" ; 
    get CustomerOrderNo ():string { return this.customer_order_no; }
    set CustomerOrderNo (v:string ){ this.customer_order_no = v ; }
 
    /**
     * 売上完了日
     */    
    sales_completed_at:Date|null = null ;     
    public static SalesCompletedAt_PName = "SalesCompletedAt" ; 
    get SalesCompletedAt ():Date|null { return this.sales_completed_at; }
    set SalesCompletedAt (v:Date|null ){ this.sales_completed_at = v ; }

    /**
     * 送料
     */
    delivery_fee:number = 0 ;     
    public static DeliveryFee_PName = "DeliveryFee" ; 
    get DeliveryFee ():number { return this.delivery_fee; }
    set DeliveryFee (v:number ){ this.delivery_fee = v ; }
    /**
     * その他費用
     */
    construction_fee:number = 0 ;     
    public static ConstructionFee_PName = "ConstructionFee" ; 
    get ConstructionFee ():number { return this.construction_fee; }
    set ConstructionFee (v:number ){ this.construction_fee = v ; }

    /**
     * その他費用
     */
    other_fee:number = 0 ;     
    public static OtherFee_PName = "OtherFee" ; 
    get OtherFee ():number { return this.other_fee; }
    set OtherFee (v:number ){ this.other_fee = v ; }

    /**
     * 見積日
     */
    estimate_date:Date|null = null ;     
    public static EstimateDate_PName = "EstimateDate" ; 
    get EstimateDate ():Date|null { return this.estimate_date; }
    set EstimateDate (v:Date|null ){ this.estimate_date = v ; }

    /** 
     * 見積納期
     */
    estimate_delivery_date:string|null = null  ;
    
    /**
     * 見積承認日
     */
    est_approved_at:Date|null = null  ; 
    
    /**
     * 見積承認者
     */
    est_approved_m_user_id:number|null = null  ; 
    
    /**
     * 最終保存原価
     */
    last_saved_cost:number = 0  ; 
    /**
     * 最終保存売価
     */
    last_saved_sell_price:number = 0  ; 

    /**
     * 最終保存売価と変更があるフラグ
     */
    get IsPriceUpdated():boolean {
        const isSellPriceUpdated = NumberUtil.invalid2zr(this.last_saved_sell_price) != NumberUtil.invalid2zr(this.total_sell_price) 
        const isCostUpdated = NumberUtil.invalid2zr(this.last_saved_cost) != NumberUtil.invalid2zr(this.total_cost); 
        return isSellPriceUpdated || isCostUpdated ;
    }
    /**
     * 有効な商品
     */
     get EnabledProducts():Array<TProjectProduct>{
        const filterd = this.t_project_products.filter(x => _.isNil( x.deleted_at)) ;
        return filterd ; 
    }
    
    //#region サマリー系

    /**
     * 総重量
     */    
    total_weight:number = 0 ; 
    get TotalWeight ():number {         
        const val = _.ceil(_.sumBy( this.EnabledProducts , "TotalWeight") ,3)  ;         
        this.total_weight = val ?? 0 ; 
        return this.total_weight ;
    }
 
    /**
     * 総予想生産時間
     */    
    total_hour_for_production:number = 0 ; 
    get TotalHourForProduction ():number {         
        const val = _.ceil(_.sumBy( this.EnabledProducts , "total_hour_for_production") ,3)  ;         
        this.total_hour_for_production = val ?? 0 ; 
        
        return this.total_hour_for_production ;
    }
     
    /**
     * 総原価
     */    
    total_cost:number = 0 ; 
    get TotalCost ():number {         
        let val = _.ceil(_.sumBy( this.EnabledProducts , "total_cost") ,3) ?? 0 ;         
        val += this.delivery_fee  ; 
        val += this.construction_fee  ; 
        val += this.other_fee  ; 
        if ( val !== this.total_cost) { 
            this.total_cost = val ; 
        }
        return this.total_cost ;
    }

    
    /**
     * 総売価
     */
    total_sell_price:number = 0 ; 
    get TotalSellPrice ():number { 
        let val = _.ceil(_.sumBy( this.EnabledProducts , "total_sell_price") ,3) ?? 0 ;         
        val += this.delivery_fee ; 
        val += this.construction_fee  ; 
        if ( val !== this.total_sell_price) { 
            this.total_sell_price = val     
        }
        return this.total_sell_price  ; 
    
    }

     
    /**
     * 総利益
     */    
    total_profit:number = 0 ; 
    get TotalProfit ():number {         
        let val = NumberUtil.invalid2zr( this.TotalSellPrice - this.TotalCost) ; 
        this.total_profit = val ; 
        return this.total_profit ;
    }


    /**
     * 利益率
     */
    profit_per:number = 0 ; 
    get ProfitPer ():number {
        
        let val
        //原価売価が両方とも負の時は利益率の計算が不可能なので0%とする
        if(NumberUtil.getSign(this.TotalProfit) == -1 && NumberUtil.getSign(this.TotalSellPrice) == -1 ) {
            val = 0 ;
        }
        else {
            // 無限Loopなる
            val = NumberUtil.invalid2zr( this.TotalProfit / this.TotalSellPrice) * 100 ; 
        }
        
        // let val = NumberUtil.invalid2zr( this.TotalProfit / this.TotalSellPrice) * 100 ; 
        this.profit_per = val ?? 0 ;
        return this.profit_per  ;             
    }

    /**
     * 総変動費
     */
    total_variable_cost:number = 0 ; 
    get TotalVariableCost ():number {         
        let val = _.ceil(_.sumBy( this.EnabledProducts , "total_variable_cost") ,3) ?? 0  ; 
        val += this.delivery_fee ; 
        if ( val !== this.total_variable_cost){
            this.total_variable_cost = val ; 
        }
        return this.total_variable_cost  ;             
    }



    /**
     * 総限界利益
     */
    total_margin_profit:number = 0 ; 
    get TotalMarginProfit ():number {         
        let val = NumberUtil.invalid2zr( this.TotalSellPrice - this.TotalVariableCost) ; 
        this.total_margin_profit = val ?? 0 ;
        return this.total_margin_profit  ;             
    }

    
    /**
     * 限界利益率
     */
    margin_profit_per:number = 0 ; 
    get MarginProfitPer ():number {         
        let val = NumberUtil.invalid2zr( this.TotalMarginProfit / this.TotalSellPrice) * 100 ;         
        this.margin_profit_per = val ?? 0 ;
        return this.margin_profit_per  ;             
    }



 
    //#endregion

    /**
     * 同じ内容かチェック
     * @param obj 
     * @returns 
     */
    public isSame(obj:Partial<TProject>):boolean{
        if ( _.isNil(obj) ) return false ; 

        const copied = ObjectUtil.deepCopyJ(this) as Partial<TProject>; 
        
        const targets = [obj , copied] ; 
        // 誤動作の原因になるオブジェクトを削除
        for ( const target of targets){
            if ( _.isNil(target) ) return false ; 

            if ( ! _.isNil(target.t_project_products)){
                // @ts-ignore
                delete target["m_customer"] ;
                for ( const product of target.t_project_products){
                    // @ts-ignore
                    delete product["unit_m_kv"] ;
                    
                    //@ts-ignore
                    if( ! _.isNil(product.t_project_file)) {
                        
                        // @ts-ignore
                        if(product.t_project_file.m_tag_links) delete product.t_project_file.m_tag_links ;
                        // @ts-ignore
                        if(product.t_project_file.appFlg !== undefined) delete product.t_project_file.appFlg ;
                        
                    }
                }
            }

            if ( ! _.isNil(target.t_project_files)){                    
                for(const file of target.t_project_files) {

                    let tagIds : Array<number> = []
                    // @ts-ignore
                    if(file.m_tags.length > 0) {
                        // @ts-ignore
                        tagIds = file.m_tags.map(x=>x.id)
                    }
                    // @ts-ignore
                    if(file.m_tag_links && file.m_tag_links.t_project_files_category.length === 0) delete file.m_tag_links ;
                    // @ts-ignore
                    if(file.appFlg !== undefined) delete file.appFlg ;
                    //@ts-ignore
                    if(!file.m_tag_links) {
                        //@ts-ignore
                        file.m_tag_links = {} ;
                        //@ts-ignore
                        file.m_tag_links["t_project_files_category"] = tagIds ;
                    }

                }        
            }    
        }
        

        const objJson    = JSON.stringify(obj) ;        
        const copiedJson = JSON.stringify(copied) ;     
        
        // console.log("lastSavedJson") ;
        // console.log(objJson) ;
        // console.log("dValueJson") ;
        // console.log(copiedJson) ;
        return objJson === copiedJson ; 

    }

    /**
     * コピー時の初期化
     */
    public initWhenCopy(loginUserId:number){
        // console.log("initWhenCopy:" + loginUserId ) ; 
        this.id = undefined ; 
        this.CreatedMUserId = loginUserId ; 
        this.Cd = "" ;

        //失注フラグのクリア
        this.IsOrderLost = false ;

        // 売価格のクリア
        let isClearSalesPrice = false ;                 

        // 送料等のクリア
        let isClearDeliveryFee = false ;  

        if ( _.isNil(this._store)){
            console.error("_store of TProject is not set ") ;                     
        }
        else { 
            // @ts-ignore
            isClearSalesPrice = this._store.masters.getSMOptionValByKeyMKvId(MKvsConst.SmOptions.Project.IS_CLEAR_SALES_PRICES_WHEN_COPY) ;  ; 

            // @ts-ignore
            isClearDeliveryFee = this._store.masters.getSMOptionValByKeyMKvId(MKvsConst.SmOptions.Project.IS_CLEAR_DELIVERY_FEES_WHEN_COPY) ;  ; 
        }

        for(const product of this.t_project_products ){
            if(product) {
                product.id = undefined ; 
                product.t_project_id = undefined ; 
                product.CreatedMUserId = loginUserId ; 
                
                //古い物件対策
                if(_.isNil(product.uid)) {
                    let uid = Math.floor(Math.random() * (1000 - 1)) + 1 ;
                    while(this.ExistUids.indexOf(uid) !== -1) {
                        uid = Math.floor(Math.random() * (1000 - 1)) + 1 ;
                    }
                    product.uid = uid ;
                }

                for(const process of product.t_project_product_processes) {
                    if(process) {
                        process.id = undefined ;                         
                        process.t_p_order_details.splice(0) ;
                        process.is_ordered = false ;
                        process.is_use_stocked = false ;
                        process.t_production_process_plans.splice(0) ; 
                        process.CreatedMUserId = loginUserId ; 
                    }
                }
                for(const board of product.t_project_product_boardlayouts) {
                    if(board) {
                        board.id = undefined ;                         
                        board.t_project_product_id = undefined ; 
                        board.CreatedMUserId = loginUserId ; 
                    }
                }

                for(const separate of product.t_project_product_separates) {
                    if(separate) {
                        separate.id = undefined ; 
                        separate.t_project_product_id = undefined ; 
                        separate.CreatedMUserId = loginUserId ; 
                    }
                }

                // for(const estimate of product.t_project_product_estimate_details) {
                //     if(estimate) {
                //         this.deleteValidColumn(estimate,"t_project_product_id") ;
                //     }
                // }
                // delete product.t_project_product_estimate_details ;
                product.t_project_product_estimate_details.splice(0) ;
                // @ts-ignore
                product.t_project_file = {};
                product.t_project_file_id = null;
                product.t_project_file_uid = null;
                product.delivery_date = null;
                product.sales_completed_at = null;

                product.t_project_deliveries = [];
                
                if ( isClearSalesPrice){
                    product.sell_price = 0 ;
                    product.total_sell_price = 0;    
                }

            }
        }


        
        this.customer_order_no = "";
        this.po_project_name = "";
        this.ss_order_id = null;
        this.ss_order_cd = null;
        this.ordered_t_project_id = null  ;
        this.ordered_at = null;
        this.ordered_m_user_id = null;
        this.sales_completed_at = null;
        if ( isClearDeliveryFee ) { 
            this.delivery_fee = 0;
        }
        
        this.other_fee = 0;
        this.internal_quotation_memo = "";

    
        this.estimate_no = "";
        this.estimate_date = null;
        this.estimate_delivery_date = "";
        this.estimate_delivery_address = "";
        this.estimate_delivery_m_kv_id = null;
        this.estimate_condition = "";
        this.estimate_term = "";
        this.estimate_memo = "";
        this.est_approved_at = null ;
        this.est_approved_m_user_id = null ;

        this.t_project_files.splice(0) ;
        this.t_project_deliveries.splice(0) ;
        this.t_project_constructions.splice(0) ;
        this.t_project_mails.splice(0) ;

        // @ts-ignore
        delete this.t_sale_details ;            
        // @ts-ignore
        delete this.when_ordered_t_project ;
        // @ts-ignore
        delete this.min_delivery ;
        // @ts-ignore
        delete this.estimate_formatted_no ;
        // @ts-ignore
        delete this.display_estimate_delivery_address ;
        // @ts-ignore
        delete this.display_estimate_condition ;
        // @ts-ignore
        delete this.display_estimate_term ;


        
    }


    public static parse(obj:Partial<TProject> ){
        const row = new TProject(obj.created_m_user_id ?? 0) ;  
        Object.assign(row, obj);

        
        const parsedProducts = row.t_project_products.map(x => TProjectProduct.parse(x)) ; 
        ArrayUtil.resetInsert(row.t_project_products , parsedProducts) ; 

        const parsedDeliveries = row.t_project_deliveries.map(x => TProjectDelivery.parse(x)) ; 
        ArrayUtil.resetInsert(row.t_project_deliveries , parsedDeliveries) ; 

        //商品添付ファイル紐づけ
        //base64_thumbnailを重複させない為サーバー側リレーションで持ってくるのではなくここで紐づけ        
        for(const tProduct of parsedProducts) {
            if(_.isEmpty(tProduct.t_project_file) && !_.isNil(tProduct.t_project_file_id)) {
                //@ts-ignore
                tProduct.t_project_file = row.t_project_files.find( e => e.id == tProduct.t_project_file_id) ?? {};
            }
            
        }
        
        // const parsedList = []
        // for (const product of row.t_project_products){
        //     const parsed =  TProjectProduct.parse(product ,store ) ; 
        //     parsedList.push(parsed)
        // }

        // row.t_project_products.splice(
        //     0 , 
        //     row.t_project_products.length , 
        //     ...parsedList , 
        // )
        
        return row ; 
    }

    
    public static is(arg:any):arg is TProject { 
        if ( arg?.IsTProject === undefined) return false ; 
        return arg.IsTProject ; 
    } 

}



