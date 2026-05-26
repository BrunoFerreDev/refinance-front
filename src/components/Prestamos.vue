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
      <button
        @click="showLoanModal = true"
        class="px-4 py-2.5 bg-reffinance-navy hover:bg-reffinance-navy-dark text-white rounded-lg text-sm font-bold transition-all duration-200 flex items-center shadow-md whitespace-nowrap self-start sm:self-auto"
      >
        <Plus class="w-4 h-4 mr-2 shrink-0" />
        Crear Nuevo Préstamo
      </button>
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
          Aprobaciones Pendientes
        </h3>
        <div class="space-y-1">
          <p class="text-3xl font-extrabold text-amber-600 font-outfit">
            {{ stats.pendientes }} Solicitudes
          </p>
          <div class="flex items-center text-amber-600 text-xs font-bold">
            <AlertCircle class="w-3.5 h-3.5 mr-1" />
            Requiere revisión inmediata
          </div>
        </div>
      </div>

      <!-- Cuotas Vencidas -->
      <div
        class="bg-white border border-reffinance-border p-6 rounded-2xl shadow-sm space-y-4"
      >
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Cuotas Vencidas
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
        <div class="flex items-center space-x-2 flex-wrap gap-y-1.5">
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

        <!-- Date Range Filter -->
        <div class="flex items-center space-x-2">
          <span
            class="text-xs font-bold text-slate-400 uppercase tracking-wider"
            >Rango:</span
          >
          <div class="relative">
            <select
              class="appearance-none pr-8 pl-3 py-1.5 bg-slate-50 border border-reffinance-border rounded-lg text-xs font-bold text-slate-600 focus:outline-none focus:bg-white select-none cursor-pointer"
            >
              <option>Últimos 30 Días</option>
              <option>Últimos 90 Días</option>
              <option>Año Completo 2023</option>
            </select>
            <ChevronDown
              class="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          </div>
        </div>
      </div>

      <button
        @click="alertFilters"
        class="px-3.5 py-1.5 bg-white border border-reffinance-border rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center shadow-sm self-start lg:self-auto"
      >
        <SlidersHorizontal class="w-3.5 h-3.5 mr-1.5 text-slate-400" />
        Más Filtros
      </button>
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
              v-for="loan in filteredLoans"
              :key="loan.id"
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
                    {{ getInitials(loan.arbitro) }}
                  </div>
                  <div>
                    <p class="font-extrabold text-slate-800 leading-tight">
                      {{ loan.arbitro }}
                    </p>
                    <p
                      class="text-[10px] text-slate-400 font-bold leading-tight mt-0.5"
                    >
                      ID: {{ loan.id }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-6 font-semibold font-outfit text-slate-700">
                ${{ formatNumber(loan.montoTotal) }}
              </td>
              <td class="py-4 px-6 font-semibold font-outfit text-slate-500">
                ${{ formatNumber(loan.montoPagado) }}
              </td>
              <td
                :class="[
                  'py-4 px-6 font-bold font-outfit',
                  loan.saldoRestante > 0 ? 'text-slate-800' : 'text-slate-400',
                ]"
              >
                ${{ formatNumber(loan.saldoRestante) }}
              </td>
              <td class="py-4 px-6">
                <span
                  :class="[
                    'font-bold text-xs',
                    loan.estado === 'Vencido'
                      ? 'text-rose-600'
                      : loan.estado === 'Pagado'
                        ? 'text-slate-400 font-normal italic'
                        : 'text-slate-600',
                  ]"
                >
                  {{
                    loan.estado === "Pagado"
                      ? "Completado"
                      : loan.fechaSolicitud
                  }}
                </span>
              </td>
              <td class="py-4 px-6">
                <span
                  :class="[
                    'px-2.5 py-1 rounded text-[10px] font-bold border',
                    loan.estado === 'Activo'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : loan.estado === 'Pendiente'
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : loan.estado === 'Pagado'
                          ? 'bg-slate-100 border-slate-200 text-slate-500'
                          : 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse',
                  ]"
                >
                  {{ loan.estado }}
                </span>
              </td>
              <td class="py-4 px-6 text-center">
                <button
                  @click="openActionMenu(loan)"
                  class="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <MoreVertical class="w-4.5 h-4.5" />
                </button>
              </td>
            </tr>
            <tr v-if="filteredLoans.length === 0">
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
          Mostrando 1-{{ filteredLoans.length }} de {{ loans.length }} préstamos
        </p>
        <div class="flex items-center space-x-1.5 font-bold">
          <button
            disabled
            class="p-1.5 border border-reffinance-border rounded-lg bg-white opacity-40 select-none"
          >
            <ChevronLeft class="w-3.5 h-3.5" />
          </button>
          <button class="px-3 py-1 rounded bg-reffinance-navy text-white">
            1
          </button>
          <button
            class="px-3 py-1 border border-reffinance-border bg-white text-slate-600"
          >
            2
          </button>
          <button
            class="px-3 py-1 border border-reffinance-border bg-white text-slate-600"
          >
            3
          </button>
          <button
            class="p-1.5 border border-reffinance-border rounded-lg bg-white select-none"
          >
            <ChevronRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Promo Cards Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Blue banner info -->
      <div
        class="bg-reffinance-navy text-white rounded-2xl shadow-md p-6 lg:col-span-2 flex flex-col justify-between space-y-4"
      >
        <div>
          <h2 class="text-lg font-bold font-outfit">
            Conciliación de Fin de Trimestre
          </h2>
          <p class="text-slate-300 text-xs mt-2 leading-relaxed">
            Todas las solicitudes de préstamo pendientes deben procesarse antes
            del 31 de octubre para el informe financiero del T4. Asegúrese de
            verificar los antecedentes de todos los árbitros antes del
            desembolso.
          </p>
        </div>
        <div
          class="flex items-center text-[10px] font-bold text-slate-300 uppercase tracking-widest"
        >
          <ShieldAlert class="w-4 h-4 mr-2 text-amber-400" />
          Verificación Pre-Desembolso Obligatoria
        </div>
      </div>

      <!-- Light Blue export block -->
      <div
        class="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 lg:col-span-1 flex flex-col justify-between text-indigo-950 space-y-4"
      >
        <div class="flex items-start space-x-3.5">
          <div class="p-2 bg-indigo-500/10 rounded-lg text-indigo-700">
            <FileText class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-sm font-extrabold font-outfit text-indigo-900">
              Exportar Datos de Préstamos
            </h3>
            <p class="text-xs text-indigo-700/80 mt-1 leading-normal">
              Formatos CSV, PDF o XLSX listos para el departamento contable
              institucional.
            </p>
          </div>
        </div>
        <button
          @click="downloadReport"
          class="w-full py-2.5 bg-white border border-indigo-200 text-indigo-800 hover:bg-indigo-100/50 rounded-lg text-xs font-bold transition-all shadow-sm"
        >
          Descargar Informe
        </button>
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
            <!-- <div class="space-y-1.5">
              <label
                class="text-xs font-bold text-slate-400 uppercase tracking-wider"
                >Próxima Cuota (Fecha)</label
              >
              <input
                type="text"
                v-model="formLoan.proximaCuota"
                required
                placeholder="Ej. 24 Oct, 2023"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
              />
            </div> -->
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
              {{ selectedLoanForPayment?.arbitro }}
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
} from "lucide-vue-next";
import { ref, onMounted, computed } from "vue";
import api from "../services/api";

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
  pendientes: 12,
  vencidos: 3,
});

// Filtros y modales
const states = ["Todos", "Pendiente", "Pagado"];
const activeState = ref("Todos");
const showLoanModal = ref(false);
const showPaymentModal = ref(false);
const selectedLoanForPayment = ref(null);
const formPayment = ref({
  monto: null,
});

const formLoan = ref({
  arbitro: "",
  montoTotal: null,
});

// Cargar información al montar
const loadData = async () => {
  try {
    loans.value = await api.getLoans();
    referees.value = await api.getReferees();

    // Recalcular estadísticas básicas para simulación
    const total = loans.value.reduce(
      (acc, curr) => acc + curr.saldoRestante,
      0,
    );
    const pend = loans.value.filter((l) => l.estado === "Pendiente").length;
    const venc = loans.value.filter((l) => l.estado === "Vencido").length;

    stats.value = {
      totalPrestamos: total,
      pendientes: pend,
      vencidos: venc,
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
    result = result.filter(
      (loan) => loan.estado.toLowerCase() === activeState.value.toLowerCase(),
    );
  }

  // Filtrado por buscador global del Header
  if (props.searchQuery.trim()) {
    const query = props.searchQuery.toLowerCase();
    result = result.filter(
      (loan) =>
        String(loan.id).toLowerCase().includes(query) ||
        loan.arbitro.toLowerCase().includes(query) ||
        loan.estado.toLowerCase().includes(query),
    );
  }

  return result;
});

// Crear préstamo
const submitLoan = async () => {
  if (!formLoan.value.arbitro || !formLoan.value.montoTotal) return;

  const payload = {
    arbitro: formLoan.value.arbitro,
    montoTotal: parseFloat(formLoan.value.montoTotal),
  };

  try {
    await api.createLoan(payload);
    await loadData();

    formLoan.value = {
      arbitro: "",
      montoTotal: null,
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
      selectedLoanForPayment.value.id,
      formPayment.value.monto,
    );
    await loadData();

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

const downloadReport = () => {
  alert(
    "Descargando informe completo de préstamos y cuotas devengadas...\nArchivo Descargas/Prestamos_Conciliacion.xlsx guardado.",
  );
};

const openActionMenu = (loan) => {
  if (loan.estado === "Pagado") {
    alert(`El préstamo de ${loan.arbitro} ya está completamente liquidado.`);
    return;
  }
  selectedLoanForPayment.value = loan;
  formPayment.value.monto = loan.saldoRestante; // pre-cargar el saldo restante completo
  showPaymentModal.value = true;
};
</script>
