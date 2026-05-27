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
            Asociar Árbitro a Gasto
          </h3>
          <p class="text-xs text-slate-300">
            Asigne un árbitro y el monto correspondiente a esta transacción compartida
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="p-1 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6 bg-slate-50 border-b border-slate-100 text-xs text-slate-500 space-y-1">
        <p><span class="font-bold text-slate-700">Transacción:</span> {{ txData?.descripcion }}</p>
        <p><span class="font-bold text-slate-700">Monto Total Gasto:</span> ${{ formatNumber(txData?.monto) }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Árbitro Selection -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Árbitro
          </label>
          <select
            v-model="form.idArbitro"
            required
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
          >
            <option value="" disabled>Seleccione un árbitro</option>
            <option
              v-for="referee in referees"
              :key="referee.id"
              :value="referee.id"
            >
              {{ referee.nombre }} ({{ referee.clasificacion }})
            </option>
          </select>
        </div>

        <!-- Monto Asignado -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Monto Asignado ($)
          </label>
          <input
            type="number"
            step="0.01"
            v-model.number="form.montoAsignado"
            required
            placeholder="0.00"
            :max="maxAmount"
            min="0.01"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
          />
          <p class="text-[10px] text-slate-400">
            El monto máximo asignable es ${{ formatNumber(txData?.monto) }}
          </p>
        </div>

        <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
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
            Asociar Árbitro
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { X } from "lucide-vue-next";
import { ref, watch, computed } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  referees: {
    type: Array,
    required: true,
  },
  txData: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "submit"]);

const form = ref({
  idArbitro: "",
  montoAsignado: null,
});

const maxAmount = computed(() => {
  if (!props.txData) return 0;
  return Math.abs(props.txData.monto);
});

// Watch to populate default values when modal is opened
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      form.value = {
        idArbitro: "",
        montoAsignado: maxAmount.value,
      };
    }
  }
);

const formatNumber = (num) => {
  if (!num) return "0.00";
  return Math.abs(num).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const handleSubmit = () => {
  if (!form.value.idArbitro || !form.value.montoAsignado) return;
  emit("submit", {
    idArbitro: form.value.idArbitro,
    montoAsignado: form.value.montoAsignado,
  });
};
</script>
