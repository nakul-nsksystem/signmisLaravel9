import Vue from "vue"
import TProductProcessMixins from "./TProductProcessMixins";
import { BoardLayoutTypes } from "../../components/tProjects/class/boardLayouts/BoardLayout";

export default Vue.extend ({
    mixins : [TProductProcessMixins] ,
    data : function(){
        return {
            // 手動レイアウトモード
            b$dLayoutModeManual : BoardLayoutTypes.Manual ,
            // マスタ参照手動レイアウトモード
            b$dLayoutModeRefMasterManual : BoardLayoutTypes.RefMasterManual ,
            // マスタ参照自動レイアウトモード
            b$dLayoutModeRefMasterAuto: BoardLayoutTypes.RefMasterAuto ,
        }
    },
    props : {} ,
    watch : {} ,
    computed : {} ,
    methods: {},
    created : function() {} ,
});