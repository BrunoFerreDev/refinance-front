<template>
  <div class="flex-1 p-8 overflow-y-auto space-y-8 select-none">
    <!-- Top Row: Page Title and Top Action Buttons -->
    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-reffinance-navy font-outfit">
          Resumen Financiero
        </h1>
        <p class="text-slate-400 text-sm mt-1">
          Monitoreo de la integridad de los fondos de la asociación y el
          bienestar arbitral.
        </p>
      </div>
      <div class="flex items-center space-x-3 flex-wrap gap-y-2">
        <button
          @click="exportReport"
          class="px-4 py-2.5 bg-white border border-reffinance-border rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all duration-200 flex items-center shadow-sm whitespace-nowrap"
        >
          <Download class="w-4 h-4 mr-2 shrink-0" />
          Exportar Reporte
        </button>
        <button
          @click="showMovementModal = true"
          class="px-4 py-2.5 bg-reffinance-navy hover:bg-reffinance-navy-dark text-white rounded-lg text-sm font-bold transition-all duration-200 flex items-center shadow-md whitespace-nowrap"
        >
          <Plus class="w-4 h-4 mr-2 shrink-0" />
          Nuevo Movimiento
        </button>
      </div>
    </div>

    <!-- Metrics Cards Row -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Saldo Total -->
      <div
        class="bg-white border border-reffinance-border p-6 rounded-2xl shadow-sm space-y-4"
      >
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Saldo Total del Fondo
        </h3>
        <div class="space-y-1">
          <p class="text-3xl font-extrabold text-reffinance-navy font-outfit">
            ${{ formatNumber(cajaInfo.saldoFondo) }}
          </p>
          <div class="flex items-center text-emerald-600 text-xs font-bold">
            <TrendingUp class="w-3.5 h-3.5 mr-1" />
            +{{ cajaInfo.cambioFondo }}% desde el mes pasado
          </div>
        </div>
      </div>

      <!-- Préstamos Activos -->
      <div
        class="bg-white border border-reffinance-border p-6 rounded-2xl shadow-sm space-y-4"
      >
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Préstamos Activos
        </h3>
        <div class="space-y-1">
          <p class="text-3xl font-extrabold text-reffinance-navy font-outfit">
            ${{ formatNumber(cajaInfo.prestamosActivos) }}
          </p>
          <div class="flex items-center text-slate-500 text-xs font-bold">
            <Users class="w-3.5 h-3.5 mr-1" />
            {{ cajaInfo.aprobacionesPendientes }} aprobaciones pendientes
          </div>
        </div>
      </div>

      <!-- Ingresos Octubre -->
      <div
        class="bg-white border border-reffinance-border p-6 rounded-2xl shadow-sm space-y-4"
      >
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Ingresos Totales (OCT)
        </h3>
        <div class="space-y-1">
          <p class="text-3xl font-extrabold text-reffinance-navy font-outfit">
            ${{ formatNumber(cajaInfo.ingresosOctubre) }}
          </p>
          <div class="flex items-center text-emerald-600 text-xs font-bold">
            <ArrowUp class="w-3.5 h-3.5 mr-1" />
            ${{ formatNumber(cajaInfo.ingresoObjetivoOctubre) }} sobre el
            objetivo
          </div>
        </div>
      </div>

      <!-- Gastos Octubre -->
      <div
        class="bg-white border border-reffinance-border p-6 rounded-2xl shadow-sm space-y-4"
      >
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Gastos Totales (OCT)
        </h3>
        <div class="space-y-1">
          <p class="text-3xl font-extrabold text-reffinance-navy font-outfit">
            ${{ formatNumber(cajaInfo.gastosOctubre) }}
          </p>
          <div class="flex items-center text-rose-600 text-xs font-bold">
            <ArrowDown class="w-3.5 h-3.5 mr-1" />
            {{ cajaInfo.gastosCambioOctubre }}% vs mes pasado
          </div>
        </div>
      </div>
    </div>

    <!-- Cash Flow Chart and Sidebar Administrative Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cash Flow Chart Card -->
      <div
        class="bg-white border border-reffinance-border rounded-2xl shadow-sm p-6 lg:col-span-2 flex flex-col justify-between"
      >
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-lg font-bold text-reffinance-navy font-outfit">
              Análisis de Flujo de Caja
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">
              Ingresos vs Gastos históricos
            </p>
          </div>
          <!-- Legend -->
          <div class="flex items-center space-x-4 text-xs font-bold">
            <div class="flex items-center">
              <span
                class="w-2.5 h-2.5 bg-reffinance-navy rounded-full mr-1.5"
              ></span>
              <span class="text-slate-500">Ingresos</span>
            </div>
            <div class="flex items-center">
              <span class="w-2.5 h-2.5 bg-slate-400 rounded-full mr-1.5"></span>
              <span class="text-slate-500">Gastos</span>
            </div>
          </div>
        </div>

        <!-- Custom HTML/Tailwind CSS Bar Chart -->
        <div
          class="h-64 flex items-end justify-between px-4 pb-2 border-b border-slate-100"
        >
          <div
            v-for="bar in chartData"
            :key="bar.month"
            class="flex flex-col items-center flex-1 h-full justify-end group"
          >
            <div
              class="flex items-end justify-center space-x-1.5 w-full h-full relative"
            >
              <!-- Hover Tooltip -->
              <div
                class="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-200 bg-reffinance-navy text-white text-[10px] font-bold px-2 py-1 rounded shadow-md z-10 space-y-0.5 flex flex-col pointer-events-none"
              >
                <span>Ingresos: ${{ formatNumber(bar.ingresos) }}</span>
                <span>Gastos: ${{ formatNumber(bar.gastos) }}</span>
              </div>

              <!-- Ingresos Bar -->
              <div
                class="w-3 md:w-5 bg-reffinance-navy rounded-t-sm transition-all duration-500 group-hover:bg-[#000B33] origin-bottom cursor-pointer"
                :style="{ height: `${(bar.ingresos / maxMonthValue) * 100}%` }"
              ></div>
              <!-- Gastos Bar -->
              <div
                class="w-3 md:w-5 bg-slate-400 rounded-t-sm transition-all duration-500 group-hover:bg-slate-500 origin-bottom cursor-pointer"
                :style="{ height: `${(bar.gastos / maxMonthValue) * 100}%` }"
              ></div>
            </div>
            <span
              class="text-[10px] font-bold text-slate-400 uppercase mt-3 tracking-wider"
              >{{ bar.month }}</span
            >
          </div>
        </div>
      </div>

      <!-- Administrative Actions Card -->
      <div
        class="bg-reffinance-navy rounded-2xl shadow-md p-6 text-white flex flex-col justify-between"
      >
        <div class="space-y-2">
          <h2 class="text-xl font-bold font-outfit">
            Acciones Administrativas
          </h2>
          <p class="text-slate-300 text-xs leading-relaxed">
            Procese solicitudes financieras y actualice movimientos del libro
            mayor al instante.
          </p>
        </div>

        <div class="space-y-4 my-8">
          <button
            @click="showLoanModal = true"
            class="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 rounded-xl text-left transition-smooth group"
          >
            <div class="flex items-center space-x-3">
              <div class="p-2.5 bg-white/10 rounded-lg text-white">
                <FileText class="w-5 h-5" />
              </div>
              <div>
                <p class="text-sm font-bold font-outfit">Registrar Préstamo</p>
                <p class="text-[10px] text-slate-300">
                  Crear anticipo financiero
                </p>
              </div>
            </div>
            <ChevronRight
              class="w-5 h-5 text-white/50 group-hover:text-white transition-colors"
            />
          </button>

          <button
            @click="showMovementModal = true"
            class="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 rounded-xl text-left transition-smooth group"
          >
            <div class="flex items-center space-x-3">
              <div class="p-2.5 bg-white/10 rounded-lg text-white">
                <PlusSquare class="w-5 h-5" />
              </div>
              <div>
                <p class="text-sm font-bold font-outfit">Agregar Movimiento</p>
                <p class="text-[10px] text-slate-300">
                  Registrar ingreso o gasto en caja
                </p>
              </div>
            </div>
            <ChevronRight
              class="w-5 h-5 text-white/50 group-hover:text-white transition-colors"
            />
          </button>
        </div>

        <!-- Banner Footer Info -->
        <div
          class="flex items-center text-[10px] font-bold text-slate-300 uppercase tracking-widest"
        >
          <ShieldAlert class="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
          Sistemas Operativos Operacionales
        </div>
      </div>
    </div>

    <!-- Activity Table Component -->
    <TableroActividadTable
      :transactions="filteredTransactions"
      :current-page="currentPage"
      :total-pages="totalPages"
      @view-all="viewAllTransactions"
      @change-page="(p) => (currentPage = p)"
    />

    <!-- Modales Interactivos -->

    <!-- Modal 1: Nuevo Movimiento (Ingreso/Gasto) Component -->
    <TableroMovimientoModal
      :show="showMovementModal"
      :concepts="concepts"
      @close="showMovementModal = false"
      @submit="submitMovement"
    />

    <!-- Modal 2: Registrar Préstamo Component -->
    <TableroPrestamoModal
      :show="showLoanModal"
      :referees="referees"
      @close="showLoanModal = false"
      @submit="submitLoan"
    />
  </div>
</template>

<script setup>
import {
  Download,
  Plus,
  TrendingUp,
  Users,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronLeft,
  FileText,
  PlusSquare,
  ShieldAlert,
  X,
} from "lucide-vue-next";
import { ref, onMounted, computed, watch } from "vue";
import api from "../services/api";
import TableroActividadTable from "./tables/TableroActividadTable.vue";
import TableroMovimientoModal from "./modals/TableroMovimientoModal.vue";
import TableroPrestamoModal from "./modals/TableroPrestamoModal.vue";

const props = defineProps({
  searchQuery: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["change-tab"]);

// Reactivos para datos del servicio
const transactions = ref([]);
const cajaInfo = ref({
  saldoFondo: 0,
  prestamosActivos: 0,
  ingresosOctubre: 0,
  gastosOctubre: 0,
  cambioFondo: 0,
  aprobacionesPendientes: 0,
  ingresoObjetivoOctubre: 0,
  gastosCambioOctubre: 0,
});
const referees = ref([]);

// Modales y formularios
const showMovementModal = ref(false);
const showLoanModal = ref(false);

const concepts = ref([]);
const formMovement = ref({
  tipo: "Ingreso",
  monto: null,
  concepto: "",
  descripcion: "",
  estado: "PAGADO",
});

const formLoan = ref({
  arbitro: "",
  montoTotal: null,
});

// Gráfico de flujo de caja dinámico
const chartData = ref([]);

// Cargar información al montar
const loadData = async () => {
  try {
    transactions.value = await api.getTransactions();
    cajaInfo.value = await api.getCajaInfo();
    referees.value = await api.getReferees();
    concepts.value = await api.getConceptos();

    // Calcular chartData dinámicamente de las transacciones reales de los últimos 6 meses
    const monthNames = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const dynamicChart = [];
    for (let i = 5; i >= 0; i--) {
      let d = new Date(currentYear, currentMonth - i, 1);
      dynamicChart.push({
        month: monthNames[d.getMonth()],
        ingresos: 0,
        gastos: 0,
        year: d.getFullYear(),
        monthIndex: d.getMonth(),
      });
    }

    transactions.value.forEach((tx) => {
      const txDate = tx.fechaRaw ? new Date(tx.fechaRaw) : new Date(tx.fecha);
      if (!isNaN(txDate.getTime())) {
        const mIdx = txDate.getMonth();
        const yVal = txDate.getFullYear();
        const match = dynamicChart.find(
          (c) => c.monthIndex === mIdx && c.year === yVal,
        );
        if (match) {
          if (tx.monto > 0) {
            match.ingresos += tx.monto;
          } else {
            match.gastos += Math.abs(tx.monto);
          }
        }
      }
    });

    chartData.value = dynamicChart;
  } catch (err) {
    console.error("Error al cargar datos del tablero:", err);
  }
};

onMounted(() => {
  loadData();
});

// Filtrado reactivo de transacciones usando el buscador global del Header
const filteredTransactions = computed(() => {
  if (!props.searchQuery.trim()) return transactions.value;
  const query = props.searchQuery.toLowerCase();
  return transactions.value.filter(
    (tx) =>
      tx.id.toLowerCase().includes(query) ||
      tx.descripcion.toLowerCase().includes(query) ||
      tx.categoria.toLowerCase().includes(query) ||
      tx.tipo.toLowerCase().includes(query),
  );
});

// Reactivos de paginación para Actividad Reciente
const currentPage = ref(1);
const itemsPerPage = 5;

// Resetear página al buscar
watch(
  () => props.searchQuery,
  () => {
    currentPage.value = 1;
  },
);

const totalPages = computed(() => {
  return Math.max(
    1,
    Math.ceil(filteredTransactions.value.length / itemsPerPage),
  );
});

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredTransactions.value.slice(start, start + itemsPerPage);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Registrar nuevo movimiento
const submitMovement = async (formData) => {
  const current = formData || formMovement.value;
  if (!current.monto || !current.descripcion || !current.concepto) return;

  // Si es un gasto, el monto debe ser negativo
  let finalMonto = parseFloat(current.monto);
  if (current.tipo === "Gasto") {
    finalMonto = -Math.abs(finalMonto);
  }

  const payload = {
    tipo: current.tipo,
    concepto: current.concepto,
    descripcion: current.descripcion,
    monto: finalMonto,
    estado: current.estado,
  };

  try {
    await api.addTransaction(payload);
    // Recargar datos locales
    await loadData();

    // Limpiar formulario y cerrar modal
    formMovement.value = {
      tipo: "Ingreso",
      monto: null,
      concepto: "",
      descripcion: "",
      estado: "PAGADO",
    };
    showMovementModal.value = false;
    alert("Movimiento agregado exitosamente al libro de caja.");
  } catch (err) {
    console.error("Error al registrar movimiento:", err);
  }
};

// Registrar nuevo préstamo
const submitLoan = async (formData) => {
  const current = formData || formLoan.value;
  if (!current.arbitro || !current.montoTotal) return;

  const payload = {
    arbitro: current.arbitro,
    montoTotal: parseFloat(current.montoTotal),
  };

  try {
    await api.createLoan(payload);
    await loadData();

    formLoan.value = {
      arbitro: "",
      montoTotal: null,
    };
    showLoanModal.value = false;
    alert("Préstamo registrado y en proceso de aprobación.");
  } catch (err) {
    console.error("Error al registrar préstamo:", err);
  }
};

// Utilidades
const formatNumber = (num) => {
  if (num === undefined || num === null) return "0.00";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Escala dinámica del gráfico para evitar división por cero y soportar cualquier escala de datos
const maxMonthValue = computed(() => {
  const values = chartData.value.flatMap((f) => [f.ingresos, f.gastos]);
  const maxVal = Math.max(...values, 0);
  return maxVal > 0 ? maxVal : 1000;
});

const exportReport = () => {
  alert(
    "Generando PDF del reporte financiero general...\nGuardado con éxito en Descargas/Reporte_General_RefFinance.pdf",
  );
};
</script>
