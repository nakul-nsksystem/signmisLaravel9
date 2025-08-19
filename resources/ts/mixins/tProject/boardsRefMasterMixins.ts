import Vue from "vue"
import NumberUtil from "../../frameworks/NumberUtil" ;

export default Vue.extend ({
    data : function(){
        return {
            dList : [] ,

        }
    },
    props : {
        params : {
            type : Object ,
        } ,
        // サイズのリスト
        detailList : {
            type : Array ,
            default : () => [] ,
        } ,
        /**
         * 板材 端材扱い境界 % (指定 %以下の場合は1枚分)
         */
        wasteCostPer : {
            type : Number ,
            default : () => 0 ,
        } ,
        /**
         * カットコスト
         */
        costPerCut : {
            type : Number ,
            default : () => 0 ,
        }
    } ,
    watch : {

    } ,
    computed : {

    } ,
    methods: {

        /**
         * 資材詳細取得
         */
         m$getSelectedMMaterialDetail : function(id:number) {
            if (id === undefined) return undefined ;
            if (this.detailList === undefined) return undefined ;

            // @ts-ignore
            const finded = this.detailList.find(x => x.id == id) ;
            return finded ;
        } ,

        /**
         * 合計枚数を取得
         * @param list
         * @returns
         */
        m$getTotalQty : function(list:Array<any>):number {
            const val = list.reduce(
                (accu:number, curr:any) => accu + NumberUtil.invalid2zr(curr.qty), 0) ;

            return val ;
        } ,
        /**
         * 合計材料費を取得
         * @param list
         * @returns
         */
         m$getTotalMaterialCost : function(list:Array<any>):number{
            const val = list.reduce(
                (accu:number, curr:any) => accu + curr.gTotalMaterialCost, 0) ;

            return val ;
        } ,
        /**
         * 合計カット数
         */
         m$getTotalNumOfCut : function(list:Array<any>):number {
            if (list === undefined) return 0 ;

            const val = list.reduce(
                function (accu:number, curr:any) {
                    //console.log(curr) ;
                    //const numOfCut = curr.numOfCut === undefined ? curr.gNumOfCut : curr.numOfCut ;
                    //console.log("numOfCut:" + numOfCut + " accu " + accu) ;
                    return accu += curr.gNumOfCut * NumberUtil.invalid2zr(curr.qty) ;

                }, 0) ;

            //console.log("val " + val) ;
            return val ;
        } ,
        /**
         * 合計カットコスト
         */
         m$getTotalCutCost : function(list:Array<any>):number {
            if (list === undefined) return 0 ;

            const val = list.reduce(
                function (accu:number, curr:any) {
                    return accu += NumberUtil.invalid2zr(curr.gTotalCutCost) ;

                }, 0) ;

            return val ;
        } ,

        /**
         * メソッドの付与
         */
         m$attacheMethods : function(row:any) {
            const _this = this ;

            // 材料単価
            const gMaterialCostPName = "gMaterialCost" ;
            if (!(gMaterialCostPName in row)) {
                Object.defineProperty(row, gMaterialCostPName, {
                    get: function() {
                        if (! this.gIsValidSize || NumberUtil.invalid2zr(this.qty) === 0) return 0 ;

                        // 一定以下の余りであれば1枚分
                        let lossPer = 1 - this.gUsePer ;
                        let per = _this.wasteCostPer >= lossPer ? 1 : this.gUsePer ;

                        return NumberUtil.ceil((this.gSelectedMMaterialDetailPrice * per), 0) ;
                    }
                });
            }

            // 金額
            const gTotalMaterialCostPName = "gTotalMaterialCost" ;
            if (!(gTotalMaterialCostPName in row)) {
                Object.defineProperty(row, gTotalMaterialCostPName, {
                    get: function() {
                        return NumberUtil.ceil(this.qty * this.gMaterialCost, 0) ;
                    }
                });
            }

            // カットコスト
            const gTotalCutCostPName = "gTotalCutCost" ;
            if (!(gTotalCutCostPName in row)) {
                Object.defineProperty(row, 'gTotalCutCost', {
                    get: function() {
                        const totalNumOfCut = NumberUtil.invalid2zr( this.gNumOfCut * this.qty) ;
                        //console.log("gNumOfCut " + this.gNumOfCut +" qty " + this.qty + " costPerCut " + _this.costPerCut) ;
                        return NumberUtil.invalid2zr( totalNumOfCut * _this.costPerCut) ;

                    }
                });
            }

            // 材料単価
            const gTotalCostPName = "gTotalCost" ;
            if (!(gTotalCostPName in row)) {
                Object.defineProperty(row, gTotalCostPName, {
                    get: function() {
                        return this.gTotalCutCost + this.gTotalMaterialCost ;
                    }
                });
            }

            // 選択中の規格サイズ
            const gSelectedMMaterialDetailSizePName = "gSelectedMMaterialDetailSize" ;
            if (!(gSelectedMMaterialDetailSizePName in row)) {
                Object.defineProperty(row, gSelectedMMaterialDetailSizePName, {
                    get: function() {
                        const finded:any = _this.m$getSelectedMMaterialDetail(this.m_material_detail_id) ;
                        if (finded === undefined) return "" ;

                        return finded.width + " x " + finded.height ;
                    }
                });
            }

            // 選択中の規格Sqm
            const gSelectedMMaterialDetailSqmPName = "gSelectedMMaterialDetailSqm" ;
            if (!(gSelectedMMaterialDetailSqmPName in row)) {
                Object.defineProperty(row, gSelectedMMaterialDetailSqmPName, {
                    get: function() {
                        const finded:any = _this.m$getSelectedMMaterialDetail(this.m_material_detail_id) ;
                        if (finded === undefined) return "" ;

                        return NumberUtil.ceil(finded.width * finded.height * 0.001 * 0.001, 3) ;
                    }
                });
            }

            // 選択中の規格単価/枚
            const gSelectedMMaterialDetailPricePName = "gSelectedMMaterialDetailPrice" ;
            if (!(gSelectedMMaterialDetailPricePName in row)) {
                Object.defineProperty(row, gSelectedMMaterialDetailPricePName, {
                    get: function() {
                        const finded:any = _this.m$getSelectedMMaterialDetail(this.m_material_detail_id) ;
                        if (finded === undefined) return "" ;

                        return NumberUtil.invalid2zr(finded.cost_price) ;
                    }
                });
            }

            // 有効サイズ判定
            const gIsValidSizePName = "gIsValidSize" ;
            if (!(gIsValidSizePName in row)) {
                Object.defineProperty(row, gIsValidSizePName, {
                    get: function() {
                        if (NumberUtil.invalid2zr(this.w) === 0 ||
                        NumberUtil.invalid2zr( this.h) === 0) return false  ;

                        const finded:any = _this.m$getSelectedMMaterialDetail(this.m_material_detail_id) ;
                        if (finded === undefined) return false  ;

                        const orgMinLen = Math.min(finded.width, finded.height) ;
                        const orgMaxLen = Math.max(finded.width, finded.height) ;
                        const useMinLen = Math.min(this.w, this.h) ;
                        const useMaxLen = Math.max(this.w, this.h) ;

                        if (orgMinLen < useMinLen) return false ;
                        if (orgMaxLen < useMaxLen) return false ;

                        return true ;
                    }
                });
            }

            // 金額を取る寸法
            const gValidSizePName = "gValidSize" ;
            if (!(gValidSizePName in row)) {

                Object.defineProperty(row, gValidSizePName, {
                    get: function() {
                        const val = {w:0, h:0} ;
                        const finded:any = _this.m$getSelectedMMaterialDetail(this.m_material_detail_id) ;
                        if (finded === undefined) return val ;

                        // 入らない
                        if (!this.gIsValidSize) return val ;

                        const orgMinLen = Math.min(finded.width, finded.height) ;
                        const orgMaxLen = Math.max(finded.width, finded.height) ;
                        const useMinLen = Math.min(this.w, this.h) ;
                        const useMaxLen = Math.max(this.w, this.h) ;

                        //console.log(`orgLen ${orgMinLen} x ${orgMaxLen}  use ${useMinLen} x ${useMaxLen}`) ;
                        if (orgMinLen >= useMaxLen) {
                            // 指定寸法の長辺が指定規格の短辺に入る
                            val.w = orgMinLen ;
                            val.h = useMinLen ;
                        } else {
                            // シート短辺側を全部取る場合
                            const sqmForShorter = orgMinLen * useMaxLen ;
                            const sqmForLonger  = useMinLen * orgMaxLen ;

                            //  console.log(`1 ${orgMinLen} * ${useMaxLen} = ${sqmForShorter}`) ;
                            //  console.log(`2 ${useMinLen} * ${orgMaxLen} = ${sqmForLonger}`) ;

                            if (sqmForShorter < sqmForLonger) {
                                val.w = orgMinLen ;
                                val.h = useMaxLen ;
                            } else {
                                val.w = useMinLen ;
                                val.h = orgMaxLen ;
                            }
                        }

                        return val ;
                    }
                });
            }

            // 金額をとるSqm
            const gValidSqmPName = "gValidSqm" ;
            if (!(gValidSqmPName in row)) {
                Object.defineProperty(row, gValidSqmPName, {
                    get: function() {
                        const sqm = NumberUtil.invalid2zr(this.gValidSize.w * this.gValidSize.h * 0.001 * 0.001) ;
                        return NumberUtil.ceil(sqm, 3) ;
                    }
                });
            }

            // 規格サイズに対しての使用率
            const gUsePerPName = "gUsePer" ;
            if (!(gUsePerPName in row)) {
                Object.defineProperty(row, gUsePerPName, {
                    get: function() {
                        const val = NumberUtil.invalid2zr(this.gValidSqm / this.gSelectedMMaterialDetailSqm) ;
                        return val ;
                    }
                });
            }

            // カット数
            const gNumOfCutPName = "gNumOfCut" ;
            if (!(gNumOfCutPName in row)) {
                Object.defineProperty(row, gNumOfCutPName, {
                    get: function() {
                        if (this.m_material_detail_id === undefined) return 0 ;
                        if (this.qty === 0) return 0 ;
                        if (this.numOfCut !== undefined) return this.numOfCut ;

                        const org:any = _this.m$getSelectedMMaterialDetail(this.m_material_detail_id) ;
                        if (org === undefined) return 0 ;

                        const matMinLen  = Math.min(org.width, org.height) ;
                        const matMaxLen  = Math.max(org.width, org.height) ;
                        const specMinLen = Math.min(this.w, this.h) ;
                        const specMaxLen = Math.max(this.w, this.h) ;

                        if (matMinLen == specMinLen && matMaxLen == specMaxLen) return 0 ;

                        if (matMinLen == specMinLen || matMinLen == specMaxLen ||
                            matMaxLen == specMinLen || matMaxLen == specMaxLen) return 1 ;

                        return 2 ;
                    }
                });
            }
        } ,
    },
    created : function() {
    }
});