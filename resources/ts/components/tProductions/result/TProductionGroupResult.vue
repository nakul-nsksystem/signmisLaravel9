<template>                    
    <div class="row">       




        <div class="col-12 px-0">
            <div class="card rounded-0 bg-app-dark-secondary ">
                <div class="card-header d-flex">
                    <div class="flex-grow-0 flex-shrink-0 ">
                        生産実績
                    </div>
                    <div class="flex-grow-1 flex-shrink-1 d-flex">
                        <div class="ml-auto">
                            <button
                                type="button" class="btn btn-primary ml-2" 
                                @click.prevent="addResult"
                                >
                                <i class="fas fa-plus fa-fw"></i>                                
                            </button>  
                            <button
                                type="button" class="btn btn-success ml-2" 
                                @click.prevent="addOptionResult"
                                >
                                <i class="fas fa-plus fa-fw"></i>                                
                                オプション実績
                            </button>  
                        </div>
                    </div>

                </div>
                <!-- <div class="card-body"> -->
                <div>
                    <div v-for="(n , index ) in value" :key="index">
                        <t-production-group-result-row 
                            v-if="getIsNotDeleted(n)"
                            v-model="value[index]"
                            :m-branch-id="mBranchId"
                            :result-day="resultDay"
                            @remove="removeResult"
                        />

                        
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
        
</template>

<script lang="ts">
// @ts-nocheck
import _ from "lodash" ; 
import { TProductionResult } from '../class/models/TProductionResult';
import MKvsConst from '../../../consts/MKvsConst';

export default {
    data :  function() {
        return {

        } 
    } , 
    props : {
        /**
         * t_production_resultsのデータ
         */
        value : {
            type : Array ,
            default : () => [] , 
        } , 
        /**
         * 拠点ID
         */
        mBranchId : {
            type : Number ,
        } ,
        /**
         * 生産先ID
         */
        mProductionId : { 
            type : Number ,
        } , 
        /**
         * 生産実績デフォルト日
         */
        resultDay : { 
            type : Object|Date , 
        } , 



    } , 
    computed : {




    } , 
    methods : {
        /**
         * 削除チェック
         */
        getIsNotDeleted : function(n) { 
            return _.isNil(n.deleted_at) ; 
        } , 
        /**
         * 追加
         */
        addResult : function() { 
            // @ts-ignore
            const result = TProductionResult.createAsOnlyFInished(
                this.$$cLoginUserId , this.mProductionId ,this.resultDay) ;             
            
            // @ts-ignore
            this.value.push(result) ; 
        } , 

        /**
         * オプション実績の追加
         */
        addOptionResult : function() { 

            // @ts-ignore
            const result = TProductionResult.createAsOnlyFInished(
                this.$$cLoginUserId , this.mProductionId , this.resultDay) ;             
            result.input_type_m_kv_id = MKvsConst.TProductions.Results.InputTypes.ONLY_MINUTES
            result.result_type_flg = 1 ; // Option
            
            // @ts-ignore
            this.value.push(result) ; 
        } , 
        removeResult : function(result:TProductionResult) { 
            
            if ( _.isNil( result.id)){
                
                const idx = this.value.indexOf(result) ;                 
                this.value.splice(idx , 1 ) ; 
            }
            else { 
                result.deleted_at = new Date() ;
                 
            }

        } , 

        /**
         * 更新
         * 親から呼び出し
         */
        updateValue : function(toValues) { 

            
            for ( const row of this.value) { 
                row.updated_m_user_id = this.$$cLoginUserId; 
                if ( row.t_production_result_stops === undefined) row.t_production_result_stops = [] ; 
                for ( const s of row.t_production_result_stops){
                    s.updated_m_user_id = this.$$cLoginUserId;                     
                }

                for ( const u of row.t_production_result_users){
                    delete u.id ; 
                    u.created_m_user_id = this.$$cLoginUserId;                     
                }
                
            }

            const addedList = [] ; 
            const deleteList = [] ; 
            
            

            if ( toValues.length === 0 ) { 
                // console.log("legth 0 " ) ; 
                // console.log(this.value) ; 
                addedList.push(...this.value) ; 
            }
            else { 
                // 削除
                for ( const r of toValues) { 
                    const found = this.value.find(x => x.tmp_id == r.tmp_id) ;  
                    if ( found === undefined ){
                        deleteList.push(r) ; 
                    }                
                }

                // 追加・変更
                for ( const r of this.value ) { 
                    // console.log("tmp_id = " + r.tmp_id) ; 
                    const found = toValues.find(x => x.tmp_id == r.tmp_id) ;  
                    if ( found === undefined ) { 
                        addedList.push(r) ; 
                    }
                    else { 
                        Object.assign(found ,r ); 
                    }
                }
            }

            toValues.push(...addedList) ; 
            for ( const row of deleteList){

                const idx = toValues.indexOf(row) ; 
                const found = toValues[idx] ; 
                if ( found !== undefined ){
                    if ( _.isNil(found.id)){
                        toValues.splice(idx , 1  ) ; 
                    }
                    else { 
                        found.deleted_at = new Date() ; 
                    }
                }
            }
            
            

        } , 


    } ,
    created : function() {
    }
}
</script>