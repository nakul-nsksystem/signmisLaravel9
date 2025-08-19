<template>
    
    <div>
        <h2>DevTProjectProductProcessTest</h2>
        
        <div class="row">
            <div class="col-2">
                <div class="form-group">
                    <label >Id</label>                    
                    <ns-number-input 
                            v-model="dId" />
                </div> 
            </div>
            <div class="col-2">
                <button class="btn btn-primary" @click.prevent="getData">Get</button>
            </div>
            
        </div>
        
        <div class="row">
            <div class="col-2">
                <button class="btn btn-primary" @click.prevent="getSelectedMProduction(1)">getSelectedMProduction</button>
            </div>
            <div class="col-5" >
                {{dGetSelectedMProduction}}
            </div>
            <div class="col-5" >
                <button class="btn btn-primary" @click.prevent="getFRMKvId">getFRMKvId</button>

            </div>

            
            
        </div>

        <div class="row">
            <div class="col-2">
                <button class="btn btn-primary" @click.prevent="updateProductionDisplays()">updateProductionDisplays</button>
            </div>
            <div class="col-10" >
                <p>{{dRow.display_01}}</p>
                <p>{{dRow.display_02}}</p>
                <p>{{dRow.display_03}}</p>
            </div>
            
        </div>
        
        <div class="row">
            <div class="col-2">
                <button class="btn btn-primary" @click.prevent="test()">test</button>
            </div>
            <div class="col-10" >
            </div>
            
        </div>

        <div class="row">            
            {{cRow}}
            <br/>
        </div>

        
    </div>    


</template>


<script lang="ts">
// @ts-nocheck
import _ from 'lodash';
 
import { TProjectProductProcess } from '../tProjects/class/models/TProjectProductProcess';
import TProjectProductProcessUtil from '../tProjects/class/TProjectProductProcessUtil';
import ObjectUtil from '../../frameworks/ObjectUtil';
import { applyTsMixins } from "../../frameworks/TsMixins";
import { TProjectProductProcessPrint } from '../tProjects/class/models/tsMixins/TProjectProductProcessPrint';


export default {        
    data : function() {
        return {
            dId : 2549 ,
            dRow : { } , 
            dGetSelectedMProduction : undefined , 
        }         
    } ,
    
    computed : {
        // cGrouped : function() { 
        //     const gJson = JSON.parse(this.dGroupByJson) ;  

        //     return JSON.stringify(_.groupBy(gJson , "m_production_id_01")) ; 

        // } , 

        cRow : function() { 
            return JSON.stringify(this.dRow ); 
        }

    } ,
    methods : {
        
        test : function() { 

            ////////////////////
            // Usage to compose classes
            ////////////////////

            // User that is Timestamped
            const TimestampedUser = Timestamped(TProjectProductProcess);

            // User that is Timestamped and Activatable
            const TimestampedActivatableUser = Timestamped(Activatable(TProjectProductProcess));

            ////////////////////
            // Using the composed classes
            ////////////////////

            const timestampedUserExample = new TimestampedUser();
            // console.log(applyTsMixins) ; 
            console.log(timestampedUserExample.timestamp);
// 
            // let mixedProcess = TProjectProductProcessPrint(TProjectProductProcess) ; 
            // let mixedProcess = applyTsMixins(TProjectProductProcess, [TProjectProductProcessPrintExt]);
            
            // const timestampedActivatableUserExample = new TimestampedActivatableUser(this.dRow.created_m_user_id );
            const a = new TProjectProductProcess(this.dRow) ; 
            // let mixedProcess = applyTsMixins(a, 
            //     [
            //         TProjectProductProcessPrint 
            //     ]);
            // console.log(mixedProcess.isPrint) ; 

            
        // TProjectProductProcessProductions
        

            // const timestampedActivatableUserExample = new mixedProcess(this.dRow ,this.$store ) ; 
            const timestampedActivatableUserExample = TProjectProductProcess.parse(this.dRow ,undefined ); 
            
            // const  timestampedActivatableUserExample = TimestampedActivatableUser.parse(this.dRow , this.$store) ; 
            // console.log(timestampedActivatableUserExample.timestamp);   
            // console.log(timestampedActivatableUserExample.isActivated);

            console.log(timestampedActivatableUserExample.FRMKvId);
            // console.log(timestampedActivatableUserExample.UserId);
            
            // console.log(JSON.stringify(timestampedActivatableUserExample));
            
            const Timestampedd = Activatable(Object);
            const a = new Timestampedd() ; 
            a.created_m_user_id = null ; 
            console.log(ObjectUtil.getProperties(a)) ; 
        } , 
        getData : async function() { 
            try { 
                const res = await axios.get(`api/tProjectProductProcess/${this.dId}` ) ;
                // console.log(res.data) ; 
                this.dRow = TProjectProductProcess.parse(res.data ,res.data.t_project_product) ; 
                // this.dRow = TProjectProductProcess.parse(res.data ,this.$store) ; 
                // console.log(JSON.stringify(this.dRow )) ;
                
                // this.dRow = res.data ;
            }
            catch ( error ){
                console.error(error) ; 
            }

            // this.dRow.store =  

        } ,

        getSelectedMProduction : function(no) { 
            // console.log(JSONthis.dRow) ; 
            const res = this.dRow.MProductionName01 ; 
            // console.log(res) ; 
            this.dGetSelectedMProduction  = res ; 
            
        } ,

        updateProductionDisplays : function() { 
            this.dRow.MProductionId01 = 9 ; 
            const res = this.dRow.updateProductionDisplays() ; 
        } , 

        getFRMKvId : function() { 
            console.log("FRMKvId : " + this.dRow.FRMKvId) ; 
        }


    } ,
    mounted : function() { 
        
    } , 
    created : function()
    {
        
        
    }
    
} 
</script>