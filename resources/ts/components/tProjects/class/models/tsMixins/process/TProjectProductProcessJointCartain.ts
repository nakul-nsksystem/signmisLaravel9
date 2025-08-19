import _ from "lodash";
import MKvsConst from "../../../../../../consts/MKvsConst";
import MMatrixConst from "../../../../../../consts/MMatrixConst";
import { TypeSize } from "../../../../../../types/TypeSize";
import {  TypeSeparatedRect } from "../../TProjectProduct";
import { TProjectProductProcess } from "../../TProjectProductProcess";
import { TProjectProductProcessProductions } from "../TProjectProductProcessProductions";


export class TProjectProductProcessJointCartain {
    

    // 型判別用
    get IsTProjectProductProcessJointCartain():boolean{
        return true ; 
    }




    /**
     * パテのカテゴリMkvId
     */
    get SubCatPateMKvId():number {
        return MKvsConst.MMaterials.SubCategory.PATE  ; 
    } 

    /**
     * ウェルダー回数/箇所
     */
    get TotalNumOfWelderPerQty ():number 
    {
        return this.NumOfWelder * this.NumOfJointPerQty ; 
    } 

    get Bridge_SeparatedRects():TypeSeparatedRect[] {
        
        if (TProjectProductProcess.is(this)){            
            if (! _.isNil(this.TProjectProduct) ){
                return this.TProjectProduct.SeparatedSheets ?? []; 
            }
        }
        return [] ; 

    }

    /**
     * 総ウェルダーmm数/枚(個)   
     */
    n_01:number = 0 ; 
    get TotalLengthOfWelderPerQty ():number {         
        const val = this.TotalNumOfWelderPerQty * this.WelderLength  ; 
        this.n_01 = val ; 
        return this.n_01; 

    }

    /**
     * 継ぎmm数/箇所
     */
    n_02:number = 0 ; 
    get JointLengthPerUnit ():number {         
        
        let val = 0 ; 
        const separatedRects = this.Bridge_SeparatedRects ;         
        if (! _.isNil( separatedRects)  && separatedRects.length > 1 ) {
            if (TProjectProductProcess.is(this) && ! _.isNil(this.TProjectProduct)){                           
                val = separatedRects[0].w ; 
                if ( separatedRects[0].w < this.TProjectProduct.SizeIncExtW ) val = separatedRects[0].h ;
            }
        }

        this.n_02 = val ; 
        return this.n_02; 
 
    }
 
    /**
     * 継ぎmm数/箇所
     */
    n_03:number = 1 ; 
    get JointLengthPerQty ():number {         
        const val = this.JointLengthPerUnit * this.NumOfJointPerQty ; 
        this.n_03 = val ; 
        return this.n_03; 
  
    }
  
     
 
    /**
     * 継ぎ回数/個
     */
    n_04:number = 0 ; 
    get NumOfJointPerQty ():number {
        let val = 0 ;                 
        const separatedRects = this.Bridge_SeparatedRects ; 
        
        if ( ! _.isNil(separatedRects) && separatedRects.length > 1 ) {
            val = separatedRects.length - 1 ; 
        }        
        
        this.n_04 = val ; 
        return this.n_04; 

    }


    /**
     * 選択されたテープの単価
     */
    n_10:number = 0 ; 
    get TapeCost ():number { 
        let val = 0 ; 
        if (TProjectProductProcess.is(this)){            
            val = this.MaterialCost01  ; 
        }
        
        this.n_10 = val ; 
        return this.n_10; 
    }



    /**
     * テープ必要量/箇所
     */
    n_11:number = 0 ; 
    get UseTapeLengthPerUnit ():number { 
        let val = 0 ; 
        
        if ( this.JointLengthPerUnit  !== 0 ){
            // @ts-ignore 
            const res = this.Store.masters.getMtx(this.m_branch_id ,MMatrixConst.C_JOINT_CARTAIN_TAPE_EXTENSION ,"1") ;         

            const extensionLength = Number(res?.val1 ?? 0 )  ; 
            const extendedLength = (extensionLength + this.JointLengthPerUnit) * 0.001 ; 
            val = extendedLength ; 

        }
        this.n_11 = val ; 
        return this.n_11; 
    }

    
    /**
     * テープ必要量 / 枚
     */
    n_12:number = 0 ; 
    get UseTapeLengthPerQty ():number { 
        let val = this.UseTapeLengthPerUnit * this.NumOfJointPerQty ;  ; 
        
        this.n_12 = val ; 
        return this.n_12; 
    }
 
    /**
     * ウェルダー長さ
     */
    get WelderLength ():number { 
        let val = 0 ; 
        if (TProjectProductProcessProductions.is(this)){            
            val = Number(this.MProduction01?.val1 ?? "0" ) ; 
        }
        return val; 
    }
    
    /**
     * ウェルダーが必要な回数
     */
     get NumOfWelder ():number { 
        let val = 0 ; 
        if ( this.JointLengthPerUnit === undefined || this.JointLengthPerUnit <= 1 ) return 0 ; 
        if ( this.WelderLength === undefined || this.WelderLength === 0 ) return 0 ; 

        return Math.ceil( this.JointLengthPerUnit / this.WelderLength )  ; 
        
    }
 
    public static Init(p:TProjectProductProcessJointCartain){        
        if (TProjectProductProcess.is(p)){            
            if (! _.isNil(p.TProjectProduct) && ! _.isNil(p.Store)){
                
                
            }
        
        }

    }
    
    public static is(arg:any):arg is TProjectProductProcessJointCartain { 
        if ( arg?.IsTProjectProductProcessJointCartain === undefined) return false ; 
        return arg.IsTProjectProductProcessJointCartain ; 
    } 
    

}


