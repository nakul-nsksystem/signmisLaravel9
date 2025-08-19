<template>   
    <div class="row">
        <div class="d-none">
            {{cGrommetMaterialName}}
            {{cMagicTapeMaterialName}}
            {{cSilliconRubberMaterialName}}
        </div>
        <div class="col-12 col-xl-4">
            <div class="row">
                <div class="col-12">
                    <label>{{name}}</label>
                    
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <t-product-process-post-cartain-svg
                        v-model="dValue"                        
                        :pt="pt" 
                        :size-w="cSizeW" 
                        :size-h="cSizeH"                         
                        :columns="cColumns"    
                        :grommetMargin="grommetMargin"
                        :fill-color="'darkgray'"
                        :is-grommet="cIsGrommet && cIsGrommetPitch"
                        :grommet-pitch="cCalcedGrommetPitch"
                        :grommet-fill="'gold'"
                    >

                    </t-product-process-post-cartain-svg>

                </div>
            </div>

        </div>

        <div class="col-12 col-xl-8 pl-3 pl-xl-0">                    
            <div class="row" v-show="m$cIsProcessMemoAvailable">
                <div class="col-12">
                    <div class="alert alert-primary">
                        {{dValue.m_process_category.memo4project}}
                    </div>
                    
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-xl-6">
                    <validation-provider name="タイプ"
                        :vid="`cTypeMKvId${name}`"                
                        :rules="`${m$cIsEnabled && cIsSelected ? 'required|excluded:0' : ''}`" 
                        immediate v-slot="{ errors }">

                        <div class="form-group">
                            <label >タイプ</label>
                            <m-kv-select
                                v-model="cTypeMKvId"
                                :kv-key="'t_project_product_process-post-cartain-type'">
                            </m-kv-select>
                            <span class="validation-error mb-2">{{ errors[0] }}</span>
                        </div>
                    </validation-provider>
                </div>

                
                <div class="col-12 col-xl-6 pl-3 pl-xl-0">
                    <validation-provider name="仕上方法"
                        :vid="`cFinishWayMKvId${name}`"                
                        :rules="`${m$cIsEnabled && cIsSelected ? 'required|excluded:0' : ''}`" 
                        immediate v-slot="{ errors }">
                        <div class="form-group">
                            <label >仕上方法</label>
                            <m-kv-select
                                v-model="cFinishWayMKvId"
                                :selected-item.sync="dFinishWayMKv"
                                :kv-category-id="cTypeMKvTargetMKvCategoryId"
                                >
                            </m-kv-select>
                            <span class="validation-error mb-2">{{ errors[0] }}</span>
                        </div>
                    </validation-provider>
                </div>
                
            </div>
            <div v-show="cIsCottonTapeShow || cIsRope" class="row" >
                
                <div class="col-12 col-xl-2 text-center">                            
                    <div class="form-group">
                        <label >綿テープ</label>
                        <ns-checkbox-input
                            v-model="cIsCottonTape"
                            :id="'PostCartainIsCottonTape' + pt"                            
                            />

                        
                    </div>
                </div>
                
                <div v-show="cIsRope"                 
                    class="col-12 col-xl-3" >
                    <validation-provider name="ロープ長"
                        :vid="`cRopeLength${name}`"                                        
                        :rules="`${m$cIsEnabled && cIsSelected && cIsRope ? 'required|min_value:1' : ''}`" 
                        immediate v-slot="{ errors }">

                        <div class="form-group">
                            <label >ロープ長(mm数)</label>    
                            <ns-number-input v-model="cRopeLength" />
                            <span class="validation-error mb-2">{{ errors[0] }}</span>                            
                        </div>
                    </validation-provider>

                </div>

                <div v-show="cIsRope"                 
                    class="col-12 col-xl-7 pl-xl-0" >
                    <div class="form-group">
                        <label >ロープ長内訳(?mが?本必要等)</label>    
                        <input v-model.lazy="cRopeMemo"
                            class="form-control" placeholder="">
                    </div>
                
                </div>

                
                

            </div>


            <div v-show="cIsMagicTape" class="row">
                
                <div class="col-12 col-xl-6">
                    <validation-provider name="マジックテープ"
                        :vid="`cMagicTapeMMaterialId${name}`"                                        
                        :rules="`${m$cIsEnabled && cIsSelected && cIsMagicTape ? 'required|excluded:0' : ''}`" 
                        immediate v-slot="{ errors }">
                        <div class="form-group">
                            <label >マジックテープ</label>                    
                            <m-material-select                        
                                v-model="cMagicTapeMMaterialId"
                                :selected-item.sync="cMagicTapeMMaterial"
                                :m-branch-id="m$cMBranchId"
                                :sub-category-m-kv-id="SubCatMagicTapeMKvId"
                                :isDisplayName="true"              
                                >
                                </m-material-select>      
                            <span class="validation-error mb-2">{{ errors[0] }}</span>
                        </div>
                    </validation-provider>
                </div>


                <div class="col-12 col-xl-3 pl-3 pl-xl-0">
                    <validation-provider name="種類"
                        :vid="`cMagicTapeNeededMKvId${name}`"                                                            
                        :rules="`${m$cIsEnabled && cIsSelected && cIsMagicTape ? 'required|excluded:0' : ''}`" 
                        immediate v-slot="{ errors }">

                        <div class="form-group">
                            <label>種類</label>
                            <m-kv-select
                                v-model="cMagicTapeNeededMKvId"
                                :kv-key="'t_project_product_process-post-cartain-magictape-needed'">
                            </m-kv-select>
                            <span class="validation-error mb-2">{{ errors[0] }}</span>
                        </div>
                    </validation-provider>
                </div> 

                <div class="col-12 col-xl-3 pl-3 pl-xl-0">
                    <validation-provider name="mm数"
                        :vid="`cMagicTapeLength${name}`"                                                            
                        :rules="`${m$cIsEnabled && cIsSelected && cIsMagicTape ? 'required|min_value:1' : ''}`" 
                        immediate v-slot="{ errors }">
                        <div class="form-group">
                            <label >mm数</label>                    
                            <ns-number-input v-model="cMagicTapeLength" />
                            <span class="validation-error mb-2">{{ errors[0] }}</span>
                        </div>
                    </validation-provider>
                </div>

            </div>

            
            <div class="row" v-show="$$cIsDebug && cIsMagicTape" >

                <div class="col-12 col-xl-3">
                    <div class="form-group">
                        <label >雄雌合計mm</label>
                        <div>{{cMagicTapeTotalLength}}mm</div>
                    </div>
                </div>
                
                <div class="col-12 col-xl-4">
                    <div class="form-group">
                        <label>マジックテープ単価</label>
                        <div>{{cMagicTapeCost}}円</div>       
                    </div>
                </div>

            </div>

            <div v-show="cIsSilliconRubber" class="row">
                
                <div class="col-12 col-xl-6">
                    <validation-provider name="シリコンゴム"
                        :vid="`cSilliconRubberMMaterialId${name}`"                                                            
                        :rules="`${m$cIsEnabled && cIsSelected && cIsSilliconRubber ? 'required|excluded:0' : ''}`" 
                        immediate v-slot="{ errors }">
                        <div class="form-group">
                            <label >シリコンゴム</label>                    
                            <m-material-select                        
                                v-model="cSilliconRubberMMaterialId"
                                :selected-item.sync="cSilliconRubberMMaterial"
                                :m-branch-id="m$cMBranchId"
                                :sub-category-m-kv-id="SubCatSilliconRubberMKvId"
                                :isDisplayName="true"              
                                >
                                </m-material-select>      
                            <span class="validation-error mb-2">{{ errors[0] }}</span>
                        </div>
                    </validation-provider>
                </div>



            </div>

            
            <div class="row" v-show="$$cIsDebug && cIsSilliconRubber" >

                <div class="col-12 col-xl-4">
                    <div class="form-group">
                        <label>シリコンゴム単価</label>
                        <div>{{cSilliconRubberCost}}円</div>       
                    </div>
                </div>

            </div>

            


            <div v-show="cIsGrommetShow" class="row">
                
                
                <div class="col-12 col-xl-2 text-center" >
                    <div class="form-group">
                        <label >ハトメ</label>
                        <ns-checkbox-input
                            v-model="cIsGrommet"
                            :id="'PostCartainIsGrommet' + pt"                            
                            />

                        
                    </div>
                </div>

                <div v-show="cIsGrommet" class="col-12 col-xl-7 pl-3 pl-xl-0">
                    <validation-provider name="ハトメ種類"
                        :vid="`cGrommetMMaterialId${name}`"                                                            
                        :rules="`${m$cIsEnabled && cIsSelected && cIsGrommet ? 'required|excluded:0' : ''}`" 
                        immediate v-slot="{ errors }">
                        <div class="form-group">
                            <label >ハトメ種類</label>
                            <m-material-select                        
                                v-model="cGrommetMMaterialId"
                                :selected-item.sync="cGrommetMMaterial"
                                :m-branch-id="m$cMBranchId"
                                :sub-category-m-kv-id="SubCatGrommetMKvId"
                                :isDisplayName="true"              
                                >
                                </m-material-select>       
                            <span class="validation-error mb-2">{{ errors[0] }}</span>
                        </div>
                    </validation-provider>
                </div>

            </div>
            <div v-show="cIsGrommetShow && cIsGrommet" class="row">

                <div class="col-12 col-xl-3 ">
                    <validation-provider name="指定"
                        :vid="`cGrommetSpecifyMKvId${name}`"                                                            
                        :rules="`${m$cIsEnabled && cIsSelected && cIsGrommet ? 'required|excluded:0' : ''}`" 
                        immediate v-slot="{ errors }">

                        <div class="form-group">
                            <label>指定</label>
                            <m-kv-select
                                v-model="cGrommetSpecifyMKvId"
                                :kv-key="'t_project_product_process-post-cartain-grommet-specify'">
                            </m-kv-select>
                            <span class="validation-error mb-2">{{ errors[0] }}</span>
                        </div>
                    </validation-provider>
                </div> 



                <div v-show="cIsGrommetShow && cIsGrommet && cIsGrommetPitch" class="col-12 col-xl-3 pl-3 pl-xl-0">
                    <validation-provider name="ピッチ"
                        :vid="`cGrommetPitch${name}`"                                                            
                        :rules="`${m$cIsEnabled && cIsSelected && cIsGrommet && cIsGrommetPitch ? 'required|min_value:1' : ''}`" 
                        immediate v-slot="{ errors }">
                        <div class="form-group">
                            <label >ピッチ</label>
                            <ns-number-input v-model="cGrommetPitch" />
                            <span class="validation-error mb-2">{{ errors[0] }}</span>
                        </div>
                    </validation-provider>
                </div>

                
                <div v-show="cIsGrommetShow && cIsGrommet && cIsGrommetQty" class="col-12 col-xl-3 pl-3 pl-xl-0">
                    <validation-provider name="個数"
                        :vid="`cGrommetUsageByInputQty${name}`"                                                            
                        :rules="`${m$cIsEnabled && cIsSelected && cIsGrommet && cIsGrommetQty? 'required|min_value:1' : ''}`" 
                        immediate v-slot="{ errors }">
                        <div class="form-group">
                            <label >個数</label>
                            <ns-number-input v-model="cGrommetUsageByInputQty" />
                            <span class="validation-error mb-2">{{ errors[0] }}</span>
                        </div>
                    </validation-provider>
                </div>
                
                
            </div>

            <div class="row" v-show="$$cIsDebug && cIsGrommetShow" >

                <div class="col-12 col-xl-3">
                    <div class="form-group">
                        <label >個数</label>
                        <div>{{cGrommetUsageQty}}個</div>
                        <div>うち角:({{cCornerGrommetUsageQty}}個)</div>                    
                    </div>
                </div>
                <div class="col-12 col-xl-3 pl-3 pl-xl-0">
                    <div class="form-group">
                        <label >計算後ピッチ</label>
                        <table class="table table-dark text-right">
                            <tbody>
                                <tr>
                                    <td>W</td>
                                    <td>{{cCalcedGrommetPitch.w.toFixed(1)}}mm</td>
                                </tr>
                                <tr>
                                    <td>H</td>
                                    <td>{{cCalcedGrommetPitch.h.toFixed(1)}}mm</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div class="col-12 col-xl-3">
                    <div class="form-group">
                        <label>ハトメ単価</label>
                        <div>{{cGrommetCost}}円</div>       
                    </div>
                </div>
            </div>

            <div class="row" v-show="$$cIsDebug">
                <div class="col-12 col-xl-2">
                    <div class="form-group">
                        <label>辺長さ</label>
                        <div>{{cSideMaterLength}} m</div>       
                    </div>
                    
                </div>
                <div class="col-12 col-xl-2">
                    <div class="form-group">
                        <label>辺長さ mm</label>
                        <div>{{cSideLength}} m</div>       
                    </div>
                    
                </div>
                <div class="col-12 col-xl-2">
                    <div class="form-group">
                        <label>ミシン加工</label>
                        <div>{{cIsSewing}}</div>       
                    </div>
                    
                </div>
                <div class="col-12 col-xl-2">
                    <div class="form-group">
                        <label>ウェルダー加工</label>
                        <div>{{cIsWelder}}</div>       
                    </div>
                    
                </div>
                <div class="col-12 col-xl-2">
                    <div class="form-group">
                        <label>選択</label>
                        <div>{{cIsSelected}}</div>       
                    </div>
                    
                </div>

                <div class="col-12 col-xl-2">
                    <div class="form-group">
                        <label>ころしウェルダー長さ</label>
                        <div>{{cLengthOfWelderForSide}}</div>       
                    </div>
                    
                </div>
                
                
                
            </div>
        </div>

    </div>
        
</template>


<script>
import MKvsConst from '../../../../consts/MKvsConst';
import MastersUtil from '../../../../frameworks/MastersUtil';
import NumberUtil from '../../../../frameworks/NumberUtil';
import ObjectUtil from '../../../../frameworks/ObjectUtil';
import ProcessDynamicGetSetComputedMixins from '../../../../mixins/tProject/ProcessDynamicGetSetComputedMixins';

import TProductProcessMixins from "./../../../../mixins/tProject/TProductProcessMixins" ;
import { PostCartainColumnNames, PostCartainEdges, PostCartainGetterNames } from './consts/PostCartainDefs';


export default {       
    mixins : [TProductProcessMixins ,ProcessDynamicGetSetComputedMixins ] ,      
    data : function() {
        return {
            // これがないとReactiveが動作しない
            dValue : {} , 

            
            dComputedGetSetDefs : [
                // 
                // { key:'cTypeMKvId' ,propName:`TypeMKvId_All` } ,
                


            ] , 

            dComputedGetDefs : [          
                // TProject
                { key:'cTProduct' ,propName:"_t_project_product" } ,
                // TProject
                // { key:'cTypeMKv_Lr' ,propName:"TypeMKv_Lr" } ,
                
            ] ,



            dSelectedGrommetMaterial    : undefined , 
            dSelectedMagicTapeMaterial  : undefined , 
            dSelectedSilliconRubberMaterial : undefined , 

            
            // タイプ
            // dTypeMKv    : undefined , 

            // 仕上げ方法
            dFinishWayMKv : undefined , 

            SubCatGrommetMKvId          : MKvsConst.MMaterials.SubCategory.GROMMET          ,
            SubCatMagicTapeMKvId        : MKvsConst.MMaterials.SubCategory.MAGIC_TAPE       ,
            SubCatSilliconRubberMKvId   : MKvsConst.MMaterials.SubCategory.SILLICON_RUBBER  ,

            // ハトメ　指定　ピッチ
            // GrommetSpecifyPitchMKvId    : MKvsConst.TProjects.Process.PostCartain.GROMMET_SPECIFY_PITCH ,

            // ハトメ　指定　個数
            // GrommetSpecifyQtyMKvId      : MKvsConst.TProjects.Process.PostCartain.GROMMET_SPECIFY_QTY ,

        }
    } ,
    props : {
        name : {
            type : String ,
            default : () => "" ,
        } ,
        pt : {
            type : String ,
            require : true 
        } , 
        // ハトメのマージン
        grommetMargin : {
            type : Number ,
            default : () => 0 ,         
        } , 
        // 辺の選択
        isSelecteds: {
            type : Object ,
            require : true 
        } , 
        // 対応するカラム
        columns : {
            type: Object ,
            require : true 
        } ,
    } ,
    
    computed : {
        // カラム
        cColumns : function() {
            if ( this.columns[this.pt]  === undefined) return {} ; 
            return this.columns[this.pt] ; 
        } , 
        // 自身が選択されているか
        cIsSelected : function() {
            return this.isSelecteds[this.pt] ; 
        } ,

        cSizeW : function() { 
            
            return this.dValue.TProjectProduct.SizeW ; 
        } , 
        cSizeH : function() { 
            
            return this.dValue.TProjectProduct.SizeH ; 
        } , 

        // タイプ OK
        cTypeMKvIdColName : function() {
            const colName = this.cColumns[PostCartainColumnNames.TypeMKvId] ;  
            return colName ; 
        } ,
        cTypeMKvId :{
            get :  function() {                
                return this.m$getValue(this.cTypeMKvIdColName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.cTypeMKvIdColName , val ) ;  
            }
        } ,  
        // タイプ  OK
        cTypeMKvTargetMKvCategoryIdCName : function () {
            const colName = `${PostCartainGetterNames.TypeMKvTargetMKvCategoryId}_${this.pt}` ; 
            return colName ; 
        } , 
        cTypeMKvTargetMKvCategoryId : function () {
            return this.m$getValue(this.cTypeMKvTargetMKvCategoryIdCName) ;

            // if ( this.dTypeMKv === undefined ) return 0 ; 
            // return this.dTypeMKv.target_m_kv_category_id ;
        } ,
        // 仕上げ方法 OK
        cFinishWayMKvIdCName : function () {
            const colName = this.cColumns[PostCartainColumnNames.FinishWayMKvId] ;  
            return colName ; 
        } , 
        cFinishWayMKvId :{
            get :  function() {                
                return this.m$getValue(this.cFinishWayMKvIdCName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.cFinishWayMKvIdCName , val ) ; 
            }
        } ,  

        // 対象の辺の長さ OK
        cSideLengthCName : function () {
            const colName = `${PostCartainGetterNames.SideLength}_${this.pt}` ; 
            return colName ; 
        } , 
        cSideLength : function(){
            return this.m$getValue(this.cSideLengthCName) ; 
            // let val = NumberUtil.invalid2zr(this.sideLength) ; 
            // this.m$setValue(this.cSideLengthCName , val ) ; 

            // return val ;  
            
        } ,  

        
        // 対象の辺の長さメートル OK
        cSideMaterLengthCName : function () {
            const colName = `${PostCartainGetterNames.SideMaterLength}_${this.pt}`  ; 
            return colName ; 
        } , 
        cSideMaterLength : function(){
            return this.m$getValue(this.cSideMaterLengthCName) ; 
            // let val = NumberUtil.invalid2zr(this.sideLength) * 0.001  ; 
            // val = NumberUtil.round(val , 3) ;
            // this.m$setValue(this.cSideMaterLengthCName , val ) ; 

            // return val ;  
            
        } ,  

        /*****************************************
         * 綿テープ
         *****************************************/

        // 綿テープ表示
        // cIsCottonTapeShow : function() {
        //     let val = false ; 
        //     if ( this.dTypeMKv !== undefined  ) {
        //          val = this.dTypeMKv.g_01 == "1" ; 
        //     }
            
        //     if (! val ){
        //         if ( this.dTypeMKv !== undefined && this.cTypeMKvId != 0 ){
        //             // Loading時
        //             //this.cIsCottonTape = false ; 
        //         }
                
        //     } 
        //     return val ; 

        // } ,

        
        // 綿テープ OK
        cIsCottonTapeShowCName : function () {            
            const colName = `${PostCartainGetterNames.IsCottonTapeShow}_${this.pt}`  ;             
            return colName ; 
        } , 
        cIsCottonTapeShow : function() {
            return this.m$getValue(this.cIsCottonTapeShowCName) ;
        } ,  

        // 綿テープ OK
        cIsCottonTapeCName : function () {
            const colName = this.cColumns[PostCartainColumnNames.IsCottonTape] ; 
            return colName ; 
        } , 
        cIsCottonTape :{
            get :  function() {                                 
                return this.m$getValue(this.cIsCottonTapeCName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.cIsCottonTapeCName , val ) ; 
            }
        } ,  

        /*****************************************
         * ロープ出しロープ長さ
         *****************************************/

        // cIsRopeLengthShow : function() {
        //     let val = false ; 
        //     if ( this.dTypeMKv !== undefined ) {
        //          val = this.dTypeMKv.g_02 == "1" ; 
        //     }
            
        //     if (! val ){                
        //         if ( this.dTypeMKv !== undefined && this.cTypeMKvId != 0 ){
        //             this.cRopeLength = 0 ; 
        //         }
                
        //     } 
        //     // this.cIsRope = val ; 
        //     return val ; 
        // } ,

        
        // ロープ有無 OK
        cIsRopeCName : function () {
            // const colName = this.cColumns[PostCartainColumnNames.IsRope] ; 
            const colName = `${PostCartainGetterNames.IsRope}_${this.pt}` ; 
            return colName ; 
        } , 
        cIsRope :{
            get :  function() { return this.m$getValue(this.cIsRopeCName) ;} ,
            // set : function(val) {this.m$setValue(this.cIsRopeCName , val ) ; }
        } ,  
        
        // ロープ長さ OK
        cRopeLengthCName : function () {
            const colName = this.cColumns[PostCartainColumnNames.RopeLength] ; 
            return colName ; 
        } , 
        cRopeLength :{
            get :  function() {  
                return this.m$getValue(this.cRopeLengthCName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.cRopeLengthCName , val ) ; 
            }
        } ,  


        // ロープ内訳 
        cRopeMemoCName : function () {
            const colName = this.cColumns[PostCartainColumnNames.RopeMemo] ; 
            return colName ; 
        } , 
        cRopeMemo :{
            get :  function() {  
                return this.m$getValue(this.cRopeMemoCName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.cRopeMemoCName , val ) ; 
            }
        } ,  

        /*****************************************
         * ハトメ
         *****************************************/
        // ハトメ表示
        // cIsGrommetShow : function() {            
        //     let val = false ; 
        //     if ( this.cIsSelected && this.dFinishWayMKv !== undefined ) {
        //          val = this.dFinishWayMKv.g_01 == "1" ; 
        //     }
            
        //     if (! val ){
        //         if ( this.dFinishWayMKv !== undefined && this.cFinishWayMKvId != 0 ){
        //             this.cIsGrommet = false ; 
        //         }                
        //     } 
        //     return val ; 
        // } ,

        // ハトメ 有無 OK
        cIsGrommetShowCName : function () {
            const colName = `${PostCartainGetterNames.IsGrommetShow}_${this.pt}` ; 
            
            return colName ; 
        } , 
        cIsGrommetShow : function() {
            return this.m$getValue(this.cIsGrommetShowCName) ;

        } ,  
         

        // ハトメ 有無 OK
        cIsGrommetCName : function () {
            const colName = this.cColumns[PostCartainColumnNames.IsGrommet]; 
            return colName ; 
        } , 
        cIsGrommet :{
            get :  function() {                
                return this.m$getValue(this.cIsGrommetCName) ;           
            } ,
            set : function(val) {
                this.m$setValue(this.cIsGrommetCName , val ) ; 
            }
        } ,  

        // ハトメ 種類 OK
        cGrommetMMaterialIdCName : function () {
            const colName = this.cColumns[PostCartainColumnNames.GrommetMMaterialId]; 
            return colName ; 
        } , 
        cGrommetMMaterialId :{
            get :  function() {                
                return this.m$getValue(this.cGrommetMMaterialIdCName) ;           
            } ,
            set : function(val) {
                this.m$setValue(this.cGrommetMMaterialIdCName , val ) ; 
            }
        } ,  

        // ハトメ OK
        cGrommetMMaterialCName : function () {
            const colName = this.cColumns[PostCartainColumnNames.GrommetMMaterial]; 
            return colName ; 
        } , 
        cGrommetMMaterial :{
            get :  function() {                
                return this.m$getValue(this.cGrommetMMaterialCName) ;           
            } ,
            set : function(val) {
                // console.log("cGrommetMMaterial " + this.cGrommetMMaterialCName) ; 
                // console.log(val) ; 
                this.m$setValue(this.cGrommetMMaterialCName , val ) ; 
            }
        } ,  


        // ハトメ名 OK
        cGrommetMaterialNameCName : function () {
            // const colName = this.cColumns[PostCartainColumnNames.GrommetName] ; 
            const colName = `${PostCartainGetterNames.GrommetName}_${this.pt}` ; 
            return colName ; 
        } , 
        cGrommetMaterialName : function(){            
             return this.m$getValue(this.cGrommetMaterialNameCName) ;
            // 
            // const val = MastersUtil.getMaterialName(this.dSelectedGrommetMaterial) ;             
            // this.m$setValue(this.cGrommetMaterialNameCName , val ) ; 

            // return val ;  
            
        } ,          
        
        // ハトメ単価 OK
        cGrommetCostCName : function () {
            // const colName = this.cColumns[PostCartainColumnNames.GrommetPrice] ; 
            const colName = `${PostCartainGetterNames.GrommetPrice}_${this.pt}` ; 
            return colName ; 
        } , 
        cGrommetCost : function(){
            return this.m$getValue(this.cGrommetCostCName) ;
            
        } ,          
        

        // ハトメ 指定
        cGrommetSpecifyMKvIdCName : function () {
            const colName = this.cColumns[PostCartainColumnNames.GrommetSpecifyMKvId]; 
            return colName ; 
        } , 
        cGrommetSpecifyMKvId :{
            get :  function() {                
                return this.m$getValue(this.cGrommetSpecifyMKvIdCName) ;           
            } ,
            set : function(val) {
                this.m$setValue(this.cGrommetSpecifyMKvIdCName , val ) ; 
            }
        } ,  


        

        // ハトメ 指定がピッチである OK
        cIsGrommetPitchCName : function () {
            const colName = `${PostCartainGetterNames.IsGrommetSpecifyPitch}_${this.pt}` ; 
            // const colName = this.cColumns[PostCartainColumnNames.IsGrommetSpecifyPitch]; 
            return colName ; 
        } , 
        cIsGrommetPitch : function() {
            return this.m$getValue(this.cIsGrommetPitchCName) ;
            // let val = this.cGrommetSpecifyMKvId == this.GrommetSpecifyPitchMKvId  ; 
            // if ( ! this.cIsGrommet) val = false ; 
            // this.m$setValue(this.cIsGrommetPitchCName , val ) ; 
            // return val ; 
        } , 
        // ハトメ 指定が個数である OK
        cIsGrommetQtyCName : function () {
            // const colName = this.cColumns[PostCartainColumnNames.IsGrommetSpecifyQty]; 
            const colName = `${PostCartainGetterNames.IsGrommetSpecifyQty}_${this.pt}` ; 
            return colName ; 
        } , 
        cIsGrommetQty : function() {
            return this.m$getValue(this.cIsGrommetQtyCName) ;
            // let val = this.cGrommetSpecifyMKvId == this.GrommetSpecifyQtyMKvId  ; 
            // if ( ! this.cIsGrommet) val = false ; 
            // this.m$setValue(this.cIsGrommetQtyCName , val ) ; 
            // return val ; 
        } , 

        
        
        // ハトメピッチ OK
        cGrommetPitchCName : function () {
            const colName = this.cColumns[PostCartainColumnNames.GrommetPitch] ; 
            return colName ; 
        } , 
        cGrommetPitch :{
            get :  function() {             
                return this.m$getValue(this.cGrommetPitchCName) ; 
            } ,
            set : function(val) {
                this.m$setValue(this.cGrommetPitchCName , val ) ; 
            }
        } , 
        // ハトメ角を除いたサイズ
        cGrommetValidSizeCName : function () {
            const colName = `${PostCartainGetterNames.GrommetValidSize}_${this.pt}` ; 
            return colName ; 
        } , 
        cGrommetValidSize : function() {
            return this.m$getValue(this.cGrommetValidSizeCName) ;
            
            
            // const mgn = this.grommetMargin ; 
            // const pitch = this.cGrommetPitch ; 
            // const rtn = { w :0 ,h:0 } 
            // if ( pitch === undefined ||  pitch == 0 ) return rtn ; 

            // if ( rtn.w < 0 ) rtn.w = 0 ; 
            // if ( rtn.h < 0 ) rtn.h = 0 ; 

            // return rtn ; 
            
        } , 
        // 計算後ハトメピッチ 
        cCalcedGrommetPitchCName : function () {
            const colName = `${PostCartainGetterNames.CalcedGrommetPitch}_${this.pt}` ; 
            return colName ; 
        } , 

        cCalcedGrommetPitch : function() {
            return this.m$getValue(this.cCalcedGrommetPitchCName) ;
            
            // const rtn = { w :0 ,h:0 } 
            // const qtyObj = this.cCalcedGrommetUsageQty ; 
            // if ( qtyObj.w != 0 ) {
            //     rtn.w = NumberUtil.trunc(this.cGrommetValidSize.w / (qtyObj.w + 1) ,1 ) ;
            // }
            // if ( qtyObj.h != 0 ) {
            //     rtn.h = NumberUtil.trunc(this.cGrommetValidSize.h / (qtyObj.h + 1) ,1 ) ;
            // }
            
            // return rtn ;
        } ,
        // 角を除いたハトメ使用数( w , h あたり)
        cCalcedGrommetUsageQtyCName : function () {
            const colName = `${PostCartainGetterNames.CalcedGrommetUsageQty}_${this.pt}` ; 
            return colName ; 
        } ,         
        cCalcedGrommetUsageQty : function() {   
            return this.m$getValue(this.cCalcedGrommetUsageQtyCName) ;         
            
            // const pitch = this.cGrommetPitch ; 
            // const rtn = { w :0 ,h:0 } 
            // if ( pitch === undefined || pitch == 0 ) return rtn ; 

            
            // // 横方向
            // switch ( this.pt ) {
            //     case PostCartainEdges.All :
            //     case PostCartainEdges.Tb  : 
            //     case PostCartainEdges.T   : 
            //     case PostCartainEdges.B   : 
            //         rtn.w = NumberUtil.invalid2zr(NumberUtil.trunc(this.cGrommetValidSize.w / pitch)) ; 
            //         break ; 

            // }

            // // 縦方向
            // switch ( this.pt ) {
            //     case PostCartainEdges.All :
            //     case PostCartainEdges.Lr  : 
            //     case PostCartainEdges.L   : 
            //     case PostCartainEdges.R   : 
            //         rtn.h = NumberUtil.invalid2zr(NumberUtil.trunc(this.cGrommetValidSize.h / pitch)) ; 
            //         break ; 

            // }
            
            
            

            // return rtn ;
        } ,
        
        // ハトメ角使用個数
        cCornerGrommetUsageQtyCName : function () {
            const colName = `${PostCartainGetterNames.CornerGrommetUsageQty}_${this.pt}` ; 
            return colName ; 
        } ,         
        cCornerGrommetUsageQty : function() {
            return this.m$getValue(this.cCornerGrommetUsageQtyCName) ;         
        //     switch (this.pt) {
        //         case PostCartainEdges.All : 
        //         // 上下優先
        //         case PostCartainEdges.Tb  :
        //             return 4 ; 
                
        //         case PostCartainEdges.T  :                    
        //         case PostCartainEdges.B  :
        //             return 2 ; 

        //         // 左右
        //         case PostCartainEdges.Lr  :
        //         case PostCartainEdges.L   :
        //         case PostCartainEdges.R   :
        //             let num = 0 ; 
        //             if ( this.isSelecteds[PostCartainEdges.Tb] ||
        //                  (this.isSelecteds[PostCartainEdges.T] && this.isSelecteds[PostCartainEdges.B]))
        //             {
        //                 // 上下選択されている
        //                 num = 0 ;                         
        //             } else {
        //                 if(this.isSelecteds[PostCartainEdges.T || this.isSelecteds[PostCartainEdges.B]]){
        //                     // 片方だけ選択
        //                     num = 1 ; 
        //                 }
        //                 else
        //                 {
        //                     // 左右のみ
        //                     num = 2 ; 
        //                 }
                        
        //             }
        //             return num * (this.pt == PostCartainEdges.Lr ? 2 : 1) ; 
                    
        //     }
        } , 

        // ハトメ使用個数
        cGrommetUsageQtyCName : function () {
            // const colName = this.cColumns[PostCartainColumnNames.GrommetUsageQty]  ; 
            const colName = `${PostCartainGetterNames.GrommetUsageQty}_${this.pt}` ; 
            return colName ; 
        } , 
        cGrommetUsageQty : function(){       
            return this.m$getValue(this.cGrommetUsageQtyCName) ;         
            
            // if (! this.cIsGrommetShow || ! this.cIsGrommet ) return 0 ; 
            // if (! this.cIsGrommet ) return 0 ; 

            // let val = 0 ; 
            // if ( this.cIsGrommetPitch) {
            //     // 指定ピッチ

            //     // 角の使用数
            //     val = this.cCornerGrommetUsageQty ; 

            //     // 角以外の使用数
            //     let qtyWoCorner = this.cCalcedGrommetUsageQty.w + this.cCalcedGrommetUsageQty.h ; 
            //     switch ( this.pt ) {
            //         case PostCartainEdges.All :
            //             qtyWoCorner *= 4 ; 
            //             break ; 
                    
            //         case PostCartainEdges.Tb :
            //         case PostCartainEdges.Lr :    
            //             qtyWoCorner *= 2 ; 
            //             break ; 
                    
            //     }
            //     val += qtyWoCorner ;
            // }
            // else
            // {
            //     // 指定個数
            //     val = NumberUtil.invalid2zr(this.cGrommetUsageByInputQty) ; 
            // }

            // this.m$setValue(this.cGrommetUsageQtyCName , val ) ; 

            // return val ;  
            
        } ,  

        
        // ハトメ個数（手入力)
        cGrommetUsageByInputQtyCName : function () {
            const colName = this.cColumns[PostCartainColumnNames.GrommetUsageByInputQty] ; 
            return colName ; 
        } , 
        cGrommetUsageByInputQty :{
            get :  function() {             
                return this.m$getValue(this.cGrommetUsageByInputQtyCName) ; 
            } ,
            set : function(val) {
                this.m$setValue(this.cGrommetUsageByInputQtyCName , val ) ; 
            }
        } , 
        

        /*****************************************
         * マジックテープ
         *****************************************/
        // マジックテープ表示
        // cIsMagicTapeShow : function() {
        //     let val = false ; 
        //     if (this.cIsSelected &&  this.dFinishWayMKv !== undefined ) {
        //         val = this.dFinishWayMKv.g_02 == "1" ; 
        //     }
        //     return val ; 
        // } ,

        // マジックテープ 有無 OK
        cIsMagicTapeCName : function () {
            const colName = this.cColumns[PostCartainColumnNames.IsMagicTape]; 
            return colName ; 
        } , 
        // cIsMagicTape : function() {
        //     return this.m$getValue(this.cIsMagicTapeCName) ;
        //     // const val = this.cIsMagicTapeShow ;
        //     // this.m$setValue(this.cIsMagicTapeCName , val ) ; 
            
        //     // return val ; 
        // } ,
        cIsMagicTape :{
            get :  function() {                
                return this.m$getValue(this.cIsMagicTapeCName) ;           
            } ,
            set : function(val) {
                this.m$setValue(this.cIsMagicTapeCName , val ) ; 
            }
        } ,  


        // マジックテープ 必要内容
        cMagicTapeNeededMKvIdCName : function () {
            const colName = this.cColumns[PostCartainColumnNames.MagicTapeNeededMKvId] ; 
            return colName ; 
        } , 
        cMagicTapeNeededMKvId :{
            get :  function() {                
                return this.m$getValue(this.cMagicTapeNeededMKvIdCName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.cMagicTapeNeededMKvIdCName , val ) ; 
            }
        } ,  

        // マジックテープ種類
        cMagicTapeMMaterialIdCName : function () {
            const colName = this.cColumns[PostCartainColumnNames.MagicTapeMMaterialId] ; 
            return colName ; 
        } , 
        cMagicTapeMMaterialId :{
            get :  function() {                
                return this.m$getValue(this.cMagicTapeMMaterialIdCName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.cMagicTapeMMaterialIdCName , val ) ; 
            }
        } ,  

        // マジックテープ OK
        cMagicTapeMMaterialCName : function () {
            const colName = this.cColumns[PostCartainColumnNames.MagicTapeMMaterial]; 
            return colName ; 
        } , 
        cMagicTapeMMaterial :{
            get :  function() {                
                return this.m$getValue(this.cMagicTapeMMaterialCName) ;           
            } ,
            set : function(val) {
                this.m$setValue(this.cMagicTapeMMaterialCName , val ) ; 
            }
        } ,          
        // マジックテープ名
        cMagicTapeMaterialNameCName : function () {
            // const colName = this.cColumns[PostCartainColumnNames.MagicTapeName] ; 
            const colName = `${PostCartainGetterNames.MagicTapeName}_${this.pt}` ; 
            return colName ; 
        } , 
        cMagicTapeMaterialName : function(){            
            return this.m$getValue(this.cMagicTapeMaterialNameCName) ;
            // const val = MastersUtil.getMaterialName(this.dSelectedMagicTapeMaterial) ;             
            // this.m$setValue(this.cMagicTapeMaterialNameCName , val ) ; 
            // return val ;  
            
        } , 
        // マジックテープ単価
        cMagicTapeCostCName : function () {
            // const colName = this.cColumns[PostCartainColumnNames.MagicTapePrice] ; 
            const colName = `${PostCartainGetterNames.MagicTapePrice}_${this.pt}` ; 
            return colName ; 
        } , 
        cMagicTapeCost : function(){            
            // 
            return this.m$getValue(this.cMagicTapeCostCName) ;
            
        } ,     

        // マジックテープ 長さ
        cMagicTapeLengthCName : function () {
            const colName = this.cColumns[PostCartainColumnNames.MagicTapeLength] ; 
            return colName ; 
        } , 
        cMagicTapeLength :{
            get :  function() {
                return this.m$getValue(this.cMagicTapeLengthCName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.cMagicTapeLengthCName , val ) ; 
            }
        } ,  

        // マジックテープ 雄雌合計長さ
        cMagicTapeTotalLengthCName : function () {
            // const colName = this.cColumns[PostCartainColumnNames.MagicTapeTotalLength] ; 
            const colName = `${PostCartainGetterNames.MagicTapeTotalLength}_${this.pt}` ; 
            return colName ; 
        } , 
        cMagicTapeTotalLength :function(){            
            return this.m$getValue(this.cMagicTapeTotalLengthCName) ;
            // 
            // let val = NumberUtil.invalid2zr(this.cMagicTapeLength ) ; 
            // if ( this.cMagicTapeNeededMKvId == PostCartainConst.C_MKvMagicTapeBothSize) {
            //     val *= 2 ; 
            // }

            // // mに変更
            // val = NumberUtil.ceil(val * 0.001 ,3 ) ; 

            // this.m$setValue(this.cMagicTapeTotalLengthCName , val ) ; 

            // return val ;  
            
        } ,          


        
        /*****************************************
         * シリコンゴム
         *****************************************/
        // シリコンゴム表示
        // cIsSilliconRubberShow : function() {            
        //     if (! this.cIsSelected ) return false  ; 
        //     if ( this.dFinishWayMKv === undefined ) return false ; 
            
        //     const val = this.dFinishWayMKv.g_03 == "1" ; 
        //     return val ; 
        // } ,

        // シリコンゴム 有無 OK
        cIsSilliconRubberCName : function () {
            const colName = this.cColumns[PostCartainColumnNames.IsSilliconRubber]; 
            return colName ; 
        } , 
        
        cIsSilliconRubber :{
            get :  function() {                
                return this.m$getValue(this.cIsSilliconRubberCName) ;           
            } ,
            set : function(val) {
                this.m$setValue(this.cIsSilliconRubberCName , val ) ; 
            }
        } ,  
        // cIsSilliconRubber : function() {
        //     const val = this.cIsSilliconRubberShow ;
        //     this.m$setValue(this.cIsSilliconRubberCName , val ) ; 

        //     return val ; 
        // } ,

        // シリコンゴム種類
        cSilliconRubberMMaterialIdCName : function () {
            const colName = this.cColumns[PostCartainColumnNames.SilliconRubberMMaterialId] ; 
            return colName ; 
        } , 
        cSilliconRubberMMaterialId :{
            get :  function() {                
                return this.m$getValue(this.cSilliconRubberMMaterialIdCName) ;
            } ,
            set : function(val) {
                this.m$setValue(this.cSilliconRubberMMaterialIdCName , val ) ; 
            }
        } ,  

        // シリコンゴム OK
        cSilliconRubberMMaterialCName : function () {
            const colName = this.cColumns[PostCartainColumnNames.SilliconRubberMMaterial]; 
            return colName ; 
        } , 
        cSilliconRubberMMaterial :{
            get :  function() {                
                return this.m$getValue(this.cSilliconRubberMMaterialCName) ;           
            } ,
            set : function(val) {
                this.m$setValue(this.cSilliconRubberMMaterialCName , val ) ; 
            }
        } ,                  


        // シリコンゴム名
        cSilliconRubberMaterialNameCName : function () {
            const colName = `${PostCartainGetterNames.SilliconRubberName}_${this.pt}` ; 
            // const colName = this.cColumns[PostCartainColumnNames.SilliconRubberName] ; 
            return colName ; 
        } , 
        cSilliconRubberMaterialName : function(){            
            return this.m$getValue(this.cSilliconRubberMaterialNameCName) ;
            // const val = MastersUtil.getMaterialName(this.dSelectedSilliconRubberMaterial) ;             
            // this.m$setValue(this.cSilliconRubberMaterialNameCName , val ) ; 
            // return val ;  
            
        } ,          

        // シリコンゴム単価
        cSilliconRubberCostCName : function () {
            const colName = `${PostCartainGetterNames.SilliconRubberPrice}_${this.pt}` ; 
            // const colName = this.cColumns[PostCartainColumnNames.SilliconRubberPrice] ; 
            return colName ; 
        } , 
        cSilliconRubberCost : function(){            
            return this.m$getValue(this.cSilliconRubberCostCName) ;
            
        } ,          
        


        
        /*****************************************
         * その他
         *****************************************/

        // ミシン加工 有無
        cIsSewingCName : function () {
            // const colName = this.cColumns[PostCartainColumnNames.IsSewing]; 
            const colName = `${PostCartainGetterNames.IsSewing}_${this.pt}` ; 
            return colName ; 
        } , 
        cIsSewing : function() {
            return this.m$getValue(this.cIsSewingCName) ;
            // let val = false ; 
            // if (this.cIsSelected && this.dFinishWayMKv !== undefined ) {
            //     val = this.dFinishWayMKv.g_04 == "1" ; 

            // }
            // this.m$setValue(this.cIsSewingCName , val ) ; 
            // return val ; 
        } ,

        
        // ウェルダー加工 有無
        cIsWelderCName : function () {
            const colName = `${PostCartainGetterNames.IsWelder}_${this.pt}` ; 
            // const colName = this.cColumns[PostCartainColumnNames.IsWelder]; 
            return colName ; 
        } , 
        cIsWelder : function() {
            return this.m$getValue(this.cIsWelderCName) ;
            // let val = false ; 
            // if (this.cIsSelected && this.dFinishWayMKv !== undefined ) {
            //     val = this.dFinishWayMKv.g_05 == "1" ; 

            // }
            // this.m$setValue(this.cIsWelderCName , val ) ; 

            // return val ; 
        } ,
            
        // ころしウェルダー加工 加工mm数
        cLengthOfWelderForSideCName : function () {
            // const colName = this.cColumns[PostCartainColumnNames.LengthOfWelderForSide]; 
            const colName = `${PostCartainGetterNames.LengthOfWelderForSide}_${this.pt}` ; 
            return colName ; 
        } , 
        cLengthOfWelderForSide : function() {
            return this.m$getValue(this.cLengthOfWelderForSideCName) ;

        } ,
            



    } ,
    methods : {
    } ,
    created : async function() 
    {
        // if (ObjectUtil.isNU( this.cIsGrommet    ))  this.cIsGrommet    = false ; 
        // if (ObjectUtil.isNU( this.cIsMagicTape  ))  this.cIsMagicTape  = false ; 
        // if (ObjectUtil.isNU( this.cIsRope       ))  this.cIsRope       = false ; 
        

        // if (this.cIsCottonTape      === undefined ) this.cIsCottonTape      = false ; 
        // if (this.cIsSilliconRubber  === undefined ) this.cIsSilliconRubber  = false ; 

        // console.log("computed") ; 
        // console.log(this) ; 
        // console.log(this._computedWatchers.cTypeMKvId.getter) ; 
        
    }
    
} 
</script>