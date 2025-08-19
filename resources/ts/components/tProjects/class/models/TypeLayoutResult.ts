import _ from "lodash";
import ObjectUtil from "../../../../frameworks/ObjectUtil";

/**
 * TProduction , TProductionDay , TProductionGroupで使用する仮想クラス
 */
export type TypeLayout = {         
    index:number ; 
    rectW:number ; 
    rectH:number ; 
    sqm:number  ; 
    rotate:number  ; 
    result:TypeLayoutResult ; 
    isSuccess:boolean ; 

}

export type TypeLayoutResult = {         
    w:number ; 
    h:number ; 
    numOfCols:number ; 
    colPositions:Array<number> ; 
    
    len:number ; 
    numOfRows:number ; 
    numOfRolls:number ; 
    lossWPer:number ; 
    lossPer:number ; 
    sheetFeedLen:number ; 
    sheetSqm:number ; 
    belowNumOfRows:number ; 
    belowRemainPer:number ; 
    
}



