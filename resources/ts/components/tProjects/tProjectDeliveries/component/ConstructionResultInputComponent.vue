<template>
    <div>
        <div class="app-contents-container">
            <div class="row pb-2 pt-2">
                <div class="col-12 pb-2 ">
                    <div class="border-bottom">
                        <p class="h5">施工予定情報</p>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-xl-3">
                    <div class="form-group">
                        <label >顧客名</label>
                        <div>{{value.delivery_customer_name}}</div>
                    </div>
                </div>

                <div class="col-12 col-xl-3 pl-xl-0">
                    <div class="form-group">
                        <label >担当者名</label>
                        <div>{{value.delivery_customer_user}}</div>
                    </div>
                </div>

                <div class="col-12 col-xl-3 pl-xl-0">
                    <div class="form-group">
                        <label >現地住所</label>
                        <div >{{value.delivery_customer_address}}</div>
                    </div>
                        
                </div>

                <div class="col-12 col-xl-3 pl-xl-0">
                    <div class="form-group">
                        <label>物件名</label>
                        <div v-if="value.t_project">{{value.t_project.name}}</div>
                    </div>
                </div>

            </div>
            <div class="row">
                <div class="col-12 col-xl-3">
                    <div class="form-group">
                        <label>工事日</label>
                        <div>{{formattedDay(value.delivery_at)}}</div>
                    </div>
                </div>

                <div class="col-12 col-xl-3 pl-xl-0">
                    <div class="form-group">
                        <label>開始予定時刻</label>
                        <div>{{value.construction_start_time}}</div>
                    </div>
                </div>
                <div class="col-12 col-xl-3 pl-xl-0">
                    <div class="form-group">
                        <label>終了予定時刻</label>
                        <div>{{value.construction_end_time}}</div>
                    </div>
                </div>
            </div>
            <div class="row">

                <div class="col-12 col-xl-4">
                    <div class="form-group">
                        <label >人員</label>
                        <div>{{value.user_full_names}}</div>
                    </div>
                </div>
            </div>
            <div class="row">

                <div class="col-12">
                    <div class="form-group">
                        <label >備考</label>
                        <div>{{value.memo}}</div>
                    </div>
                </div>
            </div>


            <div class="row pb-2 pt-2">
                <div class="col-12 pb-2 ">
                    <div class="border-bottom">
                        <p class="h5">施工実績情報</p>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="table-responsive">
                        <table class="table table-dark text-nowrap">
                            <thead>
                                <tr>
                                    <th style="width:10%;min-width:100px;">実時間</th>
                                    <!-- <th style="width:10%;min-width:100px;">実終了時刻</th> -->
                                    <th style="width:25%;min-width:250px;">人員</th>
                                    <th class="text-right" style="width:10%;min-width:120px;">経費</th>
                                    <th style="width:25%;min-width:250px;">備考</th>
                                    <th style="width:10%;min-width:100px;">最終更新日<br />最終更新者</th>
                                    <th style="width:5%;min-width:50px;"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(n,index) in this.value.t_project_construction_results" :key="n.id" 
                                    @click.prevent="selectRow(n)"
                                    :class="{ 'dark-selected':cSelectedIndex4View == index}">
                                    <template v-if="n.deleted_at == null" >

                                        <td>
                                            <div>{{formattedTimeHm(n.result_start_time)}}~</div>
                                            <div>{{formattedTimeHm(n.result_end_time)}}</div>
                                        </td>
                                        <!-- <td>{{formattedTimeHm(n.result_end_time)}}</td> -->
                                        <td>{{n.result_user_full_names}}</td>
                                        <td class="text-right">
                                            <div v-for="c in n.t_project_construction_result_costs" :key="c.id">
                                                {{c.cost_name}}:{{c.value.toLocaleString()}}
                                            </div>
                                        </td>
                                        <td>{{n.memo}}</td>
                                        <td>{{formattedDayAndTime(n.updated_at)}}<br />{{cMUser(n.updated_m_user_id)}}</td>
                                        <td>
                                            <button v-if="isTProject" type="button" class="btn btn-danger" @click.prevent.stop="deleteRow(n)" >
                                                <i class="fas fa-trash fa-fw"></i>
                                            </button>
                                            <button v-else type="button" class="btn btn-danger" @click.prevent.stop="destroy(n)">
                                                <i class="fas fa-trash fa-fw"></i>
                                            </button>
                                        </td>
                                    </template>
                                </tr>
                            </tbody>
                        </table>
                        
                    </div>
                </div>

            </div>


            <div class="row">
                <div class="col-12 mt-2 mb-2 text-right">
                    <!-- <div class="border-bottom">
                        <p class="h5">
                            <span class="text-success" v-if="cSelectedIndex4View!==-1"> 実績編集 </span>
                            <span v-else> 新規実績入力 </span>
                        </p>
                    </div> -->
                    <button type="button" class="btn btn-primary" @click.prevent="setDefaultValue">
                        <i class="fas fa-plus fa-fw"></i>
                        新規実績
                    </button>
                </div>
            </div>
            <div v-if="dShowForm">
                <validation-observer v-slot="{ invalid }">
                    <div class="row">
                        <div class="col-12 col-xl-6">
                            <validation-provider name="実開始時刻" rules="required" immediate v-slot="{ errors }"> 
                                <div class="form-group">
                                    <label >実開始時刻</label>                        
                                    <input v-model="dResult.result_start_time"
                                        type="time" class="form-control" placeholder="">
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </div>   
                            </validation-provider>
                        </div>
                        <div class="col-12 col-xl-6">
                            <validation-provider name="実終了時刻" rules="required" immediate v-slot="{ errors }"> 
                                <div class="form-group">
                                    <label >実終了時刻</label>                        
                                    <input v-model="dResult.result_end_time"
                                        type="time" class="form-control" placeholder="">
                                    <span class="validation-error">{{ errors[0] }}</span>
                                </div>
                            </validation-provider>
                        </div>
                    </div>
                    <div class="row">                        
                        <div class="col-12">
                            <div class="form-group">
                                <label>備考</label>
                                <input v-model="dResult.memo" class="form-control" placeholder="">
                            </div>
                        </div>
                        <div class="col-12">
                            <label>経費</label>
                            <div class="table-responsive">
                                <table class="table table-dark text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>内訳</th>
                                            <th>価格</th>
                                            <th style="width:5%;min-width:50px;"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="cost in dResult.t_project_construction_result_costs" :key="cost.id">
                                            <template v-if="cost.deleted_at == null" >

                                                <td>
                                                    <div class="form-group">
                                                        <input v-model="cost.cost_name"
                                                            type="text" class="form-control" placeholder="">
                                                    </div>
                                                </td>
                                                <td>
                                                    <validation-provider name="金額" rules="min_value:0" immediate v-slot="{ errors }">
                                                        <ns-number-input 
                                                            v-model="cost.value"
                                                            />
                                                        <span class="validation-error mb-2">{{ errors[0] }}</span>
                                                    </validation-provider>                                                                                
                                                </td>
                                                <td>
                                                    <button type="button" class="btn btn-danger" @click.prevent="deleteCost(cost)">
                                                        <i class="fas fa-trash fa-fw"></i>
                                                    </button>
                                                </td>
                                            </template>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td>
                                                <button type="button" class="btn btn-primary" @click.prevent="addCost()">
                                                    <i class="fas fa-plus fa-fw"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

            
                    <div class="row">
                        <div class="col-12">
                            <validation-provider name="施工者"  
                                rules="required|excluded:0"
                                immediate v-slot="{ errors }">  
                                <span class="validation-error mb-2" v-show="errors.length > 0">施工担当者か外注先を入力してください</span>
                                <input class="d-none" v-model="cConstructionMembers" />

                            </validation-provider>
                            <label>人員</label>
                            <div class="table-responsive">
                                <table class="table table-dark text-nowrap">
                                    <thead>
                                        <tr>
                                            <th style="min-width:100px;">拠点</th>
                                            <th style="min-width:100px;">施工担当者</th>
                                            <th style="width:5%;min-width:50px;"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="user in dResult.t_project_construction_result_users" :key="user.id">
                                            <template v-if="!user.is_outsource  && user.deleted_at == null" >
                                                <td>
                                                    <m-branch-select
                                                        v-model="user.m_branch_id_4_select"
                                                        />
                                                </td>
                                                <td>
                                                    <validation-provider name="施工担当者" rules="required|excluded:0" immediate v-slot="{ errors }">
                                                        <m-user-select
                                                            :m-branch-id="user.m_branch_id_4_select"
                                                            v-model="user.m_user_id"
                                                            :filter-m-tag-keys='["m_users-role-construction"]' 
                                                            />
                                                        <span class="validation-error mb-2">{{ errors[0] }}</span>
                                                    </validation-provider>                                                                                
                                                </td>
                                                <td>
                                                    <button type="button" class="btn btn-danger" @click.prevent="deleteUser(user)">
                                                        <i class="fas fa-trash fa-fw"></i>
                                                    </button>
                                                </td>
                                            </template>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td>
                                                <button type="button" class="btn btn-primary" @click.prevent="addUser(false)">
                                                    <i class="fas fa-plus fa-fw"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>
                        <div class="col-12">
                            <label>外注</label>                    
                            <div class="table-responsive">
                                <table class="table table-dark text-nowrap">
                                    <thead>
                                        <tr>
                                            <!-- <th style="width:10%;min-width:100px;">拠点</th> -->
                                            <th style="width:30%;min-width:250px;">外注先</th>
                                            <th style="width:10%;min-width:130px;">担当者</th>
                                            <th style="width:10%;min-width:80px;">人数</th>
                                            <th style="width:10%;min-width:120px;">単価</th>
                                            <th class="text-right" style="width:10%;min-width:100px;">金額</th>
                                            <th style="width:5%;min-width:50px;"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="outsource in dResult.t_project_construction_result_users" :key="outsource.id">
                                            <template v-if="outsource.is_outsource && outsource.deleted_at == null " >
                                                <!-- <td>
                                                    <m-branch-select
                                                        v-model="outsource.m_branch_id_4_select"
                                                        />
                                                </td> -->
                                                <td>
                                                    <validation-provider name="外注先" rules="required|excluded:0" immediate v-slot="{ errors }">
                                                        <m-customer-select
                                                            :m-branch-ids="selectedMBranchIds"
                                                            v-model="outsource.out_source_m_customer_id"
                                                            :selected-item.sync="outsource.out_source_m_customer"
                                                            :dealing-cds="[2]"
                                                            :filter-m-tag-keys='["m_customers-purchas_category_construction"]' 
                                                            />
                                                        <span class="validation-error mb-2">{{ errors[0] }}</span>
                                                    </validation-provider>                                                                                
                                                </td>
                                                <td>
                                                    <input                                        
                                                        v-model="outsource.out_source_person_name"
                                                        type="text" class="form-control">
                                                </td>
                                                <td>
                                                    <validation-provider name="人数" rules="required|min_value:1" immediate v-slot="{ errors }">
                                                        <ns-number-input
                                                            v-model="outsource.num_of_out_source_people"
                                                            />
                                                        <span class="validation-error">{{ errors[0] }}</span>
                                                    </validation-provider>
                                                </td>
                                                <td>
                                                    <validation-provider name="単価" rules="min_value:0" immediate v-slot="{ errors }">
                                                        <ns-number-input
                                                            v-model="outsource.out_source_price"
                                                            />
                                                        <span class="validation-error">{{ errors[0] }}</span>
                                                    </validation-provider>                                            
                                                </td>
                                                <td class="text-right">{{cGetOutsouceTotalprice(outsource)}}</td>
                                                <td>
                                                    <button type="button" class="btn btn-danger" @click.prevent="deleteUser(outsource)">
                                                        <i class="fas fa-trash fa-fw"></i>
                                                    </button>
                                                    
                                                </td>
                                            </template>
                                        </tr>
                                        <tr>
                                            <!-- <td></td> -->
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>
                                                <button type="button" class="btn btn-primary" @click.prevent="addUser(true)">
                                                    <i class="fas fa-plus fa-fw"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>   
                    <div class="row">

                        <div class="col-12 pt-2 pb-2">                        
                            <div class="row">
                                <template v-for="file in dResult.t_project_construction_result_pictures"  >
                                    <div class="col-12 col-xl-4 mb-2" v-if="file.deleted_at==null">
                                        <div class=" card bg-dark p-2 d-flex">
                                            <img class="img-thumbnail mx-auto mt-auto mb-auto" :src="cBase64Path(file.base64_thumbnail)"> 
                                            <div class="mt-2">
                                                <input v-model="file.memo" class="form-control" placeholder="備考">   
                                                
                                                <div class="text-right">
                                                    <button 
                                                        type="button" 
                                                        class="btn btn-dark mt-2"
                                                        :disabled="dLoading||dSaving"
                                                        @click.prevent="download(file)" 
                                                        >
                                                        <i class="fas fa-download fa-fw"></i>
                                                    </button>                                         
                                                    <button type="button" class="btn btn-danger mt-2" @click.prevent="deletePicture(file)" :disabled="dLoading||dSaving">
                                                        <i class="fas fa-trash fa-fw"></i>                            
                                                    </button>
                                                    
                                                </div>                                            
                                            </div>                                 
                                        </div>
                                    </div>
                                </template>
                            </div>
                            <label for="corporation_file" class="btn btn-outline-light">
                                <div v-if="!dLoading">
                                    写真アップロード
                                    <input
                                        type="file"
                                        style="display:none;"
                                        ref="fileReader"
                                        id="corporation_file"
                                        @change="postFile"
                                        >
                                </div>
                                <div v-else>
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    アップロード中
                                </div>
                                
                            </label>
                        </div>

                        <div class="col-12 text-right">
                            <button v-if="isTProject" type="button" class="btn btn-success" @click.prevent="pushData" :disabled="invalid || dLoading || dSaving ">保存</button>
                            <button v-else type="button" class="btn btn-success" @click.prevent="postData" :disabled="invalid || dLoading || dSaving ">保存</button>
                            <button type="button" class="btn btn-secondary" @click.prevent="cancel">キャンセル</button>
                        </div>

                    </div>
                </validation-observer>
            </div>
            

        </div>
 
    </div>
</template>

<script>
import DayJsEx from "../../../../frameworks/DayJsEx" ;
import ObjectUtil from '../../../../frameworks/ObjectUtil';
import NumberUtil from '../../../../frameworks/NumberUtil';
import { TProjectConstructionResult } from '../../class/models/TProjectConstructionResult';
import _ from 'lodash';


export default {
    data : function(){
        return {

            dApiName  : "tProjectDelivery", 
            
            //t_project_construction_resultのレコード
            dResult : undefined ,

            //form表示エラー回避用
            dShowForm : false ,

            /**
             * 選択中のConstructionResultのIndex
             */
            dSelectedIndex : -1 ,

            //ファイルアップロード中フラグ
            dLoading : false ,


            dSaving : false ,

            dTempPath : "/public/temporary/t_project_construction"


        }
    } ,
    props : {
        value : {
            type : Object
        } ,
        isTProject : {
            type : Boolean ,
            default : false ,
        } ,
        selectedMBranchIds : {
            type : Array ,
        }
    } ,
    computed : {

        cDropboxService(){
            const service = this.dropboxStore.dropboxService  ; 
            return service ;             
        }  ,

        cMUser : function(){
            return function(userId) {
                const finded = this.masterStore.getMUserById(userId ) ; 
                return finded === undefined ? "" : finded.full_name ; 
            }
        } ,
        /**
         * 表示用の選択Index（Deleted_at考慮）
         */
        cSelectedIndex4View : function() { 
            if ( this.dSelectedIndex === -1 ) return -1 ; 
        
            const item = this.value.t_project_construction_results[this.dSelectedIndex] ; 
            return this.value.t_project_construction_results.indexOf(item) ;             
        } ,
        
        //現場写真
        cBase64Path : function(){
            return function(base64) {
                if(base64 == "img/noimage.png") return base64 ;
                return "data:image/jpeg;base64," + base64 ;
            }            
        } ,

        //外注費用金額計算用
        cGetOutsouceTotalprice : function(){
            return function(n) {
                let val = 0 ; 

                if ( n.num_of_out_source_people !== undefined && n.out_source_price !== undefined){
                val = NumberUtil.ceil(n.num_of_out_source_people * n.out_source_price) ; 
            }

                n.out_source_total_price = val ; 
                return n.out_source_total_price.toLocaleString() ; 
            }
        } ,
        //施工実績写真を置く仮パス
        cTempPath : function() {
            return this.dTempPath + '/' + this.value.t_project.cd ;
        } ,

        //施工人員のバリデーション用
        cConstructionMembers : function() {
            if(this.dResult === undefined) return true ;
            const existList = this.dResult.t_project_construction_result_users.filter( x => !x.deleted_at)
            return  existList.length

        },

    } ,
    methods : {

        //form初期値セット
        setDefaultValue : function(){

            const cloned = _.cloneDeep(this.value) ;
            const obj = {
                t_project_delivery_id : cloned.id ,
                result_start_time     : cloned.construction_start_time ,
                result_end_time       : cloned.construction_end_time ,
                t_project_cd          : cloned.t_project.cd ,
                created_m_user_id     : this.$$cLoginUserId ,

            }

            this.dResult = TProjectConstructionResult.parse(obj)

            //t_project_construction_usersの情報を実績向けにコピーする
            this.dResult.t_project_construction_result_users.push(...cloned.t_project_construction_users) ;
            
            //t_project_construction_usersの情報をコンバートする
            for(const user of this.dResult.t_project_construction_result_users) {
                delete user.id ;
                delete user.t_project_construction_id ;

                user.created_m_user_id = this.$$cLoginUserId ;
                user.updated_m_user_id = this.$$cLoginUserId ;
                user.is_outsource = user.m_user_id ? false : true ;
                user.m_branch_id_4_select = !user.is_outsource ? user.m_user.m_branch_id : user.out_source_m_customer.m_branch_id ;
            }
            
            this.dSelectedIndex = -1
            this.dShowForm = true ;

        } ,

        //実績行選択編集
        selectRow : function (item) 
        {
            this.dSelectedIndex = this.value.t_project_construction_results.indexOf(item ) ;
            
            const clone = ObjectUtil.deepCopyJ(item) ;

            this.dResult = TProjectConstructionResult.parse(clone)

            this.dResult.t_project_cd = this.value.t_project.cd ;
            

            if(this.dResult.t_project_construction_result_users?.length ) {
                
                //実績施工担当者を外注と社内人員のフラグを持たせる
                for(const user of this.dResult.t_project_construction_result_users) {

                   // user.created_m_user_id = this.$$cLoginUserId ;
                    user.updated_m_user_id = this.$$cLoginUserId ;
                    user.is_outsource = user.m_user_id ? false : true ;
                    user.m_branch_id_4_select = !user.is_outsource ? user.m_user.m_branch_id : user.out_source_m_customer.m_branch_id ;

                }

            }

            if(this.dResult.t_project_construction_result_pictures?.length ) {
                
                //写真の未保存フラグを設定する
                for(const pic of this.dResult.t_project_construction_result_pictures) {
                    
                    pic.is_unsave = 0 ;
                    pic.updated_m_user_id = this.$$cLoginUserId ;

                }
            }

            if(this.dResult.t_project_construction_result_costs?.length ) {

                for(const cost of this.dResult.t_project_construction_result_costs) {
                    
                    cost.updated_m_user_id = this.$$cLoginUserId ;

                }
            }
            this.dShowForm = true ;


        } ,

        //実績行削除（QRコードから開いた場合こちらを使用する）
        destroy : async function(row) {

            if(! confirm('削除してよろしいですか?')) return ; 
          
            const delIndex = this.value.t_project_construction_results.indexOf(row)

            let ep = `api/tProjectConstructionResult/${row.id}` ;

            try {
                const res  = await axios.delete(ep) ; 
                this.value.t_project_construction_results.splice(delIndex,1) ;   

            } catch (error) {
                this.$$errorConsole(error ,ep ) ;   
            
            } finally {

                this.cancel()
            
            }
                
            
            
        } ,
        /*実績行削除（物件施工タブから開いた場合こちらを使用する）
         *物件の場合は物件保存ボタンを押したタイミングで情報を更新する仕様になっているため 
        */
        deleteRow : function(row) {

            if(! confirm('削除してよろしいですか?')) return ; 

            const delIndex = this.value.t_project_construction_results.indexOf(row)

            if(row.id) {

                this.$set(this.value.t_project_construction_results[delIndex],"deleted_at",Date()) ;
                for(const pic of this.value.t_project_construction_results[delIndex].t_project_construction_result_pictures) {
                    pic.deleted_at = Date() ;
                } 

            } else {

                this.value.t_project_construction_results.splice(delIndex,1) ;

            }

        } ,

        //現場写真アップロード
        postFile : async function() {
            
            this.dLoading = true ;
            
            let loadFile = event.target.files ?? event.dataTransfer.files ;
            const fileData = [...loadFile] ;
            //連続読み取り用処理
            if(!loadFile) return ;
            //event初期化
            if(this.$refs.fileReader) this.$refs.fileReader.value = "" ;
            
            const vueParam = {
                common_path : this.cTempPath,
                parent_path : "" ,
                uploading   : undefined ,
            }

            try {
                const res = await this.cDropboxService.uploadFile(fileData ,vueParam) ;

                for(const n of res) {
                    //dropboxからの返り値を、t_project_construction_result_picturesのテーブルに合わせて成形する
                    const picture = {

                        filename : n.name ,
                        filepath : n.path_display ,
                        src_filepath : n.path_display ,
                        base64_thumbnail : n.base64_thumbnail ,
                        // extension : n.extension ,
                        // filesize : n.size ,
                        is_unsave : 1 ,
                        created_m_user_id : this.$$cLoginUserId ,
                        updated_m_user_id : this.$$cLoginUserId ,
                        modified : this.formattedDay(n.client_modified) ,

                    }
                    // console.log(picture)

                    this.dResult.t_project_construction_result_pictures.push(picture) ;
                }
            } catch (error) {

                this.$$errorConsole(error) ;
            
            } finally{

                this.dLoading = false ;

            }        



        }  , 

        //result_usersの行追加
        addUser : function(flg) {

            const constructionUser = {
                is_outsource : flg ,
                m_branch_id_4_select :  undefined ,
                num_of_out_source_people : flg ?  1 : 0 ,
                out_source_m_customer : flg ? [] : null ,
                created_m_user_id : this.$$cLoginUserId ,
                updated_m_user_id : this.$$cLoginUserId ,
            }
            this.dResult.t_project_construction_result_users.push(constructionUser) ;
        } ,

        //result_usersの行削除
        deleteUser : function(row){
            if(! confirm('削除してよろしいですか?')) return ; 

            const delIndex = this.dResult.t_project_construction_result_users.indexOf(row)

            if(delIndex == -1) return ;

            if(row.id) {

                this.$set(this.dResult.t_project_construction_result_users[delIndex] ,"deleted_at" ,Date()) ;

            } else {

                this.dResult.t_project_construction_result_users.splice(delIndex,1) ;

            }

        } ,

        //result_costの行追加
        addCost : function() {

            const costs = {
                cost_name : null ,
                value :  0 ,
                created_m_user_id : this.$$cLoginUserId ,
                updated_m_user_id : this.$$cLoginUserId ,
            }
            this.dResult.t_project_construction_result_costs.push(costs) ;
        } ,

        //result_usersの行削除
        deleteCost : function(row){
            if(! confirm('削除してよろしいですか?')) return ; 

            // console.log(row)

            const delIndex = this.dResult.t_project_construction_result_costs.indexOf(row)

            if(delIndex == -1) return ;

            if(row.id) {

                this.$set(this.dResult.t_project_construction_result_costs[delIndex] ,"deleted_at" ,Date()) ;

            } else {

                this.dResult.t_project_construction_result_costs.splice(delIndex,1) ;

            }

        } ,
         /**
         * ダウンロード
         */
        download : async function(row) {

            this.cDropboxService.downloadFile(row.filepath) ;
            
        } ,
        //現場写真削除　既に保存済みの写真は実績保存をかけたタイミングでクラウド上からも削除
        deletePicture : function(file) {
            if(! confirm('削除してよろしいですか?')) return ; 

            const delIndex = this.dResult.t_project_construction_result_pictures.indexOf(file)

            if(delIndex == -1) return ;

            if(file.id) {

                this.$set(this.dResult.t_project_construction_result_pictures[delIndex] ,"deleted_at" ,Date()) ;
                this.$set(this.dResult.t_project_construction_result_pictures[delIndex] ,"updated_m_user_id" ,this.$$cLoginUserId) ;

            } else {

                this.dResult.t_project_construction_result_pictures.splice(delIndex,1) ;    

            }

        } ,

        /*実績行保存（物件施工タブから開いた場合こちらを使用する）
         *物件の場合は物件保存ボタンを押したタイミングで情報を更新する仕様になっているため 
        */
        pushData : function(){

            this.dResult.updated_m_user_id   = this.$$cLoginUserId ;
            const selectedMUserIds = this.dResult.t_project_construction_result_users.map(x => x.m_user_id) ;
            const outsources = this.dResult.t_project_construction_result_users.filter(x => x.is_outsource)
            
            //画面表示用の担当者名前文字列を成形する
            const users = this.mainStore.masters.MUsers.filter(
                x => selectedMUserIds.indexOf(x.id) !== -1) ; 
            
            const userFullNames = users.map(x => x.full_name ) ; 

            // Outsource分
            const outsourceNames = outsources.map(x => 
                `${x.out_source_m_customer.short_name_or_name}(${x.num_of_out_source_people})`  ) ; 
            userFullNames.push(outsourceNames) ; 

            this.dResult.result_user_full_names = userFullNames.join(",") ; 
            
            if(this.dSelectedIndex == -1) {
                
                this.value.t_project_construction_results.push(this.dResult)
            
            } else {

                this.value.t_project_construction_results.splice(this.dSelectedIndex , 1 ,this.dResult) ;

            }

            this.cancel() ;


        } ,

        //実績保存（QRコードから開いた場合こちらを使用する）
        postData : async function(){
            this.dSaving = true ;
            let ep = "api/tProjectConstructionResult" ;

            try {
                this.dResult.updated_m_user_id   = this.$$cLoginUserId ;
                // this.dResult.t_project_construction_id   = this.$route.params.id ;

                if(this.dResult.id) {
                    
                    ep += `/${this.dResult.id}` ;
                    const res  = await axios.put(ep,this.dResult) ;
                    
                    const updated  = this.value.t_project_construction_results.find(e => e.id === res.data.id ) ; 
                    const updatedIndex = this.value.t_project_construction_results.indexOf(updated) ; 

                    this.value.t_project_construction_results.splice(updatedIndex , 1 ,res.data) ;

                } else {

                    this.dResult.created_m_user_id = this.$$cLoginUserId ;

                    const res  = await axios.post(ep,this.dResult) ;

                    this.value.t_project_construction_results.push(res.data) ;

                }  
                // this.setDefaultValue() ;
            } catch (error) {

                this.$$errorConsole(error ,ep ) ; 
            
            } finally {

                this.cancel() ;
                this.dSaving = false ;
            
            }
        } ,
        cancel : function(){
            this.dShowForm = false ; 
            this.dSelectedIndex = -1 ;
            this.dResult = undefined ;
        } ,

        formattedDay : function(day )
        {
            const dayAt = DayJsEx.format(day,"YYYY-MM-DD") ;
            return dayAt ; 
        } , 
        formattedDayAndTime : function(day )
        {
            const dayAt = DayJsEx.format(day,"YYYY-MM-DD HH:mm") ;
            return dayAt ; 
        } , 
        formattedTimeHm : function(tm)  {
            const tempDay = DayJsEx.timeToDayjs(tm) ; 
            const hm = DayJs(tempDay).format("HH:mm") ; 
            return hm ; 
        } ,
        
    } ,

}
</script>