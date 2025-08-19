<?php

namespace App\Http\Controllers\Api;

use App\User;
use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Exceptions\DbSaveErrorException ;
use App\Exceptions\NotFoundErrorException ;
use App\Http\Controllers\Controller;


use Illuminate\Support\Facades\Storage;

use Spatie\Dropbox\Client as DropboxClient;

use DateTime;

class TProjectConstructionResultApiController extends BaseApiController
{
    /**
     * constructor.
     *
     */
    public function __construct()
    {
        $this->model = "App\Models\TProjectConstructionResult" ;
    }

    public function index()
    {
        $data = $this->model::with("TProjectConstructionResultUsers" )->get();
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
                    ::with("TProjectConstructionResultUsers")
                    ->with("TProjectConstructionResultUsers.OutSourceMCustomer")
                    ->with("TProjectConstructionResultUsers.MUser")
                    ->with("TProjectConstructionResultPictures")
                    ->with("TProjectConstructionResultCosts")
                    ->find($id);

        if (! $row)
        {
            $error = new NotFoundErrorException() ;
            throw $error ;
        }
        return $row ;
    }


    public function update(Request $request, $id)
    {
        $row = $this->model::find($id);
        
        if (! $row) {
            $error = new NotFoundErrorException();
            throw $error;
        }

        $this->saveRow($request, $row);
        return $this->show($row["id"]);
    }

    protected function saveRow($request, $row)
    {
        $data = $request->all(); 
        $dropbox = app()->make('dropboxClient') ;
        $tProjectCd = $data["t_project_cd"] ;
        // log::debug($tProjectCd) ;

        foreach($data["t_project_construction_result_pictures"] as &$picture) {
                        
            $filepath4DBCli = substr($picture["filepath"], 1);
            // log::debug($filepath4DBCli) ;
            
            if(isset($picture["deleted_at"])) {

                Storage::delete($filepath4DBCli) ;                
            
            }

            $commonPath = "/public/t_project_construction/$tProjectCd" ;
            $commonPath4DBCli = substr($commonPath, 1); ;
            // log::debug($commonPath4DBCli) ;

            if($picture["is_unsave"]) {
                
                $fileName = $picture['filename'] ;
                
                try {

                    $dropbox->move($filepath4DBCli , "$commonPath4DBCli/$fileName") ;
                    $picture["filepath"] = "$commonPath/$fileName" ;

                } catch (\PDOException $pdoException){
                    $this->throwDbError($pdoException); 
                    $picture["filepath"] = "$commonPath/$fileName" ;

                }

            }
        }
        
        // 子供ごとSave        
        $row->fillIncChildren($data); 
        
        DB::beginTransaction();

        try {
            $row->push();

        } catch (\PDOException $pdoException) {
            $this->throwDbError($pdoException); 
        } catch (\Exception $e) { 
            DB::rollBack();
        }

        DB::commit(); 
    } 


}
