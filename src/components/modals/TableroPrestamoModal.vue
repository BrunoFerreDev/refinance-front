<template>
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
            Registrar Nuevo Préstamo
          </h3>
          <p class="text-xs text-slate-300">
            Crear anticipo financiero para un árbitro
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="p-1 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div class="space-y-1.5">
          <label
            class="text-xs font-bold text-slate-400 uppercase tracking-wider"
            >Árbitro Solicitante</label
          >
          <select
            v-model="form.arbitro"
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
          <label
            class="text-xs font-bold text-slate-400 uppercase tracking-wider"
            >Monto del Préstamo ($)</label
          >
          <input
            type="number"
            step="0.01"
            v-model.number="form.montoTotal"
            required
            placeholder="0.00"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
          />
        </div>

        <div
          class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3"
        >
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-5 py-2 bg-reffinance-navy hover:bg-reffinance-navy-dark text-white rounded-lg text-sm font-bold shadow-md transition-colors cursor-pointer"
          >
            Crear Préstamo
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { X } from "lucide-vue-next";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  referees: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["close", "submit"]);

const form = ref({
  arbitro: "",
  montoTotal: null,
});

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      form.value = {
        arbitro: "",
        montoTotal: null,
      };
    }
  },
);

const handleSubmit = () => {
  emit("submit", { ...form.value });
};
</script>

