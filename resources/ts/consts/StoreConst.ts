export default {
    Store : {
        // デバッグモード変更
        C_SET_IS_DEBUG_MUTATION : "changeIsDebugMutation" ,
        C_SET_IS_DEBUG_ACTION : "changeIsDebugAction" , 

        // AppUrlセット
        C_SET_APP_URL_MUTATION : "setAppUrlMutation", 
        C_SET_APP_URL_ACTION : "setAppUrlAction", 
        
        // AppUrlセット
        C_SET_CUSTOMER_KEY_MUTATION : "setCustomerKeyMutation", 
        C_SET_CUSTOMER_KEY_ACTION : "setCustomerKeyAction", 

        // ログインユーザーセット
        C_SET_LOGIN_USER_MUTATION : "setLoginUserMutation", 
        C_SET_LOGIN_USER_ACTION : "setLoginUserAction", 

        // ログインアクション
        C_LOGIN_ACTION : "loginAction" ,
        // ログアウトアクション
        C_LOGOUT_ACTION : "logoutAction" ,

        // ログアウトアクション
        C_GET_CURRENT_USER_ACTION : "getCurrentUserAction" ,

        // ページ遷移毎にログインユーザー取得
        C_GET_PAGE_TRANSITION_USER_ACTION : "getPageTransitionUserAction" ,
    } , 

    Masters : {
        // 全Masterセット
        C_GET_ALL_MASTERS_ACTION : "getAllMasters" ,

        // 全Masterクリア
        C_CLEAR_ALL_MASTERS_ACTION : "clearAllMasters" ,

        // 拠点取得
        C_GET_M_BRANCHES :'getMBranches' ,

        // マトリックス取得
        C_GET_M_MATRICES :'getMMatrices' ,

        // MKvCategory取得
        C_GET_M_KV_CATEGORIES : "getMKvCategories" ,

        // MTagCategory取得
        C_GET_M_TAG_CATEGORIES : "getMTagCategories" ,

        // 商品カテゴリー取得
        C_GET_M_PRODUCT_CATEGORIES : "getMProductCategories" ,

        // 工程カテゴリー取得
        C_GET_M_PROCESS_CATEGORIES : "getMProcessCategories" ,
        
        // 生産先取得
        C_GET_M_PRODUCTIONS : "getMProductions" ,

        // ユーザー情報取得 m_users
        C_GET_M_USERS : "getMUsers" ,

        // 資材情報取得 m_materials
        C_GET_M_MATERIALS : "getMMaterials" ,

        // 検証取得 m_validates
        C_GET_M_VALIDATES : "getMValidates" ,

        // 権限取得 m_roles
        C_GET_M_ROLES : "getMRoles" ,
        
        // 権限キー取得 m_role_keys
        C_GET_M_ROLE_KEYS : "getMRoleKeys" ,

        // オプション取得
        C_GET_SM_OPTIONS : "getSmOptions" ,

        //個人設定取得
        C_GET_SM_USER_OPTIONS : "getSmUserOptions" ,

        /** マスターローディング中 設定ミューテーション */
        C_SET_IS_MASTER_LOADING : "SetIsMasterLoadingMutation" ,
    
        /** マスターローディング済み 設定ミューテーション */
        C_SET_IS_MASTER_LOADED : "SetIsMasterLoadedMutation" ,
    }
}