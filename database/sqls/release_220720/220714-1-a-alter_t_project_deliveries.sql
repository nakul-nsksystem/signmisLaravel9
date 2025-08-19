ALTER TABLE  `t_project_deliveries` 
ADD COLUMN `uid` INT NULL DEFAULT NULL COMMENT '保存前リレーション用id' AFTER `id`;
