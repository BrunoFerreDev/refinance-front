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
          <h3 class="text-lg font-bold font-outfit">Registrar Pago</h3>
          <p class="text-xs text-slate-300">
            Registrar abono de cuota para
            {{ loan?.nombreArbitro }}
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
          <p
            class="text-xs font-bold text-slate-400 uppercase tracking-wider"
          >
            Detalles del Préstamo
          </p>
          <div
            class="bg-slate-50 p-3 rounded-lg text-xs font-semibold text-slate-600 space-y-1"
          >
            <div class="flex justify-between">
              <span>Monto Total:</span>
              <span class="font-bold text-slate-800"
                >${{ formatNumber(loan?.montoTotal) }}</span
              >
            </div>
            <div class="flex justify-between">
              <span>Monto Pagado:</span>
              <span class="font-bold text-slate-800"
                >${{
                  formatNumber(loan?.montoPagado)
                }}</span
              >
            </div>
            <div class="flex justify-between">
              <span>Saldo Restante:</span>
              <span class="font-bold text-slate-800"
                >${{
                  formatNumber(loan?.saldoRestante)
                }}</span
              >
            </div>
          </div>
        </div>

        <div class="space-y-1.5">
          <label
            class="text-xs font-bold text-slate-400 uppercase tracking-wider"
            >Monto a Pagar ($)</label
          >
          <input
            type="number"
            step="0.01"
            v-model.number="form.monto"
            required
            :max="loan?.saldoRestante"
            placeholder="0.00"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
          />
        </div>
        <div class="space-y-1.5">
          <label
            class="text-xs font-bold text-slate-400 uppercase tracking-wider"
            >Fecha de Pago</label
          >
          <input
            type="date"
            v-model="form.fecha"
            required
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
            class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-md transition-colors cursor-pointer"
          >
            Registrar Pago
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
  loan: {
    type: Object,
    default: null,
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

