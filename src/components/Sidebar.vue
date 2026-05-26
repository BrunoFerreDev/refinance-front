<template>
  <aside 
    :class="[
      'w-64 bg-white border-r border-reffinance-border h-screen flex flex-col justify-between select-none shrink-0 transition-transform duration-300 ease-in-out fixed md:static inset-y-0 left-0 z-40 md:z-auto',
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    ]"
  >
    <!-- Header Logo -->
    <div class="p-6 border-b border-reffinance-border flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <!-- Reffinance Custom Whistle Icon -->
        <span class="text-2xl font-extrabold text-reffinance-navy font-outfit flex items-center">
          <svg class="w-6 h-6 mr-2 text-reffinance-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18.5 4h-13a2.5 2.5 0 0 0-2.5 2.5v9a2.5 2.5 0 0 0 2.5 2.5h2.5L10 21l3.5-3h5a2.5 2.5 0 0 0 2.5-2.5v-9A2.5 2.5 0 0 0 18.5 4z"/>
            <path d="M7 9h6"/>
            <circle cx="15" cy="11" r="1"/>
          </svg>
          RefFinance
        </span>
      </div>
      <!-- Close Button (Mobile Only) -->
      <button 
        @click="$emit('close-sidebar')"
        class="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg md:hidden"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
      <router-link
        v-for="item in menuItems"
        :key="item.id"
        :to="item.path"
        :class="[
          'w-full flex items-center px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 relative',
          activeTab === item.id
            ? 'bg-slate-50 text-reffinance-navy active-nav-border font-bold'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
        ]"
      >
        <component :is="item.icon" class="w-5 h-5 mr-3 shrink-0" />
        {{ item.name }}
      </router-link>
    </nav>

    <!-- Bottom Actions -->
    <div class="p-4 border-t border-reffinance-border space-y-1">
      <button
        @click="alertConfig"
        class="w-full flex items-center px-4 py-3 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
      >
        <Settings class="w-5 h-5 mr-3 shrink-0" />
        Configuración
      </button>
      <button
        @click="alertLogout"
        class="w-full flex items-center px-4 py-3 rounded-lg text-sm font-semibold text-rose-500 hover:bg-rose-50/50 hover:text-rose-700 transition-colors"
      >
        <LogOut class="w-5 h-5 mr-3 shrink-0" />
        Cerrar Sesión
      </button>
    </div>
  </aside>
</template>

<script setup>
import { 
  LayoutDashboard, 
  HandCoins, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Settings, 
  LogOut,
  X
} from 'lucide-vue-next';

defineProps({
  activeTab: {
    type: String,
    required: true
  },
  isOpen: {
    type: Boolean,
    default: false
  }
});

defineEmits(['close-sidebar']);

const menuItems = [
  { id: 'tablero', name: 'Tablero', icon: LayoutDashboard, path: '/' },
  { id: 'prestamos', name: 'Gestión de Préstamos', icon: HandCoins, path: '/prestamos' },
  { id: 'caja', name: 'Control de Caja', icon: BookOpen, path: '/caja' },
  { id: 'arbitros', name: 'Árbitros', icon: Users, path: '/arbitros' },
  { id: 'reporte', name: 'Reporte Anual', icon: TrendingUp, path: '/reporte' }
];

const alertConfig = () => {
  alert('Sección de Configuración: Aquí puedes configurar los honorarios de ligas, roles y tasas de retención del grupo.');
};

const alertLogout = () => {
  if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
    alert('Sesión cerrada (Simulación).');
  }
};
</script>
