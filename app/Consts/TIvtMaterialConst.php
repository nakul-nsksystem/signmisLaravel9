<?php

namespace App\Consts;

//在庫用定数クラス
class TIvtMaterialConst 
{
    //入庫区分
    const IVT_M_KV_ID_IN = 5010010 ;
    //出庫区分
    const IVT_M_KV_ID_OUT = 5010020 ;
    //調整区分
    const IVT_M_KV_ID_ADJUST = 5010030 ;


    //材料在庫区分
    
    //発注単位と同じ
    const MATERIAL_IVT_DIV_M_KV_ID_PO_UNIT = 1540001 ; 

    //内容数
    const MATERIAL_IVT_DIV_M_KV_ID_CONTENTS_QTY = 1540002 ;
}