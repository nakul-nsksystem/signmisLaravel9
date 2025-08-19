UPDATE t_project_constructions
SET deleted_at = CURRENT_TIME 
WHERE t_project_id in (SELECT id FROM t_projects
WHERE ordered_t_project_id is not null ) ;

UPDATE t_project_deliveries
SET deleted_at = CURRENT_TIME 
WHERE t_project_id in (SELECT id FROM t_projects
WHERE ordered_t_project_id is not null ) ;

UPDATE t_project_files
SET deleted_at = CURRENT_TIME 
WHERE t_project_id in (SELECT id FROM t_projects
WHERE ordered_t_project_id is not null ) ;

UPDATE t_project_mails
SET deleted_at = CURRENT_TIME 
WHERE t_project_id in (SELECT id FROM t_projects
WHERE ordered_t_project_id is not null ) ;

UPDATE t_sale_details
SET deleted_at = CURRENT_TIME 
WHERE t_project_id in (SELECT id FROM t_projects
WHERE ordered_t_project_id is not null ) ;