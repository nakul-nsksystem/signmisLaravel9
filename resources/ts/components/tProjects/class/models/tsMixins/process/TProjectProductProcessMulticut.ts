import _ from "lodash";
import NumberUtil from "../../../../../../frameworks/NumberUtil";
import { TProjectProductProcess } from "../../TProjectProductProcess";
import { TProjectProductProcessProductions } from "../TProjectProductProcessProductions";


export class TProjectProductProcessMulticut {
    

    // 型判別用
    get IsTProjectProductProcessMulticut():boolean{
        return true ; 
    }

    /**
     * 難易度
     */
    n_01:number = 1 ; 
    get LevelOfDifficulty ():number { return this.n_01; }
    set LevelOfDifficulty (v:number ){ this.n_01 = v ; }

    /**
     * 加工mm数
     */
    n_02:number = 0 ; 
    get ProcessLength ():number { 

        // 四角の場合は外周を入れる        
        if ( this.IsRectangle){
            if (TProjectProductProcess.is(this)){          
                if (! _.isNil(this.TProjectProduct)){
                    if ( this.TProjectProduct.Perimeter !== this.n_02){
                        this.ProcessLength =  this.TProjectProduct.Perimeter ;                       
                    }
                    // this.ProcessLength =  this.TProjectProduct.Perimeter ;
                }
            }
        }
        

        return this.n_02; 
    
    }
    set ProcessLength (v:number ){ 
        this.n_02 = v ; 

        if (TProjectProductProcess.is(this)){          
            if (! _.isNil(this.TProjectProduct)){
                this.process_mater =  NumberUtil.invalid2zr(v) * 0.001 ;   
                this.total_process_mater = NumberUtil.invalid2zr(this.process_mater * this.TProjectProduct.Qty) ; 
            }
        }
    }
 
    /**
     * Is四角カット
     */
    is_02:boolean = false ; 
    get IsRectangle ():boolean { return Boolean(this.is_02 ) ; }
    set IsRectangle (v:boolean ){ 
        this.is_02 = v ;         
    }  
 
    /**
     * Modeカット回数
     */
    get ProductionModeNumOfCut():number {
        let val = 0 ; 
        if (TProjectProductProcessProductions.is(this)){       
            if( this.MProductionMode01 !== undefined ) {
                val = this.MProductionMode01.n_01 ?? 0 ; 
            }
        }
        return val ; 
    }

    /**
     * Is原寸原稿
     */
    is_01:boolean = false ; 
    get IsOrgCopy ():boolean { return this.is_01; }
    set IsOrgCopy (v:boolean ){ this.is_01 = v ; }  
    
    /**
     * 原寸原稿 W
     */
    n_06:number = 0 ; 
    get OrgSizeW ():number { return this.n_06; }
    set OrgSizeW (v:number ){ this.n_06 = v ; }    

    /**
     * 原寸原稿 H
     */
    n_07:number = 0 ; 
    get OrgSizeH ():number { return this.n_07; }
    set OrgSizeH (v:number ){ this.n_07 = v ; }  
    
    
    /**
     * 原寸原稿 ㎡数
     */
    n_08:number = 0 ; 
    get OrgSqm ():number { 
        let sqm = this.OrgSizeW * this.OrgSizeH  ; 
        sqm = NumberUtil.invalid2zr(sqm * 0.001 * 0.001 ) ; 
        
        this.n_08 = sqm ; 
        return this.n_08; 
    }
    
     
     


    public static Init(p:TProjectProductProcessMulticut){        
        if (TProjectProductProcess.is(p)){            
            if (! _.isNil(p.TProjectProduct) && ! _.isNil(p.Store)){
                
                
            }
        
        }

    }
    
    public static is(arg:any):arg is TProjectProductProcessMulticut { 
        if ( arg?.IsTProjectProductProcessMulticut === undefined) return false ; 
        return arg.IsTProjectProductProcessMulticut ; 
    } 
    

}


