<?php

namespace App\Observers\Traits;

use App\Models\BaseModel;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * 保存後にPivot系のテーブルをSaved
 */
trait SavedPivotSyncTrait
{
    public function saved(BaseModel $model)
    {
        //Log::debug("Saved") ; 

        // Pivotの更新
        $pivotModels = $model->getSyncPivotModels() ; 
        $pivotValues = $model->getSyncPivotValues() ; 
        // Log::debug("Id " . $model->id) ; 
        // Log::debug($pivotModels) ; 
        foreach ($pivotModels as $tname => $tDef)
        {   
            // Load         
            //Log::debug($tname) ; 
            // $model->$tname ; 
            $pivotName = $tDef["pivotName"] ; 
            $pivotModel = $tDef["modelClass"] ;             
            $foreignKeyName = $tDef["foreignKey"] ; 
            $isSaveSelf = $tDef["isSaveSelf"] ?? false ; 
            $selfModel = $tDef["selfModel"] ?? null ; 
            
            $snakedTName = Str::snake($tname) ; 
            //  return ;
            // Log::debug("pivotValues") ;             
            // Log::debug($pivotValues) ; 
            
            if ( isset($pivotValues[$snakedTName])){
                // $model->$tname; 

                $tempPivotValues = $pivotValues[$snakedTName] ; 

                //Log::debug($snakedTName) ; 
                //Log::debug("pivotName $pivotName") ; 
                $pivotArr = [] ;             
                $pKeyName = $model->getKeyName() ; 
                foreach ($tempPivotValues as $val){
                    
                    $pKey = $val[$pKeyName] ; 
                    $pivotArr[$pKey] = $val[$pivotName] ; 

                    // 自身のパラメータも保存する
                    
                    if ( $isSaveSelf){
                        // Log::debug("Self " . $pKey) ; 
                        if ($selfModel ){
                            $selfRow = $selfModel::find($pKey) ; 
                            $selfRow->fill($val) ; 
                            if ($selfRow->isDirty()){
                                // foreach ($selfRow->getAttributes() as $attr => $val) {                                
                                //     if ( $selfRow->isDirty($attr)) {
                                //         $org = $selfRow->getOriginal($attr) ; 
                                //         // Log::debug("Dirty {$attr} : {$org} -> {$val}") ; 
                                //     }
    
                                // }
                                $selfRow->save() ; 
                            }
                            
                            // Log::debug("isDirty" . $selfRow->isDirty() ) ; 
                            
                                
                        }
                    }
                    //Log::debug($pKey) ;
                    //Log::debug(print_r($pivotArr[$pKey] , true )) ; 
                }
    
                //Log::debug(print_r($pivotArr , true )) ; 
                
                $model->$tname()->sync($pivotArr) ;
            }
            else { 

                // 他でUpdateされた対策
                $cnt = $pivotModel::where($foreignKeyName ,$model->id )->count() ; 
                //Log::debug("cnt:" . $cnt) ; 
                if ( $cnt == 0 ){
                    //$model->$tname()->sync([]) ;
                }

                
            }
            


        }

        


    }
 
}
