
<header>
  <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark shadow">
    <object type="image/svg+xml" data="{{ asset('/img/company-logo.svg') }}" width="38" height="38"></object>
    <a class="navbar-brand ml-3" href="#"><p class="h4 mb-0">{{ config('app.name', 'SignMis') }}</p></a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse bg-dark mx-n3 px-3" id="navbarCollapse">
        <div class="d-flex flex-grow-1">
            
            <div class="p-2 flex-grow-1 app-nav-space d-none d-md-block"></div>
            <ul class="navbar-nav mr-auto ">
                
                <!-- Authentication Links -->
                @guest
                    <li class="nav-item">                        
                        <a class="nav-link" href="{{ route('login') }}">{{ __('Login') }}</a>
                    </li>
                    @if (Route::has('register'))
                        <li class="nav-item">
                            <a class="nav-link" href="{{ route('register') }}">{{ __('Register') }}</a>
                        </li>
                    @endif
                @else
                    <li class="nav-item dropdown">
                        <a id="navbarDropdown" class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
                            {{ Auth::user()->full_name }} <span class="caret"></span>
                        </a>

                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                            <a class="dropdown-item" href="{{ route('logout') }}"
                                onclick="event.preventDefault();
                                                document.getElementById('logout-form').submit();">
                                {{ __('Logout') }}
                            </a>

                            <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                                @csrf
                            </form>
                        </div>
                    </li>
                @endguest

            </ul>
        </div>
    </div>
  </nav>
</header>


