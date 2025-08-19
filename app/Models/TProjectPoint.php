<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;

class TProjectPoint extends BaseModel
{
    use SoftDeletes;

    protected $guarded = ['id', 'created_at', 'updated_at'];

    protected $casts = [
        'sales_per'                   => 'double',
        'prod_per'                    => 'double',
        'construct_coef'              => 'double',
        'create_coef'                => 'double',
    ];


    protected $unsetChildren = ["m_product_category", "warranty_m_kv", "specified_m_kv", "t_project_file", "t_project_deliveries"];


    protected $childModels =
    [];

    protected $delInsChildModels =
    [];


    public function TProject()
    {
        return $this
            ->belongsTo('App\Models\TProject')
            ->withTrashed();
    }
}
