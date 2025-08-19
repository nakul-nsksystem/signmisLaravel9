//SS => t_project 変換定数設定　

//storeも持ってこれるので受注拠点や営業担当はログインユーザー基準に変更できる
//import { useStore } from "../../../../stores/mainStore"
//const store = useStore() ;

export default {
    
    // 受注拠点 東京固定
    M_BRANCH_ID : 2 ,

    // 営業担当　副社長固定
    SALES_M_USER_ID : 201 ,

    //商品カテゴリ プリスマ商品固定
    M_PRODUCT_CATEGORY_ID : 66 ,

    // 物件クライアントId設定
    // 支払方法によって顧客設定
    //'payment_itemcode'(管理画面上ではid) で判定 
    mCustomerIdConst : function(key:string) {   
        let custId = 0 ;
        switch(key) {
            //代引き
            case '1' : 
                custId = 36428 ;
                break ;

            //銀行振込
            case '2' :
                custId = 36238 ;
                break ;

            //Paypalで支払う
            case '5' :
                custId = 36684 ;
                break ;
            
            //Paidで支払う
            case '6' :
                custId = 36683 ;
                break ;

            //Square
            case '8' :
                custId = 36685 ;
                break ;

            default : 
                custId = 0 ;
                break ;
        }

        return custId ;
    },

}