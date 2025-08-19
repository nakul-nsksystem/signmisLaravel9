ALTER TABLE `m_production_modes` 
ADD COLUMN `prepare_sec_per_job` INT NOT NULL DEFAULT 0 COMMENT '準備秒数(ジョブあたり)' AFTER `machine_mode_name`;

update `m_production_modes` 
   set `prepare_sec_per_job` = 300 
where id in (38 ,37) ; 

