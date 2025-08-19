<template>
    <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text">
                <i class="fas fa-search-plus" />
            </span>
        </div>

        <input type="text" 
            class="form-control dropdown-toggle" 
            :class="inputClass"
            :placeholder="cPlaceholder" 
            :disabled="disabled"
            v-model="name" 
            @click.prevent="toggleList"
            @blur.prevent="blur"
            @keyup.enter.prevent.self="keyEnter"
            @keyup.up.prevent="keyUpdown(true)"
            @keyup.down.prevent="keyUpdown(false)"
        >

        <div v-if="isOpen" class="m-customer-rel-input-list w-100">
            <ul class="list-group w-100 position-absolute">
                <a href="#" class="list-group-item list-group-item-action" v-for="(n, index) in dList" :key="n.id"
                    :class="{active:isActive(index)}"
                    @click.prevent="selectItem(n)" 
                >
                {{ n.name }}
                </a>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data : function () {
        return {
            dLocalSelectedId : 0 ,
            // 結果格納
            dList : [] ,
            // ListOpenしてるかどうか
            isOpen : false ,
            // 上下キー用
            dCurrentIndex : -1  ,
            // Pgから入力された場合イベントキャンセル用
            isSetNameFromPg : false , 
            // 入力された名前の一部
            name : "" ,
            // 連続入力された場合のCancelToken
            cancelSource : false ,
            // 選択された取引先データ
            selectedItem : null ,
        } 
    } , 
    props : {
        value : 
        {
            type : Number ,
        } , 
        mBranchId : {
            type : Number ,
            default : () => 0 , 
        } ,
        dealingCds : {
            // 取引区分 1:売 2:買 4:外注先 8:納品先
            type : Array ,
            required : true ,
        } ,
        setId : {
        } , 
        inputClass : {
            type : Object ,
            default : () => {}
        } ,
        disabled : {
            type : Boolean ,
            default : false ,
        } ,
    } , 
    watch : {
        value : {
            immediate : true ,
            handler : function (newVal, oldVal) {
                if (newVal !== undefined) {
                    if (newVal !== null) {
                        if (oldVal !== undefined && oldVal !== null && newVal.toString() == oldVal.toString()) return;
                        this.dLocalSelectedId = newVal;
                        
                        if ( this.dLocalSelectedId !== 0 ) {
                            this.getDataById(this.dLocalSelectedId) ;
                        }
                    } else {
                        this.dLocalSelectedId = 0;
                    }

                    // 入力値(name)の内容をクリア
                    if (!this.dLocalSelectedId) {
                        this.name = "" ;
                    }
                }
            }
        } ,
        mBranchId : {
            immediate : true ,
            handler : function (newVal, oldVal) {
                if (newVal !== undefined) {
                    if (oldVal !== undefined && oldVal != 0) {
                        // @ts-ignore                        
                        //this.emitSelectedId(0) ;
                        //console.log("newVal" + newVal) ;
                        this.emitItem({ id : 0, sales_m_user_id : 0 }) ; 
                    }
                }
            } ,
        } ,
        // 入力値の変更時
        name : async function (input) {
            // console.log("input=" + input + " isSetNameFromPg = " + this.isSetNameFromPg) ;
            this.getList() ;
        } ,
        isOpen : function (val) {
            if (!val) {
                this.isSetNameFromPg = false ;
                this.dCurrentIndex = -1 ;
            }
        }
    } , 
    computed : {
        cDealingMKvIds : function () {
            if (this.dealingCds === undefined) return [] ;

            const rtn = this.dealingCds.map(x => x + 1010000) ;
            return rtn ;
        } ,
        cPlaceholder : function () {
            let placeholder = "" ;
            
            // 取引区分(配列)を参照してplaceholderを設定
            this.dealingCds.forEach(item => {
                if (item == 1) {
                    placeholder += "顧客 " ;
                } else if (item == 2) {
                    placeholder += "仕入先 " ;
                } else if (item == 4) {
                    placeholder += "外注先 " ;
                } else if (item == 8) {
                    placeholder += "納品先 " ;
                }
            });

            // 何も設定してない時のデフォルト値
            if (!placeholder) placeholder = "顧客 "

            return placeholder.trim() ;
        } ,
        cSelectedIndex : function () {
            if (this.dCurrentIndex < -1 || this.dList.length === 0) {
                return -1 ;
            } else if (this.dCurrentIndex >= this.dList.length) {
                return this.dCurrentIndex  = this.dList.length - 1 ;
            } else {
                return this.dCurrentIndex ;
            }
        } ,
        cSelectedItem : function () {
            if (this.cSelectedIndex === -1) return {} ;
            return this.dList[this.cSelectedIndex] ;
        } ,
        cGetCustomerEp : function() {
            let url = `api/mCustomer/${this.dLocalSelectedId}` ;
            return url
        }
    } ,
    methods : {
        toggleList : function () {
            if (! this.name) return ;
            this.isOpen = ! this.isOpen ;
        } ,
        blur : function () {
            setTimeout(() => {
                this.isOpen = false ;
            } , 300) ;
        } , 
        keyUpdown : function (isUp) {
            if (!this.isOpen) return ;

            this.dCurrentIndex += isUp ? -1 : +1 ;
            this.dCurrentIndex = this.cSelectedIndex ;
            //console.log("dCurrentIndex = " + this.dCurrentIndex + " cSelectedIndex = " + this.cSelectedIndex) ;
        } ,
        keyEnter : function () {
            if (this.cSelectedIndex !== -1) {
                // 決定
                this.selectItemByIndex(this.cSelectedIndex) ;
            }
        } , 
        isActive : function (index) {
            return this.dCurrentIndex === index ;
        } , 
        selectItemByIndex : function(index) {
            this.selectItem(this.dList[index]) ;
        } ,
        selectItem : function (item) {
            this.dCurrentIndex = this.dList.indexOf(item) ;
            //console.log(index) ;
            // console.log(item) ;
            this.isSetNameFromPg = true;
            // 名称
            this.name = item.name ;
            this.isOpen = false ;
            //console.log(this.cSelectedItem.sales_m_user_id ) ;

            // @ts-ignore                        
            //console.log(item.id) ;
            //this.$emit('change', item.id) ;
            this.emitItem(item) ;
        } , 
        cancelRequest : function () {
            if (this.cancelSource !== false) this.cancelSource('Continuous requests.') ;
        } ,
        emitItem : function (item) {
            if (this.name != (item.name ?? "") ){
                this.isSetNameFromPg = true ;
            }
            this.name = item.name ?? "";

            this.$emit('input', item.id) ;
            this.$emit('update:selected-item', item) ;
            this.$emit('update:sales-m_user-id', item.sales_m_user_id) ;
        } ,
        getDataById : async function () {
            try {
                const _this = this ;
                const res = await axios.get(this.cGetCustomerEp) ;

                this.emitItem(res.data) ;
            }
            catch (error) {
                // handle error
                this.$$errorConsole(error, this.cGetCustomerEp) ;
            }
        } ,
        getList : async function() {
            //console.log("getList") ;
            this.cancelRequest() ;

            let input = this.name ;
            if (!input || this.isSetNameFromPg) {
                this.isSetNameFromPg = false ;
                this.isOpen = false ;
                this.dList.length = 0 ;

                if (!input) {
                    // 未入力時は0にする
                    this.emitItem({ id : 0, sales_m_user_id : 0 }) ;
                }
            } else {
                this.dCurrentIndex = -1 ;
                let url = `api/mCustomer/fBaN/${this.mBranchId}/${this.cDealingMKvIds}/` ;
                url += input ;
                //console.log(url) ;

                try {
                    const _this = this ;
                    const res = await axios.get(url , {
                        cancelToken: new axios.CancelToken(function executor(c) {
                            _this.cancelSource = c ;
                        }) ,
                    });
                    
                    this.isOpen = res.data.length !== 0;
                    this.dList = res.data;
                } catch (error) {
                    // handle error
                    if (axios.isCancel(error)) {
                        console.log('Request canceled', error.message) ;
                    } else {
                        this.$$errorConsole(error, this.url) ;
                    }                    
                }
            }
        }
    } ,
    created : function () {
    } , 
}

</script>   
<style scoped>
.m-customer-rel-input-list {
    z-index: 10001 ;
}
.input-group-text {
    background-color: white ;
}
.list-group-item{
    color: black !important;
}
</style>
