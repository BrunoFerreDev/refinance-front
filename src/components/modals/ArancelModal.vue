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
            {{ isEdit ? "Modificar Arancel" : "Registrar Arancel" }}
          </h3>
          <p class="text-xs text-slate-300">
            {{
              isEdit
                ? "Modifique los detalles del arancel seleccionado"
                : "Complete los datos del nuevo arancel arbitral"
            }}
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
        <!-- Descripcion -->
        <div class="space-y-1.5">
          <label
            class="text-xs font-bold text-slate-400 uppercase tracking-wider"
            >Descripción</label
          >
          <input
            type="text"
            v-model="form.descripcion"
            required
            placeholder="Ej. Arancel Torneo de Invierno"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
          />
        </div>

        <!-- Cancha Selection with inline Add Cancha button -->
        <div class="space-y-1.5">
          <div class="flex justify-between items-center">
            <label
              class="text-xs font-bold text-slate-400 uppercase tracking-wider"
              >Cancha</label
            >
            <button
              type="button"
              @click="$emit('open-create-cancha')"
              class="text-xs font-extrabold text-reffinance-navy hover:underline flex items-center cursor-pointer"
            >
              <Plus class="w-3.5 h-3.5 mr-0.5" /> Nueva Cancha
            </button>
          </div>
          <select
            v-model="form.idCancha"
            required
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
          >
            <option value="" disabled>Seleccione una cancha</option>
            <option
              v-for="cancha in canchas"
              :key="cancha.idCancha"
              :value="cancha.idCancha"
            >
              {{ cancha.nombreCancha || cancha.nombre }}
            </option>
          </select>
        </div>

        <!-- Monto y Cantidad Partidos -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label
              class="text-xs font-bold text-slate-400 uppercase tracking-wider"
              >Monto ($)</label
            >
            <input
              type="number"
              step="0.01"
              min="0"
              v-model.number="form.montoTotal"
              required
              placeholder="0.00"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
            />
          </div>
          <div class="space-y-1.5">
            <label
              class="text-xs font-bold text-slate-400 uppercase tracking-wider"
              >Cantidad Partidos</label
            >
            <input
              type="number"
              min="1"
              v-model.number="form.cantidadPartidos"
              required
              placeholder="1"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
            />
          </div>
        </div>

        <!-- Fecha Vigencia y Activo -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label
              class="text-xs font-bold text-slate-400 uppercase tracking-wider"
              >Vigencia Desde</label
            >
            <input
              type="date"
              v-model="form.fechaVigencia"
              required
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
            />
          </div>
          <div class="space-y-1.5 flex flex-col justify-end">
            <label
              class="flex items-center space-x-2 pb-2.5 cursor-pointer"
              v-if="!isEdit"
            >
              <input
                type="checkbox"
                v-model="form.activo"
                class="w-4 h-4 text-reffinance-navy border-slate-200 rounded focus:ring-reffinance-navy"
              />
              <span
                class="text-xs font-bold text-slate-500 uppercase tracking-wider"
                >Activo al registrar</span
              >
            </label>
          </div>
        </div>

        <!-- Submit Buttons -->
        <div
          class="flex justify-end space-x-3 pt-4 border-t border-slate-100"
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
            :disabled="loading"
            class="px-4 py-2 bg-reffinance-navy hover:bg-reffinance-navy-dark text-white rounded-lg text-sm font-bold transition-all shadow-md flex items-center cursor-pointer disabled:opacity-50"
          >
            <span v-if="loading" class="mr-2">{{
              isEdit ? "Actualizando..." : "Registrando..."
            }}</span>
            <span v-else>{{
              isEdit ? "Guardar Cambios" : "Guardar Arancel"
            }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { X, Plus } from "lucide-vue-next";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  initialData: {
    type: Object,
    default: () => ({}),
  },
  canchas: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "submit", "open-create-cancha"]);

const form = ref({
  descripcion: "",
  idCancha: "",
  montoTotal: null,
  cantidadPartidos: 1,
  fechaVigencia: new Date().toISOString().split("T")[0],
  activo: true,
});

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      if (props.isEdit && props.initialData) {
        form.value = {
          descripcion: props.initialData.descripcion || "",
          idCancha: props.initialData.idCancha || "",
          montoTotal: props.initialData.montoTotal !== undefined ? props.initialData.montoTotal : props.initialData.monto,
          cantidadPartidos: props.initialData.cantidadPartidos || 1,
          fechaVigencia: props.initialData.fechaVigencia
            ? props.initialData.fechaVigencia.split("T")[0]
            : new Date().toISOString().split("T")[0],
          activo: props.initialData.activo !== undefined ? props.initialData.activo : true,
        };
      } else {
        form.value = {
          descripcion: props.initialData?.idCancha ? "" : "",
          idCancha: props.initialData?.idCancha || "",
          montoTotal: null,
          cantidadPartidos: 1,
          fechaVigencia: new Date().toISOString().split("T")[0],
          activo: true,
        };
      }
    }
  },
  { immediate: true },
);

const handleSubmit = () => {
  emit("submit", { ...form.value });
};
</script>

