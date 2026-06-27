<template>
  <header
    class="h-20 bg-white border-b border-reffinance-border flex items-center justify-between px-4 sm:px-8 shrink-0 select-none"
  >
    <!-- Left Section: Menu Toggle & Search Bar -->
    <div class="flex items-center space-x-3 flex-1 max-w-lg md:max-w-none mr-4">
      <!-- Hamburger Menu Button (Mobile Only) -->
      <button
        @click="$emit('toggle-sidebar')"
        class="p-2 hover:bg-slate-50 hover:text-slate-700 rounded-lg text-slate-500 md:hidden transition-colors shrink-0"
      >
        <Menu class="w-5.5 h-5.5" />
      </button>

      <!-- Search Bar -->
      <div class="w-full max-w-[200px] sm:max-w-sm md:w-96 relative">
        <Search
          class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400"
        />
        <input
          type="text"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          :placeholder="getPlaceholder"
          class="w-full pl-11 pr-4 py-2 bg-slate-50 border border-reffinance-border rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-reffinance-navy focus:bg-white transition-all duration-200"
        />
      </div>
    </div>

    <!-- Right Side Actions & User Info -->
    <div class="flex items-center space-x-3 sm:space-x-6 shrink-0">
      <!-- Demo/Fallback Indicator Badge (Premium touch) -->
      <div
        v-if="isDemo"
        class="hidden lg:flex items-center px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-xs font-semibold select-none animate-pulse"
      >
        <span class="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
        Modo Simulación
      </div>

      <!-- Divider -->
      <div class="h-8 w-[1px] bg-slate-200 shrink-0"></div>

      <!-- User Admin Profile -->
      <div class="flex items-center space-x-3 shrink-0">
        <div class="text-right hidden sm:block shrink-0">
          <p
            class="text-sm font-bold text-reffinance-navy font-outfit leading-tight"
          >
            {{ username }}
          </p>
          <p class="text-[10px] text-slate-400 font-semibold leading-tight">
            {{ roleText }}
          </p>
        </div>
        <!-- User Avatar -->
        <div
          class="w-10 h-10 rounded-lg overflow-hidden bg-reffinance-navy text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0"
        >
          {{ avatarInitials }}
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { Search, Bell, HelpCircle, Menu } from "lucide-vue-next";
import { computed } from "vue";
import { currentUser } from "../services/api.js";

const username = computed(() => currentUser.value.username || "Admin Usuario");
const roleText = computed(() => currentUser.value.username ? "Usuario Autenticado" : "Super Administrador");
const avatarInitials = computed(() => {
  const name = username.value;
  return name.slice(0, 2).toUpperCase();
});

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  activeTab: {
    type: String,
    required: true,
  },
  isDemo: {
    type: Boolean,
    default: true,
  },
});

defineEmits(["update:modelValue"]);

const getPlaceholder = computed(() => {
  switch (props.activeTab) {
    case "tablero":
      return "Buscar movimientos o árbitros...";
    case "prestamos":
      return "Buscar árbitro o ID de préstamo...";
    case "caja":
      return "Buscar transacciones...";
    case "arbitros":
      return "Buscar árbitro por nombre o ID...";
    default:
      return "Buscar en el portal...";
  }
});

const showNotif = () => {
  alert(
    "Notificaciones: \n1. Nueva solicitud de préstamo de Marcus Bennett.\n2. Cuota de David Rodríguez se encuentra vencida.",
  );
};

const showHelp = () => {
  alert(
    "Centro de Ayuda de RefFinance:\nPor favor contacta con el administrador del sistema si tienes dudas con los splits financieros o honorarios.",
  );
};
</script>
