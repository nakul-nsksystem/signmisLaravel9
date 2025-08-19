<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\NotFoundErrorException ; 
use App\Models\MCalendar;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class MCalendarApiController extends BaseApiController
{

    protected $filters = array(

        "category_m_kv_id" => array() ,
    ) ;
    /**
     * constructor.
     *     
     */
    public function __construct()
    {
        $this->model = MCalendar::class ;
    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = $this->model::with(
            'MBranch:id,name,short_name',
            'CategoryMKv:id,kv_name'
            )->get();
        return $data;
    }

    public function retrieve(Request $req)
    {
        $reqAll = $req->all() ; 
        $res = $this->getFiltered($req)
                    ->with("MBranch:id,name,short_name")
                    ->with("CategoryMKv:id,kv_name")
                    ->orderBy('day','desc') 
                    ->orderBy('id','desc')
                    ->paginate() ; 
        return $res; 
    }

    public function getByRange(Request $req){
        $data = $req->validate([
            'm_branch_id' => 'integer|nullable',
            'from' => 'string',
            'to' => 'string' , 
        ]);

        $mBranchId = intval($data["m_branch_id"]) ; 
        $from   = $data["from"] ; 
        $to     = $data["to"] ; 

        $query = $this->model::whereBetween("day" ,[$from ,$to]) ; 

        // 休みの日のみ
        $query->where("category_m_kv_id" ,1280003) ; 

        if ( $mBranchId !== 0  ){
            $query
                ->where(function($query) use ($mBranchId) {
                    $query
                        ->where("m_branch_id" ,$mBranchId )
                        ->orWhereNull("m_branch_id" )  ;
                })
                ; 
        }
        else { 
            $query
                ->whereNull("m_branch_id" ) ; 
        }

        // return $query->toSql() ; 
        $query->select([
            "id" ,
            "day" ,
            "calendar_note" ,
            "start_time" ,
            "end_time"
            ]) ; 

        return $query->get() ; 
        
    }

}
