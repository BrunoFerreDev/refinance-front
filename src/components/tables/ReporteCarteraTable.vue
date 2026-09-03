<template>
  <div class="overflow-x-auto">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-slate-50/30 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          <th class="py-3.5 px-6">Estado</th>
          <th class="py-3.5 px-6">Cantidad</th>
          <th class="py-3.5 px-6 text-right">Monto Total</th>
          <th class="py-3.5 px-6 text-right">% del Total</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
        <tr
          v-for="row in cartera"
          :key="row.estado"
          class="hover:bg-slate-50/50 transition-colors"
        >
          <td class="py-3.5 px-6 flex items-center">
            <span :class="[
              'w-2 h-2 rounded-full mr-2.5',
              row.estado === 'Pagados' ? 'bg-emerald-500' : 
              row.estado === 'En Curso' ? 'bg-indigo-500' : 'bg-rose-500 animate-pulse'
            ]"></span>
            {{ row.estado }}
          </td>
          <td class="py-3.5 px-6">{{ row.cantidad }} préstamos</td>
          <td class="py-3.5 px-6 text-right font-bold font-outfit text-sm text-slate-800">
            ${{ formatNumber(row.monto) }}
          </td>
          <td class="py-3.5 px-6 text-right font-extrabold text-slate-500">
            {{ row.porcentaje }}%
          </td>
        </tr>
        <tr v-if="!cartera?.length">
          <td colspan="4" class="py-6 text-center text-slate-400 font-semibold text-xs">
            No hay datos de distribución de cartera disponibles.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  cartera: {
    type: Array,
    default: () => [],
  },
});

const formatNumber = (val) => {
  if (val === undefined || val === null) return "0.00";
  return Number(val).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
</script>

