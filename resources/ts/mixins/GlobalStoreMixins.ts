import { mapStores } from "pinia";
import { useStore } from "../stores/mainStore";
import { useMasterStore } from "../stores/masterStore";
import { useDropboxStore } from "../stores/dropboxStore";
import { useSsStore } from "../stores/smartshopStore";
import dayjs, { Dayjs } from "dayjs";
import _ from "lodash" ;

//optionApiでstoreを使うためのmixIn

//main => this.mainStore
//master => this.mainStore.masters or this.mainStore
//dropbox => this.dropboxStore

export default {
    data :  function() {
        return {
        }
    } ,
    computed : {
        ...mapStores(useStore,useMasterStore,useDropboxStore,useSsStore)
    } ,
    methods: {
    },
    created : function()
    {
        // @ts-ignore
        //this.$$emitIsCustomHeader() ;
    }
}