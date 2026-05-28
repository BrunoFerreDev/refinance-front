<template>
  <!-- Transaction Ledger History Card -->
  <div
    class="bg-white border border-reffinance-border rounded-2xl shadow-sm overflow-hidden"
  >
    <!-- Title and Action Filters -->
    <div
      class="p-6 border-b border-reffinance-border flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    >
      <div>
        <h2 class="text-lg font-bold text-reffinance-navy font-outfit">
          Historial de Transacciones
        </h2>
        <p class="text-xs text-slate-400 mt-0.5">
          Control íntegro de movimientos de fondos
        </p>
      </div>

      <!-- Filters (Category pills or simple search status toggler) -->
      <div class="flex items-center space-x-2 flex-wrap gap-y-1">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="activeCategory = cat"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200',
            activeCategory === cat
              ? 'bg-reffinance-navy border-reffinance-navy text-white shadow-sm'
              : 'bg-white border-reffinance-border text-slate-500 hover:bg-slate-50',
          ]"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Ledger Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr
            class="bg-slate-50 border-b border-reffinance-border text-[10px] uppercase font-bold text-slate-400 tracking-wider"
          >
            <th class="py-4 px-6">Fecha</th>
            <th class="py-4 px-6">Tipo</th>
            <th class="py-4 px-6">Concepto / Categoría</th>
            <th class="py-4 px-6">Descripción</th>
            <th class="py-4 px-6 text-right">Monto</th>
            <th class="py-4 px-6 text-center">Acción</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
          <tr
            v-for="tx in paginatedTransactions"
            :key="tx.id"
            class="hover:bg-slate-50/50 transition-colors"
          >
            <td class="py-4 px-6 text-xs font-medium text-slate-500">
              {{ tx.fecha }}
            </td>
            <td class="py-4 px-6">
              <!-- Icon with Circle -->
              <div class="flex items-center space-x-2.5">
                <div
                  :class="[
                    'p-1.5 rounded-full border',
                    tx.requiereRecupero
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : tx.tipo === 'Ingreso'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : tx.tipo === 'Pago Préstamo'
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                          : tx.tipo === 'Reintegro de Gasto'
                            ? 'bg-teal-50 border-teal-200 text-teal-700'
                            : 'bg-rose-50 border-rose-200 text-rose-700',
                  ]"
                >
                  <RotateCcw
                    v-if="
                      tx.requiereRecupero || tx.tipo === 'Reintegro de Gasto'
                    "
                    class="w-3.5 h-3.5"
                  />
                  <ArrowDownLeft
                    v-else-if="tx.tipo === 'Ingreso'"
                    class="w-3.5 h-3.5"
                  />
                  <ArrowUpRight
                    v-else-if="tx.tipo === 'Gasto'"
                    class="w-3.5 h-3.5"
                  />
                  <RotateCcw v-else class="w-3.5 h-3.5" />
                </div>
                <span class="font-semibold text-xs text-slate-800">{{
                  tx.requiereRecupero ? "Recupero de Gasto" : tx.tipo
                }}</span>
              </div>
            </td>
            <td class="py-4 px-6">
              <div class="flex flex-col space-y-1">
                <span
                  v-if="tx.nombreConceptoGasto"
                  :class="[
                    'px-2.5 py-1 rounded text-[10px] font-bold border w-max',
                    getCategoryBadgeClass(tx.nombreConceptoGasto),
                  ]"
                >
                  {{ tx.nombreConceptoGasto }}
                </span>
              </div>
            </td>
            <td class="py-4 px-6">
              <div class="space-y-0.5">
                <p class="font-semibold text-slate-800 text-sm leading-normal">
                  {{ tx.descripcion }}
                </p>
                <div class="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span
                    class="text-[10px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded"
                  >
                    {{ tx.id }}
                  </span>
                  <span
                    v-if="tx.idPrestamo"
                    class="text-[10px] text-indigo-600 font-bold bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded flex items-center"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1 inline-block"
                    ></span>
                    Préstamo vinculado: #RF-LN-{{ tx.idPrestamo }}
                  </span>
                  <span
                    v-if="tx.requiereRecupero"
                    class="text-[10px] text-amber-600 font-bold bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded flex items-center"
                  >
                    Recupero
                  </span>
                </div>
              </div>
            </td>
            <td
              :class="[
                'py-4 px-6 font-bold text-right font-outfit text-base',
                tx.tipo === 'Gasto' || tx.monto < 0
                  ? 'text-rose-600'
                  : 'text-emerald-600',
              ]"
            >
              {{ tx.tipo === "Gasto" || tx.monto < 0 ? "-" : "+" }}${{
                formatNumber(Math.abs(tx.monto))
              }}
            </td>
            <td class="py-4 px-6 text-center">
              <div class="flex items-center justify-center space-x-1.5">
                <button
                  v-if="tx.tipo !== 'Pago Préstamo'"
                  @click="$emit('edit', tx)"
                  title="Editar Transacción"
                  class="p-1.5 hover:bg-indigo-50 rounded text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <Pencil class="w-4 h-4" />
                </button>
                <div class="flex flex-col gap-2">
                  <router-link
                    v-if="tx.requiereRecupero"
                    :to="{
                      name: 'gasto-recupero-detalle',
                      params: { idTransaccion: tx.idTransaccion },
                    }"
                    title="Ver Detalles de Recupero"
                    class="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-lg border border-amber-200 transition-colors flex items-center shadow-xs whitespace-nowrap"
                  >
                    <Eye class="w-3.5 h-3.5 mr-1 shrink-0" />
                    Ver
                  </router-link>
                </div>
              </div>
            </td>
          </tr>
          <tr v-if="filteredTransactions.length === 0">
            <td
              colspan="6"
              class="text-center py-12 text-slate-400 font-semibold"
            >
              No se encontraron transacciones en esta categoría o búsqueda.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Footer -->
    <div
      class="px-6 py-4 bg-slate-50 border-t border-reffinance-border flex items-center justify-between"
    >
      <p class="text-xs font-semibold text-slate-500">
        Mostrando {{ paginatedTransactions.length }} de
        {{ filteredTransactions.length }} transacciones
      </p>

      <!-- Pagination Page Controls -->
      <div class="flex items-center space-x-1.5 text-xs font-bold">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="p-2 border border-reffinance-border rounded-lg bg-white text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-white select-none cursor-pointer"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
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
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="p-2 border border-reffinance-border rounded-lg bg-white text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-white select-none cursor-pointer"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ChevronLeft,
  ChevronRight,
  ArrowDownLeft,
  ArrowUpRight,
  RotateCcw,
  Pencil,
  UserPlus,
  Eye,
} from "lucide-vue-next";
import { ref, computed, watch, onMounted } from "vue";

const props = defineProps({
  transactions: {
    type: Array,
    required: true,
  },
  categories: {
    type: Array,
    required: true,
  },
  searchQuery: {
    type: String,
    default: "",
  },
  totalPages: {
    type: Number,
    default: null,
  },
  currentPage: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits(["edit", "associateArbitro", "changePage"]);

// Reactivos de filtrado y paginación
const activeCategory = ref("Todos");
const localCurrentPage = ref(1);
const itemsPerPage = 5;

const currentPage = computed({
  get() {
    return props.currentPage !== null ? props.currentPage : localCurrentPage.value;
  },
  set(val) {
    if (props.currentPage !== null) {
      emit("changePage", val);
    } else {
      localCurrentPage.value = val;
    }
  }
});

// Resetear página al buscar o filtrar
watch([activeCategory, () => props.searchQuery], () => {
  currentPage.value = 1;
});
onMounted(() => {
  console.log(props.transactions);
});
// Filtrado reactivo de transacciones
const filteredTransactions = computed(() => {
  let result = props.transactions;

  // Filtrado por categoría
  if (activeCategory.value !== "Todos") {
    if (activeCategory.value === "Recupero") {
      result = result.filter((tx) => tx.requiereRecupero === true);
    } else if (activeCategory.value === "Reintegro de Gasto") {
      result = result.filter((tx) => tx.tipo === "Reintegro de Gasto");
    } else {
      result = result.filter(
        (tx) =>
          tx.nombreConceptoGasto &&
          tx.nombreConceptoGasto.toLowerCase() ===
            activeCategory.value.toLowerCase(),
      );
    }
  }

  // Filtrado por buscador global
  if (props.searchQuery.trim()) {
    const query = props.searchQuery.toLowerCase();
    result = result.filter(
      (tx) =>
        tx.id.toLowerCase().includes(query) ||
        tx.descripcion.toLowerCase().includes(query) ||
        (tx.nombreConceptoGasto &&
          tx.nombreConceptoGasto.toLowerCase().includes(query)) ||
        tx.tipo.toLowerCase().includes(query),
    );
  }

  return result;
});

// Paginación
const totalPages = computed(() => {
  if (props.totalPages !== null) {
    return props.totalPages;
  }
  return Math.max(
    1,
    Math.ceil(filteredTransactions.value.length / itemsPerPage),
  );
});

const paginatedTransactions = computed(() => {
  if (props.totalPages !== null) {
    return filteredTransactions.value;
  }
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredTransactions.value.slice(start, start + itemsPerPage);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value = currentPage.value + 1;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value = currentPage.value - 1;
  }
};

// Utilidad de formato
const formatNumber = (num) => {
  if (num === undefined || num === null) return "0.00";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const getCategoryBadgeClass = (category) => {
  const cat = String(category || "").toUpperCase();
  if (
    cat.includes("HONORARIO") ||
    cat.includes("CAPACITACI") ||
    cat.includes("CURSO")
  ) {
    return "bg-indigo-50 border-indigo-200 text-indigo-700";
  }
  if (
    cat.includes("EQUIPAMIENTO") ||
    cat.includes("INDUMENTARIA") ||
    cat.includes("SUMINISTRO")
  ) {
    return "bg-amber-50 border-amber-200 text-amber-700";
  }
  if (
    cat.includes("INSUMO") ||
    cat.includes("OFICINA") ||
    cat.includes("SOFTWARE") ||
    cat.includes("ADMINISTRA")
  ) {
    return "bg-rose-50 border-rose-200 text-rose-700";
  }
  if (
    cat.includes("VIATICO") ||
    cat.includes("VIÁTICO") ||
    cat.includes("RECUPERA") ||
    cat.includes("INTERES")
  ) {
    return "bg-sky-50 border-sky-200 text-sky-700";
  }
  if (
    cat.includes("DONACION") ||
    cat.includes("DONACIÓN") ||
    cat.includes("PATROCINIO") ||
    cat.includes("CUOTA")
  ) {
    return "bg-emerald-50 border-emerald-200 text-emerald-700";
  }
  return "bg-slate-50 border-slate-200 text-slate-700";
};
</script>
