import _ from "lodash";
import NumberUtil from "../../../../frameworks/NumberUtil";
import ObjectUtil from "../../../../frameworks/ObjectUtil";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";
import { MTag } from "../../../masters/class/models/MTag";
import { TProject } from "./TProject";
import axios from "axios";




export class TProjectMail extends DbRowAbstract  { 
    uid:number|null = null; 
    /**物件id */
    t_project_id:number|null = null; 
    /**受信日 */
    received_at:Date|null = null; 
    /**タイトル */
    subject:string|null = null; 
    /**本文 */
    body:string|null = null;
    /**送信元アドレス */
    from:string|null = null; 
    /**宛先アドレス */
    to:string|null = null; 
    /**cc */
    cc:string|null = null; 
    /**保存先path */
    mailpath:string|null = null;
    mailname:string|null = null;

    t_project_files = Array();


    public static parse(obj:Partial<TProjectMail>){
        const row = new TProjectMail(obj.created_m_user_id ?? 0 ) ;  
        Object.assign(row, obj);
        return row ; 
    }

    public static is(arg:any):arg is TProjectMail { 
        if ( arg?.TProjectMail === undefined) return false ; 
        return arg.TProjectMail ; 
    } 


    

}



