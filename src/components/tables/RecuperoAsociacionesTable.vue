<template>
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
          Árbitros Asociados al Gasto
        </h3>
        <p class="text-xs text-slate-400 mt-0.5">
          Montos asignados y estado de devoluciones individuales
        </p>
      </div>

      <button
        @click="$emit('associate')"
        class="px-3 py-1.5 bg-slate-50 border border-reffinance-border hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center cursor-pointer"
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
            v-for="(assoc, index) in asociaciones"
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
                  {{ assoc.arbitro?.nombre?.charAt(0) || ""
                  }}{{ assoc.arbitro?.apellido?.charAt(0) || "" }}
                </div>
                <div>
                  <h4 class="font-extrabold text-slate-800 leading-tight">
                    {{ assoc.arbitro?.nombre }} {{ assoc.arbitro?.apellido }}
                  </h4>
                  <p class="text-[10px] text-slate-400 font-bold mt-0.5">
                    Asoc:
                    {{
                      formatFecha(
                        assoc.fechaAsociacion || transactionDate,
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
                      width: `${Math.round(
                        (assoc.montoRecuperado / assoc.montoAsignado) * 100
                          ? (assoc.montoRecuperado / assoc.montoAsignado) *
                              100
                          : 0,
                      )}%`,
                    }"
                  ></div>
                </div>
                <span class="text-[10px] font-bold text-slate-500">
                  {{
                    Math.round(
                      (assoc.montoRecuperado / assoc.montoAsignado) * 100
                        ? (assoc.montoRecuperado / assoc.montoAsignado) *
                            100
                        : 0,
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
                  @click="$emit('refund', assoc)"
                  title="Registrar Reembolso"
                  class="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 transition-colors flex items-center whitespace-nowrap cursor-pointer"
                >
                  <DollarSign class="w-3.5 h-3.5 mr-0.5 shrink-0" />
                  Cobrar
                </button>
                <button
                  @click="$emit('delete', assoc)"
                  title="Desasociar Árbitro"
                  class="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                >
                  <Trash2 class="w-4 h-4 shrink-0" />
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="asociaciones.length === 0">
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
</template>

<script setup>
import { Plus, DollarSign, Trash2 } from "lucide-vue-next";

defineProps({
  asociaciones: {
    type: Array,
    default: () => [],
  },
  transactionDate: {
    type: String,
    default: "",
  },
});

defineEmits(["associate", "refund", "delete"]);

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

