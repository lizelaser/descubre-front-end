import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    name: "Inicio",
    path: "/",
    component: () => import("../views/Home.vue"),
    children: [
      {
        name: "Test",
        path: "/test",
        component: () => import("../views/Test.vue"),
      },
      {
        name: "Carreras",
        path: "/careers",
        component: () => import("../views/Careers.vue"),
      },
      {
        name: "Resultados",
        path: "/results",
        component: () => import("../views/Results.vue"),
      },
      {
        name: "Usuario",
        path: "/user",
        component: () => import("../views/User.vue"),
      },
    ],
  },
  {
    name: "Error",
    path: "/:pathMatch(.*)*",
    component: () => import("../views/Error.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.afterEach((to) => {
  const name = String(to.name);
  document.title = `${name} - Descubre`;
});

export default router;
