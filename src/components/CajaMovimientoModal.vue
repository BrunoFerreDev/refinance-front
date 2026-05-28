<template>
  <!-- Modal interactivo: Añadir/Editar Transacción -->
  <div
    v-if="show"
    class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all duration-300"
  >
    <div
      class="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-reffinance-border transform scale-100 transition-all duration-300"
    >
      <div
        class="bg-reffinance-navy p-6 text-white flex items-center justify-between"
      >
        <div>
          <h3 class="text-lg font-bold font-outfit">
            {{ isEdit ? "Editar Transacción" : "Añadir Transacción" }}
          </h3>
          <p class="text-xs text-slate-300">
            {{
              isEdit
                ? "Modifique los detalles del movimiento contable"
                : "Registre un ingreso o egreso en el libro diario"
            }}
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="p-1 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div class="space-y-1.5">
          <label
            class="text-xs font-bold text-slate-400 uppercase tracking-wider"
            >Tipo de Transacción</label
          >
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="formTx.tipo = 'Ingreso'"
              :class="[
                'py-2.5 rounded-lg border text-sm font-bold text-center transition-all',
                formTx.tipo === 'Ingreso'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-50',
              ]"
            >
              Ingreso (+)
            </button>
            <button
              type="button"
              @click="formTx.tipo = 'Gasto'"
              :class="[
                'py-2.5 rounded-lg border text-sm font-bold text-center transition-all',
                formTx.tipo === 'Gasto'
                  ? 'bg-rose-50 border-rose-500 text-rose-700'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-50',
              ]"
            >
              Gasto (-)
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label
              class="text-xs font-bold text-slate-400 uppercase tracking-wider"
              >Monto ($)</label
            >
            <input
              type="number"
              step="0.01"
              v-model.number="formTx.monto"
              required
              placeholder="0.00"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
            />
          </div>
          <div class="space-y-1.5">
            <label
              class="text-xs font-bold text-slate-400 uppercase tracking-wider"
              >Concepto de Gasto</label
            >
            <select
              v-model="formTx.concepto"
              required
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
            >
              <option value="" disabled>Seleccione un concepto</option>
              <option
                v-for="concept in concepts"
                :key="concept.idConcepto"
                :value="concept.idConcepto"
              >
                {{ concept.nombre }}
              </option>
            </select>
          </div>
        </div>

        <div class="space-y-1.5">
          <label
            class="text-xs font-bold text-slate-400 uppercase tracking-wider"
            >Descripción</label
          >
          <input
            type="text"
            v-model="formTx.descripcion"
            required
            placeholder="Ej. Cuota mensual o compra de uniformes"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
          />
        </div>

        <div class="space-y-1.5">
          <label
            class="text-xs font-bold text-slate-400 uppercase tracking-wider"
            >Fecha</label
          >
          <input
            type="date"
            v-model="formTx.fecha"
            required
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
          />
        </div>

        <div class="flex items-center space-x-6 pt-2">
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              id="requiereRecupero"
              v-model="formTx.requiereRecupero"
              class="w-4 h-4 text-reffinance-navy bg-slate-50 border-slate-200 rounded focus:ring-reffinance-navy cursor-pointer transition-all"
            />
            <label
              for="requiereRecupero"
              class="text-sm font-semibold text-slate-600 cursor-pointer select-none"
              >¿Requiere recupero?</label
            >
          </div>
        </div>

        <div
          class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3"
        >
          <button
            v-if="isEdit && formTx.requiereRecupero"
            type="button"
            @click="$emit('associateArbitro', txData)"
            class="mr-auto px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold border border-emerald-200 transition-colors flex items-center shadow-xs"
          >
            <UserPlus class="w-4 h-4 mr-1.5 shrink-0" />
            Asociar Árbitro
          </button>
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-5 py-2 bg-reffinance-navy hover:bg-reffinance-navy-dark text-white rounded-lg text-sm font-bold shadow-md transition-colors"
          >
            {{ isEdit ? "Guardar Cambios" : "Guardar Transacción" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { X, UserPlus, Info } from "lucide-vue-next";
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  concepts: {
    type: Array,
    required: true,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  txData: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "submit", "associateArbitro"]);

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formTx = ref({
  tipo: "Ingreso",
  monto: null,
  fecha: getTodayString(),
  concepto: "",
  descripcion: "",
  estado: "PAGADO",
  requiereRecupero: false,
});

// Cargar datos al abrir el modal en modo edición
watch(
  () => props.show,
  (newVal) => {
    if (newVal && props.isEdit && props.txData) {
      const matchConcept = props.concepts.find(
        (c) => c.nombre === props.txData.nombreConceptoGasto,
      );
      formTx.value = {
        tipo:
          props.txData.tipo === "Ingreso" || props.txData.monto > 0
            ? "Ingreso"
            : "Gasto",
        monto: Math.abs(props.txData.monto),
        concepto: matchConcept ? matchConcept.idConcepto : "",
        descripcion: props.txData.descripcion || "",
        estado: props.txData.estado || "PAGADO",
        fecha: props.txData.fechaRaw ? props.txData.fechaRaw.split("T")[0] : "",
        requiereRecupero: props.txData.requiereRecupero || false,
      };
    } else if (newVal && !props.isEdit) {
      formTx.value = {
        tipo: "Ingreso",
        monto: null,
        fecha: getTodayString(),
        concepto: "",
        descripcion: "",
        estado: "PAGADO",
        requiereRecupero: false,
      };
    }
  },
);

const handleSubmit = () => {
  emit("submit", { ...formTx.value, idPrestamo: props.txData?.idPrestamo });
};
</script>
