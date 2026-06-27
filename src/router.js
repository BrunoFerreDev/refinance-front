import { createRouter, createWebHistory } from "vue-router";
import Tablero from "./components/Tablero.vue";
import Prestamos from "./components/Prestamos.vue";
import ControlCaja from "./components/ControlCaja.vue";
import Arbitros from "./components/Arbitros.vue";
import ReporteAnual from "./components/ReporteAnual.vue";
import GastoRecuperoDetalle from "./components/GastoRecuperoDetalle.vue";
import PrestamosDetalle from "./components/PrestamosDetalle.vue";
import Aranceles from "./components/Aranceles.vue";
import Login from "./components/Login.vue";
import { isAuthenticated } from "./services/api.js";

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { guestOnly: true },
  },
  {
    path: "/",
    name: "tablero",
    component: Tablero,
    meta: { requiresAuth: true },
  },
  {
    path: "/prestamos",
    name: "prestamos",
    component: Prestamos,
    meta: { requiresAuth: true },
  },
  {
    path: "/caja",
    name: "caja",
    component: ControlCaja,
    meta: { requiresAuth: true },
  },
  {
    path: "/arbitros",
    name: "arbitros",
    component: Arbitros,
    meta: { requiresAuth: true },
  },
  {
    path: "/reporte",
    name: "reporte",
    component: ReporteAnual,
    meta: { requiresAuth: true },
  },
  {
    path: "/aranceles",
    name: "aranceles",
    component: Aranceles,
    meta: { requiresAuth: true },
  },
  {
    path: "/gasto-recupero/:idTransaccion",
    name: "gasto-recupero-detalle",
    component: GastoRecuperoDetalle,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/prestamos/:idPrestamo",
    name: "prestamo-detalle",
    component: PrestamosDetalle,
    props: true,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: "login" });
  } else if (to.meta.guestOnly && isAuthenticated.value) {
    next({ name: "tablero" });
  } else {
    next();
  }
});

export default router;
