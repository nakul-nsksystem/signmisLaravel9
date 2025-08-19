<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\NotFoundErrorException ; 
use App\Models\MProductCategory;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;


class MMatrixApiController extends BaseApiController
{

    private $mMatrixDetailTName = "m_matrix_details" ; 

    private $mMatrixDetailsColumns = ""; 

    private $cacheKey = "m_matrices" ; 


    private function getBuilder() : Builder
    {
        return $this->model
            ::with("MMatrixDetails" . $this->mMatrixDetailsColumns) ; 
    }
    

    /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = "App\Models\MMatrix" ;

        $this->mMatrixDetailsColumns = ":" 
            . "$this->mMatrixDetailTName.id,"
            . "$this->mMatrixDetailTName.m_matrix_id," 
            . "$this->mMatrixDetailTName.order_no," 
            . "$this->mMatrixDetailTName.k1," 
            . "$this->mMatrixDetailTName.k1_description," 
            . "$this->mMatrixDetailTName.k2," 
            . "$this->mMatrixDetailTName.k2_description," 
            . "$this->mMatrixDetailTName.k3," 
            . "$this->mMatrixDetailTName.k3_description," 
            . "$this->mMatrixDetailTName.k4," 
            . "$this->mMatrixDetailTName.k4_description," 
            . "$this->mMatrixDetailTName.val1," 
            . "$this->mMatrixDetailTName.val2" 
            ; 
        
    }


    public function index()
    {
        
        // $data = $this->getBuilder()->get() ;
        $data = $this->getByCache() ;           
        return $data->sortBy("MMatrix.order_no")->values()->all();        

    }

    protected function getByCache()
    {
        $data = Cache::get($this->cacheKey, function () {
            return $this->getBuilder()->get()  ;
        });
        return $data ;
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $row = $this->getBuilder()
            ->find($id);
        
        if (! $row){
            $error = new NotFoundErrorException() ; 
            throw $error ; 
        }
        
        return $row ; 
    }
    

    

}
