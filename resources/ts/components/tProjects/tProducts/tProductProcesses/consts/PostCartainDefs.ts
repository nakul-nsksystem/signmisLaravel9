import NumberUtil from "../../../../../frameworks/NumberUtil";


/**
 * 加工する辺
 */
const PostCartainEdges = { 

    /**
     * 四方
     */
    All : "All" , 

    /**
     * 上下
     */
    Tb  : "Tb"  ,

    /**
     * 左右
     */
    Lr  : "Lr"  ,

    /**
     * 上
     */
    T   : "T"   ,

    /**
     * 下
     */
    B   : "B"   ,

    /**
     * 左
     */
    L   : "L"   ,

    /**
     * 右
     */
    R   : "R"   ,

 

} as const ;
type PostCartainEdges = typeof PostCartainEdges[keyof typeof PostCartainEdges] ; 

const PostCartainGetterNames = { 
    SideLength             : "SideLength"             ,
    SideMaterLength        : "SideMaterLength"        ,
    TypeMKv                : "TypeMKv"                ,
    TypeMKvTargetMKvCategoryId : "TypeMKvTargetMKvCategoryId" ,     
    FinishWayMKv                : "FinishWayMKv"                ,
    IsRope                 : "IsRope"                 ,
    IsCottonTapeShow       : "IsCottonTapeShow"           ,
    IsGrommetShow          : "IsGrommetShow"          ,
    GrommetName            : "GrommetName"            ,
    GrommetPrice           : "GrommetPrice"           ,
    IsGrommetSpecifyPitch  : "IsGrommetSpecifyPitch"  ,    
    IsGrommetSpecifyQty    : "IsGrommetSpecifyQty"    ,
    GrommetValidSize       : "GrommetValidSize"       ,
    CalcedGrommetUsageQty  : "CalcedGrommetUsageQty"  ,
    CalcedGrommetPitch     : "CalcedGrommetPitch"     ,
    CornerGrommetUsageQty  : "CornerGrommetUsageQty"  ,
    GrommetUsageQty        : "GrommetUsageQty"        ,
    MagicTapeName          : "MagicTapeName"          ,
    MagicTapePrice         : "MagicTapePrice"         ,
    MagicTapeTotalLength   : "MagicTapeTotalLength"   ,
    SilliconRubberName     : "SilliconRubberName"     ,    
    SilliconRubberPrice    : "SilliconRubberPrice"    ,
    IsSewing               : "IsSewing"               ,
    IsWelder               : "IsWelder"               ,
    LengthOfWelderForSide  : "LengthOfWelderForSide"     ,
} as const ; 
type PostCartainGetterNames = typeof PostCartainGetterNames[keyof typeof PostCartainGetterNames] ; 


/**
 * 幕仕上げカラム定義
 */
const PostCartainColumnNames = { 
    TypeMKvId              : "TypeMKvId"              ,    
    FinishWayMKvId         : "FinishWayMKvId"         ,
    IsCottonTape           : "IsCottonTape"           ,
    RopeLength             : "RopeLength"             ,
    RopeMemo               : "RopeMemo"               ,
    IsGrommet              : "IsGrommet"              ,
    GrommetMMaterialId     : "GrommetMMaterialId"     ,
    GrommetMMaterial       : "GrommetMMaterial"       ,
    GrommetSpecifyMKvId    : "GrommetSpecifyMKvId"    ,    
    GrommetPitch           : "GrommetPitch"           ,
    GrommetUsageByInputQty : "GrommetUsageByInputQty" ,
    IsMagicTape            : "IsMagicTape"            ,
    MagicTapeNeededMKvId   : "MagicTapeNeededMKvId"   ,
    MagicTapeMMaterialId   : "MagicTapeMMaterialId"   ,
    MagicTapeMMaterial     : "MagicTapeMMaterial"     ,
    MagicTapeLength        : "MagicTapeLength"        ,
    IsSilliconRubber       : "IsSilliconRubber"       ,
    SilliconRubberMMaterialId       : "SilliconRubberMMaterialId"    ,
    SilliconRubberMMaterial         : "SilliconRubberMMaterial"     ,

} as const ; 
type PostCartainColumnNames = typeof PostCartainColumnNames[keyof typeof PostCartainColumnNames] ; 



//#region テンプレート

/**
 * 幕仕上げの辺ごとのカラムテンプレート
 */
export type TypePostCartainTemplate = {         
    /**
     * テンプレート内容　
     */
    [PostCartainColumnNames.TypeMKvId]:TypePostCartainColumnTemplate ;
    [PostCartainColumnNames.FinishWayMKvId]:TypePostCartainColumnTemplate;
    [PostCartainColumnNames.IsCottonTape]:TypePostCartainColumnTemplate;
    // [PostCartainColumnNames.IsRope]:TypePostCartainColumnTemplate;
    [PostCartainColumnNames.RopeLength]:TypePostCartainColumnTemplate;
    [PostCartainColumnNames.RopeMemo]:TypePostCartainColumnTemplate;
    [PostCartainColumnNames.IsGrommet]:TypePostCartainColumnTemplate;
    [PostCartainColumnNames.GrommetMMaterialId]:TypePostCartainColumnTemplate;
    [PostCartainColumnNames.GrommetMMaterial]:TypePostCartainColumnTemplate;
    // [PostCartainColumnNames.GrommetName]:TypePostCartainColumnTemplate;
    [PostCartainColumnNames.GrommetSpecifyMKvId]:TypePostCartainColumnTemplate;
    // [PostCartainColumnNames.IsGrommetSpecifyPitch]:TypePostCartainColumnTemplate;
    // [PostCartainColumnNames.IsGrommetSpecifyQty]:TypePostCartainColumnTemplate;
    [PostCartainColumnNames.GrommetPitch]:TypePostCartainColumnTemplate;
    // [PostCartainColumnNames.GrommetUsageQty]:TypePostCartainColumnTemplate;
    [PostCartainColumnNames.GrommetUsageByInputQty]:TypePostCartainColumnTemplate;
    // [PostCartainColumnNames.GrommetPrice]:TypePostCartainColumnTemplate;
    [PostCartainColumnNames.IsMagicTape]:TypePostCartainColumnTemplate;
    [PostCartainColumnNames.MagicTapeNeededMKvId]:TypePostCartainColumnTemplate;
    [PostCartainColumnNames.MagicTapeMMaterialId]:TypePostCartainColumnTemplate;
    [PostCartainColumnNames.MagicTapeMMaterial]:TypePostCartainColumnTemplate;
    // [PostCartainColumnNames.MagicTapeName]:TypePostCartainColumnTemplate;
    // [PostCartainColumnNames.MagicTapePrice]:TypePostCartainColumnTemplate;
    [PostCartainColumnNames.MagicTapeLength]:TypePostCartainColumnTemplate;
    // [PostCartainColumnNames.MagicTapeTotalLength]:TypePostCartainColumnTemplate;
    [PostCartainColumnNames.IsSilliconRubber]:TypePostCartainColumnTemplate;
    [PostCartainColumnNames.SilliconRubberMMaterialId]:TypePostCartainColumnTemplate;
    [PostCartainColumnNames.SilliconRubberMMaterial]:TypePostCartainColumnTemplate;
    // [PostCartainColumnNames.SilliconRubberName]:TypePostCartainColumnTemplate;
    // [PostCartainColumnNames.SilliconRubberPrice]:TypePostCartainColumnTemplate;
    // [PostCartainColumnNames.IsSewing]:TypePostCartainColumnTemplate;
    // [PostCartainColumnNames.IsWelder]:TypePostCartainColumnTemplate;
    // [PostCartainColumnNames.LengthOfWelderForSide]:TypePostCartainColumnTemplate;
    
}


/**
 * 幕仕上げの辺ごとのカラムテンプレート
 */
export type TypePostCartainColumnTemplate = {         
    /**
     * テンプレート内容　
     * 例："m_kv_id_%no%"
     */
    name:string ;

    /**
     * 開始No
     */
    start:number ;

    /**
     * 増分値
     */
    inc:number ; 

    /**
     * デフォルト値
     */
    default:any ;

    /**
     * isGetSet false:getのみ
     */
    isGetSet:boolean ; 
    
}

/**
 * 幕上げ各辺のカラムテンプレート
 */
const PostCartainColumnTemplates:TypePostCartainTemplate = {
    
    
    [PostCartainColumnNames.TypeMKvId]  : {
        name  : "m_kv_id_%no%" , 
        start : 1 , 
        inc   : 5 , 
        default : null , 
        isGetSet: true ,
    }  ,
    [PostCartainColumnNames.FinishWayMKvId]  : {
        name  : "m_kv_id_%no%" , 
        start : 2 , 
        inc   : 5 , 
        default : null , 
        isGetSet: true ,
    } ,                    
    // [PostCartainColumnNames.SideLength]  : {
    //     name : "tmp_sideLength%no%" ,
    //     start : 1 , 
    //     inc   : 1 , 
    //     default : 0 , 
    //     isGetSet: false ,
    // } ,                                        
    // [PostCartainColumnNames.SideMaterLength]  : {
    //     name : "tmp_sideMaterLength%no%" ,
    //     start : 1 , 
    //     inc   : 1 , 
    //     default : 0 , 
    //     isGetSet: false ,
    // } ,                                        
    [PostCartainColumnNames.IsCottonTape]  : {
        name : "is_%no%" ,
        start : 1 , 
        inc   : 5 , 
        default : false ,  
        isGetSet: true ,
    } ,                
    // [PostCartainColumnNames.IsRope]  : {
    //     name : "tmp_isRope%no%" ,
    //     start : 1 , 
    //     inc   : 1 , 
    //     default : false ,  
    //     isGetSet: false ,
    // } ,
    [PostCartainColumnNames.RopeLength]  : {
        name : "n_%no%" ,
        start : 1 , 
        inc   : 10 ,  
        default : 0 ,  
        isGetSet: true ,
    } ,                
    [PostCartainColumnNames.RopeMemo]  : {
        name : "s_%no%" ,
        start : 1 , 
        inc   : 1 ,  
        default : '' ,  
        isGetSet: true ,
    } ,
    [PostCartainColumnNames.IsGrommet]  : {
        name : "is_%no%" ,
        start : 2 , 
        inc   : 5 ,  
        default : false ,  
        isGetSet: true ,
    } ,
    [PostCartainColumnNames.GrommetMMaterialId]  : {
        name : "m_material_id_%no%" ,
        start : 1 , 
        inc   : 3 ,  
        default : null ,
        isGetSet: true ,  
    } ,                
    [PostCartainColumnNames.GrommetMMaterial]  : {
        name : "_tmp_grommetMMaterial_%no%" ,
        start : 1 , 
        inc   : 1 ,  
        default : null ,
        isGetSet: true ,  
    } ,    
    // [PostCartainColumnNames.GrommetName]  : {
    //     name : "tmp_grommetName%no%" ,
    //     start : 1 , 
    //     inc   : 1 ,  
    //     default : '' ,  
    //     isGetSet: false ,
    // } ,
    [PostCartainColumnNames.GrommetSpecifyMKvId]  : {
        name : "m_kv_id_%no%" ,
        start : 4 , 
        inc   : 5 ,
        default : null ,
        isGetSet: true ,    
    } ,
    // [PostCartainColumnNames.IsGrommetSpecifyPitch]  : {
    //     name : "tmp_isGrommetSpcecifyPitch%no%" ,
    //     start : 1 , 
    //     inc   : 1 ,  
    //     default : false ,
    //     isGetSet: false ,  
    // } ,
    // [PostCartainColumnNames.IsGrommetSpecifyQty]  : {
    //     name : "tmp_isGrommetSpcecifyQty%no%" ,
    //     start : 1 , 
    //     inc   : 1 ,  
    //     default : false ,
    //     isGetSet: false ,  
    // } ,
    [PostCartainColumnNames.GrommetPitch]  : {
        name : "n_%no%" ,
        start : 2 , 
        inc   : 10 ,  
        default : 0 ,  
        isGetSet: true ,
    } ,
    // [PostCartainColumnNames.GrommetUsageQty]  : {
    //     name : "n_%no%" ,
    //     start : 3 , 
    //     inc   : 10 ,  
    //     default : 0 ,  
    //     isGetSet: true ,
    // } ,
    [PostCartainColumnNames.GrommetUsageByInputQty]  : {
        name : "n_%no%" ,
        start : 5 , 
        inc   : 10 ,  
        default : 0 ,  
        isGetSet: true ,
    } ,
    // [PostCartainColumnNames.GrommetPrice]  : {
    //     name : "tmp_grommetPrice%no%" ,
    //     start : 1 , 
    //     inc   : 1 ,
    //     default : 0 ,   
    //     isGetSet: false , 
    // } ,
    [PostCartainColumnNames.IsMagicTape]  : {
        name : "is_%no%" ,
        start : 3 , 
        inc   : 5 ,
        default : false ,    
        isGetSet: true ,
    } ,
    [PostCartainColumnNames.MagicTapeNeededMKvId]  : {
        name : "m_kv_id_%no%" ,
        start : 3 , 
        inc   : 5 ,  
        default : null ,  
        isGetSet: true ,
    } ,
    [PostCartainColumnNames.MagicTapeMMaterialId]  : {
        name : "m_material_id_%no%" ,
        start : 2 , 
        inc   : 3 ,  
        default : null ,  
        isGetSet: true ,
    } ,                
    [PostCartainColumnNames.MagicTapeMMaterial]  : {
        name : "_tmp_magicTapeMMaterial_%no%" ,
        start : 1 , 
        inc   : 1 ,  
        default : null ,
        isGetSet: true ,  
    } ,    
    // [PostCartainColumnNames.MagicTapeName]  : {
    //     name : "tmp_mtName%no%" ,
    //     start : 1 , 
    //     inc   : 1 ,  
    //     default : '' ,  
    //     isGetSet: false ,
    // } ,       
    // [PostCartainColumnNames.MagicTapePrice]  : {
    //     name : "tmp_mtPrice%no%" ,
    //     start : 1 , 
    //     inc   : 1 ,
    //     default : 0 ,    
    //     isGetSet: false ,
    // } ,           
    [PostCartainColumnNames.MagicTapeLength]  : {
        name : "n_%no%" ,
        start : 4 , 
        inc   : 10 ,  
        default : 0 , 
        isGetSet: true , 
    } ,
    // [PostCartainColumnNames.MagicTapeTotalLength]  : {
    //     name : "tmp_mtTotalLength%no%" ,
    //     start : 1 , 
    //     inc   : 1 ,
    //     default : 0 ,    
    //     isGetSet: false ,
    // } ,
    
    [PostCartainColumnNames.IsSilliconRubber]  : {
        name : "is_%no%" ,
        start : 4 , 
        inc   : 5 ,
        default : false ,    
        isGetSet: true ,
    } ,
    [PostCartainColumnNames.SilliconRubberMMaterialId]  : {
        name : "m_material_id_%no%" ,
        start : 3 , 
        inc   : 3 ,  
        default : null ,
        isGetSet: true ,  
    } ,        
    [PostCartainColumnNames.SilliconRubberMMaterial]  : {
        name : "_tmp_silliconRubberMMaterial_%no%" ,
        start : 1 , 
        inc   : 1 ,  
        default : null ,
        isGetSet: true ,  
    } ,    

    // [PostCartainColumnNames.SilliconRubberName]  : {
    //     name : "tmp_silliconRubberName%no%" ,
    //     start : 1 , 
    //     inc   : 1 ,  
    //     default : '' ,  
    //     isGetSet: false ,
    // } ,                       
    // [PostCartainColumnNames.SilliconRubberPrice]  : {
    //     name : "tmp_silliconRubberPrice%no%" ,
    //     start : 1 , 
    //     inc   : 1 ,
    //     default : 0 ,    
    //     isGetSet: false ,
    // } ,       
    // [PostCartainColumnNames.IsSewing]  : {
    //     name : "tmp_isSewing%no%" ,
    //     start : 1 , 
    //     inc   : 1 ,
    //     default : false ,
    //     isGetSet: false ,    
    // } ,       
    // [PostCartainColumnNames.IsWelder]  : {
    //     name : "tmp_isWelder%no%" ,
    //     start : 1 , 
    //     inc   : 1 ,  
    //     default : false ,  
    //     isGetSet: false ,
    // } ,       
    // [PostCartainColumnNames.LengthOfWelderForSide]  : {
    //     name : "tmp_lengthOfWelder4Side%no%" ,
    //     start : 1 , 
    //     inc   : 1 ,  
    //     default : 0 ,  
    //     isGetSet: false ,
    // } ,       


} as const ; 


//#endregion


//#region  カラム


/**
 * 幕仕上げの辺ごとのカラム名定義のベース
 */
export type TypePostCartainColumnDef = {
    [PostCartainEdges.All]:TypePostCartainColumnNameDef , 
    [PostCartainEdges.Tb]:TypePostCartainColumnNameDef , 
    [PostCartainEdges.Lr]:TypePostCartainColumnNameDef , 
    [PostCartainEdges.T]:TypePostCartainColumnNameDef , 
    [PostCartainEdges.B]:TypePostCartainColumnNameDef , 
    [PostCartainEdges.L]:TypePostCartainColumnNameDef , 
    [PostCartainEdges.R]:TypePostCartainColumnNameDef , 

}

/**
 * 幕仕上げの辺ごとのカラム名定義詳細
 */
 export type TypePostCartainColumnNameDef = {         
    /**
     * カラム名内容　
     */
    [PostCartainColumnNames.TypeMKvId]:string ;
    [PostCartainColumnNames.FinishWayMKvId]:string;
    // [PostCartainColumnNames.SideLength]:string;
    // [PostCartainColumnNames.SideMaterLength]:string;
    [PostCartainColumnNames.IsCottonTape]:string;
    // [PostCartainColumnNames.IsRope]:string;
    [PostCartainColumnNames.RopeLength]:string;
    [PostCartainColumnNames.RopeMemo]:string;
    [PostCartainColumnNames.IsGrommet]:string;
    [PostCartainColumnNames.GrommetMMaterialId]:string;
    [PostCartainColumnNames.GrommetMMaterial]:string;
    
    // [PostCartainColumnNames.GrommetName]:string;
    [PostCartainColumnNames.GrommetSpecifyMKvId]:string;
    // [PostCartainColumnNames.IsGrommetSpecifyPitch]:string;
    // [PostCartainColumnNames.IsGrommetSpecifyQty]:string;
    [PostCartainColumnNames.GrommetPitch]:string;
    // [PostCartainColumnNames.GrommetUsageQty]:string;
    [PostCartainColumnNames.GrommetUsageByInputQty]:string;
    // [PostCartainColumnNames.GrommetPrice]:string;
    [PostCartainColumnNames.IsMagicTape]:string;
    [PostCartainColumnNames.MagicTapeNeededMKvId]:string;
    [PostCartainColumnNames.MagicTapeMMaterialId]:string;
    [PostCartainColumnNames.MagicTapeMMaterial]:string;
    // [PostCartainColumnNames.MagicTapeName]:string;
    // [PostCartainColumnNames.MagicTapePrice]:string;
    [PostCartainColumnNames.MagicTapeLength]:string;
    // [PostCartainColumnNames.MagicTapeTotalLength]:string;
    [PostCartainColumnNames.IsSilliconRubber]:string;
    [PostCartainColumnNames.SilliconRubberMMaterialId]:string;
    [PostCartainColumnNames.SilliconRubberMMaterial]:string;
    // [PostCartainColumnNames.SilliconRubberName]:string;
    // [PostCartainColumnNames.SilliconRubberPrice]:string;
    // [PostCartainColumnNames.IsSewing]:string;
    // [PostCartainColumnNames.IsWelder]:string;
    // [PostCartainColumnNames.LengthOfWelderForSide]:string;
    
}


/**
 * 初期カラム設定生成
 */
const generateColumnDefs = ():TypePostCartainColumnDef => { 
    
    type KeyValueNoMap = {
        [key in PostCartainEdges]: number;
    };
    
    const noMap:KeyValueNoMap = {
        [PostCartainEdges.All]    : 0 , 
        [PostCartainEdges.Tb]     : 1 , 
        [PostCartainEdges.Lr]     : 2 , 
        [PostCartainEdges.T]      : 3 , 
        [PostCartainEdges.B]      : 4 , 
        [PostCartainEdges.L]      : 5 , 
        [PostCartainEdges.R]      : 6 ,                 
    } ; 
    

    // @ts-ignore
    let dColumns:TypePostCartainColumnDef = {} ; 

    // 辺Loop
    Object.entries(noMap).forEach(([sideKey, sideNo]) => { 
        // @ts-ignore
        dColumns[sideKey] = {} ; 

        Object.entries(PostCartainColumnTemplates).forEach(([colKey, colData]) => { 
            // console.log(colData) ; 

            const startNo   = colData.start ;  
            const incNo     = colData.inc   ;  

            // 置換用のNo取得
            const replaceNo = startNo + ( incNo * sideNo ) ; 
            //console.log(` ${sideKey} - ${colKey} - ${sideNo} rep:${replaceNo}`) ; 
            const colNo:string = NumberUtil.formatZeroPadding(replaceNo,2  ) ; 
            
            // カラム名置換
            const templateCName = colData.name  ;                      
            const cName = templateCName.replace("%no%" , colNo) ; 
            
            // @ts-ignore
            dColumns[sideKey][colKey] = cName ;                


        }) ; 

    });    

    return dColumns ; 
}

/**
 * 幕仕上げのカラム名設定
 */
const PostCartainEdgeColumnDefs = generateColumnDefs() ; 


//#endregion

/**
 * Type各辺の辺の数
 */
export type TypePostCartainNumOfSides = {         
    /**
     * 
     */
    [PostCartainEdges.All]:number ;
    [PostCartainEdges.Tb]:number ;
    [PostCartainEdges.Lr]:number ;
    [PostCartainEdges.T]:number ;
    [PostCartainEdges.B]:number ;
    [PostCartainEdges.L]:number ;
    [PostCartainEdges.R]:number ;

}

/**
 * 各辺の辺の数
 */
 const PostCartainNumOfSides:TypePostCartainNumOfSides = {
    [PostCartainEdges.All]  : 4,
    [PostCartainEdges.Tb]:2 ,
    [PostCartainEdges.Lr]:2 ,
    [PostCartainEdges.T]:1 ,
    [PostCartainEdges.B]:1 ,
    [PostCartainEdges.L]:1 ,
    [PostCartainEdges.R]:1 ,
} as const ; 



export  {
    PostCartainEdges ,
    PostCartainColumnNames, 
    PostCartainGetterNames , 
    PostCartainColumnTemplates ,
    PostCartainEdgeColumnDefs ,
    PostCartainNumOfSides
} ; 
