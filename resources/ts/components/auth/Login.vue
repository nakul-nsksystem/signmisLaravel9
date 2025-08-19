<template>    
    <div>
        <div class="bg-gradient-dark d-flex align-items-center app-login-container" 
            style="margin-left:calc(-50px - 1rem );margin-top:-1rem;margin-right:-1rem;
                height:calc(100vh - 55px - 1rem) !important">  
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-12 col-xl-8">
                        <div class="card bg-dark text-white pt-5 pb-3">
                            <div class="mx-auto pb-4" style="width: 200px;">
                                <!-- <object type="image/svg+xml" :data="`${$$cAppUrl}/img/company-logo.svg`" width="200" height="200"></object> -->
                                <object type="image/svg+xml" :data="`${cCompanyLogo}`"  width="200" height="200"></object>
                                
                            </div>
                            <p v-show="dSuccsess" class="text-success text-center" role="alert">
                                パスワード設定メールを送信しました
                            </p>
                            <p v-show="dErrorRes" class="text-danger text-center" role="alert">
                                {{dErrorRes}}
                            </p>                                    
                            <div class="card-body">
                                <validation-observer v-slot="{ invalid }">

                                    <form v-on:submit.prevent="submitLogin" method="POST">
                                        <validation-provider name="Email" rules="required|email" vid="confirmation" v-slot="{ errors }">                                
                                            <div class="form-group row">
                                                <label for="email" class="col-xl-4 col-form-label text-xl-right card-text">Email</label>
                                                <div class="col-xl-6">
                                                    <input id="email" v-model="dValue.email" type="email" class="form-control " name="email" autocomplete="email" autofocus>
                                                    <span class="validation-error">{{ errors[0] }}</span>
                                                </div>
                                            </div>
                                        </validation-provider>                                            
                                        <div class="form-group row">
                                            <label for="password" class="col-xl-4 col-form-label text-xl-right">Password</label>
                                            <div class="col-xl-6">
                                                <input id="password" v-model="dValue.password" type="password" class="form-control @error('password') @enderror" name="password" autocomplete="current-password">
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <div class="col-xl-6 offset-xl-4">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" name="remember" id="remember" v-model="dValue.remember">
                                                    <label class="form-check-label" for="remember">
                                                        ログイン情報を記憶する 
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group row mb-0">
                                            <div class="col-xl-8 offset-xl-4">
                                                <button  type="submit" class="btn btn-primary">
                                                    ログイン
                                                </button>
                                                <a class="btn btn-link" @click.prevent="submitPasswordReset" :class="{disabled:dLoading || invalid}" >
                                                    <div v-if="dLoading">
                                                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        パスワード設定メール送信中...
                                                    </div>
                                                    <div v-else disabled>
                                                        パスワードを忘れた場合                       
                                                    </div>
                                                </a>                                            
                                            </div>
                                        </div>                                                                    
                                    </form>
                                </validation-observer>
                            </div>                    
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
        dValue : {
            remember:false,
         } , 
        dErrorRes : false ,
        dSuccsess : false ,
        dLoading : false ,

        dUrl : "",

    };
  },
  props : { 
    companyLogo: {
        type : String , 
        default : () => "" , 
    } ,
  } ,
  computed: {
      cTest : function(){
            sessionStorage.getItem('requestFrom')
            this.dUrl = JSON.parse(sessionStorage.getItem('requestFrom')) ;

      } ,
      cCompanyLogo : function() { 
          return window.companyLogo ; 
      }
      
  },
  methods: {
        submitLogin : function() {
            this.dErrorRes = false ;
            const _this = this ;                        
            this.mainStore.loginAction(this.dValue)
                .then(x => {
                    if (sessionStorage.getItem('requestFrom')){
                        try{
                            this.dUrl = sessionStorage.getItem('requestFrom') ;
                        } catch (e) {
                            this.dUrl.removeItem('requestFrom')
                        }
                    }
                    if(this.dUrl!==""){
                        this.$router.push(this.dUrl)
                    } else {
                        this.$router.push({name :"home"}) ; 
                    }
                    
                    // console.log("go to home") ;
                    //this.$router.push({name :"home"}) ; 
                })
                .catch(error => {
                    // this.dErrorRes = "ログインに失敗しました";
                    this.dErrorRes = "メールアドレスまたはパスワードが正しくありません";
                    //this.$$errorConsole(error , ep) ; 

                });
        
        },
        submitPasswordReset : function() {
            this.dErrorRes = false ;
            let ep =  `api/auth/reset` ;
            if(! confirm(this.dValue.email+'\nにパスワード設定メールを送信します')) return ; 
            this.dLoading = true ;

            const req = {
                email  : this.dValue.email ,
                _token : this.$$cCsrfToken , 
            };

            axios.post(ep ,req)
                .then(res => {
                    // 成功
                    this.dSuccsess = true ;
                    this.dLoading = false ;
                    //console.log("成功") ; 
                })  
                .catch((error)=> {
                    //this.$$errorConsole(error ,ep ) ; 
                    //422の時エラーうまく拾わない
                    // エラーのとき
                    this.dErrorRes = "メール送信に失敗しました"
                    this.dLoading = false
                })  ; 
                
        },
  },

};
</script>