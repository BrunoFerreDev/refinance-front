<template>
  <div
    class="bg-white border border-reffinance-border rounded-2xl shadow-sm overflow-hidden"
  >
    <div class="p-6 border-b border-reffinance-border bg-slate-50/50">
      <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">
        Aranceles Configurados
      </h3>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-reffinance-border bg-slate-50/70">
            <th
              class="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider pl-6"
            >
              Descripción
            </th>
            <th
              class="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right"
            >
              Monto
            </th>
            <th
              class="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center"
            >
              Partidos
            </th>
            <th
              class="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider"
            >
              Vigencia
            </th>
            <th
              class="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center"
            >
              Estado
            </th>
            <th
              class="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider pr-6 text-center"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="item in aranceles"
            :key="item.idArancel"
            class="hover:bg-slate-50/50 transition-colors"
          >
            <td
              class="p-4 text-sm font-extrabold text-reffinance-navy pl-6"
            >
              {{ item.descripcion }}
            </td>
            <td
              class="p-4 text-sm font-extrabold text-slate-800 text-right"
            >
              ${{
                formatNumber(
                  item.montoTotal !== undefined
                    ? item.montoTotal
                    : item.monto,
                )
              }}
            </td>
            <td
              class="p-4 text-sm text-slate-600 font-semibold text-center"
            >
              {{ item.cantidadPartidos }}
            </td>
            <td class="p-4 text-sm text-slate-500 font-medium">
              {{ formatDate(item.fechaVigencia) }}
            </td>
            <td class="p-4 text-center">
              <button
                @click="$emit('toggle-estado', item)"
                :disabled="loadingToggle === item.idArancel"
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase tracking-wider transition-colors cursor-pointer',
                  item.activo
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100',
                ]"
              >
                <span v-if="loadingToggle === item.idArancel" class="mr-1"
                  >...</span
                >
                {{ item.activo ? "Activo" : "Inactivo" }}
              </button>
            </td>
            <td class="p-4 text-center pr-6">
              <div class="flex items-center justify-center space-x-2">
                <button
                  @click="$emit('edit', item)"
                  class="text-slate-400 hover:text-reffinance-navy p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Editar Arancel"
                >
                  <Edit class="w-4 h-4" />
                </button>
                <button
                  @click="$emit('confirm-toggle', item)"
                  class="text-slate-400 hover:text-reffinance-navy p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Alternar estado"
                >
                  <RefreshCw class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="aranceles.length === 0">
            <td
              colspan="6"
              class="p-12 text-center text-sm font-semibold text-slate-400"
            >
              Esta cancha no tiene aranceles configurados.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { Edit, RefreshCw } from "lucide-vue-next";

defineProps({
  aranceles: {
    type: Array,
    default: () => [],
  },
  loadingToggle: {
    type: [Number, String],
    default: null,
  },
});

defineEmits(["edit", "toggle-estado", "confirm-toggle"]);

const formatNumber = (val) => {
  if (val === undefined || val === null) return "0.00";
  return Number(val).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const parts = dateStr.split("T")[0].split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};
</script>

