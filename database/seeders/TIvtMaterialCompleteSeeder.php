<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;

class TIvtMaterialCompleteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // $mkvids = [5010010,5010020,5010030] ;
        
        $arr = array(
            'id' => 10117 ,
            'm_branch_id' => 1 ,
            'supplier_m_customer_id' => 10190 ,
            'm_material_detail_id' => 1100102 ,
            'ivt_m_kv_id' => 5010030,
            'conducted_at' => '2023-02-20 00:00:00',
            'qty' => 10,
            'price' => 1762500,
            'total_price' => 1762500,
            'created_m_user_id' => 0 ,
            'updated_m_user_id' => 0 ,
        ) ;
        $arr2 = array(
            'm_material_detail_id' => 1100102 ,
            't_ivt_material_id' => 10117,
            'completed_at' => '2023-02-20 00:00:00',
            'qty' => 10,
            'total_price' => 1762500,
            'created_m_user_id' => 0 ,
            'updated_m_user_id' => 0 ,
        ) ;



        // log::debug($arr);
        //
        DB::table('t_ivt_materials')->insert($arr) ;
        DB::table('t_ivt_material_completes')->insert($arr2) ;
    }
}
