<template>
  <div
    v-if="show && !isReadOnly"
    class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
  >
    <div class="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-reffinance-border">
      <div class="bg-reffinance-navy p-5 text-white flex items-center justify-between">
        <div>
          <h3 class="text-base font-extrabold font-outfit">Registrar Abono</h3>
          <p class="text-[10px] text-slate-300">Registre un reembolso a cuenta del préstamo</p>
        </div>
        <button
          @click="$emit('close')"
          class="p-1 text-white/70 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-5 bg-slate-50 border-b border-slate-100 text-xs text-slate-500 space-y-1">
        <p><span class="font-bold text-slate-700">Préstamo:</span> {{ loan?.id }}</p>
        <p><span class="font-bold text-slate-700">Árbitro:</span> {{ loan?.nombreArbitro }}</p>
        <p><span class="font-bold text-slate-700">Saldo Pendiente Restante:</span> ${{ formatNumber(saldoRestante) }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="p-5 space-y-4">
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Monto a Abonar ($)
          </label>
          <input
            type="number"
            step="0.01"
            v-model.number="paymentMonto"
            required
            :max="saldoRestante"
            min="0.01"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
          />
          
          <button
            type="button"
            @click="paymentMonto = saldoRestante"
            class="text-[10px] text-reffinance-navy font-bold hover:underline block text-left cursor-pointer"
          >
            Liquidar saldo restante total (${{ formatNumber(saldoRestante) }})
          </button>
        </div>

        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Fecha del Pago
          </label>
          <input
            type="date"
            v-model="paymentFecha"
            required
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
          />
        </div>

        <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-reffinance-navy hover:bg-reffinance-navy-dark text-white rounded-lg text-xs font-bold shadow-md transition-colors cursor-pointer"
          >
            Registrar Pago
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
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
  isReadOnly: {
    type: Boolean,
    default: false,
  },
  initialAmount: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits(["close", "submit"]);

const paymentMonto = ref(null);
const paymentFecha = ref(new Date().toISOString().split("T")[0]);

const saldoRestante = computed(() => {
  if (!props.loan) return 0;
  return Math.max(
    0,
    parseFloat((props.loan.montoSolicitado - props.loan.montoDevuelto).toFixed(2)),
  );
});

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      paymentMonto.value = props.initialAmount || saldoRestante.value;
      paymentFecha.value = new Date().toISOString().split("T")[0];
    }
  },
);

const handleSubmit = () => {
  emit("submit", {
    monto: paymentMonto.value,
    fecha: paymentFecha.value,
  });
};

const formatNumber = (val) => {
  if (val === undefined || val === null) return "0.00";
  return Number(val).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
</script>

