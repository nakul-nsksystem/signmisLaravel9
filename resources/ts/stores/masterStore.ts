import axios                from 'axios';
import _                    from 'lodash';
import { MBranch }          from '../components/masters/class/models/MBranch';
import { MKvCategory }      from '../components/masters/class/models/MKvCategory';
import { MMatrix }          from '../components/masters/class/models/MMatrix';
import { MProcessCategory } from '../components/masters/class/models/MProcessCategory';
import { MProductCategory } from '../components/masters/class/models/MProductCategory';
import { MProduction }      from '../components/masters/class/models/MProduction';
import { MRole }            from '../components/masters/class/models/MRoles';
import { MRoleKey }         from '../components/masters/class/models/MRoleKeys';
import { MTagCategory }     from '../components/masters/class/models/MTagCategories';
import { MTax }             from '../components/masters/class/models/MTax';
import { MUser }            from '../components/masters/class/models/MUser';
import { SmOption }         from '../components/masters/class/models/SmOption';
import { SmUserOption }     from '../components/masters/class/models/SmUserOption';
import MKvCategoriesConst   from '../consts/MKvCategoriesConst';
import MastersUtil          from '../frameworks/MastersUtil';
import NumberUtil           from '../frameworks/NumberUtil';
import ObjectUtil           from '../frameworks/ObjectUtil';
import { defineStore }      from "pinia"
// import { useStore } from "./mainStore"

interface State {
    MBranches:Array<MBranch>,
    MKvCategories:Array<MKvCategory>,
    MMatrices:Array<MMatrix>,
    MProcessCategories:Array<MProcessCategory>,
    MProductCategories:Array<MProductCategory>,
    MProductions:Array<MProduction>,
    MRoles:Array<MRole>,
    MRoleKeys:Array<MRoleKey>,
    MTagCategories:Array<MTagCategory>,
    MTaxes:Array<MTax>,
    MUsers:Array<MUser>,
    MValidates:Array<Object>,
    SmOptions:Array<SmOption>,
    SmUserOptions:Array<SmUserOption>,
    IsMasterLoading:boolean,
    IsMasterLoaded:boolean,
}

export const useMasterStore = defineStore("master", {
    state: ():State => {
        return {
            MBranches           : [],
            MKvCategories       : [],
            MMatrices           : [],
            MProcessCategories  : [],
            MProductCategories  : [],
            MProductions        : [],
            MRoles              : [],
            MRoleKeys           : [],
            MTagCategories      : [],
            MTaxes              : [],
            MUsers              : [],
            MValidates          : [],
            SmOptions           : [],
            SmUserOptions       : [],

            /**マスターローディング中 */
            IsMasterLoading: false,
            /**マスターローディング済み */
            IsMasterLoaded: false,
        }
    } ,
    getters: {
        /**
         * MUserのidからMUserを取得
         * @param val ID
         * @returns MUser 未発見の場合はundefined
         */
        getMUserById (state) {
            return (val:number) => {
                if (NumberUtil.invalid2zr(val) === 0) return undefined ;
                const finded = state.MUsers.find(x => x.id == val) ;

                if (finded === undefined) {
                    console.error("MUser is not found. id = " + val) ;
                    return undefined ;
                } else {
                    return finded ;
                }
            }
        } ,

        /**
         * MBranchのidからMBranchを取得
         * @param val ID
         * @returns MBranch 未発見の場合はundefined
         */
        getMBranchById (state) {
            return (val:number) => {
                if (NumberUtil.invalid2zr(val) === 0) return undefined ;
                //console.log(val) ;
                const finded = state.MBranches.find(x => x.id == val) ;

                if (finded === undefined) {
                    console.error("MBranch is not found. id = " + val) ;
                    return undefined ;
                } else {
                    return finded ;
                }
            }
        },

        /**
         * MBranchのidからMBranchの色を取得
         * @param val ID
         * @returns success,info などのクラス用文字列未発見の場合は""
         */
        getMBranchColorById (state) {
            return (val:number) => {
                let className = "" ;
                const findedBranch = this.getMBranchById(val) ;
                if (findedBranch !== undefined) {
                    // @ts-ignore
                    const category = state.MKvCategories.find(e => e.kv_key == MKvCategoriesConst.C_MKV_CAT_COLOR) ;
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
        },

        /**
         * MKvCategoryのKeyからMKvを取得
         * @param val ID
         * @returns MKv 未発見の場合はundefined
         */
        getMKvCategoryByKey (state) {
            return (val:string) => {
                const found = state.MKvCategories.find(e => e.kv_key == val) ;
                return found ;
            }
        },

        /**
         * MKvのidからMKvを取得
         * @param val ID
         * @returns MKv 未発見の場合はundefined
         */
        getMKvById (state) {
            return (val:number) => {
                if (NumberUtil.invalid2zr(val) === 0) return undefined ;
                //console.log(val) ;
                const kvCategoryId = MastersUtil.getMKvCategoryIdById (val) ;
                //console.log("kvCategoryId " + kvCategoryId) ;
                // @ts-ignore
                const findedCat = state.MKvCategories.find(x => x.id == kvCategoryId) ;

                if (findedCat === undefined) {
                    console.error("KVCategor is not found. id = " + kvCategoryId ) ;
                    return undefined ;
                }
                else {
                    //console.log(findedCat) ;
                    // @ts-ignore
                    const finded = findedCat.m_kvs.find(x => x.id == val ) ;
                    //console.log("finded") ;
                    //console.log(finded) ;
                    // @ts-ignore
                    return finded !== undefined ? finded : undefined ;
                }
            }
        },

        /**
         * idからMProcessCategoryを取得
         * @param val ID
         * @returns MProcessCategory 未発見の場合はundefined
         */
        getMProcessCategoryById (state) {
            return (val:number) => {
                if (NumberUtil.invalid2zr(val) === 0) return undefined ;
                //console.log(val) ;
                const finded = state.MProcessCategories.find(x => x.id == val) ;

                if (finded === undefined) {
                    console.error("MProcessCategory is not found. id = " + val) ;
                    return undefined ;
                } else {
                    return finded ;
                }
            }
        },

        /**
         * mProductCategoryId , mProcessCategoryIdから pivot取得
         */
        getMProcessCategoryWtPivotByIds (state) {
            return (mProductCategoryId:number , mProcessCategoryId:number) => {
                const mProductCategory = state.MProductCategories.find(e => e.id === mProductCategoryId) ;
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
        },

        /**
         * idからMProductionを取得
         * @param val ID
         * @returns MProduction 未発見の場合はundefined
         */
        getMProductionById (state) {
            return (val:number) => {
                if (NumberUtil.invalid2zr(val) == 0) return undefined ;
                //console.log(val) ;
                for (const mProduction of state.MProductions) {
                    //console.log(mProduction) ;
                    if (mProduction.id == val) return mProduction ;
                }

                console.error("MProduction is not found. id = " + val) ;
                return undefined ;
            }
        },

        /**
         * idからMProductionModeを取得
         * @param val ID
         * @returns MProductionMode 未発見の場合はundefined
         */
        getMProductionModeById (state) {
            return (val:number) => {
                if (NumberUtil.invalid2zr(val) == 0) return undefined ;
                //console.log(val) ;
                for (const mProduction of state.MProductions) {
                    //console.log(mProduction) ;
                    for (const mMode of mProduction.m_production_modes) {
                        if (mMode.id == val) return mMode ;
                    }
                }

                console.error("MProductionMode is not found. id = " + val) ;
                return undefined ;
            }
        },

        /**
         * idからMProductionOptionを取得
         * @param val ID
         * @returns MProductionmOption 未発見の場合はundefined
         */
        getMProductionOptionById (state) {
            return (val:number) => {
                if (NumberUtil.invalid2zr(val) == 0) return undefined ;
                //console.log(val) ;
                for (const mProduction of state.MProductions) {
                    // console.log(mProduction) ;
                    for ( const mOption of mProduction.m_production_options) {
                        if (mOption.id == val) return mOption ;
                    }
                }

                console.error("MProductionOption is not found. id = " + val) ;
                return undefined ;
            }
        },

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
        getMtx (state) {
            return (mBranchId:number ,cd:string ,k1:string ,k2:string = "" ,k3:string = "" ,k4:string = ""):any => {
                // @ts-ignore
                const mtx:MMatrix = state.MMatrices.find(x => x.cd == cd &&
                    (x.m_branch_id == mBranchId || x.m_branch_id === null)) ;
                if (mtx === undefined) {
                    return {
                        error : cd + " m_matrix setting is undefined"
                    } ;
                }
                return this.getMtxById(mBranchId, mtx?.id ?? 0, k1, k2, k3, k4) ;
            }
        },

        // マトリクスからの取得
        getMtxById (state) {
            return (mBranchId : number ,mMatrixId :number ,k1:string ,k2:string = "" ,k3:string = "" ,k4:string = ""):any => {
                const matrix = state.MMatrices.find(x =>
                    x.id == mMatrixId && (x.m_branch_id == mBranchId || x.m_branch_id === null)) ;
                  if (matrix === undefined) return undefined ;

                  // 評価する値のみ抽出
                  const kValues = [ k1 ] ;
                  if (k2 != "") kValues.push(k2) ;
                  if (k3 != "") kValues.push(k3) ;
                  if (k4 != "") kValues.push(k4) ;

                  // 1要素ずつ絞り込み
                  let costDetails = matrix.m_matrix_details ;
                  for (let i = 0 ;i < kValues.length ;i++ ){
                      const idx    = i + 1 ;
                      const idxStr = "k" + idx ;
                      const val    = kValues[i] ;
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
                          }) ;

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

                  return costDetails[0] ;
            }
        },

        /**
         * KeyMKvIdからOptionの値を取得　存在しない場合 m_kvs.g_01に設定されているデフォルト値を取得
         * @param val ID
         * @returns 値 未発見の場合はundefined
         */
        getSMOptionValByKeyMKvId (state) {
            return (val:number) => {
                if (NumberUtil.invalid2zr( val ) === 0) return undefined ;
                //@ts-ignore
                const mKv = this.getMKvById(val) ;
                if (mKv === undefined) {
                    console.error("MKv(SmOption.key_m_kv_id) is not found. id = " + val) ;
                    return undefined ;
                }

                const dataType = _.isNil(mKv.g_02) ? "" : mKv.g_02.toLowerCase() ;
                const found = state.SmOptions.find(x => x.key_m_kv_id === val) ;
                let rtnVal ;
                // 見つからなかった場合はMKv.g_01に設定されているデフォルト値
                if (found !== undefined) {
                    rtnVal = found.value ;
                } else {
                    rtnVal = mKv.g_01 ;
                }

                switch (dataType) {
                case "number" :
                    rtnVal = Number(rtnVal) ;
                    if (isNaN(rtnVal)){
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

                return rtnVal ;
            }
        },

        /**
         * 日付から消費税を取得
         * @param val Date
         * @returns 消費税 未発見の場合はundefined
         */
        getMTax (state) {
            return (val:Date) => {
                if (!val) return undefined ;
                // @ts-ignore
                const finded = state.MTaxes.find(x => x.start_day <= val) ;
                return finded ;
            }
        },
    },

    actions: {
        // 汎用取得API
        getApiAction(param: { apiUrl: string, setActionName: string }) {
            return new Promise((resolve, reject) => {
                const url = `${param.apiUrl}` ;

                axios.get(url)
                    .then((res) => {
                        //@ts-ignore
                        this[param.setActionName](res.data) ;
                        resolve("") ;
                    })
                    .catch((error) => {
                        const {
                            status,
                            statusText
                        } = error.response ;

                        console.error(`Error! HTTP Status: ${status} ${statusText} ${url}`) ;
                        // console.log("reject") ;
                        reject("Error !") ;
                    });
            });
        },

        // 全マスタセット
        getAllMasters(): Promise<any> {
            const _this = this;
            this.IsMasterLoading = true ;

            return Promise.all(
                [
                    this.getMBranches(),
                    this.getMKvCategories(),
                    this.getMMatrices(),
                    this.getMProcessCategories(),
                    this.getMProductCategories(),
                    this.getMProductions(),
                    this.getMRoles(),
                    this.getMRoleKeys(),
                    this.getMTagCategories(),
                    this.getMTaxes(),
                    this.getMUsers(),
                    this.getMValidates(),
                    this.getSmOptions(),
                    this.getSmUserOptions(),
                ]
            )
                .then(() => {
                    console.log("getAllStores success") ;
                    _this.IsMasterLoaded = true ;
                    return Promise.resolve() ;
                })
                .catch(errors => {
                    console.log("getAllStores Errors") ;
                    return Promise.reject() ;
                })
                .finally(() => {
                    _this.IsMasterLoading = false ;
                });
        },

        // 全マスタクリア
        clearAllMasters() {
            //stateを初期化
            this.$reset() ;
            // this.setMBranches([]);
            // this.setMMatrices([]);
            // this.setMKvCategories([]);
            // this.setMTagCategories([]);
            // this.setMProcessCategories([]);
            // this.setMProductCategories([]);
            // this.setMProductions([]);
            // this.setMUsers([]);
            // this.setMValidates([]);
            // this.setMRoles([]);
            // this.setMRoleKeys([]);
            // this.setSmOptions([]);
            // this.setSmUserOptions([]);
            // this.IsMasterLoaded = false;
        },

        // MBranches
        async getMBranches() {
            const params = {
                apiUrl: "api/mBranch",
                setActionName: "setMBranches"
            }
            await this.getApiAction(params) ;
        },
        
        setMBranches(list: Array<object>) {
            this.MBranches.splice(0);
            const parsedList: Array<MBranch> = list.map(x => MBranch.parse(x)) ;
            this.MBranches.push(...parsedList) ;
        },

        // MMatrices
        async getMMatrices() {
            const params = {
                apiUrl: "api/mMatrix",
                setActionName: "setMMatrices"
            }
            await this.getApiAction(params) ;
        },

        setMMatrices(list: Array<Object>) {
            this.MMatrices.splice(0) ;
            const parsedList: Array<MMatrix> = list.map(x => MMatrix.parse(x)) ;
            this.MMatrices.push(...parsedList) ;
        },

        // MKvCategories
        async getMKvCategories() {
            const params = {
                apiUrl: "api/mKvCategory",
                setActionName: "setMKvCategories"
            }
            await this.getApiAction(params) ;
        },

        setMKvCategories(list: Array<Object>) {
            this.MKvCategories.splice(0) ;
            const parsedList: Array<MKvCategory> = list.map(x => MKvCategory.parse(x)) ;
            this.MKvCategories.push(...parsedList) ;
        },

        // MProcessCategories 工程カテゴリー取得
        async getMProcessCategories() {
            const params = {
                apiUrl: "api/mProcessCategory",
                setActionName: "setMProcessCategories"
            }
            await this.getApiAction(params) ;
        },

        setMProcessCategories(list: Array<Object>) {
            this.MProcessCategories.splice(0) ;
            const parsedList: Array<MProcessCategory> = list.map(x => MProcessCategory.parse(x)) ;
            this.MProcessCategories.push(...parsedList) ;
        },

        // MProductCategories 商品カテゴリー取得
        async getMProductCategories() {
            const params = {
                apiUrl: "api/mProductCategory",
                setActionName: "setMProductCategories"
            }
            await this.getApiAction(params) ;
        },

        setMProductCategories(list: Array<Object>) {
            this.MProductCategories.splice(0) ;
            const parsedList: Array<MProductCategory> = list.map(x => MProductCategory.parse(x)) ;
            this.MProductCategories.push(...parsedList) ;
        },

        // MProductions 生産先取得
        async getMProductions() {
            const params = {
                apiUrl: "api/mProduction",
                setActionName: "setMProductions"
            }
            await this.getApiAction(params) ;
        },

        setMProductions(list: Array<Object>) {
            this.MProductions.splice(0) ;
            const parsedList: Array<MProduction> = list.map(x => MProduction.parse(x)) ;
            this.MProductions.push(...parsedList) ;
        },

        // MTagCategoriesタグカテゴリー
        async getMTagCategories() {
            const params = {
                apiUrl: "api/mTagCategory",
                setActionName: "setMTagCategories"
            }
            await this.getApiAction(params) ;
        },

        setMTagCategories(list: Array<Object>) {
            this.MTagCategories.splice(0) ;
            const parsedList: Array<MTagCategory> = list.map(x => MTagCategory.parse(x)) ;
            this.MTagCategories.push(...parsedList) ;
        },

        // MUsers ユーザー取得
        async getMUsers() {
            const params = {
                apiUrl: "api/mUser",
                setActionName: "setMUsers"
            }
            await this.getApiAction(params) ;
        },

        setMUsers(list: Array<Object>) {
            this.MUsers.splice(0) ;
            const parsedList: Array<MUser> = list.map(x => MUser.parse(x)) ;
            this.MUsers.push(...parsedList) ;
        },

        // 検証取得
        async getMValidates() {
            const params = {
                apiUrl: "api/mValidate",
                setActionName: "setMValidates"
            }
            await this.getApiAction(params) ;
        },

        setMValidates(list: Array<Object>) {
            this.MValidates.splice(0) ;
            this.MValidates.push(...list) ;
        },

        // 権限取得
        async getMRoles() {
            const params = {
                apiUrl: "api/mRole",
                setActionName: "setMRoles"
            }
            await this.getApiAction(params) ;
        },

        setMRoles(list: Array<Object>) {
            this.MRoles.splice(0) ;
            const parsedList: Array<MRole> = list.map(x => MRole.parse(x)) ;
            this.MRoles.push(...parsedList) ;
        },

        // 権限key取得
        async getMRoleKeys() {
            const params = {
                apiUrl: "api/mRoleKey",
                setActionName: "setMRoleKeys"
            }
            await this.getApiAction(params) ;
        },

        setMRoleKeys(list: Array<Object>) {
            this.MRoleKeys.splice(0) ;
            const parsedList: Array<MRoleKey> = list.map(x => MRoleKey.parse(x)) ;
            this.MRoleKeys.push(...parsedList);
        },

        // 税
        async getMTaxes() {
            const params = {
                apiUrl: "api/mTax",
                setActionName: "setMTaxes"
            }
            await this.getApiAction(params) ;
        },

        setMTaxes(list: Array<Object>) {
            this.MTaxes.splice(0) ;
            const parsedList: Array<MTax> = list.map(x => MTax.parse(x)) ;
            this.MTaxes.push(...parsedList) ;
        },

        // システムオプション取得
        async getSmOptions() {
            const params = {
                apiUrl: "api/smOption",
                setActionName: "setSmOptions"
            }
            await this.getApiAction(params) ;
        },

        setSmOptions(list: Array<SmOption>) {
            this.SmOptions.splice(0) ;
            const parsedList: Array<SmOption> = list.map(x => SmOption.parse(x)) ;
            this.SmOptions.push(...parsedList) ;
        },

        //個人設定取得
        async getSmUserOptions() {
            const params = {
                apiUrl: "api/smUserOption",
                setActionName: "setSmUserOptions"
            }
            await this.getApiAction(params) ;
        },

        setSmUserOptions(list: Array<SmUserOption>) {
            this.SmUserOptions.splice(0) ;
            const parsedList: Array<SmUserOption> = list.map(x => SmUserOption.parse(x)) ;
            this.SmUserOptions.push(...parsedList) ;
        },
    }
})
