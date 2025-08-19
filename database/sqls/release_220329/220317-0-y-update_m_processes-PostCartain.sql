-- all
update m_processes
   set enabled_is_column = 'IsAll;IsSewing_All' 
 where enabled_is_column = 'tmp_isSewing01' 
   and m_process_category_id = 5  ; 

update m_processes
   set enabled_is_column = 'IsAll;IsWelder_All' 
 where enabled_is_column = 'tmp_isWelder01' 
   and m_process_category_id = 5  ; 

update m_processes
   set enabled_is_column = 'IsAll;IsGrommetShow_All;IsGrommet_All' 
 where enabled_is_column = 'is_02' 
   and m_process_category_id = 5  ; 

update m_processes
   set operation_rate_value = 'SideLength_All' 
 where operation_rate_value = 'tmp_sideLength01' 
   and m_process_category_id = 5  ; 

update m_processes
   set operation_rate_value = 'GrommetUsageQty_All' 
 where operation_rate_value = 'n_03' 
   and m_process_category_id = 5  ; 

-- Tb
update m_processes
   set enabled_is_column = 'IsTb;IsSewing_Tb' 
 where enabled_is_column = 'tmp_isSewing02' 
   and m_process_category_id = 5  ; 

update m_processes
   set enabled_is_column = 'IsTb;IsWelder_Tb' 
 where enabled_is_column = 'tmp_isWelder02' 
   and m_process_category_id = 5  ; 

update m_processes
   set enabled_is_column = 'IsTb;IsGrommetShow_Tb;IsGrommet_Tb' 
 where enabled_is_column = 'is_07' 
   and m_process_category_id = 5  ; 

update m_processes
   set operation_rate_value = 'SideLength_Tb' 
 where operation_rate_value = 'tmp_sideLength02' 
   and m_process_category_id = 5  ; 

update m_processes
   set operation_rate_value = 'GrommetUsageQty_Tb' 
 where operation_rate_value = 'n_13' 
   and m_process_category_id = 5  ; 

-- Lr
update m_processes
   set enabled_is_column = 'IsLr;IsSewing_Lr' 
 where enabled_is_column = 'tmp_isSewing03' 
   and m_process_category_id = 5  ; 

update m_processes
   set enabled_is_column = 'IsLr;IsWelder_Lr' 
 where enabled_is_column = 'tmp_isWelder03' 
   and m_process_category_id = 5  ; 

update m_processes
   set enabled_is_column = 'IsLr;IsGrommetShow_Lr;IsGrommet_Lr' 
 where enabled_is_column = 'is_12' 
   and m_process_category_id = 5  ; 

update m_processes
   set operation_rate_value = 'SideLength_Lr' 
 where operation_rate_value = 'tmp_sideLength03' 
   and m_process_category_id = 5  ; 

update m_processes
   set operation_rate_value = 'GrommetUsageQty_Lr' 
 where operation_rate_value = 'n_23' 
   and m_process_category_id = 5  ; 

-- T
update m_processes
   set enabled_is_column = 'IsT;IsSewing_T' 
 where enabled_is_column = 'tmp_isSewing04' 
   and m_process_category_id = 5  ; 

update m_processes
   set enabled_is_column = 'IsT;IsWelder_T' 
 where enabled_is_column = 'tmp_isWelder04' 
   and m_process_category_id = 5  ; 

update m_processes
   set enabled_is_column = 'IsT;IsGrommetShow_T;IsGrommet_T' 
 where enabled_is_column = 'is_17' 
   and m_process_category_id = 5  ; 

update m_processes
   set operation_rate_value = 'SideLength_T' 
 where operation_rate_value = 'tmp_sideLength04' 
   and m_process_category_id = 5  ; 

update m_processes
   set operation_rate_value = 'GrommetUsageQty_T' 
 where operation_rate_value = 'n_33' 
   and m_process_category_id = 5  ; 

-- B
update m_processes
   set enabled_is_column = 'IsB;IsSewing_B' 
 where enabled_is_column = 'tmp_isSewing05' 
   and m_process_category_id = 5  ; 

update m_processes
   set enabled_is_column = 'IsB;IsWelder_B' 
 where enabled_is_column = 'tmp_isWelder05' 
   and m_process_category_id = 5  ; 

update m_processes
   set enabled_is_column = 'IsB;IsGrommetShow_B;IsGrommet_B' 
 where enabled_is_column = 'is_22' 
   and m_process_category_id = 5  ; 

update m_processes
   set operation_rate_value = 'SideLength_B' 
 where operation_rate_value = 'tmp_sideLength05' 
   and m_process_category_id = 5  ; 

update m_processes
   set operation_rate_value = 'GrommetUsageQty_B' 
 where operation_rate_value = 'n_43' 
   and m_process_category_id = 5  ; 

-- L
update m_processes
   set enabled_is_column = 'IsL;IsSewing_L' 
 where enabled_is_column = 'tmp_isSewing06' 
   and m_process_category_id = 5  ; 

update m_processes
   set enabled_is_column = 'IsL;IsWelder_L' 
 where enabled_is_column = 'tmp_isWelder06' 
   and m_process_category_id = 5  ; 

update m_processes
   set enabled_is_column = 'IsL;IsGrommetShow_L;IsGrommet_L' 
 where enabled_is_column = 'is_27' 
   and m_process_category_id = 5  ; 

update m_processes
   set operation_rate_value = 'SideLength_L' 
 where operation_rate_value = 'tmp_sideLength06' 
   and m_process_category_id = 5  ; 

update m_processes
   set operation_rate_value = 'GrommetUsageQty_L' 
 where operation_rate_value = 'n_53' 
   and m_process_category_id = 5  ; 

-- R
update m_processes
   set enabled_is_column = 'IsR;IsSewing_R' 
 where enabled_is_column = 'tmp_isSewing07' 
   and m_process_category_id = 5  ; 

update m_processes
   set enabled_is_column = 'IsR;IsWelder_R' 
 where enabled_is_column = 'tmp_isWelder07' 
   and m_process_category_id = 5  ; 

update m_processes
   set enabled_is_column = 'IsR;IsGrommetShow_R;IsGrommet_R' 
 where enabled_is_column = 'is_32' 
   and m_process_category_id = 5  ; 

update m_processes
   set operation_rate_value = 'SideLength_R' 
 where operation_rate_value = 'tmp_sideLength07' 
   and m_process_category_id = 5  ; 

update m_processes
   set operation_rate_value = 'GrommetUsageQty_R' 
 where operation_rate_value = 'n_63' 
   and m_process_category_id = 5  ; 


-- Others
update m_processes
   set enabled_is_column = 'NumOfRopeCut;Rope4ropeOutMMaterialId' 
 where enabled_is_column = 'NumOfRopeCut' 
   and m_process_category_id = 5  ; 




