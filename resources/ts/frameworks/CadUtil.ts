import _ from "lodash";
import { TypePoint } from "../types/TypePoint";

export default {
    /**
     * Radian (Math.PI / 180 )
     */
    RADIAN : Math.PI / 180 ,

    /**
     * 角度取得
     * @param sX
     * @param sY
     * @param eX
     * @param eY
     * @returns
     */
    getAngle(sX:number ,sY:number ,eX:number ,eY:number):number {
        if (sX == eX && sY == eY) return 0 ;
        const angle = Math.atan2(eY - sY, eX - sX) / this.RADIAN ;
        return this.normalizeAngle( angle) ;
    } ,

    /**
     * 角度を0～360以内にする
     * @param angle
     * @returns
     */
    normalizeAngle(angle:number) {
        let rtnAngle = angle ;

        while (rtnAngle < 0) {
            rtnAngle += 360 ;
        }

        while (rtnAngle >= 360) {
            rtnAngle -= 360 ;
        }

        return rtnAngle ;
    } ,

    /**
     * 斜辺の長さと角度から底辺(X)と高さ(Y)を取得
     * @param length
     * @param angle
     * @param cPos
     * @returns
     */
    getObliquePoint(length:number ,angle:number ,cPos:TypePoint = {x:0 ,y:0 }):TypePoint {
        if (_.isNil(cPos)) cPos = {x:0 ,y:0 } ;
        const pos:TypePoint = {x:0 ,y:0 } ;

        pos.x = length * Math.cos(angle * this.RADIAN) + cPos.x ;
        pos.y = length * Math.sin(angle * this.RADIAN) + cPos.y ;

        return pos ;
    } ,

    /**
     * 斜辺の長さを取得
     * @param width
     * @param height
     * @returns
     */
    getObliqueLength( width:number , height:number):number {
        const powedWidth  = Math.pow(width , 2) ;
        const powedHeight = Math.pow(height, 2) ;
        const oblique     = Math.sqrt(powedWidth + powedHeight) ;

        return oblique ;
    }
}
