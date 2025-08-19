<?php

namespace App\Providers;

use App\Models\TProductionDay;
use App\Models\TProductionDayGroup;
use App\Models\TProject;
use App\Models\TProjectDelivery;
use App\Models\TProjectProductProcess;
use App\Models\TPOrderDetail;
use App\Observers\TProductionDayGroupObserver;
use App\Observers\TProjectProductProcessObserver;
use App\Observers\TPOrderDetailObserver;
use App\Observers\TProjectObserver;
use App\Observers\TProjectDeliveryObserver;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
        TProject::observe(TProjectObserver::class) ; 
        TProjectDelivery::observe(TProjectDeliveryObserver::class) ; 

        TProductionDayGroup::observe(TProductionDayGroupObserver::class) ; 
        TProjectProductProcess::observe(TProjectProductProcessObserver::class) ; 
        TPOrderDetail::observe(TPOrderDetailObserver::class) ; 

        // 結果セットCollectionに対してpaginate()するマクロをサービスプロバイダに追加
        $this->createPaginateMacro();

        //本番環境でのページネーション含め作成されるリクエストのアドレスとhttpsに固定する
        if(config('app.env') === 'production') {
            $this->app['request']->server->set('HTTPS','on');
        }
    }

    /**
     * Collectionに対してpaginateできるようにするマクロ
     *
     * @param int $perPage
     * @param int $total
     * @param int $page
     * @param string $pageName
     * @return array
     */
    private function createPaginateMacro()
    {
        Collection::macro('paginate', function($perPage = 15, $total = null, $page = null, $pageName = 'page') {
            $page = $page ?: LengthAwarePaginator::resolveCurrentPage($pageName);
            return new LengthAwarePaginator(
                $this->forPage($page, $perPage),
                $total ?: $this->count(),
                $perPage,
                $page,
                [
                    'path' => LengthAwarePaginator::resolveCurrentPath(),
                    'pageName' => $pageName,
                ]
            );
        });        

    }

}
