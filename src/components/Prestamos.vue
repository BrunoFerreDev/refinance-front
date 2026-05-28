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
          class="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-sm font-bold transition-all duration-200 flex items-center justify-center shadow-sm whitespace-nowrap"
        >
          <FileText class="w-4 h-4 mr-2 shrink-0 text-slate-500" />
          Generar Reporte PDF
        </button>
        <button
          @click="showLoanModal = true"
          class="px-4 py-2.5 bg-reffinance-navy hover:bg-reffinance-navy-dark text-white rounded-lg text-sm font-bold transition-all duration-200 flex items-center justify-center shadow-md whitespace-nowrap"
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

    <!-- Filters Row -->
    <div
      class="bg-white border border-reffinance-border p-4 rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4"
    >
      <div
        class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 flex-wrap"
      >
        <!-- Estado Filter -->
        <div
          class="flex items-center space-x-2 flex-wrap gap-y-1.5 justify-center w-full"
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
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
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
    </div>

    <!-- Loans Table Card -->
    <div
      class="bg-white border border-reffinance-border rounded-2xl shadow-sm overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="bg-slate-50 border-b border-reffinance-border text-[10px] uppercase font-bold text-slate-400 tracking-wider"
            >
              <th class="py-4 px-6">Nombre del Árbitro</th>
              <th class="py-4 px-6">Monto Total</th>
              <th class="py-4 px-6">Monto Pagado</th>
              <th class="py-4 px-6">Saldo Restante</th>
              <th class="py-4 px-6">Fecha Solicitud</th>
              <th class="py-4 px-6">Estado</th>
              <th class="py-4 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
            <tr
              v-for="loan in paginatedLoans"
              :key="loan.idPrestamo"
              class="hover:bg-slate-50/50 transition-colors"
            >
              <td class="py-4 px-6">
                <!-- Profile Avatar and Name -->
                <div class="flex items-center space-x-3">
                  <div
                    :class="[
                      'w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-sm',
                      loan.avatarColor,
                    ]"
                  >
                    {{ getInitials(loan.nombreArbitro) }}
                  </div>
                  <div>
                    <p class="font-extrabold text-slate-800 leading-tight">
                      {{ loan.nombreArbitro }}
                    </p>
                    <p
                      class="text-[10px] text-slate-400 font-bold leading-tight mt-0.5"
                    >
                      ID: #RF-LN-{{ loan.idPrestamo }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-6 font-semibold font-outfit text-slate-700">
                ${{ formatNumber(loan.montoSolicitado) }}
              </td>
              <td class="py-4 px-6 font-semibold font-outfit text-slate-500">
                ${{ formatNumber(loan.montoDevuelto) }}
              </td>
              <td
                :class="[
                  'py-4 px-6 font-bold font-outfit',
                  loan.montoSolicitado - loan.montoDevuelto > 0
                    ? 'text-slate-800'
                    : 'text-slate-400',
                ]"
              >
                ${{ formatNumber(loan.montoSolicitado - loan.montoDevuelto) }}
              </td>
              <td class="py-4 px-6">
                <span
                  :class="[
                    'font-bold text-xs',
                    loan.estado === 'VENCIDO' || loan.estado === 'RETRASO'
                      ? 'text-rose-600'
                      : loan.estado === 'PAGADO'
                        ? 'text-slate-400 font-normal italic'
                        : 'text-slate-600',
                  ]"
                >
                  {{
                    loan.estado === "PAGADO"
                      ? "Completado"
                      : loan.formattedFecha
                  }}
                </span>
              </td>
              <td class="py-4 px-6">
                <span
                  :class="[
                    'px-2.5 py-1 rounded text-[10px] font-bold border',
                    loan.estado === 'PAGADO'
                      ? 'bg-slate-100 border-slate-200 text-slate-500'
                      : loan.estado === 'PENDIENTE'
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : loan.estado === 'VENCIDO' || loan.estado === 'RETRASO'
                          ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-700',
                  ]"
                >
                  {{ loan.estado }}
                </span>
              </td>
              <td class="py-4 px-6 text-center">
                <div class="flex items-center justify-center space-x-1.5">
                  <router-link
                    :to="{
                      name: 'prestamo-detalle',
                      params: { idPrestamo: loan.idPrestamo },
                    }"
                    title="Ver Detalle"
                    class="p-1.5 hover:bg-amber-50 rounded text-amber-600 hover:text-amber-700 transition-colors flex items-center justify-center"
                  >
                    <Eye class="w-4 h-4" />
                  </router-link>
                  <button
                    v-if="loan.estado !== 'PAGADO'"
                    @click="openPaymentModal(loan)"
                    title="Registrar Pago"
                    class="p-1.5 hover:bg-emerald-50 rounded text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <DollarSign class="w-4 h-4" />
                  </button>
                  <button
                    v-if="loan.estado !== 'PAGADO'"
                    @click="openDateModal(loan)"
                    title="Actualizar Fecha"
                    class="p-1.5 hover:bg-indigo-50 rounded text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    <Calendar class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedLoans.length === 0">
              <td
                colspan="7"
                class="text-center py-12 text-slate-400 font-semibold"
              >
                No se encontraron préstamos que coincidan con la búsqueda.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer Info -->
      <div
        class="px-6 py-4 bg-slate-50 border-t border-reffinance-border flex items-center justify-between text-xs font-semibold text-slate-500"
      >
        <p>
          Mostrando {{ paginatedLoans.length }} de
          {{ filteredLoans.length }} préstamos
        </p>
        <div class="flex items-center space-x-1.5 font-bold">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="p-1.5 border border-reffinance-border rounded-lg bg-white text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-white select-none cursor-pointer"
          >
            <ChevronLeft class="w-3.5 h-3.5" />
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-3 py-1 rounded transition-all select-none cursor-pointer border',
              currentPage === page
                ? 'bg-reffinance-navy border-reffinance-navy text-white'
                : 'bg-white border-reffinance-border text-slate-600 hover:bg-slate-50',
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="p-1.5 border border-reffinance-border rounded-lg bg-white text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-white select-none cursor-pointer"
          >
            <ChevronRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal interactivo: Crear Nuevo Préstamo -->
    <div
      v-if="showLoanModal"
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all duration-300"
    >
      <div
        class="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-reffinance-border transform scale-100 transition-all duration-300"
      >
        <div
          class="bg-reffinance-navy p-6 text-white flex items-center justify-between"
        >
          <div>
            <h3 class="text-lg font-bold font-outfit">Crear Nuevo Préstamo</h3>
            <p class="text-xs text-slate-300">
              Registre una nueva asignación de fondos amortizable
            </p>
          </div>
          <button
            @click="showLoanModal = false"
            class="p-1 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="submitLoan" class="p-6 space-y-4">
          <div class="space-y-1.5">
            <label
              class="text-xs font-bold text-slate-400 uppercase tracking-wider"
              >Árbitro Solicitante</label
            >
            <select
              v-model="formLoan.arbitro"
              required
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
            >
              <option value="" disabled>Seleccione un árbitro</option>
              <option v-for="ref in referees" :key="ref.id" :value="ref.id">
                {{ ref.nombre }} ({{ ref.clasificacion }})
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label
                class="text-xs font-bold text-slate-400 uppercase tracking-wider"
                >Monto Total ($)</label
              >
              <input
                type="number"
                step="0.01"
                v-model.number="formLoan.montoTotal"
                required
                placeholder="0.00"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
              />
            </div>
            <div class="space-y-1.5">
              <label
                class="text-xs font-bold text-slate-400 uppercase tracking-wider"
                >Fecha de Solicitud</label
              >
              <input
                type="date"
                v-model="formLoan.fechaSolicitud"
                required
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
              />
            </div>
          </div>

          <div
            class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3"
          >
            <button
              type="button"
              @click="showLoanModal = false"
              class="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-reffinance-navy hover:bg-reffinance-navy-dark text-white rounded-lg text-sm font-bold shadow-md transition-colors"
            >
              Crear Préstamo
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal interactivo: Registrar Pago de Préstamo -->
    <div
      v-if="showPaymentModal"
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all duration-300"
    >
      <div
        class="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-reffinance-border transform scale-100 transition-all duration-300"
      >
        <div
          class="bg-reffinance-navy p-6 text-white flex items-center justify-between"
        >
          <div>
            <h3 class="text-lg font-bold font-outfit">Registrar Pago</h3>
            <p class="text-xs text-slate-300">
              Registrar abono de cuota para
              {{ selectedLoanForPayment?.nombreArbitro }}
            </p>
          </div>
          <button
            @click="showPaymentModal = false"
            class="p-1 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="submitPayment" class="p-6 space-y-4">
          <div class="space-y-1.5">
            <p
              class="text-xs font-bold text-slate-400 uppercase tracking-wider"
            >
              Detalles del Préstamo
            </p>
            <div
              class="bg-slate-50 p-3 rounded-lg text-xs font-semibold text-slate-600 space-y-1"
            >
              <div class="flex justify-between">
                <span>Monto Total:</span>
                <span class="font-bold text-slate-800"
                  >${{ formatNumber(selectedLoanForPayment?.montoTotal) }}</span
                >
              </div>
              <div class="flex justify-between">
                <span>Monto Pagado:</span>
                <span class="font-bold text-slate-800"
                  >${{
                    formatNumber(selectedLoanForPayment?.montoPagado)
                  }}</span
                >
              </div>
              <div class="flex justify-between">
                <span>Saldo Restante:</span>
                <span class="font-bold text-slate-800"
                  >${{
                    formatNumber(selectedLoanForPayment?.saldoRestante)
                  }}</span
                >
              </div>
            </div>
          </div>

          <div class="space-y-1.5">
            <label
              class="text-xs font-bold text-slate-400 uppercase tracking-wider"
              >Monto a Pagar ($)</label
            >
            <input
              type="number"
              step="0.01"
              v-model.number="formPayment.monto"
              required
              :max="selectedLoanForPayment?.saldoRestante"
              placeholder="0.00"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
            />
          </div>
          <div class="space-y-1.5">
            <label
              class="text-xs font-bold text-slate-400 uppercase tracking-wider"
              >Fecha de Pago</label
            >
            <input
              type="date"
              v-model="formPayment.fecha"
              required
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
            />
          </div>

          <div
            class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3"
          >
            <button
              type="button"
              @click="showPaymentModal = false"
              class="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-md transition-colors"
            >
              Registrar Pago
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal interactivo: Actualizar Fecha de Préstamo -->
    <div
      v-if="showDateModal"
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all duration-300"
    >
      <div
        class="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-reffinance-border transform scale-100 transition-all duration-300"
      >
        <div
          class="bg-reffinance-navy p-6 text-white flex items-center justify-between"
        >
          <div>
            <h3 class="text-lg font-bold font-outfit">
              Actualizar Fecha de Solicitud
            </h3>
            <p class="text-xs text-slate-300">
              Modifique la fecha del préstamo de
              {{ selectedLoanForDate?.nombreArbitro }}
            </p>
          </div>
          <button
            @click="showDateModal = false"
            class="p-1 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="submitDateUpdate" class="p-6 space-y-4">
          <div class="space-y-1.5">
            <label
              class="text-xs font-bold text-slate-400 uppercase tracking-wider"
              >Nueva Fecha de Solicitud</label
            >
            <input
              type="date"
              v-model="newLoanDate"
              required
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
            />
          </div>

          <div
            class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3"
          >
            <button
              type="button"
              @click="showDateModal = false"
              class="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-reffinance-navy hover:bg-reffinance-navy-dark text-white rounded-lg text-sm font-bold shadow-md transition-colors"
            >
              Guardar Fecha
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Plus,
  TrendingUp,
  AlertCircle,
  ShieldAlert,
  ChevronDown,
  SlidersHorizontal,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  FileText,
  X,
  Calendar,
  DollarSign,
  Eye,
} from "lucide-vue-next";
import { ref, onMounted, computed, watch } from "vue";
import api from "../services/api";
import { CheckCircle } from "lucide-vue-next";

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
  totalPrestamos: 42850.0,
  pendientes: 0,
  vencidos: 0,
});

// Filtros y modales
const states = ["Todos", "Pendiente", "Pagado", "Retraso"];
const activeState = ref("Retraso");
const showLoanModal = ref(false);
const showPaymentModal = ref(false);
const selectedLoanForPayment = ref(null);
const formPayment = ref({
  monto: null,
  fecha: "",
});

// Reactivos para modal de actualización de fecha
const showDateModal = ref(false);
const selectedLoanForDate = ref(null);

// Reactivos para modal de detalle de préstamo
const showDetailModal = ref(false);
const selectedLoanForDetail = ref(null);
const loanDetailsPageData = ref(null);
const detailsCurrentPage = ref(0);
const detailsPageSize = ref(5);
const detailsLoading = ref(false);
const newLoanDate = ref("");

const formLoan = ref({
  arbitro: "",
  montoTotal: null,
  fechaSolicitud: "",
});

// Reactivos de paginación
const currentPage = ref(1);
const totalPages = ref(1);
const itemsPerPage = 5;

watch(currentPage, () => {
  loadData();
});

// Resetear página al buscar o filtrar
watch([activeState, () => props.searchQuery], () => {
  currentPage.value = 1;
});

// Cargar información al montar
const loadData = async () => {
  try {
    const fetchedLoans = await api.getLoans(currentPage.value - 1, itemsPerPage);
    loans.value = fetchedLoans;
    totalPages.value = fetchedLoans.totalPages || 1;
    referees.value = await api.getReferees();

    // Recalcular estadísticas básicas obteniendo todos los préstamos para consistencia de totales
    const allLoansForStats = await api.getLoans(0, 1000);
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
      pendientes: pagados.length, // Pagados
      vencidos: retraso.length, // Retraso
    };
  } catch (err) {
    console.error("Error al cargar préstamos:", err);
  }
};

onMounted(() => {
  loadData();
});

// Filtrado reactivo de préstamos
const filteredLoans = computed(() => {
  let result = loans.value;

  // Filtrado por estado
  if (activeState.value !== "Todos") {
    result = result.filter((loan) => {
      if (!loan.estado) return false;
      const stateUpper = loan.estado.toUpperCase();
      if (activeState.value === "Pendiente") return stateUpper === "PENDIENTE";
      if (activeState.value === "Pagado") return stateUpper === "PAGADO";
      if (activeState.value === "Retraso")
        return stateUpper === "RETRASO" || stateUpper === "VENCIDO";
      return false;
    });
  }

  // Filtrado por buscador global del Header
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

// Paginación
const paginatedLoans = computed(() => {
  return filteredLoans.value;
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

// Crear préstamo
const submitLoan = async () => {
  if (
    !formLoan.value.arbitro ||
    !formLoan.value.montoTotal ||
    !formLoan.value.fechaSolicitud
  )
    return;

  const payload = {
    arbitro: formLoan.value.arbitro,
    montoTotal: parseFloat(formLoan.value.montoTotal),
    fechaSolicitud: formLoan.value.fechaSolicitud,
  };

  try {
    await api.createLoan(payload);
    await loadData();

    formLoan.value = {
      arbitro: "",
      montoTotal: null,
      fechaSolicitud: "",
    };
    showLoanModal.value = false;
    alert("Solicitud de préstamo enviada y agregada con éxito.");
  } catch (err) {
    console.error("Error al registrar préstamo:", err);
  }
};

const submitPayment = async () => {
  if (!selectedLoanForPayment.value || !formPayment.value.monto) return;

  try {
    await api.registerLoanPayment(
      selectedLoanForPayment.value.idPrestamo,
      formPayment.value.monto,
      formPayment.value.fecha,
    );
    await loadData();
    if (showDetailModal.value && selectedLoanForDetail.value) {
      await fetchLoanDetails();
    }

    showPaymentModal.value = false;
    selectedLoanForPayment.value = null;
    formPayment.value.monto = null;
    alert("Abono registrado con éxito.");
  } catch (err) {
    console.error("Error al registrar el pago:", err);
    alert(
      "No se pudo registrar el pago. Verifique los datos o inténtelo de nuevo.",
    );
  }
};

const openLoanDetailsModal = async (loan) => {
  selectedLoanForDetail.value = loan;
  detailsCurrentPage.value = 0;
  showDetailModal.value = true;
  await fetchLoanDetails();
};

const fetchLoanDetails = async () => {
  if (!selectedLoanForDetail.value) return;
  detailsLoading.value = true;
  try {
    loanDetailsPageData.value = await api.getLoanDetails(
      selectedLoanForDetail.value.idPrestamo,
      detailsCurrentPage.value,
      detailsPageSize.value,
    );
  } catch (err) {
    console.error("Error al obtener detalles del préstamo:", err);
  } finally {
    detailsLoading.value = false;
  }
};

const nextDetailsPage = async () => {
  if (loanDetailsPageData.value && !loanDetailsPageData.value.last) {
    detailsCurrentPage.value++;
    await fetchLoanDetails();
  }
};

const prevDetailsPage = async () => {
  if (detailsCurrentPage.value > 0) {
    detailsCurrentPage.value--;
    await fetchLoanDetails();
  }
};

const formatFecha = (fechaStr) => {
  if (!fechaStr) return "Sin Fecha";
  return new Date(fechaStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Utilidades
const formatNumber = (num) => {
  if (num === undefined || num === null) return "0.00";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const getInitials = (name) => {
  if (!name) return "AR";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const alertFilters = () => {
  alert(
    "Filtrado avanzado:\nAquí puedes filtrar préstamos por montos mayores/menores, plazos de amortización, y confiabilidad del árbitro.",
  );
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
  formPayment.value.monto = loan.saldoRestante; // pre-cargar el saldo restante completo
  formPayment.value.fecha = new Date().toISOString().split("T")[0]; // pre-llenar con la fecha actual
  showPaymentModal.value = true;
};

const openDateModal = (loan) => {
  selectedLoanForDate.value = loan;
  newLoanDate.value = loan.fechaSolicitud || "";
  showDateModal.value = true;
};

const submitDateUpdate = async () => {
  if (!selectedLoanForDate.value || !newLoanDate.value) return;
  try {
    await api.updateLoanDate(
      selectedLoanForDate.value.idPrestamo,
      newLoanDate.value,
    );
    await loadData();
    if (showDetailModal.value && selectedLoanForDetail.value) {
      await fetchLoanDetails();
    }
    showDateModal.value = false;
    alert("Fecha de solicitud actualizada con éxito.");
  } catch (err) {
    console.error("Error al actualizar la fecha del préstamo:", err);
    alert("No se pudo actualizar la fecha del préstamo. Inténtelo nuevamente.");
  }
};
</script>
