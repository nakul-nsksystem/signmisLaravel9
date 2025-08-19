import SvgConst from "../consts/SvgConst";
import NumberUtil from "./NumberUtil";

export default {
    /**
     * 最大フォントサイズを取得
     * @param strLength   描画する文字の長さ
     * @param containerW  描画するコンテナの幅
     * @param containerH  描画するコンテナの高さ
     * @param drawW     　テキストを描画するエリアの幅
     * @param drawH     　テキストを描画するエリアの高さ
     */
    getMaxFontSize4SvgNumberText(
        strLength:number ,
        containerW:number ,
        containerH:number ,
        drawW:number ,
        drawH:number):number {
        // コンテナに対する最大フォントサイズ
        const wFontSize:number = containerW / (SvgConst.C_FONT_W_PER_FONTSIZE * strLength) ;
        const hFontSize:number = containerH / SvgConst.C_FONT_H_PER_FONTSIZE ;
        //console.log(`wFontSize:${wFontSize} hFontSize:${hFontSize}`)

        // 描画領域に対する最大フォントサイズ
        let drawWRatio:number = NumberUtil.invalid2zr(drawW / containerW) ;
        if (drawWRatio == 0) drawWRatio = 1 ;
        let drawHRatio:number = NumberUtil.invalid2zr(drawH / containerH) ;
        if (drawHRatio == 0) drawHRatio = 1 ;
        const wScaledFontSize = wFontSize * drawWRatio ;
        const hScaledFontSize = hFontSize * drawHRatio ;

        //console.log(`wScaledFontSize:${wScaledFontSize} hScaledFontSize:${hScaledFontSize}`)
        return Math.min(wScaledFontSize ,hScaledFontSize) ;
    } ,
}
