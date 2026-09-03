<template>
  <div class="flex flex-col">
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
            <th class="py-3 px-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody
          class="divide-y divide-slate-100 text-xs font-medium text-slate-700"
        >
          <tr
            v-for="loan in paginatedLoans"
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
            <td class="py-3.5 px-6 text-center">
              <button
                v-if="loan.estado === 'VIGENTE'"
                @click="$emit('pay', loan)"
                class="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-md text-[10px] font-bold transition-colors cursor-pointer"
              >
                Pagar
              </button>
              <span v-else class="text-slate-400 text-[10px] font-semibold">-</span>
            </td>
          </tr>
          <tr v-if="!loans?.length">
            <td
              colspan="5"
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
      v-if="loans?.length"
      class="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500"
    >
      <p>
        Mostrando {{ paginatedLoans.length }} de
        {{ loans.length }} préstamos
      </p>
      <div class="flex items-center space-x-1.5 font-bold">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="p-1 border border-reffinance-border rounded bg-white text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-white select-none cursor-pointer"
        >
          <ChevronLeft class="w-3.5 h-3.5" />
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="changePage(page)"
          :class="[
            'px-2 py-0.5 rounded border transition-all select-none cursor-pointer',
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
          class="p-1 border border-reffinance-border rounded bg-white text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-white select-none cursor-pointer"
        >
          <ChevronRight class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

const props = defineProps({
  loans: {
    type: Array,
    default: () => [],
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  itemsPerPage: {
    type: Number,
    default: 5,
  },
});

const emit = defineEmits(["pay", "change-page"]);

const totalPages = computed(() => {
  return Math.ceil((props.loans?.length || 0) / props.itemsPerPage) || 1;
});

const paginatedLoans = computed(() => {
  const start = (props.currentPage - 1) * props.itemsPerPage;
  return (props.loans || []).slice(start, start + props.itemsPerPage);
});

const prevPage = () => {
  if (props.currentPage > 1) {
    emit("change-page", props.currentPage - 1);
  }
};

const nextPage = () => {
  if (props.currentPage < totalPages.value) {
    emit("change-page", props.currentPage + 1);
  }
};

const changePage = (p) => {
  emit("change-page", p);
};

const formatNumber = (val) => {
  if (val === undefined || val === null) return "0.00";
  return Number(val).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
</script>

