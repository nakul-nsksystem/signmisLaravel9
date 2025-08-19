import _ from "lodash";
import ObjectUtil from "../../../../frameworks/ObjectUtil";
import { DbRowAbstract } from "../../../../models/DbRowAbstract";
import { IDbSoftDelete } from "../../../../models/IDbSoftDelete";
import { useStore } from "../../../../stores/mainStore";
/**
 * TProduction , TProductionDay , TProductionGroupで使用する仮想クラス
 */
export abstract class TProjectAbstract extends DbRowAbstract implements IDbSoftDelete {         
    
    // protected _store?:object = undefined; 
    protected _store? = useStore(); 

    public deleted_at:Date|null = null ;   

    constructor (createdMUserId:number ) { 
        super(createdMUserId) ; 
        // this._store = store ; 

        this.deleted_at = null ; 
    }

    
    toJSON () {
        const row = {} ; 
        
        // プロパティ値を取り直し( getter の中に値をセットしているものがあるため)
        const _this = this ; 
        ObjectUtil.getGetters(this).forEach(x => {
            // @ts-ignore
            _this[x] ; 
        }); 
        Object.assign(row , this) ; 
        // @ts-ignore
        delete row._store ; 
        // @ts-ignore
        delete row._t_project_product ; 
        return row ; 
      }
    

}



