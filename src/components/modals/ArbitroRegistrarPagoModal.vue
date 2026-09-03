<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-2xl border border-reffinance-border shadow-2xl max-w-md w-full flex flex-col overflow-hidden"
    >
      <div class="bg-reffinance-navy p-6 text-white flex items-center justify-between">
        <div>
          <h3 class="text-lg font-bold font-outfit">Registrar Pago</h3>
          <p class="text-xs text-slate-300">
            Registrar abono de cuota para {{ arbitro?.nombre }}
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4 text-xs">
        <div class="space-y-1.5">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detalles del Préstamo</p>
          <div class="bg-slate-50 p-3 rounded-lg text-xs font-semibold text-slate-600 space-y-1">
            <div class="flex justify-between">
              <span>Monto Total:</span>
              <span class="font-bold text-slate-800">${{ formatNumber(loan?.monto) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Saldo Restante:</span>
              <span class="font-bold text-slate-800">${{ formatNumber(loan?.saldoRestante) }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monto a Pagar ($)</label>
          <input
            v-model.number="form.monto"
            type="number"
            step="0.01"
            required
            :max="loan?.saldoRestante"
            placeholder="0.00"
            class="w-full px-3.5 py-2 border border-reffinance-border rounded-xl focus:outline-none focus:ring-2 focus:ring-reffinance-navy focus:border-transparent font-semibold text-slate-700 bg-slate-50/30"
          />
        </div>

        <div class="space-y-1.5">
          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fecha de Pago</label>
          <input
            v-model="form.fecha"
            type="date"
            required
            class="w-full px-3.5 py-2 border border-reffinance-border rounded-xl focus:outline-none focus:ring-2 focus:ring-reffinance-navy focus:border-transparent font-semibold text-slate-700 bg-slate-50/30"
          />
        </div>

        <div v-if="error" class="text-rose-600 font-bold text-center">
          {{ error }}
        </div>

        <div class="pt-4 border-t border-reffinance-border flex items-center justify-end space-x-3 bg-slate-50/50 -mx-6 -mb-6 p-6">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            {{ saving ? 'Guardando...' : 'Registrar Pago' }}
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
  arbitro: {
    type: Object,
    default: null,
  },
  loan: {
    type: Object,
    default: null,
  },
  saving: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close", "submit"]);

const form = ref({
  monto: null,
  fecha: new Date().toISOString().split("T")[0],
});

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      form.value = {
        monto: null,
        fecha: new Date().toISOString().split("T")[0],
      };
    }
  },
);

const handleSubmit = () => {
  emit("submit", { ...form.value, loan: props.loan });
};

const formatNumber = (val) => {
  if (val === undefined || val === null) return "0.00";
  return Number(val).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
</script>

