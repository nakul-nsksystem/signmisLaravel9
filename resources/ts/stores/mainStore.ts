import axios from 'axios';
import StoreConst from '../consts/StoreConst';
import { MUser } from '../components/masters/class/models/MUser';
import { defineStore } from "pinia"
import { useMasterStore } from "./masterStore"

interface State {
    isDebug:boolean,
    appUrl:string,
    customerKey:string|undefined,
    loginMUser:MUser|undefined,
    masters :any,
}

//ログイン用パラメータ型
interface loginParams {
    email:string ,
    password:string ,
}

export const useStore = defineStore("main", {
    state: () :State => ({
        // アプリ上のデバッグモード
        isDebug: false ,
        // アプリケーションのURL
        appUrl: "" ,
        // 顧客の識別キー
        customerKey: "" ,
        // LoginUser
        loginMUser: undefined,
        //masterstore呼び出し
        masters : useMasterStore() ,
    }),
    getters: {
        isNskUser: state => {
            if (state.loginMUser === undefined) return false ;
            return state.loginMUser.is_nsk_user ;
        },
        // ログイン済みかどうか
        isAutholized: state => {
            return state.loginMUser !== undefined ;
        },
        /** Master 等が取得できてアプリが準備完了 */
        isAppReady: state => {
            return state.masters.IsMasterLoaded ;
        },
        getRole: (state) => {
            return (accessKey: string, isIgnoreNskUser: boolean = false) => {
                // console.log(accessKey) ;
                if (state.loginMUser === undefined) return 0 ;

                //NSKユーザー判定
                //@ts-ignore
                if (state.loginMUser.is_nsk_user && !isIgnoreNskUser) return 100 ;

                //key不要な場合
                if (accessKey === "no-check") return 100 ;
                // console.log("key checked") ;

                //機能使用権限があるかの判定
                const systemCheck = state.masters.MRoleKeys.find(
                    //@ts-ignore
                    x => x.name === accessKey && x.system_flg > 0
                );
                if (systemCheck == undefined) return 0 ;
                // console.log("system checked") ;

                //ログインユーザーのrole取得
                const userRoles = state.loginMUser.m_roles;
                if (userRoles.length == 0) return 0 ;

                //ログインユーザーのroleの形式変更
                const strArr = [] ;
                for (const role of userRoles) {
                    for (const roleDet of role.m_role_details) {
                        strArr.push(roleDet) ;
                    }
                }

                // console.log("finish format roles") ;
                //keyが一致する権限の中で、最大のcontrol_levelを取得
                //@ts-ignore
                const filterdList = strArr.filter(x => x.m_role_key.name === accessKey);
                if (filterdList.length === 0) return 0;

                //@ts-ignore
                const roleLevel = filterdList.map(x => x.control_level).reduce(function (a, b) {
                    const maxLevel = Math.max(a, b) ;
                    return maxLevel ;
                });
                // console.log("finish getRole") ;
                // console.log(roleLevel) ;
                return roleLevel ;
            }
        },
        getAppVersion(): string {
            return "0.2.2.2" ;
        },
    },

    actions: {
        testAction() {
            // console.log("testAction")
            this.masters.getAllMasters();
        },
        /** IsDebugの変更アクション*/
        changeIsDebugAction( payload:boolean ) {
            this.isDebug = payload ;
        },
        /** appUrlの変更アクション */
        setAppUrlAction( url:string ) {
            this.appUrl = url ;
        },
        /** 顧客キーの変更アクション 使ってない？*/
        setCustomerKeyAction( key:string|undefined ) {
            this.customerKey = key ;
        },
        /** loginMUserの変更アクション */
        setLoginUserAction(val:MUser|undefined){
            this.loginMUser = val ;
        },
        /** ログアウト */
        async logoutAction( isTimeout:boolean = false ) {
            console.log("logout") ;

            //サーバー通信でAutholize,timeOutの時
            if (isTimeout) {
                console.log("timeout") ;
                //loginUserをクリア
                this.setLoginUserAction(undefined) ;
                //masterをクリア
            } else {
                //ログアウトボタンの処理
                const url = "api/auth/logout" ;
                axios.post(url)
                    .then((resp) => {
                    // LoginUser Clear
                    })
                    .catch( error => {
                        console.log("logout failed") ;
                        console.error(error) ;
                    })
                    .finally(() => {
                        //loginUserをクリア
                        this.setLoginUserAction(undefined) ;
                        //デバッグチェックのクリア
                        this.changeIsDebugAction(false) ;
                        //masterをクリア
                        this.masters.clearAllMasters() ;
                    });
            }
        },
        /** ログイン */
        async loginAction(credentials:loginParams) {
            return new Promise((resolve, reject) => {
                const csrfCookieUrl = `sanctum/csrf-cookie` ;

                // CsrfCookie取得
                axios.get(csrfCookieUrl)
                  .then((csrfRes) => {
                    const url = `api/auth/login` ;
                    axios.post(url, credentials)
                      .then((resp) => {
                        //const token = resp.data.token ;
                        //console.log("token:" + resp.data.token ) ;
                        //console.log(JSON.stringify( resp.data) ) ;
                        //axios.defaults.headers.common.Authorization = `bearer ${token}` ;
                        resolve("") ;
                      })
                      .catch( error => {
                        // console.log("login failed") ;
                        reject() ;
                      });
                  })
                  .catch((csrfError) => {
                      const csrfErrMsg = "csrfCookie Error" ;
                      console.log(csrfErrMsg) ;
                      reject(csrfErrMsg) ;
                  }) ;
            }) ;
        },
        /**
       * CsrfCookieが有効なユーザー取得
       * @param param0
       * @returns
       */
        async getCurrentUserAction() {
            return new Promise((resolve, reject) => {
                const url = `api/auth/user` ;

                axios.get(url)
                  .then(x => {
                      this.setLoginUserAction(x.data.m_user) ;
                      this.changeIsDebugAction(x.data.m_user.is_default_debug) ;
                      // console.log(" auth user :" + this.isAutholized) ;
                      this.masters.getAllMasters()
                        .then(() => {
                            // @ts-ignore
                            // console.log("resolve getAllStore success") ;
                            resolve("") ;
                        })
                        .catch(() => {
                            // console.log("rejected getAllStore failed") ;
                            reject("") ;
                        }) ;
                  })
                  .catch(error => {
                    //console.log("No") ;
                    if (error.response.status === 401) {
                        // 認証できてない
                        console.log("UnAuthorized") ;
                        // Login
                    } else {
                        console.log(error) ;
                    }
                    // @ts-ignore
                    reject() ;

                  }) ;
              }) ;
        },
        //ページ遷移時にログインユーザー再取得
        async getPageTransitionUserAction () {
            return new Promise((resolve, reject) => {
                const url = `api/auth/user` ;

                axios.get(url)
                  .then(x => {
                      // @ts-ignore
                      this.setLoginUserAction(x.data.m_user) ;
                      resolve("") ;
                  })
                  .catch(error => {
                    if (error.response.status === 401) {
                      // 認証できてない
                      console.log("UnAuthorized") ;
                      //マスタクリア
                      this.masters.clearAllMasters() ;
                    } else {
                      console.log(error) ;
                    }

                    // Login
                    // @ts-ignore
                    reject() ;
                }) ;
            }) ;
        },
    }
})
