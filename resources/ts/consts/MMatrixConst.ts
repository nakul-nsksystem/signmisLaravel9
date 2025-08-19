export default {
    /**
     * 想定利益率
     */
    C_PRODUCT_PREDICT_PROFIT_PER : "product_predict_profit_per" , 

    /**
     * 板材 端材扱い境界 % ( 指定 %以下の場合は1枚分)
     */
    C_BOARD_MATERIAL_WASTE_COST_PER : "boardMaterials_waste_cost_per" ,  

    /**
     * 板材 カットコスト
     */
    C_BOARD_MATERIAL_COST_PER_CUT : "boardMaterials_cost_per_cut" ,  

    /**
     * ハーフカット -  ㎡数から長さへの倍率(仮定)
     */
    C_HALFCUT_SQM_TO_LENGTH_RATE : "plotHalfcut_sqm_to_length_rate" ,  

    /**
     * ハーフカット - アプリ幅マージン
     */
    C_HALFCUT_APPLICATION_WIDTH_MARGIN : "plotHalfcut_application_width_margin" ,  

    /**
     * 幕継ぎ加工 - テープ両端必要mm数
     */
    C_JOINT_CARTAIN_TAPE_EXTENSION : "jointCartain_tape_extension" , 

    /**
     * 幕仕上げ - 風抜きテープ両端延長
     */
    C_POST_CARTAIN_WIND_AVOID_EXNTEND : "postCartain_windAvoid_extend" ,  

    /**
     * 幕仕上げ - あおり止め作業時間
     */
    C_POST_CARTAIN_STOP_TILTING_WT : "postCartain_StopTilting_wt" ,  

    /**
     * 幕仕上げ - あおり止め基準長さ（基準長さ単位で最低とする)
     */
    C_POST_CARTAIN_STOP_TILTING_BASE_LENGTH : "postCartain_StopTilting_baseLength" ,  

    /**
     * 幕仕上げ - パイプ つぶし寸法あそび代
     */
    C_POST_CARTAIN_PIPE_CRASH_SPACE : "postCartain_Pipe_crash_space" ,  
    
    /**
     * 幕仕上げ - パイプ 残り寸法コスト％
     */
    C_POST_CARTAIN_PIPE_WASTE_COST_PER : "postCartain_Pipe_waste_cost_per" ,  

    /**
     * 幕仕上げ - パイプ 端材扱い％
     */
    C_POST_CARTAIN_PIPE_WASTE_CONDITION_PER : "postCartain_Pipe_waste_condition_per" ,  

    /**
     * 幕仕上げ - ハトメ端マージンmm数
     */
     C_POST_CARTAIN_GROMMET_MARGIN : "postCartain_grommet_margin" ,  

    /**
     * 施工 - 人工代、諸経費
     */
     C_CONSTRUCTION_COST : "construction_cost" ,  
    
    /**
     * リボード仕上げ - エッジバンド貼り作業秒数/m
     */
     C_REBOARDWORK_EDGEBAND_WT : "reboardWork_edgeband_wt" ,  

    /**
     * 裏面テープ貼り - デフォルトテープ余分長さ倍率
     */
     C_BACKSIDE_TAPE_DEF_EXPAND_LENGTH_PER : "backsideTape_def_expand_length_per" , 

    /**
     * シートカット - サイズによるシートカット原価の掛け率 削除
     */
    C_SHEET_CUT_COST_PER : "sheetCut_cost_per" ,

    /**
     * シートカット - 最低 掛け率反映後周長
     */
    C_SHEET_CUT_MIN_PERIMETER : "sheetCut_min_perimeter" , 
     
    /**
     * シートカット - 最低 掛け率反映後周長
     */
    C_SHEET_CUT_LENGTH_PER : "sheetCut_length_per" , 
}