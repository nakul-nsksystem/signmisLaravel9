export default {
    /**
     * 文字列判定
     * @param arg 文字列
     * @returns boolean true:文字列 false:文字列ではない
     */
     isString : function (arg: any): arg is string {
        return typeof arg === "string" ;
    } ,

    /**
     * ShiftJISのバイト数を取得
     * @param s 文字列
     * @returns ByteLength ShiftJISのバイト数
     */
    getByteLengthOfShiftJIS : function (s: string) {
        // Nullチェック
        if (!s) return 0 ;

        // Shift-JIS系のDB連携[Oracle・販売管理システム]が発生したので実装
        // utf系[utf-8/16/32]では全角文字は2バイト～4バイトとして扱われる
        // 半角カナも1バイトとして扱われない
        var len = 0 ;
        for (var i = 0; i < s.length; i++) {
            var c = s.charCodeAt(i) ;
            // Shift_JIS: 0x0 ～ 0x80, 0xa0  , 0xa1   ～ 0xdf  , 0xfd   ～ 0xff
            // Unicode  : 0x0 ～ 0x80, 0xf8f0, 0xff61 ～ 0xff9f, 0xf8f1 ～ 0xf8f3
            if ((c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c <= 0xff9f) || (c >= 0xf8f1 && c <= 0xf8f3)) {
                // 半角記号・英数字・半角カナはShift-JISでは1バイトとして扱う
                len += 1 ;
            } else {
                // 上記以外の全角文字はShift-JISでは2バイトとして扱う
                len += 2 ;
            }
        }

        return len ;
    }

}
