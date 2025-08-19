


update m_process_labels
   set is_computed_name = 'IsEdgeband|dvalue' 
 where is_computed_name = 'cIsEdgeband' 
   and m_process_category_id = 25  ; 

update m_process_labels
   set is_computed_name = 'IsAssembly|dvalue' 
 where is_computed_name = 'cIsAssembly' 
   and m_process_category_id = 25  ; 


update m_process_labels
   set formula = 'WorkDetail|dvalue' 
 where formula = 'cWorkDetail' 
   and m_process_category_id = 25  ; 

update m_process_labels
   set formula = 'MaterialName01|dvalue' 
 where formula = 'cEdgebandMaterialName' 
   and m_process_category_id = 25  ; 
   
update m_process_labels
   set formula = 'EdgebandLength|dvalue|lc' 
 where formula = 'cEdgebandLength|lc' 
   and m_process_category_id = 25  ; 
   

update m_process_labels
   set formula = 'AssemblyWorkSeconds|dvalue|lc' 
 where formula = 'cAssemblyWorkSeconds' 
   and m_process_category_id = 25  ; 
   
update m_processes 
   set prepare_per_qty_speed_matrix_key_01_column = 'tmp_edgeBandType' ,
       operation_speed_matrix_key_01_column = 'tmp_edgeBandType'
 where id = 54 ; 