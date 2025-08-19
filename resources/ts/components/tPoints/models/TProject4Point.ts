import { groupBy, isNil, sortBy, sumBy } from "lodash";
import { DbRowAbstract } from "../../../models/DbRowAbstract";
import { IDbSoftDelete } from "../../../models/IDbSoftDelete";
import NumberUtil from "../../../frameworks/NumberUtil";
import { TProjectPoint } from "./TProjectPoint";
import { useStore } from "../../../stores/mainStore";
import { useMasterStore } from "../../../stores/masterStore";
import { MCustomer } from "../../masters/class/models/MCustomer";
import TPointCalcUtil from "../utils/TPointCalcUtil";
import { TProjectProduct } from "../../tProjects/class/models/TProjectProduct";
import { TProjectDelivery } from "../../tProjects/class/models/TProjectDelivery";
import { TSaleDetail } from "../../tSales/class/models/TSaleDetail";
import DayJsEx from "../../../frameworks/DayJsEx";
import { TUserPoint } from "./TUserPoint";
import MKvsConst from "../../../consts/MKvsConst";

/**
 * point確定のリスト表示用クラス（DBには存在しない）
 */
export class TProject4Point extends DbRowAbstract implements IDbSoftDelete {
    public deleted_at: Date | null = null;
    public t_project_products: TProjectProduct[] = [];
    public t_project_deliveries: TProjectDelivery[] = [];

    public t_user_points: TUserPoint[] = [];
    //public t_project4point?: TProject4Point;
    public t_project_point?: TProjectPoint;

    constructor(createdMUserId: number) {
        super(createdMUserId);
        // this.t_project_products = [] ;
        //this.t_production_process_plan = []
    }

    /**
     * 拠点ID
     */
    m_branch_id: number = 0;

    get MBranchName() {
        const masterStore = useMasterStore();
        return masterStore.getMBranchById(this.m_branch_id)?.short_name ?? "";
    }

    /**
     * 顧客ID
     */
    m_customer_id: number = 0;

    m_customer?: MCustomer;

    get MCustomerName() {
        return this.m_customer?.name ?? "";
    }

    /**
     * コード
     */
    cd: string = "";

    /**
     * 物件名
     */
    name: string = "";

    /**
     * 営業担当ID
     */
    sales_m_user_id: number = 0;

    /**仮ポイント締め日、データ編集したか判断 */
    is_closed: boolean = false;

    get SalesMUserName() {
        const masterStore = useMasterStore();
        return masterStore.getMUserById(this.sales_m_user_id)?.full_name ?? "";
    }

    get CreatedMUserName() {
        const masterStore = useMasterStore();
        return (
            masterStore.getMUserById(this.created_m_user_id)?.full_name ?? ""
        );
    }

    ordered_at: Date | null = null;

    sales_completed_at: Date | null = null;

    /**
     * 総売価
     */
    total_sell_price: number = 0;

    /**
     * 総利益
     */
    total_profit: number = 0;

    /**
     * 総売上金額
     */
    total_sale_price: number = 0;

    /**
     * 総原価
     */
    total_cost: number = 0;

    /**
     * 利益率
     */
    profit_per: number = 0;

    /**
     * 制作Pt
     */
    prod_point: number = 0;

    /**
     * 営業Pt
     */
    sales_point: number = 0;

    /**
     * 予測制作Pt
     */
    eval_prod_point: number = 0;

    /**
     * 予測営業Pt
     */
    eval_sales_point: number = 0;

    get ProfitPer() {
        return NumberUtil.round(this.profit_per, 2);
    }

    get IsValid() {
        if (this.ProdPer < 0 || this.ProdPer > 100) return false;
        if (this.SalesPer < 0 || this.SalesPer > 100) return false;
        if (this.ConstructCoef < 0 || this.ConstructCoef > 100) return false;
        if (this.CreateCoef < 0 || this.CreateCoef > 100) return false;
        if (this.SalesPer + this.ProdPer > 100) return;
        return true;
    }

    get ProdPer() {
        return this.t_project_point?.prod_per ?? 0;
    }

    set ProdPer(v) {
        if (this.t_project_point) {
            this.t_project_point.prod_per = v;
            let pt = NumberUtil.invalid2zr(this.total_profit * v * 0.01);
            if (this.t_project_point.prod_per <= 0) pt = 0;
            this.eval_prod_point = TPointCalcUtil.calcFraction(pt);
            this.t_project_point.tmp_prod_point =
                TPointCalcUtil.calcFraction(pt);
            this.UsersSummary;
        }
    }

    get ProdPoint() {
        if (this.IsEdited) {
            return this.IsClosed ? this.eval_prod_point : this.prod_point;
        } else {
            return this.IsClosed ? this.prod_point : this.eval_prod_point;
        }
    }

    get EvalProdPoint() {
        return this.eval_prod_point;
    }

    get ConstructCoef() {
        return this.t_project_point?.construct_coef ?? 1;
    }

    set ConstructCoef(v) {
        if (this.t_project_point) {
            this.t_project_point.construct_coef = v;
        }
    }

    get CreateCoef() {
        return this.t_project_point?.create_coef ?? 1;
    }

    set CreateCoef(v) {
        if (this.t_project_point) {
            this.t_project_point.create_coef = v;
        }
    }

    get SalesPer() {
        return this.t_project_point?.sales_per ?? 0;
    }

    set SalesPer(v) {
        if (this.t_project_point) {
            this.t_project_point.sales_per = v;
            let pt = NumberUtil.invalid2zr(this.total_profit * v * 0.01);
            if (this.t_project_point.sales_per <= 0) pt = 0;
            this.eval_sales_point = TPointCalcUtil.calcFraction(pt);
        }
    }

    /**
     * 制作Pt
     */
    get SalesPoint() {
        return this.eval_sales_point;
    }

    /**
     * 予測制作Pt
     */
    get EvalSalesPoint() {
        return this.eval_sales_point;
    }

    get IsApplicated() {
        return (
            !isNil(this.t_project_point) &&
            !isNil(this.t_project_point?.applicated_at)
        );
    }

    set IsApplicated(v) {
        if (this.t_project_point) {
            if (v) {
                this.t_project_point.applicated_at = new Date();
            } else {
                this.t_project_point.applicated_at = null;
            }
        }
    }

    get IsClosed() {
        return !isNil(this.t_project_point?.closed_at);
    }

    set IsClosed(v) {
        if (this.t_project_point) {
            if (v) {
                this.t_project_point.closed_at = DayJsEx.format(
                    new Date(),
                    "YYYY-MM-DD HH:mm:ss"
                );
            } else {
                this.t_project_point.closed_at = null;
            }
        }
    }

    get IsEdited() {
        return this.IsClosed != this.is_closed;
    }

    //生産実績
    get ProductionResults() {
        const masterStore = useMasterStore();
        const v: {
            m_user_id?: number;
            m_user_name?: string;
            date?: string;
            m_process_category_id?: number;
            m_process_category_name?: string;
            product_name?: string;
        }[] = [];

        for (const product of this.t_project_products) {
            for (const process of product.t_project_product_processes) {
                for (const plan of process.t_production_process_plans) {
                    const results = process.getResults(plan);

                    for (const res of results) {
                        for (const user of res.t_production_result_users) {
                            v.push({
                                m_user_id: user.m_user_id,
                                m_user_name:
                                    masterStore.getMUserById(user.m_user_id)
                                        ?.full_name ?? "",
                                date: this.formatDate(res.ended_at),
                                m_process_category_id:
                                    process.m_process_category_id,
                                m_process_category_name:
                                    process.MProcessCategoryName,
                                product_name: product.name,
                            });
                        }
                    }
                }
            }
        }

        return sortBy(v, ["date", "m_user_id"]);
    }

    //施工実績
    get ConstructionResults() {
        const masterStore = useMasterStore();

        const v: {
            m_user_id?: number;
            m_user_name?: string;
            date?: string;
        }[] = [];

        for (const dlv of this.t_project_deliveries) {
            for (const res of dlv.t_project_construction_results) {
                for (const user of res.t_project_construction_result_users) {
                    if (isNil(user.m_user_id)) continue;
                    const existsUser = v.find(
                        (x) => x.m_user_id == user.m_user_id
                    );
                    if (existsUser) {
                        existsUser.date += `,${this.formatDate(
                            dlv.delivery_at
                        )}`;
                    } else {
                        v.push({
                            m_user_id: user.m_user_id ?? 0,
                            m_user_name:
                                masterStore.getMUserById(user.m_user_id ?? 0)
                                    ?.full_name ?? "",
                            date: this.formatDate(dlv.delivery_at),
                        });
                    }
                }
            }
        }

        return sortBy(v, ["date", "m_user_id"]);
    }

    //総Pt数
    get SumOfPoint() {
        return this.ProdPoint + this.SalesPoint;
    }

    //商品数
    get NumOfProduct() {
        return this.t_project_products.length;
    }

    //施工Pt数
    get ConstructUnitPoint() {
        return TPointCalcUtil.calcFraction(
            this.UnitPoint * this.NumOfProduct * this.ConstructCoef
        );
    }

    //MIS登録Pt数
    get MisRegUnitPoint() {
        return this.sales_m_user_id == this.created_m_user_id
            ? 0
            : TPointCalcUtil.calcFraction(
                  this.UnitPoint * this.NumOfProduct * this.CreateCoef
              );
    }

    //生産実績・施工実績・MIS登録の総和
    get NumOfResult() {
        const numOfProd = this.ProductionResults.length;
        const numOfCons =
            this.ConstructionResults.length *
            this.NumOfProduct *
            this.ConstructCoef;
        const numOfRegi = this.created_m_user_id
            ? 1 * this.NumOfProduct * this.CreateCoef
            : 0;
        return numOfProd + numOfCons + numOfRegi;
    }

    //1項目あたりの制作Pt
    get UnitPoint() {
        if (!this.t_project_point) return 0;

        const prodPts = this.t_project_point?.tmp_prod_point ?? 0;
        if (prodPts == 0 || this.NumOfResult == 0) return 0;

        return TPointCalcUtil.calcFraction(prodPts / this.NumOfResult);
    }

    //ユーザーごとの集計
    get UsersSummary() {
        if (!this.t_project_point) return [];

        const summary: {
            m_user_id?: number;
            m_user_name?: string;
            prod_pt: number; // 実に発生
            sales_pt: number;
            total_pt: number;
            details?: string;
            t_project_name?: string;
            t_project_id?: number;
        }[] = [];

        // 締め済み
        if (this.t_project_point.closed_at) {
            const salePoint = this.t_user_points.find((x) => {
                return (
                    x.point_grant_type_m_kv_id ==
                    MKvsConst.TUserPoints.POINT_GRANT_TYPE_M_KV_ID_SALES
                );
            });

            if (salePoint) {
                //営業
                summary.push({
                    m_user_id: salePoint.m_user_id,
                    m_user_name: salePoint.MUserName,
                    prod_pt: 0,
                    sales_pt: salePoint.point,
                    total_pt: 0,
                    details: salePoint.memo ?? "",
                });
            }

            const createPoint = this.t_user_points.find(
                (x) =>
                    x.point_grant_type_m_kv_id ==
                    MKvsConst.TUserPoints.POINT_GRANT_TYPE_M_KV_ID_CREATE
            );

            if (createPoint) {
                //MIS入力
                const foundRow1 = summary.find(
                    (x) => x.m_user_id == createPoint.m_user_id
                );
                if (foundRow1) {
                    foundRow1.prod_pt += createPoint.point;
                    foundRow1.details += "," + createPoint.memo;
                } else {
                    summary.push({
                        m_user_id: createPoint.m_user_id,
                        m_user_name: createPoint.MUserName,
                        prod_pt: createPoint.point,
                        sales_pt: 0,
                        total_pt: 0,
                        details: createPoint.memo ?? "",
                    });
                }
            }

            const prodPoints = this.t_user_points.filter(
                (x) =>
                    x.point_grant_type_m_kv_id ==
                    MKvsConst.TUserPoints.POINT_GRANT_TYPE_M_KV_ID_PROD
            );

            if (prodPoints && prodPoints.length > 0) {
                prodPoints.forEach((prodPoint) => {
                    const foundRow2 = summary.find(
                        (x) => x.m_user_id == prodPoint.m_user_id
                    );
                    if (foundRow2) {
                        foundRow2.prod_pt += prodPoint.point;
                        if (
                            !foundRow2.details?.includes(prodPoint.memo ?? "")
                        ) {
                            foundRow2.details += "," + prodPoint.memo;
                        }
                    } else {
                        summary.push({
                            m_user_id: prodPoint.m_user_id,
                            m_user_name: prodPoint.MUserName,
                            prod_pt: prodPoint.point,
                            sales_pt: 0,
                            total_pt: 0,
                            details: prodPoint.memo ?? "",
                        });
                    }
                });
            }

            const constuctPoints = this.t_user_points.filter(
                (x) =>
                    x.point_grant_type_m_kv_id ==
                    MKvsConst.TUserPoints.POINT_GRANT_TYPE_M_KV_ID_CONTRUCT
            );

            if (constuctPoints && constuctPoints.length > 0) {
                constuctPoints.forEach((constrctPoint) => {
                    const foundRow3 = summary.find(
                        (x) => x.m_user_id == constrctPoint.m_user_id
                    );
                    if (foundRow3) {
                        foundRow3.prod_pt += constrctPoint.point;
                        if (
                            !foundRow3.details?.includes(
                                constrctPoint.memo ?? ""
                            )
                        ) {
                            foundRow3.details += "," + constrctPoint.memo;
                        }
                    } else {
                        summary.push({
                            m_user_id: constrctPoint.m_user_id,
                            m_user_name: constrctPoint.MUserName,
                            prod_pt: constrctPoint.point,
                            sales_pt: 0,
                            total_pt: 0,
                            details: constrctPoint.memo ?? "",
                        });
                    }
                });
            }
        }
        // 未締
        else {
            //営業
            summary.push({
                m_user_id: this.sales_m_user_id,
                m_user_name: this.SalesMUserName,
                prod_pt: 0,
                sales_pt: this.eval_sales_point,
                total_pt: 0,
                details: "営業",
            });

            //MIS入力
            const foundRow1 = summary.find(
                (x) => x.m_user_id == this.created_m_user_id
            );
            if (foundRow1) {
                foundRow1.prod_pt += this.MisRegUnitPoint;
                foundRow1.details += ",MIS入力";
            } else {
                summary.push({
                    m_user_id: this.created_m_user_id,
                    m_user_name: this.CreatedMUserName,
                    prod_pt: this.MisRegUnitPoint,
                    sales_pt: 0,
                    total_pt: 0,
                    details: "MIS入力",
                });
            }

            //制作
            for (const pRes of this.ProductionResults) {
                const foundRow2 = summary.find(
                    (x) => x.m_user_id == pRes.m_user_id
                );
                if (foundRow2) {
                    foundRow2.prod_pt += this.UnitPoint;
                    if (!foundRow2.details?.includes("制作")) {
                        foundRow2.details += ",制作";
                    }
                } else {
                    summary.push({
                        m_user_id: pRes.m_user_id,
                        m_user_name: pRes.m_user_name,
                        prod_pt: this.UnitPoint,
                        sales_pt: 0,
                        total_pt: 0,
                        details: "制作",
                    });
                }
            }

            //施工
            for (const cRes of this.ConstructionResults) {
                const foundRow3 = summary.find(
                    (x) => x.m_user_id == cRes.m_user_id
                );
                if (foundRow3) {
                    foundRow3.prod_pt += this.ConstructUnitPoint;
                    if (!foundRow3.details?.includes("施工")) {
                        foundRow3.details += ",施工";
                    }
                } else {
                    summary.push({
                        m_user_id: cRes.m_user_id ?? 0,
                        m_user_name: cRes.m_user_name,
                        prod_pt: this.ConstructUnitPoint,
                        sales_pt: 0,
                        total_pt: 0,
                        details: "施工",
                    });
                }
            }
        }

        //端数処理してsum
        for (const sumRow of summary) {
            sumRow.prod_pt = TPointCalcUtil.calcFraction(sumRow.prod_pt);
            sumRow.total_pt = sumRow.prod_pt + sumRow.sales_pt;
            sumRow.t_project_id = this.id;
            sumRow.t_project_name = this.name;
        }

        this.prod_point = sumBy(summary, "prod_pt");
        this.sales_point = sumBy(summary, "sales_pt");

        return sortBy(summary, ["total_pt"]).reverse();
    }

    public getResultsByUserId(userId: number) {
        return this.UsersSummary.find((x) => x.m_user_id == userId);
    }

    public formatDate(date?: Date) {
        if (!date) return "";
        return DayJsEx.format(date);
    }

    //#endregion
    get IsTProject4Point(): boolean {
        return true;
    }
    public static parse(obj: Partial<TProject4Point>) {
        const row = new TProject4Point(obj.created_m_user_id ?? 0);
        Object.assign(row, obj);

        row.t_project_products = row.t_project_products.map((x) =>
            TProjectProduct.parse(x)
        );
        row.t_project_deliveries = row.t_project_deliveries.map((x) =>
            TProjectDelivery.parse(x)
        );

        row.t_user_points = row.t_user_points.map((x) => TUserPoint.parse(x));
        if (row.t_project_point) {
            row.t_project_point = TProjectPoint.parse(row.t_project_point);
            row.is_closed = !isNil(row.t_project_point.closed_at);
        } else {
            const store = useStore();
            row.t_project_point = new TProjectPoint(store.loginMUser?.id ?? 0);
        }

        // 総粗利を計算
        row.total_profit = row.total_sale_price - row.total_cost;
        if (row.total_sale_price > 0) {
            row.profit_per = (row.total_profit / row.total_sale_price) * 100;
        }

        row.ProdPer = row.t_project_point.prod_per;
        row.SalesPer = row.t_project_point.sales_per;

        return row;
    }

    public static is(arg: any): arg is TProject4Point {
        if (arg?.IsTProject4Point === undefined) return false;
        return arg.IsTProject4Point;
    }
}
