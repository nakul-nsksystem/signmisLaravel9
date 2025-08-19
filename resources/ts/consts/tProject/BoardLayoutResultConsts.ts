export default {
    /**
     * 優先モード
     */
    PriorityMode : { 
        // 継ぎ枚数重視
        C_MODE_JOINED_QTY : "qty" , 

        // コスト重視
        C_MODE_COST : "cost" , 
    } , 

    /**
     * シートの短辺に製品の長辺が入る
     **/ 
    C_SINGLE_SH_LONGER_PD_SHORTER : 'Single_sLpS' ,

    /**
     * シートの長辺に製品の長辺が入る
     */
    C_SINGLE_SH_LONGER_PD_LONGER : 'Single_sLpL' ,
    
    /**
     * 複数シート必要
     * シートの長辺に製品の長辺が入らない
     *   材料の長辺に製品の短辺をあてる
     **/     
     C_MULTI_SH_LONGER_PD_SHORTER : 'Multi_sLpS' ,

     /**
     * 複数シート必要
     * シートの長辺に製品の長辺が入らない
     *   材料の短辺に製品の短辺をあてる
     **/     
    C_MULTI_SH_LONGER_PD_LONGER : 'Multi_sLpL' ,

    /**
     * 複数シート必要
     * シートの長辺に製品の長辺は入るが
     *   材料の短辺に製品の短辺が入らない
     *   材料短辺方向に継ぐ
     **/     
     C_MULTI_SH_LONGER_PD_LONGER_OVER_S_SHORTER : 'Multi_sLpL_overSS' ,
}