import Vue from "vue"
import _ from "lodash"
import DayJsEx from "../../../frameworks/DayJsEx";
import NumberUtil from "../../../frameworks/NumberUtil"
import StringUtil from "../../../frameworks/StringUtil";
import dayjs from "dayjs";

export default Vue.extend ({
    data : function(){
        return {
        }
    },    
    computed : {
        /**画面描画用 */
        m$cIsEmpty : function() {
            return function(val:any) {
                return _.isNil(val) ;
            }
        } ,
        
        /**画面金額描画用 */
        m$cPriceFormat : function() {
            return function(val:string) {
                const integerValue = parseInt(val);
                return integerValue.toLocaleString() + "円";
            }
        } ,


        /**画面描画用日付 */
        m$cDateFormat : function(){
            return function(val:Date) {
                //@ts-ignore
                if(this.m$cIsEmpty(val)) return "" ;
                return DayJsEx.format(val , "YYYY-MM-DD") ;
            }
        } ,


        /**金額合計計算 */
        m$cPriceTotal : function(){
            return function(n:any){
                n.total_price = n.price*n.qty ;
                //@ts-ignore
                return this.m$cPriceFormat(n.total_price)   
            }
        },

        /**
         * 金額の表示フラグ
         */
        m$cIsViewPrice : function() {
            //@ts-ignore
            const val = NumberUtil.invalid2zr(this.mainStore.getRole("t_p_order-price-view-privilege")) ; 
            return val >= 10 ; 

        } ,  

        /**文字数制限 
         * @param limit 半角文字数
        */
        m$cIsOkStrLen : function() {
            return function(str:string ,limit:number) {
                let length = StringUtil.getByteLengthOfShiftJIS(str) ;
                return length <= limit ;
            }
        } ,
   
    },
    methods : {
        //読み込み中の画面ロック
        m$screenLock : function(){
            let element = document.createElement('div');
            element.id = "screenLock";
            
            element.style.height = '100%';
            element.style.left = '0px';
            element.style.position = 'fixed';
            element.style.top = '0px';
            element.style.width = '100%';
            element.style.zIndex = '9999';
            element.style.opacity = '0';
            
            let objBody = document.getElementsByTagName("body").item(0);
            //@ts-ignore
            objBody.appendChild(element);
        },

        //読み込み終了後の画面解放
        m$screenUnLock : function (){
            let screenLock = document.getElementById("screenLock");
            //@ts-ignore
            screenLock.parentNode.removeChild(screenLock);
        } ,

        //メール送信時のアドレス不適エラーの警告文を出す
        m$showWarnings : function(tPOrder:any) {            
            if(tPOrder.warnings.length > 0) {
                alert(tPOrder.warnings[0]) ;
            }
        } ,
        
        //保存処理前にデータの整合性チェック
        m$checkData : function(tPOrder:any) {

            for(const tpod of tPOrder.t_p_order_details) {
                
                if( tpod.total_price == 0 ) tpod.total_price = tpod.price * tpod.qty ;
                //@ts-ignore
                if( _.isNil(tpod.created_m_user_id) ) tpod.created_m_user_id = this.$$cLoginUserId ;
                //@ts-ignore
                tpod.updated_m_user_id = this.$$cLoginUserId ;
            }
        } ,

        //n日加算
        m$addDay : function(day:Date,n:number) {
            return dayjs(day).add(n,'d').format('YYYY-MM-DD') ;
        }

    } ,
    created : function() 
    {
    }
 });