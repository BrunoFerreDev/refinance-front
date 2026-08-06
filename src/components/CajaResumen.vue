<template>
  <!-- Overview Row: Cash Flow and Flow Analysis -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Balance Card -->
    <div
      class="bg-white border border-reffinance-border rounded-2xl shadow-sm p-6 lg:col-span-1 flex flex-col justify-between space-y-6"
    >
      <div>
        <h3
          class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2"
        >
          Saldo Mes Actual
        </h3>
        <div class="space-y-1">
          <p class="text-4xl font-black text-reffinance-navy font-outfit">
            ${{ formatNumber(cajaInfo.saldoMesActual) }}
          </p>
          <div class="flex items-center text-emerald-600 text-xs font-bold">
            <TrendingUp class="w-3.5 h-3.5 mr-1" />
            +{{ cajaInfo.cambioMesActual }}% vs mes anterior
          </div>
        </div>
      </div>

      <!-- Mini Income & Expense summaries -->
      <div class="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
        <div
          class="bg-emerald-50/70 border border-emerald-100 p-3 rounded-xl"
        >
          <p
            class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider"
          >
            Ingresos
          </p>
          <p class="text-lg font-extrabold text-emerald-700 font-outfit mt-1">
            ${{ formatNumber(cajaInfo.ingresosMesActual) }}
          </p>
        </div>
        <div class="bg-rose-50/70 border border-rose-100 p-3 rounded-xl">
          <p
            class="text-[10px] font-bold text-rose-700 uppercase tracking-wider"
          >
            Gastos
          </p>
          <p class="text-lg font-extrabold text-rose-700 font-outfit mt-1">
            -${{ formatNumber(Math.abs(cajaInfo.gastosMesActual)) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Monthly Cash Flow Analysis Card (Replacing Budget Distribution) -->
    <div
      class="bg-white border border-reffinance-border rounded-2xl shadow-sm p-6 lg:col-span-2 flex flex-col justify-between"
    >
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-lg font-bold text-reffinance-navy font-outfit">
            Análisis de Flujo Mensual
          </h2>
          <p class="text-xs text-slate-400 mt-0.5">
            Comparativa de ingresos, gastos y margen de ahorro del mes
          </p>
        </div>
        <!-- Month selector -->
        <div class="relative">
          <select
            :value="selectedMonth"
            @change="onMonthChange"
            class="appearance-none pr-8 pl-3 py-1.5 bg-slate-50 border border-reffinance-border rounded-lg text-xs font-bold text-slate-600 focus:outline-none focus:bg-white select-none cursor-pointer"
          >
            <option
              v-for="month in months"
              :key="month.value"
              :value="month.value"
            >
              {{ month.label }}
            </option>
          </select>
          <ChevronDown
            class="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>
      </div>

      <!-- Main Content of the Flow Analysis -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-6 items-center flex-1">
        <!-- Visual circular savings progress representation -->
        <div class="md:col-span-2 flex flex-col items-center justify-center p-5 bg-slate-50/50 rounded-2xl border border-slate-100 h-full min-h-[140px]">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Margen de Superávit
          </span>
          <div class="flex items-baseline space-x-1">
            <p 
              class="text-4xl font-black font-outfit"
              :class="superavitMargin >= 0 ? 'text-emerald-600' : 'text-rose-600'"
            >
              {{ superavitMargin }}%
            </p>
          </div>
          <p class="text-[10px] text-slate-400 font-semibold mt-3 text-center leading-relaxed">
            {{ 
              superavitMargin > 0 
                ? "Flujo saludable: los ingresos superaron a los gastos." 
                : superavitMargin === 0 
                  ? "Sin movimientos registrados en este período." 
                  : "Déficit: los egresos superaron los ingresos del mes." 
            }}
          </p>
        </div>

        <!-- Progress detail bars -->
        <div class="md:col-span-3 space-y-4">
          <!-- Total Income Progress -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs font-bold">
              <span class="text-slate-500">Ingresos</span>
              <span class="text-emerald-600">${{ formatNumber(cajaInfo.ingresosMesActual) }}</span>
            </div>
            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out"
                :style="{ width: `${incomePercentage}%` }"
              ></div>
            </div>
          </div>

          <!-- Total Expense Progress -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs font-bold">
              <span class="text-slate-500">Gastos</span>
              <span class="text-rose-600">-${{ formatNumber(Math.abs(cajaInfo.gastosMesActual)) }}</span>
            </div>
            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-rose-500 rounded-full transition-all duration-700 ease-out"
                :style="{ width: `${expensePercentage}%` }"
              ></div>
            </div>
          </div>

          <!-- Net Flow/Surplus Progress -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs font-bold">
              <span class="text-slate-500">Resultado Neto</span>
              <span 
                class="font-extrabold font-outfit"
                :class="netFlow >= 0 ? 'text-reffinance-navy' : 'text-rose-700'"
              >
                {{ netFlow >= 0 ? '$' : '-$' }}{{ formatNumber(Math.abs(netFlow)) }}
              </span>
            </div>
            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-700 ease-out"
                :class="netFlow >= 0 ? 'bg-reffinance-navy' : 'bg-rose-700'"
                :style="{ width: `${netPercentage}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { TrendingUp, ChevronDown } from "lucide-vue-next";
import { computed } from "vue";

const props = defineProps({
  cajaInfo: {
    type: Object,
    required: true,
  },
  selectedMonth: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["update:selectedMonth"]);

const currentYear = new Date().getFullYear();
const months = [
  { value: 0, label: `Enero ${currentYear}` },
  { value: 1, label: `Febrero ${currentYear}` },
  { value: 2, label: `Marzo ${currentYear}` },
  { value: 3, label: `Abril ${currentYear}` },
  { value: 4, label: `Mayo ${currentYear}` },
  { value: 5, label: `Junio ${currentYear}` },
  { value: 6, label: `Julio ${currentYear}` },
  { value: 7, label: `Agosto ${currentYear}` },
  { value: 8, label: `Septiembre ${currentYear}` },
  { value: 9, label: `Octubre ${currentYear}` },
  { value: 10, label: `Noviembre ${currentYear}` },
  { value: 11, label: `Diciembre ${currentYear}` },
];

const onMonthChange = (event) => {
  emit("update:selectedMonth", Number(event.target.value));
};

// Computed properties for Monthly Flow Analysis
const netFlow = computed(() => {
  const ingresos = props.cajaInfo.ingresosMesActual || 0;
  const gastos = Math.abs(props.cajaInfo.gastosMesActual || 0);
  return ingresos - gastos;
});

const superavitMargin = computed(() => {
  const ingresos = props.cajaInfo.ingresosMesActual || 0;
  const net = netFlow.value;
  if (ingresos === 0) return net > 0 ? 100 : net < 0 ? -100 : 0;
  return Math.round((net / ingresos) * 100);
});

const totalSum = computed(() => {
  const ingresos = props.cajaInfo.ingresosMesActual || 0;
  const gastos = Math.abs(props.cajaInfo.gastosMesActual || 0);
  return ingresos + gastos;
});

const incomePercentage = computed(() => {
  if (totalSum.value === 0) return 0;
  return Math.round((props.cajaInfo.ingresosMesActual / totalSum.value) * 100);
});

const expensePercentage = computed(() => {
  if (totalSum.value === 0) return 0;
  return Math.round((Math.abs(props.cajaInfo.gastosMesActual) / totalSum.value) * 100);
});

const netPercentage = computed(() => {
  const net = netFlow.value;
  const maxVal = Math.max(props.cajaInfo.ingresosMesActual || 0, Math.abs(props.cajaInfo.gastosMesActual || 0));
  if (maxVal === 0) return 0;
  return Math.round((Math.abs(net) / maxVal) * 100);
});

const formatNumber = (num) => {
  if (num === undefined || num === null) return "0.00";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
</script>
