ALTER TABLE `t_projects` 
ADD COLUMN `ordered_t_project_id` INT NULL DEFAULT NULL COMMENT 'オーダー時のt_project_id ( オーダー時にコピー ) ' AFTER `m_branch_id`,
ADD COLUMN `type_flg` INT NOT NULL DEFAULT 0 COMMENT '物件データの位置づけ 1:オーダー時データ' AFTER `ordered_t_project_id`;
