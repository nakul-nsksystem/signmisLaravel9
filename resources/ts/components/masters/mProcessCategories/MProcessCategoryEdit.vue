<template>
    <div>        
        
        <div v-show="m$cIsError" class="alert alert-danger" role="alert">
            {{dErrorData.message}}
        </div>
        
        <div class="row">
            <div class="col-12 col-xl-4">
                <form v-if="m$cIsShow">
                    <div class="form-group">
                        <label for="inputOrderNo">表示順</label>
                        <input v-model="dValue.order_no" class="form-control" id="inputOrderNo"  placeholder="Enter 表示順">                
                    </div>
                    <div class="form-group" v-show="$$cIsNskDev">
                        <label for="inputCd">コード</label>
                        <input v-model="dValue.cd" class="form-control" id="inputCd"  placeholder="Enter コード">                
                    </div>
                    <div class="form-group">
                        <label for="inputName">名称</label>
                        <input v-model="dValue.name" class="form-control" id="inputName"  placeholder="Enter 名称">                
                    </div>

                    <div class="form-group">
                        <label for="">生産管理対象</label>
                        <ns-checkbox-input
                            v-model="dValue.is_production"
                            :id="'MProcessCategoryEditIsProduction'"
                            />
                    </div>

                    <div class="form-group">
                        <label for="">生産管理カテゴリー</label>
                        <m-kv-select
                            v-model="dValue.production_m_kv_id"
                            :kv-key="'m_process_categories-production'"
                            />
                    </div>

                    <div class="form-group">
                        <label>生産管理テキスト色</label>
                        <input
                            type="color" class="form-control" 
                            v-model="dValue.production_color">
                    </div>

                    
                    

                    <div class="form-group">
                        <label for="">使用生産先数</label>
                        <ns-number-input v-model="dValue.num_of_use_m_production" class="form-control" />                
                    </div>

                    <div class="form-group">
                        <label>使用生産先名1</label>
                        <input v-model="dValue.m_production_memo_01" class="form-control">                
                    </div>
                    <div class="form-group" v-show="dValue.num_of_use_m_production > 1">
                        <label>使用生産先名2</label>
                        <input v-model="dValue.m_production_memo_02" class="form-control">                
                    </div>
                    <div class="form-group" v-show="dValue.num_of_use_m_production > 2">
                        <label>使用生産先名3</label>
                        <input v-model="dValue.m_production_memo_03" class="form-control">                
                    </div>
                    
                    <div class="form-group" v-show="dValue.num_of_use_m_production > 3">
                        <label>使用生産先名4</label>
                        <input v-model="dValue.m_production_memo_04" class="form-control">                
                    </div>






                    <div class="form-group">
                        <label for="">追加可能</label>                        
                        <ns-checkbox-input
                            v-model="cIsAbleToAdd"
                            :id="'ProcessCategoryEditIsAbleToAdd'"
                            />
                        
                    </div>

                    
                    <div class="form-group">
                        <label for="">物件画面 注意事項</label>
                        <textarea v-model="dValue.memo4project" class="form-control" />                
                    </div>
                    
                    
                    <div v-if="cIsMaterialEditing" class="alert alert-warning" role="alert">
                        材料の編集を完了してください。
                    </div>
                    
                    <div v-if="cIsOutsourceEditing" class="alert alert-warning" role="alert">
                        外注の編集を完了してください。
                    </div>


                    <div v-if="cIsProcessEditing" class="alert alert-warning" role="alert">
                        詳細工程の編集を完了してください。
                    </div>

                    <button type="submit" 
                        class="btn btn-success" 
                        :disabled="cIsProcessEditing || cIsMaterialEditing || cIsOutsourceEditing"
                        @click.prevent="postData()">保存</button>
                </form>
            </div>

            <div class="col-12 col-xl-8" v-if="!m$cIsNew && $$cIsNskDev">
                <nav>
                    <ul class="nav nav-tabs navbar-dark border-bottom-0" >
                        <li class="nav-item">
                            <a class="nav-link active" id="process-tab" data-toggle="tab" href="#nav-material" role="tab" aria-controls="material" aria-selected="true">
                                <i class="fas fa-print fa-fw pr-2"></i>材料
                            </a>    
                        </li>
                        
                        <li class="nav-item">
                            <a class="nav-link" id="outsource-tab" data-toggle="tab" href="#nav-outsource" role="tab" aria-controls="outsource" aria-selected="true">
                                <i class="fas fa-print fa-fw pr-2"></i>外注
                            </a>    
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="process-tab" data-toggle="tab" href="#nav-process" role="tab" aria-controls="process" aria-selected="true">
                                <i class="fas fa-print fa-fw pr-2"></i>詳細作業
                            </a>    
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="labels-tab" data-toggle="tab" href="#nav-labels" role="tab" aria-controls="process" aria-selected="true">
                                <i class="fas fa-print fa-fw pr-2"></i>ラベル
                            </a>    
                        </li>
                    </ul>
                </nav>      
                <div class="tab-content" id="nav-tabContent">
                    
                    <div class="tab-pane pl-0 mr-0 py-0 mt-3 fade show active " 
                        id="nav-material" 
                        role="tabpanel">          

                        <div class="d-flex justify-content-end mb-3">
                            <button type="submit" class="btn btn-primary" @click.prevent="addMaterial()">
                                <i class="fas fa-plus fa-fw"></i>
                                材料追加
                            </button>

                        </div>          


                        <table class="table table-striped table-dark table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>表示順</th>
                                    <th>名称</th>
                                    <th>有効判断(isのカラム名)</th>
                                    <th>単価カラム名</th>
                                    <th>掛率タイプ</th>
                                    <th>掛率値</th>
                                    <th>掛率単位(表示用)</th>
                                    <th>固定加算値</th>
                                    <th>備考</th>
                                    <th>&nbsp;</th>
                                </tr>

                            </thead>
                            <tbody>
                                <tr v-for="n in dValue.m_process_materials" :key="n.id"
                                    @click.prevent="selectMaterial(n)" 
                                    :class="{ selected:cSelectedMaterialId === n.id }">
                                    <td>{{n.id}}</td>
                                    <td>{{n.order_no}}</td>
                                    <td>{{n.name}}</td>                  
                                    <td>{{n.enabled_is_column}}</td>                  
                                    <td>{{n.price_column}}</td>     
                                    <td>{{n.rate_type_m_kv_id}}</td>                  
                                    <td>{{n.rate_value}}</td>                  
                                    <td>{{n.unit_name}}</td>         
                                    <td>{{n.additional_value}}</td>         
                                    
                                    <td>{{n.memo}}</td>       

                                              
                                    <td>
                                        <button type="button" class="btn btn-danger" @click.prevent="deleteMaterial(n)">
                                            <i class="fas fa-trash fa-fw"></i>                            
                                        </button>                    
                                    </td>
                                </tr>                                
                                
                                                                    
                            </tbody>
                            
                        </table>

                        

                        <div v-if="cIsMaterialEditing" class="pt-3">
                            <div class="row" >
                                <div class="col-12 col-xl-2">
                                    <div class="form-group">
                                        <label >表示順</label>
                                        <ns-number-input v-model="dMaterialValue.order_no" />
                                    </div>

                                </div>
                                            
                                <div class="col-12 col-xl-3 pl-3 pl-xl-0">                
                                    <div class="form-group">
                                        <label >名称</label>
                                        <input v-model="dMaterialValue.name" type="text" class="form-control" >
                                    </div>

                                </div>

                                <div class="col-12 col-xl-3 pl-3 pl-xl-0">
                                    <div class="form-group">
                                        <label>有効判断(isのカラム名)</label>
                                        <input v-model="dMaterialValue.enabled_is_column" type="text" class="form-control" >
                                    </div>

                                </div>        
                                

                                
                            </div>

                            <div class="row" >

                                <div class="col-12 col-xl-2 pl-3">
                                    <div class="form-group">
                                        <label >単価タイプ</label>
                                        <select class="custom-select"
                                            v-model="dMaterialValue.price_type" >                                            
                                            <option value="0"></option>
                                            <option value="1">カラム</option>
                                            <option value="2">マトリクス</option>
                                        </select>
                                    </div>

                                </div>  

                                <div class="col-12 col-xl-4 pl-3 pl-xl-0">
                                    <div class="form-group" v-show="dMaterialValue.price_type == 1">
                                        <label>単価のカラム</label>
                                        <input v-model="dMaterialValue.price_column" type="text" class="form-control" >
                                    </div>
                                    <div class="form-group" v-show="dMaterialValue.price_type == 2">
                                        <label>マトリクス</label>
                                        <m-matrix-select 
                                            v-model="dMaterialValue.m_matrix_id" />
                                        
                                    </div>

                                </div>        

                                <div v-show="dMaterialValue.price_type == 2"
                                    class="col-12 col-xl-3 pl-3 pl-xl-0" >
                                    <div class="form-group" >
                                        <label>キー1 カラム名</label>
                                        <input v-model="dMaterialValue.matrix_key_01_column" type="text" class="form-control" >
                                    </div>

                                </div>        
                                <div v-show="dMaterialValue.price_type == 2"
                                    class="col-12 col-xl-3 pl-3 pl-xl-0" >
                                    <div class="form-group" >
                                        <label>キー2 カラム名</label>
                                        <input v-model="dMaterialValue.matrix_key_02_column" type="text" class="form-control" >
                                    </div>

                                </div>        

                            </div>
                            

                            <div class="row" >
                                <div class="col-12 col-xl-3 pl-3">                
                                    <div class="form-group">
                                        <label >掛率タイプ</label>
                                        <m-kv-select
                                            v-model="dMaterialValue.rate_type_m_kv_id"
                                            :kv-key="'m_processes-rate_type'">
                                        </m-kv-select>                                             
                                    </div>

                                </div>
                                <div class="col-12 col-xl-4 pl-3 pl-xl-0">                
                                    <div class="form-group">
                                        <label >掛率値</label>
                                        <select class="custom-select" v-if="cIsMaterialTypeIsParams"
                                            v-model="dMaterialValue.rate_value" >                                            
                                            <option value=""></option>
                                            <option :value="n.value" v-for="n in dParams" :key="n.value" >{{n.name}}</option>        
                                        </select>                                            
                                        <input v-if="! cIsMaterialTypeIsParams"
                                            v-model="dMaterialValue.rate_value" 
                                            type="text" class="form-control" >
                                    </div>

                                </div>       
                                
                                <div class="col-12 col-xl-2 pl-3 pl-xl-0">
                                    <div class="form-group">
                                        <label>掛率単位(表示用)</label>
                                        <input v-model="dMaterialValue.unit_name" type="text" class="form-control" >
                                    </div>

                                </div>         
                                
                                <div class="col-12 col-xl-2 pl-3 pl-xl-0">
                                    <div class="form-group">
                                        <label>固定加算値</label>
                                        <ns-number-input v-model="dMaterialValue.additional_value" />
                                    </div>

                                </div>                                     
                            </div>

                            
                            <div class="row" >
                                <div class="col-12 pl-3">
                                    <div class="form-group">
                                        <label>備考</label>
                                        <input v-model="dMaterialValue.memo" type="text" class="form-control" >
                                    </div>

                                </div>        
                            </div>

                            
                            <div class="row mb-6">
                                <div class="col-12 d-flex justify-content-end">
                                    <button type="submit" class="btn btn-secondary" @click.prevent="cancelMaterial()">
                                        キャンセル
                                    </button>
                                    <button type="submit" class="btn btn-success ml-2" @click.prevent="saveMaterial()">
                                        保存
                                    </button>
                                </div>

                            </div>
                        </div>


                    </div>

                    
                    <div class="tab-pane pl-0 mr-0 py-0 mt-3 fade" 
                        id="nav-outsource" 
                        role="tabpanel">          

                        <div class="d-flex justify-content-end mb-3">
                            <button type="submit" class="btn btn-primary" @click.prevent="addOutsource()">
                                <i class="fas fa-plus fa-fw"></i>
                                外注追加
                            </button>

                        </div>          


                        <table class="table table-striped table-dark table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>表示順</th>
                                    <th>名称</th>
                                    <th>有効判断(isのカラム名)</th>
                                    <th>単価に生産先マスタコストを使用</th>
                                    <th>単価カラム名</th>
                                    <th>掛率タイプ</th>
                                    <th>掛率値</th>
                                    <th>掛率単位(表示用)</th>
                                    <th>固定加算値</th>
                                    <th>備考</th>
                                    <th>&nbsp;</th>
                                </tr>

                            </thead>
                            <tbody>
                                <tr v-for="n in dValue.m_process_outsources" :key="n.id"
                                    @click.prevent="selectOutsource(n)" 
                                    :class="{ selected:cSelectedOutsourceId === n.id }">
                                    <td>{{n.id}}</td>
                                    <td>{{n.order_no}}</td>
                                    <td>{{n.name}}</td>                  
                                    <td>{{n.enabled_is_column}}</td>     
                                    <td>{{n.is_price_ref_from_m_production}}</td>                                               
                                    <td>{{n.price_column}}</td>     
                                    <td>{{n.rate_type_m_kv_id}}</td>                  
                                    <td>{{n.rate_value}}</td>                  
                                    <td>{{n.unit_name}}</td>         
                                    <td>{{n.additional_value}}</td>         
                                    
                                    <td>{{n.memo}}</td>       

                                              
                                    <td>
                                        <button type="button" class="btn btn-danger" @click.prevent="deleteOutsource(n)">
                                            <i class="fas fa-trash fa-fw"></i>                            
                                        </button>                    
                                    </td>
                                </tr>                                
                                
                                                                    
                            </tbody>
                            
                        </table>

                        

                        <div v-if="cIsOutsourceEditing" class="pt-3">
                            <div class="row" >
                                <div class="col-12 col-xl-2">
                                    <div class="form-group">
                                        <label >表示順</label>
                                        <ns-number-input v-model="dOutsourceValue.order_no" />
                                    </div>

                                </div>
                                            
                                <div class="col-12 col-xl-3 pl-3 pl-xl-0">                
                                    <div class="form-group">
                                        <label >名称</label>
                                        <input v-model="dOutsourceValue.name" type="text" class="form-control" >
                                    </div>

                                </div>

                                <div class="col-12 col-xl-3 pl-3 pl-xl-0">
                                    <div class="form-group">
                                        <label>有効判断(isのカラム名)</label>
                                        <input v-model="dOutsourceValue.enabled_is_column" type="text" class="form-control" >
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12 col-xl-4">
                                    <div class="form-group">
                                        <label>単価に生産先マスタコストを使用する</label>                                        
                                        <ns-checkbox-input
                                            v-model="dOutsourceValue.is_price_ref_from_m_production"
                                            :id="'ProcessCategoryOutSourceValueIsPriceRefFromMProduction'"
                                            />                                        
                                    </div>

                                </div>

                                <div class="col-12 col-xl-4">
                                    <div class="form-group">
                                        <label>一式( 数量をかけない ) </label>                                        
                                        <ns-checkbox-input
                                            v-model="dOutsourceValue.is_ignore_qty"
                                            :id="'ProcessCategoryOutSourceValueIsIgnoreQty'"
                                            />                                        
                                    </div>

                                </div>
                                
                                
                                <div class="col-12 col-xl-3 pl-3 pl-xl-0">
                                    <div class="form-group">
                                        <label>単価のカラム</label>
                                        <input v-model="dOutsourceValue.price_column" type="text" class="form-control" >
                                    </div>

                                </div>        
                                

                            </div>
                            

                            <div class="row" >
                                <div class="col-12 col-xl-3 pl-3">                
                                    <div class="form-group">
                                        <label >掛率タイプ</label>
                                        <m-kv-select
                                            v-model="dOutsourceValue.rate_type_m_kv_id"
                                            :kv-key="'m_processes-rate_type'">
                                        </m-kv-select>                                             
                                    </div>

                                </div>
                                <div class="col-12 col-xl-4 pl-3 pl-xl-0">                
                                    <div class="form-group">
                                        <label >掛率値</label>
                                        <select class="custom-select" v-if="cIsOutsourceTypeIsParams"
                                            v-model="dOutsourceValue.rate_value" >                                            
                                            <option value=""></option>
                                            <option :value="n.value" v-for="n in dParams" :key="n.value" >{{n.name}}</option>        
                                        </select>                                            
                                        <input v-if="! cIsOutsourceTypeIsParams"
                                            v-model="dOutsourceValue.rate_value" 
                                            type="text" class="form-control" >
                                    </div>

                                </div>       
                                
                                <div class="col-12 col-xl-2 pl-3 pl-xl-0">
                                    <div class="form-group">
                                        <label>掛率単位(表示用)</label>
                                        <input v-model="dOutsourceValue.unit_name" type="text" class="form-control" >
                                    </div>

                                </div>         
                                
                                <div class="col-12 col-xl-2 pl-3 pl-xl-0">
                                    <div class="form-group">
                                        <label>固定加算値</label>
                                        <ns-number-input v-model="dOutsourceValue.additional_value" />
                                    </div>

                                </div>                                     
                            </div>

                            
                            <div class="row" >
                                <div class="col-12 pl-3">
                                    <div class="form-group">
                                        <label>備考</label>
                                        <input v-model="dOutsourceValue.memo" type="text" class="form-control" >
                                    </div>

                                </div>        
                            </div>

                            
                            <div class="row mb-6">
                                <div class="col-12 d-flex justify-content-end">
                                    <button type="submit" class="btn btn-secondary" @click.prevent="cancelOutsource()">
                                        キャンセル
                                    </button>
                                    <button type="submit" class="btn btn-success ml-2" @click.prevent="saveOutsource()">
                                        保存
                                    </button>
                                </div>

                            </div>
                        </div>


                    </div>
            
                    <div class="tab-pane pl-0 mr-0 py-0 mt-3 fade" 
                        id="nav-process" 
                        role="tabpanel">                    
                        
                        
                        <div class="d-flex justify-content-end mb-3">
                            <button type="submit" class="btn btn-primary" @click.prevent="addProcess()">
                                <i class="fas fa-plus fa-fw"></i>
                                詳細作業追加
                            </button>

                        </div>

                        <table class="table table-striped table-dark table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>表示順</th>
                                    <th>作業名</th>
                                    <th>使用isカラム</th>
                                    <th>準備/ジョブ</th>
                                    <th>準備/ジョブ掛率値</th>
                                    <th>準備/枚</th>
                                    <th>準備/枚掛率値</th>
                                    <th>オペ/枚</th>
                                    <th>オペ掛率値</th>
                                    <th>&nbsp;</th>
                                </tr>

                            </thead>
                            <tbody>
                                <tr v-for="n in dValue.m_processes" :key="n.id"
                                    @click.prevent="selectProcess(n)" 
                                    :class="{ selected:cSelectedProcessId === n.id }">
                                    <td>{{n.id}}</td>
                                    <td>{{n.order_no}}</td>
                                    <td>{{n.name}}</td>                                    
                                    <td>{{n.enabled_is_column}}</td>
                                    <td>{{n.is_use_prepare_per_job}}</td>                                    
                                    <td>{{n.prepare_per_job_rate_value}}</td>
                                    <td>{{n.is_use_prepare_per_qty}}</td>    
                                    <td>{{n.prepare_per_qty_rate_value}}</td>
                                    <td>{{n.is_use_operation}}</td>
                                    <td>{{n.operation_rate_value}}</td>                             
                                    <td>
                                        <button type="button" class="btn btn-danger" @click.prevent="deleteProcess(n)">
                                            <i class="fas fa-trash fa-fw"></i>                            
                                        </button>                    
                                    </td>
                                </tr>                                
                                
                                                                    
                            </tbody>
                            
                        </table>



                        <div v-if="cIsProcessEditing" class="pt-3">
                            <div class="row" >
                                <div class="col-12 col-xl-2">
                                    <div class="form-group">
                                        <label >表示順</label>
                                        <ns-number-input v-model="dProcessValue.order_no" />
                                    </div>

                                </div>
                                            
                                <div class="col-12 col-xl-6 pl-3 pl-xl-0">                
                                    <div class="form-group">
                                        <label >作業名</label>
                                        <input v-model="dProcessValue.name" type="text" class="form-control" >
                                    </div>

                                </div>

                                <div class="col-12 col-xl-3 pl-3 pl-xl-0">
                                    <div class="form-group">
                                        <label>有効判断(isのカラム名)</label>
                                        <input v-model="dProcessValue.enabled_is_column" type="text" class="form-control" >
                                    </div>

                                </div>        

                                <!-- <div class="col-12 col-xl-4 pl-3 pl-xl-0">                
                                    <div class="form-group">
                                        <label >対象生産先</label>
                                        <select class="custom-select" 
                                            v-model="dProcessValue.target_m_production_no" >                                            
                                            <option value="1">{{dValue.m_production_memo_01}}</option>
                                            <option value="2">{{dValue.m_production_memo_02}}</option>
                                            <option value="3" v-if="dValue.num_of_use_m_production > 2">{{dValue.m_production_memo_03}}</option>
                                        </select>                                
                                    </div>

                                </div> -->

                                
                                
                            </div>
                            
                            <h6 class="text-success font-weight-bold">
                                <input type="checkbox" id="is_use_prepare_per_job"
                                    class="mr-3"
                                    v-model="dProcessValue.is_use_prepare_per_job" />
                                <label for="is_use_prepare_per_job">準備掛率/ジョブ</label>
                            </h6>
                            <div class="alert alert-success" v-show="dProcessValue.is_use_prepare_per_job">
                                <div class="row" >
                                    
                                    <div class="col-12 col-xl-3 pl-3">
                                        <div class="form-group">
                                            <label>用途</label>
                                            <input v-model="dProcessValue.prepare_per_job_memo" type="text" class="form-control" >
                                        </div>

                                    </div>        
                                    <div class="col-12 col-xl-3 pl-3 pl-xl-0">
                                        <div class="form-group">
                                            <label>参照生産先</label>
                                            <select class="custom-select" 
                                                v-model="dProcessValue.prepare_per_job_target_m_production_no" >                                            
                                                <option value="1">{{dValue.m_production_memo_01}}</option>
                                                <option value="2">{{dValue.m_production_memo_02}}</option>
                                                <option value="3" v-if="dValue.num_of_use_m_production > 2">{{dValue.m_production_memo_03}}</option>
                                                <option value="4" v-if="dValue.num_of_use_m_production > 3">{{dValue.m_production_memo_04}}</option>
                                            </select>                                
                                        </div>

                                    </div>


                                    <div class="col-12 col-xl-3 pl-3 pl-xl-0">
                                        <div class="form-group">
                                            <label>単価カラム名</label>
                                            <input v-model="dProcessValue.prepare_per_job_price_column" type="text" class="form-control" >
                                        </div>
                                    </div>        


                                </div>


                                <div class="row" v-show="dProcessValue.is_use_prepare_per_job">
                                    <div class="col-12 col-xl-3 pl-3">                
                                        <div class="form-group">
                                            <label>速度値参照</label>
                                            <select class="custom-select" 
                                                v-model="dProcessValue.prepare_per_job_speed_ref_type" >                                            
                                                <option value="0"></option>
                                                <option value="1">生産先モード</option>
                                                <option value="2">マトリクス</option>
                                                <option value="3">固定値</option>                                            
                                            </select>                                                                        
                                        </div>
                                    </div>
                                    <div class="col-12 col-xl-2 pl-3 pl-xl-0">                
                                        <div class="form-group">
                                            <label>速度値</label>
                                            <input v-model="dProcessValue.prepare_per_job_speed_ref_value" type="text" class="form-control" >
                                        </div>
                                    </div>
                                    
                                    <div class="col-12 col-xl-2 pl-3 pl-xl-0">                
                                        <div class="form-group">
                                            <label>速度値単位</label>
                                            <input v-model="dProcessValue.prepare_per_job_speed_ref_unit_name" type="text" class="form-control" >
                                        </div>
                                    </div>
                                    <div class="col-12 col-xl-4 pl-3 pl-xl-0">                
                                        <div class="form-group">
                                            <label>難易度(カラム名)</label>
                                            <input v-model="dProcessValue.prepare_per_job_speed_difficulty_column" type="text" class="form-control" >
                                        </div>
                                    </div>
                                    
                                </div>

                                
                                <div class="row">
                                    <div class="col-12 col-xl-2 pl-3" v-show="dProcessValue.prepare_per_job_speed_ref_type == 3">                
                                        <div class="form-group">
                                            <label>速度基準値</label>
                                            <input v-model="dProcessValue.prepare_per_job_speed_ref_value" type="text" class="form-control" >
                                        </div>
                                    </div>

                                    <div class="col-12" v-show="dProcessValue.prepare_per_job_speed_ref_type == 2">
                                        <div class="row">
                                            <div class="col-12 col-xl-6 pl-3" >                
                                                <div class="form-group">
                                                    <label>マトリクス</label>
                                                    <m-matrix-select 
                                                        v-model="dProcessValue.prepare_per_job_speed_m_matrix_id" />                                                        
                                                </div>
                                            </div>

                                            <div class="col-12 col-xl-3 pl-3 pl-xl-0" >                
                                                <div class="form-group">
                                                    <label>キー1 カラム名</label>
                                                    <input v-model="dProcessValue.prepare_per_job_speed_matrix_key_01_column" type="text" class="form-control" >
                                                </div>
                                            </div>

                                            <div class="col-12 col-xl-3 pl-3 pl-xl-0" >                
                                                <div class="form-group">
                                                    <label>キー2 カラム名</label>
                                                    <input v-model="dProcessValue.prepare_per_job_speed_matrix_key_02_column" type="text" class="form-control" >
                                                </div>
                                            </div>

                                        </div>

                                    </div>                                        

                                </div>


                                <div class="row" >
                                    <div class="col-12 col-xl-3 pl-3">                
                                        <div class="form-group">
                                            <label >準備掛率タイプ</label>
                                            <m-kv-select
                                                v-model="dProcessValue.prepare_per_job_rate_type_m_kv_id"
                                                :kv-key="'m_processes-rate_type'">
                                            </m-kv-select>                                             
                                        </div>

                                    </div>
                                    <div class="col-12 col-xl-3 pl-3 pl-xl-0">                
                                        <div class="form-group">
                                            <label >準備掛率値</label>
                                            <select class="custom-select" v-if="cIsPreparePerJobRateTypeIsParams"
                                                v-model="dProcessValue.prepare_per_job_rate_value" >                                            
                                                <option value=""></option>
                                                <option :value="n.value" v-for="n in dParams" :key="n.value" >{{n.name}}</option>        
                                            </select>
                                            <input v-if="! cIsPreparePerJobRateTypeIsParams"
                                                v-model="dProcessValue.prepare_per_job_rate_value" 
                                                type="text" class="form-control" >                   
                                
                                        </div>

                                    </div>
                                    
                                    <div class="col-12 col-xl-3 pl-3 pl-xl-0">                
                                        <div class="form-group">
                                            <label >準備人数効率</label>
                                            <ns-number-input 
                                                v-model="dProcessValue.prepare_per_job_num_of_worker_effect"                             
                                                step="0.001"
                                                min="0"
                                                max="1" />
                                        </div>

                                    </div>


                                </div>           
                            </div>                 

                            <h6 class="text-primary font-weight-bold">
                                <input type="checkbox" id="is_use_prepare_per_qty"
                                    class="mr-3"
                                    v-model="dProcessValue.is_use_prepare_per_qty" />
                                <label for="is_use_prepare_per_qty">準備掛率/枚</label>
                            </h6>
                            
                            <div class="alert alert-primary" v-show="dProcessValue.is_use_prepare_per_qty">

                                <div class="row" >
                                    
                                    <div class="col-12 col-xl-3 pl-3">
                                        <div class="form-group">
                                            <label>用途</label>
                                            <input v-model="dProcessValue.prepare_per_qty_memo" type="text" class="form-control" >
                                        </div>

                                    </div>        
                                    <div class="col-12 col-xl-3 pl-3 pl-xl-0">
                                        <div class="form-group">
                                            <label>参照生産先</label>
                                            <select class="custom-select" 
                                                v-model="dProcessValue.prepare_per_qty_target_m_production_no" >                                            
                                                <option value="1">{{dValue.m_production_memo_01}}</option>
                                                <option value="2">{{dValue.m_production_memo_02}}</option>
                                                <option value="3" v-if="dValue.num_of_use_m_production > 2">{{dValue.m_production_memo_03}}</option>
                                                <option value="4" v-if="dValue.num_of_use_m_production > 3">{{dValue.m_production_memo_04}}</option>
                                            </select>                                
                                        </div>

                                    </div>
                                    

                                </div>

                                <div class="row" >
                                    <div class="col-12 col-xl-3 pl-3">                
                                        <div class="form-group">
                                            <label>速度値参照</label>
                                            <select class="custom-select" 
                                                v-model="dProcessValue.prepare_per_qty_speed_ref_type" >                                            
                                                <option value="0"></option>
                                                <option value="1">生産先モード</option>
                                                <option value="2">マトリクス</option>
                                                <option value="3">固定値</option>                                            
                                            </select>                                                                        
                                        </div>
                                    </div>
                                    <div class="col-12 col-xl-4 pl-3 pl-xl-0">                
                                        <div class="form-group">
                                            <label>難易度(カラム名)</label>
                                            <input v-model="dProcessValue.prepare_per_qty_speed_difficulty_column" type="text" class="form-control" >
                                        </div>
                                    </div>
                                </div>

                            
                                <div class="row">
                                    <div class="col-12 col-xl-2 pl-3" v-show="dProcessValue.prepare_per_qty_speed_ref_type == 3">                
                                        <div class="form-group">
                                            <label>速度基準値</label>
                                            <input v-model="dProcessValue.prepare_per_qty_speed_ref_value" type="text" class="form-control" >
                                        </div>
                                    </div>
                                    <div class="col-12 col-xl-1 pl-3 pl-xl-0" v-show="dProcessValue.prepare_per_qty_speed_ref_type == 3">  
                                        <div class="form-group">
                                            <label>速度単位</label>
                                            秒/枚
                                        </div>
                                    </div>
                                    

                                    <div class="col-12" v-show="dProcessValue.prepare_per_qty_speed_ref_type == 2">
                                        <div class="row">
                                            <div class="col-12 col-xl-6 pl-3" >                
                                                <div class="form-group">
                                                    <label>マトリクス</label>
                                                    <m-matrix-select 
                                                        v-model="dProcessValue.prepare_per_qty_speed_m_matrix_id" />                                                        
                                                </div>
                                            </div>

                                            <div class="col-12 col-xl-3 pl-3 pl-xl-0" >                
                                                <div class="form-group">
                                                    <label>キー1 カラム名</label>
                                                    <input v-model="dProcessValue.prepare_per_qty_speed_matrix_key_01_column" type="text" class="form-control" >
                                                </div>
                                            </div>

                                            <div class="col-12 col-xl-3 pl-3 pl-xl-0" >                
                                                <div class="form-group">
                                                    <label>キー2 カラム名</label>
                                                    <input v-model="dProcessValue.prepare_per_qty_speed_matrix_key_02_column" type="text" class="form-control" >
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <div class="row" >
                                    <div class="col-12 col-xl-3 pl-3">                
                                        <div class="form-group">
                                            <label >準備掛率タイプ</label>
                                            <m-kv-select
                                                v-model="dProcessValue.prepare_per_qty_rate_type_m_kv_id"
                                                :kv-key="'m_processes-rate_type'">
                                            </m-kv-select>                                             
                                        </div>
                                    </div>
                                    <div class="col-12 col-xl-3 pl-3 pl-xl-0">                
                                        <div class="form-group">
                                            <label >準備掛率値</label>
                                            <select class="custom-select" v-if="cIsPreparePerQtyRateTypeIsParams"
                                                v-model="dProcessValue.prepare_per_qty_rate_value" >                                            
                                                <option value=""></option>
                                                <option :value="n.value" v-for="n in dParams" :key="n.value" >{{n.name}}</option>        
                                            </select>             
                                            <input v-if="! cIsPreparePerQtyRateTypeIsParams"
                                                v-model="dProcessValue.prepare_per_qty_rate_value" 
                                                type="text" class="form-control" >                   
                                        </div>
                                    </div>
                                    <div class="col-12 col-xl-3 pl-3 pl-xl-0">                
                                        <div class="form-group">
                                            <label >準備人数効率</label>
                                            <ns-number-input 
                                                v-model="dProcessValue.prepare_per_qty_num_of_worker_effect"                             
                                                step="0.001"
                                                min="0"
                                                max="1" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            
                            <h6 class="text-danger font-weight-bold">
                                <input type="checkbox" id="is_use_operation"
                                    class="mr-3"
                                    v-model="dProcessValue.is_use_operation" />
                                <label for="is_use_operation">稼働掛率/枚</label>
                            </h6>

                            <div class="alert alert-danger" v-show="dProcessValue.is_use_operation">
                                <div >
                                        
                                    <div class="row" >        
                                        
                                        <div class="col-12 col-xl-3 pl-3">
                                            <div class="form-group">
                                                <label>用途</label>
                                                <input v-model="dProcessValue.operation_memo" type="text" class="form-control" >
                                            </div>

                                        </div>        
                                        <div class="col-12 col-xl-3 pl-3 pl-xl-0">
                                            <div class="form-group">
                                                <label>参照生産先</label>
                                                <select class="custom-select" 
                                                    v-model="dProcessValue.operation_target_m_production_no" >                                            
                                                    <option value="1">{{dValue.m_production_memo_01}}</option>
                                                    <option value="2">{{dValue.m_production_memo_02}}</option>
                                                    <option value="3" v-if="dValue.num_of_use_m_production > 2">{{dValue.m_production_memo_03}}</option>
                                                    <option value="4" v-if="dValue.num_of_use_m_production > 3">{{dValue.m_production_memo_04}}</option>
                                                </select>                                
                                            </div>

                                        </div>


                                    </div>

                                    <div class="row" >
                                        <div class="col-12 col-xl-3 pl-3">
                                            <div class="form-group">
                                                <label>速度基準値参照</label>
                                                <select class="custom-select" 
                                                    v-model="dProcessValue.operation_speed_ref_type" >                                            
                                                    <option value="0"></option>
                                                    <option value="1">生産先モード</option>
                                                    <option value="2">マトリクス</option>
                                                    <option value="3">固定値</option>                                            
                                                    <option value="4">カラム</option>    
                                                </select>                                                                        
                                            </div>
                                        </div>
                                        
                                        <div class="col-12 col-xl-2 pl-3 pl-xl-0">                
                                            <div class="form-group">
                                                <label>基準値単位</label>
                                                <input v-model="dProcessValue.operation_speed_ref_unit_name" type="text" class="form-control" >
                                            </div>
                                        </div>
                                        <div class="col-12 col-xl-4 pl-3 pl-xl-0">                
                                            <div class="form-group">
                                                <label>難易度(カラム名)</label>
                                                <input v-model="dProcessValue.operation_speed_difficulty_column" type="text" class="form-control" >
                                            </div>
                                        </div>


                                    </div>

                                    <div class="row">
                                        <div class="col-12 col-xl-2 pl-3" v-show="dProcessValue.operation_speed_ref_type >= 3 ">                
                                            <div class="form-group">
                                                <label>速度基準値</label>
                                                <input v-model="dProcessValue.operation_speed_ref_value" type="text" class="form-control" >
                                            </div>
                                        </div>

                                        <div class="col-12" v-show="dProcessValue.operation_speed_ref_type == 2">
                                            <div class="row">
                                                <div class="col-12 col-xl-6 pl-3" >                
                                                    <div class="form-group">
                                                        <label>マトリクス</label>
                                                        <m-matrix-select 
                                                            v-model="dProcessValue.operation_speed_m_matrix_id" />                                                        
                                                    </div>
                                                </div>

                                                <div class="col-12 col-xl-3 pl-3 pl-xl-0" >                
                                                    <div class="form-group">
                                                        <label>キー1 カラム名</label>
                                                        <input v-model="dProcessValue.operation_speed_matrix_key_01_column" type="text" class="form-control" >
                                                    </div>
                                                </div>

                                                <div class="col-12 col-xl-3 pl-3 pl-xl-0" >                
                                                    <div class="form-group">
                                                        <label>キー2 カラム名</label>
                                                        <input v-model="dProcessValue.operation_speed_matrix_key_02_column" type="text" class="form-control" >
                                                    </div>
                                                </div>

                                            </div>

                                        </div>                                        

                                    </div>
                                    
                                    <div class="row" >

                                        <div class="col-12 col-xl-3 pl-3">                
                                            <div class="form-group">
                                                <label >稼働掛率タイプ</label>
                                                <m-kv-select
                                                    v-model="dProcessValue.operation_rate_type_m_kv_id"
                                                    :kv-key="'m_processes-rate_type'">
                                                </m-kv-select>                                             
                                            </div>

                                        </div>
                                        <div class="col-12 col-xl-4 pl-3 pl-xl-0">                
                                            <div class="form-group">
                                                <label >稼働掛率値</label>
                                                <select class="custom-select" v-if="cIsOperationRateTypeIsParams"
                                                    v-model="dProcessValue.operation_rate_value" >                                            
                                                    <option value=""></option>
                                                    <option :value="n.value" v-for="n in dParams" :key="n.value" >{{n.name}}</option>        
                                                </select>                                            
                                                <input v-if="! cIsOperationRateTypeIsParams"
                                                    v-model="dProcessValue.operation_rate_value" 
                                                    type="text" class="form-control" >
                                            </div>

                                        </div>
                                        <div class="col-12 col-xl-2 pl-3 pl-xl-0">                
                                            <div class="form-group">
                                                <label >稼働人数効率</label>
                                                <ns-number-input 
                                                    v-model="dProcessValue.operation_num_of_worker_effect"                             
                                                    step="0.001"
                                                    min="0"
                                                    max="1" />
                                            </div>

                                        </div>


                                    </div>
                                
                                </div>
                            </div>

                            <div class="row mb-6">
                                <div class="col-12 d-flex justify-content-end">
                                    <button type="submit" class="btn btn-secondary" @click.prevent="cancelProcess()">
                                        キャンセル
                                    </button>
                                    <button type="submit" class="btn btn-success ml-2" @click.prevent="saveProcess()">
                                        保存
                                    </button>
                                </div>

                            </div>

                        </div>                        
                    </div>        


                    
                    <div class="tab-pane pl-0 mr-0 py-0 mt-3 fade" 
                        id="nav-labels" 
                        role="tabpanel">          

                        <div class="d-flex justify-content-end mb-3">
                            <button type="submit" class="btn btn-primary" @click.prevent="addLabel()">
                                <i class="fas fa-plus fa-fw"></i>
                                ラベル追加
                            </button>

                        </div>          


                        <table class="table table-striped table-dark table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>表示順</th>
                                    <th>有効判断(isのComputed名)</th>
                                    <th>is判定反転</th>
                                    <th>接頭辞</th>
                                    <th>接尾辞</th>
                                    <th>式</th>
                                    <th>書込対象カラム名</th>
                                    <th>備考</th>
                                    <th>&nbsp;</th>
                                </tr>

                            </thead>
                            <tbody>
                                <tr v-for="n in dValue.m_process_labels" :key="n.id"
                                    @click.prevent="selectLabel(n)" 
                                    :class="{ selected:cSelectedLabelId === n.id }">
                                    <td>{{n.id}}</td>
                                    <td>{{n.order_no}}</td>
                                    <td>{{n.is_computed_name}}</td>
                                    <td>{{n.is_not}}</td>
                                    <td>{{n.prefix}}</td>
                                    <td>{{n.postfix}}</td>
                                    <td>{{n.formula}}</td>
                                    <td>{{n.target_column}}</td>
                                    <td>{{n.memo}}</td>
                                    <td>
                                        <button type="button" class="btn btn-danger" @click.prevent="deleteLabel(n)">
                                            <i class="fas fa-trash fa-fw"></i>
                                        </button>
                                    </td>
                                </tr>                               
                            </tbody>
                            
                        </table>

                        

                        <div v-if="cIsLabelEditing" class="pt-3">
                            <div class="row" >
                                <div class="col-12 col-xl-2">
                                    <div class="form-group">
                                        <label >表示順</label>
                                        <ns-number-input v-model="dLabelValue.order_no" />
                                    </div>

                                </div>

                                <div class="col-12 col-xl-3 pl-3 pl-xl-0">
                                    <div class="form-group">
                                        <label>有効判断(isのカラム名)</label>
                                        <input v-model="dLabelValue.is_computed_name" type="text" class="form-control" >
                                    </div>
                                </div>
                                <div class="col-12 col-xl-3 pl-3 pl-xl-0">
                                    <div class="form-group">
                                        <label>is判定反転</label>                                        
                                        <ns-checkbox-input
                                            v-model="dLabelValue.is_not"
                                            :id="'ProcessCategoryLabelValueIsNot'"
                                            />                                        
                                    </div>

                                </div>
                            </div>

                            <div class="row">
                                <div class="col-12 col-xl-3">
                                    <div class="form-group">
                                        <label>接頭辞</label>
                                        <input v-model.lazy="dLabelValue.prefix" type="text" class="form-control" >
                                    </div>
                                </div>        
                                
                                <div class="col-12 col-xl-3 pl-3 pl-xl-0">
                                    <div class="form-group">
                                        <label>接尾辞</label>
                                        <input v-model.lazy="dLabelValue.postfix" type="text" class="form-control" >
                                    </div>
                                </div>

                                <div class="col-12 col-xl-3 pl-3 pl-xl-0">
                                    <div class="form-group">
                                        <label>式</label>
                                        <input v-model.lazy="dLabelValue.formula" type="text" class="form-control" >
                                    </div>
                                </div>
                                
                                <div class="col-12 col-xl-3 pl-3 pl-xl-0">
                                    <div class="form-group">
                                        <label>対象カラム</label>
                                        <input v-model.lazy="dLabelValue.target_column" type="text" class="form-control" >
                                    </div>
                                </div>

                            </div>
                            
                            
                            <div class="row" >
                                <div class="col-12 pl-3">
                                    <div class="form-group">
                                        <label>備考</label>
                                        <input v-model="dLabelValue.memo" type="text" class="form-control" >
                                    </div>

                                </div>        
                            </div>

                            
                            <div class="row mb-6">
                                <div class="col-12 d-flex justify-content-end">
                                    <button type="submit" class="btn btn-secondary" @click.prevent="cancelLabel()">
                                        キャンセル
                                    </button>
                                    <button type="submit" class="btn btn-success ml-2" @click.prevent="saveLabel()">
                                        保存
                                    </button>
                                </div>

                            </div>
                        </div>


                    </div>                    

                </div>

            </div>
        </div>
    </div>
</template>

<script>
import MasterMaintainanceMixins from "./../../../mixins/commons/MasterMaintainanceMixins" ;
import MKvConst from "./../../../consts/MKvsConst" ; 
import ObjectUtil from "./../../../frameworks/ObjectUtil" ; 
import PageMixins from '../../../mixins/commons/PageMixins';


export default {
    mixins : [MasterMaintainanceMixins,PageMixins] , 
    data :  function() {
        return {            
            dApiName            : "mProcessCategory"    ,    
            dProcessApiName     : "mProcess"            ,
            dMaterialApiName    : "mProcessMaterial"    ,
            dOutsourceApiName   : "mProcessOutsource"   ,
            dLabelApiName       : "mProcessLabel"       ,

            dIsDeleting     : false , 
            dValue          : {} ,             
            dProcessValue   : undefined , 
            dMaterialValue  : undefined , 
            dOutsourceValue : undefined , 
            dLabelValue     : undefined , 

            // パラメータに指定できるリスト
            dParams : [
                { name:"幅(伸ばし込) mm" ,value :"SizeIncExtW" } , 
                { name:"高さ(伸ばし込) mm" ,value :"SizeIncExtH" } , 
                { name:"長い方の寸法 mm" ,value :"LongerLength" } , 
                { name:"長い方の寸法(伸ばし込) mm" ,value :"LongerLengthIncExt" } , 
                { name:"㎡数" ,value :"Sqm" } , 
                { name:"㎡数(伸ばし込)" ,value :"SqmIncExt" } , 
                { name:"数量" ,value :"Qty" } , 
                { name:"外周 mm" ,value :"Perimeter" } , 
                { name:"外周(伸ばし込) mm" ,value :"PerimeterIncExt" } , 
                // { name:"板状の仕上がり" ,value :"IsBoard" } , 
                // { name:"メディアが両方向分割可能" ,value :"IsAbleMediaSeparateBothSide" } , 
                // { name:"materialMKvCategoryId" ,value :"MaterialMKvCategoryId" } , 
                { name:"使用流れM数" ,value :"MaterialUseHLength" } , 
                { name:"使用本数" ,value :"MaterialUseNumOfRolls" } , 
                { name:"加工mm数( 形状カット等 )" ,value :"PathLength" } , 
                // { name:"加工mm数 ( ハーフカット等 )" ,value :"halfcutPathLength" } , 
                
                
            ]
        } 
    } , 
    computed : {
        
        /*---- カラム系 */
        // 追加可能
        cIsAbleToAddCName : function() {
            const colName = "is_able_to_add" ; 
            return colName ; 
        } ,
        cIsAbleToAdd :{
            get :  function() {                
                return this.$$getValue("dValue" ,this.cIsAbleToAddCName) ;
            } ,
            set : function(val) {
                this.$$setValue("dValue", this.cIsAbleToAddCName , val ) ;  
            }
        } ,        

        cIsError : function () {
            return this.dErrorStatus !== undefined && this.dErrorStatus !== "" ; 
        } ,        
        cEndpoint : function () 
        {
            let ep =  `api/${this.dApiName}`;

            if (this.dValue.id > 0) {
                ep += `/${this.dValue.id}`;
            } else if (!this.m$cIsNew) {
                ep += `/${this.$route.params.id}`;
            }

            return ep;
        } ,
        
        cIsProcessEditing : function() {
            return this.dProcessValue !== undefined ; 
        } ,
        cProcessEndpoint : function () {
            let ep = `api/${this.dProcessApiName}`;
            return ep;
        },
        // 選択ハイライト用
        cSelectedProcessId : function() {
            if ( this.dProcessValue === undefined ) return -1 ; 
            return this.dProcessValue.id ; 
        } ,
        // 準備掛け率/ジョブ タイプにパラメータが指定されている。
        cIsPreparePerJobRateTypeIsParams : function() {
            return this.dProcessValue.prepare_per_job_rate_type_m_kv_id == MKvConst.MProcesses.RATE_TYPE_PRODUCT_COLUMN ; 
        } ,
        // 準備掛け率/枚 タイプにパラメータが指定されている。
        cIsPreparePerQtyRateTypeIsParams : function() {
            return this.dProcessValue.prepare_per_qty_rate_type_m_kv_id == MKvConst.MProcesses.RATE_TYPE_PRODUCT_COLUMN ; 
        } ,
        // 稼働掛け率タイプにパラメータが指定されている。
        cIsOperationRateTypeIsParams : function() {
            return this.dProcessValue.operation_rate_type_m_kv_id == MKvConst.MProcesses.RATE_TYPE_PRODUCT_COLUMN ; 
        } ,

        /** 材料系 */
        cIsMaterialEditing : function() {
            return this.dMaterialValue !== undefined ; 
        } ,
        
        cMaterialEndpoint : function () {
            let ep = `api/${this.dMaterialApiName}`;
            return ep;
        },
        // 選択ハイライト用
        cSelectedMaterialId : function() {
            if ( this.dMaterialValue === undefined ) return -1 ; 
            return this.dMaterialValue.id ; 
        } ,
        
        // 材料掛け率タイプにパラメータが指定されている。
        cIsMaterialTypeIsParams : function() {
            return this.dMaterialValue.rate_type_m_kv_id == MKvConst.MProcesses.RATE_TYPE_PRODUCT_COLUMN ; 
        } ,

        /** 外注系 */
        cIsOutsourceEditing : function() {
            return this.dOutsourceValue !== undefined ; 
        } ,
        
        cOutsourceEndpoint : function () {
            let ep = `api/${this.dOutsourceApiName}`;
            return ep;
        },
        // 選択ハイライト用
        cSelectedOutsourceId : function() {
            if ( this.dOutsourceValue === undefined ) return -1 ; 
            return this.dOutsourceValue.id ; 
        } ,
        
        // 外注掛け率タイプにパラメータが指定されている。
        cIsOutsourceTypeIsParams : function() {
            return this.dOutsourceValue.rate_type_m_kv_id == MKvConst.MProcesses.RATE_TYPE_PARAMS; 
        } ,


        /** ラベル系 */
        cIsLabelEditing : function() {
            return this.dLabelValue !== undefined ; 
        } ,
        
        cLabelEndpoint : function () {
            let ep = `api/${this.dLabelApiName}`;
            return ep;
        },
        // 選択ハイライト用
        cSelectedLabelId : function() {
            if ( this.dLabelValue === undefined ) return -1 ; 
            return this.dLabelValue.id ; 
        } ,
        


    } , 
    methods : {       
        
        addProcess : function(){
            this.dProcessValue = {
                m_process_category_id : this.dValue.id ,
                is_use_prepare_per_job : 0 ,
                is_use_prepare_per_qty : 0 ,
                is_use_operation : 0 ,                
                prepare_per_job_num_of_worker_effect : 1 ,
                prepare_per_qty_num_of_worker_effect : 1 ,
                operation_num_of_worker_effect : 1 ,
            } ;             
            
        }  ,        
        
        deleteProcess : async function(row) {
            if (!confirm('削除してもよろしいですか?')) return;
            this.dIsDeleting = true ; 
            try {
                const index = this.dValue.m_processes.indexOf(row);
                if (index != -1) {
                    // 明細選択行の倫理削除
                    this.dValue.m_processes.splice(index, 1);

                    if (row.id !== undefined) {
                        // 明細選択行の論理削除
                        let ep = `${this.cProcessEndpoint}/${row.id}`;
                        const res = await axios.delete(ep);
                    }
                }
                this.dProcessValue = undefined ; 

            } catch (error) {
                // handle error
                this.$$errorConsole(error ,this.cProcessEndpoint ) ; 
            }
            this.dIsDeleting = false ; 

        } ,
        selectProcess : function(row){
            if ( this.dIsDeleting ) return ; 
            this.dProcessValue = ObjectUtil.deepCopyJ(row) ; 
            
        } , 
        cancelProcess : function() {
            this.dProcessValue = undefined ; 
        } ,
        
        saveProcess : async function() {
            //console.log("saveMode") ; 
            const value = this.dProcessValue ; 

            try {

                let res ;                  
                this.dValue.updated_m_user_id = this.$$cLoginUserId ; 
                this.$$clearError() ; 
                //console.log(JSON.stringify(this.dOptionValue)) ; 
                if ( value.id === undefined )
                {   
                    this.dValue.created_m_user_id = this.$$cLoginUserId ;
                    //console.log(JSON.stringify(value)) ; 
                    res = await axios.post(this.cProcessEndpoint ,value) ;
                    this.dValue.m_processes.push(res.data) ; 
                    
                }
                else
                {

                    const putEp = `${this.cProcessEndpoint}/${value.id}` ; 
                    //console.log(JSON.stringify(value)) ; 
                    res = await axios.put(putEp ,value) ;
                    const updatedIndex  = this.dValue.m_processes.findIndex(e => e.id === this.cSelectedProcessId ) ; 
                    
                    if ( updatedIndex != -1 ){                        
                        this.dValue.m_processes.splice(updatedIndex, 1, res.data)
                    }  
                    

                }

                this.dProcessValue  = undefined ; 
            }            
            catch (error) 
            {   
                this.$$errorConsole(error ,this.cProcessEndpoint ) ; 

            }


        } ,


        /** Material系 */

        addMaterial : function(){
            this.dMaterialValue = {
                m_process_category_id : this.dValue.id ,
            } ;             
            
        }  ,        
        
        deleteMaterial : async function(row) {
            if (!confirm('削除してもよろしいですか?')) return;
            this.dIsDeleting = true ; 

            try {
                const index = this.dValue.m_process_materials.indexOf(row);
                if (index != -1) {
                    // 明細選択行の倫理削除
                    this.dValue.m_process_materials.splice(index, 1);

                    if (row.id !== undefined) {
                        // 明細選択行の論理削除
                        let ep = `${this.cMaterialEndpoint}/${row.id}`;
                        const res = await axios.delete(ep);
                    }
                }
                this.dMaterialValue = undefined ; 

            } catch (error) {
                // handle error
                this.$$errorConsole(error ,this.cMaterialEndpoint ) ; 
            }
            this.dIsDeleting = false ; 
            
        } ,
        selectMaterial : function(row){
            if ( this.dIsDeleting ) return ; 
            this.dMaterialValue = ObjectUtil.deepCopyJ(row) ; 
        } , 
        cancelMaterial : function() {
            this.dMaterialValue = undefined ; 
        } ,
        
        saveMaterial : async function() {
            //console.log("saveMode") ; 
            const value = this.dMaterialValue ; 

            try {

                let res ;                  
                this.$$clearError() ; 
                //console.log(JSON.stringify(this.dOptionValue)) ; 
                if ( value.id === undefined )
                {   
                    
                    //console.log(JSON.stringify(value)) ; 
                    res = await axios.post(this.cMaterialEndpoint ,value) ;
                    this.dValue.m_process_materials.push(res.data) ; 
                    
                }
                else
                {

                    const putEp = `${this.cMaterialEndpoint}/${value.id}` ; 
                    //console.log(JSON.stringify(value)) ; 
                    res = await axios.put(putEp ,value) ;
                    const updatedIndex  = this.dValue.m_process_materials.findIndex(e => e.id === this.cSelectedMaterialId ) ; 
                    
                    if ( updatedIndex != -1 ){                        
                        this.dValue.m_process_materials.splice(updatedIndex, 1, res.data)
                    }  
                    

                }

                this.dMaterialValue  = undefined ; 
            }            
            catch (error) 
            {   
                this.$$errorConsole(error ,this.cMaterialEndpoint ) ; 

            }


        } ,        


        /** Outsource系 */

        addOutsource : function(){
            this.dOutsourceValue = {
                m_process_category_id : this.dValue.id ,
            } ;             
            
        }  ,        
        
        deleteOutsource : async function(row) {
            if (!confirm('削除してもよろしいですか?')) return;
            this.dIsDeleting = true ; 

            try {
                const index = this.dValue.m_process_outsources.indexOf(row);
                if (index != -1) {
                    // 明細選択行の倫理削除
                    this.dValue.m_process_outsources.splice(index, 1);

                    if (row.id !== undefined) {
                        // 明細選択行の論理削除
                        let ep = `${this.cOutsourceEndpoint}/${row.id}`;
                        const res = await axios.delete(ep);
                    }
                }
                this.dOutsourceValue = undefined ; 

            } catch (error) {
                // handle error
                this.$$errorConsole(error ,this.cOutsourceEndpoint ) ; 
            }
            this.dIsDeleting = false ; 

        } ,
        selectOutsource : function(row){
            if ( this.dIsDeleting ) return ; 
            this.dOutsourceValue = ObjectUtil.deepCopyJ(row) ; 
        } , 
        cancelOutsource : function() {
            this.dOutsourceValue = undefined ; 
        } ,
        
        saveOutsource : async function() {
            //console.log("saveMode") ; 
            const value = this.dOutsourceValue ; 

            try {

                let res ;                  
                this.$$clearError() ; 
                //console.log(JSON.stringify(this.dOptionValue)) ; 
                if ( value.id === undefined )
                {   
                    
                    //console.log(JSON.stringify(value)) ; 
                    res = await axios.post(this.cOutsourceEndpoint ,value) ;
                    this.dValue.m_process_outsources.push(res.data) ; 
                    
                }
                else
                {

                    const putEp = `${this.cOutsourceEndpoint}/${value.id}` ; 
                    //console.log(JSON.stringify(value)) ; 
                    res = await axios.put(putEp ,value) ;
                    const updatedIndex  = this.dValue.m_process_outsources.findIndex(e => e.id === this.cSelectedOutsourceId ) ; 
                    
                    if ( updatedIndex != -1 ){                        
                        this.dValue.m_process_outsources.splice(updatedIndex, 1, res.data)
                    }  
                    

                }

                this.dOutsourceValue  = undefined ; 
            }            
            catch (error) 
            {   
                this.$$errorConsole(error ,this.cOutsourceEndpoint ) ; 

            }


        } ,                


        /** ラベル系 */

        addLabel : function(){
            this.dLabelValue = {
                m_process_category_id : this.dValue.id ,
            } ;             
            
        }  ,        
        
        deleteLabel : async function(row) {
            if (!confirm('削除してもよろしいですか?')) return;
            this.dIsDeleting = true ; 

            try {
                const index = this.dValue.m_process_labels.indexOf(row);
                if (index != -1) {
                    // 明細選択行の倫理削除
                    this.dValue.m_process_labels.splice(index, 1);

                    if (row.id !== undefined) {
                        // 明細選択行の論理削除
                        let ep = `${this.cLabelEndpoint}/${row.id}`;
                        const res = await axios.delete(ep);
                    }
                }
                this.dLabelValue = undefined ; 

            } catch (error) {
                // handle error
                this.$$errorConsole(error ,this.cLabelEndpoint ) ; 
            }
            this.dIsDeleting = false ; 

        } ,
        selectLabel : function(row){
            if ( this.dIsDeleting ) return ; 
            this.dLabelValue = ObjectUtil.deepCopyJ(row) ; 
        } , 
        cancelLabel : function() {
            this.dLabelValue = undefined ; 
        } ,
        
        saveLabel : async function() {
            const value = this.dLabelValue ; 
            //console.log(value) ; 

            try {

                let res ;                  
                this.$$clearError() ; 
                //console.log(JSON.stringify(this.dOptionValue)) ; 
                if ( value.id === undefined )
                {                       
                    //console.log(JSON.stringify(value)) ; 
                    res = await axios.post(this.cLabelEndpoint ,value) ;
                    this.dValue.m_process_labels.push(res.data) ; 
                    
                }
                else
                {
                    const putEp = `${this.cLabelEndpoint}/${value.id}` ; 
                    //console.log(JSON.stringify(value)) ; 
                    res = await axios.put(putEp ,value) ;
                    const updatedIndex  = this.dValue.m_process_labels.findIndex(e => e.id === this.cSelectedLabelId ) ; 
                    
                    if ( updatedIndex != -1 ){                        
                        this.dValue.m_process_labels.splice(updatedIndex, 1, res.data)
                    }  
                }
                this.dLabelValue  = undefined ; 
            }            
            catch (error) 
            {   
                this.$$errorConsole(error ,this.cLabelEndpoint ) ; 
            }
        } ,                       
        
        /** ProcessCategory系 */
        getData : async function () {
            try {
                
                const res = await axios.get(this.cEndpoint ) ;                 
                this.dValue = res.data ;  
                
            }
            catch (error) 
            {
                this.$$errorConsole(error ,this.cEndpoint ) ; 

            }
            
        } ,
        postData : async function () {
             try {

                 let res ; 
                 

                 if ( this.m$cIsNew )
                 {
                    res = await axios.post(this.cEndpoint ,this.dValue ) ; 
                    this.mainStore.masters[this.m$cCamelizedTableName].push(res.data) ; 

                    //this.$router.push({ path: '..'  , append:true }) ;      
                 }
                 else
                 {
                    res = await axios.put(this.cEndpoint ,this.dValue) ; 

                    const updated  = this.mainStore.masters[this.m$cCamelizedTableName].find(e => e.id === res.data.id ) ; 
                    const updatedIndex = this.mainStore.masters[this.m$cCamelizedTableName].indexOf(updated) ; 
                    
                    if ( updatedIndex != -1 ){                        
                        this.mainStore.masters[this.m$cCamelizedTableName].splice(updatedIndex, 1, res.data)
                    }

                    
                    //this.$router.push({ path: '../..'  , append:true }) ;  

                 }
                this.dValue = res.data  ; 
                
                //this.dValue = res.data ;  
                
            }
            catch (error) 
            {
                this.$$errorConsole(error ,this.cEndpoint ) ; 
            }
            
        } , 
    } , 
    created : function () 
    {
        if ( ! this.m$cIsNew) this.getData()  ; 
        
        
    }
    
}
</script>