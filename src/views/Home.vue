<template lang="pug">
el-container
  el-header
    div(v-if="!authState.access")
    .user-avatar(v-else)
      el-dropdown(trigger="click")
        el-avatar(icon="el-icon-user-solid", style="cursor: pointer")
        template(v-slot:dropdown)
          el-dropdown-menu
            el-dropdown-item(icon="el-icon-user") Mi perfil
            el-dropdown-item(
              @click="logout",
              divided,
              icon="el-icon-switch-button"
            ) Cerrar sesión
      div(style="margin-left: 8px")
        div {{ `${authState.user?.firstName} ${authState.user?.lastName}` }}
        div {{ authState.user?.email }}

    el-menu(:default-active="route.path", mode="horizontal", router)
      el-menu-item(index="/careers") Carreras
      el-menu-item(index="/test") Test

  el-main
    .bg-container
      router-view
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import { ACCESS_KEY, useAuthStore } from "../store/auth";

export default defineComponent({
  name: "home",
  setup() {
    const route = useRoute();
    const { authState, mutate } = useAuthStore();

    return {
      authState,
      route,

      logout: () => {
        mutate((state) => {
          state.access = undefined;
          localStorage.removeItem(ACCESS_KEY);
        });
      },
    };
  },
});
</script>

<style lang="scss" scoped>
$--border-color: #e6e6e6;

.el-container {
  height: 100vh;
}

.el-header {
  border-bottom: 1px solid $--border-color;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-avatar {
  display: flex;
  align-items: center;
  justify-content: start;
}

.el-main {
  position: relative;
}

.bg-container::before {
  z-index: -1;
  content: "";
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 1;
  background-image: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)),
    url("https://www.laorejaroja.com/wp-content/uploads/2016/11/jovenesdudas.jpg");
  background-size: cover;
}

.el-footer {
  font-family: "Encode Sans", sans-serif;
  background-color: white;
  border-top: 1px solid $--border-color;
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;

  & .el-breadcrumb {
    display: flex;
  }

  & .el-divider {
    margin: 0 12px;
  }

  & > .copyright {
    font-size: 12px;
  }
}
</style>
