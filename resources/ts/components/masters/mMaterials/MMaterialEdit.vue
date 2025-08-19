<template>
    <validation-observer v-slot="{ invalid }">
        <div class="row">
            <div class="col">
                <div v-if="$$cIsError" class="alert alert-danger" role="alert">
                    {{ dErrorData.message }}
                </div>

                <div v-if="dIsSaveSuccess" class="alert alert-success" role="alert">
                    保存に成功しました
                </div>
            </div>
        </div>

        <div class="row" v-if="cIsShow">
            <div class="col-md-3">
                <div class="form-group">
                    <label for="cd">コード</label>
                    <input class="form-control" id="cd" v-model="dRow.cd" placeholder="省略時はコード附番">
                </div>

                <validation-provider name="名称" rules="required" immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label for="name">名称</label>
                        <input class="form-control" id="name" v-model="dRow.name">
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>

                <div class="form-group">
                    <label for="display_name">通称</label>
                    <input class="form-control" id="display_name" v-model="dRow.display_name">
                </div>

                <div class="form-group">
                    <label for="thickness">厚み</label>
                    <ns-number-input 
                        id="thickness" 
                        v-model="dRow.thickness"
                        min="0"
                    />
                </div>

                <div class="form-group">
                    <label for="weight">重量 s/㎡</label>
                    <ns-number-input
                        id="weight" 
                        v-model="dRow.weight"
                        min="0"
                    />
                </div>

                <validation-provider name="カテゴリ" rules="required|excluded:0" immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label>カテゴリ</label>
                        <m-kv-select
                            v-model="dRow.category_m_kv_id"
                            :selected-item.sync="dSelectedCategoryMkv"
                            :kv-key="'m_materials-category_m_kv_id'"
                        />
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>

                <validation-provider name="サブカテゴリ" rules="required|excluded:0" immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label>サブカテゴリ</label>
                        <m-kv-select
                            v-model="dRow.sub_category_m_kv_id"
                            :selected-item.sync="dSelectedSubCategoryMkv"
                            :kv-category-id="cTargetCategoryId"
                        />
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>

                <validation-provider name="拠点" rules="required|excluded:0" immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label>拠点</label>
                        <m-branch-select
                            v-model="dRow.m_branch_id"
                        />
                        <span class="validation-error">{{ errors[0] }}</span>
                    </div>
                </validation-provider>

                <validation-provider name="仕入先" rules="required|excluded:0" immediate v-slot="{ errors }">
                    <div class="form-group">
                        <label>仕入先</label>
                        <m-customer-ref-input
                            :m-branch-id="dRow.m_branch_id"
                            :dealing-cds="[2,4]"
                            :selectedId.sync="dRow.supplier_m_customer_id"
                            v-model="dRow.supplier_m_customer_id"
                        />
                        <span class="validation-error">{{ errors[0] }}</span>                        
                    </div>
                </validation-provider>

                <div class="d-none">
                    <validation-provider name="金額計算" rules="required|excluded:0" immediate v-slot="{ errors }">
                        <div class="form-group">
                            <label>金額計算</label>
                            <m-kv-select
                                v-model="dRow.total_price_calc_m_kv_id"
                                :kv-key="'m_materials-total_price_calc_m_kv_id'"
                            />
                            <span class="validation-error">{{ errors[0] }}</span>
                        </div>
                    </validation-provider>

                    <validation-provider name="勘定科目" rules="required|excluded:0" immediate v-slot="{ errors }">
                        <div class="form-group">
                            <label>勘定科目</label>
                            <m-kv-select
                                v-model="dRow.accounts_title_m_kv_id"
                                :kv-key="'sales_management-accounts_title_m_kv_id'"
                            />

                            <span class="validation-error">{{ errors[0] }}</span>
                        </div>
                    </validation-provider>
                </div>
                
                <div class="form-group">
                    <label>資材タグ</label>
                    <m-tag-select
                        :tag-category-key="dTagCatKey"
                        :setTagIds="dRow.m_tags"
                        v-model="dTagIds"
                    />
                </div>

                <div class="form-group">
                    <label for="is_stocked">在庫管理</label>
                    <ns-checkbox-input
                        :id="'is_stocked'"
                        v-model="dRow.is_stocked"
                        />
                </div>
                <div class="form-group">
                    <label>防炎シール番号</label>
                    <input class="form-control" v-model="dRow.fire_prev_label_cd">
                </div>

                <div class="row">
                    <div class="col">
                        <button type="submit" class="btn btn-success" @click.prevent="postData()" :disabled="invalid || dLoading">保存</button>
                        <button type="submit" class="btn btn-light" @click.prevent="historyBack()">戻る</button>
                    </div>
                </div>
            </div>

            <div class="col-md-9">
                <div class="row">
                    <table class="table table-striped table-dark">
                        <thead>
                            <tr class="text-nowrap">
                                <th scope="col">No.</th>
                                <th scope="col">詳細</th>
                                <th scope="col" class="d-none d-md-table-cell">幅 × 流れ</th>
                                <th scope="col" class="d-none d-md-table-cell">容量</th>
                                <th scope="col" class="d-none d-md-table-cell">内容数</th>
                                <th scope="col" class="d-none d-md-table-cell">仕入単価</th>
                                <th scope="col" class="d-none d-md-table-cell">原価</th>
                                <th scope="col" class="d-none d-md-table-cell">用途・説明</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="(n, index) in cDetails" :key="n.id" @click="selectRow(n)" :class="{ selected:dSelectedRows.id === n.id }">
                                <td>{{ index + 1 }}</td>
                                <td>{{ n.detail_name }}</td>
                                <td class="d-none d-md-table-cell">{{ cNumberFormat(n.width) }} × {{ cNumberFormat(n.height) }}</td>
                                <td class="d-none d-md-table-cell">{{ cNumberFormat(n.capacity) }}</td>
                                <td class="d-none d-md-table-cell">{{ cNumberFormat(n.contents_qty) }}</td>
                                <td class="d-none d-md-table-cell">{{ cNumberFormat(n.unit_price) }}</td>
                                <td class="d-none d-md-table-cell">{{ cNumberFormat(n.cost_price) }}</td>
                                <td class="d-none d-md-table-cell">{{ cAbbreviation(n.description) }}</td>
                                <td>
                                    <button v-if="index!=0" type="button" class="btn btn-danger" @click.prevent="deleteRow(n)" :disabled="dLoading">
                                        <i class="fas fa-trash fa-fw" />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="form-group">
                    <div class="row">
                        <div class="col clearfix">
                            <div class="float-right">
                                <button type="button" class="btn btn-primary" @click.prevent="insertRow()" :disabled="cIsDisabledButton">
                                    <i class="fas fa-plus fa-fw" />
                                    明細追加
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group" v-if="cIsShowDetailArea">
                    <div class="row">
                        <div class="col-12 col-xl-10">
                            <div class="row mb-3" v-if="cIsShowCostPrice">
                                <div class="col-12 pl-xl-0" >
                                    <div class="mt-1 mb-0 alert alert-success" role="alert">
                                        <div>ロス込原価計算式：</div>
                                        <div  style="white-space:pre-wrap;">{{dSelectedCategoryMkv.g_01}}</div>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-12 col-xl-6 pl-xl-0">
                                    <div class="form-group">
                                        <label for="is_able_to_detail_name">
                                            <span class="d-inline">詳細</span>
                                            <ns-checkbox-input
                                                class="d-inline" 
                                                :id="'is_able_to_detail_name'"
                                                v-model="dSelectedRows.is_able_to_detail_name"
                                                :label="cIsAbleToDetailName"
                                                />
                                        </label>
                                        <input class="form-control" v-model="cMaterialDetailName" :disabled="!dSelectedRows.is_able_to_detail_name">
                                    </div>
                                </div>
                                <div class="col-12 col-xl-3 pl-xl-0">
                                    <div class="form-group">
                                        <label>税区分</label>
                                        <m-kv-select
                                            v-model="dSelectedRows.tax_m_kv_id"
                                            :kv-key="'sales_management-tax'"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-12 col-xl-3 pl-xl-0">
                                    <div class="form-group" v-if="cIsUnitTypeWidth">
                                        <label for="width">幅</label>
                                        <ns-number-input 
                                            id="width" 
                                            v-model="dSelectedRows.width"
                                            min="0"
                                        />
                                    </div>
                                </div>
                                <div class="col-12 col-xl-3 pl-xl-0">
                                    <div class="form-group" v-if="cIsUnitTypeHeight">
                                        <label for="height">流れ{{ cUnitManageName }}</label>
                                        <ns-number-input 
                                            id="height" 
                                            v-model="dSelectedRows.height"
                                            min="0"
                                        />
                                    </div>
                                </div>
                                <div class="col-12 col-xl-3 pl-xl-0">
                                    <div class="form-group" v-if="cIsUnitTypeCapacity">
                                        <label for="capacity">容量{{ cUnitManageName }}</label>
                                        <ns-number-input 
                                            id="capacity" 
                                            v-model="dSelectedRows.capacity"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-12 col-xl-3 pl-xl-0">
                                    <div class="form-group">
                                        <label for="contents_qty">内容数</label>
                                        <ns-number-input 
                                            id="contents_qty" 
                                            v-model="dSelectedRows.contents_qty"
                                            min="0"
                                            :integer-only="false"
                                        />
                                    </div>
                                </div>
                                <div class="col-12 col-xl-3 pl-xl-0">
                                    <div class="form-group">
                                        <label for="min_order_qty">最低発注数</label>
                                        <ns-number-input 
                                            id="min_order_qty" 
                                            v-model="dSelectedRows.min_order_qty"
                                            min="0"
                                        />
                                    </div>
                                </div>
                                <div class="col-12 col-xl-3 pl-xl-0">
                                    <div class="form-group">
                                        <label>発注単位</label>
                                        <m-kv-select
                                            v-model="dSelectedRows.unit_m_kv_id"
                                            :selected-item.sync="dSeletedUnitMKv"
                                            :kv-key="'m_materials-unit_m_kv_id'"
                                        />
                                    </div>
                                </div>
                                <div class="col-12 col-xl-3 pl-xl-0">
                                    <div class="form-group">
                                        <label for="is_able_to_input_size">発注時サイズ入力</label>
                                        <ns-checkbox-input
                                            :id="'is_able_to_input_size'"
                                            v-model="dSelectedRows.is_able_to_input_size"
                                            />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12 col-xl-3 pl-xl-0">
                                    <div class="form-group">
                                        <label for="unit_price">仕入単価</label>
                                        <ns-number-input 
                                            id="unit_price" 
                                            v-model="dSelectedRows.unit_price"
                                        />
                                    </div>
                                </div>
                                <div class="col-12 col-xl-3 pl-xl-0">
                                    <div class="form-group" v-if="cIsShowCostPrice">
                                        <label for="cost_price">ロス込原価{{ cUnitCalcName }}</label>
                                        <ns-number-input 
                                            id="cost_price" 
                                            v-model="dSelectedRows.cost_price"
                                        />
                                    </div>
                                </div>
                                <div class="col-12 col-xl-6 pl-xl-0">
                                    <div class="form-group">
                                        <label for="description">用途・説明</label>
                                        <input class="form-control" id="description" v-model="dSelectedRows.description">
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-12 col-xl-3 pl-xl-0">
                                    <div class="form-group">
                                        <label>発注許可区分</label>
                                        <m-kv-select
                                            v-model="dSelectedRows.order_permission_m_kv_id"
                                            :kv-key="'m_materials-order_permission_m_kv_id'"
                                        />
                                    </div>
                                </div>
                                <div class="col-12 col-xl-3 pl-xl-0">
                                    <div class="form-group">
                                        <label>配送料区分</label>
                                        <m-kv-select
                                            v-model="dSelectedRows.delivery_calc_m_kv_id"
                                            :kv-key="'m_materials-delivery_calc_m_kv_id'"
                                        />
                                    </div>
                                </div>
                                <div class="col-12 col-xl-6 pl-xl-0">
                                    <div class="form-group">
                                        <label for="memo">備考</label>
                                        <input class="form-control" id="memo" v-model="dSelectedRows.memo">
                                    </div>
                                </div>
                            </div>
                            <!-- <div class="row" v-if="dRow.is_stocked">
                                <div class="col-12 col-xl-3 pl-xl-0">
                                    <div class="form-group">
                                        <label>在庫管理単位</label>
                                        <m-kv-select
                                            v-model="dSelectedRows.ivt_div_m_kv_id"
                                            :kv-key="'m_materials-ivt_div'"
                                        />
                                    </div>
                                </div>
                            </div> -->
                        </div>

                        <div class="col-12 col-xl-2">
                            <div class="form-group">
                                <div class="col">
                                    <div class="row justify-content-end">
                                        <button type="submit" class="btn btn-light" @click.prevent="generateQRCode()" :disabled="dLoading">QR作成</button>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="col">
                                    <div class="row justify-content-end">
                                        <!-- SVGをイメージとして表示 -->
                                        <img class="img-thumbnail img-fluid" loading="lazy" v-if="dQRCode" :src="dQRCode">

                                        <!-- SVGで表示する場合は下記コメントアウト -->
                                        <!-- <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="130" height="130" viewBox="0 0 130 130" >
                                            <rect x="0" y="0" width="130" height="130" fill="#ffffff"/>
                                            <g transform="scale(3.95)">
                                            <path fill-rule="evenodd" fill="#000000" :d="dQRCode" />
                                            </g>
                                        </svg> -->
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                            <div class="form-group">
                                <div class="clearfix">
                                    <div class="float-right">
                                        <button type="submit" class="btn btn-success" @click.prevent="updateRow()" :disabled="dLoading">明細更新</button>
                                        <button type="submit" class="btn btn-secondary" @click.prevent="cancelRow()">キャンセル</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </validation-observer>
</template>

<script>
import ObjectUtil from "@frameworks/ObjectUtil" ;
import NumberUtil from "@frameworks/NumberUtil" ;
import PageMixins from '@mixins/commons/PageMixins' ;

export default {
    mixins : [PageMixins] , 
    data : function () {
        return {
            dApiName : "mMaterial" ,
            dApiDetailName : "mMaterialDetail" ,
            dRow : {                                                        // 初期値を設定
                id : 0 ,                                                    // id(新規:0 新規登録後は1以降になる)
                m_branch_id : undefined ,                                   // 拠点(ログインユーザーの拠点)
                is_stocked : true ,                                         // 在庫管理区分 初期値=する
                total_price_calc_m_kv_id : 1500001 ,                        // 金額計算(個数)
                accounts_title_m_kv_id : 1265001 ,                          // 勘定科目(材料)
                m_material_details : [] ,                                   // 材料明細
                m_tags : [] ,                                               // 資材タグ(タグ)
            } ,
            dIsValid_DetailAddButton : false ,                              // 明細追加ボタンの有効状態(false:無効 true:有効)
            dIsShow_DetailArea : false ,                                    // 明細入力エリアの表示状態(false:表示しない true:表示する)
            dSelectedCategoryMkv : {} ,                                     // カテゴリ
            dSelectedSubCategoryMkv : {} ,                                  // サブカテゴリ
            dTagCatKey : "m_materials-category_sub" ,                       // タグkey
            dTagIds : [] ,                                                  // タグid
            dSeletedUnitMKv : undefined ,                                   // 選択された発注単位
            dSelectedRows : {                                               // 明細行の初期値を設定
                id : 0 ,                                                    // 明細id
                contents_qty : 1 ,                                          // 内容数
                min_order_qty : 1 ,                                         // 最低発注数
                unit_m_kv_id : 0 ,                                          // 単位
                order_permission_m_kv_id : 0 ,                              // 発注許可区分
                delivery_calc_m_kv_id : 0 ,                                 // 配送料区分
                tax_m_kv_id : 1170001 ,                                     // 税区分
                memo : "" ,                                                 // 用途・説明
            } ,                         
            dIsSaveSuccess : false ,                                        // 保存成功
            dLoading : false ,                                              // 非同期apiでの読込中フラグ
            dQRCode : "" ,                                                  // QRコード生成用
        }
    } ,
    computed : {
        cEndpoint : function () {
            let ep = `api/${this.dApiName}` ;

            if (this.dRow.id > 0) {
                ep += `/${this.dRow.id}` ;
            } else if (!this.cIsNew) {
                ep += `/${this.$route.params.id}` ;
            }

            return ep ;
        } ,
        cEndpoint2 : function () {
            return function (id = -1) {
                // 明細URL
                let ep = `api/${this.dApiDetailName}` ;

                if (id != -1) ep += `/${id}` ;

                return ep ;
            } ;
        } ,
        cIsNew : function () {
            return this.$route.params.id === undefined ;
        } ,
        cIsShow : function () {
            return this.cIsNew || this.dRow.id > 0 ;
        } ,
        cIsDisabledButton : function () {
            // 明細追加ボタンの有効状態(DB更新前の新規登録時か明細入力エリアが表示されている場合は無効)
            return (this.dRow.id == 0) || this.dIsShow_DetailArea ;
        } ,
        cIsShowDetailArea : function () {
            // 明細入力エリアの有効状態
            return this.dIsShow_DetailArea ;
        } ,
        cIsUnitTypeWidth : function () {
            // 明細入力エリアの単位有効状態
            const num = Number(this.dSelectedSubCategoryMkv?.g_02 ?? 0) ;
            return num == 0 || num == 1 ;
        } ,
        cIsUnitTypeHeight : function () {
            // 明細入力エリアの単位有効状態
            const num = Number(this.dSelectedSubCategoryMkv?.g_02 ?? 0) ;
            return num == 0 || num == 1 || num == 2 ;
        } ,
        cIsUnitTypeCapacity : function () {
            // 明細入力エリアの容量有効状態
            const num = Number(this.dSelectedSubCategoryMkv?.g_02 ?? 0) ;
            return num == 0 || num == 3 ;
        } ,
        cIsShowCostPrice: function () {
            // 明細入力エリアの原価有効状態
            const num = Number(this.dSelectedSubCategoryMkv?.g_06 ?? 0) ;
            return num == 1 ;
        } ,
        cIsAbleToDetailName : function () {
            // 詳細名入力可否をラベル名に表記
            return this.dSelectedRows.is_able_to_detail_name ? "" : "入力する場合はチェックを入れてください" ;
        } ,
        cUnitCalcName : function () {
            // 原価(ロス込み/@)をラベル名に表記
            let str = this.dSelectedSubCategoryMkv?.g_01 ;
            if (str != null && str != "") str = "@" + str ; 
            return str ;
        } ,
        cUnitManageName : function () {
            // 管理単位を表記
            let str = this.dSelectedSubCategoryMkv?.g_03 ;
            if (str != null && str != "") str = "(" + str + ")" ; 
            return str ;
        } ,
        cMaterialDetailName : {
            get : function () {
                let name = this.dSelectedRows.detail_name ;

                if (!this.dSelectedRows.is_able_to_detail_name) {
                    // 入力不可の場合：材料明細名は命名規則によって設定
                    name = this.materialDetaiNaming() ;
                    // 材料詳細名を上書き
                    this.dSelectedRows.detail_name = name ;
                }

                return name ;
            } ,
            set : function (value) {
                this.dSelectedRows.detail_name = value ;
            }
        } ,
        cTargetCategoryId : function () {
            // 選択されているカテゴリの対象カテゴリidを取得
            return this.dSelectedCategoryMkv?.target_m_kv_category_id ?? 0 ;
        } ,
        cNumberFormat : function () {
            return function (val) {
                return NumberUtil.formatZeroSuppress(val) ;
            } ;
        } ,
        cAbbreviation : function () {
            return function (val) {
                let text = ObjectUtil.nu2ec(val);
                // 30文字より大きい場合は省略
                if (text.length > 30) {
                    text = text.substr(0, 30) + '…';
                }
                return text ;
            } ;
        } ,
        cDetails : function () {
            return this.dRow.m_material_details ;
        } ,
    } ,
    methods : {
        getData : async function () {
            try {
                const res = await axios.get(this.cEndpoint) ;
                this.dSelectedCategoryMkv = res.data.category_m_kvs ;
                this.dRow = res.data ;
            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.cEndpoint) ;
            }
        } ,
        postData : async function () {
            this.dLoading = true ;
            this.dIsSaveSuccess = false ;

            try {
                this.dRow.tag_links = {} ;
                this.dRow.tag_links[this.dTagCatKey] = this.dTagIds ;
                this.dRow.updated_m_user_id = this.mainStore.loginMUser.id ;

                if (this.dRow.id == 0) {
                    // 追加
                    this.dRow.created_m_user_id = this.mainStore.loginMUser.id ;
                    const res = await axios.post(this.cEndpoint, this.dRow) ;
                    this.dRow.id = res.data.id ;
                    this.dRow.cd = res.data.cd ;

                    // 新規の場合は材料明細に1件追加
                    this.insertRow() ;
                    this.updateRow(false) ;
                } else {
                    // 更新
                    const res = await axios.put(this.cEndpoint, this.dRow) ;
                    this.dRow.cd = res.data.cd ;
                }
                this.dIsSaveSuccess = true ;

            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.cEndpoint) ;
            }

            this.dLoading = false ;
        } ,
        historyBack : function () {
            // 検索画面へ戻る
            this.$router.push({ name : Inflector.underscore(this.dApiName) }) ;
        } ,
        initRow : function () {
            // 材料明細の初期化
            this.dSelectedRows = {
                id : 0 ,                                                            // id
                contents_qty : 1 ,                                                  // 内容数
                min_order_qty : 1 ,                                                 // 最低発注数
                unit_m_kv_id : Number(this.dSelectedSubCategoryMkv?.g_04 ?? 0) ,    // 単位
                order_permission_m_kv_id : 0 ,                                      // 発注許可
                delivery_calc_m_kv_id : 0 ,                                         // 配送料区分
                tax_m_kv_id : 1170001 ,                                             // 税区分
            } ; 

            // QRコードも初期化
            this.dQRCode = "" ;
        } ,
        cancelRow : function () {
            // キャンセル処理
            this.initRow() ;
            this.dIsShow_DetailArea = false ;
        } ,
        selectRow : function (row) {
            // 選択行を設定(DeepCopy)
            this.dSelectedRows = JSON.parse(JSON.stringify(row)) ;
            this.dIsShow_DetailArea = true ;

            // QRコードは初期化
            this.dQRCode = "" ;
        } ,
        insertRow : function () {
            // 追加処理
            this.initRow() ;
            this.dIsShow_DetailArea = true ;
        } ,
        updateRow : async function (isInit = true) {
            this.dLoading = true ;

            // 選択行を設定(DeepCopy)
            const detail = JSON.parse(JSON.stringify(this.dSelectedRows)) ;
            detail.updated_m_user_id = this.mainStore.loginMUser.id ;

            
            if(!this.cIsShowCostPrice) {
                detail.cost_price = detail.unit_price ;
            }

            try {
                if (detail.id == 0) {
                    // 明細追加
                    detail.created_m_user_id = this.mainStore.loginMUser.id ;
                    detail.m_material_id = this.dRow.id ;

                    const res = await axios.post(this.cEndpoint2(), detail) ;
                    // 追加した明細idを設定
                    detail.id = res.data.id ;
                    this.dSelectedRows.id = detail.id ;
                    this.dRow.m_material_details.push(detail) ;
                } else {
                    // 明細更新
                    const index = this.dRow.m_material_details.findIndex(e => e.id === detail.id) ;

                    if (index != -1) {
                        const res = await axios.put(this.cEndpoint2(detail.id), detail) ;
                        this.dRow.m_material_details.splice(index, 1, detail) ;
                    }
                }

                if (isInit) {
                    // 選択解除
                    this.initRow() ;
                    this.dIsShow_DetailArea = false ;
                }

            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.cEndpoint) ;
            }

            this.dLoading = false ;
        } ,
        deleteRow : async function (row) {
            if (!confirm('削除してもよろしいですか?')) return ;
            this.dLoading = true ;

            try {
                const index = this.dRow.m_material_details.findIndex(e => e.id === row.id) ;
                
                if (index != -1) {

                    // 明細選択行の倫理削除
                    this.dRow.m_material_details.splice(index, 1) ;

                    if (row.id != 0) {
                        // 明細選択行の物理削除
                        const ep = this.cEndpoint2(row.id) ;
                        const res = await axios.delete(ep) ;
                    }
                }

                // 選択解除
                this.initRow() ;
                this.dIsShow_DetailArea = false ;
            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.cEndpoint) ;
            }

            this.dLoading = false ;
        } ,
        generateQRCode : async function() {
            this.dLoading = true ;

            try {
                // AppUrl + 材料明細idをQR生成するapiを作成
                const ep = `${this.$$cAppUrl}/qrcode/generate_tporder/${this.dSelectedRows.id}` ;
                const res = await axios.get(ep) ;
                // console.log(res);

                // imgにSVGデータを表示したいのでプレフィックス[data:image/svg+xml;base64, ]を追加
                this.dQRCode = "data:image/svg+xml;base64, " + res.data; ;
            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.cEndpoint) ;
            }

            this.dLoading = false ;
        } ,
        materialDetaiNaming : function () {
            // 材料明細名の命名ルーチン
            let name = "[" ;

            // g_03:管理単位の表記
            const unit     = (this.dSelectedSubCategoryMkv?.g_03 ?? "") ;
            const width    = NumberUtil.invalid2zr(this.dSelectedRows.width   ) ;
            const height   = NumberUtil.invalid2zr(this.dSelectedRows.height  ) ;
            const capacity = NumberUtil.invalid2zr(this.dSelectedRows.capacity) ;

            // g_02:管理単位{0:無し,1:幅x流,2:長さ,3:容量}]によって命名を切り分ける
            if (this.dSelectedSubCategoryMkv?.g_02 == 3) {
                // 管理単位が容量系[L]
                if (capacity != 0) name += capacity + unit ;

            } else if(unit == "mm" && height >= 10000 && (height % 1000 == 0)) {
                // 管理単位が寸法系[mm]かつ height[高さ・流れ]が10,000mm(10M)を超える場合はM表記
                if (width  != 0) name += this.cNumberFormat(width) + unit  + " X " ;
                if (height != 0) name += this.cNumberFormat(height / 1000) + "M" ;

            } else {
                // 管理単位が上記以外
                if (width  != 0) name += this.cNumberFormat(width ) + " X " ;
                if (height != 0) name += this.cNumberFormat(height) + unit  ;

            }

            // 入り数
            if (this.dSelectedRows.contents_qty > 1) name += " * " + this.cNumberFormat(this.dSelectedRows.contents_qty) ;

            name += "]" ;
            return name ;
        } ,
    } ,
    created : function () {
        if (!this.cIsNew) {
            this.getData() ;
        } else {
            this.dRow.m_branch_id = this.mainStore.loginMUser.m_branch_id
        }
    } ,
}
</script>