<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-2xl border border-reffinance-border shadow-2xl max-w-lg w-full flex flex-col max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100"
    >
      <!-- Modal Header -->
      <div class="p-6 border-b border-reffinance-border flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 class="text-base font-black text-reffinance-navy font-outfit">
            {{ isEdit ? 'Editar Árbitro' : 'Nuevo Árbitro' }}
          </h3>
          <p class="text-[10px] text-slate-400 font-semibold mt-0.5">
            {{ isEdit ? 'Modifique los datos del perfil' : 'Complete el formulario para registrar un miembro' }}
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/50 transition-colors cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Modal Body (Scrollable form) -->
      <form @submit.prevent="handleSubmit" class="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
        <!-- Text Inputs Grid -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nombre *</label>
            <input
              v-model="form.nombre"
              type="text"
              required
              class="w-full px-3.5 py-2 border border-reffinance-border rounded-xl focus:outline-none focus:ring-2 focus:ring-reffinance-navy focus:border-transparent font-semibold text-slate-700 bg-slate-50/30"
              placeholder="Nombre"
            />
          </div>
          <div class="space-y-1">
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Apellido *</label>
            <input
              v-model="form.apellido"
              type="text"
              required
              class="w-full px-3.5 py-2 border border-reffinance-border rounded-xl focus:outline-none focus:ring-2 focus:ring-reffinance-navy focus:border-transparent font-semibold text-slate-700 bg-slate-50/30"
              placeholder="Apellido"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">WhatsApp *</label>
            <input
              v-model="form.whatsapp"
              type="text"
              required
              class="w-full px-3.5 py-2 border border-reffinance-border rounded-xl focus:outline-none focus:ring-2 focus:ring-reffinance-navy focus:border-transparent font-semibold text-slate-700 bg-slate-50/30"
              placeholder="WhatsApp (ej. +549...)"
            />
          </div>
          <div class="space-y-1">
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Categoría</label>
            <input
              v-model="form.categoria"
              type="text"
              class="w-full px-3.5 py-2 border border-reffinance-border rounded-xl focus:outline-none focus:ring-2 focus:ring-reffinance-navy focus:border-transparent font-semibold text-slate-700 bg-slate-50/30"
              placeholder="Categoría (ej. Nacional)"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Talle Camiseta</label>
            <input
              v-model="form.talleCamiseta"
              type="text"
              class="w-full px-3.5 py-2 border border-reffinance-border rounded-xl focus:outline-none focus:ring-2 focus:ring-reffinance-navy focus:border-transparent font-semibold text-slate-700 bg-slate-50/30"
              placeholder="Talle (ej. M, L)"
            />
          </div>
          <div class="space-y-1">
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Talle Short</label>
            <input
              v-model="form.talleShort"
              type="text"
              class="w-full px-3.5 py-2 border border-reffinance-border rounded-xl focus:outline-none focus:ring-2 focus:ring-reffinance-navy focus:border-transparent font-semibold text-slate-700 bg-slate-50/30"
              placeholder="Talle (ej. M, L)"
            />
          </div>
        </div>

        <!-- Switches / Booleans Grid -->
        <div class="bg-slate-50/50 rounded-2xl border border-slate-100 p-4 space-y-4">
          <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Preferencias y Estado</h4>
          
          <!-- Estado -->
          <div class="flex items-center justify-between">
            <div>
              <p class="font-bold text-slate-700">Estado del Árbitro</p>
              <p class="text-[9px] text-slate-400 font-semibold">Determina si está habilitado para designaciones</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer select-none">
              <input
                v-model="form.estado"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:height-4 after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <!-- Disponible Sábado -->
          <div class="flex items-center justify-between">
            <div>
              <p class="font-bold text-slate-700">Disponible Sábado</p>
              <p class="text-[9px] text-slate-400 font-semibold">Habilitar para partidos jugados los sábados</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer select-none">
              <input
                v-model="form.disponibleSabado"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:height-4 after:h-4 after:w-4 after:transition-all peer-checked:bg-reffinance-navy"></div>
            </label>
          </div>

          <!-- Disponible Domingo -->
          <div class="flex items-center justify-between">
            <div>
              <p class="font-bold text-slate-700">Disponible Domingo</p>
              <p class="text-[9px] text-slate-400 font-semibold">Habilitar para partidos jugados los domingos</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer select-none">
              <input
                v-model="form.disponibleDomingo"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:height-4 after:h-4 after:w-4 after:transition-all peer-checked:bg-reffinance-navy"></div>
            </label>
          </div>

          <!-- Tiene Auto -->
          <div class="flex items-center justify-between">
            <div>
              <p class="font-bold text-slate-700">Tiene Auto</p>
              <p class="text-[9px] text-slate-400 font-semibold">Indica si cuenta con movilidad propia</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer select-none">
              <input
                v-model="form.tieneAuto"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:height-4 after:h-4 after:w-4 after:transition-all peer-checked:bg-reffinance-navy"></div>
            </label>
          </div>
        </div>

        <!-- Error message -->
        <div v-if="error" class="text-rose-600 font-bold text-center text-xs">
          {{ error }}
        </div>

        <!-- Modal Footer Actions -->
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
            class="px-4 py-2 bg-reffinance-navy hover:bg-reffinance-navy-dark text-white rounded-lg font-bold transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            {{ saving ? 'Guardando...' : 'Guardar' }}
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
  isEdit: {
    type: Boolean,
    default: false,
  },
  initialData: {
    type: Object,
    default: () => ({}),
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
  nombre: "",
  apellido: "",
  whatsapp: "",
  categoria: "",
  talleCamiseta: "",
  talleShort: "",
  estado: true,
  disponibleSabado: false,
  disponibleDomingo: false,
  tieneAuto: false,
});

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      if (props.isEdit && props.initialData) {
        form.value = {
          nombre: props.initialData.nombre || "",
          apellido: props.initialData.apellido || "",
          whatsapp: props.initialData.whatsapp || "",
          categoria: props.initialData.categoria || "",
          talleCamiseta: props.initialData.talleCamiseta || "",
          talleShort: props.initialData.talleShort || "",
          estado: props.initialData.estado ?? true,
          disponibleSabado: props.initialData.disponibleSabado ?? false,
          disponibleDomingo: props.initialData.disponibleDomingo ?? false,
          tieneAuto: props.initialData.tieneAuto ?? false,
        };
      } else {
        form.value = {
          nombre: "",
          apellido: "",
          whatsapp: "",
          categoria: "",
          talleCamiseta: "",
          talleShort: "",
          estado: true,
          disponibleSabado: false,
          disponibleDomingo: false,
          tieneAuto: false,
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

