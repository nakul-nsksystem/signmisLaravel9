import axios from "axios";
import _ from 'lodash' ;
import getThumbnailControl from "../../../../../asset/getDropboxThumbnailControl.json";

export type DropboxPost = {
    lastModified: any ;
    lastModifiedDate: Date ;
    name: string ;
    size: number ;
    type: string ;
    webkitRelativePath: string ;

}

//画面から渡すパラメータ
export type vueParam = {
    common_path : string ; //共通パス ex)物件添付ファイル/public/temporary/t_project
    parent_path : string ; //親パス指定したいとき
    uploading   : any ; //アップロード中プログレスバーに値渡し
}

//サムネイル呼び出し用パラメータ
export type thubnailParam = {
    path:string ,
    filesize:number ,
    extension:string ,
    token:string|undefined ,  //dropboxApiトークン
    
    /**解像度
     * 'w32h32' 
     * 'w64h64' 
     * 'w128h128'  
     * 'w256h256'  
     * 'w480h320'  
     * 'w640h480' 
     * 'w960h640'  
     * 'w1024h768'  
     * 'w2048h1536' 
     * */
     resolution:string ,

}


export class DropboxService{

    ep:string = `api/tProjectFile`  ;

    Dropbox = require('dropbox').Dropbox;

    //一気にアップロード出来るMAXのファイルサイズ定義
    fizeLimit = 150 * 1024 * 1024;

    //一気にアップロード出来ない場合、150MBのチャンクに分けてアップする
    maxBlob = 150 * 1000 * 1000 ;


    //230823追加　uploadのみcorsのエラーがでるようになった。リクエストヘッダーをカスタムする
    customHeader = {
        "Content-Type" : "text/plain; charset=dropbox-cors-hack" ,
    }


    constructor(){}

    /**
     * DropBoxアクセストークン取得
     * @returns
     */
    public async getAccessToken():Promise<string>{

        return new Promise(async (resolve,reject) => {
            const apiUrl = `${this.ep}/getAccessToken` ;
            try {
                //console.log(JSON.stringify(conditions)) ;
                const res = await axios.get(apiUrl) ;
                const token:string = res.data  ;

                // console.log(token)
                resolve(token) ;

            }
            catch (error ) {
                // @ts-ignore
                error.ep = apiUrl ;
                alert("dropbox認証に失敗しました")
                reject(error) ;

            }

        }) ;
    }

    /**
     * 指定したパスに存在するファイルのリストを取得
     * dropboxへの接続確認に使用
     * @param path ファイルを確認するpath
     *
     */
    public async getFileList (path:string) {

        const token = await this.getAccessToken() ;
        const dbx = new this.Dropbox({ accessToken: token ,customHeaders: this.customHeader});

        dbx.filesListFolder({path: path})
            .then(function(response:any) {
                console.log(response);
            })
            .catch(function(error:any) {
                console.log(error);
            });

    }

    /**
     * 直前までのディレクトリ取得
     */
    public getDirName (path : string) {
        if(!path) return
        let result = path.replace(/\\/g, '/').replace(/\/[^/]*$/, '');
        if (result.match(/^[^/]*\.[^/\.]*$/)) {
            result = '';
        }
        return result
    }

    /**
     * フォルダ成型用pathデータ成形
     *@param file ファイル
     *@return pathの配列
     */
    public createPathArr  (file:any) {

        const _this = this ;

        const dirArr = file.map(function(x:any){
            return _this.getDirName(x.parent_path)
        })

        //@ts-ignore
        const folderList = dirArr.filter( (ele,pos)=>dirArr.indexOf(ele) == pos);

        return folderList ;

    }

    /**
     * フォルダの情報を再帰的に抽出する
     * 要リファクタ
     */
    public async scanFiles (entry:any  ,tmpObject:Array<object>) {

        const _this = this ;

        if(entry.isDirectory) {

            const entryReader = entry.createReader();
            const entries = await new Promise(resolve => {
                //@ts-ignore
                entryReader.readEntries(entries => resolve(entries));
            }) ;
            //@ts-ignore
            await Promise.all(entries.map(entry => _this.scanFiles(entry, tmpObject)));

        } else {
            // console.log(entry)
            tmpObject.push(entry) ;
        }

    }

    /**
     * ドラッグドロップされたファイルデータをDropbox向けに変更しアップロード
     * 要リファクタ
     * @param files ファイルのデータ
     * @param vueParam vueから渡す他の値  
     */
    public async formatAndUploadDropFiles (files:any, vueParam:vueParam) {

        const results : any = [];
        const promise = [];
        const dropedFile: Array<object> = [] ;

        for (const item of files) {
            const entry = item.webkitGetAsEntry();
            promise.push(this.scanFiles(entry, results));
        }

        await Promise.all(promise);

        for(let result of results) {
            const fullpath = result.fullPath.slice(1)
            await new Promise(resolve=>{
                //@ts-ignore
                result.file(file=>{
                    //複数階層かチェック
                    if(this.getDirName(result.fullPath)) file.parent_path = fullpath;
                    resolve(dropedFile.push(file));
                })

            })

        }
        await Promise.all(dropedFile);

        const rt = await this.uploadFile(dropedFile,vueParam) ;

        return rt ;


    }



    /**
     * ファイルのアップロード
     * @param files ファイルのデータ
     * @param vueParam vueから渡す他の値 
     * @returns
     */
    public async uploadFile (files:any, vueParam:vueParam) {

        const _this = this ;
        const token = await this.getAccessToken() ;

        const dbx = new this.Dropbox({ accessToken: token ,customHeaders:this.customHeader}) ;
        
        let returnArr: Array<object> = [] ;

        for ( const file of files) {

            if(vueParam.uploading !== undefined) vueParam.uploading(0) ;

            let path = vueParam.common_path ;
            const parentPath = file.parent_path ?? file.webkitRelativePath ?? vueParam.parent_path ;
            parentPath ? path += `/${parentPath}` : path += `/${file.name}` ;

            const extension : any = path.match(/[^.]+$/) ;

            /**
             * ドロップボックスの仕様上、一度に送ることができるデータ量は、150MB。分割してアップロードする
             * fizeLimit　で一度に送る最大容量サイズを設定
             * maxBlob　でチャンクサイズを設定
             */
            //一気にアップロード出来る場合
            if(file.size < this.fizeLimit) {
                try {
                    let res = await dbx.filesUpload({path: path , contents: file})
                    const respRow = res.result  ;
                    respRow.extension = extension[0] ;                    
                    
                    if(vueParam.uploading !== undefined) {
                        await vueParam.uploading(100) ;
                    }

                    const thumbnailParam : thubnailParam = {
                        path : path ,
                        filesize : file.size ,
                        extension : extension[0] ,
                        token :token ,  
                        resolution : "w480h320" , 
                    }

                    respRow.base64_thumbnail = await this.getBase64Thumbnail(thumbnailParam) ;
                    // respRow.base64_thumbnail = await this.getThumbnail(path,file.size,extension[0],token) ;
                    if(!respRow.parent_path) respRow.parent_path = parentPath ;

                    returnArr.push(respRow) ;

                } catch (error) {

                    alert(file.name + "のアップロードに失敗しました")

                } finally {

                    if(vueParam.uploading !== undefined) vueParam.uploading(undefined) ;
                    continue ;

                }

            //分割してアップロードする場合
            } else {

                const workItems = [] ;

                let offset = 0;

                //サイズから150MBずつ分割
                while (offset < file.size) {
                    let chunkSize = Math.min(this.maxBlob, file.size - offset) ;
                    workItems.push(file.slice(offset, offset + chunkSize)) ;
                    offset += chunkSize ;
                }

                try {
                    
                    let process = 0 ;

                    const task = await workItems.reduce((acc, blob, idx, items) => {

                        if (idx == 0) {
                            //最初のチャンク
                            return acc.then(function() {
                                return dbx.filesUploadSessionStart({ close: false, contents: blob})
                                //@ts-ignore
                                .then(function(response){
                                    process += (blob.size /file.size) ;
                                    if(vueParam.uploading !== undefined) vueParam.uploading(Math.floor(process*100)) ;
                                    return response.result.session_id ;
                                } )
                                
                            });
                            
                        } else if (idx < items.length-1) {
                            // 中間チャンク
                            return acc.then(function(sessionId:string) {
                                let cursor = { session_id: sessionId, offset: idx * _this.maxBlob } ;
                                return dbx.filesUploadSessionAppendV2({ cursor: cursor, close: false, contents: blob })
                                .then(function(){
                                    process += (blob.size /file.size) ;
                                    if(vueParam.uploading !== undefined) vueParam.uploading(Math.floor(process*100)) ;
                                    return sessionId ;
                                })
                            });

                        } else {
                            //最後のチャンクの処理
                            return acc.then(function(sessionId:string) {
                                let cursor = { session_id: sessionId, offset: file.size - blob.size } ;
                                let commit = { path: path, mode: 'add', autorename: true, mute: false } ;
                                return dbx.filesUploadSessionFinish({ cursor: cursor, commit: commit, contents: blob })
                                //@ts-ignore
                                .then(function(response){
                                    process += (blob.size /file.size) ;
                                    if(vueParam.uploading !== undefined) vueParam.uploading(Math.floor(process*100)) ;
                                    return response ;
                                })
                            });

                        }
                        

                    }, Promise.resolve()) ;

                    if(vueParam.uploading !== undefined) {
                        await vueParam.uploading(101) ;
                    }

                    const thumbnailParam : thubnailParam = {
                        path : path ,
                        filesize : file.size ,
                        extension : extension[0] ,
                        token :token ,  
                        resolution : "w480h320" , 
                    }

                    const respRow = task.result  ;
                    respRow.extension = extension[0] ;                    
                    respRow.base64_thumbnail = await this.getBase64Thumbnail(thumbnailParam) ;
                    if(!respRow.parent_path) respRow.parent_path = parentPath ;

                    returnArr.push(respRow) ;

                } catch (error) {

                    alert(file.name + "のアップロードに失敗しました") ;

                } finally {

                    if(vueParam.uploading !== undefined) vueParam.uploading(undefined) ;
                    continue ;


                }

            }


        }

        return returnArr ;


    }

    public async filesSaveUrl(url:string,filename:string,vueParam:vueParam) {
        const _this = this ;
        const token = await this.getAccessToken() ;
        const dbx = new this.Dropbox({ accessToken: token }) ;

        if(vueParam.uploading !== undefined) vueParam.uploading(0) ;

        let path = vueParam.common_path ;
        path += `/${filename}`

        const extension : any = path.match(/[^.]+$/) ;

        try {
            let res = await dbx.filesSaveUrl({path:path, url:url})
            
            //uploadが終わる前にresponseが返ってくるため完了するまで状態を取得
            let status = await dbx.filesSaveUrlCheckJobStatus({async_job_id:res.result.async_job_id}) ;
            while (status.result['.tag'] == 'in_progress') {
                await this.sleep(3000);
                status = await dbx.filesSaveUrlCheckJobStatus({async_job_id:res.result.async_job_id})
            } 

            //取得失敗
            if (status.result['.tag'] == "failed") {
                alert(`${filename}を取得できませんでした`)
                return {} ;
            }
            
            const respRow = status.result  ;
            respRow.extension = extension[0] ;                    
            
            if(vueParam.uploading !== undefined) {
                await vueParam.uploading(100) ;
            }

            const thumbnailParam : thubnailParam = {
                path : path ,
                filesize : 0 ,
                extension : extension[0] ,
                token :token ,  
                resolution : "w480h320" , 
            }

            respRow.base64_thumbnail = await this.getBase64Thumbnail(thumbnailParam) ;

            return respRow

        } catch (error) {

            alert("アップロードに失敗しました")

        } finally {

            if(vueParam.uploading !== undefined) vueParam.uploading(undefined) ;

        }
    }

    protected sleep (ms:number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    //base64のサムネイル取得
    public async getBase64Thumbnail (param:thubnailParam) {

        return new Promise(async (resolve,reject) => {

            /**各拡張子ごとにサムネイルを取得できるファイルのサイズを指定している */
            const reference = getThumbnailControl.find( e => e.extension === param.extension) ;
            const limitSize = reference?.limitMb ?? 100 ;

            if(param.filesize > limitSize * 1024 * 1024){
                console.log("cannot generate thumbnail")
                resolve("img/noimage.png") 
                return ;
            } 
            
            const useToken = param.token ?? await this.getAccessToken() ;

            const dbx = new this.Dropbox({ accessToken: useToken });

            try {                
                let res = await dbx.filesGetThumbnail({path: param.path ,format:"jpeg" ,size:param.resolution})
                
                let reader = new FileReader();            
                reader.readAsDataURL(res.result.fileBlob);
                reader.onload = () =>{
                    //@ts-ignore
                    const r = reader.result.slice(reader.result.indexOf(',') + 1) ;                    
                    resolve(r) ;
                } ; 

            } catch (error) {

                resolve("img/noimage.png") ;
                // alert("サムネイルの取得に失敗しました"); 
                return ;

            }
        })

    } 

    //サムネイル取得
    public async getThumbnail (path:string ,filesize:number ,extension:string ,token:string) {

        return new Promise(async (resolve,reject) => {

            const reference = getThumbnailControl.find( e => e.extension === extension) ;
            const limitSize = reference?.limitMb ?? 100 ;

            if(filesize > limitSize * 1024 * 1024){
                resolve("img/noimage.png") 
                return ;
            } 
            
            const useToken = token ?? await this.getAccessToken() ;
            const dbx = new this.Dropbox({ accessToken: useToken });

            try {                
                
                let res = await dbx.filesGetThumbnail({path: path ,format:"jpeg" ,size:"w480h320"}) ;
                // console.log(res.result) ;
                resolve(res.result.fileBlob) ;

            } catch (error) {

                resolve("img/noimage.png") ;
                // alert("サムネイルの取得に失敗しました"); 
                return ;

            }
        })

    } 

    //ファイルダウンロード
    public async downloadFile (path:string):Promise<void>{
        return new Promise(async (resolve,reject) => {

            try {
                const token = await this.getAccessToken() ;
                const dbx = new this.Dropbox({ accessToken: token });
                //@ts-ignore
                const filename:string = path.split('/').pop().split('\\').pop();

                dbx.filesDownload({path: path})
                .then(function(response:any) {
                    const fileURL = window.URL.createObjectURL(response.result.fileBlob);
                    const fileLink = document.createElement('a');
                    fileLink.href = fileURL;
                    fileLink.setAttribute('download', filename);
                    document.body.appendChild(fileLink);
                    fileLink.click();
                    resolve()
                })
                .catch(function() {
                    
                    alert("ダウンロードに失敗しました"); 
                    reject()
                    // console.error(error);
                }); 
            } catch (error) {
                alert("ダウンロードに失敗しました"); 
                reject()
            }
            
        })


    }

    
    //フォルダダウンロード
    public async downloadZip (path:string):Promise<void>{
        
        return new Promise(async (resolve,reject) => {

            try {
                const token = await this.getAccessToken() ;
                const dbx = new this.Dropbox({ accessToken: token });
                
                //@ts-ignore
                const foldername:string = path.split('/').pop().split('\\').pop();

                dbx.filesDownloadZip({path: path})
                .then(function(response:any) {

                    const fileURL = window.URL.createObjectURL(response.result.fileBlob);
                    const fileLink = document.createElement('a');
                    fileLink.href = fileURL;
                    fileLink.setAttribute('download', foldername);
                    document.body.appendChild(fileLink);
                    fileLink.click();
                    resolve()
                })
                .catch(function() {

                    alert("ダウンロードに失敗しました"); 
                    reject()
                    // console.error(error);
                }); 
            } catch (error) {
                alert("ダウンロードに失敗しました"); 
                reject()

            }
            

        })


    }

    //保存済のファイルの公開リンクを取得する
    public async getSharedLink (path:string) {

        return new Promise(async (resolve,reject) => {

            const token = await this.getAccessToken() ;
            const dbx = new this.Dropbox({ accessToken: token });

            try {                
                
                let res = await dbx.sharingCreateSharedLink({path:path }) ;
                // let res = await dbx.sharingCreateSharedLinkWithSettings({path:path }) ;
                resolve(res) ;

            } catch (error) {
                // console.log(error)
                reject(error)

            }
        })

        
    
    }



}
