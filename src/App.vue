<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Sidebar from './components/Sidebar.vue';
import Header from './components/Header.vue';

const route = useRoute();
const router = useRouter();

// Reactivos para buscador y control de sidebar en móvil
const searchQuery = ref('');
const isSidebarOpen = ref(false);

// activeTab calculado en base a la ruta actual
const activeTab = computed(() => {
  if (route.name === 'tablero') return 'tablero';
  if (route.name === 'prestamos' || route.name === 'prestamo-detalle') return 'prestamos';
  if (route.name === 'caja' || route.name === 'gasto-recupero-detalle') return 'caja';
  if (route.name === 'arbitros') return 'arbitros';
  if (route.name === 'reporte') return 'reporte';
  return 'tablero';
});

// Cambiar de pestaña programáticamente (para compatibilidad con emits)
const changeTab = (tabId) => {
  router.push({ name: tabId });
  searchQuery.value = ''; // Limpiar buscador al navegar
  isSidebarOpen.value = false; // Cerrar sidebar en móvil al cambiar pestaña
};
</script>

<template>
  <div class="flex h-screen w-screen overflow-hidden bg-[#F4F6FA] text-slate-800 antialiased font-sans select-none relative">
    
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
      <main class="flex-1 overflow-hidden bg-[#F4F6FA] flex flex-col">
        <router-view v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component 
              :is="Component"
              :search-query="searchQuery"
              @change-tab="changeTab"
            />
          </Transition>
        </router-view>
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
