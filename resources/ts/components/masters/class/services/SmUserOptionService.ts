import axios from "axios";
import _, { result } from "lodash";
import { MUserOption } from "../models/MUserOption";
import { SmUserOption } from "../models/SmUserOption";
import { useStore } from "../../../../stores/mainStore";
import { useMasterStore } from "../../../../stores/masterStore";
import { TProject } from "../../../tProjects/class/models/TProject";


export class SmUserOptionService{

    constructor() {}
    protected static ep:string = "api/smUserOption/"  ; 
    protected static tProjectEp:string = "api/tProject/"  ; 


    /**
     * 
     * @param dataArg ユーザー、個別オプション（storeにある全情報）
     * @param searchParams retrieveに送るパラメーター
     * @returns 
     */
    public static setDefVal2SearchParams (application:string ,searchParams:any) {
        
        const mainStore = useStore() ;

        const user = mainStore.loginMUser

        const userOptions = this.getUserPersonalOptions('search') ;        
        //検索項目系の初期値設定を反映する
        for(const op of userOptions) {
            //@ts-ignore
            if( op.value == "1" && op.sm_user_option.application == application ) {

                // const targetCol = op.sm_user_option?.option_02 ;
                // const userCol = op.sm_user_option?.option_03 ;
                
                if(op.sm_user_option?.option_02 === undefined || op.sm_user_option?.option_03 === undefined) continue ;
                
                const targetJson = JSON.parse(op.sm_user_option.option_02)
                const userColJson = JSON.parse(op.sm_user_option.option_03)
                // console.log(targetJson)
                // console.log(userColJson)

                let index:number = 0 ;
                
                for(const targetCol of targetJson) {
                    //sm_user_optionsのoption_02に.で分割する
                    const colArr = targetCol.split('.') ;
                    const lastIdx = colArr.length -1  ;

                    const userCol = userColJson[index] ;
                    
                    // console.log(userCol)
                    //ログインユーザーの該当カラムから情報を.つなぎで再帰的にセットする
                    //@ts-ignore
                    colArr.reduce((current,key,index)=>{
                        //最後のループの場合値セット
                        if( index == lastIdx ) {
                            //@ts-ignore
                            current[key] = user[userCol] ;
                            return ;
                        }
                        if(current[key]!==undefined) return current[key] ;
                    
                    }, searchParams)

                    index ++ ;
                    
                }
                
                

            }
        }

        return ;

    }

    /**
     * ユーザーの個別オプションの検索項目を取得する
     * 未設定の場合は初期値をセットする
     * @returns 
     */
    public static getUserPersonalOptions (key:string):Array<MUserOption> {

        const mainStore = useStore()
        const masterStore = useMasterStore()

        const user = mainStore.loginMUser;
        const options = masterStore.SmUserOptions;
        
        //@ts-ignore
        const userOption = user.m_user_options.filter( x => x.sm_user_option.key_m_kv.g_01 == key) ;
        //@ts-ignore
        const optionIds = userOption.map( x => x.sm_user_option_id ) ;
        //@ts-ignore
        const newOptions = options.filter( x => optionIds.indexOf(x.id) == -1 && x.key_m_kv.g_01 == key) ;


        for(const option of newOptions) {
            
            userOption.push({
                m_user_id : user?.id ,
                sm_user_option_id : option.id ,
                sm_user_option : option ,
                value : option.default_value ,
                // is_apply : option.default_value == "1" ? 1 : 0 ,
            })
        
        }

        return userOption ;

    }


    /**
     * kvKeyからuserOption配列を取得
     * @param g01
     */
    public static getSmUserOptionByMKvKey (g01:string) {

        const masterStore = useMasterStore() ;

        const mKvCats = masterStore.getMKvCategoryByKey('m_user_option-key');
        const mKvId = mKvCats?.m_kvs.find( mKv => mKv.g_01 == g01)?.id ;

        if(_.isNil(mKvId)) return [] 
        const userOptions = masterStore.SmUserOptions.filter(userOption => userOption.key_m_kv_id == mKvId );
        
        return userOptions ?? [] ;

    }

    /**
     * userの個別設定を取得
     * application
     * @param kvKey m_kv.g_01
     * @param application アプリケーション名
     * @param isTarget 参照target_sm_user_idから取得するか
     */
    public static getUserOptionsByAppName (kvKey:string ,application:string ,isTarget:boolean=false) {
        
        const mainStore = useStore();

        const user = mainStore.loginMUser;
        const option = this.getSmUserOptionByMKvKey(kvKey).find(x => x.application == application);

        const idColName = isTarget ? 'target_sm_user_option_id' : 'id' ;
        //@ts-ignore
        const result = user.m_user_options.filter( x => x.sm_user_option_id == option[idColName]) ;
        
        // //@ts-ignore
        // for(const row of result) {
        //     row.is_apply = row.target_value == "1" ? true : false 
        // }
        // result.m_user_options.is_apply = option[idColName] == "1" ? true : false ;

        return result ;

    }



    
    /**
     * 取得
     * @param  
     * @returns 
     */
    public static async getTProjectsBySmUserOption( options:MUserOption ):Promise<any>{
        return new Promise(async (resolve,reject) => {     
            
            const apiUrl = `${this.tProjectEp}findBySmUserOptions` ; 
            try { 
                
                const result = [];
                const res = await axios.post(apiUrl,options) ; 

                for(const obj of res.data) {

                    const arr = [] ;

                    for(const key of Object.keys(obj) ) {
                        if(key == "option_name" || key ==  "m_user_option_id" || key ==  "order_no") continue ;
                        const parsed = TProject.parse(obj[key])
                        arr.push(parsed) ;
                    }

                    // const parsed = arr.map( x => TProject.parse(x)) ;
                    
                    //検索保存名と重複回避用のidをparse後に設定
                    //@ts-ignore
                    arr.option_name = obj.option_name ;
                    //@ts-ignore
                    arr.m_user_option_id = obj.m_user_option_id ;
                    //@ts-ignore
                    arr.order_no = obj.order_no ;

                    //@ts-ignore
                    // console.log(obj.order_no,obj.option_name)
                    result.push(arr) ;
                }
                resolve(result) ; 
    
            }            
            catch (error ) {            
                // @ts-ignore    
                error.tProjectEp = apiUrl ; 
                reject(error) ; 
            }
            

            
        }) ; 
    }

    /**
     * reactiveの特定パラメータの初期値を設定する vue3用
     * @param  
     * @returns 
     */
    public static setDefVal2State (application:string ,state:any) {
        const mainStore = useStore() ;
        const userOptions = this.getUserPersonalOptions('default') ;
        
        for(const op of userOptions) {
            //@ts-ignore
            if( op.value == "1" && op.sm_user_option.application == application ) {

                if(op.sm_user_option?.option_02 === undefined) continue ;
                
                const targetJson = JSON.parse(op.sm_user_option.option_02)

                let index:number = 0 ;
                

                //typeによる正規の値に変更
                let regularVal : any = op.value ;

                if(op.sm_user_option.option_01 == 'boolean') {
                    regularVal = !_.isNil(op.value)
                }
                else if (op.sm_user_option.option_01 == 'string'){
                    regularVal = op.value
                }
                else if (op.sm_user_option.option_01 == 'number'){
                    regularVal = parseFloat(op.value)
                }


                for(const targetCol of targetJson) {
                    //sm_user_optionsのoption_02に.で分割する
                    const colArr = targetCol.split('.') ;
                    const lastIdx = colArr.length -1  ;

                    // console.log(userCol)
                    //ログインユーザーの該当カラムから情報を.つなぎで再帰的にセットする
                    //@ts-ignore
                    colArr.reduce((current,key,index)=>{
                        //最後のループの場合値セット
                        if( index == lastIdx ) {
                            current[key] = regularVal ;
                            return ;
                        }
                        if(current[key]!==undefined) return current[key] ;
                    
                    }, state)

                    index ++ ;
                    
                }
            }
        } 
    }


}
