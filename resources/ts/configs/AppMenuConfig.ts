export default {
    Menus: [
        {
            title: "ホーム",
            to: "/home",
            icon: "fa-home",
            isDevOnly: false,
            key: "no-check"
        },
        {
            title: "物件管理",
            to: "/t_project",
            icon: "fa-building",
            isDevOnly: false,
            key: "t_project-privilege"
        },
        {
            title: "生産管理",
            to: "/t_productions/plan", 
            icon: "fa-print", 
            isDevOnly: false, 
            key: "t_production_control-privilege"
        },
        { 
            title: "販売管理", 
            to: "", 
            icon: "fa-suitcase", 
            isDevOnly: false, 
            key: "no-check" ,
            children : [
                { title: "発注管理", to: "/t_p_order",   icon: "fa-shopping-cart", isDevOnly: false, key: "t_p_order-privilege" },
                { title: "仕入管理", to: "/t_p_invoice", icon: "fa-shopping-bag",  isDevOnly: false, key: "t_p_invoice-privilege" },
                { title: "売上管理", to: "/t_sale",      icon: "fa-sign",          isDevOnly: false, key: "t_sale-privilege" },
                { title: "締管理",   to: "/complete",    icon: "fa-file-invoice",  isDevOnly: false, key: "t_complete-privilege" },
                { title: "集計帳票", to: "/report",      icon: "fa-scroll",        isDevOnly: false, key: "no-check" },
            ]
        },
        { 
            title: "在庫管理", 
            to: "/t_inventory", 
            icon: "fa-warehouse", 
            isDevOnly: false, 
            key: "t_inventory-privilege" 
        },
        { 
            title: "連携管理", 
            to: "/rel", 
            icon: "fa-handshake", 
            isDevOnly: false, 
            key: "rel-privilege" 
        },
        { 
            title: "納品予定リスト", 
            to: "/deliverylist", 
            icon: "fa-truck", 
            isDevOnly: false, 
            key: "no-check" 
        },
        { 
            title: "分析", 
            to: "/analyses", 
            icon: "fa-chart-bar", 
            isDevOnly: true, 
            key: "no-check" 
        },
        { 
            title: "マスタ", 
            to: "/master", 
            icon: "fa-server", 
            isDevOnly: false, 
            key: "no-check" 
        },
        { 
            title: "ポイント", 
            to: "/point", 
            icon: "fa-parking", 
            isDevOnly: false, 
            key: "point_admin-privilege" 
        },
        { 
            title: "管理設定", 
            to: "/administration", 
            icon: "fa-wrench", 
            isDevOnly: false, 
            key: "no-check" 
        },
        { 
            title: "トライアル",
             to: "/trial", 
             icon: "fa-plane-departure", 
             isDevOnly: false, 
             key: "no-check" 
        },
        { 
            title: "開発用", 
            to: "/dev", 
            icon: "fa-code", 
            key: "" , 
            isDevOnly: true
         },
    ]
}