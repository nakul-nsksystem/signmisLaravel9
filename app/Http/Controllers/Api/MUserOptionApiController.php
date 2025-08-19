<?php

namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\Auth;

use App\Exceptions\NotFoundErrorException ; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MUserOptionApiController extends BaseApiController
{

    /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = "App\Models\MUserOption" ;
    }
    
    public function findByMUserId($mUserId)
    {

        $rows = $this->model
            ::with('SmUserOption.KeyMKv')
            ->where('m_user_id' , $mUserId)->get();

        return $rows; 
    }


    public function updateOrCreateOptions(Request $request) 
    {
        $data = $request->all() ;


        foreach($data as $userOption) {

            // log::debug($userOption) ;

            $row = $this->model::updateOrCreate(
                ['id' => $userOption["id"]],
                [
                    'm_user_id' =>$userOption["m_user_id"] ,
                    'sm_user_option_id' =>$userOption["sm_user_option_id"] ,
                    'value' => $userOption["value"] ,
                    'target_value' => $userOption["target_value"] ,
                    'order_no' => $userOption["order_no"] ,
                
                ]
            );

        }
        $user = Auth::user() ;

        return $this->findByMUserId($user->id) ;
        
        
    }


}
