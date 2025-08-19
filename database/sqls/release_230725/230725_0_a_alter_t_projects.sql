ALTER TABLE `t_projects` 
DROP COLUMN `is_est_approved`,
ADD COLUMN `est_approved_at` DATETIME NULL DEFAULT NULL AFTER `estimate_memo`,
ADD COLUMN `est_approved_m_user_id` INT NULL DEFAULT NULL AFTER `est_approved_at`,
ADD INDEX `fk_t_projects_est_approved_m_user_id_idx` (`est_approved_m_user_id` ASC) VISIBLE;

ALTER TABLE `t_projects` 
ADD CONSTRAINT `fk_t_projects_est_approved_m_user_id`
  FOREIGN KEY (`est_approved_m_user_id`)
  REFERENCES `m_users` (`id`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;
