import _ from "lodash";
import NumberUtil from "../../../../frameworks/NumberUtil";
import ObjectUtil from "../../../../frameworks/ObjectUtil";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";
import { MTag } from "../../../masters/class/models/MTag";
import { TProject } from "./TProject";
import axios from "axios";




export class TProjectFile extends DbRowAbstract  { 

    t_project_id:number|null = null ;
    
    /**
     * 紐づけ用ユニークid
     */
    uid:number|null = null  
    
    /**
     * 親階層ファイルid
     */
    parent_id:number|null = null 

    /**
     * フォルダ判定フラグ
     */
    is_folder:number|boolean = false  

    /**
     * メールid
     */
    t_project_mail_id:number|null = null 
    
    /**
     * ファイル名
     */
    filename:string|null = null 
    
    /**
     * ファイルパス
     */
    filepath:string|null = null
    
    /**
     * ディレクトリパス
     */
    file_dir:string|null = null
    
    /**
     * 拡張子
     */
    extension:string|null = null
    
    /**
     * 最終更新日
     */
    modified:Date|null = null
    
    /**
     * サムネイルbase64 削除予定
     */
    base64_storage_thumbnail:string|null = null
    
    /**
     * サムネイル置き場（localStorage）
     */
    src_thumbnailpath:string|null = null 

    /**
     * ファイルサイズ
     */
    filesize :number|null = null

    public static parse(obj:Partial<TProjectFile>){
        const row = new TProjectFile(obj.created_m_user_id ?? 0 ) ;  
        Object.assign(row, obj);
        return row ; 
    }

    public static is(arg:any):arg is TProjectFile { 
        if ( arg?.TProjectFile === undefined) return false ; 
        return arg.TProjectFile ; 
    } 


    

}



