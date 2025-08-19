
update m_process_labels
   set is_computed_name = 'IsNotRefMaster|dvalue' 
 where is_computed_name = 'cIsNotRefMaster' 
   and m_process_category_id = 24  ; 

update m_process_labels
   set is_computed_name = 'IsCustomerProvide|dvalue' 
 where is_computed_name = 'm$cIsCustomerProvide' 
   and m_process_category_id = 24  ; 

update m_process_labels
   set formula = 'CustomMaterialName|dvalue' 
 where formula = 'cCustomMaterialName' 
   and m_process_category_id = 24  ; 

update m_process_labels
   set formula = 'MaterialName|dvalue' 
 where formula = 'cMaterialName' 
   and m_process_category_id = 24  ; 

update m_process_labels
   set formula = 'MaterialLongName|dvalue' 
 where formula = 'cMaterialLongName' 
   and m_process_category_id = 24  ; 

update m_process_labels
   set formula = 'OrderSize|dvalue' 
 where formula = 'cOrderSize' 
   and m_process_category_id = 24  ; 

update m_process_labels
   set formula = 'SupplierLongName|dvalue' 
 where formula = 'cSelectedSupplierName' 
   and m_process_category_id = 24  ; 

update m_process_labels
   set formula = 'SupplierName|dvalue' 
 where formula = 'cSelectedSupplierSName' 
   and m_process_category_id = 24  ; 

update m_process_labels
   set formula = 'OrderPrice|dvalue' 
 where formula = 'cOrderPrice' 
   and m_process_category_id = 24  ; 

