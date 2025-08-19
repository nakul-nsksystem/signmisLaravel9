UPDATE t_project_deliveries as a 
LEFT JOIN t_projects as b ON a.t_project_id = b.id
SET a.m_branch_id = b.m_branch_id
WHERE a.m_branch_id is null ;