<template>
  <!-- Overview Row: Cash Flow and Budget Distribution -->
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

    <!-- Budget Distribution Progress Bars Card -->
    <div
      class="bg-white border border-reffinance-border rounded-2xl shadow-sm p-6 lg:col-span-2 flex flex-col justify-between"
    >
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-lg font-bold text-reffinance-navy font-outfit">
            Distribución de Presupuesto
          </h2>
          <p class="text-xs text-slate-400 mt-0.5">
            Asignación porcentual de fondos del mes
          </p>
        </div>
        <!-- Month selector -->
        <div class="relative">
          <select
            class="appearance-none pr-8 pl-3 py-1.5 bg-slate-50 border border-reffinance-border rounded-lg text-xs font-bold text-slate-600 focus:outline-none focus:bg-white select-none cursor-pointer"
          >
            <option>Octubre 2023</option>
            <option>Septiembre 2023</option>
            <option>Agosto 2023</option>
          </select>
          <ChevronDown
            class="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>
      </div>

      <!-- Progress Bars -->
      <div class="space-y-4 flex-1 flex flex-col justify-center">
        <!-- Bar 1: Honorarios Árbitros -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs font-bold">
            <span class="text-reffinance-navy">Honorarios Árbitros</span>
            <span class="text-slate-500"
              >{{
                cajaInfo.distribucionPresupuesto?.honorariosArbitros || 65
              }}%</span
            >
          </div>
          <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-reffinance-navy rounded-full transition-all duration-700 ease-out"
              :style="{
                width: `${cajaInfo.distribucionPresupuesto?.honorariosArbitros || 65}%`,
              }"
            ></div>
          </div>
        </div>

        <!-- Bar 2: Suministros Operativos -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs font-bold">
            <span class="text-reffinance-navy">Suministros Operativos</span>
            <span class="text-slate-500"
              >{{
                cajaInfo.distribucionPresupuesto?.suministrosOperativos || 20
              }}%</span
            >
          </div>
          <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-[#3B82F6] rounded-full transition-all duration-700 ease-out"
              :style="{
                width: `${cajaInfo.distribucionPresupuesto?.suministrosOperativos || 20}%`,
              }"
            ></div>
          </div>
        </div>

        <!-- Bar 3: Intereses Administrativos -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs font-bold">
            <span class="text-reffinance-navy"
              >Intereses Administrativos</span
            >
            <span class="text-slate-500"
              >{{
                cajaInfo.distribucionPresupuesto?.interesesAdministrativos ||
                15
              }}%</span
            >
          </div>
          <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-[#93C5FD] rounded-full transition-all duration-700 ease-out"
              :style="{
                width: `${cajaInfo.distribucionPresupuesto?.interesesAdministrativos || 15}%`,
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { TrendingUp, ChevronDown } from "lucide-vue-next";

defineProps({
  cajaInfo: {
    type: Object,
    required: true,
  },
});

const formatNumber = (num) => {
  if (num === undefined || num === null) return "0.00";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
</script>
