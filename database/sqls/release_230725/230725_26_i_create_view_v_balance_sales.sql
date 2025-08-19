            -- ビュー：売掛残高一覧表
            -- LaravelのController側でSQLを記述するのでMySQLのViewは使いませんがSQLの確認用として残しときます
            -- CREATE OR REPLACE VIEW v_balance_sales AS

        $details = DB::select(<<<__SQL_EOT__
            WITH
            /* 期間売上 */
            q_sales AS (
                SELECT h.m_branch_id              AS m_branch_id   , /* 拠点id   */
                       h.m_customer_id            AS m_customer_id , /* 取引先id */
                       SUM(h.total_price        ) AS total_price   , /* 売上     */
                       SUM(                h.tax) AS tax           , /* 消費税   */
                       SUM(h.total_price + h.tax) AS sub_total       /* 売上合計 */
                  FROM t_sales AS h
                 WHERE h.deleted_at           IS NULL                                    /* 論理削除         */
                   AND h.t_complete_id        >= 0                                       /* 残高用請求は除外 */
                   AND h.accounting_date BETWEEN :trading_day_from1 AND :trading_day_to1 /* 売上日           */
                 GROUP BY h.m_branch_id, h.m_customer_id
            ) ,

            /* 期間入金 */
            q_payments AS (
                SELECT p.m_branch_id                                                                  AS m_branch_id        , /* 拠点id       */
                       p.m_customer_id                                                                AS m_customer_id      , /* 取引先id     */
                       MAX(p.payment_day  )                                                           AS payment_day        , /* 入金日       */
                       SUM(p.payment_price)                                                           AS payment_price      , /* 入金         */
                       /* 入金区分を振り分け */
                       SUM(CASE WHEN p.payment_m_kv_id  = 1150002           THEN p.payment_price END) AS payment_cash       , /* 現金         */
                       SUM(CASE WHEN p.payment_m_kv_id  = 1150001           THEN p.payment_price END) AS payment_transfer   , /* 振込         */
                       SUM(CASE WHEN p.payment_m_kv_id  = 1150008           THEN p.payment_price END) AS payment_commission , /* 手数料       */
                       SUM(CASE WHEN p.payment_m_kv_id  = 1150005           THEN p.payment_price END) AS payment_check      , /* 小切手       */
                       SUM(CASE WHEN p.payment_m_kv_id IN(1150003, 1150004) THEN p.payment_price END) AS payment_bill       , /* 手形         */
                       SUM(CASE WHEN p.payment_m_kv_id  = 1150007           THEN p.payment_price END) AS payment_offset     , /* 相殺         */
                       SUM(CASE WHEN p.payment_m_kv_id  = 1150006           THEN p.payment_price END) AS payment_etc          /* 値引・その他 */
                  FROM t_complete_details AS p
                 WHERE p.deleted_at           IS NULL                                    /* 論理削除 */
                   AND p.dealing_m_kv_id       = 1010001                                 /* 売       */
                   AND p.payment_day     BETWEEN :trading_day_from2 AND :trading_day_to2 /* 入金日   */
                 GROUP BY p.m_branch_id, p.m_customer_id
            ) ,

            /* 初回残高 */
            q_first_balances AS(
                /* 指定期間中の初回残高データを抽出 */
                SELECT c.m_branch_id   AS m_branch_id   , /* 拠点id   */
                       c.m_customer_id AS m_customer_id , /* 取引先id */
                       c.grand_total   AS grand_total     /* 請求額   */
                  FROM t_completes AS c /* 請求 */
                 WHERE c.dealing_m_kv_id       = 1010001                                 /* 売           */
                   AND c.id                    > 0                                       /* 通常請求のみ */
                   AND c.complete_day    BETWEEN :trading_day_from3 AND :trading_day_to3 /* 請求日       */
                   AND c.memo                  = '残高'                                  /* 初回残高     */
            ) ,

            /* 直前請求 */
            q_before_complets AS(
                SELECT c.m_branch_id   AS m_branch_id   ,      /* 拠点id       */
                       c.m_customer_id AS m_customer_id ,      /* 取引先id     */
                       MAX(c.id)       AS id                   /* 最終請求id   */
                  FROM t_completes AS c
                 WHERE c.dealing_m_kv_id  = 1010001            /* 売           */
                   AND c.id               > 0                  /* 通常請求のみ */
                   AND c.complete_day     < :trading_day_from4 /* 開始日より前 */
                 GROUP BY c.m_branch_id, c.m_customer_id
            ) ,

            /* 直後請求 */
            q_after_complets AS(
                SELECT c.m_branch_id   AS m_branch_id   ,      /* 拠点id       */
                       c.m_customer_id AS m_customer_id ,      /* 取引先id     */
                       MIN(c.id)       AS id                   /* 直近請求id   */
                  FROM t_completes AS c
                 WHERE c.dealing_m_kv_id  = 1010001            /* 売           */
                   AND c.id              >  0                  /* 通常請求のみ */
                   AND c.complete_day    >= :trading_day_from5 /* 開始日以降   */
                 GROUP BY c.m_branch_id, c.m_customer_id
            ) ,

            /* 残高 */
            q_balances AS (
                SELECT m_branch_id   AS m_branch_id   , /* 拠点id   */
                       m_customer_id AS m_customer_id , /* 取引先id */
                       SUM(balance)  AS balance         /* 残高     */
                  FROM (/* 初回残高 */
                        SELECT c.m_branch_id   AS m_branch_id   , /* 拠点id   */
                               c.m_customer_id AS m_customer_id , /* 取引先id */
                               c.grand_total   AS balance         /* 請求額   */
                          FROM q_first_balances AS c /* 初回残高 */

                        /* 直前請求の請求額 */
                         UNION ALL
                        SELECT c.m_branch_id   AS m_branch_id   , /* 拠点id   */
                               c.m_customer_id AS m_customer_id , /* 取引先id */
                               c.grand_total   AS balance         /* 請求額   */
                          FROM t_completes            AS c /* 請求     */
                         INNER JOIN q_before_complets AS b /* 直前請求 */ ON c.id = b.id

                        /* 開始日より前の入金(締済分) */
                         UNION ALL
                        SELECT p.m_branch_id             AS m_branch_id   , /* 拠点id   */
                               p.m_customer_id           AS m_customer_id , /* 取引先id */
                               SUM(p.payment_price) * -1 AS balance         /* 入金     */
                          FROM t_complete_details    AS p /* 入金     */
                         INNER JOIN q_after_complets AS a /* 直後請求 */ ON p.t_complete_id = a.id
                         WHERE p.deleted_at      IS NULL               /* 論理削除 */
                           AND p.dealing_m_kv_id  = 1010001            /* 売       */
                           AND p.payment_day      < :trading_day_from6 /* 入金日   */
                         GROUP BY p.m_branch_id, p.m_customer_id

                        /* 開始日より前の入金(未締分) */
                         UNION ALL
                        SELECT p.m_branch_id             AS m_branch_id   , /* 拠点id   */
                               p.m_customer_id           AS m_customer_id , /* 取引先id */
                               SUM(p.payment_price) * -1 AS balance         /* 入金     */
                          FROM t_complete_details AS p /* 入金 */
                         WHERE p.deleted_at      IS NULL               /* 論理削除 */
                           AND p.dealing_m_kv_id  = 1010001            /* 売       */
                           AND p.t_complete_id    = 0                  /* 未締     */
                           AND p.payment_day      < :trading_day_from7 /* 入金日   */
                         GROUP BY p.m_branch_id, p.m_customer_id

                        /* 開始日より前の売上(締済分) */
                         UNION ALL
                        SELECT h.m_branch_id                                                   AS m_branch_id   , /* 拠点id   */
                               h.m_customer_id                                                 AS m_customer_id , /* 取引先id */
                               ROUNDING(SUM(h.total_price + h.tax), cu.price_fraction_m_kv_id) AS balance         /* 売上合計 */
                          FROM t_sales               AS h  /* 売上     */
                         INNER JOIN q_after_complets AS a  /* 直後請求 */ ON h.t_complete_id = a.id
                         INNER JOIN m_customers      AS cu /* 取引先   */ ON h.m_customer_id = cu.id
                         WHERE h.deleted_at      IS NULL               /* 論理削除 */
                           AND h.accounting_date  < :trading_day_from8 /* 売上日   */
                         GROUP BY h.m_branch_id, h.m_customer_id

                        /* 開始日より前の売上(未締分) */
                         UNION ALL
                        SELECT h.m_branch_id                                                   AS m_branch_id   , /* 拠点id   */
                               h.m_customer_id                                                 AS m_customer_id , /* 取引先id */
                               ROUNDING(SUM(h.total_price + h.tax), cu.price_fraction_m_kv_id) AS balance         /* 売上合計 */
                          FROM t_sales          AS h  /* 売上   */
                         INNER JOIN m_customers AS cu /* 取引先 */ ON h.m_customer_id = cu.id
                         WHERE h.deleted_at      IS NULL               /* 論理削除 */
                           AND h.t_complete_id    = 0                  /* 未締     */
                           AND h.accounting_date  < :trading_day_from9 /* 売上日   */
                         GROUP BY h.m_branch_id, h.m_customer_id
                       ) /* MySQL[1248: every derived table must have its own alias] 対応 */
                         AS sub_query 
                 GROUP BY m_branch_id, m_customer_id
            ) ,

            /* 本体 */
            q_body AS (
                SELECT m_branch_id                                           AS m_branch_id        , /* 拠点id       */
                       m_customer_id                                         AS m_customer_id      , /* 取引先id     */
                       MAX(payment_day)                                      AS payment_day        , /* 入金日       */
                       SUM(balance                                         ) AS before_balance     , /* 前回残高     */
                       SUM(          payment_cash                          ) AS payment_cash       , /* 現金         */
                       SUM(          payment_transfer                      ) AS payment_transfer   , /* 振込         */
                       SUM(          payment_commission                    ) AS payment_commission , /* 手数料       */
                       SUM(          payment_check                         ) AS payment_check      , /* 小切手       */
                       SUM(          payment_bill                          ) AS payment_bill       , /* 手形         */
                       SUM(          payment_offset                        ) AS payment_offset     , /* 相殺         */
                       SUM(          payment_etc                           ) AS payment_etc        , /* 値引・その他 */
                       SUM(          payment_price                         ) AS payment_price      , /* 入金合計     */
                       SUM(                               total_price      ) AS total_price        , /* 売上         */
                       SUM(                                             tax) AS tax                , /* 消費税       */
                       SUM(                               total_price + tax) AS sub_total          , /* 売上合計     */
                       SUM(balance - payment_price      + total_price + tax) AS balance              /* 残高         */
                  FROM (/* 残高 */
                        SELECT m_branch_id   AS m_branch_id        , /* 拠点id       */
                               m_customer_id AS m_customer_id      , /* 取引先id     */
                               balance       AS balance            , /* 残高         */
                               NULL          AS payment_day        , /* 入金日       */
                               0             AS payment_price      , /* 入金合計     */
                               NULL          AS payment_cash       , /* 現金         */
                               NULL          AS payment_transfer   , /* 振込         */
                               NULL          AS payment_commission , /* 手数料       */
                               NULL          AS payment_check      , /* 小切手       */
                               NULL          AS payment_bill       , /* 手形         */
                               NULL          AS payment_offset     , /* 相殺         */
                               NULL          AS payment_etc        , /* 値引・その他 */
                               0             AS total_price        , /* 売上         */
                               0             AS tax                  /* 消費税       */
                          FROM q_balances
                         WHERE balance <> 0 /* 開始時点で残高が0以外を抽出 */

                        /* 売上 */
                         UNION ALL
                        SELECT m_branch_id   AS m_branch_id        , /* 拠点id       */
                               m_customer_id AS m_customer_id      , /* 取引先id     */
                               0             AS balance            , /* 残高         */
                               NULL          AS payment_day        , /* 入金日       */
                               0             AS payment_price      , /* 入金合計     */
                               NULL          AS payment_cash       , /* 現金         */
                               NULL          AS payment_transfer   , /* 振込         */
                               NULL          AS payment_commission , /* 手数料       */
                               NULL          AS payment_check      , /* 小切手       */
                               NULL          AS payment_bill       , /* 手形         */
                               NULL          AS payment_offset     , /* 相殺         */
                               NULL          AS payment_etc        , /* 値引・その他 */
                               total_price   AS total_price        , /* 売上         */
                               tax           AS tax                  /* 消費税       */
                          FROM q_sales

                        /* 入金 */
                         UNION ALL
                        SELECT m_branch_id        AS m_branch_id        , /* 拠点id       */
                               m_customer_id      AS m_customer_id      , /* 取引先id     */
                               0                  AS balance            , /* 残高         */
                               payment_day        AS payment_day        , /* 入金日       */
                               payment_price      AS payment_price      , /* 入金合計     */
                               payment_cash       AS payment_cash       , /* 現金         */
                               payment_transfer   AS payment_transfer   , /* 振込         */
                               payment_commission AS payment_commission , /* 手数料       */
                               payment_check      AS payment_check      , /* 小切手       */
                               payment_bill       AS payment_bill       , /* 手形         */
                               payment_offset     AS payment_offset     , /* 相殺         */
                               payment_etc        AS payment_etc        , /* 値引・その他 */
                               0                  AS total_price        , /* 売上         */
                               0                  AS tax                  /* 消費税       */
                          FROM q_payments
                       ) /* MySQL[1248: every derived table must have its own alias] 対応 */
                         AS sub_query
                 GROUP BY m_branch_id, m_customer_id
            )

            /* 表示用 */
            SELECT cu.cd                                  AS m_customer_cd      , /* 取引先cd     */
                   IFNULL(cu.short_name, cu.name)         AS m_customer_name    , /* 取引先名     */
                   us.full_name                           AS m_user_name        , /* 担当者名     */
                   CAST(q.before_balance     AS SIGNED)   AS before_balance     , /* 前回残高     */
                   DATE_FORMAT(q.payment_day, '%Y-%m-%d') AS payment_day        , /* 入金日       */
                   CAST(q.payment_transfer   AS SIGNED)   AS payment_transfer   , /* 振込         */
                   CAST(q.payment_commission AS SIGNED)   AS payment_commission , /* 手数料       */
                   CAST(q.payment_cash       AS SIGNED)   AS payment_cash       , /* 現金         */
                   CAST(q.payment_check      AS SIGNED)   AS payment_check      , /* 小切手       */
                   CAST(q.payment_bill       AS SIGNED)   AS payment_bill       , /* 手形         */
                   CAST(q.payment_offset     AS SIGNED)   AS payment_offset     , /* 相殺         */
                   CAST(q.payment_etc        AS SIGNED)   AS payment_etc        , /* 値引・その他 */
                   CAST(q.payment_price      AS SIGNED)   AS payment_price      , /* 入金合計     */
                   CAST(q.total_price        AS SIGNED)   AS total_price        , /* 売上額       */
                   CAST(q.tax                AS SIGNED)   AS tax                , /* 消費税       */
                   CAST(q.sub_total          AS SIGNED)   AS sub_total          , /* 売上合計     */
                   CAST(q.balance            AS SIGNED)   AS balance              /* 残高         */

              FROM q_body           AS q  /* 本体   */
             INNER JOIN m_branches  AS br /* 拠点   */ ON q.m_branch_id      = br.id
             INNER JOIN m_customers AS cu /* 取引先 */ ON q.m_customer_id    = cu.id
             INNER JOIN m_users     AS us /* 担当者 */ ON cu.sales_m_user_id = us.id

             /* 条件未指定時は無条件で取得 */
             WHERE br.id           = IFNULL(:m_branch_id            , br.id          ) /* 拠点id   */
               AND cu.id           = IFNULL(:m_customer_id          , cu.id          ) /* 取引先id */
               AND cu.closing_date = IFNULL(:m_customer_closing_date, cu.closing_date) /* 締日     */

             ORDER BY br.cd, cu.cd
        __SQL_EOT__, $param);
