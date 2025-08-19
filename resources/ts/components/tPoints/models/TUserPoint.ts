import _, { NumericDictionaryIteratee } from "lodash";
import { DbRowAbstract } from "../../../models/DbRowAbstract";
import { IDbSoftDelete } from "../../../models/IDbSoftDelete";
import NumberUtil from "../../../frameworks/NumberUtil";
import { TProject } from "../../tProjects/class/models/TProject";
import { MKv } from "../../masters/class/models/MKv";
import { useMasterStore } from "../../../stores/masterStore";

export class TUserPoint extends DbRowAbstract {
    public t_project?: TProject;
    public point_type?: MKv;
    public point_grant_type?: MKv;

    constructor(createdMUserId: number) {
        super(createdMUserId);
        // this.t_project_products = [] ;
        //this.t_production_process_plan = []
    }

    get MUserName() {
        const masterStore = useMasterStore();
        return masterStore.getMUserById(this.m_user_id)?.full_name ?? "";
    }

    /**
     * 担当者ID
     */
    m_user_id: number = 0;

    /**
     * 物件ID
     */
    t_project_id: number | null = 0;

    /**
     * ポイント区分
     */

    point_type_m_kv_id: number = 0;

    point_grant_type_m_kv_id: number = 0;

    point: number = 0;

    changed_at: Date | string | null = null;

    memo: string | null = null;

    applied_at: Date | string | null = null;

    approved_at: Date | string | null = null;

    approved_m_user_id: number | null = null;

    approval_comment: string | null = null;

    //#endregion
    get IsTProjectPoint(): boolean {
        return true;
    }
    public static parse(obj: Partial<TUserPoint>) {
        const row = new TUserPoint(obj.created_m_user_id ?? 0);
        Object.assign(row, obj);
        return row;
    }

    public static is(arg: any): arg is TUserPoint {
        if (arg?.IsTProjectPoint === undefined) return false;
        return arg.IsTProjectPoint;
    }
}
