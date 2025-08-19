update m_materials SET `display_name` = `name` 
where 
exists
(
  select * from m_tag_links 
  where m_tag_links.m_tag_link_id = m_materials.id
  and m_tag_links.m_tag_id = 10301
) and m_branch_id = 1 