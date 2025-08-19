<template>
    <div class="modal fade" id="homeDisplayProjectModal" tabindex="-1" role="dialog" data-backdrop="static">        
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
                <div class="app-contents-container">
                    <div class="modal-header">
                        <h4>表示物件</h4>                        
                    </div>

                    <div class="modal-body">
                        <div class="table-responsive">
                            <table class="table table-dark text-nowrap">
                                <thead>
                                    <tr>
                                        <th>表示</th>
                                        <th>名称</th>
                                        <th>表示順</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="n in cFormatedList" :key="n.id">
                                        <td>
                                            <div>
                                                <ns-checkbox-input
                                                    :id="`MUserOption${n.id}`"
                                                    v-model="n.is_target_apply"
                                                    />

                                            </div>
                                        </td>
                                        <td>
                                            {{n.name}}
                                        </td>
                                        
                                        <td>
                                            <div v-if="!n.is_system_created">
                                                <NsNumberInput
                                                    v-model="n.order_no"
                                                    class="app-input-size"
                                                    />
                                            </div>
                                            <div v-else>
                                                {{n.order_no}}
                                            </div>
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary"  @click.prevent="saveUserOption()">決定</button>
                        <button type="button" class="btn btn-light ml-2" @click.prevent="close()">キャンセル</button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Vue, { ref,computed, toRefs, } from 'vue';
import _ from 'lodash'
import { MUserOptionService } from '../../masters/class/services/MUserOptionService'

    interface IProps {
        value?:any
        title?:string
    }

    const props = withDefaults(defineProps<IProps>(), {
        title : ""
    })

    interface IEmits {
        (e: 'getUserContentsByUserOptions'): void
    }

    const emit = defineEmits<IEmits>() 

    const cFormatedList = computed(() => {
        
        return props.value ;
        
    } )
    

    async function saveUserOption (){

        for(const row of cFormatedList.value) {
            row.target_value = row.is_target_apply ? "1" : "0" ;
        }

        await MUserOptionService.updateOrCreateOptions(cFormatedList.value) ;
        
        emit('getUserContentsByUserOptions') ;

        close() ;

    }

    // function open () {
    //     $('#homeDisplayProjectModal').modal() ;
    // }
    function close (){
        $('#homeDisplayProjectModal').modal("hide") ;
        for(const row of cFormatedList.value) {
            row.is_target_apply = row.target_value == "1" ? true : false ;
        }
    }


</script>


<script lang="ts">
export default {
    methods : {
        /**
         * optionApiからの$refはoptionApiのやつしか見てくれない
         * homeがCompositionAPIになれば消します
         */
        open : function () {
            $('#homeDisplayProjectModal').modal() ;

        }
    }
}
</script>