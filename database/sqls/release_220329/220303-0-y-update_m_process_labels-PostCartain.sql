

update m_process_labels
   set is_computed_name = 'IsAll|dvalue' 
 where is_computed_name = 'cIsAll' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsAll|dvalue;is_01|dvalue' 
 where is_computed_name = 'cIsAll;is_01|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsAll|dvalue;is_02|dvalue' 
 where is_computed_name = 'cIsAll;is_02|dvalue' 
   and m_process_category_id = 5  ; 


update m_process_materials 
   set rate_value = 'TotalCottonTapeLength'
 where rate_value = 'tmp_cottonTapeTotalMaterLength'
 and m_process_category_id = 5  ; 


update m_processes
   set operation_rate_value = 'TotalCottonTapeLength'
 where operation_rate_value = 'tmp_cottonTapeTotalMaterLength'
 and m_process_category_id = 5  ; 

 

update m_process_materials 
   set rate_value = 'Rope4ropeOutMaterLength'
 where rate_value = 'tmp_ropeoutMaterLength'
 and m_process_category_id = 5  ; 

update m_process_materials 
   set price_column = 'Rope4ropeOutCost'
 where price_column = 'tmp_ropeoutCost'
 and m_process_category_id = 5  ; 

update m_processes
   set operation_rate_value = 'TotalLengthOfWelderForSide'
 where operation_rate_value = 'tmp_totalLengthOfWelder4Side'
 and m_process_category_id = 5  ; 

update m_processes
   set operation_rate_value = 'NumOfRopeCut'
 where operation_rate_value = 'IsRopeCut'
 and m_process_category_id = 5  ; 

update m_processes
   set enabled_is_column = 'NumOfRopeCut'
 where enabled_is_column = 'tmp_isRopeCut'
 and m_process_category_id = 5  ; 


update m_process_labels
   set is_computed_name = 'IsWindAvoid|dvalue' 
 where is_computed_name = 'cIsWindAvoid' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'WindAvoidLength|dvalue|lc' 
 where formula = 'cWindAvoidLength|lc' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'NumOfWindAvoid|dvalue' 
 where formula = 'cNumOfWindAvoid' 
   and m_process_category_id = 5  ; 


update m_process_materials 
   set enabled_is_column = 'IsWindAvoid'
 where enabled_is_column = 'tmp_isWindAvoid'
 and m_process_category_id = 5  ; 


update m_process_materials 
   set rate_value = 'WindAvoidTotalMaterLength'
 where rate_value = 'tmp_windAvoidTotalMaterLength'
 and m_process_category_id = 5  ; 

update m_processes
   set enabled_is_column = 'IsWindAvoid'
 where enabled_is_column = 'tmp_isWindAvoid'
 and m_process_category_id = 5  ; 
 
update m_processes
   set operation_rate_value = 'WindAvoidTotalMaterLength'
 where operation_rate_value = 'tmp_windAvoidTotalMaterLength'
 and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsStopTilting|dvalue' 
 where is_computed_name = 'cIsStopTilting' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'StopTiltingWayMKvId|dvalue|mkv' 
 where formula = 'cStopTiltingWayMKvId|mkv' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'StopTiltingLength|dvalue|lc' 
 where formula = 'cStopTiltingLength|lc' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'NumOfStopTilting|dvalue' 
 where formula = 'cNumOfStopTilting' 
   and m_process_category_id = 5  ; 


update m_process_materials 
   set enabled_is_column = 'IsStopTilting'
 where enabled_is_column = 'tmp_isStopTilting'
 and m_process_category_id = 5  ; 


update m_process_materials 
   set rate_value = 'StopTiltingTotalMaterLength'
 where rate_value = 'tmp_stopTiltingTotalMaterLength'
 and m_process_category_id = 5  ; 

update m_processes
   set enabled_is_column = 'IsStopTilting'
 where enabled_is_column = 'tmp_isStopTilting'
 and m_process_category_id = 5  ; 
 
 
update m_processes
   set operation_rate_value = 'CalcedNumOfStopTilting'
 where operation_rate_value = 'tmp_calcedNumOfStopTilting'
 and m_process_category_id = 5  ; 


update m_processes
   set prepare_per_qty_rate_value = 'CalcedNumOfStopTilting'
 where prepare_per_qty_rate_value = 'tmp_calcedNumOfStopTilting'
 and m_process_category_id = 5  ; 



update m_process_labels
   set is_computed_name = 'IsStrongGrommets|dvalue' 
 where is_computed_name = 'cIsStrongGrommets' 
   and m_process_category_id = 5  ; 


update m_process_labels
   set formula = 'NumOfStrongGrommets|dvalue' 
 where formula = 'cNumOfStrongGrommets' 
   and m_process_category_id = 5  ; 
   


update m_process_labels
   set is_computed_name = 'IsPipe|dvalue' 
 where is_computed_name = 'cIsPipe' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'PipeMaterialName|dvalue' 
 where formula = 'cPipeMaterialName' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'PipeLength|dvalue|lc' 
 where formula = 'cPipeLength|lc' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'NumOfPipe|dvalue' 
 where formula = 'cNumOfPipe' 
   and m_process_category_id = 5  ; 


update m_process_labels
   set formula = 'PipeCrashLength|dvalue' 
 where formula = 'cPipeCrashLength' 
   and m_process_category_id = 5  ; 

update m_process_materials 
   set enabled_is_column = 'IsPipe'
 where enabled_is_column = 'tmp_isPipe'
 and m_process_category_id = 5  ; 

 update m_process_materials 
   set enabled_is_column = 'PipeTotalNumOfCut'
 where enabled_is_column = 'tmp_pipeTotalNumOfCut'
 and m_process_category_id = 5  ; 

 update m_process_materials 
   set enabled_is_column = 'PipeTotalNumOfJoint'
 where enabled_is_column = 'tmp_pipeTotalNumOfJoint'
 and m_process_category_id = 5  ; 


 update m_process_materials 
   set price_column = 'PipeCostPerMater'
 where price_column = 'tmp_pipeCostPerMater'
 and m_process_category_id = 5  ; 

 update m_process_materials 
   set price_column = 'PipeWasteCostPerMater'
 where price_column = 'tmp_pipeWasteCostPerMater'
 and m_process_category_id = 5  ; 




update m_process_materials 
   set rate_value = 'PipeTotalMaterLength'
 where rate_value = 'tmp_pipeTotalMaterLength'
 and m_process_category_id = 5  ; 

update m_process_materials 
   set rate_value = 'PipeTotalNumOfCut'
 where rate_value = 'tmp_pipeTotalNumOfCut'
 and m_process_category_id = 5  ; 


update m_process_materials 
   set rate_value = 'PipeTotalNumOfJoint'
 where rate_value = 'tmp_pipeTotalNumOfJoint'
 and m_process_category_id = 5  ; 

 
update m_process_materials 
   set rate_value = 'PipeTotalWasteMaterLength'
 where rate_value = 'tmp_pipeTotalWasteMaterLength'
 and m_process_category_id = 5  ; 


update m_process_labels
   set is_computed_name = 'IsWindAvoid|dvalue' 
 where is_computed_name = 'cIsWindAvoid' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsStopTilting|dvalue' 
 where is_computed_name = 'cIsStopTilting' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsRope4ropeOut|dvalue' 
 where is_computed_name = 'cIsRope4ropeOut' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsPipe|dvalue' 
 where is_computed_name = 'cIsPipe' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsAll|dvalue' 
 where is_computed_name = 'cIsAll' 
   and m_process_category_id = 5  ; 


update m_process_labels
   set is_computed_name = 'IsAll|dvalue;is_01|dvalue' 
 where is_computed_name = 'cIsAll;is_01|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsAll|dvalue;is_02|dvalue' 
 where is_computed_name = 'cIsAll;is_02|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsAll|dvalue;is_03|dvalue' 
 where is_computed_name = 'cIsAll;is_03|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsAll|dvalue;is_04|dvalue' 
 where is_computed_name = 'cIsAll;is_04|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsTb|dvalue' 
 where is_computed_name = 'cIsTb' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsTb|dvalue;is_06|dvalue' 
 where is_computed_name = 'cIsTb;is_06|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsTb|dvalue;is_07|dvalue' 
 where is_computed_name = 'cIsTb;is_07|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsTb|dvalue;is_08|dvalue' 
 where is_computed_name = 'cIsTb;is_08|dvalue' 
   and m_process_category_id = 5  ; 
   
update m_process_labels
   set is_computed_name = 'IsTb|dvalue;is_09|dvalue' 
 where is_computed_name = 'cIsTb;is_09|dvalue' 
   and m_process_category_id = 5  ; 

   
update m_process_labels
   set is_computed_name = 'IsLr|dvalue' 
 where is_computed_name = 'cIsLr' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsLr|dvalue;is_11|dvalue' 
 where is_computed_name = 'cIsLr;is_16|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsLr|dvalue;is_12|dvalue' 
 where is_computed_name = 'cIsLr;is_17|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsLr|dvalue;is_13|dvalue' 
 where is_computed_name = 'cIsLr;is_13|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsLr|dvalue;is_14|dvalue' 
 where is_computed_name = 'cIsLr;is_14|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsT|dvalue' 
 where is_computed_name = 'cIsT' 
   and m_process_category_id = 5  ; 
   
update m_process_labels
   set is_computed_name = 'IsT|dvalue;is_17|dvalue' 
 where is_computed_name = 'cIsT;is_17|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsT|dvalue;is_16|dvalue' 
 where is_computed_name = 'cIsT;is_16' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsT|dvalue;is_18|dvalue' 
 where is_computed_name = 'cIsT;is_18|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsT|dvalue;is_19|dvalue' 
 where is_computed_name = 'cIsT;is_19|dvalue' 
   and m_process_category_id = 5  ; 


update m_process_labels
   set is_computed_name = 'cIsB|dvalue' 
 where is_computed_name = 'cIsB' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'cIsB|dvalue;is_21|dvalue' 
 where is_computed_name = 'cIsB;is_21' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'cIsB|dvalue;is_22|dvalue' 
 where is_computed_name = 'cIsB;is_22|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'cIsB|dvalue;is_23|dvalue' 
 where is_computed_name = 'cIsB;is_23|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'cIsB|dvalue;is_24|dvalue' 
 where is_computed_name = 'cIsB;is_24|dvalue' 
   and m_process_category_id = 5  ; 


update m_process_labels
   set is_computed_name = 'IsB|dvalue;is_21|dvalue' 
 where is_computed_name = 'cIsB|dvalue;is_21|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsB|dvalue;is_22|dvalue' 
 where is_computed_name = 'cIsB|dvalue;is_22|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsB|dvalue;is_23|dvalue' 
 where is_computed_name = 'cIsB|dvalue;is_23|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsB|dvalue;is_24|dvalue' 
 where is_computed_name = 'cIsB|dvalue;is_24|dvalue' 
   and m_process_category_id = 5  ; 


update m_process_labels
   set is_computed_name = 'IsL|dvalue' 
 where is_computed_name = 'cIsL' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsL|dvalue;is_26|dvalue' 
 where is_computed_name = 'cIsL;is_26' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsL|dvalue;is_27|dvalue' 
 where is_computed_name = 'cIsL;is_27|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsL|dvalue;is_28|dvalue' 
 where is_computed_name = 'cIsL;is_28|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsL|dvalue;is_29|dvalue' 
 where is_computed_name = 'cIsL;is_29|dvalue' 
   and m_process_category_id = 5  ; 


update m_process_labels
   set is_computed_name = 'IsR|dvalue' 
 where is_computed_name = 'cIsR' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsR|dvalue;is_31|dvalue' 
 where is_computed_name = 'cIsR;is_31' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsR|dvalue;is_32|dvalue' 
 where is_computed_name = 'cIsR;is_32|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsR|dvalue;is_33|dvalue' 
 where is_computed_name = 'cIsR;is_33|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsR|dvalue;is_34|dvalue' 
 where is_computed_name = 'cIsR;is_34|dvalue' 
   and m_process_category_id = 5  ; 


update m_process_labels
   set is_computed_name = 'IsB|dvalue' 
 where is_computed_name = 'cIsB|dvalue' 
   and m_process_category_id = 5  ; 
   


update m_process_labels
   set formula = 'Rope4ropeOutMaterialName|dvalue' 
 where formula = 'cRope4ropeOutMaterialName' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'Rope4ropeMemo|dvalue' 
 where formula = 'cRope4ropeMemo' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'NumOfStrongGrommets|dvalue' 
 where formula = 'cNumOfStrongGrommets' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'WindAvoidLength|dvalue|lc' 
 where formula = 'cWindAvoidLength|lc' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'NumOfWindAvoid|dvalue' 
 where formula = 'cNumOfWindAvoid' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'StopTiltingWayMKvId|dvalue|mkv' 
 where formula = 'cStopTiltingWayMKvId|mkv' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'StopTiltingLength|dvalue|lc' 
 where formula = 'cStopTiltingLength|lc' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'NumOfStopTilting|dvalue' 
 where formula = 'cNumOfStopTilting' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'PipeMaterialName|dvalue' 
 where formula = 'cPipeMaterialName' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'PipeLength|dvalue|lc' 
 where formula = 'cPipeLength|lc' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'NumOfPipe|dvalue' 
 where formula = 'cNumOfPipe' 
   and m_process_category_id = 5  ; 


update m_process_labels
   set formula = 'PipeCrashLength|dvalue' 
 where formula = 'cPipeCrashLength' 
   and m_process_category_id = 5  ; 


-- ---


-- -- うまくいってない

update m_process_labels
   set is_computed_name = 'IsAll|dvalue;is_02|dvalue;IsGrommetSpecifyPitch_All|dvalue' 
 where is_computed_name = 'cIsAll;is_02|dvalue;tmp_isGrommetSpcecifyPitch01|dvalue' 
   and m_process_category_id = 5  ; 


-- -- うまくいってない
update m_process_labels
   set is_computed_name = 'IsAll|dvalue;is_02|dvalue;IsGrommetSpecifyQty_All|dvalue' 
 where is_computed_name = 'cIsAll;is_02|dvalue;tmp_isGrommetSpcecifyQty01|dvalue' 
   and m_process_category_id = 5  ; 


-- -- うまくいってない
update m_process_labels
   set is_computed_name = 'IsAll|dvalue;IsRope_All|dvalue' 
 where is_computed_name = 'cIsAll;tmp_isRope01|dvalue' 
   and m_process_category_id = 5  ; 

-- -- うまくいってない
update m_process_labels
   set is_computed_name = 'IsAll|dvalue;IsGrommetShow_All|dvalue;IsGrommet_All|dvalue' 
 where is_computed_name = 'IsAll|dvalue;is_02|dvalue' 
   and m_process_category_id = 5  ; 


update m_process_labels
   set is_computed_name = 'IsAll|dvalue;IsGrommetShow_All|dvalue;IsGrommet_All|dvalue;IsGrommetSpecifyPitch_All|dvalue' 
 where is_computed_name = 'IsAll|dvalue;is_02|dvalue;IsGrommetSpecifyQty_All|dvalue' 
   and m_process_category_id = 5  ; 


update m_process_labels
   set is_computed_name = 'IsAll|dvalue;IsGrommetShow_All|dvalue;is_02|dvalue;IsGrommetSpecifyPitch_All|dvalue' 
 where is_computed_name = 'IsAll|dvalue;IsGrommetShow_All|dvalue;IsGrommet_All|dvalue;IsGrommetSpecifyPitch_All|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsAll|dvalue;IsGrommetShow_All|dvalue;is_02|dvalue;IsGrommetSpecifyQty_All|dvalue' 
 where id = 66  ; 
   
update m_process_labels
   set is_computed_name = 'IsAll|dvalue;IsGrommetShow_All|dvalue;is_02|dvalue;IsGrommetSpecifyPitch_All|dvalue' 
 where is_computed_name = 'IsAll|dvalue;is_02|dvalue;IsGrommetSpecifyPitch_All|dvalue' 
   and m_process_category_id = 5  ; 


update m_process_labels
   set formula = 'GrommetName_All|dvalue' 
 where formula = 'tmp_grommetName01|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsAll|dvalue;IsMagicTape_All|dvalue' 
 where is_computed_name = 'IsAll|dvalue;is_03|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'MagicTapeName_All|dvalue' 
 where formula = 'tmp_mtName01|dvalue' 
   and m_process_category_id = 5  ; 



update m_process_labels
   set is_computed_name = 'IsAll|dvalue;IsSilliconRubber_All|dvalue' 
 where is_computed_name = 'IsAll|dvalue;is_04|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'SilliconRubberName_All|dvalue' 
 where formula = 'tmp_silliconRubberName01|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsAll|dvalue;IsCottonTapeShow_All|dvalue;IsCottonTape_All|dvalue' 
 where is_computed_name = 'IsAll|dvalue;is_01|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsAll|dvalue;IsGrommetShow_All|dvalue;IsGrommet_All|dvalue;IsGrommetSpecifyPitch_All|dvalue' 
 where is_computed_name = 'IsAll|dvalue;IsGrommetShow_All|dvalue;is_02|dvalue;IsGrommetSpecifyPitch_All|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsAll|dvalue;IsGrommetShow_All|dvalue;IsGrommet_All|dvalue;IsGrommetSpecifyQty_All|dvalue' 
 where is_computed_name = 'IsAll|dvalue;IsGrommetShow_All|dvalue;is_02|dvalue;IsGrommetSpecifyQty_All|dvalue' 
   and m_process_category_id = 5  ; 

-- 


update m_process_labels
   set is_computed_name = 'IsTb|dvalue;IsCottonTapeShow_Tb|dvalue;IsCottonTape_Tb|dvalue' 
 where is_computed_name = 'IsTb|dvalue;is_06|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsTb|dvalue;IsGrommetShow_Tb|dvalue;IsGrommet_Tb|dvalue' 
 where is_computed_name = 'IsTb|dvalue;is_07|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsTb|dvalue;IsGrommetShow_Tb|dvalue;IsGrommet_Tb|dvalue;IsGrommetSpecifyPitch_Tb|dvalue' 
 where is_computed_name = 'cIsTb;is_07|dvalue;tmp_isGrommetSpcecifyPitch02|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsTb|dvalue;IsGrommetShow_Tb|dvalue;IsGrommet_Tb|dvalue;IsGrommetSpecifyQty_Tb|dvalue' 
 where is_computed_name = 'cIsTb;is_07|dvalue;tmp_isGrommetSpcecifyQty02|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsTb|dvalue;IsRope_Tb|dvalue' 
 where is_computed_name = 'cIsTb;tmp_isRope02|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsTb|dvalue;IsMagicTape_Tb|dvalue' 
 where is_computed_name = 'IsTb|dvalue;is_08|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsTb|dvalue;IsSilliconRubber_Tb|dvalue' 
 where is_computed_name = 'IsTb|dvalue;is_09|dvalue' 
   and m_process_category_id = 5  ; 


update m_process_labels
   set formula = 'GrommetName_Tb|dvalue' 
 where formula = 'tmp_grommetName02|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'MagicTapeName_Tb|dvalue' 
 where formula = 'tmp_mtName02|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'SilliconRubberName_Tb|dvalue' 
 where formula = 'tmp_silliconRubberName02|dvalue' 
   and m_process_category_id = 5  ; 

--


update m_process_labels
   set is_computed_name = 'IsLr|dvalue;IsCottonTapeShow_Lr|dvalue;IsCottonTape_Lr|dvalue' 
 where is_computed_name = 'IsLr|dvalue;is_11|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsLr|dvalue;IsGrommetShow_Lr|dvalue;IsGrommet_Lr|dvalue' 
 where is_computed_name = 'IsLr|dvalue;is_12|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsLr|dvalue;IsGrommetShow_Lr|dvalue;IsGrommet_Lr|dvalue;IsGrommetSpecifyPitch_Lr|dvalue' 
 where is_computed_name = 'cIsLr;is_17|dvalue;tmp_isGrommetSpcecifyPitch03|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsLr|dvalue;IsGrommetShow_Lr|dvalue;IsGrommet_Lr|dvalue;IsGrommetSpecifyQty_Lr|dvalue' 
 where is_computed_name = 'cIsLr;is_17|dvalue;tmp_isGrommetSpcecifyQty03|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsLr|dvalue;IsRope_Lr|dvalue' 
 where is_computed_name = 'cIsLr;tmp_isRope03|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsLr|dvalue;IsMagicTape_Lr|dvalue' 
 where is_computed_name = 'IsLr|dvalue;is_13|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsLr|dvalue;IsSilliconRubber_Lr|dvalue' 
 where is_computed_name = 'IsLr|dvalue;is_14|dvalue' 
   and m_process_category_id = 5  ; 


update m_process_labels
   set formula = 'GrommetName_Lr|dvalue' 
 where formula = 'tmp_grommetName03|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'MagicTapeName_Lr|dvalue' 
 where formula = 'tmp_mtName03|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'SilliconRubberName_Lr|dvalue' 
 where formula = 'tmp_silliconRubberName03|dvalue' 
   and m_process_category_id = 5  ; 

--


update m_process_labels
   set is_computed_name = 'IsT|dvalue;IsCottonTapeShow_T|dvalue;IsCottonTape_T|dvalue' 
 where is_computed_name = 'IsT|dvalue;is_16|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsT|dvalue;IsGrommetShow_T|dvalue;IsGrommet_T|dvalue' 
 where is_computed_name = 'IsT|dvalue;is_17|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsT|dvalue;IsGrommetShow_T|dvalue;IsGrommet_T|dvalue;IsGrommetSpecifyPitch_T|dvalue' 
 where is_computed_name = 'cIsT;is_17|dvalue;tmp_isGrommetSpcecifyPitch04|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsT|dvalue;IsGrommetShow_T|dvalue;IsGrommet_T|dvalue;IsGrommetSpecifyQty_T|dvalue' 
 where id = 177  ; 

update m_process_labels
   set is_computed_name = 'IsT|dvalue;IsRope_T|dvalue' 
 where is_computed_name = 'cIsT;tmp_isRope04|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsT|dvalue;IsMagicTape_T|dvalue' 
 where is_computed_name = 'IsT|dvalue;is_18|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsT|dvalue;IsSilliconRubber_T|dvalue' 
 where is_computed_name = 'IsT|dvalue;is_19|dvalue' 
   and m_process_category_id = 5  ; 


update m_process_labels
   set formula = 'GrommetName_T|dvalue' 
 where formula = 'tmp_grommetName04|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'MagicTapeName_T|dvalue' 
 where formula = 'tmp_mtName04|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'SilliconRubberName_T|dvalue' 
 where formula = 'tmp_silliconRubberName04|dvalue' 
   and m_process_category_id = 5  ; 

--


update m_process_labels
   set is_computed_name = 'IsB|dvalue;IsCottonTapeShow_B|dvalue;IsCottonTape_B|dvalue' 
 where is_computed_name = 'IsB|dvalue;is_21|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsB|dvalue;IsGrommetShow_B|dvalue;IsGrommet_B|dvalue' 
 where is_computed_name = 'IsB|dvalue;is_22|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsB|dvalue;IsGrommetShow_B|dvalue;IsGrommet_B|dvalue;IsGrommetSpecifyPitch_B|dvalue' 
 where is_computed_name = 'cIsB;is_22|dvalue;tmp_isGrommetSpcecifyPitch05|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsB|dvalue;IsGrommetShow_B|dvalue;IsGrommet_B|dvalue;IsGrommetSpecifyQty_B|dvalue' 
 where id = 178  ; 

update m_process_labels
   set is_computed_name = 'IsB|dvalue;IsRope_B|dvalue' 
 where is_computed_name = 'cIsB;tmp_isRope05|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsB|dvalue;IsMagicTape_B|dvalue' 
 where is_computed_name = 'IsB|dvalue;is_23|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsB|dvalue;IsSilliconRubber_B|dvalue' 
 where is_computed_name = 'IsB|dvalue;is_24|dvalue' 
   and m_process_category_id = 5  ; 


update m_process_labels
   set formula = 'GrommetName_B|dvalue' 
 where formula = 'tmp_grommetName05|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'MagicTapeName_B|dvalue' 
 where formula = 'tmp_mtName05|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'SilliconRubberName_B|dvalue' 
 where formula = 'tmp_silliconRubberName05|dvalue' 
   and m_process_category_id = 5  ; 

--

update m_process_labels
   set is_computed_name = 'IsL|dvalue;IsCottonTapeShow_L|dvalue;IsCottonTape_L|dvalue' 
 where is_computed_name = 'IsL|dvalue;is_26|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsL|dvalue;IsGrommetShow_L|dvalue;IsGrommet_L|dvalue' 
 where is_computed_name = 'IsL|dvalue;is_27|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsL|dvalue;IsGrommetShow_L|dvalue;IsGrommet_L|dvalue;IsGrommetSpecifyPitch_L|dvalue' 
 where is_computed_name = 'cIsL;is_27|dvalue;tmp_isGrommetSpcecifyPitch06|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsL|dvalue;IsGrommetShow_L|dvalue;IsGrommet_L|dvalue;IsGrommetSpecifyQty_L|dvalue' 
 where id = 179  ; 

update m_process_labels
   set is_computed_name = 'IsL|dvalue;IsRope_L|dvalue' 
 where is_computed_name = 'cIsL;tmp_isRope06|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsL|dvalue;IsMagicTape_L|dvalue' 
 where is_computed_name = 'IsL|dvalue;is_28|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsL|dvalue;IsSilliconRubber_L|dvalue' 
 where is_computed_name = 'IsL|dvalue;is_29|dvalue' 
   and m_process_category_id = 5  ; 


update m_process_labels
   set formula = 'GrommetName_L|dvalue' 
 where formula = 'tmp_grommetName06|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'MagicTapeName_L|dvalue' 
 where formula = 'tmp_mtName06|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'SilliconRubberName_L|dvalue' 
 where formula = 'tmp_silliconRubberName06|dvalue' 
   and m_process_category_id = 5  ; 


--



update m_process_labels
   set is_computed_name = 'IsR|dvalue;IsCottonTapeShow_R|dvalue;IsCottonTape_R|dvalue' 
 where is_computed_name = 'IsR|dvalue;is_31|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsR|dvalue;IsGrommetShow_R|dvalue;IsGrommet_R|dvalue' 
 where is_computed_name = 'IsR|dvalue;is_32|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsR|dvalue;IsGrommetShow_R|dvalue;IsGrommet_R|dvalue;IsGrommetSpecifyPitch_R|dvalue' 
 where is_computed_name = 'cIsR;is_32|dvalue;tmp_isGrommetSpcecifyPitch07|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsR|dvalue;IsGrommetShow_R|dvalue;IsGrommet_R|dvalue;IsGrommetSpecifyQty_R|dvalue' 
 where id = 180  ; 

update m_process_labels
   set is_computed_name = 'IsR|dvalue;IsRope_R|dvalue' 
 where is_computed_name = 'cIsR;tmp_isRope07|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsR|dvalue;IsMagicTape_R|dvalue' 
 where is_computed_name = 'IsR|dvalue;is_33|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set is_computed_name = 'IsR|dvalue;IsSilliconRubber_R|dvalue' 
 where is_computed_name = 'IsR|dvalue;is_34|dvalue' 
   and m_process_category_id = 5  ; 


update m_process_labels
   set formula = 'GrommetName_R|dvalue' 
 where formula = 'tmp_grommetName07|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'MagicTapeName_R|dvalue' 
 where formula = 'tmp_mtName07|dvalue' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'SilliconRubberName_R|dvalue' 
 where formula = 'tmp_silliconRubberName07|dvalue' 
   and m_process_category_id = 5  ; 


update m_process_labels
   set formula = 'n_35|dvalue|lc' 
 where formula = 'n_33|dvalue|lc' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'n_45|dvalue|lc' 
 where formula = 'n_43|dvalue|lc' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'n_55|dvalue|lc' 
 where formula = 'n_53|dvalue|lc' 
   and m_process_category_id = 5  ; 

update m_process_labels
   set formula = 'n_65|dvalue|lc' 
 where formula = 'n_63|dvalue|lc' 
   and m_process_category_id = 5  ; 


update m_process_labels
   set prefix = null
 where id in (158 ,159 ,160 ,157) ; 

update m_process_labels
   set formula = 'n_34|dvalue|lc' 
 where id = 185 ; 
 
update m_process_labels
   set formula = 'n_44|dvalue|lc' 
 where id = 186 ; 

update m_process_labels
   set formula = 'n_54|dvalue|lc' 
 where id = 187 ; 
 
update m_process_labels
   set formula = 'n_64|dvalue|lc' 
 where id = 188 ; 


-- label
update m_process_labels
  set formula = 'n_04|dvalue|lc'
 where formula = 'n_04|dvalue|dvalue|lc'
   and m_process_category_id = 5  ; 


update m_process_labels
  set formula = 'n_14|dvalue|lc'
 where formula = 'n_14|dvalue|dvalue|lc'
   and m_process_category_id = 5  ; 


update m_process_labels
  set formula = 'n_24|dvalue|lc'
 where formula = 'n_24|dvalue|dvalue|lc'
   and m_process_category_id = 5  ; 

