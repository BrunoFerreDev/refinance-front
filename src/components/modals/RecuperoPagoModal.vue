<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-reffinance-border"
    >
      <div
        class="bg-reffinance-navy p-5 text-white flex items-center justify-between"
      >
        <div>
          <h3 class="text-base font-extrabold font-outfit">
            Registrar Pago de Recupero
          </h3>
          <p class="text-[10px] text-slate-300">
            Registre un ingreso de reembolso para el árbitro
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="p-1 text-white/70 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div
        class="p-5 bg-slate-50 border-b border-slate-100 text-xs text-slate-500 space-y-1"
      >
        <p>
          <span class="font-bold text-slate-700">Árbitro:</span>
          {{ assoc?.arbitro?.nombre }}
          {{ assoc?.arbitro?.apellido }}
        </p>
        <p>
          <span class="font-bold text-slate-700">Monto Asignado:</span> ${{
            formatNumber(assoc?.montoAsignado)
          }}
        </p>
        <p>
          <span class="font-bold text-slate-700"
            >Monto Cobrado Previamente:</span
          >
          ${{
            formatNumber(
              assoc?.montoRecupered || assoc?.montoRecuperado,
            )
          }}
        </p>
        <p>
          <span class="font-bold text-slate-700"
            >Monto Pendiente Actual:</span
          >
          ${{ formatNumber(maxRefundAmount) }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="p-5 space-y-4">
        <div class="space-y-1.5">
          <label
            class="text-[10px] font-bold text-slate-400 uppercase tracking-wider"
          >
            Monto a Cobrar ($)
          </label>
          <input
            type="number"
            step="0.01"
            v-model.number="refundAmount"
            required
            :max="maxRefundAmount"
            min="0.01"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
          />

          <!-- Quick Fill Button to Pay Remaining amount exactly -->
          <button
            type="button"
            @click="refundAmount = maxRefundAmount"
            class="text-[10px] text-reffinance-navy font-bold hover:underline block text-left cursor-pointer"
          >
            Cobrar el saldo restante total (${{
              formatNumber(maxRefundAmount)
            }})
          </button>
        </div>

        <div
          class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3"
        >
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
            Registrar Cobro
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
  assoc: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "submit"]);

const refundAmount = ref(null);

const maxRefundAmount = computed(() => {
  if (!props.assoc) return 0;
  const assigned = parseFloat(props.assoc.montoAsignado || 0);
  const recovered = parseFloat(
    props.assoc.montoRecupered || props.assoc.montoRecuperado || 0,
  );
  return Math.max(0, parseFloat((assigned - recovered).toFixed(2)));
});

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      refundAmount.value = maxRefundAmount.value;
    }
  },
);

const handleSubmit = () => {
  emit("submit", refundAmount.value);
};

const formatNumber = (val) => {
  if (val === undefined || val === null) return "0.00";
  return Number(val).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
</script>

