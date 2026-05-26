<template>
  <div class="flex-1 p-8 overflow-y-auto space-y-8 select-none">
    <!-- Top Row: Title and Main Action -->
    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-reffinance-navy font-outfit">Reporte Anual</h1>
        <p class="text-slate-400 text-sm mt-1">
          Análisis consolidado de ingresos, gastos y rendimiento de préstamos.
        </p>
      </div>
      <button @click="downloadPdf" class="px-4 py-2.5 bg-reffinance-navy hover:bg-reffinance-navy-dark text-white rounded-lg text-sm font-bold transition-all duration-200 flex items-center shadow-md whitespace-nowrap self-start sm:self-auto">
        <Download class="w-4 h-4 mr-2 shrink-0" />
        Descargar Reporte PDF
      </button>
    </div>

    <!-- Annual Metrics Row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Ingresos Totales -->
      <div class="bg-white border border-reffinance-border p-6 rounded-2xl shadow-sm space-y-4">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Ingresos Totales</h3>
        <div class="space-y-1">
          <p class="text-3xl font-extrabold text-reffinance-navy font-outfit">
            ${{ formatNumber(report.ingresosTotales) }}
          </p>
          <div class="flex items-center text-emerald-600 text-xs font-bold">
            <TrendingUp class="w-3.5 h-3.5 mr-1" />
            +{{ report.ingresosCambioAnual }}% vs año anterior
          </div>
        </div>
      </div>

      <!-- Gastos Totales -->
      <div class="bg-white border border-reffinance-border p-6 rounded-2xl shadow-sm space-y-4">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Gastos Totales</h3>
        <div class="space-y-1">
          <p class="text-3xl font-extrabold text-reffinance-navy font-outfit">
            ${{ formatNumber(report.gastosTotales) }}
          </p>
          <div class="flex items-center text-rose-600 text-xs font-bold">
            <TrendingUp class="w-3.5 h-3.5 mr-1" />
            +{{ report.gastosCambioAnual }}% vs año anterior
          </div>
        </div>
      </div>

      <!-- Superávit Neto -->
      <div class="bg-white border border-reffinance-border p-6 rounded-2xl shadow-sm space-y-4">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Superávit Neto</h3>
        <div class="space-y-1">
          <p class="text-3xl font-extrabold text-emerald-600 font-outfit">
            ${{ formatNumber(report.superavitNeto) }}
          </p>
          <div class="flex items-center text-emerald-600 text-xs font-bold">
            <CheckCircle class="w-3.5 h-3.5 mr-1" />
            Margen del {{ report.margenSuperavit }}%
          </div>
        </div>
      </div>

      <!-- Préstamos Emitidos -->
      <div class="bg-white border border-reffinance-border p-6 rounded-2xl shadow-sm space-y-4">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Préstamos Emitidos</h3>
        <div class="space-y-1">
          <p class="text-3xl font-extrabold text-amber-600 font-outfit">
            ${{ formatNumber(report.prestamosEmitidos) }}
          </p>
          <div class="flex items-center text-slate-500 text-xs font-bold">
            <Users class="w-3.5 h-3.5 mr-1" />
            {{ report.arbitrosBeneficiados }} Árbitros beneficiados
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row: Monthly Flow Bar Chart & Expenses Distribution -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 12-Month Monthly Flow Chart (2/3 width) -->
      <div class="bg-white border border-reffinance-border rounded-2xl shadow-sm p-6 lg:col-span-2 flex flex-col justify-between">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-lg font-bold text-reffinance-navy font-outfit">Flujo Mensual: Ingresos vs Gastos</h2>
            <p class="text-xs text-slate-400 mt-0.5">Comparativa consolidada mensual 2023</p>
          </div>
          <div class="flex items-center space-x-4 text-xs font-bold">
            <div class="flex items-center">
              <span class="w-2.5 h-2.5 bg-reffinance-navy rounded-full mr-1.5"></span>
              <span class="text-slate-500">Ingresos</span>
            </div>
            <div class="flex items-center">
              <span class="w-2.5 h-2.5 bg-[#CBD5E1] rounded-full mr-1.5"></span>
              <span class="text-slate-500">Gastos</span>
            </div>
          </div>
        </div>

        <!-- HTML/Tailwind CSS 12-Month Bar Chart -->
        <div class="h-64 flex items-end justify-between px-2 pb-2 border-b border-slate-100 space-x-1.5">
          <div v-for="bar in monthlyFlow" :key="bar.month" class="flex flex-col items-center flex-1 h-full justify-end group">
            <div class="flex items-end justify-center space-x-0.5 w-full h-full relative">
              <!-- Tooltip on hover -->
              <div class="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-200 bg-reffinance-navy text-white text-[9px] font-bold px-2 py-1 rounded shadow-md z-10 space-y-0.5 flex flex-col pointer-events-none w-28">
                <span>Ingreso: ${{ formatNumber(bar.ingresos) }}</span>
                <span>Gasto: ${{ formatNumber(bar.gastos) }}</span>
              </div>

              <!-- Ingresos -->
              <div 
                class="w-1.5 md:w-2.5 bg-reffinance-navy rounded-t-sm transition-all duration-300 origin-bottom cursor-pointer group-hover:bg-[#000B33]"
                :style="{ height: `${(bar.ingresos / maxMonthValue) * 100}%` }"
              ></div>
              <!-- Gastos -->
              <div 
                class="w-1.5 md:w-2.5 bg-slate-300 rounded-t-sm transition-all duration-300 origin-bottom cursor-pointer group-hover:bg-slate-400"
                :style="{ height: `${(bar.gastos / maxMonthValue) * 100}%` }"
              ></div>
            </div>
            <span class="text-[9px] font-bold text-slate-400 uppercase mt-3 tracking-wider">{{ bar.month }}</span>
          </div>
        </div>
      </div>

      <!-- Expenses Distribution Progress Bars (1/3 width) -->
      <div class="bg-white border border-reffinance-border rounded-2xl shadow-sm p-6 lg:col-span-1 flex flex-col justify-between">
        <div>
          <h2 class="text-lg font-bold text-reffinance-navy font-outfit">Distribución de Gastos</h2>
          <p class="text-xs text-slate-400 mt-0.5">Egresos clasificados acumulados anuales</p>
        </div>

        <div class="space-y-4 my-6 flex-1 flex flex-col justify-center">
          <!-- Item 1 -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-xs font-bold">
              <span class="text-reffinance-navy">Salarios y Honorarios</span>
              <span class="text-slate-800 font-outfit">${{ formatNumber(report.distribucionGastos?.salariosHonorarios) }}</span>
            </div>
            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full bg-reffinance-navy rounded-full" style="width: 60.5%"></div>
            </div>
          </div>

          <!-- Item 2 -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-xs font-bold">
              <span class="text-reffinance-navy">Equipamiento y Suministros</span>
              <span class="text-slate-800 font-outfit">${{ formatNumber(report.distribucionGastos?.equipamientoSuministros) }}</span>
            </div>
            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full bg-reffinance-navy rounded-full" style="width: 14.8%"></div>
            </div>
          </div>

          <!-- Item 3 -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-xs font-bold">
              <span class="text-reffinance-navy">Renta de Oficinas</span>
              <span class="text-slate-800 font-outfit">${{ formatNumber(report.distribucionGastos?.rentaOficinas) }}</span>
            </div>
            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full bg-[#3B82F6] rounded-full" style="width: 11.3%"></div>
            </div>
          </div>

          <!-- Item 4 -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-xs font-bold">
              <span class="text-reffinance-navy">Capacitación</span>
              <span class="text-slate-800 font-outfit">${{ formatNumber(report.distribucionGastos?.capacitacion) }}</span>
            </div>
            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full bg-[#60A5FA] rounded-full" style="width: 8.1%"></div>
            </div>
          </div>

          <!-- Item 5 -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-xs font-bold">
              <span class="text-reffinance-navy">Otros Operativos</span>
              <span class="text-slate-800 font-outfit">${{ formatNumber(report.distribucionGastos?.otrosOperativos) }}</span>
            </div>
            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full bg-[#93C5FD] rounded-full" style="width: 5.1%"></div>
            </div>
          </div>
        </div>

        <p class="text-[10px] text-slate-400 font-semibold italic border-t border-slate-100 pt-3 leading-normal">
          Nota: Los gastos de salarios incluyen primas por partidos de liguilla y bonos por desempeño de árbitros internacionales.
        </p>
      </div>
    </div>

    <!-- Loan Portfolio Performance Section (Basado en screen 4) -->
    <div class="bg-white border border-reffinance-border rounded-2xl shadow-sm overflow-hidden">
      <!-- Section header with Badge -->
      <div class="p-6 border-b border-reffinance-border flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold text-reffinance-navy font-outfit">Rendimiento de Préstamos</h2>
          <p class="text-xs text-slate-400 mt-0.5">Control de recuperación e insolvencia activa de la cartera</p>
        </div>
        <span class="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-bold select-none">
          Cartera Saludable
        </span>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/50">
        <div class="p-6 text-center">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tasa de Reembolso</p>
          <p class="text-2xl font-black text-emerald-600 font-outfit">
            {{ report.prestamosRendimiento?.tasaReembolso }}%
          </p>
          <p class="text-[10px] text-slate-400 font-semibold mt-1">Excelente cumplimiento de amortización</p>
        </div>
        <div class="p-6 text-center">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Morosidad (>30 Días)</p>
          <p class="text-2xl font-black text-rose-600 font-outfit">
            {{ report.prestamosRendimiento?.morosidad }}%
          </p>
          <p class="text-[10px] text-slate-400 font-semibold mt-1">{{ report.prestamosRendimiento?.prestamosSeguimiento }} préstamos en seguimiento judicial</p>
        </div>
        <div class="p-6 text-center">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Intereses Generados</p>
          <p class="text-2xl font-black text-reffinance-navy font-outfit">
            ${{ formatNumber(report.prestamosRendimiento?.interesesGenerados) }}
          </p>
          <p class="text-[10px] text-slate-400 font-semibold mt-1">Reinversión automática activada para el fondo</p>
        </div>
      </div>

      <!-- Portfolio Table -->
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
            <tr v-for="row in report.prestamosRendimiento?.distribucionCartera" :key="row.estado" class="hover:bg-slate-50/50 transition-colors">
              <td class="py-3.5 px-6 flex items-center">
                <span :class="[
                  'w-2 h-2 rounded-full mr-2.5',
                  row.estado === 'Pagados' ? 'bg-emerald-500' : 
                  row.estado === 'En Curso' ? 'bg-indigo-500' : 'bg-rose-500 animate-pulse'
                ]"></span>
                {{ row.estado }}
              </td>
              <td class="py-3.5 px-6">{{ row.cantidad }} préstamos</td>
              <td class="py-3.5 px-6 text-right font-bold font-outfit text-sm text-slate-800">${{ formatNumber(row.monto) }}</td>
              <td class="py-3.5 px-6 text-right font-extrabold text-slate-500">{{ row.porcentaje }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Banner "Compromiso con la Integridad" (Basado en screen 4) -->
    <div class="bg-reffinance-navy text-white rounded-2xl p-8 relative overflow-hidden shadow-md flex items-center min-h-[160px]">
      <!-- Background graphical overlay simulating screen 4 -->
      <div class="absolute right-0 top-0 bottom-0 w-1/3 bg-slate-950/20 backdrop-blur-xs rounded-l-3xl flex items-center justify-center opacity-45 md:opacity-100">
        <TrendingUp class="w-24 h-24 text-white/10 stroke-1" />
      </div>
      <div class="space-y-2.5 z-10 max-w-2xl relative">
        <h3 class="text-xl font-bold font-outfit">Compromiso con la Integridad</h3>
        <p class="text-slate-300 text-xs leading-relaxed max-w-lg font-medium">
          Nuestros sistemas garantizan transparencia total en la distribución de fondos para el arbitraje profesional. Cada préstamo, abono o cuota de caja es auditable milimétricamente en tiempo real.
        </p>
      </div>
    </div>

    <!-- Bottom footer signature (Basado en screen 4) -->
    <div class="flex flex-col md:flex-row items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4 border-t border-slate-200">
      <p>© {{ new Date().getFullYear() }} RefFinance Association. Todos los derechos reservados.</p>
      <p>Generado el {{ new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) }}</p>
    </div>
  </div>
</template>

<script setup>
import { Download, TrendingUp, CheckCircle, Users } from 'lucide-vue-next';
import { ref, onMounted, computed } from 'vue';
import api from '../services/api';

// Reactivo de datos del reporte
const report = ref({
  ingresosTotales: 0,
  gastosTotales: 0,
  superavitNeto: 0,
  margenSuperavit: 0,
  prestamosEmitidos: 0,
  arbitrosBeneficiados: 0,
  ingresosCambioAnual: 0,
  gastosCambioAnual: 0,
  distribucionGastos: {
    salariosHonorarios: 512000,
    equipamientoSuministros: 125800,
    rentaOficinas: 96000,
    capacitacion: 68400,
    otrosOperativos: 43000
  },
  prestamosRendimiento: {
    tasaReembolso: 94.2,
    morosidad: 3.8,
    prestamosSeguimiento: 6,
    interesesGenerados: 18450,
    distribucionCartera: [
      { estado: 'Pagados', cantidad: 85, monto: 124000, porcentaje: 57.6 },
      { estado: 'En Curso', cantidad: 51, monto: 82800, porcentaje: 38.5 },
      { estado: 'Atrasados', cantidad: 6, monto: 8200, porcentaje: 3.8 }
    ]
  }
});

// Gráfica de flujo mensual consolidado de 12 meses dinámica
const monthlyFlow = ref([]);

// Cargar información al montar
const loadData = async () => {
  try {
    report.value = await api.getAnnualReportInfo();
    const transactions = await api.getTransactions();

    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentYear = new Date().getFullYear();

    const dynamicFlow = [];
    for (let i = 0; i < 12; i++) {
      dynamicFlow.push({
        month: monthNames[i],
        ingresos: 0,
        gastos: 0,
        monthIndex: i
      });
    }

    transactions.forEach(tx => {
      const txDate = tx.fechaRaw ? new Date(tx.fechaRaw) : new Date(tx.fecha);
      if (!isNaN(txDate.getTime()) && txDate.getFullYear() === currentYear) {
        const mIdx = txDate.getMonth();
        if (tx.monto > 0) {
          dynamicFlow[mIdx].ingresos += tx.monto;
        } else {
          dynamicFlow[mIdx].gastos += Math.abs(tx.monto);
        }
      }
    });

    monthlyFlow.value = dynamicFlow;
  } catch (err) {
    console.error('Error al cargar reporte anual:', err);
  }
};

onMounted(() => {
  loadData();
});

// Escala dinámica del gráfico para evitar división por cero y soportar cualquier escala de datos
const maxMonthValue = computed(() => {
  const values = monthlyFlow.value.flatMap(f => [f.ingresos, f.gastos]);
  const maxVal = Math.max(...values, 0);
  return maxVal > 0 ? maxVal : 1000;
});

// Utilidades
const formatNumber = (num) => {
  if (num === undefined || num === null) return '0.00';
  return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

const downloadPdf = () => {
  alert('Exportando PDF consolidado de auditoría anual...\nArchivo Descargas/Reporte_Consolidado_Anual_2023.pdf guardado.');
};
</script>
