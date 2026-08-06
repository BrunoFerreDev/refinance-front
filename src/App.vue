<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Sidebar from "./components/Sidebar.vue";
import Header from "./components/Header.vue";
import { isGlobalLoading } from "./services/client.js";
import { Loader2 } from "lucide-vue-next";

const route = useRoute();
const router = useRouter();

// Reactivos para buscador y control de sidebar en móvil
const searchQuery = ref("");
const isSidebarOpen = ref(false);

// activeTab calculado en base a la ruta actual
const activeTab = computed(() => {
  if (route.name === "tablero") return "tablero";
  if (route.name === "prestamos" || route.name === "prestamo-detalle")
    return "prestamos";
  if (route.name === "caja" || route.name === "gasto-recupero-detalle")
    return "caja";
  if (route.name === "arbitros") return "arbitros";
  if (route.name === "aranceles") return "aranceles";
  if (route.name === "reporte") return "reporte";
  return "tablero";
});

// Cambiar de pestaña programáticamente (para compatibilidad con emits)
const changeTab = (tabId) => {
  router.push({ name: tabId });
  searchQuery.value = ""; // Limpiar buscador al navegar
  isSidebarOpen.value = false; // Cerrar sidebar en móvil al cambiar pestaña
};
</script>

<template>
  <!-- Top Progress Bar (YouTube style) -->
  <Transition name="fade">
    <div
      v-if="isGlobalLoading"
      class="fixed top-0 left-0 right-0 h-[3px] bg-slate-100 z-50 overflow-hidden"
    >
      <div class="h-full bg-gradient-to-r from-blue-500 via-[#081342] to-blue-500 w-full animate-loading-bar absolute"></div>
    </div>
  </Transition>

  <!-- Fullscreen Login Layout -->
  <div
    v-if="route.name === 'login'"
    class="h-screen w-screen overflow-hidden bg-[#F4F6FA]"
  >
    <router-view v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
  </div>

  <!-- Standard Dashboard Layout -->
  <div
    v-else
    class="flex h-screen w-screen overflow-hidden bg-[#F4F6FA] text-slate-800 antialiased font-sans select-none relative"
  >
    <!-- Dark Backdrop for Mobile Sidebar -->
    <div
      v-if="isSidebarOpen"
      @click="isSidebarOpen = false"
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 md:hidden transition-opacity duration-300"
    ></div>

    <!-- Sidebar Navigation Menu (Left) -->
    <Sidebar
      :active-tab="activeTab"
      :is-open="isSidebarOpen"
      @close-sidebar="isSidebarOpen = false"
      @change-tab="changeTab"
    />

    <!-- Main Workspace Container (Right) -->
    <div class="flex-1 flex flex-col h-screen overflow-hidden">
      <!-- Top Header Bar -->
      <Header
        v-model="searchQuery"
        :active-tab="activeTab"
        :is-demo="false"
        @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
      />

      <!-- Dynamic Active View Workspace -->
      <main class="flex-1 overflow-hidden bg-[#F4F6FA] flex flex-col relative">
        <router-view v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component
              :is="Component"
              :search-query="searchQuery"
              @change-tab="changeTab"
            />
          </Transition>
        </router-view>

        <!-- Blocking overlay with blurring when global loading is active -->
        <Transition name="fade">
          <div
            v-if="isGlobalLoading"
            class="absolute inset-0 bg-[#F4F6FA]/60 backdrop-blur-[3px] z-40 flex items-center justify-center pointer-events-auto"
          >
            <div class="bg-white/95 backdrop-blur-md border border-slate-200/80 px-6 py-4 rounded-xl shadow-xl flex flex-col items-center space-y-3 max-w-xs text-center select-none animate-pulse">
              <Loader2 class="w-8 h-8 text-reffinance-navy animate-spin" />
              <p class="text-sm font-bold text-slate-700 font-sans tracking-wide">
                Cargando datos...
              </p>
              <p class="text-xs text-slate-400">
                Por favor, espere mientras actualizamos la información.
              </p>
            </div>
          </div>
        </Transition>
      </main>
    </div>
  </div>
</template>

<style>
/* Smooth fade-in transitions for switching layout tabs */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
