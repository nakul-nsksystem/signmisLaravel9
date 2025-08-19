<?php

namespace App\Http\Controllers\Api;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Exceptions\DbSaveErrorException ;
use App\Exceptions\NotFoundErrorException ;
use App\Http\Controllers\Controller;
use App\Http\Controllers\QRCodeController;

use DateTime;

class TProjectConstructionApiController extends BaseApiController
{
    /**
     * constructor.
     *
     */
    public function __construct()
    {
        $this->model = "App\Models\TProjectConstruction" ;
    }


    private $constructionUserColumns = ":id,t_project_construction_id,m_user_id" ;
    private $tProjectColumns = ":id,m_branch_id,cd,name" ;
    private $mCustomerColumns = ":short_name_or_name" ;


    public function index()
    {
        $data = $this->model::with("TProjectConstructionUsers" . $this->constructionUserColumns )->get();
        return $data;

    }



    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $row = $this->model
                    // ::with("TProjectConstructionUsers" . $this->constructionUserColumns )
                    ::with("TProjectConstructionUsers" )
                    ->with("TProjectConstructionUsers.MUser")
                    ->with("TProjectConstructionUsers.OutSourceMCustomer")
                    // ->with("TProjectConstructionResults")
                    // ->with("TProjectConstructionResults.TProjectConstructionResultUsers")
                    // ->with("TProjectConstructionResults.TProjectConstructionResultUsers.MUser")
                    // ->with("TProjectConstructionResults.TProjectConstructionResultUsers.OutSourceMCustomer")
                    // ->with("TProjectConstructionResults.TProjectConstructionResultPictures")
                    // ->with("TProjectConstructionResults.TProjectConstructionResultCosts")
                    ->with("TProject:id,m_branch_id,cd,name")
                    ->find($id);

        if (! $row)
        {
            $error = new NotFoundErrorException() ;
            throw $error ;
        }
        return $row ;
    }
    public function showWithResults($id)
    {
        $row = $this->model
                    // ::with("TProjectConstructionUsers" . $this->constructionUserColumns )
                    ::with("TProjectConstructionUsers" )
                    ->with("TProjectConstructionUsers.MUser")
                    ->with("TProjectConstructionUsers.OutSourceMCustomer")
                    ->with("TProjectConstructionResults")
                    ->with("TProjectConstructionResults.TProjectConstructionResultUsers")
                    ->with("TProjectConstructionResults.TProjectConstructionResultUsers.MUser")
                    ->with("TProjectConstructionResults.TProjectConstructionResultUsers.OutSourceMCustomer")
                    ->with("TProjectConstructionResults.TProjectConstructionResultPictures")
                    ->with("TProjectConstructionResults.TProjectConstructionResultCosts")
                    ->with("TProject:id,m_branch_id,cd,name")
                    ->find($id);

        if (! $row)
        {
            $error = new NotFoundErrorException() ;
            throw $error ;
        }
        return $row ;
    }

    public function searchByYm($year ,$month)
    {
        $dateBase = DateTime::createFromFormat('Y-m-d', "${year}-${month}-01");
        $dateFrom = $dateBase->format('Y/m/d') ;
        $dateTo = $dateBase->format('Y/m/t') ;

        $fields = [
            'id','t_project_id' ,'construction_at' ,"start_time" ,"end_time" ,"is_night_work" ,"is_holiday_work" ,
            "construction_to" ,"construction_address" , "memo"] ;


        $rows = $this->model::
            with("TProjectConstructionUsers")
            ->with("TProject" . $this->tProjectColumns)
            // ->with("TProject.MCustomer")
            ->whereBetween("construction_at" , [$dateFrom , $dateTo ])
            ->get($fields) ;

        return $rows;
    }

    /**現場施工指示書 */
    public function createConstructionDirection($tProjectId, $view = null)
    {
        $qr = new QRCodeController ;

        $header = $this->model
            ::where("t_project_id",$tProjectId)
            ->with("TProject" . $this->tProjectColumns)
            ->with("TProjectConstructionUsers.MUser")
            ->with("TProjectConstructionUsers.OutSourceMCustomer")
            ->get() ;

        //QRコード
        foreach($header as $construct){

            $construct->qrcode = $qr->generateQRCode4TProjectConstruction($construct->id) ;
            // $construct->t_project_cd = $construct->TProject->cd ;
        
        }

        
        $tProjectCd = $header[0]->TProject->cd ;

        $tProjectQr = $qr->generateQRCode4TProject($tProjectId) ;
        // $test = json_decode(json_encode($header), true) ;
        // log::debug($test) ;
        $date4filename = date("YmdHis");

        if (isset($view)) {
            $isView = true ;
            // View(blade)で開く
            return view('t_projects.construction_direction.construction_direction', compact('header',"tProjectQr",'isView')) ;

        } else {
            // Laravel-SnappyPDFを利用
            $constructionDirection = \SnappyPDF::loadView('t_projects.construction_direction.construction_direction', compact('header',"tProjectQr")) ;
            return $constructionDirection->stream('現場指示書-' .  $tProjectCd . '@' . $date4filename .'.pdf') ;
        }
    }




}
