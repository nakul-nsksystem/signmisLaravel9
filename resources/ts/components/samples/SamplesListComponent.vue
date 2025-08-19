<template>
    <div>

        <p>
            List
        </p>
        
        <ul>
            <li v-for="item in sampleList" :key="item.id">
                {{item.name}}
            </li>
            <button @click="$emit('select-item' , sampleList[1])" >Select</button>
        </ul>
    
    </div>
</template>
<script>
export default {
    props : {
        sampleList : {
            type : Array 
        }
    }  ,
    methods : {
        selectItem(item) {
            $emit(changeSelectedItem ,item ) ; 
        }
    }
}
</script>