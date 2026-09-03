<template>
  <div
    class="flex-1 flex flex-col md:flex-row h-full overflow-hidden select-none bg-[#F4F6FA]"
  >
    <!-- LEFT PANEL: Canchas Directory -->
    <div
      :class="[
        'w-full h-full bg-white border-r border-reffinance-border flex flex-col shrink-0 transition-all duration-300',
        selectedCancha ? 'hidden md:flex' : 'flex',
        isSidebarCollapsed ? 'md:w-20' : 'md:w-80'
      ]"
    >
      <!-- Search Input Info inside List -->
      <div
        :class="['p-4 border-b border-reffinance-border bg-slate-50/50', isSidebarCollapsed ? '' : 'space-y-3']"
      >
        <div class="flex items-center justify-between">
          <div v-if="!isSidebarCollapsed">
            <h2
              class="text-xs font-bold text-slate-400 uppercase tracking-widest"
            >
              Directorio de Canchas
            </h2>
            <p class="text-[10px] text-slate-400 font-semibold mt-0.5">
              {{ filteredCanchas.length }} canchas encontradas
            </p>
          </div>
          <button @click="isSidebarCollapsed = !isSidebarCollapsed" class="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/50 transition-colors hidden md:block" :title="isSidebarCollapsed ? 'Expandir' : 'Colapsar'">
            <PanelLeftOpen v-if="isSidebarCollapsed" class="w-4 h-4" />
            <PanelLeftClose v-else class="w-4 h-4" />
          </button>
        </div>

        <!-- Local search and filter -->
        <div v-if="!isSidebarCollapsed" class="space-y-2 mt-3">
          <div class="relative">
            <span
              class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none"
            >
              <Search class="h-3.5 w-3.5 text-slate-400" />
            </span>
            <input
              v-model="localQuery"
              type="text"
              placeholder="Buscar cancha..."
              class="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-reffinance-navy"
            />
          </div>
          <div class="flex items-center justify-between gap-2">
            <span
              class="text-[10px] font-bold text-slate-400 uppercase tracking-wider"
              >Estado:</span
            >
            <select
              v-model="estadoFilter"
              class="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 focus:outline-none focus:border-reffinance-navy"
            >
              <option value="Todos">Todos</option>
              <option value="Activos">Activas</option>
              <option value="Inactivos">Inactivas</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Canchas List Grid -->
      <div class="flex-1 overflow-y-auto divide-y divide-slate-100">
        <button
          v-for="cancha in filteredCanchas"
          :key="cancha.idCancha"
          @click="selectedCancha = cancha"
          :class="[
            'w-full text-left flex items-center transition-colors',
            isSidebarCollapsed ? 'p-3 justify-center' : 'p-4 space-x-3',
            selectedCancha && selectedCancha.idCancha === cancha.idCancha
              ? 'bg-slate-50 border-r-4 border-reffinance-navy'
              : 'hover:bg-slate-50/50',
          ]"
          :title="isSidebarCollapsed ? (cancha.nombreCancha || cancha.nombre) : ''"
        >
          <div
            class="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0"
          >
            <MapPin class="w-4 h-4 text-reffinance-navy" />
          </div>
          <div v-if="!isSidebarCollapsed" class="flex-1 min-w-0">
            <h4
              class="font-extrabold text-slate-800 text-xs truncate leading-tight"
            >
              {{ cancha.nombreCancha || cancha.nombre }}
            </h4>
            <p class="text-[9px] font-bold text-slate-400 truncate mt-0.5">
              {{ cancha.categoria || "Sin Categoría" }} •
              {{ cancha.arancelesCount }} aranceles
            </p>
          </div>
          <div v-if="!isSidebarCollapsed" class="flex flex-col items-end space-y-1">
            <ChevronRight class="w-3.5 h-3.5 text-slate-300" />
            <span
              :class="[
                'text-[8px] font-extrabold px-1.5 py-0.2 rounded-full border',
                cancha.estado !== false
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                  : 'bg-rose-50 border-rose-100 text-rose-600',
              ]"
            >
              {{ cancha.estado !== false ? "Activa" : "Inactiva" }}
            </span>
          </div>
        </button>
        <div
          v-if="filteredCanchas.length === 0"
          class="p-8 text-center text-xs font-semibold text-slate-400"
        >
          <span v-if="!isSidebarCollapsed">No se encontraron canchas.</span>
          <span v-else>0</span>
        </div>
      </div>
    </div>

    <!-- RIGHT PANEL: Detailed Cancha view & Aranceles List -->
    <div
      v-if="selectedCancha"
      :class="[
        'flex-1 p-4 sm:p-8 overflow-y-auto space-y-8 bg-slate-50/50',
        selectedCancha ? 'block' : 'hidden md:block',
      ]"
    >
      <!-- Top Actions and Breadcrumbs -->
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div
          class="flex items-center space-x-2 text-xs font-bold text-slate-400"
        >
          <!-- Back button on mobile -->
          <button
            @click="selectedCancha = null"
            class="px-2.5 py-1.5 bg-slate-200/50 hover:bg-slate-200 text-slate-700 rounded-lg md:hidden mr-2 shrink-0 flex items-center font-bold"
          >
            <ChevronLeft class="w-4 h-4 mr-1" />
            Canchas
          </button>

          <div class="hidden md:flex items-center space-x-2">
            <span
              class="hover:text-slate-600 cursor-pointer"
              @click="selectedCancha = null"
              >Canchas</span
            >
            <span>&gt;</span>
            <span class="text-reffinance-navy font-extrabold font-outfit"
              >Aranceles</span
            >
          </div>
        </div>

        <div class="flex items-center space-x-3 self-start sm:self-auto">
          <button
            @click="openAddModalForSelectedCancha"
            class="px-4 py-2 bg-reffinance-navy hover:bg-reffinance-navy-dark text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center whitespace-nowrap"
          >
            <Plus class="w-4 h-4 mr-1.5 shrink-0" />
            Registrar Arancel
          </button>
        </div>
      </div>

      <!-- Cancha Info Header Card -->
      <div
        class="bg-white border border-reffinance-border rounded-2xl shadow-sm p-6 flex flex-col md:flex-row items-center gap-6"
      >
        <div
          class="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0"
        >
          <MapPin class="w-8 h-8 text-reffinance-navy" />
        </div>
        <div class="flex-1 space-y-2 text-center md:text-left">
          <div
            class="flex flex-col md:flex-row md:items-center gap-2 justify-center md:justify-start"
          >
            <h2
              class="text-2xl font-black text-reffinance-navy font-outfit leading-none"
            >
              {{ selectedCancha.nombreCancha || selectedCancha.nombre }}
            </h2>
            <span
              :class="[
                'inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border uppercase tracking-wider',
                selectedCancha.estado !== false
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-rose-50 border-rose-200 text-rose-700',
              ]"
            >
              {{
                selectedCancha.estado !== false
                  ? "CANCHA ACTIVA"
                  : "CANCHA INACTIVA"
              }}
            </span>
          </div>
          <p class="text-xs text-slate-400 font-bold">
            Categoría:
            <span class="font-extrabold text-slate-600">{{
              selectedCancha.categoria || "Sin Categoría"
            }}</span>
            <span class="mx-2">•</span>
            Fuera de Juego:
            <span class="font-extrabold text-slate-600">{{
              selectedCancha.fueraDeJuego ? "Sí" : "No"
            }}</span>
          </p>
        </div>
      </div>

      <!-- Metrics Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          class="bg-white border border-reffinance-border p-6 rounded-2xl shadow-sm space-y-2"
        >
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Aranceles de la Cancha
          </h3>
          <p class="text-3xl font-extrabold text-reffinance-navy font-outfit">
            {{ selectedCanchaAranceles.length }}
          </p>
        </div>
        <div
          class="bg-white border border-reffinance-border p-6 rounded-2xl shadow-sm space-y-2"
        >
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Monto Promedio
          </h3>
          <p class="text-3xl font-extrabold text-reffinance-navy font-outfit">
            ${{ formatNumber(canchaPromedioMonto) }}
          </p>
        </div>
      </div>

      <!-- Aranceles Table Component -->
      <ArancelesTable
        :aranceles="selectedCanchaAranceles"
        :loading-toggle="loadingToggle"
        @edit="openEditModal"
        @toggle-estado="toggleEstado"
        @confirm-toggle="confirmToggle"
      />
    </div>

    <!-- Placeholder right panel when no selected cancha -->
    <div
      v-else
      class="hidden md:flex flex-1 flex-col items-center justify-center p-8 bg-slate-50/30 text-center"
    >
      <div
        class="w-16 h-16 rounded-2xl bg-white border border-reffinance-border flex items-center justify-center shadow-sm mb-4"
      >
        <MapPin class="w-8 h-8 text-slate-300" />
      </div>
      <h3 class="text-base font-extrabold text-reffinance-navy font-outfit">
        Seleccione una cancha
      </h3>
      <p class="text-xs text-slate-400 max-w-xs mt-1">
        Haga clic en una cancha de la lista izquierda para ver sus aranceles
        asociados y gestionarlos.
      </p>
    </div>

    <!-- Add / Edit Arancel Modal Component -->
    <ArancelModal
      :show="showAddModal"
      :is-edit="isEdit"
      :initial-data="form"
      :canchas="canchas"
      :loading="loadingSubmit"
      @close="closeModal"
      @submit="submitArancel"
      @open-create-cancha="showAddCanchaModal = true"
    />

    <!-- Quick Cancha Sub-Modal -->
    <div
      v-if="showAddCanchaModal"
      class="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-60 p-4 transition-all duration-300"
    >
      <div class="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-reffinance-border transform scale-100 transition-all duration-300 p-6">
        <ModalCancha @close="showAddCanchaModal = false" @submit="onCanchaCreated" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import {
  Plus,
  Search,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-vue-next";
import api from "../services/api";
import ModalCancha from "./ModalCancha.vue";
import ArancelesTable from "./tables/ArancelesTable.vue";
import ArancelModal from "./modals/ArancelModal.vue";

const props = defineProps({
  searchQuery: {
    type: String,
    default: "",
  },
});

// Reactivos
const isSidebarCollapsed = ref(false);
const aranceles = ref([]);
const canchas = ref([]);
const localQuery = ref("");
const estadoFilter = ref("Todos");
const selectedCancha = ref(null);

// Paginación reactivos (conservados para endpoint)
const currentPage = ref(1);
const serverTotalPages = ref(1);
const totalElements = ref(0);
const itemsPerPage = 10;
const allArancelesForStats = ref([]);

const isEdit = ref(false);
const selectedArancelId = ref(null);

const showAddModal = ref(false);
const showAddCanchaModal = ref(false);
const loadingToggle = ref(null);
const loadingSubmit = ref(false);

const form = ref({
  descripcion: "",
  idCancha: "",
  montoTotal: null,
  cantidadPartidos: 1,
  fechaVigencia: new Date().toISOString().split("T")[0],
  activo: true,
});

// Watch global search query from Header component
watch(
  () => props.searchQuery,
  (newVal) => {
    localQuery.value = newVal || "";
  },
);

// Load data
const loadData = async () => {
  try {
    canchas.value = await api.getCanchas(0, 100);

    // Fetch paginated page from backend
    const res = await api.getAranceles(currentPage.value - 1, itemsPerPage);
    aranceles.value = res;
    serverTotalPages.value = res.totalPages || 1;
    totalElements.value = res.totalElements || res.length;

    // Fetch all for calculations and lists
    allArancelesForStats.value = await api.getAranceles(0, 1000);

    // Pre-select first cancha if none selected on desktop
    if (canchas.value.length > 0 && !selectedCancha.value) {
      if (window.innerWidth >= 768) {
        selectedCancha.value = canchas.value[0];
      }
    }
  } catch (error) {
    console.error("Error cargando datos de aranceles:", error);
  }
};

onMounted(() => {
  loadData();
});

// Directory calculations
const canchasWithArancelesCount = computed(() => {
  return canchas.value.map((c) => {
    const count = allArancelesForStats.value.filter(
      (a) => a.cancha?.idCancha === c.idCancha || a.idCancha === c.idCancha,
    ).length;
    return {
      ...c,
      arancelesCount: count,
    };
  });
});

const filteredCanchas = computed(() => {
  const query = localQuery.value.trim().toLowerCase();
  return canchasWithArancelesCount.value.filter((c) => {
    const name = String(c.nombreCancha || c.nombre || "").toLowerCase();
    const cat = String(c.categoria || "").toLowerCase();
    const matchesQuery = !query || name.includes(query) || cat.includes(query);

    let matchesStatus = true;
    if (estadoFilter.value === "Activos") {
      matchesStatus = c.estado !== false;
    } else if (estadoFilter.value === "Inactivos") {
      matchesStatus = c.estado === false;
    }

    return matchesQuery && matchesStatus;
  });
});

// Selected cancha aranceles list
const selectedCanchaAranceles = computed(() => {
  if (!selectedCancha.value) return [];
  return allArancelesForStats.value.filter(
    (a) =>
      a.cancha?.idCancha === selectedCancha.value.idCancha ||
      a.idCancha === selectedCancha.value.idCancha,
  );
});

const canchaPromedioMonto = computed(() => {
  if (selectedCanchaAranceles.value.length === 0) return 0;
  const total = selectedCanchaAranceles.value.reduce((sum, a) => {
    const val = a.montoTotal !== undefined ? a.montoTotal : a.monto;
    return sum + parseFloat(val || 0);
  }, 0);
  return total / selectedCanchaAranceles.value.length;
});

// Helper formatting functions
const formatNumber = (num) => {
  if (num === undefined || num === null) return "0.00";
  return parseFloat(num).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Modal handlers
const openAddModalForSelectedCancha = () => {
  isEdit.value = false;
  selectedArancelId.value = null;
  form.value = {
    descripcion: "",
    idCancha: selectedCancha.value ? selectedCancha.value.idCancha : "",
    montoTotal: null,
    cantidadPartidos: 1,
    fechaVigencia: new Date().toISOString().split("T")[0],
    activo: true,
  };
  showAddModal.value = true;
};

const openEditModal = (item) => {
  isEdit.value = true;
  selectedArancelId.value = item.idArancel;
  form.value = {
    descripcion: item.descripcion,
    idCancha: item.cancha?.idCancha || item.idCancha || "",
    montoTotal: item.montoTotal !== undefined ? item.montoTotal : item.monto,
    cantidadPartidos: item.cantidadPartidos,
    fechaVigencia: item.fechaVigencia,
    activo: item.activo,
  };
  showAddModal.value = true;
};

const closeModal = () => {
  showAddModal.value = false;
  isEdit.value = false;
  selectedArancelId.value = null;
  form.value = {
    descripcion: "",
    idCancha: "",
    montoTotal: null,
    cantidadPartidos: 1,
    fechaVigencia: new Date().toISOString().split("T")[0],
    activo: true,
  };
};

// Actions
const toggleEstado = async (item) => {
  loadingToggle.value = item.idArancel;
  try {
    const newState = !item.activo;
    await api.toggleArancelActivo(item.idArancel, newState);
    item.activo = newState;
  } catch (error) {
    console.error("Error al cambiar el estado del arancel:", error);
    alert("No se pudo cambiar el estado del arancel.");
  } finally {
    loadingToggle.value = null;
  }
};

const confirmToggle = (item) => {
  const message = `¿Desea ${item.activo ? "desactivar" : "activar"} el arancel "${item.descripcion}"?`;
  if (confirm(message)) {
    toggleEstado(item);
  }
};

const submitArancel = async (formData) => {
  if (formData) {
    form.value = { ...form.value, ...formData };
  }
  if (
    !form.value.descripcion ||
    !form.value.idCancha ||
    !form.value.montoTotal
  ) {
    alert("Por favor complete los campos obligatorios.");
    return;
  }

  loadingSubmit.value = true;
  try {
    const payload = {
      descripcion: form.value.descripcion,
      monto: parseFloat(form.value.montoTotal),
      fechaVigencia: form.value.fechaVigencia,
      cantidadPartidos: parseInt(form.value.cantidadPartidos),
      idCancha: Number(form.value.idCancha),
    };

    if (isEdit.value && selectedArancelId.value) {
      await api.updateArancel(selectedArancelId.value, payload);
      alert("Arancel modificado con éxito.");
    } else {
      await api.createArancel(payload);
      alert("Arancel registrado con éxito.");
    }

    await loadData();

    // Sync current selected cancha details if updated
    if (selectedCancha.value) {
      const updatedCancha = canchas.value.find(
        (c) => c.idCancha === selectedCancha.value.idCancha,
      );
      if (updatedCancha) selectedCancha.value = updatedCancha;
    }

    closeModal();
  } catch (error) {
    console.error("Error al guardar arancel:", error);
    alert("Hubo un error al guardar el arancel.");
  } finally {
    loadingSubmit.value = false;
  }
};

const onCanchaCreated = async (savedCancha) => {
  // Recargar y pre-seleccionar
  canchas.value = await api.getCanchas();
  form.value.idCancha = savedCancha.idCancha || savedCancha.id;

  // Select newly created cancha in split panel
  selectedCancha.value = savedCancha;

  showAddCanchaModal.value = false;
  alert("Cancha agregada con éxito.");
};
</script>

<style scoped>
/* Transición simple */
.z-55 {
  z-index: 55;
}
.z-60 {
  z-index: 60;
}
</style>
