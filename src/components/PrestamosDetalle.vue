<template>
  <div class="flex-1 p-8 overflow-y-auto space-y-8 select-none bg-[#F4F6FA]">
    
    <!-- Breadcrumbs and Action Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center space-x-2 text-xs font-bold text-slate-400">
        <router-link to="/prestamos" class="hover:text-reffinance-navy transition-colors">
          Gestión de Préstamos
        </router-link>
        <span>&gt;</span>
        <span class="text-reffinance-navy font-extrabold">Detalle del Préstamo</span>
      </div>

      <div class="flex items-center space-x-3">
        <button
          @click="goBack"
          class="px-4 py-2.5 bg-white border border-reffinance-border rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center shadow-sm"
        >
          <ArrowLeft class="w-4 h-4 mr-1.5 text-slate-400" />
          Volver a Préstamos
        </button>

        <!-- Only show payment action if NOT read-only (unpaid) -->
        <button
          v-if="!isReadOnly && loan"
          @click="openPaymentDialog"
          class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center"
        >
          <DollarSign class="w-4 h-4 mr-1.5" />
          Registrar Abono
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 space-y-4">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-reffinance-navy"></div>
      <p class="text-sm font-semibold text-slate-500">Cargando detalles del préstamo...</p>
    </div>

    <!-- Main Content -->
    <div v-else-if="loan" class="space-y-8">
      
      <!-- Paid Warning Read-Only Alert Banner -->
      <div 
        v-if="isReadOnly"
        class="bg-slate-100 border border-slate-200 rounded-2xl p-4 flex items-center space-x-3 shadow-xs text-xs font-semibold text-slate-500"
      >
        <span class="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block shrink-0 animate-ping"></span>
        <p>
          <span class="font-extrabold text-slate-700">Modo Solo Lectura:</span> Este préstamo ha sido completamente liquidado. No se permiten modificaciones ni abonos adicionales.
        </p>
      </div>

      <!-- Section 1: Referee Profile & Recovery Progress Overview -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Referee Information profile card -->
        <div class="lg:col-span-1 bg-white border border-reffinance-border rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between relative">
          <div class="absolute top-0 left-0 right-0 h-1.5 bg-reffinance-navy"></div>
          
          <div class="p-6 space-y-6 flex-1 flex flex-col justify-center">
            
            <div class="text-center space-y-4">
              <!-- Avatar Circle representing initial letters of Referee -->
              <div class="mx-auto w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-3xl text-reffinance-navy shadow-xs shrink-0">
                {{ getInitials(loan.nombreArbitro) }}
              </div>

              <div class="space-y-1">
                <h3 class="text-xl font-black text-reffinance-navy font-outfit leading-tight">
                  {{ loan.nombreArbitro }}
                </h3>
                <span class="inline-block px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full text-[10px] font-extrabold uppercase">
                  {{ loan.arbitro?.categoria || 'Árbitro Principal' }}
                </span>
              </div>
            </div>

            <!-- Metadatas list -->
            <div class="border-t border-slate-100 pt-5 space-y-3.5 text-xs font-semibold text-slate-500">
              <div class="flex justify-between items-center">
                <span class="flex items-center"><Calendar class="w-4 h-4 mr-2 text-slate-400" /> Fecha Solicitud</span>
                <span class="text-slate-800 font-extrabold">{{ formatFecha(loan.fechaSolicitud) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="flex items-center"><TrendingUp class="w-4 h-4 mr-2 text-slate-400" /> Código Préstamo</span>
                <span class="text-slate-800 font-extrabold text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">
                  {{ loan.id }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="flex items-center"><DollarSign class="w-4 h-4 mr-2 text-slate-400" /> Cuota Promedio</span>
                <span class="text-slate-800 font-extrabold">${{ formatNumber(loan.montoSolicitado / 4) }}</span>
              </div>
            </div>
          </div>

          <div class="bg-slate-50 p-4 border-t border-slate-100 text-center">
            <p class="text-[10px] font-bold text-slate-400">
              RefFinance • Módulo de Gestión de Préstamos
            </p>
          </div>
        </div>

        <!-- Metrics & Circular Progress Gauge Card -->
        <div class="lg:col-span-2 bg-white border border-reffinance-border rounded-2xl shadow-sm p-6 flex flex-col md:flex-row items-center gap-8">
          
          <!-- Circular Progress Meter -->
          <div class="relative shrink-0 flex flex-col items-center justify-center w-48 h-48">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#E2E8F0"
                stroke-width="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#081342"
                stroke-width="8"
                fill="transparent"
                :stroke-dasharray="strokeDasharray"
                :stroke-dashoffset="strokeDashoffset"
                stroke-linecap="round"
                class="transition-all duration-1000 ease-out"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-3xl font-black text-reffinance-navy font-outfit leading-none">
                {{ Math.round(porcentajeDevuelto) }}%
              </span>
              <span class="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">
                Devuelto
              </span>
            </div>
          </div>

          <!-- Financial Details Cards inside Gauge container -->
          <div class="flex-1 w-full space-y-6">
            <div>
              <h3 class="text-sm font-extrabold text-reffinance-navy font-outfit uppercase tracking-wider">
                Amortización del Préstamo
              </h3>
              <p class="text-xs text-slate-400 mt-0.5">Resumen de importes y saldos a liquidar</p>
            </div>

            <!-- Financial Grids -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <!-- Solicitado -->
              <div class="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-1">
                <p class="text-[9px] uppercase font-bold text-slate-400">Total Solicitado</p>
                <p class="text-xl font-black text-slate-700 font-outfit">
                  ${{ formatNumber(loan.montoSolicitado) }}
                </p>
              </div>

              <!-- Devuelto -->
              <div class="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl space-y-1">
                <p class="text-[9px] uppercase font-bold text-emerald-600">Monto Devuelto</p>
                <p class="text-xl font-black text-emerald-600 font-outfit">
                  ${{ formatNumber(loan.montoDevuelto) }}
                </p>
              </div>

              <!-- Pendiente -->
              <div class="bg-rose-50/50 border border-rose-100 p-4 rounded-xl space-y-1">
                <p class="text-[9px] uppercase font-bold text-rose-600">Saldo Restante</p>
                <p class="text-xl font-black text-rose-600 font-outfit">
                  ${{ formatNumber(loan.montoSolicitado - loan.montoDevuelto) }}
                </p>
              </div>
            </div>

            <!-- Status Indicator badge with alert icon -->
            <div class="flex items-center space-x-2 text-xs font-semibold text-slate-500">
              <span>Estado General:</span>
              <span
                :class="[
                  'px-2.5 py-1 rounded text-[10px] font-bold border',
                  loan.estado === 'PAGADO'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : loan.estado === 'PENDIENTE'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-rose-50 border-rose-200 text-rose-700'
                ]"
              >
                {{ loan.estado === 'PAGADO' ? 'COMPLETADO' : loan.estado }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Installments Table (Tabla de Cuotas) -->
      <div class="bg-white border border-reffinance-border rounded-2xl shadow-sm overflow-hidden">
        <div class="p-6 border-b border-reffinance-border">
          <h3 class="text-base font-extrabold text-reffinance-navy font-outfit">
            Desglose de Cuotas de Devolución
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">Calendario de vencimiento y pagos de amortización</p>
        </div>

        <div class="p-6">
          <div v-if="detailsLoading" class="flex flex-col items-center justify-center py-10 space-y-3">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-reffinance-navy"></div>
            <p class="text-xs font-bold text-slate-400">Cargando desglose de cuotas...</p>
          </div>

          <div v-else-if="loanDetailsPageData && loanDetailsPageData.content" class="space-y-4">
            <PrestamoCuotasTable
              :cuotas="loanDetailsPageData.content"
              :current-page="currentPage"
              :total-pages="loanDetailsPageData.totalPages || 1"
              :is-read-only="isReadOnly"
              @pay="openQuickRefund"
              @change-page="(p) => { currentPage = p; fetchInstallments(); }"
            />
          </div>

          <div v-else class="text-center py-12 text-slate-400 font-semibold text-sm">
            No se encontraron cuotas registradas para este préstamo.
          </div>
        </div>
      </div>

      <!-- Section 3: History of Payments and Help guidelines -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Timeline of refunds -->
        <div class="lg:col-span-2 bg-white border border-reffinance-border rounded-2xl shadow-sm p-6 space-y-6">
          <div>
            <h3 class="text-base font-extrabold text-reffinance-navy font-outfit">
              Historial de Abonos Realizados
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">Línea de tiempo de ingresos de fondos por devolución</p>
          </div>

          <!-- Timeline visuals -->
          <div class="relative pl-6 space-y-6 border-l-2 border-slate-100 ml-3">
            <!-- Simulated list based on current paid amount -->
            <div 
              v-if="loan.montoDevuelto > 0"
              class="relative"
            >
              <div class="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center">
                <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              </div>

              <div class="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div class="space-y-1">
                  <h4 class="font-extrabold text-slate-800 text-sm">
                    Reembolso Registrado (Abono Global)
                  </h4>
                  <p class="text-[10px] text-slate-400 font-bold">
                    Código de Pago: <span class="text-slate-500">PAG-LN-{{ loan.idPrestamo }}-1</span> • Fecha: {{ formatFecha(loan.fechaSolicitud) }}
                  </p>
                </div>

                <div class="text-right">
                  <span class="text-base font-black font-outfit text-emerald-600 block">
                    +${{ formatNumber(loan.montoDevuelto) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Empty Timeline -->
            <div v-else class="py-6 text-center text-slate-400 font-semibold text-xs relative -left-6">
              No se han registrado abonos para este préstamo todavía.
            </div>
          </div>
        </div>

        <!-- Help Guidelines card -->
        <div class="lg:col-span-1 bg-white border border-reffinance-border rounded-2xl shadow-sm p-6 space-y-6 flex flex-col justify-between">
          <div class="space-y-6">
            <div class="border-b border-slate-100 pb-4">
              <h3 class="text-base font-extrabold text-reffinance-navy font-outfit">
                Políticas de Préstamo
              </h3>
              <p class="text-xs text-slate-400 mt-0.5">Normas del Fondo de Caja Chica</p>
            </div>

            <div class="space-y-4 text-xs font-semibold text-slate-500 leading-normal">
              <div class="flex items-start space-x-3">
                <div class="w-1.5 h-1.5 rounded-full bg-reffinance-navy mt-1.5 shrink-0"></div>
                <p>Los préstamos son de carácter interno y se descuentan de forma automática de los honorarios o mediante abonos en efectivo/transferencia.</p>
              </div>

              <div class="flex items-start space-x-3">
                <div class="w-1.5 h-1.5 rounded-full bg-reffinance-navy mt-1.5 shrink-0"></div>
                <p>Las amortizaciones se dividen de forma equitativa en cuotas mensuales desde la fecha de aprobación.</p>
              </div>

              <div class="flex items-start space-x-3">
                <div class="w-1.5 h-1.5 rounded-full bg-reffinance-navy mt-1.5 shrink-0"></div>
                <p>Una vez liquidado completamente el saldo deudor, el registro pasa a estado <span class="text-emerald-600 font-bold">COMPLETADO</span> y queda cerrado de forma inmutable.</p>
              </div>
            </div>
          </div>

          <div class="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2 mt-6">
            <h4 class="text-[10px] uppercase font-bold text-slate-400">Información Importante</h4>
            <p class="text-xs text-slate-500 font-medium leading-relaxed">
              El cumplimiento puntual de las cuotas mantiene un índice alto de confiabilidad para futuros préstamos institucionales.
            </p>
          </div>
        </div>

      </div>
    </div>

    <!-- Sleek Overlay Payment Modal Component (Only shown when unpaid) -->
    <PrestamoAbonoModal
      :show="showPaymentModal && !isReadOnly"
      :loan="loan"
      @close="showPaymentModal = false"
      @submit="submitPayment"
    />

  </div>
</template>

<script setup>
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-vue-next";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import PrestamoCuotasTable from "./tables/PrestamoCuotasTable.vue";
import PrestamoAbonoModal from "./modals/PrestamoAbonoModal.vue";

const props = defineProps({
  idPrestamo: {
    type: String,
    required: true,
  },
});

const router = useRouter();

// Reactivos de estado
const loading = ref(true);
const loan = ref(null);
const loanDetailsPageData = ref(null);
const currentPage = ref(0); // 0-indexed para el Spring Data JPA Page
const pageSize = ref(5);
const detailsLoading = ref(false);

// Modal de pago
const showPaymentModal = ref(false);
const paymentMonto = ref(null);
const paymentFecha = ref("");

// Restricción de Solo Lectura basada en el estado del préstamo
const isReadOnly = computed(() => {
  if (!loan.value) return true;
  return loan.value.estado === "PAGADO";
});

const loadLoanDetails = async () => {
  loading.value = true;
  const rawId = String(props.idPrestamo).replace("RF-LN-", "");
  try {
    const allLoans = await api.getLoans();
    loan.value = allLoans.find((l) => String(l.idPrestamo) === rawId);
    await fetchInstallments();
  } catch (err) {
    console.error("Error al cargar detalles de préstamo:", err);
  } finally {
    loading.value = false;
  }
};

const fetchInstallments = async () => {
  if (!loan.value) return;
  detailsLoading.value = true;
  try {
    loanDetailsPageData.value = await api.getLoanDetails(
      loan.value.idPrestamo,
      currentPage.value,
      pageSize.value
    );
  } catch (err) {
    console.error("Error al obtener cuotas paginadas:", err);
  } finally {
    detailsLoading.value = false;
  }
};

onMounted(() => {
  loadLoanDetails();
});

// Porcentaje devuelto
const porcentajeDevuelto = computed(() => {
  if (!loan.value || loan.value.montoSolicitado === 0) return 0;
  return (loan.value.montoDevuelto / loan.value.montoSolicitado) * 100;
});

// Offset del círculo de progreso circular
const strokeDasharray = 2 * Math.PI * 42;
const strokeDashoffset = computed(() => {
  const percent = porcentajeDevuelto.value;
  return strokeDasharray - (percent / 100) * strokeDasharray;
});

// Paginación
const nextPage = async () => {
  if (loanDetailsPageData.value && !loanDetailsPageData.value.last) {
    currentPage.value++;
    await fetchInstallments();
  }
};

const prevPage = async () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    await fetchInstallments();
  }
};

// Modales de Pago
const openPaymentDialog = () => {
  if (isReadOnly.value) return;
  paymentMonto.value = parseFloat((loan.value.montoSolicitado - loan.value.montoDevuelto).toFixed(2));
  paymentFecha.value = new Date().toISOString().split("T")[0];
  showPaymentModal.value = true;
};

const openQuickRefund = (cuota) => {
  if (isReadOnly.value) return;
  paymentMonto.value = parseFloat((cuota.montoCuota - cuota.montoPagado).toFixed(2));
  paymentFecha.value = new Date().toISOString().split("T")[0];
  showPaymentModal.value = true;
};

const quickFillRemaining = () => {
  paymentMonto.value = parseFloat((loan.value.montoSolicitado - loan.value.montoDevuelto).toFixed(2));
};

const submitPayment = async (data) => {
  if (data) {
    if (data.monto) paymentMonto.value = data.monto;
    if (data.fecha) paymentFecha.value = data.fecha;
  }
  if (isReadOnly.value || !loan.value || !paymentMonto.value) return;
  try {
    await api.registerLoanPayment(
      loan.value.idPrestamo,
      paymentMonto.value,
      paymentFecha.value
    );
    await loadLoanDetails();
    showPaymentModal.value = false;
    paymentMonto.value = null;
    alert("Abono del préstamo registrado con éxito.");
  } catch (err) {
    console.error("Error al registrar abono de cuota:", err);
    alert("Ocurrió un error al registrar el cobro. Intente de nuevo.");
  }
};

// Navegación
const goBack = () => {
  router.push({ name: "prestamos" });
};

// Utilidades
const getInitials = (name) => {
  if (!name) return "AR";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

const formatNumber = (num) => {
  if (num === undefined || num === null) return "0.00";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatFecha = (fechaStr) => {
  if (!fechaStr) return "Sin Fecha";
  return new Date(fechaStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
</script>

<style scoped>
circle {
  transition: stroke-dashoffset 0.8s ease-in-out;
}
</style>
