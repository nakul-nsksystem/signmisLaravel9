import ArrayUtil from "../../../../frameworks/ArrayUtil";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";
import { MProcesses } from "./MProcesses";
import { MProcessLabel } from "./MProcessLabel";
import { MProcessMaterial } from "./MProcessMaterial";
import { MProcessOutsources } from "./MProcessOutsources";


export class MProcessCategory extends DbRowAbstract{
    cd?:string ; 
    name?:string ;
    order_no?:number ; 
    is_main_material?:boolean ; 
    is_lami_material?:boolean ; 

    m_process_labels:MProcessLabel[] = []; 
    m_process_materials:MProcessMaterial[] = []; 
    m_process_outsources:MProcessOutsources[] = []; 
    m_processes:MProcesses[] = []; 

    constructor(createdMUserId:number){
        super(createdMUserId) ; 
    }
    
    get IsMProcessCategory():boolean{
        return true ; 
    }

    public static parse(obj:Partial<MProcessCategory>):MProcessCategory{
        const row = new MProcessCategory(obj.created_m_user_id ?? 0) ;  
        Object.assign(row, obj);
        
        const parsedLabels = row.m_process_labels.map(x => MProcessLabel.parse(x )) ; 
        ArrayUtil.resetInsert(row.m_process_labels , parsedLabels) ; 

        const parsedMaterials = row.m_process_materials.map(x => MProcessMaterial.parse(x )) ; 
        ArrayUtil.resetInsert(row.m_process_materials , parsedMaterials) ; 

        const parsedOutsources = row.m_process_outsources.map(x => MProcessOutsources.parse(x )) ; 
        ArrayUtil.resetInsert(row.m_process_outsources , parsedOutsources) ; 

        const parsedProcesses = row.m_processes.map(x => MProcesses.parse(x )) ; 
        ArrayUtil.resetInsert(row.m_processes , parsedProcesses) ; 


        return row ; 
    }

    public static is(arg:any):arg is MProcessCategory { 
        if ( arg?.IsMProcessCategory === undefined) return false ; 
        return arg.IsMProcessCategory ; 
    } 

}