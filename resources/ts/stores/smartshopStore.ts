import { defineStore } from "pinia"
import { TProject } from '../components/tProjects/class/models/TProject';

interface State {
    ssData:TProject|undefined,
}

export const useSsStore = defineStore("ss", {
    
    state: () :State => ({
        //連携するSsデータを保持する
        ssData : undefined
    }),
    getters: {

    },

    actions: {
        setSsDataAction( tProject:TProject|undefined) {
            this.ssData = tProject ;
        },

    }
})

