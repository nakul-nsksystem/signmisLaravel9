<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class MCustomer extends BaseModel
{
    use SoftDeletes;

    // 更新禁止のフィールド指定
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

    protected $unsetChildren = [
        "m_branch"          , 
        "sales_m_user"      , 
        "display_address"   , 
        "created_m_user"    , 
        "updated_m_user"    ,
        "tags"              ,
        "tag_links"         ,
    ] ; 

    
    protected $childModels = 
        [
            "MCustomerInfos" =>  "App\Models\MCustomerInfo" ,
            "MCustomerPersons" =>  "App\Models\MCustomerPerson" ,
        ] ; 


    protected $casts = [
        'credit_limit'          => 'double',
    ];    

    protected $appends = ['kana_or_name', "short_name_or_name","display_address"];

    public function getKanaOrNameAttribute()
    {
        return $this->kana ?? $this->name;
    }    

    public function getShortNameOrNameAttribute()
    {
        return $this->short_name ?? $this->name;
    }  
    /**
     * 描画用住所県市番地すべて並べて出す
     *  */  
    public function getDisplayAddressAttribute()
    {
        $prefecture = $this->prefectures ?? "" ; 
        $address1 = $this->address1 ?? ""  ;
        $address2 = $this->address2 ?? "" ;
        return $prefecture.$address1.$address2 ;
    }    
    
    // タグ
    public function MTags()
    {
        return $this->morphToMany('App\Models\MTag', 'm_tag_link')
                    ->orderBy("order_no");
    }

    // 拠点
    public function MBranch() 
    {
        return $this->belongsTo('App\Models\MBranch', 'm_branch_id');
    }

    // 社内担当者
    public function SalesMUser() 
    {
        return $this->belongsTo('App\User', 'sales_m_user_id');
    }

    // 敬称区分
    public function TitleOfHonorMKv() 
    {
        return $this->belongsTo('App\Models\MKv', 'title_of_honor_m_kv_id');
    }

    // 取引区分
    public function DealingMKv() 
    {
        return $this->belongsTo('App\Models\MKv', 'dealing_m_kv_id');
    }

    // 業種
    public function IndustryMKv() 
    {
        return $this->belongsTo('App\Models\MKv', 'industry_m_kv_id');
    }

    // 請求先
    public function DestinationMCustomer() 
    {
        return $this->belongsTo('App\Models\MCustomer', 'destination_m_customer_id');
    }

    // 相殺先
    public function SetOffMCustomer() 
    {
        return $this->belongsTo('App\Models\MCustomer', 'set_off_m_customer_id');
    }

    // 取引先グループ
    public function CategoryGroupMCustomer() 
    {
        return $this->belongsTo('App\Models\MCustomer', 'category_group_m_customer_id');
    }

    // 締め区分
    public function AccountMKv() 
    {
        return $this->belongsTo('App\Models\MKv', 'account_m_kv_id');
    }
    // 金額端数区分
    public function PriceFractionMKv() 
    {
        return $this->belongsTo('App\Models\MKv', 'price_fraction_m_kv_id');
    }

    // 消費税端数区分
    public function TaxFractionMKv() 
    {
        return $this->belongsTo('App\Models\MKv', 'tax_fraction_m_kv_id');
    }

    // 納品形式区分
    public function DeliveryFormatMKv() 
    {
        return $this->belongsTo('App\Models\MKv', 'delivery_format_m_kv_id');
    }

    // 納品書区分(本伝用)
    public function DeliveryNoteMKv() 
    {
        return $this->belongsTo('App\Models\MKv', 'delivery_note_m_kv_id');
    }

    // 納品書区分(仮伝用）
    public function TemporarySlipNoteMKv() 
    {
        return $this->belongsTo('App\Models\MKv', 'temporary_slip_note_m_kv_id');
    }

    // 指定納品書区分
    public function DesignatedDeliveryNoteMKv() 
    {
        return $this->belongsTo('App\Models\MKv', 'designated_delivery_note_m_kv_id');
    }

    // 送り状区分
    public function ShippingLabelMKv() 
    {
        return $this->belongsTo('App\Models\MKv', 'shipping_label_m_kv_id');
    }

    // 請求書区分
    public function InvoiceMKv() 
    {
        return $this->belongsTo('App\Models\MKv', 'invoice_m_kv_id');
    }

    // 発注書区分
    public function PurchaseOrderMKv() 
    {
        return $this->belongsTo('App\Models\MKv', 'purchase_order_m_kv_id');
    }

    // 検収書区分
    public function PaymentNoticeMKv() 
    {
        return $this->belongsTo('App\Models\MKv', 'payment_notice_m_kv_id');
    }
    

    //物件納品先、荷主
    public function DeliveryMCustomers()
    {
        return $this->belongsToMany(self::class, 'm_delivery_destinations','m_customer_id','delivery_destination_m_customer_id')
                    // ->using('App\Models\MDeliveryDestination')
                    ->withPivot('is_owner','created_m_user_id','updated_m_user_id');
        // return $this->morphToMany('App\Models\MCustomer', 'm_delivery_destinations')->orderBy("order_no");
    }
    //物件納品先、荷主 受け手から保存用Relation
    public function DeliveliedMCustomers()
    {
        return $this->belongsToMany(self::class, 'm_delivery_destinations','delivery_destination_m_customer_id','m_customer_id') ;
                    // ->using('App\Models\MDeliveryDestination')
                    // ->withPivot('is_owner','created_m_user_id','updated_m_user_id');
        // return $this->morphToMany('App\Models\MCustomer', 'm_delivery_destinations')->orderBy("order_no");
    }

    
    /**
     * 顧客付加情報
     */
    public function MCustomerInfos() : HasMany
    {        
        return $this
            ->hasMany(MCustomerInfo::class); 
            
    }

    /**
     * 顧客担当者
     */
    public function MCustomerPersons() : HasMany
    {        
        return $this
            ->hasMany('App\Models\MCustomerPerson'); 
            
    }

    /**
     * トランザクションテーブル存在チェック用
     */
    public function TProjects() : HasMany
    {        
        return $this->hasMany('App\Models\TProject'); 
    }
    public function TSales() : HasMany
    {        
        return $this->hasMany('App\Models\TSale'); 
    }
    public function TPOrders() : HasMany
    {        
        return $this->hasMany('App\Models\TPOrder','supplier_m_customer_id'); 
    }
    public function TPInvoices() : HasMany
    {        
        return $this->hasMany('App\Models\TPInvoice','supplier_m_customer_id'); 
    }
    public function TCompletes() : HasMany
    {        
        return $this->hasMany('App\Models\TComplete'); 
    }
    public function TCompleteDetails() : HasMany
    {        
        return $this->hasMany('App\Models\TCompleteDetail'); 
    }
    

    // CSVヘッダー
    public static $csvHeader = [
        'id',
        'コード',
        '表示順',
        '名称',
        '略称',
        '敬称区分',
        'カナ',
        '郵便番号',
        '都道府県',
        '住所1',
        '住所2',
        '電話番号',
        'FAX番号',
        '取引担当者',
        'メールアドレス',
        '発注用メールアドレス',
        '拠点',
        '自社担当者',
        '取引区分',
        '業種区分',
        '分析区分1',
        '分析区分2',
        '分析区分3',
        '限度額',
        '請求宛先',
        '相殺先',
        '取引先グループ',
        '締区分',
        '金額端数区分',
        '消費税端数区分',
        '締日',
        '入金・支払日',
        '納品書区分',
        '仮伝納品書区分',
        '指定納品書区分',
        '送り状区分',
        '請求書区分',
        '発注書区分',
        '検収書区分',
        '納品形式区分',
        '勘定区分',
        '請求書検収書郵送区分',
        '連携用CD',
        'コンバート備考',
        '特記事項',
        '販売管理備考',
        '備考',
        '作成担当者',
        '更新担当者',
        '作成日',
        '更新日',
    ] ;
    
}
