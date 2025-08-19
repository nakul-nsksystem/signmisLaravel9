ALTER TABLE `t_production_day_groups` 
CHANGE COLUMN `target` `target` VARCHAR(128) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NULL DEFAULT NULL COMMENT '�O���[�s���O�̑Ώ�' ,
CHANGE COLUMN `key` `key` VARCHAR(128) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NULL DEFAULT NULL COMMENT '�O���[�v�L�[' ,
CHANGE COLUMN `title` `title` VARCHAR(128) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_520_ci' NULL DEFAULT NULL COMMENT '�^�C�g��' ;

ALTER TABLE `t_production_day_groups` 
ADD UNIQUE INDEX `idx_t_production_day_group_unique` (`t_production_day_id` ASC, `parent_t_production_day_group_id` ASC, `level` ASC, `target` ASC, `key` ASC, `group_no` ASC, `deleted_at` ASC) ;

