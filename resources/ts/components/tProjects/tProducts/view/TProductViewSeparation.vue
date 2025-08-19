<template>
    <div :id="`CardSeparate${index}${value.id}`" v-if="cIsSep">
        <div class="row pb-2">
            <button class="btn btn-link col-12 text-left py-0 mb-2" 
                type="button" 
                data-toggle="collapse" 
                :data-target="`#collapseSeparate${index}${value.id}`"                                             >
                <p class="h6">
                    {{getSepInfo(value)}} 
                </p>
            </button>
            <span class="col-12">重ね代:{{value.sep_overlap_length}}</span>                
        </div>
        <div 
            :id="`collapseSeparate${index}${value.id}`" 
            class="collapse pt-2" 
            :data-parent="`#CardSeparate${index}${value.id}`">

            <div class="row">
                <div class="col-12 col-xl-6" v-if="cWSepPositions.length > 0">                                    
                    <div class="table-responsive">
                        <table                                             
                            class="table table-dark">
                            <thead>
                                <tr>                                            
                                    <th class="text-right ">W分割位置</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="n in cWSepPositions">                                            
                                    <td class="text-right ">{{n}}</td>
                                </tr>
                            </tbody>

                        </table>

                    </div>
                </div>
                <div class="col-12 col-xl-6" v-if="cHSepPositions.length > 0">                                    
                    <div class="table-responsive">
                        <table                                             
                            class="table table-dark">
                            <thead>
                                <tr>                                            
                                    <th class="text-right ">H分割位置</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="n in cHSepPositions">                                            
                                    <td class="text-right ">{{n}}</td>
                                </tr>
                            </tbody>

                        </table>

                    </div>
                </div>
            </div>

            <base-64-svg-view v-model="cSeparateSvg" />
            
        </div>

    </div>

</template>

<script>
import DayJsEx from '../../../../frameworks/DayJsEx';
import NumberUtil from '../../../../frameworks/NumberUtil';
import ObjectUtil from '../../../../frameworks/ObjectUtil';

export default {
    data :  function() {
        return {



        } 
    } , 
    props : {
        /**
         * t_project_productsのレコード
         */
        value : {
            type : Object , 
            
        } , 
        index : {
            type : Number , 
        }
        
    } ,
    computed : {
        

        /**
         * 分割があるかどうか
         */        
        cIsSep : function() {
            //console.log(n) ; 
            if ( ObjectUtil.isNU(this.value?.t_project_product_separates) || 
                this.value?.t_project_product_separates.length < 3 ) return false ; 
            
            return true ; 
        } , 


        cSeparateSvg : function() {
            // base64された板レイアウトのSVGイメージ        
            const colName = "separate_base64_svg" ; 
            return ObjectUtil.nu2ec( this.value[colName] ); 
        } , 
        


        // W方向の分割位置
        cWSepPositions : function() {
            const filterd = this.value.t_project_product_separates.filter(x => x.is_w ) ;  
            return filterd.map(x => x.pos) ; 
        } , 
        // H方向の分割位置
        cHSepPositions : function() {
            const filterd = this.value.t_project_product_separates.filter(x => ! x.is_w ) ;  
            return filterd.map(x => x.pos) ; 
        } , 

        
    } ,
    methods : {

        
        /**
         * 分割の詳細
         * 
         */
        getSep : function(n , isW) {
            const list = n?.t_project_product_separates.filter(x => x.is_w == isW ) ; 
            const pos = list.map(x => x.pos ) ; 

            //console.log(pos) ; 
            return pos; 
        } , 

        /**
         * SplitView用のオブジェクト
         */
        getSepObj : function(n , isW) {
            const numOfSep = (isW ? n.num_of_sep_w :n.num_of_sep_h ) ?? 1 ;
            const sepWay   = (isW ? n.sep_way_w :n.sep_way_h )    ?? 1 ;

            //console.log(n) ; 
            const rtnObj = {
                numOfSep :numOfSep , 
                way : sepWay , 
                positions : isW ? this.getSep(n , true) : this.getSep(n , false) ,
            } ; 
            
            //console.log(rtnObj) ; 
            return rtnObj ;            
        } , 
        
        /**
         * 分割情報
         */
        getSepInfo : function(n) {
            if ( ! this.cIsSep ) return "" ; 
            
            //const wPos = n.t_project_product_separates.filter(x => x.is_w ) ; 
            //const hPos = n.t_project_product_separates.filter(x => ! x.is_w ) ; 
            const wPos = this.getSep(n , true ) ; 
            const hPos = this.getSep(n , false ) ; 
            
            let info = "" ; 
            if ( wPos.length > 0 ) {
                const sepPosInfoW = this.getSepPosInfo(n.sep_way_w , wPos) ; 
                info += `W : ${sepPosInfoW}`  ; 
            }

            if ( hPos.length > 0 ) {
                const sepPosInfoH = this.getSepPosInfo(n.sep_way_h , hPos) ; 
                
                info += (info.length === 0 ? "" : "  " ) + `H : ${sepPosInfoH}`  ; 
                //console.log(info) ; 
            }

            if ( info.length > 0 ) info = `分割 : ${info}` ;

            return info ; 

        } , 

        /**
         * 位置のリスト取得
         */
        getSepPosInfo : function(sepWay , list ) {
            let sepWayStr = "" ; 
            switch ( sepWay){
                case 1 : // 均等割り
                    sepWayStr = "均等割り" ; 
                    break ; 

                case 2 : // 指定
                    sepWayStr = "指定" ; 
                    break ; 

            }

            let posStr = "" ; 
            /*
            if ( sepWay === 2) {
                // 指定の場合のみ                    
                posStr += " ( " ; 
                for ( const pos of list) {
                    posStr +=  pos + " , ";  
                }
                posStr = posStr.substring(0 ,posStr.length - 2 ) + " )";

            }
            */

            return `${sepWayStr} ${posStr}`  ; 
        } , 

        
    }

}
</script>