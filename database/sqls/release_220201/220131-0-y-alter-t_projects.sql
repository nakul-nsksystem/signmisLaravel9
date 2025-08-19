ALTER TABLE `t_projects` 
ADD COLUMN `total_cost` DECIMAL(15,4) NOT NULL DEFAULT 0 COMMENT '総原価' AFTER `other_fee`,
ADD COLUMN `total_sell_price` DECIMAL(15,4) NOT NULL DEFAULT 0 COMMENT '総売価' AFTER `total_cost`,
ADD COLUMN `total_profit` DECIMAL(15,4) NOT NULL DEFAULT 0 COMMENT '総利益' AFTER `total_sell_price`,
ADD COLUMN `total_variable_cost` DECIMAL(15,4) NOT NULL DEFAULT 0 COMMENT '総変動費' AFTER `total_profit`,
ADD COLUMN `total_margin_profit` DECIMAL(15,4) NOT NULL DEFAULT 0 COMMENT '総限界利益' AFTER `total_variable_cost`;

ALTER TABLE `t_projects` 
ADD COLUMN `profit_per` DECIMAL(15,4) NOT NULL DEFAULT 0 COMMENT '利益率' AFTER `total_margin_profit`,
ADD COLUMN `margin_profit_per` DECIMAL(15,4) NOT NULL DEFAULT 0 COMMENT '限界利益率' AFTER `profit_per`;
