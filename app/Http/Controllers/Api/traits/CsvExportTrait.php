<?php

namespace App\Http\Controllers\Api\Traits;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Csv出力
 * @param $data csvにするデータ配列
 * @param $csvHeader ヘッダー配列
 * @param $csvIgnore csvに含めないカラム
 */
trait CsvExportTrait
{
    protected function createCsv(array $data ,$csvHeader = null ,$csvIgnore = null) 
    {

        //各モデルの$csvHeaderを初期値に設定
        if(is_null($csvHeader)) $csvHeader = $this->model::$csvHeader ?? [] ;
        //各モデルの$csvIgnoreを初期値に設定
        if(is_null($csvIgnore)) $csvIgnore = $this->model::$csvIgnore ?? [] ;
        
        $response = new StreamedResponse(function () use ($data ,$csvHeader, $csvIgnore) {
            $stream = fopen('php://output', 'w');
            stream_filter_prepend($stream, 'convert.iconv.utf-8/utf-16le');
            
            // UTF-8 with BOM にする(Mac・WindowsでCSVファイルをExcelで開いた際の文字化け回避用BOM)
            fwrite($stream, "\xEF\xBB\xBF");

            fputcsv($stream, $csvHeader,"\t");

            foreach ($data as &$row) {
                //stdclass変換
                if(!is_array($row)) {
                    $row = get_object_vars($row) ;
                }

                if(!empty($csvIgnore)) {
                    //csvに含めない指定をしたカラムを削除
                    foreach($csvIgnore as $ignoreKey) {
                        unset($row[$ignoreKey]) ;
                    }
                }

                fputcsv($stream, $row, "\t");

            }

            fclose($stream);

        }, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="export.csv"',
        ]);

        return $response;
    }

    /**
     * 開発用機能
     * カラムのコメントを取得してログに表示
     */
    protected function getColumnComments( $tableName = "" ) 
    {
        $schema = DB::connection()->getDoctrineSchemaManager();
        $table = $schema->listTableDetails($tableName);
        // カラム情報を取得
        $columns = $table->getColumns();
        $columnComment = [];
        foreach ($columns as $column) {
            $columnComment[] = $column->getComment();
        }

        log::debug($columnComment) ;
    }

 
}
