<template>
    <!-- Modalフォーム -->
    <div class="modal fade" id="productionChangeModal" tabindex="-1" role="dialog" data-backdrop="static" style="margin-top: 0px;">        
        <div class="modal-dialog modal-dialog-fluid" role="document">
            <div class="app-modal-content-dark">
                <validation-observer v-slot="{ invalid }">
                    <div class="modal-header">
                        <h4>生産先変更 - {{cFromToMProductionName}}</h4>                        
                    </div>


                    <div class="modal-body">
                        <div class="row">
                            <div class="col-12 col-xl-4">
                                <div class="form-group">
                                    <label>一括変更先モード</label>
                                    <m-production-mode-select
                                        v-model="cSelectedChangingAllMProductionModeId"
                                        :m-production-id="cToMProductionId"
                                        :m-process-category-id="cMProcessCategoryId"
                                        >
                                    </m-production-mode-select>
                                </div>
                            </div>

                            <!-- cIsUsedOption用 -->
                            <div class="d-none">                                
                                <m-production-option-select
                                    ref="optionSelect"
                                    :m-production-id="cToMProductionId"
                                    >
                                </m-production-option-select>                                
                            </div>

                            <div class="col-12 col-xl-4 pt-4 ml-auto">
                                <div class="float-right mt-1">
                                    <button type="button" class="btn btn-primary"  @click.prevent="hide()" :disabled="invalid">変更</button>
                                    <button type="button" class="btn btn-light ml-2" @click.prevent="cancel()">キャンセル</button>
                                </div>
                                
                            </div>
                            

                        </div>




                        <div class="row">
                            <div class="col-12 card bg-dark p-3"
                                v-for="(n ,index)  in cList" :key="n.id">
                                
                                <t-production-plan-group-detail-card 
                                    v-model="cList[index]"
                                    >                  
                                    <template v-slot:rightContainer>
                                        <div class="flex-grow-1 flex-shrink-1 ml-0 ml-md-3 pt-2">
                                            <div class="row">
                                                <div class="col-12 col-xl-6">
                                                    <validation-provider                                                    
                                                        :vid="`productionMode${n.id}`"                
                                                        rules="required|excluded:0" 
                                                        name="変更後モード"
                                                        immediate v-slot="{ errors }">
                                                        <div class="form-group">
                                                            <label>変更後モード</label>
                                                            <m-production-mode-select
                                                                v-model="n.tmp_to_m_production_mode_id"
                                                                :m-production-id="cToMProductionId"                                                                
                                                                :m-process-category-id="cMProcessCategoryId"
                                                                >
                                                            </m-production-mode-select>
                                                            <span class="validation-error">{{ errors[0] }}</span>
                                                        </div>
                                                    </validation-provider>
                                                </div>
                                                <div class="col-12 col-xl-6" v-show="cIsUseOption">
                                                    <validation-provider
                                                        :vid="`productionOption${n.id}`"                
                                                        :rules="`${cIsUseOption ? 'required|excluded:0' : ''}`" 
                                                        name="変更後オプション"
                                                        immediate v-slot="{ errors }">

                                                        <div class="form-group">
                                                            <label>変更後オプション</label>
                                                            <m-production-option-select
                                                                v-model="n.tmp_to_m_production_option_id"
                                                                :m-production-id="cToMProductionId"
                                                                >
                                                            </m-production-option-select>
                                                            <span class="validation-error">{{ errors[0] }}</span>
                                                        </div>
                                                    </validation-provider>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </template>
                                </t-production-plan-group-detail-card>
                            </div>

                        </div>


                    </div>
<!-- 
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary"  @click.prevent="hide()" :disabled="invalid">変更</button>
                        <button type="button" class="btn btn-light ml-2" @click.prevent="cancel()">キャンセル</button>                
                    </div> -->
                </validation-observer>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props : {
        // 親からのパラメーター
        isOpen : {
            // 起動フラグ(true:になった場合isOpenイベントを起動)
            type : Boolean ,
            default : () => false ,
        } ,

        info : {
            type : Object,             
        }  , 




    },
    data : function () {
        return {
            dSelectedChangingAllMProductionModeId : 0 , 

            dIsMounted : false  , 

        }
    } ,
    computed : {
        
        /**
         * オプションを使用するかどうか
         */
        cIsUseOption : function () { 
            if ( ! this.dIsMounted ) return false ; 

            const ref = this.$refs.optionSelect ; 
            if ( ref === undefined ) return false ;             
            return ref.cList.length > 0 ; 
        } , 
        
        
        /**
         * 変更前の生産先
         */
        cFromMProduction : function() { 
            if ( _.isNil(this.info) || this.info.fromMProductionId === 0 ) return undefined ; 

            const foundMProduction = this.masterStore.getMProductionById(this.info.fromMProductionId) ; 
            return foundMProduction ; 

        } , 
        /**
         * 変更先の生産先
         */
        cToMProduction : function() { 
            if ( _.isNil(this.info) || this.info.toMProductionId === 0 ) return undefined ; 
            
            const foundMProduction = this.masterStore.getMProductionById(this.info.toMProductionId) ; 
            return foundMProduction ; 

        } , 
        /**
         * 変更先のMProductionId
         */
        cToMProductionId : function() { 
            if ( _.isNil(this.info)) return 0 ;

            return this.info.toMProductionId ; 
        } , 
        /**
         * 変更先の工程ID
         */

        cMProcessCategoryId : function() { 
        
            if ( _.isNil(this.info?.group)) return 0 ;

            if ( this.info.group.t_project_product_processes.length === 0 ) return 0 ; 
            

            return this.info.group.t_project_product_processes[0].m_process_category_id ; 
        } , 
        /**
         * 変更前、先の生産先文字
         */
        cFromToMProductionName : function() { 
            let name = "" ; 
            if (this.cFromMProduction !== undefined ){
                 name += this.cFromMProduction.name + " から " ; 
            }
            if (this.cToMProduction !== undefined ){
                 name += this.cToMProduction.name  ; 
            }

            return name ; 
        } , 
        /**
         * 変更しようとしているジョブのリスト
         */
        cList : function() { 
            if ( _.isNil(this.info?.group)) return [] ; 

            //console.log("cList changed") ; 
            return this.info.group.t_project_product_processes ; 
        } , 

        /**
         * 一括モード変更のID
         */
        cSelectedChangingAllMProductionModeId : { 
            get :  function() {            
                return this.dSelectedChangingAllMProductionModeId  ; 
            }  ,
            set : function(val) { 
                this.dSelectedChangingAllMProductionModeId = val ; 

                if ( val !== 0 ){
                    this.cList.forEach(x => x.tmp_to_m_production_mode_id = val) ; 
                }
            }

        } , 

    } ,
    methods : {
        init : function () {
            // 検索結果・選択状態を初期化
            $("#productionChangeModal").modal("show") ; 

        } ,
        hide : function () {
            // 呼び出し元の取引先とのチェック

            // 生産先、モード、Optionの反映
            for ( const row of this.cList ) {
                const tgtProdNo = row.tmp_target_production_no ; 

                row[`m_production_id_${tgtProdNo}`]         = this.cToMProductionId ; 
                row[`m_production_mode_id_${tgtProdNo}`]    = row.tmp_to_m_production_mode_id; 
                row[`m_production_option_id_${tgtProdNo}`]  = row.tmp_to_m_production_option_id; 

                // console.log("row mp " + row["m_production_id_01"]) ; 
            }

            this.close() ; 
            // 呼び出し元のイベントを駆動して画面を非表示
            
            //console.log(this.cList) ; 
            this.$emit('ok' , this.info.group ) ;

            
        } ,
        cancel : function() { 

            this.close() ; 

            this.$emit('cancel') ;


        } , 
        close : function() { 
            
            // tmp系の削除
            for ( const row of this.cList ) {
                delete row.tmp_to_m_production_mode_id ; 
                delete row.tmp_to_m_production_option_id ;
            }

            $("#productionChangeModal").modal("hide") ; 
            this.dSelectedChangingAllMProductionModeId = 0 ; 
        } , 
    } ,
    watch : {
        isOpen : function (newVal) {
            if (newVal) {
                // openフラグをResetして起動時のみ処理する
                this.$emit("update:is-open", false) ;

                // 検索結果・選択状態を初期化
                this.init() ;

            }
        } ,
    },
    created : function () {
    } ,
    mounted : function() { 
        this.dIsMounted = true ; 
    }
}
</script>
