<template>
  <div
    class="flex-1 flex flex-col md:flex-row h-full overflow-hidden select-none"
  >
    <!-- LEFT SIDE PANEL: Referees Directory List -->
    <div
      :class="['w-full md:w-80 bg-white border-r border-reffinance-border flex flex-col shrink-0', selectedReferee ? 'hidden md:flex' : 'flex']"
    >
      <!-- Search Input Info inside List -->
      <div class="p-4 border-b border-reffinance-border bg-slate-50/50">
        <h2 class="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Directorio de Árbitros
        </h2>
        <p class="text-[10px] text-slate-400 font-semibold mt-0.5">
          {{ filteredReferees.length }} miembros encontrados
        </p>
      </div>

      <!-- Referees List Grid -->
      <div class="flex-1 overflow-y-auto divide-y divide-slate-100">
        <button
          v-for="ref in filteredReferees"
          :key="ref.id"
          @click="selectReferee(ref)"
          :class="[
            'w-full text-left p-4 flex items-center space-x-3 transition-colors',
            selectedReferee && selectedReferee.id === ref.id
              ? 'bg-slate-50 border-r-4 border-reffinance-navy'
              : 'hover:bg-slate-50/50',
          ]"
        >
          <!-- <img
            :src="ref.avatarUrl || 'https://via.placeholder.com/150'"
            :alt="ref.nombre"
            /> -->
          <img
            src="https://0.gravatar.com/avatar/84059b07d4be67b806386c0aad8070a23f18836bbaae342275dc0a83414c32ee"
            alt="User avatar"
            class="w-10 h-10 rounded-full object-cover border border-slate-200"
          />
          <div class="flex-1 min-w-0">
            <h4
              class="font-extrabold text-slate-800 text-sm truncate leading-tight"
            >
              {{ ref.nombre }}
            </h4>
            <p class="text-[10px] font-bold text-slate-400 truncate mt-0.5">
              {{ ref.clasificacion }}
            </p>
          </div>
          <ChevronRight class="w-4 h-4 text-slate-300" />
        </button>
        <div
          v-if="filteredReferees.length === 0"
          class="p-8 text-center text-xs font-semibold text-slate-400"
        >
          No se encontraron árbitros.
        </div>
      </div>
    </div>

    <!-- RIGHT SIDE PANEL: Detailed Profile View (Basado en screen 3) -->
    <div
      v-if="selectedReferee"
      :class="['flex-1 p-4 sm:p-8 overflow-y-auto space-y-8 bg-slate-50/50', selectedReferee ? 'block' : 'hidden md:block']"
    >
      <!-- Top Actions and Breadcrumbs -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div
          class="flex items-center space-x-2 text-xs font-bold text-slate-400"
        >
          <!-- Back button on mobile -->
          <button 
            @click="selectedReferee = null"
            class="p-1 hover:bg-slate-200 text-slate-500 rounded-lg md:hidden mr-1 shrink-0"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>
          
          <span
            class="hover:text-slate-600 cursor-pointer"
            @click="selectedReferee = null"
            >Árbitros</span
          >
          <span>&gt;</span>
          <span class="text-reffinance-navy font-extrabold"
            >Detalle del Perfil</span
          >
        </div>
        <div class="flex items-center space-x-3 flex-wrap gap-y-2">
          <button
            @click="printReport"
            class="px-4 py-2 bg-white border border-reffinance-border rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center shadow-sm whitespace-nowrap"
          >
            <Printer class="w-4 h-4 mr-1.5 text-slate-400 shrink-0" />
            Imprimir Informe
          </button>
          <button
            @click="editProfile"
            class="px-4 py-2 bg-reffinance-navy hover:bg-reffinance-navy-dark text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center whitespace-nowrap"
          >
            <Edit class="w-4 h-4 mr-1.5 shrink-0" />
            Editar Perfil
          </button>
        </div>
      </div>

      <!-- Profile Header Hero Card (Basado en screen 3) -->
      <div
        class="bg-white border border-reffinance-border rounded-2xl shadow-sm p-6 flex flex-col md:flex-row items-center gap-6"
      >
        <img
          src="https://0.gravatar.com/avatar/84059b07d4be67b806386c0aad8070a23f18836bbaae342275dc0a83414c32ee"
          class="w-24 h-24 rounded-xl object-cover border border-slate-200 shadow-sm"
        />
        <!-- :src="selectedReferee.avatarUrl"
          :alt="selectedReferee.nombre" -->

        <div class="flex-1 space-y-4 text-center md:text-left">
          <div class="space-y-1">
            <div class="flex flex-col md:flex-row md:items-center gap-2">
              <h2
                class="text-2xl font-black text-reffinance-navy font-outfit leading-none"
              >
                {{ selectedReferee.nombre }}
              </h2>
              <span
                class="inline-block self-center px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-[10px] font-extrabold"
              >
                MIEMBRO ACTIVO
              </span>
            </div>
            <p class="text-xs text-slate-400 font-bold">
              ID de Asociación:
              <span class="font-extrabold text-slate-600">{{
                selectedReferee.id
              }}</span>
            </p>
          </div>

          <!-- Metadata grids inside header -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
            <div
              class="flex items-center space-x-3 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl"
            >
              <Shield class="w-5 h-5 text-reffinance-navy shrink-0" />
              <div>
                <p class="text-[9px] uppercase font-bold text-slate-400">
                  Clasificación
                </p>
                <p class="text-xs font-bold text-slate-700 mt-0.5">
                  {{ selectedReferee.clasificacion }}
                </p>
              </div>
            </div>
            <div
              class="flex items-center space-x-3 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl"
            >
              <Calendar class="w-5 h-5 text-reffinance-navy shrink-0" />
              <div>
                <p class="text-[9px] uppercase font-bold text-slate-400">
                  Miembro Desde
                </p>
                <p class="text-xs font-bold text-slate-700 mt-0.5">
                  {{ selectedReferee.miembroDesde }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Metrics Row (Basado en screen 3) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Total Prestado -->
        <div
          class="bg-white border border-reffinance-border p-6 rounded-2xl shadow-sm space-y-3"
        >
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Prestado a la Fecha
          </h3>
          <div class="space-y-1">
            <p class="text-3xl font-extrabold text-reffinance-navy font-outfit">
              ${{ formatNumber(selectedReferee.totalPrestado) }}
            </p>
            <p class="text-emerald-600 text-xs font-semibold">
              ✓
              {{
                selectedReferee.historialPrestamos?.filter(
                  (l) => l.estado === "PAGADO TOTAL",
                ).length || 0
              }}
              préstamos completados con éxito
            </p>
          </div>
        </div>

        <!-- Saldo Pendiente -->
        <div
          class="bg-white border border-reffinance-border p-6 rounded-2xl shadow-sm space-y-3"
        >
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Saldo Pendiente
          </h3>
          <div class="space-y-1">
            <p class="text-3xl font-extrabold text-rose-600 font-outfit">
              ${{ formatNumber(selectedReferee.saldoPendiente) }}
            </p>
            <p class="text-slate-400 text-xs font-semibold">
              Próximo pago:
              {{
                selectedReferee.saldoPendiente > 0
                  ? "28 oct. 2023"
                  : "Sin pagos pendientes"
              }}
            </p>
          </div>
        </div>

        <!-- Índice de Confiabilidad -->
        <div
          class="bg-white border border-reffinance-border p-6 rounded-2xl shadow-sm space-y-4"
        >
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Índice de Confiabilidad
          </h3>
          <div class="space-y-2">
            <div class="flex items-end justify-between">
              <span
                class="text-4xl font-extrabold text-slate-800 leading-none font-outfit"
                >{{ selectedReferee.indiceConfiabilidad }}</span
              >
              <span
                class="text-xs font-bold text-emerald-600 flex items-center bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100"
              >
                <Star class="w-3 h-3 mr-1 fill-emerald-600" />
                Excelente (Top 5%)
              </span>
            </div>
            <!-- Progress Bar -->
            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-emerald-500 rounded-full transition-all duration-700"
                :style="{
                  width: `${(selectedReferee.indiceConfiabilidad / 1000) * 100}%`,
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Columns: Loan Records and Contact/Administrative Info -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Side: Interactive tabs for Loan History / Payment Calendar -->
        <div
          class="bg-white border border-reffinance-border rounded-2xl shadow-sm overflow-hidden lg:col-span-2"
        >
          <!-- Tabs Selection Header -->
          <div
            class="border-b border-reffinance-border bg-slate-50 flex items-center"
          >
            <button
              @click="activeSubTab = 'historial'"
              :class="[
                'px-6 py-4 text-xs font-bold border-b-2 transition-all',
                activeSubTab === 'historial'
                  ? 'border-reffinance-navy text-reffinance-navy bg-white font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800',
              ]"
            >
              Historial de Préstamos
            </button>
            <button
              @click="activeSubTab = 'calendario'"
              :class="[
                'px-6 py-4 text-xs font-bold border-b-2 transition-all',
                activeSubTab === 'calendario'
                  ? 'border-reffinance-navy text-reffinance-navy bg-white font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800',
              ]"
            >
              Calendario de Pagos
            </button>
          </div>

          <!-- Tab Content 1: Loan History Table -->
          <div v-show="activeSubTab === 'historial'" class="flex flex-col">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr
                    class="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider"
                  >
                    <th class="py-3 px-6">ID Préstamo</th>
                    <th class="py-3 px-6">Fecha Solicitud</th>
                    <th class="py-3 px-6">Monto</th>
                    <th class="py-3 px-6 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody
                  class="divide-y divide-slate-100 text-xs font-medium text-slate-700"
                >
                  <tr
                    v-for="loan in paginatedHistorialPrestamos"
                    :key="loan.id"
                    class="hover:bg-slate-50/50 transition-colors"
                  >
                    <td class="py-3.5 px-6 font-bold text-reffinance-navy">
                      {{ loan.id }}
                    </td>
                    <td class="py-3.5 px-6">{{ loan.fechaSolicitud }}</td>
                    <td
                      class="py-3.5 px-6 font-bold font-outfit text-slate-800 text-sm"
                    >
                      ${{ formatNumber(loan.monto) }}
                    </td>
                    <td class="py-3.5 px-6 text-center">
                      <span
                        :class="[
                          'px-2 py-0.5 rounded-full text-[9px] font-bold border',
                          loan.estado === 'VIGENTE'
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 animate-pulse'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-700',
                        ]"
                      >
                        {{ loan.estado }}
                      </span>
                    </td>
                  </tr>
                  <tr v-if="!selectedReferee.historialPrestamos?.length">
                    <td
                      colspan="4"
                      class="text-center py-6 text-slate-400 font-semibold"
                    >
                      Sin préstamos registrados.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- Pagination Controls for Loans -->
            <div
              v-if="selectedReferee.historialPrestamos?.length"
              class="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500"
            >
              <p>
                Mostrando {{ paginatedHistorialPrestamos.length }} de
                {{ selectedReferee.historialPrestamos.length }} préstamos
              </p>
              <div class="flex items-center space-x-1.5 font-bold">
                <button
                  @click="prevLoansPage"
                  :disabled="currentLoansPage === 1"
                  class="p-1 border border-reffinance-border rounded bg-white text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-white select-none cursor-pointer"
                >
                  <ChevronLeft class="w-3.5 h-3.5" />
                </button>
                <button
                  v-for="page in totalLoansPages"
                  :key="page"
                  @click="currentLoansPage = page"
                  :class="[
                    'px-2 py-0.5 rounded border transition-all select-none cursor-pointer',
                    currentLoansPage === page
                      ? 'bg-reffinance-navy border-reffinance-navy text-white'
                      : 'bg-white border-reffinance-border text-slate-600 hover:bg-slate-50',
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="nextLoansPage"
                  :disabled="currentLoansPage === totalLoansPages"
                  class="p-1 border border-reffinance-border rounded bg-white text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-white select-none cursor-pointer"
                >
                  <ChevronRight class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <!-- Tab Content 2: Payment Calendar -->
          <div v-show="activeSubTab === 'calendario'" class="flex flex-col">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr
                    class="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider"
                  >
                    <th class="py-3 px-6">Fecha Vencimiento</th>
                    <th class="py-3 px-6">Monto Cuota</th>
                    <th class="py-3 px-6 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody
                  class="divide-y divide-slate-100 text-xs font-medium text-slate-700"
                >
                  <tr
                    v-for="cuota in paginatedCalendarioPagos"
                    :key="cuota.fecha"
                    class="hover:bg-slate-50/50 transition-colors"
                  >
                    <td class="py-3.5 px-6 font-semibold">{{ cuota.fecha }}</td>
                    <td
                      class="py-3.5 px-6 font-bold font-outfit text-slate-800 text-sm"
                    >
                      ${{ formatNumber(cuota.monto) }}
                    </td>
                    <td class="py-3.5 px-6 text-center">
                      <span
                        :class="[
                          'px-2 py-0.5 rounded-full text-[9px] font-bold border',
                          cuota.estado === 'VENCIDO'
                            ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
                            : 'bg-indigo-50 border-indigo-200 text-indigo-700',
                        ]"
                      >
                        {{ cuota.estado }}
                      </span>
                    </td>
                  </tr>
                  <tr v-if="!selectedReferee.calendarioPagos?.length">
                    <td
                      colspan="3"
                      class="text-center py-6 text-slate-400 font-semibold"
                    >
                      Sin pagos programados en este momento.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- Pagination Controls for Payments -->
            <div
              v-if="selectedReferee.calendarioPagos?.length"
              class="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500"
            >
              <p>
                Mostrando {{ paginatedCalendarioPagos.length }} de
                {{ selectedReferee.calendarioPagos.length }} cuotas
              </p>
              <div class="flex items-center space-x-1.5 font-bold">
                <button
                  @click="prevPaymentsPage"
                  :disabled="currentPaymentsPage === 1"
                  class="p-1 border border-reffinance-border rounded bg-white text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-white select-none cursor-pointer"
                >
                  <ChevronLeft class="w-3.5 h-3.5" />
                </button>
                <button
                  v-for="page in totalPaymentsPages"
                  :key="page"
                  @click="currentPaymentsPage = page"
                  :class="[
                    'px-2 py-0.5 rounded border transition-all select-none cursor-pointer',
                    currentPaymentsPage === page
                      ? 'bg-reffinance-navy border-reffinance-navy text-white'
                      : 'bg-white border-reffinance-border text-slate-600 hover:bg-slate-50',
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="nextPaymentsPage"
                  :disabled="currentPaymentsPage === totalPaymentsPages"
                  class="p-1 border border-reffinance-border rounded bg-white text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-white select-none cursor-pointer"
                >
                  <ChevronRight class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: Contact Information & Administrative Notes -->
        <div class="space-y-8 lg:col-span-1">
          <!-- Contact Info Box -->
          <div
            class="bg-white border border-reffinance-border rounded-2xl p-6 shadow-sm space-y-4"
          >
            <h3
              class="text-sm font-extrabold text-reffinance-navy font-outfit border-b border-slate-100 pb-2"
            >
              Información de Contacto
            </h3>
            <div class="space-y-4 text-xs font-semibold text-slate-600">
              <div class="space-y-1">
                <p
                  class="text-[9px] uppercase font-bold text-slate-400 tracking-wider"
                >
                  Correo Electrónico
                </p>
                <p class="text-slate-800 font-bold truncate">
                  {{ selectedReferee.email }}
                </p>
              </div>
              <div class="space-y-1">
                <p
                  class="text-[9px] uppercase font-bold text-slate-400 tracking-wider"
                >
                  Número de Teléfono
                </p>
                <p class="text-slate-800 font-bold">
                  {{ selectedReferee.telefono }}
                </p>
              </div>
              <div class="space-y-1">
                <p
                  class="text-[9px] uppercase font-bold text-slate-400 tracking-wider"
                >
                  Región Principal
                </p>
                <p class="text-slate-800 font-bold">
                  {{ selectedReferee.region }}
                </p>
              </div>
            </div>
          </div>

          <!-- Administrative Notes Box -->
          <div
            class="bg-white border border-reffinance-border rounded-2xl p-6 shadow-sm space-y-4"
          >
            <div
              class="flex items-center justify-between border-b border-slate-100 pb-2"
            >
              <h3
                class="text-sm font-extrabold text-reffinance-navy font-outfit"
              >
                Notas Administrativas
              </h3>
              <button
                @click="showNoteEditor = !showNoteEditor"
                class="text-[10px] font-extrabold text-reffinance-navy hover:text-reffinance-navy-dark uppercase tracking-wider flex items-center hover:underline"
              >
                <Plus class="w-3.5 h-3.5 mr-0.5" />
                Añadir Nueva
              </button>
            </div>

            <!-- Notes List Timeline -->
            <div class="space-y-3.5 max-h-80 overflow-y-auto pr-1">
              <!-- Note inline editor -->
              <div
                v-show="showNoteEditor"
                class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5 transition-smooth"
              >
                <textarea
                  v-model="newNoteContent"
                  rows="3"
                  placeholder="Escribe una nota interna para la auditoría..."
                  class="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-reffinance-navy"
                ></textarea>
                <div
                  class="flex items-center justify-end space-x-2 text-[10px] font-bold"
                >
                  <button
                    @click="showNoteEditor = false"
                    type="button"
                    class="px-2.5 py-1 text-slate-500 hover:text-slate-800 border border-transparent rounded hover:bg-slate-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    @click="submitNote"
                    type="button"
                    class="px-3 py-1 bg-reffinance-navy hover:bg-reffinance-navy-dark text-white rounded shadow transition-colors"
                  >
                    Guardar Nota
                  </button>
                </div>
              </div>

              <!-- Note list items -->
              <div
                v-for="note in selectedReferee.notas"
                :key="note.contenido"
                class="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5"
              >
                <div
                  class="flex items-center justify-between text-[10px] font-bold text-slate-400"
                >
                  <span class="text-reffinance-navy font-extrabold">{{
                    note.admin
                  }}</span>
                  <span>{{ note.fecha }}</span>
                </div>
                <p
                  class="text-[11px] text-slate-600 font-medium leading-relaxed"
                >
                  {{ note.contenido }}
                </p>
              </div>

              <div
                v-if="!selectedReferee.notas?.length && !showNoteEditor"
                class="text-center py-6 text-slate-400 font-semibold text-xs"
              >
                No hay notas registradas.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty Detail state -->
    <div
      v-else
      class="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/50 text-slate-400 select-none"
    >
      <Users class="w-16 h-16 text-slate-300 stroke-1 mb-4" />
      <h3 class="text-lg font-bold font-outfit text-slate-500">
        Seleccione un Árbitro
      </h3>
      <p
        class="text-xs text-slate-400 mt-1 max-w-xs text-center leading-normal"
      >
        Navegue por el directorio del panel de la izquierda para examinar
        balances, notas, contactos e historiales financieros amortizables.
      </p>
    </div>
  </div>
</template>

<script setup>
import {
  ChevronRight,
  ChevronLeft,
  Printer,
  Edit,
  Shield,
  Calendar,
  Star,
  Plus,
  X,
} from "lucide-vue-next";
import { ref, onMounted, computed, watch } from "vue";
import api from "../services/api";

const props = defineProps({
  searchQuery: {
    type: String,
    default: "",
  },
});

// Reactivos
const referees = ref([]);
const selectedReferee = ref(null);
const activeSubTab = ref("historial");

// Editor de notas
const showNoteEditor = ref(false);
const newNoteContent = ref("");

// Reactivos de paginación
const currentLoansPage = ref(1);
const currentPaymentsPage = ref(1);
const itemsPerPage = 5;

// Resetear páginas de las tablas cuando cambie el árbitro seleccionado
watch(selectedReferee, () => {
  currentLoansPage.value = 1;
  currentPaymentsPage.value = 1;
});

// Propiedades computadas para paginación de Historial de Préstamos
const totalLoansPages = computed(() => {
  const list = selectedReferee.value?.historialPrestamos || [];
  return Math.max(1, Math.ceil(list.length / itemsPerPage));
});

const paginatedHistorialPrestamos = computed(() => {
  const list = selectedReferee.value?.historialPrestamos || [];
  const start = (currentLoansPage.value - 1) * itemsPerPage;
  return list.slice(start, start + itemsPerPage);
});

// Propiedades computadas para paginación de Calendario de Pagos
const totalPaymentsPages = computed(() => {
  const list = selectedReferee.value?.calendarioPagos || [];
  return Math.max(1, Math.ceil(list.length / itemsPerPage));
});

const paginatedCalendarioPagos = computed(() => {
  const list = selectedReferee.value?.calendarioPagos || [];
  const start = (currentPaymentsPage.value - 1) * itemsPerPage;
  return list.slice(start, start + itemsPerPage);
});

// Funciones de navegación de páginas
const nextLoansPage = () => {
  if (currentLoansPage.value < totalLoansPages.value) {
    currentLoansPage.value++;
  }
};

const prevLoansPage = () => {
  if (currentLoansPage.value > 1) {
    currentLoansPage.value--;
  }
};

const nextPaymentsPage = () => {
  if (currentPaymentsPage.value < totalPaymentsPages.value) {
    currentPaymentsPage.value++;
  }
};

const prevPaymentsPage = () => {
  if (currentPaymentsPage.value > 1) {
    currentPaymentsPage.value--;
  }
};

// Cargar información al montar
const loadData = async () => {
  try {
    referees.value = await api.getReferees();

    // Por defecto, seleccionar a Marcus Thorne (basado en screen 3)
    if (!selectedReferee.value && referees.value.length > 0) {
      const thorne = referees.value.find((r) => r.nombre === "Marcus Thorne");
      const initial = thorne || referees.value[0];
      await selectReferee(initial);
    } else if (selectedReferee.value) {
      // Recargar árbitro seleccionado con datos actualizados
      const detailed = await api.getRefereeById(selectedReferee.value.id);
      if (detailed) selectedReferee.value = detailed;
    }
  } catch (err) {
    console.error("Error al cargar directorio de árbitros:", err);
  }
};

onMounted(() => {
  loadData();
});

// Watch para buscar en el buscador global y abrir el perfil del árbitro si coincide
watch(
  () => props.searchQuery,
  (newQuery) => {
    if (newQuery.trim() && referees.value.length > 0) {
      const q = newQuery.toLowerCase();
      const matched = referees.value.find(
        (r) =>
          r.nombre.toLowerCase().includes(q) || String(r.id).toLowerCase().includes(q),
      );
      if (matched && selectedReferee.value?.id !== matched.id) {
        selectReferee(matched);
      }
    }
  },
);

// Filtrado de árbitros del panel izquierdo según buscador
const filteredReferees = computed(() => {
  if (!props.searchQuery.trim()) return referees.value;
  const query = props.searchQuery.toLowerCase();
  return referees.value.filter(
    (r) =>
      r.nombre.toLowerCase().includes(query) ||
      String(r.id).toLowerCase().includes(query) ||
      r.clasificacion.toLowerCase().includes(query),
  );
});

// Seleccionar árbitro
const selectReferee = async (referee) => {
  selectedReferee.value = referee;
  activeSubTab.value = "historial";
  showNoteEditor.value = false;
  newNoteContent.value = "";

  try {
    const detailed = await api.getRefereeById(referee.id);
    if (detailed) {
      selectedReferee.value = detailed;
    }
  } catch (err) {
    console.error("Error al obtener detalle del árbitro:", err);
  }
};

// Crear nota administrativa
const submitNote = async () => {
  if (!newNoteContent.value.trim() || !selectedReferee.value) return;

  try {
    await api.addRefereeNote(selectedReferee.value.id, newNoteContent.value);
    await loadData();
    newNoteContent.value = "";
    showNoteEditor.value = false;
    alert("Nota interna agregada con éxito al registro de auditoría.");
  } catch (err) {
    console.error("Error al guardar nota:", err);
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

const printReport = () => {
  alert(
    `Preparando impresión de la ficha técnica de ${selectedReferee.value.nombre}...\nGuardado con éxito en Descargas/Ficha_${selectedReferee.value.nombre.replace(" ", "_")}.pdf`,
  );
};

const editProfile = () => {
  alert(
    `Abrir formulario de edición para el perfil del árbitro ${selectedReferee.value.nombre} (Modificar clasificación, contacto, región)...`,
  );
};
</script>
