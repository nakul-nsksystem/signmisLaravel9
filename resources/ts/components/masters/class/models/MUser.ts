import {IDbRow} from "../../../../models/DbRowAbstract";
import { useStore } from "../../../../stores/mainStore";
import { MRole } from "./MRoles";
import { MUserOption } from "./MUserOption";


export class MUser implements IDbRow{
    id?:number ; 

    cd?:string ; 
    order_no?:number ;
    last_name:string = "" ; 
    first_name:string = "" ; 
    full_name:string = "" ; 
    m_branch_id?:number 
    email_verified_at:Date|null = null; 
    email?:string ; 
    thumbnail_path:string|null = null ; 
    memo:string|null = null ;


    //nskuserかどうか　ログインユーザーにのみつく
    is_nsk_user?:boolean ;

    m_roles:Array<MRole> = [] ;
    m_user_options:Array<MUserOption> = [] ;
    
    get IsMUser():boolean{
        return true ; 
    }

    public static parse(obj:Partial<MUser>):MUser{
        const row = new MUser() ;  
        Object.assign(row, obj);
        return row ; 
    }

    

    public static is(arg:any):arg is MUser { 
        if ( arg?.IsMUser === undefined) return false ; 
        return arg.IsMUser ; 
    } 

}