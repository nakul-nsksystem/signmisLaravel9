

update m_process_labels
   set formula = 'SupplierMCustomerId|dvalue' 
 where formula = 'm$cSelectedOutsourceMCustomerId' 
   and m_process_category_id = 2  ; 


update m_process_labels
   set formula = 'MProcessCategoryName|dvalue' 
 where formula = 'cOutsourceMProcessName' 
   and m_process_category_id = 2  ; 


update m_process_labels
   set formula = 'SupplierLongName|dvalue' 
 where formula = 'cSelectedOutsourceMCustomerName' 
   and m_process_category_id = 2  ; 

update m_process_labels
   set formula = 'SupplierName|dvalue' 
 where formula = 'cSelectedOutsourceMCustomerSName' 
   and m_process_category_id = 2  ; 
