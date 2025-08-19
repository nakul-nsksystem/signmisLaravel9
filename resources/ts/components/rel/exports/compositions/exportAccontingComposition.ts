import { ref, computed ,reactive } from "vue";
import { useStore } from "../../../../stores/mainStore";
import DayJsEx from "../../../../frameworks/DayJsEx";
import NumberUtil from "../../../../frameworks/NumberUtil";
import { useMasterStore } from "../../../../stores/masterStore";
import axios from "axios";
/**
 *  
 * @returns 
 */
export function exportAccontingComposition() { 

    const store = useStore() ;
    const masterStore = useMasterStore() ;
    const cDateFormat = computed(() => (val:Date) => DayJsEx.format(val) ) ;
    const cToNumber = computed(() => (val:number) => NumberUtil.formatZeroSuppress(val)) ;

    const state = reactive({
        isEbleToInputCustomer : false ,           // 取引先の入力可否判定用(true:入力可能 false:入力不可)
    })

    const cBranchInfoMessage = computed(() => (mBranchId:number) => {
        let message = "" ;
        if (mBranchId == 0) return "" ;
        if (mBranchId != store.loginMUser?.m_branch_id ?? 0 ) {
            message = "ログイン担当者と拠点が異なります" ;
        }
        return message ;
    }) ;

    const cMBranchName = computed(() => (id:number) => {
        const mBranch = masterStore.getMBranchById(id) ;
        return mBranch?.short_name ?? "" ;
    })
    


    return {
        state,
        cToNumber,
        cDateFormat,
        cBranchInfoMessage ,
        cMBranchName,
    }

}
