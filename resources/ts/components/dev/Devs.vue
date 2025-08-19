<template>
    <div class="row">
        <div class="col-12 col-xl-4">
            <h4>Masters </h4>
            <router-link class="nav-link" to="../master/m_product_category" title="" append>
                商品カテゴリマスタ
            </router-link>
            <router-link class="nav-link" to="../master/m_process_category" title="" append>
                工程カテゴリマスタ
            </router-link>
            <router-link class="nav-link" to="../master/m_calendar" title="" append>
                カレンダーマスタ
            </router-link>
            <router-link class="nav-link" to="../master/m_production" title="" append>
                生産先マスタ
            </router-link>
            <router-link class="nav-link" to="../master/m_tag_category" title="" append>
                タグカテゴリマスタ
            </router-link>
            <router-link class="nav-link" to="../master/m_tag" title="" append>
                タグマスタ
            </router-link>
        </div>

        <div class="col-12 col-xl-4">
            <h4>オプション </h4>
            <router-link class="nav-link" to="../master/sm_option" title="" append>
                システムオプション
            </router-link>
        </div>

        <div class="col-12 col-xl-4">
            <h4>検証</h4>
            <router-link class="nav-link" to="../master/m_validate" title="" append>
                検証マスタ
            </router-link>
            <router-link class="nav-link" to="../dev/master_ref" title="" append>
                マスタ引き
            </router-link>
            <router-link class="nav-link" to="../dev/svg_test" title="" append>
                SVG
            </router-link>
            <router-link class="nav-link" to="../dev/http_to_local_test" title="" append>
                HttpToLocalTest
            </router-link>
            <router-link class="nav-link" to="../dev/popover" title="" append>
                Popover
            </router-link>
            <router-link class="nav-link" to="../dev/t_project_product_process_test" title="" append>
                TProjectProductProcessTest
            </router-link>
            <router-link class="nav-link" to="../dev/radial_progress_bar_test" title="" append>
                ProgressBar 放射状[円]と横バー
            </router-link>
        </div>

        <div class="col-12 mt-4">
            <h4>データ調整</h4>
            <router-link class="nav-link" to="../dev/t_project_product_process_update_cost4bug" title="" append>
                バグ修正後、コスト再計算用（作業時間 > 0 And コスト = 0 , Limit 200 )
            </router-link>
        </div>

        <div class="col-12 mt-4">
            <button type="button" class="btn btn-primary" @click.prevent="clearCache">キャッシュ削除</button>
        </div>
    </div>
</template>

<script>
export default {
    methods : {
        clearCache : async function(){
            let ep = 'api/clearAllCache' ;

            try {
                await axios.get(ep) ;
                alert("マスタデータのキャッシュを削除しました")
            } catch(error) {
                this.$$errorConsole(error ,ep ) ;
            }
        }
    }
}
</script>