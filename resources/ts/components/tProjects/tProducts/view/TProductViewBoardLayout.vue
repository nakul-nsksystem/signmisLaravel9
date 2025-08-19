<template>
    <div :id="`CardBoardLayout${index}${value.id}`" v-if="cIsBoardLayout">
        <div class="row">
                <button class="btn btn-link col-12 text-left" 
                style="box-shadow:none;"
                type="button" 
                data-toggle="collapse" 
                :data-target="`#collapseBoardLayout${index}${value.id}`">
                <p class="h6 pb-2">
                    板割り
                </p>                                        
            </button>                
        </div>
        <div 
            :id="`collapseBoardLayout${index}${value.id}`" 
            class="collapse" 
            :data-parent="`#CardBoardLayout${index}${value.id}`">
            

            <div class="row" >            
                <div class="col-12">
                    <div class="table-responsive">
                        <table class="table table-dark ">
                            <thead>
                                <tr>                                            
                                    <th style="width:15%;min-width:110px;">規格寸法</th>
                                    <th style="width:15%;min-width:110px;">使用寸法</th>
                                    <th class="text-right " style="width:10%;min-width:60px;">枚数</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="n in cBoardLayouts">
                                    <td>
                                        {{getIsBoardLayoutManual(n)
                                            ? "" 
                                            : n.m_material_detail.width + " x " + n.m_material_detail.height}}
                                    </td>
                                    <td>
                                        {{n.w}} x {{n.h}}
                                    </td>
                                    <td class="text-right ">
                                        {{n.qty}}
                                    </td>
                                    
                                </tr>
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>

            <base-64-svg-view v-model="cBoardLayoutSvg" />

            
            
        </div>

    </div>
</template>

<script>
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
         * 板割りの明細
         */
        cBoardLayouts : function() {
            if ( ObjectUtil.isNU(this.value?.t_project_product_boardlayouts )) return [] ; 

            return this.value.t_project_product_boardlayouts ; 
        } , 

        // base64された板レイアウトのSVGイメージ        
        cBoardLayoutSvg : function(row) {
            const colName = "board_layout_base64_svg" ; 
            return ObjectUtil.nu2ec( this.value[colName] ); 
        } , 

        /**
         * 板レイアウトがあるかどうか
         */        
        cIsBoardLayout : function() {
            
            if ( ObjectUtil.isNU(this.value?.t_project_product_boardlayouts) || 
                this.value.t_project_product_boardlayouts.length === 0 ) return false ; 

            return true ; 
        } , 

    } ,
    methods : {

        



        /**
         * 板レイアウトが手動かどうか
         */
        getIsBoardLayoutManual : function(n) {
            return ObjectUtil.isNU(n.m_material_detail ) ; 
        } , 
        

        
    }

}
</script>