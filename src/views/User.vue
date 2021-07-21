<template lang="pug">
el-card(
  style="margin: auto; max-width: 750px; max-height: 80vh; text-align: center"
)
  el-form(ref="meetRef", label-position="top")
    el-row(:gutter="16")
      el-col(:span="12")
        el-form-item(label="Nombre de usuario")
          el-input(v-model="userForm.username", :disabled="isWaiting")
      el-col(:span="12")
        el-form-item(label="Correo")
          el-input(v-model="userForm.email", :disabled="isWaiting")
      el-col(:span="12")
        el-form-item(label="Nombres")
          el-input(v-model="userForm.firstName", :disabled="isWaiting")
      el-col(:span="12")
        el-form-item(label="Apellidos")
          el-input(v-model="userForm.lastName", :disabled="isWaiting")
      el-col(:span="12")
        el-form-item(label="DNI")
          el-input(v-model="userForm.dni", :disabled="isWaiting")
      el-col(:span="12")
        el-form-item(label="Fecha de nacimiento")
          el-date-picker(
            v-model="userForm.birthday",
            :disabled="isWaiting",
            style="width: 100%",
            type="date"
          )
      el-col(:span="12")
        el-form-item(label="Género")
          el-select(
            v-model="userForm.gender",
            :disabled="isWaiting",
            placeholder="Seleccione",
            style="width: 100%"
          )
            el-option(label="Masculino", value="M")
            el-option(label="Femenino", value="F")
            el-option(label="Otro", value="O")
      el-col(:span="12")
        el-form-item(label="Teléfono")
          el-input(v-model="userForm.phone", :disabled="isWaiting")
      el-col(:span="24")
        el-form-item(label="Contraseña")
          el-input(
            v-model="userForm.password",
            :disabled="isWaiting",
            show-password
          )

  el-button(
    :loading="isLoading",
    :type="isWaiting ? 'primary' : 'success'",
    @click="onClick"
  ) {{ isWaiting ? 'Editar' : 'Guardar' }}
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from "vue";

import { useAxios } from "@/plugins/axios";
import { useAuthStore, User, USER_KEY } from "@/store";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "test",
  setup() {
    const axios = useAxios();
    const router = useRouter();
    const { authState, mutate } = useAuthStore();

    if (authState.user === undefined) {
      ElMessage.error("Usted no ha iniciado sesión");
      router.replace("/");
    }

    const isWaiting = ref(true);
    const isLoading = ref(false);
    const user = computed(() => authState.user);

    const userForm = reactive({
      id: user.value?.id,
      rolId: 1,
      firstName: user.value?.firstName,
      lastName: user.value?.lastName,
      username: user.value?.username,
      email: user.value?.email,
      password: "",
      gender: user.value?.gender,
      dni: user.value?.dni,
      birthday: user.value?.birthday,
      phone: user.value?.phone,
    });

    return {
      isWaiting,
      userForm,
      isLoading,

      onClick: async () => {
        if (isWaiting.value) {
          isWaiting.value = false;
          return;
        }

        isLoading.value = true;

        await axios.buildResponse<User>({
          notify: "always",
          request: {
            method: "PUT",
            url: `/user/${user.value?.id}`,
            data: userForm,
          },
          ifOk({ payload }) {
            localStorage.setItem(USER_KEY, JSON.stringify(payload));
            mutate((state) => {
              state.user = payload;
            });
          },
        });

        isLoading.value = false;
      },
    };
  },
});
</script>

<style lang="scss">
.step-container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.step-card {
  min-width: 500px;
  max-width: 60vw;

  & .el-card__body {
    text-align: center;
  }
}

.alternative-container {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: space-between;
  max-height: 60vh;
  overflow-y: auto;
}

.alternative-box {
  cursor: pointer;
  display: table;
  width: 20%;
  padding: 6px;
  margin: 4px;
  background-color: rgb(29, 102, 185);
  border: 2px solid rgb(89, 119, 55);

  &:active {
    box-shadow: inset 0 0 25px rgba(0, 0, 0, 0.5);
  }

  & > span {
    margin: 0;
    display: table-cell;
    color: white;
    vertical-align: middle;
    user-select: none;
  }

  &.selected {
    background-color: #c29c20;
  }
}

.alternative-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 12px;
  padding-right: 12px;
}
</style>
