import SvgConst                 from "../consts/SvgConst";
import NumberUtil               from "../frameworks/NumberUtil";
import { mapActions, mapState } from "pinia";
import { useStore }             from "../stores/mainStore";
import DayJsEx                  from "../frameworks/DayJsEx";
import ObjectUtil               from "../frameworks/ObjectUtil";
import dayjs, { Dayjs }         from "dayjs";
import _                        from "lodash" ;

export default {
    data : function() {
        return {
            // エラー状態
            dErrorStatus : "" ,
            dErrorMessage : "" ,
            dErrorData : {} ,

        }
    } ,
    computed : {
        $$cAppUrl : function():String {
            // @ts-ignore
            return this.storeAppUrl() ;
        } ,
        $$cCustomerKey : function() :string {
            // @ts-ignore
            return this.storeCustomerKey();
        } ,
        // デバッグモード
        $$cIsDebug : function() :Boolean {
            // @ts-ignore
            return this.storeIsDebug() ;
        } ,
        // エラー
        $$cIsError : function () :boolean {
            // @ts-ignore
            return this.dErrorStatus !== undefined && this.dErrorStatus !== "" ;
        } ,
        //トークン取得
        $$cCsrfToken : function() {
            // @ts-ignore
            return window.Laravel.csrfToken ;
        } ,
        // ログインユーザーがNSK開発ユーザーか
        $$cIsNskDev : function () : Boolean {
            // @ts-ignore
            return this.storeIsNskUser() ;
        } ,
        // アプリが準備OK（Storeが取れてる）
        $$cIsAppReady : function() :Boolean {
            // @ts-ignore
            return this.storeIsAppReady() ;
        } ,
        $$cLoginUserId : function() : Number {
            // @ts-ignore
            return this.storeLoginMUser().id ;
        } ,

        $$_ : function() {
            return _ ;
        }
    } ,

    methods: {
        ...mapActions(useStore,['logoutAction']),

        //各コンポーネント内のprops等と名前が被るとエラーが出るためリネーム
        ...mapState(useStore,{
            storeAppUrl:'appUrl',
            storeCustomerKey:'customerKey',
            storeIsDebug:'isDebug',
            storeIsNskUser:'isNskUser',
            storeIsAppReady:'isAppReady',
            storeLoginMUser:'loginMUser',
        }),
        // エラーをコンソールに出力
        $$errorConsole : function (error:any, ep:string="")
        {
            console.error(error) ;

            // handle error
            // const {
            //     status,
            //     statusText
            // } = error.response ;
            const status     = error?.response?.status ?? "" ;
            const statusText = error?.response?.statusText ?? "" ;

            // @ts-ignore
            this.dErrorStatus = status ;
            // @ts-ignore
            this.$set(this, "dErrorMessage", statusText);

            if (error?.request?.responseType === "blob") {
                // BlobでRequestした場合はResponseTypeが非同期且つBlobで返ってくるので変換してオブジェクトを$setする
                // @ts-ignore
                error.response.data.text().then(blob => this.$set(this, "dErrorData", JSON.parse(blob)));
            } else if (error?.response?.data !== undefined) {
                // @ts-ignore
                this.$set(this, "dErrorData", error.response.data);
            }

            const endPoint = error.ep ?? ep ;

            // @ts-ignore
            console.error(`Error! HTTP Status: ${status} ${statusText} ${endPoint}`);

            // Timeout/UnAutholizeの場合はLoginに戻す
            if (status === 401) {
                // Error Autholize
                this.logoutAction(true) ;
                // @ts-ignore
                this.$router.push({name :"login"}) ;
                //this.$router.push({name :"login"}) ;
            }

        } ,
        $$clearError : function() {
            // @ts-ignore
            this.dErrorStatus = "" ;
            // @ts-ignore
            this.dErrorMessage = "" ;
        } ,
        $$getValue : function(dataName:string, colName:string) : void
        {
            // @ts-ignore
            if (this[dataName] === undefined) return undefined ;
            // @ts-ignore
            return this[dataName][colName] ;
        } ,
        $$setValue : function(dataName:string, colName:string, val:any) {

            // @ts-ignore
            if (this[dataName] === undefined) return ;
            // @ts-ignore
            this.$set(this[dataName], colName, val) ;
        } ,

        $$getValueModel : function(colName:string) : void
        {
            // @ts-ignore
            if (this.value === undefined) return undefined ;
            // @ts-ignore
            return this.value[colName] ;
        } ,
        $$setValueModel : function(colName:string, val:any) {

            // @ts-ignore
            if (this.value === undefined) return ;
            // @ts-ignore
            this.$set(this.value, colName, val) ;
        } ,

        // Vue-routerで現在のパスかどうかの判定
        $$isCurrentPath : function (regex:RegExp) :boolean
        {
            // @ts-ignore
            let match = regex.exec(this.$route.path) ;
            return match !== null ;
        } ,

        /**
         * 日付文字列(YYYY-MM-DD)を取得
         * @param val
         * @returns
         */
        $$formatDay(val:Date , format:string = "YYYY-MM-DD" ) : Date | undefined | string {
            const res = DayJsEx.format(val , format) ;
            //console.log(res) ;
            return res === undefined ? "" : res;
        } ,

        /**
         * 日付文字列(HH:mm)を取得
         * @param val
         * @returns
         */
         $$formatHm(val:Date , format:string = "HH:mm" ) : Date | undefined | string {
            // 日付が入ってないパターン
            let convVal = val.toString() ;
            if (convVal.toString().indexOf("/") === -1) {
                convVal = "2000-01-01 " + convVal ;
            }

            const res = DayJsEx.format(dayjs(convVal).toDate(), format) ;
            //console.log(res) ;
            return res === undefined ? "" : res;
        } ,

        /**
         * 別タブで物件を開く
         */
         $$openTProjectEditOnOtherTab : function(tProjectId:number) {
            // @ts-ignore
            let resolvedRoute = this.$router.resolve({
                name: 'tProjectEdit',
                params: {id: tProjectId}
            });
            window.open(resolvedRoute.href, '_blank');
        } ,
    },
    created : function()
    {
        // @ts-ignore
        //this.$$emitIsCustomHeader() ;
    }
 }