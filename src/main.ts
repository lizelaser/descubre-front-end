import { createApp } from "vue";
import ElementPlus from "./element-plus";

import router from "./router";
import axios from "./plugins/axios";

import App from "./App.vue";

createApp(App).use(ElementPlus).use(router).use(axios).mount("#app");
