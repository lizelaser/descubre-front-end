<template lang="pug">
.error-page
  div.background(:style="{backgroundImage: `url(${getBackground()})`}" )
  .card-parent
    el-card.error-card(shadow="never")
      span.error-title {{ statusCode ?? 404 }}
      .error-subtitle {{ message ?? 'La página solicitada no existe' }}
      el-button(@click="goBack", type="text") Atrás
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useRouter } from "vue-router";

export default defineComponent({
  name: "error-view",
  props: {
    statusCode: Number,
    message: String,
  },
  setup() {
    const router = useRouter();
    /**
     * List of background to show on error page.
     *
     * Possible new candidates:
     * - https://media.giphy.com/media/l4FsIC6XXeS0wGIBG/giphy.gif
     * - https://media.giphy.com/media/vxdvQ6OotyQe69fGgt/giphy.gif
     */
    const backgrounds: string[] = [
      "https://media.giphy.com/media/1lALzcU4pUHWWMGTlK/giphy.gif",
      "https://media.giphy.com/media/3NeSk2IVEd2FYUQEcM/giphy.gif",
      "https://media.giphy.com/media/xThuWuex66yqi0d6Fy/giphy.gif",
      "https://media.giphy.com/media/l2SpSPD5I0NfXI4SI/giphy.gif",
      "https://media.giphy.com/media/t7CyBKFjrss3C/giphy.gif",
      "https://media.giphy.com/media/riw3K0D2h4klG/giphy.gif",
      "https://media.giphy.com/media/nIlgTxY29wJuU/giphy.gif",
    ];

    function getBackground(): string {
      const randomIndex: number = Math.floor(
        Math.random() * backgrounds.length
      );
      return backgrounds[randomIndex];
    }

    function goBack() {
      window.history.length > 1 ? router.go(-1) : router.push("/");
    }

    return { getBackground, goBack };
  },
});
</script>

<style scoped>
.background {
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: repeat;
  opacity: 0.125;
}

.error-title {
  font-size: 96px;
  line-height: normal;
  margin-bottom: 8px;
}
.error-subtitle {
  font-size: 24px;
  line-height: normal;
  margin-bottom: 12px;
}

.card-parent {
  min-width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.error-card {
  width: 500px;
  margin-left: 8px;
  margin-right: 8px;
  z-index: 420;
  text-align: center;
}
</style>
