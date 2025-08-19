import axios from 'axios';
import _ from 'lodash';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { MKvCategory }      from '../../components/masters/class/models/MKvCategory';
import { MMatrix }          from '../../components/masters/class/models/MMatrix';
import { MProcessCategory } from '../../components/masters/class/models/MProcessCategory';
import { MProductCategory } from '../../components/masters/class/models/MProductCategory';
import { MProduction }      from '../../components/masters/class/models/MProduction';
import { SmOption }         from '../../components/masters/class/models/SmOption';
import { SmUserOption }     from '../../components/masters/class/models/SmUserOption';
import MKvCategoriesConst   from '../../consts/MKvCategoriesConst';
import MastersUtil          from '../../frameworks/MastersUtil';
import NumberUtil           from '../../frameworks/NumberUtil';
import ObjectUtil           from '../../frameworks/ObjectUtil';
import StoreConst           from './../../consts/StoreConst' ;

@Module({ namespaced: true })
export default class mastersStore extends VuexModule {
    MBranches           :Array<Object>           = []
    MKvCategories       :Array<MKvCategory>      = []
    MMatrices           :Array<MMatrix>          = []
    MProcessCategories  :Array<MProcessCategory> = []
    MProductCategories  :Array<MProductCategory> = []
    MProductions        :Array<MProduction>      = []
    MRoles              :Array<Object>           = []
    MRoleKeys           :Array<Object>           = []
    MTagCategories      :Array<Object>           = []
    MUsers              :Array<Object>           = []
    MValidates          :Array<Object>           = []
    SmOptions           :Array<SmOption>         = [] ;
    SmUserOptions       :Array<SmUserOption>     = [] ;

    /**マスターローディング中 */
    IsMasterLoading:Boolean = false ;

    @Mutation
    [StoreConst.Masters.C_SET_IS_MASTER_LOADING] (flg:Boolean) {
        this.IsMasterLoading = flg ;
    }

    /**マスターローディング済み */
    IsMasterLoaded:Boolean = false ;

    @Mutation
    [StoreConst.Masters.C_SET_IS_MASTER_LOADED] (flg:Boolean) {
        this.IsMasterLoaded = flg ;
    }

    get getAppUrl()
    {
        return this.context.rootState.appUrl ;
    }

    @Action
    // 汎用取得API
    getApiAction(param:{apiUrl:string ,mutationName:string})
    {
        return new Promise((resolve, reject) => {
            const url = `${param.apiUrl}` ;

            axios.get(url)
                .then((res) => {
                    this.context.commit(param.mutationName, res.data) ;
                    resolve("") ;
                })
                .catch((error) => {
                    const {
                        status,
                        statusText
                    } = error.response;

                  console.error(`Error! HTTP Status: ${status} ${statusText} ${url}`) ;
                  // console.log("reject") ;
                  reject("Error !") ;
                }) ;
        }) ;
        //console.log(this.getAppUrl) ;
    }

    @Action
    // 全マスタセット
    [StoreConst.Masters.C_GET_ALL_MASTERS_ACTION]( ) {
        const _this = this ;
        this.context.commit(StoreConst.Masters.C_SET_IS_MASTER_LOADING, true) ;

        //this.IsMasterLoading = true ;
        return Promise.all(
            [
                this.context.dispatch("getMBranchesAction"            ) ,
                this.context.dispatch("getMKvCategoriesAction"        ) ,
                this.context.dispatch("getMMatricesAction"            ) ,
                this.context.dispatch("getMProcessCategoriesAction"   ) ,
                this.context.dispatch("getMProductCategoriesAction"   ) ,
                this.context.dispatch("getMProductionsAction"         ) ,
                this.context.dispatch("getMRolesAction"               ) ,
                this.context.dispatch("getMRoleKeysAction"            ) ,
                this.context.dispatch("getMTagCategoriesAction"       ) ,
                this.context.dispatch("getMUsersAction"               ) ,
                this.context.dispatch("getMValidatesAction"           ) ,
                this.context.dispatch("getSmOptionsAction"            ) ,
                this.context.dispatch("getPersonalOptionsAction"      ) ,
            ]
        )
        .then(() => {
            console.log("getAllStores success") ;
            _this.context.commit(StoreConst.Masters.C_SET_IS_MASTER_LOADED, true) ;
            return Promise.resolve() ;
        })
        .catch(errors => {
            console.log("getAllStores Erros") ;
            return Promise.reject() ;
        })
        .finally(() =>{
            _this.context.commit(StoreConst.Masters.C_SET_IS_MASTER_LOADING, false) ;
        }) ;
    }

    @Action
    // 全マスタクリア
    [StoreConst.Masters.C_CLEAR_ALL_MASTERS_ACTION]() {
        this.context.commit(StoreConst.Masters.C_GET_M_BRANCHES           , [] ) ;
        this.context.commit(StoreConst.Masters.C_GET_M_KV_CATEGORIES      , [] ) ;
        this.context.commit(StoreConst.Masters.C_GET_M_MATRICES           , [] ) ;
        this.context.commit(StoreConst.Masters.C_GET_M_PROCESS_CATEGORIES , [] ) ;
        this.context.commit(StoreConst.Masters.C_GET_M_PRODUCT_CATEGORIES , [] ) ;
        this.context.commit(StoreConst.Masters.C_GET_M_PRODUCTIONS        , [] ) ;
        this.context.commit(StoreConst.Masters.C_GET_M_ROLES              , [] ) ;
        this.context.commit(StoreConst.Masters.C_GET_M_ROLE_KEYS          , [] ) ;
        this.context.commit(StoreConst.Masters.C_GET_M_TAG_CATEGORIES     , [] ) ;
        this.context.commit(StoreConst.Masters.C_GET_M_USERS              , [] ) ;
        this.context.commit(StoreConst.Masters.C_GET_M_VALIDATES          , [] ) ;
        this.context.commit(StoreConst.Masters.C_GET_SM_USER_OPTIONS      , [] ) ;
        this.context.commit(StoreConst.Masters.C_SET_IS_MASTER_LOADED     , false) ;
    }

    // MBranches
    @Mutation
    [StoreConst.Masters.C_GET_M_BRANCHES] (list:Array<Object>) {
        this.MBranches.splice(0) ;
        Array.prototype.push.apply(this.MBranches, list);
    }
    @Action
    getMBranchesAction () {
        return this.context.dispatch("getApiAction" , {
            apiUrl : "api/mBranch" ,
            mutationName : StoreConst.Masters.C_GET_M_BRANCHES
        });
    }

    // MMatrices
    @Mutation
    [StoreConst.Masters.C_GET_M_MATRICES] (list:Array<Object>) {
        this.MMatrices.splice(0) ;

        const parsedList:Array<MMatrix> = [] ;
        for ( const row of list){
            const parsed = MMatrix.parse(row) ;
            parsedList.push(parsed) ;
        }

        this.MMatrices.push(... parsedList) ;
        // Array.prototype.push.apply(this.MMatrices, parsedList) ;
    }
    @Action
    getMMatricesAction () {
        return this.context.dispatch("getApiAction", {
            apiUrl : "api/mMatrix" ,
            mutationName : StoreConst.Masters.C_GET_M_MATRICES
        });
        //this.context.dispatch("getApiAction" , { apiUrl : "api/mMatrix" , mutationName : StoreConst.Masters.C_GET_M_MATRICES}) ;
    }

    // MKvCategories
    @Mutation
    [StoreConst.Masters.C_GET_M_KV_CATEGORIES] (list:Array<Object>) {
        this.MKvCategories.splice(0) ;

        const parsedList:Array<MKvCategory> = list.map(x => MKvCategory.parse(x)) ;
        Array.prototype.push.apply(this.MKvCategories, parsedList) ;
    }
    @Action
    getMKvCategoriesAction () {
        return this.context.dispatch("getApiAction" , {
            apiUrl : "api/mKvCategory" ,
            mutationName : StoreConst.Masters.C_GET_M_KV_CATEGORIES
        }) ;
        //this.context.dispatch("getApiAction" , { apiUrl : "api/mKvCategory" , mutationName : StoreConst.Masters.C_GET_M_KV_CATEGORIES}) ;
    }

    // MProcessCategories 工程カテゴリー取得
    @Mutation
    [StoreConst.Masters.C_GET_M_PROCESS_CATEGORIES] (list:Array<Object>) {
        this.MProcessCategories.splice(0) ;

        const parsedList:Array<MProcessCategory> = [] ;
        for ( const row of list){
            const parsed = MProcessCategory.parse(row) ;
            parsedList.push(parsed) ;
        }

        // Array.prototype.push.apply(this.MProductions, list) ;
        Array.prototype.push.apply(this.MProcessCategories, parsedList) ;
    }
    @Action
    getMProcessCategoriesAction () {
      return this.context.dispatch("getApiAction" , {
            apiUrl : "api/mProcessCategory" ,
            mutationName : StoreConst.Masters.C_GET_M_PROCESS_CATEGORIES
        });
        //this.context.dispatch("getApiAction" , { apiUrl : "api/mProcessCategory" , mutationName : StoreConst.Masters.C_GET_M_PROCESS_CATEGORIES}) ;
    }

    // MProductCategories 商品カテゴリー取得
    @Mutation
    [StoreConst.Masters.C_GET_M_PRODUCT_CATEGORIES] (list:Array<Object>) {
        this.MProductCategories.splice(0) ;

        const parsedList:Array<MProductCategory> = [] ;
        for (const row of list) {
            const parsed = MProductCategory.parse(row) ;
            parsedList.push(parsed) ;
        }

        Array.prototype.push.apply(this.MProductCategories, parsedList) ;
    }
    @Action
    getMProductCategoriesAction () {
        return this.context.dispatch("getApiAction" , { apiUrl : "api/mProductCategory" , mutationName : StoreConst.Masters.C_GET_M_PRODUCT_CATEGORIES}) ;
    }

    // MProductions 生産先取得
    @Mutation
    [StoreConst.Masters.C_GET_M_PRODUCTIONS] (list:Array<Object>) {
        this.MProductions.splice(0) ;

        const parsedList:Array<MProduction> = [] ;
        for (const row of list) {
            const parsed = MProduction.parse(row) ;
            parsedList.push(parsed) ;
        }

        // Array.prototype.push.apply(this.MProductions, list) ;
        Array.prototype.push.apply(this.MProductions, parsedList) ;
    }
    @Action
    getMProductionsAction () {
        return this.context.dispatch("getApiAction" , {
            apiUrl : "api/mProduction" ,
            mutationName : StoreConst.Masters.C_GET_M_PRODUCTIONS
        }) ;
    }

    // MTagCategoriesタグカテゴリー
    @Mutation
    [StoreConst.Masters.C_GET_M_TAG_CATEGORIES] (list:Array<Object>) {
        this.MTagCategories.splice(0) ;
        Array.prototype.push.apply(this.MTagCategories, list) ;
    }
    @Action
    // MTagCategories取得
    getMTagCategoriesAction () {
        return this.context.dispatch("getApiAction" , { apiUrl : "api/mTagCategory" , mutationName : StoreConst.Masters.C_GET_M_TAG_CATEGORIES}) ;
    }

    // MUsers ユーザー取得
    @Mutation
    [StoreConst.Masters.C_GET_M_USERS] (list:Array<Object>) {
        this.MUsers.splice(0) ;
        Array.prototype.push.apply(this.MUsers, list) ;
    }
    @Action
    getMUsersAction () {
        return this.context.dispatch("getApiAction" , { apiUrl : "api/mUser" , mutationName : StoreConst.Masters.C_GET_M_USERS}) ;
    }

    @Mutation
    [StoreConst.Masters.C_GET_M_VALIDATES] (list:Array<Object>) {
        this.MValidates = list ;
    }
    @Action
    // 検証取得
    getMValidatesAction () {
        return this.context.dispatch("getApiAction" , { apiUrl : "api/mValidate" , mutationName : StoreConst.Masters.C_GET_M_VALIDATES}) ;
    }

    // 権限取得
    @Mutation
    [StoreConst.Masters.C_GET_M_ROLES] (list:Array<Object>) {
        this.MRoles = list ;
    }
    @Action
    getMRolesAction () {
        return this.context.dispatch("getApiAction" , { apiUrl : "api/mRole" , mutationName : StoreConst.Masters.C_GET_M_ROLES}) ;
    }

    // 権限key取得
    @Mutation
    [StoreConst.Masters.C_GET_M_ROLE_KEYS] (list:Array<Object>) {
        this.MRoleKeys = list ;
    }
    @Action
    getMRoleKeysAction () {
        return this.context.dispatch("getApiAction" , { apiUrl : "api/mRoleKey" , mutationName : StoreConst.Masters.C_GET_M_ROLE_KEYS}) ;
    }

    // システムオプション取得
    @Mutation
    [StoreConst.Masters.C_GET_SM_OPTIONS] (list:Array<SmOption>) {
        this.SmOptions = list ;
    }
    @Action
    getSmOptionsAction () {
        return this.context.dispatch("getApiAction" , { apiUrl : "api/smOption" , mutationName : StoreConst.Masters.C_GET_SM_OPTIONS}) ;
    }

    //個人設定取得
    @Mutation
    [StoreConst.Masters.C_GET_SM_USER_OPTIONS] (list:Array<SmUserOption>) {
        this.SmUserOptions = list ;
    }
    @Action
    getPersonalOptionsAction () {
        return this.context.dispatch("getApiAction" , { apiUrl : "api/smUserOption" , mutationName : StoreConst.Masters.C_GET_SM_USER_OPTIONS}) ;
    }

    // Getters
    /**
     * MUserのidからMUserを取得
     * @param val ID
     * @returns MUser 未発見の場合はundefined
     */
     public get getMUserById() {
        const _this = this ;

        return function(val:number) {
            if (NumberUtil.invalid2zr(val) === 0) return undefined ;
            //console.log(val) ;
            // @ts-ignore
            const finded = _this.MUsers.find(x => x.id == val) ;

            if (finded === undefined) {
                console.error("MUser is not found. id = " + val) ;
                return undefined ;
            }
            else {
                return finded ;
            }
      }
    }

    /**
     * MBranchのidからMBranchを取得
     * @param val ID
     * @returns MBranch 未発見の場合はundefined
     */
     public get getMBranchById() {
        const _this = this ;

        return function(val:number) {
        if (NumberUtil.invalid2zr(val) === 0) return undefined ;
        //console.log(val) ;
        // @ts-ignore
        const finded = _this.MBranches.find(x => x.id == val) ;

        if (finded === undefined) {
            console.error("MBranch is not found. id = " + val) ;
            return undefined ;
        }
        else {
            return finded ;
        }
      }
    }

    /**
     * MBranchのidからMBranchの色を取得
     * @param val ID
     * @returns success,info などのクラス用文字列未発見の場合は""
     */
    public get getMBranchColorById() {
        const _this = this ;

        return function(val:number) {
            let className = "" ;

            const findedBranch = _this.getMBranchById(val) ;
            if (findedBranch !== undefined) {
            // @ts-ignore
                const category = _this.MKvCategories.find(e => e.kv_key == MKvCategoriesConst.C_MKV_CAT_COLOR) ;
                if (category !== undefined) {
                    // @ts-ignore
                    const mKv = category.m_kvs.find(e => e.id == findedBranch.color_m_kv_id) ;
                    if (mKv !== undefined) {
                        className = mKv.kv_name ?? "" ;
                    }
                }
        }

        return className ;
      }
    }

    /**
     * MKvCategoryのKeyからMKvを取得
     * @param val ID
     * @returns MKv 未発見の場合はundefined
     */
    public get getMKvCategoryByKey() {
        const _this = this ;
        return function(val:string) {
        const found = _this.MKvCategories.find(e => e.kv_key == val) ;
        return found ;
        }
    }

    /**
     * MKvのidからMKvを取得
     * @param val ID
     * @returns MKv 未発見の場合はundefined
     */
    public get getMKvById() {
        const _this = this ;
        return function(val:number) {
            if (NumberUtil.invalid2zr(val) === 0) return undefined ;
            //console.log(val) ;
            const kvCategoryId = MastersUtil.getMKvCategoryIdById (val) ;
            //console.log("kvCategoryId " + kvCategoryId) ;
            // @ts-ignore
            const findedCat = _this.MKvCategories.find(x => x.id == kvCategoryId) ;

            if (findedCat === undefined) {
                console.error("KVCategor is not found. id = " + kvCategoryId ) ;
                return undefined ;
            } else {
                //console.log(findedCat) ;
                // @ts-ignore
                const finded = findedCat.m_kvs.find(x => x.id == val ) ;
                //console.log("finded") ;
                //console.log(finded) ;

                // @ts-ignore
                return finded !== undefined ? finded : undefined ;
            }
        }
    }

    /**
     * idからMUserを取得
     * @param val ID
     * @returns MProcessCategory 未発見の場合はundefined
     */
     public get getMProcessCategoryById() {
        const _this = this ;

        return function(val:number) {
            if (NumberUtil.invalid2zr( val ) === 0) return undefined ;
            //console.log(val) ;
            // @ts-ignore
            const finded = _this.MProcessCategories.find(x => x.id == val) ;

            if (finded === undefined) {
                console.error("MProcessCategory is not found. id = " + val) ;
                return undefined ;
            } else {
                return finded ;
            }
        }
    }

    /**
     * mProductCategoryId , mProcessCategoryIdから pivot取得
     */
    public get getMProcessCategoryWtPivotByIds() {
        const _this = this ;

        return function(mProductCategoryId:number , mProcessCategoryId:number ) {
            // @ts-ignore
            const mProductCategory = _this.MProductCategories.find(e => e.id === mProductCategoryId) ;
            // @ts-ignore
            const pivot = mProductCategory.link_process_categories_pivot.find(e => e.id === mProcessCategoryId) ;
            if (ObjectUtil.isNU(pivot)) {
                return {
                  is_enabled : false ,
                  deleted_at : Date() ,
                  m_process_category : {cd :"Null", name : "Deleted", "pivot" : {}} ,
                } ;
            }
            return pivot ;
        }
    }

    /**
     * idからMProductionを取得
     * @param val ID
     * @returns MProduction 未発見の場合はundefined
     */
     public get getMProductionById() {
        const _this = this ;

        return function(val:number) {
            if (NumberUtil.invalid2zr(val) == 0) return undefined ;
            //console.log(val) ;
            for (const mProduction of _this.MProductions) {
                //console.log(mProduction) ;
                // @ts-ignore
                if (mProduction.id == val) return mProduction ;
            }

            console.error("MProduction is not found. id = " + val) ;
            return undefined ;
        }
    }

    /**
     * idからMProductionModeを取得
     * @param val ID
     * @returns MProductionMode 未発見の場合はundefined
     */
     public get getMProductionModeById() {
        const _this = this ;

        return function(val:number) {
            if (NumberUtil.invalid2zr(val) == 0) return undefined ;
            //console.log(val) ;
            for (const mProduction of _this.MProductions) {
            //console.log(mProduction) ;
            // @ts-ignore
                for ( const mMode of mProduction.m_production_modes) {
                    if (mMode.id == val) return mMode ;
                }
            }

            console.error("MProductionMode is not found. id = " + val) ;
            return undefined ;
        }
    }

    /**
     * idからMProductionOptionを取得
     * @param val ID
     * @returns MProductionmOption 未発見の場合はundefined
     */
     public get getMProductionOptionById() {
        const _this = this ;

        return function(val:number) {
            if (NumberUtil.invalid2zr(val) == 0) return undefined ;
            //console.log(val) ;
            for ( const mProduction of _this.MProductions){
            // console.log(mProduction) ;
            // @ts-ignore
                for (const mOption of mProduction.m_production_options) {
                    if (mOption.id == val) return mOption ;
                }
            }

            console.error("MProductionOption is not found. id = " + val) ;
            return undefined ;
        }
    }

    /**
     * m_matricesから該当の値を取得する
     * @param mBranchId 拠点ID
     * @param cd m_matrices.cd
     * @param k1 k1
     * @param k2
     * @param k3
     * @param k4
     * @returns
     */
    public get getMtx ()
    {
        const _this = this ;
        return function
        (
          mBranchId : number ,
          cd :string ,
          k1:string  ,
          k2:string = "" ,
          k3:string = "" ,
          k4:string = "") : any
        {
          // @ts-ignore
          const mtx:MMatrix = _this.MMatrices.find(x => x.cd == cd &&
              (x.m_branch_id == mBranchId || x.m_branch_id === null)) ;
          if (mtx === undefined) {
              return {
                  error : cd + " m_matrix setting is undefined"
              } ;
          }

          return _this.getMtxById(mBranchId , mtx?.id ?? 0, k1 ,k2 ,k3,k4) ;
        }
    } ;

    // マトリクスからの取得
    public get getMtxById() {
        const _this = this ;
        return function
        (
            mBranchId : number ,
            mMatrixId : number ,
            k1:string  ,
            k2:string = "" ,
            k3:string = "" ,
            k4:string = "" ) :any
        {
            const matrix = _this.MMatrices.find(x =>
                x.id == mMatrixId && (x.m_branch_id == mBranchId || x.m_branch_id === null)
            ) ;

            if (matrix === undefined) return undefined ;

            // 評価する値のみ抽出
            const kValues = [k1] ;
            if (k2 != "") kValues.push(k2) ;
            if (k3 != "") kValues.push(k3) ;
            if (k4 != "") kValues.push(k4) ;

            // 1要素ずつ絞り込み
            let costDetails = matrix.m_matrix_details ;
            for (let i = 0 ; i < kValues.length ; i++) {
                const idx = i + 1 ;
                const idxStr = "k" + idx ;
                const val = kValues[i] ;
                // @ts-ignore
                const op = matrix[idxStr + "_op"] ;

                if (op == 1) {
                    // 演算子 = の場合
                    // @ts-ignore
                    costDetails = costDetails.filter(x => x[idxStr] == val) ;
                } else {
                    let values:Array<Number> = [] ;

                    // @ts-ignore
                    costDetails.map(function(x)
                    {
                      // @ts-ignore
                        const val = Number(x[idxStr]) ;
                        if (values.indexOf(val) === -1) values.push(val) ;
                    }) ;

                    // 大きいもの順に並べる
                    values = values.sort().reverse() ;

                    // 条件にあうもののみFilterで抽出
                    // @ts-ignore
                    values = values.filter(function(x)
                    {
                        if (op == 2) return Number(val) <  x ;
                        if (op == 3) return Number(val) >  x ;
                        if (op == 4) return Number(val) <= x ;
                        if (op == 5) return Number(val) >= x ;
                    } ) ;

                    // 最小値を取得
                    const minVal = values.reduce(function(a, b) {
                        // @ts-ignore
                        return Math.min(a, b);
                    });

                    // @ts-ignore
                    costDetails = costDetails.filter(x => x[idxStr] == minVal) ;
                }

                // 結果なし
                if (costDetails.length === 0) {
                    return {
                        // @ts-ignore
                        error : matrix.name + " " + matrix[idxStr + "_name"] + " does not matched."
                    } ;
                }
            }
            //console.log(costDetails[0]) ;

            return costDetails[0] ;
        }
    }

    /**
     * KeyMKvIdからOptionの値を取得　存在しない場合 m_kvs.g_01に設定されているデフォルト値を取得
     * @param val ID
     * @returns 値 未発見の場合はundefined
     */
    public get getSMOptionValByKeyMKvId() {
        const _this = this ;

        return function(val:number) {
            if (NumberUtil.invalid2zr(val) === 0) return undefined ;

            const mKv = _this.getMKvById(val) ;
            if (mKv === undefined) {
                console.error("MKv(SmOption.key_m_kv_id) is not found. id = " + val) ;
                return undefined ;
            }

            const dataType = _.isNil(mKv.g_02) ? "" : mKv.g_02.toLowerCase() ;
            const found = _this.SmOptions.find(x => x.key_m_kv_id === val) ;
            let rtnVal ;
            // 見つからなかった場合はMKv.g_01に設定されているデフォルト値
            if (found !== undefined ) {
                rtnVal = found.value ;
            } else {
                rtnVal = mKv.g_01 ;
            }

            switch (dataType) {
              case "number" :
                rtnVal = Number(rtnVal) ;
                if (isNaN(rtnVal)) {
                  rtnVal = Number(mKv.g_01) ;
                }
                break ;

              case "bool" :
                rtnVal = Number(rtnVal) ;
                if (isNaN(rtnVal)) {
                    rtnVal = Number(mKv.g_01) ;
                }
                rtnVal = Boolean(rtnVal) ;
            }
            return rtnVal;
        }
    }
}