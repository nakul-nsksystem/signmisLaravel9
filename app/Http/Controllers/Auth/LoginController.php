<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use App\User;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);
        $data = $request->all();        
        $remember = $data['remember'] ?? true ;
        
        if (Auth::attempt($credentials,$remember)) {            
            $user = Auth::user() ;  
            return $user->getInfo(); 
            
            //return response()->json(['message' => 'Login successful'], 200);
        }

        return response()->json(['message' => 'failed'], 422);
    }

    public function logout()
    {
        $user = Auth::user() ; 
        $user->tokens()->delete();        

        Auth::logout();
        return response()->json(['message' => 'Logged out'], 200);
    }
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }
}
