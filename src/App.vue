<template lang="pug">
router-view#app
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "app",
});
</script>

<style>
#app,
body {
  margin: 0;
  padding: 0;
}
</style>
