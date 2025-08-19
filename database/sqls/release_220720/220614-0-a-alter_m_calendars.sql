ALTER TABLE `m_calendars` 
DROP FOREIGN KEY `fk_m_calendars_m_branch_id`;
ALTER TABLE `m_calendars` 
CHANGE COLUMN `m_branch_id` `m_branch_id` INT NULL COMMENT '拠点id' ;
ALTER TABLE `m_calendars` 
ADD CONSTRAINT `fk_m_calendars_m_branch_id`
  FOREIGN KEY (`m_branch_id`)
  REFERENCES `m_branches` (`id`);



UPDATE `m_kvs` SET `deleted_at` = '2000-01-01 00:00:00' WHERE (`id` = '1280002');
UPDATE `m_kvs` SET `deleted_at` = '2000-01-01 00:00:00' WHERE (`id` = '1280004');
UPDATE `m_kvs` SET `deleted_at` = '2000-01-01 00:00:00' WHERE (`id` = '1280005');
