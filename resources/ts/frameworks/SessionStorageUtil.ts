export class SessionStorage {
    // Storageオブジェクト
    private _storage = sessionStorage ;
    // ストレージが存在しない場合は空オブジェクトを生成
    private _data = JSON.parse(this._storage.getItem(this._name) || '{}') ;
    // コンストラクタ
    constructor(private _name: string) {} ;

    // ストレージ存在チェック
    isEmpty() : boolean {
        return !Object.keys(this._data).length ;
    }

    // 個別表示
    getItem(key: string) : string {
        return this._data[key] ;
    }

    // 個別設定
    setItem(key: string, value: string) : void {
        this._data[key] = value ;
    }

    // ストレージの取得
    getData() : string {
        if (!this.isEmpty()) {
            try {
                // ソート項目は取得しない
                if (this.getItem("sort")) {
                    this._data["sort"] = "" ;
                }
            } catch (e) {
                // no operation
            }
        }

        return this._data ;
    }

    // 保存
    save(value?: string) : void {
        // saveメソッドが実行されたタイミングでsessionStorageに保存される
        if (typeof value === "undefined") {
            // 引数が無い場合はそのまま保存
            this._storage.setItem(this._name, JSON.stringify(this._data)) ;
        } else {
            // 引数を指定して保存
            this._storage.setItem(this._name, JSON.stringify(value)) ;
        }
    }

    // 削除
    remove() : void {
        this._storage.removeItem(this._name) ;
    }
}