import _, { NumericDictionaryIteratee } from "lodash";
import { DbRowAbstract } from "../../../models/DbRowAbstract";
import { IDbSoftDelete } from "../../../models/IDbSoftDelete";
import NumberUtil from "../../../frameworks/NumberUtil";

export class TProjectPoint extends DbRowAbstract {
    constructor(createdMUserId: number) {
        super(createdMUserId);
        // this.t_project_products = [] ;
        //this.t_production_process_plan = []
    }

    /**
     * 物件ID
     */
    t_project_id: number = 0;

    /**
     * 顧客ID
     */
    m_customer_id: number = 0;

    /**
     * 制作Pt %
     */
    prod_per: number = 0;

    //端数処理前
    tmp_prod_point: number = 0;

    /**
     * 施工掛け率
     */
    construct_coef: number = 1;

    /**
     * 登録掛け率
     */
    create_coef: number = 1;

    /**
     * 営業Pt %
     */
    sales_per: number = 0;

    /**ポイント確定日 */
    applicated_at?: Date | String | null = null;

    /**ポイント締め日 */
    closed_at?: String | null = null;

    //#endregion
    get IsTProjectPoint(): boolean {
        return true;
    }
    public static parse(obj: Partial<TProjectPoint>) {
        const row = new TProjectPoint(obj.created_m_user_id ?? 0);
        Object.assign(row, obj);
        return row;
    }

    public static is(arg: any): arg is TProjectPoint {
        if (arg?.IsTProjectPoint === undefined) return false;
        return arg.IsTProjectPoint;
    }
}
