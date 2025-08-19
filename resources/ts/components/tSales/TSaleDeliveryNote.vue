<template>
    <div class="row bg-light" v-if="cIsShow">
        <!-- 印刷1枚目 -->
        <section class="sheet">
            <div class="row">
                <!-- 2枚目の最初にbutton系を置くとFirefoxで正しく表示できないので回避でダミー[label]を置く -->
                <label />
            </div>

            <div class="row p-1">
                <div class="col">
                    <label class="text-dark">納品書1枚目</label>
                </div>

                <div class="col">
                    <div class="float-right">
                        <button type="submit" class="btn no-print btn-secondary" @click.prevent="print()">印刷</button>
                        <button type="submit" class="btn btn-secondary" @click.prevent="close()">閉じる</button>
                    </div>
                </div>
            </div>

            <div class="border-top">
                <div class="row">
                    <div class="form-group" />
                </div>

                <div class="row mx-1">
                    <div class="col-3">
                        <div class="form-group">
                            <label class="text-dark">売上No.：{{ this.dRow.id }}</label>
                        </div>
                    </div>

                    <div class="col-3">
                        <div class="form-group">
                            <label class="text-dark">更新者：{{ cDisplayUpdatedMUserName }}</label>
                        </div>
                    </div>

                    <div class="col-3">
                        <div class="form-group">
                            <label class="text-dark">合計金額：{{ cTotalPrice }}</label>
                        </div>
                    </div>
                </div>

                <div class="row mx-1">
                    <div class="col-3">
                        <div class="form-group">
                            <label class="text-dark">売上日</label>
                            <ex-v-date-picker v-model="dRow.accounting_date" />
                        </div>
                    </div>

                    <div class="col-3">
                        <div class="form-group">
                            <label class="text-dark">拠点</label>
                            <m-branch-select 
                                v-model="dRow.m_branch_id"
                            />
                        </div>
                    </div>

                    <div class="col">
                        <div class="form-group">
                            <label class="text-dark">取引先</label>
                            <m-customer-ref-input 
                                v-model="dRow.m_customer_id"
                                :m-branch-id="dRow.m_branch_id"
                                :dealing-cds="[1]"
                            />
                        </div>
                    </div>
                </div>

                <div class="row mx-1">
                    <div class="col-3">
                        <div class="form-group">
                            <label class="text-dark">納品書</label>
                            <m-kv-select
                                v-model="dRow.delivery_note_m_kv_id"
                                :kv-key="'sales_management-delivery_note'"
                            />
                        </div>
                    </div>

                    <div class="col-3">
                        <div class="form-group">
                            <label class="text-dark">担当者</label>
                            <m-user-select
                                :m-branch-id="dRow.m_branch_id"
                                v-model="dRow.m_user_id"
                            />
                        </div>
                    </div>

                    <div class="col">
                        <div class="form-group">
                            <label class="text-dark">納品先</label>
                            <m-customer-ref-input 
                                v-model="dRow.delivery_destination_m_customer_id"
                                :m-branch-id="dRow.m_branch_id"
                                :dealing-cds="[1,8]"
                            />
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="form-group" />
                </div>
            </div>

            <div class="border-top">
                <table class="table table-striped">
                    <thead>
                        <tr class="text-nowrap">
                            <th scope="col">No.</th>
                            <th scope="col">物件名・品名</th>
                            <th scope="col">注文No.</th>
                            <th scope="col">物件コード</th>
                            <th scope="col">数量</th>
                            <th scope="col">単価</th>
                            <th scope="col">金額</th>
                            <th scope="col">備考</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(n, index) in cDetails" :key="n.id">
                            <td>{{ index + 1 }}</td>
                            <td>{{ n.product_name }}</td>
                            <td>{{ n.customer_order_no }}</td>
                            <td>{{ cDisplayProjectCd(n.t_project) }}</td>
                            <td>{{ cToNumber(n.qty) }}</td>
                            <td>{{ cToNumber(n.price) }}</td>
                            <td>{{ cToNumber(n.total_price) }}</td>
                            <td>{{ n.slip_memo }}</td> 
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- 印刷2枚目 -->
        <section class="sheet">
            <div class="row">
                <!-- 2枚目の最初にbutton系を置くとFirefoxで正しく表示できないので回避でダミー[label]を置く -->
                <label />
            </div>
            
            <div class="row p-1">
                <div class="col">
                    <label class="text-dark">納品書2枚目</label>
                </div>

                <div class="col">
                    <div class="float-right">
                        <button type="submit" class="btn no-print btn-secondary" @click.prevent="print()">印刷</button>
                        <button type="submit" class="btn btn-secondary" @click.prevent="close()">閉じる</button>
                    </div>
                </div>
            </div>

            <div class="border-top">
                <div class="row">
                    <div class="form-group" />
                </div>

                <div class="row mx-1">
                    <div class="col-3">
                        <div class="form-group">
                            <label class="text-dark">売上No2.：{{ this.dRow.id }}</label>
                        </div>
                    </div>

                    <div class="col-3">
                        <div class="form-group">
                            <label class="text-dark">更新者：{{ cDisplayUpdatedMUserName }}</label>
                        </div>
                    </div>

                    <div class="col-3">
                        <div class="form-group">
                            <label class="text-dark">合計金額：{{ cTotalPrice }}</label>
                        </div>
                    </div>
                </div>

                <div class="row mx-1">
                    <div class="col-3">
                        <div class="form-group">
                            <label class="text-dark">売上日</label>
                            <ex-v-date-picker v-model="dRow.accounting_date" />
                        </div>
                    </div>

                    <div class="col-3">
                        <div class="form-group">
                            <label class="text-dark">拠点</label>
                            <m-branch-select 
                                v-model="dRow.m_branch_id"
                            />
                        </div>
                    </div>

                    <div class="col">
                        <div class="form-group">
                            <label class="text-dark">取引先</label>
                            <m-customer-ref-input 
                                v-model="dRow.m_customer_id"
                                :m-branch-id="dRow.m_branch_id"
                                :dealing-cds="[1]"
                            />
                        </div>
                    </div>
                </div>

                <div class="row mx-1">
                    <div class="col-3">
                        <div class="form-group">
                            <label class="text-dark">納品書</label>
                            <m-kv-select
                                v-model="dRow.delivery_note_m_kv_id"
                                :kv-key="'sales_management-delivery_note'"
                            />
                        </div>
                    </div>

                    <div class="col-3">
                        <div class="form-group">
                            <label class="text-dark">担当者</label>
                            <m-user-select
                                :m-branch-id="dRow.m_branch_id"
                                v-model="dRow.m_user_id"
                            />
                        </div>
                    </div>

                    <div class="col">
                        <div class="form-group">
                            <label class="text-dark">納品先</label>
                            <m-customer-ref-input 
                                v-model="dRow.delivery_destination_m_customer_id"
                                :m-branch-id="dRow.m_branch_id"
                                :dealing-cds="[1,8]"
                            />
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="form-group" />
                </div>
            </div>

            <div class="border-top">
                <table class="table table-striped">
                    <thead>
                        <tr class="text-nowrap">
                            <th scope="col">No.</th>
                            <th scope="col">物件名・品名</th>
                            <th scope="col">注文No.</th>
                            <th scope="col">物件コード</th>
                            <th scope="col">数量</th>
                            <th scope="col">単価</th>
                            <th scope="col">金額</th>
                            <th scope="col">備考</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(n, index) in cDetails" :key="n.id">
                            <td>{{ index + 1 }}</td>
                            <td>{{ n.product_name }}</td>
                            <td>{{ n.customer_order_no }}</td>
                            <td>{{ cDisplayProjectCd(n.t_project) }}</td>
                            <td>{{ cToNumber(n.qty) }}</td>
                            <td>{{ cToNumber(n.price) }}</td>
                            <td>{{ cToNumber(n.total_price) }}</td>
                            <td>{{ n.slip_memo }}</td> 
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </div>
</template>

<script>
import DayJsEx from "@frameworks/DayJsEx" ;
import NumberUtil from "@frameworks/NumberUtil" ;
import PageMixins from '@mixins/commons/PageMixins' ;

export default {
    mixins : [PageMixins] , 
    data : function () {
        return {
            dApiName : "tSale",
            dRow : {
                id : 0,             // 新規:0 新規登録後は1以降になる
            } ,
        }
    } ,
    computed : {
        cEndpoint : function () {
            return `api/${this.dApiName}/${this.$route.params.id}` ;
        } ,
        cIsShow : function () {
            return this.dRow.id > 0 ;
        } ,
        cDetails : function () {
            // 明細データ
            return this.dRow.t_sale_details ;
        } ,
        cToNumber : function () {
            return function (val) {
                return NumberUtil.formatZeroSuppress(val) ;
            } ;
        } ,
        cDisplayProjectCd : function () {
            return function (node) {
                return node?.cd ;
            } ;
        } ,
        cDisplayUpdatedMUserName : function() {
            // 最終更新者
            return this.dRow?.updated_m_user?.full_name ; 
        } ,
        cDisplayUpdatedAt : function() {
            // 最終更新日時
            return DayJsEx.formatDateTime(this.dRow.updated_at) ;  
        } ,
        cTotalPrice : function() {
            // 明細の合計金額
            const total = this.dRow.t_sale_details.reduce(function(sum, item) { return sum + item.total_price ; }, 0) ;

            return this.cToNumber(total) ;
        } ,
        cIsPrintPreView : function() {
            return this.$route.meta?.isPrintPreView == true ; 
        } ,
    } ,    
    methods : {
        getData : async function () {
            try {
                const res = await axios.get(this.cEndpoint) ;
                this.dRow = res.data ;
            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.cEndpoint) ;
            }
        } ,
        close : function () {
            // 閉じる
            window.close() ;
        } ,
        print : function () {
            // 印刷プレビュー画面を開く
            window.print();
        } ,
    } ,
    created : function () {
        this.getData() ;
    } ,
    mounted : function () {
        this.$nextTick(function () {
            // ビュー全体がレンダリングされた後にのみ実行
            setTimeout(() => {
                // 更に1秒待った状態で印刷プレビューして閉じる
                window.print() ;
                window.close() ;
            } , 1000 ) ;
        }) ;
    } ,
}
</script>

<style scoped>
    body {
        /* 改ページ時に帯の部分でbody要素がdarkmodeだとグレー色が印字されるので白に変更(白だと印字されない) */
        background: white;
    }

    .sheet {
        /* ページレイアウト[<section class="sheet">]を1ページとする */
        overflow: hidden;               /* 内容がボックスに収まらない場合収まらない部分は非表示となる 内容が収まらない場合にもスクロールバーなどは表示されない */
        position: relative;             /* 移動するときの基準が元いた位置から */
        box-sizing: border-box;         /* 要素の幅widthと高さheightの中にpaddingとborderを含めるかどうか border-box:paddingとborderを幅と高さに含める */
        page-break-after: always;       /* always:要素の後で必ず改ページが行われるように強制します */

        /* 用紙サイズ A4 */
        height: 296.9mm;                /* ブラウザの環境差異を考慮して高さに0.1mm余裕をもたせる */
        width: 210mm;

        /* 余白サイズ [上下 10mm][左右 指定なし] */
        padding: 10mm 10mm ;
        background: white;
    }

    .sheet:last-child {
        /* 最後の改ページを防ぐ */
        page-break-after: avoid;        /* avoid:要素の後で改ページされないようにします */
    }

    @media print {
        .no-print {
            /* 印字しない項目は[class="no-print"]を指定 */
            display: none;          
        }
    }

    @media screen {
        .sheet {
            /* ドロップシャドウ */
            box-shadow: 0 0.5mm 2mm rgba(0, 0, 0, 0.3);
            margin: 5mm auto;
        }
    }
</style>