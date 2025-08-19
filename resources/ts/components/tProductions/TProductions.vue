<template>
    <div>        
        
        <router-link class="nav-link" to="plan" title="" append>
            生産計画
        </router-link>            
        <router-link v-if="$$cIsNskDev" class="nav-link" to="result" title="" append>
            生産実績
        </router-link>  
    </div>    
</template>
<script>



</script>
