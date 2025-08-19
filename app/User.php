<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\HasApiTokens;
use App\Models\MRole;

class User extends Authenticatable
{
    
    use Notifiable;
    use SoftDeletes;
    use HasApiTokens ; 

    protected $table = 'm_users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    /*
    protected $fillable = [
        'last_name' ,'first_name', 'full_name', 'email', 'password',
    ];
    */

    
    protected $guarded = ['id' , 'created_at', 'updated_at' ,'deleted_at'];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function getInfo() 
    {
        $token = $this->createToken("mis-api-token");
        $user = $this ;         
        $userId = $user["id"] ;

        //権限情報取得
        $roles = $this->roles();
        $userRoles = $roles->whereHas('MRoleDetails')->get(); 

        //ユーザー個別設定取得
        $options = $this->MUserOptions()->get();
        
        // $email = $user["email"] ; 
        // $nskUserKey = "@nsksystem.co.jp" ; 
        // $isNskUser = substr($email , strlen($nskUserKey) * -1) == $nskUserKey ; 

        // $user["is_nsk_user"] = $isNskUser ; 
        
        $user["is_default_debug"] = $user["is_nsk_user"] && config("app.debug") ; 
        $user["m_roles"] = $userRoles ; 
        $user["m_user_options"] = $options ;

        return array(
            "m_user" => $user , 
            "token" => $token->plainTextToken ,
        ) ; 
        //return array("m_user" => $this , "token" => "") ;   
    }

    /**
     * タグを取得する
     */
    public function tags()
    {
        return $this->morphToMany('App\Models\MTag', 'm_tag_link')->orderBy("order_no");
    }

    /**
     * 権限情報を取得する
     */
    public function roles()
    {
        return $this->belongsToMany('App\Models\MRole', 'm_role_users','m_user_id','m_role_id')
                    ->with('MRoleDetails.MRoleKey')
                    ->using('App\Models\MRoleUser');
    }

    public function MBranch()
    {
        return $this->belongsTo('App\Models\MBranch');
    }

    public function MUserOptions()
    {
        return $this->hasMany('App\Models\MUserOption','m_user_id')
                    ->with('SmUserOption.KeyMKv')
                    ->orderByRaw('order_no IS NULL ASC')
                    ->orderBy("order_no");
    }

}
