import ArrayUtil from "../../../../frameworks/ArrayUtil";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";
import { MCustomerInfo } from "./MCustomerInfo";
import { MTag } from "./MTag";


export class MCustomer extends DbRowAbstract{
    public name?:string  ;     
    public short_name_or_name?:string  ;
    public display_address?:string  ;
    // name:string|null = null ;
    cd:string|null = null ;
    order_no:number|null = null ; 
    short_name:string|null = null ; 
    title_of_honor_m_kv_id:number|null = 1000001 ; 
    kana:string|null = null ;
    zip:string|null = null ; 
    prefectures:string|null = null ; 
    address1:string|null = null ; 
    address2:string|null = null ; 
    tel:string|null = null ; 
    fax:string|null = null ;
    contact_person:string|null = null ; 
    email:string|null = null ; 
    m_branch_id:number|null = null ; 
    sales_m_user_id:number|null = null ; 
    dealing_m_kv_id:number|null = null ; 
    industry_m_kv_id:number|null = null ; 
    analyze1_m_kv_id:number|null = null ; 
    analyze2_m_kv_id:number|null = null ; 
    analyze3_m_kv_id:number|null = null   ;
    credit_limit:number = 0 ; 
    destination_m_customer_id:number|null = null ; 
    set_off_m_customer_id:number|null = null ;
    category_group_m_customer_id:number|null = null ;
    account_m_kv_id:number|null = null ; 
    price_fraction_m_kv_id:number|null = null ; 
    tax_fraction_m_kv_id:number|null = null ; 
    closing_date:number|null = null ;
    payment_date:number|null = null ; 
    delivery_note_m_kv_id:number|null = null ; 
    temporary_slip_note_m_kv_id:number|null = null ; 
    designated_delivery_note_m_kv_id:number|null = null ; 
    shipping_label_m_kv_id:number|null = null ; 
    invoice_m_kv_id:number|null = null ; 
    purchase_order_m_kv_id:number|null = null ; 
    payment_notice_m_kv_id:number|null = null ; 
    delivery_format_m_kv_id:number|null = null ; 
    convert_memo:string|null = null ;
    notices:string|null = null ; 
    sales_management_memo:string|null = null ; 
    memo:string|null = null ;

    m_customer_infos:MCustomerInfo[] = [] ; 

    constructor(createdMUserId:number){
        super(createdMUserId) ; 
    }

    get IsMCustomer():boolean{
        return true ; 
    }

    
    public static is(arg:any):arg is MCustomer { 
        if ( arg?.IsMCustomer === undefined) return false ; 
        return arg.IsMCustomer ; 
    } 

    public static parse(obj:Partial<MCustomer>):MCustomer{
        const row = new MCustomer(obj.created_m_user_id ?? 0) ;  
        Object.assign(row, obj);

        const parsedInfos = row.m_customer_infos.map(x => MCustomerInfo.parse(x)) ; 
        ArrayUtil.resetInsert(row.m_customer_infos , parsedInfos) ; 

        
        return row ; 
    }

}