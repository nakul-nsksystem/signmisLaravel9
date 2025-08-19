<template>
    <div class="card bg-dark home-card">
        <div class="card-header text-center home-card">
            <div>{{props.title}}</div>
        </div>
        <div v-if="props.tProject.length > 0 " class="table-responsive">
            <table class="table table-striped table-dark mb-0">
                <thead>
                    <tr>
                        <th style="width:110px" >納期</th>
                        <th style="width:100px" >物件cd</th>
                        <th style="min-width:" scope="col">物件名</th>
                        <th style="min-width:" scope="col">クライアント名</th>
                        <th style="width:70px" v-if="cIsAbleToEstApprove">利益率</th>
                        <th style="width:60px">状態</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="n in props.tProject" :key="n.id">
                        <td><div v-if="n.min_delivery">{{dateFormat(n.min_delivery.delivery_at)}}</div></td>
                        <td>{{n.cd}}</td>
                        <td><a :href='"v#/t_project/edit/"+n.id'>{{n.name}}</a></td>
                        <td>{{n.m_customer.short_name_or_name}}</td>
                        <td v-if="cIsAbleToEstApprove">
                            <div class="text-right text-nowrap" 
                                :class="{'text-danger':!cIsOkProfitPer(n)} " 
                                data-container="body"
                                data-toggle="popover" 
                                data-trigger="hover" 
                                data-placement="right" 
                                :data-content="n.internal_quotation_memo"
                                popover-name="estpop"
                                >{{cNum(n.profit_per)}}%
                                <i class="fas fa-exclamation-circle fa-fw" 
                                    v-if="!_.isEmpty(n.internal_quotation_memo)"/>
                                <span v-else>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>

                            </div>
                        </td>
                        <td :class="n.StateClass">{{ n.StateName }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Vue, { ref,computed } from 'vue';
import { TProject } from '../../tProjects/class/models/TProject';
import _ from 'lodash'
import DayJsEx from "../../../frameworks/DayJsEx" ;
import NumberUtil from '../../../frameworks/NumberUtil';
import { useStore } from '../../../stores/mainStore';
import { useMasterStore } from '../../../stores/masterStore';
    
    interface IProps {
        tProject?: Array<TProject> ,
        title?:string
    }

    const props = withDefaults(defineProps<IProps>(), {
        title : ""
    })

    const store = useStore() ;
    const masterStore = useMasterStore() ;

    function dateFormat(value:Date){
        if(_.isNil(value)) return "" ;
        return DayJsEx.format(value , "YYYY-MM-DD")
    }

    //承認可能な権限所持フラグ
    const cIsAbleToEstApprove = computed(() => {
        const val = NumberUtil.invalid2zr(store.getRole("t_project-estimate-approve")) ;
        return val >= 10 ;
    }) ;

    const cIsOkProfitPer = computed(() => {
        return function(val:TProject) {
            const smMinProfit = masterStore.getSMOptionValByKeyMKvId(8010301) ?? 0 ;
            if(smMinProfit < val.profit_per) return true ;
            return !_.isNil(val.est_approved_at)
        }
    }) 

    const cNum = computed(() => {
        return function(val:number) {
            return NumberUtil.round(val,1) ;
        }
    }) 

    

</script>