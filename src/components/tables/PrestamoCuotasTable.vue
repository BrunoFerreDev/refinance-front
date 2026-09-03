<template>
  <div class="bg-white border border-reffinance-border rounded-2xl shadow-sm overflow-hidden">
    <div class="p-6 border-b border-reffinance-border">
      <h3 class="text-base font-extrabold text-reffinance-navy font-outfit">
        Desglose de Cuotas de Devolución
      </h3>
      <p class="text-xs text-slate-400 mt-0.5">Calendario de vencimiento y pagos de amortización</p>
    </div>

    <div class="p-6">
      <div v-if="loading" class="flex flex-col items-center justify-center py-10 space-y-3">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-reffinance-navy"></div>
        <p class="text-xs font-bold text-slate-400">Cargando desglose de cuotas...</p>
      </div>

      <div v-else-if="cuotas && cuotas.length" class="space-y-4">
        <!-- Table of Installments -->
        <div class="overflow-x-auto border border-slate-100 rounded-xl">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th class="py-4 px-6">Nro Cuota</th>
                <th class="py-4 px-6">Fecha Vto.</th>
                <th class="py-4 px-6">Monto Cuota</th>
                <th class="py-4 px-6">Monto Pagado</th>
                <th class="py-4 px-6">Estado</th>
                <th v-if="!isReadOnly" class="py-4 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-600 font-semibold">
              <tr
                v-for="cuota in cuotas"
                :key="cuota.idDeuda"
                class="hover:bg-slate-50/50 transition-colors"
              >
                <td class="py-4 px-6 font-bold text-slate-700">Cuota {{ cuota.nroCuota }}</td>
                <td class="py-4 px-6 text-slate-400">{{ formatFecha(cuota.fechaVencimiento) }}</td>
                <td class="py-4 px-6 font-outfit text-slate-800">${{ formatNumber(cuota.montoCuota) }}</td>
                <td class="py-4 px-6 font-outfit text-emerald-600">${{ formatNumber(cuota.montoPagado) }}</td>
                <td class="py-4 px-6">
                  <span
                    :class="[
                      'px-2.5 py-1 rounded text-[10px] font-bold border',
                      cuota.estado === 'PAGADO'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : cuota.estado === 'PARCIAL'
                          ? 'bg-sky-50 border-sky-200 text-sky-700'
                          : 'bg-rose-50 border-rose-200 text-rose-700'
                    ]"
                  >
                    {{ cuota.estado }}
                  </span>
                </td>
                <!-- Only render quick-payment actions if NOT read-only -->
                <td v-if="!isReadOnly" class="py-4 px-6 text-center">
                  <button
                    v-if="cuota.estado !== 'PAGADO'"
                    @click="$emit('pay', cuota)"
                    title="Abonar Cuota"
                    class="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 transition-colors flex items-center justify-center mx-auto cursor-pointer"
                  >
                    <DollarSign class="w-3.5 h-3.5 mr-0.5 shrink-0" />
                    Cobrar
                  </button>
                  <span v-else class="text-[10px] text-slate-400 italic">Liquidada</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Installments Pagination Footer -->
        <div class="flex items-center justify-between text-xs font-semibold pt-4">
          <span class="text-slate-400">
            Página {{ currentPage + 1 }} de {{ totalPages || 1 }}
          </span>
          <div class="flex items-center space-x-1.5">
            <button
              @click="$emit('prev-page')"
              :disabled="currentPage === 0"
              class="p-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 rounded-lg transition-colors disabled:opacity-40 disabled:hover:bg-white select-none cursor-pointer"
            >
              <ChevronLeft class="w-4 h-4" />
            </button>
            <button
              @click="$emit('next-page')"
              :disabled="isLast"
              class="p-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 rounded-lg transition-colors disabled:opacity-40 disabled:hover:bg-white select-none cursor-pointer"
            >
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12 text-slate-400 font-semibold text-sm">
        No se encontraron cuotas registradas para este préstamo.
      </div>
    </div>
  </div>
</template>

<script setup>
import { DollarSign, ChevronLeft, ChevronRight } from "lucide-vue-next";

defineProps({
  cuotas: {
    type: Array,
    default: () => [],
  },
  currentPage: {
    type: Number,
    default: 0,
  },
  totalPages: {
    type: Number,
    default: 1,
  },
  isLast: {
    type: Boolean,
    default: true,
  },
  isReadOnly: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["pay", "prev-page", "next-page"]);

const formatNumber = (val) => {
  if (val === undefined || val === null) return "0.00";
  return Number(val).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatFecha = (d) => {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
</script>

