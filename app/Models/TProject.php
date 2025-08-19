<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;

class TProject extends BaseModel
{
    use SoftDeletes;

    protected $guarded = ['id', "inc_children_updated_at", "inc_children_updated_m_user_id", 'created_at', 'updated_at', 'deleted_at'];

    protected $childModels =
    [
        "TProjectProducts" =>  "App\Models\TProjectProduct",
        // "TProjectConstructions" =>  "App\Models\TProjectConstruction" ,
        "TProjectMails" =>  "App\Models\TProjectMail",
        "TProjectFiles" =>  "App\Models\TProjectFile",
        "TProjectDeliveries" =>  "App\Models\TProjectDelivery",

    ];

    protected $unsetChildren = ["m_customer", "m_product_categories", "m_process_categories", "updated_m_user", "t_sale_details"];



    protected $casts = [
        'delivery_fee' => 'double',
        'construction_fee' => 'double',
        'other_fee' => 'double',
    ];

    /**
     * 
     */
    public function MBranch()
    {
        return $this
            ->belongsTo('App\Models\MBranch')
            ->withTrashed();
    }

    public function MCustomer()
    {
        return $this
            ->belongsTo('App\Models\MCustomer')
            ->withTrashed();
    }
    // public function MCustomerPerson()
    // {
    //     return $this
    //         ->belongsTo('App\Models\MCustomerPerson')
    //         ->withTrashed();
    // }

    public function SalesMUser()
    {
        return $this
            ->belongsTo('App\User', "sales_m_user_id")
            ->withTrashed();
    }

    public function UpdatedMUser()
    {
        return $this
            ->belongsTo('App\User', "inc_children_updated_m_user_id")
            ->withTrashed();
    }
    /**見積受け渡し場所 */
    public function EstimateDeliveryMKv()
    {
        return $this
            ->belongsTo('App\Models\MKv');
    }




    public function TProjectProducts(): HasMany
    {
        return $this
            ->hasMany('App\Models\TProjectProduct')
            ->orderby("order_no");
    }

    // public function TProjectConstructions() : HasMany
    // {
    //     return $this
    //         ->hasMany('App\Models\TProjectConstruction')
    //         ->orderby("construction_at");
    // }

    public function TProjectMails(): HasMany
    {
        return $this
            ->hasMany('App\Models\TProjectMail');
        // ->orderby("received_at");
    }

    public function TProjectFiles(): HasMany
    {
        return $this
            ->hasMany('App\Models\TProjectFile')
            ->orderBy("filepath");
    }

    public function TProjectDeliveries(): HasMany
    {
        return $this
            ->hasMany('App\Models\TProjectDelivery')
            ->orderby("delivery_at");
    }

    public function TSaleDetails(): HasMany
    {
        return $this
            ->hasMany('App\Models\TSaleDetail');
    }

    public function WhenOrderedTProject(): HasOne
    {
        return $this
            ->hasOne('App\Models\TProject', "ordered_t_project_id");
    }

    public function TProjectPoint(): HasOne
    {
        return $this
            ->hasOne('App\Models\TProjectPoint', "t_project_id");
    }

    public function TUserPoints(): HasMany
    {
        return $this->hasMany('App\Models\TUserPoint');
    }


    /**
     * appends 
     * 
     * 
     * 
     */
    protected $appends = [
        // 'min_delivery' ,
        // 'max_arrival' ,
        'estimate_formatted_no',
        // 'display_estimate_delivery_date',
        // 'display_estimate_delivery_address',
        // 'display_estimate_condition',
        // 'display_estimate_term',
    ];

    /**
     * 物件最短納期
     */
    public function getMinDeliveryAttribute()
    {
        $min = null;
        // $copied = unserialize(serialize($this->TProjectDeliveries)); 
        foreach ($this->TProjectDeliveries as $delivery) {

            $at = $delivery["delivery_at"];
            if (is_null($min) || $at < $min["delivery_at"]) {
                $min = array(
                    "delivery_at" => $delivery["delivery_at"],
                    "delivery_time" => $delivery["delivery_time"],
                );
                // $min = $delivery ; 
            }
        }

        return $min;
    }

    /**
     * 物件最終着日
     */
    public function getMaxArrivalAttribute()
    {
        $max = null;
        // $copied = unserialize(serialize($this->TProjectDeliveries)); 
        foreach ($this->TProjectDeliveries as $delivery) {

            $at = $delivery["arrival_at"] ?? $delivery["delivery_at"];
            if (is_null($max) || $at > $max["arrival_at"] ?? $max["delivery_at"]) {
                $max = array(
                    "arrival_at" => $delivery["arrival_at"],
                    "arrival_time" => $delivery["arrival_time"],
                    "delivery_at" => $delivery["delivery_at"],
                    "delivery_time" => $delivery["delivery_time"],
                );
                // $max = $delivery ; 
            }
        }
        return $max;
    }



    /**
     * 見積No正式版
     */
    public function getEstimateFormattedNoAttribute()
    {
        if ($this->estimate_no) {
            return $this->cd . '-' . $this->estimate_no;
        } else {
            return $this->cd;
        }
    }

    /**
     * 見積納期PDF表示用
     */
    // public function getDisplayEstimateDeliveryDateAttribute()
    // {
    //     $return = $this->estimate_delivery_date ;
    //     if(!$this->estimate_delivery_date){
    //         $return = "ご相談の上" ;
    //     }  
    //     return $return ;        
    // }
    /**
     * 見積納期PDF表示用
     */
    public function getDisplayEstimateDeliveryDateAttribute()
    {
        /**estimate_delivery_dateのカラムに値がなければ物件納品の最遅納期を取得*/
        $estimateDelDate = $this->estimate_delivery_date;

        if (!$this->estimate_delivery_date) {

            $latest = null;

            foreach ($this->TProjectDeliveries as $delivery) {
                //Log::debug($deliverie) ; 
                $at = $delivery["delivery_at"];
                if (is_null($latest) || $at > $latest["delivery_at"]) {
                    $latest = $delivery;
                }
            }

            if (empty($latest)) {

                $estimateDelDate = "ご相談の上";
            } else {

                $estimateDelDate = date("Y/m/d", strtotime($latest["delivery_at"]));
            }
        }
        return $estimateDelDate;
    }


    /**
     * 見積受渡場所PDF表示用
     */
    public function getDisplayEstimateDeliveryAddressAttribute()
    {
        /**estimate_delivery_addressのカラムを消したタイミングで修正 */
        $estimateDelAddress = $this->estimate_delivery_address;
        if (!$this->estimate_delivery_address) {

            if (isset($this->EstimateDeliveryMKv)) {

                $estimateDelAddress = $this->EstimateDeliveryMKv["kv_name"];
            } else {

                $estimateDelAddress = "";
            }
        }
        return $estimateDelAddress;
    }
    /**
     * 見積取引条件PDF表示用
     */
    public function getDisplayEstimateConditionAttribute()
    {
        $estimateCondition = $this->estimate_condition;
        if (!$this->estimate_condition) {
            $estimateCondition = "従来通り";
        }
        return $estimateCondition;
    }
    /**
     * 見積納期PDF表示用
     */
    public function getDisplayEstimateTermAttribute()
    {
        $estimateTerm = $this->estimate_term;
        if (!$this->estimate_term) {
            $estimateTerm = "3ヶ月";
        }
        return $estimateTerm;
    }


    /**
     * 見積承認用保存済売価
     */
    public function getLastSavedSellPriceAttribute()
    {
        return $this->total_sell_price;
    }
    /**
     * 見積承認用保存済原価
     */
    public function getLastSavedCostAttribute()
    {
        return $this->total_cost;
    }

    //表示する取引先担当者名
    // public function getDisplayCustomerUserNameAttribute() 
    // {   
    //     $name = $this->is_input_customer_user ? $this->customer_user_name : $this->MCustomerPerson["name"] ;
    //     return $name ?? "" ;
    // }



    /**
     * SS連携用XMLのパス
     */
    public function getSsXmlNameAttribute()
    {
        $name = 'importexport/xmlorderexport/list_order_' . $this->ss_order_cd . '.xml';
        return $name ?? "";
    }


    /**
     * Scopes 
     * 
     * 
     * 
     */


    public function scopeActive($query)
    {
        return $query->where('type_flg', 0);
    }

    /**
     * 受注済み
     */
    public function scopeOrdered($query)
    {

        return $query->whereNotNull("ordered_at")->where("is_order_lost", false);
    }
}
