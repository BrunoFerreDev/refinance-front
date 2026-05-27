import { createRouter, createWebHistory } from "vue-router";
import Tablero from "./components/Tablero.vue";
import Prestamos from "./components/Prestamos.vue";
import ControlCaja from "./components/ControlCaja.vue";
import Arbitros from "./components/Arbitros.vue";
import ReporteAnual from "./components/ReporteAnual.vue";
import GastoRecuperoDetalle from "./components/GastoRecuperoDetalle.vue";
import PrestamosDetalle from "./components/PrestamosDetalle.vue";

const routes = [
  { path: "/", name: "tablero", component: Tablero },
  { path: "/prestamos", name: "prestamos", component: Prestamos },
  { path: "/caja", name: "caja", component: ControlCaja },
  { path: "/arbitros", name: "arbitros", component: Arbitros },
  { path: "/reporte", name: "reporte", component: ReporteAnual },
  {
    path: "/gasto-recupero/:idTransaccion",
    name: "gasto-recupero-detalle",
    component: GastoRecuperoDetalle,
    props: true,
  },
  {
    path: "/prestamos/:idPrestamo",
    name: "prestamo-detalle",
    component: PrestamosDetalle,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
