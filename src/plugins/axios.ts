import { inject, InjectionKey, Plugin } from "vue";
import { EgAxiosInstance, createAxios } from "enigmajs-core";

import { authState } from "@/store";

export const axiosKey: InjectionKey<EgAxiosInstance> = Symbol("axios");

export function useAxios(): EgAxiosInstance {
  const injected = inject(axiosKey);
  if (!injected) {
    throw new Error("axios plugin was not used in main.ts");
  }
  return injected;
}

export const axios = createAxios({
  baseURL: import.meta.env.VITE_BASE_URL as string,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default ((app) => {
  if (typeof authState.access === "string") {
    axios.defaults.headers["Authorization"] = `Bearer ${authState.access}`;
  }

  app.provide(axiosKey, axios);
}) as Plugin;
