<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;

class TProjectConstructionResultUser extends BaseModel
{
    use SoftDeletes;

    protected $guarded = ['id', 'created_at', 'updated_at' ];   
    
    protected $unsetChildren = ["m_branch_id_4_select" ,"is_outsource" ] ;   
    protected $casts = [
        'num_of_out_source_people' => 'int' , 
        'out_source_price'   => 'double',
        'out_source_total_price'   => 'double',
    ] ;  
    
    public function MUser()
    {
        return $this
            ->belongsTo('App\User' ,'m_user_id' ,'id')
            ->withTrashed();
    }

    public function OutSourceMCustomer()
    {
        return $this
            ->belongsTo('App\Models\MCustomer')
            ->withTrashed();
            
    }

}
