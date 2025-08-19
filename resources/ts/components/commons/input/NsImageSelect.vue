<template>
    <label>
        <div class="w-100 d-flex">
            <a class="btn ml-auto text-white" @click.prevent.stop="remove">
                <i class="fas fa-times "  />
            </a >            
        </div>
        
        <picture>
            <source :srcset="url" />
            <img class="object-contain" :src="defaultImageUrl" alt="No Image"  />            
        </picture>
        <input type="file" ref="inputFile"
            :accept="accept"
            @change="change"
            hidden
            />
    </label>

</template>
<script lang="ts">
// import { defineComponent ,ref,computed, onMounted, reactive } from '@vue/composition-api'
import Vue, { ref,computed,defineComponent } from 'vue';


export default defineComponent({ 
    props:{        
        url : { 
            type:String ,
            default : ""
        } , 
        accept : { 
            type:String ,
            default : ".jpg,.gif,.png,webp,image/gif,image/jpeg,image/png,image/webp"
        } , 
        defaultImageUrl: {
            type:String ,
            default : "img/noimage.png"
        } ,
        
    } , 
    emits : ['url:title','update:url','update:file','update:is-changed'],        
    setup :  (props ,context) => {
        const inputFile = ref(null) ; 

        const change = () => { 
            // @ts-ignore
            const file = inputFile.value.files[0];
            context.emit('update:url' , URL.createObjectURL(file)) ; 
            context.emit('update:file' , file) ; 
            context.emit('update:is-changed' , true) ; 
        }

        const remove = () => { 
            context.emit('update:url' , null) ; 
            context.emit('update:file' , null) ; 
            context.emit('update:is-changed' , true) ; 
        }

        return {
            change ,
            remove , 
            inputFile

        };

    }

});


</script>
