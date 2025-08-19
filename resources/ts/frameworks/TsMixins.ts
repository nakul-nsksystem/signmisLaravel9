

export type TsMixinConstructor<T = {}> = new (...args: any[]) => T;

export function applyTsMixins(derivedCtor: any, constructors: any[]) {
    derivedCtor._mixins = constructors ;
    // console.log(constructors) ;
    constructors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            Object.defineProperty(
                derivedCtor,
                name,
                Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
                Object.create(null)
        ) ;
      }) ;
    }) ;

    return derivedCtor ;
}