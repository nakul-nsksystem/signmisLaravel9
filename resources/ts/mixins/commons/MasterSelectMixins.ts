import Vue from "vue"
import MasterUtil from "../../frameworks/MasterRefUtil" ;

export default Vue.extend ({
    data : function() {
        return {
            dLocalSelectedId : 0 ,
        }

    } ,
    props : {

        value :
        {
            type : Number ,
        } ,
        placeholder : {
            type : String ,
            default : () => "" ,
        } ,
        setId : {
            type : Number
        } ,
        // 選択されていない場合のみ値が入る
        setIdIfEmpty : {
            type : Number
        } ,
        // 選択肢が1件のみの場合強制選択
        isSelectIfListIsOne : {
            type : Boolean ,
            default : true

        }  ,
        inputClass : {
            type : Object ,
            default : () => {}
        }

    } ,
    watch : {

        value :
        {
            immediate: true,
            handler : function (newVal, oldVal) {
                if ( newVal !== undefined )
                {
                    if ( newVal !== null) {
                        if (oldVal !== undefined && oldVal !== null && newVal.toString() == oldVal.toString()) return ;
                        this.dLocalSelectedId = newVal ;
                    } else {
                        this.dLocalSelectedId = 0 ;
                    }
                }
            }
        } ,

        setId : {
            immediate: true,
            handler : MasterUtil.setId ,
        }  ,
        setIdIfEmpty : {
            immediate: false,
            handler : MasterUtil.setIdIfEmpty ,
        }
    } ,
    computed : {
        /*
        localSelectedId : {
            get : function() {
                return this.value ;
            } ,
            set : function(val:Number ) {
                this.emitSelectedId(val) ;
            } ,
        }
        */
    } ,
    methods: {
        // エラーをコンソールに出力
        changed : function (event:Event) {

            // @ts-ignore
            const id = Number(event.target.value) ;
            this.emitSelectedId(id) ;
            this.$emit('change', id) ;

        } ,
        emitSelectedId : function(id:Number)
        {
            this.$emit('input', id) ;
            this.emitSelectedItem(id) ;

        } ,
        emitSelectedItem : function(id:Number){
            throw 'Not implement emitSelectedItem !' ;
        } ,

    },
 });