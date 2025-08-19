ALTER TABLE `t_projects` 
ADD COLUMN `inc_children_updated_at` DATETIME NOT NULL COMMENT '子テーブル含む 最終更新日' AFTER `memo`,
ADD COLUMN `inc_children_updated_m_user_id` INT NOT NULL COMMENT '子テーブル含む 最終更新者ID' AFTER `inc_children_updated_at`;

ALTER TABLE `t_projects` 
ADD INDEX `fk_t_projects_inc_children_updated_m_user_id_idx` (`inc_children_updated_m_user_id` ASC) ;

ALTER TABLE `t_projects` 
ADD CONSTRAINT `fk_t_projects_inc_children_updated_m_user_id`
  FOREIGN KEY (`inc_children_updated_m_user_id`)
  REFERENCES `m_users` (`id`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;


ALTER TABLE `t_projects` 
DROP FOREIGN KEY `fk_t_projects_inc_children_updated_m_user_id`;
ALTER TABLE `t_projects` 
CHANGE COLUMN `inc_children_updated_at` `inc_children_updated_at` DATETIME NULL COMMENT '子テーブル含む 最終更新日' ,
CHANGE COLUMN `inc_children_updated_m_user_id` `inc_children_updated_m_user_id` INT NULL COMMENT '子テーブル含む 最終更新者ID' ;
ALTER TABLE `t_projects` 
ADD CONSTRAINT `fk_t_projects_inc_children_updated_m_user_id`
  FOREIGN KEY (`inc_children_updated_m_user_id`)
  REFERENCES `m_users` (`id`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;
