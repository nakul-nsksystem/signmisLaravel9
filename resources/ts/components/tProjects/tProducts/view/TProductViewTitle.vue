<template>
    <div class="d-flex flex-wrap flex-xl-nowrap border-bottom" v-if="!isDelivery">
        <h5 class="text-break flex-fill">{{value.name}}</h5>
        <!-- <h5 v-if="value.delivery_date !== undefined && value.delivery_date != null" 
            class="pr-3 text-nowrap text-lightDanger">納期:{{$$formatDay(value.delivery_date)}}</h5>            
        <h5 v-else class="pr-3 text-nowrap text-success">納期:{{cProjectDeliveryAt}}</h5> -->
        <h5 class="pr-2 text-nowrap">x&nbsp;{{value.qty}}</h5>
        <div class="d-flex flex-column text-right">
            <div v-for="delivery in value.t_project_deliveries">
                <h5 class="pr-3 text-nowrap text-success">{{delivery.delivery_m_kv.kv_name}}:{{cFormatDate(delivery.delivery_at)}}{{cDelQty(delivery)}}</h5>
            </div>
        </div>

    </div>
    <div class="d-flex flex-wrap flex-xl-nowrap border-bottom" v-else>
        <h5 class="text-break flex-fill">{{value.name}}</h5>
        <!-- <div class="mr-3">
            <ns-checkbox-input
                v-model="value.is_partical_delivery"
                :label="'分納'"
                :id="`particalDeliveryCheckBox${value.uid}`"
                />
        </div>
        
        <ns-number-input
            v-model="value.deliveryQty"
            v-if="value.is_partical_delivery"
            class="app-input-size mr-3"
            /> -->
        <h5 class="pr-2 text-nowrap">x&nbsp;{{value.qty}}</h5>
        <!-- <div class="d-flex flex-column text-right">
            <div v-for="delivery in value.t_project_deliveries">
                <h5 class="pr-3 text-nowrap text-success">{{delivery.delivery_m_kv.kv_name}}:{{cFormatDate(delivery.delivery_at)}}{{cDelQty(delivery)}}</h5>
            </div>
        </div> -->
    </div>
</template>

<script>
import DayJsEx from '../../../../frameworks/DayJsEx';
import ObjectUtil from '../../../../frameworks/ObjectUtil';

export default {
  
    data :  function() {
        return {
        } 
    } , 
    props : {
        /**
         * t_project_productsのレコード
         */
        value : {
            type : Object , 
            
        } , 

        /**
         * 納品紐づけで使用（分納チェック、数量入力）
         */
        isDelivery : {
            type : Boolean , 
            default : () => false ,
        }
    } ,
    computed : {
        cProjectDeliveryAt : function() { 
            
            const minDelivery = this.value?.t_project?.min_delivery ; 
            if ( ObjectUtil.isNU( minDelivery?.delivery_at ) ){                
                if ( _.isNil(this.value?.calced_delivery_date)) return "" ; 
                return DayJsEx.formatDate(this.value?.calced_delivery_date); 
            } 

            const at = DayJsEx.formatDate(minDelivery["delivery_at"] )  ; 
            const time = ObjectUtil.nu2ec(minDelivery["delivery_time"])   ; 
            return `${at} ${time}` ; 
        } ,

        cFormatDate : function() {
            return function(date) {
                if(_.isNil(date)) return "" ;
                return DayJsEx.formatDate(date)
            }
        } ,
        cDelQty : function() {
            return function(tDelivery) {
                if(!this.value.is_partical_delivery) return "" ;
                return "×" + tDelivery.t_project_delivery_product_link.qty ;
            }
        }
        
    } ,
    methods : {
    }

}
</script>