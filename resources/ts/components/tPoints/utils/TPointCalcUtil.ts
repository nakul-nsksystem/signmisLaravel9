import MKvsConst from "../../../consts/MKvsConst";
import NumberUtil from "../../../frameworks/NumberUtil";
import { useMasterStore } from "../../../stores/masterStore"

export default {
    
    getFractionKvIdBySmOption : function() {
        const masterStore = useMasterStore() ;
        const v = masterStore.getSMOptionValByKeyMKvId(8010501) ;
        return Number(v) ;
    } ,

    calcFraction : function(v?:number) {

        if(!v) return 0 ;

        const fractionMKvId = this.getFractionKvIdBySmOption() ;
        
        //切上げ
        if(fractionMKvId == MKvsConst.MCustomers.FRACTION_M_KV_ID_ROUND_UP) {
            return NumberUtil.ceil(v) ;
        }
        //切捨て
        else if(fractionMKvId == MKvsConst.MCustomers.FRACTION_M_KV_ID_ROUND_DOWN) {
            return NumberUtil.trunc(v) ;
        }
        //切捨て
        else if(fractionMKvId == MKvsConst.MCustomers.FRACTION_M_KV_ID_ROUND_OFF) {
            return NumberUtil.round(v) ;
        }
        //未計算
        else {
            return v ;
        }
        
        
    }
}