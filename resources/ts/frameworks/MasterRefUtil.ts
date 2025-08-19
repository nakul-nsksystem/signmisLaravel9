export default {
    // 外部から選択肢がかわるような設定がされた場合にIDをクリア用( Watch用 )
    // @ts-ignore
    clearSelectedValue : function (newVal, oldVal)
        {
            //console.log("new:" + newVal + " old:" + oldVal) ;
            if (newVal !== undefined)
            {
                if (oldVal !== undefined && oldVal != 0)
                {
                    // @ts-ignore
                    this.emitSelectedId(0) ;
                }
            }
        }   ,

    // 外部から新規IDを設定する用( Watch用 )
    // @ts-ignore
    setId : function (newVal, oldVal)
        {
            //console.log("new:" + newVal + " old:" + oldVal) ;
            if (newVal !== undefined)
            {
                // @ts-ignore
                this.dLocalSelectedId = newVal ;
                // @ts-ignore
                this.emitSelectedId(newVal) ;
            }
        }   ,
    // 選択されていない場合、外部から新規IDを設定する用( Watch用 )
    // @ts-ignore
    setIdIfEmpty : function (newVal, oldVal) {
        if (newVal !== undefined)
        {
            if (oldVal !== undefined && newVal.toString() == oldVal.toString()) return ;

            //console.log(this.localSelectedId + ":" + newVal) ;
            // @ts-ignore
            if (this.dLocalSelectedId === 0 )
            {
                // @ts-ignore
                this.dLocalSelectedId = newVal ;
                // @ts-ignore
                this.$emit("change" , newVal) ;
                // @ts-ignore
                this.emitSelectedId(newVal ) ;

            }
        }
    }
}
