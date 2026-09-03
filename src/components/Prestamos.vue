<template>
  <div class="flex-1 p-8 overflow-y-auto space-y-8 select-none">
    <!-- Top Row: Title and Main Action -->
    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-reffinance-navy font-outfit">
          Gestión de Préstamos
        </h1>
        <p class="text-slate-400 text-sm mt-1">
          Monitoree y procese anticipos financieros para arbitraje.
        </p>
      </div>
      <div
        class="flex flex-col sm:flex-row gap-3 self-start sm:self-auto w-full sm:w-auto"
      >
        <button
          @click="downloadReport"
          class="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-sm font-bold transition-all duration-200 flex items-center justify-center shadow-sm whitespace-nowrap cursor-pointer"
        >
          <FileText class="w-4 h-4 mr-2 shrink-0 text-slate-500" />
          Generar Reporte PDF
        </button>
        <button
          @click="showLoanModal = true"
          class="px-4 py-2.5 bg-reffinance-navy hover:bg-reffinance-navy-dark text-white rounded-lg text-sm font-bold transition-all duration-200 flex items-center justify-center shadow-md whitespace-nowrap cursor-pointer"
        >
          <Plus class="w-4 h-4 mr-2 shrink-0" />
          Crear Nuevo Préstamo
        </button>
      </div>
    </div>

    <!-- Metrics Cards Row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Total Préstamos Activos -->
      <div
        class="bg-white border border-reffinance-border p-6 rounded-2xl shadow-sm space-y-4"
      >
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Total Préstamos Activos
        </h3>
        <div class="space-y-1">
          <p class="text-3xl font-extrabold text-reffinance-navy font-outfit">
            ${{ formatNumber(stats.totalPrestamos) }}
          </p>
          <div class="flex items-center text-emerald-600 text-xs font-bold">
            <TrendingUp class="w-3.5 h-3.5 mr-1" />
            +4.2% desde el mes pasado
          </div>
        </div>
      </div>

      <!-- Aprobaciones Pendientes -->
      <div
        class="bg-white border border-reffinance-border p-6 rounded-2xl shadow-sm space-y-4"
      >
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Préstamos Pagados
        </h3>
        <div class="space-y-1">
          <p class="text-3xl font-extrabold text-emerald-600 font-outfit">
            {{ stats.pendientes }} Pagados
          </p>
          <div class="flex items-center text-emerald-600 text-xs font-bold">
            <CheckCircle class="w-3.5 h-3.5 mr-1" />
            Total de préstamos liquidados
          </div>
        </div>
      </div>

      <!-- Cuotas Vencidas -->
      <div
        class="bg-white border border-reffinance-border p-6 rounded-2xl shadow-sm space-y-4"
      >
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Préstamos en Retraso
        </h3>
        <div class="space-y-1">
          <p class="text-3xl font-extrabold text-rose-600 font-outfit">
            {{ stats.vencidos }} Retrasos
          </p>
          <div class="flex items-center text-rose-600 text-xs font-bold">
            <ShieldAlert class="w-3.5 h-3.5 mr-1" />
            Requiere acción de cobro
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Sort Row -->
    <div
      class="bg-white border border-reffinance-border p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div
        class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 flex-wrap"
      >
        <!-- Estado Filter -->
        <div
          class="flex items-center space-x-2 flex-wrap gap-y-1.5"
        >
          <span
            class="text-xs font-bold text-slate-400 uppercase tracking-wider"
            >Estado:</span
          >
          <div class="flex items-center space-x-1.5 flex-wrap gap-y-1.5">
            <button
              v-for="status in states"
              :key="status"
              @click="activeState = status"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer',
                activeState === status
                  ? 'bg-reffinance-navy text-white shadow-sm'
                  : 'bg-white border border-reffinance-border text-slate-500 hover:bg-slate-50',
              ]"
            >
              {{ status }}
            </button>
          </div>
        </div>
      </div>

      <!-- Sorting Controls -->
      <div class="flex items-center space-x-2 self-start md:self-auto text-xs">
        <span class="font-bold text-slate-400 uppercase tracking-wider">Ordenar:</span>
        <select
          v-model="sortBy"
          class="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-reffinance-navy cursor-pointer"
        >
          <option value="fechaSolicitud">Fecha Solicitud</option>
          <option value="montoSolicitado">Monto Solicitado</option>
          <option value="montoDevuelto">Monto Pagado</option>
          <option value="idPrestamo">ID Préstamo</option>
          <option value="estado">Estado</option>
          <option value="fechaRegistro">Fecha Registro</option>
        </select>
        <button
          type="button"
          @click="sortDir = sortDir === 'asc' ? 'desc' : 'asc'"
          :title="sortDir === 'asc' ? 'Orden Ascendente' : 'Orden Descendente'"
          class="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer flex items-center space-x-1 font-bold text-xs"
        >
          <ArrowUp v-if="sortDir === 'asc'" class="w-3.5 h-3.5 text-reffinance-navy" />
          <ArrowDown v-else class="w-3.5 h-3.5 text-reffinance-navy" />
          <span>{{ sortDir === 'asc' ? 'ASC' : 'DESC' }}</span>
        </button>
      </div>
    </div>

    <!-- Loans Table Component -->
    <PrestamosTable
      :loans="paginatedLoans"
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-loans="totalLoansCount"
      :page-size="pageSize"
      :sort-by="sortBy"
      :sort-dir="sortDir"
      @pay="openPaymentModal"
      @update-date="openDateModal"
      @change-page="onPageChange"
      @sort-change="onSortChange"
      @update:page-size="onPageSizeChange"
    />

    <!-- Modal interactivo: Crear Nuevo Préstamo -->
    <PrestamoNuevoModal
      :show="showLoanModal"
      :referees="referees"
      @close="showLoanModal = false"
      @submit="submitLoan"
    />

    <!-- Modal interactivo: Registrar Pago de Préstamo -->
    <PrestamoPagoModal
      :show="showPaymentModal"
      :loan="selectedLoanForPayment"
      @close="showPaymentModal = false"
      @submit="submitPayment"
    />

    <!-- Modal interactivo: Actualizar Fecha de Préstamo -->
    <PrestamoFechaModal
      :show="showDateModal"
      :loan="selectedLoanForDate"
      @close="showDateModal = false"
      @submit="submitDateUpdate"
    />
  </div>
</template>

<script setup>
import {
  Plus,
  TrendingUp,
  ShieldAlert,
  FileText,
  CheckCircle,
  ArrowUp,
  ArrowDown,
} from "lucide-vue-next";
import { ref, onMounted, computed, watch } from "vue";
import api from "../services/api";
import PrestamosTable from "./tables/PrestamosTable.vue";
import PrestamoNuevoModal from "./modals/PrestamoNuevoModal.vue";
import PrestamoPagoModal from "./modals/PrestamoPagoModal.vue";
import PrestamoFechaModal from "./modals/PrestamoFechaModal.vue";

const props = defineProps({
  searchQuery: {
    type: String,
    default: "",
  },
});

// Reactivos para datos del servicio
const loans = ref([]);
const referees = ref([]);
const stats = ref({
  totalPrestamos: 0.0,
  pendientes: 0,
  vencidos: 0,
});

// Filtros y modales
const states = ["Todos", "Pendiente", "Pagado", "Retraso"];
const activeState = ref("Todos");
const showLoanModal = ref(false);
const showPaymentModal = ref(false);
const selectedLoanForPayment = ref(null);

const showDateModal = ref(false);
const selectedLoanForDate = ref(null);

// Reactivos de paginación y ordenamiento del Pageable de Spring Boot
const currentPage = ref(1);
const totalPages = ref(1);
const totalLoansCount = ref(0);
const pageSize = ref(10);
const sortBy = ref("fechaSolicitud");
const sortDir = ref("desc");

// Watchers de filtros y cambios para refrescar la consulta al backend
watch([currentPage, pageSize, sortBy, sortDir, activeState], () => {
  loadData();
});

// Resetear página al cambiar filtro o búsqueda
watch([activeState, () => props.searchQuery], () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1;
  } else {
    loadData();
  }
});

// Cargar información al montar y con paginación
const loadData = async () => {
  try {
    const sortParam = `${sortBy.value},${sortDir.value}`;
    const fetchedLoans = await api.getLoans({
      page: currentPage.value - 1,
      size: pageSize.value,
      sort: sortParam,
      estado: activeState.value !== "Todos" ? activeState.value.toUpperCase() : null,
    });
    loans.value = fetchedLoans;
    totalPages.value = fetchedLoans.totalPages || 1;
    totalLoansCount.value = fetchedLoans.totalElements || fetchedLoans.length;

    if (!referees.value.length) {
      referees.value = await api.getReferees();
    }

    // Recalcular estadísticas globales de préstamos
    const allLoansForStats = await api.getLoans({ page: 0, size: 1000 });
    const total = allLoansForStats.reduce(
      (acc, curr) => acc + (curr.montoSolicitado - curr.montoDevuelto),
      0,
    );
    const pagados = allLoansForStats.filter((l) => l.estado === "PAGADO");
    const retraso = allLoansForStats.filter(
      (l) => l.estado === "RETRASO" || l.estado === "VENCIDO",
    );

    stats.value = {
      totalPrestamos: total,
      pendientes: pagados.length,
      vencidos: retraso.length,
    };
  } catch (err) {
    console.error("Error al cargar préstamos:", err);
  }
};

onMounted(() => {
  loadData();
});

// Filtrado reactivo adicional local (para el buscador global si se requiere)
const paginatedLoans = computed(() => {
  let result = loans.value;

  if (props.searchQuery.trim()) {
    const query = props.searchQuery.toLowerCase();
    result = result.filter((loan) => {
      const name = loan.nombreArbitro
        ? loan.nombreArbitro.toLowerCase()
        : loan.arbitro && typeof loan.arbitro === "object"
          ? `${loan.arbitro.nombre || ""} ${loan.arbitro.apellido || ""}`.toLowerCase()
          : String(loan.arbitro || "").toLowerCase();

      return (
        String(loan.idPrestamo).toLowerCase().includes(query) ||
        name.includes(query) ||
        String(loan.estado || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }

  return result;
});

const onPageChange = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage;
  }
};

const onSortChange = ({ sortBy: newSortBy, sortDir: newSortDir }) => {
  sortBy.value = newSortBy;
  sortDir.value = newSortDir;
  currentPage.value = 1;
};

const onPageSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1;
};

// Crear préstamo
const submitLoan = async (formData) => {
  if (!formData.arbitro || !formData.montoTotal || !formData.fechaSolicitud)
    return;

  const payload = {
    arbitro: formData.arbitro,
    montoTotal: parseFloat(formData.montoTotal),
    fechaSolicitud: formData.fechaSolicitud,
  };

  try {
    await api.createLoan(payload);
    await loadData();
    showLoanModal.value = false;
    alert("Solicitud de préstamo enviada y agregada con éxito.");
  } catch (err) {
    console.error("Error al registrar préstamo:", err);
    alert("Error al registrar el préstamo.");
  }
};

const submitPayment = async (data) => {
  const targetLoan = data?.loan || selectedLoanForPayment.value;
  if (!targetLoan || !data?.monto) return;

  try {
    await api.registerLoanPayment(
      targetLoan.idPrestamo,
      data.monto,
      data.fecha,
    );
    await loadData();
    showPaymentModal.value = false;
    selectedLoanForPayment.value = null;
    alert("Abono registrado con éxito.");
  } catch (err) {
    console.error("Error al registrar el pago:", err);
    alert(
      "No se pudo registrar el pago. Verifique los datos o inténtelo de nuevo.",
    );
  }
};

const submitDateUpdate = async (data) => {
  const targetLoan = data?.loan || selectedLoanForDate.value;
  const idPrestamo = data?.idPrestamo || targetLoan?.idPrestamo;
  if (!idPrestamo || !data?.fecha) return;

  try {
    await api.updateLoanDate(
      idPrestamo,
      data.fecha,
    );
    await loadData();
    showDateModal.value = false;
    alert("Fecha de solicitud actualizada con éxito.");
  } catch (err) {
    console.error("Error al actualizar la fecha del préstamo:", err);
    alert("No se pudo actualizar la fecha del préstamo. Inténtelo nuevamente.");
  }
};

// Utilidades
const formatNumber = (num) => {
  if (num === undefined || num === null) return "0.00";
  return num.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const downloadReport = async () => {
  try {
    const blob = await api.downloadLoansReport();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "reporte_prestamos.pdf");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error al descargar el reporte de préstamos:", error);
    alert(
      "No se pudo generar o descargar el reporte de préstamos. Verifique si el backend está activo.",
    );
  }
};

const openPaymentModal = (loan) => {
  if (loan.estado === "PAGADO") {
    alert(
      `El préstamo de ${loan.nombreArbitro} ya está completamente liquidado.`,
    );
    return;
  }
  selectedLoanForPayment.value = loan;
  showPaymentModal.value = true;
};

const openDateModal = (loan) => {
  selectedLoanForDate.value = loan;
  showDateModal.value = true;
};
</script>
