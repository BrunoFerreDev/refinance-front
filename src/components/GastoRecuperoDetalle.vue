<template>
  <div class="flex-1 p-8 overflow-y-auto space-y-8 select-none bg-[#F4F6FA]">
    <!-- Breadcrumbs and Action Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div class="flex items-center space-x-2 text-xs font-bold text-slate-400">
        <router-link
          to="/caja"
          class="hover:text-reffinance-navy transition-colors"
        >
          Control de Caja
        </router-link>
        <span>&gt;</span>
        <span class="text-reffinance-navy font-extrabold"
          >Detalle de Recupero</span
        >
      </div>

      <div class="flex items-center space-x-3">
        <button
          @click="goBack"
          class="px-4 py-2.5 bg-white border border-reffinance-border rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center shadow-sm"
        >
          <ArrowLeft class="w-4 h-4 mr-1.5 text-slate-400" />
          Volver a Caja
        </button>

        <button
          @click="openAssociate"
          class="px-4 py-2.5 bg-reffinance-navy hover:bg-reffinance-navy-dark text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center"
        >
          <UserPlus class="w-4 h-4 mr-1.5" />
          Asociar Árbitro
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center py-20 space-y-4"
    >
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-reffinance-navy"
      ></div>
      <p class="text-sm font-semibold text-slate-500">
        Cargando detalles del recupero...
      </p>
    </div>

    <!-- Main Content -->
    <div v-else-if="transaction" class="space-y-8">
      <!-- Section 1: Receipts Info and Recovery Progress Overview -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Digital Invoice / Transaction Details Card -->
        <div
          class="lg:col-span-1 bg-white border border-reffinance-border rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between relative"
        >
          <!-- Receipt Header Decorator -->
          <div
            class="absolute top-0 left-0 right-0 h-1.5 bg-reffinance-navy"
          ></div>

          <div class="p-6 space-y-6 flex-1">
            <div class="flex items-center justify-between">
              <span
                class="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-[10px] font-extrabold tracking-wider uppercase"
              >
                Gasto con Recupero
              </span>
              <span class="text-xs font-bold text-slate-400">
                #TXN-{{ transaction.idTransaccion }}
              </span>
            </div>

            <!-- Whistle Custom Watermark Background Icon -->
            <div class="border-b border-slate-100 pb-5 space-y-2">
              <p class="text-xs uppercase font-extrabold text-slate-400">
                Concepto de Gasto
              </p>
              <h2
                class="text-xl font-black text-reffinance-navy font-outfit leading-snug"
              >
                {{ transaction.concepto }}
              </h2>
              <p
                class="text-slate-500 text-sm italic font-medium leading-relaxed mt-1"
              >
                "{{ transaction.descripcion }}"
              </p>
            </div>

            <!-- Metadatas list -->
            <div class="space-y-4 text-xs font-semibold text-slate-500">
              <div class="flex justify-between items-center">
                <span class="flex items-center"
                  ><Calendar class="w-4 h-4 mr-2 text-slate-400" /> Fecha del
                  Gasto</span
                >
                <span class="text-slate-800 font-extrabold">{{
                  formatFecha(transaction.fecha)
                }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="flex items-center"
                  ><DollarSign class="w-4 h-4 mr-2 text-slate-400" /> Monto
                  Neto</span
                >
                <span class="text-rose-600 font-black text-base font-outfit"
                  >${{ formatNumber(transaction.monto) }}</span
                >
              </div>
              <div class="flex justify-between items-center">
                <span class="flex items-center"
                  ><TrendingUp class="w-4 h-4 mr-2 text-slate-400" /> Estado
                  Contable</span
                >
                <span
                  class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold text-[10px]"
                >
                  LIQUIDADO
                </span>
              </div>
            </div>
          </div>

          <!-- Bottom receipt aesthetic jagged edges in CSS -->
          <div class="bg-slate-50 p-4 border-t border-slate-100 text-center">
            <p class="text-[10px] font-bold text-slate-400">
              RefFinance • Control de Caja Interno
            </p>
          </div>
        </div>

        <!-- Metrics & Circular Progress Gauge Card -->
        <div
          class="lg:col-span-2 bg-white border border-reffinance-border rounded-2xl shadow-sm p-6 flex flex-col md:flex-row items-center gap-8"
        >
          <!-- Circular Progress Meter -->
          <div
            class="relative shrink-0 flex flex-col items-center justify-center w-48 h-48"
          >
            <svg
              class="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <!-- Background Circle -->
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#E2E8F0"
                stroke-width="8"
                fill="transparent"
              />
              <!-- Progress Circle -->
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
            <div
              class="absolute inset-0 flex flex-col items-center justify-center"
            >
              <span
                class="text-3xl font-black text-reffinance-navy font-outfit leading-none"
              >
                {{ Math.round(porcentajeRecupero) }}%
              </span>
              <span
                class="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1"
              >
                Recuperado
              </span>
            </div>
          </div>

          <!-- Financial Details Cards inside Gauge container -->
          <div class="flex-1 w-full space-y-6">
            <div>
              <h3
                class="text-sm font-extrabold text-reffinance-navy font-outfit uppercase tracking-wider"
              >
                Estado General del Reembolso
              </h3>
              <p class="text-xs text-slate-400 mt-0.5">
                Resumen contable de la recuperación de fondos
              </p>
            </div>

            <!-- Financial Grids -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Asignado -->
              <div
                class="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-1"
              >
                <p class="text-[9px] uppercase font-bold text-slate-400">
                  Total Asignado a Árbitros
                </p>
                <p class="text-lg font-bold text-slate-700 font-outfit">
                  ${{ formatNumber(montoAsignadoTotal) }}
                </p>
              </div>

              <!-- Pendiente de Asignar -->
              <div
                class="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-1"
              >
                <p class="text-[9px] uppercase font-bold text-slate-400">
                  No Asignado a Árbitros
                </p>
                <p class="text-lg font-bold text-slate-500 font-outfit">
                  ${{ formatNumber(montoNoAsignado) }}
                </p>
              </div>

              <!-- Recuperado -->
              <div
                class="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl space-y-1"
              >
                <p class="text-[9px] uppercase font-bold text-emerald-600">
                  Monto Recuperado (Cobrado)
                </p>
                <p class="text-lg font-bold text-emerald-600 font-outfit">
                  ${{ formatNumber(montoRecuperadoTotal) }}
                </p>
              </div>

              <!-- Restante -->
              <div
                class="bg-amber-50/50 border border-amber-100 p-4 rounded-xl space-y-1"
              >
                <p class="text-[9px] uppercase font-bold text-amber-600">
                  Saldo Pendiente por Cobrar
                </p>
                <p class="text-lg font-bold text-amber-600 font-outfit">
                  ${{ formatNumber(montoPendienteTotal) }}
                </p>
              </div>
            </div>

            <!-- Overall linear gauge for Total Expense Recovery -->
            <div class="space-y-1.5">
              <div
                class="flex items-center justify-between text-[10px] font-bold text-slate-400"
              >
                <span>PORCENTAJE DEL GASTO GLOBAL RECUPERADO</span>
                <span class="text-reffinance-navy"
                  >{{
                    Math.round(
                      (montoRecuperadoTotal / transaction.monto) * 100,
                    )
                  }}%</span
                >
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  class="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                  :style="{
                    width: `${Math.min(100, Math.round((montoRecuperadoTotal / transaction.monto) * 100))}%`,
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Associated Referees Table -->
      <div
        class="bg-white border border-reffinance-border rounded-2xl shadow-sm overflow-hidden"
      >
        <div
          class="p-6 border-b border-reffinance-border flex items-center justify-between"
        >
          <div>
            <h3
              class="text-base font-extrabold text-reffinance-navy font-outfit"
            >
              Árbitros Asociados al Recupero
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">
              Gestione las asignaciones individuales y registre cobros
            </p>
          </div>

          <button
            @click="openAssociate"
            class="px-3 py-1.5 bg-slate-50 border border-reffinance-border hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center"
          >
            <Plus class="w-3.5 h-3.5 mr-1" />
            Asociar Árbitro
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr
                class="bg-slate-50 border-b border-reffinance-border text-[10px] uppercase font-bold text-slate-400 tracking-wider"
              >
                <th class="py-4 px-6">ID</th>
                <th class="py-4 px-6">Árbitro</th>
                <th class="py-4 px-6">Monto Asignado</th>
                <th class="py-4 px-6">Monto Recuperado</th>
                <th class="py-4 px-6">Progreso</th>
                <th class="py-4 px-6">Estado</th>
                <th class="py-4 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
              <tr
                v-for="(assoc, index) in sortedAsociaciones"
                :key="assoc.idAsociacion"
                class="hover:bg-slate-50/50 transition-colors"
              >
                <td class="py-4 px-6">{{ index + 1 }}</td>
                <!-- Avatar & Name -->
                <td class="py-4 px-6">
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-reffinance-navy shrink-0"
                    >
                      {{ assoc.arbitro.nombre.charAt(0)
                      }}{{ assoc.arbitro.apellido.charAt(0) }}
                    </div>
                    <div>
                      <h4 class="font-extrabold text-slate-800 leading-tight">
                        {{ assoc.arbitro.nombre }} {{ assoc.arbitro.apellido }}
                      </h4>
                      <p class="text-[10px] text-slate-400 font-bold mt-0.5">
                        Asoc:
                        {{
                          formatFecha(
                            assoc.fechaAsociacion || transaction.fecha,
                          )
                        }}
                      </p>
                    </div>
                  </div>
                </td>

                <!-- Assigned Amount -->
                <td class="py-4 px-6 font-bold font-outfit text-slate-800">
                  ${{ formatNumber(assoc.montoAsignado) }}
                </td>

                <!-- Recovered Amount -->
                <td class="py-4 px-6 font-bold font-outfit text-emerald-600">
                  ${{ formatNumber(assoc.montoRecuperado) }}
                </td>

                <!-- Individual Progress Bar -->
                <td class="py-4 px-6">
                  <div class="flex items-center space-x-2.5 w-32">
                    <div
                      class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden"
                    >
                      <div
                        class="bg-emerald-500 h-full rounded-full transition-all"
                        :style="{
                          width: `${Math.round((assoc.montoRecuperado / assoc.montoAsignado) * 100)}%`,
                        }"
                      ></div>
                    </div>
                    <span class="text-[10px] font-bold text-slate-500">
                      {{
                        Math.round(
                          (assoc.montoRecuperado / assoc.montoAsignado) * 100,
                        )
                      }}%
                    </span>
                  </div>
                </td>

                <!-- Payment Badge Status -->
                <td class="py-4 px-6">
                  <span
                    :class="[
                      'px-2 py-0.5 rounded text-[10px] font-bold border',
                      assoc.estado === 'PAGADO'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : assoc.estado === 'PARCIAL'
                          ? 'bg-sky-50 border-sky-200 text-sky-700'
                          : 'bg-rose-50 border-rose-200 text-rose-700',
                    ]"
                  >
                    {{ assoc.estado }}
                  </span>
                </td>

                <!-- Row Actions -->
                <td class="py-4 px-6 text-center">
                  <div class="flex items-center justify-center space-x-1.5">
                    <button
                      v-if="assoc.estado !== 'PAGADO'"
                      @click="openRefundDialog(assoc)"
                      title="Registrar Reembolso"
                      class="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 transition-colors flex items-center whitespace-nowrap"
                    >
                      <DollarSign class="w-3.5 h-3.5 mr-0.5 shrink-0" />
                      Cobrar
                    </button>
                    <button
                      @click="confirmDesasociar(assoc)"
                      title="Desasociar Árbitro"
                      class="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 rounded-lg border border-rose-200 transition-colors"
                    >
                      <Trash2 class="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="sortedAsociaciones.length === 0">
                <td
                  colspan="7"
                  class="text-center py-12 text-slate-400 font-semibold"
                >
                  No hay árbitros asociados a este recupero. Asocia uno para
                  comenzar el cobro.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section 3: Recovery Payments Timeline / Timeline & Notes -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Timeline of Payments -->
        <div
          class="lg:col-span-2 bg-white border border-reffinance-border rounded-2xl shadow-sm p-6 space-y-6"
        >
          <div>
            <h3
              class="text-base font-extrabold text-reffinance-navy font-outfit"
            >
              Historial de Reembolsos Realizados
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">
              Línea de tiempo de ingresos de fondos por recupero
            </p>
          </div>

          <!-- Timeline visual -->
          <div class="relative pl-6 space-y-6 border-l-2 border-slate-100 ml-3">
            <div
              v-for="pago in transaction.historialPagos"
              :key="pago.idPago"
              class="relative"
            >
              <!-- Indicator circle -->
              <div
                class="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center"
              >
                <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              </div>

              <div
                class="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div class="space-y-1">
                  <div class="flex items-center space-x-2">
                    <h4 class="font-extrabold text-slate-800 text-sm">
                      Reembolso Recibido de {{ pago.arbitroNombre }}
                    </h4>
                    <span
                      class="text-[10px] text-slate-400 font-bold bg-slate-200 px-1.5 py-0.5 rounded"
                    >
                      {{ pago.metodo || "Efectivo" }}
                    </span>
                  </div>
                  <p class="text-[10px] text-slate-400 font-bold">
                    Código de Pago:
                    <span class="text-slate-500">{{ pago.idPago }}</span> •
                    Fecha: {{ formatFecha(pago.fecha) }}
                  </p>
                </div>

                <div class="text-right">
                  <span
                    class="text-base font-black font-outfit text-emerald-600 block"
                  >
                    +${{ formatNumber(pago.monto) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Empty History State -->
            <div
              v-if="
                !transaction.historialPagos ||
                transaction.historialPagos.length === 0
              "
              class="py-6 text-center text-slate-400 font-semibold text-xs relative -left-6"
            >
              No se han registrado pagos para este recupero todavía.
            </div>
          </div>
        </div>

        <!-- Notes and Recovery Help Guidelines -->
        <div
          class="lg:col-span-1 bg-white border border-reffinance-border rounded-2xl shadow-sm p-6 space-y-6 flex flex-col justify-between"
        >
          <div class="space-y-6">
            <div class="border-b border-slate-100 pb-4">
              <h3
                class="text-base font-extrabold text-reffinance-navy font-outfit"
              >
                Pautas de Recuperación
              </h3>
              <p class="text-xs text-slate-400 mt-0.5">
                Instrucciones y regulaciones del grupo
              </p>
            </div>

            <div
              class="space-y-4 text-xs font-semibold text-slate-500 leading-normal"
            >
              <div class="flex items-start space-x-3">
                <div
                  class="w-1.5 h-1.5 rounded-full bg-reffinance-navy mt-1.5 shrink-0"
                ></div>
                <p>
                  Las asociaciones permiten dividir los gastos masivos comprados
                  por el grupo (como silbatos, jerseys, etc.) entre los árbitros
                  correspondientes.
                </p>
              </div>

              <div class="flex items-start space-x-3">
                <div
                  class="w-1.5 h-1.5 rounded-full bg-reffinance-navy mt-1.5 shrink-0"
                ></div>
                <p>
                  El sistema calcula el porcentaje de recuperación
                  automáticamente basado en las cuotas devueltas por cada
                  miembro.
                </p>
              </div>

              <div class="flex items-start space-x-3">
                <div
                  class="w-1.5 h-1.5 rounded-full bg-reffinance-navy mt-1.5 shrink-0"
                ></div>
                <p>
                  Si un árbitro devuelve fondos, use el botón
                  <span class="text-emerald-600 font-bold">"Cobrar"</span> para
                  registrar el pago de forma ágil y precisa.
                </p>
              </div>
            </div>
          </div>

          <div
            class="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2 mt-6"
          >
            <h4 class="text-[10px] uppercase font-bold text-slate-400">
              Información del Libro Mayor
            </h4>
            <p class="text-xs text-slate-500 font-medium leading-relaxed">
              Las transacciones de recupero ingresan directamente a la caja
              chica como abonos parciales, reduciendo el gasto total reportado
              en el balance global.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Refund Register Modal Dialog (Sleek Internal Overlay) -->
    <div
      v-if="showRefundModal"
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-reffinance-border"
      >
        <div
          class="bg-reffinance-navy p-5 text-white flex items-center justify-between"
        >
          <div>
            <h3 class="text-base font-extrabold font-outfit">
              Registrar Pago de Recupero
            </h3>
            <p class="text-[10px] text-slate-300">
              Registre un ingreso de reembolso para el árbitro
            </p>
          </div>
          <button
            @click="showRefundModal = false"
            class="p-1 text-white/70 hover:text-white rounded-full hover:bg-white/10"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <div
          class="p-5 bg-slate-50 border-b border-slate-100 text-xs text-slate-500 space-y-1"
        >
          <p>
            <span class="font-bold text-slate-700">Árbitro:</span>
            {{ selectedAssoc?.arbitro.nombre }}
            {{ selectedAssoc?.arbitro.apellido }}
          </p>
          <p>
            <span class="font-bold text-slate-700">Monto Asignado:</span> ${{
              formatNumber(selectedAssoc?.montoAsignado)
            }}
          </p>
          <p>
            <span class="font-bold text-slate-700"
              >Monto Cobrado Previamente:</span
            >
            ${{
              formatNumber(
                selectedAssoc?.montoRecupered || selectedAssoc?.montoRecuperado,
              )
            }}
          </p>
          <p>
            <span class="font-bold text-slate-700"
              >Monto Pendiente Actual:</span
            >
            ${{
              formatNumber(
                selectedAssoc?.montoAsignado -
                  (selectedAssoc?.montoRecupered ||
                    selectedAssoc?.montoRecuperado),
              )
            }}
          </p>
        </div>

        <form @submit.prevent="submitRefund" class="p-5 space-y-4">
          <div class="space-y-1.5">
            <label
              class="text-[10px] font-bold text-slate-400 uppercase tracking-wider"
            >
              Monto a Cobrar ($)
            </label>
            <input
              type="number"
              step="0.01"
              v-model.number="refundAmount"
              required
              :max="maxRefundAmount"
              min="0.01"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
            />

            <!-- Quick Fill Button to Pay Remaining amount exactly -->
            <button
              type="button"
              @click="quickFillRemaining"
              class="text-[10px] text-reffinance-navy font-bold hover:underline block text-left"
            >
              Cobrar el saldo restante total (${{
                formatNumber(maxRefundAmount)
              }})
            </button>
          </div>

          <div
            class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3"
          >
            <button
              type="button"
              @click="showRefundModal = false"
              class="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-reffinance-navy hover:bg-reffinance-navy-dark text-white rounded-lg text-xs font-bold shadow-md transition-colors"
            >
              Registrar Cobro
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Reusing the existing AsociarArbitroModal modularly -->
    <AsociarArbitroModal
      :show="showAssociateModal"
      :referees="referees"
      :tx-data="assocTxData"
      @close="showAssociateModal = false"
      @submit="submitAssociate"
    />
  </div>
</template>

<script setup>
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  TrendingUp,
  UserPlus,
  Trash2,
  Plus,
  X,
} from "lucide-vue-next";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import AsociarArbitroModal from "./AsociarArbitroModal.vue";

const props = defineProps({
  idTransaccion: {
    type: String,
    required: true,
  },
});

const router = useRouter();

// Reactivos
const loading = ref(true);
const transaction = ref(null);
const referees = ref([]);
const showAssociateModal = ref(false);

// Reactivos para reembolso rápido
const showRefundModal = ref(false);
const selectedAssoc = ref(null);
const refundAmount = ref(null);

const loadGastoDetails = async () => {
  loading.value = true;
  try {
    transaction.value = await api.getGastoConRecupero(props.idTransaccion);
    referees.value = await api.getReferees();
  } catch (err) {
    console.error("Error al cargar detalles de gasto con recupero:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadGastoDetails();
});

// Metadatos calculados de forma segura
const montoAsignadoTotal = computed(() => {
  if (!transaction.value || !transaction.value.asociaciones) return 0;
  return transaction.value.asociaciones.reduce(
    (sum, item) => sum + parseFloat(item.montoAsignado || 0),
    0,
  );
});

const montoRecuperadoTotal = computed(() => {
  if (!transaction.value || !transaction.value.asociaciones) return 0;
  return transaction.value.asociaciones.reduce(
    (sum, item) => sum + parseFloat(item.montoRecuperado || 0),
    0,
  );
});

const montoPendienteTotal = computed(() => {
  return Math.max(0, montoAsignadoTotal.value - montoRecuperadoTotal.value);
});

const montoNoAsignado = computed(() => {
  if (!transaction.value) return 0;
  return Math.max(0, transaction.value.monto - montoAsignadoTotal.value);
});

const porcentajeRecupero = computed(() => {
  if (montoAsignadoTotal.value === 0) return 0;
  return (montoRecuperadoTotal.value / montoAsignadoTotal.value) * 100;
});

const sortedAsociaciones = computed(() => {
  if (!transaction.value || !transaction.value.asociaciones) return [];
  return [...transaction.value.asociaciones].sort((a, b) => {
    const order = { PENDIENTE: 1, PARCIAL: 2, PAGADO: 3 };
    const orderA = order[a.estado] || 99;
    const orderB = order[b.estado] || 99;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    const nameA = `${a.arbitro.nombre} ${a.arbitro.apellido}`.toLowerCase();
    const nameB = `${b.arbitro.nombre} ${b.arbitro.apellido}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });
});

// Circular Indicator Offset Mathematics
const strokeDasharray = 2 * Math.PI * 42; // Radius is 42
const strokeDashoffset = computed(() => {
  const percent = porcentajeRecupero.value;
  return strokeDasharray - (percent / 100) * strokeDasharray;
});

// Reusando el AsociarArbitroModal
const assocTxData = computed(() => {
  if (!transaction.value) return null;
  return {
    idTransaccion: transaction.value.idTransaccion,
    descripcion: transaction.value.descripcion,
    monto: transaction.value.monto,
  };
});

const openAssociate = () => {
  showAssociateModal.value = true;
};

const submitAssociate = async ({ idArbitro, montoAsignado }) => {
  try {
    await api.asociarGastoArbitro(
      transaction.value.idTransaccion,
      idArbitro,
      montoAsignado,
    );
    await loadGastoDetails();
    showAssociateModal.value = false;
    alert("Árbitro asociado exitosamente al recupero.");
  } catch (err) {
    console.error("Error al asociar árbitro en detalle:", err);
    alert("No se pudo asociar el árbitro al gasto. Intente nuevamente.");
  }
};

// Acciones de Reembolso rápido
const openRefundDialog = (assoc) => {
  selectedAssoc.value = assoc;
  // Guardar monto recuperado de forma segura
  assoc.montoRecupered = assoc.montoRecuperado;

  // Rellenar con saldo restante por defecto
  refundAmount.value = parseFloat(
    (assoc.montoAsignado - assoc.montoRecuperado).toFixed(2),
  );
  showRefundModal.value = true;
};

const maxRefundAmount = computed(() => {
  if (!selectedAssoc.value) return 0;
  const current = selectedAssoc.value;
  return parseFloat(
    (current.montoAsignado - current.montoRecuperado).toFixed(2),
  );
});

const quickFillRemaining = () => {
  refundAmount.value = maxRefundAmount.value;
};

const submitRefund = async () => {
  if (!selectedAssoc.value || !refundAmount.value) return;
  try {
    await api.registrarPagoRecupero(
      transaction.value.idTransaccion,
      selectedAssoc.value.arbitro.idArbitro,
      refundAmount.value,
    );
    await loadGastoDetails();
    showRefundModal.value = false;
    selectedAssoc.value = null;
    refundAmount.value = null;
    alert("Reembolso de recupero registrado exitosamente.");
  } catch (err) {
    console.error("Error al registrar pago de recupero:", err);
    alert("No se pudo registrar el reembolso. Intente de nuevo.");
  }
};

// Desasociar Árbitro
const confirmDesasociar = async (assoc) => {
  const confirmed = confirm(
    `¿Estás seguro de que deseas desasociar a ${assoc.arbitro.nombre} ${assoc.arbitro.apellido} de este recupero?\nSe perderán los montos asociados.`,
  );
  if (!confirmed) return;

  try {
    await api.desasociarArbitroGasto(
      transaction.value.idTransaccion,
      assoc.arbitro.idArbitro,
    );
    await loadGastoDetails();
    alert("Árbitro desasociado del gasto correctamente.");
  } catch (err) {
    console.error("Error al desasociar árbitro:", err);
    alert("No se pudo desasociar al árbitro del gasto.");
  }
};

// Navegación
const goBack = () => {
  router.push({ name: "caja" });
};

// Utilidades de formato
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
/* Transición suave para barra circular SVG */
circle {
  transition: stroke-dashoffset 0.8s ease-in-out;
}
</style>
