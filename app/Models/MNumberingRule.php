<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class MNumberingRule extends BaseModel
{

    /**
     * 採番ロジック
     */
    public function numberinglogic($model)
    {
        // 採番の元となるロジックを取得(m_numbering_rules)
        // プロジェクトによって採番ルールのビジネスロジックが違うので動的に関数を呼び出す(Call Back)
        
        // DBから取得した関数名を一旦変数に設定
        $variable_functions = $this->function_name ;

        // 引数名から変数を動的作成
        if (isset($this->argument_name1)) {
            $arg1 = $this->createDynamicVariableName($this->argument_name1, $model) ;
        }
        if (isset($this->argument_name2)) {
            $arg2 = $this->createDynamicVariableName($this->argument_name2, $model) ;
        }
        if (isset($this->argument_name3)) {
            $arg3 = $this->createDynamicVariableName($this->argument_name3, $model) ;
        }

        // 可変関数(Call Back) & 動的引数の呼び出し
        if (isset($arg3)) {
            $cd = $this->$variable_functions($arg1, $arg2, $arg3) ; 
        } elseif (isset($arg2)) {
            $cd = $this->$variable_functions($arg1, $arg2) ; 
        } elseif (isset($arg1)) {
            $cd = $this->$variable_functions($arg1) ; 
        } else {
            $cd = $this->$variable_functions() ; 
        }

        return $cd ; 
    }

    /**
     * 変数の動的作成
     */
    Private function createDynamicVariableName($variable_name, $model)
    {
        // 添え字があるか確認
        if (strpos($variable_name, '[') === false) {
            // 添え字がない：そのまま引数として使用
            $variable = ${$variable_name};
        } else {
            // 添え字がある：引数をClass[Property]形式に変換
            $var = explode('[', $variable_name) ;
            $argument_name = $var[0] ;

            // 添え字の中身を整理
            $suffix = $var[1] ;
            $suffix = str_replace(']' , '', $suffix) ;
            $suffix = str_replace('\'', '', $suffix) ;
            $suffix = str_replace('"' , '', $suffix) ;

            // Class[Property]形式に変換
            $variable = ${$argument_name}[$suffix] ;
        }

        return $variable ;
    }

    /**
     * 拠点の記号を取得
     */
    Private function getBranchSymbol($m_branch_id)
    {
        // 拠点
        $model = MBranch::find($m_branch_id) ;
        $symbol = $model->symbol ;

        // 拠点が設定されてない場合はblankで返す
        if (!$symbol) $symbol = "" ;
        return $symbol ;
    }

    /**
     * 取引先CDの採番ルール(ミケランジェロ)
     */
    Private function NumberingRrule_CustomerCd_mike($m_branch_id)
    {
        // 1：頭に拠点の記号[O・T・N]を付ける
        // 2：取引先・仕入先・外注先はprefix[拠点1桁] + CD[4桁]
        // 3：納品先は取引先CD + 連番[3桁] 採番しないで手打ちを想定
        // 4：CD附番時は(取引先・仕入先・外注先)4桁に対してMAX+1
        // 5：管理用領域([O・T・N] +9000番台)は採番ルールから除外

        // 拠点の記号
        $symbol = $this->getBranchSymbol($m_branch_id) ;

        // パラメーターセットしてSQL発行
        // $param = ['symbol' => $symbol] ;
        $param = ['m_branch_id' => $m_branch_id] ;
        $item = DB::select("SELECT MAX(SUBSTRING(cd, 2, 4)) AS cd FROM m_customers WHERE m_branch_id = :m_branch_id AND SUBSTRING(cd, 2, 1) <> '9' AND SUBSTRING(cd, 2, 4) REGEXP '^[0-9]{4}+$'; ", $param) ;

        // 取り出したい文字列
        $val = $item[0]->cd ;
        // 該当データが無い場合の初期値
        if (!$val) $val = "0000" ;
        // 頭コードを0から始める場合[0001]があるので頭1文字目に[1]を追加
        $val = '1' . $val ;
        // 数値[0-9]以外の文字をblankに置換
        $num = preg_replace('/[^0-9]/', '', $val) ;
        // インクリメント
        $val = strval(intval($num) + intval($this->auto_increment)) ;
        // [拠点][4桁0000]
        $val = $symbol . substr($val, 1) ;

        // LOG::info($val);
        return $val ;
    }

    /**
     * 物件CDの採番ルール(ミケランジェロ)
     */
    Private function NumberingRrule_ProjectCd_mike($m_branch_id)
    {
        // 1：頭に拠点の記号[O・T・N]を付ける
        // 2：[拠点][YY][MM]連番4桁：例(T21040001, T21040002)
        
        // 拠点の記号
        $symbol = $this->getBranchSymbol($m_branch_id) ;

        // パラメーターセットしてSQL発行
        $param = ['symbol' => $symbol] ;
        $item = DB::select("SELECT MAX(SUBSTRING(cd, 6, 4)) AS cd FROM t_projects WHERE SUBSTRING(cd, 1, 1) = :symbol AND SUBSTRING(cd, 2, 4) = DATE_FORMAT(CURRENT_DATE, '%y%m') ", $param) ;

        // 取り出したい文字列
        $val = $item[0]->cd ;
        // 該当データが無い場合の初期値
        if (!$val) $val = "0000" ;
        // 頭コードを0から始める場合[0001]があるので頭1文字目に[1]を追加
        $val = '1' . $val ;
        // 数値[0-9]以外の文字をblankに置換
        $num = preg_replace('/[^0-9]/', '', $val) ;
        // インクリメント
        $val = strval(intval($num) + intval($this->auto_increment)) ;
        // [拠点][YYMM][4桁0000]
        $val = $symbol . date("ym") . substr($val, 1) ;

        // LOG::info($val);
        return $val ;
    }
    
    /**
     * 材料CDの採番ルール(ミケランジェロ)
     */
    Private function NumberingRrule_MaterialCd_mike($m_branch_id)
    {
        // 1：頭に拠点の記号[O・T・N]を付ける
        // 2：2：CD附番時はprefix[拠点1桁] + CD[5桁]に対してMAX+1
        // 3：管理用領域([O・T・N]+90000番台)は採番ルールから除外

        // 拠点の記号
        $symbol = $this->getBranchSymbol($m_branch_id) ;

        // パラメーターセットしてSQL発行
        // $param = ['symbol' => $symbol] ;
        $param = ['m_branch_id' => $m_branch_id] ;
        $item = DB::select("SELECT MAX(SUBSTRING(cd, 2, 5)) AS cd FROM m_materials WHERE m_branch_id = :m_branch_id AND SUBSTRING(cd, 2, 1) <> '9' AND SUBSTRING(cd, 2, 5) REGEXP '^[0-9]{5}+$' ", $param) ;

        // 取り出したい文字列
        $val = $item[0]->cd ;
        // 該当データが無い場合の初期値
        if (!$val) $val = "00000" ;
        // 頭コードを0から始める場合[0001]があるので頭1文字目に[1]を追加
        $val = '1' . $val ;
        // 数値[0-9]以外の文字をblankに置換s
        $num = preg_replace('/[^0-9]/', '', $val) ;
        // インクリメント
        $val = strval(intval($num) + intval($this->auto_increment)) ;
        // [拠点][5桁00000]
        $val = $symbol . substr($val, 1) ;

        // LOG::info($val);
        return $val ;
    }

}
