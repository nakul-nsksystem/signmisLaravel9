
type TpReportMenus = {
    name:string
    link:string
    role:string
    level?:number
}
//role 空文字でNSKUser以外非表示になります。
//     権限なしで全ユーザーに表示したい場合は、'no-check' と設定してください

export default {
    //物件帳票
    projects : <TpReportMenus[]>[
        {
            name : "物件一覧表",
            link : "v_summary_project" ,
            role : "projects_report-privilege" ,
        },
        {
            name: "他拠点生産商品集計表",
            link: "v_summary_remote_branch_product",
            role: "remote_branch_products_report-privilege",
        },
    ] ,

    //売掛帳票
    sales : <TpReportMenus[]>[
        {
            name : "売上一覧表",
            link : "" ,
            role : "" ,
        },
        {
            name : "売上明細表",
            link : "v_detail_sale" ,
            role : "sales_report-privilege" ,
        },
        {
            name : "未請求一覧表",
            link : "v_unclaimed_sale" ,
            role : "sales_report-privilege" ,
        },
        {
            name : "請求一覧表",
            link : "v_complete_sale" ,
            role : "sales_report-privilege" ,
        },
        {
            name : "売掛元帳",
            link : "v_ledger_sale" ,
            role : "sales_report-privilege" ,
        },
        {
            name : "売掛残高一覧表",
            link : "v_balance_sale" ,
            role : "sales_report-privilege" ,
        },
        {
            name : "入金明細表",
            link : "v_payment_sale" ,
            role : "sales_report-privilege" ,
        },
        {
            name : "売上集計表",
            link : "v_summary_sale" ,
            role : "sales_report-privilege" ,
        },
    ] ,

    //買掛帳票
    purchases : <TpReportMenus[]>[
        {
            name : "仕入一覧表",
            link : "" ,
            role : "" ,
        },
        {
            name : "仕入明細表",
            link : "v_detail_purchase" ,
            role : "purchases_report-privilege" ,
        },
        {
            name : "未仕入締一覧表",
            link : "v_unclaimed_purchase" ,
            role : "purchases_report-privilege" ,
        },
        {
            name : "仕入締一覧表",
            link : "v_complete_purchase" ,
            role : "purchases_report-privilege" ,
        },
        {
            name : "買掛元帳",
            link : "v_ledger_purchase" ,
            role : "purchases_report-privilege" ,
        },
        {
            name : "買掛残高一覧表",
            link : "v_balance_purchase" ,
            role : "purchases_report-privilege" ,
        },
        {
            name : "支払明細表",
            link : "v_payment_purchase" ,
            role : "purchases_report-privilege" ,
        },
    ]
}
