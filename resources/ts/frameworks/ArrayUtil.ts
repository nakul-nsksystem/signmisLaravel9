export default {
    /**
     * 既に配列に存在する場合は削除、存在しない場合は追加
     * @param arr
     * @param val
     * @returns
     */
    switchDelInsByExists : function (arr:Array<any> ,val:any){
        if ( arr === undefined || val === undefined ) return ;

        const idx = arr.indexOf(val) ;
        if (  idx === -1 ) {
            // 追加
            arr.push(val) ;
        }
        else {
            // 削除
            arr.splice(idx , 1 ) ;
        }

    }  ,

    /**
     * 配列0にして追加
     * @param arr 元の配列
     * @param insItems 追加するItemの配列
     */
    resetInsert : function (arr:Array<any>, insItems:Array<any>) {
        arr.splice(0 , arr.length , ...insItems) ;


    }
}