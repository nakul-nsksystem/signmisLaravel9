import { ref, computed ,reactive, getCurrentInstance} from "vue";
import _ from 'lodash';
import { useStore } from "../../../stores/mainStore";
import { useMasterStore } from "../../../stores/masterStore";
import DayJsEx from "../../../frameworks/DayJsEx";
import NumberUtil from "../../../frameworks/NumberUtil";
import dayjs, * as DayJs from "dayjs" ;
/**
 * 在庫用composition 
 * @returns 
 */
export function signmisReportComposition() { 

    const store = useStore() ;
    const masterStore = useMasterStore() ;
    const _this = getCurrentInstance()?.proxy ;
    
    const cDateFormat = computed(() => (val:Date) => DayJsEx.format(val) ) ;
    const cToNumber = computed(() => (val:number) => {
        if(_.isNil(val)) return null ;
        return NumberUtil.formatZeroSuppress(val)
    }) ;

    //合計行
    const cSummary = computed(() => (list:any,key:string) => {
        if(_.isEmpty(list)) return 0 ;
        const val = _.sumBy(list , key) ;
        return NumberUtil.formatZeroSuppress(val) ;
    })

    //自社締日取得
    const cGetClosingDate = computed(() => (branchId:number|undefined) => {
        if(_.isNil(branchId)) return 0 ;
        return masterStore.getMBranchById(branchId)?.closing_date ?? 0 ;
    })

    //拠点支払日（日付のみ）取得
    const cGetPaymentDate = computed(() => (branchId:number|undefined) => {
        if(_.isNil(branchId)) return 0 ;
        return masterStore.getMBranchById(branchId)?.ShortPaymentDate ?? 0 ;
    })

    //拠点締日アラート
    const cCloseingDateAlert = computed(() => (date:string) => {
        if(_.isNil(date)) return "" ;
        return "" ;
    })

    //期間超過アラート デフォルト12ヶ月
    const cTermAlert = computed(() => (from:string ,to:string ,term:number = 12) =>  {
        
        if(_.isNil(from) || _.isNil(to)) return "" ;

        const diffMonths = DayJs(to).diff(DayJs(from), 'month');
        if (diffMonths >= term) return `${term}ヶ月以上の差があります`

        return "" ;
    }) ;
    

    //nか月後を取得
    function getCalcedMonth (date:string ,n:number) {
        
        if(_.isEmpty(date)) return "" ;

        if(Math.sign(n) == 0) return "" ;

        if(Math.sign(n) == 1) {
            return DayJs(date).add(n, 'month').subtract(1, 'day').format('YYYY-MM-DD') ;
        }
        else {
            return DayJs(date).subtract(n, 'month').subtract(1, 'day').format('YYYY-MM-DD') ;

        }
    }

    return {
        cToNumber,
        cDateFormat,
        cSummary,
        cGetClosingDate ,
        cGetPaymentDate ,
        cTermAlert ,
        getCalcedMonth ,
    }

}
