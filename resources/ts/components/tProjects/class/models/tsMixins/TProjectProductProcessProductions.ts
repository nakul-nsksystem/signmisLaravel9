import _ from "lodash";
import { MProduction } from "../../../../masters/class/models/MProduction";
import { MProductionMode } from "../../../../masters/class/models/MProductionMode";
import { MProductionOption } from "../../../../masters/class/models/MProductionOption";
import { TProjectProductProcess } from "../TProjectProductProcess";

export class TProjectProductProcessProductions {
    _store?:object ; 

    // m_production_id_01?:number = 0;
    // m_production_mode_id_01?:number = 0;
    // m_production_option_id_01?:number = 0 ;
    
    // m_production_id_02?:number = 0 ;
    // m_production_mode_id_02?:number = 0 ;
    // m_production_option_id_02?:number = 0 ;

    // m_production_id_03?:number = 0 ;
    // m_production_mode_id_03?:number = 0 ;
    // m_production_option_id_03?:number = 0 ;

    // m_production_id_04?:number = 0 ;
    // m_production_mode_id_04?:number = 0 ;
    // m_production_option_id_04?:number = 0 ;

    public get IsTProjectProductProcessProductions():boolean{
        return true ; 
    }

    // #region Methods

    /**
     * 生産先取得
     * @param no 
     * @returns 
     */
    public getSelectedMProduction(no:number):MProduction|undefined {
        
        if ( _.isNil(this._store) ) return undefined ; 
        let id = 0 ;             
        // const name = "m$cMProductionId0" + no ; 
        // console.log(`name ${name}`) ; 
        const name = "m_production_id_0" + no ; 

        // @ts-ignore
        id = this[name] ; 
        if (id === undefined || id === 0 ) return undefined ; 

        // @ts-ignore
        let data = this._store.masters.MProductions.find(e => e.id == id) ;
        return data ; 
    } 

    /**
     * 生産先の名称
     * @param no 
     * @returns 
     */
    public getSelectedMProductionName(no:number):string  {
        const selected = this.getSelectedMProduction(no) ; 
        if ( selected === undefined )  return "" ; 

        return selected.name ?? "" ; 
    } 

    /**
     * 生産先の準備秒数　を取得
     * @param no 
     * @returns 
     */
    public getSelectedMProductionPrepareSec(no:number):number  {
        const selected = this.getSelectedMProduction(no) ; 
        if ( selected === undefined )  return 0 ; 

        return selected.prepare_sec ?? 0 ; 
    } 
    
    /**
     * 生産先のコスト/時　を取得
     * @param no 
     * @returns 
     */
    public getSelectedMProductionCostPerHour(no:number|undefined|null):number  {
        const selected = this.getSelectedMProduction(no ?? 0 ) ; 
        if ( selected === undefined )  return 0 ; 

        return selected.cost_per_hour ?? 0 ; 
    } 

    
    /**
     * 選択されている生産先の速度( モードとオプションから )
     * @param no 
     * @returns 
     */
    public getSelectedMProductionSpeed(no:number|undefined|null):number  {
        const speed = this.getSelectedMProductionModeSpeedPerHour(no) * 
                        this.getSelectedMProductionOptionSpeedRate(no) ; 

        return speed ; 

    } 
    
    /**
     * 生産先モードの準備秒数　を取得
     * @param no 
     * @returns 
     */
     public getSelectedMProductionModePrepareSecPerJob(no:number|undefined|null):number  {
        const selected = this.getSelectedMProductionMode(no ?? 0) ; 
        if ( selected === undefined )  return 0 ; 

        return selected.prepare_sec_per_job ?? 0 ;     
    } 

    /**
     * 生産先モードの速度 を取得
     * @param no 
     * @returns 
     */
    public getSelectedMProductionModeSpeedPerHour(no:number|undefined|null):number  {
        const selected = this.getSelectedMProductionMode(no ?? 0) ; 
        if ( selected === undefined )  return 0 ; 

        return selected.speed_per_hour ?? 0 ;     
    } 
    
    
    /**
     * 生産先オプションの速度レート を取得
     * @param no 
     * @returns 
     */
     public getSelectedMProductionOptionSpeedRate(no:number|undefined|null):number  {
        const selected = this.getSelectedMProductionOption(no ?? 0) ; 
        if ( selected === undefined )  return 1 ; 

        return selected.speed_rate ?? 1 ;     
    } 
    
    
    


    /**
     * モード取得
     * @param no 
     * @returns 
     */
    public getSelectedMProductionMode(no:number|undefined|null):MProductionMode|undefined {
        if ( _.isNil(this._store) ) return undefined ; 
        let id = 0 ; 
        const selectedMProduction = this.getSelectedMProduction(no ?? 0) ; 
        if ( selectedMProduction === undefined) return undefined ; 

        const name = "m_production_mode_id_0" + no ; 

        // @ts-ignore
        id = this[name] ; 
        if (id === undefined || id === 0 ) return undefined ; 

        // @ts-ignore
        const data = selectedMProduction.m_production_modes.find(x => x.id == id) ; 
        return data ; 
    } 

    public getSelectedMProductionOption(no:number):MProductionOption|undefined {
        if ( _.isNil(this._store) ) return undefined ; 
        let id = 0 ; 
        const selectedMProduction = this.getSelectedMProduction(no) ; 
        if ( selectedMProduction === undefined) return undefined ; 

        const name = "m_production_option_id_0" + no ; 

        // @ts-ignore
        id = this[name] ; 
        if (id === undefined || id === 0 ) return undefined ; 

        // @ts-ignore
        const data = selectedMProduction.m_production_options.find(x => x.id == id) ; 
        return data ; 
    } 
    

    public setMProductionId(no:number ,v:number){
        const cName = `m_production_id_0${no}` ; 
        // @ts-ignore
        if (this[cName] != v ){
            // @ts-ignore
            this[cName] = v ; 
            // @ts-ignore
            this[`m_production_mode_id_0${no}`] = null ;             
            // @ts-ignore
            this[`m_production_option_id_0${no}`] = null ; 
        }
        
        
    }

    /**
     * モードのIDセット
     * @param no 
     * @param v 
     */
    public setMProductionModeId(no:number ,v:number){
        const cName = `m_production_mode_id_0${no}` ; 
        // @ts-ignore
        if (this[cName] != v ){
            // @ts-ignore
            this[cName] = v ;         
        }
    }

    

    /**
     * オプションのIDセット
     * @param no 
     * @param v 
     */
     public setMProductionOptionId(no:number ,v:number){
        const cName = `m_production_option_id_0${no}` ; 
        // @ts-ignore
        if (this[cName] != v ){
            // @ts-ignore
            this[cName] = v ;         
        }
        
        
    }

    //#endregion


    /**
     * 外注先MProductionId
     */
    outsource_m_production_id?:number = undefined ; 
    get OutsourceMProductionId():number|undefined { return this.outsource_m_production_id; } 
    set OutsourceMProductionId(v:number|undefined) { 
        this.outsource_m_production_id = v ; 
        this.OutsourceMProduction ;
    } 

    /**
     * 外注先
     */
    public get OutsourceMProduction():MProduction|undefined { 
        // @ts-ignore
        let found = this._store.masters.MProductions.find(x => x.id == this.outsource_m_production_id) ;        

        if ( TProjectProductProcess.is(this)){
            this.SupplierMCustomerId = found?.m_customer_id ?? 0 ;              
            this.SupplierMCustomer = found?.m_customer  ; 
            
        }

        return found ; 
    } 
    
    /**
     * 外注先名
     */
    public get OutsourceMProductionName():string { 
        // @ts-ignore
        return this.OutsourceMProduction?.name ?? "" ; 
    } 

    
    // #region *******  生産先01  */ 

    /**
     * 生産先ID 01
     */
    public set MProductionId01(v:number){
        this.setMProductionId(1 , v ) ;         
    }
    public get MProductionId01():number{
        if (! TProjectProductProcess.is(this)) return 0 ; 
        return this.m_production_id_01 ?? 0; 
    }
   
    /**
     * 生産先 01
     */
    public get MProduction01():MProduction|undefined { 
        const found = this.getSelectedMProduction(1) ;   
        // console.log("MProduction01 :" + found?.name) ; 
        return found ; 
    }         
    
    /**
     * 生産先の名称 01
     */
    public get MProductionName01():string{ 
        return this.MProduction01?.name ?? "" ;  
    }

    /**
     * 生産先のコスト/h 01
     */
    public get MProductionCostPerHour01():number{ 
        return this.MProduction01?.cost_per_hour ?? 0 ;  
    }

    /**
     * 生産先の準備秒数 01
     */
    public get MProductionPrepareSec01():number{ 
        return this.MProduction01?.prepare_sec ?? 0 ;  
    }

    /**
     * 生産先モードID 01
     */
    public set MProductionModeId01(v:number){
        this.setMProductionModeId(1 , v ) ;         
    }
    public get MProductionModeId01():number{
        if (! TProjectProductProcess.is(this)) return 0 ; 
        return this.m_production_mode_id_01 ?? 0; 
    }
   
    /**
     * 生産先モード 01
     */
    public get MProductionMode01():MProductionMode|undefined { 
        const found = this.getSelectedMProductionMode(1) ; 
        return found ; 
    }

    /**
     * 生産先モード名 01
     */
    public get MProductionModeName01():string{ 
        return this.MProductionMode01?.name ?? "" ;  
    }

    
    /**
     * 生産先モード 準備秒数
     */
    public get MProductionModePrepareSec01():number{ 
        return this.MProductionMode01?.prepare_sec_per_qty ?? 0 ;
    }

    /**
     * 生産先モード 速度/h
     */
    public get MProductionModeSpeedPerHour01():number{ 
        return this.MProductionMode01?.speed_per_hour ?? 0 ;
    }

    
    /**
     * 生産先オプションID 01
     */
     public set MProductionOptionId01(v:number){
        this.setMProductionOptionId(1 , v ) ;         
    }
    public get MProductionOptionId01():number{
        if (! TProjectProductProcess.is(this)) return 0 ; 
        return this.m_production_option_id_01 ?? 0; 
    }


    /**
     * 生産先オプション 01
     */
    public get MProductionOption01():MProductionOption|undefined { 
        const found = this.getSelectedMProductionOption(1) ; 
        return found ; 

    }
    /**
     * 生産先オプション名 01
     */
     public get MProductionOptionName01():string{ 
        return this.MProductionOption01?.name ?? "" ;  
    }

    //#endregion

    // #region *******  生産先02  */

    /**
     * 生産先ID 02
     */
     public set MProductionId02(v:number){
        this.setMProductionId(2 , v ) ;         
    }
    public get MProductionId02():number{
        if (! TProjectProductProcess.is(this)) return 0 ; 
        return this.m_production_id_02 ?? 0; 
    }
   
    /**
     * 生産先 02
     */
    public get MProduction02():MProduction|undefined { 
        const found = this.getSelectedMProduction(2) ;   
        return found ; 
    }         
    
    /**
     * 生産先の名称 02
     */
    public get MProductionName02():string{ 
        return this.MProduction02?.name ?? "" ;  
    }

    /**
     * 生産先のコスト/h 02
     */
    public get MProductionCostPerHour02():number{ 
        return this.MProduction02?.cost_per_hour ?? 0 ;  
    }

    /**
     * 生産先の準備秒数 02
     */
    public get MProductionPrepareSec02():number{ 
        return this.MProduction02?.prepare_sec ?? 0 ;  
    }

    /**
     * 生産先モードID 02
     */
    public set MProductionModeId02(v:number){
        this.setMProductionModeId(2 , v ) ;         
    }
    public get MProductionModeId02():number{
        if (! TProjectProductProcess.is(this)) return 0 ; 
        return this.m_production_mode_id_02 ?? 0; 
    }
   
    /**
     * 生産先モード 02
     */
    public get MProductionMode02():MProductionMode|undefined { 
        const found = this.getSelectedMProductionMode(2) ; 
        return found ; 
    }

    /**
     * 生産先モード名 02
     */
    public get MProductionModeName02():string{ 
        return this.MProductionMode02?.name ?? "" ;  
    }

    
    /**
     * 生産先モード 準備秒数 02
     */
    public get MProductionModePrepareSec02():number{ 
        return this.MProductionMode02?.prepare_sec_per_qty ?? 0 ;
    }

    /**
     * 生産先モード 速度/h 02
     */
    public get MProductionModeSpeedPerHour02():number{ 
        return this.MProductionMode02?.speed_per_hour ?? 0 ;
    }

    
    /**
     * 生産先オプションID 02
     */
     public set MProductionOptionId02(v:number){
        this.setMProductionOptionId(2 , v ) ;         
    }
    public get MProductionOptionId02():number{
        if (! TProjectProductProcess.is(this)) return 0 ; 
        return this.m_production_option_id_02 ?? 0; 
    }


    /**
     * 生産先オプション 02
     */
    public get MProductionOption02():MProductionOption|undefined { 
        const found = this.getSelectedMProductionOption(2) ; 
        return found ; 

    }
    /**
     * 生産先オプション名 02
     */
     public get MProductionOptionName02():string{ 
        return this.MProductionOption02?.name ?? "" ;  
    }

    //#endregion

    // #region *******  生産先03  */

    /**
     * 生産先ID 03
     */
     public set MProductionId03(v:number){
        this.setMProductionId(3 , v ) ;         
    }
    public get MProductionId03():number{
        if (! TProjectProductProcess.is(this)) return 0 ; 
        return this.m_production_id_03 ?? 0; 
    }
   
    /**
     * 生産先 03
     */
    public get MProduction03():MProduction|undefined { 
        const found = this.getSelectedMProduction(3) ;   
        return found ; 
    }         
    
    /**
     * 生産先の名称 03
     */
    public get MProductionName03():string{ 
        return this.MProduction03?.name ?? "" ;  
    }

    /**
     * 生産先のコスト/h 03
     */
    public get MProductionCostPerHour03():number{ 
        return this.MProduction03?.cost_per_hour ?? 0 ;  
    }

    /**
     * 生産先の準備秒数 03
     */
    public get MProductionPrepareSec03():number{ 
        return this.MProduction03?.prepare_sec ?? 0 ;  
    }

    /**
     * 生産先モードID 03
     */
    public set MProductionModeId03(v:number){
        this.setMProductionModeId(3 , v ) ;         
    }
    public get MProductionModeId03():number{
        if (! TProjectProductProcess.is(this)) return 0 ; 
        return this.m_production_mode_id_03 ?? 0; 
    }
   
    /**
     * 生産先モード 03
     */
    public get MProductionMode03():MProductionMode|undefined { 
        const found = this.getSelectedMProductionMode(3) ; 
        return found ; 
    }

    /**
     * 生産先モード名 03
     */
    public get MProductionModeName03():string{ 
        return this.MProductionMode03?.name ?? "" ;  
    }

    
    /**
     * 生産先モード 準備秒数 03
     */
    public get MProductionModePrepareSec03():number{ 
        return this.MProductionMode03?.prepare_sec_per_qty ?? 0 ;
    }

    /**
     * 生産先モード 速度/h 03
     */
    public get MProductionModeSpeedPerHour03():number{ 
        return this.MProductionMode03?.speed_per_hour ?? 0 ;
    }

    
    /**
     * 生産先オプションID 03
     */
     public set MProductionOptionId03(v:number){
        this.setMProductionOptionId(3 , v ) ;         
    }
    public get MProductionOptionId03():number{
        if (! TProjectProductProcess.is(this)) return 0 ; 
        return this.m_production_option_id_03 ?? 0; 
    }


    /**
     * 生産先オプション 03
     */
    public get MProductionOption03():MProductionOption|undefined { 
        const found = this.getSelectedMProductionOption(3) ; 
        return found ; 

    }
    /**
     * 生産先オプション名 03
     */
     public get MProductionOptionName03():string{ 
        return this.MProductionOption03?.name ?? "" ;  
    }

    //#endregion

    // #region *******  生産先04  */

    /**
     * 生産先ID 04
     */
     public set MProductionId04(v:number){
        this.setMProductionId(4 , v ) ;         
    }
    public get MProductionId04():number{
        if (! TProjectProductProcess.is(this)) return 0 ; 
        return this.m_production_id_04 ?? 0; 
    }
   
    /**
     * 生産先 04
     */
    public get MProduction04():MProduction|undefined { 
        const found = this.getSelectedMProduction(4) ;   
        return found ; 
    }         
    
    /**
     * 生産先の名称 04
     */
    public get MProductionName04():string{ 
        return this.MProduction04?.name ?? "" ;  
    }

    /**
     * 生産先のコスト/h 04
     */
    public get MProductionCostPerHour04():number{ 
        return this.MProduction04?.cost_per_hour ?? 0 ;  
    }

    /**
     * 生産先の準備秒数 04
     */
    public get MProductionPrepareSec04():number{ 
        return this.MProduction04?.prepare_sec ?? 0 ;  
    }

    /**
     * 生産先モードID 04
     */
    public set MProductionModeId04(v:number){
        this.setMProductionModeId(4 , v ) ;         
    }
    public get MProductionModeId04():number{
        if (! TProjectProductProcess.is(this)) return 0 ; 
        return this.m_production_mode_id_04 ?? 0; 
    }
   
    /**
     * 生産先モード 04
     */
    public get MProductionMode04():MProductionMode|undefined { 
        const found = this.getSelectedMProductionMode(4) ; 
        return found ; 
    }

    /**
     * 生産先モード名 04
     */
    public get MProductionModeName04():string{ 
        return this.MProductionMode04?.name ?? "" ;  
    }

    
    /**
     * 生産先モード 準備秒数 04
     */
    public get MProductionModePrepareSec04():number{ 
        return this.MProductionMode04?.prepare_sec_per_qty ?? 0 ;
    }

    /**
     * 生産先モード 速度/h 04
     */
    public get MProductionModeSpeedPerHour04():number{ 
        return this.MProductionMode04?.speed_per_hour ?? 0 ;
    }

    
    /**
     * 生産先オプションID 04
     */
     public set MProductionOptionId04(v:number){
        this.setMProductionOptionId(4 , v ) ;         
    }
    public get MProductionOptionId04():number{
        if (! TProjectProductProcess.is(this)) return 0 ; 
        return this.m_production_option_id_04 ?? 0; 
    }


    /**
     * 生産先オプション 04
     */
    public get MProductionOption04():MProductionOption|undefined { 
        const found = this.getSelectedMProductionOption(4) ; 
        return found ; 

    }
    /**
     * 生産先オプション名 04
     */
     public get MProductionOptionName04():string{ 
        return this.MProductionOption04?.name ?? "" ;  
    }

    //#endregion


    
     public static Init(p:TProjectProductProcessProductions){

    }

    public static is(arg:any):arg is TProjectProductProcessProductions { 
        if ( arg?.IsTProjectProductProcessProductions === undefined) return false ; 
        return arg.IsTProjectProductProcessProductions ; 
    } 
    
}


