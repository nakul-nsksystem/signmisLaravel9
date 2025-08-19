<template>
    <div class="table-responsive">
        <table class="table table-striped table-dark text-nowrap">
                        
            <thead>
                <tr>
                    <th>{{props.title}}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>会社名</th>
                    <td>{{cValue.company}}</td>
                </tr>
                <tr>
                    <th>担当者名</th>
                    <td>{{cValue.name_last}}&nbsp;{{cValue.name_first}}</td>
                </tr>
                <tr>
                    <th>住所</th>
                    <td>
                        <div v-show="!_.isNil(cValue.zip)">〒{{cValue.zip}}</div>
                        <div>{{cValue.city}}&nbsp;{{cValue.address1}}</div>
                        <div v-show="!_.isNil(cValue.phone)">TEL：{{cValue.phone}}</div>
                    </td>
                </tr>
                <tr>
                    <th>メール</th>
                    <td>{{cValue.email}}</td>
                </tr>
                <tr>
                    <th>備考</th>
                    <td>
                        <div v-for="n in 3">
                            {{cValue[`ext_field_${n}`]}}
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script lang="ts" setup>
    import Vue, { computed } from 'vue';
    import _ from 'lodash'

    interface IProps {
        value?:any
        title?:string
    }
    const props = withDefaults(defineProps<IProps>(), {
        value : {} ,
        title : ""
    })

    const cValue = computed(() => props.value) ;

    

</script>
