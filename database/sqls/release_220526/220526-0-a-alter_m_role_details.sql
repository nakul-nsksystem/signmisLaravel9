ALTER TABLE `m_role_details` 
ADD UNIQUE INDEX `idx_m_role_details_m_role_id_m_role_key_id` (`m_role_id` ASC, `m_role_key_id` ASC) ;
