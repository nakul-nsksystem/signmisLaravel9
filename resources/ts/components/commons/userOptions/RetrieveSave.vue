<template>
    <div>
        <button type="button" class="btn btn-outline-success" @click.prevent="openModal">
            <div>
                <i class="fas fa-save fa-fw"></i>保存
            </div>
        </button>
        <button type="button" class="btn btn-outline-info" @click.prevent="openCallModal">
            <div>
                <i class="fas fa-book-open fa-fw"></i>呼出
            </div>
        </button>
        <div id="modalRetrieveData"
            class="modal fade bd-example-modal-xl"
            tabindex="-1"
            role="dialog"
            aria-labelledby="modalRetrieveData"
            aria-hidden="true"
            style="margin-top: 0px;"
            v-show="dShowModal1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="app-contents-container text-right">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true" class="text-white">&times;</span>
                        </button>
                    </div>
                    <retrieve-save-modal 
                        v-model="value"
                        :savedSearchOption="cSavedSearchOption"
                        @closeModal="closeModal()"
                        class="text-left"
                        />

                </div>

            </div>
        </div>
        <div id="modalRetrieveCallData"
            class="modal fade bd-example-modal-xl"
            tabindex="-1"
            role="dialog"
            aria-labelledby="modalRetrieveCallData"
            aria-hidden="true"
            style="margin-top: 0px;"
            v-show="dShowModal2">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="app-contents-container text-right">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true" class="text-white">&times;</span>
                        </button>
                    </div>

                    <retrieve-call-modal 
                        @setSavedData="setSavedData($event)"
                        :savedSearchOption="cSavedSearchOption"
                        class="text-left"
                        />

                </div>

            </div>
        </div>
    </div>
</template>

<script>
import RetrieveSaveModal from './RetrieveSaveModal.vue';
import RetrieveCallModal from './RetrieveCallModal.vue';


export default {
  components: { RetrieveSaveModal,RetrieveCallModal },
    data : function() {
        return {
            dShowModal1 : false ,
            dShowModal2 : false ,
        }
    } ,
    props : {
        value :{
            type : Object ,
        },
        application:{
            type : String
        }

    } ,
    watch : {

    } ,
    computed : {

        cSavedSearchOption : function(){

            // return this.mainStore.masters.PersonalOptions
            const savedSearchOption =  this.mainStore.masters.SmUserOptions.find(x => x.key_m_kv.g_01 == "saved_search" && x.application == this.application) ;

            if(savedSearchOption === undefined) return [] ;

            return savedSearchOption ;
        } ,

    } ,
    methods : {
        openModal : function(){
            this.dShowModal1 = true ;
            $('#modalRetrieveData').modal() ;
        } ,
        closeModal : function(){
            $('#modalRetrieveData').modal('hide') ;
        } ,
        openCallModal : function(){
            this.dShowModal2 = true ;
            $('#modalRetrieveCallData').modal() ;
        } ,
        setSavedData : function(row){
            this.$emit("input",row)
            this.$emit("search")
            $('#modalRetrieveCallData').modal('hide') ;

        } ,

    } ,
    created : function() {
    } ,
}
</script>