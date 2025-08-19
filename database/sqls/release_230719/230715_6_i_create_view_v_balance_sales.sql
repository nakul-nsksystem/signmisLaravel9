-- ビュー：売掛残高一覧表
CREATE OR REPLACE VIEW v_balance_sales AS

WITH 
/* 期間売上 */
q_sales AS (
    SELECT s.m_branch_id              AS m_branch_id   , /* 拠点id   */
           s.m_customer_id            AS m_customer_id , /* 取引先id */
           SUM(s.total_price        ) AS total_price   , /* 売上     */
           SUM(                s.tax) AS tax           , /* 消費税   */
           SUM(s.total_price + s.tax) AS sub_total       /* 売上合計 */
      FROM t_sales AS s
     WHERE s.deleted_at           IS NULL                                      /* 論理削除         */
       AND s.t_complete_id        >= 0                                         /* 残高用請求は除外 */
       AND s.accounting_date BETWEEN :complete_day_from1 AND :complete_day_to1 /* 売上日           */
     GROUP BY s.m_branch_id, s.m_customer_id
) ,

/* 期間入金 */
q_payments AS (
    SELECT p.m_branch_id              AS m_branch_id   , /* 拠点id   */
           p.m_customer_id            AS m_customer_id , /* 取引先id */
           SUM(p.payment_price)       AS payment_price   /* 入金     */
      FROM t_complete_details AS p
     WHERE p.deleted_at           IS NULL                                      /* 論理削除 */
       AND p.dealing_m_kv_id       = 1010001                                   /* 売       */
       AND p.payment_day     BETWEEN :complete_day_from2 AND :complete_day_to2 /* 入金日   */
     GROUP BY p.m_branch_id, p.m_customer_id
) ,

/* 直前請求 */
q_before_complets AS(
    SELECT c.m_branch_id   AS m_branch_id   ,       /* 拠点id       */
           c.m_customer_id AS m_customer_id ,       /* 取引先id     */
           MAX(c.id)       AS id                    /* 最終請求id   */
      FROM t_completes AS c
     WHERE c.dealing_m_kv_id  = 1010001             /* 売           */
       AND c.id               > 0                   /* 通常請求のみ */
       AND c.complete_day     < :complete_day_from3 /* 開始日より前 */
     GROUP BY c.m_branch_id, c.m_customer_id
) ,

/* 直後請求 */
q_after_complets AS(
    SELECT c.m_branch_id   AS m_branch_id   ,       /* 拠点id       */
           c.m_customer_id AS m_customer_id ,       /* 取引先id     */
           MIN(c.id)       AS id                    /* 直近請求id   */
      FROM t_completes AS c
     WHERE c.dealing_m_kv_id  = 1010001             /* 売           */
       AND c.id              >  0                   /* 通常請求のみ */
       AND c.complete_day    >= :complete_day_from4 /* 開始日以降   */
     GROUP BY c.m_branch_id, c.m_customer_id
) ,

/* 残高 */
q_balances AS (
    SELECT m_branch_id   AS m_branch_id   , /* 拠点id   */
           m_customer_id AS m_customer_id , /* 取引先id */
           SUM(balance)  AS balance         /* 残高     */
      FROM (/* 直前請求の請求額 */
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
             WHERE p.deleted_at      IS NULL                /* 論理削除 */
               AND p.dealing_m_kv_id  = 1010001             /* 売       */
               AND p.payment_day      < :complete_day_from5 /* 入金日   */
             GROUP BY p.m_branch_id, p.m_customer_id

            /* 開始日より前の入金(未締分) */
            UNION ALL
            SELECT p.m_branch_id             AS m_branch_id   , /* 拠点id   */
                   p.m_customer_id           AS m_customer_id , /* 取引先id */
                   SUM(p.payment_price) * -1 AS balance         /* 入金     */
              FROM t_complete_details AS p /* 入金 */
             WHERE p.deleted_at      IS NULL                /* 論理削除 */
               AND p.dealing_m_kv_id  = 1010001             /* 売       */
               AND p.t_complete_id    = 0                   /* 未締     */
               AND p.payment_day      < :complete_day_from6 /* 入金日   */
             GROUP BY p.m_branch_id, p.m_customer_id

            /* 開始日より前の売上(締済分) */
            UNION ALL
            SELECT s.m_branch_id                                                   AS m_branch_id   , /* 拠点id   */
                   s.m_customer_id                                                 AS m_customer_id , /* 取引先id */
                   ROUNDING(SUM(s.total_price + s.tax), cu.price_fraction_m_kv_id) AS balance         /* 売上合計 */
              FROM t_sales               AS s  /* 売上     */
             INNER JOIN q_after_complets AS a  /* 直後請求 */ ON s.t_complete_id = a.id
             INNER JOIN m_customers      AS cu /* 取引先   */ ON s.m_customer_id = cu.id
             WHERE s.deleted_at      IS NULL                /* 論理削除 */
               AND s.accounting_date  < :complete_day_from7 /* 売上日   */
             GROUP BY s.m_branch_id, s.m_customer_id

            /* 開始日より前の売上(未締分) */
            UNION ALL
            SELECT s.m_branch_id                                                   AS m_branch_id   , /* 拠点id   */
                   s.m_customer_id                                                 AS m_customer_id , /* 取引先id */
                   ROUNDING(SUM(s.total_price + s.tax), cu.price_fraction_m_kv_id) AS balance         /* 売上合計 */
              FROM t_sales          AS s  /* 売上   */
             INNER JOIN m_customers AS cu /* 取引先 */ ON s.m_customer_id = cu.id
             WHERE s.deleted_at      IS NULL                /* 論理削除 */
               AND s.t_complete_id    = 0                   /* 未締     */
               AND s.accounting_date  < :complete_day_from8 /* 売上日   */
             GROUP BY s.m_branch_id, s.m_customer_id
        )
     AS sub_query /* MySQL[1248: every derived table must have its own alias] 対応 */
  GROUP BY m_branch_id, m_customer_id
) ,

q_body AS (/* 本体 */
    SELECT m_branch_id                                      AS m_branch_id    , /* 拠点id   */
           m_customer_id                                    AS m_customer_id  , /* 取引先id */
           SUM(balance                                    ) AS before_balance , /* 前回残高 */
           SUM(          payment_price                    ) AS payment_price  , /* 入金     */
           SUM(                          total_price      ) AS total_price    , /* 売上     */
           SUM(                                        tax) AS tax            , /* 消費税   */
           SUM(                          total_price + tax) AS sub_total      , /* 売上合計 */
           SUM(balance - payment_price + total_price + tax) AS balance          /* 残高     */
      FROM (/* 残高 */
            SELECT m_branch_id   AS m_branch_id   , /* 拠点id   */
                   m_customer_id AS m_customer_id , /* 取引先id */
                   balance       AS balance       , /* 残高     */
                   0             AS total_price   , /* 売上     */
                   0             AS tax           , /* 消費税   */
                   0             AS payment_price   /* 入金     */
              FROM q_balances
             WHERE balance <> 0 /* 開始時点で残高が0以外を抽出 */

            /* 売上 */
            UNION ALL
            SELECT m_branch_id   AS m_branch_id   , /* 拠点id   */
                   m_customer_id AS m_customer_id , /* 取引先id */
                   0             AS balance       , /* 残高     */
                   total_price   AS total_price   , /* 売上     */
                   tax           AS tax           , /* 消費税   */
                   0             AS payment_price   /* 入金     */
              FROM q_sales

            /* 入金 */
            UNION ALL
            SELECT m_branch_id   AS m_branch_id   , /* 拠点id   */
                   m_customer_id AS m_customer_id , /* 取引先id */
                   0             AS balance       , /* 残高     */
                   0             AS total_price   , /* 売上     */
                   0             AS tax           , /* 消費税   */
                   payment_price AS payment_price   /* 入金     */
              FROM q_payments
        )
     AS sub_query /* MySQL[1248: every derived table must have its own alias] 対応 */
  GROUP BY m_branch_id, m_customer_id
)

/* 表示用 */
SELECT IFNULL(cu.short_name, cu.name)   AS m_customer_name , /* 取引先名 */
       us.full_name                     AS m_user_name     , /* 担当者名 */
       CAST(q.before_balance AS SIGNED) AS before_balance  , /* 前回残高 */
       CAST(q.payment_price  AS SIGNED) AS payment_price   , /* 入金     */
       CAST(q.total_price    AS SIGNED) AS total_price     , /* 売上     */
       CAST(q.tax            AS SIGNED) AS tax             , /* 消費税   */
       CAST(q.sub_total      AS SIGNED) AS sub_total       , /* 売上合計 */
       CAST(q.balance        AS SIGNED) AS balance           /* 残高     */

  FROM q_body           AS q  /* 本体   */
 INNER JOIN m_branches  AS br /* 拠点   */ ON q.m_branch_id      = br.id
 INNER JOIN m_customers AS cu /* 取引先 */ ON q.m_customer_id    = cu.id
 INNER JOIN m_users     AS us /* 担当者 */ ON cu.sales_m_user_id = us.id

 /* 条件未指定時は無条件で取得 */
 WHERE br.id           = IFNULL(:m_branch_id            , br.id          ) /* 拠点id   */
   AND cu.id           = IFNULL(:m_customer_id          , cu.id          ) /* 取引先id */
   AND cu.closing_date = IFNULL(:m_customer_closing_date, br.closing_date) /* 締日     */

 ORDER BY br.cd, cu.cd
