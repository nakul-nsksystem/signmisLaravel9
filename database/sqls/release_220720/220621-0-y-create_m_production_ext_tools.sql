CREATE TABLE `m_production_ext_tools` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(512) NULL,
  `software_name` VARCHAR(512) NULL COMMENT 'durst-workflow / caldera-primecenter',
  `connection_type` VARCHAR(512) NULL,
  `url` VARCHAR(512) NULL,
  `system_memo` VARCHAR(1024) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
)
COMMENT = 'プロダクション外部ツール';

