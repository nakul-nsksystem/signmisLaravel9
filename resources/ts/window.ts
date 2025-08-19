import Vuex from "vuex" ; 

interface MyWindow extends Window {  
    Vue : Vue , 
    Vuex: Object  ,
    vueapp : Vue ,
    Popper : any ,
    axios : any ,
    jQuery : any ,
    _ : any , 
    $: any , 
    Inflector : any , 
    DayJs : any , 
}  
declare var window: MyWindow;  
export default window;