<template>
  <div
    class="bg-white border border-reffinance-border rounded-2xl shadow-sm overflow-hidden"
  >
    <div
      class="p-6 border-b border-reffinance-border flex items-center justify-between"
    >
      <div>
        <h2 class="text-lg font-bold text-reffinance-navy font-outfit">
          Actividad Reciente
        </h2>
        <p class="text-xs text-slate-400 mt-0.5">
          Últimos movimientos del libro mayor
        </p>
      </div>
      <button
        @click="$emit('view-all')"
        class="text-xs font-bold text-reffinance-navy hover:text-reffinance-navy-dark hover:underline cursor-pointer"
      >
        Ver Todas las Transacciones
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr
            class="bg-slate-50 border-b border-reffinance-border text-[10px] uppercase font-bold text-slate-400 tracking-wider"
          >
            <th class="py-4 px-6">Código Transacción</th>
            <th class="py-4 px-6">Fecha</th>
            <th class="py-4 px-6">Descripción</th>
            <th class="py-4 px-6">Tipo</th>
            <th class="py-4 px-6 text-right">Monto</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
          <tr
            v-for="tx in transactions"
            :key="tx.id"
            class="hover:bg-slate-50/50 transition-colors"
          >
            <td class="py-4 px-6 font-bold text-xs text-slate-400">
              {{ tx.id }}
            </td>
            <td class="py-4 px-6 text-xs text-slate-500 font-medium">
              {{ tx.fecha }}
            </td>
            <td class="py-4 px-6">
              <div class="space-y-0.5">
                <p
                  class="font-semibold text-slate-800 text-sm leading-normal"
                >
                  {{ tx.descripcion }}
                </p>
                <div class="flex items-center space-x-1.5 flex-wrap gap-y-1">
                  <span
                    v-if="tx.nombreConceptoGasto"
                    class="text-[9px] text-rose-600 font-bold bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded uppercase tracking-wider"
                  >
                    Concepto: {{ tx.nombreConceptoGasto }}
                  </span>
                  <span
                    v-if="tx.idPrestamo"
                    class="text-[9px] text-indigo-600 font-bold bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded flex items-center"
                  >
                    <span
                      class="w-1 h-1 rounded-full bg-indigo-500 mr-1 inline-block"
                    ></span>
                    Vínculo: Préstamo #RF-LN-{{ tx.idPrestamo }}
                  </span>
                </div>
              </div>
            </td>
            <td class="py-4 px-6">
              <span
                :class="[
                  'px-2 py-0.5 rounded-full text-[10px] font-bold border',
                  tx.tipo === 'Ingreso'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : tx.tipo === 'Pago Préstamo'
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : tx.tipo === 'Reintegro de Gasto'
                        ? 'bg-teal-50 border-teal-200 text-teal-700'
                        : 'bg-rose-50 border-rose-200 text-rose-700',
                ]"
              >
                {{ tx.tipo }}
              </span>
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
          </tr>
          <tr v-if="transactions.length === 0">
            <td
              colspan="5"
              class="text-center py-8 text-slate-400 font-medium"
            >
              No se encontraron transacciones recientes.
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
        Mostrando {{ transactions.length }} de
        {{ totalTransactions }} transacciones
      </p>
      <div class="flex items-center space-x-1.5 text-xs font-bold">
        <button
          @click="$emit('change-page', currentPage - 1)"
          :disabled="currentPage === 1"
          class="p-2 border border-reffinance-border rounded-lg bg-white text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-white select-none cursor-pointer"
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
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

defineProps({
  transactions: {
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
  totalTransactions: {
    type: Number,
    default: 0,
  },
});

defineEmits(["change-page", "view-all"]);

const formatNumber = (val) => {
  if (val === undefined || val === null) return "0.00";
  return Number(val).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
</script>

