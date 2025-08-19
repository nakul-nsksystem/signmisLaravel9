<?php
 
namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasOneOrMany ; 
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\MassAssignmentException;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

 
/**
 * 認証機能持ち以外のモデルのベース
 */
abstract class BaseModel extends Model
{
    // pagination: 
    // 1ページの表示件数(デフォルト15)を変更する場合はコメントアウトして10等の値に変更する
    // protected $perPage = 15;

    // fillWithChildrenの際に一緒にいれたいモデル
    // Model上の子供を取得するメソッド名
    protected $childModels = []; 
    public function getChildModels() {
        return $this->childModels ; 
    }

    // fillWithChildrenの際にDeleteInsertしたいモデル
    // Model上の子供を取得するメソッド名
    protected $delInsChildModels = [];
    public function getDelInsChildModels() {
        return $this->delInsChildModels ; 
    }

    // 一緒に削除したく無い子モデル
    protected $unDeleteIncChildren = [] ; 

    // fillWithChildrenの際にsyncしたいPivot
    protected $syncPivotModels = [] ; 
    public function getSyncPivotModels() { 
        return $this->syncPivotModels ; 
    }

    // sync　するPivotの値の配列（ push / save で保存した後に使用する ) 
    protected $syncPivotValues = [] ;     
    public function getSyncPivotValues() {
        return $this->syncPivotValues ; 
    }
    
    // fillWithChildrenの際にunsetしたい項目
    protected $unsetChildren = [] ;
    

    public function getAllRelations() 
    {
        $keys = array_keys($this->childModels) ; 
        foreach ($keys as $name)
        {            
            $this->$name ; 
        }
        return $this->getRelations() ; 
    }

    
    /**
     * Fill the model with an array of attributes.
     *
     * @param  array  $attributes
     * @return $this
     *
     * @throws \Illuminate\Database\Eloquent\MassAssignmentException
     */
    public function fill(array $attributes)
    {
        
        $totallyGuarded = $this->totallyGuarded();
        $this->syncPivotValues = [] ; 
        
        foreach ($this->fillableFromArray($attributes) as $key => $value) {
            // The developers may choose to place some attributes in the "fillable" array
            // which means only those attributes may be set through mass assignment to
            // the model, and all others will just get ignored for security reasons.
            if ($this->isFillable($key)) {
                $this->setAttribute($key, $value);
            } else {
                $cameledTName = Str::studly($key) ; 
                // Log::debug($cameledTName) ; 
                if ( array_key_exists($cameledTName ,$this->syncPivotModels ) ) {     
                    // Log::debug($cameledTName . " Exists") ; 
                    $this->syncPivotValues[$key] = $value ; 
                }
                elseif ( $totallyGuarded) { 
                    throw new MassAssignmentException(sprintf(
                        'Add [%s] to fillable property to allow mass assignment on [%s].',
                        $key, get_class($this)
                    ));
                }
            }
        }
        if ( count($this->syncPivotValues) > 0){
            //Log::debug(print_r($this->syncPivotValues , true))  ; 
        }
        

        return $this;
    }

    /**
     * リレーションを参照した自動キー割り当て機能を搭載したpushメソッド.
     * 再帰によって呼び出し済みのリレーション先全てをsaveする.
     * @return bool
     */
    public function push($isNotSave = false )
    {        
        //Log::debug("Pushed " . $this->getTable() . " " . $this->id)  ; 
        if (! $isNotSave && ! $this->save()) {
            return false;
            
        }
        // Log::debug("Pushe " . $this->id ) ; 
        //Log::debug($this->getRelations() ) ; 
        // すべての関係をデータベースに同期するために単にスピンスルーします
        // 関係を作成し、このpushメソッドを介して各モデルを保存します。
        // モデルインスタンスのこれらのネストされたリレーションすべてに再帰します。
        foreach ($this->getRelations() as $relationName => $models) {
            // Log::debug("rel " . $relationName) ; 
            $models = $models instanceof Collection ? $models->all() : [$models];
            
            foreach (array_filter($models) as $model) {
                // Log::debug("model") ; 
                // Log::debug($model) ; 
                // HasOneOrManyがあった上で保存に失敗したらreturn false                
                if (method_exists($this, $relationName) && $this->$relationName() instanceof HasOneOrMany) {
            
                    if ($this->$relationName()->save($model)) {
                        $successSave = true;
                    } else {
                        return false;
                    }
                }
                //LOg::debug("success : " . $successSave) ;  
                // 再帰
                // if (! $model->push($successSave ?? false)) {
                if (! $model->push($successSave ?? false)) {
                    return false;
                }
            }
        }
 
        return true;
    }

    /**
    * 子テーブルごと中身をDeleteする
    */
    public function deleteWithChildren() {         
        $relations = $this->getAllRelations() ; 

        // 子テーブル処理
        $pKey = $this->getKeyName();
        
        if ( isset($this[$pKey]))
        {
            //Log::debug($pKey) ;
            
            foreach ($relations as $relationName=> $models) {

                if (in_array($relationName, $this->unDeleteIncChildren)) continue ; 
                 
                // 子供の削除
                $children = $this->$relationName ; 

                foreach($children as $rel)
                {
                    $rel->deleteWithChildren() ;
                    
                }
                    
            }
    
        }

        
        return $this->delete() ; 

    }    

    
    /**
    * 子テーブルごと中身をfillする
    *
    * @param array $data $request->all() 的な内容
    */
    public function fillIncChildren( $data  ) { 
        $className  = get_class($this) ; 
        $pKey       = $this->getKeyName() ;
        $relations  = $this->getAllRelations() ; 
        // Log::debug($className) ; 
        // Log::debug(" relations") ; 
        // Log::debug($relations) ; 
        
        $childModels = $this->getChildModels() ; 
        $delInsChildModels = $this->getDelInsChildModels() ; 

        // 子テーブル処理
        foreach ($relations as $relationName=> $models) {

            //Log::debug("aa") ; 
            //Log::debug($this->$relationName()->getForeignKeyName()) ;  
            //  Log::debug(' ' . $relationName) ; 

            // 子テーブルのModel取得

            if (! isset($childModels[$relationName])) continue ; 

            $cModel = $childModels[$relationName] ; 
            $cRow = new $cModel() ;                 
            $cTableName = $cRow->getTable();
            $cPKey = $cRow->getKeyName();
            $isBelongToMany = $this->$relationName() instanceof BelongsToMany ; 

            

            if ( $isBelongToMany){
                $cForeignKey = "" ; 
                // Log::debug($className . " " . $relationName . " Pivot " .  $cForeignKey  . " " . $this->$relationName()->getRelatedPivotKeyName()) ;
                // $cForeignKey = $this->$relationName()->getForeignPivotKeyName() ;                 
                
                // continue ; 
            }   
            else { 
                $cForeignKey = $this->$relationName()->getForeignKeyName() ; 
            }
            
            
            
            if (! array_key_exists( $relationName , $childModels) )
            {
                // 設定なし
                Log::debug($className .  "のchildModels に " . $relationName . "が設定されていません。") ; 
                
            }
            else
            {
                
                // Log::debug("   cTableName = " . $cTableName . " pKey = " . $cPKey) ; 
                // Delete Insert扱いのテーブル
                if ( array_key_exists($relationName , $delInsChildModels)) {
                    //Log::debug("delIns cTableName = " . $relationName ) ; 
                    $this->$relationName()->delete() ; 
                }

                // データ上に子テーブルの内容が存在するかチェック
                if ( array_key_exists ( $cTableName , $data ))
                {
                    // データ上に子テーブルの内容が 存在する

                    // データの退避
                    $childrenData = $data[$cTableName] ; 

                    // Pivotのデータはアンセットしない
                    $cameledTName = Str::studly($cTableName) ;                     
                    if (! array_key_exists($cameledTName ,$this->syncPivotModels ) ) {     
                        unset($data[$cTableName]) ; 
                    }

                    // 1行ごと処理
                    if ( isset($childrenData))
                    {
                        foreach ($childrenData as $childData ) 
                        {   
                            //240708追加DelInテーブル処理
                            if ( isset ($childData[$cPKey]) && !array_key_exists($relationName , $delInsChildModels))
                            {
                                // 既存データ取得
                                $cPId = $childData[$cPKey] ;                                 
                                //$this->$relationName ; 
                                //$cRow = $this->$relationName->find($cPId) ; 
                                //$cRow = $cModel::find($cPId) ; 
                                // Log::debug("r " . $relationName) ; 
                                $cRow = $this->$relationName->find($cPId) ; 
                                // Log::debug("cModel") ; 
                                // Log::debug($models) ; 
                                // Log::debug($cRow) ; 
                                if ( is_null($cRow )) {
                                    $cRow = $cModel::find($cPId) ; 

                                    
                                    if ( is_null($cRow )) {
                                        // 他で消されてるとか                                                                         
                                        $parentPId = isset($this[$pKey]) ? $this[$pKey] : "0" ; 
                                        Log::debug("When try to update " . $relationName . ".id = " . $cPId . ". but the record is not exists on Parent.id = " . $parentPId ) ;
                                        continue ; 

                                    }
                                    else  { 
                                        // 親が変わったパターン
                                        // Log::debug("Changed parent_id " . $relationName . ".id = " . $cPId ) ;
                                        if ( $cForeignKey !== "" && isset($cRow[$cForeignKey])) $cRow[$cForeignKey] = null ; 
                                        $this->$relationName[] = $cRow ; 
                                        // Log::debug($cRow) ; 
                                        
                                    }

                                }
                                else
                                {
                                    // Log::debug($relationName . " ID = " . $cPId . "DelAt:" . $childData["deleted_at"]) ; 
                                    if ( isset($childData["deleted_at"] ) )
                                    {
                                        // Delete                                        
                                        //$cRow->delete() ; 
                                        // Log::debug($relationName . " Delete ID = " . $cPId) ; 

                                        if ( $cRow instanceof BaseModel )
                                        {
                                            // Log::debug($this->unDeleteIncChildren) ; 
                                            if ( in_array($relationName , $this->unDeleteIncChildren))
                                            {
                                                // Log::debug("A") ; 
                                                $cRow->delete() ; 
                                            }
                                            else {
                                                // Log::debug("B") ; 
                                                $cRow->deleteWithChildren() ; 
                                                continue ; 
                                            }
                                            // 子供も削除                                            
                                            
                                            
                                        }
                                        else
                                        {
                                            $cRow->delete() ; 
                                        }
                                        // 
                                    }
                                    else
                                    {
                                        // Update 
                                    }
                                }
                            }
                            else
                            {
                                // Insert 
                                // Insertの場合 既に$cRow new済み 
                                $cRow = new $cModel() ;              
                                $this->$relationName[] = $cRow ; 

                                
                            }
                            // Insert or Update 
                            // Insertの場合 既に$cRow new済み
                            // Log::debug("AA") ; 
                            // Log::debug($relationName ) ; 
                            
                            $cRow->fillIncChildren( $childData ) ;   // ( 子テーブル再帰 )
                            

                        }    
                    }
                }
                else
                {
                    // データ上に子テーブルの内容が 存在しない
                }
            }
        }

        foreach ($this->unsetChildren as $unsetChild) 
        {
            unset($data[$unsetChild]); 
        }
        //Log::debug($className ) ; 
        //Log::debug($data ) ; 

        
        $this->fill($data) ; 


    }

    

    /**
    * テーブルの外部キーの値をクリアしてコピー
    */
    protected function replicateWithChildren() {         
        
        $newRow = $this->replicate() ; 
        
        $relations = $newRow->getChildModels() ;         
        

        // 子テーブル処理
        $pKey = $this->getKeyName();
        unset($newRow[$pKey]) ; 
        
        
        foreach ($relations as $relName => $relClass)
        {   
            //Log::debug($relName ) ; 
            //Log::debug($relClass ) ; 

            // リレーション定義取得            
            $rel = $this->$relName() ; 
            $foreignKey = $rel->getForeignKeyName() ; 

            if ( $rel instanceof HasMany ){
                // HasMany
                //Log::debug($relName . ' is hasMany' ) ; 
                $copiedRows = array() ; 

                $relRows = $this->$relName ; 
                //Log::debug($newRow->$relName) ; 
                foreach ( $relRows as $relRow){

                    //Log::debug(is_null($relRow) ) ; 
                    //Log::debug($relRow ) ; 
                    // $aの行は消さない！　なぜかないとエラーになる
                    $a = json_encode( $relRow) ; 
                    $replicatedRow = $relRow->replicate() ; 
                    
                    unset($replicatedRow[$foreignKey]) ; 
                    $replicatedRow = $replicatedRow->replicateWithChildren() ; 
                    //$relRow = $replicatedRow->replicateWithChildren() ; 
                    array_push($copiedRows , $replicatedRow) ; 
                }

                $newRow->$relName->splice(0 ,count($relRows) , $copiedRows) ;
                

            }    
        }

        
        return $newRow ; 

    }    

    /**
     * 子テーブル含めて新規行としてコピー
     * ※ 外部キーもクリア
     */
    public function replicateWithChildrenAsNew() {
        $copiedRow = $this->replicateWithChildren() ; 

        $newRow = new static() ; 
        $newRow->fillIncChildren($copiedRow->toArray()) ; 

        return $newRow ; 

    }


}