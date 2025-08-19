<template> 
    <div class="row my-3">               
        <div class="col-12 ">
            <div class="row mb-3">
                <div class="col-12 col-xl-6">
                    <div class="">
                        <button type="button" class="btn btn-success" @click.prevent="createJob()">
                            <i class="fas fa-plus fa-fw" />
                                ジョブ作成 ( Create Job )
                        </button>                    

                    </div>
                </div>
                <div class="col-12 col-xl-6">
                    <div class="">
                        <button type="button" class="btn btn-info" @click.prevent="sendToPrinter()">
                            <i class="fas fa-file-export fa-fw" />
                                プリンタに送信
                                Send To Printer
                        </button>
                    </div>
                </div>
            </div>

            <div class="row ">
                <div class="col-3">
                    <div>
                        <label>Wf JobId</label>          
                        <div>
                            <ns-number-input v-if="$$cIsDebug" v-model="dId" />
                            <template v-else>{{dId}}</template>
                        </div>

                        
                    </div>


                </div>
                <div class="col-8">

                            
                    <div >
                        <label>出力テンプレート</label>            
                        <select
                            class="custom-select"                         
                            v-model="dOutputTemplateId"
                            >
                            <option value="0"></option>
                            <option v-for="n in dOutputTemplates" :key="n.id" :value="n.id">
                                {{n.name}}
                            </option>
                            <!-- <option :value="n.id" v-for="n in dList" :key="n.id">{{ cDisplayName(n) }}</option> -->
                        </select>
                    </div>                    
                </div>

            </div>
            <div class="row">
                <div class="col-12 my-3" >
                    <div class="d-flex" style="height:12rem;" >
                        <!-- <img class="align-self-center img-fluid img-thumbnail mx-auto" style="max-height:20rem;" :src="row.base64_thumbnail">  -->
                        <img v-if="cBase64Path != ''" class="align-self-center img-fluid img-thumbnail" style="max-height:20rem;" :src="cBase64Path"> 
                    </div>
                </div>
            </div>

        </div>

        <div class="col-12">
            <div class="row">
                <div class="col-11">
                    <label>インポーステンプレート</label>            
                    <select
                        class="custom-select"                         
                        v-model="dImposeTemplateId"
                        >
                        <option value="0"></option>
                        <option v-for="n in dImposeTemplates" :key="n.id" :value="n.id">
                            {{n.name}} ({{n.type}})
                        </option>
                        <!-- <option :value="n.id" v-for="n in dList" :key="n.id">{{ cDisplayName(n) }}</option> -->
                    </select>
                </div>

            </div>


            <div class="row ">
                <div class="col-6">
                    <div class="my-3">                    
                        <button type="button" class="btn btn-secondary" @click.prevent="impose()">
                            <i class="fas fa-th-large fa-fw" />
                                インポース( Impose )
                        </button>
                    </div>
                </div>

                <div class="col-6">
                    <div class="my-3">                    
                        <button type="button" class="btn btn-info" @click.prevent="getImposeResult()">
                            <i class="fas fa-download fa-fw" />
                                インポース結果取得 Fetch Thumbnail or PDF. 
                        </button>          
                    </div>
                </div>

            </div>

        </div>
<!--                     
                    <div class="">
                        <label>ファイルタイプ</label>            
                        <select
                            class="custom-select"                         
                            v-model="dImposeFileTypeKey"
                            >
                            <option value=""></option>
                            <option value="pdf">PDF</option>
                            <option value="thumbnail">thumbnail</option>                        
                        </select>
                    </div> -->

    </div>    
</template>

<script lang="ts">
// @ts-nocheck

import _ from "lodash" ; 
import DayJsEx from '../../../frameworks/DayJsEx';
import { TProjectService } from '../../tProjects/class/services/TProjectService';
import { TProductionDayGroup } from '../../class/models/TProductionDayGroup';
import { MProductionExtToolDurstWfService } from '../../class/services/productionTools/MProductionExtToolDurstWfService';

export default {  
    data :  function() {
        return {
            dIsLoading : false , 

            dId : 0 , 

            dOutputTemplateId : 0 , 
            dOutputTemplates : [] , 

            dImposeTemplateId : "" , 
            dImposeTemplates : [] , 

            dImposeFileTypeKey : "thumbnail" , 
            dImposedThumbnail : "" ,

            dSendToPrinterRes : undefined , 
        } 
    } , 
    props : {
        group : { 
            type : TProductionDayGroup , 
        } , 

    } ,     
    watch : {
        group : {
            immediate: true ,
            handler: function (newVal , oldVal) {
                if (! _.isNil(newVal)){
                    this.getImposeTemplates() ; 
                    this.getOutputTemplates() ; 
                }
                                    
           }
        } , 
    } , 
    computed : {
        cMProductionExtTool : function() { 
            const mProductionId = this.group?.m_production_id ; 
            if ( _.isNil( mProductionId )) return undefined ; 
                        
            const foundMProduction = this.masterStore.getMProductionById(mProductionId) ; 
            if ( _.isNil( foundMProduction )) return undefined ; 

            return foundMProduction.m_production_ext_tool ; 
 
        } , 
        cIsExtToolAvailable : function(){
            return ! _.isNil(this.cMProductionExtTool) ; 
        } ,
        
        cBase64Path : function(){
            // if(this.dImposedThumbnail == "") return "img/noimage.png" ; 
            if(this.dImposedThumbnail == "") return "" ; 
            const path = "data:image/jpeg;base64," + this.dImposedThumbnail ;
            return path
        } ,
		
    } , 
    methods : {
        /**
         * Impose Template取得
         */
        getImposeTemplates : async function(){
                
            if (! this.cIsExtToolAvailable) return ; 
            try {                 
                const res = await MProductionExtToolDurstWfService.fetchImposeTemplates(this.cMProductionExtTool.url ) ; 
                this.dImposeTemplates.push(...res) ; 
                // console.log(res) ; 

            }
            catch (error) {     
                this.$$errorConsole(error ,error.ep ) ;
            }

        } ,         
        
        /**
         * Output Template取得
         */
        getOutputTemplates : async function(){
                
            if (! this.cIsExtToolAvailable) return ; 
            try {                 
                const res = await MProductionExtToolDurstWfService.fetchOutputTemplates(this.cMProductionExtTool.url ) ; 
                this.dOutputTemplates.push(...res) ; 
                // console.log(res) ; 

            }
            catch (error) {     
                this.$$errorConsole(error ,error.ep ) ;
            }

        } ,         

        // login : async function() { 
        //     if (! this.cIsExtToolAvailable) return ""; 
        //     try { 
        //         const res = await MProductionExtToolDurstWfService.login(this.cMProductionExtTool.url ,this.dWfUser , this.dWfPass  ) ; 
        //         return res ; 
        //     }
        //     catch (error) {     
        //         this.$$errorConsole(error ,error.ep ) ;
        //         return "" ; 
        //     }
        // } , 

        createJob : async function() { 
            if (! this.cIsExtToolAvailable) return ; 
            try { 
                const res = await MProductionExtToolDurstWfService.createJob(
                    this.cMProductionExtTool.url ,this.group ,this.dOutputTemplateId ) ; 

                this.dId = res.id ; 
                console.log(res) ; 


            }
            catch (error) {     
                this.$$errorConsole(error ,error.ep ) ;
            }
            
        } , 

        impose : async function() { 
            if (! this.cIsExtToolAvailable) return ; 

            if ( this.dId == 0 ){
                alert("JobIdを設定してください") ; 
                return ; 
            }
            if (this.dImposeTemplateId == 0 ){
                alert("テンプレートを選択してください") ; 
                return ;             
            } 

            try { 
                const res = 
                    await MProductionExtToolDurstWfService.impose(this.cMProductionExtTool.url ,this.dId ,this.dImposeTemplateId ) ; 
                console.log(res) ; 
            
            }
            catch (error) {     
                this.$$errorConsole(error ,error.ep ) ;
            }

        } , 

        getImposeResult : async function() { 
            if (! this.cIsExtToolAvailable) return ; 
            
            if ( this.dId == 0 ){
                alert("JobIdを設定してください") ; 
                return ; 
            }
            try { 
                const res = 
                    await MProductionExtToolDurstWfService.getImposeResult(
                        this.cMProductionExtTool.url ,this.dId , this.dImposeFileTypeKey) ; 

                if ( this.dImposeFileTypeKey == "thumbnail"){
                    this.dImposedThumbnail = res ; 
                }
                
                console.log(res) ; 
            }
            catch (error) {     
                this.$$errorConsole(error ,error.ep ) ;
            }
        } , 
        sendToPrinter : async function() { 
            if (! this.cIsExtToolAvailable) return ; 

            if ( this.dId == 0 ){
                alert("JobIdを設定してください") ; 
                return ; 
            }
            try { 
                const res = 
                    await MProductionExtToolDurstWfService.sendToPrinter(
                        this.cMProductionExtTool.url ,this.dId) ; 
                this.dSendToPrinterRes = res ; 
                console.log(res) ; 
            }
            catch (error) {     
                this.$$errorConsole(error ,error.ep ) ;
            }
        } , 

    } , 
    created : async function() {
        
    }
}
</script>