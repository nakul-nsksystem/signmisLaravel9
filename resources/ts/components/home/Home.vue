<template>

    <div>
        <div>
            <div class="row">
                <div class="col-12 col-xl-6 mb-2">
                    <div class="row">
                        <div class="col-12 mb-3" v-for="n in cCustomTProjects" :key="n.m_user_option_id">
                            <t-project-list-table
                                :t-project="n"
                                :title="n.option_name"
                                />
                        </div>
                        <div class="col-12 text-right">
                            <button type="button" class="btn btn-success" @click.prevent="openModal">
                                <i class="fas fa-edit fa-fw"></i>
                            </button>
                        </div>
                    </div>
                    <transition name="fade">
                        <div class="loading-wrap d-flex align-items-center justify-content-center" v-if="loadingTProjectLists"> 
                            <span class="spinner-border text-primary" style="opacity:1" />
                        </div>
                    </transition>
                </div>
                <div class="col-12 col-xl-6">
                    <div class="card bg-dark home-card">
                        <div class="card-header text-center home-card">
                            施工カレンダー
                        </div>

                        <construction-calendar
                            class="m-3"
                            :set-m-branch-ids="[mainStore.loginMUser.m_branch_id]"
                            :value.sync="dSelectedDayOnCalendar" 
                            :selected-m-branch-ids.sync="dSelectedBranchIds"       
                            :set-t-project-constructions="dTProjectConstuctions"
                            @getDayConstruction="dDayConstuctions=$event"
                            >
                                        
                        </construction-calendar>
                        <div class="row">
                            <div class="col-12">
                                <span class="ml-3">施工予定</span>
                                <div class="table-responsive">

                                    <table class="table mt-2 text-white table-striped table-dark">
                                        <tbody>
                                            <tr v-for="n in cTodayConstructions" :key="n.id" >
                                                <td style="width:20%;min-width:100px;" scope="row">
                                                    {{dateFormat(n.delivery_at )}}<br />
                                                    &nbsp;{{formattedTimes(n.construction_start_time ,n.construction_end_time  )}}
                                                </td>
                                                <td>
                                                    <span v-show="n.is_night_work" class="badge badge-info">夜間</span>
                                                    <span v-show="n.is_holiday_work" class="badge badge-danger">休日</span>
                                                </td>
                                                <td style="width:50%;min-width:150px;">{{n.delivery_customer_name}}<br/>
                                                    {{n.delivery_customer_address}}
                                                </td>
                                                <td style="width:30%;min-width:100px;">{{n.user_full_names}}</td>

                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <select-display-t-project-modal
                    :ref="'SelectDisplayTProjectModal'"
                    v-model="cAvailableUserOption"
                    @getUserContentsByUserOptions="getUserContentsByUserOptions()"
                    />
            </div>
        </div>
    </div>
</template>

<script>
import DayJsEx from "./../../frameworks/DayJsEx" ;
// import TProjectUtil from '../../frameworks/TProjectUtil';
import { TProject } from '../tProjects/class/models/TProject';
import { SmUserOptionService } from '../masters/class/services/SmUserOptionService'

export default {
    data() {
        return {

            dTProjects : [],

            dCustomTProjects : [] ,
            dDayConstuctions : [] ,

            dSelectedDayOnCalendar : new Date() ,
            dSelectedBranchIds : undefined ,
            dTProjectConstuctions : [] ,

            loadingTProjectLists : false ,
        
        };
    } ,
    methods : {
        getUserContents : async function(){

            try{
                const ep = `api/tProject/findByUserId/${this.$$cLoginUserId}`

                const res = await axios.get(ep) ;

                const resList = res.data
                this.dTProjects = res.data.map(x => TProject.parse(x))

            } catch(error){
                this.$$errorConsole(error ,ep ) ; 
            }

        } ,
        getUserContentsByUserOptions : async function() {

            this.loadingTProjectLists = true ; 
            const _this = this ;

            try {
                //チェックが外れたリストをけす
                for(const row of this.cAvailableUserOption) {
                    if(row.target_value != "1") {
                        const found = this.dCustomTProjects.find(e => e.m_user_option_id == row.id) ;
                        const foundIdx = this.dCustomTProjects.indexOf(found) ;
                        if( foundIdx !== -1 ) this.dCustomTProjects.splice(foundIdx,1)
                    }
                }
                //有効な検索のみサーバーから検索（重複排除）
                const filterd = this.cAvailableUserOption.filter( 
                    x => x.target_value == "1" && _this.dCustomTProjects.find(e => e.m_user_option_id == x.id) === undefined 
                ) ;

                
                const res = await SmUserOptionService.getTProjectsBySmUserOption(filterd) ;
                
                //検索情報の追加がない場合は表示順の変更のみ
                if(res.length === 0 ) {
                    for(const row of this.cAvailableUserOption) {
                        const found = this.dCustomTProjects.find(e => e.m_user_option_id == row.id) ;
                        const foundIdx = this.dCustomTProjects.indexOf(found) ;
                        if( foundIdx !== -1 ) this.dCustomTProjects[foundIdx].order_no = row.order_no ;
                    }   
                } 
                this.dCustomTProjects.push(...res) ;

            } catch (error) {
                this.$$errorConsole(error ,ep ) ; 
                
            } finally {
                this.loadingTProjectLists = false ; 
                this.$nextTick(function() {
                    $('[popover-name="estpop"]').popover()
                }) ; 

            }
            

        } ,

        dateFormat : function(value) {
            if(_.isNil(value)) return  "" ;
            return DayJsEx.format(value , "YYYY-MM-DD")
        },
        formattedTimeHm : function(tm)  {
            const tempDay = DayJsEx.timeToDayjs(tm) ; 
            const hm = DayJs(tempDay).format("HH:mm") ; 
            return hm ; 
        } ,
        formattedTimes : function (start , end )
        {
            //console.log("start:" + start + " end:" + end) ; 
            return DayJsEx.timeToDayjs(start).format("HH:mm") + "～" + DayJsEx.timeToDayjs(end).format("HH:mm") ; 

        } ,
        openModal : function() {
            this.$refs.SelectDisplayTProjectModal.open() ;
        }

    } , 
    computed : {
        cUserOptions : function() {
            return this.mainStore.loginMUser.m_user_options ;
        },
        cAvailableUserOption : function() {
            const options = SmUserOptionService.getUserOptionsByAppName('home','t_project',true) ;
            return options 
        },
        cCustomTProjects : function() {
            return this.dCustomTProjects.sort(function (a, b)   {

                if( b.order_no == null) {
                    if(a.order_no == null) return a.m_user_option_id - b.m_user_option_id;
                    return -1 ;
                } 
                return a.order_no - b.order_no;
            });
        },
        cTodayConstructions : function() {
            if(this.dDayConstuctions.length === 0 ) return [] ;
            if(this.dSelectedBranchIds === undefined) return this.dDayConstuctions ;

            return this.dDayConstuctions.filter(x => 
                this.dSelectedBranchIds.indexOf(x.t_project.m_branch_id) !== -1 ||   
                this.dSelectedBranchIds.indexOf(x.t_project_construction_users.out_source_m_branch_id) !== -1 ||   
                this.dSelectedBranchIds.indexOf(x.t_project_construction_users.m_user?.m_branch_id) !== -1 
            )
        },

    } ,
    props : {
    } ,
    mounted : function() {

    } ,
    created : function() {
        // this.getUserContents() ;     
        this.getUserContentsByUserOptions() ;
    } ,
}
</script>

<style scoped>
.home-card {
    border-color:#222222;

}

.loading-wrap{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    /* background-color:rgba(0,0,0,.5); */
    opacity: 0.7;
    z-index: 1050;
}
</style>