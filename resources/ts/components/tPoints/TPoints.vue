<template>
  <div class="row">
    <div class="col-12 col-xl-4">
      <div class="pt-2 mb-3">
        <h5>
          <i class="fas fa-parking"></i>
          ポイント
        </h5>
      </div>
      <!-- <router-link class="nav-link" to="t_deliveries" title="" append>
                マイページ
            </router-link> -->
      <router-link
        v-if="mainStore.getRole('point_admin-privilege') >= 10"
        class="nav-link"
        to="user_points"
        title=""
        append
      >
        ユーザーポイント
      </router-link>
      <router-link
        v-if="mainStore.getRole('point_admin-privilege') >= 10"
        class="nav-link"
        to="t_u_points"
        title=""
        append
      >
        ポイント分析
      </router-link>
    </div>

    <div class="col-12 col-xl-4">
      <div class="pt-2 mb-3">
        <h5>
          <i class="fas fa-wrench"></i>
          管理設定
        </h5>
      </div>
      <router-link
        v-if="mainStore.getRole('point_admin-privilege') >= 100"
        class="nav-link"
        to="project_points"
        title=""
        append
      >
        ポイント率確定
      </router-link>
      <router-link
        v-if="mainStore.getRole('point_admin-privilege') >= 100"
        class="nav-link"
        to="project_points_closing"
        title=""
        append
      >
        ポイント締め
      </router-link>
    </div>
  </div>
</template>
