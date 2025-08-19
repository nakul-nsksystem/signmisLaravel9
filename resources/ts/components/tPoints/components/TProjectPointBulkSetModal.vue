<template>
    <validation-observer ref="observer" v-slot="{ invalid, errors }">
        <div id="modalTProjectPointBulkSet" class="modal fade" tabindex="-1" role="dialog"
            aria-labelledby="modalTProjectPointBulkSet" aria-hidden="true" data-backdrop="static"
            style="margin-top: 0px;">
            <div class="modal-dialog modal-lg">
                <div class="app-modal-content-dark p-3">
                    <div class="pt-2 mb-3">
                        <h4>
                            <i class="fas fa-arrow-circle-down"></i>
                            一括設定
                        </h4>
                    </div>

                    <div class="row mb-3">
                        <div class="col-12">
                            <div class="form-group">
                                <label>利益率</label>
                                <div class="d-flex flex-no-wrap">
                                    <input type="number" class="form-control" v-model="cValue.profitPerFrom">
                                    <span class="px-1 pt-2">～</span>
                                    <input type="number" class="form-control" v-model="cValue.profitPerTo">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-12 col-xl-3">
                            <div class="form-group">
                                <label>制作Pt率</label>
                                <validation-provider name="制作Pt率" rules="required|min_value:0|max_value:100"
                                    :bails="false" v-slot="{ errors }">
                                    <ns-number-input v-model="cValue.prodPer" />
                                    <span v-if="errors" class="validation-error">{{ errors[0] }}</span>
                                </validation-provider>
                            </div>
                        </div>
                        <div class="col-12 col-xl-3">
                            <div class="form-group">
                                <label>営業Pt率</label>
                                <validation-provider name="営業Pt率" rules="required|min_value:0|max_value:100"
                                    :bails="false" v-slot="{ errors }">
                                    <ns-number-input v-model="cValue.salesPer" />
                                    <span v-if="errors" class="validation-error">{{ errors[0] }}</span>
                                </validation-provider>
                            </div>
                        </div>
                        <div class="col-12 col-xl-3">
                            <div class="form-group">
                                <label>施工Pt掛け率</label>
                                <validation-provider name="施工Pt掛け率" rules="required|min_value:0|max_value:100"
                                    :bails="false" v-slot="{ errors }">
                                    <ns-number-input v-model="cValue.constructCoef" />
                                    <span v-if="errors" class="validation-error">{{ errors[0] }}</span>
                                </validation-provider>
                            </div>
                        </div>
                        <div class="col-12 col-xl-3">
                            <div class="form-group">
                                <label>登録Pt掛け率</label>
                                <validation-provider name="登録Pt掛け率" rules="required|min_value:0|max_value:100"
                                    :bails="false" v-slot="{ errors }">
                                    <ns-number-input v-model="cValue.createCoef" />
                                    <span v-if="errors" class="validation-error">{{ errors[0] }}</span>
                                </validation-provider>
                            </div>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-12">
                            <div class="form-group">
                                <ns-checkbox-input id="isUpdateAlreadySet" label="設定済の値を上書き"
                                    v-model="cValue.isUpdateAlreadySet" />
                            </div>
                        </div>

                    </div>
                    <div class="row">
                        <div class="col-12">
                            <div class=" text-right p-2">
                                <button type="button" class="btn btn-primary mr-2" :disabled="invalid"
                                    @click.prevent="ok">OK</button>
                                <button type="button" class="btn btn-light" @click.prevent="closeModal">閉じる</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </validation-observer>
</template>
<script lang="ts" setup>
import Vue, { computed, reactive } from 'vue';
import _ from 'lodash'
import NsCheckboxInput from '../../commons/input/NsCheckboxInput.vue';

interface IProps {
    value?: any
}
const props = withDefaults(defineProps<IProps>(), {})

const cValue = computed(() => props.value);

interface IEmits {
    (e: 'ok'): void
}

const emit = defineEmits<IEmits>();


function openModal() {
    $('#modalTProjectPointBulkSet').modal();
}

function ok() {
    emit("ok");
    closeModal();
}

function closeModal() {
    $('#modalTProjectPointBulkSet').modal("hide");

}


</script>
<script lang="ts">
export default {
    components: { NsCheckboxInput },
    methods: {
        openModal: function () {

            $('#modalTProjectPointBulkSet').modal();

        }
    }
}
</script>