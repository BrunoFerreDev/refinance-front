<template>
  <aside
    :class="[
      'bg-white border-r border-reffinance-border h-screen flex flex-col justify-between select-none shrink-0 transition-all duration-300 ease-in-out fixed md:static inset-y-0 left-0 z-40 md:z-auto',
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      isCollapsed ? 'w-64 md:w-20' : 'w-64',
    ]"
  >
    <!-- Header Logo -->
    <div
      :class="[
        'p-6 border-b border-reffinance-border flex items-center',
        isCollapsed ? 'justify-center' : 'justify-between',
      ]"
    >
      <button
        @click="isCollapsed = !isCollapsed"
        class="flex items-center space-x-2 focus:outline-none hover:opacity-80 transition-opacity"
        :title="isCollapsed ? 'Expandir Sidebar' : 'Colapsar Sidebar'"
      >
        <!-- Reffinance Custom Whistle Icon -->
        <span
          :class="['font-extrabold text-reffinance-navy font-outfit flex items-center', isCollapsed ? '' : 'text-2xl']"
        >
          <svg
            :class="['text-reffinance-navy', isCollapsed ? 'w-8 h-8' : 'w-6 h-6 mr-2']"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M18.5 4h-13a2.5 2.5 0 0 0-2.5 2.5v9a2.5 2.5 0 0 0 2.5 2.5h2.5L10 21l3.5-3h5a2.5 2.5 0 0 0 2.5-2.5v-9A2.5 2.5 0 0 0 18.5 4z"
            />
            <path d="M7 9h6" />
            <circle cx="15" cy="11" r="1" />
          </svg>
          <span v-if="!isCollapsed">RefFinance</span>
        </span>
      </button>
      <!-- Close Button (Mobile Only) -->
      <button
        v-if="!isCollapsed"
        @click="$emit('close-sidebar')"
        class="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg md:hidden"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Navigation Menu -->
    <nav
      :class="[
        'flex-1 py-6 space-y-1.5 overflow-y-auto',
        isCollapsed ? 'px-2' : 'px-4',
      ]"
    >
      <router-link
        v-for="item in menuItems"
        :key="item.id"
        :to="item.path"
        :class="[
          'w-full flex items-center py-3 rounded-lg text-sm font-semibold transition-all duration-200 relative',
          isCollapsed ? 'justify-center px-0' : 'px-4',
          activeTab === item.id
            ? 'bg-slate-50 text-reffinance-navy active-nav-border font-bold'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800',
        ]"
        :title="isCollapsed ? item.name : ''"
      >
        <component
          :is="item.icon"
          :class="['w-5 h-5 shrink-0', isCollapsed ? '' : 'mr-3']"
        />
        <span v-if="!isCollapsed">{{ item.name }}</span>
      </router-link>
    </nav>

    <!-- Bottom Actions -->
    <div
      :class="[
        'p-4 border-t border-reffinance-border space-y-1',
        isCollapsed ? 'px-2' : 'px-4',
      ]"
    >
      <button
        @click="alertConfig"
        :class="[
          'w-full flex items-center py-3 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors',
          isCollapsed ? 'justify-center px-0' : 'px-4',
        ]"
        :title="isCollapsed ? 'Configuración' : ''"
      >
        <Settings :class="['w-5 h-5 shrink-0', isCollapsed ? '' : 'mr-3']" />
        <span v-if="!isCollapsed">Configuración</span>
      </button>
      <button
        @click="alertLogout"
        :class="[
          'w-full flex items-center py-3 rounded-lg text-sm font-semibold text-rose-500 hover:bg-rose-50/50 hover:text-rose-700 transition-colors',
          isCollapsed ? 'justify-center px-0' : 'px-4',
        ]"
        :title="isCollapsed ? 'Cerrar Sesión' : ''"
      >
        <LogOut :class="['w-5 h-5 shrink-0', isCollapsed ? '' : 'mr-3']" />
        <span v-if="!isCollapsed">Cerrar Sesión</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref } from "vue";
import {
  LayoutDashboard,
  HandCoins,
  BookOpen,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  X,
  Coins,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-vue-next";

defineProps({
  activeTab: {
    type: String,
    required: true,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["close-sidebar"]);

const isCollapsed = ref(false);

const menuItems = [
  { id: "tablero", name: "Tablero", icon: LayoutDashboard, path: "/" },
  {
    id: "prestamos",
    name: "Gestión de Préstamos",
    icon: HandCoins,
    path: "/prestamos",
  },
  { id: "caja", name: "Control de Caja", icon: BookOpen, path: "/caja" },
  { id: "arbitros", name: "Árbitros", icon: Users, path: "/arbitros" },
  {
    id: "aranceles",
    name: "Aranceles Arbitrales",
    icon: Coins,
    path: "/aranceles",
  },
  { id: "reporte", name: "Reporte Anual", icon: TrendingUp, path: "/reporte" },
];

const alertConfig = () => {
  alert(
    "Sección de Configuración: Aquí puedes configurar los honorarios de ligas, roles y tasas de retención del grupo.",
  );
};

const alertLogout = () => {
  if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
    alert("Sesión cerrada (Simulación).");
  }
};
</script>
