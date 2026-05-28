<template>
  <!-- Modal interactivo: Editar Transacción de Préstamo -->
  <div
    v-if="show"
    class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all duration-300"
  >
    <div
      class="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-reffinance-border transform scale-100 transition-all duration-300"
    >
      <!-- Header -->
      <div
        class="bg-indigo-900 p-6 text-white flex items-center justify-between"
      >
        <div>
          <h3 class="text-lg font-bold font-outfit flex items-center gap-2">
            <span class="p-1 bg-white/10 rounded">
              <Sparkles class="w-4 h-4 text-indigo-300 animate-pulse" />
            </span>
            Editar Transacción de Préstamo
          </h3>
          <p class="text-xs text-indigo-200 mt-1">
            Modifique los datos de este movimiento contable de préstamo
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="p-1 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Info Banner of Linked Loan -->
        <div
          class="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3"
        >
          <Info class="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div class="space-y-0.5">
            <p class="text-xs font-bold text-indigo-900">
              Transacción de Préstamo
            </p>
            <p class="text-xs text-indigo-700">
              Esta transacción está vinculada al préstamo activo
              <span class="font-bold"
                >#RF-LN-{{ txData?.idPrestamo || "N/A" }}</span
              >.
            </p>
          </div>
        </div>

        <!-- Tipo (ReadOnly / Info Indicator) -->
        <div class="space-y-1.5">
          <label
            class="text-xs font-bold text-slate-400 uppercase tracking-wider"
            >Tipo de Movimiento</label
          >
          <div
            class="flex items-center gap-3 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
          >
            <span
              class="w-2.5 h-2.5 rounded-full"
              :class="
                formTx.tipo === 'Ingreso' ? 'bg-emerald-500' : 'bg-rose-500'
              "
            ></span>
            <span class="font-bold text-slate-700"
              >{{ formTx.tipo }} (Prestamo)</span
            >
          </div>
        </div>

        <!-- Monto -->
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
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-semibold font-outfit"
          />
        </div>

        <!-- Descripción -->
        <div class="space-y-1.5">
          <label
            class="text-xs font-bold text-slate-400 uppercase tracking-wider"
            >Descripción</label
          >
          <input
            type="text"
            v-model="formTx.descripcion"
            required
            placeholder="Detalle de la transacción..."
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
          />
        </div>

        <!-- Fecha -->
        <div class="space-y-1.5">
          <label
            class="text-xs font-bold text-slate-400 uppercase tracking-wider"
            >Fecha de Transacción</label
          >
          <input
            type="date"
            v-model="formTx.fecha"
            required
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-semibold"
          />
        </div>

        <!-- Actions -->
        <div
          class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3"
        >
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-md shadow-indigo-100 hover:shadow-lg transition-all"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { X, Sparkles, Info } from "lucide-vue-next";
import { ref, watch } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  concepts: {
    type: Array,
    required: true,
  },
  txData: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "submit"]);

const formTx = ref({
  tipo: "Gasto",
  monto: null,
  fecha: "",
  concepto: "",
  descripcion: "",
  estado: "PAGADO",
  requiereRecupero: false,
});

watch(
  () => props.show,
  (newVal) => {
    if (newVal && props.txData) {
      const matchConcept = props.concepts.find(
        (c) =>
          c.nombre === props.txData.nombreConceptoGasto ||
          c.nombre === props.txData.categoria,
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
    }
  },
);

const handleSubmit = () => {
  emit("submit", { ...formTx.value, idPrestamo: props.txData?.idPrestamo });
};
</script>
