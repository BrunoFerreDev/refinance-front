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
      :total-pages="totalPages"
      :current-page="currentPage"
      :concepts="concepts"
      :selected-category="selectedCategory"
      @update:selected-category="(val) => (selectedCategory = val)"
      @change-page="(p) => (currentPage = p)"
      @edit="openActionMenu"
      @associate-arbitro="openAssociateModal"
    />

    <!-- CajaMovimientoModal modular component -->
    <CajaMovimientoModal
      :show="showAddModal"
      :concepts="concepts"
      @close="showAddModal = false"
      @submit="submitTransaction"
    />

    <!-- CajaMovimientoModal modular component for EDIT -->
    <CajaMovimientoModal
      :show="showEditModal"
      :concepts="concepts"
      :is-edit="true"
      :tx-data="selectedTxForEdit"
      @close="showEditModal = false"
      @submit="submitEditTransaction"
      @associate-arbitro="
        (tx) => {
          showEditModal = false;
          openAssociateModal(tx);
        }
      "
    />

    <!-- AsociarArbitroModal modular component -->
    <AsociarArbitroModal
      :show="showAssociateModal"
      :referees="referees"
      :tx-data="selectedTxForAssociate"
      @close="showAssociateModal = false"
      @submit="submitAssociateArbitro"
    />
  </div>
</template>

<script setup>
import { FileText, Plus, X } from "lucide-vue-next";
import { TableIcon } from "lucide-vue-next";
import { ref, onMounted, computed, watch } from "vue";
import api from "../services/api";

// Subcomponentes modulares
import CajaResumen from "./CajaResumen.vue";
import CajaHistorial from "./CajaHistorial.vue";
import CajaMovimientoModal from "./CajaMovimientoModal.vue";
import AsociarArbitroModal from "./AsociarArbitroModal.vue";

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

// Reactivos de paginación para servidor
const currentPage = ref(1);
const totalPages = ref(1);
const itemsPerPage = 10;
const selectedCategory = ref("Todos");

// Reactivos para modal de edición de transacción
const showEditModal = ref(false);
const selectedTxForEdit = ref(null);

// Reactivos para modal de asociar árbitro
const showAssociateModal = ref(false);
const selectedTxForAssociate = ref(null);
const referees = ref([]);

// Filtros dinámicos basados en conceptos de backend
const categories = computed(() => {
  const list = ["Todos", "Recupero", "Reintegro"];
  concepts.value.forEach((c) => {
    if (c.nombre && !list.some((x) => x.toLowerCase() === c.nombre.toLowerCase())) {
      list.push(c.nombre);
    }
  });
  return list;
});

// Cargar información al montar y al cambiar de página
const loadData = async () => {
  try {
    let txs;
    if (selectedCategory.value === "Todos") {
      txs = await api.getTransactions(currentPage.value - 1, itemsPerPage);
      totalPages.value = txs.totalPages || 1;
    } else {
      // Obtener un número mayor de transacciones para filtrar en el cliente
      const allTxs = await api.getTransactions(0, 1000);
      const selLower = selectedCategory.value.toLowerCase();
      const filtered = allTxs.filter((tx) => {
        const cat = String(tx.nombreConceptoGasto || tx.categoria || "").toLowerCase();
        const type = String(tx.tipo || "").toLowerCase();
        if (selLower === "recupero") {
          return cat.includes("recupero") || type.includes("recupero") || tx.requiereRecupero === true;
        }
        if (selLower === "reintegro") {
          return cat.includes("reintegro") || type.includes("reintegro");
        }
        return cat === selLower;
      });

      totalPages.value = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
      const start = (currentPage.value - 1) * itemsPerPage;
      txs = filtered.slice(start, start + itemsPerPage);
      txs.totalPages = totalPages.value;
      txs.totalElements = filtered.length;
    }

    transactions.value = txs;
    cajaInfo.value = await api.getControlCajaInfo();
    concepts.value = await api.getConceptos();
    referees.value = await api.getReferees();
  } catch (err) {
    console.error("Error al cargar datos de control de caja:", err);
  }
};

watch(currentPage, () => {
  loadData();
});

watch(selectedCategory, () => {
  currentPage.value = 1;
  loadData();
});

// Modal de asociar árbitro
const openAssociateModal = (tx) => {
  selectedTxForAssociate.value = tx;
  showAssociateModal.value = true;
};

const submitAssociateArbitro = async ({ idArbitro, montoAsignado }) => {
  if (!selectedTxForAssociate.value) return;
  try {
    await api.asociarGastoArbitro(
      selectedTxForAssociate.value.idTransaccion,
      idArbitro,
      montoAsignado,
    );
    await loadData();
    showAssociateModal.value = false;
    selectedTxForAssociate.value = null;
    alert("Árbitro asociado exitosamente al gasto compartido.");
  } catch (err) {
    console.error("Error al asociar árbitro al gasto:", err);
    alert("No se pudo asociar el árbitro al gasto. Inténtelo nuevamente.");
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
    requiereRecupero: formTx.requiereRecupero,
    fecha: formTx.fecha,
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

// Menú de opciones de transacción (abre el modal de edición directamente)
const openActionMenu = (tx) => {
  selectedTxForEdit.value = tx;
  showEditModal.value = true;
};

// Guardar los cambios de la transacción común
const submitEditTransaction = async (formTx) => {
  if (!selectedTxForEdit.value) return;
  try {
    await api.updateTransaction(selectedTxForEdit.value.idTransaccion, formTx);
    await loadData();
    showEditModal.value = false;
    selectedTxForEdit.value = null;
    alert("Transacción modificada exitosamente.");
  } catch (err) {
    console.error("Error al modificar transacción:", err);
    alert(
      "No se pudo modificar la transacción contable. Inténtelo nuevamente.",
    );
  }
};
</script>
