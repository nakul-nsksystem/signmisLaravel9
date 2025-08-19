ALTER TABLE t_projects
ADD INDEX id_t_projects_ordered_at (ordered_at ASC) VISIBLE,
ADD INDEX id_t_projects_sales_completed_ad (sales_completed_at ASC) VISIBLE;

