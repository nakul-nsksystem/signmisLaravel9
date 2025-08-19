import _, { NumericDictionaryIteratee } from "lodash";
import { computeModeSetting } from "vee-validate/dist/types/components/common";
import ArrayUtil from "../../../../frameworks/ArrayUtil";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";
import { MCustomer } from "./MCustomer";
import { MMaterialDetail } from "./MMaterialDetail";
import { MTag } from "./MTag";


export class MMaterial extends DbRowAbstract{
    public name?:string  ;     
    public display_name?:string  ;     
    public m_material_details:Array<MMaterialDetail> ; 
    public m_tags:Array<MTag> ; 
    public weight:number = 0 ; 
    public supplier_m_customer_id?:number = undefined ; 
    public is_stocked:boolean = false ; 
    public total_price_calc_m_kv_id?:number = undefined ; 

    public supplier?:MCustomer = undefined  ; 

    public fire_prev_label_cd?:string|null = null ;

    constructor(createdMUserId:number){
        super(createdMUserId) ; 
        this.m_material_details = [] ;
        this.m_tags = [] ; 
    }

    get IsMMaterial():boolean{
        return true ; 
    }


    /**
     * 詳細の中で最も高額なコストの材料詳細を取得
     * @param material 
     */
     public static getHighestCostMaterial(material:MMaterial|undefined):MMaterialDetail|undefined {         
        if ( _.isNil(material) || _.isNil(material?.m_material_details)) return undefined ; 
        if ( material.m_material_details.length === 0 ) return undefined 
        
        const res = material.m_material_details.reduce(function (accumulator, currentValue) {                    
            return accumulator.cost_price  > currentValue.cost_price ? accumulator : currentValue ; 
        }) ; 
        return res ; 
       
    }

    /**
     * 詳細の中で最も高額なコストを取得
     * @param material 
     */
    public static getHighestCost(material:MMaterial|undefined):number { 
        let cost = 0 ;         
        const highestMatDetail = MMaterial.getHighestCostMaterial(material) ; 
        if ( highestMatDetail !== undefined) cost = highestMatDetail.cost_price ; 
        return cost;         
    }


    /**
     * １つ目の明細を取得
     * @param material 
     * @returns 
     */
    public static getDetailOne(material:MMaterial|undefined):MMaterialDetail|undefined {
        if ( _.isNil(material) || _.isNil(material.m_material_details))  return undefined ; 
        
        if ( material.m_material_details.length === 0 ) return undefined ; 
        return material.m_material_details[0] ; 
    }

    
    
    public static is(arg:any):arg is MMaterial { 
        if ( arg?.IsMMaterial === undefined) return false ; 
        return arg.IsMMaterial ; 
    } 

    public static arrayIs(arg:any):arg is MMaterial[] { 
        if (arg instanceof Array){
            for (const i of arg){
                if (! MMaterial.is(i) ){
                    return false ; 
                }
            }
            return true ; 
        } 
        return false  ; 
    }

    public static parse(obj:Partial<MMaterial>):MMaterial{
        const row = new MMaterial(obj.created_m_user_id ?? 0) ;  
        Object.assign(row, obj);
        
        const parsedTags = row.m_tags.map(x => MTag.parse(x)) ; 
        row.m_tags.splice(
            0 , 
            row.m_tags.length , 
            ...parsedTags , 
        )

        const parsedDetails = row.m_material_details.map(x => MMaterialDetail.parse(x)) ; 
        ArrayUtil.resetInsert(row.m_material_details , parsedDetails) ; 
        
        // for ( const t of row.m_tags){
        //     console.log(`tag is ${MTag.is(t)}`) ; 
        // }
        // console.log("on Parse MMate " + MMaterial.is(row)) ; 

        return row ; 
    }

}