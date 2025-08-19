<?php

namespace App\Http\Controllers\Api;

use App\Models\MKvCategory;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;

class MKvCategoryApiController extends BaseApiController
{
    private $cacheKey = "m_kv_categories" ;

    /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = "App\Models\MKvCategory" ;
    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //$data = MKvCategory::with('MKvs')->get()->sortBy("m_kvs.order_no" );
        //$data = MKvCategory::with('MKvs')->orderBy('order_no')->get()->sortBy("order_no" );

        // $data = MKvCategory::with(['MKvs' => function ($query) {
        //     $query->orderBy('order_no', 'asc');
        // }])->get();
        $data = $this->getByCache() ;
        return $data->values()->all();
    }

    protected function getByCache () {

        $data = Cache::rememberForever($this->cacheKey, function () {
            return MKvCategory::with(['MKvs' => function ($query) {
                $query->orderBy('order_no', 'asc');
            }])->get();
        });

        return $data ;
    }

    public function indexByKvKey($key )
    {
        //$data = MKvCategory::all();
        $data = MKvCategory::with('MKvs')->where("kv_key" , $key )->get()->sortBy("order_no" );

        return $data;
    }

    



}
