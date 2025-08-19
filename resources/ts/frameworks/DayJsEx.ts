import dayjs, * as DayJs from "dayjs" ;
import { data } from "jquery";

export default {
    timeToDayjs : function (val:string) : DayJs.Dayjs
    {
        return DayJs("2001-01-01T" + val) ;
    } ,

    // 日付(時間カット)
    getOnlyDay : function (val:Date) : Date | undefined
    {
        if (! val ) return undefined ;
        return DayJs(DayJs(val).format("YYYY-MM-DD")).toDate() ;
    } ,

    // 時刻だけ取得
    getOnlyHm : function(val:Date) : string {
        if (! val ) return "00:00" ;

        let jsVal = DayJs(val) ;
        if ( jsVal.isValid()){
            // console.log("isvalid") ;
        }
        else {
            let convVal = val.toString() ;
            // 時刻のみ対策
            if ( convVal.toString().indexOf("/") === -1 && convVal.toString().indexOf("-") === -1){
                convVal = "2000-01-01 " + convVal ;
            }
            // console.log(convVal ) ;
            jsVal = DayJs(convVal , 'YYYY-MM-DD HH:mm:ss') ;
            if ( !jsVal.isValid()) return "00:00" ;

        }

        return this.format(jsVal.toDate(), "HH:mm") ;
    } ,

    // 日付の書式を返す
    formatDate : function (val:Date) : string
    {
        return this.format(val, "YYYY-MM-DD") ;
    } ,

    // 時刻の書式を返す
    formatTime : function (val:Date) : string
    {
        return this.format(val, "HH:mm:ss") ;
    } ,

    // 日付+時刻の書式を返す
    formatDateTime : function (val:Date|undefined) : string|undefined
    {
        if ( val === undefined) return undefined ;
        return this.format(val, "YYYY-MM-DD HH:mm:ss") ;
    } ,

    // 書式(デフォルト：[YYYY-MM-DD])
    // 糖衣構文[Syntactic sugar]
    format : function (val:Date, format:string = "YYYY-MM-DD") : string
    {
        if (!val) return "" ;
        return DayJs(val).format(format) ;
    } ,

    // 現在時刻を文字列[YYYY-MM-DD HH:mm:ss]にして返す
    nowTostring : function () : string
    {
        // MySQLのDateTime型(UTCを考慮しない)にそのまま入れたい場合に
        return this.formatDateTime(new Date()) ?? "" ;
    } ,

    // 処理日
    today : function () : Date | undefined
    {
        // MySQLのDateTime型(UTCを考慮しない)にそのまま入れたい場合に
        return DayJs().startOf('day').toDate() ;
    } ,

    // 2つの日付を比べる
    compareDate : function(from:Date|undefined,to:Date|undefined) : string|undefined
    {
        if( from === undefined || to === undefined ) return undefined ;

        // 同じ日付の場合（時刻は比較しない）
        if(DayJs(from).isSame(to , "d")) return "same" ;
        // fromがtoより過去
        if(DayJs(from).isBefore(to , "d")) return "before" ;
        // fromがtoより未来
        if(DayJs(from).isAfter(to , "d")) return "after" ;

        return undefined ;
    } ,
}
