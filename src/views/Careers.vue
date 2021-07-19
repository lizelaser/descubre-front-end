<template lang="pug">
.card-container
  el-card.card-careers
    el-menu(@select="onSelect", default-active="0")
      el-menu-item(v-for="(item, idx) in careers", :index="String(idx)")
        span {{ item.denomination }}

  div(v-if="careers.length === 0")
  el-card.card-selected(v-else)
    template(v-slot:header)
      b {{ selected.denomination }}
    div(style="margin-bottom: 12px")
      b {{ 'Duración: ' }}
      span {{ selected.duration ?? 5 }} años
    div(style="text-align: justify") {{ selected.information }}
</template>

<script lang="ts">
import { useAxios } from "@/plugins/axios";
import { computed, defineComponent, onBeforeMount, ref } from "vue";

interface Career {
  id: number;
  denomination: string;
  information: string;
  duration: number;
  status: boolean;
}

export default defineComponent({
  name: "careers",
  setup() {
    const axios = useAxios();

    const careers = ref<Career[]>([]);
    const selectedIdx = ref(0);

    onBeforeMount(() => {
      axios.buildResponse<Career[]>({
        request: "/career",
        ifOk: ({ payload }) => {
          careers.value = payload;
        },
      });
    });

    return {
      careers,
      selectedIdx,

      onSelect: (idx: string) => {
        selectedIdx.value = Number(idx);
      },
      selected: computed(() => {
        return careers.value[selectedIdx.value];
      }),
    };
  },
});
</script>

<style scoped lang="scss">
.card-container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.card-careers {
  & .el-menu {
    height: 75vh;
    border-right: none;
    overflow-y: auto;
  }
}

.card-selected {
  width: 50vw;
}
</style>
