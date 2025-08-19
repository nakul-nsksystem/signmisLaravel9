<?php

namespace App\Providers;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;
use League\Flysystem\Filesystem;
use Spatie\Dropbox\Client as DropboxClient;
use Spatie\FlysystemDropbox\DropboxAdapter;
use Illuminate\Support\Facades\Http;

class DropboxServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
        $this->registerDropboxClient() ; 
    }

    
    /**
     * Register the dropbox client.
     *
     * @return void
     */
    protected function registerDropboxClient()
    {
        $this->app->singleton('dropboxClient', function ($app) {
            $config = $app->make('config')->get('dropbox');
            $authType = strtoupper($config["api_auth_type"]) ; 

            if ( $authType == "KEYANDSECRET"){

                $token = Http::asForm()
                    ->post('https://api.dropbox.com/oauth2/token', [
                        'refresh_token' => config('dropbox.refresh_token'),
                        'client_secret' => config('dropbox.app_secret'),
                        'client_id' => config('dropbox.app_key'),
                        'grant_type' => 'refresh_token',
                    ])
                    ->json()['access_token'] ;
                $client = new DropboxClient(    
                    //$appKey , $appSecret 
                    $token 
                );

            }
            else if ( $authType == "TOKEN"){
                $client = new DropboxClient(    
                    $config["api_token"]
                );
    
            }
            return $client;
        });

        

        
    }


    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // 
        Storage::extend('dropbox', function ($app, $config) {            
            $client = app()->make('dropboxClient'); 
            return new Filesystem(new DropboxAdapter($client));
        });
        
    }

    protected $client ;
}
