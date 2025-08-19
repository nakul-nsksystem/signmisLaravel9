<?php

namespace App\Observers;

use App\Models\BaseModel;
use App\Observers\Traits\SavedPivotSyncTrait;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;



class TPOrderDetailObserver
{
    use SavedPivotSyncTrait ; 

    
}