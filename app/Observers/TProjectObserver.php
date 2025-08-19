<?php

namespace App\Observers;

use App\Models\TProject as ModelsTProject;
use App\TProject;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class TProjectObserver
{
    
    /**
     * Handle the t project "saved" event.
     *  子テーブル含めた最終更新日、更新者取得
     *
     * @param  \App\TProject  $tProject
     * @return void
     */
    public function saved(ModelsTProject $tProject)
    {
        //Log::debug($tProject) ; 
        //
        $lastUpdatedAt = $tProject->updated_at ; 
        $lastUpdatedUserId = $tProject->updated_m_user_id ; 

        // Products
        if ( isset($tProject["TProjectProducts"])){
            foreach ($tProject["TProjectProducts"] as $product){
                if ( $product->updated_at > $lastUpdatedAt){
                    $lastUpdatedAt      = $product->updated_at ; 
                    $lastUpdatedUserId  = $product->updated_m_user_id ; 
                } 
                if ( isset($product["TProjectProductProcesses"])){
                    foreach ($product["TProjectProductProcesses"] as $productProcess) {
                        if ( $productProcess->updated_at > $lastUpdatedAt){
                            $lastUpdatedAt      = $productProcess->updated_at ; 
                            $lastUpdatedUserId  = $productProcess->updated_m_user_id ; 
                        } 
                    }
                }
                if ( isset($product["TProjectProductSeparates"])){
                    foreach ($product["TProjectProductSeparates"] as $productSeparate) {
                        if ( $productSeparate->updated_at > $lastUpdatedAt){
                            $lastUpdatedAt      = $productSeparate->updated_at ; 
                            $lastUpdatedUserId  = $productSeparate->updated_m_user_id ; 
                        } 
                    }
                }
                if ( isset($product["TProjectProductBoardlayouts"])){
                    foreach ($product["TProjectProductBoardlayouts"] as $productBoardLayout) {
                        if ( $productBoardLayout->updated_at > $lastUpdatedAt){
                            $lastUpdatedAt      = $productBoardLayout->updated_at ; 
                            $lastUpdatedUserId  = $productBoardLayout->created_m_user_id ; 
                        } 
                    }
                }
            }
    
        }

        // Constructions
        if ( isset($tProject["TProjectConstructions"])){
            foreach ($tProject["TProjectConstructions"] as $construction){
                if ( $construction->updated_at > $lastUpdatedAt){
                    $lastUpdatedAt = $construction->updated_at ; 
                    $lastUpdatedUserId = $construction->updated_m_user_id; 
                } 

                if ( isset($construction["TProjectConstructionUsers"])){
                    foreach ($construction["TProjectConstructionUsers"] as $constructionUser){
                        if ( $constructionUser->updated_at > $lastUpdatedAt){
                            $lastUpdatedAt = $constructionUser->updated_at ; 
                            $lastUpdatedUserId = $constructionUser->updated_m_user_id ; 
                        } 
                    }
                }
                
            }
        }

        // Mail
        if ( isset($tProject["TProjectMails"])){
            foreach ($tProject["TProjectMails"] as $mail){
                if ( $mail->updated_at > $lastUpdatedAt) {
                    $lastUpdatedAt = $mail->updated_at ; 
                    $lastUpdatedUserId = $mail->updated_m_user_id; 
                }                
            }
        }
        
        
        // File
        if ( isset($tProject["TProjectFiles"])){
            foreach ($tProject["TProjectFiles"] as $file){
                if ( $file->updated_at > $lastUpdatedAt){
                    $lastUpdatedAt = $file->updated_at ; 
                    $lastUpdatedUserId = $file->updated_m_user_id ; 
                } 
            }
        }

        
        // Delivery
        if ( isset($tProject["TProjectDeliveries"])){
            foreach ($tProject["TProjectDeliveries"] as $delivery){
                if ( $delivery->updated_at > $lastUpdatedAt){
                    $lastUpdatedAt = $delivery->updated_at ; 
                    $lastUpdatedUserId = $delivery->updated_m_user_id ; 
                } 
            }
        }
                        
        
        $tProject->inc_children_updated_at = $lastUpdatedAt ; 
        $tProject->inc_children_updated_m_user_id = $lastUpdatedUserId ; 

        // イベント一時退避 
        // Todo: laravel8 にアップしたら　->saveQuietly();　を使う
        //$dispatcher = ModelsTProject::getEventDispatcher();
        //ModelsTProject::unsetEventDispatcher();
        //$tProject->timestamps = false ; 
        $tProject->saveQuietly();
        // イベント復帰
        //ModelsTProject::setEventDispatcher($dispatcher);

    }
    
 
}
