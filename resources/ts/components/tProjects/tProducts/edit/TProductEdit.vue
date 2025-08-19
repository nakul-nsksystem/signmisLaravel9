<template>
    <div  class="card bg-app-secondaly">
        {{cIsChecking}}        
        <div class="d-none">
            <!-- {{cDisplay01}}    
            {{cDisplay02}}    
            {{cDisplay03}}     -->
        </div>
<!-- {{cDisplay01}}
{{cDisplay02}}
{{cDisplay03}} -->
        <!-- <div>
            <p>幅(伸ばし込) cSizeIncExtW:{{cSizeIncExtW}}</p>
            <p>高さ(伸ばし込) cSizeIncExtH:{{cSizeIncExtH}}</p>
            <p>長手方向の長さ cLongerLength:{{cLongerLength}}</p>
            <p>長手方向の長さ(伸ばし込) cLongerLengthIncExt:{{cLongerLengthIncExt}}</p>
            <p>短手方向の長さ cShorterLength:{{cShorterLength}}</p>
            <p>短手方向の長さ(伸ばし込) cShorterLengthIncExt:{{cShorterLengthIncExt}}</p>
            <p>外周 cPerimeter:{{cPerimeter}}</p>
            <p>外周(伸ばし込) cPerimeterIncExt:{{cPerimeterIncExt}}</p>

        </div> -->


        <validation-observer v-slot="{ invalid }" >
            <div class="card-header sticky-header">
                <div class="row align-items-center">
                    <div class="col-12 col-xl-6">
                        
                        <span v-if="cId != 0" class="h5 mb-0">商品情報 - {{cMProductCategoryName}}</span>    
                        <span v-else class="h5 mb-0">商品情報</span>    
                    </div>
                    
                    <div class="ml-auto mr-3">
                        <button type="button" class="btn btn-success mr-1" 
                            @click.prevent="save"
                            :disabled="invalid || dIsLoading">
                            <i class="fas fa-save fa-fw"></i>
                            保存
                        </button>                 
                        <button type="button" class="btn btn-light" @click.prevent="cancel">
                            キャンセル
                        </button>                 
                        
                    </div>
                </div>
            </div>
            <div class="px-3 pt-3 pb-0">            
                
                <div class="row pt-2">
                    <div class="col-12 col-xl-2">
                        <validation-provider name="生産拠点" 
                            vid="mBranchId4Product"
                            rules="required|excluded:0" immediate v-slot="{ errors }">
                            <div class="form-group">
                                <label >生産拠点</label>
                                <div class="text-info" v-show="cIsViewMode">{{dSelectedMBranch === undefined ? "" : dSelectedMBranch.short_name}}</div>
                                <m-branch-select 
                                    v-show="! cIsViewMode"
                                    @change="changeMBranch"
                                    v-model="cMBranchId"
                                    :selected-item.sync="dSelectedMBranch"
                                    :set-id-if-empty="setMBranchId"
                                    ></m-branch-select>
                                <span class="validation-error">{{ errors[0] }}</span>
                            </div>
                        </validation-provider>
                    </div>
                    <div class="col-12 col-xl-6 pl-3 pl-xl-0">
                        <validation-provider name="商品名" rules="required" immediate v-slot="{ errors }">
                            <div class="form-group">                                
                                <label >商品名</label>
                                <div class="text-info" v-show="cIsViewMode">{{cName}}</div>
                                <input v-show="! cIsViewMode" v-model="cName" type="text" class="form-control" placeholder="">
                                <span class="validation-error">{{ errors[0] }}</span>
                            </div>
                        </validation-provider>
                    </div>
                    <div class="col-12 col-xl-2 pl-3 pl-xl-0">
                        <!-- <div class="form-group">
                            <label >納期(出荷日)</label>
                            <div class="text-info" v-show="cIsViewMode">{{cDeliveryDate}}</div>
                            <ex-v-date-picker 
                                v-show="! cIsViewMode"
                                v-model="cDeliveryDate" />
                        </div> -->
                    </div>
                    <div class="col-12 col-xl-2 pl-3 pl-xl-0">
                        <div class="form-group">                
                            <label >制作担当</label>                
                                         
                            <m-user-select
                                v-show="! cIsViewMode"
                                v-model="dValue.operator_m_user_id"
                                :m-branch-id="cMBranchId"
                                :filter-m-tag-keys="['m_users-role-op']"
                                >
                            </m-user-select>
                            

                        </div>
                    </div>

                </div>


                <div class="row">                                
                    <div class="col-12 col-xl-4 d-flex">                
                        <div  style="flex-basis:240px;">
                            <div class="form-group">                
                                <label >サイズ</label>                
                                <div class="text-info" v-show="cIsViewMode">{{cSizeW}} x {{cSizeH}}</div>
                                <div v-show="! cIsViewMode" class="row px-3" >
                                    <validation-provider name="W"  
                                        vid="tProductW" 
                                        :rules="`${ ! cIsNotNeededInputSize ? 'required|min_value:1' : ''}`" 
                                        immediate v-slot="{ errors }">
                                        <ns-number-input 
                                            class="app-input-size mr-3"
                                            v-model="cSizeW" />
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </validation-provider>
                                    <span class="h3">x</span>
                                    <validation-provider name="H" 
                                        vid="tProductQty" 
                                        :rules="`${ ! cIsNotNeededInputSize ? 'required|min_value:1' : ''}`" 
                                        immediate v-slot="{ errors }">
                                        <ns-number-input 
                                            class="app-input-size ml-3"
                                            v-model="cSizeH" />
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </validation-provider>
                                </div>

                            </div>

                        </div>

                    </div>          
                    <template v-if="cIsViewMode">
                        <div  class="col-12 col-xl-8 d-flex">
                            <div class="form-group" v-show="cIsViewMode">     
                                <label >伸ばし</label>                
                                <div class="text-info" v-show="cIsViewMode">上:{{cSizeExtendT}} 下:{{cSizeExtendB}} 左:{{cSizeExtendL}} 右:{{cSizeExtendR}}</div>
                            </div>
                        </div>

                    </template>          
                    <template v-if="! cIsViewMode">
                        <div class="col-12 col-xl-6 d-flex">
                        
                            <div class="flex-grow-0 flex-shrink-1" style="flex-basis:90px;">
                                <validation-provider name="伸ばし上"  
                                    vid="cSizeExtendT" 
                                    :rules="`${ ! cIsNotNeededInputSize ? 'required|min_value:0' : ''}`" 
                                    immediate v-slot="{ errors }">
                                                                
                                    <div class="form-group">                
                                        <label >伸ばし上</label>                
                                        <div class="row pl-3">
                                            <ns-number-input 
                                                class="app-input-sm-size mr-3"
                                                v-model="cSizeExtendT" />
                                            <span class="validation-error">{{ errors[0] }}</span>
                                        </div>
                                    </div>
                                </validation-provider>

                            </div>
                            <div class="flex-grow-0 flex-shrink-1" style="flex-basis:90px;">
                                <validation-provider name="伸ばし下"  
                                    vid="cSizeExtendB" 
                                    :rules="`${ ! cIsNotNeededInputSize ? 'required|min_value:0' : ''}`" 
                                    immediate v-slot="{ errors }">

                                    <div class="form-group">                
                                        <label >伸ばし下</label>                
                                        <div class="row pl-3">
                                            <ns-number-input 
                                                class="app-input-sm-size mr-3"
                                                v-model="cSizeExtendB" />
                                            <span class="validation-error">{{ errors[0] }}</span>
                                        </div>

                                    </div>
                                </validation-provider>

                            </div>
                            <div class="flex-grow-0 flex-shrink-1" style="flex-basis:90px;">
                                <validation-provider name="伸ばし左"  
                                    vid="cSizeExtendL" 
                                    :rules="`${ ! cIsNotNeededInputSize ? 'required|min_value:0' : ''}`" 
                                    immediate v-slot="{ errors }">

                                    <div class="form-group">                
                                        <label >伸ばし左</label>                
                                        <div class="row pl-3">
                                            <ns-number-input 
                                                class="app-input-sm-size mr-3"
                                                v-model="cSizeExtendL" />
                                            <span class="validation-error">{{ errors[0] }}</span>
                                        </div>

                                    </div>
                                </validation-provider>

                            </div>
                            <div class="flex-grow-0 flex-shrink-1" style="flex-basis:90px;">
                                <validation-provider name="伸ばし右"  
                                    vid="cSizeExtendR" 
                                    :rules="`${ ! cIsNotNeededInputSize ? 'required|min_value:0' : ''}`" 
                                    immediate v-slot="{ errors }">

                                    <div class="form-group">                
                                        <label >伸ばし右</label>                
                                        <div class="row pl-3">
                                            <ns-number-input 
                                                class="app-input-sm-size mr-3"
                                                v-model="cSizeExtendR" />
                                            <span class="validation-error">{{ errors[0] }}</span>
                                        </div>

                                    </div>
                                </validation-provider>

                            </div>
                        </div>
                        <div class="col-12 col-xl-2 d-flex">
                            <div class="flex-grow-1 flex-shrink-0" >
                                &nbsp;
                            </div>

                            <div class="flex-grow-0 flex-shrink-1" style="flex-basis:120px;">
                                
                                <validation-provider name="数量" 
                                    vid="tProductQty"
                                    :rules="cQtyValidRule" immediate v-slot="{ errors }">
                                    <div class="form-group" >
                                        <label >数量</label>
                                        <div class="text-info" v-show="cIsViewMode">{{cQty}}</div>
                                        <ns-number-input v-show="! cIsViewMode" v-model="cQty" />                        
                                        <span class="validation-error">{{ errors[0] }}</span>
                                    </div>
                                </validation-provider>

                            </div>
                            

                        </div>
                    </template>



                </div>
                <div class="row">
                    
                    <div class="col-12 col-xl-4">
                        <div class="row">
                            <div class="col-6">
                                <label>伸込サイズ</label>                
                                <div class="row px-3">                        
                                    {{cSizeIncExtW.toLocaleString()}} x {{cSizeIncExtH.toLocaleString()}}&nbsp;mm
                                </div>                        

                            </div>
                            <div class="col-6">
                                <label>長手寸法</label>                
                                <div class="row px-3">                        
                                    {{cLongerLengthIncExt.toLocaleString()}}&nbsp;mm
                                </div>                                                
                            </div>
                        </div> 
                    </div>

                    <div class="col-12 col-xl-4 2 pt-2 pt-xl-0">
                        <div class="row">
                            <div class="col-6">
                                <label >外形 周長</label>                
                                <div class="row px-3">                        
                                    {{cPerimeterIncExt.toLocaleString()}}&nbsp;mm
                                </div>                        

                            </div> 
                            <div class="col-6">
                                <label >㎡</label>                
                                <div class="row px-3">                        
                                    {{cSqmIncExt}}&nbsp;㎡
                                </div>                        
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-12 col-xl-4 2 pt-2 pt-xl-0">
                        <div class="row">
                            <div class="col-12">
                                <label >総重量</label>                
                                <div class="row px-3">                        
                                    {{cTotalWeight.toFixed(1).toLocaleString()}}&nbsp;kg ( @{{cWeight}} &nbsp;kg )
                                </div>                        

                            </div> 
                        </div>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12 pt-2 pt-xl-0">
                        <div class="row">
                            <div class="col-12 col-xl-2" >
                                <div class="form-group">
                                    <label >保証</label>    
                                    <m-kv-select
                                        v-model="cWarrantyMKvId"
                                        :kv-key="'t_project_product_warranty'"
                                        :selected-item.sync="dSelectedWarrantyMKv"
                                        >
                                    </m-kv-select>


                                <!-- <select  class="form-control" placeholder="">
                                    <option></option>                            
                                    <option>MCS(塩ビ)</option>                         
                                </select> -->
                                </div>
                            </div> 
                            <div class="col-12 col-xl-2 pl-xl-0">

                                <div class="form-group">
                                    <label >指定</label>
                                    <m-kv-select
                                        v-model="cSpecifiedMKvId"
                                        :kv-key="'t_project_product_specified'"
                                        :selected-item.sync="dSelectedSpecifidMKv"
                                        >
                                    </m-kv-select>     

                                </div>
                                <!-- 
                                <select  class="form-control" placeholder="">
                                    <option></option>                            
                                    <option>不燃(塩ビ/幕)</option>                            
                                    <option>防炎(幕)</option>                            
                                </select> -->
                                
                            </div> 
                            <div class="col-12 col-xl-2  text-center" >
                                <label>防炎シール</label>          
                                <ns-checkbox-input
                                    v-model="cIsNeededLabelsForFirePrevention"
                                    :id="'ProductIsNeededLabelsForFirePrevention'"
                                    />
                                
                            </div>
                            


                            <div class="col-12 col-xl-3">
                                <validation-provider name="商品分割"  
                                    vid="tProduct-dIsMaterialLayoutSuccess"
                                    :rules="`${cSelectedMProductCategory !== undefined && cSelectedMProductCategory.is_able_media_separate ? 'custom_rule_is' : ''}`" 
                                    immediate v-slot="{ errors }">  
                                    <span class="validation-error" v-show="errors.length > 0">商品を分割してください</span>
                                    <input class="d-none" v-model="dIsMaterialLayoutSuccess" />
                                </validation-provider>
                            </div>
                            
                        </div>
                    </div>
                    <!-- <div>
                        <img :src="cBoardLayoutBase64Svg4Img"  width="200" height="200" />
                    </div> -->
                </div>

                <div class="row" v-if="cId == 0 && !cIsCopy" >            
                    <!--
                    <select class="custom-select"  
                            @change="selectCategory"  >
                        <option disabled value="">Please select one</option>
                        <option value="0"></option>
                        <option :value="n.id" v-for="n  in $store.state.masters.MProductCategories" :key="n.id" >{{n.name}}</option>
                    </select>
                    -->
                    <div class="col-12">
                        <validation-provider 
                            name="商品カテゴリー"
                            vid="tProductMProductCategoryId" 
                            rules="required|excluded:0" immediate v-slot="{ errors }">
                            <span class="validation-error">{{ errors[0] }}</span>
                            <ns-number-input class="d-none" v-model="cMProductCategoryId" />
                            <ul class="app-nav-inside-dark nav nav-pills mb-3 card-group" id="pills-tab" role="tablist">
                                <li class="nav-item" v-for="n  in mainStore.masters.MProductCategories" :key="n.id">
                                    <a class="nav-link app-inside-link" @click="selectCategory(n.id)" 
                                        data-toggle="pill" href="#" role="tab" :aria-selected="cIsActiveCat(n.id)" :class="{'active' : cIsActiveCat(n.id) }">{{n.name}}</a>
                                </li>
                            </ul>
                        </validation-provider>
                    </div>
                    
                </div>
            </div>
            
            <div class="mx-3 mt-3 mb-3" v-if="cMProductCategoryId !== undefined" >
                
                <div class="col-12 col-lg-12 pl-0 pr-0  pt-2 pt-xl-0">
                    <nav>
                        <ul class="nav nav-tabs app-navbar-dark-light border-bottom-0" id="project-nav-category">
                            <li class="nav-item">
                                <a class="nav-link active" id="product-process-tab" 
                                    data-toggle="tab" href="#nav-product-process" role="tab" aria-controls="products" aria-selected="true">
                                    <i class="fas fa-print fa-fw pr-2"></i>工程
                                </a>    
                            </li>
                            <li class="nav-item" v-if="cSelectedMProductCategory.is_able_media_separate ">
                                <a class="nav-link text-ignore" id="product-separate-layout-tab" 
                                    :class="{'text-success':cIsMaterialSeparateHighlight}"
                                    data-toggle="tab" href="#nav-product-separate-layout" role="tab" aria-controls="delivery" aria-selected="false">
                                    <i v-show="! dIsMaterialLayoutSuccess" class="fas fa-times fa-fw text-danger"></i>
                                    <i v-show="dIsMaterialLayoutSuccess" class="fas fa-circle text-success"></i>
                                    
                                    <i class="fas fa-columns fa-fw pr-2"></i>商品分割・レイアウト                                
                                </a>    
                            </li>
                            <!-- <li class="nav-item">
                                <a class="nav-link" id="product-board-layout" data-toggle="tab" href="#nav-product-board-layout" role="tab" aria-controls="construction" aria-selected="false">
                                    <i class="fas fa-th-large fa-fw pr-2"></i>板レイアウト
                                </a>
                            </li>                         -->
                            <li v-show="isViewSellPrice" class="nav-item">
                                <a class="nav-link" id="product-price" data-toggle="tab" href="#nav-product-price" role="tab" aria-controls="construction" aria-selected="false">
                                    <i class="fas fa-yen-sign fa-fw pr-2"></i>サマリー
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <div class="tab-content" id="nav-tabProductContent">
                        <div class="tab-pane pl-0 mr-0 py-0 fade show active" id="nav-product-process" role="tabpanel" >

                            <div v-for="(process, index) in dValue.t_project_product_processes" 
                                >     
                                <div :id="'Card' + process.m_process_category.cd + index" class="card bg-dark" style="border-radius:0;"
                                    v-show="process.deleted_at === null">
                                    <div class="card-header">
                                        <div class="row">

                                            <div class="col-12 col-xl-4 order-0 d-flex align-items-center">
                                                <div class="row">
                                                    <div class="col-auto mr-auto d-flex align-items-center">

                                                        <div v-if="process.m_process_category.pivot.is_required">
                                                            <button class="btn btn-link" 
                                                                type="button" 
                                                                data-toggle="collapse" 
                                                                :data-target="'#collapse' + process.m_process_category.cd + index" 
                                                                aria-expanded="true" 
                                                                :aria-controls="'collapse' + process.m_process_category.cd + index">
                                                                <span class="h6 font-weight-bold">{{ process.m_process_category.name}}</span>
                                                            </button>                
                                                        </div>
                                                        <div v-else>
                                                            <ns-checkbox-input
                                                                v-model="dValue.t_project_product_processes[index].is_enabled"
                                                                :id="`isEnable${process.m_process_category.cd}-${process.order_no}`"
                                                                :label="'  ' + process.m_process_category.name"
                                                                @input="processIsEnabledChanged" 
                                                                />
                                                            
                                                            <!-- <input 
                                                                :id="'isEnable' + process.m_process_category.cd" 
                                                                type="checkbox" 
                                                                v-model="dValue.t_project_product_processes[index].is_enabled"
                                                                @change.prevent="processIsEnabledChanged" 
                                                                data-toggle="collapse" 
                                                                aria-expanded="true" 
                                                                :data-target="'#collapse' + process.m_process_category.cd + index" 
                                                                :aria-controls="'collapse' + process.m_process_category.cd + index" > -->
                                                            <!-- <label 
                                                                :for="'isEnable' + process.m_process_category.cd" 
                                                                class="h6 font-weight-bold pl-2 pt-2">{{process.m_process_category.name}}</label>                             -->


                                                        </div>
                                                    </div>


                                                    <div  class="col-auto">
                                                        <button v-show="! process.is_removable && process.m_process_category.is_able_to_add"
                                                            type="button" class="btn btn-primary" @click.prevent="addRow(process)">
                                                            <i class="fas fa-plus fa-fw"></i>                                    
                                                        </button>
                                                        <button v-show="process.is_removable"
                                                            type="button" class="btn btn-danger" @click.prevent="deleteRow(process)">
                                                            <i class="fas fa-trash fa-fw"></i>                                    
                                                        </button>
                                                        
                                                    </div>
                                                
                                                </div>
                                                    

                                            </div>

                                            <div class="col-6 col-xl-2 my-2 text-right order-2 order-xl-2">
                                                {{dValue.t_project_product_processes[index].TotalWorkHour.toFixed(2)}} h
                                            </div>
                                            <div class="col-12 col-xl-3 p-2 my-n2 order-3 order-xl-1" >
                                                <validation-provider 
                                                    name="生産拠点"
                                                    :vid="`tProductProcess-MBranchId${index}`" 
                                                    rules="required|excluded:0" immediate v-slot="{ errors }">

                                                    <m-branch-select                        
                                                        :set-id-if-empty    ="cMBranchId"       
                                                        v-model="dValue.t_project_product_processes[index].m_branch_id"                                                                 
                                                    ></m-branch-select>
                                                    <span class="validation-error">{{ errors[0] }}</span>
                                                </validation-provider>
                                            </div>
                                            <div v-show="isViewPrice" class="col-6 col-xl-3 my-2 text-right order-1 order-xl-3">
                                                {{dValue.t_project_product_processes[index].TotalCost.toLocaleString()}} 円
                                            </div>
                                            <div class="col-12 col-xl-3 p-2 my-n2 order-4 order-xl-4" >
                                                <ex-v-date-picker 
                                                    v-show="isAbleToInputPlanProductionAt"                                                    
                                                    v-model="dValue.t_project_product_processes[index].planed_production_at"
                                                    :isDayOnly="true" />
                                            </div>
                                        </div>
                                    </div>
                                    <div 
                                        :id="'collapse' + process.m_process_category.cd + index" 
                                        class="collapse" 
                                        :class="{show:dValue.t_project_product_processes[index].is_enabled}"
                                        :data-parent="'#Card' + process.m_process_category.cd + index">                                    
                                        <component
                                            v-model="dValue.t_project_product_processes[index]"
                                            @cost-updated="dIsCostUpdated = true ;"                                            
                                            :is-material-input.sync="dIsMaterialInput"
                                            :material-use-num_of_rolls.sync="dMaterialUseNumOfRolls" 
                                            :path-length.sync="dPathLength"    
                                            :is="cCompName(process)"
                                            :is-view-price="isViewPrice"
                                            :t-product="value"
                                            :t-project="tProject"
                                            
                                            @selectPrecedingOrder="selectPrecedingOrder($event)"  
                                            />
                                    </div>                    
                                </div>
                            </div>                        
                        </div>
                        <div  
                            v-if="cSelectedMProductCategory.is_able_media_separate "
                            id="nav-product-separate-layout" 
                            class="tab-pane pl-0 mr-0 py-0 fade" 
                            role="tabpanel" 
                            >
                            <div class="card bg-dark" style="border-radius:0;">
                                <div class="card-header">
                                    商品分割・レイアウト
                                </div>
                                <div class="card-body app-card-body">        
                                    <t-product-split-layout
                                        v-model="value"
                                        :layout-ok-list.sync="cLayoutOkList"
                                        :is-layout-success.sync="dIsMaterialLayoutSuccess"
                                        :separate-base64svg.sync="cSeparateBase64Svg"
                                        >
                                    </t-product-split-layout>
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="nav-product-board-layout" role="tabpanel" >
                            <div class="card bg-dark" style="border-radius:0;">
                                <div class="card-header">
                                    板レイアウト
                                </div>
                                <div class="card-body app-card-body">        
                                    
                                </div>
                            </div>                            
                        </div>
                        
                        <div v-show="isViewSellPrice" class="tab-pane fade" id="nav-product-price" role="tabpanel" >
                            <t-product-edit-summary
                                v-model="dValue"
                                :is-needed-detail-update.sync="dIsNeededSummaryUpdate"
                            />
                            
                        </div>
                    </div>
                </div>
            </div>        
            <div class="col-auto ml-auto mb-3" v-if="cMProductCategoryId !== undefined" >
                <button type="button" class="btn btn-success" 
                @click.prevent="save"
                :disabled="invalid || dIsLoading"
                >
                    <i class="fas fa-save fa-fw"></i>保存
                </button>                 
            </div>

        </validation-observer>
        <div id="modalPrecedingOrder"
             class="modal fade"
             tabindex="-1"
             role="dialog"
             aria-labelledby="modalPrecedingOrder"
             aria-hidden="true"
             style="margin-top: 0px;"
             v-show="dPrecedingOrderListModal">
            <div class="modal-dialog modal-dialog-fluid">
                <div class="modal-content">
                    <div class="app-contents-container text-right">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true" class="text-white">&times;</span>
                        </button>
                    </div>
                    <t-p-order-detail-table
                        ref="precedingOrderListModal"
                        @setPO="setPO($event)"
                        :process-name="dPrecedingOrderProcessName"
                        />
                </div>

            </div>
        </div>

    </div>

</template>

<script>
import NumberUtil from '../../../../frameworks/NumberUtil';
import ObjectUtil from "../../../../frameworks/ObjectUtil" ; 
import { TProjectProduct } from '../../class/models/TProjectProduct';
import { TProjectProductProcess } from '../../class/models/TProjectProductProcess';

// import { defineComponent ,ref,computed, onMounted, reactive } from '@vue/composition-api'
import Vue, { ref,computed,defineComponent,reactive,onMounted } from 'vue';

import DynamicGetSetComputedMixins from '../../../../mixins/commons/DynamicGetSetComputedMixins';

export default defineComponent({ 
    mixins : [DynamicGetSetComputedMixins] , 
    data :  function() {
        return {

            dValue : this.value  , 

            // 変更後の拠点ID
            dChangedMBranchId   : 0 ,

            /**
             * 選択中の拠点
             */
            dSelectedMBranch : undefined, 

            // 材料が手入力
            dIsMaterialInput : false ,

            dSelectedWarrantyMKv : undefined , 
            dSelectedSpecifidMKv : undefined , 

            // 材料を使用する㎡数
            // dMaterialUseSqm     : 0 ,
            // 材料を使用する流れm数
            // dMaterialUseHLength : 0 , 
            // 材料を仕様する本数
            dMaterialUseNumOfRolls : 0 , 

            // 分割されたシート
            // dSeparatedRects : [] , 
            // コストをアップデート
            dIsCostUpdated      : false ,
            // IsBoardをアップデート
            dIsBoardUpdated     : false , 
            // 工程のアップデート( isEnabled )
            dIsProcessesUpdated : false , 
            // BoardLayoutをアップデート
            // dIsBoardLayoutUpdated : false ,

            // 材料のシートの幅マージン
            // dMaterialSheetWidthMargin : 0 , 

            // 加工mm数 ( 形状カット等 )
            dPathLength: 0 , 

            // 加工mm数 ( ハーフカット )
            // dHalfcutPathLength : 0 , 

            // 資材へのレイアウトが成功しているか
            dIsMaterialLayoutSuccess : false , 

            // レイアウトが成功しているリスト
            // dLayoutOkList : [] ,

            // 再描画制御用 ( ないとVueが再利用してしまう )
            // dForIndex : 1  ,

            // 商品データロード中
            dIsLoading : false ,

            // 集計のアップデート
            dIsNeededSummaryUpdate : false , 

            
            dComputedGetSetDefs : [
                
                // 拠点ID
                { key:'cMBranchId' ,propName:TProjectProduct.MBranchId_PName } ,
                // 商品名
                { key:'cName' ,propName:TProjectProduct.Name_PName } ,
                // 納期
                { key:'cDeliveryDate' ,propName:TProjectProduct.DeliveryDate_PName } ,
                // 商品カテゴリーID
                { key:'cMProductCategoryId' ,propName:TProjectProduct.MProductCategoryId_PName } ,
                // 数量
                { key:'cQty' ,propName:TProjectProduct.Qty_PName } ,
                // サイズW
                { key:'cSizeW' ,propName:TProjectProduct.SizeW_PName } ,
                // サイズH
                { key:'cSizeH' ,propName:TProjectProduct.SizeH_PName } ,
                // 伸ばし左 
                { key:'cSizeExtendL' ,propName:TProjectProduct.SizeExtendL_PName } ,
                // 伸ばし右
                { key:'cSizeExtendR' ,propName:TProjectProduct.SizeExtendR_PName } ,
                // 伸ばし上
                { key:'cSizeExtendT' ,propName:TProjectProduct.SizeExtendT_PName } ,
                // 伸ばし下
                { key:'cSizeExtendB' ,propName:TProjectProduct.SizeExtendB_PName } ,
                // ㎡数
                { key:'cSqm' ,propName:TProjectProduct.Sqm_PName } ,
                // 総面積㎡数 ( 面積 * 数量)
                { key:'cTotalSqm' ,propName:TProjectProduct.TotalSqm_PName } ,      

                // 商品分割の重ね代（寸法）
                { key:'cSepOverlapLength' ,propName:TProjectProduct.SepOverlapLength_PName } ,      
                // base64された板レイアウトのSVGイメージ
                { key:'cBoardLayoutBase64Svg' ,propName:TProjectProduct.BoardLayoutBase64Svg_PName } ,      
                // base64された分割レイアウトのSVGイメージ
                { key:'cSeparateBase64Svg' ,propName:TProjectProduct.SeparateBase64Svg_PName } ,      
                // 板レイアウト
                { key:'cBoardLayouts' ,propName:"BoardLayouts" } ,      
                
                // レイアウトOKリスト
                { key:'cLayoutOkList' ,propName:"layout_ok_list" } ,      

                // 売価
                { key:'cSellPrice' ,propName:TProjectProduct.SellPrice_PName } ,      

                
                // 保証
                { key:'cWarrantyMKvId' ,propName:TProjectProduct.WarrantyMKvId_PName } ,      
                // 指定
                { key:'cSpecifiedMKvId' ,propName:TProjectProduct.SpecifiedMKvId_PName } ,  
                // 防炎シールの要不要
                { key:'cIsNeededLabelsForFirePrevention' ,propName:TProjectProduct.IsNeededLabelsForFirePrevention_PName } ,  
                

            ] , 

            dComputedGetDefs : [                
                // 幅(伸ばし込)
                { key:'cSizeIncExtW' ,propName:"SizeIncExtW" } ,
                // 高さ(伸ばし込)
                { key:'cSizeIncExtH' ,propName:"SizeIncExtH" } ,
                // 長手方向の長さ
                { key:'cLongerLength' ,propName:"LongerLength" } ,
                // 長手方向の長さ(伸ばし込)
                { key:'cLongerLengthIncExt' ,propName:"LongerLengthIncExt" } ,
                // 短手方向の長さ
                { key:'cShorterLength' ,propName:"ShorterLength" } ,
                // 短手方向の長さ(伸ばし込)
                { key:'cShorterLengthIncExt' ,propName:"ShorterLengthIncExt" } ,
                // 外周
                { key:'cPerimeter' ,propName:"Perimeter" } ,
                // 外周(伸ばし込)
                { key:'cPerimeterIncExt' ,propName:"PerimeterIncExt" } ,
                // 面積(伸ばし込)
                { key:'cSqmIncExt' ,propName:"SqmIncExt" } ,
                // 重量
                { key:'cWeight' ,propName:"Weight" } ,
                // 総重量
                { key:'cTotalWeight' ,propName:"TotalWeight" } ,
                // 選択されている商品カテゴリー
                { key:'cSelectedMProductCategory' ,propName:"MProductCategory" } ,

                // 総売価
                { key:'cSellTotalPrice' ,propName:"SellTotalPrice" } ,
                // 原価
                { key:'cCost' ,propName:"Cost" } ,
                // 総原価
                { key:'cTotalCost' ,propName:"TotalCost" } ,
                // 利益
                { key:'cProfit' ,propName:"Profit" } ,
                // 総利益
                { key:'cTotalProfit' ,propName:"TotalProfit" } ,
                // 利益率
                { key:'cProfitPer' ,propName:"ProfitPer" } ,
                
                // 表示
                { key:'cDisplay01' ,propName:"Display01" } ,
                { key:'cDisplay02' ,propName:"Display02" } ,
                { key:'cDisplay03' ,propName:"Display03" } ,
                { key:'cDisplay04' ,propName:"Display04" } ,
                { key:'cDisplay05' ,propName:"Display05" } ,

                // 材料シート一覧
                { key:'cMainMaterialSheets' ,propName:"main_material_roll_sheets" } ,

                // 板かどうか
                { key:'cIsBoard' ,propName:"IsBoard" } ,

                // 板かどうか
                { key:'cBoards' ,propName:"BoardMaterialSheets" } ,


                { key:'cPositionsW' ,propName:"PositionsW" } ,
                { key:'cPositionsH' ,propName:"PositionsH" } ,
                

            ] ,

            dPrecedingOrderProcessId : undefined ,
            dPrecedingOrderListModal : false ,
            dPrecedingOrderProcessName : "" ,

            



        } 
    } , 
    props : {
        /**
         * T_PRODUCTSのレコード
         */
        value : { 
            type : Object ,
        },
        /**
         * 拠点ID
         */
        setMBranchId : {
            type : Number 
        } ,
        /**
         * 物件
         */
        tProject : {
            type : Object , 
        } ,
        /**
         * 閲覧モード
         */
        isViewMode : {
            type : Boolean , 
            default : () => true , 
        } ,
        /**
         * 金額表示
         */
        isViewPrice : {
            type : Boolean , 
            default : () => false ,
        } , 
        isViewSellPrice : {
            type : Boolean , 
            default : () => false ,
        } , 
        /**
         * 生産予定日を表示
         */
        isAbleToInputPlanProductionAt : {
            type : Boolean , 
            default : () => false , 
            
        }
        

    } ,    
    watch : {
        value : 
        {
            immediate: true,
            handler :  function (newVal ,oldVal ) {                
                if ( newVal !== undefined )
                {
                    {
                        if (oldVal !== undefined && newVal.toString() == oldVal.toString()) return ;

                        /**
                         * 全部の情報が再計算される前に保存されるとおかしくなる為、対策
                         * 例：選択→即保存
                         */
                        const totalCost = newVal.total_cost ; 
                        if ( totalCost === undefined || totalCost === 0  ){
                            this.dIsLoading = false ;                             
                        } 
                        else {
                            this.dIsLoading = true ;                            

                        }
                        
                        this.dValue = newVal ; 
                        // console.log(this.dValue.total_cost) ; 
                        
                    }
                    
                }
            }
        } ,
                
    } , 
    computed : {        
        /**
         * 閲覧モード
         */
        cIsViewMode : function() {
            return this.isViewMode ; 
        } ,
        /**
         * 再計算前保存対策
         */
        cIsChecking : function() {
            
            if (! this.dIsLoading ) return "" ; 
            
            if ( this.dIsMaterialLayoutSuccess || 
                this.cSelectedMProductCategory === undefined || 
                ! this.cSelectedMProductCategory.is_able_media_separate ){
                this.dIsLoading = false ; 
            }
            
            return "" ; 

        } ,

        /**
         * サイズの入力が必須でない
         */
        cIsNotNeededInputSize : function () {
            if ( this.cSelectedMProductCategory === undefined ) return 0 ; 

            return this.cSelectedMProductCategory.is_not_input_size_needed ; 
            
        } , 
        

        cId : function() {
            return NumberUtil.invalid2zr(this.dValue.id) ; 
        } ,

        //商品コピーフラグ
        cIsCopy : function() {
            return this.dValue.tmp_copy_flg ?? false ;
        } ,
        cMProductCategoryName : function() {
            const finded = this.mainStore.masters.MProductCategories.find(e => e.id ===  this.cMProductCategoryId) ; 
            if ( finded === undefined ) return "" ; 

            return finded.name ; 
        } ,
        // 最大幅のシート
        cMaxWSheet : function()
        {
            // if ( this.dSheets.length === 0 ) return undefined
            if ( this.cMainMaterialSheets .length === 0 ) return undefined ; 

            // const res = this.dSheets.reduce(function (accumulator, currentValue) {                    
            const res = this.cMainMaterialSheets.reduce(function (accumulator, currentValue) {                    
                return accumulator.w > currentValue.w ? accumulator : currentValue ; 
            }) ; 
            
            return res ; 
        } ,
        // シート割が必要かどうか
        cIsMaterialNeededSeparated : function() {
            if ( this.cMaxWSheet === undefined) return false ; 

            const minLen = Math.min(this.cSizeIncExtW , this.cSizeIncExtH) ;            
            const validSheetWidth = this.cMaxWSheet.w - this.dMaterialSheetWidthMargin  ;             
            return minLen > validSheetWidth ; 
            
        } , 
        // シート割が必要かどうか（ハイライト用）
        cIsMaterialSeparateHighlight : function() {
            return this.cIsMaterialNeededSeparated || this.dValue.SeparatedSheets.length > 1 ; 
        } ,

        cTotalProfitTextClass : function() {
            return {
                'app-text-red' :this.cTotalProfit < 0 ,
                'app-text-blue' : this.cTotalProfit >= 0
            }
        } ,

        // 
        cCompName : function () {
            return function(val){
                const cName = "tProductProcess" + val.m_process_category.cd ;  
                //console.log(cName) ; 
                //console.log(this.processItem.pivot.is_required) ; 
                
                //console.log(this.rows) ; 
                return cName ; 

            }
        } , 

        cProcessList : function (){
            
            if ( this.mainStore.masters.MProductCategories === undefined ) return [] ; 

            const found = this.mainStore.masters.MProductCategories.find(e => e.id ===  this.cMProductCategoryId) ; 
            if ( found === undefined) return [] ; 
            const processList = found.link_process_categories_pivot ;  
            
            if ( processList === undefined ) return [] ;             
            return processList ; 

        } ,

        //商品カテゴリに因る数量バリデーション
        cQtyValidRule : function(){

            const found = this.mainStore.masters.MProductCategories.find(e => e.id ===  this.cMProductCategoryId) ; 
            if ( found === undefined || found.permit_negative_qty == 0 ) return 'required|min_value:1' ; 
            if(found.permit_negative_qty == 1) return 'required' ;
            if(found.permit_negative_qty == 2) return 'required|max_value:-1' ;
        } ,

        //商品カテゴリ選択クラス
        cIsActiveCat : function() {
            return function(id) {
                return id === this.cMProductCategoryId
            }
        }

        
    } ,
       
    methods : {
        getValue : function(colName )  
        {            
            return this.$$getValue("dValue" , colName) ; 
        } ,
        setValue : function(colName , val){   
            this.$$setValue("dValue" , colName , val  ) ;

        } ,

        save : function() {            
            this.dValue.warranty_m_kv = this.dSelectedWarrantyMKv ?? null ; 
            this.dValue.specified_m_kv = this.dSelectedSpecifidMKv ?? null ; 

            // display系項目の保存
            for ( const process of this.dValue.t_project_product_processes){
                

            }



            //const enableds = this.dValue.t_project_product_processes.filter(x => x.is_enabled) ; 
            //this.dValue.t_project_product_processes = enableds  ;  

            // this.$emit("save" , ObjectUtil.deepCopyJ(this.dValue)) ; 
            this.dValue.UpdateInfo() ; 
            // console.log(this.dValue) ; 
            this.$emit("save" , this.dValue) ; 
            // Emit input
        } ,
        cancel : function() {
            if(! confirm('編集内容は破棄されます。キャンセルしてよろしいですか?')) return ; 

            this.$emit("cancel") ; 
        } ,
        addRow : function (process ) {
            this.dValue.addProcess(process ) ; 
            
        } , 
        deleteRow : function(process)  
        {
            this.dValue.deleteProcess(process) ; 

            // this.dForIndex = this.dForIndex + this.dValue.t_project_product_processes.length ; 
            
        } ,
        // 拠点変更時
        changeMBranch : function  (id){
            this.dChangedMBranchId = id; 
            if(! confirm('工程の生産先も変更しますか?')) return ; 
            
            for ( const process of this.dValue.t_project_product_processes){
                process.m_branch_id = id ; 
            }

        } ,        
        // 値段変更時
        priceChanged : function(val) {
            // 親の描画用
            //this.$forceUpdate() ; 
        } ,
        // 工程の有効変更時 
        processIsEnabledChanged : function(){
            //console.log("processIsEnabledChanged") ;
            // メディアアップデート
            this.dIsBoardUpdated = true ; 

            // 工程アップデート
            this.dIsProcessesUpdated = true ; 
        } ,
        log : function() 
        {
            //console.log("tProduct") ;             
            //console.log(this.row.processes) ; 
        } , 
        // ProductCategory変更
        selectCategory : function(id)
        {   
            
            this.dIsMaterialLayoutSuccess = false ; 
            // this.dSheets.splice(0) ; 
            this.cMainMaterialSheets.splice(0) ; 

            

            if ( _.isNil(this.cMProductCategoryId)  || 
                id !== this.cMProductCategoryId ) {
                this.cMProductCategoryId = id ; 
                
                this.dValue.m_product_category = this.cSelectedMProductCategory ; 
                //this.$set(this.dValue, "m_product_category_id", id);
                
                const _this = this ; 
                //console.log("_this.dValue.m_branch_id " + _this.dValue.m_branch_id) ; 
                let list = this.cProcessList.map(function(x) {                     
                    //console.log(_this.dValue) ; 
                    const row = {} ; 
                    row.created_m_user_id = _this.$$cLoginUserId ;
                    row.is_enabled  = (  (x.pivot.is_required == 1 || x.pivot.is_default_on == 1) )  ; 
                    row.order_no = x.order_no ; 
                    row.m_branch_id = _this.dValue.m_branch_id ?? 0 ; 
                    row.m_process_category_id   = x.id  ;
                    row.m_process_category      = x     ;
                    row.is_removable            = false ; 
                    row.predicted_work_hour     = 0     ;
                    const parsed = TProjectProductProcess.parse(row ,_this.dValue) ; 
                    return parsed ; 
                    
                }) ;
                
                if ( list === undefined)  list = [] ; 
                this.dValue.t_project_product_processes.splice(0 ) ; 
                
                
                this.$nextTick(function () {
                    // _this.dForIndex += list.length ; 
                    // this.dValue.t_project_product_processes.push(...list) ; 
                    // Array.prototype.push.apply(_this.dValue.t_project_product_processes, list);
                    this.dValue.t_project_product_processes.push(...list) ; 
                    _this.dIsNeededSummaryUpdate = true ; 
                })
                
                //console.log(list)  ; 
                

            }
            
            this.cSepOverlapLength = Number(this.cSelectedMProductCategory.media_separate_overlap_length) ; 

            //console.log(this.dValue.t_project_product_processes) ; 
        } , 
        
        // 該当工程の設定取得
        getProcessSettings : function(name)
        {            
            if ( this.cMProductCategoryId === undefined) return false ; 
            
            const processList = this.mainStore.masters.MProductCategories.find(e => e.id ===  this.cMProductCategoryId).link_processes_pivot ; 
            if ( processList === undefined ||  processList.length === 0 ) return false ; 

            //console.log(processList) ; 
            
            const targetProcess = processList.find(e => e.cd == name) ; 
            if ( targetProcess === undefined || targetProcess.length === 0 ) return false ; 
                
            //console.log(targetProcess) ; 
            return targetProcess ; 

        } ,
        //先行発注紐づけモーダル開く
        selectPrecedingOrder : function(tProcess) {
            
            this.dPrecedingOrderProcessName = tProcess.m_process_category.name
            this.dPrecedingOrderProcessIdx = this.dValue.t_project_product_processes.indexOf(tProcess) ;

            if (!this.dPrecedingOrderProcessId === -1) return ;

            const orderDIds = tProcess.t_p_order_details.map(x=>x.id) ;
            let supId = tProcess.supplier_m_customer_id ;
            if(!supId && this.dValue.t_project_product_boardlayouts?.length) {
                supId = this.dValue.t_project_product_boardlayouts[0]?.m_material_detail?.m_material?.supplier_m_customer_id ?? 0 ;
            } 
            if(!supId) {
                supId = this.dValue.main_material?.supplier_m_customer_id ?? 0 ;
            }

            const param = {
                // material_name : tProcess.display_order_01 ,
                po_material_name : tProcess.display_order_01 ,
                total_price : 0,
                not_in_ids : orderDIds ,
                t_p_order : {
                    m_branch_id : tProcess.m_branch_id ,
                    supplier_m_customer_id : supId ,
                },
                t_project : {
                    name : "",
                },
                m_material_detail : {
                    m_material : {
                    }
                }
            }

            this.$refs.precedingOrderListModal.search(param) ;

            $('#modalPrecedingOrder').modal() ;

            this.dPrecedingOrderListModal = true ;

        } ,
        //先行発注紐づけ処理
        setPO : function(tPOrderDs) {

            this.dValue.t_project_product_processes[this.dPrecedingOrderProcessIdx].t_p_order_details.push(...tPOrderDs) ; ;

            // console.log(this.dValue.t_project_product_processes[this.dPrecedingOrderProcessIdx]) ;

            $('#modalPrecedingOrder').modal('hide') ;

            // this.dPrecedingOrderListModal = false ;
        
        }
    },     
    created : function() 
    {
        //if (this.dValue.is_all   !== undefined ) this.isAll  = this.dValue.is_all ;         
        if (this.dValue.t_project_product_processes === undefined ) 
        {            
            this.$set(this.dValue , "t_project_product_processes" ,[] ) ; 
        }

        if (this.cSellPrice === undefined ) this.cSellPrice = 0 ; 

        // if (this.cSizeW === undefined) this.cSizeW = 0 ; 
        // if (this.cSizeH === undefined) this.cSizeH = 0 ; 

        // if (ObjectUtil.isNullOrUndefined( this.cSizeExtendL)) this.cSizeExtendL = 0 ; 
        // if (ObjectUtil.isNullOrUndefined( this.cSizeExtendR)) this.cSizeExtendR = 0 ; 
        // if (ObjectUtil.isNullOrUndefined( this.cSizeExtendT)) this.cSizeExtendT = 0 ; 
        // if (ObjectUtil.isNullOrUndefined( this.cSizeExtendB)) this.cSizeExtendB = 0 ; 

        if (this.cQty === undefined || this.cQty === 0 ) this.cQty = 1 ; 

        
        //console.log(this) ; 
    }

});
</script>
<style scoped>


/* 金額の入力項目(8桁まで)*/

.app-input-price{
    width:8em!important; 
}
a[class="nav-link"]{
    color : white !important;
}

.text-ignore:hover { 
    color:#68b3fb !important ; 
}
.text-ignore:focus { 
    color:#a8d3fb !important ; 
    background-color: #343a40 !important ; 
    border-color : #343a40 ; 
}
.sticky-header {
    position: sticky;
    position: -webkit-sticky; /* Safari */
    top: 50px;
    background-color: #495057!important;
    z-index: 1020!important;
}

</style>