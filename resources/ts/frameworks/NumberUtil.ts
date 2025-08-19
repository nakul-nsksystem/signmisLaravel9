export default {
    // 無効な数値を0にする
    invalid2zr : function (val:number|undefined) : number {
        if (val === undefined) return 0 ;
        if (isNaN(val) || ! isFinite(val) || val === null) return 0 ;

        return Number(val) ;
    } ,

    // Nullを0に変換
    nl2zr : function (val:number) : number {
        if (!val) return 0 ;

        return Number(val) ;
    } ,

    // 切り捨て
    trunc : function (val:number, digit:number = 0) : number {
        let v = Math.trunc(val * Math.pow(10, digit)) * Math.pow(10, digit * -1) ;
        v = this.invalid2zr(v) ;

        return Number(v.toFixed(digit)) ;
    } ,

    // 四捨五入
    round : function (val:number, digit:number = 0) : number {
        let v = Math.round(Math.abs(val) * Math.pow(10, digit)) * Math.pow(10, digit * -1) ;
        if (val < 0) v *= -1 ;
        v = this.invalid2zr(v) ;

        return Number(v.toFixed(digit)) ;
    } ,

    // 切り上げ
    ceil : function (val:number, digit:number = 0) : number {
        let v = Math.ceil(val * Math.pow(10, digit)) * Math.pow(10, digit * -1) ;
        v = this.invalid2zr(v) ;

        return Number(v.toFixed(digit)) ;
    } ,

    // 端数処理・丸め処理
    rounding : function (val:number, fraction_type:number, digit:number = 0) : number {
        if (fraction_type == 1070001) {
            // 切り捨て
            val = this.trunc(val, digit) ;
        } else if (fraction_type == 1070002) {
            // 四捨五入
            val = this.round(val, digit) ;
        } else if (fraction_type == 1070003) {
            // 切り上げ
            val = this.ceil(val, digit) ;
        }

        return val ;
    } ,

    // 書式[整数値：左側を0埋め]
    formatZeroPadding : function (val:number, digit:number = 0) : string {
        if (this.getLength(val) > digit) return val.toString() ;

        // 左側の0を揃えたい時(zero padding)
        // [1 → 0001]
        // [12 → 0012]
        // [123 → 0123]
        return (Array(digit).join('0') + val).slice(digit * -1) ;
    } ,

    // 書式[整数値：カンマ区切り+小数点以下：0埋め]
    formatDecimalZeroPadding : function (val:number, digit:number = 2) : string {
        if (!val) val = 0 ;

        // ロケール依存の数値表現で小数点以下を揃えたい時(zero padding)
        // [0 → 0.00]
        // [1234 → 1,234.00]
        // [1234567.899 → 1,234,567.90]...
        return Number(val).toLocaleString(undefined, {minimumFractionDigits: digit, maximumFractionDigits: digit}) ;
    } ,

    // 書式[0除去]
    formatZeroSuppress : function (val:number, isNullToZero:boolean = true) : string {
        if (!val) return isNullToZero? "0" : "" ;

        // ロケール依存の数値表現で小数点以下0を除去(zero suppress)
        // [1,234.560 → 1,234.56]
        return Number(val).toLocaleString(undefined, {maximumFractionDigits: 20}) ;
    } ,

    // 桁数取得[整数用]
    getLength : function (val:number) : number {
        return val.toString().length ;
    } ,

    // 桁数取得[小数点用]
    getDecimalLength : function(val:number) : number {
        const arr = val.toString().split('.') ;
        if (arr.length === 0) return 0 ;

        return arr[1].length ;
    } ,

    //符号取得
    getSign : function(val:number) {
        return Math.sign(this.invalid2zr(val)) ;
    }
}
