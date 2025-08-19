-- all
update m_process_materials
   set enabled_is_column = 'IsAll;IsGrommetShow_All;IsGrommet_All' 
 where enabled_is_column = 'is_02' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set price_column = 'GrommetPrice_All' 
 where price_column = 'tmp_grommetPrice01' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set rate_value = 'GrommetUsageQty_All' 
 where rate_value = 'n_03' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set enabled_is_column = 'IsAll;IsMagicTape_All' 
 where enabled_is_column = 'is_03' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set price_column = 'MagicTapePrice_All' 
 where price_column = 'tmp_mtPrice01' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set rate_value = 'MagicTapeTotalLength_All' 
 where rate_value = 'tmp_mtTotalLength01' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set enabled_is_column = 'IsAll;IsSilliconRubber_All' 
 where enabled_is_column = 'is_04' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set price_column = 'SilliconRubberPrice_All' 
 where price_column = 'tmp_silliconRubberPrice01' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set rate_value = 'SideMaterLength_All' 
 where rate_value = 'tmp_sideMaterLength01' 
   and m_process_category_id = 5  ; 

-- tb

update m_process_materials
   set enabled_is_column = 'IsTb;IsGrommetShow_Tb;IsGrommet_Tb' 
 where enabled_is_column = 'is_07' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set price_column = 'GrommetPrice_Tb' 
 where price_column = 'tmp_grommetPrice02' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set rate_value = 'GrommetUsageQty_Tb' 
 where rate_value = 'n_13' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set enabled_is_column = 'IsTb;IsMagicTape_Tb' 
 where enabled_is_column = 'is_08' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set price_column = 'MagicTapePrice_Tb' 
 where price_column = 'tmp_mtPrice02' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set rate_value = 'MagicTapeTotalLength_Tb' 
 where rate_value = 'tmp_mtTotalLength02' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set enabled_is_column = 'IsTb;IsSilliconRubber_Tb' 
 where enabled_is_column = 'is_09' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set price_column = 'SilliconRubberPrice_Tb' 
 where price_column = 'tmp_silliconRubberPrice02' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set rate_value = 'SideMaterLength_Tb' 
 where rate_value = 'tmp_sideMaterLength02' 
   and m_process_category_id = 5  ; 


-- lr

update m_process_materials
   set enabled_is_column = 'IsLr;IsGrommetShow_Lr;IsGrommet_Lr' 
 where enabled_is_column = 'is_12' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set price_column = 'GrommetPrice_Lr' 
 where price_column = 'tmp_grommetPrice03' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set rate_value = 'GrommetUsageQty_Lr' 
 where rate_value = 'n_23' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set enabled_is_column = 'IsLr;IsMagicTape_Lr' 
 where enabled_is_column = 'is_13' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set price_column = 'MagicTapePrice_Lr' 
 where price_column = 'tmp_mtPrice03' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set rate_value = 'MagicTapeTotalLength_Lr' 
 where rate_value = 'tmp_mtTotalLength03' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set enabled_is_column = 'IsLr;IsSilliconRubber_Lr' 
 where enabled_is_column = 'is_14' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set price_column = 'SilliconRubberPrice_Lr' 
 where price_column = 'tmp_silliconRubberPrice03' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set rate_value = 'SideMaterLength_Lr' 
 where rate_value = 'tmp_sideMaterLength03' 
   and m_process_category_id = 5  ; 




-- T

update m_process_materials
   set enabled_is_column = 'IsT;IsGrommetShow_T;IsGrommet_T' 
 where enabled_is_column = 'is_17' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set price_column = 'GrommetPrice_T' 
 where price_column = 'tmp_grommetPrice04' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set rate_value = 'GrommetUsageQty_T' 
 where rate_value = 'n_33' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set enabled_is_column = 'IsT;IsMagicTape_T' 
 where enabled_is_column = 'is_18' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set price_column = 'MagicTapePrice_T' 
 where price_column = 'tmp_mtPrice04' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set rate_value = 'MagicTapeTotalLength_T' 
 where rate_value = 'tmp_mtTotalLength04' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set enabled_is_column = 'IsT;IsSilliconRubber_T' 
 where enabled_is_column = 'is_19' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set price_column = 'SilliconRubberPrice_T' 
 where price_column = 'tmp_silliconRubberPrice04' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set rate_value = 'SideMaterLength_T' 
 where rate_value = 'tmp_sideMaterLength04' 
   and m_process_category_id = 5  ; 

-- B

update m_process_materials
   set enabled_is_column = 'IsB;IsGrommetShow_B;IsGrommet_B' 
 where enabled_is_column = 'is_22' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set price_column = 'GrommetPrice_B' 
 where price_column = 'tmp_grommetPrice05' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set rate_value = 'GrommetUsageQty_B' 
 where rate_value = 'n_43' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set enabled_is_column = 'IsB;IsMagicTape_B' 
 where enabled_is_column = 'is_23' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set price_column = 'MagicTapePrice_B' 
 where price_column = 'tmp_mtPrice05' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set rate_value = 'MagicTapeTotalLength_B' 
 where rate_value = 'tmp_mtTotalLength05' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set enabled_is_column = 'IsB;IsSilliconRubber_B' 
 where enabled_is_column = 'is_24' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set price_column = 'SilliconRubberPrice_B' 
 where price_column = 'tmp_silliconRubberPrice05' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set rate_value = 'SideMaterLength_B' 
 where rate_value = 'tmp_sideMaterLength05' 
   and m_process_category_id = 5  ; 



-- L

update m_process_materials
   set enabled_is_column = 'IsL;IsGrommetShow_L;IsGrommet_L' 
 where enabled_is_column = 'is_27' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set price_column = 'GrommetPrice_L' 
 where price_column = 'tmp_grommetPrice06' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set rate_value = 'GrommetUsageQty_L' 
 where rate_value = 'n_53' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set enabled_is_column = 'IsL;IsMagicTape_L' 
 where enabled_is_column = 'is_28' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set price_column = 'MagicTapePrice_L' 
 where price_column = 'tmp_mtPrice06' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set rate_value = 'MagicTapeTotalLength_L' 
 where rate_value = 'tmp_mtTotalLength06' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set enabled_is_column = 'IsL;IsSilliconRubber_L' 
 where enabled_is_column = 'is_29' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set price_column = 'SilliconRubberPrice_L' 
 where price_column = 'tmp_silliconRubberPrice06' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set rate_value = 'SideMaterLength_L' 
 where rate_value = 'tmp_sideMaterLength06' 
   and m_process_category_id = 5  ; 


-- R

update m_process_materials
   set enabled_is_column = 'IsR;IsGrommetShow_R;IsGrommet_R' 
 where enabled_is_column = 'is_32' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set price_column = 'GrommetPrice_R' 
 where price_column = 'tmp_grommetPrice07' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set rate_value = 'GrommetUsageQty_R' 
 where rate_value = 'n_63' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set enabled_is_column = 'IsR;IsMagicTape_R' 
 where enabled_is_column = 'is_33' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set price_column = 'MagicTapePrice_R' 
 where price_column = 'tmp_mtPrice07' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set rate_value = 'MagicTapeTotalLength_R' 
 where rate_value = 'tmp_mtTotalLength07' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set enabled_is_column = 'IsR;IsSilliconRubber_R' 
 where enabled_is_column = 'is_34' 
   and m_process_category_id = 5  ; 

update m_process_materials
   set price_column = 'SilliconRubberPrice_R' 
 where price_column = 'tmp_silliconRubberPrice07' 
   and m_process_category_id = 5  ; 

update m_process_materials  
   set rate_value = 'SideMaterLength_R' 
 where rate_value = 'tmp_sideMaterLength07' 
   and m_process_category_id = 5  ; 

-- others
update m_process_materials  
   set rate_value = 'NumOfStrongGrommets' 
 where rate_value = 'n_79' 
   and m_process_category_id = 5  ; 

update m_process_materials  
   set rate_value = 'TotalRopeLength' 
 where rate_value = 'tmp_ropeTotalMaterLength' 
   and m_process_category_id = 5  ; 


