<template lang="pug">
.step-container
  div
  // el-button(
      v-if="authState.isAuthenticated ? step > 1 : step > 0",
      @click="changeStep(false)",
      circle,
      icon="el-icon-arrow-left"
    )
    div(v-else)

  el-card.step-card
    template(v-slot:header)
      b {{  loading ? "Cargando": step === 0 ? '¡Preséntate!' : selected.denomination  }}

    div(v-if="!loading")
      template(v-if="step === 0")
        el-form(ref="emailRefs", label-position="top")
          el-form-item(label="Usuario o correo electrónico")
            el-input(
              v-model="user.input",
              :disabled="user.exists !== undefined",
              @keydown.enter.prevent="checkEmail"
            )
              template(v-slot:append)
                el-button(
                  :loading="loading",
                  @click="checkEmail",
                  icon="el-icon-search"
                )

        div(v-if="user.exists !== undefined")
          el-divider {{ user.exists ? 'Inicie sesión' : 'Cree una cuenta' }}
          el-form(ref="meetRef", v-if="user.exists", label-position="top")
            el-form-item(label="Contraseña")
              el-input(
                v-model="user.password",
                @keydown.enter.prevent="authorize",
                show-password
              )

          el-form(ref="meetRef", v-else, label-position="top")
            el-row(:gutter="16")
              el-col(:span="12")
                el-form-item(label="Nombre de usuario")
                  el-input(v-model="meetForm.username")
              el-col(:span="12")
                el-form-item(label="Correo")
                  el-input(v-model="meetForm.email")
              el-col(:span="12")
                el-form-item(label="Nombres")
                  el-input(v-model="meetForm.firstName")
              el-col(:span="12")
                el-form-item(label="Apellidos")
                  el-input(v-model="meetForm.lastName")
              el-col(:span="12")
                el-form-item(label="DNI")
                  el-input(v-model="meetForm.dni")
              el-col(:span="12")
                el-form-item(label="Fecha de nacimiento")
                  el-date-picker(
                    v-model="meetForm.birthday",
                    style="width: 100%",
                    type="date"
                  )
              el-col(:span="12")
                el-form-item(label="Género")
                  el-select(
                    v-model="meetForm.gender",
                    placeholder="Seleccione",
                    style="width: 100%"
                  )
                    el-option(label="Masculino", value="M")
                    el-option(label="Femenino", value="F")
                    el-option(label="Otro", value="O")
              el-col(:span="12")
                el-form-item(label="Teléfono")
                  el-input(v-model="meetForm.phone")
              el-col(:span="24")
                el-form-item(label="Contraseña")
                  el-input(v-model="meetForm.password", show-password)

          el-button(@click="user.exists = undefined; user.input = ''") Cambiar usuario
          el-button(:loading="loading", @click="authorize", type="success") Continuar

      template(v-else)
        template(v-for="(item, idx) in tests")
          template(v-if="step === idx + 1")
            div(style="margin-bottom: 12px; text-align: start")
              b {{ 'Duración promedio: ' }}
              span {{ item.averageTime }} minutos
            div(style="text-align: justify") {{ item.instructions }}
            el-divider
            .alternative-container
              template(v-for="alt in selected.alternatives")
                .alternative-box(
                  v-if="alt.weight",
                  :class="{ selected: alt.selected }",
                  @click="alt.selected = !alt.selected"
                ) 
                  span {{ alt.denomination }}
                .alternative-options(v-else)
                  div {{ alt.denomination }}
                  el-radio-group(v-model="alt.score")
                    el-radio-button(label="0")
                    el-radio-button(label="1")
                    el-radio-button(label="2")
                    el-radio-button(label="3")
                    el-radio-button(label="4")

  el-button(
    v-if="step !== 0 && step < tests.length + 1",
    :loading="loading",
    :type="step === tests.length ? 'success' : 'default'",
    @click="changeStep(true)",
    circle,
    icon="el-icon-arrow-right"
  )
  div(v-else)
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  h,
  onBeforeMount,
  reactive,
  ref,
  watch,
} from "vue";

import { useAxios } from "@/plugins/axios";
import { ACCESS_KEY, useAuthStore, User, USER_KEY } from "@/store";
import { defaults } from "enigmajs-core";
import { ElDivider, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";

interface Alternative {
  id: number;
  modalityId: number;
  denomination: string;
  weight: number;
  status: boolean;
  score?: string;
  selected?: boolean;
}

interface Test {
  id: number;
  denomination: string;
  averageTime: number;
  instructions: string;
  status: boolean;
  alternatives?: Alternative[];
}

export default defineComponent({
  name: "test",
  setup() {
    const axios = useAxios();
    const { authState, mutate } = useAuthStore();
    const router = useRouter();

    const resultId = ref(0);
    const tests = ref<Test[]>([]);
    const step = ref(0);
    const loading = ref(false);

    const user = reactive<{
      exists: boolean | undefined;
      input: string;
      password: string;
    }>({
      exists: undefined,
      input: "",
      password: "",
    });

    const meetForm = reactive({
      rolId: 1,
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      gender: "",
      dni: "",
      birthday: null,
      phone: "",
    });

    const sortCallback = (a: Test, b: Test) => a.id - b.id;

    watch(
      () => authState.isAuthenticated,
      (val) => {
        if (!val) {
          step.value = 0;
          user.exists = undefined;
          user.input = "";
          user.password = "";
        }
      }
    );

    onBeforeMount(async () => {
      if (authState.isAuthenticated) {
        loading.value = true;

        await axios.buildResponse<Test[]>({
          request: "/test",
          ifOk: ({ payload }) => {
            tests.value = payload.sort(sortCallback);
          },
        });

        await axios.buildResponse<number | { id: number }>({
          notify: false,
          request: {
            method: "POST",
            url: "/result",
          },
          ifOk: ({ payload }) => {
            resultId.value = typeof payload === "number" ? payload : payload.id;
          },
        });

        changeStep(true, true);
        loading.value = false;
      }
    });

    const changeStep = async (next: boolean, ignore = false) => {
      if (ignore || step.value > 0) {
        if (step.value > 0 && selected.value.alternatives) {
          const answers = selected.value.alternatives.filter(
            (x) => x.selected || x.score
          );

          if (answers.length === 0) {
            defaults.notifier.error("Desarrolle el test");
            return;
          }

          if (answers.every((x) => x.selected) && answers.length < 15) {
            defaults.notifier.error("Seleccione al menos 15 alternativas");
            return;
          }

          if (
            answers.every((x) => x.score) &&
            answers.length !== selected.value.alternatives.length
          ) {
            defaults.notifier.error("Responda todas las preguntas");
            return;
          }

          const helper = new Map<number, number>();

          for (const item of answers) {
            const old = helper.get(item.modalityId) ?? 0;
            helper.set(
              item.modalityId,
              old + (item.weight ?? Number.parseInt(item.score ?? "1"))
            );
          }

          const entries = Array.from(helper.entries());
          const result = entries.sort((a, b) => b[1] - a[1])[0];

          const modalityId = result[0];
          const total = result[1];

          await axios.buildResponse({
            request: {
              method: "PUT",
              url: `/result/${resultId.value}`,
              data: {
                testId: selected.value.id,
                modalityId: modalityId,
                total: total,
                isLast: tests.value.length === step.value,
              },
            },
            ifOk: async ({ payload }) => {
              if (typeof payload === "object") {
                await ElMessageBox({
                  title: "Carrera recomendada",
                  message: h("div", null, [
                    h("div", null, payload.career),
                    h(ElDivider, null),
                    h("div", null, payload.comments),
                  ]),
                  callback: () => {
                    router.replace("/results");
                  },
                  boxType: "alert",
                  closeOnClickModal: false,
                  closeOnPressEscape: false,
                  closeOnHashChange: false,
                });
              }
            },
            ifErr: () => {
              throw "Result error";
            },
          });
        }

        if (next) {
          step.value += 1;
        } else {
          step.value -= 1;
        }

        if (selected.value.alternatives === undefined) {
          loading.value = true;

          await axios.buildResponse<Alternative[]>({
            request: `/alternative?test=${selected.value.id}`,
            ifOk: ({ payload }) => {
              payload.forEach((p) => {
                p.score = "2";
                p.selected = true;
              });
              selected.value.alternatives = payload;
            },
          });

          loading.value = false;
        }
      }
    };

    const selected = computed(() => tests.value[step.value - 1]);

    return {
      authState,
      changeStep,
      loading,
      meetForm,
      selected,
      step,
      tests,
      user,

      checkEmail: async () => {
        loading.value = true;

        axios.buildResponse({
          request: `/public/check?input=${user.input.trim()}`,
          ifOk: ({ payload }) => {
            user.exists = payload;
          },
        });

        loading.value = false;
      },
      authorize: async () => {
        loading.value = true;

        if (user.exists) {
          await axios.buildResponse<string>({
            request: {
              url: `/public/login`,
              method: "POST",
              data: {
                username: user.input,
                password: user.password,
              },
            },
            errMessage: "No se encontraron credenciales válidas",
            ifOk: async ({ payload }) => {
              mutate((state) => {
                state.access = payload;
              });

              localStorage.setItem(ACCESS_KEY, payload);
              axios.defaults.headers["Authorization"] = `Bearer ${payload}`;

              await axios.buildResponses({
                requests: [
                  axios.fetchResponse<User>("/user/by-token"),
                  axios.fetchResponse<Test[]>("/test"),
                ],
                ifOk: ([user, test]) => {
                  localStorage.setItem(USER_KEY, JSON.stringify(user));
                  tests.value = test.sort(sortCallback);
                  mutate((state) => {
                    state.user = user;
                  });
                },
              });

              await axios.buildResponse<number | { id: number }>({
                notify: false,
                request: {
                  method: "POST",
                  url: "/result",
                },
                ifOk: ({ payload }) => {
                  resultId.value =
                    typeof payload === "number" ? payload : payload.id;
                },
              });
            },
          });

          changeStep(true, true);
        } else {
          await axios.buildResponse({
            notify: "always",
            request: {
              url: "/user",
              method: "POST",
              data: meetForm,
            },
            ifOk: () => {
              user.exists = true;
            },
            ifErr: () => {
              return;
            },
          });
        }

        loading.value = false;
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
