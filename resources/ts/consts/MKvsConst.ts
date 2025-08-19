export default {
    MMaterials: {
        // 資材マスタのCategoryMKvId
        Category: {
            LAMI: 1350003, // ラミネート
        },
        SubCategory: {
            PRIMAR: 1420034, // プライマー
            PATE: 1420035, // パテ
            APPLICATION: 1420036, // アプリ
            GROMMET: 1420032, // ハトメ
            MAGIC_TAPE: 1420005, // マジックテープ
            ROPE4ROPE_OUT: 1420033, // ロープ出し用ロープ/ハトメ用ロープ
            PIPE: 1420037, // パイプ
            SILLICON_RUBBER: 1420038, // シリコンゴム
            DOUBLE_SIDE_TAPE: 1420039, // 両面テープ
            REBOARD_ACCESSORY: 1420002, // リボード備品
        },
    },

    // 工程マスタ
    MProcesses: {
        RATE_TYPE_1: 9010001, // 掛け率タイプが1固定
        RATE_TYPE_PRODUCT_COLUMN: 9010002, // 掛け率タイプが商品のカラム
        RATE_TYPE_COLUMN: 9010003, // 掛け率タイプがカラム
        RATE_TYPE_COMPUTED: 9010004, // 掛け率タイプがComputed
        RATE_TYPE_CUSTOM: 9010099, // 掛け率タイプがカスタム
    },

    // 物件
    TProjects: {
        Product: {
            // 保証
            Warranty: {
                MCS: 3110001, // mcs
            },
        },
        Process: {
            //出力
            Print: {
                //pass overlapping
                POL: {
                    ORIGINAL: 2230001,
                    ALTERNATE: 2230002,
                    SINUS: 2230003,
                },
            },
            // 貼り
            UniteMaterial: {
                TARGET_PRODUCT: 2510001, // 製品
                TARGET_BOARD: 2510002, // 板
            },
            // 幕仕上げ
            PostCartain: {
                GROMMET_SPECIFY_PITCH: 2020001, // ハトメ ピッチ指定
                GROMMET_SPECIFY_QTY: 2020002, // ハトメ 個数指定
                MAGIC_TAPE_BOTH_SIDE: 2035003, // マジックテープ オスメス
            },
            // 両面テープ貼り
            BackSideTape: {
                WAY_ALL: 2460001, // 方法 全面
                WAY_FRAME: 2460002, // 方法 周囲
            },
        },
    },

    // 生産管理
    TProductions: {
        // 実績
        Results: {
            InputTypes: {
                ALL: 4510001, // 全入力
                ONLY_MINUTES: 4510002, // 所要分数のみ
                ONLY_IS_FINISHED: 4510003, // 終了のみ
            },
            Stop: {
                InputTypes: {
                    ALL: 4610001, // 全入力
                    ONLY_MINUTES: 4610002, // 中断分数のみ
                },
            },
        },
    },

    // SystemOption
    SmOptions: {
        // 物件
        Project: {
            IS_CLEAR_SALES_PRICES_WHEN_COPY: 8010001, // 物件コピー時に売価クリア
            IS_CLEAR_DELIVERY_FEES_WHEN_COPY: 8010002, // 物件コピー時に送料クリア
            SUMMARY_VIEW_MODE: 8010011, // 物件サマリー表示モード 0:権限持ちは表示 1:ログインユーザー = 営業担当
        },
        // 生産管理
        Production: {
            IGNORE_DELIVERY_DATE_LESS_THAN: 8010101, // 生産計画:対象外納期 (値以前の納期の予定は読まない)
        },

        // 販売管理
        SalesManagement: {
            EDITABLE_TERM: 8010401, // 販売管理:編集可能な期間
        },
    },

    // 取引先マスタ
    MCustomers: {
        //販売管理.締区分
        ACCOUNT_M_KV_ID_UNCALCATED: 1060000, //締区分　未計算
        ACCOUNT_M_KV_ID_DETAILS: 1060001, //締区分　個別
        ACCOUNT_M_KV_ID_SLIP: 1060002, //締区分　伝票
        ACCOUNT_M_KV_ID_BILLING: 1060003, //締区分　請求時

        //販売管理.端数区分
        FRACTION_M_KV_ID_UNCALCATED: 1070000, //金額・消費税端数　未計算
        FRACTION_M_KV_ID_ROUND_DOWN: 1070001, //金額・消費税端数　切り捨て
        FRACTION_M_KV_ID_ROUND_OFF: 1070002, //金額・消費税端数　四捨五入
        FRACTION_M_KV_ID_ROUND_UP: 1070003, //金額・消費税端数　切上げ
    },

    TUserPoints: {
        POINT_TYPE_M_KV_ID_GRANT: 6000001, //ポイント区分　付与
        POINT_TYPE_M_KV_ID_USE: 6000002, //ポイント区分　使用
        POINT_TYPE_M_KV_ID_APPLY: 6000003, //ポイント区分　使用申請
        POINT_TYPE_M_KV_ID_REJECT: 6000004, //ポイント区分　申請拒否

        POINT_GRANT_TYPE_M_KV_ID_SALES: 6010001, //ポイント付与区分 営業
        POINT_GRANT_TYPE_M_KV_ID_PROD: 6010002, //ポイント付与区分 制作
        POINT_GRANT_TYPE_M_KV_ID_CONTRUCT: 6010003, //ポイント付与区分 施工
        POINT_GRANT_TYPE_M_KV_ID_CREATE: 6010004, //ポイント付与区分 登録
        POINT_GRANT_TYPE_M_KV_ID_BONUS: 6010009, //ポイント付与区分 ボーナス
    },
};
