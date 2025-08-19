<template>
    <div >
        <div v-if="cIsAbleToViewMaster">

            <validation-observer v-slot="{ invalid }" >                    
                <div class="row border-bottom" v-if="isEditable">
                    <div class="col-12 col-xl-8 pt-2">
                        <p class="h5 mb-0">付加情報</p>
                    </div>
                    
                    <div class="col-12 col-xl-4 mb-2" >
                        <div class=" d-flex">
                            <div class="ml-auto">
                                <button
                                    @click.prevent="save"
                                    :disabled="invalid || isSaving"
                                    type="button" class="btn btn-success" >
                                    <i class="fas fa-save fa-fw"></i>
                                    保存
                                </button>

                                <button type="button" class="btn btn-primary" @click.prevent="add">
                                    <i class="fas fa-plus fa-fw" />
                                    新規作成
                                </button>

                            </div>
                        </div>
                    </div>

                </div>

                <div class="row">
                    <div class="col-12">
                        <div class="table-responsive  mx-n3">
                            <table class="table table-striped table-dark" 
                                :class="{'table-hover' : ! isEditable }">
                                <thead>
                                    <tr class="text-nowrap" >
                                        <th scope="col" style="width:200px;"  >カテゴリ</th>
                                        <th scope="col" style="min-width:120px;" >タイトル</th>
                                        <th scope="col" class="text-center" style="width:300px;" >値</th>
                                        <th scope="col">&nbsp;</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(n,index) in cInfos" :key="index">
                                        <td>
                                            
                                            <validation-provider       
                                                v-if="n.id === undefined"                                                                                                 
                                                :vid="`MCustomerInfoEdit-category_m_kv_id${index}`"
                                                rules="required|excluded:0" 
                                                name="カテゴリ"
                                                immediate v-slot="{ errors }">

                                                <div>                                                    
                                                    <m-kv-select
                                                        v-model="n.category_m_kv_id"
                                                        :selected-item.sync="n.category_m_kv"
                                                        :kv-key="'m_customer_info_cateogry'"
                                                    />
                                                </div>
                                                <span class="validation-error">{{ errors[0] }}</span>
                                            </validation-provider>
                                            <span v-else>
                                                {{getMKvName(n.category_m_kv_id)}}
                                            </span>
                                            
                                        </td>
                                        <td>
                                            <div v-if="getIsAbleToEdit(n.category_m_kv)">
                                                <validation-provider
                                                    :vid="`MCustomerInfoEdit-title${index}`"
                                                    rules="required" 
                                                    name="タイトル"
                                                    immediate 
                                                    v-slot="{ errors }">
                                                    <input class="form-control" v-model="n.title" type="text" />
                                                    <span class="validation-error">{{ errors[0] }}</span>                                                        
                                                </validation-provider>                                                    
                                            </div>
                                            <div v-else>
                                                <validation-provider
                                                    v-if="n.category_m_kv !== undefined && n.id === undefined"
                                                    :vid="`MCustomerInfoEdit-notAbleToEdit${index}`"
                                                    rules="required|excluded:0" 
                                                    name="権限なし"
                                                    immediate v-slot="{ errors }">
                                                    <div>                                                    
                                                        <input class="d-none" v-model.number="dDummyValidation" />
                                                    </div>
                                                    <span class="validation-error" v-show="errors.length > 0">選択されたカテゴリの編集権限がありません。</span>
                                                </validation-provider>
                                                {{n.title}}
                                            </div>
                                            
                                        </td>
                                        <td>
                                            <div v-if="getIsAbleToEdit(n.category_m_kv)">
                                                <div v-if="getValueType(n.category_m_kv) == 'number'">
                                                    <validation-provider
                                                        :vid="`MCustomerInfoEdit-value-number${index}`"
                                                        rules="required|excluded:0" 
                                                        name="値"
                                                        immediate 
                                                        v-slot="{ errors }">
                                                        <ns-number-input v-model="n.NumberValue" />
                                                        <span class="validation-error">{{ errors[0] }}</span>                                                        
                                                    </validation-provider>       
                                                </div>
                                                <div v-else>
                                                    <validation-provider
                                                        :vid="`MCustomerInfoEdit-value-string${index}`"
                                                        rules="required" 
                                                        name="値"
                                                        immediate 
                                                        v-slot="{ errors }">
                                                        <input class="form-control" v-model="n.value" />
                                                        <span class="validation-error">{{ errors[0] }}</span>                                                        
                                                    </validation-provider>       
                                                </div>
                                                
                                            </div>

                                            
                                            <div v-else>

                                                <div v-if="getValueType(n.category_m_kv) == 'number'" class="text-right">
                                                    {{Number(n.value).toLocaleString()}}
                                                </div>
                                                <div v-else>
                                                    {{n.value}}
                                                </div>
                                                
                                            </div>
                                        </td>
                                        <td>
                                            <button v-if="getIsAbleToEdit(n.category_m_kv) || n.id === undefined"
                                                    type="button" class="btn btn-danger" @click.prevent="destroy(n)">
                                                <i class="fas fa-trash fa-fw" />                            
                                            </button>    
                                            &nbsp;                 
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
                
            </validation-observer>
        </div>
        <div v-else class="text-danger">
            表示する権限がありません。
        </div>
    </div>
</template>

<script>
import PageMixins from '@mixins/commons/PageMixins' ;
import NumberUtil from '../../../frameworks/NumberUtil';
import { MCustomerInfo } from '../class/models/MCustomerInfo';

export default {
    mixins : [PageMixins] , 
    data : function () {
        return {                   
            dDummyValidation : 0 , 

        }
    } ,
    props : { 
        /**
         * MCustomerInfoの配列
         */
        value: { 
            type : Array , 
            default : () => [] ,
        } , 
        isEditable : { 
            type : Boolean , 
            default : () => false 
        } ,
        /**
         * MCustomer.SalesMUserId
         */
        customerSalesMUserId : { 
            type : Number , 
            default : () => 0 ,
        } ,
        isSaving : { 
            type : Boolean , 
            default : () => false 
        }
    } , 
    computed : {
        
        cIsShow : function () {
            return true  ;
        } ,

        cInfos : function() { 
            let list = this.value.filter( x => {
                if ( ! _.isNil(x.deleted_at)) return false ; 

                if (x.id === undefined ) return true ; 

                const roleLv = this.getRoleLv(x.category_m_kv) ;                 
                const neededLvToView = NumberUtil.invalid2zr(x.category_m_kv.g_03)  ; 

                if ( roleLv < neededLvToView) return false ; 

                if ( x.category_m_kv.g_06 == "1" && ! this.cIsSalesAndLoginUserSame) return false ; 
                

                return true ; 
            }) ;  

            
            
            return list ; 
        } ,
        /**
         * 営業担当＝ログインユーザー
         */
        cIsSalesAndLoginUserSame : function() { 
            return this.customerSalesMUserId == this.$$cLoginUserId ; 
        } , 
        /**
         * m_customer_info-privilege 閲覧権限
         */
        cIsAbleToViewMaster : function() { 
            const roleLv = NumberUtil.invalid2zr(this.mainStore.getRole('m_customer_info-privilege',true )) ;
            if ( roleLv >= 20 ) return true ; 

            return (roleLv >= 10  && this.cIsSalesAndLoginUserSame ); 
        } , 
    } ,
    methods : {
        save : async function() { 
            this.$emit("save" ) ; 

        } , 
        getValueType : function(mKv){
            if (_.isNil(mKv)) return "" ; 
            return mKv.g_01  ;

        } ,               
        getRoleLv : function(mKv){
            if (_.isNil(mKv)) return 100 ; 
            // console.log("mKv.g_02 : " + mKv.g_02 ) ; 
            const roleLv = NumberUtil.invalid2zr(this.mainStore.getRole(mKv.g_02 ,true)) ;
            // console.log("getRoleLv : " + roleLv ) ; 
            return roleLv ; 

        } ,               
        getIsAbleToView : function(mKv){
            if (_.isNil(mKv)) return false ; 
            // g_01:値タイプ g_02:必要権限キー g_03:表示必要権限レベル g_04:編集必要権限レベル g_05:全権レベル g_06: 1の場合営業担当=ログインユーザー
            const neededLv = NumberUtil.invalid2zr(mKv.g_03)  ; 

            const userRoleLv = this.getRoleLv(mKv) ; 
            if ( userRoleLv >= 100 ) return true ; 

            let isOk = userRoleLv >= neededLv  ; 
                        
            // 営業担当=ログインユーザー
            if ( mKv.g_06 == "1" && ! this.cIsSalesAndLoginUserSame) isOk = false ; 

            return isOk; 

        } ,  
        getIsAbleToEdit : function(mKv){
            if ( ! this.isEditable ) return false ; 
            if (_.isNil(mKv)) return false ; 

            const userRoleLv = this.getRoleLv(mKv) ; 
            if ( userRoleLv >= 100 ) return true ; 

            // g_01:値タイプ g_02:必要権限キー g_03:表示必要権限レベル g_04:編集必要権限レベル g_05:全権レベル g_06: 1の場合営業担当=ログインユーザー
            const neededLv = NumberUtil.invalid2zr(mKv.g_04)  ; 
            console.log("lv :" + this.getRoleLv(mKv) + "  needed:" + neededLv)
            
            let isOk = userRoleLv >= neededLv  ; 

            
            
            // 営業担当=ログインユーザー
            if ( mKv.g_06 == "1" && ! this.cIsSalesAndLoginUserSame) isOk = false ; 

            return isOk; 

        } ,
        getMKvName : function(id){
            return this.masterStore.getMKvById(id)?.kv_name ; 
        } ,
        add : function(){
            const newRow = new MCustomerInfo(this.$$cLoginUserId)  ; 
            this.value.push(newRow) ; 
        } , 
        destroy : function(row) { 
            if (!confirm('削除してもよろしいですか?')) return ;

            const idx = this.value.indexOf(row) ; 
            if ( idx !== -1 ){
                if (! _.isNil( this.value[idx].id)){
                    this.value[idx].deleted_at = new Date()  ; 
                }
                else { 
                    this.value.splice(idx, 1) ;
                }
                
            }

        } , 
    } ,
    created : function () {
        
    } ,
}
</script>