export default {
    // クラス名からクラスを生成
    getClassByName : function(classname:string){
        return Function('return (' + classname + ')')() ;
    } ,

    getClassByNameEval : function(classname:string){
        return eval(classname) ;
    }
}