export default {
    data : function() {
        return {
        }
    } ,
    computed : {
    } ,
    methods : {
        // 現在のパスがカスタムヘッダーかの判定
        $$emitIsCustomHeader : function ()
        {
            let isCustomHeader : boolean = false ;

            // @ts-ignore
            isCustomHeader = this.$route === undefined ?
                false :
                // @ts-ignore
                ( this.$route.meta === undefined ?
                    false :
                    // @ts-ignore
                    this.$route.meta.isCustomHeader !== undefined
                ) ;

            // @ts-ignore
            // if ( this.$route !== undefined) {
            //     // @ts-ignore
            //     isCustomHeader = this.$route.meta.isCustomHeader === undefined ?
            //         false :
            //         // @ts-ignore
            //         this.$route.meta.isCustomHeader !== undefined ;
            // }

            // @ts-ignore
            this.$emit('update:is-custom-header', isCustomHeader) ;
        } ,
    } ,
    created : function() {
        // @ts-ignore
        this.$$emitIsCustomHeader() ;
    }
 }