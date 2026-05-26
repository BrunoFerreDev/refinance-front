<template>
  <!-- Modal interactivo: Añadir Transacción -->
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
          <h3 class="text-lg font-bold font-outfit">Añadir Transacción</h3>
          <p class="text-xs text-slate-300">
            Registre un ingreso o egreso en el libro diario
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
            >Estado</label
          >
          <div class="flex items-center space-x-4">
            <label
              class="flex items-center space-x-2 text-sm font-semibold text-slate-600 cursor-pointer"
            >
              <input
                type="radio"
                v-model="formTx.estado"
                value="PAGADO"
                class="text-reffinance-navy focus:ring-0"
              />
              <span>PAGADO</span>
            </label>
            <label
              class="flex items-center space-x-2 text-sm font-semibold text-slate-600 cursor-pointer"
            >
              <input
                type="radio"
                v-model="formTx.estado"
                value="PENDIENTE"
                class="text-reffinance-navy focus:ring-0"
              />
              <span>PENDIENTE</span>
            </label>
          </div>
        </div>

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
            class="px-5 py-2 bg-reffinance-navy hover:bg-reffinance-navy-dark text-white rounded-lg text-sm font-bold shadow-md transition-colors"
          >
            Guardar Transacción
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { X } from "lucide-vue-next";
import { ref } from "vue";

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  concepts: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["close", "submit"]);

const formTx = ref({
  tipo: "Ingreso",
  monto: null,
  concepto: "",
  descripcion: "",
  estado: "PAGADO",
});

const handleSubmit = () => {
  emit("submit", { ...formTx.value });
  // Resetear el formulario contable tras enviar
  formTx.value = {
    tipo: "Ingreso",
    monto: null,
    concepto: "",
    descripcion: "",
    estado: "PAGADO",
  };
};
</script>
