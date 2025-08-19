<template>
    <div>
        <nav>
            <ul class="nav nav-tabs navbar-dark border-bottom-0" id="point-nav-category">
                <li class="nav-item" v-for="key in cMUserIds" :key="key">
                    <a class="nav-link" :class="{ 'active': key == cFirstSelectedId }" :id="key" data-toggle="tab"
                        :href="`#nav-cat-${key}`" role="tab" :aria-controls="key"
                        :aria-selected="key == cFirstSelectedId">
                        <i class="fas fa-user fa-fw pr-2"></i>{{ cUserName(key) }}
                    </a>
                </li>
            </ul>
        </nav>
        <div class="tab-content" id="nav-tabContent">
            <div v-for="key in cMUserIds" :key="key" class="tab-pane fade show"
                :class="{ 'active': key == cFirstSelectedId }" :id="`nav-cat-${key}`" role="tabpanel"
                :aria-labelledby="key">
                <div class="row">
                    <div class="col-12">
                        <div class="p-3 bg-app-secondaly">
                            <div class="table-responsive">
                                <table class="table table-striped table-dark text-nowrap">
                                    <thead>
                                        <tr @click.prevent="sort">
                                            <th class="text-center">日付</th>
                                            <th>区分</th>
                                            <th>物件名</th>
                                            <th class="text-right">ポイント</th>
                                            <th>備考</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="n in cList[key]">
                                            <td>{{ cDateFormat(n.changed_at) }}</td>
                                            <td>{{ n.t_project_name }} - {{ n.details }}</td>
                                            <td class="text-right">{{ cToNumber(n.total_pt) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import _, { isEmpty } from "lodash";
import axios from 'axios';
import { computed, getCurrentInstance, reactive, ref } from 'vue';
import ArrayUtil from "../../../frameworks/ArrayUtil";

import { useStore } from '../../../stores/mainStore';
import { useMasterStore } from "../../../stores/masterStore";
import { signmisReportComposition } from "../../reports/compositions/signmisReportComposition"
import { TUserPoint } from "../models/TUserPoint";
const store = useStore();
const masterStore = useMasterStore();
const _this = getCurrentInstance()?.proxy;

const { cDateFormat, cToNumber, cSummary, cTermAlert, getCalcedMonth } = signmisReportComposition();

type TpMasterSelect = {
    ids: number[],
    setIds?: number[],
    key?: string,
}

interface IProps {
    userIds?: number[],
    firstSelectedId?: number
    list: TUserPointList,
    loading: boolean
}
const props = withDefaults(defineProps<IProps>(), {
    firstSelectedId: undefined,
    loading: false
})

interface IEmits {
    (e: 'search'): void
    (e: 'clear'): void
}

type TUserPointList = {
    [userId: string]: any[]
}

const emit = defineEmits<IEmits>();

const users = reactive<TpMasterSelect>({
    ids: []
})

const cMUserIds = computed({
    get: () => users.ids,
    set: (v) => {
        users.ids = v
        getByMUserId()
    }
})

const cList = computed(() => props.list);
const cFirstSelectedId = computed(() => props.firstSelectedId);

//ソート
function sort(event: any) {

    // const key: string | undefined = event.target.id

    // if (_.isNil(key) || _.isEmpty(cList)) return;

    // if (!event.target.id) return;

    // // クリックした列をソートキーに保存
    // if (conditions.sort == event.target.id) {
    //     conditions.sort = event.target.id + " desc";
    // } else {
    //     conditions.sort = event.target.id;
    // }

    // // 再検索
    // if (state.list.length) getData();
}


// const cSalesCompleteDayFrom = computed({
//     get: () => cConditions.value.sales_completed_at_from,
//     set: (val) => {
//         if (_.isEmpty(cConditions.value.sales_completed_at_to)) {
//             cConditions.value.sales_completed_at_to = getCalcedMonth(val, 1);
//         }
//         cConditions.value.sales_completed_at_from = val;
//     }
// })

const cUserName = computed(() => (id: number) => {
    return masterStore.getMUserById(id)?.full_name ?? "";
})

const getByMUserId = async () => {
    if (isEmpty(cMUserIds.value)) return;

    let ep = 'api/tUserPoint/getByMUserId';

    try {
        const exitstsIds = Object.keys(props.list)
        const addedUserId = cMUserIds.value.find(x => !exitstsIds.includes(String(x)));
        setFirstSelectId()

        if (addedUserId) {

            props.loading = true;

            const res = await axios.get(`${ep}/${addedUserId}`);
            const parsed = res.data.map((x: any) => TUserPoint.parse(x));
            props.list[addedUserId] = [];

            for (const row of parsed) {
                const found = row.getResultsByUserId(addedUserId)
                if (found) {
                    props.list[addedUserId].push(found);
                }
            }
        }
        else {
        }


    }
    catch (error) {
        //@ts-ignore
        _this.$$errorConsole(error, ep);
    }
    finally {
        props.loading = false
    }

}

const setFirstSelectId = () => {

    //初回または1Userしか選択されていない場合
    if (cMUserIds.value.length == 1) {
        props.firstSelectedId = cMUserIds.value[0];
    }
    //全てのユーザーの選択が解除された場合
    else if (cMUserIds.value.length == 0) {
        //props.firstSelectedId = undefined;
    }
    //初回選択のUserが選択解除された場合
    else if (props.firstSelectedId && !cMUserIds.value.includes(props.firstSelectedId)) {
        props.firstSelectedId = cMUserIds.value[0];
    }
}


</script>
