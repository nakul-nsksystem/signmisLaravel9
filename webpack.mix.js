const mix = require('laravel-mix') ;

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

let resourceRoot = "" ; 
 
switch (process.env.NODE_ENV)
{
    case "development" : 
        resourceRoot = process.env.MIX_DEV_RESOURCE_ROOT ; 
        break ; 
    case "production" : 
        resourceRoot = process.env.MIX_PROD_RESOURCE_ROOT ; 
        break ; 
}

// エイリアス設定
const path = require('path');
const aliasSettings = {
    '@frameworks': path.resolve('./resources/ts/frameworks') ,
    '@consts': path.resolve('./resources/ts/consts') ,
    '@mixins': path.resolve('./resources/ts/mixins') ,
    '@stores': path.resolve('./resources/ts/stores')
} ;

// output設定
const outputSettings = {
        //     chunkFilename: 'js/chunks/[name].js' ,
        //     publicPath: '' ,
        // 
}

mix.webpackConfig({
    output : outputSettings , 
    resolve: {
        alias: aliasSettings ,
        fallback : { "crypto": false }
    } ,
    
}) ;

const CompressionPlugin = require('compression-webpack-plugin');

mix.ts('resources/ts/app.ts', 'public/js')
    .vue()
    .extract(['vue'])    
    //.ts('resources/js/apps.ts', 'public/js')
    .sass('resources/sass/app.scss', 'public/css')
    .sass('resources/sass/custom.scss', 'public/css')    
    .sass('resources/sass/report.scss', 'public/css')    
    .copy('resources/js/report.js', 'public/js')    
    .copy('storage/fonts/ipam.ttf', 'public/fonts')    
    .copy('storage/fonts/NotoSansJP-Regular.otf', 'public/fonts')    
    .setResourceRoot(resourceRoot) 
    .webpackConfig({
        plugins: [
            new CompressionPlugin({
            //   filename: '[file]',
              filename: '[path][base].gz[query]',
              algorithm: 'gzip',
              test: /\.js$|\.css$|\.html$|\.svg$/,
            //   test: /\.js$|\.html$|\.svg$/,
              threshold: 10240,
              minRatio: 0.8,
              
            })
          ]
    }); 


    
if (mix.inProduction()) {
    // Production
    // キャッシュ対策
    mix.version();

} else {
    if ( process.env.MIX_IS_RESOURCE_MAP == "true" )
    {
        mix.webpackConfig({
            devtool: 'source-map' ,
        }) ; 
    
    }
    
    mix.sourceMaps() ; 

    mix.disableNotifications() ;

    // 複数タブ開くとおかしくなるのでやめた
    // mix.browserSync({
    //     proxy: {
    //         target: 'http://localhost/SignMisWeb/public/' // 最後に/は不要
    //     } , 
    //     files: [ // チェックするファイルは下記で十分ではないかな。
    //         './resources/**/*',
    //         './app/**/*',
    //         './config/**/*',
    //         './routes/**/*',
    //         './public/**/*'
    //       ],
    // }); 

    /**
     * mix.sourceMaps()
        .webpackConfig({
            output : outputSettings , 
            resolve: {
                alias: aliasSettings ,
            } ,
            devtool: 'source-map' ,
        }) ; 
     */
    const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
    mix.webpackConfig(webpack => {
        return {
            plugins: [
                new NodePolyfillPlugin()
            ]
        };
    });

    
}
