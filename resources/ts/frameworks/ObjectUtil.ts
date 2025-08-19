export default {
    /**
     * NullもしくはUndefined
     * @param val 値
     * @returns true:NullもしくはUndefined  false: それ以外
     */
    isNullOrUndefined : function (val:any):boolean
    {
        return (val === undefined || val === null) ;
    } ,

    /**
     * NullもしくはUndefined ( isNullOrUndefined のショートカット)
     * @param val 値
     * @returns true:NullもしくはUndefined  false: それ以外
     */
    isNU : function (val:any):boolean
    {
        return this.isNullOrUndefined(val) ;
    } ,

    /**
     * 空文字、NullもしくはUndefined
     * @param val 値
     * @returns true:空文字、NullもしくはUndefined  false: それ以外
     */
     isNUE : function (val:string):boolean
     {
         return this.isNU(val) || val.length === 0 ;
     } ,

    /**
     * valがNullもしくはUndefinedの場合、toを返す
     * ToDo：function名が長いので物件系で使用している所をリファクタ(nullOrUndefinedTo → nu2)してください
     *       リファクタ後にfunctionはコメントします
     * @param val
     * @param to
     * @returns
     */
    nullOrUndefinedTo : function(val:Object, to:Object) {
        return this.isNullOrUndefined(val) ? to : val ;
    } ,

    /**
     * valがNullもしくはUndefinedの場合、toを返す
     * @param val
     * @param to
     * @returns
     */
    nu2 : function(val:Object, to:Object) {
        return this.isNullOrUndefined(val) ? to : val ;
    } ,

    /**
     * valがNullもしくはUndefinedの場合、空文字を返す
     * @param val
     * @returns
     */
    nu2ec : function(val:Object):string {
        return this.nu2(val, "").toString() ;
    } ,

    /**
     * valがNullもしくはUndefinedの場合、0を返す
     * @param val
     * @returns
     */
    nu2zr : function(val:Object):number {
        return Number(this.nu2(val, 0)) ;
    } ,

    /**
     * JsonStringfy等によるDeepCopy
     * @param val
     * @returns
     */
    deepCopyJ : function (val:Object):Object
    {
        return JSON.parse(JSON.stringify(val)) ;
    } ,

    /**
     * Object.assignによるDeepCopy
     * @param val
     * @returns
     */
     deepCopyOA : function (val:Object):Object
     {
         return  Object.assign({},val);;
     } ,

    getProperties : function(val:object):Array<string>{
        const props = [] ;
        for(const key in val){
            props.push(key) ;
        }
        return props ;
    } ,

    getPropertiesWoFunction : function(val:object):Array<string>{
        const props = [] ;
        for(const key in val){
            // @ts-ignore
            const tp = typeof val[key]  ;
            if (tp !== "function" ) props.push(key) ;
        }
        return props ;
    } ,

    getGetters : function(val:object):Array<string>{
        // console.log(Object.getOwnPropertyNames(val)) ;
        const proto = Object.getPrototypeOf(val) ;
        // console.log(proto) ;
        const names = Object.getOwnPropertyNames(proto) ;
        const getters = names.filter(x => {
            const descriptor = Object.getOwnPropertyDescriptor(proto, x) ;
            // @ts-ignore
            return descriptor.get instanceof Function && x !== '__proto__' ;
        })

        return getters ;
    } ,




    /**
     * valのcolPrefixから始まるカラムを削除し削除後のObjectを返す
     * @param val
     * @param colPrefix
     * @returns
     */
     trimColumnsByPrefix(val:object ,colPrefix:string) {
        if ( val === undefined ) return val ;

        const keys = Object.keys(val) ;

        for ( let i = 0 ;i < keys.length ;i ++ ) {
            const key = keys[i] ;

            if ( key.slice(0 ,colPrefix.length) === colPrefix ){
                //@ts-ignore
                delete val[key] ;
            }
        }

        return val ;

    } ,

}
