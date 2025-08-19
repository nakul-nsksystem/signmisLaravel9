ALTER TABLE `t_project_construction_result_users` 
ADD COLUMN `deleted_at` DATETIME NULL DEFAULT NULL AFTER `updated_at`;
