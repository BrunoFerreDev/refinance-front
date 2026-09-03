<template>
  <div
    class="bg-white border border-reffinance-border rounded-2xl shadow-sm overflow-hidden"
  >
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr
            class="bg-slate-50 border-b border-reffinance-border text-[10px] uppercase font-bold text-slate-400 tracking-wider select-none"
          >
            <!-- ID / Árbitro -->
            <th class="py-4 px-6">
              <button
                type="button"
                @click="toggleSort('idPrestamo')"
                class="flex items-center space-x-1 hover:text-slate-700 transition-colors uppercase font-bold cursor-pointer"
              >
                <span>Árbitro / ID</span>
                <ArrowUp v-if="sortBy === 'idPrestamo' && sortDir === 'asc'" class="w-3 h-3 text-reffinance-navy" />
                <ArrowDown v-else-if="sortBy === 'idPrestamo' && sortDir === 'desc'" class="w-3 h-3 text-reffinance-navy" />
                <ArrowUpDown v-else class="w-3 h-3 opacity-30" />
              </button>
            </th>

            <!-- Monto Total -->
            <th class="py-4 px-6">
              <button
                type="button"
                @click="toggleSort('montoSolicitado')"
                class="flex items-center space-x-1 hover:text-slate-700 transition-colors uppercase font-bold cursor-pointer"
              >
                <span>Monto Total</span>
                <ArrowUp v-if="sortBy === 'montoSolicitado' && sortDir === 'asc'" class="w-3 h-3 text-reffinance-navy" />
                <ArrowDown v-else-if="sortBy === 'montoSolicitado' && sortDir === 'desc'" class="w-3 h-3 text-reffinance-navy" />
                <ArrowUpDown v-else class="w-3 h-3 opacity-30" />
              </button>
            </th>

            <!-- Monto Pagado -->
            <th class="py-4 px-6">
              <button
                type="button"
                @click="toggleSort('montoDevuelto')"
                class="flex items-center space-x-1 hover:text-slate-700 transition-colors uppercase font-bold cursor-pointer"
              >
                <span>Monto Pagado</span>
                <ArrowUp v-if="sortBy === 'montoDevuelto' && sortDir === 'asc'" class="w-3 h-3 text-reffinance-navy" />
                <ArrowDown v-else-if="sortBy === 'montoDevuelto' && sortDir === 'desc'" class="w-3 h-3 text-reffinance-navy" />
                <ArrowUpDown v-else class="w-3 h-3 opacity-30" />
              </button>
            </th>

            <!-- Saldo Restante -->
            <th class="py-4 px-6">Saldo Restante</th>

            <!-- Fecha Solicitud -->
            <th class="py-4 px-6">
              <button
                type="button"
                @click="toggleSort('fechaSolicitud')"
                class="flex items-center space-x-1 hover:text-slate-700 transition-colors uppercase font-bold cursor-pointer"
              >
                <span>Fecha Solicitud</span>
                <ArrowUp v-if="sortBy === 'fechaSolicitud' && sortDir === 'asc'" class="w-3 h-3 text-reffinance-navy" />
                <ArrowDown v-else-if="sortBy === 'fechaSolicitud' && sortDir === 'desc'" class="w-3 h-3 text-reffinance-navy" />
                <ArrowUpDown v-else class="w-3 h-3 opacity-30" />
              </button>
            </th>

            <!-- Estado -->
            <th class="py-4 px-6">
              <button
                type="button"
                @click="toggleSort('estado')"
                class="flex items-center space-x-1 hover:text-slate-700 transition-colors uppercase font-bold cursor-pointer"
              >
                <span>Estado</span>
                <ArrowUp v-if="sortBy === 'estado' && sortDir === 'asc'" class="w-3 h-3 text-reffinance-navy" />
                <ArrowDown v-else-if="sortBy === 'estado' && sortDir === 'desc'" class="w-3 h-3 text-reffinance-navy" />
                <ArrowUpDown v-else class="w-3 h-3 opacity-30" />
              </button>
            </th>

            <!-- Acciones -->
            <th class="py-4 px-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
          <tr
            v-for="loan in loans"
            :key="loan.idPrestamo"
            class="hover:bg-slate-50/50 transition-colors"
          >
            <td class="py-4 px-6">
              <!-- Profile Avatar and Name -->
              <div class="flex items-center space-x-3">
                <div
                  :class="[
                    'w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-sm',
                    loan.avatarColor || 'bg-indigo-600',
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
                  class="p-1.5 hover:bg-amber-50 rounded text-amber-600 hover:text-amber-700 transition-colors flex items-center justify-center cursor-pointer"
                >
                  <Eye class="w-4 h-4" />
                </router-link>
                <button
                  v-if="loan.estado !== 'PAGADO'"
                  @click="$emit('pay', loan)"
                  title="Registrar Pago"
                  class="p-1.5 hover:bg-emerald-50 rounded text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  <DollarSign class="w-4 h-4" />
                </button>
                <button
                  v-if="loan.estado !== 'PAGADO'"
                  @click="$emit('update-date', loan)"
                  title="Actualizar Fecha"
                  class="p-1.5 hover:bg-indigo-50 rounded text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
                >
                  <Calendar class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="loans.length === 0">
            <td
              colspan="7"
              class="text-center py-12 text-slate-400 font-semibold"
            >
              No se encontraron préstamos que coincidan con los filtros.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Footer -->
    <div
      class="px-6 py-4 bg-slate-50 border-t border-reffinance-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div class="flex items-center space-x-4">
        <p class="text-xs font-semibold text-slate-500">
          Mostrando {{ loans.length }} de
          {{ totalLoans }} préstamos
        </p>

        <!-- Page Size Selector -->
        <div class="flex items-center space-x-1.5 text-xs text-slate-500">
          <label for="pageSizeSelect" class="font-medium">Filas:</label>
          <select
            id="pageSizeSelect"
            :value="pageSize"
            @change="$emit('update:page-size', Number($event.target.value))"
            class="px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-semibold text-slate-700 focus:outline-none focus:border-reffinance-navy cursor-pointer"
          >
            <option v-for="sz in pageSizeOptions" :key="sz" :value="sz">
              {{ sz }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex items-center space-x-1.5 text-xs font-bold self-center sm:self-auto">
        <button
          @click="$emit('change-page', currentPage - 1)"
          :disabled="currentPage === 1"
          class="p-2 border border-reffinance-border rounded-lg bg-white text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-white select-none cursor-pointer"
          title="Página anterior"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          @click="$emit('change-page', page)"
          :class="[
            'px-3.5 py-1.5 rounded-lg border transition-all select-none cursor-pointer',
            currentPage === page
              ? 'bg-reffinance-navy border-reffinance-navy text-white'
              : 'bg-white border-reffinance-border text-slate-600 hover:bg-slate-50',
          ]"
        >
          {{ page }}
        </button>

        <button
          @click="$emit('change-page', currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="p-2 border border-reffinance-border rounded-lg bg-white text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-white select-none cursor-pointer"
          title="Página siguiente"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Eye,
  DollarSign,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-vue-next";

const props = defineProps({
  loans: {
    type: Array,
    default: () => [],
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  totalPages: {
    type: Number,
    default: 1,
  },
  totalLoans: {
    type: Number,
    default: 0,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  pageSizeOptions: {
    type: Array,
    default: () => [5, 10, 20, 50],
  },
  sortBy: {
    type: String,
    default: "fechaSolicitud",
  },
  sortDir: {
    type: String,
    default: "desc",
  },
});

const emit = defineEmits([
  "pay",
  "update-date",
  "change-page",
  "sort-change",
  "update:page-size",
]);

const toggleSort = (field) => {
  let newDir = "desc";
  if (props.sortBy === field) {
    newDir = props.sortDir === "asc" ? "desc" : "asc";
  } else {
    // Defaults for numbers/dates
    newDir = field === "idPrestamo" || field === "fechaSolicitud" ? "desc" : "asc";
  }
  emit("sort-change", { sortBy: field, sortDir: newDir });
};

const getInitials = (name) => {
  if (!name) return "AR";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const formatNumber = (val) => {
  if (val === undefined || val === null) return "0.00";
  return Number(val).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
</script>
