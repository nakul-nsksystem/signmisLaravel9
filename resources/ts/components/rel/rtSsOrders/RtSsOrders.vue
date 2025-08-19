<template>
    <div>
        <div class="row pb-3">
            <div class="col-12">
                <div v-if="$$cIsError" class="alert alert-danger" role="alert">
                    {{dErrorData.message}}
                </div>
            </div>
        </div>

        <div class="row mb-3">
            <div class="col-12 col-xl-4">
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="注文番号から直接検索" aria-describedby="button-addon2" v-model="state.order_no">
                    <div class="input-group-append">
                        <button class="btn btn-secondary" @click.prevent="getJsonByXml(state.order_no,true)" :disabled="cLoading">
                            <i class="fas fa-search fa-fw"></i>                            
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-12 col-xl-8 text-right">
                <button type="button" class="btn btn-success w-auto" id="button-addon2" @click.prevent="search" :disabled="state.loading4Search || cLoading" >
                    <div v-if="state.loading4Search">
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        取得中...
                    </div>
                    <div v-else>
                        <i class="fas fa-search fa-fw"></i>
                        一覧取得
                    </div>
                </button>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="table-responsive">
                    <table class="table table-striped table-dark text-nowrap mb-0">
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">注文番号</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="n in state.list">
                                <td>
                                    <button type="button" class="btn btn-secondary" @click.prevent="getJsonByXml(n.order_no,true)" :disabled="cLoading" title="詳細確認">
                                        <i class="fas fa-eye fa-fw"></i>
                                    </button>
                                    <!-- <button type="button" class="btn btn-primary" @click.prevent="mapTProject(n,true)" :disabled="cLoading" title="物件連携">
                                        <i class="fas fa-file-import fa-fw"></i>                            
                                    </button> -->
                                </td>
                                <td>{{n.order_no}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <RtSsOrderInfoModal
            v-model="state.orderInfo"
            ref="modalRef"
            @mapTProject="mapTProject"
            />
        
        <transition name="fade">
            <div class="preview-wrap" v-show="cLoading">
    
                <div class="position-absolute spinner-area vh-100 d-flex justify-content-center align-items-center" style="left:50%;">
                    <span class="spinner-border text-primary" style="opacity:1" />
                </div>

            </div>
        </transition>

        
    </div>
</template>

<script lang="ts" setup>
    import Vue, { ref,computed, getCurrentInstance, reactive,onMounted } from 'vue';
    import { TProject } from '../../tProjects/class/models/TProject';
    import { TProjectProduct } from '../../tProjects/class/models/TProjectProduct';
    import { TProjectDelivery } from '../../tProjects/class/models/TProjectDelivery';
    import { useStore } from '../../../stores/mainStore'
    import { useMasterStore } from '../../../stores/masterStore';
    import { useSsStore } from '../../../stores/smartshopStore';
    import { useRoute, useRouter } from '../../../routers/routerPlugin';
    import _, { indexOf } from 'lodash'
    import axios from 'axios';
    import DayJsEx from "../../../frameworks/DayJsEx" ;
    import NumberUtil from '../../../frameworks/NumberUtil'
    import RtSsOrdersConst from './consts/RtSsOrdersConst'
    import { useDropboxStore } from '../../../stores/dropboxStore';

    const _this = getCurrentInstance()?.proxy
    const store = useStore() ;
    const masterStore = useMasterStore() ;
    const ssStore = useSsStore() ;

    const route = useRoute() ;
    const router = useRouter() ;

    interface ISsOrder {
        order_no : string ,
    }

    const state = reactive(<{
        list:Array<ISsOrder>,
        orderInfo:any,
        order_no : string|null ,
        loading4Search:boolean,
        loading4getJsonByXml:boolean,
        loading4mapping:boolean,
    }>{
        //取得したスマートショップのXMLリスト
        list : Array() ,

        orderInfo : {} ,

        //直接検索するorder_no
        order_no : null ,

        //検索中
        loading4Search : false ,
        //xmlからjson取得
        loading4getJsonByXml : false ,

        loading4mapping : false ,
    })
    
    //モーダル
    const modalRef = ref() ;

    //何らかの読み込み中判定
    const cLoading = computed(() => state.loading4mapping || state.loading4getJsonByXml ) ;


    //ftpで現在のリスト取得
    async function search () {
        
        state.loading4Search = true
        let ep ='api/rtSsOrder/getOrderList';
        
        try {
            const res = await axios.get(ep) ;

            //画面描画用に成形する
            for(const resData of res.data) {
                state.list.push(
                    {
                        order_no : pickUpOrderNoByXmlName(resData) ,
                    }
                )    
            }
            // state.list = res.data ;
        } 
        catch (error) {
            //@ts-ignore
            _this.$$errorConsole(error, ep) ; 
        } 
        finally {
            state.loading4Search = false
        }
    }

    //情報取得
    async function getJsonByXml (order_no:string|null ,isModalOpen:boolean=false) {

        if(_.isNil(order_no)) {
            alert('注文番号が正しくありません') ;
            return ;
        }
        state.loading4getJsonByXml = true ;
        
        let ep =`api/rtSsOrder/getJsonByXml/${order_no}`;
        
        try {
            const res = await axios.get(ep) ;
            
            ReplaceEmpWithNull(res.data) ; 

            // console.log(res.data)
            state.orderInfo = res.data ;

            //目マークを押したとき
            if(isModalOpen) modalRef.value.openModal() ;

        } 
        catch (error) {
            //@ts-ignore
            _this.$$errorConsole(error, ep) ; 
        } 
        finally {
            state.loading4getJsonByXml = false ;
        }
    }

    //検索結果画面描画用にxmlnameからorder_noを切り出し
    function pickUpOrderNoByXmlName(path:string) {
        //拡張子とdirを削除する
        let name = new String(path).substring(path.lastIndexOf('/') + 1); 
        if(name.lastIndexOf(".") != -1) name = name.substring(0, name.lastIndexOf("."));

        //list_order_ を切り出し
        name = name.substring(name.lastIndexOf('_') + 1 ,name.length)

        return name
    }

    // console.log(pickUpOrderNoByXmlName('importexport/xmlorderexport/list _order_00000748.xml'))

    //文字列ではなく数字として扱いたいカラム名配列
    const numColArr = [
        'total', //合計金額
        'total_net', //小計(消費税除く)
        'discount',//値引
        'product_quantity', //商品数量
        'product_item_price', //商品単価
        'Freeattribute_id2', //商品w寸法
        'Freeattribute_id3', //商品h寸法
        'ship_price', //送料
    ];

    //xmlから抽出したJsonの空のカラムが空配列になっているため、それをnullに置換する
    function ReplaceEmpWithNull(row:any) {

        for (const [key, value] of Object.entries(row)) {
            
            if (typeof value === 'object') {
                if( value instanceof Array && value.length == 0 ) {
                    // console.log(`KEY is ${key}, VALUE is ${value}`);
                    row[key] = null ;
                } 
                else {
                    ReplaceEmpWithNull(value) ;
                }
            } 
            else {
                //数量などを数値に変換
                if(numColArr.indexOf(key) !== -1) row[key] = NumberUtil.invalid2zr(parseFloat(row[key])) ;
            }

        }

        //商品が1件のときObject,複数件のとき配列で持ってくるので配列に固定
        if(!_.isNil(row.order_items)) {
            const copiedItems = _.cloneDeep(row.order_items.order_item) ;
            if(!Array.isArray(row.order_items.order_item)) row.order_items.order_item = [copiedItems] ;

            //プリスマはcm表示なのでmmになおす
            for(const prod of row.order_items.order_item) {
                prod.Freeattribute_id2 = NumberUtil.invalid2zr(prod.Freeattribute_id2 * 10) ;
                prod.Freeattribute_id3 = NumberUtil.invalid2zr(prod.Freeattribute_id3 * 10) ;
            }
        }

        //order_date format
        if(!_.isNil(row.time?.order_time)) {
            row.time.order_time = DayJsEx.format(row.time.order_time) ;
        }
    }

    


    //t_projectに変換する
    async function mapTProject(row:ISsOrder ,isListOn:boolean = false) {

        try {   
            state.loading4mapping = true ;

            //一覧画面からDLするとき
            if(isListOn) {
                await getJsonByXml(row.order_no)
            }

            //階層深いので略
            const ssData = state.orderInfo.order ;
            
            //会社名
            const custName = ssData.billing.address.company ?? ""; 
            
            //客担当者名
            let custUserName = ssData.billing.address.name_last ?? "" ;
            custUserName += ssData.billing.address.name_first ?? "" ;

            const orderDate = ssData.time.order_time ;

            const files = await mapFIles(ssData)

            const tProject:TProject = {
                m_branch_id          : RtSsOrdersConst.M_BRANCH_ID ,
                name                 : orderDate + ' ' + ssData.order_number ,
                ss_order_id          : ssData.id.primary_id,
                ss_order_cd          : ssData.order_number,
                m_customer_id        : RtSsOrdersConst.mCustomerIdConst(ssData.payment_data.payment_itemcode) , 
                customer_user_name   : custName + ' ' + custUserName  ,
                sales_m_user_id      : RtSsOrdersConst.SALES_M_USER_ID ,
                ordered_at           : ssData.time?.order_time ?? null,
                //@ts-ignore
                ordered_m_user_id    : store.loginMUser.id , 
                customer_order_no    : ssData.order_number ,
                delivery_fee         : ssData.ship_data?.ship_price ?? 0 , 
                delivery_mail_to     : ssData.billing.address.email , 
                memo                 : ssData.order_comment?.comment ?? null ,
                //@ts-ignore
                created_m_user_id    : store.loginMUser.id ,
                //@ts-ignore
                updated_m_user_id    : store.loginMUser.id , 
                t_project_products   : mapProducts(ssData) ?? [],
                t_project_deliveries : mapDelivery(ssData) ?? [],
                t_project_files      : files ?? [] ,
            }

            init() ;
            linkToTProject(tProject) ;
            
        } 
        catch (error) {
            //@ts-ignore
            _this.$$errorConsole(error, ep) ; 
        }
        finally {
            state.loading4mapping = false ;
        }
        

    }

    //商品情報マッピング
    function mapProducts (ssData:any) :Array<TProjectProduct> {
        const mapped = ssData.order_items.order_item.map( function(x:any,index:number) {
            const productRow =  {
                uid                   : generateUId() ,
                // order_no              : index ,
                m_branch_id           : RtSsOrdersConst.M_BRANCH_ID ,
                name                  : x.product_name ,
                //@ts-ignore
                display_02            : masterStore.MProductCategories.find( c => c.id == RtSsOrdersConst.M_PRODUCT_CATEGORY_ID)?.name ?? "" ,
                m_product_category_id : RtSsOrdersConst.M_PRODUCT_CATEGORY_ID ,
                m_product_category    : masterStore.MProductCategories.find( c => c.id == RtSsOrdersConst.M_PRODUCT_CATEGORY_ID) ,
                qty                   : x.product_quantity ,
                size_w                : x.Freeattribute_id2 ,
                size_h                : x.Freeattribute_id3 ,
                sell_price            : x.product_item_price ,
                total_sell_price      : x.product_item_price * x.product_quantity ,
                profit                : x.product_item_price ,
                profit_per            : 100 ,
                total_profit          : x.product_item_price * x.product_quantity ,
            }
            // return TProjectProduct.parse(productRow)  ;
            return productRow  ;
        })

        return mapped
    }

    //納期情報マッピング
    function mapDelivery (ssData:any) :Array<any> {

        //客担当者名
        let custUserName = ssData.ship_data.address.name_last ?? "" ;
        custUserName += ssData.ship_data.address.name_first ?? "" ;

        let address = ssData.ship_data.address.city ?? "" ;
        address += ssData.ship_data.address.address1 ?? "" ;
        
        const row = {
            uid : generateUId() ,
            m_branch_id               : RtSsOrdersConst.M_BRANCH_ID ,
            delivery_m_kv_id          : null ,
            delivery_m_kv             : {} ,
            delivery_m_customer_id    : null ,
            delivery_customer_name    : ssData.ship_data.address.company ?? null ,
            delivery_customer_address : address ?? null ,
            delivery_customer_zip     : ssData.ship_data.address.zip ?? null ,
            delivery_customer_user    : custUserName ?? null ,
            delivery_customer_tel     : ssData.ship_data.address.phone ?? null ,
            t_project                 : {} ,
        }
        
        return [ row ] ;
    }

    //添付ファイルマッピング
    async function mapFIles (ssData:any) :Promise<any> {

        const files = [] ;
        for(const item of ssData.order_items.order_item) {

            // if(_.isEmpty(item.nativeUpload?.files)) continue ;
            
            if(!_.isEmpty(item.nativeUpload?.files)){
                const len = Object.keys(item.nativeUpload?.files).length ;
                for (let i = 1; i <= len; i++) {
                    //fileのカラム名がfile_1,file_2...という感じなので動的に取得
                    const colName = item.nativeUpload?.files[`file_${i}`]

                    const res = await getFileData(colName) ;
                    
                    if(!_.isEmpty(res)) {
                        files.push(setTProjectFileRecord(res)) ;
                    }

                }
            } 
            else if(!_.isEmpty(item.pdf_name) && !_.isEmpty(item.pdf_path)){
                const res = await getFileData(item.pdf_name ,item.pdf_path) ;
                if(!_.isEmpty(res)) {
                    files.push(setTProjectFileRecord(res)) ;
                }
            }

        }

        return files ;
    }
    
    const dropboxService = useDropboxStore()?.dropboxService ;

    //添付ファイルを下記の名称の同一フォルダで管理(仮保存から本保存に一気に移動)
    const folderCode = ref(store.loginMUser?.id +  DayJsEx.format(new Date() , "YYYYMMDDHHmmss")) ;
    
    //添付ファイルをURLから取得
    //直接パスを指定しているデータがある
    async function getFileData (filename:string ,filedir:string|undefined = undefined) {

        const vueParam = {
            common_path : `/public/temporary/t_project/${folderCode.value}`,
            parent_path : "" ,
            uploading : undefined ,
        }

        const url =  filedir ?? `https://print-smartshop.com/components/com_jshopping/files/files_upload/${filename}`

        try {
            const res = await dropboxService.filesSaveUrl(url,filename,vueParam) ;
            return res ;

        } catch (error) {

            return {} ;
        }
    }


    function setTProjectFileRecord  (n:any) {
        
        const tProjectFile = {

            uid : generateUId() ,
            filename : n.name ,
            filepath : n.path_display ,
            file_dir : dropboxService.getDirName(n.parent_path) ?? null ,
            src_filepath : n.path_display ,
            is_folder : 0 ,
            base64_thumbnail : n.base64_thumbnail ,
            src_thumbnailpath : null ,
            extension : n.extension ,
            filesize : n.size ,
            children : [] ,
            is_unsave : 1 ,
            parent_id : null ,
            created_m_user_id : store.loginMUser?.id ,
            updated_m_user_id : store.loginMUser?.id ,
            m_tags : [] ,
            folder_code : folderCode.value ,
            modified : DayJsEx.format(n.client_modified),

        }

        return tProjectFile
    }
    
    //t_projectへ（別タブ）
    function linkToTProject(tProject:TProject|undefined) {
        ssStore.setSsDataAction(tProject) ;
        const resolve = router.resolve({ name: 'tProjectSSOrder'}) ;

        if (!window.open(resolve.href,'_blank')){
            
            location.href = resolve.href;
        
        } else {
            // window.open( resolve.href , '_blank') ;
            // window.open( resolve.href) ;
            // ssStore.setSsDataAction(undefined) ;

        }
        
    }


    function init () {
        //folderCodeを更新する（案件ごとにかぶらないようにするため）
        folderCode.value = store.loginMUser?.id +  DayJsEx.format(new Date() , "YYYYMMDDHHmmss") ;
        //存在するuid配列をクリアする
        uids.value.splice(0) ;
    }

    const uids = ref(Array()) ;
    /**uid 付番 */
    function generateUId () {

        let uid = Math.floor(Math.random() * (1000 - 1)) + 1 ;
        while(uids.value.indexOf(uid) !== -1) {
            uid = Math.floor(Math.random() * (1000 - 1)) + 1 ;
        }
        uids.value.push(uid)
        return uid ;

    } 
</script>

<style scoped>
.preview-wrap{
    background-color:rgba(0,0,0,.5);
    width: 100%;
    height: 100%;
    position:fixed;
    top:0;
    left:0;
    z-index: 1050;
}


.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>