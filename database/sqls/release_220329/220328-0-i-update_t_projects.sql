/* 物件商品が完了されてる場合は物件の売上完了日を更新 */
UPDATE t_projects p
   SET p.sales_completed_at
     = (/* 3.物件商品[売上完了日]が全て設定されているか確認 */
        SELECT CASE WHEN COUNT(CASE WHEN pd.sales_completed_at IS NULL THEN 1 END) = 0
                    /* 物件商品[売上完了日]全て設定されていれば物件[売上完了日]と比較して大きい方の完了日を設定 */
                    THEN MAX(CASE WHEN pd.sales_completed_at >= IFNULL(p.sales_completed_at, pd.sales_completed_at) 
                                  THEN pd.sales_completed_at 
                                  ELSE p.sales_completed_at
                                  END)
                    /* 物件商品[売上完了日]1件でもNullの場合は物件[売上完了日]をセット */
                    ELSE p.sales_completed_at
                    END AS sales_completed_at
          FROM t_project_products pd
         /* 2.物件idをキーにして[削除されてない]物件商品を条件に含める */
         WHERE pd.t_project_id = p.id
           AND pd.deleted_at IS NULL)
 /* 1.売上idを条件にして物件idを取得 */
 WHERE p.deleted_at IS NULL
;
