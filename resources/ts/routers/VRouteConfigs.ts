import Vue from "vue";
import { NavigationGuardNext, Route } from "vue-router";
import { useStore } from "../stores/mainStore";

export default {
    getRoutes: function () {
        return [
            {
                path: "/login",
                name: "login",
                meta: { isLogin: true },
                component: Vue.component("Login"),
            },
            {
                path: "/home",
                name: "home",
                meta: { label: "Home", icon: "fa-home", isHome: true },
                component: Vue.component("Home"),

                // component: {template : "<div>Home</div>" }
            },
            // t_project
            {
                path: "/t_project",
                component: { template: "<router-view></router-view>" },
                meta: {
                    label: "物件一覧",
                    icon: "fa-building",
                    key: "t_project-privilege",
                },
                children: [
                    // index
                    {
                        path: "",
                        component: Vue.component("TProjects"),
                        meta: {
                            label: "物件一覧",
                            icon: "fa-building",
                            isCustomHeader: true,
                            isIgnoreBreadcrumb: true,
                        },
                    },
                    // add
                    {
                        path: "add",
                        component: Vue.component("TProjectEditPageComponent"),
                        meta: {
                            // name : "add" ,
                            label: "物件編集",
                            icon: "building",
                            isCustomHeader: true,
                        },
                        name: "add",
                        props: true,
                    },
                    // edit
                    {
                        path: "edit/:id",
                        name: "tProjectEdit",
                        component: Vue.component("TProjectEditPageComponent"),
                        meta: {
                            // name : "edit" ,
                        },
                    },
                    // edit
                    {
                        path: "copy/:srcId",
                        name: "tProjectCopy",
                        component: Vue.component("TProjectEditPageComponent"),
                        meta: {
                            // name : "edit" ,
                        },
                    },
                    // smartsshopOrder
                    {
                        path: "ss_order",
                        name: "tProjectSSOrder",
                        component: Vue.component("TProjectEditPageComponent"),
                        props: true,
                        meta: {
                            // name : "edit" ,
                        },
                    },
                    // construct_result
                    {
                        path: "construction_result/:id",
                        name: "tProjectConstructionResult",
                        component: Vue.component(
                            "TProjectConstructionResultComponent"
                        ),
                        meta: {
                            label: "施工実績",
                            icon: "fa-building",
                            // name : "edit" ,
                        },
                    },
                ],
            },
            //生産管理
            {
                path: "/t_productions",
                component: { template: "<router-view></router-view>" },
                meta: {
                    label: "生産管理",
                    icon: "fa-print",
                    key: "t_production_control-privilege",
                    isIgnoreBreadcrumb: true,
                },
                children: [
                    // index
                    {
                        path: "",
                        component: Vue.component("TProductions"),
                        meta: {
                            label: "生産管理",
                            icon: "fa-print",
                            isCustomHeader: true,
                            isIgnoreBreadcrumb: true,
                        },
                    },
                    // plan
                    {
                        path: "plan",
                        component: Vue.component("TProductionPlan"),
                        meta: {
                            label: "生産計画",
                            icon: "fa-print",
                            isCustomHeader: true,
                        },
                    },
                ],
            },

            // 発注
            {
                path: "/t_p_order",
                component: Vue.component("CommonContainer"),
                meta: {
                    label: "発注一覧",
                    icon: "shopping-cart",
                    key: "t_p_order-privilege",
                },
                children: [
                    // index
                    {
                        path: "",
                        component: Vue.component("TPOrders"),
                        name: "t_p_order_index",
                        meta: {
                            label: "発注一覧",
                            icon: "fa-shopping-cart",
                            isCustomHeader: true,
                            isIgnoreBreadcrumb: true,
                        },
                    },
                    // add
                    {
                        path: "add",
                        component: Vue.component("TPOrderAdd"),
                        meta: {
                            label: "新規発注",
                            icon: "fa-shopping-cart",
                            // isIgnoreBreadcrumb:true ,
                            isCustomHeader: true,
                        },
                    },
                    // qradd
                    {
                        path: "qr",
                        component: Vue.component("TPOrderQr"),
                        meta: {
                            label: "QR発注",
                            icon: "fa-shopping-cart",
                            // isIgnoreBreadcrumb:true ,
                            // isCustomHeader: true ,
                        },
                    },
                    {
                        path: "edit/:id",
                        component: Vue.component("TPOrderEdit"),
                        meta: {
                            // name : "edit" ,
                            label: "発注編集",
                            icon: "fa-shopping-cart",
                            isCustomHeader: true,
                        },
                    },
                    // view
                    {
                        path: "view/:id",
                        component: Vue.component("TPOrderList"),
                        meta: {
                            // name : "view" ,
                            label: "発注表示",
                            icon: "fa-shopping-cart",
                        },
                    },
                    // t_project_order
                    {
                        path: "t_project_order",
                        component: Vue.component("TPOrderTProjectOrder"),
                        meta: {
                            label: "物件発注",
                            icon: "fa-shopping-cart",
                        },
                    },
                ],
            },

            // 仕入
            {
                path: "/t_p_invoice",
                component: Vue.component("CommonContainer"),
                meta: {
                    label: "仕入管理",
                    icon: "fa-shopping-bag",
                    key: "t_p_invoice-privilege",
                },
                children: [
                    {
                        path: "",
                        name: "t_p_invoice",
                        component: Vue.component("TPInvoices"),
                        meta: {
                            label: "仕入管理",
                            icon: "fa-shopping-bag",
                            isCustomHeader: true,
                            isIgnoreBreadcrumb: true,
                        },
                    },
                    {
                        path: "add",
                        component: Vue.component("TPInvoiceEdit"),
                        meta: {
                            label: "新規",
                            icon: "fa-shopping-bag",
                            isCustomHeader: true,
                        },
                    },
                    {
                        path: "edit/:id",
                        component: Vue.component("TPInvoiceEdit"),
                        meta: {
                            label: "編集",
                            icon: "fa-shopping-bag",
                            isCustomHeader: true,
                        },
                    },
                    {
                        path: "view/:id",
                        component: Vue.component("TPInvoiceView"),
                        meta: {
                            label: "表示",
                            icon: "fa-shopping-bag",
                        },
                    },
                    {
                        path: "order_list",
                        name: "t_p_invoice_order_list",
                        component: Vue.component("TPInvoiceOrderList"),
                        meta: {
                            label: "発注検索",
                            icon: "fa-shopping-cart",
                        },
                    },
                ],
            },

            // 売上
            {
                path: "/t_sale",
                component: Vue.component("CommonContainer"),
                meta: {
                    label: "売上管理",
                },
                children: [
                    {
                        path: "",
                        name: "t_sale",
                        component: Vue.component("TSales"),
                        meta: {
                            label: "売上管理",
                            icon: "fa-sign",
                            key: "t_sale-privilege",
                            isCustomHeader: true,
                            isIgnoreBreadcrumb: true,
                        },
                    },
                    {
                        path: "add",
                        component: Vue.component("TSaleEdit"),
                        meta: {
                            // name : "add" ,
                            label: "新規",
                            icon: "fa-sign",
                            key: "t_sale-privilege",
                            isCustomHeader: true,
                        },
                    },
                    {
                        path: "edit/:id",
                        component: Vue.component("TSaleEdit"),
                        meta: {
                            // name : "edit" ,
                            label: "編集",
                            icon: "fa-sign",
                            key: "t_sale-privilege",
                            isCustomHeader: true,
                        },
                    },
                    {
                        path: "view/:id",
                        component: Vue.component("TSaleView"),
                        meta: {
                            label: "表示",
                            icon: "fa-sign",
                            key: "t_sale-privilege",
                        },
                    },
                    {
                        path: "delivery_note/:id",
                        name: "delivery_note",
                        component: Vue.component("TSaleDeliveryNote"),
                        meta: {
                            name: "delivery_note",
                            label: "印刷",
                            icon: "fa-sign",
                            key: "t_sale-privilege",
                            isPrintPreView: true,
                            title: "納品書",
                        },
                    },
                ],
            },

            // 請求締・仕入締・帳票
            {
                path: "/complete",
                component: { template: "<router-view></router-view>" },
                meta: {
                    label: "締業務",
                },
                children: [
                    {
                        path: "",
                        name: "complete_menu",
                        component: Vue.component("CompleteMenus"),
                    },
                    {
                        path: "t_s_complete_process",
                        component: Vue.component("TSCompleteProcess"),
                        meta: {
                            label: "請求締 処理",
                            icon: "fa-file-invoice",
                            key: "t_complete-privilege",
                        },
                    },
                    {
                        path: "t_s_complete_cancel",
                        component: Vue.component("TSCompleteCancel"),
                        meta: {
                            label: "請求締 解除",
                            icon: "fa-file-invoice",
                            key: "t_complete-privilege",
                        },
                    },
                    {
                        path: "t_s_payment",
                        component: Vue.component("TSPayment"),
                        meta: {
                            label: "入金",
                            icon: "fa-file-invoice",
                            key: "t_complete-privilege",
                        },
                    },
                    {
                        path: "t_p_complete_process",
                        component: Vue.component("TPCompleteProcess"),
                        meta: {
                            label: "仕入締 処理",
                            icon: "fa-file-invoice",
                            key: "t_complete-privilege",
                        },
                    },
                    {
                        path: "t_p_complete_cancel",
                        component: Vue.component("TPCompleteCancel"),
                        meta: {
                            label: "仕入締 解除",
                            icon: "fa-file-invoice",
                            key: "t_complete-privilege",
                        },
                    },
                    {
                        path: "t_p_payment",
                        component: Vue.component("TPPayment"),
                        meta: {
                            label: "支払",
                            icon: "fa-file-invoice",
                            key: "t_complete-privilege",
                        },
                    },
                ],
            },
            // 帳票
            {
                path: "/report",
                component: { template: "<router-view></router-view>" },
                meta: {
                    label: "集計帳票",
                },
                children: [
                    {
                        path: "",
                        name: "report_menu",
                        component: Vue.component("SignmisReportMenus"),
                    },

                    //物件帳票
                    {
                        path: "v_summary_project",
                        component: Vue.component("VSummaryProjects"),
                        meta: {
                            label: "物件一覧表",
                            icon: "fa-scroll",
                            key: "projects_report-privilege",
                        },
                    },

                    //他拠点生産商品集計表
                    {
                        path: "v_summary_remote_branch_product",
                        component: Vue.component(
                            "VSummaryRemoteBranchProducts"
                        ),
                        meta: {
                            label: "他拠点生産商品集計表",
                            icon: "fa-scroll",
                            key: "remote_branch_products_report-privilege",
                        },
                    },

                    // 売掛帳票
                    {
                        path: "v_detail_sale",
                        component: Vue.component("VDetailSales"),
                        meta: {
                            label: "売上明細表",
                            icon: "fa-scroll",
                            key: "sales_report-privilege",
                        },
                    },
                    {
                        path: "v_unclaimed_sale",
                        component: Vue.component("VUnclaimedSales"),
                        meta: {
                            label: "未請求一覧表",
                            icon: "fa-scroll",
                            key: "sales_report-privilege",
                        },
                    },
                    {
                        path: "v_complete_sale",
                        component: Vue.component("VCompleteSales"),
                        meta: {
                            label: "請求一覧表",
                            icon: "fa-scroll",
                            key: "sales_report-privilege",
                        },
                    },
                    {
                        path: "v_ledger_sale",
                        component: Vue.component("VLedgerSales"),
                        meta: {
                            label: "売掛元帳",
                            icon: "fa-scroll",
                            key: "sales_report-privilege",
                        },
                    },
                    {
                        path: "v_balance_sale",
                        component: Vue.component("VBalanceSales"),
                        meta: {
                            label: "売掛残高一覧表",
                            icon: "fa-scroll",
                            key: "sales_report-privilege",
                        },
                    },
                    {
                        path: "v_payment_sale",
                        component: Vue.component("VPaymentSales"),
                        meta: {
                            label: "入金明細表",
                            icon: "fa-scroll",
                            key: "sales_report-privilege",
                        },
                    },
                    {
                        path: "v_summary_sale",
                        component: Vue.component("VSummarySales"),
                        meta: {
                            label: "売上集計表",
                            icon: "fa-scroll",
                            key: "sales_report-privilege",
                        },
                    },

                    // 買掛帳票
                    {
                        path: "v_detail_purchase",
                        component: Vue.component("VDetailPurchases"),
                        meta: {
                            label: "仕入明細表",
                            icon: "fa-scroll",
                            key: "purchases_report-privilege",
                        },
                    },
                    {
                        path: "v_unclaimed_purchase",
                        component: Vue.component("VUnclaimedPurchases"),
                        meta: {
                            label: "未仕入締一覧表",
                            icon: "fa-scroll",
                            key: "purchases_report-privilege",
                        },
                    },
                    {
                        path: "v_complete_purchase",
                        component: Vue.component("VCompletePurchases"),
                        meta: {
                            label: "仕入締一覧表",
                            icon: "fa-scroll",
                            key: "purchases_report-privilege",
                        },
                    },
                    {
                        path: "v_ledger_purchase",
                        component: Vue.component("VLedgerPurchases"),
                        meta: {
                            label: "買掛元帳",
                            icon: "fa-scroll",
                            key: "purchases_report-privilege",
                        },
                    },
                    {
                        path: "v_balance_purchase",
                        component: Vue.component("VBalancePurchases"),
                        meta: {
                            label: "買掛残高一覧表",
                            icon: "fa-scroll",
                            key: "purchases_report-privilege",
                        },
                    },
                    {
                        path: "v_payment_purchase",
                        component: Vue.component("VPaymentPurchases"),
                        meta: {
                            label: "支払明細表",
                            icon: "fa-scroll",
                            key: "purchases_report-privilege",
                        },
                    },
                ],
            },
            // 在庫 -----------------------------------------------
            {
                path: "/t_inventory",
                component: Vue.component("CommonContainer"),
                meta: {
                    label: "在庫管理",
                    icon: "fa-warehouse",
                    key: "t_inventory-privilege",
                },
                children: [
                    // index
                    {
                        path: "",
                        component: Vue.component("TInventories"),
                        meta: {
                            label: "在庫管理",
                            icon: "fa-warehouse",
                            isCustomHeader: true,
                            isIgnoreBreadcrumb: true,
                        },
                    },
                    // add
                    {
                        path: "add",
                        component: Vue.component("TIvtMaterialAdd"),
                        meta: {
                            label: "新規在庫登録",
                            icon: "fa-warehouse",
                            isCustomHeader: true,
                        },
                    },
                    {
                        path: "edit/:id/:date",
                        component: Vue.component("TIvtMaterialEdit"),
                        meta: {
                            // name : "edit" ,
                            label: "在庫編集",
                            icon: "fa-warehouse",
                            isCustomHeader: true,
                        },
                    },
                    // QRラベル作成
                    {
                        path: "qr_label_export",
                        component: Vue.component("TIvtMaterialQrLabelExport"),
                        meta: {
                            label: "QRラベル作成",
                            icon: "fa-warehouse",
                            isCustomHeader: true,
                        },
                    },
                    // qr
                    {
                        path: "qr/:type",
                        component: Vue.component("TIvtMaterialQr"),
                        meta: {
                            label: "QR",
                            icon: "fa-warehouse",
                            isCustomHeader: true,
                        },
                    },
                ],
            },

            // rel -----------------------------------------------
            {
                path: "/rel",
                component: { template: "<router-view></router-view>" },
                meta: {
                    label: "連携管理",
                    icon: "fa-handshake",
                    key: "rel-privilege",
                },
                children: [
                    {
                        path: "",
                        name: "rel_menu",
                        component: Vue.component("Rels"),
                    },
                    {
                        path: "export_t_sale",
                        component: Vue.component("ExportTSale"),
                        meta: {
                            label: "売上 データ連携",
                            icon: "fa-handshake",
                            key: "rel_export-privilege",
                        },
                    },
                    {
                        path: "export_t_p_invoice",
                        component: Vue.component("ExportTPInvoice"),
                        meta: {
                            label: "仕入 データ連携",
                            icon: "fa-handshake",
                            key: "rel_export-privilege",
                        },
                    },
                    {
                        path: "export_payment_sale",
                        component: Vue.component("ExportPaymentSale"),
                        meta: {
                            label: "入金 データ連携",
                            icon: "fa-handshake",
                            key: "rel_export-privilege",
                        },
                    },
                    {
                        path: "export_payment_purchase",
                        component: Vue.component("ExportPaymentPurchase"),
                        meta: {
                            label: "支払 データ連携",
                            icon: "fa-handshake",
                            key: "rel_export-privilege",
                        },
                    },
                    // 注文情報
                    {
                        path: "rt_ss_order",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "SS注文情報", isCustomHeader: true },
                        children: [
                            {
                                path: "",
                                component: Vue.component("RtSsOrders"),
                                meta: {
                                    label: "SS注文情報",
                                    icon: "fa-handshake",
                                    isIgnoreBreadcrumb: true,
                                    isCustomHeader: true,
                                    key: "rel_rt_ss_order-privilege",
                                },
                            },
                        ],
                    },
                    //
                    {
                        path: "graphic_layout",
                        component: Vue.component("GraphicLayout"),
                        meta: {
                            label: "データレイアウト",
                            icon: "fa-handshake",
                            key: "rel_export-privilege",
                        },
                    },
                ],
            },
            //納品予定リスト
            {
                path: "/deliverylist",
                component: { template: "<router-view></router-view>" },
                meta: { label: "納品予定リスト", icon: "fa-truck " },
                children: [
                    {
                        path: "",
                        component: Vue.component("TDeliveryList"),
                        meta: {
                            label: "納品予定リスト",
                            icon: "fa-truck",
                            isCustomHeader: true,
                            isIgnoreBreadcrumb: true,
                        },
                    },
                ],
            },

            // masters -----------------------------------------------
            {
                path: "/master",
                component: { template: "<router-view></router-view>" },
                meta: { label: "マスタ管理", icon: "fa-server" },
                children: [
                    {
                        path: "",
                        component: Vue.component("Masters"),
                    },
                    // システム設定NSK専用画面
                    {
                        path: "sm_option",
                        component: Vue.component("CommonContainer"),
                        meta: {
                            label: "システム設定NSK専用画面",
                            isCustomHeader: true,
                        },
                        children: [
                            {
                                path: "",
                                component: Vue.component("SmOptionEdit"),
                                name: "sm_option",
                                meta: {
                                    label: "システム設定NSK専用画面",
                                    icon: "fa-server",
                                    isIgnoreBreadcrumb: true,
                                    isCustomHeader: true,
                                    key: "",
                                },
                            },
                        ],
                    },
                    // システム設定ユーザー編集画面
                    {
                        path: "sm_option4user",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "システムマスタ", isCustomHeader: true },
                        children: [
                            {
                                path: "",
                                component: Vue.component("SmOptionEdit4User"),
                                name: "sm_option4user",
                                meta: {
                                    label: "システムマスタ",
                                    icon: "fa-server",
                                    isIgnoreBreadcrumb: true,
                                    isCustomHeader: true,
                                    key: "sm_option_master-privilege",
                                },
                            },
                        ],
                    },
                    // ユーザー個別設定
                    {
                        path: "m_user_option",
                        component: Vue.component("CommonContainer"),
                        meta: {
                            label: "ユーザー個別設定",
                            isCustomHeader: true,
                        },
                        children: [
                            {
                                path: "",
                                component: Vue.component("SmUserOptionEdit"),
                                name: "m_user_option",
                                meta: {
                                    label: "ユーザー個別設定",
                                    icon: "fa-server",
                                    isIgnoreBreadcrumb: true,
                                    isCustomHeader: true,
                                },
                            },
                        ],
                    },

                    // 資材
                    {
                        path: "m_material",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "材料マスタ", isCustomHeader: true },
                        children: [
                            {
                                path: "",
                                component: Vue.component("MMaterials"),
                                name: "m_material",
                                meta: {
                                    label: "材料マスタ",
                                    icon: "fa-server",
                                    isIgnoreBreadcrumb: true,
                                    isCustomHeader: true,
                                    key: "m_material_master-privilege",
                                },
                            },
                            {
                                path: "add",
                                component: Vue.component("MMaterialEdit"),
                                meta: {
                                    label: "材料追加",
                                    icon: "fa-server",
                                },
                            },
                            {
                                path: "edit/:id",
                                component: Vue.component("MMaterialEdit"),
                                meta: {
                                    label: "材料編集",
                                    icon: "fa-server",
                                },
                            },
                            {
                                path: "view/:id",
                                component: Vue.component("MMaterialView"),
                                meta: {
                                    label: "材料表示",
                                    icon: "fa-server",
                                },
                            },
                        ],
                    },

                    // 商品カテゴリ
                    {
                        path: "m_product_category",
                        component: Vue.component("CommonContainer"),
                        meta: {
                            label: "商品カテゴリーマスタ",
                            isCustomHeader: true,
                        },
                        children: [
                            {
                                path: "",
                                component: Vue.component("MProductCategories"),
                                meta: {
                                    label: "商品カテゴリーマスタ",
                                    icon: "fa-server",
                                    isIgnoreBreadcrumb: true,
                                    isCustomHeader: true,
                                },
                            },
                            {
                                path: "add",
                                component: Vue.component(
                                    "MProductCategoryEdit"
                                ),
                                meta: {
                                    label: "商品カテゴリー追加",
                                    icon: "fa-server",
                                },
                            },
                            {
                                path: "edit/:id",
                                component: Vue.component(
                                    "MProductCategoryEdit"
                                ),
                                meta: {
                                    label: "商品カテゴリー編集",
                                    icon: "fa-server",
                                },
                            },
                            {
                                path: "view/:id",
                                component: Vue.component(
                                    "MProductCategoryView"
                                ),
                                meta: {
                                    label: "商品カテゴリー表示",
                                    icon: "fa-server",
                                },
                            },
                        ],
                    },

                    // 工程カテゴリ
                    {
                        path: "m_process_category",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "工程カテゴリ", isCustomHeader: true },
                        children: [
                            {
                                path: "",
                                component: Vue.component("MProcessCategories"),
                                meta: {
                                    label: "工程カテゴリ",
                                    icon: "fa-server",
                                    isIgnoreBreadcrumb: true,
                                    isCustomHeader: true,
                                },
                            },
                            {
                                path: "add",
                                component: Vue.component(
                                    "MProcessCategoryEdit"
                                ),
                                meta: {
                                    label: "工程カテゴリ追加",
                                    icon: "fa-server",
                                },
                            },
                            {
                                path: "edit/:id",
                                component: Vue.component(
                                    "MProcessCategoryEdit"
                                ),
                                meta: {
                                    label: "工程カテゴリ編集",
                                    icon: "fa-server",
                                },
                            },
                            {
                                path: "view/:id",
                                component: Vue.component(
                                    "MProcessCategoryView"
                                ),
                                meta: {
                                    label: "工程カテゴリ表示",
                                    icon: "fa-server",
                                },
                            },
                        ],
                    },

                    // 生産先
                    {
                        path: "m_production",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "生産先", isCustomHeader: true },
                        children: [
                            {
                                path: "",
                                component: Vue.component("MProductions"),
                                meta: {
                                    label: "生産先",
                                    icon: "fa-server",
                                    isIgnoreBreadcrumb: true,
                                    isCustomHeader: true,
                                },
                            },
                            {
                                path: "add",
                                component: Vue.component("MProductionEdit"),
                                meta: {
                                    label: "生産先追加",
                                    icon: "fa-server",
                                },
                            },
                            {
                                path: "edit/:id",
                                component: Vue.component("MProductionEdit"),
                                meta: {
                                    label: "生産先編集",
                                    icon: "fa-server",
                                },
                            },
                            {
                                path: "view/:id",
                                component: Vue.component("MProductionView"),
                                meta: {
                                    label: "生産先表示",
                                    icon: "fa-server",
                                },
                            },
                        ],
                    },

                    // 担当者
                    {
                        path: "m_user",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "ユーザーマスタ", isCustomHeader: true },
                        children: [
                            {
                                path: "",
                                component: Vue.component("MUsers"),
                                meta: {
                                    label: "ユーザーマスタ",
                                    icon: "fa-server",
                                    isIgnoreBreadcrumb: true,
                                    isCustomHeader: true,
                                    key: "m_user_master-privilege",
                                },
                            },
                            {
                                path: "add",
                                component: Vue.component("MUserEdit"),
                                meta: {
                                    label: "ユーザー追加",
                                    icon: "fa-server",
                                },
                            },
                            {
                                path: "edit/:id",
                                component: Vue.component("MUserEdit"),
                                meta: {
                                    label: "ユーザー編集",
                                    icon: "fa-server",
                                },
                            },
                            {
                                path: "view/:id",
                                component: Vue.component("MUserView"),
                                meta: {
                                    label: "ユーザー表示",
                                    icon: "fa-server",
                                },
                            },
                        ],
                    },

                    // 権限
                    {
                        path: "m_role",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "権限マスタ", isCustomHeader: true },
                        children: [
                            {
                                path: "",
                                component: Vue.component("MRoles"),
                                meta: {
                                    label: "権限マスタ",
                                    icon: "fa-server",
                                    isIgnoreBreadcrumb: true,
                                    isCustomHeader: true,
                                    key: "m_role_master-privilege",
                                },
                            },
                            {
                                path: "add",
                                component: Vue.component("MRoleEdit"),
                                meta: {
                                    label: "権限追加",
                                    icon: "fa-server",
                                },
                            },
                            {
                                path: "edit/:id",
                                component: Vue.component("MRoleEdit"),
                                meta: {
                                    label: "権限編集",
                                    icon: "fa-server",
                                },
                            },
                            {
                                path: "view/:id",
                                component: Vue.component("MRoleView"),
                                meta: {
                                    label: "権限表示",
                                    icon: "fa-server",
                                },
                            },
                        ],
                    },

                    // 権限key
                    {
                        path: "m_role_key",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "権限キーマスタ", isCustomHeader: true },
                        children: [
                            {
                                path: "",
                                component: Vue.component("MRoleKeys"),
                                meta: {
                                    label: "権限キーマスタ",
                                    icon: "fa-server",
                                    isIgnoreBreadcrumb: true,
                                    isCustomHeader: true,
                                },
                            },
                            // {
                            //   path : "add" ,
                            //   component: Vue.component("MRoleKeyEdit") ,
                            //   meta : {
                            //     label : "権限キー追加" ,
                            //     icon : "fa-server" ,
                            //   } ,
                            // } ,
                            // {
                            //   path : "edit/:id" ,
                            //   component: Vue.component("MRoleKeyEdit") ,
                            //   meta : {
                            //     label : "権限キー編集" ,
                            //     icon : "fa-server" ,
                            //   } ,
                            // } ,
                            // {
                            //   path : "view/:id" ,
                            //   component: Vue.component("MRoleKeyView") ,
                            //   meta : {
                            //     label : "権限キー表示" ,
                            //     icon : "fa-server" ,
                            //   } ,
                            // } ,
                        ],
                    },
                    // カレンダー情報
                    {
                        path: "m_calendar",
                        component: Vue.component("CommonContainer"),
                        meta: {
                            label: "カレンダーマスタ",
                            isCustomHeader: true,
                        },
                        children: [
                            {
                                path: "",
                                component: Vue.component("MCalendars"),
                                meta: {
                                    label: "カレンダーマスタ",
                                    icon: "fa-server",
                                    isIgnoreBreadcrumb: true,
                                    isCustomHeader: true,
                                },
                            },
                            {
                                path: "add",
                                component: Vue.component("MCalendarEdit"),
                                meta: {
                                    label: "カレンダー情報追加",
                                    icon: "fa-server",
                                },
                            },
                            {
                                path: "edit/:id",
                                component: Vue.component("MCalendarEdit"),
                                meta: {
                                    label: "カレンダー情報編集",
                                    icon: "fa-server",
                                },
                            },
                            {
                                path: "view/:id",
                                component: Vue.component("MCalendarView"),
                                meta: {
                                    label: "カレンダー情報表示",
                                    icon: "fa-server",
                                },
                            },
                        ],
                    },

                    // タグカテゴリ
                    {
                        path: "m_tag_category",
                        component: Vue.component("CommonContainer"),
                        meta: {
                            label: "タグカテゴリマスタ",
                            isCustomHeader: true,
                        },
                        children: [
                            {
                                path: "",
                                component: Vue.component("MTagCategories"),
                                meta: {
                                    label: "タグカテゴリマスタ",
                                    icon: "fa-server",
                                    isIgnoreBreadcrumb: true,
                                    isCustomHeader: true,
                                },
                            },
                            {
                                path: "add",
                                component: Vue.component("MTagCategoryEdit"),
                                meta: {
                                    label: "タグカテゴリ追加",
                                    icon: "fa-server",
                                },
                            },
                            {
                                path: "edit/:id",
                                component: Vue.component("MTagCategoryEdit"),
                                meta: {
                                    label: "タグカテゴリ編集",
                                    icon: "fa-server",
                                },
                            },
                            {
                                path: "view/:id",
                                component: Vue.component("MTagCategoryView"),
                                meta: {
                                    label: "タグカテゴリ表示",
                                    icon: "fa-server",
                                },
                            },
                        ],
                    },

                    // タグ
                    {
                        path: "m_tag",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "タグマスタ", isCustomHeader: true },
                        children: [
                            {
                                path: "",
                                component: Vue.component("MTags"),
                                meta: {
                                    label: "タグマスタ",
                                    icon: "fa-server",
                                    isIgnoreBreadcrumb: true,
                                    isCustomHeader: true,
                                },
                            },
                            {
                                path: "add",
                                component: Vue.component("MTagEdit"),
                                meta: {
                                    label: "タグ追加",
                                    icon: "fa-server",
                                },
                            },
                            {
                                path: "edit/:id",
                                component: Vue.component("MTagEdit"),
                                meta: {
                                    label: "タグカテゴリー編集",
                                    icon: "fa-server",
                                },
                            },
                            {
                                path: "view/:id",
                                component: Vue.component("MTagView"),
                                meta: {
                                    label: "タグ表示",
                                    icon: "fa-server",
                                },
                            },
                        ],
                    },

                    // 検証
                    {
                        path: "m_validate",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "検証マスタ", isCustomHeader: true },
                        children: [
                            {
                                path: "",
                                component: Vue.component("MValidates"),
                                name: "m_validate",
                                meta: {
                                    label: "検証マスタ",
                                    icon: "fa-server",
                                    isIgnoreBreadcrumb: true,
                                    isCustomHeader: true,
                                },
                            },
                            {
                                path: "add",
                                component: Vue.component("MValidateEdit"),
                                meta: {
                                    label: "検証追加",
                                    icon: "fa-server",
                                },
                            },
                            {
                                path: "edit/:id",
                                component: Vue.component("MValidateEdit"),
                                meta: {
                                    label: "検証編集",
                                    icon: "fa-server",
                                },
                            },
                            {
                                path: "view/:id",
                                component: Vue.component("MValidateView"),
                                meta: {
                                    label: "検証表示",
                                    icon: "fa-server",
                                },
                            },
                        ],
                    },

                    //取引先マスタ
                    {
                        path: "m_customer",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "取引先マスタ", isCustomHeader: true },
                        children: [
                            {
                                path: "",
                                component: Vue.component("MCustomerContainer"),
                                name: "m_customer",
                                meta: {
                                    label: "取引先マスタ",
                                    icon: "fa-server",
                                    isIgnoreBreadcrumb: true,
                                    isCustomHeader: true,
                                    key: "m_customer_master-privilege",
                                },
                            },
                            {
                                path: "add",
                                component: Vue.component("MCustomerEdit"),
                                meta: {
                                    label: "取引先追加",
                                    icon: "fa-server",
                                },
                            },
                            {
                                path: "edit/:id",
                                component: Vue.component("MCustomerEdit"),
                                meta: {
                                    label: "取引先編集",
                                    icon: "fa-server",
                                },
                            },
                            {
                                path: "view/:id",
                                component: Vue.component("MCustomerView"),
                                meta: {
                                    label: "取引先表示",
                                    icon: "fa-server",
                                },
                            },
                        ],
                    },

                    //取引先付加情報マスタ
                    {
                        path: "m_customer_info",
                        component: Vue.component("CommonContainer"),
                        meta: {
                            label: "取引先付加情報マスタ",
                            isCustomHeader: true,
                        },
                        children: [
                            {
                                path: "",
                                component: Vue.component(
                                    "MCustomerInfoContainer"
                                ),
                                name: "m_customer_info",
                                meta: {
                                    label: "取引先付加情報マスタ",
                                    icon: "fa-server",
                                    isIgnoreBreadcrumb: true,
                                    isCustomHeader: true,
                                    key: "m_customer_master-privilege",
                                },
                            },
                            {
                                path: "edit/:id",
                                component: Vue.component("MCustomerInfoEdit"),
                                meta: {
                                    label: "取引先付加情報編集",
                                    icon: "fa-server",
                                },
                            },
                        ],
                    },
                ],
            },

            {
                path: "/administration",
                component: { template: "<router-view></router-view>" },
                meta: { label: "管理設定", icon: "fa-wrench" },
                children: [
                    {
                        path: "",
                        component: Vue.component("Administrations"),
                    },
                    // 生産計画グルーピング設定
                    {
                        path: "m_production_branch_configs",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "", isCustomHeader: false },
                        children: [
                            {
                                path: "",
                                component: Vue.component(
                                    "ProductionBranchConfig"
                                ),
                                meta: {
                                    label: "生産計画拠点設定",
                                    icon: "fa-wrench",
                                },
                            },
                        ],
                    },

                    // 生産計画グルーピング設定
                    {
                        path: "m_production_group_configs",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "", isCustomHeader: false },
                        children: [
                            {
                                path: "",
                                component: Vue.component(
                                    "ProductionGroupConfig"
                                ),
                                meta: {
                                    label: "生産計画グルーピング設定",
                                    icon: "fa-wrench",
                                },
                            },
                        ],
                    },
                ],
            },

            //分析 -----------------------------------------------
            {
                path: "/analyses",
                component: { template: "<router-view></router-view>" },
                meta: {
                    label: "分析",
                    icon: "fa-chart-bar",
                    // isIgnoreBreadcrumb:true ,
                },

                children: [
                    {
                        path: "",
                        component: Vue.component("Analyses"),
                    },
                    // 生産管理分析
                    {
                        path: "t_productions",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "", isCustomHeader: false },
                        children: [
                            {
                                path: "",
                                component: Vue.component(
                                    "TProductionsAnalysis"
                                ),
                                meta: {
                                    label: "生産実績分析",
                                    icon: "fa-chart-bar",
                                    key: "production_analyse-privilege",
                                },
                            },
                        ],
                    },
                    // 納品分析
                    {
                        path: "t_deliveries",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "", isCustomHeader: false },
                        children: [
                            {
                                path: "",
                                component: Vue.component(
                                    "TProjectDeliveriesAnalysis"
                                ),
                                meta: {
                                    label: "納品分析",
                                    icon: "fa-chart-bar",
                                    key: "delivery_analyse-privilege",
                                },
                            },
                        ],
                    },
                    // 売上分析
                    {
                        path: "t_sales",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "", isCustomHeader: false },
                        children: [
                            {
                                path: "",
                                component: Vue.component("TSalesAnalysis"),
                                meta: {
                                    label: "売上分析",
                                    icon: "fa-chart-bar",
                                    isCustomHeader: true,
                                    key: "sales_analyse-privilege",
                                },
                            },
                        ],
                    },
                    // 仕入分析
                    {
                        path: "t_p_invoices",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "", isCustomHeader: false },
                        children: [
                            {
                                path: "",
                                component: Vue.component("TPInvoicesAnalysis"),
                                meta: {
                                    label: "仕入分析",
                                    icon: "fa-chart-bar",
                                    isCustomHeader: true,
                                    key: "purchases_analyse-privilege",
                                },
                            },
                        ],
                    },
                    // 発注分析
                    {
                        path: "t_p_orders",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "", isCustomHeader: false },
                        children: [
                            {
                                path: "",
                                component: Vue.component("TPOrdersAnalysis"),
                                meta: {
                                    label: "発注分析",
                                    icon: "fa-chart-bar",
                                    key: "",
                                },
                            },
                        ],
                    },
                ],
            },

            // t_points
            {
                path: "/point",
                component: { template: "<router-view></router-view>" },
                meta: {
                    label: "ポイント",
                    icon: "fa-parking",
                    // isIgnoreBreadcrumb:true ,
                },

                children: [
                    {
                        path: "",
                        component: Vue.component("TPoints"),
                    },
                    // ポイント率確定
                    {
                        path: "project_points",
                        component: Vue.component("CommonContainer"),
                        meta: {
                            label: "",
                            isCustomHeader: false,
                        },
                        children: [
                            {
                                path: "",
                                component: Vue.component("TProjectPoints"),
                                meta: {
                                    label: "ポイント率確定",
                                    icon: "fa-parking",
                                    key: "point_admin-privilege",
                                    isCustomHeader: true,
                                    isIgnoreBreadcrumb: false,
                                },
                            },
                        ],
                    },
                    // ポイント締め
                    {
                        path: "project_points_closing",
                        component: Vue.component("CommonContainer"),
                        meta: {
                            label: "",
                            isCustomHeader: false,
                        },
                        children: [
                            {
                                path: "",
                                component: Vue.component(
                                    "TProjectPointsClosing"
                                ),
                                meta: {
                                    label: "ポイント締め",
                                    icon: "fa-parking",
                                    key: "point_admin-privilege",
                                    isCustomHeader: true,
                                    isIgnoreBreadcrumb: false,
                                },
                            },
                        ],
                    },
                    // ユーザーポイント
                    {
                        path: "user_points",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "", isCustomHeader: false },
                        children: [
                            {
                                path: "",
                                component: Vue.component("TUserPoints"),
                                meta: {
                                    label: "ユーザーポイント",
                                    icon: "fa-parking",
                                    key: "point_admin-privilege",
                                },
                            },
                        ],
                    },
                    // ポイント分析
                    {
                        path: "t_u_points",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "", isCustomHeader: false },
                        children: [
                            {
                                path: "",
                                component: Vue.component("TUserPointsAnalysis"),
                                meta: {
                                    label: "ポイント分析",
                                    icon: "fa-chart-bar",
                                    isCustomHeader: true,
                                    key: "point_admin-privilege",
                                },
                            },
                        ],
                    },
                ],
            },

            // trial -----------------------------------------------
            {
                path: "/trial",
                component: { template: "<router-view></router-view>" },
                meta: { label: "トライアル", icon: "fa-handshake" },
                children: [
                    {
                        path: "",
                        component: Vue.component("Trials"),
                    },
                    // 板レイアウト
                    {
                        path: "board_layout_simulation",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "", isCustomHeader: false },
                        children: [
                            {
                                path: "",
                                component: Vue.component(
                                    "BoardLayoutSimulation"
                                ),
                                meta: {
                                    label: "板レイアウト",
                                    icon: "fa-th-large",
                                },
                            },
                        ],
                    },
                    // 枠レイアウト
                    {
                        path: "framelayout_simulation",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "", isCustomHeader: false },
                        children: [
                            {
                                path: "",
                                component: Vue.component(
                                    "FrameLayoutSimulation"
                                ),
                                meta: {
                                    label: "枠レイアウト",
                                    icon: "fa-th-large",
                                },
                            },
                        ],
                    },
                    {
                        path: "ocr_test",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "", isCustomHeader: false },
                        children: [
                            {
                                path: "",
                                component: Vue.component("OcrTest"),
                                meta: {
                                    label: "文字読み取り",
                                    icon: "fa-file-alt",
                                },
                            },
                        ],
                    },
                ],
            },

            // Devs -----------------------------------------------
            {
                path: "/dev",
                component: { template: "<router-view></router-view>" },
                meta: { label: "Developer", icon: "fa-code" },
                children: [
                    {
                        path: "",
                        component: Vue.component("Devs"),
                    },
                    // マスタ引き
                    {
                        path: "master_ref",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "", isCustomHeader: false },
                        children: [
                            {
                                path: "",
                                component: Vue.component("MasterRefs"),
                                meta: {
                                    label: "マスタ引き",
                                    icon: "fa-th-large",
                                },
                            },
                        ],
                    },

                    // SVG
                    {
                        path: "svg_test",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "", isCustomHeader: false },
                        children: [
                            {
                                path: "",
                                component: Vue.component("SvgTest"),
                                meta: {
                                    label: "SVG Test",
                                    icon: "fa-th-large",
                                },
                            },
                        ],
                    },
                    // http_to_local_test
                    {
                        path: "http_to_local_test",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "", isCustomHeader: false },
                        children: [
                            {
                                path: "",
                                component: Vue.component("HttpToLocalTest"),
                                meta: {
                                    label: "HttpToLocalTest",
                                    icon: "fa-th-large",
                                },
                            },
                        ],
                    },

                    // http_to_local_test
                    {
                        path: "popover",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "", isCustomHeader: false },
                        children: [
                            {
                                path: "",
                                component: Vue.component("DevPopover"),
                                meta: {
                                    label: "DevPopover",
                                    icon: "fa-th-large",
                                },
                            },
                        ],
                    },

                    // t_project_product_process_test
                    {
                        path: "t_project_product_process_test",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "", isCustomHeader: false },
                        children: [
                            {
                                path: "",
                                component: Vue.component(
                                    "DevTProjectProductProcessTest"
                                ),
                                meta: {
                                    label: "DevTProjectProductProcessTest",
                                    icon: "fa-th-large",
                                },
                            },
                        ],
                    },

                    // t_project_product_process_update_cost4bug
                    {
                        path: "t_project_product_process_update_cost4bug",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "", isCustomHeader: false },
                        children: [
                            {
                                path: "",
                                component: Vue.component(
                                    "TProjectProductProcessCost4update"
                                ),
                                meta: {
                                    label: "バグ修正後、コスト再計算用（作業時間 > 0 And コスト = 0 , Limit 200) ",
                                    icon: "fa-th-large",
                                },
                            },
                        ],
                    },

                    // radial_progress_bar_test
                    {
                        path: "radial_progress_bar_test",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "", isCustomHeader: false },
                        children: [
                            {
                                path: "",
                                component: Vue.component(
                                    "RadialProgressBarTest"
                                ),
                                meta: {
                                    label: "RadialProgressBar",
                                    icon: "fa-th-large",
                                },
                            },
                        ],
                    },

                    // que_test
                    {
                        path: "que_test",
                        component: Vue.component("CommonContainer"),
                        meta: { label: "", isCustomHeader: false },
                        children: [
                            {
                                path: "",
                                component: Vue.component("QueTest"),
                                meta: {
                                    label: "QueTest",
                                    icon: "fa-th-large",
                                },
                            },
                        ],
                    },
                ],
            },

            //api_throw
            {
                path: "/api_throw",
                component: { template: "<router-view></router-view>" },
                meta: { label: "", icon: "" },
                children: [
                    {
                        path: "delivery_comp_qr/:id",
                        component: Vue.component("ApiThrow"),
                        meta: {
                            path: "api/tProjectDelivery/completeByQr",
                        },
                    },
                ],
            },
            { path: "*", redirect: "/home" },
        ];
    },

    beforeEach: (to: Route, from: Route, next: NavigationGuardNext) => {
        sessionStorage.setItem("requestFrom", from.path);
        const store = useStore();
        // @ts-ignore
        const getCurrentUser = (next: NavigationGuardNext) => {
            store
                .getCurrentUserAction()
                .then(() => {
                    canAccess("reload");
                    //console.log("getCurrent") ;
                    //console.log(to) ;
                    // next();
                })
                .catch(() => {
                    next({ name: "login" });
                });
        };

        //keyの存在判定
        const isExistKey = (keyObj: any) => {
            //個別ページ（edit,view画面等のキー）
            const characteristicKey = keyObj.meta.key;

            //各機能全体のキー
            //@ts-ignore
            const generalKey = keyObj.matched
                .map((x: any) => x.meta)
                .find((y: any) => y.key !== undefined);

            if (characteristicKey) return characteristicKey;
            if (generalKey) return generalKey.key;

            //キーが設定されていない時
            return "no-check";
        };
        const canAccess = (status: string) => {
            const access = store.getRole(isExistKey(to));
            // @ts-ignore
            const routeName = to.meta.name;

            //console.log(status) ;
            if (routeName == undefined || routeName == "view") {
                if (access >= 10) {
                    //console.log("view_ok") ;
                    next();
                } else {
                    //console.log("view_false") ;
                    if (status === "reload") next({ name: "home" });
                }
            }
            if (routeName == "add" || routeName == "edit") {
                if (access >= 20) {
                    //console.log("add_ok") ;
                    next();
                } else {
                    //console.log("add_false") ;
                    if (status === "reload") next({ name: "home" });
                }
            }
        };

        if (to.name !== "login") {
            if (store.masters.IsMasterLoaded) {
                // ロード済み
                //console.log("master is loaded ") ;
                store
                    .getPageTransitionUserAction()
                    .then(() => {
                        //console.log("ok")
                        canAccess("transition");
                    })
                    .catch(() => {
                        //console.log("ng")
                        next({ name: "login" });
                    });
            } else {
                //console.log("master is not loaded ") ;
                next();
                getCurrentUser(next);
            }
        } else {
            next();
        }
    },
};
