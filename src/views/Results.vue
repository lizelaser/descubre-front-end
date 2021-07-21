<template lang="pug">
el-card
  el-table(
    :data="results",
    style="width: 100%; max-height: 80vh; overflow-y: auto"
  )
    el-table-column(label="ID", prop="id")
    el-table-column(label="Estado", prop="status")
    el-table-column(label="Carrera", prop="career")
    el-table-column(label="Fecha", prop="endDate")
      template(v-slot="{ row }") {{ formatDate(row.endDate) }}
    el-table-column(label="Acciones")
      template(v-slot="{ row }")
        el-button Imprimir
        el-button(@click="viewRecommendation(row)", type="success") Ver
</template>

<script lang="ts">
import { useAxios } from "@/plugins/axios";
import { ElMessageBox, ElDivider } from "element-plus";
import { defineComponent, onBeforeMount, ref, h } from "vue";

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results = ref<any[]>([]);

    onBeforeMount(() => {
      axios.buildResponse<Career[]>({
        request: "/result",
        ifOk: ({ payload }) => {
          results.value = payload;
        },
      });
    });

    return {
      results,

      formatDate: (date: string) => {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      viewRecommendation: async (rec: any) => {
        await ElMessageBox({
          title: "Carrera recomendada",
          message: h("div", null, [
            h("div", null, rec.career),
            h(ElDivider, null),
            h("div", null, rec.comments),
          ]),
          boxType: "alert",
          closeOnClickModal: false,
          closeOnPressEscape: false,
          closeOnHashChange: false,
        });
      },
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
