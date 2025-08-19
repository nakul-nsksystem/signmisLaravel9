<template>
    <div>
        <div class="row">
            
            <div class="col-12">
                <div class="form-group">
                    <label for="">フィルタ：対象拠点</label>
                    <!--prop:setMBranchIds = {{setMBranchIds}} <br/> -->
                    <!--data:dSelectedMBranchIds = {{dSelectedMBranchIds}} <br/> -->
                    <m-branch-multi-select
                        :set-selected-ids="setMBranchIds" 
                        v-model="dSelectedMBranchIds"
                        />            
                </div>
            </div>        
        </div>
        
        <div class="row">
            <div class="col-12">
                <div class="form-group">
                    <label for="">フィルタ：施工担当者</label>
                    <!-- data:dSelectedMUserIds = {{dSelectedMUserIds}}  -->
                    <m-user-multi-select
                        :defaultIsSelected="true"
                        :filter-m-branch-ids="dSelectedMBranchIds"
                        :filter-tag-keys="['m_users-role-construction']"  
                        v-model="dSelectedMUserIds"
                        />
                </div>
            </div>        
        </div>
        

        <v-date-picker
            class="mt-3"
            is-expanded
            is-inline
            @input="emitInput"
            :select-attribute="dSelectAttribute"
            :from-page.sync="dFromPage"
            v-model="dSelectedDate">

            <template slot='header-title' slot-scope='props'>
                施工 {{props.yearLabel}} {{props.monthLabel}}
            </template>
            <template slot='day-content' slot-scope='props' >
                <div 
                    class="h-100"
                    :class="getDayClasses(props.day.date)"                    
                    @click.prevent="clickDay(props.day)"
                    :style="cMinHeight">                    
                    <span :tabindex="props.day.tabIndex" 
                        :aria-label="props.day.ariaLabel" >{{props.day.day}}</span>
                    <div v-if="getDayContents(props.day.date)" >
                        
                        <div 
                            v-for="n in getDayContents(props.day.date)"
                            :key="n.id"
                            >
                            <span class="badge mb-1" 
                                :class="getBadgeClass(n.mBranchId)"
                                data-toggle="popover" 
                                data-trigger="click" 
                                data-placement="bottom" 
                                :data-id="n.id"
                                :data-original-title="n.title"
                                :data-content="n.pop"
                                :style="getFontColor(n.mUsers)"
                                style="min-width:20px"
                                @click.stop="clickBadge">      
                                    <div class="d-none d-sm-block" >
                                        {{n.times}} <br />
                                        {{n.contents}} 
                                    </div>                         
                                    <div class="d-block d-sm-none" >
                                        {{n.shortTimes}}
                                    </div>
                            </span>

                        </div>
                        
                    </div>
                        

                </div>
            </template>

        </v-date-picker>
        <span><small>※下線は外注のみ</small></span>

    </div>
</template>

<script>



import DayJsEx from "./../../../frameworks/DayJsEx" ;
import MKvCatConst from "./../../../consts/MKvCategoriesConst" ; 
import _ from "lodash";

export default {
    data : function() {
        return {
            dSelectedMBranchIds : [] ,
            dSelectedMUserIds : [] ,
            dSelectedDate : null,
            dSelectAttribute : {
                highlight : {
                    color : "white" , 
                }
            } ,
            // v-calendar 月変更時用
            dFromPage : {} , 

            // Getした月の予定データ
            dResData : [] ,

        }
    } ,    
    props : {
        value : {
            type : [Date ,String] ,
        } ,
        setMBranchIds : {
            type : Array ,
        } ,
        setTProjectConstructions : {
            type : Array ,
            default : () => [] ,
        },

        //カレンダ日のマスの最低限の高さ
        dayContentMinHeight : {
            type : Number ,
            default : () => 0 ,

        }
    } , 
    
    watch : {
        value : {
           immediate: true,
           handler: function (val) {            
               this.dSelectedDate = val ;  
               this.$emit('update:value', this.dSelectedDate) ;
           }
        } ,
        setMBranchIds : {
            immediate: false,
            handler: function (newVal , oldVal) {
                //フィルタ拠点変更時にpopover閉じる                           
                $('[data-toggle="popover"]').popover("hide") ;             
                
                //console.log("setMBranchIds") ; 
                if ( newVal.toString() == oldVal.toString()) return ; 
                //console.log("MBranchd newVal = " + newVal + "  : oldVal" + oldVal) ; 
                
                if ( this.dSelectedMBranchIds.indexOf(newVal) !== -1 )
                {
                    this.dSelectedMBranchIds.push(newVal) ; 
                }
                                    
           }
        } , 
        dSelectedMBranchIds : function (newVal , oldVal) {               
            
            if ( newVal.toString() == oldVal.toString()) return ; 
            
            this.$emit("update:selectedMBranchIds" ,newVal ) ; 
            
            
        } ,
        dFromPage : function(newVal , oldVal) {               
            
            //console.log("dFromPage newVal = " + newVal.year + "/" + newVal.month + "  : oldVal" + oldVal) ; 
            
            this.getData() ; 

        } ,
        
    },     
    computed : {
        margedList : function() 
        {
            const _this = this ; 
            if ( this.dResData === undefined ) return [] ; 
            const baseList = this.dResData.filter(function(x) {
                const matchList = 
                    _this.setTProjectConstructions.filter(c => c.id == x.id ) ;  
                return matchList === undefined || matchList.length === 0 ; 
            }) ;

            const validConstructions = this.setTProjectConstructions.filter(x => x.deleted_at == null)
            const concatedList = baseList.concat(validConstructions) ; 
            //console.log(concatedList) ; 
            
            const marged = this.convertConstructionToDayContents(concatedList) ; 
            //console.log(marged) ; 
            return marged  ;

            

        } ,
        endpoint : function () 
        {
            let ep =  `api/tProjectDelivery/searchByYm` ;
            if ( this.dFromPage ) ep += `/${this.dFromPage.year}/${this.dFromPage.month}` 
            
            return  ep ;
        } ,

        getDayClasses : function()
        {
            return function(dt)
            {                    
                const classes = ["text-center"] ; 
                if ( DayJsEx.format(this.dSelectedDate , "YYYYMMDD") == DayJsEx.format(dt , "YYYYMMDD") )
                {
                    classes.push("bg-lightblue") ; 

                }
                
                return classes ; 
            }
        },

        getDayContents : function()
        {
            return function(dt)
            {                    
                const formattedDt = DayJsEx.format(dt ,"YYYY-MM-DD")  ;     
                if ( this.margedList[formattedDt] === undefined ) return "" ; 
                const list = this.margedList[formattedDt] ;                 

                if ( list === undefined) return "" ;      
                const _this = this ; 

                const filteredList = list.filter(function(dayContent) {
                    const outsourceUserList = dayContent.mUsers.filter( user => user.m_user_id == null ) ;
                    if ( dayContent.mUsers.length === outsourceUserList.length )
                    {
                        // 外部人員のみ
                        // 拠点がマッチすれば表示
                        return _this.dSelectedMBranchIds.indexOf(dayContent.mBranchId) !== -1 ;
                        
                    }
                    else
                    {
                        // 社内人員
                        

                        // const dayContentUserIds = dayContent.mUsers.map(x => x.m_user_id) ; 
                        //console.log( "dayContentUserIds : " + dayContentUserIds.join(",")) ;       
                        //console.log( "dSelectedMUserIds : " + _this.dSelectedMUserIds.join(",")) ; 

                        const userExistsList = dayContent.mUsers.filter( user => _this.dSelectedMUserIds.indexOf(user.m_user_id) !== -1 ) ;
                        if (  userExistsList === undefined ) return false ;
                        //console.log( "exitsts : " + userExistsList.length ) ;                                        
                        return  userExistsList.length > 0  ;

                    }


                }) ;

                return filteredList ; 
            }
        }  ,

        cMinHeight : function() {
            if( !this.dayContentMinHeight ) return "";
            return "min-height:" + this.dayContentMinHeight + "px"
        } ,

    } ,

    methods : {        
        // 時刻の文字フォーマット
        formattedTimes : function (start , end , format)
        {
            return DayJsEx.timeToDayjs(start).format(format) + "-" + DayJsEx.timeToDayjs(end).format(format) ; 

        } ,
        // TProjectConstructionのレコード配列からカレンダー用に変換
        convertConstructionToDayContents: function(list)
        {
            const _this = this ; 
            const constructions = {} ; 
            const dummy =  list.map(function(x) {  
                const message = x.user_last_names ; 
                const convDay = DayJsEx.format(DayJs(x.delivery_at) ,"YYYY-MM-DD") ; 
                const prjName = x.t_project.name ; 
                const popContents = `<h6>${x.delivery_customer_name}</h6><h6 class="text-secondary">${x.delivery_customer_address}</h6>${x.user_full_names}` ;
                // const popContents = `<h6>${x.t_project.m_customer.name}</h6><h6>${x.delivery_customer_name}</h6><h6 class="text-secondary">${x.delivery_customer_address}</h6>${x.user_full_names}` ;

                const row = { 
                    id          : x.id , 
                    day         : convDay , 
                    mBranchId   : x.t_project.m_branch_id ,                         
                    times       : _this.formattedTimes(x.construction_start_time ,x.construction_end_time ,"HH:mm") , 
                    shortTimes  : _this.formattedTimes(x.construction_start_time ,x.construction_end_time ,"HH") , 
                    contents    : message.length > 7 ?  message.substr( 0, 6 ) + "..." : message ,
                    title       : x.t_project.id == null ? prjName : `<a target="_blank" href='v#/t_project/edit/${x.t_project.id}'>${prjName}</a>`  ,
                    pop         : popContents ,
                    mUsers      : x.t_project_construction_users ,
                } ; 

                if(x.construction_start_time == null || x.construction_end_time == null) {
                    row.times = "" ;
                }
                
                if (constructions[convDay] === undefined ) constructions[convDay] = []; 
                constructions[convDay].push(row) ; 
                
                return {} ; 
                
            }) ; 

            return constructions ; 
            
        } , 
        // カレンダーの月変更時に施工予定データを取得
        getData : async function () {
            try {
                
                const res = await axios.get(this.endpoint ) ; 
                if ( res.data === undefined ) return ; 

                this.dResData = res.data ; 

                //console.log(res.data) ; 
                //this.dayContents = this.convertConstructionToDayContents(res.data);  
                
                
            }
            catch (error) 
            {
                // handle error
                this.$$errorConsole(error ,this.endpoint ) ; 
            }

            this.emitDayData(this.dSelectedDate)  

            
        } ,
        // Badgeにクラスを取得
        getBadgeClass : function (mBranchId)
        {
            const branches = this.mainStore.masters.MBranches ; 

            const findedBranch = branches.find(x => x.id == mBranchId ) ; 
            const falseClasses = ["badge-dark"] ; 
            if ( findedBranch === undefined) return falseClasses ;

            const category = this.mainStore.masters.MKvCategories.find(
                e => e.kv_key == MKvCatConst.C_MKV_CAT_COLOR) ;
            if ( category === undefined ) return falseClasses ; 

            const mKv = category.m_kvs.find(e => e.id == findedBranch.color_m_kv_id) ; 
            if ( mKv === undefined )return falseClasses ;  

            return ["btn-" + mKv.kv_name ] ; 

        } ,
        // Badgeクリック時に詳細をPopover
        clickBadge : function(event) {
            let target = $(event.target) ; 
            if ( target.prop("tagName") != "span" ) 
            {
                target = $(event.target).parent() ;
            }
            // Diaglogが最初だけ消えない問題
            target.popover({
                        html      : true , 
                        container : 'body' ,
                        template  : '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header text-dark"></h3><div class="popover-body"></div></div>'
                    }) ; 
            target.popover("show") ; 
            
        } ,
        // 選択日付変更時
        clickDay : function (a) 
        {
            //console.log(a.date) ; 
            this.dSelectedDate = a.date ; 

            this.emitDayData(a.date)
            

            this.emitInput(a.date) ;
        } ,
        emitDayData : function(date){
            const formatDate = DayJsEx.format(date , "YYYY-MM-DD 00:00:00")
            
            const list = this.dResData.filter(x=>x.delivery_at==formatDate)

            // if(list.length>0) this.$emit('getDayConstruction',list)
            this.$emit('getDayConstruction',list)
        } ,
        emitInput : function(val) {
            this.$emit('update:value', val) ;
        } ,

        getFontColor : function(users){
            //外注のみの場合下線
            const list = [] ;
            for(const n of users) {
                const mUserId = n.m_user_id ;
                if(mUserId) list.push(mUserId)            
            }

            if(list.length === 0) return "text-decoration:underline;text-decoration-style: solid;"
        } ,
    } ,    
    created : function(){
    } ,
    
    mounted : function() {        
    } ,
    updated :  function() {
        this.$nextTick(function() {
            $('[data-toggle="popover"]').popover("hide") ;             
        }) ; 
    } ,
    beforeDestroy : function() {
        //コンポーネント破棄直前にpopoverを閉じる
        $('[data-toggle="popover"]').popover("hide") ;             
    } ,
    hide: function () {
      // ここでクリーンアップを実行するために Choices のリファレンスを使用できます
      // DOM から要素を削除する前に
        $('[data-toggle="popover"]').popover("hide") ;             

    }    

}
</script>