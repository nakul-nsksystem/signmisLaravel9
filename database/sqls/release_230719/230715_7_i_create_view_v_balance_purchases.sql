-- ビュー：買掛残高一覧表
CREATE OR REPLACE VIEW v_balance_purchases AS

WITH 
/* 期間仕入 */
q_purchases AS (
    SELECT s.m_branch_id              AS m_branch_id   , /* 拠点id   */
           s.supplier_m_customer_id   AS m_customer_id , /* 仕入先id */
           SUM(s.total_price        ) AS total_price   , /* 仕入     */
           SUM(                s.tax) AS tax           , /* 消費税   */
           SUM(s.total_price + s.tax) AS sub_total       /* 仕入合計 */
      FROM t_p_invoices AS s
     WHERE s.deleted_at           IS NULL                                      /* 論理削除         */
       AND s.t_complete_id        >= 0                                         /* 残高用請求は除外 */
       AND s.accounting_date BETWEEN :complete_day_from1 AND :complete_day_to1 /* 仕入日           */
     GROUP BY s.m_branch_id, s.supplier_m_customer_id
) ,

/* 期間支払 */
q_payments AS (
    SELECT p.m_branch_id                                                                  AS m_branch_id        , /* 拠点id       */
           p.m_customer_id                                                                AS m_customer_id      , /* 仕入先id     */
           MAX(p.payment_day  )                                                           AS payment_day        , /* 支払日       */
           SUM(p.payment_price)                                                           AS payment_price      , /* 支払         */
           /* 支払区分を振り分け */
           SUM(CASE WHEN p.payment_m_kv_id  = 1150002           THEN p.payment_price END) AS payment_cash       , /* 現金         */
           SUM(CASE WHEN p.payment_m_kv_id  = 1150001           THEN p.payment_price END) AS payment_transfer   , /* 振込         */
           SUM(CASE WHEN p.payment_m_kv_id  = 1150008           THEN p.payment_price END) AS payment_commission , /* 手数料       */
           SUM(CASE WHEN p.payment_m_kv_id  = 1150005           THEN p.payment_price END) AS payment_check      , /* 小切手       */
           SUM(CASE WHEN p.payment_m_kv_id IN(1150003, 1150004) THEN p.payment_price END) AS payment_bill       , /* 手形         */
           SUM(CASE WHEN p.payment_m_kv_id  = 1150007           THEN p.payment_price END) AS payment_offset     , /* 相殺         */
           SUM(CASE WHEN p.payment_m_kv_id  = 1150006           THEN p.payment_price END) AS payment_etc          /* 値引・その他 */
      FROM t_complete_details AS p
     WHERE p.deleted_at           IS NULL                                      /* 論理削除 */
       AND p.dealing_m_kv_id       = 1010002                                   /* 買       */
       AND p.payment_day     BETWEEN :complete_day_from2 AND :complete_day_to2 /* 支払日   */
     GROUP BY p.m_branch_id, p.m_customer_id
) ,

/* 直前請求 */
q_before_complets AS(
    SELECT c.m_branch_id   AS m_branch_id   ,       /* 拠点id       */
           c.m_customer_id AS m_customer_id ,       /* 仕入先id     */
           MAX(c.id)       AS id                    /* 最終請求id   */
      FROM t_completes AS c
     WHERE c.dealing_m_kv_id  = 1010002             /* 買           */
       AND c.id               > 0                   /* 通常請求のみ */
       AND c.complete_day     < :complete_day_from3 /* 開始日より前 */
     GROUP BY c.m_branch_id, c.m_customer_id
) ,

/* 直後請求 */
q_after_complets AS(
    SELECT c.m_branch_id   AS m_branch_id   ,       /* 拠点id       */
           c.m_customer_id AS m_customer_id ,       /* 仕入先id     */
           MIN(c.id)       AS id                    /* 直近請求id   */
      FROM t_completes AS c
     WHERE c.dealing_m_kv_id  = 1010002             /* 買           */
       AND c.id              >  0                   /* 通常請求のみ */
       AND c.complete_day    >= :complete_day_from4 /* 開始日以降   */
     GROUP BY c.m_branch_id, c.m_customer_id
) ,

/* 残高 */
q_balances AS (
    SELECT m_branch_id   AS m_branch_id   , /* 拠点id   */
           m_customer_id AS m_customer_id , /* 仕入先id */
           SUM(balance)  AS balance         /* 残高     */
      FROM (/* 直前請求の請求額 */
            SELECT c.m_branch_id   AS m_branch_id   , /* 拠点id   */
                   c.m_customer_id AS m_customer_id , /* 仕入先id */
                   c.grand_total   AS balance         /* 請求額   */
              FROM t_completes            AS c /* 請求     */
             INNER JOIN q_before_complets AS b /* 直前請求 */ ON c.id = b.id

            /* 開始日より前の支払(締済分) */
             UNION ALL
            SELECT p.m_branch_id             AS m_branch_id   , /* 拠点id   */
                   p.m_customer_id           AS m_customer_id , /* 仕入先id */
                   SUM(p.payment_price) * -1 AS balance         /* 支払     */
              FROM t_complete_details    AS p /* 支払     */
             INNER JOIN q_after_complets AS a /* 直後請求 */ ON p.t_complete_id = a.id
             WHERE p.deleted_at      IS NULL                /* 論理削除 */
               AND p.dealing_m_kv_id  = 1010002             /* 買       */
               AND p.payment_day      < :complete_day_from5 /* 支払日   */
             GROUP BY p.m_branch_id, p.m_customer_id

            /* 開始日より前の支払(未締分) */
             UNION ALL
            SELECT p.m_branch_id             AS m_branch_id   , /* 拠点id   */
                   p.m_customer_id           AS m_customer_id , /* 仕入先id */
                   SUM(p.payment_price) * -1 AS balance         /* 支払     */
              FROM t_complete_details AS p /* 支払 */
             WHERE p.deleted_at      IS NULL                /* 論理削除 */
               AND p.dealing_m_kv_id  = 1010002             /* 買       */
               AND p.t_complete_id    = 0                   /* 未締     */
               AND p.payment_day      < :complete_day_from6 /* 支払日   */
             GROUP BY p.m_branch_id, p.m_customer_id

            /* 開始日より前の仕入(締済分) */
             UNION ALL
            SELECT s.m_branch_id                                                   AS m_branch_id   , /* 拠点id   */
                   s.supplier_m_customer_id                                        AS m_customer_id , /* 仕入先id */
                   ROUNDING(SUM(s.total_price + s.tax), cu.price_fraction_m_kv_id) AS balance         /* 仕入合計 */
              FROM t_p_invoices          AS s  /* 仕入     */
             INNER JOIN q_after_complets AS a  /* 直後請求 */ ON s.t_complete_id          = a.id
             INNER JOIN m_customers      AS cu /* 仕入先   */ ON s.supplier_m_customer_id = cu.id
             WHERE s.deleted_at      IS NULL                /* 論理削除 */
               AND s.accounting_date  < :complete_day_from7 /* 仕入日   */
             GROUP BY s.m_branch_id, s.supplier_m_customer_id

            /* 開始日より前の仕入(未締分) */
             UNION ALL
            SELECT s.m_branch_id                                                   AS m_branch_id   , /* 拠点id   */
                   s.supplier_m_customer_id                                        AS m_customer_id , /* 仕入先id */
                   ROUNDING(SUM(s.total_price + s.tax), cu.price_fraction_m_kv_id) AS balance         /* 仕入合計 */
              FROM t_p_invoices     AS s  /* 仕入   */
             INNER JOIN m_customers AS cu /* 仕入先 */ ON s.supplier_m_customer_id = cu.id
             WHERE s.deleted_at      IS NULL                /* 論理削除 */
               AND s.t_complete_id    = 0                   /* 未締     */
               AND s.accounting_date  < :complete_day_from8 /* 仕入日   */
             GROUP BY s.m_branch_id, s.supplier_m_customer_id
           ) /* MySQL[1248: every derived table must have its own alias] 対応 */
             AS sub_query
     GROUP BY m_branch_id, m_customer_id
) ,

q_body AS (/* 本体 */
    SELECT m_branch_id                                           AS m_branch_id        , /* 拠点id       */
           m_customer_id                                         AS m_customer_id      , /* 仕入先id     */
           MAX(payment_day)                                      AS payment_day        , /* 支払日       */
           SUM(balance                                         ) AS before_balance     , /* 前回残高     */
           SUM(          payment_price                         ) AS payment_price      , /* 支払合計     */
           SUM(          payment_cash                          ) AS payment_cash       , /* 現金         */
           SUM(          payment_transfer                      ) AS payment_transfer   , /* 振込         */
           SUM(          payment_commission                    ) AS payment_commission , /* 手数料       */
           SUM(          payment_check                         ) AS payment_check      , /* 小切手       */
           SUM(          payment_bill                          ) AS payment_bill       , /* 手形         */
           SUM(          payment_offset                        ) AS payment_offset     , /* 相殺         */
           SUM(          payment_etc                           ) AS payment_etc        , /* 値引・その他 */
           SUM(                               total_price      ) AS total_price        , /* 仕入         */
           SUM(                                             tax) AS tax                , /* 消費税       */
           SUM(                               total_price + tax) AS sub_total          , /* 仕入合計     */
           SUM(balance - payment_price      + total_price + tax) AS balance              /* 残高         */
      FROM (/* 残高 */
            SELECT m_branch_id   AS m_branch_id        , /* 拠点id       */
                   m_customer_id AS m_customer_id      , /* 仕入先id     */
                   balance       AS balance            , /* 残高         */
                   0             AS total_price        , /* 仕入         */
                   0             AS tax                , /* 消費税       */
                   NULL          AS payment_day        , /* 支払日       */
                   0             AS payment_price      , /* 支払合計     */
                   NULL          AS payment_cash       , /* 現金         */
                   NULL          AS payment_transfer   , /* 振込         */
                   NULL          AS payment_commission , /* 手数料       */
                   NULL          AS payment_check      , /* 小切手       */
                   NULL          AS payment_bill       , /* 手形         */
                   NULL          AS payment_offset     , /* 相殺         */
                   NULL          AS payment_etc          /* 値引・その他 */
              FROM q_balances
             WHERE balance <> 0 /* 開始時点で残高が0以外を抽出 */

            /* 仕入 */
             UNION ALL
            SELECT m_branch_id   AS m_branch_id        , /* 拠点id       */
                   m_customer_id AS m_customer_id      , /* 仕入先id     */
                   0             AS balance            , /* 残高         */
                   total_price   AS total_price        , /* 仕入         */
                   tax           AS tax                , /* 消費税       */
                   NULL          AS payment_day        , /* 支払日       */
                   0             AS payment_price      , /* 支払合計     */
                   NULL          AS payment_cash       , /* 現金         */
                   NULL          AS payment_transfer   , /* 振込         */
                   NULL          AS payment_commission , /* 手数料       */
                   NULL          AS payment_check      , /* 小切手       */
                   NULL          AS payment_bill       , /* 手形         */
                   NULL          AS payment_offset     , /* 相殺         */
                   NULL          AS payment_etc          /* 値引・その他 */
              FROM q_purchases

            /* 支払 */
             UNION ALL
            SELECT m_branch_id        AS m_branch_id        , /* 拠点id       */
                   m_customer_id      AS m_customer_id      , /* 仕入先id     */
                   0                  AS balance            , /* 残高         */
                   0                  AS total_price        , /* 仕入         */
                   0                  AS tax                , /* 消費税       */
                   payment_day        AS payment_day        , /* 支払日       */
                   payment_price      AS payment_price      , /* 支払合計     */
                   payment_cash       AS payment_cash       , /* 現金         */
                   payment_transfer   AS payment_transfer   , /* 振込         */
                   payment_commission AS payment_commission , /* 手数料       */
                   payment_check      AS payment_check      , /* 小切手       */
                   payment_bill       AS payment_bill       , /* 手形         */
                   payment_offset     AS payment_offset     , /* 相殺         */
                   payment_etc        AS payment_etc          /* 値引・その他 */
              FROM q_payments
           ) /* MySQL[1248: every derived table must have its own alias] 対応 */
             AS sub_query
     GROUP BY m_branch_id, m_customer_id
)

/* 表示用 */
SELECT IFNULL(br.short_name, br.name)         AS m_branch_name      , /* 拠点名       */
       IFNULL(cu.short_name, cu.name)         AS m_customer_name    , /* 仕入先名     */
       CAST(q.before_balance     AS SIGNED)   AS before_balance     , /* 前回残高     */
       CAST(q.total_price        AS SIGNED)   AS total_price        , /* 仕入         */
       CAST(q.tax                AS SIGNED)   AS tax                , /* 消費税       */
       DATE_FORMAT(q.payment_day, '%Y-%m-%d') AS payment_day        , /* 支払日       */
       CAST(q.payment_cash       AS SIGNED)   AS payment_cash       , /* 現金         */
       CAST(q.payment_transfer   AS SIGNED)   AS payment_transfer   , /* 振込         */
       CAST(q.payment_commission AS SIGNED)   AS payment_commission , /* 手数料       */
       CAST(q.payment_check      AS SIGNED)   AS payment_check      , /* 小切手       */
       CAST(q.payment_bill       AS SIGNED)   AS payment_bill       , /* 手形         */
       CAST(q.payment_offset     AS SIGNED)   AS payment_offset     , /* 相殺         */
       CAST(q.payment_etc        AS SIGNED)   AS payment_etc        , /* 値引・その他 */
       CAST(q.payment_price      AS SIGNED)   AS payment_price      , /* 支払合計     */
       CAST(q.balance            AS SIGNED)   AS balance              /* 残高         */

  FROM q_body           AS q  /* 本体   */
 INNER JOIN m_branches  AS br /* 拠点   */ ON q.m_branch_id   = br.id
 INNER JOIN m_customers AS cu /* 仕入先 */ ON q.m_customer_id = cu.id

 /* 条件未指定時は無条件で取得 */
 WHERE br.id           = IFNULL(:m_branch_id            , br.id          ) /* 拠点id   */
   AND cu.id           = IFNULL(:m_customer_id          , cu.id          ) /* 取引先id */
   AND cu.closing_date = IFNULL(:m_customer_closing_date, br.closing_date) /* 締日     */

 ORDER BY br.cd, cu.cd
