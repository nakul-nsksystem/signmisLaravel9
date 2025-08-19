

update m_process_labels
   set formula = 'outsource_product_name|dvalue' 
 where formula = 'cProductName' 
   and m_process_category_id = 17  ; 

update m_process_labels
   set formula = 'outsource_qty|dvalue' 
 where formula = 'm$cOutsourceQty' 
   and m_process_category_id = 17  ; 


update m_process_labels
   set formula = 'SupplierName|dvalue' 
 where formula = 'cSelectedCustomerName' 
   and m_process_category_id = 17  ; 


update m_process_labels
   set formula = 'SupplierLongName|dvalue' 
 where id = 138  ; 

update m_process_labels
   set formula = 'SupplierName|dvalue' 
 where formula = 'cSelectedCustomerSName' 
   and m_process_category_id = 17  ; 


