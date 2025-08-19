<?php

namespace App\Http\Controllers\Api;

use App\Models\MCustomer;
use App\Models\MNumberingRule;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use App\Exceptions\DbSaveErrorException;
use App\Exceptions\NotFoundErrorException;
use App\Http\Controllers\Api\Traits\CsvExportTrait;
use App\Models\Traits\CheckTransactionTrait;

class MCustomerApiController extends BaseApiController
{

    use CsvExportTrait ;
    use CheckTransactionTrait ;
    
    private $deliveryMCustomerColumns = ":id,cd,order_no,name,short_name,zip,prefectures,address1,address2,tel,fax,contact_person,email" ; 

    protected $filters = array(
        // コード
        "cd" => array(
            "operation" => "like"  ,
            "postfix" => "%" ,
            "column"    => "m_customers.cd" ,
        ) ,
        // 連携コード
        "data_linkage_cd" => array(
            "operation" => "like"  ,
            "postfix" => "%" ,
            "column"    => "m_customers.data_linkage_cd" ,
        ) ,
        // 名称
        "name" => array(
            "operation" => "like"  ,
            "prefix" => "%" ,
            "postfix" => "%" ,            
            "column"    => "m_customers.name" ,
        ) ,  
        // 取引区分
        "dealing_m_kv_id" => array(
            "column"    => "m_customers.dealing_m_kv_id" ,
        ) ,
        // 拠点
        "m_branch_id" => array(
            "column"    => "m_customers.m_branch_id" ,
        ) ,
        // 担当者
        "sales_m_user_id" => array() , 
        // 備考
        "memo" => array(
            "operation" => "like"  ,
            "prefix" => "%" ,
            "postfix" => "%" ,            
            "column"    => "m_customers.memo" ,
        ) ,  
    ) ;

    public function __construct()
    {
        $this->model = "App\Models\MCustomer" ;
        $this->numberingRuleModel = MNumberingRule::where('category_m_kv_id', 1700001)->first() ;
    }

    public function index()
    {
        $data = $this->model
            ::with('MBranch')
            ->with('SalesMUser')
            ->with('DealingMKv')
            ->orderBy("cd")
            ->get() ;
        
        return $data ;
    }

    // マスタ検索用
    public function retrieve(Request $req)
    {
        $res = $this->getFiltered($req)
            ->selectRaw("m_customers.id,
                         m_customers.cd,
                         IFNULL(m_customers.short_name, m_customers.name) AS name,
                         m_kvs.kv_name,
                         m_customers.zip, 
                         m_customers.prefectures, 
                         m_customers.address1, 
                         m_customers.address2, 
                         m_customers.tel, 
                         m_customers.email, 
                         m_customers.po_email, 
                         m_customers.m_branch_id, 
                         m_customers.closing_date, 
                         m_customers.payment_date, 
                         m_branches.short_name AS m_branches_short_name, 
                         m_users.full_name AS m_users_full_name, 
                         m_customers.data_linkage_cd, 
                         m_customers.memo")

            ->join('m_branches', 'm_customers.m_branch_id', '=', 'm_branches.id')
            ->join('m_users', 'm_customers.sales_m_user_id', '=', 'm_users.id')
            ->join('m_kvs', 'm_customers.dealing_m_kv_id', '=', 'm_kvs.id')

            ->orderByRaw($this->orderByClause($req, 'm_customers.cd'))
            ->paginate() ;

        return $res ;
    }

    public function exportCsv(Request $request) 
    {
        $res = $this->getFiltered($request)
            ->selectRaw("
                m_customers.id,
                m_customers.cd ,
                m_customers.order_no,
                m_customers.name ,
                m_customers.short_name ,
                title_of_honor_k.kv_name AS title_of_honor_m_kv_name,
                m_customers.kana,
                m_customers.zip ,
                m_customers.prefectures ,
                m_customers.address1 ,
                m_customers.address2 ,
                m_customers.tel ,
                m_customers.fax ,
                m_customers.contact_person ,
                m_customers.email ,
                m_customers.po_email ,
                m_branches.name AS m_branch_name,
                sales_u.full_name AS sales_m_user_name,
                dealing_k.kv_name AS dealing_m_kv_name ,
                industry_k.kv_name AS industry_m_kv_name ,
                analyze1_k.kv_name AS analyze1_m_kv_name ,
                analyze2_k.kv_name AS analyze2_m_kv_name ,
                analyze3_k.kv_name AS analyze3_m_kv_name ,
                m_customers.credit_limit ,
                destination_c.name AS destination_m_customer_name ,
                set_off_c.name AS set_off_m_customer_name ,
                category_group_c.name AS category_group_m_customer_name ,
                account_k.kv_name AS account_m_kv_name ,
                price_fraction_k.kv_name AS price_fraction_m_kv_name ,
                tax_fraction_k.kv_name AS tax_fraction_m_kv_name ,
                m_customers.closing_date ,
                m_customers.payment_date ,
                delivery_note_k.kv_name AS delivery_note_m_kv_name ,
                temporary_slip_note_k.kv_name AS temporary_slip_note_m_kv_name ,
                designated_delivery_note_k.kv_name AS designated_delivery_note_m_kv_name ,
                shipping_label_k.kv_name AS shipping_label_m_kv_name ,
                invoice_k.kv_name AS invoice_m_kv_id ,
                purchase_order_k.kv_name AS purchase_order_m_kv_name ,
                payment_notice_k.kv_name AS payment_notice_m_kv_name ,
                delivery_format_k.kv_name AS delivery_format_m_kv_name ,
                accounts_title_k.kv_name AS accounts_title_m_kv_name ,
                mailing_type_k.kv_name AS mailing_type_m_kv_name ,
                m_customers.data_linkage_cd ,
                m_customers.convert_memo ,
                m_customers.notices ,
                m_customers.sales_management_memo,
                m_customers.memo,
                created_u.full_name AS created_m_user_name,
                updated_u.full_name AS updated_m_user_name,
                DATE_FORMAT(m_customers.created_at, '%Y-%m-%d %T') ,
                DATE_FORMAT(m_customers.updated_at, '%Y-%m-%d %T')
                "
            )
            //拠点
            ->join('m_branches', 'm_customers.m_branch_id', '=', 'm_branches.id')
            
            //user
            ->leftJoin('m_users AS sales_u'   , 'm_customers.sales_m_user_id'   , '=', 'sales_u.id')
            ->join    ('m_users AS created_u' , 'm_customers.created_m_user_id' , '=', 'created_u.id')
            ->join    ('m_users AS updated_u' , 'm_customers.updated_m_user_id' , '=', 'updated_u.id')
            
            //区分
            ->leftJoin('m_kvs AS title_of_honor_k'           , 'm_customers.title_of_honor_m_kv_id'           , '=', 'title_of_honor_k.id')
            ->leftJoin('m_kvs AS dealing_k'                  , 'm_customers.dealing_m_kv_id'                  , '=', 'dealing_k.id')
            ->leftJoin('m_kvs AS industry_k'                 , 'm_customers.industry_m_kv_id'                 , '=', 'industry_k.id')
            ->leftJoin('m_kvs AS analyze1_k'                 , 'm_customers.analyze1_m_kv_id'                 , '=', 'analyze1_k.id')
            ->leftJoin('m_kvs AS analyze2_k'                 , 'm_customers.analyze2_m_kv_id'                 , '=', 'analyze2_k.id')
            ->leftJoin('m_kvs AS analyze3_k'                 , 'm_customers.analyze3_m_kv_id'                 , '=', 'analyze3_k.id')
            ->leftJoin('m_kvs AS account_k'                  , 'm_customers.account_m_kv_id'                  , '=', 'account_k.id')
            ->leftJoin('m_kvs AS price_fraction_k'           , 'm_customers.price_fraction_m_kv_id'           , '=', 'price_fraction_k.id')
            ->leftJoin('m_kvs AS tax_fraction_k'             , 'm_customers.tax_fraction_m_kv_id'             , '=', 'tax_fraction_k.id')
            ->leftJoin('m_kvs AS delivery_note_k'            , 'm_customers.delivery_note_m_kv_id'            , '=', 'delivery_note_k.id')
            ->leftJoin('m_kvs AS temporary_slip_note_k'      , 'm_customers.temporary_slip_note_m_kv_id'      , '=', 'temporary_slip_note_k.id')
            ->leftJoin('m_kvs AS designated_delivery_note_k' , 'm_customers.designated_delivery_note_m_kv_id' , '=', 'designated_delivery_note_k.id')
            ->leftJoin('m_kvs AS shipping_label_k'           , 'm_customers.shipping_label_m_kv_id'           , '=', 'shipping_label_k.id')
            ->leftJoin('m_kvs AS invoice_k'                  , 'm_customers.invoice_m_kv_id'                  , '=', 'invoice_k.id')
            ->leftJoin('m_kvs AS purchase_order_k'           , 'm_customers.purchase_order_m_kv_id'           , '=', 'purchase_order_k.id')
            ->leftJoin('m_kvs AS payment_notice_k'           , 'm_customers.payment_notice_m_kv_id'           , '=', 'payment_notice_k.id')
            ->leftJoin('m_kvs AS delivery_format_k'          , 'm_customers.delivery_format_m_kv_id'          , '=', 'delivery_format_k.id')
            ->leftJoin('m_kvs AS accounts_title_k'           , 'm_customers.accounts_title_m_kv_id'           , '=', 'accounts_title_k.id')
            ->leftJoin('m_kvs AS mailing_type_k'             , 'm_customers.mailing_type_m_kv_id'             , '=', 'mailing_type_k.id')
            
            //取引先
            ->leftJoin('m_customers AS destination_c'    , 'm_customers.destination_m_customer_id'    , '=', 'destination_c.id')
            ->leftJoin('m_customers AS set_off_c'        , 'm_customers.set_off_m_customer_id'        , '=', 'set_off_c.id')
            ->leftJoin('m_customers AS category_group_c' , 'm_customers.category_group_m_customer_id' , '=', 'category_group_c.id')
            ->orderBy("m_customers.cd")
            ->get() ;

        //アクセサ削除
        $hidden = ["kana_or_name","short_name_or_name","display_address"] ;

        foreach($res as &$val) {
            $val->makeHidden($hidden) ;
        }

        $data = $res->toArray() ;

        $csv = $this->createCsv($data) ;
        return $csv ;
    }

    public function show($id)
    {
        $query = $this->model
            ::where('id', $id)
            ->with([
                "MBranch"                   , 
                "SalesMUser"                , 
                "DealingMKv"                , 
                "TitleOfHonorMKv"           , 
                "IndustryMKv"               , 
                "DestinationMCustomer"      , 
                "SetOffMCustomer"           , 
                "CategoryGroupMCustomer"    , 
                "AccountMKv"                , 
                "PriceFractionMKv"          , 
                "TaxFractionMKv"            , 
                "DeliveryNoteMKv"           , 
                "TemporarySlipNoteMKv"      , 
                "DesignatedDeliveryNoteMKv" , 
                "ShippingLabelMKv"          , 
                "InvoiceMKv"                , 
                "PurchaseOrderMKv"          , 
                "PaymentNoticeMKv"          , 
                "DeliveryFormatMKv"         ,
                "MTags"                     ,   // 仕入カテゴリータグ
                "DeliveryMCustomers" . $this->deliveryMCustomerColumns ,
                "MCustomerInfos" 
                    => function($query) 
                    {
                        $query->select("m_customer_infos.*") ; 
                        $query->join('m_kvs as category_m_kv', 'm_customer_infos.category_m_kv_id', '=', 'category_m_kv.id') ; 
                        $query
                            ->orderBy("category_m_kv.order_no"  , "asc") 
                            ->orderBy("m_customer_infos.title"  , "asc")     
                         ;
                    },
                "MCustomerInfos.CategoryMKv" ,
                "MCustomerPersons" 
            ]) ;

        
        $row = $query->first() ; 
        

        if (! $row) {
            $error = new NotFoundErrorException() ; 
            throw $error ; 
        }

        return $row ; 
    }

    public function findByBrancheAndAnykey($mBranchId = 0, $mKvId = "", $searchColumn = "", $input = "")
    {
        // DB::enableQueryLog();
        
        // 検索項目
        // [$searchColumn] Like検索(前方一致)：何とかCDを想定してるので前方一致、部分一致にしたい場合は考えてください
        // Or条件で検索
        // [name] Like検索(部分一致)
        $query = MCustomer::Where(function($query) use($searchColumn, $input) {
                                     $query->where($searchColumn, 'like', "{$input}%")
                                           ->orWhere('name', 'like', "%{$input}%") 
                                           ->orWhere('kana', 'like', "%{$input}%") 
                                           ;
                                }) ;

        if ($mBranchId != 0) {
            $query = $query->where('m_branch_id', $mBranchId ) ; 
        }

        $mKvIds = explode(",", $mKvId) ;
        if (count($mKvIds) != 0) {
            $query = $query->whereIn('dealing_m_kv_id', $mKvIds ) ; 
        }

        // 検索項目[searchColumn]でソート
        $query = $query->orderBy($searchColumn) ;
        // LOG::info(DB::getQueryLog());

        $data = $query->limit(30)->get() ; 
        return $data ;
    }

    public function findByBrancheAndName($mBranchId = 0, $mKvId = "", $input = "")
    {
        $query = MCustomer::where('name', 'like', "%{$input}%") ; 
        if ( $mBranchId != 0 )
        {
            $query = $query->where('m_branch_id', $mBranchId ) ; 
        }
        $mKvIds = explode(",", $mKvId) ;
        if ( count($mKvIds) != 0 ){
            $query = $query->whereIn('dealing_m_kv_id', $mKvIds ) ; 
        }
        $data = $query->limit(30)->get() ; 

        // ToDo：変更する事
        // 上記のQueryBuilderでソートしてからlimit()しないと意味がないのでQueryBuilderのorderBy()に変える事
        // 下のsortだとMySQLから返ってきたSQL結果データの順序が不定の30件に対してsort()している為[カナOr名称]順ではない
        $sorted = $data->sort(function($first, $second) {
            $fName = $first["kana_or_name"] ;
            $sName = $second["kana_or_name"] ;
            return $fName > $sName ? 1 : -1 ;
        })->values()->all() ;
        
        return $sorted ;
    }

    public function findByBrancheAndDealingMKvId($mBranchId, $mKvId)     
    {
        $mBranchIds = explode(",", $mBranchId) ;
        $mKvIds = explode(",", $mKvId) ;
        $query = MCustomer::
            whereIn('m_branch_id', $mBranchIds ) 
            ->whereIn('dealing_m_kv_id' ,$mKvIds ) 
            ->with("MTags"); 
                

        $customers = $query->get() ; 
        
        return $customers->sortBy("kana_or_name")->values()->all() ;
    }

    // ID配列から検索（物件発注連動用）
    public function findByIds(Request $request){
        $reqAll = $request->all() ;
        if(!$reqAll)  return ;

        $data = $this->model
        ::whereIn( 'id', $reqAll )
        ->get() ;


        return $data;



    }

    public function store(Request $request)
    {
        $row = new $this->model() ;
        $this->saveRow($request, $row) ;

        return $this->show($row["id"]) ;
    }

    public function update(Request $request, $id)
    {
        $row = $this->model::find($id) ;
        
        if (! $row) {
            $error = new NotFoundErrorException() ;
            throw $error ;
        }

        $this->saveRow($request, $row) ;

        return $this->show($row["id"]) ;
    }

    protected function saveRow($request, $row)
    {
        $trimedRow = $request->all() ;
        $tagLinks  = $request->input("tag_links") ;

        $mDeliveryDestinationRow = array() ;
        
        if(isset($trimedRow["m_delivery_destinations"])) {
            $mDeliveryDestinationRow = $trimedRow["m_delivery_destinations"] ;

        }

        // 更新に関係ない列を削除
        unset($trimedRow["account_m_kv"]) ;
        unset($trimedRow["category_group_m_customer"]) ;
        unset($trimedRow["dealing_m_kv"]) ;
        unset($trimedRow["delivery_note_m_kv"]) ;
        unset($trimedRow["designated_delivery_note_m_kv"]) ;
        unset($trimedRow["destination_m_customer"]) ;
        unset($trimedRow["industry_m_kv"]) ;
        unset($trimedRow["invoice_m_kv"]) ;
        unset($trimedRow["m_branch"]) ;
        unset($trimedRow["payment_notice_m_kv"]) ;
        unset($trimedRow["price_fraction_m_kv"]) ;
        unset($trimedRow["purchase_order_m_kv"]) ;
        unset($trimedRow["sales_m_user"]) ;
        unset($trimedRow["set_off_m_customer"]) ;
        unset($trimedRow["shipping_label_m_kv"]) ;
        unset($trimedRow["tax_fraction_m_kv"]) ;
        unset($trimedRow["temporary_slip_note_m_kv"]) ;
        unset($trimedRow["title_of_honor_m_kv"]) ;
        unset($trimedRow["m_delivery_destinations"]) ;

        // $row->fill($trimedRow) ;
        $row->fillIncChildren($trimedRow) ;

        $cd = $row["cd"] ;
        if (!$cd) {
            // cdがnullの場合は採番
            $row["cd"] = $this->numberingRuleModel->numberinglogic($row) ;
        }

        DB::beginTransaction() ;

        try {
            // $row->save() ;
            $row->push();
            
            // Update Tags
            if ($request->filled("tag_links")) {
                $this->updateTagLink($this->model, $row["id"], $tagLinks) ;
            } 

            if (!empty($mDeliveryDestinationRow)) {


                try {

                    if($row->DeliveliedMCustomers()
                           ->where('m_customer_id','=' ,$mDeliveryDestinationRow["m_customer_id"])
                           ->where('is_owner','!=' , $mDeliveryDestinationRow["m_customer_id"]) )
                    {
                        $row->DeliveliedMCustomers()->attach(
                            [
                                $mDeliveryDestinationRow["m_customer_id"] => [
                                    'is_owner' => $mDeliveryDestinationRow["is_owner"] ,
                                    'created_m_user_id' => $mDeliveryDestinationRow["created_m_user_id"] ,
                                    'updated_m_user_id' => $mDeliveryDestinationRow["updated_m_user_id"]
                                ] ,           
                            ] ,

                        ) ;
                        
                    } else {
                        $row->DeliveliedMCustomers()->syncWithoutDetaching(
                            [
                                $mDeliveryDestinationRow["m_customer_id"] => [
                                    'is_owner' => $mDeliveryDestinationRow["is_owner"] ,
                                    'created_m_user_id' => $mDeliveryDestinationRow["created_m_user_id"] ,
                                    'updated_m_user_id' => $mDeliveryDestinationRow["updated_m_user_id"]
                                ] ,           
                            ] ,

                        ) ;

                    }

                } catch (\PDOException $e) { 
                    $this->throwDbError($e) ; 
                    // DB::rollBack();
                }  
            }
        } catch (\PDOException $e) { 
            $this->throwDbError($e) ;
        }
        
        DB::commit() ;
    } 

    // 郵便番号情報取得
    public function getZipInfo($zipcode)
    {
        try {
            // 外部APIへリクエスト送信
            // api.zipaddress.netはhttps通信のみ対応となったのでzipcloud.ibsnet.co.jpを採用
            $response = Http::get("http://zipcloud.ibsnet.co.jp/api/search?zipcode=" . $zipcode) ;

            return $response->json() ;

        } catch (\Exception $e) { 
            // 例外の内容をログに残す
            report($e) ;
        }
    }

    // フリガナ
    public function getFurigana($value)
    {
        try {
            // 外部APIへリクエスト送信
            $response = Http::withHeaders([
                'Content-Type' => 'application/x-www-form-urlencoded',
                'Content-Type' => 'application/json'
            ])->post("https://labs.goo.ne.jp/api/hiragana", [
                'app_id' => "7c6f0cab0b6ab991bf97a98dab545242b6d0c3398a058a02f1cb6e1b77e1bc40", // API KEY
                'sentence' => $value,
                'output_type' => "katakana" // or "hiragana"
            ]);

            return $response->json() ;

        } catch (\Exception $e) { 
            // 例外の内容をログに残す
            report($e) ;
        }
    }

}
