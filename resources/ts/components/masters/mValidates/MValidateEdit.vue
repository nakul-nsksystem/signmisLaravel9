<template>
    <validation-observer v-slot="{ invalid, errors }" >
        <div class="row">
            <div class="col">
                <div v-show="cIsError" class="alert alert-danger" role="alert">
                    {{ dErrorData.message }}
                </div>
            </div>
        </div>

        <!-- observer(親)でvalidation-provider(子)のエラーを取得可能 v-forで出力できる -->
        <!-- <template v-if="invalid"> -->
        <template v-if="false">
            <div class="form-group" v-for="error in errors" :key="error[0]">
                <span class="validation-observer-error">{{ error[0] }}</span>
            </div>
        </template>

        <form v-if="cIsShow">
            <!-- ラベル名[name]・ルール設定[rules]・エラーメッセージ配列変数[errors]の3つを指定 -->
            <validation-provider name="コード" rules="required|alpha_num|max:5" v-slot="{ errors }">
                <div class="form-group">
                    <label for="inputCd">コード【必須、英数字のみ、5文字以内】</label>
                    <input v-model="dRow.cd" class="form-control" id="inputCd" placeholder="コードを入力してください">
                    <!-- エラー時のメッセージを表示 -->
                    <span class="validation-error">{{ errors[0] }}</span>
                </div>
            </validation-provider>

            <!-- フォーカスが離れた際に検証する場合はmode="lazy"を指定、デフォルトはmode="aggressive"、明示的に呼び出されない限り検証しない場合はmode="passive" -->
            <validation-provider name="名称" mode="lazy" rules="required|min:3|max:5" v-slot="{ errors }">
                <div class="form-group">
                    <label for="inputName">名称【必須、3～5文字まで、遅延検証(フォーカスが離れた際)】</label>
                    <input v-model="dRow.name" class="form-control" id="inputName" placeholder="名称を入力してください">
                    <span class="validation-error">{{ errors[0] }}</span>
                </div>
            </validation-provider>

            <validation-provider name="カナ" rules="required|custom_rule_kana:dRow.kana" v-slot="{ errors }">
                <div class="form-group">
                    <label for="inputName">カナ【必須、全角カナのみ(カスタム拡張)】</label>
                    <input v-model="dRow.kana" class="form-control" id="inputKana" placeholder="カナを入力してください">
                    <span class="validation-error">{{ errors[0] }}</span>
                </div>
            </validation-provider>

            <validation-provider name="年齢" rules="required|numeric|between:18,100" :bails="false" v-slot="{ errors }">
                <div class="form-group">
                    <label for="inputAge">年齢【必須、数値のみ、R18、複数のエラーメッセージを同時に表示】</label>
                    <input v-model="dRow.age" class="form-control" id="inputAge" placeholder="年齢を入力してください">
                    <span class="validation-error">{{ errors }}</span>
                </div>
            </validation-provider>

            <!-- 画面表示後に即時検証したい場合はimmediateを指定 -->
            <validation-provider name="拠点" rules="required|custom_rule_collection_max:2" immediate v-slot="{ errors }">
                <div class="form-group">
                    <label>拠点【必須、2拠点まで(カスタム検証)】</label><br>
                    チェックされた項目{{ dRow.branches }}
                    <m-branch-multi-select v-model="dRow.branches" />
                    <span class="validation-error">{{ errors[0] }}</span>
                </div>
            </validation-provider>

            <!-- 画面表示後に即時検証したい場合はimmediateを指定 -->
            <validation-provider name="カテゴリ" rules="required|excluded:0" immediate v-slot="{ errors }">
                <div class="form-group">
                    <label for="inputCategoryMKvId">カテゴリ・サブカテゴリ【必須】</label>
                    <m-kv-select
                        id="inputCategoryMKvId"
                        v-model="dRow.category_m_kv_id"
                        :selected-item.sync="dSelectedCategoryMkv"
                        :kv-key="'m_materials-category_m_kv_id'"
                    ></m-kv-select>
                    <span class="validation-error">{{ errors[0] }}</span>
                </div>
            </validation-provider>

            <!-- 画面表示後に即時検証したい場合はimmediateを指定 -->
            <validation-provider name="サブカテゴリ" rules="required|excluded:0" immediate v-slot="{ errors }">
                <div class="form-group">
                    <m-kv-select
                        id="inputSubCategoryMKvId"
                        v-model="dRow.sub_category_m_kv_id"
                        :kv-category-id="cTargetCategoryId"
                    ></m-kv-select>
                    <span class="validation-error">{{ errors[0] }}</span>
                </div>
            </validation-provider>

            <!-- 検証元[vid="@@@"]を指定 -->
            <validation-provider name="メールアドレス" rules="required|email" vid="confirmation" v-slot="{ errors }">
                <div class="form-group">
                    <label for="inputEmailat">メールアドレス【必須、メアド、確認フィールド指定】</label>
                    <input v-model="dRow.email" class="form-control" id="inputEmailat" placeholder="メールアドレスを入力してください">
                    <span class="validation-error">{{ errors[0] }}</span>
                </div>
            </validation-provider>

            <!-- 確認用として[rules="confirmed:@@@"]と[v-model=@@@]を指定 -->
            <!-- DBに保存しない場合は[v-model=@@@]の参照先を別に変更(例として$Vue.dataに保存) -->
            <validation-provider name="メールアドレス" rules="confirmed:confirmation" v-slot="{ errors }">
                <div class="form-group">
                    <input v-model="dConfirmedField" class="form-control" id="inputConfirmation" placeholder="確認用">
                    <span class="validation-error">{{ errors[0] }}</span>
                </div>
            </validation-provider>

            <validation-provider name="登録日" rules="required|custom_rule_date_range:1M" immediate vid="my_custom_rule1" v-slot="{ errors }">
                <div class="form-group">
                    <label for="inputRegistrationDate">登録日【必須+1ヶ月の範囲内】</label>
                    <ex-v-date-picker v-model="dRow.registration_date" />
                    <span class="validation-error">{{ errors[0] }}</span>
                </div>
            </validation-provider>

            <validation-provider name="納期" rules="required|custom_rule_date_or_later:my_custom_rule1" immediate v-slot="{ errors }">
                <div class="form-group">
                    <label for="inputDeliveryDate">納期【登録日以降】</label>
                    <ex-v-date-picker v-model="dRow.delivery_date" />
                    <span class="validation-error">{{ errors[0] }}</span>
                </div>
            </validation-provider>

            <label>validation-observer.invalid={{invalid}} 無効(invalid)だとボタン押せません</label><br>
            <button type="submit" class="btn btn-success" :disabled="invalid" @click.prevent="postData()">保存</button>
            <button type="submit" class="btn btn-light" @click.prevent="historyBack()">戻る</button>
        </form>
    </validation-observer>
</template>

<script>
import PageMixins from '@mixins/commons/PageMixins' ;

export default {
    mixins : [PageMixins] , 
    data : function() {
        return {
            dApiName : "mValidate" ,
            dRow : {
                branches : new Array() ,
                registration_date : null ,
                delivery_date : null ,
            } ,
            dSelectedCategoryMkv : [] ,
            dConfirmedField : "" ,
            dCheckedNames : [] , 
        }
    } ,
    computed : {
        cEndpoint : function () {
            let ep = `api/${this.dApiName}` ;
            if (!this.cIsNew) ep += `/${this.$route.params.id}` ;
            
            return ep ;
        } ,
        cCamelizedTableName : function () {
            const pluralized = Inflector.pluralize(this.dApiName) ;
            return Inflector.camelize(pluralized) ;
        } ,
        cIsNew : function () {
            return this.$route.params.id === undefined ;
        } ,
        cIsShow : function () {
            return this.cIsNew || this.dRow.id > 0 ;
        } ,
        cIsError : function () {
            return this.dErrorStatus !== undefined && this.dErrorStatus !== "" ;
        } ,
        cTargetCategoryId : function () {
            return (this.dSelectedCategoryMkv?.target_m_kv_category_id ?? 0) ;
        } ,
    } ,
    methods : {
        getData : async function () {
            try {
                const res = await axios.get(this.cEndpoint) ;
                this.dSelectedCategoryMkv = res.data.category_m_kvs ;
                this.dRow = res.data ;
                this.dRow.branches = JSON.parse(res.data.branches) ;
            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.ccEndpoint) ;
            }
        } ,
        postData : async function () {
            try {
                this.dRow.updated_m_user_id = this.mainStore.loginMUser.id ;

                if (this.cIsNew) {
                    this.dRow.created_m_user_id = this.mainStore.loginMUser.id ;
                    let res = await axios.post(this.cEndpoint, this.dRow) ;
                    this.mainStore.masters[this.cCamelizedTableName].push(res.data) ;
                } else {
                    let res = await axios.put(this.cEndpoint, this.dRow) ;
                    const updated      = this.mainStore.masters[this.cCamelizedTableName].find(e => e.id === res.data.id) ;
                    const updatedIndex = this.mainStore.masters[this.cCamelizedTableName].indexOf(updated) ;

                    if (updatedIndex != -1) {
                        this.mainStore.masters[this.cCamelizedTableName].splice(updatedIndex, 1, res.data) ;
                    }
                }

                this.historyBack() ;
            } catch (error) {
                // handle error
                this.$$errorConsole(error, this.ccEndpoint) ;
            }
        } ,
        historyBack : function () {
            this.$router.push({ name : Inflector.underscore(this.dApiName) }) ;
        } ,
    } ,
    created : function () {
        if (!this.cIsNew) this.getData() ;
    } ,
}
</script>