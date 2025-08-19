
/**
 * 分割方式
 */
const ProductSepareteWays = { 

    /**
     * 均等割
     */
    PerCapitaRate : 1 , 

    /**
     * 指定(入力)
     */
    Input  : 2  , 

} as const ;
type ProductSepareteWays = typeof ProductSepareteWays[keyof typeof ProductSepareteWays] ; 


/**
 * 分割方向
 */
 const ProductSepareteSides = { 
    W : "W" , 
    H : "H"  , 

} as const ;
type ProductSepareteSides = typeof ProductSepareteSides[keyof typeof ProductSepareteSides] ; 



export  {
    ProductSepareteWays ,
    ProductSepareteSides , 
} ; 
