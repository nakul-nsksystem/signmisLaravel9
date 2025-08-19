import _, { NumericDictionaryIteratee } from "lodash";
import NumberUtil from "../../../../frameworks/NumberUtil";
import ObjectUtil from "../../../../frameworks/ObjectUtil";
import ArrayUtil from "../../../../frameworks/ArrayUtil";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";
import { MTag } from "../../../masters/class/models/MTag";
import { MCustomer } from "../../../masters/class/models/MCustomer";
import { TProjectProduct } from "./TProjectProduct";
import { TProject } from "./TProject";
import { TProjectConstructionUser } from "./TProjectConstructionUser";
import { TProjectConstructionResult } from "./TProjectConstructionResult";
import axios from "axios";




export class TProjectDelivery extends DbRowAbstract  { 

    uid:number|null = null ;  
    t_project_id:number|null = null ;  
    reuse_t_project_delivery_id:number|null = null ;  
    
    /**
     * 履歴として使用するフラグ
     */
    is_reuse:boolean = false ;  
    public static IsReuse_PName = "IsReuse" ; 
    get IsReuse ():boolean { return this.is_reuse ; }
    set IsReuse (v:boolean ){ this.is_reuse = v ; } 

    /**
     * 納品区分
     */
    delivery_m_kv_id :number|null = null ;
    public static DeliveryMKvId_PName = "DeliveryMKvId" ; 
    get DeliveryMKvId ():number|null { return this.delivery_m_kv_id ?? null ; }
    set DeliveryMKvId (v:number|null ){ this.delivery_m_kv_id = v ; } 

    delivery_m_kv :object|undefined = {} ;
    public static DeliveryMKv_PName = "DeliveryMKv" ; 
    get DeliveryMKv ():object|undefined { return this.delivery_m_kv ?? undefined ; }
    set DeliveryMKv (v:object|undefined ){ this.delivery_m_kv = v ; } 


    /**
     * 発送元拠点id
     */
    m_branch_id : number|null = null ;
    public static MBranchId_PName = "MBranchId" ;
    get MBranchId ():number|null { return this.m_branch_id ?? null ; }
    set MBranchId (v:number|null ){ this.m_branch_id = v ; } 


    /**
     * 納品日(出荷日)
     */
    delivery_at :any = null ;
    public static DeliveryAt_PName = "DeliveryAt" ; 
    get DeliveryAt ():any { return this.delivery_at ?? null ; }
    set DeliveryAt (v:any ){ this.delivery_at = v ; }    

    /**
     * 納品時刻(出荷日)
     */
    delivery_time :string = "" ;
    public static DeliveryTime_PName = "DeliveryTime" ; 
    get DeliveryTime ():string { return this.delivery_time ?? "" ; }
    set DeliveryTime (v:string ){ this.delivery_time = v ; }

    /**
     * 着日
     */
    arrival_at :any = null ;
    public static ArrivalAt_PName = "ArrivalAt" ; 
    get ArrivalAt ():any { return this.arrival_at ?? null ; }
    set ArrivalAt (v:any ){ this.arrival_at = v ; }

    /**
     * 着日時刻
     */
    arrival_time :string = "" ;
    public static ArrivalTime_PName = "ArrivalTime" ; 
    get ArrivalTime ():string { return this.arrival_time ?? "" ; }
    set ArrivalTime (v:string ){ this.arrival_time = v ; }
    

    /**
     * 納品物名
     */
    delivery_product_name :string = "" ;
    public static DeliveryProductName_PName = "DeliveryProductName" ; 
    get DeliveryProductName ():string { return this.delivery_product_name ?? "" ; }
    set DeliveryProductName (v:string ){ this.delivery_product_name = v ; }

    /**
     * タグ
     */
    m_tags :Array<MTag>|undefined = [] ;
    public static MTags_PName = "MTags" ; 
    get MTags ():Array<MTag>|undefined { return this.m_tags ?? [] ; }
    set MTags (v:Array<MTag>|undefined ){ this.m_tags = v ; } 

   
    /**
     * 個口数
     */
    num_of_boxes :number|null = null ;
    public static NumOfBoxes_PName = "NumOfBoxes" ; 
    get NumOfBoxes ():number|null { return this.num_of_boxes ?? null ; }
    set NumOfBoxes (v:number|null ){ this.num_of_boxes = v ; } 

    /**
     * 備考
     */
    memo :string|null = null ;
    public static Memo_PName = "Memo" ; 
    get Memo ():string|null { return this.memo ?? null ; }
    set Memo (v:string|null ){ this.memo = v ; }

    /**
     * 納品先顧客Id
     */
    delivery_m_customer_id :number|null = null
    public static DeliveryMCustomerId_PName = "DeliveryMCustomerId" ; 
    get DeliveryMCustomerId ():number|null { return this.delivery_m_customer_id ?? null ; }
    set DeliveryMCustomerId (v:number|null ){ this.delivery_m_customer_id = v ; }   
    
    delivery_m_customer? : MCustomer
    public static DeliveryMCustomer_PName = "DeliveryMCustomer" ; 
    get DeliveryMCustomer ():MCustomer|undefined  { return this.delivery_m_customer ?? undefined ; }
    set DeliveryMCustomer (v:MCustomer|undefined ){ 
        this.SetMCustomerVal(v,this.delivery_customer_user ,"customer")
        this.delivery_m_customer = v ; 
    }
    
    /**
     * 納品先名
     */
    delivery_customer_name :string|null = null ;
    public static DeliveryCustomerName_PName = "DeliveryCustomerName" ; 
    get DeliveryCustomerName ():string|null { return this.delivery_customer_name ?? null ; }
    set DeliveryCustomerName (v:string|null ){ this.delivery_customer_name = v ; }

    /**
     * 納品先住所
     */
    delivery_customer_address :string|null = null ;
    public static DeliveryCustomerAddress_PName = "DeliveryCustomerAddress" ; 
    get DeliveryCustomerAddress ():string|null { return this.delivery_customer_address ?? null ; }
    set DeliveryCustomerAddress (v:string|null ){ this.delivery_customer_address = v ; }
    
    /**
     * 納品先郵便番号
     */
    delivery_customer_zip :string|null = null ;
    public static DeliveryCustomerZip_PName = "DeliveryCustomerZip" ; 
    get DeliveryCustomerZip ():string|null { return this.delivery_customer_zip ?? null ; }
    set DeliveryCustomerZip (v:string|null ){ this.delivery_customer_zip = v ; }

    /**
     * 納品先担当者
     */
    delivery_customer_user :string|null = null ;
    public static DeliveryCustomerUser_PName = "DeliveryCustomerUser" ; 
    get DeliveryCustomerUser ():string|null { return this.delivery_customer_user ?? null ; }
    set DeliveryCustomerUser (v:string|null ){ this.delivery_customer_user = v ; }

    /**
     * 納品先電話
     */
    delivery_customer_tel :string|null = null ;
    public static DeliveryCustomerTel_PName = "DeliveryCustomerTel" ; 
    get DeliveryCustomerTel ():string|null { return this.delivery_customer_tel ?? null ; }
    set DeliveryCustomerTel (v:string|null ){ this.delivery_customer_tel = v ; }

    /**
     * 荷主顧客Id
     */
    delivery_owner_m_customer_id :number|null = null
    public static DeliveryOwnerMCustomerId_PName = "DeliveryOwnerMCustomerId" ; 
    get DeliveryOwnerMCustomerId ():number|null { return this.delivery_owner_m_customer_id ?? null ; }
    set DeliveryOwnerMCustomerId (v:number|null ){ this.delivery_owner_m_customer_id = v ; }  
    
    delivery_owner_m_customer? : MCustomer 
    public static DeliveryOwnerMCustomer_PName = "DeliveryOwnerMCustomer" ; 
    get DeliveryOwnerMCustomer ():MCustomer|undefined  { return this.delivery_owner_m_customer ?? undefined ; }
    set DeliveryOwnerMCustomer (v:MCustomer|undefined ){ 
        this.SetMCustomerVal(v,this.delivery_customer_user ,"owner")
        this.delivery_owner_m_customer = v ; 
    
    }
     
    /**
     * 荷主名
     */
    delivery_owner_name :string|null = null ;
    public static DeliveryOwnerName_PName = "DeliveryOwnerName" ; 
    get DeliveryOwnerName ():string|null { return this.delivery_owner_name ?? null ; }
    set DeliveryOwnerName (v:string|null ){ this.delivery_owner_name = v ; }
 
    /**
     * 荷主住所
     */
    delivery_owner_address :string|null = null ;
    public static DeliveryOwnerAddress_PName = "DeliveryOwnerAddress" ; 
    get DeliveryOwnerAddress ():string|null { return this.delivery_owner_address ?? null ; }
    set DeliveryOwnerAddress (v:string|null ){ this.delivery_owner_address = v ; }
     
    /**
     * 荷主郵便番号
     */
    delivery_owner_zip :string|null = null ;
    public static DeliveryOwnerZip_PName = "DeliveryOwnerZip" ; 
    get DeliveryOwnerZip ():string|null { return this.delivery_owner_zip ?? null ; }
    set DeliveryOwnerZip (v:string|null ){ this.delivery_owner_zip = v ; }
 
    /**
     * 荷主担当者
     */
    delivery_owner_user :string|null = null ;
    public static DeliveryOwnerUser_PName = "DeliveryOwnerUser" ; 
    get DeliveryOwnerUser ():string|null { return this.delivery_owner_user ?? null ; }
    set DeliveryOwnerUser (v:string|null ){ this.delivery_owner_user = v ; }
 
    /**
     * 荷主電話
     */
    delivery_owner_tel :string|null = null ;
    public static DeliveryOwnerTel_PName = "DeliveryOwnerTel" ; 
    get DeliveryOwnerTel ():string|null { return this.delivery_owner_tel ?? null ; }
    set DeliveryOwnerTel (v:string|null ){ this.delivery_owner_tel = v ; }
    
    /**
     * 夜間
     */
    is_night_work :boolean = false 
    public static IsNightWork_PName = "IsNightWork" ; 
    get IsNightWork ():boolean { return this.is_night_work ?? false ; }
    set IsNightWork (v:boolean ){ this.is_night_work = v ; }
    
    /**
     * 休日
     */
    is_holiday_work :boolean = false
    public static IsHolidayWork_PName = "IsHolidayWork" ; 
    get IsHolidayWork ():boolean { return this.is_holiday_work ?? false ; }
    set IsHolidayWork (v:boolean ){ this.is_holiday_work = v ; } 

    /**
     * 施工持ち物
     */
    construction_belongings :string|null = null ;
    public static ConstructionBelongings_PName = "ConstructionBelongings" ; 
    get ConstructionBelongings ():string|null { return this.construction_belongings ?? null ; }
    set ConstructionBelongings (v:string|null ){ this.construction_belongings = v ; }

    /**
     * 施工開始時間
     */
    construction_start_time :any|null = null ;
    public static ConstructionStartTime_PName = "ConstructionStartTime" ; 
    get ConstructionStartTime ():any|null { return this.construction_start_time ?? null ; }
    set ConstructionStartTime (v:any|null ){ this.construction_start_time = v ; }

    /**
     * 施工終了時間
     */
    construction_end_time :any|null = null ;
    public static ConstructionEndTime_PName = "ConstructionEndTime" ; 
    get ConstructionEndTime ():any|null { return this.construction_end_time ?? null ; }
    set ConstructionEndTime (v:any|null ){ this.construction_end_time = v ; }
    
    invoice_no :string|null = null
    delivery_completed_at :Date|null = null 
    delivery_completed_m_user_id :number|null = null 
    mail_sent_at :Date|null = null
    mail_postscript :string|null = null

    shipping_mail_to :string|null = null ;
    public static ShippingMailTo_PName = "ShippingMailTo" ; 
    get ShippingMailTo ():string|null { return this.shipping_mail_to ?? null ; }
    set ShippingMailTo (v:string|null ){ this.shipping_mail_to = v ; }

    t_project?:TProject ;

    //物件顧客id
    get tProjectCustomerId() : number|undefined {
        
        if(this.t_project?.m_customer_id === undefined ) return undefined ;
        
        return this.t_project.m_customer_id ;

    }

    //物件拠点id
    get tProjectBranchId() : number|undefined {
        
        if(this.t_project?.m_branch_id === undefined ) return undefined ;
        
        return this.t_project.m_branch_id ;
        
    }

    //物件顧客担当者
    get tProjectCustomerUser() : string {
        
        if(this.t_project === undefined ) return "" ;

        return this.t_project.CustomerUserName ;
        
    }

    //物件顧客名
    get tProjectCustomerName() : string {
        
        if(this.tProjectCustomerId === undefined ) return "" ;
        //@ts-ignore
        return this.t_project?.m_customer?.name ;
        
    }


    public t_project_products:Array<TProjectProduct> = [] ;  

    get TotalSqm():number { 
        if(_.isEmpty( this.t_project_products)) return 0 ;
        return _.sumBy( this.t_project_products , (x) => 
             NumberUtil.invalid2zr( x?.total_sqm  )); 
    }
    get TotalWeight():number { 
        if(_.isEmpty( this.t_project_products)) return 0 ;
        return _.sumBy( this.t_project_products , (x) =>
            NumberUtil.invalid2zr( x?.total_weight )); 
    }
    //防炎シール枚数
    get NumOfFirePrevention():number { 
        if(_.isEmpty( this.t_project_products)) return 0 ;
        
        return _.sumBy( this.t_project_products , (x) => {
                        return x?.is_needed_labels_for_fire_prevention ? NumberUtil.invalid2zr( x?.qty ) : 0
                    }); 
    }

    
    //未保存の商品と紐づける際にデータを渡す
    public _t_project_products:Array<any> = [] ;  

    public t_project_construction_users:Array<TProjectConstructionUser> = [] ;     
    
    //外注
    outsources :Array<object> = []
    public static Outsources_PName = "Outsources" ; 
    get Outsources() : Array<object> {    
        // if(this.t_project_construction_users !== undefined ) {
        //     //@ts-ignore
        //     this.outsources = this.t_project_construction_users.filter(x => x.m_user_id == null) 

        // }
        return this.outsources ?? []; 
    }
    set Outsources (v: Array<object> ){ this.outsources = v ; }

    //社内
    selected_m_user_ids :Array<number> = []
    public static SelectedMUserIds_PName = "SelectedMUserIds" ; 
    get SelectedMUserIds() : Array<number>{ return this.selected_m_user_ids ?? [] ;}
    set SelectedMUserIds (v: Array<number> ){ this.selected_m_user_ids = v ; }


    //ユーザーid初期値配列
    get SetUserIds() : Array<number> {

        if(this.t_project_construction_users === undefined ) return [] ;

        //@ts-ignore
        let userList = this.t_project_construction_users.filter( x => x.m_user_id != null ) ;             

        //@ts-ignore
        return userList.map(x => x.m_user_id ) ;
    }


    //施工実績
    public t_project_construction_results:Array<TProjectConstructionResult> = [] ;     



    /**
     * 顧客情報のセット
     * @param customer mCustomerのレコード
     * @param userName 物件担当者名
     * @param type 直送荷主(owner)か納品先(customer)か両方(all)か 
     */
    public SetMCustomerVal(customer:MCustomer|undefined,userName:string|null,type:string){
        
        if(customer === undefined ) return ;

        switch(type){
            
            case "customer" :
                this.delivery_m_customer_id = customer.id ?? null ;
                // this.delivery_m_customer = customer ?? null ;
                this.delivery_customer_name = customer.name ?? null ;
                this.delivery_customer_address = customer.display_address ?? null ;
                this.delivery_customer_zip = customer.zip ?? null ;
                this.delivery_customer_tel = customer.tel ?? null ;
                // this.shipping_mail_to = customer.email ?? null ;
                // this.delivery_customer_user = this.delivery_customer_user ?? userName ?? null ;                
                break ;
            
            case "owner" : 
                this.delivery_owner_m_customer_id = customer.id ?? null ;
                // this.delivery_owner_m_customer = customer ?? null ;
                this.delivery_owner_name = customer.name ?? null;
                this.delivery_owner_address = customer.display_address ?? null ;
                this.delivery_owner_zip = customer.zip ?? null;
                this.delivery_owner_tel = customer.tel ?? null;
                // this.shipping_mail_to = customer.email ?? null ;
                // this.delivery_owner_user = this.delivery_customer_user ?? userName ?? null ;
                break ;
            
            case "all" : 
                this.SetMCustomerVal(customer,userName,"customer") ;
                this.SetMCustomerVal(customer,userName,"owner") ;
                break ;

        }

    }
    /**
     * 郵便番号から住所を取得
     * @param zip 
     */
    public async getZipInfo (zip:string|null) {
            
        if(!zip) return ;

        return new Promise(async (resolve,reject) => {
            const apiUrl = `api/mCustomer/getZipInfo/${zip}`; ;
            try {
                //console.log(JSON.stringify(conditions)) ;
                const res = await axios.get(apiUrl) ;
                const address = res.data.results[0].address1 + res.data.results[0].address2 + res.data.results[0].address3 ;
                resolve(address) ;

            }
            catch (error ) {
                // @ts-ignore
                error.ep = apiUrl ;
                reject(error) ;

            }

        }) ;

    }

    /**
     * コピーのために不必要なID類を削除
     */
    public clearRelations4Copy(id:number,userId:number){
        this.id = undefined ;

        //コピー前のIdをuidとする
        this.uid = id ; 
        this.t_project_id = null ;  

        this.reuse_t_project_delivery_id = null ; 
        this.is_reuse= false ;  

        this.invoice_no = null ; 
        this.delivery_completed_at = null ; 
        this.delivery_completed_m_user_id = null ; 
        this.mail_sent_at = null ; 
        this.mail_postscript = null ; 
        //@ts-ignore
        this.is_delivery_completed = false ;
        this.created_m_user_id = userId ;
        const copiedP = _.cloneDeep(this.t_project_products) ;
        for ( const product of copiedP ){
            this._t_project_products.push(
                {
                    product_uid : product.id , 
                    delivery_uid : this.uid ,  
                    created_m_user_id : userId ,
                    name : product.name ,

                    t_project_delivery_product_link : {
                        t_project_delivery_uid : this.uid ,
                        t_project_product_uid : product.id ,
                        qty : product.qty ,
                    }
                }
            )
        }
        this.t_project_products.splice(0) ;

        if(!_.isEmpty(this.t_project_construction_users)) {
            for ( const user of this.t_project_construction_users){
                user.id = undefined ; 
                user.t_project_delivery_id  = null ;
                user.t_project_delivery_uid = id ;
                user.created_m_user_id = userId ; 
            }
        }
        
    }

    public static parse(obj:Partial<TProjectDelivery>){
        const row = new TProjectDelivery(obj.created_m_user_id ?? 0 ) ;  
        Object.assign(row, obj);

        const parsedConstructionUsers = row.t_project_construction_users.map(x => TProjectConstructionUser.parse(x)) ; 
        ArrayUtil.resetInsert(row.t_project_construction_users , parsedConstructionUsers) ; 

        return row ; 
    }

    public static is(arg:any):arg is TProjectDelivery { 
        if ( arg?.TProjectDelivery === undefined) return false ; 
        return arg.TProjectDelivery ; 
    } 


    

}



