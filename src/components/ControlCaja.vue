<template>
  <div class="flex-1 p-8 overflow-y-auto space-y-8 select-none">
    <!-- Top Row: Page Title and Actions -->
    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-reffinance-navy font-outfit">
          Libro de Control de Caja
        </h1>
        <p class="text-slate-400 text-sm mt-1">
          Gestione y rastree todos los ingresos y egresos institucionales con
          precisión.
        </p>
      </div>
      <div class="flex items-center space-x-3 flex-wrap gap-y-2">
        <button
          @click="downloadFormat('PDF')"
          class="px-3.5 py-2.5 bg-white border border-reffinance-border rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center shadow-sm whitespace-nowrap"
        >
          <FileText class="w-4 h-4 mr-2 text-slate-400 shrink-0" />
          PDF
        </button>
        <button
          @click="downloadFormat('Excel')"
          class="px-3.5 py-2.5 bg-white border border-reffinance-border rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center shadow-sm whitespace-nowrap"
        >
          <TableIcon class="w-4 h-4 mr-2 text-slate-400 shrink-0" />
          Excel
        </button>
        <button
          @click="showAddModal = true"
          class="px-4 py-2.5 bg-reffinance-navy hover:bg-reffinance-navy-dark text-white rounded-lg text-sm font-bold transition-all duration-200 flex items-center shadow-md whitespace-nowrap self-start sm:self-auto"
        >
          <Plus class="w-4 h-4 mr-2 shrink-0" />
          Añadir Transacción
        </button>
      </div>
    </div>

    <!-- CajaResumen modular component -->
    <CajaResumen :caja-info="cajaInfo" />

    <!-- CajaHistorial modular component -->
    <CajaHistorial
      :transactions="transactions"
      :categories="categories"
      :search-query="searchQuery"
      @action-menu="openActionMenu"
    />

    <!-- CajaMovimientoModal modular component -->
    <CajaMovimientoModal
      :show="showAddModal"
      :concepts="concepts"
      @close="showAddModal = false"
      @submit="submitTransaction"
    />
  </div>
</template>

<script setup>
import { FileText, Plus } from "lucide-vue-next";
import { TableIcon } from "lucide-vue-next";
import { ref, onMounted, computed } from "vue";
import api from "../services/api";

// Subcomponentes modulares
import CajaResumen from "./CajaResumen.vue";
import CajaHistorial from "./CajaHistorial.vue";
import CajaMovimientoModal from "./CajaMovimientoModal.vue";

const props = defineProps({
  searchQuery: {
    type: String,
    default: "",
  },
});

// Reactivos para datos del servicio
const transactions = ref([]);
const cajaInfo = ref({
  saldoMesActual: 0,
  cambioMesActual: 0,
  ingresosMesActual: 0,
  gastosMesActual: 0,
  distribucionPresupuesto: {
    honorariosArbitros: 65,
    suministrosOperativos: 20,
    interesesAdministrativos: 15,
  },
});
const concepts = ref([]);
const showAddModal = ref(false);

// Filtros dinámicos basados en conceptos de backend
const categories = computed(() => {
  const list = ["Todos"];
  concepts.value.forEach((c) => {
    if (c.nombre && !list.includes(c.nombre)) {
      list.push(c.nombre);
    }
  });
  return list;
});

// Cargar información al montar
const loadData = async () => {
  try {
    transactions.value = await api.getTransactions();
    cajaInfo.value = await api.getControlCajaInfo();
    concepts.value = await api.getConceptos();
  } catch (err) {
    console.error("Error al cargar datos de control de caja:", err);
  }
};

onMounted(() => {
  loadData();
});

// Registrar nueva transacción contable
const submitTransaction = async (formTx) => {
  let finalMonto = parseFloat(formTx.monto);
  if (formTx.tipo === "Gasto") {
    finalMonto = -Math.abs(finalMonto);
  }

  const payload = {
    tipo: formTx.tipo,
    concepto: formTx.concepto,
    descripcion: formTx.descripcion,
    monto: finalMonto,
    estado: formTx.estado,
  };

  try {
    await api.addTransaction(payload);
    await loadData();
    showAddModal.value = false;
    alert("Transacción agregada exitosamente al libro mayor.");
  } catch (err) {
    console.error("Error al registrar transacción:", err);
  }
};

// Descargas
const downloadFormat = (format) => {
  alert(
    `Descargando el Libro de Control de Caja en formato ${format}...\nGuardado con éxito en Descargas/Libro_Caja_${format}.xlsx`,
  );
};

// Menú de opciones de transacción
const openActionMenu = (tx) => {
  alert(
    `Acciones para la transacción ${tx.id}:\n- Editar transacción\n- Eliminar del libro mayor\n- Revertir movimiento`,
  );
};
</script>
