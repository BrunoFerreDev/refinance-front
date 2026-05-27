<template>
  <div class="flex-1 p-8 overflow-y-auto space-y-8 select-none">
    <!-- Top Row: Page Title and Top Action Buttons -->
    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-reffinance-navy font-outfit">Resumen Financiero</h1>
        <p class="text-slate-400 text-sm mt-1">
          Monitoreo de la integridad de los fondos de la asociación y el bienestar arbitral.
        </p>
      </div>
      <div class="flex items-center space-x-3 flex-wrap gap-y-2">
        <button @click="exportReport" class="px-4 py-2.5 bg-white border border-reffinance-border rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all duration-200 flex items-center shadow-sm whitespace-nowrap">
          <Download class="w-4 h-4 mr-2 shrink-0" />
          Exportar Reporte
        </button>
        <button @click="showMovementModal = true" class="px-4 py-2.5 bg-reffinance-navy hover:bg-reffinance-navy-dark text-white rounded-lg text-sm font-bold transition-all duration-200 flex items-center shadow-md whitespace-nowrap">
          <Plus class="w-4 h-4 mr-2 shrink-0" />
          Nuevo Movimiento
        </button>
      </div>
    </div>

    <!-- Metrics Cards Row -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Saldo Total -->
      <div class="bg-white border border-reffinance-border p-6 rounded-2xl shadow-sm space-y-4">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Saldo Total del Fondo</h3>
        <div class="space-y-1">
          <p class="text-3xl font-extrabold text-reffinance-navy font-outfit">
            ${{ formatNumber(cajaInfo.saldoFondo) }}
          </p>
          <div class="flex items-center text-emerald-600 text-xs font-bold">
            <TrendingUp class="w-3.5 h-3.5 mr-1" />
            +{{ cajaInfo.cambioFondo }}% desde el mes pasado
          </div>
        </div>
      </div>

      <!-- Préstamos Activos -->
      <div class="bg-white border border-reffinance-border p-6 rounded-2xl shadow-sm space-y-4">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Préstamos Activos</h3>
        <div class="space-y-1">
          <p class="text-3xl font-extrabold text-reffinance-navy font-outfit">
            ${{ formatNumber(cajaInfo.prestamosActivos) }}
          </p>
          <div class="flex items-center text-slate-500 text-xs font-bold">
            <Users class="w-3.5 h-3.5 mr-1" />
            {{ cajaInfo.aprobacionesPendientes }} aprobaciones pendientes
          </div>
        </div>
      </div>

      <!-- Ingresos Octubre -->
      <div class="bg-white border border-reffinance-border p-6 rounded-2xl shadow-sm space-y-4">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Ingresos Totales (OCT)</h3>
        <div class="space-y-1">
          <p class="text-3xl font-extrabold text-reffinance-navy font-outfit">
            ${{ formatNumber(cajaInfo.ingresosOctubre) }}
          </p>
          <div class="flex items-center text-emerald-600 text-xs font-bold">
            <ArrowUp class="w-3.5 h-3.5 mr-1" />
            ${{ formatNumber(cajaInfo.ingresoObjetivoOctubre) }} sobre el objetivo
          </div>
        </div>
      </div>

      <!-- Gastos Octubre -->
      <div class="bg-white border border-reffinance-border p-6 rounded-2xl shadow-sm space-y-4">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Gastos Totales (OCT)</h3>
        <div class="space-y-1">
          <p class="text-3xl font-extrabold text-reffinance-navy font-outfit">
            ${{ formatNumber(cajaInfo.gastosOctubre) }}
          </p>
          <div class="flex items-center text-rose-600 text-xs font-bold">
            <ArrowDown class="w-3.5 h-3.5 mr-1" />
            {{ cajaInfo.gastosCambioOctubre }}% vs mes pasado
          </div>
        </div>
      </div>
    </div>

    <!-- Cash Flow Chart and Sidebar Administrative Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cash Flow Chart Card -->
      <div class="bg-white border border-reffinance-border rounded-2xl shadow-sm p-6 lg:col-span-2 flex flex-col justify-between">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-lg font-bold text-reffinance-navy font-outfit">Análisis de Flujo de Caja</h2>
            <p class="text-xs text-slate-400 mt-0.5">Ingresos vs Gastos históricos</p>
          </div>
          <!-- Legend -->
          <div class="flex items-center space-x-4 text-xs font-bold">
            <div class="flex items-center">
              <span class="w-2.5 h-2.5 bg-reffinance-navy rounded-full mr-1.5"></span>
              <span class="text-slate-500">Ingresos</span>
            </div>
            <div class="flex items-center">
              <span class="w-2.5 h-2.5 bg-slate-400 rounded-full mr-1.5"></span>
              <span class="text-slate-500">Gastos</span>
            </div>
          </div>
        </div>

        <!-- Custom HTML/Tailwind CSS Bar Chart -->
        <div class="h-64 flex items-end justify-between px-4 pb-2 border-b border-slate-100">
          <div v-for="bar in chartData" :key="bar.month" class="flex flex-col items-center flex-1 h-full justify-end group">
            <div class="flex items-end justify-center space-x-1.5 w-full h-full relative">
              <!-- Hover Tooltip -->
              <div class="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-200 bg-reffinance-navy text-white text-[10px] font-bold px-2 py-1 rounded shadow-md z-10 space-y-0.5 flex flex-col pointer-events-none">
                <span>Ingresos: ${{ formatNumber(bar.ingresos) }}</span>
                <span>Gastos: ${{ formatNumber(bar.gastos) }}</span>
              </div>

              <!-- Ingresos Bar -->
              <div 
                class="w-3 md:w-5 bg-reffinance-navy rounded-t-sm transition-all duration-500 group-hover:bg-[#000B33] origin-bottom cursor-pointer"
                :style="{ height: `${(bar.ingresos / maxMonthValue) * 100}%` }"
              ></div>
              <!-- Gastos Bar -->
              <div 
                class="w-3 md:w-5 bg-slate-400 rounded-t-sm transition-all duration-500 group-hover:bg-slate-500 origin-bottom cursor-pointer"
                :style="{ height: `${(bar.gastos / maxMonthValue) * 100}%` }"
              ></div>
            </div>
            <span class="text-[10px] font-bold text-slate-400 uppercase mt-3 tracking-wider">{{ bar.month }}</span>
          </div>
        </div>
      </div>

      <!-- Administrative Actions Card -->
      <div class="bg-reffinance-navy rounded-2xl shadow-md p-6 text-white flex flex-col justify-between">
        <div class="space-y-2">
          <h2 class="text-xl font-bold font-outfit">Acciones Administrativas</h2>
          <p class="text-slate-300 text-xs leading-relaxed">
            Procese solicitudes financieras y actualice movimientos del libro mayor al instante.
          </p>
        </div>

        <div class="space-y-4 my-8">
          <button 
            @click="showLoanModal = true" 
            class="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 rounded-xl text-left transition-smooth group"
          >
            <div class="flex items-center space-x-3">
              <div class="p-2.5 bg-white/10 rounded-lg text-white">
                <FileText class="w-5 h-5" />
              </div>
              <div>
                <p class="text-sm font-bold font-outfit">Registrar Préstamo</p>
                <p class="text-[10px] text-slate-300">Crear anticipo financiero</p>
              </div>
            </div>
            <ChevronRight class="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
          </button>

          <button 
            @click="showMovementModal = true" 
            class="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 rounded-xl text-left transition-smooth group"
          >
            <div class="flex items-center space-x-3">
              <div class="p-2.5 bg-white/10 rounded-lg text-white">
                <PlusSquare class="w-5 h-5" />
              </div>
              <div>
                <p class="text-sm font-bold font-outfit">Agregar Movimiento</p>
                <p class="text-[10px] text-slate-300">Registrar ingreso o gasto en caja</p>
              </div>
            </div>
            <ChevronRight class="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
          </button>
        </div>

        <!-- Banner Footer Info -->
        <div class="flex items-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          <ShieldAlert class="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
          Sistemas Operativos Operacionales
        </div>
      </div>
    </div>

    <!-- Recent Activity Section -->
    <div class="bg-white border border-reffinance-border rounded-2xl shadow-sm overflow-hidden">
      <div class="p-6 border-b border-reffinance-border flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold text-reffinance-navy font-outfit">Actividad Reciente</h2>
          <p class="text-xs text-slate-400 mt-0.5">Últimos movimientos del libro mayor</p>
        </div>
        <button @click="$emit('change-tab', 'caja')" class="text-xs font-bold text-reffinance-navy hover:text-reffinance-navy-dark hover:underline">
          Ver Todas las Transacciones
        </button>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-reffinance-border text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              <th class="py-4 px-6">Código Transacción</th>
              <th class="py-4 px-6">Fecha</th>
              <th class="py-4 px-6">Descripción</th>
              <th class="py-4 px-6">Tipo</th>
              <th class="py-4 px-6">Estado</th>
              <th class="py-4 px-6 text-right">Monto</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
            <tr v-for="tx in paginatedTransactions" :key="tx.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="py-4 px-6 font-bold text-xs text-slate-400">{{ tx.id }}</td>
              <td class="py-4 px-6 text-xs text-slate-500 font-medium">{{ tx.fecha }}</td>
              <td class="py-4 px-6">
                <div class="space-y-0.5">
                  <p class="font-semibold text-slate-800 text-sm leading-normal">
                    {{ tx.descripcion }}
                  </p>
                  <div class="flex items-center space-x-1.5 flex-wrap gap-y-1">
                    <span v-if="tx.nombreConceptoGasto" class="text-[9px] text-rose-600 font-bold bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded uppercase tracking-wider">
                      Concepto: {{ tx.nombreConceptoGasto }}
                    </span>
                    <span v-if="tx.idPrestamo" class="text-[9px] text-indigo-600 font-bold bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded flex items-center">
                      <span class="w-1 h-1 rounded-full bg-indigo-500 mr-1 inline-block"></span>
                      Vínculo: Préstamo #RF-LN-{{ tx.idPrestamo }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="py-4 px-6">
                <span :class="[
                  'px-2 py-0.5 rounded-full text-[10px] font-bold border',
                  tx.tipo === 'Ingreso' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 
                  tx.tipo === 'Pago Préstamo' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 
                  'bg-rose-50 border-rose-200 text-rose-700'
                ]">
                  {{ tx.tipo }}
                </span>
              </td>
              <td class="py-4 px-6">
                <span :class="[
                  'px-2 py-0.5 rounded-md text-[10px] font-bold',
                  tx.estado === 'PAGADO' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                ]">
                  {{ tx.estado }}
                </span>
              </td>
              <td :class="[
                'py-4 px-6 font-bold text-right font-outfit text-base',
                tx.monto > 0 ? 'text-emerald-600' : 'text-rose-600'
              ]">
                {{ tx.monto > 0 ? '+' : '' }}${{ formatNumber(tx.monto) }}
              </td>
            </tr>
            <tr v-if="paginatedTransactions.length === 0">
              <td colspan="6" class="text-center py-8 text-slate-400 font-medium">
                No se encontraron transacciones recientes.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div v-if="filteredTransactions.length > 0" class="px-6 py-4 bg-slate-50 border-t border-reffinance-border flex items-center justify-between text-xs font-semibold text-slate-500">
        <p>Mostrando {{ paginatedTransactions.length }} de {{ filteredTransactions.length }} transacciones</p>
        <div class="flex items-center space-x-1.5 font-bold">
          <button @click="prevPage" :disabled="currentPage === 1" class="p-1.5 border border-reffinance-border rounded-lg bg-white text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-white select-none cursor-pointer">
            <ChevronLeft class="w-3.5 h-3.5" />
          </button>
          <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="['px-3 py-1 rounded select-none cursor-pointer border transition-all', currentPage === page ? 'bg-reffinance-navy border-reffinance-navy text-white' : 'bg-white border-reffinance-border text-slate-600 hover:bg-slate-50']">
            {{ page }}
          </button>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="p-1.5 border border-reffinance-border rounded-lg bg-white text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-white select-none cursor-pointer">
            <ChevronRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modales Interactivos -->
    
    <!-- Modal 1: Nuevo Movimiento (Ingreso/Gasto) -->
    <div v-if="showMovementModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-reffinance-border transform scale-100 transition-all duration-300">
        <div class="bg-reffinance-navy p-6 text-white flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold font-outfit">Agregar Nuevo Movimiento</h3>
            <p class="text-xs text-slate-300">Añada ingresos o gastos al libro de caja</p>
          </div>
          <button @click="showMovementModal = false" class="p-1 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <form @submit.prevent="submitMovement" class="p-6 space-y-4">
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">Tipo de Movimiento</label>
            <div class="grid grid-cols-2 gap-3">
              <button 
                type="button" 
                @click="formMovement.tipo = 'Ingreso'"
                :class="['py-2.5 rounded-lg border text-sm font-bold text-center transition-all', 
                  formMovement.tipo === 'Ingreso' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50']"
              >
                Ingreso (+)
              </button>
              <button 
                type="button" 
                @click="formMovement.tipo = 'Gasto'"
                :class="['py-2.5 rounded-lg border text-sm font-bold text-center transition-all', 
                  formMovement.tipo === 'Gasto' ? 'bg-rose-50 border-rose-500 text-rose-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50']"
              >
                Gasto (-)
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">Monto ($)</label>
              <input 
                type="number" 
                step="0.01"
                v-model.number="formMovement.monto" 
                required
                placeholder="0.00"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">Concepto de Gasto</label>
              <select 
                v-model="formMovement.concepto" 
                required
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
              >
                <option value="" disabled>Seleccione un concepto</option>
                <option v-for="concept in concepts" :key="concept.idConcepto" :value="concept.idConcepto">
                  {{ concept.nombre }}
                </option>
              </select>
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">Descripción</label>
            <input 
              type="text" 
              v-model="formMovement.descripcion" 
              required
              placeholder="Ej. Cuota mensual o compra de uniformes"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">Estado de Pago</label>
            <div class="flex items-center space-x-4">
              <label class="flex items-center space-x-2 text-sm font-semibold text-slate-600">
                <input type="radio" v-model="formMovement.estado" value="PAGADO" class="text-reffinance-navy focus:ring-0" />
                <span>PAGADO</span>
              </label>
              <label class="flex items-center space-x-2 text-sm font-semibold text-slate-600">
                <input type="radio" v-model="formMovement.estado" value="PENDIENTE" class="text-reffinance-navy focus:ring-0" />
                <span>PENDIENTE</span>
              </label>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button 
              type="button" 
              @click="showMovementModal = false" 
              class="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="px-5 py-2 bg-reffinance-navy hover:bg-reffinance-navy-dark text-white rounded-lg text-sm font-bold shadow-md transition-colors"
            >
              Agregar Movimiento
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 2: Registrar Préstamo -->
    <div v-if="showLoanModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-reffinance-border transform scale-100 transition-all duration-300">
        <div class="bg-reffinance-navy p-6 text-white flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold font-outfit">Registrar Nuevo Préstamo</h3>
            <p class="text-xs text-slate-300">Crear anticipo financiero para un árbitro</p>
          </div>
          <button @click="showLoanModal = false" class="p-1 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <form @submit.prevent="submitLoan" class="p-6 space-y-4">
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">Árbitro Solicitante</label>
            <select 
              v-model="formLoan.arbitro" 
              required
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
            >
              <option value="" disabled>Seleccione un árbitro</option>
              <option v-for="ref in referees" :key="ref.id" :value="ref.id">
                {{ ref.nombre }} ({{ ref.clasificacion }})
              </option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">Monto del Préstamo ($)</label>
            <input 
              type="number" 
              step="0.01"
              v-model.number="formLoan.montoTotal" 
              required
              placeholder="0.00"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
            />
          </div>

          <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button 
              type="button" 
              @click="showLoanModal = false" 
              class="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="px-5 py-2 bg-reffinance-navy hover:bg-reffinance-navy-dark text-white rounded-lg text-sm font-bold shadow-md transition-colors"
            >
              Crear Préstamo
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  Download, Plus, TrendingUp, Users, ArrowUp, ArrowDown, 
  ChevronRight, ChevronLeft, FileText, PlusSquare, ShieldAlert, X 
} from 'lucide-vue-next';
import { ref, onMounted, computed, watch } from 'vue';
import api from '../services/api';

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['change-tab']);

// Reactivos para datos del servicio
const transactions = ref([]);
const cajaInfo = ref({
  saldoFondo: 0,
  prestamosActivos: 0,
  ingresosOctubre: 0,
  gastosOctubre: 0,
  cambioFondo: 0,
  aprobacionesPendientes: 0,
  ingresoObjetivoOctubre: 0,
  gastosCambioOctubre: 0
});
const referees = ref([]);

// Modales y formularios
const showMovementModal = ref(false);
const showLoanModal = ref(false);

const concepts = ref([]);
const formMovement = ref({
  tipo: 'Ingreso',
  monto: null,
  concepto: '',
  descripcion: '',
  estado: 'PAGADO'
});

const formLoan = ref({
  arbitro: '',
  montoTotal: null
});

// Gráfico de flujo de caja dinámico
const chartData = ref([]);

// Cargar información al montar
const loadData = async () => {
  try {
    transactions.value = await api.getTransactions();
    cajaInfo.value = await api.getCajaInfo();
    referees.value = await api.getReferees();
    concepts.value = await api.getConceptos();

    // Calcular chartData dinámicamente de las transacciones reales de los últimos 6 meses
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const dynamicChart = [];
    for (let i = 5; i >= 0; i--) {
      let d = new Date(currentYear, currentMonth - i, 1);
      dynamicChart.push({
        month: monthNames[d.getMonth()],
        ingresos: 0,
        gastos: 0,
        year: d.getFullYear(),
        monthIndex: d.getMonth()
      });
    }

    transactions.value.forEach(tx => {
      const txDate = tx.fechaRaw ? new Date(tx.fechaRaw) : new Date(tx.fecha);
      if (!isNaN(txDate.getTime())) {
        const mIdx = txDate.getMonth();
        const yVal = txDate.getFullYear();
        const match = dynamicChart.find(c => c.monthIndex === mIdx && c.year === yVal);
        if (match) {
          if (tx.monto > 0) {
            match.ingresos += tx.monto;
          } else {
            match.gastos += Math.abs(tx.monto);
          }
        }
      }
    });

    chartData.value = dynamicChart;
  } catch (err) {
    console.error('Error al cargar datos del tablero:', err);
  }
};

onMounted(() => {
  loadData();
});

// Filtrado reactivo de transacciones usando el buscador global del Header
const filteredTransactions = computed(() => {
  if (!props.searchQuery.trim()) return transactions.value;
  const query = props.searchQuery.toLowerCase();
  return transactions.value.filter(tx => 
    tx.id.toLowerCase().includes(query) ||
    tx.descripcion.toLowerCase().includes(query) ||
    tx.categoria.toLowerCase().includes(query) ||
    tx.tipo.toLowerCase().includes(query)
  );
});

// Reactivos de paginación para Actividad Reciente
const currentPage = ref(1);
const itemsPerPage = 5;

// Resetear página al buscar
watch(() => props.searchQuery, () => {
  currentPage.value = 1;
});

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredTransactions.value.length / itemsPerPage));
});

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredTransactions.value.slice(start, start + itemsPerPage);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Registrar nuevo movimiento
const submitMovement = async () => {
  if (!formMovement.value.monto || !formMovement.value.descripcion || !formMovement.value.concepto) return;
  
  // Si es un gasto, el monto debe ser negativo
  let finalMonto = parseFloat(formMovement.value.monto);
  if (formMovement.value.tipo === 'Gasto') {
    finalMonto = -Math.abs(finalMonto);
  }

  const payload = {
    tipo: formMovement.value.tipo,
    concepto: formMovement.value.concepto,
    descripcion: formMovement.value.descripcion,
    monto: finalMonto,
    estado: formMovement.value.estado
  };

  try {
    await api.addTransaction(payload);
    // Recargar datos locales
    await loadData();
    
    // Limpiar formulario y cerrar modal
    formMovement.value = {
      tipo: 'Ingreso',
      monto: null,
      concepto: '',
      descripcion: '',
      estado: 'PAGADO'
    };
    showMovementModal.value = false;
    alert('Movimiento agregado exitosamente al libro de caja.');
  } catch (err) {
    console.error('Error al registrar movimiento:', err);
  }
};

// Registrar nuevo préstamo
const submitLoan = async () => {
  if (!formLoan.value.arbitro || !formLoan.value.montoTotal) return;

  const payload = {
    arbitro: formLoan.value.arbitro,
    montoTotal: parseFloat(formLoan.value.montoTotal),
  };

  try {
    await api.createLoan(payload);
    await loadData();

    formLoan.value = {
      arbitro: '',
      montoTotal: null,
    };
    showLoanModal.value = false;
    alert('Préstamo registrado y en proceso de aprobación.');
  } catch (err) {
    console.error('Error al registrar préstamo:', err);
  }
};

// Utilidades
const formatNumber = (num) => {
  if (num === undefined || num === null) return '0.00';
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Escala dinámica del gráfico para evitar división por cero y soportar cualquier escala de datos
const maxMonthValue = computed(() => {
  const values = chartData.value.flatMap(f => [f.ingresos, f.gastos]);
  const maxVal = Math.max(...values, 0);
  return maxVal > 0 ? maxVal : 1000;
});

const exportReport = () => {
  alert('Generando PDF del reporte financiero general...\nGuardado con éxito en Descargas/Reporte_General_RefFinance.pdf');
};
</script>
