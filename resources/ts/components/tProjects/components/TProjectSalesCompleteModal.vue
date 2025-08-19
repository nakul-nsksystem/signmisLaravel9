<template>
    <div
        id="modelTProjectSalesComplete"
        class="modal fade"
        tabindex="-1"
        role="dialog"
        aria-labelledby="modelTProjectSalesComplete"
        aria-hidden="true"
        data-backdrop="static"
        style="margin-top: 0px"
    >
        <validation-observer v-slot="{ invalid, errors }">
            <div class="modal-dialog modal-lg">
                <div class="app-modal-content-dark p-3">
                    <div class="pt-2 mb-3">
                        <h4>
                            <i class="fas fa-user-check"></i>
                            売上完了
                        </h4>
                    </div>

                    <div class="row mb-3">
                        <div class="col-12">
                            <div class="form-group">
                                <validation-provider
                                    name="売上完了日"
                                    rules="required"
                                    immediate
                                    v-slot="{ errors }"
                                >
                                    <label>売上完了日</label>
                                    <ex-v-date-picker
                                        v-model="cValue.sales_completed_at"
                                    />
                                    <span class="validation-error">{{
                                        errors[0]
                                    }}</span>
                                </validation-provider>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <div class="text-right p-2">
                                <button
                                    type="button"
                                    class="btn btn-primary mr-2"
                                    :disabled="invalid"
                                    @click.prevent="ok"
                                >
                                    OK
                                </button>
                                <button
                                    type="button"
                                    class="btn btn-light"
                                    @click.prevent="close"
                                >
                                    閉じる
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </validation-observer>
    </div>
</template>
<script>
import _ from "lodash";
import DayJsEx from "../../../frameworks/DayJsEx";

export default {
    data: function () {
        return {
            //モーダル表示
            dTProjectSalesCompleteModal: false,
        };
    },
    props: {
        //t_project_deliveryのレコード
        value: {
            type: Object,
        },
    },

    computed: {
        cValue: function () {
            return this.value;
        },
    },
    methods: {
        dateFormat: function (value) {
            if (_.isNil(value)) return "";
            return DayJsEx.format(value, "YYYY-MM-DD");
        },

        //モーダルを開く
        open: function () {
            this.dDeliveryProductLinkModal = true;
            $("#modelTProjectSalesComplete").modal();
        },

        //モーダルを閉じる
        close: function () {
            $("#modelTProjectSalesComplete").modal("hide");
        },

        //売上完了確定
        ok: function () {
            this.close();
            this.$emit("ok", this.cValue);
        },
    },
    watch: {},
    created: function () {},
};
</script>
