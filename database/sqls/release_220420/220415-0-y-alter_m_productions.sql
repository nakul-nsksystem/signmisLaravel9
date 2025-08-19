ALTER TABLE `m_productions` 
ADD COLUMN `is_production_target` TINYINT(1) NULL DEFAULT 0 COMMENT 'Is生産管理対象' AFTER `m_customer_id`;

update m_productions 
   set is_production_target = 1 
 where id in (32,49,1,9,3,31,52,4,50,5,51,27,28,29,6,60,57,20,21,35,33,43,18,19,11,13,
26,25,24,7,22,23,8,36,37) ; 

