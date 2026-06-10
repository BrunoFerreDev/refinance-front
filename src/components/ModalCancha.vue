<script setup>
import { reactive, watch } from "vue";
import api from "../services/api";

const props = defineProps({
  canchaData: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "submit"]);

const state = reactive({
  modal: {
    id: null,
  },
  form: {
    nombreCancha: "",
    categoria: "FUTBOL_11",
    fueraDeJuego: false,
    estado: true,
  },
});

const resetForm = () => {
  state.modal.id = null;
  state.form.nombreCancha = "";
  state.form.categoria = "FUTBOL_11";
  state.form.fueraDeJuego = false;
  state.form.estado = true;
};

// Watch for initial editing data
watch(
  () => props.canchaData,
  (newVal) => {
    if (newVal) {
      state.modal.id = newVal.idCancha || newVal.id;
      state.form.nombreCancha = newVal.nombreCancha || newVal.nombre || "";
      state.form.categoria = newVal.categoria || "FUTBOL_11";
      state.form.fueraDeJuego = newVal.fueraDeJuego || false;
      state.form.estado = newVal.estado !== false;
    } else {
      resetForm();
    }
  },
  { immediate: true },
);

const closeModal = () => {
  resetForm();
  emit("close");
};

const saveCancha = async () => {
  if (!state.form.nombreCancha.trim()) {
    alert("Por favor ingrese el nombre de la cancha.");
    return;
  }

  try {
    const payload = {
      nombreCancha: state.form.nombreCancha,
      nombre: state.form.nombreCancha,
      categoria: state.form.categoria,
      fueraDeJuego: state.form.fueraDeJuego,
      estado: state.form.estado,
    };
    const saved = await api.createCancha(payload);
    emit("submit", saved);
    closeModal();
  } catch (error) {
    console.error("Error al crear cancha:", error);
    alert("Error al guardar la cancha.");
  }
};

const saveEditCancha = async (id) => {
  if (!state.form.nombreCancha.trim()) {
    alert("Por favor ingrese el nombre de la cancha.");
    return;
  }

  try {
    const payload = {
      nombreCancha: state.form.nombreCancha,
      nombre: state.form.nombreCancha,
      categoria: state.form.categoria,
      fueraDeJuego: state.form.fueraDeJuego,
      estado: state.form.estado,
    };
    const updated = await api.updateCancha(id, payload);
    emit("submit", updated);
    closeModal();
  } catch (error) {
    console.error("Error al editar cancha:", error);
    alert("Error al guardar los cambios de la cancha.");
  }
};
</script>

<template>
  <div class="space-y-4 w-full">
    <div class="text-lg font-bold font-outfit text-reffinance-navy mb-4 border-b border-slate-100 pb-2">
      {{ state.modal.id ? "Editar cancha" : "Nueva cancha" }}
    </div>

    <div class="space-y-1.5">
      <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">Nombre de la cancha</label>
      <input
        v-model="state.form.nombreCancha"
        class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white"
        placeholder="Ej: Estadio Municipal, Cancha 1..."
      />
    </div>

    <div class="space-y-1.5">
      <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">Categoría</label>
      <select v-model="state.form.categoria" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-reffinance-navy focus:bg-white">
        <option value="FUTBOL_11">Futbol 11</option>
        <option value="FUTBOL_10">Futbol 10</option>
        <option value="FUTBOL_9">Futbol 9</option>
      </select>
    </div>

    <div class="space-y-2 pt-2">
      <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">¿Fuera de juego?</label>
      <label class="flex items-center space-x-2 cursor-pointer">
        <input v-model="state.form.fueraDeJuego" type="checkbox" class="w-4 h-4 text-reffinance-navy border-slate-200 rounded focus:ring-reffinance-navy" />
        <span class="text-sm font-medium text-slate-600">Fuera de juego (No disponible temporalmente)</span>
      </label>
    </div>

    <div class="space-y-2">
      <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">Estado</label>
      <label class="flex items-center space-x-2 cursor-pointer">
        <input v-model="state.form.estado" type="checkbox" class="w-4 h-4 text-reffinance-navy border-slate-200 rounded focus:ring-reffinance-navy" />
        <span class="text-sm font-medium text-slate-600">Activa (Disponible para designar)</span>
      </label>
    </div>

    <div class="flex justify-end space-x-3 pt-4 border-t border-slate-100 mt-6">
      <button class="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors" @click="closeModal">Cancelar</button>
      <button
        class="px-4 py-2 bg-reffinance-navy hover:bg-reffinance-navy-dark text-white rounded-lg text-sm font-bold transition-all shadow-md flex items-center"
        @click="state.modal.id ? saveEditCancha(state.modal.id) : saveCancha()"
      >
        {{ state.modal.id ? "Guardar cambios" : "Agregar cancha" }}
      </button>
    </div>
  </div>
</template>
