<template>

    <div>
        <div class="table-responsive">
            <table class="table table-dark text-nowrap">
                <thead>
                    <tr>
                        <!-- <th scope="col">No.</th> -->
                        <th scope="col">納品形態</th>
                        <th scope="col">納品物名/個口</th>
                        <th scope="col">納期(出荷日)/納期時刻<br>着日/着日時刻</th>
                        <th scope="col">納品先名<br>TEL<br>納品先担当者<br>納品先住所</th>
                        <th scope="col">荷主名<br>TEL<br>荷主先担当者<br>荷主住所</th>
                        <th scope="col">備考</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(n,index) in value.t_project_deliveries" :key="index"                        
                        >
                        <template v-if="!n.deleted_at">
                            <!-- <td>{{index+1}}</td> -->
                            <td>{{n.delivery_m_kv.kv_name}}</td>
                            <td>{{n.delivery_product_name}}&nbsp;&nbsp;{{n.num_of_boxes}}</td>
                            <td>{{$$formatDay(n.delivery_at)}}&nbsp;&nbsp;{{n.delivery_time}}<br>{{$$formatDay(n.arrival_at)}}&nbsp;&nbsp;{{n.arrival_time}}</td>
                            <td>{{n.delivery_customer_name}}<br>{{n.delivery_customer_tel}}<br>{{n.delivery_customer_user}}<br>{{n.delivery_customer_address}}</td>
                            <td>{{n.delivery_owner_name}}<br>{{n.delivery_owner_tel}}<br>{{n.delivery_owner_user}}<br>{{n.delivery_owner_address}}</td>
                            <td>{{n.memo}}</td>
                        </template>
                    </tr>
                </tbody>
            </table>
        </div>        
    </div>
</template>

<script>

export default {
    data :  function() {
        return {



        } 
    } , 
    props : {
        /**
         * t_projectのレコード
         */
        value : {
            type : Object , 
            
        } , 
        
    } ,
    computed : {
        

    } ,
    methods : {

        

        
    }

}
</script>