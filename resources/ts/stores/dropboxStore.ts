import { DropboxService } from '../components/tProjects/class/services/DropboxService';
import { defineStore } from "pinia"
import Vue, { ref } from 'vue';

export const useDropboxStore = defineStore('dropbox', () => {
    
    const dropboxService:DropboxService = new DropboxService() ; 
    
    // console.log(dropboxService)
    return { dropboxService } ;
})

